> 父文档：[API 文档](README.md)

---

## 十、CalDAV 外部日历

> 全部需认证 🔒

### `POST /api/caldav/config`
```
Body: { baseUrl, username, password, calendarUrl }
```
配置外部 CalDAV 服务。

### `GET /api/caldav/status`
```
Response: { connected, serverInfo, calendars }
```
检查外部 CalDAV 连接状态。

### `GET /api/caldav/calendars`
```
Response: { calendars: [...] }
```
列出外部 CalDAV 服务器上的日历。

### `POST /api/caldav/sync`
从外部 CalDAV 同步事件到本地。

### `DELETE /api/caldav/config`
删除 CalDAV 配置并解绑。

---

## 十一、CalDAV Server（内置）

> 全部需认证 🔒

### `GET /api/caldav-server/status`
```
Response: { enabled, username, password, url, principalUrl }
```
获取内置 CalDAV Server 状态与连接参数。

### `POST /api/caldav-server/enable`
启用内置 CalDAV Server。

### `POST /api/caldav-server/disable`
禁用内置 CalDAV Server。

### `POST /api/caldav-server/client-profile`
```
Body: { profile: "apple"|"thunderbird"|"generic" }
```
设置 CalDAV 客户端兼容模式。

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
