/**
 * 邮件服务抽象层 —— 提供统一的邮件搜索接口
 * 供 MyMail 页面和 MCP 工具共同使用，避免重复耦合
 */

import { getToken, customFetch, type EmailListItem } from "./api";

export interface EmailSearchParams {
    query: string;
    limit?: number;
}

export interface EmailSearchResult {
    emails: Array<EmailListItem & { snippet?: string }>;
    total: number;
    query: string;
}

/**
 * 搜索邮件 —— 统一入口
 * 调用服务端搜索端点，由服务端处理跨提供商的搜索逻辑
 */
export async function searchEmails(
    params: EmailSearchParams,
): Promise<EmailSearchResult> {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const q = encodeURIComponent(params.query);
    const limit = Math.min(Math.max(params.limit || 20, 1), 100);
    const response = await customFetch(
        `/api/emails/search?q=${q}&limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "邮件搜索失败");
    }

    return response.json();
}

/**
 * 在已加载的邮件列表中执行客户端过滤（即时搜索，不发起网络请求）
 */
export function filterEmailsLocally(
    emails: Array<EmailListItem & { body?: string }>,
    query: string,
): Array<EmailListItem & { snippet?: string }> {
    if (!query.trim()) return emails;

    const q = query.toLowerCase().trim();
    return emails
        .filter((email) => {
            const subject = (email.subject || "").toLowerCase();
            const fromName = (email.from?.name || "").toLowerCase();
            const fromAddr = (email.from?.address || "").toLowerCase();
            const body = (email.body || "").toLowerCase();

            return (
                subject.includes(q) ||
                fromName.includes(q) ||
                fromAddr.includes(q) ||
                body.includes(q)
            );
        })
        .map((email) => {
            // 生成搜索摘要（关键词所在上下文）
            const body = (email.body || "").toLowerCase();
            const idx = body.indexOf(q);
            let snippet: string | undefined;
            if (idx >= 0) {
                const start = Math.max(0, idx - 30);
                const end = Math.min(body.length, idx + q.length + 50);
                snippet = (start > 0 ? "…" : "") + body.slice(start, end) + (end < body.length ? "…" : "");
            }
            return { ...email, snippet };
        });
}
