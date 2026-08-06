import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getTasks, type Task } from "../../services/api";
import { isBelow } from "../../utils/breakpoints";
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
import { toShanghaiISO } from "../../utils/time";
import { zhCN, enUS } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    Plus,
    Share2,
    Grid3X3,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import ViewToggle from "../ui/ViewToggle";
import AddTaskModal from "./AddTaskModal";
import TaskDetailModal from "./TaskDetailModal";
import QuadrantView from "./QuadrantView";
import MiniScheduleCard from "./MiniScheduleCard";
import ShareModal from "../Share/ShareModal";
import LoadingSpinner from "../ui/LoadingSpinner";
import IosFab from "../ui/IosFab";
import {
    classifyQuadrants,
    applyQuadrants,
} from "../../services/quadrantClassifier";
import { updateTask } from "../../services/api";
import { Modal } from "../ui/Modal";
import "../../styles/Schedule.css";

type AllViewMode = "month" | "week" | "quadrant";

const AllSchedule: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === "zh-CN" ? zhCN : enUS;
    const monthFormat = i18n.language === "zh-CN" ? "yyyy年MM月" : "MMMM yyyy";
    const [viewMode, setViewMode] = useState<AllViewMode>(
        isBelow("md") ? "week" : "month",
    );
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showShareModal, setShowShareModal] = useState(false);
    const [isMobile, setIsMobile] = useState(() => isBelow("md"));
    const [classifying, setClassifying] = useState(false);
    const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    // 缓存已加载的视图数据，避免切换时重复请求
    const loadedCache = useRef<Map<string, Task[]>>(new Map());
    const prevDateKey = useRef<string>("");

    useEffect(() => {
        const handleResize = () => setIsMobile(isBelow("md"));
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchTasks = async (force = false) => {
        const dateKey = `${viewMode}_${format(currentDate, "yyyy-MM-dd")}`;

        if (!force) {
            // 日期没变：视图间切换时复用已有数据
            if (currentDate.toDateString() === prevDateKey.current) {
                const cached = loadedCache.current.get(dateKey);
                if (cached) {
                    setTasks(cached);
                    return;
                }
            } else {
                // 日期变了，清空缓存
                loadedCache.current.clear();
                prevDateKey.current = currentDate.toDateString();
            }
        } else {
            // 强制刷新：清除当前视图缓存
            loadedCache.current.delete(dateKey);
        }

        setLoading(true);
        try {
            let start, end;
            if (viewMode === "month") {
                start = toShanghaiISO(startOfMonth(currentDate));
                end = toShanghaiISO(endOfMonth(currentDate));
            } else {
                start = toShanghaiISO(
                    startOfWeek(currentDate, { weekStartsOn: 1 }),
                );
                end = toShanghaiISO(
                    endOfWeek(currentDate, { weekStartsOn: 1 }),
                );
            }

            const response = await getTasks({ start, end, limit: 500 });
            loadedCache.current.set(dateKey, response.tasks);
            setTasks(response.tasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [currentDate, viewMode]);

    // 切换到四象限视图时，自动对未分类的任务进行分类
    useEffect(() => {
        if (viewMode === "quadrant" && tasks.length > 0) {
            const unclassified = tasks.filter((t) => !t.quadrant);
            if (unclassified.length > 0) {
                setClassifying(true);
                classifyQuadrants(unclassified)
                    .then((result) => {
                        setTasks((prev) => applyQuadrants(prev, result));
                    })
                    .catch((error) => {
                        console.error("Failed to classify quadrants:", error);
                    })
                    .finally(() => setClassifying(false));
            }
        }
    }, [viewMode, tasks.length]);

    const handleToggleComplete = async (task: Task) => {
        setTaskToComplete(task);
    };

    const confirmToggleComplete = async () => {
        if (!taskToComplete) return;
        setIsCompleting(true);
        try {
            await updateTask(taskToComplete.id, {
                completed: !taskToComplete.completed,
            });
            await fetchTasks(true);
            setTaskToComplete(null);
        } catch (error) {
            console.error("Failed to update task status", error);
        } finally {
            setIsCompleting(false);
        }
    };

    const navigate = (direction: "prev" | "next" | "today") => {
        if (direction === "today") {
            setCurrentDate(new Date());
            return;
        }
        if (viewMode === "quadrant") return;
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

    const renderWeekView = () => {
        const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekDays = Array.from({ length: 7 }).map((_, i) =>
            addDays(startDate, i),
        );

        // 判断是否为移动端（宽度小于 md 断点）
        const isMobile = isBelow("md");
        // 周几映射（移动端用单字）
        const weekDayCharMap = [
            t("schedule.day.monChar"),
            t("schedule.day.tueChar"),
            t("schedule.day.wedChar"),
            t("schedule.day.thuChar"),
            t("schedule.day.friChar"),
            t("schedule.day.satChar"),
            t("schedule.day.sunChar"),
        ];
        return (
            <div className="week-view-layout">
                <div className="week-view-header">
                    <div className="time-axis-header"></div>
                    {weekDays.map((day) => {
                        const weekDayIndex =
                            day.getDay() === 0 ? 6 : day.getDay() - 1; // 周日为最后
                        return (
                            <div
                                key={day.toString()}
                                className={`week-header-day ${isSameDay(day, new Date()) ? "today" : ""}`}
                            >
                                <div className="week-day-name">
                                    {isMobile
                                        ? weekDayCharMap[weekDayIndex]
                                        : format(day, "EEE", {
                                              locale: dateLocale,
                                          })}
                                </div>
                                {!isMobile && (
                                    <div className="week-day-date">
                                        {format(day, "d")}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
                        {/* Horizontal Grid Lines */}
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div
                                key={i}
                                className="grid-line-horizontal"
                                style={{ top: `${i * 60}px` }}
                            ></div>
                        ))}

                        {/* Day Columns */}
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
                                            (1000 * 60);
                                        const taskHeight = Math.max(
                                            durationMinutes - 3,
                                            28,
                                        );

                                        return (
                                            <MiniScheduleCard
                                                key={task.id}
                                                task={task}
                                                variant="timeline"
                                                style={{
                                                    top: `${startMinutes}px`,
                                                    height: `${taskHeight}px`,
                                                }}
                                                onClick={setSelectedTask}
                                            />
                                        );
                                    })}

                                    {/* Current Time Line if today */}
                                    {isToday && (
                                        <div
                                            className="current-time-marker-line"
                                            style={{
                                                top: `${currentTime.getHours() * 60 + currentTime.getMinutes()}px`,
                                            }}
                                        >
                                            <div className="marker-dot"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderCalendar = () => {
        let startDate, endDate;

        if (viewMode === "month") {
            const monthStart = startOfMonth(currentDate);
            const monthEnd = endOfMonth(monthStart);
            startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
            endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
        } else {
            startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
            endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
        }

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                const dayTasks = tasks.filter((t) =>
                    isSameDay(parseISO(t.startTime), cloneDay),
                );
                const isCurrentMonth =
                    viewMode === "week"
                        ? true
                        : isSameMonth(day, startOfMonth(currentDate));
                const isToday = isSameDay(day, new Date());

                days.push(
                    <div
                        className={`calendar-day ${!isCurrentMonth ? "disabled" : ""} ${isToday ? "today" : ""}`}
                        key={day.toString()}
                    >
                        <span className="day-number">{formattedDate}</span>
                        <div className="day-tasks">
                            {/* Current Time Line for Today in Week View */}
                            {isToday && viewMode === "week" && (
                                <div
                                    className="week-view-current-time-marker"
                                    style={{
                                        top: `${((currentTime.getHours() * 60 + currentTime.getMinutes()) / (24 * 60)) * 100}%`,
                                    }}
                                >
                                    <div className="marker-line"></div>
                                    <div className="marker-dot"></div>
                                </div>
                            )}

                            {dayTasks.map((task) => (
                                <MiniScheduleCard
                                    key={task.id}
                                    task={task}
                                    variant="grid"
                                    onClick={setSelectedTask}
                                />
                            ))}
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

    const calendarDayLabels = [
        t("schedule.day.monShort"),
        t("schedule.day.tueShort"),
        t("schedule.day.wedShort"),
        t("schedule.day.thuShort"),
        t("schedule.day.friShort"),
        t("schedule.day.satShort"),
        t("schedule.day.sunShort"),
    ];

    return (
        <>
            <Card className="schedule-container">
                <CardHeader className="schedule-header">
                    <div className="header-left">
                        <CardTitle className="all-schedule-title">
                            {t("schedule.allSchedule")}
                        </CardTitle>
                        <div className="view-controls">
                            <ViewToggle
                                value={viewMode}
                                onChange={(v) => setViewMode(v as AllViewMode)}
                                options={[
                                    {
                                        value: "month",
                                        label: (
                                            <>
                                                <CalendarIcon
                                                    size={16}
                                                    style={{ marginRight: 6 }}
                                                />{" "}
                                                {t("schedule.monthView")}
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
                                                {t("schedule.weekView")}
                                            </>
                                        ),
                                    },
                                    {
                                        value: "quadrant",
                                        label: (
                                            <>
                                                <Grid3X3
                                                    size={16}
                                                    style={{ marginRight: 6 }}
                                                />{" "}
                                                {t("schedule.quadrant")}
                                            </>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="header-right header-right-desktop">
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
                                {t("schedule.today")}
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
                        <Button
                            className="add-schedule-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={18} /> {t("schedule.addSchedule")}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowShareModal(true)}
                            title={t("schedule.shareSchedule")}
                        >
                            <Share2 size={18} />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="calendar-view-wrapper">
                    {viewMode === "quadrant" ? (
                        <QuadrantView
                            tasks={tasks}
                            loading={loading || classifying}
                            onTaskClick={(task) => setSelectedTask(task)}
                            onToggleComplete={handleToggleComplete}
                        />
                    ) : (
                        <div
                            className={`schedule-slide ${viewMode === "week" ? "slide-to-quadrant" : ""}`}
                        >
                            <div className="timeline-view">
                                <div className="calendar-view">
                                    <div className="calendar-header">
                                        {calendarDayLabels.map((d) => (
                                            <div key={d} className="week-day">
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    {loading ? (
                                        <LoadingSpinner />
                                    ) : (
                                        renderCalendar()
                                    )}
                                </div>
                            </div>
                            <div className="quadrant-view-wrapper">
                                {loading ? (
                                    <LoadingSpinner />
                                ) : (
                                    renderWeekView()
                                )}
                            </div>
                        </div>
                    )}

                    <div className="calendar-bottom-bar">
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
                                {t("schedule.today")}
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("month")}
                            >
                                <CalendarIcon size={18} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowShareModal(true)}
                                title={t("schedule.shareSchedule")}
                            >
                                <Share2 size={18} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={async () => {
                    await fetchTasks(true);
                    if (viewMode === "quadrant" && tasks.length > 0) {
                        const unclassified = tasks.filter((t) => !t.quadrant);
                        if (unclassified.length > 0) {
                            setClassifying(true);
                            try {
                                const result =
                                    await classifyQuadrants(unclassified);
                                setTasks((prev) =>
                                    applyQuadrants(prev, result),
                                );
                            } catch (error) {
                                console.error(
                                    "Failed to classify new task:",
                                    error,
                                );
                            } finally {
                                setClassifying(false);
                            }
                        }
                    }
                }}
            />
            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onTaskUpdated={() => fetchTasks(true)}
            />
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
            />

            {/* 完成/取消完成确认弹窗 */}
            {taskToComplete && (
                <Modal
                    isOpen={!!taskToComplete}
                    onClose={() => setTaskToComplete(null)}
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
                            onClick={() => setTaskToComplete(null)}
                            disabled={isCompleting}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            onClick={confirmToggleComplete}
                            disabled={isCompleting}
                        >
                            {isCompleting
                                ? t("common.processing")
                                : t("common.confirm")}
                        </Button>
                    </div>
                </Modal>
            )}

            {isMobile && viewMode !== "quadrant" && (
                <IosFab
                    onClick={() => setIsModalOpen(true)}
                    title={t("schedule.addSchedule")}
                />
            )}
        </>
    );
};

export default AllSchedule;
