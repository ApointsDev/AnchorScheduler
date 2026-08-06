function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * 社区地区 + 基于 user_status 的指标排名
 */

import { randomUUID } from "crypto";
import { toShanghaiISO } from "../../Utils/time.js";
import { COMMUNITY_METRICS, COMMUNITY_RANK_CACHE_TTL_MS, DEFAULT_COMMUNITY_REGIONS, METRIC_BY_KEY, assignDenseRanks, buildRankTitle, toDisplayName } from "../communityRanking.js";
import { getShanghaiWeekRange } from "../userStatusStats.js";
export var CommunityRegionNotFoundError = /*#__PURE__*/function (_Error) {
  function CommunityRegionNotFoundError() {
    var _this;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Community region not found";
    _classCallCheck(this, CommunityRegionNotFoundError);
    _this = _callSuper(this, CommunityRegionNotFoundError, [message]);
    _this.name = "CommunityRegionNotFoundError";
    return _this;
  }
  _inherits(CommunityRegionNotFoundError, _Error);
  return _createClass(CommunityRegionNotFoundError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
export var CommunityRegionRequiredError = /*#__PURE__*/function (_Error2) {
  function CommunityRegionRequiredError() {
    var _this2;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "User has not joined a community region";
    _classCallCheck(this, CommunityRegionRequiredError);
    _this2 = _callSuper(this, CommunityRegionRequiredError, [message]);
    _this2.name = "CommunityRegionRequiredError";
    return _this2;
  }
  _inherits(CommunityRegionRequiredError, _Error2);
  return _createClass(CommunityRegionRequiredError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
function mapRegion(row) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.createdAt || undefined
  };
}
export var CommunityStore = /*#__PURE__*/function () {
  function CommunityStore(db, userStatus) {
    _classCallCheck(this, CommunityStore);
    /**
     * SQLite 单连接不支持嵌套事务。前端常并行拉 4 个榜，
     * 若不串行化 rebuild，第二个 BEGIN 会报：
     * SQLITE_ERROR: cannot start a transaction within a transaction
     */
    _defineProperty(this, "writeChain", Promise.resolve());
    this.db = db;
    this.userStatus = userStatus;
  }

  /** 串行化写库，避免并发 BEGIN */
  return _createClass(CommunityStore, [{
    key: "enqueueWrite",
    value: function enqueueWrite(fn) {
      var run = this.writeChain.then(fn, fn);
      this.writeChain = run.then(function () {
        return undefined;
      }, function () {
        return undefined;
      });
      return run;
    }

    /** 预置默认地区（幂等） */
  }, {
    key: "ensureDefaultRegions",
    value: (function () {
      var _ensureDefaultRegions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _iterator, _step, r, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _iterator = _createForOfIteratorHelper(DEFAULT_COMMUNITY_REGIONS);
              _context.p = 1;
              _iterator.s();
            case 2:
              if ((_step = _iterator.n()).done) {
                _context.n = 4;
                break;
              }
              r = _step.value;
              _context.n = 3;
              return this.db.run("INSERT OR IGNORE INTO community_regions (id, name) VALUES (?, ?)", [r.id, r.name]);
            case 3:
              _context.n = 2;
              break;
            case 4:
              _context.n = 6;
              break;
            case 5:
              _context.p = 5;
              _t = _context.v;
              _iterator.e(_t);
            case 6:
              _context.p = 6;
              _iterator.f();
              return _context.f(6);
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[1, 5, 6, 7]]);
      }));
      function ensureDefaultRegions() {
        return _ensureDefaultRegions.apply(this, arguments);
      }
      return ensureDefaultRegions;
    }())
  }, {
    key: "listRegions",
    value: function () {
      var _listRegions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var rows;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.db.all("SELECT * FROM community_regions ORDER BY name ASC");
            case 1:
              rows = _context2.v;
              return _context2.a(2, rows.map(mapRegion));
          }
        }, _callee2, this);
      }));
      function listRegions() {
        return _listRegions.apply(this, arguments);
      }
      return listRegions;
    }()
  }, {
    key: "getRegionById",
    value: function () {
      var _getRegionById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(id) {
        var row;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.db.get("SELECT * FROM community_regions WHERE id = ?", [id]);
            case 1:
              row = _context3.v;
              return _context3.a(2, row ? mapRegion(row) : null);
          }
        }, _callee3, this);
      }));
      function getRegionById(_x) {
        return _getRegionById.apply(this, arguments);
      }
      return getRegionById;
    }()
  }, {
    key: "getRegionByName",
    value: function () {
      var _getRegionByName = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(name) {
        var row;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.db.get("SELECT * FROM community_regions WHERE name = ?", [name.trim()]);
            case 1:
              row = _context4.v;
              return _context4.a(2, row ? mapRegion(row) : null);
          }
        }, _callee4, this);
      }));
      function getRegionByName(_x2) {
        return _getRegionByName.apply(this, arguments);
      }
      return getRegionByName;
    }()
  }, {
    key: "createRegion",
    value: function () {
      var _createRegion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(name, id) {
        var trimmed, existing, regionId;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              trimmed = name.trim();
              if (trimmed) {
                _context5.n = 1;
                break;
              }
              throw new Error("Region name is required");
            case 1:
              _context5.n = 2;
              return this.getRegionByName(trimmed);
            case 2:
              existing = _context5.v;
              if (!existing) {
                _context5.n = 3;
                break;
              }
              return _context5.a(2, existing);
            case 3:
              regionId = id || randomUUID();
              _context5.n = 4;
              return this.db.run("INSERT INTO community_regions (id, name) VALUES (?, ?)", [regionId, trimmed]);
            case 4:
              _context5.n = 5;
              return this.getRegionById(regionId);
            case 5:
              return _context5.a(2, _context5.v);
          }
        }, _callee5, this);
      }));
      function createRegion(_x3, _x4) {
        return _createRegion.apply(this, arguments);
      }
      return createRegion;
    }()
  }, {
    key: "getUserRegionId",
    value: function () {
      var _getUserRegionId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId) {
        var row;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return this.db.get("SELECT communityRegionId FROM users WHERE id = ?", [userId]);
            case 1:
              row = _context6.v;
              return _context6.a(2, (row === null || row === void 0 ? void 0 : row.communityRegionId) || null);
          }
        }, _callee6, this);
      }));
      function getUserRegionId(_x5) {
        return _getUserRegionId.apply(this, arguments);
      }
      return getUserRegionId;
    }()
  }, {
    key: "setUserRegion",
    value: function () {
      var _setUserRegion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(userId, regionId) {
        var region;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return this.getRegionById(regionId);
            case 1:
              region = _context7.v;
              if (region) {
                _context7.n = 2;
                break;
              }
              throw new CommunityRegionNotFoundError();
            case 2:
              _context7.n = 3;
              return this.db.run("UPDATE users SET communityRegionId = ? WHERE id = ?", [regionId, userId]);
            case 3:
              return _context7.a(2, region);
          }
        }, _callee7, this);
      }));
      function setUserRegion(_x6, _x7) {
        return _setUserRegion.apply(this, arguments);
      }
      return setUserRegion;
    }()
  }, {
    key: "clearUserRegion",
    value: function () {
      var _clearUserRegion = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(userId) {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return this.db.run("UPDATE users SET communityRegionId = NULL WHERE id = ?", [userId]);
            case 1:
              return _context8.a(2);
          }
        }, _callee8, this);
      }));
      function clearUserRegion(_x8) {
        return _clearUserRegion.apply(this, arguments);
      }
      return clearUserRegion;
    }()
    /**
     * 获取某指标排名；必要时重算本地区本周榜并落库
     */
  }, {
    key: "getRanking",
    value: (function () {
      var _getRanking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(userId, metric, opts) {
        var _opts$now, _opts$limit;
        var def, now, _getShanghaiWeekRange, weekStart, weekEnd, limit, regionId, region, needRebuild, _t2, _t3;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              def = METRIC_BY_KEY.get(metric);
              if (def) {
                _context9.n = 1;
                break;
              }
              throw new Error("Unknown metric: ".concat(metric));
            case 1:
              now = (_opts$now = opts === null || opts === void 0 ? void 0 : opts.now) !== null && _opts$now !== void 0 ? _opts$now : new Date();
              _getShanghaiWeekRange = getShanghaiWeekRange(now), weekStart = _getShanghaiWeekRange.weekStart, weekEnd = _getShanghaiWeekRange.weekEnd;
              limit = Math.max(1, Math.min(100, (_opts$limit = opts === null || opts === void 0 ? void 0 : opts.limit) !== null && _opts$limit !== void 0 ? _opts$limit : 20));
              _t2 = opts === null || opts === void 0 ? void 0 : opts.regionId;
              if (_t2) {
                _context9.n = 3;
                break;
              }
              _context9.n = 2;
              return this.getUserRegionId(userId);
            case 2:
              _t2 = _context9.v;
            case 3:
              regionId = _t2;
              if (regionId) {
                _context9.n = 4;
                break;
              }
              throw new CommunityRegionRequiredError();
            case 4:
              _context9.n = 5;
              return this.getRegionById(regionId);
            case 5:
              region = _context9.v;
              if (region) {
                _context9.n = 6;
                break;
              }
              throw new CommunityRegionNotFoundError();
            case 6:
              _context9.n = 7;
              return this.userStatus.getStatus(userId, {
                now: now
              });
            case 7:
              _t3 = opts === null || opts === void 0 ? void 0 : opts.fresh;
              if (_t3) {
                _context9.n = 9;
                break;
              }
              _context9.n = 8;
              return this.isRankStale(weekStart, regionId, metric, now);
            case 8:
              _t3 = _context9.v;
            case 9:
              needRebuild = _t3;
              if (!needRebuild) {
                _context9.n = 10;
                break;
              }
              _context9.n = 10;
              return this.rebuildRanking(weekStart, weekEnd, regionId, def, now);
            case 10:
              return _context9.a(2, this.readRankingResult(userId, region, def, weekStart, weekEnd, limit));
          }
        }, _callee9, this);
      }));
      function getRanking(_x9, _x0, _x1) {
        return _getRanking.apply(this, arguments);
      }
      return getRanking;
    }()
    /**
     * 一次取本社区四个指标榜单（时间利用率 / 日程清爽度 / 执行效率 / 早鸟指数）。
     * 默认 top100；串行拉取以免并行 rebuild 重复刷 status。
     */
    )
  }, {
    key: "getAllRankings",
    value: (function () {
      var _getAllRankings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(userId, opts) {
        var _opts$limit2;
        var limit, rankings, _iterator2, _step2, m, _t4;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              limit = Math.max(1, Math.min(100, (_opts$limit2 = opts === null || opts === void 0 ? void 0 : opts.limit) !== null && _opts$limit2 !== void 0 ? _opts$limit2 : 100));
              rankings = {};
              _iterator2 = _createForOfIteratorHelper(COMMUNITY_METRICS);
              _context0.p = 1;
              _iterator2.s();
            case 2:
              if ((_step2 = _iterator2.n()).done) {
                _context0.n = 5;
                break;
              }
              m = _step2.value;
              _context0.n = 3;
              return this.getRanking(userId, m.metric, _objectSpread(_objectSpread({}, opts), {}, {
                limit: limit
              }));
            case 3:
              rankings[m.metric] = _context0.v;
            case 4:
              _context0.n = 2;
              break;
            case 5:
              _context0.n = 7;
              break;
            case 6:
              _context0.p = 6;
              _t4 = _context0.v;
              _iterator2.e(_t4);
            case 7:
              _context0.p = 7;
              _iterator2.f();
              return _context0.f(7);
            case 8:
              return _context0.a(2, rankings);
          }
        }, _callee0, this, [[1, 6, 7, 8]]);
      }));
      function getAllRankings(_x10, _x11) {
        return _getAllRankings.apply(this, arguments);
      }
      return getAllRankings;
    }()
    /**
     * 个人主页：用户在其社区的四指标排名/称号摘要（不返回完整 leaderboard）
     */
    )
  }, {
    key: "getUserTitleSummaries",
    value: (function () {
      var _getUserTitleSummaries = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(userId, opts) {
        var _opts$now2;
        var regionId, region, now, _getShanghaiWeekRange2, weekStart, weekEnd, titles, _iterator3, _step3, def, needRebuild, row, meta, rank, value, _t5, _t6;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              _context1.n = 1;
              return this.getUserRegionId(userId);
            case 1:
              regionId = _context1.v;
              if (regionId) {
                _context1.n = 2;
                break;
              }
              return _context1.a(2, {
                region: null,
                titles: []
              });
            case 2:
              _context1.n = 3;
              return this.getRegionById(regionId);
            case 3:
              region = _context1.v;
              if (region) {
                _context1.n = 4;
                break;
              }
              return _context1.a(2, {
                region: null,
                titles: []
              });
            case 4:
              now = (_opts$now2 = opts === null || opts === void 0 ? void 0 : opts.now) !== null && _opts$now2 !== void 0 ? _opts$now2 : new Date();
              _getShanghaiWeekRange2 = getShanghaiWeekRange(now), weekStart = _getShanghaiWeekRange2.weekStart, weekEnd = _getShanghaiWeekRange2.weekEnd; // 保证目标用户本周 status 存在
              _context1.n = 5;
              return this.userStatus.getStatus(userId, {
                now: now
              });
            case 5:
              titles = [];
              _iterator3 = _createForOfIteratorHelper(COMMUNITY_METRICS);
              _context1.p = 6;
              _iterator3.s();
            case 7:
              if ((_step3 = _iterator3.n()).done) {
                _context1.n = 14;
                break;
              }
              def = _step3.value;
              _t5 = opts === null || opts === void 0 ? void 0 : opts.fresh;
              if (_t5) {
                _context1.n = 9;
                break;
              }
              _context1.n = 8;
              return this.isRankStale(weekStart, regionId, def.metric, now);
            case 8:
              _t5 = _context1.v;
            case 9:
              needRebuild = _t5;
              if (!needRebuild) {
                _context1.n = 10;
                break;
              }
              _context1.n = 10;
              return this.rebuildRanking(weekStart, weekEnd, regionId, def, now);
            case 10:
              _context1.n = 11;
              return this.db.get("SELECT rank, value FROM community_rank_entries\n                 WHERE weekStart = ? AND regionId = ? AND metric = ? AND userId = ?", [weekStart, regionId, def.metric, userId]);
            case 11:
              row = _context1.v;
              _context1.n = 12;
              return this.db.get("SELECT participantCount FROM community_rank_meta\n                 WHERE weekStart = ? AND regionId = ? AND metric = ?", [weekStart, regionId, def.metric]);
            case 12:
              meta = _context1.v;
              rank = row ? Number(row.rank) : null;
              value = row ? Number(row.value) : null;
              titles.push({
                metric: def.metric,
                metricLabel: def.metricLabel,
                titleLabel: def.titleLabel,
                higherIsBetter: def.higherIsBetter,
                rank: Number.isFinite(rank) ? rank : null,
                value: Number.isFinite(value) ? value : null,
                title: buildRankTitle(region.name, def.titleLabel, rank),
                eligible: !!row,
                totalParticipants: Number(meta === null || meta === void 0 ? void 0 : meta.participantCount) || 0
              });
            case 13:
              _context1.n = 7;
              break;
            case 14:
              _context1.n = 16;
              break;
            case 15:
              _context1.p = 15;
              _t6 = _context1.v;
              _iterator3.e(_t6);
            case 16:
              _context1.p = 16;
              _iterator3.f();
              return _context1.f(16);
            case 17:
              return _context1.a(2, {
                region: region,
                titles: titles
              });
          }
        }, _callee1, this, [[6, 15, 16, 17]]);
      }));
      function getUserTitleSummaries(_x12, _x13) {
        return _getUserTitleSummaries.apply(this, arguments);
      }
      return getUserTitleSummaries;
    }())
  }, {
    key: "isRankStale",
    value: function () {
      var _isRankStale = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(weekStart, regionId, metric, now) {
        var row, t;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return this.db.get("SELECT computedAt FROM community_rank_meta\n             WHERE weekStart = ? AND regionId = ? AND metric = ?", [weekStart, regionId, metric]);
            case 1:
              row = _context10.v;
              if (row !== null && row !== void 0 && row.computedAt) {
                _context10.n = 2;
                break;
              }
              return _context10.a(2, true);
            case 2:
              t = new Date(row.computedAt).getTime();
              if (Number.isFinite(t)) {
                _context10.n = 3;
                break;
              }
              return _context10.a(2, true);
            case 3:
              return _context10.a(2, now.getTime() - t >= COMMUNITY_RANK_CACHE_TTL_MS);
          }
        }, _callee10, this);
      }));
      function isRankStale(_x14, _x15, _x16, _x17) {
        return _isRankStale.apply(this, arguments);
      }
      return isRankStale;
    }()
    /**
     * 从 user_status × 同地区用户 重算名次并写入 community_rank_entries
     */
  }, {
    key: "rebuildRanking",
    value: (function () {
      var _rebuildRanking = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(weekStart, weekEnd, regionId, def) {
        var _this3 = this;
        var now,
          members,
          _iterator4,
          _step4,
          m,
          col,
          sql,
          rows,
          scored,
          ranked,
          computedAt,
          _args12 = arguments,
          _t0,
          _t1;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              now = _args12.length > 4 && _args12[4] !== undefined ? _args12[4] : new Date();
              _context12.n = 1;
              return this.db.all("SELECT id FROM users WHERE communityRegionId = ?", [regionId]);
            case 1:
              members = _context12.v;
              _iterator4 = _createForOfIteratorHelper(members);
              _context12.p = 2;
              _iterator4.s();
            case 3:
              if ((_step4 = _iterator4.n()).done) {
                _context12.n = 8;
                break;
              }
              m = _step4.value;
              _context12.p = 4;
              _context12.n = 5;
              return this.userStatus.getStatus(m.id, {
                now: now
              });
            case 5:
              _context12.n = 7;
              break;
            case 6:
              _context12.p = 6;
              _t0 = _context12.v;
            case 7:
              _context12.n = 3;
              break;
            case 8:
              _context12.n = 10;
              break;
            case 9:
              _context12.p = 9;
              _t1 = _context12.v;
              _iterator4.e(_t1);
            case 10:
              _context12.p = 10;
              _iterator4.f();
              return _context12.f(10);
            case 11:
              col = def.column; // 安全：column 来自白名单
              if (COMMUNITY_METRICS.some(function (x) {
                return x.column === col;
              })) {
                _context12.n = 12;
                break;
              }
              throw new Error("Invalid metric column");
            case 12:
              sql = "\n            SELECT u.id as userId, u.name as userName, u.email as email,\n                   s.".concat(col, " as value\n            FROM users u\n            INNER JOIN user_status s ON s.userId = u.id\n            WHERE u.communityRegionId = ?\n              AND s.weekStart = ?\n        ");
              if (def.requireNonNull) {
                sql += " AND s.".concat(col, " IS NOT NULL");
              }
              _context12.n = 13;
              return this.db.all(sql, [regionId, weekStart]);
            case 13:
              rows = _context12.v;
              scored = rows.map(function (r) {
                return {
                  userId: r.userId,
                  displayName: toDisplayName(r.userName, r.email),
                  value: Number(r.value)
                };
              }).filter(function (r) {
                return Number.isFinite(r.value);
              });
              scored.sort(function (a, b) {
                if (a.value === b.value) {
                  return a.userId.localeCompare(b.userId);
                }
                if (def.higherIsBetter) return b.value - a.value;
                return a.value - b.value;
              });
              ranked = assignDenseRanks(scored);
              computedAt = toShanghaiISO(now); // 写路径串行 + 单层事务，避免并行 4 榜同时 BEGIN
              _context12.n = 14;
              return this.enqueueWrite(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
                var _iterator5, _step5, e, _t7, _t8, _t9;
                return _regenerator().w(function (_context11) {
                  while (1) switch (_context11.p = _context11.n) {
                    case 0:
                      _context11.n = 1;
                      return _this3.db.run("BEGIN IMMEDIATE");
                    case 1:
                      _context11.p = 1;
                      _context11.n = 2;
                      return _this3.db.run("DELETE FROM community_rank_entries\n                     WHERE weekStart = ? AND regionId = ? AND metric = ?", [weekStart, regionId, def.metric]);
                    case 2:
                      _iterator5 = _createForOfIteratorHelper(ranked);
                      _context11.p = 3;
                      _iterator5.s();
                    case 4:
                      if ((_step5 = _iterator5.n()).done) {
                        _context11.n = 6;
                        break;
                      }
                      e = _step5.value;
                      _context11.n = 5;
                      return _this3.db.run("INSERT INTO community_rank_entries\n                         (weekStart, regionId, metric, userId, value, rank, displayName, computedAt)\n                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [weekStart, regionId, def.metric, e.userId, e.value, e.rank, e.displayName, computedAt]);
                    case 5:
                      _context11.n = 4;
                      break;
                    case 6:
                      _context11.n = 8;
                      break;
                    case 7:
                      _context11.p = 7;
                      _t7 = _context11.v;
                      _iterator5.e(_t7);
                    case 8:
                      _context11.p = 8;
                      _iterator5.f();
                      return _context11.f(8);
                    case 9:
                      _context11.n = 10;
                      return _this3.db.run("INSERT INTO community_rank_meta (weekStart, regionId, metric, computedAt, participantCount)\n                     VALUES (?, ?, ?, ?, ?)\n                     ON CONFLICT(weekStart, regionId, metric) DO UPDATE SET\n                       computedAt = excluded.computedAt,\n                       participantCount = excluded.participantCount", [weekStart, regionId, def.metric, computedAt, ranked.length]);
                    case 10:
                      _context11.n = 11;
                      return _this3.db.run("COMMIT");
                    case 11:
                      _context11.n = 17;
                      break;
                    case 12:
                      _context11.p = 12;
                      _t8 = _context11.v;
                      _context11.p = 13;
                      _context11.n = 14;
                      return _this3.db.run("ROLLBACK");
                    case 14:
                      _context11.n = 16;
                      break;
                    case 15:
                      _context11.p = 15;
                      _t9 = _context11.v;
                    case 16:
                      throw _t8;
                    case 17:
                      return _context11.a(2);
                  }
                }, _callee11, null, [[13, 15], [3, 7, 8, 9], [1, 12]]);
              })));
            case 14:
              return _context12.a(2);
          }
        }, _callee12, this, [[4, 6], [2, 9, 10, 11]]);
      }));
      function rebuildRanking(_x18, _x19, _x20, _x21) {
        return _rebuildRanking.apply(this, arguments);
      }
      return rebuildRanking;
    }())
  }, {
    key: "readRankingResult",
    value: function () {
      var _readRankingResult = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(userId, region, def, weekStart, weekEnd, limit) {
        var top, meta, meRow, userRow, myDisplay, leaderboard, myRank, myValue;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              _context13.n = 1;
              return this.db.all("SELECT userId, displayName, value, rank FROM community_rank_entries\n             WHERE weekStart = ? AND regionId = ? AND metric = ?\n             ORDER BY rank ASC, userId ASC\n             LIMIT ?", [weekStart, region.id, def.metric, limit]);
            case 1:
              top = _context13.v;
              _context13.n = 2;
              return this.db.get("SELECT computedAt, participantCount FROM community_rank_meta\n             WHERE weekStart = ? AND regionId = ? AND metric = ?", [weekStart, region.id, def.metric]);
            case 2:
              meta = _context13.v;
              _context13.n = 3;
              return this.db.get("SELECT userId, displayName, value, rank FROM community_rank_entries\n             WHERE weekStart = ? AND regionId = ? AND metric = ? AND userId = ?", [weekStart, region.id, def.metric, userId]);
            case 3:
              meRow = _context13.v;
              _context13.n = 4;
              return this.db.get("SELECT name, email FROM users WHERE id = ?", [userId]);
            case 4:
              userRow = _context13.v;
              myDisplay = toDisplayName(userRow === null || userRow === void 0 ? void 0 : userRow.name, userRow === null || userRow === void 0 ? void 0 : userRow.email);
              leaderboard = top.map(function (r) {
                return {
                  rank: Number(r.rank),
                  userId: r.userId,
                  displayName: r.displayName,
                  value: Number(r.value),
                  isMe: r.userId === userId
                };
              });
              myRank = meRow ? Number(meRow.rank) : null;
              myValue = meRow ? Number(meRow.value) : null;
              return _context13.a(2, {
                metric: def.metric,
                metricLabel: def.metricLabel,
                titleLabel: def.titleLabel,
                higherIsBetter: def.higherIsBetter,
                region: region,
                weekStart: weekStart,
                weekEnd: weekEnd,
                me: {
                  rank: myRank,
                  value: myValue,
                  displayName: (meRow === null || meRow === void 0 ? void 0 : meRow.displayName) || myDisplay,
                  title: buildRankTitle(region.name, def.titleLabel, myRank),
                  eligible: !!meRow
                },
                leaderboard: leaderboard,
                totalParticipants: Number(meta === null || meta === void 0 ? void 0 : meta.participantCount) || leaderboard.length,
                computedAt: meta !== null && meta !== void 0 && meta.computedAt ? String(meta.computedAt) : toShanghaiISO(),
                fromCache: true
              });
          }
        }, _callee13, this);
      }));
      function readRankingResult(_x22, _x23, _x24, _x25, _x26, _x27) {
        return _readRankingResult.apply(this, arguments);
      }
      return readRankingResult;
    }()
  }]);
}();