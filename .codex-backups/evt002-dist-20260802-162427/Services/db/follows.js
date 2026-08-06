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
// 用户关注关系 — followerId 关注 followedId

/** 关注/粉丝列表中的用户公开信息 */

export var FollowStore = /*#__PURE__*/function () {
  function FollowStore(db) {
    _classCallCheck(this, FollowStore);
    this.db = db;
  }

  /** 关注用户（幂等：已关注则返回 false） */
  return _createClass(FollowStore, [{
    key: "follow",
    value: (function () {
      var _follow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(followerId, followedId) {
        var _e$message, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!(followerId === followedId)) {
                _context.n = 1;
                break;
              }
              return _context.a(2, false);
            case 1:
              _context.p = 1;
              _context.n = 2;
              return this.db.run("INSERT INTO user_follows (followerId, followedId) VALUES (?, ?)", [followerId, followedId]);
            case 2:
              return _context.a(2, true);
            case 3:
              _context.p = 3;
              _t = _context.v;
              if (!((_e$message = _t.message) !== null && _e$message !== void 0 && _e$message.includes("UNIQUE constraint") || _t.code === "SQLITE_CONSTRAINT")) {
                _context.n = 4;
                break;
              }
              return _context.a(2, false);
            case 4:
              throw _t;
            case 5:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3]]);
      }));
      function follow(_x, _x2) {
        return _follow.apply(this, arguments);
      }
      return follow;
    }() /** 取消关注 */)
  }, {
    key: "unfollow",
    value: (function () {
      var _unfollow = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(followerId, followedId) {
        var result;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.db.run("DELETE FROM user_follows WHERE followerId = ? AND followedId = ?", [followerId, followedId]);
            case 1:
              result = _context2.v;
              return _context2.a(2, ((result === null || result === void 0 ? void 0 : result.changes) || 0) > 0);
          }
        }, _callee2, this);
      }));
      function unfollow(_x3, _x4) {
        return _unfollow.apply(this, arguments);
      }
      return unfollow;
    }() /** 检查是否已关注 */)
  }, {
    key: "isFollowing",
    value: (function () {
      var _isFollowing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(followerId, followedId) {
        var row;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.db.get("SELECT 1 FROM user_follows WHERE followerId = ? AND followedId = ?", [followerId, followedId]);
            case 1:
              row = _context3.v;
              return _context3.a(2, !!row);
          }
        }, _callee3, this);
      }));
      function isFollowing(_x5, _x6) {
        return _isFollowing.apply(this, arguments);
      }
      return isFollowing;
    }() /** 获取关注数 */)
  }, {
    key: "getFollowingCount",
    value: (function () {
      var _getFollowingCount = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(userId) {
        var row;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.db.get("SELECT COUNT(*) as cnt FROM user_follows WHERE followerId = ?", [userId]);
            case 1:
              row = _context4.v;
              return _context4.a(2, row ? row.cnt || 0 : 0);
          }
        }, _callee4, this);
      }));
      function getFollowingCount(_x7) {
        return _getFollowingCount.apply(this, arguments);
      }
      return getFollowingCount;
    }() /** 获取粉丝数 */)
  }, {
    key: "getFollowerCount",
    value: (function () {
      var _getFollowerCount = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId) {
        var row;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return this.db.get("SELECT COUNT(*) as cnt FROM user_follows WHERE followedId = ?", [userId]);
            case 1:
              row = _context5.v;
              return _context5.a(2, row ? row.cnt || 0 : 0);
          }
        }, _callee5, this);
      }));
      function getFollowerCount(_x8) {
        return _getFollowerCount.apply(this, arguments);
      }
      return getFollowerCount;
    }() /** 获取关注的用户列表（分页），附带公开资料 */)
  }, {
    key: "getFollowing",
    value: (function () {
      var _getFollowing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId) {
        var limit,
          offset,
          countRow,
          total,
          rows,
          _args6 = arguments;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              limit = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : 50;
              offset = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : 0;
              _context6.n = 1;
              return this.db.get("SELECT COUNT(*) as cnt FROM user_follows WHERE followerId = ?", [userId]);
            case 1:
              countRow = _context6.v;
              total = countRow ? countRow.cnt || 0 : 0;
              _context6.n = 2;
              return this.db.all("SELECT u.id, u.name, u.avatar, u.signature\n             FROM user_follows f\n             JOIN users u ON u.id = f.followedId\n             WHERE f.followerId = ?\n             ORDER BY f.createdAt DESC\n             LIMIT ? OFFSET ?", [userId, limit, offset]);
            case 2:
              rows = _context6.v;
              return _context6.a(2, {
                users: rows.map(mapFollowUserRow),
                total: total
              });
          }
        }, _callee6, this);
      }));
      function getFollowing(_x9) {
        return _getFollowing.apply(this, arguments);
      }
      return getFollowing;
    }() /** 获取粉丝列表（分页），附带公开资料 */)
  }, {
    key: "getFollowers",
    value: (function () {
      var _getFollowers = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(userId) {
        var limit,
          offset,
          countRow,
          total,
          rows,
          _args7 = arguments;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              limit = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : 50;
              offset = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : 0;
              _context7.n = 1;
              return this.db.get("SELECT COUNT(*) as cnt FROM user_follows WHERE followedId = ?", [userId]);
            case 1:
              countRow = _context7.v;
              total = countRow ? countRow.cnt || 0 : 0;
              _context7.n = 2;
              return this.db.all("SELECT u.id, u.name, u.avatar, u.signature\n             FROM user_follows f\n             JOIN users u ON u.id = f.followerId\n             WHERE f.followedId = ?\n             ORDER BY f.createdAt DESC\n             LIMIT ? OFFSET ?", [userId, limit, offset]);
            case 2:
              rows = _context7.v;
              return _context7.a(2, {
                users: rows.map(mapFollowUserRow),
                total: total
              });
          }
        }, _callee7, this);
      }));
      function getFollowers(_x0) {
        return _getFollowers.apply(this, arguments);
      }
      return getFollowers;
    }())
  }]);
}();
function mapFollowUserRow(row) {
  var _row$signature;
  return {
    id: row.id,
    name: row.name || "",
    avatar: row.avatar || null,
    signature: (_row$signature = row.signature) !== null && _row$signature !== void 0 ? _row$signature : null
  };
}