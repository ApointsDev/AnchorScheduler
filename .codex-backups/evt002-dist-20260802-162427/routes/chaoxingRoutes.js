function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 学习通绑定 / 设置 / 手动同步 API
 * 挂载：/api/chaoxing
 */
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { buildStatusPayload, crawlerAccountIdForUser, isChaoxingSyncing, syncChaoxingUser } from "../Services/chaoxing/syncService.js";
import { clampIntervalHours, clampPreferredHour, computeNextSyncAt, jitterMinutesForUser } from "../Services/chaoxing/scheduleNext.js";
import { disableCrawlerAccount, upsertCrawlerAccount } from "../Services/chaoxing/credentialStore.js";
export function initializeChaoxingRoutes(authenticateToken) {
  var router = express.Router();
  router.get("/chaoxing/status", authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var user;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            try {
              user = req.user;
              res.json(buildStatusPayload(user));
            } catch (e) {
              logger.error("chaoxing status error", e);
              res.status(500).json({
                error: (e === null || e === void 0 ? void 0 : e.message) || "internal_error"
              });
            }
          case 1:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  router.put("/chaoxing/bind", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var _req$body, _req$body2, _req$body3, _user$ChaoxingInterva, _req$body4, _user$ChaoxingPreferr, _req$body5, user, username, password, intervalHours, preferredHour, syncNow, accountId, nextSyncAt, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            user = req.user;
            username = String(((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.username) || "").trim();
            password = String(((_req$body2 = req.body) === null || _req$body2 === void 0 ? void 0 : _req$body2.password) || "");
            if (!(!username || !password)) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "username_and_password_required"
            }));
          case 1:
            intervalHours = clampIntervalHours(((_req$body3 = req.body) === null || _req$body3 === void 0 ? void 0 : _req$body3.intervalHours) !== undefined ? Number(req.body.intervalHours) : (_user$ChaoxingInterva = user.ChaoxingIntervalHours) !== null && _user$ChaoxingInterva !== void 0 ? _user$ChaoxingInterva : 24);
            preferredHour = clampPreferredHour(((_req$body4 = req.body) === null || _req$body4 === void 0 ? void 0 : _req$body4.preferredHour) !== undefined ? Number(req.body.preferredHour) : (_user$ChaoxingPreferr = user.ChaoxingPreferredHour) !== null && _user$ChaoxingPreferr !== void 0 ? _user$ChaoxingPreferr : 8);
            syncNow = ((_req$body5 = req.body) === null || _req$body5 === void 0 ? void 0 : _req$body5.syncNow) !== false;
            accountId = crawlerAccountIdForUser(user.id);
            _context2.n = 2;
            return upsertCrawlerAccount({
              accountId: accountId,
              username: username,
              password: password,
              enabled: true
            });
          case 2:
            nextSyncAt = computeNextSyncAt(new Date(), intervalHours, preferredHour, jitterMinutesForUser(user.id));
            _context2.n = 3;
            return dbService.updateUserChaoxingFields(user.id, {
              ChaoxingBinded: true,
              ChaoxingUsername: username,
              ChaoxingPassword: password,
              ChaoxingAccountId: accountId,
              ChaoxingIntervalHours: intervalHours,
              ChaoxingPreferredHour: preferredHour,
              ChaoxingEnabled: true,
              ChaoxingNextSyncAt: nextSyncAt,
              ChaoxingLastStatus: syncNow ? "syncing" : "idle",
              ChaoxingLastError: null
            });
          case 3:
            // 更新 cache 上的 user
            user.ChaoxingBinded = true;
            user.ChaoxingUsername = username;
            user.ChaoxingPassword = password;
            user.ChaoxingAccountId = accountId;
            user.ChaoxingIntervalHours = intervalHours;
            user.ChaoxingPreferredHour = preferredHour;
            user.ChaoxingEnabled = true;
            user.ChaoxingNextSyncAt = nextSyncAt;
            if (syncNow) {
              // 异步执行，避免 HTTP 超时
              void syncChaoxingUser(user)["catch"](function (e) {
                return logger.error("chaoxing bind syncNow failed", e);
              });
            }
            res.json(_objectSpread(_objectSpread({}, buildStatusPayload(user)), {}, {
              lastStatus: syncNow ? "syncing" : user.ChaoxingLastStatus || "idle"
            }));
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t = _context2.v;
            logger.error("chaoxing bind error", _t);
            res.status(500).json({
              error: (_t === null || _t === void 0 ? void 0 : _t.message) || "bind_failed"
            });
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 4]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  router.patch("/chaoxing/settings", authenticateToken, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var _req$body6, _req$body7, _req$body8, _user$ChaoxingInterva2, _user$ChaoxingPreferr2, user, fields, from, next, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            user = req.user;
            if (user.ChaoxingBinded) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, res.status(400).json({
              error: "not_bound"
            }));
          case 1:
            fields = {};
            if (((_req$body6 = req.body) === null || _req$body6 === void 0 ? void 0 : _req$body6.intervalHours) !== undefined) {
              fields.ChaoxingIntervalHours = clampIntervalHours(Number(req.body.intervalHours));
              user.ChaoxingIntervalHours = fields.ChaoxingIntervalHours;
            }
            if (((_req$body7 = req.body) === null || _req$body7 === void 0 ? void 0 : _req$body7.preferredHour) !== undefined) {
              fields.ChaoxingPreferredHour = clampPreferredHour(Number(req.body.preferredHour));
              user.ChaoxingPreferredHour = fields.ChaoxingPreferredHour;
            }
            if (((_req$body8 = req.body) === null || _req$body8 === void 0 ? void 0 : _req$body8.enabled) !== undefined) {
              fields.ChaoxingEnabled = !!req.body.enabled;
              user.ChaoxingEnabled = fields.ChaoxingEnabled;
            }
            from = user.ChaoxingLastSyncAt || new Date().toISOString();
            next = computeNextSyncAt(from, (_user$ChaoxingInterva2 = user.ChaoxingIntervalHours) !== null && _user$ChaoxingInterva2 !== void 0 ? _user$ChaoxingInterva2 : 24, (_user$ChaoxingPreferr2 = user.ChaoxingPreferredHour) !== null && _user$ChaoxingPreferr2 !== void 0 ? _user$ChaoxingPreferr2 : 8, jitterMinutesForUser(user.id));
            fields.ChaoxingNextSyncAt = next;
            user.ChaoxingNextSyncAt = next;
            _context3.n = 2;
            return dbService.updateUserChaoxingFields(user.id, fields);
          case 2:
            res.json(buildStatusPayload(user));
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t2 = _context3.v;
            logger.error("chaoxing settings error", _t2);
            res.status(500).json({
              error: (_t2 === null || _t2 === void 0 ? void 0 : _t2.message) || "settings_failed"
            });
          case 4:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 3]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
  router.post("/chaoxing/sync", authenticateToken, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var user, _t3;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            user = req.user;
            if (user.ChaoxingBinded) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, res.status(400).json({
              error: "not_bound"
            }));
          case 1:
            if (!isChaoxingSyncing(user.id)) {
              _context4.n = 2;
              break;
            }
            return _context4.a(2, res.status(409).json(_objectSpread({
              error: "already_syncing"
            }, buildStatusPayload(user))));
          case 2:
            // 202 立即返回，后台同步
            res.status(202).json(_objectSpread({
              status: "syncing"
            }, buildStatusPayload(user)));
            void syncChaoxingUser(user).then(function (r) {
              logger.info("chaoxing manual sync done user=".concat(user.id, " ok=").concat(r.ok));
            })["catch"](function (e) {
              return logger.error("chaoxing manual sync error", e);
            });
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t3 = _context4.v;
            logger.error("chaoxing sync error", _t3);
            if (!res.headersSent) {
              res.status(500).json({
                error: (_t3 === null || _t3 === void 0 ? void 0 : _t3.message) || "sync_failed"
              });
            }
          case 4:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 3]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());
  router["delete"]("/chaoxing/bind", authenticateToken, /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
      var user, accountId, _t4, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            user = req.user;
            accountId = user.ChaoxingAccountId || crawlerAccountIdForUser(user.id);
            _context5.p = 1;
            _context5.n = 2;
            return disableCrawlerAccount(accountId);
          case 2:
            _context5.n = 4;
            break;
          case 3:
            _context5.p = 3;
            _t4 = _context5.v;
            logger.warn("disable crawler account failed", _t4);
          case 4:
            _context5.n = 5;
            return dbService.updateUserChaoxingFields(user.id, {
              ChaoxingBinded: false,
              ChaoxingPassword: null,
              ChaoxingUsername: null,
              ChaoxingEnabled: false,
              ChaoxingLastStatus: "idle",
              ChaoxingLastError: null,
              ChaoxingNextSyncAt: null
            });
          case 5:
            user.ChaoxingBinded = false;
            user.ChaoxingPassword = undefined;
            user.ChaoxingUsername = undefined;
            user.ChaoxingEnabled = false;
            user.ChaoxingLastStatus = "idle";
            user.ChaoxingLastError = undefined;
            user.ChaoxingNextSyncAt = undefined;
            res.json({
              binded: false,
              ok: true
            });
            _context5.n = 7;
            break;
          case 6:
            _context5.p = 6;
            _t5 = _context5.v;
            logger.error("chaoxing unbind error", _t5);
            res.status(500).json({
              error: (_t5 === null || _t5 === void 0 ? void 0 : _t5.message) || "unbind_failed"
            });
          case 7:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 3], [0, 6]]);
    }));
    return function (_x9, _x0) {
      return _ref5.apply(this, arguments);
    };
  }());
  return router;
}