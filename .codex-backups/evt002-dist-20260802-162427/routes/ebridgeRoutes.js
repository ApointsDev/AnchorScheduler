function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import express from "express";
import axios from "axios";
import https from "https";
import { logger } from "../Utils/logger.js";
var router = express.Router();

// HTTPS Keep-Alive Agent - 复用 TLS 连接，避免每个请求都重新握手
// 上游服务器响应较慢（~3秒），频繁建立新连接会导致超时
var httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 10,
  maxFreeSockets: 5,
  timeout: 60000
});
function loadDomains() {
  var raw = process.env.EBRIDGE_PROXY_DOMAINS;
  if (raw) {
    try {
      var parsed = JSON.parse(raw);
      var valid = {};
      for (var _i = 0, _Object$entries = Object.entries(parsed); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];
        if (/^[a-z0-9-]+$/.test(k) && v.startsWith("https://")) {
          valid[k] = v.replace(/\/$/, "");
        }
      }
      if (Object.keys(valid).length > 0) return valid;
    } catch (_unused) {
      /* fall through */
    }
  }
  return {
    eb: "https://ebridge.xjtlu.edu.cn",
    uim: "https://uim.xjtlu.edu.cn"
  };
}
var DOMAINS = loadDomains();

// 已知属于其他域的路径前缀（相对路径重定向时，根据前缀选择正确的代理前缀）
var PATH_TO_PFX = {
  "/esc-sso/": "uim",
  "/uim/": "uim",
  "/ebridge/": "eb",
  "/snackbar/": "uim"
};
function resolvePfxForRelativePath(path, currentPfx) {
  var match = Object.entries(PATH_TO_PFX).find(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
      prefix = _ref2[0];
    return path.startsWith(prefix);
  });
  return match ? match[1] : currentPfx;
}
function getTarget(pfx) {
  var base = DOMAINS[pfx];
  if (!base) throw new Error("Unknown proxy prefix: ".concat(pfx));
  return base;
}
function buildProxyPrefix(req, pfx) {
  var proto = (req.get("x-forwarded-proto") || "").split(",")[0].trim();
  var forwardedHost = (req.get("x-forwarded-host") || "").split(",")[0].trim();
  var rawHost = req.get("host") || "localhost:3000";
  var host = (forwardedHost || rawHost).replace(/:\d+$/, "");
  var scheme = proto || (host === "localhost" ? "http" : "https");
  return "".concat(scheme, "://").concat(host, "/api/ebridge/proxy/").concat(pfx);
}

// --- 注入到 JS 文件开头的轻量拦截脚本 ---
// 当 HTML 层面的 script 注入因某些原因不生效时，作为后备方案
// 在 html-design-sdk.js 等关键 JS 文件开头注入
function buildJsInterceptPreamble(proxyPrefix, pfx) {
  var proxyBase = proxyPrefix.replace(/\/$/, "");
  var domainBases = Object.values(DOMAINS).map(function (d) {
    return d.replace(/\/$/, "");
  });
  var domainList = JSON.stringify(domainBases);
  var proxyMap = {};
  for (var _i2 = 0, _Object$entries2 = Object.entries(DOMAINS); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
      k = _Object$entries2$_i[0],
      v = _Object$entries2$_i[1];
    proxyMap[v.replace(/\/$/, "")] = proxyBase.replace("/".concat(pfx), "/".concat(k));
  }
  var proxyMapJson = JSON.stringify(proxyMap);
  var pathPfxJson = JSON.stringify(PATH_TO_PFX);

  // 生成一个极简的拦截器，在 JS 文件加载后立即执行
  return "\n(function(){\nif(window.__ebridge_js_injected)return;\nwindow.__ebridge_js_injected=1;\nvar P=".concat(JSON.stringify(proxyBase), ";\nvar D=").concat(domainList, ";\nvar M=").concat(proxyMapJson, ";\nvar K=").concat(pathPfxJson, ";\nvar F=").concat(JSON.stringify(pfx), ";\nfunction rp(p){for(var i in K){if(p.indexOf(i)===0)return K[i];}return F;}\nfunction fb(t){for(var d in M){if(M[d]&&M[d].indexOf('/'+t+'/')!==-1)return M[d];}return P;}\nfunction tp(u){if(!u||typeof u!=='string')return null;\nif(u.indexOf('/api/ebridge/')!==-1)return u;\nfor(var i=0;i<D.length;i++){if(u.indexOf(D[i])===0){var pp=u.slice(D[i].length)||'/';return fb(rp(pp))+pp;}}\nvar o=window.location.origin;\nif(u.indexOf(o)===0){var op=u.slice(o.length);if(op.indexOf('/api/ebridge/')!==0)return fb(rp(op))+op;return u;}\nif(u.charAt(0)==='/'&&u.charAt(1)!=='/'){if(u.indexOf('/api/ebridge/')===0)return u;return fb(rp(u))+u;}\nif(u.charAt(0)!=='#'&&u.indexOf('://')===-1){try{var a=document.createElement('a');a.href=u;if(a.href!==u)return tp(a.href);}catch(e){}return null;}\nreturn null;}\nvar _f=window.fetch;if(_f){window.fetch=function(u,o){if(typeof u==='string'){var x=tp(u);if(x)u=x;}else if(u&&u.url){var x=tp(u.url);if(x&&x!==u.url)u=new Request(x,u);}return _f.call(window,u,o);};}\nvar _x=window.XMLHttpRequest;window.XMLHttpRequest=function(){var x=new _x();var oo=x.open;x.open=function(m,u){var xv=tp(u);return oo.call(x,m,xv||u);};return x;};window.XMLHttpRequest.prototype=_x.prototype;\nvar _c=document.createElement.bind(document);\ndocument.createElement=function(t,o){var e=_c(t,o);var n=(t||'').toLowerCase();\nif(n==='script'||n==='img'||n==='iframe'||n==='source'||n==='video'||n==='audio'||n==='embed'||n==='track'||n==='link'||n==='a'){\nvar os=e.setAttribute.bind(e);\ne.setAttribute=function(n,v){if((n==='src'||n==='href')&&typeof v==='string'){var x=tp(v);if(x)v=x;}return os(n,v);};}\nreturn e;};\n})();\n").replace(/^\n/, "");
}

