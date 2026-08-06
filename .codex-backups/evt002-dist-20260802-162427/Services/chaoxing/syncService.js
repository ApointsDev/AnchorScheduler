function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 学习通端到端同步：爬虫 job → 按开始时间写入日程/待办
 */

import { dbService } from "../dbService.js";
import { logger } from "../../Utils/logger.js";
import { toShanghaiISO } from "../../Utils/time.js";
import { CrawlerClient } from "./crawlerClient.js";
import { upsertCrawlerAccount } from "./credentialStore.js";
import { defaultEndFromStart, mapCrawlResultToItems, stableTaskId } from "./mapper.js";
import { clampIntervalHours, clampPreferredHour, computeNextSyncAt, jitterMinutesForUser } from "./scheduleNext.js";
var syncingUsers = new Set();
var SYNC_LEASE_MS = 10 * 60 * 1000;
var leaseUntil = new Map();
export function isChaoxingSyncing(userId) {
  var until = leaseUntil.get(userId) || 0;
  if (until && until < Date.now()) {
    leaseUntil["delete"](userId);
    syncingUsers["delete"](userId);
    return false;
  }
  return syncingUsers.has(userId);
}
function acquireLock(userId) {
  if (isChaoxingSyncing(userId)) return false;
  syncingUsers.add(userId);
  leaseUntil.set(userId, Date.now() + SYNC_LEASE_MS);
  return true;
}
function releaseLock(userId) {
  syncingUsers["delete"](userId);
  leaseUntil["delete"](userId);
}
export function crawlerAccountIdForUser(userId) {
  return "sch_".concat(userId);
}
function persistUserFields(_x, _x2) {
  return _persistUserFields.apply(this, arguments);
}
function _persistUserFields() {
  _persistUserFields = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(user, fields) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return dbService.updateUserChaoxingFields(user.id, fields);
        case 1:
          Object.assign(user, _objectSpread(_objectSpread({}, fields), {}, {
            ChaoxingBinded: fields.ChaoxingBinded !== undefined ? fields.ChaoxingBinded : user.ChaoxingBinded,
            ChaoxingEnabled: fields.ChaoxingEnabled !== undefined ? fields.ChaoxingEnabled : user.ChaoxingEnabled
          }));
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _persistUserFields.apply(this, arguments);
}
function applyItem(_x3, _x4, _x5) {
  return _applyItem.apply(this, arguments);
}
function _applyItem() {
  _applyItem = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(user, item, mapStore) {
    var existing, tagNames, startTime, endTime, taskId, task, found, userTasks, todoId, t, created, _t, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.n = 1;
          return mapStore.getByRemoteKey(user.id, item.remoteKey);
        case 1:
          existing = _context2.v;
          tagNames = ["学习通"];
          if (item.courseName) tagNames.push(item.courseName.slice(0, 64));

          // 落点迁移：todo ↔ task
          if (!(existing && existing.target !== item.target)) {
            _context2.n = 9;
            break;
          }
          if (!(existing.target === "todo" && existing.localTodoId)) {
            _context2.n = 5;
            break;
          }
          _context2.p = 2;
          _context2.n = 3;
          return dbService.deleteTodo(user.id, existing.localTodoId);
        case 3:
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t = _context2.v;
        case 5:
          if (!(existing.target === "task" && existing.localTaskId)) {
            _context2.n = 9;
            break;
          }
          _context2.p = 6;
          _context2.n = 7;
          return dbService.deleteTask(existing.localTaskId);
        case 7:
          _context2.n = 9;
          break;
        case 8:
          _context2.p = 8;
          _t2 = _context2.v;
        case 9:
          if (!(item.target === "task")) {
            _context2.n = 18;
            break;
          }
          startTime = item.startAt;
          endTime = item.endAt || defaultEndFromStart(startTime);
          taskId = (existing === null || existing === void 0 ? void 0 : existing.target) === "task" && existing.localTaskId || stableTaskId(user.id, item.remoteKey);
          task = {
            id: taskId,
            name: item.name,
            description: item.description,
            dueDate: item.endAt || endTime,
            startTime: startTime,
            endTime: endTime,
            completed: item.completed,
            pushedToMSTodo: false,
            body: JSON.stringify({
              source: "chaoxing",
              remoteKey: item.remoteKey,
              kind: item.kind
            }),
            importance: "normal",
            scheduleType: "single"
          };
          _context2.n = 10;
          return dbService.getTaskById(taskId);
        case 10:
          found = _context2.v;
          if (!(found && found.id)) {
            _context2.n = 15;
            break;
          }
          _context2.n = 11;
          return dbService.getTasksByIds(user.id, [taskId]);
        case 11:
          userTasks = _context2.v;
          if (!(userTasks.length > 0)) {
            _context2.n = 13;
            break;
          }
          _context2.n = 12;
          return dbService.updateTask(_objectSpread(_objectSpread(_objectSpread({}, found), task), {}, {
            id: taskId
          }), user.conflictBoundaryInclusive, true);
        case 12:
          _context2.n = 14;
          break;
        case 13:
          _context2.n = 14;
          return dbService.addTask(user.id, task, user.conflictBoundaryInclusive, true);
        case 14:
          _context2.n = 16;
          break;
        case 15:
          _context2.n = 16;
          return dbService.addTask(user.id, task, user.conflictBoundaryInclusive, true);
        case 16:
          _context2.n = 17;
          return mapStore.upsert({
            userId: user.id,
            remoteKey: item.remoteKey,
            kind: item.kind,
            target: "task",
            localTaskId: taskId,
            localTodoId: null,
            fingerprint: item.fingerprint
          });
        case 17:
          return _context2.a(2);
        case 18:
          // todo
          todoId = (existing === null || existing === void 0 ? void 0 : existing.target) === "todo" ? existing.localTodoId || undefined : undefined;
          if (!todoId) {
            _context2.n = 20;
            break;
          }
          _context2.n = 19;
          return dbService.getTodoById(user.id, todoId);
        case 19:
          t = _context2.v;
          if (!t) todoId = undefined;
        case 20:
          if (!todoId) {
            _context2.n = 22;
            break;
          }
          _context2.n = 21;
          return dbService.updateTodo(user.id, todoId, {
            name: item.name,
            description: item.description,
            completed: item.completed,
            dueDate: item.endAt || null,
            tagNames: tagNames,
            replaceTags: true
          });
        case 21:
          _context2.n = 24;
          break;
        case 22:
          _context2.n = 23;
          return dbService.createTodo(user.id, {
            name: item.name,
            description: item.description,
            completed: item.completed,
            dueDate: item.endAt || undefined,
            tagNames: tagNames
          });
        case 23:
          created = _context2.v;
          todoId = created.id;
        case 24:
          _context2.n = 25;
          return mapStore.upsert({
            userId: user.id,
            remoteKey: item.remoteKey,
            kind: item.kind,
            target: "todo",
            localTodoId: todoId,
            localTaskId: null,
            fingerprint: item.fingerprint
          });
        case 25:
          return _context2.a(2);
      }
    }, _callee2, null, [[6, 8], [2, 4]]);
  }));
  return _applyItem.apply(this, arguments);
}
/**
 * 完整同步（阻塞直到 job 结束或超时）
 */
