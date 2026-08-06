// AI 聊天记录持久化与多上下文管理
import { getToken, customFetch } from "./client";
import type { ChatMessage } from "../llmService";

export const loadChatHistory = async (): Promise<ChatMessage[]> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/chat/history", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "加载聊天记录失败");
    }
    const data = await response.json();
    return data.messages || [];
};

export const saveChatHistory = async (
    messages: ChatMessage[],
    contextId?: string,
): Promise<{ ok: boolean; contextId: string }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/chat/history", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages, contextId }),
    });
    if (!response.ok) {
        throw new Error("Failed to save chat history");
    }
    return response.json();
};

// ── 聊天上下文管理 ──────────────────────────────────────────────

export interface ChatContextInfo {
    id: string;
    title: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
}

export const getChatContexts = async (): Promise<ChatContextInfo[]> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/chat/contexts", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to load contexts");
    const data = await response.json();
    return data.contexts || [];
};

export const createChatContext = async (): Promise<ChatContextInfo> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/chat/contexts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to create context");
    const data = await response.json();
    return data.context;
};

export const loadChatContext = async (
    contextId: string,
): Promise<ChatMessage[]> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/chat/contexts/${encodeURIComponent(contextId)}`,
        { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) throw new Error("Failed to load context");
    const data = await response.json();
    return data.messages || [];
};

export const deleteChatContext = async (contextId: string): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/chat/contexts/${encodeURIComponent(contextId)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) throw new Error("Failed to delete context");
};

/** 撤销最后一轮对话，同时删除该轮创建的任务 */
export const undoLastChatTurn = async (): Promise<{
    ok: boolean;
    removedMessages: number;
    deletedTasks: number;
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/chat/undo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "撤销失败");
    }
    return response.json();
};
