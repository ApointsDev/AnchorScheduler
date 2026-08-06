// 后台定时任务调度
// 职责：按周期遍历所有用户，触发 Exchange 同步、IMAP 连接、MS Todo 推送、课表拉取
// 具体处理逻辑拆分到各独立函数中

import axios from "axios";
import moment from "moment";
import { toShanghaiISO } from "./Utils/time.js";
import { v4 as uuidv4 } from "uuid";
import { ExchangeClient } from "./Services/exchangeClient";
import { ImapClient } from "./Services/imapClient";
import { dbService } from "./Services/dbService";
import type { ExchangeConfig, ScheduleType } from "./Services/types";
import { findConflictingTasks } from "./Services/scheduleConflict";
import { broadcastTaskChange, broadcastSmtpError } from "./Services/websocket";
import { logUserEvent } from "./Services/userLog";
import { syncUserTimetable } from "./Services/timetable";
import { logger } from "./Utils/logger.js";
import jwt from "jsonwebtoken";
import { ensureCafTokenValid, createCafConfig } from "./Services/cafAuth";
import { processEmailWithLLM } from "./Services/emailProcessor";
import type { CafConfig } from "./Services/cafAuth";
import type { User } from "./types/models";
import {
    isChaoxingSyncing,
    syncChaoxingUser,
} from "./Services/chaoxing/syncService";
import { isDue } from "./Services/chaoxing/scheduleNext";

// 注意：为避免循环依赖，这里本地定义 Task 类型签名（与 types/models.ts 一致）
interface Task {
    id: string;
    name: string;
    description: string;
    dueDate: string;
    startTime: string;
    endTime: string;
    location?: string;
    completed: boolean;
    pushedToMSTodo: boolean;
    body?: string;
    attendees?: string[];
    recurrenceRule?: string;
    parentTaskId?: string;
    importance?: "high" | "normal" | "low";
    isReminderOn?: boolean;
    scheduleType?: ScheduleType;
}

// ── JWT 验证（本地副本，避免循环依赖）──────────────────────

const JWT_SECRET = process.env.JWT_SECRET || "";
function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch {
        return null;
    }
}

export interface IntervalController {
    stop: () => void;
}

// ── CAF token 刷新（供 IMAP 使用）─────────────────────────

async function ensureCafTokenForImap(
    cafConfig: CafConfig,
    user: User,
): Promise<string | null> {
    return ensureCafTokenValid(cafConfig, user);
}

// ── Exchange 事件同步 ─────────────────────────────────────

