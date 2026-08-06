import express from "express";
import axios from "axios";
import https from "https";
import { logger } from "../Utils/logger.js";

const router = express.Router();

// HTTPS Keep-Alive Agent - 复用 TLS 连接，避免每个请求都重新握手
// 上游服务器响应较慢（~3秒），频繁建立新连接会导致超时
const httpsAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30000,
    maxSockets: 10,
    maxFreeSockets: 5,
    timeout: 60000,
});

function loadDomains(): Record<string, string> {
    const raw = process.env.EBRIDGE_PROXY_DOMAINS;
    if (raw) {
        try {
            const parsed = JSON.parse(raw) as Record<string, string>;
            const valid: Record<string, string> = {};
            for (const [k, v] of Object.entries(parsed)) {
                if (/^[a-z0-9-]+$/.test(k) && v.startsWith("https://")) {
                    valid[k] = v.replace(/\/$/, "");
                }
            }
            if (Object.keys(valid).length > 0) return valid;
        } catch {
            /* fall through */
        }
    }
    return {
        eb: "https://ebridge.xjtlu.edu.cn",
        uim: "https://uim.xjtlu.edu.cn",
    };
}

const DOMAINS = loadDomains();

// 已知属于其他域的路径前缀（相对路径重定向时，根据前缀选择正确的代理前缀）
const PATH_TO_PFX: Record<string, string> = {
    "/esc-sso/": "uim",
    "/uim/": "uim",
    "/ebridge/": "eb",
    "/snackbar/": "uim",
};

function resolvePfxForRelativePath(path: string, currentPfx: string): string {
    const match = Object.entries(PATH_TO_PFX).find(([prefix]) =>
        path.startsWith(prefix),
    );
    return match ? match[1] : currentPfx;
}

function getTarget(pfx: string) {
    const base = DOMAINS[pfx];
    if (!base) throw new Error(`Unknown proxy prefix: ${pfx}`);
    return base;
}

function buildProxyPrefix(req: express.Request, pfx: string) {
    const proto = (req.get("x-forwarded-proto") || "").split(",")[0].trim();
    const forwardedHost = (req.get("x-forwarded-host") || "")
        .split(",")[0]
        .trim();
    const rawHost = req.get("host") || "localhost:3000";
    const host = (forwardedHost || rawHost).replace(/:\d+$/, "");
    const scheme = proto || (host === "localhost" ? "http" : "https");
    return `${scheme}://${host}/api/ebridge/proxy/${pfx}`;
}

