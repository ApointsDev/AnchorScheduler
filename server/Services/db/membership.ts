// 会员 / 兑换码存储服务（MENU-001）
//
// 模型：
// - user_memberships：每行代表一个"等级权益"（tier 级别的一段有效期 startDate~endDate）。
//   - 相同等级叠加：直接顺延 endDate（兑换/购买在已有会员基础上叠加）。
//   - 跨等级：新等级的开始时间 = max(now, 当前更高等级中最晚的结束时间)，
//     即"更贵订阅优先消耗"——贵的先被使用，便宜的在贵用完后才生效。
// - membership_orders：购买订单（含状态，支持恢复购买）。
// - redeem_codes / redeem_code_redemptions：兑换码与兑换记录（防重复使用）。
import type { Database } from "sqlite";
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";
import {
  MEMBERSHIP_TIER_LIST,
  getTier,
  getTierOrNull,
  type MembershipTier,
} from "./membershipTiers.js";
import {
  MembershipInvalidArgumentError,
  RedeemCodeAlreadyUsedError,
  RedeemCodeExhaustedError,
  RedeemCodeExpiredError,
  RedeemCodeInactiveError,
  RedeemCodeNotFoundError,
} from "./membershipErrors.js";

// ── 类型 ──────────────────────────────────────────────────

export type MembershipSource =
  | "purchase"
  | "redeem"
  | "welcome_gift"
  | "admin_grant"
  | "restore";

export type OrderStatus = "pending" | "completed" | "failed" | "refunded";

export interface MembershipRow {
  id: string;
  userId: string;
  tier: string;
  startDate: string;
  endDate: string;
  source: MembershipSource;
  orderId?: string | null;
  createdAt: string;
}

/** user_memberships 表的原始行（SQLite 返回形态） */
interface MembershipRowDb {
  id: string;
  userId: string;
  tier: string;
  startDate: string;
  endDate: string;
  source: MembershipSource;
  orderId: string | null;
  createdAt: string;
}

/** membership_orders 表的原始行 */
interface MembershipOrderDb {
  id: string;
  userId: string;
  tier: string;
  days: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  provider: string;
  granted: number;
  createdAt: string;
  updatedAt: string;
}

/** redeem_codes 表的原始行 */
interface RedeemCodeDb {
  code: string;
  tier: string;
  days: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: number;
  createdAt: string;
  createdBy: string | null;
}

export interface MembershipGrantResult {
  tier: string;
  addedDays: number;
  /** 是否叠加到已有同等级权益上 */
  stacked: boolean;
  /** 叠加前的结束时间（新开权益时为 null） */
  previousEndDate: string | null;
  /** 叠加/新开后的结束时间 */
  newEndDate: string;
  membershipId: string;
}

export interface MembershipView {
  id: string;
  tier: string;
  startDate: string;
  endDate: string;
  source: MembershipSource;
  orderId?: string | null;
  /** active | upcoming | expired */
  status: "active" | "upcoming" | "expired";
  /** 剩余天数（active 才有意义） */
  remainingDays: number;
}

export interface MembershipSummary {
  /** 当前生效的最高等级（无会员则为 free） */
  effectiveTier: string;
  /** 当前生效会员的结束时间；free 为 null */
  effectiveEndDate: string | null;
  /** 当前生效会员剩余天数 */
  remainingDays: number;
  /** 是否处于付费会员状态 */
  isActive: boolean;
  memberships: MembershipView[];
  /** 依据 effectiveTier 计算的功能访问标记 */
  featureAccess: Record<string, boolean>;
}

export interface MembershipOrder {
  id: string;
  userId: string;
  tier: string;
  days: number;
  amount: number;
  currency: string;
  status: OrderStatus;
  provider: string;
  granted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RedeemCode {
  code: string;
  tier: string;
  days: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
  createdBy?: string | null;
}

export interface RedeemResult {
  code: string;
  tier: string;
  days: number;
  addedDays: number;
  previousEndDate: string | null;
  newEndDate: string;
  membership: MembershipSummary;
}

// ── 日期工具（全部使用 +08:00 上海 ISO，字符串可直接比较）──

export function addDays(iso: string, days: number): string {
  const ms = new Date(iso).getTime() + days * 86_400_000;
  return toShanghaiISO(new Date(ms));
}

function nowISO(): string {
  return toShanghaiISO();
}

function remainingDays(endDate: string, now: string): number {
  const diffMs = new Date(endDate).getTime() - new Date(now).getTime();
  return Math.max(0, Math.ceil(diffMs / 86_400_000));
}

function mapRow(row: MembershipRowDb): MembershipRow {
  return {
    id: row.id,
    userId: row.userId,
    tier: row.tier,
    startDate: row.startDate,
    endDate: row.endDate,
    source: row.source,
    orderId: row.orderId ?? null,
    createdAt: row.createdAt,
  };
}

// ── Store ─────────────────────────────────────────────────

export class MembershipStore {
  private mutationQueue: Promise<unknown> = Promise.resolve();

