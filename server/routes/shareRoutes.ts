// 日程分享路由
// 挂载于 /api → 路径为 /api/share/*
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { User, Task } from "../index";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiTypes.js";

export function registerShareRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
    frontendUrl: string,
) {
    router.post(
        "/share/create",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { name, dateStart, dateEnd, taskIds, expiresInDays } =
                    req.body || {};

                if (dateStart || dateEnd || (taskIds && taskIds.length > 0)) {
                    // 有明确筛选条件，允许
                } else if (
                    !dateStart &&
                    !dateEnd &&
                    (!taskIds || taskIds.length === 0)
                ) {
                    // 三个条件都为空 = 分享全部日程，也允许
                } else {
                    return res.status(400).json({
                        error: "请选择分享的日程范围或指定日程",
                    });
                }

                const token = uuidv4().replace(/-/g, "").substring(0, 16);
                const id = uuidv4();
                const expiresAt =
                    expiresInDays && expiresInDays > 0
                        ? new Date(
                              Date.now() + expiresInDays * 86400000,
                          ).toISOString()
                        : null;

                await dbService.createSharedSchedule({
                    id,
                    userId: user.id,
                    token,
                    name: name || "日程分享",
                    dateStart: dateStart || null,
                    dateEnd: dateEnd || null,
                    taskIds: taskIds ? JSON.stringify(taskIds) : null,
                    expiresAt,
                });

                const shareUrl = `${frontendUrl}/share/${token}`;
                return res.status(200).json({
                    token,
                    shareUrl,
                    expiresAt,
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to create share:", message);
                return res.status(500).json({ error: "创建分享失败" });
            }
        },
    );
    router.get("/share/list", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const shares = await dbService.getSharedSchedulesByUser(user.id);
            return res.status(200).json({
                shares: shares.map((s: any) => ({
                    id: s.id,
                    token: s.token,
                    name: s.name,
                    dateStart: s.dateStart,
                    dateEnd: s.dateEnd,
                    taskIds: s.taskIds ? JSON.parse(s.taskIds) : null,
                    expiresAt: s.expiresAt,
                    createdAt: s.createdAt,
                    shareUrl: `${frontendUrl}/share/${s.token}`,
                })),
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error("Failed to list shares:", message);
            return res.status(500).json({ error: "获取分享列表失败" });
        }
    });
    router.delete(
        "/share/:token",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const deleted = await dbService.deleteSharedSchedule(
                    req.params.token,
                    user.id,
                );
                if (!deleted) {
                    return res.status(404).json({ error: "分享链接不存在" });
                }
                return res.status(200).json({ message: "已删除" });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to delete share:", message);
                return res.status(500).json({ error: "删除分享失败" });
            }
        },
    );
    router.get("/share/view/:token", async (req: any, res: any) => {
        try {
            const share = await dbService.getSharedScheduleByToken(
                req.params.token,
            );
            if (!share) {
                return res
                    .status(404)
                    .json({ error: "分享链接不存在或已失效" });
            }
            if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
                return res.status(410).json({ error: "分享链接已过期" });
            }

            // 获取分享用户的日程
            let tasks: Task[];
            if (share.taskIds) {
                const ids: string[] = JSON.parse(share.taskIds);
                tasks = [];
                for (const tid of ids) {
                    const t = await dbService.getTaskById(tid);
                    if (t && t.userId === share.userId) {
                        tasks.push(t);
                    }
                }
            } else {
                tasks = await dbService.getTasksByUserId(share.userId);
                if (share.dateStart || share.dateEnd) {
                    tasks = tasks.filter((t) => {
                        if (!t.startTime) return false;
                        const st = new Date(t.startTime).getTime();
                        if (
                            share.dateStart &&
                            st < new Date(share.dateStart).getTime()
                        )
                            return false;
                        if (
                            share.dateEnd &&
                            st > new Date(share.dateEnd).getTime()
                        )
                            return false;
                        return true;
                    });
                }
            }

            // 返回脱敏数据
            return res.status(200).json({
                share: {
                    name: share.name,
                    createdAt: share.createdAt,
                },
                tasks: tasks.map((t) => ({
                    id: t.id,
                    name: t.name,
                    description: t.description,
                    startTime: t.startTime,
                    endTime: t.endTime,
                    location: t.location,
                    importance: t.importance,
                    completed: t.completed,
                })),
                user: {
                    name:
                        (await dbService.getUserById(share.userId))?.name ||
                        "未知用户",
                },
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error("Failed to view share:", message);
            return res.status(500).json({ error: "加载分享失败" });
        }
    });
}
