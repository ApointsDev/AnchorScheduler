/**
 * 未测试 Store 集成测试（内存 SQLite）
 *
 * 覆盖的 store（之前没有被单独测试的）：
 * - ChatContextStore
 * - ScheduleQueueStore
 * - TodoQueueStore
 * - FollowStore
 * - SharedScheduleStore
 * - EmailAiStore
 * - UserLogStore
 */

import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { ChatContextStore } from "../Services/db/chatContext";
import { ScheduleQueueStore } from "../Services/db/scheduleQueue";
import { TodoQueueStore } from "../Services/db/todoQueue";
import { FollowStore } from "../Services/db/follows";
import { SharedScheduleStore } from "../Services/db/sharedSchedule";
import { EmailAiStore } from "../Services/db/emailAi";
import { UserLogStore } from "../Services/db/userLogs";

const SqliteDriver =
  (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

async function createSchema(db: Database) {
  await db.exec("PRAGMA foreign_keys = ON");
  await db.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      signature TEXT
    );
    CREATE TABLE chat_history (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      messages TEXT NOT NULL DEFAULT '[]',
      title TEXT NOT NULL DEFAULT '新对话',
      isActive INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE schedule_queue (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      rawRequest TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE todo_queue (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      rawRequest TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE user_follows (
      followerId TEXT NOT NULL,
      followedId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (followerId, followedId),
      FOREIGN KEY (followerId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (followedId) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE shared_schedules (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL DEFAULT '日程分享',
      dateStart TEXT,
      dateEnd TEXT,
      taskIds TEXT,
      expiresAt TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE ai_processed_emails (
      userId TEXT NOT NULL,
      emailId TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'imap',
      processedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, emailId, provider),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE user_logs (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      payload TEXT,
      time DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  // Insert test users
  await db.run(`INSERT INTO users (id, email, name) VALUES (?, ?, ?)`, ["u1", "u1@test.com", "User One"]);
  await db.run(`INSERT INTO users (id, email, name) VALUES (?, ?, ?)`, ["u2", "u2@test.com", "User Two"]);
  await db.run(`INSERT INTO users (id, email, name) VALUES (?, ?, ?)`, ["u3", "u3@test.com", "User Three"]);
}

async function setup() {
  const db = await open({ filename: ":memory:", driver: SqliteDriver });
  await createSchema(db);
  return {
    db,
    chatContext: new ChatContextStore(db),
    scheduleQueue: new ScheduleQueueStore(db),
    todoQueue: new TodoQueueStore(db),
    follows: new FollowStore(db),
    sharedSchedule: new SharedScheduleStore(db),
    emailAi: new EmailAiStore(db),
    userLogs: new UserLogStore(db),
  };
}

// ────────────────────────────────────────────────────────────────
describe("ChatContextStore", () => {
  let db: Database;
  let store: ChatContextStore;

  beforeEach(async () => {
    const s = await setup();
    db = s.db;
    store = s.chatContext;
  });

  test("create returns a new context id", async () => {
    const id = await store.create("u1");
    expect(id).toBeTruthy();
    expect(typeof id).toBe("string");
  });

  test("listContexts returns created contexts", async () => {
    await store.create("u1");
    await store.create("u1");
    const contexts = await store.listContexts("u1");
    expect(contexts).toHaveLength(2);
    expect(contexts[0].title).toBe("新对话");
    expect(contexts[0].messageCount).toBe(0);
  });

  test("save and getMessages round-trip", async () => {
    const id = await store.create("u1");
    const msgs = JSON.stringify([{ role: "user", content: "Hello" }]);
    await store.save("u1", msgs, id);
    const result = await store.getMessages(id);
    expect(result).toBeTruthy();
    expect(JSON.parse(result!.messages)).toEqual([{ role: "user", content: "Hello" }]);
  });

  test("auto-title from user message", async () => {
    const id = await store.create("u1");
    const msgs = JSON.stringify([{ role: "user", content: "What is the weather like today?" }]);
    await store.save("u1", msgs, id);
    const contexts = await store.listContexts("u1");
    expect(contexts[0].title).toContain("What is the weather");
  });

  test("getActiveHistory returns active context", async () => {
    const id = await store.create("u1");
    const msgs = JSON.stringify([{ role: "user", content: "test" }]);
    await store.save("u1", msgs, id);
    const active = await store.getActiveHistory("u1");
    expect(active).toBeTruthy();
    expect(active!.id).toBe(id);
  });

  test("delete removes context", async () => {
    const id = await store.create("u1");
    await store.delete(id);
    const result = await store.getMessages(id);
    expect(result).toBeNull();
  });

  test("listContexts respects user isolation", async () => {
    await store.create("u1");
    await store.create("u2");
    expect(await store.listContexts("u1")).toHaveLength(1);
    expect(await store.listContexts("u2")).toHaveLength(1);
  });
});

// ────────────────────────────────────────────────────────────────
describe("ScheduleQueueStore", () => {
  let store: ScheduleQueueStore;

  beforeEach(async () => {
    const s = await setup();
    store = s.scheduleQueue;
  });

  test("add and getByUser round-trip", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Meeting" }));
    const items = await store.getByUser("u1");
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(id);
    expect(items[0].status).toBe("pending");
  });

  test("getById returns correct item", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Meeting" }));
    const item = await store.getById(id);
    expect(item).toBeTruthy();
    expect(item.userId).toBe("u1");
  });

  test("getById returns null for unknown id", async () => {
    expect(await store.getById("nonexistent")).toBeUndefined();
  });

  test("updateStatus changes the status", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Meeting" }));
    await store.updateStatus(id, "approved");
    const item = await store.getById(id);
    expect(item.status).toBe("approved");
  });

  test("delete removes item", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Meeting" }));
    await store.delete(id);
    expect(await store.getById(id)).toBeUndefined();
    expect(await store.getByUser("u1")).toHaveLength(0);
  });

  test("user isolation", async () => {
    await store.add("u1", JSON.stringify({ name: "A" }));
    await store.add("u2", JSON.stringify({ name: "B" }));
    expect(await store.getByUser("u1")).toHaveLength(1);
    expect(await store.getByUser("u2")).toHaveLength(1);
  });
});

// ────────────────────────────────────────────────────────────────
describe("TodoQueueStore", () => {
  let store: TodoQueueStore;

  beforeEach(async () => {
    const s = await setup();
    store = s.todoQueue;
  });

  test("add and getByUser round-trip", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Buy milk" }));
    const items = await store.getByUser("u1");
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(id);
    expect(items[0].status).toBe("pending");
  });

  test("getById returns correct item", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Buy milk" }));
    const item = await store.getById(id);
    expect(item).toBeTruthy();
    expect(item.userId).toBe("u1");
  });

  test("updateStatus changes status", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Buy milk" }));
    await store.updateStatus(id, "approved");
    expect((await store.getById(id)).status).toBe("approved");
  });

  test("delete removes item", async () => {
    const id = await store.add("u1", JSON.stringify({ name: "Buy milk" }));
    await store.delete(id);
    expect(await store.getById(id)).toBeUndefined();
  });

  test("user isolation", async () => {
    await store.add("u1", JSON.stringify({ name: "A" }));
    await store.add("u2", JSON.stringify({ name: "B" }));
    expect(await store.getByUser("u1")).toHaveLength(1);
    expect(await store.getByUser("u2")).toHaveLength(1);
  });
});