async function syncExchangeEvents(user: User): Promise<void> {
    const useOAuth = !!(user.ExchangeBinded && user.ExchangeAccessToken);
    const useBasic = !!(user.XJTLUPassword && user.XJTLUaccount);

    if ((!useOAuth && !useBasic) || user.emsClient) {
        return;
    }

    const exchangeConfig: ExchangeConfig = {
        exchangeUrl:
            process.env.EXCHANGE_URL ||
            "https://mail.xjtlu.edu.cn/EWS/Exchange.asmx",
        username: user.email.split("@")[0],
        password: user.XJTLUPassword || "",
        domain: process.env.EXCHANGE_DOMAIN || "xjtlu.edu.cn",
        scope: process.env.EXCHANGE_SCOPE,
        openaiApiKey: process.env.OPENAI_API_KEY || "",
        openaiModel: process.env.OPENAI_MODEL || "deepseek-chat",
        MStoken: user.MStoken,
    };

    if (useOAuth) {
        exchangeConfig.oauthToken = user.ExchangeAccessToken;
        exchangeConfig.refreshToken = user.ExchangeRefreshToken;
        exchangeConfig.clientId = process.env.EXCHANGE_CLIENT_ID;
        exchangeConfig.clientSecret = process.env.EXCHANGE_CLIENT_SECRET;
        exchangeConfig.tokenUrl =
            process.env.EXCHANGE_TOKEN_URL ||
            "https://login.microsoftonline.com/common/oauth2/v2.0/token";
        logger.info(`Using OAuth for Exchange User ${user.id}`);
    } else {
        logger.info(
            `Using Basic Auth for Exchange User ${user.id} (Deprecated flow)`,
        );
    }

    logger.info(`Launching ExchangeClient for user ${user.id}`);
    const emailClient = new ExchangeClient(exchangeConfig, user);

    try {
        const events = await emailClient.getEvents(
            toShanghaiISO(moment().subtract(1, "day").toDate()),
            toShanghaiISO(moment().add(1, "day").toDate()),
        );

        logger.info(`Fetched ${events.length} events for user ${user.id}`);
        await logUserEvent(
            user.id,
            "eventsFetched",
            `Fetched ${events.length} calendar events`,
            { count: events.length },
        );

        for (const event of events) {
            if (user.tasks.find((t) => t.id === event.id)) continue;

            const newTask: Task = {
                id: event.id || uuidv4(),
                name: event.subject,
                startTime: event.start,
                endTime: event.end,
                location: event.location || "",
                body: event.body || "",
                attendees: event.attendees || [],
                description: event.body || "",
                dueDate: event.end,
                completed: false,
                pushedToMSTodo: false,
                scheduleType: "single",
                importance: event.importance,
                isReminderOn: event.isReminderOn,
            };

            try {
                const conflicts = findConflictingTasks(user.tasks, newTask, {
                    boundaryConflict: !!user.conflictBoundaryInclusive,
                });

                await dbService.addTask(
                    user.id,
                    newTask,
                    !!user.conflictBoundaryInclusive,
                    user.isConflictScheduleAllowed,
                );
                broadcastTaskChange("created", newTask, user.id);
                await dbService.refreshUserTasksIncremental(user, {
                    addedIds: [newTask.id],
                });

                const eventType =
                    conflicts.length > 0
                        ? "taskConflictWarning"
                        : "taskCreated";
                const eventMsg =
                    conflicts.length > 0
                        ? `Added conflicting calendar event with warning: ${newTask.name}`
                        : `Created task from calendar event: ${newTask.name}`;
                const extra: any = {
                    id: newTask.id,
                    source: "Exchange",
                    startTime: newTask.startTime,
                    endTime: newTask.endTime,
                };
                if (conflicts.length > 0)
                    extra.conflicts = conflicts.map((c) => c.id);

                await logUserEvent(user.id, eventType, eventMsg, extra);

                if (conflicts.length > 0) {
                    logger.warn(
                        `Added conflicting event task ${newTask.id} for user ${user.id}`,
                    );
                }
            } catch (e: any) {
                logger.error(
                    `Failed to persist event task ${newTask.id} for user ${user.id}:`,
                    e,
                );
                await logUserEvent(
                    user.id,
                    "taskError",
                    `Failed to persist calendar event: ${newTask.name}`,
                    { id: newTask.id, error: e?.message },
                );
            }
        }
    } catch (error: any) {
        logger.error(`Failed to get events for user ${user.id}:`, error);
        await logUserEvent(
            user.id,
            "eventsError",
            "Failed to fetch calendar events",
            { error: error?.message },
        );
    }

    user.emsClient = emailClient;

    // 首次连接时拉取最近 N 封历史邮件
    if (user.mailReadingSpan > 0) {
        const count = user.mailReadingSpan;
        logger.info(
            `Exchange initial fetch for user ${user.id}, last ${count} emails`,
        );
        try {
            const emails = await emailClient.findEmails(count);
            for (const email of emails) {
                const full = await emailClient.getEmailById(email.id);
                await emailClient.autoProcessNewEmail(full);
            }
        } catch (err: any) {
            logger.error(
                `Exchange initial fetch failed for user ${user.id}: ${err.message}`,
            );
        }
        user.mailReadingSpan = 0;
        await dbService.updateUser(user);
    }
}

// ── IMAP 连接 ─────────────────────────────────────────────

interface ImapRetryState {
    count: number;
    lastError: string;
}

