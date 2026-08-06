function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// 主入口 — 仅负责 app 配置、中间件、路由挂载和服务器启动
// 业务逻辑已拆分至：
//   server/types/models.ts        全局数据模型（Task, Profile, User）
//   server/Services/cafAuth.ts    CAF 认证逻辑
//   server/routes/authRoutes.ts   认证路由（/register, /login, /auth/*, SMTP）
//   server/routes/apiRoutes.ts    API 路由
//   server/intervals.ts           后台定时任务

import * as msal from "@azure/msal-node";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { dbService } from "./Services/dbService.js";
import { initializeApiRoutes } from "./routes/apiRoutes.js";
import { initializeAlgorithmRoutes } from "./routes/algorithmRoutes.js";
import { initializeDoubaoRoutes } from "./routes/doubaoRoutes.js";
import { initializeSpeechRoutes } from "./routes/speechRoutes.js";
import ebridgeRoutes from "./routes/ebridgeRoutes.js";
import { initWebSocket, broadcastUserLog } from "./Services/websocket.js";
import { logUserEvent } from "./Services/userLog.js";
import { logger } from "./Utils/logger.js";
import { startIntervals } from "./intervals.js";
import { initializeMcpRoutes } from "./Services/mcp.js";
import { initializeCalDavServer } from "./routes/caldavServerRoutes.js";
import { createAdminRouter } from "./routes/adminRoutes.js";
import { initializeTodoRoutes } from "./routes/todoRoutes.js";
import { initializeUserStatusRoutes } from "./routes/userStatusRoutes.js";
import { initializeCommunityRoutes } from "./routes/communityRoutes.js";
import { initializeUserProfileRoutes } from "./routes/userProfileRoutes.js";
import { initializeFollowRoutes } from "./routes/followRoutes.js";
import { initializeRejectionBufferRoutes } from "./routes/rejectionBufferRoutes.js";
import { initializeChaoxingRoutes } from "./routes/chaoxingRoutes.js";
import { initializeReminderStateRoutes } from "./routes/reminderStateRoutes.js";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createAuthRoutes } from "./routes/authRoutes.js";
import { createCafConfig, ensureCafClientCredentials } from "./Services/cafAuth.js";

// 重新导出，保持向后兼容

// Load environment variables
dotenv.config({
  path: "server/.env"
});
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

// 全局错误处理
process.on("unhandledRejection", function (reason, promise) {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", function (error) {
  var _error$message;
  logger.error("Uncaught Exception:", error);
  if ((_error$message = error.message) !== null && _error$message !== void 0 && _error$message.includes("EADDRINUSE")) {
    logger.error("Port already in use, exiting...");
    process.exit(1);
  }
});

// ── Express 初始化 ─────────────────────────────────────────

var app = express();
app.use(cors());
app.use(function (req, res, next) {
  if (req.path === "/api/mcp/messages" || req.path === "/ws") {
    next();
  } else {
    express.json()(req, res, next);
  }
});
var PORT = process.env.PORT || 3000;
var isDev = process.env.VITE_DEV_MODE === "true";
var FRONTEND_URL = isDev ? "http://localhost:5173" : process.env.FRONTEND_URL || "http://localhost:5173";
var BACKEND_URL = process.env.BACKEND_URL || "http://localhost:".concat(PORT);

// ── 用户缓存 ───────────────────────────────────────────────

var userCache = new Map();

// ── JWT ────────────────────────────────────────────────────

var JWT_SECRET = process.env.JWT_SECRET || "";
var JWT_EXPIRES_IN = "1h";
function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}
function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_unused) {
    return null;
  }
}

