/**
 * 社区地区 + 基于 user_status 的指标排名
 */

import { randomUUID } from "crypto";
import type { Database } from "sqlite";
import type {
    CommunityRankEntry,
    CommunityRankMetric,
    CommunityRankingResult,
    CommunityRegion,
    CommunityTitleSummary,
} from "../../types/models";
import { toShanghaiISO } from "../../Utils/time.js";
import {
    COMMUNITY_METRICS,
    COMMUNITY_RANK_CACHE_TTL_MS,
    DEFAULT_COMMUNITY_REGIONS,
    METRIC_BY_KEY,
    assignDenseRanks,
    buildRankTitle,
    toDisplayName,
    type MetricDef,
} from "../communityRanking.js";
import { getShanghaiWeekRange } from "../userStatusStats.js";
import type { UserStatusStore } from "./userStatus";

export class CommunityRegionNotFoundError extends Error {
    constructor(message = "Community region not found") {
        super(message);
        this.name = "CommunityRegionNotFoundError";
    }
}

export class CommunityRegionRequiredError extends Error {
    constructor(message = "User has not joined a community region") {
        super(message);
        this.name = "CommunityRegionRequiredError";
    }
}

function mapRegion(row: any): CommunityRegion {
    return {
        id: row.id,
        name: row.name,
        createdAt: row.createdAt || undefined,
    };
}

export class CommunityStore {
    /**
     * SQLite 单连接不支持嵌套事务。前端常并行拉 4 个榜，
     * 若不串行化 rebuild，第二个 BEGIN 会报：
     * SQLITE_ERROR: cannot start a transaction within a transaction
     */
    private writeChain: Promise<unknown> = Promise.resolve();

    constructor(
        private db: Database,
        private userStatus: UserStatusStore,
    ) {}

    /** 串行化写库，避免并发 BEGIN */
    private enqueueWrite<T>(fn: () => Promise<T>): Promise<T> {
        const run = this.writeChain.then(fn, fn);
        this.writeChain = run.then(
            () => undefined,
            () => undefined,
        );
        return run;
    }

    /** 预置默认地区（幂等） */
    async ensureDefaultRegions(): Promise<void> {
        for (const r of DEFAULT_COMMUNITY_REGIONS) {
            await this.db.run(
                `INSERT OR IGNORE INTO community_regions (id, name) VALUES (?, ?)`,
                [r.id, r.name],
            );
        }
    }

    async listRegions(): Promise<CommunityRegion[]> {
        const rows = await this.db.all(
            `SELECT * FROM community_regions ORDER BY name ASC`,
        );
        return rows.map(mapRegion);
    }

    async getRegionById(id: string): Promise<CommunityRegion | null> {
        const row = await this.db.get(
            `SELECT * FROM community_regions WHERE id = ?`,
            [id],
        );
        return row ? mapRegion(row) : null;
    }

    async getRegionByName(name: string): Promise<CommunityRegion | null> {
        const row = await this.db.get(
            `SELECT * FROM community_regions WHERE name = ?`,
            [name.trim()],
        );
        return row ? mapRegion(row) : null;
    }

    async createRegion(name: string, id?: string): Promise<CommunityRegion> {
        const trimmed = name.trim();
        if (!trimmed) throw new Error("Region name is required");
        const existing = await this.getRegionByName(trimmed);
        if (existing) return existing;
        const regionId = id || randomUUID();
        await this.db.run(
            `INSERT INTO community_regions (id, name) VALUES (?, ?)`,
            [regionId, trimmed],
        );
        return (await this.getRegionById(regionId)) as CommunityRegion;
    }

    async getUserRegionId(userId: string): Promise<string | null> {
        const row: any = await this.db.get(
            `SELECT communityRegionId FROM users WHERE id = ?`,
            [userId],
        );
        return row?.communityRegionId || null;
    }

    async setUserRegion(
        userId: string,
        regionId: string,
    ): Promise<CommunityRegion> {
        const region = await this.getRegionById(regionId);
        if (!region) throw new CommunityRegionNotFoundError();
        await this.db.run(
            `UPDATE users SET communityRegionId = ? WHERE id = ?`,
            [regionId, userId],
        );
        // 换区后旧排名缓存会自然按 region 隔离；无需全表清
        return region;
    }

    async clearUserRegion(userId: string): Promise<void> {
        await this.db.run(
            `UPDATE users SET communityRegionId = NULL WHERE id = ?`,
            [userId],
        );
    }

