// CAF (Central Authentication Facility) 认证相关逻辑
// 包括：配置、子服务器注册、OAuth token 交换、用户查找/创建、token 刷新

import axios from "axios";
import path from "path";
import { promises as fs } from "fs";
import { generateKeyPairSync } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import { dbService } from "./dbService";
import { logUserEvent } from "./userLog";
import type { User, Task } from "../types/models";

// ── CAF 配置 ───────────────────────────────────────────────

export interface CafConfig {
    baseUrl: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    mobileRedirectUri: string;
    subServerName: string;
    emailDomain: string;
    imapHost: string;
    imapPort: number;
}

export function createCafConfig(backendUrl: string): CafConfig {
    const raw = process.env.CAF_SERVER_BASE_URL || "";
    const baseUrl = raw.endsWith("/") ? raw.slice(0, -1) : raw;
    return {
        baseUrl,
        clientId: "",
        clientSecret: "",
        redirectUri:
            process.env.CAF_REDIRECT_URI || `${backendUrl}/auth/caf/callback`,
        mobileRedirectUri:
            process.env.CAF_MOBILE_REDIRECT_URI ||
            "schedule.apoints://caf/callback",
        subServerName: process.env.CAF_SUBSERVER_NAME || "AI Time Manager",
        emailDomain: process.env.CAF_EMAIL_DOMAIN || "apoints.email",
        imapHost: process.env.CAF_IMAP_HOST || "imap.apoints.email",
        imapPort: Number(process.env.CAF_IMAP_PORT) || 993,
    };
}

// ── 文件路径 ───────────────────────────────────────────────

function getCafCredsFile(): string {
    return (
        process.env.CAF_CREDENTIALS_FILE ||
        path.join(process.cwd(), "server", ".caf-client.json")
    );
}

function getCafPublicKeyFile(): string {
    return (
        process.env.CAF_PUBLIC_KEY_FILE ||
        path.join(process.cwd(), "server", ".caf-public.pem")
    );
}

function getCafPrivateKeyFile(): string {
    return (
        process.env.CAF_PRIVATE_KEY_FILE ||
        path.join(process.cwd(), "server", ".caf-private.pem")
    );
}

// ── 密钥管理 ───────────────────────────────────────────────

export async function ensureCafKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
}> {
    const pubFile = getCafPublicKeyFile();
    const privFile = getCafPrivateKeyFile();
    try {
        const [publicKey, privateKey] = await Promise.all([
            fs.readFile(pubFile, "utf8"),
            fs.readFile(privFile, "utf8"),
        ]);
        return { publicKey, privateKey };
    } catch {
        const pair = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });
        await fs.mkdir(path.dirname(pubFile), { recursive: true });
        await Promise.all([
            fs.writeFile(pubFile, pair.publicKey, "utf8"),
            fs.writeFile(privFile, pair.privateKey, {
                encoding: "utf8",
                mode: 0o600,
            }),
        ]);
        logger.info("Generated CAF RSA key pair for subserver registration.");
        return { publicKey: pair.publicKey, privateKey: pair.privateKey };
    }
}

/** 从持久化文件中读取 CAF client credentials */
export async function loadCafCredsFromFile(): Promise<{
    clientId: string;
    clientSecret: string;
} | null> {
    try {
        const f = getCafCredsFile();
        const raw = await fs.readFile(f, "utf8");
        const parsed = JSON.parse(raw);
        if (parsed?.id && parsed?.secret) {
            return {
                clientId: String(parsed.id),
                clientSecret: String(parsed.secret),
            };
        }
    } catch {
        // ignore
    }
    return null;
}

async function saveCafCredentials(credentials: { id: string; secret: string }) {
    const f = getCafCredsFile();
    await fs.mkdir(path.dirname(f), { recursive: true });
    await fs.writeFile(f, JSON.stringify(credentials, null, 2), "utf8");
}

/**
 * 确保 CAF 子服务器已注册，获取 clientId/clientSecret 并持久化。
 * 返回 true 表示 CAF 就绪，false 表示已跳过（未配置 baseUrl）。
 */