// ── 用户查找 ───────────────────────────────────────────────
function findUserByEmail(_x) {
  return _findUserByEmail.apply(this, arguments);
}
function _findUserByEmail() {
  _findUserByEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(email) {
    var _iterator, _step, u, user, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _iterator = _createForOfIteratorHelper(userCache.values());
          _context4.p = 1;
          _iterator.s();
        case 2:
          if ((_step = _iterator.n()).done) {
            _context4.n = 4;
            break;
          }
          u = _step.value;
          if (!(u.email.toLowerCase() === email.toLowerCase())) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, u);
        case 3:
          _context4.n = 2;
          break;
        case 4:
          _context4.n = 6;
          break;
        case 5:
          _context4.p = 5;
          _t3 = _context4.v;
          _iterator.e(_t3);
        case 6:
          _context4.p = 6;
          _iterator.f();
          return _context4.f(6);
        case 7:
          _context4.n = 8;
          return dbService.getUserByEmail(email);
        case 8:
          user = _context4.v;
          if (user) userCache.set(user.id, user);
          return _context4.a(2, user);
      }
    }, _callee4, null, [[1, 5, 6, 7]]);
  }));
  return _findUserByEmail.apply(this, arguments);
}
function findUserByCafSub(_x2) {
  return _findUserByCafSub.apply(this, arguments);
}
function _findUserByCafSub() {
  _findUserByCafSub = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(cafSub) {
    var _iterator2, _step2, u, user, _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _iterator2 = _createForOfIteratorHelper(userCache.values());
          _context5.p = 1;
          _iterator2.s();
        case 2:
          if ((_step2 = _iterator2.n()).done) {
            _context5.n = 4;
            break;
          }
          u = _step2.value;
          if (!(u.CAFSub === cafSub)) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, u);
        case 3:
          _context5.n = 2;
          break;
        case 4:
          _context5.n = 6;
          break;
        case 5:
          _context5.p = 5;
          _t4 = _context5.v;
          _iterator2.e(_t4);
        case 6:
          _context5.p = 6;
          _iterator2.f();
          return _context5.f(6);
        case 7:
          _context5.n = 8;
          return dbService.getUserByCafSub(cafSub);
        case 8:
          user = _context5.v;
          if (user) userCache.set(user.id, user);
          return _context5.a(2, user);
      }
    }, _callee5, null, [[1, 5, 6, 7]]);
  }));
  return _findUserByCafSub.apply(this, arguments);
}
function pairMsTokenToUser(_x3, _x4, _x5) {
  return _pairMsTokenToUser.apply(this, arguments);
} // ── 身份验证中间件 ─────────────────────────────────────────
function _pairMsTokenToUser() {
  _pairMsTokenToUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId, msToken, refreshToken) {
    var u, _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          u = userCache.get(userId);
          if (u) {
            _context6.n = 3;
            break;
          }
          _context6.n = 1;
          return dbService.getUserById(userId);
        case 1:
          _t5 = _context6.v;
          if (_t5) {
            _context6.n = 2;
            break;
          }
          _t5 = undefined;
        case 2:
          u = _t5;
          if (u) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, false);
        case 3:
          u.MStoken = msToken;
          if (refreshToken) u.MSRefreshToken = refreshToken;
          u.MSbinded = true;
          _context6.n = 4;
          return dbService.updateUser(u);
        case 4:
          userCache.set(userId, u);
          return _context6.a(2, true);
      }
    }, _callee6);
  }));
  return _pairMsTokenToUser.apply(this, arguments);
}
function authenticateToken(_x6, _x7, _x8) {
  return _authenticateToken.apply(this, arguments);
} // ── Microsoft 配置 ─────────────────────────────────────────
function _authenticateToken() {
  _authenticateToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res, next) {
    var token, decoded, user, _t6;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          token = req.headers.authorization && req.headers.authorization.split(" ")[1];
          if (!token && req.query.token) token = req.query.token;
          if (token) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, res.status(401).json({
            error: "Access token required"
          }));
        case 1:
          decoded = verifyJwt(token);
          if (decoded) {
            _context7.n = 2;
            break;
          }
          return _context7.a(2, res.status(403).json({
            error: "Invalid or expired token"
          }));
        case 2:
          user = userCache.get(decoded.sub);
          if (user) {
            _context7.n = 5;
            break;
          }
          _context7.n = 3;
          return dbService.getUserById(decoded.sub);
        case 3:
          _t6 = _context7.v;
          if (_t6) {
            _context7.n = 4;
            break;
          }
          _t6 = undefined;
        case 4:
          user = _t6;
          if (user) userCache.set(user.id, user);
        case 5:
          if (user) {
            _context7.n = 6;
            break;
          }
          return _context7.a(2, res.status(404).json({
            error: "User not found"
          }));
        case 6:
          req.user = user;
          next();
        case 7:
          return _context7.a(2);
      }
    }, _callee7);
  }));
  return _authenticateToken.apply(this, arguments);
}
var config = {
  auth: {
    clientId: process.env.MS_CLIENT_ID || "",
    authority: process.env.MS_AUTHORITY || "https://login.microsoftonline.com/common",
    clientSecret: process.env.MS_CLIENT_SECRET
  }
};
if (!config.auth.clientSecret) {
  logger.error("错误: MS_CLIENT_SECRET 环境变量未设置!");
  process.exit(1);
}
if (!config.auth.clientId) {
  logger.error("错误: MS_CLIENT_ID 环境变量未设置!");
  process.exit(1);
}
logger.info("Microsoft configuration loaded from environment variables");

