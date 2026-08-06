import React from "react";
import { format, parseISO } from "date-fns";
import { type Task } from "../../services/api";

export interface MiniScheduleCardProps {
    task: Task;
    /** "timeline" for week view (absolute positioned), "grid" for month view (inline in grid cell) */
    variant: "timeline" | "grid";
    /** Absolute positioning style (only used by timeline variant) */
    style?: React.CSSProperties;
    /** Extra class names */
    className?: string;
    onClick?: (task: Task) => void;
}

const MiniScheduleCard: React.FC<MiniScheduleCardProps> = ({
    task,
    variant,
    style,
    className = "",
    onClick,
}) => {
    const start = parseISO(task.startTime);
    const end = parseISO(task.endTime);
    const durationMinutes =
        (end.getTime() - start.getTime()) / (1000 * 60);
    const compact = variant === "timeline" && durationMinutes < 40;

    const baseClass = [
        "mini-task",
        `importance-${task.importance || "normal"}`,
        task.completed ? "task-completed" : "",
        variant === "timeline" ? "absolute-task" : "",
        compact ? "compact-task" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const title =
        variant === "timeline"
            ? `${task.name}${task.description ? "\n" + task.description : ""}\n${format(start, "HH:mm")} - ${format(end, "HH:mm")}`
            : task.name;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.(task);
    };

    if (variant === "timeline") {
        return (
            <div
                className={baseClass}
                style={style}
                onClick={handleClick}
                title={title}
            >
                <div className="task-content-wrapper">
                    <span className="task-name">{task.name}</span>
                    {task.description && durationMinutes > 30 && (
                        <span className="task-description">
                            {task.description}
                        </span>
                    )}
                    {durationMinutes > 20 && (
                        <span className="task-time-label">
                            {format(start, "HH:mm")}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // grid variant
    return (
        <div className={baseClass} onClick={handleClick} title={title}>
            <div className="task-info">
                <span className="task-time">
                    {format(start, "HH:mm")}
                </span>
                <span className="task-name">{task.name}</span>
            </div>
        </div>
    );
};

export default MiniScheduleCard;
