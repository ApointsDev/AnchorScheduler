function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import crypto from "crypto";
import WebSocket from "ws";
import { logger } from "../Utils/logger.js";

/**
 * 讯飞语音识别
 *
 * 模式（环境变量 XFYUN_IAT_MODE）：
 * - classic（默认）：语音听写流式版 wss://iat-api.xfyun.cn/v2/iat
 *   文档：https://www.xfyun.cn/doc/asr/voicedictation/API.html
 * - spark：大模型多语种 wss://iat.cn-huabei-1.xf-yun.com/v1
 *   文档：https://www.xfyun.cn/doc/spark/spark_mul_cn_iat.html
 *
 * 注意：需在控制台为同一 APPID 开通对应产品；未开通会返回 11200/11201 licc failed。
 */

var FRAME_SIZE = 1280;
var FRAME_INTERVAL_MS = 40;
export var XfyunIatApi = /*#__PURE__*/function () {
  function XfyunIatApi(options) {
    _classCallCheck(this, XfyunIatApi);
    this.appId = (options === null || options === void 0 ? void 0 : options.appId) || process.env.XFYUN_APP_ID || process.env.XFYUN_APPID || "";
    this.apiKey = (options === null || options === void 0 ? void 0 : options.apiKey) || process.env.XFYUN_API_KEY || "";
    this.apiSecret = (options === null || options === void 0 ? void 0 : options.apiSecret) || process.env.XFYUN_API_SECRET || "";
    var modeEnv = ((options === null || options === void 0 ? void 0 : options.mode) || process.env.XFYUN_IAT_MODE || "classic").toLowerCase();
    this.mode = modeEnv === "spark" ? "spark" : "classic";
    this.sparkHost = (options === null || options === void 0 ? void 0 : options.sparkHost) || process.env.XFYUN_IAT_HOST || "iat.cn-huabei-1.xf-yun.com";
    this.sparkPath = (options === null || options === void 0 ? void 0 : options.sparkPath) || process.env.XFYUN_IAT_PATH || "/v1";
    this.classicHost = (options === null || options === void 0 ? void 0 : options.classicHost) || process.env.XFYUN_CLASSIC_IAT_HOST || "iat-api.xfyun.cn";
    this.classicPath = (options === null || options === void 0 ? void 0 : options.classicPath) || process.env.XFYUN_CLASSIC_IAT_PATH || "/v2/iat";
    if (!this.appId || !this.apiKey || !this.apiSecret) {
      logger.warn("[XfyunIat] 未配置完整凭证（XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET）");
    } else {
      logger.success("[XfyunIat] \u8BED\u97F3\u8BC6\u522B\u5DF2\u521D\u59CB\u5316 mode=".concat(this.mode, " (").concat(this.mode === "spark" ? "大模型多语种" : "语音听写流式版", ")"));
    }
  }
  return _createClass(XfyunIatApi, [{
    key: "isConfigured",
    value: function isConfigured() {
      return !!(this.appId && this.apiKey && this.apiSecret);
    }
  }, {
    key: "getMode",
    value: function getMode() {
      return this.mode;
    }
  }, {
    key: "buildAuthUrl",
    value: function buildAuthUrl(mode) {
      var m = mode || this.mode;
      var host = m === "spark" ? this.sparkHost : this.classicHost;
      var path = m === "spark" ? this.sparkPath : this.classicPath;
      var date = new Date().toUTCString();
      var signatureOrigin = "host: ".concat(host, "\ndate: ").concat(date, "\nGET ").concat(path, " HTTP/1.1");
      var signature = crypto.createHmac("sha256", this.apiSecret).update(signatureOrigin).digest("base64");
      var authorizationOrigin = "api_key=\"".concat(this.apiKey, "\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"").concat(signature, "\"");
      var authorization = Buffer.from(authorizationOrigin).toString("base64");
      var params = new URLSearchParams({
        authorization: authorization,
        date: date,
        host: host
      });
      return "wss://".concat(host).concat(path, "?").concat(params.toString());
    }
  }, {
    key: "recognize",
    value: function recognize(options) {
      if (!this.isConfigured()) {
        return Promise.reject(new Error("讯飞语音识别未配置：请设置 XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET"));
      }
      var mode = options.mode || this.mode;
      var encoding = options.encoding || "raw";
      var sampleRate = options.sampleRate || 16000;
      var timeoutMs = options.timeoutMs || 60000;
      var audio = options.audio;
      if (!audio || audio.length === 0) {
        return Promise.reject(new Error("音频数据为空"));
      }
      if (audio.length > 5 * 1024 * 1024) {
        return Promise.reject(new Error("音频过大，请控制在 60 秒以内"));
      }
      if (mode === "spark") {
        return this.recognizeSpark({
          audio: audio,
          encoding: encoding,
          sampleRate: sampleRate,
          language: options.language,
          eos: options.eos,
          timeoutMs: timeoutMs
        });
      }
      return this.recognizeClassic({
        audio: audio,
        encoding: encoding,
        sampleRate: sampleRate,
        language: options.language,
        eos: options.eos,
        timeoutMs: timeoutMs
      });
    }

    // ── classic: 语音听写流式版 ─────────────────────────────
  }, {
    key: "recognizeClassic",
    value: function recognizeClassic(opts) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        var settled = false;
        var sid;
        var resultMap = new Map();
        var segments = [];
        var snCounter = 0;
        var finish = function finish(err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          try {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
              ws.close();
            }
          } catch (_unused) {
            /* ignore */
          }
          if (err) {
            reject(err);
            return;
          }
          var text = Array.from(resultMap.entries()).sort(function (a, b) {
            return a[0] - b[0];
          }).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              t = _ref2[1];
            return t;
          }).join("");
          resolve({
            text: text,
            sid: sid,
            segments: segments,
            mode: "classic"
          });
        };
        var timer = setTimeout(function () {
          return finish(new Error("语音识别超时"));
        }, opts.timeoutMs);
        var url = _this.buildAuthUrl("classic");
        logger.data("[XfyunIat/classic] \u8FDE\u63A5 ".concat(_this.classicHost).concat(_this.classicPath, ", audio=").concat(opts.audio.length, "B"));
        var ws = new WebSocket(url);
        ws.on("open", function () {
          void _this.sendClassicFrames(ws, opts)["catch"](function (e) {
            return finish(e instanceof Error ? e : new Error(String(e)));
          });
        });
        ws.on("message", function (data) {
          try {
            var _msg$data, _msg$data2;
            var msg = JSON.parse(data.toString());
            if (msg.code !== 0 && msg.code !== undefined) {
              finish(_this.mapLicenseError(msg.code, msg.message));
              return;
            }
            if (msg.sid) sid = msg.sid;
            var result = msg === null || msg === void 0 || (_msg$data = msg.data) === null || _msg$data === void 0 ? void 0 : _msg$data.result;
            if (result) {
              _this.applyTextPayload(result, resultMap, segments, function () {
                return snCounter++;
              });
            }
            if ((msg === null || msg === void 0 || (_msg$data2 = msg.data) === null || _msg$data2 === void 0 ? void 0 : _msg$data2.status) === 2) {
              finish();
            }
          } catch (e) {
            logger.error("[XfyunIat/classic] \u89E3\u6790\u6D88\u606F\u5931\u8D25: ".concat((e === null || e === void 0 ? void 0 : e.message) || e));
          }
        });
        ws.on("error", function (err) {
          finish(new Error("WebSocket \u9519\u8BEF: ".concat(err.message)));
        });
        ws.on("close", function (code, reason) {
          if (!settled) {
            if (resultMap.size > 0 || sid) {
              finish();
            } else {
              finish(new Error("\u8FDE\u63A5\u5173\u95ED\u4E14\u672A\u83B7\u5F97\u8BC6\u522B\u7ED3\u679C (code=".concat(code, ", reason=").concat((reason === null || reason === void 0 ? void 0 : reason.toString()) || "", ")")));
            }
          }
        });
      });
    }
  }, {
    key: "sendClassicFrames",
    value: function () {
      var _sendClassicFrames = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(ws, opts) {
        var total, offset, isFirst, format, language, end, chunk, isLast, status, frame, _opts$eos;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              total = opts.audio.length;
              offset = 0;
              isFirst = true;
              format = opts.sampleRate === 8000 ? "audio/L16;rate=8000" : "audio/L16;rate=16000";
              language = mapClassicLanguage(opts.language);
            case 1:
              if (!(offset < total)) {
                _context.n = 4;
                break;
              }
              if (!(ws.readyState !== WebSocket.OPEN)) {
                _context.n = 2;
                break;
              }
              throw new Error("WebSocket 已断开，无法继续发送音频");
            case 2:
              end = Math.min(offset + FRAME_SIZE, total);
              chunk = opts.audio.subarray(offset, end);
              offset = end;
              isLast = offset >= total;
              status = void 0;
              if (isFirst && isLast) status = 2;else if (isFirst) status = 0;else if (isLast) status = 2;else status = 1;
              frame = {
                data: {
                  status: status,
                  format: format,
                  encoding: opts.encoding,
                  audio: chunk.toString("base64")
                }
              };
              if (isFirst) {
                frame.common = {
                  app_id: this.appId
                };
                frame.business = {
                  language: language,
                  domain: "iat",
                  accent: "mandarin",
                  vad_eos: (_opts$eos = opts.eos) !== null && _opts$eos !== void 0 ? _opts$eos : 3000,
                  dwa: "wpgs"
                };
              }
              ws.send(JSON.stringify(frame));
              isFirst = false;
              if (isLast) {
                _context.n = 3;
                break;
              }
              _context.n = 3;
              return sleep(FRAME_INTERVAL_MS);
            case 3:
              _context.n = 1;
              break;
            case 4:
              // 若最后一帧已是 status=2 且含音频，不必再发空结束帧
              logger.data("[XfyunIat/classic] \u97F3\u9891\u53D1\u9001\u5B8C\u6210");
            case 5:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function sendClassicFrames(_x, _x2) {
        return _sendClassicFrames.apply(this, arguments);
      }
      return sendClassicFrames;
    }() // ── spark: 大模型多语种 ────────────────────────────────
  }, {
    key: "recognizeSpark",
    value: function recognizeSpark(opts) {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        var settled = false;
        var sid;
        var resultMap = new Map();
        var segments = [];
        var snCounter = 0;
        var finish = function finish(err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          try {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
              ws.close();
            }
          } catch (_unused2) {
            /* ignore */
          }
          if (err) {
            reject(err);
            return;
          }
          var text = Array.from(resultMap.entries()).sort(function (a, b) {
            return a[0] - b[0];
          }).map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              t = _ref4[1];
            return t;
          }).join("");
          resolve({
            text: text,
            sid: sid,
            segments: segments,
            mode: "spark"
          });
        };
        var timer = setTimeout(function () {
          return finish(new Error("语音识别超时"));
        }, opts.timeoutMs);
        var url = _this2.buildAuthUrl("spark");
        logger.data("[XfyunIat/spark] \u8FDE\u63A5 ".concat(_this2.sparkHost).concat(_this2.sparkPath, ", audio=").concat(opts.audio.length, "B"));
        var ws = new WebSocket(url);
        ws.on("open", function () {
          void _this2.sendSparkFrames(ws, opts)["catch"](function (e) {
            return finish(e instanceof Error ? e : new Error(String(e)));
          });
        });
        ws.on("message", function (data) {
          try {
            var _msg$header, _msg$header3, _msg$payload, _msg$header4, _msg$payload2;
            var msg = JSON.parse(data.toString());
            var code = msg === null || msg === void 0 || (_msg$header = msg.header) === null || _msg$header === void 0 ? void 0 : _msg$header.code;
            if (code !== 0 && code !== undefined) {
              var _msg$header2;
              finish(_this2.mapLicenseError(code, msg === null || msg === void 0 || (_msg$header2 = msg.header) === null || _msg$header2 === void 0 ? void 0 : _msg$header2.message, "spark"));
              return;
            }
            if (msg !== null && msg !== void 0 && (_msg$header3 = msg.header) !== null && _msg$header3 !== void 0 && _msg$header3.sid) sid = msg.header.sid;
            var textB64 = msg === null || msg === void 0 || (_msg$payload = msg.payload) === null || _msg$payload === void 0 || (_msg$payload = _msg$payload.result) === null || _msg$payload === void 0 ? void 0 : _msg$payload.text;
            if (textB64) {
              var decoded = Buffer.from(textB64, "base64").toString("utf8");
              try {
                var payload = JSON.parse(decoded);
                _this2.applyTextPayload(payload, resultMap, segments, function () {
                  return snCounter++;
                });
              } catch (_unused3) {
                logger.warn("[XfyunIat/spark] \u65E0\u6CD5\u89E3\u6790 text: ".concat(decoded.slice(0, 80)));
              }
            }
            if ((msg === null || msg === void 0 || (_msg$header4 = msg.header) === null || _msg$header4 === void 0 ? void 0 : _msg$header4.status) === 2 || (msg === null || msg === void 0 || (_msg$payload2 = msg.payload) === null || _msg$payload2 === void 0 || (_msg$payload2 = _msg$payload2.result) === null || _msg$payload2 === void 0 ? void 0 : _msg$payload2.status) === 2) {
              finish();
            }
          } catch (e) {
            logger.error("[XfyunIat/spark] \u89E3\u6790\u6D88\u606F\u5931\u8D25: ".concat((e === null || e === void 0 ? void 0 : e.message) || e));
          }
        });
        ws.on("error", function (err) {
          finish(new Error("WebSocket \u9519\u8BEF: ".concat(err.message)));
        });
        ws.on("close", function (code, reason) {
          if (!settled) {
            if (resultMap.size > 0) finish();else finish(new Error("\u8FDE\u63A5\u5173\u95ED\u4E14\u672A\u83B7\u5F97\u8BC6\u522B\u7ED3\u679C (code=".concat(code, ", reason=").concat((reason === null || reason === void 0 ? void 0 : reason.toString()) || "", ")")));
          }
        });
      });
    }
  }, {
    key: "sendSparkFrames",
    value: function () {
      var _sendSparkFrames = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(ws, opts) {
        var total, offset, seq, isFirst, end, chunk, isLast, status, frame, _opts$eos2, ln;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              total = opts.audio.length;
              offset = 0;
              seq = 1;
              isFirst = true;
            case 1:
              if (!(offset < total)) {
                _context2.n = 4;
                break;
              }
              if (!(ws.readyState !== WebSocket.OPEN)) {
                _context2.n = 2;
                break;
              }
              throw new Error("WebSocket 已断开，无法继续发送音频");
            case 2:
              end = Math.min(offset + FRAME_SIZE, total);
              chunk = opts.audio.subarray(offset, end);
              offset = end;
              isLast = offset >= total;
              status = void 0;
              if (isFirst && isLast) status = 2;else if (isFirst) status = 0;else if (isLast) status = 2;else status = 1;
              frame = {
                header: {
                  app_id: this.appId,
                  status: status
                },
                payload: {
                  audio: {
                    encoding: opts.encoding,
                    sample_rate: opts.sampleRate,
                    channels: 1,
                    bit_depth: 16,
                    seq: seq,
                    status: status,
                    audio: chunk.toString("base64")
                  }
                }
              };
              if (isFirst) {
                frame.parameter = {
                  iat: {
                    domain: "slm",
                    language: "mul_cn",
                    accent: "mandarin",
                    eos: (_opts$eos2 = opts.eos) !== null && _opts$eos2 !== void 0 ? _opts$eos2 : 6000,
                    result: {
                      encoding: "utf8",
                      compress: "raw",
                      format: "json"
                    }
                  }
                };
                ln = mapSparkLanguage(opts.language);
                if (ln) frame.parameter.iat.ln = ln;
              }
              ws.send(JSON.stringify(frame));
              isFirst = false;
              seq += 1;
              if (isLast) {
                _context2.n = 3;
                break;
              }
              _context2.n = 3;
              return sleep(FRAME_INTERVAL_MS);
            case 3:
              _context2.n = 1;
              break;
            case 4:
              logger.data("[XfyunIat/spark] \u97F3\u9891\u53D1\u9001\u5B8C\u6210\uFF0C\u5171 ".concat(seq - 1, " \u5E27"));
            case 5:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function sendSparkFrames(_x3, _x4) {
        return _sendSparkFrames.apply(this, arguments);
      }
      return sendSparkFrames;
    }() // ── helpers ────────────────────────────────────────────
  }, {
    key: "applyTextPayload",
    value: function applyTextPayload(payload, resultMap, segments, nextSn) {
      var piece = "";
      var _iterator = _createForOfIteratorHelper(payload.ws || []),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var w = _step.value;
          var _iterator2 = _createForOfIteratorHelper(w.cw || []),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var cw = _step2.value;
              var word = cw.w || "";
              if (!word) continue;
              piece += word;
              segments.push({
                word: word,
                language: cw.lg
              });
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var sn = typeof payload.sn === "number" ? payload.sn : nextSn();
      if (payload.pgs === "rpl" && Array.isArray(payload.rg) && payload.rg.length >= 2) {
        var _payload$rg = _slicedToArray(payload.rg, 2),
          from = _payload$rg[0],
          to = _payload$rg[1];
        for (var i = from; i <= to; i++) resultMap["delete"](i);
      }
      if (piece) resultMap.set(sn, piece);
    }
  }, {
    key: "mapLicenseError",
    value: function mapLicenseError(code, message) {
      var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "classic";
      var msg = message || "\u8BC6\u522B\u5931\u8D25 code=".concat(code);
      if (code === 11200 || code === 11201 || /licc/i.test(String(msg))) {
        var product = mode === "spark" ? "大模型多语种语音识别 https://console.xfyun.cn/services/bmm" : "语音听写（流式版） https://console.xfyun.cn/services/iat";
        return new Error("\u8BAF\u98DE\u6388\u6743\u5931\u8D25 (code=".concat(code, "): \u8BF7\u786E\u8BA4 APPID \u5DF2\u5F00\u901A\u5E76\u7ED1\u5B9A\u300C").concat(product, "\u300D\uFF1B\u539F\u59CB\u4FE1\u606F: ").concat(msg));
      }
      return new Error("\u8BAF\u98DE\u8BC6\u522B\u9519\u8BEF (code=".concat(code, "): ").concat(msg));
    }
  }]);
}();
function mapClassicLanguage(lang) {
  if (!lang) return "zh_cn";
  var l = lang.toLowerCase().trim();
  if (l === "zh" || l === "zh_cn" || l === "zh-cn" || l.startsWith("zh|")) return "zh_cn";
  if (l === "en" || l === "en_us" || l === "en-us") return "en_us";
  // 其它直接透传（小语种等需控制台授权）
  return lang;
}
function mapSparkLanguage(lang) {
  if (!lang) return undefined;
  var l = lang.toLowerCase().trim();
  if (l === "zh_cn" || l === "zh-cn") return "zh";
  if (l === "en_us" || l === "en-us") return "en";
  return lang;
}
function sleep(ms) {
  return new Promise(function (r) {
    return setTimeout(r, ms);
  });
}

