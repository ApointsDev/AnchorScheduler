// API 服务文件，处理与后端的所有通信

// 优先使用 VITE_API_BASE_URL（构建时注入），若未设置则使用当前页面 origin
const isDev = import.meta.env.VITE_DEV_MODE === "true";
const API_BASE_URL = isDev
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_BASE_URL || window.location.origin;

export const authEvents = new EventTarget();

// 将相对的 /api 路径解析为完整的后端地址，避免在前端与后端不同域时发出错误的相对请求
export function resolveApiUrl(input: string): string {
    if (
        input.startsWith(`${API_BASE_URL}`) ||
        input.startsWith(`${API_BASE_URL}`)
    ) {
        return input;
    }
    return `${API_BASE_URL}${input}`;
}

export const customFetch = async (
    input: string,
    init?: RequestInit,
): Promise<Response> => {
    const target = resolveApiUrl(input);
    const response = await fetch(target, init);
    if (response.status === 403) {
        authEvents.dispatchEvent(new Event("unauthorized"));
    }
    return response;
};

// 存储JWT令牌
export const setToken = (token: string): void => {
    localStorage.setItem("auth_token", token);
};

export const getToken = (): string | null => {
    return localStorage.getItem("auth_token");
};

export const removeToken = (): void => {
    localStorage.removeItem("auth_token");
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// 注册用户
export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export const register = async (
    data: RegisterData,
): Promise<{ token: string }> => {
    const response = await customFetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "注册失败");
    }

    const result = await response.json();
    // 保存用户邮箱
    localStorage.setItem("user_email", data.email);
    return result;
};

// 登录用户
export interface LoginData {
    email: string;
    password: string;
}

export const login = async (data: LoginData): Promise<{ token: string }> => {
    const response = await customFetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "登录失败");
    }

    const result = await response.json();
    // 保存用户邮箱
    localStorage.setItem("user_email", data.email);
    return result;
};

// 启动 CAF OAuth 流程
export const startCafAuth = (): void => {
    window.location.href = `${API_BASE_URL}/auth/caf`;
};

// 启动Microsoft OAuth流程
export const startMicrosoftAuth = (): void => {
    const token = getToken();
    if (token) {
        window.location.href = `${API_BASE_URL}/auth?jwt=${encodeURIComponent(token)}`;
    } else {
        window.location.href = `${API_BASE_URL}/auth`;
    }
};

// 启动 Exchange OAuth 流程 (XJTLU UIM)
export const startExchangeAuth = (loginHint?: string): Promise<void> => {
    const token = getToken();
    const width = 500;
    const height = 600;
    // 计算居中位置
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    let url = `${API_BASE_URL}/auth/exchange?jwt=${token}`;
    if (loginHint) {
        url += `&login_hint=${encodeURIComponent(loginHint)}`;
    }

    const authWindow = window.open(
        url,
        "ExchangeAuth",
        `width=${width},height=${height},left=${left},top=${top}`,
    );

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (authWindow?.closed) {
                clearInterval(timer);
                resolve();
            }
        }, 1000);

        const handler = (event: MessageEvent) => {
            if (event.data?.type === "EXCHANGE_BOUND") {
                clearInterval(timer);
                authWindow?.close();
                window.removeEventListener("message", handler);
                resolve();
            }
        };
        window.addEventListener("message", handler);
    });
};

// 解绑 Exchange
export interface UnbindExchangeResponse {
    message: string;
}

export const unbindExchange = async (): Promise<UnbindExchangeResponse> => {
    const response = await customFetch("/api/unbind/exchange", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "解绑失败");
    }

    return response.json();
};

export interface SmtpConfig {
    smtpEmail: string;
    smtpPassword: string;
    smtpHost: string;
    smtpPort: number;
    smtpTls: boolean;
}

export const bindSmtp = async (
    data: SmtpConfig,
): Promise<{ message: string }> => {
    const response = await customFetch("/api/bind/smtp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "SMTP 绑定失败");
    }

    return response.json();
};

export const unbindSmtp = async (): Promise<{ message: string }> => {
    const response = await customFetch("/api/unbind/smtp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "解绑失败");
    }

    return response.json();
};

export const saveEbridgeTimetableUrl = async (
    timetableUrl: string,
): Promise<void> => {
    const response = await customFetch(`${API_BASE_URL}/api/ebridge/save-url`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ timetableUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "保存课表 URL 失败");
    }
};

// 查询Microsoft Todo状态接口
export interface MicrosoftTodoStatus {
    connected: boolean;
    binded: boolean;
    tokenAvailable: boolean;
    lastChecked: string;
}

export const getMicrosoftTodoStatus =
    async (): Promise<MicrosoftTodoStatus> => {
        const response = await customFetch(
            `${API_BASE_URL}/api/status/microsoft-todo`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({}),
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "获取Microsoft Todo状态失败");
        }

        return response.json();
    };

