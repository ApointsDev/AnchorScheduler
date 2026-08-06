// API 服务文件，处理与后端的所有通信

import type { ChatMessage } from "./llmService";

// 开发模式下指向后端服务器 (默认 3000 端口)
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

// 引导页状态（持久化到数据库）
export const getOnboardingStatus = async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;
    const response = await customFetch(
        `${API_BASE_URL}/api/settings/onboarding`,
        { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.onboardingCompleted === true;
};

export const setOnboardingCompleted = async (
    completed: boolean,
): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    await customFetch(`${API_BASE_URL}/api/settings/onboarding`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
    });
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
    quadrant?: "q1" | "q2" | "q3" | "q4";
    /** 四象限 · 重要程度轴 [-1, 1] */
    importanceScore?: number | null;
    /** 四象限 · 紧急程度轴 [-1, 1] */
    urgencyScore?: number | null;
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
): Promise<{ task: Task; axes: { importanceScore: number | null; urgencyScore: number | null; quadrant: string }; conflictWarning?: ConflictWarning }> => {
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
        if (response.status === 409 && error.conflicts) {
            throw new ScheduleConflictError(
                error.error || "日程冲突",
                error.conflicts,
            );
        }
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

/** 待办审批队列项（与 ScheduleQueueItem 同形） */
export interface TodoQueueItem {
    id: string;
    userId: string;
    rawRequest: string;
    status: string;
    createdAt: string;
}

export const getTodoQueue = async (): Promise<{
    queue: TodoQueueItem[];
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(`/api/todo-queue`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取待办队列失败");
    }

    return response.json();
};

export const approveTodoQueueItem = async (queueId: string): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/todo-queue/${encodeURIComponent(queueId)}/approve`,
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
        throw new Error(error.error || "批准待办请求失败");
    }

    return response.json();
};

export const rejectTodoQueueItem = async (queueId: string): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/todo-queue/${encodeURIComponent(queueId)}/reject`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "拒绝待办请求失败");
    }

    return response.json();
};

// ── AI 聊天记录持久化 ──────────────────────────────────────────────

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

// ── 推广邮件日程设置 ──────────────────────────────────────────────

export const setAutoSchedulePromotions = async (
    enabled: boolean,
): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    await customFetch("/api/settings/auto-schedule-promotions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
    });
};

export const setStripReplyPrefix = async (enabled: boolean): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    await customFetch("/api/settings/strip-reply-prefix", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
    });
};

export const getUserSettings = async (): Promise<{
    autoSchedulePromotions: boolean;
    stripReplyPrefix: boolean;
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("获取用户设置失败");
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

// ── 日程分享 ──────────────────────────────────────────

export interface ShareLink {
    id: string;
    token: string;
    name: string;
    dateStart: string | null;
    dateEnd: string | null;
    taskIds: string[] | null;
    expiresAt: string | null;
    createdAt: string;
    shareUrl: string;
}

export interface SharedScheduleView {
    share: { name: string; createdAt: string };
    tasks: Task[];
    user: { name: string };
}

export const createShare = async (data: {
    name?: string;
    dateStart?: string;
    dateEnd?: string;
    taskIds?: string[];
    expiresInDays?: number;
}): Promise<{ token: string; shareUrl: string; expiresAt: string | null }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/share/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "创建分享失败");
    }
    return response.json();
};

export const getShareList = async (): Promise<{ shares: ShareLink[] }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/share/list", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("获取分享列表失败");
    return response.json();
};

export const deleteShare = async (shareToken: string): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/share/${encodeURIComponent(shareToken)}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    if (!response.ok) throw new Error("删除分享失败");
};

export const getSharedView = async (
    shareToken: string,
): Promise<SharedScheduleView> => {
    const response = await customFetch(
        `/api/share/view/${encodeURIComponent(shareToken)}`,
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "加载分享失败");
    }
    return response.json();
};

// ── 语音识别（讯飞大模型多语种） ──────────────────────────

export interface SpeechRecognizeResult {
    success: boolean;
    text: string;
    sid?: string;
    segments?: Array<{ word: string; language?: string }>;
    encoding?: string;
    sampleRate?: number;
}

export interface SpeechStatus {
    configured: boolean;
    provider: string;
    host: string;
    supportedFormats: string[];
    maxDurationSec: number;
    sampleRates: number[];
}

/** 查询语音识别服务状态 */
export const getSpeechStatus = async (): Promise<SpeechStatus> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/speech/status", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "获取语音识别状态失败");
    }
    return response.json();
};

/**
 * 上传音频进行语音识别
 * @param audio Blob 或 File（建议 16k/16bit/mono WAV 或 MP3，≤60s）
 * @param options.language 可选语种，如 zh / en / zh|en
 */
export const recognizeSpeech = async (
    audio: Blob | File,
    options?: {
        language?: string;
        sampleRate?: 8000 | 16000;
        encoding?: "raw" | "lame";
        filename?: string;
    },
): Promise<SpeechRecognizeResult> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const form = new FormData();
    const filename =
        options?.filename ||
        (audio instanceof File ? audio.name : "recording.wav");
    form.append("file", audio, filename);
    if (options?.language) form.append("language", options.language);
    if (options?.sampleRate)
        form.append("sampleRate", String(options.sampleRate));
    if (options?.encoding) form.append("encoding", options.encoding);

    const response = await customFetch("/api/speech/recognize", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "语音识别失败");
    }
    return response.json();
};
