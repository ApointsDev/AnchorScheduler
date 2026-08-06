function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// 后台定时任务调度
// 职责：按周期遍历所有用户，触发 Exchange 同步、IMAP 连接、MS Todo 推送、课表拉取
// 具体处理逻辑拆分到各独立函数中

import axios from "axios";
import moment from "moment";
import { toShanghaiISO } from "./Utils/time.js";
import { v4 as uuidv4 } from "uuid";
import { ExchangeClient } from "./Services/exchangeClient.js";
import { ImapClient } from "./Services/imapClient.js";
import { dbService } from "./Services/dbService.js";
import { findConflictingTasks } from "./Services/scheduleConflict.js";
import { broadcastTaskChange, broadcastSmtpError } from "./Services/websocket.js";
import { logUserEvent } from "./Services/userLog.js";
import { syncUserTimetable } from "./Services/timetable.js";
import { logger } from "./Utils/logger.js";
import jwt from "jsonwebtoken";
import { ensureCafTokenValid, createCafConfig } from "./Services/cafAuth.js";
import { processEmailWithLLM } from "./Services/emailProcessor.js";
import { isChaoxingSyncing, syncChaoxingUser } from "./Services/chaoxing/syncService.js";
import { isDue } from "./Services/chaoxing/scheduleNext.js";

// 注意：为避免循环依赖，这里本地定义 Task 类型签名（与 types/models.ts 一致）

// ── JWT 验证（本地副本，避免循环依赖）──────────────────────

