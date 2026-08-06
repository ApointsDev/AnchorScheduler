function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// CAF (Central Authentication Facility) 认证相关逻辑
// 包括：配置、子服务器注册、OAuth token 交换、用户查找/创建、token 刷新

import axios from "axios";
import path from "path";
import { promises as fs } from "fs";
import { generateKeyPairSync } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import { dbService } from "./dbService.js";
import { logUserEvent } from "./userLog.js";

// ── CAF 配置 ───────────────────────────────────────────────

export function createCafConfig(backendUrl) {
  var raw = process.env.CAF_SERVER_BASE_URL || "";
  var baseUrl = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return {
    baseUrl: baseUrl,
    clientId: "",
    clientSecret: "",
    redirectUri: process.env.CAF_REDIRECT_URI || "".concat(backendUrl, "/auth/caf/callback"),
    mobileRedirectUri: process.env.CAF_MOBILE_REDIRECT_URI || "schedule.apoints://caf/callback",
    subServerName: process.env.CAF_SUBSERVER_NAME || "AI Time Manager",
    emailDomain: process.env.CAF_EMAIL_DOMAIN || "apoints.email",
    imapHost: process.env.CAF_IMAP_HOST || "imap.apoints.email",
    imapPort: Number(process.env.CAF_IMAP_PORT) || 993
  };
}

// ── 文件路径 ───────────────────────────────────────────────

function getCafCredsFile() {
  return process.env.CAF_CREDENTIALS_FILE || path.join(process.cwd(), "server", ".caf-client.json");
}
function getCafPublicKeyFile() {
  return process.env.CAF_PUBLIC_KEY_FILE || path.join(process.cwd(), "server", ".caf-public.pem");
}
function getCafPrivateKeyFile() {
  return process.env.CAF_PRIVATE_KEY_FILE || path.join(process.cwd(), "server", ".caf-private.pem");
}

// ── 密钥管理 ───────────────────────────────────────────────

export function ensureCafKeyPair() {
  return _ensureCafKeyPair.apply(this, arguments);
}

/** 从持久化文件中读取 CAF client credentials */
function _ensureCafKeyPair() {
  _ensureCafKeyPair = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var pubFile, privFile, _yield$Promise$all, _yield$Promise$all2, publicKey, privateKey, pair, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          pubFile = getCafPublicKeyFile();
          privFile = getCafPrivateKeyFile();
          _context.p = 1;
          _context.n = 2;
          return Promise.all([fs.readFile(pubFile, "utf8"), fs.readFile(privFile, "utf8")]);
        case 2:
          _yield$Promise$all = _context.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          publicKey = _yield$Promise$all2[0];
          privateKey = _yield$Promise$all2[1];
          return _context.a(2, {
            publicKey: publicKey,
            privateKey: privateKey
          });
        case 3:
          _context.p = 3;
          _t = _context.v;
          pair = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
              type: "spki",
              format: "pem"
            },
            privateKeyEncoding: {
              type: "pkcs8",
              format: "pem"
            }
          });
          _context.n = 4;
          return fs.mkdir(path.dirname(pubFile), {
            recursive: true
          });
        case 4:
          _context.n = 5;
          return Promise.all([fs.writeFile(pubFile, pair.publicKey, "utf8"), fs.writeFile(privFile, pair.privateKey, {
            encoding: "utf8",
            mode: 384
          })]);
        case 5:
          logger.info("Generated CAF RSA key pair for subserver registration.");
          return _context.a(2, {
            publicKey: pair.publicKey,
            privateKey: pair.privateKey
          });
      }
    }, _callee, null, [[1, 3]]);
  }));
  return _ensureCafKeyPair.apply(this, arguments);
}
export function loadCafCredsFromFile() {
  return _loadCafCredsFromFile.apply(this, arguments);
}
function _loadCafCredsFromFile() {
  _loadCafCredsFromFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var f, raw, parsed, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          f = getCafCredsFile();
          _context2.n = 1;
          return fs.readFile(f, "utf8");
        case 1:
          raw = _context2.v;
          parsed = JSON.parse(raw);
          if (!(parsed !== null && parsed !== void 0 && parsed.id && parsed !== null && parsed !== void 0 && parsed.secret)) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2, {
            clientId: String(parsed.id),
            clientSecret: String(parsed.secret)
          });
        case 2:
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
        case 4:
          return _context2.a(2, null);
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return _loadCafCredsFromFile.apply(this, arguments);
}
function saveCafCredentials(_x) {
  return _saveCafCredentials.apply(this, arguments);
}
/**
 * 确保 CAF 子服务器已注册，获取 clientId/clientSecret 并持久化。
 * 返回 true 表示 CAF 就绪，false 表示已跳过（未配置 baseUrl）。
 */
