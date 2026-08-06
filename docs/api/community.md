> 父文档：[API 文档](README.md)

---

## 社区排名

> 全部需认证 🔒  
> 基于 [用户状态](user-status.md) 四个指标，在**同一社区地区**（如学校）内排名。  
> 用户看到的称号示例：**「西交利物浦大学时间利用率第一」**。

### 用户视角（产品文案）

| 状态指标 | 称号标签 | 排序 | 示例称号 |
|----------|----------|------|----------|
| 本周完成日程数 | 时间利用率 | 越高越好 | 西交利物浦大学时间利用率第一 |
| 本周未完成日程数 | 日程清爽度 | 越少越好 | 西交利物浦大学日程清爽度第2 |
| 平均完成时长 | 执行效率 | 越快越好 | 西交利物浦大学执行效率第一 |
| 习惯完成时段 | 早鸟指数 | 越早越好 | 西交利物浦大学早鸟指数第3 |

「本周」与 user-status 一致：Asia/Shanghai 周一 00:00 → 下周一 00:00。

预置地区：`region-xjtlu` / **西交利物浦大学**。用户须先加入地区再查排名。

---

## 地区

### `GET /api/community/regions`
```
Response: { regions: [{ id, name, createdAt? }] }
```

### `POST /api/community/regions`
```
Body: { name: string }
Response: { region }   // 201；同名则返回已有
```

### `GET /api/community/me`
```
Response: { region: CommunityRegion | null }
```

### `PUT /api/community/me/region`
```
Body: { regionId?: string, regionName?: string }
Response: { region }
```
加入或切换地区。`regionName` 不存在时会自动创建。

---

## 四个排名接口

公共 Query：

| 参数 | 说明 |
|------|------|
| `fresh` | `1`/`true` 强制重算榜单 |
| `limit` | 榜单条数，默认 20，最大 100 |
| `regionId` | 可选，覆盖「我的地区」查看其它区榜（仍返回当前用户在该区的 me，若未加入则无 me 资格） |

> 注：未传 `regionId` 时使用用户已加入的地区；未加入 → `400` + `code: REGION_REQUIRED`。

公共响应：

```json
{
  "ranking": {
    "metric": "completedThisWeek",
    "metricLabel": "本周完成日程数",
    "titleLabel": "时间利用率",
    "higherIsBetter": true,
    "region": { "id": "region-xjtlu", "name": "西交利物浦大学" },
    "weekStart": "2026-07-13T00:00:00+08:00",
    "weekEnd": "2026-07-20T00:00:00+08:00",
    "me": {
      "rank": 1,
      "value": 12,
      "displayName": "张三",
      "title": "西交利物浦大学时间利用率第一",
      "eligible": true
    },
    "leaderboard": [
      { "rank": 1, "userId": "...", "displayName": "张三", "value": 12, "isMe": true }
    ],
    "totalParticipants": 48,
    "computedAt": "2026-07-15T12:00:00+08:00",
    "fromCache": true
  }
}
```

### 1. `GET /api/community/rankings/completed-this-week`
本周完成日程数 / **时间利用率**（越高越好）。

### 2. `GET /api/community/rankings/incomplete-this-week`
本周未完成日程数 / **日程清爽度**（越少越好）。

### 3. `GET /api/community/rankings/avg-complete-duration`
平均完成时长 ms / **执行效率**（越快越好；无样本用户不入榜）。

### 4. `GET /api/community/rankings/completion-hour-mode`
习惯完成时段小时 / **早鸟指数**（越早越好；无样本不入榜）。

### 元数据 `GET /api/community/rankings/metrics`
返回四个指标的 path、标签与排序方向，便于前端配置。

### 5. `GET /api/community/rankings/top100`
一次返回本社区四个指标的 topN 用户（**默认 limit=100**，最大 100）。

| 指标 key | 称号标签 |
|----------|----------|
| `completedThisWeek` | 时间利用率 |
| `incompleteThisWeek` | 日程清爽度 |
| `avgCompleteDurationMs` | 执行效率 |
| `completionHourMode` | 早鸟指数 |

Query 同公共参数：`fresh`、`limit`、`regionId`（未传 `limit` 时为 100，不是 20）。

```json
{
  "rankings": {
    "completedThisWeek": { /* 同单榜 ranking 结构 */ },
    "incompleteThisWeek": { /* ... */ },
    "avgCompleteDurationMs": { /* ... */ },
    "completionHourMode": { /* ... */ }
  }
}
```

每个 value 与单指标接口的 `ranking` 字段形状一致（含 `me`、`leaderboard`、`titleLabel` 等）。

---

## 数据与刷新

- 排名源：`user_status`（同周 `weekStart`）∩ `users.communityRegionId`
- 落库：`community_rank_entries` + `community_rank_meta`（TTL 5 分钟，或 `?fresh=1`）
- 重算时会尽量刷新同区用户的 status
- 名次：密集排名（1,2,2,3）

---

## 快速联调

```bash
# 加入西交
PUT /api/community/me/region
{ "regionId": "region-xjtlu" }

# 四个榜
GET /api/community/rankings/completed-this-week
GET /api/community/rankings/incomplete-this-week
GET /api/community/rankings/avg-complete-duration
GET /api/community/rankings/completion-hour-mode

# 一次取四指标 top100
GET /api/community/rankings/top100
```
