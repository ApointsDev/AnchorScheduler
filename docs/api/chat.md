> 父文档：[API 文档](README.md)

---

## 八、LLM 聊天

> 全部需认证 🔒

### `POST /api/llm/chat`
```
Body: { messages: [{ role, content }], tools?, contextId? }
Response: SSE 流 (text/event-stream)
```
流式 LLM 对话（SSE）。每个 chunk 为 `data: { type, content? }`。

### `POST /api/chat/undo`
```
Response: { success, removedTasks }
```
撤销最后一轮对话，删除该轮创建的相关任务。

---

## 九、聊天上下文

> 全部需认证 🔒

### `GET /api/chat/contexts`
```
Response: { contexts: ChatContext[] }
```
列出用户所有聊天上下文。

### `POST /api/chat/contexts`
```
Body: { title? }
Response: { context: ChatContext }
```
创建新上下文。

### `GET /api/chat/contexts/:id`
```
Response: { messages: [...] }
```
加载指定上下文的完整消息历史。

### `DELETE /api/chat/contexts/:id`
删除指定上下文。

### `GET /api/chat/history`
```
Query: contextId?
```
兼容旧版：加载活跃上下文的消息历史。

### `POST /api/chat/history`
```
Body: { messages, contextId? }
```
保存聊天消息。
