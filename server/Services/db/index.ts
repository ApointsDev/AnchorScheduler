// 数据库服务入口 — 组合所有子模块，保持向后兼容的 API
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import type { Database } from "sqlite";
import { logger } from "../../Utils/logger.js";
import type { User, Task } from "../../index";

// ── 共享类型 ─────────────────────────────────────────────────

export interface LogEntry {
    id: string;
    time: string;
    type: string;
    message: string;
    payload?: unknown;
}

export interface TaskPageOpts {
    start?: string;
    end?: string;
    q?: string;
    completed?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    /** 为 true 时包含已归档数据；默认仅返回未归档 */
    includeArchived?: boolean;
}

export interface OccurrencePageOpts {
    limit?: number;
    offset?: number;
    sortBy?: string;
    order?: "asc" | "desc";
}

export interface LogPageOpts {
    limit?: number;
    offset?: number;
    since?: string;
    until?: string;
    type?: string;
}

export interface CalendarEventMapEntry {
    userId: string;
    provider: string;
    localTaskId: string;
    remoteUid?: string;
    remoteHref?: string;
    remoteEtag?: string;
    calendarUrl?: string;
    rawData?: string;
}

export interface SharedScheduleData {
    id: string;
    userId: string;
    token: string;
    name: string;
    dateStart?: string;
    dateEnd?: string;
    taskIds?: string;
    expiresAt?: string;
}

export interface RefreshUserTasksOpts {
    addedIds?: string[];
    updatedIds?: string[];
    deletedIds?: string[];
}
import { runMigrations } from "./migrations";
import { UserStore } from "./users";
import { TaskStore } from "./tasks";
import { UserLogStore } from "./userLogs";
import { AdminStore } from "./admin";
import { EmailAiStore } from "./emailAi";
import { CalendarEventMapStore } from "./calendarEventMap";
import { ScheduleQueueStore } from "./scheduleQueue";
import { TodoQueueStore } from "./todoQueue";
import { ChatContextStore } from "./chatContext";
import { SharedScheduleStore } from "./sharedSchedule";
import { TagStore } from "./tags";
import { TodoStore } from "./todos";
import { UserStatusStore } from "./userStatus";
import { UserStatusLayoutStore } from "./userStatusLayout";
import { CommunityStore } from "./community";
import {
    RejectionBufferStore,
    type RejectionKind,
    type RejectionListOpts,
} from "./rejectionBuffer";
import { ChaoxingItemMapStore } from "./chaoxingItemMap";
import { FollowStore, type FollowListResult, type FollowUserInfo } from "./follows";
import { ReminderStateStore } from "./reminderStates";
import { ArchiveStore } from "./archive";
import type { TodoPageOpts } from "./todos";
import type {
    CommunityRankMetric,
    UserHomepage,
} from "../../types/models";

export type { TodoPageOpts };
export type { RejectionKind, RejectionListOpts };

export class DatabaseService {
    private db: Database | null = null;

    // 子模块实例（初始化后可用）
    users!: UserStore;
    tasks!: TaskStore;
    logs!: UserLogStore;
    admin!: AdminStore;
    emailAi!: EmailAiStore;
    calendarEventMap!: CalendarEventMapStore;
    scheduleQueue!: ScheduleQueueStore;
    todoQueue!: TodoQueueStore;
    chatContext!: ChatContextStore;
    sharedSchedule!: SharedScheduleStore;
    tags!: TagStore;
    todos!: TodoStore;
    userStatus!: UserStatusStore;
    userStatusLayout!: UserStatusLayoutStore;
    community!: CommunityStore;
    rejectionBuffer!: RejectionBufferStore;
    chaoxingItemMap!: ChaoxingItemMapStore;
    follows!: FollowStore;
    reminderStates!: ReminderStateStore;
    archive!: ArchiveStore;

