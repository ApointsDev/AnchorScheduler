// DA 校园大事件（多校）API 客户端
// 公开端点无需 JWT；管理/学生端点需登录。
import { getToken, customFetch } from "./client";

// ── 公开类型 ───────────────────────────────────────────────

export interface School {
    id: string;
    slug: string;
    name: string;
    eventsEmail: string | null;
    themeColor: string | null;
}

export interface DaEvent {
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    location?: string;
    allDay?: boolean;
    category?: string;
}

export interface DaPageConfig {
    title: string;
    intro: string;
    contact: string;
    themeColor: string | null;
    eventsEmail: string | null;
    schoolName: string;
    slug: string;
}

// ── 管理类型 ───────────────────────────────────────────────

export interface DaAdminSchool extends School {
    enabled: boolean;
    createdAt?: string;
    updatedAt?: string;
    admins: string[];
    daAccountEmail: string;
}

export interface DaQueueItem {
    id: string;
    userId: string;
    rawRequest: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DaQueueResponse {
    schedule: DaQueueItem[];
    todo: DaQueueItem[];
}

export interface DaSettings {
    [key: string]: string;
}

export interface DaStudentRow {
    userId: string;
    name: string;
    email: string;
    optedIn: boolean;
    updatedAt?: string;
}

// ── 工具函数 ───────────────────────────────────────────────

async function authedFetch(
    input: string,
    init?: RequestInit & { _isRetry?: boolean },
): Promise<Response> {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const headers = new Headers(init?.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    return customFetch(input, { ...init, headers } as any);
}

// ── 公开（无 JWT）──────────────────────────────────────────

export const getDaSchools = async (): Promise<School[]> => {
    const res = await customFetch("/api/da/schools");
    if (!res.ok) throw new Error("加载学校列表失败");
    const data = await res.json();
    return data.schools || [];
};

export const getDaEvents = async (
    slug: string,
    opts?: { start?: string; end?: string },
): Promise<DaEvent[]> => {
    const params = new URLSearchParams();
    if (opts?.start) params.set("start", opts.start);
    if (opts?.end) params.set("end", opts.end);
    const qs = params.toString();
    const res = await customFetch(
        `/api/da/${encodeURIComponent(slug)}/events${qs ? `?${qs}` : ""}`,
    );
    if (!res.ok) throw new Error("加载大事件失败");
    const data = await res.json();
    return data.events || [];
};

export const getDaEvent = async (
    slug: string,
    id: string,
): Promise<DaEvent> => {
    const res = await customFetch(
        `/api/da/${encodeURIComponent(slug)}/events/${encodeURIComponent(id)}`,
    );
    if (!res.ok) throw new Error("加载事件失败");
    const data = await res.json();
    return data.event;
};

export const getDaPage = async (slug: string): Promise<DaPageConfig> => {
    const res = await customFetch(
        `/api/da/${encodeURIComponent(slug)}/page`,
    );
    if (!res.ok) throw new Error("加载页面配置失败");
    const data = await res.json();
    return data.page;
};

// ── 系统管理员：学校管理 ───────────────────────────────────

/** 我可管理的学校（系统管理员=全部；否则=school_admins 中的学校） */
export const getDaAdminMySchools = async (): Promise<DaAdminSchool[]> => {
    const res = await authedFetch("/api/da/admin/my-schools");
    if (!res.ok) throw new Error("加载学校列表失败");
    const data = await res.json();
    return data.schools || [];
};

export const getDaAdminSchools = async (): Promise<DaAdminSchool[]> => {
    const res = await authedFetch("/api/da/admin/schools");
    if (!res.ok) throw new Error("加载学校列表失败");
    const data = await res.json();
    return data.schools || [];
};

export const createDaSchool = async (input: {
    slug: string;
    name: string;
    eventsEmail?: string;
    themeColor?: string;
}): Promise<School> => {
    const res = await authedFetch("/api/da/admin/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "创建学校失败");
    }
    const data = await res.json();
    return data.school;
};

export const updateDaSchool = async (
    schoolId: string,
    patch: {
        slug?: string;
        name?: string;
        eventsEmail?: string | null;
        themeColor?: string | null;
        enabled?: boolean;
    },
): Promise<School> => {
    const res = await authedFetch(
        `/api/da/admin/schools/${encodeURIComponent(schoolId)}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "更新学校失败");
    }
    const data = await res.json();
    return data.school;
};

export const deleteDaSchool = async (schoolId: string): Promise<void> => {
    const res = await authedFetch(
        `/api/da/admin/schools/${encodeURIComponent(schoolId)}`,
        { method: "DELETE" },
    );
    if (!res.ok) throw new Error("删除学校失败");
};

export const addDaSchoolAdmin = async (
    schoolId: string,
    email: string,
): Promise<void> => {
    const res = await authedFetch(
        `/api/da/admin/schools/${encodeURIComponent(schoolId)}/admins`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "添加管理员失败");
    }
};

export const removeDaSchoolAdmin = async (
    schoolId: string,
    email: string,
): Promise<void> => {
    const res = await authedFetch(
        `/api/da/admin/schools/${encodeURIComponent(schoolId)}/admins/${encodeURIComponent(email)}`,
        { method: "DELETE" },
    );
    if (!res.ok) throw new Error("移除管理员失败");
};

// ── 学校 DA 管理员：事件 / 队列 / 设置 ─────────────────────

export const getDaAdminEvents = async (slug: string): Promise<DaEvent[]> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/events`,
    );
    if (!res.ok) throw new Error("加载事件失败");
    const data = await res.json();
    return data.events || [];
};

export const createDaEvent = async (
    slug: string,
    input: {
        name: string;
        description?: string;
        startTime?: string;
        endTime?: string;
        location?: string;
        allDay?: boolean;
        category?: string;
        recurrenceRule?: string;
    },
): Promise<DaEvent> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/events`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "创建事件失败");
    }
    const data = await res.json();
    return data.event;
};

export const updateDaEvent = async (
    slug: string,
    id: string,
    patch: Partial<DaEvent>,
): Promise<DaEvent> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/events/${encodeURIComponent(id)}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "更新事件失败");
    }
    const data = await res.json();
    return data.event;
};

export const deleteDaEvent = async (slug: string, id: string): Promise<void> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/events/${encodeURIComponent(id)}`,
        { method: "DELETE" },
    );
    if (!res.ok) throw new Error("删除事件失败");
};

