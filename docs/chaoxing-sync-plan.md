# 学习通 → 日程/待办 对接与定时刷新 — 实现计划

## 背景与目标

本机已部署 **Chaoxing Crawler Lite**（`127.0.0.1:8070` / `crawler.internal`），对外提供：

- `POST /v1/crawl-jobs` → 轮询 `GET /v1/crawl-jobs/{id}` → `GET .../result`
- 凭据存在爬虫库 `chaoxing.crawler_accounts`（视图 `crawler_account_credentials`）

Schedule 后端（Express + SQLite + JWT）目前 **没有** 学习通相关代码。产品内：

| 用户口头 | 产品实体 | 用途 |
|---------|---------|------|
| 有 **开始时间** 的学习通条目 | **日程 `tasks`** | 与课表、Exchange 一致（`startTime` 必填） |
| 无开始时间（仅截止/状态/通知） | **待办 `todos`** | 作业、截止、通知等 |
| 「日常」字面 | 仅 recurrence 文案，**不是**列表实体 | — |

**落点铁律（分类唯一规则）：**

```text
条目含有效 start_at / 开始时间  →  日程 tasks
条目无开始时间                  →  待办 todos
```

与现有 `classifyScheduleOrTodo` 一致：有 startTime → schedule；仅 due/deadline 或无时间 → todo。

**目标：** 在 Schedule 后端实现绑定学习通账号、自动/手动触发爬虫刷新，按上述规则幂等写入 **日程或待办**，并支持刷新间隔与每日刷新时刻配置。

---

## 总体架构

```text
用户(JWT)
   │
   ▼
Schedule API  /api/chaoxing/*
   │  1) 存绑定配置 + 凭据（SQLite users 列）
   │  2) 同步 upsert 到爬虫 MySQL crawler_accounts
   │  3) POST 爬虫 /v1/crawl-jobs  (account_id = sch_{userId})
   │  4) 轮询 → 取 result
   │  5) 映射：有开始时间 → tasks；无开始时间 → todos；写去重表
   │
   ▼
intervals.ts 主循环（已有 ~20s）
   └─ 对绑定用户：若 now >= nextSyncAt → 触发同套 sync 逻辑
```

**原则：**

1. **爬虫只负责抓学习通**；业务归属、频控、分类写入全部在 Schedule。
2. **account_id 命名空间**：`sch_{userId}`，避免与手工账号冲突。
3. **凭据双写**：Schedule 用户表存绑定信息（改密/解绑方便）；同步前 upsert 爬虫侧，保证 job 能 `exists_enabled`。
4. **默认直写**（不经 todo_queue / schedule_queue）：有开始时间写日程，无开始时间写待办；与课表 `timetable` 直写一致。后续若要「人工审批」可再切队列。
5. 爬虫地址仅本机/内网：`CRAWLER_BASE_URL=http://127.0.0.1:8070`（或 `http://crawler.internal`）。

---

## 数据模型

### 1. `users` 表新增列（`migrations.ts` 幂等 ALTER）

| 列 | 类型 | 说明 |
|----|------|------|
| `ChaoxingBinded` | INTEGER 0/1 | 是否已绑定 |
| `ChaoxingUsername` | TEXT | 学习通手机号/用户名 |
| `ChaoxingPassword` | TEXT | 密码（与 IMAP/CalDAV 同级：明文落库；后续可统一加密） |
| `ChaoxingAccountId` | TEXT | 爬虫侧 id，固定 `sch_{userId}` |
| `ChaoxingIntervalHours` | INTEGER | 刷新间隔小时，默认 **24**，允许 1～168 |
| `ChaoxingPreferredHour` | INTEGER | 希望在一天中的小时（上海时区 0–23），默认 **8** |
| `ChaoxingEnabled` | INTEGER 0/1 | 是否启用自动刷新，默认 1 |
| `ChaoxingLastSyncAt` | TEXT | 上次成功结束时间（上海 ISO） |
| `ChaoxingNextSyncAt` | TEXT | 下次自动刷新时间 |
| `ChaoxingLastJobId` | TEXT | 最近一次 job_id |
| `ChaoxingLastStatus` | TEXT | idle / syncing / succeeded / failed |
| `ChaoxingLastError` | TEXT | 最近一次安全错误信息 |

同步更新：`types/models.ts` → `User`；`Services/db/users.ts` 读写映射。

### 2. 新建去重映射表 `chaoxing_item_map`

