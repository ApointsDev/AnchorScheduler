// 数据库迁移 — 所有 CREATE TABLE 和 ALTER TABLE 操作
import type { Database } from "sqlite";
import { logger } from "../../Utils/logger.js";
import { parseLegacyTaskMetadata } from "../taskMetadata.js";

export async function runMigrations(db: Database): Promise<void> {
  // ── 用户表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            XJTLUaccount TEXT,
            XJTLUPassword TEXT,
            passwordHash TEXT,
            JWTtoken TEXT,
            MStoken TEXT,
            MSbinded BOOLEAN DEFAULT 0,
            ebridgeBinded BOOLEAN DEFAULT 0,
            timetableUrl TEXT DEFAULT '',
            timetableFetchLevel INTEGER DEFAULT 0,
            mailReadingSpan INTEGER DEFAULT 30,
            conflictBoundaryInclusive BOOLEAN DEFAULT 0,
            MSRefreshToken TEXT,
            CalDavBaseUrl TEXT,
            CalDavUsername TEXT,
            CalDavPassword TEXT,
            CalDavPrincipalUrl TEXT,
            CalDavCalendarHome TEXT,
            CalDavCalendarUrl TEXT,
            CalDavSyncToken TEXT,
            CalDavEnabled BOOLEAN DEFAULT 0,
            CalDavLastSyncAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

  // ── 日程队列表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS schedule_queue (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            rawRequest TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

  // ── AI 聊天记录表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS chat_history (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            messages TEXT NOT NULL,
            title TEXT NOT NULL DEFAULT '新对话',
            isActive INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

  // ── 任务表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            dueDate TEXT,
            startTime TEXT,
            endTime TEXT,
            location TEXT,
            completed BOOLEAN DEFAULT 0,
            pushedToMSTodo BOOLEAN DEFAULT 0,
            body TEXT,
            attendees TEXT,
            recurrenceRule TEXT,
            parentTaskId TEXT,
            importance TEXT DEFAULT 'normal',
            eventType TEXT DEFAULT 'schedule',
            category TEXT,
            allDay BOOLEAN DEFAULT 0,
            isReminderOn BOOLEAN DEFAULT 0,
            reminderMinutesBefore INTEGER,
            attachments TEXT,
            allocatedMinutes INTEGER,
            scheduleType TEXT DEFAULT 'single',
            quadrant TEXT,
            importanceScore REAL,
            urgencyScore REAL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

  // ── 用户日志表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS user_logs (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            time DATETIME DEFAULT CURRENT_TIMESTAMP,
            type TEXT NOT NULL,
            message TEXT NOT NULL,
            payload TEXT,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

  // ── CalDAV 事件映射表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS calendar_event_map (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            provider TEXT NOT NULL,
            localTaskId TEXT NOT NULL,
            remoteUid TEXT,
            remoteHref TEXT,
            remoteEtag TEXT,
            calendarUrl TEXT,
            rawData TEXT,
            lastSyncAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_calendar_event_map_user ON calendar_event_map(userId);`
  );
  await db.exec(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_event_map_provider_remote ON calendar_event_map(provider, remoteUid, userId);`
  );
  await db.exec(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_event_map_provider_local ON calendar_event_map(provider, localTaskId);`
  );

  // ── 日程分享链接表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS shared_schedules (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL DEFAULT '',
            dateStart TEXT,
            dateEnd TEXT,
            taskIds TEXT,
            expiresAt TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_shared_schedules_token ON shared_schedules(token);`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_shared_schedules_user ON shared_schedules(userId);`
  );

  // ── AI 已处理邮件追踪表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS ai_processed_emails (
            userId TEXT NOT NULL,
            emailId TEXT NOT NULL,
            provider TEXT NOT NULL DEFAULT 'imap',
            processedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (userId, emailId, provider),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_ai_processed_user ON ai_processed_emails(userId);`
  );

  // ── 待办主表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT 0,
            dueDate TEXT,
            importance TEXT DEFAULT 'normal',
            importanceScore REAL,
            urgencyScore REAL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_todos_user ON todos(userId);`);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_todos_user_completed ON todos(userId, completed);`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_todos_user_due ON todos(userId, dueDate);`
  );

  // ── 用户级标签 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            color TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(userId, name)
        );
    `);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_tags_user ON tags(userId);`);

  // ── 待办 ↔ 标签 多对多 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS todo_tags (
            todoId TEXT NOT NULL,
            tagId TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (todoId, tagId),
            FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE,
            FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_todo_tags_tag ON todo_tags(tagId);`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_todo_tags_todo ON todo_tags(todoId);`
  );

  // ── 待办审批队列表（与 schedule_queue 对齐，独立低耦合）──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS todo_queue (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            rawRequest TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_todo_queue_user ON todo_queue(userId);`
  );

  // ── 用户状态快照表（本周日程统计缓存）──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS user_status (
            userId TEXT PRIMARY KEY,
            weekStart TEXT NOT NULL,
            weekEnd TEXT NOT NULL,
            completedThisWeek INTEGER NOT NULL DEFAULT 0,
            incompleteThisWeek INTEGER NOT NULL DEFAULT 0,
            avgCompleteDurationMs REAL,
            completionHourMode REAL,
            modalHours TEXT,
            completedSampleSize INTEGER NOT NULL DEFAULT 0,
            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

        // ── 用户状态布局表（跨设备同步）──
        await db.exec(`
          CREATE TABLE IF NOT EXISTS user_status_layout (
            userId TEXT PRIMARY KEY,
            layout TEXT NOT NULL,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          );
        `);

  // ── 社区地区表（排名分区，如学校）──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS community_regions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

  // ── 社区排名条目（按周 × 地区 × 指标）──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS community_rank_entries (
            weekStart TEXT NOT NULL,
            regionId TEXT NOT NULL,
            metric TEXT NOT NULL,
            userId TEXT NOT NULL,
            value REAL NOT NULL,
            rank INTEGER NOT NULL,
            displayName TEXT,
            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (weekStart, regionId, metric, userId),
            FOREIGN KEY (regionId) REFERENCES community_regions(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_community_rank_lookup
         ON community_rank_entries(weekStart, regionId, metric, rank);`
  );

  // ── 社区排名元数据（缓存时间戳）──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS community_rank_meta (
            weekStart TEXT NOT NULL,
            regionId TEXT NOT NULL,
            metric TEXT NOT NULL,
            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            participantCount INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (weekStart, regionId, metric),
            FOREIGN KEY (regionId) REFERENCES community_regions(id) ON DELETE CASCADE
        );
    `);

  // 预置默认社区地区
  try {
    await db.run(
      `INSERT OR IGNORE INTO community_regions (id, name) VALUES (?, ?)`,
      ["region-xjtlu", "西交利物浦大学"]
    );
  } catch (e) {
    logger.info("default community region seed skipped:", (e as Error).message);
  }

  // ── 事件拒绝缓冲池（24h TTL）──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS rejection_buffer (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            kind TEXT NOT NULL,
            sourceQueueId TEXT,
            rawRequest TEXT NOT NULL,
            rejectedAt TEXT NOT NULL,
            expiresAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_rejection_buffer_user_kind_rejected
         ON rejection_buffer(userId, kind, rejectedAt);`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_rejection_buffer_expires
         ON rejection_buffer(expiresAt);`
  );

  // ── 跨设备提醒已读状态与增量同步游标 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS reminder_sync_versions (
            userId TEXT PRIMARY KEY,
            version INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(`
        CREATE TABLE IF NOT EXISTS reminder_states (
            userId TEXT NOT NULL,
            reminderId TEXT NOT NULL,
            kind TEXT NOT NULL,
            sourceId TEXT NOT NULL,
            triggeredAt INTEGER NOT NULL,
            status TEXT NOT NULL,
            clientUpdatedAt INTEGER NOT NULL,
            version INTEGER NOT NULL,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (userId, reminderId),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            CHECK (kind IN ('schedule_start', 'todo_start', 'todo_deadline')),
            CHECK (status IN ('unread', 'read', 'dismissed'))
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_reminder_states_user_version
         ON reminder_states(userId, version);`
  );

  // ── ALTER TABLE 增量迁移 ──
  const alterStatements: string[] = [
    `ALTER TABLE chat_history ADD COLUMN title TEXT NOT NULL DEFAULT '历史对话'`,
    `ALTER TABLE chat_history ADD COLUMN isActive INTEGER DEFAULT 0`,
    `ALTER TABLE chat_history ADD COLUMN createdAt DATETIME`,
    `UPDATE chat_history SET createdAt = updatedAt WHERE createdAt IS NULL`,
    `ALTER TABLE users ADD COLUMN ExchangeBinded BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN ExchangeAccessToken TEXT`,
    `ALTER TABLE users ADD COLUMN ExchangeRefreshToken TEXT`,
    `ALTER TABLE users ADD COLUMN ExchangeTokenExpiresAt INTEGER`,
    `ALTER TABLE users ADD COLUMN CAFSub TEXT`,
    `ALTER TABLE users ADD COLUMN CAFAccessToken TEXT`,
    `ALTER TABLE users ADD COLUMN CAFTokenExpiresAt INTEGER`,
    `ALTER TABLE users ADD COLUMN CAFRefreshToken TEXT`,
    `ALTER TABLE users ADD COLUMN ImapHost TEXT`,
    `ALTER TABLE users ADD COLUMN ImapPort INTEGER`,
    `ALTER TABLE users ADD COLUMN ImapBinded BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN ImapEmail TEXT`,
    `ALTER TABLE users ADD COLUMN ImapPassword TEXT`,
    `ALTER TABLE users ADD COLUMN ImapTls BOOLEAN DEFAULT 1`,
    `ALTER TABLE users ADD COLUMN XJTLUaccount TEXT`,
    `ALTER TABLE users ADD COLUMN timetableUrl TEXT DEFAULT ''`,
    `ALTER TABLE users ADD COLUMN timetableFetchLevel INTEGER DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN mailReadingSpan INTEGER DEFAULT 30`,
    `ALTER TABLE users ADD COLUMN conflictBoundaryInclusive BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN highEnergyPeriods TEXT DEFAULT '[]'`,
    `ALTER TABLE users ADD COLUMN weekOffset INTEGER DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN MSRefreshToken TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavBaseUrl TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavUsername TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavPassword TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavPrincipalUrl TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavCalendarHome TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavCalendarUrl TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavSyncToken TEXT`,
    `ALTER TABLE users ADD COLUMN CalDavEnabled BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN CalDavLastSyncAt DATETIME`,
    `ALTER TABLE users ADD COLUMN CalDavServerEnabled BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN CalDavClientProfile TEXT DEFAULT 'auto'`,
    `ALTER TABLE users ADD COLUMN autoSchedulePromotions BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN stripReplyPrefix BOOLEAN DEFAULT 1`,
    `ALTER TABLE users ADD COLUMN SmtpBinded BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN SmtpEmail TEXT`,
    `ALTER TABLE users ADD COLUMN SmtpPassword TEXT`,
    `ALTER TABLE users ADD COLUMN SmtpHost TEXT`,
    `ALTER TABLE users ADD COLUMN SmtpPort INTEGER`,
    `ALTER TABLE users ADD COLUMN SmtpTls BOOLEAN DEFAULT 1`,
    `ALTER TABLE tasks ADD COLUMN recurrenceRule TEXT`,
    `ALTER TABLE tasks ADD COLUMN parentTaskId TEXT`,
    `ALTER TABLE tasks ADD COLUMN importance TEXT DEFAULT 'normal'`,
    `ALTER TABLE tasks ADD COLUMN scheduleType TEXT DEFAULT 'single'`,
    `ALTER TABLE tasks ADD COLUMN quadrant TEXT`,
    `ALTER TABLE tasks ADD COLUMN completedAt TEXT`,
    `ALTER TABLE tasks ADD COLUMN importanceScore REAL`,
    `ALTER TABLE tasks ADD COLUMN urgencyScore REAL`,
    `ALTER TABLE tasks ADD COLUMN eventType TEXT DEFAULT 'schedule'`,
    `ALTER TABLE tasks ADD COLUMN category TEXT`,
    `ALTER TABLE tasks ADD COLUMN allDay BOOLEAN DEFAULT 0`,
    `ALTER TABLE tasks ADD COLUMN isReminderOn BOOLEAN DEFAULT 0`,
    `ALTER TABLE tasks ADD COLUMN reminderMinutesBefore INTEGER`,
    `ALTER TABLE tasks ADD COLUMN attachments TEXT`,
    `ALTER TABLE tasks ADD COLUMN allocatedMinutes INTEGER`,
    `ALTER TABLE todos ADD COLUMN importanceScore REAL`,
    `ALTER TABLE todos ADD COLUMN urgencyScore REAL`,
    `ALTER TABLE users ADD COLUMN onboardingCompleted BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN communityRegionId TEXT`,
    `ALTER TABLE users ADD COLUMN avatar TEXT`,
    `ALTER TABLE users ADD COLUMN signature TEXT`,
    // Chaoxing / 学习通
    `ALTER TABLE users ADD COLUMN ChaoxingBinded BOOLEAN DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN ChaoxingUsername TEXT`,
    `ALTER TABLE users ADD COLUMN ChaoxingPassword TEXT`,
    `ALTER TABLE users ADD COLUMN ChaoxingAccountId TEXT`,
    `ALTER TABLE users ADD COLUMN ChaoxingIntervalHours INTEGER DEFAULT 24`,
    `ALTER TABLE users ADD COLUMN ChaoxingPreferredHour INTEGER DEFAULT 8`,
    `ALTER TABLE users ADD COLUMN ChaoxingEnabled BOOLEAN DEFAULT 1`,
    `ALTER TABLE users ADD COLUMN ChaoxingLastSyncAt TEXT`,
    `ALTER TABLE users ADD COLUMN ChaoxingNextSyncAt TEXT`,
    `ALTER TABLE users ADD COLUMN ChaoxingLastJobId TEXT`,
    `ALTER TABLE users ADD COLUMN ChaoxingLastStatus TEXT`,
    `ALTER TABLE users ADD COLUMN ChaoxingLastError TEXT`,
    // 日程可见性
    `ALTER TABLE tasks ADD COLUMN visibility TEXT DEFAULT 'private'`,
    `ALTER TABLE tasks ADD COLUMN authorizedUserIds TEXT`,
    `ALTER TABLE tasks ADD COLUMN blockedUserIds TEXT`,
    // ── 归档（ARC-001）：tasks / todos / tags ──
    // SQLite ALTER ADD COLUMN 不能带 NOT NULL（除非带默认值），统一用可空 DATETIME
    `ALTER TABLE tasks ADD COLUMN archivedAt DATETIME`,
    `ALTER TABLE tasks ADD COLUMN lastActivityAt DATETIME`,
    `ALTER TABLE todos ADD COLUMN completedAt DATETIME`,
    `ALTER TABLE todos ADD COLUMN archivedAt DATETIME`,
    `ALTER TABLE todos ADD COLUMN lastActivityAt DATETIME`,
    `ALTER TABLE tags ADD COLUMN archivedAt DATETIME`,
    `ALTER TABLE tags ADD COLUMN lastActivityAt DATETIME`,
  ];

  // ── 用户关注关系表 ──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS user_follows (
            followerId TEXT NOT NULL,
            followedId TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (followerId, followedId),
            FOREIGN KEY (followerId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (followedId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(followerId);`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_follows_followed ON user_follows(followedId);`
  );

  // ── 多校 DA 校园大事件（School Events）──
  await db.exec(`
        CREATE TABLE IF NOT EXISTS schools (
            id          TEXT PRIMARY KEY,
            slug        TEXT UNIQUE NOT NULL,
            name        TEXT NOT NULL,
            eventsEmail TEXT,
            themeColor  TEXT,
            enabled     INTEGER NOT NULL DEFAULT 1,
            createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools(slug);`
  );

  await db.exec(`
        CREATE TABLE IF NOT EXISTS school_admins (
            schoolId  TEXT NOT NULL,
            email     TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (schoolId, email),
            FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_school_admins_email ON school_admins(email);`
  );

  await db.exec(`
        CREATE TABLE IF NOT EXISTS da_settings (
            schoolId  TEXT NOT NULL,
            key       TEXT NOT NULL,
            value     TEXT NOT NULL,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (schoolId, key),
            FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE
        );
    `);

  await db.exec(`
        CREATE TABLE IF NOT EXISTS da_student_optins (
            schoolId  TEXT NOT NULL,
            userId    TEXT NOT NULL,
            optedIn   INTEGER NOT NULL DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (schoolId, userId),
            FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE,
            FOREIGN KEY (userId)   REFERENCES users(id)   ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_da_student_optins_user ON da_student_optins(userId);`
  );

  // 预置默认学校（幂等）
  try {
    await db.run(
      `INSERT OR IGNORE INTO schools (id, slug, name, eventsEmail, enabled) VALUES (?, ?, ?, ?, 1)`,
      ["school-xjtlu", "xjtlu", "西交利物浦大学", "da.events@apoints.cn"],
    );
  } catch (e) {
    logger.info("default school seed skipped:", (e as Error).message);
  }

  // 学习通条目去重映射
  await db.exec(`
        CREATE TABLE IF NOT EXISTS chaoxing_item_map (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            remoteKey TEXT NOT NULL,
            kind TEXT NOT NULL,
            target TEXT NOT NULL,
            localTodoId TEXT,
            localTaskId TEXT,
            fingerprint TEXT,
            lastSeenAt TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            UNIQUE(userId, remoteKey),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  try {
    await db.exec(
      `CREATE INDEX IF NOT EXISTS idx_chaoxing_item_map_user
             ON chaoxing_item_map(userId);`
    );
  } catch {
    /* ignore */
  }

  // 用户状态 / 完成时间相关索引（幂等）
  try {
    await db.exec(
      `CREATE INDEX IF NOT EXISTS idx_tasks_user_completed_at ON tasks(userId, completedAt);`
    );
    await db.exec(
      `CREATE INDEX IF NOT EXISTS idx_tasks_user_week_range ON tasks(userId, startTime, endTime);`
    );
  } catch (e) {
    logger.info("user status indexes skipped or failed:", (e as Error).message);
  }

  for (const stmt of alterStatements) {
    try {
      await db.exec(stmt);
    } catch (e) {
      const msg = (e as Error).message;
      // 只对 ALTER/DML 做日志忽略（列已存在等），CREATE INDEX 等已在上方处理
      if (
        !msg.includes("duplicate column name") &&
        !msg.includes("already exists")
      ) {
        logger.info(`Migration note: ${msg}`);
      }
    }
  }

  // ── 归档查询索引（ARC-001，幂等；需在归档列添加之后创建）──
  try {
    await db.exec(
      `CREATE INDEX IF NOT EXISTS idx_tasks_archived ON tasks(userId, archivedAt);`
    );
    await db.exec(
      `CREATE INDEX IF NOT EXISTS idx_todos_archived ON todos(userId, archivedAt);`
    );
    await db.exec(
      `CREATE INDEX IF NOT EXISTS idx_tags_archived ON tags(userId, archivedAt);`
    );
  } catch (e) {
    logger.info("archive indexes skipped or failed:", (e as Error).message);
  }

  // 将旧版 description 中的 [Anchor ...] 后缀一次性迁移到结构化列。
  // 迁移后移除后缀，避免后续编辑出现两个数据源。
  try {
    const legacyRows = await db.all(
      `SELECT id, description, startTime FROM tasks
             WHERE description LIKE '%[Anchor %]%'`
    );
    for (const row of legacyRows) {
      const migrated = parseLegacyTaskMetadata(row.description, row.startTime);
      if (!migrated) continue;
      const { metadata } = migrated;
      await db.run(
        `UPDATE tasks
                 SET description = ?, eventType = ?, category = ?, allDay = ?,
                     isReminderOn = ?, reminderMinutesBefore = ?, attachments = ?
                 WHERE id = ?`,
        [
          migrated.description,
          metadata.eventType,
          metadata.category || null,
          metadata.allDay ? 1 : 0,
          metadata.isReminderOn ? 1 : 0,
          metadata.reminderMinutesBefore ?? null,
          metadata.attachments?.length
            ? JSON.stringify(metadata.attachments)
            : null,
          row.id,
        ]
      );
    }
    if (legacyRows.length > 0) {
      logger.info(
        `Migrated ${legacyRows.length} legacy task metadata descriptions`
      );
    }
  } catch (e) {
    logger.info(
      "legacy task metadata backfill skipped or failed:",
      (e as Error).message
    );
  }

  // scheduleType 回填
  try {
    await db.run(
      `UPDATE tasks SET scheduleType = 'recurring_daily' WHERE recurrenceRule LIKE '%"freq":"daily"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')`
    );
    await db.run(
      `UPDATE tasks SET scheduleType = 'recurring_weekly' WHERE recurrenceRule LIKE '%"freq":"weekly"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')`
    );
    await db.run(
      `UPDATE tasks SET scheduleType = 'recurring_weekly_by_week_number' WHERE recurrenceRule LIKE '%"freq":"weeklyByWeekNumber"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')`
    );
    await db.run(
      `UPDATE tasks SET scheduleType = 'recurring_daily_on_days' WHERE recurrenceRule LIKE '%"freq":"dailyOnDays"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')`
    );
  } catch (e) {
    logger.info(
      "scheduleType backfill skipped or failed:",
      (e as Error).message
    );
  }

  // ── 会员与兑换码（MENU-001）────────────────────────────
  // user_memberships：用户的等级权益（每行一段 startDate~endDate 的有效期）
  await db.exec(`
        CREATE TABLE IF NOT EXISTS user_memberships (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            tier TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'purchase',
            orderId TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_memberships_user ON user_memberships(userId, endDate);`
  );

  // membership_orders：购买订单（含状态，支持恢复购买）
  await db.exec(`
        CREATE TABLE IF NOT EXISTS membership_orders (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            tier TEXT NOT NULL,
            days INTEGER NOT NULL,
            amount REAL NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'CNY',
            status TEXT NOT NULL DEFAULT 'pending',
            provider TEXT NOT NULL DEFAULT 'mock',
            granted INTEGER NOT NULL DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_membership_orders_user ON membership_orders(userId, createdAt);`
  );

  // redeem_codes：兑换码（maxUses 为空表示不限次数）
  await db.exec(`
        CREATE TABLE IF NOT EXISTS redeem_codes (
            code TEXT PRIMARY KEY,
            tier TEXT NOT NULL,
            days INTEGER NOT NULL,
            maxUses INTEGER,
            usedCount INTEGER NOT NULL DEFAULT 0,
            expiresAt DATETIME,
            active INTEGER NOT NULL DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            createdBy TEXT
        );
    `);

  // redeem_code_redemptions：兑换记录（防重复使用依据）
  await db.exec(`
        CREATE TABLE IF NOT EXISTS redeem_code_redemptions (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            userId TEXT NOT NULL,
            tier TEXT NOT NULL,
            days INTEGER NOT NULL,
            previousEndDate DATETIME,
            newEndDate DATETIME,
            redeemedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_redeem_redemptions_user_code
         ON redeem_code_redemptions(userId, code);`
  );

  // ── 用户反馈 / 举报（RPT-001）──────────────────────────
  // type: feedback（反馈）/ report（举报）
  // status: pending（待处理）/ processing（处理中）/ resolved（已解决）/ rejected（已驳回）
  await db.exec(`
        CREATE TABLE IF NOT EXISTS user_reports (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'feedback',
            category TEXT,
            targetId TEXT,
            content TEXT NOT NULL,
            contact TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_reports_user ON user_reports(userId, createdAt);`
  );
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status, createdAt);`
  );

  // ── 应用版本更新配置（UPD-001）────────────────────────
  // 管理员配置各平台最新版本与外部下载源；GET /api/app/update 按 platform 返回 enabled 的最新一条
  await db.exec(`
        CREATE TABLE IF NOT EXISTS app_releases (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL DEFAULT 'android',
            version TEXT NOT NULL,
            versionCode INTEGER NOT NULL DEFAULT 0,
            downloadUrl TEXT NOT NULL,
            releaseNotes TEXT,
            forceUpdate INTEGER NOT NULL DEFAULT 0,
            enabled INTEGER NOT NULL DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_app_releases_platform
         ON app_releases(platform, enabled, versionCode DESC);`
  );
}
