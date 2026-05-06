import * as msal from '@azure/msal-node';
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ExchangeClient } from './Services/exchangeClient';
import { ImapClient } from './Services/imapClient';
import { dbService } from './Services/dbService';
import moment from 'moment';
import { initializeApiRoutes } from './routes/apiRoutes';
import { initializeAlgorithmRoutes } from './routes/algorithmRoutes';
import ebridgeRoutes from './routes/ebridgeRoutes';
import { ExchangeConfig, TimetableActivity, ScheduleType } from './Services/types';
import { ScheduleConflictError } from './Services/scheduleConflict';
import { initWebSocket, broadcastTaskChange, broadcastUserLog } from './Services/websocket';
import { logUserEvent } from './Services/userLog';
import { logger } from './Utils/logger.js';
import { toShanghaiISO, getCurrentWeekNumber } from './Utils/time.js';
import { EmailMessageSchema, SearchFilter } from 'ews-javascript-api';
import { startIntervals } from './intervals';
import { initializeMcpRoutes } from './Services/mcp';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { generateKeyPairSync } from 'crypto';

// Load environment variables from server/.env or root .env
dotenv.config({ path: 'server/.env' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 全局错误处理 - 防止服务器崩溃
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // 不退出进程，只记录错误
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // 对于致命错误，优雅关闭
    if (error.message?.includes('EADDRINUSE')) {
        logger.error('Port already in use, exiting...');
        process.exit(1);
    }
    // 其他错误不退出，只记录
});

const app = express();
app.use(cors());

