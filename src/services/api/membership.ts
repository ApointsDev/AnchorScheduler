// 会员与兑换码 API（MENU-001）
import { customFetch, getToken } from "./client";

// ── 类型 ──────────────────────────────────────────────────

export interface MembershipView {
    id: string;
    tier: string;
    startDate: string;
    endDate: string;
    source: string;
    orderId?: string | null;
    status: "active" | "upcoming" | "expired";
    remainingDays: number;
}

export interface MembershipSummary {
    effectiveTier: string;
    effectiveEndDate: string | null;
    remainingDays: number;
    isActive: boolean;
    memberships: MembershipView[];
    featureAccess: Record<string, boolean>;
}

export interface MembershipTier {
    id: string;
    name: string;
    nameEn: string;
    priority: number;
    pricePerMonth: number;
    currency: string;
    durationDays: number;
    tagline: string;
    taglineEn: string;
    benefits: string[];
    features: Record<string, boolean>;
    purchasable: boolean;
}

export interface MembershipOrder {
    id: string;
    userId: string;
    tier: string;
    days: number;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed" | "refunded";
    provider: string;
    granted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MembershipGrant {
    tier: string;
    addedDays: number;
    stacked: boolean;
    previousEndDate: string | null;
    newEndDate: string;
    membershipId: string;
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

export interface PlansResponse {
    plans: MembershipTier[];
    tiers: MembershipTier[];
    current: MembershipSummary;
    /** 内测阶段购买开关（false 时购买不可用，仅兑换码） */
    purchaseEnabled: boolean;
}

// ── API ───────────────────────────────────────────────────

const authHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
});

const requireToken = () => {
    if (!getToken()) throw new Error("用户未登录");
};

/** 获取当前会员状态 */
export const getMembership = async (): Promise<MembershipSummary> => {
    requireToken();
    const response = await customFetch("/api/membership", {
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "获取会员状态失败");
    }
    return response.json();
};

/** 获取套餐列表与当前状态 */
export const getMembershipPlans = async (): Promise<PlansResponse> => {
    requireToken();
    const response = await customFetch("/api/membership/plans", {
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "获取套餐列表失败");
    }
    return response.json();
};

/** 购买会员（mock 支付） */
export const purchaseMembership = async (params: {
    tierId: string;
    days?: number;
    amount?: number;
    provider?: string;
}): Promise<{
    order: MembershipOrder;
    grant: MembershipGrant;
    membership: MembershipSummary;
}> => {
    requireToken();
    const response = await customFetch("/api/membership/purchase", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "购买失败");
    }
    return response.json();
};

/** 恢复购买 */
export const restoreMembershipPurchase = async (): Promise<{
    membership: MembershipSummary;
}> => {
    requireToken();
    const response = await customFetch("/api/membership/purchase/restore", {
        method: "POST",
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "恢复购买失败");
    }
    return response.json();
};

/** 订单列表 */
export const getMembershipOrders = async (): Promise<{
    orders: MembershipOrder[];
}> => {
    requireToken();
    const response = await customFetch("/api/membership/orders", {
        headers: authHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "获取订单失败");
    }
    return response.json();
};

/** 校验兑换码（不消耗） */
export const validateRedeemCode = async (
    code: string,
): Promise<{ code: string; tier: string; days: number }> => {
    requireToken();
    const response = await customFetch("/api/membership/redeem/validate", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ code }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "兑换码校验失败");
    }
    return response.json();
};

/** 兑换兑换码 */
export const redeemCode = async (code: string): Promise<RedeemResult> => {
    requireToken();
    const response = await customFetch("/api/membership/redeem", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ code }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "兑换失败");
    }
    return response.json();
};