function _saveCafCredentials() {
  _saveCafCredentials = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(credentials) {
    var f;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          f = getCafCredsFile();
          _context3.n = 1;
          return fs.mkdir(path.dirname(f), {
            recursive: true
          });
        case 1:
          _context3.n = 2;
          return fs.writeFile(f, JSON.stringify(credentials, null, 2), "utf8");
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return _saveCafCredentials.apply(this, arguments);
}
export function ensureCafClientCredentials(_x2) {
  return _ensureCafClientCredentials.apply(this, arguments);
}

// ── JWT 解码 ───────────────────────────────────────────────
function _ensureCafClientCredentials() {
  _ensureCafClientCredentials = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(cafConfig) {
    var _registerResp$data, _registerResp$data2;
    var persisted, _yield$ensureCafKeyPa, publicKey, registerResp, id, secret;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (cafConfig.baseUrl) {
            _context4.n = 1;
            break;
          }
          logger.warn("CAF_SERVER_BASE_URL is empty, CAF login is disabled.");
          return _context4.a(2, false);
        case 1:
          _context4.n = 2;
          return loadCafCredsFromFile();
        case 2:
          persisted = _context4.v;
          if (!persisted) {
            _context4.n = 3;
            break;
          }
          cafConfig.clientId = persisted.clientId;
          cafConfig.clientSecret = persisted.clientSecret;
          logger.info("Loaded CAF subserver credentials from persisted file.");
          return _context4.a(2, true);
        case 3:
          _context4.n = 4;
          return ensureCafKeyPair();
        case 4:
          _yield$ensureCafKeyPa = _context4.v;
          publicKey = _yield$ensureCafKeyPa.publicKey;
          _context4.n = 5;
          return axios.post("".concat(cafConfig.baseUrl, "/api/subserver/register"), {
            name: cafConfig.subServerName,
            public_key: publicKey
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          });
        case 5:
          registerResp = _context4.v;
          id = (_registerResp$data = registerResp.data) === null || _registerResp$data === void 0 ? void 0 : _registerResp$data.id;
          secret = (_registerResp$data2 = registerResp.data) === null || _registerResp$data2 === void 0 ? void 0 : _registerResp$data2.secret;
          if (!(!id || !secret)) {
            _context4.n = 6;
            break;
          }
          throw new Error("CAF register response missing id/secret");
        case 6:
          cafConfig.clientId = String(id);
          cafConfig.clientSecret = String(secret);
          _context4.n = 7;
          return saveCafCredentials({
            id: cafConfig.clientId,
            secret: cafConfig.clientSecret
          });
        case 7:
          logger.info("CAF subserver auto-registration completed and credentials persisted.");
          return _context4.a(2, true);
      }
    }, _callee4);
  }));
  return _ensureCafClientCredentials.apply(this, arguments);
}
export function decodeJwtPayload(token) {
  try {
    var parts = token.split(".");
    if (parts.length < 2) return null;
    var base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    var normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    var json = Buffer.from(normalized, "base64").toString("utf8");
    return JSON.parse(json);
  } catch (_unused) {
    return null;
  }
}

// ── 用户信息 ───────────────────────────────────────────────

export function fetchCafUserInfo(_x3, _x4) {
  return _fetchCafUserInfo.apply(this, arguments);
}

// ── Token 刷新 ─────────────────────────────────────────────

