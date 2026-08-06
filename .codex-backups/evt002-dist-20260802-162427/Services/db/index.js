function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 数据库服务入口 — 组合所有子模块，保持向后兼容的 API
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { logger } from "../../Utils/logger.js";

// ── 共享类型 ─────────────────────────────────────────────────

import { runMigrations } from "./migrations.js";
import { UserStore } from "./users.js";
import { TaskStore } from "./tasks.js";
import { UserLogStore } from "./userLogs.js";
import { AdminStore } from "./admin.js";
import { EmailAiStore } from "./emailAi.js";
import { CalendarEventMapStore } from "./calendarEventMap.js";
import { ScheduleQueueStore } from "./scheduleQueue.js";
import { TodoQueueStore } from "./todoQueue.js";
import { ChatContextStore } from "./chatContext.js";
import { SharedScheduleStore } from "./sharedSchedule.js";
import { TagStore } from "./tags.js";
import { TodoStore } from "./todos.js";
import { UserStatusStore } from "./userStatus.js";
import { CommunityStore } from "./community.js";
import { RejectionBufferStore } from "./rejectionBuffer.js";
import { ChaoxingItemMapStore } from "./chaoxingItemMap.js";
import { FollowStore } from "./follows.js";
import { ReminderStateStore } from "./reminderStates.js";
export var DatabaseService = /*#__PURE__*/function () {
  function DatabaseService() {
    _classCallCheck(this, DatabaseService);
    _defineProperty(this, "db", null);
  }
  return _createClass(DatabaseService, [{
    key: "initialize",
    value: // 子模块实例（初始化后可用）
    function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this = this;
        var dbPath, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              dbPath = process.env.WEBSITE_INSTANCE_ID ? "/home/data/users.db" : "./private/users.db";
              logger.info("Initializing database at path: ".concat(dbPath));
              _context.n = 1;
              return open({
                filename: dbPath,
                driver: sqlite3.Database
              });
            case 1:
              this.db = _context.v;
              _context.n = 2;
              return this.db.exec("PRAGMA foreign_keys = ON");
            case 2:
              _context.n = 3;
              return runMigrations(this.db);
            case 3:
              // 初始化子模块（依赖注入）
              this.logs = new UserLogStore(this.db);
              this.userStatus = new UserStatusStore(this.db);
              this.community = new CommunityStore(this.db, this.userStatus);
              _context.n = 4;
              return this.community.ensureDefaultRegions();
            case 4:
              this.tasks = new TaskStore(this.db, function (userId, type, msg, payload) {
                return _this.logs.add(userId, type, msg, payload);
              }, function (userId) {
                return _this.userStatus.invalidate(userId);
              });
              this.users = new UserStore(this.db);
              this.admin = new AdminStore(this.db);
              this.emailAi = new EmailAiStore(this.db);
              this.calendarEventMap = new CalendarEventMapStore(this.db);
              this.scheduleQueue = new ScheduleQueueStore(this.db);
              this.todoQueue = new TodoQueueStore(this.db);
              this.chatContext = new ChatContextStore(this.db);
              this.sharedSchedule = new SharedScheduleStore(this.db);
              this.tags = new TagStore(this.db);
              this.todos = new TodoStore(this.db, this.tags, function (userId, type, msg, payload) {
                return _this.logs.add(userId, type, msg, payload);
              });
              this.rejectionBuffer = new RejectionBufferStore(this.db);
              this.chaoxingItemMap = new ChaoxingItemMapStore(this.db);
              this.follows = new FollowStore(this.db);
              this.reminderStates = new ReminderStateStore(this.db);
              logger.success("Database initialized successfully");
              _context.n = 6;
              break;
            case 5:
              _context.p = 5;
              _t = _context.v;
              logger.error("Failed to initialize database:", _t);
              throw _t;
            case 6:
              return _context.a(2);
          }
        }, _callee, this, [[0, 5]]);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }() // ── 向后兼容的代理方法 ──
    // User Logs
  }, {
    key: "setLogListener",
    value: function setLogListener(listener) {
      this.logs.setLogListener(listener);
    }
  }, {
    key: "addUserLog",
    value: function () {
      var _addUserLog = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId, type, message, payload) {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              return _context2.a(2, this.logs.add(userId, type, message, payload));
          }
        }, _callee2, this);
      }));
      function addUserLog(_x, _x2, _x3, _x4) {
        return _addUserLog.apply(this, arguments);
      }
      return addUserLog;
    }()
  }, {
    key: "getUserLogsPage",
    value: function () {
      var _getUserLogsPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userId, opts) {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              return _context3.a(2, this.logs.getPage(userId, opts));
          }
        }, _callee3, this);
      }));
      function getUserLogsPage(_x5, _x6) {
        return _getUserLogsPage.apply(this, arguments);
      }
      return getUserLogsPage;
    }() // Users
  }, {
    key: "addUser",
    value: function () {
      var _addUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(user) {
        var _iterator, _step, task, _t2;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.n = 1;
              return this.users.addUser(user);
            case 1:
              _iterator = _createForOfIteratorHelper(user.tasks || []);
              _context4.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context4.n = 5;
                break;
              }
              task = _step.value;
              _context4.n = 4;
              return this.tasks.addTask(user.id, task);
            case 4:
              _context4.n = 3;
              break;
            case 5:
              _context4.n = 7;
              break;
            case 6:
              _context4.p = 6;
              _t2 = _context4.v;
              _iterator.e(_t2);
            case 7:
              _context4.p = 7;
              _iterator.f();
              return _context4.f(7);
            case 8:
              return _context4.a(2);
          }
        }, _callee4, this, [[2, 6, 7, 8]]);
      }));
      function addUser(_x7) {
        return _addUser.apply(this, arguments);
      }
      return addUser;
    }()
  }, {
    key: "updateUser",
    value: function () {
      var _updateUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(user) {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              return _context5.a(2, this.users.updateUser(user));
          }
        }, _callee5, this);
      }));
      function updateUser(_x8) {
        return _updateUser.apply(this, arguments);
      }
      return updateUser;
    }()
  }, {
    key: "getUserById",
    value: function () {
      var _getUserById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(id) {
        var _this2 = this;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              return _context6.a(2, this.users.getUserById(id, function (uid) {
                return _this2.tasks.getTasksByUserId(uid);
              }));
          }
        }, _callee6, this);
      }));
      function getUserById(_x9) {
        return _getUserById.apply(this, arguments);
      }
      return getUserById;
    }()
  }, {
    key: "getUserByEmail",
    value: function () {
      var _getUserByEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(email) {
        var _this3 = this;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              return _context7.a(2, this.users.getUserByEmail(email, function (uid) {
                return _this3.tasks.getTasksByUserId(uid);
              }));
          }
        }, _callee7, this);
      }));
      function getUserByEmail(_x0) {
        return _getUserByEmail.apply(this, arguments);
      }
      return getUserByEmail;
    }()
  }, {
    key: "getUserByCafSub",
    value: function () {
      var _getUserByCafSub = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(cafSub) {
        var _this4 = this;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              return _context8.a(2, this.users.getUserByCafSub(cafSub, function (uid) {
                return _this4.tasks.getTasksByUserId(uid);
              }));
          }
        }, _callee8, this);
      }));
      function getUserByCafSub(_x1) {
        return _getUserByCafSub.apply(this, arguments);
      }
      return getUserByCafSub;
    }()
  }, {
    key: "getAllUsers",
    value: function () {
      var _getAllUsers = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var _this5 = this;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              return _context9.a(2, this.users.getAllUsers(function (uid) {
                return _this5.tasks.getTasksByUserId(uid);
              }));
          }
        }, _callee9, this);
      }));
      function getAllUsers() {
        return _getAllUsers.apply(this, arguments);
      }
      return getAllUsers;
    }()
  }, {
    key: "updateUserHighEnergyPeriods",
    value: function () {
      var _updateUserHighEnergyPeriods = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(userId, periods) {
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              return _context0.a(2, this.users.updateUserHighEnergyPeriods(userId, periods));
          }
        }, _callee0, this);
      }));
      function updateUserHighEnergyPeriods(_x10, _x11) {
        return _updateUserHighEnergyPeriods.apply(this, arguments);
      }
      return updateUserHighEnergyPeriods;
    }()
  }, {
    key: "updateUserAvatar",
    value: function () {
      var _updateUserAvatar = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(userId, avatar) {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              return _context1.a(2, this.users.updateAvatar(userId, avatar));
          }
        }, _callee1, this);
      }));
      function updateUserAvatar(_x12, _x13) {
        return _updateUserAvatar.apply(this, arguments);
      }
      return updateUserAvatar;
    }()
  }, {
    key: "updateUserSignature",
    value: function () {
      var _updateUserSignature = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(userId, signature) {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              return _context10.a(2, this.users.updateSignature(userId, signature));
          }
        }, _callee10, this);
      }));
      function updateUserSignature(_x14, _x15) {
        return _updateUserSignature.apply(this, arguments);
      }
      return updateUserSignature;
    }()
  }, {
    key: "getUserPublicProfile",
    value: function () {
      var _getUserPublicProfile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(userId) {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              return _context11.a(2, this.users.getPublicProfile(userId));
          }
        }, _callee11, this);
      }));
      function getUserPublicProfile(_x16) {
        return _getUserPublicProfile.apply(this, arguments);
      }
      return getUserPublicProfile;
    }()
  }, {
    key: "updateUserChaoxingFields",
    value: function () {
      var _updateUserChaoxingFields = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(userId, fields) {
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              return _context12.a(2, this.users.updateChaoxingFields(userId, fields));
          }
        }, _callee12, this);
      }));
      function updateUserChaoxingFields(_x17, _x18) {
        return _updateUserChaoxingFields.apply(this, arguments);
      }
      return updateUserChaoxingFields;
    }()
  }, {
    key: "getChaoxingItemMapStore",
    value: function () {
      var _getChaoxingItemMapStore = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              return _context13.a(2, this.chaoxingItemMap);
          }
        }, _callee13, this);
      }));
      function getChaoxingItemMapStore() {
        return _getChaoxingItemMapStore.apply(this, arguments);
      }
      return getChaoxingItemMapStore;
    }() // Tasks
  }, {
    key: "addTask",
    value: function () {
      var _addTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(userId, task, boundaryConflict, allowConflict) {
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              return _context14.a(2, this.tasks.addTask(userId, task, boundaryConflict, allowConflict));
          }
        }, _callee14, this);
      }));
      function addTask(_x19, _x20, _x21, _x22) {
        return _addTask.apply(this, arguments);
      }
      return addTask;
    }()
  }, {
    key: "updateTask",
    value: function () {
      var _updateTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(task, boundaryConflict, allowConflict) {
        return _regenerator().w(function (_context15) {
          while (1) switch (_context15.n) {
            case 0:
              return _context15.a(2, this.tasks.updateTask(task, boundaryConflict, allowConflict));
          }
        }, _callee15, this);
      }));
      function updateTask(_x23, _x24, _x25) {
        return _updateTask.apply(this, arguments);
      }
      return updateTask;
    }()
  }, {
    key: "patchTask",
    value: function () {
      var _patchTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(userId, taskId, updates, boundaryConflict, allowConflict) {
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              return _context16.a(2, this.tasks.patchTask(userId, taskId, updates, boundaryConflict, allowConflict));
          }
        }, _callee16, this);
      }));
      function patchTask(_x26, _x27, _x28, _x29, _x30) {
        return _patchTask.apply(this, arguments);
      }
      return patchTask;
    }()
  }, {
    key: "getTasksByUserId",
    value: function () {
      var _getTasksByUserId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(userId) {
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.n) {
            case 0:
              return _context17.a(2, this.tasks.getTasksByUserId(userId));
          }
        }, _callee17, this);
      }));
      function getTasksByUserId(_x31) {
        return _getTasksByUserId.apply(this, arguments);
      }
      return getTasksByUserId;
    }()
  }, {
    key: "getTasksPage",
    value: function () {
      var _getTasksPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(userId, opts) {
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.n) {
            case 0:
              return _context18.a(2, this.tasks.getTasksPage(userId, opts));
          }
        }, _callee18, this);
      }));
      function getTasksPage(_x32, _x33) {
        return _getTasksPage.apply(this, arguments);
      }
      return getTasksPage;
    }()
  }, {
    key: "getOccurrencesPage",
    value: function () {
      var _getOccurrencesPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(userId, rootTaskId, opts) {
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.n) {
            case 0:
              return _context19.a(2, this.tasks.getOccurrencesPage(userId, rootTaskId, opts));
          }
        }, _callee19, this);
      }));
      function getOccurrencesPage(_x34, _x35, _x36) {
        return _getOccurrencesPage.apply(this, arguments);
      }
      return getOccurrencesPage;
    }()
  }, {
    key: "getTaskById",
    value: function () {
      var _getTaskById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(id) {
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.n) {
            case 0:
              return _context20.a(2, this.tasks.getTaskById(id));
          }
        }, _callee20, this);
      }));
      function getTaskById(_x37) {
        return _getTaskById.apply(this, arguments);
      }
      return getTaskById;
    }()
  }, {
    key: "getTasksByIds",
    value: function () {
      var _getTasksByIds = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(userId, ids) {
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.n) {
            case 0:
              return _context21.a(2, this.tasks.getTasksByIds(userId, ids));
          }
        }, _callee21, this);
      }));
      function getTasksByIds(_x38, _x39) {
        return _getTasksByIds.apply(this, arguments);
      }
      return getTasksByIds;
    }()
  }, {
    key: "getVisibleTasksByUserId",
    value: function () {
      var _getVisibleTasksByUserId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(targetUserId, viewerUserId) {
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.n) {
            case 0:
              return _context22.a(2, this.tasks.getVisibleTasksByUserId(targetUserId, viewerUserId));
          }
        }, _callee22, this);
      }));
      function getVisibleTasksByUserId(_x40, _x41) {
        return _getVisibleTasksByUserId.apply(this, arguments);
      }
      return getVisibleTasksByUserId;
    }()
  }, {
    key: "deleteTask",
    value: function () {
      var _deleteTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(id) {
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.n) {
            case 0:
              return _context23.a(2, this.tasks.deleteTask(id));
          }
        }, _callee23, this);
      }));
      function deleteTask(_x42) {
        return _deleteTask.apply(this, arguments);
      }
      return deleteTask;
    }()
  }, {
    key: "deleteTasksByPattern",
    value: function () {
      var _deleteTasksByPattern = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24(userId, pattern) {
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.n) {
            case 0:
              return _context24.a(2, this.tasks.deleteTasksByPattern(userId, pattern));
          }
        }, _callee24, this);
      }));
      function deleteTasksByPattern(_x43, _x44) {
        return _deleteTasksByPattern.apply(this, arguments);
      }
      return deleteTasksByPattern;
    }()
  }, {
    key: "refreshUserTasks",
    value: function () {
      var _refreshUserTasks = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(user) {
        var tasks;
        return _regenerator().w(function (_context25) {
          while (1) switch (_context25.n) {
            case 0:
              _context25.n = 1;
              return this.tasks.getTasksByUserId(user.id);
            case 1:
              tasks = _context25.v;
              user.tasks = tasks;
            case 2:
              return _context25.a(2);
          }
        }, _callee25, this);
      }));
      function refreshUserTasks(_x45) {
        return _refreshUserTasks.apply(this, arguments);
      }
      return refreshUserTasks;
    }()
  }, {
    key: "refreshUserTasksIncremental",
    value: function () {
      var _refreshUserTasksIncremental = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(user, opts) {
        var delSet, fetchIds, uniqueFetchIds, rows, _iterator2, _step2, _loop, _t3;
        return _regenerator().w(function (_context27) {
          while (1) switch (_context27.p = _context27.n) {
            case 0:
              user.tasks = user.tasks || [];
              if (opts !== null && opts !== void 0 && opts.deletedIds && opts.deletedIds.length > 0) {
                delSet = new Set(opts.deletedIds);
                user.tasks = user.tasks.filter(function (t) {
                  return !delSet.has(t.id);
                });
              }
              fetchIds = [];
              if (opts !== null && opts !== void 0 && opts.addedIds) fetchIds.push.apply(fetchIds, _toConsumableArray(opts.addedIds));
              if (opts !== null && opts !== void 0 && opts.updatedIds) fetchIds.push.apply(fetchIds, _toConsumableArray(opts.updatedIds));
              uniqueFetchIds = Array.from(new Set(fetchIds));
              if (!(uniqueFetchIds.length > 0)) {
                _context27.n = 8;
                break;
              }
              _context27.n = 1;
              return this.tasks.getTasksByIds(user.id, uniqueFetchIds);
            case 1:
              rows = _context27.v;
              _iterator2 = _createForOfIteratorHelper(rows);
              _context27.p = 2;
              _loop = /*#__PURE__*/_regenerator().m(function _loop() {
                var r, idx;
                return _regenerator().w(function (_context26) {
                  while (1) switch (_context26.n) {
                    case 0:
                      r = _step2.value;
                      idx = user.tasks.findIndex(function (t) {
                        return t.id === r.id;
                      });
                      if (idx >= 0) {
                        user.tasks[idx] = r;
                      } else {
                        user.tasks.push(r);
                      }
                    case 1:
                      return _context26.a(2);
                  }
                }, _loop);
              });
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context27.n = 5;
                break;
              }
              return _context27.d(_regeneratorValues(_loop()), 4);
            case 4:
              _context27.n = 3;
              break;
            case 5:
              _context27.n = 7;
              break;
            case 6:
              _context27.p = 6;
              _t3 = _context27.v;
              _iterator2.e(_t3);
            case 7:
              _context27.p = 7;
              _iterator2.f();
              return _context27.f(7);
            case 8:
              return _context27.a(2);
          }
        }, _callee26, this, [[2, 6, 7, 8]]);
      }));
      function refreshUserTasksIncremental(_x46, _x47) {
        return _refreshUserTasksIncremental.apply(this, arguments);
      }
      return refreshUserTasksIncremental;
    }() // Admin
  }, {
    key: "adminUpdateUserFields",
    value: function () {
      var _adminUpdateUserFields = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27(userId, updates) {
        return _regenerator().w(function (_context28) {
          while (1) switch (_context28.n) {
            case 0:
              return _context28.a(2, this.admin.updateUserFields(userId, updates));
          }
        }, _callee27, this);
      }));
      function adminUpdateUserFields(_x48, _x49) {
        return _adminUpdateUserFields.apply(this, arguments);
      }
      return adminUpdateUserFields;
    }()
  }, {
    key: "deleteUser",
    value: function () {
      var _deleteUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(userId) {
        return _regenerator().w(function (_context29) {
          while (1) switch (_context29.n) {
            case 0:
              return _context29.a(2, this.admin.deleteUser(userId));
          }
        }, _callee28, this);
      }));
      function deleteUser(_x50) {
        return _deleteUser.apply(this, arguments);
      }
      return deleteUser;
    }() // Email AI
  }, {
    key: "markEmailAiProcessed",
    value: function () {
      var _markEmailAiProcessed = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(userId, emailId, provider) {
        return _regenerator().w(function (_context30) {
          while (1) switch (_context30.n) {
            case 0:
              return _context30.a(2, this.emailAi.markProcessed(userId, emailId, provider));
          }
        }, _callee29, this);
      }));
      function markEmailAiProcessed(_x51, _x52, _x53) {
        return _markEmailAiProcessed.apply(this, arguments);
      }
      return markEmailAiProcessed;
    }()
  }, {
    key: "isEmailAiProcessed",
    value: function () {
      var _isEmailAiProcessed = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(userId, emailId, provider) {
        return _regenerator().w(function (_context31) {
          while (1) switch (_context31.n) {
            case 0:
              return _context31.a(2, this.emailAi.isProcessed(userId, emailId, provider));
          }
        }, _callee30, this);
      }));
      function isEmailAiProcessed(_x54, _x55, _x56) {
        return _isEmailAiProcessed.apply(this, arguments);
      }
      return isEmailAiProcessed;
    }()
  }, {
    key: "getAiProcessedEmailIds",
    value: function () {
      var _getAiProcessedEmailIds = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31(userId) {
        return _regenerator().w(function (_context32) {
          while (1) switch (_context32.n) {
            case 0:
              return _context32.a(2, this.emailAi.getProcessedIds(userId));
          }
        }, _callee31, this);
      }));
      function getAiProcessedEmailIds(_x57) {
        return _getAiProcessedEmailIds.apply(this, arguments);
      }
      return getAiProcessedEmailIds;
    }()
  }, {
    key: "deleteAiProcessedEmail",
    value: function () {
      var _deleteAiProcessedEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32(userId, emailId) {
        return _regenerator().w(function (_context33) {
          while (1) switch (_context33.n) {
            case 0:
              return _context33.a(2, this.emailAi.deleteProcessed(userId, emailId));
          }
        }, _callee32, this);
      }));
      function deleteAiProcessedEmail(_x58, _x59) {
        return _deleteAiProcessedEmail.apply(this, arguments);
      }
      return deleteAiProcessedEmail;
    }() // Calendar Event Map
  }, {
    key: "getCalendarEventMapByLocalId",
    value: function () {
      var _getCalendarEventMapByLocalId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33(userId, provider, localTaskId) {
        return _regenerator().w(function (_context34) {
          while (1) switch (_context34.n) {
            case 0:
              return _context34.a(2, this.calendarEventMap.getByLocalId(userId, provider, localTaskId));
          }
        }, _callee33, this);
      }));
      function getCalendarEventMapByLocalId(_x60, _x61, _x62) {
        return _getCalendarEventMapByLocalId.apply(this, arguments);
      }
      return getCalendarEventMapByLocalId;
    }()
  }, {
    key: "getCalendarEventMapByRemoteUid",
    value: function () {
      var _getCalendarEventMapByRemoteUid = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34(userId, provider, remoteUid) {
        return _regenerator().w(function (_context35) {
          while (1) switch (_context35.n) {
            case 0:
              return _context35.a(2, this.calendarEventMap.getByRemoteUid(userId, provider, remoteUid));
          }
        }, _callee34, this);
      }));
      function getCalendarEventMapByRemoteUid(_x63, _x64, _x65) {
        return _getCalendarEventMapByRemoteUid.apply(this, arguments);
      }
      return getCalendarEventMapByRemoteUid;
    }()
  }, {
    key: "upsertCalendarEventMap",
    value: function () {
      var _upsertCalendarEventMap = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35(entry) {
        return _regenerator().w(function (_context36) {
          while (1) switch (_context36.n) {
            case 0:
              return _context36.a(2, this.calendarEventMap.upsert(entry));
          }
        }, _callee35, this);
      }));
      function upsertCalendarEventMap(_x66) {
        return _upsertCalendarEventMap.apply(this, arguments);
      }
      return upsertCalendarEventMap;
    }()
  }, {
    key: "deleteCalendarEventMapByLocalId",
    value: function () {
      var _deleteCalendarEventMapByLocalId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(userId, provider, localTaskId) {
        return _regenerator().w(function (_context37) {
          while (1) switch (_context37.n) {
            case 0:
              return _context37.a(2, this.calendarEventMap.deleteByLocalId(userId, provider, localTaskId));
          }
        }, _callee36, this);
      }));
      function deleteCalendarEventMapByLocalId(_x67, _x68, _x69) {
        return _deleteCalendarEventMapByLocalId.apply(this, arguments);
      }
      return deleteCalendarEventMapByLocalId;
    }() // Schedule Queue
  }, {
    key: "getScheduleQueueByUser",
    value: function () {
      var _getScheduleQueueByUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(userId) {
        return _regenerator().w(function (_context38) {
          while (1) switch (_context38.n) {
            case 0:
              return _context38.a(2, this.scheduleQueue.getByUser(userId));
          }
        }, _callee37, this);
      }));
      function getScheduleQueueByUser(_x70) {
        return _getScheduleQueueByUser.apply(this, arguments);
      }
      return getScheduleQueueByUser;
    }()
  }, {
    key: "getScheduleQueueById",
    value: function () {
      var _getScheduleQueueById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(id) {
        return _regenerator().w(function (_context39) {
          while (1) switch (_context39.n) {
            case 0:
              return _context39.a(2, this.scheduleQueue.getById(id));
          }
        }, _callee38, this);
      }));
      function getScheduleQueueById(_x71) {
        return _getScheduleQueueById.apply(this, arguments);
      }
      return getScheduleQueueById;
    }()
  }, {
    key: "updateScheduleQueueStatus",
    value: function () {
      var _updateScheduleQueueStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39(id, status) {
        return _regenerator().w(function (_context40) {
          while (1) switch (_context40.n) {
            case 0:
              return _context40.a(2, this.scheduleQueue.updateStatus(id, status));
          }
        }, _callee39, this);
      }));
      function updateScheduleQueueStatus(_x72, _x73) {
        return _updateScheduleQueueStatus.apply(this, arguments);
      }
      return updateScheduleQueueStatus;
    }()
  }, {
    key: "deleteScheduleQueueItem",
    value: function () {
      var _deleteScheduleQueueItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee40(id) {
        return _regenerator().w(function (_context41) {
          while (1) switch (_context41.n) {
            case 0:
              return _context41.a(2, this.scheduleQueue["delete"](id));
          }
        }, _callee40, this);
      }));
      function deleteScheduleQueueItem(_x74) {
        return _deleteScheduleQueueItem.apply(this, arguments);
      }
      return deleteScheduleQueueItem;
    }()
  }, {
    key: "addScheduleToQueue",
    value: function () {
      var _addScheduleToQueue = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee41(userId, rawRequest) {
        return _regenerator().w(function (_context42) {
          while (1) switch (_context42.n) {
            case 0:
              return _context42.a(2, this.scheduleQueue.add(userId, rawRequest));
          }
        }, _callee41, this);
      }));
      function addScheduleToQueue(_x75, _x76) {
        return _addScheduleToQueue.apply(this, arguments);
      }
      return addScheduleToQueue;
    }() // Todo Queue
  }, {
    key: "getTodoQueueByUser",
    value: function () {
      var _getTodoQueueByUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee42(userId) {
        return _regenerator().w(function (_context43) {
          while (1) switch (_context43.n) {
            case 0:
              return _context43.a(2, this.todoQueue.getByUser(userId));
          }
        }, _callee42, this);
      }));
      function getTodoQueueByUser(_x77) {
        return _getTodoQueueByUser.apply(this, arguments);
      }
      return getTodoQueueByUser;
    }()
  }, {
    key: "getTodoQueueById",
    value: function () {
      var _getTodoQueueById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee43(id) {
        return _regenerator().w(function (_context44) {
          while (1) switch (_context44.n) {
            case 0:
              return _context44.a(2, this.todoQueue.getById(id));
          }
        }, _callee43, this);
      }));
      function getTodoQueueById(_x78) {
        return _getTodoQueueById.apply(this, arguments);
      }
      return getTodoQueueById;
    }()
  }, {
    key: "updateTodoQueueStatus",
    value: function () {
      var _updateTodoQueueStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee44(id, status) {
        return _regenerator().w(function (_context45) {
          while (1) switch (_context45.n) {
            case 0:
              return _context45.a(2, this.todoQueue.updateStatus(id, status));
          }
        }, _callee44, this);
      }));
      function updateTodoQueueStatus(_x79, _x80) {
        return _updateTodoQueueStatus.apply(this, arguments);
      }
      return updateTodoQueueStatus;
    }()
  }, {
    key: "deleteTodoQueueItem",
    value: function () {
      var _deleteTodoQueueItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee45(id) {
        return _regenerator().w(function (_context46) {
          while (1) switch (_context46.n) {
            case 0:
              return _context46.a(2, this.todoQueue["delete"](id));
          }
        }, _callee45, this);
      }));
      function deleteTodoQueueItem(_x81) {
        return _deleteTodoQueueItem.apply(this, arguments);
      }
      return deleteTodoQueueItem;
    }()
  }, {
    key: "addTodoToQueue",
    value: function () {
      var _addTodoToQueue = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee46(userId, rawRequest) {
        return _regenerator().w(function (_context47) {
          while (1) switch (_context47.n) {
            case 0:
              return _context47.a(2, this.todoQueue.add(userId, rawRequest));
          }
        }, _callee46, this);
      }));
      function addTodoToQueue(_x82, _x83) {
        return _addTodoToQueue.apply(this, arguments);
      }
      return addTodoToQueue;
    }() // Chat Context
  }, {
    key: "getChatContexts",
    value: function () {
      var _getChatContexts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee47(userId) {
        return _regenerator().w(function (_context48) {
          while (1) switch (_context48.n) {
            case 0:
              return _context48.a(2, this.chatContext.listContexts(userId));
          }
        }, _callee47, this);
      }));
      function getChatContexts(_x84) {
        return _getChatContexts.apply(this, arguments);
      }
      return getChatContexts;
    }()
  }, {
    key: "createChatContext",
    value: function () {
      var _createChatContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee48(userId) {
        return _regenerator().w(function (_context49) {
          while (1) switch (_context49.n) {
            case 0:
              return _context49.a(2, this.chatContext.create(userId));
          }
        }, _callee48, this);
      }));
      function createChatContext(_x85) {
        return _createChatContext.apply(this, arguments);
      }
      return createChatContext;
    }()
  }, {
    key: "getChatContext",
    value: function () {
      var _getChatContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee49(contextId) {
        return _regenerator().w(function (_context50) {
          while (1) switch (_context50.n) {
            case 0:
              return _context50.a(2, this.chatContext.getMessages(contextId));
          }
        }, _callee49, this);
      }));
      function getChatContext(_x86) {
        return _getChatContext.apply(this, arguments);
      }
      return getChatContext;
    }()
  }, {
    key: "deleteChatContext",
    value: function () {
      var _deleteChatContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee50(contextId) {
        return _regenerator().w(function (_context51) {
          while (1) switch (_context51.n) {
            case 0:
              return _context51.a(2, this.chatContext["delete"](contextId));
          }
        }, _callee50, this);
      }));
      function deleteChatContext(_x87) {
        return _deleteChatContext.apply(this, arguments);
      }
      return deleteChatContext;
    }()
  }, {
    key: "getChatHistory",
    value: function () {
      var _getChatHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee51(userId) {
        return _regenerator().w(function (_context52) {
          while (1) switch (_context52.n) {
            case 0:
              return _context52.a(2, this.chatContext.getActiveHistory(userId));
          }
        }, _callee51, this);
      }));
      function getChatHistory(_x88) {
        return _getChatHistory.apply(this, arguments);
      }
      return getChatHistory;
    }()
  }, {
    key: "saveChatHistory",
    value: function () {
      var _saveChatHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee52(userId, messagesJson, contextId) {
        return _regenerator().w(function (_context53) {
          while (1) switch (_context53.n) {
            case 0:
              return _context53.a(2, this.chatContext.save(userId, messagesJson, contextId));
          }
        }, _callee52, this);
      }));
      function saveChatHistory(_x89, _x90, _x91) {
        return _saveChatHistory.apply(this, arguments);
      }
      return saveChatHistory;
    }() // Shared Schedule
  }, {
    key: "createSharedSchedule",
    value: function () {
      var _createSharedSchedule = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee53(data) {
        return _regenerator().w(function (_context54) {
          while (1) switch (_context54.n) {
            case 0:
              return _context54.a(2, this.sharedSchedule.create(data));
          }
        }, _callee53, this);
      }));
      function createSharedSchedule(_x92) {
        return _createSharedSchedule.apply(this, arguments);
      }
      return createSharedSchedule;
    }()
  }, {
    key: "getSharedScheduleByToken",
    value: function () {
      var _getSharedScheduleByToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee54(token) {
        return _regenerator().w(function (_context55) {
          while (1) switch (_context55.n) {
            case 0:
              return _context55.a(2, this.sharedSchedule.getByToken(token));
          }
        }, _callee54, this);
      }));
      function getSharedScheduleByToken(_x93) {
        return _getSharedScheduleByToken.apply(this, arguments);
      }
      return getSharedScheduleByToken;
    }()
  }, {
    key: "getSharedSchedulesByUser",
    value: function () {
      var _getSharedSchedulesByUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee55(userId) {
        return _regenerator().w(function (_context56) {
          while (1) switch (_context56.n) {
            case 0:
              return _context56.a(2, this.sharedSchedule.listByUser(userId));
          }
        }, _callee55, this);
      }));
      function getSharedSchedulesByUser(_x94) {
        return _getSharedSchedulesByUser.apply(this, arguments);
      }
      return getSharedSchedulesByUser;
    }()
  }, {
    key: "deleteSharedSchedule",
    value: function () {
      var _deleteSharedSchedule = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee56(token, userId) {
        return _regenerator().w(function (_context57) {
          while (1) switch (_context57.n) {
            case 0:
              return _context57.a(2, this.sharedSchedule["delete"](token, userId));
          }
        }, _callee56, this);
      }));
      function deleteSharedSchedule(_x95, _x96) {
        return _deleteSharedSchedule.apply(this, arguments);
      }
      return deleteSharedSchedule;
    }() // Tags
  }, {
    key: "listTags",
    value: function () {
      var _listTags = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee57(userId) {
        return _regenerator().w(function (_context58) {
          while (1) switch (_context58.n) {
            case 0:
              return _context58.a(2, this.tags.listByUser(userId));
          }
        }, _callee57, this);
      }));
      function listTags(_x97) {
        return _listTags.apply(this, arguments);
      }
      return listTags;
    }()
  }, {
    key: "getTagById",
    value: function () {
      var _getTagById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee58(userId, tagId) {
        return _regenerator().w(function (_context59) {
          while (1) switch (_context59.n) {
            case 0:
              return _context59.a(2, this.tags.getById(userId, tagId));
          }
        }, _callee58, this);
      }));
      function getTagById(_x98, _x99) {
        return _getTagById.apply(this, arguments);
      }
      return getTagById;
    }()
  }, {
    key: "createTag",
    value: function () {
      var _createTag = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee59(userId, input) {
        return _regenerator().w(function (_context60) {
          while (1) switch (_context60.n) {
            case 0:
              return _context60.a(2, this.tags.create(userId, input));
          }
        }, _callee59, this);
      }));
      function createTag(_x100, _x101) {
        return _createTag.apply(this, arguments);
      }
      return createTag;
    }()
  }, {
    key: "updateTag",
    value: function () {
      var _updateTag = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee60(userId, tagId, updates) {
        return _regenerator().w(function (_context61) {
          while (1) switch (_context61.n) {
            case 0:
              return _context61.a(2, this.tags.update(userId, tagId, updates));
          }
        }, _callee60, this);
      }));
      function updateTag(_x102, _x103, _x104) {
        return _updateTag.apply(this, arguments);
      }
      return updateTag;
    }()
  }, {
    key: "deleteTag",
    value: function () {
      var _deleteTag = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee61(userId, tagId) {
        return _regenerator().w(function (_context62) {
          while (1) switch (_context62.n) {
            case 0:
              return _context62.a(2, this.tags["delete"](userId, tagId));
          }
        }, _callee61, this);
      }));
      function deleteTag(_x105, _x106) {
        return _deleteTag.apply(this, arguments);
      }
      return deleteTag;
    }() // Todos
  }, {
    key: "getTodoById",
    value: function () {
      var _getTodoById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee62(userId, todoId) {
        return _regenerator().w(function (_context63) {
          while (1) switch (_context63.n) {
            case 0:
              return _context63.a(2, this.todos.getById(userId, todoId));
          }
        }, _callee62, this);
      }));
      function getTodoById(_x107, _x108) {
        return _getTodoById.apply(this, arguments);
      }
      return getTodoById;
    }()
  }, {
    key: "createTodo",
    value: function () {
      var _createTodo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee63(userId, input) {
        return _regenerator().w(function (_context64) {
          while (1) switch (_context64.n) {
            case 0:
              return _context64.a(2, this.todos.create(userId, input));
          }
        }, _callee63, this);
      }));
      function createTodo(_x109, _x110) {
        return _createTodo.apply(this, arguments);
      }
      return createTodo;
    }()
  }, {
    key: "updateTodo",
    value: function () {
      var _updateTodo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee64(userId, todoId, updates) {
        return _regenerator().w(function (_context65) {
          while (1) switch (_context65.n) {
            case 0:
              return _context65.a(2, this.todos.update(userId, todoId, updates));
          }
        }, _callee64, this);
      }));
      function updateTodo(_x111, _x112, _x113) {
        return _updateTodo.apply(this, arguments);
      }
      return updateTodo;
    }()
  }, {
    key: "deleteTodo",
    value: function () {
      var _deleteTodo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee65(userId, todoId) {
        return _regenerator().w(function (_context66) {
          while (1) switch (_context66.n) {
            case 0:
              return _context66.a(2, this.todos["delete"](userId, todoId));
          }
        }, _callee65, this);
      }));
      function deleteTodo(_x114, _x115) {
        return _deleteTodo.apply(this, arguments);
      }
      return deleteTodo;
    }()
  }, {
    key: "getTodosPage",
    value: function () {
      var _getTodosPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee66(userId, opts) {
        return _regenerator().w(function (_context67) {
          while (1) switch (_context67.n) {
            case 0:
              return _context67.a(2, this.todos.getPage(userId, opts));
          }
        }, _callee66, this);
      }));
      function getTodosPage(_x116, _x117) {
        return _getTodosPage.apply(this, arguments);
      }
      return getTodosPage;
    }()
  }, {
    key: "getTodosByTagId",
    value: function () {
      var _getTodosByTagId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee67(userId, tagId, opts) {
        return _regenerator().w(function (_context68) {
          while (1) switch (_context68.n) {
            case 0:
              return _context68.a(2, this.todos.getByTagId(userId, tagId, opts));
          }
        }, _callee67, this);
      }));
      function getTodosByTagId(_x118, _x119, _x120) {
        return _getTodosByTagId.apply(this, arguments);
      }
      return getTodosByTagId;
    }() // User Status
  }, {
    key: "getUserStatus",
    value: function () {
      var _getUserStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee68(userId, opts) {
        return _regenerator().w(function (_context69) {
          while (1) switch (_context69.n) {
            case 0:
              return _context69.a(2, this.userStatus.getStatus(userId, opts));
          }
        }, _callee68, this);
      }));
      function getUserStatus(_x121, _x122) {
        return _getUserStatus.apply(this, arguments);
      }
      return getUserStatus;
    }()
  }, {
    key: "invalidateUserStatus",
    value: function () {
      var _invalidateUserStatus = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee69(userId) {
        return _regenerator().w(function (_context70) {
          while (1) switch (_context70.n) {
            case 0:
              return _context70.a(2, this.userStatus.invalidate(userId));
          }
        }, _callee69, this);
      }));
      function invalidateUserStatus(_x123) {
        return _invalidateUserStatus.apply(this, arguments);
      }
      return invalidateUserStatus;
    }() // Community rankings
  }, {
    key: "listCommunityRegions",
    value: function () {
      var _listCommunityRegions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee70() {
        return _regenerator().w(function (_context71) {
          while (1) switch (_context71.n) {
            case 0:
              return _context71.a(2, this.community.listRegions());
          }
        }, _callee70, this);
      }));
      function listCommunityRegions() {
        return _listCommunityRegions.apply(this, arguments);
      }
      return listCommunityRegions;
    }()
  }, {
    key: "createCommunityRegion",
    value: function () {
      var _createCommunityRegion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee71(name) {
        return _regenerator().w(function (_context72) {
          while (1) switch (_context72.n) {
            case 0:
              return _context72.a(2, this.community.createRegion(name));
          }
        }, _callee71, this);
      }));
      function createCommunityRegion(_x124) {
        return _createCommunityRegion.apply(this, arguments);
      }
      return createCommunityRegion;
    }()
  }, {
    key: "getUserCommunityRegion",
    value: function () {
      var _getUserCommunityRegion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee72(userId) {
        var id;
        return _regenerator().w(function (_context73) {
          while (1) switch (_context73.n) {
            case 0:
              _context73.n = 1;
              return this.community.getUserRegionId(userId);
            case 1:
              id = _context73.v;
              if (id) {
                _context73.n = 2;
                break;
              }
              return _context73.a(2, null);
            case 2:
              return _context73.a(2, this.community.getRegionById(id));
          }
        }, _callee72, this);
      }));
      function getUserCommunityRegion(_x125) {
        return _getUserCommunityRegion.apply(this, arguments);
      }
      return getUserCommunityRegion;
    }()
  }, {
    key: "setUserCommunityRegion",
    value: function () {
      var _setUserCommunityRegion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee73(userId, regionId) {
        return _regenerator().w(function (_context74) {
          while (1) switch (_context74.n) {
            case 0:
              return _context74.a(2, this.community.setUserRegion(userId, regionId));
          }
        }, _callee73, this);
      }));
      function setUserCommunityRegion(_x126, _x127) {
        return _setUserCommunityRegion.apply(this, arguments);
      }
      return setUserCommunityRegion;
    }()
  }, {
    key: "getCommunityRanking",
    value: function () {
      var _getCommunityRanking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee74(userId, metric, opts) {
        return _regenerator().w(function (_context75) {
          while (1) switch (_context75.n) {
            case 0:
              return _context75.a(2, this.community.getRanking(userId, metric, opts));
          }
        }, _callee74, this);
      }));
      function getCommunityRanking(_x128, _x129, _x130) {
        return _getCommunityRanking.apply(this, arguments);
      }
      return getCommunityRanking;
    }() /** 本社区四指标 topN（默认 100）：时间利用率 / 日程清爽度 / 执行效率 / 早鸟指数 */
  }, {
    key: "getAllCommunityRankings",
    value: (function () {
      var _getAllCommunityRankings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee75(userId, opts) {
        return _regenerator().w(function (_context76) {
          while (1) switch (_context76.n) {
            case 0:
              return _context76.a(2, this.community.getAllRankings(userId, opts));
          }
        }, _callee75, this);
      }));
      function getAllCommunityRankings(_x131, _x132) {
        return _getAllCommunityRankings.apply(this, arguments);
      }
      return getAllCommunityRankings;
    }()
    /**
     * 用户个人主页：公开资料 + 本周状态 + 社区称号
     * 不暴露邮箱、凭证、日程明细。
     */
    )
  }, {
    key: "getUserHomepage",
    value: (function () {
      var _getUserHomepage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee76(targetUserId, viewerUserId, opts) {
        var pub, status, _yield$this$community, region, titles, isMe, _yield$Promise$all, _yield$Promise$all2, isFollowing, followingCount, followerCount;
        return _regenerator().w(function (_context77) {
          while (1) switch (_context77.n) {
            case 0:
              _context77.n = 1;
              return this.users.getPublicProfile(targetUserId);
            case 1:
              pub = _context77.v;
              if (pub) {
                _context77.n = 2;
                break;
              }
              return _context77.a(2, null);
            case 2:
              _context77.n = 3;
              return this.userStatus.getStatus(targetUserId, {
                fresh: opts === null || opts === void 0 ? void 0 : opts.fresh,
                now: opts === null || opts === void 0 ? void 0 : opts.now
              });
            case 3:
              status = _context77.v;
              _context77.n = 4;
              return this.community.getUserTitleSummaries(targetUserId, {
                fresh: opts === null || opts === void 0 ? void 0 : opts.fresh,
                now: opts === null || opts === void 0 ? void 0 : opts.now
              });
            case 4:
              _yield$this$community = _context77.v;
              region = _yield$this$community.region;
              titles = _yield$this$community.titles;
              isMe = targetUserId === viewerUserId;
              _context77.n = 5;
              return Promise.all([isMe ? Promise.resolve(false) : this.follows.isFollowing(viewerUserId, targetUserId), this.follows.getFollowingCount(targetUserId), this.follows.getFollowerCount(targetUserId)]);
            case 5:
              _yield$Promise$all = _context77.v;
              _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3);
              isFollowing = _yield$Promise$all2[0];
              followingCount = _yield$Promise$all2[1];
              followerCount = _yield$Promise$all2[2];
              return _context77.a(2, {
                id: pub.id,
                name: pub.name,
                avatar: pub.avatar,
                signature: pub.signature,
                isMe: isMe,
                isFollowing: isFollowing,
                followingCount: followingCount,
                followerCount: followerCount,
                region: region,
                status: status,
                titles: titles
              });
          }
        }, _callee76, this);
      }));
      function getUserHomepage(_x133, _x134, _x135) {
        return _getUserHomepage.apply(this, arguments);
      }
      return getUserHomepage;
    }() // Rejection buffer（事件拒绝缓冲池，24h TTL）
    )
  }, {
    key: "addRejectionBufferItem",
    value: function () {
      var _addRejectionBufferItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee77(userId, kind, rawRequest, sourceQueueId, now) {
        return _regenerator().w(function (_context78) {
          while (1) switch (_context78.n) {
            case 0:
              return _context78.a(2, this.rejectionBuffer.add(userId, kind, rawRequest, sourceQueueId, now));
          }
        }, _callee77, this);
      }));
      function addRejectionBufferItem(_x136, _x137, _x138, _x139, _x140) {
        return _addRejectionBufferItem.apply(this, arguments);
      }
      return addRejectionBufferItem;
    }()
  }, {
    key: "getRejectionBuffer",
    value: function () {
      var _getRejectionBuffer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee78(userId, opts) {
        return _regenerator().w(function (_context79) {
          while (1) switch (_context79.n) {
            case 0:
              return _context79.a(2, this.rejectionBuffer.list(userId, opts));
          }
        }, _callee78, this);
      }));
      function getRejectionBuffer(_x141, _x142) {
        return _getRejectionBuffer.apply(this, arguments);
      }
      return getRejectionBuffer;
    }()
  }, {
    key: "cleanupExpiredRejections",
    value: function () {
      var _cleanupExpiredRejections = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee79(now) {
        return _regenerator().w(function (_context80) {
          while (1) switch (_context80.n) {
            case 0:
              return _context80.a(2, this.rejectionBuffer.deleteExpired(now));
          }
        }, _callee79, this);
      }));
      function cleanupExpiredRejections(_x143) {
        return _cleanupExpiredRejections.apply(this, arguments);
      }
      return cleanupExpiredRejections;
    }() // ── 用户关注 ──
  }, {
    key: "followUser",
    value: function () {
      var _followUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee80(followerId, followedId) {
        return _regenerator().w(function (_context81) {
          while (1) switch (_context81.n) {
            case 0:
              return _context81.a(2, this.follows.follow(followerId, followedId));
          }
        }, _callee80, this);
      }));
      function followUser(_x144, _x145) {
        return _followUser.apply(this, arguments);
      }
      return followUser;
    }()
  }, {
    key: "unfollowUser",
    value: function () {
      var _unfollowUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee81(followerId, followedId) {
        return _regenerator().w(function (_context82) {
          while (1) switch (_context82.n) {
            case 0:
              return _context82.a(2, this.follows.unfollow(followerId, followedId));
          }
        }, _callee81, this);
      }));
      function unfollowUser(_x146, _x147) {
        return _unfollowUser.apply(this, arguments);
      }
      return unfollowUser;
    }()
  }, {
    key: "isFollowing",
    value: function () {
      var _isFollowing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee82(followerId, followedId) {
        return _regenerator().w(function (_context83) {
          while (1) switch (_context83.n) {
            case 0:
              return _context83.a(2, this.follows.isFollowing(followerId, followedId));
          }
        }, _callee82, this);
      }));
      function isFollowing(_x148, _x149) {
        return _isFollowing.apply(this, arguments);
      }
      return isFollowing;
    }()
  }, {
    key: "getFollowingCount",
    value: function () {
      var _getFollowingCount = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee83(userId) {
        return _regenerator().w(function (_context84) {
          while (1) switch (_context84.n) {
            case 0:
              return _context84.a(2, this.follows.getFollowingCount(userId));
          }
        }, _callee83, this);
      }));
      function getFollowingCount(_x150) {
        return _getFollowingCount.apply(this, arguments);
      }
      return getFollowingCount;
    }()
  }, {
    key: "getFollowerCount",
    value: function () {
      var _getFollowerCount = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee84(userId) {
        return _regenerator().w(function (_context85) {
          while (1) switch (_context85.n) {
            case 0:
              return _context85.a(2, this.follows.getFollowerCount(userId));
          }
        }, _callee84, this);
      }));
      function getFollowerCount(_x151) {
        return _getFollowerCount.apply(this, arguments);
      }
      return getFollowerCount;
    }()
  }, {
    key: "getFollowing",
    value: function () {
      var _getFollowing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee85(userId, limit, offset) {
        return _regenerator().w(function (_context86) {
          while (1) switch (_context86.n) {
            case 0:
              return _context86.a(2, this.follows.getFollowing(userId, limit, offset));
          }
        }, _callee85, this);
      }));
      function getFollowing(_x152, _x153, _x154) {
        return _getFollowing.apply(this, arguments);
      }
      return getFollowing;
    }()
  }, {
    key: "getFollowers",
    value: function () {
      var _getFollowers = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee86(userId, limit, offset) {
        return _regenerator().w(function (_context87) {
          while (1) switch (_context87.n) {
            case 0:
              return _context87.a(2, this.follows.getFollowers(userId, limit, offset));
          }
        }, _callee86, this);
      }));
      function getFollowers(_x155, _x156, _x157) {
        return _getFollowers.apply(this, arguments);
      }
      return getFollowers;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee87() {
        return _regenerator().w(function (_context88) {
          while (1) switch (_context88.n) {
            case 0:
              if (!this.db) {
                _context88.n = 2;
                break;
              }
              _context88.n = 1;
              return this.db.close();
            case 1:
              this.db = null;
            case 2:
              return _context88.a(2);
          }
        }, _callee87, this);
      }));
      function close() {
        return _close.apply(this, arguments);
      }
      return close;
    }()
  }]);
}();
export var dbService = new DatabaseService();
