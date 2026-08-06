function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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

/** 讯飞大模型多语种语音识别（spark_mul_cn_iat） */

var DEFAULT_HOST = "iat.cn-huabei-1.xf-yun.com";
var DEFAULT_PATH = "/v1";
var FRAME_SIZE = 1280; // 每帧字节数
var FRAME_INTERVAL_MS = 40; // 发送间隔

export var XfyunIatApi = /*#__PURE__*/function () {
  function XfyunIatApi(options) {
    _classCallCheck(this, XfyunIatApi);
    this.appId = (options === null || options === void 0 ? void 0 : options.appId) || process.env.XFYUN_APP_ID || process.env.XFYUN_APPID || "";
    this.apiKey = (options === null || options === void 0 ? void 0 : options.apiKey) || process.env.XFYUN_API_KEY || "";
    this.apiSecret = (options === null || options === void 0 ? void 0 : options.apiSecret) || process.env.XFYUN_API_SECRET || "";
    this.host = (options === null || options === void 0 ? void 0 : options.host) || process.env.XFYUN_IAT_HOST || DEFAULT_HOST;
    this.path = (options === null || options === void 0 ? void 0 : options.path) || process.env.XFYUN_IAT_PATH || DEFAULT_PATH;
    if (!this.appId || !this.apiKey || !this.apiSecret) {
      logger.warn("[XfyunIat] 未配置完整凭证（XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET）");
    } else {
      logger.success("[XfyunIat] 大模型多语种语音识别服务已初始化");
    }
  }
  return _createClass(XfyunIatApi, [{
    key: "isConfigured",
    value: function isConfigured() {
      return !!(this.appId && this.apiKey && this.apiSecret);
    }

    /**
     * 生成带鉴权参数的 WebSocket URL
     * 文档：https://www.xfyun.cn/doc/spark/spark_mul_cn_iat.html
     */
  }, {
    key: "buildAuthUrl",
    value: function buildAuthUrl() {
      var date = new Date().toUTCString();
      var signatureOrigin = "host: ".concat(this.host, "\ndate: ").concat(date, "\nGET ").concat(this.path, " HTTP/1.1");
      var signature = crypto.createHmac("sha256", this.apiSecret).update(signatureOrigin).digest("base64");
      var authorizationOrigin = "api_key=\"".concat(this.apiKey, "\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"").concat(signature, "\"");
      var authorization = Buffer.from(authorizationOrigin).toString("base64");
      var params = new URLSearchParams({
        authorization: authorization,
        date: date,
        host: this.host
      });
      return "wss://".concat(this.host).concat(this.path, "?").concat(params.toString());
    }

    /**
     * 将完整音频识别为文字（短音频 ≤60s）
     */
  }, {
    key: "recognize",
    value: function recognize(options) {
      var _this = this;
      if (!this.isConfigured()) {
        return Promise.reject(new Error("讯飞语音识别未配置：请设置 XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET"));
      }
      var encoding = options.encoding || "raw";
      var sampleRate = options.sampleRate || 16000;
      var timeoutMs = options.timeoutMs || 60000;
      var audio = options.audio;
      if (!audio || audio.length === 0) {
        return Promise.reject(new Error("音频数据为空"));
      }

      // 粗略限制：PCM 16k/16bit/mono 约 32KB/s，60s ≈ 2MB；mp3 更小
      if (audio.length > 5 * 1024 * 1024) {
        return Promise.reject(new Error("音频过大，请控制在 60 秒以内"));
      }
      return new Promise(function (resolve, reject) {
        var settled = false;
        var sid;
        // 按序号保存分片文本，支持 pgs=rpl 替换
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
            segments: segments
          });
        };
        var timer = setTimeout(function () {
          finish(new Error("语音识别超时"));
        }, timeoutMs);
        var url = _this.buildAuthUrl();
        logger.data("[XfyunIat] \u8FDE\u63A5 ".concat(_this.host).concat(_this.path, ", audio=").concat(audio.length, "B, encoding=").concat(encoding));
        var ws = new WebSocket(url);
        ws.on("open", function () {
          void _this.sendAudioFrames(ws, audio, {
            encoding: encoding,
            sampleRate: sampleRate,
            language: options.language,
            eos: options.eos
          })["catch"](function (e) {
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
              var message = (msg === null || msg === void 0 || (_msg$header2 = msg.header) === null || _msg$header2 === void 0 ? void 0 : _msg$header2.message) || "\u8BC6\u522B\u5931\u8D25 code=".concat(code);
              // 11201 licc failed：控制台未开通服务或额度用尽
              if (code === 11201 || /licc/i.test(String(message))) {
                finish(new Error("\u8BAF\u98DE\u6388\u6743\u5931\u8D25 (code=".concat(code, "): \u8BF7\u5728\u63A7\u5236\u53F0\u5F00\u901A\u300C\u5927\u6A21\u578B\u591A\u8BED\u79CD\u8BED\u97F3\u8BC6\u522B\u300D\u5E76\u9886\u53D6\u514D\u8D39\u989D\u5EA6 \u2014 https://console.xfyun.cn/services/bmm \uFF08\u539F\u59CB\u4FE1\u606F: ").concat(message, "\uFF09")));
                return;
              }
              finish(new Error("\u8BAF\u98DE\u8BC6\u522B\u9519\u8BEF (code=".concat(code, "): ").concat(message)));
              return;
            }
            if (msg !== null && msg !== void 0 && (_msg$header3 = msg.header) !== null && _msg$header3 !== void 0 && _msg$header3.sid) sid = msg.header.sid;
            var textB64 = msg === null || msg === void 0 || (_msg$payload = msg.payload) === null || _msg$payload === void 0 || (_msg$payload = _msg$payload.result) === null || _msg$payload === void 0 ? void 0 : _msg$payload.text;
            if (textB64) {
              var decoded = Buffer.from(textB64, "base64").toString("utf8");
              var payload;
              try {
                payload = JSON.parse(decoded);
              } catch (_unused2) {
                logger.warn("[XfyunIat] \u65E0\u6CD5\u89E3\u6790 text \u5B57\u6BB5: ".concat(decoded.slice(0, 80)));
                return;
              }
              _this.applyTextPayload(payload, resultMap, segments, function () {
                return snCounter++;
              });
            }

            // header.status=2 或 result.status=2 表示结束
            var headerStatus = msg === null || msg === void 0 || (_msg$header4 = msg.header) === null || _msg$header4 === void 0 ? void 0 : _msg$header4.status;
            var resultStatus = msg === null || msg === void 0 || (_msg$payload2 = msg.payload) === null || _msg$payload2 === void 0 || (_msg$payload2 = _msg$payload2.result) === null || _msg$payload2 === void 0 ? void 0 : _msg$payload2.status;
            if (headerStatus === 2 || resultStatus === 2) {
              finish();
            }
          } catch (e) {
            logger.error("[XfyunIat] \u89E3\u6790\u6D88\u606F\u5931\u8D25: ".concat((e === null || e === void 0 ? void 0 : e.message) || e));
          }
        });
        ws.on("error", function (err) {
          finish(new Error("WebSocket \u9519\u8BEF: ".concat(err.message)));
        });
        ws.on("close", function (code, reason) {
          if (!settled) {
            // 正常结束有时会在最后一帧 status=2 之后 close；若已有结果则成功
            if (resultMap.size > 0) {
              finish();
            } else {
              finish(new Error("\u8FDE\u63A5\u5173\u95ED\u4E14\u672A\u83B7\u5F97\u8BC6\u522B\u7ED3\u679C (code=".concat(code, ", reason=").concat((reason === null || reason === void 0 ? void 0 : reason.toString()) || "", ")")));
            }
          }
        });
      });
    }
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

      // pgs=rpl 时 rg 表示被替换的序号范围
      if (payload.pgs === "rpl" && Array.isArray(payload.rg) && payload.rg.length >= 2) {
        var _payload$rg = _slicedToArray(payload.rg, 2),
          from = _payload$rg[0],
          to = _payload$rg[1];
        for (var i = from; i <= to; i++) {
          resultMap["delete"](i);
        }
      }
      if (piece) {
        resultMap.set(sn, piece);
      }
    }
  }, {
    key: "sendAudioFrames",
    value: function () {
      var _sendAudioFrames = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(ws, audio, opts) {
        var total, offset, seq, isFirst, end, chunk, isLast, status, frame, _opts$eos;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              total = audio.length;
              offset = 0;
              seq = 1;
              isFirst = true;
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
              chunk = audio.subarray(offset, end);
              offset = end;
              isLast = offset >= total; // header.status / audio.status: 0 首帧, 1 中间, 2 尾帧
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
                    eos: (_opts$eos = opts.eos) !== null && _opts$eos !== void 0 ? _opts$eos : 6000,
                    result: {
                      encoding: "utf8",
                      compress: "raw",
                      format: "json"
                    }
                  }
                };
                if (opts.language) {
                  frame.parameter.iat.ln = opts.language;
                }
              }
              ws.send(JSON.stringify(frame));
              isFirst = false;
              seq += 1;
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
              // 若音频刚好被切完且最后一帧已是 status=2，服务端会开始返回最终结果
              logger.data("[XfyunIat] \u97F3\u9891\u53D1\u9001\u5B8C\u6210\uFF0C\u5171 ".concat(seq - 1, " \u5E27"));
            case 5:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function sendAudioFrames(_x, _x2, _x3) {
        return _sendAudioFrames.apply(this, arguments);
      }
      return sendAudioFrames;
    }()
  }]);
}();
function sleep(ms) {
  return new Promise(function (r) {
    return setTimeout(r, ms);
  });
}

