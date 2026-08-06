import { logger } from "../Utils/logger.js";
import OpenAI from "openai";
import Configuration from "openai";
import { IEmail } from "./types";
import { getOpenAITools } from "./mcp";
import { MCPToolNames, type MCPToolNameTypes } from "../Services/mcpTypes.js";
import { toShanghaiISO } from "../Utils/time.js";
import {
    isScheduleType,
    resolveScheduleType,
    scheduleTypeValues,
} from "./types.js";
import { validateToolCallsTimeAlignment } from "./classifyScheduleOrTodo.js";

/** processEmail 返回结构 */
export interface ProcessEmailResult {
    tool_calls: any[];
    /** 工具/时间校验 3 轮重试后仍失败 */
    validationFailed?: boolean;
    lastValidationError?: string;
    lastToolCalls?: any[];
}

// 定义邮件处理请求和响应接口
export interface EmailProcessRequest {
    email: IEmail;
    task: string;
}

export interface EmailProcessResponse {
    type: string; // 'meeting', 'todo', 'info', 'other'
    summary: string;
    action?: string;
    details?: {
        date?: string;
        time?: string;
        duration?: number;
        location?: string;
        attendees?: string[];
        priority?: "high" | "medium" | "low";
        deadline?: string;
    };
}

/** 校验失败后最多再请求 LLM 的次数 */
const TOOL_TIME_VALIDATION_MAX_RETRIES = 3;

export class LLMApi {
    private openai: OpenAI;
    private model: string;
    private autoSchedulePromotions: boolean;

    constructor(
        apiKey: string,
        model: string = "deepseek-chat",
        autoSchedulePromotions: boolean = false,
    ) {
        this.openai = new OpenAI({
            baseURL: process.env.API_BASE_URL,
            apiKey: apiKey,
        });
        this.model = model;
        this.autoSchedulePromotions = autoSchedulePromotions;
        logger.success(`OpenAI API 客户端初始化成功，使用模型: ${model}`);
    }

    private buildEmailProcessingTools() {
        const mcpTools = getOpenAITools();
        return [
            ...mcpTools.filter((t) => {
                switch (t.function.name) {
                    case MCPToolNames.AddSchedule:
                    case MCPToolNames.AddTodo:
                        return true;
                    default:
                        return false;
                }
            }),
            {
                type: "function",
                function: {
                    name: "log_info",
                    description:
                        "Log information from email that is purely informational and does not require a schedule or todo.",
                    parameters: {
                        type: "object",
                        properties: {
                            summary: {
                                type: "string",
                                description: "Summary of the information",
                            },
                            importance: {
                                type: "string",
                                enum: ["high", "medium", "low"],
                                description: "Importance level",
                            },
                        },
                        required: ["summary"],
                    },
                },
            },
        ];
    }

    private buildEmailSystemPrompt(): string {
        const promotionHint = this.autoSchedulePromotions
            ? "- 推广、广告、营销类邮件也应当提取其中的时间信息，按下方规则选择 add_schedule 或 add_todo。"
            : "- 推广、广告、营销、竞赛报名等不需要用户个人行动的信息通知类邮件，请使用 'log_info'，不要创建日程或待办。";

        return `你是一个从邮件中提取「日程」与「待办」的专业邮件分析助手。现在是 ${toShanghaiISO()}。
请分析邮件内容，并调用适当的工具来处理。

【类型规则 — 必须严格遵守】
- 有开始时间(startTime)的事项（会议、预约、时段活动等）→ 调用 add_schedule。
  · 可有可无 endTime；不要在没有开始时间时伪造 startTime。
  · 必须提供 name；scheduleType 只能是: ${scheduleTypeValues.join(" | ")}。
  · 无重复规则时 scheduleType 为 single；有 recurrenceRule 时按其 freq 选择匹配的 scheduleType。
- 只有结束时间/截止日期、没有开始时间 → 调用 add_todo，把截止时间写入 dueDate（不要写 startTime）。
- 没有任何时间信息、但仍需用户行动的事项 → 调用 add_todo（可不填 dueDate）。
- 纯信息通知、无需行动 → 调用 log_info。
${promotionHint}
- 禁止：仅为使用 add_schedule 而把 due date 同时填成 startTime 与 endTime。
- 时间格式为 ISO 8601，中国上海时区。例如: 2023-03-15T10:00:00+08:00。

【四象限优先级 — 添加日程/待办时务必填写】
- importanceScore（重要程度）：浮点数 -1~1。越接近 1 越重要，越接近 -1 越不重要。
- urgencyScore（紧急程度）：浮点数 -1~1。越接近 1 越紧急（临近截止/需立即处理），越接近 -1 越不紧急。
- 同时可填 importance 枚举 high|normal|low 作为粗粒度提示；双轴分数应与内容一致。
- 示例：考试/ddl 临近 → importanceScore≈0.8, urgencyScore≈0.9；长期规划 → importanceScore≈0.6, urgencyScore≈-0.3；琐事 → 两者均为负。`;
    }

