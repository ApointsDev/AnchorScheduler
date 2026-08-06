> 父文档：[API 文档](README.md)

---

## 事件拒绝缓冲池（Rejection Buffer）

> 全部需认证 🔒  
> 用户拒绝「日程审批队列」或「待办审批队列」中的项时，快照会进入缓冲池。  
> **TTL = 24 小时**：自 `rejectedAt` 起满 24 小时后从数据库删除。  
> 查询时自动清理过期记录；后台每小时也会清理一次。

### 查询参数 `hours`

| 参数 | 类型 | 默认 | 范围 | 说明 |
|------|------|------|------|------|
| `hours` | number | `24` | `1`–`24` | 回看窗口：只返回「从现在起过去 N 小时内」被拒绝的记录 |

超出范围会自动夹到边界（例如 `hours=48` → `24`，`hours=0` → `1`）。

---

### `GET /api/rejection-buffer/schedules`

获取过去 `hours` 小时内被拒绝的**日程**。

```
Query: hours?
Response: {
  hours: number,
  since: string,              // ISO，查询窗口起点
  schedules: RejectionBufferItem[]
}
```

---

### `GET /api/rejection-buffer/todos`

获取过去 `hours` 小时内被拒绝的**待办**。

```
Query: hours?
Response: {
  hours: number,
  since: string,
  todos: RejectionBufferItem[]
}
```

---

### `GET /api/rejection-buffer`

获取过去 `hours` 小时内被拒绝的**日程 + 待办**。

```
Query: hours?
Response: {
  hours: number,
  since: string,
  schedules: RejectionBufferItem[],
  todos: RejectionBufferItem[],
  items: RejectionBufferItem[]    // 合并列表，按 rejectedAt 降序
}
```

---

### 数据结构 `RejectionBufferItem`

```typescript
interface RejectionBufferItem {
  id: string;
  userId: string;
  kind: "schedule" | "todo";
  sourceQueueId?: string;   // 原队列项 id
  rawRequest: unknown;      // 原队列 rawRequest 的 JSON 快照
  rejectedAt: string;       // 拒绝时间 ISO
  expiresAt: string;        // rejectedAt + 24h
}
```

### 写入时机

| 操作 | kind |
|------|------|
| `POST /api/schedule-queue/:id/reject` | `schedule` |
| `POST /api/todo-queue/:id/reject` | `todo` |

### 示例

```
GET /api/rejection-buffer?hours=6
GET /api/rejection-buffer/schedules?hours=24
GET /api/rejection-buffer/todos?hours=3
```

```json
{
  "hours": 6,
  "since": "2026-07-15T11:00:00+08:00",
  "schedules": [
    {
      "id": "...",
      "userId": "...",
      "kind": "schedule",
      "sourceQueueId": "...",
      "rawRequest": {
        "args": { "name": "组会", "startTime": "...", "endTime": "..." },
        "email": { "subject": "..." }
      },
      "rejectedAt": "2026-07-15T14:30:00+08:00",
      "expiresAt": "2026-07-16T14:30:00+08:00"
    }
  ],
  "todos": [],
  "items": [ /* 同上，含 schedules + todos */ ]
}
```
