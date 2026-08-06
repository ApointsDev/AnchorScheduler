// 认证相关路由：注册、登录、Exchange OAuth、CAF OAuth、SMTP 绑定
// 从 index.ts 拆出以降低 index.ts 耦合度

import express from "express";
import axios from "axios";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../Utils/logger.js";
import { dbService } from "../Services/dbService";
import { User } from "../types/models";
import type { CafConfig, CafUserLookup } from "../Services/cafAuth";
import {
    buildCafAuthorizeUrl,
    checkCafReady,
    createDefaultUserFields,
    createDefaultWelcomeTask,
    handleCafCodeExchange,
} from "../Services/cafAuth";

// ── 类型 ───────────────────────────────────────────────────

export interface AuthRouteContext {
    /** 用户缓存 Map */
    userCache: Map<string, User>;
    /** 签发 JWT */
    signJwt(payload: object): string;
    /** 验证 JWT */
    verifyJwt(token: string): any;
    /** 按邮箱查找用户 */
    findUserByEmail(email: string): Promise<User | null>;
    /** 按 CAF sub 查找用户 */
    findUserByCafSub(cafSub: string): Promise<User | null>;
    /** JWT 身份验证中间件 */
    authenticateToken(req: any, res: any, next: any): Promise<void>;
    /** 前端 URL */
    frontendUrl: string;
    /** Exchange OAuth 配置 */
    exchangeOAuthConfig: {
        clientId: string;
        clientSecret: string;
        authUrl: string;
        tokenUrl: string;
        redirectUri: string;
        scope: string;
    };
    /** CAF 配置 */
    cafConfig: CafConfig;
}

// ── 用户工厂 ───────────────────────────────────────────────

function createDefaultUser(
    email: string,
    name: string,
    passwordHash?: string,
): User {
    return {
        id: uuidv4(),
        email,
        name,
        passwordHash,
        ...createDefaultUserFields(),
    } as User;
}

// ── 工厂函数 ───────────────────────────────────────────────

