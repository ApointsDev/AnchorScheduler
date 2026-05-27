import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { IEmail } from "./types";
import { logger } from "../Utils/logger.js";
import toShanghaiISO from "../Utils/time.js";

export interface ImapConfig {
    host: string;
    port: number;
    tls: boolean;
    username: string;
    password: string;
    useOAuth?: boolean; // 使用 XOAUTH2 认证（CAF OIDC token）
}

export type ImapNewEmailCallback = (email: IEmail) => Promise<void>;

export class ImapClient {
    private config: ImapConfig;
    private client: ImapFlow | null = null;
    private processedMessageIds: Set<string> = new Set();
    private idleRunning: boolean = false;
    private onNewEmail: ImapNewEmailCallback | null = null;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private shouldStop: boolean = false;

    constructor(config: ImapConfig) {
        this.config = config;
        logger.info(
            `IMAP client configured for ${config.username}@${config.host}:${config.port} (TLS: ${config.tls})`,
        );
    }

    private async ensureConnected(): Promise<void> {
        if (this.client && this.client.usable) {
            return;
        }

        // CAF OIDC 用户使用 XOAUTH2 认证
        const auth: any = this.config.useOAuth
            ? {
                  user: this.config.username,
                  accessToken: this.config.password,
              }
            : {
                  user: this.config.username,
                  pass: this.config.password,
              };

        this.client = new ImapFlow({
            host: this.config.host,
            port: this.config.port,
            secure: this.config.tls,
            auth,
            logger: false,
            connectionTimeout: 10000,
            greetingTimeout: 15000,
            socketTimeout: 120000,
        });

        const authMethod = this.config.useOAuth ? "XOAUTH2" : "password";
        logger.info(
            `正在连接 IMAP 服务器 (${authMethod}): ${this.config.host}:${this.config.port}`,
        );
        await this.client.connect();
        logger.success(`IMAP 连接成功: ${this.config.host}`);
    }

    async startIdle(callback: ImapNewEmailCallback): Promise<void> {
        this.onNewEmail = callback;
        this.shouldStop = false;
        this.idleRunning = true;

        try {
            await this.ensureConnected();

            const mailbox = await this.client!.mailboxOpen("INBOX");
            logger.info(
                `IMAP IDLE 开始监听 INBOX，当前消息数: ${mailbox.exists}`,
            );

            this.client!.on("exists", (event) => {
                if (event.path.toUpperCase() === "INBOX") {
                    const newCount = event.count - event.prevCount;
                    logger.info(
                        `IMAP IDLE 检测到新邮件，INBOX: ${event.prevCount} -> ${event.count} (+${newCount})`,
                    );
                    this.handleNewMessages().catch((err) => {
                        logger.error(
                            `处理新邮件时出错: ${err.message || "未知错误"}`,
                        );
                    });
                }
            });

            this.client!.on("close", () => {
                this.idleRunning = false;
                if (this.shouldStop) return;
                logger.warn(`IMAP 连接断开，10秒后重连...`);
                this.reconnectTimer = setTimeout(() => {
                    this.startIdle(this.onNewEmail!).catch((err) => {
                        logger.error(
                            `IMAP IDLE 重连失败: ${err.message || "未知错误"}`,
                        );
                    });
                }, 10000);
            });
        } catch (error: any) {
            this.idleRunning = false;
            if (this.shouldStop) return;
            logger.error(
                `IMAP IDLE 启动失败: ${error.message || "未知错误"}, 10秒后重试...`,
            );
            if (!this.shouldStop) {
                this.reconnectTimer = setTimeout(() => {
                    this.startIdle(this.onNewEmail!).catch(() => {});
                }, 10000);
            }
        }
    }

