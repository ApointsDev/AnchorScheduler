function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// 课程时间表API响应类型

// 通用类型定义

// Recurrence rule shape used by recurrence generator and APIs

export var scheduleTypeValues = ["single", "recurring_daily", "recurring_weekly", "recurring_weekly_by_week_number", "recurring_daily_on_days"];
var recurrenceFreqValues = ["daily", "weekly", "weeklyByWeekNumber", "dailyOnDays"];
var scheduleTypeByFreq = {
  daily: "recurring_daily",
  weekly: "recurring_weekly",
  weeklyByWeekNumber: "recurring_weekly_by_week_number",
  dailyOnDays: "recurring_daily_on_days"
};
export function isScheduleType(value) {
  return typeof value === "string" && scheduleTypeValues.includes(value);
}
export function parseRecurrenceRuleInput(rule) {
  if (!rule) return undefined;
  var candidate = rule;
  if (typeof rule === "string") {
    try {
      candidate = JSON.parse(rule);
    } catch (_unused) {
      return undefined;
    }
  }
  if (_typeof(candidate) !== "object" || candidate === null) return undefined;
  var maybeRule = candidate;
  if (!maybeRule.freq || !recurrenceFreqValues.includes(maybeRule.freq)) return undefined;
  return maybeRule;
}
export function resolveScheduleType(options) {
  var explicit = options.explicit,
    recurrence = options.recurrence,
    _options$fallback = options.fallback,
    fallback = _options$fallback === void 0 ? "single" : _options$fallback;
  var parsedRecurrence = parseRecurrenceRuleInput(recurrence);
  if (recurrence !== undefined && recurrence !== null && !parsedRecurrence) {
    throw new Error("Invalid recurrenceRule value");
  }
  if (explicit !== undefined && explicit !== null) {
    if (!isScheduleType(explicit)) {
      throw new Error("Invalid scheduleType value");
    }
    return {
      scheduleType: explicit,
      parsedRecurrence: parsedRecurrence
    };
  }
  if (parsedRecurrence) {
    var mapped = scheduleTypeByFreq[parsedRecurrence.freq];
    if (mapped) {
      return {
        scheduleType: mapped,
        parsedRecurrence: parsedRecurrence
      };
    }
  }
  return {
    scheduleType: fallback,
    parsedRecurrence: parsedRecurrence
  };
}