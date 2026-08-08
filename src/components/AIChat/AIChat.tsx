import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Settings,
    User as UserIcon,
    Terminal,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Plus,
    Trash2,
    MessageSquare,
    Undo2,
} from "lucide-react";
import { SimpleMcpClient, type McpTool } from "../../services/SimpleMcpClient";
import {
    chatCompletion,
    type ChatMessage,
    type LLMConfig,
} from "../../services/llmService";
import {
    getToken,
    loadChatHistory,
    saveChatHistory,
    getChatContexts,
    createChatContext,
    loadChatContext,
    deleteChatContext,
    undoLastChatTurn,
    type ChatContextInfo,
} from "../../services/api";
import { toShanghaiISO } from "../../utils/time";
import { isBelow } from "../../utils/breakpoints";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import BottomSheet from "../ui/BottomSheet";
import { useMobileActionBar } from "../ui/MobileActionBar";
import ChatActionBar from "./ChatActionBar";
import logo from "../../assets/anchorcat.svg";
import "../../styles/AIChat.css";
import "../../styles/ContextList.css";

/* ── 常量 ──────────────────────────────────────────────────────── */

const AUTO_ARCHIVE_MSG_COUNT = 30;
const AUTO_ARCHIVE_IDLE_MS = 30 * 60 * 1000;

function makeSystemMsg(
    t: (key: string, options?: Record<string, unknown>) => string,
): ChatMessage {
    return {
        role: "system",
        content: t("ai.systemPrompt", { time: toShanghaiISO() }),
    };
}

/* ── 子组件 ────────────────────────────────────────────────────── */

const ToolMessage: React.FC<{ content: string; name: string }> = ({
    content,
    name,
}) => {
    const [expanded, setExpanded] = useState(false);
    let parsedContent: any = content;
    let isJson = false;
    try {
        parsedContent = JSON.parse(content);
        isJson = true;
    } catch (e) {
        // ignore
    }

    return (
        <div className="tool-result-container">
            <div
                className="tool-result-header"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="tool-info">
                    <CheckCircle2
                        size={14}
                        style={{ color: "var(--color-success)" }}
                    />
                    <span className="tool-name">调用成功: {name}</span>
                </div>
                <div className="tool-toggle">
                    {expanded ? (
                        <ChevronDown size={14} />
                    ) : (
                        <ChevronRight size={14} />
                    )}
                </div>
            </div>
            {expanded && (
                <div className="tool-result-body">
                    <pre>
                        {isJson
                            ? JSON.stringify(parsedContent, null, 2)
                            : content}
                    </pre>
                </div>
            )}
        </div>
    );
};

/* ── 主组件 ────────────────────────────────────────────────────── */

