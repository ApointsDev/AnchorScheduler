import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { type Task } from "../../services/api";
import {
    format,
    parseISO,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameDay,
} from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import "../../styles/Pivot.css";

/* ── 类型 ──────────────────────────────────────────────────────── */

interface PivotViewProps {
    tasks: Task[];
    loading: boolean;
    onTaskClick: (task: Task) => void;
}

type QuadrantKey = "q1" | "q2" | "q3" | "q4";

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
type DayKey = (typeof DAY_KEYS)[number];

/* ── 组件 ──────────────────────────────────────────────────────── */

const PivotView: React.FC<PivotViewProps> = ({
    tasks,
    loading,
    onTaskClick,
}) => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === "zh-CN" ? zhCN : enUS;
    const [weekOffset, setWeekOffset] = useState(0);

    const weekStart = useMemo(() => {
        const now = new Date();
        return addDays(startOfWeek(now, { weekStartsOn: 1 }), weekOffset * 7);
    }, [weekOffset]);

    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    const weekDays = useMemo(
        () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
        [weekStart],
    );

    const quadrantDefs = [
        { key: "q1" as QuadrantKey, label: t("schedule.q1"), shortLabel: "Q1" },
        { key: "q2" as QuadrantKey, label: t("schedule.q2"), shortLabel: "Q2" },
        { key: "q3" as QuadrantKey, label: t("schedule.q3"), shortLabel: "Q3" },
        { key: "q4" as QuadrantKey, label: t("schedule.q4"), shortLabel: "Q4" },
    ];

    // 构建透视表数据：day × quadrant → tasks[]
    const pivotData = useMemo(() => {
        const data: Record<DayKey, Record<QuadrantKey, Task[]>> = {
            mon: { q1: [], q2: [], q3: [], q4: [] },
            tue: { q1: [], q2: [], q3: [], q4: [] },
            wed: { q1: [], q2: [], q3: [], q4: [] },
            thu: { q1: [], q2: [], q3: [], q4: [] },
            fri: { q1: [], q2: [], q3: [], q4: [] },
            sat: { q1: [], q2: [], q3: [], q4: [] },
            sun: { q1: [], q2: [], q3: [], q4: [] },
        };
        for (const task of tasks) {
            const taskDate = parseISO(task.startTime);
            const dayIdx = weekDays.findIndex((d) => isSameDay(d, taskDate));
            if (dayIdx === -1) continue;
            const dk = DAY_KEYS[dayIdx];
            const qk = (task.quadrant || "q4") as QuadrantKey;
            if (data[dk]) {
                data[dk][qk].push(task);
            }
        }
        return data;
    }, [tasks, weekDays]);

    if (loading) {
        return <LoadingSpinner text={t("common.loading")} />;
    }

    const today = new Date();

    return (
        <div className="pivot-container">
            {/* 周导航 */}
            <div className="pivot-week-nav">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWeekOffset((o) => o - 1)}
                >
                    <ChevronLeft size={18} />
                </Button>
                <span className="pivot-week-label">
                    {format(weekStart, "MM月dd日", { locale: dateLocale })} -{" "}
                    {format(weekEnd, "MM月dd日", { locale: dateLocale })}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWeekOffset((o) => o + 1)}
                >
                    <ChevronRight size={18} />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWeekOffset(0)}
                >
                    {t("schedule.today")}
                </Button>
            </div>

            {/* 透视表 */}
            <div className="pivot-table-wrapper">
                <table className="pivot-table">
                    <thead>
                        <tr>
                            <th className="pivot-corner-cell">
                                {t("schedule.pivotTable")}
                            </th>
                            {quadrantDefs.map((q) => (
                                <th
                                    key={q.key}
                                    className={`pivot-col-header ${q.key}`}
                                >
                                    <span className="pivot-col-label">
                                        {q.shortLabel}
                                    </span>
                                    <span className="pivot-col-hint">
                                        {q.label}
                                    </span>
                                </th>
                            ))}
                            <th className="pivot-col-header pivot-col-total">
                                <span className="pivot-col-label">
                                    {t("schedule.totalTasks")}
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {weekDays.map((day, idx) => {
                            const dk = DAY_KEYS[idx];
                            const isToday = isSameDay(day, today);
                            const dayData = pivotData[dk];
                            let rowTotal = 0;
                            quadrantDefs.forEach(
                                (q) => (rowTotal += dayData[q.key].length),
                            );

                            return (
                                <tr
                                    key={dk}
                                    className={`pivot-row ${isToday ? "pivot-row-today" : ""}`}
                                >
                                    <td className="pivot-row-header">
                                        <span className="pivot-day-name">
                                            {format(day, "EEE", {
                                                locale: dateLocale,
                                            })}
                                        </span>
                                        <span className="pivot-day-date">
                                            {format(day, "MM/dd")}
                                        </span>
                                    </td>
                                    {quadrantDefs.map((q) => {
                                        const cellTasks = dayData[q.key];
                                        return (
                                            <td
                                                key={q.key}
                                                className={`pivot-cell ${q.key} ${cellTasks.length > 0 ? "has-tasks" : ""}`}
                                            >
                                                {cellTasks.length > 0 ? (
                                                    <div className="pivot-cell-tasks">
                                                        {cellTasks.map(
                                                            (task) => (
                                                                <div
                                                                    key={
                                                                        task.id
                                                                    }
                                                                    className={`pivot-task-chip ${task.completed ? "completed" : ""}`}
                                                                    onClick={() =>
                                                                        onTaskClick(
                                                                            task,
                                                                        )
                                                                    }
                                                                    title={`${task.name}\n${format(parseISO(task.startTime), "HH:mm")} - ${format(parseISO(task.endTime), "HH:mm")}`}
                                                                >
                                                                    <span className="pivot-task-time">
                                                                        {format(
                                                                            parseISO(
                                                                                task.startTime,
                                                                            ),
                                                                            "HH:mm",
                                                                        )}
                                                                    </span>
                                                                    <span className="pivot-task-name">
                                                                        {
                                                                            task.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="pivot-cell-empty">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="pivot-cell pivot-cell-total">
                                        {rowTotal > 0 ? (
                                            <span className="pivot-total-badge">
                                                {rowTotal}
                                            </span>
                                        ) : (
                                            <span className="pivot-cell-empty">
                                                -
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* 合计行 */}
                        <tr className="pivot-row pivot-row-summary">
                            <td className="pivot-row-header">
                                {t("schedule.totalTasks")}
                            </td>
                            {quadrantDefs.map((q) => {
                                let colTotal = 0;
                                DAY_KEYS.forEach(
                                    (dk) =>
                                        (colTotal +=
                                            pivotData[dk][q.key].length),
                                );
                                return (
                                    <td
                                        key={q.key}
                                        className={`pivot-cell pivot-cell-summary ${q.key}`}
                                    >
                                        <span className="pivot-total-badge">
                                            {colTotal}
                                        </span>
                                    </td>
                                );
                            })}
                            <td className="pivot-cell pivot-cell-summary pivot-cell-total">
                                <span className="pivot-total-badge">
                                    {
                                        tasks.filter((t) => {
                                            const taskDate = parseISO(
                                                t.startTime,
                                            );
                                            return weekDays.some((d) =>
                                                isSameDay(d, taskDate),
                                            );
                                        }).length
                                    }
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 空状态 */}
            {tasks.length === 0 && (
                <div className="pivot-empty">
                    <p>{t("schedule.noSchedule")}</p>
                </div>
            )}
        </div>
    );
};

export default PivotView;
