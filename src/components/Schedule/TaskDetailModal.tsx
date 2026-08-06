import React from "react";
import { format, parseISO } from "date-fns";
import { toShanghaiISO } from "../../utils/time";
import {
    updateTask,
    deleteTask,
    type Task,
    ScheduleConflictError,
} from "../../services/api";
import i18n from "../../i18n";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { ToggleButton } from "../ui/ToggleButton";
import { Trash2, CheckCircle2, Circle, MapPin, Clock } from "lucide-react";
import BaseScheduleView from "./BaseScheduleView";
import type { BaseScheduleProps } from "./BaseScheduleView";
import "../../styles/Schedule.css";

interface TaskDetailModalProps extends BaseScheduleProps {
    task: Task | null;
    onTaskUpdated: () => void;
}

interface TaskDetailState {
    isEditing: boolean;
    editedTask: Partial<Task>;
    isSubmitting: boolean;
    error: string;
    showConflictModal: boolean;
    showDeleteModal: boolean;
    conflictTasks: Task[];
}

class TaskDetailModal extends BaseScheduleView<
    TaskDetailModalProps,
    TaskDetailState
> {
    constructor(props: TaskDetailModalProps) {
        super(props);
        this.state = {
            isEditing: false,
            editedTask: {},
            isSubmitting: false,
            error: "",
            showConflictModal: false,
            showDeleteModal: false,
            conflictTasks: [],
        };
    }

    componentDidUpdate(prevProps: TaskDetailModalProps) {
        if (
            this.props.task &&
            (this.props.task !== prevProps.task ||
                this.props.isOpen !== prevProps.isOpen)
        ) {
            const task = this.props.task;
            this.setState({
                editedTask: {
                    name: task!.name,
                    description: task!.description,
                    location: task!.location,
                    startTime: task!.startTime,
                    endTime: task!.endTime,
                    completed: task!.completed,
                    importance: task!.importance || "normal",
                },
                isEditing: false,
                error: "",
            });
        }
    }

    private handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        this.setState((prev) => ({
            editedTask: { ...prev.editedTask, [name]: value },
        }));
    };

    private handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const task = this.props.task;
        if (!task) return;
        const originalDate = parseISO(task.startTime);
        const dateStr = format(originalDate, "yyyy-MM-dd");
        const newDateTime = toShanghaiISO(new Date(`${dateStr}T${value}`));
        this.setState((prev) => ({
            editedTask: { ...prev.editedTask, [name]: newDateTime },
        }));
    };

    private handleSave = async () => {
        const task = this.props.task;
        if (!task) return;
        this.setState({ isSubmitting: true, error: "" });
        try {
            const result = await updateTask(task.id, this.state.editedTask);
            if (result.conflictWarning) {
                this.setState({
                    conflictTasks: result.conflictWarning.conflicts,
                    showConflictModal: true,
                });
                this.props.onTaskUpdated();
                this.setState({ isEditing: false });
            } else {
                this.props.onTaskUpdated();
                this.setState({ isEditing: false });
                this.props.onClose();
            }
        } catch (err: any) {
            console.error("Failed to update task", err);
            if (err instanceof ScheduleConflictError) {
                this.setState({
                    conflictTasks: err.conflicts,
                    showConflictModal: true,
                });
            } else {
                this.setState({
                    error:
                        err instanceof Error
                            ? err.message
                            : i18n.t("schedule.updateFailed"),
                });
            }
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    private handleToggleComplete = async () => {
        const task = this.props.task;
        if (!task) return;
        this.setState({ isSubmitting: true });
        try {
            await updateTask(task.id, { completed: !task.completed });
            this.props.onTaskUpdated();
            this.props.onClose();
        } catch (err: any) {
            this.setState({
                error:
                    err instanceof Error
                        ? err.message
                        : i18n.t("schedule.operationFailed"),
            });
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    private handleDeleteOnlyInstance = async () => {
        const task = this.props.task;
        if (!task) return;
        this.setState({ isSubmitting: true });
        try {
            await deleteTask(task.id, false);
            this.props.onTaskUpdated();
            this.props.onClose();
        } catch (err: any) {
            this.setState({
                error:
                    err instanceof Error
                        ? err.message
                        : i18n.t("schedule.deleteFailed"),
            });
        } finally {
            this.setState({ isSubmitting: false, showDeleteModal: false });
        }
    };

    private handleDeleteEntireParent = async () => {
        const task = this.props.task;
        if (!task) return;
        this.setState({ isSubmitting: true });
        try {
            const parentId = task.parentTaskId || task.id;
            await deleteTask(parentId, true);
            this.props.onTaskUpdated();
            this.props.onClose();
        } catch (err: any) {
            this.setState({
                error:
                    err instanceof Error
                        ? err.message
                        : i18n.t("schedule.deleteFailed"),
            });
        } finally {
            this.setState({ isSubmitting: false, showDeleteModal: false });
        }
    };

    private formatTimeValue = (isoString?: string) => {
        if (!isoString) return "";
        return format(parseISO(isoString), "HH:mm");
    };

    private t = (key: string, options?: Record<string, any>): string => {
        return i18n.t(key, options);
    };

    public render() {
        const { task, onClose } = this.props;
        if (!task) return null;

        const { isEditing, editedTask, isSubmitting, error, conflictTasks } =
            this.state;
        const t = this.t;

        return (
            <>
                {this.renderModal(
                    isEditing
                        ? t("schedule.editSchedule")
                        : t("schedule.taskDetail"),
                    <>
                        {error && <div className="error-banner">{error}</div>}
                        <div className="task-detail-content">
                            {!isEditing ? (
                                <div className="view-mode">
                                    <div className="detail-header">
                                        <h2
                                            className={`task-title ${task.completed ? "completed" : ""}`}
                                        >
                                            {task.name}
                                        </h2>
                                        <ToggleButton
                                            isToggled={task.completed}
                                            onToggle={this.handleToggleComplete}
                                            toggledIcon={
                                                <CheckCircle2 size={20} />
                                            }
                                            untoggledIcon={<Circle size={20} />}
                                            toggledText={t(
                                                "schedule.completed",
                                            )}
                                            untoggledText={t(
                                                "schedule.incomplete",
                                            )}
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="detail-row">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        task.importance ===
                                                        "high"
                                                            ? "#ef4444"
                                                            : task.importance ===
                                                                "low"
                                                              ? "#10b981"
                                                              : "#3b82f6",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "0.9rem",
                                                    color: "var(--color-text-secondary)",
                                                }}
                                            >
                                                {task.importance === "high"
                                                    ? t("schedule.highPriority")
                                                    : task.importance === "low"
                                                      ? t(
                                                            "schedule.lowPriority",
                                                        )
                                                      : t(
                                                            "schedule.normalPriority",
                                                        )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="detail-row">
                                        <Clock
                                            size={16}
                                            className="detail-icon"
                                        />
                                        <span>
                                            {format(
                                                parseISO(task.startTime),
                                                "yyyy年MM月dd日 HH:mm",
                                            )}{" "}
                                            -{" "}
                                            {format(
                                                parseISO(task.endTime),
                                                "HH:mm",
                                            )}
                                        </span>
                                    </div>

                                    {task.location && (
                                        <div className="detail-row">
                                            <MapPin
                                                size={16}
                                                className="detail-icon"
                                            />
                                            <span>{task.location}</span>
                                        </div>
                                    )}

                                    {task.description && (
                                        <div className="detail-description">
                                            <p>{task.description}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="edit-mode add-task-form">
                                    <Input
                                        label={t("schedule.taskName")}
                                        name="name"
                                        value={(editedTask as any).name}
                                        onChange={this.handleInputChange}
                                        required
                                    />
                                    <div className="ui-input-wrapper">
                                        <label className="ui-label">
                                            {t("schedule.importance")}
                                        </label>
                                        <select
                                            name="importance"
                                            value={
                                                (editedTask as any).importance
                                            }
                                            onChange={this.handleInputChange}
                                            className="ui-input"
                                        >
                                            <option value="high">
                                                {t("schedule.high")}
                                            </option>
                                            <option value="normal">
                                                {t("schedule.normal")}
                                            </option>
                                            <option value="low">
                                                {t("schedule.low")}
                                            </option>
                                        </select>
                                    </div>

                                    <div className="time-inputs">
                                        <Input
                                            label={t("schedule.startTime")}
                                            name="startTime"
                                            type="time"
                                            value={this.formatTimeValue(
                                                (editedTask as any).startTime,
                                            )}
                                            onChange={this.handleTimeChange}
                                            required
                                        />
                                        <Input
                                            label={t("schedule.endTime")}
                                            name="endTime"
                                            type="time"
                                            value={this.formatTimeValue(
                                                (editedTask as any).endTime,
                                            )}
                                            onChange={this.handleTimeChange}
                                            required
                                        />
                                    </div>

                                    <Input
                                        label={t("schedule.location")}
                                        name="location"
                                        value={(editedTask as any).location}
                                        onChange={this.handleInputChange}
                                    />
                                    <Textarea
                                        label={t("schedule.description")}
                                        name="description"
                                        value={(editedTask as any).description}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            )}
                        </div>
                    </>,
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        this.setState({ showDeleteModal: true })
                                    }
                                    disabled={isSubmitting}
                                >
                                    <Trash2
                                        size={16}
                                        style={{ marginRight: "6px" }}
                                    />{" "}
                                    {t("schedule.delete")}
                                </Button>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}
                                    >
                                        {t("common.close")}
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            this.setState({ isEditing: true })
                                        }
                                    >
                                        {t("schedule.edit")}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        this.setState({ isEditing: false })
                                    }
                                    disabled={isSubmitting}
                                >
                                    {t("common.cancel")}
                                </Button>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <Button
                                        onClick={this.handleSave}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? t("common.saving")
                                            : t("common.save")}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>,
                )}

                {/* Delete confirmation modal */}
                {this.state.showDeleteModal &&
                    this.props.task &&
                    this.renderModal(
                        t("schedule.confirmDelete"),
                        <div>
                            {this.props.task.parentTaskId ? (
                                <p>{t("schedule.deleteInstanceHint")}</p>
                            ) : (
                                <p>
                                    {t("schedule.deleteParentHint", {
                                        name: this.props.task.name,
                                    })}
                                </p>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                    marginTop: 12,
                                }}
                            >
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        this.setState({
                                            showDeleteModal: false,
                                        })
                                    }
                                    disabled={isSubmitting}
                                >
                                    {t("common.cancel")}
                                </Button>
                                {this.props.task.parentTaskId ? (
                                    <>
                                        <Button
                                            variant="secondary"
                                            onClick={
                                                this.handleDeleteOnlyInstance
                                            }
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? t("common.processing")
                                                : t("schedule.deleteOnlyThis")}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={
                                                this.handleDeleteEntireParent
                                            }
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? t("common.deleting")
                                                : t(
                                                      "schedule.deleteParentAndInstances",
                                                  )}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="danger"
                                        onClick={this.handleDeleteEntireParent}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? t("common.deleting")
                                            : t("schedule.confirmDelete")}
                                    </Button>
                                )}
                            </div>
                        </div>,
                    )}

                {/* Conflict modal */}
                {this.state.showConflictModal &&
                    this.renderModal(
                        t("schedule.conflictWarning"),
                        <>
                            <p
                                style={{
                                    marginBottom: "1rem",
                                    color: "var(--color-text-medium)",
                                }}
                            >
                                {t("schedule.conflictUpdatedMessage")}
                            </p>
                            <div
                                className="conflict-list"
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                            >
                                {conflictTasks.map((t) => (
                                    <div
                                        key={t.id}
                                        style={{
                                            padding: "10px",
                                            marginBottom: "8px",
                                            backgroundColor: "#fff5f5",
                                            border: "1px solid #feb2b2",
                                            borderRadius: "6px",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                color: "#c53030",
                                            }}
                                        >
                                            {t.name}
                                        </div>
                                        <div
                                            style={{
                                                color: "#742a2a",
                                                fontSize: "0.85rem",
                                                marginTop: "4px",
                                            }}
                                        >
                                            {format(
                                                parseISO(t.startTime),
                                                "HH:mm",
                                            )}{" "}
                                            -{" "}
                                            {format(
                                                parseISO(t.endTime),
                                                "HH:mm",
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    marginTop: 12,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button
                                    onClick={() =>
                                        this.setState({
                                            showConflictModal: false,
                                        })
                                    }
                                >
                                    {t("common.gotIt")}
                                </Button>
                            </div>
                        </>,
                    )}
            </>
        );
    }
}

export default TaskDetailModal;