// ────────────────────────────────────────────────────────────────
describe("FollowStore", () => {
  let store: FollowStore;

  beforeEach(async () => {
    const s = await setup();
    store = s.follows;
  });

  test("follow creates a relationship", async () => {
    const ok = await store.follow("u1", "u2");
    expect(ok).toBe(true);
  });

  test("follow is idempotent", async () => {
    await store.follow("u1", "u2");
    const ok2 = await store.follow("u1", "u2");
    expect(ok2).toBe(false);
  });

  test("cannot follow self", async () => {
    const ok = await store.follow("u1", "u1");
    expect(ok).toBe(false);
  });

  test("isFollowing returns correct state", async () => {
    expect(await store.isFollowing("u1", "u2")).toBe(false);
    await store.follow("u1", "u2");
    expect(await store.isFollowing("u1", "u2")).toBe(true);
    expect(await store.isFollowing("u2", "u1")).toBe(false);
  });

  test("getFollowingCount and getFollowerCount", async () => {
    await store.follow("u1", "u2");
    await store.follow("u1", "u3");
    expect(await store.getFollowingCount("u1")).toBe(2);
    expect(await store.getFollowerCount("u2")).toBe(1);
    expect(await store.getFollowerCount("u3")).toBe(1);
  });

  test("unfollow removes relationship", async () => {
    await store.follow("u1", "u2");
    const ok = await store.unfollow("u1", "u2");
    expect(ok).toBe(true);
    expect(await store.isFollowing("u1", "u2")).toBe(false);
  });

  test("unfollow nonexistent returns false", async () => {
    expect(await store.unfollow("u1", "u2")).toBe(false);
  });

  test("getFollowing returns user info with pagination", async () => {
    await store.follow("u1", "u2");
    await store.follow("u1", "u3");
    const result = await store.getFollowing("u1", 1, 0);
    expect(result.users).toHaveLength(1);
    expect(result.total).toBe(2);
    expect(result.users[0].name).toBeTruthy();
  });

  test("getFollowers returns followers", async () => {
    await store.follow("u1", "u3");
    await store.follow("u2", "u3");
    const result = await store.getFollowers("u3");
    expect(result.total).toBe(2);
    expect(result.users).toHaveLength(2);
  });
});

