/**
 * 会员与兑换码（MENU-001）单元测试
 *
 * 覆盖：等级权益定义、同等级叠加、跨等级按更贵优先消耗、
 * 兑换码校验/防重复/防过期/防超额、购买订单与恢复购买。
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { MembershipStore, addDays } from "../Services/db/membership";
import { toShanghaiISO } from "../Utils/time";
import {
    RedeemCodeAlreadyUsedError,
    RedeemCodeExhaustedError,
    RedeemCodeExpiredError,
    RedeemCodeInactiveError,
    RedeemCodeNotFoundError,
    TierNotFoundError,
} from "../Services/db/membershipErrors";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

async function setup() {
    const db = await open({ filename: ":memory:", driver: SqliteDriver });
    await db.exec(`
        CREATE TABLE user_memberships (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            tier TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'purchase',
            orderId TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE membership_orders (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            tier TEXT NOT NULL,
            days INTEGER NOT NULL,
            amount REAL NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'CNY',
            status TEXT NOT NULL DEFAULT 'pending',
            provider TEXT NOT NULL DEFAULT 'mock',
            granted INTEGER NOT NULL DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE redeem_codes (
            code TEXT PRIMARY KEY,
            tier TEXT NOT NULL,
            days INTEGER NOT NULL,
            maxUses INTEGER,
            usedCount INTEGER NOT NULL DEFAULT 0,
            expiresAt DATETIME,
            active INTEGER NOT NULL DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            createdBy TEXT
        );
        CREATE TABLE redeem_code_redemptions (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            userId TEXT NOT NULL,
            tier TEXT NOT NULL,
            days INTEGER NOT NULL,
            previousEndDate DATETIME,
            newEndDate DATETIME,
            redeemedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    return { db, store: new MembershipStore(db) };
}

describe("MembershipStore", () => {
    let db: Database;
    let store: MembershipStore;

    beforeEach(async () => ({ db, store } = await setup()));
    afterEach(async () => db.close());

    // ── 等级与权益 ─────────────────────────────────────────

    it("defines free / silver / gold / platinum with increasing priority", () => {
        const tiers = MembershipStore.getPlans();
        expect(tiers.map((t) => t.id)).toEqual([
            "silver",
            "gold",
            "platinum",
        ]);
        // free 不可购买
        expect(tiers.every((t) => t.purchasable)).toBe(true);
    });

    it("defaults to free when user has no membership", async () => {
        const summary = await store.getMembershipSummary("u1");
        expect(summary.effectiveTier).toBe("free");
        expect(summary.isActive).toBe(false);
        expect(summary.remainingDays).toBe(0);
        expect(summary.memberships).toEqual([]);
        expect(summary.featureAccess.aiAssistantEnhance).toBe(false);
    });

    it("rejects unknown tier on grant", async () => {
        await expect(
            store.grantMembership("u1", "ultra", 7, "welcome_gift"),
        ).rejects.toBeInstanceOf(TierNotFoundError);
    });

    // ── 新用户 7 天银锚 ────────────────────────────────────

    it("grants welcome 7-day silver anchor to a new user", async () => {
        const grant = await store.grantMembership(
            "u1",
            "silver",
            7,
            "welcome_gift",
        );
        expect(grant.tier).toBe("silver");
        expect(grant.addedDays).toBe(7);
        expect(grant.stacked).toBe(false);
        expect(grant.previousEndDate).toBeNull();
        expect(grant.newEndDate).toBe(addDays(toShanghaiISO(), 7));

        const summary = await store.getMembershipSummary("u1");
        expect(summary.effectiveTier).toBe("silver");
        expect(summary.isActive).toBe(true);
        expect(summary.remainingDays).toBe(7);
    });

    // ── 同等级叠加 ─────────────────────────────────────────

    it("stacks same-tier grants by extending the end date", async () => {
        const first = await store.grantMembership(
            "u1",
            "silver",
            7,
            "welcome_gift",
        );
        const second = await store.grantMembership(
            "u1",
            "silver",
            30,
            "redeem",
        );
        expect(second.stacked).toBe(true);
        expect(second.previousEndDate).toBe(first.newEndDate);
        expect(second.newEndDate).toBe(addDays(first.newEndDate, 30));

        const summary = await store.getMembershipSummary("u1");
        expect(summary.memberships).toHaveLength(1);
        expect(summary.remainingDays).toBe(37);
    });

    // ── 跨等级：更贵订阅优先消耗 ───────────────────────────

    it("makes a higher-tier grant active immediately (consumed first)", async () => {
        // 已有 7 天银锚，再购买金锚 30 天
        await store.grantMembership("u1", "silver", 7, "welcome_gift");
        const gold = await store.grantMembership(
            "u1",
            "gold",
            30,
            "purchase",
        );
        expect(gold.stacked).toBe(false);
        // 金锚立即生效（startDate = now），银锚在下方并存
        const summary = await store.getMembershipSummary("u1");
        expect(summary.effectiveTier).toBe("gold");
        expect(summary.isActive).toBe(true);
        expect(summary.remainingDays).toBe(30);
        expect(summary.featureAccess.advancedStats).toBe(true);
        // 两条权益并存
        expect(summary.memberships).toHaveLength(2);
    });

    it("queues a cheaper-tier grant until the more expensive one expires", async () => {
        // 先金锚 30 天，再兑换银锚 7 天 → 银锚在金锚之后生效
        const gold = await store.grantMembership(
            "u1",
            "gold",
            30,
            "purchase",
        );
        const silver = await store.grantMembership(
            "u1",
            "silver",
            7,
            "redeem",
        );
        expect(silver.stacked).toBe(false);
        expect(silver.previousEndDate).toBeNull();
        // 银锚开始 = 金锚结束（更贵优先消耗）
        expect(silver.newEndDate).toBe(addDays(gold.newEndDate, 7));

        const summary = await store.getMembershipSummary("u1");
        expect(summary.effectiveTier).toBe("gold");
        const silverView = summary.memberships.find(
            (m) => m.tier === "silver",
        );
        expect(silverView?.status).toBe("upcoming");
        expect(silverView?.remainingDays).toBe(0);
    });

    it("stacks a cheaper redeem on its own queued tier (same tier)", async () => {
        const gold = await store.grantMembership(
            "u1",
            "gold",
            30,
            "purchase",
        );
        const silver1 = await store.grantMembership(
            "u1",
            "silver",
            7,
            "redeem",
        );
        // 银锚排到金锚之后（end = gold.end + 7）
        const silver2 = await store.grantMembership(
            "u1",
            "silver",
            7,
            "redeem",
        );
        expect(silver2.stacked).toBe(true);
        expect(silver2.newEndDate).toBe(addDays(silver1.newEndDate, 7));
        // 金锚结束时间不变
        const goldRow = await store.getEffectiveMembership("u1");
        expect(goldRow?.endDate).toBe(gold.newEndDate);
    });

    // ── 购买订单 ───────────────────────────────────────────

    it("creates and completes a purchase order, granting membership", async () => {
        const order = await store.createOrder("u1", "silver", 30, 19);
        expect(order.status).toBe("pending");
        expect(order.granted).toBe(false);

        const { order: completed, grant } = await store.completeOrder(
            "u1",
            order.id,
        );
        expect(completed.status).toBe("completed");
        expect(completed.granted).toBe(true);
        expect(grant.tier).toBe("silver");

        const summary = await store.getMembershipSummary("u1");
        expect(summary.effectiveTier).toBe("silver");
        expect(summary.remainingDays).toBe(30);

        const orders = await store.listOrders("u1");
        expect(orders).toHaveLength(1);
        expect(orders[0].status).toBe("completed");
    });

    it("is idempotent when completing the same order twice", async () => {
        const order = await store.createOrder("u1", "silver", 30, 19);
        await store.completeOrder("u1", order.id);
        await store.completeOrder("u1", order.id);
        const summary = await store.getMembershipSummary("u1");
        expect(summary.remainingDays).toBe(30); // 未重复叠加
    });

    it("restores un-granted completed orders (restore purchase)", async () => {
        // 模拟历史订单：已完成但 granted=0（掉单场景）
        await db.run(
            `INSERT INTO membership_orders
               (id, userId, tier, days, amount, status, granted)
             VALUES ('o1', 'u1', 'silver', 30, 19, 'completed', 0)`,
        );
        const summary = await store.restorePurchases("u1");
        expect(summary.effectiveTier).toBe("silver");
        expect(summary.remainingDays).toBe(30);
        const row = await db.get(
            `SELECT granted FROM membership_orders WHERE id = 'o1'`,
        );
        expect(row.granted).toBe(1);
    });

    it("rejects purchasing the free tier", async () => {
        await expect(
            store.createOrder("u1", "free", 0, 0),
        ).rejects.toThrow();
    });

    // ── 兑换码 ─────────────────────────────────────────────

    it("generates redeem codes and redeems them successfully", async () => {
        const code = await store.createRedeemCode({
            tier: "silver",
            days: 15,
            maxUses: 1,
        });
        expect(code.code).toMatch(/^[A-Z0-9-]+$/);

        const result = await store.redeemCode("u1", code.code.toLowerCase());
        expect(result.code).toBe(code.code);
        expect(result.tier).toBe("silver");
        expect(result.addedDays).toBe(15);
        expect(result.newEndDate).toBe(addDays(toShanghaiISO(), 15));
        expect(result.membership.effectiveTier).toBe("silver");
        expect(result.membership.remainingDays).toBe(15);
    });

    it("prevents the same user from reusing a code (anti-reuse)", async () => {
        const code = await store.createRedeemCode({
            tier: "silver",
            days: 15,
            maxUses: 5,
        });
        await store.redeemCode("u1", code.code);
        await expect(store.redeemCode("u1", code.code)).rejects.toBeInstanceOf(
            RedeemCodeAlreadyUsedError,
        );
    });

    it("allows different users to use the same code within maxUses", async () => {
        const code = await store.createRedeemCode({
            tier: "silver",
            days: 15,
            maxUses: 3,
        });
        await store.redeemCode("u1", code.code);
        await store.redeemCode("u2", code.code);
        await store.redeemCode("u3", code.code);
        await expect(store.redeemCode("u4", code.code)).rejects.toBeInstanceOf(
            RedeemCodeExhaustedError,
        );
        const rec = await store.getRedeemCode(code.code);
        expect(rec?.usedCount).toBe(3);
    });

    it("rejects expired / inactive / missing codes", async () => {
        const past = toShanghaiISO(
            new Date(Date.now() - 24 * 60 * 60 * 1000),
        );
        const expired = await store.createRedeemCode({
            tier: "silver",
            days: 7,
            maxUses: 1,
            expiresAt: past,
        });
        await expect(store.redeemCode("u1", expired.code)).rejects.toBeInstanceOf(
            RedeemCodeExpiredError,
        );

        const inactive = await store.createRedeemCode({
            tier: "silver",
            days: 7,
            maxUses: 1,
        });
        await db.run(`UPDATE redeem_codes SET active = 0 WHERE code = ?`, [
            inactive.code,
        ]);
        await expect(
            store.redeemCode("u1", inactive.code),
        ).rejects.toBeInstanceOf(RedeemCodeInactiveError);

        await expect(
            store.redeemCode("u1", "NOPE1234"),
        ).rejects.toBeInstanceOf(RedeemCodeNotFoundError);
    });

    it("validateRedeemCode does not consume the code", async () => {
        const code = await store.createRedeemCode({
            tier: "gold",
            days: 30,
            maxUses: 1,
        });
        const rec = await store.validateRedeemCode("u1", code.code);
        expect(rec.tier).toBe("gold");
        const after = await store.getRedeemCode(code.code);
        expect(after?.usedCount).toBe(0);
        const summary = await store.getMembershipSummary("u1");
        expect(summary.effectiveTier).toBe("free");
    });

    it("redeemed benefits stack on top of existing membership", async () => {
        // 已有 7 天银锚（新用户体验），再兑换 15 天银锚 → 22 天
        await store.grantMembership("u1", "silver", 7, "welcome_gift");
        const code = await store.createRedeemCode({
            tier: "silver",
            days: 15,
            maxUses: 1,
        });
        const result = await store.redeemCode("u1", code.code);
        expect(result.previousEndDate).toBe(
            addDays(toShanghaiISO(), 7),
        );
        expect(result.newEndDate).toBe(addDays(toShanghaiISO(), 22));
        expect(result.membership.remainingDays).toBe(22);
    });

    it("records redemption history with previous/new end dates", async () => {
        const code = await store.createRedeemCode({
            tier: "silver",
            days: 15,
            maxUses: 1,
        });
        await store.redeemCode("u1", code.code);
        const rows = await db.all(
            `SELECT * FROM redeem_code_redemptions WHERE userId = 'u1'`,
        );
        expect(rows).toHaveLength(1);
        expect(rows[0].code).toBe(code.code);
        expect(rows[0].days).toBe(15);
        expect(rows[0].newEndDate).toBe(addDays(toShanghaiISO(), 15));
    });
});
