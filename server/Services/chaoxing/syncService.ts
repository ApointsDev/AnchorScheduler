/**
 * 学习通端到端同步：爬虫 job → 按开始时间写入日程/待办
 */
import type { User, Task } from "../../types/models";
import { dbService } from "../dbService.js";
import { logger } from "../../Utils/logger.js";
import { toShanghaiISO } from "../../Utils/time.js";
import { CrawlerClient } from "./crawlerClient.js";
import { upsertCrawlerAccount } from "./credentialStore.js";
import {
    defaultEndFromStart,
    mapCrawlResultToItems,
    stableTaskId,
    type NormalizedChaoxingItem,
} from "./mapper.js";
import {
    clampIntervalHours,
    clampPreferredHour,
    computeNextSyncAt,
    jitterMinutesForUser,
} from "./scheduleNext.js";
import {
    ChaoxingItemMapStore,
    type ChaoxingMapTarget,
} from "../db/chaoxingItemMap.js";

const syncingUsers = new Set<string>();
const SYNC_LEASE_MS = 10 * 60 * 1000;
const leaseUntil = new Map<string, number>();

export function isChaoxingSyncing(userId: string): boolean {
    const until = leaseUntil.get(userId) || 0;
    if (until && until < Date.now()) {
        leaseUntil.delete(userId);
        syncingUsers.delete(userId);
        return false;
    }
    return syncingUsers.has(userId);
}

function acquireLock(userId: string): boolean {
    if (isChaoxingSyncing(userId)) return false;
    syncingUsers.add(userId);
    leaseUntil.set(userId, Date.now() + SYNC_LEASE_MS);
    return true;
}

function releaseLock(userId: string): void {
    syncingUsers.delete(userId);
    leaseUntil.delete(userId);
}

export function crawlerAccountIdForUser(userId: string): string {
    return `sch_${userId}`;
}

async function persistUserFields(
    user: User,
    fields: Parameters<typeof dbService.updateUserChaoxingFields>[1],
): Promise<void> {
    await dbService.updateUserChaoxingFields(user.id, fields);
    Object.assign(user, {
        ...fields,
        ChaoxingBinded:
            fields.ChaoxingBinded !== undefined
                ? fields.ChaoxingBinded
                : user.ChaoxingBinded,
        ChaoxingEnabled:
            fields.ChaoxingEnabled !== undefined
                ? fields.ChaoxingEnabled
                : user.ChaoxingEnabled,
    });
}

async function applyItem(
    user: User,
    item: NormalizedChaoxingItem,
    mapStore: ChaoxingItemMapStore,
): Promise<void> {
    const existing = await mapStore.getByRemoteKey(user.id, item.remoteKey);
    const tagNames = ["学习通"];
    if (item.courseName) tagNames.push(item.courseName.slice(0, 64));

    // 落点迁移：todo ↔ task
    if (existing && existing.target !== item.target) {
        if (existing.target === "todo" && existing.localTodoId) {
            try {
                await dbService.deleteTodo(user.id, existing.localTodoId);
            } catch {
                /* ignore */
            }
        }
        if (existing.target === "task" && existing.localTaskId) {
            try {
                await dbService.deleteTask(existing.localTaskId);
            } catch {
                /* ignore */
            }
        }
    }

    if (item.target === "task") {
        const startTime = item.startAt!;
        const endTime = item.endAt || defaultEndFromStart(startTime);
        const taskId =
            (existing?.target === "task" && existing.localTaskId) ||
            stableTaskId(user.id, item.remoteKey);

        const task: Task = {
            id: taskId,
            name: item.name,
            description: item.description,
            dueDate: item.endAt || endTime,
            startTime,
            endTime,
            completed: item.completed,
            pushedToMSTodo: false,
            body: JSON.stringify({
                source: "chaoxing",
                remoteKey: item.remoteKey,
                kind: item.kind,
            }),
            importance: "normal",
            scheduleType: "single",
        };

        const found = await dbService.getTaskById(taskId);
        if (found && found.id) {
            // ensure ownership
            const userTasks = await dbService.getTasksByIds(user.id, [taskId]);
            if (userTasks.length > 0) {
                await dbService.updateTask(
                    { ...found, ...task, id: taskId },
                    user.conflictBoundaryInclusive,
                    true,
                );
            } else {
                await dbService.addTask(user.id, task, user.conflictBoundaryInclusive, true);
            }
        } else {
            await dbService.addTask(user.id, task, user.conflictBoundaryInclusive, true);
        }

        await mapStore.upsert({
            userId: user.id,
            remoteKey: item.remoteKey,
            kind: item.kind,
            target: "task",
            localTaskId: taskId,
            localTodoId: null,
            fingerprint: item.fingerprint,
        });
        return;
    }

    // todo
    let todoId =
        existing?.target === "todo" ? existing.localTodoId || undefined : undefined;
    if (todoId) {
        const t = await dbService.getTodoById(user.id, todoId);
        if (!t) todoId = undefined;
    }
    if (todoId) {
        await dbService.updateTodo(user.id, todoId, {
            name: item.name,
            description: item.description,
            completed: item.completed,
            dueDate: item.endAt || null,
            tagNames,
            replaceTags: true,
        });
    } else {
        const created = await dbService.createTodo(user.id, {
            name: item.name,
            description: item.description,
            completed: item.completed,
            dueDate: item.endAt || undefined,
            tagNames,
        });
        todoId = created.id;
    }

    await mapStore.upsert({
        userId: user.id,
        remoteKey: item.remoteKey,
        kind: item.kind,
        target: "todo" as ChaoxingMapTarget,
        localTodoId: todoId,
        localTaskId: null,
        fingerprint: item.fingerprint,
    });
}

