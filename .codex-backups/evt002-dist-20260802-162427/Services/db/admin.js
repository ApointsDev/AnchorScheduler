function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 管理员专用操作

export var ADMIN_ALLOWED_COLUMNS = new Set(["email", "name", "XJTLUaccount", "XJTLUPassword", "passwordHash", "JWTtoken", "MStoken", "MSRefreshToken", "MSbinded", "ExchangeAccessToken", "ExchangeRefreshToken", "ExchangeTokenExpiresAt", "ExchangeBinded", "ImapBinded", "ImapEmail", "ImapPassword", "ImapHost", "ImapPort", "ImapTls", "CAFSub", "CAFAccessToken", "CAFRefreshToken", "CAFTokenExpiresAt", "ebridgeBinded", "timetableUrl", "timetableFetchLevel", "mailReadingSpan", "conflictBoundaryInclusive", "weekOffset", "CalDavBaseUrl", "CalDavUsername", "CalDavPassword", "CalDavPrincipalUrl", "CalDavCalendarHome", "CalDavCalendarUrl", "CalDavEnabled", "CalDavLastSyncAt", "CalDavServerEnabled", "highEnergyPeriods"]);
export var AdminStore = /*#__PURE__*/function () {
  function AdminStore(db) {
    _classCallCheck(this, AdminStore);
    this.db = db;
  }
  return _createClass(AdminStore, [{
    key: "updateUserFields",
    value: function () {
      var _updateUserFields = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId, updates) {
        var setClauses, values, _i, _Object$entries, _Object$entries$_i, key, value, sql;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              setClauses = [];
              values = [];
              _i = 0, _Object$entries = Object.entries(updates);
            case 1:
              if (!(_i < _Object$entries.length)) {
                _context.n = 4;
                break;
              }
              _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
              if (ADMIN_ALLOWED_COLUMNS.has(key)) {
                _context.n = 2;
                break;
              }
              throw new Error("\u4E0D\u5141\u8BB8\u66F4\u65B0\u5217: ".concat(key));
            case 2:
              setClauses.push("".concat(key, " = ?"));
              values.push(value);
            case 3:
              _i++;
              _context.n = 1;
              break;
            case 4:
              if (!(setClauses.length === 0)) {
                _context.n = 5;
                break;
              }
              return _context.a(2);
            case 5:
              setClauses.push("updatedAt = CURRENT_TIMESTAMP");
              sql = "UPDATE users SET ".concat(setClauses.join(", "), " WHERE id = ?");
              values.push(userId);
              _context.n = 6;
              return this.db.run(sql, values);
            case 6:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function updateUserFields(_x, _x2) {
        return _updateUserFields.apply(this, arguments);
      }
      return updateUserFields;
    }()
  }, {
    key: "deleteUser",
    value: function () {
      var _deleteUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId) {
        var _result$changes;
        var result;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.db.run("DELETE FROM todo_tags WHERE todoId IN (SELECT id FROM todos WHERE userId = ?)\n             OR tagId IN (SELECT id FROM tags WHERE userId = ?)", [userId, userId]);
            case 1:
              _context2.n = 2;
              return this.db.run("DELETE FROM todos WHERE userId = ?", [userId]);
            case 2:
              _context2.n = 3;
              return this.db.run("DELETE FROM tags WHERE userId = ?", [userId]);
            case 3:
              _context2.n = 4;
              return this.db.run("DELETE FROM tasks WHERE userId = ?", [userId]);
            case 4:
              _context2.n = 5;
              return this.db.run("DELETE FROM calendar_event_map WHERE userId = ?", [userId]);
            case 5:
              _context2.n = 6;
              return this.db.run("DELETE FROM schedule_queue WHERE userId = ?", [userId]);
            case 6:
              _context2.n = 7;
              return this.db.run("DELETE FROM todo_queue WHERE userId = ?", [userId]);
            case 7:
              _context2.n = 8;
              return this.db.run("DELETE FROM user_logs WHERE userId = ?", [userId]);
            case 8:
              _context2.n = 9;
              return this.db.run("DELETE FROM ai_processed_emails WHERE userId = ?", [userId]);
            case 9:
              _context2.n = 10;
              return this.db.run("DELETE FROM users WHERE id = ?", [userId]);
            case 10:
              result = _context2.v;
              return _context2.a(2, ((_result$changes = result === null || result === void 0 ? void 0 : result.changes) !== null && _result$changes !== void 0 ? _result$changes : 0) > 0);
          }
        }, _callee2, this);
      }));
      function deleteUser(_x3) {
        return _deleteUser.apply(this, arguments);
      }
      return deleteUser;
    }()
  }]);
}();