var _default;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 未测试 Store 集成测试（内存 SQLite）
 *
 * 覆盖的 store（之前没有被单独测试的）：
 * - ChatContextStore
 * - ScheduleQueueStore
 * - TodoQueueStore
 * - FollowStore
 * - SharedScheduleStore
 * - EmailAiStore
 * - UserLogStore
 */

import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { ChatContextStore } from "../Services/db/chatContext.js";
import { ScheduleQueueStore } from "../Services/db/scheduleQueue.js";
import { TodoQueueStore } from "../Services/db/todoQueue.js";
import { FollowStore } from "../Services/db/follows.js";
import { SharedScheduleStore } from "../Services/db/sharedSchedule.js";
import { EmailAiStore } from "../Services/db/emailAi.js";
import { UserLogStore } from "../Services/db/userLogs.js";
var SqliteDriver = sqlite3.Database || ((_default = sqlite3["default"]) === null || _default === void 0 ? void 0 : _default.Database);
function createSchema(_x) {
  return _createSchema.apply(this, arguments);
}
function _createSchema() {
  _createSchema = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51(db) {
    return _regenerator().w(function (_context51) {
      while (1) switch (_context51.n) {
        case 0:
          _context51.n = 1;
          return db.exec("PRAGMA foreign_keys = ON");
        case 1:
          _context51.n = 2;
          return db.exec("\n    CREATE TABLE users (\n      id TEXT PRIMARY KEY,\n      email TEXT UNIQUE NOT NULL,\n      name TEXT NOT NULL,\n      avatar TEXT,\n      signature TEXT\n    );\n    CREATE TABLE chat_history (\n      id TEXT PRIMARY KEY,\n      userId TEXT NOT NULL,\n      messages TEXT NOT NULL DEFAULT '[]',\n      title TEXT NOT NULL DEFAULT '\u65B0\u5BF9\u8BDD',\n      isActive INTEGER NOT NULL DEFAULT 0,\n      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n    );\n    CREATE TABLE schedule_queue (\n      id TEXT PRIMARY KEY,\n      userId TEXT NOT NULL,\n      rawRequest TEXT NOT NULL,\n      status TEXT NOT NULL DEFAULT 'pending',\n      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n    );\n    CREATE TABLE todo_queue (\n      id TEXT PRIMARY KEY,\n      userId TEXT NOT NULL,\n      rawRequest TEXT NOT NULL,\n      status TEXT NOT NULL DEFAULT 'pending',\n      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n    );\n    CREATE TABLE user_follows (\n      followerId TEXT NOT NULL,\n      followedId TEXT NOT NULL,\n      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      PRIMARY KEY (followerId, followedId),\n      FOREIGN KEY (followerId) REFERENCES users(id) ON DELETE CASCADE,\n      FOREIGN KEY (followedId) REFERENCES users(id) ON DELETE CASCADE\n    );\n    CREATE TABLE shared_schedules (\n      id TEXT PRIMARY KEY,\n      userId TEXT NOT NULL,\n      token TEXT NOT NULL UNIQUE,\n      name TEXT NOT NULL DEFAULT '\u65E5\u7A0B\u5206\u4EAB',\n      dateStart TEXT,\n      dateEnd TEXT,\n      taskIds TEXT,\n      expiresAt TEXT,\n      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n    );\n    CREATE TABLE ai_processed_emails (\n      userId TEXT NOT NULL,\n      emailId TEXT NOT NULL,\n      provider TEXT NOT NULL DEFAULT 'imap',\n      processedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n      PRIMARY KEY (userId, emailId, provider),\n      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n    );\n    CREATE TABLE user_logs (\n      id TEXT PRIMARY KEY,\n      userId TEXT NOT NULL,\n      type TEXT NOT NULL,\n      message TEXT NOT NULL,\n      payload TEXT,\n      time DATETIME DEFAULT CURRENT_TIMESTAMP,\n      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n    );\n  ");
        case 2:
          _context51.n = 3;
          return db.run("INSERT INTO users (id, email, name) VALUES (?, ?, ?)", ["u1", "u1@test.com", "User One"]);
        case 3:
          _context51.n = 4;
          return db.run("INSERT INTO users (id, email, name) VALUES (?, ?, ?)", ["u2", "u2@test.com", "User Two"]);
        case 4:
          _context51.n = 5;
          return db.run("INSERT INTO users (id, email, name) VALUES (?, ?, ?)", ["u3", "u3@test.com", "User Three"]);
        case 5:
          return _context51.a(2);
      }
    }, _callee51);
  }));
  return _createSchema.apply(this, arguments);
}
function setup() {
  return _setup.apply(this, arguments);
} // ────────────────────────────────────────────────────────────────
function _setup() {
  _setup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52() {
    var db;
    return _regenerator().w(function (_context52) {
      while (1) switch (_context52.n) {
        case 0:
          _context52.n = 1;
          return open({
            filename: ":memory:",
            driver: SqliteDriver
          });
        case 1:
          db = _context52.v;
          _context52.n = 2;
          return createSchema(db);
        case 2:
          return _context52.a(2, {
            db: db,
            chatContext: new ChatContextStore(db),
            scheduleQueue: new ScheduleQueueStore(db),
            todoQueue: new TodoQueueStore(db),
            follows: new FollowStore(db),
            sharedSchedule: new SharedScheduleStore(db),
            emailAi: new EmailAiStore(db),
            userLogs: new UserLogStore(db)
          });
      }
    }, _callee52);
  }));
  return _setup.apply(this, arguments);
}
describe("ChatContextStore", function () {
  var db;
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var s;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return setup();
        case 1:
          s = _context.v;
          db = s.db;
          store = s.chatContext;
        case 2:
          return _context.a(2);
      }
    }, _callee);
  })));
  test("create returns a new context id", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var id;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return store.create("u1");
        case 1:
          id = _context2.v;
          expect(id).toBeTruthy();
          expect(_typeof(id)).toBe("string");
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  })));
  test("listContexts returns created contexts", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var contexts;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return store.create("u1");
        case 1:
          _context3.n = 2;
          return store.create("u1");
        case 2:
          _context3.n = 3;
          return store.listContexts("u1");
        case 3:
          contexts = _context3.v;
          expect(contexts).toHaveLength(2);
          expect(contexts[0].title).toBe("新对话");
          expect(contexts[0].messageCount).toBe(0);
        case 4:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  test("save and getMessages round-trip", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var id, msgs, result;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return store.create("u1");
        case 1:
          id = _context4.v;
          msgs = JSON.stringify([{
            role: "user",
            content: "Hello"
          }]);
          _context4.n = 2;
          return store.save("u1", msgs, id);
        case 2:
          _context4.n = 3;
          return store.getMessages(id);
        case 3:
          result = _context4.v;
          expect(result).toBeTruthy();
          expect(JSON.parse(result.messages)).toEqual([{
            role: "user",
            content: "Hello"
          }]);
        case 4:
          return _context4.a(2);
      }
    }, _callee4);
  })));
  test("auto-title from user message", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var id, msgs, contexts;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return store.create("u1");
        case 1:
          id = _context5.v;
          msgs = JSON.stringify([{
            role: "user",
            content: "What is the weather like today?"
          }]);
          _context5.n = 2;
          return store.save("u1", msgs, id);
        case 2:
          _context5.n = 3;
          return store.listContexts("u1");
        case 3:
          contexts = _context5.v;
          expect(contexts[0].title).toContain("What is the weather");
        case 4:
          return _context5.a(2);
      }
    }, _callee5);
  })));
  test("getActiveHistory returns active context", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var id, msgs, active;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return store.create("u1");
        case 1:
          id = _context6.v;
          msgs = JSON.stringify([{
            role: "user",
            content: "test"
          }]);
          _context6.n = 2;
          return store.save("u1", msgs, id);
        case 2:
          _context6.n = 3;
          return store.getActiveHistory("u1");
        case 3:
          active = _context6.v;
          expect(active).toBeTruthy();
          expect(active.id).toBe(id);
        case 4:
          return _context6.a(2);
      }
    }, _callee6);
  })));
  test("delete removes context", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var id, result;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return store.create("u1");
        case 1:
          id = _context7.v;
          _context7.n = 2;
          return store["delete"](id);
        case 2:
          _context7.n = 3;
          return store.getMessages(id);
        case 3:
          result = _context7.v;
          expect(result).toBeNull();
        case 4:
          return _context7.a(2);
      }
    }, _callee7);
  })));
  test("listContexts respects user isolation", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var _t, _t2;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return store.create("u1");
        case 1:
          _context8.n = 2;
          return store.create("u2");
        case 2:
          _t = expect;
          _context8.n = 3;
          return store.listContexts("u1");
        case 3:
          _t(_context8.v).toHaveLength(1);
          _t2 = expect;
          _context8.n = 4;
          return store.listContexts("u2");
        case 4:
          _t2(_context8.v).toHaveLength(1);
        case 5:
          return _context8.a(2);
      }
    }, _callee8);
  })));
});

