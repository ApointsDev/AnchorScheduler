// 日程审批队列参数规范化 — 供 scheduleQueueRoutes 与 daService（DA 队列审批）复用
import {
    parseRecurrenceRuleInput,
    resolveScheduleType,
} from "./types.js";

/** 将队列 rawRequest 中的 args 规范化为 add_schedule 可用的输入 */
export function normalizeQueueScheduleArgs(input: any) {
    const args = { ...(input || {}) } as any;

    if (!args.name && args.title) args.name = args.title;
    if (!args.description && args.body) args.description = args.body;
    if (!args.location && args.place) args.location = args.place;

    const normalizeTimeValue = (value: any) => {
        if (!value) return value;
        if (typeof value === "string") return value;
        if (typeof value === "number") return new Date(value).toISOString();
        if (typeof value === "object") {
            if (typeof value.dateTime === "string") return value.dateTime;
            if (typeof value.start === "string") return value.start;
        }
        return value;
    };

    if (args.startTime && typeof args.startTime !== "string") {
        args.startTime = normalizeTimeValue(args.startTime);
    }
    if (args.endTime && typeof args.endTime !== "string") {
        args.endTime = normalizeTimeValue(args.endTime);
    }
    if (!args.startTime && (args.start || args.startDate)) {
        args.startTime = normalizeTimeValue(args.start ?? args.startDate);
    }
    if (!args.endTime && (args.end || args.endDate)) {
        args.endTime = normalizeTimeValue(args.end ?? args.endDate);
    }

    if (args.recurrence !== undefined && args.recurrenceRule === undefined) {
        args.recurrenceRule = args.recurrence;
        delete args.recurrence;
    }

    if (args.recurrenceRule !== undefined) {
        const parsedRecurrence = parseRecurrenceRuleInput(
            args.recurrenceRule,
        );
        if (parsedRecurrence) {
            args.recurrenceRule = parsedRecurrence;
        } else {
            delete args.recurrenceRule;
        }
    }

    try {
        const resolved = resolveScheduleType({
            explicit: args.scheduleType,
            recurrence: args.recurrenceRule,
            fallback: "single",
        });
        args.scheduleType = resolved.scheduleType;
        if (resolved.parsedRecurrence)
            args.recurrenceRule = resolved.parsedRecurrence;
    } catch (e) {
        const parsedRecurrence = parseRecurrenceRuleInput(
            args.recurrenceRule,
        );
        if (parsedRecurrence) {
            args.recurrenceRule = parsedRecurrence;
        } else {
            delete args.recurrenceRule;
        }
        const resolved = resolveScheduleType({
            explicit: undefined,
            recurrence: args.recurrenceRule,
            fallback: "single",
        });
        args.scheduleType = resolved.scheduleType;
    }

    return args;
}

/** 从队列行解析 args（容错 JSON.parse） */
export function parseQueueArgs(row: any): any {
    const raw = row?.rawRequest;
    let parsed: any = null;
    try {
        parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
        parsed = null;
    }
    return parsed?.args || parsed || {};
}
