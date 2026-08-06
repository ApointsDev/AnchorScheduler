function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 事件拒绝缓冲池 — 记录用户 24 小时内拒绝的日程/待办，过期自动删除

import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";

/** 拒绝项类型：日程 / 待办 */

export var REJECTION_BUFFER_TTL_MS = 24 * 60 * 60 * 1000;
export var REJECTION_BUFFER_MAX_HOURS = 24;
export var REJECTION_BUFFER_MIN_HOURS = 1;
/** 规范化 hours 参数：默认 24，夹在 [1, 24] */
export function clampRejectionHours(hours) {
  if (hours === undefined || hours === null || hours === "") {
    return REJECTION_BUFFER_MAX_HOURS;
  }
  var n = typeof hours === "number" ? hours : Number(hours);
  if (!Number.isFinite(n)) return REJECTION_BUFFER_MAX_HOURS;
  var rounded = Math.round(n);
  if (rounded < REJECTION_BUFFER_MIN_HOURS) return REJECTION_BUFFER_MIN_HOURS;
  if (rounded > REJECTION_BUFFER_MAX_HOURS) return REJECTION_BUFFER_MAX_HOURS;
  return rounded;
}
function parseRawRequest(raw) {
  if (raw == null || raw === "") return null;
  try {
    return JSON.parse(raw);
  } catch (_unused) {
    return raw;
  }
}
function mapRow(row) {
  return {
    id: row.id,
    userId: row.userId,
    kind: row.kind,
    sourceQueueId: row.sourceQueueId || undefined,
    rawRequest: parseRawRequest(row.rawRequest),
    rejectedAt: row.rejectedAt,
    expiresAt: row.expiresAt
  };
}
export var RejectionBufferStore = /*#__PURE__*/function () {
  function RejectionBufferStore(db) {
    _classCallCheck(this, RejectionBufferStore);
    this.db = db;
  }

  /**
   * 写入一条拒绝记录，TTL 24 小时。
   * @returns 新记录 id
   */
  return _createClass(RejectionBufferStore, [{
    key: "add",
    value: (function () {
      var _add = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId, kind, rawRequest, sourceQueueId) {
        var now,
          id,
          rejectedAt,
          expiresAt,
          raw,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              now = _args.length > 4 && _args[4] !== undefined ? _args[4] : new Date();
              id = uuidv4();
              rejectedAt = toShanghaiISO(now);
              expiresAt = toShanghaiISO(new Date(now.getTime() + REJECTION_BUFFER_TTL_MS));
              raw = typeof rawRequest === "string" ? rawRequest : JSON.stringify(rawRequest !== null && rawRequest !== void 0 ? rawRequest : {});
              _context.n = 1;
              return this.db.run("INSERT INTO rejection_buffer\n             (id, userId, kind, sourceQueueId, rawRequest, rejectedAt, expiresAt)\n             VALUES (?, ?, ?, ?, ?, ?, ?)", [id, userId, kind, sourceQueueId || null, raw, rejectedAt, expiresAt]);
            case 1:
              return _context.a(2, id);
          }
        }, _callee, this);
      }));
      function add(_x, _x2, _x3, _x4) {
        return _add.apply(this, arguments);
      }
      return add;
    }() /** 删除所有已过期记录，返回删除行数 */)
  }, {
    key: "deleteExpired",
    value: (function () {
      var _deleteExpired = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var _result$changes;
        var now,
          nowIso,
          result,
          _args2 = arguments;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              now = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : new Date();
              nowIso = toShanghaiISO(now);
              _context2.n = 1;
              return this.db.run("DELETE FROM rejection_buffer WHERE expiresAt < ?", [nowIso]);
            case 1:
              result = _context2.v;
              return _context2.a(2, (_result$changes = result.changes) !== null && _result$changes !== void 0 ? _result$changes : 0);
          }
        }, _callee2, this);
      }));
      function deleteExpired() {
        return _deleteExpired.apply(this, arguments);
      }
      return deleteExpired;
    }()
    /**
     * 查询用户在过去 hours 小时内拒绝的记录（先清理过期数据）。
     * 仅返回仍在 24h TTL 内且 rejectedAt >= now - hours 的记录。
     */
    )
  }, {
    key: "list",
    value: (function () {
      var _list = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userId) {
        var _opts$now;
        var opts,
          now,
          hours,
          sinceDate,
          since,
          nowIso,
          sql,
          params,
          rows,
          _args3 = arguments;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              opts = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              now = (_opts$now = opts.now) !== null && _opts$now !== void 0 ? _opts$now : new Date();
              _context3.n = 1;
              return this.deleteExpired(now);
            case 1:
              hours = clampRejectionHours(opts.hours);
              sinceDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
              since = toShanghaiISO(sinceDate);
              nowIso = toShanghaiISO(now);
              sql = "\n            SELECT * FROM rejection_buffer\n            WHERE userId = ?\n              AND rejectedAt >= ?\n              AND expiresAt >= ?\n        ";
              params = [userId, since, nowIso];
              if (opts.kind) {
                sql += " AND kind = ?";
                params.push(opts.kind);
              }
              sql += " ORDER BY rejectedAt DESC";
              _context3.n = 2;
              return this.db.all(sql, params);
            case 2:
              rows = _context3.v;
              return _context3.a(2, {
                hours: hours,
                since: since,
                items: rows.map(mapRow)
              });
          }
        }, _callee3, this);
      }));
      function list(_x5) {
        return _list.apply(this, arguments);
      }
      return list;
    }())
  }]);
}();