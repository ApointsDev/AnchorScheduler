function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
import express from "express";
import { dbService } from "../Services/dbService.js";
import { REMINDER_KINDS, REMINDER_STATUSES } from "../Services/db/reminderStates.js";
var MAX_BATCH_SIZE = 500;
var MAX_ID_LENGTH = 256;
var MAX_SOURCE_ID_LENGTH = 128;
function parseVersion(value) {
  if (value === undefined || value === null || value === "") return 0;
  var parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}
function parseChange(value) {
  if (!value || _typeof(value) !== "object" || Array.isArray(value)) return null;
  var row = value;
  var id = typeof row.id === "string" ? row.id.trim() : "";
  var sourceId = typeof row.sourceId === "string" ? row.sourceId.trim() : "";
  var kind = row.kind;
  var status = row.status;
  var triggeredAt = Number(row.triggeredAt);
  var updatedAt = Number(row.updatedAt);
  if (!id || id.length > MAX_ID_LENGTH || !sourceId || sourceId.length > MAX_SOURCE_ID_LENGTH || !REMINDER_KINDS.includes(kind) || !REMINDER_STATUSES.includes(status) || !Number.isSafeInteger(triggeredAt) || triggeredAt < 0 || !Number.isSafeInteger(updatedAt) || updatedAt < 0) {
    return null;
  }
  return {
    id: id,
    sourceId: sourceId,
    kind: kind,
    status: status,
    triggeredAt: triggeredAt,
    updatedAt: updatedAt
  };
}
export function initializeReminderStateRoutes(authenticateToken) {
  var router = express.Router();

  /** Incrementally fetch reminder state changes for the authenticated user. */
  router.get("/reminder-states", authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var sinceVersion, _t, _t2;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            sinceVersion = parseVersion(req.query.sinceVersion);
            if (!(sinceVersion === null)) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "INVALID_SINCE_VERSION",
              message: "sinceVersion must be a non-negative integer"
            }));
          case 1:
            _context.p = 1;
            _t = res;
            _context.n = 2;
            return dbService.reminderStates.listSince(req.user.id, sinceVersion);
          case 2:
            return _context.a(2, _t.json.call(_t, _context.v));
          case 3:
            _context.p = 3;
            _t2 = _context.v;
            console.error("Failed to list reminder states:", _t2);
            return _context.a(2, res.status(500).json({
              error: "REMINDER_SYNC_FAILED"
            }));
        }
      }, _callee, null, [[1, 3]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  /** Push local changes and pull remote changes in one idempotent request. */
  router.post("/reminder-states/sync", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var _req$body, _req$body$changes, _req$body2;
      var sinceVersion, rawChanges, changes, _t3, _t4;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            sinceVersion = parseVersion((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.sinceVersion);
            rawChanges = (_req$body$changes = (_req$body2 = req.body) === null || _req$body2 === void 0 ? void 0 : _req$body2.changes) !== null && _req$body$changes !== void 0 ? _req$body$changes : [];
            if (!(sinceVersion === null)) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "INVALID_SINCE_VERSION",
              message: "sinceVersion must be a non-negative integer"
            }));
          case 1:
            if (!(!Array.isArray(rawChanges) || rawChanges.length > MAX_BATCH_SIZE)) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "INVALID_REMINDER_CHANGES",
              message: "changes must be an array with at most ".concat(MAX_BATCH_SIZE, " items")
            }));
          case 2:
            changes = rawChanges.map(parseChange);
            if (!changes.some(function (change) {
              return change === null;
            })) {
              _context2.n = 3;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "INVALID_REMINDER_CHANGE",
              message: "Each reminder change must contain valid id, kind, sourceId, triggeredAt, status and updatedAt fields"
            }));
          case 3:
            _context2.p = 3;
            _t3 = res;
            _context2.n = 4;
            return dbService.reminderStates.sync(req.user.id, sinceVersion, changes);
          case 4:
            return _context2.a(2, _t3.json.call(_t3, _context2.v));
          case 5:
            _context2.p = 5;
            _t4 = _context2.v;
            console.error("Failed to sync reminder states:", _t4);
            return _context2.a(2, res.status(500).json({
              error: "REMINDER_SYNC_FAILED"
            }));
        }
      }, _callee2, null, [[3, 5]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  return router;
}
