// 管理员专用操作
import type { Database } from "sqlite";

export const ADMIN_ALLOWED_COLUMNS = new Set([
    "email",
    "name",
    "XJTLUaccount",
    "XJTLUPassword",
    "passwordHash",
    "JWTtoken",
    "MStoken",
    "MSRefreshToken",
    "MSbinded",
    "ExchangeAccessToken",
    "ExchangeRefreshToken",
    "ExchangeTokenExpiresAt",
    "ExchangeBinded",
    "ImapBinded",
    "ImapEmail",
    "ImapPassword",
    "ImapHost",
    "ImapPort",
    "ImapTls",
    "CAFSub",
    "CAFAccessToken",
    "CAFRefreshToken",
    "CAFTokenExpiresAt",
    "ebridgeBinded",
    "timetableUrl",
    "timetableFetchLevel",
    "mailReadingSpan",
    "conflictBoundaryInclusive",
    "weekOffset",
    "CalDavBaseUrl",
    "CalDavUsername",
    "CalDavPassword",
    "CalDavPrincipalUrl",
    "CalDavCalendarHome",
    "CalDavCalendarUrl",
    "CalDavEnabled",
    "CalDavLastSyncAt",
    "CalDavServerEnabled",
    "highEnergyPeriods",
]);

export class AdminStore {
    constructor(private db: Database) {}

    async updateUserFields(
        userId: string,
        updates: Record<string, unknown>,
    ): Promise<void> {
        const setClauses: string[] = [];
        const values: unknown[] = [];
        for (const [key, value] of Object.entries(updates)) {
            if (!ADMIN_ALLOWED_COLUMNS.has(key)) {
                throw new Error(`不允许更新列: ${key}`);
            }
            setClauses.push(`${key} = ?`);
            values.push(value);
        }
        if (setClauses.length === 0) return;
        setClauses.push("updatedAt = CURRENT_TIMESTAMP");
        const sql = `UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`;
        values.push(userId);
        await this.db.run(sql, values);
    }

    async deleteUser(userId: string): Promise<boolean> {
        // 先清 todo_tags 关联（即使 CASCADE 可用也显式删除，兼容旧库）
        await this.db.run(
            `DELETE FROM todo_tags WHERE todoId IN (SELECT id FROM todos WHERE userId = ?)
             OR tagId IN (SELECT id FROM tags WHERE userId = ?)`,
            [userId, userId],
        );
        await this.db.run("DELETE FROM todos WHERE userId = ?", [userId]);
        await this.db.run("DELETE FROM tags WHERE userId = ?", [userId]);
        await this.db.run("DELETE FROM tasks WHERE userId = ?", [userId]);
        await this.db.run("DELETE FROM calendar_event_map WHERE userId = ?", [
            userId,
        ]);
        await this.db.run("DELETE FROM schedule_queue WHERE userId = ?", [
            userId,
        ]);
        await this.db.run("DELETE FROM todo_queue WHERE userId = ?", [userId]);
        await this.db.run("DELETE FROM user_logs WHERE userId = ?", [userId]);
        await this.db.run("DELETE FROM ai_processed_emails WHERE userId = ?", [
            userId,
        ]);
        const result = await this.db.run("DELETE FROM users WHERE id = ?", [
            userId,
        ]);
        return (result?.changes ?? 0) > 0;
    }
}
