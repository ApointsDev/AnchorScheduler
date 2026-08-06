/**
 * 归档 API（ARC-001）
 * 挂载于 /api → 路径 /api/archive、/api/{tasks|todos|tags}/:id/{archive|restore}
 * 文档：docs/（父文档 README.md）→ 正式归档（ARC-001）API
 */

import express from "express";
import type { Request, Response, RequestHandler } from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import {
    assertArchiveResource,
    ArchiveError,
    ArchiveForbiddenError,
    ArchiveInvalidResourceError,
    ArchiveNotFoundError,
    ArchiveNotArchivedError,
} from "../Services/db/archiveErrors.js";
import type { AuthMiddleware } from "./apiRoutes.js";

/** 已认证请求（authenticateToken 已填充 req.user） */
interface AuthedRequest extends Request {
    user: { id: string };
}

/** 各资源响应包裹字段名 */
const ARCHIVE_RESOURCES: ReadonlyArray<{
    resource: "tasks" | "todos" | "tags";
    key: "task" | "todo" | "tag";
}> = [
    { resource: "tasks", key: "task" },
    { resource: "todos", key: "todo" },
    { resource: "tags", key: "tag" },
];

function mapArchiveError(
    res: Response,
    e: unknown,
    fallbackMessage = "Archive operation failed",
): void {
    if (e instanceof ArchiveInvalidResourceError) {
        res.status(400).json({ error: "INVALID_RESOURCE", message: e.message });
        return;
    }
    if (e instanceof ArchiveForbiddenError) {
        res.status(403).json({ error: "FORBIDDEN", message: e.message });
        return;
    }
    if (e instanceof ArchiveNotFoundError) {
        res.status(404).json({ error: "NOT_FOUND", message: e.message });
        return;
    }
    if (e instanceof ArchiveNotArchivedError) {
        res.status(409).json({ error: "NOT_ARCHIVED", message: e.message });
        return;
    }
    if (e instanceof ArchiveError) {
        res.status(400).json({ error: "ARCHIVE_ERROR", message: e.message });
        return;
    }
    logger.error(fallbackMessage, e);
    res.status(500).json({ error: "INTERNAL_ERROR", message: fallbackMessage });
}

export function initializeArchiveRoutes(authenticateToken: AuthMiddleware) {
    const router = express.Router();

    // ── 归档列表 ────────────────────────────────────────────
    // GET /api/archive → { tasks, todos, tags }（三字段必须存在，可为空数组）
    const handleListArchived: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const archive = await dbService.listArchived(userId);
            res.status(200).json(archive);
        } catch (e: unknown) {
            mapArchiveError(res, e, "Failed to list archived items");
        }
    };
    router.get("/archive", authenticateToken, handleListArchived);

    // ── 永久删除已归档内容 ──────────────────────────────────
    // DELETE /api/archive/:resource/:id  resource ∈ { tasks, todos, tags }
    const handleDeleteArchived: RequestHandler = async (req, res) => {
        try {
            const userId = (req as AuthedRequest).user.id;
            const resource = String(req.params.resource);
            const id = String(req.params.id);
            assertArchiveResource(resource); // 400 不合法 resource
            await dbService.deleteArchivedResource(resource, id, userId);
            res.status(200).json({ success: true });
        } catch (e: unknown) {
            mapArchiveError(res, e, "Failed to permanently delete item");
        }
    };
    router.delete(
        "/archive/:resource/:id",
        authenticateToken,
        handleDeleteArchived,
    );

    // ── 归档 / 恢复：日程 / 待办 / 分组 ────────────────────

    for (const { resource, key } of ARCHIVE_RESOURCES) {
        const handleArchive: RequestHandler = async (req, res) => {
            try {
                const userId = (req as AuthedRequest).user.id;
                const id = String(req.params.id);
                const item = await dbService.archiveResource(
                    resource,
                    id,
                    userId,
                );
                res.status(200).json({ [key]: item });
            } catch (e: unknown) {
                mapArchiveError(
                    res,
                    e,
                    `Failed to archive ${resource}/${String(req.params.id)}`,
                );
            }
        };
        const handleRestore: RequestHandler = async (req, res) => {
            try {
                const userId = (req as AuthedRequest).user.id;
                const id = String(req.params.id);
                const item = await dbService.restoreResource(
                    resource,
                    id,
                    userId,
                );
                res.status(200).json({ [key]: item });
            } catch (e: unknown) {
                mapArchiveError(
                    res,
                    e,
                    `Failed to restore ${resource}/${String(req.params.id)}`,
                );
            }
        };
        router.post(
            `/${resource}/:id/archive`,
            authenticateToken,
            handleArchive,
        );
        router.post(
            `/${resource}/:id/restore`,
            authenticateToken,
            handleRestore,
        );
    }

    return router;
}
