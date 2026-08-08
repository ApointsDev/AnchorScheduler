// DA 校园大事件持久化（按学校作用域）：da_settings / da_student_optins
import type { Database } from "sqlite";

export interface DaStudentOptin {
    schoolId: string;
    userId: string;
    optedIn: number | boolean;
    createdAt?: string;
    updatedAt?: string;
}

export class DaStore {
    constructor(private db: Database) {}

    // ── da_settings（schoolId 作用域的 key-value）──

    async getSetting(schoolId: string, key: string): Promise<string | null> {
        const row = await this.db.get(
            "SELECT value FROM da_settings WHERE schoolId = ? AND key = ?",
            [schoolId, key],
        );
        return row?.value ?? null;
    }

    async setSetting(
        schoolId: string,
        key: string,
        value: string,
    ): Promise<void> {
        await this.db.run(
            `INSERT INTO da_settings (schoolId, key, value, updatedAt)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(schoolId, key) DO UPDATE SET
                value = excluded.value, updatedAt = CURRENT_TIMESTAMP`,
            [schoolId, key, value],
        );
    }

    async getAllSettings(schoolId: string): Promise<Record<string, string>> {
        const rows = await this.db.all(
            "SELECT key, value FROM da_settings WHERE schoolId = ?",
            [schoolId],
        );
        const out: Record<string, string> = {};
        for (const r of rows) out[r.key] = r.value;
        return out;
    }

    // ── da_student_optins（需求 4：学生邮箱贡献开关）──

    async getOptin(
        schoolId: string,
        userId: string,
    ): Promise<DaStudentOptin | null> {
        return (
            (await this.db.get(
                "SELECT * FROM da_student_optins WHERE schoolId = ? AND userId = ?",
                [schoolId, userId],
            )) || null
        );
    }

    async setOptin(
        schoolId: string,
        userId: string,
        optedIn: boolean,
    ): Promise<void> {
        await this.db.run(
            `INSERT INTO da_student_optins (schoolId, userId, optedIn, createdAt, updatedAt)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             ON CONFLICT(schoolId, userId) DO UPDATE SET
                optedIn = excluded.optedIn, updatedAt = CURRENT_TIMESTAMP`,
            [schoolId, userId, optedIn ? 1 : 0],
        );
    }

    async listOptins(
        schoolId: string,
        opts?: { limit?: number; offset?: number },
    ): Promise<{ rows: DaStudentOptin[]; total: number }> {
        const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 200);
        const offset = Math.max(opts?.offset ?? 0, 0);
        const totalRow = await this.db.get(
            "SELECT COUNT(*) AS total FROM da_student_optins WHERE schoolId = ?",
            [schoolId],
        );
        const rows = await this.db.all(
            "SELECT * FROM da_student_optins WHERE schoolId = ? ORDER BY updatedAt DESC LIMIT ? OFFSET ?",
            [schoolId, limit, offset],
        );
        return { rows, total: totalRow?.total ?? 0 };
    }

    /** 某用户已开启贡献的学校列表 */
    async listSchoolsByOptinUser(userId: string): Promise<DaStudentOptin[]> {
        return this.db.all(
            "SELECT * FROM da_student_optins WHERE userId = ? AND optedIn = 1",
            [userId],
        );
    }
}
