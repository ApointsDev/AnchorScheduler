function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 用户状态：本周日程完成/未完成统计 + 完成时长/完成时刻众数
 * 每用户一行缓存，读时按 TTL / 周界刷新，写路径可失效。
 */

import { toShanghaiISO } from "../../Utils/time.js";
import { USER_STATUS_CACHE_TTL_MS, averageCompleteDurationMs, completionHourMode, formatDurationHuman, getShanghaiWeekRange } from "../userStatusStats.js";
function mapRowToStatus(row, fromCache) {
  var modalHours = [];
  if (row.modalHours) {
    try {
      var parsed = JSON.parse(row.modalHours);
      if (Array.isArray(parsed)) {
        modalHours = parsed.map(Number).filter(function (n) {
          return Number.isFinite(n);
        });
      }
    } catch (_unused) {
      modalHours = [];
    }
  }
  var avg = row.avgCompleteDurationMs === null || row.avgCompleteDurationMs === undefined ? null : Number(row.avgCompleteDurationMs);
  var mode = row.completionHourMode === null || row.completionHourMode === undefined ? null : Number(row.completionHourMode);
  return {
    weekStart: row.weekStart,
    weekEnd: row.weekEnd,
    completedThisWeek: Number(row.completedThisWeek) || 0,
    incompleteThisWeek: Number(row.incompleteThisWeek) || 0,
    avgCompleteDurationMs: Number.isFinite(avg) ? avg : null,
    avgCompleteDurationHuman: formatDurationHuman(Number.isFinite(avg) ? avg : null),
    completionHourMode: Number.isFinite(mode) ? mode : null,
    modalHours: modalHours,
    completedSampleSize: Number(row.completedSampleSize) || 0,
    computedAt: row.computedAt ? String(row.computedAt) : toShanghaiISO(),
    fromCache: fromCache
  };
}
export var UserStatusStore = /*#__PURE__*/function () {
  function UserStatusStore(db) {
    _classCallCheck(this, UserStatusStore);
    this.db = db;
  }
  return _createClass(UserStatusStore, [{
    key: "invalidate",
    value: function () {
      var _invalidate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId) {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.db.run("DELETE FROM user_status WHERE userId = ?", [userId]);
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function invalidate(_x) {
        return _invalidate.apply(this, arguments);
      }
      return invalidate;
    }()
  }, {
    key: "getStatus",
    value: function () {
      var _getStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId, opts) {
        var _opts$now;
        var now, _getShanghaiWeekRange, weekStart, weekEnd, cached, computedMs;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              now = (_opts$now = opts === null || opts === void 0 ? void 0 : opts.now) !== null && _opts$now !== void 0 ? _opts$now : new Date();
              _getShanghaiWeekRange = getShanghaiWeekRange(now), weekStart = _getShanghaiWeekRange.weekStart, weekEnd = _getShanghaiWeekRange.weekEnd;
              if (opts !== null && opts !== void 0 && opts.fresh) {
                _context2.n = 2;
                break;
              }
              _context2.n = 1;
              return this.db.get("SELECT * FROM user_status WHERE userId = ?", [userId]);
            case 1:
              cached = _context2.v;
              if (!(cached && cached.weekStart === weekStart)) {
                _context2.n = 2;
                break;
              }
              computedMs = new Date(cached.computedAt).getTime();
              if (!(Number.isFinite(computedMs) && now.getTime() - computedMs < USER_STATUS_CACHE_TTL_MS)) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, mapRowToStatus(cached, true));
            case 2:
              return _context2.a(2, this.recomputeAndSave(userId, weekStart, weekEnd, now));
          }
        }, _callee2, this);
      }));
      function getStatus(_x2, _x3) {
        return _getStatus.apply(this, arguments);
      }
      return getStatus;
    }()
  }, {
    key: "recomputeAndSave",
    value: function () {
      var _recomputeAndSave = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userId, weekStart, weekEnd) {
        var now,
          range,
          ws,
          we,
          completedRows,
          incompleteRow,
          completedThisWeek,
          incompleteThisWeek,
          avgCompleteDurationMs,
          completedAts,
          _completionHourMode,
          mode,
          modalHours,
          computedAt,
          _args3 = arguments;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              now = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : new Date();
              range = weekStart && weekEnd ? {
                weekStart: weekStart,
                weekEnd: weekEnd
              } : getShanghaiWeekRange(now);
              ws = range.weekStart;
              we = range.weekEnd;
              _context3.n = 1;
              return this.db.all("SELECT id, createdAt, completedAt FROM tasks\n             WHERE userId = ? AND completed = 1\n               AND completedAt IS NOT NULL\n               AND completedAt >= ? AND completedAt < ?", [userId, ws, we]);
            case 1:
              completedRows = _context3.v;
              _context3.n = 2;
              return this.db.get("SELECT COUNT(*) as cnt FROM tasks\n             WHERE userId = ? AND completed = 0\n               AND startTime IS NOT NULL AND endTime IS NOT NULL\n               AND startTime != '' AND endTime != ''\n               AND startTime < ? AND endTime >= ?", [userId, we, ws]);
            case 2:
              incompleteRow = _context3.v;
              completedThisWeek = completedRows.length;
              incompleteThisWeek = Number(incompleteRow === null || incompleteRow === void 0 ? void 0 : incompleteRow.cnt) || 0;
              avgCompleteDurationMs = averageCompleteDurationMs(completedRows);
              completedAts = completedRows.map(function (r) {
                return r.completedAt;
              }).filter(Boolean);
              _completionHourMode = completionHourMode(completedAts), mode = _completionHourMode.mode, modalHours = _completionHourMode.modalHours;
              computedAt = toShanghaiISO(now);
              _context3.n = 3;
              return this.db.run("INSERT INTO user_status (\n                userId, weekStart, weekEnd,\n                completedThisWeek, incompleteThisWeek,\n                avgCompleteDurationMs, completionHourMode, modalHours,\n                completedSampleSize, computedAt\n             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n             ON CONFLICT(userId) DO UPDATE SET\n                weekStart = excluded.weekStart,\n                weekEnd = excluded.weekEnd,\n                completedThisWeek = excluded.completedThisWeek,\n                incompleteThisWeek = excluded.incompleteThisWeek,\n                avgCompleteDurationMs = excluded.avgCompleteDurationMs,\n                completionHourMode = excluded.completionHourMode,\n                modalHours = excluded.modalHours,\n                completedSampleSize = excluded.completedSampleSize,\n                computedAt = excluded.computedAt", [userId, ws, we, completedThisWeek, incompleteThisWeek, avgCompleteDurationMs, mode, JSON.stringify(modalHours), completedThisWeek, computedAt]);
            case 3:
              return _context3.a(2, {
                weekStart: ws,
                weekEnd: we,
                completedThisWeek: completedThisWeek,
                incompleteThisWeek: incompleteThisWeek,
                avgCompleteDurationMs: avgCompleteDurationMs,
                avgCompleteDurationHuman: formatDurationHuman(avgCompleteDurationMs),
                completionHourMode: mode,
                modalHours: modalHours,
                completedSampleSize: completedThisWeek,
                computedAt: computedAt,
                fromCache: false
              });
          }
        }, _callee3, this);
      }));
      function recomputeAndSave(_x4, _x5, _x6) {
        return _recomputeAndSave.apply(this, arguments);
      }
      return recomputeAndSave;
    }()
  }]);
}();