> 父文档：[API 文档](README.md)

---

## DA 校园大事件（多校）

为 XJTLU Development Advisor（DA）团队提供的「校园大事件」能力，支持扩展到多所学校。每个学校拥有独立的公开事件页（`/:slug/events`）、DA 管理员、DA 团队邮箱（IMAP + NLP）与学生贡献开关。

### 权限模型

- **公开**：无需 JWT（`/api/da/schools`、`/api/da/:slug/events*`、`/api/da/:slug/page`）。
- **学生**：任意登录用户（`/api/da/optin`）。
- **系统管理员**：`ADMIN_EMAILS` 白名单，管理全部学校（`/api/da/admin/schools*`）。
- **学校 DA 管理员**：`school_admins` 表中按学校授权的邮箱（`/api/da/admin/:slug/*`）；系统管理员恒通过。兼容旧变量 `DA_ADMIN_EMAILS`（单校兜底）。

### 数据模型

- `schools`：学校实体（`slug` 为 URL 前缀，如 `xjtlu`）。
- `school_admins`：学校 DA 管理员（schoolId, email）。
- `da_settings`：每校配置（页面标题/简介/投稿邮箱、DA 邮箱 IMAP、学生贡献开关与白名单/关键词）。
- `da_student_optins`：学生贡献开关（schoolId, userId）。
- 事件本体：复用 `tasks` 表——每所学校一个「DA 系统账号」（如 `da-xjtlu@apoints.cn`），其 `visibility='public'` 且 `category='school_event'` 的任务即公开事件。

---

### 公开（无 JWT）

#### `GET /api/da/schools`
```
Response: { schools: [{ id, slug, name, eventsEmail, themeColor }] }
```
启用中的学校列表（公开落地页用）。

#### `GET /api/da/:slug/events`
```
Query: start?, end?
Response: { school, events: DaEvent[] }
```
某校公开事件列表（仅 `visibility='public'` 且未归档）。`DaEvent = { id, name, description, startTime, endTime, location?, allDay?, category? }`。

#### `GET /api/da/:slug/events/:id`
```
Response: { event: DaEvent }
```
单条公开事件。

#### `GET /api/da/:slug/page`
```
Response: { page: { title, intro, contact, themeColor, eventsEmail, schoolName, slug } }
```
公开页配置。

---

### 学生（JWT，任意用户）

#### `GET /api/da/optin`
```
Response: { optins: [{ schoolId, optedIn }] }
```
我参与贡献的学校与开关状态。

#### `PUT /api/da/optin`
```
Body: { schoolId, optedIn: boolean }
Response: { ok, optedIn }
```
设置某校贡献开关。开启后，用户收到的学院通知邮件经 NLP 提取，命中启发式（发件域∈该校白名单 或 主题含事件关键词）即匿名化转投该校 DA 审批队列。

---

### 系统管理员（JWT + `ADMIN_EMAILS`）

#### `GET /api/da/admin/schools`
```
Response: { schools: [{ id, slug, name, eventsEmail, themeColor, enabled, admins: string[], daAccountEmail, ... }] }
```

#### `POST /api/da/admin/schools`
```
Body: { slug, name, eventsEmail?, themeColor? }
```
新增学校（自动创建该校 DA 系统账号）。

#### `PATCH /api/da/admin/schools/:schoolId`
```
Body: { slug?, name?, eventsEmail?, themeColor?, enabled? }
```

#### `DELETE /api/da/admin/schools/:schoolId`
物理删除学校（级联清理其配置与 DA 账号；建议优先使用 `enabled=false` 停用）。

#### `GET /api/da/admin/schools/:schoolId/admins`
```
Response: { admins: [{ email }] }
```

#### `POST /api/da/admin/schools/:schoolId/admins`
```
Body: { email }
```
添加该校 DA 管理员。

#### `DELETE /api/da/admin/schools/:schoolId/admins/:email`
移除该校 DA 管理员。

#### `GET /api/da/admin/my-schools`
```
Response: { schools: [...] }
```
当前用户可管理的学校（系统管理员=全部；否则=school_admins 中的学校）。

---

### 学校 DA 管理员（JWT + 该校授权）

#### `GET /api/da/admin/:slug/events`
```
Response: { events: Task[] }
```
该校全部事件（含草稿/未公开）。

#### `POST /api/da/admin/:slug/events`
```
Body: { name, description?, startTime?, endTime?, location?, allDay?, category?, recurrenceRule? }
```
新建事件（强制 `visibility='public'`）。

#### `PATCH /api/da/admin/:slug/events/:id`
```
Body: 同 POST（可部分字段）
```
更新事件。

#### `DELETE /api/da/admin/:slug/events/:id`
删除事件。

#### `GET /api/da/admin/:slug/queue`
```
Response: { schedule: QueueItem[], todo: QueueItem[] }
```
该校待审批队列（来自 DA 邮箱 NLP 或学生贡献）。

#### `POST /api/da/admin/:slug/queue/:id/approve`
```
Body: { allowConflict?: boolean }
```
审批入队项（复用 `mcpTools.add_schedule/add_todo` 核心，冲突时返回 409）。

#### `POST /api/da/admin/:slug/queue/:id/reject`
拒绝入队项（写入拒绝缓冲池后移除）。

#### `POST /api/da/admin/:slug/import`
```
Body: { text }
Response: { queuedSchedules, queuedTodos, toolCallsTriggered }
```
手动粘贴学院邮件/文案 → LLM 提取 → 入待审批队列。

#### `GET /api/da/admin/:slug/settings`
```
Response: { settings, page }
```
`settings`：`pageTitle/pageIntro/pageContact/studentContributionEnabled/collegeDomains/eventKeywords/mailEnabled/mailHost/mailPort/mailTls/mailUsername/mailPassword(掩码)`。
`page`：公开页配置。

#### `PUT /api/da/admin/:slug/settings`
```
Body: { settings?, page? }
```
保存设置与页面配置（掩码密码不写回）。

#### `POST /api/da/admin/:slug/mail/refresh`
手动重连并重新拉取该校 DA 邮箱（IMAP）。

#### `GET /api/da/admin/:slug/students`
```
Query: limit?, offset?
Response: { students: [{ userId, name, email, optedIn, updatedAt }], total }
```

#### `PUT /api/da/admin/:slug/students/:userId`
```
Body: { optedIn: boolean }
```
后台代管学生贡献开关。

---

### 邮箱管道

`server/intervals.ts` 每 20 秒遍历启用中的学校，对已配置 `mailEnabled=1` 的学校启动/复用 `ImapClient`（IDLE push）。新邮件 → `processEmailWithLLM(该校 DA 账号, email, 'da-mailbox')` → 入该校 `schedule_queue`，DA 管理员在后台审批后发布到公开页。
