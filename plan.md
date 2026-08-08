# School Events 校园大事件（多校版）实施计划

> 目标：与 XJTLU Development Advisor（DA）团队合作，提供一套**免登录公开日程页 + DA 管理员编辑后台 + DA 团队邮箱 NLP 管道 + 学生邮箱贡献**的低耦合功能，并**从设计上支持扩展到多所学校**（路由如 `/xjtlu/events`），系统管理员可在后台添加更多学校。最大化复用现有商业项目代码。
> 状态：待评审（Plan）

---

## 1. 需求 → 方案映射

| # | 需求 | 交付物 | 关键复用点 |
|---|------|--------|-----------|
| 1 | 免登录、DA 可编辑的日程页面（含多种视图） | 公开路由 `/:slug/events` + 公开 API | `TaskStore`、`sharedRoutes` 的脱敏公开读取模式、`ShareView` 的月/周视图与 `ViewToggle`、`ScheduleCard`、`Schedule.css` 设计令牌 |
| 2 | DA 管理员的编辑页面（按学校） | 路由 `/admin/da/:slug` + DA 管理 API | `schedule_queue` 审批流（`mcpTools.add_schedule/add_todo`）、`InlineScheduleApproval`、`QueueTaskModal` 编辑表单、`AdminPanel` 的 tab 结构 |
| 3 | DA 团队专用邮箱，各学院发大事件到此，NLP 处理 | 每校 DA 邮箱轮询 + 入队 | `ImapClient`（IDLE push）、`emailProcessor.processEmailWithLLM`（LLM 解析→入 `schedule_queue`） |
| 4 | 绑定学生邮箱，学生收到的通知可被 NLP | 学生贡献开关（按校）+ 匿名化转投 DA 队列 | 学生既有的 IMAP/Exchange 邮件绑定管道 + `processEmailWithLLM` 的 `onProcessed` 钩子 |
| 5 | **多校扩展**：系统管理员后台添加学校 | `schools` 表 + 学校管理 API/页面 | 复用 `AdminPanel` 的表格/表单模式与 `ADMIN_EMAILS` 超级管理员守卫 |

---

## 2. 总体架构（核心决策）

### 2.1 多校（Multi-school）模型

**顶层引入 `schools` 实体**（如 `xjtlu`、后续可加其他大学），所有 DA 能力均以 `schoolId` 为边界隔离：

- `schools` 表：`id / slug（唯一，即 URL 前缀）/ name / enabled / eventsEmail（对外公布的联系邮箱）/ 页面主题色`。
- **每所学校一个 DA 系统账号**（见 §2.2），事件数据天然按学校隔离在 `tasks` 里。
- **公开路由按 slug**：`/xjtlu/events`（对应 `GET /api/da/xjtlu/events`）。
- **系统管理员（`ADMIN_EMAILS`）** 可在后台 `管理学校`（新增/编辑/停用/启用）；**DA 管理员**按学校授权（`school_admins`）。

### 2.2 核心模型：DA 系统账号（按学校，Service Account）

**每所学校在 `users` 表创建一个专用的 DA 系统账号**（如 `da-xjtlu@apoints.cn`，由 `daService.ensureDaAccount(school)` 懒创建）。**该账号的 `tasks` 行即该学校的「校园大事件」**。

理由（最大化复用、最小耦合）：
- `tasks` 表 + `TaskStore` 已具备：CRUD、上海时区规范化、`recurrenceRule` 重复、冲突检测、优先级双轴、`scheduleType`、`allDay`、`location`、`attendees`、`visibility`（含 `public`）、归档。
- `schedule_queue`/`todo_queue` + 审批流程已具备「NLP 邮件 → 审批 → 落库」的完整管道，直接套用到各校 DA 账号。
- `processEmailWithLLM(user, email, source)` 只依赖一个 `User` 对象，传入某校 DA 账号即可处理该校 DA 邮箱邮件。
- 公开读取与 `shareRoutes` `/share/view/:token` 同构（读取某账号 tasks 并脱敏），无需新表。
- 多校扩展成本极低：**新增学校 = 新增一行 `schools` + 懒创建一个 DA 账号**，其余全部按 `schoolId` 参数化复用。

