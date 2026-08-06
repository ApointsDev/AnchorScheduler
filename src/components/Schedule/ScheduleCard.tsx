import React from "react";
import { MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import "../../styles/Schedule.css";

export interface ScheduleCardProps {
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    status?: "active" | "completed" | "overdue" | "upcoming";
    progress?: number; // 0–100 elapsed percentage for active tasks
    onClick?: () => void;
    rightActions?: React.ReactNode;
    className?: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    name,
    description,
    startTime,
    endTime,
    location,
    status = "upcoming",
    progress,
    onClick,
    rightActions,
    className = "",
}) => {
    const isCompleted = status === "completed";
    const isActive = status === "active";
    const dividerColored = isCompleted || (isActive && progress !== undefined);

    let dividerStyle: React.CSSProperties = {};
    if (isCompleted) {
        dividerStyle = {
            background: `repeating-linear-gradient(to bottom, var(--color-success-400) 0px, var(--color-success-400) 5px, transparent 5px, transparent 10px)`,
        };
    } else if (isActive && progress !== undefined) {
        const pct = Math.min(100, Math.max(0, progress));
        dividerStyle = {
            background: `linear-gradient(to bottom, var(--color-primary) ${pct}%, transparent ${pct}%)`,
        };
    }

    return (
        <div className={`ios-card ${className}`} onClick={onClick}>
            <div className="ios-card-left">
                <span className="ios-card-time">
                    {format(parseISO(startTime), "HH:mm")}
                </span>
                <span className="ios-card-time-end">
                    {format(parseISO(endTime), "HH:mm")}
                </span>
            </div>

            <div
                className={`ios-card-divider ${dividerColored ? "divider-colored" : ""}`}
                style={dividerStyle}
            />

            <div className="ios-card-right">
                <h3
                    className="ios-card-title"
                    style={{
                        opacity: isCompleted ? 0.45 : 1,
                        textDecoration: isCompleted ? "line-through" : "none",
                    }}
                >
                    {name}
                </h3>
                {description && <p className="ios-card-desc">{description}</p>}
                {location && (
                    <span className="ios-card-location">
                        <MapPin size={12} />
                        {location}
                    </span>
                )}
            </div>

            {rightActions && (
                <div
                    className="ios-card-actions"
                    onClick={(e) => e.stopPropagation()}
                >
                    {rightActions}
                </div>
            )}
        </div>
    );
};

export default ScheduleCard;
