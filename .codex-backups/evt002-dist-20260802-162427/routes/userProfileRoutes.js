function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 用户个人主页 API
 * 挂载于 /api → /api/users/:userId/profile
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
function parseFresh(q) {
  return q.fresh === "1" || q.fresh === "true" || q.fresh === true;
}
export function initializeUserProfileRoutes(authenticateToken) {
  var router = express.Router();

  /**
   * GET /api/users/:userId/profile
   * 访问用户个人主页（公开资料 + 本周状态 + 社区称号）
   * :userId 可为真实 id，或 "me" 表示当前登录用户
   * Query: fresh=1 强制刷新 status / 排名缓存
   */
  router.get("/users/:userId/profile", authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var _req$user, viewerId, targetId, profile, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            viewerId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
            if (viewerId) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            targetId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
            if (targetId) {
              _context.n = 2;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "userId is required"
            }));
          case 2:
            if (targetId === "me") {
              targetId = viewerId;
            }
            _context.n = 3;
            return dbService.getUserHomepage(targetId, viewerId, {
              fresh: parseFresh(req.query)
            });
          case 3:
            profile = _context.v;
            if (profile) {
              _context.n = 4;
              break;
            }
            return _context.a(2, res.status(404).json({
              error: "User not found"
            }));
          case 4:
            return _context.a(2, res.status(200).json({
              profile: profile
            }));
          case 5:
            _context.p = 5;
            _t = _context.v;
            logger.error("GET /users/:userId/profile failed:", _t);
            return _context.a(2, res.status(500).json({
              error: "Failed to get user profile"
            }));
        }
      }, _callee, null, [[0, 5]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  /**
   * GET /api/users/:userId/schedules
   * 获取目标用户的可见日程列表（受 visibility 字段控制）
   * :userId 可为真实 id，或 "me" 表示当前登录用户
   * Query: start=ISO  end=ISO  q=搜索  completed=0|1  limit=N  offset=N  sortBy=startTime  order=asc|desc
   */
  router.get("/users/:userId/schedules", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var _req$user2, viewerId, targetId, profile, start, end, q, completed, limit, offset, sortBy, order, visibleTasks, filtered, lq, total, paged, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            viewerId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
            if (viewerId) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            targetId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
            if (targetId) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "userId is required"
            }));
          case 2:
            if (targetId === "me") {
              targetId = viewerId;
            }

            // 检查目标用户是否存在
            _context2.n = 3;
            return dbService.getUserHomepage(targetId, viewerId);
          case 3:
            profile = _context2.v;
            if (profile) {
              _context2.n = 4;
              break;
            }
            return _context2.a(2, res.status(404).json({
              error: "User not found"
            }));
          case 4:
            // 分页 & 过滤参数
            start = typeof req.query.start === "string" ? req.query.start : undefined;
            end = typeof req.query.end === "string" ? req.query.end : undefined;
            q = typeof req.query.q === "string" ? req.query.q : undefined;
            completed = req.query.completed === "0" || req.query.completed === "false" ? false : req.query.completed === "1" || req.query.completed === "true" ? true : undefined;
            limit = Math.max(1, Math.min(500, Number(req.query.limit) || 50));
            offset = Math.max(0, Number(req.query.offset) || 0);
            sortBy = ["startTime", "dueDate", "name", "endTime"].includes(typeof req.query.sortBy === "string" ? req.query.sortBy : "") ? req.query.sortBy : "startTime";
            order = req.query.order === "desc" ? "desc" : "asc"; // 获取按可见性过滤后的日程
            _context2.n = 5;
            return dbService.getVisibleTasksByUserId(targetId, viewerId);
          case 5:
            visibleTasks = _context2.v;
            // 应用额外过滤
            filtered = visibleTasks;
            if (start) {
              filtered = filtered.filter(function (t) {
                return t.endTime && t.endTime >= start;
              });
            }
            if (end) {
              filtered = filtered.filter(function (t) {
                return t.startTime && t.startTime <= end;
              });
            }
            if (q) {
              lq = q.toLowerCase();
              filtered = filtered.filter(function (t) {
                return t.name && t.name.toLowerCase().includes(lq) || t.description && t.description.toLowerCase().includes(lq) || t.location && t.location.toLowerCase().includes(lq);
              });
            }
            if (typeof completed === "boolean") {
              filtered = filtered.filter(function (t) {
                return t.completed === completed;
              });
            }

            // 排序
            filtered.sort(function (a, b) {
              var va = a[sortBy] || "";
              var vb = b[sortBy] || "";
              if (va < vb) return order === "asc" ? -1 : 1;
              if (va > vb) return order === "asc" ? 1 : -1;
              return 0;
            });
            total = filtered.length;
            paged = filtered.slice(offset, offset + limit);
            return _context2.a(2, res.status(200).json({
              schedules: paged,
              total: total
            }));
          case 6:
            _context2.p = 6;
            _t2 = _context2.v;
            logger.error("GET /users/:userId/schedules failed:", _t2);
            return _context2.a(2, res.status(500).json({
              error: "Failed to get user schedules"
            }));
        }
      }, _callee2, null, [[0, 6]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  /**
   * GET /api/users/:userId/status
   * 获取目标用户的本周日程状态统计（复用现有 user-status 逻辑）
   * :userId 可为真实 id，或 "me" 表示当前登录用户
   * Query: fresh=1 强制重算
   */
  router.get("/users/:userId/status", authenticateToken, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var _req$user3, viewerId, targetId, exists, fresh, status, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            viewerId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
            if (viewerId) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            targetId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
            if (targetId) {
              _context3.n = 2;
              break;
            }
            return _context3.a(2, res.status(400).json({
              error: "userId is required"
            }));
          case 2:
            if (targetId === "me") {
              targetId = viewerId;
            }

            // 检查目标用户是否存在
            _context3.n = 3;
            return dbService.getUserPublicProfile(targetId);
          case 3:
            exists = _context3.v;
            if (exists) {
              _context3.n = 4;
              break;
            }
            return _context3.a(2, res.status(404).json({
              error: "User not found"
            }));
          case 4:
            fresh = req.query.fresh === "1" || req.query.fresh === "true" || req.query.fresh === true;
            _context3.n = 5;
            return dbService.getUserStatus(targetId, {
              fresh: fresh
            });
          case 5:
            status = _context3.v;
            return _context3.a(2, res.status(200).json({
              userId: targetId,
              displayName: exists.name,
              status: status
            }));
          case 6:
            _context3.p = 6;
            _t3 = _context3.v;
            logger.error("GET /users/:userId/status failed:", _t3);
            return _context3.a(2, res.status(500).json({
              error: "Failed to get user status"
            }));
        }
      }, _callee3, null, [[0, 6]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
  return router;
}