// 查询Ebridge状态接口
export interface EbridgeStatus {
    connected: boolean;
    binded: boolean;
    passwordAvailable: boolean;
    emsClientAvailable: boolean;
    lastChecked: string;
    // Exchange specific status
    exchangeBinded?: boolean;
    exchangeTokenAvailable?: boolean;
    // SMTP specific status
    smtpBinded?: boolean;
    smtpEmail?: string | null;
    imapClientAvailable?: boolean;
}

export const getEbridgeStatus = async (): Promise<EbridgeStatus> => {
    const response = await customFetch(`${API_BASE_URL}/api/status/ebridge`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取Ebridge状态失败");
    }

    return response.json();
};

// 获取用户日志
export interface LogEntry {
    id: string;
    time: string;
    type: string;
    message: string;
    payload?: any;
}

export interface LogsResponse {
    logs: LogEntry[];
    total: number;
    limit: number;
    offset: number;
}

export const getLogs = async (params?: {
    limit?: number;
    offset?: number;
    type?: string;
    since?: string;
    until?: string;
}): Promise<LogsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.limit !== undefined)
        queryParams.append("limit", params.limit.toString());
    if (params?.offset !== undefined)
        queryParams.append("offset", params.offset.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.since) queryParams.append("since", params.since);
    if (params?.until) queryParams.append("until", params.until);

    const response = await customFetch(
        `${API_BASE_URL}/api/logs?${queryParams.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取日志失败");
    }

    return response.json();
};

// 获取任务列表
export type ScheduleType =
    | "single"
    | "recurring_daily"
    | "recurring_weekly"
    | "recurring_weekly_by_week_number"
    | "recurring_daily_on_days";

export interface Task {
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    dueDate: string;
    location?: string;
    completed: boolean;
    pushedToMSTodo: boolean;
    recurrenceRule?: string;
    parentTaskId?: string;
    importance?: "high" | "normal" | "low";
    scheduleType?: ScheduleType;
}

export interface TasksResponse {
    tasks: Task[];
    total: number;
    limit: number;
    offset: number;
    sortBy: string;
    order: "asc" | "desc";
}

export interface MicrosoftTodoStatus {
    connected: boolean;
    binded: boolean;
    tokenAvailable: boolean;
}

export class ScheduleConflictError extends Error {
    conflicts: Task[];
    constructor(message: string, conflicts: Task[]) {
        super(message);
        this.name = "ScheduleConflictError";
        this.conflicts = conflicts;
    }
}

export interface ConflictWarning {
    message: string;
    conflicts: Task[];
    instanceConflicts?: any[];
}

export interface CreateTaskResponse {
    task: Task;
    recurrenceSummary?: any;
    conflictWarning?: ConflictWarning;
}

export const createTask = async (
    taskData: Omit<Task, "id" | "completed">,
): Promise<CreateTaskResponse> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 && errorData.conflicts) {
            throw new ScheduleConflictError(
                errorData.error || "日程冲突",
                errorData.conflicts,
            );
        }
        throw new Error(errorData.error || "创建任务失败");
    }

    return await response.json();
};

export const updateTask = async (
    taskId: string,
    taskData: Partial<Omit<Task, "id">>,
): Promise<Task & { conflictWarning?: ConflictWarning }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/tasks/${encodeURIComponent(taskId)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskData),
        },
    );

    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 && errorData.conflicts) {
            throw new ScheduleConflictError(
                errorData.error || "日程冲突",
                errorData.conflicts,
            );
        }
        throw new Error(errorData.error || "更新任务失败");
    }

    return await response.json();
};

export interface BatchTaskResult {
    input: any;
    status: "created" | "conflict" | "error";
    task?: Task;
    conflictList?: Task[];
    errorMessage?: string;
}

export interface BatchTasksResponse {
    results: BatchTaskResult[];
    summary: {
        total: number;
        created: number;
        conflicts: number;
        errors: number;
    };
}

export const createTasksBatch = async (
    tasks: Omit<Task, "id" | "completed">[],
    boundaryConflict: boolean = false,
): Promise<BatchTasksResponse> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch("/api/tasks/batch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tasks, boundaryConflict }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "批量创建任务失败");
    }

    return await response.json();
};

export const getTasks = async (params: {
    start?: string;
    end?: string;
    limit?: number;
    q?: string;
    completed?: boolean;
    offset?: number;
    sortBy?: string;
    order?: "asc" | "desc";
}): Promise<TasksResponse> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const queryParams = new URLSearchParams();
    if (params.start) queryParams.append("start", params.start);
    if (params.end) queryParams.append("end", params.end);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.q) queryParams.append("q", params.q);
    if (params.completed !== undefined)
        queryParams.append("completed", params.completed.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);

    const response = await customFetch(`/api/tasks?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取任务失败");
    }

    return await response.json();
};

export const approveQueueItem = async (
    queueId: string,
    options?: { allowConflict?: boolean },
): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/schedule-queue/${encodeURIComponent(queueId)}/approve`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: options ? JSON.stringify(options) : undefined,
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "批准请求失败");
    }

    return response.json();
};

export const rejectQueueItem = async (queueId: string): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/schedule-queue/${encodeURIComponent(queueId)}/reject`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "拒绝请求失败");
    }

    return response.json();
};

