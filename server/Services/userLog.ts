import { dbService } from "./dbService";
import type { LogEntry } from "./db/index";
import { broadcastUserLog } from "./websocket";

export interface UserLogEvent {
    id: string;
    time: string;
    type: string;
    message: string;
    payload?: unknown;
}

export async function logUserEvent(
    userId: string,
    type: string,
    message: string,
    payload?: unknown,
): Promise<LogEntry> {
    const saved = await dbService.addUserLog(userId, type, message, payload);
    broadcastUserLog(userId, saved);
    return saved;
}
