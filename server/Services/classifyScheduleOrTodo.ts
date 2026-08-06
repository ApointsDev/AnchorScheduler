// 日程 vs 代办：时间字段归一化、期望类型判定、工具名对齐校验
// 规则：有 startTime → schedule；仅有 end/无时间 → todo（禁止静默改写工具名）

export type TaskKind = "schedule" | "todo";

export interface NormalizedTimeFields {
    startTime?: string;
    endTime?: string;
    /** 归一化后的完整 args（含别名合并后的时间字段） */
    args: Record<string, unknown>;
}

export type ToolTimeValidationResult =
    | { ok: true; expectedKind: TaskKind; toolName: string; args: Record<string, unknown> }
    | {
          ok: false;
          expectedKind: TaskKind;
          toolName: string;
          args: Record<string, unknown>;
          message: string;
      };

const SCHEDULE_TOOLS = new Set(["add_schedule"]);
const TODO_TOOLS = new Set(["add_todo"]);

/** 有效时间：非空字符串且可解析为合法日期 */
export function hasTime(value: unknown): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === "number") {
        return !Number.isNaN(value) && !Number.isNaN(new Date(value).getTime());
    }
    if (typeof value !== "string") {
        if (typeof value === "object" && value !== null) {
            const o = value as Record<string, unknown>;
            if (typeof o.dateTime === "string") return hasTime(o.dateTime);
            if (typeof o.start === "string") return hasTime(o.start);
        }
        return false;
    }
    const s = value.trim();
    if (!s) return false;
    const t = Date.parse(s);
    return !Number.isNaN(t);
}

function coerceTimeValue(value: unknown): string | undefined {
    if (!hasTime(value)) return undefined;
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return new Date(value).toISOString();
    if (typeof value === "object" && value !== null) {
        const o = value as Record<string, unknown>;
        if (typeof o.dateTime === "string" && hasTime(o.dateTime)) {
            return o.dateTime.trim();
        }
        if (typeof o.start === "string" && hasTime(o.start)) {
            return o.start.trim();
        }
    }
    return undefined;
}

/**
 * 合并常见别名到 startTime / endTime。
 * end 侧兼容：endTime, end, endDate, dueDate, deadline
 */
export function normalizeTimeFields(
    input: Record<string, unknown> | null | undefined,
): NormalizedTimeFields {
    const args: Record<string, unknown> = { ...(input || {}) };

    let startTime = coerceTimeValue(args.startTime);
    if (!startTime) {
        startTime =
            coerceTimeValue(args.start) ||
            coerceTimeValue(args.startDate) ||
            undefined;
    }

    let endTime = coerceTimeValue(args.endTime);
    if (!endTime) {
        endTime =
            coerceTimeValue(args.end) ||
            coerceTimeValue(args.endDate) ||
            coerceTimeValue(args.dueDate) ||
            coerceTimeValue(args.deadline) ||
            undefined;
    }

    if (startTime) args.startTime = startTime;
    else delete args.startTime;
    if (endTime) args.endTime = endTime;
    else delete args.endTime;

    return { startTime, endTime, args };
}

/** 有 startTime → schedule；否则 → todo */
export function classifyScheduleOrTodo(
    input: Record<string, unknown> | null | undefined,
): TaskKind {
    const { startTime } = normalizeTimeFields(input);
    return startTime ? "schedule" : "todo";
}

export function expectedToolForKind(kind: TaskKind): string {
    return kind === "schedule" ? "add_schedule" : "add_todo";
}

/**
 * 校验工具名与时间字段是否一致。
 * log_info 等非行动工具不走此函数。
 */