  constructor(private db: Database) {}

  /** 串行化会修改会员状态的写操作（grant / redeem），避免并发叠加竞态 */
  private runExclusive<T>(op: () => Promise<T>): Promise<T> {
    const result = this.mutationQueue.then(op);
    this.mutationQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  // ── 会员查询 ─────────────────────────────────────────────

  async listMemberships(userId: string): Promise<MembershipRow[]> {
    const rows = await this.db.all<MembershipRowDb[]>(
      `SELECT * FROM user_memberships WHERE userId = ? ORDER BY endDate DESC`,
      [userId],
    );
    return rows.map(mapRow);
  }

  /** 尚未用完的权益（endDate > now），无论是否已开始 */
  private async listUnexpiredMemberships(
    userId: string,
    now: string,
  ): Promise<MembershipRow[]> {
    const rows = await this.db.all<MembershipRowDb[]>(
      `SELECT * FROM user_memberships
       WHERE userId = ? AND endDate > ?
       ORDER BY endDate DESC`,
      [userId, now],
    );
    return rows.map(mapRow);
  }

  /** 当前生效的最高等级会员（startDate <= now < endDate）；无则返回 null */
  async getEffectiveMembership(
    userId: string,
  ): Promise<MembershipRow | null> {
    const now = nowISO();
    const rows = await this.db.all<MembershipRowDb[]>(
      `SELECT * FROM user_memberships
       WHERE userId = ? AND startDate <= ? AND endDate > ?
       ORDER BY endDate ASC`,
      [userId, now, now],
    );
    if (rows.length === 0) return null;
    // 取 priority 最高的行（SQLite 无窗口函数排序时可先取回再比较）
    return rows
      .map(mapRow)
      .sort((a, b) => getTier(b.tier).priority - getTier(a.tier).priority)[0];
  }

  async getMembershipSummary(userId: string): Promise<MembershipSummary> {
    const now = nowISO();
    const all = await this.listMemberships(userId);
    const effective = await this.getEffectiveMembership(userId);

    const memberships: MembershipView[] = all.map((m) => {
      let status: MembershipView["status"];
      if (m.startDate <= now && m.endDate > now) status = "active";
      else if (m.endDate > now) status = "upcoming"; // 已排队，未开始
      else status = "expired";
      return {
        id: m.id,
        tier: m.tier,
        startDate: m.startDate,
        endDate: m.endDate,
        source: m.source,
        orderId: m.orderId ?? null,
        status,
        remainingDays:
          status === "active" ? remainingDays(m.endDate, now) : 0,
      };
    });

    // 展示顺序：优先级高的在前
    memberships.sort(
      (a, b) => getTier(b.tier).priority - getTier(a.tier).priority,
    );

    const effectiveTier = effective ? effective.tier : "free";
    const tier = getTier(effectiveTier);
    const featureAccess: Record<string, boolean> = { ...tier.features };

    return {
      effectiveTier,
      effectiveEndDate: effective ? effective.endDate : null,
      remainingDays: effective ? remainingDays(effective.endDate, now) : 0,
      isActive: !!effective,
      memberships,
      featureAccess,
    };
  }

  // ── 发放 / 叠加 ─────────────────────────────────────────

  /**
   * 发放会员权益（购买 / 兑换 / 赠送 / 管理端发放）。
   *
   * 叠加与消耗规则：
   * 1. 同等级存在未用完权益 → 直接顺延 endDate（在已有会员基础上叠加）。
   * 2. 否则新建一段权益；其开始时间 = max(now, 当前更高等级中最晚的结束时间)
   *    —— 更贵的订阅先被消耗，便宜的在贵用完后才生效。
   */
  grantMembership(
    userId: string,
    tierId: string,
    days: number,
    source: MembershipSource,
    orderId?: string,
  ): Promise<MembershipGrantResult> {
    return this.runExclusive(() =>
      this.performGrant(userId, tierId, days, source, orderId),
    );
  }

  private async performGrant(
    userId: string,
    tierId: string,
    days: number,
    source: MembershipSource,
    orderId?: string,
  ): Promise<MembershipGrantResult> {
    const tier = getTier(tierId); // 未知等级抛 TierNotFoundError
    if (!Number.isFinite(days) || days <= 0) {
      throw new MembershipInvalidArgumentError(
        `Grant days must be a positive number, got: ${days}`,
      );
    }
    const now = nowISO();
    const unexpired = await this.listUnexpiredMemberships(userId, now);

    // 1) 同等级叠加
    const sameTier = unexpired.find((m) => m.tier === tier.id);
    if (sameTier) {
      const newEnd = addDays(sameTier.endDate, days);
      await this.db.run(
        `UPDATE user_memberships SET endDate = ? WHERE id = ?`,
        [newEnd, sameTier.id],
      );
      return {
        tier: tier.id,
        addedDays: days,
        stacked: true,
        previousEndDate: sameTier.endDate,
        newEndDate: newEnd,
        membershipId: sameTier.id,
      };
    }

    // 2) 新建权益：开始时间锚定在更高等级最晚结束之后（更贵优先消耗）
    const higher = unexpired.filter(
      (m) => getTier(m.tier).priority > tier.priority,
    );
    let base = now;
    if (higher.length > 0) {
      base = higher.reduce((max, m) =>
        m.endDate > max.endDate ? m : max,
      ).endDate;
    }
    const newEnd = addDays(base, days);
    const id = uuidv4();
    await this.db.run(
      `INSERT INTO user_memberships
         (id, userId, tier, startDate, endDate, source, orderId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [id, userId, tier.id, base, newEnd, source, orderId || null],
    );
    return {
      tier: tier.id,
      addedDays: days,
      stacked: false,
      previousEndDate: null,
      newEndDate: newEnd,
      membershipId: id,
    };
  }

  // ── 订单（购买 / 恢复购买）──────────────────────────────

  async createOrder(
    userId: string,
    tierId: string,
    days: number,
    amount: number,
    provider = "mock",
  ): Promise<MembershipOrder> {
    const tier = getTier(tierId);
    if (!tier.purchasable) {
      throw new MembershipInvalidArgumentError(
        `Tier "${tierId}" is not purchasable`,
      );
    }
    const order: MembershipOrder = {
      id: uuidv4(),
      userId,
      tier: tier.id,
      days,
      amount,
      currency: tier.currency,
      status: "pending",
      provider,
      granted: false,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    await this.db.run(
      `INSERT INTO membership_orders
         (id, userId, tier, days, amount, currency, status, provider, granted, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        order.id,
        order.userId,
        order.tier,
        order.days,
        order.amount,
        order.currency,
        order.status,
        order.provider,
        order.granted ? 1 : 0,
      ],
    );
    return order;
  }

  /** 标记订单完成并发放权益（购买成功流程） */
  async completeOrder(
    userId: string,
    orderId: string,
  ): Promise<{
    order: MembershipOrder;
    grant: MembershipGrantResult;
  }> {
    return this.runExclusive(async () => {
      const order = await this.getOrder(orderId);
      if (!order || order.userId !== userId) {
        throw new MembershipInvalidArgumentError("Order not found");
      }
      if (order.status === "completed") {
        // 幂等：已完成的订单直接返回
        return {
          order,
          grant: await this.getGrantForOrder(userId, order),
        };
      }
      const grant = await this.performGrant(
        userId,
        order.tier,
        order.days,
        "purchase",
        order.id,
      );
      await this.db.run(
        `UPDATE membership_orders
         SET status = 'completed', granted = 1, updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [order.id],
      );
      const updated = (await this.getOrder(order.id)) as MembershipOrder;
      return { order: updated, grant };
    });
  }

  private async getGrantForOrder(
    userId: string,
    order: MembershipOrder,
  ): Promise<MembershipGrantResult> {
    // 已授予的订单：返回对应权益的当前状态（用于恢复购买/幂等）
    const rows = await this.db.all<MembershipRowDb[]>(
      `SELECT * FROM user_memberships WHERE userId = ? AND orderId = ? ORDER BY createdAt DESC LIMIT 1`,
      [userId, order.id],
    );
    const row = rows[0];
    if (row) {
      return {
        tier: row.tier,
        addedDays: order.days,
        stacked: true,
        previousEndDate: null,
        newEndDate: row.endDate,
        membershipId: row.id,
      };
    }
    return {
      tier: order.tier,
      addedDays: order.days,
      stacked: false,
      previousEndDate: null,
      newEndDate: nowISO(),
      membershipId: "",
    };
  }

  async listOrders(userId: string): Promise<MembershipOrder[]> {
    const rows = await this.db.all<MembershipOrderDb[]>(
      `SELECT * FROM membership_orders WHERE userId = ? ORDER BY createdAt DESC`,
      [userId],
    );
    return rows.map(mapOrderRow);
  }

  async getOrder(orderId: string): Promise<MembershipOrder | null> {
    const row = await this.db.get<MembershipOrderDb>(
      `SELECT * FROM membership_orders WHERE id = ?`,
      [orderId],
    );
    return row ? mapOrderRow(row) : null;
  }

  /**
   * 恢复购买：将历史已完成但尚未授予（granted=0）的订单重新发放。
   * 正常流程下购买即授予；恢复购买用于跨设备/掉单兜底，幂等安全。
   */
  async restorePurchases(userId: string): Promise<MembershipSummary> {
    await this.runExclusive(async () => {
      const rows = await this.db.all<MembershipOrderDb[]>(
        `SELECT * FROM membership_orders
         WHERE userId = ? AND status = 'completed' AND granted = 0`,
        [userId],
      );
      for (const row of rows) {
        const order = mapOrderRow(row);
        await this.performGrant(
          userId,
          order.tier,
          order.days,
          "restore",
          order.id,
        );
        await this.db.run(
          `UPDATE membership_orders SET granted = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
          [order.id],
        );
      }
    });
    return this.getMembershipSummary(userId);
  }