// --- 浏览器端资源加载拦截脚本 ---
// 注入到 <head> 中，在所有业务JS之前执行。
// 拦截 document.createElement / setAttribute / fetch / XHR / EventSource，
// 将需要代理的URL自动重写为代理前缀路径。
function buildInterceptScript(proxyPrefix, pfx) {
  var proxyBase = proxyPrefix.replace(/\/$/, "");
  var domainBases = Object.values(DOMAINS).map(function (d) {
    return d.replace(/\/$/, "");
  });
  var domainList = JSON.stringify(domainBases);

  // 为每个域名构建对应的代理前缀映射
  var proxyMap = {};
  for (var _i3 = 0, _Object$entries3 = Object.entries(DOMAINS); _i3 < _Object$entries3.length; _i3++) {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
      k = _Object$entries3$_i[0],
      v = _Object$entries3$_i[1];
    proxyMap[v.replace(/\/$/, "")] = proxyBase.replace("/".concat(pfx), "/".concat(k));
  }
  var proxyMapJson = JSON.stringify(proxyMap);
  var pathPfxJson = JSON.stringify(PATH_TO_PFX);
  var defaultPfxJson = JSON.stringify(pfx);
  return "\n  <script>\n  (function(){\n    if (window.__ebridge_intercept_installed) return;\n    window.__ebridge_intercept_installed = true;\n    console.log('[ebridge-proxy] Intercept script loaded, PROXY=' + ".concat(JSON.stringify(JSON.stringify(proxyBase)), " + ', DEFAULT_PFX=' + ").concat(JSON.stringify(JSON.stringify(pfx)), ");\n\n    var PROXY = ").concat(JSON.stringify(proxyBase), ";\n  var DOMAINS = ").concat(domainList, ";\n  var PROXY_MAP = ").concat(proxyMapJson, ";\n  var PATH_PFX = ").concat(pathPfxJson, ";\n  var DEFAULT_PFX = ").concat(defaultPfxJson, ";\n\n  // \u6839\u636E\u8DEF\u5F84\u524D\u7F00\u5224\u65AD\u6240\u5C5E\u4EE3\u7406\u57DF\n  function resolvePfx(path) {\n    for (var prefix in PATH_PFX) {\n      if (path.indexOf(prefix) === 0) return PATH_PFX[prefix];\n    }\n    return DEFAULT_PFX;\n  }\n\n  // \u627E\u5230\u67D0\u4E2A\u4EE3\u7406\u524D\u7F00\u5BF9\u5E94\u7684\u5B8C\u6574\u4EE3\u7406base\uFF08\u5982 https://host/api/ebridge/proxy/uim\uFF09\n  function findProxyBaseForPfx(targetPfx) {\n    for (var d in PROXY_MAP) {\n      if (PROXY_MAP[d] && PROXY_MAP[d].indexOf('/' + targetPfx + '/') !== -1) {\n        return PROXY_MAP[d];\n      }\n    }\n    return PROXY;\n  }\n\n  // \u89E3\u6790\u76F8\u5BF9\u8DEF\u5F84\u4E3A\u7EDD\u5BF9\u8DEF\u5F84\n  function resolveUrl(url) {\n    if (!url || typeof url !== 'string') return url;\n    // \u5DF2\u7ECF\u662F\u7EDD\u5BF9 URL\n    if (url.indexOf('://') !== -1) return url;\n    // \u6839\u76F8\u5BF9\u8DEF\u5F84\n    if (url.charAt(0) === '/') {\n      return (window.location.protocol + '//' + window.location.host + url);\n    }\n    // \u76F8\u5BF9\u8DEF\u5F84 - \u76F8\u5BF9\u4E8E\u5F53\u524D\u9875\u9762\u89E3\u6790\n    try {\n      var a = document.createElement('a');\n      a.href = url;\n      return a.href;\n    } catch(e) {\n      return url;\n    }\n  }\n\n  function tryProxy(absoluteUrl) {\n    if (!absoluteUrl || typeof absoluteUrl !== 'string') return null;\n    // \u5DF2\u7ECF\u662F\u4EE3\u7406\u8DEF\u5F84\u7684\u4E0D\u7528\u518D\u91CD\u5199\n    if (absoluteUrl.indexOf('/api/ebridge/') !== -1) return absoluteUrl;\n    // \u5339\u914D\u5DF2\u77E5\u57DF\u540D\n    for (var i = 0; i < DOMAINS.length; i++) {\n      var base = DOMAINS[i];\n      if (absoluteUrl.indexOf(base) === 0) {\n        var pathPart = absoluteUrl.slice(base.length) || '/';\n        var correctPfx = resolvePfx(pathPart);\n        return findProxyBaseForPfx(correctPfx) + pathPart;\n      }\n    }\n    // \u5904\u7406\u6307\u5411\u6211\u4EEC\u81EA\u5DF1\u4EE3\u7406\u57DF\u540D\u7684\u7EDD\u5BF9URL\n    // RequireJS \u7B49\u6A21\u5757\u52A0\u8F7D\u5668\u4F1A\u7528 window.location.origin \u62FC\u63A5\u8DEF\u5F84\u540E\u521B\u5EFA script \u6807\u7B7E\uFF0C\n    // \u6B64\u65F6\u4F20\u5165\u7684\u5DF2\u7ECF\u662F\u5B8C\u6574\u7684\u7EDD\u5BF9URL\uFF08\u5982 https://schedule.apoints.cn/login/xxx.js\uFF09\uFF0C\n    // \u9700\u8981\u901A\u8FC7\u4EE3\u7406\u8DEF\u5F84\u91CD\u5199\n    var ourOrigin = window.location.origin;\n    if (absoluteUrl.indexOf(ourOrigin) === 0) {\n      var ourPath = absoluteUrl.slice(ourOrigin.length);\n      if (ourPath.indexOf('/api/ebridge/') !== 0) {\n        var _pfx = resolvePfx(ourPath);\n        return findProxyBaseForPfx(_pfx) + ourPath;\n      }\n      return absoluteUrl;\n    }\n    // \u4EE5 / \u5F00\u5934\u7684\u6839\u76F8\u5BF9\u8DEF\u5F84\n    if (absoluteUrl.charAt(0) === '/' && absoluteUrl.charAt(1) !== '/') {\n      if (absoluteUrl.indexOf('/api/ebridge/') === 0) return absoluteUrl;\n      var pfx = resolvePfx(absoluteUrl);\n      return findProxyBaseForPfx(pfx) + absoluteUrl;\n    }\n    // \u5904\u7406\u76F8\u5BF9\u8DEF\u5F84\uFF08\u4E0D\u4EE5 / \u6216\u534F\u8BAE\u5F00\u5934\uFF09\n    if (absoluteUrl.charAt(0) !== '#' && absoluteUrl.indexOf('://') === -1) {\n      var resolved = resolveUrl(absoluteUrl);\n      if (resolved && resolved !== absoluteUrl) {\n        return tryProxy(resolved);\n      }\n    }\n    return null;\n  }\n\n  // --- \u62E6\u622A\u5C5E\u6027 setter\uFF08element.src = xxx / element.href = xxx\uFF09---\n  // \u8BB8\u591A JS \u6846\u67B6\uFF08jQuery\u3001RequireJS \u7B49\uFF09\u4F7F\u7528\u5C5E\u6027\u76F4\u63A5\u8D4B\u503C\u800C\u975E setAttribute\n  var _hookedProps = {};\n  function hookPropSetter(proto, prop) {\n    if (!proto) return;\n    var key = '';\n    try { key = Object.prototype.toString.call(proto); } catch(e) {}\n    key = key + '|' + prop;\n    if (_hookedProps[key]) return;\n    try {\n      var desc = Object.getOwnPropertyDescriptor(proto, prop);\n      if (desc && desc.set) {\n        _hookedProps[key] = true;\n        var origSetter = desc.set;\n        Object.defineProperty(proto, prop, {\n          get: desc.get,\n          set: function(value) {\n            if (typeof value === 'string' && value) {\n              var proxied = tryProxy(value);\n              if (proxied) value = proxied;\n            }\n            return origSetter.call(this, value);\n          },\n          configurable: true,\n          enumerable: true\n        });\n      }\n    } catch(e) {}\n  }\n  // \u5728\u6240\u6709\u76F8\u5173\u539F\u578B\u4E0A\u5B89\u88C5\u94A9\u5B50\n  hookPropSetter(window.HTMLScriptElement ? HTMLScriptElement.prototype : null, 'src');\n  hookPropSetter(window.HTMLImageElement ? HTMLImageElement.prototype : null, 'src');\n  hookPropSetter(window.HTMLLinkElement ? HTMLLinkElement.prototype : null, 'href');\n  hookPropSetter(window.HTMLIFrameElement ? HTMLIFrameElement.prototype : null, 'src');\n  hookPropSetter(window.HTMLSourceElement ? HTMLSourceElement.prototype : null, 'src');\n  hookPropSetter(window.HTMLMediaElement ? HTMLMediaElement.prototype : null, 'src');\n  hookPropSetter(window.HTMLEmbedElement ? HTMLEmbedElement.prototype : null, 'src');\n  hookPropSetter(window.HTMLTrackElement ? HTMLTrackElement.prototype : null, 'src');\n  hookPropSetter(window.HTMLAnchorElement ? HTMLAnchorElement.prototype : null, 'href');\n\n  // --- \u62E6\u622A createElement ---\n  var origCreateElement = document.createElement.bind(document);\n  document.createElement = function(tagName, options) {\n    var el = origCreateElement(tagName, options);\n    var tag = (tagName || '').toLowerCase();\n    // \u5BF9\u53EF\u80FD\u5305\u542B src/href \u7684\u5143\u7D20\u62E6\u622A setAttribute\n    if (tag === 'script' || tag === 'img' || tag === 'iframe' ||\n        tag === 'source' || tag === 'video' || tag === 'audio' ||\n        tag === 'embed' || tag === 'track' || tag === 'link' || tag === 'a') {\n      var origSetAttr = el.setAttribute.bind(el);\n      el.setAttribute = function(name, value) {\n        if ((name === 'src' || name === 'href') && typeof value === 'string') {\n          var proxied = tryProxy(value);\n          if (proxied) value = proxied;\n        }\n        return origSetAttr(name, value);\n      };\n    }\n    return el;\n  };\n\n  // --- \u62E6\u622A XMLHttpRequest ---\n  var OrigXHR = window.XMLHttpRequest;\n  window.XMLHttpRequest = function() {\n    var xhr = new OrigXHR();\n    var origOpen = xhr.open;\n    xhr.open = function(method, url) {\n      var proxied = tryProxy(url);\n      if (proxied) { console.log('[ebridge-proxy] XHR intercepted: ' + url + ' -> ' + proxied); }\n      var args = [method, proxied || url];\n      for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);\n      return origOpen.apply(xhr, args);\n    };\n    return xhr;\n  };\n  window.XMLHttpRequest.prototype = OrigXHR.prototype;\n\n  // --- \u62E6\u622A fetch ---\n  if (window.fetch) {\n    var origFetch = window.fetch.bind(window);\n    window.fetch = function(url, options) {\n      var originalUrl = typeof url === 'string' ? url : (url && url.url);\n      if (typeof url === 'string') {\n        var proxied = tryProxy(url);\n        if (proxied) { console.log('[ebridge-proxy] fetch intercepted: ' + url + ' -> ' + proxied); url = proxied; }\n      } else if (url && url instanceof Request) {\n        var newUrl = tryProxy(url.url);\n        if (newUrl && newUrl !== url.url) {\n          console.log('[ebridge-proxy] fetch(Request) intercepted: ' + url.url + ' -> ' + newUrl);\n          url = new Request(newUrl, url);\n        }\n      }\n      return origFetch(url, options);\n    };\n  }\n\n  // --- \u62E6\u622A EventSource ---\n  if (window.EventSource) {\n    var OrigES = window.EventSource;\n    window.EventSource = function(url, config) {\n      var proxied = tryProxy(url);\n      return new OrigES(proxied || url, config);\n    };\n    window.EventSource.prototype = OrigES.prototype;\n  }\n\n  // --- \u62E6\u622A WebSocket (wss -> wss \u4E0D\u9700\u8981\u4EE3\u7406\uFF0C\u4F46\u8DEF\u5F84\u53EF\u80FD\u9700\u8981) ---\n  if (window.WebSocket) {\n    var OrigWS = window.WebSocket;\n    window.WebSocket = function(url, protocols) {\n      if (typeof url === 'string' && url.charAt(0) === '/') {\n        var proxied = tryProxy(url);\n        if (proxied) url = proxied;\n      }\n      return new OrigWS(url, protocols);\n    };\n    window.WebSocket.prototype = OrigWS.prototype;\n  }\n\n  // --- \u62E6\u622A navigator.sendBeacon ---\n  if (navigator.sendBeacon) {\n    var origSendBeacon = navigator.sendBeacon.bind(navigator);\n    navigator.sendBeacon = function(url, data) {\n      var proxied = tryProxy(url);\n      if (proxied) { console.log('[ebridge-proxy] sendBeacon intercepted: ' + url + ' -> ' + proxied); url = proxied; }\n      return origSendBeacon(url, data);\n    };\n  }\n\n  // --- \u62E6\u622A document.write ---\n  // \u6709\u4E9B SPA \u6846\u67B6\u4F7F\u7528 document.write \u6765\u6CE8\u5165 HTML\uFF08\u542B script/link \u6807\u7B7E\uFF09\n  var origDocWrite = document.write.bind(document);\n  document.write = function(html) {\n    if (typeof html === 'string') {\n      // \u91CD\u5199 document.write \u6CE8\u5165\u7684 HTML \u4E2D\u7684\u8D44\u6E90 URL\n      html = html.replace(/src=[\"'](/[^\"']*)[\"']/gi, function(m, path) {\n        var proxied = tryProxy(path);\n        return proxied ? 'src=\"' + proxied + '\"' : m;\n      });\n      html = html.replace(/href=[\"'](/[^\"']*)[\"']/gi, function(m, path) {\n        var proxied = tryProxy(path);\n        return proxied ? 'href=\"' + proxied + '\"' : m;\n      });\n    }\n    return origDocWrite(html);\n  };\n\n  // --- \u62E6\u622A Element.prototype.insertAdjacentHTML ---\n  var origInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;\n  Element.prototype.insertAdjacentHTML = function(position, html) {\n    if (typeof html === 'string') {\n      html = html.replace(/src=[\"'](/[^\"']*)[\"']/gi, function(m, path) {\n        var proxied = tryProxy(path);\n        return proxied ? 'src=\"' + proxied + '\"' : m;\n      });\n      html = html.replace(/href=[\"'](/[^\"']*)[\"']/gi, function(m, path) {\n        var proxied = tryProxy(path);\n        return proxied ? 'href=\"' + proxied + '\"' : m;\n      });\n    }\n    return origInsertAdjacentHTML.call(this, position, html);\n  };\n\n  console.log('[ebridge-proxy] All interceptors installed successfully');\n})();\n</script>");
}

