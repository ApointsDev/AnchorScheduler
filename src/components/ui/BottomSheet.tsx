import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { isBelow } from "../../utils/breakpoints";
import "../../styles/BottomSheet.css";

interface BottomSheetProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    /** 底部操作区（如取消/确认按钮） */
    footer?: React.ReactNode;
    /** 在宽屏上以侧栏展示（不再弹出），窄屏弹出 */
    sidebarWidth?: number;
}

/**
 * 响应式面板组件：
 * - 宽屏（>=768px）：渲染为固定宽度侧栏，紧贴左侧
 * - 窄屏（<768px）：从底部滑入的浮层面板
 */
const BottomSheet: React.FC<BottomSheetProps> = ({
    open,
    onClose,
    title,
    children,
    footer,
    sidebarWidth = 260,
}) => {
    const { t } = useTranslation();
    const isNarrow = isBelow("md");
    const sheetRef = useRef<HTMLDivElement>(null);
    const wasOpen = useRef(false);

    // 打开时锁定 body 滚动（窄屏）
    useEffect(() => {
        if (isNarrow && open) {
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = "";
            };
        }
    }, [isNarrow, open]);

    // 打开时捕获焦点
    useEffect(() => {
        if (open && !wasOpen.current && sheetRef.current) {
            sheetRef.current.focus();
        }
        wasOpen.current = open;
    }, [open]);

    // ESC 关闭
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    // 宽屏：侧栏模式
    if (!isNarrow) {
        return (
            <aside
                className="bottomsheet-sidebar"
                style={{ width: sidebarWidth, minWidth: sidebarWidth }}
                ref={sheetRef}
                tabIndex={-1}
            >
                {title && (
                    <div className="bottomsheet-sidebar-header">
                        <span className="bottomsheet-title">{title}</span>
                        <button
                            className="bottomsheet-close-btn"
                            onClick={onClose}
                            aria-label={t("common.close")}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                <div className="bottomsheet-sidebar-body">{children}</div>
                {footer && (
                    <div className="bottomsheet-sidebar-footer">{footer}</div>
                )}
            </aside>
        );
    }

    // 窄屏：底部弹出
    return (
        <div className="bottomsheet-overlay" onClick={onClose}>
            <div
                className="bottomsheet-panel"
                onClick={(e) => e.stopPropagation()}
                ref={sheetRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="bottomsheet-handle" />
                {title && (
                    <div className="bottomsheet-header">
                        <span className="bottomsheet-title">{title}</span>
                        <button
                            className="bottomsheet-close-btn"
                            onClick={onClose}
                            aria-label={t("common.close")}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
                <div className="bottomsheet-body">{children}</div>
                {footer && <div className="bottomsheet-footer">{footer}</div>}
            </div>
        </div>
    );
};

export default BottomSheet;
