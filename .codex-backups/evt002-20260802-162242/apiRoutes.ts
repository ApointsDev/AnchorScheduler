import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";
import path from "path";
import { User, Task } from "../index";
import { logger } from "../Utils/logger.js";
import {
    toShanghaiISO,
    getRawWeekNumber,
    getAcademicYearConfig,
} from "../Utils/time.js";
import { dbService } from "../Services/dbService.js";
import { mcpTools } from "../Services/mcp.js";
import {
    findConflictingTasks,
    ScheduleConflictError,
} from "../Services/scheduleConflict.js";
import {
    generateRecurrenceInstances,
    buildRecurrenceSummary,
} from "../Services/recurrence.js";
import {
    parseRecurrenceRuleInput,
    resolveScheduleType,
} from "../Services/types.js";
import type { RecurrenceRule, ScheduleType } from "../Services/types";
import { broadcastTaskChange } from "../Services/websocket.js";
import { logUserEvent } from "../Services/userLog.js";
import { LLMApi } from "../Services/LLMApi.js";
import { syncUserTimetable } from "../Services/timetable.js";
import { CalDavProvider } from "../Services/calendar/CalDavProvider.js";
import { CalendarSyncService } from "../Services/calendar/CalendarSyncService.js";
import { processEmailWithLLM } from "../Services/emailProcessor.js";
import {
    clampAxisScore,
    parsePriorityAxesBody,
    quadrantFromAxes,
    resolvePriorityAxes,
} from "../Services/priorityAxes.js";
import { resolveTaskMetadata } from "../Services/taskMetadata.js";

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

// 身份验证中间件引用
export interface AuthMiddleware {
    (req: any, res: any, next: any): Promise<void>;
}

