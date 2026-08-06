// 用户操作日志
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";
import type { LogEntry, LogPageOpts } from "./index";
import { safeJsonParse } from "./taskMapper";

export class UserLogStore {
    private _onLogAdded: ((userId: string, log: LogEntry) => void) | null =
        null;

    constructor(private db: Database) {}

    setLogListener(listener: (userId: string, log: LogEntry) => void) {
        this._onLogAdded = listener;
    }

    async add(
        userId: string,
        type: string,
        message: string,
        payload?: unknown,
    ): Promise<LogEntry> {
        const id = uuidv4();
        const payloadStr =
            payload !== undefined ? JSON.stringify(payload) : null;
        await this.db.run(
            `INSERT INTO user_logs (id, userId, type, message, payload) VALUES (?, ?, ?, ?, ?)`,
            [id, userId, type, message, payloadStr],
        );
        const row: Record<string, unknown> = (await this.db.get(
            `SELECT * FROM user_logs WHERE id = ?`,
            [id],
        )) as Record<string, unknown>;
        const logEntry: LogEntry = {
            id: row.id as string,
            time: toShanghaiISO(row.time as string),
            type: row.type as string,
            message: row.message as string,
            payload: row.payload
                ? safeJsonParse(row.payload as string)
                : undefined,
        };
        if (this._onLogAdded) {
            this._onLogAdded(userId, logEntry);
        }
        return logEntry;
    }

    async getPage(userId: string, opts?: LogPageOpts) {
        const where: string[] = ["userId = ?"];
        const params: unknown[] = [userId];
        if (opts?.since) {
            where.push("time >= ?");
            params.push(opts.since);
        }
        if (opts?.until) {
            where.push("time <= ?");
            params.push(opts.until);
        }
        if (opts?.type) {
            where.push("type = ?");
            params.push(opts.type);
        }
        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
        const limit = Math.max(1, Math.min(500, opts?.limit || 50));
        const offset = Math.max(0, opts?.offset || 0);
        const countRow = (await this.db.get(
            `SELECT COUNT(*) as cnt FROM user_logs ${whereSql}`,
            params,
        )) as { cnt: number } | undefined;
        const total = countRow ? countRow.cnt || 0 : 0;
        const rows = await this.db.all(
            `SELECT * FROM user_logs ${whereSql} ORDER BY time DESC LIMIT ? OFFSET ?`,
            params.concat([limit, offset]),
        );
        const logs: LogEntry[] = rows.map((r: Record<string, unknown>) => ({
            id: r.id as string,
            time: toShanghaiISO(r.time as string),
            type: r.type as string,
            message: r.message as string,
            payload: r.payload ? safeJsonParse(r.payload as string) : undefined,
        }));
        return { logs, total };
    }
}