export function validateToolTimeAlignment(
    toolName: string,
    input: Record<string, unknown> | null | undefined,
): ToolTimeValidationResult {
    const normalized = normalizeTimeFields(input);
    const expectedKind = classifyScheduleOrTodo(normalized.args);
    const expectedTool = expectedToolForKind(expectedKind);
    const name = (toolName || "").trim();

    const isScheduleTool = SCHEDULE_TOOLS.has(name);
    const isTodoTool = TODO_TOOLS.has(name);

    if (!isScheduleTool && !isTodoTool) {
        return {
            ok: false,
            expectedKind,
            toolName: name,
            args: normalized.args,
            message: `未知工具 "${name}"，期望 ${expectedTool}（${expectedKind}）`,
        };
    }

    if (isScheduleTool && expectedKind === "schedule") {
        return {
            ok: true,
            expectedKind,
            toolName: name,
            args: normalized.args,
        };
    }
    if (isTodoTool && expectedKind === "todo") {
        return {
            ok: true,
            expectedKind,
            toolName: name,
            args: normalized.args,
        };
    }

    // 不一致
    let detail: string;
    if (isScheduleTool && expectedKind === "todo") {
        detail = normalized.endTime
            ? "无 startTime、仅有 endTime/截止日期，按规则应为代办 add_todo，禁止伪造 startTime"
            : "无 startTime 且无 endTime，按规则应为代办 add_todo，禁止伪造 startTime";
    } else {
        detail =
            "存在 startTime，按规则应为日程 add_schedule，请改用 add_schedule 并保留开始时间";
    }

    return {
        ok: false,
        expectedKind,
        toolName: name,
        args: normalized.args,
        message: `工具 ${name} 与时间字段不匹配：${detail}。请重新调用 ${expectedTool}。`,
    };
}

/** 将抽取参数转为 Todo 创建输入（endTime/dueDate → dueDate） */
export function toTodoCreateInput(input: Record<string, unknown> | null | undefined): {
    name: string;
    description?: string;
    dueDate?: string;
    importance?: string;
    importanceScore?: number;
    urgencyScore?: number;
    tagIds?: string[];
    tagNames?: string[];
} {
    const { endTime, args } = normalizeTimeFields(input);
    const name = String(args.name || args.title || "").trim() || "未命名待办";
    const description =
        args.description !== undefined && args.description !== null
            ? String(args.description)
            : undefined;
    const dueDate =
        endTime ||
        coerceTimeValue(args.dueDate) ||
        undefined;
    const importance =
        args.importance !== undefined && args.importance !== null
            ? String(args.importance)
            : undefined;

    const parseAxis = (v: unknown): number | undefined => {
        if (v === undefined || v === null || v === "") return undefined;
        const n = typeof v === "number" ? v : Number(v);
        if (!Number.isFinite(n)) return undefined;
        if (n > 1) return 1;
        if (n < -1) return -1;
        return n;
    };

    const result: {
        name: string;
        description?: string;
        dueDate?: string;
        importance?: string;
        importanceScore?: number;
        urgencyScore?: number;
        tagIds?: string[];
        tagNames?: string[];
    } = { name };

    if (description !== undefined) result.description = description;
    if (dueDate) result.dueDate = dueDate;
    if (importance) result.importance = importance;
    const importanceScore = parseAxis(args.importanceScore);
    const urgencyScore = parseAxis(args.urgencyScore);
    if (importanceScore !== undefined) result.importanceScore = importanceScore;
    if (urgencyScore !== undefined) result.urgencyScore = urgencyScore;
    if (Array.isArray(args.tagIds)) result.tagIds = args.tagIds.map(String);
    if (Array.isArray(args.tagNames)) result.tagNames = args.tagNames.map(String);

    return result;
}

/** 校验一组 tool_calls 中所有 add_schedule/add_todo；log_info 跳过 */
export function validateToolCallsTimeAlignment(toolCalls: any[]): {
    ok: boolean;
    message?: string;
    failures: ToolTimeValidationResult[];
} {
    const failures: ToolTimeValidationResult[] = [];
    for (const tc of toolCalls || []) {
        const name = tc?.function?.name;
        if (name !== "add_schedule" && name !== "add_todo") continue;
        let args: Record<string, unknown> | null = null;
        try {
            const raw = tc?.function?.arguments;
            args =
                typeof raw === "string"
                    ? JSON.parse(raw)
                    : raw && typeof raw === "object"
                      ? raw
                      : {};
        } catch {
            args = {};
        }
        const result = validateToolTimeAlignment(name, args);
        if (!result.ok) failures.push(result);
    }
    if (failures.length === 0) return { ok: true, failures };
    return {
        ok: false,
        message: failures.map((f) => ("message" in f ? f.message : "")).join("\n"),
        failures,
    };
}
