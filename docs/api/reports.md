> 父文档：[API 文档](README.md)

---

## 用户反馈 / 举报（RPT-001）

> 用户可提交**反馈**（意见 / Bug / 建议）或**举报**（违规用户 / 不当内容），提交后进入待处理队列，管理员在后台查看与处理。  
> 用户端需认证 🔒；管理端需认证 + 管理员白名单 🔒🛡。

### 类型与状态

| 字段 | 取值 | 说明 |
|------|------|------|
| `type` | `feedback` / `report` | 反馈 或 举报 |
| `status` | `pending` / `processing` / `resolved` / `rejected` | 待处理 / 处理中 / 已解决 / 已驳回 |

---

### `POST /api/reports` 🔒

提交反馈 / 举报。

```
Body: {
  type?: "feedback" | "report",   // 默认 "feedback"
  category?: string | null,        // 分类（如 bug/feature/spam/abuse）
  targetId?: string | null,        // 举报对象（被举报用户 ID / 内容 ID），仅举报时使用
  content: string,                 // 必填，5 ~ 5000 字符
  contact?: string | null          // 联系方式（选填）
}

Response 201: { report: UserReport }
```

| 状态码 | 说明 |
|--------|------|
| 201 | 提交成功 |
| 400 | 内容为空 / 长度不合法 / 类型无效 |
| 500 | 提交失败 |

---

### `GET /api/reports/mine` 🔒

获取当前用户提交的反馈 / 举报记录（按时间倒序分页）。

```
Query: page?, limit?    // 默认 page=1, limit=20，limit 上限 100

Response: {
  reports: UserReport[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

---

### 管理端端点（`/api/admin/*`）🔒🛡

#### `GET /api/admin/reports`

反馈 / 举报列表（分页 + 筛选 + 搜索）。

```
Query: page?, limit?, type?, status?, search?
  type:   "feedback" | "report"
  status: "pending" | "processing" | "resolved" | "rejected"
  search: 匹配 content / category / contact / id

Response: {
  reports: AdminReportRow[],       // = UserReport + userEmail + userName
  total, page, limit, totalPages
}
```

#### `PATCH /api/admin/reports/:id`

更新处理状态。

```
Body: { status: "pending" | "processing" | "resolved" | "rejected" }
Response: { report: AdminReportRow }
```

| 状态码 | 说明 |
|--------|------|
| 200 | 更新成功 |
| 404 | 记录不存在 |
| 400 | 状态无效 |

#### `DELETE /api/admin/reports/:id`

删除一条反馈 / 举报记录。

```
Response 200: { message: "已删除", id }
```

---

### 数据结构 `UserReport`

```typescript
interface UserReport {
  id: string;
  userId: string;
  type: "feedback" | "report";
  category: string | null;
  targetId: string | null;      // 举报对象 ID（反馈为空）
  content: string;
  contact: string | null;       // 联系方式
  status: "pending" | "processing" | "resolved" | "rejected";
  createdAt: string;            // ISO（上海时区）
  updatedAt: string;
}

// 管理端列表在 UserReport 基础上额外附带用户信息：
interface AdminReportRow extends UserReport {
  userEmail: string | null;
  userName: string | null;
}
```
