// 通用邮箱邮件处理模块
// 提供 LLM 解析邮件 → 日程/待办入队的统一管道，供 IMAP/Exchange/任意邮箱客户端复用

import { LLMApi } from "./LLMApi";
import { dbService } from "./dbService";
import { logUserEvent } from "./userLog";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import type { User } from "../types/models";
import {
    toTodoCreateInput,
    validateToolTimeAlignment,
} from "./classifyScheduleOrTodo.js";
import { MCPToolNames } from "./mcpTypes.js";

/** 邮件数据的通用最小接口，IMAP/Exchange/其他客户端统一传入 */
export interface EmailForProcessing {
    id: string;
    subject: string;
    from?: { name: string; address: string };
    receivedAt: string;
    isRead: boolean;
    body?: string;
    hasAttachments?: boolean;
    attachmentsCount?: number;
}

export interface EmailProcessingResult {
    /** 成功入队的日程名称列表 */
    queuedSchedules: string[];
    /** 新创建的日程队列项 ID 列表（用于前端即时审批） */
    queueIds: string[];
    /** 成功入队的待办名称列表 */
    queuedTodos: string[];
    /** 新创建的待办队列项 ID 列表 */
    todoQueueIds: string[];
    /** 是否触发了 LLM 工具调用（且通过校验） */
    toolCallsTriggered: boolean;
    /** 工具/时间校验 3 轮后仍失败 */
    validationFailed?: boolean;
    lastValidationError?: string;
}

function buildEmailPayload(email: EmailForProcessing, source: string) {
    return {
        id: email.id,
        subject: email.subject,
        from: email.from,
        receivedAt: email.receivedAt,
        isRead: email.isRead,
        body: email.body || "",
        hasAttachments: !!email.hasAttachments,
        attachmentsCount: email.attachmentsCount ?? 0,
    };
}

/**
 * 将已通过校验的工具调用写入对应队列（严格按工具名，不静默迁移）
 */
export async function enqueueValidatedToolCalls(
    user: User,
    email: EmailForProcessing,
    source: string,
    toolCalls: any[],
): Promise<{
    queuedSchedules: string[];
    queueIds: string[];
    queuedTodos: string[];
    todoQueueIds: string[];
}> {
    const queuedSchedules: string[] = [];
    const queueIds: string[] = [];
    const queuedTodos: string[] = [];
    const todoQueueIds: string[] = [];
    const safeEmail = buildEmailPayload(email, source);

    for (const toolCall of toolCalls) {
        const funcName = (toolCall as any)?.function?.name;
        const funcArgs = (toolCall as any)?.function?.arguments;
        if (
            funcName !== MCPToolNames.AddSchedule &&
            funcName !== MCPToolNames.AddTodo
        ) {
            continue;
        }
        if (!funcArgs) continue;

        let toolArgs: any;
        try {
            toolArgs =
                typeof funcArgs === "string" ? JSON.parse(funcArgs) : funcArgs;
        } catch {
            toolArgs = {};
        }

        // 入队前再校验一次（双保险）；失败则记日志并跳过，不静默迁移
        const check = validateToolTimeAlignment(funcName, toolArgs);
        if (!check.ok) {
            logger.error(
                `入队前二次校验失败，跳过: tool=${funcName} subject=${email.subject} msg=${check.message}`,
            );
            await logUserEvent(
                user.id,
                "ai_email_tool_validation_failed",
                `入队前校验失败: ${email.subject}`,
                {
                    emailId: email.id,
                    emailSubject: email.subject,
                    source,
                    toolName: funcName,
                    message: check.message,
                    args: toolArgs,
                },
            );
            continue;
        }

        if (funcName === MCPToolNames.AddSchedule) {
            if (!toolArgs.name) toolArgs.name = email.subject || "未命名任务";
            const payload = {
                args: {
                    ...toolArgs,
                    description:
                        toolArgs.description ||
                        `来自邮件: ${email.subject}`,
                },
                email: safeEmail,
                _meta: {
                    source,
                    createdAt: toShanghaiISO(),
                },
            };
            const queueId = await dbService.addScheduleToQueue(
                user.id,
                JSON.stringify(payload),
            );
            queuedSchedules.push(toolArgs.name);
            queueIds.push(queueId);
            await logUserEvent(
                user.id,
                "external_schedule_request",
                `外部请求创建日程: ${toolArgs.name}`,
                {
                    queueId,
                    emailId: email.id,
                    emailSubject: email.subject,
                    name: toolArgs.name,
                    startTime: toolArgs.startTime,
                    endTime: toolArgs.endTime,
                    llmResponse: toolCall,
                },
            );
        } else if (funcName === MCPToolNames.AddTodo) {
            const todoInput = toTodoCreateInput(toolArgs);
            if (!todoInput.name || todoInput.name === "未命名待办") {
                todoInput.name = email.subject || "未命名待办";
            }
            if (!todoInput.description) {
                todoInput.description = `来自邮件: ${email.subject}`;
            }
            const payload = {
                args: todoInput,
                email: safeEmail,
                _meta: {
                    source,
                    createdAt: toShanghaiISO(),
                },
            };
            const queueId = await dbService.addTodoToQueue(
                user.id,
                JSON.stringify(payload),
            );
            queuedTodos.push(todoInput.name);
            todoQueueIds.push(queueId);
            await logUserEvent(
                user.id,
                "external_todo_request",
                `外部请求创建待办: ${todoInput.name}`,
                {
                    queueId,
                    emailId: email.id,
                    emailSubject: email.subject,
                    name: todoInput.name,
                    dueDate: todoInput.dueDate,
                    llmResponse: toolCall,
                },
            );
        }
    }

    return { queuedSchedules, queueIds, queuedTodos, todoQueueIds };
}