/**
 * 从常见容器中提取可供识别的音频缓冲
 * - WAV: 去掉 RIFF 头，得到 PCM raw
 * - 纯 PCM / 未知但指定 raw: 原样返回
 * - MP3: 原样返回（encoding=lame）
 */
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

  // 默认按 PCM raw 处理（前端可直接上传 16k/16bit/mono PCM 或我们生成的 WAV）
  return {
    audio: buffer,
    encoding: "raw"
  };
}

/** 去掉 MP3 文件开头的 ID3v2 标签（文档建议移除） */
function stripMp3Id3(buf) {
  if (buf.length >= 10 && buf.toString("ascii", 0, 3) === "ID3") {
    var size = (buf[6] & 0x7f) << 21 | (buf[7] & 0x7f) << 14 | (buf[8] & 0x7f) << 7 | buf[9] & 0x7f;
    var headerLen = 10 + size;
    if (headerLen < buf.length) {
      return buf.subarray(headerLen);
    }
  }
  return buf;
}

/** 解析 WAV，提取 PCM data chunk */
function extractPcmFromWav(buf) {
  if (buf.length < 44 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
    // 非标准头，尝试跳过常见 44 字节
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
    // chunk 大小为奇数时会有 1 字节 padding
    offset = dataStart + chunkSize + chunkSize % 2;
  }

  // 找不到 data 块时退回跳过 44 字节
  return buf.subarray(44);
}

/**
 * 将 Int16 PCM 打包为标准 WAV（供前端录音上传）
 */
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
  header.writeUInt32LE(16, 16); // PCM fmt chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** 单例，便于路由复用 */
export var xfyunIatApi = new XfyunIatApi();