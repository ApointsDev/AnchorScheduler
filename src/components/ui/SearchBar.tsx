import React from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Input } from "./Input";
import "../../styles/Schedule.css";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/**
 * 通用搜索栏组件
 * 样式复用 Schedule.css 中的 .search-input-container / .search-icon
 */
const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder,
    className = "",
}) => {
    const { t } = useTranslation();
    const effectivePlaceholder = placeholder ?? t("common.search");
    return (
        <div className={`search-input-container ${className}`}>
            <Search size={18} className="search-icon" />
            <Input
                placeholder={effectivePlaceholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    className="search-clear-btn"
                    onClick={() => onChange("")}
                    type="button"
                    aria-label={t("common.clearSearch")}
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
