var _default;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 社区排名：文案 / 名次 / Store 集成
 */
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { CommunityStore } from "../Services/db/community.js";
import { UserStatusStore } from "../Services/db/userStatus.js";
import { assignDenseRanks, buildRankTitle, COMMUNITY_METRICS } from "../Services/communityRanking.js";
var SqliteDriver = sqlite3.Database || ((_default = sqlite3["default"]) === null || _default === void 0 ? void 0 : _default.Database);
describe("communityRanking helpers", function () {
  test("buildRankTitle: 西交利物浦大学时间利用率第一", function () {
    expect(buildRankTitle("西交利物浦大学", "时间利用率", 1)).toBe("西交利物浦大学时间利用率第一");
    expect(buildRankTitle("西交利物浦大学", "执行效率", 3)).toBe("西交利物浦大学执行效率第3");
    expect(buildRankTitle("西交利物浦大学", "早鸟指数", null)).toBeNull();
  });
  test("assignDenseRanks: 1,2,2,3", function () {
    var ranked = assignDenseRanks([{
      value: 10,
      id: "a"
    }, {
      value: 8,
      id: "b"
    }, {
      value: 8,
      id: "c"
    }, {
      value: 5,
      id: "d"
    }]);
    expect(ranked.map(function (r) {
      return r.rank;
    })).toEqual([1, 2, 2, 3]);
  });
  test("four metrics defined", function () {
    expect(COMMUNITY_METRICS).toHaveLength(4);
    expect(COMMUNITY_METRICS.map(function (m) {
      return m.metric;
    })).toEqual(["completedThisWeek", "incompleteThisWeek", "avgCompleteDurationMs", "completionHourMode"]);
  });
});
function createSchema(_x) {
  return _createSchema.apply(this, arguments);
}
function _createSchema() {
  _createSchema = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(db) {
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          _context1.n = 1;
          return db.exec("PRAGMA foreign_keys = ON");
        case 1:
          _context1.n = 2;
          return db.exec("\n        CREATE TABLE users (\n            id TEXT PRIMARY KEY,\n            email TEXT UNIQUE NOT NULL,\n            name TEXT NOT NULL,\n            passwordHash TEXT,\n            communityRegionId TEXT\n        );\n        CREATE TABLE tasks (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            description TEXT,\n            dueDate TEXT,\n            startTime TEXT,\n            endTime TEXT,\n            completed BOOLEAN DEFAULT 0,\n            completedAt TEXT,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n        CREATE TABLE user_status (\n            userId TEXT PRIMARY KEY,\n            weekStart TEXT NOT NULL,\n            weekEnd TEXT NOT NULL,\n            completedThisWeek INTEGER NOT NULL DEFAULT 0,\n            incompleteThisWeek INTEGER NOT NULL DEFAULT 0,\n            avgCompleteDurationMs REAL,\n            completionHourMode REAL,\n            modalHours TEXT,\n            completedSampleSize INTEGER NOT NULL DEFAULT 0,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n        CREATE TABLE community_regions (\n            id TEXT PRIMARY KEY,\n            name TEXT NOT NULL UNIQUE,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n        CREATE TABLE community_rank_entries (\n            weekStart TEXT NOT NULL,\n            regionId TEXT NOT NULL,\n            metric TEXT NOT NULL,\n            userId TEXT NOT NULL,\n            value REAL NOT NULL,\n            rank INTEGER NOT NULL,\n            displayName TEXT,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (weekStart, regionId, metric, userId)\n        );\n        CREATE TABLE community_rank_meta (\n            weekStart TEXT NOT NULL,\n            regionId TEXT NOT NULL,\n            metric TEXT NOT NULL,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            participantCount INTEGER NOT NULL DEFAULT 0,\n            PRIMARY KEY (weekStart, regionId, metric)\n        );\n    ");
        case 2:
          _context1.n = 3;
          return db.run("INSERT INTO community_regions (id, name) VALUES (?, ?)", ["region-xjtlu", "西交利物浦大学"]);
        case 3:
          return _context1.a(2);
      }
    }, _callee1);
  }));
  return _createSchema.apply(this, arguments);
}
describe("CommunityStore rankings", function () {
  var db;
  var community;
  var userStatus;
  var now = new Date("2026-07-15T12:00:00+08:00");
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var _iterator, _step, _step$value, id, name, region, weekStart, weekEnd, statuses, _i, _statuses, s, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.n = 1;
          return open({
            filename: ":memory:",
            driver: SqliteDriver
          });
        case 1:
          db = _context.v;
          _context.n = 2;
          return createSchema(db);
        case 2:
          userStatus = new UserStatusStore(db);
          community = new CommunityStore(db, userStatus);

          // 三名西交用户 + 一名外校
          _iterator = _createForOfIteratorHelper([["u1", "Alice", "region-xjtlu"], ["u2", "Bob", "region-xjtlu"], ["u3", "Carol", "region-xjtlu"], ["u4", "Dave", null]]);
          _context.p = 3;
          _iterator.s();
        case 4:
          if ((_step = _iterator.n()).done) {
            _context.n = 6;
            break;
          }
          _step$value = _slicedToArray(_step.value, 3), id = _step$value[0], name = _step$value[1], region = _step$value[2];
          _context.n = 5;
          return db.run("INSERT INTO users (id, email, name, passwordHash, communityRegionId)\n                 VALUES (?, ?, ?, 'x', ?)", [id, "".concat(id, "@test.com"), name, region]);
        case 5:
          _context.n = 4;
          break;
        case 6:
          _context.n = 8;
          break;
        case 7:
          _context.p = 7;
          _t = _context.v;
          _iterator.e(_t);
        case 8:
          _context.p = 8;
          _iterator.f();
          return _context.f(8);
        case 9:
          // 直接写入本周 user_status
          weekStart = "2026-07-13T00:00:00+08:00";
          weekEnd = "2026-07-20T00:00:00+08:00";
          statuses = [
          // Alice 完成最多
          {
            id: "u1",
            completed: 10,
            incomplete: 1,
            avg: 3600000,
            hour: 9
          },
          // Bob 中等
          {
            id: "u2",
            completed: 5,
            incomplete: 0,
            avg: 7200000,
            hour: 21
          },
          // Carol 完成最少，但未完成也少、完成很早
          {
            id: "u3",
            completed: 2,
            incomplete: 3,
            avg: 1800000,
            hour: 8
          }];
          _i = 0, _statuses = statuses;
        case 10:
          if (!(_i < _statuses.length)) {
            _context.n = 12;
            break;
          }
          s = _statuses[_i];
          _context.n = 11;
          return db.run("INSERT INTO user_status (\n                    userId, weekStart, weekEnd,\n                    completedThisWeek, incompleteThisWeek,\n                    avgCompleteDurationMs, completionHourMode, modalHours,\n                    completedSampleSize, computedAt\n                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [s.id, weekStart, weekEnd, s.completed, s.incomplete, s.avg, s.hour, JSON.stringify([s.hour]), s.completed, "2026-07-15T12:00:00+08:00"]);
        case 11:
          _i++;
          _context.n = 10;
          break;
        case 12:
          return _context.a(2);
      }
    }, _callee, null, [[3, 7, 8, 9]]);
  })));
  afterEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return db.close();
        case 1:
          return _context2.a(2);
      }
    }, _callee2);
  })));
  test("completed-this-week: Alice 第一，称号正确", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var r;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return community.getRanking("u1", "completedThisWeek", {
            fresh: true,
            now: now
          });
        case 1:
          r = _context3.v;
          expect(r.region.name).toBe("西交利物浦大学");
          expect(r.me.rank).toBe(1);
          expect(r.me.title).toBe("西交利物浦大学时间利用率第一");
          expect(r.me.value).toBe(10);
          expect(r.totalParticipants).toBe(3);
          expect(r.leaderboard[0].displayName).toBe("Alice");
          expect(r.leaderboard.map(function (e) {
            return e.userId;
          })).toEqual(["u1", "u2", "u3"]);
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  test("incomplete-this-week: lower is better, Bob 第一", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var r;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return community.getRanking("u2", "incompleteThisWeek", {
            fresh: true,
            now: now
          });
        case 1:
          r = _context4.v;
          expect(r.me.rank).toBe(1);
          expect(r.me.value).toBe(0);
          expect(r.me.title).toBe("西交利物浦大学日程清爽度第一");
          expect(r.titleLabel).toBe("日程清爽度");
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  })));
  test("avg-complete-duration: Carol 最快", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var r;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return community.getRanking("u3", "avgCompleteDurationMs", {
            fresh: true,
            now: now
          });
        case 1:
          r = _context5.v;
          expect(r.me.rank).toBe(1);
          expect(r.me.title).toBe("西交利物浦大学执行效率第一");
          expect(r.leaderboard[0].value).toBe(1800000);
        case 2:
          return _context5.a(2);
      }
    }, _callee5);
  })));
  test("completion-hour-mode: Carol 最早", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var r;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return community.getRanking("u3", "completionHourMode", {
            fresh: true,
            now: now
          });
        case 1:
          r = _context6.v;
          expect(r.me.rank).toBe(1);
          expect(r.me.title).toBe("西交利物浦大学早鸟指数第一");
          expect(r.leaderboard.map(function (e) {
            return e.value;
          })).toEqual([8, 9, 21]);
        case 2:
          return _context6.a(2);
      }
    }, _callee6);
  })));
  test("no region → CommunityRegionRequiredError", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return expect(community.getRanking("u4", "completedThisWeek", {
            fresh: true,
            now: now
          })).rejects.toMatchObject({
            name: "CommunityRegionRequiredError"
          });
        case 1:
          return _context7.a(2);
      }
    }, _callee7);
  })));
  test("setUserRegion + createRegion", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var region, joined, r;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return community.createRegion("测试大学");
        case 1:
          region = _context8.v;
          expect(region.name).toBe("测试大学");
          _context8.n = 2;
          return community.setUserRegion("u4", region.id);
        case 2:
          joined = _context8.v;
          expect(joined.id).toBe(region.id);
          // 无 status 时仍可取榜（0 参与或仅自己）
          _context8.n = 3;
          return userStatus.getStatus("u4", {
            fresh: true,
            now: now
          });
        case 3:
          _context8.n = 4;
          return community.getRanking("u4", "completedThisWeek", {
            fresh: true,
            now: now
          });
        case 4:
          r = _context8.v;
          expect(r.region.name).toBe("测试大学");
          expect(r.me.eligible).toBe(true);
        case 5:
          return _context8.a(2);
      }
    }, _callee8);
  })));
  test("getAllRankings: 四指标 top 一次返回，默认 limit 100", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var all;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          _context9.n = 1;
          return community.getAllRankings("u1", {
            fresh: true,
            now: now
          });
        case 1:
          all = _context9.v;
          expect(Object.keys(all).sort()).toEqual(["avgCompleteDurationMs", "completedThisWeek", "completionHourMode", "incompleteThisWeek"].sort());
          expect(all.completedThisWeek.titleLabel).toBe("时间利用率");
          expect(all.incompleteThisWeek.titleLabel).toBe("日程清爽度");
          expect(all.avgCompleteDurationMs.titleLabel).toBe("执行效率");
          expect(all.completionHourMode.titleLabel).toBe("早鸟指数");
          expect(all.completedThisWeek.me.rank).toBe(1);
          expect(all.completedThisWeek.leaderboard.map(function (e) {
            return e.userId;
          })).toEqual(["u1", "u2", "u3"]);
          expect(all.incompleteThisWeek.leaderboard[0].userId).toBe("u2");
          expect(all.avgCompleteDurationMs.leaderboard[0].userId).toBe("u3");
          expect(all.completionHourMode.leaderboard[0].userId).toBe("u3");
          expect(all.completedThisWeek.region.name).toBe("西交利物浦大学");
        case 2:
          return _context9.a(2);
      }
    }, _callee9);
  })));
  test("getAllRankings: limit 可裁剪 leaderboard", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var all;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _context0.n = 1;
          return community.getAllRankings("u1", {
            fresh: true,
            now: now,
            limit: 1
          });
        case 1:
          all = _context0.v;
          expect(all.completedThisWeek.leaderboard).toHaveLength(1);
          expect(all.completedThisWeek.leaderboard[0].userId).toBe("u1");
          expect(all.completedThisWeek.totalParticipants).toBe(3);
        case 2:
          return _context0.a(2);
      }
    }, _callee0);
  })));
});