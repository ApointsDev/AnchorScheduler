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
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(r) { var n = this.s["return"]; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, "throw": function _throw(r) { var n = this.s["return"]; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { logger } from "../Utils/logger.js";
import toShanghaiISO from "../Utils/time.js";
export var ImapClient = /*#__PURE__*/function () {
  function ImapClient(config) {
    _classCallCheck(this, ImapClient);
    _defineProperty(this, "client", null);
    _defineProperty(this, "processedMessageIds", new Set());
    _defineProperty(this, "idleRunning", false);
    _defineProperty(this, "onNewEmail", null);
    _defineProperty(this, "reconnectTimer", null);
    _defineProperty(this, "shouldStop", false);
    this.config = config;
    logger.info("IMAP client configured for ".concat(config.username, "@").concat(config.host, ":").concat(config.port, " (TLS: ").concat(config.tls, ")"));
  }
  return _createClass(ImapClient, [{
    key: "ensureConnected",
    value: function () {
      var _ensureConnected = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var auth, authMethod, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!(this.client && this.client.usable)) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              // 清理上一个失败的 client（防止孤儿 socket 事件）
              if (this.client) {
                this.client.removeAllListeners();
                try {
                  this.client.close();
                } catch (_unused) {
                  /* ignore */
                }
                this.client = null;
              }

              // CAF OIDC 用户使用 XOAUTH2 认证
              auth = this.config.useOAuth ? {
                user: this.config.username,
                accessToken: this.config.password
              } : {
                user: this.config.username,
                pass: this.config.password
              };
              this.client = new ImapFlow({
                host: this.config.host,
                port: this.config.port,
                secure: this.config.tls,
                auth: auth,
                logger: false,
                connectionTimeout: 10000,
                greetingTimeout: 15000,
                socketTimeout: 120000
              });

              // 必须监听 error 事件，防止 socket 超时等异常成为 uncaught exception
              this.client.on("error", function (err) {
                logger.debug("IMAP client socket error: ".concat(err.message || String(err)));
              });
              authMethod = this.config.useOAuth ? "XOAUTH2" : "password";
              logger.info("\u6B63\u5728\u8FDE\u63A5 IMAP \u670D\u52A1\u5668 (".concat(authMethod, "): ").concat(this.config.host, ":").concat(this.config.port));
              _context.p = 2;
              _context.n = 3;
              return this.client.connect();
            case 3:
              _context.n = 5;
              break;
            case 4:
              _context.p = 4;
              _t = _context.v;
              // connect 失败时清理 client，避免孤儿事件
              this.client.removeAllListeners();
              try {
                this.client.close();
              } catch (_unused2) {
                /* ignore */
              }
              this.client = null;
              throw _t;
            case 5:
              logger.success("IMAP \u8FDE\u63A5\u6210\u529F: ".concat(this.config.host));
            case 6:
              return _context.a(2);
          }
        }, _callee, this, [[2, 4]]);
      }));
      function ensureConnected() {
        return _ensureConnected.apply(this, arguments);
      }
      return ensureConnected;
    }()
  }, {
    key: "startIdle",
    value: function () {
      var _startIdle = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(callback) {
        var _this = this;
        var mailbox, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              this.onNewEmail = callback;
              this.shouldStop = false;
              this.idleRunning = true;
              _context2.p = 1;
              _context2.n = 2;
              return this.ensureConnected();
            case 2:
              _context2.n = 3;
              return this.client.mailboxOpen("INBOX");
            case 3:
              mailbox = _context2.v;
              logger.info("IMAP IDLE \u5F00\u59CB\u76D1\u542C INBOX\uFF0C\u5F53\u524D\u6D88\u606F\u6570: ".concat(mailbox.exists));
              this.client.on("exists", function (event) {
                if (event.path.toUpperCase() === "INBOX") {
                  var newCount = event.count - event.prevCount;
                  logger.info("IMAP IDLE \u68C0\u6D4B\u5230\u65B0\u90AE\u4EF6\uFF0CINBOX: ".concat(event.prevCount, " -> ").concat(event.count, " (+").concat(newCount, ")"));
                  _this.handleNewMessages()["catch"](function (err) {
                    logger.error("\u5904\u7406\u65B0\u90AE\u4EF6\u65F6\u51FA\u9519: ".concat(err.message || "未知错误"));
                  });
                }
              });
              this.client.on("close", function () {
                _this.idleRunning = false;
                if (_this.shouldStop) return;
                logger.warn("IMAP \u8FDE\u63A5\u65AD\u5F00\uFF0C10\u79D2\u540E\u91CD\u8FDE...");
                _this.reconnectTimer = setTimeout(function () {
                  _this.startIdle(_this.onNewEmail)["catch"](function (err) {
                    logger.error("IMAP IDLE \u91CD\u8FDE\u5931\u8D25: ".concat(err.message || "未知错误"));
                  });
                }, 10000);
              });
              _context2.n = 6;
              break;
            case 4:
              _context2.p = 4;
              _t2 = _context2.v;
              this.idleRunning = false;
              if (!this.shouldStop) {
                _context2.n = 5;
                break;
              }
              return _context2.a(2);
            case 5:
              logger.error("IMAP IDLE \u542F\u52A8\u5931\u8D25: ".concat(_t2.message || "未知错误", ", 10\u79D2\u540E\u91CD\u8BD5..."));
              if (!this.shouldStop) {
                this.reconnectTimer = setTimeout(function () {
                  _this.startIdle(_this.onNewEmail)["catch"](function () {});
                }, 10000);
              }
            case 6:
              return _context2.a(2);
          }
        }, _callee2, this, [[1, 4]]);
      }));
      function startIdle(_x) {
        return _startIdle.apply(this, arguments);
      }
      return startIdle;
    }()
  }, {
    key: "handleNewMessages",
    value: function () {
      var _handleNewMessages = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var lock, mailbox, totalCount, limit, startSeq, range, uidsToFetch, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, msg, _i, _uidsToFetch, uid, fullEmail, _t3, _t4, _t5;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              if (this.onNewEmail) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2);
            case 1:
              _context3.p = 1;
              _context3.n = 2;
              return this.ensureConnected();
            case 2:
              _context3.n = 3;
              return this.client.getMailboxLock("INBOX");
            case 3:
              lock = _context3.v;
              _context3.p = 4;
              mailbox = this.client.mailbox;
              totalCount = mailbox && _typeof(mailbox) === "object" && "exists" in mailbox ? mailbox.exists : 0;
              if (!(totalCount === 0)) {
                _context3.n = 5;
                break;
              }
              return _context3.a(2);
            case 5:
              limit = Math.min(10, totalCount);
              startSeq = Math.max(1, totalCount - limit + 1);
              range = "".concat(startSeq, ":*");
              uidsToFetch = [];
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context3.p = 6;
              _iterator = _asyncIterator(this.client.fetch(range, {
                uid: true,
                flags: true
              }));
            case 7:
              _context3.n = 8;
              return _iterator.next();
            case 8:
              if (!(_iteratorAbruptCompletion = !(_step = _context3.v).done)) {
                _context3.n = 10;
                break;
              }
              msg = _step.value;
              if (msg.uid && !this.processedMessageIds.has(String(msg.uid))) {
                uidsToFetch.push(msg.uid);
              }
            case 9:
              _iteratorAbruptCompletion = false;
              _context3.n = 7;
              break;
            case 10:
              _context3.n = 12;
              break;
            case 11:
              _context3.p = 11;
              _t3 = _context3.v;
              _didIteratorError = true;
              _iteratorError = _t3;
            case 12:
              _context3.p = 12;
              _context3.p = 13;
              if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                _context3.n = 14;
                break;
              }
              _context3.n = 14;
              return _iterator["return"]();
            case 14:
              _context3.p = 14;
              if (!_didIteratorError) {
                _context3.n = 15;
                break;
              }
              throw _iteratorError;
            case 15:
              return _context3.f(14);
            case 16:
              return _context3.f(12);
            case 17:
              _i = 0, _uidsToFetch = uidsToFetch;
            case 18:
              if (!(_i < _uidsToFetch.length)) {
                _context3.n = 24;
                break;
              }
              uid = _uidsToFetch[_i];
              _context3.p = 19;
              _context3.n = 20;
              return this.fetchSingleEmail(uid);
            case 20:
              fullEmail = _context3.v;
              this.processedMessageIds.add(fullEmail.id);
              _context3.n = 21;
              return this.onNewEmail(fullEmail);
            case 21:
              _context3.n = 23;
              break;
            case 22:
              _context3.p = 22;
              _t4 = _context3.v;
              logger.error("\u83B7\u53D6 IMAP \u90AE\u4EF6 UID=".concat(uid, " \u8BE6\u60C5\u5931\u8D25: ").concat(_t4.message || "未知错误"));
            case 23:
              _i++;
              _context3.n = 18;
              break;
            case 24:
              _context3.p = 24;
              lock.release();
              return _context3.f(24);
            case 25:
              _context3.n = 27;
              break;
            case 26:
              _context3.p = 26;
              _t5 = _context3.v;
              logger.error("IDLE \u5904\u7406\u65B0\u90AE\u4EF6\u65F6\u51FA\u9519: ".concat(_t5.message || "未知错误"));
            case 27:
              return _context3.a(2);
          }
        }, _callee3, this, [[19, 22], [13,, 14, 16], [6, 11, 12, 17], [4,, 24, 25], [1, 26]]);
      }));
      function handleNewMessages() {
        return _handleNewMessages.apply(this, arguments);
      }
      return handleNewMessages;
    }()
  }, {
    key: "fetchSingleEmail",
    value: function () {
      var _fetchSingleEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(uid) {
        var messages, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, msg, _parsed$from$value, _parsed$from$value2, _parsed$attachments, rawSource, parsed, flagSet, flagArr, _t6;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              messages = [];
              _iteratorAbruptCompletion2 = false;
              _didIteratorError2 = false;
              _context4.p = 1;
              _iterator2 = _asyncIterator(this.client.fetch([uid], {
                uid: true,
                envelope: true,
                flags: true,
                internalDate: true,
                source: true
              }, {
                uid: true
              }));
            case 2:
              _context4.n = 3;
              return _iterator2.next();
            case 3:
              if (!(_iteratorAbruptCompletion2 = !(_step2 = _context4.v).done)) {
                _context4.n = 6;
                break;
              }
              msg = _step2.value;
              rawSource = msg.source || Buffer.from("");
              _context4.n = 4;
              return simpleParser(rawSource);
            case 4:
              parsed = _context4.v;
              flagSet = msg.flags || new Set();
              flagArr = Array.from(flagSet).map(function (f) {
                return typeof f === "string" ? f : String(f);
              });
              messages.push({
                id: String(msg.uid),
                subject: parsed.subject || "(无主题)",
                from: parsed.from ? {
                  name: parsed.from.text || ((_parsed$from$value = parsed.from.value) === null || _parsed$from$value === void 0 || (_parsed$from$value = _parsed$from$value[0]) === null || _parsed$from$value === void 0 ? void 0 : _parsed$from$value.address) || "",
                  address: ((_parsed$from$value2 = parsed.from.value) === null || _parsed$from$value2 === void 0 || (_parsed$from$value2 = _parsed$from$value2[0]) === null || _parsed$from$value2 === void 0 ? void 0 : _parsed$from$value2.address) || ""
                } : undefined,
                receivedAt: toShanghaiISO(parsed.date instanceof Date ? parsed.date.toISOString() : msg.internalDate instanceof Date ? msg.internalDate.toISOString() : new Date().toISOString()),
                isRead: flagSet.has("\\Seen"),
                isFlagged: flagSet.has("\\Flagged"),
                flags: flagArr,
                isAiProcessed: false,
                body: this.cleanHtmlContent(parsed.text || parsed.html || ""),
                hasAttachments: (((_parsed$attachments = parsed.attachments) === null || _parsed$attachments === void 0 ? void 0 : _parsed$attachments.length) || 0) > 0
              });
            case 5:
              _iteratorAbruptCompletion2 = false;
              _context4.n = 2;
              break;
            case 6:
              _context4.n = 8;
              break;
            case 7:
              _context4.p = 7;
              _t6 = _context4.v;
              _didIteratorError2 = true;
              _iteratorError2 = _t6;
            case 8:
              _context4.p = 8;
              _context4.p = 9;
              if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
                _context4.n = 10;
                break;
              }
              _context4.n = 10;
              return _iterator2["return"]();
            case 10:
              _context4.p = 10;
              if (!_didIteratorError2) {
                _context4.n = 11;
                break;
              }
              throw _iteratorError2;
            case 11:
              return _context4.f(10);
            case 12:
              return _context4.f(8);
            case 13:
              if (!(messages.length === 0)) {
                _context4.n = 14;
                break;
              }
              throw new Error("\u672A\u627E\u5230\u90AE\u4EF6UID: ".concat(uid));
            case 14:
              return _context4.a(2, messages[0]);
          }
        }, _callee4, this, [[9,, 10, 12], [1, 7, 8, 13]]);
      }));
      function fetchSingleEmail(_x2) {
        return _fetchSingleEmail.apply(this, arguments);
      }
      return fetchSingleEmail;
    }()
  }, {
    key: "findEmails",
    value: function () {
      var _findEmails = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var top,
          lock,
          mailbox,
          totalCount,
          limit,
          startSeq,
          range,
          messages,
          _iteratorAbruptCompletion3,
          _didIteratorError3,
          _iteratorError3,
          _iterator3,
          _step3,
          msg,
          _msg$envelope,
          _msg$envelope2,
          flagSet,
          flagArr,
          detail,
          _args5 = arguments,
          _t7,
          _t8;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              top = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : 10;
              _context5.p = 1;
              _context5.n = 2;
              return this.ensureConnected();
            case 2:
              _context5.n = 3;
              return this.client.getMailboxLock("INBOX");
            case 3:
              lock = _context5.v;
              _context5.p = 4;
              mailbox = this.client.mailbox;
              totalCount = mailbox && _typeof(mailbox) === "object" && "exists" in mailbox ? mailbox.exists : 0;
              logger.info("IMAP \u90AE\u7BB1 INBOX \u6D88\u606F\u603B\u6570: ".concat(totalCount));
              if (!(totalCount === 0)) {
                _context5.n = 5;
                break;
              }
              return _context5.a(2, []);
            case 5:
              limit = Math.min(top, totalCount);
              startSeq = Math.max(1, totalCount - limit + 1);
              range = "".concat(startSeq, ":*");
              messages = [];
              _iteratorAbruptCompletion3 = false;
              _didIteratorError3 = false;
              _context5.p = 6;
              _iterator3 = _asyncIterator(this.client.fetch(range, {
                uid: true,
                envelope: true,
                flags: true,
                internalDate: true
              }));
            case 7:
              _context5.n = 8;
              return _iterator3.next();
            case 8:
              if (!(_iteratorAbruptCompletion3 = !(_step3 = _context5.v).done)) {
                _context5.n = 10;
                break;
              }
              msg = _step3.value;
              flagSet = msg.flags || new Set();
              flagArr = Array.from(flagSet).map(function (f) {
                return typeof f === "string" ? f : String(f);
              });
              messages.push({
                uid: msg.uid,
                subject: ((_msg$envelope = msg.envelope) === null || _msg$envelope === void 0 ? void 0 : _msg$envelope.subject) || "(无主题)",
                from: (_msg$envelope2 = msg.envelope) !== null && _msg$envelope2 !== void 0 && (_msg$envelope2 = _msg$envelope2.from) !== null && _msg$envelope2 !== void 0 && _msg$envelope2[0] ? {
                  name: msg.envelope.from[0].name || msg.envelope.from[0].address || "",
                  address: msg.envelope.from[0].address || ""
                } : undefined,
                receivedAt: toShanghaiISO(msg.internalDate instanceof Date ? msg.internalDate.toISOString() : new Date().toISOString()),
                isRead: flagSet.has("\\Seen"),
                isFlagged: flagSet.has("\\Flagged"),
                flags: flagArr,
                hasAttachments: false
              });
            case 9:
              _iteratorAbruptCompletion3 = false;
              _context5.n = 7;
              break;
            case 10:
              _context5.n = 12;
              break;
            case 11:
              _context5.p = 11;
              _t7 = _context5.v;
              _didIteratorError3 = true;
              _iteratorError3 = _t7;
            case 12:
              _context5.p = 12;
              _context5.p = 13;
              if (!(_iteratorAbruptCompletion3 && _iterator3["return"] != null)) {
                _context5.n = 14;
                break;
              }
              _context5.n = 14;
              return _iterator3["return"]();
            case 14:
              _context5.p = 14;
              if (!_didIteratorError3) {
                _context5.n = 15;
                break;
              }
              throw _iteratorError3;
            case 15:
              return _context5.f(14);
            case 16:
              return _context5.f(12);
            case 17:
              // 按接收时间降序排序（最新邮件在前）
              messages.sort(function (a, b) {
                return new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime();
              });
              logger.success("\u6210\u529F\u83B7\u53D6 ".concat(messages.length, " \u5C01 IMAP \u90AE\u4EF6"));
              return _context5.a(2, messages.map(function (m) {
                return {
                  id: String(m.uid),
                  subject: m.subject,
                  from: m.from,
                  receivedAt: m.receivedAt,
                  isRead: m.isRead,
                  isFlagged: m.isFlagged,
                  flags: m.flags,
                  isAiProcessed: false,
                  hasAttachments: m.hasAttachments
                };
              }));
            case 18:
              _context5.p = 18;
              lock.release();
              return _context5.f(18);
            case 19:
              _context5.n = 21;
              break;
            case 20:
              _context5.p = 20;
              _t8 = _context5.v;
              detail = _t8.response || _t8.serverResponseCode || _t8.rspCode || "";
              logger.error("\u83B7\u53D6 IMAP \u90AE\u4EF6\u5931\u8D25: ".concat(_t8.message || "未知错误", " ").concat(detail ? "| \u670D\u52A1\u5668\u54CD\u5E94: ".concat(detail) : ""), _t8.stack || "");
              return _context5.a(2, []);
            case 21:
              return _context5.a(2);
          }
        }, _callee5, this, [[13,, 14, 16], [6, 11, 12, 17], [4,, 18, 19], [1, 20]]);
      }));
      function findEmails() {
        return _findEmails.apply(this, arguments);
      }
      return findEmails;
    }()
  }, {
    key: "getEmailById",
    value: function () {
      var _getEmailById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(itemId) {
        var lock, uid, messages, _iteratorAbruptCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, msg, _parsed$from$value3, _parsed$from$value4, _parsed$attachments2, rawSource, parsed, rawHtml, flagSet, flagArr, m, detail, _t9, _t0;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return this.ensureConnected();
            case 1:
              _context6.n = 2;
              return this.client.getMailboxLock("INBOX");
            case 2:
              lock = _context6.v;
              _context6.p = 3;
              uid = parseInt(itemId, 10);
              if (!isNaN(uid)) {
                _context6.n = 4;
                break;
              }
              throw new Error("\u65E0\u6548\u7684\u90AE\u4EF6UID: ".concat(itemId));
            case 4:
              messages = [];
              _iteratorAbruptCompletion4 = false;
              _didIteratorError4 = false;
              _context6.p = 5;
              _iterator4 = _asyncIterator(this.client.fetch([uid], {
                uid: true,
                envelope: true,
                flags: true,
                internalDate: true,
                source: true
              }, {
                uid: true
              }));
            case 6:
              _context6.n = 7;
              return _iterator4.next();
            case 7:
              if (!(_iteratorAbruptCompletion4 = !(_step4 = _context6.v).done)) {
                _context6.n = 10;
                break;
              }
              msg = _step4.value;
              rawSource = msg.source || Buffer.from("");
              _context6.n = 8;
              return simpleParser(rawSource);
            case 8:
              parsed = _context6.v;
              rawHtml = parsed.html || "";
              flagSet = msg.flags || new Set();
              flagArr = Array.from(flagSet).map(function (f) {
                return typeof f === "string" ? f : String(f);
              });
              messages.push({
                uid: msg.uid,
                subject: parsed.subject || "(无主题)",
                from: parsed.from ? {
                  name: parsed.from.text || ((_parsed$from$value3 = parsed.from.value) === null || _parsed$from$value3 === void 0 || (_parsed$from$value3 = _parsed$from$value3[0]) === null || _parsed$from$value3 === void 0 ? void 0 : _parsed$from$value3.address) || "",
                  address: ((_parsed$from$value4 = parsed.from.value) === null || _parsed$from$value4 === void 0 || (_parsed$from$value4 = _parsed$from$value4[0]) === null || _parsed$from$value4 === void 0 ? void 0 : _parsed$from$value4.address) || ""
                } : undefined,
                receivedAt: toShanghaiISO(parsed.date instanceof Date ? parsed.date.toISOString() : msg.internalDate instanceof Date ? msg.internalDate.toISOString() : new Date().toISOString()),
                isRead: flagSet.has("\\Seen"),
                isFlagged: flagSet.has("\\Flagged"),
                flags: flagArr,
                body: this.cleanHtmlContent(parsed.text || rawHtml || ""),
                htmlBody: rawHtml,
                hasAttachments: (((_parsed$attachments2 = parsed.attachments) === null || _parsed$attachments2 === void 0 ? void 0 : _parsed$attachments2.length) || 0) > 0
              });
            case 9:
              _iteratorAbruptCompletion4 = false;
              _context6.n = 6;
              break;
            case 10:
              _context6.n = 12;
              break;
            case 11:
              _context6.p = 11;
              _t9 = _context6.v;
              _didIteratorError4 = true;
              _iteratorError4 = _t9;
            case 12:
              _context6.p = 12;
              _context6.p = 13;
              if (!(_iteratorAbruptCompletion4 && _iterator4["return"] != null)) {
                _context6.n = 14;
                break;
              }
              _context6.n = 14;
              return _iterator4["return"]();
            case 14:
              _context6.p = 14;
              if (!_didIteratorError4) {
                _context6.n = 15;
                break;
              }
              throw _iteratorError4;
            case 15:
              return _context6.f(14);
            case 16:
              return _context6.f(12);
            case 17:
              if (!(messages.length === 0)) {
                _context6.n = 18;
                break;
              }
              throw new Error("\u672A\u627E\u5230\u90AE\u4EF6UID: ".concat(itemId));
            case 18:
              m = messages[0];
              return _context6.a(2, {
                id: String(m.uid),
                subject: m.subject,
                from: m.from,
                receivedAt: m.receivedAt,
                isRead: m.isRead,
                isFlagged: m.isFlagged,
                flags: m.flags,
                isAiProcessed: false,
                body: m.body,
                htmlBody: m.htmlBody || undefined,
                hasAttachments: m.hasAttachments
              });
            case 19:
              _context6.p = 19;
              lock.release();
              return _context6.f(19);
            case 20:
              _context6.n = 22;
              break;
            case 21:
              _context6.p = 21;
              _t0 = _context6.v;
              detail = _t0.response || _t0.serverResponseCode || _t0.rspCode || "";
              logger.error("\u83B7\u53D6IMAP\u90AE\u4EF6\u8BE6\u60C5\u5931\u8D25: ".concat(_t0.message || "未知错误", " ").concat(detail ? "| \u670D\u52A1\u5668\u54CD\u5E94: ".concat(detail) : ""), _t0.stack || "");
              throw _t0;
            case 22:
              return _context6.a(2);
          }
        }, _callee6, this, [[13,, 14, 16], [5, 11, 12, 17], [3,, 19, 20], [0, 21]]);
      }));
      function getEmailById(_x3) {
        return _getEmailById.apply(this, arguments);
      }
      return getEmailById;
    }() /** 将邮件标记为已读（设置 \Seen 标志） */
  }, {
    key: "markAsRead",
    value: (function () {
      var _markAsRead = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(emailId) {
        var lock, uid, _t1;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              _context7.n = 1;
              return this.ensureConnected();
            case 1:
              _context7.n = 2;
              return this.client.getMailboxLock("INBOX");
            case 2:
              lock = _context7.v;
              _context7.p = 3;
              uid = parseInt(emailId, 10);
              if (!isNaN(uid)) {
                _context7.n = 4;
                break;
              }
              logger.warn("Invalid email UID for markAsRead: ".concat(emailId));
              return _context7.a(2);
            case 4:
              _context7.n = 5;
              return this.client.messageFlagsSet([uid], ["\\Seen"], {
                uid: true
              });
            case 5:
              logger.info("IMAP: Marked email ".concat(emailId, " as read"));
            case 6:
              _context7.p = 6;
              lock.release();
              return _context7.f(6);
            case 7:
              _context7.n = 9;
              break;
            case 8:
              _context7.p = 8;
              _t1 = _context7.v;
              logger.error("Failed to mark email ".concat(emailId, " as read: ").concat(_t1.message));
            case 9:
              return _context7.a(2);
          }
        }, _callee7, this, [[3,, 6, 7], [0, 8]]);
      }));
      function markAsRead(_x4) {
        return _markAsRead.apply(this, arguments);
      }
      return markAsRead;
    }())
  }, {
    key: "cleanHtmlContent",
    value: function cleanHtmlContent(html) {
      if (!html) return "";
      return html.replace(/<(script|style|head)\b[\s\S]*?<\/\1>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
    }
  }, {
    key: "addProcessedId",
    value: function addProcessedId(id) {
      this.processedMessageIds.add(id);
    }
  }, {
    key: "hasProcessedId",
    value: function hasProcessedId(id) {
      return this.processedMessageIds.has(id);
    }
  }, {
    key: "close",
    value: function () {
      var _close = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              this.shouldStop = true;
              this.onNewEmail = null;
              if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
              }
              _context8.n = 1;
              return this.safeCloseClient();
            case 1:
              return _context8.a(2);
          }
        }, _callee8, this);
      }));
      function close() {
        return _close.apply(this, arguments);
      }
      return close;
    }()
  }, {
    key: "safeCloseClient",
    value: function () {
      var _safeCloseClient = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var _t10;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              this.idleRunning = false;
              if (!this.client) {
                _context9.n = 5;
                break;
              }
              _context9.p = 1;
              if (!this.client.usable) {
                _context9.n = 2;
                break;
              }
              _context9.n = 2;
              return this.client.logout();
            case 2:
              _context9.n = 4;
              break;
            case 3:
              _context9.p = 3;
              _t10 = _context9.v;
            case 4:
              this.client = null;
            case 5:
              return _context9.a(2);
          }
        }, _callee9, this, [[1, 3]]);
      }));
      function safeCloseClient() {
        return _safeCloseClient.apply(this, arguments);
      }
      return safeCloseClient;
    }()
  }]);
}();