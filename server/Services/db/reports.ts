// 用户反馈 / 举报存储服务（RPT-001）
//
// 模型：
// - user_reports：用户提交的反馈（feedback）或举报（report）。
//   - feedback：意见 / Bug / 功能建议等
//   - report：举报违规用户或不当内容（targetId 指向被举报对象）
//   - status：pending → processing → resolved / rejected

import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";

export const REPORT_TYPES = ["feedback", "report"] as const;
export const REPORT_STATUSES = [
    "pending",
    "processing",
    "resolved",
    "rejected",
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface UserReport {
    id: string;
    userId: string;
    type: ReportType;
    category: string | null;
    targetId: string | null;
    content: string;
    contact: string | null;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ReportCreateInput {
    userId: string;
    type?: ReportType;
    category?: string | null;
    targetId?: string | null;
    content: string;
    contact?: string | null;
}

export interface ReportListOpts {
    userId?: string;
    type?: ReportType;
    status?: ReportStatus;
    search?: string;
    limit?: number;
    offset?: number;
}

export interface ReportListResult {
    reports: UserReport[];
    total: number;
}

interface ReportRow {
    id: string;
    userId: string;
    type: ReportType;
    category: string | null;
    targetId: string | null;
    content: string;
    contact: string | null;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

function mapRow(row: ReportRow): UserReport {
    return {
        id: row.id,
        userId: row.userId,
        type: row.type,
        category: row.category,
        targetId: row.targetId,
        content: row.content,
        contact: row.contact,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

export class UserReportStore {
    constructor(private db: Database) {}

    /** 提交反馈 / 举报 */
    async create(input: ReportCreateInput): Promise<UserReport> {
        const id = uuidv4();
        const now = toShanghaiISO();
        const type: ReportType =
            input.type === "report" ? "report" : "feedback";

        await this.db.run(
            `INSERT INTO user_reports
                (id, userId, type, category, targetId, content, contact, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
            [
                id,
                input.userId,
                type,
                input.category || null,
                input.targetId || null,
                input.content,
                input.contact || null,
                now,
                now,
            ],
        );
        const row = await this.db.get<ReportRow>(
            "SELECT * FROM user_reports WHERE id = ?",
            [id],
        );
        return mapRow(row!);
    }

    /** 分页查询（支持按用户 / 类型 / 状态 / 关键字筛选） */
    async list(opts: ReportListOpts = {}): Promise<ReportListResult> {
        const where: string[] = [];
        const params: unknown[] = [];

        if (opts.userId) {
            where.push("userId = ?");
            params.push(opts.userId);
        }
        if (opts.type) {
            where.push("type = ?");
            params.push(opts.type);
        }
        if (opts.status) {
            where.push("status = ?");
            params.push(opts.status);
        }
        if (opts.search && opts.search.trim()) {
            where.push(
                "(content LIKE ? OR category LIKE ? OR contact LIKE ? OR id LIKE ?)",
            );
            const q = `%${opts.search.trim()}%`;
            params.push(q, q, q, q);
        }

        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

        const totalRow = await this.db.get<{ c: number }>(
            `SELECT COUNT(*) AS c FROM user_reports ${whereSql}`,
            params,
        );

        const limit = Math.min(200, opts.limit || 50);
        const offset = opts.offset || 0;
        const rows = await this.db.all<ReportRow[]>(
            `SELECT * FROM user_reports ${whereSql}
             ORDER BY createdAt DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset],
        );

        return {
            reports: rows.map(mapRow),
            total: totalRow?.c ?? 0,
        };
    }

    async getById(id: string): Promise<UserReport | null> {
        const row = await this.db.get<ReportRow>(
            "SELECT * FROM user_reports WHERE id = ?",
            [id],
        );
        return row ? mapRow(row) : null;
    }

    /** 更新处理状态（管理员） */
    async updateStatus(
        id: string,
        status: ReportStatus,
    ): Promise<UserReport | null> {
        const valid = REPORT_STATUSES.includes(status);
        if (!valid) {
            throw new Error(`无效的状态: ${status}`);
        }
        await this.db.run(
            `UPDATE user_reports
             SET status = ?, updatedAt = ?
             WHERE id = ?`,
            [status, toShanghaiISO(), id],
        );
        return this.getById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db.run(
            "DELETE FROM user_reports WHERE id = ?",
            [id],
        );
        return (result?.changes ?? 0) > 0;
    }
}
