// 会员与兑换码 API（MENU-001）
// 挂载于 /api → 路径 /api/membership、/api/membership/plans、/api/membership/purchase 等
// 文档：docs/api/membership.md
import express from "express";
import type { Request, Response, RequestHandler } from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { getTier, MEMBERSHIP_TIERS } from "../Services/db/membershipTiers.js";
import {
    MembershipError,
    MembershipInvalidArgumentError,
    RedeemCodeAlreadyUsedError,
    RedeemCodeExhaustedError,
    RedeemCodeExpiredError,
    RedeemCodeInactiveError,
    RedeemCodeNotFoundError,
    TierNotFoundError,
} from "../Services/db/membershipErrors.js";
import type { AuthMiddleware } from "./apiRoutes.js";

/** 已认证请求（authenticateToken 已填充 req.user） */
interface AuthedRequest extends Request {
    user: { id: string };
}

function mapMembershipError(
    res: Response,
    e: unknown,
    fallbackMessage = "Membership operation failed",
): void {
    if (e instanceof RedeemCodeNotFoundError) {
        res.status(404).json({ error: "CODE_NOT_FOUND", message: e.message });
        return;
    }
    if (e instanceof RedeemCodeExpiredError) {
        res.status(400).json({ error: "CODE_EXPIRED", message: e.message });
        return;
    }
    if (e instanceof RedeemCodeInactiveError) {
        res.status(400).json({ error: "CODE_INACTIVE", message: e.message });
        return;
    }
    if (e instanceof RedeemCodeExhaustedError) {
        res.status(409).json({ error: "CODE_EXHAUSTED", message: e.message });
        return;
    }
    if (e instanceof RedeemCodeAlreadyUsedError) {
        res.status(409).json({
            error: "CODE_ALREADY_USED",
            message: e.message,
        });
        return;
    }
    if (e instanceof TierNotFoundError) {
        res.status(400).json({ error: "TIER_NOT_FOUND", message: e.message });
        return;
    }
    if (e instanceof MembershipInvalidArgumentError) {
        res.status(400).json({ error: "INVALID_ARGUMENT", message: e.message });
        return;
    }
    if (e instanceof MembershipError) {
        res.status(400).json({ error: "MEMBERSHIP_ERROR", message: e.message });
        return;
    }
    logger.error(fallbackMessage, e);
    res.status(500).json({ error: "INTERNAL_ERROR", message: fallbackMessage });
}

export function initializeMembershipRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    // ── 当前会员状态 ───────────────────────────────────────
    // GET /api/membership → { effectiveTier, effectiveEndDate, remainingDays, isActive, memberships, featureAccess }
    const handleGetMembership: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const summary = await dbService.getMembershipSummary(userId);
            res.status(200).json(summary);
        } catch (e: unknown) {
            mapMembershipError(res, e, "Failed to get membership");
        }
    };
    router.get("/membership", authenticateToken, handleGetMembership);

    // ── 套餐列表（含免费版权益说明）───────────────────────
    // GET /api/membership/plans → { plans, tiers }
    const handleGetPlans: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const summary = await dbService.getMembershipSummary(userId);
            const tiers = Object.values(MEMBERSHIP_TIERS);
            res.status(200).json({
                plans: tiers.filter((t: { purchasable: boolean }) => t.purchasable),
                tiers,
                current: summary,
            });
        } catch (e: unknown) {
            mapMembershipError(res, e, "Failed to get membership plans");
        }
    };
    router.get("/membership/plans", authenticateToken, handleGetPlans);

    // ── 购买 ───────────────────────────────────────────────
    // POST /api/membership/purchase { tierId, days?, amount?, provider? }
    // → 创建订单并完成（mock 支付），返回 { order, grant, membership }
    const handlePurchase: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const body = (req.body || {}) as {
                tierId?: string;
                days?: number;
                amount?: number;
                provider?: string;
            };
            const tierId = String(body.tierId || "");
            const tier = getTier(tierId);
            if (!tier.purchasable) {
                throw new MembershipInvalidArgumentError(
                    `Tier "${tierId}" is not purchasable`,
                );
            }
            const days = body.days
                ? Math.floor(Number(body.days))
                : tier.durationDays;
            const amount =
                body.amount != null ? Number(body.amount) : tier.pricePerMonth;

            const order = await dbService.createMembershipOrder(
                userId,
                tierId,
                days,
                amount,
                body.provider || "mock",
            );
            const result = await dbService.completeMembershipOrder(
                userId,
                order.id,
            );
            const membership = await dbService.getMembershipSummary(userId);
            res.status(200).json({ order, grant: result.grant, membership });
        } catch (e: unknown) {
            mapMembershipError(res, e, "Failed to purchase membership");
        }
    };
    router.post("/membership/purchase", authenticateToken, handlePurchase);

    // ── 恢复购买 ───────────────────────────────────────────
    // POST /api/membership/purchase/restore → { membership }
    const handleRestorePurchase: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const membership = await dbService.restoreMembershipPurchases(
                userId,
            );
            res.status(200).json({ membership });
        } catch (e: unknown) {
            mapMembershipError(res, e, "Failed to restore purchase");
        }
    };
    router.post(
        "/membership/purchase/restore",
        authenticateToken,
        handleRestorePurchase,
    );

    // ── 订单状态 ───────────────────────────────────────────
    // GET /api/membership/orders → { orders }
    const handleListOrders: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const orders = await dbService.listMembershipOrders(userId);
            res.status(200).json({ orders });
        } catch (e: unknown) {
            mapMembershipError(res, e, "Failed to list membership orders");
        }
    };
    router.get("/membership/orders", authenticateToken, handleListOrders);

    // ── 兑换码：校验（不消耗）─────────────────────────────
    // POST /api/membership/redeem/validate { code } → { code, tier, days }
    const handleValidateCode: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const code = String((req.body || {}).code || "").trim();
            if (!code) {
                throw new MembershipInvalidArgumentError("code is required");
            }
            const rec = await dbService.validateRedeemCode(userId, code);
            res.status(200).json({
                code: rec.code,
                tier: rec.tier,
                days: rec.days,
            });
        } catch (e: unknown) {
            mapMembershipError(res, e, "Failed to validate redeem code");
        }
    };
    router.post(
        "/membership/redeem/validate",
        authenticateToken,
        handleValidateCode,
    );

    // ── 兑换码：兑换 ───────────────────────────────────────
    // POST /api/membership/redeem { code }
    // → { code, tier, days, addedDays, previousEndDate, newEndDate, membership }
    const handleRedeem: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const code = String((req.body || {}).code || "").trim();
            if (!code) {
                throw new MembershipInvalidArgumentError("code is required");
            }
            const result = await dbService.redeemCode(userId, code);
            res.status(200).json(result);
        } catch (e: unknown) {
            mapMembershipError(res, e, "Failed to redeem code");
        }
    };
    router.post("/membership/redeem", authenticateToken, handleRedeem);

    return router;
}
