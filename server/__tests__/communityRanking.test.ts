/**
 * 社区排名：文案 / 名次 / Store 集成
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { CommunityStore } from "../Services/db/community";
import { UserStatusStore } from "../Services/db/userStatus";
import {
    assignDenseRanks,
    buildRankTitle,
    COMMUNITY_METRICS,
} from "../Services/communityRanking";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

describe("communityRanking helpers", () => {
    test("buildRankTitle: 西交利物浦大学时间利用率第一", () => {
        expect(buildRankTitle("西交利物浦大学", "时间利用率", 1)).toBe(
            "西交利物浦大学时间利用率第一",
        );
        expect(buildRankTitle("西交利物浦大学", "执行效率", 3)).toBe(
            "西交利物浦大学执行效率第3",
        );
        expect(buildRankTitle("西交利物浦大学", "早鸟指数", null)).toBeNull();
    });

    test("assignDenseRanks: 1,2,2,3", () => {
        const ranked = assignDenseRanks([
            { value: 10, id: "a" },
            { value: 8, id: "b" },
            { value: 8, id: "c" },
            { value: 5, id: "d" },
        ]);
        expect(ranked.map((r) => r.rank)).toEqual([1, 2, 2, 3]);
    });

    test("four metrics defined", () => {
        expect(COMMUNITY_METRICS).toHaveLength(4);
        expect(COMMUNITY_METRICS.map((m) => m.metric)).toEqual([
            "completedThisWeek",
            "incompleteThisWeek",
            "avgCompleteDurationMs",
            "completionHourMode",
        ]);
    });
});

async function createSchema(db: Database) {
    await db.exec("PRAGMA foreign_keys = ON");
    await db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            passwordHash TEXT,
            communityRegionId TEXT
        );
        CREATE TABLE tasks (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            dueDate TEXT,
            startTime TEXT,
            endTime TEXT,
            completed BOOLEAN DEFAULT 0,
            completedAt TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
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
            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE community_regions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE community_rank_entries (
            weekStart TEXT NOT NULL,
            regionId TEXT NOT NULL,
            metric TEXT NOT NULL,
            userId TEXT NOT NULL,
            value REAL NOT NULL,
            rank INTEGER NOT NULL,
            displayName TEXT,
            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (weekStart, regionId, metric, userId)
        );
        CREATE TABLE community_rank_meta (
            weekStart TEXT NOT NULL,
            regionId TEXT NOT NULL,
            metric TEXT NOT NULL,
            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            participantCount INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (weekStart, regionId, metric)
        );
    `);
    await db.run(
        `INSERT INTO community_regions (id, name) VALUES (?, ?)`,
        ["region-xjtlu", "西交利物浦大学"],
    );
}

describe("CommunityStore rankings", () => {
    let db: Database;
    let community: CommunityStore;
    let userStatus: UserStatusStore;
    const now = new Date("2026-07-15T12:00:00+08:00");

    beforeEach(async () => {
        db = await open({ filename: ":memory:", driver: SqliteDriver });
        await createSchema(db);
        userStatus = new UserStatusStore(db);
        community = new CommunityStore(db, userStatus);

        // 三名西交用户 + 一名外校
        for (const [id, name, region] of [
            ["u1", "Alice", "region-xjtlu"],
            ["u2", "Bob", "region-xjtlu"],
            ["u3", "Carol", "region-xjtlu"],
            ["u4", "Dave", null],
        ] as const) {
            await db.run(
                `INSERT INTO users (id, email, name, passwordHash, communityRegionId)
                 VALUES (?, ?, ?, 'x', ?)`,
                [id, `${id}@test.com`, name, region],
            );
        }

        // 直接写入本周 user_status
        const weekStart = "2026-07-13T00:00:00+08:00";
        const weekEnd = "2026-07-20T00:00:00+08:00";
        const statuses = [
            // Alice 完成最多
            {
                id: "u1",
                completed: 10,
                incomplete: 1,
                avg: 3600000,
                hour: 9,
            },
            // Bob 中等
            {
                id: "u2",
                completed: 5,
                incomplete: 0,
                avg: 7200000,
                hour: 21,
            },
            // Carol 完成最少，但未完成也少、完成很早
            {
                id: "u3",
                completed: 2,
                incomplete: 3,
                avg: 1800000,
                hour: 8,
            },
        ];
        for (const s of statuses) {
            await db.run(
                `INSERT INTO user_status (
                    userId, weekStart, weekEnd,
                    completedThisWeek, incompleteThisWeek,
                    avgCompleteDurationMs, completionHourMode, modalHours,
                    completedSampleSize, computedAt
                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    s.id,
                    weekStart,
                    weekEnd,
                    s.completed,
                    s.incomplete,
                    s.avg,
                    s.hour,
                    JSON.stringify([s.hour]),
                    s.completed,
                    "2026-07-15T12:00:00+08:00",
                ],
            );
        }
    });

    afterEach(async () => {
        await db.close();
    });

    test("completed-this-week: Alice 第一，称号正确", async () => {
        const r = await community.getRanking("u1", "completedThisWeek", {
            fresh: true,
            now,
        });
        expect(r.region.name).toBe("西交利物浦大学");
        expect(r.me.rank).toBe(1);
        expect(r.me.title).toBe("西交利物浦大学时间利用率第一");
        expect(r.me.value).toBe(10);
        expect(r.totalParticipants).toBe(3);
        expect(r.leaderboard[0].displayName).toBe("Alice");
        expect(r.leaderboard.map((e) => e.userId)).toEqual([
            "u1",
            "u2",
            "u3",
        ]);
    });

    test("incomplete-this-week: lower is better, Bob 第一", async () => {
        const r = await community.getRanking("u2", "incompleteThisWeek", {
            fresh: true,
            now,
        });
        expect(r.me.rank).toBe(1);
        expect(r.me.value).toBe(0);
        expect(r.me.title).toBe("西交利物浦大学日程清爽度第一");
        expect(r.titleLabel).toBe("日程清爽度");
    });

    test("avg-complete-duration: Carol 最快", async () => {
        const r = await community.getRanking("u3", "avgCompleteDurationMs", {
            fresh: true,
            now,
        });
        expect(r.me.rank).toBe(1);
        expect(r.me.title).toBe("西交利物浦大学执行效率第一");
        expect(r.leaderboard[0].value).toBe(1800000);
    });

    test("completion-hour-mode: Carol 最早", async () => {
        const r = await community.getRanking("u3", "completionHourMode", {
            fresh: true,
            now,
        });
        expect(r.me.rank).toBe(1);
        expect(r.me.title).toBe("西交利物浦大学早鸟指数第一");
        expect(r.leaderboard.map((e) => e.value)).toEqual([8, 9, 21]);
    });

    test("no region → CommunityRegionRequiredError", async () => {
        await expect(
            community.getRanking("u4", "completedThisWeek", {
                fresh: true,
                now,
            }),
        ).rejects.toMatchObject({ name: "CommunityRegionRequiredError" });
    });

    test("setUserRegion + createRegion", async () => {
        const region = await community.createRegion("测试大学");
        expect(region.name).toBe("测试大学");
        const joined = await community.setUserRegion("u4", region.id);
        expect(joined.id).toBe(region.id);
        // 无 status 时仍可取榜（0 参与或仅自己）
        await userStatus.getStatus("u4", { fresh: true, now });
        const r = await community.getRanking("u4", "completedThisWeek", {
            fresh: true,
            now,
        });
        expect(r.region.name).toBe("测试大学");
        expect(r.me.eligible).toBe(true);
    });

    test("getAllRankings: 四指标 top 一次返回，默认 limit 100", async () => {
        const all = await community.getAllRankings("u1", {
            fresh: true,
            now,
        });
        expect(Object.keys(all).sort()).toEqual(
            [
                "avgCompleteDurationMs",
                "completedThisWeek",
                "completionHourMode",
                "incompleteThisWeek",
            ].sort(),
        );
        expect(all.completedThisWeek.titleLabel).toBe("时间利用率");
        expect(all.incompleteThisWeek.titleLabel).toBe("日程清爽度");
        expect(all.avgCompleteDurationMs.titleLabel).toBe("执行效率");
        expect(all.completionHourMode.titleLabel).toBe("早鸟指数");

        expect(all.completedThisWeek.me.rank).toBe(1);
        expect(all.completedThisWeek.leaderboard.map((e) => e.userId)).toEqual([
            "u1",
            "u2",
            "u3",
        ]);
        expect(all.incompleteThisWeek.leaderboard[0].userId).toBe("u2");
        expect(all.avgCompleteDurationMs.leaderboard[0].userId).toBe("u3");
        expect(all.completionHourMode.leaderboard[0].userId).toBe("u3");
        expect(all.completedThisWeek.region.name).toBe("西交利物浦大学");
    });

    test("getAllRankings: limit 可裁剪 leaderboard", async () => {
        const all = await community.getAllRankings("u1", {
            fresh: true,
            now,
            limit: 1,
        });
        expect(all.completedThisWeek.leaderboard).toHaveLength(1);
        expect(all.completedThisWeek.leaderboard[0].userId).toBe("u1");
        expect(all.completedThisWeek.totalParticipants).toBe(3);
    });
});
