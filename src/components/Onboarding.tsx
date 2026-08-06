import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    getCalDavServerStatus,
    enableCalDavServer,
    disableCalDavServer,
    startMicrosoftAuth,
    startExchangeAuth,
    saveEbridgeTimetableUrl,
    getMicrosoftTodoStatus,
    getEbridgeStatus,
    type CalDavServerStatus,
    type CalDavServerEnableResult,
    type MicrosoftTodoStatus,
    type EbridgeStatus,
} from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import CalDavConnectionCard from "./ui/CalDavConnectionCard";
import {
    Server,
    ChevronRight,
    Calendar,
    Mail,
    GraduationCap,
    Bot,
    CheckCircle,
    Link2,
    Building2,
    RefreshCw,
    Zap,
    ExternalLink,
    Loader2,
} from "lucide-react";
import logo from "../assets/logo.svg";
import "../styles/Onboarding.css";

interface OnboardingProps {
    onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [calDavServerStatus, setCalDavServerStatus] =
        useState<CalDavServerStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [enableResult, setEnableResult] =
        useState<CalDavServerEnableResult | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Step 2 binding state
    const [msTodoStatus, setMsTodoStatus] =
        useState<MicrosoftTodoStatus | null>(null);
    const [ebridgeStatus, setEbridgeStatus] = useState<EbridgeStatus | null>(
        null,
    );
    const [bindingLoading, setBindingLoading] = useState<string | null>(null);
    const [ebridgeUrl, setEbridgeUrl] = useState("");
    const [showEbridgeInput, setShowEbridgeInput] = useState(false);
    const [bindError, setBindError] = useState("");

    useEffect(() => {
        loadCalDavServerStatus();
        loadServiceStatus();
    }, []);

    const loadServiceStatus = async () => {
        try {
            const [msStatus, ebStatus] = await Promise.all([
                getMicrosoftTodoStatus(),
                getEbridgeStatus(),
            ]);
            setMsTodoStatus(msStatus);
            setEbridgeStatus(ebStatus);
        } catch {
            // silently fail
        }
    };

    const loadCalDavServerStatus = async () => {
        try {
            const status = await getCalDavServerStatus();
            setCalDavServerStatus(status);
        } catch {
            setCalDavServerStatus(null);
        }
    };

