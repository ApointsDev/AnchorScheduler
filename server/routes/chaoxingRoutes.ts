/**
 * 学习通绑定 / 设置 / 手动同步 API
 * 挂载：/api/chaoxing
 */
import express from "express";
import type { User } from "../types/models";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import {
    buildStatusPayload,
    crawlerAccountIdForUser,
    isChaoxingSyncing,
    syncChaoxingUser,
} from "../Services/chaoxing/syncService.js";
import {
    clampIntervalHours,
    clampPreferredHour,
    computeNextSyncAt,
    jitterMinutesForUser,
} from "../Services/chaoxing/scheduleNext.js";
import {
    disableCrawlerAccount,
    upsertCrawlerAccount,
} from "../Services/chaoxing/credentialStore.js";
import type { AuthMiddleware } from "./apiRoutes.js";

export function initializeChaoxingRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    router.get("/chaoxing/status", authenticateToken, async (req: any, res) => {
        try {
            const user = req.user as User;
            res.json(buildStatusPayload(user));
        } catch (e: any) {
            logger.error("chaoxing status error", e);
            res.status(500).json({ error: e?.message || "internal_error" });
        }
    });

    router.put("/chaoxing/bind", authenticateToken, async (req: any, res) => {
        try {
            const user = req.user as User;
            const username = String(req.body?.username || "").trim();
            const password = String(req.body?.password || "");
            if (!username || !password) {
                return res
                    .status(400)
                    .json({ error: "username_and_password_required" });
            }
            const intervalHours = clampIntervalHours(
                req.body?.intervalHours !== undefined
                    ? Number(req.body.intervalHours)
                    : user.ChaoxingIntervalHours ?? 24,
            );
            const preferredHour = clampPreferredHour(
                req.body?.preferredHour !== undefined
                    ? Number(req.body.preferredHour)
                    : user.ChaoxingPreferredHour ?? 8,
            );
            const syncNow = req.body?.syncNow !== false;
            const accountId = crawlerAccountIdForUser(user.id);

            await upsertCrawlerAccount({
                accountId,
                username,
                password,
                enabled: true,
            });

            const nextSyncAt = computeNextSyncAt(
                new Date(),
                intervalHours,
                preferredHour,
                jitterMinutesForUser(user.id),
            );

            await dbService.updateUserChaoxingFields(user.id, {
                ChaoxingBinded: true,
                ChaoxingUsername: username,
                ChaoxingPassword: password,
                ChaoxingAccountId: accountId,
                ChaoxingIntervalHours: intervalHours,
                ChaoxingPreferredHour: preferredHour,
                ChaoxingEnabled: true,
                ChaoxingNextSyncAt: nextSyncAt,
                ChaoxingLastStatus: syncNow ? "syncing" : "idle",
                ChaoxingLastError: null,
            });

            // 更新 cache 上的 user
            user.ChaoxingBinded = true;
            user.ChaoxingUsername = username;
            user.ChaoxingPassword = password;
            user.ChaoxingAccountId = accountId;
            user.ChaoxingIntervalHours = intervalHours;
            user.ChaoxingPreferredHour = preferredHour;
            user.ChaoxingEnabled = true;
            user.ChaoxingNextSyncAt = nextSyncAt;

            if (syncNow) {
                // 异步执行，避免 HTTP 超时
                void syncChaoxingUser(user).catch((e) =>
                    logger.error("chaoxing bind syncNow failed", e),
                );
            }

            res.json({
                ...buildStatusPayload(user),
                lastStatus: syncNow ? "syncing" : user.ChaoxingLastStatus || "idle",
            });
        } catch (e: any) {
            logger.error("chaoxing bind error", e);
            res.status(500).json({ error: e?.message || "bind_failed" });
        }
    });

    router.patch("/chaoxing/settings", authenticateToken, async (req: any, res) => {
        try {
            const user = req.user as User;
            if (!user.ChaoxingBinded) {
                return res.status(400).json({ error: "not_bound" });
            }
            const fields: any = {};
            if (req.body?.intervalHours !== undefined) {
                fields.ChaoxingIntervalHours = clampIntervalHours(
                    Number(req.body.intervalHours),
                );
                user.ChaoxingIntervalHours = fields.ChaoxingIntervalHours;
            }
            if (req.body?.preferredHour !== undefined) {
                fields.ChaoxingPreferredHour = clampPreferredHour(
                    Number(req.body.preferredHour),
                );
                user.ChaoxingPreferredHour = fields.ChaoxingPreferredHour;
            }
            if (req.body?.enabled !== undefined) {
                fields.ChaoxingEnabled = !!req.body.enabled;
                user.ChaoxingEnabled = fields.ChaoxingEnabled;
            }

            const from = user.ChaoxingLastSyncAt || new Date().toISOString();
            const next = computeNextSyncAt(
                from,
                user.ChaoxingIntervalHours ?? 24,
                user.ChaoxingPreferredHour ?? 8,
                jitterMinutesForUser(user.id),
            );
            fields.ChaoxingNextSyncAt = next;
            user.ChaoxingNextSyncAt = next;

            await dbService.updateUserChaoxingFields(user.id, fields);
            res.json(buildStatusPayload(user));
        } catch (e: any) {
            logger.error("chaoxing settings error", e);
            res.status(500).json({ error: e?.message || "settings_failed" });
        }
    });

    router.post("/chaoxing/sync", authenticateToken, async (req: any, res) => {
        try {
            const user = req.user as User;
            if (!user.ChaoxingBinded) {
                return res.status(400).json({ error: "not_bound" });
            }
            if (isChaoxingSyncing(user.id)) {
                return res.status(409).json({
                    error: "already_syncing",
                    ...buildStatusPayload(user),
                });
            }

            // 202 立即返回，后台同步
            res.status(202).json({
                status: "syncing",
                ...buildStatusPayload(user),
            });

            void syncChaoxingUser(user)
                .then((r) => {
                    logger.info(
                        `chaoxing manual sync done user=${user.id} ok=${r.ok}`,
                    );
                })
                .catch((e) => logger.error("chaoxing manual sync error", e));
        } catch (e: any) {
            logger.error("chaoxing sync error", e);
            if (!res.headersSent) {
                res.status(500).json({ error: e?.message || "sync_failed" });
            }
        }
    });

    router.delete("/chaoxing/bind", authenticateToken, async (req: any, res) => {
        try {
            const user = req.user as User;
            const accountId =
                user.ChaoxingAccountId || crawlerAccountIdForUser(user.id);
            try {
                await disableCrawlerAccount(accountId);
            } catch (e) {
                logger.warn("disable crawler account failed", e);
            }

            await dbService.updateUserChaoxingFields(user.id, {
                ChaoxingBinded: false,
                ChaoxingPassword: null,
                ChaoxingUsername: null,
                ChaoxingEnabled: false,
                ChaoxingLastStatus: "idle",
                ChaoxingLastError: null,
                ChaoxingNextSyncAt: null,
            });
            user.ChaoxingBinded = false;
            user.ChaoxingPassword = undefined;
            user.ChaoxingUsername = undefined;
            user.ChaoxingEnabled = false;
            user.ChaoxingLastStatus = "idle";
            user.ChaoxingLastError = undefined;
            user.ChaoxingNextSyncAt = undefined;

            res.json({ binded: false, ok: true });
        } catch (e: any) {
            logger.error("chaoxing unbind error", e);
            res.status(500).json({ error: e?.message || "unbind_failed" });
        }
    });

    return router;
}
