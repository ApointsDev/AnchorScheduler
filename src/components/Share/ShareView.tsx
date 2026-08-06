import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getSharedView } from "../../services/api";
import type { SharedScheduleView } from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import ViewToggle from "../ui/ViewToggle";
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
} from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    Clock,
    User,
    AlertCircle,
} from "lucide-react";
import logo from "../../assets/logo.svg";
import "../../styles/Schedule.css";

const ShareView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === "zh-CN" ? zhCN : enUS;
    const monthFormat = i18n.language === "zh-CN" ? "yyyy年MM月" : "MMMM yyyy";
    const { token } = useParams<{ token: string }>();
    const [data, setData] = useState<SharedScheduleView | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<"month" | "week">("month");
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        getSharedView(token)
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [token]);

    const navigate = (direction: "prev" | "next" | "today") => {
        if (direction === "today") {
            setCurrentDate(new Date());
            return;
        }
        if (viewMode === "month") {
            setCurrentDate((d) =>
                direction === "prev" ? subMonths(d, 1) : addMonths(d, 1),
            );
        } else {
            setCurrentDate((d) =>
                direction === "prev" ? addDays(d, -7) : addDays(d, 7),
            );
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    color: "var(--color-text-light)",
                    gap: 12,
                }}
            >
                <Clock size={32} />
                <p>{t("common.loading")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    color: "var(--color-danger)",
                    flexDirection: "column",
                    gap: 12,
                }}
            >
                <AlertCircle size={48} />
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{error}</p>
            </div>
        );
    }

    if (!data) return null;

    const tasks = data.tasks;

    const renderCalendar = () => {
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
                const dayTasks = tasks.filter((t) =>
                    isSameDay(parseISO(t.startTime), cloneDay),
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
                            {dayTasks.slice(0, 3).map((task) => (
                                <div
                                    key={task.id}
                                    className={`mini-task importance-${task.importance || "normal"} ${task.completed ? "task-completed" : ""}`}
                                    title={`${task.name}\n${format(parseISO(task.startTime), "HH:mm")} - ${format(parseISO(task.endTime), "HH:mm")}`}
                                >
                                    <div className="task-info">
                                        <span className="task-time">
                                            {format(
                                                parseISO(task.startTime),
                                                "HH:mm",
                                            )}
                                        </span>
                                        <span className="task-name">
                                            {task.name}
                                        </span>
                                    </div>
                                </div>
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

    const renderWeekView = () => {
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
                            const dayTasks = tasks.filter((t) =>
                                isSameDay(parseISO(t.startTime), day),
                            );
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div
                                    key={day.toString()}
                                    className={`day-column ${isToday ? "today-column" : ""}`}
                                >
                                    {dayTasks.map((task) => {
                                        const start = parseISO(task.startTime);
                                        const end = parseISO(task.endTime);
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
                                            <div
                                                key={task.id}
                                                className={`mini-task absolute-task importance-${task.importance || "normal"} ${task.completed ? "task-completed" : ""} ${taskHeight < 40 ? "compact-task" : ""}`}
                                                style={{
                                                    top: `${startMinutes}px`,
                                                    height: `${taskHeight}px`,
                                                }}
                                                title={`${task.name}\n${format(start, "HH:mm")} - ${format(end, "HH:mm")}`}
                                            >
                                                <div className="task-content-wrapper">
                                                    <span className="task-name">
                                                        {task.name}
                                                    </span>
                                                    {durationMinutes > 20 && (
                                                        <span className="task-time-label">
                                                            {format(
                                                                start,
                                                                "HH:mm",
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
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

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f7fafc",
                padding: "20px",
            }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                {/* Header */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 24px",
                        marginBottom: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                        border: "1px solid var(--color-border)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <a
                            href="/"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                textDecoration: "none",
                                flexShrink: 0,
                            }}
                            title="前往 APoints 主站"
                        >
                            <img
                                src={logo}
                                alt="APoints"
                                style={{ width: 28, height: 28 }}
                            />
                            <span
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    color: "var(--color-text-dark)",
                                }}
                            >
                                APoints
                            </span>
                        </a>
                        <div
                            style={{
                                width: 1,
                                height: 24,
                                background: "var(--color-border)",
                            }}
                        />
                        <div>
                            <h1
                                style={{
                                    margin: "0 0 2px",
                                    fontSize: "1.1rem",
                                    color: "var(--color-text-dark)",
                                }}
                            >
                                {data.share.name}
                            </h1>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    fontSize: "0.8rem",
                                    color: "var(--color-text-light)",
                                }}
                            >
                                <User size={14} />
                                <span>
                                    {t("share.usersSchedule", {
                                        name: data.user.name,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <ViewToggle
                        value={viewMode}
                        onChange={(v) => setViewMode(v as "month" | "week")}
                        options={[
                            {
                                value: "month",
                                label: (
                                    <>
                                        <CalendarIcon
                                            size={16}
                                            style={{ marginRight: 6 }}
                                        />{" "}
                                        {t("share.monthView")}
                                    </>
                                ),
                            },
                            {
                                value: "week",
                                label: (
                                    <>
                                        <List
                                            size={16}
                                            style={{ marginRight: 6 }}
                                        />{" "}
                                        {t("share.weekView")}
                                    </>
                                ),
                            },
                        ]}
                    />
                </div>

                {/* Calendar */}
                <Card className="schedule-container">
                    <CardHeader className="schedule-header">
                        <div className="header-left">
                            <CardTitle>{t("share.scheduleTitle")}</CardTitle>
                        </div>
                        <div className="header-right">
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
                                    {t("share.today")}
                                </Button>
                                <span className="current-date-label">
                                    {format(currentDate, monthFormat, {
                                        locale: dateLocale,
                                    })}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate("next")}
                                >
                                    <ChevronRight size={20} />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent
                        className="calendar-view-wrapper"
                        style={viewMode === "week" ? { padding: 0 } : {}}
                    >
                        {viewMode === "week" ? (
                            renderWeekView()
                        ) : (
                            <div className="calendar-view">
                                <div className="calendar-header">
                                    {[
                                        "一",
                                        "二",
                                        "三",
                                        "四",
                                        "五",
                                        "六",
                                        "日",
                                    ].map((d) => (
                                        <div key={d} className="week-day">
                                            {d}
                                        </div>
                                    ))}
                                </div>
                                {renderCalendar()}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ShareView;
