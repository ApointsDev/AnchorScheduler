import express from 'express';
import axios from 'axios';
import { logger } from '../Utils/logger.js';

const router = express.Router();

function loadDomains(): Record<string, string> {
  const raw = process.env.EBRIDGE_PROXY_DOMAINS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, string>;
      const valid: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (/^[a-z0-9-]+$/.test(k) && v.startsWith('https://')) {
          valid[k] = v.replace(/\/$/, '');
        }
      }
      if (Object.keys(valid).length > 0) return valid;
    } catch { /* fall through */ }
  }
  return {
    eb: 'https://ebridge.xjtlu.edu.cn',
    uim: 'https://uim.xjtlu.edu.cn',
  };
}

const DOMAINS = loadDomains();

function getTarget(pfx: string) {
  const base = DOMAINS[pfx];
  if (!base) throw new Error(`Unknown proxy prefix: ${pfx}`);
  return base;
}

function buildProxyPrefix(host: string, pfx: string) {
  const scheme = host.startsWith('localhost') ? 'http' : 'https';
  return `${scheme}://${host}/api/ebridge/proxy/${pfx}`;
}

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

  result = result.replace(/(<head[^>]*>)/i, `$1${DETECT_SCRIPT}`);

  const otherDomains = Object.entries(DOMAINS).filter(([k]) => k !== pfx);
  for (const [otherPfx, base] of otherDomains) {
    const otherPrefix = proxyPrefix.replace(`/${pfx}/`, `/${otherPfx}/`);
    result = result.replace(
      new RegExp(base.replace(/\./g, '\\.').replace(/https?:\/\//g, 'https?://'), 'gi'),
      otherPrefix
    );
  }

  const ownBase = DOMAINS[pfx];
  result = result.replace(
    new RegExp(ownBase.replace(/\./g, '\\.').replace(/https?:\/\//g, 'https?://'), 'gi'),
    proxyPrefix
  );

  result = result.replace(/src="(\/[^"]*)"/gi, (_, path) => {
    if (path.startsWith('/api/ebridge/')) return `src="${path}"`;
    return `src="${proxyPrefix}${path}"`;
  });
  result = result.replace(/href="(\/[^"]*)"/gi, (_, path) => {
    if (path.startsWith('/api/ebridge/')) return `href="${path}"`;
    return `href="${proxyPrefix}${path}"`;
  });
  result = result.replace(/action="(\/[^"]*)"/gi, (_, path) => {
    if (path.startsWith('/api/ebridge/')) return `action="${path}"`;
    return `action="${proxyPrefix}${path}"`;
  });
  result = result.replace(/url\('(\/[^']*)'\)/gi, (_, path) => {
    if (path.startsWith('/api/ebridge/')) return `url('${path}')`;
    return `url('${proxyPrefix}${path}')`;
  });
  result = result.replace(/url\("(\/[^"]*)"\)/gi, (_, path) => {
    if (path.startsWith('/api/ebridge/')) return `url("${path}")`;
    return `url("${proxyPrefix}${path}")`;
  });

  return result;
}

function rewriteLocation(location: string, proxyPrefix: string, pfx: string): string {
  if (location.startsWith('/')) {
    if (location.startsWith('/api/ebridge/')) return location;
    return `${proxyPrefix}${location}`;
  }
  for (const [otherPfx, base] of Object.entries(DOMAINS)) {
    if (location.startsWith(base)) {
      const otherPrefix = proxyPrefix.replace(`/${pfx}/`, `/${otherPfx}/`);
      return location.replace(base, otherPrefix);
    }
  }
  return location;
}

function parseProxyPath(path: string): { pfx: string; rest: string } | null {
  const withoutProxy = path.replace(/^\/proxy\//, '');
  for (const pfx of Object.keys(DOMAINS)) {
    if (withoutProxy === pfx || withoutProxy.startsWith(pfx + '/')) {
      const rest = withoutProxy === pfx ? '/' : withoutProxy.slice(pfx.length);
      return { pfx, rest };
    }
  }
  return null;
}

router.all('/proxy/*', async (req, res) => {
  try {
    let parsed = parseProxyPath(req.path);
    if (!parsed) {
      const without = req.path.replace(/^\/proxy\//, '');
      const defaultPfx = Object.keys(DOMAINS)[0] || 'eb';
      const redirectUrl = `/api/ebridge/proxy/${defaultPfx}/${without}`;
      return res.redirect(307, redirectUrl);
    }
    const { pfx, rest } = parsed;
    const base = getTarget(pfx);
    const queryString = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const targetUrl = `${base}${rest}${queryString}`;

    const proxyPrefix = buildProxyPrefix(req.get('host') || 'localhost:3000', pfx);

    const headers: Record<string, string> = {};
    if (req.headers.cookie) headers['Cookie'] = req.headers.cookie as string;
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'] as string;
    if (req.headers['user-agent']) headers['User-Agent'] = req.headers['user-agent'] as string;
    headers['Accept'] = req.headers.accept || '*/*';
    headers['Accept-Language'] = req.headers['accept-language'] || 'zh-CN,zh;q=0.9';

    const response = await axios({
      method: req.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
      url: targetUrl,
      headers,
      data: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      maxRedirects: 0,
      validateStatus: () => true,
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    for (const [key, value] of Object.entries(response.headers)) {
      if (key === 'set-cookie' && value) {
        const cookies = Array.isArray(value) ? value : [value];
        const rewritten = cookies.map((c: string) =>
          c.replace(/domain=[^;]*/gi, '')
            .replace(/path=\/ebridge/gi, 'path=/api/ebridge')
            .replace(/path=\/uim/gi, 'path=/api/ebridge')
        );
        res.setHeader('set-cookie', rewritten);
      } else if (
        key !== 'transfer-encoding' &&
        key !== 'content-encoding' &&
        key !== 'x-frame-options' &&
        key !== 'content-security-policy'
      ) {
        res.setHeader(key, value as string);
      }
    }

    const contentType = response.headers['content-type'] || '';
    let body = response.data;

    if (typeof body === 'object' && !Buffer.isBuffer(body)) {
      return res.status(response.status).json(body);
    }

    if (/text\/html/.test(contentType)) {
      let html = body.toString('utf-8');
      html = rewriteHtml(html, proxyPrefix, pfx);
      body = Buffer.from(html, 'utf-8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }

    if (response.status >= 300 && response.status < 400 && response.headers.location) {
      const loc = response.headers.location as string;
      const rewritten = rewriteLocation(loc, proxyPrefix, pfx);
      res.setHeader('Location', rewritten);
    }

    res.status(response.status).send(body);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    logger.error(`Ebridge proxy error: ${message}`);
    res.status(502).send('Ebridge proxy error');
  }
});

export default router;