    /**
     * 处理邮件内容，通过 OpenAI API 分析邮件
     * 工具/时间不一致时最多重试 3 轮；仍失败则 validationFailed，不静默改类型
     */
    async processEmail(email: IEmail): Promise<ProcessEmailResult> {
        try {
            logger.exchange(`使用 LLM 处理邮件: ${email.subject}`);

            const prompt = this.generateEmailProcessingPrompt(email);
            const tools = this.buildEmailProcessingTools();
            const messages = [
                {
                    role: "system",
                    content: this.buildEmailSystemPrompt(),
                },
                {
                    role: "user",
                    content: prompt,
                },
            ];

            logger.data(
                `[LLM Request] Messages: ${JSON.stringify(messages, null, 2)}`,
            );

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: messages as any,
                tools: tools as any,
                tool_choice: "required",
                temperature: 0.3,
            });

            logger.data(`[LLM Response]: ${JSON.stringify(response, null, 2)}`);

            const message = response.choices[0].message;

            if (message.tool_calls && message.tool_calls.length > 0) {
                const toolCall = message.tool_calls[0] as any;
                logger.success(
                    `邮件处理成功，触发工具调用: ${toolCall.function.name}`,
                );
                let toolCalls = await this.ensureValidScheduleType(
                    email,
                    message.tool_calls as any[],
                );
                const aligned = await this.ensureValidToolTimeAlignment(
                    email,
                    toolCalls,
                );
                return aligned;
            }

