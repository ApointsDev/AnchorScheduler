// 待办 CRUD + 标签关联 + 按标签反查
import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";
import type { Tag, Todo } from "../../types/models";
import { toShanghaiISO } from "../../Utils/time.js";
import {
    clampAxisScore,
    resolvePriorityAxes,
} from "../priorityAxes.js";
import { mapRowToTag, mapRowToTodo, normalizeImportance } from "./todoMapper";
import type { TagStore } from "./tags";
import { TagNotFoundError } from "./tags";
import { ArchiveNotArchivedError } from "./archiveErrors.js";

export class TodoNotFoundError extends Error {
    constructor(message = "Todo not found") {
        super(message);
        this.name = "TodoNotFoundError";
    }
}

export interface TodoPageOpts {
    q?: string;
    completed?: boolean;
    tagIds?: string[];
    tagNames?: string[];
    dueBefore?: string;
    dueAfter?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    /** 为 true 时包含已归档数据；默认仅返回未归档（archivedAt IS NULL） */
    includeArchived?: boolean;
}

export class TodoStore {
    constructor(
        private db: Database,
        private tags: TagStore,
        private addUserLog?: (
            userId: string,
            type: string,
            message: string,
            payload?: any,
        ) => Promise<any>,
    ) {}

    private async getTagsForTodoIds(
        todoIds: string[],
    ): Promise<Map<string, Tag[]>> {
        const map = new Map<string, Tag[]>();
        if (todoIds.length === 0) return map;
        const placeholders = todoIds.map(() => "?").join(",");
        const rows = await this.db.all(
            `SELECT tt.todoId AS todoId, t.*
             FROM todo_tags tt
             INNER JOIN tags t ON t.id = tt.tagId
             WHERE tt.todoId IN (${placeholders})
             ORDER BY t.name ASC`,
            todoIds,
        );
        for (const row of rows) {
            const todoId = row.todoId as string;
            const list = map.get(todoId) || [];
            list.push(mapRowToTag(row));
            map.set(todoId, list);
        }
        return map;
    }

    private async attachTags(rows: any[]): Promise<Todo[]> {
        const ids = rows.map((r) => r.id as string);
        const tagMap = await this.getTagsForTodoIds(ids);
        return rows.map((r) => mapRowToTodo(r, tagMap.get(r.id) || []));
    }

    private async setTodoTags(todoId: string, tags: Tag[]): Promise<void> {
        await this.db.run(`DELETE FROM todo_tags WHERE todoId = ?`, [todoId]);
        for (const tag of tags) {
            await this.db.run(
                `INSERT INTO todo_tags (todoId, tagId) VALUES (?, ?)`,
                [todoId, tag.id],
            );
        }
    }

    async getById(userId: string, todoId: string): Promise<Todo | null> {
        const row = await this.db.get(
            `SELECT * FROM todos WHERE id = ? AND userId = ?`,
            [todoId, userId],
        );
        if (!row) return null;
        const [todo] = await this.attachTags([row]);
        return todo;
    }