var JWT_SECRET = process.env.JWT_SECRET || "";
function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_unused) {
    return null;
  }
}
// ── CAF token 刷新（供 IMAP 使用）─────────────────────────
function ensureCafTokenForImap(_x, _x2) {
  return _ensureCafTokenForImap.apply(this, arguments);
} // ── Exchange 事件同步 ─────────────────────────────────────
function _ensureCafTokenForImap() {
  _ensureCafTokenForImap = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(cafConfig, user) {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          return _context4.a(2, ensureCafTokenValid(cafConfig, user));
      }
    }, _callee3);
  }));
  return _ensureCafTokenForImap.apply(this, arguments);
}
function syncExchangeEvents(_x3) {
  return _syncExchangeEvents.apply(this, arguments);
} // ── IMAP 连接 ─────────────────────────────────────────────
function _syncExchangeEvents() {
  _syncExchangeEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(user) {
    var useOAuth, useBasic, exchangeConfig, emailClient, events, _iterator2, _step2, _loop2, count, emails, _iterator3, _step3, email, full, _t5, _t6, _t7, _t8;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          useOAuth = !!(user.ExchangeBinded && user.ExchangeAccessToken);
          useBasic = !!(user.XJTLUPassword && user.XJTLUaccount);
          if (!(!useOAuth && !useBasic || user.emsClient)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2);
        case 1:
          exchangeConfig = {
            exchangeUrl: process.env.EXCHANGE_URL || "https://mail.xjtlu.edu.cn/EWS/Exchange.asmx",
            username: user.email.split("@")[0],
            password: user.XJTLUPassword || "",
            domain: process.env.EXCHANGE_DOMAIN || "xjtlu.edu.cn",
            scope: process.env.EXCHANGE_SCOPE,
            openaiApiKey: process.env.OPENAI_API_KEY || "",
            openaiModel: process.env.OPENAI_MODEL || "deepseek-chat",
            MStoken: user.MStoken
          };
          if (useOAuth) {
            exchangeConfig.oauthToken = user.ExchangeAccessToken;
            exchangeConfig.refreshToken = user.ExchangeRefreshToken;
            exchangeConfig.clientId = process.env.EXCHANGE_CLIENT_ID;
            exchangeConfig.clientSecret = process.env.EXCHANGE_CLIENT_SECRET;
            exchangeConfig.tokenUrl = process.env.EXCHANGE_TOKEN_URL || "https://login.microsoftonline.com/common/oauth2/v2.0/token";
            logger.info("Using OAuth for Exchange User ".concat(user.id));
          } else {
            logger.info("Using Basic Auth for Exchange User ".concat(user.id, " (Deprecated flow)"));
          }
          logger.info("Launching ExchangeClient for user ".concat(user.id));
          emailClient = new ExchangeClient(exchangeConfig, user);
          _context6.p = 2;
          _context6.n = 3;
          return emailClient.getEvents(toShanghaiISO(moment().subtract(1, "day").toDate()), toShanghaiISO(moment().add(1, "day").toDate()));
        case 3:
          events = _context6.v;
          logger.info("Fetched ".concat(events.length, " events for user ").concat(user.id));
          _context6.n = 4;
          return logUserEvent(user.id, "eventsFetched", "Fetched ".concat(events.length, " calendar events"), {
            count: events.length
          });
        case 4:
          _iterator2 = _createForOfIteratorHelper(events);
          _context6.p = 5;
          _loop2 = /*#__PURE__*/_regenerator().m(function _loop2() {
            var event, newTask, conflicts, eventType, eventMsg, extra, _t4;
            return _regenerator().w(function (_context5) {
              while (1) switch (_context5.p = _context5.n) {
                case 0:
                  event = _step2.value;
                  if (!user.tasks.find(function (t) {
                    return t.id === event.id;
                  })) {
                    _context5.n = 1;
                    break;
                  }
                  return _context5.a(2, 1);
                case 1:
                  newTask = {
                    id: event.id || uuidv4(),
                    name: event.subject,
                    startTime: event.start,
                    endTime: event.end,
                    location: event.location || "",
                    body: event.body || "",
                    attendees: event.attendees || [],
                    description: event.body || "",
                    dueDate: event.end,
                    completed: false,
                    pushedToMSTodo: false,
                    scheduleType: "single",
                    importance: event.importance,
                    isReminderOn: event.isReminderOn
                  };
                  _context5.p = 2;
                  conflicts = findConflictingTasks(user.tasks, newTask, {
                    boundaryConflict: !!user.conflictBoundaryInclusive
                  });
                  _context5.n = 3;
                  return dbService.addTask(user.id, newTask, !!user.conflictBoundaryInclusive, user.isConflictScheduleAllowed);
                case 3:
                  broadcastTaskChange("created", newTask, user.id);
                  _context5.n = 4;
                  return dbService.refreshUserTasksIncremental(user, {
                    addedIds: [newTask.id]
                  });
                case 4:
                  eventType = conflicts.length > 0 ? "taskConflictWarning" : "taskCreated";
                  eventMsg = conflicts.length > 0 ? "Added conflicting calendar event with warning: ".concat(newTask.name) : "Created task from calendar event: ".concat(newTask.name);
                  extra = {
                    id: newTask.id,
                    source: "Exchange",
                    startTime: newTask.startTime,
                    endTime: newTask.endTime
                  };
                  if (conflicts.length > 0) extra.conflicts = conflicts.map(function (c) {
                    return c.id;
                  });
                  _context5.n = 5;
                  return logUserEvent(user.id, eventType, eventMsg, extra);
                case 5:
                  if (conflicts.length > 0) {
                    logger.warn("Added conflicting event task ".concat(newTask.id, " for user ").concat(user.id));
                  }
                  _context5.n = 7;
                  break;
                case 6:
                  _context5.p = 6;
                  _t4 = _context5.v;
                  logger.error("Failed to persist event task ".concat(newTask.id, " for user ").concat(user.id, ":"), _t4);
                  _context5.n = 7;
                  return logUserEvent(user.id, "taskError", "Failed to persist calendar event: ".concat(newTask.name), {
                    id: newTask.id,
                    error: _t4 === null || _t4 === void 0 ? void 0 : _t4.message
                  });
                case 7:
                  return _context5.a(2);
              }
            }, _loop2, null, [[2, 6]]);
          });
          _iterator2.s();
        case 6:
          if ((_step2 = _iterator2.n()).done) {
            _context6.n = 9;
            break;
          }
          return _context6.d(_regeneratorValues(_loop2()), 7);
        case 7:
          if (!_context6.v) {
            _context6.n = 8;
            break;
          }
          return _context6.a(3, 8);
        case 8:
          _context6.n = 6;
          break;
        case 9:
          _context6.n = 11;
          break;
        case 10:
          _context6.p = 10;
          _t5 = _context6.v;
          _iterator2.e(_t5);
        case 11:
          _context6.p = 11;
          _iterator2.f();
          return _context6.f(11);
        case 12:
          _context6.n = 14;
          break;
        case 13:
          _context6.p = 13;
          _t6 = _context6.v;
          logger.error("Failed to get events for user ".concat(user.id, ":"), _t6);
          _context6.n = 14;
          return logUserEvent(user.id, "eventsError", "Failed to fetch calendar events", {
            error: _t6 === null || _t6 === void 0 ? void 0 : _t6.message
          });
        case 14:
          user.emsClient = emailClient;

          // 首次连接时拉取最近 N 封历史邮件
          if (!(user.mailReadingSpan > 0)) {
            _context6.n = 27;
            break;
          }
          count = user.mailReadingSpan;
          logger.info("Exchange initial fetch for user ".concat(user.id, ", last ").concat(count, " emails"));
          _context6.p = 15;
          _context6.n = 16;
          return emailClient.findEmails(count);
        case 16:
          emails = _context6.v;
          _iterator3 = _createForOfIteratorHelper(emails);
          _context6.p = 17;
          _iterator3.s();
        case 18:
          if ((_step3 = _iterator3.n()).done) {
            _context6.n = 21;
            break;
          }
          email = _step3.value;
          _context6.n = 19;
          return emailClient.getEmailById(email.id);
        case 19:
          full = _context6.v;
          _context6.n = 20;
          return emailClient.autoProcessNewEmail(full);
        case 20:
          _context6.n = 18;
          break;
        case 21:
          _context6.n = 23;
          break;
        case 22:
          _context6.p = 22;
          _t7 = _context6.v;
          _iterator3.e(_t7);
        case 23:
          _context6.p = 23;
          _iterator3.f();
          return _context6.f(23);
        case 24:
          _context6.n = 26;
          break;
        case 25:
          _context6.p = 25;
          _t8 = _context6.v;
          logger.error("Exchange initial fetch failed for user ".concat(user.id, ": ").concat(_t8.message));
        case 26:
          user.mailReadingSpan = 0;
          _context6.n = 27;
          return dbService.updateUser(user);
        case 27:
          return _context6.a(2);
      }
    }, _callee4, null, [[17, 22, 23, 24], [15, 25], [5, 10, 11, 12], [2, 13]]);
  }));
  return _syncExchangeEvents.apply(this, arguments);
}
function startImapForUser(_x4, _x5, _x6, _x7) {
  return _startImapForUser.apply(this, arguments);
} // ── IMAP 邮件处理（统一管道）────────────────────────────
function _startImapForUser() {
  _startImapForUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(user, cafConfig, imapRetryCount, maxRetries) {
    var _user$ImapTls;
    var hasImap, hasCreds, imapPassword, useOAuth, validToken, imapHost, imapPort, imapTls, imapConfig, imapClient, count, emails, _iterator4, _step4, email, _t1, _t10;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          // 用户通过 ImapHost/ImapPort 收信
          hasImap = !!(user.ImapBinded && user.ImapEmail && (user.ImapHost || cafConfig.imapHost) && (user.ImapPort || cafConfig.imapPort));
          hasCreds = !!(hasImap && (user.ImapPassword || user.CAFAccessToken));
          if (!(!hasCreds || user.imapClient)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2);
        case 1:
          useOAuth = false;
          if (!user.CAFAccessToken) {
            _context9.n = 4;
            break;
          }
          _context9.n = 2;
          return ensureCafTokenForImap(cafConfig, user);
        case 2:
          validToken = _context9.v;
          if (validToken) {
            _context9.n = 3;
            break;
          }
          logger.warn("CAF token not available for ".concat(user.id, " (expired or refresh failed), skipping IMAP"));
          return _context9.a(2);
        case 3:
          imapPassword = validToken;
          useOAuth = true;
          _context9.n = 5;
          break;
        case 4:
          imapPassword = user.ImapPassword || "";
        case 5:
          imapHost = user.ImapHost || cafConfig.imapHost;
          imapPort = user.ImapPort || cafConfig.imapPort;
          imapTls = (_user$ImapTls = user.ImapTls) !== null && _user$ImapTls !== void 0 ? _user$ImapTls : true;
          imapConfig = {
            host: imapHost,
            port: imapPort,
            tls: imapTls,
            username: user.ImapEmail,
            password: imapPassword,
            useOAuth: useOAuth
          };
          logger.info("Launching ImapClient for user ".concat(user.id, " with IDLE push").concat(useOAuth ? " (CAF OIDC)" : ""));
          imapClient = new ImapClient(imapConfig);
          user.imapClient = imapClient;
          imapClient.startIdle(/*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(fullEmail) {
              return _regenerator().w(function (_context7) {
                while (1) switch (_context7.n) {
                  case 0:
                    _context7.n = 1;
                    return processImapEmail(user, fullEmail);
                  case 1:
                    return _context7.a(2);
                }
              }, _callee5);
            }));
            return function (_x1) {
              return _ref3.apply(this, arguments);
            };
          }())["catch"](/*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(err) {
              var errorMsg, isAuthError, retry, _t9, _t0;
              return _regenerator().w(function (_context8) {
                while (1) switch (_context8.p = _context8.n) {
                  case 0:
                    errorMsg = err.message || "未知错误";
                    isAuthError = /auth|login|credential|unauthorized|token|expired|AUTHENTICATIONFAILED/i.test(errorMsg);
                    logger.error("Failed to start IMAP IDLE for user ".concat(user.id, ": ").concat(errorMsg));
                    user.imapClient = undefined;

                    // 认证相关错误：token 可能已过期，清除 CAF token 让用户重新登录
                    if (!(isAuthError && user.CAFAccessToken)) {
                      _context8.n = 5;
                      break;
                    }
                    logger.warn("IMAP auth error for ".concat(user.id, ", clearing CAF tokens"));
                    user.CAFAccessToken = undefined;
                    user.CAFRefreshToken = undefined;
                    user.CAFTokenExpiresAt = undefined;
                    imapRetryCount["delete"](user.id);
                    _context8.p = 1;
                    _context8.n = 2;
                    return dbService.updateUser(user);
                  case 2:
                    _context8.n = 4;
                    break;
                  case 3:
                    _context8.p = 3;
                    _t9 = _context8.v;
                  case 4:
                    broadcastSmtpError(user.id, "CAF \u8BA4\u8BC1\u5DF2\u8FC7\u671F\uFF0CIMAP \u8FDE\u63A5\u5931\u8D25\u3002\u8BF7\u91CD\u65B0\u767B\u5F55\u4EE5\u5237\u65B0\u8BA4\u8BC1\u4EE4\u724C\u3002");
                    return _context8.a(2);
                  case 5:
                    retry = imapRetryCount.get(user.id) || {
                      count: 0,
                      lastError: ""
                    };
                    retry.count++;
                    retry.lastError = errorMsg;
                    imapRetryCount.set(user.id, retry);
                    if (!(retry.count >= maxRetries)) {
                      _context8.n = 10;
                      break;
                    }
                    logger.error("IMAP for user ".concat(user.id, " failed ").concat(retry.count, " times, marking IMAP as unbound"));
                    user.ImapBinded = false;
                    user.imapClient = undefined;
                    imapRetryCount["delete"](user.id);
                    _context8.p = 6;
                    _context8.n = 7;
                    return dbService.updateUser(user);
                  case 7:
                    _context8.n = 9;
                    break;
                  case 8:
                    _context8.p = 8;
                    _t0 = _context8.v;
                  case 9:
                    broadcastSmtpError(user.id, "IMAP \u8FDE\u63A5\u5931\u8D25\uFF08\u5DF2\u91CD\u8BD5 ".concat(retry.count, " \u6B21\uFF09\uFF1A").concat(errorMsg, "\u3002IMAP \u7ED1\u5B9A\u5DF2\u81EA\u52A8\u89E3\u9664\uFF0C\u8BF7\u524D\u5F80\u8BBE\u7F6E\u9875\u9762\u91CD\u65B0\u7ED1\u5B9A\u3002"));
                  case 10:
                    return _context8.a(2);
                }
              }, _callee6, null, [[6, 8], [1, 3]]);
            }));
            return function (_x10) {
              return _ref4.apply(this, arguments);
            };
          }());
          logger.info("IMAP IDLE listener started for user ".concat(user.id));

          // 首次连接时拉取最近 N 封历史邮件
          if (!(user.mailReadingSpan > 0)) {
            _context9.n = 17;
            break;
          }
          count = user.mailReadingSpan;
          logger.info("IMAP initial fetch for user ".concat(user.id, ", last ").concat(count, " emails"));
          _context9.p = 6;
          _context9.n = 7;
          return imapClient.findEmails(count);
        case 7:
          emails = _context9.v;
          _iterator4 = _createForOfIteratorHelper(emails);
          _context9.p = 8;
          _iterator4.s();
        case 9:
          if ((_step4 = _iterator4.n()).done) {
            _context9.n = 11;
            break;
          }
          email = _step4.value;
          _context9.n = 10;
          return processImapEmail(user, email);
        case 10:
          _context9.n = 9;
          break;
        case 11:
          _context9.n = 13;
          break;
        case 12:
          _context9.p = 12;
          _t1 = _context9.v;
          _iterator4.e(_t1);
        case 13:
          _context9.p = 13;
          _iterator4.f();
          return _context9.f(13);
        case 14:
          _context9.n = 16;
          break;
        case 15:
          _context9.p = 15;
          _t10 = _context9.v;
          logger.error("IMAP initial fetch failed for user ".concat(user.id, ": ").concat(_t10.message));
        case 16:
          user.mailReadingSpan = 0;
          _context9.n = 17;
          return dbService.updateUser(user);
        case 17:
          return _context9.a(2);
      }
    }, _callee7, null, [[8, 12, 13, 14], [6, 15]]);
  }));
  return _startImapForUser.apply(this, arguments);
}
function processImapEmail(_x8, _x9) {
  return _processImapEmail.apply(this, arguments);
} // ── MS Todo 推送 ──────────────────────────────────────────
function _processImapEmail() {
  _processImapEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(user, fullEmail) {
    var emailId, alreadyProcessed, aiSuccess, _t11, _t12, _t13;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          // 防止重复 AI 处理：检查该邮件是否已被处理过
          emailId = fullEmail.id || fullEmail.uid;
          if (!emailId) {
            _context0.n = 2;
            break;
          }
          _context0.n = 1;
          return dbService.isEmailAiProcessed(user.id, String(emailId), "imap");
        case 1:
          alreadyProcessed = _context0.v;
          if (!alreadyProcessed) {
            _context0.n = 2;
            break;
          }
          logger.info("IMAP \u90AE\u4EF6 ".concat(emailId, " (").concat(fullEmail.subject, ") \u5DF2 AI \u5904\u7406\u8FC7\uFF0C\u8DF3\u8FC7"));
          return _context0.a(2);
        case 2:
          logger.info("IMAP IDLE \u6536\u5230\u65B0\u90AE\u4EF6: ".concat(fullEmail.subject, ", \u4EA4\u7531 LLM \u5904\u7406"));
          aiSuccess = false;
          if (!user.emsClient) {
            _context0.n = 7;
            break;
          }
          _context0.p = 3;
          _context0.n = 4;
          return user.emsClient.autoProcessNewEmail(fullEmail);
        case 4:
          aiSuccess = true;
          _context0.n = 6;
          break;
        case 5:
          _context0.p = 5;
          _t11 = _context0.v;
          logger.error("IDLE \u90AE\u4EF6 LLM \u5904\u7406\u5931\u8D25: ".concat(_t11.message || "未知错误"));
        case 6:
          _context0.n = 10;
          break;
        case 7:
          _context0.p = 7;
          _context0.n = 8;
          return processEmailWithLLM(user, fullEmail, "imap");
        case 8:
          aiSuccess = true;
          _context0.n = 10;
          break;
        case 9:
          _context0.p = 9;
          _t12 = _context0.v;
          logger.error("IMAP \u90AE\u4EF6 LLM \u5904\u7406\u5931\u8D25: ".concat(_t12.message || "未知错误"));
        case 10:
          if (!(aiSuccess && emailId)) {
            _context0.n = 14;
            break;
          }
          _context0.p = 11;
          _context0.n = 12;
          return dbService.markEmailAiProcessed(user.id, String(emailId), "imap");
        case 12:
          _context0.n = 14;
          break;
        case 13:
          _context0.p = 13;
          _t13 = _context0.v;
          logger.error("\u6807\u8BB0 AI \u5DF2\u5904\u7406\u5931\u8D25: ".concat(_t13.message || "未知错误"));
        case 14:
          _context0.n = 15;
          return logUserEvent(user.id, "emailProcessed", "Processed IMAP email via IDLE: ".concat(fullEmail.subject), {
            emailId: fullEmail.id,
            subject: fullEmail.subject
          });
        case 15:
          return _context0.a(2);
      }
    }, _callee8, null, [[11, 13], [7, 9], [3, 5]]);
  }));
  return _processImapEmail.apply(this, arguments);
}
function pushTasksToMsTodo(_x0) {
  return _pushTasksToMsTodo.apply(this, arguments);
} // ── 主调度入口 ────────────────────────────────────────────
function _pushTasksToMsTodo() {
  _pushTasksToMsTodo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(user) {
    var _iterator5, _step5, task, headers, listsRes, targetList, payload, _error$response, _error$response2, _error$response3, _error$response4, _t14, _t15, _t16;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _iterator5 = _createForOfIteratorHelper(user.tasks);
          _context1.p = 1;
          _iterator5.s();
        case 2:
          if ((_step5 = _iterator5.n()).done) {
            _context1.n = 21;
            break;
          }
          task = _step5.value;
          if (!task.pushedToMSTodo) {
            _context1.n = 3;
            break;
          }
          return _context1.a(3, 20);
        case 3:
          if (!(!user.MStoken || !user.MSbinded)) {
            _context1.n = 4;
            break;
          }
          return _context1.a(3, 20);
        case 4:
          headers = {
            Authorization: "Bearer ".concat(user.MStoken),
            "Content-Type": "application/json"
          };
          _context1.p = 5;
          _context1.n = 6;
          return axios.get("https://graph.microsoft.com/v1.0/me/todo/lists", {
            headers: headers
          });
        case 6:
          listsRes = _context1.v;
          targetList = listsRes.data.value.find(function (l) {
            return l.wellknownName === "myDay";
          });
          if (!targetList) {
            targetList = listsRes.data.value.find(function (l) {
              return l.wellknownName === "defaultList";
            }) || listsRes.data.value[0];
          }
          if (targetList) {
            _context1.n = 7;
            break;
          }
          throw new Error("No list found");
        case 7:
          payload = {
            title: task.name,
            body: {
              content: task.description || "",
              contentType: "text"
            },
            dueDateTime: {
              dateTime: task.dueDate,
              timeZone: "UTC"
            },
            startDateTime: task.startTime ? {
              dateTime: task.startTime,
              timeZone: "UTC"
            } : undefined,
            importance: task.importance || "normal",
            status: task.completed ? "completed" : "notStarted"
          };
          if (task.isReminderOn && task.startTime) {
            payload.reminderDateTime = {
              dateTime: task.startTime,
              timeZone: "UTC"
            };
          }
          _context1.n = 8;
          return axios.post("https://graph.microsoft.com/v1.0/me/todo/lists/".concat(targetList.id, "/tasks"), payload, {
            headers: headers
          });
        case 8:
          task.pushedToMSTodo = true;
          logger.success("Pushed task ".concat(task.id, " to MS Todo"));
          _context1.n = 9;
          return dbService.updateTask(task);
        case 9:
          _context1.n = 10;
          return logUserEvent(user.id, "msTodoPushed", "Pushed task to MS To Do: ".concat(task.name), {
            id: task.id
          });
        case 10:
          _context1.n = 20;
          break;
        case 11:
          _context1.p = 11;
          _t14 = _context1.v;
          if (!(((_error$response = _t14.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 401)) {
            _context1.n = 17;
            break;
          }
          logger.error("MS Graph API 401 for task ".concat(task.id, ": Token may be expired"));
          _context1.p = 12;
          user.MStoken = "";
          // 不清除 MSbinded —— 用户已授权，只是 token 过期
          _context1.n = 13;
          return dbService.updateUser(user);
        case 13:
          _context1.n = 14;
          return logUserEvent(user.id, "msGraphPaused", "Cleared MS token due to 401 Unauthorized");
        case 14:
          _context1.n = 16;
          break;
        case 15:
          _context1.p = 15;
          _t15 = _context1.v;
          logger.error("Failed to clear MStoken:", _t15);
        case 16:
          _context1.n = 20;
          break;
        case 17:
          if (!(((_error$response2 = _t14.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.status) === 403)) {
            _context1.n = 18;
            break;
          }
          logger.error("MS Graph API 403 Forbidden for task ".concat(task.id));
          _context1.n = 20;
          break;
        case 18:
          if (!((_error$response3 = _t14.response) !== null && _error$response3 !== void 0 && _error$response3.status)) {
            _context1.n = 19;
            break;
          }
          logger.error("MS Graph API ".concat(_t14.response.status, " error for task ").concat(task.id, ":"), _t14.response.data || _t14.message);
          _context1.n = 20;
          break;
        case 19:
          logger.error("Failed to push task ".concat(task.id, " to MS Todo:"), _t14.message || _t14);
          _context1.n = 20;
          return logUserEvent(user.id, "msTodoPushError", "Failed to push task to MS To Do: ".concat(task.name), {
            id: task.id,
            error: _t14 === null || _t14 === void 0 ? void 0 : _t14.message,
            status: _t14 === null || _t14 === void 0 || (_error$response4 = _t14.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.status
          });
        case 20:
          _context1.n = 2;
          break;
        case 21:
          _context1.n = 23;
          break;
        case 22:
          _context1.p = 22;
          _t16 = _context1.v;
          _iterator5.e(_t16);
        case 23:
          _context1.p = 23;
          _iterator5.f();
          return _context1.f(23);
        case 24:
          return _context1.a(2);
      }
    }, _callee9, null, [[12, 15], [5, 11], [1, 22, 23, 24]]);
  }));
  return _pushTasksToMsTodo.apply(this, arguments);
}
export function startIntervals(getUsers) {
  var imapRetryCount = new Map();
  var MAX_IMAP_RETRIES = 3;

  // CAF 配置（interval 内用，从环境变量 + 持久化文件构建）
  var cafConfig = createCafConfig(""); // backendUrl 在 interval 中不用于路由，仅用于 token 刷新

  var interval1 = setInterval(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var _iterator, _step, _loop, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _iterator = _createForOfIteratorHelper(getUsers());
          _context2.p = 1;
          _loop = /*#__PURE__*/_regenerator().m(function _loop() {
            var user, decoded, _t;
            return _regenerator().w(function (_context) {
              while (1) switch (_context.p = _context.n) {
                case 0:
                  user = _step.value;
                  logger.debug("Processing user ".concat(user.id, ", ebridgeBinded:").concat(user.ebridgeBinded, ", timetableUrl:").concat(user.timetableUrl));

                  // JWT 过期清理
                  if (!user.JWTtoken) {
                    _context.n = 1;
                    break;
                  }
                  decoded = verifyJwt(user.JWTtoken);
                  if (!(decoded !== null && decoded !== void 0 && decoded.exp)) {
                    _context.n = 1;
                    break;
                  }
                  if (!(Number(decoded.exp) * 1000 < Date.now())) {
                    _context.n = 1;
                    break;
                  }
                  user.JWTtoken = "";
                  logger.info("JWT token expired for user ".concat(user.id));
                  _context.n = 1;
                  return dbService.updateUser(user);
                case 1:
                  _context.n = 2;
                  return syncExchangeEvents(user);
                case 2:
                  _context.n = 3;
                  return startImapForUser(user, cafConfig, imapRetryCount, MAX_IMAP_RETRIES);
                case 3:
                  _context.n = 4;
                  return pushTasksToMsTodo(user);
                case 4:
                  if (!(user.ebridgeBinded && user.timetableUrl)) {
                    _context.n = 8;
                    break;
                  }
                  _context.p = 5;
                  _context.n = 6;
                  return syncUserTimetable(user);
                case 6:
                  _context.n = 8;
                  break;
                case 7:
                  _context.p = 7;
                  _t = _context.v;
                case 8:
                  // 学习通自动同步（有开始时间→日程，无→待办）
                  if (user.ChaoxingBinded && user.ChaoxingEnabled !== false && user.ChaoxingUsername && user.ChaoxingPassword && !isChaoxingSyncing(user.id) && isDue(user.ChaoxingNextSyncAt)) {
                    void syncChaoxingUser(user)["catch"](function (e) {
                      return logger.warn("Chaoxing auto-sync failed for ".concat(user.id, ":"), e);
                    });
                  }
                case 9:
                  return _context.a(2);
              }
            }, _loop, null, [[5, 7]]);
          });
          _iterator.s();
        case 2:
          if ((_step = _iterator.n()).done) {
            _context2.n = 4;
            break;
          }
          return _context2.d(_regeneratorValues(_loop()), 3);
        case 3:
          _context2.n = 2;
          break;
        case 4:
          _context2.n = 6;
          break;
        case 5:
          _context2.p = 5;
          _t2 = _context2.v;
          _iterator.e(_t2);
        case 6:
          _context2.p = 6;
          _iterator.f();
          return _context2.f(6);
        case 7:
          logger.debug("Checked all users for Ebridge status");
        case 8:
          return _context2.a(2);
      }
    }, _callee, null, [[1, 5, 6, 7]]);
  })), 20000);

  // 拒绝缓冲池过期清理（每小时）
  var rejectionCleanup = setInterval(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var n, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return dbService.cleanupExpiredRejections();
        case 1:
          n = _context3.v;
          if (n > 0) {
            logger.info("Rejection buffer: cleaned ".concat(n, " expired record(s)"));
          }
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          logger.warn("Rejection buffer cleanup failed:", _t3);
        case 3:
          return _context3.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  })), 60 * 60 * 1000);
  return {
    stop: function stop() {
      clearInterval(interval1);
      clearInterval(rejectionCleanup);
    }
  };
}