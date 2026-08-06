var _default;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 用户个人主页：公开资料 + 状态 + 社区称号
 */
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { CommunityStore } from "../Services/db/community.js";
import { UserStatusStore } from "../Services/db/userStatus.js";
import { UserStore } from "../Services/db/users.js";
var SqliteDriver = sqlite3.Database || ((_default = sqlite3["default"]) === null || _default === void 0 ? void 0 : _default.Database);
function createSchema(_x) {
  return _createSchema.apply(this, arguments);
}
function _createSchema() {
  _createSchema = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(db) {
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return db.exec("PRAGMA foreign_keys = ON");
        case 1:
          _context7.n = 2;
          return db.exec("\n        CREATE TABLE users (\n            id TEXT PRIMARY KEY,\n            email TEXT UNIQUE NOT NULL,\n            name TEXT NOT NULL,\n            passwordHash TEXT,\n            communityRegionId TEXT,\n            avatar TEXT,\n            signature TEXT\n        );\n        CREATE TABLE tasks (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            description TEXT,\n            dueDate TEXT,\n            startTime TEXT,\n            endTime TEXT,\n            completed BOOLEAN DEFAULT 0,\n            completedAt TEXT,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n        CREATE TABLE user_status (\n            userId TEXT PRIMARY KEY,\n            weekStart TEXT NOT NULL,\n            weekEnd TEXT NOT NULL,\n            completedThisWeek INTEGER NOT NULL DEFAULT 0,\n            incompleteThisWeek INTEGER NOT NULL DEFAULT 0,\n            avgCompleteDurationMs REAL,\n            completionHourMode REAL,\n            modalHours TEXT,\n            completedSampleSize INTEGER NOT NULL DEFAULT 0,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n        CREATE TABLE community_regions (\n            id TEXT PRIMARY KEY,\n            name TEXT NOT NULL UNIQUE,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n        CREATE TABLE community_rank_entries (\n            weekStart TEXT NOT NULL,\n            regionId TEXT NOT NULL,\n            metric TEXT NOT NULL,\n            userId TEXT NOT NULL,\n            value REAL NOT NULL,\n            rank INTEGER NOT NULL,\n            displayName TEXT,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (weekStart, regionId, metric, userId)\n        );\n        CREATE TABLE community_rank_meta (\n            weekStart TEXT NOT NULL,\n            regionId TEXT NOT NULL,\n            metric TEXT NOT NULL,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            participantCount INTEGER NOT NULL DEFAULT 0,\n            PRIMARY KEY (weekStart, regionId, metric)\n        );\n    ");
        case 2:
          _context7.n = 3;
          return db.run("INSERT INTO community_regions (id, name) VALUES (?, ?)", ["region-xjtlu", "西交利物浦大学"]);
        case 3:
          return _context7.a(2);
      }
    }, _callee7);
  }));
  return _createSchema.apply(this, arguments);
}
describe("User homepage", function () {
  var db;
  var users;
  var community;
  var userStatus;
  var now = new Date("2026-07-15T12:00:00+08:00");
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
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
          users = new UserStore(db);
          userStatus = new UserStatusStore(db);
          community = new CommunityStore(db, userStatus);
          _context.n = 3;
          return db.run("INSERT INTO users (id, email, name, passwordHash, communityRegionId, avatar, signature)\n             VALUES (?, ?, ?, 'x', ?, ?, ?)", ["u1", "alice@test.com", "Alice", "region-xjtlu", "/uploads/avatars/a.jpg", "专注时间管理"]);
        case 3:
          _context.n = 4;
          return db.run("INSERT INTO users (id, email, name, passwordHash, communityRegionId)\n             VALUES (?, ?, ?, 'x', NULL)", ["u2", "bob@test.com", "Bob"]);
        case 4:
          _context.n = 5;
          return db.run("INSERT INTO user_status (\n                userId, weekStart, weekEnd,\n                completedThisWeek, incompleteThisWeek,\n                avgCompleteDurationMs, completionHourMode, modalHours,\n                completedSampleSize, computedAt\n             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ["u1", "2026-07-13T00:00:00+08:00", "2026-07-20T00:00:00+08:00", 10, 1, 3600000, 9, JSON.stringify([9]), 10, "2026-07-15T12:00:00+08:00"]);
        case 5:
          return _context.a(2);
      }
    }, _callee);
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
  test("getPublicProfile: 不含邮箱，含头像签名", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var pub, _t;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return users.getPublicProfile("u1");
        case 1:
          pub = _context3.v;
          expect(pub).toEqual({
            id: "u1",
            name: "Alice",
            avatar: "/uploads/avatars/a.jpg",
            signature: "专注时间管理",
            communityRegionId: "region-xjtlu"
          });
          expect(pub).not.toHaveProperty("email");
          _t = expect;
          _context3.n = 2;
          return users.getPublicProfile("missing");
        case 2:
          _t(_context3.v).toBeNull();
        case 3:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  test("getUserTitleSummaries: 四指标称号", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var _yield$community$getU, region, titles, util;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return community.getUserTitleSummaries("u1", {
            fresh: true,
            now: now
          });
        case 1:
          _yield$community$getU = _context4.v;
          region = _yield$community$getU.region;
          titles = _yield$community$getU.titles;
          expect(region === null || region === void 0 ? void 0 : region.name).toBe("西交利物浦大学");
          expect(titles).toHaveLength(4);
          util = titles.find(function (t) {
            return t.metric === "completedThisWeek";
          });
          expect(util === null || util === void 0 ? void 0 : util.titleLabel).toBe("时间利用率");
          expect(util === null || util === void 0 ? void 0 : util.rank).toBe(1);
          expect(util === null || util === void 0 ? void 0 : util.value).toBe(10);
          expect(util === null || util === void 0 ? void 0 : util.title).toBe("西交利物浦大学时间利用率第一");
          expect(util === null || util === void 0 ? void 0 : util.eligible).toBe(true);
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  })));
  test("无社区用户：titles 为空", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var _yield$community$getU2, region, titles;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return community.getUserTitleSummaries("u2", {
            fresh: true,
            now: now
          });
        case 1:
          _yield$community$getU2 = _context5.v;
          region = _yield$community$getU2.region;
          titles = _yield$community$getU2.titles;
          expect(region).toBeNull();
          expect(titles).toEqual([]);
        case 2:
          return _context5.a(2);
      }
    }, _callee5);
  })));
  test("组装主页：isMe + status + titles", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var pub, status, _yield$community$getU3, region, titles, homepage;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return users.getPublicProfile("u1");
        case 1:
          pub = _context6.v;
          expect(pub).not.toBeNull();
          _context6.n = 2;
          return userStatus.getStatus("u1", {
            now: now
          });
        case 2:
          status = _context6.v;
          _context6.n = 3;
          return community.getUserTitleSummaries("u1", {
            fresh: true,
            now: now
          });
        case 3:
          _yield$community$getU3 = _context6.v;
          region = _yield$community$getU3.region;
          titles = _yield$community$getU3.titles;
          homepage = {
            id: pub.id,
            name: pub.name,
            avatar: pub.avatar,
            signature: pub.signature,
            isMe: true,
            region: region,
            status: status,
            titles: titles
          };
          expect(homepage.isMe).toBe(true);
          expect(homepage.status.completedThisWeek).toBe(10);
          expect(homepage.titles.map(function (t) {
            return t.titleLabel;
          })).toEqual(["时间利用率", "日程清爽度", "执行效率", "早鸟指数"]);
          // 隐私：主页对象本身不含 email
          expect(JSON.stringify(homepage)).not.toContain("alice@test.com");
        case 4:
          return _context6.a(2);
      }
    }, _callee6);
  })));
});