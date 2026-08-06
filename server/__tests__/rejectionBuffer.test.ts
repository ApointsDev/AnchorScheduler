/**
 * 事件拒绝缓冲池单元测试
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import {
    RejectionBufferStore,
    clampRejectionHours,
    REJECTION_BUFFER_TTL_MS,
} from "../Services/db/rejectionBuffer";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

async function setup() {
    const db = await open({
        filename: ":memory:",
        driver: SqliteDriver,
    });
    await db.exec("PRAGMA foreign_keys = ON");
    await db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL
        );
        CREATE TABLE rejection_buffer (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            kind TEXT NOT NULL,
            sourceQueueId TEXT,
            rawRequest TEXT NOT NULL,
            rejectedAt TEXT NOT NULL,
            expiresAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE INDEX idx_rejection_buffer_user_kind_rejected
            ON rejection_buffer(userId, kind, rejectedAt);
        CREATE INDEX idx_rejection_buffer_expires
            ON rejection_buffer(expiresAt);
    `);
    await db.run(
        `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`,
        ["u1", "u1@test.com", "U1"],
    );
    await db.run(
        `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`,
        ["u2", "u2@test.com", "U2"],
    );
    return { db, store: new RejectionBufferStore(db) };
}

describe("clampRejectionHours", () => {
    it("defaults to 24", () => {
        expect(clampRejectionHours(undefined)).toBe(24);
        expect(clampRejectionHours(null)).toBe(24);
        expect(clampRejectionHours("")).toBe(24);
        expect(clampRejectionHours("abc")).toBe(24);
    });

    it("clamps to 1–24", () => {
        expect(clampRejectionHours(0)).toBe(1);
        expect(clampRejectionHours(-5)).toBe(1);
        expect(clampRejectionHours(3)).toBe(3);
        expect(clampRejectionHours(24)).toBe(24);
        expect(clampRejectionHours(48)).toBe(24);
        expect(clampRejectionHours("6")).toBe(6);
    });
});

describe("RejectionBufferStore", () => {
    let db: Database;
    let store: RejectionBufferStore;

    beforeEach(async () => {
        const ctx = await setup();
        db = ctx.db;
        store = ctx.store;
    });

    afterEach(async () => {
        await db.close();
    });

    it("adds and lists schedule + todo rejections", async () => {
        const now = new Date("2026-07-15T12:00:00+08:00");
        await store.add(
            "u1",
            "schedule",
            { args: { name: "会议", startTime: "x", endTime: "y" } },
            "q-s1",
            now,
        );
        await store.add(
            "u1",
            "todo",
            { args: { name: "作业", dueDate: "z" } },
            "q-t1",
            now,
        );

        const all = await store.list("u1", { hours: 24, now });
        expect(all.hours).toBe(24);
        expect(all.items).toHaveLength(2);

        const schedules = await store.list("u1", {
            kind: "schedule",
            hours: 24,
            now,
        });
        expect(schedules.items).toHaveLength(1);
        expect(schedules.items[0].kind).toBe("schedule");
        expect((schedules.items[0].rawRequest as any).args.name).toBe("会议");
        expect(schedules.items[0].sourceQueueId).toBe("q-s1");

        const todos = await store.list("u1", {
            kind: "todo",
            hours: 24,
            now,
        });
        expect(todos.items).toHaveLength(1);
        expect(todos.items[0].kind).toBe("todo");
    });

    it("filters by hours window", async () => {
        const now = new Date("2026-07-15T12:00:00+08:00");
        // 2 hours ago
        await store.add(
            "u1",
            "schedule",
            { name: "recent" },
            "q1",
            new Date(now.getTime() - 2 * 60 * 60 * 1000),
        );
        // 10 hours ago
        await store.add(
            "u1",
            "schedule",
            { name: "old" },
            "q2",
            new Date(now.getTime() - 10 * 60 * 60 * 1000),
        );

        const h3 = await store.list("u1", { hours: 3, now });
        expect(h3.hours).toBe(3);
        expect(h3.items).toHaveLength(1);
        expect((h3.items[0].rawRequest as any).name).toBe("recent");

        const h12 = await store.list("u1", { hours: 12, now });
        expect(h12.items).toHaveLength(2);
    });

    it("deletes expired records (>24h)", async () => {
        const now = new Date("2026-07-15T12:00:00+08:00");
        const expiredAt = new Date(
            now.getTime() - REJECTION_BUFFER_TTL_MS - 60_000,
        );
        await store.add(
            "u1",
            "todo",
            { name: "gone" },
            "q-exp",
            expiredAt,
        );
        await store.add("u1", "todo", { name: "keep" }, "q-ok", now);

        const deleted = await store.deleteExpired(now);
        expect(deleted).toBe(1);

        const list = await store.list("u1", { hours: 24, now });
        expect(list.items).toHaveLength(1);
        expect((list.items[0].rawRequest as any).name).toBe("keep");
    });

    it("list() auto-cleans expired before returning", async () => {
        const now = new Date("2026-07-15T12:00:00+08:00");
        const expiredAt = new Date(
            now.getTime() - REJECTION_BUFFER_TTL_MS - 1000,
        );
        await store.add("u1", "schedule", { name: "x" }, null, expiredAt);

        const list = await store.list("u1", { hours: 24, now });
        expect(list.items).toHaveLength(0);

        const row = await db.get(
            `SELECT COUNT(*) as c FROM rejection_buffer WHERE userId = ?`,
            ["u1"],
        );
        expect(row.c).toBe(0);
    });

    it("scopes by userId", async () => {
        const now = new Date("2026-07-15T12:00:00+08:00");
        await store.add("u1", "schedule", { name: "a" }, null, now);
        await store.add("u2", "schedule", { name: "b" }, null, now);

        const u1 = await store.list("u1", { hours: 24, now });
        expect(u1.items).toHaveLength(1);
        expect((u1.items[0].rawRequest as any).name).toBe("a");
    });
});
