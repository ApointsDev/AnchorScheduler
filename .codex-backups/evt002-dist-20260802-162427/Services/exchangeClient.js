function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
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
import { ExchangeService, ExchangeVersion, WebCredentials, OAuthCredentials, Uri, WellKnownFolderName, SearchFilter, ItemView, PropertySet, BasePropertySet, EmailMessage, Appointment, CalendarView, DateTime, SendInvitationsMode, ItemSchema, EmailMessageSchema, AppointmentSchema, ItemId, FolderId, TraceFlags, StreamingSubscriptionConnection, EventType, MessageBody, Importance, ConflictResolutionMode, StringList } from "ews-javascript-api";
import axios from "axios";
import { logger } from "../Utils/logger.js";
import moment from "moment-timezone";
import { LLMApi } from "./LLMApi.js";
import { createTodoItem } from "./MStodo.js";
import { v4 as uuidv4 } from "uuid";
import { dbService } from "./dbService.js";
import { logUserEvent } from "./userLog.js";
import toShanghaiISO from "../Utils/time.js";

// 以下代码将禁用 SSL/TLS 证书验证。
// 如果您的 Exchange 服务器使用自签名证书，则需要此设置。
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// 为 ews-javascript-api 设置时区
moment.tz.setDefault("Asia/Shanghai");
export var ExchangeClient = /*#__PURE__*/function () {
  function ExchangeClient(config, user) {
    var _this = this;
    _classCallCheck(this, ExchangeClient);
    _defineProperty(this, "streamingSubscription", null);
    _defineProperty(this, "streamingConnection", null);
    _defineProperty(this, "healthCheckTimer", null);
    _defineProperty(this, "llmApi", null);
    _defineProperty(this, "user", null);
    _defineProperty(this, "processedMessageIds", new Set());
    _defineProperty(this, "tokenRefreshTimer", null);
    /* 修改指定邮件为已读状态
    @param itemId - 邮件 ID
    @param state - 是否标记为已读
    */
    _defineProperty(this, "markSystem", {
      markEmailAsRead: function () {
        var _markEmailAsRead = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(itemId, state) {
          var email;
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                if (!(_this.authMode === "graph")) {
                  _context.n = 2;
                  break;
                }
                _context.n = 1;
                return axios.patch("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/messages/").concat(itemId), {
                  isRead: state
                }, {
                  headers: _this.getGraphHeaders()
                });
              case 1:
                logger.success("Graph\u6A21\u5F0F\uFF1A\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u66F4\u65B0\u5DF2\u8BFB\u72B6\u6001\u3002"));
                return _context.a(2);
              case 2:
                _context.n = 3;
                return _this.ensureAutodiscover();
              case 3:
                logger.exchange("\u6B63\u5728\u5C06\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u6807\u8BB0\u4E3A\u5DF2\u8BFB..."));
                _context.n = 4;
                return EmailMessage.Bind(_this.service, new ItemId(itemId));
              case 4:
                email = _context.v;
                email.IsRead = state;
                _context.n = 5;
                return email.Update(ConflictResolutionMode.AlwaysOverwrite);
              case 5:
                logger.success("\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u6807\u8BB0\u4E3A\u5DF2\u8BFB\u3002"));
              case 6:
                return _context.a(2);
            }
          }, _callee);
        }));
        function markEmailAsRead(_x, _x2) {
          return _markEmailAsRead.apply(this, arguments);
        }
        return markEmailAsRead;
      }(),
      /* 为指定邮件增加“AI已读”标签
      @param itemId - 邮件 ID
      */
      addAIReadTagToEmail: function () {
        var _addAIReadTagToEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(itemId) {
          var _messageRes$data, messageRes, categories, _aiReadCategory, email, aiReadCategory, categoriesAny, items;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.n) {
              case 0:
                if (!(_this.authMode === "graph")) {
                  _context2.n = 5;
                  break;
                }
                _context2.n = 1;
                return axios.get("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/messages/").concat(itemId, "?$select=categories"), {
                  headers: _this.getGraphHeaders()
                });
              case 1:
                messageRes = _context2.v;
                categories = Array.isArray((_messageRes$data = messageRes.data) === null || _messageRes$data === void 0 ? void 0 : _messageRes$data.categories) ? messageRes.data.categories : [];
                _aiReadCategory = "AI已读";
                if (categories.includes(_aiReadCategory)) {
                  _context2.n = 3;
                  break;
                }
                categories.push(_aiReadCategory);
                _context2.n = 2;
                return axios.patch("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/messages/").concat(itemId), {
                  categories: categories
                }, {
                  headers: _this.getGraphHeaders()
                });
              case 2:
                logger.success("Graph\u6A21\u5F0F\uFF1A\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u589E\u52A0\u201CAI\u5DF2\u8BFB\u201D\u6807\u7B7E\u3002"));
                _context2.n = 4;
                break;
              case 3:
                logger.exchange("Graph\u6A21\u5F0F\uFF1A\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u5305\u542B\u201CAI\u5DF2\u8BFB\u201D\u6807\u7B7E\uFF0C\u65E0\u9700\u91CD\u590D\u6DFB\u52A0\u3002"));
              case 4:
                return _context2.a(2);
              case 5:
                _context2.n = 6;
                return _this.ensureAutodiscover();
              case 6:
                logger.exchange("\u6B63\u5728\u4E3A\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u589E\u52A0\u201CAI\u5DF2\u8BFB\u201D\u6807\u7B7E..."));
                _context2.n = 7;
                return EmailMessage.Bind(_this.service, new ItemId(itemId));
              case 7:
                email = _context2.v;
                aiReadCategory = "AI已读";
                if (!email.Categories) {
                  // 使用 ews-javascript-api 的 StringList 而不是普通数组
                  email.Categories = new StringList();
                }
                // StringList 并不完全等同于原生数组，使用 any 以便复用 includes/push 语义
                categoriesAny = email.Categories;
                if (!(!categoriesAny.includes || !categoriesAny.push)) {
                  _context2.n = 11;
                  break;
                }
                // 兼容没有 includes/push 的 StringList：检查 Items 属性或 Count
                items = categoriesAny.Items || [];
                if (items.includes(aiReadCategory)) {
                  _context2.n = 9;
                  break;
                }
                items.push(aiReadCategory);
                if (categoriesAny.Items) {
                  categoriesAny.Items = items;
                }
                _context2.n = 8;
                return email.Update(ConflictResolutionMode.AlwaysOverwrite);
              case 8:
                logger.success("\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u589E\u52A0\u201CAI\u5DF2\u8BFB\u201D\u6807\u7B7E\u3002"));
                _context2.n = 10;
                break;
              case 9:
                logger.exchange("\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u5305\u542B\u201CAI\u5DF2\u8BFB\u201D\u6807\u7B7E\uFF0C\u65E0\u9700\u91CD\u590D\u6DFB\u52A0\u3002"));
              case 10:
                _context2.n = 14;
                break;
              case 11:
                if (categoriesAny.includes(aiReadCategory)) {
                  _context2.n = 13;
                  break;
                }
                categoriesAny.push(aiReadCategory);
                _context2.n = 12;
                return email.Update(ConflictResolutionMode.AlwaysOverwrite);
              case 12:
                logger.success("\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u589E\u52A0\u201CAI\u5DF2\u8BFB\u201D\u6807\u7B7E\u3002"));
                _context2.n = 14;
                break;
              case 13:
                logger.exchange("\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u5DF2\u5305\u542B\u201CAI\u5DF2\u8BFB\u201D\u6807\u7B7E\uFF0C\u65E0\u9700\u91CD\u590D\u6DFB\u52A0\u3002"));
              case 14:
                return _context2.a(2);
            }
          }, _callee2);
        }));
        function addAIReadTagToEmail(_x3) {
          return _addAIReadTagToEmail.apply(this, arguments);
        }
        return addAIReadTagToEmail;
      }(),
      /*判断指定邮件是否已被标记为“AI已读”
      @param itemId - 邮件 ID
      @returns 是否已标记为“AI已读”
      */
      isEmailMarkedAsAIRead: function () {
        var _isEmailMarkedAsAIRead = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(itemId) {
          var _response$data, response, categories, email, aiReadCategory, categoriesAny, items;
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.n) {
              case 0:
                if (!(_this.authMode === "graph")) {
                  _context3.n = 2;
                  break;
                }
                _context3.n = 1;
                return axios.get("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/messages/").concat(itemId, "?$select=categories"), {
                  headers: _this.getGraphHeaders()
                });
              case 1:
                response = _context3.v;
                categories = Array.isArray((_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.categories) ? response.data.categories : [];
                return _context3.a(2, categories.includes("AI已读"));
              case 2:
                _context3.n = 3;
                return _this.ensureAutodiscover();
              case 3:
                logger.exchange("\u6B63\u5728\u68C0\u67E5\u90AE\u4EF6 ID \u4E3A ".concat(itemId, " \u662F\u5426\u5DF2\u6807\u8BB0\u4E3A\u201CAI\u5DF2\u8BFB\u201D..."));
                _context3.n = 4;
                return EmailMessage.Bind(_this.service, new ItemId(itemId));
              case 4:
                email = _context3.v;
                aiReadCategory = "AI已读";
                if (email.Categories) {
                  _context3.n = 5;
                  break;
                }
                return _context3.a(2, false);
              case 5:
                categoriesAny = email.Categories;
                if (categoriesAny.includes) {
                  _context3.n = 6;
                  break;
                }
                items = categoriesAny.Items || [];
                return _context3.a(2, items.includes(aiReadCategory));
              case 6:
                return _context3.a(2, categoriesAny.includes(aiReadCategory));
              case 7:
                return _context3.a(2);
            }
          }, _callee3);
        }));
        function isEmailMarkedAsAIRead(_x4) {
          return _isEmailMarkedAsAIRead.apply(this, arguments);
        }
        return isEmailMarkedAsAIRead;
      }()
    });
    this.config = config;
    this.user = user;
    this.authMode = this.shouldUseGraphAuth(config) ? "graph" : "ews";
    logger.exchange("Using ews-javascript-api initializing Exchange Client...");

    // 创建 ExchangeService 实例
    this.service = new ExchangeService(ExchangeVersion.Exchange2013_SP1);

    // 如果配置了 refresh token，设置自动刷新
    if (this.config.refreshToken && this.config.clientId && this.config.clientSecret) {
      this.startTokenRefresh();
    }

    // 初始化 LLM API 客户端
    if (config.openaiApiKey) {
      this.llmApi = new LLMApi(config.openaiApiKey, config.openaiModel || "gpt-4o");
    } else {
      logger.warn("未提供 OpenAI API Key，无法使用邮件智能处理功能");
    }

    // 根据是否存在 domain 来决定用户名的格式
    var username = this.config.domain ? "".concat(this.config.domain, "\\").concat(this.config.username) : this.config.username;
    if (this.config.oauthToken) {
      if (this.authMode === "ews") {
        this.service.Credentials = new OAuthCredentials(this.config.oauthToken);
        logger.exchange("Using OAuth authentication for Exchange (EWS mode).");
      } else {
        logger.exchange("Using OAuth authentication for Microsoft Graph delegated mode.");
      }
    } else {
      this.service.Credentials = new WebCredentials(username, this.config.password);
      logger.data("\u4F7F\u7528\u7684\u7528\u6237\u540D (\u683C\u5F0F\u5316\u540E): ".concat(username));
      logger.data("\u57DF\u540D: ".concat(this.config.domain || "未设置"));
    }

    // 启用跟踪以进行调试（仅 EWS 模式）
    if (this.authMode === "ews") {
      this.service.TraceEnabled = true;
      this.service.TraceFlags = TraceFlags.All;
      this.service.TraceListener = {
        Trace: function Trace(traceType, traceMessage) {
          logger.data("[EWS-TRACE] ".concat(traceType, ": ").concat(traceMessage));
        }
      };
    }
    logger.data("\u4F7F\u7528\u7684\u7528\u6237\u540D (\u683C\u5F0F\u5316\u540E): ".concat(username));
    logger.data("\u57DF\u540D: ".concat(this.config.domain || "未设置"));
    logger.exchange("客户端初始化完成。将在首次请求时使用 Autodiscover。");

    // 初始化后立即测试日历连接并启动推送通知
    _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var start, end, events, _t;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            logger.exchange("初始化时测试日历连接...");
            start = new Date();
            end = new Date();
            end.setDate(start.getDate() + 1); // 获取到明天为止的事件
            _context4.n = 1;
            return _this.getEvents(toShanghaiISO(start), toShanghaiISO(end));
          case 1:
            events = _context4.v;
            logger.success("\u65E5\u5386\u8FDE\u63A5\u6D4B\u8BD5\u6210\u529F\uFF0C\u83B7\u53D6\u5230\u672A\u676524\u5C0F\u65F6\u5185\u7684 ".concat(events.length, " \u4E2A\u4E8B\u4EF6\u3002"));

            // 启动推送通知订阅
            _context4.n = 2;
            return _this.startPushNotifications();
          case 2:
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t = _context4.v;
            // 错误已在 getEvents 中记录，这里只记录测试失败的上下文
            logger.error("初始化日历连接测试失败。");
          case 4:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 3]]);
    }))();
  }

  /**
   * 确保已执行 Autodiscover 并设置了 EWS URL
   */
  return _createClass(ExchangeClient, [{
    key: "shouldUseGraphAuth",
    value: function shouldUseGraphAuth(config) {
      var normalizedScope = (config.scope || "").toLowerCase();
      if (normalizedScope.includes("graph.microsoft.com")) {
        return true;
      }
      if (normalizedScope.includes("outlook.office365.com/ews.accessasuser.all")) {
        return false;
      }
      return (process.env.EXCHANGE_AUTH_MODE || "").toLowerCase() === "graph";
    }
  }, {
    key: "getGraphHeaders",
    value: function getGraphHeaders() {
      if (!this.config.oauthToken) {
        throw new Error("Graph mode requires oauthToken.");
      }
      return {
        Authorization: "Bearer ".concat(this.config.oauthToken),
        "Content-Type": "application/json"
      };
    }
  }, {
    key: "toGraphDateTime",
    value: function toGraphDateTime(dateValue) {
      var iso = new Date(dateValue).toISOString();
      return {
        dateTime: iso.replace("Z", ""),
        timeZone: "UTC"
      };
    }
  }, {
    key: "parseGraphDateTime",
    value: function parseGraphDateTime(value) {
      if (!(value !== null && value !== void 0 && value.dateTime)) return toShanghaiISO();
      var normalized = value.dateTime.endsWith("Z") ? value.dateTime : "".concat(value.dateTime, "Z");
      return toShanghaiISO(new Date(normalized).toISOString());
    }
  }, {
    key: "parseEmailFromGraph",
    value: function parseEmailFromGraph(message, includeBody) {
      var _message$flag, _message$from, _message$flag2, _message$body;
      var graphFlags = [];
      if (message.isRead) graphFlags.push("\\Seen");
      // Microsoft Graph 的 flag 属性表示后续标记（红旗）
      if (((_message$flag = message.flag) === null || _message$flag === void 0 ? void 0 : _message$flag.flagStatus) === "flagged") {
        graphFlags.push("\\Flagged");
      }
      return {
        id: message.id,
        subject: message.subject || "(无主题)",
        from: (_message$from = message.from) !== null && _message$from !== void 0 && _message$from.emailAddress ? {
          name: message.from.emailAddress.name || message.from.emailAddress.address || "",
          address: message.from.emailAddress.address || ""
        } : undefined,
        receivedAt: toShanghaiISO(message.receivedDateTime || new Date().toISOString()),
        isRead: !!message.isRead,
        isFlagged: ((_message$flag2 = message.flag) === null || _message$flag2 === void 0 ? void 0 : _message$flag2.flagStatus) === "flagged",
        flags: graphFlags,
        isAiProcessed: false,
        body: includeBody ? this.cleanHtmlContent(((_message$body = message.body) === null || _message$body === void 0 ? void 0 : _message$body.content) || "") : undefined,
        hasAttachments: !!message.hasAttachments
      };
    }
  }, {
    key: "parseEventFromGraph",
    value: function parseEventFromGraph(event) {
      var _event$location, _event$body;
      var importanceMap = {
        high: "high",
        normal: "normal",
        low: "low"
      };
      return {
        id: event.id,
        subject: event.subject || "(无主题)",
        start: this.parseGraphDateTime(event.start),
        end: this.parseGraphDateTime(event.end),
        location: ((_event$location = event.location) === null || _event$location === void 0 ? void 0 : _event$location.displayName) || "",
        body: this.cleanHtmlContent(((_event$body = event.body) === null || _event$body === void 0 ? void 0 : _event$body.content) || ""),
        attendees: Array.isArray(event.attendees) ? event.attendees.map(function (a) {
          var _a$emailAddress;
          return a === null || a === void 0 || (_a$emailAddress = a.emailAddress) === null || _a$emailAddress === void 0 ? void 0 : _a$emailAddress.address;
        }).filter(function (address) {
          return !!address;
        }) : [],
        importance: importanceMap[(event.importance || "normal").toLowerCase()] || "normal",
        isReminderOn: !!event.isReminderOn
      };
    }
  }, {
    key: "graphGetMessages",
    value: function () {
      var _graphGetMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(top) {
        var _this2 = this;
        var onlyUnread,
          query,
          response,
          _args5 = arguments;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              onlyUnread = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : false;
              query = new URLSearchParams({
                $top: String(top),
                $orderby: "receivedDateTime desc",
                $select: "id,subject,from,receivedDateTime,isRead,hasAttachments,flag"
              });
              if (onlyUnread) {
                query.append("$filter", "isRead eq false");
              }
              _context5.n = 1;
              return axios.get("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/messages?").concat(query.toString()), {
                headers: this.getGraphHeaders()
              });
            case 1:
              response = _context5.v;
              return _context5.a(2, (response.data.value || []).map(function (message) {
                return _this2.parseEmailFromGraph(message, false);
              }));
          }
        }, _callee5, this);
      }));
      function graphGetMessages(_x5) {
        return _graphGetMessages.apply(this, arguments);
      }
      return graphGetMessages;
    }()
  }, {
    key: "graphGetMessageById",
    value: function () {
      var _graphGetMessageById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(itemId) {
        var query, response;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              query = new URLSearchParams({
                $select: "id,subject,from,receivedDateTime,isRead,hasAttachments,body,categories,flag"
              });
              _context6.n = 1;
              return axios.get("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/messages/").concat(itemId, "?").concat(query.toString()), {
                headers: this.getGraphHeaders()
              });
            case 1:
              response = _context6.v;
              return _context6.a(2, this.parseEmailFromGraph(response.data, true));
          }
        }, _callee6, this);
      }));
      function graphGetMessageById(_x6) {
        return _graphGetMessageById.apply(this, arguments);
      }
      return graphGetMessageById;
    }()
  }, {
    key: "graphGetEvents",
    value: function () {
      var _graphGetEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(startDate, endDate) {
        var _this3 = this;
        var query, response;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              query = new URLSearchParams({
                startDateTime: new Date(startDate).toISOString(),
                endDateTime: new Date(endDate).toISOString(),
                $top: "100",
                $select: "id,subject,start,end,location,body,attendees,importance,isReminderOn",
                $orderby: "start/dateTime"
              });
              _context7.n = 1;
              return axios.get("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/calendarView?").concat(query.toString()), {
                headers: this.getGraphHeaders()
              });
            case 1:
              response = _context7.v;
              return _context7.a(2, (response.data.value || []).map(function (item) {
                return _this3.parseEventFromGraph(item);
              }));
          }
        }, _callee7, this);
      }));
      function graphGetEvents(_x7, _x8) {
        return _graphGetEvents.apply(this, arguments);
      }
      return graphGetEvents;
    }()
  }, {
    key: "startTokenRefresh",
    value: function startTokenRefresh() {
      var _this4 = this;
      if (!this.config.refreshToken || !this.config.tokenUrl || !this.config.clientId || !this.config.clientSecret) {
        logger.warn("Token Refresh params missing, skipping auto-refresh setup.");
        return;
      }

      // Set interval to refresh token (e.g., every 50 minutes)
      // Ideally should base on expires_in but 50min is safe for 1h tokens
      var REFRESH_INTERVAL = 50 * 60 * 1000;
      this.tokenRefreshTimer = setInterval(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var response, _response$data2, access_token, refresh_token, expires_in, expiresAt, message, _t2;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              logger.info("Refreshing Exchange OAuth token for user ".concat(_this4.user ? _this4.user.id : "unknown", "..."));
              _context8.n = 1;
              return axios.post(_this4.config.tokenUrl, new URLSearchParams({
                client_id: _this4.config.clientId,
                client_secret: _this4.config.clientSecret,
                grant_type: "refresh_token",
                refresh_token: _this4.config.refreshToken
              }).toString(), {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              });
            case 1:
              response = _context8.v;
              _response$data2 = response.data, access_token = _response$data2.access_token, refresh_token = _response$data2.refresh_token, expires_in = _response$data2.expires_in;
              expiresAt = Date.now() + (expires_in || 3600) * 1000; // Update local config
              _this4.config.oauthToken = access_token;
              if (refresh_token) _this4.config.refreshToken = refresh_token;

              // Update credential target based on auth mode
              if (_this4.authMode === "ews") {
                _this4.service.Credentials = new OAuthCredentials(access_token);
              }

              // Update User in DB
              // Fetch fresh user first just in case
              // Actually we can just update the fields we know
              if (!_this4.user) {
                _context8.n = 3;
                break;
              }
              _this4.user.ExchangeAccessToken = access_token;
              if (refresh_token) _this4.user.ExchangeRefreshToken = refresh_token;
              _this4.user.ExchangeTokenExpiresAt = expiresAt;
              _context8.n = 2;
              return dbService.updateUser(_this4.user);
            case 2:
              _context8.n = 3;
              return logUserEvent(_this4.user.id, "exchange_token_refreshed", "Exchange token \u5237\u65B0\u6210\u529F", {
                expiresAt: new Date(expiresAt).toISOString(),
                expiresIn: expires_in || 3600
              });
            case 3:
              // Also update cache in index.ts if possible, but dbService usually handles persistence.
              // Since user object is passed by reference from index.ts in many cases (userCache), modification here might be enough for memory updates.

              logger.success("Exchange OAuth token refreshed successfully for user ".concat(_this4.user ? _this4.user.id : "unknown"));
              _context8.n = 5;
              break;
            case 4:
              _context8.p = 4;
              _t2 = _context8.v;
              message = _t2 instanceof Error ? _t2.message : String(_t2);
              logger.error("Failed to refresh Exchange token: ".concat(message));
              if (!_this4.user) {
                _context8.n = 5;
                break;
              }
              _context8.n = 5;
              return logUserEvent(_this4.user.id, "exchange_token_refresh_failed", "Exchange token \u5237\u65B0\u5931\u8D25", {
                error: message
              });
            case 5:
              return _context8.a(2);
          }
        }, _callee8, null, [[0, 4]]);
      })), REFRESH_INTERVAL);
    }
  }, {
    key: "ensureAutodiscover",
    value: (function () {
      var _ensureAutodiscover = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var _this5 = this;
        var ewsUrl, _t3;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              if (!(this.authMode === "graph")) {
                _context9.n = 1;
                break;
              }
              return _context9.a(2);
            case 1:
              if (this.service.Url) {
                _context9.n = 7;
                break;
              }
              logger.exchange("执行 Autodiscover 或修正配置的 URL 以查找 EWS 端点...");
              _context9.p = 2;
              if (!this.config.exchangeUrl) {
                _context9.n = 3;
                break;
              }
              ewsUrl = this.config.exchangeUrl; // 确保 URL 指向 EWS 端点
              if (!ewsUrl.toLowerCase().endsWith("/ews/exchange.asmx")) {
                if (!ewsUrl.endsWith("/")) {
                  ewsUrl += "/";
                }
                ewsUrl += "EWS/Exchange.asmx";
              }
              this.service.Url = new Uri(ewsUrl);
              logger.success("\u5DF2\u4F7F\u7528\u4FEE\u6B63\u540E\u7684 EWS URL: ".concat(this.service.Url.AbsoluteUri));
              _context9.n = 5;
              break;
            case 3:
              _context9.n = 4;
              return this.service.AutodiscoverUrl(this.config.username, function (url) {
                return _this5.redirectionUrlValidationCallback(url);
              });
            case 4:
              logger.success("Autodiscover \u6210\u529F\u3002EWS URL \u8BBE\u7F6E\u4E3A: ".concat(this.service.Url && this.service.Url.AbsoluteUri || "未知"));
            case 5:
              _context9.n = 7;
              break;
            case 6:
              _context9.p = 6;
              _t3 = _context9.v;
              logger.error("Autodiscover 或 URL 设置失败: " + (_t3 instanceof Error ? _t3.message : _t3));
              throw _t3;
            case 7:
              return _context9.a(2);
          }
        }, _callee9, this, [[2, 6]]);
      }));
      function ensureAutodiscover() {
        return _ensureAutodiscover.apply(this, arguments);
      }
      return ensureAutodiscover;
    }() // 启动推送通知
    )
  }, {
    key: "startPushNotifications",
    value: function () {
      var _startPushNotifications = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var _this6 = this;
        var inboxFolderId, calendarFolderId, _t5, _t6;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.p = _context1.n) {
            case 0:
              if (!(this.authMode === "graph")) {
                _context1.n = 1;
                break;
              }
              logger.warn("Graph mode does not support current EWS streaming push; skipping push subscription.");
              return _context1.a(2);
            case 1:
              _context1.p = 1;
              _context1.n = 2;
              return this.ensureAutodiscover();
            case 2:
              logger.exchange("启动Exchange推送通知服务...");

              // 停止现有连接
              if (!this.streamingConnection) {
                _context1.n = 3;
                break;
              }
              _context1.n = 3;
              return this.stopPushNotifications();
            case 3:
              _context1.p = 3;
              // 创建流订阅，监听收件箱的新邮件事件和日历的新事件
              inboxFolderId = new FolderId(WellKnownFolderName.Inbox);
              calendarFolderId = new FolderId(WellKnownFolderName.Calendar);
              _context1.n = 4;
              return this.service.SubscribeToStreamingNotifications([inboxFolderId, calendarFolderId], EventType.NewMail, EventType.Created, EventType.Modified);
            case 4:
              this.streamingSubscription = _context1.v;
              logger.exchange("成功创建推送通知订阅（邮件和日历）。");
              _context1.n = 6;
              break;
            case 5:
              _context1.p = 5;
              _t5 = _context1.v;
              logger.error("创建推送通知订阅失败:", _t5.message || "未知错误");
              // 等待更长时间后重试订阅创建
              setTimeout(function () {
                return _this6.startPushNotifications()["catch"](function (err) {});
              }, 10000);
              return _context1.a(2);
            case 6:
              // 创建流连接
              this.streamingConnection = new StreamingSubscriptionConnection(this.service, 30); // 30分钟连接超时

              // 添加订阅
              this.streamingConnection.AddSubscription(this.streamingSubscription);

              // 添加事件处理程序
              this.streamingConnection.OnNotificationEvent.push(/*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(sender, args) {
                  var _t4;
                  return _regenerator().w(function (_context0) {
                    while (1) switch (_context0.p = _context0.n) {
                      case 0:
                        _context0.p = 0;
                        _context0.n = 1;
                        return _this6.handleNotificationEvent(args.Events);
                      case 1:
                        _context0.n = 3;
                        break;
                      case 2:
                        _context0.p = 2;
                        _t4 = _context0.v;
                        logger.error("处理通知事件时出错:", _t4.message || "未知错误");
                      case 3:
                        return _context0.a(2);
                    }
                  }, _callee0, null, [[0, 2]]);
                }));
                return function (_x9, _x0) {
                  return _ref3.apply(this, arguments);
                };
              }());
              this.streamingConnection.OnDisconnect.push(function (sender, args) {
                logger.exchange("推送通知连接已断开。正在尝试重新连接...");
                // 重新连接
                setTimeout(function () {
                  return _this6.startPushNotifications()["catch"](function (err) {
                    return logger.error("重新连接推送通知失败:", err.message || "未知错误");
                  });
                }, 5000);
              });
              this.streamingConnection.OnSubscriptionError.push(function (sender, args) {
                var _args$Exception;
                logger.error("推送通知订阅错误:", ((_args$Exception = args.Exception) === null || _args$Exception === void 0 ? void 0 : _args$Exception.Message) || "未知错误");
                // 订阅错误时也尝试重新连接
                setTimeout(function () {
                  return _this6.startPushNotifications()["catch"](function (err) {});
                }, 5000);
              });

              // 连接并开始监听
              _context1.n = 7;
              return this.streamingConnection.Open();
            case 7:
              logger.success("Exchange推送通知服务已启动并开始监听新邮件。");

              // 启动健康检查
              this.startHealthCheck();
              _context1.n = 9;
              break;
            case 8:
              _context1.p = 8;
              _t6 = _context1.v;
              logger.error("启动Exchange推送通知服务失败:", _t6.message || "未知错误");
              // 5秒后重试
              setTimeout(function () {
                return _this6.startPushNotifications()["catch"](function (err) {});
              }, 5000);
            case 9:
              return _context1.a(2);
          }
        }, _callee1, this, [[3, 5], [1, 8]]);
      }));
      function startPushNotifications() {
        return _startPushNotifications.apply(this, arguments);
      }
      return startPushNotifications;
    }() // 停止推送通知
  }, {
    key: "stopPushNotifications",
    value: function () {
      var _stopPushNotifications = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        var _t7;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _context10.p = 0;
              // 停止健康检查
              this.stopHealthCheck();
              if (!this.streamingConnection) {
                _context10.n = 2;
                break;
              }
              _context10.n = 1;
              return this.streamingConnection.Close();
            case 1:
              this.streamingConnection = null;
            case 2:
              this.streamingSubscription = null;
              logger.exchange("推送通知服务已停止。");
              _context10.n = 4;
              break;
            case 3:
              _context10.p = 3;
              _t7 = _context10.v;
              logger.error("停止推送通知服务时出错:", _t7.message || "未知错误");
            case 4:
              return _context10.a(2);
          }
        }, _callee10, this, [[0, 3]]);
      }));
      function stopPushNotifications() {
        return _stopPushNotifications.apply(this, arguments);
      }
      return stopPushNotifications;
    }() // 停止健康检查
  }, {
    key: "stopHealthCheck",
    value: function stopHealthCheck() {
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
        this.healthCheckTimer = null;
        logger.exchange("推送通知健康检查已停止。");
      }
    }

    // 清理资源（用于应用关闭时）
  }, {
    key: "dispose",
    value: function () {
      var _dispose = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              logger.exchange("开始清理Exchange客户端资源...");
              _context11.n = 1;
              return this.stopPushNotifications();
            case 1:
              logger.success("Exchange客户端资源清理完成。");
            case 2:
              return _context11.a(2);
          }
        }, _callee11, this);
      }));
      function dispose() {
        return _dispose.apply(this, arguments);
      }
      return dispose;
    }() // 处理推送通知事件
  }, {
    key: "handleNotificationEvent",
    value: function () {
      var _handleNotificationEvent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(events) {
        var _this7 = this;
        var _iterator, _step, _loop, _t0;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.p = _context13.n) {
            case 0:
              logger.exchange("\u6536\u5230 ".concat(events.length, " \u4E2A\u901A\u77E5\u4E8B\u4EF6\u3002"));

              // 这里可以根据事件类型进行处理
              _iterator = _createForOfIteratorHelper(events);
              _context13.p = 1;
              _loop = /*#__PURE__*/_regenerator().m(function _loop() {
                var event, uniqueId, itemId, propSet, email, emailData, _t8, _t9;
                return _regenerator().w(function (_context12) {
                  while (1) switch (_context12.p = _context12.n) {
                    case 0:
                      event = _step.value;
                      if (!(event.EventType === EventType.NewMail || event.EventType === EventType.Created)) {
                        _context12.n = 9;
                        break;
                      }
                      if (!event.ItemId) {
                        _context12.n = 9;
                        break;
                      }
                      uniqueId = event.ItemId.UniqueId; // 检查是否最近已处理过
                      if (!_this7.processedMessageIds.has(uniqueId)) {
                        _context12.n = 1;
                        break;
                      }
                      logger.exchange("\u8DF3\u8FC7\u5DF2\u5904\u7406\u7684\u6D88\u606FID: ".concat(uniqueId));
                      return _context12.a(2, 1);
                    case 1:
                      // 添加到已处理集合，并设置过期清理
                      _this7.processedMessageIds.add(uniqueId);
                      setTimeout(function () {
                        return _this7.processedMessageIds["delete"](uniqueId);
                      }, 5 * 60 * 1000); // 5分钟后过期

                      logger.exchange("收到新邮件通知，正在处理...");
                      logger.exchange("\u6B63\u5728\u5904\u7406\u9879\u76EEID: ".concat(JSON.stringify(event.ItemId)));
                      _context12.p = 2;
                      // 创建ItemId对象
                      itemId = new ItemId(uniqueId); // 首先尝试作为邮件处理
                      propSet = new PropertySet(BasePropertySet.FirstClassProperties, [ItemSchema.Body]);
                      _context12.n = 3;
                      return EmailMessage.Bind(_this7.service, itemId, propSet);
                    case 3:
                      email = _context12.v;
                      // 将邮件转换为应用程序格式（包含正文）
                      emailData = _this7.parseEmailFromEWS(email, true); // 调试日志：只记录邮件主题信息
                      logger.exchange("\u90AE\u4EF6\u8BE6\u60C5 - ID: ".concat(emailData.id, ", \u4E3B\u9898: ").concat(emailData.subject));

                      // 触发自动处理逻辑
                      _context12.n = 4;
                      return _this7.autoProcessNewEmail(emailData);
                    case 4:
                      _context12.n = 9;
                      break;
                    case 5:
                      _context12.p = 5;
                      _t8 = _context12.v;
                      _context12.p = 6;
                      _context12.n = 7;
                      return _this7.handleCalendarEvent(uniqueId);
                    case 7:
                      _context12.n = 9;
                      break;
                    case 8:
                      _context12.p = 8;
                      _t9 = _context12.v;
                      logger.error("\u5904\u7406\u9879\u76EE\u65F6\u51FA\u9519\uFF08\u90AE\u4EF6/\u65E5\u5386\uFF09: ".concat(_t8.message || "未知错误"));
                    case 9:
                      return _context12.a(2);
                  }
                }, _loop, null, [[6, 8], [2, 5]]);
              });
              _iterator.s();
            case 2:
              if ((_step = _iterator.n()).done) {
                _context13.n = 5;
                break;
              }
              return _context13.d(_regeneratorValues(_loop()), 3);
            case 3:
              if (!_context13.v) {
                _context13.n = 4;
                break;
              }
              return _context13.a(3, 4);
            case 4:
              _context13.n = 2;
              break;
            case 5:
              _context13.n = 7;
              break;
            case 6:
              _context13.p = 6;
              _t0 = _context13.v;
              _iterator.e(_t0);
            case 7:
              _context13.p = 7;
              _iterator.f();
              return _context13.f(7);
            case 8:
              return _context13.a(2);
          }
        }, _callee12, null, [[1, 6, 7, 8]]);
      }));
      function handleNotificationEvent(_x1) {
        return _handleNotificationEvent.apply(this, arguments);
      }
      return handleNotificationEvent;
    }() // 处理日历事件
  }, {
    key: "handleCalendarEvent",
    value: function () {
      var _handleCalendarEvent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(itemId) {
        var _appointment$Body, _this$user, appointmentId, propSet, appointment, importance, taskData, _err$response, _t1, _t10, _t11;
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.p = _context14.n) {
            case 0:
              _context14.p = 0;
              logger.exchange("\u6536\u5230\u65B0\u65E5\u5386\u4E8B\u4EF6\u901A\u77E5\uFF0C\u6B63\u5728\u5904\u7406\u9879\u76EEID: ".concat(itemId));

              // 创建ItemId对象
              appointmentId = new ItemId(itemId); // 加载日历事件
              propSet = new PropertySet(BasePropertySet.FirstClassProperties, [AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End, AppointmentSchema.Location, AppointmentSchema.Body, AppointmentSchema.RequiredAttendees, AppointmentSchema.Importance, AppointmentSchema.IsReminderSet]);
              _context14.n = 1;
              return Appointment.Bind(this.service, appointmentId, propSet);
            case 1:
              appointment = _context14.v;
              importance = "normal";
              if (appointment.Importance === Importance.High) importance = "high";else if (appointment.Importance === Importance.Low) importance = "low";

              // 将日历事件转换为任务格式
              taskData = {
                id: uuidv4(),
                name: appointment.Subject,
                description: ((_appointment$Body = appointment.Body) === null || _appointment$Body === void 0 ? void 0 : _appointment$Body.Text) || "来自Exchange日历的事件",
                dueDate: toShanghaiISO(appointment.End.ToUniversalTime().ToISOString()),
                startTime: toShanghaiISO(appointment.Start.ToUniversalTime().ToISOString()),
                endTime: toShanghaiISO(appointment.End.ToUniversalTime().ToISOString()),
                location: appointment.Location || "",
                completed: false,
                pushedToMSTodo: false,
                scheduleType: "single",
                importance: importance,
                isReminderOn: appointment.IsReminderSet
              };
              logger.exchange("\u65E5\u5386\u4E8B\u4EF6\u8BE6\u60C5 - \u4E3B\u9898: ".concat(taskData.name, ", \u5F00\u59CB\u65F6\u95F4: ").concat(taskData.startTime, ", \u7ED3\u675F\u65F6\u95F4: ").concat(taskData.endTime));

              // 检查用户是否有MS token
              if ((_this$user = this.user) !== null && _this$user !== void 0 && _this$user.MStoken) {
                _context14.n = 2;
                break;
              }
              logger.warn("用户未绑定MS账户，无法将日历事件推送到MS Todo");
              return _context14.a(2);
            case 2:
              _context14.p = 2;
              _context14.n = 3;
              return createTodoItem(taskData, this.user.MStoken);
            case 3:
              logger.success("\u5DF2\u6210\u529F\u5C06\u65E5\u5386\u4E8B\u4EF6\u6DFB\u52A0\u5230MS Todo: ".concat(taskData.name));
              _context14.n = 11;
              break;
            case 4:
              _context14.p = 4;
              _t1 = _context14.v;
              if (!(((_err$response = _t1.response) === null || _err$response === void 0 ? void 0 : _err$response.status) === 401)) {
                _context14.n = 10;
                break;
              }
              if (!this.user) {
                _context14.n = 10;
                break;
              }
              this.user.MStoken = "";
              // 不清除 MSbinded
              _context14.p = 5;
              _context14.n = 6;
              return import("./dbService.js");
            case 6:
              _context14.n = 7;
              return _context14.v.dbService.updateUser(this.user);
            case 7:
              _context14.n = 9;
              break;
            case 8:
              _context14.p = 8;
              _t10 = _context14.v;
            case 9:
              logger.error("MS Graph 401 detected; cleared MStoken for user ".concat(this.user.id));
            case 10:
              throw _t1;
            case 11:
              _context14.n = 13;
              break;
            case 12:
              _context14.p = 12;
              _t11 = _context14.v;
              logger.error("\u5904\u7406\u65E5\u5386\u4E8B\u4EF6\u65F6\u51FA\u9519: ".concat(_t11.message || "未知错误"));
            case 13:
              return _context14.a(2);
          }
        }, _callee13, this, [[5, 8], [2, 4], [0, 12]]);
      }));
      function handleCalendarEvent(_x10) {
        return _handleCalendarEvent.apply(this, arguments);
      }
      return handleCalendarEvent;
    }() // 自动处理新邮件
  }, {
    key: "autoProcessNewEmail",
    value: function () {
      var _autoProcessNewEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(email) {
        var _this$user2, _this$user3, alreadyProcessed, apiResponse, _t12, _t13;
        return _regenerator().w(function (_context15) {
          while (1) switch (_context15.p = _context15.n) {
            case 0:
              _context15.p = 0;
              if (!((_this$user2 = this.user) !== null && _this$user2 !== void 0 && _this$user2.id && email.id)) {
                _context15.n = 2;
                break;
              }
              _context15.n = 1;
              return dbService.isEmailAiProcessed(this.user.id, String(email.id), "exchange");
            case 1:
              alreadyProcessed = _context15.v;
              if (!alreadyProcessed) {
                _context15.n = 2;
                break;
              }
              logger.exchange("\u90AE\u4EF6 ".concat(email.id, " (").concat(email.subject, ") \u5DF2 AI \u5904\u7406\u8FC7\uFF0C\u8DF3\u8FC7"));
              return _context15.a(2);
            case 2:
              logger.exchange("\u5F00\u59CB\u81EA\u52A8\u5904\u7406\u90AE\u4EF6: ".concat(email.subject));

              // 调试日志：只检查邮件正文是否存在，不输出内容
              if (!email.body) {
                logger.warn("\u90AE\u4EF6\u6B63\u6587\u4E3A\u7A7A: ".concat(email.subject));
              }

              // 接入OpenAI API
              _context15.n = 3;
              return this.callLLMAPI(email);
            case 3:
              apiResponse = _context15.v;
              _context15.n = 4;
              return this.handleProcessedData(apiResponse, email);
            case 4:
              if (!((_this$user3 = this.user) !== null && _this$user3 !== void 0 && _this$user3.id && email.id)) {
                _context15.n = 8;
                break;
              }
              _context15.p = 5;
              _context15.n = 6;
              return dbService.markEmailAiProcessed(this.user.id, String(email.id), "exchange");
            case 6:
              _context15.n = 8;
              break;
            case 7:
              _context15.p = 7;
              _t12 = _context15.v;
              logger.error("\u6807\u8BB0 Exchange AI \u5DF2\u5904\u7406\u5931\u8D25: ".concat(_t12.message || "未知错误"));
            case 8:
              logger.success("\u6210\u529F\u81EA\u52A8\u5904\u7406\u90AE\u4EF6: ".concat(email.subject));
              _context15.n = 10;
              break;
            case 9:
              _context15.p = 9;
              _t13 = _context15.v;
              logger.error("\u81EA\u52A8\u5904\u7406\u90AE\u4EF6\u65F6\u51FA\u9519: ".concat(_t13.message || "未知错误"));
              // 错误处理和重试机制
              this.handleProcessingError(_t13, email);
            case 10:
              return _context15.a(2);
          }
        }, _callee14, this, [[5, 7], [0, 9]]);
      }));
      function autoProcessNewEmail(_x11) {
        return _autoProcessNewEmail.apply(this, arguments);
      }
      return autoProcessNewEmail;
    }() // 处理处理邮件时的错误，实现重试机制
  }, {
    key: "handleProcessingError",
    value: function handleProcessingError(error, email) {
      var _this8 = this;
      var retryCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var maxRetries = 3;
      if (retryCount < maxRetries) {
        var retryDelay = Math.pow(2, retryCount) * 5000; // 指数退避策略
        logger.exchange("\u5C06\u5728 ".concat(retryDelay / 1000, " \u79D2\u540E\u91CD\u8BD5\u5904\u7406\u90AE\u4EF6: ").concat(email.subject, " (\u91CD\u8BD5 ").concat(retryCount + 1, "/").concat(maxRetries, ")"));
        setTimeout(function () {
          _this8.autoProcessNewEmail(email)["catch"](function () {
            _this8.handleProcessingError(error, email, retryCount + 1);
          });
        }, retryDelay);
      } else {
        logger.error("\u90AE\u4EF6\u5904\u7406\u5931\u8D25\uFF0C\u5DF2\u8FBE\u5230\u6700\u5927\u91CD\u8BD5\u6B21\u6570: ".concat(email.subject));
        // 将失败的邮件记录到日志，便于后续手动处理
        this.logFailedEmail(email, error);
      }
    }

    // 记录处理失败的邮件
  }, {
    key: "logFailedEmail",
    value: function logFailedEmail(email, error) {
      try {
        var failureLog = {
          timestamp: toShanghaiISO(),
          emailId: email.id,
          subject: email.subject,
          from: email.from,
          receivedAt: email.receivedAt,
          error: error.message || JSON.stringify(error),
          errorStack: error.stack
        };
        logger.error("记录失败邮件:", JSON.stringify(failureLog, null, 2));

        // 这里可以扩展为将失败记录存储到数据库或文件系统
      } catch (logError) {
        logger.error("记录失败邮件时出错:", logError);
      }
    }

    // 接入OpenAI API
  }, {
    key: "callLLMAPI",
    value: function () {
      var _callLLMAPI = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(email) {
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              if (this.llmApi) {
                _context16.n = 1;
                break;
              }
              throw new Error("LLM API 客户端未初始化");
            case 1:
              return _context16.a(2, this.llmApi.processEmail(email));
          }
        }, _callee15, this);
      }));
      function callLLMAPI(_x12) {
        return _callLLMAPI.apply(this, arguments);
      }
      return callLLMAPI;
    }() // 触发后续处理逻辑（与 emailProcessor 对齐：校验失败不入队；按工具名分日程/待办）
  }, {
    key: "handleProcessedData",
    value: function () {
      var _handleProcessedData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(processedData, email) {
        var _yield$import, _logUserEvent, _ref4, _yield$import2, enqueueValidatedToolCalls, attachmentsCount, emailForProc, enqueued, _t14, _t15, _t16;
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.p = _context17.n) {
            case 0:
              if (!(processedData !== null && processedData !== void 0 && processedData.validationFailed)) {
                _context17.n = 6;
                break;
              }
              logger.error("Exchange \u90AE\u4EF6\u5DE5\u5177/\u65F6\u95F4\u6821\u9A8C\u5931\u8D25: ".concat(email.subject, " \u2014 ").concat(processedData.lastValidationError || ""));
              if (!this.user) {
                _context17.n = 5;
                break;
              }
              _context17.p = 1;
              _context17.n = 2;
              return import("./userLog.js");
            case 2:
              _yield$import = _context17.v;
              _logUserEvent = _yield$import.logUserEvent;
              _context17.n = 3;
              return _logUserEvent(this.user.id, "ai_email_tool_validation_failed", "AI \u5904\u7406\u90AE\u4EF6\u5DE5\u5177/\u65F6\u95F4\u6821\u9A8C\u5931\u8D25: ".concat(email.subject), {
                emailId: email.id,
                emailSubject: email.subject,
                source: "exchange",
                lastValidationError: processedData.lastValidationError,
                lastToolCalls: processedData.lastToolCalls
              });
            case 3:
              _context17.n = 5;
              break;
            case 4:
              _context17.p = 4;
              _t14 = _context17.v;
            case 5:
              _context17.n = 12;
              break;
            case 6:
              if (!(!processedData.tool_calls || processedData.tool_calls.length === 0)) {
                _context17.n = 7;
                break;
              }
              logger.exchange("\u672A\u89E6\u53D1\u4EFB\u4F55\u5DE5\u5177\u8C03\u7528");
              _context17.n = 12;
              break;
            case 7:
              if (!this.user) {
                _context17.n = 12;
                break;
              }
              _context17.p = 8;
              _context17.n = 9;
              return import("./emailProcessor.js");
            case 9:
              _yield$import2 = _context17.v;
              enqueueValidatedToolCalls = _yield$import2.enqueueValidatedToolCalls;
              attachmentsCount = (_ref4 = email.attachments && email.attachments.Count) !== null && _ref4 !== void 0 ? _ref4 : Array.isArray(email.attachments) ? email.attachments.length : 0;
              emailForProc = {
                id: email.id,
                subject: email.subject,
                from: email.from,
                receivedAt: email.receivedAt,
                isRead: email.isRead,
                body: this.cleanHtmlContent(email.body || ""),
                hasAttachments: !!email.hasAttachments,
                attachmentsCount: attachmentsCount
              };
              _context17.n = 10;
              return enqueueValidatedToolCalls(this.user, emailForProc, "exchange", processedData.tool_calls);
            case 10:
              enqueued = _context17.v;
              logger.success("Exchange \u90AE\u4EF6\u5165\u961F: \u65E5\u7A0B ".concat(enqueued.queuedSchedules.length, " / \u5F85\u529E ").concat(enqueued.queuedTodos.length));
              _context17.n = 12;
              break;
            case 11:
              _context17.p = 11;
              _t15 = _context17.v;
              logger.error("Exchange \u90AE\u4EF6\u5165\u961F\u5931\u8D25: ".concat((_t15 === null || _t15 === void 0 ? void 0 : _t15.message) || _t15));
            case 12:
              _context17.p = 12;
              _context17.n = 13;
              return this.markSystem.addAIReadTagToEmail(email.id);
            case 13:
              logger.success("\u5DF2\u5C06\u90AE\u4EF6\u6807\u8BB0\u4E3AAI\u5DF2\u8BFB: ".concat(email.subject));
              _context17.n = 15;
              break;
            case 14:
              _context17.p = 14;
              _t16 = _context17.v;
              logger.error("\u6807\u8BB0\u90AE\u4EF6\u4E3AAI\u5DF2\u8BFB\u5931\u8D25: ".concat(_t16.message || "未知错误"));
            case 15:
              return _context17.a(2);
          }
        }, _callee16, this, [[12, 14], [8, 11], [1, 4]]);
      }));
      function handleProcessedData(_x13, _x14) {
        return _handleProcessedData.apply(this, arguments);
      }
      return handleProcessedData;
    }() // 健康检查定时
    // 启动健康检查
  }, {
    key: "startHealthCheck",
    value: function startHealthCheck() {
      var _this9 = this;
      // 清除现有的健康检查
      if (this.healthCheckTimer) {
        clearInterval(this.healthCheckTimer);
      }

      // 每30分钟执行一次健康检查
      this.healthCheckTimer = setInterval(function () {
        _this9.performHealthCheck()["catch"](function (err) {
          logger.error("健康检查失败:", err.message || "未知错误");
          // 健康检查失败时尝试重启连接
          _this9.restartConnection();
        });
      }, 30 * 60 * 1000);
      logger.exchange("推送通知健康检查已启动。");
    }

    // 执行健康检查
  }, {
    key: "performHealthCheck",
    value: function () {
      var _performHealthCheck = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
        var _t17;
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.p = _context18.n) {
            case 0:
              _context18.p = 0;
              logger.exchange("执行推送通知健康检查...");

              // 检查连接状态
              if (!(this.streamingConnection && this.streamingConnection.IsOpen)) {
                _context18.n = 1;
                break;
              }
              logger.exchange("推送通知连接状态正常。");
              return _context18.a(2, true);
            case 1:
              throw new Error("推送通知连接已关闭");
            case 2:
              _context18.n = 4;
              break;
            case 3:
              _context18.p = 3;
              _t17 = _context18.v;
              logger.error("健康检查检测到异常:", _t17 || "未知错误");
              throw _t17;
            case 4:
              return _context18.a(2);
          }
        }, _callee17, this, [[0, 3]]);
      }));
      function performHealthCheck() {
        return _performHealthCheck.apply(this, arguments);
      }
      return performHealthCheck;
    }() // 重启推送通知连接
  }, {
    key: "restartConnection",
    value: function () {
      var _restartConnection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
        var _this0 = this;
        var _t18;
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.p = _context19.n) {
            case 0:
              logger.exchange("正在重启推送通知连接...");
              _context19.p = 1;
              _context19.n = 2;
              return this.stopPushNotifications();
            case 2:
              // 短暂延迟后重新启动
              setTimeout(function () {
                _this0.startPushNotifications()["catch"](function (err) {
                  logger.error("重启推送通知连接失败:", err.message || "未知错误");
                });
              }, 2000);
              _context19.n = 4;
              break;
            case 3:
              _context19.p = 3;
              _t18 = _context19.v;
              logger.error("重启连接过程中出错:", _t18 || "未知错误");
            case 4:
              return _context19.a(2);
          }
        }, _callee18, this, [[1, 3]]);
      }));
      function restartConnection() {
        return _restartConnection.apply(this, arguments);
      }
      return restartConnection;
    }()
    /**
     * Autodiscover 重定向验证回调
     */
  }, {
    key: "redirectionUrlValidationCallback",
    value: function redirectionUrlValidationCallback(redirectionUrl) {
      logger.data("[EWS-REDIRECT] Autodiscover \u5C1D\u8BD5\u91CD\u5B9A\u5411\u5230: ".concat(redirectionUrl));
      // 简单的验证：允许所有 https 重定向。在生产环境中应更严格。
      var isValid = new Uri(redirectionUrl).Scheme.toLowerCase() === "https";
      logger.data("[EWS-REDIRECT] \u91CD\u5B9A\u5411URL\u9A8C\u8BC1\u7ED3\u679C: ".concat(isValid ? "有效" : "无效"));
      return isValid;
    }

    /**
     * 获取未读邮件
     * @param top - 要获取的邮件数量
     * @returns 邮件数组
     */
  }, {
    key: "getUnreadEmails",
    value: (function () {
      var _getUnreadEmails = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
        var top,
          searchFilter,
          _args20 = arguments;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.n) {
            case 0:
              top = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : 10;
              if (!(this.authMode === "graph")) {
                _context20.n = 1;
                break;
              }
              logger.exchange("Graph\u6A21\u5F0F\uFF1A\u5F00\u59CB\u83B7\u53D6 ".concat(top, " \u5C01\u672A\u8BFB\u90AE\u4EF6..."));
              return _context20.a(2, this.graphGetMessages(top, true));
            case 1:
              _context20.n = 2;
              return this.ensureAutodiscover();
            case 2:
              logger.exchange("\u5F00\u59CB\u83B7\u53D6 ".concat(top, " \u5C01\u672A\u8BFB\u90AE\u4EF6..."));

              // 创建过滤器，仅获取未读邮件
              searchFilter = new SearchFilter.IsEqualTo(EmailMessageSchema.IsRead, false);
              return _context20.a(2, this.findEmails(top, searchFilter));
          }
        }, _callee19, this);
      }));
      function getUnreadEmails() {
        return _getUnreadEmails.apply(this, arguments);
      }
      return getUnreadEmails;
    }())
  }, {
    key: "findEmails",
    value: function () {
      var _findEmails = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
        var _this1 = this;
        var top,
          searchFilter,
          view,
          findResults,
          emails,
          _args21 = arguments,
          _t19,
          _t20;
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.p = _context21.n) {
            case 0:
              top = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : 10;
              searchFilter = _args21.length > 1 ? _args21[1] : undefined;
              if (!(this.authMode === "graph")) {
                _context21.n = 1;
                break;
              }
              if (searchFilter) {
                logger.warn("Graph模式暂不支持 EWS SearchFilter，已忽略该筛选条件。");
              }
              return _context21.a(2, this.graphGetMessages(top, false));
            case 1:
              // 创建视图，限制结果数量
              view = new ItemView(top); // 定义要加载的属性（不包含正文，因为Body不能在FindItem请求中使用）
              view.PropertySet = new PropertySet(BasePropertySet.FirstClassProperties, [ItemSchema.Subject, ItemSchema.DateTimeReceived, EmailMessageSchema.From, EmailMessageSchema.IsRead]);
              _context21.p = 2;
              if (!searchFilter) {
                _context21.n = 4;
                break;
              }
              _context21.n = 3;
              return this.service.FindItems(WellKnownFolderName.Inbox, searchFilter, view);
            case 3:
              _t19 = _context21.v;
              _context21.n = 6;
              break;
            case 4:
              _context21.n = 5;
              return this.service.FindItems(WellKnownFolderName.Inbox, view);
            case 5:
              _t19 = _context21.v;
            case 6:
              findResults = _t19;
              logger.success("\u6210\u529F\u83B7\u53D6\u5230 ".concat(findResults.TotalCount, " \u5C01\u90AE\u4EF6\u3002"));
              if (!(findResults.Items.length === 0)) {
                _context21.n = 7;
                break;
              }
              return _context21.a(2, []);
            case 7:
              // 将 EWS item 转换为我们的 IEmail 格式（不包含正文，将在需要时单独获取）
              emails = findResults.Items.map(function (item) {
                return _this1.parseEmailFromEWS(item, false);
              }); // 按接收时间降序排序（最新邮件在前）
              emails.sort(function (a, b) {
                return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
              });

              // 调试日志：只记录邮件主题信息
              emails.forEach(function (email, index) {
                logger.exchange("\u90AE\u4EF6 ".concat(index + 1, ": ID=").concat(email.id, ", \u4E3B\u9898=\"").concat(email.subject, "\""));
              });
              return _context21.a(2, emails);
            case 8:
              _context21.p = 8;
              _t20 = _context21.v;
              logger.error("获取邮件失败: " + (_t20 instanceof Error ? _t20.message : _t20));
              // 打印更详细的错误信息
              if (_t20 && _typeof(_t20) === "object") {
                logger.data("详细错误: " + JSON.stringify(_t20, Object.getOwnPropertyNames(_t20), 2));
              }
              throw _t20;
            case 9:
              return _context21.a(2);
          }
        }, _callee20, this, [[2, 8]]);
      }));
      function findEmails() {
        return _findEmails.apply(this, arguments);
      }
      return findEmails;
    }()
    /**
     * 根据 ID 获取单个邮件详情
     * @param itemId - 邮件 ID
     * @returns 邮件详情
     */
  }, {
    key: "getEmailById",
    value: (function () {
      var _getEmailById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(itemId) {
        var propSet, email;
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.n) {
            case 0:
              if (!(this.authMode === "graph")) {
                _context22.n = 1;
                break;
              }
              logger.exchange("Graph\u6A21\u5F0F\uFF1A\u6B63\u5728\u83B7\u53D6 ID \u4E3A ".concat(itemId, " \u7684\u90AE\u4EF6..."));
              return _context22.a(2, this.graphGetMessageById(itemId));
            case 1:
              _context22.n = 2;
              return this.ensureAutodiscover();
            case 2:
              logger.exchange("\u6B63\u5728\u83B7\u53D6 ID \u4E3A ".concat(itemId, " \u7684\u90AE\u4EF6..."));
              propSet = new PropertySet(BasePropertySet.FirstClassProperties, [ItemSchema.Body]);
              _context22.n = 3;
              return EmailMessage.Bind(this.service, new ItemId(itemId), propSet);
            case 3:
              email = _context22.v;
              logger.success("\u6210\u529F\u83B7\u53D6\u90AE\u4EF6: ".concat(email.Subject));
              return _context22.a(2, this.parseEmailFromEWS(email, true));
          }
        }, _callee21, this);
      }));
      function getEmailById(_x15) {
        return _getEmailById.apply(this, arguments);
      }
      return getEmailById;
    }()
    /**
     * 清理HTML内容，移除可能导致XML验证失败的标签
     * @param htmlContent - HTML内容
     * @returns 清理后的纯文本内容
     */
    )
  }, {
    key: "cleanHtmlContent",
    value: function cleanHtmlContent(htmlContent) {
      if (!htmlContent) return "";
      try {
        // 移除HTML标签但保留文本内容
        var cleaned = htmlContent
        // 移除script, style, head标签及其内容
        .replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<style\b[\s\S]*?<\/style>/gi, "").replace(/<head\b[\s\S]*?<\/head>/gi, "")
        // 移除所有其他HTML标签
        .replace(/<[^>]+>/g, " ")
        // 替换常见HTML实体
        .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

        // 移除多余的空白字符
        cleaned = cleaned.replace(/\s+/g, " ");
        logger.exchange("HTML\u5185\u5BB9\u6E05\u7406\u5B8C\u6210\uFF0C\u539F\u59CB\u957F\u5EA6: ".concat(htmlContent.length, ", \u6E05\u7406\u540E\u957F\u5EA6: ").concat(cleaned.length));
        return cleaned;
      } catch (error) {
        logger.warn("\u6E05\u7406HTML\u5185\u5BB9\u65F6\u51FA\u9519:", error);
        // 如果清理失败，返回原始内容的简单版本
        return htmlContent.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      }
    }

    /**
     * 创建日历事件
     * @param eventData - 事件数据
     * @returns 创建的事件
     */
  }, {
    key: "createEvent",
    value: (function () {
      var _createEvent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(eventData) {
        var payload, response, appointment, cleanedBody, _t21, _t22;
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.p = _context23.n) {
            case 0:
              if (!(this.authMode === "graph")) {
                _context23.n = 2;
                break;
              }
              logger.exchange("Graph\u6A21\u5F0F\uFF1A\u6B63\u5728\u521B\u5EFA\u65E5\u5386\u4E8B\u4EF6: ".concat(eventData.subject));
              payload = {
                subject: eventData.subject,
                body: {
                  contentType: "HTML",
                  content: eventData.body || ""
                },
                start: this.toGraphDateTime(eventData.start),
                end: this.toGraphDateTime(eventData.end),
                location: eventData.location ? {
                  displayName: eventData.location
                } : undefined,
                attendees: (eventData.attendees || []).map(function (attendee) {
                  return {
                    emailAddress: {
                      address: attendee
                    },
                    type: "required"
                  };
                }),
                importance: eventData.importance || "normal",
                isReminderOn: eventData.isReminderOn
              };
              _context23.n = 1;
              return axios.post("".concat(ExchangeClient.GRAPH_BASE_URL, "/me/events"), payload, {
                headers: this.getGraphHeaders()
              });
            case 1:
              response = _context23.v;
              return _context23.a(2, response.data);
            case 2:
              _context23.n = 3;
              return this.ensureAutodiscover();
            case 3:
              logger.exchange("\u6B63\u5728\u521B\u5EFA\u65E5\u5386\u4E8B\u4EF6: ".concat(eventData.subject));
              _context23.p = 4;
              appointment = new Appointment(this.service);
              appointment.Subject = eventData.subject;

              // 安全地设置正文内容，先清理HTML
              if (eventData.body) {
                cleanedBody = this.cleanHtmlContent(eventData.body);
                appointment.Body = new MessageBody(cleanedBody);
                logger.exchange("\u4E8B\u4EF6\u6B63\u6587\u5DF2\u6E05\u7406\uFF0C\u957F\u5EA6: ".concat(cleanedBody.length));
              } else {
                appointment.Body = new MessageBody("");
              }
              appointment.Start = new DateTime(eventData.start);
              appointment.End = new DateTime(eventData.end);
              appointment.Location = eventData.location || "";

              // 设置重要性
              if (!eventData.importance) {
                _context23.n = 8;
                break;
              }
              _t21 = eventData.importance;
              _context23.n = _t21 === "high" ? 5 : _t21 === "low" ? 6 : 7;
              break;
            case 5:
              appointment.Importance = Importance.High;
              return _context23.a(3, 8);
            case 6:
              appointment.Importance = Importance.Low;
              return _context23.a(3, 8);
            case 7:
              appointment.Importance = Importance.Normal;
            case 8:
              // 设置提醒
              if (eventData.isReminderOn !== undefined) {
                appointment.IsReminderSet = eventData.isReminderOn;
              }

              // 安全地添加与会者
              if (eventData.attendees && eventData.attendees.length > 0) {
                eventData.attendees.forEach(function (email) {
                  try {
                    appointment.RequiredAttendees.Add(email);
                  } catch (attendeeError) {
                    logger.warn("\u6DFB\u52A0\u4E0E\u4F1A\u8005 ".concat(email, " \u5931\u8D25:"), attendeeError);
                  }
                });
              }
              _context23.n = 9;
              return appointment.Save(SendInvitationsMode.SendToAllAndSaveCopy);
            case 9:
              logger.success("\u65E5\u5386\u4E8B\u4EF6 \"".concat(eventData.subject, "\" \u521B\u5EFA\u6210\u529F\u3002"));
              return _context23.a(2, appointment);
            case 10:
              _context23.p = 10;
              _t22 = _context23.v;
              logger.error("\u521B\u5EFA\u65E5\u5386\u4E8B\u4EF6\u5931\u8D25:", _t22);
              throw _t22;
            case 11:
              return _context23.a(2);
          }
        }, _callee22, this, [[4, 10]]);
      }));
      function createEvent(_x16) {
        return _createEvent.apply(this, arguments);
      }
      return createEvent;
    }()
    /**
     * 获取指定时间范围内的日历事件
     * @param startDate - 开始日期
     * @param endDate - 结束日期
     * @returns 事件数组
     */
    )
  }, {
    key: "getEvents",
    value: (function () {
      var _getEvents = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(startDate, endDate) {
        var _this10 = this;
        var start, end, calendarView, findResults, _t23;
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.p = _context24.n) {
            case 0:
              if (!(this.authMode === "graph")) {
                _context24.n = 1;
                break;
              }
              logger.exchange("Graph\u6A21\u5F0F\uFF1A\u6B63\u5728\u83B7\u53D6\u4ECE ".concat(startDate, " \u5230 ").concat(endDate, " \u7684\u65E5\u5386\u4E8B\u4EF6..."));
              return _context24.a(2, this.graphGetEvents(startDate, endDate));
            case 1:
              _context24.n = 2;
              return this.ensureAutodiscover();
            case 2:
              logger.exchange("\u6B63\u5728\u83B7\u53D6\u4ECE ".concat(startDate, " \u5230 ").concat(endDate, " \u7684\u65E5\u5386\u4E8B\u4EF6..."));
              start = new DateTime(startDate);
              end = new DateTime(endDate);
              calendarView = new CalendarView(start, end, 100); // 最多获取100个事件
              calendarView.PropertySet = new PropertySet(BasePropertySet.IdOnly, [AppointmentSchema.Subject, AppointmentSchema.Start, AppointmentSchema.End, AppointmentSchema.Location, AppointmentSchema.Importance, AppointmentSchema.IsReminderSet]);
              _context24.p = 3;
              _context24.n = 4;
              return this.service.FindAppointments(WellKnownFolderName.Calendar, calendarView);
            case 4:
              findResults = _context24.v;
              logger.success("\u6210\u529F\u83B7\u53D6\u5230 ".concat(findResults.TotalCount, " \u4E2A\u65E5\u5386\u4E8B\u4EF6\u3002"));
              return _context24.a(2, findResults.Items.map(function (item) {
                return _this10.parseEventFromEWS(item);
              }));
            case 5:
              _context24.p = 5;
              _t23 = _context24.v;
              logger.error("获取日历事件失败: " + (_t23 instanceof Error ? _t23.message : _t23));
              // 打印更详细的错误信息
              if (_t23 && _typeof(_t23) === "object") {
                logger.data("详细错误: " + JSON.stringify(_t23, Object.getOwnPropertyNames(_t23), 2));
              }
              throw _t23;
            case 6:
              return _context24.a(2);
          }
        }, _callee23, this, [[3, 5]]);
      }));
      function getEvents(_x17, _x18) {
        return _getEvents.apply(this, arguments);
      }
      return getEvents;
    }()
    /**
     * 将 EWS EmailMessage 对象解析为 IEmail 格式
     */
    )
  }, {
    key: "parseEmailFromEWS",
    value: function parseEmailFromEWS(email) {
      var _email$Body;
      var includeBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var from = email.From;
      var bodyText = includeBody ? this.cleanHtmlContent(((_email$Body = email.Body) === null || _email$Body === void 0 ? void 0 : _email$Body.Text) || "") : undefined;

      // 读取 EWS 标记状态
      var isFlagged = false;
      var ewsFlags = [];
      try {
        if (email.IsRead) ewsFlags.push("\\Seen");
        // EWS 中 Flag.FlagStatus 表示后续标记（红旗）
        if (email.Flag && email.Flag.FlagStatus === "Flagged") {
          isFlagged = true;
          ewsFlags.push("\\Flagged");
        }
      } catch (_unused3) {
        // Flag 属性可能不可用
      }
      return {
        id: email.Id.UniqueId,
        subject: email.Subject,
        from: from ? {
          name: from.Name,
          address: from.Address
        } : undefined,
        receivedAt: toShanghaiISO(email.DateTimeReceived.MomentDate.toISOString()),
        isRead: email.IsRead,
        isFlagged: isFlagged,
        flags: ewsFlags,
        isAiProcessed: false,
        body: bodyText,
        hasAttachments: email.HasAttachments,
        attachments: email.Attachments
      };
    }

    /**
     * 将 EWS Appointment 对象解析为 IEvent 格式
     */
  }, {
    key: "parseEventFromEWS",
    value: function parseEventFromEWS(appointment) {
      var importance = "normal";
      try {
        if (appointment.Importance === Importance.High) importance = "high";else if (appointment.Importance === Importance.Low) importance = "low";
      } catch (e) {
        // Property might not be loaded
      }
      var isReminderOn = false;
      try {
        isReminderOn = appointment.IsReminderSet;
      } catch (e) {
        // Property might not be loaded
      }
      return {
        id: appointment.Id.UniqueId,
        subject: appointment.Subject,
        start: toShanghaiISO(appointment.Start.MomentDate.toISOString()),
        end: toShanghaiISO(appointment.End.MomentDate.toISOString()),
        location: appointment.Location,
        importance: importance,
        isReminderOn: isReminderOn
      };
    }
  }]);
}();
_defineProperty(ExchangeClient, "GRAPH_BASE_URL", "https://graph.microsoft.com/v1.0");