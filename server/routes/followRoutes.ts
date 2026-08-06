/**
 * 用户关注 API
 * 挂载于 /api → /api/users/:userId/follow
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiRoutes.js";

export function initializeFollowRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    /**
     * POST /api/users/:userId/follow — 关注用户
     * :userId 为目标用户（被关注者），不能用 "me"
     */
    router.post(
        "/users/:userId/follow",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const followerId = req.user?.id;
                if (!followerId) {
                    return res.status(401).json({ error: "Unauthorized" });
                }

                const followedId =
                    typeof req.params.userId === "string"
                        ? req.params.userId.trim()
                        : "";
                if (!followedId || followedId === "me") {
                    return res.status(400).json({ error: "valid userId is required" });
                }

                // 检查目标用户是否存在
                const exists = await dbService.getUserPublicProfile(followedId);
                if (!exists) {
                    return res.status(404).json({ error: "User not found" });
                }

                const created = await dbService.followUser(followerId, followedId);
                return res.status(created ? 201 : 200).json({
                    following: true,
                    message: created ? "Followed" : "Already following",
                });
            } catch (error) {
                logger.error("POST /users/:userId/follow failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to follow user" });
            }
        },
    );

    /**
     * DELETE /api/users/:userId/follow — 取消关注
     */
    router.delete(
        "/users/:userId/follow",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const followerId = req.user?.id;
                if (!followerId) {
                    return res.status(401).json({ error: "Unauthorized" });
                }

                const followedId =
                    typeof req.params.userId === "string"
                        ? req.params.userId.trim()
                        : "";
                if (!followedId || followedId === "me") {
                    return res.status(400).json({ error: "valid userId is required" });
                }

                const removed = await dbService.unfollowUser(followerId, followedId);
                return res.status(200).json({
                    following: false,
                    message: removed ? "Unfollowed" : "Was not following",
                });
            } catch (error) {
                logger.error("DELETE /users/:userId/follow failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to unfollow user" });
            }
        },
    );

    /**
     * GET /api/users/:userId/follow/status — 检查关注状态
     * 返回 { following: boolean }
     */
    router.get(
        "/users/:userId/follow/status",
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
                if (!targetId || targetId === "me") {
                    targetId = viewerId;
                }

                const following = await dbService.isFollowing(viewerId, targetId);
                return res.status(200).json({ following });
            } catch (error) {
                logger.error("GET /users/:userId/follow/status failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to check follow status" });
            }
        },
    );

    /**
     * GET /api/users/:userId/following — 获取该用户关注的人
     * Query: limit=N  offset=N
     */
    router.get(
        "/users/:userId/following",
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
                if (!targetId || targetId === "me") {
                    targetId = viewerId;
                }

                // 检查目标用户是否存在
                const exists = await dbService.getUserPublicProfile(targetId);
                if (!exists) {
                    return res.status(404).json({ error: "User not found" });
                }

                const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
                const offset = Math.max(0, Number(req.query.offset) || 0);

                const result = await dbService.getFollowing(targetId, limit, offset);
                return res.status(200).json(result);
            } catch (error) {
                logger.error("GET /users/:userId/following failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get following list" });
            }
        },
    );

    /**
     * GET /api/users/:userId/followers — 获取该用户的粉丝
     * Query: limit=N  offset=N
     */
    router.get(
        "/users/:userId/followers",
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
                if (!targetId || targetId === "me") {
                    targetId = viewerId;
                }

                // 检查目标用户是否存在
                const exists = await dbService.getUserPublicProfile(targetId);
                if (!exists) {
                    return res.status(404).json({ error: "User not found" });
                }

                const limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
                const offset = Math.max(0, Number(req.query.offset) || 0);

                const result = await dbService.getFollowers(targetId, limit, offset);
                return res.status(200).json(result);
            } catch (error) {
                logger.error("GET /users/:userId/followers failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get followers list" });
            }
        },
    );

    return router;
}