export const getDaQueue = async (slug: string): Promise<DaQueueResponse> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/queue`,
    );
    if (!res.ok) throw new Error("加载队列失败");
    return res.json();
};

export const approveDaQueueItem = async (
    slug: string,
    queueId: string,
    opts?: { allowConflict?: boolean },
): Promise<{ ok: boolean; task?: DaEvent }> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/queue/${encodeURIComponent(queueId)}/approve`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ allowConflict: opts?.allowConflict === true }),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "审批失败");
    }
    return res.json();
};

export const rejectDaQueueItem = async (
    slug: string,
    queueId: string,
): Promise<void> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/queue/${encodeURIComponent(queueId)}/reject`,
        { method: "POST" },
    );
    if (!res.ok) throw new Error("拒绝失败");
};

export const importDaText = async (
    slug: string,
    text: string,
): Promise<{
    queuedSchedules: string[];
    queuedTodos: string[];
    toolCallsTriggered: boolean;
}> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/import`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "导入失败");
    }
    return res.json();
};

export const getDaSettings = async (
    slug: string,
): Promise<{ settings: DaSettings; page: DaPageConfig }> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/settings`,
    );
    if (!res.ok) throw new Error("加载设置失败");
    return res.json();
};

export const updateDaSettings = async (
    slug: string,
    body: { settings?: DaSettings; page?: Partial<DaPageConfig> },
): Promise<{ settings: DaSettings; page: DaPageConfig }> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/settings`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "保存设置失败");
    }
    return res.json();
};

export const refreshDaMail = async (slug: string): Promise<void> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/mail/refresh`,
        { method: "POST" },
    );
    if (!res.ok) throw new Error("刷新邮箱失败");
};

export const getDaStudents = async (
    slug: string,
    opts?: { limit?: number; offset?: number },
): Promise<{ students: DaStudentRow[]; total: number }> => {
    const params = new URLSearchParams();
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.offset) params.set("offset", String(opts.offset));
    const qs = params.toString();
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/students${qs ? `?${qs}` : ""}`,
    );
    if (!res.ok) throw new Error("加载学生贡献名单失败");
    return res.json();
};

/** 后台代管学生贡献开关 */
export const setDaAdminStudentOptin = async (
    slug: string,
    userId: string,
    optedIn: boolean,
): Promise<void> => {
    const res = await authedFetch(
        `/api/da/admin/${encodeURIComponent(slug)}/students/${encodeURIComponent(userId)}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ optedIn }),
        },
    );
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "设置贡献开关失败");
    }
};

// ── 学生：我的贡献开关 ─────────────────────────────────────

export const getDaOptin = async (): Promise<{ schoolId: string; optedIn: boolean }[]> => {
    const res = await authedFetch("/api/da/optin");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.optins || []).map((o: any) => ({
        schoolId: o.schoolId,
        optedIn: o.optedIn === 1 || o.optedIn === true,
    }));
};

export const setDaOptin = async (
    schoolId: string,
    optedIn: boolean,
): Promise<void> => {
    const res = await authedFetch("/api/da/optin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId, optedIn }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "设置贡献开关失败");
    }
};
