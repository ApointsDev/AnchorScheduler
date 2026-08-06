function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 社区地区 + 用户状态指标排名 API
 * 挂载于 /api → /api/community/*
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { COMMUNITY_METRICS } from "../Services/communityRanking.js";
import { CommunityRegionNotFoundError, CommunityRegionRequiredError } from "../Services/db/community.js";
function parseLimit(q) {
  if (q.limit === undefined || q.limit === null || q.limit === "") return undefined;
  var n = Number(q.limit);
  return Number.isFinite(n) ? n : undefined;
}
function parseFresh(q) {
  return q.fresh === "1" || q.fresh === "true" || q.fresh === true;
}
export function initializeCommunityRoutes(authenticateToken) {
  var router = express.Router();

  // ── 地区 ──────────────────────────────────────────────

  /** GET /api/community/regions — 地区列表 */
  router.get("/community/regions", authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(_req, res) {
      var regions, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return dbService.listCommunityRegions();
          case 1:
            regions = _context.v;
            return _context.a(2, res.status(200).json({
              regions: regions
            }));
          case 2:
            _context.p = 2;
            _t = _context.v;
            logger.error("GET /community/regions failed:", _t);
            return _context.a(2, res.status(500).json({
              error: "Failed to list community regions"
            }));
        }
      }, _callee, null, [[0, 2]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  /** POST /api/community/regions — 创建地区 { name } */
  router.post("/community/regions", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var _req$body, name, region, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            name = (_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.name;
            if (!(!name || typeof name !== "string" || !name.trim())) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "name is required"
            }));
          case 1:
            _context2.n = 2;
            return dbService.createCommunityRegion(name.trim());
          case 2:
            region = _context2.v;
            return _context2.a(2, res.status(201).json({
              region: region
            }));
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            logger.error("POST /community/regions failed:", _t2);
            return _context2.a(2, res.status(500).json({
              error: "Failed to create community region"
            }));
        }
      }, _callee2, null, [[0, 3]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  /** GET /api/community/me — 我的地区 */
  router.get("/community/me", authenticateToken, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var _req$user, userId, region, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            userId = (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id;
            if (userId) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            _context3.n = 2;
            return dbService.getUserCommunityRegion(userId);
          case 2:
            region = _context3.v;
            return _context3.a(2, res.status(200).json({
              region: region || null
            }));
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            logger.error("GET /community/me failed:", _t3);
            return _context3.a(2, res.status(500).json({
              error: "Failed to get community membership"
            }));
        }
      }, _callee3, null, [[0, 3]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  /** PUT /api/community/me/region — 加入/切换地区 { regionId } 或 { regionName } */
  router.put("/community/me/region", authenticateToken, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var _req$user2, userId, _ref5, regionId, regionName, id, created, region, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            userId = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.id;
            if (userId) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            _ref5 = req.body || {}, regionId = _ref5.regionId, regionName = _ref5.regionName;
            id = typeof regionId === "string" ? regionId : "";
            if (!(!id && typeof regionName === "string" && regionName.trim())) {
              _context4.n = 3;
              break;
            }
            _context4.n = 2;
            return dbService.createCommunityRegion(regionName.trim());
          case 2:
            created = _context4.v;
            id = created.id;
          case 3:
            if (id) {
              _context4.n = 4;
              break;
            }
            return _context4.a(2, res.status(400).json({
              error: "regionId or regionName is required"
            }));
          case 4:
            _context4.n = 5;
            return dbService.setUserCommunityRegion(userId, id);
          case 5:
            region = _context4.v;
            return _context4.a(2, res.status(200).json({
              region: region
            }));
          case 6:
            _context4.p = 6;
            _t4 = _context4.v;
            if (!(_t4 instanceof CommunityRegionNotFoundError)) {
              _context4.n = 7;
              break;
            }
            return _context4.a(2, res.status(404).json({
              error: _t4.message
            }));
          case 7:
            logger.error("PUT /community/me/region failed:", _t4);
            return _context4.a(2, res.status(500).json({
              error: "Failed to set community region"
            }));
        }
      }, _callee4, null, [[0, 6]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());

  // ── 四个状态指标排名接口 ──────────────────────────────

  var rankingHandler = function rankingHandler(metric) {
    return /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
        var _req$user3, userId, ranking, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              userId = (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.id;
              if (userId) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, res.status(401).json({
                error: "Unauthorized"
              }));
            case 1:
              _context5.n = 2;
              return dbService.getCommunityRanking(userId, metric, {
                fresh: parseFresh(req.query),
                limit: parseLimit(req.query),
                regionId: typeof req.query.regionId === "string" ? req.query.regionId : undefined
              });
            case 2:
              ranking = _context5.v;
              return _context5.a(2, res.status(200).json({
                ranking: ranking
              }));
            case 3:
              _context5.p = 3;
              _t5 = _context5.v;
              if (!(_t5 instanceof CommunityRegionRequiredError)) {
                _context5.n = 4;
                break;
              }
              return _context5.a(2, res.status(400).json({
                error: _t5.message,
                code: "REGION_REQUIRED",
                hint: "PUT /api/community/me/region with { regionId: \"region-xjtlu\" } or { regionName: \"西交利物浦大学\" }"
              }));
            case 4:
              if (!(_t5 instanceof CommunityRegionNotFoundError)) {
                _context5.n = 5;
                break;
              }
              return _context5.a(2, res.status(404).json({
                error: _t5.message
              }));
            case 5:
              logger.error("GET /community/rankings/".concat(metric, " failed:"), _t5);
              return _context5.a(2, res.status(500).json({
                error: "Failed to get community ranking"
              }));
          }
        }, _callee5, null, [[0, 3]]);
      }));
      return function (_x9, _x0) {
        return _ref6.apply(this, arguments);
      };
    }();
  };

  /**
   * 1) 本周完成日程数 → 时间利用率
   * GET /api/community/rankings/completed-this-week
   */
  router.get("/community/rankings/completed-this-week", authenticateToken, rankingHandler("completedThisWeek"));

  /**
   * 2) 本周未完成日程数 → 日程清爽度（越少越好）
   * GET /api/community/rankings/incomplete-this-week
   */
  router.get("/community/rankings/incomplete-this-week", authenticateToken, rankingHandler("incompleteThisWeek"));

  /**
   * 3) 平均完成时长 → 执行效率（越快越好）
   * GET /api/community/rankings/avg-complete-duration
   */
  router.get("/community/rankings/avg-complete-duration", authenticateToken, rankingHandler("avgCompleteDurationMs"));

  /**
   * 4) 习惯完成时段众数 → 早鸟指数（越早越好）
   * GET /api/community/rankings/completion-hour-mode
   */
  router.get("/community/rankings/completion-hour-mode", authenticateToken, rankingHandler("completionHourMode"));

  /** 指标元数据（前端展示用） */
  router.get("/community/rankings/metrics", authenticateToken, /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(_req, res) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            return _context6.a(2, res.status(200).json({
              metrics: COMMUNITY_METRICS.map(function (m) {
                return {
                  metric: m.metric,
                  path: m.path,
                  metricLabel: m.metricLabel,
                  titleLabel: m.titleLabel,
                  higherIsBetter: m.higherIsBetter,
                  endpoint: "/api/community/rankings/".concat(m.path)
                };
              })
            }));
        }
      }, _callee6);
    }));
    return function (_x1, _x10) {
      return _ref7.apply(this, arguments);
    };
  }());

  /**
   * 本社区四指标 top100（一次返回）
   * 时间利用率 / 日程清爽度 / 执行效率 / 早鸟指数
   * GET /api/community/rankings/top100
   * Query: fresh, limit(默认100,最大100), regionId
   */
  router.get("/community/rankings/top100", authenticateToken, /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
      var _req$user4, _parseLimit, userId, rankings, _t6;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            userId = (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.id;
            if (userId) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2, res.status(401).json({
              error: "Unauthorized"
            }));
          case 1:
            _context7.n = 2;
            return dbService.getAllCommunityRankings(userId, {
              fresh: parseFresh(req.query),
              limit: (_parseLimit = parseLimit(req.query)) !== null && _parseLimit !== void 0 ? _parseLimit : 100,
              regionId: typeof req.query.regionId === "string" ? req.query.regionId : undefined
            });
          case 2:
            rankings = _context7.v;
            return _context7.a(2, res.status(200).json({
              rankings: rankings
            }));
          case 3:
            _context7.p = 3;
            _t6 = _context7.v;
            if (!(_t6 instanceof CommunityRegionRequiredError)) {
              _context7.n = 4;
              break;
            }
            return _context7.a(2, res.status(400).json({
              error: _t6.message,
              code: "REGION_REQUIRED",
              hint: "PUT /api/community/me/region with { regionId: \"region-xjtlu\" } or { regionName: \"西交利物浦大学\" }"
            }));
          case 4:
            if (!(_t6 instanceof CommunityRegionNotFoundError)) {
              _context7.n = 5;
              break;
            }
            return _context7.a(2, res.status(404).json({
              error: _t6.message
            }));
          case 5:
            logger.error("GET /community/rankings/top100 failed:", _t6);
            return _context7.a(2, res.status(500).json({
              error: "Failed to get community top100 rankings"
            }));
        }
      }, _callee7, null, [[0, 3]]);
    }));
    return function (_x11, _x12) {
      return _ref8.apply(this, arguments);
    };
  }());
  return router;
}