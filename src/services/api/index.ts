// API 服务统一出口（barrel）
// 按 scope 拆分后的各子模块在此统一 re-export，保持对旧 `services/api` 引用的向后兼容。
// 子模块：client / auth / tasks / todos / emails / chat / integrations / caldav / settings / logs / share / speech
// 注意：项目开启 verbatimModuleSyntax，类型与值须分开导出。

// ── 基础 ──────────────────────────────────────────────
export {
    API_BASE_URL,
    authEvents,
    resolveApiUrl,
    customFetch,
    setToken,
    getToken,
    removeToken,
    isAuthenticated,
    setRefreshToken,
    getRefreshToken,
    removeRefreshToken,
} from "./client";

// ── 认证 ──────────────────────────────────────────────
export {
    register,
    login,
    startCafAuth,
    startMicrosoftAuth,
    startExchangeAuth,
    unbindExchange,
} from "./auth";
export type {
    RegisterData,
    LoginData,
    UnbindExchangeResponse,
} from "./auth";

// ── 日程任务与队列 ────────────────────────────────────
export {
    ScheduleConflictError,
    createTask,
    updateTask,
    createTasksBatch,
    getTasks,
    deleteTask,
    approveQueueItem,
    rejectQueueItem,
    getScheduleQueue,
} from "./tasks";
export type {
    ScheduleType,
    Task,
    TasksResponse,
    ConflictWarning,
    CreateTaskResponse,
    BatchTaskResult,
    BatchTasksResponse,
    ScheduleQueueItem,
} from "./tasks";

// ── 待办队列 ──────────────────────────────────────────
export {
    getTodoQueue,
    approveTodoQueueItem,
    rejectTodoQueueItem,
} from "./todos";
export type { TodoQueueItem } from "./todos";

// ── 邮件 ──────────────────────────────────────────────
export {
    getEmailList,
    getRawEmail,
    markEmailAsRead,
    triggerAiProcess,
} from "./emails";
export type { EmailListItem, RawEmail } from "./emails";

// ── AI 聊天 ───────────────────────────────────────────
export {
    loadChatHistory,
    saveChatHistory,
    getChatContexts,
    createChatContext,
    loadChatContext,
    deleteChatContext,
    undoLastChatTurn,
} from "./chat";
export type { ChatContextInfo } from "./chat";

// ── 第三方集成 ────────────────────────────────────────
export {
    bindSmtp,
    unbindSmtp,
    saveEbridgeTimetableUrl,
    importEbridgeTimetableHash,
    getMicrosoftTodoStatus,
    getEbridgeStatus,
    syncTimetable,
    deleteTimetableTasks,
    startExchangeForward,
    checkExchangeForward,
    cancelExchangeForward,
} from "./integrations";
export type {
    SmtpConfig,
    MicrosoftTodoStatus,
    EbridgeStatus,
    ExchangeForwardStartResult,
    SyncTimetableResponse,
    DeleteTimetableResponse,
} from "./integrations";

// ── CalDAV ────────────────────────────────────────────
export {
    configureCalDav,
    getCalDavStatus,
    syncCalDav,
    unbindCalDav,
    getCalDavServerStatus,
    enableCalDavServer,
    disableCalDavServer,
} from "./caldav";
export type {
    CalDavStatus,
    CalDavSyncResult,
    CalDavServerStatus,
    CalDavServerEnableResult,
} from "./caldav";

// ── 用户设置 ──────────────────────────────────────────
export {
    getOnboardingStatus,
    setOnboardingCompleted,
    setAutoSchedulePromotions,
    setStripReplyPrefix,
    getUserSettings,
    getWeekInfo,
    setUserWeek,
} from "./settings";
export type { WeekInfoResponse } from "./settings";

// ── 日志 ──────────────────────────────────────────────
export { getLogs } from "./logs";
export type { LogEntry, LogsResponse } from "./logs";

// ── 日程分享 ──────────────────────────────────────────
export {
    createShare,
    getShareList,
    deleteShare,
    getSharedView,
} from "./share";
export type { ShareLink, SharedScheduleView } from "./share";

// ── 语音识别 ──────────────────────────────────────────
export { getSpeechStatus, recognizeSpeech } from "./speech";
export type { SpeechRecognizeResult, SpeechStatus } from "./speech";

// ── 文件上传（日程附件存档）────────────────────────────
export { uploadAttachment, listUploads, deleteUpload } from "./uploads";
export type { UploadedFile, UploadListResponse } from "./uploads";

// ── 会员与兑换码（MENU-001）────────────────────────────
export {
    getMembership,
    getMembershipPlans,
    purchaseMembership,
    restoreMembershipPurchase,
    getMembershipOrders,
    validateRedeemCode,
    redeemCode,
} from "./membership";
export type {
    MembershipView,
    MembershipSummary,
    MembershipTier,
    MembershipOrder,
    MembershipGrant,
    RedeemResult,
    PlansResponse,
} from "./membership";

// ── 用户反馈 / 举报（RPT-001）──────────────────────────
export { submitReport, getMyReports } from "./reports";
export type {
    ReportType,
    ReportStatus,
    UserReport,
    SubmitReportInput,
    MyReportsResponse,
} from "./reports";

// ── 应用版本更新检查（UPD-001）─────────────────────────
export { checkAppUpdate } from "./appUpdate";
export type {
    AppPlatform,
    AppReleaseInfo,
    AppUpdateCheckResult,
} from "./appUpdate";

// ── DA 校园大事件（多校）───────────────────────────────
export {
    getDaSchools,
    getDaEvents,
    getDaEvent,
    getDaPage,
    getDaAdminMySchools,
    getDaAdminSchools,
    createDaSchool,
    updateDaSchool,
    deleteDaSchool,
    addDaSchoolAdmin,
    removeDaSchoolAdmin,
    getDaAdminEvents,
    createDaEvent,
    updateDaEvent,
    deleteDaEvent,
    getDaQueue,
    approveDaQueueItem,
    rejectDaQueueItem,
    importDaText,
    getDaSettings,
    updateDaSettings,
    refreshDaMail,
    getDaStudents,
    setDaAdminStudentOptin,
    getDaOptin,
    setDaOptin,
} from "./da";
export type {
    School,
    DaEvent,
    DaPageConfig,
    DaAdminSchool,
    DaQueueItem,
    DaQueueResponse,
    DaSettings,
    DaStudentRow,
} from "./da";
