/**
 * Theme Token Definitions
 *
 * Programmatic access to theme-specific design tokens.
 * Each theme exports its own token set for use in inline styles
 * and dynamic component logic.
 */

export interface ThemeTokens {
    color: {
        primary: Record<string, string>;
        neutral: Record<string, string>;
        success: Record<string, string>;
        danger: Record<string, string>;
        warning: Record<string, string>;
        info: Record<string, string>;
        text: Record<string, string>;
        surface: Record<string, string>;
        border: Record<string, string>;
        brand: Record<string, string>;
    };
    space: Record<string, string>;
    radius: Record<string, string>;
    shadow: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
    duration: Record<string, string>;
    z: Record<string, string>;
    breakpoint: Record<string, string>;
}

/**
 * Figma 设计系统 (Figma Design System) Theme Tokens
 *
 * Color Palette (from Figma Paint Styles):
 *   #8B5CF6  — 紫色主色 (primary/500)
 *   #7C7BE0  — 紫蓝色辅色 (Secondary/500)
 *   #EC4899  — 粉红点缀 (accent/Pink)
 *   #EFBF04  — 金色点缀 (accent/Gold)
 *   #FAFAFA  — 主背景 (background/primary)
 *   #1F2937  — 主文字 (text/primary)
 */
export const figmaTokens: ThemeTokens = {
    color: {
        primary: {
            50: "#f5f3ff",
            100: "#ede9fe",
            200: "#ddd6fe",
            300: "#c4b5fd",
            400: "#a78bfa",
            500: "#8b5cf6",
            600: "#7c3aed",
            700: "#6d28d9",
            800: "#5b21b6",
            900: "#4c1d95",
        },
        neutral: {
            50: "#fafafa",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
        },
        success: {
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
        },
        danger: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
        },
        warning: {
            50: "#fffbeb",
            100: "#fff7ed",
            200: "#ffedd5",
            300: "#fed7aa",
            400: "#fdba74",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
        },
        info: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
        },
        text: {
            primary: "#1f2937",
            secondary: "#4b5563",
            tertiary: "#9ca3af",
            inverse: "#ffffff",
        },
        surface: {
            primary: "#fafafa",
            secondary: "#f3f4f6",
            card: "#ffffff",
            overlay: "rgba(0, 0, 0, 0.5)",
        },
        border: {
            default: "#e5e7eb",
            subtle: "#f3f4f6",
            strong: "#d1d5db",
        },
        brand: {
            primary: "#8b5cf6",
            hover: "#7c3aed",
            active: "#6d28d9",
        },
    },
    space: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
    },
    radius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
    },
    shadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.07)",
        lg: "0 10px 25px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 60px rgba(0, 0, 0, 0.15)",
    },
    fontSize: {
        xs: "0.7rem",
        sm: "0.8rem",
        base: "0.875rem",
        lg: "1rem",
        xl: "1.15rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
    },
    fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },
    lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.7",
    },
    duration: {
        fast: "0.15s",
        normal: "0.2s",
        slow: "0.3s",
    },
    z: {
        dropdown: "100",
        sticky: "200",
        modalBackdrop: "1000",
        modal: "1001",
        tooltip: "1100",
    },
    breakpoint: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
    },
} as const;

/**
 * 线条风格 (Line Style) Theme Tokens
 *
 * Color Palette:
 *   #FFFFFF  — 奶白基底 (milk white base)
 *   #96D0F5  — 浅天蓝主色 (light sky blue)
 *   #1A5899  — 深海藏青 (deep navy)
 *   #FFFBE8  — 米奶油浅黄 (milk cream light yellow)
 *   #10335C  — 深蓝黑 (deep blue-black)
 */
export const lineStyleTokens: ThemeTokens = {
    color: {
        primary: {
            50: "#eaf6fd",
            100: "#d5edfb",
            200: "#bde3f8",
            300: "#aadaf6",
            400: "#96d0f5",
            500: "#96d0f5",
            600: "#7abfec",
            700: "#5eafe3",
            800: "#429fda",
            900: "#1a5899",
        },
        neutral: {
            50: "#fffef5",
            100: "#fffbe8",
            200: "#f5f0d8",
            300: "#d4cfb8",
            400: "#9aaac0",
            500: "#5c7d99",
            600: "#3a5f7a",
            700: "#1a5899",
            800: "#1a5899",
            900: "#10335c",
        },
        success: {
            50: "#eafbf2",
            100: "#d1f7e2",
            200: "#a3efc4",
            300: "#6ae3a2",
            400: "#34d785",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
        },
        danger: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
        },
        warning: {
            50: "#fffbeb",
            100: "#fff7ed",
            200: "#ffedd5",
            300: "#fed7aa",
            400: "#fdba74",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
        },
        info: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
        },
        text: {
            primary: "#1a5899",
            secondary: "#3a6fa9",
            tertiary: "#7b9ec3",
            inverse: "#ffffff",
        },
        surface: {
            primary: "#fffbe8",
            secondary: "#f5f0d8",
            card: "#ffffff",
            overlay: "rgba(16, 51, 92, 0.45)",
        },
        border: {
            default: "#1a5899",
            subtle: "#96d0f5",
            strong: "#10335c",
        },
        brand: {
            primary: "#96d0f5",
            hover: "#7abfec",
            active: "#5eafe3",
        },
    },
    space: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
    },
    radius: {
        sm: "10px",
        md: "14px",
        lg: "18px",
        xl: "22px",
        "2xl": "28px",
        full: "9999px",
    },
    shadow: {
        sm: "0 1px 2px rgba(16, 51, 92, 0.06)",
        md: "0 2px 4px rgba(16, 51, 92, 0.08)",
        lg: "0 4px 8px rgba(16, 51, 92, 0.10)",
        xl: "0 6px 12px rgba(16, 51, 92, 0.12)",
    },
    fontSize: {
        xs: "0.7rem",
        sm: "0.8rem",
        base: "0.875rem",
        lg: "1rem",
        xl: "1.15rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
    },
    fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },
    lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.7",
    },
    duration: {
        fast: "0.15s",
        normal: "0.2s",
        slow: "0.3s",
    },
    z: {
        dropdown: "100",
        sticky: "200",
        modalBackdrop: "1000",
        modal: "1001",
        tooltip: "1100",
    },
    breakpoint: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
    },
} as const;
