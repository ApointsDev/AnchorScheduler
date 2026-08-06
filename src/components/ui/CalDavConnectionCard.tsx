import { useTranslation } from "react-i18next";
import { Copy, Check, Globe, User, Key, Calendar } from "lucide-react";
import { Button } from "./Button";

export interface CalDavConnectionCardProps {
    serverUrl: string;
    username: string;
    password: string;
    calendarUrl: string;
    copiedField: string | null;
    onCopy: (text: string, field: string) => void;
    onDisable?: () => void;
    disableLoading?: boolean;
    /** 停用按钮文案，默认「停用」 */
    disableLabel?: string;
}

const CalDavConnectionCard: React.FC<CalDavConnectionCardProps> = ({
    serverUrl,
    username,
    password,
    calendarUrl,
    copiedField,
    onCopy,
    onDisable,
    disableLoading = false,
    disableLabel,
}) => {
    const { t } = useTranslation();
    const effectiveDisableLabel = disableLabel ?? t("caldav.disable");
    return (
        <>
            <div className="caldav-detail-row">
                <div className="caldav-detail-icon">
                    <Globe size={14} />
                </div>
                <div className="caldav-detail-body">
                    <span className="caldav-detail-label">
                        {t("caldav.serverUrl")}
                    </span>
                    <code className="caldav-detail-value">{serverUrl}</code>
                </div>
                <button
                    className="conn-copy-btn"
                    onClick={() => onCopy(serverUrl, "url")}
                    title={t("common.copy")}
                    type="button"
                >
                    {copiedField === "url" ? (
                        <Check size={14} />
                    ) : (
                        <Copy size={14} />
                    )}
                </button>
            </div>

            <div className="caldav-detail-row">
                <div className="caldav-detail-icon">
                    <User size={14} />
                </div>
                <div className="caldav-detail-body">
                    <span className="caldav-detail-label">
                        {t("caldav.username")}
                    </span>
                    <code className="caldav-detail-value">
                        {username || "—"}
                    </code>
                </div>
                <button
                    className="conn-copy-btn"
                    onClick={() => onCopy(username || "", "username")}
                    title={t("common.copy")}
                    type="button"
                >
                    {copiedField === "username" ? (
                        <Check size={14} />
                    ) : (
                        <Copy size={14} />
                    )}
                </button>
            </div>

            <div className="caldav-detail-row">
                <div className="caldav-detail-icon">
                    <Key size={14} />
                </div>
                <div className="caldav-detail-body">
                    <span className="caldav-detail-label">
                        {t("caldav.password")}
                    </span>
                    <code className="caldav-detail-value caldav-detail-password">
                        {password ? "••••••••••••" : "—"}
                    </code>
                </div>
                <button
                    className="conn-copy-btn"
                    onClick={() => onCopy(password || "", "password")}
                    title={t("caldav.copyPassword")}
                    type="button"
                >
                    {copiedField === "password" ? (
                        <Check size={14} />
                    ) : (
                        <Copy size={14} />
                    )}
                </button>
            </div>

            <div className="caldav-detail-row">
                <div className="caldav-detail-icon">
                    <Calendar size={14} />
                </div>
                <div className="caldav-detail-body">
                    <span className="caldav-detail-label">
                        {t("caldav.calendarUrl")}
                    </span>
                    <code className="caldav-detail-value">
                        {calendarUrl || "—"}
                    </code>
                </div>
                <button
                    className="conn-copy-btn"
                    onClick={() => onCopy(calendarUrl || "", "calendar")}
                    title={t("common.copy")}
                    type="button"
                >
                    {copiedField === "calendar" ? (
                        <Check size={14} />
                    ) : (
                        <Copy size={14} />
                    )}
                </button>
            </div>

            {onDisable && (
                <div className="caldav-actions">
                    <Button
                        onClick={onDisable}
                        disabled={disableLoading}
                        variant="danger"
                        size="sm"
                    >
                        {disableLoading
                            ? t("caldav.disabling")
                            : effectiveDisableLabel}
                    </Button>
                </div>
            )}
        </>
    );
};

export default CalDavConnectionCard;