            logger.warn(`OpenAI API 未触发任何工具调用，返回默认信息`);
            return {
                tool_calls: [
                    {
                        id: "default",
                        type: "function",
                        function: {
                            name: "log_info",
                            arguments: JSON.stringify({
                                summary: "无法识别邮件类型或不需要操作",
                                importance: "low",
                            }),
                        },
                    },
                ],
            };
        } catch (error: any) {
            logger.error(`OpenAI API 调用失败: ${error.message || "未知错误"}`);
            return {
                tool_calls: [
                    {
                        id: "error",
                        type: "function",
                        function: {
                            name: "log_info",
                            arguments: JSON.stringify({
                                summary: "邮件分析失败",
                                importance: "medium",
                            }),
                        },
                    },
                ],
            };
        }
    }

    private parseToolArgs(raw: any): any | null {
        if (!raw) return null;
        try {
            return typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch (e) {
            return null;
        }
    }

    private async ensureValidScheduleType(
        email: IEmail,
        toolCalls: any[],
    ): Promise<any[]> {
        const addScheduleIndex = toolCalls.findIndex(
            (tc) => tc?.function?.name === MCPToolNames.AddSchedule,
        );
        if (addScheduleIndex === -1) return toolCalls;

        const call = toolCalls[addScheduleIndex];
        const parsed = this.parseToolArgs(call?.function?.arguments);
        if (!parsed) return toolCalls;

        const scheduleType = parsed.scheduleType;
        const hasValid = isScheduleType(scheduleType);
        if (hasValid) return toolCalls;

        logger.warn(
            `LLM returned invalid or missing scheduleType, retrying once. value=${scheduleType}`,
        );

        const repaired = await this.retryScheduleType(email, parsed);
        const repairedCall = repaired?.tool_calls?.find(
            (tc: any) => tc?.function?.name === MCPToolNames.AddSchedule,
        );
        if (repairedCall) {
            const repairedArgs = this.parseToolArgs(
                repairedCall?.function?.arguments,
            );
            if (repairedArgs && isScheduleType(repairedArgs.scheduleType)) {
                toolCalls[addScheduleIndex] = repairedCall;
                return toolCalls;
            }
        }

        const fallbackType = this.getFallbackScheduleType(parsed);
        parsed.scheduleType = fallbackType;
        call.function.arguments = JSON.stringify(parsed);
        logger.warn(
            `ScheduleType auto-corrected to ${fallbackType} after retry failure.`,
        );
        return toolCalls;
    }

    private getFallbackScheduleType(args: any) {
        try {
            return resolveScheduleType({
                explicit: undefined,
                recurrence: args?.recurrenceRule,
                fallback: "single",
            }).scheduleType;
        } catch (e) {
            return "single";
        }
    }

    private async retryScheduleType(
        email: IEmail,
        previousArgs: any,
    ): Promise<any> {
        const tools = [
            ...getOpenAITools().filter(
                (t) => t.function?.name === MCPToolNames.AddSchedule,
            ),
        ];

        const messages = [
            {
                role: "system",
                content: `你是一个日程抽取助手。你必须调用 add_schedule。
- 只允许的 scheduleType 值: ${scheduleTypeValues.join(" | ")}。
- 仅修正 scheduleType，保持其它字段与提供的值一致。`,
            },
            {
                role: "user",
                content: `邮件内容如下，请仅修正 scheduleType：\n${this.generateEmailProcessingPrompt(email)}\n\n已提取的参数：${JSON.stringify(previousArgs)}`,
            },
        ];

        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: messages as any,
            tools: tools as any,
            tool_choice: "required",
            temperature: 0.2,
        });

        return response.choices[0].message;
    }

    /**
     * 校验 add_schedule / add_todo 与时间字段是否一致。
     * 失败则带错误反馈最多重试 3 轮；仍失败则 validationFailed，不静默改类型。
     */
    private async ensureValidToolTimeAlignment(
        email: IEmail,
        toolCalls: any[],
    ): Promise<ProcessEmailResult> {
        let current = toolCalls;
        let lastError = "";

        for (
            let attempt = 0;
            attempt <= TOOL_TIME_VALIDATION_MAX_RETRIES;
            attempt++
        ) {
            const check = validateToolCallsTimeAlignment(current);
            if (check.ok) {
                if (attempt > 0) {
                    logger.success(
                        `工具/时间校验在第 ${attempt} 次重试后通过: ${email.subject}`,
                    );
                }
                return { tool_calls: current };
            }

            lastError = check.message || "工具与时间字段不匹配";
            if (attempt === TOOL_TIME_VALIDATION_MAX_RETRIES) {
                break;
            }

            logger.warn(
                `工具/时间校验失败 (attempt ${attempt + 1}/${TOOL_TIME_VALIDATION_MAX_RETRIES}): ${lastError}`,
            );

            try {
                const repaired = await this.retryToolTimeAlignment(
                    email,
                    current,
                    lastError,
                );
                if (repaired?.tool_calls?.length) {
                    // 重试结果仍对 schedule 做 scheduleType 修复
                    current = await this.ensureValidScheduleType(
                        email,
                        repaired.tool_calls as any[],
                    );
                } else {
                    logger.warn("工具/时间校验重试未返回 tool_calls");
                }
            } catch (err: any) {
                logger.error(
                    `工具/时间校验重试调用失败: ${err?.message || err}`,
                );
            }
        }

        logger.error(
            `工具/时间校验 ${TOOL_TIME_VALIDATION_MAX_RETRIES} 轮重试后仍失败: subject=${email.subject} error=${lastError} lastToolCalls=${JSON.stringify(current)}`,
        );

        return {
            tool_calls: [],
            validationFailed: true,
            lastValidationError: lastError,
            lastToolCalls: current,
        };
    }

    private async retryToolTimeAlignment(
        email: IEmail,
        previousToolCalls: any[],
        validationError: string,
    ): Promise<any> {
        const tools = this.buildEmailProcessingTools();
        const prevSummary = (previousToolCalls || []).map((tc) => ({
            name: tc?.function?.name,
            arguments: this.parseToolArgs(tc?.function?.arguments),
        }));

        const messages = [
            {
                role: "system",
                content: `${this.buildEmailSystemPrompt()}

【修正任务】上一轮工具调用未通过时间校验，你必须重新调用正确工具。
- 有 startTime → 只能 add_schedule
- 无 startTime（仅有 dueDate/endTime 或都没有）→ 只能 add_todo
- 不要伪造 startTime；不要静默把类型改写后假装一致
- 纯通知用 log_info`,
            },
            {
                role: "user",
                content: `邮件：
${this.generateEmailProcessingPrompt(email)}

上一轮工具调用：
${JSON.stringify(prevSummary, null, 2)}

校验错误：
${validationError}

请根据规则重新调用正确的工具。`,
            },
        ];

        const response = await this.openai.chat.completions.create({
            model: this.model,
            messages: messages as any,
            tools: tools as any,
            tool_choice: "required",
            temperature: 0.2,
        });

        return response.choices[0].message;
    }

    /**
     * 生成邮件处理提示词
     */
    private generateEmailProcessingPrompt(email: IEmail): string {
        // 简单的HTML清理，确保LLM能更好地理解内容
        let emailContent = email.body || "";
        // 移除script/style/head块
        emailContent = emailContent.replace(
            /<(script|style|head)\b[\s\S]*?<\/\1>/gi,
            "",
        );
        // 移除标签
        emailContent = emailContent.replace(/<[^>]+>/g, " ");
        // 压缩空白
        emailContent = emailContent.replace(/\s+/g, " ").trim();

        const emailSubject = email.subject || "";
        const from = email.from?.name || email.from?.address || "未知发件人";

        return `发件人: ${from}
主题: ${emailSubject}
内容: ${emailContent}

请分析上述邮件并调用相应的工具。`;
    }

    async chatStream(
        messages: any[],
        tools: any[] | undefined,
        onData: (data: { content?: string; tool_calls?: any[] }) => void,
    ): Promise<void> {
        try {
            logger.data(
                `[LLM Stream Request] Messages: ${JSON.stringify(messages, null, 2)}`,
            );

            const stream = await this.openai.chat.completions.create({
                model: this.model,
                messages: messages,
                tools: tools,
                stream: true,
                temperature: 0.7,
            });

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta;
                if (delta) {
                    const data: any = {};
                    if (delta.content) data.content = delta.content;
                    if (delta.tool_calls) data.tool_calls = delta.tool_calls;

                    if (Object.keys(data).length > 0) {
                        onData(data);
                    }
                }
            }
        } catch (error: any) {
            logger.error(
                `OpenAI API 流式调用失败: ${error.message || "未知错误"}`,
            );
            throw error;
        }
    }

    /** 通用非流式聊天接口 */
    async chat(
        messages: any[],
        options?: { temperature?: number; tools?: any[] },
    ): Promise<string> {
        try {
            logger.data(
                `[LLM Request] Messages: ${JSON.stringify(messages, null, 2)}`,
            );

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: messages as any,
                tools: options?.tools as any,
                temperature: options?.temperature ?? 0.3,
            });

            const content = response.choices[0]?.message?.content || "";
            logger.data(`[LLM Response]: ${content}`);
            return content;
        } catch (error: any) {
            logger.error(`OpenAI API 调用失败: ${error.message || "未知错误"}`);
            throw error;
        }
    }
}
