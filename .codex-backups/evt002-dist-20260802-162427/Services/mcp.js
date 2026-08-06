function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { resolveScheduleType, scheduleTypeValues } from "./types.js";
import { dbService } from "./dbService.js";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../Utils/logger.js";
import { z } from "zod";
import { findConflictingTasks } from "./scheduleConflict.js";
import { logUserEvent } from "./userLog.js";
import { toShanghaiISO, ensureTimezone } from "../Utils/time.js";
import { generateRecurrenceInstances, buildRecurrenceSummary } from "./recurrence.js";
import { broadcastTaskChange } from "./websocket.js";
// Store active transports: sessionId -> Transport
var transports = new Map();
export var mcpTools = {
  read_emails: {
    name: "read_emails",
    description: "Read recent emails from the user's inbox, or read a specific email by ID with full body content. " + "Without id, lists recent emails with summaries. With id, returns the full email body for that specific email.",
    schema: {
      limit: z.number().optional().describe("Number of emails to read (default 5, only used when id is not provided)"),
      id: z.string().optional().describe("Email ID to read full body content")
    },
    execute: function () {
      var _execute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(args, user) {
        var client, email, emails, fullEmails, emailSummaries, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              if (!(!user.emsClient && !user.imapClient)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, {
                content: [{
                  type: "text",
                  text: "No email client initialized. Please bind Exchange or SMTP first and wait for the background sync."
                }]
              });
            case 1:
              _context2.p = 1;
              client = user.emsClient || user.imapClient; // 按 ID 读取单封邮件正文
              if (!args.id) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return client.getEmailById(args.id);
            case 2:
              email = _context2.v;
              return _context2.a(2, {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    id: email.id,
                    subject: email.subject,
                    sender: email.from ? email.from.name : "Unknown",
                    senderAddress: email.from ? email.from.address : undefined,
                    receivedAt: email.receivedAt,
                    isRead: email.isRead,
                    hasAttachments: email.hasAttachments,
                    body: email.body
                  }, null, 2)
                }]
              });
            case 3:
              _context2.n = 4;
              return client.findEmails(args.limit || 5);
            case 4:
              emails = _context2.v;
              _context2.n = 5;
              return Promise.all(emails.map(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
                  var _t;
                  return _regenerator().w(function (_context) {
                    while (1) switch (_context.p = _context.n) {
                      case 0:
                        _context.p = 0;
                        _context.n = 1;
                        return client.getEmailById(e.id);
                      case 1:
                        return _context.a(2, _context.v);
                      case 2:
                        _context.p = 2;
                        _t = _context.v;
                        return _context.a(2, e);
                    }
                  }, _callee, null, [[0, 2]]);
                }));
                return function (_x3) {
                  return _ref.apply(this, arguments);
                };
              }()));
            case 5:
              fullEmails = _context2.v;
              emailSummaries = fullEmails.map(function (e) {
                return {
                  id: e.id,
                  subject: e.subject,
                  sender: e.from ? e.from.name : "Unknown",
                  body: e.body
                };
              });
              return _context2.a(2, {
                content: [{
                  type: "text",
                  text: JSON.stringify(emailSummaries, null, 2)
                }]
              });
            case 6:
              _context2.p = 6;
              _t2 = _context2.v;
              return _context2.a(2, {
                content: [{
                  type: "text",
                  text: "Error reading emails: ".concat(_t2.message)
                }]
              });
          }
        }, _callee2, null, [[1, 6]]);
      }));
      function execute(_x, _x2) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }()
  },
  search_emails: {
    name: "search_emails",
    description: "Search emails by keyword. Searches subject, sender name, and sender address. Returns matching email summaries. Use this to find specific emails by topic, sender, or keyword.",
    schema: {
      query: z.string().describe("Search keyword — matched against subject and sender"),
      limit: z.number().optional().describe("Max results (default 20, max 50)")
    },
    execute: function () {
      var _execute2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(args, user) {
        var client, query, fetchLimit, limit, emails, matched, paged, summaries, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              if (!(!args.query || !args.query.trim())) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2, {
                content: [{
                  type: "text",
                  text: "Please provide a search query."
                }]
              });
            case 1:
              if (!(!user.emsClient && !user.imapClient)) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2, {
                content: [{
                  type: "text",
                  text: "No email client initialized. Please bind Exchange or SMTP first."
                }]
              });
            case 2:
              _context3.p = 2;
              client = user.emsClient || user.imapClient;
              query = args.query.toLowerCase().trim();
              fetchLimit = Math.max((args.limit || 20) * 5, 100);
              limit = Math.min(args.limit || 20, 50);
              _context3.n = 3;
              return client.findEmails(fetchLimit);
            case 3:
              emails = _context3.v;
              matched = emails.filter(function (e) {
                var _e$from, _e$from2;
                var subject = (e.subject || "").toLowerCase();
                var fromName = (((_e$from = e.from) === null || _e$from === void 0 ? void 0 : _e$from.name) || "").toLowerCase();
                var fromAddr = (((_e$from2 = e.from) === null || _e$from2 === void 0 ? void 0 : _e$from2.address) || "").toLowerCase();
                return subject.includes(query) || fromName.includes(query) || fromAddr.includes(query);
              });
              paged = matched.slice(0, limit);
              summaries = paged.map(function (e) {
                return {
                  id: e.id,
                  subject: e.subject,
                  from: e.from,
                  receivedAt: e.receivedAt
                };
              });
              return _context3.a(2, {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    total: matched.length,
                    returned: summaries.length,
                    emails: summaries
                  }, null, 2)
                }]
              });
            case 4:
              _context3.p = 4;
              _t3 = _context3.v;
              return _context3.a(2, {
                content: [{
                  type: "text",
                  text: "Error searching emails: ".concat(_t3.message)
                }]
              });
          }
        }, _callee3, null, [[2, 4]]);
      }));
      function execute(_x4, _x5) {
        return _execute2.apply(this, arguments);
      }
      return execute;
    }()
  },
  add_schedule: {
    name: "add_schedule",
    description: "Add a new calendar schedule (有开始时间的时段事项). Use ONLY when the item has a start time (startTime). " + "If there is only a due date / deadline and no start time, or no time at all, use add_todo instead. " + "Do NOT invent a startTime to force this tool.",
    schema: {
      name: z.string().describe("The title of the task, extracted from the email subject or content. MUST be provided."),
      startTime: z.string().optional().describe("REQUIRED for schedule: Start time in ISO 8601 format (e.g. 2023-10-01T09:00:00+08:00). If timezone is not specified in the email, assume China Standard Time (UTC+8). Without startTime this tool is invalid — use add_todo."),
      endTime: z.string().optional().describe("End time in ISO 8601 format. Optional if startTime is present. Assume UTC+8 if not specified. Do NOT use endTime alone with this tool."),
      description: z.string().optional().describe("Detailed description of the task, including any relevant content from the email body."),
      recurrenceRule: z.any().optional().describe("Optional recurrence rule object, supports freq 'daily'|'weekly'|'weeklyByWeekNumber'|'dailyOnDays'"),
      location: z.string().optional().describe("Location of the event"),
      type: z["enum"](["meeting", "todo"]).optional().describe("Type of the schedule"),
      importance: z["enum"](["high", "normal", "low"]).optional().describe("Importance of the task (high/normal/low)"),
      importanceScore: z.number().min(-1).max(1).optional().describe("Eisenhower importance axis in [-1, 1]: positive = more important, negative = less important. Always set based on content urgency/priority."),
      urgencyScore: z.number().min(-1).max(1).optional().describe("Eisenhower urgency axis in [-1, 1]: positive = more urgent (near deadline/now), negative = not urgent. Always set based on time pressure."),
      isReminderOn: z["boolean"]().optional().describe("Whether to set a reminder"),
      allowConflict: z["boolean"]().optional().describe("Set to true to force-add the schedule even if it overlaps with existing tasks. Use this ONLY when the user explicitly requests to add despite conflicts (e.g. '强制添加', 'force add', 'add anyway')."),
      scheduleType: z["enum"](scheduleTypeValues).optional().describe("Explicit schedule type metadata controlling recurrence behavior")
    },
    execute: function () {
      var _execute3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(args, user) {
        var name, startTime, endTime, description, location, importance, importanceScore, urgencyScore, isReminderOn, recurrenceRule, scheduleType, allowConflictOverride, publicAllowConflict, effectiveAllowConflict, start, isValidDate, parsedRecurrence, resolvedScheduleType, resolved, _err$message, msg, resolvedRecurrenceRule, parentConflicts, _yield$dbService$getT, existingTasks, candidate, conflictNames, message, newTask, eventData, generated, createdIds, instanceConflicts, createdChildren, errorChildren, _iterator, _step, inst, instConf, ev, db, rawRequest, queueId, _t4, _t5, _t6, _t7, _t8, _t9, _t0, _t1;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              name = args.name, startTime = args.startTime, endTime = args.endTime, description = args.description, location = args.location, importance = args.importance, importanceScore = args.importanceScore, urgencyScore = args.urgencyScore, isReminderOn = args.isReminderOn, recurrenceRule = args.recurrenceRule, scheduleType = args.scheduleType;
              allowConflictOverride = args._internal_allow_conflict === true;
              publicAllowConflict = args.allowConflict === true;
              effectiveAllowConflict = allowConflictOverride || publicAllowConflict || !!user.isConflictScheduleAllowed;
              if (name) {
                _context4.n = 1;
                break;
              }
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Error: Task name is required."
                }]
              });
            case 1:
              if (startTime) startTime = ensureTimezone(startTime);
              if (endTime) endTime = ensureTimezone(endTime);

              // Default time logic (use Shanghai ISO)
              if (!startTime) startTime = toShanghaiISO();
              if (!endTime) {
                start = new Date(startTime);
                start.setHours(start.getHours() + 1);
                endTime = toShanghaiISO(start);
              }

              // Validate dates
              isValidDate = function isValidDate(d) {
                return !isNaN(new Date(d).getTime());
              };
              if (!(!isValidDate(startTime) || !isValidDate(endTime))) {
                _context4.n = 2;
                break;
              }
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Error: Invalid date format. Start=".concat(startTime, ", End=").concat(endTime)
                }]
              });
            case 2:
              _context4.p = 2;
              resolved = resolveScheduleType({
                explicit: scheduleType,
                recurrence: recurrenceRule,
                fallback: "single"
              });
              parsedRecurrence = resolved.parsedRecurrence;
              resolvedScheduleType = resolved.scheduleType;
              _context4.n = 4;
              break;
            case 3:
              _context4.p = 3;
              _t4 = _context4.v;
              msg = _t4 !== null && _t4 !== void 0 && (_err$message = _t4.message) !== null && _err$message !== void 0 && _err$message.includes("recurrenceRule") ? "Invalid recurrenceRule value" : "Invalid scheduleType value";
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: msg
                }]
              });
            case 4:
              resolvedRecurrenceRule = parsedRecurrence !== null && parsedRecurrence !== void 0 ? parsedRecurrence : recurrenceRule; // Check for conflicts
              parentConflicts = [];
              _context4.p = 5;
              _context4.n = 6;
              return dbService.getTasksPage(user.id, {
                start: startTime,
                end: endTime,
                limit: 100
              });
            case 6:
              _yield$dbService$getT = _context4.v;
              existingTasks = _yield$dbService$getT.tasks;
              candidate = {
                id: "new-task",
                startTime: startTime,
                endTime: endTime
              };
              parentConflicts = findConflictingTasks(existingTasks, candidate, {
                boundaryConflict: !!user.conflictBoundaryInclusive
              });
              if (!(!allowConflictOverride && parentConflicts.length > 0 && !resolvedRecurrenceRule)) {
                _context4.n = 8;
                break;
              }
              conflictNames = parentConflicts.map(function (t) {
                return t.name;
              }).join(", ");
              message = "Schedule conflict detected with: ".concat(conflictNames); // Trigger user log event
              _context4.n = 7;
              return logUserEvent(user.id, "schedule_conflict", message, {
                candidate: {
                  name: name,
                  startTime: startTime,
                  endTime: endTime
                },
                conflicts: parentConflicts
              });
            case 7:
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Task creation skipped due to conflict with: ".concat(conflictNames, ". A notification has been sent. To force-add despite the conflict, retry with allowConflict: true.")
                }]
              });
            case 8:
              _context4.n = 10;
              break;
            case 9:
              _context4.p = 9;
              _t5 = _context4.v;
              logger.error("Error checking conflicts: ".concat(_t5));
            case 10:
              newTask = {
                id: uuidv4(),
                name: name,
                startTime: startTime,
                endTime: endTime,
                dueDate: endTime,
                description: description || "",
                location: location || "",
                completed: false,
                pushedToMSTodo: false,
                scheduleType: resolvedScheduleType,
                importance: importance || "normal",
                importanceScore: typeof importanceScore === "number" ? importanceScore : undefined,
                urgencyScore: typeof urgencyScore === "number" ? urgencyScore : undefined,
                isReminderOn: isReminderOn
              }; // If caller explicitly sets _internal_approve, proceed to create directly (used by server APIs)
              if (!(args._internal_approve === true)) {
                _context4.n = 38;
                break;
              }
              _context4.p = 11;
              // If recurrenceRule provided, attach serialized rule to parent task
              if (resolvedRecurrenceRule) newTask.recurrenceRule = JSON.stringify(resolvedRecurrenceRule);
              _context4.n = 12;
              return dbService.addTask(user.id, newTask, !!user.conflictBoundaryInclusive, effectiveAllowConflict);
            case 12:
              _context4.n = 13;
              return dbService.refreshUserTasksIncremental(user, {
                addedIds: [newTask.id]
              });
            case 13:
              broadcastTaskChange("created", newTask, user.id);

              // Sync to Exchange Calendar if emsClient is available (parent only)
              if (!user.emsClient) {
                _context4.n = 17;
                break;
              }
              eventData = {
                subject: newTask.name,
                body: newTask.description,
                start: newTask.startTime,
                end: newTask.endTime,
                location: newTask.location || "",
                attendees: [],
                importance: newTask.importance,
                isReminderOn: newTask.isReminderOn
              };
              _context4.p = 14;
              _context4.n = 15;
              return user.emsClient.createEvent(eventData);
            case 15:
              logger.success("Task synced to Exchange Calendar: ".concat(newTask.name));
              _context4.n = 17;
              break;
            case 16:
              _context4.p = 16;
              _t6 = _context4.v;
              logger.error("Failed to sync task to Exchange Calendar: ".concat(_t6.message));
            case 17:
              if (!resolvedRecurrenceRule) {
                _context4.n = 36;
                break;
              }
              generated = generateRecurrenceInstances(newTask, resolvedRecurrenceRule);
              createdIds = [newTask.id];
              instanceConflicts = [];
              createdChildren = 0, errorChildren = 0;
              _iterator = _createForOfIteratorHelper(generated);
              _context4.p = 18;
              _iterator.s();
            case 19:
              if ((_step = _iterator.n()).done) {
                _context4.n = 31;
                break;
              }
              inst = _step.value;
              _context4.p = 20;
              instConf = findConflictingTasks(user.tasks || [], inst, {
                boundaryConflict: !!user.conflictBoundaryInclusive
              });
              if (!(instConf.length > 0)) {
                _context4.n = 22;
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
              _context4.n = 21;
              return logUserEvent(user.id, "taskConflict", "Created recurrence instance with conflict ".concat(inst.name), {
                parentId: newTask.id,
                instanceStart: inst.startTime,
                instanceEnd: inst.endTime
              });
            case 21:
              _context4.n = 23;
              break;
            case 22:
              _context4.n = 23;
              return logUserEvent(user.id, "taskCreated", "Created recurrence instance ".concat(inst.name), {
                id: inst.id,
                parentTaskId: inst.parentTaskId,
                startTime: inst.startTime,
                endTime: inst.endTime
              });
            case 23:
              _context4.n = 24;
              return dbService.addTask(user.id, inst, !!user.conflictBoundaryInclusive, effectiveAllowConflict);
            case 24:
              createdChildren++;
              createdIds.push(inst.id);
              broadcastTaskChange("created", inst, user.id);

              // Sync instance to Exchange as separate event if desired
              if (!user.emsClient) {
                _context4.n = 28;
                break;
              }
              ev = {
                subject: inst.name,
                body: inst.description,
                start: inst.startTime,
                end: inst.endTime,
                location: inst.location || "",
                attendees: [],
                importance: inst.importance,
                isReminderOn: inst.isReminderOn
              };
              _context4.p = 25;
              _context4.n = 26;
              return user.emsClient.createEvent(ev);
            case 26:
              _context4.n = 28;
              break;
            case 27:
              _context4.p = 27;
              _t7 = _context4.v;
            case 28:
              _context4.n = 30;
              break;
            case 29:
              _context4.p = 29;
              _t8 = _context4.v;
              errorChildren++;
              _context4.n = 30;
              return logUserEvent(user.id, "taskError", "Error creating recurrence instance for ".concat(newTask.name), {
                parentId: newTask.id,
                error: _t8 === null || _t8 === void 0 ? void 0 : _t8.message
              });
            case 30:
              _context4.n = 19;
              break;
            case 31:
              _context4.n = 33;
              break;
            case 32:
              _context4.p = 32;
              _t9 = _context4.v;
              _iterator.e(_t9);
            case 33:
              _context4.p = 33;
              _iterator.f();
              return _context4.f(33);
            case 34:
              _context4.n = 35;
              return dbService.refreshUserTasksIncremental(user, {
                addedIds: createdIds
              });
            case 35:
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Task created successfully. ID: ".concat(newTask.id, ". Instances created: ").concat(createdChildren)
                }],
                task: newTask,
                recurrenceSummary: buildRecurrenceSummary(resolvedRecurrenceRule, createdChildren, 0, errorChildren),
                conflictWarning: parentConflicts.length > 0 || instanceConflicts.length > 0 ? {
                  message: "Task created with time conflicts",
                  conflicts: parentConflicts.map(function (c) {
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
            case 36:
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Task created successfully. ID: ".concat(newTask.id)
                }],
                task: newTask
              });
            case 37:
              _context4.p = 37;
              _t0 = _context4.v;
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Error creating task: ".concat(_t0.message)
                }]
              });
            case 38:
              _context4.p = 38;
              db = dbService;
              rawRequest = JSON.stringify({
                args: args,
                timestamp: toShanghaiISO()
              });
              _context4.n = 39;
              return db.addScheduleToQueue(user.id, rawRequest);
            case 39:
              queueId = _context4.v;
              _context4.n = 40;
              return logUserEvent(user.id, "external_schedule_request", "\u5916\u90E8\u8BF7\u6C42\u521B\u5EFA\u65E5\u7A0B: ".concat(name), {
                queueId: queueId,
                name: name,
                startTime: startTime,
                endTime: endTime
              });
            case 40:
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Request queued for user approval. Queue ID: ".concat(queueId)
                }],
                queued: true,
                queueId: queueId
              });
            case 41:
              _context4.p = 41;
              _t1 = _context4.v;
              logger.error("Failed to enqueue external schedule request:", _t1);
              return _context4.a(2, {
                content: [{
                  type: "text",
                  text: "Failed to queue request: ".concat((_t1 === null || _t1 === void 0 ? void 0 : _t1.message) || _t1)
                }]
              });
          }
        }, _callee4, null, [[38, 41], [25, 27], [20, 29], [18, 32, 33, 34], [14, 16], [11, 37], [5, 9], [2, 3]]);
      }));
      function execute(_x6, _x7) {
        return _execute3.apply(this, arguments);
      }
      return execute;
    }()
  },
  add_todo: {
    name: "add_todo",
    description: "Add a todo/待办 (no start time). Use when there is only a due date/deadline, or no time at all. " + "If the item has a start time (meeting, timed event), use add_schedule instead.",
    schema: {
      name: z.string().describe("Title of the todo. MUST be provided."),
      dueDate: z.string().optional().describe("Optional due date/deadline in ISO 8601 (UTC+8 if unspecified). Do NOT put a start time here."),
      description: z.string().optional().describe("Detailed description of the todo."),
      importance: z["enum"](["high", "normal", "low"]).optional().describe("Importance of the todo (high/normal/low)"),
      importanceScore: z.number().min(-1).max(1).optional().describe("Eisenhower importance axis in [-1, 1]: positive = more important, negative = less important. Always set based on content."),
      urgencyScore: z.number().min(-1).max(1).optional().describe("Eisenhower urgency axis in [-1, 1]: positive = more urgent, negative = not urgent. Always set based on deadline pressure.")
    },
    execute: function () {
      var _execute4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(args, user) {
        var name, dueDate, todo, rawRequest, queueId, _t10, _t11;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              name = (args.name || "").trim();
              if (name) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, {
                content: [{
                  type: "text",
                  text: "Error: Todo name is required."
                }]
              });
            case 1:
              dueDate = args.dueDate;
              if (dueDate) {
                try {
                  dueDate = ensureTimezone(dueDate);
                } catch (_unused) {
                  /* keep raw */
                }
              }
              if (!(args._internal_approve === true)) {
                _context5.n = 5;
                break;
              }
              _context5.p = 2;
              _context5.n = 3;
              return dbService.createTodo(user.id, {
                name: name,
                description: args.description || "",
                dueDate: dueDate,
                importance: args.importance || "normal",
                importanceScore: typeof args.importanceScore === "number" ? args.importanceScore : undefined,
                urgencyScore: typeof args.urgencyScore === "number" ? args.urgencyScore : undefined,
                tagIds: args.tagIds,
                tagNames: args.tagNames
              });
            case 3:
              todo = _context5.v;
              return _context5.a(2, {
                content: [{
                  type: "text",
                  text: "Todo created successfully. ID: ".concat(todo.id)
                }],
                todo: todo
              });
            case 4:
              _context5.p = 4;
              _t10 = _context5.v;
              return _context5.a(2, {
                content: [{
                  type: "text",
                  text: "Error creating todo: ".concat(_t10.message)
                }]
              });
            case 5:
              _context5.p = 5;
              rawRequest = JSON.stringify({
                args: {
                  name: name,
                  dueDate: dueDate,
                  description: args.description,
                  importance: args.importance,
                  importanceScore: args.importanceScore,
                  urgencyScore: args.urgencyScore,
                  tagIds: args.tagIds,
                  tagNames: args.tagNames
                },
                timestamp: toShanghaiISO()
              });
              _context5.n = 6;
              return dbService.addTodoToQueue(user.id, rawRequest);
            case 6:
              queueId = _context5.v;
              _context5.n = 7;
              return logUserEvent(user.id, "external_todo_request", "\u5916\u90E8\u8BF7\u6C42\u521B\u5EFA\u5F85\u529E: ".concat(name), {
                queueId: queueId,
                name: name,
                dueDate: dueDate
              });
            case 7:
              return _context5.a(2, {
                content: [{
                  type: "text",
                  text: "Todo request queued for user approval. Queue ID: ".concat(queueId)
                }],
                queued: true,
                queueId: queueId
              });
            case 8:
              _context5.p = 8;
              _t11 = _context5.v;
              logger.error("Failed to enqueue external todo request:", _t11);
              return _context5.a(2, {
                content: [{
                  type: "text",
                  text: "Failed to queue todo request: ".concat((_t11 === null || _t11 === void 0 ? void 0 : _t11.message) || _t11)
                }]
              });
          }
        }, _callee5, null, [[5, 8], [2, 4]]);
      }));
      function execute(_x8, _x9) {
        return _execute4.apply(this, arguments);
      }
      return execute;
    }()
  },
  delete_schedule: {
    name: "delete_schedule",
    description: "Delete a schedule/task by ID",
    schema: {
      taskId: z.string().describe("The ID of the task to delete")
    },
    execute: function () {
      var _execute5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(args, user) {
        var success, _t12;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return dbService.deleteTask(args.taskId);
            case 1:
              success = _context6.v;
              if (!success) {
                _context6.n = 3;
                break;
              }
              _context6.n = 2;
              return dbService.refreshUserTasksIncremental(user, {
                deletedIds: [args.taskId]
              });
            case 2:
              return _context6.a(2, {
                content: [{
                  type: "text",
                  text: "Task ".concat(args.taskId, " deleted successfully.")
                }]
              });
            case 3:
              return _context6.a(2, {
                content: [{
                  type: "text",
                  text: "Task ".concat(args.taskId, " not found or could not be deleted.")
                }]
              });
            case 4:
              _context6.n = 6;
              break;
            case 5:
              _context6.p = 5;
              _t12 = _context6.v;
              return _context6.a(2, {
                content: [{
                  type: "text",
                  text: "Error deleting task: ".concat(_t12.message)
                }]
              });
            case 6:
              return _context6.a(2);
          }
        }, _callee6, null, [[0, 5]]);
      }));
      function execute(_x0, _x1) {
        return _execute5.apply(this, arguments);
      }
      return execute;
    }()
  },
  update_schedule: {
    name: "update_schedule",
    description: "Update an existing schedule/task",
    schema: {
      taskId: z.string().describe("The ID of the task to update"),
      name: z.string().optional().describe("New title of the task"),
      startTime: z.string().optional().describe("New start time in ISO 8601 format"),
      endTime: z.string().optional().describe("New end time in ISO 8601 format"),
      description: z.string().optional().describe("New description of the task"),
      completed: z["boolean"]().optional().describe("Whether the task is completed")
    },
    execute: function () {
      var _execute6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(args, user) {
        var updates, updatedTask, _t13;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              updates = {};
              if (args.name !== undefined) updates.name = args.name;
              if (args.startTime !== undefined) updates.startTime = args.startTime;
              if (args.endTime !== undefined) updates.endTime = args.endTime;
              if (args.description !== undefined) updates.description = args.description;
              if (args.completed !== undefined) updates.completed = args.completed;
              if (!(Object.keys(updates).length === 0)) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2, {
                content: [{
                  type: "text",
                  text: "No updates provided."
                }]
              });
            case 1:
              _context7.n = 2;
              return dbService.patchTask(user.id, args.taskId, updates, !!user.conflictBoundaryInclusive);
            case 2:
              updatedTask = _context7.v;
              _context7.n = 3;
              return dbService.refreshUserTasksIncremental(user, {
                updatedIds: [args.taskId]
              });
            case 3:
              return _context7.a(2, {
                content: [{
                  type: "text",
                  text: "Task ".concat(args.taskId, " updated successfully.")
                }]
              });
            case 4:
              _context7.p = 4;
              _t13 = _context7.v;
              return _context7.a(2, {
                content: [{
                  type: "text",
                  text: "Error updating task: ".concat(_t13.message)
                }]
              });
          }
        }, _callee7, null, [[0, 4]]);
      }));
      function execute(_x10, _x11) {
        return _execute6.apply(this, arguments);
      }
      return execute;
    }()
  },
  get_schedule: {
    name: "get_schedule",
    description: "Get schedules within a time range",
    schema: {
      startDate: z.string().describe("Start date in ISO 8601 format"),
      endDate: z.string().describe("End date in ISO 8601 format")
    },
    execute: function () {
      var _execute7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(args, user) {
        var _yield$dbService$getT2, tasks, _t14;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return dbService.getTasksPage(user.id, {
                start: args.startDate,
                end: args.endDate,
                limit: 100
              });
            case 1:
              _yield$dbService$getT2 = _context8.v;
              tasks = _yield$dbService$getT2.tasks;
              return _context8.a(2, {
                content: [{
                  type: "text",
                  text: JSON.stringify(tasks, null, 2)
                }]
              });
            case 2:
              _context8.p = 2;
              _t14 = _context8.v;
              return _context8.a(2, {
                content: [{
                  type: "text",
                  text: "Error fetching schedule: ".concat(_t14.message)
                }]
              });
          }
        }, _callee8, null, [[0, 2]]);
      }));
      function execute(_x12, _x13) {
        return _execute7.apply(this, arguments);
      }
      return execute;
    }()
  },
  get_server_time: {
    name: "get_server_time",
    description: "Get the current server time. Use this only if the time provided in context is stale or you need a fresh reference.",
    schema: {},
    execute: function () {
      var _execute8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(args, user) {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              return _context9.a(2, {
                content: [{
                  type: "text",
                  text: toShanghaiISO()
                }]
              });
          }
        }, _callee9);
      }));
      function execute(_x14, _x15) {
        return _execute8.apply(this, arguments);
      }
      return execute;
    }()
  },
  search_tasks: {
    name: "search_tasks",
    description: "Search for tasks with various filters. Supports quadrant filtering for Eisenhower Matrix based queries.",
    schema: {
      q: z.string().optional().describe("Fuzzy search query for task name or description"),
      completed: z["boolean"]().optional().describe("Filter by completion status"),
      startDate: z.string().optional().describe("Filter tasks ending after this date (ISO 8601)"),
      endDate: z.string().optional().describe("Filter tasks starting before this date (ISO 8601)"),
      quadrant: z["enum"](["q1", "q2", "q3", "q4"]).optional().describe("Filter by Eisenhower quadrant: q1=urgent+important, q2=important, q3=urgent, q4=neither"),
      limit: z.number().optional().describe("Max number of results (default 50)"),
      offset: z.number().optional().describe("Pagination offset (default 0)"),
      sortBy: z["enum"](["startTime", "dueDate", "name", "endTime"]).optional().describe("Field to sort by"),
      order: z["enum"](["asc", "desc"]).optional().describe("Sort order")
    },
    execute: function () {
      var _execute9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(args, user) {
        var allTasks, filtered, q, total, limit, offset, tasks, _t15;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              _context0.n = 1;
              return dbService.getTasksByUserId(user.id);
            case 1:
              allTasks = _context0.v;
              filtered = allTasks;
              if (args.q) {
                q = args.q.toLowerCase();
                filtered = filtered.filter(function (t) {
                  return t.name.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q);
                });
              }
              if (typeof args.completed === "boolean") {
                filtered = filtered.filter(function (t) {
                  return t.completed === args.completed;
                });
              }
              if (args.startDate) {
                filtered = filtered.filter(function (t) {
                  return t.endTime >= args.startDate;
                });
              }
              if (args.endDate) {
                filtered = filtered.filter(function (t) {
                  return t.startTime <= args.endDate;
                });
              }
              if (args.quadrant) {
                filtered = filtered.filter(function (t) {
                  return t.quadrant === args.quadrant;
                });
              }
              total = filtered.length;
              limit = args.limit || 50;
              offset = args.offset || 0;
              tasks = filtered.slice(offset, offset + limit);
              return _context0.a(2, {
                content: [{
                  type: "text",
                  text: JSON.stringify({
                    tasks: tasks,
                    total: total
                  }, null, 2)
                }]
              });
            case 2:
              _context0.p = 2;
              _t15 = _context0.v;
              return _context0.a(2, {
                content: [{
                  type: "text",
                  text: "Error searching tasks: ".concat(_t15.message)
                }]
              });
          }
        }, _callee0, null, [[0, 2]]);
      }));
      function execute(_x16, _x17) {
        return _execute9.apply(this, arguments);
      }
      return execute;
    }()
  },
  get_quadrant_summary: {
    name: "get_quadrant_summary",
    description: "Get an Eisenhower Matrix summary showing how many tasks are in each quadrant, optionally filtered by date range. Useful for productivity analysis.",
    schema: {
      startDate: z.string().optional().describe("Filter tasks ending after this date (ISO 8601)"),
      endDate: z.string().optional().describe("Filter tasks starting before this date (ISO 8601)")
    },
    execute: function () {
      var _execute0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(args, user) {
        var allTasks, tasks, summary, _t16;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.p = 0;
              _context1.n = 1;
              return dbService.getTasksByUserId(user.id);
            case 1:
              allTasks = _context1.v;
              tasks = allTasks;
              if (args.startDate) tasks = tasks.filter(function (t) {
                return t.endTime >= args.startDate;
              });
              if (args.endDate) tasks = tasks.filter(function (t) {
                return t.startTime <= args.endDate;
              });
              summary = {
                total: tasks.length,
                q1: {
                  count: tasks.filter(function (t) {
                    return t.quadrant === "q1";
                  }).length,
                  label: "重要且紧急"
                },
                q2: {
                  count: tasks.filter(function (t) {
                    return t.quadrant === "q2";
                  }).length,
                  label: "重要不紧急"
                },
                q3: {
                  count: tasks.filter(function (t) {
                    return t.quadrant === "q3";
                  }).length,
                  label: "不重要但紧急"
                },
                q4: {
                  count: tasks.filter(function (t) {
                    return t.quadrant === "q4";
                  }).length,
                  label: "不重要不紧急"
                },
                unclassified: {
                  count: tasks.filter(function (t) {
                    return !t.quadrant;
                  }).length,
                  label: "未分类"
                }
              };
              return _context1.a(2, {
                content: [{
                  type: "text",
                  text: JSON.stringify(summary, null, 2)
                }]
              });
            case 2:
              _context1.p = 2;
              _t16 = _context1.v;
              return _context1.a(2, {
                content: [{
                  type: "text",
                  text: "Error getting quadrant summary: ".concat(_t16.message)
                }]
              });
          }
        }, _callee1, null, [[0, 2]]);
      }));
      function execute(_x18, _x19) {
        return _execute0.apply(this, arguments);
      }
      return execute;
    }()
  }
};
export function initializeMcpRoutes(app, authenticateToken) {
  // SSE Endpoint to start a session
  app.get("/api/mcp/sse", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
      var user, transport, server, _loop, _i, _Object$keys, sessionId;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            user = req.user;
            if (user) {
              _context12.n = 1;
              break;
            }
            res.status(401).send("User not found");
            return _context12.a(2);
          case 1:
            logger.info("Starting MCP session for user ".concat(user.id));
            transport = new SSEServerTransport("/api/mcp/messages", res);
            server = new McpServer({
              name: "TimeManager MCP",
              version: "1.0.0"
            }); // Register tools from mcpTools definition
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var _tool$description, _tool$schema;
              var key, tool;
              return _regenerator().w(function (_context11) {
                while (1) switch (_context11.n) {
                  case 0:
                    key = _Object$keys[_i];
                    tool = mcpTools[key];
                    server.tool(tool.name, (_tool$description = tool.description) !== null && _tool$description !== void 0 ? _tool$description : "", (_tool$schema = tool.schema) !== null && _tool$schema !== void 0 ? _tool$schema : {}, /*#__PURE__*/function () {
                      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(args) {
                        return _regenerator().w(function (_context10) {
                          while (1) switch (_context10.n) {
                            case 0:
                              _context10.n = 1;
                              return tool.execute(args, user);
                            case 1:
                              return _context10.a(2, _context10.v);
                          }
                        }, _callee10);
                      }));
                      return function (_x22) {
                        return _ref3.apply(this, arguments);
                      };
                    }());
                  case 1:
                    return _context11.a(2);
                }
              }, _loop);
            });
            _i = 0, _Object$keys = Object.keys(mcpTools);
          case 2:
            if (!(_i < _Object$keys.length)) {
              _context12.n = 4;
              break;
            }
            return _context12.d(_regeneratorValues(_loop()), 3);
          case 3:
            _i++;
            _context12.n = 2;
            break;
          case 4:
            _context12.n = 5;
            return server.connect(transport);
          case 5:
            // Store transport by sessionId (SSEServerTransport generates a sessionId)
            // We need to access the sessionId from the transport.
            // Note: The SDK's SSEServerTransport might not expose sessionId publicly in all versions,
            // but usually it's available or we can infer it from the URL it sends to the client.
            // Actually, the transport handles the response and keeps it open.
            // We need to intercept the session ID creation or rely on the client sending it back.
            // The SSEServerTransport sends an 'endpoint' event with the URI to post to.
            // That URI usually includes the session ID.
            // For this implementation, we'll assume the transport manages its own session mapping if we use the handlePostMessage correctly.
            // Wait, `handlePostMessage` is a method on the transport instance.
            // So we need to map `sessionId` -> `transport instance`.
            // But we don't know the sessionId until the transport generates it.
            // Let's look at how we can capture it.
            // The `SSEServerTransport` writes to `res`.
            // We can't easily intercept the session ID unless we subclass or if it's a property.
            // Workaround: We'll use a custom session ID generation if the SDK allows, or we'll just store it if we can read it.
            // If `transport.sessionId` exists, we use it.
            sessionId = transport.sessionId;
            if (sessionId) {
              transports.set(sessionId, transport);

              // Clean up on close
              res.on("close", function () {
                transports["delete"](sessionId);
                logger.info("MCP session ".concat(sessionId, " closed"));
              });
            } else {
              logger.warn("Could not capture MCP session ID");
            }
          case 6:
            return _context12.a(2);
        }
      }, _callee11);
    }));
    return function (_x20, _x21) {
      return _ref2.apply(this, arguments);
    };
  }());

  // Endpoint to handle client messages (POST)
  app.post("/api/mcp/messages", /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
      var sessionId, transport;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            sessionId = req.query.sessionId;
            if (sessionId) {
              _context13.n = 1;
              break;
            }
            res.status(400).send("Missing sessionId");
            return _context13.a(2);
          case 1:
            transport = transports.get(sessionId);
            if (transport) {
              _context13.n = 2;
              break;
            }
            res.status(404).send("Session not found");
            return _context13.a(2);
          case 2:
            _context13.n = 3;
            return transport.handlePostMessage(req, res);
          case 3:
            return _context13.a(2);
        }
      }, _callee12);
    }));
    return function (_x23, _x24) {
      return _ref4.apply(this, arguments);
    };
  }());
}
export function getOpenAITools() {
  var tools = [];
  for (var key in mcpTools) {
    var tool = mcpTools[key];
    var parameters = {
      type: "object",
      properties: {},
      required: []
    };

    // Helper to extract Zod schema details
    // Note: This is a simplified converter for the specific Zod schemas used here.
    // It may not cover all Zod features.
    // Handle both ZodObject (has .shape) and plain object definitions
    // tool.schema may be a Zod object with `.shape` or a plain object; handle both
    var schemaLike = tool.schema;
    var shape = schemaLike && schemaLike.shape ? schemaLike.shape : tool.schema;
    if (shape) {
      for (var paramName in shape) {
        var zodSchema = shape[paramName];
        var schema = zodSchema;
        var isOptional = false;

        // Handle ZodOptional
        if (schema._def.typeName === "ZodOptional") {
          isOptional = true;
          schema = schema._def.innerType;
        }
        var prop = {};
        if (schema.description) prop.description = schema.description;
        if (schema._def.typeName === "ZodString") {
          prop.type = "string";
        } else if (schema._def.typeName === "ZodNumber") {
          prop.type = "number";
        } else if (schema._def.typeName === "ZodBoolean") {
          prop.type = "boolean";
        } else if (schema._def.typeName === "ZodEnum") {
          prop.type = "string";
          prop["enum"] = schema._def.values;
        }
        parameters.properties[paramName] = prop;
        if (!isOptional) {
          parameters.required.push(paramName);
        }
      }
    }
    tools.push({
      type: "function",
      "function": {
        name: tool.name,
        description: tool.description,
        parameters: parameters
      }
    });
  }
  logger.data("Generated OpenAI Tools: ".concat(JSON.stringify(tools, null, 2)));
  return tools;
}