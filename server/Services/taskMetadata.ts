import type { Task } from "../types/models";

const MAX_REMINDER_MINUTES = 366 * 24 * 60;
const ANCHOR_SUFFIX = /(?:\r?\n)?\[Anchor\s+([^\]]+)\]\s*$/u;
const EMPTY_REMINDERS = new Set(["", "无", "none", "不提醒", "无提醒"]);

export type TaskMetadataFields = Pick<
  Task,
  | "eventType"
  | "category"
  | "allDay"
  | "isReminderOn"
  | "reminderMinutesBefore"
  | "attachments"
  | "allocatedMinutes"
>;

const MIN_ALLOCATED_MINUTES = 5;
const MAX_ALLOCATED_MINUTES = 366 * 24 * 60;

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function optionalText(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
}

export function normalizeReminderMinutes(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const minutes = Number(value);
  if (
    !Number.isFinite(minutes) ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes > MAX_REMINDER_MINUTES
  ) {
    throw new TypeError(
      `reminderMinutesBefore must be an integer between 0 and ${MAX_REMINDER_MINUTES}`
    );
  }
  return minutes;
}

export function normalizeAttachments(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new TypeError("attachments must be an array of strings");
  }
  const attachments = value
    .map(optionalText)
    .filter((item): item is string => !!item);
  if (attachments.length > 50) {
    throw new TypeError("attachments cannot contain more than 50 items");
  }
  return Array.from(new Set(attachments));
}

export function normalizeAllocatedMinutes(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const minutes = Number(value);
  if (
    !Number.isFinite(minutes) ||
    !Number.isInteger(minutes) ||
    minutes < MIN_ALLOCATED_MINUTES ||
    minutes > MAX_ALLOCATED_MINUTES
  ) {
    throw new TypeError(
      `allocatedMinutes must be an integer between ${MIN_ALLOCATED_MINUTES} and ${MAX_ALLOCATED_MINUTES}`
    );
  }
  return minutes;
}

/**
 * Normalizes the structured schedule fields at the API/store boundary.
 * The reminder lead is canonical; reminderAt is derived when data is read.
 */
export function resolveTaskMetadata(
  input: Record<string, unknown>,
  fallback?: Partial<TaskMetadataFields>
): TaskMetadataFields {
  const eventTypeValue = hasOwn(input, "eventType")
    ? input.eventType
    : fallback?.eventType;
  if (
    eventTypeValue !== undefined &&
    eventTypeValue !== "schedule" &&
    eventTypeValue !== "todo"
  ) {
    throw new TypeError("eventType must be schedule or todo");
  }

  const minutesProvided = hasOwn(input, "reminderMinutesBefore");
  const reminderEnabledProvided = hasOwn(input, "isReminderOn");
  let reminderMinutesBefore = minutesProvided
    ? normalizeReminderMinutes(input.reminderMinutesBefore)
    : fallback?.reminderMinutesBefore ?? null;
  let isReminderOn = reminderEnabledProvided
    ? input.isReminderOn === true
    : fallback?.isReminderOn ?? false;
  if (reminderEnabledProvided && typeof input.isReminderOn !== "boolean") {
    throw new TypeError("isReminderOn must be a boolean");
  }
  if (minutesProvided && reminderMinutesBefore !== null) isReminderOn = true;
  if (!isReminderOn) reminderMinutesBefore = null;
  if (isReminderOn && reminderMinutesBefore === null) {
    reminderMinutesBefore = 0;
  }

  return {
    eventType: (eventTypeValue as Task["eventType"]) || "schedule",
    category: hasOwn(input, "category")
      ? optionalText(input.category)
      : fallback?.category,
    allDay: hasOwn(input, "allDay")
      ? input.allDay === true
      : fallback?.allDay ?? false,
    isReminderOn,
    reminderMinutesBefore,
    attachments: hasOwn(input, "attachments")
      ? normalizeAttachments(input.attachments)
      : fallback?.attachments ?? [],
    allocatedMinutes: hasOwn(input, "allocatedMinutes")
      ? normalizeAllocatedMinutes(input.allocatedMinutes)
      : fallback?.allocatedMinutes ?? null,
  };
}

export function calculateReminderAt(
  startTime: string | undefined,
  isReminderOn: boolean | undefined,
  reminderMinutesBefore: number | null | undefined
): string | null {
  if (
    !isReminderOn ||
    reminderMinutesBefore === null ||
    reminderMinutesBefore === undefined
  ) {
    return null;
  }
  const start = Date.parse(startTime || "");
  if (!Number.isFinite(start)) return null;
  return new Date(start - reminderMinutesBefore * 60_000).toISOString();
}

function reminderMinutesFromLegacy(
  reminder: string | undefined,
  startTime: string | undefined
): number | null {
  const normalized = reminder?.trim().toLocaleLowerCase() || "";
  if (EMPTY_REMINDERS.has(normalized)) return null;
  if (["开始时", "准时", "at start"].includes(normalized)) return 0;

  const minuteMatch = normalized.match(
    /^(?:提前)?(\d+)\s*(?:分钟|min(?:ute)?s?)?(?:前)?$/u
  );
  if (minuteMatch) return Number(minuteMatch[1]);
  const hourMatch = normalized.match(
    /^(?:提前)?(\d+)\s*(?:小时|hours?)(?:前)?$/u
  );
  if (hourMatch) return Number(hourMatch[1]) * 60;

  const reminderAt = Date.parse(reminder || "");
  const start = Date.parse(startTime || "");
  if (
    Number.isFinite(reminderAt) &&
    Number.isFinite(start) &&
    reminderAt <= start
  ) {
    return Math.round((start - reminderAt) / 60_000);
  }
  return null;
}

/** Converts the old description suffix once during migration. */
export function parseLegacyTaskMetadata(
  description: string | null | undefined,
  startTime?: string
): { description: string; metadata: TaskMetadataFields } | null {
  const source = description || "";
  const match = source.match(ANCHOR_SUFFIX);
  if (!match) return null;
  const segments = match[1]
    .split("|")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const value = (prefix: string) =>
    segments
      .find((segment) => segment.startsWith(prefix))
      ?.slice(prefix.length)
      .trim();
  const reminder = value("提醒:");
  const reminderMinutesBefore = reminderMinutesFromLegacy(reminder, startTime);
  const eventType = value("类型:") === "todo" ? "todo" : "schedule";
  const categoryValue = value("分类:");
  const attachmentValue = value("附件:");
  return {
    description: source.slice(0, match.index).trim(),
    metadata: {
      eventType,
      category:
        categoryValue &&
        !["默认", "default"].includes(categoryValue.toLocaleLowerCase())
          ? categoryValue
          : undefined,
      allDay: segments.includes("全天事件"),
      isReminderOn: reminderMinutesBefore !== null,
      reminderMinutesBefore,
      attachments: attachmentValue
        ? attachmentValue
            .split("、")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    },
  };
}
