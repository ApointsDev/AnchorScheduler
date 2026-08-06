# CAF Server API Documentation

本文档描述了 CAF (Central Authentication Facility) Server 的 API 接口。

## 基础信息

- **Base URL**: `http://localhost:8081` (默认)
- **数据格式**: JSON

## 认证

大部分接口需要 Bearer Token 认证。
Header: `Authorization: Bearer <access_token>`

---

## 1. SubServer 注册

下游服务器 (SubServer) 向中心服务器注册。

- **URL**: `/api/subserver/register`
- **Method**: `POST`
- **Auth**: 无

### Request Body

```json
{
  "name": "SubServer A",
  "public_key": "-----BEGIN PUBLIC KEY-----\n..."
}
```

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `name` | string | SubServer 名称 |
| `public_key` | string | SubServer 的 RSA 公钥 (PEM 格式) |

### Response (200 OK)

```json
{
  "id": "uuid-string",
  "secret": "random-secret-string",
  "message": "Registered successfully"
}
```

---

## 2. 获取 OAuth Token (用户登录)

SubServer 使用 Authorization Code 换取 Access Token。

- **URL**: `/api/oauth/token`
- **Method**: `POST`
- **Auth**: 无 (通过 Client Secret 验证)

### Request Body

```json
{
  "grant_type": "authorization_code",
  "client_id": "your-client-id",
  "client_secret": "your-client-secret",
  "code": "authorization-code"
}
```

### Response (200 OK)

```json
{
  "access_token": "jwt-token-string",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## 3. 协议接口 (Protocol)

以下接口用于 SubServer 与 CAF Server 之间的核心协议交互，需要携带 Access Token。

### 3.1 获取权限列表

- **URL**: `/api/protocol/permissions`
- **Method**: `GET`

### 3.2 获取接口列表

- **URL**: `/api/protocol/interfaces`
- **Method**: `GET`

### 3.3 获取目标 SubServer 访问令牌

- **URL**: `/api/protocol/access-token`
- **Method**: `POST`
- **Body**: `{"target_sub_server_id": "..."}`

### 3.4 更新自身接口列表

- **URL**: `/api/protocol/subserver/interfaces`
- **Method**: `POST`
- **Body**: `{"interfaces": ["/api/v1/resource"]}`

### 3.5 更新黑名单

- **URL**: `/api/protocol/subserver/blocklist`
- **Method**: `POST`
- **Body**: `{"block_list": ["bad-server-id"]}`

---

## 4. 用户前端接口 (User Frontend)

以下接口供 CAF Server 的前端页面使用。

### 4.1 用户注册
- **URL**: `/api/user/register`
- **Method**: `POST`
- **Body**: `{"username": "...", "password": "..."}`

### 4.2 用户登录
- **URL**: `/api/user/login`
- **Method**: `POST`
- **Body**: `{"username": "...", "password": "..."}`
- **Response**: `{"token": "..."}` (Session Token)

### 4.3 获取用户信息
- **URL**: `/api/user/info`
- **Method**: `GET`
- **Auth**: User Session Token
- **Response**: `{"id": "...", "username": "..."}`

### 4.4 获取已授权应用列表
- **URL**: `/api/user/authorizations`
- **Method**: `GET`
- **Auth**: User Session Token
- **Response**:
  ```json
  {
    "authorizations": [
      {
        "sub_server_id": "...",
        "sub_server_name": "...",
        "permissions": ["..."]
      }
    ]
  }
  ```

### 4.5 撤销应用授权
- **URL**: `/api/user/authorizations/:subServerID`
- **Method**: `DELETE`
- **Auth**: User Session Token

### 4.6 获取客户端信息 (OAuth流程)
- **URL**: `/api/user/client-info?client_id=...`
- **Method**: `GET`

### 4.7 批准授权 (OAuth流程)
- **URL**: `/api/user/oauth/approve`
- **Method**: `POST`
- **Auth**: User Session Token
- **Body**: `{"client_id": "...", "scope": "..."}`

---

## 5. WebSocket

- **URL**: `/api/ws`
- **Auth**: Token via Header or Query Param

