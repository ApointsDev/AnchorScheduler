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
import { REPORT_TYPES, REPORT_STATUSES } from "../Services/db/reports.js";
import type {
    ReportType,
    ReportStatus,
} from "../Services/db/reports.js";
import { APP_PLATFORMS } from "../Services/db/appUpdate.js";
import type { AppPlatform } from "../Services/db/appUpdate.js";
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

// ── 类型化筛选辅助（避免把任意字符串传给字面量联合类型）────────

function toReportType(value: unknown): ReportType | undefined {
    const s = value == null ? "" : String(value);
    return (REPORT_TYPES as readonly string[]).includes(s)
        ? (s as ReportType)
        : undefined;
}

function toReportStatus(value: unknown): ReportStatus | undefined {
    const s = value == null ? "" : String(value);
    return (REPORT_STATUSES as readonly string[]).includes(s)
        ? (s as ReportStatus)
        : undefined;
}

function toAppPlatform(value: unknown): AppPlatform {
    const s = value == null ? "" : String(value);
    return (APP_PLATFORMS as readonly string[]).includes(s)
        ? (s as AppPlatform)
        : "all";
}

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
        // SQL 层分页时以 taskCount 字段为准（users 不带 tasks 数组）
        taskCount: (user as any).taskCount ?? (user.tasks || []).length,
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

            // SQL 层分页（避免一次性加载全部用户与日程导致翻页卡死）
            const { users, total } = await dbService.getUsersPage({
                search: typeof search === "string" ? search : undefined,
                limit: limitNum,
                offset,
            });

            const rows = users.map(mapUserToRow);

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

    // ── 用户反馈 / 举报管理（RPT-001）──────────────────────

    // GET /api/admin/reports — 反馈/举报列表（分页 + 类型/状态筛选 + 搜索）
    router.get("/reports", async (req: any, res: any) => {
        try {
            const {
                page = "1",
                limit = "20",
                type,
                status,
                search,
            } = req.query;
            const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
            const limitNum = Math.min(
                200,
                Math.max(1, parseInt(limit as string, 10) || 20),
            );

            const result = await dbService.reports.list({
                type: toReportType(type),
                status: toReportStatus(status),
                search: search ? String(search) : undefined,
                limit: limitNum,
                offset: (pageNum - 1) * limitNum,
            });

            // 附带用户邮箱/昵称，便于管理员查看
            const enriched = await Promise.all(
                result.reports.map(async (r: any) => {
                    const u = await dbService.getUserById(r.userId);
                    return {
                        ...r,
                        userEmail: u?.email || null,
                        userName: u?.name || null,
                    };
                }),
            );

            res.json({
                reports: enriched,
                total: result.total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(result.total / limitNum),
            });
        } catch (error: any) {
            logger.error("Admin list reports error:", error);
            res.status(500).json({ error: "获取反馈列表失败" });
        }
    });

    // PATCH /api/admin/reports/:id — 更新处理状态
    // body: { status: "pending"|"processing"|"resolved"|"rejected" }
    router.patch("/reports/:id", async (req: any, res: any) => {
        try {
            const { status } = req.body || {};
            const report = await dbService.reports.getById(req.params.id);
            if (!report) {
                return res.status(404).json({ error: "记录不存在" });
            }
            const updated = await dbService.reports.updateStatus(
                req.params.id,
                status,
            );
            logger.info(
                `Admin: report ${req.params.id} status -> ${status} by ${(req.user as any)?.email}`,
            );
            res.json({ report: updated });
        } catch (error: any) {
            logger.error("Admin update report status error:", error);
            res.status(400).json({
                error: "更新状态失败: " + (error.message || ""),
            });
        }
    });

    // DELETE /api/admin/reports/:id — 删除反馈/举报
    router.delete("/reports/:id", async (req: any, res: any) => {
        try {
            const ok = await dbService.reports.delete(req.params.id);
            if (!ok) {
                return res.status(404).json({ error: "记录不存在" });
            }
            res.json({ message: "已删除", id: req.params.id });
        } catch (error: any) {
            logger.error("Admin delete report error:", error);
            res.status(500).json({ error: "删除失败" });
        }
    });

    // ── 应用版本更新配置（UPD-001）────────────────────────

    // GET /api/admin/app-update — 版本发布配置列表
    router.get("/app-update", async (_req: any, res: any) => {
        try {
            const releases = await dbService.appUpdate.list();
            res.json({ releases });
        } catch (error: any) {
            logger.error("Admin list app-update error:", error);
            res.status(500).json({ error: "获取版本配置失败" });
        }
    });

    // POST /api/admin/app-update — 新增 / 更新版本发布配置
    // body: { id?, platform, version, versionCode?, downloadUrl, releaseNotes?, forceUpdate?, enabled? }
    router.post("/app-update", async (req: any, res: any) => {
        try {
            const b = req.body || {};
            if (!b.version || !b.downloadUrl || !b.platform) {
                return res
                    .status(400)
                    .json({ error: "platform / version / downloadUrl 为必填项" });
            }
            const release = await dbService.appUpdate.upsert({
                id: b.id || undefined,
                platform: toAppPlatform(b.platform),
                version: String(b.version),
                versionCode: b.versionCode != null ? Number(b.versionCode) : 0,
                downloadUrl: String(b.downloadUrl),
                releaseNotes: b.releaseNotes || null,
                forceUpdate: !!b.forceUpdate,
                enabled: b.enabled !== false,
            });
            logger.info(
                `Admin: ${b.id ? "updated" : "created"} app release ${release.platform}@${release.version} by ${(req.user as any)?.email}`,
            );
            res.json({ release });
        } catch (error: any) {
            logger.error("Admin save app-update error:", error);
            res.status(500).json({
                error: "保存版本配置失败: " + (error.message || ""),
            });
        }
    });

    // PATCH /api/admin/app-update/:id/enabled — 启用 / 停用
    router.patch("/app-update/:id/enabled", async (req: any, res: any) => {
        try {
            const { enabled } = req.body || {};
            const release = await dbService.appUpdate.setEnabled(
                req.params.id,
                !!enabled,
            );
            if (!release) {
                return res.status(404).json({ error: "版本配置不存在" });
            }
            res.json({ release });
        } catch (error: any) {
            logger.error("Admin set app-update enabled error:", error);
            res.status(500).json({ error: "更新失败" });
        }
    });

    // DELETE /api/admin/app-update/:id — 删除版本配置
    router.delete("/app-update/:id", async (req: any, res: any) => {
        try {
            const ok = await dbService.appUpdate.delete(req.params.id);
            if (!ok) {
                return res.status(404).json({ error: "版本配置不存在" });
            }
            res.json({ message: "已删除", id: req.params.id });
        } catch (error: any) {
            logger.error("Admin delete app-update error:", error);
            res.status(500).json({ error: "删除失败" });
        }
    });

    return router;
}
