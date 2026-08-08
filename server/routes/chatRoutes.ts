// AI 聊天与四象限分类路由
// 挂载于 /api → 路径为 /api/llm/chat、/api/tasks/classify-quadrants、/api/chat/*
import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import { LLMApi } from "../Services/LLMApi.js";
import {
    quadrantFromAxes,
    resolvePriorityAxes,
} from "../Services/priorityAxes.js";
import type { AuthMiddleware } from "./apiTypes.js";
import type { User } from "../index";

export function registerChatRoutes(
    router: express.Router,
    authenticateToken: AuthMiddleware,
    llmApi: LLMApi,
) {
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
                // 上游返回的 400 类「非法消息」错误：透出真实错误信息，便于客户端区分
                if (error?.status === 400) {
                    return res.status(400).json({
                        error:
                            error?.error?.message ||
                            error?.message ||
                            "Invalid chat request messages",
                    });
                }
                return res
                    .status(500)
                    .json({ error: "Failed to process chat request" });
            }
            res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
            res.end();
        }
    });
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
}
