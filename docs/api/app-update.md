> 父文档：[API 文档](README.md)

---

## 应用版本更新（UPD-001）

> 管理员在后台配置各平台（android / ios / web / all）的最新版本与**外部下载源**，客户端（App / 网页）登录后调用检查接口获取是否有新版本及下载地址。  
> 用户端需认证 🔒；管理端需认证 + 管理员白名单 🔒🛡。

### 平台标识

| `platform` | 说明 |
|------------|------|
| `android`  | Android App |
| `ios`      | iOS App |
| `web`      | Web 端 |
| `all`      | 全平台通用 |

> 客户端查询时优先匹配精确平台，其次匹配 `all`。

---

### `GET /api/app/update` 🔒

检查最新版本。

```
Query: {
  platform?: "android" | "ios" | "web" | "all",  // 默认 "all"
  version?: string,        // 当前版本号（可选）
  versionCode?: number     // 当前版本码（可选）
}

Response 200: {
  updateAvailable: boolean,
  latest: AppReleaseInfo | null   // 无可用版本时为 null
}
```

**是否有更新的判定：**
- 客户端提供了 `versionCode` → `latest.versionCode > currentVersionCode`
- 未提供 `versionCode` 但提供 `version` → 版本字符串不同即视为有更新
- 两者都未提供 → 一律返回 `updateAvailable: true`

```typescript
interface AppReleaseInfo {
  id: string;
  platform: "android" | "ios" | "web" | "all";
  version: string;
  versionCode: number;
  downloadUrl: string;      // 外部下载源
  releaseNotes: string | null;
  forceUpdate: boolean;     // 是否强制更新
  publishedAt: string;      // 发布时间 ISO
}
```

---

### 管理端端点（`/api/admin/*`）🔒🛡

#### `GET /api/admin/app-update`

版本发布配置列表（按平台、版本码倒序）。

```
Response: { releases: AppRelease[] }
```

#### `POST /api/admin/app-update`

新增 / 更新一条版本发布配置（携带 `id` 为更新，否则新增）。

```
Body: {
  id?: string,                            // 更新时必填
  platform: "android" | "ios" | "web" | "all",   // 必填
  version: string,                        // 必填
  versionCode?: number,                   // 默认 0
  downloadUrl: string,                    // 必填，外部下载源
  releaseNotes?: string | null,
  forceUpdate?: boolean,
  enabled?: boolean                       // 默认 true
}

Response: { release: AppRelease }
```

| 状态码 | 说明 |
|--------|------|
| 200 | 更新成功 |
| 201 | 新增成功（接口统一返回 200） |
| 400 | 缺少必填项 |

#### `PATCH /api/admin/app-update/:id/enabled`

启用 / 停用某条版本配置。

```
Body: { enabled: boolean }
Response: { release: AppRelease }
```

| 状态码 | 说明 |
|--------|------|
| 200 | 更新成功 |
| 404 | 配置不存在 |

#### `DELETE /api/admin/app-update/:id`

删除一条版本配置。

```
Response 200: { message: "已删除", id }
```

---

### 数据结构 `AppRelease`

```typescript
interface AppRelease {
  id: string;
  platform: "android" | "ios" | "web" | "all";
  version: string;
  versionCode: number;
  downloadUrl: string;      // 外部下载源
  releaseNotes: string | null;
  forceUpdate: boolean;
  enabled: boolean;         // 停用后客户端检查将忽略该条
  createdAt: string;        // ISO（上海时区）
  updatedAt: string;
}
```