// --- 注入到 JS 文件开头的轻量拦截脚本 ---
// 当 HTML 层面的 script 注入因某些原因不生效时，作为后备方案
// 在 html-design-sdk.js 等关键 JS 文件开头注入
function buildJsInterceptPreamble(proxyPrefix: string, pfx: string): string {
    const proxyBase = proxyPrefix.replace(/\/$/, "");
    const domainBases = Object.values(DOMAINS).map((d) => d.replace(/\/$/, ""));
    const domainList = JSON.stringify(domainBases);

    const proxyMap: Record<string, string> = {};
    for (const [k, v] of Object.entries(DOMAINS)) {
        proxyMap[v.replace(/\/$/, "")] = proxyBase.replace(`/${pfx}`, `/${k}`);
    }
    const proxyMapJson = JSON.stringify(proxyMap);
    const pathPfxJson = JSON.stringify(PATH_TO_PFX);

    // 生成一个极简的拦截器，在 JS 文件加载后立即执行
    return `
(function(){
if(window.__ebridge_js_injected)return;
window.__ebridge_js_injected=1;
var P=${JSON.stringify(proxyBase)};
var D=${domainList};
var M=${proxyMapJson};
var K=${pathPfxJson};
var F=${JSON.stringify(pfx)};
function rp(p){for(var i in K){if(p.indexOf(i)===0)return K[i];}return F;}
function fb(t){for(var d in M){if(M[d]&&M[d].indexOf('/'+t+'/')!==-1)return M[d];}return P;}
function tp(u){if(!u||typeof u!=='string')return null;
if(u.indexOf('/api/ebridge/')!==-1)return u;
for(var i=0;i<D.length;i++){if(u.indexOf(D[i])===0){var pp=u.slice(D[i].length)||'/';return fb(rp(pp))+pp;}}
var o=window.location.origin;
if(u.indexOf(o)===0){var op=u.slice(o.length);if(op.indexOf('/api/ebridge/')!==0)return fb(rp(op))+op;return u;}
if(u.charAt(0)==='/'&&u.charAt(1)!=='/'){if(u.indexOf('/api/ebridge/')===0)return u;return fb(rp(u))+u;}
if(u.charAt(0)!=='#'&&u.indexOf('://')===-1){try{var a=document.createElement('a');a.href=u;if(a.href!==u)return tp(a.href);}catch(e){}return null;}
return null;}
var _f=window.fetch;if(_f){window.fetch=function(u,o){if(typeof u==='string'){var x=tp(u);if(x)u=x;}else if(u&&u.url){var x=tp(u.url);if(x&&x!==u.url)u=new Request(x,u);}return _f.call(window,u,o);};}
var _x=window.XMLHttpRequest;window.XMLHttpRequest=function(){var x=new _x();var oo=x.open;x.open=function(m,u){var xv=tp(u);return oo.call(x,m,xv||u);};return x;};window.XMLHttpRequest.prototype=_x.prototype;
var _c=document.createElement.bind(document);
document.createElement=function(t,o){var e=_c(t,o);var n=(t||'').toLowerCase();
if(n==='script'||n==='img'||n==='iframe'||n==='source'||n==='video'||n==='audio'||n==='embed'||n==='track'||n==='link'||n==='a'){
var os=e.setAttribute.bind(e);
e.setAttribute=function(n,v){if((n==='src'||n==='href')&&typeof v==='string'){var x=tp(v);if(x)v=x;}return os(n,v);};}
return e;};
})();
`.replace(/^\n/, "");
}