避免重复刷入（`todos` / 非课表 `tasks` 均无稳定 externalId）。**同一 remoteKey 只落一侧实体**（日程或待办），由是否有开始时间决定；若后续爬虫从「无开始时间」变为「有开始时间」（或反过来），sync 应迁移：创建新侧、删除旧侧引用并更新 map。

```sql
CREATE TABLE IF NOT EXISTS chaoxing_item_map (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  remoteKey TEXT NOT NULL,      -- 见下方算法
  kind TEXT NOT NULL,           -- work | exam | notice
  target TEXT NOT NULL,         -- 'task' | 'todo'  当前落点
  localTodoId TEXT,             -- target=todo 时有值
  localTaskId TEXT,             -- target=task 时有值
  fingerprint TEXT,             -- 标题+状态+开始/截止等，变更时更新
  lastSeenAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  UNIQUE(userId, remoteKey),
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**remoteKey 规则（稳定、字符串）：**

| 来源 | remoteKey |
|------|-----------|
| 作业 work | `work:{course_id}:{class_id}:{task_id\|\|title}` |
| 考试 exam | `exam:{course_id}:{class_id}:{task_id\|\|title}` |
| 通知 notice | `notice:{notice_id}` |

有 `task_id` 优先；无则用规范化 title（trim + 折叠空白）。

---

## 爬虫凭据同步策略

爬虫 **没有** 账号管理 HTTP API，仅有 MySQL 凭据表。两种实现（计划采用 A，B 为增强）：

| 方案 | 做法 | 取舍 |
|------|------|------|
| **A（本阶段）** | Schedule 用 env `CRAWLER_MYSQL_URL`（或拆分 host/user/pass/db）在 bind/unbind 时 `INSERT/UPDATE/DELETE crawler_accounts` | 快、与现部署一致；跨服务耦合 MySQL |
| B（后续） | 给 lite 增加内网 `PUT /v1/accounts/{id}` | 更干净，需改爬虫镜像 |

`account_id = sch_{userId}`，`username/password/enabled` 与绑定状态一致；解绑则 `enabled=0` 或删除行。

---

## 服务层设计

### 新文件（建议）

| 路径 | 职责 |
|------|------|
| `server/Services/chaoxing/crawlerClient.ts` | HTTP：createJob / getJob / getResult / 轮询；超时与错误码映射 |
| `server/Services/chaoxing/credentialStore.ts` |  upsert/disable 爬虫 MySQL `crawler_accounts` |
| `server/Services/chaoxing/mapper.ts` | CrawlResult → 按是否有开始时间分支为日程/待办草稿；remoteKey、标题、时间字段 |
| `server/Services/chaoxing/syncService.ts` | 端到端：占坑 → job → 轮询 → upsert task 或 todo → 更新 nextSyncAt |
| `server/Services/db/chaoxingItemMap.ts` | map 表 CRUD |
| `server/routes/chaoxingRoutes.ts` | REST 接口 |
| `docs/api/chaoxing.md` | 接口文档 |

### 映射规则（结果 → 列表）

爬虫结果结构：`courses[].works/exams`、`notices[]`。每条 work / exam / notice（及其内嵌 `task`）先归一为统一中间结构，再 **只按开始时间** 分类：

```text
hasStart = start_at 非空且可解析为合法时间
hasStart === true  →  target = task  （日程）
hasStart === false →  target = todo  （待办）
```

| 条件 | 写入 | 字段映射 |
|------|------|----------|
| **有开始时间** | **Task（日程）** | `startTime` = `start_at`；`endTime` = `end_at`（若缺省则 `start_at + 1h` 或与产品约定默认时长）；`dueDate` 可用 `end_at`；`name` = `[{course}] {title}`；`description` 含状态、链接、课程；可选确定性 id `chaoxing_{hash(remoteKey)}` |
| **无开始时间** | **Todo（待办）** | `dueDate` = `end_at`（转上海 ISO，可空）；`name` 同上；`description` 含课程名、`status_text`、链接；通知可用 `sent_at` 作 due 或仅描述 |
| course 元数据 | 不单独建实体 | 日程：写进 description/location；待办：标签 `学习通` + 课程名（`UNIQUE(userId,name)`） |

**类型与 kind 的关系（kind 只作 remoteKey/展示，不决定落点）：**

| 来源 | 常见情况（经验，以数据为准） |
|------|------------------------------|
| work | 多数仅有 `end_at` → **待办**；若将来带 `start_at` → **日程** |
| exam | 有开考 `start_at` → **日程**；仅状态/截止 → **待办** |
| notice | 通常无开始时间 → **待办**；若 `task.start_at` 有值则跟 task 走 **日程** |

**完成态：**

- 若 `status_text` 匹配已完成/已交/已互评等 → `completed=true`（可配置白名单）。
- 已存在 map：更新对应 task 或 todo 的爬虫权威字段（时间、描述、完成态）；name 策略 v1 可始终以爬虫为准（文档写明）。

**落点迁移：** 同一 `remoteKey` 若 `target` 从 todo↔task 变化，删除旧实体、创建新实体并更新 map（避免双边残留）。

**删除策略（v1）：** 对仍存在于结果中的项只 upsert + 更新 `lastSeenAt`。不主动删「本次未见」项（可选后续：连续 N 次未见则软隐藏）。

**冲突：** 写入日程时走现有 `findConflictingTasks` 策略——学习通同步 v1 建议 **仍写入**（与课表类似），冲突由前端/冲突 API 展示，不因冲突丢弃同步结果。

### 同步互斥

- 用户级内存锁 `Set<userId>` 或 `ChaoxingLastStatus==='syncing'` + 租约时间（如 10 分钟），防止 interval 与手动触发并发双开 job（爬虫侧同账号也只允许一个 active job）。

### 频控与 `nextSyncAt`

默认：`intervalHours=24`，`preferredHour=8`（上海）。

**计算下次时间（`computeNextSyncAt(from, intervalHours, preferredHour)`）：**

1. `candidate = from + intervalHours`。
2. 将 candidate 的「时钟」拨到上海时区当天的 `preferredHour:00`（若 interval &lt; 24，则落到最近的满足「≥ candidate 日期部分 + preferred 时刻」的点；若 interval ≥ 24，则在「不早于 from+interval」的那一天的 preferredHour）。
3. 简化 v1 算法（推荐实现，行为清晰）：
   - `base = max(now, lastSuccess + intervalHours)`
   - 在上海时区，取 **不早于 base** 的下一个 `preferredHour:00`（若 base 当天 preferredHour 已过，则 +1 天再取 preferredHour；若 `intervalHours < 24`，则改为 `base` 对齐到整点/保持 interval 为主、preferredHour 仅作「首次绑定后的锚点」）。

**更稳妥的产品语义（文档写清）：**

- **间隔**决定最短冷却：两次成功同步至少隔 `intervalHours`。
- **时刻**决定：冷却结束后，等到当天（或次日）的 `preferredHour` 再跑。
- 手动同步：**立即执行**，成功后按「本次成功时间」重算 `nextSyncAt`（仍尊重间隔，避免手动后立刻被 interval 再打一次：手动成功后 `nextSyncAt = compute(now)`）。

**调度挂载：** 在 `intervals.ts` 已有 20s 循环末尾增加：

```ts
if (user.ChaoxingBinded && user.ChaoxingEnabled && user.ChaoxingNextSyncAt <= nowShanghai) {
  void syncChaoxingUser(user).catch(...)
}
```

与课表同步并列；注意 **不要 await 拖死整轮**（与 Exchange 启动方式一致，可 fire-and-forget + 内部锁）。

轮询爬虫：2s 间隔，最长例如 180s；失败写 `ChaoxingLastError`，`nextSyncAt` 可短退避（如 +1h）以免打爆。

---

## HTTP API（均需 JWT）

挂载：`app.use("/api/chaoxing", chaoxingRoutes)`（与 `/api/todos` 同级）。

### 1. 绑定账号（上传密码 + 可选触发首次刷新）

```http
PUT /api/chaoxing/bind
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "username": "19337365206",
  "password": "********",
  "intervalHours": 24,      // 可选，默认 24
  "preferredHour": 8,       // 可选，默认 8
  "syncNow": true           // 可选，默认 true：绑定后立即刷新
}
```

**行为：** 校验参数 → 写 users → upsert 爬虫 accounts → 设 `ChaoxingBinded=1` → 若 `syncNow` 则异步/同步跑 `syncChaoxingUser`。

**响应 200：**

```json
{
  "binded": true,
  "accountId": "sch_<userId>",
  "intervalHours": 24,
  "preferredHour": 8,
  "enabled": true,
  "lastStatus": "syncing",
  "nextSyncAt": "...",
  "jobId": "..."
}
```

登录失败：同步结果里 `authentication_failed` → 仍保持绑定或可选自动解绑；建议 **保持绑定 + lastStatus=failed + lastError**，由用户改密。

### 2. 查询状态

```http
GET /api/chaoxing/status
```

返回绑定与否（**不回传密码**）、interval、preferredHour、enabled、lastSyncAt、nextSyncAt、lastStatus、lastError、lastJobId。

### 3. 修改刷新策略

```http
PATCH /api/chaoxing/settings
{
  "intervalHours": 12,
  "preferredHour": 21,
  "enabled": true
}
```

重算 `nextSyncAt`（基于 `lastSyncAt || now`）。

### 4. 手动触发刷新

```http
POST /api/chaoxing/sync
```

- 未绑定 → 400  
- 正在 syncing → 409  
- 成功受理 → 202 `{ jobId, status: "syncing" }`  
- 实现可同步等待完成（最长 3min）或只触发后台；**推荐 202 + 客户端轮询 status**（与爬虫模式一致，不阻塞网关）。

### 5. 解绑

```http
DELETE /api/chaoxing/bind
```

清密码与 Binded；爬虫侧 disable；**默认保留已导入的日程/待办与 map**（可选 query `?purge=1` 删除 map 关联的 task/todo——v1 可不做 purge）。

---

## 环境变量

写入 `server/.env.template` 与运行 `.env`：

```env
CRAWLER_BASE_URL=http://127.0.0.1:8070
CRAWLER_MYSQL_HOST=127.0.0.1
CRAWLER_MYSQL_PORT=3306
CRAWLER_MYSQL_USER=chaoxing
CRAWLER_MYSQL_PASSWORD=...
CRAWLER_MYSQL_DATABASE=chaoxing
# 可选
CHAOXING_SYNC_TIMEOUT_MS=180000
CHAOXING_POLL_INTERVAL_MS=2000
```

依赖：增加 `mysql2`（或 `mariadb`）仅用于凭据 upsert；HTTP 继续用现有 `axios`。

Nginx：中心即本机 Schedule 时，已能访问 `127.0.0.1:8070`；若以后 Schedule 在别机，需把该机 IP 加入 `crawler.internal` allowlist。

---

## 与现有代码的接入点

| 位置 | 改动 |
|------|------|
| `server/index.ts` | `authenticateToken` 下 mount `chaoxingRoutes` |
| `server/intervals.ts` | 主循环调用自动同步 |
| `server/types/models.ts` | User 字段 |
| `server/Services/db/migrations.ts` | 列 + `chaoxing_item_map` |
| `server/Services/db/users.ts` | persist |
| `server/Services/db/todos.ts` | 无开始时间：复用 `createTodo` / `updateTodo` |
| `server/Services/db/tasks.ts` | 有开始时间：复用 create/update task（与课表写入路径一致） |
| 可选 WebSocket | sync 后推送 task/todo 变更（若已有 broadcast）；无则仅 REST |

**最接近的抄写模板：**

- 绑定凭据：`/api/bind/imap` 类路由  
- 定时：`intervals.ts` + `syncUserTimetable`  
- 日程直写：`timetable.ts`；待办直写：todos store  
- 分类：`classifyScheduleOrTodo.ts`（有 startTime → 日程）  
- 去重：`chaoxing_item_map`（优于仅靠 UUID）  

---

## API 使用示例（调用方）

```bash
# 1. 绑定并立即刷新
curl -X PUT https://schedule.../api/chaoxing/bind \
  -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"username":"19337365206","password":"***","intervalHours":24,"preferredHour":8,"syncNow":true}'

