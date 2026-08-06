// 用户设置路由
// 挂载于 /api → 路径为 /api/settings/*
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import {
    toShanghaiISO,
    getRawWeekNumber,
    getAcademicYearConfig,
} from "../Utils/time.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

export function registerSettingsRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    router.post(
        "/settings/auto-schedule-promotions",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { enabled } = req.body || {};
                if (typeof enabled !== "boolean") {
                    return res
                        .status(400)
                        .json({ error: "enabled boolean required" });
                }
                user.autoSchedulePromotions = enabled;
                await dbService.updateUser(user);
                return res
                    .status(200)
                    .json({ autoSchedulePromotions: enabled });
            } catch (error: any) {
                logger.error("Failed to update autoSchedulePromotions:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update setting" });
            }
        },
    );
    router.post(
        "/settings/strip-reply-prefix",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { enabled } = req.body || {};
                if (typeof enabled !== "boolean") {
                    return res
                        .status(400)
                        .json({ error: "enabled boolean required" });
                }
                user.stripReplyPrefix = enabled;
                await dbService.updateUser(user);
                return res.status(200).json({ stripReplyPrefix: enabled });
            } catch (error: any) {
                logger.error("Failed to update stripReplyPrefix:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update setting" });
            }
        },
    );
    router.get(
        "/settings/onboarding",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                return res.json({
                    onboardingCompleted: !!user.onboardingCompleted,
                });
            } catch (error: any) {
                logger.error("Failed to get onboarding status:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get onboarding status" });
            }
        },
    );
    router.post(
        "/settings/onboarding",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { completed } = req.body || {};
                if (typeof completed !== "boolean") {
                    return res
                        .status(400)
                        .json({ error: "completed boolean required" });
                }
                user.onboardingCompleted = completed;
                await dbService.updateUser(user);
                return res.json({ onboardingCompleted: completed });
            } catch (error: any) {
                logger.error("Failed to update onboarding status:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update onboarding status" });
            }
        },
    );
    router.post(
        "/settings/conflict-mode",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { boundaryConflictInclusive } = req.body || {};
                if (typeof boundaryConflictInclusive !== "boolean") {
                    return res.status(400).json({
                        error: "boundaryConflictInclusive boolean required",
                    });
                }
                user.conflictBoundaryInclusive = boundaryConflictInclusive;
                await dbService.updateUser(user);
                return res.status(200).json({
                    boundaryConflictInclusive,
                    updatedAt: toShanghaiISO(),
                });
            } catch (error) {
                logger.error("Failed to update conflict mode:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update conflict mode" });
            }
        },
    );
    router.get(
        "/settings/week",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                // 计算原始周次（不含任何偏移）
                const { weekOffset: academicWeekOffset } =
                    getAcademicYearConfig();
                const rawWeekNumber = getRawWeekNumber();

                const globalWeekOffset = academicWeekOffset;
                const userWeekOffset =
                    user && typeof user.weekOffset === "number"
                        ? user.weekOffset
                        : 0;

                const effectiveWeek = Math.max(
                    1,
                    rawWeekNumber + globalWeekOffset + (userWeekOffset || 0),
                );

                return res.status(200).json({
                    rawWeekNumber,
                    globalWeekOffset,
                    userWeekOffset: userWeekOffset || 0,
                    effectiveWeek,
                });
            } catch (error) {
                logger.error("Failed to get week info:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get week info" });
            }
        },
    );
    router.post(
        "/settings/week",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { currentWeek, userWeekOffset } = req.body || {};

                const { weekOffset: academicWeekOffset } =
                    getAcademicYearConfig();
                const rawWeekNumber = getRawWeekNumber();

                let newUserOffset =
                    typeof userWeekOffset === "number"
                        ? userWeekOffset
                        : undefined;
                if (typeof currentWeek === "number") {
                    // 计算需要设置的 user offset，使得 raw + global + userOffset === currentWeek
                    newUserOffset =
                        currentWeek - (rawWeekNumber + academicWeekOffset);
                }

                if (typeof newUserOffset !== "number" || isNaN(newUserOffset)) {
                    return res.status(400).json({
                        error: "Either currentWeek (number) or userWeekOffset (number) required",
                    });
                }

                user.weekOffset = Math.trunc(newUserOffset);
                await dbService.updateUser(user);

                // 返回更新后的信息
                const effectiveWeek = Math.max(
                    1,
                    rawWeekNumber + academicWeekOffset + (user.weekOffset || 0),
                );
                return res.status(200).json({
                    rawWeekNumber,
                    globalWeekOffset: academicWeekOffset,
                    userWeekOffset: user.weekOffset || 0,
                    effectiveWeek,
                });
            } catch (error) {
                logger.error("Failed to set week info:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to set week info" });
            }
        },
    );
}