// ────────────────────────────────────────────────────────────────
describe("ScheduleQueueStore", function () {
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var s;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          _context9.n = 1;
          return setup();
        case 1:
          s = _context9.v;
          store = s.scheduleQueue;
        case 2:
          return _context9.a(2);
      }
    }, _callee9);
  })));
  test("add and getByUser round-trip", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var id, items;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _context0.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Meeting"
          }));
        case 1:
          id = _context0.v;
          _context0.n = 2;
          return store.getByUser("u1");
        case 2:
          items = _context0.v;
          expect(items).toHaveLength(1);
          expect(items[0].id).toBe(id);
          expect(items[0].status).toBe("pending");
        case 3:
          return _context0.a(2);
      }
    }, _callee0);
  })));
  test("getById returns correct item", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
    var id, item;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          _context1.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Meeting"
          }));
        case 1:
          id = _context1.v;
          _context1.n = 2;
          return store.getById(id);
        case 2:
          item = _context1.v;
          expect(item).toBeTruthy();
          expect(item.userId).toBe("u1");
        case 3:
          return _context1.a(2);
      }
    }, _callee1);
  })));
  test("getById returns null for unknown id", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
    var _t3;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          _t3 = expect;
          _context10.n = 1;
          return store.getById("nonexistent");
        case 1:
          _t3(_context10.v).toBeUndefined();
        case 2:
          return _context10.a(2);
      }
    }, _callee10);
  })));
  test("updateStatus changes the status", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
    var id, item;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          _context11.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Meeting"
          }));
        case 1:
          id = _context11.v;
          _context11.n = 2;
          return store.updateStatus(id, "approved");
        case 2:
          _context11.n = 3;
          return store.getById(id);
        case 3:
          item = _context11.v;
          expect(item.status).toBe("approved");
        case 4:
          return _context11.a(2);
      }
    }, _callee11);
  })));
  test("delete removes item", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
    var id, _t4, _t5;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          _context12.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Meeting"
          }));
        case 1:
          id = _context12.v;
          _context12.n = 2;
          return store["delete"](id);
        case 2:
          _t4 = expect;
          _context12.n = 3;
          return store.getById(id);
        case 3:
          _t4(_context12.v).toBeUndefined();
          _t5 = expect;
          _context12.n = 4;
          return store.getByUser("u1");
        case 4:
          _t5(_context12.v).toHaveLength(0);
        case 5:
          return _context12.a(2);
      }
    }, _callee12);
  })));
  test("user isolation", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
    var _t6, _t7;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          _context13.n = 1;
          return store.add("u1", JSON.stringify({
            name: "A"
          }));
        case 1:
          _context13.n = 2;
          return store.add("u2", JSON.stringify({
            name: "B"
          }));
        case 2:
          _t6 = expect;
          _context13.n = 3;
          return store.getByUser("u1");
        case 3:
          _t6(_context13.v).toHaveLength(1);
          _t7 = expect;
          _context13.n = 4;
          return store.getByUser("u2");
        case 4:
          _t7(_context13.v).toHaveLength(1);
        case 5:
          return _context13.a(2);
      }
    }, _callee13);
  })));
});

