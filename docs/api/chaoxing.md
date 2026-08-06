# 学习通（Chaoxing）同步 API

鉴权：`Authorization: Bearer <JWT>`

落点规则：

- 条目 **有开始时间** `start_at` → 写入 **日程** `tasks`
- 条目 **无开始时间** → 写入 **待办** `todos`

爬虫服务：`CRAWLER_BASE_URL`（默认 `http://127.0.0.1:8070`）

## GET /api/chaoxing/status

返回绑定与同步状态（不含密码）。

## PUT /api/chaoxing/bind

```json
{
  "username": "手机号或用户名",
  "password": "密码",
  "intervalHours": 24,
  "preferredHour": 8,
  "syncNow": true
}
```

绑定账号并 upsert 爬虫凭据（`account_id = sch_{userId}`）。`syncNow` 默认 true，异步触发首次同步。

## PATCH /api/chaoxing/settings

```json
{
  "intervalHours": 12,
  "preferredHour": 21,
  "enabled": true
}
```

## POST /api/chaoxing/sync

手动触发同步。返回 `202`；进行中时再次调用返回 `409`。

## DELETE /api/chaoxing/bind

解绑并禁用爬虫侧账号；默认保留已导入的日程/待办。
