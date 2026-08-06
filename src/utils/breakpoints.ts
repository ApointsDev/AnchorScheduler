/**
 * Shared responsive breakpoint utilities.
 *
 * Breakpoints are defined as CSS custom properties in styles/variables.css.
 * This module reads them at runtime so JS logic stays in sync with CSS.
 *
 * Breakpoint scale:
 *   --breakpoint-xs : 480px  (small phones)
 *   --breakpoint-sm : 640px  (large phones / small tablets)
 *   --breakpoint-md : 768px  (tablets)
 *   --breakpoint-lg : 1024px (small desktops)
 */

const BREAKPOINT_CSS_VARS = {
    xs: "--breakpoint-xs",
    sm: "--breakpoint-sm",
    md: "--breakpoint-md",
    lg: "--breakpoint-lg",
} as const;

/** Read a single breakpoint value (in px) from CSS custom properties. */
export function getBreakpoint(name: keyof typeof BREAKPOINT_CSS_VARS): number {
    const varName = BREAKPOINT_CSS_VARS[name];
    const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    const parsed = parseInt(raw, 10);
    // Fallback values matching the CSS defaults in variables.css
    const fallbacks: Record<string, number> = {
        xs: 480,
        sm: 640,
        md: 768,
        lg: 1024,
    };
    return Number.isFinite(parsed) && parsed > 0
        ? parsed
        : (fallbacks[name] ?? 0);
}

/** Convenience: is the current viewport narrower than the given breakpoint? */
export function isBelow(name: keyof typeof BREAKPOINT_CSS_VARS): boolean {
    return window.innerWidth < getBreakpoint(name);
}
