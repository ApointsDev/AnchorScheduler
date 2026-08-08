> 父文档：[API 文档](README.md)

---

## 会员与兑换码（MENU-001）

> 全部需认证 🔒

会员模型要点：
- 等级 `free / silver / gold / platinum`（`free` 为默认且不可购买；其余可购买/兑换/赠送）。
- 相同等级叠加：直接顺延 `endDate`；跨等级时"更贵订阅优先消耗"。
- 内测阶段**购买入口默认关闭**（仅允许兑换码开通），需环境变量 `MEMBERSHIP_PURCHASE_ENABLED=true` 开启。
- 会员状态与兑换码均按用户 ID（`userId`，即 `/api/me` 返回的 `id`）关联。

### `GET /api/membership` — 当前会员状态

```
Response: MembershipSummary
```

`MembershipSummary`：

| 字段 | 类型 | 说明 |
|------|------|------|
| `effectiveTier` | string | 当前生效的最高等级（无会员为 `free`） |
| `effectiveEndDate` | string \| null | 当前生效会员结束时间；`free` 为 null |
| `remainingDays` | number | 当前生效会员剩余天数 |
| `isActive` | boolean | 是否处于付费会员状态 |
| `memberships` | MembershipView[] | 全部权益记录（含 upcoming/expired） |
| `featureAccess` | Record<string, boolean> | 依据 `effectiveTier` 计算的功能访问标记 |

`MembershipView`：`{ id, tier, startDate, endDate, source, orderId?, status, remainingDays }`
其中 `source` ∈ `purchase | redeem | welcome_gift | admin_grant | restore`，`status` ∈ `active | upcoming | expired`。

### `GET /api/membership/plans` — 套餐列表

```
Response: {
  plans: Tier[],      // 可购买的套餐（free 除外）
  tiers: Tier[],      // 全部等级（含 free）
  current: MembershipSummary,
  purchaseEnabled: boolean
}
```

`Tier`：`{ id, name, nameEn, priority, pricePerMonth, currency, durationDays, tagline, taglineEn, benefits, features, purchasable }`

### `POST /api/membership/purchase` — 购买（mock 支付）

> 需 `MEMBERSHIP_PURCHASE_ENABLED=true`，否则返回 `PURCHASE_DISABLED`（409）。

```
Body: {
  tierId: string,      // 必须为可购买等级（silver/gold/platinum）
  days?: number,       // 可选，默认 tier.durationDays
  amount?: number,     // 可选，默认 tier.pricePerMonth
  provider?: string    // 可选，默认 "mock"
}
Response: {
  order: MembershipOrder,
  grant: MembershipGrantResult,
  membership: MembershipSummary
}
```

`MembershipOrder`：`{ id, userId, tier, days, amount, currency, status, provider, granted, createdAt, updatedAt }`，`status` ∈ `pending | completed | failed | refunded`。

`MembershipGrantResult`：`{ tier, addedDays, stacked, previousEndDate, newEndDate, membershipId }`。

### `POST /api/membership/purchase/restore` — 恢复购买

```
Body: 无
Response: { membership: MembershipSummary }
```
恢复历史已完成的购买订单（将 `pending/failed` 订单重放为 `completed` 并叠加权益）。

### `GET /api/membership/orders` — 订单列表

```
Response: { orders: MembershipOrder[] }
```
按当前用户查询全部订单。

### `POST /api/membership/redeem/validate` — 兑换码校验（不消耗）

```
Body: { code: string }
Response: { code: string, tier: string, days: number }
```
仅校验兑换码有效性，不记录消耗。

### `POST /api/membership/redeem` — 兑换码兑换

```
Body: { code: string }
Response: {
  code: string,
  tier: string,
  days: number,
  addedDays: number,
  previousEndDate: string | null,
  newEndDate: string,
  membership: MembershipSummary
}
```
校验通过后立即发放权益（叠加规则见上文）。

### 错误码约定

| 错误码 | HTTP | 说明 |
|--------|------|------|
| `CODE_NOT_FOUND` | 404 | 兑换码不存在 |
| `CODE_EXPIRED` | 400 | 兑换码已过期 |
| `CODE_INACTIVE` | 400 | 兑换码未激活 |
| `CODE_EXHAUSTED` | 409 | 兑换码使用次数已用尽 |
| `CODE_ALREADY_USED` | 409 | 该兑换码已被当前用户使用过 |
| `PURCHASE_DISABLED` | 409 | 购买入口未开启（内测阶段） |
| `TIER_NOT_FOUND` | 400 | 套餐等级不存在 |
| `INVALID_ARGUMENT` | 400 | 参数错误（如缺少 code） |
| `MEMBERSHIP_ERROR` | 400 | 其他会员业务错误 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

错误响应统一为 `{ error: string, message: string }`。
