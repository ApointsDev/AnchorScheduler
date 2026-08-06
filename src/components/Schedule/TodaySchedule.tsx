import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getTasks, type Task, updateTask } from "../../services/api";
import {
    classifyQuadrants,
    applyQuadrants,
} from "../../services/quadrantClassifier";
import { useWeek } from "../../context/WeekContext";
import { format, parseISO } from "date-fns";
import { toShanghaiISO } from "../../utils/time";
import { zhCN, enUS } from "date-fns/locale";
import {
    Calendar,
    CheckCircle2,
    Circle,
    Plus,
    RefreshCw,
    Clock,
    Table2,
} from "lucide-react";
import ScheduleCard from "./ScheduleCard";
import PivotView from "./PivotView";
import IosTabBar from "../ui/IosTabBar";
import IosFab from "../ui/IosFab";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import AddTaskModal from "./AddTaskModal";
import TaskDetailModal from "./TaskDetailModal";
import { Modal } from "../ui/Modal";
import CurrentTimeDisplay from "../ui/CurrentTimeDisplay";
import LoadingSpinner from "../ui/LoadingSpinner";
import ViewToggle from "../ui/ViewToggle";
import { isBelow } from "../../utils/breakpoints";
import "../../styles/Schedule.css";

type ViewMode = "timeline" | "pivot";

