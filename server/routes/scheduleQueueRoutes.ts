// 日程队列审批路由
// 挂载于 /api → 路径为 /api/schedule-queue/*
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { mcpTools } from "../Services/mcp.js";
import { findConflictingTasks } from "../Services/scheduleConflict.js";
import {
    normalizeQueueScheduleArgs,
    parseQueueArgs,
} from "../Services/queueArgs.js";
import { logUserEvent } from "../Services/userLog.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

export function registerScheduleQueueRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
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

                const args = parseQueueArgs(row);
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
