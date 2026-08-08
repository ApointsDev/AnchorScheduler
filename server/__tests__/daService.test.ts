/**
 * DA 校园大事件（多校）单元测试
 * 覆盖：SchoolStore / DaStore / isSystemAdmin / isSchoolWideCandidate 启发式
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { SchoolStore } from "../Services/db/schools";
import { DaStore } from "../Services/db/da";
import {
    isSchoolWideCandidate,
    DEFAULT_SETTINGS,
    isSystemAdmin,
    daAccountEmailFor,
} from "../Services/daHelpers";

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
        CREATE TABLE schools (
            id TEXT PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            eventsEmail TEXT,
            themeColor TEXT,
            enabled INTEGER NOT NULL DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE school_admins (
            schoolId TEXT NOT NULL,
            email TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (schoolId, email),
            FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE
        );
        CREATE TABLE da_settings (
            schoolId TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT NOT NULL,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (schoolId, key),
            FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE
        );
        CREATE TABLE da_student_optins (
            schoolId TEXT NOT NULL,
            userId TEXT NOT NULL,
            optedIn INTEGER NOT NULL DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (schoolId, userId),
            FOREIGN KEY (schoolId) REFERENCES schools(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
    await db.run(
        `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`,
        ["u1", "u1@test.com", "U1"],
    );
    await db.run(
        `INSERT INTO users (id, email, name) VALUES (?, ?, ?)`,
        ["u2", "u2@test.com", "U2"],
    );
    return {
        db,
        schools: new SchoolStore(db),
        da: new DaStore(db),
    };
}

describe("SchoolStore", () => {
    let db: Database;
    let store: SchoolStore;

    beforeEach(async () => {
        const ctx = await setup();
        db = ctx.db;
        store = ctx.schools;
    });

    afterEach(async () => {
        await db.close();
    });

    it("creates, lists and gets school by slug", async () => {
        await store.create({
            id: "s1",
            slug: "xjtlu",
            name: "西交利物浦大学",
            eventsEmail: "da@xjtlu.edu.cn",
        });
        await store.create({
            id: "s2",
            slug: "other",
            name: "Other University",
        });

        const all = await store.list({ includeDisabled: true });
        expect(all.length).toBe(2);

        const xjtlu = await store.getBySlug("xjtlu");
        expect(xjtlu?.name).toBe("西交利物浦大学");
        expect(xjtlu?.eventsEmail).toBe("da@xjtlu.edu.cn");
        expect(xjtlu?.enabled).toBe(1);

        const onlyEnabled = await store.list();
        expect(onlyEnabled.length).toBe(2);
    });

    it("list() excludes disabled schools", async () => {
        await store.create({ id: "s1", slug: "a", name: "A" });
        await store.create({ id: "s2", slug: "b", name: "B" });
        await store.setEnabled("s2", false);

        const enabled = await store.list();
        expect(enabled.map((s) => s.slug)).toEqual(["a"]);
        const all = await store.list({ includeDisabled: true });
        expect(all.length).toBe(2);
    });

    it("update / setEnabled / delete", async () => {
        await store.create({ id: "s1", slug: "a", name: "A" });
        await store.update("s1", { name: "A2", slug: "a2" });
        const updated = await store.getById("s1");
        expect(updated?.name).toBe("A2");
        expect(updated?.slug).toBe("a2");

        await store.setEnabled("s1", false);
        expect((await store.getById("s1"))?.enabled).toBe(0);

        expect(await store.delete("s1")).toBe(true);
        expect(await store.getById("s1")).toBeNull();
    });

    it("manages school admins (case-insensitive email)", async () => {
        await store.create({ id: "s1", slug: "a", name: "A" });
        await store.addAdmin("s1", "DA@Example.com");
        expect(await store.isAdmin("s1", "da@example.com")).toBe(true);
        expect(await store.isAdmin("s1", "other@example.com")).toBe(false);

        const list = await store.listAdmins("s1");
        expect(list[0].email).toBe("da@example.com");

        expect(await store.removeAdmin("s1", "DA@example.com")).toBe(true);
        expect(await store.isAdmin("s1", "da@example.com")).toBe(false);
    });
});

describe("DaStore（按学校作用域）", () => {
    let db: Database;
    let store: DaStore;

    beforeEach(async () => {
        const ctx = await setup();
        db = ctx.db;
        store = ctx.da;
        await ctx.schools.create({ id: "s1", slug: "xjtlu", name: "XJTLU" });
        await ctx.schools.create({ id: "s2", slug: "other", name: "Other" });
    });

    afterEach(async () => {
        await db.close();
    });

    it("settings are scoped per school", async () => {
        await store.setSetting("s1", "pageTitle", "XJTLU Events");
        await store.setSetting("s2", "pageTitle", "Other Events");

        expect(await store.getSetting("s1", "pageTitle")).toBe("XJTLU Events");
        expect(await store.getSetting("s2", "pageTitle")).toBe("Other Events");

        const s1all = await store.getAllSettings("s1");
        expect(Object.keys(s1all)).toEqual(["pageTitle"]);
    });

    it("optin CRUD + listSchoolsByOptinUser", async () => {
        await store.setOptin("s1", "u1", true);
        await store.setOptin("s2", "u1", false);
        await store.setOptin("s1", "u2", true);

        expect(await store.getOptin("s1", "u1")).not.toBeNull();
        expect((await store.getOptin("s1", "u1"))?.optedIn).toBe(1);

        const opted = await store.listSchoolsByOptinUser("u1");
        expect(opted.map((o) => o.schoolId)).toEqual(["s1"]);

        const { rows, total } = await store.listOptins("s1");
        expect(total).toBe(2);
        expect(rows.length).toBe(2);
    });
});

describe("DaService 权限与启发式", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("isSystemAdmin reads ADMIN_EMAILS", () => {
        process.env.ADMIN_EMAILS = "admin@x.com, Boss@X.com";
        expect(isSystemAdmin("admin@x.com")).toBe(true);
        expect(isSystemAdmin("boss@x.com")).toBe(true);
        expect(isSystemAdmin("other@x.com")).toBe(false);

        delete process.env.ADMIN_EMAILS;
        expect(isSystemAdmin("admin@x.com")).toBe(false);
    });

    it("daAccountEmailFor builds per-school account email", () => {
        expect(daAccountEmailFor("xjtlu")).toMatch(/^da-xjtlu@/);
    });

    it("isSchoolWideCandidate: college domain whitelist", () => {
        const settings: Record<string, string> = {
            ...DEFAULT_SETTINGS,
            collegeDomains: "xjtlu.edu.cn, ibss.xjtlu.edu.cn",
        };
        expect(
            isSchoolWideCandidate(
                {
                    id: "1",
                    subject: "Announcement",
                    from: { name: "X", address: "org@ibss.xjtlu.edu.cn" },
                    receivedAt: "",
                    isRead: true,
                } as any,
                settings,
            ),
        ).toBe(true);
        expect(
            isSchoolWideCandidate(
                {
                    id: "2",
                    subject: "Announcement",
                    from: { name: "X", address: "spam@gmail.com" },
                    receivedAt: "",
                    isRead: true,
                } as any,
                settings,
            ),
        ).toBe(false);
    });

    it("isSchoolWideCandidate: subject keywords (default)", () => {
        const settings: Record<string, string> = {
            ...DEFAULT_SETTINGS,
        };
        expect(
            isSchoolWideCandidate(
                {
                    id: "1",
                    subject: "【讲座】人工智能前沿讲座",
                    from: { name: "X", address: "spam@gmail.com" },
                    receivedAt: "",
                    isRead: true,
                } as any,
                settings,
            ),
        ).toBe(true);
        expect(
            isSchoolWideCandidate(
                {
                    id: "2",
                    subject: "Meeting with tutor",
                    from: { name: "X", address: "tutor@xjtlu.edu.cn" },
                    receivedAt: "",
                    isRead: true,
                } as any,
                settings,
            ),
        ).toBe(false);
    });
});
