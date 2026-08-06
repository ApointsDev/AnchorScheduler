import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Task, User } from "../index";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import jwt from "jsonwebtoken";

let wss: WebSocketServer | null = null;
let userProvider: (() => Iterable<User>) | null = null;
const occurrenceNotified = new Set<string>();
const JWT_SECRET = process.env.JWT_SECRET || "";

// Map to keep track of the current active socket per userId
const userSockets: Map<string, AuthedSocket> = new Map();

interface AuthedSocket extends WebSocket {
    userId?: string;
    isAlive?: boolean;
}
let heartbeatInterval: NodeJS.Timeout | null = null;

export function initWebSocket(httpServer: any, provider: () => Iterable<User>) {
    userProvider = provider;
    wss = new WebSocketServer({ server: httpServer, path: "/ws" });
    wss.on("connection", (socket: AuthedSocket, req: IncomingMessage) => {
        // heartbeat init (use application-level ping/pong so browsers stay compatible)
        socket.isAlive = true;
        socket.on &&
            socket.on("message", (data: WebSocket.RawData) => {
                try {
                    const raw =
                        typeof data === "string" ? data : data.toString();
                    const msg = JSON.parse(raw);
                    if (msg && msg.type === "pong") socket.isAlive = true;
                } catch (_) {}
            });

        // log close/error for easier debugging and remove mapping
        socket.on &&
            socket.on("close", (code?: number, reason?: Buffer) => {
                try {
                    logger.info(
                        `WebSocket closed for user=${socket.userId || "unknown"} code=${code} reason=${reason ? reason.toString() : ""}`,
                    );
                } catch (_) {}
                try {
                    if (socket.userId) {
                        const cur = userSockets.get(socket.userId);
                        if (cur === socket) userSockets.delete(socket.userId);
                    }
                } catch (_) {}
            });
        socket.on &&
            socket.on("error", (err: any) => {
                try {
                    logger.error("WebSocket error", err);
                } catch (_) {}
            });

        const url = new URL(req.url || "", `http://${req.headers.host}`);
        const token = url.searchParams.get("token");
        if (!token) {
            try {
                socket.send(
                    JSON.stringify({ type: "error", error: "AUTH_REQUIRED" }),
                );
            } catch (_) {}
            try {
                socket.close();
            } catch (_) {}
            return;
        }
        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            socket.userId = decoded.sub;
            try {
                // If there is already an active socket for this user, replace it
                const existing = socket.userId
                    ? userSockets.get(socket.userId)
                    : undefined;
                if (existing && existing !== socket) {
                    try {
                        existing.close(4000, "replaced");
                    } catch (_) {}
                    try {
                        logger.info(
                            `Replaced existing socket for user=${socket.userId}`,
                        );
                    } catch (_) {}
                }
                if (socket.userId) userSockets.set(socket.userId, socket);

                const welcome = {
                    type: "welcome",
                    time: toShanghaiISO(),
                    userId: socket.userId,
                };
                socket.send(JSON.stringify(welcome));
                logger.info(
                    `Sent welcome to user=${socket.userId} at ${welcome.time}`,
                );
            } catch (_) {}
        } catch (e) {
            try {
                socket.send(
                    JSON.stringify({ type: "error", error: "INVALID_TOKEN" }),
                );
            } catch (_) {}
            try {
                socket.close();
            } catch (_) {}
            return;
        }
    });

    // heartbeat interval - use application-level ping (JSON) for browser compatibility
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(() => {
        if (!wss) return;
        for (const client of wss.clients) {
            const s = client as AuthedSocket;
            if (s.isAlive === false) {
                try {
                    client.terminate();
                } catch (_) {}
                continue;
            }
            s.isAlive = false;
            try {
                if ((client as any).readyState === 1) {
                    client.send(JSON.stringify({ type: "ping" }));
                }
            } catch (_) {}
        }
    }, 30000);

    wss.on("close", () => {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
    });
    startOccurrenceScan();
    logger.info("WebSocket server with JWT auth initialized at /ws");
}

export function broadcastTaskChange(
    action: "created" | "updated" | "deleted" | "completed",
    task: Task,
    userId: string,
) {
    if (!wss) return;
    const payload = JSON.stringify({
        type: "taskChange",
        action,
        task: {
            id: task.id,
            name: task.name,
            startTime: task.startTime,
            endTime: task.endTime,
            completed: task.completed,
            parentTaskId: task.parentTaskId,
            recurrenceRule: task.recurrenceRule,
        },
    });
    for (const client of wss.clients) {
        const c = client as AuthedSocket;
        if (c.userId !== userId) continue;
        if ((client as any).readyState === 1) {
            try {
                client.send(payload);
            } catch (_) {}
        }
    }
}

export function broadcastUserLog(
    userId: string,
    log: {
        id: string;
        time: string;
        type: string;
        message: string;
        payload?: unknown;
    },
) {
    if (!wss) return;
    const payload = JSON.stringify({ type: "userLog", log });
    for (const client of wss.clients) {
        const c = client as AuthedSocket;
        if (c.userId !== userId) continue;
        if ((client as any).readyState === 1) {
            try {
                client.send(payload);
            } catch (_) {}
        }
    }
}

/** 广播 SMTP/IMAP 连接失败通知给指定用户 */
export function broadcastSmtpError(userId: string, message: string) {
    if (!wss) return;
    const payload = JSON.stringify({
        type: "smtpError",
        message,
        time: toShanghaiISO(),
    });
    for (const client of wss.clients) {
        const c = client as AuthedSocket;
        if (c.userId !== userId) continue;
        if ((client as any).readyState === 1) {
            try {
                client.send(payload);
            } catch (_) {}
        }
    }
}

function broadcastTaskOccurrence(task: Task, userId: string) {
    if (!wss) return;
    const payload = JSON.stringify({
        type: "taskOccurrence",
        taskId: task.id,
        name: task.name,
        startTime: task.startTime,
        endTime: task.endTime,
    });
    for (const client of wss.clients) {
        const c = client as AuthedSocket;
        if (c.userId !== userId) continue;
        if ((client as any).readyState === 1) {
            try {
                client.send(payload);
            } catch (_) {}
        }
    }
}

function broadcastTaskOccurrenceCanceled(task: Task, userId: string) {
    if (!wss) return;
    const payload = JSON.stringify({
        type: "taskOccurrenceCanceled",
        taskId: task.id,
        startTime: task.startTime,
    });
    for (const client of wss.clients) {
        const c = client as AuthedSocket;
        if (c.userId !== userId) continue;
        if ((client as any).readyState === 1) {
            try {
                client.send(payload);
            } catch (_) {}
        }
    }
}

function startOccurrenceScan() {
    setInterval(() => {
        if (!userProvider) return;
        const now = Date.now();
        for (const user of userProvider()) {
            for (const task of user.tasks || []) {
                if (!task.startTime) continue;
                const startMillis = new Date(task.startTime).getTime();
                if (isNaN(startMillis)) continue;
                if (task.completed && !occurrenceNotified.has(task.id)) {
                    // 已完成且未开始 -> 取消事件
                    if (startMillis > now) {
                        occurrenceNotified.add(task.id);
                        broadcastTaskOccurrenceCanceled(task, user.id);
                    }
                    continue;
                }
                if (
                    startMillis <= now &&
                    !task.completed &&
                    !occurrenceNotified.has(task.id)
                ) {
                    occurrenceNotified.add(task.id);
                    broadcastTaskOccurrence(task, user.id);
                    logger.info(`Broadcast task occurrence ${task.id}`);
                }
            }
        }
    }, 5000);
}
