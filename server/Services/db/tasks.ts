// 任务 CRUD 操作 — 使用统一的 mapRowToTask 消除重复
import type { Database } from "sqlite";
import type { Task } from "../../index";
import { toShanghaiISO } from "../../Utils/time.js";
import { assertNoConflict } from "../scheduleConflict";
import {
  clampAxisScore,
  quadrantFromAxes,
  resolvePriorityAxes,
} from "../priorityAxes.js";
import { mapRowToTask, normalizeImportance } from "./taskMapper";
import { resolveTaskMetadata } from "../taskMetadata.js";
import { ArchiveNotArchivedError } from "./archiveErrors.js";

export class TaskStore {
  constructor(
    private db: Database,
    private addUserLog: (
      userId: string,
      type: string,
      message: string,
      payload?: unknown
    ) => Promise<unknown>,
    private onTaskMutation?: (userId: string) => Promise<void>
  ) {}

  private async notifyMutation(userId: string | null | undefined) {
    if (userId && this.onTaskMutation) {
      try {
        await this.onTaskMutation(userId);
      } catch {
        // 状态缓存失效失败不阻断主流程
      }
    }
  }

  /** 根据 completed 状态变化计算 completedAt */
  private resolveCompletedAt(
    wasCompleted: boolean | undefined,
    isCompleted: boolean,
    existingCompletedAt?: string | null,
    explicitCompletedAt?: string | null
  ): string | null {
    if (!isCompleted) return null;
    if (explicitCompletedAt) {
      try {
        return toShanghaiISO(explicitCompletedAt);
      } catch {
        return toShanghaiISO();
      }
    }
    // 已完成且仅改其它字段 → 保留原 completedAt
    if (wasCompleted && existingCompletedAt) {
      return existingCompletedAt;
    }
    // false→true 或创建即完成
    return toShanghaiISO();
  }