// 防止并发刷新同一个用户的 token（CAF 通常使用 refresh token rotation，
// 并发使用同一个 refresh_token 会导致第二次请求失败）
function _fetchCafUserInfo() {
  _fetchCafUserInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(cafConfig, accessToken) {
    var userinfoPaths, _i, _userinfoPaths, p, resp, d, _email, name, _t3;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          userinfoPaths = ["/api/userinfo", "/api/oauth/userinfo", "/api/user/info"];
          _i = 0, _userinfoPaths = userinfoPaths;
        case 1:
          if (!(_i < _userinfoPaths.length)) {
            _context5.n = 7;
            break;
          }
          p = _userinfoPaths[_i];
          _context5.p = 2;
          _context5.n = 3;
          return axios.get("".concat(cafConfig.baseUrl).concat(p), {
            headers: {
              Authorization: "Bearer ".concat(accessToken)
            },
            timeout: 5000,
            validateStatus: function validateStatus(s) {
              return s < 500;
            }
          });
        case 3:
          resp = _context5.v;
          if (!(resp.status === 200 && resp.data)) {
            _context5.n = 4;
            break;
          }
          d = resp.data;
          _email = d.email || d.preferred_username || d.upn || "";
          name = d.name || d.displayName || d.username || d.preferred_name || "";
          if (!(_email || name)) {
            _context5.n = 4;
            break;
          }
          logger.info("CAF userinfo resolved via ".concat(p));
          return _context5.a(2, {
            email: _email || undefined,
            name: name || undefined
          });
        case 4:
          _context5.n = 6;
          break;
        case 5:
          _context5.p = 5;
          _t3 = _context5.v;
        case 6:
          _i++;
          _context5.n = 1;
          break;
        case 7:
          return _context5.a(2, {});
      }
    }, _callee5, null, [[2, 5]]);
  }));
  return _fetchCafUserInfo.apply(this, arguments);
}
var refreshLocks = new Map();
export function refreshCafToken(_x5, _x6) {
  return _refreshCafToken.apply(this, arguments);
}
function _refreshCafToken() {
  _refreshCafToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(cafConfig, user) {
    var resp, _ref, access_token, refresh_token, expires_in, _axiosErr$response, _axiosErr$response2, message, axiosErr, responseStatus, responseData, detail, _t4;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          if (!(!user.CAFRefreshToken || !cafConfig.baseUrl || !cafConfig.clientId || !cafConfig.clientSecret)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, false);
        case 1:
          _context6.p = 1;
          _context6.n = 2;
          return axios.post("".concat(cafConfig.baseUrl, "/api/oauth/token"), {
            grant_type: "refresh_token",
            client_id: cafConfig.clientId,
            client_secret: cafConfig.clientSecret,
            refresh_token: user.CAFRefreshToken
          }, {
            headers: {
              "Content-Type": "application/json"
            },
            timeout: 15000
          });
        case 2:
          resp = _context6.v;
          _ref = resp.data || {}, access_token = _ref.access_token, refresh_token = _ref.refresh_token, expires_in = _ref.expires_in;
          if (access_token) {
            _context6.n = 3;
            break;
          }
          logger.warn("CAF token refresh returned no access_token for ".concat(user.id));
          return _context6.a(2, false);
        case 3:
          user.CAFAccessToken = access_token;
          if (refresh_token) user.CAFRefreshToken = refresh_token;
          user.CAFTokenExpiresAt = Date.now() + (Number(expires_in) || 3600) * 1000;
          _context6.n = 4;
          return dbService.updateUser(user);
        case 4:
          _context6.n = 5;
          return logUserEvent(user.id, "caf_token_refreshed", "CAF token \u5237\u65B0\u6210\u529F", {
            expiresAt: new Date(user.CAFTokenExpiresAt).toISOString(),
            expiresIn: Number(expires_in) || 3600
          });
        case 5:
          logger.info("CAF token refreshed for ".concat(user.id, " (expires: ").concat(new Date(user.CAFTokenExpiresAt).toISOString(), ")"));
          return _context6.a(2, true);
        case 6:
          _context6.p = 6;
          _t4 = _context6.v;
          message = _t4 instanceof Error ? _t4.message : String(_t4);
          axiosErr = _t4 && _typeof(_t4) === "object" ? _t4 : null;
          responseStatus = axiosErr === null || axiosErr === void 0 || (_axiosErr$response = axiosErr.response) === null || _axiosErr$response === void 0 ? void 0 : _axiosErr$response.status;
          responseData = axiosErr === null || axiosErr === void 0 || (_axiosErr$response2 = axiosErr.response) === null || _axiosErr$response2 === void 0 ? void 0 : _axiosErr$response2.data;
          detail = responseStatus ? "HTTP ".concat(responseStatus, ": ").concat(JSON.stringify(responseData || message)) : responseData || message;
          _context6.n = 7;
          return logUserEvent(user.id, "caf_token_refresh_failed", "CAF token \u5237\u65B0\u5931\u8D25", {
            error: detail
          });
        case 7:
          logger.error("CAF token refresh failed for ".concat(user.id, ":"), detail);
          return _context6.a(2, false);
      }
    }, _callee6, null, [[1, 6]]);
  }));
  return _refreshCafToken.apply(this, arguments);
}
export function ensureCafTokenValid(_x7, _x8) {
  return _ensureCafTokenValid.apply(this, arguments);
}