export function createAuthRoutes(ctx: AuthRouteContext): express.Router {
    const {
        userCache,
        signJwt,
        verifyJwt,
        findUserByEmail,
        authenticateToken,
        frontendUrl,
        exchangeOAuthConfig,
        cafConfig,
    } = ctx;

    const router = express.Router();

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

    router.get("/auth/exchange", (req, res) => {
        if (!exchangeOAuthConfig.clientId || !exchangeOAuthConfig.authUrl) {
            return res
                .status(500)
                .send("Exchange Auth not configured on server.");
        }

        const providedJwt =
            (req.query.jwt as string) ||
            (() => {
                const auth = (req.headers.authorization || "") as string;
                if (auth.toLowerCase().startsWith("bearer "))
                    return auth.slice(7).trim();
                return undefined;
            })();
        const loginHint = req.query.login_hint as string;

        let stateObj: any = {};
        if (providedJwt) stateObj.jwt = providedJwt;
        if (loginHint) stateObj.email = loginHint;

        const state =
            Object.keys(stateObj).length > 0
                ? Buffer.from(JSON.stringify(stateObj)).toString("base64")
                : undefined;

        const params = new URLSearchParams({
            client_id: exchangeOAuthConfig.clientId,
            redirect_uri: exchangeOAuthConfig.redirectUri,
            response_type: "code",
            scope: exchangeOAuthConfig.scope,
            prompt: "login",
        });
        params.append("domain_hint", "organizations");
        if (state) params.append("state", state);
        if (loginHint) params.append("login_hint", loginHint);

        res.redirect(`${exchangeOAuthConfig.authUrl}?${params.toString()}`);
    });

    // ── Exchange OAuth 回调 ────────────────────────────────

    router.get("/auth/exchange/callback", async (req, res) => {
        const code = req.query.code as string;
        const error = req.query.error as string;
        const errorDescription = req.query.error_description as string;
        const state = req.query.state as string;

        if (error) {
            logger.error(
                "Exchange Auth error callback:",
                error,
                errorDescription,
            );
            if (error.includes("invalid_scope")) {
                return res
                    .status(400)
                    .send(exchangeErrorHtml(error, errorDescription));
            }
            return res
                .status(400)
                .send(`Auth failed: ${error} - ${errorDescription}`);
        }
        if (!code) return res.status(400).send("No code provided");

        try {
            const bodyParams = new URLSearchParams();
            bodyParams.append("client_id", exchangeOAuthConfig.clientId);
            bodyParams.append(
                "client_secret",
                exchangeOAuthConfig.clientSecret,
            );
            bodyParams.append("grant_type", "authorization_code");
            bodyParams.append("code", code);
            bodyParams.append("redirect_uri", exchangeOAuthConfig.redirectUri);
            bodyParams.append("scope", exchangeOAuthConfig.scope);

            const tokenResponse = await axios.post(
                exchangeOAuthConfig.tokenUrl,
                bodyParams,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            const { access_token, refresh_token, expires_in } =
                tokenResponse.data;
            const expiresAt = Date.now() + (expires_in || 3600) * 1000;

            let providedJwt: string | undefined;
            let loginHintEmail: string | undefined;

            try {
                if (state) {
                    const decodedState = Buffer.from(state, "base64").toString(
                        "utf-8",
                    );
                    try {
                        const st = JSON.parse(decodedState);
                        providedJwt = st.jwt;
                        loginHintEmail = st.email;
                    } catch {
                        providedJwt = decodedState;
                    }
                }
            } catch (e) {
                logger.warn("Error parsing Exchange auth state:", e);
            }

            if (providedJwt) {
                const decoded = verifyJwt(providedJwt);
                if (decoded && decoded.sub) {
                    const userId = decoded.sub as string;
                    let user =
                        (await dbService.getUserById(userId)) || undefined;
                    if (user) {
                        user.ExchangeAccessToken = access_token;
                        user.ExchangeRefreshToken = refresh_token;
                        user.ExchangeTokenExpiresAt = expiresAt;
                        user.ExchangeBinded = true;
                        if (loginHintEmail) {
                            user.XJTLUaccount = loginHintEmail;
                        }
                        await dbService.updateUser(user);
                        userCache.set(userId, user);
                        logger.info(`Bound Exchange OAuth to user ${userId}`);
                        return res.send(exchangeBoundHtml());
                    }
                }
            }
            res.status(400).send(
                "Failed to bind to user session. Please try again from the settings page.",
            );
        } catch (err: any) {
            logger.error(
                "Exchange Token Exchange failed:",
                err.response?.data || err.message,
            );
            res.status(500).send(
                `Token exchange failed: ${JSON.stringify(err.response?.data || err.message)}`,
            );
        }
    });

    // ── IMAP 绑定 ──────────────────────────────────────────

    router.post(
        "/auth/imap/bind",
        authenticateToken,
        async (req: any, res: any) => {
            const user = req.user as User;
            const { imapEmail, imapPassword, imapHost, imapPort, imapTls } =
                req.body || {};
            if (!imapEmail || !imapPassword || !imapHost || !imapPort) {
                return res.status(400).json({
                    error: "Missing required IMAP configuration fields",
                });
            }
            user.ImapEmail = imapEmail;
            user.ImapPassword = imapPassword;
            user.ImapHost = imapHost;
            user.ImapPort = Number(imapPort);
            user.ImapTls = imapTls !== false;
            user.ImapBinded = true;
            await dbService.updateUser(user);
            userCache.set(user.id, user);
            res.json({ success: true, message: "IMAP bound successfully" });
        },
    );

    router.post(
        "/auth/imap/unbind",
        authenticateToken,
        async (req: any, res: any) => {
            const user = req.user as User;
            user.ImapBinded = false;
            user.ImapEmail = undefined;
            user.ImapPassword = undefined;
            user.ImapHost = undefined;
            user.ImapPort = undefined;
            user.ImapTls = undefined;
            await dbService.updateUser(user);
            userCache.set(user.id, user);
            res.json({
                success: true,
                message: "IMAP unbound successfully",
            });
        },
    );

    // ── CAF OAuth ──────────────────────────────────────────

    const cafLookup: CafUserLookup = {
        userCache,
        findUserByEmail,
        findUserByCafSub: ctx.findUserByCafSub,
    };

    router.get("/auth/caf", (_req, res) => {
        const notReady = checkCafReady(cafConfig);
        if (notReady) return res.status(500).send(notReady);
        res.redirect(buildCafAuthorizeUrl(cafConfig, cafConfig.redirectUri));
    });

    router.get("/api/auth/caf/authorize-url", (req, res) => {
        const notReady = checkCafReady(cafConfig);
        if (notReady) return res.status(500).json({ error: notReady });

        const platform = (req.query.platform as string) || "web";
        const redirectUri =
            platform === "mobile"
                ? cafConfig.mobileRedirectUri
                : cafConfig.redirectUri;
        res.json({
            url: buildCafAuthorizeUrl(cafConfig, redirectUri),
            platform,
        });
    });

    router.get("/auth/caf/callback", async (req, res) => {
        const code = req.query.code as string;
        if (!code)
            return res
                .status(400)
                .send("No authorization code provided by CAF.");

        try {
            const { jwtToken, email } = await handleCafCodeExchange(
                cafLookup,
                cafConfig,
                code,
                cafConfig.redirectUri,
                signJwt,
            );
            const emailParam = email
                ? `&email=${encodeURIComponent(email)}`
                : "";
            return res.redirect(
                `${frontendUrl}/login?token=${encodeURIComponent(jwtToken)}&from=caf${emailParam}`,
            );
        } catch (error: any) {
            logger.error(
                "CAF OAuth callback failed:",
                error.response?.data || error.message,
            );
            const msg = encodeURIComponent("CAF 登录失败，请稍后重试");
            return res.redirect(`${frontendUrl}/login?caf_error=${msg}`);
        }
    });

    router.post("/api/auth/caf/token", async (req, res) => {
        const code = req.body?.code;
        if (!code) return res.status(400).json({ error: "code is required" });

        try {
            const { jwtToken, email, name } = await handleCafCodeExchange(
                cafLookup,
                cafConfig,
                code,
                cafConfig.mobileRedirectUri,
                signJwt,
            );
            res.json({ token: jwtToken, email, name });
        } catch (error: any) {
            logger.error(
                "CAF mobile token exchange failed:",
                error.response?.data || error.message,
            );
            res.status(500).json({
                error: error.message || "CAF 登录失败，请稍后重试",
            });
        }
    });

    return router;
}

// ── Exchange 错误页面 ──────────────────────────────────────

function exchangeErrorHtml(error: string, errorDescription: string): string {
    return `
<!DOCTYPE html>
<html><head>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;max-width:800px;margin:0 auto;padding:20px;color:#333}
h1{color:#d32f2f;margin-bottom:20px}
.card{background:#f8f9fa;border:1px solid #ddd;border-radius:8px;padding:20px;box-shadow:0 2px 4px rgba(0,0,0,0.05)}
code{background:#e9ecef;padding:2px 5px;border-radius:4px;font-family:Consolas,monospace}
ol{padding-left:20px}li{margin-bottom:10px}strong{color:#C00}
</style></head><body>
<h1>授权失败：权限范围 (Scope) 错误</h1>
<div class="card">
<p>Azure 拒绝了您的请求，因为应用没有正确配置 <strong>Microsoft Graph Delegated</strong> 权限。</p>
<p>当前默认 Scope 为：<code>offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read</code></p>
<h3>核心排查点：应用注册类型 (Supported Account Types)</h3>
<p><strong>这是最可能的原因：</strong> 您可能正在尝试使用一个仅支持"个人账户"的应用 ID 来请求"企业/学校"的 Graph 权限。</p>
<ul>
<li><strong>现象：</strong> 学校邮箱可在 Outlook 客户端登录，但自注册应用登录时提示需要管理员授权或 scope 无效。</li>
<li><strong>解决方案：</strong><ol>
<li>在 Azure Portal 注册新的 App，选择 <strong>"Accounts in any organizational directory (Any Azure AD directory - Multitenant)"</strong></li>
<li>添加 API 权限 (Microsoft Graph Delegated) 和 Redirect URI</li>
<li>更新 <code>EXCHANGE_CLIENT_ID</code> 和 <code>EXCHANGE_CLIENT_SECRET</code> 到 <code>.env</code></li>
</ol></li></ul>
<h3>备选检查步骤</h3><ol>
<li>确保已添加 <strong>"Microsoft Graph"</strong> -> <strong>"Mail.Read"</strong>、<strong>"Calendars.Read"</strong>（Delegated）</li>
<li>让管理员在 Entra ID 中允许用户同意低风险应用权限</li>
<li>管理员点击 <strong>"Grant admin consent"</strong></li>
</ol>
<p><small style="color:#666">错误代码: ${error} - ${errorDescription}</small></p>
</div></body></html>`;
}

function exchangeBoundHtml(): string {
    return `<h1>Exchange 绑定成功!</h1><p>您可以关闭此窗口并刷新主应用。</p><script>window.opener?.postMessage({type:"EXCHANGE_BOUND"},"*");setTimeout(()=>window.close(),3000);</script>`;
}
