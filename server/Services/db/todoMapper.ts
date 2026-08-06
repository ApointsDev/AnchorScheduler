// 待办 / 标签行映射
import type { Tag, Todo } from "../../types/models";
import { normalizeImportance } from "./taskMapper";

export function mapRowToTag(row: any): Tag {
    return {
        id: row.id,
        name: row.name,
        color: row.color || undefined,
        archivedAt: row.archivedAt || undefined,
        lastActivityAt: row.lastActivityAt || undefined,
        createdAt: row.createdAt || undefined,
        updatedAt: row.updatedAt || undefined,
    };
}

function mapAxisScore(value: unknown): number | null | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return undefined;
    return n;
}

export function mapRowToTodo(row: any, tags: Tag[] = []): Todo {
    return {
        id: row.id,
        name: row.name,
        description: row.description || undefined,
        completed: row.completed === 1 || row.completed === true,
        dueDate: row.dueDate || undefined,
        importance: normalizeImportance(row.importance),
        importanceScore: mapAxisScore(row.importanceScore),
        urgencyScore: mapAxisScore(row.urgencyScore),
        tags,
        completedAt: row.completedAt || undefined,
        archivedAt: row.archivedAt || undefined,
        lastActivityAt: row.lastActivityAt || undefined,
        createdAt: row.createdAt || undefined,
        updatedAt: row.updatedAt || undefined,
    };
}

export { normalizeImportance };
