// 任务行映射工具 — 消除 6 处重复的 row → Task 映射代码
import type { Task } from "../../index";
import { calculateReminderAt } from "../taskMetadata.js";

export function normalizeImportance(value?: string): "high" | "normal" | "low" {
  const normalized = typeof value === "string" ? value.toLowerCase() : "";
  if (
    normalized === "high" ||
    normalized === "low" ||
    normalized === "normal"
  ) {
    return normalized as "high" | "normal" | "low";
  }
  if (normalized === "medium") return "normal";
  return "normal";
}

/** 安全 JSON 解析 — 字符串为空或非法 JSON 时返回 undefined */
export function safeJsonParse(value: unknown): unknown {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function mapAxisScore(value: unknown): number | null {
  // DB NULL → 显式 null，避免客户端把 undefined 当成「字段缺失」而忽略更新
  if (value === undefined || value === null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function mapRowToTask(row: any): Task {
  const isReminderOn = row.isReminderOn === 1 || row.isReminderOn === true;
  const reminderMinutesBefore = mapAxisScore(row.reminderMinutesBefore);
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    description: row.description,
    dueDate: row.dueDate,
    startTime: row.startTime,
    endTime: row.endTime,
    location: row.location,
    completed: row.completed === 1,
    pushedToMSTodo: row.pushedToMSTodo === 1,
    body: row.body,
    attendees: safeJsonParse(row.attendees) as string[] | undefined,
    recurrenceRule: row.recurrenceRule || undefined,
    parentTaskId: row.parentTaskId || undefined,
    importance: normalizeImportance(row.importance),
    eventType: row.eventType === "todo" ? "todo" : "schedule",
    category: row.category || undefined,
    allDay: row.allDay === 1 || row.allDay === true,
    isReminderOn,
    reminderMinutesBefore,
    reminderAt: calculateReminderAt(
      row.startTime,
      isReminderOn,
      reminderMinutesBefore
    ),
    attachments: (safeJsonParse(row.attachments) as string[]) || [],
    allocatedMinutes:
      row.allocatedMinutes === null || row.allocatedMinutes === undefined
        ? undefined
        : Number(row.allocatedMinutes),
    scheduleType: row.scheduleType || "single",
    quadrant: row.quadrant || undefined,
    importanceScore: mapAxisScore(row.importanceScore),
    urgencyScore: mapAxisScore(row.urgencyScore),
    completedAt: row.completedAt || undefined,
    archivedAt: row.archivedAt || undefined,
    lastActivityAt: row.lastActivityAt || undefined,
    createdAt: row.createdAt || undefined,
    updatedAt: row.updatedAt || undefined,
    visibility: row.visibility || "private",
    authorizedUserIds:
      (safeJsonParse(row.authorizedUserIds) as string[]) || undefined,
    blockedUserIds:
      (safeJsonParse(row.blockedUserIds) as string[]) || undefined,
  };
}