    async initialize() {
        try {
            const dbPath = process.env.WEBSITE_INSTANCE_ID
                ? "/home/data/users.db"
                : "./private/users.db";

            logger.info(`Initializing database at path: ${dbPath}`);

            this.db = await open({
                filename: dbPath,
                driver: sqlite3.Database,
            });

            // 启用外键（todo_tags CASCADE 等依赖）
            await this.db.exec("PRAGMA foreign_keys = ON");

            await runMigrations(this.db);

            // 初始化子模块（依赖注入）
            this.logs = new UserLogStore(this.db);
            this.userStatus = new UserStatusStore(this.db);
            this.userStatusLayout = new UserStatusLayoutStore(this.db);
            this.community = new CommunityStore(this.db, this.userStatus);
            await this.community.ensureDefaultRegions();
            this.tasks = new TaskStore(
                this.db,
                (userId, type, msg, payload) =>
                    this.logs.add(userId, type, msg, payload),
                (userId) => this.userStatus.invalidate(userId),
            );
            this.users = new UserStore(this.db);
            this.admin = new AdminStore(this.db);
            this.emailAi = new EmailAiStore(this.db);
            this.calendarEventMap = new CalendarEventMapStore(this.db);
            this.scheduleQueue = new ScheduleQueueStore(this.db);
            this.todoQueue = new TodoQueueStore(this.db);
            this.chatContext = new ChatContextStore(this.db);
            this.sharedSchedule = new SharedScheduleStore(this.db);
            this.tags = new TagStore(this.db);
            this.todos = new TodoStore(
                this.db,
                this.tags,
                (userId, type, msg, payload) =>
                    this.logs.add(userId, type, msg, payload),
            );
            this.rejectionBuffer = new RejectionBufferStore(this.db);
            this.chaoxingItemMap = new ChaoxingItemMapStore(this.db);
            this.follows = new FollowStore(this.db);
            this.reminderStates = new ReminderStateStore(this.db);
            this.archive = new ArchiveStore(
                this.db,
                this.tasks,
                this.todos,
                this.tags,
            );

            logger.success("Database initialized successfully");
        } catch (error) {
            logger.error("Failed to initialize database:", error);
            throw error;
        }
    }

    // ── 向后兼容的代理方法 ──

    // User Logs
    setLogListener(listener: (userId: string, log: LogEntry) => void) {
        this.logs.setLogListener(listener);
    }
    async addUserLog(
        userId: string,
        type: string,
        message: string,
        payload?: unknown,
    ) {
        return this.logs.add(userId, type, message, payload);
    }
    async getUserLogsPage(userId: string, opts?: LogPageOpts) {
        return this.logs.getPage(userId, opts);
    }

    // Users
    async addUser(user: User) {
        await this.users.addUser(user);
        for (const task of user.tasks || []) {
            await this.tasks.addTask(user.id, task);
        }
    }
    async updateUser(user: User) {
        return this.users.updateUser(user);
    }
    async getUserById(id: string) {
        return this.users.getUserById(id, (uid) =>
            this.tasks.getTasksByUserId(uid),
        );
    }
    async getUserByEmail(email: string) {
        return this.users.getUserByEmail(email, (uid) =>
            this.tasks.getTasksByUserId(uid),
        );
    }
    async getUserByCafSub(cafSub: string) {
        return this.users.getUserByCafSub(cafSub, (uid) =>
            this.tasks.getTasksByUserId(uid),
        );
    }
    async getAllUsers() {
        return this.users.getAllUsers((uid) =>
            this.tasks.getTasksByUserId(uid),
        );
    }
    async updateUserHighEnergyPeriods(
        userId: string,
        periods: Record<
            number,
            { startHour: number; endHour: number; score: number }[]
        >,
    ) {
        return this.users.updateUserHighEnergyPeriods(userId, periods);
    }
    async updateUserAvatar(userId: string, avatar: string | null) {
        return this.users.updateAvatar(userId, avatar);
    }
    async updateUserSignature(userId: string, signature: string | null) {
        return this.users.updateSignature(userId, signature);
    }
    async getUserPublicProfile(userId: string) {
        return this.users.getPublicProfile(userId);
    }
    async updateUserChaoxingFields(
        userId: string,
        fields: Parameters<UserStore["updateChaoxingFields"]>[1],
    ) {
        return this.users.updateChaoxingFields(userId, fields);
    }

    async getChaoxingItemMapStore(): Promise<ChaoxingItemMapStore> {
        return this.chaoxingItemMap;
    }

