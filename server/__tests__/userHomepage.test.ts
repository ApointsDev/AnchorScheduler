/**
 * 用户个人主页：公开资料 + 状态 + 社区称号
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { CommunityStore } from "../Services/db/community";
import { UserStatusStore } from "../Services/db/userStatus";
import { UserStore } from "../Services/db/users";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

async function createSchema(db: Database) {
    await db.exec("PRAGMA foreign_keys = ON");
    await db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            passwordHash TEXT,
            communityRegionId TEXT,
            avatar TEXT,
            signature TEXT
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

describe("User homepage", () => {
    let db: Database;
    let users: UserStore;
    let community: CommunityStore;
    let userStatus: UserStatusStore;
    const now = new Date("2026-07-15T12:00:00+08:00");

    beforeEach(async () => {
        db = await open({ filename: ":memory:", driver: SqliteDriver });
        await createSchema(db);
        users = new UserStore(db);
        userStatus = new UserStatusStore(db);
        community = new CommunityStore(db, userStatus);

        await db.run(
            `INSERT INTO users (id, email, name, passwordHash, communityRegionId, avatar, signature)
             VALUES (?, ?, ?, 'x', ?, ?, ?)`,
            [
                "u1",
                "alice@test.com",
                "Alice",
                "region-xjtlu",
                "/uploads/avatars/a.jpg",
                "专注时间管理",
            ],
        );
        await db.run(
            `INSERT INTO users (id, email, name, passwordHash, communityRegionId)
             VALUES (?, ?, ?, 'x', NULL)`,
            ["u2", "bob@test.com", "Bob"],
        );

        await db.run(
            `INSERT INTO user_status (
                userId, weekStart, weekEnd,
                completedThisWeek, incompleteThisWeek,
                avgCompleteDurationMs, completionHourMode, modalHours,
                completedSampleSize, computedAt
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                "u1",
                "2026-07-13T00:00:00+08:00",
                "2026-07-20T00:00:00+08:00",
                10,
                1,
                3600000,
                9,
                JSON.stringify([9]),
                10,
                "2026-07-15T12:00:00+08:00",
            ],
        );
    });

    afterEach(async () => {
        await db.close();
    });

    test("getPublicProfile: 不含邮箱，含头像签名", async () => {
        const pub = await users.getPublicProfile("u1");
        expect(pub).toEqual({
            id: "u1",
            name: "Alice",
            avatar: "/uploads/avatars/a.jpg",
            signature: "专注时间管理",
            communityRegionId: "region-xjtlu",
        });
        expect(pub).not.toHaveProperty("email");
        expect(await users.getPublicProfile("missing")).toBeNull();
    });

    test("getUserTitleSummaries: 四指标称号", async () => {
        const { region, titles } = await community.getUserTitleSummaries(
            "u1",
            { fresh: true, now },
        );
        expect(region?.name).toBe("西交利物浦大学");
        expect(titles).toHaveLength(4);
        const util = titles.find((t) => t.metric === "completedThisWeek");
        expect(util?.titleLabel).toBe("时间利用率");
        expect(util?.rank).toBe(1);
        expect(util?.value).toBe(10);
        expect(util?.title).toBe("西交利物浦大学时间利用率第一");
        expect(util?.eligible).toBe(true);
    });

    test("无社区用户：titles 为空", async () => {
        const { region, titles } = await community.getUserTitleSummaries(
            "u2",
            { fresh: true, now },
        );
        expect(region).toBeNull();
        expect(titles).toEqual([]);
    });

    test("组装主页：isMe + status + titles", async () => {
        const pub = await users.getPublicProfile("u1");
        expect(pub).not.toBeNull();
        const status = await userStatus.getStatus("u1", { now });
        const { region, titles } = await community.getUserTitleSummaries(
            "u1",
            { fresh: true, now },
        );

        const homepage = {
            id: pub!.id,
            name: pub!.name,
            avatar: pub!.avatar,
            signature: pub!.signature,
            isMe: true,
            region,
            status,
            titles,
        };

        expect(homepage.isMe).toBe(true);
        expect(homepage.status.completedThisWeek).toBe(10);
        expect(homepage.titles.map((t) => t.titleLabel)).toEqual([
            "时间利用率",
            "日程清爽度",
            "执行效率",
            "早鸟指数",
        ]);
        // 隐私：主页对象本身不含 email
        expect(JSON.stringify(homepage)).not.toContain("alice@test.com");
    });
});