  async addTask(
    userId: string,
    task: Task,
    boundaryConflict?: boolean,
    allowConflict: boolean = true
  ): Promise<void> {
    const existing = await this.getTasksByUserId(userId);
    if (!allowConflict) {
      assertNoConflict(existing, task, {
        boundaryConflict: boundaryConflict ?? false,
      });
    }
    task.importance = normalizeImportance(task.importance);
    const axes = resolvePriorityAxes({
      importanceScore: task.importanceScore,
      urgencyScore: task.urgencyScore,
      importance: task.importance,
      fillDefaults: true,
    });
    task.importanceScore = axes.importanceScore;
    task.urgencyScore = axes.urgencyScore;
    Object.assign(
      task,
      resolveTaskMetadata(task as unknown as Record<string, unknown>)
    );
    if (!task.quadrant) {
      task.quadrant = quadrantFromAxes(axes.importanceScore, axes.urgencyScore);
    }
    try {
      if (task.startTime) task.startTime = toShanghaiISO(task.startTime);
    } catch (e) {}
    try {
      if (task.endTime) task.endTime = toShanghaiISO(task.endTime);
    } catch (e) {}
    try {
      if (task.dueDate) task.dueDate = toShanghaiISO(task.dueDate);
    } catch (e) {}

    const completedAt = this.resolveCompletedAt(
      false,
      !!task.completed,
      null,
      task.completedAt
    );
    task.completedAt = completedAt || undefined;

    await this.db.run(
      `INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, location, completed, pushedToMSTodo, body, attendees, recurrenceRule, parentTaskId, importance, eventType, category, allDay, isReminderOn, reminderMinutesBefore, attachments, allocatedMinutes, scheduleType, quadrant, completedAt, lastActivityAt, importanceScore, urgencyScore, visibility, authorizedUserIds, blockedUserIds)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        userId,
        task.name,
        task.description,
        task.dueDate,
        task.startTime,
        task.endTime,
        task.location,
        task.completed ? 1 : 0,
        task.pushedToMSTodo ? 1 : 0,
        task.body,
        task.attendees ? JSON.stringify(task.attendees) : null,
        task.recurrenceRule || null,
        task.parentTaskId || null,
        task.importance || "normal",
        task.eventType || "schedule",
        task.category || null,
        task.allDay ? 1 : 0,
        task.isReminderOn ? 1 : 0,
        task.reminderMinutesBefore ?? null,
        task.attachments?.length ? JSON.stringify(task.attachments) : null,
        task.allocatedMinutes ?? null,
        task.scheduleType || "single",
        task.quadrant || null,
        completedAt,
        toShanghaiISO(),
        axes.importanceScore,
        axes.urgencyScore,
        task.visibility || "private",
        task.authorizedUserIds ? JSON.stringify(task.authorizedUserIds) : null,
        task.blockedUserIds ? JSON.stringify(task.blockedUserIds) : null,
      ]
    );
    await this.addUserLog(userId, "task_created", `Created task ${task.name}`, {
      taskId: task.id,
      name: task.name,
    });
    await this.notifyMutation(userId);
  }

  async updateTask(
    task: Task,
    boundaryConflict?: boolean,
    allowConflict: boolean = false
  ): Promise<void> {
    const row = await this.db.get(
      "SELECT userId, completed, completedAt FROM tasks WHERE id = ?",
      [task.id]
    );
    if (row && row.userId) {
      const existing = await this.getTasksByUserId(row.userId);
      const others = existing.filter((t) => t.id !== task.id);
      if (!allowConflict) {
        assertNoConflict(others, task, {
          boundaryConflict: boundaryConflict ?? false,
        });
      }
    }
    task.importance = normalizeImportance(task.importance);
    if (task.importanceScore !== undefined) {
      task.importanceScore = clampAxisScore(task.importanceScore);
    }
    if (task.urgencyScore !== undefined) {
      task.urgencyScore = clampAxisScore(task.urgencyScore);
    }
    const derivedQ = quadrantFromAxes(
      task.importanceScore ?? null,
      task.urgencyScore ?? null
    );
    if (derivedQ) task.quadrant = derivedQ;
    Object.assign(
      task,
      resolveTaskMetadata(task as unknown as Record<string, unknown>, task)
    );
    try {
      if (task.startTime) task.startTime = toShanghaiISO(task.startTime);
    } catch (e) {}
    try {
      if (task.endTime) task.endTime = toShanghaiISO(task.endTime);
    } catch (e) {}
    try {
      if (task.dueDate) task.dueDate = toShanghaiISO(task.dueDate);
    } catch (e) {}

    const wasCompleted = !!(
      row &&
      (row.completed === 1 || row.completed === true)
    );
    const completedAt = this.resolveCompletedAt(
      wasCompleted,
      !!task.completed,
      row?.completedAt,
      task.completedAt
    );
    task.completedAt = completedAt || undefined;

    await this.db.run(
      `UPDATE tasks SET name = ?, description = ?, dueDate = ?, startTime = ?, endTime = ?, location = ?, completed = ?, pushedToMSTodo = ?, body = ?, attendees = ?, recurrenceRule = ?, parentTaskId = ?, importance = ?, eventType = ?, category = ?, allDay = ?, isReminderOn = ?, reminderMinutesBefore = ?, attachments = ?, allocatedMinutes = ?, scheduleType = ?, quadrant = ?, completedAt = ?, lastActivityAt = ?, importanceScore = ?, urgencyScore = ?, visibility = ?, authorizedUserIds = ?, blockedUserIds = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [
        task.name,
        task.description,
        task.dueDate,
        task.startTime,
        task.endTime,
        task.location,
        task.completed ? 1 : 0,
        task.pushedToMSTodo ? 1 : 0,
        task.body,
        task.attendees ? JSON.stringify(task.attendees) : null,
        task.recurrenceRule || null,
        task.parentTaskId || null,
        task.importance || "normal",
        task.eventType || "schedule",
        task.category || null,
        task.allDay ? 1 : 0,
        task.isReminderOn ? 1 : 0,
        task.reminderMinutesBefore ?? null,
        task.attachments?.length ? JSON.stringify(task.attachments) : null,
        task.allocatedMinutes ?? null,
        task.scheduleType || "single",
        task.quadrant || null,
        completedAt,
        toShanghaiISO(),
        task.importanceScore ?? null,
        task.urgencyScore ?? null,
        task.visibility || "private",
        task.authorizedUserIds ? JSON.stringify(task.authorizedUserIds) : null,
        task.blockedUserIds ? JSON.stringify(task.blockedUserIds) : null,
        task.id,
      ]
    );
    if (row?.userId) await this.notifyMutation(row.userId);
  }