    // Tasks
    async addTask(
        userId: string,
        task: Task,
        boundaryConflict?: boolean,
        allowConflict?: boolean,
    ) {
        return this.tasks.addTask(
            userId,
            task,
            boundaryConflict,
            allowConflict,
        );
    }
    async updateTask(
        task: Task,
        boundaryConflict?: boolean,
        allowConflict?: boolean,
    ) {
        return this.tasks.updateTask(task, boundaryConflict, allowConflict);
    }
    async patchTask(
        userId: string,
        taskId: string,
        updates: Partial<Task>,
        boundaryConflict?: boolean,
        allowConflict?: boolean,
    ) {
        return this.tasks.patchTask(
            userId,
            taskId,
            updates,
            boundaryConflict,
            allowConflict,
        );
    }
    async getTasksByUserId(userId: string) {
        return this.tasks.getTasksByUserId(userId);
    }
    async getTasksPage(userId: string, opts?: TaskPageOpts) {
        return this.tasks.getTasksPage(userId, opts);
    }
    async getOccurrencesPage(
        userId: string,
        rootTaskId: string,
        opts?: OccurrencePageOpts,
    ) {
        return this.tasks.getOccurrencesPage(userId, rootTaskId, opts);
    }
    async getTaskById(id: string) {
        return this.tasks.getTaskById(id);
    }
    async getTasksByIds(userId: string, ids: string[]) {
        return this.tasks.getTasksByIds(userId, ids);
    }
    async getVisibleTasksByUserId(targetUserId: string, viewerUserId: string) {
        return this.tasks.getVisibleTasksByUserId(targetUserId, viewerUserId);
    }
    async deleteTask(id: string) {
        return this.tasks.deleteTask(id);
    }
    async deleteTasksByPattern(userId: string, pattern: string) {
        return this.tasks.deleteTasksByPattern(userId, pattern);
    }
    async refreshUserTasks(user: { id: string; tasks?: Task[] }) {
        const tasks = await this.tasks.getTasksByUserId(user.id);
        user.tasks = tasks;
    }
    async refreshUserTasksIncremental(
        user: { id: string; tasks?: Task[] },
        opts?: RefreshUserTasksOpts,
    ) {
        user.tasks = user.tasks || [];
        if (opts?.deletedIds && opts.deletedIds.length > 0) {
            const delSet = new Set(opts.deletedIds);
            user.tasks = user.tasks.filter((t: Task) => !delSet.has(t.id));
        }
        const fetchIds: string[] = [];
        if (opts?.addedIds) fetchIds.push(...opts.addedIds);
        if (opts?.updatedIds) fetchIds.push(...opts.updatedIds);
        const uniqueFetchIds = Array.from(new Set(fetchIds));
        if (uniqueFetchIds.length > 0) {
            const rows = await this.tasks.getTasksByIds(
                user.id,
                uniqueFetchIds,
            );
            for (const r of rows) {
                const idx = user.tasks.findIndex((t: Task) => t.id === r.id);
                if (idx >= 0) {
                    user.tasks[idx] = r;
                } else {
                    user.tasks.push(r);
                }
            }
        }
    }

    // Admin
    async adminUpdateUserFields(
        userId: string,
        updates: Record<string, unknown>,
    ) {
        return this.admin.updateUserFields(userId, updates);
    }
    async deleteUser(userId: string) {
        return this.admin.deleteUser(userId);
    }

    // Email AI
    async markEmailAiProcessed(
        userId: string,
        emailId: string,
        provider?: string,
    ) {
        return this.emailAi.markProcessed(userId, emailId, provider);
    }
    async isEmailAiProcessed(
        userId: string,
        emailId: string,
        provider?: string,
    ) {
        return this.emailAi.isProcessed(userId, emailId, provider);
    }
    async getAiProcessedEmailIds(userId: string) {
        return this.emailAi.getProcessedIds(userId);
    }
    async deleteAiProcessedEmail(userId: string, emailId: string) {
        return this.emailAi.deleteProcessed(userId, emailId);
    }

    // Calendar Event Map
    async getCalendarEventMapByLocalId(
        userId: string,
        provider: string,
        localTaskId: string,
    ) {
        return this.calendarEventMap.getByLocalId(
            userId,
            provider,
            localTaskId,
        );
    }
    async getCalendarEventMapByRemoteUid(
        userId: string,
        provider: string,
        remoteUid: string,
    ) {
        return this.calendarEventMap.getByRemoteUid(
            userId,
            provider,
            remoteUid,
        );
    }
    async upsertCalendarEventMap(entry: CalendarEventMapEntry) {
        return this.calendarEventMap.upsert(entry);
    }
    async deleteCalendarEventMapByLocalId(
        userId: string,
        provider: string,
        localTaskId: string,
    ) {
        return this.calendarEventMap.deleteByLocalId(
            userId,
            provider,
            localTaskId,
        );
    }

    // Schedule Queue
    async getScheduleQueueByUser(userId: string) {
        return this.scheduleQueue.getByUser(userId);
    }
    async getScheduleQueueById(id: string) {
        return this.scheduleQueue.getById(id);
    }
    async updateScheduleQueueStatus(id: string, status: string) {
        return this.scheduleQueue.updateStatus(id, status);
    }
    async deleteScheduleQueueItem(id: string) {
        return this.scheduleQueue.delete(id);
    }
    async addScheduleToQueue(userId: string, rawRequest: string) {
        return this.scheduleQueue.add(userId, rawRequest);
    }

