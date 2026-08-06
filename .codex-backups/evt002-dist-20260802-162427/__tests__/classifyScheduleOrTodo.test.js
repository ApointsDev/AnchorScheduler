import { hasTime, normalizeTimeFields, classifyScheduleOrTodo, validateToolTimeAlignment, toTodoCreateInput, validateToolCallsTimeAlignment } from "../Services/classifyScheduleOrTodo.js";
describe("hasTime", function () {
  it("rejects empty and invalid", function () {
    expect(hasTime(undefined)).toBe(false);
    expect(hasTime(null)).toBe(false);
    expect(hasTime("")).toBe(false);
    expect(hasTime("   ")).toBe(false);
    expect(hasTime("not-a-date")).toBe(false);
  });
  it("accepts ISO strings and numbers", function () {
    expect(hasTime("2026-07-20T10:00:00+08:00")).toBe(true);
    expect(hasTime(Date.now())).toBe(true);
  });
});
describe("classifyScheduleOrTodo", function () {
  it("start+end → schedule", function () {
    expect(classifyScheduleOrTodo({
      startTime: "2026-07-20T10:00:00+08:00",
      endTime: "2026-07-20T11:00:00+08:00"
    })).toBe("schedule");
  });
  it("start only → schedule", function () {
    expect(classifyScheduleOrTodo({
      startTime: "2026-07-20T10:00:00+08:00"
    })).toBe("schedule");
  });
  it("end only → todo", function () {
    expect(classifyScheduleOrTodo({
      endTime: "2026-07-20T23:59:00+08:00"
    })).toBe("todo");
  });
  it("neither → todo", function () {
    expect(classifyScheduleOrTodo({
      name: "买牛奶"
    })).toBe("todo");
  });
  it("dueDate alias only → todo", function () {
    expect(classifyScheduleOrTodo({
      dueDate: "2026-07-20T23:59:00+08:00"
    })).toBe("todo");
  });
  it("blank startTime treated as missing", function () {
    expect(classifyScheduleOrTodo({
      startTime: "  ",
      endTime: "2026-07-20T23:59:00+08:00"
    })).toBe("todo");
  });
});
describe("validateToolTimeAlignment", function () {
  var start = "2026-07-20T10:00:00+08:00";
  var end = "2026-07-20T18:00:00+08:00";
  it("add_schedule + start → ok", function () {
    var r = validateToolTimeAlignment("add_schedule", {
      name: "会",
      startTime: start
    });
    expect(r.ok).toBe(true);
    expect(r.expectedKind).toBe("schedule");
  });
  it("add_schedule + end only → fail", function () {
    var r = validateToolTimeAlignment("add_schedule", {
      name: "交报告",
      endTime: end
    });
    expect(r.ok).toBe(false);
    expect(r.expectedKind).toBe("todo");
    expect(r.message).toContain("add_todo");
  });
  it("add_schedule + neither → fail", function () {
    var r = validateToolTimeAlignment("add_schedule", {
      name: "买牛奶"
    });
    expect(r.ok).toBe(false);
    expect(r.expectedKind).toBe("todo");
  });
  it("add_todo + no start → ok", function () {
    var r = validateToolTimeAlignment("add_todo", {
      name: "交报告",
      endTime: end
    });
    expect(r.ok).toBe(true);
    expect(r.expectedKind).toBe("todo");
  });
  it("add_todo + start → fail", function () {
    var r = validateToolTimeAlignment("add_todo", {
      name: "会",
      startTime: start
    });
    expect(r.ok).toBe(false);
    expect(r.expectedKind).toBe("schedule");
    expect(r.message).toContain("add_schedule");
  });
});
describe("toTodoCreateInput", function () {
  it("maps endTime to dueDate", function () {
    var r = toTodoCreateInput({
      name: "报告",
      endTime: "2026-07-20T23:59:00+08:00",
      importance: "high"
    });
    expect(r.name).toBe("报告");
    expect(r.dueDate).toBe("2026-07-20T23:59:00+08:00");
    expect(r.importance).toBe("high");
  });
  it("maps dueDate alias", function () {
    var r = toTodoCreateInput({
      name: "报告",
      dueDate: "2026-07-21T12:00:00+08:00"
    });
    expect(r.dueDate).toBe("2026-07-21T12:00:00+08:00");
  });
});
describe("normalizeTimeFields aliases", function () {
  it("merges startDate / deadline", function () {
    var n = normalizeTimeFields({
      startDate: "2026-07-20T09:00:00+08:00",
      deadline: "2026-07-20T17:00:00+08:00"
    });
    expect(n.startTime).toBe("2026-07-20T09:00:00+08:00");
    expect(n.endTime).toBe("2026-07-20T17:00:00+08:00");
  });
});
describe("validateToolCallsTimeAlignment", function () {
  it("skips log_info", function () {
    var r = validateToolCallsTimeAlignment([{
      "function": {
        name: "log_info",
        arguments: JSON.stringify({
          summary: "hi"
        })
      }
    }]);
    expect(r.ok).toBe(true);
  });
  it("detects mismatch in batch", function () {
    var r = validateToolCallsTimeAlignment([{
      "function": {
        name: "add_schedule",
        arguments: JSON.stringify({
          name: "x"
        })
      }
    }]);
    expect(r.ok).toBe(false);
  });
});