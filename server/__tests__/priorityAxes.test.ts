/**
 * 四象限双轴分数工具 + Todo 创建时默认推导
 */
import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import {
    clampAxisScore,
    defaultAxesFromImportance,
    parsePriorityAxesBody,
    quadrantFromAxes,
    resolvePriorityAxes,
} from "../Services/priorityAxes";
import { TagStore } from "../Services/db/tags";
import { TodoStore } from "../Services/db/todos";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

describe("priorityAxes helpers", () => {
    it("clamps to [-1, 1]", () => {
        expect(clampAxisScore(0.5)).toBe(0.5);
        expect(clampAxisScore(2)).toBe(1);
        expect(clampAxisScore(-3)).toBe(-1);
        expect(clampAxisScore("0.25")).toBe(0.25);
        expect(clampAxisScore(null)).toBeNull();
        expect(clampAxisScore("x")).toBeNull();
    });

    it("defaults from importance enum", () => {
        expect(defaultAxesFromImportance("high").importanceScore).toBeGreaterThan(
            0,
        );
        expect(defaultAxesFromImportance("low").importanceScore).toBeLessThan(
            0,
        );
        expect(defaultAxesFromImportance("normal")).toEqual({
            importanceScore: 0,
            urgencyScore: 0,
        });
    });

    it("resolvePriorityAxes fillDefaults", () => {
        const a = resolvePriorityAxes({
            importance: "high",
            fillDefaults: true,
        });
        expect(a.importanceScore).not.toBeNull();
        expect(a.urgencyScore).not.toBeNull();

        const b = resolvePriorityAxes({
            importanceScore: 0.9,
            urgencyScore: -0.2,
            fillDefaults: true,
        });
        expect(b.importanceScore).toBe(0.9);
        expect(b.urgencyScore).toBe(-0.2);
    });

    it("quadrantFromAxes", () => {
        expect(quadrantFromAxes(0.5, 0.5)).toBe("q1");
        expect(quadrantFromAxes(0.5, -0.1)).toBe("q2");
        expect(quadrantFromAxes(-0.1, 0.5)).toBe("q3");
        expect(quadrantFromAxes(-0.1, -0.1)).toBe("q4");
        expect(quadrantFromAxes(null, 0.5)).toBeUndefined();
    });

    it("parsePriorityAxesBody", () => {
        const ok = parsePriorityAxesBody({ importanceScore: 0.3 });
        expect(ok.ok).toBe(true);
        if (ok.ok) expect(ok.axes.importanceScore).toBe(0.3);

        const bad = parsePriorityAxesBody({});
        expect(bad.ok).toBe(false);

        const clamped = parsePriorityAxesBody({ urgencyScore: 99 });
        expect(clamped.ok).toBe(true);
        if (clamped.ok) expect(clamped.axes.urgencyScore).toBe(1);
    });
});

describe("Todo create with priority axes", () => {
    let db: Database;
    let todos: TodoStore;

    beforeEach(async () => {
        db = await open({ filename: ":memory:", driver: SqliteDriver });
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
            ["u1", "a@t.com", "A", "x"],
        );
        const tags = new TagStore(db);
        todos = new TodoStore(db, tags);
    });

    afterEach(async () => {
        await db.close();
    });

    it("fills default scores from importance", async () => {
        const todo = await todos.create("u1", {
            name: "重要作业",
            importance: "high",
        });
        expect(todo.importanceScore).toBe(0.75);
        expect(todo.urgencyScore).toBe(0.5);
    });

    it("accepts explicit axis scores", async () => {
        const todo = await todos.create("u1", {
            name: "琐事",
            importanceScore: -0.8,
            urgencyScore: 0.9,
        });
        expect(todo.importanceScore).toBe(-0.8);
        expect(todo.urgencyScore).toBe(0.9);
    });

    it("updates axes independently", async () => {
        const todo = await todos.create("u1", {
            name: "t",
            importance: "normal",
        });
        const updated = await todos.update("u1", todo.id, {
            importanceScore: 0.2,
            urgencyScore: -0.7,
        });
        expect(updated.importanceScore).toBe(0.2);
        expect(updated.urgencyScore).toBe(-0.7);
        expect(updated.name).toBe("t");
    });
});
