> 父文档：[API 文档](README.md)

---

## 十六、管理员

> 全部需认证 + 管理员白名单，挂载于 `/api/admin/*`

### `GET /api/admin/check` 🔒
检查当前用户是否为管理员。

### `GET /api/admin/fields` 🔒🛡
```
Response: { fields: [...] }
```
获取可编辑字段元数据。

### `GET /api/admin/users` 🔒🛡
```
Query: search?, page?, limit?
Response: { users: User[], total }
```
列出/搜索所有用户。

### `POST /api/admin/users` 🔒🛡
```
Body: { email, name, password?, xjtluAccount? }
```
创建新用户。

### `GET /api/admin/users/:id` 🔒🛡
获取单个用户完整信息。

### `PATCH /api/admin/users/:id` 🔒🛡
```
Body: { field: value }
```
更新用户字段（白名单限制）。

### `DELETE /api/admin/users/:id` 🔒🛡
删除用户及其数据。

### `GET /api/admin/users/:id/schedule` 🔒🛡
查看指定用户的所有日程。

### `POST /api/admin/cache/refresh` 🔒🛡
```
Body: { userId? }
```
刷新用户缓存。