export async function ensureCafClientCredentials(
    cafConfig: CafConfig,
): Promise<boolean> {
    if (!cafConfig.baseUrl) {
        logger.warn("CAF_SERVER_BASE_URL is empty, CAF login is disabled.");
        return false;
    }

    const persisted = await loadCafCredsFromFile();
    if (persisted) {
        cafConfig.clientId = persisted.clientId;
        cafConfig.clientSecret = persisted.clientSecret;
        logger.info("Loaded CAF subserver credentials from persisted file.");
        return true;
    }

    const { publicKey } = await ensureCafKeyPair();
    const registerResp = await axios.post(
        `${cafConfig.baseUrl}/api/subserver/register`,
        {
            name: cafConfig.subServerName,
            public_key: publicKey,
        },
        { headers: { "Content-Type": "application/json" } },
    );

    const id = registerResp.data?.id;
    const secret = registerResp.data?.secret;
    if (!id || !secret) {
        throw new Error("CAF register response missing id/secret");
    }

    cafConfig.clientId = String(id);
    cafConfig.clientSecret = String(secret);
    await saveCafCredentials({
        id: cafConfig.clientId,
        secret: cafConfig.clientSecret,
    });
    logger.info(
        "CAF subserver auto-registration completed and credentials persisted.",
    );
    return true;
}

// ── JWT 解码 ───────────────────────────────────────────────

