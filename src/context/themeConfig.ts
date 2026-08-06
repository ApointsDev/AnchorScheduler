/**
 * Theme configuration — types and constants shared across the theme system.
 *
 * Separated from ThemeContext.tsx to satisfy React Fast Refresh
 * (which requires files that only export components).
 */

/** Supported theme identifiers. */
export type ThemeId = "default" | "line-style" | "figma";

/** Storage key for persisting the selected visual style. */
export const THEME_STORAGE_KEY = "app-style-theme";

/** All available visual style themes (for UI selectors). */
export const THEME_LIST: { id: ThemeId; label: string; labelZh: string }[] = [
    { id: "default", label: "默认风格", labelZh: "默认风格" },
    { id: "line-style", label: "线条风格", labelZh: "线条风格" },
    { id: "figma", label: "Figma 风格", labelZh: "Figma 风格" },
];
