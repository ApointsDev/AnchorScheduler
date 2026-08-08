import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import {
    getDaEvents,
    getDaPage,
    type DaEvent,
    type DaPageConfig,
} from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import ViewToggle from "../ui/ViewToggle";
import LoadingSpinner from "../ui/LoadingSpinner";
import {
    format,
    startOfWeek,
    endOfWeek,
    addDays,
    startOfMonth,
    endOfMonth,
    isSameMonth,
    isSameDay,
    parseISO,
    addMonths,
    subMonths,
    isBefore,
    isAfter,
} from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    Clock,
    MapPin,
    AlertCircle,
    ArrowLeft,
    Mail,
    X,
} from "lucide-react";
import logo from "../../assets/logo.svg";
import "../../styles/Schedule.css";
import "../../styles/da.css";

type ViewMode = "month" | "week" | "list";

const DaEventsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === "zh-CN" ? zhCN : enUS;
    const monthFormat = i18n.language === "zh-CN" ? "yyyy年MM月" : "MMMM yyyy";
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<DaPageConfig | null>(null);
    const [events, setEvents] = useState<DaEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selected, setSelected] = useState<DaEvent | null>(null);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        Promise.all([getDaPage(slug), getDaEvents(slug)])
            .then(([p, ev]) => {
                setPage(p);
                setEvents(ev);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [slug]);

    const navigate = (direction: "prev" | "next" | "today") => {
        if (direction === "today") {
            setCurrentDate(new Date());
            return;
        }
        if (viewMode === "month") {
            setCurrentDate((d) =>
                direction === "prev" ? subMonths(d, 1) : addMonths(d, 1),
            );
        } else if (viewMode === "week") {
            setCurrentDate((d) =>
                direction === "prev" ? addDays(d, -7) : addDays(d, 7),
            );
        } else {
            // 列表视图：整体平移 30 天
            setCurrentDate((d) =>
                direction === "prev" ? addDays(d, -30) : addDays(d, 30),
            );
        }
    };

    const accentStyle = page?.themeColor
        ? ({ "--da-accent": page.themeColor } as React.CSSProperties)
        : undefined;

    /* ── 月视图 ─────────────────────────────────────────── */
    const renderMonth = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const dayTasks = events.filter((ev) =>
                    isSameDay(parseISO(ev.startTime), cloneDay),
                );
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                days.push(
                    <div
                        className={`calendar-day ${!isCurrentMonth ? "disabled" : ""} ${isToday ? "today" : ""}`}
                        key={day.toString()}
                    >
                        <span className="day-number">{format(day, "d")}</span>
                        <div className="day-tasks">
                            {dayTasks.slice(0, 3).map((ev) => (
                                <button
                                    key={ev.id}
                                    type="button"
                                    className="da-mini-event"
                                    onClick={() => setSelected(ev)}
                                    title={ev.name}
                                >
                                    <span className="da-mini-time">
                                        {ev.allDay
                                            ? t("da.allDay")
                                            : format(
                                                  parseISO(ev.startTime),
                                                  "HH:mm",
                                              )}
                                    </span>
                                    <span className="da-mini-name">
                                        {ev.name}
                                    </span>
                                </button>
                            ))}
                            {dayTasks.length > 3 && (
                                <div className="more-tasks">
                                    {t("share.moreCount", {
                                        count: dayTasks.length - 3,
                                    })}
                                </div>
                            )}
                        </div>
                    </div>,
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="calendar-row" key={day.toString()}>
                    {days}
                </div>,
            );
            days = [];
        }
        return <div className="calendar-body">{rows}</div>;
    };

    /* ── 周视图 ─────────────────────────────────────────── */
    const renderWeek = () => {
        const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekDays = Array.from({ length: 7 }).map((_, i) =>
            addDays(startDate, i),
        );

        return (
            <div className="week-view-layout" style={{ flex: 1 }}>
                <div className="week-view-header">
                    <div className="time-axis-header"></div>
                    {weekDays.map((day) => (
                        <div
                            key={day.toString()}
                            className={`week-header-day ${isSameDay(day, new Date()) ? "today" : ""}`}
                        >
                            <div className="week-day-name">
                                {format(day, "EEE", { locale: dateLocale })}
                            </div>
                            <div className="week-day-date">
                                {format(day, "d")}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="week-view-body">
                    <div className="time-axis">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div
                                key={i}
                                className="time-label"
                                style={{ top: `${i * 60}px` }}
                            >
                                <span>{i}:00</span>
                            </div>
                        ))}
                    </div>
                    <div className="week-grid">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div
                                key={i}
                                className="grid-line-horizontal"
                                style={{ top: `${i * 60}px` }}
                            ></div>
                        ))}
                        {weekDays.map((day) => {
                            const dayTasks = events.filter((ev) =>
                                isSameDay(parseISO(ev.startTime), day),
                            );
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div
                                    key={day.toString()}
                                    className={`day-column ${isToday ? "today-column" : ""}`}
                                >
                                    {dayTasks.map((ev) => {
                                        const start = parseISO(ev.startTime);
                                        const end = parseISO(ev.endTime);
                                        const startMinutes =
                                            start.getHours() * 60 +
                                            start.getMinutes();
                                        const durationMinutes =
                                            (end.getTime() - start.getTime()) /
                                            60000;
                                        const taskHeight = Math.max(
                                            durationMinutes - 3,
                                            24,
                                        );
                                        return (
                                            <button
                                                key={ev.id}
                                                type="button"
                                                className="da-week-event"
                                                style={{
                                                    top: `${startMinutes}px`,
                                                    height: `${taskHeight}px`,
                                                }}
                                                onClick={() => setSelected(ev)}
                                                title={`${ev.name}\n${format(start, "HH:mm")} - ${format(end, "HH:mm")}`}
                                            >
                                                <span className="da-week-event-name">
                                                    {ev.name}
                                                </span>
                                                {durationMinutes > 20 && (
                                                    <span className="da-week-event-time">
                                                        {format(start, "HH:mm")}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    /* ── 列表视图（按天分组）────────────────────────────── */
    const renderList = useMemo(() => {
        const visible = events
            .filter((ev) => {
                const d = parseISO(ev.startTime);
                const from = addDays(currentDate, -30);
                const to = addDays(currentDate, 30);
                return !isBefore(d, from) && !isAfter(d, to);
            })
            .sort((a, b) =>
                a.startTime.localeCompare(b.startTime),
            );

        const groups: { date: string; items: DaEvent[] }[] = [];
        for (const ev of visible) {
            const key = format(parseISO(ev.startTime), "yyyy-MM-dd");
            const last = groups[groups.length - 1];
            if (last && last.date === key) {
                last.items.push(ev);
            } else {
                groups.push({ date: key, items: [ev] });
            }
        }

        if (groups.length === 0) {
            return (
                <div className="da-empty">
                    <CalendarIcon size={36} />
                    <p>{t("da.noEvents")}</p>
                </div>
            );
        }

        return (
            <div className="da-list">
                {groups.map((g) => (
                    <div key={g.date} className="da-list-day">
                        <div className="da-list-date">
                            {format(parseISO(g.date), "M月d日 EEEE", {
                                locale: dateLocale,
                            })}
                        </div>
                        {g.items.map((ev) => (
                            <button
                                key={ev.id}
                                type="button"
                                className="da-list-item"
                                onClick={() => setSelected(ev)}
                            >
                                <div className="da-list-time">
                                    {ev.allDay
                                        ? t("da.allDay")
                                        : format(
                                              parseISO(ev.startTime),
                                              "HH:mm",
                                          )}
                                </div>
                                <div className="da-list-main">
                                    <div className="da-list-name">
                                        {ev.name}
                                    </div>
                                    {ev.location && (
                                        <div className="da-list-loc">
                                            <MapPin size={13} />
                                            <span>{ev.location}</span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        );
    }, [events, currentDate, t, dateLocale]);

    if (loading) {
        return (
            <div className="da-page da-center">
                <LoadingSpinner text={t("common.loading")} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="da-page da-center">
                <div className="da-error">
                    <AlertCircle size={40} />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!page) return null;

    const viewLabel =
        viewMode === "month"
            ? monthFormat
            : viewMode === "week"
              ? format(currentDate, "yyyy年MM月第W周")
              : monthFormat;

    return (
        <div className="da-page" style={accentStyle}>
            <header className="da-header">
                <Link to="/events" className="da-back">
                    <ArrowLeft size={16} />
                    <span>{t("da.backToSchools")}</span>
                </Link>
                <div className="da-header-brand">
                    <img src={logo} alt="APoints" className="da-logo" />
                    <span className="da-brand">APoints</span>
                </div>
                <div className="da-header-title">
                    <h1>{page.title}</h1>
                    {page.intro && <p className="da-header-intro">{page.intro}</p>}
                    {page.contact && (
                        <div className="da-header-contact">
                            <Mail size={14} />
                            <span>{page.contact}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="da-body">
                <div className="da-toolbar">
                    <div className="date-navigation">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("prev")}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("today")}
                        >
                            {t("da.today")}
                        </Button>
                        <span className="current-date-label">
                            {viewLabel}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("next")}
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                    <ViewToggle
                        value={viewMode}
                        onChange={(v) => setViewMode(v as ViewMode)}
                        options={[
                            {
                                value: "month",
                                label: (
                                    <>
                                        <CalendarIcon size={16} />{" "}
                                        {t("da.monthView")}
                                    </>
                                ),
                            },
                            {
                                value: "week",
                                label: (
                                    <>
                                        <Clock size={16} /> {t("da.weekView")}
                                    </>
                                ),
                            },
                            {
                                value: "list",
                                label: (
                                    <>
                                        <List size={16} /> {t("da.listView")}
                                    </>
                                ),
                            },
                        ]}
                    />
                </div>

                <Card className="schedule-container">
                    <CardHeader className="schedule-header">
                        <div className="header-left">
                            <CardTitle>{t("da.events")}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent
                        className="calendar-view-wrapper"
                        style={viewMode === "week" ? { padding: 0 } : {}}
                    >
                        {viewMode === "month" ? (
                            <div className="calendar-view">
                                <div className="calendar-header">
                                    {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                                        <div key={d} className="calendar-header-cell">
                                            {format(
                                                addDays(
                                                    startOfWeek(currentDate, {
                                                        weekStartsOn: 1,
                                                    }),
                                                    d,
                                                ),
                                                "EEE",
                                                { locale: dateLocale },
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {renderMonth()}
                            </div>
                        ) : viewMode === "week" ? (
                            renderWeek()
                        ) : (
                            renderList
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 事件详情 */}
            <Modal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                title={t("da.eventDetail")}
            >
                {selected && (
                    <div className="da-event-detail">
                        <h3 className="da-event-detail-name">
                            {selected.name}
                        </h3>
                        <div className="da-event-detail-row">
                            <Clock size={15} />
                            <span>
                                {format(
                                    parseISO(selected.startTime),
                                    "yyyy-MM-dd HH:mm",
                                )}
                                {selected.endTime &&
                                    ` - ${format(parseISO(selected.endTime), "HH:mm")}`}
                            </span>
                        </div>
                        {selected.location && (
                            <div className="da-event-detail-row">
                                <MapPin size={15} />
                                <span>{selected.location}</span>
                            </div>
                        )}
                        {selected.description && (
                            <p className="da-event-detail-desc">
                                {selected.description}
                            </p>
                        )}
                        <div className="da-event-detail-close">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelected(null)}
                            >
                                <X size={16} /> {t("common.close")}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DaEventsPage;
