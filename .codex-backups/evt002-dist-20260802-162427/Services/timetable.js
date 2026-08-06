function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { dbService } from "./dbService.js";
import { broadcastTaskChange } from "./websocket.js";
import { logUserEvent } from "./userLog.js";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO, getAcademicYearStart, getCurrentWeekNumber } from "../Utils/time.js";
import { getISOWeek, addDays } from "date-fns";

// Local definitions to avoid circular dependency with index.ts

function parseWeekPattern(pattern) {
  var weeks = [];
  if (!pattern) return weeks;
  var ranges = pattern.split(',');
  var _iterator = _createForOfIteratorHelper(ranges),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var range = _step.value;
      var trimmedRange = range.trim();
      if (trimmedRange.includes('-')) {
        var _trimmedRange$split$m = trimmedRange.split('-').map(Number),
          _trimmedRange$split$m2 = _slicedToArray(_trimmedRange$split$m, 2),
          start = _trimmedRange$split$m2[0],
          end = _trimmedRange$split$m2[1];
        for (var i = start; i <= end; i++) weeks.push(i);
      } else {
        weeks.push(Number(trimmedRange));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return weeks;
}
function getDayName(dayIndex) {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || 'Unknown';
}
export function syncUserTimetable(_x) {
  return _syncUserTimetable.apply(this, arguments);
}
function _syncUserTimetable() {
  _syncUserTimetable = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(user) {
    var force,
      addedCount,
      errorCount,
      envFetchLevel,
      userFetchLevel,
      hashMatch,
      hash,
      apiUrl,
      response,
      envLvl,
      academicYearStart,
      currentWeekNumber,
      _iterator2,
      _step2,
      activity,
      weeks,
      apiDay,
      scheduledDay,
      isoWeeks,
      firstInstanceDate,
      _iterator3,
      _step3,
      weekNum,
      weekStart,
      i,
      d,
      startTimeObj,
      endTimeObj,
      rootStartTime,
      rootEndTime,
      taskId,
      recurrenceRule,
      newTask,
      _args = arguments,
      _t,
      _t2,
      _t3,
      _t4;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          force = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
          addedCount = 0;
          errorCount = 0;
          if (!(!user.ebridgeBinded || !user.timetableUrl)) {
            _context.n = 1;
            break;
          }
          throw new Error('User not bound to Ebridge or missing timetable URL');
        case 1:
          envFetchLevel = parseInt(process.env.timetableFetchLevel || '0');
          userFetchLevel = user.timetableFetchLevel || 0;
          if (!(!force && envFetchLevel <= userFetchLevel)) {
            _context.n = 2;
            break;
          }
          logger.debug("Skipping timetable fetch for user ".concat(user.id, ": env level (").concat(envFetchLevel, ") <= user level (").concat(userFetchLevel, ")"));
          return _context.a(2, {
            added: 0,
            errors: 0
          });
        case 2:
          _context.p = 2;
          hashMatch = user.timetableUrl.split('/');
          hashMatch = (hashMatch[5] || '').split('?');
          if (!(hashMatch && hashMatch[0])) {
            _context.n = 35;
            break;
          }
          hash = hashMatch[0];
          logger.info("Extracted hash: ".concat(JSON.stringify(hashMatch)));
          apiUrl = "https://timetableplus.xjtlu.edu.cn/ptapi/api/enrollment/hash/".concat(hash, "/activity?start=1&end=13");
          logger.info("Requesting URL: ".concat(apiUrl));
          _context.n = 3;
          return axios.get(apiUrl);
        case 3:
          response = _context.v;
          if (!(response.status === 200 && Array.isArray(response.data))) {
            _context.n = 32;
            break;
          }
          logger.success("Successfully fetched timetable data for user ".concat(user.id, ", found ").concat(response.data.length, " activities"));
          _context.n = 4;
          return logUserEvent(user.id, 'timetableFetched', "Fetched timetable activities: ".concat(response.data.length), {
            count: response.data.length
          });
        case 4:
          // Update fetch level only if successful
          envLvl = parseInt(process.env.timetableFetchLevel || '0');
          user.timetableFetchLevel = envLvl;
          _context.n = 5;
          return dbService.updateUser(user);
        case 5:
          logger.info("Updated timetableFetchLevel for user ".concat(user.id, " to ").concat(envLvl));

          // Clean up old tasks (both individual and previous root tasks for this timetable)
          _context.n = 6;
          return dbService.deleteTasksByPattern(user.id, "timetable_".concat(hash, "_%"));
        case 6:
          _context.n = 7;
          return dbService.refreshUserTasks(user);
        case 7:
          academicYearStart = getAcademicYearStart();
          currentWeekNumber = getCurrentWeekNumber();
          _iterator2 = _createForOfIteratorHelper(response.data);
          _context.p = 8;
          _iterator2.s();
        case 9:
          if ((_step2 = _iterator2.n()).done) {
            _context.n = 27;
            break;
          }
          activity = _step2.value;
          _context.p = 10;
          weeks = parseWeekPattern(activity.weekPattern || '');
          if (!(weeks.length === 0)) {
            _context.n = 11;
            break;
          }
          return _context.a(3, 26);
        case 11:
          apiDay = activity.scheduledDay ? parseInt(activity.scheduledDay) : 0;
          scheduledDay = apiDay === 6 ? 0 : apiDay + 1; // 0=Sun, 1=Mon...
          isoWeeks = [];
          firstInstanceDate = null;
          _iterator3 = _createForOfIteratorHelper(weeks);
          _context.p = 12;
          _iterator3.s();
        case 13:
          if ((_step3 = _iterator3.n()).done) {
            _context.n = 17;
            break;
          }
          weekNum = _step3.value;
          // Calculate start of Academic Week
          weekStart = addDays(academicYearStart, (weekNum - 1) * 7); // Find the specific day in this week
          i = 0;
        case 14:
          if (!(i < 7)) {
            _context.n = 16;
            break;
          }
          d = addDays(weekStart, i);
          if (!(d.getDay() === scheduledDay)) {
            _context.n = 15;
            break;
          }
          isoWeeks.push(getISOWeek(d));
          if (!firstInstanceDate) {
            firstInstanceDate = d;
          }
          return _context.a(3, 16);
        case 15:
          i++;
          _context.n = 14;
          break;
        case 16:
          _context.n = 13;
          break;
        case 17:
          _context.n = 19;
          break;
        case 18:
          _context.p = 18;
          _t = _context.v;
          _iterator3.e(_t);
        case 19:
          _context.p = 19;
          _iterator3.f();
          return _context.f(19);
        case 20:
          if (!(!firstInstanceDate || isoWeeks.length === 0)) {
            _context.n = 21;
            break;
          }
          return _context.a(3, 26);
        case 21:
          startTimeObj = activity.startTime ? new Date(activity.startTime) : new Date();
          endTimeObj = activity.endTime ? new Date(activity.endTime) : new Date(Date.now() + 3600000); // Set time for first instance
          rootStartTime = new Date(firstInstanceDate);
          rootStartTime.setHours(startTimeObj.getHours(), startTimeObj.getMinutes(), startTimeObj.getSeconds());
          rootEndTime = new Date(firstInstanceDate);
          rootEndTime.setHours(endTimeObj.getHours(), endTimeObj.getMinutes(), endTimeObj.getSeconds());
          taskId = "timetable_".concat(hash, "_").concat(activity.identity || uuidv4());
          recurrenceRule = JSON.stringify({
            freq: 'weeklyByWeekNumber',
            weeks: isoWeeks,
            interval: 1
          });
          newTask = {
            id: taskId,
            name: activity.name || "".concat(activity.moduleId || 'Unknown', " - ").concat(activity.activityType || 'Activity'),
            description: "Staff: ".concat(activity.staff || 'Unknown', "\nLocation: ").concat(activity.location || 'Online', "\nWeek Pattern: ").concat(activity.weekPattern || 'N/A', "\nDay: ").concat(getDayName(scheduledDay)),
            dueDate: toShanghaiISO(rootEndTime),
            startTime: toShanghaiISO(rootStartTime),
            endTime: toShanghaiISO(rootEndTime),
            location: activity.location || undefined,
            completed: false,
            pushedToMSTodo: false,
            scheduleType: 'recurring_weekly_by_week_number',
            recurrenceRule: recurrenceRule,
            body: JSON.stringify(activity),
            importance: 'normal'
          };
          _context.n = 22;
          return dbService.addTask(user.id, newTask, !!user.conflictBoundaryInclusive, true);
        case 22:
          broadcastTaskChange('created', newTask, user.id);
          logger.info("Added timetable root task: ".concat(newTask.name, " for user ").concat(user.id));
          _context.n = 23;
          return logUserEvent(user.id, 'taskCreated', "Created timetable root task ".concat(newTask.name), {
            id: newTask.id
          });
        case 23:
          addedCount++;
          _context.n = 26;
          break;
        case 24:
          _context.p = 24;
          _t2 = _context.v;
          logger.error("Error processing activity ".concat(activity.identity || 'unknown', ":"), _t2);
          _context.n = 25;
          return logUserEvent(user.id, 'timetableParseError', "Failed to process timetable activity", {
            activityId: activity.identity || 'unknown',
            error: _t2 === null || _t2 === void 0 ? void 0 : _t2.message
          });
        case 25:
          errorCount++;
        case 26:
          _context.n = 9;
          break;
        case 27:
          _context.n = 29;
          break;
        case 28:
          _context.p = 28;
          _t3 = _context.v;
          _iterator2.e(_t3);
        case 29:
          _context.p = 29;
          _iterator2.f();
          return _context.f(29);
        case 30:
          _context.n = 31;
          return dbService.refreshUserTasks(user);
        case 31:
          _context.n = 34;
          break;
        case 32:
          logger.warn("Failed to fetch timetable for user ".concat(user.id));
          _context.n = 33;
          return logUserEvent(user.id, 'timetableError', "Failed to fetch timetable", {});
        case 33:
          throw new Error('Failed to fetch timetable data');
        case 34:
          _context.n = 37;
          break;
        case 35:
          logger.warn("Failed to extract hash from timetableUrl for user ".concat(user.id, " "));
          _context.n = 36;
          return logUserEvent(user.id, 'timetableError', "Failed to extract timetable hash", {});
        case 36:
          throw new Error('Invalid timetable URL format');
        case 37:
          _context.n = 40;
          break;
        case 38:
          _context.p = 38;
          _t4 = _context.v;
          logger.error("Failed to process timetable for user ".concat(user.id, ":"), _t4);
          _context.n = 39;
          return logUserEvent(user.id, 'timetableError', "Failed to process timetable", {
            error: _t4 === null || _t4 === void 0 ? void 0 : _t4.message
          });
        case 39:
          throw _t4;
        case 40:
          return _context.a(2, {
            added: addedCount,
            errors: errorCount
          });
      }
    }, _callee, null, [[12, 18, 19, 20], [10, 24], [8, 28, 29, 30], [2, 38]]);
  }));
  return _syncUserTimetable.apply(this, arguments);
}