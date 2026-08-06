import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "theme";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getStoredTheme(): Theme | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        // localStorage unavailable
    }
    return null;
}

function applyTheme(theme: Theme) {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Theme hook: persists to localStorage, falls back to system preference.
 * Apply once in the root component; other components read via useTheme().
 */
export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        return getStoredTheme() ?? getSystemTheme();
    });

    // Apply on mount and when theme changes
    useEffect(() => {
        applyTheme(theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // ignore
        }
    }, [theme]);

    // Listen for system preference changes (only when no stored preference)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            if (!getStoredTheme()) {
                setThemeState(e.matches ? "dark" : "light");
            }
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const isDark = theme === "dark";

    return { theme, isDark, toggleTheme, setTheme: setThemeState };
}
