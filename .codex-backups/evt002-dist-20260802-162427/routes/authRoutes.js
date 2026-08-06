function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 认证相关路由：注册、登录、Exchange OAuth、CAF OAuth、SMTP 绑定
// 从 index.ts 拆出以降低 index.ts 耦合度

import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../Utils/logger.js";
import { dbService } from "../Services/dbService.js";
import { buildCafAuthorizeUrl, checkCafReady, createDefaultUserFields, handleCafCodeExchange } from "../Services/cafAuth.js";

// ── 类型 ───────────────────────────────────────────────────

// ── 用户工厂 ───────────────────────────────────────────────

function createDefaultUser(email, name, passwordHash) {
  return _objectSpread({
    id: uuidv4(),
    email: email,
    name: name,
    passwordHash: passwordHash
  }, createDefaultUserFields());
}

// ── 工厂函数 ───────────────────────────────────────────────

export function createAuthRoutes(ctx) {
  var userCache = ctx.userCache,
    signJwt = ctx.signJwt,
    verifyJwt = ctx.verifyJwt,
    findUserByEmail = ctx.findUserByEmail,
    authenticateToken = ctx.authenticateToken,
    frontendUrl = ctx.frontendUrl,
    exchangeOAuthConfig = ctx.exchangeOAuthConfig,
    cafConfig = ctx.cafConfig;
  var router = express.Router();

  // ── 本地注册（已禁用，仅允许 CAF 登录）─────────────────
  /*
  router.post("/register", async (req, res) => {
      const { email, password, name } = req.body || {};
      if (!email || !password || !name)
          return res
              .status(400)
              .json({ error: "email, password and name required" });
       try {
          const existingUser = await findUserByEmail(email);
          if (existingUser)
              return res.status(409).json({ error: "user already exists" });
           const passwordHash = await bcrypt.hash(password, 10);
          const user = createDefaultUser(email, name, passwordHash);
           const token = signJwt({ sub: user.id, email });
          user.JWTtoken = token;
           await dbService.addUser(user);
          userCache.set(user.id, user);
          return res.status(201).json({ token });
      } catch (error) {
          logger.error("Registration error:", error);
          return res.status(500).json({ error: "Failed to register user" });
      }
  });
  */

  // ── 本地登录（已禁用，仅允许 CAF 登录）─────────────────
  /*
  router.post("/login", async (req, res) => {
      const { email, password } = req.body || {};
      if (!email || !password)
          return res
              .status(400)
              .json({ error: "email and password required" });
       try {
          const user = await findUserByEmail(email);
          if (!user || !user.passwordHash)
              return res.status(401).json({ error: "invalid credentials" });
           const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok)
              return res.status(401).json({ error: "invalid credentials" });
           const token = signJwt({ sub: user.id, email: user.email });
          user.JWTtoken = token;
           await dbService.updateUser(user);
          userCache.set(user.id, user);
          return res.json({ token });
      } catch (error) {
          logger.error("Login error:", error);
          return res.status(500).json({ error: "Failed to login" });
      }
  });
  */

  // ── Exchange OAuth 发起 ────────────────────────────────

  router.get("/auth/exchange", function (req, res) {
    if (!exchangeOAuthConfig.clientId || !exchangeOAuthConfig.authUrl) {
      return res.status(500).send("Exchange Auth not configured on server.");
    }
    var providedJwt = req.query.jwt || function () {
      var auth = req.headers.authorization || "";
      if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
      return undefined;
    }();
    var loginHint = req.query.login_hint;
    var stateObj = {};
    if (providedJwt) stateObj.jwt = providedJwt;
    if (loginHint) stateObj.email = loginHint;
    var state = Object.keys(stateObj).length > 0 ? Buffer.from(JSON.stringify(stateObj)).toString("base64") : undefined;
    var params = new URLSearchParams({
      client_id: exchangeOAuthConfig.clientId,
      redirect_uri: exchangeOAuthConfig.redirectUri,
      response_type: "code",
      scope: exchangeOAuthConfig.scope,
      prompt: "login"
    });
    params.append("domain_hint", "organizations");
    if (state) params.append("state", state);
    if (loginHint) params.append("login_hint", loginHint);
    res.redirect("".concat(exchangeOAuthConfig.authUrl, "?").concat(params.toString()));
  });

  // ── Exchange OAuth 回调 ────────────────────────────────

  router.get("/auth/exchange/callback", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var code, error, errorDescription, state, bodyParams, tokenResponse, _tokenResponse$data, access_token, refresh_token, expires_in, expiresAt, providedJwt, loginHintEmail, decodedState, st, decoded, userId, user, _err$response, _err$response2, _t, _t2;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            code = req.query.code;
            error = req.query.error;
            errorDescription = req.query.error_description;
            state = req.query.state;
            if (!error) {
              _context.n = 2;
              break;
            }
            logger.error("Exchange Auth error callback:", error, errorDescription);
            if (!error.includes("invalid_scope")) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(400).send(exchangeErrorHtml(error, errorDescription)));
          case 1:
            return _context.a(2, res.status(400).send("Auth failed: ".concat(error, " - ").concat(errorDescription)));
          case 2:
            if (code) {
              _context.n = 3;
              break;
            }
            return _context.a(2, res.status(400).send("No code provided"));
          case 3:
            _context.p = 3;
            bodyParams = new URLSearchParams();
            bodyParams.append("client_id", exchangeOAuthConfig.clientId);
            bodyParams.append("client_secret", exchangeOAuthConfig.clientSecret);
            bodyParams.append("grant_type", "authorization_code");
            bodyParams.append("code", code);
            bodyParams.append("redirect_uri", exchangeOAuthConfig.redirectUri);
            bodyParams.append("scope", exchangeOAuthConfig.scope);
            _context.n = 4;
            return axios.post(exchangeOAuthConfig.tokenUrl, bodyParams, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            });
          case 4:
            tokenResponse = _context.v;
            _tokenResponse$data = tokenResponse.data, access_token = _tokenResponse$data.access_token, refresh_token = _tokenResponse$data.refresh_token, expires_in = _tokenResponse$data.expires_in;
            expiresAt = Date.now() + (expires_in || 3600) * 1000;
            try {
              if (state) {
                decodedState = Buffer.from(state, "base64").toString("utf-8");
                try {
                  st = JSON.parse(decodedState);
                  providedJwt = st.jwt;
                  loginHintEmail = st.email;
                } catch (_unused) {
                  providedJwt = decodedState;
                }
              }
            } catch (e) {
              logger.warn("Error parsing Exchange auth state:", e);
            }
            if (!providedJwt) {
              _context.n = 8;
              break;
            }
            decoded = verifyJwt(providedJwt);
            if (!(decoded && decoded.sub)) {
              _context.n = 8;
              break;
            }
            userId = decoded.sub;
            _context.n = 5;
            return dbService.getUserById(userId);
          case 5:
            _t = _context.v;
            if (_t) {
              _context.n = 6;
              break;
            }
            _t = undefined;
          case 6:
            user = _t;
            if (!user) {
              _context.n = 8;
              break;
            }
            user.ExchangeAccessToken = access_token;
            user.ExchangeRefreshToken = refresh_token;
            user.ExchangeTokenExpiresAt = expiresAt;
            user.ExchangeBinded = true;
            if (loginHintEmail) {
              user.XJTLUaccount = loginHintEmail;
            }
            _context.n = 7;
            return dbService.updateUser(user);
          case 7:
            userCache.set(userId, user);
            logger.info("Bound Exchange OAuth to user ".concat(userId));
            return _context.a(2, res.send(exchangeBoundHtml()));
          case 8:
            res.status(400).send("Failed to bind to user session. Please try again from the settings page.");
            _context.n = 10;
            break;
          case 9:
            _context.p = 9;
            _t2 = _context.v;
            logger.error("Exchange Token Exchange failed:", ((_err$response = _t2.response) === null || _err$response === void 0 ? void 0 : _err$response.data) || _t2.message);
            res.status(500).send("Token exchange failed: ".concat(JSON.stringify(((_err$response2 = _t2.response) === null || _err$response2 === void 0 ? void 0 : _err$response2.data) || _t2.message)));
          case 10:
            return _context.a(2);
        }
      }, _callee, null, [[3, 9]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  // ── IMAP 绑定 ──────────────────────────────────────────

  router.post("/auth/imap/bind", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var user, _ref3, imapEmail, imapPassword, imapHost, imapPort, imapTls;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            user = req.user;
            _ref3 = req.body || {}, imapEmail = _ref3.imapEmail, imapPassword = _ref3.imapPassword, imapHost = _ref3.imapHost, imapPort = _ref3.imapPort, imapTls = _ref3.imapTls;
            if (!(!imapEmail || !imapPassword || !imapHost || !imapPort)) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "Missing required IMAP configuration fields"
            }));
          case 1:
            user.ImapEmail = imapEmail;
            user.ImapPassword = imapPassword;
            user.ImapHost = imapHost;
            user.ImapPort = Number(imapPort);
            user.ImapTls = imapTls !== false;
            user.ImapBinded = true;
            _context2.n = 2;
            return dbService.updateUser(user);
          case 2:
            userCache.set(user.id, user);
            res.json({
              success: true,
              message: "IMAP bound successfully"
            });
          case 3:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  router.post("/auth/imap/unbind", authenticateToken, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var user;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            user = req.user;
            user.ImapBinded = false;
            user.ImapEmail = undefined;
            user.ImapPassword = undefined;
            user.ImapHost = undefined;
            user.ImapPort = undefined;
            user.ImapTls = undefined;
            _context3.n = 1;
            return dbService.updateUser(user);
          case 1:
            userCache.set(user.id, user);
            res.json({
              success: true,
              message: "IMAP unbound successfully"
            });
          case 2:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function (_x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }());

  // ── CAF OAuth ──────────────────────────────────────────

  var cafLookup = {
    userCache: userCache,
    findUserByEmail: findUserByEmail,
    findUserByCafSub: ctx.findUserByCafSub
  };
  router.get("/auth/caf", function (_req, res) {
    var notReady = checkCafReady(cafConfig);
    if (notReady) return res.status(500).send(notReady);
    res.redirect(buildCafAuthorizeUrl(cafConfig, cafConfig.redirectUri));
  });
  router.get("/api/auth/caf/authorize-url", function (req, res) {
    var notReady = checkCafReady(cafConfig);
    if (notReady) return res.status(500).json({
      error: notReady
    });
    var platform = req.query.platform || "web";
    var redirectUri = platform === "mobile" ? cafConfig.mobileRedirectUri : cafConfig.redirectUri;
    res.json({
      url: buildCafAuthorizeUrl(cafConfig, redirectUri),
      platform: platform
    });
  });
  router.get("/auth/caf/callback", /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var code, _yield$handleCafCodeE, jwtToken, _email, emailParam, _error$response, msg, _t3;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            code = req.query.code;
            if (code) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, res.status(400).send("No authorization code provided by CAF."));
          case 1:
            _context4.p = 1;
            _context4.n = 2;
            return handleCafCodeExchange(cafLookup, cafConfig, code, cafConfig.redirectUri, signJwt);
          case 2:
            _yield$handleCafCodeE = _context4.v;
            jwtToken = _yield$handleCafCodeE.jwtToken;
            _email = _yield$handleCafCodeE.email;
            emailParam = _email ? "&email=".concat(encodeURIComponent(_email)) : "";
            return _context4.a(2, res.redirect("".concat(frontendUrl, "/login?token=").concat(encodeURIComponent(jwtToken), "&from=caf").concat(emailParam)));
          case 3:
            _context4.p = 3;
            _t3 = _context4.v;
            logger.error("CAF OAuth callback failed:", ((_error$response = _t3.response) === null || _error$response === void 0 ? void 0 : _error$response.data) || _t3.message);
            msg = encodeURIComponent("CAF 登录失败，请稍后重试");
            return _context4.a(2, res.redirect("".concat(frontendUrl, "/login?caf_error=").concat(msg)));
        }
      }, _callee4, null, [[1, 3]]);
    }));
    return function (_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }());
  router.post("/api/auth/caf/token", /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
      var _req$body;
      var code, _yield$handleCafCodeE2, jwtToken, _email2, name, _error$response2, _t4;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            code = (_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.code;
            if (code) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2, res.status(400).json({
              error: "code is required"
            }));
          case 1:
            _context5.p = 1;
            _context5.n = 2;
            return handleCafCodeExchange(cafLookup, cafConfig, code, cafConfig.mobileRedirectUri, signJwt);
          case 2:
            _yield$handleCafCodeE2 = _context5.v;
            jwtToken = _yield$handleCafCodeE2.jwtToken;
            _email2 = _yield$handleCafCodeE2.email;
            name = _yield$handleCafCodeE2.name;
            res.json({
              token: jwtToken,
              email: _email2,
              name: name
            });
            _context5.n = 4;
            break;
          case 3:
            _context5.p = 3;
            _t4 = _context5.v;
            logger.error("CAF mobile token exchange failed:", ((_error$response2 = _t4.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data) || _t4.message);
            res.status(500).json({
              error: _t4.message || "CAF 登录失败，请稍后重试"
            });
          case 4:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 3]]);
    }));
    return function (_x9, _x0) {
      return _ref6.apply(this, arguments);
    };
  }());
  return router;
}

