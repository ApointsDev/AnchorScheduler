// 待办审批队列（与 schedule_queue 对齐，低耦合独立表）
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";

export class TodoQueueStore {
    constructor(private db: Database) {}

    async getByUser(userId: string) {
        return this.db.all(
            `SELECT * FROM todo_queue WHERE userId = ? ORDER BY createdAt DESC`,
            [userId],
        );
    }

    async getById(id: string) {
        return this.db.get(`SELECT * FROM todo_queue WHERE id = ?`, [id]);
    }

    async updateStatus(id: string, status: string) {
        await this.db.run(
            `UPDATE todo_queue SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            [status, id],
        );
    }

    async delete(id: string) {
        await this.db.run(`DELETE FROM todo_queue WHERE id = ?`, [id]);
    }

    async add(userId: string, rawRequest: string): Promise<string> {
        const id = uuidv4();
        await this.db.run(
            `INSERT INTO todo_queue (id, userId, rawRequest, status, createdAt, updatedAt) VALUES (?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [id, userId, rawRequest],
        );
        return id;
    }
}