// ── Exchange OAuth 配置 ────────────────────────────────────

var defaultAuthority = process.env.MS_AUTHORITY || "https://login.microsoftonline.com/common";
var authority = defaultAuthority.endsWith("/") ? defaultAuthority.slice(0, -1) : defaultAuthority;
var exchangeOAuthConfig = {
  clientId: process.env.EXCHANGE_CLIENT_ID || process.env.MS_CLIENT_ID || "",
  clientSecret: process.env.EXCHANGE_CLIENT_SECRET || process.env.MS_CLIENT_SECRET || "",
  authUrl: process.env.EXCHANGE_AUTH_URL || "".concat(authority, "/oauth2/v2.0/authorize"),
  tokenUrl: process.env.EXCHANGE_TOKEN_URL || "".concat(authority, "/oauth2/v2.0/token"),
  redirectUri: process.env.EXCHANGE_REDIRECT_URI || "".concat(BACKEND_URL, "/auth/exchange/callback"),
  scope: process.env.EXCHANGE_SCOPE || "offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read"
};

// ── CAF 配置 ───────────────────────────────────────────────

var cafConfig = createCafConfig(BACKEND_URL);

// ── MSAL ───────────────────────────────────────────────────

var pca = new msal.ConfidentialClientApplication(config);

// ── MS Todo 路由 ──────────────────────────────────────────

app.get("/auth", function (req, res) {
  var providedJwt = req.query.jwt || function () {
    var auth = req.headers.authorization || "";
    if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
    return undefined;
  }();
  var state = providedJwt ? Buffer.from(providedJwt).toString("base64") : undefined;
  var authCodeUrlParameters = {
    scopes: ["https://graph.microsoft.com/Tasks.ReadWrite"],
    redirectUri: "https://schedule.apoints.cn/redirect"
  };
  if (state) authCodeUrlParameters.state = state;
  pca.getAuthCodeUrl(authCodeUrlParameters).then(function (response) {
    return res.redirect(response);
  })["catch"](function (error) {
    logger.error("Error generating auth URL:", error);
    res.status(500).send("Error generating auth URL");
  });
});
app.get("/redirect", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var tokenRequest, response, providedJwt, a, decoded, paired, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          logger.info("MS redirect received, code:", !!req.query.code, "state:", !!req.query.state, "jwt:", !!req.query.jwt);
          tokenRequest = {
            code: req.query.code,
            scopes: ["https://graph.microsoft.com/Tasks.ReadWrite"],
            redirectUri: "".concat(FRONTEND_URL, "/redirect")
          };
          _context.p = 1;
          _context.n = 2;
          return pca.acquireTokenByCode(tokenRequest);
        case 2:
          response = _context.v;
          logger.info("Access token acquired:", response.accessToken);
          if (req.query.state) {
            try {
              providedJwt = Buffer.from(req.query.state, "base64").toString("utf8");
              logger.info("State decoded to JWT, length:", providedJwt.length);
            } catch (_unused2) {
              logger.warn("Invalid state encoding");
            }
          }
          if (!providedJwt && req.query.jwt) providedJwt = req.query.jwt;
          if (!providedJwt) {
            a = req.headers.authorization || "";
            if (a.toLowerCase().startsWith("bearer ")) providedJwt = a.slice(7).trim();
          }
          if (!providedJwt) {
            _context.n = 7;
            break;
          }
          decoded = verifyJwt(providedJwt);
          logger.info("JWT verified:", !!decoded, "sub:", decoded === null || decoded === void 0 ? void 0 : decoded.sub);
          if (!(decoded !== null && decoded !== void 0 && decoded.sub)) {
            _context.n = 5;
            break;
          }
          _context.n = 3;
          return pairMsTokenToUser(decoded.sub, response.accessToken || "");
        case 3:
          paired = _context.v;
          if (!paired) {
            _context.n = 4;
            break;
          }
          logger.info("Paired MS token to user ".concat(decoded.sub));
          return _context.a(2, res.redirect("".concat(FRONTEND_URL, "/dashboard?ms_bound=true")));
        case 4:
          logger.warn("User not found for MS token pairing: ".concat(decoded.sub));
          _context.n = 6;
          break;
        case 5:
          logger.warn("Invalid JWT in MS auth redirect state");
        case 6:
          _context.n = 8;
          break;
        case 7:
          logger.warn("MS auth redirect without JWT/state, cannot pair to user");
        case 8:
          return _context.a(2, res.redirect("".concat(FRONTEND_URL, "/dashboard?ms_bound=false")));
        case 9:
          _context.p = 9;
          _t = _context.v;
          logger.error("Token acquisition error:", _t);
          res.status(500).send("Authentication failed");
        case 10:
          return _context.a(2);
      }
    }, _callee, null, [[1, 9]]);
  }));
  return function (_x9, _x0) {
    return _ref.apply(this, arguments);
  };
}());

