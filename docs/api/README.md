# API 文档

> **Base URL**: `https://schedule.apoints.cn`  
> **认证方式**: JWT Bearer Token（`Authorization: Bearer <token>`）

## 文档索引

| 文件 | 模块 | 端点数 |
|------|------|--------|
| [auth.md](auth.md) | 认证 / CAF / Exchange / IMAP | 10 |
| [user.md](user.md) | 用户 / 个人主页 / 设置 / 操作日志 | 11 |
| [user-status.md](user-status.md) | 用户状态（本周日程完成统计） | 2 |
| [community.md](community.md) | 社区地区 / 四项 status 排名 | 9 |
| [rejection-buffer.md](rejection-buffer.md) | 事件拒绝缓冲池（24h TTL） | 3 |
| [reports.md](reports.md) | 用户反馈 / 举报 | 5 |
| [membership.md](membership.md) | 会员 / 兑换码 / 购买 | 7 |
| [share.md](share.md) | 日程分享链接 | 4 |
| [app-update.md](app-update.md) | 应用版本更新检查 / 配置 | 5 |
| [tasks.md](tasks.md) | 日程（Task）CRUD / 日程队列 | 13 |
| [todos.md](todos.md) | 待办（Todo）CRUD / 标签 / 按标签反查 | 12 |
| [email.md](email.md) | 邮件列表 / 搜索 / AI 处理 | 5 |
| [chat.md](chat.md) | LLM 对话 / 聊天上下文 | 8 |
| [calendar.md](calendar.md) | CalDAV / 课表同步 | 12 |
| [admin.md](admin.md) | 管理后台 | 9 |
| [integrations.md](integrations.md) | 算法 / 豆包 / 语音识别 / MCP / Ebridge | 17 |
| [reference.md](reference.md) | 数据结构 / WebSocket / 状态码 | — |

## 认证说明

所有标注 🔒 的端点需要在请求头中携带 JWT：

```
Authorization: Bearer <your_jwt_token>
```

JWT 通过 `/login`、`/register`、`/api/auth/caf/token` 获取。

管理端点额外需要管理员白名单（标注 🛡）。

## 状态码约定

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或 token 过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 冲突（如日程时间冲突） |
| 500 | 服务器内部错误 |
