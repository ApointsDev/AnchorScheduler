// 任务行映射工具 — 消除 6 处重复的 row → Task 映射代码

import { calculateReminderAt } from "../taskMetadata.js";
export function normalizeImportance(value) {
  var normalized = typeof value === "string" ? value.toLowerCase() : "";
  if (normalized === "high" || normalized === "low" || normalized === "normal") {
    return normalized;
  }
  if (normalized === "medium") return "normal";
  return "normal";
}

/** 安全 JSON 解析 — 字符串为空或非法 JSON 时返回 undefined */
export function safeJsonParse(value) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  try {
    return JSON.parse(value);
  } catch (_unused) {
    return undefined;
  }
}
function mapAxisScore(value) {
  // DB NULL → 显式 null，避免客户端把 undefined 当成「字段缺失」而忽略更新
  if (value === undefined || value === null || value === "") return null;
  var n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}
export function mapRowToTask(row) {
  var isReminderOn = row.isReminderOn === 1 || row.isReminderOn === true;
  var reminderMinutesBefore = mapAxisScore(row.reminderMinutesBefore);
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    dueDate: row.dueDate,
    startTime: row.startTime,
    endTime: row.endTime,
    location: row.location,
    completed: row.completed === 1,
    pushedToMSTodo: row.pushedToMSTodo === 1,
    body: row.body,
    attendees: safeJsonParse(row.attendees),
    recurrenceRule: row.recurrenceRule || undefined,
    parentTaskId: row.parentTaskId || undefined,
    importance: normalizeImportance(row.importance),
    eventType: row.eventType === "todo" ? "todo" : "schedule",
    category: row.category || undefined,
    allDay: row.allDay === 1 || row.allDay === true,
    isReminderOn: isReminderOn,
    reminderMinutesBefore: reminderMinutesBefore,
    reminderAt: calculateReminderAt(row.startTime, isReminderOn, reminderMinutesBefore),
    attachments: safeJsonParse(row.attachments) || [],
    scheduleType: row.scheduleType || "single",
    quadrant: row.quadrant || undefined,
    importanceScore: mapAxisScore(row.importanceScore),
    urgencyScore: mapAxisScore(row.urgencyScore),
    completedAt: row.completedAt || undefined,
    createdAt: row.createdAt || undefined,
    updatedAt: row.updatedAt || undefined,
    visibility: row.visibility || "private",
    authorizedUserIds: safeJsonParse(row.authorizedUserIds) || undefined,
    blockedUserIds: safeJsonParse(row.blockedUserIds) || undefined
  };
}