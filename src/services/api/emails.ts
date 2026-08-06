// 邮件：列表、详情、已读标记与 AI 处理
import { getToken, customFetch } from "./client";
import type { ScheduleQueueItem } from "./tasks";
import type { TodoQueueItem } from "./todos";

/** 邮件列表项（不含正文，用于列表展示） */
export interface EmailListItem {
    id: string;
    subject: string;
    from?: { name: string; address: string };
    receivedAt: string;
    isRead: boolean;
    isFlagged: boolean;
    flags: string[];
    isAiProcessed: boolean;
    hasAttachments: boolean;
}

/** 原始邮件数据（含正文，用于详情查看） */
export interface RawEmail {
    id: string;
    subject: string;
    from?: { name: string; address: string };
    receivedAt: string;
    isRead: boolean;
    isFlagged: boolean;
    flags: string[];
    isAiProcessed: boolean;
    body: string;
    htmlBody?: string;
    hasAttachments?: boolean;
    attachmentsCount?: number;
    source?: string;
}

export const getEmailList = async (
    limit: number = 50,
): Promise<{ emails: EmailListItem[]; total: number }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/emails?limit=${encodeURIComponent(limit)}`,
        { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取邮件列表失败");
    }
    return response.json();
};

export const getRawEmail = async (emailId: string): Promise<RawEmail> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/emails/${encodeURIComponent(emailId)}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取邮件失败");
    }
    const data = await response.json();
    return data.email as RawEmail;
};

/** 标记邮件为已读 */
export const markEmailAsRead = async (emailId: string): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    await customFetch(`/api/emails/${encodeURIComponent(emailId)}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
    });
};

/** 手动触发 AI 处理邮件 */
export const triggerAiProcess = async (
    emailId: string,
): Promise<{
    success: boolean;
    message: string;
    queuedSchedules: string[];
    queueItems: ScheduleQueueItem[];
    queuedTodos: string[];
    todoQueueItems: TodoQueueItem[];
    toolCallsTriggered: boolean;
    validationFailed?: boolean;
    lastValidationError?: string;
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/emails/${encodeURIComponent(emailId)}/ai-process`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "AI 处理失败");
    }
    return response.json();
};
