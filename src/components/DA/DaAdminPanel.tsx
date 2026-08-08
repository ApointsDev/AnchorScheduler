import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import {
    getDaAdminEvents,
    createDaEvent,
    updateDaEvent,
    deleteDaEvent,
    getDaQueue,
    approveDaQueueItem,
    rejectDaQueueItem,
    importDaText,
    getDaSettings,
    updateDaSettings,
    refreshDaMail,
    getDaStudents,
    setDaAdminStudentOptin,
    type DaEvent,
    type DaQueueItem,
    type DaSettings,
    type DaPageConfig,
    type DaStudentRow,
} from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import Switch from "../ui/Switch";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    RefreshCw,
    ArrowLeft,
    Mail,
    AlertCircle,
    Users,
    FileText,
    Inbox,
    Calendar,
    Settings as SettingsIcon,
    Clock,
    MapPin,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import "../../styles/da.css";

type Tab = "events" | "queue" | "import" | "settings" | "students";

interface EventForm {
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    allDay: boolean;
    category: string;
}

const emptyEventForm: EventForm = {
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    allDay: false,
    category: "school_event",
};

/** 解析队列 rawRequest 预览字段 */
function parseQueueArgs(row: DaQueueItem): any {
    try {
        const parsed = JSON.parse(row.rawRequest);
        return parsed?.args || parsed || {};
    } catch {
        return {};
    }
}

function formatQueueTime(args: any): string {
    if (args.startTime) {
        try {
            return format(parseISO(args.startTime), "MM-dd HH:mm");
        } catch {
            return String(args.startTime).slice(0, 16);
        }
    }
    if (args.dueDate) {
        try {
            return format(parseISO(args.dueDate), "MM-dd HH:mm");
        } catch {
            return String(args.dueDate).slice(0, 16);
        }
    }
    return "";
}

