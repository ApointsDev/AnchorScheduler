import type { Database } from "sqlite";

export type UserStatusWidgetId =
    | "following"
    | "summary"
    | "progress"
    | "activity"
    | "community"
    | "metrics"
    | "focus";

export type UserStatusWidgetSize = "compact" | "comfortable";

export interface UserStatusWidgetLayout {
    id: UserStatusWidgetId;
    visible: boolean;
    size: UserStatusWidgetSize;
}

export interface UserStatusLayoutRecord {
    version: 1;
    updatedAt: string;
    widgets: UserStatusWidgetLayout[];
}

interface UserStatusLayoutRow {
    layout: string;
}

function normalizeLayout(value: unknown): UserStatusLayoutRecord | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }

    const record = value as Partial<UserStatusLayoutRecord> & {
        widgets?: unknown;
    };
    if (record.version !== 1) return null;
    if (typeof record.updatedAt !== "string") return null;
    if (!Array.isArray(record.widgets)) return null;

    for (const widget of record.widgets) {
        if (!widget || typeof widget !== "object" || Array.isArray(widget)) {
            return null;
        }

        const item = widget as Partial<UserStatusWidgetLayout>;
        if (
            typeof item.id !== "string" ||
            typeof item.visible !== "boolean" ||
            (item.size !== "compact" && item.size !== "comfortable")
        ) {
            return null;
        }
    }

    return {
        version: 1,
        updatedAt: record.updatedAt,
        widgets: record.widgets as UserStatusWidgetLayout[],
    };
}

export class UserStatusLayoutStore {
    constructor(private db: Database) {}

    async get(userId: string): Promise<UserStatusLayoutRecord | null> {
        const row = (await this.db.get(
            `SELECT layout FROM user_status_layout WHERE userId = ?`,
            [userId],
        )) as UserStatusLayoutRow | undefined;

        if (!row?.layout) return null;

        try {
            const parsed = JSON.parse(row.layout);
            return normalizeLayout(parsed);
        } catch {
            return null;
        }
    }

    async save(
        userId: string,
        layout: UserStatusLayoutRecord,
    ): Promise<UserStatusLayoutRecord> {
        const normalized = normalizeLayout(layout);
        if (!normalized) {
            throw new Error("Invalid user status layout");
        }

        await this.db.run(
            `INSERT INTO user_status_layout (userId, layout, updatedAt)
             VALUES (?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(userId) DO UPDATE SET
                layout = excluded.layout,
                updatedAt = CURRENT_TIMESTAMP`,
            [userId, JSON.stringify(normalized)],
        );

        const row = (await this.db.get(
            `SELECT layout FROM user_status_layout WHERE userId = ?`,
            [userId],
        )) as UserStatusLayoutRow | undefined;

        if (!row?.layout) {
            throw new Error("Failed to persist user status layout");
        }

        const parsed = JSON.parse(row.layout);
        const saved = normalizeLayout(parsed);
        if (!saved) {
            throw new Error("Failed to normalize saved user status layout");
        }

        return saved;
    }
}