// DA 校园大事件业务封装（多校）
// 唯一业务入口：学校 CRUD、按校 DA 系统账号、公开查询、管理 CRUD、队列审批、
// 每校 DA 邮箱管道（IMAP + NLP）、学生邮箱贡献（匿名化转投）、页面配置。
// 全部薄封装，内部复用 dbService / mcpTools / ImapClient / emailProcessor。

import { v4 as uuidv4 } from "uuid";
import { dbService } from "./dbService";
import { mcpTools } from "./mcp";
import { ImapClient, type ImapConfig } from "./imapClient";
import {
    processEmailWithLLM,
    type EmailForProcessing,
    type EmailProcessingResult,
} from "./emailProcessor";
import { findConflictingTasks } from "./scheduleConflict";
import { normalizeQueueScheduleArgs, parseQueueArgs } from "./queueArgs";
import { toShanghaiISO } from "../Utils/time.js";
import { logger } from "../Utils/logger.js";
import type { User, Task } from "../types/models";
import type { School } from "./db/schools";
import type { DaStudentOptin } from "./db/da";
import {
    DEFAULT_SETTINGS,
    isSystemAdmin as checkSystemAdmin,
    daAccountEmailFor,
    isSchoolWideCandidate,
} from "./daHelpers.js";

// ── 常量 ───────────────────────────────────────────────────────

const EVENT_CATEGORY = "school_event";

export interface DaPublicEvent {
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    location?: string;
    allDay?: boolean;
    category?: string;
}

export interface DaPageConfig {
    title: string;
    intro: string;
    contact: string;
    themeColor: string | null;
    eventsEmail: string | null;
    schoolName: string;
    slug: string;
}

export class DaService {
    /** schoolId -> DA 系统账号（进程内缓存，避免频繁查库） */
    private daAccountCache = new Map<string, User>();
    /** schoolId -> 已启动的 DA 邮箱 ImapClient */
    private imapClients = new Map<string, ImapClient>();

    // ── 权限 ────────────────────────────────────────────────────

    /** 系统管理员：现有 ADMIN_EMAILS（每次调用读取 env，便于测试注入） */
    isSystemAdmin(email: string): boolean {
        return checkSystemAdmin(email);
    }

    async isSchoolAdmin(schoolId: string, email: string): Promise<boolean> {
        if (this.isSystemAdmin(email)) return true;
        return dbService.isSchoolAdmin(schoolId, email);
    }