// --- 检测 eBridge timetable iframe 的脚本 ---
var DETECT_SCRIPT = "\n<script>\n(function(){\n  var done = false;\n  function check() {\n    try {\n      var f = document.getElementById('myFrame');\n      if (f && f.src && f.src.indexOf('http') === 0 && !done) {\n        done = true;\n        if (window.opener) {\n          window.opener.postMessage({ type: 'EBRIDGE_TIMETABLE', url: f.src }, '*');\n        }\n      }\n    } catch(e) {}\n  }\n  setInterval(check, 1500);\n  setTimeout(check, 1000);\n})();\n</script>\n";
function rewriteHtml(html, proxyPrefix, pfx) {
  var result = html;

  // 先注入拦截脚本（所有业务JS之前），再注入检测脚本
  result = result.replace(/(<head[^>]*>)/i, "$1".concat(buildInterceptScript(proxyPrefix, pfx)).concat(DETECT_SCRIPT));
  var otherDomains = Object.entries(DOMAINS).filter(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
      k = _ref4[0];
    return k !== pfx;
  });
  var _iterator = _createForOfIteratorHelper(otherDomains),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        otherPfx = _step$value[0],
        base = _step$value[1];
      var otherPrefix = proxyPrefix.replace("/".concat(pfx, "/"), "/".concat(otherPfx, "/"));
      result = result.replace(new RegExp(base.replace(/\./g, "\\.").replace(/https?:\/\//g, "https?://"), "gi"), otherPrefix);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var ownBase = DOMAINS[pfx];
  result = result.replace(new RegExp(ownBase.replace(/\./g, "\\.").replace(/https?:\/\//g, "https?://"), "gi"), proxyPrefix);
  function rewriteRelPath(path) {
    if (path.startsWith("/api/ebridge/")) return path;
    var targetPfx = resolvePfxForRelativePath(path, pfx);
    if (targetPfx !== pfx) {
      var targetPrefix = proxyPrefix.replace("/".concat(pfx, "/"), "/".concat(targetPfx, "/"));
      return "".concat(targetPrefix).concat(path);
    }
    return "".concat(proxyPrefix).concat(path);
  }

  // 处理 <base> 标签 - 确保相对路径解析基于代理 URL
  result = result.replace(/<base\s+[^>]*\/?>/gi, function (_m) {
    if (_m.indexOf("/api/ebridge/") !== -1) return _m;
    // 移除 base 标签，让浏览器使用页面 URL（已是代理路径）作为 base
    return "<!-- base tag removed by proxy -->";
  });
  result = result.replace(/src="(\/[^"]*)"/gi, function (_, path) {
    return "src=\"".concat(rewriteRelPath(path), "\"");
  });
  result = result.replace(/href="(\/[^"]*)"/gi, function (_, path) {
    return "href=\"".concat(rewriteRelPath(path), "\"");
  });
  result = result.replace(/action="(\/[^"]*)"/gi, function (_, path) {
    return "action=\"".concat(rewriteRelPath(path), "\"");
  });
  result = result.replace(/url\('(\/[^']*)'\)/gi, function (_, path) {
    return "url('".concat(rewriteRelPath(path), "')");
  });
  result = result.replace(/url\("(\/[^"]*)"\)/gi, function (_, path) {
    return "url(\"".concat(rewriteRelPath(path), "\")");
  });
  // 无引号的 url()
  result = result.replace(/url\((\/[^"'\s)][^)]*)\)/gi, function (_, path) {
    var clean = path.trim();
    if (clean.startsWith("data:") || clean.startsWith("http")) return "url(".concat(clean, ")");
    return "url(".concat(rewriteRelPath(clean), ")");
  });
  // srcset 属性
  result = result.replace(/srcset="([^"]*)"/gi, function (_, srcset) {
    var parts = srcset.split(",").map(function (part) {
      var trimmed = part.trim();
      var spaceIdx = trimmed.search(/\s/);
      if (spaceIdx > 0) {
        var url = trimmed.slice(0, spaceIdx);
        var descriptor = trimmed.slice(spaceIdx);
        if (url.startsWith("/") && !url.startsWith("/api/ebridge/")) {
          return "".concat(rewriteRelPath(url)).concat(descriptor);
        }
      }
      return part;
    });
    return "srcset=\"".concat(parts.join(", "), "\"");
  });
  return result;
}
function rewriteLocation(location, proxyPrefix, pfx) {
  if (location.startsWith("/")) {
    if (location.startsWith("/api/ebridge/")) return location;
    var targetPfx = resolvePfxForRelativePath(location, pfx);
    if (targetPfx !== pfx) {
      var targetPrefix = proxyPrefix.replace("/".concat(pfx, "/"), "/".concat(targetPfx, "/"));
      return "".concat(targetPrefix).concat(location);
    }
    return "".concat(proxyPrefix).concat(location);
  }
  for (var _i4 = 0, _Object$entries4 = Object.entries(DOMAINS); _i4 < _Object$entries4.length; _i4++) {
    var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
      otherPfx = _Object$entries4$_i[0],
      base = _Object$entries4$_i[1];
    if (location.startsWith(base)) {
      var pathPart = location.slice(base.length) || "/";
      var correctPfx = resolvePfxForRelativePath(pathPart, otherPfx);
      var usePfx = correctPfx !== otherPfx ? correctPfx : otherPfx;
      var _targetPrefix = proxyPrefix.replace("/".concat(pfx, "/"), "/".concat(usePfx, "/"));
      return location.replace(base, _targetPrefix);
    }
  }
  return location;
}
function parseProxyPath(path) {
  var withoutProxy = path.replace(/^\/proxy\//, "");
  for (var _i5 = 0, _Object$keys = Object.keys(DOMAINS); _i5 < _Object$keys.length; _i5++) {
    var pfx = _Object$keys[_i5];
    if (withoutProxy === pfx || withoutProxy.startsWith(pfx + "/")) {
      var rest = withoutProxy === pfx ? "/" : withoutProxy.slice(pfx.length);
      return {
        pfx: pfx,
        rest: rest
      };
    }
  }
  return null;
}
router.all("/proxy/*", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var targetUrl, base, parsed, without, defaultPfx, redirectUrl, pfx, rest, correctPfx, _queryString, _redirectUrl, queryString, proxyPrefix, headers, forwardHeaders, referer, origin, _i6, _Object$entries5, _Object$entries5$_i, otherPfx, otherBase, otherPrefix, _i7, _forwardHeaders, h, val, response, _i8, _Object$entries6, _Object$entries6$_i, key, value, cookies, rewritten, contentType, ctLower, body, html, hasHead, css, js, preamble, domainBases, _i9, _domainBases, domainBase, escaped, target, loc, _rewritten, message, stack, axiosErr, axiosCode, _response, urlInfo, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          logger.info("Ebridge proxy request: ".concat(req.method, " ").concat(req.path));
          targetUrl = "";
          base = "";
          _context.p = 1;
          parsed = parseProxyPath(req.path);
          if (parsed) {
            _context.n = 2;
            break;
          }
          without = req.path.replace(/^\/proxy\//, "");
          defaultPfx = Object.keys(DOMAINS)[0] || "eb";
          redirectUrl = "/api/ebridge/proxy/".concat(defaultPfx, "/").concat(without);
          return _context.a(2, res.redirect(307, redirectUrl));
        case 2:
          pfx = parsed.pfx, rest = parsed.rest; // 检查 rest 路径是否实际上属于另一个代理域
          correctPfx = resolvePfxForRelativePath(rest, pfx);
          if (!(correctPfx !== pfx)) {
            _context.n = 3;
            break;
          }
          _queryString = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
          _redirectUrl = "/api/ebridge/proxy/".concat(correctPfx).concat(rest).concat(_queryString);
          logger.info("Ebridge proxy: redirecting ".concat(req.path, " -> ").concat(_redirectUrl, " (path prefix belongs to ").concat(correctPfx, ")"));
          return _context.a(2, res.redirect(307, _redirectUrl));
        case 3:
          base = getTarget(pfx);
          queryString = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
          targetUrl = "".concat(base).concat(rest).concat(queryString);
          proxyPrefix = buildProxyPrefix(req, pfx); // 更完整的请求头转发，减少上游返回502的概率
          headers = {};
          forwardHeaders = ["cookie", "content-type", "user-agent", "accept", "accept-encoding", "accept-language", "cache-control", "pragma", "x-requested-with", "sec-fetch-dest", "sec-fetch-mode", "sec-fetch-site"]; // 转发 Referer 和 Origin 时重写为上游域名，避免跨域检测
          referer = req.headers["referer"];
          origin = req.headers["origin"];
          if (referer && typeof referer === "string") {
            headers["referer"] = referer.replace(buildProxyPrefix(req, pfx), base);
            for (_i6 = 0, _Object$entries5 = Object.entries(DOMAINS); _i6 < _Object$entries5.length; _i6++) {
              _Object$entries5$_i = _slicedToArray(_Object$entries5[_i6], 2), otherPfx = _Object$entries5$_i[0], otherBase = _Object$entries5$_i[1];
              if (otherPfx !== pfx) {
                otherPrefix = buildProxyPrefix(req, otherPfx);
                headers["referer"] = headers["referer"].replace(otherPrefix, otherBase);
              }
            }
          }
          if (origin && typeof origin === "string") {
            headers["origin"] = origin.replace(/https?:\/\/[^/]+/, base);
          }
          for (_i7 = 0, _forwardHeaders = forwardHeaders; _i7 < _forwardHeaders.length; _i7++) {
            h = _forwardHeaders[_i7];
            val = req.headers[h];
            if (val) {
              headers[h] = Array.isArray(val) ? val.join(", ") : val;
            }
          }
          if (!headers["accept"]) headers["accept"] = "*/*";
          if (!headers["accept-language"]) headers["accept-language"] = "zh-CN,zh;q=0.9";
          _context.n = 4;
          return axios({
            method: req.method,
            url: targetUrl,
            headers: headers,
            data: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
            maxRedirects: 0,
            validateStatus: function validateStatus() {
              return true;
            },
            responseType: "arraybuffer",
            timeout: 45000,
            httpsAgent: httpsAgent
          });
        case 4:
          response = _context.v;
          // 处理响应头
          for (_i8 = 0, _Object$entries6 = Object.entries(response.headers); _i8 < _Object$entries6.length; _i8++) {
            _Object$entries6$_i = _slicedToArray(_Object$entries6[_i8], 2), key = _Object$entries6$_i[0], value = _Object$entries6$_i[1];
            if (key === "set-cookie" && value) {
              cookies = Array.isArray(value) ? value : [value];
              rewritten = cookies.map(function (c) {
                return c.replace(/domain=[^;]*/gi, "").replace(/path=\/[^;]*/gi, "path=/api/ebridge");
              });
              res.setHeader("set-cookie", rewritten);
            } else if (key !== "transfer-encoding" && key !== "content-encoding" && key !== "x-frame-options" && key !== "content-security-policy") {
              res.setHeader(key, String(value));
            }
          }
          contentType = response.headers["content-type"] || "";
          ctLower = typeof contentType === "string" ? contentType.toLowerCase() : "";
          body = response.data;
          logger.debug("Ebridge proxy response: status=".concat(response.status, ", content-type=\"").concat(contentType, "\", proxyPrefix=").concat(proxyPrefix, ", pfx=").concat(pfx));
          if (!(_typeof(body) === "object" && !Buffer.isBuffer(body))) {
            _context.n = 5;
            break;
          }
          return _context.a(2, res.status(response.status).json(body));
        case 5:
          // HTML 响应：注入拦截脚本 + 重写静态路径
          if (/text\/html/.test(ctLower)) {
            logger.info("Ebridge proxy: rewriting HTML for ".concat(req.path, ", injecting intercept script"));
            html = body.toString("utf-8");
            hasHead = /<head[^>]*>/i.test(html);
            logger.debug("Ebridge proxy HTML: has <head> tag = ".concat(hasHead, ", body length = ").concat(html.length));
            html = rewriteHtml(html, proxyPrefix, pfx);
            body = Buffer.from(html, "utf-8");
            res.setHeader("Content-Type", "text/html; charset=utf-8");
          }
          // CSS 响应：重写 url() 中的路径
          else if (/text\/css/.test(ctLower)) {
            css = body.toString("utf-8");
            css = css.replace(/url\(["']?(\/[^"')]*?)["']?\)/gi, function (_match, path) {
              if (path.startsWith("/api/ebridge/") || path.startsWith("data:") || path.startsWith("http")) {
                return "url(".concat(path, ")");
              }
              var targetPfx = resolvePfxForRelativePath(path, pfx);
              if (targetPfx !== pfx) {
                var targetPrefix = proxyPrefix.replace("/".concat(pfx, "/"), "/".concat(targetPfx, "/"));
                return "url(".concat(targetPrefix).concat(path, ")");
              }
              return "url(".concat(proxyPrefix).concat(path, ")");
            });
            body = Buffer.from(css, "utf-8");
            res.setHeader("Content-Type", ctLower.includes("charset") ? String(contentType) : "text/css; charset=utf-8");
          }
          // JS 响应：注入拦截脚本 + 重写硬编码的域名引用
          else if (/\/javascript|\/x-javascript/.test(ctLower) || /\.js(\?|$)/.test(req.path || "")) {
            js = body.toString("utf-8"); // 在 JS 文件开头注入拦截代码，确保钩子在业务代码执行前安装
            preamble = buildJsInterceptPreamble(proxyPrefix, pfx);
            js = preamble + js;
            logger.info("Ebridge proxy: injected JS intercept into ".concat(req.path));
            domainBases = Object.values(DOMAINS);
            for (_i9 = 0, _domainBases = domainBases; _i9 < _domainBases.length; _i9++) {
              domainBase = _domainBases[_i9];
              escaped = domainBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              target = proxyPrefix;
              js = js.replace(new RegExp(escaped, "gi"), target);
            }
            body = Buffer.from(js, "utf-8");
            res.setHeader("Content-Type", ctLower.includes("charset") ? String(contentType) : "application/javascript; charset=utf-8");
          }

          // 重定向响应：重写 Location 头
          if (response.status >= 300 && response.status < 400 && response.headers.location) {
            loc = response.headers.location;
            _rewritten = rewriteLocation(loc, proxyPrefix, pfx);
            logger.info("Ebridge proxy: redirect ".concat(response.status, " from ").concat(loc, " -> ").concat(_rewritten));
            res.setHeader("Location", _rewritten);
          }
          res.status(response.status).send(body);
          _context.n = 7;
          break;
        case 6:
          _context.p = 6;
          _t = _context.v;
          message = _t instanceof Error ? _t.message : "未知错误";
          stack = _t instanceof Error ? _t.stack : "";
          axiosErr = "";
          axiosCode = "";
          if (_t !== null && _t !== void 0 && _t.isAxiosError) {
            if (_t !== null && _t !== void 0 && (_response = _t.response) !== null && _response !== void 0 && _response.status) {
              axiosErr = "upstream_status=".concat(_t.response.status);
            }
            if (_t !== null && _t !== void 0 && _t.code) {
              axiosCode = "code=".concat(_t.code);
            }
          }
          urlInfo = typeof targetUrl !== "undefined" ? " | url=".concat(targetUrl) : " | path=".concat(req.path);
          logger.error("Ebridge proxy error: ".concat(message).concat(urlInfo, " | ").concat(axiosErr, " | ").concat(axiosCode, " | ").concat((stack === null || stack === void 0 ? void 0 : stack.split("\n")[0]) || ""));
          res.status(502).send("Ebridge proxy error");
        case 7:
          return _context.a(2);
      }
    }, _callee, null, [[1, 6]]);
  }));
  return function (_x, _x2) {
    return _ref5.apply(this, arguments);
  };
}());
export default router;