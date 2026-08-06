import {
    hasTime,
    normalizeTimeFields,
    classifyScheduleOrTodo,
    validateToolTimeAlignment,
    toTodoCreateInput,
    validateToolCallsTimeAlignment,
} from "../Services/classifyScheduleOrTodo";

describe("hasTime", () => {
    it("rejects empty and invalid", () => {
        expect(hasTime(undefined)).toBe(false);
        expect(hasTime(null)).toBe(false);
        expect(hasTime("")).toBe(false);
        expect(hasTime("   ")).toBe(false);
        expect(hasTime("not-a-date")).toBe(false);
    });

    it("accepts ISO strings and numbers", () => {
        expect(hasTime("2026-07-20T10:00:00+08:00")).toBe(true);
        expect(hasTime(Date.now())).toBe(true);
    });
});

describe("classifyScheduleOrTodo", () => {
    it("start+end → schedule", () => {
        expect(
            classifyScheduleOrTodo({
                startTime: "2026-07-20T10:00:00+08:00",
                endTime: "2026-07-20T11:00:00+08:00",
            }),
        ).toBe("schedule");
    });

    it("start only → schedule", () => {
        expect(
            classifyScheduleOrTodo({
                startTime: "2026-07-20T10:00:00+08:00",
            }),
        ).toBe("schedule");
    });

    it("end only → todo", () => {
        expect(
            classifyScheduleOrTodo({
                endTime: "2026-07-20T23:59:00+08:00",
            }),
        ).toBe("todo");
    });

    it("neither → todo", () => {
        expect(classifyScheduleOrTodo({ name: "买牛奶" })).toBe("todo");
    });

    it("dueDate alias only → todo", () => {
        expect(
            classifyScheduleOrTodo({
                dueDate: "2026-07-20T23:59:00+08:00",
            }),
        ).toBe("todo");
    });

    it("blank startTime treated as missing", () => {
        expect(
            classifyScheduleOrTodo({
                startTime: "  ",
                endTime: "2026-07-20T23:59:00+08:00",
            }),
        ).toBe("todo");
    });
});

describe("validateToolTimeAlignment", () => {
    const start = "2026-07-20T10:00:00+08:00";
    const end = "2026-07-20T18:00:00+08:00";

    it("add_schedule + start → ok", () => {
        const r = validateToolTimeAlignment("add_schedule", {
            name: "会",
            startTime: start,
        });
        expect(r.ok).toBe(true);
        expect(r.expectedKind).toBe("schedule");
    });

    it("add_schedule + end only → fail", () => {
        const r = validateToolTimeAlignment("add_schedule", {
            name: "交报告",
            endTime: end,
        });
        expect(r.ok).toBe(false);
        expect(r.expectedKind).toBe("todo");
        expect((r as { message?: string }).message).toContain("add_todo");
    });

    it("add_schedule + neither → fail", () => {
        const r = validateToolTimeAlignment("add_schedule", { name: "买牛奶" });
        expect(r.ok).toBe(false);
        expect(r.expectedKind).toBe("todo");
    });

    it("add_todo + no start → ok", () => {
        const r = validateToolTimeAlignment("add_todo", {
            name: "交报告",
            endTime: end,
        });
        expect(r.ok).toBe(true);
        expect(r.expectedKind).toBe("todo");
    });

    it("add_todo + start → fail", () => {
        const r = validateToolTimeAlignment("add_todo", {
            name: "会",
            startTime: start,
        });
        expect(r.ok).toBe(false);
        expect(r.expectedKind).toBe("schedule");
        expect((r as { message?: string }).message).toContain("add_schedule");
    });
});

describe("toTodoCreateInput", () => {
    it("maps endTime to dueDate", () => {
        const r = toTodoCreateInput({
            name: "报告",
            endTime: "2026-07-20T23:59:00+08:00",
            importance: "high",
        });
        expect(r.name).toBe("报告");
        expect(r.dueDate).toBe("2026-07-20T23:59:00+08:00");
        expect(r.importance).toBe("high");
    });

    it("maps dueDate alias", () => {
        const r = toTodoCreateInput({
            name: "报告",
            dueDate: "2026-07-21T12:00:00+08:00",
        });
        expect(r.dueDate).toBe("2026-07-21T12:00:00+08:00");
    });
});

describe("normalizeTimeFields aliases", () => {
    it("merges startDate / deadline", () => {
        const n = normalizeTimeFields({
            startDate: "2026-07-20T09:00:00+08:00",
            deadline: "2026-07-20T17:00:00+08:00",
        });
        expect(n.startTime).toBe("2026-07-20T09:00:00+08:00");
        expect(n.endTime).toBe("2026-07-20T17:00:00+08:00");
    });
});

describe("validateToolCallsTimeAlignment", () => {
    it("skips log_info", () => {
        const r = validateToolCallsTimeAlignment([
            {
                function: {
                    name: "log_info",
                    arguments: JSON.stringify({ summary: "hi" }),
                },
            },
        ]);
        expect(r.ok).toBe(true);
    });

    it("detects mismatch in batch", () => {
        const r = validateToolCallsTimeAlignment([
            {
                function: {
                    name: "add_schedule",
                    arguments: JSON.stringify({ name: "x" }),
                },
            },
        ]);
        expect(r.ok).toBe(false);
    });
});
