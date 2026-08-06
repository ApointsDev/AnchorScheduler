/**
 * 社区地区 + 用户状态指标排名 API
 * 挂载于 /api → /api/community/*
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { COMMUNITY_METRICS } from "../Services/communityRanking.js";
import {
    CommunityRegionNotFoundError,
    CommunityRegionRequiredError,
} from "../Services/db/community.js";
import type { CommunityRankMetric } from "../types/models";
import type { AuthMiddleware } from "./apiRoutes.js";

function parseLimit(q: any): number | undefined {
    if (q.limit === undefined || q.limit === null || q.limit === "")
        return undefined;
    const n = Number(q.limit);
    return Number.isFinite(n) ? n : undefined;
}

function parseFresh(q: any): boolean {
    return q.fresh === "1" || q.fresh === "true" || q.fresh === true;
}

export function initializeCommunityRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    // ── 地区 ──────────────────────────────────────────────

    /** GET /api/community/regions — 地区列表 */
    router.get(
        "/community/regions",
        authenticateToken,
        async (_req: any, res: any) => {
            try {
                const regions = await dbService.listCommunityRegions();
                return res.status(200).json({ regions });
            } catch (error) {
                logger.error("GET /community/regions failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to list community regions" });
            }
        },
    );

    /** POST /api/community/regions — 创建地区 { name } */
    router.post(
        "/community/regions",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const name = req.body?.name;
                if (!name || typeof name !== "string" || !name.trim()) {
                    return res
                        .status(400)
                        .json({ error: "name is required" });
                }
                const region = await dbService.createCommunityRegion(
                    name.trim(),
                );
                return res.status(201).json({ region });
            } catch (error) {
                logger.error("POST /community/regions failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to create community region" });
            }
        },
    );

    /** GET /api/community/me — 我的地区 */
    router.get(
        "/community/me",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user?.id;
                if (!userId)
                    return res.status(401).json({ error: "Unauthorized" });
                const region = await dbService.getUserCommunityRegion(userId);
                return res.status(200).json({ region: region || null });
            } catch (error) {
                logger.error("GET /community/me failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get community membership" });
            }
        },
    );

    /** PUT /api/community/me/region — 加入/切换地区 { regionId } 或 { regionName } */
    router.put(
        "/community/me/region",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user?.id;
                if (!userId)
                    return res.status(401).json({ error: "Unauthorized" });

                const { regionId, regionName } = req.body || {};
                let id = typeof regionId === "string" ? regionId : "";
                if (!id && typeof regionName === "string" && regionName.trim()) {
                    const created = await dbService.createCommunityRegion(
                        regionName.trim(),
                    );
                    id = created.id;
                }
                if (!id) {
                    return res.status(400).json({
                        error: "regionId or regionName is required",
                    });
                }
                const region = await dbService.setUserCommunityRegion(
                    userId,
                    id,
                );
                return res.status(200).json({ region });
            } catch (error) {
                if (error instanceof CommunityRegionNotFoundError) {
                    return res.status(404).json({ error: error.message });
                }
                logger.error("PUT /community/me/region failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to set community region" });
            }
        },
    );

    // ── 四个状态指标排名接口 ──────────────────────────────

    const rankingHandler =
        (metric: CommunityRankMetric) =>
        async (req: any, res: any) => {
            try {
                const userId = req.user?.id;
                if (!userId)
                    return res.status(401).json({ error: "Unauthorized" });

                const ranking = await dbService.getCommunityRanking(
                    userId,
                    metric,
                    {
                        fresh: parseFresh(req.query),
                        limit: parseLimit(req.query),
                        regionId:
                            typeof req.query.regionId === "string"
                                ? req.query.regionId
                                : undefined,
                    },
                );
                return res.status(200).json({ ranking });
            } catch (error) {
                if (error instanceof CommunityRegionRequiredError) {
                    return res.status(400).json({
                        error: error.message,
                        code: "REGION_REQUIRED",
                        hint: "PUT /api/community/me/region with { regionId: \"region-xjtlu\" } or { regionName: \"西交利物浦大学\" }",
                    });
                }
                if (error instanceof CommunityRegionNotFoundError) {
                    return res.status(404).json({ error: error.message });
                }
                logger.error(
                    `GET /community/rankings/${metric} failed:`,
                    error,
                );
                return res
                    .status(500)
                    .json({ error: "Failed to get community ranking" });
            }
        };

    /**
     * 1) 本周完成日程数 → 时间利用率
     * GET /api/community/rankings/completed-this-week
     */
    router.get(
        "/community/rankings/completed-this-week",
        authenticateToken,
        rankingHandler("completedThisWeek"),
    );

    /**
     * 2) 本周未完成日程数 → 日程清爽度（越少越好）
     * GET /api/community/rankings/incomplete-this-week
     */
    router.get(
        "/community/rankings/incomplete-this-week",
        authenticateToken,
        rankingHandler("incompleteThisWeek"),
    );

    /**
     * 3) 平均完成时长 → 执行效率（越快越好）
     * GET /api/community/rankings/avg-complete-duration
     */
    router.get(
        "/community/rankings/avg-complete-duration",
        authenticateToken,
        rankingHandler("avgCompleteDurationMs"),
    );

    /**
     * 4) 习惯完成时段众数 → 早鸟指数（越早越好）
     * GET /api/community/rankings/completion-hour-mode
     */
    router.get(
        "/community/rankings/completion-hour-mode",
        authenticateToken,
        rankingHandler("completionHourMode"),
    );

    /** 指标元数据（前端展示用） */
    router.get(
        "/community/rankings/metrics",
        authenticateToken,
        async (_req: any, res: any) => {
            return res.status(200).json({
                metrics: COMMUNITY_METRICS.map((m) => ({
                    metric: m.metric,
                    path: m.path,
                    metricLabel: m.metricLabel,
                    titleLabel: m.titleLabel,
                    higherIsBetter: m.higherIsBetter,
                    endpoint: `/api/community/rankings/${m.path}`,
                })),
            });
        },
    );

    /**
     * 本社区四指标 top100（一次返回）
     * 时间利用率 / 日程清爽度 / 执行效率 / 早鸟指数
     * GET /api/community/rankings/top100
     * Query: fresh, limit(默认100,最大100), regionId
     */
    router.get(
        "/community/rankings/top100",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const userId = req.user?.id;
                if (!userId)
                    return res.status(401).json({ error: "Unauthorized" });

                const rankings = await dbService.getAllCommunityRankings(
                    userId,
                    {
                        fresh: parseFresh(req.query),
                        limit: parseLimit(req.query) ?? 100,
                        regionId:
                            typeof req.query.regionId === "string"
                                ? req.query.regionId
                                : undefined,
                    },
                );
                return res.status(200).json({ rankings });
            } catch (error) {
                if (error instanceof CommunityRegionRequiredError) {
                    return res.status(400).json({
                        error: error.message,
                        code: "REGION_REQUIRED",
                        hint: "PUT /api/community/me/region with { regionId: \"region-xjtlu\" } or { regionName: \"西交利物浦大学\" }",
                    });
                }
                if (error instanceof CommunityRegionNotFoundError) {
                    return res.status(404).json({ error: error.message });
                }
                logger.error("GET /community/rankings/top100 failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get community top100 rankings" });
            }
        },
    );

    return router;
}
