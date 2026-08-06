// AI 已处理邮件追踪
import type { Database } from "sqlite";

export class EmailAiStore {
    constructor(private db: Database) {}

    async markProcessed(userId: string, emailId: string, provider: string = "imap"): Promise<void> {
        await this.db.run(
            `INSERT OR IGNORE INTO ai_processed_emails (userId, emailId, provider) VALUES (?, ?, ?)`,
            [userId, emailId, provider],
        );
    }

    async isProcessed(userId: string, emailId: string, provider: string = "imap"): Promise<boolean> {
        const row: any = await this.db.get(
            `SELECT 1 FROM ai_processed_emails WHERE userId = ? AND emailId = ? AND provider = ?`,
            [userId, emailId, provider],
        );
        return !!row;
    }

    async getProcessedIds(userId: string): Promise<Set<string>> {
        const rows: any[] = await this.db.all(
            `SELECT emailId FROM ai_processed_emails WHERE userId = ?`, [userId],
        );
        return new Set(rows.map((r) => r.emailId));
    }

    async deleteProcessed(userId: string, emailId: string): Promise<void> {
        await this.db.run(
            `DELETE FROM ai_processed_emails WHERE userId = ? AND emailId = ?`,
            [userId, emailId],
        );
    }
}
