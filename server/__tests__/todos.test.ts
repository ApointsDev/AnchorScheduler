/**
 * 待办 + 标签 Store 集成测试（内存 SQLite）
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { TagStore, TagConflictError, TagNotFoundError } from "../Services/db/tags";
import { TodoStore, TodoNotFoundError } from "../Services/db/todos";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

async function createSchema(db: Database) {
    await db.exec("PRAGMA foreign_keys = ON");
    await db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            passwordHash TEXT
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
    const tags = new TagStore(db);
    const todos = new TodoStore(db, tags);
    return { db, tags, todos };
}

describe("Todo + Tag stores", () => {
    let db: Database;
    let tags: TagStore;
    let todos: TodoStore;

    beforeEach(async () => {
        const ctx = await setup();
        db = ctx.db;
        tags = ctx.tags;
        todos = ctx.todos;
    });

    afterEach(async () => {
        await db.close();
    });

    test("create todo without tags", async () => {
        const todo = await todos.create("user-a", { name: "买牛奶" });
        expect(todo.name).toBe("买牛奶");
        expect(todo.completed).toBe(false);
        expect(todo.tags).toEqual([]);
        expect(todo.importance).toBe("normal");
    });

    test("create todo with multiple tags via tagNames", async () => {
        const todo = await todos.create("user-a", {
            name: "交作业",
            tagNames: ["课程", "CST401"],
            importance: "high",
        });
        expect(todo.tags).toHaveLength(2);
        const names = todo.tags.map((t) => t.name).sort();
        expect(names).toEqual(["CST401", "课程"]);
        expect(todo.importance).toBe("high");

        const allTags = await tags.listByUser("user-a");
        expect(allTags).toHaveLength(2);
    });

    test("create todo with tagIds + tagNames merged", async () => {
        const existing = await tags.create("user-a", {
            name: "工作",
            color: "#ff0000",
        });
        const todo = await todos.create("user-a", {
            name: "周报",
            tagIds: [existing.id],
            tagNames: ["工作", "周报"],
        });
        expect(todo.tags).toHaveLength(2);
        const names = new Set(todo.tags.map((t) => t.name));
        expect(names.has("工作")).toBe(true);
        expect(names.has("周报")).toBe(true);
    });

    test("invalid tagId throws TagNotFoundError", async () => {
        await expect(
            todos.create("user-a", {
                name: "x",
                tagIds: ["no-such-id"],
            }),
        ).rejects.toBeInstanceOf(TagNotFoundError);
    });

    test("update / complete / delete todo", async () => {
        const todo = await todos.create("user-a", { name: "草稿" });
        const updated = await todos.update("user-a", todo.id, {
            name: "完成稿",
            completed: true,
        });
        expect(updated.name).toBe("完成稿");
        expect(updated.completed).toBe(true);

        const ok = await todos.delete("user-a", todo.id);
        expect(ok).toBe(true);
        expect(await todos.getById("user-a", todo.id)).toBeNull();
    });

    test("replace tags on update; empty clears tags", async () => {
        const todo = await todos.create("user-a", {
            name: "A",
            tagNames: ["t1", "t2"],
        });
        expect(todo.tags).toHaveLength(2);

        const one = await todos.update("user-a", todo.id, {
            replaceTags: true,
            tagNames: ["t3"],
        });
        expect(one.tags.map((t) => t.name)).toEqual(["t3"]);

        const none = await todos.update("user-a", todo.id, {
            replaceTags: true,
            tagIds: [],
            tagNames: [],
        });
        expect(none.tags).toEqual([]);
    });

    test("filter by tagIds AND semantics", async () => {
        await todos.create("user-a", { name: "onlyA", tagNames: ["A"] });
        await todos.create("user-a", { name: "onlyB", tagNames: ["B"] });
        await todos.create("user-a", {
            name: "both",
            tagNames: ["A", "B"],
        });

        const tagA = await tags.getByName("user-a", "A");
        const tagB = await tags.getByName("user-a", "B");
        expect(tagA && tagB).toBeTruthy();

        const { todos: both, total } = await todos.getPage("user-a", {
            tagIds: [tagA!.id, tagB!.id],
        });
        expect(total).toBe(1);
        expect(both[0].name).toBe("both");
    });

    test("reverse lookup getByTagId", async () => {
        const tag = await tags.create("user-a", { name: "课程" });
        await todos.create("user-a", {
            name: "作业1",
            tagIds: [tag.id],
        });
        await todos.create("user-a", {
            name: "作业2",
            tagIds: [tag.id],
        });
        await todos.create("user-a", { name: "无关" });

        const { todos: list, total } = await todos.getByTagId(
            "user-a",
            tag.id,
        );
        expect(total).toBe(2);
        expect(list.map((t) => t.name).sort()).toEqual(["作业1", "作业2"]);
    });

    test("user isolation", async () => {
        const todoA = await todos.create("user-a", {
            name: "私有",
            tagNames: ["secret"],
        });
        expect(await todos.getById("user-b", todoA.id)).toBeNull();

        const tagA = (await tags.listByUser("user-a"))[0];
        expect(await tags.getById("user-b", tagA.id)).toBeNull();

        const { total } = await todos.getPage("user-b");
        expect(total).toBe(0);
    });

    test("tag name conflict", async () => {
        await tags.create("user-a", { name: "dup" });
        await expect(
            tags.create("user-a", { name: "dup" }),
        ).rejects.toBeInstanceOf(TagConflictError);
    });

    test("delete tag keeps todos, removes association", async () => {
        const todo = await todos.create("user-a", {
            name: "带标签",
            tagNames: ["tmp"],
        });
        const tagId = todo.tags[0].id;
        await tags.delete("user-a", tagId);

        const after = await todos.getById("user-a", todo.id);
        expect(after).not.toBeNull();
        expect(after!.tags).toEqual([]);
    });

    test("TodoNotFoundError on update missing", async () => {
        await expect(
            todos.update("user-a", "missing", { name: "x" }),
        ).rejects.toBeInstanceOf(TodoNotFoundError);
    });
});
