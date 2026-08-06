// CalDAV 客户端配置与内置 CalDAV 服务器管理路由
// 挂载于 /api → 路径为 /api/caldav/*、/api/caldav-server/*
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { CalDavProvider } from "../Services/calendar/CalDavProvider.js";
import { CalendarSyncService } from "../Services/calendar/CalendarSyncService.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

/** 后端监听端口（用于推导 CalDAV 服务器地址） */
const PORT = process.env.PORT || 3000;

export function registerCalDavRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    const createCalDavProvider = (user: User) => {
        if (
            !user.CalDavBaseUrl ||
            !user.CalDavUsername ||
            !user.CalDavPassword
        ) {
            return null;
        }
        return new CalDavProvider({
            baseUrl: user.CalDavBaseUrl,
            username: user.CalDavUsername,
            password: user.CalDavPassword,
            calendarHome: user.CalDavCalendarHome,
        });
    };
    router.post(
        "/caldav/config",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { baseUrl, username, password, calendarUrl } =
                    req.body || {};

                if (!baseUrl || !username || !password) {
                    return res.status(400).json({
                        error: "baseUrl, username, password are required",
                    });
                }

                user.CalDavBaseUrl = baseUrl;
                user.CalDavUsername = username;
                user.CalDavPassword = password;
                if (calendarUrl) user.CalDavCalendarUrl = calendarUrl;
                user.CalDavEnabled = true;

                const provider = createCalDavProvider(user);
                if (!provider) {
                    return res
                        .status(500)
                        .json({ error: "Failed to create CalDAV provider" });
                }

                try {
                    const discovery = await provider.discover();
                    user.CalDavPrincipalUrl = discovery.principalUrl;
                    user.CalDavCalendarHome = discovery.calendarHome;
                    if (
                        discovery.calendars.length > 0 &&
                        !user.CalDavCalendarUrl
                    ) {
                        user.CalDavCalendarUrl = discovery.calendars[0].url;
                    }
                } catch (e) {
                    logger.error("CalDAV discovery failed:", e);
                }

                await dbService.updateUser(user);
                return res.status(200).json({
                    message: "CalDAV configured successfully",
                    enabled: user.CalDavEnabled,
                    principalUrl: user.CalDavPrincipalUrl,
                    calendarHome: user.CalDavCalendarHome,
                    calendarUrl: user.CalDavCalendarUrl,
                });
            } catch (error: any) {
                logger.error("CalDAV config failed:", error);
                return res.status(500).json({
                    error: "Failed to configure CalDAV",
                    details: error.message,
                });
            }
        },
    );
    router.get(
        "/caldav/status",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                return res.status(200).json({
                    enabled: user.CalDavEnabled || false,
                    baseUrl: user.CalDavBaseUrl || null,
                    username: user.CalDavUsername ? "***" : null,
                    principalUrl: user.CalDavPrincipalUrl || null,
                    calendarHome: user.CalDavCalendarHome || null,
                    calendarUrl: user.CalDavCalendarUrl || null,
                    lastSyncAt: user.CalDavLastSyncAt || null,
                });
            } catch (error: any) {
                logger.error("CalDAV status failed:", error);
                return res.status(500).json({
                    error: "Failed to get CalDAV status",
                    details: error.message,
                });
            }
        },
    );
    router.get(
        "/caldav/calendars",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const provider = createCalDavProvider(user);

                if (!provider) {
                    return res
                        .status(400)
                        .json({ error: "CalDAV not configured" });
                }

                const calendars = await provider.listCalendars();
                return res.status(200).json({ calendars });
            } catch (error: any) {
                logger.error("CalDAV list calendars failed:", error);
                return res.status(500).json({
                    error: "Failed to list calendars",
                    details: error.message,
                });
            }
        },
    );
    router.post(
        "/caldav/sync",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const {
                    direction = "both",
                    calendarUrl,
                    rangeStart,
                    rangeEnd,
                    allowConflict,
                } = req.body || {};

                const provider = createCalDavProvider(user);
                if (!provider) {
                    return res
                        .status(400)
                        .json({ error: "CalDAV not configured" });
                }

                const syncService = new CalendarSyncService(provider);
                const result = await syncService.sync(user, {
                    direction,
                    calendarUrl: calendarUrl || user.CalDavCalendarUrl,
                    rangeStart,
                    rangeEnd,
                    allowConflict,
                });

                return res.status(200).json({
                    message: "CalDAV sync completed",
                    result,
                });
            } catch (error: any) {
                logger.error("CalDAV sync failed:", error);
                return res.status(500).json({
                    error: "Failed to sync CalDAV",
                    details: error.message,
                });
            }
        },
    );
    router.delete(
        "/caldav/config",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.CalDavBaseUrl = undefined;
                user.CalDavUsername = undefined;
                user.CalDavPassword = undefined;
                user.CalDavPrincipalUrl = undefined;
                user.CalDavCalendarHome = undefined;
                user.CalDavCalendarUrl = undefined;
                user.CalDavSyncToken = undefined;
                user.CalDavEnabled = false;
                user.CalDavLastSyncAt = undefined;

                await dbService.updateUser(user);
                return res
                    .status(200)
                    .json({ message: "CalDAV configuration removed" });
            } catch (error: any) {
                logger.error("CalDAV unbind failed:", error);
                return res.status(500).json({
                    error: "Failed to remove CalDAV configuration",
                    details: error.message,
                });
            }
        },
    );
    const getServerBaseUrl = (req: any): string => {
        const proto = (req.get("x-forwarded-proto") || "").split(",")[0].trim();
        const forwardedHost = (req.get("x-forwarded-host") || "")
            .split(",")[0]
            .trim();
        const rawHost = req.get("host") || `localhost:${PORT}`;
        const host = (forwardedHost || rawHost).replace(/:\d+$/, "");
        const scheme = proto || (host === "localhost" ? "http" : "https");
        const port = host === "localhost" ? `:${PORT}` : "";
        return `${scheme}://${host}${port}`;
    };
    router.get(
        "/caldav-server/status",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const baseUrl = getServerBaseUrl(req);
                const serverUrl = baseUrl + "/caldav";

                // 如果服务器已启用但没有密码（历史遗留数据），自动生成一个
                if (user.CalDavServerEnabled && !user.CalDavPassword) {
                    user.CalDavPassword = uuidv4();
                    await dbService.updateUser(user);
                    logger.info(
                        `Auto-generated CalDavPassword for user ${user.email}`,
                    );
                }

                return res.status(200).json({
                    enabled: user.CalDavServerEnabled || false,
                    serverUrl,
                    principalUrl: user.CalDavServerEnabled
                        ? `${serverUrl}/principals/${user.id}/`
                        : null,
                    calendarHomeUrl: user.CalDavServerEnabled
                        ? `${serverUrl}/calendars/${user.id}/`
                        : null,
                    calendarUrl: user.CalDavServerEnabled
                        ? `${serverUrl}/calendars/${user.id}/default/`
                        : null,
                    username: user.CalDavServerEnabled
                        ? user.CalDavUsername || user.email
                        : null,
                    password: user.CalDavServerEnabled
                        ? user.CalDavPassword || null
                        : null,
                    connectionHint: user.CalDavServerEnabled
                        ? `使用 ${serverUrl} 作为 CalDAV 服务器地址，用户名: ${user.CalDavUsername || user.email}`
                        : "CalDAV server 未启用，请先启用。",
                    clientProfile: user.CalDavClientProfile || "auto",
                });
            } catch (error: any) {
                logger.error("CalDAV server status failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get CalDAV server status" });
            }
        },
    );
    router.post(
        "/caldav-server/enable",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const baseUrl = getServerBaseUrl(req);
                const serverUrl = baseUrl + "/caldav";

                user.CalDavServerEnabled = true;

                // Auto-bind: configure user's CalDAV client to point to platform CalDAV server
                // Generate a dedicated CalDAV password if not already set
                if (!user.CalDavPassword) {
                    user.CalDavPassword = uuidv4();
                }
                user.CalDavBaseUrl = serverUrl;
                user.CalDavUsername = user.email;
                user.CalDavPrincipalUrl = `${serverUrl}/principals/${user.id}/`;
                user.CalDavCalendarHome = `${serverUrl}/calendars/${user.id}/`;
                user.CalDavCalendarUrl = `${serverUrl}/calendars/${user.id}/default/`;
                user.CalDavEnabled = true;

                await dbService.updateUser(user);

                return res.status(200).json({
                    message: "CalDAV server enabled",
                    serverUrl,
                    principalUrl: `${serverUrl}/principals/${user.id}/`,
                    calendarHomeUrl: `${serverUrl}/calendars/${user.id}/`,
                    calendarUrl: `${serverUrl}/calendars/${user.id}/default/`,
                    username: user.email,
                    password: user.CalDavPassword,
                });
            } catch (error: any) {
                logger.error("CalDAV server enable failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to enable CalDAV server" });
            }
        },
    );
    router.post(
        "/caldav-server/disable",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.CalDavServerEnabled = false;
                await dbService.updateUser(user);
                return res
                    .status(200)
                    .json({ message: "CalDAV server disabled" });
            } catch (error: any) {
                logger.error("CalDAV server disable failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to disable CalDAV server" });
            }
        },
    );
    router.post(
        "/caldav-server/client-profile",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { profile } = req.body || {};
                const valid = [
                    "auto",
                    "apple",
                    "thunderbird",
                    "davx5",
                    "outlook",
                    "generic",
                ];
                if (!profile || !valid.includes(profile)) {
                    return res.status(400).json({
                        error: `Invalid profile. Must be one of: ${valid.join(", ")}`,
                    });
                }
                user.CalDavClientProfile = profile;
                await dbService.updateUser(user);
                return res.status(200).json({ clientProfile: profile });
            } catch (error: any) {
                logger.error("CalDAV client profile update failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update client profile" });
            }
        },
    );
}
