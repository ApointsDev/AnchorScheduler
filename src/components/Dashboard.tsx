import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    startMicrosoftAuth,
    startExchangeAuth,
    unbindExchange,
    bindSmtp,
    unbindSmtp,
    removeToken,
    getToken,
    saveEbridgeTimetableUrl,
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
} from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import CalDavConnectionCard from "./ui/CalDavConnectionCard";
import { Modal } from "./ui/Modal";
import AllSchedule from "./Schedule/AllSchedule";
import TodaySchedule from "./Schedule/TodaySchedule";
import SearchTasks from "./Schedule/SearchTasks";
import ScheduleQueue from "./Schedule/ScheduleQueue";
import LogViewer from "./Logs/LogViewer";
import AIChat from "./AIChat/AIChat";
import { useWeek } from "../context/WeekContext";
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
} from "lucide-react";
import { ToggleButton } from "./ui/ToggleButton";
import "../styles/Dashboard.css";
import logo from "../assets/logo.svg";

interface DashboardProps {
    onLogout: () => void;
    view?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, view }) => {
    const navigate = useNavigate();

    // Get breakpoint from CSS variables
    const getMobileBreakpoint = () => {
        const root = document.documentElement;
        const breakpoint = getComputedStyle(root)
            .getPropertyValue("--breakpoint-mobile")
            .trim();
        return parseInt(breakpoint) || 768;
    };

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const mobileBreakpoint = getMobileBreakpoint();
        const isMobileView = window.innerWidth < mobileBreakpoint;
        return !isMobileView && window.innerWidth < 1024;
    });
    const [isMobile, setIsMobile] = useState(
        () => window.innerWidth < getMobileBreakpoint(),
    );
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
    const [showExchangeConnectModal, setShowExchangeConnectModal] =
        useState(false);
    const [exchangeEmail, setExchangeEmail] = useState(
        localStorage.getItem("user_XJTLUaccount") || "",
    );
    const [ebridgePopup, setEbridgePopup] = useState<Window | null>(null);
    const [ebridgePopupError, setEbridgePopupError] = useState("");

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
    const [calDavServerLoading, setCalDavServerLoading] = useState(false);
    const [calDavServerCopiedField, setCalDavServerCopiedField] = useState<
        string | null
    >(null);
    const [showCalDavServerDetailModal, setShowCalDavServerDetailModal] =
        useState(false);

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
            setEbridgePopupError("弹窗被浏览器拦截，请允许本站弹窗后重试");
            return;
        }
        setEbridgePopup(popup);
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
                        setMessage("课表链接已成功获取！");
                        setTimeout(() => setMessage(""), 2000);
                        handleRefreshStatus();
                    })
                    .catch((err) => {
                        setEbridgePopupError(err.message || "保存失败");
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
            const mobileBreakpoint = getMobileBreakpoint();
            const mobile = window.innerWidth < mobileBreakpoint;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileMenuOpen(false);
                setIsSidebarCollapsed(window.innerWidth < 1024);
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
                // 并行获取API的状态
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

                // 如果有未绑定的账号，显示弹窗
                if (!msTodoResult.connected || !ebridgeResult.connected) {
                    setShowUnboundModal(true);
                }
            } catch (err: any) {
                setStatusError(err.message || "获取接口状态失败");
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

    const handleConnectExchange = async () => {
        // 允许用户输入/确认学校邮箱
        setExchangeEmail(XJTLUaccount || "");
        setShowExchangeConnectModal(true);
    };

    const executeConnectExchange = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowExchangeConnectModal(false);
        setLoading(true);
        setStatusError("");
        try {
            await startExchangeAuth(exchangeEmail);
            // 如果绑定成功，通常会刷新整个页面或通过消息通知。
            // 这里只是简单的更新状态。实际的账户信息更新依赖于后端的绑定逻辑。
            if (exchangeEmail) {
                setXJTLUaccount(exchangeEmail);
                localStorage.setItem("user_XJTLUaccount", exchangeEmail);
            }
            // 为了确保状态最新，延迟一点再刷新
            setTimeout(() => handleRefreshStatus(), 1000);
        } catch (err: any) {
            setStatusError("Exchange 绑定失败或被取消");
        } finally {
            setLoading(false);
        }
    };

    const handleUnbindExchange = async () => {
        if (
            !window.confirm(
                "确定要解除 Exchange 邮箱绑定吗？这将停止邮件智能分析和日历同步功能。",
            )
        )
            return;
        setLoading(true);
        try {
            await unbindExchange();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || "解绑失败");
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
            setStatusError("SMTP 绑定失败: " + (err.message || "未知错误"));
        } finally {
            setLoading(false);
        }
    };

    const handleUnbindSmtp = async () => {
        if (
            !window.confirm(
                "确定要解除 IMAP 邮箱绑定吗？这将停止 IMAP 邮件分析功能。",
            )
        )
            return;
        setLoading(true);
        try {
            await unbindSmtp();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || "解绑失败");
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
            setStatusError(err.message || "刷新状态失败");
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

    const handleSyncTimetable = async () => {
        setSyncLoading(true);
        try {
            const result = await syncTimetable();
            setResultModalData({
                title: "同步成功",
                message: `课表同步成功！新增: ${result.added}, 错误: ${result.errors}`,
                isError: false,
            });
            setShowResultModal(true);
        } catch (err: any) {
            setResultModalData({
                title: "同步失败",
                message: err.message || "课表同步失败",
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
                title: "操作成功",
                message: result.message,
                isError: false,
            });
            setShowResultModal(true);
        } catch (err: any) {
            setResultModalData({
                title: "操作失败",
                message: err.message || "删除课程表日程失败",
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
            setStatusError("CalDAV 绑定失败: " + (err.message || "未知错误"));
        } finally {
            setCalDavLoading(false);
        }
    };

    const handleUnbindCalDav = async () => {
        if (
            !window.confirm(
                "确定要解除 CalDAV 日历绑定吗？这将停止日历同步功能。",
            )
        )
            return;
        setCalDavLoading(true);
        try {
            await unbindCalDav();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || "解绑失败");
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
                "CalDAV 服务器启用失败: " + (err.message || "未知错误"),
            );
        } finally {
            setCalDavServerLoading(false);
        }
    };

    const handleDisableCalDavServer = async () => {
        if (!window.confirm("确定要停用平台 CalDAV 服务器吗？")) return;
        setCalDavServerLoading(true);
        try {
            await disableCalDavServer();
            await handleRefreshStatus();
        } catch (err: any) {
            setStatusError(err.message || "停用失败");
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
            setCalDavSyncError(err.message || "同步失败");
            setCalDavSyncResult(null);
            setShowCalDavSyncModal(true);
        } finally {
            setCalDavSyncLoading(false);
        }
    };

    const renderConnectionStatus = () => {
        if (statusLoading) {
            return <div className="status-loading">正在检查连接状态...</div>;
        }

        if (statusError) {
            return <div className="status-error">{statusError}</div>;
        }

        return (
            <Card className="connection-panel">
                <CardHeader>
                    <CardTitle>服务连接状态</CardTitle>
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
                                    任务同步与管理
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${msTodoStatus?.connected ? "online" : ""}`}
                                >
                                    {msTodoStatus?.connected
                                        ? "已连接"
                                        : "未连接"}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {!msTodoStatus?.connected && (
                                    <Button
                                        onClick={handleConnectMicrosoft}
                                        variant="primary"
                                        size="sm"
                                    >
                                        连接
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
                                    Exchange 邮箱
                                </span>
                                <span className="conn-meta">
                                    {ebridgeStatus?.exchangeBinded
                                        ? "已绑定"
                                        : "XJTLU 学校邮箱"}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${ebridgeStatus?.exchangeBinded ? "online" : ""}`}
                                >
                                    {ebridgeStatus?.exchangeBinded
                                        ? "已绑定"
                                        : "未绑定"}
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
                                        解绑
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConnectExchange}
                                        variant="primary"
                                        size="sm"
                                    >
                                        绑定
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
                                <span className="conn-label">IMAP 邮箱</span>
                                <span className="conn-meta">
                                    {ebridgeStatus?.smtpBinded
                                        ? ebridgeStatus.smtpEmail || "已绑定"
                                        : "IMAP/SMTP 协议"}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${ebridgeStatus?.smtpBinded ? "online" : ""}`}
                                >
                                    {ebridgeStatus?.smtpBinded
                                        ? "已绑定"
                                        : "未绑定"}
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
                                        解绑
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConnectSmtp}
                                        variant="primary"
                                        size="sm"
                                    >
                                        绑定
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
                                    CalDAV 日历（外部）
                                </span>
                                <span className="conn-meta">
                                    {calDavStatus?.enabled
                                        ? calDavStatus.calendarUrl || "已连接"
                                        : "绑定外部 CalDAV 日历"}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${calDavStatus?.enabled ? "online" : ""}`}
                                >
                                    {calDavStatus?.enabled
                                        ? "已连接"
                                        : "未连接"}
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
                                        解绑
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleConnectCalDav}
                                        variant="primary"
                                        size="sm"
                                    >
                                        绑定
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
                                    平台 CalDAV 服务器
                                </span>
                                <span className="conn-meta">
                                    {calDavServerStatus?.enabled
                                        ? calDavServerStatus.serverUrl ||
                                          "已启用"
                                        : "平台内置日历同步服务"}
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${calDavServerStatus?.enabled ? "online" : ""}`}
                                >
                                    {calDavServerStatus?.enabled
                                        ? "已启用"
                                        : "未启用"}
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
                                            详情
                                        </Button>
                                        <Button
                                            onClick={handleDisableCalDavServer}
                                            variant="ghost"
                                            size="sm"
                                            className="conn-unbind"
                                            disabled={calDavServerLoading}
                                        >
                                            停用
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
                                            ? "启用中..."
                                            : "启用"}
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
                                    Ebridge 教务系统
                                </span>
                                <span className="conn-meta">
                                    课程与考试信息
                                </span>
                            </div>
                            <div className="conn-state">
                                <span
                                    className={`conn-tag ${ebridgeStatus?.connected ? "online" : ""}`}
                                >
                                    {ebridgeStatus?.connected
                                        ? "已连接"
                                        : "未连接"}
                                </span>
                            </div>
                            <div className="conn-actions">
                                {!ebridgeStatus?.connected && (
                                    <Button
                                        onClick={openEbridgePopup}
                                        variant="primary"
                                        size="sm"
                                    >
                                        连接
                                    </Button>
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
                                            同步课表
                                        </span>
                                        <span className="conn-meta">
                                            从教务系统获取最新课程
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
                                                ? "同步中..."
                                                : "立即同步"}
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
                                            清空课表
                                        </span>
                                        <span className="conn-meta">
                                            删除所有导入的课程日程
                                        </span>
                                    </div>
                                    <div className="conn-actions">
                                        <Button
                                            onClick={handleDeleteTimetable}
                                            disabled={syncLoading}
                                            variant="danger"
                                            size="sm"
                                        >
                                            删除全部
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
                                            同步 CalDAV 日历
                                        </span>
                                        <span className="conn-meta">
                                            双向同步日程数据
                                            {calDavStatus?.lastSyncAt
                                                ? `（上次同步: ${new Date(calDavStatus.lastSyncAt).toLocaleString()}）`
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
                                                ? "同步中..."
                                                : "立即同步"}
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
                            <RefreshCw size={14} /> <span>刷新</span>
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
                                {tokenCopied ? "已复制" : "复制 MCP Token"}
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

        // Default Dashboard View
        return (
            <div className="settings-page">
                <Card>
                    <CardHeader>
                        <CardTitle>账号信息</CardTitle>
                    </CardHeader>
                    <CardContent className="account-info">
                        <div className="info-item">
                            <span className="info-label">登录邮箱:</span>
                            <span className="info-value">{email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">XJTLU 账号:</span>
                            <span className="info-value">
                                {XJTLUaccount || "未设置"}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">退出登录:</span>
                            <Button variant="danger" onClick={handleLogout}>
                                <LogOut size={18} /> 退出登录
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>周次设置</CardTitle>
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
                                <strong>当前周（含偏移）: </strong>
                                {weekInfo
                                    ? weekInfo.effectiveWeek
                                    : "加载中..."}
                            </div>
                            <div>
                                <small>
                                    学年基准周:{" "}
                                    {weekInfo ? weekInfo.rawWeekNumber : "-"},
                                    全局偏移:{" "}
                                    {weekInfo ? weekInfo.globalWeekOffset : "-"}
                                    , 您的偏移:{" "}
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
                                    设置当前周数
                                </Button>
                            </div>
                            {weekError && (
                                <div className="error-message">{weekError}</div>
                            )}
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
            </div>
        );
    };

    const renderNavItems = () => (
        <>
            <button
                className={`nav-item ${view === "today-schedule" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/today")}
            >
                <ListTodo size={20} />{" "}
                <span className="nav-text">今日日程</span>
            </button>
            <button
                className={`nav-item ${view === "all-schedule" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/all")}
            >
                <Calendar size={20} />{" "}
                <span className="nav-text">全部日程</span>
            </button>
            <button
                className={`nav-item ${view === "search-schedule" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/search")}
            >
                <Search size={20} /> <span className="nav-text">搜索任务</span>
            </button>
            <button
                className={`nav-item ${view === "queue" ? "active" : ""}`}
                onClick={() => handleNavClick("/schedule/queue")}
            >
                <Check size={20} /> <span className="nav-text">待审批日程</span>
            </button>
            <button
                className={`nav-item ${view === "chat" ? "active" : ""}`}
                onClick={() => handleNavClick("/chat")}
            >
                <MessageSquare size={20} />{" "}
                <span className="nav-text">AI 助手</span>
            </button>
            <button
                className={`nav-item ${view === "logs" ? "active" : ""}`}
                onClick={() => handleNavClick("/logs")}
            >
                <FileText size={20} />{" "}
                <span className="nav-text">系统日志</span>
            </button>
        </>
    );

    return (
        <div
            className={`dashboard-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${isMobile ? "mobile-layout" : ""}`}
        >
            {isMobile ? (
                <header
                    className={`mobile-header ${isMobileMenuOpen ? "open" : ""}`}
                >
                    <div className="mobile-header-top">
                        <h1 className="logo-text">
                            <img src={logo} alt="时锚" className="app-logo" />{" "}
                            <span>时锚</span>
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
                    <nav
                        className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
                    >
                        {renderNavItems()}
                        <div className="mobile-nav-footer">
                            <button
                                className={`nav-item ${!view || view === "dashboard" ? "active" : ""}`}
                                onClick={() => handleNavClick("/dashboard")}
                            >
                                <LayoutDashboard size={20} />{" "}
                                <span className="nav-text">设置</span>
                            </button>
                        </div>
                    </nav>
                </header>
            ) : (
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h1 className="logo-text">
                            <img src={logo} alt="时间锚" className="app-logo" />{" "}
                            <span>时间锚</span>
                        </h1>
                        <ToggleButton
                            isToggled={isSidebarCollapsed}
                            onToggle={toggleSidebar}
                            toggledIcon={<PanelLeftOpen size={20} />}
                            untoggledIcon={<PanelLeftClose size={20} />}
                            toggledClassName=""
                        />
                    </div>
                    <nav className="sidebar-nav">{renderNavItems()}</nav>
                    <div className="sidebar-footer">
                        <button
                            className={`nav-item ${!view || view === "dashboard" ? "active" : ""}`}
                            onClick={() => handleNavClick("/dashboard")}
                        >
                            <LayoutDashboard size={20} />{" "}
                            <span className="nav-text">设置</span>
                        </button>
                    </div>
                </aside>
            )}

            <main className="main-content">
                {renderMainContent()}

                <Modal
                    isOpen={showExchangeConnectModal}
                    onClose={() => setShowExchangeConnectModal(false)}
                    title="连接 Exchange 邮箱"
                >
                    <div className="exchange-connect-modal">
                        <p
                            className="modal-description"
                            style={{
                                marginBottom: "15px",
                                color: "#666",
                                fontSize: "14px",
                            }}
                        >
                            请输入您的学校邮箱（例如:
                            san.zhang23@student.xjtlu.edu.cn）。
                            <br />
                            系统将引导您通过 XJTLU UIM 进行统一身份认证。
                            <br />
                            <span style={{ color: "#d9534f" }}>
                                注意：必须使用学校邮箱登录 Exchange，因为
                                Microsoft To Do 通常使用的是个人账户。
                            </span>
                        </p>
                        <form onSubmit={executeConnectExchange}>
                            <Input
                                label="学校邮箱"
                                type="email"
                                id="exchangeEmail"
                                value={exchangeEmail}
                                onChange={(e) =>
                                    setExchangeEmail(e.target.value)
                                }
                                required
                                placeholder="例如: san.zhang23@student.xjtlu.edu.cn"
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
                                        setShowExchangeConnectModal(false)
                                    }
                                >
                                    取消
                                </Button>
                                <Button type="submit">前往认证</Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={showSmtpConnectModal}
                    onClose={() => setShowSmtpConnectModal(false)}
                    title="连接 SMTP/IMAP 邮箱"
                >
                    <div className="smtp-connect-modal">
                        <p
                            className="modal-description"
                            style={{
                                marginBottom: "15px",
                                color: "#666",
                                fontSize: "14px",
                            }}
                        >
                            请输入您的邮箱 IMAP/SMTP 服务器信息以连接邮箱。
                            <br />
                            常见设置:
                            <br />• QQ邮箱: imap.qq.com / 993 / TLS
                            <br />• 163邮箱: imap.163.com / 993 / TLS
                            <br />• Gmail: imap.gmail.com / 993 / TLS
                            <br />• Outlook: outlook.office365.com / 993 / TLS
                        </p>
                        <form onSubmit={executeConnectSmtp}>
                            <Input
                                label="邮箱地址"
                                type="email"
                                id="smtpEmail"
                                value={smtpEmail}
                                onChange={(e) => setSmtpEmail(e.target.value)}
                                required
                                placeholder="例如: example@qq.com"
                            />
                            <Input
                                label="邮箱密码/授权码"
                                type="password"
                                id="smtpPassword"
                                value={smtpPassword}
                                onChange={(e) =>
                                    setSmtpPassword(e.target.value)
                                }
                                required
                                placeholder="请输入邮箱密码或IMAP授权码"
                            />
                            <Input
                                label="IMAP 服务器"
                                type="text"
                                id="smtpHost"
                                value={smtpHost}
                                onChange={(e) => setSmtpHost(e.target.value)}
                                required
                                placeholder="例如: imap.qq.com"
                            />
                            <div style={{ display: "flex", gap: "10px" }}>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        label="端口"
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
                                        TLS 加密
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
                                    取消
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "连接中..." : "确认绑定"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={showUnboundModal}
                    onClose={() => setShowUnboundModal(false)}
                    title="账号绑定提醒"
                    footer={
                        <Button onClick={() => setShowUnboundModal(false)}>
                            我知道了
                        </Button>
                    }
                >
                    <p>检测到您有尚未绑定的账号：</p>
                    <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                        {!msTodoStatus?.connected && (
                            <li>Microsoft To Do 未连接</li>
                        )}
                        {!ebridgeStatus?.connected && <li>Ebridge 未连接</li>}
                    </ul>
                    <p>为了确保功能正常使用，请尽快完成绑定。</p>
                </Modal>

                <Modal
                    isOpen={showDeleteConfirmModal}
                    onClose={() => setShowDeleteConfirmModal(false)}
                    title="确认删除"
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
                                取消
                            </Button>
                            <Button
                                variant="danger"
                                onClick={executeDeleteTimetable}
                            >
                                确认删除
                            </Button>
                        </div>
                    }
                >
                    <p>确定要删除所有课程表导入的日程吗？此操作无法撤销。</p>
                </Modal>

                <Modal
                    isOpen={showResultModal}
                    onClose={() => setShowResultModal(false)}
                    title={resultModalData.title}
                    footer={
                        <Button onClick={() => setShowResultModal(false)}>
                            确定
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
                    title="连接 CalDAV 日历"
                >
                    <div className="smtp-connect-modal">
                        <p
                            className="modal-description"
                            style={{
                                marginBottom: "15px",
                                color: "#666",
                                fontSize: "14px",
                            }}
                        >
                            请输入您的 CalDAV 服务器信息以连接外部日历。
                            <br />
                            常见设置:
                            <br />• iCloud: caldav.icloud.com / 你的 Apple ID
                            <br />• Google Calendar:
                            apidata.googleusercontent.com/caldav/v2
                            <br />• Nextcloud: your-nextcloud.com/remote.php/dav
                            <br />• Baikal / Radicale: 填写您的自建服务器地址
                        </p>
                        <form onSubmit={executeConnectCalDav}>
                            <Input
                                label="CalDAV 服务器地址 (Base URL)"
                                type="url"
                                id="calDavBaseUrl"
                                value={calDavBaseUrl}
                                onChange={(e) =>
                                    setCalDavBaseUrl(e.target.value)
                                }
                                required
                                placeholder="例如: https://caldav.icloud.com"
                            />
                            <Input
                                label="用户名"
                                type="text"
                                id="calDavUsername"
                                value={calDavUsername}
                                onChange={(e) =>
                                    setCalDavUsername(e.target.value)
                                }
                                required
                                placeholder="CalDAV 账户用户名"
                            />
                            <Input
                                label="密码 / 应用专用密码"
                                type="password"
                                id="calDavPassword"
                                value={calDavPassword}
                                onChange={(e) =>
                                    setCalDavPassword(e.target.value)
                                }
                                required
                                placeholder="请输入密码或应用专用密码"
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
                                    取消
                                </Button>
                                <Button type="submit" disabled={calDavLoading}>
                                    {calDavLoading ? "连接中..." : "确认绑定"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={showCalDavSyncModal}
                    onClose={() => setShowCalDavSyncModal(false)}
                    title={
                        calDavSyncError ? "CalDAV 同步失败" : "CalDAV 同步结果"
                    }
                    footer={
                        <Button onClick={() => setShowCalDavSyncModal(false)}>
                            确定
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
                                    background: "#f0fdf4",
                                    padding: "12px",
                                    borderRadius: "8px",
                                }}
                            >
                                <strong>
                                    拉取 (Pull) - 从外部日历同步到本平台：
                                </strong>
                                <ul
                                    style={{
                                        margin: "8px 0 0 20px",
                                        padding: 0,
                                    }}
                                >
                                    <li>
                                        新建: {calDavSyncResult.pulled.created}
                                    </li>
                                    <li>
                                        更新: {calDavSyncResult.pulled.updated}
                                    </li>
                                    <li>
                                        跳过冲突:{" "}
                                        {
                                            calDavSyncResult.pulled
                                                .skippedConflicts
                                        }
                                    </li>
                                    <li>
                                        错误: {calDavSyncResult.pulled.errors}
                                    </li>
                                </ul>
                            </div>
                            <div
                                style={{
                                    background: "#eff6ff",
                                    padding: "12px",
                                    borderRadius: "8px",
                                }}
                            >
                                <strong>
                                    推送 (Push) - 从本平台同步到外部日历：
                                </strong>
                                <ul
                                    style={{
                                        margin: "8px 0 0 20px",
                                        padding: 0,
                                    }}
                                >
                                    <li>
                                        新建: {calDavSyncResult.pushed.created}
                                    </li>
                                    <li>
                                        更新: {calDavSyncResult.pushed.updated}
                                    </li>
                                    <li>
                                        跳过冲突:{" "}
                                        {
                                            calDavSyncResult.pushed
                                                .skippedConflicts
                                        }
                                    </li>
                                    <li>
                                        错误: {calDavSyncResult.pushed.errors}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : null}
                </Modal>

                <Modal
                    isOpen={showWeekModal}
                    onClose={() => setShowWeekModal(false)}
                    title="设置当前周数"
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
                                取消
                            </Button>
                            <Button
                                onClick={async () => {
                                    setWeekError("");
                                    setWeekLoading(true);
                                    try {
                                        if (desiredWeek === "")
                                            throw new Error("请输入周数");
                                        await setCurrentWeek(
                                            Number(desiredWeek),
                                        );
                                        setShowWeekModal(false);
                                    } catch (err: any) {
                                        setWeekError(err.message || "设置失败");
                                    } finally {
                                        setWeekLoading(false);
                                    }
                                }}
                                disabled={weekLoading}
                            >
                                {weekLoading ? "保存中..." : "保存"}
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
                            <strong>当前周（含偏移）: </strong>
                            {weekInfo ? weekInfo.effectiveWeek : "加载中..."}
                        </div>
                        <div>
                            <small>
                                学年基准周:{" "}
                                {weekInfo ? weekInfo.rawWeekNumber : "-"},
                                全局偏移:{" "}
                                {weekInfo ? weekInfo.globalWeekOffset : "-"},
                                您的偏移:{" "}
                                {weekInfo ? weekInfo.userWeekOffset : "-"}
                            </small>
                        </div>
                        <Input
                            label="设置当前周数"
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
                            placeholder="输入想要的当前周（例如 5）"
                        />
                        {weekError && (
                            <div className="error-message">{weekError}</div>
                        )}
                    </div>
                </Modal>

                <Modal
                    isOpen={showCalDavServerDetailModal}
                    onClose={() => setShowCalDavServerDetailModal(false)}
                    title="平台 CalDAV 连接信息"
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
            </main>
        </div>
    );
};

export default Dashboard;
