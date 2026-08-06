/**
 * 归档（ARC-001）Store 集成测试（内存 SQLite）
 * 覆盖：手动归档 / 恢复 / 永久删除 / 自动归档 / 官方组保护 /
 *       同名归档分组恢复复用 / 普通列表排除归档 / 越权校验
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import type { Task } from "../types/models";
import { TaskStore } from "../Services/db/tasks";
import { TodoStore } from "../Services/db/todos";
import { TagStore } from "../Services/db/tags";
import { ArchiveStore } from "../Services/db/archive";
import {
    ArchiveForbiddenError,
    ArchiveNotArchivedError,
    ArchiveNotFoundError,
} from "../Services/db/archiveErrors";

type SqliteModule = {
    Database: typeof import("sqlite3").Database;
    default?: { Database: typeof import("sqlite3").Database };
};
const SqliteDriver =
    (sqlite3 as unknown as SqliteModule).Database ||
    (sqlite3 as unknown as SqliteModule).default!.Database;

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
            completedAt DATETIME,
            archivedAt DATETIME,
            lastActivityAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            visibility TEXT DEFAULT 'private',
            authorizedUserIds TEXT,
            blockedUserIds TEXT,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE todos (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT 0,
            dueDate TEXT,
            importance TEXT DEFAULT 'normal',
            importanceScore REAL,
            urgencyScore REAL,
            completedAt DATETIME,
            archivedAt DATETIME,
            lastActivityAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE tags (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL,
            name TEXT NOT NULL,
            color TEXT,
            archivedAt DATETIME,
            lastActivityAt DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(userId, name)
        );
        CREATE TABLE todo_tags (
            todoId TEXT NOT NULL,
            tagId TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (todoId, tagId),
            FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE,
            FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
        );
    `);
    await db.run(
        `INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)`,
        ["user-a", "a@test.com", "User A", "x"],
    );
    await db.run(
        `INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)`,
        ["user-b", "b@test.com", "User B", "x"],
    );
}

async function setup() {
    const db = await open({
        filename: ":memory:",
        driver: SqliteDriver,
    });
    await createSchema(db);
    const noopLog = async () => {};
    const tasks = new TaskStore(db, noopLog, async () => {});
    const tags = new TagStore(db);
    const todos = new TodoStore(db, tags, noopLog);
    const archive = new ArchiveStore(db, tasks, todos, tags);
    return { db, tasks, todos, tags, archive };
}

/** 构造一个最小 Task 对象用于 TaskStore.addTask */
function makeTask(id: string, name = `Task ${id}`): Task {
    return {
        id,
        name,
        description: "",
        dueDate: "",
        startTime: "",
        endTime: "",
        completed: false,
        pushedToMSTodo: false,
    };
}

