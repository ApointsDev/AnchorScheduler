// AI 聊天上下文持久化
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";

export class ChatContextStore {
    constructor(private db: Database) {}

    private autoTitle(messagesJson: string): string {
        try {
            const msgs = JSON.parse(messagesJson);
            const userMsg = msgs.find(
                (m: { role: string; content: string }) => m.role === "user",
            );
            if (userMsg && typeof userMsg.content === "string") {
                return userMsg.content.substring(0, 30);
            }
        } catch {}
        return "新对话";
    }

    async listContexts(userId: string) {
        const rows: any[] = await this.db.all(
            `SELECT id, title, isActive, createdAt, updatedAt, messages FROM chat_history WHERE userId = ? ORDER BY updatedAt DESC`,
            [userId],
        );
        return rows.map((r) => {
            let messageCount = 0;
            try {
                messageCount = JSON.parse(r.messages).length;
            } catch {}
            return {
                id: r.id,
                title: r.title,
                isActive: !!r.isActive,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                messageCount,
            };
        });
    }

    async create(userId: string): Promise<string> {
        await this.db.run(
            `UPDATE chat_history SET isActive = 0 WHERE userId = ? AND isActive = 1`,
            [userId],
        );
        const id = uuidv4();
        await this.db.run(
            `INSERT INTO chat_history (id, userId, messages, title, isActive) VALUES (?, ?, '[]', '新对话', 1)`,
            [id, userId],
        );
        return id;
    }

    async getMessages(contextId: string): Promise<{ messages: string } | null> {
        const row: any = await this.db.get(
            `SELECT messages FROM chat_history WHERE id = ?`,
            [contextId],
        );
        return row ? { messages: row.messages } : null;
    }

    async delete(contextId: string): Promise<void> {
        await this.db.run(`DELETE FROM chat_history WHERE id = ?`, [contextId]);
    }

    async getActiveHistory(
        userId: string,
    ): Promise<{ id: string; messages: string } | null> {
        const row: any = await this.db.get(
            `SELECT id, messages FROM chat_history WHERE userId = ? AND isActive = 1 ORDER BY updatedAt DESC LIMIT 1`,
            [userId],
        );
        return row ? { id: row.id, messages: row.messages } : null;
    }

    async save(
        userId: string,
        messagesJson: string,
        contextId?: string,
    ): Promise<string> {
        let targetId = contextId;
        if (!targetId) {
            const active: any = await this.db.get(
                `SELECT id FROM chat_history WHERE userId = ? AND isActive = 1 LIMIT 1`,
                [userId],
            );
            targetId = active ? active.id : await this.create(userId);
        }
        const current: any = await this.db.get(
            `SELECT title FROM chat_history WHERE id = ?`,
            [targetId],
        );
        if (current && current.title === "新对话") {
            const title = this.autoTitle(messagesJson);
            await this.db.run(
                `UPDATE chat_history SET messages = ?, title = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                [messagesJson, title, targetId],
            );
        } else {
            await this.db.run(
                `UPDATE chat_history SET messages = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                [messagesJson, targetId],
            );
        }
        return targetId as string;
    }
}