  // ── 兑换码（管理端）────────────────────────────────────

  async createRedeemCode(params: {
    tier: string;
    days: number;
    code?: string;
    maxUses?: number | null;
    expiresAt?: string | null;
    createdBy?: string;
  }): Promise<RedeemCode> {
    const tier = getTier(params.tier);
    if (!Number.isFinite(params.days) || params.days <= 0) {
      throw new MembershipInvalidArgumentError(
        `Redeem code days must be a positive number`,
      );
    }
    const code = normalizeRedeemCode(params.code || generateRedeemCode());
    const existing = await this.getRedeemCode(code);
    if (existing) {
      throw new MembershipInvalidArgumentError(
        `Redeem code already exists: ${code}`,
      );
    }
    await this.db.run(
      `INSERT INTO redeem_codes
         (code, tier, days, maxUses, usedCount, expiresAt, active, createdAt, createdBy)
       VALUES (?, ?, ?, ?, 0, ?, 1, CURRENT_TIMESTAMP, ?)`,
      [
        code,
        tier.id,
        params.days,
        params.maxUses ?? null,
        params.expiresAt || null,
        params.createdBy || null,
      ],
    );
    return (await this.getRedeemCode(code)) as RedeemCode;
  }

  async listRedeemCodes(): Promise<RedeemCode[]> {
    const rows = await this.db.all<RedeemCodeDb[]>(
      `SELECT * FROM redeem_codes ORDER BY createdAt DESC`,
    );
    return rows.map(mapRedeemCode);
  }

