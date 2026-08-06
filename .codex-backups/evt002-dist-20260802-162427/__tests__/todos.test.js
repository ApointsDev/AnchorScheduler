var _default;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 待办 + 标签 Store 集成测试（内存 SQLite）
 */
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { TagStore, TagConflictError, TagNotFoundError } from "../Services/db/tags.js";
import { TodoStore, TodoNotFoundError } from "../Services/db/todos.js";
var SqliteDriver = sqlite3.Database || ((_default = sqlite3["default"]) === null || _default === void 0 ? void 0 : _default.Database);
function createSchema(_x) {
  return _createSchema.apply(this, arguments);
}
function _createSchema() {
  _createSchema = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(db) {
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          _context13.n = 1;
          return db.exec("PRAGMA foreign_keys = ON");
        case 1:
          _context13.n = 2;
          return db.exec("\n        CREATE TABLE users (\n            id TEXT PRIMARY KEY,\n            email TEXT UNIQUE NOT NULL,\n            name TEXT NOT NULL,\n            passwordHash TEXT\n        );\n        CREATE TABLE todos (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            description TEXT,\n            completed BOOLEAN DEFAULT 0,\n            dueDate TEXT,\n            importance TEXT DEFAULT 'normal',\n            importanceScore REAL,\n            urgencyScore REAL,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n        CREATE TABLE tags (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            color TEXT,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,\n            UNIQUE(userId, name)\n        );\n        CREATE TABLE todo_tags (\n            todoId TEXT NOT NULL,\n            tagId TEXT NOT NULL,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (todoId, tagId),\n            FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE,\n            FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE\n        );\n    ");
        case 2:
          _context13.n = 3;
          return db.run("INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)", ["user-a", "a@test.com", "User A", "x"]);
        case 3:
          _context13.n = 4;
          return db.run("INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)", ["user-b", "b@test.com", "User B", "x"]);
        case 4:
          return _context13.a(2);
      }
    }, _callee13);
  }));
  return _createSchema.apply(this, arguments);
}
function setup() {
  return _setup.apply(this, arguments);
}
function _setup() {
  _setup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
    var db, tags, todos;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          _context14.n = 1;
          return open({
            filename: ":memory:",
            driver: SqliteDriver
          });
        case 1:
          db = _context14.v;
          _context14.n = 2;
          return createSchema(db);
        case 2:
          tags = new TagStore(db);
          todos = new TodoStore(db, tags);
          return _context14.a(2, {
            db: db,
            tags: tags,
            todos: todos
          });
      }
    }, _callee14);
  }));
  return _setup.apply(this, arguments);
}
describe("Todo + Tag stores", function () {
  var db;
  var tags;
  var todos;
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
          tags = ctx.tags;
          todos = ctx.todos;
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
  test("create todo without tags", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var todo;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return todos.create("user-a", {
            name: "买牛奶"
          });
        case 1:
          todo = _context3.v;
          expect(todo.name).toBe("买牛奶");
          expect(todo.completed).toBe(false);
          expect(todo.tags).toEqual([]);
          expect(todo.importance).toBe("normal");
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  test("create todo with multiple tags via tagNames", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var todo, names, allTags;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return todos.create("user-a", {
            name: "交作业",
            tagNames: ["课程", "CST401"],
            importance: "high"
          });
        case 1:
          todo = _context4.v;
          expect(todo.tags).toHaveLength(2);
          names = todo.tags.map(function (t) {
            return t.name;
          }).sort();
          expect(names).toEqual(["CST401", "课程"]);
          expect(todo.importance).toBe("high");
          _context4.n = 2;
          return tags.listByUser("user-a");
        case 2:
          allTags = _context4.v;
          expect(allTags).toHaveLength(2);
        case 3:
          return _context4.a(2);
      }
    }, _callee4);
  })));
  test("create todo with tagIds + tagNames merged", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var existing, todo, names;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return tags.create("user-a", {
            name: "工作",
            color: "#ff0000"
          });
        case 1:
          existing = _context5.v;
          _context5.n = 2;
          return todos.create("user-a", {
            name: "周报",
            tagIds: [existing.id],
            tagNames: ["工作", "周报"]
          });
        case 2:
          todo = _context5.v;
          expect(todo.tags).toHaveLength(2);
          names = new Set(todo.tags.map(function (t) {
            return t.name;
          }));
          expect(names.has("工作")).toBe(true);
          expect(names.has("周报")).toBe(true);
        case 3:
          return _context5.a(2);
      }
    }, _callee5);
  })));
  test("invalid tagId throws TagNotFoundError", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return expect(todos.create("user-a", {
            name: "x",
            tagIds: ["no-such-id"]
          })).rejects.toBeInstanceOf(TagNotFoundError);
        case 1:
          return _context6.a(2);
      }
    }, _callee6);
  })));
  test("update / complete / delete todo", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var todo, updated, ok, _t;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return todos.create("user-a", {
            name: "草稿"
          });
        case 1:
          todo = _context7.v;
          _context7.n = 2;
          return todos.update("user-a", todo.id, {
            name: "完成稿",
            completed: true
          });
        case 2:
          updated = _context7.v;
          expect(updated.name).toBe("完成稿");
          expect(updated.completed).toBe(true);
          _context7.n = 3;
          return todos["delete"]("user-a", todo.id);
        case 3:
          ok = _context7.v;
          expect(ok).toBe(true);
          _t = expect;
          _context7.n = 4;
          return todos.getById("user-a", todo.id);
        case 4:
          _t(_context7.v).toBeNull();
        case 5:
          return _context7.a(2);
      }
    }, _callee7);
  })));
  test("replace tags on update; empty clears tags", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var todo, one, none;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return todos.create("user-a", {
            name: "A",
            tagNames: ["t1", "t2"]
          });
        case 1:
          todo = _context8.v;
          expect(todo.tags).toHaveLength(2);
          _context8.n = 2;
          return todos.update("user-a", todo.id, {
            replaceTags: true,
            tagNames: ["t3"]
          });
        case 2:
          one = _context8.v;
          expect(one.tags.map(function (t) {
            return t.name;
          })).toEqual(["t3"]);
          _context8.n = 3;
          return todos.update("user-a", todo.id, {
            replaceTags: true,
            tagIds: [],
            tagNames: []
          });
        case 3:
          none = _context8.v;
          expect(none.tags).toEqual([]);
        case 4:
          return _context8.a(2);
      }
    }, _callee8);
  })));
  test("filter by tagIds AND semantics", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var tagA, tagB, _yield$todos$getPage, both, total;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          _context9.n = 1;
          return todos.create("user-a", {
            name: "onlyA",
            tagNames: ["A"]
          });
        case 1:
          _context9.n = 2;
          return todos.create("user-a", {
            name: "onlyB",
            tagNames: ["B"]
          });
        case 2:
          _context9.n = 3;
          return todos.create("user-a", {
            name: "both",
            tagNames: ["A", "B"]
          });
        case 3:
          _context9.n = 4;
          return tags.getByName("user-a", "A");
        case 4:
          tagA = _context9.v;
          _context9.n = 5;
          return tags.getByName("user-a", "B");
        case 5:
          tagB = _context9.v;
          expect(tagA && tagB).toBeTruthy();
          _context9.n = 6;
          return todos.getPage("user-a", {
            tagIds: [tagA.id, tagB.id]
          });
        case 6:
          _yield$todos$getPage = _context9.v;
          both = _yield$todos$getPage.todos;
          total = _yield$todos$getPage.total;
          expect(total).toBe(1);
          expect(both[0].name).toBe("both");
        case 7:
          return _context9.a(2);
      }
    }, _callee9);
  })));
  test("reverse lookup getByTagId", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var tag, _yield$todos$getByTag, list, total;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _context0.n = 1;
          return tags.create("user-a", {
            name: "课程"
          });
        case 1:
          tag = _context0.v;
          _context0.n = 2;
          return todos.create("user-a", {
            name: "作业1",
            tagIds: [tag.id]
          });
        case 2:
          _context0.n = 3;
          return todos.create("user-a", {
            name: "作业2",
            tagIds: [tag.id]
          });
        case 3:
          _context0.n = 4;
          return todos.create("user-a", {
            name: "无关"
          });
        case 4:
          _context0.n = 5;
          return todos.getByTagId("user-a", tag.id);
        case 5:
          _yield$todos$getByTag = _context0.v;
          list = _yield$todos$getByTag.todos;
          total = _yield$todos$getByTag.total;
          expect(total).toBe(2);
          expect(list.map(function (t) {
            return t.name;
          }).sort()).toEqual(["作业1", "作业2"]);
        case 6:
          return _context0.a(2);
      }
    }, _callee0);
  })));
  test("user isolation", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
    var todoA, tagA, _yield$todos$getPage2, total, _t2, _t3;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          _context1.n = 1;
          return todos.create("user-a", {
            name: "私有",
            tagNames: ["secret"]
          });
        case 1:
          todoA = _context1.v;
          _t2 = expect;
          _context1.n = 2;
          return todos.getById("user-b", todoA.id);
        case 2:
          _t2(_context1.v).toBeNull();
          _context1.n = 3;
          return tags.listByUser("user-a");
        case 3:
          tagA = _context1.v[0];
          _t3 = expect;
          _context1.n = 4;
          return tags.getById("user-b", tagA.id);
        case 4:
          _t3(_context1.v).toBeNull();
          _context1.n = 5;
          return todos.getPage("user-b");
        case 5:
          _yield$todos$getPage2 = _context1.v;
          total = _yield$todos$getPage2.total;
          expect(total).toBe(0);
        case 6:
          return _context1.a(2);
      }
    }, _callee1);
  })));
  test("tag name conflict", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          _context10.n = 1;
          return tags.create("user-a", {
            name: "dup"
          });
        case 1:
          _context10.n = 2;
          return expect(tags.create("user-a", {
            name: "dup"
          })).rejects.toBeInstanceOf(TagConflictError);
        case 2:
          return _context10.a(2);
      }
    }, _callee10);
  })));
  test("delete tag keeps todos, removes association", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
    var todo, tagId, after;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          _context11.n = 1;
          return todos.create("user-a", {
            name: "带标签",
            tagNames: ["tmp"]
          });
        case 1:
          todo = _context11.v;
          tagId = todo.tags[0].id;
          _context11.n = 2;
          return tags["delete"]("user-a", tagId);
        case 2:
          _context11.n = 3;
          return todos.getById("user-a", todo.id);
        case 3:
          after = _context11.v;
          expect(after).not.toBeNull();
          expect(after.tags).toEqual([]);
        case 4:
          return _context11.a(2);
      }
    }, _callee11);
  })));
  test("TodoNotFoundError on update missing", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          _context12.n = 1;
          return expect(todos.update("user-a", "missing", {
            name: "x"
          })).rejects.toBeInstanceOf(TodoNotFoundError);
        case 1:
          return _context12.a(2);
      }
    }, _callee12);
  })));
});