export function decodeJwtPayload(token: string): Record<string, any> | null {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
        const json = Buffer.from(normalized, "base64").toString("utf8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

// ── 用户信息 ───────────────────────────────────────────────

export async function fetchCafUserInfo(
    cafConfig: CafConfig,
    accessToken: string,
): Promise<{ email?: string; name?: string }> {
    const userinfoPaths = [
        "/api/userinfo",
        "/api/oauth/userinfo",
        "/api/user/info",
    ];
    for (const p of userinfoPaths) {
        try {
            const resp = await axios.get(`${cafConfig.baseUrl}${p}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                timeout: 5000,
                validateStatus: (s) => s < 500,
            });
            if (resp.status === 200 && resp.data) {
                const d = resp.data;
                const email = d.email || d.preferred_username || d.upn || "";
                const name =
                    d.name ||
                    d.displayName ||
                    d.username ||
                    d.preferred_name ||
                    "";
                if (email || name) {
                    logger.info(`CAF userinfo resolved via ${p}`);
                    return {
                        email: email || undefined,
                        name: name || undefined,
                    };
                }
            }
        } catch {
            // try next
        }
    }
    return {};
}

// ── Token 刷新 ─────────────────────────────────────────────

// 防止并发刷新同一个用户的 token（CAF 通常使用 refresh token rotation，
// 并发使用同一个 refresh_token 会导致第二次请求失败）
const refreshLocks = new Map<string, Promise<boolean>>();

export async function refreshCafToken(
    cafConfig: CafConfig,
    user: User,
): Promise<boolean> {
    if (
        !user.CAFRefreshToken ||
        !cafConfig.baseUrl ||
        !cafConfig.clientId ||
        !cafConfig.clientSecret
    ) {
        return false;
    }

    try {
        const resp = await axios.post(
            `${cafConfig.baseUrl}/api/oauth/token`,
            {
                grant_type: "refresh_token",
                client_id: cafConfig.clientId,
                client_secret: cafConfig.clientSecret,
                refresh_token: user.CAFRefreshToken,
            },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 15000,
            },
        );

        const { access_token, refresh_token, expires_in } = resp.data || {};
        if (!access_token) {
            logger.warn(
                `CAF token refresh returned no access_token for ${user.id}`,
            );
            return false;
        }

        user.CAFAccessToken = access_token;
        if (refresh_token) user.CAFRefreshToken = refresh_token;
        user.CAFTokenExpiresAt =
            Date.now() + (Number(expires_in) || 3600) * 1000;

        await dbService.updateUser(user);

        await logUserEvent(
            user.id,
            "caf_token_refreshed",
            `CAF token 刷新成功`,
            {
                expiresAt: new Date(user.CAFTokenExpiresAt).toISOString(),
                expiresIn: Number(expires_in) || 3600,
            },
        );

        logger.info(
            `CAF token refreshed for ${user.id} (expires: ${new Date(user.CAFTokenExpiresAt).toISOString()})`,
        );
        return true;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const axiosErr =
            error && typeof error === "object" ? (error as any) : null;
        const responseStatus = axiosErr?.response?.status;
        const responseData = axiosErr?.response?.data;
        const detail = responseStatus
            ? `HTTP ${responseStatus}: ${JSON.stringify(responseData || message)}`
            : responseData || message;

        await logUserEvent(
            user.id,
            "caf_token_refresh_failed",
            `CAF token 刷新失败`,
            { error: detail },
        );

        logger.error(`CAF token refresh failed for ${user.id}:`, detail);
        return false;
    }
}

export async function ensureCafTokenValid(
    cafConfig: CafConfig,
    user: User,
): Promise<string | null> {
    if (!user.CAFAccessToken) return null;

    const threshold = 5 * 60 * 1000;
    if (
        user.CAFTokenExpiresAt &&
        Date.now() < user.CAFTokenExpiresAt - threshold
    ) {
        return user.CAFAccessToken;
    }

    if (user.CAFRefreshToken) {
        // 使用锁防止并发刷新竞争
        let lock = refreshLocks.get(user.id);
        if (!lock) {
            lock = refreshCafToken(cafConfig, user).finally(() => {
                refreshLocks.delete(user.id);
            });
            refreshLocks.set(user.id, lock);
        }
        const ok = await lock;
        if (ok) return user.CAFAccessToken!;
        // 刷新失败，不再使用旧 token（可能已被 CAF 服务端作废，
        // 继续使用会导致 IMAP/其他服务反复 401）
        logger.warn(
            `CAF token refresh failed for ${user.id}, discarding stale token`,
        );
        return null;
    }

    logger.warn(`CAF token expired and cannot be refreshed for ${user.id}`);
    return null;
}

// ── 欢迎任务 ───────────────────────────────────────────────

export function createDefaultWelcomeTask(): Task {
    return {
        id: uuidv4(),
        name: "测试任务",
        description: "恭喜你成功注册时锚平台~新的任务会推送到这里哦",
        dueDate: toShanghaiISO(),
        startTime: toShanghaiISO(),
        endTime: toShanghaiISO(),
        completed: false,
        pushedToMSTodo: false,
        scheduleType: "single",
    };
}

/** 创建新用户的默认基础字段（不含 id/email/name/passwordHash） */
export function createDefaultUserFields(): Partial<User> {
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
            schoolYear: "Year 1",
        },
    };
}

// ── findOrCreateCafUser ────────────────────────────────────
// 需要外部注入 userCache + 查找函数以避免循环依赖

export interface CafUserLookup {
    userCache: Map<string, User>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserByCafSub(cafSub: string): Promise<User | null>;
}

export async function findOrCreateCafUser(
    lookup: CafUserLookup,
    cafConfig: CafConfig,
    cafSub: string,
    emailHint?: string,
    nameHint?: string,
): Promise<User> {
    const { userCache, findUserByEmail, findUserByCafSub } = lookup;

    if (cafSub) {
        const byCafSub = await findUserByCafSub(cafSub);
        if (byCafSub) {
            if (nameHint && nameHint !== cafSub) {
                byCafSub.name = nameHint;
            }
            if (emailHint) {
                byCafSub.email = emailHint.toLowerCase();
            } else if (
                byCafSub.email.endsWith("@caf.local") ||
                !byCafSub.email.includes("@")
            ) {
                byCafSub.email = `${cafSub}@${cafConfig.emailDomain}`;
            }
            return byCafSub;
        }
    }

    if (emailHint) {
        const byEmail = await findUserByEmail(emailHint.toLowerCase());
        if (byEmail) return byEmail;
    }

    const fallbackEmail = `${cafSub}@${cafConfig.emailDomain}`;
    const email = (emailHint || fallbackEmail).toLowerCase();
    const name = nameHint || "CAF用户";

    const user: User = {
        id: uuidv4(),
        email,
        name,
        passwordHash: undefined,
        ...createDefaultUserFields(),
    } as User;
    await dbService.addUser(user);
    userCache.set(user.id, user);

    // MENU-001：新用户赠送 7 天银锚会员（免费体验期）
    try {
        await dbService.grantMembership(
            user.id,
            "silver",
            7,
            "welcome_gift",
        );
        logger.info(
            `Welcome 7-day Silver Anchor granted to new user: ${user.id}`,
        );
    } catch (e) {
        logger.error("Failed to grant welcome membership:", e);
    }
    return user;
}

// ── handleCafCodeExchange ──────────────────────────────────

export function buildCafAuthorizeUrl(
    cafConfig: CafConfig,
    redirectUri: string,
): string {
    const params = new URLSearchParams({
        client_id: cafConfig.clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile offline_access",
        prompt: "consent",
    });
    return `${cafConfig.baseUrl}/web/oauth/authorize?${params.toString()}`;
}

export function checkCafReady(cafConfig: CafConfig): string | null {
    if (!cafConfig.baseUrl || !cafConfig.clientId) {
        return "CAF auth is not ready on server (subserver registration not completed).";
    }
    return null;
}

export async function handleCafCodeExchange(
    lookup: CafUserLookup,
    cafConfig: CafConfig,
    code: string,
    redirectUri: string,
    signJwt: (payload: object) => string,
    signRefreshJwt?: (payload: object) => string,
): Promise<{
    jwtToken: string;
    refreshToken?: string;
    email: string;
    name: string;
}> {
    if (!cafConfig.baseUrl || !cafConfig.clientId || !cafConfig.clientSecret) {
        throw new Error("CAF auth is not configured on server.");
    }

    const tokenResponse = await axios.post(
        `${cafConfig.baseUrl}/api/oauth/token`,
        {
            grant_type: "authorization_code",
            client_id: cafConfig.clientId,
            client_secret: cafConfig.clientSecret,
            code,
            redirect_uri: redirectUri,
            scope: "openid email profile offline_access",
        },
        { headers: { "Content-Type": "application/json" } },
    );

    const { access_token, refresh_token, expires_in } =
        tokenResponse.data || {};
    if (!access_token) {
        throw new Error("CAF token exchange returned no access_token.");
    }

    const claims = decodeJwtPayload(access_token) || {};
    let cafSub = (
        claims.sub ||
        claims.user_id ||
        claims.uid ||
        claims.id ||
        ""
    ).toString();
    let email = (
        claims.email ||
        claims.preferred_username ||
        claims.upn ||
        ""
    ).toString();
    let name = (claims.name || claims.username || "").toString();

    const userinfo = await fetchCafUserInfo(cafConfig, access_token);
    if (userinfo.email) email = userinfo.email;
    if (userinfo.name) name = userinfo.name;

    if (!cafSub && !email) {
        throw new Error("Unable to identify CAF user from token payload.");
    }

    const stableSub = cafSub || email;
    const user = await findOrCreateCafUser(
        lookup,
        cafConfig,
        stableSub,
        email || undefined,
        name || undefined,
    );

    user.CAFSub = stableSub;
    user.CAFAccessToken = access_token;
    user.CAFRefreshToken = refresh_token || undefined;
    user.CAFTokenExpiresAt = Date.now() + (Number(expires_in) || 3600) * 1000;

    if (name && user.name !== name) {
        user.name = name;
    }

    if (user.email.endsWith(`@${cafConfig.emailDomain}`) && !user.ImapBinded) {
        user.ImapEmail = user.email;
        user.ImapHost = cafConfig.imapHost;
        user.ImapPort = cafConfig.imapPort;
        user.ImapTls = true;
        user.ImapBinded = true;
        logger.info(
            `CAF: auto-bound IMAP/OIDC for ${user.email} (imap: ${cafConfig.imapHost}:${cafConfig.imapPort})`,
        );
    }

    const jwtToken = signJwt({ sub: user.id, email: user.email });
    const refreshToken = signRefreshJwt
        ? signRefreshJwt({ sub: user.id, email: user.email })
        : undefined;
    user.JWTtoken = jwtToken;

    await dbService.updateUser(user);
    lookup.userCache.set(user.id, user);

    return { jwtToken, refreshToken, email: user.email, name: user.name };
}
