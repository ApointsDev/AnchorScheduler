import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { User, Task } from "../index";
import { logger } from "../Utils/logger.js";
import {
    toShanghaiISO,
    getRawWeekNumber,
    getAcademicYearConfig,
} from "../Utils/time.js";
import { dbService } from "../Services/dbService.js";
import { mcpTools } from "../Services/mcp.js";
import {
    findConflictingTasks,
    ScheduleConflictError,
} from "../Services/scheduleConflict.js";
import {
    generateRecurrenceInstances,
    buildRecurrenceSummary,
} from "../Services/recurrence.js";
import {
    parseRecurrenceRuleInput,
    resolveScheduleType,
} from "../Services/types.js";
import type { RecurrenceRule, ScheduleType } from "../Services/types";
import { broadcastTaskChange } from "../Services/websocket.js";
import { logUserEvent } from "../Services/userLog.js";
import { LLMApi } from "../Services/LLMApi.js";
import { syncUserTimetable } from "../Services/timetable.js";
import { CalDavProvider } from "../Services/calendar/CalDavProvider.js";
import { CalendarSyncService } from "../Services/calendar/CalendarSyncService.js";

// 身份验证中间件引用
export interface AuthMiddleware {
    (req: any, res: any, next: any): Promise<void>;
}

export function initializeApiRoutes(authenticateToken: AuthMiddleware) {
    // 创建路由器 - 每次调用都创建新的实例
    const router = express.Router();

    const PORT = process.env.PORT || 3000;
    const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

    // 初始化 LLM API
    const llmApi = new LLMApi(
        process.env.OPENAI_API_KEY || "",
        process.env.OPENAI_MODEL || "deepseek-chat",
    );

    const normalizeQueueScheduleArgs = (input: any) => {
        const args = { ...(input || {}) } as any;

        if (!args.name && args.title) args.name = args.title;
        if (!args.description && args.body) args.description = args.body;
        if (!args.location && args.place) args.location = args.place;

        const normalizeTimeValue = (value: any) => {
            if (!value) return value;
            if (typeof value === "string") return value;
            if (typeof value === "number") return new Date(value).toISOString();
            if (typeof value === "object") {
                if (typeof value.dateTime === "string") return value.dateTime;
                if (typeof value.start === "string") return value.start;
            }
            return value;
        };

        if (args.startTime && typeof args.startTime !== "string") {
            args.startTime = normalizeTimeValue(args.startTime);
        }
        if (args.endTime && typeof args.endTime !== "string") {
            args.endTime = normalizeTimeValue(args.endTime);
        }
        if (!args.startTime && (args.start || args.startDate)) {
            args.startTime = normalizeTimeValue(args.start ?? args.startDate);
        }
        if (!args.endTime && (args.end || args.endDate)) {
            args.endTime = normalizeTimeValue(args.end ?? args.endDate);
        }

        if (
            args.recurrence !== undefined &&
            args.recurrenceRule === undefined
        ) {
            args.recurrenceRule = args.recurrence;
            delete args.recurrence;
        }

        if (args.recurrenceRule !== undefined) {
            const parsedRecurrence = parseRecurrenceRuleInput(
                args.recurrenceRule,
            );
            if (parsedRecurrence) {
                args.recurrenceRule = parsedRecurrence;
            } else {
                delete args.recurrenceRule;
            }
        }

        try {
            const resolved = resolveScheduleType({
                explicit: args.scheduleType,
                recurrence: args.recurrenceRule,
                fallback: "single",
            });
            args.scheduleType = resolved.scheduleType;
            if (resolved.parsedRecurrence)
                args.recurrenceRule = resolved.parsedRecurrence;
        } catch (e) {
            const parsedRecurrence = parseRecurrenceRuleInput(
                args.recurrenceRule,
            );
            if (parsedRecurrence) {
                args.recurrenceRule = parsedRecurrence;
            } else {
                delete args.recurrenceRule;
            }
            const resolved = resolveScheduleType({
                explicit: undefined,
                recurrence: args.recurrenceRule,
                fallback: "single",
            });
            args.scheduleType = resolved.scheduleType;
        }

        return args;
    };

    // LLM 聊天接口（流式）
    router.post("/llm/chat", authenticateToken, async (req: any, res: any) => {
        try {
            const { messages, tools } = req.body;
            if (!messages || !Array.isArray(messages)) {
                return res
                    .status(400)
                    .json({ error: "messages array required" });
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");

            await llmApi.chatStream(messages, tools, (data) => {
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            });

            res.write("data: [DONE]\n\n");
            res.end();
        } catch (error: any) {
            logger.error("LLM chat failed:", error);
            // 如果响应头还没发送，发送 JSON 错误
            if (!res.headersSent) {
                return res
                    .status(500)
                    .json({ error: "Failed to process chat request" });
            }
            // 如果已经开始流式传输，发送错误事件
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    });

    // 查询MicrosoftTODO接口状态的API端点
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

    // 查询Ebridge接口状态的API端点
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

    // 解除 Exchange 绑定
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

    // 手动触发课表同步
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

    // 删除所有课程表导入的日程
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

    // ── CalDAV Server management APIs ───────────────────────────────

    // 从请求头动态推导真实服务器地址（支持 nginx 反向代理）
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

    // 设置 CalDAV 客户端兼容模式
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

    // 获取用户日志（分页、可按时间与类型过滤）
    router.get("/logs", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                limit = "50",
                offset = "0",
                since,
                until,
                type,
            } = req.query;
            const lim = Math.max(
                1,
                Math.min(500, parseInt(limit as string, 10) || 50),
            );
            const off = Math.max(0, parseInt(offset as string, 10) || 0);
            const { logs, total } = await dbService.getUserLogsPage(user.id, {
                limit: lim,
                offset: off,
                since: since as string | undefined,
                until: until as string | undefined,
                type: type as string | undefined,
            });
            return res
                .status(200)
                .json({ logs, total, limit: lim, offset: off });
        } catch (e) {
            logger.error("Fetch user logs failed:", e);
            return res.status(500).json({ error: "Failed to fetch logs" });
        }
    });

    // 创建任务（带冲突检测 + boundary 配置 + 重复实例统计）
    router.post("/tasks", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                name,
                description,
                startTime,
                endTime,
                dueDate,
                location,
                boundaryConflict,
                recurrenceRule: recurrenceRuleInput,
                importance,
                scheduleType: scheduleTypeInput,
            } = req.body || {};
            if (!name || !startTime || !endTime) {
                return res
                    .status(400)
                    .json({ error: "name, startTime, endTime required" });
            }
            let parsedRecurrence: RecurrenceRule | undefined;
            let resolvedScheduleType: ScheduleType;
            try {
                const resolved = resolveScheduleType({
                    explicit: scheduleTypeInput,
                    recurrence: recurrenceRuleInput,
                    fallback: "single",
                });
                parsedRecurrence = resolved.parsedRecurrence;
                resolvedScheduleType = resolved.scheduleType;
            } catch (err: any) {
                const msg = err?.message?.includes("recurrenceRule")
                    ? "Invalid recurrenceRule value"
                    : "Invalid scheduleType value";
                return res.status(400).json({ error: msg });
            }
            const task: Task = {
                id: uuidv4(),
                name,
                description: description || "",
                startTime,
                endTime,
                dueDate: dueDate || endTime,
                location,
                completed: false,
                pushedToMSTodo: false,
                importance: importance || "normal",
                scheduleType: resolvedScheduleType,
            };
            const effectiveBoundary =
                boundaryConflict !== undefined
                    ? !!boundaryConflict
                    : !!user.conflictBoundaryInclusive;
            if (parsedRecurrence)
                task.recurrenceRule = JSON.stringify(parsedRecurrence);

            // 冲突检测
            const conflicts = findConflictingTasks(user.tasks || [], task, {
                boundaryConflict: effectiveBoundary,
            });

            try {
                await dbService.addTask(user.id, task, effectiveBoundary, true);
            } catch (e: any) {
                throw e;
            }
            broadcastTaskChange("created", task, user.id);
            if (conflicts.length > 0) {
                await logUserEvent(
                    user.id,
                    "taskConflict",
                    `Created task with conflict ${task.name}`,
                    { id: task.id, conflicts: conflicts.map((c) => c.id) },
                );
            } else {
                await logUserEvent(
                    user.id,
                    "taskCreated",
                    `Created task ${task.name}`,
                    {
                        id: task.id,
                        startTime: task.startTime,
                        endTime: task.endTime,
                    },
                );
            }

            let createdChildren = 0,
                conflictChildren = 0,
                errorChildren = 0;
            const createdIds: string[] = [task.id];
            const instanceConflicts: any[] = [];

            if (parsedRecurrence) {
                const generated = generateRecurrenceInstances(
                    task,
                    parsedRecurrence,
                );
                for (const inst of generated) {
                    try {
                        const instConf = findConflictingTasks(
                            user.tasks || [],
                            inst,
                            { boundaryConflict: effectiveBoundary },
                        );
                        if (instConf.length > 0) {
                            instanceConflicts.push({
                                instance: {
                                    id: inst.id,
                                    startTime: inst.startTime,
                                    endTime: inst.endTime,
                                },
                                conflicts: instConf.map((c) => ({
                                    id: c.id,
                                    name: c.name,
                                    startTime: c.startTime,
                                    endTime: c.endTime,
                                })),
                            });
                            await logUserEvent(
                                user.id,
                                "taskConflict",
                                `Created recurrence instance with conflict ${inst.name}`,
                                {
                                    parentId: task.id,
                                    instanceStart: inst.startTime,
                                    instanceEnd: inst.endTime,
                                },
                            );
                        } else {
                            await logUserEvent(
                                user.id,
                                "taskCreated",
                                `Created recurrence instance ${inst.name}`,
                                {
                                    id: inst.id,
                                    parentTaskId: inst.parentTaskId,
                                    startTime: inst.startTime,
                                    endTime: inst.endTime,
                                },
                            );
                        }

                        await dbService.addTask(
                            user.id,
                            inst,
                            effectiveBoundary,
                            true,
                        );
                        createdChildren++;
                        createdIds.push(inst.id);
                        broadcastTaskChange("created", inst, user.id);
                    } catch (e: any) {
                        errorChildren++;
                        await logUserEvent(
                            user.id,
                            "taskError",
                            `Error creating recurrence instance for ${task.name}`,
                            { parentId: task.id, error: e?.message },
                        );
                    }
                }
            }
            // 增量刷新缓存：仅合并新建的任务
            await dbService.refreshUserTasksIncremental(user, {
                addedIds: createdIds,
            });
            return res.status(201).json({
                task,
                recurrenceSummary: buildRecurrenceSummary(
                    parsedRecurrence,
                    createdChildren,
                    0,
                    errorChildren,
                ),
                conflictWarning:
                    conflicts.length > 0 || instanceConflicts.length > 0
                        ? {
                              message: "Task created with time conflicts",
                              conflicts: conflicts.map((c) => ({
                                  id: c.id,
                                  name: c.name,
                                  startTime: c.startTime,
                                  endTime: c.endTime,
                              })),
                              instanceConflicts,
                          }
                        : undefined,
            });
        } catch (error) {
            logger.error("Create task failed:", error);
            return res.status(500).json({ error: "Failed to create task" });
        }
    });

    // 冲突预检接口：返回与给定时间段冲突的任务列表（支持 boundary 覆盖）
    router.post(
        "/tasks/conflicts",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { startTime, endTime, boundaryConflict } = req.body || {};
                if (!startTime || !endTime) {
                    return res
                        .status(400)
                        .json({ error: "startTime and endTime required" });
                }
                const candidate: Task = {
                    id: "candidate",
                    name: "candidate",
                    description: "",
                    startTime,
                    endTime,
                    dueDate: endTime,
                    completed: false,
                    pushedToMSTodo: false,
                };
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;
                const conflicts = findConflictingTasks(
                    user.tasks || [],
                    candidate,
                    { boundaryConflict: effectiveBoundary },
                );
                return res.status(200).json({ conflicts });
            } catch (error) {
                logger.error("Conflict pre-check failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to check conflicts" });
            }
        },
    );

    // 批量创建任务（部分成功 & 冲突与错误分离）
    router.post(
        "/tasks/batch",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { tasks, boundaryConflict } = req.body || {};
                if (!Array.isArray(tasks) || tasks.length === 0) {
                    return res
                        .status(400)
                        .json({ error: "tasks array required" });
                }
                const results: any[] = [];
                let created = 0,
                    conflictsCount = 0,
                    errors = 0;
                const batchBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : undefined;

                for (const input of tasks) {
                    const {
                        name,
                        description,
                        startTime,
                        endTime,
                        dueDate,
                        location,
                        recurrenceRule: recurrenceRuleInput,
                        importance,
                        scheduleType: scheduleTypeInput,
                    } = input || {};
                    if (!name || !startTime || !endTime) {
                        results.push({
                            input,
                            status: "error",
                            errorMessage: "name, startTime, endTime required",
                        });
                        errors++;
                        continue;
                    }
                    let parsedRecurrence: RecurrenceRule | undefined;
                    let resolvedScheduleType: ScheduleType;
                    try {
                        const resolved = resolveScheduleType({
                            explicit: scheduleTypeInput,
                            recurrence: recurrenceRuleInput,
                            fallback: "single",
                        });
                        parsedRecurrence = resolved.parsedRecurrence;
                        resolvedScheduleType = resolved.scheduleType;
                    } catch (err: any) {
                        const errorMessage = err?.message?.includes(
                            "recurrenceRule",
                        )
                            ? "Invalid recurrenceRule value"
                            : "Invalid scheduleType value";
                        results.push({ input, status: "error", errorMessage });
                        errors++;
                        continue;
                    }
                    const effectiveBoundary =
                        input.boundaryConflict !== undefined
                            ? !!input.boundaryConflict
                            : batchBoundary !== undefined
                              ? batchBoundary
                              : !!user.conflictBoundaryInclusive;
                    const task: Task = {
                        id: uuidv4(),
                        name,
                        description: description || "",
                        startTime,
                        endTime,
                        dueDate: dueDate || endTime,
                        location,
                        completed: false,
                        pushedToMSTodo: false,
                        importance: importance || "normal",
                        scheduleType: resolvedScheduleType,
                    };
                    if (parsedRecurrence)
                        task.recurrenceRule = JSON.stringify(parsedRecurrence);

                    const conflicts = findConflictingTasks(
                        user.tasks || [],
                        task,
                        { boundaryConflict: effectiveBoundary },
                    );

                    try {
                        await dbService.addTask(
                            user.id,
                            task,
                            effectiveBoundary,
                            true,
                        );
                        broadcastTaskChange("created", task, user.id);

                        if (conflicts.length > 0) {
                            await logUserEvent(
                                user.id,
                                "taskConflict",
                                `Batch created task with conflict ${task.name}`,
                                {
                                    id: task.id,
                                    startTime: task.startTime,
                                    endTime: task.endTime,
                                },
                            );
                        } else {
                            await logUserEvent(
                                user.id,
                                "taskCreated",
                                `Batch created task ${task.name}`,
                                {
                                    id: task.id,
                                    startTime: task.startTime,
                                    endTime: task.endTime,
                                },
                            );
                        }

                        let createdChildren = 0,
                            conflictChildren = 0,
                            errorChildren = 0;
                        const createdIds: string[] = [task.id];
                        const instanceConflicts: any[] = [];

                        if (parsedRecurrence) {
                            const generated = generateRecurrenceInstances(
                                task,
                                parsedRecurrence,
                            );
                            for (const inst of generated) {
                                try {
                                    const instConf = findConflictingTasks(
                                        user.tasks || [],
                                        inst,
                                        { boundaryConflict: effectiveBoundary },
                                    );
                                    if (instConf.length > 0) {
                                        instanceConflicts.push({
                                            instance: {
                                                id: inst.id,
                                                startTime: inst.startTime,
                                                endTime: inst.endTime,
                                            },
                                            conflicts: instConf.map((c) => ({
                                                id: c.id,
                                                name: c.name,
                                                startTime: c.startTime,
                                                endTime: c.endTime,
                                            })),
                                        });
                                        await logUserEvent(
                                            user.id,
                                            "taskConflict",
                                            `Batch created recurrence instance with conflict ${inst.name}`,
                                            {
                                                parentId: task.id,
                                                instanceStart: inst.startTime,
                                                instanceEnd: inst.endTime,
                                            },
                                        );
                                    } else {
                                        await logUserEvent(
                                            user.id,
                                            "taskCreated",
                                            `Batch created recurrence instance ${inst.name}`,
                                            {
                                                id: inst.id,
                                                parentTaskId: inst.parentTaskId,
                                                startTime: inst.startTime,
                                                endTime: inst.endTime,
                                            },
                                        );
                                    }

                                    await dbService.addTask(
                                        user.id,
                                        inst,
                                        effectiveBoundary,
                                        true,
                                    );
                                    createdChildren++;
                                    createdIds.push(inst.id);
                                    broadcastTaskChange(
                                        "created",
                                        inst,
                                        user.id,
                                    );
                                } catch (e: any) {
                                    errorChildren++;
                                    await logUserEvent(
                                        user.id,
                                        "taskError",
                                        `Error creating batch instance for ${task.name}`,
                                        {
                                            parentId: task.id,
                                            error: e?.message,
                                        },
                                    );
                                }
                            }
                            results.push({
                                input,
                                status: "created",
                                task,
                                recurrenceSummary: buildRecurrenceSummary(
                                    parsedRecurrence,
                                    createdChildren,
                                    0,
                                    errorChildren,
                                ),
                                conflictWarning:
                                    conflicts.length > 0 ||
                                    instanceConflicts.length > 0
                                        ? {
                                              message:
                                                  "Task created with time conflicts",
                                              conflicts: conflicts.map((c) => ({
                                                  id: c.id,
                                                  name: c.name,
                                                  startTime: c.startTime,
                                                  endTime: c.endTime,
                                              })),
                                              instanceConflicts,
                                          }
                                        : undefined,
                            });
                        } else {
                            results.push({
                                input,
                                status: "created",
                                task,
                                conflictWarning:
                                    conflicts.length > 0
                                        ? {
                                              message:
                                                  "Task created with time conflicts",
                                              conflicts: conflicts.map((c) => ({
                                                  id: c.id,
                                                  name: c.name,
                                                  startTime: c.startTime,
                                                  endTime: c.endTime,
                                              })),
                                          }
                                        : undefined,
                            });
                        }
                        // 增量刷新缓存：合并新建 id
                        await dbService.refreshUserTasksIncremental(user, {
                            addedIds: createdIds,
                        });
                        created++;
                    } catch (e: any) {
                        errors++;
                        results.push({
                            input,
                            status: "error",
                            errorMessage: e?.message || "unknown error",
                        });
                        await logUserEvent(
                            user.id,
                            "taskError",
                            `Error creating task ${name}`,
                            { startTime, endTime, error: e?.message },
                        );
                    }
                }
                return res.status(200).json({
                    results,
                    summary: {
                        total: tasks.length,
                        created,
                        conflicts: 0,
                        errors,
                    }, // conflicts count is 0 because we created them
                });
            } catch (error) {
                logger.error("Batch task creation failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to create batch tasks" });
            }
        },
    );

    // 设置用户级冲突边界模式
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

    // 获取当前周信息（包含全局偏移与用户偏移）
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

    // 更新用户级周数偏移（可通过提供currentWeek来设置当前周数）
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

    // 更新任务（部分字段 + 冲突检测）
    router.put("/tasks/:id", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const taskId = req.params.id;
            const existing = user.tasks.find((t) => t.id === taskId);
            if (!existing)
                return res.status(404).json({ error: "task not found" });
            const {
                name,
                description,
                startTime,
                endTime,
                dueDate,
                location,
                completed,
                boundaryConflict,
                importance,
                recurrenceRule: recurrenceRuleInput,
                scheduleType: scheduleTypeInput,
            } = req.body || {};
            const recurrenceSource =
                recurrenceRuleInput !== undefined
                    ? recurrenceRuleInput
                    : existing.recurrenceRule;
            let parsedRecurrence: RecurrenceRule | undefined;
            let resolvedScheduleType: ScheduleType;
            try {
                const resolved = resolveScheduleType({
                    explicit: scheduleTypeInput,
                    recurrence: recurrenceSource,
                    fallback: existing.scheduleType || "single",
                });
                parsedRecurrence = resolved.parsedRecurrence;
                resolvedScheduleType = resolved.scheduleType;
            } catch (err: any) {
                const msg = err?.message?.includes("recurrenceRule")
                    ? "Invalid recurrenceRule value"
                    : "Invalid scheduleType value";
                return res.status(400).json({ error: msg });
            }
            const recurrenceString =
                recurrenceRuleInput !== undefined
                    ? parsedRecurrence
                        ? JSON.stringify(parsedRecurrence)
                        : undefined
                    : existing.recurrenceRule;

            // 构建更新后的任务对象（不直接修改原对象，先复制）
            const updated: Task = {
                ...existing,
                name: name !== undefined ? name : existing.name,
                description:
                    description !== undefined
                        ? description
                        : existing.description,
                startTime:
                    startTime !== undefined ? startTime : existing.startTime,
                endTime: endTime !== undefined ? endTime : existing.endTime,
                dueDate: dueDate !== undefined ? dueDate : existing.dueDate,
                location: location !== undefined ? location : existing.location,
                completed:
                    completed !== undefined ? !!completed : existing.completed,
                importance:
                    importance !== undefined ? importance : existing.importance,
                scheduleType: resolvedScheduleType,
                recurrenceRule: recurrenceString,
            };
            try {
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;

                // 冲突检测
                const conflicts = findConflictingTasks(
                    user.tasks.filter((t) => t.id !== updated.id),
                    updated,
                    { boundaryConflict: effectiveBoundary },
                );

                await dbService.updateTask(updated, effectiveBoundary, true);
                broadcastTaskChange("updated", updated, user.id);

                if (conflicts.length > 0) {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Updated task with conflict ${updated.name}`,
                        {
                            id: updated.id,
                            changes: {
                                name,
                                description,
                                startTime,
                                endTime,
                                dueDate,
                                location,
                                completed,
                                importance,
                            },
                            conflicts: conflicts.map((c) => c.id),
                        },
                    );
                } else {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Updated task ${updated.name}`,
                        {
                            id: updated.id,
                            changes: {
                                name,
                                description,
                                startTime,
                                endTime,
                                dueDate,
                                location,
                                completed,
                                importance,
                            },
                        },
                    );
                }

                if (completed === true && !existing.completed) {
                    broadcastTaskChange("completed", updated, user.id);
                    await logUserEvent(
                        user.id,
                        "taskCompleted",
                        `Completed task ${updated.name}`,
                        { id: updated.id },
                    );
                }
                // 增量刷新缓存：仅合并被更新的任务
                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [updated.id],
                });
                return res.status(200).json({
                    task: updated,
                    conflictWarning:
                        conflicts.length > 0
                            ? {
                                  message: "Task updated with time conflicts",
                                  conflicts: conflicts.map((c) => ({
                                      id: c.id,
                                      name: c.name,
                                      startTime: c.startTime,
                                      endTime: c.endTime,
                                  })),
                              }
                            : undefined,
                });
            } catch (e: any) {
                logger.error("Failed to update task:", e);
                return res.status(500).json({ error: "Failed to update task" });
            }
        } catch (error) {
            logger.error("Unexpected error in PUT /tasks/:id:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    // 部分更新任务
    router.patch(
        "/tasks/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id;
                const updates = req.body;

                // 过滤掉不允许直接修改的字段
                delete updates.id;
                delete updates.userId;
                delete updates.createdAt;
                delete updates.updatedAt;

                if (Object.keys(updates).length === 0) {
                    return res
                        .status(400)
                        .json({ error: "No update fields provided" });
                }

                const boundaryConflict = updates.boundaryConflict;
                delete updates.boundaryConflict;

                const existingTask = await dbService.getTaskById(taskId);
                if (!existingTask) {
                    return res.status(404).json({ error: "Task not found" });
                }

                const scheduleTypeExplicit = updates.scheduleType;
                const recurrenceProvided = Object.prototype.hasOwnProperty.call(
                    updates,
                    "recurrenceRule",
                );
                const recurrenceSource = recurrenceProvided
                    ? updates.recurrenceRule
                    : existingTask.recurrenceRule;
                let parsedRecurrence: RecurrenceRule | undefined;
                let resolvedScheduleType: ScheduleType;
                try {
                    const resolved = resolveScheduleType({
                        explicit: scheduleTypeExplicit,
                        recurrence: recurrenceSource,
                        fallback: existingTask.scheduleType || "single",
                    });
                    parsedRecurrence = resolved.parsedRecurrence;
                    resolvedScheduleType = resolved.scheduleType;
                } catch (err: any) {
                    const msg = err?.message?.includes("recurrenceRule")
                        ? "Invalid recurrenceRule value"
                        : "Invalid scheduleType value";
                    return res.status(400).json({ error: msg });
                }

                if (recurrenceProvided) {
                    updates.recurrenceRule = parsedRecurrence
                        ? JSON.stringify(parsedRecurrence)
                        : null;
                }
                if (scheduleTypeExplicit !== undefined || recurrenceProvided) {
                    updates.scheduleType = resolvedScheduleType;
                }

                const wasCompleted = existingTask.completed;

                const updatedTask = await dbService.patchTask(
                    user.id,
                    taskId,
                    updates,
                    boundaryConflict,
                    true,
                );

                // 冲突检测 (需要构建完整的对象)
                const fullUpdatedTask = {
                    ...existingTask,
                    ...updates,
                    id: taskId,
                };
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;
                let conflicts: any[] = [];
                if (updates.startTime || updates.endTime) {
                    conflicts = findConflictingTasks(
                        user.tasks.filter((t) => t.id !== taskId),
                        fullUpdatedTask,
                        { boundaryConflict: effectiveBoundary },
                    );
                }

                broadcastTaskChange("updated", updatedTask, user.id);

                if (conflicts.length > 0) {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Patched task with conflict ${updatedTask.name}`,
                        {
                            id: updatedTask.id,
                            changes: updates,
                            conflicts: conflicts.map((c) => c.id),
                        },
                    );
                } else {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Patched task ${updatedTask.name}`,
                        { id: updatedTask.id, changes: updates },
                    );
                }

                if (updates.completed === true && !wasCompleted) {
                    broadcastTaskChange("completed", updatedTask, user.id);
                    await logUserEvent(
                        user.id,
                        "taskCompleted",
                        `Completed task ${updatedTask.name}`,
                        { id: updatedTask.id },
                    );
                }

                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [taskId],
                });

                const response: any = { ...updatedTask };
                if (conflicts.length > 0) {
                    response.conflictWarning = {
                        message: "Task patched with time conflicts",
                        conflicts: conflicts.map((c) => ({
                            id: c.id,
                            name: c.name,
                            startTime: c.startTime,
                            endTime: c.endTime,
                        })),
                    };
                }
                return res.status(200).json(response);
            } catch (error: any) {
                logger.error("Patch task failed:", error);
                return res.status(500).json({ error: "Failed to patch task" });
            }
        },
    );

    // 删除任务（支持级联删除 cascade=true）
    router.delete(
        "/tasks/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id;
                const existingIndex = user.tasks.findIndex(
                    (t) => t.id === taskId,
                );
                if (existingIndex < 0)
                    return res.status(404).json({ error: "task not found" });
                const cascade =
                    (req.query.cascade || "false").toString().toLowerCase() ===
                    "true";
                if (!cascade) {
                    const deletedTask = user.tasks[existingIndex];
                    const deletedOk = await dbService.deleteTask(taskId);
                    if (deletedOk) {
                        broadcastTaskChange("deleted", deletedTask, user.id);
                        await logUserEvent(
                            user.id,
                            "taskDeleted",
                            `Deleted task ${deletedTask.name}`,
                            { id: deletedTask.id },
                        );
                        // 增量刷新缓存：移除已删除 id
                        await dbService.refreshUserTasksIncremental(user, {
                            deletedIds: [taskId],
                        });
                        return res
                            .status(200)
                            .json({ id: taskId, deleted: true });
                    }
                    return res
                        .status(500)
                        .json({ error: "Failed to delete task" });
                } else {
                    // 级联删除：删除根任务和所有 parentTaskId 指向它的子实例
                    const toDeleteIds = new Set<string>();
                    toDeleteIds.add(taskId);
                    // 收集子实例
                    for (const t of user.tasks) {
                        if (t.parentTaskId === taskId) toDeleteIds.add(t.id);
                    }
                    const deletedItems: Task[] = [];
                    let anyFailed = false;
                    for (const id of Array.from(toDeleteIds)) {
                        try {
                            const ok = await dbService.deleteTask(id);
                            if (ok) {
                                const item = user.tasks.find(
                                    (tt) => tt.id === id,
                                );
                                if (item) deletedItems.push(item);
                            } else {
                                anyFailed = true;
                            }
                        } catch (e) {
                            anyFailed = true;
                        }
                    }
                    // 广播已删除项
                    for (const del of deletedItems) {
                        broadcastTaskChange("deleted", del, user.id);
                        await logUserEvent(
                            user.id,
                            "taskDeleted",
                            `Cascade deleted task ${del.name}`,
                            { id: del.id, parentId: del.parentTaskId || null },
                        );
                    }
                    if (anyFailed)
                        return res.status(500).json({
                            error: "Failed to fully delete cascade tasks",
                        });
                    // 增量刷新缓存：移除已删除的所有 id
                    await dbService.refreshUserTasksIncremental(user, {
                        deletedIds: Array.from(toDeleteIds),
                    });
                    return res.status(200).json({
                        id: taskId,
                        deleted: true,
                        cascadeDeleted: true,
                        count: toDeleteIds.size,
                    });
                }
            } catch (error) {
                logger.error("Unexpected error in DELETE /tasks/:id:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        },
    );

    // 列出任务（支持时间过滤、分页与排序）
    // 支持 query: start,end,page,limit OR offset, sortBy=(startTime|dueDate|name), order=(asc|desc)
    router.get("/tasks", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                start,
                end,
                limit = "50",
                offset,
                page,
                q,
                completed,
                sortBy,
                order,
            } = req.query;
            const limNum = Math.max(
                1,
                Math.min(200, parseInt((limit as string) || "50", 10) || 50),
            );
            let offNum = 0;
            if (typeof page !== "undefined") {
                const pageNum = Math.max(0, parseInt(page as string, 10) || 0);
                offNum = pageNum * limNum;
            } else {
                offNum = Math.max(
                    0,
                    parseInt((offset as string) || "0", 10) || 0,
                );
            }

            const parsedCompleted =
                typeof completed === "string"
                    ? completed.toLowerCase() === "true"
                    : undefined;
            const parsedOrder =
                order && (order as string).toLowerCase() === "desc"
                    ? "desc"
                    : "asc";
            const opts: {
                start?: string;
                end?: string;
                q?: string;
                completed?: boolean;
                limit: number;
                offset: number;
                sortBy?: string;
                order?: "asc" | "desc";
            } = {
                start: start as string | undefined,
                end: end as string | undefined,
                q: q as string | undefined,
                completed: parsedCompleted as boolean | undefined,
                limit: limNum,
                offset: offNum,
                sortBy: sortBy as string | undefined,
                order: parsedOrder,
            };
            const { tasks, total } = await dbService.getTasksPage(
                user.id,
                opts,
            );
            return res.status(200).json({
                tasks,
                total,
                limit: limNum,
                offset: offNum,
                sortBy: opts.sortBy || "startTime",
                order: opts.order || "asc",
            });
        } catch (error) {
            logger.error("Failed to list tasks:", error);
            return res.status(500).json({ error: "Failed to list tasks" });
        }
    });

    // 列出所有父级日程（即带有 recurrenceRule 的根任务）及其子实例
    router.get(
        "/tasks/parents",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                // 拉取所有任务并筛选父任务
                const { tasks } = await dbService.getTasksPage(user.id, {
                    limit: 1000,
                });
                const parents = tasks.filter(
                    (t) => t.recurrenceRule && !t.parentTaskId,
                );

                const result: any[] = [];
                for (const p of parents) {
                    try {
                        const { occurrences, total } =
                            await dbService.getOccurrencesPage(user.id, p.id, {
                                limit: 1000,
                            });
                        result.push({ parentTask: p, occurrences, total });
                    } catch (e) {
                        // 如果某个父任务查询失败，仍继续处理其它任务
                        result.push({
                            parentTask: p,
                            occurrences: [],
                            total: 0,
                            error: (e as Error).message,
                        });
                    }
                }

                return res.status(200).json({ parents: result });
            } catch (error) {
                logger.error("Failed to list parent tasks:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to list parent tasks" });
            }
        },
    );

    // recurrence helpers moved to server/Services/recurrence.ts

    // 获取某任务的所有重复实例（支持分页：page & limit，或 offset & limit；支持 sortBy & order）
    router.get(
        "/tasks/:id/occurrences",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const rootId = req.params.id;
                const {
                    limit = "50",
                    offset,
                    page,
                    sortBy = "startTime",
                    order = "asc",
                } = req.query;
                const limNum = Math.max(
                    1,
                    Math.min(
                        500,
                        parseInt((limit as string) || "50", 10) || 50,
                    ),
                );
                let offNum = 0;
                if (typeof page !== "undefined") {
                    const pageNum = Math.max(
                        0,
                        parseInt(page as string, 10) || 0,
                    );
                    offNum = pageNum * limNum;
                } else {
                    offNum = Math.max(
                        0,
                        parseInt((offset as string) || "0", 10) || 0,
                    );
                }

                const root = await dbService.getTaskById(rootId);
                if (!root)
                    return res.status(404).json({ error: "Task not found" });
                const parsedOrder =
                    order && (order as string).toLowerCase() === "desc"
                        ? "desc"
                        : "asc";
                const { occurrences, total } =
                    await dbService.getOccurrencesPage(user.id, rootId, {
                        limit: limNum,
                        offset: offNum,
                        sortBy: sortBy as string,
                        order: parsedOrder,
                    });
                return res.status(200).json({
                    rootTask: root,
                    occurrences,
                    total,
                    limit: limNum,
                    offset: offNum,
                    sortBy: sortBy || "startTime",
                    order: order || "asc",
                });
            } catch (e) {
                logger.error("Fetch occurrences failed", e);
                return res
                    .status(500)
                    .json({ error: "Failed to fetch occurrences" });
            }
        },
    ); // 获取当前用户的日程队列
    router.get(
        "/schedule-queue",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                if (!user?.id)
                    return res
                        .status(401)
                        .json({ error: "未登录或无用户信息" });
                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ queue });
            } catch (err: any) {
                logger.error("获取日程队列失败:", err);
                res.status(500).json({ error: "获取队列失败" });
            }
        },
    );

    // Approve a queued schedule request
    router.post(
        "/schedule-queue/:id/approve",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const id = req.params.id as string;
                const allowConflict = req?.body?.allowConflict === true;
                const row = await dbService.getScheduleQueueById(id);
                if (!row)
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                if (row.userId !== user.id)
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });

                const raw = row.rawRequest;
                let parsed: any = null;
                try {
                    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
                } catch (parseError) {
                    logger.warn(
                        "Failed to parse schedule queue rawRequest, using empty args",
                        parseError,
                    );
                }
                const args = parsed?.args || parsed || {};
                const normalizedArgs = normalizeQueueScheduleArgs(args);

                if (
                    !allowConflict &&
                    normalizedArgs.startTime &&
                    normalizedArgs.endTime &&
                    !normalizedArgs.recurrenceRule
                ) {
                    const { tasks: existingTasks } =
                        await dbService.getTasksPage(user.id, {
                            start: normalizedArgs.startTime,
                            end: normalizedArgs.endTime,
                            limit: 200,
                        });
                    const conflicts = findConflictingTasks(
                        existingTasks,
                        {
                            id: "new-task",
                            startTime: normalizedArgs.startTime,
                            endTime: normalizedArgs.endTime,
                        },
                        { boundaryConflict: !!user.conflictBoundaryInclusive },
                    );

                    if (conflicts.length > 0) {
                        return res
                            .status(409)
                            .json({ error: "日程冲突", conflicts });
                    }
                }

                // Call add_schedule with internal approval flag
                const result = await mcpTools.add_schedule.execute(
                    {
                        ...normalizedArgs,
                        _internal_approve: true,
                        _internal_allow_conflict: allowConflict,
                    },
                    user,
                );

                const createdTask = (result as any)?.task;
                const contentText = Array.isArray((result as any)?.content)
                    ? (result as any).content.find(
                          (c: any) => c?.type === "text",
                      )?.text
                    : undefined;

                if (!createdTask?.id) {
                    const message =
                        typeof contentText === "string"
                            ? contentText
                            : "Schedule approval did not create a task";
                    await dbService.updateScheduleQueueStatus(id, "failed");
                    await logUserEvent(
                        user.id,
                        "external_schedule_approve_failed",
                        `审批失败: ${message}`,
                        {
                            queueId: id,
                            reason: message,
                            args: normalizedArgs,
                        },
                    );
                    const queue = await dbService.getScheduleQueueByUser(
                        user.id,
                    );
                    return res
                        .status(422)
                        .json({ error: message, result, queue });
                }

                // Remove queue item (approved) and return latest queue
                try {
                    await dbService.deleteScheduleQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete schedule queue item after approval, will fallback to marking approved",
                        e,
                    );
                    await dbService.updateScheduleQueueStatus(id, "approved");
                }

                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ result, queue });
            } catch (err: any) {
                logger.error("Approving schedule queue item failed:", err);
                res.status(500).json({ error: "Approve failed" });
            }
        },
    );

    // Reject a queued schedule request
    router.post(
        "/schedule-queue/:id/reject",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const id = req.params.id as string;
                const row = await dbService.getScheduleQueueById(id);
                if (!row)
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                if (row.userId !== user.id)
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });

                // Remove rejected item from queue and return updated queue
                try {
                    await dbService.deleteScheduleQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete schedule queue item after rejection, will fallback to marking rejected",
                        e,
                    );
                    await dbService.updateScheduleQueueStatus(id, "rejected");
                }
                await logUserEvent(
                    user.id,
                    "external_schedule_rejected",
                    `已拒绝外部日程请求`,
                    { queueId: id },
                );
                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ ok: true, queue });
            } catch (err: any) {
                logger.error("Rejecting schedule queue item failed:", err);
                res.status(500).json({ error: "Reject failed" });
            }
        },
    );

    // ── 邮件查看接口 ──────────────────────────────────────

    interface QueueEmailPayload {
        args?: Record<string, unknown>;
        email?: {
            id: string;
            subject: string;
            from?: { name: string; address: string };
            receivedAt: string;
            isRead: boolean;
            body?: string;
            hasAttachments?: boolean;
            attachmentsCount?: number;
        };
        _meta?: { source?: string; createdAt?: string };
    }

    interface EmailViewResponse {
        email: {
            id: string;
            subject: string;
            from?: { name: string; address: string };
            receivedAt: string;
            isRead: boolean;
            body: string;
            hasAttachments?: boolean;
            attachmentsCount?: number;
            source?: string;
        };
    }

    router.get(
        "/emails/:emailId",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const emailId = req.params.emailId;
                const queue = await dbService.getScheduleQueueByUser(user.id);

                // 先从队列缓存中查找
                for (const item of queue) {
                    let parsed: QueueEmailPayload | null = null;
                    try {
                        parsed = JSON.parse(
                            item.rawRequest,
                        ) as QueueEmailPayload;
                    } catch {
                        continue;
                    }
                    if (parsed?.email?.id === emailId) {
                        const e = parsed.email!;
                        return res.status(200).json({
                            email: {
                                id: e.id,
                                subject: e.subject,
                                from: e.from,
                                receivedAt: e.receivedAt,
                                isRead: e.isRead,
                                body: e.body || "",
                                hasAttachments: e.hasAttachments,
                                attachmentsCount: e.attachmentsCount,
                                source: parsed._meta?.source,
                            },
                        } satisfies EmailViewResponse);
                    }
                }

                // 队列未命中，从 IMAP/Exchange 实时获取
                if (user.imapClient) {
                    try {
                        const email =
                            await user.imapClient.getEmailById(emailId);
                        return res.status(200).json({
                            email: {
                                ...email,
                                body: email.body || "",
                                source: "imap",
                            },
                        } satisfies EmailViewResponse);
                    } catch {
                        /* fall through */
                    }
                }
                if (user.emsClient) {
                    try {
                        const email =
                            await user.emsClient.getEmailById(emailId);
                        return res.status(200).json({
                            email: {
                                ...email,
                                body: email.body || "",
                                source: "exchange",
                            },
                        } satisfies EmailViewResponse);
                    } catch {
                        /* fall through */
                    }
                }

                return res.status(404).json({ error: "Email not found" });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to fetch email:", message);
                return res.status(500).json({ error: "Failed to fetch email" });
            }
        },
    );

    return router;
}