    async create(
        userId: string,
        input: {
            name: string;
            description?: string;
            completed?: boolean;
            dueDate?: string;
            importance?: string;
            importanceScore?: number | null;
            urgencyScore?: number | null;
            tagIds?: string[];
            tagNames?: string[];
            id?: string;
        },
    ): Promise<Todo> {
        const name = (input.name || "").trim();
        if (!name) throw new Error("Todo name is required");

        const id = input.id || uuidv4();
        const importance = normalizeImportance(input.importance);
        const axes = resolvePriorityAxes({
            importanceScore: input.importanceScore,
            urgencyScore: input.urgencyScore,
            importance,
            fillDefaults: true,
        });
        let dueDate: string | null = null;
        if (input.dueDate) {
            try {
                dueDate = toShanghaiISO(input.dueDate);
            } catch {
                dueDate = input.dueDate;
            }
        }

        const tags = await this.tags.resolveTags(userId, {
            tagIds: input.tagIds,
            tagNames: input.tagNames,
        });

        await this.db.run("BEGIN");
        try {
            await this.db.run(
                `INSERT INTO todos (id, userId, name, description, completed, dueDate, importance, importanceScore, urgencyScore, completedAt, lastActivityAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    userId,
                    name,
                    input.description ?? null,
                    input.completed ? 1 : 0,
                    dueDate,
                    importance,
                    axes.importanceScore,
                    axes.urgencyScore,
                    input.completed ? toShanghaiISO() : null,
                    toShanghaiISO(),
                ],
            );
            await this.setTodoTags(id, tags);
            await this.db.run("COMMIT");
        } catch (e) {
            await this.db.run("ROLLBACK");
            throw e;
        }

        if (this.addUserLog) {
            await this.addUserLog(userId, "todo_created", `Created todo ${name}`, {
                todoId: id,
                name,
            });
        }

        const todo = await this.getById(userId, id);
        if (!todo) throw new Error("Failed to create todo");
        return todo;
    }

    async update(
        userId: string,
        todoId: string,
        updates: {
            name?: string;
            description?: string | null;
            completed?: boolean;
            dueDate?: string | null;
            importance?: string;
            importanceScore?: number | null;
            urgencyScore?: number | null;
            tagIds?: string[];
            tagNames?: string[];
            /** 为 true 时按 tagIds/tagNames 替换标签（可为空数组表示清空） */
            replaceTags?: boolean;
        },
    ): Promise<Todo> {
        const existing = await this.getById(userId, todoId);
        if (!existing) throw new TodoNotFoundError();

        const name =
            updates.name !== undefined
                ? String(updates.name).trim()
                : existing.name;
        if (!name) throw new Error("Todo name is required");

        const description =
            updates.description !== undefined
                ? updates.description
                : existing.description ?? null;

        const completed =
            updates.completed !== undefined
                ? updates.completed
                : existing.completed;

        let dueDate: string | null =
            existing.dueDate !== undefined && existing.dueDate !== null
                ? existing.dueDate
                : null;
        if (updates.dueDate !== undefined) {
            if (updates.dueDate === null || updates.dueDate === "") {
                dueDate = null;
            } else {
                try {
                    dueDate = toShanghaiISO(updates.dueDate);
                } catch {
                    dueDate = updates.dueDate;
                }
            }
        }

        const importance =
            updates.importance !== undefined
                ? normalizeImportance(updates.importance)
                : normalizeImportance(existing.importance);

        const importanceScore =
            updates.importanceScore !== undefined
                ? clampAxisScore(updates.importanceScore)
                : existing.importanceScore !== undefined
                  ? existing.importanceScore ?? null
                  : null;
        const urgencyScore =
            updates.urgencyScore !== undefined
                ? clampAxisScore(updates.urgencyScore)
                : existing.urgencyScore !== undefined
                  ? existing.urgencyScore ?? null
                  : null;

        const shouldReplaceTags =
            updates.replaceTags === true ||
            updates.tagIds !== undefined ||
            updates.tagNames !== undefined;

        let tags = existing.tags;
        if (shouldReplaceTags) {
            tags = await this.tags.resolveTags(userId, {
                tagIds: updates.tagIds ?? [],
                tagNames: updates.tagNames ?? [],
            });
        }

        await this.db.run("BEGIN");
        try {
            // completedAt：completed 状态变化时维护，禁止客户端随意修改
            let completedAt: string | null = null;
            if (completed) {
                completedAt =
                    existing.completed && existing.completedAt
                        ? existing.completedAt
                        : toShanghaiISO();
            }
            await this.db.run(
                `UPDATE todos SET name = ?, description = ?, completed = ?, dueDate = ?, importance = ?, importanceScore = ?, urgencyScore = ?, completedAt = ?, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP
                 WHERE id = ? AND userId = ?`,
                [
                    name,
                    description,
                    completed ? 1 : 0,
                    dueDate,
                    importance,
                    importanceScore,
                    urgencyScore,
                    completedAt,
                    toShanghaiISO(),
                    todoId,
                    userId,
                ],
            );
            if (shouldReplaceTags) {
                await this.setTodoTags(todoId, tags);
            }
            await this.db.run("COMMIT");
        } catch (e) {
            await this.db.run("ROLLBACK");
            throw e;
        }

        if (this.addUserLog) {
            await this.addUserLog(
                userId,
                "todo_updated",
                `Updated todo ${todoId}`,
                { todoId, updates },
            );
        }

        const todo = await this.getById(userId, todoId);
        if (!todo) throw new TodoNotFoundError();
        return todo;
    }

    async delete(userId: string, todoId: string): Promise<boolean> {
        const result: any = await this.db.run(
            `DELETE FROM todos WHERE id = ? AND userId = ?`,
            [todoId, userId],
        );
        const ok = (result?.changes ?? 0) > 0;
        if (ok && this.addUserLog) {
            await this.addUserLog(
                userId,
                "todo_deleted",
                `Deleted todo ${todoId}`,
                { todoId },
            );
        }
        return ok;
    }

    /**
     * 将 tagNames 解析为当前用户的 tagIds，再用于筛选。
     */
    private async resolveFilterTagIds(
        userId: string,
        tagIds?: string[],
        tagNames?: string[],
    ): Promise<string[]> {
        const ids = new Set<string>(tagIds || []);
        if (tagNames && tagNames.length > 0) {
            for (const raw of tagNames) {
                const name = String(raw || "").trim();
                if (!name) continue;
                const tag = await this.tags.getByName(userId, name);
                if (!tag) {
                    // 不存在的标签名 → 无匹配结果：返回哨兵 id
                    return ["__no_such_tag__"];
                }
                ids.add(tag.id);
            }
        }
        // 校验 tagIds 归属
        for (const id of Array.from(ids)) {
            if (id === "__no_such_tag__") continue;
            const tag = await this.tags.getById(userId, id);
            if (!tag) {
                throw new TagNotFoundError(
                    `Tag not found or not owned: ${id}`,
                );
            }
        }
        return Array.from(ids);
    }

    async getPage(
        userId: string,
        opts?: TodoPageOpts,
    ): Promise<{ todos: Todo[]; total: number }> {
        const where: string[] = ["userId = ?"];
        const params: any[] = [userId];
        // 普通列表默认排除归档；归档内容通过 /api/archive 读取
        if (!opts?.includeArchived) {
            where.push("archivedAt IS NULL");
        }

        if (typeof opts?.completed === "boolean") {
            where.push("completed = ?");
            params.push(opts.completed ? 1 : 0);
        }
        if (opts?.q) {
            const like = `%${opts.q.toLowerCase()}%`;
            where.push(
                "(LOWER(name) LIKE ? OR LOWER(COALESCE(description, '')) LIKE ?)",
            );
            params.push(like, like);
        }
        if (opts?.dueAfter) {
            where.push("dueDate >= ?");
            params.push(opts.dueAfter);
        }
        if (opts?.dueBefore) {
            where.push("dueDate <= ?");
            params.push(opts.dueBefore);
        }

        const filterTagIds = await this.resolveFilterTagIds(
            userId,
            opts?.tagIds,
            opts?.tagNames,
        );
        if (filterTagIds.length > 0) {
            const placeholders = filterTagIds.map(() => "?").join(",");
            where.push(`id IN (
                SELECT todoId FROM todo_tags
                WHERE tagId IN (${placeholders})
                GROUP BY todoId
                HAVING COUNT(DISTINCT tagId) = ?
            )`);
            params.push(...filterTagIds, filterTagIds.length);
        }

        const whereSql = `WHERE ${where.join(" AND ")}`;
        const allowedSort = [
            "createdAt",
            "updatedAt",
            "dueDate",
            "name",
            "importance",
        ];
        const sortField = allowedSort.includes(opts?.sortBy || "")
            ? opts!.sortBy!
            : "createdAt";
        const order = opts?.order === "asc" ? "ASC" : "DESC";
        const limit = Math.max(1, Math.min(500, opts?.limit || 50));
        const offset = Math.max(0, opts?.offset || 0);

        const countRow: any = await this.db.get(
            `SELECT COUNT(*) as cnt FROM todos ${whereSql}`,
            params,
        );
        const total = countRow ? countRow.cnt || 0 : 0;
        const rows = await this.db.all(
            `SELECT * FROM todos ${whereSql} ORDER BY ${sortField} ${order} LIMIT ? OFFSET ?`,
            params.concat([limit, offset]),
        );
        const todos = await this.attachTags(rows);
        return { todos, total };
    }

    /** 按单个标签反查待办 */
    async getByTagId(
        userId: string,
        tagId: string,
        opts?: Omit<TodoPageOpts, "tagIds" | "tagNames">,
    ): Promise<{ todos: Todo[]; total: number }> {
        const tag = await this.tags.getById(userId, tagId);
        if (!tag) throw new TagNotFoundError();
        return this.getPage(userId, { ...opts, tagIds: [tagId] });
    }

    // ── 归档（ARC-001）───────────────────────────────────────

    /** 当前用户所有已归档待办（含标签），按 archivedAt DESC（最新在前） */
    async listArchived(userId: string): Promise<Todo[]> {
        const rows = await this.db.all(
            `SELECT * FROM todos
             WHERE userId = ? AND archivedAt IS NOT NULL
             ORDER BY archivedAt DESC`,
            [userId],
        );
        return this.attachTags(rows);
    }

    /** 归档待办：写 archivedAt + 刷新 lastActivityAt；幂等 */
    async archive(
        userId: string,
        todoId: string,
        now: Date = new Date(),
    ): Promise<Todo | null> {
        const archivedAt = toShanghaiISO(now);
        const lastActivityAt = toShanghaiISO(now);
        const result = await this.db.run(
            `UPDATE todos
             SET archivedAt = ?, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ? AND userId = ?`,
            [archivedAt, lastActivityAt, todoId, userId],
        );
        if ((result?.changes ?? 0) === 0) return null;
        return this.getById(userId, todoId);
    }

    /** 恢复待办：archivedAt 置空 + 刷新 lastActivityAt；幂等 */
    async restore(
        userId: string,
        todoId: string,
        now: Date = new Date(),
    ): Promise<Todo | null> {
        const lastActivityAt = toShanghaiISO(now);
        const result = await this.db.run(
            `UPDATE todos
             SET archivedAt = NULL, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ? AND userId = ?`,
            [lastActivityAt, todoId, userId],
        );
        if ((result?.changes ?? 0) === 0) return null;
        return this.getById(userId, todoId);
    }

    /**
     * 永久删除已归档待办。
     * - 不存在或非本人 → false（由调用方映射 404）
     * - 存在但未归档 → 抛 ArchiveNotArchivedError（409）
     */
    async deleteArchived(
        userId: string,
        todoId: string,
    ): Promise<boolean> {
        const row: { id: string; archivedAt: string | null } | undefined =
            await this.db.get(
                `SELECT id, archivedAt FROM todos WHERE id = ? AND userId = ?`,
                [todoId, userId],
            );
        if (!row) return false;
        if (row.archivedAt == null) {
            throw new ArchiveNotArchivedError(
                `Todo ${todoId} is not archived, permanent delete rejected`,
            );
        }
        const result = await this.db.run(
            `DELETE FROM todos WHERE id = ? AND userId = ?`,
            [todoId, userId],
        );
        const ok = (result?.changes ?? 0) > 0;
        if (ok && this.addUserLog) {
            await this.addUserLog(
                userId,
                "todo_deleted",
                `Permanently deleted archived todo ${todoId}`,
                { todoId },
            );
        }
        return ok;
    }
}
