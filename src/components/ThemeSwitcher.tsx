import { useTheme } from "../context/ThemeContext";
import { THEME_LIST, type ThemeId } from "../context/themeConfig";
import { Palette } from "lucide-react";
import "../styles/ThemeSwitcher.css";

/**
 * Visual style theme switcher.
 *
 * Renders a compact dropdown or button group that lets the user
 * choose between the default theme and the line-style theme.
 *
 * This is orthogonal to dark mode — the selected visual style
 * composes with dark mode via CSS cascade.
 */
export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="theme-switcher">
            <Palette size={16} className="theme-switcher-icon" />
            <select
                className="theme-switcher-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value as ThemeId)}
                aria-label="切换视觉风格"
            >
                {THEME_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
