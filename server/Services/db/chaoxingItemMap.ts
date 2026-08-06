// 学习通 remoteKey → 本地 task/todo 映射
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";

export type ChaoxingMapTarget = "task" | "todo";

export interface ChaoxingItemMapRow {
    id: string;
    userId: string;
    remoteKey: string;
    kind: string;
    target: ChaoxingMapTarget;
    localTodoId: string | null;
    localTaskId: string | null;
    fingerprint: string | null;
    lastSeenAt: string;
    createdAt: string;
    updatedAt: string;
}

export class ChaoxingItemMapStore {
    constructor(private db: Database) {}

    async getByRemoteKey(
        userId: string,
        remoteKey: string,
    ): Promise<ChaoxingItemMapRow | null> {
        const row: any = await this.db.get(
            `SELECT * FROM chaoxing_item_map WHERE userId = ? AND remoteKey = ?`,
            [userId, remoteKey],
        );
        return row ? this.map(row) : null;
    }

    async upsert(row: {
        userId: string;
        remoteKey: string;
        kind: string;
        target: ChaoxingMapTarget;
        localTodoId?: string | null;
        localTaskId?: string | null;
        fingerprint?: string | null;
    }): Promise<ChaoxingItemMapRow> {
        const existing = await this.getByRemoteKey(row.userId, row.remoteKey);
        const now = toShanghaiISO();
        if (existing) {
            await this.db.run(
                `UPDATE chaoxing_item_map
                 SET kind = ?, target = ?, localTodoId = ?, localTaskId = ?,
                     fingerprint = ?, lastSeenAt = ?, updatedAt = ?
                 WHERE id = ?`,
                [
                    row.kind,
                    row.target,
                    row.localTodoId ?? null,
                    row.localTaskId ?? null,
                    row.fingerprint ?? null,
                    now,
                    now,
                    existing.id,
                ],
            );
            return (await this.getByRemoteKey(row.userId, row.remoteKey))!;
        }
        const id = uuidv4();
        await this.db.run(
            `INSERT INTO chaoxing_item_map
             (id, userId, remoteKey, kind, target, localTodoId, localTaskId, fingerprint, lastSeenAt, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                row.userId,
                row.remoteKey,
                row.kind,
                row.target,
                row.localTodoId ?? null,
                row.localTaskId ?? null,
                row.fingerprint ?? null,
                now,
                now,
                now,
            ],
        );
        return (await this.getByRemoteKey(row.userId, row.remoteKey))!;
    }

    private map(row: any): ChaoxingItemMapRow {
        return {
            id: row.id,
            userId: row.userId,
            remoteKey: row.remoteKey,
            kind: row.kind,
            target: row.target === "task" ? "task" : "todo",
            localTodoId: row.localTodoId || null,
            localTaskId: row.localTaskId || null,
            fingerprint: row.fingerprint || null,
            lastSeenAt: row.lastSeenAt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
