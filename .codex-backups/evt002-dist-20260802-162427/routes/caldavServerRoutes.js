function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * CalDAV Server Express Routes
 * Mounts CalDAV protocol handling as Express middleware.
 * Supports HTTP Basic Auth and JWT Bearer token authentication.
 */

import express from "express";
import bcrypt from "bcryptjs";
import { dbService } from "../Services/dbService.js";
import { handleCalDavRequest } from "../Services/calendar/CalDavServer.js";
import { logger } from "../Utils/logger.js";

// ── Auth helpers ───────────────────────────────────────────────────
function authenticateBasicAuth(_x) {
  return _authenticateBasicAuth.apply(this, arguments);
}
function _authenticateBasicAuth() {
  _authenticateBasicAuth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(authorizationHeader) {
    var base64, decoded, colonIdx, username, password, user, valid, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          base64 = authorizationHeader.split(" ")[1];
          if (base64) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, null);
        case 1:
          decoded = Buffer.from(base64, "base64").toString("utf8");
          colonIdx = decoded.indexOf(":");
          if (!(colonIdx < 0)) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, null);
        case 2:
          username = decoded.slice(0, colonIdx);
          password = decoded.slice(colonIdx + 1); // Try to find user by email (username = email)
          _context3.n = 3;
          return dbService.getUserByEmail(username);
        case 3:
          user = _context3.v;
          if (user) {
            _context3.n = 4;
            break;
          }
          return _context3.a(2, null);
        case 4:
          if (user.CalDavServerEnabled) {
            _context3.n = 5;
            break;
          }
          return _context3.a(2, null);
        case 5:
          if (!(user.CalDavPassword && password === user.CalDavPassword)) {
            _context3.n = 6;
            break;
          }
          return _context3.a(2, user);
        case 6:
          if (!user.passwordHash) {
            _context3.n = 9;
            break;
          }
          _context3.n = 7;
          return bcrypt.compare(password, user.passwordHash);
        case 7:
          valid = _context3.v;
          if (valid) {
            _context3.n = 8;
            break;
          }
          return _context3.a(2, null);
        case 8:
          _context3.n = 11;
          break;
        case 9:
          if (!(user.XJTLUPassword && user.XJTLUPassword !== password)) {
            _context3.n = 10;
            break;
          }
          return _context3.a(2, null);
        case 10:
          if (!(!user.XJTLUPassword && !user.passwordHash)) {
            _context3.n = 11;
            break;
          }
          return _context3.a(2, null);
        case 11:
          return _context3.a(2, user);
        case 12:
          _context3.p = 12;
          _t3 = _context3.v;
          return _context3.a(2, null);
      }
    }, _callee3, null, [[0, 12]]);
  }));
  return _authenticateBasicAuth.apply(this, arguments);
}
function authenticateBearerToken(_x2) {
  return _authenticateBearerToken.apply(this, arguments);
} // ── Route factory ──────────────────────────────────────────────────
function _authenticateBearerToken() {
  _authenticateBearerToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(authorizationHeader) {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          return _context4.a(2, null);
      }
    }, _callee4);
  }));
  return _authenticateBearerToken.apply(this, arguments);
}
export function createCalDavServerRouter(config, jwtVerify, userLookup, getClientProfile) {
  var router = express.Router();

  // Raw body parser for CalDAV - use text/raw for XML and ICS bodies
  router.use(function (req, res, next) {
    // Skip body parsing for normal requests, handle manually
    if (["PUT", "PROPFIND", "REPORT", "MKCALENDAR", "MKCOL"].includes(req.method.toUpperCase())) {
      var chunks = [];
      req.on("data", function (chunk) {
        return chunks.push(chunk);
      });
      req.on("end", function () {
        req.rawBody = Buffer.concat(chunks).toString("utf8");
        next();
      });
      req.on("error", function () {
        res.status(400).end();
      });
    } else {
      next();
    }
  });

  // ── Authentication middleware ──────────────────────────────────

  var authMiddleware = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res, next) {
      var authHeader, user, token, decoded, u, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            authHeader = req.headers.authorization;
            if (authHeader) {
              _context.n = 1;
              break;
            }
            res.setHeader("WWW-Authenticate", 'Basic realm="CalDAV"');
            return _context.a(2, res.status(401).end());
          case 1:
            user = null;
            if (!authHeader.startsWith("Basic ")) {
              _context.n = 3;
              break;
            }
            _context.n = 2;
            return authenticateBasicAuth(authHeader);
          case 2:
            user = _context.v;
            _context.n = 8;
            break;
          case 3:
            if (!(authHeader.startsWith("Bearer ") && jwtVerify && userLookup)) {
              _context.n = 8;
              break;
            }
            _context.p = 4;
            token = authHeader.split(" ")[1];
            decoded = jwtVerify(token);
            if (!decoded) {
              _context.n = 6;
              break;
            }
            _context.n = 5;
            return userLookup(decoded.sub);
          case 5:
            u = _context.v;
            user = u || null;
          case 6:
            _context.n = 8;
            break;
          case 7:
            _context.p = 7;
            _t = _context.v;
          case 8:
            if (user) {
              _context.n = 9;
              break;
            }
            res.setHeader("WWW-Authenticate", 'Basic realm="CalDAV"');
            return _context.a(2, res.status(401).end());
          case 9:
            req.caldavUser = user;
            next();
          case 10:
            return _context.a(2);
        }
      }, _callee, null, [[4, 7]]);
    }));
    return function authMiddleware(_x3, _x4, _x5) {
      return _ref.apply(this, arguments);
    };
  }();

  // ── Well-known redirect ────────────────────────────────────────

  router.get("/.well-known/caldav", function (req, res) {
    // Redirect CalDAV clients to the server root where PROPFIND with current-user-principal will guide discovery
    res.redirect(301, "".concat(config.baseUrl, "/"));
  });

  // ── Main CalDAV handler (all methods, all paths) ───────────────

  router.all("/*", authMiddleware, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var user, method, path, depth, body, response, _i, _Object$entries, _Object$entries$_i, key, value, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            user = req.caldavUser;
            method = req.method;
            path = req.path;
            depth = req.headers.depth || "0";
            body = req.rawBody || req.body || "";
            _context2.n = 1;
            return handleCalDavRequest({
              user: user,
              method: method,
              path: path,
              depth: depth,
              body: typeof body === "string" ? body : ""
            }, config);
          case 1:
            response = _context2.v;
            // Set response headers
            if (response.headers) {
              for (_i = 0, _Object$entries = Object.entries(response.headers); _i < _Object$entries.length; _i++) {
                _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
                res.setHeader(key, value);
              }
            }

            // For 207 Multi-Status, ensure proper content type
            if (response.status === 207) {
              res.setHeader("Content-Type", "text/xml; charset=utf-8");
            }
            res.status(response.status);
            if (response.body) {
              res.send(response.body);
            } else {
              res.end();
            }
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            logger.error("CalDAV server error:", _t2);
            res.status(500).end();
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return function (_x6, _x7) {
      return _ref2.apply(this, arguments);
    };
  }());
  return router;
}

// ── Public helper to initialize with main server context ───────────

export function initializeCalDavServer(options) {
  var config = {
    baseUrl: options.baseUrl
  };
  var router = createCalDavServerRouter(config, options.jwtVerify, options.userLookup, function (user) {
    return user.CalDavClientProfile || "auto";
  });

  // Mount at /caldav
  options.app.use("/caldav", router);
  logger.info("CalDAV server mounted at ".concat(options.baseUrl));
}