// --- 浏览器端资源加载拦截脚本 ---
// 注入到 <head> 中，在所有业务JS之前执行。
// 拦截 document.createElement / setAttribute / fetch / XHR / EventSource，
// 将需要代理的URL自动重写为代理前缀路径。
function buildInterceptScript(proxyPrefix: string, pfx: string): string {
    const proxyBase = proxyPrefix.replace(/\/$/, "");
    const domainBases = Object.values(DOMAINS).map((d) => d.replace(/\/$/, ""));
    const domainList = JSON.stringify(domainBases);

    // 为每个域名构建对应的代理前缀映射
    const proxyMap: Record<string, string> = {};
    for (const [k, v] of Object.entries(DOMAINS)) {
        proxyMap[v.replace(/\/$/, "")] = proxyBase.replace(`/${pfx}`, `/${k}`);
    }
    const proxyMapJson = JSON.stringify(proxyMap);
    const pathPfxJson = JSON.stringify(PATH_TO_PFX);
    const defaultPfxJson = JSON.stringify(pfx);

    return `
  <script>
  (function(){
    if (window.__ebridge_intercept_installed) return;
    window.__ebridge_intercept_installed = true;
    console.log('[ebridge-proxy] Intercept script loaded, PROXY=' + ${JSON.stringify(JSON.stringify(proxyBase))} + ', DEFAULT_PFX=' + ${JSON.stringify(JSON.stringify(pfx))});

    var PROXY = ${JSON.stringify(proxyBase)};
  var DOMAINS = ${domainList};
  var PROXY_MAP = ${proxyMapJson};
  var PATH_PFX = ${pathPfxJson};
  var DEFAULT_PFX = ${defaultPfxJson};

  // 根据路径前缀判断所属代理域
  function resolvePfx(path) {
    for (var prefix in PATH_PFX) {
      if (path.indexOf(prefix) === 0) return PATH_PFX[prefix];
    }
    return DEFAULT_PFX;
  }

  // 找到某个代理前缀对应的完整代理base（如 https://host/api/ebridge/proxy/uim）
  function findProxyBaseForPfx(targetPfx) {
    for (var d in PROXY_MAP) {
      if (PROXY_MAP[d] && PROXY_MAP[d].indexOf('/' + targetPfx + '/') !== -1) {
        return PROXY_MAP[d];
      }
    }
    return PROXY;
  }

  // 解析相对路径为绝对路径
  function resolveUrl(url) {
    if (!url || typeof url !== 'string') return url;
    // 已经是绝对 URL
    if (url.indexOf('://') !== -1) return url;
    // 根相对路径
    if (url.charAt(0) === '/') {
      return (window.location.protocol + '//' + window.location.host + url);
    }
    // 相对路径 - 相对于当前页面解析
    try {
      var a = document.createElement('a');
      a.href = url;
      return a.href;
    } catch(e) {
      return url;
    }
  }

  function tryProxy(absoluteUrl) {
    if (!absoluteUrl || typeof absoluteUrl !== 'string') return null;
    // 已经是代理路径的不用再重写
    if (absoluteUrl.indexOf('/api/ebridge/') !== -1) return absoluteUrl;
    // 匹配已知域名
    for (var i = 0; i < DOMAINS.length; i++) {
      var base = DOMAINS[i];
      if (absoluteUrl.indexOf(base) === 0) {
        var pathPart = absoluteUrl.slice(base.length) || '/';
        var correctPfx = resolvePfx(pathPart);
        return findProxyBaseForPfx(correctPfx) + pathPart;
      }
    }
    // 处理指向我们自己代理域名的绝对URL
    // RequireJS 等模块加载器会用 window.location.origin 拼接路径后创建 script 标签，
    // 此时传入的已经是完整的绝对URL（如 https://schedule.apoints.cn/login/xxx.js），
    // 需要通过代理路径重写
    var ourOrigin = window.location.origin;
    if (absoluteUrl.indexOf(ourOrigin) === 0) {
      var ourPath = absoluteUrl.slice(ourOrigin.length);
      if (ourPath.indexOf('/api/ebridge/') !== 0) {
        var _pfx = resolvePfx(ourPath);
        return findProxyBaseForPfx(_pfx) + ourPath;
      }
      return absoluteUrl;
    }
    // 以 / 开头的根相对路径
    if (absoluteUrl.charAt(0) === '/' && absoluteUrl.charAt(1) !== '/') {
      if (absoluteUrl.indexOf('/api/ebridge/') === 0) return absoluteUrl;
      var pfx = resolvePfx(absoluteUrl);
      return findProxyBaseForPfx(pfx) + absoluteUrl;
    }
    // 处理相对路径（不以 / 或协议开头）
    if (absoluteUrl.charAt(0) !== '#' && absoluteUrl.indexOf('://') === -1) {
      var resolved = resolveUrl(absoluteUrl);
      if (resolved && resolved !== absoluteUrl) {
        return tryProxy(resolved);
      }
    }
    return null;
  }

  // --- 拦截属性 setter（element.src = xxx / element.href = xxx）---
  // 许多 JS 框架（jQuery、RequireJS 等）使用属性直接赋值而非 setAttribute
  var _hookedProps = {};
  function hookPropSetter(proto, prop) {
    if (!proto) return;
    var key = '';
    try { key = Object.prototype.toString.call(proto); } catch(e) {}
    key = key + '|' + prop;
    if (_hookedProps[key]) return;
    try {
      var desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (desc && desc.set) {
        _hookedProps[key] = true;
        var origSetter = desc.set;
        Object.defineProperty(proto, prop, {
          get: desc.get,
          set: function(value) {
            if (typeof value === 'string' && value) {
              var proxied = tryProxy(value);
              if (proxied) value = proxied;
            }
            return origSetter.call(this, value);
          },
          configurable: true,
          enumerable: true
        });
      }
    } catch(e) {}
  }
  // 在所有相关原型上安装钩子
  hookPropSetter(window.HTMLScriptElement ? HTMLScriptElement.prototype : null, 'src');
  hookPropSetter(window.HTMLImageElement ? HTMLImageElement.prototype : null, 'src');
  hookPropSetter(window.HTMLLinkElement ? HTMLLinkElement.prototype : null, 'href');
  hookPropSetter(window.HTMLIFrameElement ? HTMLIFrameElement.prototype : null, 'src');
  hookPropSetter(window.HTMLSourceElement ? HTMLSourceElement.prototype : null, 'src');
  hookPropSetter(window.HTMLMediaElement ? HTMLMediaElement.prototype : null, 'src');
  hookPropSetter(window.HTMLEmbedElement ? HTMLEmbedElement.prototype : null, 'src');
  hookPropSetter(window.HTMLTrackElement ? HTMLTrackElement.prototype : null, 'src');
  hookPropSetter(window.HTMLAnchorElement ? HTMLAnchorElement.prototype : null, 'href');

  // --- 拦截 createElement ---
  var origCreateElement = document.createElement.bind(document);
  document.createElement = function(tagName, options) {
    var el = origCreateElement(tagName, options);
    var tag = (tagName || '').toLowerCase();
    // 对可能包含 src/href 的元素拦截 setAttribute
    if (tag === 'script' || tag === 'img' || tag === 'iframe' ||
        tag === 'source' || tag === 'video' || tag === 'audio' ||
        tag === 'embed' || tag === 'track' || tag === 'link' || tag === 'a') {
      var origSetAttr = el.setAttribute.bind(el);
      el.setAttribute = function(name, value) {
        if ((name === 'src' || name === 'href') && typeof value === 'string') {
          var proxied = tryProxy(value);
          if (proxied) value = proxied;
        }
        return origSetAttr(name, value);
      };
    }
    return el;
  };

  // --- 拦截 XMLHttpRequest ---
  var OrigXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    var xhr = new OrigXHR();
    var origOpen = xhr.open;
    xhr.open = function(method, url) {
      var proxied = tryProxy(url);
      if (proxied) { console.log('[ebridge-proxy] XHR intercepted: ' + url + ' -> ' + proxied); }
      var args = [method, proxied || url];
      for (var i = 2; i < arguments.length; i++) args.push(arguments[i]);
      return origOpen.apply(xhr, args);
    };
    return xhr;
  };
  window.XMLHttpRequest.prototype = OrigXHR.prototype;

  // --- 拦截 fetch ---
  if (window.fetch) {
    var origFetch = window.fetch.bind(window);
    window.fetch = function(url, options) {
      var originalUrl = typeof url === 'string' ? url : (url && url.url);
      if (typeof url === 'string') {
        var proxied = tryProxy(url);
        if (proxied) { console.log('[ebridge-proxy] fetch intercepted: ' + url + ' -> ' + proxied); url = proxied; }
      } else if (url && url instanceof Request) {
        var newUrl = tryProxy(url.url);
        if (newUrl && newUrl !== url.url) {
          console.log('[ebridge-proxy] fetch(Request) intercepted: ' + url.url + ' -> ' + newUrl);
          url = new Request(newUrl, url);
        }
      }
      return origFetch(url, options);
    };
  }

  // --- 拦截 EventSource ---
  if (window.EventSource) {
    var OrigES = window.EventSource;
    window.EventSource = function(url, config) {
      var proxied = tryProxy(url);
      return new OrigES(proxied || url, config);
    };
    window.EventSource.prototype = OrigES.prototype;
  }

  // --- 拦截 WebSocket (wss -> wss 不需要代理，但路径可能需要) ---
  if (window.WebSocket) {
    var OrigWS = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      if (typeof url === 'string' && url.charAt(0) === '/') {
        var proxied = tryProxy(url);
        if (proxied) url = proxied;
      }
      return new OrigWS(url, protocols);
    };
    window.WebSocket.prototype = OrigWS.prototype;
  }

  // --- 拦截 navigator.sendBeacon ---
  if (navigator.sendBeacon) {
    var origSendBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function(url, data) {
      var proxied = tryProxy(url);
      if (proxied) { console.log('[ebridge-proxy] sendBeacon intercepted: ' + url + ' -> ' + proxied); url = proxied; }
      return origSendBeacon(url, data);
    };
  }

  // --- 拦截 document.write ---
  // 有些 SPA 框架使用 document.write 来注入 HTML（含 script/link 标签）
  var origDocWrite = document.write.bind(document);
  document.write = function(html) {
    if (typeof html === 'string') {
      // 重写 document.write 注入的 HTML 中的资源 URL
      html = html.replace(/src=["'](\/[^"']*)["']/gi, function(m, path) {
        var proxied = tryProxy(path);
        return proxied ? 'src="' + proxied + '"' : m;
      });
      html = html.replace(/href=["'](\/[^"']*)["']/gi, function(m, path) {
        var proxied = tryProxy(path);
        return proxied ? 'href="' + proxied + '"' : m;
      });
    }
    return origDocWrite(html);
  };

  // --- 拦截 Element.prototype.insertAdjacentHTML ---
  var origInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
  Element.prototype.insertAdjacentHTML = function(position, html) {
    if (typeof html === 'string') {
      html = html.replace(/src=["'](\/[^"']*)["']/gi, function(m, path) {
        var proxied = tryProxy(path);
        return proxied ? 'src="' + proxied + '"' : m;
      });
      html = html.replace(/href=["'](\/[^"']*)["']/gi, function(m, path) {
        var proxied = tryProxy(path);
        return proxied ? 'href="' + proxied + '"' : m;
      });
    }
    return origInsertAdjacentHTML.call(this, position, html);
  };

  console.log('[ebridge-proxy] All interceptors installed successfully');
})();
</script>`;
}

