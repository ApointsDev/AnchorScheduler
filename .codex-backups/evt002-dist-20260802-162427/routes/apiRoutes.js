function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO, getRawWeekNumber, getAcademicYearConfig } from "../Utils/time.js";
import { dbService } from "../Services/dbService.js";
import { mcpTools } from "../Services/mcp.js";
import { findConflictingTasks } from "../Services/scheduleConflict.js";
import { generateRecurrenceInstances, buildRecurrenceSummary } from "../Services/recurrence.js";
import { parseRecurrenceRuleInput, resolveScheduleType } from "../Services/types.js";
import { broadcastTaskChange } from "../Services/websocket.js";
import { logUserEvent } from "../Services/userLog.js";
import { LLMApi } from "../Services/LLMApi.js";
import { syncUserTimetable } from "../Services/timetable.js";
import { CalDavProvider } from "../Services/calendar/CalDavProvider.js";
import { CalendarSyncService } from "../Services/calendar/CalendarSyncService.js";
import { processEmailWithLLM } from "../Services/emailProcessor.js";
import { clampAxisScore, parsePriorityAxesBody, quadrantFromAxes, resolvePriorityAxes } from "../Services/priorityAxes.js";
import { resolveTaskMetadata } from "../Services/taskMetadata.js";

/** 个人签名最大长度 */
var SIGNATURE_MAX_LENGTH = 200;
var AVATAR_MIME_EXT = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp"
};
var avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  // 2MB
  fileFilter: function fileFilter(_req, file, cb) {
    if (AVATAR_MIME_EXT[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error("\u4E0D\u652F\u6301\u7684\u5934\u50CF\u7C7B\u578B: ".concat(file.mimetype, "\u3002\u652F\u6301 JPEG/PNG/GIF/WebP")));
    }
  }
});
function getAvatarUploadDir() {
  return path.join(process.cwd(), "private", "uploads", "avatars");
}
function ensureAvatarDir() {
  var dir = getAvatarUploadDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    });
  }
}

