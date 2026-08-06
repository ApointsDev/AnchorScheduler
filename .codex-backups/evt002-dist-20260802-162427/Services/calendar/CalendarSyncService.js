function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import { v4 as uuidv4 } from "uuid";
import { dbService } from "../dbService.js";
import { findConflictingTasks } from "../scheduleConflict.js";
import { logUserEvent } from "../userLog.js";
import { parseRecurrenceRuleInput, resolveScheduleType } from "../types.js";
import { toShanghaiISO } from "../../Utils/time.js";
var buildSummary = function buildSummary() {
  return {
    created: 0,
    updated: 0,
    skippedConflicts: 0,
    errors: 0
  };
};
var priorityToImportance = function priorityToImportance(priority) {
  if (!priority) return 'normal';
  if (priority <= 3) return 'high';
  if (priority >= 7) return 'low';
  return 'normal';
};
var importanceToPriority = function importanceToPriority(importance) {
  if (importance === 'high') return 1;
  if (importance === 'low') return 9;
  return 5;
};
var safeJsonParse = function safeJsonParse(value) {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (_unused) {
    return undefined;
  }
};
var extractCalDavMeta = function extractCalDavMeta(body) {
  var parsed = safeJsonParse(body);
  if (!parsed || _typeof(parsed) !== 'object') return undefined;
  if (parsed.source === 'caldav') return parsed;
  return undefined;
};
var mapCalDavEventToTask = function mapCalDavEventToTask(event) {
  var recurrence = event.recurrenceRule ? JSON.stringify(event.recurrenceRule) : undefined;
  var scheduleType = event.scheduleType || resolveScheduleType({
    explicit: undefined,
    recurrence: event.recurrenceRule,
    fallback: 'single'
  }).scheduleType;
  var meta = {
    source: 'caldav',
    uid: event.uid,
    categories: event.categories,
    attachments: event.attachments,
    organizer: event.organizer
  };
  return {
    id: uuidv4(),
    name: event.summary || '未命名日程',
    description: event.description || '',
    dueDate: event.end || event.start,
    startTime: event.start,
    endTime: event.end,
    location: event.location,
    completed: false,
    pushedToMSTodo: false,
    attendees: event.attendees,
    recurrenceRule: recurrence,
    scheduleType: scheduleType,
    importance: priorityToImportance(event.priority),
    body: JSON.stringify(meta)
  };
};
var mapTaskToCalDavEvent = function mapTaskToCalDavEvent(task, uid) {
  var recurrenceRule = parseRecurrenceRuleInput(task.recurrenceRule);
  var resolved = resolveScheduleType({
    explicit: task.scheduleType,
    recurrence: recurrenceRule,
    fallback: 'single'
  });
  var meta = extractCalDavMeta(task.body);
  return {
    uid: uid || (meta === null || meta === void 0 ? void 0 : meta.uid) || task.id,
    summary: task.name,
    description: task.description,
    start: task.startTime,
    end: task.endTime,
    location: task.location,
    attendees: task.attendees,
    recurrenceRule: resolved.parsedRecurrence || recurrenceRule,
    scheduleType: resolved.scheduleType,
    priority: importanceToPriority(task.importance),
    categories: meta === null || meta === void 0 ? void 0 : meta.categories,
    attachments: meta === null || meta === void 0 ? void 0 : meta.attachments,
    organizer: meta === null || meta === void 0 ? void 0 : meta.organizer
  };
};
var ensureCalendarUrl = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(provider, user, calendarUrl) {
    var _discovery$calendars$;
    var discovery, selected;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!calendarUrl) {
            _context.n = 1;
            break;
          }
          return _context.a(2, calendarUrl);
        case 1:
          if (!user.CalDavCalendarUrl) {
            _context.n = 2;
            break;
          }
          return _context.a(2, user.CalDavCalendarUrl);
        case 2:
          _context.n = 3;
          return provider.discover();
        case 3:
          discovery = _context.v;
          selected = (_discovery$calendars$ = discovery.calendars[0]) === null || _discovery$calendars$ === void 0 ? void 0 : _discovery$calendars$.url;
          if (!selected) {
            _context.n = 4;
            break;
          }
          user.CalDavCalendarUrl = selected;
          user.CalDavCalendarHome = discovery.calendarHome || user.CalDavCalendarHome;
          user.CalDavPrincipalUrl = discovery.principalUrl || user.CalDavPrincipalUrl;
          _context.n = 4;
          return dbService.updateUser(user);
        case 4:
          return _context.a(2, selected);
      }
    }, _callee);
  }));
  return function ensureCalendarUrl(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
export var CalendarSyncService = /*#__PURE__*/function () {
  function CalendarSyncService(provider) {
    _classCallCheck(this, CalendarSyncService);
    this.provider = provider;
  }
  return _createClass(CalendarSyncService, [{
    key: "sync",
    value: function () {
      var _sync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(user, options) {
        var direction, calendarUrl, result;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              direction = (options === null || options === void 0 ? void 0 : options.direction) || 'both';
              _context2.n = 1;
              return ensureCalendarUrl(this.provider, user, options === null || options === void 0 ? void 0 : options.calendarUrl);
            case 1:
              calendarUrl = _context2.v;
              if (calendarUrl) {
                _context2.n = 2;
                break;
              }
              throw new Error('CalDAV calendarUrl not configured');
            case 2:
              result = {
                pulled: buildSummary(),
                pushed: buildSummary()
              };
              if (!(direction === 'pull' || direction === 'both')) {
                _context2.n = 4;
                break;
              }
              _context2.n = 3;
              return this.pullEvents(user, calendarUrl, options);
            case 3:
              result.pulled = _context2.v;
            case 4:
              if (!(direction === 'push' || direction === 'both')) {
                _context2.n = 6;
                break;
              }
              _context2.n = 5;
              return this.pushEvents(user, calendarUrl);
            case 5:
              result.pushed = _context2.v;
            case 6:
              user.CalDavLastSyncAt = toShanghaiISO();
              _context2.n = 7;
              return dbService.updateUser(user);
            case 7:
              return _context2.a(2, result);
          }
        }, _callee2, this);
      }));
      function sync(_x4, _x5) {
        return _sync.apply(this, arguments);
      }
      return sync;
    }()
  }, {
    key: "pullEvents",
    value: function () {
      var _pullEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(user, calendarUrl, options) {
        var _options$allowConflic;
        var summary, allowConflict, rangeStart, rangeEnd, events, _iterator, _step, event, mapping, candidate, _yield$dbService$getT, existing, conflicts, updates, newTask, _t, _t2, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              summary = buildSummary();
              allowConflict = (_options$allowConflic = options === null || options === void 0 ? void 0 : options.allowConflict) !== null && _options$allowConflic !== void 0 ? _options$allowConflic : true;
              rangeStart = (options === null || options === void 0 ? void 0 : options.rangeStart) || toShanghaiISO(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30));
              rangeEnd = (options === null || options === void 0 ? void 0 : options.rangeEnd) || toShanghaiISO(new Date(Date.now() + 1000 * 60 * 60 * 24 * 365));
              events = [];
              _context3.p = 1;
              _context3.n = 2;
              return this.provider.listEvents(calendarUrl, {
                start: rangeStart,
                end: rangeEnd
              });
            case 2:
              events = _context3.v;
              _context3.n = 4;
              break;
            case 3:
              _context3.p = 3;
              _t = _context3.v;
              summary.errors++;
              throw _t;
            case 4:
              _iterator = _createForOfIteratorHelper(events);
              _context3.p = 5;
              _iterator.s();
            case 6:
              if ((_step = _iterator.n()).done) {
                _context3.n = 20;
                break;
              }
              event = _step.value;
              _context3.p = 7;
              _context3.n = 8;
              return dbService.getCalendarEventMapByRemoteUid(user.id, 'caldav', event.uid);
            case 8:
              mapping = _context3.v;
              candidate = {
                id: (mapping === null || mapping === void 0 ? void 0 : mapping.localTaskId) || 'new-task',
                startTime: event.start,
                endTime: event.end
              };
              if (allowConflict) {
                _context3.n = 11;
                break;
              }
              _context3.n = 9;
              return dbService.getTasksPage(user.id, {
                start: event.start,
                end: event.end,
                limit: 200
              });
            case 9:
              _yield$dbService$getT = _context3.v;
              existing = _yield$dbService$getT.tasks;
              conflicts = findConflictingTasks(existing, candidate, {
                boundaryConflict: !!user.conflictBoundaryInclusive
              });
              if (!(conflicts.length > 0)) {
                _context3.n = 11;
                break;
              }
              summary.skippedConflicts++;
              _context3.n = 10;
              return logUserEvent(user.id, 'caldavConflictSkip', "Skipped CalDAV event due to conflict", {
                uid: event.uid,
                conflicts: conflicts.map(function (c) {
                  return c.id;
                })
              });
            case 10:
              return _context3.a(3, 19);
            case 11:
              if (!(mapping !== null && mapping !== void 0 && mapping.localTaskId)) {
                _context3.n = 14;
                break;
              }
              updates = {
                name: event.summary || '未命名日程',
                description: event.description || '',
                startTime: event.start,
                endTime: event.end,
                dueDate: event.end,
                location: event.location,
                attendees: event.attendees,
                importance: priorityToImportance(event.priority),
                recurrenceRule: event.recurrenceRule ? JSON.stringify(event.recurrenceRule) : undefined,
                scheduleType: event.scheduleType || resolveScheduleType({
                  explicit: undefined,
                  recurrence: event.recurrenceRule,
                  fallback: 'single'
                }).scheduleType,
                body: JSON.stringify({
                  source: 'caldav',
                  uid: event.uid,
                  categories: event.categories,
                  attachments: event.attachments,
                  organizer: event.organizer
                })
              };
              _context3.n = 12;
              return dbService.patchTask(user.id, mapping.localTaskId, updates, !!user.conflictBoundaryInclusive, true);
            case 12:
              _context3.n = 13;
              return dbService.upsertCalendarEventMap({
                userId: user.id,
                provider: 'caldav',
                localTaskId: mapping.localTaskId,
                remoteUid: event.uid,
                remoteHref: event.href,
                remoteEtag: event.etag,
                calendarUrl: calendarUrl,
                rawData: event.rawIcs
              });
            case 13:
              summary.updated++;
              _context3.n = 17;
              break;
            case 14:
              newTask = mapCalDavEventToTask(event);
              _context3.n = 15;
              return dbService.addTask(user.id, newTask, !!user.conflictBoundaryInclusive, true);
            case 15:
              _context3.n = 16;
              return dbService.upsertCalendarEventMap({
                userId: user.id,
                provider: 'caldav',
                localTaskId: newTask.id,
                remoteUid: event.uid,
                remoteHref: event.href,
                remoteEtag: event.etag,
                calendarUrl: calendarUrl,
                rawData: event.rawIcs
              });
            case 16:
              summary.created++;
            case 17:
              _context3.n = 19;
              break;
            case 18:
              _context3.p = 18;
              _t2 = _context3.v;
              summary.errors++;
            case 19:
              _context3.n = 6;
              break;
            case 20:
              _context3.n = 22;
              break;
            case 21:
              _context3.p = 21;
              _t3 = _context3.v;
              _iterator.e(_t3);
            case 22:
              _context3.p = 22;
              _iterator.f();
              return _context3.f(22);
            case 23:
              _context3.n = 24;
              return logUserEvent(user.id, 'caldavPullSummary', 'CalDAV pull completed', summary);
            case 24:
              return _context3.a(2, summary);
          }
        }, _callee3, this, [[7, 18], [5, 21, 22, 23], [1, 3]]);
      }));
      function pullEvents(_x6, _x7, _x8) {
        return _pullEvents.apply(this, arguments);
      }
      return pullEvents;
    }()
  }, {
    key: "pushEvents",
    value: function () {
      var _pushEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(user, calendarUrl) {
        var summary, tasks, _iterator2, _step2, task, _ref2, _ref3, mapping, event, ref, _t4, _t5;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              summary = buildSummary();
              _context4.n = 1;
              return dbService.getTasksByUserId(user.id);
            case 1:
              tasks = _context4.v;
              _iterator2 = _createForOfIteratorHelper(tasks);
              _context4.p = 2;
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context4.n = 13;
                break;
              }
              task = _step2.value;
              _context4.p = 4;
              _context4.n = 5;
              return dbService.getCalendarEventMapByLocalId(user.id, 'caldav', task.id);
            case 5:
              mapping = _context4.v;
              event = mapTaskToCalDavEvent(task, (mapping === null || mapping === void 0 ? void 0 : mapping.remoteUid) || task.id);
              ref = void 0;
              if (!(mapping !== null && mapping !== void 0 && mapping.remoteHref)) {
                _context4.n = 7;
                break;
              }
              _context4.n = 6;
              return this.provider.updateEvent(calendarUrl, mapping.remoteHref, event, mapping.remoteEtag || undefined);
            case 6:
              ref = _context4.v;
              summary.updated++;
              _context4.n = 9;
              break;
            case 7:
              _context4.n = 8;
              return this.provider.createEvent(calendarUrl, event);
            case 8:
              ref = _context4.v;
              summary.created++;
            case 9:
              _context4.n = 10;
              return dbService.upsertCalendarEventMap({
                userId: user.id,
                provider: 'caldav',
                localTaskId: task.id,
                remoteUid: event.uid,
                remoteHref: (_ref2 = ref) === null || _ref2 === void 0 ? void 0 : _ref2.href,
                remoteEtag: (_ref3 = ref) === null || _ref3 === void 0 ? void 0 : _ref3.etag,
                calendarUrl: calendarUrl,
                rawData: undefined
              });
            case 10:
              _context4.n = 12;
              break;
            case 11:
              _context4.p = 11;
              _t4 = _context4.v;
              summary.errors++;
            case 12:
              _context4.n = 3;
              break;
            case 13:
              _context4.n = 15;
              break;
            case 14:
              _context4.p = 14;
              _t5 = _context4.v;
              _iterator2.e(_t5);
            case 15:
              _context4.p = 15;
              _iterator2.f();
              return _context4.f(15);
            case 16:
              _context4.n = 17;
              return logUserEvent(user.id, 'caldavPushSummary', 'CalDAV push completed', summary);
            case 17:
              return _context4.a(2, summary);
          }
        }, _callee4, this, [[4, 11], [2, 14, 15, 16]]);
      }));
      function pushEvents(_x9, _x0) {
        return _pushEvents.apply(this, arguments);
      }
      return pushEvents;
    }()
  }]);
}();