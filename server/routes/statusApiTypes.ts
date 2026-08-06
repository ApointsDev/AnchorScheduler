// 状态查询与通用响应类型
// 注意：这些类型仅用于编译期约束，不参与运行时校验

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

// ── 用户状态 API 类型 ──────────────────────────────────────────

export interface UserStatusResponse {
    status: {
        weekStart: string;
        weekEnd: string;
        completedThisWeek: number;
        incompleteThisWeek: number;
        avgCompleteDurationMs: number | null;
        avgCompleteDurationHuman?: string | null;
        completionHourMode: number | null;
        modalHours: number[];
        completedSampleSize: number;
        computedAt: string;
        fromCache?: boolean;
    };
}
