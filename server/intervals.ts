import axios from 'axios';
import moment from 'moment';
import { toShanghaiISO } from './Utils/time.js';
import { v4 as uuidv4 } from 'uuid';
import { ExchangeClient } from './Services/exchangeClient';
import { ImapClient } from './Services/imapClient';
import { LLMApi } from './Services/LLMApi';
import { dbService } from './Services/dbService';
import type { ExchangeConfig, ScheduleType } from './Services/types';
import { ScheduleConflictError, findConflictingTasks } from './Services/scheduleConflict';
import { broadcastTaskChange } from './Services/websocket';
import { logUserEvent } from './Services/userLog';
import { syncUserTimetable } from './Services/timetable';
import { logger } from './Utils/logger.js';
import jwt from 'jsonwebtoken';

// 注意：为避免与 index.ts 产生循环依赖，这里本地定义与 index.ts 一致的类型签名
export interface Task {
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
    importance?: 'high' | 'normal' | 'low';
    isReminderOn?: boolean;
    scheduleType?: ScheduleType;
}

import type { User } from './index';

const JWT_SECRET = process.env.JWT_SECRET || '';
function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch (e) {
        return null;
    }
}

export interface IntervalController {
    stop: () => void;
}

export function startIntervals(getUsers: () => IterableIterator<User>): IntervalController {
    // Interval 1: 处理 JWT 过期、Exchange 事件、邮件处理、推送 To Do、课表拉取
    const interval1 = setInterval(async () => {
        for (const user of getUsers()) {
            logger.debug(`Processing user ${user.id},with ebridgeBinded:${user.ebridgeBinded},XJTLUPassword:${user.XJTLUPassword},timetableUrl:${user.timetableUrl}`);

            if (user.JWTtoken) {
                const decoded = verifyJwt(user.JWTtoken);
                if (decoded && decoded.exp) {
                    const exp = decoded.exp as number;
                    if (exp * 1000 < Date.now()) {
                        user.JWTtoken = '';
                        logger.info(`JWT token expired for user ${user.id}`);
                        await dbService.updateUser(user);
                    }
                }
            }

            // 优先使用 OAuth Token，如果没有则退回到 Basic Auth (XJTLUPassword)
            // 但用户要求分开设置，所以这里应该严格区分
            // 如果 ExchangeAccessToken 存在，优先使用
            const useOAuth = !!(user.ExchangeBinded && user.ExchangeAccessToken);
            const useBasic = !!(user.XJTLUPassword && user.XJTLUaccount); // Legacy or specific ebridge

            if ((useOAuth || useBasic) && !user.emsClient && (user.mailReadingSpan > 0 || user.ExchangeBinded)) { // Only init if mail reading is enabled or explicitly bound
                const exchangeConfig = {
                    exchangeUrl: process.env.EXCHANGE_URL || "https://mail.xjtlu.edu.cn/EWS/Exchange.asmx",
                    username: user.email.split('@')[0], // Fallback username
                    password: user.XJTLUPassword || "", // Fallback password
                    domain: process.env.EXCHANGE_DOMAIN || "xjtlu.edu.cn",
                    scope: process.env.EXCHANGE_SCOPE,
                    openaiApiKey: process.env.OPENAI_API_KEY || "",
                    openaiModel: process.env.OPENAI_MODEL || 'deepseek-chat',
                    MStoken: user.MStoken,
                } as ExchangeConfig;

                if (useOAuth) {
                     exchangeConfig.oauthToken = user.ExchangeAccessToken;
                     exchangeConfig.refreshToken = user.ExchangeRefreshToken;
                     exchangeConfig.clientId = process.env.EXCHANGE_CLIENT_ID;
                     exchangeConfig.clientSecret = process.env.EXCHANGE_CLIENT_SECRET;
                     exchangeConfig.tokenUrl = process.env.EXCHANGE_TOKEN_URL || "https://login.microsoftonline.com/common/oauth2/v2.0/token";
                     logger.info(`Using OAuth for Exchange User ${user.id}`);
                } else {
                     logger.info(`Using Basic Auth for Exchange User ${user.id} (Deprecated flow)`);
                }

                logger.info(`Launching ExchangeClient for user ${user.id}`);

                const emailClient = new ExchangeClient(exchangeConfig, user);
                try {
                    const events = await emailClient.getEvents(
                        toShanghaiISO(moment().subtract(1, 'day').toDate()),
                        toShanghaiISO(moment().add(1, 'day').toDate()),
                    );

                    logger.info(`Fetched ${events.length} events for user ${user.id}`);
                    await logUserEvent(user.id, 'eventsFetched', `Fetched ${events.length} calendar events`, { count: events.length });

                    for (const event of events) {
                        const existingTask = user.tasks.find(task => task.id === event.id);
                        if (existingTask) continue;
                        const newTask = {
                            id: event.id || uuidv4(),
                            name: event.subject,
                            startTime: event.start,
                            endTime: event.end,
                            location: event.location || '',
                            body: event.body || '',
                            attendees: event.attendees || [],
                            description: event.body || '',
                            dueDate: event.end,
                            completed: false,
                            pushedToMSTodo: false,
                            scheduleType: 'single',
                            importance: event.importance,
                            isReminderOn: event.isReminderOn,
                        } as Task;
                        try {
                            // Check for conflicts but don't block
                            const conflicts = findConflictingTasks(user.tasks, newTask, { boundaryConflict: !!user.conflictBoundaryInclusive });

                            await dbService.addTask(user.id, newTask, !!user.conflictBoundaryInclusive, user.isConflictScheduleAllowed);
                            broadcastTaskChange('created', newTask, user.id);
                            await dbService.refreshUserTasksIncremental(user, { addedIds: [newTask.id] });
                            
                            if (conflicts.length > 0) {
                                logger.warn(`Added conflicting event task ${newTask.id} for user ${user.id} with warning`);
                                await logUserEvent(user.id, 'taskConflictWarning', `Added conflicting calendar event with warning: ${newTask.name}`, { id: newTask.id, startTime: newTask.startTime, endTime: newTask.endTime, conflicts: conflicts.map(c => c.id) });
                            } else {
                                await logUserEvent(user.id, 'taskCreated', `Created task from calendar event: ${newTask.name}`, { id: newTask.id, source: 'Exchange', startTime: newTask.startTime, endTime: newTask.endTime });
                            }
                        } catch (e: any) {
                            logger.error(`Failed to persist event task ${newTask.id} for user ${user.id}:`, e);
                            await logUserEvent(user.id, 'taskError', `Failed to persist calendar event: ${newTask.name}`, { id: newTask.id, error: (e as any)?.message });
                        }
                    }
                } catch (error) {
                    logger.error(`Failed to get events for user ${user.id}:`, error);
                    await logUserEvent(user.id, 'eventsError', `Failed to fetch calendar events`, { error: (error as any)?.message });
                }

                user.emsClient = emailClient;
            }

            const useSmtp = !!(user.SmtpBinded && user.SmtpEmail && user.SmtpPassword && user.SmtpHost && user.SmtpPort);

            if (useSmtp && !user.imapClient && user.mailReadingSpan > 0) {
                const imapConfig = {
                    host: user.SmtpHost!,
                    port: user.SmtpPort!,
                    tls: user.SmtpTls !== false,
                    username: user.SmtpEmail!,
                    password: user.SmtpPassword!,
                };

                logger.info(`Launching ImapClient for user ${user.id} with IDLE push`);
                const imapClient = new ImapClient(imapConfig);
                user.imapClient = imapClient;

                imapClient.startIdle(async (fullEmail) => {
                    logger.info(`IMAP IDLE 收到新邮件: ${fullEmail.subject}, 交由 LLM 处理`);
                    const currentUser = user;
                    if (currentUser.emsClient) {
                        try {
                            await currentUser.emsClient.autoProcessNewEmail(fullEmail);
                        } catch (err: any) {
                            logger.error(`IDLE 邮件 LLM 处理失败: ${err.message || '未知错误'}`);
                        }
                    } else {
                        try {
                            const llmApi = new LLMApi(
                                process.env.OPENAI_API_KEY || '',
                                process.env.OPENAI_MODEL || 'deepseek-chat'
                            );
                            const llmResponse = await llmApi.processEmail(fullEmail);
                            if (llmResponse?.tool_calls) {
                                for (const toolCall of llmResponse.tool_calls) {
                                    const funcName = (toolCall as any)?.function?.name;
                                    const funcArgs = (toolCall as any)?.function?.arguments;
                                    if (funcName === 'add_schedule' && funcArgs) {
                                        let toolArgs: any;
                                        try {
                                            toolArgs = typeof funcArgs === 'string' ? JSON.parse(funcArgs) : funcArgs;
                                        } catch { toolArgs = {}; }
                                        if (!toolArgs.name) toolArgs.name = fullEmail.subject || '未命名任务';
                                        const payload = {
                                            args: { ...toolArgs, description: `来自邮件: ${fullEmail.subject}` },
                                            email: {
                                                id: fullEmail.id,
                                                subject: fullEmail.subject,
                                                from: fullEmail.from,
                                                receivedAt: fullEmail.receivedAt,
                                                isRead: fullEmail.isRead,
                                                body: fullEmail.body || '',
                                                hasAttachments: !!fullEmail.hasAttachments,
                                            },
                                            _meta: { source: 'imap', createdAt: toShanghaiISO() }
                                        };
                                        await dbService.addScheduleToQueue(currentUser.id, JSON.stringify(payload));
                                        logger.success(`IMAP 邮件已入队: ${toolArgs.name}`);
                                    }
                                }
                            }
                        } catch (err: any) {
                            logger.error(`IMAP 邮件 LLM 处理失败: ${err.message || '未知错误'}`);
                        }
                    }
                    await logUserEvent(currentUser.id, 'emailProcessed', `Processed IMAP email via IDLE: ${fullEmail.subject}`, { emailId: fullEmail.id, subject: fullEmail.subject });
                    currentUser.mailReadingSpan = Math.max(0, currentUser.mailReadingSpan - 1);
                    await dbService.updateUser(currentUser);
                    logger.info(`Decremented mailReadingSpan for user ${currentUser.id}, new value: ${currentUser.mailReadingSpan}`);
                }).catch((err) => {
                    logger.error(`Failed to start IMAP IDLE for user ${user.id}: ${err.message || '未知错误'}`);
                });

                logger.info(`IMAP IDLE listener started for user ${user.id}`);
            }

            if (user.mailReadingSpan > 0 && user.emsClient) {
                try {
                    logger.info(`Reading email for user ${user.id}, remaining span: ${user.mailReadingSpan}`);
                    const emails = await user.emsClient.findEmails(user.mailReadingSpan);
                    const email = emails[user.mailReadingSpan - 1];
                    const fullEmail = await user.emsClient.getEmailById(email.id);



                    await user.emsClient.autoProcessNewEmail(fullEmail);
                    await logUserEvent(user.id, 'emailProcessed', `Processed email: ${fullEmail.subject}`, { emailId: email.id, subject: fullEmail.subject });
                    user.mailReadingSpan--;
                    await dbService.updateUser(user);
                    logger.info(`Decremented mailReadingSpan for user ${user.id}, new value: ${user.mailReadingSpan}`);
                } catch (emailError) {
                    logger.error(`Failed to read email for user ${user.id}:`, emailError);
                    await logUserEvent(user.id, 'emailError', `Failed to process email`, { error: (emailError as any)?.message });
                }
            }

            for (const task of user.tasks) {
                if (!task.pushedToMSTodo) {
                    // Skip MS Graph actions if user has no token or has been paused due to previous 401
                    if (!user.MStoken) continue;
                    if (!user.MSbinded) continue;
                    const msToken = user.MStoken;
                    const graphEndpoint = `https://graph.microsoft.com/v1.0/me/todo/lists`;
                    const headers = { Authorization: `Bearer ${msToken}`, 'Content-Type': 'application/json' };

                    try {
                        const listsRes = await axios.get(graphEndpoint, { headers });
                        let targetList = (listsRes.data as any).value.find((l: any) => l.wellknownName === 'myDay');
                        if (!targetList) {
                            targetList = (listsRes.data as any).value.find((l: any) => l.wellknownName === 'defaultList') || (listsRes.data as any).value[0];
                        }
                        if (!targetList) throw new Error('No list found');

                        const payload: any = {
                            title: task.name,
                            body: { content: task.description || '', contentType: 'text' },
                            dueDateTime: { dateTime: task.dueDate, timeZone: 'UTC' },
                            startDateTime: task.startTime ? { dateTime: task.startTime, timeZone: 'UTC' } : undefined,
                            importance: task.importance || 'normal',
                            status: task.completed ? 'completed' : 'notStarted'
                        };

                        if (task.isReminderOn && task.startTime) {
                            payload.reminderDateTime = { dateTime: task.startTime, timeZone: 'UTC' };
                        }

                        await axios.post(`https://graph.microsoft.com/v1.0/me/todo/lists/${targetList.id}/tasks`, payload, { headers });

                        task.pushedToMSTodo = true;
                        logger.success(`Pushed task ${task.id} to MS Todo`);
                        await dbService.updateTask(task);
                        await logUserEvent(user.id, 'msTodoPushed', `Pushed task to MS To Do: ${task.name}`, { id: task.id });
                    } catch (error: any) {
                        if (error.response?.status === 401) {
                            logger.error(`MS Graph API 401 Unauthorized for task ${task.id}: Token may be expired or invalid`);
                            // Pause further MS Graph attempts for this user until token refresh
                            try {
                                // Token invalid: clear token and mark as unbound to pause further attempts
                                user.MStoken = '';
                                user.MSbinded = false;
                                await dbService.updateUser(user);
                                await logUserEvent(user.id, 'msGraphPaused', 'Cleared MS token and paused MS Graph operations due to 401 Unauthorized');
                                logger.warn(`Cleared MStoken and set MSbinded=false for user ${user.id} until token is refreshed.`);
                            } catch (e) {
                                logger.error('Failed to persist MSbinded paused state:', e);
                            }
                        } else if (error.response?.status === 403) {
                            logger.error(`MS Graph API 403 Forbidden for task ${task.id}: Insufficient permissions`);
                        } else if (error.response?.status) {
                            logger.error(`MS Graph API ${error.response.status} error for task ${task.id}:`, error.response.data || error.message);
                        } else {
                            logger.error(`Failed to push task ${task.id} to MS Todo:`, error.message || error);
                            await logUserEvent(user.id, 'msTodoPushError', `Failed to push task to MS To Do: ${task.name}`, { id: task.id, error: error?.message, status: error?.response?.status });
                        }
                        continue;
                    }
                }
            }

            if (user.ebridgeBinded && user.timetableUrl) {
                try {
                    await syncUserTimetable(user);
                } catch (e) {
                    // Error logging is handled inside syncUserTimetable, but catch here to be safe
                }
            }
        }
        logger.debug('Checked all users for Ebridge status');
    }, 20000);

    return {
        stop() {
            clearInterval(interval1);
        }
    };
}
