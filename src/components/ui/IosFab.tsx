import React from "react";
import { Plus } from "lucide-react";

interface IosFabProps {
    onClick: () => void;
    title?: string;
}

/**
 * iOS 风格悬浮添加按钮 — 固定在右下角
 */
const IosFab: React.FC<IosFabProps> = ({ onClick, title }) => {
    return (
        <button className="ios-fab" onClick={onClick} title={title}>
            <Plus size={22} />
        </button>
    );
};

export default IosFab;
