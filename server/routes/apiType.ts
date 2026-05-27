// 统一 API 类型定义
// 注意：这些类型仅用于编译期约束，不参与运行时校验

import { Task } from "../index";
import type { RecurrenceRule, ScheduleType } from "../Services/types";

export interface StatusMicrosoftTodoResponse {
    connected: boolean;
    binded: boolean;
    tokenAvailable: boolean;
    lastChecked: string;
}

export interface StatusEbridgeResponse {
    connected: boolean; // ebridge connected (for timetable)
    binded: boolean;
    passwordAvailable: boolean;
    emsClientAvailable: boolean;
    timetableUrl: string | null;
    lastChecked: string;
    // Exchange specific status
    exchangeBinded: boolean;
    exchangeTokenAvailable: boolean;
}

export interface GenericErrorResponse {
    error: string;
    message?: string;
}

export interface TaskCreateRequest {
    name: string;
    description?: string;
    startTime: string; // ISO
    endTime: string; // ISO
    dueDate?: string; // ISO
    location?: string;
    boundaryConflict?: boolean; // 请求级覆盖用户级边界模式
    recurrenceRule?: RecurrenceRule;
    scheduleType?: ScheduleType;
}

export interface TaskCreateResponse {
    task: Task;
}

export interface TaskConflictDetail {
    id: string;
    name?: string;
    startTime?: string | null;
    endTime?: string | null;
}

export interface TaskConflictResponse {
    error: "conflict";
    message: string;
    candidate: TaskConflictDetail;
    conflicts: TaskConflictDetail[];
}

export interface ConflictPreCheckRequest {
    startTime: string; // ISO
    endTime: string; // ISO
    boundaryConflict?: boolean;
}

export interface ConflictPreCheckResponse {
    conflicts: TaskConflictDetail[];
}

export interface BatchTaskItemInput extends TaskCreateRequest {}

export interface BatchTaskCreateRequest {
    tasks: BatchTaskItemInput[];
    boundaryConflict?: boolean; // 批量请求统一覆盖（单项内存在则以单项为准）
}

export interface BatchTaskCreateItemResult {
    input: BatchTaskItemInput;
    status: "created" | "conflict" | "error";
    task?: Task;
    conflictList?: TaskConflictDetail[];
    errorMessage?: string;
}

export interface BatchTaskCreateResponse {
    results: BatchTaskCreateItemResult[];
    summary: {
        total: number;
        created: number;
        conflicts: number;
        errors: number;
    };
}

export interface ConflictModeUpdateRequest {
    boundaryConflictInclusive: boolean; // true: 端点相接算冲突
}

export interface ConflictModeUpdateResponse {
    boundaryConflictInclusive: boolean;
    updatedAt: string;
}

// ── Admin 管理端类型 ────────────────────────────────────────────
// 前端 adminApi.ts 中的 AdminUserRow / AdminFieldMeta 与此处保持一致

export type AdminFieldMeta = { type: string; sensitive: boolean };

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
    ImapBinded: boolean;
    ImapEmail: string | null;
    ImapPassword: string | null;
    ImapHost: string | null;
    ImapPort: number | null;
    ImapTls: boolean;
    CAFSub: string | null;
    CAFAccessToken: string | null;
    CAFRefreshToken: string | null;
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

// 字段元数据：字段名 → {类型, 是否敏感}
export const ADMIN_FIELD_META: Record<string, AdminFieldMeta> = {
    id: { type: "text", sensitive: false },
    email: { type: "text", sensitive: false },
    name: { type: "text", sensitive: false },
    XJTLUaccount: { type: "text", sensitive: false },
    XJTLUPassword: { type: "text", sensitive: true },
    passwordHash: { type: "text", sensitive: true },
    JWTtoken: { type: "text", sensitive: true },
    MStoken: { type: "text", sensitive: true },
    MSRefreshToken: { type: "text", sensitive: true },
    MSbinded: { type: "boolean", sensitive: false },
    ExchangeAccessToken: { type: "text", sensitive: true },
    ExchangeRefreshToken: { type: "text", sensitive: true },
    ExchangeTokenExpiresAt: { type: "number", sensitive: false },
    ExchangeBinded: { type: "boolean", sensitive: false },
    ImapBinded: { type: "boolean", sensitive: false },
    ImapEmail: { type: "text", sensitive: false },
    ImapPassword: { type: "text", sensitive: true },
    ImapHost: { type: "text", sensitive: false },
    ImapPort: { type: "number", sensitive: false },
    ImapTls: { type: "boolean", sensitive: false },
    CAFSub: { type: "text", sensitive: false },
    CAFAccessToken: { type: "text", sensitive: true },
    CAFRefreshToken: { type: "text", sensitive: true },
    CAFTokenExpiresAt: { type: "number", sensitive: false },
    ebridgeBinded: { type: "boolean", sensitive: false },
    timetableUrl: { type: "text", sensitive: false },
    timetableFetchLevel: { type: "number", sensitive: false },
    mailReadingSpan: { type: "number", sensitive: false },
    conflictBoundaryInclusive: { type: "boolean", sensitive: false },
    weekOffset: { type: "number", sensitive: false },
    CalDavBaseUrl: { type: "text", sensitive: false },
    CalDavUsername: { type: "text", sensitive: false },
    CalDavPassword: { type: "text", sensitive: true },
    CalDavPrincipalUrl: { type: "text", sensitive: false },
    CalDavCalendarHome: { type: "text", sensitive: false },
    CalDavCalendarUrl: { type: "text", sensitive: false },
    CalDavEnabled: { type: "boolean", sensitive: false },
    CalDavLastSyncAt: { type: "text", sensitive: false },
    CalDavServerEnabled: { type: "boolean", sensitive: false },
    highEnergyPeriods: { type: "json", sensitive: false },
    createdAt: { type: "text", sensitive: false },
    updatedAt: { type: "text", sensitive: false },
};

// 管理员允许编辑的字段（从 FIELD_META 派生，排除只读字段）
export const ADMIN_EDITABLE_FIELDS = new Set(
    Object.keys(ADMIN_FIELD_META).filter(
        (k) => !["id", "createdAt", "updatedAt", "taskCount"].includes(k),
    ),
);

// ---- 新增：任务更新 / 删除 / 列表 ----

export interface TaskUpdateRequest {
    name?: string;
    description?: string;
    startTime?: string; // ISO
    endTime?: string; // ISO
    dueDate?: string; // ISO
    location?: string;
    completed?: boolean;
    boundaryConflict?: boolean; // 请求级覆盖
    recurrenceRule?: RecurrenceRule | null; // null 表示移除重复规则
    scheduleType?: ScheduleType;
}

// 重复任务生成统计
export interface RecurrenceSummary {
    createdInstances: number;
    conflictInstances: number;
    errorInstances: number;
    requestedRule?: any;
}

export interface TaskUpdateResponse {
    task: Task;
}

export interface TaskDeleteResponse {
    id: string;
    deleted: boolean;
}

export interface TaskListQueryParams {
    start?: string; // ISO (过滤区间开始)
    end?: string; // ISO (过滤区间结束)
    limit?: number;
    offset?: number;
}

export interface TaskListResponse {
    tasks: Task[];
    total: number;
    limit: number;
    offset: number;
}
