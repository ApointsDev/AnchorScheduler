function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// 通用邮箱邮件处理模块
// 提供 LLM 解析邮件 → 日程/待办入队的统一管道，供 IMAP/Exchange/任意邮箱客户端复用

import { LLMApi } from "./LLMApi.js";
import { dbService } from "./dbService.js";
import { logUserEvent } from "./userLog.js";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import { toTodoCreateInput, validateToolTimeAlignment } from "./classifyScheduleOrTodo.js";
import { MCPToolNames } from "./mcpTypes.js";

/** 邮件数据的通用最小接口，IMAP/Exchange/其他客户端统一传入 */

function buildEmailPayload(email, source) {
  var _email$attachmentsCou;
  return {
    id: email.id,
    subject: email.subject,
    from: email.from,
    receivedAt: email.receivedAt,
    isRead: email.isRead,
    body: email.body || "",
    hasAttachments: !!email.hasAttachments,
    attachmentsCount: (_email$attachmentsCou = email.attachmentsCount) !== null && _email$attachmentsCou !== void 0 ? _email$attachmentsCou : 0
  };
}

/**
 * 将已通过校验的工具调用写入对应队列（严格按工具名，不静默迁移）
 */
export function enqueueValidatedToolCalls(_x, _x2, _x3, _x4) {
  return _enqueueValidatedToolCalls.apply(this, arguments);
}

/**
 * 通用邮件处理管道：
 * 1. 调用 LLM 解析邮件
 * 2. 工具/时间校验（失败重试由 LLMApi 完成，最多 3 轮）
 * 3. 按工具名分别入日程/待办队列
 */
