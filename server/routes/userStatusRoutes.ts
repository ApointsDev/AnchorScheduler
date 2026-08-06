/**
 * 用户状态 API
 * 挂载于 /api → /api/user-status
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiRoutes.js";

export function initializeUserStatusRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    // GET /api/user-status — 本周日程状态统计
    router.get(
        "/user-status",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user;
                if (!user?.id) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const fresh =
                    req.query.fresh === "1" ||
                    req.query.fresh === "true" ||
                    req.query.fresh === true;
                const status = await dbService.getUserStatus(user.id, {
                    fresh,
                });
                return res.status(200).json({ status });
            } catch (error) {
                logger.error("GET /user-status failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get user status" });
            }
        },
    );

    // POST /api/user-status/refresh — 强制重算
    router.post(
        "/user-status/refresh",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user;
                if (!user?.id) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
                const status = await dbService.getUserStatus(user.id, {
                    fresh: true,
                });
                return res.status(200).json({ status });
            } catch (error) {
                logger.error("POST /user-status/refresh failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to refresh user status" });
            }
        },
    );

    router.get(
        "/user-status/layout",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user;
                if (!user?.id) {
                    return res.status(401).json({ error: "Unauthorized" });
                }

                const layout = await dbService.getUserStatusLayout(user.id);
                if (!layout) {
                    return res.status(404).json({ error: "Layout not found" });
                }

                return res.status(200).json({ layout });
            } catch (error) {
                logger.error("GET /user-status/layout failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get user status layout" });
            }
        },
    );

    router.put(
        "/user-status/layout",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user;
                if (!user?.id) {
                    return res.status(401).json({ error: "Unauthorized" });
                }

                const layout = req.body?.layout;
                if (!layout || typeof layout !== "object" || Array.isArray(layout)) {
                    return res.status(400).json({ error: "Invalid layout" });
                }

                const saved = await dbService.saveUserStatusLayout(
                    user.id,
                    layout,
                );
                return res.status(200).json({ layout: saved });
            } catch (error) {
                logger.error("PUT /user-status/layout failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to save user status layout" });
            }
        },
    );

    return router;
}
