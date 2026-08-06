function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Admin Routes - 管理员后台 API
 *
 * 需要管理员权限（ADMIN_EMAILS 环境变量配置）
 * 提供用户管理功能：查看、编辑所有用户字段
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { ADMIN_FIELD_META, ADMIN_EDITABLE_FIELDS } from "./apiType.js";

// ── 管理员列表加载（仅从 .env 中的 ADMIN_EMAILS 读取）────────

function loadAdminEmails() {
  return (process.env.ADMIN_EMAILS || "").split(",").map(function (e) {
    return e.trim().toLowerCase();
  }).filter(Boolean);
}
var ADMIN_EMAILS = loadAdminEmails();
logger.info("Admin emails loaded: ".concat(ADMIN_EMAILS.length > 0 ? ADMIN_EMAILS.join(", ") : "(none)"));

// ── 管理员中间件 ────────────────────────────────────────────────

export function isAdmin(email) {
  if (ADMIN_EMAILS.length === 0) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
export function adminMiddleware(req, res, next) {
  var user = req.user;
  if (!user || !isAdmin(user.email)) {
    return res.status(403).json({
      error: "需要管理员权限"
    });
  }
  next();
}

// ── User → AdminUserRow 映射 ────────────────────────────────────

function mapUserToRow(user) {
  var _user$mailReadingSpan;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    XJTLUaccount: user.XJTLUaccount || null,
    XJTLUPassword: user.XJTLUPassword || null,
    passwordHash: user.passwordHash || null,
    JWTtoken: user.JWTtoken || null,
    MStoken: user.MStoken || null,
    MSRefreshToken: user.MSRefreshToken || null,
    MSbinded: !!user.MSbinded,
    ExchangeAccessToken: user.ExchangeAccessToken || null,
    ExchangeRefreshToken: user.ExchangeRefreshToken || null,
    ExchangeTokenExpiresAt: user.ExchangeTokenExpiresAt || null,
    ExchangeBinded: !!user.ExchangeBinded,
    ImapBinded: !!user.ImapBinded,
    ImapEmail: user.ImapEmail || null,
    ImapPassword: user.ImapPassword || null,
    ImapHost: user.ImapHost || null,
    ImapPort: user.ImapPort || null,
    ImapTls: !!user.ImapTls,
    CAFSub: user.CAFSub || null,
    CAFAccessToken: user.CAFAccessToken || null,
    CAFRefreshToken: user.CAFRefreshToken || null,
    CAFTokenExpiresAt: user.CAFTokenExpiresAt || null,
    ebridgeBinded: !!user.ebridgeBinded,
    timetableUrl: user.timetableUrl || "",
    timetableFetchLevel: user.timetableFetchLevel || 0,
    mailReadingSpan: (_user$mailReadingSpan = user.mailReadingSpan) !== null && _user$mailReadingSpan !== void 0 ? _user$mailReadingSpan : 30,
    conflictBoundaryInclusive: !!user.conflictBoundaryInclusive,
    weekOffset: user.weekOffset || 0,
    CalDavBaseUrl: user.CalDavBaseUrl || null,
    CalDavUsername: user.CalDavUsername || null,
    CalDavPassword: user.CalDavPassword || null,
    CalDavPrincipalUrl: user.CalDavPrincipalUrl || null,
    CalDavCalendarHome: user.CalDavCalendarHome || null,
    CalDavCalendarUrl: user.CalDavCalendarUrl || null,
    CalDavEnabled: !!user.CalDavEnabled,
    CalDavLastSyncAt: user.CalDavLastSyncAt || null,
    CalDavServerEnabled: !!user.CalDavServerEnabled,
    highEnergyPeriods: user.highEnergyPeriods || {},
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,
    taskCount: (user.tasks || []).length
  };
}

// ── 快速判断字段类型（基于 ADMIN_FIELD_META）───────────────────

function getFieldType(key) {
  var _ADMIN_FIELD_META$key;
  return ((_ADMIN_FIELD_META$key = ADMIN_FIELD_META[key]) === null || _ADMIN_FIELD_META$key === void 0 ? void 0 : _ADMIN_FIELD_META$key.type) || "text";
}

// ── Router ──────────────────────────────────────────────────────