    private async handleNewMessages(): Promise<void> {
        if (!this.onNewEmail) return;
        try {
            await this.ensureConnected();

            const lock = await this.client!.getMailboxLock("INBOX");
            try {
                const mailbox = this.client!.mailbox;
                const totalCount =
                    mailbox &&
                    typeof mailbox === "object" &&
                    "exists" in mailbox
                        ? mailbox.exists
                        : 0;
                if (totalCount === 0) return;

                const limit = Math.min(10, totalCount);
                const startSeq = Math.max(1, totalCount - limit + 1);
                const range = `${startSeq}:*`;

                const uidsToFetch: number[] = [];
                for await (const msg of this.client!.fetch(range, {
                    uid: true,
                    flags: true,
                })) {
                    if (
                        msg.uid &&
                        !this.processedMessageIds.has(String(msg.uid))
                    ) {
                        uidsToFetch.push(msg.uid);
                    }
                }

                for (const uid of uidsToFetch) {
                    try {
                        const fullEmail = await this.fetchSingleEmail(uid);
                        this.processedMessageIds.add(fullEmail.id);
                        await this.onNewEmail(fullEmail);
                    } catch (err: any) {
                        logger.error(
                            `获取 IMAP 邮件 UID=${uid} 详情失败: ${err.message || "未知错误"}`,
                        );
                    }
                }
            } finally {
                lock.release();
            }
        } catch (error: any) {
            logger.error(
                `IDLE 处理新邮件时出错: ${error.message || "未知错误"}`,
            );
        }
    }

    private async fetchSingleEmail(uid: number): Promise<IEmail> {
        const messages: IEmail[] = [];
        for await (const msg of this.client!.fetch(
            [uid],
            {
                uid: true,
                envelope: true,
                flags: true,
                internalDate: true,
                source: true,
            },
            { uid: true },
        )) {
            const rawSource = msg.source || Buffer.from("");
            const parsed = await simpleParser(rawSource);
            messages.push({
                id: String(msg.uid),
                subject: parsed.subject || "(无主题)",
                from: parsed.from
                    ? {
                          name:
                              parsed.from.text ||
                              parsed.from.value?.[0]?.address ||
                              "",
                          address: parsed.from.value?.[0]?.address || "",
                      }
                    : undefined,
                receivedAt: toShanghaiISO(
                    parsed.date instanceof Date
                        ? parsed.date.toISOString()
                        : msg.internalDate instanceof Date
                          ? msg.internalDate.toISOString()
                          : new Date().toISOString(),
                ),
                isRead: msg.flags
                    ? msg.flags.has("\\Seen") || msg.flags.has("Seen")
                    : false,
                body: this.cleanHtmlContent(parsed.text || parsed.html || ""),
                hasAttachments: (parsed.attachments?.length || 0) > 0,
            });
        }
        if (messages.length === 0) {
            throw new Error(`未找到邮件UID: ${uid}`);
        }
        return messages[0];
    }

    async findEmails(top: number = 10): Promise<IEmail[]> {
        try {
            await this.ensureConnected();

            const lock = await this.client!.getMailboxLock("INBOX");
            try {
                const mailbox = this.client!.mailbox;
                const totalCount =
                    mailbox &&
                    typeof mailbox === "object" &&
                    "exists" in mailbox
                        ? mailbox.exists
                        : 0;
                logger.info(`IMAP 邮箱 INBOX 消息总数: ${totalCount}`);

                if (totalCount === 0) {
                    return [];
                }

                const limit = Math.min(top, totalCount);
                const startSeq = Math.max(1, totalCount - limit + 1);
                const range = `${startSeq}:*`;

                const messages: {
                    uid: number;
                    subject: string;
                    from: { name: string; address: string } | undefined;
                    receivedAt: string;
                    isRead: boolean;
                    hasAttachments: boolean;
                }[] = [];

                for await (const msg of this.client!.fetch(range, {
                    uid: true,
                    envelope: true,
                    flags: true,
                    internalDate: true,
                })) {
                    messages.push({
                        uid: msg.uid,
                        subject: msg.envelope?.subject || "(无主题)",
                        from: msg.envelope?.from?.[0]
                            ? {
                                  name:
                                      msg.envelope.from[0].name ||
                                      msg.envelope.from[0].address ||
                                      "",
                                  address: msg.envelope.from[0].address || "",
                              }
                            : undefined,
                        receivedAt: toShanghaiISO(
                            msg.internalDate instanceof Date
                                ? msg.internalDate.toISOString()
                                : new Date().toISOString(),
                        ),
                        isRead: msg.flags
                            ? msg.flags.has("\\Seen") || msg.flags.has("Seen")
                            : false,
                        hasAttachments: false,
                    });
                }

                logger.success(`成功获取 ${messages.length} 封 IMAP 邮件`);
                return messages.map((m) => ({
                    id: String(m.uid),
                    subject: m.subject,
                    from: m.from,
                    receivedAt: m.receivedAt,
                    isRead: m.isRead,
                    hasAttachments: m.hasAttachments,
                }));
            } finally {
                lock.release();
            }
        } catch (error: any) {
            const detail =
                error.response ||
                error.serverResponseCode ||
                error.rspCode ||
                "";
            logger.error(
                `获取 IMAP 邮件失败: ${error.message || "未知错误"} ${detail ? `| 服务器响应: ${detail}` : ""}`,
                error.stack || "",
            );
            return [];
        }
    }

