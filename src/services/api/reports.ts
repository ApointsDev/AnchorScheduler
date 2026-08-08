// 用户反馈 / 举报 API（RPT-001）
import { customFetch, getToken } from "./client";

// ── 类型 ──────────────────────────────────────────────────

export type ReportType = "feedback" | "report";
export type ReportStatus = "pending" | "processing" | "resolved" | "rejected";

export interface UserReport {
    id: string;
    userId: string;
    type: ReportType;
    category: string | null;
    targetId: string | null;
    content: string;
    contact: string | null;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

export interface SubmitReportInput {
    type?: ReportType;
    category?: string | null;
    targetId?: string | null;
    content: string;
    contact?: string | null;
}

export interface MyReportsResponse {
    reports: UserReport[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ── 方法 ──────────────────────────────────────────────────

/** 提交反馈 / 举报 */
export const submitReport = async (
    input: SubmitReportInput,
): Promise<{ report: UserReport }> => {
    const response = await customFetch("/api/reports", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(input),
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "提交失败" }));
        throw new Error(error.error || "提交失败");
    }
    return response.json();
};

/** 我提交的反馈 / 举报记录 */
export const getMyReports = async (opts?: {
    page?: number;
    limit?: number;
}): Promise<MyReportsResponse> => {
    const params = new URLSearchParams();
    if (opts?.page) params.set("page", String(opts.page));
    if (opts?.limit) params.set("limit", String(opts.limit));

    const response = await customFetch(
        "/api/reports/mine?" + params.toString(),
        {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        },
    );
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "获取记录失败" }));
        throw new Error(error.error || "获取记录失败");
    }
    return response.json();
};
