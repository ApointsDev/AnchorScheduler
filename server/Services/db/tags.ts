// 标签 CRUD — 用户级标签，(userId, name) 唯一
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";
import type { Tag } from "../../types/models";
import { mapRowToTag } from "./todoMapper";
import { toShanghaiISO } from "../../Utils/time.js";
import {
    ArchiveForbiddenError,
    ArchiveNotArchivedError,
} from "./archiveErrors.js";

/** 官方/系统分组：不可归档（ARC-001） */
export const OFFICIAL_TAG_NAMES = new Set(["默认", "default"]);

export class TagConflictError extends Error {
    constructor(message = "Tag name already exists") {
        super(message);
        this.name = "TagConflictError";
    }
}

export class TagNotFoundError extends Error {
    constructor(message = "Tag not found") {
        super(message);
        this.name = "TagNotFoundError";
    }
}

export class TagStore {
    constructor(private db: Database) {}

    async listByUser(
        userId: string,
        opts?: { includeArchived?: boolean },
    ): Promise<Tag[]> {
        const where = opts?.includeArchived
            ? "WHERE userId = ?"
            : "WHERE userId = ? AND archivedAt IS NULL";
        const rows = await this.db.all(
            `SELECT * FROM tags ${where} ORDER BY name ASC`,
            [userId],
        );
        return rows.map(mapRowToTag);
    }

    async getById(userId: string, tagId: string): Promise<Tag | null> {
        const row = await this.db.get(
            `SELECT * FROM tags WHERE id = ? AND userId = ?`,
            [tagId, userId],
        );
        if (!row) return null;
        return mapRowToTag(row);
    }

    async getByName(userId: string, name: string): Promise<Tag | null> {
        const row = await this.db.get(
            `SELECT * FROM tags WHERE userId = ? AND name = ?`,
            [userId, name],
        );
        if (!row) return null;
        return mapRowToTag(row);
    }

    async create(
        userId: string,
        input: { name: string; color?: string; id?: string },
    ): Promise<Tag> {
        const name = (input.name || "").trim();
        if (!name) throw new Error("Tag name is required");
        const id = input.id || uuidv4();

        // 创建与已归档分组同名时：恢复并复用原 ID（ARC-001，避免 UNIQUE 冲突）
        const archived = await this.getArchivedByName(userId, name);
        if (archived) {
            const restored = await this.restore(
                userId,
                archived.id,
                new Date(),
            );
            if (restored) return restored;
        }

        try {
            await this.db.run(
                `INSERT INTO tags (id, userId, name, color, lastActivityAt) VALUES (?, ?, ?, ?, ?)`,
                [id, userId, name, input.color || null, toShanghaiISO()],
            );
        } catch (e: any) {
            const msg = String(e?.message || e);
            if (msg.includes("UNIQUE") || msg.includes("unique")) {
                throw new TagConflictError(`Tag name already exists: ${name}`);
            }
            throw e;
        }
        const tag = await this.getById(userId, id);
        if (!tag) throw new Error("Failed to create tag");
        return tag;
    }

    async update(
        userId: string,
        tagId: string,
        updates: { name?: string; color?: string | null },
    ): Promise<Tag> {
        const existing = await this.getById(userId, tagId);
        if (!existing) throw new TagNotFoundError();

        const name =
            updates.name !== undefined
                ? String(updates.name).trim()
                : existing.name;
        if (!name) throw new Error("Tag name is required");

        const color =
            updates.color !== undefined
                ? updates.color || null
                : existing.color || null;

        try {
            await this.db.run(
                `UPDATE tags SET name = ?, color = ?, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?`,
                [name, color, toShanghaiISO(), tagId, userId],
            );
        } catch (e: any) {
            const msg = String(e?.message || e);
            if (msg.includes("UNIQUE") || msg.includes("unique")) {
                throw new TagConflictError(`Tag name already exists: ${name}`);
            }
            throw e;
        }

        const tag = await this.getById(userId, tagId);
        if (!tag) throw new TagNotFoundError();
        return tag;
    }

    async delete(userId: string, tagId: string): Promise<boolean> {
        // CASCADE 清 todo_tags；待办本体保留
        const result: any = await this.db.run(
            `DELETE FROM tags WHERE id = ? AND userId = ?`,
            [tagId, userId],
        );
        return (result?.changes ?? 0) > 0;
    }

