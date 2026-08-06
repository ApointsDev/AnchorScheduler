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
import { dbService } from "./Services/dbService";
import { initializeApiRoutes } from "./routes/apiRoutes";
import { initializeAlgorithmRoutes } from "./routes/algorithmRoutes";
import { initializeDoubaoRoutes } from "./routes/doubaoRoutes";
import { initializeSpeechRoutes } from "./routes/speechRoutes";
import ebridgeRoutes from "./routes/ebridgeRoutes";
import { initWebSocket, broadcastUserLog } from "./Services/websocket";
import { logUserEvent } from "./Services/userLog";
import { logger } from "./Utils/logger.js";
import { startIntervals } from "./intervals";
import { initializeMcpRoutes } from "./Services/mcp";
import { initializeCalDavServer } from "./routes/caldavServerRoutes.js";
import { createAdminRouter } from "./routes/adminRoutes.js";
import { initializeTodoRoutes } from "./routes/todoRoutes.js";
import { initializeUserStatusRoutes } from "./routes/userStatusRoutes.js";
import { initializeCommunityRoutes } from "./routes/communityRoutes.js";
import { initializeUserProfileRoutes } from "./routes/userProfileRoutes.js";
import { initializeFollowRoutes } from "./routes/followRoutes.js";
import { initializeRejectionBufferRoutes } from "./routes/rejectionBufferRoutes.js";
import { initializeChaoxingRoutes } from "./routes/chaoxingRoutes";
import { initializeReminderStateRoutes } from "./routes/reminderStateRoutes";
import { initializeArchiveRoutes } from "./routes/archiveRoutes.js";
import { initializeMembershipRoutes } from "./routes/membershipRoutes.js";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createAuthRoutes } from "./routes/authRoutes";
import {
    createCafConfig,
    ensureCafClientCredentials,
} from "./Services/cafAuth";
import type {
    User,
    Task,
    Profile,
    Todo,
    Tag,
    Schedule,
    UserStatus,
    CommunityRegion,
    CommunityRankingResult,
} from "./types/models";

// 重新导出，保持向后兼容
export type {
    User,
    Task,
    Profile,
    Todo,
    Tag,
    Schedule,
    UserStatus,
    CommunityRegion,
    CommunityRankingResult,
};

// Load environment variables
dotenv.config({ path: "server/.env" });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 全局错误处理
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    if (error.message?.includes("EADDRINUSE")) {
        logger.error("Port already in use, exiting...");
        process.exit(1);
    }
});

// ── Express 初始化 ─────────────────────────────────────────

const app = express();
app.use(cors());
app.use((req, res, next) => {
    if (req.path === "/api/mcp/messages" || req.path === "/ws") {
        next();
    } else {
        express.json()(req, res, next);
    }
});

const PORT = process.env.PORT || 3000;
const isDev = process.env.VITE_DEV_MODE === "true";
const FRONTEND_URL = isDev
    ? "http://localhost:5173"
    : process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

// ── 用户缓存 ───────────────────────────────────────────────

const userCache: Map<string, User> = new Map();

// ── JWT ────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_EXPIRES_IN = "1h";
// 刷新令牌有效期（滑动续期，避免用户活跃使用时每 1 小时被强制下线）
const JWT_REFRESH_EXPIRES_IN = "30d";