const AIChat: React.FC = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [uploadedImages, setUploadedImages] = useState<Map<number, string>>(
        new Map(),
    );
    const [hasMultimodal, setHasMultimodal] = useState(false);
    const [currentContextId, setCurrentContextId] = useState<string | null>(
        null,
    );
    const [contexts, setContexts] = useState<ChatContextInfo[]>([]);
    const [showContextList, setShowContextList] = useState(!isBelow("md"));
    const [loadedFromDb, setLoadedFromDb] = useState(false);
    const [switchingContext, setSwitchingContext] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [undoLoading, setUndoLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [mcpConnected, setMcpConnected] = useState(false);
    const [tools, setTools] = useState<McpTool[]>([]);
    const [config, setConfig] = useState<LLMConfig>({
        baseUrl:
            localStorage.getItem("llm_baseUrl") || "https://api.openai.com/v1",
        apiKey: localStorage.getItem("llm_apiKey") || "",
        model: localStorage.getItem("llm_model") || "gpt-3.5-turbo",
    });

    const mcpClientRef = useRef<SimpleMcpClient | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastActivityRef = useRef<number>(Date.now());
    const contextIdRef = useRef<string | null>(null);

    // 同步 ref
    useEffect(() => {
        contextIdRef.current = currentContextId;
    }, [currentContextId]);

    // MCP 连接
    useEffect(() => {
        const token = getToken();
        if (!token) return;
        const client = new SimpleMcpClient(token);
        mcpClientRef.current = client;
        client.connect(
            () => {
                setMcpConnected(true);
                client.listTools().then(setTools).catch(console.error);
            },
            (err) => {
                console.error("MCP Connection Error:", err);
                setMcpConnected(false);
            },
        );
        return () => {
            client.close();
        };
    }, []);

    // 初始加载：上下文列表 + 活跃上下文消息
    useEffect(() => {
        (async () => {
            try {
                const ctxList = await getChatContexts();
                setContexts(ctxList);
                // 加载活跃上下文的消息
                const history = await loadChatHistory();
                if (history.length > 0) {
                    setMessages(history);
                }
                const active = ctxList.find((c) => c.isActive);
                if (active) setCurrentContextId(active.id);
            } catch {
                // fallback localStorage
                try {
                    const raw = localStorage.getItem("mcp_chat_history");
                    if (raw) {
                        const parsed = JSON.parse(raw) as ChatMessage[];
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setMessages(parsed);
                        }
                    }
                } catch (e) {
                    console.warn("Failed to load chat history:", e);
                }
            }
            setLoadedFromDb(true);
        })();
    }, []);

    // 持久化消息到当前上下文
    useEffect(() => {
        if (!loadedFromDb) return;
        const cid = contextIdRef.current;
        saveChatHistory(messages, cid ?? undefined)
            .then((res) => {
                if (res.contextId && !cid) {
                    setCurrentContextId(res.contextId);
                }
            })
            .catch((e) =>
                console.warn("Failed to save chat history to DB:", e),
            );
    }, [messages, loadedFromDb]);

    // 自动滚动
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 检查是否应该自动归档（消息过多或闲置过久）
    const checkAutoArchive = useCallback(() => {
        const msgCount = messages.filter(
            (m) => m.role === "user" || m.role === "assistant",
        ).length;
        const idle = Date.now() - lastActivityRef.current;
        if (
            msgCount >= AUTO_ARCHIVE_MSG_COUNT ||
            idle >= AUTO_ARCHIVE_IDLE_MS
        ) {
            if (msgCount > 1) {
                handleNewContext();
            }
        }
    }, [messages]);

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("llm_baseUrl", config.baseUrl);
        localStorage.setItem("llm_apiKey", config.apiKey);
        localStorage.setItem("llm_model", config.model);
        setShowSettings(false);
    };

    const refreshContexts = async () => {
        try {
            const list = await getChatContexts();
            // 合入服务端数据，保持本地列表顺序不变
            const serverMap = new Map(list.map((c) => [c.id, c]));
            setContexts((prev) => {
                // 更新已有条目、移除已删除条目
                const merged = prev
                    .filter((c) => serverMap.has(c.id))
                    .map((c) => ({ ...c, ...serverMap.get(c.id)! }));
                // 追加新增条目（服务端有的、本地没有的）
                const existingIds = new Set(merged.map((c) => c.id));
                for (const c of list) {
                    if (!existingIds.has(c.id)) merged.push(c);
                }
                return merged;
            });
        } catch (e) {
            console.warn("Failed to refresh contexts", e);
        }
    };

    const handleNewContext = async () => {
        try {
            await createChatContext();
            setMessages([]);
            setUploadedImages(new Map());
            setHasMultimodal(false);
            setCurrentContextId(null);
            lastActivityRef.current = Date.now();
            await refreshContexts();
        } catch (e) {
            console.warn("Failed to create context", e);
        }
    };

    const handleSwitchContext = async (ctx: ChatContextInfo) => {
        try {
            // 立即更新本地状态：高亮新项、标记旧项失活、保持列表顺序不变
            setCurrentContextId(ctx.id);
            setContexts((prev) =>
                prev.map((c) => ({
                    ...c,
                    isActive: c.id === ctx.id,
                })),
            );
            setSwitchingContext(true);
            await new Promise((r) => setTimeout(r, 60));
            const msgs = await loadChatContext(ctx.id);
            setMessages(msgs.length > 0 ? msgs : []);
            setUploadedImages(new Map());
            setHasMultimodal(false);
            lastActivityRef.current = Date.now();
            // 后台同步服务端数据（不改变本地顺序，仅更新元数据）
            refreshContexts();
            setTimeout(() => setSwitchingContext(false), 300);
        } catch (e) {
            setSwitchingContext(false);
            console.warn("Failed to switch context", e);
        }
    };

    const handleDeleteContext = async (ctxId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteChatContext(ctxId);
            // 立即从本地列表移除，保持顺序不变
            setContexts((prev) => prev.filter((c) => c.id !== ctxId));
            if (ctxId === currentContextId) {
                setMessages([]);
                setCurrentContextId(null);
            }
            // 后台同步服务端数据
            refreshContexts();
        } catch (err) {
            console.warn("Failed to delete context", err);
        }
    };

    const handleUndo = async () => {
        if (undoLoading || messages.length === 0) return;
        setUndoLoading(true);
        try {
            const result = await undoLastChatTurn();
            // 在本地截断：找到最后一个 user 消息并移除之后的所有内容
            let lastUserIdx = -1;
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].role === "user") {
                    lastUserIdx = i;
                    break;
                }
            }
            if (lastUserIdx >= 0) {
                setMessages(messages.slice(0, lastUserIdx));
            }
            console.log(
                `Undid last turn: removed ${result.removedMessages} messages, deleted ${result.deletedTasks} tasks`,
            );
        } catch (e: any) {
            console.error("Undo failed", e);
        } finally {
            setUndoLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        lastActivityRef.current = Date.now();

        const userMsg: ChatMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // 每次调用使用最新的系统时间
            const currentMessages = [makeSystemMsg(t), ...messages, userMsg];
            let response = await chatCompletion(
                currentMessages,
                effectiveConfig,
                tools,
            );

            while (response.tool_calls && response.tool_calls.length > 0) {
                currentMessages.push(response);
                setMessages([...currentMessages]);

                for (const toolCall of response.tool_calls) {
                    const toolName = toolCall.function.name;
                    const args = JSON.parse(toolCall.function.arguments);
                    const toolMsgId = toolCall.id;

                    try {
                        if (!mcpClientRef.current)
                            throw new Error("MCP Client not connected");
                        const result = await mcpClientRef.current.callTool(
                            toolName,
                            args,
                        );
                        currentMessages.push({
                            role: "tool",
                            tool_call_id: toolMsgId,
                            name: toolName,
                            content: JSON.stringify(result),
                        });
                    } catch (err: any) {
                        currentMessages.push({
                            role: "tool",
                            tool_call_id: toolMsgId,
                            name: toolName,
                            content: JSON.stringify({
                                error: err.message,
                            }),
                        });
                    }
                }

                setMessages([...currentMessages]);

                // 用最新系统时间替换第一条系统消息
                currentMessages[0] = makeSystemMsg(t);
                response = await chatCompletion(
                    currentMessages,
                    effectiveConfig,
                    tools,
                );
            }

            currentMessages.push(response);
            setMessages(currentMessages);

            // 自动归档检查
            checkAutoArchive();
        } catch (err: any) {
            console.error("Chat Error:", err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `❌ ${err.message}`,
                    _systemNotice: true,
                } as any,
            ]);
        } finally {
            setLoading(false);
        }
    };

    /* ── 图片/语音上传 ────────────────────────────────── */
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";

        const isImage = file.type.startsWith("image/");
        const imageUrl = isImage ? URL.createObjectURL(file) : null;

        const token = getToken();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("prompt", input || "请描述这张图片");

        const userMsg: ChatMessage = {
            role: "user",
            content: input || (isImage ? "" : `[文件: ${file.name}]`),
        };
        const newIdx = messages.length;
        if (imageUrl) {
            setUploadedImages((prev) => new Map(prev).set(newIdx, imageUrl));
            setHasMultimodal(true);
        }
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        lastActivityRef.current = Date.now();

        try {
            const resp = await fetch("/api/doubao/chat", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || "上传失败");
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.content || data.message || "",
                },
            ]);
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `❌ 上传失败: ${err.message}`,
                    _systemNotice: true,
                } as any,
            ]);
        } finally {
            setLoading(false);
        }
    };

    /* ── 移动端浮动 footer：聊天输入栏 ──────────────────── */
    const chatFooterId = useId();
    const { register, unregister } = useMobileActionBar();
    const handleSendRef = useRef(handleSend);
    handleSendRef.current = handleSend;

    /* 多模态对话时自动切换豆包模型 */
    const effectiveConfig = hasMultimodal
        ? {
              baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
              apiKey: localStorage.getItem("llm_apiKey") || config.apiKey,
              model: "doubao-seed-2-0-pro-260215",
          }
        : config;
    useEffect(() => {
        if (!isBelow("md")) return;
        const send = () => handleSendRef.current();
        register({
            id: chatFooterId,
            content: (
                <ChatActionBar
                    input={input}
                    onInputChange={setInput}
                    onSend={send}
                    onFileUpload={handleFileUpload}
                    loading={loading}
                />
            ),
        });
        return () => unregister(chatFooterId);
    }, [chatFooterId, register, unregister, input, loading]);

    /* 上下文列表渲染（复用）
     * showHeader: PC 端内嵌面板需要自带标题栏，窄屏 BottomSheet 自带标题不需重复 */
    const renderContextList = (showHeader = true) => (
        <>
            {showHeader && (
                <div className="context-panel-header">
                    <span>对话历史</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNewContext}
                        title={t("ai.newChat")}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
            )}
            <div className="context-list">
                {contexts.length === 0 ? (
                    <div className="context-empty">暂无历史对话</div>
                ) : (
                    contexts.map((ctx) => (
                        <div
                            key={ctx.id}
                            className={`context-item ${ctx.id === currentContextId ? "context-active" : ""}`}
                            onClick={() => handleSwitchContext(ctx)}
                        >
                            <MessageSquare size={14} className="context-icon" />
                            <div className="context-info">
                                <div className="context-title">{ctx.title}</div>
                                <div className="context-meta">
                                    {ctx.messageCount} 条消息
                                </div>
                            </div>
                            <button
                                className="context-delete"
                                onClick={(e) => handleDeleteContext(ctx.id, e)}
                                title="删除"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </>
    );

    const isNarrow = isBelow("md");

    /* ── 共享的头部工具栏 ──────────────────────────────── */
    const renderHeader = () => (
        <div className="chat-header">
            <div className="chat-header-left">
                <img src={logo} alt="AI" className="chat-bot-avatar" />
                <span className="chat-header-title">{t("ai.chatTitle")}</span>
                <Badge
                    variant={mcpConnected ? "success" : "error"}
                    style={{ marginLeft: "8px" }}
                >
                    {mcpConnected ? "MCP" : "离线"}
                </Badge>
            </div>
            <div className="chat-header-actions">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowContextList(!showContextList)}
                    title="对话历史"
                >
                    <MessageSquare size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNewContext}
                    title={t("ai.newChat")}
                >
                    <Plus size={18} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    title={t("ai.settings")}
                >
                    <Settings size={18} />
                </Button>
            </div>
        </div>
    );

    /* ── 共享的消息列表 ────────────────────────────────── */
    const visibleMessages = messages.filter((msg) => msg.role !== "system");

    const renderMessages = () => {
        if (visibleMessages.length === 0 && !loading) {
            return (
                <div className="chat-welcome">
                    <div className="chat-welcome-icon">
                        <img
                            src={logo}
                            alt="AI"
                            className="chat-bot-avatar-lg"
                        />
                    </div>
                    <h2 className="chat-welcome-title">
                        {t("ai.chatWelcomeTitle")}
                    </h2>
                    <p className="chat-welcome-desc">{t("ai.chatWelcome")}</p>
                    <div className="chat-welcome-hints">
                        <span>{t("ai.viewToday")}</span>
                        <span>{t("ai.summarizeMail")}</span>
                        <span>{t("ai.addNewSchedule")}</span>
                    </div>
                </div>
            );
        }

        return (
            <>
                {visibleMessages.map((msg, idx) => {
                    const isSystemNotice = (msg as any)._systemNotice;
                    if (isSystemNotice) {
                        return (
                            <div key={idx} className="system-notice">
                                {msg.content}
                            </div>
                        );
                    }

                    const imageUrl = uploadedImages.get(messages.indexOf(msg));

                    return (
                        <div
                            key={idx}
                            className={`message ${msg.role === "tool" ? "tool" : msg.role === "user" ? "user" : "assistant"}`}
                        >
                            {msg.role !== "tool" && (
                                <div className="avatar">
                                    {msg.role === "user" ? (
                                        <UserIcon size={20} />
                                    ) : (
                                        <img
                                            src={logo}
                                            alt="AI"
                                            className="chat-bot-avatar"
                                        />
                                    )}
                                </div>
                            )}

                            {msg.role === "tool" ? (
                                <ToolMessage
                                    content={msg.content || ""}
                                    name={msg.name || "unknown"}
                                />
                            ) : (
                                <div className="message-content markdown-body">
                                    {imageUrl && (
                                        <img
                                            src={imageUrl}
                                            alt="上传的图片"
                                            className="message-image"
                                        />
                                    )}
                                    {msg.content && (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                    {msg.tool_calls && (
                                        <div className="tool-calls-preview">
                                            {msg.tool_calls.map(
                                                (tc: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="tool-call-item"
                                                    >
                                                        <Terminal size={14} />
                                                        <span>
                                                            正在执行:{" "}
                                                            {tc.function.name}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </>
        );
    };

    /* ── 渲染消息容器 ────────────────────────────────── */
    const renderMessageContainer = (children: React.ReactNode) => (
        <div className={`chat-messages ${switchingContext ? "switching" : ""}`}>
            {children}
            {loading && (
                <div
                    className="message assistant"
                    aria-label={t("ai.thinking")}
                >
                    <div className="avatar">
                        <img src={logo} alt="AI" className="chat-bot-avatar" />
                    </div>
                    <div className="message-content">
                        <div className="loading-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    /* ── 共享的设置面板 ────────────────────────────────── */
    const renderSettings = () => (
        <div className="settings-panel">
            <Card>
                <CardContent style={{ paddingTop: "20px" }}>
                    <form className="settings-form" onSubmit={handleSaveConfig}>
                        <Input
                            label="API Base URL"
                            type="text"
                            value={config.baseUrl}
                            onChange={(e) =>
                                setConfig({
                                    ...config,
                                    baseUrl: e.target.value,
                                })
                            }
                            placeholder="https://api.openai.com/v1"
                        />
                        <Input
                            label="API Key"
                            type="password"
                            value={config.apiKey}
                            onChange={(e) =>
                                setConfig({ ...config, apiKey: e.target.value })
                            }
                            placeholder="sk-..."
                        />
                        <Input
                            label="Model Name"
                            type="text"
                            value={config.model}
                            onChange={(e) =>
                                setConfig({ ...config, model: e.target.value })
                            }
                            placeholder="gpt-3.5-turbo"
                        />
                        <Button type="submit">保存配置</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );

    /* ── PC 端：卡片式布局 ─────────────────────────────── */
    if (!isNarrow) {
        return (
            <Card className="ai-chat-container">
                <div
                    className={`chat-context-panel ${showContextList ? "open" : ""}`}
                >
                    {renderContextList()}
                </div>
                <div className="chat-main">
                    <CardHeader className="chat-header">
                        <CardTitle>
                            <img
                                src={logo}
                                alt="AI"
                                className="chat-bot-avatar"
                                style={{ width: 24, height: 24 }}
                            />{" "}
                            {t("ai.chatTitle")}
                            <Badge
                                variant={mcpConnected ? "success" : "error"}
                                style={{ marginLeft: "10px" }}
                            >
                                {mcpConnected ? "MCP 已连接" : "MCP 未连接"}
                            </Badge>
                        </CardTitle>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setShowContextList(!showContextList)
                                }
                                title="对话历史"
                            >
                                <MessageSquare size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNewContext}
                                title={t("ai.newChat")}
                            >
                                <Plus size={16} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSettings(!showSettings)}
                            >
                                <Settings
                                    size={18}
                                    style={{ marginRight: "6px" }}
                                />{" "}
                                {t("ai.settings")}
                            </Button>
                        </div>
                    </CardHeader>
                    {showSettings && renderSettings()}
                    {renderMessageContainer(renderMessages())}
                    {/* 撤销按钮 */}
                    {messages.some((m) => m.role === "user") && (
                        <div className="chat-undo-row">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleUndo}
                                disabled={undoLoading || loading}
                                title="撤销最后一轮对话"
                            >
                                <Undo2 size={14} />
                                <span>撤销</span>
                            </Button>
                        </div>
                    )}
                    <ChatActionBar
                        embedded
                        input={input}
                        onInputChange={setInput}
                        onSend={handleSend}
                        onFileUpload={handleFileUpload}
                        loading={loading}
                    />
                </div>
            </Card>
        );
    }

    /* ── 手机端：全屏浮动布局 ──────────────────────────── */
    return (
        <div className="ai-chat-mobile">
            {renderHeader()}
            {showSettings && renderSettings()}
            {renderMessageContainer(renderMessages())}
            <BottomSheet
                open={showContextList}
                onClose={() => setShowContextList(false)}
                title="对话历史"
            >
                {renderContextList(false)}
            </BottomSheet>
        </div>
    );
};

export default AIChat;