// ────────────────────────────────────────────────────────────────
describe("TodoQueueStore", function () {
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
    var s;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          _context14.n = 1;
          return setup();
        case 1:
          s = _context14.v;
          store = s.todoQueue;
        case 2:
          return _context14.a(2);
      }
    }, _callee14);
  })));
  test("add and getByUser round-trip", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
    var id, items;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          _context15.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Buy milk"
          }));
        case 1:
          id = _context15.v;
          _context15.n = 2;
          return store.getByUser("u1");
        case 2:
          items = _context15.v;
          expect(items).toHaveLength(1);
          expect(items[0].id).toBe(id);
          expect(items[0].status).toBe("pending");
        case 3:
          return _context15.a(2);
      }
    }, _callee15);
  })));
  test("getById returns correct item", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
    var id, item;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          _context16.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Buy milk"
          }));
        case 1:
          id = _context16.v;
          _context16.n = 2;
          return store.getById(id);
        case 2:
          item = _context16.v;
          expect(item).toBeTruthy();
          expect(item.userId).toBe("u1");
        case 3:
          return _context16.a(2);
      }
    }, _callee16);
  })));
  test("updateStatus changes status", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
    var id, _t8;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          _context17.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Buy milk"
          }));
        case 1:
          id = _context17.v;
          _context17.n = 2;
          return store.updateStatus(id, "approved");
        case 2:
          _t8 = expect;
          _context17.n = 3;
          return store.getById(id);
        case 3:
          _t8(_context17.v.status).toBe("approved");
        case 4:
          return _context17.a(2);
      }
    }, _callee17);
  })));
  test("delete removes item", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
    var id, _t9;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          _context18.n = 1;
          return store.add("u1", JSON.stringify({
            name: "Buy milk"
          }));
        case 1:
          id = _context18.v;
          _context18.n = 2;
          return store["delete"](id);
        case 2:
          _t9 = expect;
          _context18.n = 3;
          return store.getById(id);
        case 3:
          _t9(_context18.v).toBeUndefined();
        case 4:
          return _context18.a(2);
      }
    }, _callee18);
  })));
  test("user isolation", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
    var _t0, _t1;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.n) {
        case 0:
          _context19.n = 1;
          return store.add("u1", JSON.stringify({
            name: "A"
          }));
        case 1:
          _context19.n = 2;
          return store.add("u2", JSON.stringify({
            name: "B"
          }));
        case 2:
          _t0 = expect;
          _context19.n = 3;
          return store.getByUser("u1");
        case 3:
          _t0(_context19.v).toHaveLength(1);
          _t1 = expect;
          _context19.n = 4;
          return store.getByUser("u2");
        case 4:
          _t1(_context19.v).toHaveLength(1);
        case 5:
          return _context19.a(2);
      }
    }, _callee19);
  })));
});

