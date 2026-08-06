function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 用户关注 API
 * 挂载于 /api → /api/users/:userId/follow
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
export function initializeFollowRoutes(authenticateToken) {
  var router = express.Router();

  /**
   * POST /api/users/:userId/follow — 关注用户
   * :userId 为目标用户（被关注者），不能用 "me"
   */
  router.post("/users/:userId/follow", authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var _req$user, followerId, followedId, exists, created, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            followerId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
            if (followerId) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            followedId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
            if (!(!followedId || followedId === "me")) {
              _context.n = 2;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "valid userId is required"
            }));
          case 2:
            _context.n = 3;
            return dbService.getUserPublicProfile(followedId);
          case 3:
            exists = _context.v;
            if (exists) {
              _context.n = 4;
              break;
            }
            return _context.a(2, res.status(404).json({
              error: "User not found"
            }));
          case 4:
            _context.n = 5;
            return dbService.followUser(followerId, followedId);
          case 5:
            created = _context.v;
            return _context.a(2, res.status(created ? 201 : 200).json({
              following: true,
              message: created ? "Followed" : "Already following"
            }));
          case 6:
            _context.p = 6;
            _t = _context.v;
            logger.error("POST /users/:userId/follow failed:", _t);
            return _context.a(2, res.status(500).json({
              error: "Failed to follow user"
            }));
        }
      }, _callee, null, [[0, 6]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  /**
   * DELETE /api/users/:userId/follow — 取消关注
   */
  router["delete"]("/users/:userId/follow", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var _req$user2, followerId, followedId, removed, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            followerId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
            if (followerId) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            followedId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
            if (!(!followedId || followedId === "me")) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "valid userId is required"
            }));
          case 2:
            _context2.n = 3;
            return dbService.unfollowUser(followerId, followedId);
          case 3:
            removed = _context2.v;
            return _context2.a(2, res.status(200).json({
              following: false,
              message: removed ? "Unfollowed" : "Was not following"
            }));
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            logger.error("DELETE /users/:userId/follow failed:", _t2);
            return _context2.a(2, res.status(500).json({
              error: "Failed to unfollow user"
            }));
        }
      }, _callee2, null, [[0, 4]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  /**
   * GET /api/users/:userId/follow/status — 检查关注状态
   * 返回 { following: boolean }
   */
  router.get("/users/:userId/follow/status", authenticateToken, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var _req$user3, viewerId, targetId, following, _t3;
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
            if (!targetId || targetId === "me") {
              targetId = viewerId;
            }
            _context3.n = 2;
            return dbService.isFollowing(viewerId, targetId);
          case 2:
            following = _context3.v;
            return _context3.a(2, res.status(200).json({
              following: following
            }));
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            logger.error("GET /users/:userId/follow/status failed:", _t3);
            return _context3.a(2, res.status(500).json({
              error: "Failed to check follow status"
            }));
        }
      }, _callee3, null, [[0, 3]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  /**
   * GET /api/users/:userId/following — 获取该用户关注的人
   * Query: limit=N  offset=N
   */
  router.get("/users/:userId/following", authenticateToken, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var _req$user4, viewerId, targetId, exists, limit, offset, result, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            viewerId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
            if (viewerId) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            targetId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
            if (!targetId || targetId === "me") {
              targetId = viewerId;
            }

            // 检查目标用户是否存在
            _context4.n = 2;
            return dbService.getUserPublicProfile(targetId);
          case 2:
            exists = _context4.v;
            if (exists) {
              _context4.n = 3;
              break;
            }
            return _context4.a(2, res.status(404).json({
              error: "User not found"
            }));
          case 3:
            limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
            offset = Math.max(0, Number(req.query.offset) || 0);
            _context4.n = 4;
            return dbService.getFollowing(targetId, limit, offset);
          case 4:
            result = _context4.v;
            return _context4.a(2, res.status(200).json(result));
          case 5:
            _context4.p = 5;
            _t4 = _context4.v;
            logger.error("GET /users/:userId/following failed:", _t4);
            return _context4.a(2, res.status(500).json({
              error: "Failed to get following list"
            }));
        }
      }, _callee4, null, [[0, 5]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());

  /**
   * GET /api/users/:userId/followers — 获取该用户的粉丝
   * Query: limit=N  offset=N
   */
  router.get("/users/:userId/followers", authenticateToken, /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
      var _req$user5, viewerId, targetId, exists, limit, offset, result, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            viewerId = (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.id;
            if (viewerId) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            targetId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
            if (!targetId || targetId === "me") {
              targetId = viewerId;
            }

            // 检查目标用户是否存在
            _context5.n = 2;
            return dbService.getUserPublicProfile(targetId);
          case 2:
            exists = _context5.v;
            if (exists) {
              _context5.n = 3;
              break;
            }
            return _context5.a(2, res.status(404).json({
              error: "User not found"
            }));
          case 3:
            limit = Math.max(1, Math.min(200, Number(req.query.limit) || 50));
            offset = Math.max(0, Number(req.query.offset) || 0);
            _context5.n = 4;
            return dbService.getFollowers(targetId, limit, offset);
          case 4:
            result = _context5.v;
            return _context5.a(2, res.status(200).json(result));
          case 5:
            _context5.p = 5;
            _t5 = _context5.v;
            logger.error("GET /users/:userId/followers failed:", _t5);
            return _context5.a(2, res.status(500).json({
              error: "Failed to get followers list"
            }));
        }
      }, _callee5, null, [[0, 5]]);
    }));
    return function (_x9, _x0) {
      return _ref5.apply(this, arguments);
    };
  }());
  return router;
}