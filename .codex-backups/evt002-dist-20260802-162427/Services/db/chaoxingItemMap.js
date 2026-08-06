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
// 学习通 remoteKey → 本地 task/todo 映射

import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";
export var ChaoxingItemMapStore = /*#__PURE__*/function () {
  function ChaoxingItemMapStore(db) {
    _classCallCheck(this, ChaoxingItemMapStore);
    this.db = db;
  }
  return _createClass(ChaoxingItemMapStore, [{
    key: "getByRemoteKey",
    value: function () {
      var _getByRemoteKey = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId, remoteKey) {
        var row;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.db.get("SELECT * FROM chaoxing_item_map WHERE userId = ? AND remoteKey = ?", [userId, remoteKey]);
            case 1:
              row = _context.v;
              return _context.a(2, row ? this.map(row) : null);
          }
        }, _callee, this);
      }));
      function getByRemoteKey(_x, _x2) {
        return _getByRemoteKey.apply(this, arguments);
      }
      return getByRemoteKey;
    }()
  }, {
    key: "upsert",
    value: function () {
      var _upsert = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(row) {
        var _row$localTodoId2, _row$localTaskId2, _row$fingerprint2;
        var existing, now, _row$localTodoId, _row$localTaskId, _row$fingerprint, id;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.getByRemoteKey(row.userId, row.remoteKey);
            case 1:
              existing = _context2.v;
              now = toShanghaiISO();
              if (!existing) {
                _context2.n = 4;
                break;
              }
              _context2.n = 2;
              return this.db.run("UPDATE chaoxing_item_map\n                 SET kind = ?, target = ?, localTodoId = ?, localTaskId = ?,\n                     fingerprint = ?, lastSeenAt = ?, updatedAt = ?\n                 WHERE id = ?", [row.kind, row.target, (_row$localTodoId = row.localTodoId) !== null && _row$localTodoId !== void 0 ? _row$localTodoId : null, (_row$localTaskId = row.localTaskId) !== null && _row$localTaskId !== void 0 ? _row$localTaskId : null, (_row$fingerprint = row.fingerprint) !== null && _row$fingerprint !== void 0 ? _row$fingerprint : null, now, now, existing.id]);
            case 2:
              _context2.n = 3;
              return this.getByRemoteKey(row.userId, row.remoteKey);
            case 3:
              return _context2.a(2, _context2.v);
            case 4:
              id = uuidv4();
              _context2.n = 5;
              return this.db.run("INSERT INTO chaoxing_item_map\n             (id, userId, remoteKey, kind, target, localTodoId, localTaskId, fingerprint, lastSeenAt, createdAt, updatedAt)\n             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, row.userId, row.remoteKey, row.kind, row.target, (_row$localTodoId2 = row.localTodoId) !== null && _row$localTodoId2 !== void 0 ? _row$localTodoId2 : null, (_row$localTaskId2 = row.localTaskId) !== null && _row$localTaskId2 !== void 0 ? _row$localTaskId2 : null, (_row$fingerprint2 = row.fingerprint) !== null && _row$fingerprint2 !== void 0 ? _row$fingerprint2 : null, now, now, now]);
            case 5:
              _context2.n = 6;
              return this.getByRemoteKey(row.userId, row.remoteKey);
            case 6:
              return _context2.a(2, _context2.v);
          }
        }, _callee2, this);
      }));
      function upsert(_x3) {
        return _upsert.apply(this, arguments);
      }
      return upsert;
    }()
  }, {
    key: "map",
    value: function map(row) {
      return {
        id: row.id,
        userId: row.userId,
        remoteKey: row.remoteKey,
        kind: row.kind,
        target: row.target === "task" ? "task" : "todo",
        localTodoId: row.localTodoId || null,
        localTaskId: row.localTaskId || null,
        fingerprint: row.fingerprint || null,
        lastSeenAt: row.lastSeenAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    }
  }]);
}();