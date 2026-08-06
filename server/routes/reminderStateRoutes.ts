import express from "express";
import { dbService } from "../Services/dbService.js";
import {
    REMINDER_KINDS,
    REMINDER_STATUSES,
    type ReminderKind,
    type ReminderReadStatus,
    type ReminderStateChange,
} from "../Services/db/reminderStates.js";

type AuthMiddleware = (req: any, res: any, next: any) => void;

const MAX_BATCH_SIZE = 500;
const MAX_ID_LENGTH = 256;
const MAX_SOURCE_ID_LENGTH = 128;

function parseVersion(value: unknown): number | null {
    if (value === undefined || value === null || value === "") return 0;
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function parseChange(value: unknown): ReminderStateChange | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const row = value as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id.trim() : "";
    const sourceId =
        typeof row.sourceId === "string" ? row.sourceId.trim() : "";
    const kind = row.kind as ReminderKind;
    const status = row.status as ReminderReadStatus;
    const triggeredAt = Number(row.triggeredAt);
    const updatedAt = Number(row.updatedAt);

    if (
        !id ||
        id.length > MAX_ID_LENGTH ||
        !sourceId ||
        sourceId.length > MAX_SOURCE_ID_LENGTH ||
        !REMINDER_KINDS.includes(kind) ||
        !REMINDER_STATUSES.includes(status) ||
        !Number.isSafeInteger(triggeredAt) ||
        triggeredAt < 0 ||
        !Number.isSafeInteger(updatedAt) ||
        updatedAt < 0
    ) {
        return null;
    }

    return { id, sourceId, kind, status, triggeredAt, updatedAt };
}

export function initializeReminderStateRoutes(
    authenticateToken: AuthMiddleware,
) {
    const router = express.Router();

    /** Incrementally fetch reminder state changes for the authenticated user. */
    router.get(
        "/reminder-states",
        authenticateToken,
        async (req: any, res: any) => {
            const sinceVersion = parseVersion(req.query.sinceVersion);
            if (sinceVersion === null) {
                return res.status(400).json({
                    error: "INVALID_SINCE_VERSION",
                    message: "sinceVersion must be a non-negative integer",
                });
            }
            try {
                return res.json(
                    await dbService.reminderStates.listSince(
                        req.user.id,
                        sinceVersion,
                    ),
                );
            } catch (error) {
                console.error("Failed to list reminder states:", error);
                return res.status(500).json({ error: "REMINDER_SYNC_FAILED" });
            }
        },
    );

    /** Push local changes and pull remote changes in one idempotent request. */
    router.post(
        "/reminder-states/sync",
        authenticateToken,
        async (req: any, res: any) => {
            const sinceVersion = parseVersion(req.body?.sinceVersion);
            const rawChanges = req.body?.changes ?? [];
            if (sinceVersion === null) {
                return res.status(400).json({
                    error: "INVALID_SINCE_VERSION",
                    message: "sinceVersion must be a non-negative integer",
                });
            }
            if (!Array.isArray(rawChanges) || rawChanges.length > MAX_BATCH_SIZE) {
                return res.status(400).json({
                    error: "INVALID_REMINDER_CHANGES",
                    message: `changes must be an array with at most ${MAX_BATCH_SIZE} items`,
                });
            }
            const changes = rawChanges.map(parseChange);
            if (changes.some(change => change === null)) {
                return res.status(400).json({
                    error: "INVALID_REMINDER_CHANGE",
                    message: "Each reminder change must contain valid id, kind, sourceId, triggeredAt, status and updatedAt fields",
                });
            }

            try {
                return res.json(
                    await dbService.reminderStates.sync(
                        req.user.id,
                        sinceVersion,
                        changes as ReminderStateChange[],
                    ),
                );
            } catch (error) {
                console.error("Failed to sync reminder states:", error);
                return res.status(500).json({ error: "REMINDER_SYNC_FAILED" });
            }
        },
    );

    return router;
}
