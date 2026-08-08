// 应用版本更新检查 API（UPD-001）
// 挂载于 /api → 路径 /api/app/update
// 客户端（登录后）调用检查是否有新版本，并获取外部下载源
// 文档：docs/api/app-update.md
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import type { AuthMiddleware } from "./apiRoutes.js";

export function initializeAppUpdateRoutes(
    authenticateToken: AuthMiddleware,
): express.Router {
    const router = express.Router();

    // ── GET /api/app/update — 检查最新版本 ─────────────────────
    // query: { platform?: "android"|"ios"|"web"|"all", version?, versionCode? }
    // 返回 enabled 的最新版本信息；无可用版本时返回 null
    router.get(
        "/app/update",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const platform = String(req.query.platform || "all");
                const currentVersion = req.query.version
                    ? String(req.query.version)
                    : null;
                const currentVersionCode = req.query.versionCode
                    ? Number(req.query.versionCode)
                    : null;

                const latest = await dbService.appUpdate.getLatest(platform);

                if (!latest) {
                    return res.json({ updateAvailable: false, latest: null });
                }

                // 判断是否有更新：versionCode 更大，或版本字符串不同
                let updateAvailable = false;
                if (
                    currentVersionCode != null &&
                    !Number.isNaN(currentVersionCode)
                ) {
                    updateAvailable =
                        latest.versionCode > currentVersionCode;
                } else if (currentVersion) {
                    updateAvailable = latest.version !== currentVersion;
                } else {
                    // 客户端未提供当前版本 → 一律提示有新版本
                    updateAvailable = true;
                }

                res.json({
                    updateAvailable,
                    latest: {
                        id: latest.id,
                        platform: latest.platform,
                        version: latest.version,
                        versionCode: latest.versionCode,
                        downloadUrl: latest.downloadUrl,
                        releaseNotes: latest.releaseNotes,
                        forceUpdate: latest.forceUpdate,
                        publishedAt: latest.updatedAt,
                    },
                });
            } catch (error: any) {
                logger.error("App update check error:", error);
                res.status(500).json({ error: "检查更新失败" });
            }
        },
    );

    return router;
}