// ────────────────────────────────────────────────────────────────
describe("SharedScheduleStore", () => {
  let store: SharedScheduleStore;

  beforeEach(async () => {
    const s = await setup();
    store = s.sharedSchedule;
  });

  test("create and getByToken round-trip", async () => {
    await store.create({
      id: "share-1",
      userId: "u1",
      token: "abc123",
      name: "My Schedule",
      dateStart: "2026-01-01",
      dateEnd: "2026-12-31",
    });
    const share = await store.getByToken("abc123");
    expect(share).toBeTruthy();
    expect(share.userId).toBe("u1");
    expect(share.name).toBe("My Schedule");
    expect(share.dateStart).toBe("2026-01-01");
  });

  test("getByToken returns null for unknown token", async () => {
    expect(await store.getByToken("nonexistent")).toBeNull();
  });

  test("listByUser returns user's shares", async () => {
    await store.create({
      id: "share-1", userId: "u1", token: "t1", name: "A",
    });
    await store.create({
      id: "share-2", userId: "u1", token: "t2", name: "B",
    });
    await store.create({
      id: "share-3", userId: "u2", token: "t3", name: "C",
    });
    const shares1 = await store.listByUser("u1");
    expect(shares1).toHaveLength(2);
    expect(await store.listByUser("u2")).toHaveLength(1);
  });

  test("delete removes share and checks ownership", async () => {
    await store.create({ id: "s1", userId: "u1", token: "t1", name: "A" });
    const ok = await store.delete("t1", "u1");
    expect(ok).toBe(true);
    expect(await store.getByToken("t1")).toBeNull();
  });

  test("delete fails for wrong user", async () => {
    await store.create({ id: "s1", userId: "u1", token: "t1", name: "A" });
    const ok = await store.delete("t1", "u2");
    expect(ok).toBe(false);
    expect(await store.getByToken("t1")).toBeTruthy();
  });

  test("expiresAt is optional", async () => {
    await store.create({ id: "s1", userId: "u1", token: "t1", name: "NoExpiry" });
    const share = await store.getByToken("t1");
    expect(share.expiresAt).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────
describe("EmailAiStore", () => {
  let store: EmailAiStore;

  beforeEach(async () => {
    const s = await setup();
    store = s.emailAi;
  });

  test("markProcessed and isProcessed round-trip", async () => {
    await store.markProcessed("u1", "email-1");
    expect(await store.isProcessed("u1", "email-1")).toBe(true);
    expect(await store.isProcessed("u1", "email-2")).toBe(false);
  });

  test("markProcessed is idempotent", async () => {
    await store.markProcessed("u1", "email-1");
    await store.markProcessed("u1", "email-1");
    expect(await store.isProcessed("u1", "email-1")).toBe(true);
  });

  test("getProcessedIds returns all processed emails", async () => {
    await store.markProcessed("u1", "email-1");
    await store.markProcessed("u1", "email-2");
    const ids = await store.getProcessedIds("u1");
    expect(ids.size).toBe(2);
    expect(ids.has("email-1")).toBe(true);
    expect(ids.has("email-2")).toBe(true);
  });

  test("deleteProcessed removes record", async () => {
    await store.markProcessed("u1", "email-1");
    await store.deleteProcessed("u1", "email-1");
    expect(await store.isProcessed("u1", "email-1")).toBe(false);
  });

  test("user isolation", async () => {
    await store.markProcessed("u1", "email-1");
    expect(await store.isProcessed("u2", "email-1")).toBe(false);
  });

  test("provider defaults to imap", async () => {
    await store.markProcessed("u1", "email-1");
    expect(await store.isProcessed("u1", "email-1")).toBe(true);
    // Different provider is not considered processed
    expect(await store.isProcessed("u1", "email-1", "exchange")).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────────
describe("UserLogStore", () => {
  let store: UserLogStore;

  beforeEach(async () => {
    const s = await setup();
    store = s.userLogs;
  });

  test("add creates a log entry", async () => {
    const entry = await store.add("u1", "login", "User logged in", { ip: "1.2.3.4" });
    expect(entry.id).toBeTruthy();
    expect(entry.type).toBe("login");
    expect(entry.message).toBe("User logged in");
    expect(entry.payload).toEqual({ ip: "1.2.3.4" });
    expect(entry.time).toBeTruthy();
  });

  test("getPage returns paginated logs", async () => {
    await store.add("u1", "login", "Login 1");
    await store.add("u1", "login", "Login 2");
    await store.add("u1", "taskCreated", "Created task");
    const { logs, total } = await store.getPage("u1", { limit: 2, offset: 0 });
    expect(logs).toHaveLength(2);
    expect(total).toBe(3);
  });

  test("getPage filters by type", async () => {
    await store.add("u1", "login", "Login 1");
    await store.add("u1", "taskCreated", "Created task");
    const { logs, total } = await store.getPage("u1", { type: "login" });
    expect(total).toBe(1);
    expect(logs[0].type).toBe("login");
  });

  test("getPage filters by time range", async () => {
    await store.add("u1", "login", "Old");
    // No way to control time with DEFAULT CURRENT_TIMESTAMP in test,
    // but we can verify the filtering logic doesn't crash
    const { total } = await store.getPage("u1", { since: "2000-01-01" });
    expect(total).toBeGreaterThanOrEqual(1);
  });

  test("user isolation", async () => {
    await store.add("u1", "login", "U1 login");
    await store.add("u2", "login", "U2 login");
    expect((await store.getPage("u1")).total).toBe(1);
    expect((await store.getPage("u2")).total).toBe(1);
  });

  test("setLogListener fires on add", async () => {
    const events: any[] = [];
    store.setLogListener((userId, log) => {
      events.push({ userId, log });
    });
    await store.add("u1", "login", "Login");
    expect(events).toHaveLength(1);
    expect(events[0].userId).toBe("u1");
    expect(events[0].log.type).toBe("login");
  });
});