// ── 欢迎任务 ───────────────────────────────────────────────
function _ensureCafTokenValid() {
  _ensureCafTokenValid = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(cafConfig, user) {
    var threshold, lock, ok;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          if (user.CAFAccessToken) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, null);
        case 1:
          threshold = 5 * 60 * 1000;
          if (!(user.CAFTokenExpiresAt && Date.now() < user.CAFTokenExpiresAt - threshold)) {
            _context7.n = 2;
            break;
          }
          return _context7.a(2, user.CAFAccessToken);
        case 2:
          if (!user.CAFRefreshToken) {
            _context7.n = 5;
            break;
          }
          // 使用锁防止并发刷新竞争
          lock = refreshLocks.get(user.id);
          if (!lock) {
            lock = refreshCafToken(cafConfig, user)["finally"](function () {
              refreshLocks["delete"](user.id);
            });
            refreshLocks.set(user.id, lock);
          }
          _context7.n = 3;
          return lock;
        case 3:
          ok = _context7.v;
          if (!ok) {
            _context7.n = 4;
            break;
          }
          return _context7.a(2, user.CAFAccessToken);
        case 4:
          // 刷新失败，不再使用旧 token（可能已被 CAF 服务端作废，
          // 继续使用会导致 IMAP/其他服务反复 401）
          logger.warn("CAF token refresh failed for ".concat(user.id, ", discarding stale token"));
          return _context7.a(2, null);
        case 5:
          logger.warn("CAF token expired and cannot be refreshed for ".concat(user.id));
          return _context7.a(2, null);
      }
    }, _callee7);
  }));
  return _ensureCafTokenValid.apply(this, arguments);
}
export function createDefaultWelcomeTask() {
  return {
    id: uuidv4(),
    name: "测试任务",
    description: "恭喜你成功注册时锚平台~新的任务会推送到这里哦",
    dueDate: toShanghaiISO(),
    startTime: toShanghaiISO(),
    endTime: toShanghaiISO(),
    completed: false,
    pushedToMSTodo: false,
    scheduleType: "single"
  };
}

/** 创建新用户的默认基础字段（不含 id/email/name/passwordHash） */
export function createDefaultUserFields() {
  return {
    MSbinded: false,
    ExchangeBinded: false,
    ImapBinded: false,
    ebridgeBinded: false,
    onboardingCompleted: false,
    timetableUrl: "",
    timetableFetchLevel: 0,
    mailReadingSpan: Number(process.env.EMAIL_READ_LIMIT) || 30,
    conflictBoundaryInclusive: false,
    isConflictScheduleAllowed: true,
    tasks: [createDefaultWelcomeTask()],
    userProfile: {
      company: "",
      school: "Xi'an Jiaotong-Liverpool University",
      campus: "SIP",
      schoolYear: "Year 1"
    }
  };
}

// ── findOrCreateCafUser ────────────────────────────────────
// 需要外部注入 userCache + 查找函数以避免循环依赖

export function findOrCreateCafUser(_x9, _x0, _x1, _x10, _x11) {
  return _findOrCreateCafUser.apply(this, arguments);
}

