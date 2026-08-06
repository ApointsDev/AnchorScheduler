/**
 * 待办（Todo）与标签（Tag）API
 * 挂载于 /api → 路径为 /api/todos、/api/tags
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import {
    TagConflictError,
    TagNotFoundError,
} from "../Services/db/tags.js";
import { TodoNotFoundError } from "../Services/db/todos.js";
import { parsePriorityAxesBody } from "../Services/priorityAxes.js";
import type { AuthMiddleware } from "./apiRoutes.js";

function parseCsv(value: unknown): string[] | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    if (Array.isArray(value)) {
        return value.map(String).map((s) => s.trim()).filter(Boolean);
    }
    return String(value)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

function parseBool(value: unknown): boolean | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value === "boolean") return value;
    const s = String(value).toLowerCase();
    if (s === "true" || s === "1") return true;
    if (s === "false" || s === "0") return false;
    return undefined;
}

function parsePageOpts(query: any) {
    const limit = query.limit !== undefined ? Number(query.limit) : undefined;
    const offset =
        query.offset !== undefined
            ? Number(query.offset)
            : query.page !== undefined
              ? Math.max(0, (Number(query.page) - 1) * (limit || 50))
              : undefined;
    return {
        q: query.q ? String(query.q) : undefined,
        completed: parseBool(query.completed),
        tagIds: parseCsv(query.tagIds),
        tagNames: parseCsv(query.tagNames || query.tag),
        dueBefore: query.dueBefore ? String(query.dueBefore) : undefined,
        dueAfter: query.dueAfter ? String(query.dueAfter) : undefined,
        limit: Number.isFinite(limit as number) ? (limit as number) : undefined,
        offset: Number.isFinite(offset as number)
            ? (offset as number)
            : undefined,
        sortBy: query.sortBy ? String(query.sortBy) : undefined,
        order:
            query.order === "asc" || query.order === "desc"
                ? (query.order as "asc" | "desc")
                : undefined,
    };
}

export function initializeTodoRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    // ── Tags ──────────────────────────────────────────────────

    router.get("/tags", authenticateToken, async (req: any, res: any) => {
        try {
            const userId = req.user.id as string;
            const tags = await dbService.listTags(userId);
            res.json({ tags });
        } catch (e: any) {
            logger.error("GET /tags failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    });

    router.post("/tags", authenticateToken, async (req: any, res: any) => {
        try {
            const userId = req.user.id as string;
            const { name, color } = req.body || {};
            if (!name || typeof name !== "string" || !name.trim()) {
                return res.status(400).json({ error: "name is required" });
            }
            const tag = await dbService.createTag(userId, {
                name: name.trim(),
                color: color !== undefined ? String(color) : undefined,
            });
            res.status(201).json({ tag });
        } catch (e: any) {
            if (e instanceof TagConflictError) {
                return res.status(409).json({ error: "conflict", message: e.message });
            }
            logger.error("POST /tags failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    });

    router.get("/tags/:id", authenticateToken, async (req: any, res: any) => {
        try {
            const userId = req.user.id as string;
            const tag = await dbService.getTagById(userId, req.params.id);
            if (!tag) return res.status(404).json({ error: "Tag not found" });
            res.json({ tag });
        } catch (e: any) {
            logger.error("GET /tags/:id failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    });

    async function handleTagUpdate(req: any, res: any) {
        try {
            const userId = req.user.id as string;
            const { name, color } = req.body || {};
            const updates: { name?: string; color?: string | null } = {};
            if (name !== undefined) updates.name = String(name);
            if (color !== undefined) {
                updates.color = color === null ? null : String(color);
            }
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: "No fields to update" });
            }
            const tag = await dbService.updateTag(
                userId,
                req.params.id,
                updates,
            );
            res.json({ tag });
        } catch (e: any) {
            if (e instanceof TagNotFoundError || e?.name === "TagNotFoundError") {
                return res.status(404).json({ error: "Tag not found" });
            }
            if (e instanceof TagConflictError || e?.name === "TagConflictError") {
                return res
                    .status(409)
                    .json({ error: "conflict", message: e.message });
            }
            if (e.message === "Tag name is required") {
                return res.status(400).json({ error: e.message });
            }
            logger.error("update tag failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    }

    router.put("/tags/:id", authenticateToken, handleTagUpdate);
    router.patch("/tags/:id", authenticateToken, handleTagUpdate);

    router.delete(
        "/tags/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user.id as string;
                const ok = await dbService.deleteTag(userId, req.params.id);
                if (!ok) return res.status(404).json({ error: "Tag not found" });
                res.json({ id: req.params.id, deleted: true });
            } catch (e: any) {
                logger.error("DELETE /tags/:id failed:", e);
                res.status(500).json({ error: e.message || "Internal error" });
            }
        },
    );

    // 按标签反查待办
    router.get(
        "/tags/:id/todos",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user.id as string;
                const pageOpts = parsePageOpts(req.query);
                const { todos, total } = await dbService.getTodosByTagId(
                    userId,
                    req.params.id,
                    pageOpts,
                );
                res.json({
                    todos,
                    total,
                    limit: pageOpts.limit ?? 50,
                    offset: pageOpts.offset ?? 0,
                });
            } catch (e: any) {
                if (e instanceof TagNotFoundError) {
                    return res.status(404).json({ error: "Tag not found" });
                }
                logger.error("GET /tags/:id/todos failed:", e);
                res.status(500).json({ error: e.message || "Internal error" });
            }
        },
    );

    // ── Todos ─────────────────────────────────────────────────

    router.get("/todos", authenticateToken, async (req: any, res: any) => {
        try {
            const userId = req.user.id as string;
            const pageOpts = parsePageOpts(req.query);
            const { todos, total } = await dbService.getTodosPage(
                userId,
                pageOpts,
            );
            res.json({
                todos,
                total,
                limit: pageOpts.limit ?? 50,
                offset: pageOpts.offset ?? 0,
            });
        } catch (e: any) {
            if (e instanceof TagNotFoundError) {
                return res.status(400).json({ error: e.message });
            }
            logger.error("GET /todos failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    });

    router.post("/todos", authenticateToken, async (req: any, res: any) => {
        try {
            const userId = req.user.id as string;
            const body = req.body || {};
            if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
                return res.status(400).json({ error: "name is required" });
            }
            const tagIds =
                parseCsv(body.tagIds) ||
                (Array.isArray(body.tagIds) ? body.tagIds.map(String) : undefined);
            const tagNames =
                parseCsv(body.tagNames) ||
                (Array.isArray(body.tagNames)
                    ? body.tagNames.map(String)
                    : undefined);

            const todo = await dbService.createTodo(userId, {
                name: body.name.trim(),
                description:
                    body.description !== undefined
                        ? String(body.description)
                        : undefined,
                completed: Boolean(body.completed),
                dueDate: body.dueDate ? String(body.dueDate) : undefined,
                importance: body.importance
                    ? String(body.importance)
                    : undefined,
                importanceScore:
                    body.importanceScore !== undefined
                        ? Number(body.importanceScore)
                        : undefined,
                urgencyScore:
                    body.urgencyScore !== undefined
                        ? Number(body.urgencyScore)
                        : undefined,
                tagIds,
                tagNames,
            });
            res.status(201).json({ todo });
        } catch (e: any) {
            if (e instanceof TagNotFoundError) {
                return res.status(400).json({ error: e.message });
            }
            if (e.message === "Todo name is required") {
                return res.status(400).json({ error: e.message });
            }
            logger.error("POST /todos failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    });

    router.get("/todos/:id", authenticateToken, async (req: any, res: any) => {
        try {
            const userId = req.user.id as string;
            const todo = await dbService.getTodoById(userId, req.params.id);
            if (!todo) return res.status(404).json({ error: "Todo not found" });
            res.json({ todo });
        } catch (e: any) {
            logger.error("GET /todos/:id failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    });

    async function handleTodoUpdate(req: any, res: any) {
        try {
            const userId = req.user.id as string;
            const body = req.body || {};
            const updates: {
                name?: string;
                description?: string | null;
                completed?: boolean;
                dueDate?: string | null;
                importance?: string;
                importanceScore?: number | null;
                urgencyScore?: number | null;
                tagIds?: string[];
                tagNames?: string[];
                replaceTags?: boolean;
            } = {};

            if (body.name !== undefined) updates.name = String(body.name);
            if (body.description !== undefined) {
                updates.description =
                    body.description === null ? null : String(body.description);
            }
            if (body.completed !== undefined) {
                updates.completed = Boolean(body.completed);
            }
            if (body.dueDate !== undefined) {
                updates.dueDate =
                    body.dueDate === null || body.dueDate === ""
                        ? null
                        : String(body.dueDate);
            }
            if (body.importance !== undefined) {
                updates.importance = String(body.importance);
            }
            if (body.importanceScore !== undefined) {
                updates.importanceScore =
                    body.importanceScore === null
                        ? null
                        : Number(body.importanceScore);
            }
            if (body.urgencyScore !== undefined) {
                updates.urgencyScore =
                    body.urgencyScore === null
                        ? null
                        : Number(body.urgencyScore);
            }
            if (body.tagIds !== undefined || body.tagNames !== undefined) {
                updates.replaceTags = true;
                if (body.tagIds !== undefined) {
                    updates.tagIds = Array.isArray(body.tagIds)
                        ? body.tagIds.map(String)
                        : parseCsv(body.tagIds) || [];
                } else {
                    updates.tagIds = [];
                }
                if (body.tagNames !== undefined) {
                    updates.tagNames = Array.isArray(body.tagNames)
                        ? body.tagNames.map(String)
                        : parseCsv(body.tagNames) || [];
                } else {
                    updates.tagNames = [];
                }
            }

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: "No fields to update" });
            }

            const todo = await dbService.updateTodo(
                userId,
                req.params.id,
                updates,
            );
            res.json({ todo });
        } catch (e: any) {
            if (e instanceof TodoNotFoundError) {
                return res.status(404).json({ error: "Todo not found" });
            }
            if (e instanceof TagNotFoundError) {
                return res.status(400).json({ error: e.message });
            }
            if (e.message === "Todo name is required") {
                return res.status(400).json({ error: e.message });
            }
            logger.error("update todo failed:", e);
            res.status(500).json({ error: e.message || "Internal error" });
        }
    }

    router.put("/todos/:id", authenticateToken, handleTodoUpdate);
    router.patch("/todos/:id", authenticateToken, handleTodoUpdate);

    /**
     * 单独调整待办四象限双轴分数
     * PATCH /api/todos/:id/priority-axes
     * Body: { importanceScore?: number, urgencyScore?: number }  范围 -1..1
     */
    router.patch(
        "/todos/:id/priority-axes",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user.id as string;
                const parsed = parsePriorityAxesBody(req.body);
                if (!parsed.ok) {
                    return res.status(400).json({ error: parsed.error });
                }
                const todo = await dbService.updateTodo(userId, req.params.id, {
                    ...parsed.axes,
                });
                return res.status(200).json({
                    todo,
                    axes: {
                        importanceScore: todo.importanceScore ?? null,
                        urgencyScore: todo.urgencyScore ?? null,
                    },
                });
            } catch (e: any) {
                if (e instanceof TodoNotFoundError) {
                    return res.status(404).json({ error: "Todo not found" });
                }
                logger.error("PATCH /todos/:id/priority-axes failed:", e);
                return res.status(500).json({
                    error: e.message || "Failed to update priority axes",
                });
            }
        },
    );

    router.delete(
        "/todos/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user.id as string;
                const ok = await dbService.deleteTodo(userId, req.params.id);
                if (!ok) {
                    return res.status(404).json({ error: "Todo not found" });
                }
                res.json({ id: req.params.id, deleted: true });
            } catch (e: any) {
                logger.error("DELETE /todos/:id failed:", e);
                res.status(500).json({ error: e.message || "Internal error" });
            }
        },
    );

    // 替换待办标签
    router.put(
        "/todos/:id/tags",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user.id as string;
                const body = req.body || {};
                const tagIds = Array.isArray(body.tagIds)
                    ? body.tagIds.map(String)
                    : parseCsv(body.tagIds) || [];
                const tagNames = Array.isArray(body.tagNames)
                    ? body.tagNames.map(String)
                    : parseCsv(body.tagNames) || [];
                const todo = await dbService.updateTodo(userId, req.params.id, {
                    replaceTags: true,
                    tagIds,
                    tagNames,
                });
                res.json({ todo });
            } catch (e: any) {
                if (e instanceof TodoNotFoundError) {
                    return res.status(404).json({ error: "Todo not found" });
                }
                if (e instanceof TagNotFoundError) {
                    return res.status(400).json({ error: e.message });
                }
                logger.error("PUT /todos/:id/tags failed:", e);
                res.status(500).json({ error: e.message || "Internal error" });
            }
        },
    );

    // ── 待办审批队列（与 /schedule-queue 对齐）─────────────────

    router.get(
        "/todo-queue",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user.id as string;
                const queue = await dbService.getTodoQueueByUser(userId);
                res.json({ queue });
            } catch (e: any) {
                logger.error("GET /todo-queue failed:", e);
                res.status(500).json({ error: "获取待办队列失败" });
            }
        },
    );

    router.post(
        "/todo-queue/:id/approve",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user;
                const userId = user.id as string;
                const id = req.params.id as string;
                const row = await dbService.getTodoQueueById(id);
                if (!row) {
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                }
                if (row.userId !== userId) {
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });
                }

                let parsed: any = null;
                try {
                    parsed =
                        typeof row.rawRequest === "string"
                            ? JSON.parse(row.rawRequest)
                            : row.rawRequest;
                } catch {
                    parsed = null;
                }
                const args = parsed?.args || parsed || {};
                const name = String(args.name || args.title || "").trim();
                if (!name) {
                    await dbService.updateTodoQueueStatus(id, "failed");
                    return res
                        .status(422)
                        .json({ error: "Todo name is required" });
                }

                const todo = await dbService.createTodo(userId, {
                    name,
                    description:
                        args.description !== undefined
                            ? String(args.description)
                            : undefined,
                    dueDate: args.dueDate
                        ? String(args.dueDate)
                        : args.endTime
                          ? String(args.endTime)
                          : undefined,
                    importance: args.importance
                        ? String(args.importance)
                        : undefined,
                    importanceScore:
                        args.importanceScore !== undefined
                            ? Number(args.importanceScore)
                            : undefined,
                    urgencyScore:
                        args.urgencyScore !== undefined
                            ? Number(args.urgencyScore)
                            : undefined,
                    tagIds: Array.isArray(args.tagIds)
                        ? args.tagIds.map(String)
                        : undefined,
                    tagNames: Array.isArray(args.tagNames)
                        ? args.tagNames.map(String)
                        : undefined,
                });

                try {
                    await dbService.deleteTodoQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete todo queue item after approval, marking approved",
                        e,
                    );
                    await dbService.updateTodoQueueStatus(id, "approved");
                }

                const queue = await dbService.getTodoQueueByUser(userId);
                res.json({ todo, queue });
            } catch (e: any) {
                logger.error("Approving todo queue item failed:", e);
                res.status(500).json({ error: "Approve failed" });
            }
        },
    );

    router.post(
        "/todo-queue/:id/reject",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user.id as string;
                const id = req.params.id as string;
                const row = await dbService.getTodoQueueById(id);
                if (!row) {
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                }
                if (row.userId !== userId) {
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });
                }

                // 写入事件拒绝缓冲池（24h TTL），再移除队列项
                try {
                    await dbService.addRejectionBufferItem(
                        userId,
                        "todo",
                        row.rawRequest,
                        id,
                    );
                } catch (e) {
                    logger.warn(
                        "Failed to add todo rejection to buffer pool",
                        e,
                    );
                }

                try {
                    await dbService.deleteTodoQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete todo queue item after rejection, marking rejected",
                        e,
                    );
                    await dbService.updateTodoQueueStatus(id, "rejected");
                }

                const { logUserEvent } = await import(
                    "../Services/userLog.js"
                );
                await logUserEvent(
                    userId,
                    "external_todo_rejected",
                    `已拒绝外部待办请求`,
                    { queueId: id },
                );

                const queue = await dbService.getTodoQueueByUser(userId);
                res.json({ ok: true, queue });
            } catch (e: any) {
                logger.error("Rejecting todo queue item failed:", e);
                res.status(500).json({ error: "Reject failed" });
            }
        },
    );

    return router;
}
