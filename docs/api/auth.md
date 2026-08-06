> 父文档：[API 文档](README.md)

---

## 一、认证

### `GET /auth`
发起 Microsoft OAuth 授权，获取 Microsoft Todo 读写权限。重定向到微软登录页。

### `GET /redirect`
Microsoft OAuth 回调。换码后将 MS token 绑定到用户。

### `POST /register`
```
Body: { email, password, name? }
Response: { success, message, userId }
```
注册新用户。

### `POST /login`
```
Body: { email, password }
Response: { token, email, name, userId }
```
用户登录，返回 JWT。

---

## 二、Exchange / IMAP 绑定

> 需认证：`Authorization: Bearer <JWT>`

### `GET /auth/exchange`
发起 Exchange OAuth 授权，请求邮件/日历读取权限。

### `GET /auth/exchange/callback`
Exchange OAuth 回调，绑定 access/refresh token。

### `POST /auth/imap/bind` 🔒
```
Body: { email, password, host, port, tls }
```
绑定 IMAP 邮箱。

### `POST /auth/imap/unbind` 🔒
解绑 IMAP 邮箱。

---

## 三、CAF 校园认证

### `GET /auth/caf`
发起 CAF（校园统一认证）OAuth，重定向到 CAF 登录。

### `GET /auth/caf/callback`
CAF OAuth 回调，换码后创建/更新用户。

### `GET /api/auth/caf/authorize-url`
```
Query: platform=web|mobile
Response: { url }
```
返回 CAF 授权 URL。

### `POST /api/auth/caf/token`
```
Body: { code, token, email?, name? }  // code 或 token 二选一
Response: { jwt, email, name }
```
移动端 CAF 换码，返回 JWT。
