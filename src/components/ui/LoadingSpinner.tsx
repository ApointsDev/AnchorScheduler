import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    /** 显示的文字，默认"加载中..." */
    text?: string;
    /** 是否占满整个容器高度（用于页面级加载） */
    fullHeight?: boolean;
    /** 图标大小 */
    size?: number;
}

/**
 * 全局统一的加载指示器
 * - fullHeight: 用于页面/视图级别的全屏加载
 * - 默认: 用于内容区域的内联加载
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    text,
    fullHeight = false,
    size = 24,
}) => {
    const { t } = useTranslation();
    const displayText = text ?? t("common.loading");
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                color: "var(--color-text-light)",
                fontSize: "0.9rem",
                padding: fullHeight ? 0 : "32px 16px",
                height: fullHeight ? "100%" : undefined,
                minHeight: fullHeight ? "200px" : undefined,
            }}
        >
            <Loader2
                size={size}
                style={{
                    animation: "spin 1s linear infinite",
                    opacity: 0.6,
                }}
            />
            <span>{displayText}</span>
        </div>
    );
};

export default LoadingSpinner;
