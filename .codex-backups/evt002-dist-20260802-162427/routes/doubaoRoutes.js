function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import express from "express";
import multer from "multer";
import path from "path";
import { DoubaoMultimodalApi } from "../Services/DoubaoMultimodalApi.js";
import { logger } from "../Utils/logger.js";

// 使用内存存储，文件转为 Buffer 后传递给 API
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB 限制
  },
  fileFilter: function fileFilter(_req, file, cb) {
    var allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"];
    var allowedAudioTypes = ["audio/wav", "audio/wave", "audio/mpeg", "audio/mp3", "audio/ogg", "audio/opus", "audio/flac", "audio/aac", "audio/mp4", "audio/x-m4a", "audio/webm"];
    var allowed = [].concat(allowedImageTypes, allowedAudioTypes);
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("\u4E0D\u652F\u6301\u7684\u6587\u4EF6\u7C7B\u578B: ".concat(file.mimetype, "\u3002\u652F\u6301\u7684\u683C\u5F0F: JPEG, PNG, GIF, WebP, BMP, WAV, MP3, OGG, FLAC, AAC, M4A, WebM")));
    }
  }
});

/**
 * 初始化豆包多模态路由
 * @param authenticateToken 身份验证中间件
 */
export function initializeDoubaoRoutes(authenticateToken) {
  var router = express.Router();

  // 初始化豆包API服务
  var doubaoApi = new DoubaoMultimodalApi(process.env.ARK_API_KEY || process.env.OPENAI_API_KEY || "", process.env.DOUBAO_MODEL || "doubao-seed-2-0-pro-260215");

  /**
   * POST /api/doubao/chat
   * 多模态对话接口：接受图片/音频文件 + 文字，返回模型响应
   *
   * Body (multipart/form-data):
   *   - file: 图片或音频文件
   *   - prompt: 用户文字提示
   *   - systemPrompt: 系统提示词（可选）
   *   - stream: 是否流式返回（可选，默认 false）
   */
  router.post("/chat", authenticateToken, upload.single("file"), /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var file, _req$body, prompt, systemPrompt, wantStream, isImage, isAudio, base64, ext, sendSSE, result, _result, _t, _t2;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            file = req.file;
            _req$body = req.body, prompt = _req$body.prompt, systemPrompt = _req$body.systemPrompt, wantStream = _req$body.stream;
            if (file) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "请上传图片或音频文件"
            }));
          case 1:
            if (!(!prompt || typeof prompt !== "string")) {
              _context.n = 2;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "请提供 prompt 文字提示"
            }));
          case 2:
            isImage = file.mimetype.startsWith("image/");
            isAudio = file.mimetype.startsWith("audio/");
            if (!(!isImage && !isAudio)) {
              _context.n = 3;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "不支持的文件类型，请上传图片或音频文件"
            }));
          case 3:
            base64 = file.buffer.toString("base64");
            ext = path.extname(file.originalname).replace(".", "");
            if (!(wantStream === "true" || wantStream === true)) {
              _context.n = 11;
              break;
            }
            // SSE 流式响应
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.setHeader("X-Accel-Buffering", "no");
            sendSSE = function sendSSE(data) {
              res.write("data: ".concat(JSON.stringify({
                content: data
              }), "\n\n"));
            };
            _context.p = 4;
            if (!isImage) {
              _context.n = 6;
              break;
            }
            _context.n = 5;
            return doubaoApi.chatWithImageStream(base64, file.mimetype, prompt, systemPrompt || undefined, sendSSE);
          case 5:
            _context.n = 8;
            break;
          case 6:
            if (!isAudio) {
              _context.n = 8;
              break;
            }
            _context.n = 7;
            return doubaoApi.chatWithAudio(base64, ext, prompt, systemPrompt || undefined);
          case 7:
            result = _context.v;
            sendSSE(result);
          case 8:
            res.write("data: [DONE]\n\n");
            res.end();
            _context.n = 10;
            break;
          case 9:
            _context.p = 9;
            _t = _context.v;
            logger.error("[Doubao Route] \u6D41\u5F0F\u8C03\u7528\u5931\u8D25: ".concat(_t.message));
            if (!res.headersSent) {
              res.status(500).json({
                error: _t.message || "流式调用失败"
              });
            } else {
              res.write("data: ".concat(JSON.stringify({
                error: _t.message
              }), "\n\n"));
              res.end();
            }
          case 10:
            _context.n = 16;
            break;
          case 11:
            if (!isImage) {
              _context.n = 13;
              break;
            }
            _context.n = 12;
            return doubaoApi.chatWithImage(base64, file.mimetype, prompt, systemPrompt || undefined);
          case 12:
            _result = _context.v;
            _context.n = 15;
            break;
          case 13:
            _context.n = 14;
            return doubaoApi.chatWithAudio(base64, ext, prompt, systemPrompt || undefined);
          case 14:
            _result = _context.v;
          case 15:
            res.json({
              success: true,
              content: _result,
              fileType: isImage ? "image" : "audio"
            });
          case 16:
            _context.n = 18;
            break;
          case 17:
            _context.p = 17;
            _t2 = _context.v;
            logger.error("[Doubao Route] \u5904\u7406\u5931\u8D25: ".concat(_t2.message || _t2));
            if (!res.headersSent) {
              res.status(500).json({
                error: _t2.message || "多模态处理失败"
              });
            }
          case 18:
            return _context.a(2);
        }
      }, _callee, null, [[4, 9], [0, 17]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  /**
   * POST /api/doubao/chat/text
   * 纯文本对话（使用豆包模型）
   *
   * Body (JSON):
   *   - prompt: 用户文字
   *   - systemPrompt: 系统提示词（可选）
   *   - temperature: 温度参数（可选，默认 0.7）
   *   - stream: 是否流式返回（可选，默认 false）
   */
  router.post("/chat/text", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var _req$body2, prompt, systemPrompt, _req$body2$temperatur, temperature, wantStream, result, _t3, _t4;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _req$body2 = req.body, prompt = _req$body2.prompt, systemPrompt = _req$body2.systemPrompt, _req$body2$temperatur = _req$body2.temperature, temperature = _req$body2$temperatur === void 0 ? 0.7 : _req$body2$temperatur, wantStream = _req$body2.stream;
            if (!(!prompt || typeof prompt !== "string")) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "请提供 prompt 文字"
            }));
          case 1:
            if (!wantStream) {
              _context2.n = 6;
              break;
            }
            // SSE 流式响应
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.setHeader("X-Accel-Buffering", "no");
            _context2.p = 2;
            _context2.n = 3;
            return doubaoApi.chatStream(prompt, systemPrompt, temperature, function (text) {
              res.write("data: ".concat(JSON.stringify({
                content: text
              }), "\n\n"));
            });
          case 3:
            res.write("data: [DONE]\n\n");
            res.end();
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t3 = _context2.v;
            if (!res.headersSent) {
              res.status(500).json({
                error: _t3.message || "流式调用失败"
              });
            } else {
              res.write("data: ".concat(JSON.stringify({
                error: _t3.message
              }), "\n\n"));
              res.end();
            }
          case 5:
            _context2.n = 8;
            break;
          case 6:
            _context2.n = 7;
            return doubaoApi.chat(prompt, systemPrompt, temperature);
          case 7:
            result = _context2.v;
            res.json({
              success: true,
              content: result
            });
          case 8:
            _context2.n = 10;
            break;
          case 9:
            _context2.p = 9;
            _t4 = _context2.v;
            logger.error("[Doubao Text Route] \u5904\u7406\u5931\u8D25: ".concat(_t4.message || _t4));
            if (!res.headersSent) {
              res.status(500).json({
                error: _t4.message || "对话失败"
              });
            }
          case 10:
            return _context2.a(2);
        }
      }, _callee2, null, [[2, 4], [0, 9]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  /**
   * GET /api/doubao/status
   * 检查豆包API连接状态
   */
  router.get("/status", authenticateToken, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(_req, res) {
      var result, _t5;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            _context3.n = 1;
            return doubaoApi.chat("你好，请回复'OK'表示你正常工作。", undefined, 0.1);
          case 1:
            result = _context3.v;
            res.json({
              connected: true,
              model: process.env.DOUBAO_MODEL || "doubao-seed-2-0-pro-260215",
              testResponse: result.substring(0, 100)
            });
            _context3.n = 3;
            break;
          case 2:
            _context3.p = 2;
            _t5 = _context3.v;
            res.json({
              connected: false,
              error: _t5.message || "连接失败"
            });
          case 3:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 2]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  // Multer 错误处理中间件
  router.use(function (err, _req, res, next) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "文件大小超过限制（最大20MB）"
        });
      }
      return res.status(400).json({
        error: "\u6587\u4EF6\u4E0A\u4F20\u9519\u8BEF: ".concat(err.message)
      });
    }
    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }
    next();
  });
  return router;
}