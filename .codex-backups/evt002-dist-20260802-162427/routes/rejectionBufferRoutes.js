function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 事件拒绝缓冲池 API
 * 挂载于 /api → 查询 24 小时内用户拒绝的日程 / 待办
 *
 * - GET /api/rejection-buffer              全部（日程 + 待办）
 * - GET /api/rejection-buffer/schedules    仅日程
 * - GET /api/rejection-buffer/todos        仅待办
 *
 * Query: hours?  回看小时数，默认 24，范围 1–24
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { clampRejectionHours } from "../Services/db/rejectionBuffer.js";
import { logger } from "../Utils/logger.js";
function parseHoursQuery(q) {
  if (Array.isArray(q)) return clampRejectionHours(q[0]);
  return clampRejectionHours(q);
}
export function initializeRejectionBufferRoutes(authenticateToken) {
  var router = express.Router();
  function handleList(_x, _x2, _x3) {
    return _handleList.apply(this, arguments);
  } // 须先注册更具体路径，再注册根路径
  function _handleList() {
    _handleList = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res, kind) {
      var user, hours, result, schedules, todos, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            user = req.user;
            if (user !== null && user !== void 0 && user.id) {
              _context.n = 1;
              break;
            }
            res.status(401).json({
              error: "Unauthorized"
            });
            return _context.a(2);
          case 1:
            hours = parseHoursQuery(req.query.hours);
            _context.n = 2;
            return dbService.getRejectionBuffer(user.id, {
              kind: kind,
              hours: hours
            });
          case 2:
            result = _context.v;
            if (!(kind === "schedule")) {
              _context.n = 3;
              break;
            }
            res.status(200).json({
              hours: result.hours,
              since: result.since,
              schedules: result.items
            });
            return _context.a(2);
          case 3:
            if (!(kind === "todo")) {
              _context.n = 4;
              break;
            }
            res.status(200).json({
              hours: result.hours,
              since: result.since,
              todos: result.items
            });
            return _context.a(2);
          case 4:
            schedules = result.items.filter(function (i) {
              return i.kind === "schedule";
            });
            todos = result.items.filter(function (i) {
              return i.kind === "todo";
            });
            res.status(200).json({
              hours: result.hours,
              since: result.since,
              schedules: schedules,
              todos: todos,
              items: result.items
            });
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            logger.error("GET rejection-buffer failed:", _t);
            res.status(500).json({
              error: "Failed to get rejection buffer"
            });
          case 6:
            return _context.a(2);
        }
      }, _callee, null, [[0, 5]]);
    }));
    return _handleList.apply(this, arguments);
  }
  router.get("/rejection-buffer/schedules", authenticateToken, function (req, res) {
    return handleList(req, res, "schedule");
  });
  router.get("/rejection-buffer/todos", authenticateToken, function (req, res) {
    return handleList(req, res, "todo");
  });
  router.get("/rejection-buffer", authenticateToken, function (req, res) {
    return handleList(req, res);
  });
  return router;
}