  async getRedeemCode(code: string): Promise<RedeemCode | null> {
    const row = await this.db.get<RedeemCodeDb>(
      `SELECT * FROM redeem_codes WHERE code = ?`,
      [normalizeRedeemCode(code)],
    );
    return row ? mapRedeemCode(row) : null;
  }

  // ── 兑换码（用户兑换）──────────────────────────────────

  /** 校验但不消耗：用于兑换前实时提示 */
  async validateRedeemCode(userId: string, code: string): Promise<RedeemCode> {
    const normalized = normalizeRedeemCode(code);
    const rec = await this.getRedeemCode(normalized);
    if (!rec) throw new RedeemCodeNotFoundError(normalized);
    this.assertRedeemable(userId, rec);
    return rec;
  }

  private assertRedeemable(userId: string, rec: RedeemCode): void {
    const now = nowISO();
    if (rec.expiresAt && rec.expiresAt < now) {
      throw new RedeemCodeExpiredError(rec.code);
    }
    if (!rec.active) {
      throw new RedeemCodeInactiveError(rec.code);
    }
    if (rec.maxUses != null && rec.usedCount >= rec.maxUses) {
      throw new RedeemCodeExhaustedError(rec.code);
    }
  }

  /**
   * 兑换兑换码：
   * - 校验存在 / 未过期 / 未停用 / 未超次数；
   * - 防重复使用：同一用户对同一码仅可兑换一次（409）；
   * - 兑换成功后发放权益（叠加），并返回增加天数与新结束日期。
   */
  redeemCode(userId: string, code: string): Promise<RedeemResult> {
    return this.runExclusive(() => this.performRedeem(userId, code));
  }