function signJwt(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** 签发刷新令牌（带 type: "refresh" 标记，供 /api/auth/refresh 换发新令牌） */
function signRefreshJwt(payload: object) {
    return jwt.sign({ ...payload, type: "refresh" }, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
}

function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch {
        return null;
    }
}

// ── 用户查找 ───────────────────────────────────────────────

async function findUserByEmail(email: string) {
    for (const u of userCache.values()) {
        if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    const user = await dbService.getUserByEmail(email);
    if (user) userCache.set(user.id, user);
    return user;
}

async function findUserByCafSub(cafSub: string) {
    for (const u of userCache.values()) {
        if (u.CAFSub === cafSub) return u;
    }
    const user = await dbService.getUserByCafSub(cafSub);
    if (user) userCache.set(user.id, user);
    return user;
}

async function pairMsTokenToUser(
    userId: string,
    msToken: string,
    refreshToken?: string,
) {
    let u = userCache.get(userId);
    if (!u) {
        u = (await dbService.getUserById(userId)) || undefined;
        if (!u) return false;
    }
    u.MStoken = msToken;
    if (refreshToken) u.MSRefreshToken = refreshToken;
    u.MSbinded = true;
    await dbService.updateUser(u);
    userCache.set(userId, u);
    return true;
}

// ── 身份验证中间件 ─────────────────────────────────────────

async function authenticateToken(req: any, res: any, next: any) {
    let token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token && req.query.token) token = req.query.token;
    if (!token) return res.status(401).json({ error: "Access token required" });

    const decoded = verifyJwt(token);
    if (!decoded)
        return res.status(403).json({ error: "Invalid or expired token" });

    let user = userCache.get(decoded.sub);
    if (!user) {
        user = (await dbService.getUserById(decoded.sub)) || undefined;
        if (user) userCache.set(user.id, user);
    }
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
}

// ── Microsoft 配置 ─────────────────────────────────────────

const config = {
    auth: {
        clientId: process.env.MS_CLIENT_ID || "",
        authority:
            process.env.MS_AUTHORITY ||
            "https://login.microsoftonline.com/common",
        clientSecret: process.env.MS_CLIENT_SECRET,
    },
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

const defaultAuthority =
    process.env.MS_AUTHORITY || "https://login.microsoftonline.com/common";
const authority = defaultAuthority.endsWith("/")
    ? defaultAuthority.slice(0, -1)
    : defaultAuthority;

const exchangeOAuthConfig = {
    clientId: process.env.EXCHANGE_CLIENT_ID || process.env.MS_CLIENT_ID || "",
    clientSecret:
        process.env.EXCHANGE_CLIENT_SECRET ||
        process.env.MS_CLIENT_SECRET ||
        "",
    authUrl:
        process.env.EXCHANGE_AUTH_URL || `${authority}/oauth2/v2.0/authorize`,
    tokenUrl:
        process.env.EXCHANGE_TOKEN_URL || `${authority}/oauth2/v2.0/token`,
    redirectUri:
        process.env.EXCHANGE_REDIRECT_URI ||
        `${BACKEND_URL}/auth/exchange/callback`,
    scope:
        process.env.EXCHANGE_SCOPE ||
        "offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read",
};

// ── CAF 配置 ───────────────────────────────────────────────

const cafConfig = createCafConfig(BACKEND_URL);

// ── MSAL ───────────────────────────────────────────────────

const pca = new msal.ConfidentialClientApplication(config);

// ── MS Todo 路由 ──────────────────────────────────────────

app.get("/auth", (req, res) => {
    const providedJwt =
        (req.query.jwt as string) ||
        (() => {
            const auth = (req.headers.authorization || "") as string;
            if (auth.toLowerCase().startsWith("bearer "))
                return auth.slice(7).trim();
            return undefined;
        })();

    const state = providedJwt
        ? Buffer.from(providedJwt).toString("base64")
        : undefined;

    const authCodeUrlParameters: any = {
        scopes: ["https://graph.microsoft.com/Tasks.ReadWrite"],
        redirectUri: "https://schedule.apoints.cn/redirect",
    };
    if (state) authCodeUrlParameters.state = state;

    pca.getAuthCodeUrl(authCodeUrlParameters)
        .then((response) => res.redirect(response))
        .catch((error) => {
            logger.error("Error generating auth URL:", error);
            res.status(500).send("Error generating auth URL");
        });
});

app.get("/redirect", async (req, res) => {
    logger.info(
        "MS redirect received, code:",
        !!req.query.code,
        "state:",
        !!req.query.state,
        "jwt:",
        !!req.query.jwt,
    );

    const tokenRequest = {
        code: req.query.code as string,
        scopes: ["https://graph.microsoft.com/Tasks.ReadWrite"],
        redirectUri: `${FRONTEND_URL}/redirect`,
    };

    try {
        const response = await pca.acquireTokenByCode(tokenRequest);
        logger.info("Access token acquired:", response.accessToken);

        let providedJwt: string | undefined;
        if (req.query.state) {
            try {
                providedJwt = Buffer.from(
                    req.query.state as string,
                    "base64",
                ).toString("utf8");
                logger.info(
                    "State decoded to JWT, length:",
                    providedJwt.length,
                );
            } catch {
                logger.warn("Invalid state encoding");
            }
        }
        if (!providedJwt && req.query.jwt)
            providedJwt = req.query.jwt as string;
        if (!providedJwt) {
            const a = (req.headers.authorization || "") as string;
            if (a.toLowerCase().startsWith("bearer "))
                providedJwt = a.slice(7).trim();
        }

        if (providedJwt) {
            const decoded = verifyJwt(providedJwt);
            logger.info("JWT verified:", !!decoded, "sub:", decoded?.sub);
            if (decoded?.sub) {
                const paired = await pairMsTokenToUser(
                    decoded.sub as string,
                    response.accessToken || "",
                );
                if (paired) {
                    logger.info(`Paired MS token to user ${decoded.sub}`);
                    return res.redirect(
                        `${FRONTEND_URL}/dashboard?ms_bound=true`,
                    );
                }
                logger.warn(
                    `User not found for MS token pairing: ${decoded.sub}`,
                );
            } else {
                logger.warn("Invalid JWT in MS auth redirect state");
            }
        } else {
            logger.warn(
                "MS auth redirect without JWT/state, cannot pair to user",
            );
        }
        return res.redirect(`${FRONTEND_URL}/dashboard?ms_bound=false`);
    } catch (error) {
        logger.error("Token acquisition error:", error);
        res.status(500).send("Authentication failed");
    }
});

// ── 挂载路由 ───────────────────────────────────────────────

// 认证路由（注册、登录、Exchange、CAF、SMTP）
app.use(
    createAuthRoutes({
        userCache,
        signJwt,
        signRefreshJwt,
        verifyJwt,
        findUserByEmail,
        findUserByCafSub,
        authenticateToken,
        frontendUrl: FRONTEND_URL,
        exchangeOAuthConfig,
        cafConfig,
    }),
);

// API 路由
app.use("/api", initializeApiRoutes(authenticateToken, FRONTEND_URL));

// 待办 / 标签路由
app.use("/api", initializeTodoRoutes(authenticateToken));

// 归档路由（ARC-001）
app.use("/api", initializeArchiveRoutes(authenticateToken));

// 会员与兑换码路由（MENU-001）
app.use("/api", initializeMembershipRoutes(authenticateToken));

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
app.post(
    "/api/ebridge/save-url",
    authenticateToken,
    async (req: any, res: any) => {
        const user = req.user as User;
        const { timetableUrl } = req.body || {};
        if (
            !timetableUrl ||
            typeof timetableUrl !== "string" ||
            !timetableUrl.startsWith("http")
        ) {
            return res.status(400).json({ error: "Invalid timetable URL" });
        }
        user.timetableUrl = timetableUrl;
        user.ebridgeBinded = true;
        await dbService.updateUser(user);
        userCache.set(user.id, user);
        res.json({ success: true });
    },
);

// Admin 路由
app.use("/api/admin", authenticateToken, createAdminRouter());

// MCP 路由
initializeMcpRoutes(app, authenticateToken);

// CalDAV Server
initializeCalDavServer({
    app,
    baseUrl: BACKEND_URL + "/caldav",
    jwtVerify: (token: string) => verifyJwt(token),
    userLookup: async (sub: string) => {
        let user = userCache.get(sub);
        if (!user) {
            user = (await dbService.getUserById(sub)) || undefined;
            if (user) userCache.set(user.id, user);
        }
        return user;
    },
});

// 用户上传资源（头像等）— 须在 catch-all 之前
const uploadsDir = path.join(process.cwd(), "private", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// 静态文件
app.use(express.static(path.join(__dirname, "../../dist")));
app.get("*", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
        return res.status(404).json({ error: "Not Found" });
    }
    res.sendFile(path.join(__dirname, "../../dist/index.html"), (err) => {
        if (err && !res.headersSent) {
            res.status(404).send("Frontend not built or not found.");
        }
    });
});

// ── 启动 ───────────────────────────────────────────────────

async function startServer() {
    try {
        await dbService.initialize();
        dbService.setLogListener(broadcastUserLog);

        const users = await dbService.getAllUsers();
        users.forEach((u) => userCache.set(u.id, u));
        logger.info(`Loaded ${users.length} users from database`);

        try {
            await ensureCafClientCredentials(cafConfig);
        } catch (cafError: any) {
            logger.error(
                "CAF auto-registration failed:",
                cafError?.response?.data || cafError?.message || cafError,
            );
        }

        const server = app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
            logger.info(
                `Visit http://localhost:${PORT}/auth to start authentication`,
            );
        });
        initWebSocket(server, () => userCache.values());
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
startIntervals(() => userCache.values()).catch((e: any) =>
    logger.error("Failed to start intervals:", e?.message || e),
);

// ── 导出的工具函数 ─────────────────────────────────────────

export async function createTaskToUser(
    user: User,
    taskData: Task,
): Promise<void> {
    try {
        await dbService.addTask(
            user.id,
            taskData,
            !!user.conflictBoundaryInclusive,
            user.isConflictScheduleAllowed,
        );
        await dbService.refreshUserTasksIncremental(user, {
            addedIds: [taskData.id],
        });
        await logUserEvent(
            user.id,
            "taskCreated",
            `Created task ${taskData.name} via helper`,
            { id: taskData.id },
        );
        logger.success(
            `Task created successfully for user ${user.id}: ${taskData.name}`,
        );
    } catch (error) {
        logger.error(`Failed to create task for user ${user.id}:`, error);
        throw error;
    }
}
