function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 任务 CRUD 操作 — 使用统一的 mapRowToTask 消除重复

import { toShanghaiISO } from "../../Utils/time.js";
import { assertNoConflict } from "../scheduleConflict.js";
import { clampAxisScore, quadrantFromAxes, resolvePriorityAxes } from "../priorityAxes.js";
import { mapRowToTask, normalizeImportance } from "./taskMapper.js";
import { resolveTaskMetadata } from "../taskMetadata.js";
export var TaskStore = /*#__PURE__*/function () {
  function TaskStore(db, addUserLog, onTaskMutation) {
    _classCallCheck(this, TaskStore);
    this.db = db;
    this.addUserLog = addUserLog;
    this.onTaskMutation = onTaskMutation;
  }
  return _createClass(TaskStore, [{
    key: "notifyMutation",
    value: function () {
      var _notifyMutation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId) {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!(userId && this.onTaskMutation)) {
                _context.n = 4;
                break;
              }
              _context.p = 1;
              _context.n = 2;
              return this.onTaskMutation(userId);
            case 2:
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
            case 4:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3]]);
      }));
      function notifyMutation(_x) {
        return _notifyMutation.apply(this, arguments);
      }
      return notifyMutation;
    }() /** 根据 completed 状态变化计算 completedAt */
  }, {
    key: "resolveCompletedAt",
    value: function resolveCompletedAt(wasCompleted, isCompleted, existingCompletedAt, explicitCompletedAt) {
      if (!isCompleted) return null;
      if (explicitCompletedAt) {
        try {
          return toShanghaiISO(explicitCompletedAt);
        } catch (_unused2) {
          return toShanghaiISO();
        }
      }
      // 已完成且仅改其它字段 → 保留原 completedAt
      if (wasCompleted && existingCompletedAt) {
        return existingCompletedAt;
      }
      // false→true 或创建即完成
      return toShanghaiISO();
    }
  }, {
    key: "addTask",
    value: function () {
      var _addTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId, task, boundaryConflict) {
        var _task$reminderMinutes, _task$attachments;
        var allowConflict,
          existing,
          axes,
          completedAt,
          _args2 = arguments;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              allowConflict = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : true;
              _context2.n = 1;
              return this.getTasksByUserId(userId);
            case 1:
              existing = _context2.v;
              if (!allowConflict) {
                assertNoConflict(existing, task, {
                  boundaryConflict: boundaryConflict !== null && boundaryConflict !== void 0 ? boundaryConflict : false
                });
              }
              task.importance = normalizeImportance(task.importance);
              axes = resolvePriorityAxes({
                importanceScore: task.importanceScore,
                urgencyScore: task.urgencyScore,
                importance: task.importance,
                fillDefaults: true
              });
              task.importanceScore = axes.importanceScore;
              task.urgencyScore = axes.urgencyScore;
              Object.assign(task, resolveTaskMetadata(task));
              if (!task.quadrant) {
                task.quadrant = quadrantFromAxes(axes.importanceScore, axes.urgencyScore);
              }
              try {
                if (task.startTime) task.startTime = toShanghaiISO(task.startTime);
              } catch (e) {}
              try {
                if (task.endTime) task.endTime = toShanghaiISO(task.endTime);
              } catch (e) {}
              try {
                if (task.dueDate) task.dueDate = toShanghaiISO(task.dueDate);
              } catch (e) {}
              completedAt = this.resolveCompletedAt(false, !!task.completed, null, task.completedAt);
              task.completedAt = completedAt || undefined;
              _context2.n = 2;
              return this.db.run("INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, location, completed, pushedToMSTodo, body, attendees, recurrenceRule, parentTaskId, importance, eventType, category, allDay, isReminderOn, reminderMinutesBefore, attachments, scheduleType, quadrant, completedAt, importanceScore, urgencyScore, visibility, authorizedUserIds, blockedUserIds)\n             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [task.id, userId, task.name, task.description, task.dueDate, task.startTime, task.endTime, task.location, task.completed ? 1 : 0, task.pushedToMSTodo ? 1 : 0, task.body, task.attendees ? JSON.stringify(task.attendees) : null, task.recurrenceRule || null, task.parentTaskId || null, task.importance || "normal", task.eventType || "schedule", task.category || null, task.allDay ? 1 : 0, task.isReminderOn ? 1 : 0, (_task$reminderMinutes = task.reminderMinutesBefore) !== null && _task$reminderMinutes !== void 0 ? _task$reminderMinutes : null, (_task$attachments = task.attachments) !== null && _task$attachments !== void 0 && _task$attachments.length ? JSON.stringify(task.attachments) : null, task.scheduleType || "single", task.quadrant || null, completedAt, axes.importanceScore, axes.urgencyScore, task.visibility || "private", task.authorizedUserIds ? JSON.stringify(task.authorizedUserIds) : null, task.blockedUserIds ? JSON.stringify(task.blockedUserIds) : null]);
            case 2:
              _context2.n = 3;
              return this.addUserLog(userId, "task_created", "Created task ".concat(task.name), {
                taskId: task.id,
                name: task.name
              });
            case 3:
              _context2.n = 4;
              return this.notifyMutation(userId);
            case 4:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function addTask(_x2, _x3, _x4) {
        return _addTask.apply(this, arguments);
      }
      return addTask;
    }()
  }, {
    key: "updateTask",
    value: function () {
      var _updateTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(task, boundaryConflict) {
        var _task$importanceScore, _task$urgencyScore, _task$reminderMinutes2, _task$attachments2, _task$importanceScore2, _task$urgencyScore2;
        var allowConflict,
          row,
          existing,
          others,
          derivedQ,
          wasCompleted,
          completedAt,
          _args3 = arguments;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              allowConflict = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
              _context3.n = 1;
              return this.db.get("SELECT userId, completed, completedAt FROM tasks WHERE id = ?", [task.id]);
            case 1:
              row = _context3.v;
              if (!(row && row.userId)) {
                _context3.n = 3;
                break;
              }
              _context3.n = 2;
              return this.getTasksByUserId(row.userId);
            case 2:
              existing = _context3.v;
              others = existing.filter(function (t) {
                return t.id !== task.id;
              });
              if (!allowConflict) {
                assertNoConflict(others, task, {
                  boundaryConflict: boundaryConflict !== null && boundaryConflict !== void 0 ? boundaryConflict : false
                });
              }
            case 3:
              task.importance = normalizeImportance(task.importance);
              if (task.importanceScore !== undefined) {
                task.importanceScore = clampAxisScore(task.importanceScore);
              }
              if (task.urgencyScore !== undefined) {
                task.urgencyScore = clampAxisScore(task.urgencyScore);
              }
              derivedQ = quadrantFromAxes((_task$importanceScore = task.importanceScore) !== null && _task$importanceScore !== void 0 ? _task$importanceScore : null, (_task$urgencyScore = task.urgencyScore) !== null && _task$urgencyScore !== void 0 ? _task$urgencyScore : null);
              if (derivedQ) task.quadrant = derivedQ;
              Object.assign(task, resolveTaskMetadata(task, task));
              try {
                if (task.startTime) task.startTime = toShanghaiISO(task.startTime);
              } catch (e) {}
              try {
                if (task.endTime) task.endTime = toShanghaiISO(task.endTime);
              } catch (e) {}
              try {
                if (task.dueDate) task.dueDate = toShanghaiISO(task.dueDate);
              } catch (e) {}
              wasCompleted = !!(row && (row.completed === 1 || row.completed === true));
              completedAt = this.resolveCompletedAt(wasCompleted, !!task.completed, row === null || row === void 0 ? void 0 : row.completedAt, task.completedAt);
              task.completedAt = completedAt || undefined;
              _context3.n = 4;
              return this.db.run("UPDATE tasks SET name = ?, description = ?, dueDate = ?, startTime = ?, endTime = ?, location = ?, completed = ?, pushedToMSTodo = ?, body = ?, attendees = ?, recurrenceRule = ?, parentTaskId = ?, importance = ?, eventType = ?, category = ?, allDay = ?, isReminderOn = ?, reminderMinutesBefore = ?, attachments = ?, scheduleType = ?, quadrant = ?, completedAt = ?, importanceScore = ?, urgencyScore = ?, visibility = ?, authorizedUserIds = ?, blockedUserIds = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [task.name, task.description, task.dueDate, task.startTime, task.endTime, task.location, task.completed ? 1 : 0, task.pushedToMSTodo ? 1 : 0, task.body, task.attendees ? JSON.stringify(task.attendees) : null, task.recurrenceRule || null, task.parentTaskId || null, task.importance || "normal", task.eventType || "schedule", task.category || null, task.allDay ? 1 : 0, task.isReminderOn ? 1 : 0, (_task$reminderMinutes2 = task.reminderMinutesBefore) !== null && _task$reminderMinutes2 !== void 0 ? _task$reminderMinutes2 : null, (_task$attachments2 = task.attachments) !== null && _task$attachments2 !== void 0 && _task$attachments2.length ? JSON.stringify(task.attachments) : null, task.scheduleType || "single", task.quadrant || null, completedAt, (_task$importanceScore2 = task.importanceScore) !== null && _task$importanceScore2 !== void 0 ? _task$importanceScore2 : null, (_task$urgencyScore2 = task.urgencyScore) !== null && _task$urgencyScore2 !== void 0 ? _task$urgencyScore2 : null, task.visibility || "private", task.authorizedUserIds ? JSON.stringify(task.authorizedUserIds) : null, task.blockedUserIds ? JSON.stringify(task.blockedUserIds) : null, task.id]);
            case 4:
              if (!(row !== null && row !== void 0 && row.userId)) {
                _context3.n = 5;
                break;
              }
              _context3.n = 5;
              return this.notifyMutation(row.userId);
            case 5:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function updateTask(_x5, _x6) {
        return _updateTask.apply(this, arguments);
      }
      return updateTask;
    }()
  }, {
    key: "patchTask",
    value: function () {
      var _patchTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(userId, taskId, updates, boundaryConflict) {
        var allowConflict,
          existingTask,
          structuredFields,
          _existingTask$importa,
          _existingTask$urgency,
          imp,
          urg,
          q,
          updatedTask,
          allTasks,
          otherTasks,
          fields,
          completedAt,
          idx,
          setClauses,
          values,
          sql,
          _args4 = arguments;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              allowConflict = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : false;
              _context4.n = 1;
              return this.getTaskById(taskId);
            case 1:
              existingTask = _context4.v;
              if (existingTask) {
                _context4.n = 2;
                break;
              }
              throw new Error("Task not found");
            case 2:
              structuredFields = ["eventType", "category", "allDay", "isReminderOn", "reminderMinutesBefore", "attachments"];
              if (structuredFields.some(function (field) {
                return Object.prototype.hasOwnProperty.call(updates, field);
              })) {
                Object.assign(updates, resolveTaskMetadata(updates, existingTask));
              }
              if (updates.importance !== undefined) {
                updates.importance = normalizeImportance(updates.importance);
              }
              if (updates.importanceScore !== undefined) {
                updates.importanceScore = clampAxisScore(updates.importanceScore);
              }
              if (updates.urgencyScore !== undefined) {
                updates.urgencyScore = clampAxisScore(updates.urgencyScore);
              }
              // 任一轴更新时强制用双轴重算 quadrant（忽略客户端可能带来的旧 quadrant）
              if (updates.importanceScore !== undefined || updates.urgencyScore !== undefined) {
                imp = updates.importanceScore !== undefined ? updates.importanceScore : (_existingTask$importa = existingTask.importanceScore) !== null && _existingTask$importa !== void 0 ? _existingTask$importa : null;
                urg = updates.urgencyScore !== undefined ? updates.urgencyScore : (_existingTask$urgency = existingTask.urgencyScore) !== null && _existingTask$urgency !== void 0 ? _existingTask$urgency : null;
                q = quadrantFromAxes(imp !== null && imp !== void 0 ? imp : null, urg !== null && urg !== void 0 ? urg : null);
                if (q) {
                  updates.quadrant = q;
                }
              }
              updatedTask = _objectSpread(_objectSpread(_objectSpread({}, existingTask), updates), {}, {
                id: taskId
              });
              if (!(updates.startTime || updates.endTime)) {
                _context4.n = 4;
                break;
              }
              _context4.n = 3;
              return this.getTasksByUserId(userId);
            case 3:
              allTasks = _context4.v;
              otherTasks = allTasks.filter(function (t) {
                return t.id !== taskId;
              });
              if (!allowConflict) {
                assertNoConflict(otherTasks, updatedTask, {
                  boundaryConflict: boundaryConflict !== null && boundaryConflict !== void 0 ? boundaryConflict : false
                });
              }
            case 4:
              fields = Object.keys(updates).filter(function (k) {
                return k !== "id";
              });
              if (!(fields.length === 0)) {
                _context4.n = 5;
                break;
              }
              return _context4.a(2, existingTask);
            case 5:
              if (updates.startTime) {
                try {
                  updates.startTime = toShanghaiISO(updates.startTime);
                } catch (e) {}
              }
              if (updates.endTime) {
                try {
                  updates.endTime = toShanghaiISO(updates.endTime);
                } catch (e) {}
              }
              if (updates.dueDate) {
                try {
                  updates.dueDate = toShanghaiISO(updates.dueDate);
                } catch (e) {}
              }

              // 维护 completedAt：completed 变化时自动处理；禁止客户端随意改 completedAt 除非随 completed 一起
              if (updates.completed !== undefined) {
                completedAt = this.resolveCompletedAt(existingTask.completed, !!updates.completed, existingTask.completedAt, updates.completedAt);
                updates.completedAt = completedAt || undefined;
                if (!fields.includes("completedAt")) fields.push("completedAt");
              } else {
                // 不允许单独 PATCH completedAt 破坏统计
                delete updates.completedAt;
                idx = fields.indexOf("completedAt");
                if (idx >= 0) fields.splice(idx, 1);
              }
              if (!(fields.length === 0)) {
                _context4.n = 6;
                break;
              }
              return _context4.a(2, existingTask);
            case 6:
              setClauses = fields.map(function (f) {
                return "".concat(f, " = ?");
              }).join(", ");
              values = fields.map(function (f) {
                var key = f;
                var value = updates[key];
                if (f === "completedAt") {
                  return value || null;
                }
                if (typeof value === "boolean") return value ? 1 : 0;
                if (_typeof(value) === "object" && value !== null) return JSON.stringify(value);
                return value;
              });
              sql = "UPDATE tasks SET ".concat(setClauses, ", updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?");
              _context4.n = 7;
              return this.db.run(sql, [].concat(_toConsumableArray(values), [taskId, userId]));
            case 7:
              _context4.n = 8;
              return this.addUserLog(userId, "task_updated", "Updated task ".concat(taskId), {
                taskId: taskId,
                updates: updates
              });
            case 8:
              _context4.n = 9;
              return this.notifyMutation(userId);
            case 9:
              _context4.n = 10;
              return this.getTaskById(taskId);
            case 10:
              return _context4.a(2, _context4.v);
          }
        }, _callee4, this);
      }));
      function patchTask(_x7, _x8, _x9, _x0) {
        return _patchTask.apply(this, arguments);
      }
      return patchTask;
    }()
  }, {
    key: "getTasksByUserId",
    value: function () {
      var _getTasksByUserId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId) {
        var rows;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return this.db.all("SELECT * FROM tasks WHERE userId = ?", [userId]);
            case 1:
              rows = _context5.v;
              return _context5.a(2, rows.map(mapRowToTask));
          }
        }, _callee5, this);
      }));
      function getTasksByUserId(_x1) {
        return _getTasksByUserId.apply(this, arguments);
      }
      return getTasksByUserId;
    }()
  }, {
    key: "getTasksPage",
    value: function () {
      var _getTasksPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId, opts) {
        var where, params, like, whereSql, sortField, order, limit, offset, countRow, total, sql, rows;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              where = ["userId = ?"];
              params = [userId];
              if (opts !== null && opts !== void 0 && opts.start) {
                where.push("endTime >= ?");
                params.push(opts.start);
              }
              if (opts !== null && opts !== void 0 && opts.end) {
                where.push("startTime <= ?");
                params.push(opts.end);
              }
              if (typeof (opts === null || opts === void 0 ? void 0 : opts.completed) === "boolean") {
                where.push("completed = ?");
                params.push(opts.completed ? 1 : 0);
              }
              if (opts !== null && opts !== void 0 && opts.q) {
                like = "%".concat(opts.q.toLowerCase(), "%");
                where.push("(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)");
                params.push(like, like, like);
              }
              whereSql = where.length ? "WHERE ".concat(where.join(" AND ")) : "";
              sortField = ["startTime", "dueDate", "name", "endTime"].includes((opts === null || opts === void 0 ? void 0 : opts.sortBy) || "") ? opts.sortBy : "startTime";
              order = (opts === null || opts === void 0 ? void 0 : opts.order) === "desc" ? "DESC" : "ASC";
              limit = Math.max(1, Math.min(500, (opts === null || opts === void 0 ? void 0 : opts.limit) || 50));
              offset = Math.max(0, (opts === null || opts === void 0 ? void 0 : opts.offset) || 0);
              _context6.n = 1;
              return this.db.get("SELECT COUNT(*) as cnt FROM tasks ".concat(whereSql), params);
            case 1:
              countRow = _context6.v;
              total = countRow ? countRow.cnt || 0 : 0;
              sql = "SELECT * FROM tasks ".concat(whereSql, " ORDER BY ").concat(sortField, " ").concat(order, " LIMIT ? OFFSET ?");
              _context6.n = 2;
              return this.db.all(sql, params.concat([limit, offset]));
            case 2:
              rows = _context6.v;
              return _context6.a(2, {
                tasks: rows.map(mapRowToTask),
                total: total
              });
          }
        }, _callee6, this);
      }));
      function getTasksPage(_x10, _x11) {
        return _getTasksPage.apply(this, arguments);
      }
      return getTasksPage;
    }()
  }, {
    key: "getOccurrencesPage",
    value: function () {
      var _getOccurrencesPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(userId, rootTaskId, opts) {
        var where, params, whereSql, sortField, order, limit, offset, countRow, total, rows;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              where = ["userId = ?", "parentTaskId = ?"];
              params = [userId, rootTaskId];
              whereSql = "WHERE ".concat(where.join(" AND "));
              sortField = ["startTime", "dueDate", "name", "endTime"].includes((opts === null || opts === void 0 ? void 0 : opts.sortBy) || "") ? opts.sortBy : "startTime";
              order = (opts === null || opts === void 0 ? void 0 : opts.order) === "desc" ? "DESC" : "ASC";
              limit = Math.max(1, Math.min(500, (opts === null || opts === void 0 ? void 0 : opts.limit) || 50));
              offset = Math.max(0, (opts === null || opts === void 0 ? void 0 : opts.offset) || 0);
              _context7.n = 1;
              return this.db.get("SELECT COUNT(*) as cnt FROM tasks ".concat(whereSql), params);
            case 1:
              countRow = _context7.v;
              total = countRow ? countRow.cnt || 0 : 0;
              _context7.n = 2;
              return this.db.all("SELECT * FROM tasks ".concat(whereSql, " ORDER BY ").concat(sortField, " ").concat(order, " LIMIT ? OFFSET ?"), params.concat([limit, offset]));
            case 2:
              rows = _context7.v;
              return _context7.a(2, {
                occurrences: rows.map(mapRowToTask),
                total: total
              });
          }
        }, _callee7, this);
      }));
      function getOccurrencesPage(_x12, _x13, _x14) {
        return _getOccurrencesPage.apply(this, arguments);
      }
      return getOccurrencesPage;
    }()
  }, {
    key: "getTaskById",
    value: function () {
      var _getTaskById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(id) {
        var row;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return this.db.get("SELECT * FROM tasks WHERE id = ?", [id]);
            case 1:
              row = _context8.v;
              if (row) {
                _context8.n = 2;
                break;
              }
              return _context8.a(2, null);
            case 2:
              return _context8.a(2, mapRowToTask(row));
          }
        }, _callee8, this);
      }));
      function getTaskById(_x15) {
        return _getTaskById.apply(this, arguments);
      }
      return getTaskById;
    }()
  }, {
    key: "getTasksByIds",
    value: function () {
      var _getTasksByIds = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(userId, ids) {
        var placeholders, rows;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              if (!(!ids || ids.length === 0)) {
                _context9.n = 1;
                break;
              }
              return _context9.a(2, []);
            case 1:
              placeholders = ids.map(function () {
                return "?";
              }).join(",");
              _context9.n = 2;
              return this.db.all("SELECT * FROM tasks WHERE userId = ? AND id IN (".concat(placeholders, ")"), [userId].concat(_toConsumableArray(ids)));
            case 2:
              rows = _context9.v;
              return _context9.a(2, rows.map(mapRowToTask));
          }
        }, _callee9, this);
      }));
      function getTasksByIds(_x16, _x17) {
        return _getTasksByIds.apply(this, arguments);
      }
      return getTasksByIds;
    }()
  }, {
    key: "deleteTask",
    value: function () {
      var _deleteTask = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(id) {
        var row, userId, result, success;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              _context0.n = 1;
              return this.db.get("SELECT userId FROM tasks WHERE id = ?", [id]);
            case 1:
              row = _context0.v;
              userId = row ? row.userId : null;
              _context0.n = 2;
              return this.db.run("DELETE FROM tasks WHERE id = ?", [id]);
            case 2:
              result = _context0.v;
              success = ((result === null || result === void 0 ? void 0 : result.changes) || 0) > 0;
              if (!(success && userId)) {
                _context0.n = 4;
                break;
              }
              _context0.n = 3;
              return this.addUserLog(userId, "task_deleted", "Deleted task ".concat(id), {
                taskId: id
              });
            case 3:
              _context0.n = 4;
              return this.notifyMutation(userId);
            case 4:
              return _context0.a(2, success);
          }
        }, _callee0, this);
      }));
      function deleteTask(_x18) {
        return _deleteTask.apply(this, arguments);
      }
      return deleteTask;
    }()
    /**
     * 获取目标用户中对 viewerId 可见的日程列表。
     * - 本人查看本人：全部返回
     * - "public"   → 全部可见
     * - "private"  → 仅本人可见
     * - "authorized" → authorizedUserIds 包含 viewerId 时可见
     * - "blocked"   → blockedUserIds 不包含 viewerId 时可见
     */
  }, {
    key: "getVisibleTasksByUserId",
    value: (function () {
      var _getVisibleTasksByUserId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(targetUserId, viewerUserId) {
        var all;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return this.getTasksByUserId(targetUserId);
            case 1:
              all = _context1.v;
              if (!(targetUserId === viewerUserId)) {
                _context1.n = 2;
                break;
              }
              return _context1.a(2, all);
            case 2:
              return _context1.a(2, all.filter(function (task) {
                var vis = task.visibility || "private";
                if (vis === "public") return true;
                if (vis === "private") return false;
                if (vis === "authorized") {
                  var authIds = task.authorizedUserIds || [];
                  return authIds.includes(viewerUserId);
                }
                if (vis === "blocked") {
                  var blockedIds = task.blockedUserIds || [];
                  return !blockedIds.includes(viewerUserId);
                }
                return false;
              }));
          }
        }, _callee1, this);
      }));
      function getVisibleTasksByUserId(_x19, _x20) {
        return _getVisibleTasksByUserId.apply(this, arguments);
      }
      return getVisibleTasksByUserId;
    }())
  }, {
    key: "deleteTasksByPattern",
    value: function () {
      var _deleteTasksByPattern = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(userId, pattern) {
        var rows, ids, result, count;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return this.db.all("SELECT id FROM tasks WHERE userId = ? AND id LIKE ?", [userId, pattern]);
            case 1:
              rows = _context10.v;
              ids = rows.map(function (r) {
                return r.id;
              });
              if (!(ids.length === 0)) {
                _context10.n = 2;
                break;
              }
              return _context10.a(2, 0);
            case 2:
              _context10.n = 3;
              return this.db.run("DELETE FROM tasks WHERE userId = ? AND id LIKE ?", [userId, pattern]);
            case 3:
              result = _context10.v;
              count = (result === null || result === void 0 ? void 0 : result.changes) || 0;
              if (!(count > 0)) {
                _context10.n = 5;
                break;
              }
              _context10.n = 4;
              return this.addUserLog(userId, "tasks_deleted_pattern", "Deleted ".concat(count, " tasks matching pattern ").concat(pattern), {
                pattern: pattern,
                count: count,
                deletedIds: ids
              });
            case 4:
              _context10.n = 5;
              return this.notifyMutation(userId);
            case 5:
              return _context10.a(2, count);
          }
        }, _callee10, this);
      }));
      function deleteTasksByPattern(_x21, _x22) {
        return _deleteTasksByPattern.apply(this, arguments);
      }
      return deleteTasksByPattern;
    }()
  }]);
}();