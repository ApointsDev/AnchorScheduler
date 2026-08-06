function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(r) { var n = this.s["return"]; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, "throw": function _throw(r) { var n = this.s["return"]; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
import { logger } from "../Utils/logger.js";
import OpenAI from "openai";
import { getOpenAITools } from "./mcp.js";
import { MCPToolNames } from "../Services/mcpTypes.js";
import { toShanghaiISO } from "../Utils/time.js";
import { isScheduleType, resolveScheduleType, scheduleTypeValues } from "./types.js";
import { validateToolCallsTimeAlignment } from "./classifyScheduleOrTodo.js";

/** processEmail 返回结构 */

// 定义邮件处理请求和响应接口

/** 校验失败后最多再请求 LLM 的次数 */
var TOOL_TIME_VALIDATION_MAX_RETRIES = 3;
export var LLMApi = /*#__PURE__*/function () {
  function LLMApi(apiKey) {
    var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "deepseek-chat";
    var autoSchedulePromotions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    _classCallCheck(this, LLMApi);
    this.openai = new OpenAI({
      baseURL: process.env.API_BASE_URL,
      apiKey: apiKey
    });
    this.model = model;
    this.autoSchedulePromotions = autoSchedulePromotions;
    logger.success("OpenAI API \u5BA2\u6237\u7AEF\u521D\u59CB\u5316\u6210\u529F\uFF0C\u4F7F\u7528\u6A21\u578B: ".concat(model));
  }
  return _createClass(LLMApi, [{
    key: "buildEmailProcessingTools",
    value: function buildEmailProcessingTools() {
      var mcpTools = getOpenAITools();
      return [].concat(_toConsumableArray(mcpTools.filter(function (t) {
        switch (t["function"].name) {
          case MCPToolNames.AddSchedule:
          case MCPToolNames.AddTodo:
            return true;
          default:
            return false;
        }
      })), [{
        type: "function",
        "function": {
          name: "log_info",
          description: "Log information from email that is purely informational and does not require a schedule or todo.",
          parameters: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: "Summary of the information"
              },
              importance: {
                type: "string",
                "enum": ["high", "medium", "low"],
                description: "Importance level"
              }
            },
            required: ["summary"]
          }
        }
      }]);
    }
  }, {
    key: "buildEmailSystemPrompt",
    value: function buildEmailSystemPrompt() {
      var promotionHint = this.autoSchedulePromotions ? "- 推广、广告、营销类邮件也应当提取其中的时间信息，按下方规则选择 add_schedule 或 add_todo。" : "- 推广、广告、营销、竞赛报名等不需要用户个人行动的信息通知类邮件，请使用 'log_info'，不要创建日程或待办。";
      return "\u4F60\u662F\u4E00\u4E2A\u4ECE\u90AE\u4EF6\u4E2D\u63D0\u53D6\u300C\u65E5\u7A0B\u300D\u4E0E\u300C\u5F85\u529E\u300D\u7684\u4E13\u4E1A\u90AE\u4EF6\u5206\u6790\u52A9\u624B\u3002\u73B0\u5728\u662F ".concat(toShanghaiISO(), "\u3002\n\u8BF7\u5206\u6790\u90AE\u4EF6\u5185\u5BB9\uFF0C\u5E76\u8C03\u7528\u9002\u5F53\u7684\u5DE5\u5177\u6765\u5904\u7406\u3002\n\n\u3010\u7C7B\u578B\u89C4\u5219 \u2014 \u5FC5\u987B\u4E25\u683C\u9075\u5B88\u3011\n- \u6709\u5F00\u59CB\u65F6\u95F4(startTime)\u7684\u4E8B\u9879\uFF08\u4F1A\u8BAE\u3001\u9884\u7EA6\u3001\u65F6\u6BB5\u6D3B\u52A8\u7B49\uFF09\u2192 \u8C03\u7528 add_schedule\u3002\n  \xB7 \u53EF\u6709\u53EF\u65E0 endTime\uFF1B\u4E0D\u8981\u5728\u6CA1\u6709\u5F00\u59CB\u65F6\u95F4\u65F6\u4F2A\u9020 startTime\u3002\n  \xB7 \u5FC5\u987B\u63D0\u4F9B name\uFF1BscheduleType \u53EA\u80FD\u662F: ").concat(scheduleTypeValues.join(" | "), "\u3002\n  \xB7 \u65E0\u91CD\u590D\u89C4\u5219\u65F6 scheduleType \u4E3A single\uFF1B\u6709 recurrenceRule \u65F6\u6309\u5176 freq \u9009\u62E9\u5339\u914D\u7684 scheduleType\u3002\n- \u53EA\u6709\u7ED3\u675F\u65F6\u95F4/\u622A\u6B62\u65E5\u671F\u3001\u6CA1\u6709\u5F00\u59CB\u65F6\u95F4 \u2192 \u8C03\u7528 add_todo\uFF0C\u628A\u622A\u6B62\u65F6\u95F4\u5199\u5165 dueDate\uFF08\u4E0D\u8981\u5199 startTime\uFF09\u3002\n- \u6CA1\u6709\u4EFB\u4F55\u65F6\u95F4\u4FE1\u606F\u3001\u4F46\u4ECD\u9700\u7528\u6237\u884C\u52A8\u7684\u4E8B\u9879 \u2192 \u8C03\u7528 add_todo\uFF08\u53EF\u4E0D\u586B dueDate\uFF09\u3002\n- \u7EAF\u4FE1\u606F\u901A\u77E5\u3001\u65E0\u9700\u884C\u52A8 \u2192 \u8C03\u7528 log_info\u3002\n").concat(promotionHint, "\n- \u7981\u6B62\uFF1A\u4EC5\u4E3A\u4F7F\u7528 add_schedule \u800C\u628A due date \u540C\u65F6\u586B\u6210 startTime \u4E0E endTime\u3002\n- \u65F6\u95F4\u683C\u5F0F\u4E3A ISO 8601\uFF0C\u4E2D\u56FD\u4E0A\u6D77\u65F6\u533A\u3002\u4F8B\u5982: 2023-03-15T10:00:00+08:00\u3002\n\n\u3010\u56DB\u8C61\u9650\u4F18\u5148\u7EA7 \u2014 \u6DFB\u52A0\u65E5\u7A0B/\u5F85\u529E\u65F6\u52A1\u5FC5\u586B\u5199\u3011\n- importanceScore\uFF08\u91CD\u8981\u7A0B\u5EA6\uFF09\uFF1A\u6D6E\u70B9\u6570 -1~1\u3002\u8D8A\u63A5\u8FD1 1 \u8D8A\u91CD\u8981\uFF0C\u8D8A\u63A5\u8FD1 -1 \u8D8A\u4E0D\u91CD\u8981\u3002\n- urgencyScore\uFF08\u7D27\u6025\u7A0B\u5EA6\uFF09\uFF1A\u6D6E\u70B9\u6570 -1~1\u3002\u8D8A\u63A5\u8FD1 1 \u8D8A\u7D27\u6025\uFF08\u4E34\u8FD1\u622A\u6B62/\u9700\u7ACB\u5373\u5904\u7406\uFF09\uFF0C\u8D8A\u63A5\u8FD1 -1 \u8D8A\u4E0D\u7D27\u6025\u3002\n- \u540C\u65F6\u53EF\u586B importance \u679A\u4E3E high|normal|low \u4F5C\u4E3A\u7C97\u7C92\u5EA6\u63D0\u793A\uFF1B\u53CC\u8F74\u5206\u6570\u5E94\u4E0E\u5185\u5BB9\u4E00\u81F4\u3002\n- \u793A\u4F8B\uFF1A\u8003\u8BD5/ddl \u4E34\u8FD1 \u2192 importanceScore\u22480.8, urgencyScore\u22480.9\uFF1B\u957F\u671F\u89C4\u5212 \u2192 importanceScore\u22480.6, urgencyScore\u2248-0.3\uFF1B\u7410\u4E8B \u2192 \u4E24\u8005\u5747\u4E3A\u8D1F\u3002");
    }

    /**
     * 处理邮件内容，通过 OpenAI API 分析邮件
     * 工具/时间不一致时最多重试 3 轮；仍失败则 validationFailed，不静默改类型
     */
  }, {
    key: "processEmail",
    value: (function () {
      var _processEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(email) {
        var prompt, tools, messages, response, message, toolCall, toolCalls, aligned, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              logger.exchange("\u4F7F\u7528 LLM \u5904\u7406\u90AE\u4EF6: ".concat(email.subject));
              prompt = this.generateEmailProcessingPrompt(email);
              tools = this.buildEmailProcessingTools();
              messages = [{
                role: "system",
                content: this.buildEmailSystemPrompt()
              }, {
                role: "user",
                content: prompt
              }];
              logger.data("[LLM Request] Messages: ".concat(JSON.stringify(messages, null, 2)));
              _context.n = 1;
              return this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: tools,
                tool_choice: "required",
                temperature: 0.3
              });
            case 1:
              response = _context.v;
              logger.data("[LLM Response]: ".concat(JSON.stringify(response, null, 2)));
              message = response.choices[0].message;
              if (!(message.tool_calls && message.tool_calls.length > 0)) {
                _context.n = 4;
                break;
              }
              toolCall = message.tool_calls[0];
              logger.success("\u90AE\u4EF6\u5904\u7406\u6210\u529F\uFF0C\u89E6\u53D1\u5DE5\u5177\u8C03\u7528: ".concat(toolCall["function"].name));
              _context.n = 2;
              return this.ensureValidScheduleType(email, message.tool_calls);
            case 2:
              toolCalls = _context.v;
              _context.n = 3;
              return this.ensureValidToolTimeAlignment(email, toolCalls);
            case 3:
              aligned = _context.v;
              return _context.a(2, aligned);
            case 4:
              logger.warn("OpenAI API \u672A\u89E6\u53D1\u4EFB\u4F55\u5DE5\u5177\u8C03\u7528\uFF0C\u8FD4\u56DE\u9ED8\u8BA4\u4FE1\u606F");
              return _context.a(2, {
                tool_calls: [{
                  id: "default",
                  type: "function",
                  "function": {
                    name: "log_info",
                    arguments: JSON.stringify({
                      summary: "无法识别邮件类型或不需要操作",
                      importance: "low"
                    })
                  }
                }]
              });
            case 5:
              _context.p = 5;
              _t = _context.v;
              logger.error("OpenAI API \u8C03\u7528\u5931\u8D25: ".concat(_t.message || "未知错误"));
              return _context.a(2, {
                tool_calls: [{
                  id: "error",
                  type: "function",
                  "function": {
                    name: "log_info",
                    arguments: JSON.stringify({
                      summary: "邮件分析失败",
                      importance: "medium"
                    })
                  }
                }]
              });
          }
        }, _callee, this, [[0, 5]]);
      }));
      function processEmail(_x) {
        return _processEmail.apply(this, arguments);
      }
      return processEmail;
    }())
  }, {
    key: "parseToolArgs",
    value: function parseToolArgs(raw) {
      if (!raw) return null;
      try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch (e) {
        return null;
      }
    }
  }, {
    key: "ensureValidScheduleType",
    value: function () {
      var _ensureValidScheduleType = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(email, toolCalls) {
        var _call$function, _repaired$tool_calls;
        var addScheduleIndex, call, parsed, scheduleType, hasValid, repaired, repairedCall, _repairedCall$functio, repairedArgs, fallbackType;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              addScheduleIndex = toolCalls.findIndex(function (tc) {
                var _tc$function;
                return (tc === null || tc === void 0 || (_tc$function = tc["function"]) === null || _tc$function === void 0 ? void 0 : _tc$function.name) === MCPToolNames.AddSchedule;
              });
              if (!(addScheduleIndex === -1)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, toolCalls);
            case 1:
              call = toolCalls[addScheduleIndex];
              parsed = this.parseToolArgs(call === null || call === void 0 || (_call$function = call["function"]) === null || _call$function === void 0 ? void 0 : _call$function.arguments);
              if (parsed) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, toolCalls);
            case 2:
              scheduleType = parsed.scheduleType;
              hasValid = isScheduleType(scheduleType);
              if (!hasValid) {
                _context2.n = 3;
                break;
              }
              return _context2.a(2, toolCalls);
            case 3:
              logger.warn("LLM returned invalid or missing scheduleType, retrying once. value=".concat(scheduleType));
              _context2.n = 4;
              return this.retryScheduleType(email, parsed);
            case 4:
              repaired = _context2.v;
              repairedCall = repaired === null || repaired === void 0 || (_repaired$tool_calls = repaired.tool_calls) === null || _repaired$tool_calls === void 0 ? void 0 : _repaired$tool_calls.find(function (tc) {
                var _tc$function2;
                return (tc === null || tc === void 0 || (_tc$function2 = tc["function"]) === null || _tc$function2 === void 0 ? void 0 : _tc$function2.name) === MCPToolNames.AddSchedule;
              });
              if (!repairedCall) {
                _context2.n = 5;
                break;
              }
              repairedArgs = this.parseToolArgs(repairedCall === null || repairedCall === void 0 || (_repairedCall$functio = repairedCall["function"]) === null || _repairedCall$functio === void 0 ? void 0 : _repairedCall$functio.arguments);
              if (!(repairedArgs && isScheduleType(repairedArgs.scheduleType))) {
                _context2.n = 5;
                break;
              }
              toolCalls[addScheduleIndex] = repairedCall;
              return _context2.a(2, toolCalls);
            case 5:
              fallbackType = this.getFallbackScheduleType(parsed);
              parsed.scheduleType = fallbackType;
              call["function"].arguments = JSON.stringify(parsed);
              logger.warn("ScheduleType auto-corrected to ".concat(fallbackType, " after retry failure."));
              return _context2.a(2, toolCalls);
          }
        }, _callee2, this);
      }));
      function ensureValidScheduleType(_x2, _x3) {
        return _ensureValidScheduleType.apply(this, arguments);
      }
      return ensureValidScheduleType;
    }()
  }, {
    key: "getFallbackScheduleType",
    value: function getFallbackScheduleType(args) {
      try {
        return resolveScheduleType({
          explicit: undefined,
          recurrence: args === null || args === void 0 ? void 0 : args.recurrenceRule,
          fallback: "single"
        }).scheduleType;
      } catch (e) {
        return "single";
      }
    }
  }, {
    key: "retryScheduleType",
    value: function () {
      var _retryScheduleType = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(email, previousArgs) {
        var tools, messages, response;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              tools = _toConsumableArray(getOpenAITools().filter(function (t) {
                var _t$function;
                return ((_t$function = t["function"]) === null || _t$function === void 0 ? void 0 : _t$function.name) === MCPToolNames.AddSchedule;
              }));
              messages = [{
                role: "system",
                content: "\u4F60\u662F\u4E00\u4E2A\u65E5\u7A0B\u62BD\u53D6\u52A9\u624B\u3002\u4F60\u5FC5\u987B\u8C03\u7528 add_schedule\u3002\n- \u53EA\u5141\u8BB8\u7684 scheduleType \u503C: ".concat(scheduleTypeValues.join(" | "), "\u3002\n- \u4EC5\u4FEE\u6B63 scheduleType\uFF0C\u4FDD\u6301\u5176\u5B83\u5B57\u6BB5\u4E0E\u63D0\u4F9B\u7684\u503C\u4E00\u81F4\u3002")
              }, {
                role: "user",
                content: "\u90AE\u4EF6\u5185\u5BB9\u5982\u4E0B\uFF0C\u8BF7\u4EC5\u4FEE\u6B63 scheduleType\uFF1A\n".concat(this.generateEmailProcessingPrompt(email), "\n\n\u5DF2\u63D0\u53D6\u7684\u53C2\u6570\uFF1A").concat(JSON.stringify(previousArgs))
              }];
              _context3.n = 1;
              return this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: tools,
                tool_choice: "required",
                temperature: 0.2
              });
            case 1:
              response = _context3.v;
              return _context3.a(2, response.choices[0].message);
          }
        }, _callee3, this);
      }));
      function retryScheduleType(_x4, _x5) {
        return _retryScheduleType.apply(this, arguments);
      }
      return retryScheduleType;
    }()
    /**
     * 校验 add_schedule / add_todo 与时间字段是否一致。
     * 失败则带错误反馈最多重试 3 轮；仍失败则 validationFailed，不静默改类型。
     */
  }, {
    key: "ensureValidToolTimeAlignment",
    value: (function () {
      var _ensureValidToolTimeAlignment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(email, toolCalls) {
        var current, lastError, attempt, check, _repaired$tool_calls2, repaired, _t2;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              current = toolCalls;
              lastError = "";
              attempt = 0;
            case 1:
              if (!(attempt <= TOOL_TIME_VALIDATION_MAX_RETRIES)) {
                _context4.n = 11;
                break;
              }
              check = validateToolCallsTimeAlignment(current);
              if (!check.ok) {
                _context4.n = 2;
                break;
              }
              if (attempt > 0) {
                logger.success("\u5DE5\u5177/\u65F6\u95F4\u6821\u9A8C\u5728\u7B2C ".concat(attempt, " \u6B21\u91CD\u8BD5\u540E\u901A\u8FC7: ").concat(email.subject));
              }
              return _context4.a(2, {
                tool_calls: current
              });
            case 2:
              lastError = check.message || "工具与时间字段不匹配";
              if (!(attempt === TOOL_TIME_VALIDATION_MAX_RETRIES)) {
                _context4.n = 3;
                break;
              }
              return _context4.a(3, 11);
            case 3:
              logger.warn("\u5DE5\u5177/\u65F6\u95F4\u6821\u9A8C\u5931\u8D25 (attempt ".concat(attempt + 1, "/").concat(TOOL_TIME_VALIDATION_MAX_RETRIES, "): ").concat(lastError));
              _context4.p = 4;
              _context4.n = 5;
              return this.retryToolTimeAlignment(email, current, lastError);
            case 5:
              repaired = _context4.v;
              if (!(repaired !== null && repaired !== void 0 && (_repaired$tool_calls2 = repaired.tool_calls) !== null && _repaired$tool_calls2 !== void 0 && _repaired$tool_calls2.length)) {
                _context4.n = 7;
                break;
              }
              _context4.n = 6;
              return this.ensureValidScheduleType(email, repaired.tool_calls);
            case 6:
              current = _context4.v;
              _context4.n = 8;
              break;
            case 7:
              logger.warn("工具/时间校验重试未返回 tool_calls");
            case 8:
              _context4.n = 10;
              break;
            case 9:
              _context4.p = 9;
              _t2 = _context4.v;
              logger.error("\u5DE5\u5177/\u65F6\u95F4\u6821\u9A8C\u91CD\u8BD5\u8C03\u7528\u5931\u8D25: ".concat((_t2 === null || _t2 === void 0 ? void 0 : _t2.message) || _t2));
            case 10:
              attempt++;
              _context4.n = 1;
              break;
            case 11:
              logger.error("\u5DE5\u5177/\u65F6\u95F4\u6821\u9A8C ".concat(TOOL_TIME_VALIDATION_MAX_RETRIES, " \u8F6E\u91CD\u8BD5\u540E\u4ECD\u5931\u8D25: subject=").concat(email.subject, " error=").concat(lastError, " lastToolCalls=").concat(JSON.stringify(current)));
              return _context4.a(2, {
                tool_calls: [],
                validationFailed: true,
                lastValidationError: lastError,
                lastToolCalls: current
              });
          }
        }, _callee4, this, [[4, 9]]);
      }));
      function ensureValidToolTimeAlignment(_x6, _x7) {
        return _ensureValidToolTimeAlignment.apply(this, arguments);
      }
      return ensureValidToolTimeAlignment;
    }())
  }, {
    key: "retryToolTimeAlignment",
    value: function () {
      var _retryToolTimeAlignment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(email, previousToolCalls, validationError) {
        var _this = this;
        var tools, prevSummary, messages, response;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              tools = this.buildEmailProcessingTools();
              prevSummary = (previousToolCalls || []).map(function (tc) {
                var _tc$function3, _tc$function4;
                return {
                  name: tc === null || tc === void 0 || (_tc$function3 = tc["function"]) === null || _tc$function3 === void 0 ? void 0 : _tc$function3.name,
                  arguments: _this.parseToolArgs(tc === null || tc === void 0 || (_tc$function4 = tc["function"]) === null || _tc$function4 === void 0 ? void 0 : _tc$function4.arguments)
                };
              });
              messages = [{
                role: "system",
                content: "".concat(this.buildEmailSystemPrompt(), "\n\n\u3010\u4FEE\u6B63\u4EFB\u52A1\u3011\u4E0A\u4E00\u8F6E\u5DE5\u5177\u8C03\u7528\u672A\u901A\u8FC7\u65F6\u95F4\u6821\u9A8C\uFF0C\u4F60\u5FC5\u987B\u91CD\u65B0\u8C03\u7528\u6B63\u786E\u5DE5\u5177\u3002\n- \u6709 startTime \u2192 \u53EA\u80FD add_schedule\n- \u65E0 startTime\uFF08\u4EC5\u6709 dueDate/endTime \u6216\u90FD\u6CA1\u6709\uFF09\u2192 \u53EA\u80FD add_todo\n- \u4E0D\u8981\u4F2A\u9020 startTime\uFF1B\u4E0D\u8981\u9759\u9ED8\u628A\u7C7B\u578B\u6539\u5199\u540E\u5047\u88C5\u4E00\u81F4\n- \u7EAF\u901A\u77E5\u7528 log_info")
              }, {
                role: "user",
                content: "\u90AE\u4EF6\uFF1A\n".concat(this.generateEmailProcessingPrompt(email), "\n\n\u4E0A\u4E00\u8F6E\u5DE5\u5177\u8C03\u7528\uFF1A\n").concat(JSON.stringify(prevSummary, null, 2), "\n\n\u6821\u9A8C\u9519\u8BEF\uFF1A\n").concat(validationError, "\n\n\u8BF7\u6839\u636E\u89C4\u5219\u91CD\u65B0\u8C03\u7528\u6B63\u786E\u7684\u5DE5\u5177\u3002")
              }];
              _context5.n = 1;
              return this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: tools,
                tool_choice: "required",
                temperature: 0.2
              });
            case 1:
              response = _context5.v;
              return _context5.a(2, response.choices[0].message);
          }
        }, _callee5, this);
      }));
      function retryToolTimeAlignment(_x8, _x9, _x0) {
        return _retryToolTimeAlignment.apply(this, arguments);
      }
      return retryToolTimeAlignment;
    }()
    /**
     * 生成邮件处理提示词
     */
  }, {
    key: "generateEmailProcessingPrompt",
    value: function generateEmailProcessingPrompt(email) {
      var _email$from, _email$from2;
      // 简单的HTML清理，确保LLM能更好地理解内容
      var emailContent = email.body || "";
      // 移除script/style/head块
      emailContent = emailContent.replace(/<(script|style|head)\b[\s\S]*?<\/\1>/gi, "");
      // 移除标签
      emailContent = emailContent.replace(/<[^>]+>/g, " ");
      // 压缩空白
      emailContent = emailContent.replace(/\s+/g, " ").trim();
      var emailSubject = email.subject || "";
      var from = ((_email$from = email.from) === null || _email$from === void 0 ? void 0 : _email$from.name) || ((_email$from2 = email.from) === null || _email$from2 === void 0 ? void 0 : _email$from2.address) || "未知发件人";
      return "\u53D1\u4EF6\u4EBA: ".concat(from, "\n\u4E3B\u9898: ").concat(emailSubject, "\n\u5185\u5BB9: ").concat(emailContent, "\n\n\u8BF7\u5206\u6790\u4E0A\u8FF0\u90AE\u4EF6\u5E76\u8C03\u7528\u76F8\u5E94\u7684\u5DE5\u5177\u3002");
    }
  }, {
    key: "chatStream",
    value: function () {
      var _chatStream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(messages, tools, onData) {
        var stream, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, _chunk$choices$, delta, data, _t3, _t4;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              logger.data("[LLM Stream Request] Messages: ".concat(JSON.stringify(messages, null, 2)));
              _context6.n = 1;
              return this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: tools,
                stream: true,
                temperature: 0.7
              });
            case 1:
              stream = _context6.v;
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context6.p = 2;
              _iterator = _asyncIterator(stream);
            case 3:
              _context6.n = 4;
              return _iterator.next();
            case 4:
              if (!(_iteratorAbruptCompletion = !(_step = _context6.v).done)) {
                _context6.n = 6;
                break;
              }
              chunk = _step.value;
              delta = (_chunk$choices$ = chunk.choices[0]) === null || _chunk$choices$ === void 0 ? void 0 : _chunk$choices$.delta;
              if (delta) {
                data = {};
                if (delta.content) data.content = delta.content;
                if (delta.tool_calls) data.tool_calls = delta.tool_calls;
                if (Object.keys(data).length > 0) {
                  onData(data);
                }
              }
            case 5:
              _iteratorAbruptCompletion = false;
              _context6.n = 3;
              break;
            case 6:
              _context6.n = 8;
              break;
            case 7:
              _context6.p = 7;
              _t3 = _context6.v;
              _didIteratorError = true;
              _iteratorError = _t3;
            case 8:
              _context6.p = 8;
              _context6.p = 9;
              if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                _context6.n = 10;
                break;
              }
              _context6.n = 10;
              return _iterator["return"]();
            case 10:
              _context6.p = 10;
              if (!_didIteratorError) {
                _context6.n = 11;
                break;
              }
              throw _iteratorError;
            case 11:
              return _context6.f(10);
            case 12:
              return _context6.f(8);
            case 13:
              _context6.n = 15;
              break;
            case 14:
              _context6.p = 14;
              _t4 = _context6.v;
              logger.error("OpenAI API \u6D41\u5F0F\u8C03\u7528\u5931\u8D25: ".concat(_t4.message || "未知错误"));
              throw _t4;
            case 15:
              return _context6.a(2);
          }
        }, _callee6, this, [[9,, 10, 12], [2, 7, 8, 13], [0, 14]]);
      }));
      function chatStream(_x1, _x10, _x11) {
        return _chatStream.apply(this, arguments);
      }
      return chatStream;
    }() /** 通用非流式聊天接口 */
  }, {
    key: "chat",
    value: (function () {
      var _chat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(messages, options) {
        var _options$temperature, _response$choices$, response, content, _t5;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              logger.data("[LLM Request] Messages: ".concat(JSON.stringify(messages, null, 2)));
              _context7.n = 1;
              return this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: options === null || options === void 0 ? void 0 : options.tools,
                temperature: (_options$temperature = options === null || options === void 0 ? void 0 : options.temperature) !== null && _options$temperature !== void 0 ? _options$temperature : 0.3
              });
            case 1:
              response = _context7.v;
              content = ((_response$choices$ = response.choices[0]) === null || _response$choices$ === void 0 || (_response$choices$ = _response$choices$.message) === null || _response$choices$ === void 0 ? void 0 : _response$choices$.content) || "";
              logger.data("[LLM Response]: ".concat(content));
              return _context7.a(2, content);
            case 2:
              _context7.p = 2;
              _t5 = _context7.v;
              logger.error("OpenAI API \u8C03\u7528\u5931\u8D25: ".concat(_t5.message || "未知错误"));
              throw _t5;
            case 3:
              return _context7.a(2);
          }
        }, _callee7, this, [[0, 2]]);
      }));
      function chat(_x12, _x13) {
        return _chat.apply(this, arguments);
      }
      return chat;
    }())
  }]);
}();