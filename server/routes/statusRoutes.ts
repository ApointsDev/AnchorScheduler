// 状态查询路由
// 挂载于 /api → 路径为 /api/status/*
import express from "express";
import axios from "axios";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

export function registerStatusRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    router.post(
        "/status/microsoft-todo",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const status = {
                    connected: !!user.MStoken,
                    binded: user.MSbinded,
                    tokenAvailable: !!user.MStoken,
                    lastChecked: toShanghaiISO(),
                };

                // 如果有token，尝试验证token是否有效
                if (user.MStoken) {
                    try {
                        const graphEndpoint = `https://graph.microsoft.com/v1.0/me/todo/lists?$top=1`;
                        const headers = {
                            Authorization: `Bearer ${user.MStoken}`,
                        };
                        await axios.get(graphEndpoint, { headers });
                        status.connected = true;
                    } catch (error) {
                        status.connected = false;
                        logger.error("Microsoft Todo API check failed:", error);
                    }
                }

                res.status(200).json(status);
            } catch (error) {
                res.status(500).json({
                    error: "Failed to check Microsoft Todo status",
                });
            }
        },
    );
    router.post(
        "/status/ebridge",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const status: any = {
                    connected: user.ebridgeBinded, // This now reflects ebridge (timetable) specifically
                    binded: !!user.XJTLUPassword,
                    passwordAvailable: !!user.XJTLUPassword,
                    emsClientAvailable: !!user.emsClient,
                    timetableUrl: user.timetableUrl || null,
                    lastChecked: toShanghaiISO(),
                    exchangeBinded: user.ExchangeBinded,
                    exchangeTokenAvailable: !!user.ExchangeAccessToken,
                    smtpBinded: user.ImapBinded || false,
                    smtpEmail: user.ImapEmail || null,
                    imapClientAvailable: !!user.imapClient,
                };

                // 立即发送响应给客户端
                res.status(200).json(status);
            } catch (error) {
                // 如果在准备响应时出错，发送错误响应
                res.status(500).json({
                    error: "Failed to check Ebridge status",
                });
            }
        },
    );
}
