// 待办 / 标签行映射

import { normalizeImportance } from "./taskMapper.js";
export function mapRowToTag(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color || undefined,
    createdAt: row.createdAt || undefined,
    updatedAt: row.updatedAt || undefined
  };
}
function mapAxisScore(value) {
  if (value === undefined || value === null || value === "") return undefined;
  var n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return undefined;
  return n;
}
export function mapRowToTodo(row) {
  var tags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    completed: row.completed === 1 || row.completed === true,
    dueDate: row.dueDate || undefined,
    importance: normalizeImportance(row.importance),
    importanceScore: mapAxisScore(row.importanceScore),
    urgencyScore: mapAxisScore(row.urgencyScore),
    tags: tags,
    createdAt: row.createdAt || undefined,
    updatedAt: row.updatedAt || undefined
  };
}
export { normalizeImportance };