export function createAdminRouter() {
  var router = express.Router();

  // ── GET /api/admin/check — 检查当前用户是否为管理员（不需要管理员权限）──
  router.get("/check", function (req, res) {
    var user = req.user;
    if (!user) {
      return res.json({
        isAdmin: false
      });
    }
    res.json({
      isAdmin: isAdmin(user.email)
    });
  });

  // 其他 admin 路由都需要管理员权限
  router.use(adminMiddleware);

  // ── GET /api/admin/fields ─────────────────────────────────────
  router.get("/fields", function (_req, res) {
    res.json({
      fields: ADMIN_FIELD_META
    });
  });

  // ── GET /api/admin/users ──────────────────────────────────────
  router.get("/users", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var _req$query, search, _req$query$page, page, _req$query$limit, limit, pageNum, limitNum, offset, users, q, total, pagedUsers, rows, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _req$query = req.query, search = _req$query.search, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? "1" : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? "50" : _req$query$limit;
            pageNum = Math.max(1, parseInt(page, 10) || 1);
            limitNum = Math.max(1, Math.min(200, parseInt(limit, 10) || 50));
            offset = (pageNum - 1) * limitNum;
            _context.n = 1;
            return dbService.getAllUsers();
          case 1:
            users = _context.v;
            // 搜索过滤
            if (search && typeof search === "string") {
              q = search.toLowerCase();
              users = users.filter(function (u) {
                return u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
              });
            }
            total = users.length;
            pagedUsers = users.slice(offset, offset + limitNum);
            rows = pagedUsers.map(mapUserToRow);
            res.json({
              users: rows,
              total: total,
              page: pageNum,
              limit: limitNum,
              totalPages: Math.ceil(total / limitNum)
            });
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            logger.error("Admin get users error:", _t);
            res.status(500).json({
              error: "获取用户列表失败"
            });
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  // ── GET /api/admin/users/:id ──────────────────────────────────
  router.get("/users/:id", /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var user, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _context2.n = 1;
            return dbService.getUserById(req.params.id);
          case 1:
            user = _context2.v;
            if (user) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, res.status(404).json({
              error: "用户不存在"
            }));
          case 2:
            res.json(mapUserToRow(user));
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            logger.error("Admin get user error:", _t2);
            res.status(500).json({
              error: "获取用户信息失败"
            });
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 3]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  // ── PATCH /api/admin/users/:id ────────────────────────────────
  router.patch("/users/:id", /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var userId, updates, existingUser, _i, _Object$keys, key, sanitized, _i2, _Object$entries, _Object$entries$_i, _key, value, fieldType, updatedUser, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            userId = req.params.id;
            updates = req.body;
            if (!(!updates || _typeof(updates) !== "object" || Object.keys(updates).length === 0)) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, res.status(400).json({
              error: "请提供要更新的字段"
            }));
          case 1:
            _context3.n = 2;
            return dbService.getUserById(userId);
          case 2:
            existingUser = _context3.v;
            if (existingUser) {
              _context3.n = 3;
              break;
            }
            return _context3.a(2, res.status(404).json({
              error: "用户不存在"
            }));
          case 3:
            _i = 0, _Object$keys = Object.keys(updates);
          case 4:
            if (!(_i < _Object$keys.length)) {
              _context3.n = 7;
              break;
            }
            key = _Object$keys[_i];
            if (!(key === "id")) {
              _context3.n = 5;
              break;
            }
            return _context3.a(3, 6);
          case 5:
            if (ADMIN_EDITABLE_FIELDS.has(key)) {
              _context3.n = 6;
              break;
            }
            return _context3.a(2, res.status(400).json({
              error: "\u4E0D\u5141\u8BB8\u7684\u5B57\u6BB5: ".concat(key)
            }));
          case 6:
            _i++;
            _context3.n = 4;
            break;
          case 7:
            // 构建更新值（根据 ADMIN_FIELD_META 类型转换）
            sanitized = {};
            _i2 = 0, _Object$entries = Object.entries(updates);
          case 8:
            if (!(_i2 < _Object$entries.length)) {
              _context3.n = 11;
              break;
            }
            _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2), _key = _Object$entries$_i[0], value = _Object$entries$_i[1];
            if (!(_key === "id")) {
              _context3.n = 9;
              break;
            }
            return _context3.a(3, 10);
          case 9:
            fieldType = getFieldType(_key);
            if (fieldType === "boolean") {
              sanitized[_key] = value ? 1 : 0;
            } else if (fieldType === "json") {
              sanitized[_key] = typeof value === "string" ? value : JSON.stringify(value);
            } else if (fieldType === "number") {
              sanitized[_key] = value === "" || value === null ? null : Number(value);
            } else {
              sanitized[_key] = value === "" ? null : value;
            }
          case 10:
            _i2++;
            _context3.n = 8;
            break;
          case 11:
            if (!(Object.keys(sanitized).length === 0)) {
              _context3.n = 12;
              break;
            }
            return _context3.a(2, res.status(400).json({
              error: "没有有效的字段需要更新"
            }));
          case 12:
            _context3.n = 13;
            return dbService.adminUpdateUserFields(userId, sanitized);
          case 13:
            logger.info("Admin: user ".concat(userId, " updated fields: ").concat(Object.keys(sanitized).join(", ")));
            _context3.n = 14;
            return dbService.getUserById(userId);
          case 14:
            updatedUser = _context3.v;
            res.json(mapUserToRow(updatedUser));
            _context3.n = 16;
            break;
          case 15:
            _context3.p = 15;
            _t3 = _context3.v;
            logger.error("Admin update user error:", _t3);
            res.status(500).json({
              error: "更新用户失败: " + (_t3.message || "")
            });
          case 16:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 15]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  // ── POST /api/admin/users — 创建新用户 ─────────────────────────
  router.post("/users", /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var _ref5, email, name, password, XJTLUaccount, XJTLUPassword, existingUser, _yield$import, uuidv4, bcrypt, id, passwordHash, user, _t4, _t5;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            _ref5 = req.body || {}, email = _ref5.email, name = _ref5.name, password = _ref5.password, XJTLUaccount = _ref5.XJTLUaccount, XJTLUPassword = _ref5.XJTLUPassword;
            if (!(!email || !name)) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, res.status(400).json({
              error: "邮箱和昵称为必填项"
            }));
          case 1:
            _context4.n = 2;
            return dbService.getUserByEmail(email.toLowerCase());
          case 2:
            existingUser = _context4.v;
            if (!existingUser) {
              _context4.n = 3;
              break;
            }
            return _context4.a(2, res.status(409).json({
              error: "该邮箱已被使用"
            }));
          case 3:
            _context4.n = 4;
            return import("uuid");
          case 4:
            _yield$import = _context4.v;
            uuidv4 = _yield$import.v4;
            _context4.n = 5;
            return import("bcryptjs");
          case 5:
            bcrypt = _context4.v;
            id = uuidv4();
            if (!password) {
              _context4.n = 7;
              break;
            }
            _context4.n = 6;
            return bcrypt.hash(password, 10);
          case 6:
            _t4 = _context4.v;
            _context4.n = 8;
            break;
          case 7:
            _t4 = null;
          case 8:
            passwordHash = _t4;
            user = {
              id: id,
              email: email.toLowerCase(),
              name: name,
              passwordHash: passwordHash,
              XJTLUaccount: XJTLUaccount || null,
              XJTLUPassword: XJTLUPassword || null,
              MSbinded: false,
              ExchangeBinded: false,
              ImapBinded: false,
              ebridgeBinded: false,
              timetableUrl: "",
              timetableFetchLevel: 0,
              mailReadingSpan: 30,
              conflictBoundaryInclusive: false,
              weekOffset: 0,
              CalDavEnabled: false,
              CalDavServerEnabled: false,
              tasks: []
            };
            _context4.n = 9;
            return dbService.addUser(user);
          case 9:
            logger.info("Admin: created user ".concat(user.email, " (").concat(user.id, ")"));
            res.status(201).json({
              id: user.id,
              email: user.email,
              name: user.name
            });
            _context4.n = 11;
            break;
          case 10:
            _context4.p = 10;
            _t5 = _context4.v;
            logger.error("Admin create user error:", _t5);
            res.status(500).json({
              error: "创建用户失败: " + (_t5.message || "")
            });
          case 11:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 10]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());

  // ── DELETE /api/admin/users/:id — 删除用户 ──────────────────────
  router["delete"]("/users/:id", /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
      var userId, user, _t6;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            userId = req.params.id;
            _context5.n = 1;
            return dbService.getUserById(userId);
          case 1:
            user = _context5.v;
            if (user) {
              _context5.n = 2;
              break;
            }
            return _context5.a(2, res.status(404).json({
              error: "用户不存在"
            }));
          case 2:
            _context5.n = 3;
            return dbService.deleteUser(userId);
          case 3:
            logger.info("Admin: deleted user ".concat(user.email, " (").concat(userId, ")"));
            res.json({
              message: "\u7528\u6237 ".concat(user.email, " \u5DF2\u5220\u9664"),
              id: userId
            });
            _context5.n = 5;
            break;
          case 4:
            _context5.p = 4;
            _t6 = _context5.v;
            logger.error("Admin delete user error:", _t6);
            res.status(500).json({
              error: "删除用户失败: " + (_t6.message || "")
            });
          case 5:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 4]]);
    }));
    return function (_x9, _x0) {
      return _ref6.apply(this, arguments);
    };
  }());

  // ── GET /api/admin/users/:id/schedule — 查看用户日程 ──────────
  router.get("/users/:id/schedule", /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
      var userId, user, tasks, taskList, _t7;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            _context6.p = 0;
            userId = req.params.id;
            _context6.n = 1;
            return dbService.getUserById(userId);
          case 1:
            user = _context6.v;
            if (user) {
              _context6.n = 2;
              break;
            }
            return _context6.a(2, res.status(404).json({
              error: "用户不存在"
            }));
          case 2:
            _context6.n = 3;
            return dbService.getTasksByUserId(userId);
          case 3:
            tasks = _context6.v;
            taskList = tasks.map(function (t) {
              return {
                id: t.id,
                name: t.name,
                description: t.description,
                dueDate: t.dueDate,
                startTime: t.startTime,
                endTime: t.endTime,
                location: t.location,
                completed: t.completed,
                importance: t.importance,
                scheduleType: t.scheduleType,
                recurrenceRule: t.recurrenceRule
              };
            });
            res.json({
              user: {
                id: user.id,
                email: user.email,
                name: user.name
              },
              tasks: taskList,
              total: taskList.length
            });
            _context6.n = 5;
            break;
          case 4:
            _context6.p = 4;
            _t7 = _context6.v;
            logger.error("Admin get user schedule error:", _t7);
            res.status(500).json({
              error: "获取用户日程失败: " + (_t7.message || "")
            });
          case 5:
            return _context6.a(2);
        }
      }, _callee6, null, [[0, 4]]);
    }));
    return function (_x1, _x10) {
      return _ref7.apply(this, arguments);
    };
  }());

  // ── POST /api/admin/cache/refresh ─────────────────────────────
  router.post("/cache/refresh", /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
      var userId, user, users, _t8;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            userId = req.body.userId;
            if (!userId) {
              _context7.n = 2;
              break;
            }
            _context7.n = 1;
            return dbService.getUserById(userId);
          case 1:
            user = _context7.v;
            if (user) {
              res.json({
                message: "\u7528\u6237 ".concat(user.email, " \u6570\u636E\u5DF2\u5237\u65B0"),
                userId: userId
              });
            } else {
              res.status(404).json({
                error: "用户不存在"
              });
            }
            _context7.n = 4;
            break;
          case 2:
            _context7.n = 3;
            return dbService.getAllUsers();
          case 3:
            users = _context7.v;
            res.json({
              message: "\u5DF2\u52A0\u8F7D ".concat(users.length, " \u4E2A\u7528\u6237")
            });
          case 4:
            _context7.n = 6;
            break;
          case 5:
            _context7.p = 5;
            _t8 = _context7.v;
            res.status(500).json({
              error: "刷新缓存失败"
            });
          case 6:
            return _context7.a(2);
        }
      }, _callee7, null, [[0, 5]]);
    }));
    return function (_x11, _x12) {
      return _ref8.apply(this, arguments);
    };
  }());
  return router;
}