describe("ArchiveStore（ARC-001）", () => {
    let db: Database;
    let tasks: TaskStore;
    let todos: TodoStore;
    let tags: TagStore;
    let archive: ArchiveStore;

    beforeEach(async () => {
        const ctx = await setup();
        db = ctx.db;
        tasks = ctx.tasks;
        todos = ctx.todos;
        tags = ctx.tags;
        archive = ctx.archive;
    });

    afterEach(async () => {
        await db.close();
    });

    test("listArchived 返回 tasks/todos/tags 三个字段（可为空数组）", async () => {
        const empty = await archive.listArchived("user-a");
        expect(empty).toEqual({ tasks: [], todos: [], tags: [] });
    });

    test("归档日程：写 archivedAt 并刷新 lastActivityAt", async () => {
        await tasks.addTask("user-a", makeTask("t1"));
        const now = new Date("2026-08-06T10:00:00+08:00");
        const archived = (await archive.archive(
            "tasks",
            "t1",
            "user-a",
            now,
        )) as Task;
        expect(archived.archivedAt).toBe("2026-08-06T10:00:00+08:00");
        expect(archived.lastActivityAt).toBe("2026-08-06T10:00:00+08:00");

        const list = await archive.listArchived("user-a");
        expect(list.tasks).toHaveLength(1);
        expect(list.tasks[0].id).toBe("t1");
        expect(list.tasks[0].archivedAt).toBeTruthy();
    });

    test("归档待办 / 分组，并按 archivedAt DESC 排序（最新在前）", async () => {
        await todos.create("user-a", { name: "写周报" });
        await tags.create("user-a", { name: "工作" });
        const todoRow = await db.get(
            `SELECT id FROM todos WHERE userId = ?`,
            ["user-a"],
        );
        const tagRow = await db.get(
            `SELECT id FROM tags WHERE userId = ?`,
            ["user-a"],
        );
        await archive.archive(
            "todos",
            todoRow.id as string,
            "user-a",
            new Date("2026-08-05T00:00:00+08:00"),
        );
        await archive.archive(
            "tags",
            tagRow.id as string,
            "user-a",
            new Date("2026-08-03T00:00:00+08:00"),
        );

        const list = await archive.listArchived("user-a");
        expect(list.todos).toHaveLength(1);
        expect(list.todos[0].archivedAt).toBe("2026-08-05T00:00:00+08:00");
        expect(list.tags).toHaveLength(1);
        expect(list.tags[0].id).toBe(tagRow.id);
        expect(list.tags[0].archivedAt).toBeTruthy();
    });

    test("恢复日程 / 待办 / 分组：archivedAt 置空", async () => {
        await tasks.addTask("user-a", makeTask("t1"));
        await archive.archive("tasks", "t1", "user-a", new Date("2026-08-01T00:00:00+08:00"));
        const restored = (await archive.restore(
            "tasks",
            "t1",
            "user-a",
            new Date("2026-08-06T09:00:00+08:00"),
        )) as Task;
        expect(restored.archivedAt).toBeUndefined();
        expect(restored.lastActivityAt).toBe("2026-08-06T09:00:00+08:00");
        const list = await archive.listArchived("user-a");
        expect(list.tasks).toHaveLength(0);
    });

    test("永久删除已归档内容；未归档内容抛 409", async () => {
        await todos.create("user-a", { name: "todo" });
        const row = await db.get(`SELECT id FROM todos WHERE userId = ?`, [
            "user-a",
        ]);
        const todoId = row.id as string;

        // 未归档 → 409
        await expect(
            archive.deleteArchived("todos", todoId, "user-a"),
        ).rejects.toThrow(ArchiveNotArchivedError);

        // 归档后删除
        await archive.archive("todos", todoId, "user-a", new Date("2026-08-01T00:00:00+08:00"));
        await expect(
            archive.deleteArchived("todos", todoId, "user-a"),
        ).resolves.toBe(true);
        const after = await db.get(`SELECT id FROM todos WHERE id = ?`, [
            todoId,
        ]);
        expect(after).toBeUndefined();
    });

    test("永久删除不存在 / 非本人数据抛 404", async () => {
        await tasks.addTask("user-a", makeTask("t1"));
        await expect(
            archive.deleteArchived("tasks", "t1", "user-a"),
        ).rejects.toThrow(ArchiveNotArchivedError); // 未归档
        // 不存在
        await expect(
            archive.deleteArchived("tasks", "nope", "user-a"),
        ).rejects.toThrow(ArchiveNotFoundError);
        // 非本人（归属 user-b 但用 user-a 操作）
        await tasks.addTask("user-b", makeTask("t2"));
        await archive.archive("tasks", "t2", "user-b", new Date("2026-08-01T00:00:00+08:00"));
        await expect(
            archive.deleteArchived("tasks", "t2", "user-a"),
        ).rejects.toThrow(ArchiveNotFoundError);
    });

    test("官方组（默认）不可归档 → 403", async () => {
        await tags.create("user-a", { name: "默认" });
        const row = await db.get(`SELECT id FROM tags WHERE name = '默认'`, []);
        await expect(
            archive.archive("tags", row.id as string, "user-a"),
        ).rejects.toThrow(ArchiveForbiddenError);
    });

    test("普通列表默认排除归档；includeArchived 可包含", async () => {
        await tasks.addTask("user-a", makeTask("t1"));
        await tasks.addTask("user-a", makeTask("t2"));
        await archive.archive("tasks", "t2", "user-a", new Date("2026-08-01T00:00:00+08:00"));

        const normal = await tasks.getTasksPage("user-a", { limit: 100 });
        expect(normal.tasks.map((t) => t.id)).toEqual(["t1"]);

        const all = await tasks.getTasksPage("user-a", {
            limit: 100,
            includeArchived: true,
        });
        expect(all.tasks.map((t) => t.id).sort()).toEqual(["t1", "t2"]);

        // 待办
        await todos.create("user-a", { name: "a" });
        await todos.create("user-a", { name: "b" });
        const todoRow = await db.get(
            `SELECT id FROM todos WHERE name = 'b'`,
            [],
        );
        await archive.archive("todos", todoRow.id as string, "user-a");
        const todoNormal = await todos.getPage("user-a");
        expect(todoNormal.todos.map((t) => t.name)).toEqual(["a"]);

        // 分组
        await tags.create("user-a", { name: "g1" });
        await tags.create("user-a", { name: "g2" });
        const tagRow = await db.get(`SELECT id FROM tags WHERE name = 'g2'`, []);
        await archive.archive("tags", tagRow.id as string, "user-a");
        const tagNormal = await tags.listByUser("user-a");
        expect(tagNormal.map((t) => t.name)).toEqual(["g1"]);
        const tagAll = await tags.listByUser("user-a", {
            includeArchived: true,
        });
        expect(tagAll.map((t) => t.name).sort()).toEqual(["g1", "g2"]);
    });

    test("创建与已归档分组同名时：恢复并复用原 ID", async () => {
        const tag = await tags.create("user-a", { name: "工作", color: "#f00" });
        const tagId = tag.id;
        await archive.archive("tags", tagId, "user-a", new Date("2026-08-01T00:00:00+08:00"));

        const recreated = await tags.create("user-a", { name: "工作" });
        expect(recreated.id).toBe(tagId);
        expect(recreated.archivedAt).toBeUndefined();
        // 不再出现在归档列表
        const list = await archive.listArchived("user-a");
        expect(list.tags).toHaveLength(0);
    });

    test("自动归档：连续 6 个自然月无活动的分组被归档（可注入时钟）", async () => {
        await tags.create("user-a", { name: "闲置分组" });
        await tags.create("user-a", { name: "活跃分组" });

        const [idle, active] = await Promise.all([
            db.get(`SELECT id FROM tags WHERE name = '闲置分组'`, []),
            db.get(`SELECT id FROM tags WHERE name = '活跃分组'`, []),
        ]);

        // 模拟 lastActivityAt：闲置 = 7 个月前；活跃 = 昨天
        await db.run(`UPDATE tags SET lastActivityAt = ? WHERE id = ?`, [
            "2025-12-15T00:00:00+08:00",
            idle.id,
        ]);
        await db.run(`UPDATE tags SET lastActivityAt = ? WHERE id = ?`, [
            "2026-08-05T00:00:00+08:00",
            active.id,
        ]);

        const now = new Date("2026-08-06T12:00:00+08:00");
        const count = await archive.autoArchiveTags(now, 6);
        expect(count).toBe(1);

        const archived = await tags.getById("user-a", idle.id);
        expect(archived?.archivedAt).toBeTruthy();
        const stillActive = await tags.getById("user-a", active.id);
        expect(stillActive?.archivedAt).toBeUndefined();
    });

    test("归档他人数据 → 404（越权校验）", async () => {
        await tasks.addTask("user-b", makeTask("t-b"));
        await expect(
            archive.archive("tasks", "t-b", "user-a"),
        ).rejects.toThrow(ArchiveNotFoundError);
    });
});
