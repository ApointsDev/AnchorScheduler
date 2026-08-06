import express from "express";
import multer from "multer";
import path from "path";
import { DoubaoMultimodalApi } from "../Services/DoubaoMultimodalApi";
import { logger } from "../Utils/logger";

// 使用内存存储，文件转为 Buffer 后传递给 API
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB 限制
    },
    fileFilter: (_req, file, cb) => {
        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/bmp",
        ];
        const allowedAudioTypes = [
            "audio/wav",
            "audio/wave",
            "audio/mpeg",
            "audio/mp3",
            "audio/ogg",
            "audio/opus",
            "audio/flac",
            "audio/aac",
            "audio/mp4",
            "audio/x-m4a",
            "audio/webm",
        ];
        const allowed = [...allowedImageTypes, ...allowedAudioTypes];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    `不支持的文件类型: ${file.mimetype}。支持的格式: JPEG, PNG, GIF, WebP, BMP, WAV, MP3, OGG, FLAC, AAC, M4A, WebM`,
                ),
            );
        }
    },
});

/**
 * 初始化豆包多模态路由
 * @param authenticateToken 身份验证中间件
 */
export function initializeDoubaoRoutes(authenticateToken: any) {
    const router = express.Router();

    // 初始化豆包API服务
    const doubaoApi = new DoubaoMultimodalApi(
        process.env.ARK_API_KEY || process.env.OPENAI_API_KEY || "",
        process.env.DOUBAO_MODEL || "doubao-seed-2-0-pro-260215",
    );

    /**
     * POST /api/doubao/chat
     * 多模态对话接口：接受图片/音频文件 + 文字，返回模型响应
     *
     * Body (multipart/form-data):
     *   - file: 图片或音频文件
     *   - prompt: 用户文字提示
     *   - systemPrompt: 系统提示词（可选）
     *   - stream: 是否流式返回（可选，默认 false）
     */
    router.post(
        "/chat",
        authenticateToken,
        upload.single("file"),
        async (req: any, res: any) => {
            try {
                const file = req.file;
                const { prompt, systemPrompt, stream: wantStream } = req.body;

                if (!file) {
                    return res
                        .status(400)
                        .json({ error: "请上传图片或音频文件" });
                }

                if (!prompt || typeof prompt !== "string") {
                    return res
                        .status(400)
                        .json({ error: "请提供 prompt 文字提示" });
                }

                const isImage = file.mimetype.startsWith("image/");
                const isAudio = file.mimetype.startsWith("audio/");

                if (!isImage && !isAudio) {
                    return res.status(400).json({
                        error: "不支持的文件类型，请上传图片或音频文件",
                    });
                }

                const base64 = file.buffer.toString("base64");
                const ext = path.extname(file.originalname).replace(".", "");

                if (wantStream === "true" || wantStream === true) {
                    // SSE 流式响应
                    res.setHeader("Content-Type", "text/event-stream");
                    res.setHeader("Cache-Control", "no-cache");
                    res.setHeader("Connection", "keep-alive");
                    res.setHeader("X-Accel-Buffering", "no");

                    const sendSSE = (data: string) => {
                        res.write(
                            `data: ${JSON.stringify({ content: data })}\n\n`,
                        );
                    };

                    try {
                        if (isImage) {
                            await doubaoApi.chatWithImageStream(
                                base64,
                                file.mimetype,
                                prompt,
                                systemPrompt || undefined,
                                sendSSE,
                            );
                        } else if (isAudio) {
                            // 音频目前不支持流式，先收集完再发送
                            const result = await doubaoApi.chatWithAudio(
                                base64,
                                ext,
                                prompt,
                                systemPrompt || undefined,
                            );
                            sendSSE(result);
                        }

                        res.write("data: [DONE]\n\n");
                        res.end();
                    } catch (streamError: any) {
                        logger.error(
                            `[Doubao Route] 流式调用失败: ${streamError.message}`,
                        );
                        if (!res.headersSent) {
                            res.status(500).json({
                                error: streamError.message || "流式调用失败",
                            });
                        } else {
                            res.write(
                                `data: ${JSON.stringify({ error: streamError.message })}\n\n`,
                            );
                            res.end();
                        }
                    }
                } else {
                    // 非流式响应
                    let result: string;

                    if (isImage) {
                        result = await doubaoApi.chatWithImage(
                            base64,
                            file.mimetype,
                            prompt,
                            systemPrompt || undefined,
                        );
                    } else {
                        // isAudio
                        result = await doubaoApi.chatWithAudio(
                            base64,
                            ext,
                            prompt,
                            systemPrompt || undefined,
                        );
                    }

                    res.json({
                        success: true,
                        content: result,
                        fileType: isImage ? "image" : "audio",
                    });
                }
            } catch (error: any) {
                logger.error(
                    `[Doubao Route] 处理失败: ${error.message || error}`,
                );
                if (!res.headersSent) {
                    res.status(500).json({
                        error: error.message || "多模态处理失败",
                    });
                }
            }
        },
    );

    /**
     * POST /api/doubao/chat/text
     * 纯文本对话（使用豆包模型）
     *
     * Body (JSON):
     *   - prompt: 用户文字
     *   - systemPrompt: 系统提示词（可选）
     *   - temperature: 温度参数（可选，默认 0.7）
     *   - stream: 是否流式返回（可选，默认 false）
     */
    router.post("/chat/text", authenticateToken, async (req: any, res: any) => {
        try {
            const {
                prompt,
                systemPrompt,
                temperature = 0.7,
                stream: wantStream,
            } = req.body;

            if (!prompt || typeof prompt !== "string") {
                return res.status(400).json({ error: "请提供 prompt 文字" });
            }

            if (wantStream) {
                // SSE 流式响应
                res.setHeader("Content-Type", "text/event-stream");
                res.setHeader("Cache-Control", "no-cache");
                res.setHeader("Connection", "keep-alive");
                res.setHeader("X-Accel-Buffering", "no");

                try {
                    await doubaoApi.chatStream(
                        prompt,
                        systemPrompt,
                        temperature,
                        (text: string) => {
                            res.write(
                                `data: ${JSON.stringify({ content: text })}\n\n`,
                            );
                        },
                    );
                    res.write("data: [DONE]\n\n");
                    res.end();
                } catch (streamError: any) {
                    if (!res.headersSent) {
                        res.status(500).json({
                            error: streamError.message || "流式调用失败",
                        });
                    } else {
                        res.write(
                            `data: ${JSON.stringify({ error: streamError.message })}\n\n`,
                        );
                        res.end();
                    }
                }
            } else {
                const result = await doubaoApi.chat(
                    prompt,
                    systemPrompt,
                    temperature,
                );
                res.json({ success: true, content: result });
            }
        } catch (error: any) {
            logger.error(
                `[Doubao Text Route] 处理失败: ${error.message || error}`,
            );
            if (!res.headersSent) {
                res.status(500).json({
                    error: error.message || "对话失败",
                });
            }
        }
    });

    /**
     * GET /api/doubao/status
     * 检查豆包API连接状态
     */
    router.get("/status", authenticateToken, async (_req: any, res: any) => {
        try {
            // 简单测试调用
            const result = await doubaoApi.chat(
                "你好，请回复'OK'表示你正常工作。",
                undefined,
                0.1,
            );
            res.json({
                connected: true,
                model: process.env.DOUBAO_MODEL || "doubao-seed-2-0-pro-260215",
                testResponse: result.substring(0, 100),
            });
        } catch (error: any) {
            res.json({
                connected: false,
                error: error.message || "连接失败",
            });
        }
    });

    // Multer 错误处理中间件
    router.use((err: any, _req: any, res: any, next: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .json({ error: "文件大小超过限制（最大20MB）" });
            }
            return res
                .status(400)
                .json({ error: `文件上传错误: ${err.message}` });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });

    return router;
}
