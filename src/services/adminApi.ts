// Admin API — 管理面板专用
import { customFetch, getToken } from "./api";

export interface AdminFieldMeta {
    type: string;
    sensitive: boolean;
}

export interface AdminUserRow {
    id: string;
    email: string;
    name: string;
    XJTLUaccount: string | null;
    XJTLUPassword: string | null;
    passwordHash: string | null;
    JWTtoken: string | null;
    MStoken: string | null;
    MSRefreshToken: string | null;
    MSbinded: boolean;
    ExchangeAccessToken: string | null;
    ExchangeRefreshToken: string | null;
    ExchangeTokenExpiresAt: number | null;
    ExchangeBinded: boolean;
    SmtpBinded: boolean;
    SmtpEmail: string | null;
    SmtpPassword: string | null;
    SmtpHost: string | null;
    SmtpPort: number | null;
    SmtpTls: boolean;
    CAFSub: string | null;
    CAFAccessToken: string | null;
    CAFTokenExpiresAt: number | null;
    ebridgeBinded: boolean;
    timetableUrl: string;
    timetableFetchLevel: number;
    mailReadingSpan: number;
    conflictBoundaryInclusive: boolean;
    weekOffset: number;
    CalDavBaseUrl: string | null;
    CalDavUsername: string | null;
    CalDavPassword: string | null;
    CalDavPrincipalUrl: string | null;
    CalDavCalendarHome: string | null;
    CalDavCalendarUrl: string | null;
    CalDavEnabled: boolean;
    CalDavLastSyncAt: string | null;
    CalDavServerEnabled: boolean;
    highEnergyPeriods: any;
    createdAt: string | null;
    updatedAt: string | null;
    taskCount: number;
}

export interface AdminUsersResponse {
    users: AdminUserRow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const checkAdmin = async (): Promise<boolean> => {
    const response = await customFetch("/api/admin/check", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.isAdmin === true;
};

export const getAdminFields = async (): Promise<
    Record<string, AdminFieldMeta>
> => {
    const response = await customFetch("/api/admin/fields", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "获取字段元数据失败");
    }
    const data = await response.json();
    return data.fields;
};

export const getAdminUsers = async (opts?: {
    search?: string;
    page?: number;
    limit?: number;
}): Promise<AdminUsersResponse> => {
    const params = new URLSearchParams();
    if (opts?.search) params.set("search", opts.search);
    if (opts?.page) params.set("page", String(opts.page));
    if (opts?.limit) params.set("limit", String(opts.limit));

    const response = await customFetch(
        "/api/admin/users?" + params.toString(),
        {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        },
    );
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "获取用户列表失败");
    }
    return response.json();
};

export const getAdminUser = async (userId: string): Promise<AdminUserRow> => {
    const response = await customFetch(`/api/admin/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "获取用户信息失败");
    }
    return response.json();
};

export const updateAdminUser = async (
    userId: string,
    updates: Record<string, any>,
): Promise<AdminUserRow> => {
    const response = await customFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "更新用户失败");
    }
    return response.json();
};

export interface CreateAdminUserParams {
    email: string;
    name: string;
    password?: string;
    XJTLUaccount?: string;
    XJTLUPassword?: string;
}

export const createAdminUser = async (
    params: CreateAdminUserParams,
): Promise<AdminUserRow> => {
    const response = await customFetch("/api/admin/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "创建用户失败");
    }
    return response.json();
};

export const deleteAdminUser = async (userId: string): Promise<void> => {
    const response = await customFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "删除用户失败");
    }
};

// 与后端 /api/admin/users/:id/schedule 返回结构一致
// 任务字段对应 server/routes/adminRoutes.ts schedule 端点

export interface AdminTaskItem {
    id: string;
    name: string;
    description: string | null;
    dueDate: string | null;
    startTime: string | null;
    endTime: string | null;
    location: string | null;
    completed: boolean;
    importance: string | null;
    scheduleType: string | null;
    recurrenceRule: string | null;
}

export interface AdminUserSchedule {
    // 后端仅返回 id/email/name 三个字段
    user: Pick<AdminUserRow, "id" | "email" | "name">;
    tasks: AdminTaskItem[];
    total: number;
}

export const getAdminUserSchedule = async (
    userId: string,
): Promise<AdminUserSchedule> => {
    const response = await customFetch(`/api/admin/users/${userId}/schedule`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "获取用户日程失败");
    }
    return response.json();
};

// ── 用户反馈 / 举报管理（RPT-001）──────────────────────────

export type ReportType = "feedback" | "report";
export type ReportStatus = "pending" | "processing" | "resolved" | "rejected";

export interface AdminReportRow {
    id: string;
    userId: string;
    userEmail: string | null;
    userName: string | null;
    type: ReportType;
    category: string | null;
    targetId: string | null;
    content: string;
    contact: string | null;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AdminReportsResponse {
    reports: AdminReportRow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const getAdminReports = async (opts?: {
    page?: number;
    limit?: number;
    type?: ReportType;
    status?: ReportStatus;
    search?: string;
}): Promise<AdminReportsResponse> => {
    const params = new URLSearchParams();
    if (opts?.page) params.set("page", String(opts.page));
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.type) params.set("type", opts.type);
    if (opts?.status) params.set("status", opts.status);
    if (opts?.search) params.set("search", opts.search);

    const response = await customFetch(
        "/api/admin/reports?" + params.toString(),
        {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        },
    );
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "获取反馈列表失败");
    }
    return response.json();
};

export const updateAdminReportStatus = async (
    id: string,
    status: ReportStatus,
): Promise<{ report: AdminReportRow }> => {
    const response = await customFetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "更新状态失败");
    }
    return response.json();
};

export const deleteAdminReport = async (id: string): Promise<void> => {
    const response = await customFetch(`/api/admin/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "删除失败");
    }
};

