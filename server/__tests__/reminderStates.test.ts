import * as sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { ReminderStateStore } from "../Services/db/reminderStates";

const SqliteDriver =
    (sqlite3 as any).Database || (sqlite3 as any).default?.Database;

async function setup() {
    const db = await open({ filename: ":memory:", driver: SqliteDriver });
    await db.exec(`
        CREATE TABLE reminder_sync_versions (
            userId TEXT PRIMARY KEY,
            version INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE reminder_states (
            userId TEXT NOT NULL,
            reminderId TEXT NOT NULL,
            kind TEXT NOT NULL,
            sourceId TEXT NOT NULL,
            triggeredAt INTEGER NOT NULL,
            status TEXT NOT NULL,
            clientUpdatedAt INTEGER NOT NULL,
            version INTEGER NOT NULL,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (userId, reminderId)
        );
    `);
    return { db, store: new ReminderStateStore(db) };
}

describe("ReminderStateStore", () => {
    let db: Database;
    let store: ReminderStateStore;

    beforeEach(async () => ({ db, store } = await setup()));
    afterEach(async () => db.close());

    it("pushes changes and incrementally pulls them on another device", async () => {
        const first = await store.sync("u1", 0, [{
            id: "anchor:todo_deadline:t1",
            kind: "todo_deadline",
            sourceId: "t1",
            triggeredAt: 100,
            status: "unread",
            updatedAt: 1000,
        }]);
        expect(first.version).toBe(1);
        expect(first.states[0].status).toBe("unread");

        const read = await store.sync("u1", first.version, [{
            ...first.states[0],
            status: "read",
            updatedAt: 2000,
        }]);
        expect(read.version).toBe(2);
        expect(read.states[0].status).toBe("read");

        const otherDevice = await store.listSince("u1", 1);
        expect(otherDevice.states).toEqual([
            expect.objectContaining({ status: "read", version: 2 }),
        ]);
    });

    it("does not let a stale offline unread overwrite read", async () => {
        const base = {
            id: "anchor:schedule_start:s1",
            kind: "schedule_start" as const,
            sourceId: "s1",
            triggeredAt: 100,
        };
        await store.sync("u1", 0, [{
            ...base,
            status: "read",
            updatedAt: 2000,
        }]);

        const result = await store.sync("u1", 1, [{
            ...base,
            status: "unread",
            updatedAt: 3000,
        }]);
        expect(result.version).toBe(1);
        expect(result.states[0].status).toBe("read");
    });

    it("keeps users isolated", async () => {
        await store.sync("u1", 0, [{
            id: "anchor:todo_start:t1",
            kind: "todo_start",
            sourceId: "t1",
            triggeredAt: 100,
            status: "read",
            updatedAt: 1000,
        }]);
        await expect(store.listSince("u2", 0)).resolves.toEqual({
            states: [],
            version: 0,
        });
    });

    it("serializes concurrent device writes on the shared SQLite connection", async () => {
        const makeChange = (id: string) => ({
            id: `anchor:todo_start:${id}`,
            kind: "todo_start" as const,
            sourceId: id,
            triggeredAt: 100,
            status: "unread" as const,
            updatedAt: 1000,
        });

        await expect(
            Promise.all([
                store.sync("u1", 0, [makeChange("a")]),
                store.sync("u1", 0, [makeChange("b")]),
            ]),
        ).resolves.toHaveLength(2);
        const all = await store.listSince("u1", 0);
        expect(all.states).toHaveLength(2);
        expect(all.version).toBe(2);
    });
});