// ────────────────────────────────────────────────────────────────
describe("FollowStore", function () {
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
    var s;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.n) {
        case 0:
          _context20.n = 1;
          return setup();
        case 1:
          s = _context20.v;
          store = s.follows;
        case 2:
          return _context20.a(2);
      }
    }, _callee20);
  })));
  test("follow creates a relationship", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
    var ok;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.n) {
        case 0:
          _context21.n = 1;
          return store.follow("u1", "u2");
        case 1:
          ok = _context21.v;
          expect(ok).toBe(true);
        case 2:
          return _context21.a(2);
      }
    }, _callee21);
  })));
  test("follow is idempotent", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
    var ok2;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.n) {
        case 0:
          _context22.n = 1;
          return store.follow("u1", "u2");
        case 1:
          _context22.n = 2;
          return store.follow("u1", "u2");
        case 2:
          ok2 = _context22.v;
          expect(ok2).toBe(false);
        case 3:
          return _context22.a(2);
      }
    }, _callee22);
  })));
  test("cannot follow self", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
    var ok;
    return _regenerator().w(function (_context23) {
      while (1) switch (_context23.n) {
        case 0:
          _context23.n = 1;
          return store.follow("u1", "u1");
        case 1:
          ok = _context23.v;
          expect(ok).toBe(false);
        case 2:
          return _context23.a(2);
      }
    }, _callee23);
  })));
  test("isFollowing returns correct state", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
    var _t10, _t11, _t12;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.n) {
        case 0:
          _t10 = expect;
          _context24.n = 1;
          return store.isFollowing("u1", "u2");
        case 1:
          _t10(_context24.v).toBe(false);
          _context24.n = 2;
          return store.follow("u1", "u2");
        case 2:
          _t11 = expect;
          _context24.n = 3;
          return store.isFollowing("u1", "u2");
        case 3:
          _t11(_context24.v).toBe(true);
          _t12 = expect;
          _context24.n = 4;
          return store.isFollowing("u2", "u1");
        case 4:
          _t12(_context24.v).toBe(false);
        case 5:
          return _context24.a(2);
      }
    }, _callee24);
  })));
  test("getFollowingCount and getFollowerCount", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
    var _t13, _t14, _t15;
    return _regenerator().w(function (_context25) {
      while (1) switch (_context25.n) {
        case 0:
          _context25.n = 1;
          return store.follow("u1", "u2");
        case 1:
          _context25.n = 2;
          return store.follow("u1", "u3");
        case 2:
          _t13 = expect;
          _context25.n = 3;
          return store.getFollowingCount("u1");
        case 3:
          _t13(_context25.v).toBe(2);
          _t14 = expect;
          _context25.n = 4;
          return store.getFollowerCount("u2");
        case 4:
          _t14(_context25.v).toBe(1);
          _t15 = expect;
          _context25.n = 5;
          return store.getFollowerCount("u3");
        case 5:
          _t15(_context25.v).toBe(1);
        case 6:
          return _context25.a(2);
      }
    }, _callee25);
  })));
  test("unfollow removes relationship", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
    var ok, _t16;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.n) {
        case 0:
          _context26.n = 1;
          return store.follow("u1", "u2");
        case 1:
          _context26.n = 2;
          return store.unfollow("u1", "u2");
        case 2:
          ok = _context26.v;
          expect(ok).toBe(true);
          _t16 = expect;
          _context26.n = 3;
          return store.isFollowing("u1", "u2");
        case 3:
          _t16(_context26.v).toBe(false);
        case 4:
          return _context26.a(2);
      }
    }, _callee26);
  })));
  test("unfollow nonexistent returns false", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
    var _t17;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.n) {
        case 0:
          _t17 = expect;
          _context27.n = 1;
          return store.unfollow("u1", "u2");
        case 1:
          _t17(_context27.v).toBe(false);
        case 2:
          return _context27.a(2);
      }
    }, _callee27);
  })));
  test("getFollowing returns user info with pagination", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28() {
    var result;
    return _regenerator().w(function (_context28) {
      while (1) switch (_context28.n) {
        case 0:
          _context28.n = 1;
          return store.follow("u1", "u2");
        case 1:
          _context28.n = 2;
          return store.follow("u1", "u3");
        case 2:
          _context28.n = 3;
          return store.getFollowing("u1", 1, 0);
        case 3:
          result = _context28.v;
          expect(result.users).toHaveLength(1);
          expect(result.total).toBe(2);
          expect(result.users[0].name).toBeTruthy();
        case 4:
          return _context28.a(2);
      }
    }, _callee28);
  })));
  test("getFollowers returns followers", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29() {
    var result;
    return _regenerator().w(function (_context29) {
      while (1) switch (_context29.n) {
        case 0:
          _context29.n = 1;
          return store.follow("u1", "u3");
        case 1:
          _context29.n = 2;
          return store.follow("u2", "u3");
        case 2:
          _context29.n = 3;
          return store.getFollowers("u3");
        case 3:
          result = _context29.v;
          expect(result.total).toBe(2);
          expect(result.users).toHaveLength(2);
        case 4:
          return _context29.a(2);
      }
    }, _callee29);
  })));
});