/** 从 WAV/MP3/PCM 准备识别缓冲 */
export function prepareAudioBuffer(buffer, mimeType, filename) {
  var name = (filename || "").toLowerCase();
  var mime = (mimeType || "").toLowerCase();
  var isMp3 = mime.includes("mpeg") || mime.includes("mp3") || name.endsWith(".mp3");
  if (isMp3) {
    return {
      audio: stripMp3Id3(buffer),
      encoding: "lame"
    };
  }
  var isWav = mime.includes("wav") || mime.includes("wave") || name.endsWith(".wav") || buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WAVE";
  if (isWav) {
    return {
      audio: extractPcmFromWav(buffer),
      encoding: "raw"
    };
  }
  return {
    audio: buffer,
    encoding: "raw"
  };
}
function stripMp3Id3(buf) {
  if (buf.length >= 10 && buf.toString("ascii", 0, 3) === "ID3") {
    var size = (buf[6] & 0x7f) << 21 | (buf[7] & 0x7f) << 14 | (buf[8] & 0x7f) << 7 | buf[9] & 0x7f;
    var headerLen = 10 + size;
    if (headerLen < buf.length) return buf.subarray(headerLen);
  }
  return buf;
}
function extractPcmFromWav(buf) {
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    return buf.length > 44 ? buf.subarray(44) : buf;
  }
  var offset = 12;
  while (offset + 8 <= buf.length) {
    var chunkId = buf.toString("ascii", offset, offset + 4);
    var chunkSize = buf.readUInt32LE(offset + 4);
    var dataStart = offset + 8;
    if (chunkId === "data") {
      var end = Math.min(dataStart + chunkSize, buf.length);
      return buf.subarray(dataStart, end);
    }
    offset = dataStart + chunkSize + chunkSize % 2;
  }
  return buf.subarray(44);
}
export function pcmToWav(pcm) {
  var sampleRate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16000;
  var channels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var bitDepth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 16;
  var byteRate = sampleRate * channels * bitDepth / 8;
  var blockAlign = channels * bitDepth / 8;
  var header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}
export var xfyunIatApi = new XfyunIatApi();