// Exclude MCP messages endpoint from body parsing because SSEServerTransport handles the stream directly
app.use((req, res, next) => {
    if (req.path === '/api/mcp/messages' || req.path === '/ws') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

const PORT = process.env.PORT || 3000;
const isDev = process.env.VITE_DEV_MODE === 'true';
const FRONTEND_URL = isDev ? 'http://localhost:5173' : (process.env.FRONTEND_URL || 'http://localhost:5173');
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

// 将在authenticateToken函数定义后配置API路由
export interface Task {
    id: string;
    name: string;
    description: string;
    dueDate: string; // ISO 8601 格式
    startTime: string; // ISO 8601 格式
    endTime: string; // ISO 8601 格式
    location?: string;
    completed: boolean;
    pushedToMSTodo: boolean; // 是否已推送至 Microsoft Todo
    body?: string; // fit IEvent.body
    attendees?: string[]; // fit IEvent.attendees
    recurrenceRule?: string; // JSON字符串，包含 {freq:'daily'|'weekly', interval?:number, count?:number, until?:ISO}
    parentTaskId?: string; // 若为重复任务生成的子实例，则指向源任务
    importance?: 'high' | 'normal' | 'low';
    isReminderOn?: boolean;
    scheduleType?: ScheduleType;
    estimatedDuration?: number; // 分钟，用于DDL任务
    isFixed?: boolean; // 是否为固定时间任务
}

export interface Profile{
    company: string;
    school :string;
    campus: string;
    schoolYear: string; 
}

export interface User {
    timetableUrl: string;
    timetableFetchLevel: number; // 时间表获取级别，用于控制重新获取频率
    mailReadingSpan: number; // 邮件阅读跨度，控制从收件箱读取的邮件数量，默认为30
    id: string;
    email: string;
    name: string;
    XJTLUaccount?: string;
    XJTLUPassword?: string;
    passwordHash?: string; // only for local accounts
    JWTtoken?: string; // latest issued JWT for user (optional)
    MStoken?: string; // Microsoft access token (optional)
    MSRefreshToken?: string; // Microsoft refresh token
    MSbinded: boolean; // 是否绑定了 Microsoft 账号
    ebridgeBinded: boolean; // 是否绑定了 ebridge 账号
    weekOffset?: number; // 用户自定义周数偏移量，叠加在全局偏移之上
    tasks: Task[]; // 用户绑定的任务列表
    emsClient?: ExchangeClient; // 用于操作 Exchange 的客户端
    conflictBoundaryInclusive?: boolean; // 端点相接是否算冲突（true=算）
    isConflictScheduleAllowed?: boolean; // 是否允许冲突的日程存在
    userProfile?: Profile;
    highEnergyPeriods?: Record<number, { startHour: number; endHour: number; score: number }[]>; // 高精力时段 (Key: 0-6 DayOfWeek)
    ExchangeAccessToken?: string;
    ExchangeRefreshToken?: string;
    ExchangeTokenExpiresAt?: number;
    ExchangeBinded?: boolean;
    SmtpBinded?: boolean;
    SmtpEmail?: string;
    SmtpPassword?: string;
    SmtpHost?: string;
    SmtpPort?: number;
    SmtpTls?: boolean;
    imapClient?: ImapClient;
    CAFSub?: string;
    CAFAccessToken?: string;
    CAFTokenExpiresAt?: number;
}


// 用户池 - 现在使用数据库持久化，内存中保留缓存
let userCache: Map<string, User> = new Map();

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '1h';

function signJwt(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch (e) {
        return null;
    }
}

async function findUserByEmail(email: string) {
    // 先从缓存中查找
    for (const u of userCache.values()) {
        if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }

    // 从数据库中查找
    const user = await dbService.getUserByEmail(email);
    if (user) {
        // 更新缓存
        userCache.set(user.id, user);
    }
    return user;
}

async function pairMsTokenToUser(userId: string, msToken: string, refreshToken?: string) {
    let u = userCache.get(userId);

    if (!u) {
        // 从数据库加载
        u = await dbService.getUserById(userId) || undefined;
        if (!u) return false;
    }

    u.MStoken = msToken;
    if (refreshToken) {
        u.MSRefreshToken = refreshToken;
    }
    u.MSbinded = true; // 标记为已绑定并激活
    // 新的 token 到来，标记为已绑定

    // 更新数据库和缓存
    await dbService.updateUser(u);
    userCache.set(userId, u);
    return true;
}

// Microsoft configuration loaded from environment variables
const config = {
    auth: {
        clientId: process.env.MS_CLIENT_ID || "",
        authority: process.env.MS_AUTHORITY || "https://login.microsoftonline.com/common",
        clientSecret: process.env.MS_CLIENT_SECRET
    }
};

// 验证必需的配置项
if (!config.auth.clientSecret) {
    logger.error('错误: MS_CLIENT_SECRET 环境变量未设置!');
    process.exit(1);
}

if (!config.auth.clientId) {
    logger.error('错误: MS_CLIENT_ID 环境变量未设置!');
    process.exit(1);
}

logger.info('Microsoft configuration loaded from environment variables');

// 身份验证中间件
async function authenticateToken(req: any, res: any, next: any) {
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // 如果Header中没有token，尝试从query参数获取 (用于SSE等不支持Header的场景)
    if (!token && req.query.token) {
        token = req.query.token;
    }

    if (!token) return res.status(401).json({ error: 'Access token required' });

    const decoded = verifyJwt(token);
    if (!decoded) return res.status(403).json({ error: 'Invalid or expired token' });

    // 先从缓存获取
    let user = userCache.get(decoded.sub);

    // 缓存未命中，从数据库加载
    if (!user) {
        user = await dbService.getUserById(decoded.sub) || undefined;
        if (user) {
            userCache.set(user.id, user);
        }
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user;
    next();
}


// Exchange/XJTLU OAuth Config
const defaultAuthority = process.env.MS_AUTHORITY || "https://login.microsoftonline.com/common";
// Ensure authority does not have trailing slash
const authority = defaultAuthority.endsWith('/') ? defaultAuthority.slice(0, -1) : defaultAuthority;

const exchangeOAuthConfig = {
    // 优先使用专门的 Exchange Client ID，如果没有设置则回退到 MS_CLIENT_ID (不推荐，但保持兼容性)
    clientId: process.env.EXCHANGE_CLIENT_ID || process.env.MS_CLIENT_ID || "",
    clientSecret: process.env.EXCHANGE_CLIENT_SECRET || process.env.MS_CLIENT_SECRET || "",
    authUrl: process.env.EXCHANGE_AUTH_URL || `${authority}/oauth2/v2.0/authorize`, 
    tokenUrl: process.env.EXCHANGE_TOKEN_URL || `${authority}/oauth2/v2.0/token`,
    redirectUri: process.env.EXCHANGE_REDIRECT_URI || `${BACKEND_URL}/auth/exchange/callback`,
    // 默认改为 Microsoft Graph 最小 Delegated 权限（邮件/日历只读）
    // 可通过 EXCHANGE_SCOPE 覆盖
    scope: process.env.EXCHANGE_SCOPE || "offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read"
};

const cafBaseUrlRaw = process.env.CAF_SERVER_BASE_URL || '';
const cafBaseUrl = cafBaseUrlRaw.endsWith('/') ? cafBaseUrlRaw.slice(0, -1) : cafBaseUrlRaw;
const cafConfig = {
    baseUrl: cafBaseUrl,
    clientId: '',
    clientSecret: '',
    redirectUri: process.env.CAF_REDIRECT_URI || `${BACKEND_URL}/auth/caf/callback`,
    subServerName: process.env.CAF_SUBSERVER_NAME || 'AI Time Manager'
};

const cafCredsFile = process.env.CAF_CREDENTIALS_FILE || path.join(process.cwd(), 'server', '.caf-client.json');
const cafPublicKeyFile = process.env.CAF_PUBLIC_KEY_FILE || path.join(process.cwd(), 'server', '.caf-public.pem');
const cafPrivateKeyFile = process.env.CAF_PRIVATE_KEY_FILE || path.join(process.cwd(), 'server', '.caf-private.pem');

async function ensureCafKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
        const [publicKey, privateKey] = await Promise.all([
            fs.readFile(cafPublicKeyFile, 'utf8'),
            fs.readFile(cafPrivateKeyFile, 'utf8')
        ]);
        return { publicKey, privateKey };
    } catch {
        const pair = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        await fs.mkdir(path.dirname(cafPublicKeyFile), { recursive: true });
        await Promise.all([
            fs.writeFile(cafPublicKeyFile, pair.publicKey, 'utf8'),
            fs.writeFile(cafPrivateKeyFile, pair.privateKey, { encoding: 'utf8', mode: 0o600 })
        ]);

        logger.info('Generated CAF RSA key pair for subserver registration.');
        return { publicKey: pair.publicKey, privateKey: pair.privateKey };
    }
}

async function loadCafCredentials(): Promise<{ id: string; secret: string } | null> {
    try {
        const raw = await fs.readFile(cafCredsFile, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed?.id && parsed?.secret) {
            return { id: String(parsed.id), secret: String(parsed.secret) };
        }
    } catch {
        // Ignore missing/invalid file and fall back to auto registration.
    }
    return null;
}

async function saveCafCredentials(credentials: { id: string; secret: string }) {
    await fs.mkdir(path.dirname(cafCredsFile), { recursive: true });
    await fs.writeFile(cafCredsFile, JSON.stringify(credentials, null, 2), 'utf8');
}

async function ensureCafClientCredentials() {
    if (!cafConfig.baseUrl) {
        logger.warn('CAF_SERVER_BASE_URL is empty, CAF login is disabled.');
        return;
    }

    const persisted = await loadCafCredentials();
    if (persisted) {
        cafConfig.clientId = persisted.id;
        cafConfig.clientSecret = persisted.secret;
        logger.info('Loaded CAF subserver credentials from persisted file.');
        return;
    }

    const { publicKey } = await ensureCafKeyPair();
    const registerResp = await axios.post(
        `${cafConfig.baseUrl}/api/subserver/register`,
        {
            name: cafConfig.subServerName,
            public_key: publicKey
        },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );

    const id = registerResp.data?.id;
    const secret = registerResp.data?.secret;
    if (!id || !secret) {
        throw new Error('CAF register response missing id/secret');
    }

    cafConfig.clientId = String(id);
    cafConfig.clientSecret = String(secret);
    await saveCafCredentials({ id: cafConfig.clientId, secret: cafConfig.clientSecret });
    logger.info('CAF subserver auto-registration completed and credentials persisted.');
}

function decodeJwtPayload(token: string): Record<string, any> | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const json = Buffer.from(normalized, 'base64').toString('utf8');
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function createDefaultWelcomeTask(): Task {
    return {
        id: uuidv4(),
        name: '测试任务',
        description: '恭喜你成功注册时锚平台~新的任务会推送到这里哦',
        dueDate: toShanghaiISO(),
        startTime: toShanghaiISO(),
        endTime: toShanghaiISO(),
        completed: false,
        pushedToMSTodo: false,
        scheduleType: 'single'
    };
}

async function findOrCreateCafUser(cafSub: string, emailHint?: string, nameHint?: string) {
    const fallbackEmail = `caf_${cafSub}@caf.local`;
    const email = (emailHint || fallbackEmail).toLowerCase();
    let user = await findUserByEmail(email);
    if (user) {
        return user;
    }

    const id = uuidv4();
    user = {
        id,
        email,
        name: nameHint || email.split('@')[0] || 'CAF用户',
        passwordHash: undefined,
        MSbinded: false,
        ExchangeBinded: false,
        SmtpBinded: false,
        ebridgeBinded: false,
        timetableUrl: '',
        timetableFetchLevel: 0,
        mailReadingSpan: Number(process.env.EMAIL_READ_LIMIT) || 30,
        conflictBoundaryInclusive: false,
        isConflictScheduleAllowed: true,
        tasks: [createDefaultWelcomeTask()],
        userProfile: {
            company: '',
            school: "Xi'an Jiaotong-Liverpool University",
            campus: 'SIP',
            schoolYear: 'Year 1'
        }
    };
    await dbService.addUser(user);
    userCache.set(id, user);
    return user;
}

// 注册新用户时，不再默认绑定ebridge/Exchange
app.post('/register', async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return res.status(400).json({ error: 'email, password and name required' });

    try {
        // 检查用户是否已存在
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(409).json({ error: 'user already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const id = uuidv4();
        const user: User = {
            id,
            email,
            name,
            passwordHash: bcrypt.hashSync(password, process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10),
            MSbinded: false,
            ExchangeBinded: false,
            ebridgeBinded: false,
            timetableUrl: '',
            timetableFetchLevel: 0,
            mailReadingSpan: Number(process.env.EMAIL_READ_LIMIT) || 30,
            conflictBoundaryInclusive: false,
            isConflictScheduleAllowed: true,
            tasks: [{
                id: uuidv4(),
                name: '测试任务',
                description: '恭喜你成功注册时锚平台~新的任务会推送到这里哦',
                dueDate: toShanghaiISO(),
                startTime: toShanghaiISO(),
                endTime: toShanghaiISO(),
                completed: false,
                pushedToMSTodo: false,
                scheduleType: 'single',
            }],
            userProfile: {
                company: '',
                school: "Xi'an Jiaotong-Liverpool University",
                campus: 'SIP',
                schoolYear: 'Year 1'
            }
        };

        const token = signJwt({ sub: id, email });
        user.JWTtoken = token;

        // 保存到数据库
        await dbService.addUser(user);
        // 更新缓存
        userCache.set(id, user);

        return res.status(201).json({ token });
    } catch (error) {
        logger.error('Registration error:', error);
        return res.status(500).json({ error: 'Failed to register user' });
    }
});

app.get('/auth/exchange', (req, res) => {
    if (!exchangeOAuthConfig.clientId || !exchangeOAuthConfig.authUrl) {
         return res.status(500).send('Exchange Auth not configured on server.');
    }

    // Generate state with JWT and login_hint if provided
    const providedJwt = (req.query.jwt as string) || (() => {
        const auth = (req.headers.authorization || '') as string;
        if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
        return undefined;
    })();
    const loginHint = req.query.login_hint as string;

    let stateObj: any = {};
    if (providedJwt) stateObj.jwt = providedJwt;
    if (loginHint) stateObj.email = loginHint;
    
    // 如果没有 jwt 也没有 loginHint，state 为 undefined
    const state = Object.keys(stateObj).length > 0 ? Buffer.from(JSON.stringify(stateObj)).toString('base64') : undefined;

    const params = new URLSearchParams({
        client_id: exchangeOAuthConfig.clientId,
        redirect_uri: exchangeOAuthConfig.redirectUri,
        response_type: 'code',
        scope: exchangeOAuthConfig.scope,
        prompt: 'login', // 强制重新登录
    });

    // 强制指定组织账户 (School/Work)，避免个人账户混淆
    params.append('domain_hint', 'organizations');

    // Add state properly encoded
    if (state) {
        params.append('state', state); 
    }

    // Add login_hint if provided (for XJTLU account)
    if (loginHint) {
        params.append('login_hint', loginHint);
    }

    res.redirect(`${exchangeOAuthConfig.authUrl}?${params.toString()}`);
});

app.get('/auth/exchange/callback', async (req, res) => {
    const code = req.query.code as string;
    const error = req.query.error as string;
    const errorDescription = req.query.error_description as string;
    const state = req.query.state as string; // Will contain JWT directly if set above logic

    if (error) {
         logger.error('Exchange Auth error callback:', error, errorDescription);
         if (error.includes('invalid_scope')) {
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
                    h1 { color: #d32f2f; margin-bottom: 20px; }
                    .card { background: #f8f9fa; border: 1px solid #ddd; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                    p { margin-bottom: 1em; }
                    code { background: #e9ecef; padding: 2px 5px; border-radius: 4px; font-family: Consolas, monospace; }
                    ol { padding-left: 20px; }
                    li { margin-bottom: 10px; }
                    strong { color: #C00; }
                </style>
            </head>
            <body>
                <h1>授权失败：权限范围 (Scope) 错误</h1>
                <div class="card">
                    <p>Azure 拒绝了您的请求，因为应用没有正确配置 <strong>Microsoft Graph Delegated</strong> 权限。</p>
                    <p>当前默认 Scope 为：<code>offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read</code></p>
                    <p>但您的 Azure 应用注册中可能缺失了对应的 API 声明，请严格按照以下步骤检查：</p>
                    <hr>
                    
                    <h3>核心排查点：应用注册类型 (Supported Account Types)</h3>
                    <p><strong>这是最可能的原因：</strong> 您可能正在尝试使用一个仅支持"个人账户"的应用 ID 来请求"企业/学校"的 Graph 权限。</p>
                    <ul>
                        <li><strong>现象：</strong> 学校邮箱可在 Outlook 客户端登录，但自注册应用登录时提示需要管理员授权或 scope 无效。</li>
                        <li><strong>原因：</strong> 仅限个人 (Personal) 的应用注册无法稳定用于学校/组织租户的 Graph 企业资源访问。</li>
                        <li><strong>解决方案：</strong>
                            <ol>
                                <li><strong>创建新应用注册：</strong> 在 Azure Portal 注册一个全新的 App。</li>
                                <li><strong>选择类型：</strong> 必须选择 <strong>"Accounts in any organizational directory (Any Azure AD directory - Multitenant)"</strong> (任何组织目录中的账户)。</li>
                                <li><strong>迁移配置：</strong> 在新应用中添加 API 权限 (Microsoft Graph Delegated) 和 Redirect URI。</li>
                                <li><strong>更新环境变量：</strong> 获取新的 Client ID 和 Secret，分别填入 <code>.env</code> 文件中的 <code>EXCHANGE_CLIENT_ID</code> 和 <code>EXCHANGE_CLIENT_SECRET</code> 字段 (不要覆盖 MS_CLIENT_ID)。</li>
                            </ol>
                        </li>
                    </ul>

                    <hr>
                    <h3>备选检查步骤</h3>
                    <ol>
                        <li><strong>API 权限确认：</strong> 确保已添加 <strong>"Microsoft Graph"</strong> -> <strong>"Mail.Read"</strong>、<strong>"Calendars.Read"</strong>（Delegated）。</li>
                        <li><strong>租户用户同意策略：</strong> 让管理员在 Entra ID 中允许用户同意低风险应用权限，或至少允许上述权限由普通用户同意。</li>
                        <li><strong>管理员同意（兜底）：</strong> 若租户策略不允许用户同意，仍需管理员点击 <strong>"Grant admin consent"</strong>。</li>
                    </ol>
                    <p><small style="color: #666;">错误代码: ${error} - ${errorDescription}</small></p>
                </div>
            </body>
            </html>
            `;
            return res.status(400).send(html);
         }
         return res.status(400).send(`Auth failed: ${error} - ${errorDescription}`);
    }
    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        const bodyParams = new URLSearchParams();
        bodyParams.append('client_id', exchangeOAuthConfig.clientId);
        bodyParams.append('client_secret', exchangeOAuthConfig.clientSecret);
        bodyParams.append('grant_type', 'authorization_code');
        bodyParams.append('code', code);
        bodyParams.append('redirect_uri', exchangeOAuthConfig.redirectUri);
        bodyParams.append('scope', exchangeOAuthConfig.scope);

        const tokenResponse = await axios.post(exchangeOAuthConfig.tokenUrl, bodyParams, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        const expiresAt = Date.now() + ((expires_in || 3600) * 1000);

        // Verify state (JWT) to bind to user
        let providedJwt: string | undefined;
        let loginHintEmail: string | undefined;

        try {
            if (state) {
                const decodedState = Buffer.from(state, 'base64').toString('utf-8');
                try {
                    const stateObj = JSON.parse(decodedState);
                    providedJwt = stateObj.jwt;
                    loginHintEmail = stateObj.email;
                } catch (e) {
                    // 如果解析 JSON 失败，可能 state 本身就是 JWT (兼容旧逻辑)
                    providedJwt = decodedState;
                }
            }
        } catch (e) {
            logger.warn('Error parsing Exchange auth state:', e);
        }
        
        if (providedJwt) {
            const decoded = verifyJwt(providedJwt);
            if (decoded && decoded.sub) {
                const userId = decoded.sub as string;
                let user = await dbService.getUserById(userId) || undefined; // Force db fetch to be safe

                if (user) {
                    user.ExchangeAccessToken = access_token;
                    user.ExchangeRefreshToken = refresh_token;
                    user.ExchangeTokenExpiresAt = expiresAt;
                    user.ExchangeBinded = true;
                    if (loginHintEmail) {
                        user.XJTLUaccount = loginHintEmail;
                    }

                    // 尝试根据 Access Token 获取用户邮箱（作为双重确认或如果没有 login_hint）
                    // try {
                    //      // TODO: Call Graph API /me or similar if token scope allows
                    // } catch (e) { logger.warn('Failed to fetch user email from Exchange token'); }
                    
                    await dbService.updateUser(user);
                    userCache.set(userId, user); // Update cache
                    
                    logger.info(`Bound Exchange OAuth to user ${userId}`);
                    res.send('<h1>Exchange 绑定成功!</h1><p>您可以关闭此窗口并刷新主应用。</p><script>window.opener?.postMessage({type: "EXCHANGE_BOUND"}, "*"); setTimeout(() => window.close(), 3000);</script>');
                    return;
                }
            }
        }
        
        res.status(400).send('Failed to bind to user session. Please try again from the settings page.');

    } catch (err: any) {
        logger.error('Exchange Token Exchange failed:', err.response?.data || err.message);
        res.status(500).send(`Token exchange failed: ${JSON.stringify(err.response?.data || err.message)}`);
    }
});

// SMTP bind/unbind routes added after Exchange callback
app.post('/auth/smtp/bind', authenticateToken, async (req: any, res: any) => {
    const user = req.user as User;
    const { smtpEmail, smtpPassword, smtpHost, smtpPort, smtpTls } = req.body || {};
    if (!smtpEmail || !smtpPassword || !smtpHost || !smtpPort) {
        return res.status(400).json({ error: 'Missing required SMTP configuration fields' });
    }
    user.SmtpEmail = smtpEmail;
    user.SmtpPassword = smtpPassword;
    user.SmtpHost = smtpHost;
    user.SmtpPort = Number(smtpPort);
    user.SmtpTls = Boolean(smtpTls);
    user.SmtpBinded = true;
    await dbService.updateUser(user);
    userCache.set(user.id, user);
    res.json({ success: true, message: 'SMTP bound successfully' });
});

app.post('/auth/smtp/unbind', authenticateToken, async (req: any, res: any) => {
    const user = req.user as User;
    user.SmtpEmail = undefined;
    user.SmtpPassword = undefined;
    user.SmtpHost = undefined;
    user.SmtpPort = undefined;
    user.SmtpTls = undefined;
    user.SmtpBinded = false;
    await dbService.updateUser(user);
    userCache.set(user.id, user);
    res.json({ success: true, message: 'SMTP unbound successfully' });
});

app.get('/auth/caf', (req, res) => {
    if (!cafConfig.baseUrl || !cafConfig.clientId) {
        return res.status(500).send('CAF auth is not ready on server (subserver registration not completed).');
    }

    const params = new URLSearchParams({
        client_id: cafConfig.clientId,
        redirect_uri: cafConfig.redirectUri,
    });

    res.redirect(`${cafConfig.baseUrl}/web/oauth/authorize?${params.toString()}`);
});

app.get('/auth/caf/callback', async (req, res) => {
    const code = req.query.code as string;
    if (!code) {
        return res.status(400).send('No authorization code provided by CAF.');
    }
    if (!cafConfig.baseUrl || !cafConfig.clientId || !cafConfig.clientSecret) {
        return res.status(500).send('CAF auth is not configured on server.');
    }

    try {
        const tokenResponse = await axios.post(
            `${cafConfig.baseUrl}/api/oauth/token`,
            {
                grant_type: 'authorization_code',
                client_id: cafConfig.clientId,
                client_secret: cafConfig.clientSecret,
                code,
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const { access_token, expires_in } = tokenResponse.data || {};
        if (!access_token) {
            return res.status(500).send('CAF token exchange returned no access_token.');
        }

        const claims = decodeJwtPayload(access_token) || {};
        const cafSub = (claims.sub || claims.user_id || claims.uid || claims.id || '').toString();
        const email = (claims.email || claims.preferred_username || claims.upn || '').toString();
        const name = (claims.name || claims.username || '').toString();

        if (!cafSub && !email) {
            return res.status(500).send('Unable to identify CAF user from token payload.');
        }

        const stableSub = cafSub || email;
        const user = await findOrCreateCafUser(stableSub, email || undefined, name || undefined);

        user.CAFSub = stableSub;
        user.CAFAccessToken = access_token;
        user.CAFTokenExpiresAt = Date.now() + ((Number(expires_in) || 3600) * 1000);

        const jwtToken = signJwt({ sub: user.id, email: user.email });
        user.JWTtoken = jwtToken;

        await dbService.updateUser(user);
        userCache.set(user.id, user);

        const target = `${FRONTEND_URL}/login?token=${encodeURIComponent(jwtToken)}&from=caf`;
        return res.redirect(target);
    } catch (error: any) {
        logger.error('CAF OAuth callback failed:', error.response?.data || error.message);
        const msg = encodeURIComponent('CAF 登录失败，请稍后重试');
        return res.redirect(`${FRONTEND_URL}/login?caf_error=${msg}`);
    }
});

// Configure API Routes
const apiRouter = initializeApiRoutes(authenticateToken);
app.use('/api', apiRouter);

// 配置算法路由
const algorithmRouter = initializeAlgorithmRoutes(authenticateToken);
app.use('/api/algorithms', algorithmRouter);

// Ebridge 代理路由
app.use('/api/ebridge', ebridgeRoutes);

// Ebridge 保存课表 URL
app.post('/api/ebridge/save-url', authenticateToken, async (req: any, res: any) => {
    const user = req.user as User;
    const { timetableUrl } = req.body || {};
    if (!timetableUrl || typeof timetableUrl !== 'string' || !timetableUrl.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid timetable URL' });
    }
    user.timetableUrl = timetableUrl;
    user.ebridgeBinded = true;
    await dbService.updateUser(user);
    userCache.set(user.id, user);
    res.json({ success: true });
});

// Initialize MCP Routes
initializeMcpRoutes(app, authenticateToken);

const pca = new msal.ConfidentialClientApplication(config);

// 注册端点：创建本地用户并发放 JWT
app.post('/register', async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return res.status(400).json({ error: 'email, password and name required' });

    try {
        // 检查用户是否已存在
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(409).json({ error: 'user already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const id = uuidv4();
        const user: User = {
            id,
            email,
            name,
            passwordHash: bcrypt.hashSync(password, process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10),
            MSbinded: false,
            // 默认设置为非绑定
            ExchangeBinded: false,
            SmtpBinded: false,
            ebridgeBinded: false,
            timetableUrl: '',
            timetableFetchLevel: 0,
            mailReadingSpan: Number(process.env.EMAIL_READ_LIMIT) || 30,
            conflictBoundaryInclusive: false,
            isConflictScheduleAllowed: true,
            tasks: [{
                id: uuidv4(),
                name: '测试任务',
                description: '恭喜你成功注册时锚平台~新的任务会推送到这里哦',
                dueDate: toShanghaiISO(),
                startTime: toShanghaiISO(),
                endTime: toShanghaiISO(),
                completed: false,
                pushedToMSTodo: false,
                scheduleType: 'single',
            }],
            userProfile: {
                company: '',
                school: "Xi'an Jiaotong-Liverpool University",
                campus: 'SIP',
                schoolYear: 'Year 1'
            }
        };

        const token = signJwt({ sub: id, email });
        user.JWTtoken = token;

        // 保存到数据库
        await dbService.addUser(user);
        // 更新缓存
        userCache.set(id, user);

        return res.status(201).json({ token });
    } catch (error) {
        logger.error('Registration error:', error);
        return res.status(500).json({ error: 'Failed to register user' });
    }
});


// 登录端点：验证凭据并返回 JWT
app.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    try {
        const user = await findUserByEmail(email);
        if (!user || !user.passwordHash) return res.status(401).json({ error: 'invalid credentials' });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: 'invalid credentials' });

        const token = signJwt({ sub: user.id, email: user.email });
        user.JWTtoken = token;

        // 更新数据库和缓存
        await dbService.updateUser(user);
        userCache.set(user.id, user);

        return res.json({ token });
    } catch (error) {
        logger.error('Login error:', error);
        return res.status(500).json({ error: 'Failed to login' });
    }
});

// 生成授权URL
app.get('/auth', (req, res) => {
    // 如果请求中包含我们的 JWT（query.jwt 或 Authorization header），将其作为 state 传给微软并在回调时还原
    const providedJwt = (req.query.jwt as string) || (() => {
        const auth = (req.headers.authorization || '') as string;
        if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
        return undefined;
    })();

    const state = providedJwt ? Buffer.from(providedJwt).toString('base64') : undefined;

    const authCodeUrlParameters: any = {
        scopes: ["https://graph.microsoft.com/Tasks.ReadWrite"],
        redirectUri: "https://schedule.apoints.cn/redirect",
    };
    if (state) authCodeUrlParameters.state = state;

    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    }).catch((error) => {
        logger.error('Error generating auth URL:', error);
        res.status(500).send('Error generating auth URL');
    });
});

// 处理重定向并获取令牌
app.get('/redirect', async (req, res) => {
    const tokenRequest = {
        code: req.query.code as string,
        scopes: ["https://graph.microsoft.com/Tasks.ReadWrite"],
        redirectUri: `${FRONTEND_URL}/redirect`,
    };

    try {
        const response = await pca.acquireTokenByCode(tokenRequest);
        logger.info("Access token acquired:", response.accessToken);

        // 先尝试从 state 中还原我们的 JWT（如果有的话），然后把 MS 令牌配对到全局用户池
        let providedJwt: string | undefined;
        if (req.query.state) {
            try {
                providedJwt = Buffer.from(req.query.state as string, 'base64').toString('utf8');
            } catch (e) {
                logger.warn('Invalid state encoding');
            }
        }
        // 也支持通过 query.jwt 或 Authorization header 直接传递
        if (!providedJwt && req.query.jwt) providedJwt = req.query.jwt as string;
        if (!providedJwt) {
            const auth = (req.headers.authorization || '') as string;
            if (auth.toLowerCase().startsWith('bearer ')) providedJwt = auth.slice(7).trim();
        }

        if (providedJwt) {
            const decoded = verifyJwt(providedJwt);
            if (decoded && decoded.sub) {
                const userId = decoded.sub as string;
                const paired = await pairMsTokenToUser(userId, response.accessToken || '');
                if (paired) {
                    logger.info(`Paired MS token to user ${userId}`);
                    res.send('Authentication successful and MS token paired to your account.');
                    return;
                } else {
                    logger.warn('User not found for JWT sub:', decoded.sub);
                }
            } else {
                logger.warn('Invalid JWT provided in redirect state');
            }
        }

        // 如果没有提供 JWT 或配对失败，仅返回成功提示（或提供指示下一步的页面）
        res.send('身份认证成功！您已经成功绑定微软To Do。将重新跳转回主页');
        //将用户重定向到主页面
        res.redirect(FRONTEND_URL);
    } catch (error) {
        logger.error('Token acquisition error:', error);
        res.status(500).send('Authentication failed');
    }
});

// API路由已移至专用模块

// Serve static files
app.use(express.static(path.join(__dirname, '../../dist')));

app.get('*', (req, res) => {
    // Don't intercept API requests
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    const indexPath = path.join(__dirname, '../../dist/index.html');
    // Check if file exists to avoid crashing if dist is missing
    res.sendFile(indexPath, (err) => {
        if (err) {
            if (!res.headersSent) {
                res.status(404).send('Frontend not built or not found.');
            }
        }
    });
});

// 初始化数据库并启动服务器
async function startServer() {
    try {
        // 初始化数据库
        await dbService.initialize();

        // 设置日志监听器
        dbService.setLogListener(broadcastUserLog);

        // 从数据库加载所有用户到缓存
        const users = await dbService.getAllUsers();
        users.forEach(user => {
            userCache.set(user.id, user);
        });

        logger.info(`Loaded ${users.length} users from database`);

        try {
            await ensureCafClientCredentials();
        } catch (cafError: any) {
            logger.error('CAF auto-registration failed:', cafError?.response?.data || cafError?.message || cafError);
        }

        // 启动服务器并初始化 WebSocket
        const server = app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
            logger.info(`Visit http://localhost:${PORT}/auth to start authentication`);
        });
        initWebSocket(server, () => userCache.values());
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// 启动后台定时任务（抽离至 intervals.ts）
startIntervals(() => userCache.values());

export async function createTaskToUser(user: User, taskData: Task): Promise<void> {
    // 实现创建任务的逻辑
    try {
        await dbService.addTask(user.id, taskData, !!user.conflictBoundaryInclusive, user.isConflictScheduleAllowed);
        await dbService.refreshUserTasksIncremental(user, { addedIds: [taskData.id] });
        await logUserEvent(user.id, 'taskCreated', `Created task ${taskData.name} via helper`, { id: taskData.id });
        logger.success(`Task created successfully for user ${user.id}: ${taskData.name}`);
    } catch (error) {
        logger.error(`Failed to create task for user ${user.id}:`, error);
        throw error;
    }
}