// ────────────────────────────────────────────────────────────────
describe("SharedScheduleStore", function () {
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30() {
    var s;
    return _regenerator().w(function (_context30) {
      while (1) switch (_context30.n) {
        case 0:
          _context30.n = 1;
          return setup();
        case 1:
          s = _context30.v;
          store = s.sharedSchedule;
        case 2:
          return _context30.a(2);
      }
    }, _callee30);
  })));
  test("create and getByToken round-trip", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
    var share;
    return _regenerator().w(function (_context31) {
      while (1) switch (_context31.n) {
        case 0:
          _context31.n = 1;
          return store.create({
            id: "share-1",
            userId: "u1",
            token: "abc123",
            name: "My Schedule",
            dateStart: "2026-01-01",
            dateEnd: "2026-12-31"
          });
        case 1:
          _context31.n = 2;
          return store.getByToken("abc123");
        case 2:
          share = _context31.v;
          expect(share).toBeTruthy();
          expect(share.userId).toBe("u1");
          expect(share.name).toBe("My Schedule");
          expect(share.dateStart).toBe("2026-01-01");
        case 3:
          return _context31.a(2);
      }
    }, _callee31);
  })));
  test("getByToken returns null for unknown token", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32() {
    var _t18;
    return _regenerator().w(function (_context32) {
      while (1) switch (_context32.n) {
        case 0:
          _t18 = expect;
          _context32.n = 1;
          return store.getByToken("nonexistent");
        case 1:
          _t18(_context32.v).toBeNull();
        case 2:
          return _context32.a(2);
      }
    }, _callee32);
  })));
  test("listByUser returns user's shares", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
    var shares1, _t19;
    return _regenerator().w(function (_context33) {
      while (1) switch (_context33.n) {
        case 0:
          _context33.n = 1;
          return store.create({
            id: "share-1",
            userId: "u1",
            token: "t1",
            name: "A"
          });
        case 1:
          _context33.n = 2;
          return store.create({
            id: "share-2",
            userId: "u1",
            token: "t2",
            name: "B"
          });
        case 2:
          _context33.n = 3;
          return store.create({
            id: "share-3",
            userId: "u2",
            token: "t3",
            name: "C"
          });
        case 3:
          _context33.n = 4;
          return store.listByUser("u1");
        case 4:
          shares1 = _context33.v;
          expect(shares1).toHaveLength(2);
          _t19 = expect;
          _context33.n = 5;
          return store.listByUser("u2");
        case 5:
          _t19(_context33.v).toHaveLength(1);
        case 6:
          return _context33.a(2);
      }
    }, _callee33);
  })));
  test("delete removes share and checks ownership", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
    var ok, _t20;
    return _regenerator().w(function (_context34) {
      while (1) switch (_context34.n) {
        case 0:
          _context34.n = 1;
          return store.create({
            id: "s1",
            userId: "u1",
            token: "t1",
            name: "A"
          });
        case 1:
          _context34.n = 2;
          return store["delete"]("t1", "u1");
        case 2:
          ok = _context34.v;
          expect(ok).toBe(true);
          _t20 = expect;
          _context34.n = 3;
          return store.getByToken("t1");
        case 3:
          _t20(_context34.v).toBeNull();
        case 4:
          return _context34.a(2);
      }
    }, _callee34);
  })));
  test("delete fails for wrong user", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35() {
    var ok, _t21;
    return _regenerator().w(function (_context35) {
      while (1) switch (_context35.n) {
        case 0:
          _context35.n = 1;
          return store.create({
            id: "s1",
            userId: "u1",
            token: "t1",
            name: "A"
          });
        case 1:
          _context35.n = 2;
          return store["delete"]("t1", "u2");
        case 2:
          ok = _context35.v;
          expect(ok).toBe(false);
          _t21 = expect;
          _context35.n = 3;
          return store.getByToken("t1");
        case 3:
          _t21(_context35.v).toBeTruthy();
        case 4:
          return _context35.a(2);
      }
    }, _callee35);
  })));
  test("expiresAt is optional", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36() {
    var share;
    return _regenerator().w(function (_context36) {
      while (1) switch (_context36.n) {
        case 0:
          _context36.n = 1;
          return store.create({
            id: "s1",
            userId: "u1",
            token: "t1",
            name: "NoExpiry"
          });
        case 1:
          _context36.n = 2;
          return store.getByToken("t1");
        case 2:
          share = _context36.v;
          expect(share.expiresAt).toBeNull();
        case 3:
          return _context36.a(2);
      }
    }, _callee36);
  })));
});

