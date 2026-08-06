function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// 日程 vs 代办：时间字段归一化、期望类型判定、工具名对齐校验
// 规则：有 startTime → schedule；仅有 end/无时间 → todo（禁止静默改写工具名）

var SCHEDULE_TOOLS = new Set(["add_schedule"]);
var TODO_TOOLS = new Set(["add_todo"]);

/** 有效时间：非空字符串且可解析为合法日期 */
export function hasTime(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "number") {
    return !Number.isNaN(value) && !Number.isNaN(new Date(value).getTime());
  }
  if (typeof value !== "string") {
    if (_typeof(value) === "object" && value !== null) {
      var o = value;
      if (typeof o.dateTime === "string") return hasTime(o.dateTime);
      if (typeof o.start === "string") return hasTime(o.start);
    }
    return false;
  }
  var s = value.trim();
  if (!s) return false;
  var t = Date.parse(s);
  return !Number.isNaN(t);
}
function coerceTimeValue(value) {
  if (!hasTime(value)) return undefined;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return new Date(value).toISOString();
  if (_typeof(value) === "object" && value !== null) {
    var o = value;
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
export function normalizeTimeFields(input) {
  var args = _objectSpread({}, input || {});
  var startTime = coerceTimeValue(args.startTime);
  if (!startTime) {
    startTime = coerceTimeValue(args.start) || coerceTimeValue(args.startDate) || undefined;
  }
  var endTime = coerceTimeValue(args.endTime);
  if (!endTime) {
    endTime = coerceTimeValue(args.end) || coerceTimeValue(args.endDate) || coerceTimeValue(args.dueDate) || coerceTimeValue(args.deadline) || undefined;
  }
  if (startTime) args.startTime = startTime;else delete args.startTime;
  if (endTime) args.endTime = endTime;else delete args.endTime;
  return {
    startTime: startTime,
    endTime: endTime,
    args: args
  };
}

/** 有 startTime → schedule；否则 → todo */
export function classifyScheduleOrTodo(input) {
  var _normalizeTimeFields = normalizeTimeFields(input),
    startTime = _normalizeTimeFields.startTime;
  return startTime ? "schedule" : "todo";
}
export function expectedToolForKind(kind) {
  return kind === "schedule" ? "add_schedule" : "add_todo";
}

/**
 * 校验工具名与时间字段是否一致。
 * log_info 等非行动工具不走此函数。
 */
export function validateToolTimeAlignment(toolName, input) {
  var normalized = normalizeTimeFields(input);
  var expectedKind = classifyScheduleOrTodo(normalized.args);
  var expectedTool = expectedToolForKind(expectedKind);
  var name = (toolName || "").trim();
  var isScheduleTool = SCHEDULE_TOOLS.has(name);
  var isTodoTool = TODO_TOOLS.has(name);
  if (!isScheduleTool && !isTodoTool) {
    return {
      ok: false,
      expectedKind: expectedKind,
      toolName: name,
      args: normalized.args,
      message: "\u672A\u77E5\u5DE5\u5177 \"".concat(name, "\"\uFF0C\u671F\u671B ").concat(expectedTool, "\uFF08").concat(expectedKind, "\uFF09")
    };
  }
  if (isScheduleTool && expectedKind === "schedule") {
    return {
      ok: true,
      expectedKind: expectedKind,
      toolName: name,
      args: normalized.args
    };
  }
  if (isTodoTool && expectedKind === "todo") {
    return {
      ok: true,
      expectedKind: expectedKind,
      toolName: name,
      args: normalized.args
    };
  }

  // 不一致
  var detail;
  if (isScheduleTool && expectedKind === "todo") {
    detail = normalized.endTime ? "无 startTime、仅有 endTime/截止日期，按规则应为代办 add_todo，禁止伪造 startTime" : "无 startTime 且无 endTime，按规则应为代办 add_todo，禁止伪造 startTime";
  } else {
    detail = "存在 startTime，按规则应为日程 add_schedule，请改用 add_schedule 并保留开始时间";
  }
  return {
    ok: false,
    expectedKind: expectedKind,
    toolName: name,
    args: normalized.args,
    message: "\u5DE5\u5177 ".concat(name, " \u4E0E\u65F6\u95F4\u5B57\u6BB5\u4E0D\u5339\u914D\uFF1A").concat(detail, "\u3002\u8BF7\u91CD\u65B0\u8C03\u7528 ").concat(expectedTool, "\u3002")
  };
}

/** 将抽取参数转为 Todo 创建输入（endTime/dueDate → dueDate） */
export function toTodoCreateInput(input) {
  var _normalizeTimeFields2 = normalizeTimeFields(input),
    endTime = _normalizeTimeFields2.endTime,
    args = _normalizeTimeFields2.args;
  var name = String(args.name || args.title || "").trim() || "未命名待办";
  var description = args.description !== undefined && args.description !== null ? String(args.description) : undefined;
  var dueDate = endTime || coerceTimeValue(args.dueDate) || undefined;
  var importance = args.importance !== undefined && args.importance !== null ? String(args.importance) : undefined;
  var parseAxis = function parseAxis(v) {
    if (v === undefined || v === null || v === "") return undefined;
    var n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n)) return undefined;
    if (n > 1) return 1;
    if (n < -1) return -1;
    return n;
  };
  var result = {
    name: name
  };
  if (description !== undefined) result.description = description;
  if (dueDate) result.dueDate = dueDate;
  if (importance) result.importance = importance;
  var importanceScore = parseAxis(args.importanceScore);
  var urgencyScore = parseAxis(args.urgencyScore);
  if (importanceScore !== undefined) result.importanceScore = importanceScore;
  if (urgencyScore !== undefined) result.urgencyScore = urgencyScore;
  if (Array.isArray(args.tagIds)) result.tagIds = args.tagIds.map(String);
  if (Array.isArray(args.tagNames)) result.tagNames = args.tagNames.map(String);
  return result;
}

/** 校验一组 tool_calls 中所有 add_schedule/add_todo；log_info 跳过 */
export function validateToolCallsTimeAlignment(toolCalls) {
  var failures = [];
  var _iterator = _createForOfIteratorHelper(toolCalls || []),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _tc$function;
      var tc = _step.value;
      var name = tc === null || tc === void 0 || (_tc$function = tc["function"]) === null || _tc$function === void 0 ? void 0 : _tc$function.name;
      if (name !== "add_schedule" && name !== "add_todo") continue;
      var args = null;
      try {
        var _tc$function2;
        var raw = tc === null || tc === void 0 || (_tc$function2 = tc["function"]) === null || _tc$function2 === void 0 ? void 0 : _tc$function2.arguments;
        args = typeof raw === "string" ? JSON.parse(raw) : raw && _typeof(raw) === "object" ? raw : {};
      } catch (_unused) {
        args = {};
      }
      var result = validateToolTimeAlignment(name, args);
      if (!result.ok) failures.push(result);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (failures.length === 0) return {
    ok: true,
    failures: failures
  };
  return {
    ok: false,
    message: failures.map(function (f) {
      return "message" in f ? f.message : "";
    }).join("\n"),
    failures: failures
  };
}