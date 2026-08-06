/**
 * 用户个人主页 API
 * 挂载于 /api → /api/users/:userId/profile
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiRoutes.js";

function parseFresh(q: any): boolean {
    return q.fresh === "1" || q.fresh === "true" || q.fresh === true;
}

export function initializeUserProfileRoutes(
    authenticateToken: AuthMiddleware,
) {
    const router = express.Router();

    /**
     * GET /api/users/:userId/profile
     * 访问用户个人主页（公开资料 + 本周状态 + 社区称号）
     * :userId 可为真实 id，或 "me" 表示当前登录用户
     * Query: fresh=1 强制刷新 status / 排名缓存
     */
    router.get(
        "/users/:userId/profile",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const viewerId = req.user?.id;
                if (!viewerId) {
                    return res.status(401).json({ error: "Unauthorized" });
                }

                let targetId =
                    typeof req.params.userId === "string"
                        ? req.params.userId.trim()
                        : "";
                if (!targetId) {
                    return res.status(400).json({ error: "userId is required" });
                }
                if (targetId === "me") {
                    targetId = viewerId;
                }

                const profile = await dbService.getUserHomepage(
                    targetId,
                    viewerId,
                    { fresh: parseFresh(req.query) },
                );
                if (!profile) {
                    return res.status(404).json({ error: "User not found" });
                }

                return res.status(200).json({ profile });
            } catch (error) {
                logger.error("GET /users/:userId/profile failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get user profile" });
            }
        },
    );

    /**
     * GET /api/users/:userId/schedules
     * 获取目标用户的可见日程列表（受 visibility 字段控制）
     * :userId 可为真实 id，或 "me" 表示当前登录用户
     * Query: start=ISO  end=ISO  q=搜索  completed=0|1  limit=N  offset=N  sortBy=startTime  order=asc|desc
     */
    router.get(
        "/users/:userId/schedules",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const viewerId = req.user?.id;
                if (!viewerId) {
                    return res.status(401).json({ error: "Unauthorized" });
                }

                let targetId =
                    typeof req.params.userId === "string"
                        ? req.params.userId.trim()
                        : "";
                if (!targetId) {
                    return res.status(400).json({ error: "userId is required" });
                }
                if (targetId === "me") {
                    targetId = viewerId;
                }

                // 检查目标用户是否存在
                const profile = await dbService.getUserHomepage(
                    targetId,
                    viewerId,
                );
                if (!profile) {
                    return res.status(404).json({ error: "User not found" });
                }

                // 分页 & 过滤参数
                const start = typeof req.query.start === "string" ? req.query.start : undefined;
                const end = typeof req.query.end === "string" ? req.query.end : undefined;
                const q = typeof req.query.q === "string" ? req.query.q : undefined;
                const completed =
                    req.query.completed === "0" || req.query.completed === "false"
                        ? false
                        : req.query.completed === "1" || req.query.completed === "true"
                            ? true
                            : undefined;
                const limit = Math.max(1, Math.min(500, Number(req.query.limit) || 50));
                const offset = Math.max(0, Number(req.query.offset) || 0);
                const sortBy =
                    ["startTime", "dueDate", "name", "endTime"].includes(
                        typeof req.query.sortBy === "string" ? req.query.sortBy : "",
                    )
                        ? (req.query.sortBy as string)
                        : "startTime";
                const order =
                    req.query.order === "desc" ? ("desc" as const) : ("asc" as const);

                // 获取按可见性过滤后的日程
                const visibleTasks = await dbService.getVisibleTasksByUserId(
                    targetId,
                    viewerId,
                );

                // 应用额外过滤
                let filtered = visibleTasks;
                if (start) {
                    filtered = filtered.filter(
                        (t) => t.endTime && t.endTime >= start,
                    );
                }
                if (end) {
                    filtered = filtered.filter(
                        (t) => t.startTime && t.startTime <= end,
                    );
                }
                if (q) {
                    const lq = q.toLowerCase();
                    filtered = filtered.filter(
                        (t) =>
                            (t.name && t.name.toLowerCase().includes(lq)) ||
                            (t.description &&
                                t.description.toLowerCase().includes(lq)) ||
                            (t.location && t.location.toLowerCase().includes(lq)),
                    );
                }
                if (typeof completed === "boolean") {
                    filtered = filtered.filter((t) => t.completed === completed);
                }

                // 排序
                filtered.sort((a: any, b: any) => {
                    const va = a[sortBy] || "";
                    const vb = b[sortBy] || "";
                    if (va < vb) return order === "asc" ? -1 : 1;
                    if (va > vb) return order === "asc" ? 1 : -1;
                    return 0;
                });

                const total = filtered.length;
                const paged = filtered.slice(offset, offset + limit);

                return res.status(200).json({ schedules: paged, total });
            } catch (error) {
                logger.error(
                    "GET /users/:userId/schedules failed:",
                    error,
                );
                return res
                    .status(500)
                    .json({ error: "Failed to get user schedules" });
            }
        },
    );

    /**
     * GET /api/users/:userId/status
     * 获取目标用户的本周日程状态统计（复用现有 user-status 逻辑）
     * :userId 可为真实 id，或 "me" 表示当前登录用户
     * Query: fresh=1 强制重算
     */
    router.get(
        "/users/:userId/status",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const viewerId = req.user?.id;
                if (!viewerId) {
                    return res.status(401).json({ error: "Unauthorized" });
                }

                let targetId =
                    typeof req.params.userId === "string"
                        ? req.params.userId.trim()
                        : "";
                if (!targetId) {
                    return res.status(400).json({ error: "userId is required" });
                }
                if (targetId === "me") {
                    targetId = viewerId;
                }

                // 检查目标用户是否存在
                const exists = await dbService.getUserPublicProfile(targetId);
                if (!exists) {
                    return res.status(404).json({ error: "User not found" });
                }

                const fresh =
                    req.query.fresh === "1" ||
                    req.query.fresh === "true" ||
                    req.query.fresh === true;
                const status = await dbService.getUserStatus(targetId, {
                    fresh,
                });

                return res.status(200).json({
                    userId: targetId,
                    displayName: exists.name,
                    status,
                });
            } catch (error) {
                logger.error(
                    "GET /users/:userId/status failed:",
                    error,
                );
                return res
                    .status(500)
                    .json({ error: "Failed to get user status" });
            }
        },
    );

    return router;
}
