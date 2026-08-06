// 管理员管理端类型
// 注意：这些类型仅用于编译期约束，不参与运行时校验
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
