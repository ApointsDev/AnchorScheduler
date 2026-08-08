/**
 * RedeemCodePanel - 管理员兑换码发放面板（MENU-001）
 * 功能：批量生成兑换码、查看兑换码列表、直接为用户发放会员权益
 */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    listAdminRedeemCodes,
    createAdminRedeemCodes,
    grantAdminMembership,
    type AdminRedeemCode,
} from "../../services/adminApi";
import LoadingSpinner from "../ui/LoadingSpinner";

const TIER_OPTIONS = [
    { id: "silver" },
    { id: "gold" },
    { id: "platinum" },
];

function formatDate(iso: string | null | undefined): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString();
}

export default function RedeemCodePanel() {
    const { t } = useTranslation();

    const tierName = (id: string): string => {
        const tier = TIER_OPTIONS.find((x) => x.id === id);
        return tier ? t(`admin.tierNames.${tier.id}`) : id;
    };

    const [codes, setCodes] = useState<AdminRedeemCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 生成表单
    const [tier, setTier] = useState("silver");
    const [days, setDays] = useState("30");
    const [count, setCount] = useState("1");
    const [maxUses, setMaxUses] = useState("1");
    const [expiresAt, setExpiresAt] = useState("");
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState<AdminRedeemCode[]>([]);

    // 直接发放表单
    const [grantUserId, setGrantUserId] = useState("");
    const [grantTier, setGrantTier] = useState("silver");
    const [grantDays, setGrantDays] = useState("30");
    const [granting, setGranting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            setCodes(await listAdminRedeemCodes());
        } catch (e: any) {
            setError(e.message || t("admin.loadFailed"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        load();
    }, [load]);

    const handleGenerate = async () => {
        setError("");
        setSuccess("");
        setGenerated([]);
        const daysNum = parseInt(days, 10) || 30;
        const countNum = Math.max(1, Math.min(50, parseInt(count, 10) || 1));
        const maxUsesNum = maxUses.trim()
            ? Math.max(1, parseInt(maxUses, 10) || 1)
            : 1;
        setGenerating(true);
        try {
            const created = await createAdminRedeemCodes({
                tier,
                days: daysNum,
                count: countNum,
                maxUses: maxUsesNum,
                expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
            });
            setGenerated(created);
            setSuccess(t("admin.redeemCodesGenerated", { count: created.length }));
            await load();
        } catch (e: any) {
            setError(e.message || t("admin.createFailed"));
        } finally {
            setGenerating(false);
        }
    };

    const handleGrant = async () => {
        setError("");
        setSuccess("");
        if (!grantUserId.trim()) {
            setError(t("admin.grantUserIdRequired"));
            return;
        }
        setGranting(true);
        try {
            await grantAdminMembership({
                userId: grantUserId.trim(),
                tier: grantTier,
                days: parseInt(grantDays, 10) || 30,
            });
            setSuccess(t("admin.grantSuccess"));
            setGrantUserId("");
        } catch (e: any) {
            setError(e.message || t("admin.grantFailed"));
        } finally {
            setGranting(false);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard
            .writeText(code)
            .then(() => setSuccess(t("admin.copied", { code })))
            .catch(() => {});
    };

    return (
        <div className="redeem-panel">
            {error && <div className="admin-error">{error}</div>}
            {success && <div className="admin-success">{success}</div>}

            {/* ── 生成兑换码 ── */}
            <div className="redeem-generate-card">
                <h3 className="redeem-card-title">
                    {t("admin.generateRedeemCodes")}
                </h3>
                <div className="redeem-form-grid">
                    <label className="redeem-field">
                        <span>{t("admin.redeemTier")}</span>
                        <select
                            className="admin-search"
                            value={tier}
                            onChange={(e) => setTier(e.target.value)}
                        >
                            {TIER_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {tierName(opt.id)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="redeem-field">
                        <span>{t("admin.redeemDays")}</span>
                        <input
                            className="admin-search"
                            type="number"
                            min={1}
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                        />
                    </label>
                    <label className="redeem-field">
                        <span>{t("admin.redeemCount")}</span>
                        <input
                            className="admin-search"
                            type="number"
                            min={1}
                            max={50}
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                        />
                    </label>
                    <label className="redeem-field">
                        <span>{t("admin.redeemMaxUses")}</span>
                        <input
                            className="admin-search"
                            type="number"
                            min={1}
                            value={maxUses}
                            onChange={(e) => setMaxUses(e.target.value)}
                        />
                    </label>
                    <label className="redeem-field">
                        <span>{t("admin.redeemExpiresAt")}</span>
                        <input
                            className="admin-search"
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </label>
                    <div className="redeem-field redeem-field-actions">
                        <button
                            className="admin-btn admin-btn-success"
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            {generating
                                ? t("admin.creating")
                                : t("admin.generateRedeemCodes")}
                        </button>
                    </div>
                </div>
                {generated.length > 0 && (
                    <div className="redeem-generated-list">
                        <div className="redeem-generated-title">
                            {t("admin.generatedCodes")}
                        </div>
                        <div className="redeem-generated-codes">
                            {generated.map((c) => (
                                <button
                                    key={c.code}
                                    className="redeem-generated-code"
                                    title={t("admin.clickToCopy")}
                                    onClick={() => copyCode(c.code)}
                                >
                                    {c.code}
                                </button>
                            ))}
                        </div>
                        <div className="redeem-generated-hint">
                            {t("admin.clickToCopyHint")}
                        </div>
                    </div>
                )}
            </div>

            {/* ── 直接发放 ── */}
            <div className="redeem-generate-card">
                <h3 className="redeem-card-title">{t("admin.grantMembership")}</h3>
                <div className="redeem-form-grid">
                    <label className="redeem-field">
                        <span>{t("admin.grantUserId")}</span>
                        <input
                            className="admin-search"
                            type="text"
                            value={grantUserId}
                            onChange={(e) => setGrantUserId(e.target.value)}
                            placeholder={t("admin.grantUserIdPlaceholder")}
                        />
                    </label>
                    <label className="redeem-field">
                        <span>{t("admin.redeemTier")}</span>
                        <select
                            className="admin-search"
                            value={grantTier}
                            onChange={(e) => setGrantTier(e.target.value)}
                        >
                            {TIER_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {tierName(opt.id)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="redeem-field">
                        <span>{t("admin.redeemDays")}</span>
                        <input
                            className="admin-search"
                            type="number"
                            min={1}
                            value={grantDays}
                            onChange={(e) => setGrantDays(e.target.value)}
                        />
                    </label>
                    <div className="redeem-field redeem-field-actions">
                        <button
                            className="admin-btn admin-btn-success"
                            onClick={handleGrant}
                            disabled={granting}
                        >
                            {granting ? t("admin.creating") : t("admin.grantMembership")}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── 兑换码列表 ── */}
            <div className="redeem-generate-card">
                <h3 className="redeem-card-title">{t("admin.redeemCodeList")}</h3>
                {loading ? (
                    <LoadingSpinner />
                ) : codes.length === 0 ? (
                    <div className="admin-empty">{t("admin.noRedeemCodes")}</div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table redeem-code-table">
                            <thead>
                                <tr>
                                    <th>{t("admin.redeemCode")}</th>
                                    <th>{t("admin.redeemTier")}</th>
                                    <th>{t("admin.redeemDays")}</th>
                                    <th>{t("admin.redeemUsed")}</th>
                                    <th>{t("admin.redeemExpiresAt")}</th>
                                    <th>{t("admin.redeemStatus")}</th>
                                    <th>{t("admin.redeemCreatedAt")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {codes.map((c) => (
                                    <tr key={c.code}>
                                        <td>
                                            <button
                                                className="redeem-code-cell"
                                                title={t("admin.clickToCopy")}
                                                onClick={() => copyCode(c.code)}
                                            >
                                                {c.code}
                                            </button>
                                        </td>
                                        <td>{tierName(c.tier)}</td>
                                        <td>{c.days}</td>
                                        <td>
                                            {c.usedCount}
                                            {c.maxUses != null
                                                ? ` / ${c.maxUses}`
                                                : ""}
                                        </td>
                                        <td>{formatDate(c.expiresAt)}</td>
                                        <td>
                                            {c.active
                                                ? t("admin.redeemActive")
                                                : t("admin.redeemInactive")}
                                        </td>
                                        <td>{formatDate(c.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
