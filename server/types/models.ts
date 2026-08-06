// 全局数据模型类型定义
// Task, Profile, User 等被整个项目广泛引用的核心类型

import type { ExchangeClient } from "../Services/exchangeClient";
import type { ImapClient } from "../Services/imapClient";
import type { ScheduleType } from "../Services/types";

/**
 * Task = 日程（schedule event）：有 startTime/endTime、冲突检测、重复规则等。
 * 历史命名保留 Task；语义上等同 Schedule。
 */
export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  completed: boolean;
  pushedToMSTodo: boolean;
  body?: string;
  attendees?: string[];
  recurrenceRule?: string;
  parentTaskId?: string;
  importance?: "high" | "normal" | "low";
  /** 事件业务类型；tasks 表默认承载日程，保留 todo 供历史数据迁移。 */
  eventType?: "schedule" | "todo";
  category?: string;
  allDay?: boolean;
  isReminderOn?: boolean;
  /** 相对开始时间的提前分钟数；null 表示不提醒。 */
  reminderMinutesBefore?: number | null;
  /** 根据 startTime 与 reminderMinutesBefore 派生的只读时间。 */
  reminderAt?: string | null;
  attachments?: string[];
  /** 待办预计需要的执行时间（分钟）。 */
  allocatedMinutes?: number | null;
  scheduleType?: ScheduleType;
  estimatedDuration?: number;
  isFixed?: boolean;
  quadrant?: "q1" | "q2" | "q3" | "q4";
  /**
   * 四象限 · 重要程度轴，范围 [-1, 1]；未设置时为 undefined（向后兼容）
   * 正数更重要，负数更不重要
   */
  importanceScore?: number | null;
  /**
   * 四象限 · 紧急程度轴，范围 [-1, 1]；未设置时为 undefined（向后兼容）
   * 正数更紧急，负数更不紧急
   */
  urgencyScore?: number | null;
  /** 标记完成时的时间（上海 ISO）；未完成或取消完成时为空 */
  completedAt?: string;
  /** 归档时间（上海 ISO）；未归档时为 undefined */
  archivedAt?: string;
  /** 最近活动时间（自动归档依据，上海 ISO） */
  lastActivityAt?: string;
  createdAt?: string;
  updatedAt?: string;
  /**
   * 日程可见性：
   * - "private"   → 仅自己可见（默认）
   * - "authorized" → 仅 authorizedUserIds 中的用户可见
   * - "blocked"   → 除 blockedUserIds 外的所有用户可见
   * - "public"    → 公开可见
   */
  visibility?: "private" | "authorized" | "blocked" | "public";
  /** visibility="authorized" 时允许查看的用户 ID 列表 */
  authorizedUserIds?: string[];
  /** visibility="blocked" 时禁止查看的用户 ID 列表 */
  blockedUserIds?: string[];
}

/**
 * 用户本周日程状态统计（缓存于 user_status 表）
 */
export interface UserStatus {
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
}

/** 日程语义别名（与 Task 同一类型，便于文档与新代码表达） */
export type Schedule = Task;

/** 用户级标签（同一用户下 name 唯一） */
export interface Tag {
  id: string;
  name: string;
  color?: string;
  /** 归档时间（上海 ISO）；未归档时为 undefined */
  archivedAt?: string;
  /** 最近活动时间（自动归档依据，上海 ISO） */
  lastActivityAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Todo = 待办：无时段冲突语义，可挂 0..N 个标签。
 * 与 Task 共用 name/description/completed/importance/dueDate 字段名。
 */
export interface Todo {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  importance?: "high" | "normal" | "low";
  /**
   * 四象限 · 重要程度轴 [-1, 1]；未设置时为 undefined（向后兼容）
   */
  importanceScore?: number | null;
  /**
   * 四象限 · 紧急程度轴 [-1, 1]；未设置时为 undefined（向后兼容）
   */
  urgencyScore?: number | null;
  tags: Tag[];
  /** 标记完成时的时间（上海 ISO）；未完成或取消完成时为空 */
  completedAt?: string;
  /** 归档时间（上海 ISO）；未归档时为 undefined */
  archivedAt?: string;
  /** 最近活动时间（自动归档依据，上海 ISO） */
  lastActivityAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** 拒绝缓冲池条目类型 */
export type RejectionKind = "schedule" | "todo";

/**
 * 用户 24 小时内拒绝过的日程/待办（事件拒绝缓冲池）。
 * 超过 24 小时后从数据库删除。
 */
export interface RejectionBufferItem {
  id: string;
  userId: string;
  kind: RejectionKind;
  sourceQueueId?: string;
  rawRequest: unknown;
  rejectedAt: string;
  expiresAt: string;
}

export interface Profile {
  company: string;
  school: string;
  campus: string;
  schoolYear: string;
}

export interface User {
  timetableUrl: string;
  timetableFetchLevel: number;
  mailReadingSpan: number;
  id: string;
  email: string;
  name: string;
  XJTLUaccount?: string;
  XJTLUPassword?: string;
  passwordHash?: string;
  JWTtoken?: string;
  MStoken?: string;
  MSRefreshToken?: string;
  MSbinded: boolean;
  ebridgeBinded: boolean;
  weekOffset?: number;
  tasks: Task[];
  emsClient?: ExchangeClient;
  conflictBoundaryInclusive?: boolean;
  isConflictScheduleAllowed?: boolean;
  userProfile?: Profile;
  highEnergyPeriods?: Record<
    number,
    { startHour: number; endHour: number; score: number }[]
  >;
  ExchangeAccessToken?: string;
  ExchangeRefreshToken?: string;
  ExchangeTokenExpiresAt?: number;
  ExchangeBinded?: boolean;
  ImapBinded?: boolean;
  ImapEmail?: string;
  ImapPassword?: string;
  ImapHost?: string;
  ImapPort?: number;
  ImapTls?: boolean;
  imapClient?: ImapClient;
  CAFSub?: string;
  CAFAccessToken?: string;
  CAFRefreshToken?: string;
  CAFTokenExpiresAt?: number;
  CalDavBaseUrl?: string;
  CalDavUsername?: string;
  CalDavPassword?: string;
  CalDavPrincipalUrl?: string;
  CalDavCalendarHome?: string;
  CalDavCalendarUrl?: string;
  CalDavSyncToken?: string;
  CalDavEnabled?: boolean;
  CalDavServerEnabled?: boolean;
  CalDavLastSyncAt?: string;
  /** CalDAV 客户端兼容模式 */
  CalDavClientProfile?:
    | "auto"
    | "apple"
    | "thunderbird"
    | "davx5"
    | "outlook"
    | "generic";
  /** 是否自动为推广/营销类邮件创建日程，默认 false */
  autoSchedulePromotions?: boolean;
  /** 是否去除邮件主题中的转发/回复前缀（如 "转发:", "Fwd:"），默认 true */
  stripReplyPrefix?: boolean;
  /** 引导页是否已完成（持久化到数据库，替代 localStorage） */
  onboardingCompleted?: boolean;
  /** 所属社区地区（如学校），用于社区排名 */
  communityRegionId?: string;
  /**
   * 头像：可为本地路径（/uploads/avatars/...）或外链 URL
   */
  avatar?: string | null;
  /**
   * 个人签名 / 简介（纯文本）
   */
  signature?: string | null;