// ────────────────────────────────────────────────────────────────
describe("EmailAiStore", function () {
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37() {
    var s;
    return _regenerator().w(function (_context37) {
      while (1) switch (_context37.n) {
        case 0:
          _context37.n = 1;
          return setup();
        case 1:
          s = _context37.v;
          store = s.emailAi;
        case 2:
          return _context37.a(2);
      }
    }, _callee37);
  })));
  test("markProcessed and isProcessed round-trip", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38() {
    var _t22, _t23;
    return _regenerator().w(function (_context38) {
      while (1) switch (_context38.n) {
        case 0:
          _context38.n = 1;
          return store.markProcessed("u1", "email-1");
        case 1:
          _t22 = expect;
          _context38.n = 2;
          return store.isProcessed("u1", "email-1");
        case 2:
          _t22(_context38.v).toBe(true);
          _t23 = expect;
          _context38.n = 3;
          return store.isProcessed("u1", "email-2");
        case 3:
          _t23(_context38.v).toBe(false);
        case 4:
          return _context38.a(2);
      }
    }, _callee38);
  })));
  test("markProcessed is idempotent", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39() {
    var _t24;
    return _regenerator().w(function (_context39) {
      while (1) switch (_context39.n) {
        case 0:
          _context39.n = 1;
          return store.markProcessed("u1", "email-1");
        case 1:
          _context39.n = 2;
          return store.markProcessed("u1", "email-1");
        case 2:
          _t24 = expect;
          _context39.n = 3;
          return store.isProcessed("u1", "email-1");
        case 3:
          _t24(_context39.v).toBe(true);
        case 4:
          return _context39.a(2);
      }
    }, _callee39);
  })));
  test("getProcessedIds returns all processed emails", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40() {
    var ids;
    return _regenerator().w(function (_context40) {
      while (1) switch (_context40.n) {
        case 0:
          _context40.n = 1;
          return store.markProcessed("u1", "email-1");
        case 1:
          _context40.n = 2;
          return store.markProcessed("u1", "email-2");
        case 2:
          _context40.n = 3;
          return store.getProcessedIds("u1");
        case 3:
          ids = _context40.v;
          expect(ids.size).toBe(2);
          expect(ids.has("email-1")).toBe(true);
          expect(ids.has("email-2")).toBe(true);
        case 4:
          return _context40.a(2);
      }
    }, _callee40);
  })));
  test("deleteProcessed removes record", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41() {
    var _t25;
    return _regenerator().w(function (_context41) {
      while (1) switch (_context41.n) {
        case 0:
          _context41.n = 1;
          return store.markProcessed("u1", "email-1");
        case 1:
          _context41.n = 2;
          return store.deleteProcessed("u1", "email-1");
        case 2:
          _t25 = expect;
          _context41.n = 3;
          return store.isProcessed("u1", "email-1");
        case 3:
          _t25(_context41.v).toBe(false);
        case 4:
          return _context41.a(2);
      }
    }, _callee41);
  })));
  test("user isolation", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42() {
    var _t26;
    return _regenerator().w(function (_context42) {
      while (1) switch (_context42.n) {
        case 0:
          _context42.n = 1;
          return store.markProcessed("u1", "email-1");
        case 1:
          _t26 = expect;
          _context42.n = 2;
          return store.isProcessed("u2", "email-1");
        case 2:
          _t26(_context42.v).toBe(false);
        case 3:
          return _context42.a(2);
      }
    }, _callee42);
  })));
  test("provider defaults to imap", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43() {
    var _t27, _t28;
    return _regenerator().w(function (_context43) {
      while (1) switch (_context43.n) {
        case 0:
          _context43.n = 1;
          return store.markProcessed("u1", "email-1");
        case 1:
          _t27 = expect;
          _context43.n = 2;
          return store.isProcessed("u1", "email-1");
        case 2:
          _t27(_context43.v).toBe(true);
          _t28 = expect;
          _context43.n = 3;
          return store.isProcessed("u1", "email-1", "exchange");
        case 3:
          _t28(_context43.v).toBe(false);
        case 4:
          return _context43.a(2);
      }
    }, _callee43);
  })));
});

