// 学校（School）持久化 — 多校 DA 校园大事件的核心实体
import type { Database } from "sqlite";

export interface School {
    id: string;
    slug: string;
    name: string;
    eventsEmail: string | null;
    themeColor: string | null;
    enabled: number | boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface SchoolCreateInput {
    id: string;
    slug: string;
    name: string;
    eventsEmail?: string;
    themeColor?: string;
}

export class SchoolStore {
    constructor(private db: Database) {}

    async list(opts?: { includeDisabled?: boolean }): Promise<School[]> {
        if (opts?.includeDisabled) {
            return this.db.all("SELECT * FROM schools ORDER BY createdAt ASC");
        }
        return this.db.all(
            "SELECT * FROM schools WHERE enabled = 1 ORDER BY createdAt ASC",
        );
    }

    async getById(id: string): Promise<School | null> {
        return (
            (await this.db.get("SELECT * FROM schools WHERE id = ?", [id])) ||
            null
        );
    }

    async getBySlug(slug: string): Promise<School | null> {
        return (
            (await this.db.get("SELECT * FROM schools WHERE slug = ?", [
                slug,
            ])) || null
        );
    }

    async create(input: SchoolCreateInput): Promise<void> {
        await this.db.run(
            `INSERT INTO schools (id, slug, name, eventsEmail, themeColor, enabled)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [
                input.id,
                input.slug,
                input.name,
                input.eventsEmail || null,
                input.themeColor || null,
            ],
        );
    }

    async update(
        id: string,
        patch: {
            slug?: string;
            name?: string;
            eventsEmail?: string | null;
            themeColor?: string | null;
        },
    ): Promise<boolean> {
        const sets: string[] = [];
        const vals: unknown[] = [];
        if (patch.slug !== undefined) {
            sets.push("slug = ?");
            vals.push(patch.slug);
        }
        if (patch.name !== undefined) {
            sets.push("name = ?");
            vals.push(patch.name);
        }
        if (patch.eventsEmail !== undefined) {
            sets.push("eventsEmail = ?");
            vals.push(patch.eventsEmail);
        }
        if (patch.themeColor !== undefined) {
            sets.push("themeColor = ?");
            vals.push(patch.themeColor);
        }
        if (sets.length === 0) return false;
        sets.push("updatedAt = CURRENT_TIMESTAMP");
        vals.push(id);
        const result = await this.db.run(
            `UPDATE schools SET ${sets.join(", ")} WHERE id = ?`,
            vals,
        );
        return (result?.changes ?? 0) > 0;
    }

    async setEnabled(id: string, enabled: boolean): Promise<boolean> {
        const result = await this.db.run(
            "UPDATE schools SET enabled = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
            [enabled ? 1 : 0, id],
        );
        return (result?.changes ?? 0) > 0;
    }

    /** 物理删除学校（会级联清理该校 DA 配置/管理员）。优先使用停用而非删除。 */
    async delete(id: string): Promise<boolean> {
        const result = await this.db.run(
            "DELETE FROM schools WHERE id = ?",
            [id],
        );
        return (result?.changes ?? 0) > 0;
    }

    // ── DA 管理员（school_admins）──
    async listAdmins(schoolId: string): Promise<{ email: string }[]> {
        return this.db.all(
            "SELECT email FROM school_admins WHERE schoolId = ? ORDER BY createdAt ASC",
            [schoolId],
        );
    }

    async isAdmin(schoolId: string, email: string): Promise<boolean> {
        const row = await this.db.get(
            "SELECT 1 FROM school_admins WHERE schoolId = ? AND lower(email) = lower(?)",
            [schoolId, email],
        );
        return !!row;
    }

    async addAdmin(schoolId: string, email: string): Promise<void> {
        await this.db.run(
            "INSERT OR IGNORE INTO school_admins (schoolId, email) VALUES (?, ?)",
            [schoolId, email.trim().toLowerCase()],
        );
    }

    async removeAdmin(schoolId: string, email: string): Promise<boolean> {
        const result = await this.db.run(
            "DELETE FROM school_admins WHERE schoolId = ? AND lower(email) = lower(?)",
            [schoolId, email],
        );
        return (result?.changes ?? 0) > 0;
    }
}
