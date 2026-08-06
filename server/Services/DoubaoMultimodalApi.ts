import OpenAI from "openai";
import { logger } from "../Utils/logger.js";

/**
 * 豆包多模态模型API服务
 * 使用火山引擎 Ark 平台的 OpenAI 兼容接口
 * 支持图片和音频输入的多模态对话
 */
export class DoubaoMultimodalApi {
    private client: OpenAI;
    private model: string;
    private baseURL: string;
    private apiKey: string;

    constructor(
        apiKey: string,
        model: string = "doubao-seed-2-0-pro-260215",
        baseURL: string = "https://ark.cn-beijing.volces.com/api/v3",
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.baseURL = baseURL;
        this.client = new OpenAI({
            baseURL: baseURL,
            apiKey: apiKey,
        });
        logger.success(`豆包多模态API初始化成功，模型: ${model}`);
    }

    /**
     * 图片 + 文字多模态对话（使用 Chat Completions Vision API）
     * @param imageBase64 图片的 base64 编码
     * @param mimeType 图片 MIME 类型，如 image/jpeg, image/png
     * @param prompt 用户的文字提示
     * @param systemPrompt 系统提示词（可选）
     * @returns API 响应文本
     */
    async chatWithImage(
        imageBase64: string,
        mimeType: string,
        prompt: string,
        systemPrompt?: string,
    ): Promise<string> {
        try {
            const dataUri = `data:${mimeType};base64,${imageBase64}`;

            const messages: any[] = [];

            if (systemPrompt) {
                messages.push({
                    role: "system",
                    content: systemPrompt,
                });
            }

            messages.push({
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: dataUri,
                            detail: "auto",
                        },
                    },
                    {
                        type: "text",
                        text: prompt,
                    },
                ],
            });

            logger.data(
                `[Doubao Image Chat] Prompt: ${prompt.substring(0, 200)}`,
            );

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages as any,
                temperature: 0.7,
                max_tokens: 4096,
            });

            const content = response.choices[0]?.message?.content || "";
            logger.success(`[Doubao Image Chat] 响应长度: ${content.length}`);
            return content;
        } catch (error: any) {
            logger.error(
                `[Doubao Image Chat] 调用失败: ${error.message || error}`,
            );
            throw error;
        }
    }

    /**
     * 图片 + 文字多模态流式对话
     * @param imageBase64 图片 base64
     * @param mimeType 图片 MIME 类型
     * @param prompt 用户提示
     * @param systemPrompt 系统提示
     * @param onChunk 每个文本块的回调
     */
    async chatWithImageStream(
        imageBase64: string,
        mimeType: string,
        prompt: string,
        systemPrompt: string | undefined,
        onChunk: (text: string) => void,
    ): Promise<void> {
        try {
            const dataUri = `data:${mimeType};base64,${imageBase64}`;

            const messages: any[] = [];

            if (systemPrompt) {
                messages.push({
                    role: "system",
                    content: systemPrompt,
                });
            }

            messages.push({
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: { url: dataUri, detail: "auto" },
                    },
                    { type: "text", text: prompt },
                ],
            });

            logger.data(
                `[Doubao Image Stream] Prompt: ${prompt.substring(0, 200)}`,
            );

            const stream = await this.client.chat.completions.create({
                model: this.model,
                messages: messages as any,
                temperature: 0.7,
                max_tokens: 4096,
                stream: true,
            });

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta?.content;
                if (delta) {
                    onChunk(delta);
                }
            }

            logger.success("[Doubao Image Stream] 流式响应完成");
        } catch (error: any) {
            logger.error(
                `[Doubao Image Stream] 调用失败: ${error.message || error}`,
            );
            throw error;
        }
    }

    /**
     * 音频 + 文字多模态对话（使用 Responses API）
     * 音频将被发送到豆包模型进行理解
     * @param audioBase64 音频 base64 编码
     * @param audioFormat 音频格式，如 wav, mp3, ogg
     * @param prompt 用户的文字提示
     * @param systemPrompt 系统提示词（可选）
     * @returns API 响应文本
     */
    async chatWithAudio(
        audioBase64: string,
        audioFormat: string,
        prompt: string,
        systemPrompt?: string,
    ): Promise<string> {
        try {
            const mimeType = this.getAudioMimeType(audioFormat);
            const dataUri = `data:${mimeType};base64,${audioBase64}`;

            const input: any[] = [];

            if (systemPrompt) {
                input.push({
                    role: "system",
                    content: systemPrompt,
                });
            }

            input.push({
                role: "user",
                content: [
                    {
                        type: "input_audio",
                        input_audio: {
                            data: dataUri,
                            format: audioFormat,
                        },
                    },
                    {
                        type: "input_text",
                        text: prompt,
                    },
                ],
            });

            logger.data(
                `[Doubao Audio Chat] Prompt: ${prompt.substring(0, 200)}, format: ${audioFormat}`,
            );

            // 使用 Responses API (原生 fetch)
            const response = await fetch(`${this.baseURL}/responses`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    input: input,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(
                    `Responses API error ${response.status}: ${errText}`,
                );
            }

            const result: any = await response.json();
            const content =
                result?.output?.[0]?.content?.[0]?.text ||
                result?.choices?.[0]?.message?.content ||
                "";

            logger.success(`[Doubao Audio Chat] 响应长度: ${content.length}`);
            return content;
        } catch (error: any) {
            logger.error(
                `[Doubao Audio Chat] 调用失败: ${error.message || error}`,
            );
            throw error;
        }
    }

    /**
     * 纯文本对话
     */
    async chat(
        prompt: string,
        systemPrompt?: string,
        temperature: number = 0.7,
    ): Promise<string> {
        try {
            const messages: any[] = [];
            if (systemPrompt) {
                messages.push({ role: "system", content: systemPrompt });
            }
            messages.push({ role: "user", content: prompt });

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: messages as any,
                temperature,
                max_tokens: 4096,
            });

            return response.choices[0]?.message?.content || "";
        } catch (error: any) {
            logger.error(
                `[Doubao Chat] 调用失败: ${error.message || error}`,
            );
            throw error;
        }
    }

    /**
     * 纯文本流式对话
     */
    async chatStream(
        prompt: string,
        systemPrompt: string | undefined,
        temperature: number,
        onChunk: (text: string) => void,
    ): Promise<void> {
        try {
            const messages: any[] = [];
            if (systemPrompt) {
                messages.push({ role: "system", content: systemPrompt });
            }
            messages.push({ role: "user", content: prompt });

            const stream = await this.client.chat.completions.create({
                model: this.model,
                messages: messages as any,
                temperature,
                max_tokens: 4096,
                stream: true,
            });

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta?.content;
                if (delta) {
                    onChunk(delta);
                }
            }
        } catch (error: any) {
            logger.error(
                `[Doubao Stream] 调用失败: ${error.message || error}`,
            );
            throw error;
        }
    }

    /**
     * 根据文件扩展名获取音频 MIME 类型
     */
    private getAudioMimeType(format: string): string {
        const mimeMap: Record<string, string> = {
            wav: "audio/wav",
            wave: "audio/wav",
            mp3: "audio/mpeg",
            mpeg: "audio/mpeg",
            ogg: "audio/ogg",
            opus: "audio/opus",
            flac: "audio/flac",
            aac: "audio/aac",
            m4a: "audio/mp4",
            wma: "audio/x-ms-wma",
            webm: "audio/webm",
        };
        return mimeMap[format.toLowerCase()] || `audio/${format}`;
    }
}
