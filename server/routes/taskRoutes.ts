// 任务（Task）CRUD 与调度路由
// 挂载于 /api → 路径为 /api/tasks/*
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { User, Task } from "../index";
import { logger } from "../Utils/logger.js";
import { dbService } from "../Services/dbService.js";
import { findConflictingTasks } from "../Services/scheduleConflict.js";
import {
    generateRecurrenceInstances,
    buildRecurrenceSummary,
} from "../Services/recurrence.js";
import { resolveScheduleType } from "../Services/types.js";
import type { RecurrenceRule, ScheduleType } from "../Services/types";
import { broadcastTaskChange } from "../Services/websocket.js";
import { logUserEvent } from "../Services/userLog.js";
import {
    clampAxisScore,
    parsePriorityAxesBody,
    quadrantFromAxes,
    resolvePriorityAxes,
} from "../Services/priorityAxes.js";
import { resolveTaskMetadata } from "../Services/taskMetadata.js";
import type { AuthMiddleware } from "./apiTypes.js";

export function registerTaskRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    router.post("/tasks", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                name,
                description,
                startTime,
                endTime,
                dueDate,
                location,
                boundaryConflict,
                recurrenceRule: recurrenceRuleInput,
                importance,
                importanceScore,
                urgencyScore,
                scheduleType: scheduleTypeInput,
                visibility,
                authorizedUserIds,
                blockedUserIds,
            } = req.body || {};
            if (!name || !startTime || !endTime) {
                return res
                    .status(400)
                    .json({ error: "name, startTime, endTime required" });
            }
            let taskMetadata;
            try {
                taskMetadata = resolveTaskMetadata(req.body || {});
            } catch (error: any) {
                return res.status(400).json({ error: error.message });
            }
            let parsedRecurrence: RecurrenceRule | undefined;
            let resolvedScheduleType: ScheduleType;
            try {
                const resolved = resolveScheduleType({
                    explicit: scheduleTypeInput,
                    recurrence: recurrenceRuleInput,
                    fallback: "single",
                });
                parsedRecurrence = resolved.parsedRecurrence;
                resolvedScheduleType = resolved.scheduleType;
            } catch (err: any) {
                const msg = err?.message?.includes("recurrenceRule")
                    ? "Invalid recurrenceRule value"
                    : "Invalid scheduleType value";
                return res.status(400).json({ error: msg });
            }
            const axes = resolvePriorityAxes({
                importanceScore,
                urgencyScore,
                importance: importance || "normal",
                fillDefaults: true,
            });
            const task: Task = {
                id: uuidv4(),
                name,
                description: description || "",
                startTime,
                endTime,
                dueDate: dueDate || endTime,
                location,
                completed: false,
                pushedToMSTodo: false,
                importance: importance || "normal",
                ...taskMetadata,
                importanceScore: axes.importanceScore,
                urgencyScore: axes.urgencyScore,
                quadrant: quadrantFromAxes(
                    axes.importanceScore,
                    axes.urgencyScore,
                ),
                scheduleType: resolvedScheduleType,
                visibility: visibility || "private",
                authorizedUserIds: authorizedUserIds || undefined,
                blockedUserIds: blockedUserIds || undefined,
            };
            const effectiveBoundary =
                boundaryConflict !== undefined
                    ? !!boundaryConflict
                    : !!user.conflictBoundaryInclusive;
            if (parsedRecurrence)
                task.recurrenceRule = JSON.stringify(parsedRecurrence);

            // 冲突检测
            const conflicts = findConflictingTasks(user.tasks || [], task, {
                boundaryConflict: effectiveBoundary,
            });

            try {
                await dbService.addTask(user.id, task, effectiveBoundary, true);
            } catch (e: any) {
                throw e;
            }
            broadcastTaskChange("created", task, user.id);
            if (conflicts.length > 0) {
                await logUserEvent(
                    user.id,
                    "taskConflict",
                    `Created task with conflict ${task.name}`,
                    { id: task.id, conflicts: conflicts.map((c) => c.id) },
                );
            } else {
                await logUserEvent(
                    user.id,
                    "taskCreated",
                    `Created task ${task.name}`,
                    {
                        id: task.id,
                        startTime: task.startTime,
                        endTime: task.endTime,
                    },
                );
            }

            let createdChildren = 0,
                conflictChildren = 0,
                errorChildren = 0;
            const createdIds: string[] = [task.id];
            const instanceConflicts: any[] = [];

            if (parsedRecurrence) {
                const generated = generateRecurrenceInstances(
                    task,
                    parsedRecurrence,
                );
                for (const inst of generated) {
                    try {
                        const instConf = findConflictingTasks(
                            user.tasks || [],
                            inst,
                            { boundaryConflict: effectiveBoundary },
                        );
                        if (instConf.length > 0) {
                            instanceConflicts.push({
                                instance: {
                                    id: inst.id,
                                    startTime: inst.startTime,
                                    endTime: inst.endTime,
                                },
                                conflicts: instConf.map((c) => ({
                                    id: c.id,
                                    name: c.name,
                                    startTime: c.startTime,
                                    endTime: c.endTime,
                                })),
                            });
                            await logUserEvent(
                                user.id,
                                "taskConflict",
                                `Created recurrence instance with conflict ${inst.name}`,
                                {
                                    parentId: task.id,
                                    instanceStart: inst.startTime,
                                    instanceEnd: inst.endTime,
                                },
                            );
                        } else {
                            await logUserEvent(
                                user.id,
                                "taskCreated",
                                `Created recurrence instance ${inst.name}`,
                                {
                                    id: inst.id,
                                    parentTaskId: inst.parentTaskId,
                                    startTime: inst.startTime,
                                    endTime: inst.endTime,
                                },
                            );
                        }

                        await dbService.addTask(
                            user.id,
                            inst,
                            effectiveBoundary,
                            true,
                        );
                        createdChildren++;
                        createdIds.push(inst.id);
                        broadcastTaskChange("created", inst, user.id);
                    } catch (e: any) {
                        errorChildren++;
                        await logUserEvent(
                            user.id,
                            "taskError",
                            `Error creating recurrence instance for ${task.name}`,
                            { parentId: task.id, error: e?.message },
                        );
                    }
                }
            }
            // 增量刷新缓存：仅合并新建的任务
            await dbService.refreshUserTasksIncremental(user, {
                addedIds: createdIds,
            });
            const savedTask =
                (await dbService.getTaskById(task.id)) || task;
            return res.status(201).json({
                task: savedTask,
                recurrenceSummary: buildRecurrenceSummary(
                    parsedRecurrence,
                    createdChildren,
                    0,
                    errorChildren,
                ),
                conflictWarning:
                    conflicts.length > 0 || instanceConflicts.length > 0
                        ? {
                              message: "Task created with time conflicts",
                              conflicts: conflicts.map((c) => ({
                                  id: c.id,
                                  name: c.name,
                                  startTime: c.startTime,
                                  endTime: c.endTime,
                              })),
                              instanceConflicts,
                          }
                        : undefined,
            });
        } catch (error) {
            logger.error("Create task failed:", error);
            return res.status(500).json({ error: "Failed to create task" });
        }
    });
    router.post(
        "/tasks/conflicts",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { startTime, endTime, boundaryConflict } = req.body || {};
                if (!startTime || !endTime) {
                    return res
                        .status(400)
                        .json({ error: "startTime and endTime required" });
                }
                const candidate: Task = {
                    id: "candidate",
                    name: "candidate",
                    description: "",
                    startTime,
                    endTime,
                    dueDate: endTime,
                    completed: false,
                    pushedToMSTodo: false,
                };
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;
                const conflicts = findConflictingTasks(
                    user.tasks || [],
                    candidate,
                    { boundaryConflict: effectiveBoundary },
                );
                return res.status(200).json({ conflicts });
            } catch (error) {
                logger.error("Conflict pre-check failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to check conflicts" });
            }
        },
    );
    router.post(
        "/tasks/batch",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { tasks, boundaryConflict } = req.body || {};
                if (!Array.isArray(tasks) || tasks.length === 0) {
                    return res
                        .status(400)
                        .json({ error: "tasks array required" });
                }
                const results: any[] = [];
                let created = 0,
                    conflictsCount = 0,
                    errors = 0;
                const batchBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : undefined;

                for (const input of tasks) {
                    const {
                        name,
                        description,
                        startTime,
                        endTime,
                        dueDate,
                        location,
                        recurrenceRule: recurrenceRuleInput,
                        importance,
                        scheduleType: scheduleTypeInput,
                    } = input || {};
                    if (!name || !startTime || !endTime) {
                        results.push({
                            input,
                            status: "error",
                            errorMessage: "name, startTime, endTime required",
                        });
                        errors++;
                        continue;
                    }
                    let taskMetadata;
                    try {
                        taskMetadata = resolveTaskMetadata(input || {});
                    } catch (error: any) {
                        results.push({
                            input,
                            status: "error",
                            errorMessage: error.message,
                        });
                        errors++;
                        continue;
                    }
                    let parsedRecurrence: RecurrenceRule | undefined;
                    let resolvedScheduleType: ScheduleType;
                    try {
                        const resolved = resolveScheduleType({
                            explicit: scheduleTypeInput,
                            recurrence: recurrenceRuleInput,
                            fallback: "single",
                        });
                        parsedRecurrence = resolved.parsedRecurrence;
                        resolvedScheduleType = resolved.scheduleType;
                    } catch (err: any) {
                        const errorMessage = err?.message?.includes(
                            "recurrenceRule",
                        )
                            ? "Invalid recurrenceRule value"
                            : "Invalid scheduleType value";
                        results.push({ input, status: "error", errorMessage });
                        errors++;
                        continue;
                    }
                    const effectiveBoundary =
                        input.boundaryConflict !== undefined
                            ? !!input.boundaryConflict
                            : batchBoundary !== undefined
                              ? batchBoundary
                              : !!user.conflictBoundaryInclusive;
                    const task: Task = {
                        id: uuidv4(),
                        name,
                        description: description || "",
                        startTime,
                        endTime,
                        dueDate: dueDate || endTime,
                        location,
                        completed: false,
                        pushedToMSTodo: false,
                        importance: importance || "normal",
                        ...taskMetadata,
                        scheduleType: resolvedScheduleType,
                    };
                    if (parsedRecurrence)
                        task.recurrenceRule = JSON.stringify(parsedRecurrence);

                    const conflicts = findConflictingTasks(
                        user.tasks || [],
                        task,
                        { boundaryConflict: effectiveBoundary },
                    );

                    try {
                        await dbService.addTask(
                            user.id,
                            task,
                            effectiveBoundary,
                            true,
                        );
                        broadcastTaskChange("created", task, user.id);

                        if (conflicts.length > 0) {
                            await logUserEvent(
                                user.id,
                                "taskConflict",
                                `Batch created task with conflict ${task.name}`,
                                {
                                    id: task.id,
                                    startTime: task.startTime,
                                    endTime: task.endTime,
                                },
                            );
                        } else {
                            await logUserEvent(
                                user.id,
                                "taskCreated",
                                `Batch created task ${task.name}`,
                                {
                                    id: task.id,
                                    startTime: task.startTime,
                                    endTime: task.endTime,
                                },
                            );
                        }

                        let createdChildren = 0,
                            conflictChildren = 0,
                            errorChildren = 0;
                        const createdIds: string[] = [task.id];
                        const instanceConflicts: any[] = [];

                        if (parsedRecurrence) {
                            const generated = generateRecurrenceInstances(
                                task,
                                parsedRecurrence,
                            );
                            for (const inst of generated) {
                                try {
                                    const instConf = findConflictingTasks(
                                        user.tasks || [],
                                        inst,
                                        { boundaryConflict: effectiveBoundary },
                                    );
                                    if (instConf.length > 0) {
                                        instanceConflicts.push({
                                            instance: {
                                                id: inst.id,
                                                startTime: inst.startTime,
                                                endTime: inst.endTime,
                                            },
                                            conflicts: instConf.map((c) => ({
                                                id: c.id,
                                                name: c.name,
                                                startTime: c.startTime,
                                                endTime: c.endTime,
                                            })),
                                        });
                                        await logUserEvent(
                                            user.id,
                                            "taskConflict",
                                            `Batch created recurrence instance with conflict ${inst.name}`,
                                            {
                                                parentId: task.id,
                                                instanceStart: inst.startTime,
                                                instanceEnd: inst.endTime,
                                            },
                                        );
                                    } else {
                                        await logUserEvent(
                                            user.id,
                                            "taskCreated",
                                            `Batch created recurrence instance ${inst.name}`,
                                            {
                                                id: inst.id,
                                                parentTaskId: inst.parentTaskId,
                                                startTime: inst.startTime,
                                                endTime: inst.endTime,
                                            },
                                        );
                                    }

                                    await dbService.addTask(
                                        user.id,
                                        inst,
                                        effectiveBoundary,
                                        true,
                                    );
                                    createdChildren++;
                                    createdIds.push(inst.id);
                                    broadcastTaskChange(
                                        "created",
                                        inst,
                                        user.id,
                                    );
                                } catch (e: any) {
                                    errorChildren++;
                                    await logUserEvent(
                                        user.id,
                                        "taskError",
                                        `Error creating batch instance for ${task.name}`,
                                        {
                                            parentId: task.id,
                                            error: e?.message,
                                        },
                                    );
                                }
                            }
                            const savedTask =
                                (await dbService.getTaskById(task.id)) || task;
                            results.push({
                                input,
                                status: "created",
                                task: savedTask,
                                recurrenceSummary: buildRecurrenceSummary(
                                    parsedRecurrence,
                                    createdChildren,
                                    0,
                                    errorChildren,
                                ),
                                conflictWarning:
                                    conflicts.length > 0 ||
                                    instanceConflicts.length > 0
                                        ? {
                                              message:
                                                  "Task created with time conflicts",
                                              conflicts: conflicts.map((c) => ({
                                                  id: c.id,
                                                  name: c.name,
                                                  startTime: c.startTime,
                                                  endTime: c.endTime,
                                              })),
                                              instanceConflicts,
                                          }
                                        : undefined,
                            });
                        } else {
                            const savedTask =
                                (await dbService.getTaskById(task.id)) || task;
                            results.push({
                                input,
                                status: "created",
                                task: savedTask,
                                conflictWarning:
                                    conflicts.length > 0
                                        ? {
                                              message:
                                                  "Task created with time conflicts",
                                              conflicts: conflicts.map((c) => ({
                                                  id: c.id,
                                                  name: c.name,
                                                  startTime: c.startTime,
                                                  endTime: c.endTime,
                                              })),
                                          }
                                        : undefined,
                            });
                        }
                        // 增量刷新缓存：合并新建 id
                        await dbService.refreshUserTasksIncremental(user, {
                            addedIds: createdIds,
                        });
                        created++;
                    } catch (e: any) {
                        errors++;
                        results.push({
                            input,
                            status: "error",
                            errorMessage: e?.message || "unknown error",
                        });
                        await logUserEvent(
                            user.id,
                            "taskError",
                            `Error creating task ${name}`,
                            { startTime, endTime, error: e?.message },
                        );
                    }
                }
                return res.status(200).json({
                    results,
                    summary: {
                        total: tasks.length,
                        created,
                        conflicts: 0,
                        errors,
                    }, // conflicts count is 0 because we created them
                });
            } catch (error) {
                logger.error("Batch task creation failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to create batch tasks" });
            }
        },
    );
    router.get("/tasks/:id", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const taskId = req.params.id as string;
            const ownedTasks = await dbService.getTasksByUserId(user.id);
            const task = ownedTasks.find((item) => item.id === taskId);
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            return res.status(200).json(task);
        } catch (error) {
            logger.error("GET /tasks/:id failed:", error);
            return res.status(500).json({ error: "Failed to fetch task" });
        }
    });
    router.put("/tasks/:id", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const taskId = req.params.id;
            // 以数据库为准，避免 userCache 中 tasks 缺双轴/象限导致写回旧值
            const existing = await dbService.getTaskById(taskId);
            if (!existing)
                return res.status(404).json({ error: "task not found" });
            const owned = (user.tasks || []).some((t) => t.id === taskId);
            if (!owned) {
                // 缓存未命中时回退查库归属
                const all = await dbService.getTasksByUserId(user.id);
                if (!all.some((t) => t.id === taskId)) {
                    return res.status(404).json({ error: "task not found" });
                }
            }
            const {
                name,
                description,
                startTime,
                endTime,
                dueDate,
                location,
                completed,
                boundaryConflict,
                importance,
                importanceScore,
                urgencyScore,
                recurrenceRule: recurrenceRuleInput,
                scheduleType: scheduleTypeInput,
                visibility,
                authorizedUserIds,
                blockedUserIds,
                eventType,
                category,
                allDay,
                isReminderOn,
                reminderMinutesBefore,
                attachments,
                allocatedMinutes,
            } = req.body || {};
            const recurrenceSource =
                recurrenceRuleInput !== undefined
                    ? recurrenceRuleInput
                    : existing.recurrenceRule;
            let parsedRecurrence: RecurrenceRule | undefined;
            let resolvedScheduleType: ScheduleType;
            try {
                const resolved = resolveScheduleType({
                    explicit: scheduleTypeInput,
                    recurrence: recurrenceSource,
                    fallback: existing.scheduleType || "single",
                });
                parsedRecurrence = resolved.parsedRecurrence;
                resolvedScheduleType = resolved.scheduleType;
            } catch (err: any) {
                const msg = err?.message?.includes("recurrenceRule")
                    ? "Invalid recurrenceRule value"
                    : "Invalid scheduleType value";
                return res.status(400).json({ error: msg });
            }
            const recurrenceString =
                recurrenceRuleInput !== undefined
                    ? parsedRecurrence
                        ? JSON.stringify(parsedRecurrence)
                        : undefined
                    : existing.recurrenceRule;

            const nextImportance =
                importance !== undefined ? importance : existing.importance;
            const axesTouched =
                importanceScore !== undefined || urgencyScore !== undefined;
            const nextImpScore =
                importanceScore !== undefined
                    ? clampAxisScore(importanceScore)
                    : (existing.importanceScore ?? null);
            const nextUrgScore =
                urgencyScore !== undefined
                    ? clampAxisScore(urgencyScore)
                    : (existing.urgencyScore ?? null);
            // 双轴有更新时强制重算象限，忽略 body 里可能带来的旧 quadrant
            const nextQuadrant = axesTouched
                ? quadrantFromAxes(nextImpScore, nextUrgScore) ||
                  existing.quadrant
                : existing.quadrant;
            let taskMetadata;
            try {
                taskMetadata = resolveTaskMetadata(
                    {
                        ...(eventType !== undefined ? { eventType } : {}),
                        ...(category !== undefined ? { category } : {}),
                        ...(allDay !== undefined ? { allDay } : {}),
                        ...(isReminderOn !== undefined ? { isReminderOn } : {}),
                        ...(reminderMinutesBefore !== undefined
                            ? { reminderMinutesBefore }
                            : {}),
                        ...(attachments !== undefined ? { attachments } : {}),
                        ...(allocatedMinutes !== undefined
                            ? { allocatedMinutes }
                            : {}),
                    },
                    existing,
                );
            } catch (error: any) {
                return res.status(400).json({ error: error.message });
            }

            // 构建更新后的任务对象（不直接修改原对象，先复制）
            const updated: Task = {
                ...existing,
                ...taskMetadata,
                name: name !== undefined ? name : existing.name,
                description:
                    description !== undefined
                        ? description
                        : existing.description,
                startTime:
                    startTime !== undefined ? startTime : existing.startTime,
                endTime: endTime !== undefined ? endTime : existing.endTime,
                dueDate: dueDate !== undefined ? dueDate : existing.dueDate,
                location: location !== undefined ? location : existing.location,
                completed:
                    completed !== undefined ? !!completed : existing.completed,
                importance: nextImportance,
                importanceScore: nextImpScore,
                urgencyScore: nextUrgScore,
                quadrant: nextQuadrant,
                scheduleType: resolvedScheduleType,
                recurrenceRule: recurrenceString,
                visibility: visibility !== undefined ? visibility : existing.visibility,
                authorizedUserIds: authorizedUserIds !== undefined ? authorizedUserIds : existing.authorizedUserIds,
                blockedUserIds: blockedUserIds !== undefined ? blockedUserIds : existing.blockedUserIds,
            };
            try {
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;

                // 冲突检测
                const conflicts = findConflictingTasks(
                    user.tasks.filter((t) => t.id !== updated.id),
                    updated,
                    { boundaryConflict: effectiveBoundary },
                );

                await dbService.updateTask(updated, effectiveBoundary, true);
                // 写库后再读，保证响应中的双轴/象限与持久化一致
                const saved =
                    (await dbService.getTaskById(taskId)) || updated;
                broadcastTaskChange("updated", saved, user.id);

                if (conflicts.length > 0) {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Updated task with conflict ${saved.name}`,
                        {
                            id: saved.id,
                            changes: {
                                name,
                                description,
                                startTime,
                                endTime,
                                dueDate,
                                location,
                                completed,
                                importance,
                                importanceScore,
                                urgencyScore,
                            },
                            conflicts: conflicts.map((c) => c.id),
                        },
                    );
                } else {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Updated task ${saved.name}`,
                        {
                            id: saved.id,
                            changes: {
                                name,
                                description,
                                startTime,
                                endTime,
                                dueDate,
                                location,
                                completed,
                                importance,
                                importanceScore,
                                urgencyScore,
                            },
                        },
                    );
                }

                if (completed === true && !existing.completed) {
                    broadcastTaskChange("completed", saved, user.id);
                    await logUserEvent(
                        user.id,
                        "taskCompleted",
                        `Completed task ${saved.name}`,
                        { id: saved.id },
                    );
                }
                // 增量刷新缓存：仅合并被更新的任务
                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [saved.id],
                });
                return res.status(200).json({
                    task: saved,
                    axes: {
                        importanceScore: saved.importanceScore ?? null,
                        urgencyScore: saved.urgencyScore ?? null,
                        quadrant: saved.quadrant,
                    },
                    conflictWarning:
                        conflicts.length > 0
                            ? {
                                  message: "Task updated with time conflicts",
                                  conflicts: conflicts.map((c) => ({
                                      id: c.id,
                                      name: c.name,
                                      startTime: c.startTime,
                                      endTime: c.endTime,
                                  })),
                              }
                            : undefined,
                });
            } catch (e: any) {
                logger.error("Failed to update task:", e);
                return res.status(500).json({ error: "Failed to update task" });
            }
        } catch (error) {
            logger.error("Unexpected error in PUT /tasks/:id:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
    router.patch(
        "/tasks/:id/priority-axes",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id as string;
                const parsed = parsePriorityAxesBody(req.body);
                if (!parsed.ok) {
                    return res.status(400).json({ error: parsed.error });
                }

                const existing = await dbService.getTaskById(taskId);
                if (!existing) {
                    return res.status(404).json({ error: "Task not found" });
                }
                // 归属校验：任务须属于当前用户
                const userTasks = await dbService.getTasksByUserId(user.id);
                if (!userTasks.some((t) => t.id === taskId)) {
                    return res.status(403).json({ error: "Not your task" });
                }

                const patch: Partial<Task> = { ...parsed.axes };
                const imp =
                    patch.importanceScore !== undefined
                        ? patch.importanceScore
                        : (existing.importanceScore ?? null);
                const urg =
                    patch.urgencyScore !== undefined
                        ? patch.urgencyScore
                        : (existing.urgencyScore ?? null);
                const q = quadrantFromAxes(imp ?? null, urg ?? null);
                // 始终用服务端派生象限，防止客户端乐观更新残留旧 quadrant
                if (q) patch.quadrant = q;

                await dbService.patchTask(user.id, taskId, patch);
                // 二次读库，确保响应 = 持久化真值
                const task =
                    (await dbService.getTaskById(taskId)) ||
                    ({ ...existing, ...patch, id: taskId } as Task);
                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [taskId],
                });
                broadcastTaskChange("updated", task, user.id);
                return res.status(200).json({
                    task,
                    axes: {
                        importanceScore: task.importanceScore ?? null,
                        urgencyScore: task.urgencyScore ?? null,
                        quadrant:
                            task.quadrant ||
                            quadrantFromAxes(
                                task.importanceScore ?? null,
                                task.urgencyScore ?? null,
                            ),
                    },
                });
            } catch (error: any) {
                logger.error("PATCH /tasks/:id/priority-axes failed:", error);
                return res.status(500).json({
                    error: error.message || "Failed to update priority axes",
                });
            }
        },
    );
    router.patch(
        "/tasks/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id;
                const rawUpdates = req.body || {};
                const allowedFields = new Set([
                    "name",
                    "description",
                    "dueDate",
                    "startTime",
                    "endTime",
                    "location",
                    "completed",
                    "importance",
                    "importanceScore",
                    "urgencyScore",
                    "recurrenceRule",
                    "scheduleType",
                    "visibility",
                    "authorizedUserIds",
                    "blockedUserIds",
                    "eventType",
                    "category",
                    "allDay",
                    "isReminderOn",
                    "reminderMinutesBefore",
                    "attachments",
                    "allocatedMinutes",
                    "boundaryConflict",
                ]);
                const unsupportedFields = Object.keys(rawUpdates).filter(
                    (field) => !allowedFields.has(field),
                );
                if (unsupportedFields.length > 0) {
                    return res.status(400).json({
                        error: `Unsupported task fields: ${unsupportedFields.join(", ")}`,
                    });
                }
                const updates = { ...rawUpdates };

                if (Object.keys(updates).length === 0) {
                    return res
                        .status(400)
                        .json({ error: "No update fields provided" });
                }

                const boundaryConflict = updates.boundaryConflict;
                delete updates.boundaryConflict;

                const existingTask = await dbService.getTaskById(taskId);
                if (!existingTask) {
                    return res.status(404).json({ error: "Task not found" });
                }
                const ownedTasks = await dbService.getTasksByUserId(user.id);
                if (!ownedTasks.some((task) => task.id === taskId)) {
                    return res.status(404).json({ error: "Task not found" });
                }
                const structuredFields = [
                    "eventType",
                    "category",
                    "allDay",
                    "isReminderOn",
                    "reminderMinutesBefore",
                    "attachments",
                    "allocatedMinutes",
                ];
                if (
                    structuredFields.some((field) =>
                        Object.prototype.hasOwnProperty.call(updates, field),
                    )
                ) {
                    try {
                        Object.assign(
                            updates,
                            resolveTaskMetadata(updates, existingTask),
                        );
                    } catch (error: any) {
                        return res.status(400).json({ error: error.message });
                    }
                }

                const scheduleTypeExplicit = updates.scheduleType;
                const recurrenceProvided = Object.prototype.hasOwnProperty.call(
                    updates,
                    "recurrenceRule",
                );
                const recurrenceSource = recurrenceProvided
                    ? updates.recurrenceRule
                    : existingTask.recurrenceRule;
                let parsedRecurrence: RecurrenceRule | undefined;
                let resolvedScheduleType: ScheduleType;
                try {
                    const resolved = resolveScheduleType({
                        explicit: scheduleTypeExplicit,
                        recurrence: recurrenceSource,
                        fallback: existingTask.scheduleType || "single",
                    });
                    parsedRecurrence = resolved.parsedRecurrence;
                    resolvedScheduleType = resolved.scheduleType;
                } catch (err: any) {
                    const msg = err?.message?.includes("recurrenceRule")
                        ? "Invalid recurrenceRule value"
                        : "Invalid scheduleType value";
                    return res.status(400).json({ error: msg });
                }

                if (recurrenceProvided) {
                    updates.recurrenceRule = parsedRecurrence
                        ? JSON.stringify(parsedRecurrence)
                        : null;
                }
                if (scheduleTypeExplicit !== undefined || recurrenceProvided) {
                    updates.scheduleType = resolvedScheduleType;
                }

                const wasCompleted = existingTask.completed;

                await dbService.patchTask(
                    user.id,
                    taskId,
                    updates,
                    boundaryConflict,
                    true,
                );
                // 写后再读，避免响应里是合并前的旧派生字段
                const updatedTask =
                    (await dbService.getTaskById(taskId)) ||
                    ({ ...existingTask, ...updates, id: taskId } as Task);

                // 冲突检测 (需要构建完整的对象)
                const fullUpdatedTask = updatedTask;
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;
                let conflicts: any[] = [];
                if (updates.startTime || updates.endTime) {
                    const others =
                        user.tasks?.filter((t) => t.id !== taskId) ||
                        (await dbService.getTasksByUserId(user.id)).filter(
                            (t) => t.id !== taskId,
                        );
                    conflicts = findConflictingTasks(others, fullUpdatedTask, {
                        boundaryConflict: effectiveBoundary,
                    });
                }

                broadcastTaskChange("updated", updatedTask, user.id);

                if (conflicts.length > 0) {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Patched task with conflict ${updatedTask.name}`,
                        {
                            id: updatedTask.id,
                            changes: updates,
                            conflicts: conflicts.map((c) => c.id),
                        },
                    );
                } else {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Patched task ${updatedTask.name}`,
                        { id: updatedTask.id, changes: updates },
                    );
                }

                if (updates.completed === true && !wasCompleted) {
                    broadcastTaskChange("completed", updatedTask, user.id);
                    await logUserEvent(
                        user.id,
                        "taskCompleted",
                        `Completed task ${updatedTask.name}`,
                        { id: updatedTask.id },
                    );
                }

                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [taskId],
                });

                const response: any = {
                    task: updatedTask,
                    axes: {
                        importanceScore: updatedTask.importanceScore ?? null,
                        urgencyScore: updatedTask.urgencyScore ?? null,
                        quadrant: updatedTask.quadrant,
                    },
                };
                if (conflicts.length > 0) {
                    response.conflictWarning = {
                        message: "Task patched with time conflicts",
                        conflicts: conflicts.map((c) => ({
                            id: c.id,
                            name: c.name,
                            startTime: c.startTime,
                            endTime: c.endTime,
                        })),
                    };
                }
                return res.status(200).json(response);
            } catch (error: any) {
                logger.error("Patch task failed:", error);
                return res.status(500).json({ error: "Failed to patch task" });
            }
        },
    );
    router.delete(
        "/tasks/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id;
                const existingIndex = user.tasks.findIndex(
                    (t) => t.id === taskId,
                );
                if (existingIndex < 0)
                    return res.status(404).json({ error: "task not found" });
                const cascade =
                    (req.query.cascade || "false").toString().toLowerCase() ===
                    "true";
                if (!cascade) {
                    const deletedTask = user.tasks[existingIndex];
                    const deletedOk = await dbService.deleteTask(taskId);
                    if (deletedOk) {
                        broadcastTaskChange("deleted", deletedTask, user.id);
                        await logUserEvent(
                            user.id,
                            "taskDeleted",
                            `Deleted task ${deletedTask.name}`,
                            { id: deletedTask.id },
                        );
                        // 增量刷新缓存：移除已删除 id
                        await dbService.refreshUserTasksIncremental(user, {
                            deletedIds: [taskId],
                        });
                        return res
                            .status(200)
                            .json({ id: taskId, deleted: true });
                    }
                    return res
                        .status(500)
                        .json({ error: "Failed to delete task" });
                } else {
                    // 级联删除：删除根任务和所有 parentTaskId 指向它的子实例
                    const toDeleteIds = new Set<string>();
                    toDeleteIds.add(taskId);
                    // 收集子实例
                    for (const t of user.tasks) {
                        if (t.parentTaskId === taskId) toDeleteIds.add(t.id);
                    }
                    const deletedItems: Task[] = [];
                    let anyFailed = false;
                    for (const id of Array.from(toDeleteIds)) {
                        try {
                            const ok = await dbService.deleteTask(id);
                            if (ok) {
                                const item = user.tasks.find(
                                    (tt) => tt.id === id,
                                );
                                if (item) deletedItems.push(item);
                            } else {
                                anyFailed = true;
                            }
                        } catch (e) {
                            anyFailed = true;
                        }
                    }
                    // 广播已删除项
                    for (const del of deletedItems) {
                        broadcastTaskChange("deleted", del, user.id);
                        await logUserEvent(
                            user.id,
                            "taskDeleted",
                            `Cascade deleted task ${del.name}`,
                            { id: del.id, parentId: del.parentTaskId || null },
                        );
                    }
                    if (anyFailed)
                        return res.status(500).json({
                            error: "Failed to fully delete cascade tasks",
                        });
                    // 增量刷新缓存：移除已删除的所有 id
                    await dbService.refreshUserTasksIncremental(user, {
                        deletedIds: Array.from(toDeleteIds),
                    });
                    return res.status(200).json({
                        id: taskId,
                        deleted: true,
                        cascadeDeleted: true,
                        count: toDeleteIds.size,
                    });
                }
            } catch (error) {
                logger.error("Unexpected error in DELETE /tasks/:id:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        },
    );
    router.get("/tasks", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                start,
                end,
                limit = "50",
                offset,
                page,
                q,
                completed,
                sortBy,
                order,
            } = req.query;
            const limNum = Math.max(
                1,
                Math.min(200, parseInt((limit as string) || "50", 10) || 50),
            );
            let offNum = 0;
            if (typeof page !== "undefined") {
                const pageNum = Math.max(0, parseInt(page as string, 10) || 0);
                offNum = pageNum * limNum;
            } else {
                offNum = Math.max(
                    0,
                    parseInt((offset as string) || "0", 10) || 0,
                );
            }

            const parsedCompleted =
                typeof completed === "string"
                    ? completed.toLowerCase() === "true"
                    : undefined;
            const parsedOrder =
                order && (order as string).toLowerCase() === "desc"
                    ? "desc"
                    : "asc";
            const opts: {
                start?: string;
                end?: string;
                q?: string;
                completed?: boolean;
                limit: number;
                offset: number;
                sortBy?: string;
                order?: "asc" | "desc";
            } = {
                start: start as string | undefined,
                end: end as string | undefined,
                q: q as string | undefined,
                completed: parsedCompleted as boolean | undefined,
                limit: limNum,
                offset: offNum,
                sortBy: sortBy as string | undefined,
                order: parsedOrder,
            };
            const { tasks, total } = await dbService.getTasksPage(
                user.id,
                opts,
            );
            return res.status(200).json({
                tasks,
                total,
                limit: limNum,
                offset: offNum,
                sortBy: opts.sortBy || "startTime",
                order: opts.order || "asc",
            });
        } catch (error) {
            logger.error("Failed to list tasks:", error);
            return res.status(500).json({ error: "Failed to list tasks" });
        }
    });
    router.get(
        "/tasks/parents",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                // 拉取所有任务并筛选父任务
                const { tasks } = await dbService.getTasksPage(user.id, {
                    limit: 1000,
                });
                const parents = tasks.filter(
                    (t) => t.recurrenceRule && !t.parentTaskId,
                );

                const result: any[] = [];
                for (const p of parents) {
                    try {
                        const { occurrences, total } =
                            await dbService.getOccurrencesPage(user.id, p.id, {
                                limit: 1000,
                            });
                        result.push({ parentTask: p, occurrences, total });
                    } catch (e) {
                        // 如果某个父任务查询失败，仍继续处理其它任务
                        result.push({
                            parentTask: p,
                            occurrences: [],
                            total: 0,
                            error: (e as Error).message,
                        });
                    }
                }

                return res.status(200).json({ parents: result });
            } catch (error) {
                logger.error("Failed to list parent tasks:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to list parent tasks" });
            }
        },
    );
    router.get(
        "/tasks/:id/occurrences",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const rootId = req.params.id;
                const {
                    limit = "50",
                    offset,
                    page,
                    sortBy = "startTime",
                    order = "asc",
                } = req.query;
                const limNum = Math.max(
                    1,
                    Math.min(
                        500,
                        parseInt((limit as string) || "50", 10) || 50,
                    ),
                );
                let offNum = 0;
                if (typeof page !== "undefined") {
                    const pageNum = Math.max(
                        0,
                        parseInt(page as string, 10) || 0,
                    );
                    offNum = pageNum * limNum;
                } else {
                    offNum = Math.max(
                        0,
                        parseInt((offset as string) || "0", 10) || 0,
                    );
                }

                const root = await dbService.getTaskById(rootId);
                if (!root)
                    return res.status(404).json({ error: "Task not found" });
                const parsedOrder =
                    order && (order as string).toLowerCase() === "desc"
                        ? "desc"
                        : "asc";
                const { occurrences, total } =
                    await dbService.getOccurrencesPage(user.id, rootId, {
                        limit: limNum,
                        offset: offNum,
                        sortBy: sortBy as string,
                        order: parsedOrder,
                    });
                return res.status(200).json({
                    rootTask: root,
                    occurrences,
                    total,
                    limit: limNum,
                    offset: offNum,
                    sortBy: sortBy || "startTime",
                    order: order || "asc",
                });
            } catch (e) {
                logger.error("Fetch occurrences failed", e);
                return res
                    .status(500)
                    .json({ error: "Failed to fetch occurrences" });
            }
        },
    ); // 获取当前用户的日程队列
}
