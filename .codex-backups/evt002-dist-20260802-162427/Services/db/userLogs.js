function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 用户操作日志

import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";
import { safeJsonParse } from "./taskMapper.js";
export var UserLogStore = /*#__PURE__*/function () {
  function UserLogStore(db) {
    _classCallCheck(this, UserLogStore);
    _defineProperty(this, "_onLogAdded", null);
    this.db = db;
  }
  return _createClass(UserLogStore, [{
    key: "setLogListener",
    value: function setLogListener(listener) {
      this._onLogAdded = listener;
    }
  }, {
    key: "add",
    value: function () {
      var _add = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId, type, message, payload) {
        var id, payloadStr, row, logEntry;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              id = uuidv4();
              payloadStr = payload !== undefined ? JSON.stringify(payload) : null;
              _context.n = 1;
              return this.db.run("INSERT INTO user_logs (id, userId, type, message, payload) VALUES (?, ?, ?, ?, ?)", [id, userId, type, message, payloadStr]);
            case 1:
              _context.n = 2;
              return this.db.get("SELECT * FROM user_logs WHERE id = ?", [id]);
            case 2:
              row = _context.v;
              logEntry = {
                id: row.id,
                time: toShanghaiISO(row.time),
                type: row.type,
                message: row.message,
                payload: row.payload ? safeJsonParse(row.payload) : undefined
              };
              if (this._onLogAdded) {
                this._onLogAdded(userId, logEntry);
              }
              return _context.a(2, logEntry);
          }
        }, _callee, this);
      }));
      function add(_x, _x2, _x3, _x4) {
        return _add.apply(this, arguments);
      }
      return add;
    }()
  }, {
    key: "getPage",
    value: function () {
      var _getPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId, opts) {
        var where, params, whereSql, limit, offset, countRow, total, rows, logs;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              where = ["userId = ?"];
              params = [userId];
              if (opts !== null && opts !== void 0 && opts.since) {
                where.push("time >= ?");
                params.push(opts.since);
              }
              if (opts !== null && opts !== void 0 && opts.until) {
                where.push("time <= ?");
                params.push(opts.until);
              }
              if (opts !== null && opts !== void 0 && opts.type) {
                where.push("type = ?");
                params.push(opts.type);
              }
              whereSql = where.length ? "WHERE ".concat(where.join(" AND ")) : "";
              limit = Math.max(1, Math.min(500, (opts === null || opts === void 0 ? void 0 : opts.limit) || 50));
              offset = Math.max(0, (opts === null || opts === void 0 ? void 0 : opts.offset) || 0);
              _context2.n = 1;
              return this.db.get("SELECT COUNT(*) as cnt FROM user_logs ".concat(whereSql), params);
            case 1:
              countRow = _context2.v;
              total = countRow ? countRow.cnt || 0 : 0;
              _context2.n = 2;
              return this.db.all("SELECT * FROM user_logs ".concat(whereSql, " ORDER BY time DESC LIMIT ? OFFSET ?"), params.concat([limit, offset]));
            case 2:
              rows = _context2.v;
              logs = rows.map(function (r) {
                return {
                  id: r.id,
                  time: toShanghaiISO(r.time),
                  type: r.type,
                  message: r.message,
                  payload: r.payload ? safeJsonParse(r.payload) : undefined
                };
              });
              return _context2.a(2, {
                logs: logs,
                total: total
              });
          }
        }, _callee2, this);
      }));
      function getPage(_x5, _x6) {
        return _getPage.apply(this, arguments);
      }
      return getPage;
    }()
  }]);
}();