// ── handleCafCodeExchange ──────────────────────────────────
function _findOrCreateCafUser() {
  _findOrCreateCafUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(lookup, cafConfig, cafSub, emailHint, nameHint) {
    var userCache, findUserByEmail, findUserByCafSub, byCafSub, byEmail, fallbackEmail, email, name, user;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          userCache = lookup.userCache, findUserByEmail = lookup.findUserByEmail, findUserByCafSub = lookup.findUserByCafSub;
          if (!cafSub) {
            _context8.n = 2;
            break;
          }
          _context8.n = 1;
          return findUserByCafSub(cafSub);
        case 1:
          byCafSub = _context8.v;
          if (!byCafSub) {
            _context8.n = 2;
            break;
          }
          if (nameHint && nameHint !== cafSub) {
            byCafSub.name = nameHint;
          }
          if (emailHint) {
            byCafSub.email = emailHint.toLowerCase();
          } else if (byCafSub.email.endsWith("@caf.local") || !byCafSub.email.includes("@")) {
            byCafSub.email = "".concat(cafSub, "@").concat(cafConfig.emailDomain);
          }
          return _context8.a(2, byCafSub);
        case 2:
          if (!emailHint) {
            _context8.n = 4;
            break;
          }
          _context8.n = 3;
          return findUserByEmail(emailHint.toLowerCase());
        case 3:
          byEmail = _context8.v;
          if (!byEmail) {
            _context8.n = 4;
            break;
          }
          return _context8.a(2, byEmail);
        case 4:
          fallbackEmail = "".concat(cafSub, "@").concat(cafConfig.emailDomain);
          email = (emailHint || fallbackEmail).toLowerCase();
          name = nameHint || "CAF用户";
          user = _objectSpread({
            id: uuidv4(),
            email: email,
            name: name,
            passwordHash: undefined
          }, createDefaultUserFields());
          _context8.n = 5;
          return dbService.addUser(user);
        case 5:
          userCache.set(user.id, user);
          return _context8.a(2, user);
      }
    }, _callee8);
  }));
  return _findOrCreateCafUser.apply(this, arguments);
}
export function buildCafAuthorizeUrl(cafConfig, redirectUri) {
  var params = new URLSearchParams({
    client_id: cafConfig.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile offline_access",
    prompt: "consent"
  });
  return "".concat(cafConfig.baseUrl, "/web/oauth/authorize?").concat(params.toString());
}
export function checkCafReady(cafConfig) {
  if (!cafConfig.baseUrl || !cafConfig.clientId) {
    return "CAF auth is not ready on server (subserver registration not completed).";
  }
  return null;
}
export function handleCafCodeExchange(_x12, _x13, _x14, _x15, _x16) {
  return _handleCafCodeExchange.apply(this, arguments);
}
function _handleCafCodeExchange() {
  _handleCafCodeExchange = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(lookup, cafConfig, code, redirectUri, signJwt) {
    var tokenResponse, _ref2, access_token, refresh_token, expires_in, claims, cafSub, email, name, userinfo, stableSub, user, jwtToken;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          if (!(!cafConfig.baseUrl || !cafConfig.clientId || !cafConfig.clientSecret)) {
            _context9.n = 1;
            break;
          }
          throw new Error("CAF auth is not configured on server.");
        case 1:
          _context9.n = 2;
          return axios.post("".concat(cafConfig.baseUrl, "/api/oauth/token"), {
            grant_type: "authorization_code",
            client_id: cafConfig.clientId,
            client_secret: cafConfig.clientSecret,
            code: code,
            redirect_uri: redirectUri,
            scope: "openid email profile offline_access"
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          });
        case 2:
          tokenResponse = _context9.v;
          _ref2 = tokenResponse.data || {}, access_token = _ref2.access_token, refresh_token = _ref2.refresh_token, expires_in = _ref2.expires_in;
          if (access_token) {
            _context9.n = 3;
            break;
          }
          throw new Error("CAF token exchange returned no access_token.");
        case 3:
          claims = decodeJwtPayload(access_token) || {};
          cafSub = (claims.sub || claims.user_id || claims.uid || claims.id || "").toString();
          email = (claims.email || claims.preferred_username || claims.upn || "").toString();
          name = (claims.name || claims.username || "").toString();
          _context9.n = 4;
          return fetchCafUserInfo(cafConfig, access_token);
        case 4:
          userinfo = _context9.v;
          if (userinfo.email) email = userinfo.email;
          if (userinfo.name) name = userinfo.name;
          if (!(!cafSub && !email)) {
            _context9.n = 5;
            break;
          }
          throw new Error("Unable to identify CAF user from token payload.");
        case 5:
          stableSub = cafSub || email;
          _context9.n = 6;
          return findOrCreateCafUser(lookup, cafConfig, stableSub, email || undefined, name || undefined);
        case 6:
          user = _context9.v;
          user.CAFSub = stableSub;
          user.CAFAccessToken = access_token;
          user.CAFRefreshToken = refresh_token || undefined;
          user.CAFTokenExpiresAt = Date.now() + (Number(expires_in) || 3600) * 1000;
          if (name && user.name !== name) {
            user.name = name;
          }
          if (user.email.endsWith("@".concat(cafConfig.emailDomain)) && !user.ImapBinded) {
            user.ImapEmail = user.email;
            user.ImapHost = cafConfig.imapHost;
            user.ImapPort = cafConfig.imapPort;
            user.ImapTls = true;
            user.ImapBinded = true;
            logger.info("CAF: auto-bound IMAP/OIDC for ".concat(user.email, " (imap: ").concat(cafConfig.imapHost, ":").concat(cafConfig.imapPort, ")"));
          }
          jwtToken = signJwt({
            sub: user.id,
            email: user.email
          });
          user.JWTtoken = jwtToken;
          _context9.n = 7;
          return dbService.updateUser(user);
        case 7:
          lookup.userCache.set(user.id, user);
          return _context9.a(2, {
            jwtToken: jwtToken,
            email: user.email,
            name: user.name
          });
      }
    }, _callee9);
  }));
  return _handleCafCodeExchange.apply(this, arguments);
}