/** 删除本站上传的旧头像文件（仅 /uploads/avatars/ 下） */
function tryRemoveLocalAvatar(avatarPath) {
  if (!avatarPath || typeof avatarPath !== "string") return;
  if (!avatarPath.startsWith("/uploads/avatars/")) return;
  var base = path.basename(avatarPath);
  if (!base || base.includes("..")) return;
  var full = path.join(getAvatarUploadDir(), base);
  try {
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (_unused) {
    /* ignore */
  }
}
function isValidAvatarUrl(url) {
  if (url.startsWith("/uploads/avatars/")) return true;
  try {
    var u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_unused2) {
    return false;
  }
}

// 身份验证中间件引用

export function initializeApiRoutes(authenticateToken, frontendUrl) {
  // 创建路由器 - 每次调用都创建新的实例
  var router = express.Router();
  var PORT = process.env.PORT || 3000;
  var BACKEND_URL = process.env.BACKEND_URL || "http://localhost:".concat(PORT);

  // 初始化 LLM API
  var llmApi = new LLMApi(process.env.OPENAI_API_KEY || "", process.env.OPENAI_MODEL || "deepseek-chat");
  var normalizeQueueScheduleArgs = function normalizeQueueScheduleArgs(input) {
    var args = _objectSpread({}, input || {});
    if (!args.name && args.title) args.name = args.title;
    if (!args.description && args.body) args.description = args.body;
    if (!args.location && args.place) args.location = args.place;
    var normalizeTimeValue = function normalizeTimeValue(value) {
      if (!value) return value;
      if (typeof value === "string") return value;
      if (typeof value === "number") return new Date(value).toISOString();
      if (_typeof(value) === "object") {
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
      var _args$start;
      args.startTime = normalizeTimeValue((_args$start = args.start) !== null && _args$start !== void 0 ? _args$start : args.startDate);
    }
    if (!args.endTime && (args.end || args.endDate)) {
      var _args$end;
      args.endTime = normalizeTimeValue((_args$end = args.end) !== null && _args$end !== void 0 ? _args$end : args.endDate);
    }
    if (args.recurrence !== undefined && args.recurrenceRule === undefined) {
      args.recurrenceRule = args.recurrence;
      delete args.recurrence;
    }
    if (args.recurrenceRule !== undefined) {
      var parsedRecurrence = parseRecurrenceRuleInput(args.recurrenceRule);
      if (parsedRecurrence) {
        args.recurrenceRule = parsedRecurrence;
      } else {
        delete args.recurrenceRule;
      }
    }
    try {
      var resolved = resolveScheduleType({
        explicit: args.scheduleType,
        recurrence: args.recurrenceRule,
        fallback: "single"
      });
      args.scheduleType = resolved.scheduleType;
      if (resolved.parsedRecurrence) args.recurrenceRule = resolved.parsedRecurrence;
    } catch (e) {
      var _parsedRecurrence = parseRecurrenceRuleInput(args.recurrenceRule);
      if (_parsedRecurrence) {
        args.recurrenceRule = _parsedRecurrence;
      } else {
        delete args.recurrenceRule;
      }
      var _resolved = resolveScheduleType({
        explicit: undefined,
        recurrence: args.recurrenceRule,
        fallback: "single"
      });
      args.scheduleType = _resolved.scheduleType;
    }
    return args;
  };

  // LLM 聊天接口（流式）
  router.post("/llm/chat", authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var _req$body, messages, tools, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _req$body = req.body, messages = _req$body.messages, tools = _req$body.tools;
            if (!(!messages || !Array.isArray(messages))) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "messages array required"
            }));
          case 1:
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            _context.n = 2;
            return llmApi.chatStream(messages, tools, function (data) {
              res.write("data: ".concat(JSON.stringify(data), "\n\n"));
            });
          case 2:
            res.write("data: [DONE]\n\n");
            res.end();
            _context.n = 5;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            logger.error("LLM chat failed:", _t);
            if (res.headersSent) {
              _context.n = 4;
              break;
            }
            return _context.a(2, res.status(500).json({
              error: "Failed to process chat request"
            }));
          case 4:
            res.write("data: ".concat(JSON.stringify({
              error: _t.message
            }), "\n\n"));
            res.end();
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[0, 3]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  // 四象限自动分类接口
  router.post("/tasks/classify-quadrants", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var user, _ref3, taskIds, userTasks, tasksToClassify, taskListText, nowStr, messages, content, parsed, jsonMatch, classifications, _iterator, _step, _axes$importanceScore, _axes$urgencyScore, item, idx, quad, axes, centers, c, derived, task, _t2, _t3, _t4;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            user = req.user;
            _ref3 = req.body || {}, taskIds = _ref3.taskIds;
            if (!(!taskIds || !Array.isArray(taskIds) || taskIds.length === 0)) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "taskIds array required"
            }));
          case 1:
            _context2.n = 2;
            return dbService.getTasksByUserId(user.id);
          case 2:
            userTasks = _context2.v;
            tasksToClassify = userTasks.filter(function (t) {
              return taskIds.includes(t.id);
            });
            if (!(tasksToClassify.length === 0)) {
              _context2.n = 3;
              break;
            }
            return _context2.a(2, res.json({
              classifications: []
            }));
          case 3:
            logger.info("[Quadrant] Classifying ".concat(tasksToClassify.length, " tasks for user ").concat(user.id));

            // 构建任务列表供 LLM 分析
            taskListText = tasksToClassify.map(function (t, i) {
              return "".concat(i + 1, ". \u540D\u79F0: \"").concat(t.name, "\", \u63CF\u8FF0: \"").concat(t.description || "", "\", \u5F00\u59CB: ").concat(t.startTime || "", ", \u622A\u6B62: ").concat(t.dueDate || "", ", \u91CD\u8981\u6027: ").concat(t.importance || "normal", ", \u5DF2\u5B8C\u6210: ").concat(t.completed);
            }).join("\n");
            nowStr = toShanghaiISO();
            messages = [{
              role: "system",
              content: "\u4F60\u662F\u4E00\u4E2A\u65E5\u7A0B\u5206\u7C7B\u52A9\u624B\u3002\u8BF7\u6839\u636E\u827E\u68EE\u8C6A\u5A01\u5C14\u77E9\u9635\uFF08\u56DB\u8C61\u9650\u6CD5\u5219\uFF09\u5BF9\u4EE5\u4E0B\u65E5\u7A0B\u8FDB\u884C\u5206\u7C7B\u3002\n\u5F53\u524D\u65F6\u95F4: ".concat(nowStr, "\n\n\u56DB\u8C61\u9650\u4E0E\u53CC\u8F74\u5206\u6570\uFF08-1~1\uFF09:\n- importanceScore: \u91CD\u8981\u7A0B\u5EA6\uFF0C>0 \u91CD\u8981\uFF0C\u22640 \u4E0D\u91CD\u8981\n- urgencyScore: \u7D27\u6025\u7A0B\u5EA6\uFF0C>0 \u7D27\u6025\uFF0C\u22640 \u4E0D\u7D27\u6025\n- q1: \u91CD\u8981\u4E14\u7D27\u6025 \u2014 importanceScore>0 \u4E14 urgencyScore>0\uFF08\u622A\u6B62\u4E34\u8FD1\u3001\u9700\u7ACB\u5373\u5904\u7406\uFF09\n- q2: \u91CD\u8981\u4F46\u4E0D\u7D27\u6025 \u2014 importanceScore>0 \u4E14 urgencyScore\u22640\uFF08\u9700\u89C4\u5212\u4F46\u4E0D\u5FC5\u7ACB\u5373\u6267\u884C\uFF09\n- q3: \u4E0D\u91CD\u8981\u4F46\u7D27\u6025 \u2014 importanceScore\u22640 \u4E14 urgencyScore>0\uFF08\u53EF\u59D4\u6258\uFF09\n- q4: \u4E0D\u91CD\u8981\u4E14\u4E0D\u7D27\u6025 \u2014 importanceScore\u22640 \u4E14 urgencyScore\u22640\uFF08\u53EF\u8003\u8651\u5220\u9664\uFF09\n\n\u8BF7\u8FD4\u56DE\u4E00\u4E2A JSON \u6570\u7EC4\uFF08\u4E0D\u8981\u5305\u542B\u5728 markdown \u4EE3\u7801\u5757\u4E2D\uFF09\uFF0C\u6BCF\u4E2A\u5143\u7D20\u5305\u542B\uFF1A\n- taskIndex\uFF08\u6570\u5B57\uFF0C\u5BF9\u5E94\u5E8F\u53F7\uFF09\n- quadrant\uFF08\"q1\" | \"q2\" | \"q3\" | \"q4\"\uFF09\n- importanceScore\uFF08\u6D6E\u70B9\u6570\uFF0C-1 \u5230 1\uFF09\n- urgencyScore\uFF08\u6D6E\u70B9\u6570\uFF0C-1 \u5230 1\uFF09\n\u5206\u6570\u987B\u4E0E quadrant \u4E00\u81F4\u3002")
            }, {
              role: "user",
              content: "\u8BF7\u5BF9\u4EE5\u4E0B\u65E5\u7A0B\u8FDB\u884C\u56DB\u8C61\u9650\u5206\u7C7B\uFF1A\n".concat(taskListText)
            }];
            _context2.n = 4;
            return llmApi.chat(messages, {
              temperature: 0.3
            });
          case 4:
            content = _context2.v;
            logger.data("[Quadrant Classify Response]: ".concat(content));

            // 尝试解析 JSON
            _context2.p = 5;
            // 提取 JSON 数组
            jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              parsed = JSON.parse(jsonMatch[0]);
            } else {
              parsed = JSON.parse(content);
            }
            _context2.n = 7;
            break;
          case 6:
            _context2.p = 6;
            _t2 = _context2.v;
            logger.error("Failed to parse quadrant classification response:", _t2);
            return _context2.a(2, res.status(500).json({
              error: "Failed to parse LLM response"
            }));
          case 7:
            if (Array.isArray(parsed)) {
              _context2.n = 8;
              break;
            }
            return _context2.a(2, res.status(500).json({
              error: "Invalid LLM response format"
            }));
          case 8:
            classifications = [];
            _iterator = _createForOfIteratorHelper(parsed);
            _context2.p = 9;
            _iterator.s();
          case 10:
            if ((_step = _iterator.n()).done) {
              _context2.n = 14;
              break;
            }
            item = _step.value;
            idx = item.taskIndex;
            quad = item.quadrant;
            if (!(!idx || !tasksToClassify[idx - 1])) {
              _context2.n = 11;
              break;
            }
            return _context2.a(3, 13);
          case 11:
            axes = resolvePriorityAxes({
              importanceScore: item.importanceScore,
              urgencyScore: item.urgencyScore,
              fillDefaults: false
            }); // 若缺分数但有象限，用象限中心点
            if (axes.importanceScore === null || axes.urgencyScore === null) {
              if (["q1", "q2", "q3", "q4"].includes(quad)) {
                centers = {
                  q1: {
                    i: 0.6,
                    u: 0.6
                  },
                  q2: {
                    i: 0.6,
                    u: -0.4
                  },
                  q3: {
                    i: -0.4,
                    u: 0.6
                  },
                  q4: {
                    i: -0.4,
                    u: -0.4
                  }
                };
                c = centers[quad];
                if (axes.importanceScore === null) axes.importanceScore = c.i;
                if (axes.urgencyScore === null) axes.urgencyScore = c.u;
              }
            }
            derived = quadrantFromAxes(axes.importanceScore, axes.urgencyScore);
            if (derived) quad = derived;
            if (["q1", "q2", "q3", "q4"].includes(quad)) {
              _context2.n = 12;
              break;
            }
            return _context2.a(3, 13);
          case 12:
            task = tasksToClassify[idx - 1];
            classifications.push({
              taskId: task.id,
              quadrant: quad,
              importanceScore: (_axes$importanceScore = axes.importanceScore) !== null && _axes$importanceScore !== void 0 ? _axes$importanceScore : undefined,
              urgencyScore: (_axes$urgencyScore = axes.urgencyScore) !== null && _axes$urgencyScore !== void 0 ? _axes$urgencyScore : undefined
            });
            _context2.n = 13;
            return dbService.patchTask(user.id, task.id, {
              quadrant: quad,
              importanceScore: axes.importanceScore,
              urgencyScore: axes.urgencyScore
            });
          case 13:
            _context2.n = 10;
            break;
          case 14:
            _context2.n = 16;
            break;
          case 15:
            _context2.p = 15;
            _t3 = _context2.v;
            _iterator.e(_t3);
          case 16:
            _context2.p = 16;
            _iterator.f();
            return _context2.f(16);
          case 17:
            logger.success("[Quadrant] Classification completed: ".concat(classifications.length, " tasks classified"), classifications.map(function (c) {
              var _tasksToClassify$find;
              return {
                taskId: c.taskId,
                quadrant: c.quadrant,
                importanceScore: c.importanceScore,
                urgencyScore: c.urgencyScore,
                name: (_tasksToClassify$find = tasksToClassify.find(function (t) {
                  return t.id === c.taskId;
                })) === null || _tasksToClassify$find === void 0 ? void 0 : _tasksToClassify$find.name
              };
            }));
            res.json({
              classifications: classifications
            });
            _context2.n = 19;
            break;
          case 18:
            _context2.p = 18;
            _t4 = _context2.v;
            logger.error("Classify quadrants failed:", _t4);
            res.status(500).json({
              error: _t4.message || "Failed to classify quadrants"
            });
          case 19:
            return _context2.a(2);
        }
      }, _callee2, null, [[9, 15, 16, 17], [5, 6], [0, 18]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  // ── AI 聊天记录持久化（多上下文） ────────────────────────

  // 列出用户所有上下文
  router.get("/chat/contexts", authenticateToken, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var user, contexts, message, _t5;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            user = req.user;
            _context3.n = 1;
            return dbService.getChatContexts(user.id);
          case 1:
            contexts = _context3.v;
            res.json({
              contexts: contexts
            });
            _context3.n = 3;
            break;
          case 2:
            _context3.p = 2;
            _t5 = _context3.v;
            message = _t5 instanceof Error ? _t5.message : String(_t5);
            logger.error("Failed to list chat contexts:", message);
            res.status(500).json({
              error: "Failed to list chat contexts"
            });
          case 3:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 2]]);
    }));
    return function (_x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }());

  // 创建新上下文
  router.post("/chat/contexts", authenticateToken, /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var user, id, message, _t6;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            user = req.user;
            _context4.n = 1;
            return dbService.createChatContext(user.id);
          case 1:
            id = _context4.v;
            res.status(201).json({
              context: {
                id: id,
                title: "新对话",
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messageCount: 0
              }
            });
            _context4.n = 3;
            break;
          case 2:
            _context4.p = 2;
            _t6 = _context4.v;
            message = _t6 instanceof Error ? _t6.message : String(_t6);
            logger.error("Failed to create chat context:", message);
            res.status(500).json({
              error: "Failed to create chat context"
            });
          case 3:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 2]]);
    }));
    return function (_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }());

  // 加载指定上下文
  router.get("/chat/contexts/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
      var row, message, _t7;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            _context5.n = 1;
            return dbService.getChatContext(req.params.id);
          case 1:
            row = _context5.v;
            if (row) {
              _context5.n = 2;
              break;
            }
            return _context5.a(2, res.status(404).json({
              error: "Context not found"
            }));
          case 2:
            res.json({
              messages: JSON.parse(row.messages)
            });
            _context5.n = 4;
            break;
          case 3:
            _context5.p = 3;
            _t7 = _context5.v;
            message = _t7 instanceof Error ? _t7.message : String(_t7);
            logger.error("Failed to load chat context:", message);
            res.status(500).json({
              error: "Failed to load chat context"
            });
          case 4:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 3]]);
    }));
    return function (_x9, _x0) {
      return _ref6.apply(this, arguments);
    };
  }());

  // 删除指定上下文
  router["delete"]("/chat/contexts/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
      var message, _t8;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            _context6.p = 0;
            _context6.n = 1;
            return dbService.deleteChatContext(req.params.id);
          case 1:
            res.json({
              ok: true
            });
            _context6.n = 3;
            break;
          case 2:
            _context6.p = 2;
            _t8 = _context6.v;
            message = _t8 instanceof Error ? _t8.message : String(_t8);
            logger.error("Failed to delete chat context:", message);
            res.status(500).json({
              error: "Failed to delete chat context"
            });
          case 3:
            return _context6.a(2);
        }
      }, _callee6, null, [[0, 2]]);
    }));
    return function (_x1, _x10) {
      return _ref7.apply(this, arguments);
    };
  }());

  // 加载当前活跃上下文（兼容旧版）
  router.get("/chat/history", authenticateToken, /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
      var user, row, message, _t9;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            user = req.user;
            _context7.n = 1;
            return dbService.getChatHistory(user.id);
          case 1:
            row = _context7.v;
            if (row) {
              res.json({
                messages: JSON.parse(row.messages)
              });
            } else {
              res.json({
                messages: []
              });
            }
            _context7.n = 3;
            break;
          case 2:
            _context7.p = 2;
            _t9 = _context7.v;
            message = _t9 instanceof Error ? _t9.message : String(_t9);
            logger.error("Failed to load chat history:", message);
            res.status(500).json({
              error: "Failed to load chat history"
            });
          case 3:
            return _context7.a(2);
        }
      }, _callee7, null, [[0, 2]]);
    }));
    return function (_x11, _x12) {
      return _ref8.apply(this, arguments);
    };
  }());

  // 保存消息（可选 contextId）
  router.post("/chat/history", authenticateToken, /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
      var user, _ref0, messages, contextId, savedId, message, _t0;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            _context8.p = 0;
            user = req.user;
            _ref0 = req.body || {}, messages = _ref0.messages, contextId = _ref0.contextId;
            if (Array.isArray(messages)) {
              _context8.n = 1;
              break;
            }
            return _context8.a(2, res.status(400).json({
              error: "messages array required"
            }));
          case 1:
            _context8.n = 2;
            return dbService.saveChatHistory(user.id, JSON.stringify(messages), contextId);
          case 2:
            savedId = _context8.v;
            res.json({
              ok: true,
              contextId: savedId
            });
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t0 = _context8.v;
            message = _t0 instanceof Error ? _t0.message : String(_t0);
            logger.error("Failed to save chat history:", message);
            res.status(500).json({
              error: "Failed to save chat history"
            });
          case 4:
            return _context8.a(2);
        }
      }, _callee8, null, [[0, 3]]);
    }));
    return function (_x13, _x14) {
      return _ref9.apply(this, arguments);
    };
  }());

  // 撤销最后一轮对话（同时删除该轮创建的任务）
  router.post("/chat/undo", authenticateToken, /*#__PURE__*/function () {
    var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
      var user, row, messages, lastUserIdx, i, undoneMessages, keptMessages, deletedTaskIds, _iterator2, _step2, msg, _content$task, content, taskId, message, _t1, _t10, _t11;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            _context9.p = 0;
            user = req.user;
            _context9.n = 1;
            return dbService.getChatHistory(user.id);
          case 1:
            row = _context9.v;
            if (row) {
              _context9.n = 2;
              break;
            }
            return _context9.a(2, res.status(404).json({
              error: "No chat history found"
            }));
          case 2:
            messages = JSON.parse(row.messages); // 找到最后一个 user 消息的索引
            lastUserIdx = -1;
            i = messages.length - 1;
          case 3:
            if (!(i >= 0)) {
              _context9.n = 5;
              break;
            }
            if (!(messages[i].role === "user")) {
              _context9.n = 4;
              break;
            }
            lastUserIdx = i;
            return _context9.a(3, 5);
          case 4:
            i--;
            _context9.n = 3;
            break;
          case 5:
            if (!(lastUserIdx === -1)) {
              _context9.n = 6;
              break;
            }
            return _context9.a(2, res.status(400).json({
              error: "No user messages to undo"
            }));
          case 6:
            // 收集撤销的消息（从最后一个 user 到末尾）
            undoneMessages = messages.slice(lastUserIdx);
            keptMessages = messages.slice(0, lastUserIdx); // 从撤销的 tool 消息中提取任务 ID 并删除
            deletedTaskIds = [];
            _iterator2 = _createForOfIteratorHelper(undoneMessages);
            _context9.p = 7;
            _iterator2.s();
          case 8:
            if ((_step2 = _iterator2.n()).done) {
              _context9.n = 14;
              break;
            }
            msg = _step2.value;
            if (!(msg.role !== "tool")) {
              _context9.n = 9;
              break;
            }
            return _context9.a(3, 13);
          case 9:
            _context9.p = 9;
            content = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
            taskId = content === null || content === void 0 || (_content$task = content.task) === null || _content$task === void 0 ? void 0 : _content$task.id;
            if (!taskId) {
              _context9.n = 11;
              break;
            }
            _context9.n = 10;
            return dbService.deleteTask(taskId);
          case 10:
            deletedTaskIds.push(taskId);
          case 11:
            _context9.n = 13;
            break;
          case 12:
            _context9.p = 12;
            _t1 = _context9.v;
          case 13:
            _context9.n = 8;
            break;
          case 14:
            _context9.n = 16;
            break;
          case 15:
            _context9.p = 15;
            _t10 = _context9.v;
            _iterator2.e(_t10);
          case 16:
            _context9.p = 16;
            _iterator2.f();
            return _context9.f(16);
          case 17:
            _context9.n = 18;
            return dbService.saveChatHistory(user.id, JSON.stringify(keptMessages), row.id);
          case 18:
            logger.info("Undid last turn for user ".concat(user.id, ": removed ").concat(undoneMessages.length, " messages, deleted ").concat(deletedTaskIds.length, " tasks"));
            res.json({
              ok: true,
              removedMessages: undoneMessages.length,
              deletedTasks: deletedTaskIds.length
            });
            _context9.n = 20;
            break;
          case 19:
            _context9.p = 19;
            _t11 = _context9.v;
            message = _t11 instanceof Error ? _t11.message : String(_t11);
            logger.error("Failed to undo chat:", message);
            res.status(500).json({
              error: "Failed to undo chat"
            });
          case 20:
            return _context9.a(2);
        }
      }, _callee9, null, [[9, 12], [7, 15, 16, 17], [0, 19]]);
    }));
    return function (_x15, _x16) {
      return _ref1.apply(this, arguments);
    };
  }());

  // 查询MicrosoftTODO接口状态的API端点
  router.post("/status/microsoft-todo", authenticateToken, /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
      var user, status, graphEndpoint, headers, _t12, _t13;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            _context0.p = 0;
            user = req.user;
            status = {
              connected: !!user.MStoken,
              binded: user.MSbinded,
              tokenAvailable: !!user.MStoken,
              lastChecked: toShanghaiISO()
            }; // 如果有token，尝试验证token是否有效
            if (!user.MStoken) {
              _context0.n = 4;
              break;
            }
            _context0.p = 1;
            graphEndpoint = "https://graph.microsoft.com/v1.0/me/todo/lists?$top=1";
            headers = {
              Authorization: "Bearer ".concat(user.MStoken)
            };
            _context0.n = 2;
            return axios.get(graphEndpoint, {
              headers: headers
            });
          case 2:
            status.connected = true;
            _context0.n = 4;
            break;
          case 3:
            _context0.p = 3;
            _t12 = _context0.v;
            status.connected = false;
            logger.error("Microsoft Todo API check failed:", _t12);
          case 4:
            res.status(200).json(status);
            _context0.n = 6;
            break;
          case 5:
            _context0.p = 5;
            _t13 = _context0.v;
            res.status(500).json({
              error: "Failed to check Microsoft Todo status"
            });
          case 6:
            return _context0.a(2);
        }
      }, _callee0, null, [[1, 3], [0, 5]]);
    }));
    return function (_x17, _x18) {
      return _ref10.apply(this, arguments);
    };
  }());

  // 查询Ebridge接口状态的API端点
  router.post("/status/ebridge", authenticateToken, /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
      var user, status;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            try {
              user = req.user;
              status = {
                connected: user.ebridgeBinded,
                // This now reflects ebridge (timetable) specifically
                binded: !!user.XJTLUPassword,
                passwordAvailable: !!user.XJTLUPassword,
                emsClientAvailable: !!user.emsClient,
                timetableUrl: user.timetableUrl || null,
                lastChecked: toShanghaiISO(),
                exchangeBinded: user.ExchangeBinded,
                exchangeTokenAvailable: !!user.ExchangeAccessToken,
                smtpBinded: user.ImapBinded || false,
                smtpEmail: user.ImapEmail || null,
                imapClientAvailable: !!user.imapClient
              }; // 立即发送响应给客户端
              res.status(200).json(status);
            } catch (error) {
              // 如果在准备响应时出错，发送错误响应
              res.status(500).json({
                error: "Failed to check Ebridge status"
              });
            }
          case 1:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    return function (_x19, _x20) {
      return _ref11.apply(this, arguments);
    };
  }());

  // 解除 Exchange 绑定
  router.post("/unbind/exchange", authenticateToken, /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
      var user, _t14;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            _context10.p = 0;
            user = req.user;
            user.ExchangeBinded = false;
            user.ExchangeAccessToken = undefined;
            user.ExchangeRefreshToken = undefined;
            user.ExchangeTokenExpiresAt = undefined;
            _context10.n = 1;
            return dbService.updateUser(user);
          case 1:
            // userCache is updated by reference if in-memory, but dbService.updateUser doesn't update cache automatically in all implementations unless we do it explicitly or if cache holds the same object.
            // In current impl, userCache holds the object reference, so good.

            res.status(200).json({
              message: "Exchange unbinded successfully"
            });
            _context10.n = 3;
            break;
          case 2:
            _context10.p = 2;
            _t14 = _context10.v;
            logger.error("Failed to unbind Exchange:", _t14);
            res.status(500).json({
              error: "Failed to unbind Exchange"
            });
          case 3:
            return _context10.a(2);
        }
      }, _callee10, null, [[0, 2]]);
    }));
    return function (_x21, _x22) {
      return _ref12.apply(this, arguments);
    };
  }());
  router.post("/bind/imap", authenticateToken, /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
      var user, _ref14, imapEmail, imapPassword, imapHost, imapPort, imapTls, _t15;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.p = _context11.n) {
          case 0:
            _context11.p = 0;
            user = req.user;
            _ref14 = req.body || {}, imapEmail = _ref14.imapEmail, imapPassword = _ref14.imapPassword, imapHost = _ref14.imapHost, imapPort = _ref14.imapPort, imapTls = _ref14.imapTls;
            if (!(!imapEmail || !imapPassword || !imapHost || !imapPort)) {
              _context11.n = 1;
              break;
            }
            return _context11.a(2, res.status(400).json({
              error: "Missing required IMAP configuration fields"
            }));
          case 1:
            user.ImapEmail = imapEmail;
            user.ImapPassword = imapPassword;
            user.ImapHost = imapHost;
            user.ImapPort = Number(imapPort);
            user.ImapTls = imapTls !== false;
            user.ImapBinded = true;
            _context11.n = 2;
            return dbService.updateUser(user);
          case 2:
            res.status(200).json({
              message: "IMAP bound successfully"
            });
            _context11.n = 4;
            break;
          case 3:
            _context11.p = 3;
            _t15 = _context11.v;
            logger.error("Failed to bind IMAP:", _t15);
            res.status(500).json({
              error: "Failed to bind IMAP"
            });
          case 4:
            return _context11.a(2);
        }
      }, _callee11, null, [[0, 3]]);
    }));
    return function (_x23, _x24) {
      return _ref13.apply(this, arguments);
    };
  }());
  router.post("/unbind/imap", authenticateToken, /*#__PURE__*/function () {
    var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
      var user, _t16;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.p = _context12.n) {
          case 0:
            _context12.p = 0;
            user = req.user;
            user.ImapBinded = false;
            user.ImapEmail = undefined;
            user.ImapPassword = undefined;
            user.ImapHost = undefined;
            user.ImapPort = undefined;
            user.ImapTls = undefined;
            if (!user.imapClient) {
              _context12.n = 2;
              break;
            }
            _context12.n = 1;
            return user.imapClient.close();
          case 1:
            user.imapClient = undefined;
          case 2:
            _context12.n = 3;
            return dbService.updateUser(user);
          case 3:
            res.status(200).json({
              message: "IMAP unbind successfully"
            });
            _context12.n = 5;
            break;
          case 4:
            _context12.p = 4;
            _t16 = _context12.v;
            logger.error("Failed to unbind IMAP:", _t16);
            res.status(500).json({
              error: "Failed to unbind IMAP"
            });
          case 5:
            return _context12.a(2);
        }
      }, _callee12, null, [[0, 4]]);
    }));
    return function (_x25, _x26) {
      return _ref15.apply(this, arguments);
    };
  }());

  // 手动触发课表同步
  router.post("/sync/timetable", authenticateToken, /*#__PURE__*/function () {
    var _ref16 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(req, res) {
      var user, result, _t17;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.p = _context13.n) {
          case 0:
            user = req.user;
            _context13.p = 1;
            if (!(!user.ebridgeBinded || !user.timetableUrl)) {
              _context13.n = 2;
              break;
            }
            return _context13.a(2, res.status(400).json({
              error: "User not bound to Ebridge or missing timetable URL"
            }));
          case 2:
            _context13.n = 3;
            return syncUserTimetable(user, true);
          case 3:
            result = _context13.v;
            return _context13.a(2, res.status(200).json({
              message: "Timetable sync completed",
              added: result.added,
              errors: result.errors
            }));
          case 4:
            _context13.p = 4;
            _t17 = _context13.v;
            logger.error("Manual timetable sync failed:", _t17);
            if (!user.XJTLUPassword) {
              _context13.n = 5;
              break;
            }
            return _context13.a(2, res.status(500).json({
              error: "请稍等，大约两分钟就好",
              details: "由于你刚刚绑定ebridge，获取课程表数据需要一段时间，请稍等。"
            }));
          case 5:
            return _context13.a(2, res.status(500).json({
              error: "Failed to sync timetable",
              details: _t17.message
            }));
        }
      }, _callee13, null, [[1, 4]]);
    }));
    return function (_x27, _x28) {
      return _ref16.apply(this, arguments);
    };
  }());

  // 删除所有课程表导入的日程
  router["delete"]("/sync/timetable", authenticateToken, /*#__PURE__*/function () {
    var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(req, res) {
      var user, count, deletedIds, _t18;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.p = _context14.n) {
          case 0:
            _context14.p = 0;
            user = req.user;
            _context14.n = 1;
            return dbService.deleteTasksByPattern(user.id, "timetable_%");
          case 1:
            count = _context14.v;
            // 刷新用户缓存
            deletedIds = user.tasks.filter(function (t) {
              return t.id.startsWith("timetable_");
            }).map(function (t) {
              return t.id;
            });
            _context14.n = 2;
            return dbService.refreshUserTasksIncremental(user, {
              deletedIds: deletedIds
            });
          case 2:
            return _context14.a(2, res.status(200).json({
              message: "Successfully deleted ".concat(count, " timetable tasks"),
              count: count
            }));
          case 3:
            _context14.p = 3;
            _t18 = _context14.v;
            logger.error("Failed to delete timetable tasks:", _t18);
            return _context14.a(2, res.status(500).json({
              error: "Failed to delete timetable tasks"
            }));
        }
      }, _callee14, null, [[0, 3]]);
    }));
    return function (_x29, _x30) {
      return _ref17.apply(this, arguments);
    };
  }());
  var createCalDavProvider = function createCalDavProvider(user) {
    if (!user.CalDavBaseUrl || !user.CalDavUsername || !user.CalDavPassword) {
      return null;
    }
    return new CalDavProvider({
      baseUrl: user.CalDavBaseUrl,
      username: user.CalDavUsername,
      password: user.CalDavPassword,
      calendarHome: user.CalDavCalendarHome
    });
  };
  router.post("/caldav/config", authenticateToken, /*#__PURE__*/function () {
    var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(req, res) {
      var user, _ref19, baseUrl, username, password, calendarUrl, provider, discovery, _t19, _t20;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.p = _context15.n) {
          case 0:
            _context15.p = 0;
            user = req.user;
            _ref19 = req.body || {}, baseUrl = _ref19.baseUrl, username = _ref19.username, password = _ref19.password, calendarUrl = _ref19.calendarUrl;
            if (!(!baseUrl || !username || !password)) {
              _context15.n = 1;
              break;
            }
            return _context15.a(2, res.status(400).json({
              error: "baseUrl, username, password are required"
            }));
          case 1:
            user.CalDavBaseUrl = baseUrl;
            user.CalDavUsername = username;
            user.CalDavPassword = password;
            if (calendarUrl) user.CalDavCalendarUrl = calendarUrl;
            user.CalDavEnabled = true;
            provider = createCalDavProvider(user);
            if (provider) {
              _context15.n = 2;
              break;
            }
            return _context15.a(2, res.status(500).json({
              error: "Failed to create CalDAV provider"
            }));
          case 2:
            _context15.p = 2;
            _context15.n = 3;
            return provider.discover();
          case 3:
            discovery = _context15.v;
            user.CalDavPrincipalUrl = discovery.principalUrl;
            user.CalDavCalendarHome = discovery.calendarHome;
            if (discovery.calendars.length > 0 && !user.CalDavCalendarUrl) {
              user.CalDavCalendarUrl = discovery.calendars[0].url;
            }
            _context15.n = 5;
            break;
          case 4:
            _context15.p = 4;
            _t19 = _context15.v;
            logger.error("CalDAV discovery failed:", _t19);
          case 5:
            _context15.n = 6;
            return dbService.updateUser(user);
          case 6:
            return _context15.a(2, res.status(200).json({
              message: "CalDAV configured successfully",
              enabled: user.CalDavEnabled,
              principalUrl: user.CalDavPrincipalUrl,
              calendarHome: user.CalDavCalendarHome,
              calendarUrl: user.CalDavCalendarUrl
            }));
          case 7:
            _context15.p = 7;
            _t20 = _context15.v;
            logger.error("CalDAV config failed:", _t20);
            return _context15.a(2, res.status(500).json({
              error: "Failed to configure CalDAV",
              details: _t20.message
            }));
        }
      }, _callee15, null, [[2, 4], [0, 7]]);
    }));
    return function (_x31, _x32) {
      return _ref18.apply(this, arguments);
    };
  }());
  router.get("/caldav/status", authenticateToken, /*#__PURE__*/function () {
    var _ref20 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(req, res) {
      var user, _t21;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.p = _context16.n) {
          case 0:
            _context16.p = 0;
            user = req.user;
            return _context16.a(2, res.status(200).json({
              enabled: user.CalDavEnabled || false,
              baseUrl: user.CalDavBaseUrl || null,
              username: user.CalDavUsername ? "***" : null,
              principalUrl: user.CalDavPrincipalUrl || null,
              calendarHome: user.CalDavCalendarHome || null,
              calendarUrl: user.CalDavCalendarUrl || null,
              lastSyncAt: user.CalDavLastSyncAt || null
            }));
          case 1:
            _context16.p = 1;
            _t21 = _context16.v;
            logger.error("CalDAV status failed:", _t21);
            return _context16.a(2, res.status(500).json({
              error: "Failed to get CalDAV status",
              details: _t21.message
            }));
        }
      }, _callee16, null, [[0, 1]]);
    }));
    return function (_x33, _x34) {
      return _ref20.apply(this, arguments);
    };
  }());
  router.get("/caldav/calendars", authenticateToken, /*#__PURE__*/function () {
    var _ref21 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(req, res) {
      var user, provider, calendars, _t22;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.p = _context17.n) {
          case 0:
            _context17.p = 0;
            user = req.user;
            provider = createCalDavProvider(user);
            if (provider) {
              _context17.n = 1;
              break;
            }
            return _context17.a(2, res.status(400).json({
              error: "CalDAV not configured"
            }));
          case 1:
            _context17.n = 2;
            return provider.listCalendars();
          case 2:
            calendars = _context17.v;
            return _context17.a(2, res.status(200).json({
              calendars: calendars
            }));
          case 3:
            _context17.p = 3;
            _t22 = _context17.v;
            logger.error("CalDAV list calendars failed:", _t22);
            return _context17.a(2, res.status(500).json({
              error: "Failed to list calendars",
              details: _t22.message
            }));
        }
      }, _callee17, null, [[0, 3]]);
    }));
    return function (_x35, _x36) {
      return _ref21.apply(this, arguments);
    };
  }());
  router.post("/caldav/sync", authenticateToken, /*#__PURE__*/function () {
    var _ref22 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(req, res) {
      var user, _ref23, _ref23$direction, direction, calendarUrl, rangeStart, rangeEnd, allowConflict, provider, syncService, result, _t23;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.p = _context18.n) {
          case 0:
            _context18.p = 0;
            user = req.user;
            _ref23 = req.body || {}, _ref23$direction = _ref23.direction, direction = _ref23$direction === void 0 ? "both" : _ref23$direction, calendarUrl = _ref23.calendarUrl, rangeStart = _ref23.rangeStart, rangeEnd = _ref23.rangeEnd, allowConflict = _ref23.allowConflict;
            provider = createCalDavProvider(user);
            if (provider) {
              _context18.n = 1;
              break;
            }
            return _context18.a(2, res.status(400).json({
              error: "CalDAV not configured"
            }));
          case 1:
            syncService = new CalendarSyncService(provider);
            _context18.n = 2;
            return syncService.sync(user, {
              direction: direction,
              calendarUrl: calendarUrl || user.CalDavCalendarUrl,
              rangeStart: rangeStart,
              rangeEnd: rangeEnd,
              allowConflict: allowConflict
            });
          case 2:
            result = _context18.v;
            return _context18.a(2, res.status(200).json({
              message: "CalDAV sync completed",
              result: result
            }));
          case 3:
            _context18.p = 3;
            _t23 = _context18.v;
            logger.error("CalDAV sync failed:", _t23);
            return _context18.a(2, res.status(500).json({
              error: "Failed to sync CalDAV",
              details: _t23.message
            }));
        }
      }, _callee18, null, [[0, 3]]);
    }));
    return function (_x37, _x38) {
      return _ref22.apply(this, arguments);
    };
  }());
  router["delete"]("/caldav/config", authenticateToken, /*#__PURE__*/function () {
    var _ref24 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(req, res) {
      var user, _t24;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.p = _context19.n) {
          case 0:
            _context19.p = 0;
            user = req.user;
            user.CalDavBaseUrl = undefined;
            user.CalDavUsername = undefined;
            user.CalDavPassword = undefined;
            user.CalDavPrincipalUrl = undefined;
            user.CalDavCalendarHome = undefined;
            user.CalDavCalendarUrl = undefined;
            user.CalDavSyncToken = undefined;
            user.CalDavEnabled = false;
            user.CalDavLastSyncAt = undefined;
            _context19.n = 1;
            return dbService.updateUser(user);
          case 1:
            return _context19.a(2, res.status(200).json({
              message: "CalDAV configuration removed"
            }));
          case 2:
            _context19.p = 2;
            _t24 = _context19.v;
            logger.error("CalDAV unbind failed:", _t24);
            return _context19.a(2, res.status(500).json({
              error: "Failed to remove CalDAV configuration",
              details: _t24.message
            }));
        }
      }, _callee19, null, [[0, 2]]);
    }));
    return function (_x39, _x40) {
      return _ref24.apply(this, arguments);
    };
  }());

  // ── CalDAV Server management APIs ───────────────────────────────

  // 从请求头动态推导真实服务器地址（支持 nginx 反向代理）
  var getServerBaseUrl = function getServerBaseUrl(req) {
    var proto = (req.get("x-forwarded-proto") || "").split(",")[0].trim();
    var forwardedHost = (req.get("x-forwarded-host") || "").split(",")[0].trim();
    var rawHost = req.get("host") || "localhost:".concat(PORT);
    var host = (forwardedHost || rawHost).replace(/:\d+$/, "");
    var scheme = proto || (host === "localhost" ? "http" : "https");
    var port = host === "localhost" ? ":".concat(PORT) : "";
    return "".concat(scheme, "://").concat(host).concat(port);
  };
  router.get("/caldav-server/status", authenticateToken, /*#__PURE__*/function () {
    var _ref25 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(req, res) {
      var user, baseUrl, serverUrl, _t25;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.p = _context20.n) {
          case 0:
            _context20.p = 0;
            user = req.user;
            baseUrl = getServerBaseUrl(req);
            serverUrl = baseUrl + "/caldav"; // 如果服务器已启用但没有密码（历史遗留数据），自动生成一个
            if (!(user.CalDavServerEnabled && !user.CalDavPassword)) {
              _context20.n = 2;
              break;
            }
            user.CalDavPassword = uuidv4();
            _context20.n = 1;
            return dbService.updateUser(user);
          case 1:
            logger.info("Auto-generated CalDavPassword for user ".concat(user.email));
          case 2:
            return _context20.a(2, res.status(200).json({
              enabled: user.CalDavServerEnabled || false,
              serverUrl: serverUrl,
              principalUrl: user.CalDavServerEnabled ? "".concat(serverUrl, "/principals/").concat(user.id, "/") : null,
              calendarHomeUrl: user.CalDavServerEnabled ? "".concat(serverUrl, "/calendars/").concat(user.id, "/") : null,
              calendarUrl: user.CalDavServerEnabled ? "".concat(serverUrl, "/calendars/").concat(user.id, "/default/") : null,
              username: user.CalDavServerEnabled ? user.CalDavUsername || user.email : null,
              password: user.CalDavServerEnabled ? user.CalDavPassword || null : null,
              connectionHint: user.CalDavServerEnabled ? "\u4F7F\u7528 ".concat(serverUrl, " \u4F5C\u4E3A CalDAV \u670D\u52A1\u5668\u5730\u5740\uFF0C\u7528\u6237\u540D: ").concat(user.CalDavUsername || user.email) : "CalDAV server 未启用，请先启用。",
              clientProfile: user.CalDavClientProfile || "auto"
            }));
          case 3:
            _context20.p = 3;
            _t25 = _context20.v;
            logger.error("CalDAV server status failed:", _t25);
            return _context20.a(2, res.status(500).json({
              error: "Failed to get CalDAV server status"
            }));
        }
      }, _callee20, null, [[0, 3]]);
    }));
    return function (_x41, _x42) {
      return _ref25.apply(this, arguments);
    };
  }());
  router.post("/caldav-server/enable", authenticateToken, /*#__PURE__*/function () {
    var _ref26 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(req, res) {
      var user, baseUrl, serverUrl, _t26;
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.p = _context21.n) {
          case 0:
            _context21.p = 0;
            user = req.user;
            baseUrl = getServerBaseUrl(req);
            serverUrl = baseUrl + "/caldav";
            user.CalDavServerEnabled = true;

            // Auto-bind: configure user's CalDAV client to point to platform CalDAV server
            // Generate a dedicated CalDAV password if not already set
            if (!user.CalDavPassword) {
              user.CalDavPassword = uuidv4();
            }
            user.CalDavBaseUrl = serverUrl;
            user.CalDavUsername = user.email;
            user.CalDavPrincipalUrl = "".concat(serverUrl, "/principals/").concat(user.id, "/");
            user.CalDavCalendarHome = "".concat(serverUrl, "/calendars/").concat(user.id, "/");
            user.CalDavCalendarUrl = "".concat(serverUrl, "/calendars/").concat(user.id, "/default/");
            user.CalDavEnabled = true;
            _context21.n = 1;
            return dbService.updateUser(user);
          case 1:
            return _context21.a(2, res.status(200).json({
              message: "CalDAV server enabled",
              serverUrl: serverUrl,
              principalUrl: "".concat(serverUrl, "/principals/").concat(user.id, "/"),
              calendarHomeUrl: "".concat(serverUrl, "/calendars/").concat(user.id, "/"),
              calendarUrl: "".concat(serverUrl, "/calendars/").concat(user.id, "/default/"),
              username: user.email,
              password: user.CalDavPassword
            }));
          case 2:
            _context21.p = 2;
            _t26 = _context21.v;
            logger.error("CalDAV server enable failed:", _t26);
            return _context21.a(2, res.status(500).json({
              error: "Failed to enable CalDAV server"
            }));
        }
      }, _callee21, null, [[0, 2]]);
    }));
    return function (_x43, _x44) {
      return _ref26.apply(this, arguments);
    };
  }());
  router.post("/caldav-server/disable", authenticateToken, /*#__PURE__*/function () {
    var _ref27 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(req, res) {
      var user, _t27;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.p = _context22.n) {
          case 0:
            _context22.p = 0;
            user = req.user;
            user.CalDavServerEnabled = false;
            _context22.n = 1;
            return dbService.updateUser(user);
          case 1:
            return _context22.a(2, res.status(200).json({
              message: "CalDAV server disabled"
            }));
          case 2:
            _context22.p = 2;
            _t27 = _context22.v;
            logger.error("CalDAV server disable failed:", _t27);
            return _context22.a(2, res.status(500).json({
              error: "Failed to disable CalDAV server"
            }));
        }
      }, _callee22, null, [[0, 2]]);
    }));
    return function (_x45, _x46) {
      return _ref27.apply(this, arguments);
    };
  }());

  // 设置是否自动为推广邮件创建日程
  router.post("/settings/auto-schedule-promotions", authenticateToken, /*#__PURE__*/function () {
    var _ref28 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(req, res) {
      var user, _ref29, enabled, _t28;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.p = _context23.n) {
          case 0:
            _context23.p = 0;
            user = req.user;
            _ref29 = req.body || {}, enabled = _ref29.enabled;
            if (!(typeof enabled !== "boolean")) {
              _context23.n = 1;
              break;
            }
            return _context23.a(2, res.status(400).json({
              error: "enabled boolean required"
            }));
          case 1:
            user.autoSchedulePromotions = enabled;
            _context23.n = 2;
            return dbService.updateUser(user);
          case 2:
            return _context23.a(2, res.status(200).json({
              autoSchedulePromotions: enabled
            }));
          case 3:
            _context23.p = 3;
            _t28 = _context23.v;
            logger.error("Failed to update autoSchedulePromotions:", _t28);
            return _context23.a(2, res.status(500).json({
              error: "Failed to update setting"
            }));
        }
      }, _callee23, null, [[0, 3]]);
    }));
    return function (_x47, _x48) {
      return _ref28.apply(this, arguments);
    };
  }());
  router.post("/settings/strip-reply-prefix", authenticateToken, /*#__PURE__*/function () {
    var _ref30 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24(req, res) {
      var user, _ref31, enabled, _t29;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.p = _context24.n) {
          case 0:
            _context24.p = 0;
            user = req.user;
            _ref31 = req.body || {}, enabled = _ref31.enabled;
            if (!(typeof enabled !== "boolean")) {
              _context24.n = 1;
              break;
            }
            return _context24.a(2, res.status(400).json({
              error: "enabled boolean required"
            }));
          case 1:
            user.stripReplyPrefix = enabled;
            _context24.n = 2;
            return dbService.updateUser(user);
          case 2:
            return _context24.a(2, res.status(200).json({
              stripReplyPrefix: enabled
            }));
          case 3:
            _context24.p = 3;
            _t29 = _context24.v;
            logger.error("Failed to update stripReplyPrefix:", _t29);
            return _context24.a(2, res.status(500).json({
              error: "Failed to update setting"
            }));
        }
      }, _callee24, null, [[0, 3]]);
    }));
    return function (_x49, _x50) {
      return _ref30.apply(this, arguments);
    };
  }());

  // ── 引导页完成状态（持久化到数据库）─────────────────

  // 获取引导页状态
  router.get("/settings/onboarding", authenticateToken, /*#__PURE__*/function () {
    var _ref32 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(req, res) {
      var user, _t30;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.p = _context25.n) {
          case 0:
            _context25.p = 0;
            user = req.user;
            return _context25.a(2, res.json({
              onboardingCompleted: !!user.onboardingCompleted
            }));
          case 1:
            _context25.p = 1;
            _t30 = _context25.v;
            logger.error("Failed to get onboarding status:", _t30);
            return _context25.a(2, res.status(500).json({
              error: "Failed to get onboarding status"
            }));
        }
      }, _callee25, null, [[0, 1]]);
    }));
    return function (_x51, _x52) {
      return _ref32.apply(this, arguments);
    };
  }());

  // 更新引导页状态
  router.post("/settings/onboarding", authenticateToken, /*#__PURE__*/function () {
    var _ref33 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(req, res) {
      var user, _ref34, completed, _t31;
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.p = _context26.n) {
          case 0:
            _context26.p = 0;
            user = req.user;
            _ref34 = req.body || {}, completed = _ref34.completed;
            if (!(typeof completed !== "boolean")) {
              _context26.n = 1;
              break;
            }
            return _context26.a(2, res.status(400).json({
              error: "completed boolean required"
            }));
          case 1:
            user.onboardingCompleted = completed;
            _context26.n = 2;
            return dbService.updateUser(user);
          case 2:
            return _context26.a(2, res.json({
              onboardingCompleted: completed
            }));
          case 3:
            _context26.p = 3;
            _t31 = _context26.v;
            logger.error("Failed to update onboarding status:", _t31);
            return _context26.a(2, res.status(500).json({
              error: "Failed to update onboarding status"
            }));
        }
      }, _callee26, null, [[0, 3]]);
    }));
    return function (_x53, _x54) {
      return _ref33.apply(this, arguments);
    };
  }());

  // 设置 CalDAV 客户端兼容模式
  router.post("/caldav-server/client-profile", authenticateToken, /*#__PURE__*/function () {
    var _ref35 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27(req, res) {
      var user, _ref36, profile, valid, _t32;
      return _regenerator().w(function (_context27) {
        while (1) switch (_context27.p = _context27.n) {
          case 0:
            _context27.p = 0;
            user = req.user;
            _ref36 = req.body || {}, profile = _ref36.profile;
            valid = ["auto", "apple", "thunderbird", "davx5", "outlook", "generic"];
            if (!(!profile || !valid.includes(profile))) {
              _context27.n = 1;
              break;
            }
            return _context27.a(2, res.status(400).json({
              error: "Invalid profile. Must be one of: ".concat(valid.join(", "))
            }));
          case 1:
            user.CalDavClientProfile = profile;
            _context27.n = 2;
            return dbService.updateUser(user);
          case 2:
            return _context27.a(2, res.status(200).json({
              clientProfile: profile
            }));
          case 3:
            _context27.p = 3;
            _t32 = _context27.v;
            logger.error("CalDAV client profile update failed:", _t32);
            return _context27.a(2, res.status(500).json({
              error: "Failed to update client profile"
            }));
        }
      }, _callee27, null, [[0, 3]]);
    }));
    return function (_x55, _x56) {
      return _ref35.apply(this, arguments);
    };
  }());

  // 获取用户日志（分页、可按时间与类型过滤）
  router.get("/logs", authenticateToken, /*#__PURE__*/function () {
    var _ref37 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(req, res) {
      var user, _req$query, _req$query$limit, limit, _req$query$offset, offset, since, until, type, lim, off, _yield$dbService$getU, logs, total, _t33;
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.p = _context28.n) {
          case 0:
            _context28.p = 0;
            user = req.user;
            _req$query = req.query, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? "50" : _req$query$limit, _req$query$offset = _req$query.offset, offset = _req$query$offset === void 0 ? "0" : _req$query$offset, since = _req$query.since, until = _req$query.until, type = _req$query.type;
            lim = Math.max(1, Math.min(500, parseInt(limit, 10) || 50));
            off = Math.max(0, parseInt(offset, 10) || 0);
            _context28.n = 1;
            return dbService.getUserLogsPage(user.id, {
              limit: lim,
              offset: off,
              since: since,
              until: until,
              type: type
            });
          case 1:
            _yield$dbService$getU = _context28.v;
            logs = _yield$dbService$getU.logs;
            total = _yield$dbService$getU.total;
            return _context28.a(2, res.status(200).json({
              logs: logs,
              total: total,
              limit: lim,
              offset: off
            }));
          case 2:
            _context28.p = 2;
            _t33 = _context28.v;
            logger.error("Fetch user logs failed:", _t33);
            return _context28.a(2, res.status(500).json({
              error: "Failed to fetch logs"
            }));
        }
      }, _callee28, null, [[0, 2]]);
    }));
    return function (_x57, _x58) {
      return _ref37.apply(this, arguments);
    };
  }());

  // 创建任务（带冲突检测 + boundary 配置 + 重复实例统计）
  router.post("/tasks", authenticateToken, /*#__PURE__*/function () {
    var _ref38 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(req, res) {
      var user, _ref39, name, description, startTime, endTime, dueDate, location, boundaryConflict, recurrenceRuleInput, importance, importanceScore, urgencyScore, scheduleTypeInput, visibility, authorizedUserIds, blockedUserIds, taskMetadata, parsedRecurrence, resolvedScheduleType, resolved, _err$message, msg, axes, task, effectiveBoundary, conflicts, createdChildren, conflictChildren, errorChildren, createdIds, instanceConflicts, generated, _iterator3, _step3, inst, instConf, savedTask, _t34, _t35, _t36, _t37, _t38, _t39, _t40;
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.p = _context29.n) {
          case 0:
            _context29.p = 0;
            user = req.user;
            _ref39 = req.body || {}, name = _ref39.name, description = _ref39.description, startTime = _ref39.startTime, endTime = _ref39.endTime, dueDate = _ref39.dueDate, location = _ref39.location, boundaryConflict = _ref39.boundaryConflict, recurrenceRuleInput = _ref39.recurrenceRule, importance = _ref39.importance, importanceScore = _ref39.importanceScore, urgencyScore = _ref39.urgencyScore, scheduleTypeInput = _ref39.scheduleType, visibility = _ref39.visibility, authorizedUserIds = _ref39.authorizedUserIds, blockedUserIds = _ref39.blockedUserIds;
            if (!(!name || !startTime || !endTime)) {
              _context29.n = 1;
              break;
            }
            return _context29.a(2, res.status(400).json({
              error: "name, startTime, endTime required"
            }));
          case 1:
            _context29.p = 1;
            taskMetadata = resolveTaskMetadata(req.body || {});
            _context29.n = 3;
            break;
          case 2:
            _context29.p = 2;
            _t34 = _context29.v;
            return _context29.a(2, res.status(400).json({
              error: _t34.message
            }));
          case 3:
            _context29.p = 3;
            resolved = resolveScheduleType({
              explicit: scheduleTypeInput,
              recurrence: recurrenceRuleInput,
              fallback: "single"
            });
            parsedRecurrence = resolved.parsedRecurrence;
            resolvedScheduleType = resolved.scheduleType;
            _context29.n = 5;
            break;
          case 4:
            _context29.p = 4;
            _t35 = _context29.v;
            msg = _t35 !== null && _t35 !== void 0 && (_err$message = _t35.message) !== null && _err$message !== void 0 && _err$message.includes("recurrenceRule") ? "Invalid recurrenceRule value" : "Invalid scheduleType value";
            return _context29.a(2, res.status(400).json({
              error: msg
            }));
          case 5:
            axes = resolvePriorityAxes({
              importanceScore: importanceScore,
              urgencyScore: urgencyScore,
              importance: importance || "normal",
              fillDefaults: true
            });
            task = _objectSpread(_objectSpread({
              id: uuidv4(),
              name: name,
              description: description || "",
              startTime: startTime,
              endTime: endTime,
              dueDate: dueDate || endTime,
              location: location,
              completed: false,
              pushedToMSTodo: false,
              importance: importance || "normal"
            }, taskMetadata), {}, {
              importanceScore: axes.importanceScore,
              urgencyScore: axes.urgencyScore,
              quadrant: quadrantFromAxes(axes.importanceScore, axes.urgencyScore),
              scheduleType: resolvedScheduleType,
              visibility: visibility || "private",
              authorizedUserIds: authorizedUserIds || undefined,
              blockedUserIds: blockedUserIds || undefined
            });
            effectiveBoundary = boundaryConflict !== undefined ? !!boundaryConflict : !!user.conflictBoundaryInclusive;
            if (parsedRecurrence) task.recurrenceRule = JSON.stringify(parsedRecurrence);

            // 冲突检测
            conflicts = findConflictingTasks(user.tasks || [], task, {
              boundaryConflict: effectiveBoundary
            });
            _context29.p = 6;
            _context29.n = 7;
            return dbService.addTask(user.id, task, effectiveBoundary, true);
          case 7:
            _context29.n = 9;
            break;
          case 8:
            _context29.p = 8;
            _t36 = _context29.v;
            throw _t36;
          case 9:
            broadcastTaskChange("created", task, user.id);
            if (!(conflicts.length > 0)) {
              _context29.n = 11;
              break;
            }
            _context29.n = 10;
            return logUserEvent(user.id, "taskConflict", "Created task with conflict ".concat(task.name), {
              id: task.id,
              conflicts: conflicts.map(function (c) {
                return c.id;
              })
            });
          case 10:
            _context29.n = 12;
            break;
          case 11:
            _context29.n = 12;
            return logUserEvent(user.id, "taskCreated", "Created task ".concat(task.name), {
              id: task.id,
              startTime: task.startTime,
              endTime: task.endTime
            });
          case 12:
            createdChildren = 0, conflictChildren = 0, errorChildren = 0;
            createdIds = [task.id];
            instanceConflicts = [];
            if (!parsedRecurrence) {
              _context29.n = 25;
              break;
            }
            generated = generateRecurrenceInstances(task, parsedRecurrence);
            _iterator3 = _createForOfIteratorHelper(generated);
            _context29.p = 13;
            _iterator3.s();
          case 14:
            if ((_step3 = _iterator3.n()).done) {
              _context29.n = 22;
              break;
            }
            inst = _step3.value;
            _context29.p = 15;
            instConf = findConflictingTasks(user.tasks || [], inst, {
              boundaryConflict: effectiveBoundary
            });
            if (!(instConf.length > 0)) {
              _context29.n = 17;
              break;
            }
            instanceConflicts.push({
              instance: {
                id: inst.id,
                startTime: inst.startTime,
                endTime: inst.endTime
              },
              conflicts: instConf.map(function (c) {
                return {
                  id: c.id,
                  name: c.name,
                  startTime: c.startTime,
                  endTime: c.endTime
                };
              })
            });
            _context29.n = 16;
            return logUserEvent(user.id, "taskConflict", "Created recurrence instance with conflict ".concat(inst.name), {
              parentId: task.id,
              instanceStart: inst.startTime,
              instanceEnd: inst.endTime
            });
          case 16:
            _context29.n = 18;
            break;
          case 17:
            _context29.n = 18;
            return logUserEvent(user.id, "taskCreated", "Created recurrence instance ".concat(inst.name), {
              id: inst.id,
              parentTaskId: inst.parentTaskId,
              startTime: inst.startTime,
              endTime: inst.endTime
            });
          case 18:
            _context29.n = 19;
            return dbService.addTask(user.id, inst, effectiveBoundary, true);
          case 19:
            createdChildren++;
            createdIds.push(inst.id);
            broadcastTaskChange("created", inst, user.id);
            _context29.n = 21;
            break;
          case 20:
            _context29.p = 20;
            _t37 = _context29.v;
            errorChildren++;
            _context29.n = 21;
            return logUserEvent(user.id, "taskError", "Error creating recurrence instance for ".concat(task.name), {
              parentId: task.id,
              error: _t37 === null || _t37 === void 0 ? void 0 : _t37.message
            });
          case 21:
            _context29.n = 14;
            break;
          case 22:
            _context29.n = 24;
            break;
          case 23:
            _context29.p = 23;
            _t38 = _context29.v;
            _iterator3.e(_t38);
          case 24:
            _context29.p = 24;
            _iterator3.f();
            return _context29.f(24);
          case 25:
            _context29.n = 26;
            return dbService.refreshUserTasksIncremental(user, {
              addedIds: createdIds
            });
          case 26:
            _context29.n = 27;
            return dbService.getTaskById(task.id);
          case 27:
            _t39 = _context29.v;
            if (_t39) {
              _context29.n = 28;
              break;
            }
            _t39 = task;
          case 28:
            savedTask = _t39;
            return _context29.a(2, res.status(201).json({
              task: savedTask,
              recurrenceSummary: buildRecurrenceSummary(parsedRecurrence, createdChildren, 0, errorChildren),
              conflictWarning: conflicts.length > 0 || instanceConflicts.length > 0 ? {
                message: "Task created with time conflicts",
                conflicts: conflicts.map(function (c) {
                  return {
                    id: c.id,
                    name: c.name,
                    startTime: c.startTime,
                    endTime: c.endTime
                  };
                }),
                instanceConflicts: instanceConflicts
              } : undefined
            }));
          case 29:
            _context29.p = 29;
            _t40 = _context29.v;
            logger.error("Create task failed:", _t40);
            return _context29.a(2, res.status(500).json({
              error: "Failed to create task"
            }));
        }
      }, _callee29, null, [[15, 20], [13, 23, 24, 25], [6, 8], [3, 4], [1, 2], [0, 29]]);
    }));
    return function (_x59, _x60) {
      return _ref38.apply(this, arguments);
    };
  }());

  // 冲突预检接口：返回与给定时间段冲突的任务列表（支持 boundary 覆盖）
  router.post("/tasks/conflicts", authenticateToken, /*#__PURE__*/function () {
    var _ref40 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(req, res) {
      var user, _ref41, startTime, endTime, boundaryConflict, candidate, effectiveBoundary, conflicts, _t41;
      return _regenerator().w(function (_context30) {
        while (1) switch (_context30.p = _context30.n) {
          case 0:
            _context30.p = 0;
            user = req.user;
            _ref41 = req.body || {}, startTime = _ref41.startTime, endTime = _ref41.endTime, boundaryConflict = _ref41.boundaryConflict;
            if (!(!startTime || !endTime)) {
              _context30.n = 1;
              break;
            }
            return _context30.a(2, res.status(400).json({
              error: "startTime and endTime required"
            }));
          case 1:
            candidate = {
              id: "candidate",
              name: "candidate",
              description: "",
              startTime: startTime,
              endTime: endTime,
              dueDate: endTime,
              completed: false,
              pushedToMSTodo: false
            };
            effectiveBoundary = boundaryConflict !== undefined ? !!boundaryConflict : !!user.conflictBoundaryInclusive;
            conflicts = findConflictingTasks(user.tasks || [], candidate, {
              boundaryConflict: effectiveBoundary
            });
            return _context30.a(2, res.status(200).json({
              conflicts: conflicts
            }));
          case 2:
            _context30.p = 2;
            _t41 = _context30.v;
            logger.error("Conflict pre-check failed:", _t41);
            return _context30.a(2, res.status(500).json({
              error: "Failed to check conflicts"
            }));
        }
      }, _callee30, null, [[0, 2]]);
    }));
    return function (_x61, _x62) {
      return _ref40.apply(this, arguments);
    };
  }());

  // 批量创建任务（部分成功 & 冲突与错误分离）
  router.post("/tasks/batch", authenticateToken, /*#__PURE__*/function () {
    var _ref42 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31(req, res) {
      var user, _ref43, tasks, boundaryConflict, results, created, conflictsCount, errors, batchBoundary, _iterator4, _step4, input, _ref44, name, description, startTime, endTime, dueDate, location, recurrenceRuleInput, importance, scheduleTypeInput, taskMetadata, parsedRecurrence, resolvedScheduleType, resolved, _err$message2, errorMessage, effectiveBoundary, task, conflicts, createdChildren, conflictChildren, errorChildren, createdIds, instanceConflicts, generated, _iterator5, _step5, inst, instConf, savedTask, _savedTask, _t42, _t43, _t44, _t45, _t46, _t47, _t48, _t49, _t50;
      return _regenerator().w(function (_context31) {
        while (1) switch (_context31.p = _context31.n) {
          case 0:
            _context31.p = 0;
            user = req.user;
            _ref43 = req.body || {}, tasks = _ref43.tasks, boundaryConflict = _ref43.boundaryConflict;
            if (!(!Array.isArray(tasks) || tasks.length === 0)) {
              _context31.n = 1;
              break;
            }
            return _context31.a(2, res.status(400).json({
              error: "tasks array required"
            }));
          case 1:
            results = [];
            created = 0, conflictsCount = 0, errors = 0;
            batchBoundary = boundaryConflict !== undefined ? !!boundaryConflict : undefined;
            _iterator4 = _createForOfIteratorHelper(tasks);
            _context31.p = 2;
            _iterator4.s();
          case 3:
            if ((_step4 = _iterator4.n()).done) {
              _context31.n = 38;
              break;
            }
            input = _step4.value;
            _ref44 = input || {}, name = _ref44.name, description = _ref44.description, startTime = _ref44.startTime, endTime = _ref44.endTime, dueDate = _ref44.dueDate, location = _ref44.location, recurrenceRuleInput = _ref44.recurrenceRule, importance = _ref44.importance, scheduleTypeInput = _ref44.scheduleType;
            if (!(!name || !startTime || !endTime)) {
              _context31.n = 4;
              break;
            }
            results.push({
              input: input,
              status: "error",
              errorMessage: "name, startTime, endTime required"
            });
            errors++;
            return _context31.a(3, 37);
          case 4:
            taskMetadata = void 0;
            _context31.p = 5;
            taskMetadata = resolveTaskMetadata(input || {});
            _context31.n = 7;
            break;
          case 6:
            _context31.p = 6;
            _t42 = _context31.v;
            results.push({
              input: input,
              status: "error",
              errorMessage: _t42.message
            });
            errors++;
            return _context31.a(3, 37);
          case 7:
            parsedRecurrence = void 0;
            resolvedScheduleType = void 0;
            _context31.p = 8;
            resolved = resolveScheduleType({
              explicit: scheduleTypeInput,
              recurrence: recurrenceRuleInput,
              fallback: "single"
            });
            parsedRecurrence = resolved.parsedRecurrence;
            resolvedScheduleType = resolved.scheduleType;
            _context31.n = 10;
            break;
          case 9:
            _context31.p = 9;
            _t43 = _context31.v;
            errorMessage = _t43 !== null && _t43 !== void 0 && (_err$message2 = _t43.message) !== null && _err$message2 !== void 0 && _err$message2.includes("recurrenceRule") ? "Invalid recurrenceRule value" : "Invalid scheduleType value";
            results.push({
              input: input,
              status: "error",
              errorMessage: errorMessage
            });
            errors++;
            return _context31.a(3, 37);
          case 10:
            effectiveBoundary = input.boundaryConflict !== undefined ? !!input.boundaryConflict : batchBoundary !== undefined ? batchBoundary : !!user.conflictBoundaryInclusive;
            task = _objectSpread(_objectSpread({
              id: uuidv4(),
              name: name,
              description: description || "",
              startTime: startTime,
              endTime: endTime,
              dueDate: dueDate || endTime,
              location: location,
              completed: false,
              pushedToMSTodo: false,
              importance: importance || "normal"
            }, taskMetadata), {}, {
              scheduleType: resolvedScheduleType
            });
            if (parsedRecurrence) task.recurrenceRule = JSON.stringify(parsedRecurrence);
            conflicts = findConflictingTasks(user.tasks || [], task, {
              boundaryConflict: effectiveBoundary
            });
            _context31.p = 11;
            _context31.n = 12;
            return dbService.addTask(user.id, task, effectiveBoundary, true);
          case 12:
            broadcastTaskChange("created", task, user.id);
            if (!(conflicts.length > 0)) {
              _context31.n = 14;
              break;
            }
            _context31.n = 13;
            return logUserEvent(user.id, "taskConflict", "Batch created task with conflict ".concat(task.name), {
              id: task.id,
              startTime: task.startTime,
              endTime: task.endTime
            });
          case 13:
            _context31.n = 15;
            break;
          case 14:
            _context31.n = 15;
            return logUserEvent(user.id, "taskCreated", "Batch created task ".concat(task.name), {
              id: task.id,
              startTime: task.startTime,
              endTime: task.endTime
            });
          case 15:
            createdChildren = 0, conflictChildren = 0, errorChildren = 0;
            createdIds = [task.id];
            instanceConflicts = [];
            if (!parsedRecurrence) {
              _context31.n = 31;
              break;
            }
            generated = generateRecurrenceInstances(task, parsedRecurrence);
            _iterator5 = _createForOfIteratorHelper(generated);
            _context31.p = 16;
            _iterator5.s();
          case 17:
            if ((_step5 = _iterator5.n()).done) {
              _context31.n = 25;
              break;
            }
            inst = _step5.value;
            _context31.p = 18;
            instConf = findConflictingTasks(user.tasks || [], inst, {
              boundaryConflict: effectiveBoundary
            });
            if (!(instConf.length > 0)) {
              _context31.n = 20;
              break;
            }
            instanceConflicts.push({
              instance: {
                id: inst.id,
                startTime: inst.startTime,
                endTime: inst.endTime
              },
              conflicts: instConf.map(function (c) {
                return {
                  id: c.id,
                  name: c.name,
                  startTime: c.startTime,
                  endTime: c.endTime
                };
              })
            });
            _context31.n = 19;
            return logUserEvent(user.id, "taskConflict", "Batch created recurrence instance with conflict ".concat(inst.name), {
              parentId: task.id,
              instanceStart: inst.startTime,
              instanceEnd: inst.endTime
            });
          case 19:
            _context31.n = 21;
            break;
          case 20:
            _context31.n = 21;
            return logUserEvent(user.id, "taskCreated", "Batch created recurrence instance ".concat(inst.name), {
              id: inst.id,
              parentTaskId: inst.parentTaskId,
              startTime: inst.startTime,
              endTime: inst.endTime
            });
          case 21:
            _context31.n = 22;
            return dbService.addTask(user.id, inst, effectiveBoundary, true);
          case 22:
            createdChildren++;
            createdIds.push(inst.id);
            broadcastTaskChange("created", inst, user.id);
            _context31.n = 24;
            break;
          case 23:
            _context31.p = 23;
            _t44 = _context31.v;
            errorChildren++;
            _context31.n = 24;
            return logUserEvent(user.id, "taskError", "Error creating batch instance for ".concat(task.name), {
              parentId: task.id,
              error: _t44 === null || _t44 === void 0 ? void 0 : _t44.message
            });
          case 24:
            _context31.n = 17;
            break;
          case 25:
            _context31.n = 27;
            break;
          case 26:
            _context31.p = 26;
            _t45 = _context31.v;
            _iterator5.e(_t45);
          case 27:
            _context31.p = 27;
            _iterator5.f();
            return _context31.f(27);
          case 28:
            _context31.n = 29;
            return dbService.getTaskById(task.id);
          case 29:
            _t46 = _context31.v;
            if (_t46) {
              _context31.n = 30;
              break;
            }
            _t46 = task;
          case 30:
            savedTask = _t46;
            results.push({
              input: input,
              status: "created",
              task: savedTask,
              recurrenceSummary: buildRecurrenceSummary(parsedRecurrence, createdChildren, 0, errorChildren),
              conflictWarning: conflicts.length > 0 || instanceConflicts.length > 0 ? {
                message: "Task created with time conflicts",
                conflicts: conflicts.map(function (c) {
                  return {
                    id: c.id,
                    name: c.name,
                    startTime: c.startTime,
                    endTime: c.endTime
                  };
                }),
                instanceConflicts: instanceConflicts
              } : undefined
            });
            _context31.n = 34;
            break;
          case 31:
            _context31.n = 32;
            return dbService.getTaskById(task.id);
          case 32:
            _t47 = _context31.v;
            if (_t47) {
              _context31.n = 33;
              break;
            }
            _t47 = task;
          case 33:
            _savedTask = _t47;
            results.push({
              input: input,
              status: "created",
              task: _savedTask,
              conflictWarning: conflicts.length > 0 ? {
                message: "Task created with time conflicts",
                conflicts: conflicts.map(function (c) {
                  return {
                    id: c.id,
                    name: c.name,
                    startTime: c.startTime,
                    endTime: c.endTime
                  };
                })
              } : undefined
            });
          case 34:
            _context31.n = 35;
            return dbService.refreshUserTasksIncremental(user, {
              addedIds: createdIds
            });
          case 35:
            created++;
            _context31.n = 37;
            break;
          case 36:
            _context31.p = 36;
            _t48 = _context31.v;
            errors++;
            results.push({
              input: input,
              status: "error",
              errorMessage: (_t48 === null || _t48 === void 0 ? void 0 : _t48.message) || "unknown error"
            });
            _context31.n = 37;
            return logUserEvent(user.id, "taskError", "Error creating task ".concat(name), {
              startTime: startTime,
              endTime: endTime,
              error: _t48 === null || _t48 === void 0 ? void 0 : _t48.message
            });
          case 37:
            _context31.n = 3;
            break;
          case 38:
            _context31.n = 40;
            break;
          case 39:
            _context31.p = 39;
            _t49 = _context31.v;
            _iterator4.e(_t49);
          case 40:
            _context31.p = 40;
            _iterator4.f();
            return _context31.f(40);
          case 41:
            return _context31.a(2, res.status(200).json({
              results: results,
              summary: {
                total: tasks.length,
                created: created,
                conflicts: 0,
                errors: errors
              } // conflicts count is 0 because we created them
            }));
          case 42:
            _context31.p = 42;
            _t50 = _context31.v;
            logger.error("Batch task creation failed:", _t50);
            return _context31.a(2, res.status(500).json({
              error: "Failed to create batch tasks"
            }));
        }
      }, _callee31, null, [[18, 23], [16, 26, 27, 28], [11, 36], [8, 9], [5, 6], [2, 39, 40, 41], [0, 42]]);
    }));
    return function (_x63, _x64) {
      return _ref42.apply(this, arguments);
    };
  }());

  // 设置用户级冲突边界模式
  router.post("/settings/conflict-mode", authenticateToken, /*#__PURE__*/function () {
    var _ref45 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(req, res) {
      var user, _ref46, boundaryConflictInclusive, _t51;
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.p = _context32.n) {
          case 0:
            _context32.p = 0;
            user = req.user;
            _ref46 = req.body || {}, boundaryConflictInclusive = _ref46.boundaryConflictInclusive;
            if (!(typeof boundaryConflictInclusive !== "boolean")) {
              _context32.n = 1;
              break;
            }
            return _context32.a(2, res.status(400).json({
              error: "boundaryConflictInclusive boolean required"
            }));
          case 1:
            user.conflictBoundaryInclusive = boundaryConflictInclusive;
            _context32.n = 2;
            return dbService.updateUser(user);
          case 2:
            return _context32.a(2, res.status(200).json({
              boundaryConflictInclusive: boundaryConflictInclusive,
              updatedAt: toShanghaiISO()
            }));
          case 3:
            _context32.p = 3;
            _t51 = _context32.v;
            logger.error("Failed to update conflict mode:", _t51);
            return _context32.a(2, res.status(500).json({
              error: "Failed to update conflict mode"
            }));
        }
      }, _callee32, null, [[0, 3]]);
    }));
    return function (_x65, _x66) {
      return _ref45.apply(this, arguments);
    };
  }());

  // 获取当前周信息（包含全局偏移与用户偏移）
  router.get("/settings/week", authenticateToken, /*#__PURE__*/function () {
    var _ref47 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33(req, res) {
      var user, _getAcademicYearConfi, academicWeekOffset, rawWeekNumber, globalWeekOffset, userWeekOffset, effectiveWeek, _t52;
      return _regenerator().w(function (_context33) {
        while (1) switch (_context33.p = _context33.n) {
          case 0:
            _context33.p = 0;
            user = req.user; // 计算原始周次（不含任何偏移）
            _getAcademicYearConfi = getAcademicYearConfig(), academicWeekOffset = _getAcademicYearConfi.weekOffset;
            rawWeekNumber = getRawWeekNumber();
            globalWeekOffset = academicWeekOffset;
            userWeekOffset = user && typeof user.weekOffset === "number" ? user.weekOffset : 0;
            effectiveWeek = Math.max(1, rawWeekNumber + globalWeekOffset + (userWeekOffset || 0));
            return _context33.a(2, res.status(200).json({
              rawWeekNumber: rawWeekNumber,
              globalWeekOffset: globalWeekOffset,
              userWeekOffset: userWeekOffset || 0,
              effectiveWeek: effectiveWeek
            }));
          case 1:
            _context33.p = 1;
            _t52 = _context33.v;
            logger.error("Failed to get week info:", _t52);
            return _context33.a(2, res.status(500).json({
              error: "Failed to get week info"
            }));
        }
      }, _callee33, null, [[0, 1]]);
    }));
    return function (_x67, _x68) {
      return _ref47.apply(this, arguments);
    };
  }());

  // 更新用户级周数偏移（可通过提供currentWeek来设置当前周数）
  router.post("/settings/week", authenticateToken, /*#__PURE__*/function () {
    var _ref48 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34(req, res) {
      var user, _ref49, currentWeek, userWeekOffset, _getAcademicYearConfi2, academicWeekOffset, rawWeekNumber, newUserOffset, effectiveWeek, _t53;
      return _regenerator().w(function (_context34) {
        while (1) switch (_context34.p = _context34.n) {
          case 0:
            _context34.p = 0;
            user = req.user;
            _ref49 = req.body || {}, currentWeek = _ref49.currentWeek, userWeekOffset = _ref49.userWeekOffset;
            _getAcademicYearConfi2 = getAcademicYearConfig(), academicWeekOffset = _getAcademicYearConfi2.weekOffset;
            rawWeekNumber = getRawWeekNumber();
            newUserOffset = typeof userWeekOffset === "number" ? userWeekOffset : undefined;
            if (typeof currentWeek === "number") {
              // 计算需要设置的 user offset，使得 raw + global + userOffset === currentWeek
              newUserOffset = currentWeek - (rawWeekNumber + academicWeekOffset);
            }
            if (!(typeof newUserOffset !== "number" || isNaN(newUserOffset))) {
              _context34.n = 1;
              break;
            }
            return _context34.a(2, res.status(400).json({
              error: "Either currentWeek (number) or userWeekOffset (number) required"
            }));
          case 1:
            user.weekOffset = Math.trunc(newUserOffset);
            _context34.n = 2;
            return dbService.updateUser(user);
          case 2:
            // 返回更新后的信息
            effectiveWeek = Math.max(1, rawWeekNumber + academicWeekOffset + (user.weekOffset || 0));
            return _context34.a(2, res.status(200).json({
              rawWeekNumber: rawWeekNumber,
              globalWeekOffset: academicWeekOffset,
              userWeekOffset: user.weekOffset || 0,
              effectiveWeek: effectiveWeek
            }));
          case 3:
            _context34.p = 3;
            _t53 = _context34.v;
            logger.error("Failed to set week info:", _t53);
            return _context34.a(2, res.status(500).json({
              error: "Failed to set week info"
            }));
        }
      }, _callee34, null, [[0, 3]]);
    }));
    return function (_x69, _x70) {
      return _ref48.apply(this, arguments);
    };
  }());

  // 获取单个任务。返回 Task 本体，与移动端 taskApi.getTaskById 契约一致。
  router.get("/tasks/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref50 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35(req, res) {
      var user, taskId, ownedTasks, task, _t54;
      return _regenerator().w(function (_context35) {
        while (1) switch (_context35.p = _context35.n) {
          case 0:
            _context35.p = 0;
            user = req.user;
            taskId = req.params.id;
            _context35.n = 1;
            return dbService.getTasksByUserId(user.id);
          case 1:
            ownedTasks = _context35.v;
            task = ownedTasks.find(function (item) {
              return item.id === taskId;
            });
            if (task) {
              _context35.n = 2;
              break;
            }
            return _context35.a(2, res.status(404).json({
              error: "Task not found"
            }));
          case 2:
            return _context35.a(2, res.status(200).json(task));
          case 3:
            _context35.p = 3;
            _t54 = _context35.v;
            logger.error("GET /tasks/:id failed:", _t54);
            return _context35.a(2, res.status(500).json({
              error: "Failed to fetch task"
            }));
        }
      }, _callee35, null, [[0, 3]]);
    }));
    return function (_x71, _x72) {
      return _ref50.apply(this, arguments);
    };
  }());

  // 更新任务（部分字段 + 冲突检测）
  router.put("/tasks/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref51 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(req, res) {
      var _existing$importanceS, _existing$urgencyScor, user, taskId, existing, owned, all, _ref52, name, description, startTime, endTime, dueDate, location, completed, boundaryConflict, importance, importanceScore, urgencyScore, recurrenceRuleInput, scheduleTypeInput, visibility, authorizedUserIds, blockedUserIds, eventType, category, allDay, isReminderOn, reminderMinutesBefore, attachments, recurrenceSource, parsedRecurrence, resolvedScheduleType, resolved, _err$message3, msg, recurrenceString, nextImportance, axesTouched, nextImpScore, nextUrgScore, nextQuadrant, taskMetadata, updated, _saved$importanceScor, _saved$urgencyScore, effectiveBoundary, conflicts, saved, _t55, _t56, _t57, _t58, _t59;
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.p = _context36.n) {
          case 0:
            _context36.p = 0;
            user = req.user;
            taskId = req.params.id; // 以数据库为准，避免 userCache 中 tasks 缺双轴/象限导致写回旧值
            _context36.n = 1;
            return dbService.getTaskById(taskId);
          case 1:
            existing = _context36.v;
            if (existing) {
              _context36.n = 2;
              break;
            }
            return _context36.a(2, res.status(404).json({
              error: "task not found"
            }));
          case 2:
            owned = (user.tasks || []).some(function (t) {
              return t.id === taskId;
            });
            if (owned) {
              _context36.n = 4;
              break;
            }
            _context36.n = 3;
            return dbService.getTasksByUserId(user.id);
          case 3:
            all = _context36.v;
            if (all.some(function (t) {
              return t.id === taskId;
            })) {
              _context36.n = 4;
              break;
            }
            return _context36.a(2, res.status(404).json({
              error: "task not found"
            }));
          case 4:
            _ref52 = req.body || {}, name = _ref52.name, description = _ref52.description, startTime = _ref52.startTime, endTime = _ref52.endTime, dueDate = _ref52.dueDate, location = _ref52.location, completed = _ref52.completed, boundaryConflict = _ref52.boundaryConflict, importance = _ref52.importance, importanceScore = _ref52.importanceScore, urgencyScore = _ref52.urgencyScore, recurrenceRuleInput = _ref52.recurrenceRule, scheduleTypeInput = _ref52.scheduleType, visibility = _ref52.visibility, authorizedUserIds = _ref52.authorizedUserIds, blockedUserIds = _ref52.blockedUserIds, eventType = _ref52.eventType, category = _ref52.category, allDay = _ref52.allDay, isReminderOn = _ref52.isReminderOn, reminderMinutesBefore = _ref52.reminderMinutesBefore, attachments = _ref52.attachments;
            recurrenceSource = recurrenceRuleInput !== undefined ? recurrenceRuleInput : existing.recurrenceRule;
            _context36.p = 5;
            resolved = resolveScheduleType({
              explicit: scheduleTypeInput,
              recurrence: recurrenceSource,
              fallback: existing.scheduleType || "single"
            });
            parsedRecurrence = resolved.parsedRecurrence;
            resolvedScheduleType = resolved.scheduleType;
            _context36.n = 7;
            break;
          case 6:
            _context36.p = 6;
            _t55 = _context36.v;
            msg = _t55 !== null && _t55 !== void 0 && (_err$message3 = _t55.message) !== null && _err$message3 !== void 0 && _err$message3.includes("recurrenceRule") ? "Invalid recurrenceRule value" : "Invalid scheduleType value";
            return _context36.a(2, res.status(400).json({
              error: msg
            }));
          case 7:
            recurrenceString = recurrenceRuleInput !== undefined ? parsedRecurrence ? JSON.stringify(parsedRecurrence) : undefined : existing.recurrenceRule;
            nextImportance = importance !== undefined ? importance : existing.importance;
            axesTouched = importanceScore !== undefined || urgencyScore !== undefined;
            nextImpScore = importanceScore !== undefined ? clampAxisScore(importanceScore) : (_existing$importanceS = existing.importanceScore) !== null && _existing$importanceS !== void 0 ? _existing$importanceS : null;
            nextUrgScore = urgencyScore !== undefined ? clampAxisScore(urgencyScore) : (_existing$urgencyScor = existing.urgencyScore) !== null && _existing$urgencyScor !== void 0 ? _existing$urgencyScor : null; // 双轴有更新时强制重算象限，忽略 body 里可能带来的旧 quadrant
            nextQuadrant = axesTouched ? quadrantFromAxes(nextImpScore, nextUrgScore) || existing.quadrant : existing.quadrant;
            _context36.p = 8;
            taskMetadata = resolveTaskMetadata(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, eventType !== undefined ? {
              eventType: eventType
            } : {}), category !== undefined ? {
              category: category
            } : {}), allDay !== undefined ? {
              allDay: allDay
            } : {}), isReminderOn !== undefined ? {
              isReminderOn: isReminderOn
            } : {}), reminderMinutesBefore !== undefined ? {
              reminderMinutesBefore: reminderMinutesBefore
            } : {}), attachments !== undefined ? {
              attachments: attachments
            } : {}), existing);
            _context36.n = 10;
            break;
          case 9:
            _context36.p = 9;
            _t56 = _context36.v;
            return _context36.a(2, res.status(400).json({
              error: _t56.message
            }));
          case 10:
            // 构建更新后的任务对象（不直接修改原对象，先复制）
            updated = _objectSpread(_objectSpread(_objectSpread({}, existing), taskMetadata), {}, {
              name: name !== undefined ? name : existing.name,
              description: description !== undefined ? description : existing.description,
              startTime: startTime !== undefined ? startTime : existing.startTime,
              endTime: endTime !== undefined ? endTime : existing.endTime,
              dueDate: dueDate !== undefined ? dueDate : existing.dueDate,
              location: location !== undefined ? location : existing.location,
              completed: completed !== undefined ? !!completed : existing.completed,
              importance: nextImportance,
              importanceScore: nextImpScore,
              urgencyScore: nextUrgScore,
              quadrant: nextQuadrant,
              scheduleType: resolvedScheduleType,
              recurrenceRule: recurrenceString,
              visibility: visibility !== undefined ? visibility : existing.visibility,
              authorizedUserIds: authorizedUserIds !== undefined ? authorizedUserIds : existing.authorizedUserIds,
              blockedUserIds: blockedUserIds !== undefined ? blockedUserIds : existing.blockedUserIds
            });
            _context36.p = 11;
            effectiveBoundary = boundaryConflict !== undefined ? !!boundaryConflict : !!user.conflictBoundaryInclusive; // 冲突检测
            conflicts = findConflictingTasks(user.tasks.filter(function (t) {
              return t.id !== updated.id;
            }), updated, {
              boundaryConflict: effectiveBoundary
            });
            _context36.n = 12;
            return dbService.updateTask(updated, effectiveBoundary, true);
          case 12:
            _context36.n = 13;
            return dbService.getTaskById(taskId);
          case 13:
            _t57 = _context36.v;
            if (_t57) {
              _context36.n = 14;
              break;
            }
            _t57 = updated;
          case 14:
            saved = _t57;
            broadcastTaskChange("updated", saved, user.id);
            if (!(conflicts.length > 0)) {
              _context36.n = 16;
              break;
            }
            _context36.n = 15;
            return logUserEvent(user.id, "taskUpdated", "Updated task with conflict ".concat(saved.name), {
              id: saved.id,
              changes: {
                name: name,
                description: description,
                startTime: startTime,
                endTime: endTime,
                dueDate: dueDate,
                location: location,
                completed: completed,
                importance: importance,
                importanceScore: importanceScore,
                urgencyScore: urgencyScore
              },
              conflicts: conflicts.map(function (c) {
                return c.id;
              })
            });
          case 15:
            _context36.n = 17;
            break;
          case 16:
            _context36.n = 17;
            return logUserEvent(user.id, "taskUpdated", "Updated task ".concat(saved.name), {
              id: saved.id,
              changes: {
                name: name,
                description: description,
                startTime: startTime,
                endTime: endTime,
                dueDate: dueDate,
                location: location,
                completed: completed,
                importance: importance,
                importanceScore: importanceScore,
                urgencyScore: urgencyScore
              }
            });
          case 17:
            if (!(completed === true && !existing.completed)) {
              _context36.n = 18;
              break;
            }
            broadcastTaskChange("completed", saved, user.id);
            _context36.n = 18;
            return logUserEvent(user.id, "taskCompleted", "Completed task ".concat(saved.name), {
              id: saved.id
            });
          case 18:
            _context36.n = 19;
            return dbService.refreshUserTasksIncremental(user, {
              updatedIds: [saved.id]
            });
          case 19:
            return _context36.a(2, res.status(200).json({
              task: saved,
              axes: {
                importanceScore: (_saved$importanceScor = saved.importanceScore) !== null && _saved$importanceScor !== void 0 ? _saved$importanceScor : null,
                urgencyScore: (_saved$urgencyScore = saved.urgencyScore) !== null && _saved$urgencyScore !== void 0 ? _saved$urgencyScore : null,
                quadrant: saved.quadrant
              },
              conflictWarning: conflicts.length > 0 ? {
                message: "Task updated with time conflicts",
                conflicts: conflicts.map(function (c) {
                  return {
                    id: c.id,
                    name: c.name,
                    startTime: c.startTime,
                    endTime: c.endTime
                  };
                })
              } : undefined
            }));
          case 20:
            _context36.p = 20;
            _t58 = _context36.v;
            logger.error("Failed to update task:", _t58);
            return _context36.a(2, res.status(500).json({
              error: "Failed to update task"
            }));
          case 21:
            _context36.p = 21;
            _t59 = _context36.v;
            logger.error("Unexpected error in PUT /tasks/:id:", _t59);
            return _context36.a(2, res.status(500).json({
              error: "Internal server error"
            }));
          case 22:
            return _context36.a(2);
        }
      }, _callee36, null, [[11, 20], [8, 9], [5, 6], [0, 21]]);
    }));
    return function (_x73, _x74) {
      return _ref51.apply(this, arguments);
    };
  }());

  /**
   * 单独调整日程四象限双轴分数
   * PATCH /api/tasks/:id/priority-axes
   * Body: { importanceScore?: number|-null, urgencyScore?: number|null }  范围 -1..1
   */
  router.patch("/tasks/:id/priority-axes", authenticateToken, /*#__PURE__*/function () {
    var _ref53 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(req, res) {
      var _existing$importanceS2, _existing$urgencyScor2, _task$importanceScore, _task$urgencyScore, _task$importanceScore2, _task$urgencyScore2, user, taskId, parsed, existing, userTasks, patch, imp, urg, q, task, _t60, _t61;
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.p = _context37.n) {
          case 0:
            _context37.p = 0;
            user = req.user;
            taskId = req.params.id;
            parsed = parsePriorityAxesBody(req.body);
            if (parsed.ok) {
              _context37.n = 1;
              break;
            }
            return _context37.a(2, res.status(400).json({
              error: parsed.error
            }));
          case 1:
            _context37.n = 2;
            return dbService.getTaskById(taskId);
          case 2:
            existing = _context37.v;
            if (existing) {
              _context37.n = 3;
              break;
            }
            return _context37.a(2, res.status(404).json({
              error: "Task not found"
            }));
          case 3:
            _context37.n = 4;
            return dbService.getTasksByUserId(user.id);
          case 4:
            userTasks = _context37.v;
            if (userTasks.some(function (t) {
              return t.id === taskId;
            })) {
              _context37.n = 5;
              break;
            }
            return _context37.a(2, res.status(403).json({
              error: "Not your task"
            }));
          case 5:
            patch = _objectSpread({}, parsed.axes);
            imp = patch.importanceScore !== undefined ? patch.importanceScore : (_existing$importanceS2 = existing.importanceScore) !== null && _existing$importanceS2 !== void 0 ? _existing$importanceS2 : null;
            urg = patch.urgencyScore !== undefined ? patch.urgencyScore : (_existing$urgencyScor2 = existing.urgencyScore) !== null && _existing$urgencyScor2 !== void 0 ? _existing$urgencyScor2 : null;
            q = quadrantFromAxes(imp !== null && imp !== void 0 ? imp : null, urg !== null && urg !== void 0 ? urg : null); // 始终用服务端派生象限，防止客户端乐观更新残留旧 quadrant
            if (q) patch.quadrant = q;
            _context37.n = 6;
            return dbService.patchTask(user.id, taskId, patch);
          case 6:
            _context37.n = 7;
            return dbService.getTaskById(taskId);
          case 7:
            _t60 = _context37.v;
            if (_t60) {
              _context37.n = 8;
              break;
            }
            _t60 = _objectSpread(_objectSpread(_objectSpread({}, existing), patch), {}, {
              id: taskId
            });
          case 8:
            task = _t60;
            _context37.n = 9;
            return dbService.refreshUserTasksIncremental(user, {
              updatedIds: [taskId]
            });
          case 9:
            broadcastTaskChange("updated", task, user.id);
            return _context37.a(2, res.status(200).json({
              task: task,
              axes: {
                importanceScore: (_task$importanceScore = task.importanceScore) !== null && _task$importanceScore !== void 0 ? _task$importanceScore : null,
                urgencyScore: (_task$urgencyScore = task.urgencyScore) !== null && _task$urgencyScore !== void 0 ? _task$urgencyScore : null,
                quadrant: task.quadrant || quadrantFromAxes((_task$importanceScore2 = task.importanceScore) !== null && _task$importanceScore2 !== void 0 ? _task$importanceScore2 : null, (_task$urgencyScore2 = task.urgencyScore) !== null && _task$urgencyScore2 !== void 0 ? _task$urgencyScore2 : null)
              }
            }));
          case 10:
            _context37.p = 10;
            _t61 = _context37.v;
            logger.error("PATCH /tasks/:id/priority-axes failed:", _t61);
            return _context37.a(2, res.status(500).json({
              error: _t61.message || "Failed to update priority axes"
            }));
        }
      }, _callee37, null, [[0, 10]]);
    }));
    return function (_x75, _x76) {
      return _ref53.apply(this, arguments);
    };
  }());

  // 部分更新任务
  router.patch("/tasks/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref54 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(req, res) {
      var _updatedTask$importan, _updatedTask$urgencyS, user, taskId, rawUpdates, allowedFields, unsupportedFields, updates, boundaryConflict, existingTask, ownedTasks, structuredFields, scheduleTypeExplicit, recurrenceProvided, recurrenceSource, parsedRecurrence, resolvedScheduleType, resolved, _err$message4, msg, wasCompleted, updatedTask, fullUpdatedTask, effectiveBoundary, conflicts, _user$tasks, others, response, _t62, _t63, _t64, _t65, _t66;
      return _regenerator().w(function (_context38) {
        while (1) switch (_context38.p = _context38.n) {
          case 0:
            _context38.p = 0;
            user = req.user;
            taskId = req.params.id;
            rawUpdates = req.body || {};
            allowedFields = new Set(["name", "description", "dueDate", "startTime", "endTime", "location", "completed", "importance", "importanceScore", "urgencyScore", "recurrenceRule", "scheduleType", "visibility", "authorizedUserIds", "blockedUserIds", "eventType", "category", "allDay", "isReminderOn", "reminderMinutesBefore", "attachments", "boundaryConflict"]);
            unsupportedFields = Object.keys(rawUpdates).filter(function (field) {
              return !allowedFields.has(field);
            });
            if (!(unsupportedFields.length > 0)) {
              _context38.n = 1;
              break;
            }
            return _context38.a(2, res.status(400).json({
              error: "Unsupported task fields: ".concat(unsupportedFields.join(", "))
            }));
          case 1:
            updates = _objectSpread({}, rawUpdates);
            if (!(Object.keys(updates).length === 0)) {
              _context38.n = 2;
              break;
            }
            return _context38.a(2, res.status(400).json({
              error: "No update fields provided"
            }));
          case 2:
            boundaryConflict = updates.boundaryConflict;
            delete updates.boundaryConflict;
            _context38.n = 3;
            return dbService.getTaskById(taskId);
          case 3:
            existingTask = _context38.v;
            if (existingTask) {
              _context38.n = 4;
              break;
            }
            return _context38.a(2, res.status(404).json({
              error: "Task not found"
            }));
          case 4:
            _context38.n = 5;
            return dbService.getTasksByUserId(user.id);
          case 5:
            ownedTasks = _context38.v;
            if (ownedTasks.some(function (task) {
              return task.id === taskId;
            })) {
              _context38.n = 6;
              break;
            }
            return _context38.a(2, res.status(404).json({
              error: "Task not found"
            }));
          case 6:
            structuredFields = ["eventType", "category", "allDay", "isReminderOn", "reminderMinutesBefore", "attachments"];
            if (!structuredFields.some(function (field) {
              return Object.prototype.hasOwnProperty.call(updates, field);
            })) {
              _context38.n = 9;
              break;
            }
            _context38.p = 7;
            Object.assign(updates, resolveTaskMetadata(updates, existingTask));
            _context38.n = 9;
            break;
          case 8:
            _context38.p = 8;
            _t62 = _context38.v;
            return _context38.a(2, res.status(400).json({
              error: _t62.message
            }));
          case 9:
            scheduleTypeExplicit = updates.scheduleType;
            recurrenceProvided = Object.prototype.hasOwnProperty.call(updates, "recurrenceRule");
            recurrenceSource = recurrenceProvided ? updates.recurrenceRule : existingTask.recurrenceRule;
            _context38.p = 10;
            resolved = resolveScheduleType({
              explicit: scheduleTypeExplicit,
              recurrence: recurrenceSource,
              fallback: existingTask.scheduleType || "single"
            });
            parsedRecurrence = resolved.parsedRecurrence;
            resolvedScheduleType = resolved.scheduleType;
            _context38.n = 12;
            break;
          case 11:
            _context38.p = 11;
            _t63 = _context38.v;
            msg = _t63 !== null && _t63 !== void 0 && (_err$message4 = _t63.message) !== null && _err$message4 !== void 0 && _err$message4.includes("recurrenceRule") ? "Invalid recurrenceRule value" : "Invalid scheduleType value";
            return _context38.a(2, res.status(400).json({
              error: msg
            }));
          case 12:
            if (recurrenceProvided) {
              updates.recurrenceRule = parsedRecurrence ? JSON.stringify(parsedRecurrence) : null;
            }
            if (scheduleTypeExplicit !== undefined || recurrenceProvided) {
              updates.scheduleType = resolvedScheduleType;
            }
            wasCompleted = existingTask.completed;
            _context38.n = 13;
            return dbService.patchTask(user.id, taskId, updates, boundaryConflict, true);
          case 13:
            _context38.n = 14;
            return dbService.getTaskById(taskId);
          case 14:
            _t64 = _context38.v;
            if (_t64) {
              _context38.n = 15;
              break;
            }
            _t64 = _objectSpread(_objectSpread(_objectSpread({}, existingTask), updates), {}, {
              id: taskId
            });
          case 15:
            updatedTask = _t64;
            // 冲突检测 (需要构建完整的对象)
            fullUpdatedTask = updatedTask;
            effectiveBoundary = boundaryConflict !== undefined ? !!boundaryConflict : !!user.conflictBoundaryInclusive;
            conflicts = [];
            if (!(updates.startTime || updates.endTime)) {
              _context38.n = 18;
              break;
            }
            _t65 = (_user$tasks = user.tasks) === null || _user$tasks === void 0 ? void 0 : _user$tasks.filter(function (t) {
              return t.id !== taskId;
            });
            if (_t65) {
              _context38.n = 17;
              break;
            }
            _context38.n = 16;
            return dbService.getTasksByUserId(user.id);
          case 16:
            _t65 = _context38.v.filter(function (t) {
              return t.id !== taskId;
            });
          case 17:
            others = _t65;
            conflicts = findConflictingTasks(others, fullUpdatedTask, {
              boundaryConflict: effectiveBoundary
            });
          case 18:
            broadcastTaskChange("updated", updatedTask, user.id);
            if (!(conflicts.length > 0)) {
              _context38.n = 20;
              break;
            }
            _context38.n = 19;
            return logUserEvent(user.id, "taskUpdated", "Patched task with conflict ".concat(updatedTask.name), {
              id: updatedTask.id,
              changes: updates,
              conflicts: conflicts.map(function (c) {
                return c.id;
              })
            });
          case 19:
            _context38.n = 21;
            break;
          case 20:
            _context38.n = 21;
            return logUserEvent(user.id, "taskUpdated", "Patched task ".concat(updatedTask.name), {
              id: updatedTask.id,
              changes: updates
            });
          case 21:
            if (!(updates.completed === true && !wasCompleted)) {
              _context38.n = 22;
              break;
            }
            broadcastTaskChange("completed", updatedTask, user.id);
            _context38.n = 22;
            return logUserEvent(user.id, "taskCompleted", "Completed task ".concat(updatedTask.name), {
              id: updatedTask.id
            });
          case 22:
            _context38.n = 23;
            return dbService.refreshUserTasksIncremental(user, {
              updatedIds: [taskId]
            });
          case 23:
            response = {
              task: updatedTask,
              axes: {
                importanceScore: (_updatedTask$importan = updatedTask.importanceScore) !== null && _updatedTask$importan !== void 0 ? _updatedTask$importan : null,
                urgencyScore: (_updatedTask$urgencyS = updatedTask.urgencyScore) !== null && _updatedTask$urgencyS !== void 0 ? _updatedTask$urgencyS : null,
                quadrant: updatedTask.quadrant
              }
            };
            if (conflicts.length > 0) {
              response.conflictWarning = {
                message: "Task patched with time conflicts",
                conflicts: conflicts.map(function (c) {
                  return {
                    id: c.id,
                    name: c.name,
                    startTime: c.startTime,
                    endTime: c.endTime
                  };
                })
              };
            }
            return _context38.a(2, res.status(200).json(response));
          case 24:
            _context38.p = 24;
            _t66 = _context38.v;
            logger.error("Patch task failed:", _t66);
            return _context38.a(2, res.status(500).json({
              error: "Failed to patch task"
            }));
        }
      }, _callee38, null, [[10, 11], [7, 8], [0, 24]]);
    }));
    return function (_x77, _x78) {
      return _ref54.apply(this, arguments);
    };
  }());

  // 删除任务（支持级联删除 cascade=true）
  router["delete"]("/tasks/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref55 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39(req, res) {
      var user, taskId, existingIndex, cascade, deletedTask, deletedOk, toDeleteIds, _iterator6, _step6, t, deletedItems, anyFailed, _loop, _i, _Array$from, _i2, _deletedItems, del, _t68;
      return _regenerator().w(function (_context40) {
        while (1) switch (_context40.p = _context40.n) {
          case 0:
            _context40.p = 0;
            user = req.user;
            taskId = req.params.id;
            existingIndex = user.tasks.findIndex(function (t) {
              return t.id === taskId;
            });
            if (!(existingIndex < 0)) {
              _context40.n = 1;
              break;
            }
            return _context40.a(2, res.status(404).json({
              error: "task not found"
            }));
          case 1:
            cascade = (req.query.cascade || "false").toString().toLowerCase() === "true";
            if (cascade) {
              _context40.n = 6;
              break;
            }
            deletedTask = user.tasks[existingIndex];
            _context40.n = 2;
            return dbService.deleteTask(taskId);
          case 2:
            deletedOk = _context40.v;
            if (!deletedOk) {
              _context40.n = 5;
              break;
            }
            broadcastTaskChange("deleted", deletedTask, user.id);
            _context40.n = 3;
            return logUserEvent(user.id, "taskDeleted", "Deleted task ".concat(deletedTask.name), {
              id: deletedTask.id
            });
          case 3:
            _context40.n = 4;
            return dbService.refreshUserTasksIncremental(user, {
              deletedIds: [taskId]
            });
          case 4:
            return _context40.a(2, res.status(200).json({
              id: taskId,
              deleted: true
            }));
          case 5:
            return _context40.a(2, res.status(500).json({
              error: "Failed to delete task"
            }));
          case 6:
            // 级联删除：删除根任务和所有 parentTaskId 指向它的子实例
            toDeleteIds = new Set();
            toDeleteIds.add(taskId);
            // 收集子实例
            _iterator6 = _createForOfIteratorHelper(user.tasks);
            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                t = _step6.value;
                if (t.parentTaskId === taskId) toDeleteIds.add(t.id);
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
            deletedItems = [];
            anyFailed = false;
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var id, ok, item, _t67;
              return _regenerator().w(function (_context39) {
                while (1) switch (_context39.p = _context39.n) {
                  case 0:
                    id = _Array$from[_i];
                    _context39.p = 1;
                    _context39.n = 2;
                    return dbService.deleteTask(id);
                  case 2:
                    ok = _context39.v;
                    if (ok) {
                      item = user.tasks.find(function (tt) {
                        return tt.id === id;
                      });
                      if (item) deletedItems.push(item);
                    } else {
                      anyFailed = true;
                    }
                    _context39.n = 4;
                    break;
                  case 3:
                    _context39.p = 3;
                    _t67 = _context39.v;
                    anyFailed = true;
                  case 4:
                    return _context39.a(2);
                }
              }, _loop, null, [[1, 3]]);
            });
            _i = 0, _Array$from = Array.from(toDeleteIds);
          case 7:
            if (!(_i < _Array$from.length)) {
              _context40.n = 9;
              break;
            }
            return _context40.d(_regeneratorValues(_loop()), 8);
          case 8:
            _i++;
            _context40.n = 7;
            break;
          case 9:
            _i2 = 0, _deletedItems = deletedItems;
          case 10:
            if (!(_i2 < _deletedItems.length)) {
              _context40.n = 12;
              break;
            }
            del = _deletedItems[_i2];
            broadcastTaskChange("deleted", del, user.id);
            _context40.n = 11;
            return logUserEvent(user.id, "taskDeleted", "Cascade deleted task ".concat(del.name), {
              id: del.id,
              parentId: del.parentTaskId || null
            });
          case 11:
            _i2++;
            _context40.n = 10;
            break;
          case 12:
            if (!anyFailed) {
              _context40.n = 13;
              break;
            }
            return _context40.a(2, res.status(500).json({
              error: "Failed to fully delete cascade tasks"
            }));
          case 13:
            _context40.n = 14;
            return dbService.refreshUserTasksIncremental(user, {
              deletedIds: Array.from(toDeleteIds)
            });
          case 14:
            return _context40.a(2, res.status(200).json({
              id: taskId,
              deleted: true,
              cascadeDeleted: true,
              count: toDeleteIds.size
            }));
          case 15:
            _context40.n = 17;
            break;
          case 16:
            _context40.p = 16;
            _t68 = _context40.v;
            logger.error("Unexpected error in DELETE /tasks/:id:", _t68);
            return _context40.a(2, res.status(500).json({
              error: "Internal server error"
            }));
          case 17:
            return _context40.a(2);
        }
      }, _callee39, null, [[0, 16]]);
    }));
    return function (_x79, _x80) {
      return _ref55.apply(this, arguments);
    };
  }());

  // 列出任务（支持时间过滤、分页与排序）
  // 支持 query: start,end,page,limit OR offset, sortBy=(startTime|dueDate|name), order=(asc|desc)
  router.get("/tasks", authenticateToken, /*#__PURE__*/function () {
    var _ref56 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40(req, res) {
      var user, _req$query2, start, end, _req$query2$limit, limit, offset, page, q, completed, sortBy, order, limNum, offNum, pageNum, parsedCompleted, parsedOrder, opts, _yield$dbService$getT, tasks, total, _t69;
      return _regenerator().w(function (_context41) {
        while (1) switch (_context41.p = _context41.n) {
          case 0:
            _context41.p = 0;
            user = req.user;
            _req$query2 = req.query, start = _req$query2.start, end = _req$query2.end, _req$query2$limit = _req$query2.limit, limit = _req$query2$limit === void 0 ? "50" : _req$query2$limit, offset = _req$query2.offset, page = _req$query2.page, q = _req$query2.q, completed = _req$query2.completed, sortBy = _req$query2.sortBy, order = _req$query2.order;
            limNum = Math.max(1, Math.min(200, parseInt(limit || "50", 10) || 50));
            offNum = 0;
            if (typeof page !== "undefined") {
              pageNum = Math.max(0, parseInt(page, 10) || 0);
              offNum = pageNum * limNum;
            } else {
              offNum = Math.max(0, parseInt(offset || "0", 10) || 0);
            }
            parsedCompleted = typeof completed === "string" ? completed.toLowerCase() === "true" : undefined;
            parsedOrder = order && order.toLowerCase() === "desc" ? "desc" : "asc";
            opts = {
              start: start,
              end: end,
              q: q,
              completed: parsedCompleted,
              limit: limNum,
              offset: offNum,
              sortBy: sortBy,
              order: parsedOrder
            };
            _context41.n = 1;
            return dbService.getTasksPage(user.id, opts);
          case 1:
            _yield$dbService$getT = _context41.v;
            tasks = _yield$dbService$getT.tasks;
            total = _yield$dbService$getT.total;
            return _context41.a(2, res.status(200).json({
              tasks: tasks,
              total: total,
              limit: limNum,
              offset: offNum,
              sortBy: opts.sortBy || "startTime",
              order: opts.order || "asc"
            }));
          case 2:
            _context41.p = 2;
            _t69 = _context41.v;
            logger.error("Failed to list tasks:", _t69);
            return _context41.a(2, res.status(500).json({
              error: "Failed to list tasks"
            }));
        }
      }, _callee40, null, [[0, 2]]);
    }));
    return function (_x81, _x82) {
      return _ref56.apply(this, arguments);
    };
  }());

  // 列出所有父级日程（即带有 recurrenceRule 的根任务）及其子实例
  router.get("/tasks/parents", authenticateToken, /*#__PURE__*/function () {
    var _ref57 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41(req, res) {
      var user, _yield$dbService$getT2, tasks, parents, result, _iterator7, _step7, p, _yield$dbService$getO, occurrences, total, _t70, _t71, _t72;
      return _regenerator().w(function (_context42) {
        while (1) switch (_context42.p = _context42.n) {
          case 0:
            _context42.p = 0;
            user = req.user; // 拉取所有任务并筛选父任务
            _context42.n = 1;
            return dbService.getTasksPage(user.id, {
              limit: 1000
            });
          case 1:
            _yield$dbService$getT2 = _context42.v;
            tasks = _yield$dbService$getT2.tasks;
            parents = tasks.filter(function (t) {
              return t.recurrenceRule && !t.parentTaskId;
            });
            result = [];
            _iterator7 = _createForOfIteratorHelper(parents);
            _context42.p = 2;
            _iterator7.s();
          case 3:
            if ((_step7 = _iterator7.n()).done) {
              _context42.n = 8;
              break;
            }
            p = _step7.value;
            _context42.p = 4;
            _context42.n = 5;
            return dbService.getOccurrencesPage(user.id, p.id, {
              limit: 1000
            });
          case 5:
            _yield$dbService$getO = _context42.v;
            occurrences = _yield$dbService$getO.occurrences;
            total = _yield$dbService$getO.total;
            result.push({
              parentTask: p,
              occurrences: occurrences,
              total: total
            });
            _context42.n = 7;
            break;
          case 6:
            _context42.p = 6;
            _t70 = _context42.v;
            // 如果某个父任务查询失败，仍继续处理其它任务
            result.push({
              parentTask: p,
              occurrences: [],
              total: 0,
              error: _t70.message
            });
          case 7:
            _context42.n = 3;
            break;
          case 8:
            _context42.n = 10;
            break;
          case 9:
            _context42.p = 9;
            _t71 = _context42.v;
            _iterator7.e(_t71);
          case 10:
            _context42.p = 10;
            _iterator7.f();
            return _context42.f(10);
          case 11:
            return _context42.a(2, res.status(200).json({
              parents: result
            }));
          case 12:
            _context42.p = 12;
            _t72 = _context42.v;
            logger.error("Failed to list parent tasks:", _t72);
            return _context42.a(2, res.status(500).json({
              error: "Failed to list parent tasks"
            }));
        }
      }, _callee41, null, [[4, 6], [2, 9, 10, 11], [0, 12]]);
    }));
    return function (_x83, _x84) {
      return _ref57.apply(this, arguments);
    };
  }());

  // recurrence helpers moved to server/Services/recurrence.ts

  // 获取某任务的所有重复实例（支持分页：page & limit，或 offset & limit；支持 sortBy & order）
  router.get("/tasks/:id/occurrences", authenticateToken, /*#__PURE__*/function () {
    var _ref58 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42(req, res) {
      var user, rootId, _req$query3, _req$query3$limit, limit, offset, page, _req$query3$sortBy, sortBy, _req$query3$order, order, limNum, offNum, pageNum, root, parsedOrder, _yield$dbService$getO2, occurrences, total, _t73;
      return _regenerator().w(function (_context43) {
        while (1) switch (_context43.p = _context43.n) {
          case 0:
            _context43.p = 0;
            user = req.user;
            rootId = req.params.id;
            _req$query3 = req.query, _req$query3$limit = _req$query3.limit, limit = _req$query3$limit === void 0 ? "50" : _req$query3$limit, offset = _req$query3.offset, page = _req$query3.page, _req$query3$sortBy = _req$query3.sortBy, sortBy = _req$query3$sortBy === void 0 ? "startTime" : _req$query3$sortBy, _req$query3$order = _req$query3.order, order = _req$query3$order === void 0 ? "asc" : _req$query3$order;
            limNum = Math.max(1, Math.min(500, parseInt(limit || "50", 10) || 50));
            offNum = 0;
            if (typeof page !== "undefined") {
              pageNum = Math.max(0, parseInt(page, 10) || 0);
              offNum = pageNum * limNum;
            } else {
              offNum = Math.max(0, parseInt(offset || "0", 10) || 0);
            }
            _context43.n = 1;
            return dbService.getTaskById(rootId);
          case 1:
            root = _context43.v;
            if (root) {
              _context43.n = 2;
              break;
            }
            return _context43.a(2, res.status(404).json({
              error: "Task not found"
            }));
          case 2:
            parsedOrder = order && order.toLowerCase() === "desc" ? "desc" : "asc";
            _context43.n = 3;
            return dbService.getOccurrencesPage(user.id, rootId, {
              limit: limNum,
              offset: offNum,
              sortBy: sortBy,
              order: parsedOrder
            });
          case 3:
            _yield$dbService$getO2 = _context43.v;
            occurrences = _yield$dbService$getO2.occurrences;
            total = _yield$dbService$getO2.total;
            return _context43.a(2, res.status(200).json({
              rootTask: root,
              occurrences: occurrences,
              total: total,
              limit: limNum,
              offset: offNum,
              sortBy: sortBy || "startTime",
              order: order || "asc"
            }));
          case 4:
            _context43.p = 4;
            _t73 = _context43.v;
            logger.error("Fetch occurrences failed", _t73);
            return _context43.a(2, res.status(500).json({
              error: "Failed to fetch occurrences"
            }));
        }
      }, _callee42, null, [[0, 4]]);
    }));
    return function (_x85, _x86) {
      return _ref58.apply(this, arguments);
    };
  }()); // 获取当前用户的日程队列
  router.get("/schedule-queue", authenticateToken, /*#__PURE__*/function () {
    var _ref59 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43(req, res) {
      var user, queue, _t74;
      return _regenerator().w(function (_context44) {
        while (1) switch (_context44.p = _context44.n) {
          case 0:
            _context44.p = 0;
            user = req.user;
            if (user !== null && user !== void 0 && user.id) {
              _context44.n = 1;
              break;
            }
            return _context44.a(2, res.status(401).json({
              error: "未登录或无用户信息"
            }));
          case 1:
            _context44.n = 2;
            return dbService.getScheduleQueueByUser(user.id);
          case 2:
            queue = _context44.v;
            res.json({
              queue: queue
            });
            _context44.n = 4;
            break;
          case 3:
            _context44.p = 3;
            _t74 = _context44.v;
            logger.error("获取日程队列失败:", _t74);
            res.status(500).json({
              error: "获取队列失败"
            });
          case 4:
            return _context44.a(2);
        }
      }, _callee43, null, [[0, 3]]);
    }));
    return function (_x87, _x88) {
      return _ref59.apply(this, arguments);
    };
  }());

  // Approve a queued schedule request
  router.post("/schedule-queue/:id/approve", authenticateToken, /*#__PURE__*/function () {
    var _ref60 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44(req, res) {
      var _req$body2, _parsed, _content$find, user, id, allowConflict, row, raw, parsed, args, normalizedArgs, _yield$dbService$getT3, existingTasks, conflicts, result, createdTask, contentText, message, _queue, queue, _t75, _t76;
      return _regenerator().w(function (_context45) {
        while (1) switch (_context45.p = _context45.n) {
          case 0:
            _context45.p = 0;
            user = req.user;
            id = req.params.id;
            allowConflict = (req === null || req === void 0 || (_req$body2 = req.body) === null || _req$body2 === void 0 ? void 0 : _req$body2.allowConflict) === true;
            _context45.n = 1;
            return dbService.getScheduleQueueById(id);
          case 1:
            row = _context45.v;
            if (row) {
              _context45.n = 2;
              break;
            }
            return _context45.a(2, res.status(404).json({
              error: "Queue item not found"
            }));
          case 2:
            if (!(row.userId !== user.id)) {
              _context45.n = 3;
              break;
            }
            return _context45.a(2, res.status(403).json({
              error: "Not your queue item"
            }));
          case 3:
            raw = row.rawRequest;
            parsed = null;
            try {
              parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
            } catch (parseError) {
              logger.warn("Failed to parse schedule queue rawRequest, using empty args", parseError);
            }
            args = ((_parsed = parsed) === null || _parsed === void 0 ? void 0 : _parsed.args) || parsed || {};
            normalizedArgs = normalizeQueueScheduleArgs(args);
            if (!(!allowConflict && normalizedArgs.startTime && normalizedArgs.endTime && !normalizedArgs.recurrenceRule)) {
              _context45.n = 5;
              break;
            }
            _context45.n = 4;
            return dbService.getTasksPage(user.id, {
              start: normalizedArgs.startTime,
              end: normalizedArgs.endTime,
              limit: 200
            });
          case 4:
            _yield$dbService$getT3 = _context45.v;
            existingTasks = _yield$dbService$getT3.tasks;
            conflicts = findConflictingTasks(existingTasks, {
              id: "new-task",
              startTime: normalizedArgs.startTime,
              endTime: normalizedArgs.endTime
            }, {
              boundaryConflict: !!user.conflictBoundaryInclusive
            });
            if (!(conflicts.length > 0)) {
              _context45.n = 5;
              break;
            }
            return _context45.a(2, res.status(409).json({
              error: "日程冲突",
              conflicts: conflicts
            }));
          case 5:
            _context45.n = 6;
            return mcpTools.add_schedule.execute(_objectSpread(_objectSpread({}, normalizedArgs), {}, {
              _internal_approve: true,
              _internal_allow_conflict: allowConflict
            }), user);
          case 6:
            result = _context45.v;
            createdTask = result === null || result === void 0 ? void 0 : result.task;
            contentText = Array.isArray(result === null || result === void 0 ? void 0 : result.content) ? (_content$find = result.content.find(function (c) {
              return (c === null || c === void 0 ? void 0 : c.type) === "text";
            })) === null || _content$find === void 0 ? void 0 : _content$find.text : undefined;
            if (createdTask !== null && createdTask !== void 0 && createdTask.id) {
              _context45.n = 10;
              break;
            }
            message = typeof contentText === "string" ? contentText : "Schedule approval did not create a task";
            _context45.n = 7;
            return dbService.updateScheduleQueueStatus(id, "failed");
          case 7:
            _context45.n = 8;
            return logUserEvent(user.id, "external_schedule_approve_failed", "\u5BA1\u6279\u5931\u8D25: ".concat(message), {
              queueId: id,
              reason: message,
              args: normalizedArgs
            });
          case 8:
            _context45.n = 9;
            return dbService.getScheduleQueueByUser(user.id);
          case 9:
            _queue = _context45.v;
            return _context45.a(2, res.status(422).json({
              error: message,
              result: result,
              queue: _queue
            }));
          case 10:
            _context45.p = 10;
            _context45.n = 11;
            return dbService.deleteScheduleQueueItem(id);
          case 11:
            _context45.n = 13;
            break;
          case 12:
            _context45.p = 12;
            _t75 = _context45.v;
            logger.warn("Failed to delete schedule queue item after approval, will fallback to marking approved", _t75);
            _context45.n = 13;
            return dbService.updateScheduleQueueStatus(id, "approved");
          case 13:
            _context45.n = 14;
            return dbService.getScheduleQueueByUser(user.id);
          case 14:
            queue = _context45.v;
            res.json({
              result: result,
              queue: queue
            });
            _context45.n = 16;
            break;
          case 15:
            _context45.p = 15;
            _t76 = _context45.v;
            logger.error("Approving schedule queue item failed:", _t76);
            res.status(500).json({
              error: "Approve failed"
            });
          case 16:
            return _context45.a(2);
        }
      }, _callee44, null, [[10, 12], [0, 15]]);
    }));
    return function (_x89, _x90) {
      return _ref60.apply(this, arguments);
    };
  }());

  // Reject a queued schedule request
  router.post("/schedule-queue/:id/reject", authenticateToken, /*#__PURE__*/function () {
    var _ref61 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45(req, res) {
      var user, id, row, queue, _t77, _t78, _t79;
      return _regenerator().w(function (_context46) {
        while (1) switch (_context46.p = _context46.n) {
          case 0:
            _context46.p = 0;
            user = req.user;
            id = req.params.id;
            _context46.n = 1;
            return dbService.getScheduleQueueById(id);
          case 1:
            row = _context46.v;
            if (row) {
              _context46.n = 2;
              break;
            }
            return _context46.a(2, res.status(404).json({
              error: "Queue item not found"
            }));
          case 2:
            if (!(row.userId !== user.id)) {
              _context46.n = 3;
              break;
            }
            return _context46.a(2, res.status(403).json({
              error: "Not your queue item"
            }));
          case 3:
            _context46.p = 3;
            _context46.n = 4;
            return dbService.addRejectionBufferItem(user.id, "schedule", row.rawRequest, id);
          case 4:
            _context46.n = 6;
            break;
          case 5:
            _context46.p = 5;
            _t77 = _context46.v;
            logger.warn("Failed to add schedule rejection to buffer pool", _t77);
          case 6:
            _context46.p = 6;
            _context46.n = 7;
            return dbService.deleteScheduleQueueItem(id);
          case 7:
            _context46.n = 9;
            break;
          case 8:
            _context46.p = 8;
            _t78 = _context46.v;
            logger.warn("Failed to delete schedule queue item after rejection, will fallback to marking rejected", _t78);
            _context46.n = 9;
            return dbService.updateScheduleQueueStatus(id, "rejected");
          case 9:
            _context46.n = 10;
            return logUserEvent(user.id, "external_schedule_rejected", "\u5DF2\u62D2\u7EDD\u5916\u90E8\u65E5\u7A0B\u8BF7\u6C42", {
              queueId: id
            });
          case 10:
            _context46.n = 11;
            return dbService.getScheduleQueueByUser(user.id);
          case 11:
            queue = _context46.v;
            res.json({
              ok: true,
              queue: queue
            });
            _context46.n = 13;
            break;
          case 12:
            _context46.p = 12;
            _t79 = _context46.v;
            logger.error("Rejecting schedule queue item failed:", _t79);
            res.status(500).json({
              error: "Reject failed"
            });
          case 13:
            return _context46.a(2);
        }
      }, _callee45, null, [[6, 8], [3, 5], [0, 12]]);
    }));
    return function (_x91, _x92) {
      return _ref61.apply(this, arguments);
    };
  }());

  // ── 邮件查看接口 ──────────────────────────────────────

  router.get("/emails", authenticateToken, /*#__PURE__*/function () {
    var _ref62 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46(req, res) {
      var user, limit, client, emails, processedIds, enriched, message, _t80;
      return _regenerator().w(function (_context47) {
        while (1) switch (_context47.p = _context47.n) {
          case 0:
            _context47.p = 0;
            user = req.user;
            limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);
            if (!(!user.imapClient && !user.emsClient)) {
              _context47.n = 1;
              break;
            }
            return _context47.a(2, res.status(200).json({
              emails: [],
              total: 0
            }));
          case 1:
            // 优先使用 IMAP，其次 Exchange
            client = user.imapClient || user.emsClient;
            if (client) {
              _context47.n = 2;
              break;
            }
            return _context47.a(2, res.status(200).json({
              emails: [],
              total: 0
            }));
          case 2:
            _context47.n = 3;
            return client.findEmails(limit);
          case 3:
            emails = _context47.v;
            _context47.n = 4;
            return dbService.getAiProcessedEmailIds(user.id);
          case 4:
            processedIds = _context47.v;
            enriched = emails.map(function (e) {
              return _objectSpread(_objectSpread({}, e), {}, {
                isAiProcessed: processedIds.has(String(e.id))
              });
            });
            return _context47.a(2, res.status(200).json({
              emails: enriched,
              total: enriched.length
            }));
          case 5:
            _context47.p = 5;
            _t80 = _context47.v;
            message = _t80 instanceof Error ? _t80.message : String(_t80);
            logger.error("Failed to list emails:", message);
            return _context47.a(2, res.status(500).json({
              error: "Failed to list emails"
            }));
        }
      }, _callee46, null, [[0, 5]]);
    }));
    return function (_x93, _x94) {
      return _ref62.apply(this, arguments);
    };
  }());

  // 邮件搜索接口
  router.get("/emails/search", authenticateToken, /*#__PURE__*/function () {
    var _ref63 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47(req, res) {
      var user, query, limit, client, fetchLimit, emails, matched, paged, processedIds, enriched, message, _t81;
      return _regenerator().w(function (_context48) {
        while (1) switch (_context48.p = _context48.n) {
          case 0:
            _context48.p = 0;
            user = req.user;
            query = (req.query.q || "").trim().toLowerCase();
            limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
            if (query) {
              _context48.n = 1;
              break;
            }
            return _context48.a(2, res.status(200).json({
              emails: [],
              total: 0,
              query: ""
            }));
          case 1:
            if (!(!user.imapClient && !user.emsClient)) {
              _context48.n = 2;
              break;
            }
            return _context48.a(2, res.status(200).json({
              emails: [],
              total: 0,
              query: query
            }));
          case 2:
            client = user.imapClient || user.emsClient;
            if (client) {
              _context48.n = 3;
              break;
            }
            return _context48.a(2, res.status(200).json({
              emails: [],
              total: 0,
              query: query
            }));
          case 3:
            // 获取一批邮件并在内存中搜索（跨提供商统一实现，低耦合）
            fetchLimit = Math.max(limit * 5, 100);
            _context48.n = 4;
            return client.findEmails(fetchLimit);
          case 4:
            emails = _context48.v;
            // 在内存中过滤匹配的邮件
            matched = emails.filter(function (e) {
              var _e$from, _e$from2;
              var subject = (e.subject || "").toLowerCase();
              var fromName = (((_e$from = e.from) === null || _e$from === void 0 ? void 0 : _e$from.name) || "").toLowerCase();
              var fromAddr = (((_e$from2 = e.from) === null || _e$from2 === void 0 ? void 0 : _e$from2.address) || "").toLowerCase();
              return subject.includes(query) || fromName.includes(query) || fromAddr.includes(query);
            });
            paged = matched.slice(0, limit); // 标注 AI 已处理状态
            _context48.n = 5;
            return dbService.getAiProcessedEmailIds(user.id);
          case 5:
            processedIds = _context48.v;
            enriched = paged.map(function (e) {
              return _objectSpread(_objectSpread({}, e), {}, {
                isAiProcessed: processedIds.has(String(e.id))
              });
            });
            logger.info("[EmailSearch] Query=\"".concat(query, "\" matched=").concat(matched.length, " returned=").concat(enriched.length));
            return _context48.a(2, res.status(200).json({
              emails: enriched,
              total: matched.length,
              query: req.query.q
            }));
          case 6:
            _context48.p = 6;
            _t81 = _context48.v;
            message = _t81 instanceof Error ? _t81.message : String(_t81);
            logger.error("Failed to search emails:", message);
            return _context48.a(2, res.status(500).json({
              error: "Failed to search emails"
            }));
        }
      }, _callee47, null, [[0, 6]]);
    }));
    return function (_x95, _x96) {
      return _ref63.apply(this, arguments);
    };
  }());
  router.get("/emails/:emailId", authenticateToken, /*#__PURE__*/function () {
    var _ref64 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48(req, res) {
      var user, emailId, isAiProcessed, queue, _iterator8, _step8, _parsed2, item, parsed, _parsed$_meta, e, email, _email, message, _t82, _t83, _t84, _t85, _t86;
      return _regenerator().w(function (_context49) {
        while (1) switch (_context49.p = _context49.n) {
          case 0:
            _context49.p = 0;
            user = req.user;
            emailId = req.params.emailId; // 预先查询 AI 处理状态
            _context49.n = 1;
            return dbService.isEmailAiProcessed(user.id, emailId);
          case 1:
            isAiProcessed = _context49.v;
            _context49.n = 2;
            return dbService.getScheduleQueueByUser(user.id);
          case 2:
            queue = _context49.v;
            // 先从队列缓存中查找
            _iterator8 = _createForOfIteratorHelper(queue);
            _context49.p = 3;
            _iterator8.s();
          case 4:
            if ((_step8 = _iterator8.n()).done) {
              _context49.n = 9;
              break;
            }
            item = _step8.value;
            parsed = null;
            _context49.p = 5;
            parsed = JSON.parse(item.rawRequest);
            _context49.n = 7;
            break;
          case 6:
            _context49.p = 6;
            _t82 = _context49.v;
            return _context49.a(3, 8);
          case 7:
            if (!(((_parsed2 = parsed) === null || _parsed2 === void 0 || (_parsed2 = _parsed2.email) === null || _parsed2 === void 0 ? void 0 : _parsed2.id) === emailId)) {
              _context49.n = 8;
              break;
            }
            e = parsed.email;
            return _context49.a(2, res.status(200).json({
              email: {
                id: e.id,
                subject: e.subject,
                from: e.from,
                receivedAt: e.receivedAt,
                isRead: e.isRead,
                isAiProcessed: isAiProcessed,
                body: e.body || "",
                htmlBody: e.htmlBody || undefined,
                hasAttachments: e.hasAttachments,
                attachmentsCount: e.attachmentsCount,
                source: (_parsed$_meta = parsed._meta) === null || _parsed$_meta === void 0 ? void 0 : _parsed$_meta.source
              }
            }));
          case 8:
            _context49.n = 4;
            break;
          case 9:
            _context49.n = 11;
            break;
          case 10:
            _context49.p = 10;
            _t83 = _context49.v;
            _iterator8.e(_t83);
          case 11:
            _context49.p = 11;
            _iterator8.f();
            return _context49.f(11);
          case 12:
            if (!user.imapClient) {
              _context49.n = 16;
              break;
            }
            _context49.p = 13;
            _context49.n = 14;
            return user.imapClient.getEmailById(emailId);
          case 14:
            email = _context49.v;
            return _context49.a(2, res.status(200).json({
              email: _objectSpread(_objectSpread({}, email), {}, {
                isAiProcessed: isAiProcessed,
                body: email.body || "",
                htmlBody: email.htmlBody || undefined,
                source: "imap"
              })
            }));
          case 15:
            _context49.p = 15;
            _t84 = _context49.v;
          case 16:
            if (!user.emsClient) {
              _context49.n = 20;
              break;
            }
            _context49.p = 17;
            _context49.n = 18;
            return user.emsClient.getEmailById(emailId);
          case 18:
            _email = _context49.v;
            return _context49.a(2, res.status(200).json({
              email: _objectSpread(_objectSpread({}, _email), {}, {
                isAiProcessed: isAiProcessed,
                body: _email.body || "",
                htmlBody: _email.htmlBody || undefined,
                source: "exchange"
              })
            }));
          case 19:
            _context49.p = 19;
            _t85 = _context49.v;
          case 20:
            return _context49.a(2, res.status(404).json({
              error: "Email not found"
            }));
          case 21:
            _context49.p = 21;
            _t86 = _context49.v;
            message = _t86 instanceof Error ? _t86.message : String(_t86);
            logger.error("Failed to fetch email:", message);
            return _context49.a(2, res.status(500).json({
              error: "Failed to fetch email"
            }));
        }
      }, _callee48, null, [[17, 19], [13, 15], [5, 6], [3, 10, 11, 12], [0, 21]]);
    }));
    return function (_x97, _x98) {
      return _ref64.apply(this, arguments);
    };
  }());

  // ── 标记邮件已读 ──────────────────────────────────

  router.put("/emails/:emailId/read", authenticateToken, /*#__PURE__*/function () {
    var _ref65 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49(req, res) {
      var _user$emsClient, user, emailId, marked, message, _t87, _t88, _t89;
      return _regenerator().w(function (_context50) {
        while (1) switch (_context50.p = _context50.n) {
          case 0:
            _context50.p = 0;
            user = req.user;
            emailId = req.params.emailId;
            marked = false; // IMAP
            if (!user.imapClient) {
              _context50.n = 4;
              break;
            }
            _context50.p = 1;
            _context50.n = 2;
            return user.imapClient.markAsRead(emailId);
          case 2:
            marked = true;
            _context50.n = 4;
            break;
          case 3:
            _context50.p = 3;
            _t87 = _context50.v;
            logger.error("IMAP markAsRead failed: ".concat(_t87.message));
          case 4:
            if (!(!marked && (_user$emsClient = user.emsClient) !== null && _user$emsClient !== void 0 && (_user$emsClient = _user$emsClient.markSystem) !== null && _user$emsClient !== void 0 && _user$emsClient.markEmailAsRead)) {
              _context50.n = 8;
              break;
            }
            _context50.p = 5;
            _context50.n = 6;
            return user.emsClient.markSystem.markEmailAsRead(emailId, true);
          case 6:
            marked = true;
            _context50.n = 8;
            break;
          case 7:
            _context50.p = 7;
            _t88 = _context50.v;
            logger.error("Exchange markAsRead failed: ".concat(_t88.message));
          case 8:
            if (marked) {
              _context50.n = 9;
              break;
            }
            return _context50.a(2, res.status(404).json({
              error: "Email not found or no email client"
            }));
          case 9:
            return _context50.a(2, res.json({
              success: true
            }));
          case 10:
            _context50.p = 10;
            _t89 = _context50.v;
            message = _t89 instanceof Error ? _t89.message : String(_t89);
            logger.error("Failed to mark email as read:", message);
            return _context50.a(2, res.status(500).json({
              error: "Failed to mark email as read"
            }));
        }
      }, _callee49, null, [[5, 7], [1, 3], [0, 10]]);
    }));
    return function (_x99, _x100) {
      return _ref65.apply(this, arguments);
    };
  }());

  // 获取当前用户资料 / 设置
  router.get("/me", authenticateToken, /*#__PURE__*/function () {
    var _ref66 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50(req, res) {
      var _user$avatar, _user$signature, _user$autoSchedulePro;
      var user;
      return _regenerator().w(function (_context51) {
        while (1) switch (_context51.n) {
          case 0:
            user = req.user;
            return _context51.a(2, res.status(200).json({
              id: user.id,
              email: user.email,
              name: user.name,
              avatar: (_user$avatar = user.avatar) !== null && _user$avatar !== void 0 ? _user$avatar : null,
              signature: (_user$signature = user.signature) !== null && _user$signature !== void 0 ? _user$signature : null,
              autoSchedulePromotions: (_user$autoSchedulePro = user.autoSchedulePromotions) !== null && _user$autoSchedulePro !== void 0 ? _user$autoSchedulePro : false,
              stripReplyPrefix: user.stripReplyPrefix !== false
            }));
        }
      }, _callee50);
    }));
    return function (_x101, _x102) {
      return _ref66.apply(this, arguments);
    };
  }());

  /**
   * 换头像
   * POST /api/me/avatar
   * - multipart/form-data 字段 avatar（图片文件，≤2MB）
   * - 或 JSON: { avatar: "https://..." | "/uploads/avatars/..." }
   * - 或 JSON: { avatar: null } 清空
   */
  router.post("/me/avatar", authenticateToken, function (req, res, next) {
    var ct = String(req.headers["content-type"] || "");
    if (ct.includes("multipart/form-data")) {
      return avatarUpload.single("avatar")(req, res, function (err) {
        if (err) {
          var msg = err instanceof multer.MulterError ? err.code === "LIMIT_FILE_SIZE" ? "头像文件不能超过 2MB" : err.message : err.message || "上传失败";
          return res.status(400).json({
            error: msg
          });
        }
        next();
      });
    }
    next();
  }, /*#__PURE__*/function () {
    var _ref67 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51(req, res) {
      var _user$signature2, user, nextAvatar, ext, filename, fullPath, body, url, _t90;
      return _regenerator().w(function (_context52) {
        while (1) switch (_context52.p = _context52.n) {
          case 0:
            _context52.p = 0;
            user = req.user;
            if (!req.file) {
              _context52.n = 1;
              break;
            }
            ensureAvatarDir();
            ext = AVATAR_MIME_EXT[req.file.mimetype] || ".jpg";
            filename = "".concat(user.id, "-").concat(Date.now()).concat(ext);
            fullPath = path.join(getAvatarUploadDir(), filename);
            fs.writeFileSync(fullPath, req.file.buffer);
            nextAvatar = "/uploads/avatars/".concat(filename);
            _context52.n = 5;
            break;
          case 1:
            body = req.body || {};
            if (!(body.avatar === null || body.avatar === "" || body.clear === true)) {
              _context52.n = 2;
              break;
            }
            nextAvatar = null;
            _context52.n = 5;
            break;
          case 2:
            if (!(typeof body.avatar === "string")) {
              _context52.n = 4;
              break;
            }
            url = body.avatar.trim();
            if (isValidAvatarUrl(url)) {
              _context52.n = 3;
              break;
            }
            return _context52.a(2, res.status(400).json({
              error: "avatar 须为 http(s) URL 或 /uploads/avatars/ 路径"
            }));
          case 3:
            nextAvatar = url;
            _context52.n = 5;
            break;
          case 4:
            return _context52.a(2, res.status(400).json({
              error: "请上传 avatar 文件，或 JSON 提供 avatar URL / null"
            }));
          case 5:
            tryRemoveLocalAvatar(user.avatar);
            _context52.n = 6;
            return dbService.updateUserAvatar(user.id, nextAvatar);
          case 6:
            user.avatar = nextAvatar;
            _context52.n = 7;
            return logUserEvent(user.id, "avatar_updated", nextAvatar ? "已更新头像" : "已清除头像", {
              avatar: nextAvatar
            });
          case 7:
            return _context52.a(2, res.status(200).json({
              avatar: nextAvatar,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: nextAvatar,
                signature: (_user$signature2 = user.signature) !== null && _user$signature2 !== void 0 ? _user$signature2 : null
              }
            }));
          case 8:
            _context52.p = 8;
            _t90 = _context52.v;
            logger.error("POST /me/avatar failed:", _t90);
            return _context52.a(2, res.status(500).json({
              error: _t90.message || "Failed to update avatar"
            }));
        }
      }, _callee51, null, [[0, 8]]);
    }));
    return function (_x103, _x104) {
      return _ref67.apply(this, arguments);
    };
  }());

  /**
   * 更新个人签名
   * PUT|PATCH|POST /api/me/signature
   * Body: { signature: string | null }  最长 200 字；null/"" 清空
   */
  function handleUpdateSignature(_x105, _x106) {
    return _handleUpdateSignature.apply(this, arguments);
  }
  function _handleUpdateSignature() {
    _handleUpdateSignature = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee57(req, res) {
      var _user$avatar2, user, body, signature, _t111;
      return _regenerator().w(function (_context58) {
        while (1) switch (_context58.p = _context58.n) {
          case 0:
            _context58.p = 0;
            user = req.user;
            body = req.body || {};
            if (Object.prototype.hasOwnProperty.call(body, "signature")) {
              _context58.n = 1;
              break;
            }
            return _context58.a(2, res.status(400).json({
              error: "signature field required"
            }));
          case 1:
            if (!(body.signature === null || body.signature === "")) {
              _context58.n = 2;
              break;
            }
            signature = null;
            _context58.n = 5;
            break;
          case 2:
            if (!(typeof body.signature === "string")) {
              _context58.n = 4;
              break;
            }
            signature = body.signature.trim();
            if (!(signature.length > SIGNATURE_MAX_LENGTH)) {
              _context58.n = 3;
              break;
            }
            return _context58.a(2, res.status(400).json({
              error: "signature \u6700\u957F ".concat(SIGNATURE_MAX_LENGTH, " \u5B57")
            }));
          case 3:
            if (signature === "") signature = null;
            _context58.n = 5;
            break;
          case 4:
            return _context58.a(2, res.status(400).json({
              error: "signature must be string or null"
            }));
          case 5:
            _context58.n = 6;
            return dbService.updateUserSignature(user.id, signature);
          case 6:
            user.signature = signature;
            _context58.n = 7;
            return logUserEvent(user.id, "signature_updated", signature ? "已更新签名" : "已清除签名", {
              signature: signature
            });
          case 7:
            return _context58.a(2, res.status(200).json({
              signature: signature,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: (_user$avatar2 = user.avatar) !== null && _user$avatar2 !== void 0 ? _user$avatar2 : null,
                signature: signature
              }
            }));
          case 8:
            _context58.p = 8;
            _t111 = _context58.v;
            logger.error("update signature failed:", _t111);
            return _context58.a(2, res.status(500).json({
              error: _t111.message || "Failed to update signature"
            }));
        }
      }, _callee57, null, [[0, 8]]);
    }));
    return _handleUpdateSignature.apply(this, arguments);
  }
  router.put("/me/signature", authenticateToken, handleUpdateSignature);
  router.patch("/me/signature", authenticateToken, handleUpdateSignature);
  router.post("/me/signature", authenticateToken, handleUpdateSignature);

  // ── 手动触发 AI 处理邮件 ───────────────────────────

  router.post("/emails/:emailId/ai-process", authenticateToken, /*#__PURE__*/function () {
    var _ref68 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52(req, res) {
      var _req$body3, user, emailId, email, scheduleQueue, todoQueue, _i3, _arr, _parsed3, item, parsed, source, result, queueItems, _iterator9, _step9, qid, _item, todoQueueItems, _iterator0, _step0, _qid, _item2, message, parts, _message, _t91, _t92, _t93, _t94, _t95, _t96;
      return _regenerator().w(function (_context53) {
        while (1) switch (_context53.p = _context53.n) {
          case 0:
            _context53.p = 0;
            user = req.user;
            emailId = req.params.emailId; // 获取邮件详情
            email = null;
            if (!user.imapClient) {
              _context53.n = 4;
              break;
            }
            _context53.p = 1;
            _context53.n = 2;
            return user.imapClient.getEmailById(emailId);
          case 2:
            email = _context53.v;
            _context53.n = 4;
            break;
          case 3:
            _context53.p = 3;
            _t91 = _context53.v;
          case 4:
            if (!(!email && user.emsClient)) {
              _context53.n = 8;
              break;
            }
            _context53.p = 5;
            _context53.n = 6;
            return user.emsClient.getEmailById(emailId);
          case 6:
            email = _context53.v;
            _context53.n = 8;
            break;
          case 7:
            _context53.p = 7;
            _t92 = _context53.v;
          case 8:
            if (email) {
              _context53.n = 16;
              break;
            }
            _context53.n = 9;
            return dbService.getScheduleQueueByUser(user.id);
          case 9:
            scheduleQueue = _context53.v;
            _context53.n = 10;
            return dbService.getTodoQueueByUser(user.id);
          case 10:
            todoQueue = _context53.v;
            _i3 = 0, _arr = [].concat(_toConsumableArray(scheduleQueue), _toConsumableArray(todoQueue));
          case 11:
            if (!(_i3 < _arr.length)) {
              _context53.n = 16;
              break;
            }
            item = _arr[_i3];
            parsed = null;
            _context53.p = 12;
            parsed = JSON.parse(item.rawRequest);
            _context53.n = 14;
            break;
          case 13:
            _context53.p = 13;
            _t93 = _context53.v;
            return _context53.a(3, 15);
          case 14:
            if (!(((_parsed3 = parsed) === null || _parsed3 === void 0 || (_parsed3 = _parsed3.email) === null || _parsed3 === void 0 ? void 0 : _parsed3.id) === emailId)) {
              _context53.n = 15;
              break;
            }
            email = parsed.email;
            return _context53.a(3, 16);
          case 15:
            _i3++;
            _context53.n = 11;
            break;
          case 16:
            if (email) {
              _context53.n = 17;
              break;
            }
            return _context53.a(2, res.status(404).json({
              error: "Email not found"
            }));
          case 17:
            _context53.n = 18;
            return dbService.deleteAiProcessedEmail(user.id, emailId);
          case 18:
            // 运行 AI 处理管道
            source = ((_req$body3 = req.body) === null || _req$body3 === void 0 ? void 0 : _req$body3.source) || "manual";
            _context53.n = 19;
            return processEmailWithLLM(user, email, source);
          case 19:
            result = _context53.v;
            // 获取刚创建的队列项详情（供前端即时审批）
            queueItems = [];
            _iterator9 = _createForOfIteratorHelper(result.queueIds);
            _context53.p = 20;
            _iterator9.s();
          case 21:
            if ((_step9 = _iterator9.n()).done) {
              _context53.n = 24;
              break;
            }
            qid = _step9.value;
            _context53.n = 22;
            return dbService.getScheduleQueueById(qid);
          case 22:
            _item = _context53.v;
            if (_item) queueItems.push(_item);
          case 23:
            _context53.n = 21;
            break;
          case 24:
            _context53.n = 26;
            break;
          case 25:
            _context53.p = 25;
            _t94 = _context53.v;
            _iterator9.e(_t94);
          case 26:
            _context53.p = 26;
            _iterator9.f();
            return _context53.f(26);
          case 27:
            todoQueueItems = [];
            _iterator0 = _createForOfIteratorHelper(result.todoQueueIds);
            _context53.p = 28;
            _iterator0.s();
          case 29:
            if ((_step0 = _iterator0.n()).done) {
              _context53.n = 32;
              break;
            }
            _qid = _step0.value;
            _context53.n = 30;
            return dbService.getTodoQueueById(_qid);
          case 30:
            _item2 = _context53.v;
            if (_item2) todoQueueItems.push(_item2);
          case 31:
            _context53.n = 29;
            break;
          case 32:
            _context53.n = 34;
            break;
          case 33:
            _context53.p = 33;
            _t95 = _context53.v;
            _iterator0.e(_t95);
          case 34:
            _context53.p = 34;
            _iterator0.f();
            return _context53.f(34);
          case 35:
            if (result.validationFailed) {
              message = "AI 处理完成，但工具/时间校验失败，已记录错误日志";
            } else if (result.toolCallsTriggered) {
              parts = [];
              if (result.queuedSchedules.length > 0) {
                parts.push("".concat(result.queuedSchedules.length, " \u4E2A\u65E5\u7A0B"));
              }
              if (result.queuedTodos.length > 0) {
                parts.push("".concat(result.queuedTodos.length, " \u4E2A\u5F85\u529E"));
              }
              message = parts.length > 0 ? "AI \u5DF2\u5904\u7406\uFF0C\u5165\u961F ".concat(parts.join(" / ")) : "AI 已处理，工具调用未成功入队";
            } else {
              message = "AI 已处理，未触发日程/待办创建";
            }
            return _context53.a(2, res.status(200).json({
              success: true,
              queuedSchedules: result.queuedSchedules,
              queueItems: queueItems,
              queuedTodos: result.queuedTodos,
              todoQueueItems: todoQueueItems,
              toolCallsTriggered: result.toolCallsTriggered,
              validationFailed: result.validationFailed || false,
              lastValidationError: result.lastValidationError,
              message: message
            }));
          case 36:
            _context53.p = 36;
            _t96 = _context53.v;
            _message = _t96 instanceof Error ? _t96.message : String(_t96);
            logger.error("手动 AI 处理邮件失败:", _message);
            return _context53.a(2, res.status(500).json({
              error: _message || "AI 处理失败"
            }));
        }
      }, _callee52, null, [[28, 33, 34, 35], [20, 25, 26, 27], [12, 13], [5, 7], [1, 3], [0, 36]]);
    }));
    return function (_x107, _x108) {
      return _ref68.apply(this, arguments);
    };
  }());

  // ── 日程分享 ──────────────────────────────────────

  // 创建分享链接
  router.post("/share/create", authenticateToken, /*#__PURE__*/function () {
    var _ref69 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee53(req, res) {
      var user, _ref70, name, dateStart, dateEnd, taskIds, expiresInDays, token, id, expiresAt, shareUrl, message, _t97;
      return _regenerator().w(function (_context54) {
        while (1) switch (_context54.p = _context54.n) {
          case 0:
            _context54.p = 0;
            user = req.user;
            _ref70 = req.body || {}, name = _ref70.name, dateStart = _ref70.dateStart, dateEnd = _ref70.dateEnd, taskIds = _ref70.taskIds, expiresInDays = _ref70.expiresInDays;
            if (!(dateStart || dateEnd || taskIds && taskIds.length > 0)) {
              _context54.n = 1;
              break;
            }
            _context54.n = 3;
            break;
          case 1:
            if (!(!dateStart && !dateEnd && (!taskIds || taskIds.length === 0))) {
              _context54.n = 2;
              break;
            }
            _context54.n = 3;
            break;
          case 2:
            return _context54.a(2, res.status(400).json({
              error: "请选择分享的日程范围或指定日程"
            }));
          case 3:
            token = uuidv4().replace(/-/g, "").substring(0, 16);
            id = uuidv4();
            expiresAt = expiresInDays && expiresInDays > 0 ? new Date(Date.now() + expiresInDays * 86400000).toISOString() : null;
            _context54.n = 4;
            return dbService.createSharedSchedule({
              id: id,
              userId: user.id,
              token: token,
              name: name || "日程分享",
              dateStart: dateStart || null,
              dateEnd: dateEnd || null,
              taskIds: taskIds ? JSON.stringify(taskIds) : null,
              expiresAt: expiresAt
            });
          case 4:
            shareUrl = "".concat(frontendUrl, "/share/").concat(token);
            return _context54.a(2, res.status(200).json({
              token: token,
              shareUrl: shareUrl,
              expiresAt: expiresAt
            }));
          case 5:
            _context54.p = 5;
            _t97 = _context54.v;
            message = _t97 instanceof Error ? _t97.message : String(_t97);
            logger.error("Failed to create share:", message);
            return _context54.a(2, res.status(500).json({
              error: "创建分享失败"
            }));
        }
      }, _callee53, null, [[0, 5]]);
    }));
    return function (_x109, _x110) {
      return _ref69.apply(this, arguments);
    };
  }());

  // 获取用户的分享列表
  router.get("/share/list", authenticateToken, /*#__PURE__*/function () {
    var _ref71 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee54(req, res) {
      var user, shares, message, _t98;
      return _regenerator().w(function (_context55) {
        while (1) switch (_context55.p = _context55.n) {
          case 0:
            _context55.p = 0;
            user = req.user;
            _context55.n = 1;
            return dbService.getSharedSchedulesByUser(user.id);
          case 1:
            shares = _context55.v;
            return _context55.a(2, res.status(200).json({
              shares: shares.map(function (s) {
                return {
                  id: s.id,
                  token: s.token,
                  name: s.name,
                  dateStart: s.dateStart,
                  dateEnd: s.dateEnd,
                  taskIds: s.taskIds ? JSON.parse(s.taskIds) : null,
                  expiresAt: s.expiresAt,
                  createdAt: s.createdAt,
                  shareUrl: "".concat(frontendUrl, "/share/").concat(s.token)
                };
              })
            }));
          case 2:
            _context55.p = 2;
            _t98 = _context55.v;
            message = _t98 instanceof Error ? _t98.message : String(_t98);
            logger.error("Failed to list shares:", message);
            return _context55.a(2, res.status(500).json({
              error: "获取分享列表失败"
            }));
        }
      }, _callee54, null, [[0, 2]]);
    }));
    return function (_x111, _x112) {
      return _ref71.apply(this, arguments);
    };
  }());

  // 删除分享链接
  router["delete"]("/share/:token", authenticateToken, /*#__PURE__*/function () {
    var _ref72 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee55(req, res) {
      var user, deleted, message, _t99;
      return _regenerator().w(function (_context56) {
        while (1) switch (_context56.p = _context56.n) {
          case 0:
            _context56.p = 0;
            user = req.user;
            _context56.n = 1;
            return dbService.deleteSharedSchedule(req.params.token, user.id);
          case 1:
            deleted = _context56.v;
            if (deleted) {
              _context56.n = 2;
              break;
            }
            return _context56.a(2, res.status(404).json({
              error: "分享链接不存在"
            }));
          case 2:
            return _context56.a(2, res.status(200).json({
              message: "已删除"
            }));
          case 3:
            _context56.p = 3;
            _t99 = _context56.v;
            message = _t99 instanceof Error ? _t99.message : String(_t99);
            logger.error("Failed to delete share:", message);
            return _context56.a(2, res.status(500).json({
              error: "删除分享失败"
            }));
        }
      }, _callee55, null, [[0, 3]]);
    }));
    return function (_x113, _x114) {
      return _ref72.apply(this, arguments);
    };
  }());

  // 公开端点：查看分享的日程（无需登录）
  router.get("/share/view/:token", /*#__PURE__*/function () {
    var _ref73 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee56(req, res) {
      var _yield$dbService$getU2, share, tasks, ids, _iterator1, _step1, tid, t, message, _t100, _t101, _t102, _t103, _t104, _t105, _t106, _t107, _t108, _t109, _t110;
      return _regenerator().w(function (_context57) {
        while (1) switch (_context57.p = _context57.n) {
          case 0:
            _context57.p = 0;
            _context57.n = 1;
            return dbService.getSharedScheduleByToken(req.params.token);
          case 1:
            share = _context57.v;
            if (share) {
              _context57.n = 2;
              break;
            }
            return _context57.a(2, res.status(404).json({
              error: "分享链接不存在或已失效"
            }));
          case 2:
            if (!(share.expiresAt && new Date(share.expiresAt) < new Date())) {
              _context57.n = 3;
              break;
            }
            return _context57.a(2, res.status(410).json({
              error: "分享链接已过期"
            }));
          case 3:
            if (!share.taskIds) {
              _context57.n = 12;
              break;
            }
            ids = JSON.parse(share.taskIds);
            tasks = [];
            _iterator1 = _createForOfIteratorHelper(ids);
            _context57.p = 4;
            _iterator1.s();
          case 5:
            if ((_step1 = _iterator1.n()).done) {
              _context57.n = 8;
              break;
            }
            tid = _step1.value;
            _context57.n = 6;
            return dbService.getTaskById(tid);
          case 6:
            t = _context57.v;
            if (t && t.userId === share.userId) {
              tasks.push(t);
            }
          case 7:
            _context57.n = 5;
            break;
          case 8:
            _context57.n = 10;
            break;
          case 9:
            _context57.p = 9;
            _t100 = _context57.v;
            _iterator1.e(_t100);
          case 10:
            _context57.p = 10;
            _iterator1.f();
            return _context57.f(10);
          case 11:
            _context57.n = 14;
            break;
          case 12:
            _context57.n = 13;
            return dbService.getTasksByUserId(share.userId);
          case 13:
            tasks = _context57.v;
            if (share.dateStart || share.dateEnd) {
              tasks = tasks.filter(function (t) {
                if (!t.startTime) return false;
                var st = new Date(t.startTime).getTime();
                if (share.dateStart && st < new Date(share.dateStart).getTime()) return false;
                if (share.dateEnd && st > new Date(share.dateEnd).getTime()) return false;
                return true;
              });
            }
          case 14:
            _t101 = res.status(200);
            _t102 = {
              name: share.name,
              createdAt: share.createdAt
            };
            _t103 = tasks.map(function (t) {
              return {
                id: t.id,
                name: t.name,
                description: t.description,
                startTime: t.startTime,
                endTime: t.endTime,
                location: t.location,
                importance: t.importance,
                completed: t.completed
              };
            });
            _context57.n = 15;
            return dbService.getUserById(share.userId);
          case 15:
            _t106 = _yield$dbService$getU2 = _context57.v;
            _t105 = _t106 === null;
            if (_t105) {
              _context57.n = 16;
              break;
            }
            _t105 = _yield$dbService$getU2 === void 0;
          case 16:
            if (!_t105) {
              _context57.n = 17;
              break;
            }
            _t107 = void 0;
            _context57.n = 18;
            break;
          case 17:
            _t107 = _yield$dbService$getU2.name;
          case 18:
            _t104 = _t107;
            if (_t104) {
              _context57.n = 19;
              break;
            }
            _t104 = "未知用户";
          case 19:
            _t108 = _t104;
            _t109 = {
              name: _t108
            };
            return _context57.a(2, _t101.json.call(_t101, {
              share: _t102,
              tasks: _t103,
              user: _t109
            }));
          case 20:
            _context57.p = 20;
            _t110 = _context57.v;
            message = _t110 instanceof Error ? _t110.message : String(_t110);
            logger.error("Failed to view share:", message);
            return _context57.a(2, res.status(500).json({
              error: "加载分享失败"
            }));
        }
      }, _callee56, null, [[4, 9, 10, 11], [0, 20]]);
    }));
    return function (_x115, _x116) {
      return _ref73.apply(this, arguments);
    };
  }());
  return router;
}