# 2. 看状态
curl -H "Authorization: Bearer $JWT" https://schedule.../api/chaoxing/status

# 3. 改成每 12 小时、晚上 21 点偏好
curl -X PATCH .../api/chaoxing/settings \
  -d '{"intervalHours":12,"preferredHour":21}'

# 4. 手动刷
curl -X POST -H "Authorization: Bearer $JWT" .../api/chaoxing/sync
```

刷新成功后：

- 有开始时间的条目 → `GET /api/tasks` 可见  
- 无开始时间的条目 → `GET /api/todos` 可见（可带「学习通」等标签）

---

## 实现顺序（PR 可拆）

1. **PR1 — 基础设施**  
   migrations、User 字段、users store、env、`crawlerClient` + `credentialStore`、空 `syncService` 骨架。

2. **PR2 — 同步核心**  
   mapper（有 start → task / 无 start → todo）+ item_map + upsert；端到端对已部署爬虫跑通（注意日志勿打密码）。

3. **PR3 — HTTP API**  
   bind / status / settings / sync / unbind；错误码与文档 `docs/api/chaoxing.md`。

4. **PR4 — 定时**  
   `intervals.ts` 接入、nextSyncAt 计算单测、手动与自动互斥。

5. **（可选）PR5 — 前端**  
   设置页：绑定表单、间隔/时刻选择、手动刷新按钮、状态展示。用户本次只提后端接口，前端可另开。

---

## 测试计划

| 用例 | 期望 |
|------|------|
| bind 错误密码 | job failed `authentication_failed`；status 可见 error；不脏写大量 task/todo |
| bind 正确密码 + syncNow | 有 start 的进 tasks、无 start 的进 todos；map 有行；再次 sync 不重复 |
| 仅 `end_at` 的作业 | **只**创建/更新 todo，不写 task |
| 带 `start_at`（及可选 `end_at`）的考试 | **只** 创建/更新 task，`startTime` 正确 |
| 同一 remoteKey 从无 start 变为有 start | map.target 迁移 todo→task，旧 todo 删除 |
| 作业状态从「未交」变「已完成」 | 对应实体 completed 更新 |
| settings interval=24 preferredHour | nextSyncAt 落在冷却后的 preferred 时刻 |
| 自动调度 | 改 nextSyncAt 为过去 → 20s 内触发 |
| 并发 POST sync | 第二次 409 |
| unbind | Binded=0；爬虫 enabled=0；再 sync 400 |
| 无 JWT | 401 |

单测重点：`computeNextSyncAt`、`remoteKey`、**mapper 按 start 分流**、target 迁移。

集成测：对 `CRAWLER_BASE_URL` 真实打（可用 env `RUN_CHAOXING_INTEGRATION=1` 门控）。

---

## 风险与边界

1. **密码明文**：与现有 IMAP/XJTLU 一致；计划在文档标明，加密可作为后续统一项。  
2. **爬虫单 worker**：全站串行 job；用户多时自动刷新要 **错峰**（nextSyncAt 加 `hash(userId)%60` 分钟抖动），避免整点打爆。  
3. **前端入口**：日程有完整 UI；待办若 UI 不完整，无 start 的项仍进 API/DB。  
4. **「日常」语义**：不设第三套列表；学习通结果 **只进入日程或待办**，由是否有开始时间决定。  
5. **法律/ToS**：学习通爬取属既有服务能力；仅服务已绑定用户自己的账号。

---

## 决策摘要（已拍板建议）

| 议题 | 决定 |
|------|------|
| 列表落点 | **有开始时间 → 日程 tasks；无开始时间 → 待办 todos**（唯一分类规则） |
| 审批队列 | v1 **直写**，不经 todo_queue / schedule_queue |
| 频控 | intervalHours + preferredHour（上海）+ nextSyncAt；默认 24h @ 08:00 |
| 手动刷新 | `POST /api/chaoxing/sync` |
| 去重 | `chaoxing_item_map.remoteKey` + `target` |
| 爬虫账号 | `sch_{userId}` + MySQL upsert |
| 调度 | 复用 `intervals.ts` 20s 循环 |

---

## 关键文件清单

**新建**

- `server/routes/chaoxingRoutes.ts`
- `server/Services/chaoxing/crawlerClient.ts`
- `server/Services/chaoxing/credentialStore.ts`
- `server/Services/chaoxing/mapper.ts`
- `server/Services/chaoxing/syncService.ts`
- `server/Services/chaoxing/scheduleNext.ts`（nextSyncAt 纯函数，便于测）
- `server/Services/db/chaoxingItemMap.ts`
- `docs/api/chaoxing.md`
- 可选：`server/Services/chaoxing/__tests__/*.ts`

**修改**

- `server/index.ts`
- `server/intervals.ts`
- `server/types/models.ts`
- `server/Services/db/migrations.ts`
- `server/Services/db/users.ts`
- `server/.env.template`（及部署 `.env`）
- `package.json`（`mysql2` 依赖）

---

## 非目标（本计划不做）

- 改爬虫业务协议（除可选未来 accounts API）
- Cookie 打回 Schedule
- 学习通站内消息推送
- 完整前端设置页（可另 PR）
- 把历史「课表 timetable」与学习通课程表合并去重
