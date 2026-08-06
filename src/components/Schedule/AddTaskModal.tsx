import React, { useState, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { toShanghaiISO } from "../../utils/time";
import {
    createTask,
    createTasksBatch,
    ScheduleConflictError,
    type Task,
    type ScheduleType,
} from "../../services/api";
import { Modal } from "../ui/Modal";
import BottomSheet from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Upload } from "lucide-react";
import { isBelow } from "../../utils/breakpoints";
import "../../styles/Schedule.css";

type TaskType = "interval" | "point";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
    isOpen,
    onClose,
    onTaskCreated,
}) => {
    const { t } = useTranslation();
    const [taskType, setTaskType] = useState<TaskType>("interval");
    const [newTask, setNewTask] = useState({
        name: "",
        description: "",
        startTime: format(new Date(), "HH:mm"),
        endTime: format(new Date(), "HH:mm"),
        dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        location: "",
        importance: "normal" as "high" | "normal" | "low",
    });
    const [recurrenceType, setRecurrenceType] = useState<
        "none" | "dailyOnDays" | "weeklyByWeekNumber"
    >("none");
    const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]); // 0-6
    const [recurrenceWeeks, setRecurrenceWeeks] = useState<string>(""); // comma separated numbers
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [conflictTasks, setConflictTasks] = useState<Task[]>([]);
    const [isMobile, setIsMobile] = useState(() => isBelow("md"));
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(isBelow("md"));
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const resetForm = () => {
        setNewTask({
            name: "",
            description: "",
            startTime: format(new Date(), "HH:mm"),
            endTime: format(new Date(), "HH:mm"),
            dueDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            location: "",
            importance: "normal",
        });
        setFormError("");
        setTaskType("interval");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const parseIcsDate = (dateStr: string): Date => {
        // Basic parsing for YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));

        if (dateStr.length <= 8) {
            // Date only
            return new Date(year, month, day);
        }

        const hour = parseInt(dateStr.substring(9, 11)) || 0;
        const minute = parseInt(dateStr.substring(11, 13)) || 0;
        const second = parseInt(dateStr.substring(13, 15)) || 0;

        if (dateStr.endsWith("Z")) {
            return new Date(Date.UTC(year, month, day, hour, minute, second));
        }
        return new Date(year, month, day, hour, minute, second);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSubmitting(true);
        setFormError("");

        try {
            const text = await file.text();
            const lines = text.split(/\r\n|\n|\r/);
            const tasksToCreate: any[] = [];
            let currentEvent: any = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                if (line.startsWith("BEGIN:VEVENT")) {
                    currentEvent = {};
                } else if (line.startsWith("END:VEVENT")) {
                    if (
                        currentEvent &&
                        currentEvent.summary &&
                        currentEvent.dtStart &&
                        currentEvent.dtEnd
                    ) {
                        tasksToCreate.push({
                            name: currentEvent.summary,
                            description: currentEvent.description || "",
                            location: currentEvent.location || "",
                            startTime: toShanghaiISO(currentEvent.dtStart),
                            endTime: toShanghaiISO(currentEvent.dtEnd),
                            dueDate: toShanghaiISO(currentEvent.dtEnd),
                            pushedToMSTodo: false,
                            scheduleType: "single",
                        });
                    }
                    currentEvent = null;
                } else if (currentEvent) {
                    if (line.startsWith("SUMMARY:")) {
                        currentEvent.summary = line.substring(8);
                    } else if (line.startsWith("DESCRIPTION:")) {
                        currentEvent.description = line.substring(12);
                    } else if (line.startsWith("LOCATION:")) {
                        currentEvent.location = line.substring(9);
                    } else if (line.startsWith("DTSTART")) {
                        const parts = line.split(":");
                        const dateStr = parts[parts.length - 1];
                        currentEvent.dtStart = parseIcsDate(dateStr);
                    } else if (line.startsWith("DTEND")) {
                        const parts = line.split(":");
                        const dateStr = parts[parts.length - 1];
                        currentEvent.dtEnd = parseIcsDate(dateStr);
                    }
                }
            }

            if (tasksToCreate.length > 0) {
                const result = await createTasksBatch(tasksToCreate);
                const { created, conflicts, errors } = result.summary;

                let message = t("schedule.importSuccess", {
                    created,
                }) as string;
                if (conflicts > 0)
                    message += t("schedule.importConflicts", { conflicts });
                if (errors > 0)
                    message += t("schedule.importErrors", { errors });

                alert(message);

                if (created > 0) {
                    onTaskCreated();
                    handleClose();
                }
            } else {
                setFormError(t("schedule.noValidEvents"));
            }
        } catch (error) {
            console.error(
                "Failed to parse ICS file or batch create tasks",
                error,
            );
            setFormError(
                t("schedule.importFailed") +
                    (error instanceof Error
                        ? error.message
                        : t("common.unknownError")),
            );
        } finally {
            setIsSubmitting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleAddTask = async () => {
        if (
            !newTask.name ||
            (taskType === "interval" &&
                (!newTask.startTime || !newTask.endTime)) ||
            (taskType === "point" && !newTask.dueDate)
        ) {
            setFormError(t("schedule.fillRequired"));
            return;
        }
        setFormError("");
        setIsSubmitting(true);

        try {
            const todayStr = format(new Date(), "yyyy-MM-dd");
            let taskData: any;

            let scheduleType: ScheduleType = "single";

            if (taskType === "interval") {
                const startTime = new Date(`${todayStr}T${newTask.startTime}`);
                const endTime = new Date(`${todayStr}T${newTask.endTime}`);
                taskData = {
                    name: newTask.name,
                    description: newTask.description,
                    location: newTask.location,
                    startTime: toShanghaiISO(startTime),
                    endTime: toShanghaiISO(endTime),
                    dueDate: toShanghaiISO(endTime),
                    pushedToMSTodo: false,
                    importance: newTask.importance,
                    scheduleType,
                };
            } else {
                // point task
                const dueDate = new Date(newTask.dueDate);
                taskData = {
                    name: newTask.name,
                    description: newTask.description,
                    location: newTask.location,
                    startTime: toShanghaiISO(dueDate),
                    endTime: toShanghaiISO(dueDate),
                    dueDate: toShanghaiISO(dueDate),
                    pushedToMSTodo: false,
                    importance: newTask.importance,
                    scheduleType,
                };
            }

            // attach recurrenceRule if user selected recurrence
            if (recurrenceType !== "none") {
                if (recurrenceType === "dailyOnDays") {
                    taskData.recurrenceRule = {
                        freq: "dailyOnDays",
                        days: recurrenceDays,
                    };
                    taskData.scheduleType = "recurring_daily_on_days";
                } else if (recurrenceType === "weeklyByWeekNumber") {
                    const weeks = recurrenceWeeks
                        .split(",")
                        .map((s) => parseInt(s.trim()))
                        .filter((n) => !isNaN(n));
                    taskData.recurrenceRule = {
                        freq: "weeklyByWeekNumber",
                        weeks,
                    };
                    taskData.scheduleType = "recurring_weekly_by_week_number";
                }
            }

            const result = await createTask(taskData);

            if (result.conflictWarning) {
                setConflictTasks(result.conflictWarning.conflicts);
                setShowConflictModal(true);
                onTaskCreated();
                // Don't close the modal immediately so the conflict modal can be seen
                // We will close it when the conflict modal is closed
            } else {
                onTaskCreated();
                handleClose();
            }
        } catch (error) {
            console.error("Failed to create task", error);
            // ScheduleConflictError is no longer thrown for conflicts, but keep for safety
            if (error instanceof ScheduleConflictError) {
                setConflictTasks(error.conflicts);
                setShowConflictModal(true);
            } else {
                setFormError(
                    t("schedule.createFailed") +
                        (error instanceof Error
                            ? error.message
                            : t("common.unknownError")),
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConflictModalClose = () => {
        setShowConflictModal(false);
        handleClose();
    };

    const dayLabels = [
        t("schedule.day.sun"),
        t("schedule.day.mon"),
        t("schedule.day.tue"),
        t("schedule.day.wed"),
        t("schedule.day.thu"),
        t("schedule.day.fri"),
        t("schedule.day.sat"),
    ];

    return (
        <>
            {isMobile ? (
                <BottomSheet
                    open={isOpen}
                    onClose={handleClose}
                    title={t("schedule.addSchedule")}
                    sidebarWidth={340}
                    footer={
                        <>
                            <div style={{ marginRight: "auto" }}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".ics"
                                    style={{ display: "none" }}
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleImportClick}
                                    disabled={isSubmitting}
                                >
                                    <Upload
                                        size={16}
                                        style={{ marginRight: "6px" }}
                                    />{" "}
                                    {t("schedule.importCalendar")}
                                </Button>
                            </div>
                            <Button variant="secondary" onClick={handleClose}>
                                {t("common.cancel")}
                            </Button>
                            <Button
                                onClick={handleAddTask}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? t("common.adding")
                                    : t("schedule.confirmAdd")}
                            </Button>
                        </>
                    }
                >
                    {formError && (
                        <div className="error-banner">{formError}</div>
                    )}
                    <div className="add-task-form">
                        <div className="task-type-selector">
                            <Button
                                variant={
                                    taskType === "interval"
                                        ? "primary"
                                        : "secondary"
                                }
                                onClick={() => setTaskType("interval")}
                            >
                                {t("schedule.intervalTask")}
                            </Button>
                            <Button
                                variant={
                                    taskType === "point"
                                        ? "primary"
                                        : "secondary"
                                }
                                onClick={() => setTaskType("point")}
                            >
                                {t("schedule.deadlineTask")}
                            </Button>
                        </div>

                        <Input
                            label={t("schedule.taskName")}
                            name="name"
                            value={newTask.name}
                            onChange={handleInputChange}
                            placeholder={t("schedule.taskNamePlaceholder")}
                            required
                        />
                        <Textarea
                            label={t("schedule.descriptionOptional")}
                            name="description"
                            value={newTask.description}
                            onChange={handleInputChange}
                            placeholder={t("schedule.descriptionPlaceholder")}
                        />
                        <Input
                            label={t("schedule.locationOptional")}
                            name="location"
                            value={newTask.location}
                            onChange={handleInputChange}
                            placeholder={t("schedule.locationPlaceholder")}
                        />

                        {taskType === "interval" ? (
                            <div className="time-inputs">
                                <Input
                                    label={t("schedule.startTime")}
                                    name="startTime"
                                    type="time"
                                    value={newTask.startTime}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    label={t("schedule.endTime")}
                                    name="endTime"
                                    type="time"
                                    value={newTask.endTime}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div
                                    className="ui-input-wrapper"
                                    style={{ flex: 1 }}
                                >
                                    <label className="ui-label">
                                        {t("schedule.importance")}
                                    </label>
                                    <select
                                        name="importance"
                                        value={newTask.importance}
                                        onChange={handleInputChange}
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
                            </div>
                        ) : (
                            <div className="time-inputs">
                                <Input
                                    label={t("schedule.dueDate")}
                                    name="dueDate"
                                    type="datetime-local"
                                    value={newTask.dueDate}
                                    onChange={handleInputChange}
                                    required
                                    style={{ flex: 2 }}
                                />
                                <div
                                    className="ui-input-wrapper"
                                    style={{ flex: 1 }}
                                >
                                    <label className="ui-label">
                                        {t("schedule.importance")}
                                    </label>
                                    <select
                                        name="importance"
                                        value={newTask.importance}
                                        onChange={handleInputChange}
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
                            </div>
                        )}

                        <div style={{ marginTop: 8 }}>
                            <label className="ui-label">
                                {t("schedule.recurrenceOptional")}
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 6,
                                }}
                            >
                                <Button
                                    variant={
                                        recurrenceType === "none"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() => setRecurrenceType("none")}
                                >
                                    {t("schedule.none")}
                                </Button>
                                <Button
                                    variant={
                                        recurrenceType === "dailyOnDays"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() =>
                                        setRecurrenceType("dailyOnDays")
                                    }
                                >
                                    {t("schedule.dailyTask")}
                                </Button>
                                <Button
                                    variant={
                                        recurrenceType === "weeklyByWeekNumber"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() =>
                                        setRecurrenceType("weeklyByWeekNumber")
                                    }
                                >
                                    {t("schedule.weeklyTask")}
                                </Button>
                            </div>

                            {recurrenceType === "dailyOnDays" && (
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: "flex",
                                        gap: 6,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {dayLabels.map((label, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`filter-btn ${recurrenceDays.includes(idx % 7) ? "active" : ""}`}
                                            onClick={() => {
                                                setRecurrenceDays((prev) =>
                                                    prev.includes(idx)
                                                        ? prev.filter(
                                                              (d) => d !== idx,
                                                          )
                                                        : [...prev, idx],
                                                );
                                            }}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {recurrenceType === "weeklyByWeekNumber" && (
                                <div style={{ marginTop: 8 }}>
                                    <Input
                                        label={t("schedule.weekNumbersLabel")}
                                        name="recurrenceWeeks"
                                        value={recurrenceWeeks}
                                        onChange={(e) =>
                                            setRecurrenceWeeks(e.target.value)
                                        }
                                        placeholder={t(
                                            "schedule.weekNumbersPlaceholder",
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </BottomSheet>
            ) : (
                <Modal
                    isOpen={isOpen}
                    onClose={handleClose}
                    title={t("schedule.addSchedule")}
                    footer={
                        <>
                            <div style={{ marginRight: "auto" }}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept=".ics"
                                    style={{ display: "none" }}
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleImportClick}
                                    disabled={isSubmitting}
                                >
                                    <Upload
                                        size={16}
                                        style={{ marginRight: "6px" }}
                                    />{" "}
                                    {t("schedule.importCalendar")}
                                </Button>
                            </div>
                            <Button variant="secondary" onClick={handleClose}>
                                {t("common.cancel")}
                            </Button>
                            <Button
                                onClick={handleAddTask}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? t("common.adding")
                                    : t("schedule.confirmAdd")}
                            </Button>
                        </>
                    }
                >
                    {formError && (
                        <div className="error-banner">{formError}</div>
                    )}
                    <div className="add-task-form">
                        <div className="task-type-selector">
                            <Button
                                variant={
                                    taskType === "interval"
                                        ? "primary"
                                        : "secondary"
                                }
                                onClick={() => setTaskType("interval")}
                            >
                                {t("schedule.intervalTask")}
                            </Button>
                            <Button
                                variant={
                                    taskType === "point"
                                        ? "primary"
                                        : "secondary"
                                }
                                onClick={() => setTaskType("point")}
                            >
                                {t("schedule.deadlineTask")}
                            </Button>
                        </div>

                        <Input
                            label={t("schedule.taskName")}
                            name="name"
                            value={newTask.name}
                            onChange={handleInputChange}
                            placeholder={t("schedule.taskNamePlaceholder")}
                            required
                        />
                        <Textarea
                            label={t("schedule.descriptionOptional")}
                            name="description"
                            value={newTask.description}
                            onChange={handleInputChange}
                            placeholder={t("schedule.descriptionPlaceholder")}
                        />
                        <Input
                            label={t("schedule.locationOptional")}
                            name="location"
                            value={newTask.location}
                            onChange={handleInputChange}
                            placeholder={t("schedule.locationPlaceholder")}
                        />

                        {taskType === "interval" ? (
                            <div className="time-inputs">
                                <Input
                                    label={t("schedule.startTime")}
                                    name="startTime"
                                    type="time"
                                    value={newTask.startTime}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    label={t("schedule.endTime")}
                                    name="endTime"
                                    type="time"
                                    value={newTask.endTime}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div
                                    className="ui-input-wrapper"
                                    style={{ flex: 1 }}
                                >
                                    <label className="ui-label">
                                        {t("schedule.importance")}
                                    </label>
                                    <select
                                        name="importance"
                                        value={newTask.importance}
                                        onChange={handleInputChange}
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
                            </div>
                        ) : (
                            <div className="time-inputs">
                                <Input
                                    label={t("schedule.dueDate")}
                                    name="dueDate"
                                    type="datetime-local"
                                    value={newTask.dueDate}
                                    onChange={handleInputChange}
                                    required
                                    style={{ flex: 2 }}
                                />
                                <div
                                    className="ui-input-wrapper"
                                    style={{ flex: 1 }}
                                >
                                    <label className="ui-label">
                                        {t("schedule.importance")}
                                    </label>
                                    <select
                                        name="importance"
                                        value={newTask.importance}
                                        onChange={handleInputChange}
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
                            </div>
                        )}

                        <div style={{ marginTop: 8 }}>
                            <label className="ui-label">
                                {t("schedule.recurrenceOptional")}
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 6,
                                }}
                            >
                                <Button
                                    variant={
                                        recurrenceType === "none"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() => setRecurrenceType("none")}
                                >
                                    {t("schedule.none")}
                                </Button>
                                <Button
                                    variant={
                                        recurrenceType === "dailyOnDays"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() =>
                                        setRecurrenceType("dailyOnDays")
                                    }
                                >
                                    {t("schedule.dailyTask")}
                                </Button>
                                <Button
                                    variant={
                                        recurrenceType === "weeklyByWeekNumber"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    onClick={() =>
                                        setRecurrenceType("weeklyByWeekNumber")
                                    }
                                >
                                    {t("schedule.weeklyTask")}
                                </Button>
                            </div>

                            {recurrenceType === "dailyOnDays" && (
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: "flex",
                                        gap: 6,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {dayLabels.map((label, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`filter-btn ${recurrenceDays.includes(idx % 7) ? "active" : ""}`}
                                            onClick={() => {
                                                setRecurrenceDays((prev) =>
                                                    prev.includes(idx)
                                                        ? prev.filter(
                                                              (d) => d !== idx,
                                                          )
                                                        : [...prev, idx],
                                                );
                                            }}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {recurrenceType === "weeklyByWeekNumber" && (
                                <div style={{ marginTop: 8 }}>
                                    <Input
                                        label={t("schedule.weekNumbersLabel")}
                                        name="recurrenceWeeks"
                                        value={recurrenceWeeks}
                                        onChange={(e) =>
                                            setRecurrenceWeeks(e.target.value)
                                        }
                                        placeholder={t(
                                            "schedule.weekNumbersPlaceholder",
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            <Modal
                isOpen={showConflictModal}
                onClose={handleConflictModalClose}
                title={t("schedule.conflictWarning")}
                footer={
                    <Button onClick={handleConflictModalClose}>
                        {t("common.gotIt")}
                    </Button>
                }
            >
                <p
                    style={{
                        marginBottom: "1rem",
                        color: "var(--color-text-medium)",
                    }}
                >
                    {t("schedule.conflictMessage")}
                </p>
                <div
                    className="conflict-list"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                    {conflictTasks.map((task) => (
                        <div
                            key={task.id}
                            style={{
                                padding: "10px",
                                marginBottom: "8px",
                                backgroundColor: "var(--color-danger-50)",
                                border: "1px solid var(--color-danger-200)",
                                borderRadius: "6px",
                                fontSize: "0.9rem",
                            }}
                        >
                            <div
                                style={{
                                    fontWeight: "bold",
                                    color: "var(--color-danger-600)",
                                }}
                            >
                                {task.name}
                            </div>
                            <div
                                style={{
                                    color: "var(--color-danger-800)",
                                    fontSize: "0.85rem",
                                    marginTop: "4px",
                                }}
                            >
                                {format(parseISO(task.startTime), "HH:mm")} -{" "}
                                {format(parseISO(task.endTime), "HH:mm")}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default AddTaskModal;
