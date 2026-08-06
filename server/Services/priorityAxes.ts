/**
 * 四象限双轴分数：重要程度 / 紧急程度，取值 [-1, 1]
 * 与既有 importance 枚举（high|normal|low）及 quadrant（q1–q4）共存，向后兼容。
 */

import { normalizeImportance } from "./db/taskMapper.js";

export type PriorityAxisScore = number; // -1 .. 1
export type QuadrantCode = "q1" | "q2" | "q3" | "q4";

export interface PriorityAxes {
    /** 重要程度：-1 不重要 … 1 很重要 */
    importanceScore: number | null;
    /** 紧急程度：-1 不紧急 … 1 很紧急 */
    urgencyScore: number | null;
}

/** 将任意输入规范到 [-1, 1]；非法则 null */
export function clampAxisScore(value: unknown): number | null {
    if (value === undefined || value === null || value === "") return null;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return null;
    if (n > 1) return 1;
    if (n < -1) return -1;
    // 保留合理精度，避免浮点噪声
    return Math.round(n * 10000) / 10000;
}

/** 由 high/normal/low 推导默认双轴（LLM 未给出分数时使用） */
export function defaultAxesFromImportance(
    importance?: string | null,
): { importanceScore: number; urgencyScore: number } {
    const imp = normalizeImportance(importance || undefined);
    switch (imp) {
        case "high":
            return { importanceScore: 0.75, urgencyScore: 0.5 };
        case "low":
            return { importanceScore: -0.5, urgencyScore: -0.25 };
        default:
            return { importanceScore: 0, urgencyScore: 0 };
    }
}

/**
 * 解析请求/LLM 中的双轴分数。
 * fillDefaults=true 时，缺失轴用 importance 枚举推导。
 */
export function resolvePriorityAxes(input: {
    importanceScore?: unknown;
    urgencyScore?: unknown;
    importance?: string | null;
    fillDefaults?: boolean;
}): PriorityAxes {
    let importanceScore = clampAxisScore(input.importanceScore);
    let urgencyScore = clampAxisScore(input.urgencyScore);

    if (input.fillDefaults) {
        const d = defaultAxesFromImportance(input.importance);
        if (importanceScore === null) importanceScore = d.importanceScore;
        if (urgencyScore === null) urgencyScore = d.urgencyScore;
    }

    return { importanceScore, urgencyScore };
}

/** 由双轴推导艾森豪威尔象限（任一轴缺失则 undefined） */
export function quadrantFromAxes(
    importanceScore: number | null | undefined,
    urgencyScore: number | null | undefined,
): QuadrantCode | undefined {
    if (
        importanceScore === null ||
        importanceScore === undefined ||
        urgencyScore === null ||
        urgencyScore === undefined
    ) {
        return undefined;
    }
    const important = importanceScore > 0;
    const urgent = urgencyScore > 0;
    if (important && urgent) return "q1";
    if (important && !urgent) return "q2";
    if (!important && urgent) return "q3";
    return "q4";
}

/** 校验 body 是否至少提供了一个轴，并返回规范化结果 */
export function parsePriorityAxesBody(body: unknown): {
    ok: true;
    axes: { importanceScore?: number; urgencyScore?: number };
} | {
    ok: false;
    error: string;
} {
    if (!body || typeof body !== "object") {
        return { ok: false, error: "Body must be an object" };
    }
    const b = body as Record<string, unknown>;
    const hasImp = b.importanceScore !== undefined;
    const hasUrg = b.urgencyScore !== undefined;
    if (!hasImp && !hasUrg) {
        return {
            ok: false,
            error: "importanceScore and/or urgencyScore required (range -1..1)",
        };
    }

    const axes: { importanceScore?: number; urgencyScore?: number } = {};

    if (hasImp) {
        if (b.importanceScore === null) {
            axes.importanceScore = undefined;
            // allow explicit null? treat as clear → store null via special
        }
        const v = clampAxisScore(b.importanceScore);
        if (b.importanceScore !== null && v === null) {
            return {
                ok: false,
                error: "importanceScore must be a number in [-1, 1]",
            };
        }
        if (v !== null) axes.importanceScore = v;
        else if (b.importanceScore === null) {
            // clear
            (axes as any).importanceScore = null;
        }
    }
    if (hasUrg) {
        const v = clampAxisScore(b.urgencyScore);
        if (b.urgencyScore !== null && v === null) {
            return {
                ok: false,
                error: "urgencyScore must be a number in [-1, 1]",
            };
        }
        if (v !== null) axes.urgencyScore = v;
        else if (b.urgencyScore === null) {
            (axes as any).urgencyScore = null;
        }
    }

    return { ok: true, axes };
}
