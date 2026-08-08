import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    getEmailList,
    getRawEmail,
    triggerAiProcess,
    markEmailAsRead,
    type EmailListItem,
    type RawEmail,
    type ScheduleQueueItem,
    type TodoQueueItem,
} from "../../services/api";
import { filterEmailsLocally } from "../../services/emailService";
import { Button } from "../ui/Button";
import SearchBar from "../ui/SearchBar";
import {
    Mail,
    Inbox,
    RefreshCw,
    ChevronLeft,
    Paperclip,
    Clock,
    Flag,
    Search,
    Sparkles,
    Brain,
    Loader2,
} from "lucide-react";
import "../../styles/MyMail.css";
import LoadingSpinner from "../ui/LoadingSpinner";
import PlainTextEmail from "../ui/PlainTextEmail";
import InlineScheduleApproval from "./InlineScheduleApproval";
import InlineTodoApproval from "./InlineTodoApproval";

const MyMail: React.FC = () => {
    const { t } = useTranslation();
    const [emails, setEmails] = useState<EmailListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<RawEmail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [aiProcessing, setAiProcessing] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [aiQueueItems, setAiQueueItems] = useState<ScheduleQueueItem[]>([]);
    const [aiTodoQueueItems, setAiTodoQueueItems] = useState<TodoQueueItem[]>(
        [],
    );

    const fetchEmails = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const result = await getEmailList(50);
            // 按接收时间降序排序（最新邮件在前）—— 客户端侧兜底
            const sorted = (result.emails || []).sort(
                (a, b) =>
                    new Date(b.receivedAt).getTime() -
                    new Date(a.receivedAt).getTime(),
            );
            setEmails(sorted);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : t("email.loadFailed"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchEmails();
    }, [fetchEmails]);

    // 客户端即时过滤（低延迟搜索体验）
    const filteredEmails = useMemo(
        () => filterEmailsLocally(emails, searchQuery),
        [emails, searchQuery],
    );

    const handleSelectEmail = async (id: string) => {
        setSelectedId(id);
        setShowDetail(true);
        setDetailError("");

        // 立即更新本地状态为已读
        setEmails((prev) =>
            prev.map((e) => (e.id === id ? { ...e, isRead: true } : e)),
        );

        const cached = emails.find((e) => e.id === id);
        if (cached) {
            setSelectedEmail({
                id: cached.id,
                subject: cached.subject,
                from: cached.from,
                receivedAt: cached.receivedAt,
                isRead: true,
                isFlagged: cached.isFlagged,
                flags: cached.flags,
                isAiProcessed: cached.isAiProcessed,
                body: "",
                hasAttachments: cached.hasAttachments,
            });
        }

        // 异步通知服务端标记已读（不阻塞 UI）
        markEmailAsRead(id).catch(() => {});

        setDetailLoading(true);
        try {
            const full = await getRawEmail(id);
            setSelectedEmail({ ...full, isRead: true });
        } catch (e: unknown) {
            setDetailError(
                e instanceof Error ? e.message : t("email.loadDetailFailed"),
            );
        } finally {
            setDetailLoading(false);
        }
    };

    const handleBack = () => {
        setShowDetail(false);
        setAiResult(null);
        setAiQueueItems([]);
        setAiTodoQueueItems([]);
    };

    const handleAiProcess = async () => {
        if (!selectedEmail || aiProcessing) return;
        setAiProcessing(true);
        setAiResult(null);
        setAiQueueItems([]);
        setAiTodoQueueItems([]);
        try {
            const result = await triggerAiProcess(selectedEmail.id);
            setAiResult(result.message);
            if (result.queueItems && result.queueItems.length > 0) {
                setAiQueueItems(result.queueItems);
            }
            if (result.todoQueueItems && result.todoQueueItems.length > 0) {
                setAiTodoQueueItems(result.todoQueueItems);
            }
            // 更新本地邮件状态为 AI 已处理
            setSelectedEmail((prev) =>
                prev ? { ...prev, isAiProcessed: true } : null,
            );
            setEmails((prev) =>
                prev.map((e) =>
                    e.id === selectedEmail.id
                        ? { ...e, isAiProcessed: true }
                        : e,
                ),
            );
        } catch (e: unknown) {
            setAiResult(
                e instanceof Error ? e.message : t("email.aiProcessFailed"),
            );
        } finally {
            setAiProcessing(false);
        }
    };

    const formatTime = (iso: string) => {
        try {
            const d = new Date(iso);
            const now = new Date();
            const isToday = d.toDateString() === now.toDateString();
            if (isToday) {
                return d.toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            }
            return d.toLocaleDateString("zh-CN", {
                month: "short",
                day: "numeric",
            });
        } catch {
            return iso;
        }
    };

    const formatFullTime = (iso: string) => {
        try {
            return new Date(iso).toLocaleString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return iso;
        }
    };

    const getSenderName = (from?: {
        name: string;
        address: string;
    }): string => {
        if (!from) return t("email.unknownSender");
        return from.name || from.address;
    };

    /** 去除邮件主题中的转发/回复前缀 */
    const stripSubjectPrefix = (subject: string): string => {
        // 常见前缀模式：中英文回复转发标记
        return subject
            .replace(/^(?:Fwd?|FW|转发|回复|Re|Aw| Antwort)(\s*:\s*|\s+)/gi, "")
            .replace(
                /^(?:\[[^\]]*\]\s*)*(?:Fwd?|FW|转发|回复|Re|Aw|Antwort)(\s*:\s*|\s+)/gi,
                "",
            )
            .trim();
    };

    /** 根据用户设置决定是否去除前缀（默认开启） */
    const shouldStrip = (): boolean => {
        const stored = localStorage.getItem("stripReplyPrefix");
        if (stored === null) return true; // 默认开启
        return stored === "true";
    };

    const displaySubject = (subject: string): string => {
        if (!shouldStrip()) return subject;
        // 递归去除多层前缀（如 "转发: Re: 主题"）
        let result = subject;
        for (let i = 0; i < 5; i++) {
            const stripped = stripSubjectPrefix(result);
            if (stripped === result) break;
            result = stripped;
        }
        return result || subject;
    };

    /** 基础 HTML 清洗：移除危险标签/事件，保留排版结构 */
    const sanitizeHtml = (html: string): string => {
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
            .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
            .replace(/on\w+\s*=\s*'[^']*'/gi, "");
    };

    return (
        <div className="mail-client">
            {/* Sidebar: Email List */}
            <div
                className={`mail-sidebar ${showDetail ? "mail-sidebar-hidden" : ""}`}
            >
                <div className="mail-sidebar-header">
                    <div className="mail-sidebar-title">
                        <Inbox size={20} />
                        <span>{t("email.inbox")}</span>
                        {emails.length > 0 && (
                            <span className="mail-count">
                                {searchQuery
                                    ? `${filteredEmails.length}/${emails.length}`
                                    : emails.length}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchEmails}
                        title={t("email.refresh")}
                        disabled={loading}
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "spin" : ""}
                        />
                    </Button>
                </div>

                {/* 搜索栏 */}
                <div className="mail-search-bar">
                    <SearchBar
                        placeholder={t("email.searchPlaceholder")}
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>

                {error && <div className="mail-error">{error}</div>}

                {loading && emails.length === 0 ? (
                    <LoadingSpinner />
                ) : emails.length === 0 ? (
                    <div className="mail-empty">
                        <Mail size={40} />
                        <p>{t("email.inboxEmpty")}</p>
                        <p className="mail-empty-hint">{t("email.bindHint")}</p>
                    </div>
                ) : filteredEmails.length === 0 && searchQuery ? (
                    <div className="mail-empty">
                        <Search size={40} />
                        <p>{t("email.noMatch")}</p>
                        <p className="mail-empty-hint">
                            {t("email.tryOtherKeywords")}
                        </p>
                    </div>
                ) : (
                    <div className="mail-list">
                        {filteredEmails.map((email) => (
                            <div
                                key={email.id}
                                className={`mail-item ${email.id === selectedId ? "mail-item-active" : ""} ${!email.isRead ? "mail-item-unread" : ""}`}
                                onClick={() => handleSelectEmail(email.id)}
                            >
                                <div className="mail-item-body">
                                    <div className="mail-item-top">
                                        <span className="mail-item-sender">
                                            {!email.isRead && (
                                                <span
                                                    className="mail-unread-dot"
                                                    title={t("email.unread")}
                                                />
                                            )}
                                            {email.isFlagged && (
                                                <Flag
                                                    size={12}
                                                    className="mail-flag-icon"
                                                />
                                            )}
                                            {getSenderName(email.from)}
                                        </span>
                                        <span className="mail-item-time">
                                            {formatTime(email.receivedAt)}
                                        </span>
                                    </div>
                                    <div className="mail-item-subject">
                                        {displaySubject(email.subject)}
                                    </div>
                                    <div className="mail-item-meta">
                                        {email.isAiProcessed && (
                                            <span
                                                className="mail-item-ai"
                                                title={t("email.aiProcessed")}
                                            >
                                                <Sparkles size={12} />
                                            </span>
                                        )}
                                        {email.hasAttachments && (
                                            <span className="mail-item-attach">
                                                <Paperclip size={12} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Pane */}
            <div
                className={`mail-detail ${showDetail ? "mail-detail-visible" : ""}`}
            >
                {!showDetail ? (
                    <div className="mail-detail-empty">
                        <Mail size={48} />
                        <p>{t("email.selectHint")}</p>
                    </div>
                ) : detailLoading && !selectedEmail?.body ? (
                    <LoadingSpinner text={t("common.loading")} />
                ) : detailError ? (
                    <div className="mail-error">{detailError}</div>
                ) : selectedEmail ? (
                    <>
                        <div className="mail-detail-header">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mail-back-btn"
                                onClick={handleBack}
                            >
                                <ChevronLeft size={20} />
                            </Button>
                            <div className="mail-detail-header-info">
                                <h2 className="mail-detail-subject">
                                    {displaySubject(selectedEmail.subject)}
                                </h2>
                                <div className="mail-detail-meta">
                                    <div className="mail-detail-sender-info">
                                        <div className="mail-detail-sender-name">
                                            {getSenderName(selectedEmail.from)}
                                        </div>
                                        {selectedEmail.from?.address && (
                                            <div className="mail-detail-sender-addr">
                                                {"<"}
                                                {selectedEmail.from.address}
                                                {">"}
                                            </div>
                                        )}
                                        <div className="mail-detail-time">
                                            <Clock size={14} />
                                            {formatFullTime(
                                                selectedEmail.receivedAt,
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mail-detail-body">
                            {/* AI 处理按钮 + 结果提示 */}
                            <div className="mail-ai-action-row">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAiProcess}
                                    disabled={aiProcessing}
                                >
                                    {aiProcessing ? (
                                        <Loader2 size={14} className="spin" />
                                    ) : (
                                        <Brain size={14} />
                                    )}
                                    <span>
                                        {aiProcessing
                                            ? t("email.aiProcessing")
                                            : selectedEmail.isAiProcessed
                                              ? t("email.reAiRead")
                                              : t("email.aiRead")}
                                    </span>
                                </Button>
                                {aiResult &&
                                    aiQueueItems.length === 0 &&
                                    aiTodoQueueItems.length === 0 && (
                                    <span
                                        className={
                                            aiResult.includes("失败")
                                                ? "mail-ai-result-error"
                                                : "mail-ai-result-success"
                                        }
                                    >
                                        {aiResult}
                                    </span>
                                )}
                            </div>

                            {/* 内嵌审批卡片：日程 */}
                            {aiQueueItems.length > 0 && (
                                <InlineScheduleApproval
                                    items={aiQueueItems}
                                    onItemsChange={() => fetchEmails()}
                                />
                            )}
                            {/* 内嵌审批卡片：待办 */}
                            {aiTodoQueueItems.length > 0 && (
                                <InlineTodoApproval
                                    items={aiTodoQueueItems}
                                    onItemsChange={() => fetchEmails()}
                                />
                            )}
                            {/* 标签/标记行 */}
                            <div className="mail-detail-tags">
                                {!selectedEmail.isRead && (
                                    <span className="mail-tag mail-tag-unread">
                                        ● {t("email.unread")}
                                    </span>
                                )}
                                {selectedEmail.isFlagged && (
                                    <span className="mail-tag mail-tag-flagged">
                                        <Flag size={12} /> {t("email.flagged")}
                                    </span>
                                )}
                                {selectedEmail.isRead && (
                                    <span className="mail-tag mail-tag-read">
                                        ✓ {t("email.read")}
                                    </span>
                                )}
                                {selectedEmail.isAiProcessed && (
                                    <span className="mail-tag mail-tag-ai">
                                        <Sparkles size={12} />{" "}
                                        {t("email.aiProcessed")}
                                    </span>
                                )}
                            </div>
                            {selectedEmail.htmlBody ? (
                                <div
                                    className="mail-detail-html"
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(
                                            selectedEmail.htmlBody,
                                        ),
                                    }}
                                />
                            ) : selectedEmail.body ? (
                                <PlainTextEmail text={selectedEmail.body} />
                            ) : (
                                <p className="mail-plain-empty">
                                    {t("email.noBody")}
                                </p>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default MyMail;
