// 邮件查看、已读与 AI 处理路由
// 挂载于 /api → 路径为 /api/emails/*
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { processEmailWithLLM } from "../Services/emailProcessor.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

export function registerEmailRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    interface QueueEmailPayload {
        args?: Record<string, unknown>;
        email?: {
            id: string;
            subject: string;
            from?: { name: string; address: string };
            receivedAt: string;
            isRead: boolean;
            body?: string;
            htmlBody?: string;
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
            isAiProcessed: boolean;
            body: string;
            htmlBody?: string;
            hasAttachments?: boolean;
            attachmentsCount?: number;
            source?: string;
        };
    }
    router.get("/emails", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const limit = Math.min(
                Math.max(parseInt(req.query.limit as string) || 50, 1),
                200,
            );

            if (!user.imapClient && !user.emsClient) {
                return res.status(200).json({ emails: [], total: 0 });
            }

            // 优先使用 IMAP，其次 Exchange
            const client = user.imapClient || user.emsClient;
            if (!client) {
                return res.status(200).json({ emails: [], total: 0 });
            }

            const emails = await (client as any).findEmails(limit);

            // 标注 AI 已处理状态
            const processedIds = await dbService.getAiProcessedEmailIds(
                user.id,
            );
            const enriched = emails.map((e: any) => ({
                ...e,
                isAiProcessed: processedIds.has(String(e.id)),
            }));

            return res.status(200).json({
                emails: enriched,
                total: enriched.length,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error("Failed to list emails:", message);
            return res.status(500).json({ error: "Failed to list emails" });
        }
    });
    router.get(
        "/emails/search",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const query = ((req.query.q as string) || "")
                    .trim()
                    .toLowerCase();
                const limit = Math.min(
                    Math.max(parseInt(req.query.limit as string) || 20, 1),
                    100,
                );

                if (!query) {
                    return res
                        .status(200)
                        .json({ emails: [], total: 0, query: "" });
                }

                if (!user.imapClient && !user.emsClient) {
                    return res
                        .status(200)
                        .json({ emails: [], total: 0, query });
                }

                const client = user.imapClient || user.emsClient;
                if (!client) {
                    return res
                        .status(200)
                        .json({ emails: [], total: 0, query });
                }

                // 获取一批邮件并在内存中搜索（跨提供商统一实现，低耦合）
                const fetchLimit = Math.max(limit * 5, 100);
                const emails = await (client as any).findEmails(fetchLimit);

                // 在内存中过滤匹配的邮件
                const matched = emails.filter((e: any) => {
                    const subject = (e.subject || "").toLowerCase();
                    const fromName = (e.from?.name || "").toLowerCase();
                    const fromAddr = (e.from?.address || "").toLowerCase();
                    return (
                        subject.includes(query) ||
                        fromName.includes(query) ||
                        fromAddr.includes(query)
                    );
                });

                const paged = matched.slice(0, limit);

                // 标注 AI 已处理状态
                const processedIds = await dbService.getAiProcessedEmailIds(
                    user.id,
                );
                const enriched = paged.map((e: any) => ({
                    ...e,
                    isAiProcessed: processedIds.has(String(e.id)),
                }));

                logger.info(
                    `[EmailSearch] Query="${query}" matched=${matched.length} returned=${enriched.length}`,
                );

                return res.status(200).json({
                    emails: enriched,
                    total: matched.length,
                    query: req.query.q,
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to search emails:", message);
                return res
                    .status(500)
                    .json({ error: "Failed to search emails" });
            }
        },
    );
    router.get(
        "/emails/:emailId",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const emailId = req.params.emailId;

                // 预先查询 AI 处理状态
                const isAiProcessed = await dbService.isEmailAiProcessed(
                    user.id,
                    emailId,
                );

                // 实时拉取完整邮件（含 HTML），失败返回 null
                const fetchLiveEmail = async (): Promise<EmailViewResponse | null> => {
                    if (user.imapClient) {
                        try {
                            const email =
                                await user.imapClient.getEmailById(emailId);
                            return {
                                email: {
                                    id: email.id,
                                    subject: email.subject,
                                    from: email.from,
                                    receivedAt: email.receivedAt,
                                    isRead: email.isRead,
                                    isAiProcessed,
                                    body: email.body || "",
                                    htmlBody: email.htmlBody || undefined,
                                    hasAttachments: email.hasAttachments,
                                    source: "imap",
                                },
                            };
                        } catch {
                            /* fall through */
                        }
                    }
                    if (user.emsClient) {
                        try {
                            const email =
                                await user.emsClient.getEmailById(emailId);
                            return {
                                email: {
                                    id: email.id,
                                    subject: email.subject,
                                    from: email.from,
                                    receivedAt: email.receivedAt,
                                    isRead: email.isRead,
                                    isAiProcessed,
                                    body: email.body || "",
                                    htmlBody: email.htmlBody || undefined,
                                    hasAttachments: email.hasAttachments,
                                    source: "exchange",
                                },
                            };
                        } catch {
                            /* fall through */
                        }
                    }
                    return null;
                };

                // 先从队列缓存中查找（保留命中项，供实时拉取失败时回落）
                let cachedEmail: QueueEmailPayload["email"] | null = null;
                let cachedSource: string | undefined;
                const queue = await dbService.getScheduleQueueByUser(user.id);
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
                        cachedEmail = parsed.email!;
                        cachedSource = parsed._meta?.source;
                        break;
                    }
                }

                // 命中缓存且含 htmlBody：直接返回缓存快照（无需实时拉取）
                if (cachedEmail?.htmlBody) {
                    const e = cachedEmail;
                    return res.status(200).json({
                        email: {
                            id: e.id,
                            subject: e.subject,
                            from: e.from,
                            receivedAt: e.receivedAt,
                            isRead: e.isRead,
                            isAiProcessed,
                            body: e.body || "",
                            htmlBody: e.htmlBody,
                            hasAttachments: e.hasAttachments,
                            attachmentsCount: e.attachmentsCount,
                            source: cachedSource,
                        },
                    } satisfies EmailViewResponse);
                }

                // 缓存缺 htmlBody（或未命中缓存）：实时拉取，让审批卡片能渲染完整 HTML
                const live = await fetchLiveEmail();
                if (live) {
                    return res.status(200).json(live);
                }

                // 实时拉取失败：回落队列缓存快照
                if (cachedEmail) {
                    const e = cachedEmail;
                    return res.status(200).json({
                        email: {
                            id: e.id,
                            subject: e.subject,
                            from: e.from,
                            receivedAt: e.receivedAt,
                            isRead: e.isRead,
                            isAiProcessed,
                            body: e.body || "",
                            htmlBody: e.htmlBody || undefined,
                            hasAttachments: e.hasAttachments,
                            attachmentsCount: e.attachmentsCount,
                            source: cachedSource,
                        },
                    } satisfies EmailViewResponse);
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
    router.put(
        "/emails/:emailId/read",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const emailId = req.params.emailId;

                let marked = false;

                // IMAP
                if (user.imapClient) {
                    try {
                        await user.imapClient.markAsRead(emailId);
                        marked = true;
                    } catch (e: any) {
                        logger.error(`IMAP markAsRead failed: ${e.message}`);
                    }
                }

                // Exchange
                if (!marked && user.emsClient?.markSystem?.markEmailAsRead) {
                    try {
                        await user.emsClient.markSystem.markEmailAsRead(
                            emailId,
                            true,
                        );
                        marked = true;
                    } catch (e: any) {
                        logger.error(
                            `Exchange markAsRead failed: ${e.message}`,
                        );
                    }
                }

                if (!marked) {
                    return res
                        .status(404)
                        .json({ error: "Email not found or no email client" });
                }

                return res.json({ success: true });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to mark email as read:", message);
                return res
                    .status(500)
                    .json({ error: "Failed to mark email as read" });
            }
        },
    );
    router.post(
        "/emails/:emailId/ai-process",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const emailId = req.params.emailId;

                // 获取邮件详情
                let email: any = null;
                if (user.imapClient) {
                    try {
                        email = await user.imapClient.getEmailById(emailId);
                    } catch {
                        /* try next */
                    }
                }
                if (!email && user.emsClient) {
                    try {
                        email = await user.emsClient.getEmailById(emailId);
                    } catch {
                        /* try next */
                    }
                }
                if (!email) {
                    // 尝试从日程/待办队列缓存中查找
                    const scheduleQueue =
                        await dbService.getScheduleQueueByUser(user.id);
                    const todoQueue =
                        await dbService.getTodoQueueByUser(user.id);
                    for (const item of [...scheduleQueue, ...todoQueue]) {
                        let parsed: any = null;
                        try {
                            parsed = JSON.parse(item.rawRequest);
                        } catch {
                            continue;
                        }
                        if (parsed?.email?.id === emailId) {
                            email = parsed.email;
                            break;
                        }
                    }
                }
                if (!email) {
                    return res.status(404).json({ error: "Email not found" });
                }

                // 手动触发允许重新处理：先删除旧记录
                await dbService.deleteAiProcessedEmail(user.id, emailId);

                // 运行 AI 处理管道
                const source = (req.body?.source as string) || "manual";
                const result = await processEmailWithLLM(user, email, source);

                // 获取刚创建的队列项详情（供前端即时审批）
                const queueItems: any[] = [];
                for (const qid of result.queueIds) {
                    const item = await dbService.getScheduleQueueById(qid);
                    if (item) queueItems.push(item);
                }
                const todoQueueItems: any[] = [];
                for (const qid of result.todoQueueIds) {
                    const item = await dbService.getTodoQueueById(qid);
                    if (item) todoQueueItems.push(item);
                }

                let message: string;
                if (result.validationFailed) {
                    message =
                        "AI 处理完成，但工具/时间校验失败，已记录错误日志";
                } else if (result.toolCallsTriggered) {
                    const parts: string[] = [];
                    if (result.queuedSchedules.length > 0) {
                        parts.push(`${result.queuedSchedules.length} 个日程`);
                    }
                    if (result.queuedTodos.length > 0) {
                        parts.push(`${result.queuedTodos.length} 个待办`);
                    }
                    message =
                        parts.length > 0
                            ? `AI 已处理，入队 ${parts.join(" / ")}`
                            : "AI 已处理，工具调用未成功入队";
                } else {
                    message = "AI 已处理，未触发日程/待办创建";
                }

                return res.status(200).json({
                    success: true,
                    queuedSchedules: result.queuedSchedules,
                    queueItems,
                    queuedTodos: result.queuedTodos,
                    todoQueueItems,
                    toolCallsTriggered: result.toolCallsTriggered,
                    validationFailed: result.validationFailed || false,
                    lastValidationError: result.lastValidationError,
                    message,
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("手动 AI 处理邮件失败:", message);
                return res
                    .status(500)
                    .json({ error: message || "AI 处理失败" });
            }
        },
    );
}
