// 第三方绑定与课表同步路由
// 挂载于 /api → 路径为 /api/unbind/exchange、/api/bind/imap、/api/unbind/imap、/api/sync/timetable
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { syncUserTimetable } from "../Services/timetable.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

export function registerIntegrationRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    router.post(
        "/unbind/exchange",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.ExchangeBinded = false;
                user.ExchangeAccessToken = undefined;
                user.ExchangeRefreshToken = undefined;
                user.ExchangeTokenExpiresAt = undefined;

                await dbService.updateUser(user);
                // userCache is updated by reference if in-memory, but dbService.updateUser doesn't update cache automatically in all implementations unless we do it explicitly or if cache holds the same object.
                // In current impl, userCache holds the object reference, so good.

                res.status(200).json({
                    message: "Exchange unbinded successfully",
                });
            } catch (error) {
                logger.error("Failed to unbind Exchange:", error);
                res.status(500).json({ error: "Failed to unbind Exchange" });
            }
        },
    );
    router.post("/bind/imap", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const { imapEmail, imapPassword, imapHost, imapPort, imapTls } =
                req.body || {};
            if (!imapEmail || !imapPassword || !imapHost || !imapPort) {
                return res.status(400).json({
                    error: "Missing required IMAP configuration fields",
                });
            }
            user.ImapEmail = imapEmail;
            user.ImapPassword = imapPassword;
            user.ImapHost = imapHost;
            user.ImapPort = Number(imapPort);
            user.ImapTls = imapTls !== false;
            user.ImapBinded = true;
            await dbService.updateUser(user);
            res.status(200).json({ message: "IMAP bound successfully" });
        } catch (error) {
            logger.error("Failed to bind IMAP:", error);
            res.status(500).json({ error: "Failed to bind IMAP" });
        }
    });
    router.post(
        "/unbind/imap",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.ImapBinded = false;
                user.ImapEmail = undefined;
                user.ImapPassword = undefined;
                user.ImapHost = undefined;
                user.ImapPort = undefined;
                user.ImapTls = undefined;
                if (user.imapClient) {
                    await user.imapClient.close();
                    user.imapClient = undefined;
                }
                await dbService.updateUser(user);
                res.status(200).json({ message: "IMAP unbind successfully" });
            } catch (error) {
                logger.error("Failed to unbind IMAP:", error);
                res.status(500).json({ error: "Failed to unbind IMAP" });
            }
        },
    );
    router.post(
        "/sync/timetable",
        authenticateToken,
        async (req: any, res: any) => {
            const user = req.user as User;
            try {
                if (!user.ebridgeBinded || !user.timetableUrl) {
                    return res.status(400).json({
                        error: "User not bound to Ebridge or missing timetable URL",
                    });
                }

                const result = await syncUserTimetable(user, true);
                return res.status(200).json({
                    message: "Timetable sync completed",
                    added: result.added,
                    errors: result.errors,
                });
            } catch (error: any) {
                logger.error("Manual timetable sync failed:", error);
                if (user.XJTLUPassword) {
                    return res.status(500).json({
                        error: "请稍等，大约两分钟就好",
                        details:
                            "由于你刚刚绑定ebridge，获取课程表数据需要一段时间，请稍等。",
                    });
                }
                return res.status(500).json({
                    error: "Failed to sync timetable",
                    details: error.message,
                });
            }
        },
    );
    router.delete(
        "/sync/timetable",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const count = await dbService.deleteTasksByPattern(
                    user.id,
                    "timetable_%",
                );

                // 刷新用户缓存
                const deletedIds = user.tasks
                    .filter((t) => t.id.startsWith("timetable_"))
                    .map((t) => t.id);
                await dbService.refreshUserTasksIncremental(user, {
                    deletedIds,
                });

                return res.status(200).json({
                    message: `Successfully deleted ${count} timetable tasks`,
                    count,
                });
            } catch (error) {
                logger.error("Failed to delete timetable tasks:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to delete timetable tasks" });
            }
        },
    );
}
