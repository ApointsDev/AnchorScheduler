import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getBreakpoint, isBelow } from "../utils/breakpoints";
import {
    startMicrosoftAuth,
    unbindExchange,
    bindSmtp,
    unbindSmtp,
    removeToken,
    getToken,
    saveEbridgeTimetableUrl,
    importEbridgeTimetableHash,
    startExchangeForward,
    checkExchangeForward,
    cancelExchangeForward,
    getMicrosoftTodoStatus,
    getEbridgeStatus,
    syncTimetable,
    deleteTimetableTasks,
    configureCalDav,
    getCalDavStatus,
    syncCalDav,
    unbindCalDav,
    getCalDavServerStatus,
    enableCalDavServer,
    disableCalDavServer,
    type MicrosoftTodoStatus,
    type EbridgeStatus,
    type CalDavStatus,
    type CalDavSyncResult,
    type CalDavServerStatus,
    setAutoSchedulePromotions as setAutoSchedulePromotionsApi,
    setStripReplyPrefix as setStripReplyPrefixApi,
    getUserSettings,
    getMembership,
    type MembershipSummary,
} from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import Switch from "./ui/Switch";
import { Input } from "./ui/Input";
import CalDavConnectionCard from "./ui/CalDavConnectionCard";
import { Modal } from "./ui/Modal";
import AllSchedule from "./Schedule/AllSchedule";
import TodaySchedule from "./Schedule/TodaySchedule";
import SearchTasks from "./Schedule/SearchTasks";
import ScheduleQueue from "./Schedule/ScheduleQueue";
import LogViewer from "./Logs/LogViewer";
import AIChat from "./AIChat/AIChat";
import MyMail from "./MyMail/MyMail";
import ShareModal from "./Share/ShareModal";
import LoadingSpinner from "./ui/LoadingSpinner";
import MembershipPage from "./Membership/MembershipPage";
import FeedbackModal from "./FeedbackModal";
import { MobileActionBarProvider } from "./ui/MobileActionBar";
import { useWeek } from "../context/WeekContext";
import { useTheme } from "../utils/useTheme";
import {
    LayoutDashboard,
    Calendar,
    ListTodo,
    FileText,
    LogOut,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
    Search,
    RefreshCw,
    Copy,
    Check,
    Trash2,
    Download,
    Mail,
    Share2,
    Crown,
    Loader2,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import "../styles/Dashboard.css";
import logo from "../assets/anchorcat.svg";

interface DashboardProps {
    onLogout: () => void;
    view?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, view }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const md = getBreakpoint("md");
        const lg = getBreakpoint("lg");
        const isMobileView = window.innerWidth < md;
        return !isMobileView && window.innerWidth < lg;
    });
    const [isMobile, setIsMobile] = useState(() => isBelow("md"));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [email] = useState(localStorage.getItem("user_email") || "");
    const [XJTLUaccount, setXJTLUaccount] = useState(
        localStorage.getItem("user_XJTLUaccount") || "",
    );
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [msTodoStatus, setMsTodoStatus] =
        useState<MicrosoftTodoStatus | null>(null);
    const [ebridgeStatus, setEbridgeStatus] = useState<EbridgeStatus | null>(
        null,
    );
    const [statusLoading, setStatusLoading] = useState(true);
    const [statusError, setStatusError] = useState("");
    const [tokenCopied, setTokenCopied] = useState(false);
    const [userId, setUserId] = useState("");
    const [idCopied, setIdCopied] = useState(false);
    const [showUnboundModal, setShowUnboundModal] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultModalData, setResultModalData] = useState({
        title: "",
        message: "",
        isError: false,
    });
    const { weekInfo, setCurrentWeek } = useWeek();
    const [desiredWeek, setDesiredWeek] = useState<number | "">("");
    const [weekLoading, setWeekLoading] = useState(false);
    const [weekError, setWeekError] = useState("");
    const [showWeekModal, setShowWeekModal] = useState(false);
    // Exchange 邮箱转发绑定（引导式，替代已废弃的 OAuth 绑定）
    const [showExchangeForwardModal, setShowExchangeForwardModal] =
        useState(false);
    const [exchangeForwardEmail, setExchangeForwardEmail] = useState("");
    const [exchangeForwardStep, setExchangeForwardStep] = useState(1);
    const [exchangeForwardCode, setExchangeForwardCode] = useState("");
    const [exchangeForwardTarget, setExchangeForwardTarget] = useState("");
    const [exchangeForwardLoading, setExchangeForwardLoading] =
        useState(false);
    const [exchangeForwardError, setExchangeForwardError] = useState("");
    const [exchangeForwardConfirmed, setExchangeForwardConfirmed] =
        useState(false);
    const [ebridgePopup, setEbridgePopup] = useState<Window | null>(null);
    const [ebridgePopupError, setEbridgePopupError] = useState("");
    const [showEbridgeHashModal, setShowEbridgeHashModal] = useState(false);
    const [ebridgeHash, setEbridgeHash] = useState("");
    const [ebridgeHashLoading, setEbridgeHashLoading] = useState(false);

    // CalDAV state
    const [calDavStatus, setCalDavStatus] = useState<CalDavStatus | null>(null);
    const [showCalDavModal, setShowCalDavModal] = useState(false);
    const [calDavBaseUrl, setCalDavBaseUrl] = useState("");
    const [calDavUsername, setCalDavUsername] = useState("");
    const [calDavPassword, setCalDavPassword] = useState("");
    const [calDavLoading, setCalDavLoading] = useState(false);
    const [calDavSyncLoading, setCalDavSyncLoading] = useState(false);
    const [showCalDavSyncModal, setShowCalDavSyncModal] = useState(false);
    const [calDavSyncResult, setCalDavSyncResult] =
        useState<CalDavSyncResult | null>(null);
    const [calDavSyncError, setCalDavSyncError] = useState("");

    // CalDAV Server state
    const [calDavServerStatus, setCalDavServerStatus] =
        useState<CalDavServerStatus | null>(null);
    const [autoSchedulePromotions, setAutoSchedulePromotions] =
        useState<boolean>(false);
    const [stripReplyPrefix, setStripReplyPrefix] = useState<boolean>(true);
    const { isDark, toggleTheme } = useTheme();
    const [showShareModal, setShowShareModal] = useState(false);
    const [calDavServerLoading, setCalDavServerLoading] = useState(false);
    const [calDavServerCopiedField, setCalDavServerCopiedField] = useState<
        string | null
    >(null);
    const [showCalDavServerDetailModal, setShowCalDavServerDetailModal] =
        useState(false);

    // 会员状态（设置内入口卡片展示）
    const [membershipStatus, setMembershipStatus] =
        useState<MembershipSummary | null>(null);

    // 反馈 / 举报模态框
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const membershipTierName = (id: string): string => {
        if (id === "free") return t("membership.freeTier");
        const label = t(`membership.tierNames.${id}`);
        return label === `membership.tierNames.${id}` ? id : label;
    };
    const formatMembershipDate = (
        iso: string | null | undefined,
    ): string => {
        if (!iso) return "-";
        return new Date(iso).toLocaleDateString();
    };

    useEffect(() => {
        getMembership()
            .then(setMembershipStatus)
            .catch(() => setMembershipStatus(null));
    }, []);

    const copyCalDavServerField = (text: string, field: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCalDavServerCopiedField(field);
            setTimeout(() => setCalDavServerCopiedField(null), 2000);
        });
    };

    const openEbridgePopup = () => {
        setEbridgePopupError("");
        const popup = window.open(
            "/api/ebridge/proxy/eb/",
            "ebridge_timetable",
            "width=1024,height=768",
        );
        if (!popup) {
            setEbridgePopupError(t("settings.popupBlocked"));
            return;
        }
        setEbridgePopup(popup);
    };

    const handleImportEbridgeHash = async (e: React.FormEvent) => {
        e.preventDefault();
        const hash = ebridgeHash.trim();
        if (!hash) return;
        setEbridgeHashLoading(true);
        setStatusError("");
        try {
            await importEbridgeTimetableHash(hash);
            setShowEbridgeHashModal(false);
            setEbridgeHash("");
            setMessage(t("settings.timetableHashImported"));
            setTimeout(() => setMessage(""), 2000);
            handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || t("settings.saveFailed"));
        } finally {
            setEbridgeHashLoading(false);
        }
    };

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (
                event.data &&
                event.data.type === "EBRIDGE_TIMETABLE" &&
                event.data.url
            ) {
                saveEbridgeTimetableUrl(event.data.url)
                    .then(() => {
                        setMessage(t("settings.timetableUrlSuccess"));
                        setTimeout(() => setMessage(""), 2000);
                        handleRefreshStatus();
                    })
                    .catch((err) => {
                        setEbridgePopupError(
                            err.message || t("settings.saveFailed"),
                        );
                    })
                    .finally(() => {
                        if (ebridgePopup && !ebridgePopup.closed) {
                            ebridgePopup.close();
                        }
                        setEbridgePopup(null);
                    });
            }
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, [ebridgePopup]);

    useEffect(() => {
        return () => {
            if (ebridgePopup && !ebridgePopup.closed) {
                ebridgePopup.close();
            }
        };
    }, [ebridgePopup]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = isBelow("md");
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileMenuOpen(false);
                setIsSidebarCollapsed(window.innerWidth < getBreakpoint("lg"));
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 获取API状态
    useEffect(() => {
        const fetchStatuses = async () => {
            setStatusLoading(true);
            setStatusError("");

            try {
                // 并行获取API状态和用户设置
                const [
                    msTodoResult,
                    ebridgeResult,
                    calDavResult,
                    calDavServerResult,
                    userSettings,
                ] = await Promise.all([
                    getMicrosoftTodoStatus(),
                    getEbridgeStatus(),
                    getCalDavStatus().catch(() => null),
                    getCalDavServerStatus().catch(() => null),
                    getUserSettings().catch(() => null),
                ]);

                setMsTodoStatus(msTodoResult);
                setEbridgeStatus(ebridgeResult);
                setCalDavStatus(calDavResult);
                setCalDavServerStatus(calDavServerResult);

                if (userSettings) {
                    setAutoSchedulePromotions(
                        userSettings.autoSchedulePromotions,
                    );
                    setStripReplyPrefix(userSettings.stripReplyPrefix);
                    localStorage.setItem(
                        "stripReplyPrefix",
                        String(userSettings.stripReplyPrefix),
                    );
                    setUserId(userSettings.id || "");
                }

                // 如果有未绑定的账号，显示弹窗
                if (!msTodoResult.connected || !ebridgeResult.connected) {
                    setShowUnboundModal(true);
                }
            } catch (err: any) {
                setStatusError(err.message || t("settings.statusFetchFailed"));
                // console.error('Status fetch error:', err);
            } finally {
                setStatusLoading(false);
            }
        };

        fetchStatuses();
        // Week info now provided by WeekContext at startup
    }, []);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleNavClick = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const handleConnectMicrosoft = () => {
        startMicrosoftAuth();
    };

    // Exchange 邮箱绑定：引导用户配置「转发到 @apoints.email」，
    // 系统发送测试邮件并检索被转发的邮件来确认绑定（原 OAuth 已废弃）。
    const handleConnectExchange = () => {
        const saved = XJTLUaccount || "";
        setExchangeForwardEmail(saved.includes("@") ? saved : "");
        setExchangeForwardStep(1);
        setExchangeForwardCode("");
        setExchangeForwardTarget("");
        setExchangeForwardError("");
        setExchangeForwardConfirmed(false);
        setShowExchangeForwardModal(true);
    };

    const closeExchangeForwardModal = () => {
        setShowExchangeForwardModal(false);
        if (exchangeForwardStep >= 2 && !exchangeForwardConfirmed) {
            cancelExchangeForward().catch(() => {});
        }
        setExchangeForwardStep(1);
    };

    const handleExchangeForwardSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = exchangeForwardEmail.trim();
        if (!email) return;
        setExchangeForwardLoading(true);
        setExchangeForwardError("");
        try {
            const result = await startExchangeForward(email);
            setExchangeForwardCode(result.code);
            setExchangeForwardTarget(result.forwardTarget);
            setExchangeForwardStep(2);
        } catch (err: any) {
            setExchangeForwardError(
                err.message || t("settings.exchangeForwardSendFailed"),
            );
        } finally {
            setExchangeForwardLoading(false);
        }
    };

    const handleExchangeForwardCheck = async () => {
        setExchangeForwardLoading(true);
        setExchangeForwardError("");
        try {
            const result = await checkExchangeForward();
            if (result.confirmed) {
                setExchangeForwardConfirmed(true);
                setExchangeForwardStep(3);
                const email = exchangeForwardEmail.trim();
                if (email) {
                    setXJTLUaccount(email);
                    localStorage.setItem("user_XJTLUaccount", email);
                }
                setTimeout(() => handleRefreshStatus(), 500);
            } else {
                setExchangeForwardError(
                    t("settings.exchangeForwardNotYet"),
                );
            }
        } catch (err: any) {
            setExchangeForwardError(
                err.message || t("settings.exchangeForwardCheckFailed"),
            );
        } finally {
            setExchangeForwardLoading(false);
        }
    };

    const handleUnbindExchange = async () => {
        if (!window.confirm(t("settings.confirmUnbindExchange"))) return;
        setLoading(true);
        try {
            await unbindExchange();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || t("settings.unbindFailed"));
        } finally {
            setLoading(false);
        }
    };

    const [showSmtpConnectModal, setShowSmtpConnectModal] = useState(false);
    const [smtpEmail, setSmtpEmail] = useState("");
    const [smtpPassword, setSmtpPassword] = useState("");
    const [smtpHost, setSmtpHost] = useState("");
    const [smtpPort, setSmtpPort] = useState(993);
    const [smtpTls, setSmtpTls] = useState(true);

    const handleConnectSmtp = () => {
        setSmtpEmail(ebridgeStatus?.smtpEmail || "");
        setShowSmtpConnectModal(true);
    };

    const executeConnectSmtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowSmtpConnectModal(false);
        setLoading(true);
        setStatusError("");
        try {
            await bindSmtp({
                smtpEmail,
                smtpPassword,
                smtpHost,
                smtpPort,
                smtpTls,
            });
            setTimeout(() => handleRefreshStatus(), 1000);
        } catch (err: any) {
            setStatusError(
                `${t("settings.smtpBindFailed")}: ${err.message || t("common.unknownError")}`,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUnbindSmtp = async () => {
        if (!window.confirm(t("settings.confirmUnbindImap"))) return;
        setLoading(true);
        try {
            await unbindSmtp();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || t("settings.unbindFailed"));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        localStorage.removeItem("user_email");
        onLogout();
        navigate("/login");
    };

    const handleRefreshStatus = async () => {
        setStatusLoading(true);
        setStatusError("");

        try {
            const [
                msTodoResult,
                ebridgeResult,
                calDavResult,
                calDavServerResult,
            ] = await Promise.all([
                getMicrosoftTodoStatus(),
                getEbridgeStatus(),
                getCalDavStatus().catch(() => null),
                getCalDavServerStatus().catch(() => null),
            ]);

            setMsTodoStatus(msTodoResult);
            setEbridgeStatus(ebridgeResult);
            setCalDavStatus(calDavResult);
            setCalDavServerStatus(calDavServerResult);
        } catch (err: any) {
            setStatusError(err.message || t("settings.refreshFailed"));
        } finally {
            setStatusLoading(false);
        }
    };

    const handleCopyToken = () => {
        const token = getToken();
        if (token) {
            navigator.clipboard.writeText(token).then(() => {
                setTokenCopied(true);
                setTimeout(() => setTokenCopied(false), 2000);
            });
        }
    };

    const handleCopyId = () => {
        if (!userId) return;
        navigator.clipboard.writeText(userId).then(() => {
            setIdCopied(true);
            setTimeout(() => setIdCopied(false), 2000);
        });
    };

    const handleSyncTimetable = async () => {
        setSyncLoading(true);
        try {
            const result = await syncTimetable();
            setResultModalData({
                title: t("settings.syncSuccess"),
                message: t("settings.timetableSyncSuccess", {
                    added: result.added,
                    errors: result.errors,
                }),
                isError: false,
            });
            setShowResultModal(true);
        } catch (err: any) {
            setResultModalData({
                title: t("settings.syncFailed"),
                message: err.message || t("settings.timetableSyncFailed"),
                isError: true,
            });
            setShowResultModal(true);
        } finally {
            setSyncLoading(false);
        }
    };

    const handleDeleteTimetable = () => {
        setShowDeleteConfirmModal(true);
    };

    const executeDeleteTimetable = async () => {
        setSyncLoading(true);
        setShowDeleteConfirmModal(false);

        try {
            const result = await deleteTimetableTasks();
            setResultModalData({
                title: t("settings.operationSuccess"),
                message: result.message,
                isError: false,
            });
            setShowResultModal(true);
        } catch (err: any) {
            setResultModalData({
                title: t("settings.operationFailed"),
                message: err.message || t("settings.deleteTimetableFailed"),
                isError: true,
            });
            setShowResultModal(true);
        } finally {
            setSyncLoading(false);
        }
    };

    // CalDAV handlers
    const handleConnectCalDav = () => {
        setCalDavBaseUrl("");
        setCalDavUsername("");
        setCalDavPassword("");
        setShowCalDavModal(true);
    };

    const executeConnectCalDav = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowCalDavModal(false);
        setCalDavLoading(true);
        setStatusError("");
        try {
            await configureCalDav({
                baseUrl: calDavBaseUrl,
                username: calDavUsername,
                password: calDavPassword,
            });
            setTimeout(() => handleRefreshStatus(), 500);
        } catch (err: any) {
            setStatusError(
                `${t("settings.caldavBindFailed")}: ${err.message || t("common.unknownError")}`,
            );
        } finally {
            setCalDavLoading(false);
        }
    };

    const handleUnbindCalDav = async () => {
        if (!window.confirm(t("settings.confirmUnbindCaldav"))) return;
        setCalDavLoading(true);
        try {
            await unbindCalDav();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || t("settings.unbindFailed"));
        } finally {
            setCalDavLoading(false);
        }
    };

    // CalDAV Server handlers
    const handleEnableCalDavServer = async () => {
        setCalDavServerLoading(true);
        setStatusError("");
        try {
            await enableCalDavServer();
            setTimeout(() => handleRefreshStatus(), 500);
        } catch (err: any) {
            setStatusError(
                `${t("settings.caldavServerEnableFailed")}: ${err.message || t("common.unknownError")}`,
            );
        } finally {
            setCalDavServerLoading(false);
        }
    };

    const handleDisableCalDavServer = async () => {
        if (!window.confirm(t("settings.confirmDisableCaldavServer"))) return;
        setCalDavServerLoading(true);
        try {
            await disableCalDavServer();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || t("settings.disableFailed"));
        } finally {
            setCalDavServerLoading(false);
        }
    };

    const handleSyncCalDav = async () => {
        setCalDavSyncLoading(true);
        setCalDavSyncError("");
        try {
            const result = await syncCalDav({ direction: "both" });
            setCalDavSyncResult(result.result);
            setShowCalDavSyncModal(true);
        } catch (err: any) {
            setCalDavSyncError(err.message || t("settings.syncFailed"));
            setCalDavSyncResult(null);
            setShowCalDavSyncModal(true);
        } finally {
            setCalDavSyncLoading(false);
        }
    };

    const renderConnectionStatus = () => {
        if (statusLoading) {
            return <LoadingSpinner text={t("common.checkingStatus")} />;
        }

        if (statusError) {
            return <div className="status-error">{statusError}</div>;
        }

        return (
            <Card className="connection-panel">
                <CardHeader>
                    <CardTitle>{t("settings.connectionStatus")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="conn-table">
                        <div className="conn-row">
                            <div className="conn-indicator">
                                <span
                                    className={`conn-dot ${msTodoStatus?.connected ? "online" : "offline"}`}
                                />
                            </div>
                            <div className="conn-body">
                                <span className="conn-label">
                                    Microsoft To Do
                                </span>
                                <span className="conn-meta">
                                    {t("settings.taskSync")}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${msTodoStatus?.connected ? "online" : ""}`}
                                >
                                    {msTodoStatus?.connected
                                        ? t("common.connected")
                                        : t("common.notConnected")}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {!msTodoStatus?.connected && (
                                    <Button
                                        onClick={handleConnectMicrosoft}
                                        variant="primary"
                                        size="sm"
                                    >
                                        {t("common.connect")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="conn-row">
                            <div className="conn-indicator">
                                <span
                                    className={`conn-dot ${ebridgeStatus?.exchangeBinded ? "online" : "offline"}`}
                                />
                            </div>
                            <div className="conn-body">
                                <span className="conn-label">
                                    {t("settings.exchangeMail")}
                                </span>
                                <span className="conn-meta">
                                    {ebridgeStatus?.exchangeBinded
                                        ? t("common.bound")
                                        : t("settings.xjtluSchoolEmail")}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${ebridgeStatus?.exchangeBinded ? "online" : ""}`}
                                >
                                    {ebridgeStatus?.exchangeBinded
                                        ? t("common.bound")
                                        : t("settings.notBound")}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {ebridgeStatus?.exchangeBinded ? (
                                    <Button
                                        onClick={handleUnbindExchange}
                                        variant="ghost"
                                        size="sm"
                                        className="conn-unbind"
                                    >
                                        {t("settings.unbind")}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConnectExchange}
                                        variant="primary"
                                        size="sm"
                                    >
                                        {t("settings.bind")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="conn-row">
                            <div className="conn-indicator">
                                <span
                                    className={`conn-dot ${ebridgeStatus?.smtpBinded ? "online" : "offline"}`}
                                />
                            </div>
                            <div className="conn-body">
                                <span className="conn-label">
                                    {t("settings.imapMail")}
                                </span>
                                <span className="conn-meta">
                                    {ebridgeStatus?.smtpBinded
                                        ? ebridgeStatus.smtpEmail ||
                                          t("common.bound")
                                        : t("settings.imapSmtpProtocol")}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${ebridgeStatus?.smtpBinded ? "online" : ""}`}
                                >
                                    {ebridgeStatus?.smtpBinded
                                        ? t("common.bound")
                                        : t("settings.notBound")}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {ebridgeStatus?.smtpBinded ? (
                                    <Button
                                        onClick={handleUnbindSmtp}
                                        variant="ghost"
                                        size="sm"
                                        className="conn-unbind"
                                    >
                                        {t("settings.unbind")}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConnectSmtp}
                                        variant="primary"
                                        size="sm"
                                    >
                                        {t("settings.bind")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="conn-row">
                            <div className="conn-indicator">
                                <span
                                    className={`conn-dot ${calDavStatus?.enabled ? "online" : "offline"}`}
                                />
                            </div>
                            <div className="conn-body">
                                <span className="conn-label">
                                    {t("settings.caldavExternal")}
                                </span>
                                <span className="conn-meta">
                                    {calDavStatus?.enabled
                                        ? calDavStatus.calendarUrl ||
                                          t("common.connected")
                                        : t("settings.bindExternalCaldav")}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${calDavStatus?.enabled ? "online" : ""}`}
                                >
                                    {calDavStatus?.enabled
                                        ? t("common.connected")
                                        : t("common.notConnected")}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {calDavStatus?.enabled ? (
                                    <Button
                                        onClick={handleUnbindCalDav}
                                        variant="ghost"
                                        size="sm"
                                        className="conn-unbind"
                                    >
                                        {t("settings.unbind")}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConnectCalDav}
                                        variant="primary"
                                        size="sm"
                                    >
                                        {t("settings.bind")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="conn-row">
                            <div className="conn-indicator">
                                <span
                                    className={`conn-dot ${calDavServerStatus?.enabled ? "online" : "offline"}`}
                                />
                            </div>
                            <div className="conn-body">
                                <span className="conn-label">
                                    {t("settings.caldavServer")}
                                </span>
                                <span className="conn-meta">
                                    {calDavServerStatus?.enabled
                                        ? calDavServerStatus.serverUrl ||
                                          t("common.enabled")
                                        : t("settings.builtInCalendarSync")}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${calDavServerStatus?.enabled ? "online" : ""}`}
                                >
                                    {calDavServerStatus?.enabled
                                        ? t("common.enabled")
                                        : t("common.notEnabled")}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {calDavServerStatus?.enabled ? (
                                    <>
                                        <Button
                                            onClick={() =>
                                                setShowCalDavServerDetailModal(
                                                    true,
                                                )
                                            }
                                            variant="outline"
                                            size="sm"
                                        >
                                            {t("common.details")}
                                        </Button>
                                        <Button
                                            onClick={handleDisableCalDavServer}
                                            variant="ghost"
                                            size="sm"
                                            className="conn-unbind"
                                            disabled={calDavServerLoading}
                                        >
                                            {t("settings.disable")}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        onClick={handleEnableCalDavServer}
                                        variant="primary"
                                        size="sm"
                                        disabled={calDavServerLoading}
                                    >
                                        {calDavServerLoading
                                            ? t("common.enabling")
                                            : t("settings.enable")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="conn-row">
                            <div className="conn-indicator">
                                <span
                                    className={`conn-dot ${ebridgeStatus?.connected ? "online" : "offline"}`}
                                />
                            </div>
                            <div className="conn-body">
                                <span className="conn-label">
                                    {t("settings.ebridgeSystem")}
                                </span>
                                <span className="conn-meta">
                                    {t("settings.courseExamInfo")}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${ebridgeStatus?.connected ? "online" : ""}`}
                                >
                                    {ebridgeStatus?.connected
                                        ? t("common.connected")
                                        : t("common.notConnected")}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {!ebridgeStatus?.connected && (
                                    <>
                                        <Button
                                            onClick={openEbridgePopup}
                                            variant="primary"
                                            size="sm"
                                        >
                                            {t("common.connect")}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setShowEbridgeHashModal(true)
                                            }
                                            variant="outline"
                                            size="sm"
                                        >
                                            {t("settings.importTimetableHash")}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {ebridgeStatus?.connected && (
                        <>
                            <div className="conn-divider" />
                            <div className="conn-table">
                                <div className="conn-row">
                                    <div className="conn-indicator">
                                        <Download
                                            size={16}
                                            className="conn-icon"
                                        />
                                    </div>
                                    <div className="conn-body">
                                        <span className="conn-label">
                                            {t("settings.syncTimetable")}
                                        </span>
                                        <span className="conn-meta">
                                            {t("settings.fetchLatestCourses")}
                                        </span>
                                    </div>
                                    <div className="conn-actions">
                                        <Button
                                            onClick={handleSyncTimetable}
                                            disabled={syncLoading}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            {syncLoading
                                                ? t("settings.syncing")
                                                : t("settings.syncNow")}
                                        </Button>
                                    </div>
                                </div>
                                <div className="conn-row">
                                    <div className="conn-indicator">
                                        <Trash2
                                            size={16}
                                            className="conn-icon conn-icon-danger"
                                        />
                                    </div>
                                    <div className="conn-body">
                                        <span className="conn-label">
                                            {t("settings.clearTimetable")}
                                        </span>
                                        <span className="conn-meta">
                                            {t(
                                                "settings.deleteAllImportedTasks",
                                            )}
                                        </span>
                                    </div>
                                    <div className="conn-actions">
                                        <Button
                                            onClick={handleDeleteTimetable}
                                            disabled={syncLoading}
                                            variant="danger"
                                            size="sm"
                                        >
                                            {t("settings.deleteAll")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {calDavStatus?.enabled && (
                        <>
                            <div className="conn-divider" />
                            <div className="conn-table">
                                <div className="conn-row">
                                    <div className="conn-indicator">
                                        <RefreshCw
                                            size={16}
                                            className="conn-icon"
                                        />
                                    </div>
                                    <div className="conn-body">
                                        <span className="conn-label">
                                            {t("settings.syncCaldavCalendar")}
                                        </span>
                                        <span className="conn-meta">
                                            {t("settings.bidirectionalSync")}
                                            {calDavStatus?.lastSyncAt
                                                ? ` (${t("settings.lastSync")}: ${new Date(calDavStatus.lastSyncAt).toLocaleString()})`
                                                : ""}
                                        </span>
                                    </div>
                                    <div className="conn-actions">
                                        <Button
                                            onClick={handleSyncCalDav}
                                            disabled={calDavSyncLoading}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            {calDavSyncLoading
                                                ? t("settings.syncing")
                                                : t("settings.syncNow")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="conn-divider" />
                    <div className="conn-toolbar">
                        <Button
                            variant="outline"
                            onClick={handleRefreshStatus}
                            size="sm"
                        >
                            <RefreshCw size={14} />{" "}
                            <span>{t("common.refresh")}</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCopyToken}
                            size="sm"
                        >
                            {tokenCopied ? (
                                <Check size={14} />
                            ) : (
                                <Copy size={14} />
                            )}
                            <span>
                                {tokenCopied
                                    ? t("common.copied")
                                    : t("common.copyMcpToken")}
                            </span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderMainContent = () => {
        if (view === "all-schedule") return <AllSchedule />;
        if (view === "today-schedule") return <TodaySchedule />;
        if (view === "search-schedule") return <SearchTasks />;
        if (view === "queue") return <ScheduleQueue />;
        if (view === "logs") return <LogViewer />;
        if (view === "chat") return <AIChat />;
        if (view === "mail") return <MyMail />;
        if (view === "membership") return <MembershipPage />;

        // Default Dashboard View（设置页：我的计划为设置内的二级页面）
        return (
            <div className="settings-page">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.accountInfo")}</CardTitle>
                    </CardHeader>
                    <CardContent className="account-info">
                        <div className="info-item">
                            <span className="info-label">
                                {t("settings.loginEmail")}:
                            </span>
                            <span className="info-value">{email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">
                                {t("settings.accountId")}:
                            </span>
                            <span className="info-value info-id">
                                <span className="info-id-text">
                                    {userId || t("settings.notSet")}
                                </span>
                                <button
                                    className="copy-id-btn"
                                    onClick={handleCopyId}
                                    title={
                                        idCopied
                                            ? t("settings.idCopied")
                                            : t("settings.copyId")
                                    }
                                    disabled={!userId}
                                >
                                    {idCopied ? (
                                        <Check size={14} />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                    {idCopied
                                        ? t("settings.idCopied")
                                        : t("settings.copyId")}
                                </button>
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">
                                {t("settings.xjtluAccount")}:
                            </span>
                            <span className="info-value">
                                {XJTLUaccount || t("settings.notSet")}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">
                                {t("settings.logout")}:
                            </span>
                            <Button variant="danger" onClick={handleLogout}>
                                <LogOut size={18} /> {t("nav.logout")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="membership-entry-card">
                    <CardHeader>
                        <CardTitle>{t("settings.membershipEntry")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="membership-entry-body">
                            <div className="membership-entry-info">
                                <div className="membership-entry-badge">
                                    <Crown size={18} />
                                    <span>
                                        {membershipStatus
                                            ? membershipTierName(
                                                  membershipStatus.effectiveTier,
                                              )
                                            : t("membership.freeTier")}
                                    </span>
                                </div>
                                {membershipStatus?.isActive ? (
                                    <div className="membership-entry-meta">
                                        {t("membership.endDate")}:{" "}
                                        {formatMembershipDate(
                                            membershipStatus.effectiveEndDate,
                                        )}
                                        {" · "}
                                        {membershipStatus.remainingDays}{" "}
                                        {t("membership.days")}
                                    </div>
                                ) : (
                                    <div className="membership-entry-meta">
                                        {t("membership.noActive")}
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={() =>
                                    handleNavClick("/settings/membership")
                                }
                            >
                                <Crown size={18} />
                                {t("settings.membershipEntryCta")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.language")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                            }}
                        >
                            {[
                                { code: "zh-CN", label: t("common.chinese") },
                                { code: "en", label: t("common.english") },
                            ].map((lang) => (
                                <Button
                                    key={lang.code}
                                    variant={
                                        i18n.language === lang.code
                                            ? "primary"
                                            : "outline"
                                    }
                                    onClick={() =>
                                        i18n.changeLanguage(lang.code)
                                    }
                                >
                                    {lang.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.feedback")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 12,
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        color: "var(--color-text-medium)",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {t("settings.feedbackDesc")}
                                </p>
                            </div>
                            <Button
                                onClick={() => setShowFeedbackModal(true)}
                            >
                                {t("settings.feedbackButton")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.appearance")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <strong>{t("settings.darkMode")}</strong>
                            </div>
                            <Switch checked={isDark} onChange={toggleTheme} />
                        </label>
                        <div
                            style={{
                                marginTop: "16px",
                                paddingTop: "16px",
                                borderTop:
                                    "1px solid var(--color-border-subtle)",
                            }}
                        >
                            <ThemeSwitcher />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.aiMailSettings")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <strong>
                                    {t("settings.autoSchedulePromotions")}
                                </strong>
                                <div
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "var(--color-text-medium)",
                                        marginTop: 4,
                                    }}
                                >
                                    {t("settings.autoSchedulePromotionsDesc")}
                                </div>
                            </div>
                            <Switch
                                checked={autoSchedulePromotions}
                                onChange={async (next) => {
                                    setAutoSchedulePromotions(next);
                                    try {
                                        await setAutoSchedulePromotionsApi(
                                            next,
                                        );
                                    } catch (err) {
                                        console.error(
                                            "Failed to update setting:",
                                            err,
                                        );
                                        setAutoSchedulePromotions(!next);
                                    }
                                }}
                            />
                        </label>

                        <label
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px 0",
                                borderTop: "1px solid var(--color-border)",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <strong>
                                    {t("settings.stripReplyPrefix")}
                                </strong>
                                <div
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "var(--color-text-medium)",
                                        marginTop: 4,
                                    }}
                                >
                                    {t("settings.stripReplyPrefixDesc")}
                                </div>
                            </div>
                            <Switch
                                checked={stripReplyPrefix}
                                onChange={async (next) => {
                                    setStripReplyPrefix(next);
                                    localStorage.setItem(
                                        "stripReplyPrefix",
                                        String(next),
                                    );
                                    try {
                                        await setStripReplyPrefixApi(next);
                                    } catch (err) {
                                        console.error(
                                            "Failed to update setting:",
                                            err,
                                        );
                                        setStripReplyPrefix(!next);
                                        localStorage.setItem(
                                            "stripReplyPrefix",
                                            String(!next),
                                        );
                                    }
                                }}
                            />
                        </label>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.weekSettings")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            <div>
                                <strong>{t("settings.currentWeek")}: </strong>
                                {weekInfo
                                    ? weekInfo.effectiveWeek
                                    : t("common.loading")}
                            </div>
                            <div>
                                <small>
                                    {t("settings.academicBaseWeek")}:{" "}
                                    {weekInfo ? weekInfo.rawWeekNumber : "-"},
                                    {t("settings.globalOffset")}:{" "}
                                    {weekInfo ? weekInfo.globalWeekOffset : "-"}
                                    , {t("settings.yourOffset")}:{" "}
                                    {weekInfo ? weekInfo.userWeekOffset : "-"}
                                </small>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        setWeekError("");
                                        setDesiredWeek("");
                                        setShowWeekModal(true);
                                    }}
                                >
                                    {t("settings.setCurrentWeek")}
                                </Button>
                            </div>
                            {weekError && (
                                <div className="error-message">{weekError}</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.scheduleShare")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 12,
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        color: "var(--color-text-medium)",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {t("settings.shareScheduleDesc")}
                                </p>
                            </div>
                            <Button onClick={() => setShowShareModal(true)}>
                                <Share2 size={18} />{" "}
                                {t("settings.generateShareLink")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {renderConnectionStatus()}

                {ebridgePopupError && (
                    <div
                        className="error-message"
                        style={{ marginTop: "16px" }}
                    >
                        {ebridgePopupError}
                    </div>
                )}
                {message && (
                    <div
                        className="success-message"
                        style={{ marginTop: "16px" }}
                    >
                        {message}
                    </div>
                )}

                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                />
            </div>
        );
    };

    const renderNavItems = () => (
        <>
            {/* Schedule Section */}
            <div className="sidebar-section-header">
                {t("nav.sectionSchedule")}
            </div>
            <button
                className={`nav-item ${view === "today-schedule" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/today")}
            >
                <ListTodo size={20} />
                <span className="nav-text">{t("nav.todaySchedule")}</span>
            </button>
            <button
                className={`nav-item ${view === "all-schedule" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/all")}
            >
                <Calendar size={20} />
                <span className="nav-text">{t("nav.allSchedule")}</span>
            </button>
            <button
                className={`nav-item ${view === "search-schedule" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/search")}
            >
                <Search size={20} />
                <span className="nav-text">{t("nav.searchTasks")}</span>
            </button>
            <button
                className={`nav-item ${view === "queue" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/queue")}
            >
                <Check size={20} />
                <span className="nav-text">{t("nav.pendingSchedule")}</span>
            </button>

            {/* Tools Section */}
            <div className="sidebar-section-header">
                {t("nav.sectionTools")}
            </div>
            <button
                className={`nav-item ${view === "mail" ? "active" : ""}`}
                onClick={() => handleNavClick("/mail")}
            >
                <Mail size={20} />
                <span className="nav-text">{t("nav.myMail")}</span>
            </button>
            <button
                className={`nav-item ${view === "chat" ? "active" : ""}`}
                onClick={() => handleNavClick("/chat")}
            >
                <MessageSquare size={20} />
                <span className="nav-text">{t("nav.aiAssistant")}</span>
            </button>
            <button
                className={`nav-item ${view === "logs" ? "active" : ""}`}
                onClick={() => handleNavClick("/logs")}
            >
                <FileText size={20} />
                <span className="nav-text">{t("nav.systemLogs")}</span>
            </button>
        </>
    );

    return (
        <div
            className={`dashboard-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${isMobile ? "mobile-layout" : ""}`}
        >
            {isMobile ? (
                <>
                    <header className="mobile-header">
                        <div className="mobile-header-top">
                            <h1 className="logo-text">
                                <img
                                    src={logo}
                                    alt={t("app.title")}
                                    className="app-logo"
                                />{" "}
                                <span>{t("app.title")}</span>
                            </h1>
                            <button
                                className="mobile-menu-toggle"
                                onClick={toggleMobileMenu}
                            >
                                {isMobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </header>
                    <div
                        className={`mobile-nav-overlay ${isMobileMenuOpen ? "open" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <nav
                        className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
                    >
                        <div className="mobile-nav-header">
                            <h2 className="mobile-nav-title">
                                {t("nav.menu")}
                            </h2>
                            <button
                                className="mobile-menu-close"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        {renderNavItems()}
                        <div className="mobile-nav-footer">
                            <button
                                className={`nav-item ${!view || view === "dashboard" || view === "membership" ? "active" : ""}`}
                                onClick={() => handleNavClick("/dashboard")}
                            >
                                <LayoutDashboard size={20} />
                                <span className="nav-text">
                                    {t("nav.settings")}
                                </span>
                            </button>
                        </div>
                    </nav>
                </>
            ) : (
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h1 className="logo-text">
                            <img
                                src={logo}
                                alt={t("app.title")}
                                className="app-logo"
                            />
                            <span>{t("app.title")}</span>
                        </h1>
                    </div>
                    <nav className="sidebar-nav">{renderNavItems()}</nav>
                    <div className="sidebar-divider" />
                    <div className="sidebar-footer">
                        <ThemeSwitcher />
                        <button
                            className={`nav-item ${!view || view === "dashboard" || view === "membership" ? "active" : ""}`}
                            onClick={() => handleNavClick("/dashboard")}
                        >
                            <LayoutDashboard size={20} />
                            <span className="nav-text">
                                {t("nav.settings")}
                            </span>
                        </button>
                        <button
                            className="sidebar-collapse-btn"
                            onClick={toggleSidebar}
                        >
                            {isSidebarCollapsed ? (
                                <PanelLeftOpen size={20} />
                            ) : (
                                <PanelLeftClose size={20} />
                            )}
                            <span>{t("nav.collapse")}</span>
                        </button>
                    </div>
                </aside>
            )}

            <main className="main-content">
                <MobileActionBarProvider>
                    {renderMainContent()}
                </MobileActionBarProvider>

                <Modal
                    isOpen={showExchangeForwardModal}
                    onClose={closeExchangeForwardModal}
                    title={t("settings.exchangeForwardTitle")}
                >
                    <div className="exchange-forward-modal">
                        {/* 步骤 1：填写学校邮箱并发送测试邮件 */}
                        {exchangeForwardStep === 1 && (
                            <>
                                <p
                                    className="modal-description"
                                    style={{
                                        marginBottom: "15px",
                                        color: "var(--color-text-secondary)",
                                        fontSize: "14px",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {t("settings.exchangeForwardIntro")}
                                </p>
                                <form onSubmit={handleExchangeForwardSend}>
                                    <Input
                                        label={t("settings.schoolEmail")}
                                        type="email"
                                        id="exchangeForwardEmail"
                                        value={exchangeForwardEmail}
                                        onChange={(e) =>
                                            setExchangeForwardEmail(
                                                e.target.value,
                                            )
                                        }
                                        required
                                        placeholder={t(
                                            "settings.exchangeForwardEmailPlaceholder",
                                        )}
                                    />
                                    {exchangeForwardError && (
                                        <div
                                            className="error-message"
                                            style={{ marginTop: 10 }}
                                        >
                                            {exchangeForwardError}
                                        </div>
                                    )}
                                    <div
                                        style={{
                                            marginTop: "20px",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: "10px",
                                        }}
                                    >
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={closeExchangeForwardModal}
                                        >
                                            {t("common.cancel")}
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                exchangeForwardLoading ||
                                                !exchangeForwardEmail.trim()
                                            }
                                        >
                                            {exchangeForwardLoading ? (
                                                <>
                                                    <Loader2
                                                        size={14}
                                                        className="animate-spin"
                                                    />{" "}
                                                    {t("common.sending")}
                                                </>
                                            ) : (
                                                <>
                                                    {t(
                                                        "settings.exchangeForwardSend",
                                                    )}{" "}
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* 步骤 2：配置转发 + 检查绑定状态 */}
                        {exchangeForwardStep === 2 && (
                            <>
                                <div className="exchange-forward-code">
                                    <span className="exchange-forward-code-label">
                                        {t(
                                            "settings.exchangeForwardCodeLabel",
                                        )}
                                    </span>
                                    <code className="exchange-forward-code-value">
                                        {exchangeForwardCode}
                                    </code>
                                </div>
                                <ol className="exchange-forward-steps">
                                    <li>
                                        {t(
                                            "settings.exchangeForwardStep1",
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            "settings.exchangeForwardStep2",
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            "settings.exchangeForwardStep3",
                                            {
                                                target: exchangeForwardTarget,
                                            },
                                        )}
                                    </li>
                                    <li>
                                        {t(
                                            "settings.exchangeForwardStep4",
                                        )}
                                    </li>
                                </ol>
                                {exchangeForwardError && (
                                    <div
                                        className="error-message"
                                        style={{ marginTop: 10 }}
                                    >
                                        {exchangeForwardError}
                                    </div>
                                )}
                                <div
                                    style={{
                                        marginTop: "20px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "10px",
                                    }}
                                >
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() =>
                                            setExchangeForwardStep(1)
                                        }
                                    >
                                        {t(
                                            "settings.exchangeForwardBack",
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleExchangeForwardCheck}
                                        disabled={exchangeForwardLoading}
                                    >
                                        {exchangeForwardLoading ? (
                                            <>
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />{" "}
                                                {t(
                                                    "settings.exchangeForwardChecking",
                                                )}
                                            </>
                                        ) : (
                                            t(
                                                "settings.exchangeForwardCheck",
                                            )
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* 步骤 3：绑定成功 */}
                        {exchangeForwardStep === 3 && (
                            <>
                                <div className="exchange-forward-success">
                                    <CheckCircle2
                                        size={40}
                                        className="exchange-forward-success-icon"
                                    />
                                    <p>
                                        {t(
                                            "settings.exchangeForwardSuccess",
                                            {
                                                email: exchangeForwardEmail.trim(),
                                                target: exchangeForwardTarget,
                                            },
                                        )}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        marginTop: "20px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "10px",
                                    }}
                                >
                                    <Button
                                        variant="primary"
                                        onClick={closeExchangeForwardModal}
                                    >
                                        {t("common.done")}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </Modal>

                <Modal
                    isOpen={showSmtpConnectModal}
                    onClose={() => setShowSmtpConnectModal(false)}
                    title={t("settings.connectSmtpImap")}
                >
                    <div className="smtp-connect-modal">
                        <p
                            className="modal-description"
                            style={{
                                marginBottom: "15px",
                                color: "var(--color-text-secondary)",
                                fontSize: "14px",
                            }}
                        >
                            {t("settings.smtpImapDesc")}
                        </p>
                        <form onSubmit={executeConnectSmtp}>
                            <Input
                                label={t("settings.emailAddress")}
                                type="email"
                                id="smtpEmail"
                                value={smtpEmail}
                                onChange={(e) => setSmtpEmail(e.target.value)}
                                required
                                placeholder={t("settings.emailPlaceholder")}
                            />
                            <Input
                                label={t("settings.passwordOrAuthCode")}
                                type="password"
                                id="smtpPassword"
                                value={smtpPassword}
                                onChange={(e) =>
                                    setSmtpPassword(e.target.value)
                                }
                                required
                                placeholder={t(
                                    "settings.passwordOrAuthCodePlaceholder",
                                )}
                            />
                            <Input
                                label={t("settings.imapServer")}
                                type="text"
                                id="smtpHost"
                                value={smtpHost}
                                onChange={(e) => setSmtpHost(e.target.value)}
                                required
                                placeholder={t(
                                    "settings.imapServerPlaceholder",
                                )}
                            />
                            <div style={{ display: "flex", gap: "10px" }}>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        label={t("settings.port")}
                                        type="number"
                                        id="smtpPort"
                                        value={String(smtpPort)}
                                        onChange={(e) =>
                                            setSmtpPort(Number(e.target.value))
                                        }
                                        required
                                        placeholder="993"
                                    />
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "flex-end",
                                        paddingBottom: "2px",
                                    }}
                                >
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={smtpTls}
                                            onChange={(e) =>
                                                setSmtpTls(e.target.checked)
                                            }
                                        />
                                        {t("settings.useTls")}
                                    </label>
                                </div>
                            </div>
                            <div
                                style={{
                                    marginTop: "20px",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                }}
                            >
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setShowSmtpConnectModal(false)
                                    }
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading
                                        ? t("common.connecting")
                                        : t("settings.confirmBind")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={showUnboundModal}
                    onClose={() => setShowUnboundModal(false)}
                    title={t("settings.accountBindReminder")}
                    footer={
                        <Button onClick={() => setShowUnboundModal(false)}>
                            {t("common.gotIt")}
                        </Button>
                    }
                >
                    <p>{t("settings.unboundAccountsDetected")}</p>
                    <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                        {!msTodoStatus?.connected && (
                            <li>{t("settings.msTodoNotConnected")}</li>
                        )}
                        {!ebridgeStatus?.connected && (
                            <li>{t("settings.ebridgeNotConnected")}</li>
                        )}
                    </ul>
                    <p>{t("settings.bindReminderMessage")}</p>
                </Modal>

                <Modal
                    isOpen={showDeleteConfirmModal}
                    onClose={() => setShowDeleteConfirmModal(false)}
                    title={t("common.confirmDelete")}
                    footer={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                            }}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteConfirmModal(false)}
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={executeDeleteTimetable}
                            >
                                {t("common.confirmDelete")}
                            </Button>
                        </div>
                    }
                >
                    <p>{t("settings.confirmDeleteTimetable")}</p>
                </Modal>

                <Modal
                    isOpen={showResultModal}
                    onClose={() => setShowResultModal(false)}
                    title={resultModalData.title}
                    footer={
                        <Button onClick={() => setShowResultModal(false)}>
                            {t("common.confirm")}
                        </Button>
                    }
                >
                    <p
                        className={
                            resultModalData.isError
                                ? "error-message"
                                : "success-message"
                        }
                        style={{ margin: 0 }}
                    >
                        {resultModalData.message}
                    </p>
                </Modal>

                <Modal
                    isOpen={showCalDavModal}
                    onClose={() => setShowCalDavModal(false)}
                    title={t("settings.connectCaldav")}
                >
                    <div className="smtp-connect-modal">
                        <p
                            className="modal-description"
                            style={{
                                marginBottom: "15px",
                                color: "var(--color-text-secondary)",
                                fontSize: "14px",
                            }}
                        >
                            {t("settings.caldavConnectDesc")}
                        </p>
                        <form onSubmit={executeConnectCalDav}>
                            <Input
                                label={t("settings.caldavBaseUrl")}
                                type="url"
                                id="calDavBaseUrl"
                                value={calDavBaseUrl}
                                onChange={(e) =>
                                    setCalDavBaseUrl(e.target.value)
                                }
                                required
                                placeholder={t("settings.caldavUrlPlaceholder")}
                            />
                            <Input
                                label={t("settings.username")}
                                type="text"
                                id="calDavUsername"
                                value={calDavUsername}
                                onChange={(e) =>
                                    setCalDavUsername(e.target.value)
                                }
                                required
                                placeholder={t(
                                    "settings.caldavUsernamePlaceholder",
                                )}
                            />
                            <Input
                                label={t("settings.passwordAppSpecific")}
                                type="password"
                                id="calDavPassword"
                                value={calDavPassword}
                                onChange={(e) =>
                                    setCalDavPassword(e.target.value)
                                }
                                required
                                placeholder={t("settings.passwordPlaceholder")}
                            />
                            <div
                                style={{
                                    marginTop: "20px",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                }}
                            >
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowCalDavModal(false)}
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button type="submit" disabled={calDavLoading}>
                                    {calDavLoading
                                        ? t("common.connecting")
                                        : t("settings.confirmBind")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={showCalDavSyncModal}
                    onClose={() => setShowCalDavSyncModal(false)}
                    title={
                        calDavSyncError
                            ? t("settings.caldavSyncFailed")
                            : t("settings.caldavSyncResult")
                    }
                    footer={
                        <Button onClick={() => setShowCalDavSyncModal(false)}>
                            {t("common.confirm")}
                        </Button>
                    }
                >
                    {calDavSyncError ? (
                        <p className="error-message" style={{ margin: 0 }}>
                            {calDavSyncError}
                        </p>
                    ) : calDavSyncResult ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            <div
                                style={{
                                    background: "var(--color-success-50)",
                                    padding: "12px",
                                    borderRadius: "8px",
                                }}
                            >
                                <strong>{t("settings.caldavPull")}</strong>
                                <ul
                                    style={{
                                        margin: "8px 0 0 20px",
                                        padding: 0,
                                    }}
                                >
                                    <li>
                                        {t("settings.newItems")}:{" "}
                                        {calDavSyncResult.pulled.created}
                                    </li>
                                    <li>
                                        {t("settings.updatedItems")}:{" "}
                                        {calDavSyncResult.pulled.updated}
                                    </li>
                                    <li>
                                        {t("settings.skippedConflicts")}:{" "}
                                        {
                                            calDavSyncResult.pulled
                                                .skippedConflicts
                                        }
                                    </li>
                                    <li>
                                        {t("settings.errors")}:{" "}
                                        {calDavSyncResult.pulled.errors}
                                    </li>
                                </ul>
                            </div>
                            <div
                                style={{
                                    background: "var(--color-primary-50)",
                                    padding: "12px",
                                    borderRadius: "8px",
                                }}
                            >
                                <strong>{t("settings.caldavPush")}</strong>
                                <ul
                                    style={{
                                        margin: "8px 0 0 20px",
                                        padding: 0,
                                    }}
                                >
                                    <li>
                                        {t("settings.newItems")}:{" "}
                                        {calDavSyncResult.pushed.created}
                                    </li>
                                    <li>
                                        {t("settings.updatedItems")}:{" "}
                                        {calDavSyncResult.pushed.updated}
                                    </li>
                                    <li>
                                        {t("settings.skippedConflicts")}:{" "}
                                        {
                                            calDavSyncResult.pushed
                                                .skippedConflicts
                                        }
                                    </li>
                                    <li>
                                        {t("settings.errors")}:{" "}
                                        {calDavSyncResult.pushed.errors}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : null}
                </Modal>

                <Modal
                    isOpen={showWeekModal}
                    onClose={() => setShowWeekModal(false)}
                    title={t("settings.setCurrentWeek")}
                    footer={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                            }}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => setShowWeekModal(false)}
                                disabled={weekLoading}
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button
                                onClick={async () => {
                                    setWeekError("");
                                    setWeekLoading(true);
                                    try {
                                        if (desiredWeek === "")
                                            throw new Error(
                                                t("settings.pleaseEnterWeek"),
                                            );
                                        await setCurrentWeek(
                                            Number(desiredWeek),
                                        );
                                        setShowWeekModal(false);
                                    } catch (err: any) {
                                        setWeekError(
                                            err.message ||
                                                t("settings.setFailed"),
                                        );
                                    } finally {
                                        setWeekLoading(false);
                                    }
                                }}
                                disabled={weekLoading}
                            >
                                {weekLoading
                                    ? t("common.saving")
                                    : t("common.save")}
                            </Button>
                        </div>
                    }
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <div>
                            <strong>{t("settings.currentWeek")}: </strong>
                            {weekInfo
                                ? weekInfo.effectiveWeek
                                : t("common.loading")}
                        </div>
                        <div>
                            <small>
                                {t("settings.academicBaseWeek")}:{" "}
                                {weekInfo ? weekInfo.rawWeekNumber : "-"},
                                {t("settings.globalOffset")}:{" "}
                                {weekInfo ? weekInfo.globalWeekOffset : "-"},
                                {t("settings.yourOffset")}:{" "}
                                {weekInfo ? weekInfo.userWeekOffset : "-"}
                            </small>
                        </div>
                        <Input
                            label={t("settings.setCurrentWeek")}
                            type="number"
                            id="desiredWeekModal"
                            value={desiredWeek}
                            onChange={(e) =>
                                setDesiredWeek(
                                    e.target.value === ""
                                        ? ""
                                        : parseInt(e.target.value),
                                )
                            }
                            placeholder={t("settings.desiredWeekPlaceholder")}
                        />
                        {weekError && (
                            <div className="error-message">{weekError}</div>
                        )}
                    </div>
                </Modal>

                <Modal
                    isOpen={showCalDavServerDetailModal}
                    onClose={() => setShowCalDavServerDetailModal(false)}
                    title={t("settings.caldavConnectionInfo")}
                >
                    <div className="conn-table caldav-server-detail">
                        <CalDavConnectionCard
                            serverUrl={calDavServerStatus?.serverUrl || ""}
                            username={calDavServerStatus?.username || ""}
                            password={calDavServerStatus?.password || ""}
                            calendarUrl={calDavServerStatus?.calendarUrl || ""}
                            copiedField={calDavServerCopiedField}
                            onCopy={copyCalDavServerField}
                        />
                    </div>
                </Modal>

                <Modal
                    isOpen={showEbridgeHashModal}
                    onClose={() => setShowEbridgeHashModal(false)}
                    title={t("settings.importTimetableHash")}
                >
                    <div className="ebridge-hash-modal">
                        <p
                            className="modal-description"
                            style={{
                                marginBottom: "15px",
                                color: "var(--color-text-secondary)",
                                fontSize: "14px",
                            }}
                        >
                            {t("settings.importTimetableHashDesc")}
                        </p>
                        <form onSubmit={handleImportEbridgeHash}>
                            <Input
                                label={t("settings.timetableHash")}
                                type="text"
                                id="ebridgeHash"
                                value={ebridgeHash}
                                onChange={(e) =>
                                    setEbridgeHash(e.target.value)
                                }
                                required
                                placeholder={t(
                                    "settings.timetableHashPlaceholder",
                                )}
                            />
                            <div
                                style={{
                                    marginTop: "20px",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                }}
                            >
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setShowEbridgeHashModal(false)
                                    }
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={ebridgeHashLoading}
                                >
                                    {ebridgeHashLoading
                                        ? t("common.saving")
                                        : t("common.save")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                />
            </main>
        </div>
    );
};

export default Dashboard;
