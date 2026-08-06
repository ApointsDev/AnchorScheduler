import React from "react";
import ViewToggle from "./ViewToggle";

export interface IosTabOption {
    key: string;
    icon: React.ElementType;
    label: string;
}

interface IosTabBarProps {
    options: IosTabOption[];
    activeKey: string;
    onChange: (key: string) => void;
    /** 悬浮模式：fixed 定位在底部 */
    floating?: boolean;
    className?: string;
}

/**
 * iOS 风格选项卡 —— 继承自 ViewToggle（variant="ios"）。
 *
 * 提供更简洁的 API（activeKey / key / icon / label），
 * 内部委托给 ViewToggle 渲染，保持动画、圆角等样式一致。
 */
const IosTabBar: React.FC<IosTabBarProps> = ({
    options,
    activeKey,
    onChange,
    floating = false,
    className = "",
}) => {
    return (
        <ViewToggle
            variant="ios"
            floating={floating}
            value={activeKey}
            onChange={onChange}
            className={className}
            options={options.map((o) => ({
                value: o.key,
                icon: o.icon,
                label: o.label,
            }))}
        />
    );
};

export default IosTabBar;
