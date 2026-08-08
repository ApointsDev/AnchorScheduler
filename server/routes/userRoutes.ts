// 用户资料、头像、签名与日志路由
// 挂载于 /api → 路径为 /api/me、/api/me/avatar、/api/me/signature、/api/logs
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { logUserEvent } from "../Services/userLog.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

/** 个人签名最大长度 */
const SIGNATURE_MAX_LENGTH = 200;

const AVATAR_MIME_EXT: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
};

const avatarUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (_req, file, cb) => {
        if (AVATAR_MIME_EXT[file.mimetype]) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    `不支持的头像类型: ${file.mimetype}。支持 JPEG/PNG/GIF/WebP`,
                ),
            );
        }
    },
});

function getAvatarUploadDir(): string {
    return path.join(process.cwd(), "private", "uploads", "avatars");
}

function ensureAvatarDir(): void {
    const dir = getAvatarUploadDir();
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/** 删除本站上传的旧头像文件（仅 /uploads/avatars/ 下） */
function tryRemoveLocalAvatar(avatarPath: string | null | undefined): void {
    if (!avatarPath || typeof avatarPath !== "string") return;
    if (!avatarPath.startsWith("/uploads/avatars/")) return;
    const base = path.basename(avatarPath);
    if (!base || base.includes("..")) return;
    const full = path.join(getAvatarUploadDir(), base);
    try {
        if (fs.existsSync(full)) fs.unlinkSync(full);
    } catch {
        /* ignore */
    }
}

function isValidAvatarUrl(url: string): boolean {
    if (url.startsWith("/uploads/avatars/")) return true;
    try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

export function registerUserRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
) {
    router.get("/logs", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                limit = "50",
                offset = "0",
                since,
                until,
                type,
            } = req.query;
            const lim = Math.max(
                1,
                Math.min(500, parseInt(limit as string, 10) || 50),
            );
            const off = Math.max(0, parseInt(offset as string, 10) || 0);
            const { logs, total } = await dbService.getUserLogsPage(user.id, {
                limit: lim,
                offset: off,
                since: since as string | undefined,
                until: until as string | undefined,
                type: type as string | undefined,
            });
            return res
                .status(200)
                .json({ logs, total, limit: lim, offset: off });
        } catch (e) {
            logger.error("Fetch user logs failed:", e);
            return res.status(500).json({ error: "Failed to fetch logs" });
        }
    });
    router.get("/me", authenticateToken, async (req: any, res: any) => {
        const user = req.user as User;
        return res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar ?? null,
            signature: user.signature ?? null,
            autoSchedulePromotions: user.autoSchedulePromotions ?? false,
            stripReplyPrefix: user.stripReplyPrefix !== false,
        });
    });
    router.post(
        "/me/avatar",
        authenticateToken,
        (req: any, res: any, next: any) => {
            const ct = String(req.headers["content-type"] || "");
            if (ct.includes("multipart/form-data")) {
                return avatarUpload.single("avatar")(req, res, (err: any) => {
                    if (err) {
                        const msg =
                            err instanceof multer.MulterError
                                ? err.code === "LIMIT_FILE_SIZE"
                                    ? "头像文件不能超过 2MB"
                                    : err.message
                                : err.message || "上传失败";
                        return res.status(400).json({ error: msg });
                    }
                    next();
                });
            }
            next();
        },
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                let nextAvatar: string | null = null;

                if (req.file) {
                    ensureAvatarDir();
                    const ext =
                        AVATAR_MIME_EXT[req.file.mimetype] || ".jpg";
                    const filename = `${user.id}-${Date.now()}${ext}`;
                    const fullPath = path.join(getAvatarUploadDir(), filename);
                    fs.writeFileSync(fullPath, req.file.buffer);
                    nextAvatar = `/uploads/avatars/${filename}`;
                } else {
                    const body = req.body || {};
                    if (
                        body.avatar === null ||
                        body.avatar === "" ||
                        body.clear === true
                    ) {
                        nextAvatar = null;
                    } else if (typeof body.avatar === "string") {
                        const url = body.avatar.trim();
                        if (!isValidAvatarUrl(url)) {
                            return res.status(400).json({
                                error: "avatar 须为 http(s) URL 或 /uploads/avatars/ 路径",
                            });
                        }
                        nextAvatar = url;
                    } else {
                        return res.status(400).json({
                            error: "请上传 avatar 文件，或 JSON 提供 avatar URL / null",
                        });
                    }
                }

                tryRemoveLocalAvatar(user.avatar);
                await dbService.updateUserAvatar(user.id, nextAvatar);
                user.avatar = nextAvatar;

                await logUserEvent(
                    user.id,
                    "avatar_updated",
                    nextAvatar ? "已更新头像" : "已清除头像",
                    { avatar: nextAvatar },
                );

                return res.status(200).json({
                    avatar: nextAvatar,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar: nextAvatar,
                        signature: user.signature ?? null,
                    },
                });
            } catch (error: any) {
                logger.error("POST /me/avatar failed:", error);
                return res
                    .status(500)
                    .json({ error: error.message || "Failed to update avatar" });
            }
        },
    );
    async function handleUpdateSignature(req: any, res: any) {
        try {
            const user = req.user as User;
            const body = req.body || {};
            if (!Object.prototype.hasOwnProperty.call(body, "signature")) {
                return res
                    .status(400)
                    .json({ error: "signature field required" });
            }

            let signature: string | null;
            if (body.signature === null || body.signature === "") {
                signature = null;
            } else if (typeof body.signature === "string") {
                const value = String(body.signature).trim();
                if (value.length > SIGNATURE_MAX_LENGTH) {
                    return res.status(400).json({
                        error: `signature 最长 ${SIGNATURE_MAX_LENGTH} 字`,
                    });
                }
                signature = value === "" ? null : value;
            } else {
                return res
                    .status(400)
                    .json({ error: "signature must be string or null" });
            }

            await dbService.updateUserSignature(user.id, signature);
            user.signature = signature;

            await logUserEvent(
                user.id,
                "signature_updated",
                signature ? "已更新签名" : "已清除签名",
                { signature },
            );

            return res.status(200).json({
                signature,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar ?? null,
                    signature,
                },
            });
        } catch (error: any) {
            logger.error("update signature failed:", error);
            return res.status(500).json({
                error: error.message || "Failed to update signature",
            });
        }
    }
    router.put("/me/signature", authenticateToken, handleUpdateSignature);
    router.patch("/me/signature", authenticateToken, handleUpdateSignature);
    router.post("/me/signature", authenticateToken, handleUpdateSignature);
}