约束（防止把 DA 账号当成普通用户）：
- DA 账号**不设密码 / 不绑定 CAF / 不参与登录**（`daService` 懒创建时仅填 `id/email/name`，`onboardingCompleted=1`）。
- 所有对该账号的写操作**只允许**通过 `daRoutes` 的（系统/学校）管理员端点进行，杜绝走个人 taskRoutes。

### 2.3 新增模块（低耦合边界）

新增 4 个后端模块 + 1 个前端模块组，**不改动既有模块内部行为**：

```
server/Services/daService.ts          # DA 业务封装（唯一业务入口，全部按 schoolId 参数化）
server/Services/db/schools.ts         # SchoolStore：schools / school_admins 持久化
server/Services/db/da.ts              # DaStore：da_settings / da_student_optins（均带 schoolId）
server/routes/daRoutes.ts             # /api/da/* 路由（公开 + 系统/学校管理员）
server/__tests__/daService.test.ts    # 单元测试
```

对既有代码的修改（**向后兼容、默认无副作用**）：
- `server/Services/db/migrations.ts`：新增 4 张表（见 §3）。
- `server/Services/db/index.ts`：挂载 `SchoolStore`/`DaStore` 及代理方法（沿用现有子模块组合模式）。
- `server/index.ts`：挂载 `initializeDaRoutes(app/deps)`（在静态 catch-all 之前）。
- `server/intervals.ts`：新增「遍历所有启用学校」的 DA 邮箱轮询（复用 `ImapClient` + `processEmailWithLLM`）。
- `server/Services/emailProcessor.ts`：给 `processEmailWithLLM` 增加**可选** `opts.onProcessed` 钩子（默认 no-op，对 IMAP/手动/MCP 现有调用零影响），供学生贡献订阅。
- `server/.env.template`：新增 DA 相关环境变量说明。

### 2.4 权限模型（三级）

- **系统管理员**：现有 `ADMIN_EMAILS`（`/api/admin/*`）→ 可管理全部学校（新增/停用学校），并拥有所有学校的 DA 全权限。
- **DA 管理员（按校）**：`school_admins(schoolId, email)` 表；`isSchoolAdmin(email, school)` 判断。兼容旧环境变量：`DA_ADMIN_EMAILS` 为空时不启用回退（多校下权限必须显式配置）；若仅有单校且未配置 `school_admins`，可用 `DA_ADMIN_EMAILS` 兜底（默认落到 XJTLU）。
- **公开访问**：`GET /api/da/schools`、`/api/da/:slug/events*`、`/api/da/:slug/page` **无需 JWT**（与 `/api/share/view/:token` 一致）。
- **学生**：任意登录用户可 `GET/PUT /api/da/optin`（按 `schoolId` 归属）。

---

## 3. 数据模型

### 3.1 新表（`migrations.ts` 增量新增）

```sql
-- 学校（多校扩展的核心实体）
CREATE TABLE IF NOT EXISTS schools (
    id          TEXT PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL,        -- URL 前缀，如 xjtlu
    name        TEXT NOT NULL,               -- 显示名，如 西交利物浦大学
    eventsEmail TEXT,                        -- 对外公布的大事件投稿邮箱
    themeColor  TEXT,                        -- 公开页主题色（可选）
    enabled     INTEGER NOT NULL DEFAULT 1,  -- 停用后公开页/轮询下线
    createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 学校 DA 管理员（多对多）
CREATE TABLE IF NOT EXISTS school_admins (
    schoolId  TEXT NOT NULL,
    email     TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (schoolId, email),
    FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE
);

-- 每校 DA 页面/邮箱配置（key-value，宽松模式）
CREATE TABLE IF NOT EXISTS da_settings (
    schoolId  TEXT NOT NULL,
    key       TEXT NOT NULL,
    value     TEXT NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (schoolId, key),
    FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE
);

-- 学生贡献开关（按学校，需求 4）
CREATE TABLE IF NOT EXISTS da_student_optins (
    schoolId  TEXT NOT NULL,
    userId    TEXT NOT NULL,
    optedIn   INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (schoolId, userId),
    FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (userId)   REFERENCES users(id)   ON DELETE CASCADE
);
```

