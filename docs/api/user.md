> 父文档：[API 文档](README.md)

---

## 四、用户与设置

> 全部需认证 🔒

### `GET /api/users/:userId/profile` — 访问用户个人主页
查看任意用户的公开主页（从社区排行榜点入等场景）。

- `:userId`：目标用户 id；传 `me` 表示当前登录用户
- Query：`fresh=1` 强制刷新本周状态与社区排名缓存

```
Response: {
  profile: {
    id: string,
    name: string,
    avatar: string | null,
    signature: string | null,
    isMe: boolean,
    region: { id, name, createdAt? } | null,
    status: UserStatus | null,          // 同 /api/user-status 的 status
    titles: [                           // 本社区四指标称号
      {
        metric: "completedThisWeek" | "incompleteThisWeek"
              | "avgCompleteDurationMs" | "completionHourMode",
        metricLabel: string,            // 如「本周完成日程数」
        titleLabel: string,             // 如「时间利用率」
        higherIsBetter: boolean,
        rank: number | null,
        value: number | null,
        title: string | null,           // 如「西交利物浦大学时间利用率第一」
        eligible: boolean,
        totalParticipants: number
      }
    ]
  }
}
```

**隐私**：不返回邮箱、密码/Token、日程明细、绑定账号等。  
未加入社区时 `region` 为 `null`，`titles` 为空数组。用户不存在 → `404`。

称号标签对照见 [community.md](community.md) / [user-status.md](user-status.md)。

### `GET /api/me`
```
Response: {
  id, email, name,
  avatar: string | null,       // 头像 URL 或 /uploads/avatars/...
  signature: string | null,    // 个人签名
  autoSchedulePromotions, stripReplyPrefix
}
```
获取当前用户资料与部分设置。

### `POST /api/me/avatar` — 换头像
支持两种方式：

**1. 上传图片文件**（推荐）
```
Content-Type: multipart/form-data
字段: avatar  // JPEG/PNG/GIF/WebP，≤2MB
```

**2. JSON 设置 URL / 清空**
```
Content-Type: application/json
Body: { "avatar": "https://example.com/a.jpg" }
      // 或 { "avatar": null } 清空
```

```
Response: {
  avatar: string | null,
  user: { id, email, name, avatar, signature }
}
```
本地上传会保存到 `private/uploads/avatars/`，访问路径形如 `/uploads/avatars/<file>`。

### `PUT|PATCH|POST /api/me/signature` — 个人签名
```
Body: { signature: string | null }   // 最长 200 字；null 或 "" 清空
Response: {
  signature: string | null,
  user: { id, email, name, avatar, signature }
}
```

### `GET /api/logs`
```
Query: start, end, type?, page?, limit?
Response: { logs: [...], total, page, limit }
```
获取操作日志（支持时间范围、类型过滤、分页）。

### `GET /api/settings/week`
```
Response: { currentWeek, academicBaseWeek, globalOffset, userOffset }
```
获取当前周数信息。

### `POST /api/settings/week`
```
Body: { currentWeek }  // 可选：校准当前周
Response: { success, currentWeek, userOffset }
```
更新用户级周数偏移。

### `POST /api/settings/conflict-mode`
```
Body: { mode: "inclusive" | "exclusive" }
```
设置冲突边界模式。

### `POST /api/settings/auto-schedule-promotions`
```
Body: { enabled: boolean }
```
开关：自动为推广邮件创建日程。

### `POST /api/settings/strip-reply-prefix`
```
Body: { enabled: boolean }
```
开关：AI 处理邮件时剥离回复/转发前缀。

### `GET /api/settings/onboarding`
```
Response: { completed: boolean, steps: [...] }
```
获取引导页完成状态。

### `POST /api/settings/onboarding`
```
Body: { step, completed }
```
更新引导页进度。
