/**
 * 社区排名：指标定义、排序方向、展示文案
 * 四个指标与 UserStatus 一一对应。
 */

import type { CommunityRankMetric } from "../types/models";

export interface MetricDef {
    metric: CommunityRankMetric;
    /** URL 路径段 */
    path: string;
    /** 中文说明 */
    metricLabel: string;
    /** 称号用短标签，如「时间利用率」 */
    titleLabel: string;
    higherIsBetter: boolean;
    /** user_status 列名 */
    column: string;
    /** 是否允许 NULL 参与排名（否：无样本用户不入榜） */
    requireNonNull: boolean;
}

export const COMMUNITY_METRICS: MetricDef[] = [
    {
        metric: "completedThisWeek",
        path: "completed-this-week",
        metricLabel: "本周完成日程数",
        titleLabel: "时间利用率",
        higherIsBetter: true,
        column: "completedThisWeek",
        requireNonNull: false,
    },
    {
        metric: "incompleteThisWeek",
        path: "incomplete-this-week",
        metricLabel: "本周未完成日程数",
        titleLabel: "日程清爽度",
        // 未完成越少越好
        higherIsBetter: false,
        column: "incompleteThisWeek",
        requireNonNull: false,
    },
    {
        metric: "avgCompleteDurationMs",
        path: "avg-complete-duration",
        metricLabel: "平均完成时长",
        titleLabel: "执行效率",
        // 从创建到完成越快越好
        higherIsBetter: false,
        column: "avgCompleteDurationMs",
        requireNonNull: true,
    },
    {
        metric: "completionHourMode",
        path: "completion-hour-mode",
        metricLabel: "习惯完成时段（小时）",
        titleLabel: "早鸟指数",
        // 更早完成 → 小时更小 → 更好
        higherIsBetter: false,
        column: "completionHourMode",
        requireNonNull: true,
    },
];

export const METRIC_BY_PATH = new Map(
    COMMUNITY_METRICS.map((m) => [m.path, m]),
);

export const METRIC_BY_KEY = new Map(
    COMMUNITY_METRICS.map((m) => [m.metric, m]),
);

/** 排名缓存 TTL */
export const COMMUNITY_RANK_CACHE_TTL_MS = 5 * 60 * 1000;

/** 默认预置地区 */
export const DEFAULT_COMMUNITY_REGIONS: { id: string; name: string }[] = [
    { id: "region-xjtlu", name: "西交利物浦大学" },
];

/**
 * 生成称号文案：西交利物浦大学时间利用率第一
 */
export function buildRankTitle(
    regionName: string,
    titleLabel: string,
    rank: number | null,
): string | null {
    if (rank === null || rank < 1) return null;
    if (rank === 1) return `${regionName}${titleLabel}第一`;
    return `${regionName}${titleLabel}第${rank}`;
}

/**
 * 对已按优劣排好序的列表赋密集名次（同分同名次，下一名不跳号：1,2,2,3）
 */
export function assignDenseRanks<T extends { value: number }>(
    sorted: T[],
): (T & { rank: number })[] {
    const out: (T & { rank: number })[] = [];
    for (let i = 0; i < sorted.length; i++) {
        let rank: number;
        if (i === 0) {
            rank = 1;
        } else if (sorted[i].value === sorted[i - 1].value) {
            rank = out[i - 1].rank;
        } else {
            rank = out[i - 1].rank + 1;
        }
        out.push({ ...sorted[i], rank });
    }
    return out;
}

/** 展示名：保留姓名，过长截断 */
export function toDisplayName(name?: string | null, email?: string | null): string {
    const n = (name || "").trim();
    if (n) return n.length > 16 ? `${n.slice(0, 16)}…` : n;
    const e = (email || "").trim();
    if (e) {
        const local = e.split("@")[0] || e;
        return local.length > 12 ? `${local.slice(0, 12)}…` : local;
    }
    return "匿名用户";
}
