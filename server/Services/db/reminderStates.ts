import type { Database } from "sqlite";

export const REMINDER_KINDS = [
    "schedule_start",
    "todo_start",
    "todo_deadline",
] as const;
export const REMINDER_STATUSES = ["unread", "read", "dismissed"] as const;

export type ReminderKind = (typeof REMINDER_KINDS)[number];
export type ReminderReadStatus = (typeof REMINDER_STATUSES)[number];

export interface ReminderStateChange {
    id: string;
    kind: ReminderKind;
    sourceId: string;
    triggeredAt: number;
    status: ReminderReadStatus;
    updatedAt: number;
}

export interface ReminderStateRecord extends ReminderStateChange {
    version: number;
}

export interface ReminderStateSyncResult {
    states: ReminderStateRecord[];
    version: number;
}

interface ReminderStateRow {
    reminderId: string;
    kind: ReminderKind;
    sourceId: string;
    triggeredAt: number;
    status: ReminderReadStatus;
    clientUpdatedAt: number;
    version: number;
}

function statusRank(status: ReminderReadStatus): number {
    if (status === "read") return 2;
    if (status === "dismissed") return 1;
    return 0;
}

function shouldApply(
    existing: ReminderStateRow | undefined,
    incoming: ReminderStateChange,
): boolean {
    if (!existing) return true;

    // Read/dismissed is monotonic across devices. A stale offline client must
    // never turn a reminder unread again after another device consumed it.
    if (existing.status !== "unread" && incoming.status === "unread") {
        return false;
    }
    if (existing.status === "unread" && incoming.status !== "unread") {
        return true;
    }

    if (incoming.updatedAt !== existing.clientUpdatedAt) {
        return incoming.updatedAt > existing.clientUpdatedAt;
    }

    return statusRank(incoming.status) > statusRank(existing.status);
}

function mapRow(row: ReminderStateRow): ReminderStateRecord {
    return {
        id: row.reminderId,
        kind: row.kind,
        sourceId: row.sourceId,
        triggeredAt: Number(row.triggeredAt),
        status: row.status,
        updatedAt: Number(row.clientUpdatedAt),
        version: Number(row.version),
    };
}

export class ReminderStateStore {
    private mutationQueue: Promise<void> = Promise.resolve();

    constructor(private db: Database) {}

    async listSince(
        userId: string,
        sinceVersion = 0,
    ): Promise<ReminderStateSyncResult> {
        const versionRow = await this.db.get(
            `SELECT version FROM reminder_sync_versions WHERE userId = ?`,
            [userId],
        );
        const version = Number(versionRow?.version) || 0;
        const rows = (await this.db.all(
            `SELECT reminderId, kind, sourceId, triggeredAt, status,
                    clientUpdatedAt, version
             FROM reminder_states
             WHERE userId = ? AND version > ?
             ORDER BY version ASC, reminderId ASC`,
            [userId, Math.max(0, Math.floor(sinceVersion))],
        )) as ReminderStateRow[];
        return { states: rows.map(mapRow), version };
    }

    async sync(
        userId: string,
        sinceVersion: number,
        changes: ReminderStateChange[],
    ): Promise<ReminderStateSyncResult> {
        const operation = this.mutationQueue.then(() =>
            this.performSync(userId, sinceVersion, changes),
        );
        this.mutationQueue = operation.then(
            () => undefined,
            () => undefined,
        );
        return operation;
    }

    private async performSync(
        userId: string,
        sinceVersion: number,
        changes: ReminderStateChange[],
    ): Promise<ReminderStateSyncResult> {
        const deduplicated = new Map<string, ReminderStateChange>();
        for (const change of changes) deduplicated.set(change.id, change);
        const incoming = Array.from(deduplicated.values());

        await this.db.exec("BEGIN IMMEDIATE");
        try {
            const versionRow = await this.db.get(
                `SELECT version FROM reminder_sync_versions WHERE userId = ?`,
                [userId],
            );
            let version = Number(versionRow?.version) || 0;

            for (const change of incoming) {
                const existing = (await this.db.get(
                    `SELECT reminderId, kind, sourceId, triggeredAt, status,
                            clientUpdatedAt, version
                     FROM reminder_states
                     WHERE userId = ? AND reminderId = ?`,
                    [userId, change.id],
                )) as ReminderStateRow | undefined;
                if (!shouldApply(existing, change)) continue;

                version += 1;
                await this.db.run(
                    `INSERT INTO reminder_states (
                        userId, reminderId, kind, sourceId, triggeredAt,
                        status, clientUpdatedAt, version, updatedAt
                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                     ON CONFLICT(userId, reminderId) DO UPDATE SET
                        kind = excluded.kind,
                        sourceId = excluded.sourceId,
                        triggeredAt = excluded.triggeredAt,
                        status = excluded.status,
                        clientUpdatedAt = excluded.clientUpdatedAt,
                        version = excluded.version,
                        updatedAt = CURRENT_TIMESTAMP`,
                    [
                        userId,
                        change.id,
                        change.kind,
                        change.sourceId,
                        change.triggeredAt,
                        change.status,
                        change.updatedAt,
                        version,
                    ],
                );
            }

            await this.db.run(
                `INSERT INTO reminder_sync_versions (userId, version)
                 VALUES (?, ?)
                 ON CONFLICT(userId) DO UPDATE SET version = excluded.version`,
                [userId, version],
            );

            const ids = incoming.map(change => change.id);
            const idClause = ids.length
                ? ` OR reminderId IN (${ids.map(() => "?").join(",")})`
                : "";
            const rows = (await this.db.all(
                `SELECT reminderId, kind, sourceId, triggeredAt, status,
                        clientUpdatedAt, version
                 FROM reminder_states
                 WHERE userId = ? AND (version > ?${idClause})
                 ORDER BY version ASC, reminderId ASC`,
                [
                    userId,
                    Math.max(0, Math.floor(sinceVersion)),
                    ...ids,
                ],
            )) as ReminderStateRow[];

            await this.db.exec("COMMIT");
            return { states: rows.map(mapRow), version };
        } catch (error) {
            await this.db.exec("ROLLBACK");
            throw error;
        }
    }
}