// ── Exchange 错误页面 ──────────────────────────────────────

function exchangeErrorHtml(error, errorDescription) {
  return "\n<!DOCTYPE html>\n<html><head>\n<style>\nbody{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;max-width:800px;margin:0 auto;padding:20px;color:#333}\nh1{color:#d32f2f;margin-bottom:20px}\n.card{background:#f8f9fa;border:1px solid #ddd;border-radius:8px;padding:20px;box-shadow:0 2px 4px rgba(0,0,0,0.05)}\ncode{background:#e9ecef;padding:2px 5px;border-radius:4px;font-family:Consolas,monospace}\nol{padding-left:20px}li{margin-bottom:10px}strong{color:#C00}\n</style></head><body>\n<h1>\u6388\u6743\u5931\u8D25\uFF1A\u6743\u9650\u8303\u56F4 (Scope) \u9519\u8BEF</h1>\n<div class=\"card\">\n<p>Azure \u62D2\u7EDD\u4E86\u60A8\u7684\u8BF7\u6C42\uFF0C\u56E0\u4E3A\u5E94\u7528\u6CA1\u6709\u6B63\u786E\u914D\u7F6E <strong>Microsoft Graph Delegated</strong> \u6743\u9650\u3002</p>\n<p>\u5F53\u524D\u9ED8\u8BA4 Scope \u4E3A\uFF1A<code>offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read</code></p>\n<h3>\u6838\u5FC3\u6392\u67E5\u70B9\uFF1A\u5E94\u7528\u6CE8\u518C\u7C7B\u578B (Supported Account Types)</h3>\n<p><strong>\u8FD9\u662F\u6700\u53EF\u80FD\u7684\u539F\u56E0\uFF1A</strong> \u60A8\u53EF\u80FD\u6B63\u5728\u5C1D\u8BD5\u4F7F\u7528\u4E00\u4E2A\u4EC5\u652F\u6301\"\u4E2A\u4EBA\u8D26\u6237\"\u7684\u5E94\u7528 ID \u6765\u8BF7\u6C42\"\u4F01\u4E1A/\u5B66\u6821\"\u7684 Graph \u6743\u9650\u3002</p>\n<ul>\n<li><strong>\u73B0\u8C61\uFF1A</strong> \u5B66\u6821\u90AE\u7BB1\u53EF\u5728 Outlook \u5BA2\u6237\u7AEF\u767B\u5F55\uFF0C\u4F46\u81EA\u6CE8\u518C\u5E94\u7528\u767B\u5F55\u65F6\u63D0\u793A\u9700\u8981\u7BA1\u7406\u5458\u6388\u6743\u6216 scope \u65E0\u6548\u3002</li>\n<li><strong>\u89E3\u51B3\u65B9\u6848\uFF1A</strong><ol>\n<li>\u5728 Azure Portal \u6CE8\u518C\u65B0\u7684 App\uFF0C\u9009\u62E9 <strong>\"Accounts in any organizational directory (Any Azure AD directory - Multitenant)\"</strong></li>\n<li>\u6DFB\u52A0 API \u6743\u9650 (Microsoft Graph Delegated) \u548C Redirect URI</li>\n<li>\u66F4\u65B0 <code>EXCHANGE_CLIENT_ID</code> \u548C <code>EXCHANGE_CLIENT_SECRET</code> \u5230 <code>.env</code></li>\n</ol></li></ul>\n<h3>\u5907\u9009\u68C0\u67E5\u6B65\u9AA4</h3><ol>\n<li>\u786E\u4FDD\u5DF2\u6DFB\u52A0 <strong>\"Microsoft Graph\"</strong> -> <strong>\"Mail.Read\"</strong>\u3001<strong>\"Calendars.Read\"</strong>\uFF08Delegated\uFF09</li>\n<li>\u8BA9\u7BA1\u7406\u5458\u5728 Entra ID \u4E2D\u5141\u8BB8\u7528\u6237\u540C\u610F\u4F4E\u98CE\u9669\u5E94\u7528\u6743\u9650</li>\n<li>\u7BA1\u7406\u5458\u70B9\u51FB <strong>\"Grant admin consent\"</strong></li>\n</ol>\n<p><small style=\"color:#666\">\u9519\u8BEF\u4EE3\u7801: ".concat(error, " - ").concat(errorDescription, "</small></p>\n</div></body></html>");
}
function exchangeBoundHtml() {
  return "<h1>Exchange \u7ED1\u5B9A\u6210\u529F!</h1><p>\u60A8\u53EF\u4EE5\u5173\u95ED\u6B64\u7A97\u53E3\u5E76\u5237\u65B0\u4E3B\u5E94\u7528\u3002</p><script>window.opener?.postMessage({type:\"EXCHANGE_BOUND\"},\"*\");setTimeout(()=>window.close(),3000);</script>";
}