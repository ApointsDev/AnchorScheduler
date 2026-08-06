> 父文档：[API 文档](README.md)

---

## 五、任务管理

> 全部需认证 🔒

### `GET /api/tasks`
```
Query: start, end, q?, completed?, sortBy?, order?, page?, limit?
Response: { tasks: Task[], total, page, limit }
```
分页获取任务，支持时间过滤、搜索、状态筛选、排序。

### `POST /api/tasks`
```
Body: { name, startTime, endTime, description?, location?,
        importance?, importanceScore?, urgencyScore?,
        recurrenceRule?, conflictMode? }
Response: { task: Task }
```
创建任务（含冲突检测、重复规则解析）。  
`importanceScore` / `urgencyScore` 为四象限双轴浮点，范围 **[-1, 1]**（可选；缺省时由 `importance` 枚举推导）。

### `POST /api/tasks/batch`
```
Body: { tasks: [{ name, startTime, endTime, ... }] }
Response: { results: [{ status: "created"|"conflict"|"error", task?, error? }] }
```
批量创建任务。

### `POST /api/tasks/conflicts`
```
Body: { startTime, endTime, excludeTaskId? }
Response: { hasConflict: boolean, conflicts: Task[] }
```
冲突预检。

### `POST /api/tasks/classify-quadrants`
```
Body: { taskIds: string[] }
Response: { classifications: { taskId, quadrant, importanceScore?, urgencyScore? }[] }
```
LLM 自动归类到四象限，并写入连续双轴分数（`importanceScore` / `urgencyScore`，范围 -1..1）。

### `PATCH /api/tasks/:id/priority-axes`
```
Body: { importanceScore?: number, urgencyScore?: number }  // 至少一个；范围 -1..1
Response: {
  task: Task,   // 写库后再读的完整任务（含最新 quadrant / 双轴）
  axes: { importanceScore, urgencyScore, quadrant }
}
```
单独调整日程的四象限重要/紧急双轴；**服务端会用双轴强制重算 `quadrant`**（忽略客户端旧象限标签）。

客户端注意：
- 请用 `response.task` 或 `response.axes` 更新本地状态，不要把整个 body 当 Task。
- 若本地优先用双轴推导象限，请以 `axes.importanceScore/urgencyScore` 为准。

### `PUT /api/tasks/:id`
```
Body: { name?, startTime?, endTime?, description?, completed?,
        importance?, importanceScore?, urgencyScore?, ... }
Response: {
  task: Task,
  axes: { importanceScore, urgencyScore, quadrant },
  conflictWarning?
}
```
更新任务。若 body 含双轴，**服务端强制按双轴重算 quadrant**。

### `PATCH /api/tasks/:id`
```
Body: { completed?: boolean, importanceScore?, urgencyScore?, ... }
Response: {
  task: Task,
  axes: { importanceScore, urgencyScore, quadrant },
  conflictWarning?
}
```
部分更新。含双轴时同样强制重算 `quadrant`（客户端传入的旧 `quadrant` 会被覆盖）。

### `DELETE /api/tasks/:id`
```
Query: cascade=true    // 可选：级联删除子实例
Response: { success }
```
删除任务。

### `GET /api/tasks/parents`
```
Response: { tasks: Task[] }
```
列出所有含重复规则的父级日程及其子实例。

### `GET /api/tasks/:id/occurrences`
```
Query: page?, limit?, sortBy?, order?
Response: { occurrences: Task[], total }
```
获取重复任务的所有实例。

---

## 六、日程队列

> 全部需认证 🔒

### `GET /api/schedule-queue`
```
Response: { queue: [...] }
```
获取待处理的日程安排队列。

### `POST /api/schedule-queue/:id/approve`
批准队列中的日程请求并创建任务。Body 可选 `{ allowConflict?: boolean }`；冲突返回 409。

### `POST /api/schedule-queue/:id/reject`
拒绝队列中的日程请求。拒绝快照会写入 [事件拒绝缓冲池](./rejection-buffer.md)（24h TTL）。

> 待办审批队列见 [todos.md](./todos.md) 的 `/api/todo-queue`（与本接口对称，无冲突检测）。