// --- 检测 eBridge timetable iframe 的脚本 ---
const DETECT_SCRIPT = `
<script>
(function(){
  var done = false;
  function check() {
    try {
      var f = document.getElementById('myFrame');
      if (f && f.src && f.src.indexOf('http') === 0 && !done) {
        done = true;
        if (window.opener) {
          window.opener.postMessage({ type: 'EBRIDGE_TIMETABLE', url: f.src }, '*');
        }
      }
    } catch(e) {}
  }
  setInterval(check, 1500);
  setTimeout(check, 1000);
})();
</script>
`;

function rewriteHtml(html: string, proxyPrefix: string, pfx: string): string {
    let result = html;

    // 先注入拦截脚本（所有业务JS之前），再注入检测脚本
    result = result.replace(
        /(<head[^>]*>)/i,
        `$1${buildInterceptScript(proxyPrefix, pfx)}${DETECT_SCRIPT}`,
    );

    const otherDomains = Object.entries(DOMAINS).filter(([k]) => k !== pfx);
    for (const [otherPfx, base] of otherDomains) {
        const otherPrefix = proxyPrefix.replace(`/${pfx}/`, `/${otherPfx}/`);
        result = result.replace(
            new RegExp(
                base.replace(/\./g, "\\.").replace(/https?:\/\//g, "https?://"),
                "gi",
            ),
            otherPrefix,
        );
    }

    const ownBase = DOMAINS[pfx];
    result = result.replace(
        new RegExp(
            ownBase.replace(/\./g, "\\.").replace(/https?:\/\//g, "https?://"),
            "gi",
        ),
        proxyPrefix,
    );

    function rewriteRelPath(path: string): string {
        if (path.startsWith("/api/ebridge/")) return path;
        const targetPfx = resolvePfxForRelativePath(path, pfx);
        if (targetPfx !== pfx) {
            const targetPrefix = proxyPrefix.replace(
                `/${pfx}/`,
                `/${targetPfx}/`,
            );
            return `${targetPrefix}${path}`;
        }
        return `${proxyPrefix}${path}`;
    }

    // 处理 <base> 标签 - 确保相对路径解析基于代理 URL
    result = result.replace(/<base\s+[^>]*\/?>/gi, (_m: string) => {
        if (_m.indexOf("/api/ebridge/") !== -1) return _m;
        // 移除 base 标签，让浏览器使用页面 URL（已是代理路径）作为 base
        return "<!-- base tag removed by proxy -->";
    });

    result = result.replace(/src="(\/[^"]*)"/gi, (_, path) => {
        return `src="${rewriteRelPath(path)}"`;
    });
    result = result.replace(/href="(\/[^"]*)"/gi, (_, path) => {
        return `href="${rewriteRelPath(path)}"`;
    });
    result = result.replace(/action="(\/[^"]*)"/gi, (_, path) => {
        return `action="${rewriteRelPath(path)}"`;
    });
    result = result.replace(/url\('(\/[^']*)'\)/gi, (_, path) => {
        return `url('${rewriteRelPath(path)}')`;
    });
    result = result.replace(/url\("(\/[^"]*)"\)/gi, (_, path) => {
        return `url("${rewriteRelPath(path)}")`;
    });
    // 无引号的 url()
    result = result.replace(/url\((\/[^"'\s)][^)]*)\)/gi, (_, path) => {
        const clean = path.trim();
        if (clean.startsWith("data:") || clean.startsWith("http"))
            return `url(${clean})`;
        return `url(${rewriteRelPath(clean)})`;
    });
    // srcset 属性
    result = result.replace(/srcset="([^"]*)"/gi, (_, srcset: string) => {
        const parts = srcset.split(",").map((part: string) => {
            const trimmed = part.trim();
            const spaceIdx = trimmed.search(/\s/);
            if (spaceIdx > 0) {
                const url = trimmed.slice(0, spaceIdx);
                const descriptor = trimmed.slice(spaceIdx);
                if (url.startsWith("/") && !url.startsWith("/api/ebridge/")) {
                    return `${rewriteRelPath(url)}${descriptor}`;
                }
            }
            return part;
        });
        return `srcset="${parts.join(", ")}"`;
    });

    return result;
}