async function startImapForUser(
    user: User,
    cafConfig: CafConfig,
    imapRetryCount: Map<string, ImapRetryState>,
    maxRetries: number,
): Promise<void> {
    // 用户通过 ImapHost/ImapPort 收信
    const hasImap = !!(
        user.ImapBinded &&
        user.ImapEmail &&
        (user.ImapHost || cafConfig.imapHost) &&
        (user.ImapPort || cafConfig.imapPort)
    );
    const hasCreds = !!(hasImap && (user.ImapPassword || user.CAFAccessToken));
    if (!hasCreds || user.imapClient) return;

    let imapPassword: string;
    let useOAuth = false;

    if (user.CAFAccessToken) {
        const validToken = await ensureCafTokenForImap(cafConfig, user);
        if (!validToken) {
            logger.warn(
                `CAF token not available for ${user.id} (expired or refresh failed), skipping IMAP`,
            );
            return;
        }
        imapPassword = validToken;
        useOAuth = true;
    } else {
        imapPassword = user.ImapPassword || "";
    }

    const imapHost = user.ImapHost || cafConfig.imapHost;
    const imapPort = user.ImapPort || cafConfig.imapPort;
    const imapTls = user.ImapTls ?? true;

    const imapConfig = {
        host: imapHost,
        port: imapPort,
        tls: imapTls,
        username: user.ImapEmail!,
        password: imapPassword,
        useOAuth,
    };

    logger.info(
        `Launching ImapClient for user ${user.id} with IDLE push${useOAuth ? " (CAF OIDC)" : ""}`,
    );
    const imapClient = new ImapClient(imapConfig);
    user.imapClient = imapClient;

    imapClient
        .startIdle(async (fullEmail) => {
            await processImapEmail(user, fullEmail);
        })
        .catch(async (err: any) => {
            const errorMsg = err.message || "未知错误";
            const isAuthError =
                /auth|login|credential|unauthorized|token|expired|AUTHENTICATIONFAILED/i.test(
                    errorMsg,
                );
            logger.error(
                `Failed to start IMAP IDLE for user ${user.id}: ${errorMsg}`,
            );

            user.imapClient = undefined;

            // 认证相关错误：token 可能已过期，清除 CAF token 让用户重新登录
            if (isAuthError && user.CAFAccessToken) {
                logger.warn(
                    `IMAP auth error for ${user.id}, clearing CAF tokens`,
                );
                user.CAFAccessToken = undefined;
                user.CAFRefreshToken = undefined;
                user.CAFTokenExpiresAt = undefined;
                imapRetryCount.delete(user.id);
                try {
                    await dbService.updateUser(user);
                } catch {
                    /* ignore */
                }
                broadcastSmtpError(
                    user.id,
                    `CAF 认证已过期，IMAP 连接失败。请重新登录以刷新认证令牌。`,
                );
                return;
            }

            const retry = imapRetryCount.get(user.id) || {
                count: 0,
                lastError: "",
            };
            retry.count++;
            retry.lastError = errorMsg;
            imapRetryCount.set(user.id, retry);

            if (retry.count >= maxRetries) {
                logger.error(
                    `IMAP for user ${user.id} failed ${retry.count} times, marking IMAP as unbound`,
                );
                user.ImapBinded = false;
                user.imapClient = undefined;
                imapRetryCount.delete(user.id);
                try {
                    await dbService.updateUser(user);
                } catch {
                    /* ignore */
                }
                broadcastSmtpError(
                    user.id,
                    `IMAP 连接失败（已重试 ${retry.count} 次）：${errorMsg}。IMAP 绑定已自动解除，请前往设置页面重新绑定。`,
                );
            }
        });

    logger.info(`IMAP IDLE listener started for user ${user.id}`);

    // 首次连接时拉取最近 N 封历史邮件
    if (user.mailReadingSpan > 0) {
        const count = user.mailReadingSpan;
        logger.info(
            `IMAP initial fetch for user ${user.id}, last ${count} emails`,
        );
        try {
            const emails = await imapClient.findEmails(count);
            for (const email of emails) {
                await processImapEmail(user, email);
            }
        } catch (err: any) {
            logger.error(
                `IMAP initial fetch failed for user ${user.id}: ${err.message}`,
            );
        }
        user.mailReadingSpan = 0;
        await dbService.updateUser(user);
    }
}

// ── IMAP 邮件处理（统一管道）────────────────────────────