  // ── 学习通 / Chaoxing 绑定与同步 ──
  ChaoxingBinded?: boolean;
  ChaoxingUsername?: string;
  ChaoxingPassword?: string;
  /** 爬虫侧 account_id，固定 sch_{userId} */
  ChaoxingAccountId?: string;
  /** 刷新间隔（小时），默认 24，范围 1–168 */
  ChaoxingIntervalHours?: number;
  /** 偏好刷新小时（上海 0–23），默认 8 */
  ChaoxingPreferredHour?: number;
  /** 是否启用自动刷新，默认 true */
  ChaoxingEnabled?: boolean;
  ChaoxingLastSyncAt?: string;
  ChaoxingNextSyncAt?: string;
  ChaoxingLastJobId?: string;
  /** idle | syncing | succeeded | failed */
  ChaoxingLastStatus?: string;
  ChaoxingLastError?: string;
}

/** 社区地区（排名分区，如「西交利物浦大学」） */
export interface CommunityRegion {
  id: string;
  name: string;
  createdAt?: string;
}

/**
 * 可排名的用户状态指标（与 UserStatus 四个核心字段一一对应）
 */
export type CommunityRankMetric =
  | "completedThisWeek"
  | "incompleteThisWeek"
  | "avgCompleteDurationMs"
  | "completionHourMode";

/** 排行榜中的单行 */
export interface CommunityRankEntry {
  rank: number;
  userId: string;
  displayName: string;
  value: number;
  isMe?: boolean;
}

/** 某指标在某地区的排名结果（用户视角） */
export interface CommunityRankingResult {
  metric: CommunityRankMetric;
  metricLabel: string;
  /** 文案标签，如「时间利用率」→ 用于「西交利物浦大学时间利用率第一」 */
  titleLabel: string;
  higherIsBetter: boolean;
  region: CommunityRegion;
  weekStart: string;
  weekEnd: string;
  me: {
    rank: number | null;
    value: number | null;
    displayName: string;
    /** 如「西交利物浦大学时间利用率第一」 */
    title: string | null;
    eligible: boolean;
  };
  leaderboard: CommunityRankEntry[];
  totalParticipants: number;
  computedAt: string;
  fromCache?: boolean;
}

/** 用户主页上单条社区称号摘要 */
export interface CommunityTitleSummary {
  metric: CommunityRankMetric;
  metricLabel: string;
  titleLabel: string;
  higherIsBetter: boolean;
  rank: number | null;
  value: number | null;
  /** 如「西交利物浦大学时间利用率第一」；无排名则为 null */
  title: string | null;
  eligible: boolean;
  totalParticipants: number;
}

/**
 * 可公开访问的用户个人主页（不含邮箱、凭证、日程明细等隐私字段）
 */
export interface UserHomepage {
  id: string;
  name: string;
  avatar: string | null;
  signature: string | null;
  /** 当前请求方是否即本人 */
  isMe: boolean;
  /** 当前请求方是否已关注该用户 */
  isFollowing: boolean;
  /** 关注数 */
  followingCount: number;
  /** 粉丝数 */
  followerCount: number;
  region: CommunityRegion | null;
  /** 本周 user-status 四项指标 */
  status: UserStatus | null;
  /** 本社区四指标排名称号 */
  titles: CommunityTitleSummary[];
}