const TodaySchedule: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === "zh-CN" ? zhCN : enUS;
    const fullDateFormat =
        i18n.language === "zh-CN"
            ? "yyyy年MM月dd日 EEEE"
            : "EEEE, MMMM d, yyyy";
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("timeline");
    const [classifying, setClassifying] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState(() => isBelow("md"));
    const touchStartX = useRef(0);
    const { weekInfo } = useWeek();
    const effectiveWeek = weekInfo ? weekInfo.effectiveWeek : null;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(isBelow("md"));
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchTodayTasks = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const start = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                0,
                0,
                0,
            );
            const end = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
                23,
                59,
                59,
                999,
            );
            const response = await getTasks({
                start: toShanghaiISO(start),
                end: toShanghaiISO(end),
                limit: 500,
            });
            setTasks(response.tasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayTasks();
    }, []);

    // 切换到透视表视图时，自动对未分类的任务进行分类
    const switchView = useCallback(
        async (newMode: ViewMode) => {
            if (newMode === viewMode) return;
            setViewMode(newMode);
            if (newMode === "pivot") {
                const unclassified = tasks.filter((t) => !t.quadrant);
                if (unclassified.length > 0) {
                    setClassifying(true);
                    try {
                        const result = await classifyQuadrants(unclassified);
                        setTasks((prev) => applyQuadrants(prev, result));
                    } catch (error) {
                        console.error("Failed to classify quadrants:", error);
                    } finally {
                        setClassifying(false);
                    }
                }
            }
        },
        [tasks, viewMode],
    );

    // 触摸滑动手势
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 60) {
                if (diff > 0) {
                    switchView("pivot");
                } else {
                    switchView("timeline");
                }
            }
        },
        [switchView],
    );

    const getStatusColor = (task: Task) => {
        if (task.completed) return "status-completed";
        const now = new Date();
        const start = parseISO(task.startTime);
        const end = parseISO(task.endTime);
        if (now >= start && now <= end) return "status-active";
        if (now > end) return "status-overdue";
        return "status-upcoming";
    };

    const handleOpenCompleteModal = (task: Task) => {
        setTaskToComplete(task);
    };

    const handleCloseCompleteModal = () => {
        setTaskToComplete(null);
    };

    const handleToggleTaskStatus = async () => {
        if (!taskToComplete) return;
        setIsCompleting(true);
        try {
            await updateTask(taskToComplete.id, {
                completed: !taskToComplete.completed,
            });
            await fetchTodayTasks();
            handleCloseCompleteModal();
        } catch (error) {
            console.error("Failed to update task status", error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleTaskCreated = useCallback(async () => {
        await fetchTodayTasks();
        if (viewMode === "pivot") {
            setClassifying(true);
            try {
                const today = new Date();
                const start = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                    0,
                    0,
                    0,
                );
                const end = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                    23,
                    59,
                    59,
                    999,
                );
                const response = await getTasks({
                    start: toShanghaiISO(start),
                    end: toShanghaiISO(end),
                    limit: 500,
                });
                const unclassified = response.tasks.filter((t) => !t.quadrant);
                if (unclassified.length > 0) {
                    const result = await classifyQuadrants(unclassified);
                    setTasks((prev) => applyQuadrants(prev, result));
                } else {
                    setTasks(response.tasks);
                }
            } catch (error) {
                console.error("Failed to classify new task:", error);
            } finally {
                setClassifying(false);
            }
        }
    }, [viewMode]);

    const tabs = [
        {
            key: "timeline" as ViewMode,
            icon: Clock,
            label: t("schedule.timeline"),
        },
        {
            key: "pivot" as ViewMode,
            icon: Table2,
            label: t("schedule.pivotTable"),
        },
    ];

    return (
        <>
            <Card className="schedule-container">
                <CardHeader className="schedule-header today-header">
                    <div className="header-left">
                        <CardTitle>{t("schedule.todaySchedule")}</CardTitle>
                        <p className="date-subtitle">
                            {format(new Date(), fullDateFormat, {
                                locale: dateLocale,
                            })}
                        </p>
                        {effectiveWeek !== null && (
                            <div className="week-badge">
                                {t("schedule.weekN", { week: effectiveWeek })}
                            </div>
                        )}
                    </div>
                    <div className="header-right">
                        {!isMobile && (
                            <>
                                <ViewToggle
                                    value={viewMode}
                                    onChange={(v) => switchView(v as ViewMode)}
                                    options={[
                                        {
                                            value: "timeline",
                                            icon: Clock,
                                            label: t("schedule.timeline"),
                                        },
                                        {
                                            value: "pivot",
                                            icon: Table2,
                                            label: t("schedule.pivotTable"),
                                        },
                                    ]}
                                />
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Plus size={16} />{" "}
                                    {t("schedule.addSchedule")}
                                </Button>
                            </>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchTodayTasks}
                            title={t("schedule.refresh")}
                        >
                            <RefreshCw size={18} />
                        </Button>
                        <CurrentTimeDisplay />
                    </div>
                </CardHeader>

                <CardContent
                    className="schedule-content"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={`schedule-slide ${viewMode === "pivot" ? "slide-to-quadrant" : ""}`}
                    >
                        <div className="timeline-view">
                            {loading ? (
                                <LoadingSpinner />
                            ) : tasks.length === 0 ? (
                                <div className="empty-state">
                                    <Calendar size={48} />
                                    <p>{t("schedule.noScheduleToday")}</p>
                                </div>
                            ) : (
                                tasks.map((task) => {
                                    const now = currentTime;
                                    const taskStart = parseISO(task.startTime);
                                    const taskEnd = parseISO(task.endTime);
                                    const isActive =
                                        now >= taskStart && now <= taskEnd;

                                    return (
                                        <div
                                            key={task.id}
                                            className={`timeline-item ${getStatusColor(task)}`}
                                        >
                                            <ScheduleCard
                                                name={task.name}
                                                description={task.description}
                                                startTime={task.startTime}
                                                endTime={task.endTime}
                                                location={task.location}
                                                status={
                                                    getStatusColor(
                                                        task,
                                                    ).replace(
                                                        "status-",
                                                        "",
                                                    ) as any
                                                }
                                                progress={
                                                    isActive
                                                        ? ((now.getTime() -
                                                              taskStart.getTime()) /
                                                              (taskEnd.getTime() -
                                                                  taskStart.getTime())) *
                                                          100
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    setSelectedTask(task)
                                                }
                                                rightActions={
                                                    task.completed ? (
                                                        <CheckCircle2
                                                            className="icon-completed"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenCompleteModal(
                                                                    task,
                                                                );
                                                            }}
                                                            style={{
                                                                cursor: "pointer",
                                                                width: 22,
                                                                height: 22,
                                                            }}
                                                        />
                                                    ) : (
                                                        <Circle
                                                            className="icon-pending"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenCompleteModal(
                                                                    task,
                                                                );
                                                            }}
                                                            style={{
                                                                cursor: "pointer",
                                                                width: 22,
                                                                height: 22,
                                                            }}
                                                        />
                                                    )
                                                }
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="quadrant-view-wrapper">
                            <PivotView
                                tasks={tasks}
                                loading={loading || classifying}
                                onTaskClick={(task) => setSelectedTask(task)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* iOS 风格底部选项卡 — 仅移动端 */}
            {isMobile && (
                <IosTabBar
                    options={tabs}
                    activeKey={viewMode}
                    onChange={(key) => switchView(key as ViewMode)}
                    floating
                />
            )}

            {/* FAB 悬浮添加按钮 — 仅移动端 */}
            {isMobile && (
                <IosFab
                    onClick={() => setIsModalOpen(true)}
                    title={t("schedule.addSchedule")}
                />
            )}

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={handleTaskCreated}
            />

            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onTaskUpdated={fetchTodayTasks}
            />

            {taskToComplete && (
                <Modal
                    isOpen={!!taskToComplete}
                    onClose={handleCloseCompleteModal}
                    title={
                        taskToComplete.completed
                            ? t("schedule.confirmResetSchedule")
                            : t("schedule.confirmCompleteSchedule")
                    }
                >
                    <p>
                        {t("schedule.confirmToggleSchedule", {
                            name: taskToComplete.name,
                            status: taskToComplete.completed
                                ? t("schedule.incomplete")
                                : t("schedule.completed"),
                        })}
                    </p>
                    <div className="modal-actions">
                        <Button
                            variant="outline"
                            onClick={handleCloseCompleteModal}
                            disabled={isCompleting}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            onClick={handleToggleTaskStatus}
                            disabled={isCompleting}
                        >
                            {isCompleting
                                ? t("common.processing")
                                : t("common.confirm")}
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default TodaySchedule;