    // Todo Queue
    async getTodoQueueByUser(userId: string) {
        return this.todoQueue.getByUser(userId);
    }
    async getTodoQueueById(id: string) {
        return this.todoQueue.getById(id);
    }
    async updateTodoQueueStatus(id: string, status: string) {
        return this.todoQueue.updateStatus(id, status);
    }
    async deleteTodoQueueItem(id: string) {
        return this.todoQueue.delete(id);
    }
    async addTodoToQueue(userId: string, rawRequest: string) {
        return this.todoQueue.add(userId, rawRequest);
    }

    // Chat Context
    async getChatContexts(userId: string) {
        return this.chatContext.listContexts(userId);
    }
    async createChatContext(userId: string) {
        return this.chatContext.create(userId);
    }
    async getChatContext(contextId: string) {
        return this.chatContext.getMessages(contextId);
    }
    async deleteChatContext(contextId: string) {
        return this.chatContext.delete(contextId);
    }
    async getChatHistory(userId: string) {
        return this.chatContext.getActiveHistory(userId);
    }
    async saveChatHistory(
        userId: string,
        messagesJson: string,
        contextId?: string,
    ) {
        return this.chatContext.save(userId, messagesJson, contextId);
    }

    // Shared Schedule
    async createSharedSchedule(data: SharedScheduleData) {
        return this.sharedSchedule.create(data);
    }
    async getSharedScheduleByToken(token: string) {
        return this.sharedSchedule.getByToken(token);
    }
    async getSharedSchedulesByUser(userId: string) {
        return this.sharedSchedule.listByUser(userId);
    }
    async deleteSharedSchedule(token: string, userId: string) {
        return this.sharedSchedule.delete(token, userId);
    }

    // Tags
    async listTags(userId: string, opts?: { includeArchived?: boolean }) {
        return this.tags.listByUser(userId, opts);
    }
    async getTagById(userId: string, tagId: string) {
        return this.tags.getById(userId, tagId);
    }
    async createTag(
        userId: string,
        input: { name: string; color?: string; id?: string },
    ) {
        return this.tags.create(userId, input);
    }
    async updateTag(
        userId: string,
        tagId: string,
        updates: { name?: string; color?: string | null },
    ) {
        return this.tags.update(userId, tagId, updates);
    }
    async deleteTag(userId: string, tagId: string) {
        return this.tags.delete(userId, tagId);
    }

    // Todos
    async getTodoById(userId: string, todoId: string) {
        return this.todos.getById(userId, todoId);
    }
    async createTodo(
        userId: string,
        input: {
            name: string;
            description?: string;
            completed?: boolean;
            dueDate?: string;
            importance?: string;
            importanceScore?: number | null;
            urgencyScore?: number | null;
            tagIds?: string[];
            tagNames?: string[];
            id?: string;
        },
    ) {
        return this.todos.create(userId, input);
    }
    async updateTodo(
        userId: string,
        todoId: string,
        updates: {
            name?: string;
            description?: string | null;
            completed?: boolean;
            dueDate?: string | null;
            importance?: string;
            importanceScore?: number | null;
            urgencyScore?: number | null;
            tagIds?: string[];
            tagNames?: string[];
            replaceTags?: boolean;
        },
    ) {
        return this.todos.update(userId, todoId, updates);
    }
    async deleteTodo(userId: string, todoId: string) {
        return this.todos.delete(userId, todoId);
    }
    async getTodosPage(userId: string, opts?: TodoPageOpts) {
        return this.todos.getPage(userId, opts);
    }
    async getTodosByTagId(
        userId: string,
        tagId: string,
        opts?: Omit<TodoPageOpts, "tagIds" | "tagNames">,
    ) {
        return this.todos.getByTagId(userId, tagId, opts);
    }

    // ── 归档（ARC-001）──
    async listArchived(userId: string) {
        return this.archive.listArchived(userId);
    }
    async archiveResource(
        resource: string,
        id: string,
        userId: string,
        now?: Date,
    ) {
        return this.archive.archive(resource, id, userId, now);
    }
    async restoreResource(
        resource: string,
        id: string,
        userId: string,
        now?: Date,
    ) {
        return this.archive.restore(resource, id, userId, now);
    }
    async deleteArchivedResource(
        resource: string,
        id: string,
        userId: string,
    ) {
        return this.archive.deleteArchived(resource, id, userId);
    }
    /** 自动归档（可注入时钟，测试用） */
    async autoArchiveTags(now?: Date, thresholdMonths?: number) {
        return this.archive.autoArchiveTags(now, thresholdMonths);
    }