function _enqueueValidatedToolCalls() {
  _enqueueValidatedToolCalls = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(user, email, source, toolCalls) {
    var queuedSchedules, queueIds, queuedTodos, todoQueueIds, safeEmail, _iterator, _step, _function, _function2, toolCall, funcName, funcArgs, toolArgs, check, payload, queueId, todoInput, _payload, _queueId, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          queuedSchedules = [];
          queueIds = [];
          queuedTodos = [];
          todoQueueIds = [];
          safeEmail = buildEmailPayload(email, source);
          _iterator = _createForOfIteratorHelper(toolCalls);
          _context.p = 1;
          _iterator.s();
        case 2:
          if ((_step = _iterator.n()).done) {
            _context.n = 12;
            break;
          }
          toolCall = _step.value;
          funcName = toolCall === null || toolCall === void 0 || (_function = toolCall["function"]) === null || _function === void 0 ? void 0 : _function.name;
          funcArgs = toolCall === null || toolCall === void 0 || (_function2 = toolCall["function"]) === null || _function2 === void 0 ? void 0 : _function2.arguments;
          if (!(funcName !== MCPToolNames.AddSchedule && funcName !== MCPToolNames.AddTodo)) {
            _context.n = 3;
            break;
          }
          return _context.a(3, 11);
        case 3:
          if (funcArgs) {
            _context.n = 4;
            break;
          }
          return _context.a(3, 11);
        case 4:
          toolArgs = void 0;
          try {
            toolArgs = typeof funcArgs === "string" ? JSON.parse(funcArgs) : funcArgs;
          } catch (_unused) {
            toolArgs = {};
          }

          // 入队前再校验一次（双保险）；失败则记日志并跳过，不静默迁移
          check = validateToolTimeAlignment(funcName, toolArgs);
          if (check.ok) {
            _context.n = 6;
            break;
          }
          logger.error("\u5165\u961F\u524D\u4E8C\u6B21\u6821\u9A8C\u5931\u8D25\uFF0C\u8DF3\u8FC7: tool=".concat(funcName, " subject=").concat(email.subject, " msg=").concat(check.message));
          _context.n = 5;
          return logUserEvent(user.id, "ai_email_tool_validation_failed", "\u5165\u961F\u524D\u6821\u9A8C\u5931\u8D25: ".concat(email.subject), {
            emailId: email.id,
            emailSubject: email.subject,
            source: source,
            toolName: funcName,
            message: check.message,
            args: toolArgs
          });
        case 5:
          return _context.a(3, 11);
        case 6:
          if (!(funcName === MCPToolNames.AddSchedule)) {
            _context.n = 9;
            break;
          }
          if (!toolArgs.name) toolArgs.name = email.subject || "未命名任务";
          payload = {
            args: _objectSpread(_objectSpread({}, toolArgs), {}, {
              description: toolArgs.description || "\u6765\u81EA\u90AE\u4EF6: ".concat(email.subject)
            }),
            email: safeEmail,
            _meta: {
              source: source,
              createdAt: toShanghaiISO()
            }
          };
          _context.n = 7;
          return dbService.addScheduleToQueue(user.id, JSON.stringify(payload));
        case 7:
          queueId = _context.v;
          queuedSchedules.push(toolArgs.name);
          queueIds.push(queueId);
          _context.n = 8;
          return logUserEvent(user.id, "external_schedule_request", "\u5916\u90E8\u8BF7\u6C42\u521B\u5EFA\u65E5\u7A0B: ".concat(toolArgs.name), {
            queueId: queueId,
            emailId: email.id,
            emailSubject: email.subject,
            name: toolArgs.name,
            startTime: toolArgs.startTime,
            endTime: toolArgs.endTime,
            llmResponse: toolCall
          });
        case 8:
          _context.n = 11;
          break;
        case 9:
          if (!(funcName === MCPToolNames.AddTodo)) {
            _context.n = 11;
            break;
          }
          todoInput = toTodoCreateInput(toolArgs);
          if (!todoInput.name || todoInput.name === "未命名待办") {
            todoInput.name = email.subject || "未命名待办";
          }
          if (!todoInput.description) {
            todoInput.description = "\u6765\u81EA\u90AE\u4EF6: ".concat(email.subject);
          }
          _payload = {
            args: todoInput,
            email: safeEmail,
            _meta: {
              source: source,
              createdAt: toShanghaiISO()
            }
          };
          _context.n = 10;
          return dbService.addTodoToQueue(user.id, JSON.stringify(_payload));
        case 10:
          _queueId = _context.v;
          queuedTodos.push(todoInput.name);
          todoQueueIds.push(_queueId);
          _context.n = 11;
          return logUserEvent(user.id, "external_todo_request", "\u5916\u90E8\u8BF7\u6C42\u521B\u5EFA\u5F85\u529E: ".concat(todoInput.name), {
            queueId: _queueId,
            emailId: email.id,
            emailSubject: email.subject,
            name: todoInput.name,
            dueDate: todoInput.dueDate,
            llmResponse: toolCall
          });
        case 11:
          _context.n = 2;
          break;
        case 12:
          _context.n = 14;
          break;
        case 13:
          _context.p = 13;
          _t = _context.v;
          _iterator.e(_t);
        case 14:
          _context.p = 14;
          _iterator.f();
          return _context.f(14);
        case 15:
          return _context.a(2, {
            queuedSchedules: queuedSchedules,
            queueIds: queueIds,
            queuedTodos: queuedTodos,
            todoQueueIds: todoQueueIds
          });
      }
    }, _callee, null, [[1, 13, 14, 15]]);
  }));
  return _enqueueValidatedToolCalls.apply(this, arguments);
}
export function processEmailWithLLM(_x5, _x6, _x7) {
  return _processEmailWithLLM.apply(this, arguments);
}
function _processEmailWithLLM() {
  _processEmailWithLLM = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(user, email, source) {
    var _user$autoSchedulePro;
    var result, alreadyProcessed, llmApi, _llmResponse$tool_cal, _llmResponse$tool_cal2, llmResponse, _summary, hasToolCalls, actionable, summary, enqueued, message, _t2, _t3, _t4, _t5;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          result = {
            queuedSchedules: [],
            queueIds: [],
            queuedTodos: [],
            todoQueueIds: [],
            toolCallsTriggered: false
          }; // 防止重复 AI 处理（兜底保护）
          if (!email.id) {
            _context2.n = 2;
            break;
          }
          _context2.n = 1;
          return dbService.isEmailAiProcessed(user.id, String(email.id), source);
        case 1:
          alreadyProcessed = _context2.v;
          if (!alreadyProcessed) {
            _context2.n = 2;
            break;
          }
          logger.info("\u90AE\u4EF6 ".concat(email.id, " (").concat(email.subject, ") \u5DF2 AI \u5904\u7406\u8FC7\uFF08").concat(source, "\uFF09\uFF0C\u8DF3\u8FC7"));
          return _context2.a(2, result);
        case 2:
          llmApi = new LLMApi(process.env.OPENAI_API_KEY || "", process.env.OPENAI_MODEL || "deepseek-chat", (_user$autoSchedulePro = user.autoSchedulePromotions) !== null && _user$autoSchedulePro !== void 0 ? _user$autoSchedulePro : false);
          _context2.p = 3;
          _context2.n = 4;
          return llmApi.processEmail(email);
        case 4:
          llmResponse = _context2.v;
          if (!(llmResponse !== null && llmResponse !== void 0 && llmResponse.validationFailed)) {
            _context2.n = 10;
            break;
          }
          result.validationFailed = true;
          result.lastValidationError = llmResponse.lastValidationError;
          _summary = "AI \u5904\u7406\u90AE\u4EF6 \"".concat(email.subject, "\" \u5DE5\u5177/\u65F6\u95F4\u6821\u9A8C\u5931\u8D25\uFF08\u5DF2\u91CD\u8BD5\uFF09: ").concat(llmResponse.lastValidationError || "");
          logger.error(_summary);
          _context2.n = 5;
          return logUserEvent(user.id, "ai_email_tool_validation_failed", _summary, {
            emailId: email.id,
            emailSubject: email.subject,
            emailFrom: email.from,
            emailReceivedAt: email.receivedAt,
            source: source,
            lastValidationError: llmResponse.lastValidationError,
            lastToolCalls: llmResponse.lastToolCalls,
            llmResponse: llmResponse
          });
        case 5:
          if (!email.id) {
            _context2.n = 9;
            break;
          }
          _context2.p = 6;
          _context2.n = 7;
          return dbService.markEmailAiProcessed(user.id, String(email.id), source);
        case 7:
          _context2.n = 9;
          break;
        case 8:
          _context2.p = 8;
          _t2 = _context2.v;
          logger.error("\u6807\u8BB0 AI \u5DF2\u5904\u7406\u5931\u8D25: ".concat(_t2.message || "未知错误"));
        case 9:
          return _context2.a(2, result);
        case 10:
          hasToolCalls = !!(llmResponse !== null && llmResponse !== void 0 && (_llmResponse$tool_cal = llmResponse.tool_calls) !== null && _llmResponse$tool_cal !== void 0 && _llmResponse$tool_cal.length);
          actionable = ((llmResponse === null || llmResponse === void 0 ? void 0 : llmResponse.tool_calls) || []).filter(function (tc) {
            var _tc$function, _tc$function2;
            return (tc === null || tc === void 0 || (_tc$function = tc["function"]) === null || _tc$function === void 0 ? void 0 : _tc$function.name) === MCPToolNames.AddSchedule || (tc === null || tc === void 0 || (_tc$function2 = tc["function"]) === null || _tc$function2 === void 0 ? void 0 : _tc$function2.name) === MCPToolNames.AddTodo;
          });
          summary = actionable.length > 0 ? "AI \u5904\u7406\u90AE\u4EF6 \"".concat(email.subject, "\"\uFF0C\u89E6\u53D1 ").concat(actionable.length, " \u4E2A\u53EF\u5165\u961F\u5DE5\u5177\u8C03\u7528") : "AI \u5904\u7406\u90AE\u4EF6 \"".concat(email.subject, "\"\uFF0C\u672A\u89E6\u53D1\u65E5\u7A0B/\u5F85\u529E\u521B\u5EFA");
          _context2.n = 11;
          return logUserEvent(user.id, "ai_email_processed", summary, {
            emailId: email.id,
            emailSubject: email.subject,
            emailFrom: email.from,
            emailReceivedAt: email.receivedAt,
            source: source,
            toolCallCount: (llmResponse === null || llmResponse === void 0 || (_llmResponse$tool_cal2 = llmResponse.tool_calls) === null || _llmResponse$tool_cal2 === void 0 ? void 0 : _llmResponse$tool_cal2.length) || 0,
            llmResponse: llmResponse
          });
        case 11:
          if (!(!hasToolCalls || actionable.length === 0)) {
            _context2.n = 16;
            break;
          }
          logger.info("LLM \u672A\u89E6\u53D1\u53EF\u5165\u961F\u5DE5\u5177\u8C03\u7528: ".concat(email.subject));
          if (!email.id) {
            _context2.n = 15;
            break;
          }
          _context2.p = 12;
          _context2.n = 13;
          return dbService.markEmailAiProcessed(user.id, String(email.id), source);
        case 13:
          _context2.n = 15;
          break;
        case 14:
          _context2.p = 14;
          _t3 = _context2.v;
          logger.error("\u6807\u8BB0 AI \u5DF2\u5904\u7406\u5931\u8D25: ".concat(_t3.message || "未知错误"));
        case 15:
          return _context2.a(2, result);
        case 16:
          result.toolCallsTriggered = true;
          _context2.n = 17;
          return enqueueValidatedToolCalls(user, email, source, llmResponse.tool_calls);
        case 17:
          enqueued = _context2.v;
          result.queuedSchedules = enqueued.queuedSchedules;
          result.queueIds = enqueued.queueIds;
          result.queuedTodos = enqueued.queuedTodos;
          result.todoQueueIds = enqueued.todoQueueIds;
          logger.success("\u90AE\u4EF6\u5904\u7406\u5B8C\u6210: ".concat(email.subject, ", \u5165\u961F\u65E5\u7A0B ").concat(result.queuedSchedules.length, " / \u5F85\u529E ").concat(result.queuedTodos.length));
          if (!email.id) {
            _context2.n = 21;
            break;
          }
          _context2.p = 18;
          _context2.n = 19;
          return dbService.markEmailAiProcessed(user.id, String(email.id), source);
        case 19:
          _context2.n = 21;
          break;
        case 20:
          _context2.p = 20;
          _t4 = _context2.v;
          logger.error("\u6807\u8BB0 AI \u5DF2\u5904\u7406\u5931\u8D25: ".concat(_t4.message || "未知错误"));
        case 21:
          _context2.n = 24;
          break;
        case 22:
          _context2.p = 22;
          _t5 = _context2.v;
          message = _t5 instanceof Error ? _t5.message : String(_t5);
          logger.error("\u90AE\u4EF6 LLM \u5904\u7406\u5931\u8D25: ".concat(message));
          _context2.n = 23;
          return logUserEvent(user.id, "ai_email_failed", "AI \u5904\u7406\u90AE\u4EF6\u5931\u8D25: ".concat(email.subject), {
            emailId: email.id,
            emailSubject: email.subject,
            emailFrom: email.from,
            source: source,
            error: message
          });
        case 23:
          throw _t5;
        case 24:
          return _context2.a(2, result);
      }
    }, _callee2, null, [[18, 20], [12, 14], [6, 8], [3, 22]]);
  }));
  return _processEmailWithLLM.apply(this, arguments);
}