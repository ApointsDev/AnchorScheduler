> 父文档：[API 文档](README.md)

---

## 待办（Todo）与标签（Tag）

> 全部需认证 🔒  
> **语义区分**：`Task` / `/api/tasks` = **日程**（有 start/end、冲突检测）；`Todo` / `/api/todos` = **待办**（可挂 0..N 标签，无时段冲突）。

---

### 待办 CRUD

#### `GET /api/todos`
```
Query: q?, completed?, tagIds?, tagNames?|tag?, dueBefore?, dueAfter?,
       sortBy?, order?, limit?, offset?|page?
Response: { todos: Todo[], total, limit, offset }
```
分页列表。`tagIds` / `tagNames` 为逗号分隔；多个标签为 **AND** 语义（须同时拥有）。

#### `POST /api/todos`
```
Body: {
  name,                    // 必填
  description?,
  completed?,              // 默认 false
  dueDate?,                // ISO
  importance?,             // high | normal | low
  importanceScore?,        // 四象限重要程度 [-1, 1]，可选
  urgencyScore?,           // 四象限紧急程度 [-1, 1]，可选
  tagIds?: string[],       // 已有标签 id
  tagNames?: string[]      // 不存在则自动创建
}
Response 201: { todo: Todo }
```
无标签时省略 `tagIds`/`tagNames` 即可。未传双轴时由 `importance` 枚举推导默认分数。

#### `GET /api/todos/:id`
```
Response: { todo: Todo }
```

#### `PUT /api/todos/:id` / `PATCH /api/todos/:id`
```
Body: { name?, description?, completed?, dueDate?, importance?,
        importanceScore?, urgencyScore?, tagIds?, tagNames? }
Response: { todo: Todo }
```
若请求体包含 `tagIds` 或 `tagNames`，则**整组替换**待办标签（可传空数组清空）。

#### `PATCH /api/todos/:id/priority-axes`
```
Body: { importanceScore?: number, urgencyScore?: number }  // 至少一个；范围 -1..1
Response: {
  todo: Todo,
  axes: { importanceScore, urgencyScore }
}
```
单独调整待办的四象限重要/紧急双轴分数。

#### `DELETE /api/todos/:id`
```
Response: { id, deleted: true }
```

#### `PUT /api/todos/:id/tags`
```
Body: { tagIds?: string[], tagNames?: string[] }
Response: { todo: Todo }
```
显式替换待办标签。

---

### 标签 CRUD + 反查

#### `GET /api/tags`
```
Response: { tags: Tag[] }
```

#### `POST /api/tags`
```
Body: { name, color? }
Response 201: { tag: Tag }
```
同用户下 `name` 唯一；冲突返回 `409`。

#### `GET /api/tags/:id`
```
Response: { tag: Tag }
```

#### `PUT /api/tags/:id` / `PATCH /api/tags/:id`
```
Body: { name?, color? }
Response: { tag: Tag }
```

#### `DELETE /api/tags/:id`
```
Response: { id, deleted: true }
```
删除标签会清除关联，**不删除**待办本身。

#### `GET /api/tags/:id/todos`
```
Query: 同 GET /api/todos（除 tagIds/tagNames）
Response: { todos: Todo[], total, limit, offset }
```
**按标签反查**该标签下的待办列表。

---

### 示例

创建带标签待办：
```json
POST /api/todos
{
  "name": "交实验报告",
  "dueDate": "2026-07-20T23:59:59.000Z",
  "importance": "high",
  "tagNames": ["课程", "CST401"]
}
```

按标签筛选：
```
GET /api/todos?tagNames=课程
GET /api/tags/<tagId>/todos
```

---

## 待办审批队列

> 与 `/api/schedule-queue` 对齐；邮件 AI 抽取的「无开始时间」事项入此队列。  
> 全部需认证 🔒

### `GET /api/todo-queue`
```
Response: { queue: TodoQueueItem[] }
```
获取当前用户待处理的待办审批队列。

### `POST /api/todo-queue/:id/approve`
批准队列项并创建 `Todo`（无冲突检测）。

```
Response: { todo: Todo, queue: TodoQueueItem[] }
```

### `POST /api/todo-queue/:id/reject`
拒绝并移除队列项。拒绝快照会写入 [事件拒绝缓冲池](./rejection-buffer.md)（24h TTL）。

```
Response: { ok: true, queue: TodoQueueItem[] }
```