// ── 挂载路由 ───────────────────────────────────────────────

// 认证路由（注册、登录、Exchange、CAF、SMTP）
app.use(createAuthRoutes({
  userCache: userCache,
  signJwt: signJwt,
  verifyJwt: verifyJwt,
  findUserByEmail: findUserByEmail,
  findUserByCafSub: findUserByCafSub,
  authenticateToken: authenticateToken,
  frontendUrl: FRONTEND_URL,
  exchangeOAuthConfig: exchangeOAuthConfig,
  cafConfig: cafConfig
}));

// API 路由
app.use("/api", initializeApiRoutes(authenticateToken, FRONTEND_URL));

// 待办 / 标签路由
app.use("/api", initializeTodoRoutes(authenticateToken));

// 用户状态统计路由
app.use("/api", initializeUserStatusRoutes(authenticateToken));

// 社区排名路由
app.use("/api", initializeCommunityRoutes(authenticateToken));

// 用户关注
app.use("/api", initializeFollowRoutes(authenticateToken));

// 用户个人主页
app.use("/api", initializeUserProfileRoutes(authenticateToken));

// 事件拒绝缓冲池路由
app.use("/api", initializeRejectionBufferRoutes(authenticateToken));

// 学习通 / Chaoxing
app.use("/api", initializeChaoxingRoutes(authenticateToken));

// 跨设备提醒已读状态同步
app.use("/api", initializeReminderStateRoutes(authenticateToken));

// 算法路由
app.use("/api/algorithms", initializeAlgorithmRoutes(authenticateToken));

// 豆包多模态路由
app.use("/api/doubao", initializeDoubaoRoutes(authenticateToken));

// 讯飞语音识别路由
app.use("/api/speech", initializeSpeechRoutes(authenticateToken));

// Ebridge 路由
app.use("/api/ebridge", ebridgeRoutes);

// Ebridge 保存课表 URL
app.post("/api/ebridge/save-url", authenticateToken, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var user, _ref3, timetableUrl;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          user = req.user;
          _ref3 = req.body || {}, timetableUrl = _ref3.timetableUrl;
          if (!(!timetableUrl || typeof timetableUrl !== "string" || !timetableUrl.startsWith("http"))) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(400).json({
            error: "Invalid timetable URL"
          }));
        case 1:
          user.timetableUrl = timetableUrl;
          user.ebridgeBinded = true;
          _context2.n = 2;
          return dbService.updateUser(user);
        case 2:
          userCache.set(user.id, user);
          res.json({
            success: true
          });
        case 3:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return function (_x1, _x10) {
    return _ref2.apply(this, arguments);
  };
}());

// Admin 路由
app.use("/api/admin", authenticateToken, createAdminRouter());

// MCP 路由
initializeMcpRoutes(app, authenticateToken);