function rewriteLocation(
    location: string,
    proxyPrefix: string,
    pfx: string,
): string {
    if (location.startsWith("/")) {
        if (location.startsWith("/api/ebridge/")) return location;
        const targetPfx = resolvePfxForRelativePath(location, pfx);
        if (targetPfx !== pfx) {
            const targetPrefix = proxyPrefix.replace(
                `/${pfx}/`,
                `/${targetPfx}/`,
            );
            return `${targetPrefix}${location}`;
        }
        return `${proxyPrefix}${location}`;
    }
    for (const [otherPfx, base] of Object.entries(DOMAINS)) {
        if (location.startsWith(base)) {
            const pathPart = location.slice(base.length) || "/";
            const correctPfx = resolvePfxForRelativePath(pathPart, otherPfx);
            const usePfx = correctPfx !== otherPfx ? correctPfx : otherPfx;
            const targetPrefix = proxyPrefix.replace(`/${pfx}/`, `/${usePfx}/`);
            return location.replace(base, targetPrefix);
        }
    }
    return location;
}

function parseProxyPath(path: string): { pfx: string; rest: string } | null {
    const withoutProxy = path.replace(/^\/proxy\//, "");
    for (const pfx of Object.keys(DOMAINS)) {
        if (withoutProxy === pfx || withoutProxy.startsWith(pfx + "/")) {
            const rest =
                withoutProxy === pfx ? "/" : withoutProxy.slice(pfx.length);
            return { pfx, rest };
        }
    }
    return null;
}

router.all("/proxy/*", async (req, res) => {
    logger.info(`Ebridge proxy request: ${req.method} ${req.path}`);
    let targetUrl = "";
    let base = "";
    try {
        let parsed = parseProxyPath(req.path);
        if (!parsed) {
            const without = req.path.replace(/^\/proxy\//, "");
            const defaultPfx = Object.keys(DOMAINS)[0] || "eb";
            const redirectUrl = `/api/ebridge/proxy/${defaultPfx}/${without}`;
            return res.redirect(307, redirectUrl);
        }
        const { pfx, rest } = parsed;

        // 检查 rest 路径是否实际上属于另一个代理域
        const correctPfx = resolvePfxForRelativePath(rest, pfx);
        if (correctPfx !== pfx) {
            const queryString = req.url.includes("?")
                ? req.url.slice(req.url.indexOf("?"))
                : "";
            const redirectUrl = `/api/ebridge/proxy/${correctPfx}${rest}${queryString}`;
            logger.info(
                `Ebridge proxy: redirecting ${req.path} -> ${redirectUrl} (path prefix belongs to ${correctPfx})`,
            );
            return res.redirect(307, redirectUrl);
        }

        base = getTarget(pfx);
        const queryString = req.url.includes("?")
            ? req.url.slice(req.url.indexOf("?"))
            : "";
        targetUrl = `${base}${rest}${queryString}`;

        const proxyPrefix = buildProxyPrefix(req, pfx);

        // 更完整的请求头转发，减少上游返回502的概率
        const headers: Record<string, string> = {};
        const forwardHeaders = [
            "cookie",
            "content-type",
            "user-agent",
            "accept",
            "accept-encoding",
            "accept-language",
            "cache-control",
            "pragma",
            "x-requested-with",
            "sec-fetch-dest",
            "sec-fetch-mode",
            "sec-fetch-site",
        ];
        // 转发 Referer 和 Origin 时重写为上游域名，避免跨域检测
        const referer = req.headers["referer"];
        const origin = req.headers["origin"];
        if (referer && typeof referer === "string") {
            headers["referer"] = referer.replace(
                buildProxyPrefix(req, pfx),
                base,
            );
            for (const [otherPfx, otherBase] of Object.entries(DOMAINS)) {
                if (otherPfx !== pfx) {
                    const otherPrefix = buildProxyPrefix(req, otherPfx);
                    headers["referer"] = (headers["referer"] as string).replace(
                        otherPrefix,
                        otherBase,
                    );
                }
            }
        }
        if (origin && typeof origin === "string") {
            headers["origin"] = origin.replace(/https?:\/\/[^/]+/, base);
        }
        for (const h of forwardHeaders) {
            const val = req.headers[h];
            if (val) {
                headers[h] = Array.isArray(val)
                    ? val.join(", ")
                    : (val as string);
            }
        }
        if (!headers["accept"]) headers["accept"] = "*/*";
        if (!headers["accept-language"])
            headers["accept-language"] = "zh-CN,zh;q=0.9";

        const response = await axios({
            method: req.method as
                | "GET"
                | "POST"
                | "PUT"
                | "DELETE"
                | "PATCH"
                | "HEAD"
                | "OPTIONS",
            url: targetUrl,
            headers,
            data:
                req.method !== "GET" && req.method !== "HEAD"
                    ? req.body
                    : undefined,
            maxRedirects: 0,
            validateStatus: () => true,
            responseType: "arraybuffer",
            timeout: 45000,
            httpsAgent,
        });

        // 处理响应头
        for (const [key, value] of Object.entries(response.headers)) {
            if (key === "set-cookie" && value) {
                const cookies = Array.isArray(value) ? value : [value];
                const rewritten = cookies.map((c: string) =>
                    c
                        .replace(/domain=[^;]*/gi, "")
                        .replace(/path=\/[^;]*/gi, "path=/api/ebridge"),
                );
                res.setHeader("set-cookie", rewritten);
            } else if (
                key !== "transfer-encoding" &&
                key !== "content-encoding" &&
                key !== "x-frame-options" &&
                key !== "content-security-policy"
            ) {
                res.setHeader(key, String(value));
            }
        }

        const contentType = response.headers["content-type"] || "";
        const ctLower =
            typeof contentType === "string" ? contentType.toLowerCase() : "";
        let body = response.data;

        logger.debug(
            `Ebridge proxy response: status=${response.status}, content-type="${contentType}", proxyPrefix=${proxyPrefix}, pfx=${pfx}`,
        );

        if (typeof body === "object" && !Buffer.isBuffer(body)) {
            return res.status(response.status).json(body);
        }

        // HTML 响应：注入拦截脚本 + 重写静态路径
        if (/text\/html/.test(ctLower)) {
            logger.info(
                `Ebridge proxy: rewriting HTML for ${req.path}, injecting intercept script`,
            );
            let html = body.toString("utf-8");
            const hasHead = /<head[^>]*>/i.test(html);
            logger.debug(
                `Ebridge proxy HTML: has <head> tag = ${hasHead}, body length = ${html.length}`,
            );
            html = rewriteHtml(html, proxyPrefix, pfx);
            body = Buffer.from(html, "utf-8");
            res.setHeader("Content-Type", "text/html; charset=utf-8");
        }
        // CSS 响应：重写 url() 中的路径
        else if (/text\/css/.test(ctLower)) {
            let css = body.toString("utf-8");
            css = css.replace(
                /url\(["']?(\/[^"')]*?)["']?\)/gi,
                (_match: string, path: string) => {
                    if (
                        path.startsWith("/api/ebridge/") ||
                        path.startsWith("data:") ||
                        path.startsWith("http")
                    ) {
                        return `url(${path})`;
                    }
                    const targetPfx = resolvePfxForRelativePath(path, pfx);
                    if (targetPfx !== pfx) {
                        const targetPrefix = proxyPrefix.replace(
                            `/${pfx}/`,
                            `/${targetPfx}/`,
                        );
                        return `url(${targetPrefix}${path})`;
                    }
                    return `url(${proxyPrefix}${path})`;
                },
            );
            body = Buffer.from(css, "utf-8");
            res.setHeader(
                "Content-Type",
                ctLower.includes("charset")
                    ? String(contentType)
                    : "text/css; charset=utf-8",
            );
        }
        // JS 响应：注入拦截脚本 + 重写硬编码的域名引用
        else if (
            /\/javascript|\/x-javascript/.test(ctLower) ||
            /\.js(\?|$)/.test(req.path || "")
        ) {
            let js = body.toString("utf-8");
            // 在 JS 文件开头注入拦截代码，确保钩子在业务代码执行前安装
            const preamble = buildJsInterceptPreamble(proxyPrefix, pfx);
            js = preamble + js;
            logger.info(
                `Ebridge proxy: injected JS intercept into ${req.path}`,
            );
            const domainBases = Object.values(DOMAINS);
            for (const domainBase of domainBases) {
                const escaped = domainBase.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&",
                );
                const target = proxyPrefix;
                js = js.replace(new RegExp(escaped, "gi"), target);
            }
            body = Buffer.from(js, "utf-8");
            res.setHeader(
                "Content-Type",
                ctLower.includes("charset")
                    ? String(contentType)
                    : "application/javascript; charset=utf-8",
            );
        }

        // 重定向响应：重写 Location 头
        if (
            response.status >= 300 &&
            response.status < 400 &&
            response.headers.location
        ) {
            const loc = response.headers.location as string;
            const rewritten = rewriteLocation(loc, proxyPrefix, pfx);
            logger.info(
                `Ebridge proxy: redirect ${response.status} from ${loc} -> ${rewritten}`,
            );
            res.setHeader("Location", rewritten);
        }

        res.status(response.status).send(body);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "未知错误";
        const stack = error instanceof Error ? error.stack : "";
        let axiosErr = "";
        let axiosCode = "";
        if ((error as any)?.isAxiosError) {
            if ((error as any)?.response?.status) {
                axiosErr = `upstream_status=${(error as any).response.status}`;
            }
            if ((error as any)?.code) {
                axiosCode = `code=${(error as any).code}`;
            }
        }
        const urlInfo =
            typeof targetUrl !== "undefined"
                ? ` | url=${targetUrl}`
                : ` | path=${req.path}`;
        logger.error(
            `Ebridge proxy error: ${message}${urlInfo} | ${axiosErr} | ${axiosCode} | ${stack?.split("\n")[0] || ""}`,
        );
        res.status(502).send("Ebridge proxy error");
    }
});

export default router;