/**
 * 通用邮件处理管道：
 * 1. 调用 LLM 解析邮件
 * 2. 工具/时间校验（失败重试由 LLMApi 完成，最多 3 轮）
 * 3. 按工具名分别入日程/待办队列
 */
export async function processEmailWithLLM(
    user: User,
    email: EmailForProcessing,
    source: "imap" | "exchange" | string,
): Promise<EmailProcessingResult> {
    const result: EmailProcessingResult = {
        queuedSchedules: [],
        queueIds: [],
        queuedTodos: [],
        todoQueueIds: [],
        toolCallsTriggered: false,
    };

    // 防止重复 AI 处理（兜底保护）
    if (email.id) {
        const alreadyProcessed = await dbService.isEmailAiProcessed(
            user.id,
            String(email.id),
            source,
        );
        if (alreadyProcessed) {
            logger.info(
                `邮件 ${email.id} (${email.subject}) 已 AI 处理过（${source}），跳过`,
            );
            return result;
        }
    }

    const llmApi = new LLMApi(
        process.env.OPENAI_API_KEY || "",
        process.env.OPENAI_MODEL || "deepseek-chat",
        user.autoSchedulePromotions ?? false,
    );

    try {
        const llmResponse = await llmApi.processEmail(email as any);

        if (llmResponse?.validationFailed) {
            result.validationFailed = true;
            result.lastValidationError = llmResponse.lastValidationError;
            const summary = `AI 处理邮件 "${email.subject}" 工具/时间校验失败（已重试）: ${llmResponse.lastValidationError || ""}`;
            logger.error(summary);
            await logUserEvent(
                user.id,
                "ai_email_tool_validation_failed",
                summary,
                {
                    emailId: email.id,
                    emailSubject: email.subject,
                    emailFrom: email.from,
                    emailReceivedAt: email.receivedAt,
                    source,
                    lastValidationError: llmResponse.lastValidationError,
                    lastToolCalls: llmResponse.lastToolCalls,
                    llmResponse,
                },
            );
            // 校验失败也标记已处理，避免无限重试同一封邮件；手动 ai-process 可清标记重跑
            if (email.id) {
                try {
                    await dbService.markEmailAiProcessed(
                        user.id,
                        String(email.id),
                        source,
                    );
                } catch (err: any) {
                    logger.error(
                        `标记 AI 已处理失败: ${err.message || "未知错误"}`,
                    );
                }
            }
            return result;
        }

        const hasToolCalls = !!llmResponse?.tool_calls?.length;
        const actionable = (llmResponse?.tool_calls || []).filter(
            (tc: any) =>
                tc?.function?.name === MCPToolNames.AddSchedule ||
                tc?.function?.name === MCPToolNames.AddTodo,
        );
        const summary =
            actionable.length > 0
                ? `AI 处理邮件 "${email.subject}"，触发 ${actionable.length} 个可入队工具调用`
                : `AI 处理邮件 "${email.subject}"，未触发日程/待办创建`;

        await logUserEvent(user.id, "ai_email_processed", summary, {
            emailId: email.id,
            emailSubject: email.subject,
            emailFrom: email.from,
            emailReceivedAt: email.receivedAt,
            source,
            toolCallCount: llmResponse?.tool_calls?.length || 0,
            llmResponse: llmResponse,
        });

        if (!hasToolCalls || actionable.length === 0) {
            logger.info(`LLM 未触发可入队工具调用: ${email.subject}`);
            if (email.id) {
                try {
                    await dbService.markEmailAiProcessed(
                        user.id,
                        String(email.id),
                        source,
                    );
                } catch (err: any) {
                    logger.error(
                        `标记 AI 已处理失败: ${err.message || "未知错误"}`,
                    );
                }
            }
            return result;
        }

        result.toolCallsTriggered = true;

        const enqueued = await enqueueValidatedToolCalls(
            user,
            email,
            source,
            llmResponse.tool_calls,
        );
        result.queuedSchedules = enqueued.queuedSchedules;
        result.queueIds = enqueued.queueIds;
        result.queuedTodos = enqueued.queuedTodos;
        result.todoQueueIds = enqueued.todoQueueIds;

        logger.success(
            `邮件处理完成: ${email.subject}, 入队日程 ${result.queuedSchedules.length} / 待办 ${result.queuedTodos.length}`,
        );

        if (email.id) {
            try {
                await dbService.markEmailAiProcessed(
                    user.id,
                    String(email.id),
                    source,
                );
            } catch (err: any) {
                logger.error(
                    `标记 AI 已处理失败: ${err.message || "未知错误"}`,
                );
            }
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`邮件 LLM 处理失败: ${message}`);

        await logUserEvent(
            user.id,
            "ai_email_failed",
            `AI 处理邮件失败: ${email.subject}`,
            {
                emailId: email.id,
                emailSubject: email.subject,
                emailFrom: email.from,
                source,
                error: message,
            },
        );

        throw err;
    }

    return result;
}
