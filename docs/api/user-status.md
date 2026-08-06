> 父文档：[API 文档](README.md)

---

## 用户状态（User Status）

> 全部需认证 🔒  
> 统计对象为**日程（tasks）**，不含待办（todos）。  
> 「本周」= Asia/Shanghai **周一 00:00** 至 **下周一 00:00**（左闭右开）。

### 指标说明

| 字段 | 含义 |
|------|------|
| `completedThisWeek` | 本周内标记完成的日程数（`completedAt` 落在本周） |
| `incompleteThisWeek` | 本周未完成：`completed=false` 且时段与本周有交集 |
| `avgCompleteDurationMs` | 本周完成日程：`avg(completedAt - createdAt)` 毫秒；无样本为 `null` |
| `avgCompleteDurationHuman` | 时长可读格式（如 `2h`、`1d`） |
| `completionHourMode` | 完成时刻小时众数；多峰时取峰值小时的算术平均（如 19 与 21 → `20`） |
| `modalHours` | 众数小时列表，如 `[19, 21]` |
| `completedSampleSize` | 参与时长/众数计算的样本数 |
| `fromCache` | 是否来自 `user_status` 表缓存（TTL 60s） |

> 历史已完成但无 `completedAt` 的日程**不计入**本周完成相关指标（自部署后新完成的日程起准确）。

---

### `GET /api/user-status`

```
Query: fresh?   // 1|true 时强制重算，绕过缓存
Response: { status: UserStatus }
```

获取当前用户本周状态。默认读缓存；缓存过期、跨周或不存在时自动从 `tasks` 聚合并写回 `user_status`。

**示例响应**

```json
{
  "status": {
    "weekStart": "2026-07-13T00:00:00+08:00",
    "weekEnd": "2026-07-20T00:00:00+08:00",
    "completedThisWeek": 5,
    "incompleteThisWeek": 3,
    "avgCompleteDurationMs": 86400000,
    "avgCompleteDurationHuman": "1d",
    "completionHourMode": 20.0,
    "modalHours": [19, 21],
    "completedSampleSize": 5,
    "computedAt": "2026-07-15T12:00:00+08:00",
    "fromCache": false
  }
}
```

---

### `POST /api/user-status/refresh`

```
Response: { status: UserStatus }
```

强制重算并写回缓存（等价于 `GET /api/user-status?fresh=1`）。

---

## 相关字段：`Task.completedAt`

日程标记 `completed: true` 时由服务端写入 `completedAt`（上海 ISO）；取消完成时清空。  
详见 [tasks.md](tasks.md) / [reference.md](reference.md)。
