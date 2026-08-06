import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { type ThemeId, THEME_STORAGE_KEY, THEME_LIST } from "./themeConfig";

interface ThemeContextValue {
    /** Current theme id */
    theme: ThemeId;
    /** Switch to a different theme */
    setTheme: (theme: ThemeId) => void;
    /** List of available themes */
    themeList: typeof THEME_LIST;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeId): void {
    const root = document.documentElement;

    if (theme === "line-style") {
        root.setAttribute("data-style-theme", "line-style");
        console.log("[Theme] Applied line-style theme");
    } else if (theme === "figma") {
        root.setAttribute("data-style-theme", "figma");
        console.log("[Theme] Applied figma theme");
    } else {
        root.removeAttribute("data-style-theme");
        console.log("[Theme] Applied default theme");
    }
    // "default" needs no attribute — the :root tokens in tokens.css kick in naturally
}

function readStoredTheme(): ThemeId {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "line-style") return "line-style";
        if (stored === "figma") return "figma";
    } catch {
        // localStorage unavailable — ignore
    }
    return "default";
}

function persistTheme(theme: ThemeId): void {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // ignore
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeId>(readStoredTheme);

    // Apply on mount and on every theme change
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = useCallback((next: ThemeId) => {
        setThemeState(next);
        persistTheme(next);
    }, []);

    return (
        <ThemeContext.Provider
            value={{ theme, setTheme, themeList: THEME_LIST }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access the current theme and switch themes.
 *
 * @example
 *   const { theme, setTheme } = useTheme();
 */
export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within a <ThemeProvider>");
    }
    return ctx;
}
