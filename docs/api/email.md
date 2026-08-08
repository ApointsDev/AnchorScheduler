> 父文档：[API 文档](README.md)

---

## 七、邮件

> 全部需认证 🔒

### `GET /api/emails`
```
Query: limit?                        // 1-200，默认 50
Response: { emails: EmailListItem[], total }
```
获取邮件列表（取最新 N 封，非分页）。优先使用 IMAP，其次 Exchange；
未绑定任何邮箱时返回空数组。列表项字段：

```
{
  id, subject,
  from?: { name, address },
  receivedAt, isRead, isFlagged, flags,
  isAiProcessed, hasAttachments
}
```

### `GET /api/emails/search`
```
Query: q, limit?                     // q 必填；limit 1-100，默认 20
Response: { emails: EmailListItem[], total, query }
```
按关键词搜索邮件（匹配主题 / 发件人姓名 / 发件人地址）。
实现为取一批邮件后在内存中过滤，`total` 为匹配总数。

### `GET /api/emails/:emailId`
```
Response: { email: RawEmail }
```
获取单封邮件详情（正文、HTML、附件），优先从队列缓存读取，
否则从 IMAP/Exchange 实时获取；找不到返回 404。
`email.source` 为 `"imap"` | `"exchange"`。

### `PUT /api/emails/:emailId/read`
```
Response: { success: true }
```
标记邮件为已读（IMAP 优先，其次 Exchange）。无可用邮件客户端返回 404。

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