// ────────────────────────────────────────────────────────────────
describe("UserLogStore", function () {
  var store;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44() {
    var s;
    return _regenerator().w(function (_context44) {
      while (1) switch (_context44.n) {
        case 0:
          _context44.n = 1;
          return setup();
        case 1:
          s = _context44.v;
          store = s.userLogs;
        case 2:
          return _context44.a(2);
      }
    }, _callee44);
  })));
  test("add creates a log entry", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45() {
    var entry;
    return _regenerator().w(function (_context45) {
      while (1) switch (_context45.n) {
        case 0:
          _context45.n = 1;
          return store.add("u1", "login", "User logged in", {
            ip: "1.2.3.4"
          });
        case 1:
          entry = _context45.v;
          expect(entry.id).toBeTruthy();
          expect(entry.type).toBe("login");
          expect(entry.message).toBe("User logged in");
          expect(entry.payload).toEqual({
            ip: "1.2.3.4"
          });
          expect(entry.time).toBeTruthy();
        case 2:
          return _context45.a(2);
      }
    }, _callee45);
  })));
  test("getPage returns paginated logs", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46() {
    var _yield$store$getPage, logs, total;
    return _regenerator().w(function (_context46) {
      while (1) switch (_context46.n) {
        case 0:
          _context46.n = 1;
          return store.add("u1", "login", "Login 1");
        case 1:
          _context46.n = 2;
          return store.add("u1", "login", "Login 2");
        case 2:
          _context46.n = 3;
          return store.add("u1", "taskCreated", "Created task");
        case 3:
          _context46.n = 4;
          return store.getPage("u1", {
            limit: 2,
            offset: 0
          });
        case 4:
          _yield$store$getPage = _context46.v;
          logs = _yield$store$getPage.logs;
          total = _yield$store$getPage.total;
          expect(logs).toHaveLength(2);
          expect(total).toBe(3);
        case 5:
          return _context46.a(2);
      }
    }, _callee46);
  })));
  test("getPage filters by type", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47() {
    var _yield$store$getPage2, logs, total;
    return _regenerator().w(function (_context47) {
      while (1) switch (_context47.n) {
        case 0:
          _context47.n = 1;
          return store.add("u1", "login", "Login 1");
        case 1:
          _context47.n = 2;
          return store.add("u1", "taskCreated", "Created task");
        case 2:
          _context47.n = 3;
          return store.getPage("u1", {
            type: "login"
          });
        case 3:
          _yield$store$getPage2 = _context47.v;
          logs = _yield$store$getPage2.logs;
          total = _yield$store$getPage2.total;
          expect(total).toBe(1);
          expect(logs[0].type).toBe("login");
        case 4:
          return _context47.a(2);
      }
    }, _callee47);
  })));
  test("getPage filters by time range", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48() {
    var _yield$store$getPage3, total;
    return _regenerator().w(function (_context48) {
      while (1) switch (_context48.n) {
        case 0:
          _context48.n = 1;
          return store.add("u1", "login", "Old");
        case 1:
          _context48.n = 2;
          return store.getPage("u1", {
            since: "2000-01-01"
          });
        case 2:
          _yield$store$getPage3 = _context48.v;
          total = _yield$store$getPage3.total;
          expect(total).toBeGreaterThanOrEqual(1);
        case 3:
          return _context48.a(2);
      }
    }, _callee48);
  })));
  test("user isolation", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49() {
    var _t29, _t30;
    return _regenerator().w(function (_context49) {
      while (1) switch (_context49.n) {
        case 0:
          _context49.n = 1;
          return store.add("u1", "login", "U1 login");
        case 1:
          _context49.n = 2;
          return store.add("u2", "login", "U2 login");
        case 2:
          _t29 = expect;
          _context49.n = 3;
          return store.getPage("u1");
        case 3:
          _t29(_context49.v.total).toBe(1);
          _t30 = expect;
          _context49.n = 4;
          return store.getPage("u2");
        case 4:
          _t30(_context49.v.total).toBe(1);
        case 5:
          return _context49.a(2);
      }
    }, _callee49);
  })));
  test("setLogListener fires on add", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50() {
    var events;
    return _regenerator().w(function (_context50) {
      while (1) switch (_context50.n) {
        case 0:
          events = [];
          store.setLogListener(function (userId, log) {
            events.push({
              userId: userId,
              log: log
            });
          });
          _context50.n = 1;
          return store.add("u1", "login", "Login");
        case 1:
          expect(events).toHaveLength(1);
          expect(events[0].userId).toBe("u1");
          expect(events[0].log.type).toBe("login");
        case 2:
          return _context50.a(2);
      }
    }, _callee50);
  })));
});