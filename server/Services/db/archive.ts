// 归档服务（ARC-001）— 统一归档 / 恢复 / 永久删除 / 归档列表 / 自动归档
// 数据访问委托给各 Store，此处负责 resource 派发与组合响应
import type { Database } from "sqlite";
import type { Task, Todo, Tag } from "../../types/models";
import { toShanghaiISO } from "../../Utils/time.js";
import type { TaskStore } from "./tasks";
import type { TodoStore } from "./todos";
import type { TagStore } from "./tags";
import {
    assertArchiveResource,
    ArchiveNotFoundError,
} from "./archiveErrors.js";

export type ArchiveResource = "tasks" | "todos" | "tags";

export interface ArchiveList {
    /** 三个字段必须都存在（可为空数组），移动端 ArchiveScreen 按 archive[kind] 取值 */
    tasks: Task[];
    todos: Todo[];
    tags: Tag[];
}

/**
 * 归档操作器：返回 null 表示「不存在或非本人」
 */
type ArchiveOperator<T> = (
    userId: string,
    id: string,
    now?: Date,
) => Promise<T | null>;

export class ArchiveStore {
    constructor(
        private db: Database,
        private tasks: TaskStore,
        private todos: TodoStore,
        private tags: TagStore,
    ) {}

    private archiveOp(resource: string): ArchiveOperator<Task | Todo | Tag> {
        switch (assertArchiveResource(resource)) {
            case "tasks":
                return this.tasks.archive.bind(this.tasks);
            case "todos":
                return this.todos.archive.bind(this.todos);
            case "tags":
                return this.tags.archive.bind(this.tags);
        }
    }

    private restoreOp(resource: string): ArchiveOperator<Task | Todo | Tag> {
        switch (assertArchiveResource(resource)) {
            case "tasks":
                return this.tasks.restore.bind(this.tasks);
            case "todos":
                return this.todos.restore.bind(this.todos);
            case "tags":
                return this.tags.restore.bind(this.tags);
        }
    }

    private deleteOp(resource: string) {
        switch (assertArchiveResource(resource)) {
            case "tasks":
                return this.tasks.deleteArchived.bind(this.tasks);
            case "todos":
                return this.todos.deleteArchived.bind(this.todos);
            case "tags":
                return this.tags.deleteArchived.bind(this.tags);
        }
    }

    /** 当前用户所有已归档内容（日程 / 待办 / 分组） */
    async listArchived(userId: string): Promise<ArchiveList> {
        const [tasks, todos, tags] = await Promise.all([
            this.tasks.listArchived(userId),
            this.todos.listArchived(userId),
            this.tags.listArchived(userId),
        ]);
        return { tasks, todos, tags };
    }

    /** 归档指定内容；不存在或非本人抛 ArchiveNotFoundError */
    async archive(
        resource: string,
        id: string,
        userId: string,
        now: Date = new Date(),
    ): Promise<Task | Todo | Tag> {
        const op = this.archiveOp(resource);
        const item = await op(userId, id, now);
        if (!item) {
            throw new ArchiveNotFoundError(
                `${resource}/${id} not found or not owned`,
            );
        }
        return item;
    }

    /** 恢复指定内容；不存在或非本人抛 ArchiveNotFoundError */
    async restore(
        resource: string,
        id: string,
        userId: string,
        now: Date = new Date(),
    ): Promise<Task | Todo | Tag> {
        const op = this.restoreOp(resource);
        const item = await op(userId, id, now);
        if (!item) {
            throw new ArchiveNotFoundError(
                `${resource}/${id} not found or not owned`,
            );
        }
        return item;
    }

    /**
     * 永久删除一条已归档内容。
     * - 不存在或非本人 → ArchiveNotFoundError（404）
     * - 存在但未归档 → ArchiveNotArchivedError（409）
     */
    async deleteArchived(
        resource: string,
        id: string,
        userId: string,
    ): Promise<boolean> {
        const op = this.deleteOp(resource);
        const ok = await op(userId, id);
        if (!ok) {
            throw new ArchiveNotFoundError(
                `${resource}/${id} not found or not owned`,
            );
        }
        return ok;
    }

    /**
     * 自动归档：扫描 tags，对连续 thresholdMonths 个自然月 lastActivityAt
     * 无更新的非官方分组执行归档。
     * @param now 可注入时钟（测试用）
     * @param thresholdMonths 默认 6（连续六个自然月）
     * @returns 本次归档的分组数量
     */
    async autoArchiveTags(
        now: Date = new Date(),
        thresholdMonths: number = 6,
    ): Promise<number> {
        // 截止时间 = 当前月份往前推 thresholdMonths 个月的月初
        const cutoff = toShanghaiISO(
            new Date(
                now.getFullYear(),
                now.getMonth() - thresholdMonths,
                1,
                0,
                0,
                0,
            ),
        );
        const rows: { id: string }[] = await this.db.all(
            `SELECT id FROM tags
             WHERE archivedAt IS NULL
               AND (
                    lastActivityAt IS NULL
                    OR lastActivityAt < ?
               )`,
            [cutoff],
        );
        if (rows.length === 0) return 0;
        const archivedAt = toShanghaiISO(now);
        let count = 0;
        for (const row of rows) {
            const result = await this.db.run(
                `UPDATE tags
                 SET archivedAt = ?, lastActivityAt = ?
                 WHERE id = ? AND archivedAt IS NULL`,
                [archivedAt, archivedAt, row.id],
            );
            if ((result?.changes ?? 0) > 0) count += 1;
        }
        return count;
    }
}