  private async performRedeem(
    userId: string,
    code: string,
  ): Promise<RedeemResult> {
    const normalized = normalizeRedeemCode(code);
    const rec = await this.getRedeemCode(normalized);
    if (!rec) throw new RedeemCodeNotFoundError(normalized);

    // 防重复使用
    const already = await this.getRedemptionByUserAndCode(userId, normalized);
    if (already) throw new RedeemCodeAlreadyUsedError(normalized);

    this.assertRedeemable(userId, rec);

    const grant = await this.performGrant(
      userId,
      rec.tier,
      rec.days,
      "redeem",
    );

    // 记录兑换明细（含 previousEndDate / newEndDate 供展示）
    await this.db.run(
      `INSERT INTO redeem_code_redemptions
         (id, code, userId, tier, days, previousEndDate, newEndDate, redeemedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        uuidv4(),
        normalized,
        userId,
        rec.tier,
        rec.days,
        grant.previousEndDate,
        grant.newEndDate,
      ],
    );

    // 增加使用次数
    await this.db.run(
      `UPDATE redeem_codes SET usedCount = usedCount + 1 WHERE code = ?`,
      [normalized],
    );

    const membership = await this.getMembershipSummary(userId);
    return {
      code: normalized,
      tier: rec.tier,
      days: rec.days,
      addedDays: grant.addedDays,
      previousEndDate: grant.previousEndDate,
      newEndDate: grant.newEndDate,
      membership,
    };
  }

  async getRedemptionByUserAndCode(
    userId: string,
    code: string,
  ): Promise<{ id: string } | null> {
    const row = await this.db.get<{ id: string }>(
      `SELECT id FROM redeem_code_redemptions WHERE userId = ? AND code = ?`,
      [userId, normalizeRedeemCode(code)],
    );
    return row ? { id: row.id } : null;
  }

  /** 获取某用户某兑换码可获得的权益（用于前端展示"可获得"信息） */
  async previewRedeem(userId: string, code: string): Promise<RedeemCode> {
    return this.validateRedeemCode(userId, code);
  }

  // ── 等级/权益辅助 ───────────────────────────────────────

  /** 计算某等级可访问的功能标记 */
  static featureAccessFor(tierId: string): Record<string, boolean> {
    const tier = getTierOrNull(tierId) || getTier("free");
    return { ...tier.features };
  }

  /** 返回可购买的套餐列表 */
  static getPlans(): MembershipTier[] {
    return MEMBERSHIP_TIER_LIST.filter((t) => t.purchasable);
  }
}

// ── 映射与工具 ────────────────────────────────────────────

function mapOrderRow(row: MembershipOrderDb): MembershipOrder {
  return {
    id: row.id,
    userId: row.userId,
    tier: row.tier,
    days: row.days,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    provider: row.provider,
    granted: !!row.granted,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapRedeemCode(row: RedeemCodeDb): RedeemCode {
  return {
    code: row.code,
    tier: row.tier,
    days: row.days,
    maxUses: row.maxUses ?? null,
    usedCount: row.usedCount ?? 0,
    expiresAt: row.expiresAt || null,
    active: !!row.active,
    createdAt: row.createdAt,
    createdBy: row.createdBy || null,
  };
}

const REDEEM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 去除易混淆字符

export function generateRedeemCode(length = 12): string {
  let result = "";
  const bytes = cryptoRandomBytes(length);
  for (let i = 0; i < length; i++) {
    result += REDEEM_ALPHABET[bytes[i] % REDEEM_ALPHABET.length];
  }
  // 分组展示：XXXX-XXXX-XXXX
  return result.match(/.{1,4}/g)?.join("-") || result;
}

function cryptoRandomBytes(n: number): number[] {
  // 使用 Node crypto 生成安全随机字节
  return Array.from(randomBytes(n));
}

export function normalizeRedeemCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "").replace(/-/g, "");
}
