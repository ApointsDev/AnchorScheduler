> 父文档：[API 文档](README.md)

---

## 十九、数据结构

### Task / Schedule（日程）

> `Task` 历史命名保留；语义为**日程**（有时段、冲突、重复规则）。别名：`type Schedule = Task`。

```typescript
interface Task {
    id: string;
    userId: string;
    name: string;
    description?: string;
    location?: string;
    startTime: string;        // ISO 8601
    endTime: string;          // ISO 8601
    completed: boolean;
    completedAt?: string;     // 标记完成时的上海 ISO；未完成为空
    importance: "high" | "normal" | "low";  // 粗粒度（兼容）
    /** 四象限 · 重要程度轴 [-1, 1]；正=更重要（向后兼容可选） */
    importanceScore?: number | null;
    /** 四象限 · 紧急程度轴 [-1, 1]；正=更紧急（向后兼容可选） */
    urgencyScore?: number | null;
    quadrant?: "q1" | "q2" | "q3" | "q4"; // 可由双轴推导
    scheduleType?: "fixed" | "flexible"; // 已废弃
    recurrenceRule?: RecurrenceRule;
    parentTaskId?: string;
    source?: "manual" | "timetable" | "email" | "caldav";
    createdAt: string;
    updatedAt: string;
}
```

### UserStatus（用户本周状态）

> 缓存于 `user_status` 表；统计仅含日程 tasks。详见 [user-status.md](user-status.md)。

```typescript
interface UserStatus {
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
```

### CommunityRegion / CommunityRankingResult

> 社区排名按地区（如学校）分区。详见 [community.md](community.md)。

```typescript
interface CommunityRegion {
    id: string;
    name: string;           // e.g. "西交利物浦大学"
    createdAt?: string;
}

// metric: completedThisWeek | incompleteThisWeek | avgCompleteDurationMs | completionHourMode
interface CommunityRankingResult {
    metric: string;
    metricLabel: string;
    titleLabel: string;     // e.g. "时间利用率" → 称号「…时间利用率第一」
    higherIsBetter: boolean;
    region: CommunityRegion;
    weekStart: string;
    weekEnd: string;
    me: {
        rank: number | null;
        value: number | null;
        displayName: string;
        title: string | null;
        eligible: boolean;
    };
    leaderboard: {
        rank: number;
        userId: string;
        displayName: string;
        value: number;
        isMe?: boolean;
    }[];
    totalParticipants: number;
    computedAt: string;
}
```

### Todo（待办）

> 与日程分离的实体；可挂 0..N 个标签；无 start/end 冲突语义。

```typescript
interface Todo {
    id: string;
    name: string;
    description?: string;
    completed: boolean;
    dueDate?: string;         // ISO 8601
    importance?: "high" | "normal" | "low";
    importanceScore?: number | null;  // [-1, 1] 重要程度
    urgencyScore?: number | null;     // [-1, 1] 紧急程度
    tags: Tag[];              // 无标签时为 []
    createdAt?: string;
    updatedAt?: string;
}
```

### RejectionBufferItem（事件拒绝缓冲池）

> 用户拒绝日程/待办队列项后的 24h 快照。详见 [rejection-buffer.md](rejection-buffer.md)。

```typescript
interface RejectionBufferItem {
    id: string;
    userId: string;
    kind: "schedule" | "todo";
    sourceQueueId?: string;
    rawRequest: unknown;
    rejectedAt: string;
    expiresAt: string;
}
```

### UserReport（用户反馈 / 举报）

> 用户提交的反馈或举报，管理员在后台处理。详见 [reports.md](reports.md)。

```typescript
interface UserReport {
    id: string;
    userId: string;
    type: "feedback" | "report";
    category: string | null;
    targetId: string | null;      // 举报对象 ID（反馈为空）
    content: string;
    contact: string | null;
    status: "pending" | "processing" | "resolved" | "rejected";
    createdAt: string;
    updatedAt: string;
}
```

### AppRelease（应用版本发布配置）

> 管理员配置的各平台版本与外部下载源。详见 [app-update.md](app-update.md)。

```typescript
interface AppRelease {
    id: string;
    platform: "android" | "ios" | "web" | "all";
    version: string;
    versionCode: number;
    downloadUrl: string;          // 外部下载源
    releaseNotes: string | null;
    forceUpdate: boolean;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}
```

### Tag（标签）
```typescript
interface Tag {
    id: string;
    name: string;
    color?: string;
    createdAt?: string;
    updatedAt?: string;
}
```

### RecurrenceRule（重复规则）
```typescript
interface RecurrenceRule {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval?: number;           // 间隔，默认 1
    count?: number;              // 总次数
    until?: string;              // 结束日期 ISO
    byDay?: string[];            // ["MO","WE","FR"]
    byMonthDay?: number[];
    byMonth?: number[];
}
```

### Email（邮件）
```typescript
interface Email {
    id: string;
    subject: string;
    from: string;
    to: string[];
    date: string;
    body: string;
    html?: string;
    attachments: Attachment[];
    isRead: boolean;
    isFlagged: boolean;
    aiProcessed: boolean;
}
```

### User（用户）
```typescript
interface User {
    id: string;
    email: string;
    name: string;
    xjtluAccount?: string;
    msToken?: string;
    exchangeToken?: string;
    imapConfig?: ImapConfig;
    caldavConfig?: CalDavConfig;
    calDavServerEnabled: boolean;
    settings: UserSettings;
    createdAt: string;
}
```

### ChatContext（聊天上下文）
```typescript
interface ChatContext {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}
```

---

## 二十、WebSocket

> 连接: `wss://schedule.apoints.cn/ws`  
> 需认证: 连接时传入 `?token=<JWT>`

### 服务端事件

| 事件 | 数据 | 说明 |
|------|------|------|
| `task_created` | `{ task: Task }` | 新任务创建 |
| `task_updated` | `{ task: Task }` | 任务更新 |
| `task_deleted` | `{ taskId: string }` | 任务删除 |
| `email_processed` | `{ emailId, result }` | AI 邮件处理完成 |
| `schedule_queue_update` | `{ count, items }` | 日程队列更新 |

### 客户端事件

| 事件 | 数据 | 说明 |
|------|------|------|
| `subscribe` | `{ channel: string }` | 订阅频道 |
| `unsubscribe` | `{ channel: string }` | 取消订阅 |

---

## 状态码约定

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或 token 过期 |
| 403 | 无权限（如非管理员访问管理接口） |
| 404 | 资源不存在 |
| 409 | 冲突（如日程时间冲突） |
| 500 | 服务器内部错误 |