    async getEmailById(itemId: string): Promise<IEmail> {
        try {
            await this.ensureConnected();

            const lock = await this.client!.getMailboxLock("INBOX");
            try {
                const uid = parseInt(itemId, 10);
                if (isNaN(uid)) {
                    throw new Error(`无效的邮件UID: ${itemId}`);
                }

                const messages: {
                    uid: number;
                    subject: string;
                    from: { name: string; address: string } | undefined;
                    receivedAt: string;
                    isRead: boolean;
                    body: string;
                    hasAttachments: boolean;
                }[] = [];

                for await (const msg of this.client!.fetch(
                    [uid],
                    {
                        uid: true,
                        envelope: true,
                        flags: true,
                        internalDate: true,
                        source: true,
                    },
                    { uid: true },
                )) {
                    const rawSource = msg.source || Buffer.from("");
                    const parsed = await simpleParser(rawSource);
                    messages.push({
                        uid: msg.uid,
                        subject: parsed.subject || "(无主题)",
                        from: parsed.from
                            ? {
                                  name:
                                      parsed.from.text ||
                                      parsed.from.value?.[0]?.address ||
                                      "",
                                  address:
                                      parsed.from.value?.[0]?.address || "",
                              }
                            : undefined,
                        receivedAt: toShanghaiISO(
                            parsed.date instanceof Date
                                ? parsed.date.toISOString()
                                : msg.internalDate instanceof Date
                                  ? msg.internalDate.toISOString()
                                  : new Date().toISOString(),
                        ),
                        isRead: msg.flags
                            ? msg.flags.has("\\Seen") || msg.flags.has("Seen")
                            : false,
                        body: this.cleanHtmlContent(
                            parsed.text || parsed.html || "",
                        ),
                        hasAttachments: (parsed.attachments?.length || 0) > 0,
                    });
                }

                if (messages.length === 0) {
                    throw new Error(`未找到邮件UID: ${itemId}`);
                }

                const m = messages[0];
                return {
                    id: String(m.uid),
                    subject: m.subject,
                    from: m.from,
                    receivedAt: m.receivedAt,
                    isRead: m.isRead,
                    body: m.body,
                    hasAttachments: m.hasAttachments,
                };
            } finally {
                lock.release();
            }
        } catch (error: any) {
            const detail =
                error.response ||
                error.serverResponseCode ||
                error.rspCode ||
                "";
            logger.error(
                `获取IMAP邮件详情失败: ${error.message || "未知错误"} ${detail ? `| 服务器响应: ${detail}` : ""}`,
                error.stack || "",
            );
            throw error;
        }
    }

    private cleanHtmlContent(html: string): string {
        if (!html) return "";
        return html
            .replace(/<(script|style|head)\b[\s\S]*?<\/\1>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/\s+/g, " ")
            .trim();
    }

    addProcessedId(id: string): void {
        this.processedMessageIds.add(id);
    }

    hasProcessedId(id: string): boolean {
        return this.processedMessageIds.has(id);
    }

    async close(): Promise<void> {
        this.shouldStop = true;
        this.onNewEmail = null;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        await this.safeCloseClient();
    }

    private async safeCloseClient(): Promise<void> {
        this.idleRunning = false;
        if (this.client) {
            try {
                if (this.client.usable) {
                    await this.client.logout();
                }
            } catch {
                // ignore
            }
            this.client = null;
        }
    }
}
