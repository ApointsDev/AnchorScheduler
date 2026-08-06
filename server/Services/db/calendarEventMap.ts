// CalDAV 事件映射表
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";

export class CalendarEventMapStore {
    constructor(private db: Database) {}

    async getByLocalId(userId: string, provider: string, localTaskId: string) {
        const row: any = await this.db.get(
            `SELECT * FROM calendar_event_map WHERE userId = ? AND provider = ? AND localTaskId = ?`,
            [userId, provider, localTaskId],
        );
        return row || null;
    }

    async getByRemoteUid(userId: string, provider: string, remoteUid: string) {
        const row: any = await this.db.get(
            `SELECT * FROM calendar_event_map WHERE userId = ? AND provider = ? AND remoteUid = ?`,
            [userId, provider, remoteUid],
        );
        return row || null;
    }

    async upsert(entry: {
        userId: string; provider: string; localTaskId: string;
        remoteUid?: string; remoteHref?: string; remoteEtag?: string;
        calendarUrl?: string; rawData?: string;
    }) {
        const existing: any = await this.db.get(
            `SELECT id FROM calendar_event_map WHERE userId = ? AND provider = ? AND localTaskId = ?`,
            [entry.userId, entry.provider, entry.localTaskId],
        );
        if (existing?.id) {
            await this.db.run(
                `UPDATE calendar_event_map SET remoteUid = ?, remoteHref = ?, remoteEtag = ?, calendarUrl = ?, rawData = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
                [entry.remoteUid, entry.remoteHref, entry.remoteEtag, entry.calendarUrl, entry.rawData, existing.id],
            );
        } else {
            const id = uuidv4();
            await this.db.run(
                `INSERT INTO calendar_event_map (id, userId, provider, localTaskId, remoteUid, remoteHref, remoteEtag, calendarUrl, rawData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, entry.userId, entry.provider, entry.localTaskId, entry.remoteUid, entry.remoteHref, entry.remoteEtag, entry.calendarUrl, entry.rawData],
            );
        }
    }

    async deleteByLocalId(userId: string, provider: string, localTaskId: string) {
        await this.db.run(
            `DELETE FROM calendar_event_map WHERE userId = ? AND provider = ? AND localTaskId = ?`,
            [userId, provider, localTaskId],
        );
    }
}
