function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import express from "express";
import multer from "multer";
import { prepareAudioBuffer, xfyunIatApi } from "../Services/XfyunIatApi.js";
import { logger } from "../Utils/logger.js";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // 60s PCM 约 2MB，留余量
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: function fileFilter(_req, file, cb) {
    var allowed = ["audio/wav", "audio/wave", "audio/x-wav", "audio/mpeg", "audio/mp3", "audio/pcm", "application/octet-stream"];
    var name = (file.originalname || "").toLowerCase();
    var okExt = name.endsWith(".wav") || name.endsWith(".mp3") || name.endsWith(".pcm") || name.endsWith(".raw");
    if (allowed.includes(file.mimetype) || okExt) {
      cb(null, true);
    } else {
      cb(new Error("\u4E0D\u652F\u6301\u7684\u97F3\u9891\u7C7B\u578B: ".concat(file.mimetype, "\u3002\u8BF7\u4E0A\u4F20 WAV/PCM \u6216 MP3\uFF08\u226460s\uFF0C16k/16bit/\u5355\u58F0\u9053\u4F18\u5148\uFF09")));
    }
  }
});

/**
 * 语音识别路由 — 讯飞大模型多语种语音识别
 * 文档: https://www.xfyun.cn/doc/spark/spark_mul_cn_iat.html
 */
export function initializeSpeechRoutes(authenticateToken) {
  var router = express.Router();

  /**
   * GET /api/speech/status
   * 检查服务是否已配置
   */
  router.get("/status", authenticateToken, function (_req, res) {
    var mode = xfyunIatApi.getMode();
    res.json({
      configured: xfyunIatApi.isConfigured(),
      provider: mode === "spark" ? "xfyun-spark-mul-cn-iat" : "xfyun-voicedictation-iat",
      mode: mode,
      host: mode === "spark" ? process.env.XFYUN_IAT_HOST || "iat.cn-huabei-1.xf-yun.com" : process.env.XFYUN_CLASSIC_IAT_HOST || "iat-api.xfyun.cn",
      supportedFormats: ["wav/pcm (raw)", "mp3 (lame)"],
      maxDurationSec: 60,
      sampleRates: [8000, 16000]
    });
  });

  /**
   * POST /api/speech/recognize
   * 上传音频文件进行识别
   *
   * multipart/form-data:
   *   - file / audio: 音频文件（wav/pcm/mp3）
   *   - language: 可选，如 zh、en、zh|en
   *   - encoding: 可选，raw | lame（一般可自动推断）
   *   - sampleRate: 可选，16000 | 8000
   *   - eos: 可选，静音结束毫秒
   *
   * 或 JSON:
   *   - audio: base64 音频
   *   - mimeType / filename / encoding / sampleRate / language / eos
   */
  router.post("/recognize", authenticateToken, function (req, res, next) {
    var contentType = (req.headers["content-type"] || "").toString();
    if (contentType.includes("multipart/form-data")) {
      return upload.fields([{
        name: "file",
        maxCount: 1
      }, {
        name: "audio",
        maxCount: 1
      }])(req, res, next);
    }
    next();
  }, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var _req$files, _req$files2, _req$body6, _req$user, buffer, mimeType, filename, encoding, sampleRate, language, eos, uploaded, _req$body, _req$body2, _req$body3, _req$body4, _req$body5, sr, b64, prepared, finalEncoding, result, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            if (xfyunIatApi.isConfigured()) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(503).json({
              error: "语音识别服务未配置",
              hint: "请设置环境变量 XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET"
            }));
          case 1:
            sampleRate = 16000;
            uploaded = ((_req$files = req.files) === null || _req$files === void 0 || (_req$files = _req$files.file) === null || _req$files === void 0 ? void 0 : _req$files[0]) || ((_req$files2 = req.files) === null || _req$files2 === void 0 || (_req$files2 = _req$files2.audio) === null || _req$files2 === void 0 ? void 0 : _req$files2[0]) || req.file;
            if (uploaded) {
              buffer = uploaded.buffer;
              mimeType = uploaded.mimetype;
              filename = uploaded.originalname;
              language = (_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.language;
              eos = (_req$body2 = req.body) !== null && _req$body2 !== void 0 && _req$body2.eos ? Number(req.body.eos) : undefined;
              if (((_req$body3 = req.body) === null || _req$body3 === void 0 ? void 0 : _req$body3.encoding) === "raw" || ((_req$body4 = req.body) === null || _req$body4 === void 0 ? void 0 : _req$body4.encoding) === "lame") {
                encoding = req.body.encoding;
              }
              if ((_req$body5 = req.body) !== null && _req$body5 !== void 0 && _req$body5.sampleRate) {
                sr = Number(req.body.sampleRate);
                if (sr === 8000 || sr === 16000) sampleRate = sr;
              }
            } else if ((_req$body6 = req.body) !== null && _req$body6 !== void 0 && _req$body6.audio && typeof req.body.audio === "string") {
              b64 = String(req.body.audio).replace(/^data:audio\/[\w+-]+;base64,/, "");
              buffer = Buffer.from(b64, "base64");
              mimeType = req.body.mimeType;
              filename = req.body.filename;
              language = req.body.language;
              eos = req.body.eos != null ? Number(req.body.eos) : undefined;
              if (req.body.encoding === "raw" || req.body.encoding === "lame") {
                encoding = req.body.encoding;
              }
              if (req.body.sampleRate === 8000 || req.body.sampleRate === 16000) {
                sampleRate = req.body.sampleRate;
              }
            }
            if (!(!buffer || buffer.length === 0)) {
              _context.n = 2;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: "请上传音频文件（字段 file/audio）或提供 base64 字段 audio"
            }));
          case 2:
            prepared = prepareAudioBuffer(buffer, mimeType, filename);
            finalEncoding = encoding || prepared.encoding;
            logger.data("[Speech] \u8BC6\u522B\u8BF7\u6C42 user=".concat(((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.id) || "?", " size=").concat(prepared.audio.length, " encoding=").concat(finalEncoding, " lang=").concat(language || "auto"));
            _context.n = 3;
            return xfyunIatApi.recognize({
              audio: prepared.audio,
              encoding: finalEncoding,
              sampleRate: sampleRate,
              language: language,
              eos: eos
            });
          case 3:
            result = _context.v;
            res.json({
              success: true,
              text: result.text,
              sid: result.sid,
              segments: result.segments,
              encoding: finalEncoding,
              sampleRate: sampleRate,
              mode: result.mode
            });
            _context.n = 5;
            break;
          case 4:
            _context.p = 4;
            _t = _context.v;
            logger.error("[Speech] \u8BC6\u522B\u5931\u8D25: ".concat((_t === null || _t === void 0 ? void 0 : _t.message) || _t));
            if (!res.headersSent) {
              res.status(500).json({
                error: (_t === null || _t === void 0 ? void 0 : _t.message) || "语音识别失败"
              });
            }
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[0, 4]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  // Multer 错误处理
  router.use(function (err, _req, res, next) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "音频文件过大（最大 5MB，时长 ≤60s）"
        });
      }
      return res.status(400).json({
        error: "\u4E0A\u4F20\u9519\u8BEF: ".concat(err.message)
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