    /**
     * 获取某指标排名；必要时重算本地区本周榜并落库
     */
    async getRanking(
        userId: string,
        metric: CommunityRankMetric,
        opts?: {
            fresh?: boolean;
            limit?: number;
            now?: Date;
            regionId?: string;
        },
    ): Promise<CommunityRankingResult> {
        const def = METRIC_BY_KEY.get(metric);
        if (!def) throw new Error(`Unknown metric: ${metric}`);

        const now = opts?.now ?? new Date();
        const { weekStart, weekEnd } = getShanghaiWeekRange(now);
        const limit = Math.max(1, Math.min(100, opts?.limit ?? 20));

        let regionId = opts?.regionId || (await this.getUserRegionId(userId));
        if (!regionId) {
            throw new CommunityRegionRequiredError();
        }
        const region = await this.getRegionById(regionId);
        if (!region) throw new CommunityRegionNotFoundError();

        // 保证当前用户有本周 status 行（用缓存 TTL，避免 ?fresh 把 status 用空 tasks 刷成 0）
        await this.userStatus.getStatus(userId, { now });

        const needRebuild =
            opts?.fresh ||
            (await this.isRankStale(weekStart, regionId, metric, now));

        if (needRebuild) {
            await this.rebuildRanking(weekStart, weekEnd, regionId, def, now);
        }

        return this.readRankingResult(
            userId,
            region,
            def,
            weekStart,
            weekEnd,
            limit,
        );
    }

    /**
     * 一次取本社区四个指标榜单（时间利用率 / 日程清爽度 / 执行效率 / 早鸟指数）。
     * 默认 top100；串行拉取以免并行 rebuild 重复刷 status。
     */
    async getAllRankings(
        userId: string,
        opts?: {
            fresh?: boolean;
            limit?: number;
            now?: Date;
            regionId?: string;
        },
    ): Promise<Record<CommunityRankMetric, CommunityRankingResult>> {
        const limit = Math.max(1, Math.min(100, opts?.limit ?? 100));
        const rankings = {} as Record<
            CommunityRankMetric,
            CommunityRankingResult
        >;
        for (const m of COMMUNITY_METRICS) {
            rankings[m.metric] = await this.getRanking(userId, m.metric, {
                ...opts,
                limit,
            });
        }
        return rankings;
    }

    /**
     * 个人主页：用户在其社区的四指标排名/称号摘要（不返回完整 leaderboard）
     */
    async getUserTitleSummaries(
        userId: string,
        opts?: { fresh?: boolean; now?: Date },
    ): Promise<{
        region: CommunityRegion | null;
        titles: CommunityTitleSummary[];
    }> {
        const regionId = await this.getUserRegionId(userId);
        if (!regionId) {
            return { region: null, titles: [] };
        }
        const region = await this.getRegionById(regionId);
        if (!region) {
            return { region: null, titles: [] };
        }

        const now = opts?.now ?? new Date();
        const { weekStart, weekEnd } = getShanghaiWeekRange(now);

        // 保证目标用户本周 status 存在
        await this.userStatus.getStatus(userId, { now });

        const titles: CommunityTitleSummary[] = [];
        for (const def of COMMUNITY_METRICS) {
            const needRebuild =
                opts?.fresh ||
                (await this.isRankStale(weekStart, regionId, def.metric, now));
            if (needRebuild) {
                await this.rebuildRanking(
                    weekStart,
                    weekEnd,
                    regionId,
                    def,
                    now,
                );
            }

            const row: any = await this.db.get(
                `SELECT rank, value FROM community_rank_entries
                 WHERE weekStart = ? AND regionId = ? AND metric = ? AND userId = ?`,
                [weekStart, regionId, def.metric, userId],
            );
            const meta: any = await this.db.get(
                `SELECT participantCount FROM community_rank_meta
                 WHERE weekStart = ? AND regionId = ? AND metric = ?`,
                [weekStart, regionId, def.metric],
            );

            const rank = row ? Number(row.rank) : null;
            const value = row ? Number(row.value) : null;
            titles.push({
                metric: def.metric,
                metricLabel: def.metricLabel,
                titleLabel: def.titleLabel,
                higherIsBetter: def.higherIsBetter,
                rank: Number.isFinite(rank as number) ? rank : null,
                value: Number.isFinite(value as number) ? value : null,
                title: buildRankTitle(region.name, def.titleLabel, rank),
                eligible: !!row,
                totalParticipants: Number(meta?.participantCount) || 0,
            });
        }

        return { region, titles };
    }

    private async isRankStale(
        weekStart: string,
        regionId: string,
        metric: CommunityRankMetric,
        now: Date,
    ): Promise<boolean> {
        const row: any = await this.db.get(
            `SELECT computedAt FROM community_rank_meta
             WHERE weekStart = ? AND regionId = ? AND metric = ?`,
            [weekStart, regionId, metric],
        );
        if (!row?.computedAt) return true;
        const t = new Date(row.computedAt).getTime();
        if (!Number.isFinite(t)) return true;
        return now.getTime() - t >= COMMUNITY_RANK_CACHE_TTL_MS;
    }