    /**
     * 学校 DA 管理员：school_admins 表 或 系统管理员。
     * 兼容旧环境变量：DA_ADMIN_EMAILS（单校兜底，授予全部学校）。
     */
    async isDaAdminForSchool(
        schoolId: string,
        email: string,
    ): Promise<boolean> {
        if (this.isSystemAdmin(email)) return true;
        const inTable = await dbService.isSchoolAdmin(schoolId, email);
        if (inTable) return true;
        const legacy = (process.env.DA_ADMIN_EMAILS || "")
            .split(",")
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);
        return legacy.length > 0 && legacy.includes((email || "").toLowerCase());
    }

    // ── 学校 ────────────────────────────────────────────────────

    async listSchools(opts?: { includeDisabled?: boolean }) {
        return dbService.listSchools(opts);
    }

    async listSchoolsByOptinUser(userId: string): Promise<DaStudentOptin[]> {
        return dbService.listSchoolsByOptinUser(userId);
    }

    async getSchoolBySlug(slug: string): Promise<School | null> {
        return dbService.getSchoolBySlug(slug);
    }

    async getSchoolById(id: string): Promise<School | null> {
        return dbService.getSchoolById(id);
    }

    async createSchool(input: {
        slug: string;
        name: string;
        eventsEmail?: string;
        themeColor?: string;
    }): Promise<School> {
        const slug = (input.slug || "").trim().toLowerCase();
        const name = (input.name || "").trim();
        if (!slug || !name) {
            throw new Error("学校 slug 与名称不能为空");
        }
        const existing = await dbService.getSchoolBySlug(slug);
        if (existing) {
            throw new Error(`slug 已存在: ${slug}`);
        }
        await dbService.createSchool({
            id: uuidv4(),
            slug,
            name,
            eventsEmail: input.eventsEmail,
            themeColor: input.themeColor,
        });
        const created = await dbService.getSchoolBySlug(slug);
        if (!created) throw new Error("创建学校失败");
        // 创建后立即预置 DA 系统账号（幂等）
        await this.ensureDaAccount(created);
        return created;
    }

    async updateSchool(
        id: string,
        patch: {
            slug?: string;
            name?: string;
            eventsEmail?: string | null;
            themeColor?: string | null;
            enabled?: boolean;
        },
    ): Promise<School | null> {
        if (patch.slug !== undefined) {
            const slug = patch.slug.trim().toLowerCase();
            const dup = await dbService.getSchoolBySlug(slug);
            if (dup && dup.id !== id) {
                throw new Error(`slug 已存在: ${slug}`);
            }
            patch.slug = slug;
        }
        const { enabled, ...rest } = patch;
        if (Object.keys(rest).length > 0) {
            await dbService.updateSchool(id, rest);
        }
        if (enabled !== undefined) {
            await dbService.setSchoolEnabled(id, enabled);
        }
        return dbService.getSchoolById(id);
    }

    async deleteSchool(id: string): Promise<boolean> {
        // 停用正在运行的邮箱轮询
        const client = this.imapClients.get(id);
        if (client) {
            try {
                await client.close();
            } catch {
                /* ignore */
            }
            this.imapClients.delete(id);
        }
        this.daAccountCache.delete(id);
        return dbService.deleteSchool(id);
    }

    // ── 学校 DA 管理员 ──────────────────────────────────────────

    async listSchoolAdmins(schoolId: string) {
        return dbService.listSchoolAdmins(schoolId);
    }

    /** 当前用户可管理的学校：系统管理员=全部；否则=school_admins 中的学校 */
    async listMySchools(email: string): Promise<School[]> {
        if (this.isSystemAdmin(email)) {
            return dbService.listSchools({ includeDisabled: true });
        }
        const all = await dbService.listSchools({ includeDisabled: true });
        const mine: School[] = [];
        for (const s of all) {
            if (await dbService.isSchoolAdmin(s.id, email)) mine.push(s);
        }
        return mine;
    }

    async addSchoolAdmin(schoolId: string, email: string) {
        return dbService.addSchoolAdmin(schoolId, email);
    }

    async removeSchoolAdmin(schoolId: string, email: string) {
        return dbService.removeSchoolAdmin(schoolId, email);
    }

    // ── DA 系统账号 ─────────────────────────────────────────────

    daAccountEmail(school: Pick<School, "slug">): string {
        return daAccountEmailFor(school.slug);
    }

    /** 懒创建该校 DA 系统账号（幂等，进程内缓存 + 数据库） */
    async ensureDaAccount(school: School): Promise<User> {
        const cached = this.daAccountCache.get(school.id);
        if (cached) return cached;

        const email = this.daAccountEmail(school);
        let daUser = await dbService.getUserByEmail(email);
        if (!daUser) {
            daUser = {
                id: uuidv4(),
                email,
                name: `${school.name} 校园大事件`,
                MSbinded: false,
                ebridgeBinded: false,
                timetableUrl: "",
                timetableFetchLevel: 0,
                mailReadingSpan: 30,
                tasks: [],
                onboardingCompleted: true,
                autoSchedulePromotions: false,
                stripReplyPrefix: true,
            };
            await dbService.addUser(daUser);
            logger.info(
                `DA 系统账号已创建: ${email} (school=${school.slug})`,
            );
        }
        this.daAccountCache.set(school.id, daUser);
        return daUser;
    }

    // ── 公开查询 ────────────────────────────────────────────────

    async listPublicEvents(
        school: School,
        opts?: { start?: string; end?: string },
    ): Promise<DaPublicEvent[]> {
        const daUser = await this.ensureDaAccount(school);
        const tasks = await dbService.getTasksByUserId(daUser.id);
        const start = opts?.start ? new Date(opts.start).getTime() : null;
        const end = opts?.end ? new Date(opts.end).getTime() : null;
        return tasks
            .filter((t) => {
                if ((t.visibility || "private") !== "public") return false;
                if (t.archivedAt) return false;
                if (!t.startTime) return false;
                const ts = new Date(t.startTime).getTime();
                if (start !== null && ts < start) return false;
                if (end !== null && ts > end) return false;
                return true;
            })
            .map((t) => this.toPublicEvent(t))
            .sort((a, b) =>
                (a.startTime || "").localeCompare(b.startTime || ""),
            );
    }

    async getPublicEvent(
        school: School,
        id: string,
    ): Promise<DaPublicEvent | null> {
        const daUser = await this.ensureDaAccount(school);
        const task = await dbService.getTaskById(id);
        if (!task || (task as any).userId !== daUser.id) return null;
        if ((task.visibility || "private") !== "public") return null;
        if (task.archivedAt) return null;
        return this.toPublicEvent(task);
    }

    private toPublicEvent(t: Task): DaPublicEvent {
        return {
            id: t.id,
            name: t.name,
            description: t.description || "",
            startTime: t.startTime,
            endTime: t.endTime,
            location: t.location,
            allDay: !!t.allDay,
            category: t.category,
        };
    }

    // ── 管理 CRUD ───────────────────────────────────────────────

    async listAllEvents(school: School): Promise<Task[]> {
        const daUser = await this.ensureDaAccount(school);
        const tasks = await dbService.getTasksByUserId(daUser.id);
        return tasks
            .filter((t) => !t.archivedAt)
            .sort((a, b) =>
                (a.startTime || "").localeCompare(b.startTime || ""),
            );
    }

    async createEvent(
        school: School,
        input: {
            name: string;
            description?: string;
            startTime?: string;
            endTime?: string;
            location?: string;
            allDay?: boolean;
            category?: string;
            recurrenceRule?: string;
            importance?: "high" | "normal" | "low";
        },
    ): Promise<Task> {
        const daUser = await this.ensureDaAccount(school);
        if (!input.name || !input.name.trim()) {
            throw new Error("事件名称不能为空");
        }
        const task: Task = {
            id: uuidv4(),
            name: input.name.trim(),
            description: input.description || "",
            dueDate: "",
            startTime: input.startTime || "",
            endTime: input.endTime || "",
            location: input.location || "",
            completed: false,
            pushedToMSTodo: false,
            eventType: "schedule",
            category: input.category || EVENT_CATEGORY,
            allDay: !!input.allDay,
            importance: input.importance || "normal",
            scheduleType: "single",
            recurrenceRule: input.recurrenceRule,
            visibility: "public",
        };
        await dbService.addTask(daUser.id, task, false, true);
        return task;
    }

    async updateEvent(
        school: School,
        id: string,
        patch: Partial<Task> & {
            name?: string;
            description?: string;
            startTime?: string;
            endTime?: string;
            location?: string;
            allDay?: boolean;
            category?: string;
            recurrenceRule?: string;
        },
    ): Promise<Task> {
        const daUser = await this.ensureDaAccount(school);
        const existing = await dbService.getTaskById(id);
        if (!existing || (existing as any).userId !== daUser.id) {
            throw new Error("事件不存在");
        }
        const updates: Partial<Task> = { ...patch };
        // 强制公开 + 固定分类
        updates.visibility = "public";
        updates.category = patch.category || EVENT_CATEGORY;
        if (patch.name !== undefined && !patch.name.trim()) {
            throw new Error("事件名称不能为空");
        }
        const updated = await dbService.patchTask(
            daUser.id,
            id,
            updates,
            false,
            true,
        );
        return updated;
    }

    async deleteEvent(school: School, id: string): Promise<boolean> {
        const daUser = await this.ensureDaAccount(school);
        const existing = await dbService.getTaskById(id);
        if (!existing || (existing as any).userId !== daUser.id) {
            throw new Error("事件不存在");
        }
        return dbService.deleteTask(id);
    }

    // ── 队列审批 ────────────────────────────────────────────────

    async getQueue(school: School): Promise<{
        schedule: any[];
        todo: any[];
    }> {
        const daUser = await this.ensureDaAccount(school);
        const [schedule, todo] = await Promise.all([
            dbService.getScheduleQueueByUser(daUser.id),
            dbService.getTodoQueueByUser(daUser.id),
        ]);
        return { schedule, todo };
    }

    async approveQueueItem(
        school: School,
        queueId: string,
        opts?: { allowConflict?: boolean },
    ): Promise<{ ok: boolean; task?: Task; todo?: any; error?: string; conflict?: boolean; conflicts?: any[] }> {
        const daUser = await this.ensureDaAccount(school);

        const sRow = await dbService.getScheduleQueueById(queueId);
        if (sRow) {
            if (sRow.userId !== daUser.id) {
                return { ok: false, error: "无权审批该校队列项" };
            }
            const args = normalizeQueueScheduleArgs(parseQueueArgs(sRow));
            if (
                !opts?.allowConflict &&
                args.startTime &&
                args.endTime &&
                !args.recurrenceRule
            ) {
                const { tasks: existing } = await dbService.getTasksPage(
                    daUser.id,
                    {
                        start: args.startTime,
                        end: args.endTime,
                        limit: 200,
                    },
                );
                const conflicts = findConflictingTasks(
                    existing,
                    {
                        id: "new-task",
                        startTime: args.startTime,
                        endTime: args.endTime,
                    },
                    { boundaryConflict: false },
                );
                if (conflicts.length > 0) {
                    return {
                        ok: false,
                        conflict: true,
                        conflicts,
                        error: "日程冲突",
                    };
                }
            }
            const result = await mcpTools.add_schedule.execute(
                {
                    ...args,
                    _internal_approve: true,
                    _internal_allow_conflict: opts?.allowConflict === true,
                },
                daUser,
            );
            const task = (result as any)?.task;
            if (!task?.id) {
                const text = Array.isArray((result as any)?.content)
                    ? (result as any).content
                          .find((c: any) => c?.type === "text")
                          ?.text
                    : undefined;
                return { ok: false, error: text || "审批失败" };
            }
            try {
                await dbService.deleteScheduleQueueItem(queueId);
            } catch {
                await dbService.updateScheduleQueueStatus(queueId, "approved");
            }
            return { ok: true, task };
        }

        const tRow = await dbService.getTodoQueueById(queueId);
        if (tRow) {
            if (tRow.userId !== daUser.id) {
                return { ok: false, error: "无权审批该校队列项" };
            }
            const args = parseQueueArgs(tRow);
            const result = await mcpTools.add_todo.execute(
                { ...args, _internal_approve: true },
                daUser,
            );
            const todo = (result as any)?.todo;
            if (!todo?.id) {
                const text = Array.isArray((result as any)?.content)
                    ? (result as any).content
                          .find((c: any) => c?.type === "text")
                          ?.text
                    : undefined;
                return { ok: false, error: text || "审批失败" };
            }
            try {
                await dbService.deleteTodoQueueItem(queueId);
            } catch {
                await dbService.updateTodoQueueStatus(queueId, "approved");
            }
            return { ok: true, todo };
        }

        return { ok: false, error: "队列项不存在" };
    }

    async rejectQueueItem(school: School, queueId: string): Promise<{ ok: boolean; error?: string }> {
        const daUser = await this.ensureDaAccount(school);
        const sRow = await dbService.getScheduleQueueById(queueId);
        if (sRow) {
            if (sRow.userId !== daUser.id) {
                return { ok: false, error: "无权审批该校队列项" };
            }
            try {
                await dbService.addRejectionBufferItem(
                    daUser.id,
                    "schedule",
                    sRow.rawRequest,
                    queueId,
                );
            } catch (e) {
                logger.warn("DA 日程拒绝写入缓冲池失败", e);
            }
            try {
                await dbService.deleteScheduleQueueItem(queueId);
            } catch {
                await dbService.updateScheduleQueueStatus(queueId, "rejected");
            }
            return { ok: true };
        }
        const tRow = await dbService.getTodoQueueById(queueId);
        if (tRow) {
            if (tRow.userId !== daUser.id) {
                return { ok: false, error: "无权审批该校队列项" };
            }
            try {
                await dbService.addRejectionBufferItem(
                    daUser.id,
                    "todo",
                    tRow.rawRequest,
                    queueId,
                );
            } catch (e) {
                logger.warn("DA 待办拒绝写入缓冲池失败", e);
            }
            try {
                await dbService.deleteTodoQueueItem(queueId);
            } catch {
                await dbService.updateTodoQueueStatus(queueId, "rejected");
            }
            return { ok: true };
        }
        return { ok: false, error: "队列项不存在" };
    }

    // ── 设置 / 页面配置 ─────────────────────────────────────────

    /** 合并默认值 + 存储值；邮箱密码仅在显式请求时返回（默认掩码） */
    async getSettings(
        school: School,
        opts?: { revealPassword?: boolean },
    ): Promise<Record<string, string>> {
        const stored = await dbService.getAllDaSettings(school.id);
        const merged: Record<string, string> = {
            ...DEFAULT_SETTINGS,
            ...stored,
        };
        if (merged.mailPassword && !opts?.revealPassword) {
            merged.mailPassword = "••••••••";
        }
        return merged;
    }

    async updateSettings(
        school: School,
        patch: Record<string, string | number | boolean>,
    ): Promise<void> {
        for (const [key, raw] of Object.entries(patch)) {
            if (!(key in DEFAULT_SETTINGS)) continue;
            const value = String(raw);
            // 密码掩码回显值不允许写回
            if (key === "mailPassword" && value === "••••••••") continue;
            await dbService.setDaSetting(school.id, key, value);
        }
    }

    async getPageConfig(school: School): Promise<DaPageConfig> {
        const settings = await this.getSettings(school);
        return {
            title: settings.pageTitle || school.name,
            intro: settings.pageIntro,
            contact: settings.pageContact || school.eventsEmail || "",
            themeColor: school.themeColor,
            eventsEmail: school.eventsEmail,
            schoolName: school.name,
            slug: school.slug,
        };
    }

    async updatePageConfig(
        school: School,
        patch: {
            title?: string;
            intro?: string;
            contact?: string;
            themeColor?: string | null;
            eventsEmail?: string | null;
        },
    ): Promise<void> {
        const settingsPatch: Record<string, string> = {};
        if (patch.title !== undefined) settingsPatch.pageTitle = patch.title;
        if (patch.intro !== undefined) settingsPatch.pageIntro = patch.intro;
        if (patch.contact !== undefined)
            settingsPatch.pageContact = patch.contact;
        if (Object.keys(settingsPatch).length > 0) {
            await this.updateSettings(school, settingsPatch);
        }
        const schoolPatch: {
            themeColor?: string | null;
            eventsEmail?: string | null;
        } = {};
        if (patch.themeColor !== undefined)
            schoolPatch.themeColor = patch.themeColor;
        if (patch.eventsEmail !== undefined)
            schoolPatch.eventsEmail = patch.eventsEmail;
        if (Object.keys(schoolPatch).length > 0) {
            await dbService.updateSchool(school.id, schoolPatch);
        }
    }

    // ── 手动导入（DA 粘贴学院邮件/文字 → NLP → 入队）──────────

    async importText(school: School, text: string): Promise<EmailProcessingResult> {
        const daUser = await this.ensureDaAccount(school);
        const lines = (text || "")
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);
        const subject = lines[0]?.slice(0, 120) || "手动导入";
        const email: EmailForProcessing = {
            id: `da-manual-${uuidv4()}`,
            subject,
            from: { name: "DA 手动导入", address: "manual@internal" },
            receivedAt: toShanghaiISO(),
            isRead: true,
            body: text,
        };
        return processEmailWithLLM(daUser, email, "da-manual-import");
    }

    // ── 每校 DA 邮箱管道 ────────────────────────────────────────

    /**
     * 启动/复用该校 DA 邮箱轮询（IMAP IDLE + 首次历史拉取）。
     * 幂等：已启动则跳过；邮箱未配置/未启用则跳过。连接失败仅记日志。
     */
    async syncDaMailbox(school: School): Promise<void> {
        if (!school || school.enabled === 0 || school.enabled === false) return;
        if (this.imapClients.has(school.id)) return;

        const settings = await this.getSettings(school, {
            revealPassword: true,
        });
        if (settings.mailEnabled !== "1") return;
        const host = settings.mailHost;
        const username = settings.mailUsername;
        const password = settings.mailPassword;
        if (!host || !username || !password) return;

        const config: ImapConfig = {
            host,
            port: parseInt(settings.mailPort || "993", 10),
            tls: settings.mailTls !== "0",
            username,
            password,
        };

        const client = new ImapClient(config);
        this.imapClients.set(school.id, client);
        const daUser = await this.ensureDaAccount(school);

        client
            .startIdle(async (fullEmail: any) => {
                await this.processDaEmail(school, daUser, fullEmail);
            })
            .catch((err: any) => {
                this.imapClients.delete(school.id);
                logger.error(
                    `DA 邮箱 IMAP 启动失败 (${school.slug}): ${err?.message || err}`,
                );
            });

        // 首次连接拉取最近邮件（与 intervals per-user 逻辑同构）
        try {
            const emails = await client.findEmails(30);
            for (const email of emails) {
                await this.processDaEmail(school, daUser, email);
            }
        } catch (err: any) {
            logger.warn(
                `DA 邮箱首次拉取失败 (${school.slug}): ${err?.message || err}`,
            );
        }
    }

    /** 手动重连：关闭现有连接后重新同步 */
    async refreshDaMail(school: School): Promise<void> {
        const client = this.imapClients.get(school.id);
        if (client) {
            try {
                await client.close();
            } catch {
                /* ignore */
            }
            this.imapClients.delete(school.id);
        }
        await this.syncDaMailbox(school);
    }

    async stopDaMail(schoolId: string): Promise<void> {
        const client = this.imapClients.get(schoolId);
        if (client) {
            try {
                await client.close();
            } catch {
                /* ignore */
            }
            this.imapClients.delete(schoolId);
        }
    }

    private async processDaEmail(
        school: School,
        daUser: User,
        email: any,
    ): Promise<void> {
        if (!email?.id) return;
        const already = await dbService.isEmailAiProcessed(
            daUser.id,
            String(email.id),
            "da-mailbox",
        );
        if (already) return;
        try {
            await processEmailWithLLM(
                daUser,
                email as EmailForProcessing,
                "da-mailbox",
            );
            logger.info(
                `DA 邮箱新邮件已处理 (${school.slug}): ${email.subject}`,
            );
        } catch (err: any) {
            logger.error(
                `DA 邮箱邮件处理失败 (${school.slug}): ${err?.message || err}`,
            );
        }
    }

    // ── 学生贡献（需求 4）───────────────────────────────────────

    async getOptin(schoolId: string, userId: string): Promise<boolean> {
        const row = await dbService.getDaOptin(schoolId, userId);
        return !!row && row.optedIn === 1;
    }

    async setOptin(
        schoolId: string,
        userId: string,
        optedIn: boolean,
    ): Promise<void> {
        await dbService.setDaOptin(schoolId, userId, optedIn);
    }

    async listStudents(
        schoolId: string,
        opts?: { limit?: number; offset?: number },
    ): Promise<{ rows: DaStudentOptin[]; total: number }> {
        return dbService.listDaOptins(schoolId, opts);
    }

    /**
     * processEmailWithLLM 的 onProcessed 钩子目标：
     * 学生邮件被 NLP 后，若命中启发式（发件域∈学院白名单 或 主题含事件关键词），
     * 匿名化转投该校 DA 审批队列（不含学生邮箱/姓名）。
     */
    async ingestStudentCandidate(ctx: {
        user: User;
        email: EmailForProcessing;
        result: EmailProcessingResult;
    }): Promise<void> {
        const { user, email, result } = ctx;
        if (!result.toolCallsTriggered || !result.extracted?.length) return;

        const optins = await dbService.listSchoolsByOptinUser(user.id);
        if (optins.length === 0) return;

        for (const optin of optins) {
            const school = await dbService.getSchoolById(optin.schoolId);
            if (!school || school.enabled === 0 || school.enabled === false)
                continue;
            const settings = await this.getSettings(school, {
                revealPassword: true,
            });
            if (settings.studentContributionEnabled !== "1") continue;
            if (!this.looksSchoolWide(email, settings)) continue;

            const daUser = await this.ensureDaAccount(school);
            for (const item of result.extracted) {
                if (
                    item.toolName !== "add_schedule" &&
                    item.toolName !== "add_todo"
                ) {
                    continue;
                }
                const args = { ...item.args };
                if (!args.name) args.name = email.subject;
                args.description =
                    (args.description
                        ? String(args.description) + "\n"
                        : "") + `来源: 学生邮件贡献 (${email.subject})`;
                const rawRequest = JSON.stringify({
                    args,
                    _meta: {
                        source: "student-contribution",
                        createdAt: toShanghaiISO(),
                        contributorId: user.id,
                    },
                });
                if (item.toolName === "add_schedule") {
                    await dbService.addScheduleToQueue(
                        daUser.id,
                        rawRequest,
                    );
                } else {
                    await dbService.addTodoToQueue(daUser.id, rawRequest);
                }
                logger.info(
                    `学生贡献事件已转投 ${school.slug} DA 队列: ${args.name}`,
                );
            }
        }
    }

    /** 轻量启发式：发件域∈学院白名单 或 主题含事件关键词 */
    private looksSchoolWide(
        email: EmailForProcessing,
        settings: Record<string, string>,
    ): boolean {
        return isSchoolWideCandidate(email, settings);
    }
}

export const daService = new DaService();