预置数据：插入默认学校 `xjtlu`（西交利物浦大学），保证开箱即用；后续学校由系统管理员在后台添加。

说明：
- **不新建事件表**——事件就是各校 DA 账号的 `tasks`（`visibility='public'`），避免与现有任务体系双轨并行。
- DA 事件用 `tasks.category`（如 `"school_event"`）与 `visibility='public'` 标记；不引入新列，保持 `tasks` 表零改动。
- **每校 DA 系统账号**（§2.2）与**对外 DA 投稿邮箱**（`school.eventsEmail` / `da_settings` 中的 IMAP 配置）是两回事，后者是真正接收学院邮件的真实邮箱。

### 3.2 各校 DA 系统账号

懒创建（`daService.ensureDaAccount(school)`）：按 `da-<slug>@<domain>` 查 `dbService.getUserByEmail`，不存在则 `dbService.addUser({ id: uuid, email, name: school.name + " 校园大事件", onboardingCompleted: true })`。`<domain>` 取 `DA_ACCOUNT_DOMAIN`（默认 `apoints.cn`）。

---

## 4. 后端实现

### 4.1 `server/Services/db/schools.ts` — SchoolStore

复用 `DatabaseService` 子模块模式（参照 `sharedSchedule.ts`）：
- `list({ includeDisabled })` / `getById(id)` / `getBySlug(slug)` / `create(input)` / `update(id, patch)` / `setEnabled(id, enabled)`
- `listAdmins(schoolId)` / `addAdmin(schoolId, email)` / `removeAdmin(schoolId, email)` / `isAdmin(schoolId, email)`

### 4.2 `server/Services/db/da.ts` — DaStore（均带 schoolId）

- `getSetting(schoolId, key)` / `setSetting(schoolId, key, value)` / `getAllSettings(schoolId)`
- `getOptin(schoolId, userId)` / `setOptin(schoolId, userId, optedIn)` / `listOptins(schoolId)` / `listSchoolsByOptinUser(userId)`
- 提供每校 `da_settings` 默认值（页面标题、简介、联系方式、是否开启学生贡献、邮箱 host/port/tls/username/password/mask）。

### 4.3 `server/Services/daService.ts` — 业务封装（单一业务入口，按 schoolId 参数化）

主要能力（全部薄封装、内部复用 `dbService` / `mcpTools` / `ImapClient` / `emailProcessor`）：