async function processImapEmail(user: User, fullEmail: any): Promise<void> {
    // 防止重复 AI 处理：检查该邮件是否已被处理过
    const emailId = fullEmail.id || fullEmail.uid;
    if (emailId) {
        const alreadyProcessed = await dbService.isEmailAiProcessed(
            user.id,
            String(emailId),
            "imap",
        );
        if (alreadyProcessed) {
            logger.info(
                `IMAP 邮件 ${emailId} (${fullEmail.subject}) 已 AI 处理过，跳过`,
            );
            return;
        }
    }

    logger.info(`IMAP IDLE 收到新邮件: ${fullEmail.subject}, 交由 LLM 处理`);

    let aiSuccess = false;
    if (user.emsClient) {
        try {
            await user.emsClient.autoProcessNewEmail(fullEmail);
            aiSuccess = true;
        } catch (err: any) {
            logger.error(
                `IDLE 邮件 LLM 处理失败: ${err.message || "未知错误"}`,
            );
        }
    } else {
        try {
            await processEmailWithLLM(user, fullEmail, "imap");
            aiSuccess = true;
        } catch (err: any) {
            logger.error(
                `IMAP 邮件 LLM 处理失败: ${err.message || "未知错误"}`,
            );
        }
    }

    // 标记 AI 已处理（成功后持久化，防止重启后重复处理）
    if (aiSuccess && emailId) {
        try {
            await dbService.markEmailAiProcessed(
                user.id,
                String(emailId),
                "imap",
            );
        } catch (err: any) {
            logger.error(`标记 AI 已处理失败: ${err.message || "未知错误"}`);
        }
    }

    await logUserEvent(
        user.id,
        "emailProcessed",
        `Processed IMAP email via IDLE: ${fullEmail.subject}`,
        { emailId: fullEmail.id, subject: fullEmail.subject },
    );
}

// ── MS Todo 推送 ──────────────────────────────────────────

async function pushTasksToMsTodo(user: User): Promise<void> {
    for (const task of user.tasks) {
        if (task.pushedToMSTodo) continue;
        if (!user.MStoken || !user.MSbinded) continue;

        const headers = {
            Authorization: `Bearer ${user.MStoken}`,
            "Content-Type": "application/json",
        };

        try {
            const listsRes = await axios.get(
                "https://graph.microsoft.com/v1.0/me/todo/lists",
                { headers },
            );
            let targetList = (listsRes.data as any).value.find(
                (l: any) => l.wellknownName === "myDay",
            );
            if (!targetList) {
                targetList =
                    (listsRes.data as any).value.find(
                        (l: any) => l.wellknownName === "defaultList",
                    ) || (listsRes.data as any).value[0];
            }
            if (!targetList) throw new Error("No list found");

            const payload: any = {
                title: task.name,
                body: {
                    content: task.description || "",
                    contentType: "text",
                },
                dueDateTime: { dateTime: task.dueDate, timeZone: "UTC" },
                startDateTime: task.startTime
                    ? { dateTime: task.startTime, timeZone: "UTC" }
                    : undefined,
                importance: task.importance || "normal",
                status: task.completed ? "completed" : "notStarted",
            };
            if (task.isReminderOn && task.startTime) {
                payload.reminderDateTime = {
                    dateTime: task.startTime,
                    timeZone: "UTC",
                };
            }

            await axios.post(
                `https://graph.microsoft.com/v1.0/me/todo/lists/${targetList.id}/tasks`,
                payload,
                { headers },
            );

            task.pushedToMSTodo = true;
            logger.success(`Pushed task ${task.id} to MS Todo`);
            await dbService.updateTask(task);
            await logUserEvent(
                user.id,
                "msTodoPushed",
                `Pushed task to MS To Do: ${task.name}`,
                { id: task.id },
            );
        } catch (error: any) {
            if (error.response?.status === 401) {
                logger.error(
                    `MS Graph API 401 for task ${task.id}: Token may be expired`,
                );
                try {
                    user.MStoken = "";
                    // 不清除 MSbinded —— 用户已授权，只是 token 过期
                    await dbService.updateUser(user);
                    await logUserEvent(
                        user.id,
                        "msGraphPaused",
                        "Cleared MS token due to 401 Unauthorized",
                    );
                } catch (e) {
                    logger.error("Failed to clear MStoken:", e);
                }
            } else if (error.response?.status === 403) {
                logger.error(`MS Graph API 403 Forbidden for task ${task.id}`);
            } else if (error.response?.status) {
                logger.error(
                    `MS Graph API ${error.response.status} error for task ${task.id}:`,
                    error.response.data || error.message,
                );
            } else {
                logger.error(
                    `Failed to push task ${task.id} to MS Todo:`,
                    error.message || error,
                );
                await logUserEvent(
                    user.id,
                    "msTodoPushError",
                    `Failed to push task to MS To Do: ${task.name}`,
                    {
                        id: task.id,
                        error: error?.message,
                        status: error?.response?.status,
                    },
                );
            }
        }
    }
}

