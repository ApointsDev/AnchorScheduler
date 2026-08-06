/**
 * 用户状态统计纯函数：周界、完成时长平均、完成时刻小时众数
 * 时区固定 Asia/Shanghai (+08:00)，与 toShanghaiISO 一致。
 */

const SH_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

/** 将任意时间转为上海时区墙钟的 UTC 毫秒（用于取年月日时） */
function toShanghaiWallMs(input: string | Date): number {
    const d = typeof input === "string" ? new Date(input) : input;
    return d.getTime() + SH_OFFSET_MS;
}

function pad2(n: number): string {
    return n.toString().padStart(2, "0");
}

/** 上海墙钟 → ISO 字符串（带 +08:00） */
export function shanghaiWallToISO(
    y: number,
    m: number,
    d: number,
    h = 0,
    min = 0,
    s = 0,
): string {
    return `${y}-${pad2(m)}-${pad2(d)}T${pad2(h)}:${pad2(min)}:${pad2(s)}+08:00`;
}

/**
 * 本周范围：上海时区周一 00:00:00 起，到下周一 00:00:00（左闭右开）
 */
export function getShanghaiWeekRange(now: Date = new Date()): {
    weekStart: string;
    weekEnd: string;
} {
    const wall = new Date(toShanghaiWallMs(now));
    const y = wall.getUTCFullYear();
    const m = wall.getUTCMonth();
    const day = wall.getUTCDate();
    // getUTCDay: 0=Sun ... 6=Sat；周一为一周起点
    const dow = wall.getUTCDay();
    const daysFromMonday = dow === 0 ? 6 : dow - 1;

    // 周一 00:00 的墙钟对应的 UTC 时刻
    const mondayWallUtc = Date.UTC(y, m, day - daysFromMonday, 0, 0, 0);
    // 墙钟毫秒 = 真实 UTC + 8h，所以真实 UTC = 墙钟 UTC 表示 - 8h
    // 但我们直接构造 ISO 字符串更稳
    const mon = new Date(mondayWallUtc);
    const monY = mon.getUTCFullYear();
    const monM = mon.getUTCMonth() + 1;
    const monD = mon.getUTCDate();

    const next = new Date(mondayWallUtc + WEEK_MS);
    const endY = next.getUTCFullYear();
    const endM = next.getUTCMonth() + 1;
    const endD = next.getUTCDate();

    return {
        weekStart: shanghaiWallToISO(monY, monM, monD),
        weekEnd: shanghaiWallToISO(endY, endM, endD),
    };
}

/** 解析时间戳；非法返回 null */
export function parseTimeMs(value?: string | null): number | null {
    if (!value) return null;
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : null;
}

/** 上海时区小时 0..23 */
export function getShanghaiHour(iso: string): number | null {
    const ms = parseTimeMs(iso);
    if (ms === null) return null;
    const wall = new Date(ms + SH_OFFSET_MS);
    return wall.getUTCHours();
}

export function averageCompleteDurationMs(
    rows: { createdAt?: string | null; completedAt?: string | null }[],
): number | null {
    let sum = 0;
    let n = 0;
    for (const r of rows) {
        const c = parseTimeMs(r.createdAt);
        const d = parseTimeMs(r.completedAt);
        if (c === null || d === null) continue;
        const dur = d - c;
        if (dur < 0) continue;
        sum += dur;
        n += 1;
    }
    if (n === 0) return null;
    return Math.round(sum / n);
}

/**
 * 完成时刻小时众数：取最高频小时；多峰时返回算术平均（1 位小数）
 */
export function completionHourMode(completedAts: string[]): {
    mode: number | null;
    modalHours: number[];
} {
    const counts = new Array(24).fill(0) as number[];
    let total = 0;
    for (const iso of completedAts) {
        const h = getShanghaiHour(iso);
        if (h === null) continue;
        counts[h] += 1;
        total += 1;
    }
    if (total === 0) return { mode: null, modalHours: [] };

    let max = 0;
    for (const c of counts) if (c > max) max = c;

    const modalHours: number[] = [];
    for (let h = 0; h < 24; h++) {
        if (counts[h] === max) modalHours.push(h);
    }

    const avg =
        modalHours.reduce((a, b) => a + b, 0) / modalHours.length;
    const mode = Math.round(avg * 10) / 10;
    return { mode, modalHours };
}

export function formatDurationHuman(ms: number | null): string | null {
    if (ms === null || !Number.isFinite(ms) || ms < 0) return null;
    if (ms < 60_000) return `${Math.max(1, Math.round(ms / 1000))}s`;
    if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
    if (ms < DAY_MS) return `${Math.round(ms / 3_600_000)}h`;
    const days = ms / DAY_MS;
    if (days < 10) return `${Math.round(days * 10) / 10}d`;
    return `${Math.round(days)}d`;
}

export const USER_STATUS_CACHE_TTL_MS = 60_000;