    /**
     * 校验 tagIds 归属当前用户，并按 name 查找或创建。
     * 返回去重后的 Tag 列表。
     */
    async resolveTags(
        userId: string,
        opts?: { tagIds?: string[]; tagNames?: string[] },
    ): Promise<Tag[]> {
        const byId = new Map<string, Tag>();

        const tagIds = (opts?.tagIds || []).filter(Boolean);
        if (tagIds.length > 0) {
            const placeholders = tagIds.map(() => "?").join(",");
            const rows = await this.db.all(
                `SELECT * FROM tags WHERE userId = ? AND id IN (${placeholders})`,
                [userId, ...tagIds],
            );
            const found = new Set(rows.map((r: any) => r.id));
            for (const id of tagIds) {
                if (!found.has(id)) {
                    throw new TagNotFoundError(
                        `Tag not found or not owned: ${id}`,
                    );
                }
            }
            for (const row of rows) {
                const tag = mapRowToTag(row);
                byId.set(tag.id, tag);
            }
        }

        const names = (opts?.tagNames || [])
            .map((n) => String(n || "").trim())
            .filter(Boolean);
        for (const name of names) {
            let tag = await this.getByName(userId, name);
            if (!tag) {
                tag = await this.create(userId, { name });
            }
            byId.set(tag.id, tag);
        }

        return Array.from(byId.values());
    }

    // ── 归档（ARC-001）───────────────────────────────────────

    /** 官方/系统分组（如“默认”）不可归档 */
    private isOfficial(tag: Tag): boolean {
        return OFFICIAL_TAG_NAMES.has((tag.name || "").trim().toLowerCase());
    }

    /** 按名称查找已归档分组（仅限本人） */
    private async getArchivedByName(
        userId: string,
        name: string,
    ): Promise<Tag | null> {
        const row = await this.db.get(
            `SELECT * FROM tags WHERE userId = ? AND name = ? AND archivedAt IS NOT NULL`,
            [userId, name],
        );
        if (!row) return null;
        return mapRowToTag(row);
    }

    /** 当前用户所有已归档分组，按 archivedAt DESC（最新在前） */
    async listArchived(userId: string): Promise<Tag[]> {
        const rows = await this.db.all(
            `SELECT * FROM tags
             WHERE userId = ? AND archivedAt IS NOT NULL
             ORDER BY archivedAt DESC`,
            [userId],
        );
        return rows.map(mapRowToTag);
    }

    /** 归档分组：写 archivedAt + 刷新 lastActivityAt；官方组抛 ArchiveForbiddenError */
    async archive(
        userId: string,
        tagId: string,
        now: Date = new Date(),
    ): Promise<Tag | null> {
        const tag = await this.getById(userId, tagId);
        if (!tag) return null;
        if (this.isOfficial(tag)) {
            throw new ArchiveForbiddenError(
                `Official tag "${tag.name}" cannot be archived`,
            );
        }
        const archivedAt = toShanghaiISO(now);
        const lastActivityAt = toShanghaiISO(now);
        await this.db.run(
            `UPDATE tags
             SET archivedAt = ?, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ? AND userId = ?`,
            [archivedAt, lastActivityAt, tagId, userId],
        );
        return this.getById(userId, tagId);
    }

    /** 恢复分组：archivedAt 置空 + 刷新 lastActivityAt；幂等 */
    async restore(
        userId: string,
        tagId: string,
        now: Date = new Date(),
    ): Promise<Tag | null> {
        const lastActivityAt = toShanghaiISO(now);
        const result = await this.db.run(
            `UPDATE tags
             SET archivedAt = NULL, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ? AND userId = ?`,
            [lastActivityAt, tagId, userId],
        );
        if ((result?.changes ?? 0) === 0) return null;
        return this.getById(userId, tagId);
    }

    /**
     * 永久删除已归档分组。
     * - 不存在或非本人 → false（由调用方映射 404）
     * - 存在但未归档 → 抛 ArchiveNotArchivedError（409）
     */
    async deleteArchived(
        userId: string,
        tagId: string,
    ): Promise<boolean> {
        const row: { id: string; archivedAt: string | null } | undefined =
            await this.db.get(
                `SELECT id, archivedAt FROM tags WHERE id = ? AND userId = ?`,
                [tagId, userId],
            );
        if (!row) return false;
        if (row.archivedAt == null) {
            throw new ArchiveNotArchivedError(
                `Tag ${tagId} is not archived, permanent delete rejected`,
            );
        }
        const result = await this.db.run(
            `DELETE FROM tags WHERE id = ? AND userId = ?`,
            [tagId, userId],
        );
        return (result?.changes ?? 0) > 0;
    }
}
