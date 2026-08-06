import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTasks, type Task } from "../../services/api";
import { format, parseISO } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { Calendar, CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import SearchBar from "../ui/SearchBar";
import ViewToggle from "../ui/ViewToggle";
import TaskDetailModal from "./TaskDetailModal";
import "../../styles/Schedule.css";
import LoadingSpinner from "../ui/LoadingSpinner";

const SearchTasks: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dateLocale = i18n.language === "zh-CN" ? zhCN : enUS;
    const [query, setQuery] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(
        undefined,
    );
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const limit = 20;

    const handleSearch = async (reset = false) => {
        setLoading(true);
        try {
            const offset = reset ? 0 : page * limit;
            const response = await getTasks({
                q: query,
                completed: completedFilter,
                limit,
                offset,
                sortBy: "startTime",
                order: "desc",
            });

            if (reset) {
                setTasks(response.tasks);
                setPage(0);
            } else {
                setTasks((prev) => [...prev, ...response.tasks]);
            }
            setTotal(response.total);
        } catch (error) {
            console.error("Failed to search tasks", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [query, completedFilter]);

    const loadMore = () => {
        setPage((p) => p + 1);
        const nextPage = page + 1;
        setLoading(true);
        getTasks({
            q: query,
            completed: completedFilter,
            limit,
            offset: nextPage * limit,
            sortBy: "startTime",
            order: "desc",
        })
            .then((response) => {
                setTasks((prev) => [...prev, ...response.tasks]);
                setTotal(response.total);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setLoading(false);
            });
    };

    return (
        <>
            <Card className="schedule-container search-container">
                <CardHeader className="schedule-header">
                    <CardTitle>{t("schedule.searchTasks")}</CardTitle>
                </CardHeader>
                <CardContent className="search-content">
                    <div className="search-controls">
                        <SearchBar
                            placeholder={t("schedule.searchPlaceholder")}
                            value={query}
                            onChange={setQuery}
                        />
                        <ViewToggle
                            value={
                                completedFilter === undefined
                                    ? "all"
                                    : completedFilter
                                      ? "completed"
                                      : "incomplete"
                            }
                            onChange={(v) =>
                                setCompletedFilter(
                                    v === "all"
                                        ? undefined
                                        : v === "completed"
                                          ? true
                                          : false,
                                )
                            }
                            options={[
                                {
                                    value: "all",
                                    label: t("schedule.filterAll"),
                                },
                                {
                                    value: "incomplete",
                                    label: t("schedule.filterIncomplete"),
                                },
                                {
                                    value: "completed",
                                    label: t("schedule.filterCompleted"),
                                },
                            ]}
                        />
                    </div>

                    <div className="task-list">
                        {tasks.length === 0 && !loading ? (
                            <div
                                className="empty-state"
                                style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    color: "#888",
                                }}
                            >
                                {t("schedule.noSearchResults")}
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`task-item importance-${task.importance || "normal"} ${task.completed ? "completed" : ""}`}
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <div className="task-status-icon">
                                        {task.completed ? (
                                            <CheckCircle2
                                                size={20}
                                                className="text-green-500"
                                            />
                                        ) : (
                                            <Circle
                                                size={20}
                                                className="text-gray-400"
                                            />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            className="task-name"
                                            style={{
                                                fontWeight: 500,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {task.name}
                                        </div>
                                        <div
                                            className="task-meta"
                                            style={{
                                                fontSize: "12px",
                                                color: "#666",
                                                display: "flex",
                                                gap: "10px",
                                                marginTop: "4px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Calendar size={12} />
                                                {format(
                                                    parseISO(task.startTime),
                                                    "yyyy-MM-dd HH:mm",
                                                    { locale: dateLocale },
                                                )}
                                            </span>
                                            {task.location && (
                                                <span
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    📍 {task.location}
                                                </span>
                                            )}
                                        </div>
                                        {task.description && (
                                            <div
                                                className="task-desc"
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#888",
                                                    marginTop: "4px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {task.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {loading && <LoadingSpinner />}

                        {tasks.length < total && !loading && (
                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <Button variant="ghost" onClick={loadMore}>
                                    {t("schedule.loadMore")}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onTaskUpdated={() => handleSearch(true)}
            />
        </>
    );
};

export default SearchTasks;
