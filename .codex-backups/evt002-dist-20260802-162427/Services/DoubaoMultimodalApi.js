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
function _asyncIterator(r) { var n, t, o, e = 2; for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) { if (t && null != (n = r[t])) return n.call(r); if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r)); t = "@@asyncIterator", o = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(r) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var n = r.done; return Promise.resolve(r.value).then(function (r) { return { value: r, done: n }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) { this.s = r, this.n = r.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, "return": function _return(r) { var n = this.s["return"]; return void 0 === n ? Promise.resolve({ value: r, done: !0 }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); }, "throw": function _throw(r) { var n = this.s["return"]; return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(r); }
import OpenAI from "openai";
import { logger } from "../Utils/logger.js";

/**
 * 豆包多模态模型API服务
 * 使用火山引擎 Ark 平台的 OpenAI 兼容接口
 * 支持图片和音频输入的多模态对话
 */
export var DoubaoMultimodalApi = /*#__PURE__*/function () {
  function DoubaoMultimodalApi(apiKey) {
    var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "doubao-seed-2-0-pro-260215";
    var baseURL = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "https://ark.cn-beijing.volces.com/api/v3";
    _classCallCheck(this, DoubaoMultimodalApi);
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = baseURL;
    this.client = new OpenAI({
      baseURL: baseURL,
      apiKey: apiKey
    });
    logger.success("\u8C46\u5305\u591A\u6A21\u6001API\u521D\u59CB\u5316\u6210\u529F\uFF0C\u6A21\u578B: ".concat(model));
  }

  /**
   * 图片 + 文字多模态对话（使用 Chat Completions Vision API）
   * @param imageBase64 图片的 base64 编码
   * @param mimeType 图片 MIME 类型，如 image/jpeg, image/png
   * @param prompt 用户的文字提示
   * @param systemPrompt 系统提示词（可选）
   * @returns API 响应文本
   */
  return _createClass(DoubaoMultimodalApi, [{
    key: "chatWithImage",
    value: (function () {
      var _chatWithImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(imageBase64, mimeType, prompt, systemPrompt) {
        var _response$choices$, dataUri, messages, response, content, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              dataUri = "data:".concat(mimeType, ";base64,").concat(imageBase64);
              messages = [];
              if (systemPrompt) {
                messages.push({
                  role: "system",
                  content: systemPrompt
                });
              }
              messages.push({
                role: "user",
                content: [{
                  type: "image_url",
                  image_url: {
                    url: dataUri,
                    detail: "auto"
                  }
                }, {
                  type: "text",
                  text: prompt
                }]
              });
              logger.data("[Doubao Image Chat] Prompt: ".concat(prompt.substring(0, 200)));
              _context.n = 1;
              return this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 4096
              });
            case 1:
              response = _context.v;
              content = ((_response$choices$ = response.choices[0]) === null || _response$choices$ === void 0 || (_response$choices$ = _response$choices$.message) === null || _response$choices$ === void 0 ? void 0 : _response$choices$.content) || "";
              logger.success("[Doubao Image Chat] \u54CD\u5E94\u957F\u5EA6: ".concat(content.length));
              return _context.a(2, content);
            case 2:
              _context.p = 2;
              _t = _context.v;
              logger.error("[Doubao Image Chat] \u8C03\u7528\u5931\u8D25: ".concat(_t.message || _t));
              throw _t;
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function chatWithImage(_x, _x2, _x3, _x4) {
        return _chatWithImage.apply(this, arguments);
      }
      return chatWithImage;
    }()
    /**
     * 图片 + 文字多模态流式对话
     * @param imageBase64 图片 base64
     * @param mimeType 图片 MIME 类型
     * @param prompt 用户提示
     * @param systemPrompt 系统提示
     * @param onChunk 每个文本块的回调
     */
    )
  }, {
    key: "chatWithImageStream",
    value: (function () {
      var _chatWithImageStream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(imageBase64, mimeType, prompt, systemPrompt, onChunk) {
        var dataUri, messages, stream, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, chunk, _chunk$choices$, delta, _t2, _t3;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              dataUri = "data:".concat(mimeType, ";base64,").concat(imageBase64);
              messages = [];
              if (systemPrompt) {
                messages.push({
                  role: "system",
                  content: systemPrompt
                });
              }
              messages.push({
                role: "user",
                content: [{
                  type: "image_url",
                  image_url: {
                    url: dataUri,
                    detail: "auto"
                  }
                }, {
                  type: "text",
                  text: prompt
                }]
              });
              logger.data("[Doubao Image Stream] Prompt: ".concat(prompt.substring(0, 200)));
              _context2.n = 1;
              return this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 4096,
                stream: true
              });
            case 1:
              stream = _context2.v;
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context2.p = 2;
              _iterator = _asyncIterator(stream);
            case 3:
              _context2.n = 4;
              return _iterator.next();
            case 4:
              if (!(_iteratorAbruptCompletion = !(_step = _context2.v).done)) {
                _context2.n = 6;
                break;
              }
              chunk = _step.value;
              delta = (_chunk$choices$ = chunk.choices[0]) === null || _chunk$choices$ === void 0 || (_chunk$choices$ = _chunk$choices$.delta) === null || _chunk$choices$ === void 0 ? void 0 : _chunk$choices$.content;
              if (delta) {
                onChunk(delta);
              }
            case 5:
              _iteratorAbruptCompletion = false;
              _context2.n = 3;
              break;
            case 6:
              _context2.n = 8;
              break;
            case 7:
              _context2.p = 7;
              _t2 = _context2.v;
              _didIteratorError = true;
              _iteratorError = _t2;
            case 8:
              _context2.p = 8;
              _context2.p = 9;
              if (!(_iteratorAbruptCompletion && _iterator["return"] != null)) {
                _context2.n = 10;
                break;
              }
              _context2.n = 10;
              return _iterator["return"]();
            case 10:
              _context2.p = 10;
              if (!_didIteratorError) {
                _context2.n = 11;
                break;
              }
              throw _iteratorError;
            case 11:
              return _context2.f(10);
            case 12:
              return _context2.f(8);
            case 13:
              logger.success("[Doubao Image Stream] 流式响应完成");
              _context2.n = 15;
              break;
            case 14:
              _context2.p = 14;
              _t3 = _context2.v;
              logger.error("[Doubao Image Stream] \u8C03\u7528\u5931\u8D25: ".concat(_t3.message || _t3));
              throw _t3;
            case 15:
              return _context2.a(2);
          }
        }, _callee2, this, [[9,, 10, 12], [2, 7, 8, 13], [0, 14]]);
      }));
      function chatWithImageStream(_x5, _x6, _x7, _x8, _x9) {
        return _chatWithImageStream.apply(this, arguments);
      }
      return chatWithImageStream;
    }()
    /**
     * 音频 + 文字多模态对话（使用 Responses API）
     * 音频将被发送到豆包模型进行理解
     * @param audioBase64 音频 base64 编码
     * @param audioFormat 音频格式，如 wav, mp3, ogg
     * @param prompt 用户的文字提示
     * @param systemPrompt 系统提示词（可选）
     * @returns API 响应文本
     */
    )
  }, {
    key: "chatWithAudio",
    value: (function () {
      var _chatWithAudio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(audioBase64, audioFormat, prompt, systemPrompt) {
        var _result$output, _result$choices, mimeType, dataUri, input, response, errText, result, content, _t4;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              mimeType = this.getAudioMimeType(audioFormat);
              dataUri = "data:".concat(mimeType, ";base64,").concat(audioBase64);
              input = [];
              if (systemPrompt) {
                input.push({
                  role: "system",
                  content: systemPrompt
                });
              }
              input.push({
                role: "user",
                content: [{
                  type: "input_audio",
                  input_audio: {
                    data: dataUri,
                    format: audioFormat
                  }
                }, {
                  type: "input_text",
                  text: prompt
                }]
              });
              logger.data("[Doubao Audio Chat] Prompt: ".concat(prompt.substring(0, 200), ", format: ").concat(audioFormat));

              // 使用 Responses API (原生 fetch)
              _context3.n = 1;
              return fetch("".concat(this.baseURL, "/responses"), {
                method: "POST",
                headers: {
                  Authorization: "Bearer ".concat(this.apiKey),
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  model: this.model,
                  input: input
                })
              });
            case 1:
              response = _context3.v;
              if (response.ok) {
                _context3.n = 3;
                break;
              }
              _context3.n = 2;
              return response.text();
            case 2:
              errText = _context3.v;
              throw new Error("Responses API error ".concat(response.status, ": ").concat(errText));
            case 3:
              _context3.n = 4;
              return response.json();
            case 4:
              result = _context3.v;
              content = (result === null || result === void 0 || (_result$output = result.output) === null || _result$output === void 0 || (_result$output = _result$output[0]) === null || _result$output === void 0 || (_result$output = _result$output.content) === null || _result$output === void 0 || (_result$output = _result$output[0]) === null || _result$output === void 0 ? void 0 : _result$output.text) || (result === null || result === void 0 || (_result$choices = result.choices) === null || _result$choices === void 0 || (_result$choices = _result$choices[0]) === null || _result$choices === void 0 || (_result$choices = _result$choices.message) === null || _result$choices === void 0 ? void 0 : _result$choices.content) || "";
              logger.success("[Doubao Audio Chat] \u54CD\u5E94\u957F\u5EA6: ".concat(content.length));
              return _context3.a(2, content);
            case 5:
              _context3.p = 5;
              _t4 = _context3.v;
              logger.error("[Doubao Audio Chat] \u8C03\u7528\u5931\u8D25: ".concat(_t4.message || _t4));
              throw _t4;
            case 6:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 5]]);
      }));
      function chatWithAudio(_x0, _x1, _x10, _x11) {
        return _chatWithAudio.apply(this, arguments);
      }
      return chatWithAudio;
    }()
    /**
     * 纯文本对话
     */
    )
  }, {
    key: "chat",
    value: (function () {
      var _chat = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(prompt, systemPrompt) {
        var temperature,
          _response$choices$2,
          messages,
          response,
          _args4 = arguments,
          _t5;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              temperature = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 0.7;
              _context4.p = 1;
              messages = [];
              if (systemPrompt) {
                messages.push({
                  role: "system",
                  content: systemPrompt
                });
              }
              messages.push({
                role: "user",
                content: prompt
              });
              _context4.n = 2;
              return this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: temperature,
                max_tokens: 4096
              });
            case 2:
              response = _context4.v;
              return _context4.a(2, ((_response$choices$2 = response.choices[0]) === null || _response$choices$2 === void 0 || (_response$choices$2 = _response$choices$2.message) === null || _response$choices$2 === void 0 ? void 0 : _response$choices$2.content) || "");
            case 3:
              _context4.p = 3;
              _t5 = _context4.v;
              logger.error("[Doubao Chat] \u8C03\u7528\u5931\u8D25: ".concat(_t5.message || _t5));
              throw _t5;
            case 4:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 3]]);
      }));
      function chat(_x12, _x13) {
        return _chat.apply(this, arguments);
      }
      return chat;
    }()
    /**
     * 纯文本流式对话
     */
    )
  }, {
    key: "chatStream",
    value: (function () {
      var _chatStream = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(prompt, systemPrompt, temperature, onChunk) {
        var messages, stream, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, chunk, _chunk$choices$2, delta, _t6, _t7;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              messages = [];
              if (systemPrompt) {
                messages.push({
                  role: "system",
                  content: systemPrompt
                });
              }
              messages.push({
                role: "user",
                content: prompt
              });
              _context5.n = 1;
              return this.client.chat.completions.create({
                model: this.model,
                messages: messages,
                temperature: temperature,
                max_tokens: 4096,
                stream: true
              });
            case 1:
              stream = _context5.v;
              _iteratorAbruptCompletion2 = false;
              _didIteratorError2 = false;
              _context5.p = 2;
              _iterator2 = _asyncIterator(stream);
            case 3:
              _context5.n = 4;
              return _iterator2.next();
            case 4:
              if (!(_iteratorAbruptCompletion2 = !(_step2 = _context5.v).done)) {
                _context5.n = 6;
                break;
              }
              chunk = _step2.value;
              delta = (_chunk$choices$2 = chunk.choices[0]) === null || _chunk$choices$2 === void 0 || (_chunk$choices$2 = _chunk$choices$2.delta) === null || _chunk$choices$2 === void 0 ? void 0 : _chunk$choices$2.content;
              if (delta) {
                onChunk(delta);
              }
            case 5:
              _iteratorAbruptCompletion2 = false;
              _context5.n = 3;
              break;
            case 6:
              _context5.n = 8;
              break;
            case 7:
              _context5.p = 7;
              _t6 = _context5.v;
              _didIteratorError2 = true;
              _iteratorError2 = _t6;
            case 8:
              _context5.p = 8;
              _context5.p = 9;
              if (!(_iteratorAbruptCompletion2 && _iterator2["return"] != null)) {
                _context5.n = 10;
                break;
              }
              _context5.n = 10;
              return _iterator2["return"]();
            case 10:
              _context5.p = 10;
              if (!_didIteratorError2) {
                _context5.n = 11;
                break;
              }
              throw _iteratorError2;
            case 11:
              return _context5.f(10);
            case 12:
              return _context5.f(8);
            case 13:
              _context5.n = 15;
              break;
            case 14:
              _context5.p = 14;
              _t7 = _context5.v;
              logger.error("[Doubao Stream] \u8C03\u7528\u5931\u8D25: ".concat(_t7.message || _t7));
              throw _t7;
            case 15:
              return _context5.a(2);
          }
        }, _callee5, this, [[9,, 10, 12], [2, 7, 8, 13], [0, 14]]);
      }));
      function chatStream(_x14, _x15, _x16, _x17) {
        return _chatStream.apply(this, arguments);
      }
      return chatStream;
    }()
    /**
     * 根据文件扩展名获取音频 MIME 类型
     */
    )
  }, {
    key: "getAudioMimeType",
    value: function getAudioMimeType(format) {
      var mimeMap = {
        wav: "audio/wav",
        wave: "audio/wav",
        mp3: "audio/mpeg",
        mpeg: "audio/mpeg",
        ogg: "audio/ogg",
        opus: "audio/opus",
        flac: "audio/flac",
        aac: "audio/aac",
        m4a: "audio/mp4",
        wma: "audio/x-ms-wma",
        webm: "audio/webm"
      };
      return mimeMap[format.toLowerCase()] || "audio/".concat(format);
    }
  }]);
}();