    // User Status
    async getUserStatus(
        userId: string,
        opts?: { fresh?: boolean; now?: Date },
    ) {
        return this.userStatus.getStatus(userId, opts);
    }
    async getUserStatusLayout(userId: string) {
        return this.userStatusLayout.get(userId);
    }
    async saveUserStatusLayout(userId: string, layout: unknown) {
        return this.userStatusLayout.save(
            userId,
            layout as import("./userStatusLayout").UserStatusLayoutRecord,
        );
    }
    async invalidateUserStatus(userId: string) {
        return this.userStatus.invalidate(userId);
    }

    // Community rankings
    async listCommunityRegions() {
        return this.community.listRegions();
    }
    async createCommunityRegion(name: string) {
        return this.community.createRegion(name);
    }
    async getUserCommunityRegion(userId: string) {
        const id = await this.community.getUserRegionId(userId);
        if (!id) return null;
        return this.community.getRegionById(id);
    }
    async setUserCommunityRegion(userId: string, regionId: string) {
        return this.community.setUserRegion(userId, regionId);
    }
    async getCommunityRanking(
        userId: string,
        metric: CommunityRankMetric,
        opts?: {
            fresh?: boolean;
            limit?: number;
            now?: Date;
            regionId?: string;
        },
    ) {
        return this.community.getRanking(userId, metric, opts);
    }
    /** 本社区四指标 topN（默认 100）：时间利用率 / 日程清爽度 / 执行效率 / 早鸟指数 */
    async getAllCommunityRankings(
        userId: string,
        opts?: {
            fresh?: boolean;
            limit?: number;
            now?: Date;
            regionId?: string;
        },
    ) {
        return this.community.getAllRankings(userId, opts);
    }

    /**
     * 用户个人主页：公开资料 + 本周状态 + 社区称号
     * 不暴露邮箱、凭证、日程明细。
     */
    async getUserHomepage(
        targetUserId: string,
        viewerUserId: string,
        opts?: { fresh?: boolean; now?: Date },
    ): Promise<UserHomepage | null> {
        const pub = await this.users.getPublicProfile(targetUserId);
        if (!pub) return null;

        const status = await this.userStatus.getStatus(targetUserId, {
            fresh: opts?.fresh,
            now: opts?.now,
        });

        const { region, titles } =
            await this.community.getUserTitleSummaries(targetUserId, {
                fresh: opts?.fresh,
                now: opts?.now,
            });

        const isMe = targetUserId === viewerUserId;
        const [
            isFollowing,
            followingCount,
            followerCount,
        ] = await Promise.all([
            isMe
                ? Promise.resolve(false)
                : this.follows.isFollowing(viewerUserId, targetUserId),
            this.follows.getFollowingCount(targetUserId),
            this.follows.getFollowerCount(targetUserId),
        ]);

        return {
            id: pub.id,
            name: pub.name,
            avatar: pub.avatar,
            signature: pub.signature,
            isMe,
            isFollowing,
            followingCount,
            followerCount,
            region,
            status,
            titles,
        };
    }

    // Rejection buffer（事件拒绝缓冲池，24h TTL）
    async addRejectionBufferItem(
        userId: string,
        kind: RejectionKind,
        rawRequest: string | object,
        sourceQueueId?: string | null,
        now?: Date,
    ) {
        return this.rejectionBuffer.add(
            userId,
            kind,
            rawRequest,
            sourceQueueId,
            now,
        );
    }
    async getRejectionBuffer(userId: string, opts?: RejectionListOpts) {
        return this.rejectionBuffer.list(userId, opts);
    }
    async cleanupExpiredRejections(now?: Date) {
        return this.rejectionBuffer.deleteExpired(now);
    }

    // ── 用户关注 ──
    async followUser(followerId: string, followedId: string) {
        return this.follows.follow(followerId, followedId);
    }
    async unfollowUser(followerId: string, followedId: string) {
        return this.follows.unfollow(followerId, followedId);
    }
    async isFollowing(followerId: string, followedId: string) {
        return this.follows.isFollowing(followerId, followedId);
    }
    async getFollowingCount(userId: string) {
        return this.follows.getFollowingCount(userId);
    }
    async getFollowerCount(userId: string) {
        return this.follows.getFollowerCount(userId);
    }
    async getFollowing(userId: string, limit?: number, offset?: number) {
        return this.follows.getFollowing(userId, limit, offset);
    }
    async getFollowers(userId: string, limit?: number, offset?: number) {
        return this.follows.getFollowers(userId, limit, offset);
    }

    async close() {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }
}

export const dbService = new DatabaseService();
