// 日程分享链接
import type { Database } from "sqlite";

export class SharedScheduleStore {
    constructor(private db: Database) {}

    async create(data: {
        id: string;
        userId: string;
        token: string;
        name: string;
        dateStart?: string;
        dateEnd?: string;
        taskIds?: string;
        expiresAt?: string;
    }): Promise<void> {
        await this.db.run(
            `INSERT INTO shared_schedules (id, userId, token, name, dateStart, dateEnd, taskIds, expiresAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.id,
                data.userId,
                data.token,
                data.name,
                data.dateStart || null,
                data.dateEnd || null,
                data.taskIds || null,
                data.expiresAt || null,
            ],
        );
    }

    async getByToken(token: string) {
        return (
            (await this.db.get(
                "SELECT * FROM shared_schedules WHERE token = ?",
                [token],
            )) || null
        );
    }

    async listByUser(userId: string) {
        return this.db.all(
            "SELECT * FROM shared_schedules WHERE userId = ? ORDER BY createdAt DESC",
            [userId],
        );
    }

    async delete(token: string, userId: string): Promise<boolean> {
        const result = await this.db.run(
            "DELETE FROM shared_schedules WHERE token = ? AND userId = ?",
            [token, userId],
        );
        return (result?.changes ?? 0) > 0;
    }
}
