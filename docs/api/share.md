> 父文档：[API 文档](README.md)

---

## 日程分享（SHARE）

> 用户可生成"无需登录即可查看"的日程分享链接，对方通过 `/share/:token` 访问。
> 分享范围支持：按日期区间（`dateStart`/`dateEnd`）、按指定任务（`taskIds`）、或全部日程（三者均空）。
> 查看接口无需认证；创建/列表/删除需认证 🔒。

---

### `POST /api/share/create` — 创建分享链接 🔒

```
Body: {
  name?: string,            // 分享名称，默认 "日程分享"
  dateStart?: string,       // 起始时间 ISO，可选（与 dateEnd 组合限定日期区间）
  dateEnd?: string,         // 结束时间 ISO，可选
  taskIds?: string[],       // 指定任务 id 数组，可选
  expiresInDays?: number    // 有效期天数，可选；>0 时设置过期时间，否则永久有效
}
```

范围约束：`dateStart` / `dateEnd` / `taskIds` 三者至少提供一个；全部为空 = 分享全部日程。

```
Response 200: {
  token: string,        // 16 位十六进制 token（分享链接标识）
  shareUrl: string,     // 完整访问链接，形如 <frontendUrl>/share/<token>
  expiresAt: string | null
}
```

| 状态码 | 说明 |
|--------|------|
| 400 | 参数不符合范围约束 |
| 500 | 创建分享失败 |

---

### `GET /api/share/list` — 分享链接列表 🔒

获取当前用户创建的全部分享链接。

```
Response 200: {
  shares: [{
    id: string,
    token: string,
    name: string,
    dateStart: string | null,
    dateEnd: string | null,
    taskIds: string[] | null,   // JSON 反序列化后的任务 id 数组
    expiresAt: string | null,
    createdAt: string,
    shareUrl: string
  }]
}
```

| 状态码 | 说明 |
|--------|------|
| 500 | 获取分享列表失败 |

---

### `DELETE /api/share/:token` — 删除分享链接 🔒

仅能删除**当前用户自己**的分享链接。

```
Response 200: { message: "已删除" }
```

| 状态码 | 说明 |
|--------|------|
| 404 | 分享链接不存在（或不属于当前用户） |
| 500 | 删除分享失败 |

---

### `GET /api/share/view/:token` — 查看分享（无需认证）

通过 token 查看分享的日程，返回**脱敏数据**（不含邮箱、Token 等敏感信息）。

```
Response 200: {
  share: {
    name: string,
    createdAt: string
  },
  tasks: [{
    id: string,
    name: string,
    description: string | null,
    startTime: string | null,
    endTime: string | null,
    location: string | null,
    importance: number,
    completed: boolean
  }],
  user: {
    name: string     // 分享用户昵称，查不到为 "未知用户"
  }
}
```

| 状态码 | 说明 |
|--------|------|
| 404 | 分享链接不存在或已失效 |
| 410 | 分享链接已过期（`expiresAt` 早于当前时间） |
| 500 | 加载分享失败 |

> 过滤规则：指定 `taskIds` 时仅返回属于分享用户的任务；按日期区间时仅返回 `startTime` 落在区间内的任务。

---

### 数据结构 `SharedSchedule`

```typescript
interface SharedSchedule {
  id: string;
  userId: string;        // 创建者用户 ID（UUID）
  token: string;         // 16 位十六进制 token
  name: string;
  dateStart?: string;
  dateEnd?: string;
  taskIds?: string;      // 存储为 JSON 字符串
  expiresAt?: string;
}
```
