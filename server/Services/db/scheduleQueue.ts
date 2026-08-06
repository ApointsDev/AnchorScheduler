// 日程审批队列
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";

export class ScheduleQueueStore {
    constructor(private db: Database) {}

    async getByUser(userId: string) {
        return this.db.all(`SELECT * FROM schedule_queue WHERE userId = ? ORDER BY createdAt DESC`, [userId]);
    }

    async getById(id: string) {
        return this.db.get(`SELECT * FROM schedule_queue WHERE id = ?`, [id]);
    }

    async updateStatus(id: string, status: string) {
        await this.db.run(`UPDATE schedule_queue SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, [status, id]);
    }

    async delete(id: string) {
        await this.db.run(`DELETE FROM schedule_queue WHERE id = ?`, [id]);
    }

    async add(userId: string, rawRequest: string): Promise<string> {
        const id = uuidv4();
        await this.db.run(
            `INSERT INTO schedule_queue (id, userId, rawRequest, status, createdAt, updatedAt) VALUES (?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [id, userId, rawRequest],
        );
        return id;
    }
}
