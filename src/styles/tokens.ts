/**
 * Design Tokens — JavaScript Module
 *
 * Programmatic access to CSS design tokens defined in tokens.css.
 * Use these for inline styles and dynamic component logic.
 *
 * @example
 *   import { tokens } from '@/styles/tokens';
 *   style={{ color: tokens.color.text.primary }}
 *
 * For theme-specific tokens, see:
 *   import { lineStyleTokens } from '@/styles/themes/tokens';
 */

export {
    lineStyleTokens,
    figmaTokens,
    type ThemeTokens,
} from "./themes/tokens";

export const tokens = {
    color: {
        primary: {
            50: "#eef3ff",
            100: "#dce7fd",
            200: "#b9cffb",
            300: "#96b7f9",
            400: "#739ff7",
            500: "#467ee5",
            600: "#3765b7",
            700: "#294c8b",
            800: "#1b325e",
            900: "#0d1931",
        },
        neutral: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5568",
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
            primary: "var(--color-text-primary)",
            secondary: "var(--color-text-secondary)",
            tertiary: "var(--color-text-tertiary)",
            inverse: "var(--color-text-inverse)",
        },
        surface: {
            primary: "var(--color-surface-primary)",
            secondary: "var(--color-surface-secondary)",
            card: "var(--color-surface-card)",
            overlay: "var(--color-surface-overlay)",
        },
        border: {
            default: "var(--color-border-default)",
            subtle: "var(--color-border-subtle)",
            strong: "var(--color-border-strong)",
        },
        brand: {
            primary: "var(--color-brand-primary)",
            hover: "var(--color-brand-primary-hover)",
            active: "var(--color-brand-primary-active)",
        },
    },

    space: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
    },

    radius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
    },

    shadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
    },

    fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
    },

    fontWeight: {
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
    },

    lineHeight: {
        tight: "var(--line-height-tight)",
        normal: "var(--line-height-normal)",
        relaxed: "var(--line-height-relaxed)",
    },

    duration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
    },

    z: {
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        modalBackdrop: "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        tooltip: "var(--z-tooltip)",
    },

    breakpoint: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
    },
} as const;

export type DesignTokens = typeof tokens;