export function syncChaoxingUser(_x6, _x7) {
  return _syncChaoxingUser.apply(this, arguments);
}
function _syncChaoxingUser() {
  _syncChaoxingUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(user, opts) {
    var accountId, client, _user$ChaoxingInterva2, _user$ChaoxingPreferr4, created, jobId, _yield$client$waitFor, status, result, _user$ChaoxingPreferr2, _user$ChaoxingPreferr3, errCode, errMsg, next, nextFail, items, mapStore, tasks, todos, _iterator, _step, item, now, interval, preferred, nextSyncAt, _user$ChaoxingPreferr5, msg, _nextFail, _t3, _t4, _t5, _t6, _t7;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          if (!(!user.ChaoxingBinded || !user.ChaoxingUsername || !user.ChaoxingPassword)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, {
            ok: false,
            status: "failed",
            error: "not_bound"
          });
        case 1:
          if (acquireLock(user.id)) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, {
            ok: false,
            status: "syncing",
            error: "already_syncing"
          });
        case 2:
          accountId = user.ChaoxingAccountId || crawlerAccountIdForUser(user.id);
          client = new CrawlerClient();
          _context3.p = 3;
          _context3.n = 4;
          return persistUserFields(user, {
            ChaoxingLastStatus: "syncing",
            ChaoxingLastError: null,
            ChaoxingAccountId: accountId
          });
        case 4:
          _context3.n = 5;
          return upsertCrawlerAccount({
            accountId: accountId,
            username: user.ChaoxingUsername,
            password: user.ChaoxingPassword,
            enabled: true
          });
        case 5:
          _context3.n = 6;
          return client.createJob(accountId, {
            mode: "full",
            max_workers: 4,
            notice_max_pages: 10,
            skip_ended: false
          });
        case 6:
          created = _context3.v;
          jobId = created.job_id;
          _context3.n = 7;
          return persistUserFields(user, {
            ChaoxingLastJobId: jobId,
            ChaoxingLastStatus: "syncing"
          });
        case 7:
          _context3.n = 8;
          return client.waitForJob(jobId);
        case 8:
          _yield$client$waitFor = _context3.v;
          status = _yield$client$waitFor.status;
          result = _yield$client$waitFor.result;
          if (!(status.status === "failed" || !result)) {
            _context3.n = 10;
            break;
          }
          errCode = status.error_code || "crawl_failed";
          errMsg = status.error_message || errCode || "crawl job failed";
          next = computeNextSyncAt(new Date(), 1, // 失败短退避 1h 后再按 preferred
          (_user$ChaoxingPreferr2 = user.ChaoxingPreferredHour) !== null && _user$ChaoxingPreferr2 !== void 0 ? _user$ChaoxingPreferr2 : 8, jitterMinutesForUser(user.id)); // 失败用 1 小时间隔：再算一次 from now+1h
          nextFail = computeNextSyncAt(new Date(), 1, (_user$ChaoxingPreferr3 = user.ChaoxingPreferredHour) !== null && _user$ChaoxingPreferr3 !== void 0 ? _user$ChaoxingPreferr3 : 8, jitterMinutesForUser(user.id));
          _context3.n = 9;
          return persistUserFields(user, {
            ChaoxingLastStatus: "failed",
            ChaoxingLastError: String(errMsg).slice(0, 500),
            ChaoxingLastJobId: jobId,
            ChaoxingNextSyncAt: nextFail || next
          });
        case 9:
          return _context3.a(2, {
            ok: false,
            jobId: jobId,
            status: "failed",
            error: String(errMsg),
            errorCode: errCode || undefined
          });
        case 10:
          items = mapCrawlResultToItems(result);
          _context3.n = 11;
          return dbService.getChaoxingItemMapStore();
        case 11:
          mapStore = _context3.v;
          tasks = 0;
          todos = 0;
          _iterator = _createForOfIteratorHelper(items);
          _context3.p = 12;
          _iterator.s();
        case 13:
          if ((_step = _iterator.n()).done) {
            _context3.n = 18;
            break;
          }
          item = _step.value;
          _context3.p = 14;
          _context3.n = 15;
          return applyItem(user, item, mapStore);
        case 15:
          if (item.target === "task") tasks++;else todos++;
          _context3.n = 17;
          break;
        case 16:
          _context3.p = 16;
          _t3 = _context3.v;
          logger.warn("Chaoxing apply item failed for ".concat(user.id, " ").concat(item.remoteKey, ":"), _t3);
        case 17:
          _context3.n = 13;
          break;
        case 18:
          _context3.n = 20;
          break;
        case 19:
          _context3.p = 19;
          _t4 = _context3.v;
          _iterator.e(_t4);
        case 20:
          _context3.p = 20;
          _iterator.f();
          return _context3.f(20);
        case 21:
          now = new Date();
          interval = clampIntervalHours((_user$ChaoxingInterva2 = user.ChaoxingIntervalHours) !== null && _user$ChaoxingInterva2 !== void 0 ? _user$ChaoxingInterva2 : 24);
          preferred = clampPreferredHour((_user$ChaoxingPreferr4 = user.ChaoxingPreferredHour) !== null && _user$ChaoxingPreferr4 !== void 0 ? _user$ChaoxingPreferr4 : 8);
          nextSyncAt = computeNextSyncAt(now, interval, preferred, jitterMinutesForUser(user.id));
          _context3.n = 22;
          return persistUserFields(user, {
            ChaoxingLastStatus: "succeeded",
            ChaoxingLastError: null,
            ChaoxingLastSyncAt: toShanghaiISO(now),
            ChaoxingNextSyncAt: nextSyncAt,
            ChaoxingLastJobId: jobId
          });
        case 22:
          _context3.p = 22;
          _context3.n = 23;
          return dbService.refreshUserTasks(user);
        case 23:
          _context3.n = 25;
          break;
        case 24:
          _context3.p = 24;
          _t5 = _context3.v;
        case 25:
          logger.info("Chaoxing sync ok user=".concat(user.id, " job=").concat(jobId, " items=").concat(items.length, " tasks=").concat(tasks, " todos=").concat(todos));
          return _context3.a(2, {
            ok: true,
            jobId: jobId,
            status: "succeeded",
            imported: items.length,
            tasks: tasks,
            todos: todos
          });
        case 26:
          _context3.p = 26;
          _t6 = _context3.v;
          msg = (_t6 === null || _t6 === void 0 ? void 0 : _t6.message) || String(_t6);
          logger.error("Chaoxing sync error user=".concat(user.id, ":"), msg);
          _nextFail = computeNextSyncAt(new Date(), 1, (_user$ChaoxingPreferr5 = user.ChaoxingPreferredHour) !== null && _user$ChaoxingPreferr5 !== void 0 ? _user$ChaoxingPreferr5 : 8, jitterMinutesForUser(user.id));
          _context3.p = 27;
          _context3.n = 28;
          return persistUserFields(user, {
            ChaoxingLastStatus: "failed",
            ChaoxingLastError: msg.slice(0, 500),
            ChaoxingNextSyncAt: _nextFail
          });
        case 28:
          _context3.n = 30;
          break;
        case 29:
          _context3.p = 29;
          _t7 = _context3.v;
        case 30:
          return _context3.a(2, {
            ok: false,
            status: "failed",
            error: msg
          });
        case 31:
          _context3.p = 31;
          releaseLock(user.id);
          void opts;
          return _context3.f(31);
        case 32:
          return _context3.a(2);
      }
    }, _callee3, null, [[27, 29], [22, 24], [14, 16], [12, 19, 20, 21], [3, 26, 31, 32]]);
  }));
  return _syncChaoxingUser.apply(this, arguments);
}
export function buildStatusPayload(user) {
  var _user$ChaoxingInterva, _user$ChaoxingPreferr;
  return {
    binded: !!user.ChaoxingBinded,
    username: user.ChaoxingUsername || null,
    accountId: user.ChaoxingAccountId || null,
    intervalHours: (_user$ChaoxingInterva = user.ChaoxingIntervalHours) !== null && _user$ChaoxingInterva !== void 0 ? _user$ChaoxingInterva : 24,
    preferredHour: (_user$ChaoxingPreferr = user.ChaoxingPreferredHour) !== null && _user$ChaoxingPreferr !== void 0 ? _user$ChaoxingPreferr : 8,
    enabled: user.ChaoxingEnabled !== false,
    lastSyncAt: user.ChaoxingLastSyncAt || null,
    nextSyncAt: user.ChaoxingNextSyncAt || null,
    lastJobId: user.ChaoxingLastJobId || null,
    lastStatus: user.ChaoxingLastStatus || "idle",
    lastError: user.ChaoxingLastError || null,
    syncing: isChaoxingSyncing(user.id)
  };
}