    /**
     * 从 user_status × 同地区用户 重算名次并写入 community_rank_entries
     */
    async rebuildRanking(
        weekStart: string,
        weekEnd: string,
        regionId: string,
        def: MetricDef,
        now: Date = new Date(),
    ): Promise<void> {
        // 同区用户：仅在 status 缓存过期/跨周时刷新（走 UserStatusStore TTL，不强制 fresh）
        const members: any[] = await this.db.all(
            `SELECT id FROM users WHERE communityRegionId = ?`,
            [regionId],
        );
        for (const m of members) {
            try {
                await this.userStatus.getStatus(m.id, { now });
            } catch {
                // 单个用户 status 失败不阻断
            }
        }

        const col = def.column;
        // 安全：column 来自白名单
        if (!COMMUNITY_METRICS.some((x) => x.column === col)) {
            throw new Error("Invalid metric column");
        }

        let sql = `
            SELECT u.id as userId, u.name as userName, u.email as email,
                   s.${col} as value
            FROM users u
            INNER JOIN user_status s ON s.userId = u.id
            WHERE u.communityRegionId = ?
              AND s.weekStart = ?
        `;
        if (def.requireNonNull) {
            sql += ` AND s.${col} IS NOT NULL`;
        }

        const rows: any[] = await this.db.all(sql, [regionId, weekStart]);

        const scored = rows
            .map((r) => ({
                userId: r.userId as string,
                displayName: toDisplayName(r.userName, r.email),
                value: Number(r.value),
            }))
            .filter((r) => Number.isFinite(r.value));

        scored.sort((a, b) => {
            if (a.value === b.value) {
                return a.userId.localeCompare(b.userId);
            }
            if (def.higherIsBetter) return b.value - a.value;
            return a.value - b.value;
        });

        const ranked = assignDenseRanks(scored);
        const computedAt = toShanghaiISO(now);

        // 写路径串行 + 单层事务，避免并行 4 榜同时 BEGIN
        await this.enqueueWrite(async () => {
            await this.db.run("BEGIN IMMEDIATE");
            try {
                await this.db.run(
                    `DELETE FROM community_rank_entries
                     WHERE weekStart = ? AND regionId = ? AND metric = ?`,
                    [weekStart, regionId, def.metric],
                );
                for (const e of ranked) {
                    await this.db.run(
                        `INSERT INTO community_rank_entries
                         (weekStart, regionId, metric, userId, value, rank, displayName, computedAt)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            weekStart,
                            regionId,
                            def.metric,
                            e.userId,
                            e.value,
                            e.rank,
                            e.displayName,
                            computedAt,
                        ],
                    );
                }
                await this.db.run(
                    `INSERT INTO community_rank_meta (weekStart, regionId, metric, computedAt, participantCount)
                     VALUES (?, ?, ?, ?, ?)
                     ON CONFLICT(weekStart, regionId, metric) DO UPDATE SET
                       computedAt = excluded.computedAt,
                       participantCount = excluded.participantCount`,
                    [
                        weekStart,
                        regionId,
                        def.metric,
                        computedAt,
                        ranked.length,
                    ],
                );
                await this.db.run("COMMIT");
            } catch (e) {
                try {
                    await this.db.run("ROLLBACK");
                } catch {
                    // 若未成功 BEGIN，ROLLBACK 可能失败，忽略
                }
                throw e;
            }
        });
    }

    private async readRankingResult(
        userId: string,
        region: CommunityRegion,
        def: MetricDef,
        weekStart: string,
        weekEnd: string,
        limit: number,
    ): Promise<CommunityRankingResult> {
        const top: any[] = await this.db.all(
            `SELECT userId, displayName, value, rank FROM community_rank_entries
             WHERE weekStart = ? AND regionId = ? AND metric = ?
             ORDER BY rank ASC, userId ASC
             LIMIT ?`,
            [weekStart, region.id, def.metric, limit],
        );

        const meta: any = await this.db.get(
            `SELECT computedAt, participantCount FROM community_rank_meta
             WHERE weekStart = ? AND regionId = ? AND metric = ?`,
            [weekStart, region.id, def.metric],
        );

        const meRow: any = await this.db.get(
            `SELECT userId, displayName, value, rank FROM community_rank_entries
             WHERE weekStart = ? AND regionId = ? AND metric = ? AND userId = ?`,
            [weekStart, region.id, def.metric, userId],
        );

        const userRow: any = await this.db.get(
            `SELECT name, email FROM users WHERE id = ?`,
            [userId],
        );
        const myDisplay = toDisplayName(userRow?.name, userRow?.email);

        const leaderboard: CommunityRankEntry[] = top.map((r) => ({
            rank: Number(r.rank),
            userId: r.userId,
            displayName: r.displayName,
            value: Number(r.value),
            isMe: r.userId === userId,
        }));

        const myRank = meRow ? Number(meRow.rank) : null;
        const myValue = meRow ? Number(meRow.value) : null;

        return {
            metric: def.metric,
            metricLabel: def.metricLabel,
            titleLabel: def.titleLabel,
            higherIsBetter: def.higherIsBetter,
            region,
            weekStart,
            weekEnd,
            me: {
                rank: myRank,
                value: myValue,
                displayName: meRow?.displayName || myDisplay,
                title: buildRankTitle(region.name, def.titleLabel, myRank),
                eligible: !!meRow,
            },
            leaderboard,
            totalParticipants: Number(meta?.participantCount) || leaderboard.length,
            computedAt: meta?.computedAt
                ? String(meta.computedAt)
                : toShanghaiISO(),
            fromCache: true,
        };
    }
}
