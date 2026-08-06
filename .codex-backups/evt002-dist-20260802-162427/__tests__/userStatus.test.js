var _default;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 用户状态统计：纯函数 + Store 集成测试（内存 SQLite）
 */
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { TaskStore } from "../Services/db/tasks.js";
import { UserStatusStore } from "../Services/db/userStatus.js";
import { averageCompleteDurationMs, completionHourMode, formatDurationHuman, getShanghaiHour, getShanghaiWeekRange } from "../Services/userStatusStats.js";
var SqliteDriver = sqlite3.Database || ((_default = sqlite3["default"]) === null || _default === void 0 ? void 0 : _default.Database);
describe("userStatusStats pure functions", function () {
  test("getShanghaiWeekRange: Monday-based week", function () {
    // 2026-07-15 is Wednesday Asia/Shanghai
    var now = new Date("2026-07-15T12:00:00+08:00");
    var _getShanghaiWeekRange = getShanghaiWeekRange(now),
      weekStart = _getShanghaiWeekRange.weekStart,
      weekEnd = _getShanghaiWeekRange.weekEnd;
    expect(weekStart).toBe("2026-07-13T00:00:00+08:00");
    expect(weekEnd).toBe("2026-07-20T00:00:00+08:00");
  });
  test("getShanghaiWeekRange: Sunday belongs to previous Monday week", function () {
    var now = new Date("2026-07-12T23:00:00+08:00"); // Sunday
    var _getShanghaiWeekRange2 = getShanghaiWeekRange(now),
      weekStart = _getShanghaiWeekRange2.weekStart,
      weekEnd = _getShanghaiWeekRange2.weekEnd;
    expect(weekStart).toBe("2026-07-06T00:00:00+08:00");
    expect(weekEnd).toBe("2026-07-13T00:00:00+08:00");
  });
  test("completionHourMode: bimodal average", function () {
    // 19 and 21 both peak → mode 20
    var times = ["2026-07-14T19:10:00+08:00", "2026-07-14T19:30:00+08:00", "2026-07-15T21:00:00+08:00", "2026-07-15T21:15:00+08:00", "2026-07-15T14:00:00+08:00"];
    var _completionHourMode = completionHourMode(times),
      mode = _completionHourMode.mode,
      modalHours = _completionHourMode.modalHours;
    expect(modalHours).toEqual([19, 21]);
    expect(mode).toBe(20);
  });
  test("completionHourMode: single peak", function () {
    var times = ["2026-07-14T09:00:00+08:00", "2026-07-14T09:30:00+08:00", "2026-07-14T10:00:00+08:00"];
    var _completionHourMode2 = completionHourMode(times),
      mode = _completionHourMode2.mode,
      modalHours = _completionHourMode2.modalHours;
    expect(modalHours).toEqual([9]);
    expect(mode).toBe(9);
  });
  test("completionHourMode: empty → null", function () {
    expect(completionHourMode([])).toEqual({
      mode: null,
      modalHours: []
    });
  });
  test("averageCompleteDurationMs", function () {
    var avg = averageCompleteDurationMs([{
      createdAt: "2026-07-13T00:00:00+08:00",
      completedAt: "2026-07-14T00:00:00+08:00"
    }, {
      createdAt: "2026-07-13T00:00:00+08:00",
      completedAt: "2026-07-15T00:00:00+08:00"
    }]);
    // 1d and 2d → 1.5d = 129600000 ms
    expect(avg).toBe(1.5 * 24 * 60 * 60 * 1000);
  });
  test("averageCompleteDurationMs skips invalid", function () {
    expect(averageCompleteDurationMs([{
      createdAt: null,
      completedAt: "2026-07-14T00:00:00+08:00"
    }, {
      createdAt: "2026-07-15T00:00:00+08:00",
      completedAt: "2026-07-14T00:00:00+08:00"
    }])).toBeNull();
  });
  test("getShanghaiHour", function () {
    expect(getShanghaiHour("2026-07-15T19:30:00+08:00")).toBe(19);
    expect(getShanghaiHour("2026-07-15T11:30:00Z")).toBe(19); // UTC 11:30 = SH 19:30
  });
  test("formatDurationHuman", function () {
    expect(formatDurationHuman(null)).toBeNull();
    expect(formatDurationHuman(5000)).toBe("5s");
    expect(formatDurationHuman(120000)).toBe("2m");
    expect(formatDurationHuman(7200000)).toBe("2h");
    expect(formatDurationHuman(86400000)).toBe("1d");
  });
});
function createSchema(_x) {
  return _createSchema.apply(this, arguments);
}
function _createSchema() {
  _createSchema = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(db) {
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.n = 1;
          return db.exec("PRAGMA foreign_keys = ON");
        case 1:
          _context8.n = 2;
          return db.exec("\n        CREATE TABLE users (\n            id TEXT PRIMARY KEY,\n            email TEXT UNIQUE NOT NULL,\n            name TEXT NOT NULL,\n            passwordHash TEXT\n        );\n        CREATE TABLE tasks (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            description TEXT,\n            dueDate TEXT,\n            startTime TEXT,\n            endTime TEXT,\n            location TEXT,\n            completed BOOLEAN DEFAULT 0,\n            pushedToMSTodo BOOLEAN DEFAULT 0,\n            body TEXT,\n            attendees TEXT,\n            recurrenceRule TEXT,\n            parentTaskId TEXT,\n            importance TEXT DEFAULT 'normal',\n            scheduleType TEXT DEFAULT 'single',\n            quadrant TEXT,\n            importanceScore REAL,\n            urgencyScore REAL,\n            visibility TEXT DEFAULT 'private',\n            authorizedUserIds TEXT,\n            blockedUserIds TEXT,\n            completedAt TEXT,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n        CREATE TABLE user_status (\n            userId TEXT PRIMARY KEY,\n            weekStart TEXT NOT NULL,\n            weekEnd TEXT NOT NULL,\n            completedThisWeek INTEGER NOT NULL DEFAULT 0,\n            incompleteThisWeek INTEGER NOT NULL DEFAULT 0,\n            avgCompleteDurationMs REAL,\n            completionHourMode REAL,\n            modalHours TEXT,\n            completedSampleSize INTEGER NOT NULL DEFAULT 0,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 2:
          _context8.n = 3;
          return db.run("INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)", ["user-a", "a@test.com", "User A", "x"]);
        case 3:
          return _context8.a(2);
      }
    }, _callee8);
  }));
  return _createSchema.apply(this, arguments);
}
function baseTask() {
  var _overrides$completed;
  var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    id: overrides.id || "t-".concat(Math.random().toString(36).slice(2, 8)),
    name: overrides.name || "Task",
    description: overrides.description || "",
    dueDate: overrides.dueDate || "2026-07-15T18:00:00+08:00",
    startTime: overrides.startTime || "2026-07-15T10:00:00+08:00",
    endTime: overrides.endTime || "2026-07-15T11:00:00+08:00",
    location: overrides.location,
    completed: (_overrides$completed = overrides.completed) !== null && _overrides$completed !== void 0 ? _overrides$completed : false,
    pushedToMSTodo: false,
    importance: "normal",
    scheduleType: "single",
    completedAt: overrides.completedAt
  };
}
describe("UserStatusStore + TaskStore completedAt", function () {
  var db;
  var tasks;
  var status;
  var invalidated;
  beforeEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.n = 1;
          return open({
            filename: ":memory:",
            driver: SqliteDriver
          });
        case 1:
          db = _context3.v;
          _context3.n = 2;
          return createSchema(db);
        case 2:
          invalidated = [];
          status = new UserStatusStore(db);
          tasks = new TaskStore(db, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
            return _regenerator().w(function (_context) {
              while (1) switch (_context.n) {
                case 0:
                  return _context.a(2, undefined);
              }
            }, _callee);
          })), /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId) {
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    invalidated.push(userId);
                    _context2.n = 1;
                    return status.invalidate(userId);
                  case 1:
                    return _context2.a(2);
                }
              }, _callee2);
            }));
            return function (_x2) {
              return _ref3.apply(this, arguments);
            };
          }());
        case 3:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  afterEach(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return db.close();
        case 1:
          return _context4.a(2);
      }
    }, _callee4);
  })));
  test("patch completed sets completedAt; uncomplete clears it", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var _t, _t2;
    var t, firstCompletedAt;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return tasks.addTask("user-a", baseTask({
            id: "t1"
          }));
        case 1:
          _context5.n = 2;
          return tasks.getTaskById("t1");
        case 2:
          t = _context5.v;
          expect((_t = t) === null || _t === void 0 ? void 0 : _t.completed).toBe(false);
          expect((_t2 = t) === null || _t2 === void 0 ? void 0 : _t2.completedAt).toBeUndefined();
          _context5.n = 3;
          return tasks.patchTask("user-a", "t1", {
            completed: true
          });
        case 3:
          t = _context5.v;
          expect(t.completed).toBe(true);
          expect(t.completedAt).toBeTruthy();
          firstCompletedAt = t.completedAt; // 其它字段更新不覆盖 completedAt
          _context5.n = 4;
          return tasks.patchTask("user-a", "t1", {
            name: "Renamed"
          });
        case 4:
          t = _context5.v;
          expect(t.completedAt).toBe(firstCompletedAt);
          _context5.n = 5;
          return tasks.patchTask("user-a", "t1", {
            completed: false
          });
        case 5:
          t = _context5.v;
          expect(t.completed).toBe(false);
          expect(t.completedAt).toBeUndefined();
          expect(invalidated.length).toBeGreaterThan(0);
        case 6:
          return _context5.a(2);
      }
    }, _callee5);
  })));
  test("aggregates weekly completed / incomplete / mode / duration", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var now, s, cached, again;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          // 固定 now = 2026-07-15 周三
          now = new Date("2026-07-15T12:00:00+08:00"); // 本周完成 2 条：19 点各一次 → 众数 19
          _context6.n = 1;
          return db.run("INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)\n             VALUES (?, 'user-a', 'done1', '', '2026-07-14T12:00:00+08:00', '2026-07-14T10:00:00+08:00', '2026-07-14T11:00:00+08:00', 1, 0, ?, ?)", ["c1", "2026-07-13T00:00:00+08:00", "2026-07-14T19:00:00+08:00"]);
        case 1:
          _context6.n = 2;
          return db.run("INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)\n             VALUES (?, 'user-a', 'done2', '', '2026-07-15T12:00:00+08:00', '2026-07-15T09:00:00+08:00', '2026-07-15T10:00:00+08:00', 1, 0, ?, ?)", ["c2", "2026-07-13T00:00:00+08:00", "2026-07-15T19:30:00+08:00"]);
        case 2:
          _context6.n = 3;
          return db.run("INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)\n             VALUES (?, 'user-a', 'old', '', '2026-07-10T12:00:00+08:00', '2026-07-10T10:00:00+08:00', '2026-07-10T11:00:00+08:00', 1, 0, ?, ?)", ["old", "2026-07-01T00:00:00+08:00", "2026-07-10T19:00:00+08:00"]);
        case 3:
          _context6.n = 4;
          return db.run("INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo)\n             VALUES (?, 'user-a', 'open1', '', '2026-07-16T12:00:00+08:00', '2026-07-16T10:00:00+08:00', '2026-07-16T11:00:00+08:00', 0, 0)", ["o1"]);
        case 4:
          _context6.n = 5;
          return db.run("INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo)\n             VALUES (?, 'user-a', 'open-old', '', '2026-07-08T12:00:00+08:00', '2026-07-08T10:00:00+08:00', '2026-07-08T11:00:00+08:00', 0, 0)", ["o-old"]);
        case 5:
          _context6.n = 6;
          return db.run("INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)\n             VALUES (?, 'user-a', 'legacy', '', '2026-07-15T12:00:00+08:00', '2026-07-15T14:00:00+08:00', '2026-07-15T15:00:00+08:00', 1, 0, ?, NULL)", ["legacy", "2026-07-14T00:00:00+08:00"]);
        case 6:
          _context6.n = 7;
          return status.getStatus("user-a", {
            fresh: true,
            now: now
          });
        case 7:
          s = _context6.v;
          expect(s.weekStart).toBe("2026-07-13T00:00:00+08:00");
          expect(s.weekEnd).toBe("2026-07-20T00:00:00+08:00");
          expect(s.completedThisWeek).toBe(2);
          expect(s.incompleteThisWeek).toBe(1);
          expect(s.completionHourMode).toBe(19);
          expect(s.modalHours).toEqual([19]);
          // c1: 1d+19h, c2: 2d+19.5h → avg of (43h and 67.5h) roughly
          // created 07-13 00:00 → completed 07-14 19:00 = 43h
          // created 07-13 00:00 → completed 07-15 19:30 = 67.5h
          // avg = 55.25h = 198900000 ms
          expect(s.avgCompleteDurationMs).toBe(Math.round((43 + 67.5) / 2 * 60 * 60 * 1000));
          expect(s.fromCache).toBe(false);
          expect(s.avgCompleteDurationHuman).toBeTruthy();

          // 缓存命中
          _context6.n = 8;
          return status.getStatus("user-a", {
            now: now
          });
        case 8:
          cached = _context6.v;
          expect(cached.fromCache).toBe(true);
          expect(cached.completedThisWeek).toBe(2);

          // 失效后重算
          _context6.n = 9;
          return status.invalidate("user-a");
        case 9:
          _context6.n = 10;
          return status.getStatus("user-a", {
            now: now
          });
        case 10:
          again = _context6.v;
          expect(again.fromCache).toBe(false);
          expect(again.completedThisWeek).toBe(2);
        case 11:
          return _context6.a(2);
      }
    }, _callee6);
  })));
  test("create completed task sets completedAt", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var t;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return tasks.addTask("user-a", baseTask({
            id: "done-create",
            completed: true
          }));
        case 1:
          _context7.n = 2;
          return tasks.getTaskById("done-create");
        case 2:
          t = _context7.v;
          expect(t === null || t === void 0 ? void 0 : t.completed).toBe(true);
          expect(t === null || t === void 0 ? void 0 : t.completedAt).toBeTruthy();
        case 3:
          return _context7.a(2);
      }
    }, _callee7);
  })));
});