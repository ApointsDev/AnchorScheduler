/**
 * 用户状态统计：纯函数 + Store 集成测试（内存 SQLite）
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { TaskStore } from "../Services/db/tasks";
import { UserStatusStore } from "../Services/db/userStatus";
import {
    averageCompleteDurationMs,
    completionHourMode,
    formatDurationHuman,
    getShanghaiHour,
    getShanghaiWeekRange,
} from "../Services/userStatusStats";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

describe("userStatusStats pure functions", () => {
    test("getShanghaiWeekRange: Monday-based week", () => {
        // 2026-07-15 is Wednesday Asia/Shanghai
        const now = new Date("2026-07-15T12:00:00+08:00");
        const { weekStart, weekEnd } = getShanghaiWeekRange(now);
        expect(weekStart).toBe("2026-07-13T00:00:00+08:00");
        expect(weekEnd).toBe("2026-07-20T00:00:00+08:00");
    });

    test("getShanghaiWeekRange: Sunday belongs to previous Monday week", () => {
        const now = new Date("2026-07-12T23:00:00+08:00"); // Sunday
        const { weekStart, weekEnd } = getShanghaiWeekRange(now);
        expect(weekStart).toBe("2026-07-06T00:00:00+08:00");
        expect(weekEnd).toBe("2026-07-13T00:00:00+08:00");
    });

    test("completionHourMode: bimodal average", () => {
        // 19 and 21 both peak → mode 20
        const times = [
            "2026-07-14T19:10:00+08:00",
            "2026-07-14T19:30:00+08:00",
            "2026-07-15T21:00:00+08:00",
            "2026-07-15T21:15:00+08:00",
            "2026-07-15T14:00:00+08:00",
        ];
        const { mode, modalHours } = completionHourMode(times);
        expect(modalHours).toEqual([19, 21]);
        expect(mode).toBe(20);
    });

    test("completionHourMode: single peak", () => {
        const times = [
            "2026-07-14T09:00:00+08:00",
            "2026-07-14T09:30:00+08:00",
            "2026-07-14T10:00:00+08:00",
        ];
        const { mode, modalHours } = completionHourMode(times);
        expect(modalHours).toEqual([9]);
        expect(mode).toBe(9);
    });

    test("completionHourMode: empty → null", () => {
        expect(completionHourMode([])).toEqual({
            mode: null,
            modalHours: [],
        });
    });

    test("averageCompleteDurationMs", () => {
        const avg = averageCompleteDurationMs([
            {
                createdAt: "2026-07-13T00:00:00+08:00",
                completedAt: "2026-07-14T00:00:00+08:00",
            },
            {
                createdAt: "2026-07-13T00:00:00+08:00",
                completedAt: "2026-07-15T00:00:00+08:00",
            },
        ]);
        // 1d and 2d → 1.5d = 129600000 ms
        expect(avg).toBe(1.5 * 24 * 60 * 60 * 1000);
    });

    test("averageCompleteDurationMs skips invalid", () => {
        expect(
            averageCompleteDurationMs([
                { createdAt: null, completedAt: "2026-07-14T00:00:00+08:00" },
                {
                    createdAt: "2026-07-15T00:00:00+08:00",
                    completedAt: "2026-07-14T00:00:00+08:00",
                },
            ]),
        ).toBeNull();
    });

    test("getShanghaiHour", () => {
        expect(getShanghaiHour("2026-07-15T19:30:00+08:00")).toBe(19);
        expect(getShanghaiHour("2026-07-15T11:30:00Z")).toBe(19); // UTC 11:30 = SH 19:30
    });

    test("formatDurationHuman", () => {
        expect(formatDurationHuman(null)).toBeNull();
        expect(formatDurationHuman(5000)).toBe("5s");
        expect(formatDurationHuman(120000)).toBe("2m");
        expect(formatDurationHuman(7200000)).toBe("2h");
        expect(formatDurationHuman(86400000)).toBe("1d");
    });
});

async function createSchema(db: Database) {
    await db.exec("PRAGMA foreign_keys = ON");
    await db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            passwordHash TEXT
        );
        CREATE TABLE tasks (
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
            visibility TEXT DEFAULT 'private',
            authorizedUserIds TEXT,
            blockedUserIds TEXT,
            completedAt TEXT,
            archivedAt DATETIME,
            lastActivityAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE user_status (
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
    await db.run(
        `INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)`,
        ["user-a", "a@test.com", "User A", "x"],
    );
}

function baseTask(overrides: Partial<any> = {}) {
    return {
        id: overrides.id || `t-${Math.random().toString(36).slice(2, 8)}`,
        name: overrides.name || "Task",
        description: overrides.description || "",
        dueDate: overrides.dueDate || "2026-07-15T18:00:00+08:00",
        startTime: overrides.startTime || "2026-07-15T10:00:00+08:00",
        endTime: overrides.endTime || "2026-07-15T11:00:00+08:00",
        location: overrides.location,
        completed: overrides.completed ?? false,
        pushedToMSTodo: false,
        importance: "normal" as const,
        scheduleType: "single" as const,
        completedAt: overrides.completedAt,
    };
}

describe("UserStatusStore + TaskStore completedAt", () => {
    let db: Database;
    let tasks: TaskStore;
    let status: UserStatusStore;
    let invalidated: string[];

    beforeEach(async () => {
        db = await open({ filename: ":memory:", driver: SqliteDriver });
        await createSchema(db);
        invalidated = [];
        status = new UserStatusStore(db);
        tasks = new TaskStore(
            db,
            async () => undefined,
            async (userId) => {
                invalidated.push(userId);
                await status.invalidate(userId);
            },
        );
    });

    afterEach(async () => {
        await db.close();
    });

    test("patch completed sets completedAt; uncomplete clears it", async () => {
        await tasks.addTask("user-a", baseTask({ id: "t1" }));
        let t = await tasks.getTaskById("t1");
        expect(t?.completed).toBe(false);
        expect(t?.completedAt).toBeUndefined();

        t = await tasks.patchTask("user-a", "t1", { completed: true });
        expect(t.completed).toBe(true);
        expect(t.completedAt).toBeTruthy();
        const firstCompletedAt = t.completedAt;

        // 其它字段更新不覆盖 completedAt
        t = await tasks.patchTask("user-a", "t1", { name: "Renamed" });
        expect(t.completedAt).toBe(firstCompletedAt);

        t = await tasks.patchTask("user-a", "t1", { completed: false });
        expect(t.completed).toBe(false);
        expect(t.completedAt).toBeUndefined();
        expect(invalidated.length).toBeGreaterThan(0);
    });

    test("aggregates weekly completed / incomplete / mode / duration", async () => {
        // 固定 now = 2026-07-15 周三
        const now = new Date("2026-07-15T12:00:00+08:00");

        // 本周完成 2 条：19 点各一次 → 众数 19
        await db.run(
            `INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)
             VALUES (?, 'user-a', 'done1', '', '2026-07-14T12:00:00+08:00', '2026-07-14T10:00:00+08:00', '2026-07-14T11:00:00+08:00', 1, 0, ?, ?)`,
            [
                "c1",
                "2026-07-13T00:00:00+08:00",
                "2026-07-14T19:00:00+08:00",
            ],
        );
        await db.run(
            `INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)
             VALUES (?, 'user-a', 'done2', '', '2026-07-15T12:00:00+08:00', '2026-07-15T09:00:00+08:00', '2026-07-15T10:00:00+08:00', 1, 0, ?, ?)`,
            [
                "c2",
                "2026-07-13T00:00:00+08:00",
                "2026-07-15T19:30:00+08:00",
            ],
        );
        // 历史完成（上周）不计入
        await db.run(
            `INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)
             VALUES (?, 'user-a', 'old', '', '2026-07-10T12:00:00+08:00', '2026-07-10T10:00:00+08:00', '2026-07-10T11:00:00+08:00', 1, 0, ?, ?)`,
            [
                "old",
                "2026-07-01T00:00:00+08:00",
                "2026-07-10T19:00:00+08:00",
            ],
        );
        // 本周未完成（时段相交）
        await db.run(
            `INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo)
             VALUES (?, 'user-a', 'open1', '', '2026-07-16T12:00:00+08:00', '2026-07-16T10:00:00+08:00', '2026-07-16T11:00:00+08:00', 0, 0)`,
            ["o1"],
        );
        // 时段完全在上周 → 不计入未完成本周
        await db.run(
            `INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo)
             VALUES (?, 'user-a', 'open-old', '', '2026-07-08T12:00:00+08:00', '2026-07-08T10:00:00+08:00', '2026-07-08T11:00:00+08:00', 0, 0)`,
            ["o-old"],
        );
        // 完成但无 completedAt → 不计入本周完成
        await db.run(
            `INSERT INTO tasks (id, userId, name, description, dueDate, startTime, endTime, completed, pushedToMSTodo, createdAt, completedAt)
             VALUES (?, 'user-a', 'legacy', '', '2026-07-15T12:00:00+08:00', '2026-07-15T14:00:00+08:00', '2026-07-15T15:00:00+08:00', 1, 0, ?, NULL)`,
            ["legacy", "2026-07-14T00:00:00+08:00"],
        );

        const s = await status.getStatus("user-a", { fresh: true, now });
        expect(s.weekStart).toBe("2026-07-13T00:00:00+08:00");
        expect(s.weekEnd).toBe("2026-07-20T00:00:00+08:00");
        expect(s.completedThisWeek).toBe(2);
        expect(s.incompleteThisWeek).toBe(1);
        expect(s.completionHourMode).toBe(19);
        expect(s.modalHours).toEqual([19]);
        // c1: 1d+19h, c2: 2d+19.5h → avg of (43h and 67.5h) roughly
        // created 07-13 00:00 → completed 07-14 19:00 = 43h
        // created 07-13 00:00 → completed 07-15 19:30 = 67.5h
        // avg = 55.25h = 198900000 ms
        expect(s.avgCompleteDurationMs).toBe(
            Math.round(
                ((43 + 67.5) / 2) * 60 * 60 * 1000,
            ),
        );
        expect(s.fromCache).toBe(false);
        expect(s.avgCompleteDurationHuman).toBeTruthy();

        // 缓存命中
        const cached = await status.getStatus("user-a", { now });
        expect(cached.fromCache).toBe(true);
        expect(cached.completedThisWeek).toBe(2);

        // 失效后重算
        await status.invalidate("user-a");
        const again = await status.getStatus("user-a", { now });
        expect(again.fromCache).toBe(false);
        expect(again.completedThisWeek).toBe(2);
    });

    test("create completed task sets completedAt", async () => {
        await tasks.addTask(
            "user-a",
            baseTask({ id: "done-create", completed: true }),
        );
        const t = await tasks.getTaskById("done-create");
        expect(t?.completed).toBe(true);
        expect(t?.completedAt).toBeTruthy();
    });
});
