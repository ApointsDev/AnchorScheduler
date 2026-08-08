// DA 校园大事件路由（多校）
// 挂载于 /api/da →
//   公开（无 JWT）：/schools、/:slug/events、/:slug/events/:id、/:slug/page
//   学生（JWT）：/optin
//   系统管理员（JWT + isSystemAdmin）：/admin/schools*
//   学校 DA 管理员（JWT + isDaAdminForSchool）：/admin/:slug/*
// 路由注册顺序敏感：/admin/... 与 /optin 等静态段必须先于 /:slug/... 注册。

import express from "express";
import { daService } from "../Services/daService.js";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";
import type { School } from "../Services/db/schools.js";

export function initializeDaRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    // 异步处理包装，避免每个 handler 重复 try/catch
    const asyncHandler =
        (fn: (req: any, res: any) => Promise<void>) =>
        (req: any, res: any, next: any) => {
            fn(req, res).catch((e: any) => {
                logger.error(`DA route error: ${e?.message || e}`);
                res
                    .status(500)
                    .json({ error: e?.message || "内部错误" });
            });
        };

    // ── 系统管理员守卫 ─────────────────────────────────────────
    const requireSystemAdmin = (req: any, res: any, next: any) => {
        const user = req.user as User | undefined;
        if (!user || !daService.isSystemAdmin(user.email)) {
            return res.status(403).json({ error: "需要系统管理员权限" });
        }
        next();
    };

    // ── 学校 DA 管理员守卫（按 slug）──────────────────────────
    const requireSchoolAdmin = async (req: any, res: any, next: any) => {
        const user = req.user as User | undefined;
        if (!user) return res.status(401).json({ error: "未登录" });
        const school = await daService.getSchoolBySlug(req.params.slug);
        if (!school) {
            return res.status(404).json({ error: "学校不存在" });
        }
        const ok = await daService.isDaAdminForSchool(
            school.id,
            user.email,
        );
        if (!ok) {
            return res.status(403).json({ error: "需要该校 DA 管理员权限" });
        }
        req.school = school;
        next();
    };

    // ══════════════ 学生（JWT，任意用户）══════════════════

    // GET /api/da/optin — 我参与的学校贡献开关
    router.get(
        "/optin",
        authenticateToken,
        asyncHandler(async (req: any, res: any) => {
            const user = req.user as User;
            const optins = await daService.listSchoolsByOptinUser(
                user.id,
            );
            res.json({ optins });
        }),
    );

    // PUT /api/da/optin — 设置某校贡献开关 { schoolId, optedIn }
    router.put(
        "/optin",
        authenticateToken,
        asyncHandler(async (req: any, res: any) => {
            const user = req.user as User;
            const { schoolId, optedIn } = req.body || {};
            if (!schoolId) {
                return res.status(400).json({ error: "缺少 schoolId" });
            }
            const school = await daService.getSchoolById(schoolId);
            if (!school || school.enabled === 0 || school.enabled === false) {
                return res.status(404).json({ error: "学校不存在或已停用" });
            }
            await daService.setOptin(
                schoolId,
                user.id,
                optedIn === true,
            );
            res.json({ ok: true, optedIn: optedIn === true });
        }),
    );

    // ══════════════ 系统管理员 —— 学校管理 ══════════════════

    // GET /api/da/admin/my-schools — 我可管理的学校（系统管理员=全部，否则 school_admins）
    router.get(
        "/admin/my-schools",
        authenticateToken,
        asyncHandler(async (req: any, res: any) => {
            const user = req.user as User;
            const schools = await daService.listMySchools(user.email);
            res.json({
                schools: schools.map((s) => ({
                    id: s.id,
                    slug: s.slug,
                    name: s.name,
                    eventsEmail: s.eventsEmail,
                    themeColor: s.themeColor,
                    enabled: !!s.enabled,
                })),
            });
        }),
    );

    // GET /api/da/admin/schools
    router.get(
        "/admin/schools",
        authenticateToken,
        requireSystemAdmin,
        asyncHandler(async (_req: any, res: any) => {
            const schools = await daService.listSchools({
                includeDisabled: true,
            });
            const result = [];
            for (const s of schools) {
                const admins = await daService.listSchoolAdmins(s.id);
                result.push({
                    id: s.id,
                    slug: s.slug,
                    name: s.name,
                    eventsEmail: s.eventsEmail,
                    themeColor: s.themeColor,
                    enabled: !!s.enabled,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                    admins: admins.map((a) => a.email),
                    daAccountEmail: daService.daAccountEmail(s),
                });
            }
            res.json({ schools: result });
        }),
    );

    // POST /api/da/admin/schools — 新增学校
    router.post(
        "/admin/schools",
        authenticateToken,
        requireSystemAdmin,
        asyncHandler(async (req: any, res: any) => {
            const { slug, name, eventsEmail, themeColor } = req.body || {};
            const school = await daService.createSchool({
                slug,
                name,
                eventsEmail,
                themeColor,
            });
            res.status(201).json({ school });
        }),
    );

    // PATCH /api/da/admin/schools/:schoolId
    router.patch(
        "/admin/schools/:schoolId",
        authenticateToken,
        requireSystemAdmin,
        asyncHandler(async (req: any, res: any) => {
            const { slug, name, eventsEmail, themeColor, enabled } =
                req.body || {};
            const school = await daService.updateSchool(
                req.params.schoolId,
                { slug, name, eventsEmail, themeColor, enabled },
            );
            if (!school) {
                return res.status(404).json({ error: "学校不存在" });
            }
            res.json({ school });
        }),
    );

    // DELETE /api/da/admin/schools/:schoolId
    router.delete(
        "/admin/schools/:schoolId",
        authenticateToken,
        requireSystemAdmin,
        asyncHandler(async (req: any, res: any) => {
            const ok = await daService.deleteSchool(
                req.params.schoolId,
            );
            if (!ok) {
                return res.status(404).json({ error: "学校不存在" });
            }
            res.json({ ok: true });
        }),
    );

    // GET /api/da/admin/schools/:schoolId/admins
    router.get(
        "/admin/schools/:schoolId/admins",
        authenticateToken,
        requireSystemAdmin,
        asyncHandler(async (req: any, res: any) => {
            const admins = await daService.listSchoolAdmins(
                req.params.schoolId,
            );
            res.json({ admins });
        }),
    );

    // POST /api/da/admin/schools/:schoolId/admins — 添加 { email }
    router.post(
        "/admin/schools/:schoolId/admins",
        authenticateToken,
        requireSystemAdmin,
        asyncHandler(async (req: any, res: any) => {
            const { email } = req.body || {};
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                return res.status(400).json({ error: "邮箱格式不正确" });
            }
            await daService.addSchoolAdmin(
                req.params.schoolId,
                email,
            );
            res.json({ ok: true });
        }),
    );

    // DELETE /api/da/admin/schools/:schoolId/admins/:email
    router.delete(
        "/admin/schools/:schoolId/admins/:email",
        authenticateToken,
        requireSystemAdmin,
        asyncHandler(async (req: any, res: any) => {
            await daService.removeSchoolAdmin(
                req.params.schoolId,
                decodeURIComponent(req.params.email),
            );
            res.json({ ok: true });
        }),
    );

    // ══════════════ 学校 DA 管理员 —— 按校管理 ══════════════════

    // GET /api/da/admin/:slug/events
    router.get(
        "/admin/:slug/events",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const events = await daService.listAllEvents(req.school);
            res.json({ events });
        }),
    );

    // POST /api/da/admin/:slug/events
    router.post(
        "/admin/:slug/events",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const event = await daService.createEvent(
                req.school as School,
                req.body || {},
            );
            res.status(201).json({ event });
        }),
    );

    // PATCH /api/da/admin/:slug/events/:id
    router.patch(
        "/admin/:slug/events/:id",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const event = await daService.updateEvent(
                req.school as School,
                req.params.id,
                req.body || {},
            );
            res.json({ event });
        }),
    );

    // DELETE /api/da/admin/:slug/events/:id
    router.delete(
        "/admin/:slug/events/:id",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const ok = await daService.deleteEvent(
                req.school as School,
                req.params.id,
            );
            if (!ok) {
                return res.status(404).json({ error: "事件不存在" });
            }
            res.json({ ok: true });
        }),
    );

    // GET /api/da/admin/:slug/queue
    router.get(
        "/admin/:slug/queue",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const queue = await daService.getQueue(req.school);
            res.json(queue);
        }),
    );

    // POST /api/da/admin/:slug/queue/:id/approve
    router.post(
        "/admin/:slug/queue/:id/approve",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const result = await daService.approveQueueItem(
                req.school as School,
                req.params.id,
                { allowConflict: req.body?.allowConflict === true },
            );
            if (!result.ok) {
                return res
                    .status(result.conflict ? 409 : 422)
                    .json(result);
            }
            res.json({ ok: true, task: result.task, todo: result.todo });
        }),
    );

    // POST /api/da/admin/:slug/queue/:id/reject
    router.post(
        "/admin/:slug/queue/:id/reject",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const result = await daService.rejectQueueItem(
                req.school as School,
                req.params.id,
            );
            if (!result.ok) {
                return res.status(422).json(result);
            }
            res.json({ ok: true });
        }),
    );

    // POST /api/da/admin/:slug/import — 手动粘贴文本 → NLP → 入队
    router.post(
        "/admin/:slug/import",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const { text } = req.body || {};
            if (!text || !String(text).trim()) {
                return res
                    .status(400)
                    .json({ error: "缺少导入文本" });
            }
            const result = await daService.importText(
                req.school as School,
                String(text),
            );
            res.json(result);
        }),
    );

    // GET /api/da/admin/:slug/settings
    router.get(
        "/admin/:slug/settings",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const settings = await daService.getSettings(req.school);
            const page = await daService.getPageConfig(req.school);
            res.json({ settings, page });
        }),
    );

    // PUT /api/da/admin/:slug/settings
    router.put(
        "/admin/:slug/settings",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const { settings, page } = req.body || {};
            if (settings && typeof settings === "object") {
                await daService.updateSettings(req.school, settings);
            }
            if (page && typeof page === "object") {
                await daService.updatePageConfig(req.school, page);
            }
            const freshSettings = await daService.getSettings(req.school);
            const freshPage = await daService.getPageConfig(req.school);
            res.json({ settings: freshSettings, page: freshPage });
        }),
    );

    // POST /api/da/admin/:slug/mail/refresh
    router.post(
        "/admin/:slug/mail/refresh",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            await daService.refreshDaMail(req.school as School);
            res.json({ ok: true });
        }),
    );

    // GET /api/da/admin/:slug/students
    router.get(
        "/admin/:slug/students",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            const { rows, total } = await daService.listStudents(
                req.school.id,
                {
                    limit: parseInt(req.query.limit, 10) || 50,
                    offset: parseInt(req.query.offset, 10) || 0,
                },
            );
            // 附带用户名（不暴露邮箱之外的敏感字段）
            const students = [];
            for (const r of rows) {
                const u = await dbUserBrief(r.userId);
                students.push({
                    userId: r.userId,
                    name: u?.name || "",
                    email: u?.email || "",
                    optedIn: r.optedIn === 1,
                    updatedAt: r.updatedAt,
                });
            }
            res.json({ students, total });
        }),
    );

    // PUT /api/da/admin/:slug/students/:userId — 后台代管开关
    router.put(
        "/admin/:slug/students/:userId",
        authenticateToken,
        requireSchoolAdmin,
        asyncHandler(async (req: any, res: any) => {
            await daService.setOptin(
                req.school.id,
                req.params.userId,
                req.body?.optedIn === true,
            );
            res.json({ ok: true });
        }),
    );

    // ══════════════ 公开（无 JWT）══════════════════

    // GET /api/da/schools — 启用中的学校列表（公开）
    router.get(
        "/schools",
        asyncHandler(async (_req: any, res: any) => {
            const schools = await daService.listSchools();
            res.json({
                schools: schools.map((s) => ({
                    id: s.id,
                    slug: s.slug,
                    name: s.name,
                    eventsEmail: s.eventsEmail,
                    themeColor: s.themeColor,
                })),
            });
        }),
    );

    // GET /api/da/:slug/events
    router.get(
        "/:slug/events",
        asyncHandler(async (req: any, res: any) => {
            const school = await daService.getSchoolBySlug(
                req.params.slug,
            );
            if (!school || school.enabled === 0 || school.enabled === false) {
                return res.status(404).json({ error: "学校不存在或已停用" });
            }
            const events = await daService.listPublicEvents(school, {
                start: req.query.start as string | undefined,
                end: req.query.end as string | undefined,
            });
            res.json({ school: school.slug, events });
        }),
    );

    // GET /api/da/:slug/events/:id
    router.get(
        "/:slug/events/:id",
        asyncHandler(async (req: any, res: any) => {
            const school = await daService.getSchoolBySlug(
                req.params.slug,
            );
            if (!school || school.enabled === 0 || school.enabled === false) {
                return res.status(404).json({ error: "学校不存在或已停用" });
            }
            const event = await daService.getPublicEvent(
                school,
                req.params.id,
            );
            if (!event) {
                return res.status(404).json({ error: "事件不存在" });
            }
            res.json({ event });
        }),
    );

    // GET /api/da/:slug/page
    router.get(
        "/:slug/page",
        asyncHandler(async (req: any, res: any) => {
            const school = await daService.getSchoolBySlug(
                req.params.slug,
            );
            if (!school || school.enabled === 0 || school.enabled === false) {
                return res.status(404).json({ error: "学校不存在或已停用" });
            }
            const page = await daService.getPageConfig(school);
            res.json({ page });
        }),
    );

    return router;
}

// 学生贡献名单附带用户简要信息
async function dbUserBrief(userId: string) {
    try {
        const u = await dbService.getUserById(userId);
        return u ? { name: u.name, email: u.email } : null;
    } catch {
        return null;
    }
}
