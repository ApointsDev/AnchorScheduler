/**
 * Admin Routes - 管理员后台 API
 *
 * 需要管理员权限（ADMIN_EMAILS 环境变量配置）
 * 提供用户管理功能：查看、编辑所有用户字段
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { User } from "../index.js";
import {
    type AdminUserRow,
    ADMIN_FIELD_META,
    ADMIN_EDITABLE_FIELDS,
} from "./apiType.js";

// ── 管理员列表加载（仅从 .env 中的 ADMIN_EMAILS 读取）────────

function loadAdminEmails(): string[] {
    return (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
}

const ADMIN_EMAILS = loadAdminEmails();

logger.info(
    `Admin emails loaded: ${ADMIN_EMAILS.length > 0 ? ADMIN_EMAILS.join(", ") : "(none)"}`,
);

// ── 管理员中间件 ────────────────────────────────────────────────

export function isAdmin(email: string): boolean {
    if (ADMIN_EMAILS.length === 0) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function adminMiddleware(req: any, res: any, next: any) {
    const user: User | undefined = req.user;
    if (!user || !isAdmin(user.email)) {
        return res.status(403).json({ error: "需要管理员权限" });
    }
    next();
}

// ── User → AdminUserRow 映射 ────────────────────────────────────

function mapUserToRow(user: User): AdminUserRow {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        XJTLUaccount: user.XJTLUaccount || null,
        XJTLUPassword: user.XJTLUPassword || null,
        passwordHash: user.passwordHash || null,
        JWTtoken: user.JWTtoken || null,
        MStoken: user.MStoken || null,
        MSRefreshToken: user.MSRefreshToken || null,
        MSbinded: !!user.MSbinded,
        ExchangeAccessToken: user.ExchangeAccessToken || null,
        ExchangeRefreshToken: user.ExchangeRefreshToken || null,
        ExchangeTokenExpiresAt: user.ExchangeTokenExpiresAt || null,
        ExchangeBinded: !!user.ExchangeBinded,
        ImapBinded: !!user.ImapBinded,
        ImapEmail: user.ImapEmail || null,
        ImapPassword: user.ImapPassword || null,
        ImapHost: user.ImapHost || null,
        ImapPort: user.ImapPort || null,
        ImapTls: !!user.ImapTls,
        CAFSub: user.CAFSub || null,
        CAFAccessToken: user.CAFAccessToken || null,
        CAFRefreshToken: user.CAFRefreshToken || null,
        CAFTokenExpiresAt: user.CAFTokenExpiresAt || null,
        ebridgeBinded: !!user.ebridgeBinded,
        timetableUrl: user.timetableUrl || "",
        timetableFetchLevel: user.timetableFetchLevel || 0,
        mailReadingSpan: user.mailReadingSpan ?? 30,
        conflictBoundaryInclusive: !!user.conflictBoundaryInclusive,
        weekOffset: user.weekOffset || 0,
        CalDavBaseUrl: (user as any).CalDavBaseUrl || null,
        CalDavUsername: (user as any).CalDavUsername || null,
        CalDavPassword: (user as any).CalDavPassword || null,
        CalDavPrincipalUrl: (user as any).CalDavPrincipalUrl || null,
        CalDavCalendarHome: (user as any).CalDavCalendarHome || null,
        CalDavCalendarUrl: (user as any).CalDavCalendarUrl || null,
        CalDavEnabled: !!(user as any).CalDavEnabled,
        CalDavLastSyncAt: (user as any).CalDavLastSyncAt || null,
        CalDavServerEnabled: !!(user as any).CalDavServerEnabled,
        highEnergyPeriods: user.highEnergyPeriods || {},
        createdAt: (user as any).createdAt || null,
        updatedAt: (user as any).updatedAt || null,
        taskCount: (user.tasks || []).length,
    };
}

// ── 快速判断字段类型（基于 ADMIN_FIELD_META）───────────────────

function getFieldType(key: string): string {
    return ADMIN_FIELD_META[key]?.type || "text";
}

// ── Router ──────────────────────────────────────────────────────

export function createAdminRouter() {
    const router = express.Router();

    // ── GET /api/admin/check — 检查当前用户是否为管理员（不需要管理员权限）──
    router.get("/check", (req: any, res: any) => {
        const user: User | undefined = req.user;
        if (!user) {
            return res.json({ isAdmin: false });
        }
        res.json({ isAdmin: isAdmin(user.email) });
    });

    // 其他 admin 路由都需要管理员权限
    router.use(adminMiddleware);

    // ── GET /api/admin/fields ─────────────────────────────────────
    router.get("/fields", (_req: any, res: any) => {
        res.json({ fields: ADMIN_FIELD_META });
    });

    // ── GET /api/admin/users ──────────────────────────────────────
    router.get("/users", async (req: any, res: any) => {
        try {
            const { search, page = "1", limit = "50" } = req.query;
            const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
            const limitNum = Math.max(
                1,
                Math.min(200, parseInt(limit as string, 10) || 50),
            );
            const offset = (pageNum - 1) * limitNum;

            let users = await dbService.getAllUsers();

            // 搜索过滤
            if (search && typeof search === "string") {
                const q = search.toLowerCase();
                users = users.filter(
                    (u) =>
                        u.email.toLowerCase().includes(q) ||
                        u.name.toLowerCase().includes(q) ||
                        u.id.toLowerCase().includes(q),
                );
            }

            const total = users.length;
            const pagedUsers = users.slice(offset, offset + limitNum);

            const rows = pagedUsers.map(mapUserToRow);

            res.json({
                users: rows,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            });
        } catch (error: any) {
            logger.error("Admin get users error:", error);
            res.status(500).json({ error: "获取用户列表失败" });
        }
    });

    // ── GET /api/admin/users/:id ──────────────────────────────────
    router.get("/users/:id", async (req: any, res: any) => {
        try {
            const user = await dbService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: "用户不存在" });
            }
            res.json(mapUserToRow(user));
        } catch (error: any) {
            logger.error("Admin get user error:", error);
            res.status(500).json({ error: "获取用户信息失败" });
        }
    });

    // ── PATCH /api/admin/users/:id ────────────────────────────────
    router.patch("/users/:id", async (req: any, res: any) => {
        try {
            const userId = req.params.id;
            const updates: Record<string, any> = req.body;

            if (
                !updates ||
                typeof updates !== "object" ||
                Object.keys(updates).length === 0
            ) {
                return res.status(400).json({ error: "请提供要更新的字段" });
            }

            // 获取当前用户信息确保存在
            const existingUser = await dbService.getUserById(userId);
            if (!existingUser) {
                return res.status(404).json({ error: "用户不存在" });
            }

            // 校验所有字段在白名单中
            for (const key of Object.keys(updates)) {
                if (key === "id") continue;
                if (!ADMIN_EDITABLE_FIELDS.has(key)) {
                    return res
                        .status(400)
                        .json({ error: `不允许的字段: ${key}` });
                }
            }

            // 构建更新值（根据 ADMIN_FIELD_META 类型转换）
            const sanitized: Record<string, any> = {};
            for (const [key, value] of Object.entries(updates)) {
                if (key === "id") continue;
                const fieldType = getFieldType(key);
                if (fieldType === "boolean") {
                    sanitized[key] = value ? 1 : 0;
                } else if (fieldType === "json") {
                    sanitized[key] =
                        typeof value === "string"
                            ? value
                            : JSON.stringify(value);
                } else if (fieldType === "number") {
                    sanitized[key] =
                        value === "" || value === null ? null : Number(value);
                } else {
                    sanitized[key] = value === "" ? null : value;
                }
            }

            if (Object.keys(sanitized).length === 0) {
                return res
                    .status(400)
                    .json({ error: "没有有效的字段需要更新" });
            }

            // 使用 dbService 的管理员更新方法
            await dbService.adminUpdateUserFields(userId, sanitized);

            logger.info(
                `Admin: user ${userId} updated fields: ${Object.keys(sanitized).join(", ")}`,
            );

            const updatedUser = await dbService.getUserById(userId);
            res.json(mapUserToRow(updatedUser!));
        } catch (error: any) {
            logger.error("Admin update user error:", error);
            res.status(500).json({
                error: "更新用户失败: " + (error.message || ""),
            });
        }
    });

    // ── POST /api/admin/users — 创建新用户 ─────────────────────────
    router.post("/users", async (req: any, res: any) => {
        try {
            const { email, name, password, XJTLUaccount, XJTLUPassword } =
                req.body || {};
            if (!email || !name) {
                return res.status(400).json({ error: "邮箱和昵称为必填项" });
            }

            // 检查邮箱是否已被使用
            const existingUser = await dbService.getUserByEmail(
                email.toLowerCase(),
            );
            if (existingUser) {
                return res.status(409).json({ error: "该邮箱已被使用" });
            }

            const { v4: uuidv4 } = await import("uuid");
            const bcrypt = await import("bcryptjs");
            const id = uuidv4();
            const passwordHash = password
                ? await bcrypt.hash(password, 10)
                : null;

            const user: any = {
                id,
                email: email.toLowerCase(),
                name,
                passwordHash,
                XJTLUaccount: XJTLUaccount || null,
                XJTLUPassword: XJTLUPassword || null,
                MSbinded: false,
                ExchangeBinded: false,
                ImapBinded: false,
                ebridgeBinded: false,
                timetableUrl: "",
                timetableFetchLevel: 0,
                mailReadingSpan: 30,
                conflictBoundaryInclusive: false,
                weekOffset: 0,
                CalDavEnabled: false,
                CalDavServerEnabled: false,
                tasks: [],
            };

            await dbService.addUser(user);

            logger.info(`Admin: created user ${user.email} (${user.id})`);
            res.status(201).json({
                id: user.id,
                email: user.email,
                name: user.name,
            });
        } catch (error: any) {
            logger.error("Admin create user error:", error);
            res.status(500).json({
                error: "创建用户失败: " + (error.message || ""),
            });
        }
    });

    // ── DELETE /api/admin/users/:id — 删除用户 ──────────────────────
    router.delete("/users/:id", async (req: any, res: any) => {
        try {
            const userId = req.params.id;
            const user = await dbService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "用户不存在" });
            }

            await dbService.deleteUser(userId);
            logger.info(`Admin: deleted user ${user.email} (${userId})`);
            res.json({ message: `用户 ${user.email} 已删除`, id: userId });
        } catch (error: any) {
            logger.error("Admin delete user error:", error);
            res.status(500).json({
                error: "删除用户失败: " + (error.message || ""),
            });
        }
    });

    // ── GET /api/admin/users/:id/schedule — 查看用户日程 ──────────
    router.get("/users/:id/schedule", async (req: any, res: any) => {
        try {
            const userId = req.params.id;
            const user = await dbService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "用户不存在" });
            }

            const tasks = await dbService.getTasksByUserId(userId);
            const taskList = tasks.map((t: any) => ({
                id: t.id,
                name: t.name,
                description: t.description,
                dueDate: t.dueDate,
                startTime: t.startTime,
                endTime: t.endTime,
                location: t.location,
                completed: t.completed,
                importance: t.importance,
                scheduleType: t.scheduleType,
                recurrenceRule: t.recurrenceRule,
            }));

            res.json({
                user: { id: user.id, email: user.email, name: user.name },
                tasks: taskList,
                total: taskList.length,
            });
        } catch (error: any) {
            logger.error("Admin get user schedule error:", error);
            res.status(500).json({
                error: "获取用户日程失败: " + (error.message || ""),
            });
        }
    });

    // ── POST /api/admin/cache/refresh ─────────────────────────────
    router.post("/cache/refresh", async (req: any, res: any) => {
        try {
            const { userId } = req.body;
            if (userId) {
                const user = await dbService.getUserById(userId);
                if (user) {
                    res.json({
                        message: `用户 ${user.email} 数据已刷新`,
                        userId,
                    });
                } else {
                    res.status(404).json({ error: "用户不存在" });
                }
            } else {
                const users = await dbService.getAllUsers();
                res.json({ message: `已加载 ${users.length} 个用户` });
            }
        } catch (error: any) {
            res.status(500).json({ error: "刷新缓存失败" });
        }
    });

    // ── 会员与兑换码（MENU-001）──────────────────────────────

    // GET /api/admin/membership/redeem-codes → 兑换码列表
    router.get("/membership/redeem-codes", async (_req: any, res: any) => {
        try {
            const codes = await dbService.listRedeemCodes();
            res.json({ codes });
        } catch (error: any) {
            logger.error("Admin list redeem codes error:", error);
            res.status(500).json({ error: "获取兑换码列表失败" });
        }
    });

    // POST /api/admin/membership/redeem-codes
    // body: { tier, days, count?, maxUses?, expiresAt? } → 批量生成兑换码
    router.post("/membership/redeem-codes", async (req: any, res: any) => {
        try {
            const { tier, days, count = 1, maxUses = 1, expiresAt } =
                req.body || {};
            const numCount = Math.max(
                1,
                Math.min(50, parseInt(count, 10) || 1),
            );
            const codes = [];
            for (let i = 0; i < numCount; i++) {
                const code = await dbService.createRedeemCode({
                    tier: String(tier || ""),
                    days: parseInt(days, 10) || 0,
                    maxUses: maxUses != null ? parseInt(maxUses, 10) : null,
                    expiresAt: expiresAt || null,
                    createdBy: (req.user as any)?.email || "admin",
                });
                codes.push(code);
            }
            res.json({ codes, count: codes.length });
        } catch (error: any) {
            logger.error("Admin create redeem codes error:", error);
            res.status(400).json({
                error: "生成兑换码失败: " + (error.message || ""),
            });
        }
    });

    // POST /api/admin/membership/grant
    // body: { userId, tier, days } → 直接为用户发放会员权益
    router.post("/membership/grant", async (req: any, res: any) => {
        try {
            const { userId, tier, days } = req.body || {};
            if (!userId || !tier || !days) {
                return res.status(400).json({ error: "缺少 userId/tier/days" });
            }
            const user = await dbService.getUserById(userId);
            if (!user) return res.status(404).json({ error: "用户不存在" });
            const grant = await dbService.grantMembership(
                String(userId),
                String(tier),
                parseInt(days, 10),
                "admin_grant",
            );
            const membership = await dbService.getMembershipSummary(String(userId));
            res.json({ grant, membership });
        } catch (error: any) {
            logger.error("Admin grant membership error:", error);
            res.status(400).json({
                error: "发放会员失败: " + (error.message || ""),
            });
        }
    });

    return router;
}
