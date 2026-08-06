// 日程队列审批路由
// 挂载于 /api → 路径为 /api/schedule-queue/*
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { mcpTools } from "../Services/mcp.js";
import { findConflictingTasks } from "../Services/scheduleConflict.js";
import {
    parseRecurrenceRuleInput,
    resolveScheduleType,
} from "../Services/types.js";
import { logUserEvent } from "../Services/userLog.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

export function registerScheduleQueueRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    const normalizeQueueScheduleArgs = (input: any) => {
        const args = { ...(input || {}) } as any;

        if (!args.name && args.title) args.name = args.title;
        if (!args.description && args.body) args.description = args.body;
        if (!args.location && args.place) args.location = args.place;

        const normalizeTimeValue = (value: any) => {
            if (!value) return value;
            if (typeof value === "string") return value;
            if (typeof value === "number") return new Date(value).toISOString();
            if (typeof value === "object") {
                if (typeof value.dateTime === "string") return value.dateTime;
                if (typeof value.start === "string") return value.start;
            }
            return value;
        };

        if (args.startTime && typeof args.startTime !== "string") {
            args.startTime = normalizeTimeValue(args.startTime);
        }
        if (args.endTime && typeof args.endTime !== "string") {
            args.endTime = normalizeTimeValue(args.endTime);
        }
        if (!args.startTime && (args.start || args.startDate)) {
            args.startTime = normalizeTimeValue(args.start ?? args.startDate);
        }
        if (!args.endTime && (args.end || args.endDate)) {
            args.endTime = normalizeTimeValue(args.end ?? args.endDate);
        }

        if (
            args.recurrence !== undefined &&
            args.recurrenceRule === undefined
        ) {
            args.recurrenceRule = args.recurrence;
            delete args.recurrence;
        }

        if (args.recurrenceRule !== undefined) {
            const parsedRecurrence = parseRecurrenceRuleInput(
                args.recurrenceRule,
            );
            if (parsedRecurrence) {
                args.recurrenceRule = parsedRecurrence;
            } else {
                delete args.recurrenceRule;
            }
        }

        try {
            const resolved = resolveScheduleType({
                explicit: args.scheduleType,
                recurrence: args.recurrenceRule,
                fallback: "single",
            });
            args.scheduleType = resolved.scheduleType;
            if (resolved.parsedRecurrence)
                args.recurrenceRule = resolved.parsedRecurrence;
        } catch (e) {
            const parsedRecurrence = parseRecurrenceRuleInput(
                args.recurrenceRule,
            );
            if (parsedRecurrence) {
                args.recurrenceRule = parsedRecurrence;
            } else {
                delete args.recurrenceRule;
            }
            const resolved = resolveScheduleType({
                explicit: undefined,
                recurrence: args.recurrenceRule,
                fallback: "single",
            });
            args.scheduleType = resolved.scheduleType;
        }

        return args;
    };

    router.get(
        "/schedule-queue",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                if (!user?.id)
                    return res
                        .status(401)
                        .json({ error: "未登录或无用户信息" });
                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ queue });
            } catch (err: any) {
                logger.error("获取日程队列失败:", err);
                res.status(500).json({ error: "获取队列失败" });
            }
        },
    );
    router.post(
        "/schedule-queue/:id/approve",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const id = req.params.id as string;
                const allowConflict = req?.body?.allowConflict === true;
                const row = await dbService.getScheduleQueueById(id);
                if (!row)
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                if (row.userId !== user.id)
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });

                const raw = row.rawRequest;
                let parsed: any = null;
                try {
                    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
                } catch (parseError) {
                    logger.warn(
                        "Failed to parse schedule queue rawRequest, using empty args",
                        parseError,
                    );
                }
                const args = parsed?.args || parsed || {};
                const normalizedArgs = normalizeQueueScheduleArgs(args);

                if (
                    !allowConflict &&
                    normalizedArgs.startTime &&
                    normalizedArgs.endTime &&
                    !normalizedArgs.recurrenceRule
                ) {
                    const { tasks: existingTasks } =
                        await dbService.getTasksPage(user.id, {
                            start: normalizedArgs.startTime,
                            end: normalizedArgs.endTime,
                            limit: 200,
                        });
                    const conflicts = findConflictingTasks(
                        existingTasks,
                        {
                            id: "new-task",
                            startTime: normalizedArgs.startTime,
                            endTime: normalizedArgs.endTime,
                        },
                        { boundaryConflict: !!user.conflictBoundaryInclusive },
                    );

                    if (conflicts.length > 0) {
                        return res
                            .status(409)
                            .json({ error: "日程冲突", conflicts });
                    }
                }

                // Call add_schedule with internal approval flag
                const result = await mcpTools.add_schedule.execute(
                    {
                        ...normalizedArgs,
                        _internal_approve: true,
                        _internal_allow_conflict: allowConflict,
                    },
                    user,
                );

                const createdTask = (result as any)?.task;
                const contentText = Array.isArray((result as any)?.content)
                    ? (result as any).content.find(
                          (c: any) => c?.type === "text",
                      )?.text
                    : undefined;

                if (!createdTask?.id) {
                    const message =
                        typeof contentText === "string"
                            ? contentText
                            : "Schedule approval did not create a task";
                    await dbService.updateScheduleQueueStatus(id, "failed");
                    await logUserEvent(
                        user.id,
                        "external_schedule_approve_failed",
                        `审批失败: ${message}`,
                        {
                            queueId: id,
                            reason: message,
                            args: normalizedArgs,
                        },
                    );
                    const queue = await dbService.getScheduleQueueByUser(
                        user.id,
                    );
                    return res
                        .status(422)
                        .json({ error: message, result, queue });
                }

                // Remove queue item (approved) and return latest queue
                try {
                    await dbService.deleteScheduleQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete schedule queue item after approval, will fallback to marking approved",
                        e,
                    );
                    await dbService.updateScheduleQueueStatus(id, "approved");
                }

                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ result, queue });
            } catch (err: any) {
                logger.error("Approving schedule queue item failed:", err);
                res.status(500).json({ error: "Approve failed" });
            }
        },
    );
    router.post(
        "/schedule-queue/:id/reject",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const id = req.params.id as string;
                const row = await dbService.getScheduleQueueById(id);
                if (!row)
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                if (row.userId !== user.id)
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });

                // 写入事件拒绝缓冲池（24h TTL），再移除队列项
                try {
                    await dbService.addRejectionBufferItem(
                        user.id,
                        "schedule",
                        row.rawRequest,
                        id,
                    );
                } catch (e) {
                    logger.warn(
                        "Failed to add schedule rejection to buffer pool",
                        e,
                    );
                }

                try {
                    await dbService.deleteScheduleQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete schedule queue item after rejection, will fallback to marking rejected",
                        e,
                    );
                    await dbService.updateScheduleQueueStatus(id, "rejected");
                }
                await logUserEvent(
                    user.id,
                    "external_schedule_rejected",
                    `已拒绝外部日程请求`,
                    { queueId: id },
                );
                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ ok: true, queue });
            } catch (err: any) {
                logger.error("Rejecting schedule queue item failed:", err);
                res.status(500).json({ error: "Reject failed" });
            }
        },
    );
}