export interface ScheduleQueueItem {
    id: string;
    userId: string;
    rawRequest: string;
    status: string;
    createdAt: string;
}

/** 原始邮件数据 */
export interface RawEmail {
    id: string;
    subject: string;
    from?: { name: string; address: string };
    receivedAt: string;
    isRead: boolean;
    body: string;
    hasAttachments?: boolean;
    attachmentsCount?: number;
    source?: string;
}

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

export const getScheduleQueue = async (): Promise<{
    queue: ScheduleQueueItem[];
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(`/api/schedule-queue`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取队列失败");
    }

    return response.json();
};

export const deleteTask = async (
    taskId: string,
    cascade: boolean = false,
): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const url = `/api/tasks/${encodeURIComponent(taskId)}${cascade ? "?cascade=true" : ""}`;

    const response = await customFetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "删除任务失败");
    }
};

export interface SyncTimetableResponse {
    message: string;
    added: number;
    errors: number;
}

export const syncTimetable = async (): Promise<SyncTimetableResponse> => {
    const response = await customFetch(`${API_BASE_URL}/api/sync/timetable`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "同步课表失败");
    }

    return response.json();
};

export interface DeleteTimetableResponse {
    message: string;
    count: number;
}

export const deleteTimetableTasks =
    async (): Promise<DeleteTimetableResponse> => {
        const response = await customFetch(
            `${API_BASE_URL}/api/sync/timetable`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "删除课表日程失败");
        }

        return response.json();
    };

// 获取当前周信息（含全局与用户偏移）
export interface WeekInfoResponse {
    rawWeekNumber: number;
    globalWeekOffset: number;
    userWeekOffset: number;
    effectiveWeek: number;
}

export const getWeekInfo = async (): Promise<WeekInfoResponse> => {
    const response = await customFetch(`/api/settings/week`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取周信息失败");
    }

    return response.json();
};

// 设置用户级周偏移或通过提供 currentWeek 来设置当前周
export const setUserWeek = async (data: {
    currentWeek?: number;
    userWeekOffset?: number;
}): Promise<WeekInfoResponse> => {
    const response = await customFetch(`/api/settings/week`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "设置周信息失败");
    }

    return response.json();
};

// ── CalDAV API ──────────────────────────────────────────────────────

export interface CalDavStatus {
    enabled: boolean;
    baseUrl: string | null;
    username: string | null;
    principalUrl: string | null;
    calendarHome: string | null;
    calendarUrl: string | null;
    lastSyncAt: string | null;
}

export interface CalDavSyncResult {
    pulled: {
        created: number;
        updated: number;
        skippedConflicts: number;
        errors: number;
    };
    pushed: {
        created: number;
        updated: number;
        skippedConflicts: number;
        errors: number;
    };
}

export interface CalDavServerStatus {
    enabled: boolean;
    serverUrl: string;
    principalUrl: string | null;
    calendarHomeUrl: string | null;
    calendarUrl: string | null;
    username: string | null;
    password: string | null;
    connectionHint: string | null;
}

export interface CalDavServerEnableResult {
    message: string;
    enabled: boolean;
    serverUrl: string;
    principalUrl: string | null;
    calendarHomeUrl: string | null;
    calendarUrl: string | null;
    username: string | null;
    password: string | null;
}

export const configureCalDav = async (data: {
    baseUrl: string;
    username: string;
    password: string;
    calendarUrl?: string;
}): Promise<any> => {
    const response = await customFetch("/api/caldav/config", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "CalDAV 配置失败");
    }

    return response.json();
};

export const getCalDavStatus = async (): Promise<CalDavStatus> => {
    const response = await customFetch("/api/caldav/status", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取 CalDAV 状态失败");
    }

    return response.json();
};

export const syncCalDav = async (options?: {
    direction?: string;
    calendarUrl?: string;
    rangeStart?: string;
    rangeEnd?: string;
    allowConflict?: boolean;
}): Promise<{ message: string; result: CalDavSyncResult }> => {
    const response = await customFetch("/api/caldav/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(options || {}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "CalDAV 同步失败");
    }

    return response.json();
};

export const unbindCalDav = async (): Promise<{ message: string }> => {
    const response = await customFetch("/api/caldav/config", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "CalDAV 解绑失败");
    }

    return response.json();
};

export const getCalDavServerStatus = async (): Promise<CalDavServerStatus> => {
    const response = await customFetch("/api/caldav-server/status", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取 CalDAV 服务器状态失败");
    }

    return response.json();
};

export const enableCalDavServer =
    async (): Promise<CalDavServerEnableResult> => {
        const response = await customFetch("/api/caldav-server/enable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "启用 CalDAV 服务器失败");
        }

        return response.json();
    };

export const disableCalDavServer =
    async (): Promise<CalDavServerEnableResult> => {
        const response = await customFetch("/api/caldav-server/disable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "禁用 CalDAV 服务器失败");
        }

        return response.json();
    };