// ── 主调度入口 ────────────────────────────────────────────

export function startIntervals(
    getUsers: () => IterableIterator<User>,
): IntervalController {
    const imapRetryCount = new Map<string, ImapRetryState>();
    const MAX_IMAP_RETRIES = 3;

    // CAF 配置（interval 内用，从环境变量 + 持久化文件构建）
    const cafConfig = createCafConfig(""); // backendUrl 在 interval 中不用于路由，仅用于 token 刷新

    const interval1 = setInterval(async () => {
        for (const user of getUsers()) {
            logger.debug(
                `Processing user ${user.id}, ebridgeBinded:${user.ebridgeBinded}, timetableUrl:${user.timetableUrl}`,
            );

            // JWT 过期清理
            if (user.JWTtoken) {
                const decoded = verifyJwt(user.JWTtoken);
                if (decoded?.exp) {
                    if (Number(decoded.exp) * 1000 < Date.now()) {
                        user.JWTtoken = "";
                        logger.info(`JWT token expired for user ${user.id}`);
                        await dbService.updateUser(user);
                    }
                }
            }

            // Exchange 事件同步
            await syncExchangeEvents(user);

            // IMAP 连接
            await startImapForUser(
                user,
                cafConfig,
                imapRetryCount,
                MAX_IMAP_RETRIES,
            );

            // MS Todo 推送
            await pushTasksToMsTodo(user);

            // 课表同步
            if (user.ebridgeBinded && user.timetableUrl) {
                try {
                    await syncUserTimetable(user);
                } catch {
                    /* handled internally */
                }
            }

            // 学习通自动同步（有开始时间→日程，无→待办）
            if (
                user.ChaoxingBinded &&
                user.ChaoxingEnabled !== false &&
                user.ChaoxingUsername &&
                user.ChaoxingPassword &&
                !isChaoxingSyncing(user.id) &&
                isDue(user.ChaoxingNextSyncAt)
            ) {
                void syncChaoxingUser(user).catch((e) =>
                    logger.warn(
                        `Chaoxing auto-sync failed for ${user.id}:`,
                        e,
                    ),
                );
            }
        }
        logger.debug("Checked all users for Ebridge status");
    }, 20000);

    // 拒绝缓冲池过期清理（每小时）
    const rejectionCleanup = setInterval(async () => {
        try {
            const n = await dbService.cleanupExpiredRejections();
            if (n > 0) {
                logger.info(
                    `Rejection buffer: cleaned ${n} expired record(s)`,
                );
            }
        } catch (e) {
            logger.warn("Rejection buffer cleanup failed:", e);
        }
    }, 60 * 60 * 1000);

    // 自动归档（ARC-001，每日）：扫描连续 6 个自然月无活动的分组并归档
    const autoArchive = setInterval(async () => {
        try {
            const n = await dbService.autoArchiveTags();
            if (n > 0) {
                logger.info(`Auto-archive: archived ${n} inactive tag(s)`);
            }
        } catch (e) {
            logger.warn("Auto-archive job failed:", e);
        }
    }, 24 * 60 * 60 * 1000);

    return {
        stop() {
            clearInterval(interval1);
            clearInterval(rejectionCleanup);
            clearInterval(autoArchive);
        },
    };
}