// ── 应用版本更新配置（UPD-001）──────────────────────────

export type AppPlatform = "android" | "ios" | "web" | "all";

export interface AdminAppRelease {
    id: string;
    platform: AppPlatform;
    version: string;
    versionCode: number;
    downloadUrl: string;
    releaseNotes: string | null;
    forceUpdate: boolean;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AdminAppReleaseInput {
    id?: string;
    platform: AppPlatform;
    version: string;
    versionCode?: number;
    downloadUrl: string;
    releaseNotes?: string | null;
    forceUpdate?: boolean;
    enabled?: boolean;
}

export const getAdminAppReleases = async (): Promise<{
    releases: AdminAppRelease[];
}> => {
    const response = await customFetch("/api/admin/app-update", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "获取版本配置失败");
    }
    return response.json();
};

export const saveAdminAppRelease = async (
    input: AdminAppReleaseInput,
): Promise<{ release: AdminAppRelease }> => {
    const response = await customFetch("/api/admin/app-update", {
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
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "保存版本配置失败");
    }
    return response.json();
};

export const setAdminAppReleaseEnabled = async (
    id: string,
    enabled: boolean,
): Promise<{ release: AdminAppRelease }> => {
    const response = await customFetch(`/api/admin/app-update/${id}/enabled`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ enabled }),
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "更新失败");
    }
    return response.json();
};

export const deleteAdminAppRelease = async (id: string): Promise<void> => {
    const response = await customFetch(`/api/admin/app-update/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "删除失败");
    }
};

// ── 会员与兑换码（管理端，MENU-001）──────────────────────────

export interface AdminRedeemCode {
    code: string;
    tier: string;
    days: number;
    maxUses: number | null;
    usedCount: number;
    expiresAt: string | null;
    active: boolean;
    createdAt: string;
    createdBy?: string | null;
}

/** 兑换码列表 */
export const listAdminRedeemCodes = async (): Promise<AdminRedeemCode[]> => {
    const response = await customFetch("/api/admin/membership/redeem-codes", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "获取兑换码列表失败");
    }
    const data = await response.json();
    return data.codes || [];
};

/** 批量生成兑换码 */
export const createAdminRedeemCodes = async (params: {
    tier: string;
    days: number;
    count?: number;
    maxUses?: number;
    expiresAt?: string | null;
}): Promise<AdminRedeemCode[]> => {
    const response = await customFetch("/api/admin/membership/redeem-codes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "生成兑换码失败");
    }
    const data = await response.json();
    return data.codes || [];
};

/** 直接为用户发放会员权益（按 userId） */
export const grantAdminMembership = async (params: {
    userId: string;
    tier: string;
    days: number;
}): Promise<{ grant: unknown; membership: unknown }> => {
    const response = await customFetch("/api/admin/membership/grant", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "请求失败" }));
        throw new Error(error.error || "发放会员失败");
    }
    return response.json();
};
