import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { type Task } from "../../services/api";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import "../../styles/Quadrant.css";

/* ── 类型 ──────────────────────────────────────────────────────── */

interface QuadrantViewProps {
    tasks: Task[];
    loading: boolean;
    onTaskClick: (task: Task) => void;
    onToggleComplete: (task: Task) => void;
}

type QuadrantKey = "q1" | "q2" | "q3" | "q4";

interface QuadrantDef {
    key: QuadrantKey;
    label: string;
    hint: string;
    shortLabel: string;
}

const MOBILE_BREAKPOINT = 640;

/* ── 组件 ──────────────────────────────────────────────────────── */

const QuadrantView: React.FC<QuadrantViewProps> = ({
    tasks,
    loading,
    onTaskClick,
    onToggleComplete,
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<QuadrantKey>("q1");
    const [isMobile, setIsMobile] = useState<boolean>(
        typeof window !== "undefined"
            ? window.innerWidth < MOBILE_BREAKPOINT
            : false,
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ── 常量 ──────────────────────────────────────────────────────── */

    const quadrantDefs: QuadrantDef[] = [
        {
            key: "q1",
            label: t("schedule.q1"),
            hint: t("schedule.q1Hint"),
            shortLabel: "Q1",
        },
        {
            key: "q2",
            label: t("schedule.q2"),
            hint: t("schedule.q2Hint"),
            shortLabel: "Q2",
        },
        {
            key: "q3",
            label: t("schedule.q3"),
            hint: t("schedule.q3Hint"),
            shortLabel: "Q3",
        },
        {
            key: "q4",
            label: t("schedule.q4"),
            hint: t("schedule.q4Hint"),
            shortLabel: "Q4",
        },
    ];

    const filterByQuadrant = (key: QuadrantKey): Task[] =>
        tasks.filter((t) => t.quadrant === key);

    if (loading) {
        return <LoadingSpinner text={t("schedule.analyzingSchedule")} />;
    }

    const renderQuadrantPanel = (q: QuadrantDef) => {
        const items = filterByQuadrant(q.key);
        return (
            <div key={q.key} className={`quadrant-panel ${q.key}`}>
                {!isMobile && (
                    <div className="quadrant-panel-header">
                        <div>
                            <div className="quadrant-panel-label">
                                {q.label}
                            </div>
                            <div className="quadrant-panel-hint">{q.hint}</div>
                        </div>
                        <span className="quadrant-panel-count">
                            {items.length}
                        </span>
                    </div>
                )}

                <div className="quadrant-notes">
                    {items.length === 0 ? (
                        <div className="quadrant-notes-empty">
                            {t("schedule.noSchedule")}
                        </div>
                    ) : (
                        items.map((task) => (
                            <div
                                key={task.id}
                                className={`note${task.completed ? " completed" : ""}`}
                                onClick={() => onTaskClick(task)}
                            >
                                <span className="note-time">
                                    {format(parseISO(task.startTime), "HH:mm")}
                                </span>
                                <div className="note-name">{task.name}</div>
                                {task.description && (
                                    <div className="note-desc">
                                        {task.description}
                                    </div>
                                )}
                                <span
                                    className="note-action"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleComplete(task);
                                    }}
                                >
                                    {task.completed ? (
                                        <CheckCircle2
                                            size={15}
                                            color="#66bb6a"
                                        />
                                    ) : (
                                        <Circle size={15} color="#bdb8b0" />
                                    )}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    if (isMobile) {
        const activeDef = quadrantDefs.find((q) => q.key === activeTab)!;
        return (
            <div className="quadrant-board quadrant-board--mobile">
                {/* 象限标签栏 */}
                <div className="quadrant-tabs">
                    {quadrantDefs.map((q) => {
                        const count = filterByQuadrant(q.key).length;
                        return (
                            <button
                                key={q.key}
                                className={`quadrant-tab ${q.key}${activeTab === q.key ? " active" : ""}`}
                                onClick={() => setActiveTab(q.key)}
                            >
                                <span className="quadrant-tab-label">
                                    {q.shortLabel}
                                </span>
                                <span className="quadrant-tab-hint">
                                    {q.hint}
                                </span>
                                <span className="quadrant-tab-count">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 当前象限面板 */}
                <div className="quadrant-panel-header quadrant-panel-header--mobile">
                    <div>
                        <div className="quadrant-panel-label">
                            {activeDef.label}
                        </div>
                        <div className="quadrant-panel-hint">
                            {activeDef.hint}
                        </div>
                    </div>
                    <span className="quadrant-panel-count">
                        {filterByQuadrant(activeTab).length}
                    </span>
                </div>
                {renderQuadrantPanel(activeDef)}
            </div>
        );
    }

    return (
        <div className="quadrant-board">
            {quadrantDefs.map((q) => renderQuadrantPanel(q))}
        </div>
    );
};

export default QuadrantView;
