// 用户反馈 / 举报 API（RPT-001）
// 挂载于 /api → 路径 /api/reports、/api/reports/mine
// 文档：docs/api/reports.md
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { REPORT_TYPES } from "../Services/db/reports.js";
import type { AuthMiddleware } from "./apiRoutes.js";
import type { User } from "../index";

export function initializeReportRoutes(
    authenticateToken: AuthMiddleware,
): express.Router {
    const router = express.Router();

    // ── POST /api/reports — 提交反馈 / 举报 ─────────────────────
    // body: { type?: "feedback"|"report", category?, targetId?, content, contact? }
    router.post("/reports", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const { type, category, targetId, content, contact } =
                req.body || {};

            if (!content || typeof content !== "string") {
                return res
                    .status(400)
                    .json({ error: "请填写反馈 / 举报内容" });
            }
            const trimmed = content.trim();
            if (trimmed.length < 5 || trimmed.length > 5000) {
                return res.status(400).json({
                    error: "内容长度需在 5 ~ 5000 字符之间",
                });
            }

            if (type && !(REPORT_TYPES as readonly string[]).includes(type)) {
                return res.status(400).json({ error: "无效的类型" });
            }

            const report = await dbService.reports.create({
                userId: user.id,
                type: type === "report" ? "report" : "feedback",
                category: category || null,
                targetId: targetId || null,
                content: trimmed,
                contact: contact || null,
            });

            logger.info(
                `User ${user.id} submitted ${report.type} (${report.id})`,
            );
            res.status(201).json({ report });
        } catch (error: any) {
            logger.error("Submit report error:", error);
            res.status(500).json({ error: "提交失败，请稍后重试" });
        }
    });

    // ── GET /api/reports/mine — 我提交的反馈 / 举报 ─────────────
    router.get(
        "/reports/mine",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { page = "1", limit = "20" } = req.query;
                const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
                const limitNum = Math.min(
                    100,
                    Math.max(1, parseInt(limit as string, 10) || 20),
                );

                const result = await dbService.reports.list({
                    userId: user.id,
                    limit: limitNum,
                    offset: (pageNum - 1) * limitNum,
                });

                res.json({
                    reports: result.reports,
                    total: result.total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(result.total / limitNum),
                });
            } catch (error: any) {
                logger.error("List my reports error:", error);
                res.status(500).json({ error: "获取记录失败" });
            }
        },
    );

    return router;
}