export interface SyncResult {
    ok: boolean;
    jobId?: string;
    status: string;
    imported?: number;
    tasks?: number;
    todos?: number;
    error?: string;
    errorCode?: string;
}

/**
 * 完整同步（阻塞直到 job 结束或超时）
 */
export async function syncChaoxingUser(
    user: User,
    opts?: { force?: boolean },
): Promise<SyncResult> {
    if (!user.ChaoxingBinded || !user.ChaoxingUsername || !user.ChaoxingPassword) {
        return { ok: false, status: "failed", error: "not_bound" };
    }
    if (!acquireLock(user.id)) {
        return { ok: false, status: "syncing", error: "already_syncing" };
    }

    const accountId =
        user.ChaoxingAccountId || crawlerAccountIdForUser(user.id);
    const client = new CrawlerClient();

    try {
        await persistUserFields(user, {
            ChaoxingLastStatus: "syncing",
            ChaoxingLastError: null,
            ChaoxingAccountId: accountId,
        });

        // 确保爬虫侧凭据
        await upsertCrawlerAccount({
            accountId,
            username: user.ChaoxingUsername,
            password: user.ChaoxingPassword,
            enabled: true,
        });

        const created = await client.createJob(accountId, {
            mode: "full",
            max_workers: 4,
            notice_max_pages: 10,
            skip_ended: false,
        });
        const jobId = created.job_id;

        await persistUserFields(user, {
            ChaoxingLastJobId: jobId,
            ChaoxingLastStatus: "syncing",
        });

        const { status, result } = await client.waitForJob(jobId);

        if (status.status === "failed" || !result) {
            const errCode = status.error_code || "crawl_failed";
            const errMsg =
                status.error_message || errCode || "crawl job failed";
            const next = computeNextSyncAt(
                new Date(),
                1, // 失败短退避 1h 后再按 preferred
                user.ChaoxingPreferredHour ?? 8,
                jitterMinutesForUser(user.id),
            );
            // 失败用 1 小时间隔：再算一次 from now+1h
            const nextFail = computeNextSyncAt(
                new Date(),
                1,
                user.ChaoxingPreferredHour ?? 8,
                jitterMinutesForUser(user.id),
            );
            await persistUserFields(user, {
                ChaoxingLastStatus: "failed",
                ChaoxingLastError: String(errMsg).slice(0, 500),
                ChaoxingLastJobId: jobId,
                ChaoxingNextSyncAt: nextFail || next,
            });
            return {
                ok: false,
                jobId,
                status: "failed",
                error: String(errMsg),
                errorCode: errCode || undefined,
            };
        }

        const items = mapCrawlResultToItems(result);
        const mapStore = await dbService.getChaoxingItemMapStore();
        let tasks = 0;
        let todos = 0;
        for (const item of items) {
            try {
                await applyItem(user, item, mapStore);
                if (item.target === "task") tasks++;
                else todos++;
            } catch (e) {
                logger.warn(
                    `Chaoxing apply item failed for ${user.id} ${item.remoteKey}:`,
                    e,
                );
            }
        }

        const now = new Date();
        const interval = clampIntervalHours(user.ChaoxingIntervalHours ?? 24);
        const preferred = clampPreferredHour(user.ChaoxingPreferredHour ?? 8);
        const nextSyncAt = computeNextSyncAt(
            now,
            interval,
            preferred,
            jitterMinutesForUser(user.id),
        );

        await persistUserFields(user, {
            ChaoxingLastStatus: "succeeded",
            ChaoxingLastError: null,
            ChaoxingLastSyncAt: toShanghaiISO(now),
            ChaoxingNextSyncAt: nextSyncAt,
            ChaoxingLastJobId: jobId,
        });

        // 刷新内存任务列表
        try {
            await dbService.refreshUserTasks(user);
        } catch {
            /* optional */
        }

        logger.info(
            `Chaoxing sync ok user=${user.id} job=${jobId} items=${items.length} tasks=${tasks} todos=${todos}`,
        );

        return {
            ok: true,
            jobId,
            status: "succeeded",
            imported: items.length,
            tasks,
            todos,
        };
    } catch (e: any) {
        const msg = e?.message || String(e);
        logger.error(`Chaoxing sync error user=${user.id}:`, msg);
        const nextFail = computeNextSyncAt(
            new Date(),
            1,
            user.ChaoxingPreferredHour ?? 8,
            jitterMinutesForUser(user.id),
        );
        try {
            await persistUserFields(user, {
                ChaoxingLastStatus: "failed",
                ChaoxingLastError: msg.slice(0, 500),
                ChaoxingNextSyncAt: nextFail,
            });
        } catch {
            /* ignore */
        }
        return { ok: false, status: "failed", error: msg };
    } finally {
        releaseLock(user.id);
        void opts;
    }
}

export function buildStatusPayload(user: User) {
    return {
        binded: !!user.ChaoxingBinded,
        username: user.ChaoxingUsername || null,
        accountId: user.ChaoxingAccountId || null,
        intervalHours: user.ChaoxingIntervalHours ?? 24,
        preferredHour: user.ChaoxingPreferredHour ?? 8,
        enabled: user.ChaoxingEnabled !== false,
        lastSyncAt: user.ChaoxingLastSyncAt || null,
        nextSyncAt: user.ChaoxingNextSyncAt || null,
        lastJobId: user.ChaoxingLastJobId || null,
        lastStatus: user.ChaoxingLastStatus || "idle",
        lastError: user.ChaoxingLastError || null,
        syncing: isChaoxingSyncing(user.id),
    };
}
