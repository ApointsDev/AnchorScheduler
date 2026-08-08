// 文件上传与日程附件存档路由
// 挂载于 /api → 路径为 /api/uploads、/api/uploads/:filename
// 附件文件落盘到 private/uploads/schedule-attachments/，经 /uploads 静态服务对外提供
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

/** 附件子目录（相对 process.cwd()，与头像的 avatars 平级） */
const ATTACHMENT_SUBDIR = path.join(
    "private",
    "uploads",
    "schedule-attachments",
);
/** 文件名前缀，用于区分归属用户与校验删除权限 */
const ATTACHMENT_PREFIX = "sched-";
/** 单文件大小上限：20MB */
const MAX_FILE_SIZE = 20 * 1024 * 1024;

/**
 * MIME → 扩展名 白名单。
 * 只允许文档 / 图片 / 压缩包等“存档类”文件；
 * 拒绝 HTML/JS/SVG/XML/可执行文件等，避免经 /uploads 静态服务被当作脚本执行或注入。
 */
const MIME_EXT_MAP: Record<string, string> = {
    // 文档
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        ".pptx",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "text/csv": ".csv",
    "application/json": ".json",
    // 图片
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/bmp": ".bmp",
    // 压缩包
    "application/zip": ".zip",
    "application/x-rar-compressed": ".rar",
    "application/x-7z-compressed": ".7z",
    "application/x-tar": ".tar",
    "application/gzip": ".gz",
};
/** 白名单导出（供测试） */
export const ALLOWED_MIME_EXT_MAP = MIME_EXT_MAP;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (MIME_EXT_MAP[file.mimetype]) {
            cb(null, true);
        } else {
            cb(new Error(`不支持的文件类型: ${file.mimetype}`));
        }
    },
});

function getAttachmentDir(): string {
    return path.join(process.cwd(), ATTACHMENT_SUBDIR);
}

function ensureAttachmentDir(): void {
    const dir = getAttachmentDir();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/** 校验文件名是否为当前用户上传的附件（防路径穿越 / 越权删除） */
export function isOwnedAttachmentFilename(
    userId: string,
    filename: string,
): boolean {
    if (!filename) return false;
    if (path.basename(filename) !== filename) return false; // 含路径分隔符
    if (filename.includes("..")) return false;
    return filename.startsWith(`${ATTACHMENT_PREFIX}${userId}-`);
}

/** 附件上传/删除/列出的前置：认证 + 附件功能会员权限（银锚及以上） */
function requireAttachmentFeature(
    authenticateToken: AuthMiddleware,
): express.RequestHandler {
    return async (req: any, res: any, next: any) => {
        try {
            await new Promise<void>((resolve, reject) => {
                authenticateToken(req, res, (err: any) =>
                    err ? reject(err) : resolve(),
                );
            });
            const user = req.user as User;
            const membership = await dbService.getMembershipSummary(user.id);
            if (!membership.featureAccess?.attachments) {
                return res.status(403).json({
                    error: "附件上传为银锚会员及以上权益",
                });
            }
            next();
        } catch (err) {
            next(err);
        }
    };
}

export function registerUploadRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    /**
     * POST /uploads
     * 上传文件用于日程附件存档（multipart/form-data，字段 file）。
     * 需银锚会员及以上。返回可直接写入 task.attachments 的 URL。
     */
    router.post(
        "/uploads",
        requireAttachmentFeature(authenticateToken),
        (req: any, res: any, next: any) => {
            upload.single("file")(req, res, (err: any) => {
                if (err) {
                    const msg =
                        err instanceof multer.MulterError
                            ? err.code === "LIMIT_FILE_SIZE"
                                ? "文件不能超过 20MB"
                                : err.message
                            : err.message || "上传失败";
                    return res.status(400).json({ error: msg });
                }
                next();
            });
        },
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const file = req.file;
                if (!file) {
                    return res
                        .status(400)
                        .json({ error: "请上传文件（字段 file）" });
                }
                const ext = MIME_EXT_MAP[file.mimetype];
                if (!ext) {
                    return res
                        .status(400)
                        .json({ error: "不支持的文件类型" });
                }

                ensureAttachmentDir();
                const filename =
                    `${ATTACHMENT_PREFIX}${user.id}-${Date.now()}-` +
                    `${crypto.randomBytes(4).toString("hex")}${ext}`;
                const fullPath = path.join(getAttachmentDir(), filename);
                fs.writeFileSync(fullPath, file.buffer);

                return res.status(201).json({
                    url: `/uploads/schedule-attachments/${filename}`,
                    name: file.originalname,
                    size: file.size,
                    mimeType: file.mimetype,
                    uploadedAt: new Date().toISOString(),
                });
            } catch (error: any) {
                logger.error("POST /uploads failed:", error);
                return res
                    .status(500)
                    .json({ error: "文件上传失败，请稍后重试" });
            }
        },
    );

    /**
     * GET /uploads
     * 列出当前用户上传的全部附件（按上传时间倒序）。
     */
    router.get(
        "/uploads",
        requireAttachmentFeature(authenticateToken),
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const dir = getAttachmentDir();
                if (!fs.existsSync(dir)) {
                    return res.status(200).json({ files: [] });
                }
                const prefix = `${ATTACHMENT_PREFIX}${user.id}-`;
                const files = fs
                    .readdirSync(dir)
                    .filter(
                        (f) =>
                            isOwnedAttachmentFilename(user.id, f) &&
                            f.startsWith(prefix),
                    )
                    .map((f) => {
                        const st = fs.statSync(path.join(dir, f));
                        return {
                            url: `/uploads/schedule-attachments/${f}`,
                            name: f,
                            size: st.size,
                            uploadedAt: new Date(st.mtimeMs).toISOString(),
                        };
                    })
                    .sort((a, b) =>
                        b.uploadedAt.localeCompare(a.uploadedAt),
                    );
                return res.status(200).json({ files });
            } catch (error: any) {
                logger.error("GET /uploads failed:", error);
                return res
                    .status(500)
                    .json({ error: "获取附件列表失败" });
            }
        },
    );

    /**
     * DELETE /uploads/:filename
     * 删除当前用户上传的指定附件。
     */
    router.delete(
        "/uploads/:filename",
        requireAttachmentFeature(authenticateToken),
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const filename = String(req.params.filename || "");
                if (!isOwnedAttachmentFilename(user.id, filename)) {
                    return res.status(404).json({ error: "file not found" });
                }
                const fullPath = path.join(getAttachmentDir(), filename);
                if (!fs.existsSync(fullPath)) {
                    return res.status(404).json({ error: "file not found" });
                }
                fs.unlinkSync(fullPath);
                return res.status(200).json({
                    success: true,
                    url: `/uploads/schedule-attachments/${filename}`,
                });
            } catch (error: any) {
                logger.error("DELETE /uploads failed:", error);
                return res
                    .status(500)
                    .json({ error: "删除附件失败" });
            }
        },
    );
}
