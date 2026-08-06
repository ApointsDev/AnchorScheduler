function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDAVClient } from "tsdav";
import { v4 as uuidv4 } from "uuid";
import { parseIcsEvent, buildIcs } from "./icsUtils.js";
export var CalDavProvider = /*#__PURE__*/function () {
  function CalDavProvider(config) {
    _classCallCheck(this, CalDavProvider);
    _defineProperty(this, "client", null);
    _defineProperty(this, "_isLoggedIn", false);
    this.baseUrl = config.baseUrl;
    this.username = config.username;
    this.password = config.password;
    this.calendarHome = config.calendarHome;
  }
  return _createClass(CalDavProvider, [{
    key: "ensureClient",
    value: function () {
      var _ensureClient = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!(this.client && this._isLoggedIn)) {
                _context.n = 1;
                break;
              }
              return _context.a(2, this.client);
            case 1:
              this.client = createDAVClient({
                serverUrl: this.baseUrl,
                credentials: {
                  username: this.username,
                  password: this.password
                },
                authMethod: 'Basic',
                defaultAccountType: 'caldav'
              });
              _context.n = 2;
              return this.client.login();
            case 2:
              this._isLoggedIn = true;
              return _context.a(2, this.client);
          }
        }, _callee, this);
      }));
      function ensureClient() {
        return _ensureClient.apply(this, arguments);
      }
      return ensureClient;
    }()
  }, {
    key: "discover",
    value: function () {
      var _discover = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var client, calendars, calendarInfos, principalUrl, calendarHome, firstCal;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.ensureClient();
            case 1:
              client = _context2.v;
              _context2.n = 2;
              return client.fetchCalendars();
            case 2:
              calendars = _context2.v;
              calendarInfos = calendars.map(function (cal) {
                return {
                  url: cal.url,
                  displayName: cal.displayName || cal.displayname,
                  description: cal.description,
                  ctag: cal.ctag,
                  syncToken: cal.syncToken
                };
              });
              if (calendars.length > 0) {
                firstCal = calendars[0];
                if (firstCal.account) {
                  principalUrl = firstCal.account.serverUrl || this.baseUrl;
                  calendarHome = firstCal.account.calendarHome || this.calendarHome;
                }
              }
              return _context2.a(2, {
                principalUrl: principalUrl || this.baseUrl,
                calendarHome: calendarHome || this.calendarHome,
                calendars: calendarInfos
              });
          }
        }, _callee2, this);
      }));
      function discover() {
        return _discover.apply(this, arguments);
      }
      return discover;
    }()
  }, {
    key: "listCalendars",
    value: function () {
      var _listCalendars = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var discovery;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.discover();
            case 1:
              discovery = _context3.v;
              return _context3.a(2, discovery.calendars);
          }
        }, _callee3, this);
      }));
      function listCalendars() {
        return _listCalendars.apply(this, arguments);
      }
      return listCalendars;
    }()
  }, {
    key: "listEvents",
    value: function () {
      var _listEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(calendarUrl, options) {
        var client, calendars, targetCalendar, fetchOptions, calendarObjects, events, _iterator, _step, obj, event, _t;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.n = 1;
              return this.ensureClient();
            case 1:
              client = _context4.v;
              _context4.n = 2;
              return client.fetchCalendars();
            case 2:
              calendars = _context4.v;
              targetCalendar = calendars.find(function (cal) {
                return cal.url === calendarUrl || cal.url.endsWith(calendarUrl) || calendarUrl.endsWith(cal.url) || cal.url.replace(/\/$/, '') === calendarUrl.replace(/\/$/, '');
              });
              if (targetCalendar) {
                _context4.n = 3;
                break;
              }
              throw new Error("Calendar not found: ".concat(calendarUrl));
            case 3:
              fetchOptions = {
                calendar: targetCalendar,
                expand: true,
                skipRecurrence: false
              };
              if (options !== null && options !== void 0 && options.start && options !== null && options !== void 0 && options.end) {
                fetchOptions.timeRange = {
                  start: new Date(options.start),
                  end: new Date(options.end)
                };
              }
              _context4.n = 4;
              return client.fetchCalendarObjects(fetchOptions);
            case 4:
              calendarObjects = _context4.v;
              events = [];
              _iterator = _createForOfIteratorHelper(calendarObjects);
              _context4.p = 5;
              _iterator.s();
            case 6:
              if ((_step = _iterator.n()).done) {
                _context4.n = 9;
                break;
              }
              obj = _step.value;
              if (obj.data) {
                _context4.n = 7;
                break;
              }
              return _context4.a(3, 8);
            case 7:
              try {
                event = parseIcsEvent(obj.data, obj);
                if (event) {
                  events.push(event);
                }
              } catch (e) {
                console.error('Failed to parse calendar object:', e);
              }
            case 8:
              _context4.n = 6;
              break;
            case 9:
              _context4.n = 11;
              break;
            case 10:
              _context4.p = 10;
              _t = _context4.v;
              _iterator.e(_t);
            case 11:
              _context4.p = 11;
              _iterator.f();
              return _context4.f(11);
            case 12:
              return _context4.a(2, events);
          }
        }, _callee4, this, [[5, 10, 11, 12]]);
      }));
      function listEvents(_x, _x2) {
        return _listEvents.apply(this, arguments);
      }
      return listEvents;
    }()
  }, {
    key: "createEvent",
    value: function () {
      var _createEvent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(calendarUrl, event) {
        var client, calendars, targetCalendar, uid, filename, iCalString, result;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return this.ensureClient();
            case 1:
              client = _context5.v;
              _context5.n = 2;
              return client.fetchCalendars();
            case 2:
              calendars = _context5.v;
              targetCalendar = calendars.find(function (cal) {
                return cal.url === calendarUrl || cal.url.endsWith(calendarUrl) || calendarUrl.endsWith(cal.url);
              });
              if (targetCalendar) {
                _context5.n = 3;
                break;
              }
              throw new Error("Calendar not found: ".concat(calendarUrl));
            case 3:
              uid = event.uid || uuidv4();
              filename = "".concat(uid, ".ics");
              iCalString = buildIcs(_objectSpread(_objectSpread({}, event), {}, {
                uid: uid
              }));
              _context5.n = 4;
              return client.createCalendarObject({
                calendar: targetCalendar,
                iCalString: iCalString,
                filename: filename
              });
            case 4:
              result = _context5.v;
              return _context5.a(2, {
                href: result.href || "".concat(calendarUrl).concat(filename),
                etag: result.etag,
                uid: uid
              });
          }
        }, _callee5, this);
      }));
      function createEvent(_x3, _x4) {
        return _createEvent.apply(this, arguments);
      }
      return createEvent;
    }()
  }, {
    key: "updateEvent",
    value: function () {
      var _updateEvent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(calendarUrl, href, event, etag) {
        var client, calendars, targetCalendar, iCalString, calendarObjects, result;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return this.ensureClient();
            case 1:
              client = _context6.v;
              _context6.n = 2;
              return client.fetchCalendars();
            case 2:
              calendars = _context6.v;
              targetCalendar = calendars.find(function (cal) {
                return cal.url === calendarUrl || cal.url.endsWith(calendarUrl) || calendarUrl.endsWith(cal.url);
              });
              if (targetCalendar) {
                _context6.n = 3;
                break;
              }
              throw new Error("Calendar not found: ".concat(calendarUrl));
            case 3:
              iCalString = buildIcs(event);
              _context6.n = 4;
              return client.fetchCalendarObjects({
                calendar: targetCalendar,
                objectUrls: [href]
              });
            case 4:
              calendarObjects = _context6.v;
              if (!(calendarObjects.length === 0)) {
                _context6.n = 5;
                break;
              }
              throw new Error("Calendar object not found: ".concat(href));
            case 5:
              _context6.n = 6;
              return client.updateCalendarObject({
                calendarObject: calendarObjects[0],
                iCalString: iCalString
              });
            case 6:
              result = _context6.v;
              return _context6.a(2, {
                href: result.href || href,
                etag: result.etag,
                uid: event.uid
              });
          }
        }, _callee6, this);
      }));
      function updateEvent(_x5, _x6, _x7, _x8) {
        return _updateEvent.apply(this, arguments);
      }
      return updateEvent;
    }()
  }, {
    key: "deleteEvent",
    value: function () {
      var _deleteEvent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(calendarUrl, href, etag) {
        var client, calendars, targetCalendar, calendarObjects;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return this.ensureClient();
            case 1:
              client = _context7.v;
              _context7.n = 2;
              return client.fetchCalendars();
            case 2:
              calendars = _context7.v;
              targetCalendar = calendars.find(function (cal) {
                return cal.url === calendarUrl || cal.url.endsWith(calendarUrl) || calendarUrl.endsWith(cal.url);
              });
              if (targetCalendar) {
                _context7.n = 3;
                break;
              }
              throw new Error("Calendar not found: ".concat(calendarUrl));
            case 3:
              _context7.n = 4;
              return client.fetchCalendarObjects({
                calendar: targetCalendar,
                objectUrls: [href]
              });
            case 4:
              calendarObjects = _context7.v;
              if (!(calendarObjects.length === 0)) {
                _context7.n = 5;
                break;
              }
              throw new Error("Calendar object not found: ".concat(href));
            case 5:
              _context7.n = 6;
              return client.deleteCalendarObject({
                calendarObject: calendarObjects[0]
              });
            case 6:
              return _context7.a(2);
          }
        }, _callee7, this);
      }));
      function deleteEvent(_x9, _x0, _x1) {
        return _deleteEvent.apply(this, arguments);
      }
      return deleteEvent;
    }()
  }]);
}();
export function createCalDavProvider(config) {
  return new CalDavProvider(config);
}