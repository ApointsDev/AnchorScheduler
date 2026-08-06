var _default;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 四象限双轴分数工具 + Todo 创建时默认推导
 */
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { clampAxisScore, defaultAxesFromImportance, parsePriorityAxesBody, quadrantFromAxes, resolvePriorityAxes } from "../Services/priorityAxes.js";
import { TagStore } from "../Services/db/tags.js";
import { TodoStore } from "../Services/db/todos.js";
var SqliteDriver = sqlite3.Database || ((_default = sqlite3["default"]) === null || _default === void 0 ? void 0 : _default.Database);
describe("priorityAxes helpers", function () {
  it("clamps to [-1, 1]", function () {
    expect(clampAxisScore(0.5)).toBe(0.5);
    expect(clampAxisScore(2)).toBe(1);
    expect(clampAxisScore(-3)).toBe(-1);
    expect(clampAxisScore("0.25")).toBe(0.25);
    expect(clampAxisScore(null)).toBeNull();
    expect(clampAxisScore("x")).toBeNull();
  });
  it("defaults from importance enum", function () {
    expect(defaultAxesFromImportance("high").importanceScore).toBeGreaterThan(0);
    expect(defaultAxesFromImportance("low").importanceScore).toBeLessThan(0);
    expect(defaultAxesFromImportance("normal")).toEqual({
      importanceScore: 0,
      urgencyScore: 0
    });
  });
  it("resolvePriorityAxes fillDefaults", function () {
    var a = resolvePriorityAxes({
      importance: "high",
      fillDefaults: true
    });
    expect(a.importanceScore).not.toBeNull();
    expect(a.urgencyScore).not.toBeNull();
    var b = resolvePriorityAxes({
      importanceScore: 0.9,
      urgencyScore: -0.2,
      fillDefaults: true
    });
    expect(b.importanceScore).toBe(0.9);
    expect(b.urgencyScore).toBe(-0.2);
  });
  it("quadrantFromAxes", function () {
    expect(quadrantFromAxes(0.5, 0.5)).toBe("q1");
    expect(quadrantFromAxes(0.5, -0.1)).toBe("q2");
    expect(quadrantFromAxes(-0.1, 0.5)).toBe("q3");
    expect(quadrantFromAxes(-0.1, -0.1)).toBe("q4");
    expect(quadrantFromAxes(null, 0.5)).toBeUndefined();
  });
  it("parsePriorityAxesBody", function () {
    var ok = parsePriorityAxesBody({
      importanceScore: 0.3
    });
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.axes.importanceScore).toBe(0.3);
    var bad = parsePriorityAxesBody({});
    expect(bad.ok).toBe(false);
    var clamped = parsePriorityAxesBody({
      urgencyScore: 99
    });
    expect(clamped.ok).toBe(true);
    if (clamped.ok) expect(clamped.axes.urgencyScore).toBe(1);
  });
});
describe("Todo create with priority axes", function () {
  var db;
  var todos;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var tags;
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
          return db.exec("PRAGMA foreign_keys = ON");
        case 2:
          _context.n = 3;
          return db.exec("\n            CREATE TABLE users (\n                id TEXT PRIMARY KEY,\n                email TEXT UNIQUE NOT NULL,\n                name TEXT NOT NULL,\n                passwordHash TEXT\n            );\n            CREATE TABLE todos (\n                id TEXT PRIMARY KEY,\n                userId TEXT NOT NULL,\n                name TEXT NOT NULL,\n                description TEXT,\n                completed BOOLEAN DEFAULT 0,\n                dueDate TEXT,\n                importance TEXT DEFAULT 'normal',\n                importanceScore REAL,\n                urgencyScore REAL,\n                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n            );\n            CREATE TABLE tags (\n                id TEXT PRIMARY KEY,\n                userId TEXT NOT NULL,\n                name TEXT NOT NULL,\n                color TEXT,\n                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,\n                UNIQUE(userId, name)\n            );\n            CREATE TABLE todo_tags (\n                todoId TEXT NOT NULL,\n                tagId TEXT NOT NULL,\n                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n                PRIMARY KEY (todoId, tagId),\n                FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE,\n                FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE\n            );\n        ");
        case 3:
          _context.n = 4;
          return db.run("INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)", ["u1", "a@t.com", "A", "x"]);
        case 4:
          tags = new TagStore(db);
          todos = new TodoStore(db, tags);
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
  it("fills default scores from importance", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var todo;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return todos.create("u1", {
            name: "重要作业",
            importance: "high"
          });
        case 1:
          todo = _context3.v;
          expect(todo.importanceScore).toBe(0.75);
          expect(todo.urgencyScore).toBe(0.5);
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  it("accepts explicit axis scores", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var todo;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return todos.create("u1", {
            name: "琐事",
            importanceScore: -0.8,
            urgencyScore: 0.9
          });
        case 1:
          todo = _context4.v;
          expect(todo.importanceScore).toBe(-0.8);
          expect(todo.urgencyScore).toBe(0.9);
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  })));
  it("updates axes independently", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var todo, updated;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return todos.create("u1", {
            name: "t",
            importance: "normal"
          });
        case 1:
          todo = _context5.v;
          _context5.n = 2;
          return todos.update("u1", todo.id, {
            importanceScore: 0.2,
            urgencyScore: -0.7
          });
        case 2:
          updated = _context5.v;
          expect(updated.importanceScore).toBe(0.2);
          expect(updated.urgencyScore).toBe(-0.7);
          expect(updated.name).toBe("t");
        case 3:
          return _context5.a(2);
      }
    }, _callee5);
  })));
});