> 父文档：[API 文档](README.md)

---

## 十、CalDAV 外部日历

> 全部需认证 🔒

### `POST /api/caldav/config`
```
Body: { baseUrl, username, password, calendarUrl? }
Response: {
  message, enabled,
  principalUrl?, calendarHome?, calendarUrl?
}
```
配置外部 CalDAV 服务。保存后会自动执行 `PROPFIND` 发现（`principalUrl` / `calendarHome`），
若未指定 `calendarUrl` 且发现到日历，则默认使用第一个日历。

### `GET /api/caldav/status`
```
Response: {
  enabled, baseUrl, username,      // username 脱敏为 "***"
  principalUrl?, calendarHome?, calendarUrl?,
  lastSyncAt?                       // ISO 字符串
}
```
检查外部 CalDAV 连接状态。

### `GET /api/caldav/calendars`
```
Response: { calendars: CalDavCalendar[] }
```
列出外部 CalDAV 服务器上的日历（需已配置）。未配置时返回 400。

### `POST /api/caldav/sync`
```
Body: {
  direction?: "both" | "pull" | "push",   // 默认 "both"
  calendarUrl?, rangeStart?, rangeEnd?,   // ISO 字符串
  allowConflict?                          // 默认 true
}
Response: {
  message,
  result: {
    pulled: { created, updated, skippedConflicts, errors },
    pushed: { created, updated, skippedConflicts, errors }
  }
}
```
从外部 CalDAV 同步事件。`rangeStart`/`rangeEnd` 默认覆盖过去 30 天至未来 365 天。
未配置时返回 400。

### `DELETE /api/caldav/config`
```
Response: { message }
```
删除 CalDAV 配置并解绑（清除凭据、发现信息与同步令牌）。

---

## 十一、CalDAV Server（内置）

> 全部需认证 🔒。协议端点挂载于 `/caldav/*`（支持 Basic Auth 与 JWT Bearer）。

### `GET /api/caldav-server/status`
```
Response: {
  enabled,
  serverUrl,                            // <origin>/caldav
  principalUrl?, calendarHomeUrl?, calendarUrl?,
  username?, password?,                  // 启用时返回（password 为专用 CalDAV 密码）
  connectionHint,
  clientProfile                          // 当前兼容模式
}
```
获取内置 CalDAV Server 状态与连接参数。若历史数据已启用但缺少密码，会自动生成。

### `POST /api/caldav-server/enable`
```
Response: {
  message, serverUrl,
  principalUrl, calendarHomeUrl, calendarUrl,
  username, password
}
```
启用内置 CalDAV Server，并自动完成自绑定（将用户外部 CalDAV 指向内置服务器，
必要时生成专用 CalDAV 密码）。

### `POST /api/caldav-server/disable`
```
Response: { message }
```
禁用内置 CalDAV Server（不会删除外部 CalDAV 配置）。

### `POST /api/caldav-server/client-profile`
```
Body: { profile: "auto"|"apple"|"thunderbird"|"davx5"|"outlook"|"generic" }
Response: { clientProfile }
```
设置 CalDAV 客户端兼容模式，非法值返回 400。

---

## 十二、课表同步

> 全部需认证 🔒

### `POST /api/sync/timetable`
```
Response: { added, errors, message }
```
手动触发课表同步。

### `DELETE /api/sync/timetable`
```
Response: { deleted }
```
删除所有课表导入的日程。

### `POST /api/ebridge/save-url`
```
Body: { url }
```
保存课表 URL 并标记 ebridge 已绑定。