// CalDAV Server
initializeCalDavServer({
  app: app,
  baseUrl: BACKEND_URL + "/caldav",
  jwtVerify: function jwtVerify(token) {
    return verifyJwt(token);
  },
  userLookup: function () {
    var _userLookup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(sub) {
      var user, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            user = userCache.get(sub);
            if (user) {
              _context3.n = 3;
              break;
            }
            _context3.n = 1;
            return dbService.getUserById(sub);
          case 1:
            _t2 = _context3.v;
            if (_t2) {
              _context3.n = 2;
              break;
            }
            _t2 = undefined;
          case 2:
            user = _t2;
            if (user) userCache.set(user.id, user);
          case 3:
            return _context3.a(2, user);
        }
      }, _callee3);
    }));
    function userLookup(_x11) {
      return _userLookup.apply(this, arguments);
    }
    return userLookup;
  }()
});

// 用户上传资源（头像等）— 须在 catch-all 之前
var uploadsDir = path.join(process.cwd(), "private", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true
  });
}
app.use("/uploads", express["static"](uploadsDir));

// 静态文件
app.use(express["static"](path.join(__dirname, "../../dist")));
app.get("*", function (req, res) {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return res.status(404).json({
      error: "Not Found"
    });
  }
  res.sendFile(path.join(__dirname, "../../dist/index.html"), function (err) {
    if (err && !res.headersSent) {
      res.status(404).send("Frontend not built or not found.");
    }
  });
});

// ── 启动 ───────────────────────────────────────────────────
function startServer() {
  return _startServer.apply(this, arguments);
}
function _startServer() {
  _startServer = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var users, _cafError$response, server, _t7, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return dbService.initialize();
        case 1:
          dbService.setLogListener(broadcastUserLog);
          _context8.n = 2;
          return dbService.getAllUsers();
        case 2:
          users = _context8.v;
          users.forEach(function (u) {
            return userCache.set(u.id, u);
          });
          logger.info("Loaded ".concat(users.length, " users from database"));
          _context8.p = 3;
          _context8.n = 4;
          return ensureCafClientCredentials(cafConfig);
        case 4:
          _context8.n = 6;
          break;
        case 5:
          _context8.p = 5;
          _t7 = _context8.v;
          logger.error("CAF auto-registration failed:", (_t7 === null || _t7 === void 0 || (_cafError$response = _t7.response) === null || _cafError$response === void 0 ? void 0 : _cafError$response.data) || (_t7 === null || _t7 === void 0 ? void 0 : _t7.message) || _t7);
        case 6:
          server = app.listen(PORT, function () {
            logger.info("Server running on http://localhost:".concat(PORT));
            logger.info("Visit http://localhost:".concat(PORT, "/auth to start authentication"));
          });
          initWebSocket(server, function () {
            return userCache.values();
          });
          _context8.n = 8;
          break;
        case 7:
          _context8.p = 7;
          _t8 = _context8.v;
          logger.error("Failed to start server:", _t8);
          process.exit(1);
        case 8:
          return _context8.a(2);
      }
    }, _callee8, null, [[3, 5], [0, 7]]);
  }));
  return _startServer.apply(this, arguments);
}
startServer();
startIntervals(function () {
  return userCache.values();
});

// ── 导出的工具函数 ─────────────────────────────────────────

export function createTaskToUser(_x12, _x13) {
  return _createTaskToUser.apply(this, arguments);
}
function _createTaskToUser() {
  _createTaskToUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(user, taskData) {
    var _t9;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          _context9.n = 1;
          return dbService.addTask(user.id, taskData, !!user.conflictBoundaryInclusive, user.isConflictScheduleAllowed);
        case 1:
          _context9.n = 2;
          return dbService.refreshUserTasksIncremental(user, {
            addedIds: [taskData.id]
          });
        case 2:
          _context9.n = 3;
          return logUserEvent(user.id, "taskCreated", "Created task ".concat(taskData.name, " via helper"), {
            id: taskData.id
          });
        case 3:
          logger.success("Task created successfully for user ".concat(user.id, ": ").concat(taskData.name));
          _context9.n = 5;
          break;
        case 4:
          _context9.p = 4;
          _t9 = _context9.v;
          logger.error("Failed to create task for user ".concat(user.id, ":"), _t9);
          throw _t9;
        case 5:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 4]]);
  }));
  return _createTaskToUser.apply(this, arguments);
}
