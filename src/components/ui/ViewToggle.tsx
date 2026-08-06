import React from "react";
import "../../styles/Schedule.css";
import "../../styles/IosTabBar.css";

export interface ViewToggleOption {
    value: string;
    label: React.ReactNode;
    /** iOS variant only: separate icon component rendered before label */
    icon?: React.ElementType;
}

interface ViewToggleProps {
    value: string;
    onChange: (v: string) => void;
    options: ViewToggleOption[];
    /**
     * 视觉变体：
     * - "default"：原有 filter-btn 风格（方角、无滑杆动画）
     * - "ios"：iOS 风格（圆角、毛玻璃、白色指示器滑动动画）
     */
    variant?: "default" | "ios";
    /** iOS 变体专属：贴底居中悬浮 */
    floating?: boolean;
    className?: string;
}

/** 计算滑动指示器的宽度和位移，支持任意数量的选项 */
function calcSliderStyle(
    activeIndex: number,
    tabCount: number,
    gapPx: number,
    paddingPx: number,
): React.CSSProperties {
    if (tabCount <= 1) return { display: "none" };
    const totalGap = gapPx * (tabCount - 1);
    const totalPadding = paddingPx * 2;
    return {
        width: `calc((100% - ${totalPadding}px - ${totalGap}px) / ${tabCount})`,
        transform:
            activeIndex === 0
                ? "translateX(0)"
                : `translateX(calc(${activeIndex * 100}% + ${activeIndex * gapPx}px))`,
    };
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    value,
    onChange,
    options,
    variant = "default",
    floating = false,
    className = "",
}) => {
    const activeIndex = options.findIndex((o) => o.value === value);

    /* ── iOS 变体 ──────────────────────────────────────── */
    if (variant === "ios") {
        return (
            <div
                className={`ios-tab-bar${floating ? " ios-tab-bar--floating" : ""} ${className}`.trim()}
                role="tablist"
            >
                {/* 滑动指示器：真实 DOM 元素，支持任意数量的选项 */}
                <div
                    className="ios-tab-bar-slider"
                    style={calcSliderStyle(activeIndex, options.length, 4, 4)}
                />
                {options.map((opt) => (
                    <button
                        key={String(opt.value)}
                        type="button"
                        className={`ios-tab ${opt.value === value ? "ios-tab-active" : ""}`}
                        onClick={() => onChange(opt.value)}
                        role="tab"
                        aria-selected={opt.value === value}
                    >
                        {opt.icon && <opt.icon size={20} />}
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        );
    }

    /* ── Default 变体（原有 filter-btn 风格） ──────────── */
    return (
        <div className={`filter-group ${className}`.trim()} role="tablist">
            {/* 滑动指示器：真实 DOM 元素，支持任意数量的选项 */}
            <div
                className="filter-group-slider"
                style={calcSliderStyle(activeIndex, options.length, 0, 4)}
            />
            {options.map((opt) => (
                <button
                    key={String(opt.value)}
                    type="button"
                    className={`filter-btn ${opt.value === value ? "active" : ""}`}
                    onClick={() => onChange(opt.value)}
                    role="tab"
                    aria-selected={opt.value === value}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default ViewToggle;
