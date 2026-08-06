// 事件拒绝缓冲池 — 记录用户 24 小时内拒绝的日程/待办，过期自动删除
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";

/** 拒绝项类型：日程 / 待办 */
export type RejectionKind = "schedule" | "todo";

export const REJECTION_BUFFER_TTL_MS = 24 * 60 * 60 * 1000;
export const REJECTION_BUFFER_MAX_HOURS = 24;
export const REJECTION_BUFFER_MIN_HOURS = 1;

export interface RejectionBufferItem {
    id: string;
    userId: string;
    kind: RejectionKind;
    sourceQueueId?: string;
    /** 解析后的原始请求体；解析失败时为原始字符串 */
    rawRequest: unknown;
    rejectedAt: string;
    expiresAt: string;
}

export interface RejectionListOpts {
    /** 仅查某一类；省略则返回全部 */
    kind?: RejectionKind;
    /**
     * 回看小时数：从现在起过去 N 小时内被拒绝的记录。
     * 默认 24，最小 1，最大 24。
     */
    hours?: number;
    now?: Date;
}

/** 规范化 hours 参数：默认 24，夹在 [1, 24] */
export function clampRejectionHours(hours?: number | string | null): number {
    if (hours === undefined || hours === null || hours === "") {
        return REJECTION_BUFFER_MAX_HOURS;
    }
    const n = typeof hours === "number" ? hours : Number(hours);
    if (!Number.isFinite(n)) return REJECTION_BUFFER_MAX_HOURS;
    const rounded = Math.round(n);
    if (rounded < REJECTION_BUFFER_MIN_HOURS) return REJECTION_BUFFER_MIN_HOURS;
    if (rounded > REJECTION_BUFFER_MAX_HOURS) return REJECTION_BUFFER_MAX_HOURS;
    return rounded;
}

function parseRawRequest(raw: string | null | undefined): unknown {
    if (raw == null || raw === "") return null;
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
}

function mapRow(row: any): RejectionBufferItem {
    return {
        id: row.id,
        userId: row.userId,
        kind: row.kind as RejectionKind,
        sourceQueueId: row.sourceQueueId || undefined,
        rawRequest: parseRawRequest(row.rawRequest),
        rejectedAt: row.rejectedAt,
        expiresAt: row.expiresAt,
    };
}

export class RejectionBufferStore {
    constructor(private db: Database) {}

    /**
     * 写入一条拒绝记录，TTL 24 小时。
     * @returns 新记录 id
     */
    async add(
        userId: string,
        kind: RejectionKind,
        rawRequest: string | object,
        sourceQueueId?: string | null,
        now: Date = new Date(),
    ): Promise<string> {
        const id = uuidv4();
        const rejectedAt = toShanghaiISO(now);
        const expiresAt = toShanghaiISO(
            new Date(now.getTime() + REJECTION_BUFFER_TTL_MS),
        );
        const raw =
            typeof rawRequest === "string"
                ? rawRequest
                : JSON.stringify(rawRequest ?? {});

        await this.db.run(
            `INSERT INTO rejection_buffer
             (id, userId, kind, sourceQueueId, rawRequest, rejectedAt, expiresAt)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                userId,
                kind,
                sourceQueueId || null,
                raw,
                rejectedAt,
                expiresAt,
            ],
        );
        return id;
    }

    /** 删除所有已过期记录，返回删除行数 */
    async deleteExpired(now: Date = new Date()): Promise<number> {
        const nowIso = toShanghaiISO(now);
        const result = await this.db.run(
            `DELETE FROM rejection_buffer WHERE expiresAt < ?`,
            [nowIso],
        );
        return result.changes ?? 0;
    }

    /**
     * 查询用户在过去 hours 小时内拒绝的记录（先清理过期数据）。
     * 仅返回仍在 24h TTL 内且 rejectedAt >= now - hours 的记录。
     */
    async list(
        userId: string,
        opts: RejectionListOpts = {},
    ): Promise<{
        hours: number;
        since: string;
        items: RejectionBufferItem[];
    }> {
        const now = opts.now ?? new Date();
        await this.deleteExpired(now);

        const hours = clampRejectionHours(opts.hours);
        const sinceDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
        const since = toShanghaiISO(sinceDate);
        const nowIso = toShanghaiISO(now);

        let sql = `
            SELECT * FROM rejection_buffer
            WHERE userId = ?
              AND rejectedAt >= ?
              AND expiresAt >= ?
        `;
        const params: unknown[] = [userId, since, nowIso];

        if (opts.kind) {
            sql += ` AND kind = ?`;
            params.push(opts.kind);
        }

        sql += ` ORDER BY rejectedAt DESC`;

        const rows: any[] = await this.db.all(sql, params);
        return {
            hours,
            since,
            items: rows.map(mapRow),
        };
    }
}