export function initializeApiRoutes(
    authenticateToken: AuthMiddleware,
    frontendUrl: string,
) {
    // 创建路由器 - 每次调用都创建新的实例
    const router = express.Router();

    const PORT = process.env.PORT || 3000;
    const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

    // 初始化 LLM API
    const llmApi = new LLMApi(
        process.env.OPENAI_API_KEY || "",
        process.env.OPENAI_MODEL || "deepseek-chat",
    );

    const normalizeQueueScheduleArgs = (input: any) => {
        const args = { ...(input || {}) } as any;

        if (!args.name && args.title) args.name = args.title;
        if (!args.description && args.body) args.description = args.body;
        if (!args.location && args.place) args.location = args.place;

        const normalizeTimeValue = (value: any) => {
            if (!value) return value;
            if (typeof value === "string") return value;
            if (typeof value === "number") return new Date(value).toISOString();
            if (typeof value === "object") {
                if (typeof value.dateTime === "string") return value.dateTime;
                if (typeof value.start === "string") return value.start;
            }
            return value;
        };

        if (args.startTime && typeof args.startTime !== "string") {
            args.startTime = normalizeTimeValue(args.startTime);
        }
        if (args.endTime && typeof args.endTime !== "string") {
            args.endTime = normalizeTimeValue(args.endTime);
        }
        if (!args.startTime && (args.start || args.startDate)) {
            args.startTime = normalizeTimeValue(args.start ?? args.startDate);
        }
        if (!args.endTime && (args.end || args.endDate)) {
            args.endTime = normalizeTimeValue(args.end ?? args.endDate);
        }

        if (
            args.recurrence !== undefined &&
            args.recurrenceRule === undefined
        ) {
            args.recurrenceRule = args.recurrence;
            delete args.recurrence;
        }

        if (args.recurrenceRule !== undefined) {
            const parsedRecurrence = parseRecurrenceRuleInput(
                args.recurrenceRule,
            );
            if (parsedRecurrence) {
                args.recurrenceRule = parsedRecurrence;
            } else {
                delete args.recurrenceRule;
            }
        }

        try {
            const resolved = resolveScheduleType({
                explicit: args.scheduleType,
                recurrence: args.recurrenceRule,
                fallback: "single",
            });
            args.scheduleType = resolved.scheduleType;
            if (resolved.parsedRecurrence)
                args.recurrenceRule = resolved.parsedRecurrence;
        } catch (e) {
            const parsedRecurrence = parseRecurrenceRuleInput(
                args.recurrenceRule,
            );
            if (parsedRecurrence) {
                args.recurrenceRule = parsedRecurrence;
            } else {
                delete args.recurrenceRule;
            }
            const resolved = resolveScheduleType({
                explicit: undefined,
                recurrence: args.recurrenceRule,
                fallback: "single",
            });
            args.scheduleType = resolved.scheduleType;
        }

        return args;
    };

    // LLM 聊天接口（流式）
    router.post("/llm/chat", authenticateToken, async (req: any, res: any) => {
        try {
            const { messages, tools } = req.body;
            if (!messages || !Array.isArray(messages)) {
                return res
                    .status(400)
                    .json({ error: "messages array required" });
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");

            await llmApi.chatStream(messages, tools, (data) => {
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            });

            res.write("data: [DONE]\n\n");
            res.end();
        } catch (error: any) {
            logger.error("LLM chat failed:", error);
            if (!res.headersSent) {
                return res
                    .status(500)
                    .json({ error: "Failed to process chat request" });
            }
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    });

    // 四象限自动分类接口
    router.post(
        "/tasks/classify-quadrants",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { taskIds } = req.body || {};

                if (
                    !taskIds ||
                    !Array.isArray(taskIds) ||
                    taskIds.length === 0
                ) {
                    return res
                        .status(400)
                        .json({ error: "taskIds array required" });
                }

                // 获取所有用户任务并筛选出请求的任务
                const userTasks = await dbService.getTasksByUserId(user.id);
                const tasksToClassify = userTasks.filter((t) =>
                    taskIds.includes(t.id),
                );

                if (tasksToClassify.length === 0) {
                    return res.json({ classifications: [] });
                }

                logger.info(
                    `[Quadrant] Classifying ${tasksToClassify.length} tasks for user ${user.id}`,
                );

                // 构建任务列表供 LLM 分析
                const taskListText = tasksToClassify
                    .map(
                        (t, i) =>
                            `${i + 1}. 名称: "${t.name}", 描述: "${t.description || ""}", 开始: ${t.startTime || ""}, 截止: ${t.dueDate || ""}, 重要性: ${t.importance || "normal"}, 已完成: ${t.completed}`,
                    )
                    .join("\n");

                const nowStr = toShanghaiISO();
                const messages = [
                    {
                        role: "system",
                        content: `你是一个日程分类助手。请根据艾森豪威尔矩阵（四象限法则）对以下日程进行分类。
当前时间: ${nowStr}

四象限与双轴分数（-1~1）:
- importanceScore: 重要程度，>0 重要，≤0 不重要
- urgencyScore: 紧急程度，>0 紧急，≤0 不紧急
- q1: 重要且紧急 — importanceScore>0 且 urgencyScore>0（截止临近、需立即处理）
- q2: 重要但不紧急 — importanceScore>0 且 urgencyScore≤0（需规划但不必立即执行）
- q3: 不重要但紧急 — importanceScore≤0 且 urgencyScore>0（可委托）
- q4: 不重要且不紧急 — importanceScore≤0 且 urgencyScore≤0（可考虑删除）

请返回一个 JSON 数组（不要包含在 markdown 代码块中），每个元素包含：
- taskIndex（数字，对应序号）
- quadrant（"q1" | "q2" | "q3" | "q4"）
- importanceScore（浮点数，-1 到 1）
- urgencyScore（浮点数，-1 到 1）
分数须与 quadrant 一致。`,
                    },
                    {
                        role: "user",
                        content: `请对以下日程进行四象限分类：\n${taskListText}`,
                    },
                ];

                const content = await llmApi.chat(messages, {
                    temperature: 0.3,
                });

                logger.data(`[Quadrant Classify Response]: ${content}`);

                // 尝试解析 JSON
                let parsed: any[];
                try {
                    // 提取 JSON 数组
                    const jsonMatch = content.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        parsed = JSON.parse(jsonMatch[0]);
                    } else {
                        parsed = JSON.parse(content);
                    }
                } catch (e) {
                    logger.error(
                        "Failed to parse quadrant classification response:",
                        e,
                    );
                    return res
                        .status(500)
                        .json({ error: "Failed to parse LLM response" });
                }

                if (!Array.isArray(parsed)) {
                    return res
                        .status(500)
                        .json({ error: "Invalid LLM response format" });
                }

                const classifications: Array<{
                    taskId: string;
                    quadrant: "q1" | "q2" | "q3" | "q4";
                    importanceScore?: number;
                    urgencyScore?: number;
                }> = [];

                for (const item of parsed) {
                    const idx: number = item.taskIndex;
                    let quad = item.quadrant as string;
                    if (!idx || !tasksToClassify[idx - 1]) continue;

                    const axes = resolvePriorityAxes({
                        importanceScore: item.importanceScore,
                        urgencyScore: item.urgencyScore,
                        fillDefaults: false,
                    });
                    // 若缺分数但有象限，用象限中心点
                    if (
                        axes.importanceScore === null ||
                        axes.urgencyScore === null
                    ) {
                        if (["q1", "q2", "q3", "q4"].includes(quad)) {
                            const centers: Record<
                                string,
                                { i: number; u: number }
                            > = {
                                q1: { i: 0.6, u: 0.6 },
                                q2: { i: 0.6, u: -0.4 },
                                q3: { i: -0.4, u: 0.6 },
                                q4: { i: -0.4, u: -0.4 },
                            };
                            const c = centers[quad];
                            if (axes.importanceScore === null)
                                axes.importanceScore = c.i;
                            if (axes.urgencyScore === null)
                                axes.urgencyScore = c.u;
                        }
                    }
                    const derived = quadrantFromAxes(
                        axes.importanceScore,
                        axes.urgencyScore,
                    );
                    if (derived) quad = derived;
                    if (!["q1", "q2", "q3", "q4"].includes(quad)) continue;

                    const task = tasksToClassify[idx - 1];
                    classifications.push({
                        taskId: task.id,
                        quadrant: quad as "q1" | "q2" | "q3" | "q4",
                        importanceScore: axes.importanceScore ?? undefined,
                        urgencyScore: axes.urgencyScore ?? undefined,
                    });
                    await dbService.patchTask(user.id, task.id, {
                        quadrant: quad as any,
                        importanceScore: axes.importanceScore,
                        urgencyScore: axes.urgencyScore,
                    });
                }

                logger.success(
                    `[Quadrant] Classification completed: ${classifications.length} tasks classified`,
                    classifications.map((c) => ({
                        taskId: c.taskId,
                        quadrant: c.quadrant,
                        importanceScore: c.importanceScore,
                        urgencyScore: c.urgencyScore,
                        name: tasksToClassify.find((t) => t.id === c.taskId)
                            ?.name,
                    })),
                );

                res.json({ classifications });
            } catch (error: any) {
                logger.error("Classify quadrants failed:", error);
                res.status(500).json({
                    error: error.message || "Failed to classify quadrants",
                });
            }
        },
    );

    // ── AI 聊天记录持久化（多上下文） ────────────────────────

    // 列出用户所有上下文
    router.get(
        "/chat/contexts",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const contexts = await dbService.getChatContexts(user.id);
                res.json({ contexts });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to list chat contexts:", message);
                res.status(500).json({ error: "Failed to list chat contexts" });
            }
        },
    );

    // 创建新上下文
    router.post(
        "/chat/contexts",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const id = await dbService.createChatContext(user.id);
                res.status(201).json({
                    context: {
                        id,
                        title: "新对话",
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        messageCount: 0,
                    },
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to create chat context:", message);
                res.status(500).json({
                    error: "Failed to create chat context",
                });
            }
        },
    );

    // 加载指定上下文
    router.get(
        "/chat/contexts/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const row = await dbService.getChatContext(req.params.id);
                if (!row) {
                    return res.status(404).json({ error: "Context not found" });
                }
                res.json({ messages: JSON.parse(row.messages) });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to load chat context:", message);
                res.status(500).json({ error: "Failed to load chat context" });
            }
        },
    );

    // 删除指定上下文
    router.delete(
        "/chat/contexts/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                await dbService.deleteChatContext(req.params.id);
                res.json({ ok: true });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to delete chat context:", message);
                res.status(500).json({
                    error: "Failed to delete chat context",
                });
            }
        },
    );

    // 加载当前活跃上下文（兼容旧版）
    router.get(
        "/chat/history",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const row = await dbService.getChatHistory(user.id);
                if (row) {
                    res.json({ messages: JSON.parse(row.messages) });
                } else {
                    res.json({ messages: [] });
                }
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to load chat history:", message);
                res.status(500).json({ error: "Failed to load chat history" });
            }
        },
    );

    // 保存消息（可选 contextId）
    router.post(
        "/chat/history",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { messages, contextId } = req.body || {};
                if (!Array.isArray(messages)) {
                    return res
                        .status(400)
                        .json({ error: "messages array required" });
                }
                const savedId = await dbService.saveChatHistory(
                    user.id,
                    JSON.stringify(messages),
                    contextId,
                );
                res.json({ ok: true, contextId: savedId });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to save chat history:", message);
                res.status(500).json({ error: "Failed to save chat history" });
            }
        },
    );

    // 撤销最后一轮对话（同时删除该轮创建的任务）
    router.post("/chat/undo", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const row = await dbService.getChatHistory(user.id);
            if (!row) {
                return res.status(404).json({ error: "No chat history found" });
            }

            const messages: any[] = JSON.parse(row.messages);

            // 找到最后一个 user 消息的索引
            let lastUserIdx = -1;
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].role === "user") {
                    lastUserIdx = i;
                    break;
                }
            }

            if (lastUserIdx === -1) {
                return res
                    .status(400)
                    .json({ error: "No user messages to undo" });
            }

            // 收集撤销的消息（从最后一个 user 到末尾）
            const undoneMessages = messages.slice(lastUserIdx);
            const keptMessages = messages.slice(0, lastUserIdx);

            // 从撤销的 tool 消息中提取任务 ID 并删除
            const deletedTaskIds: string[] = [];
            for (const msg of undoneMessages) {
                if (msg.role !== "tool") continue;
                try {
                    const content =
                        typeof msg.content === "string"
                            ? JSON.parse(msg.content)
                            : msg.content;
                    const taskId = content?.task?.id;
                    if (taskId) {
                        await dbService.deleteTask(taskId);
                        deletedTaskIds.push(taskId);
                    }
                } catch {
                    // 无法解析或不含 task.id，跳过
                }
            }

            // 保存截断后的消息
            await dbService.saveChatHistory(
                user.id,
                JSON.stringify(keptMessages),
                row.id,
            );

            logger.info(
                `Undid last turn for user ${user.id}: removed ${undoneMessages.length} messages, deleted ${deletedTaskIds.length} tasks`,
            );

            res.json({
                ok: true,
                removedMessages: undoneMessages.length,
                deletedTasks: deletedTaskIds.length,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error("Failed to undo chat:", message);
            res.status(500).json({ error: "Failed to undo chat" });
        }
    });

    // 查询MicrosoftTODO接口状态的API端点
    router.post(
        "/status/microsoft-todo",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const status = {
                    connected: !!user.MStoken,
                    binded: user.MSbinded,
                    tokenAvailable: !!user.MStoken,
                    lastChecked: toShanghaiISO(),
                };

                // 如果有token，尝试验证token是否有效
                if (user.MStoken) {
                    try {
                        const graphEndpoint = `https://graph.microsoft.com/v1.0/me/todo/lists?$top=1`;
                        const headers = {
                            Authorization: `Bearer ${user.MStoken}`,
                        };
                        await axios.get(graphEndpoint, { headers });
                        status.connected = true;
                    } catch (error) {
                        status.connected = false;
                        logger.error("Microsoft Todo API check failed:", error);
                    }
                }

                res.status(200).json(status);
            } catch (error) {
                res.status(500).json({
                    error: "Failed to check Microsoft Todo status",
                });
            }
        },
    );

    // 查询Ebridge接口状态的API端点
    router.post(
        "/status/ebridge",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const status: any = {
                    connected: user.ebridgeBinded, // This now reflects ebridge (timetable) specifically
                    binded: !!user.XJTLUPassword,
                    passwordAvailable: !!user.XJTLUPassword,
                    emsClientAvailable: !!user.emsClient,
                    timetableUrl: user.timetableUrl || null,
                    lastChecked: toShanghaiISO(),
                    exchangeBinded: user.ExchangeBinded,
                    exchangeTokenAvailable: !!user.ExchangeAccessToken,
                    smtpBinded: user.ImapBinded || false,
                    smtpEmail: user.ImapEmail || null,
                    imapClientAvailable: !!user.imapClient,
                };

                // 立即发送响应给客户端
                res.status(200).json(status);
            } catch (error) {
                // 如果在准备响应时出错，发送错误响应
                res.status(500).json({
                    error: "Failed to check Ebridge status",
                });
            }
        },
    );

    // 解除 Exchange 绑定
    router.post(
        "/unbind/exchange",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.ExchangeBinded = false;
                user.ExchangeAccessToken = undefined;
                user.ExchangeRefreshToken = undefined;
                user.ExchangeTokenExpiresAt = undefined;

                await dbService.updateUser(user);
                // userCache is updated by reference if in-memory, but dbService.updateUser doesn't update cache automatically in all implementations unless we do it explicitly or if cache holds the same object.
                // In current impl, userCache holds the object reference, so good.

                res.status(200).json({
                    message: "Exchange unbinded successfully",
                });
            } catch (error) {
                logger.error("Failed to unbind Exchange:", error);
                res.status(500).json({ error: "Failed to unbind Exchange" });
            }
        },
    );

    router.post("/bind/imap", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const { imapEmail, imapPassword, imapHost, imapPort, imapTls } =
                req.body || {};
            if (!imapEmail || !imapPassword || !imapHost || !imapPort) {
                return res.status(400).json({
                    error: "Missing required IMAP configuration fields",
                });
            }
            user.ImapEmail = imapEmail;
            user.ImapPassword = imapPassword;
            user.ImapHost = imapHost;
            user.ImapPort = Number(imapPort);
            user.ImapTls = imapTls !== false;
            user.ImapBinded = true;
            await dbService.updateUser(user);
            res.status(200).json({ message: "IMAP bound successfully" });
        } catch (error) {
            logger.error("Failed to bind IMAP:", error);
            res.status(500).json({ error: "Failed to bind IMAP" });
        }
    });

    router.post(
        "/unbind/imap",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.ImapBinded = false;
                user.ImapEmail = undefined;
                user.ImapPassword = undefined;
                user.ImapHost = undefined;
                user.ImapPort = undefined;
                user.ImapTls = undefined;
                if (user.imapClient) {
                    await user.imapClient.close();
                    user.imapClient = undefined;
                }
                await dbService.updateUser(user);
                res.status(200).json({ message: "IMAP unbind successfully" });
            } catch (error) {
                logger.error("Failed to unbind IMAP:", error);
                res.status(500).json({ error: "Failed to unbind IMAP" });
            }
        },
    );

    // 手动触发课表同步
    router.post(
        "/sync/timetable",
        authenticateToken,
        async (req: any, res: any) => {
            const user = req.user as User;
            try {
                if (!user.ebridgeBinded || !user.timetableUrl) {
                    return res.status(400).json({
                        error: "User not bound to Ebridge or missing timetable URL",
                    });
                }

                const result = await syncUserTimetable(user, true);
                return res.status(200).json({
                    message: "Timetable sync completed",
                    added: result.added,
                    errors: result.errors,
                });
            } catch (error: any) {
                logger.error("Manual timetable sync failed:", error);
                if (user.XJTLUPassword) {
                    return res.status(500).json({
                        error: "请稍等，大约两分钟就好",
                        details:
                            "由于你刚刚绑定ebridge，获取课程表数据需要一段时间，请稍等。",
                    });
                }
                return res.status(500).json({
                    error: "Failed to sync timetable",
                    details: error.message,
                });
            }
        },
    );

    // 删除所有课程表导入的日程
    router.delete(
        "/sync/timetable",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const count = await dbService.deleteTasksByPattern(
                    user.id,
                    "timetable_%",
                );

                // 刷新用户缓存
                const deletedIds = user.tasks
                    .filter((t) => t.id.startsWith("timetable_"))
                    .map((t) => t.id);
                await dbService.refreshUserTasksIncremental(user, {
                    deletedIds,
                });

                return res.status(200).json({
                    message: `Successfully deleted ${count} timetable tasks`,
                    count,
                });
            } catch (error) {
                logger.error("Failed to delete timetable tasks:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to delete timetable tasks" });
            }
        },
    );

    const createCalDavProvider = (user: User) => {
        if (
            !user.CalDavBaseUrl ||
            !user.CalDavUsername ||
            !user.CalDavPassword
        ) {
            return null;
        }
        return new CalDavProvider({
            baseUrl: user.CalDavBaseUrl,
            username: user.CalDavUsername,
            password: user.CalDavPassword,
            calendarHome: user.CalDavCalendarHome,
        });
    };

    router.post(
        "/caldav/config",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { baseUrl, username, password, calendarUrl } =
                    req.body || {};

                if (!baseUrl || !username || !password) {
                    return res.status(400).json({
                        error: "baseUrl, username, password are required",
                    });
                }

                user.CalDavBaseUrl = baseUrl;
                user.CalDavUsername = username;
                user.CalDavPassword = password;
                if (calendarUrl) user.CalDavCalendarUrl = calendarUrl;
                user.CalDavEnabled = true;

                const provider = createCalDavProvider(user);
                if (!provider) {
                    return res
                        .status(500)
                        .json({ error: "Failed to create CalDAV provider" });
                }

                try {
                    const discovery = await provider.discover();
                    user.CalDavPrincipalUrl = discovery.principalUrl;
                    user.CalDavCalendarHome = discovery.calendarHome;
                    if (
                        discovery.calendars.length > 0 &&
                        !user.CalDavCalendarUrl
                    ) {
                        user.CalDavCalendarUrl = discovery.calendars[0].url;
                    }
                } catch (e) {
                    logger.error("CalDAV discovery failed:", e);
                }

                await dbService.updateUser(user);
                return res.status(200).json({
                    message: "CalDAV configured successfully",
                    enabled: user.CalDavEnabled,
                    principalUrl: user.CalDavPrincipalUrl,
                    calendarHome: user.CalDavCalendarHome,
                    calendarUrl: user.CalDavCalendarUrl,
                });
            } catch (error: any) {
                logger.error("CalDAV config failed:", error);
                return res.status(500).json({
                    error: "Failed to configure CalDAV",
                    details: error.message,
                });
            }
        },
    );

    router.get(
        "/caldav/status",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                return res.status(200).json({
                    enabled: user.CalDavEnabled || false,
                    baseUrl: user.CalDavBaseUrl || null,
                    username: user.CalDavUsername ? "***" : null,
                    principalUrl: user.CalDavPrincipalUrl || null,
                    calendarHome: user.CalDavCalendarHome || null,
                    calendarUrl: user.CalDavCalendarUrl || null,
                    lastSyncAt: user.CalDavLastSyncAt || null,
                });
            } catch (error: any) {
                logger.error("CalDAV status failed:", error);
                return res.status(500).json({
                    error: "Failed to get CalDAV status",
                    details: error.message,
                });
            }
        },
    );

    router.get(
        "/caldav/calendars",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const provider = createCalDavProvider(user);

                if (!provider) {
                    return res
                        .status(400)
                        .json({ error: "CalDAV not configured" });
                }

                const calendars = await provider.listCalendars();
                return res.status(200).json({ calendars });
            } catch (error: any) {
                logger.error("CalDAV list calendars failed:", error);
                return res.status(500).json({
                    error: "Failed to list calendars",
                    details: error.message,
                });
            }
        },
    );

    router.post(
        "/caldav/sync",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const {
                    direction = "both",
                    calendarUrl,
                    rangeStart,
                    rangeEnd,
                    allowConflict,
                } = req.body || {};

                const provider = createCalDavProvider(user);
                if (!provider) {
                    return res
                        .status(400)
                        .json({ error: "CalDAV not configured" });
                }

                const syncService = new CalendarSyncService(provider);
                const result = await syncService.sync(user, {
                    direction,
                    calendarUrl: calendarUrl || user.CalDavCalendarUrl,
                    rangeStart,
                    rangeEnd,
                    allowConflict,
                });

                return res.status(200).json({
                    message: "CalDAV sync completed",
                    result,
                });
            } catch (error: any) {
                logger.error("CalDAV sync failed:", error);
                return res.status(500).json({
                    error: "Failed to sync CalDAV",
                    details: error.message,
                });
            }
        },
    );

    router.delete(
        "/caldav/config",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.CalDavBaseUrl = undefined;
                user.CalDavUsername = undefined;
                user.CalDavPassword = undefined;
                user.CalDavPrincipalUrl = undefined;
                user.CalDavCalendarHome = undefined;
                user.CalDavCalendarUrl = undefined;
                user.CalDavSyncToken = undefined;
                user.CalDavEnabled = false;
                user.CalDavLastSyncAt = undefined;

                await dbService.updateUser(user);
                return res
                    .status(200)
                    .json({ message: "CalDAV configuration removed" });
            } catch (error: any) {
                logger.error("CalDAV unbind failed:", error);
                return res.status(500).json({
                    error: "Failed to remove CalDAV configuration",
                    details: error.message,
                });
            }
        },
    );

    // ── CalDAV Server management APIs ───────────────────────────────

    // 从请求头动态推导真实服务器地址（支持 nginx 反向代理）
    const getServerBaseUrl = (req: any): string => {
        const proto = (req.get("x-forwarded-proto") || "").split(",")[0].trim();
        const forwardedHost = (req.get("x-forwarded-host") || "")
            .split(",")[0]
            .trim();
        const rawHost = req.get("host") || `localhost:${PORT}`;
        const host = (forwardedHost || rawHost).replace(/:\d+$/, "");
        const scheme = proto || (host === "localhost" ? "http" : "https");
        const port = host === "localhost" ? `:${PORT}` : "";
        return `${scheme}://${host}${port}`;
    };

    router.get(
        "/caldav-server/status",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const baseUrl = getServerBaseUrl(req);
                const serverUrl = baseUrl + "/caldav";

                // 如果服务器已启用但没有密码（历史遗留数据），自动生成一个
                if (user.CalDavServerEnabled && !user.CalDavPassword) {
                    user.CalDavPassword = uuidv4();
                    await dbService.updateUser(user);
                    logger.info(
                        `Auto-generated CalDavPassword for user ${user.email}`,
                    );
                }

                return res.status(200).json({
                    enabled: user.CalDavServerEnabled || false,
                    serverUrl,
                    principalUrl: user.CalDavServerEnabled
                        ? `${serverUrl}/principals/${user.id}/`
                        : null,
                    calendarHomeUrl: user.CalDavServerEnabled
                        ? `${serverUrl}/calendars/${user.id}/`
                        : null,
                    calendarUrl: user.CalDavServerEnabled
                        ? `${serverUrl}/calendars/${user.id}/default/`
                        : null,
                    username: user.CalDavServerEnabled
                        ? user.CalDavUsername || user.email
                        : null,
                    password: user.CalDavServerEnabled
                        ? user.CalDavPassword || null
                        : null,
                    connectionHint: user.CalDavServerEnabled
                        ? `使用 ${serverUrl} 作为 CalDAV 服务器地址，用户名: ${user.CalDavUsername || user.email}`
                        : "CalDAV server 未启用，请先启用。",
                    clientProfile: user.CalDavClientProfile || "auto",
                });
            } catch (error: any) {
                logger.error("CalDAV server status failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get CalDAV server status" });
            }
        },
    );

    router.post(
        "/caldav-server/enable",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const baseUrl = getServerBaseUrl(req);
                const serverUrl = baseUrl + "/caldav";

                user.CalDavServerEnabled = true;

                // Auto-bind: configure user's CalDAV client to point to platform CalDAV server
                // Generate a dedicated CalDAV password if not already set
                if (!user.CalDavPassword) {
                    user.CalDavPassword = uuidv4();
                }
                user.CalDavBaseUrl = serverUrl;
                user.CalDavUsername = user.email;
                user.CalDavPrincipalUrl = `${serverUrl}/principals/${user.id}/`;
                user.CalDavCalendarHome = `${serverUrl}/calendars/${user.id}/`;
                user.CalDavCalendarUrl = `${serverUrl}/calendars/${user.id}/default/`;
                user.CalDavEnabled = true;

                await dbService.updateUser(user);

                return res.status(200).json({
                    message: "CalDAV server enabled",
                    serverUrl,
                    principalUrl: `${serverUrl}/principals/${user.id}/`,
                    calendarHomeUrl: `${serverUrl}/calendars/${user.id}/`,
                    calendarUrl: `${serverUrl}/calendars/${user.id}/default/`,
                    username: user.email,
                    password: user.CalDavPassword,
                });
            } catch (error: any) {
                logger.error("CalDAV server enable failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to enable CalDAV server" });
            }
        },
    );

    router.post(
        "/caldav-server/disable",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                user.CalDavServerEnabled = false;
                await dbService.updateUser(user);
                return res
                    .status(200)
                    .json({ message: "CalDAV server disabled" });
            } catch (error: any) {
                logger.error("CalDAV server disable failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to disable CalDAV server" });
            }
        },
    );

    // 设置是否自动为推广邮件创建日程
    router.post(
        "/settings/auto-schedule-promotions",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { enabled } = req.body || {};
                if (typeof enabled !== "boolean") {
                    return res
                        .status(400)
                        .json({ error: "enabled boolean required" });
                }
                user.autoSchedulePromotions = enabled;
                await dbService.updateUser(user);
                return res
                    .status(200)
                    .json({ autoSchedulePromotions: enabled });
            } catch (error: any) {
                logger.error("Failed to update autoSchedulePromotions:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update setting" });
            }
        },
    );

    router.post(
        "/settings/strip-reply-prefix",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { enabled } = req.body || {};
                if (typeof enabled !== "boolean") {
                    return res
                        .status(400)
                        .json({ error: "enabled boolean required" });
                }
                user.stripReplyPrefix = enabled;
                await dbService.updateUser(user);
                return res.status(200).json({ stripReplyPrefix: enabled });
            } catch (error: any) {
                logger.error("Failed to update stripReplyPrefix:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update setting" });
            }
        },
    );

    // ── 引导页完成状态（持久化到数据库）─────────────────

    // 获取引导页状态
    router.get(
        "/settings/onboarding",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                return res.json({
                    onboardingCompleted: !!user.onboardingCompleted,
                });
            } catch (error: any) {
                logger.error("Failed to get onboarding status:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get onboarding status" });
            }
        },
    );

    // 更新引导页状态
    router.post(
        "/settings/onboarding",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { completed } = req.body || {};
                if (typeof completed !== "boolean") {
                    return res
                        .status(400)
                        .json({ error: "completed boolean required" });
                }
                user.onboardingCompleted = completed;
                await dbService.updateUser(user);
                return res.json({ onboardingCompleted: completed });
            } catch (error: any) {
                logger.error("Failed to update onboarding status:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update onboarding status" });
            }
        },
    );

    // 设置 CalDAV 客户端兼容模式
    router.post(
        "/caldav-server/client-profile",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { profile } = req.body || {};
                const valid = [
                    "auto",
                    "apple",
                    "thunderbird",
                    "davx5",
                    "outlook",
                    "generic",
                ];
                if (!profile || !valid.includes(profile)) {
                    return res.status(400).json({
                        error: `Invalid profile. Must be one of: ${valid.join(", ")}`,
                    });
                }
                user.CalDavClientProfile = profile;
                await dbService.updateUser(user);
                return res.status(200).json({ clientProfile: profile });
            } catch (error: any) {
                logger.error("CalDAV client profile update failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update client profile" });
            }
        },
    );

    // 获取用户日志（分页、可按时间与类型过滤）
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

    // 创建任务（带冲突检测 + boundary 配置 + 重复实例统计）
    router.post("/tasks", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                name,
                description,
                startTime,
                endTime,
                dueDate,
                location,
                boundaryConflict,
                recurrenceRule: recurrenceRuleInput,
                importance,
                importanceScore,
                urgencyScore,
                scheduleType: scheduleTypeInput,
                visibility,
                authorizedUserIds,
                blockedUserIds,
            } = req.body || {};
            if (!name || !startTime || !endTime) {
                return res
                    .status(400)
                    .json({ error: "name, startTime, endTime required" });
            }
            let taskMetadata;
            try {
                taskMetadata = resolveTaskMetadata(req.body || {});
            } catch (error: any) {
                return res.status(400).json({ error: error.message });
            }
            let parsedRecurrence: RecurrenceRule | undefined;
            let resolvedScheduleType: ScheduleType;
            try {
                const resolved = resolveScheduleType({
                    explicit: scheduleTypeInput,
                    recurrence: recurrenceRuleInput,
                    fallback: "single",
                });
                parsedRecurrence = resolved.parsedRecurrence;
                resolvedScheduleType = resolved.scheduleType;
            } catch (err: any) {
                const msg = err?.message?.includes("recurrenceRule")
                    ? "Invalid recurrenceRule value"
                    : "Invalid scheduleType value";
                return res.status(400).json({ error: msg });
            }
            const axes = resolvePriorityAxes({
                importanceScore,
                urgencyScore,
                importance: importance || "normal",
                fillDefaults: true,
            });
            const task: Task = {
                id: uuidv4(),
                name,
                description: description || "",
                startTime,
                endTime,
                dueDate: dueDate || endTime,
                location,
                completed: false,
                pushedToMSTodo: false,
                importance: importance || "normal",
                ...taskMetadata,
                importanceScore: axes.importanceScore,
                urgencyScore: axes.urgencyScore,
                quadrant: quadrantFromAxes(
                    axes.importanceScore,
                    axes.urgencyScore,
                ),
                scheduleType: resolvedScheduleType,
                visibility: visibility || "private",
                authorizedUserIds: authorizedUserIds || undefined,
                blockedUserIds: blockedUserIds || undefined,
            };
            const effectiveBoundary =
                boundaryConflict !== undefined
                    ? !!boundaryConflict
                    : !!user.conflictBoundaryInclusive;
            if (parsedRecurrence)
                task.recurrenceRule = JSON.stringify(parsedRecurrence);

            // 冲突检测
            const conflicts = findConflictingTasks(user.tasks || [], task, {
                boundaryConflict: effectiveBoundary,
            });

            try {
                await dbService.addTask(user.id, task, effectiveBoundary, true);
            } catch (e: any) {
                throw e;
            }
            broadcastTaskChange("created", task, user.id);
            if (conflicts.length > 0) {
                await logUserEvent(
                    user.id,
                    "taskConflict",
                    `Created task with conflict ${task.name}`,
                    { id: task.id, conflicts: conflicts.map((c) => c.id) },
                );
            } else {
                await logUserEvent(
                    user.id,
                    "taskCreated",
                    `Created task ${task.name}`,
                    {
                        id: task.id,
                        startTime: task.startTime,
                        endTime: task.endTime,
                    },
                );
            }

            let createdChildren = 0,
                conflictChildren = 0,
                errorChildren = 0;
            const createdIds: string[] = [task.id];
            const instanceConflicts: any[] = [];

            if (parsedRecurrence) {
                const generated = generateRecurrenceInstances(
                    task,
                    parsedRecurrence,
                );
                for (const inst of generated) {
                    try {
                        const instConf = findConflictingTasks(
                            user.tasks || [],
                            inst,
                            { boundaryConflict: effectiveBoundary },
                        );
                        if (instConf.length > 0) {
                            instanceConflicts.push({
                                instance: {
                                    id: inst.id,
                                    startTime: inst.startTime,
                                    endTime: inst.endTime,
                                },
                                conflicts: instConf.map((c) => ({
                                    id: c.id,
                                    name: c.name,
                                    startTime: c.startTime,
                                    endTime: c.endTime,
                                })),
                            });
                            await logUserEvent(
                                user.id,
                                "taskConflict",
                                `Created recurrence instance with conflict ${inst.name}`,
                                {
                                    parentId: task.id,
                                    instanceStart: inst.startTime,
                                    instanceEnd: inst.endTime,
                                },
                            );
                        } else {
                            await logUserEvent(
                                user.id,
                                "taskCreated",
                                `Created recurrence instance ${inst.name}`,
                                {
                                    id: inst.id,
                                    parentTaskId: inst.parentTaskId,
                                    startTime: inst.startTime,
                                    endTime: inst.endTime,
                                },
                            );
                        }

                        await dbService.addTask(
                            user.id,
                            inst,
                            effectiveBoundary,
                            true,
                        );
                        createdChildren++;
                        createdIds.push(inst.id);
                        broadcastTaskChange("created", inst, user.id);
                    } catch (e: any) {
                        errorChildren++;
                        await logUserEvent(
                            user.id,
                            "taskError",
                            `Error creating recurrence instance for ${task.name}`,
                            { parentId: task.id, error: e?.message },
                        );
                    }
                }
            }
            // 增量刷新缓存：仅合并新建的任务
            await dbService.refreshUserTasksIncremental(user, {
                addedIds: createdIds,
            });
            const savedTask =
                (await dbService.getTaskById(task.id)) || task;
            return res.status(201).json({
                task: savedTask,
                recurrenceSummary: buildRecurrenceSummary(
                    parsedRecurrence,
                    createdChildren,
                    0,
                    errorChildren,
                ),
                conflictWarning:
                    conflicts.length > 0 || instanceConflicts.length > 0
                        ? {
                              message: "Task created with time conflicts",
                              conflicts: conflicts.map((c) => ({
                                  id: c.id,
                                  name: c.name,
                                  startTime: c.startTime,
                                  endTime: c.endTime,
                              })),
                              instanceConflicts,
                          }
                        : undefined,
            });
        } catch (error) {
            logger.error("Create task failed:", error);
            return res.status(500).json({ error: "Failed to create task" });
        }
    });

    // 冲突预检接口：返回与给定时间段冲突的任务列表（支持 boundary 覆盖）
    router.post(
        "/tasks/conflicts",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { startTime, endTime, boundaryConflict } = req.body || {};
                if (!startTime || !endTime) {
                    return res
                        .status(400)
                        .json({ error: "startTime and endTime required" });
                }
                const candidate: Task = {
                    id: "candidate",
                    name: "candidate",
                    description: "",
                    startTime,
                    endTime,
                    dueDate: endTime,
                    completed: false,
                    pushedToMSTodo: false,
                };
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;
                const conflicts = findConflictingTasks(
                    user.tasks || [],
                    candidate,
                    { boundaryConflict: effectiveBoundary },
                );
                return res.status(200).json({ conflicts });
            } catch (error) {
                logger.error("Conflict pre-check failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to check conflicts" });
            }
        },
    );

    // 批量创建任务（部分成功 & 冲突与错误分离）
    router.post(
        "/tasks/batch",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { tasks, boundaryConflict } = req.body || {};
                if (!Array.isArray(tasks) || tasks.length === 0) {
                    return res
                        .status(400)
                        .json({ error: "tasks array required" });
                }
                const results: any[] = [];
                let created = 0,
                    conflictsCount = 0,
                    errors = 0;
                const batchBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : undefined;

                for (const input of tasks) {
                    const {
                        name,
                        description,
                        startTime,
                        endTime,
                        dueDate,
                        location,
                        recurrenceRule: recurrenceRuleInput,
                        importance,
                        scheduleType: scheduleTypeInput,
                    } = input || {};
                    if (!name || !startTime || !endTime) {
                        results.push({
                            input,
                            status: "error",
                            errorMessage: "name, startTime, endTime required",
                        });
                        errors++;
                        continue;
                    }
                    let taskMetadata;
                    try {
                        taskMetadata = resolveTaskMetadata(input || {});
                    } catch (error: any) {
                        results.push({
                            input,
                            status: "error",
                            errorMessage: error.message,
                        });
                        errors++;
                        continue;
                    }
                    let parsedRecurrence: RecurrenceRule | undefined;
                    let resolvedScheduleType: ScheduleType;
                    try {
                        const resolved = resolveScheduleType({
                            explicit: scheduleTypeInput,
                            recurrence: recurrenceRuleInput,
                            fallback: "single",
                        });
                        parsedRecurrence = resolved.parsedRecurrence;
                        resolvedScheduleType = resolved.scheduleType;
                    } catch (err: any) {
                        const errorMessage = err?.message?.includes(
                            "recurrenceRule",
                        )
                            ? "Invalid recurrenceRule value"
                            : "Invalid scheduleType value";
                        results.push({ input, status: "error", errorMessage });
                        errors++;
                        continue;
                    }
                    const effectiveBoundary =
                        input.boundaryConflict !== undefined
                            ? !!input.boundaryConflict
                            : batchBoundary !== undefined
                              ? batchBoundary
                              : !!user.conflictBoundaryInclusive;
                    const task: Task = {
                        id: uuidv4(),
                        name,
                        description: description || "",
                        startTime,
                        endTime,
                        dueDate: dueDate || endTime,
                        location,
                        completed: false,
                        pushedToMSTodo: false,
                        importance: importance || "normal",
                        ...taskMetadata,
                        scheduleType: resolvedScheduleType,
                    };
                    if (parsedRecurrence)
                        task.recurrenceRule = JSON.stringify(parsedRecurrence);

                    const conflicts = findConflictingTasks(
                        user.tasks || [],
                        task,
                        { boundaryConflict: effectiveBoundary },
                    );

                    try {
                        await dbService.addTask(
                            user.id,
                            task,
                            effectiveBoundary,
                            true,
                        );
                        broadcastTaskChange("created", task, user.id);

                        if (conflicts.length > 0) {
                            await logUserEvent(
                                user.id,
                                "taskConflict",
                                `Batch created task with conflict ${task.name}`,
                                {
                                    id: task.id,
                                    startTime: task.startTime,
                                    endTime: task.endTime,
                                },
                            );
                        } else {
                            await logUserEvent(
                                user.id,
                                "taskCreated",
                                `Batch created task ${task.name}`,
                                {
                                    id: task.id,
                                    startTime: task.startTime,
                                    endTime: task.endTime,
                                },
                            );
                        }

                        let createdChildren = 0,
                            conflictChildren = 0,
                            errorChildren = 0;
                        const createdIds: string[] = [task.id];
                        const instanceConflicts: any[] = [];

                        if (parsedRecurrence) {
                            const generated = generateRecurrenceInstances(
                                task,
                                parsedRecurrence,
                            );
                            for (const inst of generated) {
                                try {
                                    const instConf = findConflictingTasks(
                                        user.tasks || [],
                                        inst,
                                        { boundaryConflict: effectiveBoundary },
                                    );
                                    if (instConf.length > 0) {
                                        instanceConflicts.push({
                                            instance: {
                                                id: inst.id,
                                                startTime: inst.startTime,
                                                endTime: inst.endTime,
                                            },
                                            conflicts: instConf.map((c) => ({
                                                id: c.id,
                                                name: c.name,
                                                startTime: c.startTime,
                                                endTime: c.endTime,
                                            })),
                                        });
                                        await logUserEvent(
                                            user.id,
                                            "taskConflict",
                                            `Batch created recurrence instance with conflict ${inst.name}`,
                                            {
                                                parentId: task.id,
                                                instanceStart: inst.startTime,
                                                instanceEnd: inst.endTime,
                                            },
                                        );
                                    } else {
                                        await logUserEvent(
                                            user.id,
                                            "taskCreated",
                                            `Batch created recurrence instance ${inst.name}`,
                                            {
                                                id: inst.id,
                                                parentTaskId: inst.parentTaskId,
                                                startTime: inst.startTime,
                                                endTime: inst.endTime,
                                            },
                                        );
                                    }

                                    await dbService.addTask(
                                        user.id,
                                        inst,
                                        effectiveBoundary,
                                        true,
                                    );
                                    createdChildren++;
                                    createdIds.push(inst.id);
                                    broadcastTaskChange(
                                        "created",
                                        inst,
                                        user.id,
                                    );
                                } catch (e: any) {
                                    errorChildren++;
                                    await logUserEvent(
                                        user.id,
                                        "taskError",
                                        `Error creating batch instance for ${task.name}`,
                                        {
                                            parentId: task.id,
                                            error: e?.message,
                                        },
                                    );
                                }
                            }
                            const savedTask =
                                (await dbService.getTaskById(task.id)) || task;
                            results.push({
                                input,
                                status: "created",
                                task: savedTask,
                                recurrenceSummary: buildRecurrenceSummary(
                                    parsedRecurrence,
                                    createdChildren,
                                    0,
                                    errorChildren,
                                ),
                                conflictWarning:
                                    conflicts.length > 0 ||
                                    instanceConflicts.length > 0
                                        ? {
                                              message:
                                                  "Task created with time conflicts",
                                              conflicts: conflicts.map((c) => ({
                                                  id: c.id,
                                                  name: c.name,
                                                  startTime: c.startTime,
                                                  endTime: c.endTime,
                                              })),
                                              instanceConflicts,
                                          }
                                        : undefined,
                            });
                        } else {
                            const savedTask =
                                (await dbService.getTaskById(task.id)) || task;
                            results.push({
                                input,
                                status: "created",
                                task: savedTask,
                                conflictWarning:
                                    conflicts.length > 0
                                        ? {
                                              message:
                                                  "Task created with time conflicts",
                                              conflicts: conflicts.map((c) => ({
                                                  id: c.id,
                                                  name: c.name,
                                                  startTime: c.startTime,
                                                  endTime: c.endTime,
                                              })),
                                          }
                                        : undefined,
                            });
                        }
                        // 增量刷新缓存：合并新建 id
                        await dbService.refreshUserTasksIncremental(user, {
                            addedIds: createdIds,
                        });
                        created++;
                    } catch (e: any) {
                        errors++;
                        results.push({
                            input,
                            status: "error",
                            errorMessage: e?.message || "unknown error",
                        });
                        await logUserEvent(
                            user.id,
                            "taskError",
                            `Error creating task ${name}`,
                            { startTime, endTime, error: e?.message },
                        );
                    }
                }
                return res.status(200).json({
                    results,
                    summary: {
                        total: tasks.length,
                        created,
                        conflicts: 0,
                        errors,
                    }, // conflicts count is 0 because we created them
                });
            } catch (error) {
                logger.error("Batch task creation failed:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to create batch tasks" });
            }
        },
    );

    // 设置用户级冲突边界模式
    router.post(
        "/settings/conflict-mode",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { boundaryConflictInclusive } = req.body || {};
                if (typeof boundaryConflictInclusive !== "boolean") {
                    return res.status(400).json({
                        error: "boundaryConflictInclusive boolean required",
                    });
                }
                user.conflictBoundaryInclusive = boundaryConflictInclusive;
                await dbService.updateUser(user);
                return res.status(200).json({
                    boundaryConflictInclusive,
                    updatedAt: toShanghaiISO(),
                });
            } catch (error) {
                logger.error("Failed to update conflict mode:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to update conflict mode" });
            }
        },
    );

    // 获取当前周信息（包含全局偏移与用户偏移）
    router.get(
        "/settings/week",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                // 计算原始周次（不含任何偏移）
                const { weekOffset: academicWeekOffset } =
                    getAcademicYearConfig();
                const rawWeekNumber = getRawWeekNumber();

                const globalWeekOffset = academicWeekOffset;
                const userWeekOffset =
                    user && typeof user.weekOffset === "number"
                        ? user.weekOffset
                        : 0;

                const effectiveWeek = Math.max(
                    1,
                    rawWeekNumber + globalWeekOffset + (userWeekOffset || 0),
                );

                return res.status(200).json({
                    rawWeekNumber,
                    globalWeekOffset,
                    userWeekOffset: userWeekOffset || 0,
                    effectiveWeek,
                });
            } catch (error) {
                logger.error("Failed to get week info:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to get week info" });
            }
        },
    );

    // 更新用户级周数偏移（可通过提供currentWeek来设置当前周数）
    router.post(
        "/settings/week",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { currentWeek, userWeekOffset } = req.body || {};

                const { weekOffset: academicWeekOffset } =
                    getAcademicYearConfig();
                const rawWeekNumber = getRawWeekNumber();

                let newUserOffset =
                    typeof userWeekOffset === "number"
                        ? userWeekOffset
                        : undefined;
                if (typeof currentWeek === "number") {
                    // 计算需要设置的 user offset，使得 raw + global + userOffset === currentWeek
                    newUserOffset =
                        currentWeek - (rawWeekNumber + academicWeekOffset);
                }

                if (typeof newUserOffset !== "number" || isNaN(newUserOffset)) {
                    return res.status(400).json({
                        error: "Either currentWeek (number) or userWeekOffset (number) required",
                    });
                }

                user.weekOffset = Math.trunc(newUserOffset);
                await dbService.updateUser(user);

                // 返回更新后的信息
                const effectiveWeek = Math.max(
                    1,
                    rawWeekNumber + academicWeekOffset + (user.weekOffset || 0),
                );
                return res.status(200).json({
                    rawWeekNumber,
                    globalWeekOffset: academicWeekOffset,
                    userWeekOffset: user.weekOffset || 0,
                    effectiveWeek,
                });
            } catch (error) {
                logger.error("Failed to set week info:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to set week info" });
            }
        },
    );

    // 获取单个任务。返回 Task 本体，与移动端 taskApi.getTaskById 契约一致。
    router.get("/tasks/:id", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const taskId = req.params.id as string;
            const ownedTasks = await dbService.getTasksByUserId(user.id);
            const task = ownedTasks.find((item) => item.id === taskId);
            if (!task) {
                return res.status(404).json({ error: "Task not found" });
            }
            return res.status(200).json(task);
        } catch (error) {
            logger.error("GET /tasks/:id failed:", error);
            return res.status(500).json({ error: "Failed to fetch task" });
        }
    });

    // 更新任务（部分字段 + 冲突检测）
    router.put("/tasks/:id", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const taskId = req.params.id;
            // 以数据库为准，避免 userCache 中 tasks 缺双轴/象限导致写回旧值
            const existing = await dbService.getTaskById(taskId);
            if (!existing)
                return res.status(404).json({ error: "task not found" });
            const owned = (user.tasks || []).some((t) => t.id === taskId);
            if (!owned) {
                // 缓存未命中时回退查库归属
                const all = await dbService.getTasksByUserId(user.id);
                if (!all.some((t) => t.id === taskId)) {
                    return res.status(404).json({ error: "task not found" });
                }
            }
            const {
                name,
                description,
                startTime,
                endTime,
                dueDate,
                location,
                completed,
                boundaryConflict,
                importance,
                importanceScore,
                urgencyScore,
                recurrenceRule: recurrenceRuleInput,
                scheduleType: scheduleTypeInput,
                visibility,
                authorizedUserIds,
                blockedUserIds,
                eventType,
                category,
                allDay,
                isReminderOn,
                reminderMinutesBefore,
                attachments,
                allocatedMinutes,
            } = req.body || {};
            const recurrenceSource =
                recurrenceRuleInput !== undefined
                    ? recurrenceRuleInput
                    : existing.recurrenceRule;
            let parsedRecurrence: RecurrenceRule | undefined;
            let resolvedScheduleType: ScheduleType;
            try {
                const resolved = resolveScheduleType({
                    explicit: scheduleTypeInput,
                    recurrence: recurrenceSource,
                    fallback: existing.scheduleType || "single",
                });
                parsedRecurrence = resolved.parsedRecurrence;
                resolvedScheduleType = resolved.scheduleType;
            } catch (err: any) {
                const msg = err?.message?.includes("recurrenceRule")
                    ? "Invalid recurrenceRule value"
                    : "Invalid scheduleType value";
                return res.status(400).json({ error: msg });
            }
            const recurrenceString =
                recurrenceRuleInput !== undefined
                    ? parsedRecurrence
                        ? JSON.stringify(parsedRecurrence)
                        : undefined
                    : existing.recurrenceRule;

            const nextImportance =
                importance !== undefined ? importance : existing.importance;
            const axesTouched =
                importanceScore !== undefined || urgencyScore !== undefined;
            const nextImpScore =
                importanceScore !== undefined
                    ? clampAxisScore(importanceScore)
                    : (existing.importanceScore ?? null);
            const nextUrgScore =
                urgencyScore !== undefined
                    ? clampAxisScore(urgencyScore)
                    : (existing.urgencyScore ?? null);
            // 双轴有更新时强制重算象限，忽略 body 里可能带来的旧 quadrant
            const nextQuadrant = axesTouched
                ? quadrantFromAxes(nextImpScore, nextUrgScore) ||
                  existing.quadrant
                : existing.quadrant;
            let taskMetadata;
            try {
                taskMetadata = resolveTaskMetadata(
                    {
                        ...(eventType !== undefined ? { eventType } : {}),
                        ...(category !== undefined ? { category } : {}),
                        ...(allDay !== undefined ? { allDay } : {}),
                        ...(isReminderOn !== undefined ? { isReminderOn } : {}),
                        ...(reminderMinutesBefore !== undefined
                            ? { reminderMinutesBefore }
                            : {}),
                        ...(attachments !== undefined ? { attachments } : {}),
                        ...(allocatedMinutes !== undefined
                            ? { allocatedMinutes }
                            : {}),
                    },
                    existing,
                );
            } catch (error: any) {
                return res.status(400).json({ error: error.message });
            }

            // 构建更新后的任务对象（不直接修改原对象，先复制）
            const updated: Task = {
                ...existing,
                ...taskMetadata,
                name: name !== undefined ? name : existing.name,
                description:
                    description !== undefined
                        ? description
                        : existing.description,
                startTime:
                    startTime !== undefined ? startTime : existing.startTime,
                endTime: endTime !== undefined ? endTime : existing.endTime,
                dueDate: dueDate !== undefined ? dueDate : existing.dueDate,
                location: location !== undefined ? location : existing.location,
                completed:
                    completed !== undefined ? !!completed : existing.completed,
                importance: nextImportance,
                importanceScore: nextImpScore,
                urgencyScore: nextUrgScore,
                quadrant: nextQuadrant,
                scheduleType: resolvedScheduleType,
                recurrenceRule: recurrenceString,
                visibility: visibility !== undefined ? visibility : existing.visibility,
                authorizedUserIds: authorizedUserIds !== undefined ? authorizedUserIds : existing.authorizedUserIds,
                blockedUserIds: blockedUserIds !== undefined ? blockedUserIds : existing.blockedUserIds,
            };
            try {
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;

                // 冲突检测
                const conflicts = findConflictingTasks(
                    user.tasks.filter((t) => t.id !== updated.id),
                    updated,
                    { boundaryConflict: effectiveBoundary },
                );

                await dbService.updateTask(updated, effectiveBoundary, true);
                // 写库后再读，保证响应中的双轴/象限与持久化一致
                const saved =
                    (await dbService.getTaskById(taskId)) || updated;
                broadcastTaskChange("updated", saved, user.id);

                if (conflicts.length > 0) {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Updated task with conflict ${saved.name}`,
                        {
                            id: saved.id,
                            changes: {
                                name,
                                description,
                                startTime,
                                endTime,
                                dueDate,
                                location,
                                completed,
                                importance,
                                importanceScore,
                                urgencyScore,
                            },
                            conflicts: conflicts.map((c) => c.id),
                        },
                    );
                } else {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Updated task ${saved.name}`,
                        {
                            id: saved.id,
                            changes: {
                                name,
                                description,
                                startTime,
                                endTime,
                                dueDate,
                                location,
                                completed,
                                importance,
                                importanceScore,
                                urgencyScore,
                            },
                        },
                    );
                }

                if (completed === true && !existing.completed) {
                    broadcastTaskChange("completed", saved, user.id);
                    await logUserEvent(
                        user.id,
                        "taskCompleted",
                        `Completed task ${saved.name}`,
                        { id: saved.id },
                    );
                }
                // 增量刷新缓存：仅合并被更新的任务
                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [saved.id],
                });
                return res.status(200).json({
                    task: saved,
                    axes: {
                        importanceScore: saved.importanceScore ?? null,
                        urgencyScore: saved.urgencyScore ?? null,
                        quadrant: saved.quadrant,
                    },
                    conflictWarning:
                        conflicts.length > 0
                            ? {
                                  message: "Task updated with time conflicts",
                                  conflicts: conflicts.map((c) => ({
                                      id: c.id,
                                      name: c.name,
                                      startTime: c.startTime,
                                      endTime: c.endTime,
                                  })),
                              }
                            : undefined,
                });
            } catch (e: any) {
                logger.error("Failed to update task:", e);
                return res.status(500).json({ error: "Failed to update task" });
            }
        } catch (error) {
            logger.error("Unexpected error in PUT /tasks/:id:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    /**
     * 单独调整日程四象限双轴分数
     * PATCH /api/tasks/:id/priority-axes
     * Body: { importanceScore?: number|-null, urgencyScore?: number|null }  范围 -1..1
     */
    router.patch(
        "/tasks/:id/priority-axes",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id as string;
                const parsed = parsePriorityAxesBody(req.body);
                if (!parsed.ok) {
                    return res.status(400).json({ error: parsed.error });
                }

                const existing = await dbService.getTaskById(taskId);
                if (!existing) {
                    return res.status(404).json({ error: "Task not found" });
                }
                // 归属校验：任务须属于当前用户
                const userTasks = await dbService.getTasksByUserId(user.id);
                if (!userTasks.some((t) => t.id === taskId)) {
                    return res.status(403).json({ error: "Not your task" });
                }

                const patch: Partial<Task> = { ...parsed.axes };
                const imp =
                    patch.importanceScore !== undefined
                        ? patch.importanceScore
                        : (existing.importanceScore ?? null);
                const urg =
                    patch.urgencyScore !== undefined
                        ? patch.urgencyScore
                        : (existing.urgencyScore ?? null);
                const q = quadrantFromAxes(imp ?? null, urg ?? null);
                // 始终用服务端派生象限，防止客户端乐观更新残留旧 quadrant
                if (q) patch.quadrant = q;

                await dbService.patchTask(user.id, taskId, patch);
                // 二次读库，确保响应 = 持久化真值
                const task =
                    (await dbService.getTaskById(taskId)) ||
                    ({ ...existing, ...patch, id: taskId } as Task);
                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [taskId],
                });
                broadcastTaskChange("updated", task, user.id);
                return res.status(200).json({
                    task,
                    axes: {
                        importanceScore: task.importanceScore ?? null,
                        urgencyScore: task.urgencyScore ?? null,
                        quadrant:
                            task.quadrant ||
                            quadrantFromAxes(
                                task.importanceScore ?? null,
                                task.urgencyScore ?? null,
                            ),
                    },
                });
            } catch (error: any) {
                logger.error("PATCH /tasks/:id/priority-axes failed:", error);
                return res.status(500).json({
                    error: error.message || "Failed to update priority axes",
                });
            }
        },
    );

    // 部分更新任务
    router.patch(
        "/tasks/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id;
                const rawUpdates = req.body || {};
                const allowedFields = new Set([
                    "name",
                    "description",
                    "dueDate",
                    "startTime",
                    "endTime",
                    "location",
                    "completed",
                    "importance",
                    "importanceScore",
                    "urgencyScore",
                    "recurrenceRule",
                    "scheduleType",
                    "visibility",
                    "authorizedUserIds",
                    "blockedUserIds",
                    "eventType",
                    "category",
                    "allDay",
                    "isReminderOn",
                    "reminderMinutesBefore",
                    "attachments",
                    "allocatedMinutes",
                    "boundaryConflict",
                ]);
                const unsupportedFields = Object.keys(rawUpdates).filter(
                    (field) => !allowedFields.has(field),
                );
                if (unsupportedFields.length > 0) {
                    return res.status(400).json({
                        error: `Unsupported task fields: ${unsupportedFields.join(", ")}`,
                    });
                }
                const updates = { ...rawUpdates };

                if (Object.keys(updates).length === 0) {
                    return res
                        .status(400)
                        .json({ error: "No update fields provided" });
                }

                const boundaryConflict = updates.boundaryConflict;
                delete updates.boundaryConflict;

                const existingTask = await dbService.getTaskById(taskId);
                if (!existingTask) {
                    return res.status(404).json({ error: "Task not found" });
                }
                const ownedTasks = await dbService.getTasksByUserId(user.id);
                if (!ownedTasks.some((task) => task.id === taskId)) {
                    return res.status(404).json({ error: "Task not found" });
                }
                const structuredFields = [
                    "eventType",
                    "category",
                    "allDay",
                    "isReminderOn",
                    "reminderMinutesBefore",
                    "attachments",
                    "allocatedMinutes",
                ];
                if (
                    structuredFields.some((field) =>
                        Object.prototype.hasOwnProperty.call(updates, field),
                    )
                ) {
                    try {
                        Object.assign(
                            updates,
                            resolveTaskMetadata(updates, existingTask),
                        );
                    } catch (error: any) {
                        return res.status(400).json({ error: error.message });
                    }
                }

                const scheduleTypeExplicit = updates.scheduleType;
                const recurrenceProvided = Object.prototype.hasOwnProperty.call(
                    updates,
                    "recurrenceRule",
                );
                const recurrenceSource = recurrenceProvided
                    ? updates.recurrenceRule
                    : existingTask.recurrenceRule;
                let parsedRecurrence: RecurrenceRule | undefined;
                let resolvedScheduleType: ScheduleType;
                try {
                    const resolved = resolveScheduleType({
                        explicit: scheduleTypeExplicit,
                        recurrence: recurrenceSource,
                        fallback: existingTask.scheduleType || "single",
                    });
                    parsedRecurrence = resolved.parsedRecurrence;
                    resolvedScheduleType = resolved.scheduleType;
                } catch (err: any) {
                    const msg = err?.message?.includes("recurrenceRule")
                        ? "Invalid recurrenceRule value"
                        : "Invalid scheduleType value";
                    return res.status(400).json({ error: msg });
                }

                if (recurrenceProvided) {
                    updates.recurrenceRule = parsedRecurrence
                        ? JSON.stringify(parsedRecurrence)
                        : null;
                }
                if (scheduleTypeExplicit !== undefined || recurrenceProvided) {
                    updates.scheduleType = resolvedScheduleType;
                }

                const wasCompleted = existingTask.completed;

                await dbService.patchTask(
                    user.id,
                    taskId,
                    updates,
                    boundaryConflict,
                    true,
                );
                // 写后再读，避免响应里是合并前的旧派生字段
                const updatedTask =
                    (await dbService.getTaskById(taskId)) ||
                    ({ ...existingTask, ...updates, id: taskId } as Task);

                // 冲突检测 (需要构建完整的对象)
                const fullUpdatedTask = updatedTask;
                const effectiveBoundary =
                    boundaryConflict !== undefined
                        ? !!boundaryConflict
                        : !!user.conflictBoundaryInclusive;
                let conflicts: any[] = [];
                if (updates.startTime || updates.endTime) {
                    const others =
                        user.tasks?.filter((t) => t.id !== taskId) ||
                        (await dbService.getTasksByUserId(user.id)).filter(
                            (t) => t.id !== taskId,
                        );
                    conflicts = findConflictingTasks(others, fullUpdatedTask, {
                        boundaryConflict: effectiveBoundary,
                    });
                }

                broadcastTaskChange("updated", updatedTask, user.id);

                if (conflicts.length > 0) {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Patched task with conflict ${updatedTask.name}`,
                        {
                            id: updatedTask.id,
                            changes: updates,
                            conflicts: conflicts.map((c) => c.id),
                        },
                    );
                } else {
                    await logUserEvent(
                        user.id,
                        "taskUpdated",
                        `Patched task ${updatedTask.name}`,
                        { id: updatedTask.id, changes: updates },
                    );
                }

                if (updates.completed === true && !wasCompleted) {
                    broadcastTaskChange("completed", updatedTask, user.id);
                    await logUserEvent(
                        user.id,
                        "taskCompleted",
                        `Completed task ${updatedTask.name}`,
                        { id: updatedTask.id },
                    );
                }

                await dbService.refreshUserTasksIncremental(user, {
                    updatedIds: [taskId],
                });

                const response: any = {
                    task: updatedTask,
                    axes: {
                        importanceScore: updatedTask.importanceScore ?? null,
                        urgencyScore: updatedTask.urgencyScore ?? null,
                        quadrant: updatedTask.quadrant,
                    },
                };
                if (conflicts.length > 0) {
                    response.conflictWarning = {
                        message: "Task patched with time conflicts",
                        conflicts: conflicts.map((c) => ({
                            id: c.id,
                            name: c.name,
                            startTime: c.startTime,
                            endTime: c.endTime,
                        })),
                    };
                }
                return res.status(200).json(response);
            } catch (error: any) {
                logger.error("Patch task failed:", error);
                return res.status(500).json({ error: "Failed to patch task" });
            }
        },
    );

    // 删除任务（支持级联删除 cascade=true）
    router.delete(
        "/tasks/:id",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const taskId = req.params.id;
                const existingIndex = user.tasks.findIndex(
                    (t) => t.id === taskId,
                );
                if (existingIndex < 0)
                    return res.status(404).json({ error: "task not found" });
                const cascade =
                    (req.query.cascade || "false").toString().toLowerCase() ===
                    "true";
                if (!cascade) {
                    const deletedTask = user.tasks[existingIndex];
                    const deletedOk = await dbService.deleteTask(taskId);
                    if (deletedOk) {
                        broadcastTaskChange("deleted", deletedTask, user.id);
                        await logUserEvent(
                            user.id,
                            "taskDeleted",
                            `Deleted task ${deletedTask.name}`,
                            { id: deletedTask.id },
                        );
                        // 增量刷新缓存：移除已删除 id
                        await dbService.refreshUserTasksIncremental(user, {
                            deletedIds: [taskId],
                        });
                        return res
                            .status(200)
                            .json({ id: taskId, deleted: true });
                    }
                    return res
                        .status(500)
                        .json({ error: "Failed to delete task" });
                } else {
                    // 级联删除：删除根任务和所有 parentTaskId 指向它的子实例
                    const toDeleteIds = new Set<string>();
                    toDeleteIds.add(taskId);
                    // 收集子实例
                    for (const t of user.tasks) {
                        if (t.parentTaskId === taskId) toDeleteIds.add(t.id);
                    }
                    const deletedItems: Task[] = [];
                    let anyFailed = false;
                    for (const id of Array.from(toDeleteIds)) {
                        try {
                            const ok = await dbService.deleteTask(id);
                            if (ok) {
                                const item = user.tasks.find(
                                    (tt) => tt.id === id,
                                );
                                if (item) deletedItems.push(item);
                            } else {
                                anyFailed = true;
                            }
                        } catch (e) {
                            anyFailed = true;
                        }
                    }
                    // 广播已删除项
                    for (const del of deletedItems) {
                        broadcastTaskChange("deleted", del, user.id);
                        await logUserEvent(
                            user.id,
                            "taskDeleted",
                            `Cascade deleted task ${del.name}`,
                            { id: del.id, parentId: del.parentTaskId || null },
                        );
                    }
                    if (anyFailed)
                        return res.status(500).json({
                            error: "Failed to fully delete cascade tasks",
                        });
                    // 增量刷新缓存：移除已删除的所有 id
                    await dbService.refreshUserTasksIncremental(user, {
                        deletedIds: Array.from(toDeleteIds),
                    });
                    return res.status(200).json({
                        id: taskId,
                        deleted: true,
                        cascadeDeleted: true,
                        count: toDeleteIds.size,
                    });
                }
            } catch (error) {
                logger.error("Unexpected error in DELETE /tasks/:id:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        },
    );

    // 列出任务（支持时间过滤、分页与排序）
    // 支持 query: start,end,page,limit OR offset, sortBy=(startTime|dueDate|name), order=(asc|desc)
    router.get("/tasks", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const {
                start,
                end,
                limit = "50",
                offset,
                page,
                q,
                completed,
                sortBy,
                order,
            } = req.query;
            const limNum = Math.max(
                1,
                Math.min(200, parseInt((limit as string) || "50", 10) || 50),
            );
            let offNum = 0;
            if (typeof page !== "undefined") {
                const pageNum = Math.max(0, parseInt(page as string, 10) || 0);
                offNum = pageNum * limNum;
            } else {
                offNum = Math.max(
                    0,
                    parseInt((offset as string) || "0", 10) || 0,
                );
            }

            const parsedCompleted =
                typeof completed === "string"
                    ? completed.toLowerCase() === "true"
                    : undefined;
            const parsedOrder =
                order && (order as string).toLowerCase() === "desc"
                    ? "desc"
                    : "asc";
            const opts: {
                start?: string;
                end?: string;
                q?: string;
                completed?: boolean;
                limit: number;
                offset: number;
                sortBy?: string;
                order?: "asc" | "desc";
            } = {
                start: start as string | undefined,
                end: end as string | undefined,
                q: q as string | undefined,
                completed: parsedCompleted as boolean | undefined,
                limit: limNum,
                offset: offNum,
                sortBy: sortBy as string | undefined,
                order: parsedOrder,
            };
            const { tasks, total } = await dbService.getTasksPage(
                user.id,
                opts,
            );
            return res.status(200).json({
                tasks,
                total,
                limit: limNum,
                offset: offNum,
                sortBy: opts.sortBy || "startTime",
                order: opts.order || "asc",
            });
        } catch (error) {
            logger.error("Failed to list tasks:", error);
            return res.status(500).json({ error: "Failed to list tasks" });
        }
    });

    // 列出所有父级日程（即带有 recurrenceRule 的根任务）及其子实例
    router.get(
        "/tasks/parents",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                // 拉取所有任务并筛选父任务
                const { tasks } = await dbService.getTasksPage(user.id, {
                    limit: 1000,
                });
                const parents = tasks.filter(
                    (t) => t.recurrenceRule && !t.parentTaskId,
                );

                const result: any[] = [];
                for (const p of parents) {
                    try {
                        const { occurrences, total } =
                            await dbService.getOccurrencesPage(user.id, p.id, {
                                limit: 1000,
                            });
                        result.push({ parentTask: p, occurrences, total });
                    } catch (e) {
                        // 如果某个父任务查询失败，仍继续处理其它任务
                        result.push({
                            parentTask: p,
                            occurrences: [],
                            total: 0,
                            error: (e as Error).message,
                        });
                    }
                }

                return res.status(200).json({ parents: result });
            } catch (error) {
                logger.error("Failed to list parent tasks:", error);
                return res
                    .status(500)
                    .json({ error: "Failed to list parent tasks" });
            }
        },
    );

    // recurrence helpers moved to server/Services/recurrence.ts

    // 获取某任务的所有重复实例（支持分页：page & limit，或 offset & limit；支持 sortBy & order）
    router.get(
        "/tasks/:id/occurrences",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const rootId = req.params.id;
                const {
                    limit = "50",
                    offset,
                    page,
                    sortBy = "startTime",
                    order = "asc",
                } = req.query;
                const limNum = Math.max(
                    1,
                    Math.min(
                        500,
                        parseInt((limit as string) || "50", 10) || 50,
                    ),
                );
                let offNum = 0;
                if (typeof page !== "undefined") {
                    const pageNum = Math.max(
                        0,
                        parseInt(page as string, 10) || 0,
                    );
                    offNum = pageNum * limNum;
                } else {
                    offNum = Math.max(
                        0,
                        parseInt((offset as string) || "0", 10) || 0,
                    );
                }

                const root = await dbService.getTaskById(rootId);
                if (!root)
                    return res.status(404).json({ error: "Task not found" });
                const parsedOrder =
                    order && (order as string).toLowerCase() === "desc"
                        ? "desc"
                        : "asc";
                const { occurrences, total } =
                    await dbService.getOccurrencesPage(user.id, rootId, {
                        limit: limNum,
                        offset: offNum,
                        sortBy: sortBy as string,
                        order: parsedOrder,
                    });
                return res.status(200).json({
                    rootTask: root,
                    occurrences,
                    total,
                    limit: limNum,
                    offset: offNum,
                    sortBy: sortBy || "startTime",
                    order: order || "asc",
                });
            } catch (e) {
                logger.error("Fetch occurrences failed", e);
                return res
                    .status(500)
                    .json({ error: "Failed to fetch occurrences" });
            }
        },
    ); // 获取当前用户的日程队列
    router.get(
        "/schedule-queue",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                if (!user?.id)
                    return res
                        .status(401)
                        .json({ error: "未登录或无用户信息" });
                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ queue });
            } catch (err: any) {
                logger.error("获取日程队列失败:", err);
                res.status(500).json({ error: "获取队列失败" });
            }
        },
    );

    // Approve a queued schedule request
    router.post(
        "/schedule-queue/:id/approve",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const id = req.params.id as string;
                const allowConflict = req?.body?.allowConflict === true;
                const row = await dbService.getScheduleQueueById(id);
                if (!row)
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                if (row.userId !== user.id)
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });

                const raw = row.rawRequest;
                let parsed: any = null;
                try {
                    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
                } catch (parseError) {
                    logger.warn(
                        "Failed to parse schedule queue rawRequest, using empty args",
                        parseError,
                    );
                }
                const args = parsed?.args || parsed || {};
                const normalizedArgs = normalizeQueueScheduleArgs(args);

                if (
                    !allowConflict &&
                    normalizedArgs.startTime &&
                    normalizedArgs.endTime &&
                    !normalizedArgs.recurrenceRule
                ) {
                    const { tasks: existingTasks } =
                        await dbService.getTasksPage(user.id, {
                            start: normalizedArgs.startTime,
                            end: normalizedArgs.endTime,
                            limit: 200,
                        });
                    const conflicts = findConflictingTasks(
                        existingTasks,
                        {
                            id: "new-task",
                            startTime: normalizedArgs.startTime,
                            endTime: normalizedArgs.endTime,
                        },
                        { boundaryConflict: !!user.conflictBoundaryInclusive },
                    );

                    if (conflicts.length > 0) {
                        return res
                            .status(409)
                            .json({ error: "日程冲突", conflicts });
                    }
                }

                // Call add_schedule with internal approval flag
                const result = await mcpTools.add_schedule.execute(
                    {
                        ...normalizedArgs,
                        _internal_approve: true,
                        _internal_allow_conflict: allowConflict,
                    },
                    user,
                );

                const createdTask = (result as any)?.task;
                const contentText = Array.isArray((result as any)?.content)
                    ? (result as any).content.find(
                          (c: any) => c?.type === "text",
                      )?.text
                    : undefined;

                if (!createdTask?.id) {
                    const message =
                        typeof contentText === "string"
                            ? contentText
                            : "Schedule approval did not create a task";
                    await dbService.updateScheduleQueueStatus(id, "failed");
                    await logUserEvent(
                        user.id,
                        "external_schedule_approve_failed",
                        `审批失败: ${message}`,
                        {
                            queueId: id,
                            reason: message,
                            args: normalizedArgs,
                        },
                    );
                    const queue = await dbService.getScheduleQueueByUser(
                        user.id,
                    );
                    return res
                        .status(422)
                        .json({ error: message, result, queue });
                }

                // Remove queue item (approved) and return latest queue
                try {
                    await dbService.deleteScheduleQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete schedule queue item after approval, will fallback to marking approved",
                        e,
                    );
                    await dbService.updateScheduleQueueStatus(id, "approved");
                }

                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ result, queue });
            } catch (err: any) {
                logger.error("Approving schedule queue item failed:", err);
                res.status(500).json({ error: "Approve failed" });
            }
        },
    );

    // Reject a queued schedule request
    router.post(
        "/schedule-queue/:id/reject",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const id = req.params.id as string;
                const row = await dbService.getScheduleQueueById(id);
                if (!row)
                    return res
                        .status(404)
                        .json({ error: "Queue item not found" });
                if (row.userId !== user.id)
                    return res
                        .status(403)
                        .json({ error: "Not your queue item" });

                // 写入事件拒绝缓冲池（24h TTL），再移除队列项
                try {
                    await dbService.addRejectionBufferItem(
                        user.id,
                        "schedule",
                        row.rawRequest,
                        id,
                    );
                } catch (e) {
                    logger.warn(
                        "Failed to add schedule rejection to buffer pool",
                        e,
                    );
                }

                try {
                    await dbService.deleteScheduleQueueItem(id);
                } catch (e) {
                    logger.warn(
                        "Failed to delete schedule queue item after rejection, will fallback to marking rejected",
                        e,
                    );
                    await dbService.updateScheduleQueueStatus(id, "rejected");
                }
                await logUserEvent(
                    user.id,
                    "external_schedule_rejected",
                    `已拒绝外部日程请求`,
                    { queueId: id },
                );
                const queue = await dbService.getScheduleQueueByUser(user.id);
                res.json({ ok: true, queue });
            } catch (err: any) {
                logger.error("Rejecting schedule queue item failed:", err);
                res.status(500).json({ error: "Reject failed" });
            }
        },
    );

    // ── 邮件查看接口 ──────────────────────────────────────

    interface QueueEmailPayload {
        args?: Record<string, unknown>;
        email?: {
            id: string;
            subject: string;
            from?: { name: string; address: string };
            receivedAt: string;
            isRead: boolean;
            body?: string;
            htmlBody?: string;
            hasAttachments?: boolean;
            attachmentsCount?: number;
        };
        _meta?: { source?: string; createdAt?: string };
    }

    interface EmailViewResponse {
        email: {
            id: string;
            subject: string;
            from?: { name: string; address: string };
            receivedAt: string;
            isRead: boolean;
            isAiProcessed: boolean;
            body: string;
            htmlBody?: string;
            hasAttachments?: boolean;
            attachmentsCount?: number;
            source?: string;
        };
    }

    router.get("/emails", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const limit = Math.min(
                Math.max(parseInt(req.query.limit as string) || 50, 1),
                200,
            );

            if (!user.imapClient && !user.emsClient) {
                return res.status(200).json({ emails: [], total: 0 });
            }

            // 优先使用 IMAP，其次 Exchange
            const client = user.imapClient || user.emsClient;
            if (!client) {
                return res.status(200).json({ emails: [], total: 0 });
            }

            const emails = await (client as any).findEmails(limit);

            // 标注 AI 已处理状态
            const processedIds = await dbService.getAiProcessedEmailIds(
                user.id,
            );
            const enriched = emails.map((e: any) => ({
                ...e,
                isAiProcessed: processedIds.has(String(e.id)),
            }));

            return res.status(200).json({
                emails: enriched,
                total: enriched.length,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error("Failed to list emails:", message);
            return res.status(500).json({ error: "Failed to list emails" });
        }
    });

    // 邮件搜索接口
    router.get(
        "/emails/search",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const query = ((req.query.q as string) || "")
                    .trim()
                    .toLowerCase();
                const limit = Math.min(
                    Math.max(parseInt(req.query.limit as string) || 20, 1),
                    100,
                );

                if (!query) {
                    return res
                        .status(200)
                        .json({ emails: [], total: 0, query: "" });
                }

                if (!user.imapClient && !user.emsClient) {
                    return res
                        .status(200)
                        .json({ emails: [], total: 0, query });
                }

                const client = user.imapClient || user.emsClient;
                if (!client) {
                    return res
                        .status(200)
                        .json({ emails: [], total: 0, query });
                }

                // 获取一批邮件并在内存中搜索（跨提供商统一实现，低耦合）
                const fetchLimit = Math.max(limit * 5, 100);
                const emails = await (client as any).findEmails(fetchLimit);

                // 在内存中过滤匹配的邮件
                const matched = emails.filter((e: any) => {
                    const subject = (e.subject || "").toLowerCase();
                    const fromName = (e.from?.name || "").toLowerCase();
                    const fromAddr = (e.from?.address || "").toLowerCase();
                    return (
                        subject.includes(query) ||
                        fromName.includes(query) ||
                        fromAddr.includes(query)
                    );
                });

                const paged = matched.slice(0, limit);

                // 标注 AI 已处理状态
                const processedIds = await dbService.getAiProcessedEmailIds(
                    user.id,
                );
                const enriched = paged.map((e: any) => ({
                    ...e,
                    isAiProcessed: processedIds.has(String(e.id)),
                }));

                logger.info(
                    `[EmailSearch] Query="${query}" matched=${matched.length} returned=${enriched.length}`,
                );

                return res.status(200).json({
                    emails: enriched,
                    total: matched.length,
                    query: req.query.q,
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to search emails:", message);
                return res
                    .status(500)
                    .json({ error: "Failed to search emails" });
            }
        },
    );

    router.get(
        "/emails/:emailId",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const emailId = req.params.emailId;

                // 预先查询 AI 处理状态
                const isAiProcessed = await dbService.isEmailAiProcessed(
                    user.id,
                    emailId,
                );

                const queue = await dbService.getScheduleQueueByUser(user.id);

                // 先从队列缓存中查找
                for (const item of queue) {
                    let parsed: QueueEmailPayload | null = null;
                    try {
                        parsed = JSON.parse(
                            item.rawRequest,
                        ) as QueueEmailPayload;
                    } catch {
                        continue;
                    }
                    if (parsed?.email?.id === emailId) {
                        const e = parsed.email!;
                        return res.status(200).json({
                            email: {
                                id: e.id,
                                subject: e.subject,
                                from: e.from,
                                receivedAt: e.receivedAt,
                                isRead: e.isRead,
                                isAiProcessed,
                                body: e.body || "",
                                htmlBody: e.htmlBody || undefined,
                                hasAttachments: e.hasAttachments,
                                attachmentsCount: e.attachmentsCount,
                                source: parsed._meta?.source,
                            },
                        } satisfies EmailViewResponse);
                    }
                }

                // 队列未命中，从 IMAP/Exchange 实时获取
                if (user.imapClient) {
                    try {
                        const email =
                            await user.imapClient.getEmailById(emailId);
                        return res.status(200).json({
                            email: {
                                ...email,
                                isAiProcessed,
                                body: email.body || "",
                                htmlBody: email.htmlBody || undefined,
                                source: "imap",
                            },
                        } satisfies EmailViewResponse);
                    } catch {
                        /* fall through */
                    }
                }
                if (user.emsClient) {
                    try {
                        const email =
                            await user.emsClient.getEmailById(emailId);
                        return res.status(200).json({
                            email: {
                                ...email,
                                isAiProcessed,
                                body: email.body || "",
                                htmlBody: email.htmlBody || undefined,
                                source: "exchange",
                            },
                        } satisfies EmailViewResponse);
                    } catch {
                        /* fall through */
                    }
                }

                return res.status(404).json({ error: "Email not found" });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to fetch email:", message);
                return res.status(500).json({ error: "Failed to fetch email" });
            }
        },
    );

    // ── 标记邮件已读 ──────────────────────────────────

    router.put(
        "/emails/:emailId/read",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const emailId = req.params.emailId;

                let marked = false;

                // IMAP
                if (user.imapClient) {
                    try {
                        await user.imapClient.markAsRead(emailId);
                        marked = true;
                    } catch (e: any) {
                        logger.error(`IMAP markAsRead failed: ${e.message}`);
                    }
                }

                // Exchange
                if (!marked && user.emsClient?.markSystem?.markEmailAsRead) {
                    try {
                        await user.emsClient.markSystem.markEmailAsRead(
                            emailId,
                            true,
                        );
                        marked = true;
                    } catch (e: any) {
                        logger.error(
                            `Exchange markAsRead failed: ${e.message}`,
                        );
                    }
                }

                if (!marked) {
                    return res
                        .status(404)
                        .json({ error: "Email not found or no email client" });
                }

                return res.json({ success: true });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to mark email as read:", message);
                return res
                    .status(500)
                    .json({ error: "Failed to mark email as read" });
            }
        },
    );

    // 获取当前用户资料 / 设置
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

    /**
     * 换头像
     * POST /api/me/avatar
     * - multipart/form-data 字段 avatar（图片文件，≤2MB）
     * - 或 JSON: { avatar: "https://..." | "/uploads/avatars/..." }
     * - 或 JSON: { avatar: null } 清空
     */
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
                let nextAvatar: string | null | undefined;

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

    /**
     * 更新个人签名
     * PUT|PATCH|POST /api/me/signature
     * Body: { signature: string | null }  最长 200 字；null/"" 清空
     */
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
                signature = body.signature.trim();
                if (signature.length > SIGNATURE_MAX_LENGTH) {
                    return res.status(400).json({
                        error: `signature 最长 ${SIGNATURE_MAX_LENGTH} 字`,
                    });
                }
                if (signature === "") signature = null;
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

    // ── 手动触发 AI 处理邮件 ───────────────────────────

    router.post(
        "/emails/:emailId/ai-process",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const emailId = req.params.emailId;

                // 获取邮件详情
                let email: any = null;
                if (user.imapClient) {
                    try {
                        email = await user.imapClient.getEmailById(emailId);
                    } catch {
                        /* try next */
                    }
                }
                if (!email && user.emsClient) {
                    try {
                        email = await user.emsClient.getEmailById(emailId);
                    } catch {
                        /* try next */
                    }
                }
                if (!email) {
                    // 尝试从日程/待办队列缓存中查找
                    const scheduleQueue =
                        await dbService.getScheduleQueueByUser(user.id);
                    const todoQueue =
                        await dbService.getTodoQueueByUser(user.id);
                    for (const item of [...scheduleQueue, ...todoQueue]) {
                        let parsed: any = null;
                        try {
                            parsed = JSON.parse(item.rawRequest);
                        } catch {
                            continue;
                        }
                        if (parsed?.email?.id === emailId) {
                            email = parsed.email;
                            break;
                        }
                    }
                }
                if (!email) {
                    return res.status(404).json({ error: "Email not found" });
                }

                // 手动触发允许重新处理：先删除旧记录
                await dbService.deleteAiProcessedEmail(user.id, emailId);

                // 运行 AI 处理管道
                const source = (req.body?.source as string) || "manual";
                const result = await processEmailWithLLM(user, email, source);

                // 获取刚创建的队列项详情（供前端即时审批）
                const queueItems: any[] = [];
                for (const qid of result.queueIds) {
                    const item = await dbService.getScheduleQueueById(qid);
                    if (item) queueItems.push(item);
                }
                const todoQueueItems: any[] = [];
                for (const qid of result.todoQueueIds) {
                    const item = await dbService.getTodoQueueById(qid);
                    if (item) todoQueueItems.push(item);
                }

                let message: string;
                if (result.validationFailed) {
                    message =
                        "AI 处理完成，但工具/时间校验失败，已记录错误日志";
                } else if (result.toolCallsTriggered) {
                    const parts: string[] = [];
                    if (result.queuedSchedules.length > 0) {
                        parts.push(`${result.queuedSchedules.length} 个日程`);
                    }
                    if (result.queuedTodos.length > 0) {
                        parts.push(`${result.queuedTodos.length} 个待办`);
                    }
                    message =
                        parts.length > 0
                            ? `AI 已处理，入队 ${parts.join(" / ")}`
                            : "AI 已处理，工具调用未成功入队";
                } else {
                    message = "AI 已处理，未触发日程/待办创建";
                }

                return res.status(200).json({
                    success: true,
                    queuedSchedules: result.queuedSchedules,
                    queueItems,
                    queuedTodos: result.queuedTodos,
                    todoQueueItems,
                    toolCallsTriggered: result.toolCallsTriggered,
                    validationFailed: result.validationFailed || false,
                    lastValidationError: result.lastValidationError,
                    message,
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("手动 AI 处理邮件失败:", message);
                return res
                    .status(500)
                    .json({ error: message || "AI 处理失败" });
            }
        },
    );

    // ── 日程分享 ──────────────────────────────────────

    // 创建分享链接
    router.post(
        "/share/create",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const { name, dateStart, dateEnd, taskIds, expiresInDays } =
                    req.body || {};

                if (dateStart || dateEnd || (taskIds && taskIds.length > 0)) {
                    // 有明确筛选条件，允许
                } else if (
                    !dateStart &&
                    !dateEnd &&
                    (!taskIds || taskIds.length === 0)
                ) {
                    // 三个条件都为空 = 分享全部日程，也允许
                } else {
                    return res.status(400).json({
                        error: "请选择分享的日程范围或指定日程",
                    });
                }

                const token = uuidv4().replace(/-/g, "").substring(0, 16);
                const id = uuidv4();
                const expiresAt =
                    expiresInDays && expiresInDays > 0
                        ? new Date(
                              Date.now() + expiresInDays * 86400000,
                          ).toISOString()
                        : null;

                await dbService.createSharedSchedule({
                    id,
                    userId: user.id,
                    token,
                    name: name || "日程分享",
                    dateStart: dateStart || null,
                    dateEnd: dateEnd || null,
                    taskIds: taskIds ? JSON.stringify(taskIds) : null,
                    expiresAt,
                });

                const shareUrl = `${frontendUrl}/share/${token}`;
                return res.status(200).json({
                    token,
                    shareUrl,
                    expiresAt,
                });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to create share:", message);
                return res.status(500).json({ error: "创建分享失败" });
            }
        },
    );

    // 获取用户的分享列表
    router.get("/share/list", authenticateToken, async (req: any, res: any) => {
        try {
            const user = req.user as User;
            const shares = await dbService.getSharedSchedulesByUser(user.id);
            return res.status(200).json({
                shares: shares.map((s: any) => ({
                    id: s.id,
                    token: s.token,
                    name: s.name,
                    dateStart: s.dateStart,
                    dateEnd: s.dateEnd,
                    taskIds: s.taskIds ? JSON.parse(s.taskIds) : null,
                    expiresAt: s.expiresAt,
                    createdAt: s.createdAt,
                    shareUrl: `${frontendUrl}/share/${s.token}`,
                })),
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error("Failed to list shares:", message);
            return res.status(500).json({ error: "获取分享列表失败" });
        }
    });

    // 删除分享链接
    router.delete(
        "/share/:token",
        authenticateToken,
        async (req: any, res: any) => {
            try {
                const user = req.user as User;
                const deleted = await dbService.deleteSharedSchedule(
                    req.params.token,
                    user.id,
                );
                if (!deleted) {
                    return res.status(404).json({ error: "分享链接不存在" });
                }
                return res.status(200).json({ message: "已删除" });
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : String(err);
                logger.error("Failed to delete share:", message);
                return res.status(500).json({ error: "删除分享失败" });
            }
        },
    );

    // 公开端点：查看分享的日程（无需登录）
    router.get("/share/view/:token", async (req: any, res: any) => {
        try {
            const share = await dbService.getSharedScheduleByToken(
                req.params.token,
            );
            if (!share) {
                return res
                    .status(404)
                    .json({ error: "分享链接不存在或已失效" });
            }
            if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
                return res.status(410).json({ error: "分享链接已过期" });
            }

            // 获取分享用户的日程
            let tasks: Task[];
            if (share.taskIds) {
                const ids: string[] = JSON.parse(share.taskIds);
                tasks = [];
                for (const tid of ids) {
                    const t = await dbService.getTaskById(tid);
                    if (t && t.userId === share.userId) {
                        tasks.push(t);
                    }
                }
            } else {
                tasks = await dbService.getTasksByUserId(share.userId);
                if (share.dateStart || share.dateEnd) {
                    tasks = tasks.filter((t) => {
                        if (!t.startTime) return false;
                        const st = new Date(t.startTime).getTime();
                        if (
                            share.dateStart &&
                            st < new Date(share.dateStart).getTime()
                        )
                            return false;
                        if (
                            share.dateEnd &&
                            st > new Date(share.dateEnd).getTime()
                        )
                            return false;
                        return true;
                    });
                }
            }

            // 返回脱敏数据
            return res.status(200).json({
                share: {
                    name: share.name,
                    createdAt: share.createdAt,
                },
                tasks: tasks.map((t) => ({
                    id: t.id,
                    name: t.name,
                    description: t.description,
                    startTime: t.startTime,
                    endTime: t.endTime,
                    location: t.location,
                    importance: t.importance,
                    completed: t.completed,
                })),
                user: {
                    name:
                        (await dbService.getUserById(share.userId))?.name ||
                        "未知用户",
                },
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error("Failed to view share:", message);
            return res.status(500).json({ error: "加载分享失败" });
        }
    });

    return router;
}