1. `listSchools()` / `getSchool(slug|id)` / `createSchool(input)` / `updateSchool(id, patch)` / `setSchoolEnabled(id, enabled)`（含 `ensureDaAccount` 联动）。
2. `ensureDaAccount(school)` → 该校 DA 系统账号（进程内缓存 Map<schoolId, User>）。
3. 权限：`isSystemAdmin(email)`、`isSchoolAdmin(email, schoolId)`（school_admins 表，系统管理员恒通过）、`isDaAdminForSchool(email, schoolId)`。
4. 公开查询：`listPublicEvents(school, {start,end})`、`getPublicEvent(school, id)` → 读取该校 DA 账号 tasks，仅返回 `visibility='public'`（复用 `dbService.getTasksByUserId` + 内存过滤，与 `shareRoutes` 脱敏字段一致：id/name/description/startTime/endTime/location/allDay/category）。
5. 管理 CRUD：`createEvent(school, input)` / `updateEvent(school, id, patch)` / `deleteEvent(school, id)` → 以该校 DA 账号 userId 调用 `dbService.addTask / patchTask / deleteTask`，**强制 `visibility='public'`、`category='school_event'`**。
6. 队列审批：`approveQueueItem(school, id, opts)` / `rejectQueueItem(school, id)` → 复用 `mcpTools.add_schedule/add_todo.execute(..., daUser)`（`_internal_approve: true`）与 `dbService.updateScheduleQueueStatus`；并同步处理 `todo_queue`。
7. 邮箱管道：`syncDaMailbox(school)` → 用该校 `da_settings` 的邮箱配置构造 `ImapClient`，`startIdle(cb)`，新邮件走 `processEmailWithLLM(daUser, email, 'da-mailbox')`（含 `ai_processed_emails` 去重）；首次拉取 `mailReadingSpan` 封历史邮件。**与 `intervals.ts` 现有 per-user IMAP 逻辑完全同构**；按学校缓存 ImapClient，重复调用幂等。
8. 学生贡献：`ingestStudentCandidate(studentUser, email, result)` → 查 `da_student_optins` 中学生所在学校的 optin；为真时对结果做**轻量启发式**（发件域∈学院/组织白名单 或 主题含「event/讲座/宣讲/招聘/比赛/活动」等关键词，白名单存该校 `da_settings`）→ 命中则把解析出的日程**匿名化**后 `dbService.addScheduleToQueue(该校 daUser.id, raw)`，备注来源（不泄露学生邮箱）。
9. 手动导入：`importText(school, rawText)` → 构造合成 `EmailForProcessing` 调 `processEmailWithLLM`，供 DA 手动粘贴学院邮件/文字。
10. 页面配置读写：`getPageConfig(school)` / `updatePageConfig(school, patch)`。

### 4.4 `server/routes/daRoutes.ts` — `/api/da/*`

> 挂载：`app.use("/api/da", initializeDaRoutes(...))`，参照现有 `initializeArchiveRoutes` 模式。公开端点无 auth；管理端点用「系统管理员 or 该校 DA 管理员」守卫。**路由注册顺序敏感**：`/api/da/admin/schools` 等静态段必须注册在 `/api/da/:slug/*` 之前（避免 `:slug` 吞掉 `admin`）。

**公开（无 JWT）**
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/da/schools` | 启用中的学校列表（供公开落地页/切换） |
| GET | `/api/da/:slug/events?start=&end=` | 某校公开事件列表（仅 `visibility='public'`） |
| GET | `/api/da/:slug/events/:id` | 单条公开事件 |
| GET | `/api/da/:slug/page` | 某校公开页配置（标题/简介/联系方式/主题色） |

**系统管理员（JWT + isSystemAdmin）—— 学校管理**
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/da/admin/schools` | 新增学校（自动 `ensureDaAccount`） |
| GET | `/api/da/admin/schools` | 全部学校（含停用、DA 管理员列表） |
| PATCH/DELETE | `/api/da/admin/schools/:schoolId` | 编辑 / 删除学校（删除需级联清理，建议软停用） |
| POST | `/api/da/admin/schools/:schoolId/admins` | 增删该校 DA 管理员（email） |

