/**
 * 事件拒绝缓冲池 API
 * 挂载于 /api → 查询 24 小时内用户拒绝的日程 / 待办
 *
 * - GET /api/rejection-buffer              全部（日程 + 待办）
 * - GET /api/rejection-buffer/schedules    仅日程
 * - GET /api/rejection-buffer/todos        仅待办
 *
 * Query: hours?  回看小时数，默认 24，范围 1–24
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import {
    clampRejectionHours,
    type RejectionKind,
} from "../Services/db/rejectionBuffer.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiRoutes.js";

function parseHoursQuery(q: unknown): number {
    if (Array.isArray(q)) return clampRejectionHours(q[0] as string);
    return clampRejectionHours(q as string | number | undefined);
}

export function initializeRejectionBufferRoutes(
    authenticateToken: AuthMiddleware,
) {
    const router = express.Router();

    async function handleList(
        req: any,
        res: any,
        kind?: RejectionKind,
    ): Promise<void> {
        try {
            const user = req.user;
            if (!user?.id) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const hours = parseHoursQuery(req.query.hours);
            const result = await dbService.getRejectionBuffer(user.id, {
                kind,
                hours,
            });

            if (kind === "schedule") {
                res.status(200).json({
                    hours: result.hours,
                    since: result.since,
                    schedules: result.items,
                });
                return;
            }
            if (kind === "todo") {
                res.status(200).json({
                    hours: result.hours,
                    since: result.since,
                    todos: result.items,
                });
                return;
            }

            const schedules = result.items.filter((i) => i.kind === "schedule");
            const todos = result.items.filter((i) => i.kind === "todo");
            res.status(200).json({
                hours: result.hours,
                since: result.since,
                schedules,
                todos,
                items: result.items,
            });
        } catch (error) {
            logger.error("GET rejection-buffer failed:", error);
            res.status(500).json({
                error: "Failed to get rejection buffer",
            });
        }
    }

    // 须先注册更具体路径，再注册根路径
    router.get(
        "/rejection-buffer/schedules",
        authenticateToken,
        (req, res) => handleList(req, res, "schedule"),
    );

    router.get("/rejection-buffer/todos", authenticateToken, (req, res) =>
        handleList(req, res, "todo"),
    );

    router.get("/rejection-buffer", authenticateToken, (req, res) =>
        handleList(req, res),
    );

    return router;
}