    const handleEnable = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await enableCalDavServer();
            setEnableResult(result);
            setCalDavServerStatus({
                enabled: true,
                serverUrl: result.serverUrl,
                principalUrl: result.principalUrl,
                calendarHomeUrl: result.calendarHomeUrl,
                calendarUrl: result.calendarUrl,
                username: result.username,
                password: result.password,
                connectionHint: `使用 ${result.serverUrl} 作为服务器地址，用户名: ${result.username}`,
            });
        } catch (err: any) {
            setError(err.message || "启用失败");
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        setLoading(true);
        setError("");
        try {
            await disableCalDavServer();
            setCalDavServerStatus({
                enabled: false,
                serverUrl: "",
                principalUrl: null,
                calendarHomeUrl: null,
                calendarUrl: null,
                username: null,
                password: null,
                connectionHint: "CalDAV 服务器未启用",
            });
            setEnableResult(null);
        } catch (err: any) {
            setError(err.message || "禁用失败");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const handleFinish = () => {
        onComplete();
        navigate("/dashboard");
    };

    // --- Binding handlers ---
    const handleBindMicrosoft = () => {
        setBindingLoading("microsoft");
        startMicrosoftAuth();
    };

    const handleBindExchange = async () => {
        setBindingLoading("exchange");
        try {
            // Exchange auth opens a popup; the user's XJTLU email is used as login hint
            await startExchangeAuth();
        } catch {
            setBindError("Exchange 绑定失败，请稍后重试");
        } finally {
            setBindingLoading(null);
        }
    };

    const handleBindEbridge = async () => {
        if (!ebridgeUrl.trim()) {
            setBindError("请输入 eBridge 课程表链接");
            return;
        }
        setBindingLoading("ebridge");
        setBindError("");
        try {
            await saveEbridgeTimetableUrl(ebridgeUrl.trim());
            setEbridgeStatus((prev) =>
                prev ? { ...prev, connected: true, binded: true } : null,
            );
            setShowEbridgeInput(false);
            setEbridgeUrl("");
        } catch (err: any) {
            setBindError(err.message || "Ebridge 绑定失败");
        } finally {
            setBindingLoading(null);
        }
    };

    // --- Step renderers ---
    const renderStep1 = () => (
        <div className="onboarding-step">
            <div className="onboarding-hero">
                <img src={logo} alt="时锚" className="onboarding-logo" />
                <h1>{t("onboarding.welcome")}</h1>
                <p className="onboarding-subtitle">{t("app.subtitle")}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("onboarding.features")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <Mail size={22} />
                            </div>
                            <div className="feature-text">
                                <strong>
                                    {t("onboarding.featureMailTitle")}
                                </strong>
                                <p>{t("onboarding.featureMailDesc")}</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <Calendar size={22} />
                            </div>
                            <div className="feature-text">
                                <strong>
                                    {t("onboarding.featureCalendarTitle")}
                                </strong>
                                <p>{t("onboarding.featureCalendarDesc")}</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <GraduationCap size={22} />
                            </div>
                            <div className="feature-text">
                                <strong>
                                    {t("onboarding.featureEbridgeTitle")}
                                </strong>
                                <p>{t("onboarding.featureEbridgeDesc")}</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <Bot size={22} />
                            </div>
                            <div className="feature-text">
                                <strong>
                                    {t("onboarding.featureAiTitle")}
                                </strong>
                                <p>{t("onboarding.featureAiDesc")}</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <CheckCircle size={22} />
                            </div>
                            <div className="feature-text">
                                <strong>
                                    {t("onboarding.featureMsTodoTitle")}
                                </strong>
                                <p>{t("onboarding.featureMsTodoDesc")}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="onboarding-actions">
                <Button onClick={() => setStep(2)} variant="primary" size="lg">
                    {t("onboarding.nextStep")} <ChevronRight size={18} />
                </Button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="onboarding-step">
            <h2>{t("onboarding.step2Title")}</h2>
            <p className="onboarding-desc">{t("onboarding.step2Desc")}</p>

            {bindError && <div className="onboarding-error">{bindError}</div>}

            <Card>
                <CardHeader>
                    <CardTitle>{t("onboarding.servicesToBind")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bind-list">
                        {/* Microsoft To Do */}
                        <div className="bind-item">
                            <div className="bind-icon">
                                <CheckCircle size={22} />
                            </div>
                            <div className="bind-info">
                                <strong>
                                    {t("onboarding.bindMicrosoftTitle")}
                                </strong>
                                <p>{t("onboarding.bindMicrosoftDesc")}</p>
                            </div>
                            {msTodoStatus?.binded ? (
                                <span className="bind-status-bound">
                                    {t("common.bound")}
                                </span>
                            ) : (
                                <Button
                                    onClick={handleBindMicrosoft}
                                    disabled={bindingLoading === "microsoft"}
                                    variant="outline"
                                    size="sm"
                                >
                                    {bindingLoading === "microsoft" ? (
                                        <>
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />{" "}
                                            {t("onboarding.redirecting")}
                                        </>
                                    ) : (
                                        <>
                                            <ExternalLink size={14} />{" "}
                                            {t("onboarding.authorizeBind")}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {/* Exchange */}
                        <div className="bind-item">
                            <div className="bind-icon">
                                <Mail size={22} />
                            </div>
                            <div className="bind-info">
                                <strong>
                                    {t("onboarding.bindExchangeTitle")}
                                </strong>
                                <p>{t("onboarding.bindExchangeDesc")}</p>
                            </div>
                            <Button
                                onClick={handleBindExchange}
                                disabled={bindingLoading === "exchange"}
                                variant="outline"
                                size="sm"
                            >
                                {bindingLoading === "exchange" ? (
                                    <>
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />{" "}
                                        {t("onboarding.authorizing")}
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink size={14} />{" "}
                                        {t("onboarding.authorizeBind")}
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Ebridge */}
                        <div className="bind-item">
                            <div className="bind-icon">
                                <Building2 size={22} />
                            </div>
                            <div className="bind-info">
                                <strong>
                                    {t("onboarding.bindEbridgeTitle")}
                                </strong>
                                <p>{t("onboarding.bindEbridgeDesc")}</p>
                            </div>
                            {ebridgeStatus?.binded ? (
                                <span className="bind-status-bound">
                                    {t("common.bound")}
                                </span>
                            ) : !showEbridgeInput ? (
                                <Button
                                    onClick={() => setShowEbridgeInput(true)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Link2 size={14} />{" "}
                                    {t("onboarding.configureLink")}
                                </Button>
                            ) : null}
                        </div>

                        {/* Ebridge URL input */}
                        {showEbridgeInput && !ebridgeStatus?.binded && (
                            <div className="bind-ebridge-input">
                                <input
                                    type="text"
                                    placeholder={t(
                                        "onboarding.ebridgePlaceholder",
                                    )}
                                    value={ebridgeUrl}
                                    onChange={(e) =>
                                        setEbridgeUrl(e.target.value)
                                    }
                                    className="ebridge-url-input"
                                />
                                <div className="ebridge-input-actions">
                                    <Button
                                        onClick={handleBindEbridge}
                                        disabled={
                                            bindingLoading === "ebridge" ||
                                            !ebridgeUrl.trim()
                                        }
                                        variant="primary"
                                        size="sm"
                                    >
                                        {bindingLoading === "ebridge" ? (
                                            <>
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />{" "}
                                                {t("common.saving")}
                                            </>
                                        ) : (
                                            t("common.save")
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowEbridgeInput(false);
                                            setEbridgeUrl("");
                                        }}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        {t("common.cancel")}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {ebridgeStatus?.binded && (
                            <div className="bind-ebridge-input">
                                <p className="ebridge-bound-note">
                                    {t("onboarding.ebridgeBoundNote")}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="onboarding-actions">
                <Button
                    onClick={() => setStep(1)}
                    variant="secondary"
                    size="lg"
                >
                    {t("onboarding.prevStep")}
                </Button>
                <Button onClick={() => setStep(3)} variant="primary" size="lg">
                    {t("onboarding.nextStep")} <ChevronRight size={18} />
                </Button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="onboarding-step">
            <h2>
                <RefreshCw size={22} className="step3-title-icon" />
                {t("onboarding.step3Title")}
            </h2>
            <p className="onboarding-desc">{t("onboarding.step3Desc")}</p>

            <Card className={calDavServerStatus?.enabled ? "card-success" : ""}>
                <CardHeader>
                    <CardTitle>
                        <Server size={20} style={{ marginRight: 8 }} />
                        {t("onboarding.caldavServer")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="caldav-server-status">
                        <div className="status-row">
                            <span className="status-label">
                                {t("onboarding.status")}
                            </span>
                            <span
                                className={`status-badge ${calDavServerStatus?.enabled ? "enabled" : "disabled"}`}
                            >
                                {calDavServerStatus?.enabled ? (
                                    <>
                                        <span className="status-dot status-dot-online" />{" "}
                                        {t("common.enabled")}
                                    </>
                                ) : (
                                    <>
                                        <span className="status-dot status-dot-offline" />{" "}
                                        {t("common.disabled")}
                                    </>
                                )}
                            </span>
                        </div>

                        {!calDavServerStatus?.enabled ? (
                            <div className="caldav-enable-section">
                                <p className="caldav-hint">
                                    {t("onboarding.enableHint")}
                                </p>
                                <Button
                                    onClick={handleEnable}
                                    disabled={loading}
                                    variant="primary"
                                    size="md"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                                style={{ marginRight: 6 }}
                                            />
                                            {t("onboarding.enabling")}
                                        </>
                                    ) : (
                                        <>
                                            <Zap
                                                size={16}
                                                style={{ marginRight: 6 }}
                                            />
                                            {t("onboarding.enableOneClick")}
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="caldav-details">
                                <div className="caldav-success-msg">
                                    {t("onboarding.caldavEnabledMessage")}
                                </div>
                                <CalDavConnectionCard
                                    serverUrl={
                                        enableResult?.serverUrl ||
                                        calDavServerStatus?.serverUrl ||
                                        ""
                                    }
                                    username={
                                        enableResult?.username ||
                                        calDavServerStatus?.username ||
                                        ""
                                    }
                                    password={
                                        enableResult?.password ||
                                        calDavServerStatus?.password ||
                                        ""
                                    }
                                    calendarUrl={
                                        enableResult?.calendarUrl ||
                                        calDavServerStatus?.calendarUrl ||
                                        ""
                                    }
                                    copiedField={copiedField}
                                    onCopy={copyToClipboard}
                                    onDisable={handleDisable}
                                    disableLoading={loading}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {error && <div className="onboarding-error">{error}</div>}

            <div className="onboarding-actions">
                <Button
                    onClick={() => setStep(2)}
                    variant="secondary"
                    size="lg"
                >
                    {t("onboarding.prevStep")}
                </Button>
                <Button onClick={handleFinish} variant="primary" size="lg">
                    {t("onboarding.finishSetup")}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="onboarding-container">
            <div className="onboarding-progress">
                <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
                    <div className="progress-dot">1</div>
                    <span>{t("onboarding.step1Label")}</span>
                </div>
                <div className="progress-line" />
                <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
                    <div className="progress-dot">2</div>
                    <span>{t("onboarding.step2Label")}</span>
                </div>
                <div className="progress-line" />
                <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
                    <div className="progress-dot">3</div>
                    <span>{t("onboarding.step3Label")}</span>
                </div>
            </div>

            <div className="onboarding-content">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default Onboarding;