const DaAdminPanel: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { slug } = useParams<{ slug: string }>();
    const [tab, setTab] = useState<Tab>("events");

    // 事件
    const [events, setEvents] = useState<DaEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [eventModal, setEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<DaEvent | null>(null);
    const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm);
    const [savingEvent, setSavingEvent] = useState(false);
    const [eventError, setEventError] = useState("");

    // 队列
    const [queue, setQueue] = useState<{
        schedule: DaQueueItem[];
        todo: DaQueueItem[];
    }>({ schedule: [], todo: [] });
    const [loadingQueue, setLoadingQueue] = useState(false);

    // 导入
    const [importText, setImportText] = useState("");
    const [importing, setImporting] = useState(false);
    const [importMsg, setImportMsg] = useState("");

    // 设置
    const [settings, setSettings] = useState<DaSettings | null>(null);
    const [page, setPage] = useState<DaPageConfig | null>(null);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [settingsMsg, setSettingsMsg] = useState("");

    // 学生
    const [students, setStudents] = useState<DaStudentRow[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    const showNotice = (m: string) => {
        setNotice(m);
        setTimeout(() => setNotice(""), 3000);
    };

    const loadEvents = useCallback(async () => {
        if (!slug) return;
        setLoadingEvents(true);
        try {
            setEvents(await getDaAdminEvents(slug));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoadingEvents(false);
        }
    }, [slug]);

    const loadQueue = useCallback(async () => {
        if (!slug) return;
        setLoadingQueue(true);
        try {
            setQueue(await getDaQueue(slug));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoadingQueue(false);
        }
    }, [slug]);

    const loadSettings = useCallback(async () => {
        if (!slug) return;
        setLoadingSettings(true);
        try {
            const res = await getDaSettings(slug);
            setSettings(res.settings);
            setPage(res.page);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoadingSettings(false);
        }
    }, [slug]);

    const loadStudents = useCallback(async () => {
        if (!slug) return;
        setLoadingStudents(true);
        try {
            const res = await getDaStudents(slug);
            setStudents(res.students);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoadingStudents(false);
        }
    }, [slug]);

    useEffect(() => {
        loadEvents();
        loadQueue();
        loadSettings();
    }, [loadEvents, loadQueue, loadSettings]);

    const openCreateEvent = () => {
        setEditingEvent(null);
        setEventForm(emptyEventForm);
        setEventError("");
        setEventModal(true);
    };

    const openEditEvent = (ev: DaEvent) => {
        setEditingEvent(ev);
        setEventForm({
            name: ev.name,
            description: ev.description || "",
            startTime: ev.startTime ? ev.startTime.slice(0, 16) : "",
            endTime: ev.endTime ? ev.endTime.slice(0, 16) : "",
            location: ev.location || "",
            allDay: !!ev.allDay,
            category: ev.category || "school_event",
        });
        setEventError("");
        setEventModal(true);
    };

    const saveEvent = async () => {
        if (!slug) return;
        if (!eventForm.name.trim()) {
            setEventError(t("da.eventName"));
            return;
        }
        setSavingEvent(true);
        setEventError("");
        try {
            const payload = {
                name: eventForm.name.trim(),
                description: eventForm.description,
                startTime: eventForm.startTime
                    ? new Date(eventForm.startTime).toISOString()
                    : undefined,
                endTime: eventForm.endTime
                    ? new Date(eventForm.endTime).toISOString()
                    : undefined,
                location: eventForm.location,
                allDay: eventForm.allDay,
                category: eventForm.category,
            };
            if (editingEvent) {
                await updateDaEvent(slug, editingEvent.id, payload);
            } else {
                await createDaEvent(slug, payload);
            }
            setEventModal(false);
            showNotice(t("common.success"));
            await loadEvents();
        } catch (e: any) {
            setEventError(e.message);
        } finally {
            setSavingEvent(false);
        }
    };

    const removeEvent = async (ev: DaEvent) => {
        if (!slug) return;
        if (!window.confirm(t("da.confirmDeleteEvent"))) return;
        try {
            await deleteDaEvent(slug, ev.id);
            await loadEvents();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const doApprove = async (id: string) => {
        if (!slug) return;
        try {
            await approveDaQueueItem(slug, id);
            showNotice(t("da.approve"));
            await loadQueue();
            await loadEvents();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const doReject = async (id: string) => {
        if (!slug) return;
        try {
            await rejectDaQueueItem(slug, id);
            await loadQueue();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const doImport = async () => {
        if (!slug) return;
        if (!importText.trim()) {
            setImportMsg(t("da.importPlaceholder"));
            return;
        }
        setImporting(true);
        setImportMsg("");
        try {
            const res = await importDaText(slug, importText);
            setImportMsg(
                `${t("da.importSuccess")} (schedule: ${res.queuedSchedules.length}, todo: ${res.queuedTodos.length})`,
            );
            setImportText("");
            await loadQueue();
        } catch (e: any) {
            setImportMsg(e.message);
        } finally {
            setImporting(false);
        }
    };

    const saveSettings = async () => {
        if (!slug || !settings || !page) return;
        setSavingSettings(true);
        setSettingsMsg("");
        try {
            const res = await updateDaSettings(slug, {
                settings,
                page,
            });
            setSettings(res.settings);
            setPage(res.page);
            setSettingsMsg(t("da.settingsSaved"));
            setTimeout(() => setSettingsMsg(""), 3000);
        } catch (e: any) {
            setSettingsMsg(e.message);
        } finally {
            setSavingSettings(false);
        }
    };

    const doRefreshMail = async () => {
        if (!slug) return;
        try {
            await refreshDaMail(slug);
            showNotice(t("da.mailRefreshed"));
        } catch (e: any) {
            setError(e.message);
        }
    };

    const toggleStudent = async (row: DaStudentRow) => {
        if (!slug) return;
        try {
            await setDaAdminStudentOptin(slug, row.userId, !row.optedIn);
            await loadStudents();
        } catch (e: any) {
            setError(e.message);
        }
    };

    const setSetting = (key: string, value: string | boolean) => {
        setSettings((s) => (s ? { ...s, [key]: String(value) } : s));
    };

    const pendingCount =
        queue.schedule.length + queue.todo.length;

    const renderQueueList = (items: DaQueueItem[], isTodo: boolean) => {
        if (items.length === 0) return null;
        return (
            <div>
                {isTodo && (
                    <div className="da-row-sub" style={{ margin: "8px 0 4px" }}>
                        {t("da.pendingApproval")} · todo
                    </div>
                )}
                {items.map((item) => {
                    const args = parseQueueArgs(item);
                    const name = String(args.name || item.id);
                    const time = formatQueueTime(args);
                    return (
                        <div key={item.id} className="da-admin-list-item">
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="da-row-title">{name}</div>
                                <div className="da-row-sub">
                                    {time && (
                                        <>
                                            <Clock size={13} /> {time}
                                        </>
                                    )}
                                    {args.location && (
                                        <>
                                            {" "}
                                            · <MapPin size={13} />{" "}
                                            {args.location}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => doApprove(item.id)}
                                >
                                    <Check size={15} /> {t("da.approve")}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => doReject(item.id)}
                                >
                                    <X size={15} /> {t("da.reject")}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="da-admin">
            <div className="da-admin-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Link to="/admin/da" className="da-back">
                        <ArrowLeft size={16} />
                    </Link>
                    <h2>DA · {slug}</h2>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={doRefreshMail}
                    title={t("da.refreshMail")}
                >
                    <RefreshCw size={15} />
                </Button>
            </div>

            {error && (
                <div className="da-error" style={{ padding: 8, marginBottom: 16 }}>
                    <AlertCircle size={18} />
                    <p style={{ margin: 0, fontSize: "0.85rem" }}>{error}</p>
                </div>
            )}
            {notice && (
                <div className="da-empty" style={{ padding: 8, marginBottom: 16, color: "var(--color-success, #16a34a)" }}>
                    {notice}
                </div>
            )}

            <div className="da-tabs">
                <button
                    className={`da-tab ${tab === "events" ? "da-tab-active" : ""}`}
                    onClick={() => setTab("events")}
                >
                    <Calendar size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {t("da.events")}
                </button>
                <button
                    className={`da-tab ${tab === "queue" ? "da-tab-active" : ""}`}
                    onClick={() => {
                        setTab("queue");
                        loadQueue();
                    }}
                >
                    <Inbox size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {t("da.pendingApproval")}
                    {pendingCount > 0 && (
                        <span className="da-tab-badge">{pendingCount}</span>
                    )}
                </button>
                <button
                    className={`da-tab ${tab === "import" ? "da-tab-active" : ""}`}
                    onClick={() => setTab("import")}
                >
                    <FileText size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {t("da.submitEvents")}
                </button>
                <button
                    className={`da-tab ${tab === "settings" ? "da-tab-active" : ""}`}
                    onClick={() => setTab("settings")}
                >
                    <SettingsIcon size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {t("da.schoolSettings")}
                </button>
                <button
                    className={`da-tab ${tab === "students" ? "da-tab-active" : ""}`}
                    onClick={() => {
                        setTab("students");
                        loadStudents();
                    }}
                >
                    <Users size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
                    {t("da.students")}
                </button>
            </div>

            {/* ── 事件管理 ── */}
            {tab === "events" && (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <Button onClick={openCreateEvent}>
                            <Plus size={16} style={{ marginRight: 6 }} />
                            {t("da.newEvent")}
                        </Button>
                    </div>
                    {loadingEvents ? (
                        <LoadingSpinner text={t("common.loading")} />
                    ) : (
                        <Card>
                            <CardContent>
                                {events.length === 0 && (
                                    <div className="da-empty">
                                        {t("da.noEvents")}
                                    </div>
                                )}
                                {events.map((ev) => (
                                    <div
                                        key={ev.id}
                                        className="da-admin-list-item"
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="da-row-title">
                                                {ev.name}
                                            </div>
                                            <div className="da-row-sub">
                                                {ev.startTime
                                                    ? format(
                                                          parseISO(ev.startTime),
                                                          "yyyy-MM-dd HH:mm",
                                                      )
                                                    : ""}
                                                {ev.location && (
                                                    <>
                                                        {" "}
                                                        · <MapPin size={13} />{" "}
                                                        {ev.location}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 8,
                                            }}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    openEditEvent(ev)
                                                }
                                            >
                                                <Pencil size={15} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeEvent(ev)}
                                            >
                                                <Trash2 size={15} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* ── 待审批 ── */}
            {tab === "queue" && (
                <Card>
                    <CardContent>
                        {loadingQueue ? (
                            <LoadingSpinner text={t("common.loading")} />
                        ) : (
                            <>
                                {renderQueueList(queue.schedule, false)}
                                {renderQueueList(queue.todo, true)}
                                {pendingCount === 0 && (
                                    <div className="da-empty">
                                        {t("da.noEvents")}
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── 导入 ── */}
            {tab === "import" && (
                <Card>
                    <CardContent>
                        <div className="da-form">
                            <div className="da-form-row">
                                <label>{t("da.submitEvents")}</label>
                                <textarea
                                    className="da-textarea"
                                    rows={8}
                                    value={importText}
                                    onChange={(e) =>
                                        setImportText(e.target.value)
                                    }
                                    placeholder={t("da.importPlaceholder")}
                                />
                            </div>
                            {importMsg && (
                                <div className="da-row-sub">{importMsg}</div>
                            )}
                            <div className="da-form-actions">
                                <Button
                                    onClick={doImport}
                                    disabled={importing}
                                >
                                    {importing
                                        ? t("common.saving")
                                        : t("da.importBtn")}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── 设置 ── */}
            {tab === "settings" && (
                <Card>
                    <CardContent>
                        {loadingSettings || !settings || !page ? (
                            <LoadingSpinner text={t("common.loading")} />
                        ) : (
                            <div className="da-form">
                                <div className="da-form-row">
                                    <label>{t("da.pageTitle")}</label>
                                    <Input
                                        value={page.title}
                                        onChange={(e) =>
                                            setPage({
                                                ...page,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="da-form-row">
                                    <label>{t("da.pageIntro")}</label>
                                    <textarea
                                        className="da-textarea"
                                        rows={3}
                                        value={page.intro}
                                        onChange={(e) =>
                                            setPage({
                                                ...page,
                                                intro: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="da-form-row">
                                    <label>{t("da.pageContact")}</label>
                                    <Input
                                        value={page.contact}
                                        onChange={(e) =>
                                            setPage({
                                                ...page,
                                                contact: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="da-row">
                                    <div>
                                        <div className="da-row-title">
                                            {t("da.mailEnabled")}
                                        </div>
                                        <div className="da-row-sub">
                                            {t("da.mailHost")} /{" "}
                                            {t("da.mailPort")}
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.mailEnabled === "1"}
                                        onChange={(v) =>
                                            setSetting("mailEnabled", v ? "1" : "0")
                                        }
                                    />
                                </div>

                                {settings.mailEnabled === "1" && (
                                    <>
                                        <div className="da-form-row">
                                            <label>{t("da.mailHost")}</label>
                                            <Input
                                                value={settings.mailHost}
                                                onChange={(e) =>
                                                    setSetting(
                                                        "mailHost",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="imap.xjtlu.edu.cn"
                                            />
                                        </div>
                                        <div className="da-form-row">
                                            <label>{t("da.mailPort")}</label>
                                            <Input
                                                value={settings.mailPort}
                                                onChange={(e) =>
                                                    setSetting(
                                                        "mailPort",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="993"
                                            />
                                        </div>
                                        <div className="da-row">
                                            <div className="da-row-title">
                                                {t("da.mailTls")}
                                            </div>
                                            <Switch
                                                checked={
                                                    settings.mailTls !== "0"
                                                }
                                                onChange={(v) =>
                                                    setSetting(
                                                        "mailTls",
                                                        v ? "1" : "0",
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="da-form-row">
                                            <label>
                                                {t("da.mailUsername")}
                                            </label>
                                            <Input
                                                value={settings.mailUsername}
                                                onChange={(e) =>
                                                    setSetting(
                                                        "mailUsername",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="da-form-row">
                                            <label>
                                                {t("da.mailPassword")}
                                            </label>
                                            <Input
                                                type="password"
                                                value={settings.mailPassword}
                                                onChange={(e) =>
                                                    setSetting(
                                                        "mailPassword",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="da-row">
                                    <div>
                                        <div className="da-row-title">
                                            {t("da.studentContributionEnabled")}
                                        </div>
                                        <div className="da-row-sub">
                                            {t("da.studentContribution")}
                                        </div>
                                    </div>
                                    <Switch
                                        checked={
                                            settings.studentContributionEnabled ===
                                            "1"
                                        }
                                        onChange={(v) =>
                                            setSetting(
                                                "studentContributionEnabled",
                                                v ? "1" : "0",
                                            )
                                        }
                                    />
                                </div>

                                {settings.studentContributionEnabled === "1" && (
                                    <>
                                        <div className="da-form-row">
                                            <label>
                                                {t("da.collegeDomains")}
                                            </label>
                                            <Input
                                                value={settings.collegeDomains}
                                                onChange={(e) =>
                                                    setSetting(
                                                        "collegeDomains",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="xjtlu.edu.cn, ibss.xjtlu.edu.cn"
                                            />
                                        </div>
                                        <div className="da-form-row">
                                            <label>
                                                {t("da.eventKeywords")}
                                            </label>
                                            <Input
                                                value={settings.eventKeywords}
                                                onChange={(e) =>
                                                    setSetting(
                                                        "eventKeywords",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {settingsMsg && (
                                    <div className="da-row-sub">
                                        {settingsMsg}
                                    </div>
                                )}
                                <div className="da-form-actions">
                                    <Button
                                        onClick={saveSettings}
                                        disabled={savingSettings}
                                    >
                                        {savingSettings
                                            ? t("common.saving")
                                            : t("da.saveSettings")}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── 学生贡献 ── */}
            {tab === "students" && (
                <Card>
                    <CardContent>
                        {loadingStudents ? (
                            <LoadingSpinner text={t("common.loading")} />
                        ) : (
                            <>
                                {students.length === 0 && (
                                    <div className="da-empty">
                                        {t("da.noEvents")}
                                    </div>
                                )}
                                {students.map((s) => (
                                    <div
                                        key={s.userId}
                                        className="da-admin-list-item"
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="da-row-title">
                                                {s.name || s.email}
                                            </div>
                                            <div className="da-row-sub">
                                                {s.email}
                                            </div>
                                        </div>
                                        <Switch
                                            checked={s.optedIn}
                                            onChange={() => toggleStudent(s)}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 事件编辑弹窗 */}
            <Modal
                isOpen={eventModal}
                onClose={() => setEventModal(false)}
                title={editingEvent ? t("da.editEvent") : t("da.newEvent")}
            >
                <div className="da-form">
                    <div className="da-form-row">
                        <label>{t("da.eventName")}</label>
                        <Input
                            value={eventForm.name}
                            onChange={(e) =>
                                setEventForm({
                                    ...eventForm,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="da-form-row">
                        <label>{t("da.eventDesc")}</label>
                        <textarea
                            className="da-textarea"
                            rows={3}
                            value={eventForm.description}
                            onChange={(e) =>
                                setEventForm({
                                    ...eventForm,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="da-row">
                        <div className="da-row-title">{t("da.eventAllDay")}</div>
                        <Switch
                            checked={eventForm.allDay}
                            onChange={(v) =>
                                setEventForm({
                                    ...eventForm,
                                    allDay: v,
                                })
                            }
                        />
                    </div>
                    <div className="da-form-row">
                        <label>{t("da.eventStart")}</label>
                        <Input
                            type="datetime-local"
                            value={eventForm.startTime}
                            onChange={(e) =>
                                setEventForm({
                                    ...eventForm,
                                    startTime: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="da-form-row">
                        <label>{t("da.eventEnd")}</label>
                        <Input
                            type="datetime-local"
                            value={eventForm.endTime}
                            onChange={(e) =>
                                setEventForm({
                                    ...eventForm,
                                    endTime: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="da-form-row">
                        <label>{t("da.eventLocation")}</label>
                        <Input
                            value={eventForm.location}
                            onChange={(e) =>
                                setEventForm({
                                    ...eventForm,
                                    location: e.target.value,
                                })
                            }
                        />
                    </div>
                    {eventError && (
                        <div className="da-error" style={{ padding: 8 }}>
                            <p style={{ margin: 0, fontSize: "0.85rem" }}>
                                {eventError}
                            </p>
                        </div>
                    )}
                    <div className="da-form-actions">
                        <Button
                            variant="ghost"
                            onClick={() => setEventModal(false)}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={saveEvent} disabled={savingEvent}>
                            {savingEvent
                                ? t("common.saving")
                                : t("da.saveEvent")}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
