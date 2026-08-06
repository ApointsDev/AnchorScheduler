function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 用户 CRUD 操作

import { mapRowToTask } from "./taskMapper.js";
export var UserStore = /*#__PURE__*/function () {
  function UserStore(db) {
    _classCallCheck(this, UserStore);
    this.db = db;
  }
  return _createClass(UserStore, [{
    key: "addUser",
    value: function () {
      var _addUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(user) {
        var _user$mailReadingSpan;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.db.run("INSERT INTO users\n           (id, email, name, XJTLUaccount, XJTLUPassword, passwordHash, JWTtoken, MStoken, MSRefreshToken, MSbinded,\n            CalDavBaseUrl, CalDavUsername, CalDavPassword, CalDavPrincipalUrl, CalDavCalendarHome, CalDavCalendarUrl, CalDavSyncToken, CalDavEnabled, CalDavLastSyncAt,\n            ExchangeAccessToken, ExchangeRefreshToken, ExchangeTokenExpiresAt, ExchangeBinded,\n            ImapBinded, ImapEmail, ImapPassword, ImapHost, ImapPort, ImapTls, CAFSub, CAFAccessToken, CAFRefreshToken, CAFTokenExpiresAt, ebridgeBinded, timetableUrl, timetableFetchLevel, mailReadingSpan, conflictBoundaryInclusive, weekOffset, autoSchedulePromotions, stripReplyPrefix, onboardingCompleted)\n           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [user.id, user.email, user.name, user.XJTLUaccount, user.XJTLUPassword, user.passwordHash, user.JWTtoken, user.MStoken, user.MSRefreshToken, user.MSbinded ? 1 : 0, user.CalDavBaseUrl, user.CalDavUsername, user.CalDavPassword, user.CalDavPrincipalUrl, user.CalDavCalendarHome, user.CalDavCalendarUrl, user.CalDavSyncToken, user.CalDavEnabled ? 1 : 0, user.CalDavLastSyncAt, user.ExchangeAccessToken, user.ExchangeRefreshToken, user.ExchangeTokenExpiresAt, user.ExchangeBinded ? 1 : 0, user.ImapBinded ? 1 : 0, user.ImapEmail, user.ImapPassword, user.ImapHost, user.ImapPort, user.ImapTls ? 1 : 0, user.CAFSub, user.CAFAccessToken, user.CAFRefreshToken, user.CAFTokenExpiresAt, user.ebridgeBinded ? 1 : 0, user.timetableUrl, user.timetableFetchLevel || 0, (_user$mailReadingSpan = user.mailReadingSpan) !== null && _user$mailReadingSpan !== void 0 ? _user$mailReadingSpan : 30, user.conflictBoundaryInclusive ? 1 : 0, user.weekOffset || 0, user.autoSchedulePromotions ? 1 : 0, user.stripReplyPrefix !== false ? 1 : 0, user.onboardingCompleted ? 1 : 0]);
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function addUser(_x) {
        return _addUser.apply(this, arguments);
      }
      return addUser;
    }()
  }, {
    key: "updateUser",
    value: function () {
      var _updateUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(user) {
        var _user$mailReadingSpan2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.db.run("UPDATE users\n             SET email = ?, name = ?, XJTLUaccount = ?, XJTLUPassword = ?, passwordHash = ?,\n                 JWTtoken = ?, MStoken = ?, MSRefreshToken = ?, MSbinded = ?,\n                 ExchangeAccessToken = ?, ExchangeRefreshToken = ?, ExchangeTokenExpiresAt = ?, ExchangeBinded = ?,\n                 ImapBinded = ?, ImapEmail = ?, ImapPassword = ?, ImapHost = ?, ImapPort = ?, ImapTls = ?,\n                 CAFSub = ?, CAFAccessToken = ?, CAFRefreshToken = ?, CAFTokenExpiresAt = ?,\n                 CalDavBaseUrl = ?, CalDavUsername = ?, CalDavPassword = ?, CalDavPrincipalUrl = ?,\n                 CalDavCalendarHome = ?, CalDavCalendarUrl = ?, CalDavSyncToken = ?, CalDavEnabled = ?, CalDavServerEnabled = ?, CalDavLastSyncAt = ?,\n                 ebridgeBinded = ?, timetableUrl = ?, timetableFetchLevel = ?, mailReadingSpan = ?, conflictBoundaryInclusive = ?, weekOffset = ?, autoSchedulePromotions = ?, stripReplyPrefix = ?, onboardingCompleted = ?, updatedAt = CURRENT_TIMESTAMP\n             WHERE id = ?", [user.email, user.name, user.XJTLUaccount, user.XJTLUPassword, user.passwordHash, user.JWTtoken, user.MStoken, user.MSRefreshToken, user.MSbinded ? 1 : 0, user.ExchangeAccessToken, user.ExchangeRefreshToken, user.ExchangeTokenExpiresAt, user.ExchangeBinded ? 1 : 0, user.ImapBinded ? 1 : 0, user.ImapEmail, user.ImapPassword, user.ImapHost, user.ImapPort, user.ImapTls ? 1 : 0, user.CAFSub, user.CAFAccessToken, user.CAFRefreshToken, user.CAFTokenExpiresAt, user.CalDavBaseUrl, user.CalDavUsername, user.CalDavPassword, user.CalDavPrincipalUrl, user.CalDavCalendarHome, user.CalDavCalendarUrl, user.CalDavSyncToken, user.CalDavEnabled ? 1 : 0, user.CalDavServerEnabled ? 1 : 0, user.CalDavLastSyncAt, user.ebridgeBinded ? 1 : 0, user.timetableUrl, user.timetableFetchLevel || 0, (_user$mailReadingSpan2 = user.mailReadingSpan) !== null && _user$mailReadingSpan2 !== void 0 ? _user$mailReadingSpan2 : 30, user.conflictBoundaryInclusive ? 1 : 0, user.weekOffset || 0, user.autoSchedulePromotions ? 1 : 0, user.stripReplyPrefix !== false ? 1 : 0, user.onboardingCompleted ? 1 : 0, user.id]);
            case 1:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function updateUser(_x2) {
        return _updateUser.apply(this, arguments);
      }
      return updateUser;
    }()
  }, {
    key: "getUserById",
    value: function () {
      var _getUserById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(id, getTasksByUserId) {
        var row, tasks;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.db.get("SELECT * FROM users WHERE id = ?", [id]);
            case 1:
              row = _context3.v;
              if (row) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2, null);
            case 2:
              _context3.n = 3;
              return getTasksByUserId(id);
            case 3:
              tasks = _context3.v;
              return _context3.a(2, this.mapRowToUser(row, tasks));
          }
        }, _callee3, this);
      }));
      function getUserById(_x3, _x4) {
        return _getUserById.apply(this, arguments);
      }
      return getUserById;
    }()
  }, {
    key: "getUserByEmail",
    value: function () {
      var _getUserByEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(email, getTasksByUserId) {
        var row, tasks;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.db.get("SELECT * FROM users WHERE email = ?", [email]);
            case 1:
              row = _context4.v;
              if (row) {
                _context4.n = 2;
                break;
              }
              return _context4.a(2, null);
            case 2:
              _context4.n = 3;
              return getTasksByUserId(row.id);
            case 3:
              tasks = _context4.v;
              return _context4.a(2, this.mapRowToUser(row, tasks));
          }
        }, _callee4, this);
      }));
      function getUserByEmail(_x5, _x6) {
        return _getUserByEmail.apply(this, arguments);
      }
      return getUserByEmail;
    }()
  }, {
    key: "getUserByCafSub",
    value: function () {
      var _getUserByCafSub = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(cafSub, getTasksByUserId) {
        var row, tasks;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return this.db.get("SELECT * FROM users WHERE CAFSub = ?", [cafSub]);
            case 1:
              row = _context5.v;
              if (row) {
                _context5.n = 2;
                break;
              }
              return _context5.a(2, null);
            case 2:
              _context5.n = 3;
              return getTasksByUserId(row.id);
            case 3:
              tasks = _context5.v;
              return _context5.a(2, this.mapRowToUser(row, tasks));
          }
        }, _callee5, this);
      }));
      function getUserByCafSub(_x7, _x8) {
        return _getUserByCafSub.apply(this, arguments);
      }
      return getUserByCafSub;
    }()
  }, {
    key: "getAllUsers",
    value: function () {
      var _getAllUsers = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(getTasksByUserId) {
        var rows, users, _iterator, _step, row, tasks, _t;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.n = 1;
              return this.db.all("SELECT * FROM users");
            case 1:
              rows = _context6.v;
              users = [];
              _iterator = _createForOfIteratorHelper(rows);
              _context6.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context6.n = 6;
                break;
              }
              row = _step.value;
              _context6.n = 4;
              return getTasksByUserId(row.id);
            case 4:
              tasks = _context6.v;
              users.push(this.mapRowToUser(row, tasks));
            case 5:
              _context6.n = 3;
              break;
            case 6:
              _context6.n = 8;
              break;
            case 7:
              _context6.p = 7;
              _t = _context6.v;
              _iterator.e(_t);
            case 8:
              _context6.p = 8;
              _iterator.f();
              return _context6.f(8);
            case 9:
              return _context6.a(2, users);
          }
        }, _callee6, this, [[2, 7, 8, 9]]);
      }));
      function getAllUsers(_x9) {
        return _getAllUsers.apply(this, arguments);
      }
      return getAllUsers;
    }()
  }, {
    key: "updateUserHighEnergyPeriods",
    value: function () {
      var _updateUserHighEnergyPeriods = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(userId, periods) {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return this.db.run("UPDATE users SET highEnergyPeriods = ? WHERE id = ?", [JSON.stringify(periods), userId]);
            case 1:
              return _context7.a(2);
          }
        }, _callee7, this);
      }));
      function updateUserHighEnergyPeriods(_x0, _x1) {
        return _updateUserHighEnergyPeriods.apply(this, arguments);
      }
      return updateUserHighEnergyPeriods;
    }()
  }, {
    key: "mapRowToUser",
    value: function mapRowToUser(row, tasks) {
      var _row$mailReadingSpan, _row$signature;
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        XJTLUaccount: row.XJTLUaccount,
        XJTLUPassword: row.XJTLUPassword,
        passwordHash: row.passwordHash,
        JWTtoken: row.JWTtoken,
        MStoken: row.MStoken,
        MSRefreshToken: row.MSRefreshToken,
        MSbinded: row.MSbinded === 1,
        ExchangeAccessToken: row.ExchangeAccessToken,
        ExchangeRefreshToken: row.ExchangeRefreshToken,
        ExchangeTokenExpiresAt: row.ExchangeTokenExpiresAt,
        ExchangeBinded: row.ExchangeBinded === 1,
        ImapBinded: row.ImapBinded === 1,
        ImapEmail: row.ImapEmail,
        ImapPassword: row.ImapPassword,
        ImapHost: row.ImapHost,
        ImapPort: row.ImapPort,
        ImapTls: row.ImapTls === 1,
        CAFSub: row.CAFSub,
        CAFAccessToken: row.CAFAccessToken,
        CAFRefreshToken: row.CAFRefreshToken,
        CAFTokenExpiresAt: row.CAFTokenExpiresAt,
        CalDavBaseUrl: row.CalDavBaseUrl,
        CalDavUsername: row.CalDavUsername,
        CalDavPassword: row.CalDavPassword,
        CalDavPrincipalUrl: row.CalDavPrincipalUrl,
        CalDavCalendarHome: row.CalDavCalendarHome,
        CalDavCalendarUrl: row.CalDavCalendarUrl,
        CalDavSyncToken: row.CalDavSyncToken,
        CalDavEnabled: row.CalDavEnabled === 1,
        CalDavServerEnabled: row.CalDavServerEnabled === 1,
        CalDavLastSyncAt: row.CalDavLastSyncAt,
        ebridgeBinded: row.ebridgeBinded === 1,
        timetableUrl: row.timetableUrl || "",
        timetableFetchLevel: row.timetableFetchLevel || 0,
        mailReadingSpan: (_row$mailReadingSpan = row.mailReadingSpan) !== null && _row$mailReadingSpan !== void 0 ? _row$mailReadingSpan : 30,
        conflictBoundaryInclusive: row.conflictBoundaryInclusive === 1,
        weekOffset: row.weekOffset || 0,
        autoSchedulePromotions: row.autoSchedulePromotions === 1,
        stripReplyPrefix: row.stripReplyPrefix !== 0,
        onboardingCompleted: row.onboardingCompleted === 1,
        communityRegionId: row.communityRegionId || undefined,
        avatar: row.avatar || null,
        signature: (_row$signature = row.signature) !== null && _row$signature !== void 0 ? _row$signature : null,
        highEnergyPeriods: row.highEnergyPeriods ? JSON.parse(row.highEnergyPeriods) : {},
        ChaoxingBinded: row.ChaoxingBinded === 1,
        ChaoxingUsername: row.ChaoxingUsername || undefined,
        ChaoxingPassword: row.ChaoxingPassword || undefined,
        ChaoxingAccountId: row.ChaoxingAccountId || undefined,
        ChaoxingIntervalHours: row.ChaoxingIntervalHours != null ? Number(row.ChaoxingIntervalHours) : 24,
        ChaoxingPreferredHour: row.ChaoxingPreferredHour != null ? Number(row.ChaoxingPreferredHour) : 8,
        ChaoxingEnabled: row.ChaoxingEnabled === undefined || row.ChaoxingEnabled === null ? true : row.ChaoxingEnabled === 1,
        ChaoxingLastSyncAt: row.ChaoxingLastSyncAt || undefined,
        ChaoxingNextSyncAt: row.ChaoxingNextSyncAt || undefined,
        ChaoxingLastJobId: row.ChaoxingLastJobId || undefined,
        ChaoxingLastStatus: row.ChaoxingLastStatus || undefined,
        ChaoxingLastError: row.ChaoxingLastError || undefined,
        tasks: tasks.map(mapRowToTask),
        emsClient: undefined
      };
    }

    /** 仅更新学习通相关字段，避免改动整行 UPDATE 的列清单 */
  }, {
    key: "updateChaoxingFields",
    value: (function () {
      var _updateChaoxingFields = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(userId, fields) {
        var sets, vals, map, _i, _map, _map$_i, col, val;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              sets = [];
              vals = [];
              map = [["ChaoxingBinded", fields.ChaoxingBinded === undefined ? undefined : fields.ChaoxingBinded ? 1 : 0], ["ChaoxingUsername", fields.ChaoxingUsername], ["ChaoxingPassword", fields.ChaoxingPassword], ["ChaoxingAccountId", fields.ChaoxingAccountId], ["ChaoxingIntervalHours", fields.ChaoxingIntervalHours], ["ChaoxingPreferredHour", fields.ChaoxingPreferredHour], ["ChaoxingEnabled", fields.ChaoxingEnabled === undefined ? undefined : fields.ChaoxingEnabled ? 1 : 0], ["ChaoxingLastSyncAt", fields.ChaoxingLastSyncAt], ["ChaoxingNextSyncAt", fields.ChaoxingNextSyncAt], ["ChaoxingLastJobId", fields.ChaoxingLastJobId], ["ChaoxingLastStatus", fields.ChaoxingLastStatus], ["ChaoxingLastError", fields.ChaoxingLastError]];
              for (_i = 0, _map = map; _i < _map.length; _i++) {
                _map$_i = _slicedToArray(_map[_i], 2), col = _map$_i[0], val = _map$_i[1];
                if (val !== undefined) {
                  sets.push("".concat(col, " = ?"));
                  vals.push(val);
                }
              }
              if (!(sets.length === 0)) {
                _context8.n = 1;
                break;
              }
              return _context8.a(2);
            case 1:
              sets.push("updatedAt = CURRENT_TIMESTAMP");
              vals.push(userId);
              _context8.n = 2;
              return this.db.run("UPDATE users SET ".concat(sets.join(", "), " WHERE id = ?"), vals);
            case 2:
              return _context8.a(2);
          }
        }, _callee8, this);
      }));
      function updateChaoxingFields(_x10, _x11) {
        return _updateChaoxingFields.apply(this, arguments);
      }
      return updateChaoxingFields;
    }() /** 更新头像 URL/路径；传 null 清空 */)
  }, {
    key: "updateAvatar",
    value: (function () {
      var _updateAvatar = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(userId, avatar) {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return this.db.run("UPDATE users SET avatar = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [avatar, userId]);
            case 1:
              return _context9.a(2);
          }
        }, _callee9, this);
      }));
      function updateAvatar(_x12, _x13) {
        return _updateAvatar.apply(this, arguments);
      }
      return updateAvatar;
    }() /** 更新个人签名；传 null 或空串可清空（调用方决定） */)
  }, {
    key: "updateSignature",
    value: (function () {
      var _updateSignature = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(userId, signature) {
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              _context0.n = 1;
              return this.db.run("UPDATE users SET signature = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [signature, userId]);
            case 1:
              return _context0.a(2);
          }
        }, _callee0, this);
      }));
      function updateSignature(_x14, _x15) {
        return _updateSignature.apply(this, arguments);
      }
      return updateSignature;
    }()
    /**
     * 个人主页公开字段（不加载 tasks / 凭证 / 邮箱）
     */
    )
  }, {
    key: "getPublicProfile",
    value: (function () {
      var _getPublicProfile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(userId) {
        var _row$signature2;
        var row;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return this.db.get("SELECT id, name, avatar, signature, communityRegionId\n             FROM users WHERE id = ?", [userId]);
            case 1:
              row = _context1.v;
              if (row) {
                _context1.n = 2;
                break;
              }
              return _context1.a(2, null);
            case 2:
              return _context1.a(2, {
                id: row.id,
                name: row.name || "",
                avatar: row.avatar || null,
                signature: (_row$signature2 = row.signature) !== null && _row$signature2 !== void 0 ? _row$signature2 : null,
                communityRegionId: row.communityRegionId || null
              });
          }
        }, _callee1, this);
      }));
      function getPublicProfile(_x16) {
        return _getPublicProfile.apply(this, arguments);
      }
      return getPublicProfile;
    }())
  }]);
}();