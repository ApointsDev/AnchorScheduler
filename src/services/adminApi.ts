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
