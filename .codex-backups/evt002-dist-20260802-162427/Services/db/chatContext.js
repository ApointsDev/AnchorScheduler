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
// AI 聊天上下文持久化

import { v4 as uuidv4 } from "uuid";
export var ChatContextStore = /*#__PURE__*/function () {
  function ChatContextStore(db) {
    _classCallCheck(this, ChatContextStore);
    this.db = db;
  }
  return _createClass(ChatContextStore, [{
    key: "autoTitle",
    value: function autoTitle(messagesJson) {
      try {
        var msgs = JSON.parse(messagesJson);
        var userMsg = msgs.find(function (m) {
          return m.role === "user";
        });
        if (userMsg && typeof userMsg.content === "string") {
          return userMsg.content.substring(0, 30);
        }
      } catch (_unused) {}
      return "新对话";
    }
  }, {
    key: "listContexts",
    value: function () {
      var _listContexts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId) {
        var rows;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.db.all("SELECT id, title, isActive, createdAt, updatedAt, messages FROM chat_history WHERE userId = ? ORDER BY updatedAt DESC", [userId]);
            case 1:
              rows = _context.v;
              return _context.a(2, rows.map(function (r) {
                var messageCount = 0;
                try {
                  messageCount = JSON.parse(r.messages).length;
                } catch (_unused2) {}
                return {
                  id: r.id,
                  title: r.title,
                  isActive: !!r.isActive,
                  createdAt: r.createdAt,
                  updatedAt: r.updatedAt,
                  messageCount: messageCount
                };
              }));
          }
        }, _callee, this);
      }));
      function listContexts(_x) {
        return _listContexts.apply(this, arguments);
      }
      return listContexts;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId) {
        var id;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.db.run("UPDATE chat_history SET isActive = 0 WHERE userId = ? AND isActive = 1", [userId]);
            case 1:
              id = uuidv4();
              _context2.n = 2;
              return this.db.run("INSERT INTO chat_history (id, userId, messages, title, isActive) VALUES (?, ?, '[]', '\u65B0\u5BF9\u8BDD', 1)", [id, userId]);
            case 2:
              return _context2.a(2, id);
          }
        }, _callee2, this);
      }));
      function create(_x2) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "getMessages",
    value: function () {
      var _getMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(contextId) {
        var row;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.db.get("SELECT messages FROM chat_history WHERE id = ?", [contextId]);
            case 1:
              row = _context3.v;
              return _context3.a(2, row ? {
                messages: row.messages
              } : null);
          }
        }, _callee3, this);
      }));
      function getMessages(_x3) {
        return _getMessages.apply(this, arguments);
      }
      return getMessages;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(contextId) {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.db.run("DELETE FROM chat_history WHERE id = ?", [contextId]);
            case 1:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function _delete(_x4) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getActiveHistory",
    value: function () {
      var _getActiveHistory = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId) {
        var row;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return this.db.get("SELECT id, messages FROM chat_history WHERE userId = ? AND isActive = 1 ORDER BY updatedAt DESC LIMIT 1", [userId]);
            case 1:
              row = _context5.v;
              return _context5.a(2, row ? {
                id: row.id,
                messages: row.messages
              } : null);
          }
        }, _callee5, this);
      }));
      function getActiveHistory(_x5) {
        return _getActiveHistory.apply(this, arguments);
      }
      return getActiveHistory;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId, messagesJson, contextId) {
        var targetId, active, current, title, _t;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              targetId = contextId;
              if (targetId) {
                _context6.n = 5;
                break;
              }
              _context6.n = 1;
              return this.db.get("SELECT id FROM chat_history WHERE userId = ? AND isActive = 1 LIMIT 1", [userId]);
            case 1:
              active = _context6.v;
              if (!active) {
                _context6.n = 2;
                break;
              }
              _t = active.id;
              _context6.n = 4;
              break;
            case 2:
              _context6.n = 3;
              return this.create(userId);
            case 3:
              _t = _context6.v;
            case 4:
              targetId = _t;
            case 5:
              _context6.n = 6;
              return this.db.get("SELECT title FROM chat_history WHERE id = ?", [targetId]);
            case 6:
              current = _context6.v;
              if (!(current && current.title === "新对话")) {
                _context6.n = 8;
                break;
              }
              title = this.autoTitle(messagesJson);
              _context6.n = 7;
              return this.db.run("UPDATE chat_history SET messages = ?, title = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [messagesJson, title, targetId]);
            case 7:
              _context6.n = 9;
              break;
            case 8:
              _context6.n = 9;
              return this.db.run("UPDATE chat_history SET messages = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [messagesJson, targetId]);
            case 9:
              return _context6.a(2, targetId);
          }
        }, _callee6, this);
      }));
      function save(_x6, _x7, _x8) {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }]);
}();