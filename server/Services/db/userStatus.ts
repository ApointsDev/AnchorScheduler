/**
 * 用户状态：本周日程完成/未完成统计 + 完成时长/完成时刻众数
 * 每用户一行缓存，读时按 TTL / 周界刷新，写路径可失效。
 */

import type { Database } from "sqlite";
import type { UserStatus } from "../../types/models";
import { toShanghaiISO } from "../../Utils/time.js";
import {
    USER_STATUS_CACHE_TTL_MS,
    averageCompleteDurationMs,
    completionHourMode,
    formatDurationHuman,
    getShanghaiWeekRange,
} from "../userStatusStats.js";

function mapRowToStatus(row: any, fromCache: boolean): UserStatus {
    let modalHours: number[] = [];
    if (row.modalHours) {
        try {
            const parsed = JSON.parse(row.modalHours);
            if (Array.isArray(parsed)) {
                modalHours = parsed.map(Number).filter((n) => Number.isFinite(n));
            }
        } catch {
            modalHours = [];
        }
    }
    const avg =
        row.avgCompleteDurationMs === null ||
        row.avgCompleteDurationMs === undefined
            ? null
            : Number(row.avgCompleteDurationMs);
    const mode =
        row.completionHourMode === null ||
        row.completionHourMode === undefined
            ? null
            : Number(row.completionHourMode);

    return {
        weekStart: row.weekStart,
        weekEnd: row.weekEnd,
        completedThisWeek: Number(row.completedThisWeek) || 0,
        incompleteThisWeek: Number(row.incompleteThisWeek) || 0,
        avgCompleteDurationMs: Number.isFinite(avg as number) ? avg : null,
        avgCompleteDurationHuman: formatDurationHuman(
            Number.isFinite(avg as number) ? (avg as number) : null,
        ),
        completionHourMode: Number.isFinite(mode as number) ? mode : null,
        modalHours,
        completedSampleSize: Number(row.completedSampleSize) || 0,
        computedAt: row.computedAt
            ? String(row.computedAt)
            : toShanghaiISO(),
        fromCache,
    };
}

export class UserStatusStore {
    constructor(private db: Database) {}

    async invalidate(userId: string): Promise<void> {
        await this.db.run("DELETE FROM user_status WHERE userId = ?", [
            userId,
        ]);
    }

    async getStatus(
        userId: string,
        opts?: { fresh?: boolean; now?: Date },
    ): Promise<UserStatus> {
        const now = opts?.now ?? new Date();
        const { weekStart, weekEnd } = getShanghaiWeekRange(now);

        if (!opts?.fresh) {
            const cached = await this.db.get(
                "SELECT * FROM user_status WHERE userId = ?",
                [userId],
            );
            if (cached && cached.weekStart === weekStart) {
                const computedMs = new Date(cached.computedAt).getTime();
                if (
                    Number.isFinite(computedMs) &&
                    now.getTime() - computedMs < USER_STATUS_CACHE_TTL_MS
                ) {
                    return mapRowToStatus(cached, true);
                }
            }
        }

        return this.recomputeAndSave(userId, weekStart, weekEnd, now);
    }

    async recomputeAndSave(
        userId: string,
        weekStart?: string,
        weekEnd?: string,
        now: Date = new Date(),
    ): Promise<UserStatus> {
        const range =
            weekStart && weekEnd
                ? { weekStart, weekEnd }
                : getShanghaiWeekRange(now);
        const ws = range.weekStart;
        const we = range.weekEnd;

        const completedRows: any[] = await this.db.all(
            `SELECT id, createdAt, completedAt FROM tasks
             WHERE userId = ? AND completed = 1
               AND completedAt IS NOT NULL
               AND completedAt >= ? AND completedAt < ?`,
            [userId, ws, we],
        );

        const incompleteRow: any = await this.db.get(
            `SELECT COUNT(*) as cnt FROM tasks
             WHERE userId = ? AND completed = 0
               AND startTime IS NOT NULL AND endTime IS NOT NULL
               AND startTime != '' AND endTime != ''
               AND startTime < ? AND endTime >= ?`,
            [userId, we, ws],
        );

        const completedThisWeek = completedRows.length;
        const incompleteThisWeek = Number(incompleteRow?.cnt) || 0;
        const avgCompleteDurationMs = averageCompleteDurationMs(
            completedRows,
        );
        const completedAts = completedRows
            .map((r) => r.completedAt as string)
            .filter(Boolean);
        const { mode, modalHours } = completionHourMode(completedAts);
        const computedAt = toShanghaiISO(now);

        await this.db.run(
            `INSERT INTO user_status (
                userId, weekStart, weekEnd,
                completedThisWeek, incompleteThisWeek,
                avgCompleteDurationMs, completionHourMode, modalHours,
                completedSampleSize, computedAt
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(userId) DO UPDATE SET
                weekStart = excluded.weekStart,
                weekEnd = excluded.weekEnd,
                completedThisWeek = excluded.completedThisWeek,
                incompleteThisWeek = excluded.incompleteThisWeek,
                avgCompleteDurationMs = excluded.avgCompleteDurationMs,
                completionHourMode = excluded.completionHourMode,
                modalHours = excluded.modalHours,
                completedSampleSize = excluded.completedSampleSize,
                computedAt = excluded.computedAt`,
            [
                userId,
                ws,
                we,
                completedThisWeek,
                incompleteThisWeek,
                avgCompleteDurationMs,
                mode,
                JSON.stringify(modalHours),
                completedThisWeek,
                computedAt,
            ],
        );

        return {
            weekStart: ws,
            weekEnd: we,
            completedThisWeek,
            incompleteThisWeek,
            avgCompleteDurationMs,
            avgCompleteDurationHuman: formatDurationHuman(
                avgCompleteDurationMs,
            ),
            completionHourMode: mode,
            modalHours,
            completedSampleSize: completedThisWeek,
            computedAt,
            fromCache: false,
        };
    }
}
