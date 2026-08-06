> 父文档：[API 文档](README.md)

---

## 七、邮件

> 全部需认证 🔒

### `GET /api/emails`
```
Query: page?, limit?, folder?
Response: { emails: Email[], total, page }
```
分页获取邮件列表。

### `GET /api/emails/search`
```
Query: query, limit?
Response: { emails: Email[] }
```
按关键词搜索邮件。

### `GET /api/emails/:emailId`
```
Response: { email: Email }
```
获取单封邮件详情（正文、HTML、附件）。

### `PUT /api/emails/:emailId/read`
标记邮件为已读。

### `POST /api/emails/:emailId/ai-process`
手动触发 AI 处理指定邮件，按时间规则提取 **日程** 与 **待办**：

- 有 `startTime` → 入 `schedule_queue`（`add_schedule`）
- 仅有截止时间或无时间 → 入 `todo_queue`（`add_todo`）
- 工具名与时间字段不一致时，LLM 最多重试 3 轮；仍失败则记错误日志、不入队（不静默迁移类型）

```
Response: {
  success: true,
  queuedSchedules: string[],
  queueItems: ScheduleQueueItem[],
  queuedTodos: string[],
  todoQueueItems: TodoQueueItem[],
  toolCallsTriggered: boolean,
  validationFailed?: boolean,
  lastValidationError?: string,
  message: string
}
```
