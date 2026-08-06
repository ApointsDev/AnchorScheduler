# Database Service — 模块化架构

## 目录结构

```
db/
├── index.ts              # 组合入口：DatabaseService 类 + dbService 单例
├── taskMapper.ts         # 共享工具：mapRowToTask() 消除重复映射
├── migrations.ts         # 数据库迁移：CREATE TABLE + ALTER TABLE
├── users.ts              # UserStore — 用户 CRUD + mapRowToUser
├── tasks.ts              # TaskStore — 任务 CRUD + 分页/搜索
├── userLogs.ts           # UserLogStore — 操作日志写入/查询
├── admin.ts              # AdminStore — 管理员字段更新 + 删除用户
├── emailAi.ts            # EmailAiStore — AI 已处理邮件追踪
├── calendarEventMap.ts   # CalendarEventMapStore — CalDAV 事件映射
├── scheduleQueue.ts      # ScheduleQueueStore — 日程审批队列
├── chatContext.ts        # ChatContextStore — AI 对话上下文持久化
├── sharedSchedule.ts     # SharedScheduleStore — 日程分享链接
├── tags.ts               # TagStore — 用户标签 CRUD
├── todos.ts              # TodoStore — 待办 CRUD + 标签关联 / 反查
├── todoMapper.ts         # mapRowToTodo / mapRowToTag
├── userStatus.ts         # UserStatusStore — 本周日程统计缓存
├── community.ts          # CommunityStore — 地区 + status 指标排名
├── rejectionBuffer.ts    # RejectionBufferStore — 事件拒绝缓冲池（24h TTL）
└── README.md             # 本文档
```

## 架构设计

### 依赖注入

每个子模块通过构造函数接收 `Database` 实例，不依赖全局单例：

```ts
export class TaskStore {
    constructor(private db: Database) {}
}
```

`index.ts` 在 `initialize()` 中统一创建并注入：

```ts
this.tasks = new TaskStore(this.db, (userId, type, msg, payload) =>
    this.logs.add(userId, type, msg, payload),
);
```

### 向后兼容

`DatabaseService` 保留所有原有方法签名作为代理，外部调用无需改动：

```ts
// 原有调用方式（仍然有效）
await dbService.getTasksByUserId(userId);
await dbService.addUserLog(userId, "task_created", "...");

// 新的直接访问方式（可选）
await dbService.tasks.getTasksByUserId(userId);
await dbService.logs.add(userId, "task_created", "...");
```

### 核心复用：taskMapper

`taskMapper.ts` 导出的 `mapRowToTask(row)` 将 SQLite 行映射为 `Task` 对象。此前在 6 个方法中各自内联了相同的 18 行映射代码，现已统一为一处。

```ts
import { mapRowToTask } from "./taskMapper";

const rows = await this.db.all("SELECT * FROM tasks WHERE ...");
return rows.map(mapRowToTask); // 替代 18 行内联映射
```

### 日志回调

`TaskStore` 通过回调函数委托日志写入 `UserLogStore`，避免循环依赖：

```ts
this.tasks = new TaskStore(this.db, (userId, type, msg, payload) =>
    this.logs.add(userId, type, msg, payload),
);
```

## 添加新功能

1. 在对应模块的 Store 类中添加方法
2. 在 `index.ts` 中添加代理方法（如需向后兼容）
3. 如新建模块，创建新文件并在 `index.ts` 中注册

## 迁移说明

原有 `dbService.ts` (2134 行) 已拆分为 12 个文件。旧文件现为重导出：

```ts
export { DatabaseService, dbService } from "./db/index.js";
```