  async patchTask(
    userId: string,
    taskId: string,
    updates: Partial<Task>,
    boundaryConflict?: boolean,
    allowConflict: boolean = false
  ): Promise<Task> {
    const existingTask = await this.getTaskById(taskId);
    if (!existingTask) throw new Error("Task not found");
    const structuredFields = [
      "eventType",
      "category",
      "allDay",
      "isReminderOn",
      "reminderMinutesBefore",
      "attachments",
      "allocatedMinutes",
    ];
    if (
      structuredFields.some((field) =>
        Object.prototype.hasOwnProperty.call(updates, field)
      )
    ) {
      Object.assign(
        updates,
        resolveTaskMetadata(
          updates as unknown as Record<string, unknown>,
          existingTask
        )
      );
    }
    if (updates.importance !== undefined) {
      updates.importance = normalizeImportance(updates.importance as string);
    }
    if (updates.importanceScore !== undefined) {
      updates.importanceScore = clampAxisScore(updates.importanceScore);
    }
    if (updates.urgencyScore !== undefined) {
      updates.urgencyScore = clampAxisScore(updates.urgencyScore);
    }
    // 任一轴更新时强制用双轴重算 quadrant（忽略客户端可能带来的旧 quadrant）
    if (
      updates.importanceScore !== undefined ||
      updates.urgencyScore !== undefined
    ) {
      const imp =
        updates.importanceScore !== undefined
          ? updates.importanceScore
          : existingTask.importanceScore ?? null;
      const urg =
        updates.urgencyScore !== undefined
          ? updates.urgencyScore
          : existingTask.urgencyScore ?? null;
      const q = quadrantFromAxes(imp ?? null, urg ?? null);
      if (q) {
        updates.quadrant = q;
      }
    }
    const updatedTask = { ...existingTask, ...updates, id: taskId };
    if (updates.startTime || updates.endTime) {
      const allTasks = await this.getTasksByUserId(userId);
      const otherTasks = allTasks.filter((t) => t.id !== taskId);
      if (!allowConflict) {
        assertNoConflict(otherTasks, updatedTask, {
          boundaryConflict: boundaryConflict ?? false,
        });
      }
    }
    const fields = Object.keys(updates).filter((k) => k !== "id");
    // 归档/最近活动/创建时间为服务端维护字段，禁止客户端经 PATCH 修改
    delete updates.archivedAt;
    delete updates.lastActivityAt;
    delete updates.createdAt;
    for (const forbidden of ["archivedAt", "lastActivityAt", "createdAt"]) {
      const idx = fields.indexOf(forbidden);
      if (idx >= 0) fields.splice(idx, 1);
    }
    if (fields.length === 0) return existingTask;
    if (updates.startTime) {
      try {
        updates.startTime = toShanghaiISO(updates.startTime as string);
      } catch (e) {}
    }
    if (updates.endTime) {
      try {
        updates.endTime = toShanghaiISO(updates.endTime as string);
      } catch (e) {}
    }
    if (updates.dueDate) {
      try {
        updates.dueDate = toShanghaiISO(updates.dueDate as string);
      } catch (e) {}
    }

    // 维护 completedAt：completed 变化时自动处理；禁止客户端随意改 completedAt 除非随 completed 一起
    if (updates.completed !== undefined) {
      const completedAt = this.resolveCompletedAt(
        existingTask.completed,
        !!updates.completed,
        existingTask.completedAt,
        updates.completedAt
      );
      updates.completedAt = completedAt || undefined;
      if (!fields.includes("completedAt")) fields.push("completedAt");
    } else {
      // 不允许单独 PATCH completedAt 破坏统计
      delete updates.completedAt;
      const idx = fields.indexOf("completedAt");
      if (idx >= 0) fields.splice(idx, 1);
    }

    if (fields.length === 0) return existingTask;

    const setClauses = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => {
      const key = f as keyof typeof updates;
      let value = updates[key];
      if (f === "completedAt") {
        return value || null;
      }
      if (typeof value === "boolean") return value ? 1 : 0;
      if (typeof value === "object" && value !== null)
        return JSON.stringify(value);
      return value;
    });
    const sql = `UPDATE tasks SET ${setClauses}, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?`;
    await this.db.run(sql, [...values, toShanghaiISO(), taskId, userId]);
    await this.addUserLog(userId, "task_updated", `Updated task ${taskId}`, {
      taskId,
      updates,
    });
    await this.notifyMutation(userId);
    return (await this.getTaskById(taskId)) as Task;
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    const rows = await this.db.all("SELECT * FROM tasks WHERE userId = ?", [
      userId,
    ]);
    return rows.map(mapRowToTask);
  }

  async getTasksPage(
    userId: string,
    opts?: {
      start?: string;
      end?: string;
      q?: string;
      completed?: boolean;
      limit?: number;
      offset?: number;
      sortBy?: string;
      order?: "asc" | "desc";
      /** 为 true 时包含已归档数据；默认仅返回未归档（archivedAt IS NULL） */
      includeArchived?: boolean;
    }
  ): Promise<{ tasks: Task[]; total: number }> {
    const where: string[] = ["userId = ?"];
    const params: unknown[] = [userId];
    if (!opts?.includeArchived) {
      where.push("archivedAt IS NULL");
    }
    if (opts?.start) {
      where.push("endTime >= ?");
      params.push(opts.start);
    }
    if (opts?.end) {
      where.push("startTime <= ?");
      params.push(opts.end);
    }
    if (typeof opts?.completed === "boolean") {
      where.push("completed = ?");
      params.push(opts.completed ? 1 : 0);
    }
    if (opts?.q) {
      const like = `%${opts.q.toLowerCase()}%`;
      where.push(
        "(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)"
      );
      params.push(like, like, like);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const sortField = ["startTime", "dueDate", "name", "endTime"].includes(
      opts?.sortBy || ""
    )
      ? opts!.sortBy
      : "startTime";
    const order = opts?.order === "desc" ? "DESC" : "ASC";
    const limit = Math.max(1, Math.min(500, opts?.limit || 50));
    const offset = Math.max(0, opts?.offset || 0);
    const countRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM tasks ${whereSql}`,
      params
    );
    const total = countRow ? countRow.cnt || 0 : 0;
    const sql = `SELECT * FROM tasks ${whereSql} ORDER BY ${sortField} ${order} LIMIT ? OFFSET ?`;
    const rows = await this.db.all(sql, params.concat([limit, offset]));
    return { tasks: rows.map(mapRowToTask), total };
  }

  async getOccurrencesPage(
    userId: string,
    rootTaskId: string,
    opts?: {
      limit?: number;
      offset?: number;
      sortBy?: string;
      order?: "asc" | "desc";
    }
  ): Promise<{ occurrences: Task[]; total: number }> {
    const where: string[] = ["userId = ?", "parentTaskId = ?"];
    const params: unknown[] = [userId, rootTaskId];
    const whereSql = `WHERE ${where.join(" AND ")}`;
    const sortField = ["startTime", "dueDate", "name", "endTime"].includes(
      opts?.sortBy || ""
    )
      ? opts!.sortBy
      : "startTime";
    const order = opts?.order === "desc" ? "DESC" : "ASC";
    const limit = Math.max(1, Math.min(500, opts?.limit || 50));
    const offset = Math.max(0, opts?.offset || 0);
    const countRow = await this.db.get<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM tasks ${whereSql}`,
      params
    );
    const total = countRow ? countRow.cnt || 0 : 0;
    const rows = await this.db.all(
      `SELECT * FROM tasks ${whereSql} ORDER BY ${sortField} ${order} LIMIT ? OFFSET ?`,
      params.concat([limit, offset])
    );
    return { occurrences: rows.map(mapRowToTask), total };
  }

  async getTaskById(id: string): Promise<Task | null> {
    const row = await this.db.get("SELECT * FROM tasks WHERE id = ?", [id]);
    if (!row) return null;
    return mapRowToTask(row);
  }

  async getTasksByIds(userId: string, ids: string[]): Promise<Task[]> {
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(",");
    const rows = await this.db.all(
      `SELECT * FROM tasks WHERE userId = ? AND id IN (${placeholders})`,
      [userId, ...ids]
    );
    return rows.map(mapRowToTask);
  }

  async deleteTask(id: string): Promise<boolean> {
    const row = await this.db.get("SELECT userId FROM tasks WHERE id = ?", [
      id,
    ]);
    const userId = row ? row.userId : null;
    const result = await this.db.run("DELETE FROM tasks WHERE id = ?", [
      id,
    ]);
    const success = (result?.changes || 0) > 0;
    if (success && userId) {
      await this.addUserLog(userId, "task_deleted", `Deleted task ${id}`, {
        taskId: id,
      });
      await this.notifyMutation(userId);
    }
    return success;
  }

  /**
   * 获取目标用户中对 viewerId 可见的日程列表。
   * - 本人查看本人：全部返回
   * - "public"   → 全部可见
   * - "private"  → 仅本人可见
   * - "authorized" → authorizedUserIds 包含 viewerId 时可见
   * - "blocked"   → blockedUserIds 不包含 viewerId 时可见
   */
  async getVisibleTasksByUserId(
    targetUserId: string,
    viewerUserId: string
  ): Promise<Task[]> {
    const all = await this.getTasksByUserId(targetUserId);
    if (targetUserId === viewerUserId) return all;
    return all.filter((task) => {
      const vis = task.visibility || "private";
      if (vis === "public") return true;
      if (vis === "private") return false;
      if (vis === "authorized") {
        const authIds = task.authorizedUserIds || [];
        return authIds.includes(viewerUserId);
      }
      if (vis === "blocked") {
        const blockedIds = task.blockedUserIds || [];
        return !blockedIds.includes(viewerUserId);
      }
      return false;
    });
  }

  async deleteTasksByPattern(userId: string, pattern: string): Promise<number> {
    const rows = await this.db.all(
      "SELECT id FROM tasks WHERE userId = ? AND id LIKE ?",
      [userId, pattern]
    );
    const ids = rows.map((r) => r.id);
    if (ids.length === 0) return 0;
    const result = await this.db.run(
      "DELETE FROM tasks WHERE userId = ? AND id LIKE ?",
      [userId, pattern]
    );
    const count = result?.changes || 0;
    if (count > 0) {
      await this.addUserLog(
        userId,
        "tasks_deleted_pattern",
        `Deleted ${count} tasks matching pattern ${pattern}`,
        { pattern, count, deletedIds: ids }
      );
      await this.notifyMutation(userId);
    }
    return count;
  }

  // ── 归档（ARC-001）───────────────────────────────────────

  /** 当前用户所有已归档日程，按 archivedAt DESC（最新在前） */
  async listArchived(userId: string): Promise<Task[]> {
    const rows = await this.db.all(
      `SELECT * FROM tasks
       WHERE userId = ? AND archivedAt IS NOT NULL
       ORDER BY archivedAt DESC`,
      [userId]
    );
    return rows.map(mapRowToTask);
  }

  /** 归档日程：写 archivedAt + 刷新 lastActivityAt；幂等 */
  async archive(
    userId: string,
    id: string,
    now: Date = new Date()
  ): Promise<Task | null> {
    const archivedAt = toShanghaiISO(now);
    const lastActivityAt = toShanghaiISO(now);
    const result = await this.db.run(
      `UPDATE tasks
       SET archivedAt = ?, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ? AND userId = ?`,
      [archivedAt, lastActivityAt, id, userId]
    );
    if ((result?.changes ?? 0) === 0) return null;
    await this.notifyMutation(userId);
    return this.getTaskById(id);
  }

  /** 恢复日程：archivedAt 置空 + 刷新 lastActivityAt；幂等 */
  async restore(
    userId: string,
    id: string,
    now: Date = new Date()
  ): Promise<Task | null> {
    const lastActivityAt = toShanghaiISO(now);
    const result = await this.db.run(
      `UPDATE tasks
       SET archivedAt = NULL, lastActivityAt = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ? AND userId = ?`,
      [lastActivityAt, id, userId]
    );
    if ((result?.changes ?? 0) === 0) return null;
    await this.notifyMutation(userId);
    return this.getTaskById(id);
  }

  /**
   * 永久删除已归档日程。
   * - 不存在或非本人 → false（由调用方映射 404）
   * - 存在但未归档 → 抛 ArchiveNotArchivedError（409）
   */
  async deleteArchived(
    userId: string,
    id: string
  ): Promise<boolean> {
    const row: { id: string; archivedAt: string | null } | undefined =
      await this.db.get(
        `SELECT id, archivedAt FROM tasks WHERE id = ? AND userId = ?`,
        [id, userId]
      );
    if (!row) return false;
    if (row.archivedAt == null) {
      throw new ArchiveNotArchivedError(
        `Task ${id} is not archived, permanent delete rejected`
      );
    }
    const result = await this.db.run(
      `DELETE FROM tasks WHERE id = ? AND userId = ?`,
      [id, userId]
    );
    const ok = (result?.changes ?? 0) > 0;
    if (ok) {
      await this.addUserLog(userId, "task_deleted", `Permanently deleted archived task ${id}`, {
        taskId: id,
      });
      await this.notifyMutation(userId);
    }
    return ok;
  }
}
