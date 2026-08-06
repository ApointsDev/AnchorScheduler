function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import { v4 as uuidv4 } from "uuid";
import { getISOWeek } from "date-fns";
import { toShanghaiISO } from "../Utils/time.js";
export function generateRecurrenceInstances(root, rule) {
  var instances = [];
  try {
    var freq = rule.freq;
    var interval = rule.interval && rule.interval > 0 ? rule.interval : 1;
    var count = rule.count;
    var until = rule.until ? new Date(rule.until) : undefined;
    var byDay = Array.isArray(rule.byDay) ? rule.byDay : undefined;
    var start = new Date(root.startTime);
    var end = new Date(root.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return instances;
    var maxIterations = count ? count - 1 : 500; // root already counts as one
    var generated = 0;
    if (freq === 'daily') {
      var cursorStart = new Date(start);
      var cursorEnd = new Date(end);
      while (generated < maxIterations) {
        cursorStart.setDate(cursorStart.getDate() + interval);
        cursorEnd.setDate(cursorEnd.getDate() + interval);
        if (until && cursorStart > until) break;
        instances.push(buildInstance(root, cursorStart, cursorEnd));
        generated++;
        if (!count && until && cursorStart > until) break;
        if (!count && !until && generated >= 365) break;
      }
    } else if (freq === 'weekly') {
      var _byDay$map;
      var rootDay = start.getDay();
      var dayMap = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
      };
      var byDayIdx = (byDay === null || byDay === void 0 || (_byDay$map = byDay.map(function (d) {
        return dayMap[d];
      })) === null || _byDay$map === void 0 ? void 0 : _byDay$map.filter(function (d) {
        return d !== undefined;
      })) || [];
      var weekOffset = 0;
      while (generated < maxIterations) {
        var baseWeekStart = new Date(start);
        baseWeekStart.setDate(start.getDate() + weekOffset * 7 * interval);
        if (byDayIdx.length === 0) {
          if (weekOffset > 0) {
            var _cursorStart = new Date(start);
            _cursorStart.setDate(start.getDate() + weekOffset * 7 * interval);
            var _cursorEnd = new Date(end);
            _cursorEnd.setDate(end.getDate() + weekOffset * 7 * interval);
            if (until && _cursorStart > until) break;
            instances.push(buildInstance(root, _cursorStart, _cursorEnd));
            generated++;
            if (!count && until && _cursorStart > until) break;
            if (!count && !until && generated >= 365) break;
          }
        } else {
          var _iterator = _createForOfIteratorHelper(byDayIdx),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var targetDay = _step.value;
              if (generated >= maxIterations) break;
              var dayDiff = targetDay - rootDay;
              var _cursorStart2 = new Date(baseWeekStart);
              _cursorStart2.setDate(baseWeekStart.getDate() + dayDiff);
              var _cursorEnd2 = new Date(_cursorStart2);
              _cursorEnd2.setHours(end.getHours(), end.getMinutes(), end.getSeconds(), end.getMilliseconds());
              if (_cursorStart2.getTime() === start.getTime()) continue;
              if (until && _cursorStart2 > until) {
                generated = maxIterations;
                break;
              }
              instances.push(buildInstance(root, _cursorStart2, _cursorEnd2));
              generated++;
              if (!count && until && _cursorStart2 > until) break;
              if (!count && !until && generated >= 365) break;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        weekOffset++;
      }
    } else if (freq === 'weeklyByWeekNumber') {
      // rule.weeks: array of ISO week numbers (1-53) when this task should appear
      var weeks = Array.isArray(rule.weeks) ? rule.weeks : [];
      if (weeks.length === 0) return instances;
      // Iterate week by week starting from start, generate instances on the weekday of start
      var _cursorStart3 = new Date(start);
      var _cursorEnd3 = new Date(end);
      var iterations = 0;
      while (generated < maxIterations && iterations < 5000) {
        // advance one week each iteration
        if (iterations > 0) {
          _cursorStart3.setDate(_cursorStart3.getDate() + 7);
          _cursorEnd3.setDate(_cursorEnd3.getDate() + 7);
        }
        var iso = getISOWeek(_cursorStart3);
        if (weeks.includes(iso)) {
          if (_cursorStart3.getTime() === start.getTime()) {
            iterations++;
            continue;
          }
          if (until && _cursorStart3 > until) break;
          instances.push(buildInstance(root, new Date(_cursorStart3), new Date(_cursorEnd3)));
          generated++;
          if (!count && until && _cursorStart3 > until) break;
          if (!count && !until && generated >= 365) break;
        }
        iterations++;
      }
    } else if (freq === 'dailyOnDays') {
      // rule.days: array of weekday indices 0(Sun)-6(Sat)
      var days = Array.isArray(rule.days) ? rule.days : [];
      if (days.length === 0) return instances;
      var _cursorStart4 = new Date(start);
      var _cursorEnd4 = new Date(end);
      // move forward day by day
      var _iterations = 0;
      while (generated < maxIterations && _iterations < 5000) {
        _cursorStart4.setDate(_cursorStart4.getDate() + 1);
        _cursorEnd4.setDate(_cursorEnd4.getDate() + 1);
        var w = _cursorStart4.getDay();
        if (days.includes(w)) {
          if (_cursorStart4.getTime() === start.getTime()) {
            _iterations++;
            continue;
          }
          if (until && _cursorStart4 > until) break;
          instances.push(buildInstance(root, new Date(_cursorStart4), new Date(_cursorEnd4)));
          generated++;
          if (!count && until && _cursorStart4 > until) break;
          if (!count && !until && generated >= 365) break;
        }
        _iterations++;
      }
    }
  } catch (_) {
    return instances;
  }
  return instances;
}
export function buildRecurrenceSummary(rule, created, conflicts, errors) {
  if (!rule) return null;
  return {
    createdInstances: created,
    conflictInstances: conflicts,
    errorInstances: errors,
    requestedRule: rule
  };
}
function buildInstance(root, s, e) {
  return {
    id: uuidv4(),
    name: root.name,
    description: root.description,
    startTime: toShanghaiISO(s),
    endTime: toShanghaiISO(e),
    dueDate: toShanghaiISO(e),
    location: root.location,
    completed: false,
    pushedToMSTodo: false,
    parentTaskId: root.id,
    scheduleType: root.scheduleType,
    importance: root.importance,
    recurrenceRule: undefined
  };
}