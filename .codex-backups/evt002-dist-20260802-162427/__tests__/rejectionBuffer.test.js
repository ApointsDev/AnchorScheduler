var _default;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 事件拒绝缓冲池单元测试
 */
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { RejectionBufferStore, clampRejectionHours, REJECTION_BUFFER_TTL_MS } from "../Services/db/rejectionBuffer.js";
var SqliteDriver = sqlite3.Database || ((_default = sqlite3["default"]) === null || _default === void 0 ? void 0 : _default.Database);
function setup() {
  return _setup.apply(this, arguments);
}
function _setup() {
  _setup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var db;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return open({
            filename: ":memory:",
            driver: SqliteDriver
          });
        case 1:
          db = _context8.v;
          _context8.n = 2;
          return db.exec("PRAGMA foreign_keys = ON");
        case 2:
          _context8.n = 3;
          return db.exec("\n        CREATE TABLE users (\n            id TEXT PRIMARY KEY,\n            email TEXT UNIQUE NOT NULL,\n            name TEXT NOT NULL\n        );\n        CREATE TABLE rejection_buffer (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            kind TEXT NOT NULL,\n            sourceQueueId TEXT,\n            rawRequest TEXT NOT NULL,\n            rejectedAt TEXT NOT NULL,\n            expiresAt TEXT NOT NULL,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n        CREATE INDEX idx_rejection_buffer_user_kind_rejected\n            ON rejection_buffer(userId, kind, rejectedAt);\n        CREATE INDEX idx_rejection_buffer_expires\n            ON rejection_buffer(expiresAt);\n    ");
        case 3:
          _context8.n = 4;
          return db.run("INSERT INTO users (id, email, name) VALUES (?, ?, ?)", ["u1", "u1@test.com", "U1"]);
        case 4:
          _context8.n = 5;
          return db.run("INSERT INTO users (id, email, name) VALUES (?, ?, ?)", ["u2", "u2@test.com", "U2"]);
        case 5:
          return _context8.a(2, {
            db: db,
            store: new RejectionBufferStore(db)
          });
      }
    }, _callee8);
  }));
  return _setup.apply(this, arguments);
}
describe("clampRejectionHours", function () {
  it("defaults to 24", function () {
    expect(clampRejectionHours(undefined)).toBe(24);
    expect(clampRejectionHours(null)).toBe(24);
    expect(clampRejectionHours("")).toBe(24);
    expect(clampRejectionHours("abc")).toBe(24);
  });
  it("clamps to 1–24", function () {
    expect(clampRejectionHours(0)).toBe(1);
    expect(clampRejectionHours(-5)).toBe(1);
    expect(clampRejectionHours(3)).toBe(3);
    expect(clampRejectionHours(24)).toBe(24);
    expect(clampRejectionHours(48)).toBe(24);
    expect(clampRejectionHours("6")).toBe(6);
  });
});
describe("RejectionBufferStore", function () {
  var db;
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var ctx;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return setup();
        case 1:
          ctx = _context.v;
          db = ctx.db;
          store = ctx.store;
        case 2:
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
  it("adds and lists schedule + todo rejections", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var now, all, schedules, todos;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          now = new Date("2026-07-15T12:00:00+08:00");
          _context3.n = 1;
          return store.add("u1", "schedule", {
            args: {
              name: "会议",
              startTime: "x",
              endTime: "y"
            }
          }, "q-s1", now);
        case 1:
          _context3.n = 2;
          return store.add("u1", "todo", {
            args: {
              name: "作业",
              dueDate: "z"
            }
          }, "q-t1", now);
        case 2:
          _context3.n = 3;
          return store.list("u1", {
            hours: 24,
            now: now
          });
        case 3:
          all = _context3.v;
          expect(all.hours).toBe(24);
          expect(all.items).toHaveLength(2);
          _context3.n = 4;
          return store.list("u1", {
            kind: "schedule",
            hours: 24,
            now: now
          });
        case 4:
          schedules = _context3.v;
          expect(schedules.items).toHaveLength(1);
          expect(schedules.items[0].kind).toBe("schedule");
          expect(schedules.items[0].rawRequest.args.name).toBe("会议");
          expect(schedules.items[0].sourceQueueId).toBe("q-s1");
          _context3.n = 5;
          return store.list("u1", {
            kind: "todo",
            hours: 24,
            now: now
          });
        case 5:
          todos = _context3.v;
          expect(todos.items).toHaveLength(1);
          expect(todos.items[0].kind).toBe("todo");
        case 6:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  it("filters by hours window", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var now, h3, h12;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          now = new Date("2026-07-15T12:00:00+08:00"); // 2 hours ago
          _context4.n = 1;
          return store.add("u1", "schedule", {
            name: "recent"
          }, "q1", new Date(now.getTime() - 2 * 60 * 60 * 1000));
        case 1:
          _context4.n = 2;
          return store.add("u1", "schedule", {
            name: "old"
          }, "q2", new Date(now.getTime() - 10 * 60 * 60 * 1000));
        case 2:
          _context4.n = 3;
          return store.list("u1", {
            hours: 3,
            now: now
          });
        case 3:
          h3 = _context4.v;
          expect(h3.hours).toBe(3);
          expect(h3.items).toHaveLength(1);
          expect(h3.items[0].rawRequest.name).toBe("recent");
          _context4.n = 4;
          return store.list("u1", {
            hours: 12,
            now: now
          });
        case 4:
          h12 = _context4.v;
          expect(h12.items).toHaveLength(2);
        case 5:
          return _context4.a(2);
      }
    }, _callee4);
  })));
  it("deletes expired records (>24h)", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var now, expiredAt, deleted, list;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          now = new Date("2026-07-15T12:00:00+08:00");
          expiredAt = new Date(now.getTime() - REJECTION_BUFFER_TTL_MS - 60000);
          _context5.n = 1;
          return store.add("u1", "todo", {
            name: "gone"
          }, "q-exp", expiredAt);
        case 1:
          _context5.n = 2;
          return store.add("u1", "todo", {
            name: "keep"
          }, "q-ok", now);
        case 2:
          _context5.n = 3;
          return store.deleteExpired(now);
        case 3:
          deleted = _context5.v;
          expect(deleted).toBe(1);
          _context5.n = 4;
          return store.list("u1", {
            hours: 24,
            now: now
          });
        case 4:
          list = _context5.v;
          expect(list.items).toHaveLength(1);
          expect(list.items[0].rawRequest.name).toBe("keep");
        case 5:
          return _context5.a(2);
      }
    }, _callee5);
  })));
  it("list() auto-cleans expired before returning", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var now, expiredAt, list, row;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          now = new Date("2026-07-15T12:00:00+08:00");
          expiredAt = new Date(now.getTime() - REJECTION_BUFFER_TTL_MS - 1000);
          _context6.n = 1;
          return store.add("u1", "schedule", {
            name: "x"
          }, null, expiredAt);
        case 1:
          _context6.n = 2;
          return store.list("u1", {
            hours: 24,
            now: now
          });
        case 2:
          list = _context6.v;
          expect(list.items).toHaveLength(0);
          _context6.n = 3;
          return db.get("SELECT COUNT(*) as c FROM rejection_buffer WHERE userId = ?", ["u1"]);
        case 3:
          row = _context6.v;
          expect(row.c).toBe(0);
        case 4:
          return _context6.a(2);
      }
    }, _callee6);
  })));
  it("scopes by userId", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var now, u1;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          now = new Date("2026-07-15T12:00:00+08:00");
          _context7.n = 1;
          return store.add("u1", "schedule", {
            name: "a"
          }, null, now);
        case 1:
          _context7.n = 2;
          return store.add("u2", "schedule", {
            name: "b"
          }, null, now);
        case 2:
          _context7.n = 3;
          return store.list("u1", {
            hours: 24,
            now: now
          });
        case 3:
          u1 = _context7.v;
          expect(u1.items).toHaveLength(1);
          expect(u1.items[0].rawRequest.name).toBe("a");
        case 4:
          return _context7.a(2);
      }
    }, _callee7);
  })));
});