**学校 DA 管理员（JWT + isDaAdminForSchool）—— 按校管理**
| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/da/admin/:slug/events` | 该校全部事件（含草稿）/ 新建 |
| PATCH/DELETE | `/api/da/admin/:slug/events/:id` | 更新 / 删除 |
| GET | `/api/da/admin/:slug/queue` | 该校待审批队列（schedule + todo） |
| POST | `/api/da/admin/:slug/queue/:id/approve` / `reject` | 审批 / 拒绝（复用 `mcpTools` 核心） |
| POST | `/api/da/admin/:slug/import` | 手动粘贴文本 → NLP → 入队 |
| GET/PUT | `/api/da/admin/:slug/settings` | 页面配置 + 邮箱配置（密码掩码）+ 学生贡献开关 |
| POST | `/api/da/admin/:slug/mail/refresh` | 手动重连/拉取该校 DA 邮箱 |
| GET | `/api/da/admin/:slug/students` | 该校学生贡献名单（分页） |
| PUT | `/api/da/admin/:slug/students/:userId` | 后台代管学生贡献开关 |

**学生（JWT，任意用户）**
| 方法 | 路径 | 说明 |
|------|------|------|
| GET/PUT | `/api/da/optin` | 查看 / 设置我的贡献开关（schoolId 由请求体或用户归属决定） |

### 4.5 `server/intervals.ts` — 各校 DA 邮箱轮询

- 在 `startIntervals` 中新增：`for (const school of await listEnabledSchools()) await syncDaMailbox(school)`（与现有用户循环并列，独立 try/catch，不影响既有逻辑）。
- 逻辑：仅对「`enabled` 且已配置邮箱」的学校启动；复用 `ImapClient` + `processEmailWithLLM`；连接失败仅记日志/广播，不拖垮主循环。
- 复用现有去重 `dbService.isEmailAiProcessed`。

### 4.6 `server/Services/emailProcessor.ts` — 向后兼容钩子

- `processEmailWithLLM(user, email, source, opts?: { onProcessed?: (ctx: { user, email, result }) => void })`。
- 在成功处理后调用 `opts?.onProcessed?.({ user, email, result })`；**默认不传则完全无行为变化**（现有调用全部不动）。
- 学生贡献由 `daService` 订阅该钩子实现，`emailProcessor` 不感知 DA/学校细节（低耦合）。

---

## 5. 前端实现

### 5.1 路由（`src/App.tsx`）

- `/events` → `DaSchoolsPage`（**公开落地页**：列出启用中的学校，点进各校 `/xjtlu/events`）。
- `/:slug/events` → `DaEventsPage`（**公开，位于登录守卫之外**，与 `/share/:token` 同级；`slug` 从 URL 参数取）。
- `/admin/schools` → `DaSchoolsAdmin`（系统管理员：学校增删改 + DA 管理员管理）。
- `/admin/da` → `DaAdminIndex`（列出我管理的学校）→ `/admin/da/:slug` → `DaAdminPanel`（按校编辑页）。

> 路由冲突提醒：`/:slug/events` 为参数路由，须放在 App.tsx 具体静态路由之后；同时保证不与现有 `/schedule/*`、`/admin` 等冲突（slug 取到 `schedule`/`admin` 时返回 404 即可）。

### 5.2 `src/services/api/da.ts` + barrel re-export

> 遵循 `verbatimModuleSyntax`：值与类型**分开导出**（`export` / `export type`），并在 `src/services/api/index.ts` 中 re-export（参照 `share.ts` 的写法）。

- 公开：`getDaSchools()`、`getDaEvents(slug, opts)`、`getDaEvent(slug, id)`、`getDaPage(slug)`
- 系统管理：`createDaSchool` / `getDaSchoolsAdmin` / `updateDaSchool` / `deleteDaSchool` / `addDaSchoolAdmin` / `removeDaSchoolAdmin`
- 学校 DA：`getDaAdminEvents(slug)` / `createDaEvent(slug, input)` / `updateDaEvent(slug, id, patch)` / `deleteDaEvent(slug, id)`、`getDaQueue(slug)` / `approveDaQueueItem(slug, id)` / `rejectDaQueueItem(slug, id)`、`importDaText(slug, text)`、`getDaSettings(slug)` / `updateDaSettings(slug, patch)`、`refreshDaMail(slug)`、`getDaStudents(slug)`
- 学生：`getDaOptin()` / `setDaOptin(schoolId, optedIn)`
- 类型：`School`、`DaEvent`、`DaPageConfig`、`DaQueueItem`、`DaSettings` 等

### 5.3 公开落地页 `src/components/DA/DaSchoolsPage.tsx`

- 展示所有启用学校卡片（名称/投稿邮箱/主题色），点击进入 `/:slug/events`。
- 复用 `Card`/`Button` 与设计令牌。

### 5.4 公开校页 `src/components/DA/DaEventsPage.tsx`

- 顶部：学校名 / 简介 / 投稿邮箱（来自 `/api/da/:slug/page`）+ 返回 `/events` 切换学校。
- 视图切换：**月视图 / 周视图 / 列表视图**（复用 `ViewToggle` + date-fns + `ScheduleCard`，参照 `ShareView` 的实现；`PivotView` 依赖个人象限数据，不适用于校园事件，故不引入）。
- 交互：上一月/下一月、今天、点击事件查看详情（轻量 `Modal`）。
- 样式：`src/styles/da.css`，**仅使用设计令牌**（`--color-*`/`--space-*`/`--radius-*`/`--font-size-*`/`--shadow-*`/`--duration-*`），可复用 `Schedule.css` 的网格类；每校可用 `themeColor` 覆盖局部强调色。

### 5.5 管理页 `src/components/DA/DaAdminPanel.tsx`（按校）与 `DaSchoolsAdmin.tsx`

`DaAdminPanel`（复用 `AdminPanel` 组织方式，顶部显示当前学校）：
1. **事件管理**：事件列表（月/周/列表预览）+ `DaEventEditorModal`（新建/编辑，复用 `QueueTaskModal` 的表单模式：名称/起止/地点/描述/分类/全天/重复）。
2. **待审批**：复用 `InlineScheduleApproval`（喂该校 DA 队列数据）。
3. **邮箱设置**：该校 `da_settings` 表单（邮箱 host/port/tls/username/password、学生贡献开关、页面标题/简介）。
4. **学生贡献**：`/api/da/admin/:slug/students` 名单 + 开关。

`DaSchoolsAdmin`（系统管理员）：
- 学校列表（slug/name/enabled/DA 管理员）+ 新增/编辑/停用 + 维护 `school_admins` 邮箱。

### 5.6 i18n

- `src/i18n/locales/*`（zh-CN / en-US）新增 DA 相关文案（导航、视图名、审批按钮、设置项、学校管理）。

---

## 6. 测试计划

新增 `server/__tests__/daService.test.ts`（jest ESM，参照 `archive.test.ts` 模式，用内存 sqlite 夹具）：
1. `SchoolStore`：创建/查询/停用、slug 唯一、`school_admins` CRUD。
2. `ensureDaAccount` 按校懒创建与幂等（不重复创建、不设密码）。
3. 权限矩阵：系统管理员恒通过；`school_admins` 只对该校通过；跨校越权被拒；`DA_ADMIN_EMAILS` 兜底仅限单校场景。
4. 公开查询只返回该校 `visibility='public'` 的事件；不同学校数据互不泄漏；私有/草稿被过滤。
5. 管理 CRUD：创建强制 `visibility='public'`；跨校 userId 被拒。
6. 队列审批：复用 `mcpTools.add_schedule`（mock）落库、状态流转 pending→approved/rejected。
7. 学生贡献启发式：命中白名单 → 匿名化入**所属学校** DA 队列；未 opt-in / 跨校 → 不入队。
8. `DaStore` 按校 settings 与 optin CRUD（同 key 不同校互不覆盖）。

注意：新增表不影响既有测试夹具；若未来在 `tasks` 上加列才需同步各测试文件的 CREATE TABLE（见 repo 记忆 ARC-001）。

---

## 7. 实施顺序（分阶段，每阶段可验证）

**Phase 1 — 数据层 + 服务层（后端地基）**
1. `migrations.ts` 新增 4 张表（schools/school_admins/da_settings/da_student_optins）+ 预置 xjtlu；`db/schools.ts`、`db/da.ts`；`db/index.ts` 挂载 + 代理。
2. `daService.ts`：学校 CRUD、`ensureDaAccount`、权限、公开查询、管理 CRUD、队列审批、页面配置。
3. `emailProcessor.ts` 增加 `onProcessed` 可选钩子。
4. `server/__tests__/daService.test.ts`（先写服务层单测）。
5. 验证：`npm test`；`npx tsc -b`（排除 dist 的临时 tsconfig 校验新文件）。

**Phase 2 — DA 路由 + 邮箱管道**
6. `daRoutes.ts`（公开 + 系统/学校管理员端点），`index.ts` 挂载。
7. `intervals.ts` 增加「遍历启用学校」的 `syncDaMailbox(school)`；`/api/da/admin/:slug/mail/refresh`。
8. `server/.env(.template)` 增加 `DA_ACCOUNT_DOMAIN`、`DA_ADMIN_EMAILS`（兜底）等。
9. 验证：`npx babel server --out-dir server/dist --extensions .ts` 重编译 → 手动 curl 公开/管理端点（含两个学校隔离验证）；`routes-contract` 若纳入新路由则补充契约用例。

**Phase 3 — 前端公开页**
10. `src/services/api/da.ts` + barrel re-export。
11. `DaSchoolsPage`（落地页）+ `DaEventsPage`（月/周/列表）+ `/events`、`/:slug/events` 公开路由 + `styles/da.css` + i18n。
12. 验证：`npm run dev` 打开 `/events` → 进入 `/xjtlu/events`，无登录直接看多视图。

**Phase 4 — 管理页 + 学生贡献**
13. `DaSchoolsAdmin`（系统管理员）+ `/admin/schools`；`DaAdminPanel` + `/admin/da/:slug`。
14. `daService.ingestStudentCandidate` 接入 `onProcessed` 钩子；`/api/da/optin` 前端开关（放用户设置页或 DA 公开页）。
15. 端到端验证：系统管理员新增第二所学校 → 投递样例学院邮件 → 该校 NLP 入队 → DA 审批 → 该校公开页可见（两校数据隔离）。

**Phase 5 — 文档与部署**
16. `docs/api/da.md` + `docs/api/README.md` 索引；`README.md` 功能说明。
17. 生产部署注意（见 §8 风险）。

---

## 8. 风险与注意事项

- **Express 路由顺序**：`/api/da/admin/schools`、`/api/da/:slug/*` 等静态段必须先于 `/:slug/*` 的 `:id` 段注册；`/api/da/admin/:slug/queue/:id/approve` 的 `:id` 在静态 `approve` 之前注册即可（参照 repo 记忆：`/emails/search` 必须在 `/emails/:emailId` 之前）。
- **前端 `/:slug/events` 参数路由**：须放在静态路由之后；`slug` 校验（仅允许已知学校，否则 404），避免吞掉 `schedule`/`admin` 等路径。
- **DA 账号不可登录**：不设 `passwordHash`/CAF 字段；若误走登录会被拒。管理操作一律经 `daRoutes` + 权限守卫，不暴露个人 taskRoutes 访问 DA 账号。
- **删除学校的策略**：物理删除会级联清掉该校 DA 账号与 events，风险高 → 默认提供「停用（enabled=0）」；物理删除仅限系统管理员显式操作。
- **编译链路**：后端改 `server/routes|Services` 后需 `npx babel server --out-dir server/dist --extensions .ts`；用 Node v22 运行（AGENTS.md）。
- **既有编译/lint 错误勿动**：仓库存在若干预先存在的 TS 报错（见 repo 记忆 refactor-routes-split），本次只保证新增文件干净。
- **测试夹具**：新增表不破坏现有测试；如在 `tasks` 上加列需同步 `archive.test.ts`/`todos.test.ts`/`userStatus.test.ts` 等 CREATE TABLE 夹具。
- **邮箱安全**：各校 DA 邮箱密码存储于 `da_settings`，管理 API 返回时掩码；建议后续用环境变量注入初始值。
- **公开页性能**：单校事件量小（校园大事件），直接读取该校 DA 账号 tasks 内存过滤足够；如未来量大再引入 SQL 分页/索引（现 `tasks(userId, startTime, endTime)` 已有索引）。
- **学生贡献的隐私**：转投 DA 队列时匿名化（不含学生邮箱/姓名），只保留事件字段与来源组织；按学校隔离，避免跨校泄露。
