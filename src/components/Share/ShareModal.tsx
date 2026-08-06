import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { createShare } from "../../services/api";
import { Copy, Check, Link } from "lucide-react";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EXPIRY_OPTIONS = [
    { labelKey: "share.expiry1Day", value: 1 },
    { labelKey: "share.expiry7Days", value: 7 },
    { labelKey: "share.expiry30Days", value: 30 },
    { labelKey: "share.neverExpire", value: 0 },
];

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(t("settings.scheduleShare"));
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [expiresInDays, setExpiresInDays] = useState(7);
    const [shareMode, setShareMode] = useState<"all" | "range">("range");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<{
        shareUrl: string;
        token: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await createShare({
                name,
                dateStart:
                    shareMode === "range" ? dateStart || undefined : undefined,
                dateEnd:
                    shareMode === "range" ? dateEnd || undefined : undefined,
                expiresInDays: expiresInDays || undefined,
            });
            setResult({ shareUrl: res.shareUrl, token: res.token });
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : t("share.createFailed"));
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result.shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    const handleClose = () => {
        setResult(null);
        setError("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={t("settings.scheduleShare")}
        >
            {!result ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <Input
                        label={t("share.name")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div>
                        <label
                            style={{
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                marginBottom: 8,
                                display: "block",
                            }}
                        >
                            {t("share.scope")}
                        </label>
                        <div style={{ display: "flex", gap: 8 }}>
                            <Button
                                variant={
                                    shareMode === "range"
                                        ? "primary"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setShareMode("range")}
                            >
                                {t("share.byDateRange")}
                            </Button>
                            <Button
                                variant={
                                    shareMode === "all" ? "primary" : "outline"
                                }
                                size="sm"
                                onClick={() => setShareMode("all")}
                            >
                                {t("share.allSchedules")}
                            </Button>
                        </div>
                    </div>

                    {shareMode === "range" && (
                        <div style={{ display: "flex", gap: 12 }}>
                            <Input
                                label={t("share.startDate")}
                                type="date"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                            />
                            <Input
                                label={t("share.endDate")}
                                type="date"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label
                            style={{
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                marginBottom: 8,
                                display: "block",
                            }}
                        >
                            {t("share.expiry")}
                        </label>
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                            }}
                        >
                            {EXPIRY_OPTIONS.map((opt) => (
                                <Button
                                    key={opt.value}
                                    variant={
                                        expiresInDays === opt.value
                                            ? "primary"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setExpiresInDays(opt.value)}
                                >
                                    {t(opt.labelKey)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <p
                            style={{
                                color: "var(--color-danger)",
                                fontSize: "0.85rem",
                                margin: 0,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        <Button variant="outline" onClick={handleClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={handleCreate} disabled={loading}>
                            {loading
                                ? t("share.creating")
                                : t("settings.generateShareLink")}
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: 8,
                            padding: 12,
                            textAlign: "center",
                        }}
                    >
                        <Link
                            size={24}
                            style={{ color: "#16a34a", marginBottom: 8 }}
                        />
                        <p
                            style={{
                                margin: "0 0 8px",
                                fontWeight: 600,
                                color: "#166534",
                            }}
                        >
                            {t("share.linkGenerated")}
                        </p>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            background: "#f8fafc",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                            padding: "10px 12px",
                        }}
                    >
                        <code
                            style={{
                                flex: 1,
                                fontSize: "0.8rem",
                                wordBreak: "break-all",
                                color: "var(--color-text-dark)",
                            }}
                        >
                            {result.shareUrl}
                        </code>
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </Button>
                    </div>

                    <Button
                        onClick={handleClose}
                        style={{ alignSelf: "center" }}
                    >
                        {t("share.done")}
                    </Button>
                </div>
            )}
        </Modal>
    );
};

export default ShareModal;
