import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
    Crown,
    Gift,
    Ticket,
    Check,
    RefreshCw,
    CalendarClock,
    Sparkles,
    X,
} from "lucide-react";
import {
    getMembershipPlans,
    purchaseMembership,
    restoreMembershipPurchase,
    getMembershipOrders,
    validateRedeemCode,
    redeemCode as redeemCodeApi,
    type MembershipSummary,
    type MembershipTier,
    type MembershipOrder,
    type PlansResponse,
} from "../../services/api";
import "../../styles/Membership.css";

/** 兑换码展示：每 4 位一组（去除非字母数字后格式化） */
function formatCodeInput(raw: string): string {
    const clean = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12);
    return clean.match(/.{1,4}/g)?.join("-") || clean;
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return "-";
    return new Date(iso).toLocaleString();
}

const MembershipPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language?.startsWith("en") ? "en" : "zh";

    const [plans, setPlans] = useState<PlansResponse | null>(null);
    const [membership, setMembership] = useState<MembershipSummary | null>(
        null,
    );
    const [orders, setOrders] = useState<MembershipOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 购买
    const [purchasingTier, setPurchasingTier] =
        useState<MembershipTier | null>(null);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [resultModal, setResultModal] = useState<{
        title: string;
        message: string;
        isError: boolean;
    } | null>(null);

    // 兑换码
    const [codeInput, setCodeInput] = useState("");
    const [redeemLoading, setRedeemLoading] = useState(false);
    const [redeemError, setRedeemError] = useState("");
    const [redeemSuccess, setRedeemSuccess] = useState<{
        addedDays: number;
        newEndDate: string;
        tier: string;
    } | null>(null);

    const applyMembership = useCallback((m: MembershipSummary) => {
        setMembership(m);
        setLoading(false);
    }, []);

    const loadAll = useCallback(async () => {
        try {
            const [p, o] = await Promise.all([
                getMembershipPlans(),
                getMembershipOrders(),
            ]);
            setPlans(p);
            applyMembership(p.current);
            setOrders(o.orders);
        } catch (e: unknown) {
            setError((e as Error).message || "加载失败");
            setLoading(false);
        }
    }, [applyMembership]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // ── 购买 ─────────────────────────────────────────────
    const confirmPurchase = async () => {
        if (!purchasingTier) return;
        setPurchaseLoading(true);
        setError("");
        try {
            const result = await purchaseMembership({
                tierId: purchasingTier.id,
            });
            applyMembership(result.membership);
            const o = await getMembershipOrders();
            setOrders(o.orders);
            setResultModal({
                title: t("membership.purchaseSuccess"),
                message: `${lang === "en" ? purchasingTier.nameEn : purchasingTier.name} · ${result.grant.addedDays} ${t("membership.days")}`,
                isError: false,
            });
            setPurchasingTier(null);
        } catch (e: unknown) {
            setResultModal({
                title: t("membership.purchaseFailed"),
                message: (e as Error).message,
                isError: true,
            });
        } finally {
            setPurchaseLoading(false);
        }
    };

    // ── 恢复购买 ─────────────────────────────────────────
    const handleRestore = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await restoreMembershipPurchase();
            applyMembership(result.membership);
            const o = await getMembershipOrders();
            setOrders(o.orders);
            setResultModal({
                title: t("membership.restoreSuccess"),
                message: t("membership.restoreDone"),
                isError: false,
            });
        } catch (e: unknown) {
            setError((e as Error).message);
            setResultModal({
                title: t("membership.restoreFailed"),
                message: (e as Error).message,
                isError: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // ── 兑换码 ───────────────────────────────────────────
    const handleValidate = async () => {
        setRedeemError("");
        setRedeemSuccess(null);
        if (!codeInput.trim()) {
            setRedeemError(t("membership.codeRequired"));
            return;
        }
        setRedeemLoading(true);
        try {
            const info = await validateRedeemCode(codeInput);
            setRedeemSuccess(null);
            // 校验通过提示在输入框下方显示
            setRedeemError(
                `${t("membership.codeValid")}：${tierName(info.tier)} +${info.days} ${t("membership.days")}`,
            );
        } catch (e: unknown) {
            setRedeemError((e as Error).message);
        } finally {
            setRedeemLoading(false);
        }
    };

    const handleRedeem = async () => {
        setRedeemError("");
        setRedeemSuccess(null);
        if (!codeInput.trim()) {
            setRedeemError(t("membership.codeRequired"));
            return;
        }
        setRedeemLoading(true);
        try {
            const result = await redeemCodeApi(codeInput);
            applyMembership(result.membership);
            setCodeInput("");
            setRedeemSuccess({
                addedDays: result.addedDays,
                newEndDate: result.newEndDate,
                tier: result.tier,
            });
        } catch (e: unknown) {
            setRedeemError((e as Error).message);
        } finally {
            setRedeemLoading(false);
        }
    };

    const tierName = (id: string): string => {
        const tier = plans?.tiers.find((x) => x.id === id);
        if (!tier) return id;
        return lang === "en" ? tier.nameEn : tier.name;
    };

    if (loading) {
        return (
            <div className="membership-page loading-state">
                <LoadingSpinner />
            </div>
        );
    }

    const currentTier = plans?.tiers.find(
        (x) => x.id === membership?.effectiveTier,
    );
    const featureKeys = membership
        ? Object.keys(membership.featureAccess).filter(
              (k) => membership.featureAccess[k],
          )
        : [];

    return (
        <div className="membership-page">
            {error && (
                <div className="error-message" style={{ marginBottom: 16 }}>
                    {error}
                </div>
            )}

            {/* ── 当前会员状态 ── */}
            <Card className="membership-current-card">
                <CardHeader>
                    <CardTitle className="membership-current-title">
                        <Crown size={20} />
                        {t("membership.currentStatus")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="membership-current-body">
                        <div className="membership-tier-badge">
                            <span className="membership-tier-icon">
                                <Crown size={28} />
                            </span>
                            <div>
                                <div className="membership-tier-name">
                                    {currentTier
                                        ? lang === "en"
                                            ? currentTier.nameEn
                                            : currentTier.name
                                        : t("membership.freeTier")}
                                </div>
                                <div className="membership-tier-tagline">
                                    {currentTier
                                        ? lang === "en"
                                            ? currentTier.taglineEn
                                            : currentTier.tagline
                                        : ""}
                                </div>
                            </div>
                        </div>
                        <div className="membership-current-meta">
                            <div className="membership-meta-item">
                                <span className="membership-meta-label">
                                    {t("membership.endDate")}
                                </span>
                                <span className="membership-meta-value">
                                    {membership?.isActive
                                        ? formatDate(membership.effectiveEndDate)
                                        : t("membership.noActive")}
                                </span>
                            </div>
                            <div className="membership-meta-item">
                                <span className="membership-meta-label">
                                    {t("membership.remainingDays")}
                                </span>
                                <span className="membership-meta-value">
                                    {membership?.isActive
                                        ? `${membership.remainingDays} ${t("membership.days")}`
                                        : "0"}
                                </span>
                            </div>
                        </div>
                        {featureKeys.length > 0 && (
                            <div className="membership-feature-list">
                                {featureKeys.map((k) => (
                                    <span
                                        key={k}
                                        className="membership-feature-badge"
                                    >
                                        <Check size={12} /> {t(`membership.features.${k}`)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="membership-current-actions">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRestore}
                            disabled={loading}
                        >
                            <RefreshCw size={16} />
                            {t("membership.restorePurchase")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ── 兑换码 ── */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Ticket size={20} />
                        {t("membership.redeemCode")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="membership-redeem-row">
                        <Input
                            placeholder={t("membership.codePlaceholder")}
                            value={codeInput}
                            onChange={(e) =>
                                setCodeInput(formatCodeInput(e.target.value))
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleRedeem();
                            }}
                            style={{ flex: 1 }}
                        />
                        <Button
                            variant="outline"
                            onClick={handleValidate}
                            disabled={redeemLoading || !codeInput.trim()}
                        >
                            <Sparkles size={16} />
                            {t("membership.validate")}
                        </Button>
                        <Button
                            onClick={handleRedeem}
                            disabled={redeemLoading || !codeInput.trim()}
                        >
                            <Gift size={16} />
                            {t("membership.redeem")}
                        </Button>
                    </div>
                    {redeemError && (
                        <div className="membership-redeem-feedback">
                            {redeemError.includes(
                                t("membership.codeValid"),
                            ) ? (
                                <span className="membership-valid-hint">
                                    <Check size={14} /> {redeemError}
                                </span>
                            ) : (
                                <span className="membership-error-hint">
                                    <X size={14} /> {redeemError}
                                </span>
                            )}
                        </div>
                    )}
                    {redeemSuccess && (
                        <div className="membership-redeem-success">
                            <Gift size={18} />
                            <div>
                                <div className="membership-redeem-success-title">
                                    {t("membership.redeemSuccess")} ✨
                                </div>
                                <div className="membership-redeem-success-detail">
                                    {t("membership.redeemDetail", {
                                        tier: tierName(redeemSuccess.tier),
                                        days: redeemSuccess.addedDays,
                                    })}
                                    <br />
                                    <CalendarClock size={14} />
                                    {t("membership.newEndDate")}：
                                    {formatDate(redeemSuccess.newEndDate)}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── 套餐 ── */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Crown size={20} />
                        {t("membership.plans")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="membership-plans-grid">
                        {plans?.plans.map((tier) => (
                            <div
                                key={tier.id}
                                className={`membership-plan-card ${
                                    membership?.effectiveTier === tier.id
                                        ? "membership-plan-current"
                                        : ""
                                }`}
                            >
                                <div className="membership-plan-name">
                                    {lang === "en" ? tier.nameEn : tier.name}
                                </div>
                                <div className="membership-plan-tagline">
                                    {lang === "en"
                                        ? tier.taglineEn
                                        : tier.tagline}
                                </div>
                                <div className="membership-plan-price">
                                    <span className="membership-plan-price-value">
                                        ¥{tier.pricePerMonth}
                                    </span>
                                    <span className="membership-plan-price-period">
                                        / {t("membership.perMonth")}
                                    </span>
                                </div>
                                <ul className="membership-plan-benefits">
                                    {tier.benefits.map((b, i) => (
                                        <li key={i}>
                                            <Check size={14} />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="membership-plan-buy"
                                    onClick={() => setPurchasingTier(tier)}
                                >
                                    {t("membership.buy")}
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ── 订单 ── */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <CalendarClock size={20} />
                        {t("membership.orders")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <p className="membership-empty">{t("membership.noOrders")}</p>
                    ) : (
                        <table className="membership-orders-table">
                            <thead>
                                <tr>
                                    <th>{t("membership.orderTime")}</th>
                                    <th>{t("membership.orderTier")}</th>
                                    <th>{t("membership.orderDays")}</th>
                                    <th>{t("membership.orderAmount")}</th>
                                    <th>{t("membership.orderStatus")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td>{formatDate(o.createdAt)}</td>
                                        <td>{tierName(o.tier)}</td>
                                        <td>{o.days}</td>
                                        <td>
                                            {o.currency} {o.amount}
                                        </td>
                                        <td>
                                            <span
                                                className={`membership-order-status membership-order-${o.status}`}
                                            >
                                                {t(
                                                    `membership.orderStatus.${o.status}`,
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            {/* ── 购买确认弹窗 ── */}
            <Modal
                isOpen={!!purchasingTier}
                onClose={() => setPurchasingTier(null)}
                title={t("membership.purchaseConfirm")}
            >
                {purchasingTier && (
                    <>
                        <p style={{ marginBottom: 16 }}>
                            {t("membership.purchaseConfirmDesc", {
                                tier: lang === "en"
                                    ? purchasingTier.nameEn
                                    : purchasingTier.name,
                                price: purchasingTier.pricePerMonth,
                            })}
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 8,
                            }}
                        >
                            <Button
                                variant="outline"
                                onClick={() => setPurchasingTier(null)}
                            >
                                {t("membership.cancel")}
                            </Button>
                            <Button
                                onClick={confirmPurchase}
                                disabled={purchaseLoading}
                            >
                                {purchaseLoading
                                    ? t("membership.processing")
                                    : t("membership.confirm")}
                            </Button>
                        </div>
                    </>
                )}
            </Modal>

            {/* ── 结果弹窗 ── */}
            <Modal
                isOpen={!!resultModal}
                onClose={() => setResultModal(null)}
                title={resultModal?.title || ""}
            >
                {resultModal && (
                    <>
                        <p
                            className={
                                resultModal.isError
                                    ? "membership-error-hint"
                                    : "membership-valid-hint"
                            }
                        >
                            {resultModal.message}
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 16,
                            }}
                        >
                            <Button onClick={() => setResultModal(null)}>
                                {t("membership.close")}
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default MembershipPage;
