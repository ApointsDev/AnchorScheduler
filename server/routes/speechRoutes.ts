import express from "express";
import multer from "multer";
import {
    prepareAudioBuffer,
    xfyunIatApi,
    type AudioEncoding,
} from "../Services/XfyunIatApi";
import { logger } from "../Utils/logger";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        // 60s PCM 约 2MB，留余量
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            "audio/wav",
            "audio/wave",
            "audio/x-wav",
            "audio/mpeg",
            "audio/mp3",
            "audio/pcm",
            "application/octet-stream",
        ];
        const name = (file.originalname || "").toLowerCase();
        const okExt =
            name.endsWith(".wav") ||
            name.endsWith(".mp3") ||
            name.endsWith(".pcm") ||
            name.endsWith(".raw");
        if (allowed.includes(file.mimetype) || okExt) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    `不支持的音频类型: ${file.mimetype}。请上传 WAV/PCM 或 MP3（≤60s，16k/16bit/单声道优先）`,
                ),
            );
        }
    },
});

/**
 * 语音识别路由 — 讯飞大模型多语种语音识别
 * 文档: https://www.xfyun.cn/doc/spark/spark_mul_cn_iat.html
 */
export function initializeSpeechRoutes(authenticateToken: any) {
    const router = express.Router();

    /**
     * GET /api/speech/status
     * 检查服务是否已配置
     */
    router.get("/status", authenticateToken, (_req: any, res: any) => {
        const mode = xfyunIatApi.getMode();
        res.json({
            configured: xfyunIatApi.isConfigured(),
            provider:
                mode === "spark"
                    ? "xfyun-spark-mul-cn-iat"
                    : "xfyun-voicedictation-iat",
            mode,
            host:
                mode === "spark"
                    ? process.env.XFYUN_IAT_HOST ||
                      "iat.cn-huabei-1.xf-yun.com"
                    : process.env.XFYUN_CLASSIC_IAT_HOST || "iat-api.xfyun.cn",
            supportedFormats: ["wav/pcm (raw)", "mp3 (lame)"],
            maxDurationSec: 60,
            sampleRates: [8000, 16000],
        });
    });

    /**
     * POST /api/speech/recognize
     * 上传音频文件进行识别
     *
     * multipart/form-data:
     *   - file / audio: 音频文件（wav/pcm/mp3）
     *   - language: 可选，如 zh、en、zh|en
     *   - encoding: 可选，raw | lame（一般可自动推断）
     *   - sampleRate: 可选，16000 | 8000
     *   - eos: 可选，静音结束毫秒
     *
     * 或 JSON:
     *   - audio: base64 音频
     *   - mimeType / filename / encoding / sampleRate / language / eos
     */
    router.post(
        "/recognize",
        authenticateToken,
        (req: any, res: any, next: any) => {
            const contentType = (req.headers["content-type"] || "").toString();
            if (contentType.includes("multipart/form-data")) {
                return upload.fields([
                    { name: "file", maxCount: 1 },
                    { name: "audio", maxCount: 1 },
                ])(req, res, next);
            }
            next();
        },
        async (req: any, res: any) => {
            try {
                if (!xfyunIatApi.isConfigured()) {
                    return res.status(503).json({
                        error: "语音识别服务未配置",
                        hint: "请设置环境变量 XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET",
                    });
                }

                let buffer: Buffer | undefined;
                let mimeType: string | undefined;
                let filename: string | undefined;
                let encoding: AudioEncoding | undefined;
                let sampleRate: 8000 | 16000 = 16000;
                let language: string | undefined;
                let eos: number | undefined;

                const uploaded =
                    req.files?.file?.[0] ||
                    req.files?.audio?.[0] ||
                    req.file;

                if (uploaded) {
                    buffer = uploaded.buffer;
                    mimeType = uploaded.mimetype;
                    filename = uploaded.originalname;
                    language = req.body?.language;
                    eos = req.body?.eos ? Number(req.body.eos) : undefined;
                    if (req.body?.encoding === "raw" || req.body?.encoding === "lame") {
                        encoding = req.body.encoding;
                    }
                    if (req.body?.sampleRate) {
                        const sr = Number(req.body.sampleRate);
                        if (sr === 8000 || sr === 16000) sampleRate = sr;
                    }
                } else if (req.body?.audio && typeof req.body.audio === "string") {
                    const b64 = String(req.body.audio).replace(
                        /^data:audio\/[\w+-]+;base64,/,
                        "",
                    );
                    buffer = Buffer.from(b64, "base64");
                    mimeType = req.body.mimeType;
                    filename = req.body.filename;
                    language = req.body.language;
                    eos = req.body.eos != null ? Number(req.body.eos) : undefined;
                    if (req.body.encoding === "raw" || req.body.encoding === "lame") {
                        encoding = req.body.encoding;
                    }
                    if (req.body.sampleRate === 8000 || req.body.sampleRate === 16000) {
                        sampleRate = req.body.sampleRate;
                    }
                }

                if (!buffer || buffer.length === 0) {
                    return res.status(400).json({
                        error: "请上传音频文件（字段 file/audio）或提供 base64 字段 audio",
                    });
                }

                const prepared = prepareAudioBuffer(buffer, mimeType, filename);
                const finalEncoding = encoding || prepared.encoding;

                logger.data(
                    `[Speech] 识别请求 user=${req.user?.id || "?"} size=${prepared.audio.length} encoding=${finalEncoding} lang=${language || "auto"}`,
                );

                const result = await xfyunIatApi.recognize({
                    audio: prepared.audio,
                    encoding: finalEncoding,
                    sampleRate,
                    language,
                    eos,
                });

                res.json({
                    success: true,
                    text: result.text,
                    sid: result.sid,
                    segments: result.segments,
                    encoding: finalEncoding,
                    sampleRate,
                    mode: result.mode,
                });
            } catch (error: any) {
                logger.error(`[Speech] 识别失败: ${error?.message || error}`);
                if (!res.headersSent) {
                    res.status(500).json({
                        error: error?.message || "语音识别失败",
                    });
                }
            }
        },
    );

    // Multer 错误处理
    router.use((err: any, _req: any, res: any, next: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res
                    .status(400)
                    .json({ error: "音频文件过大（最大 5MB，时长 ≤60s）" });
            }
            return res.status(400).json({ error: `上传错误: ${err.message}` });
        }
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });

    return router;
}
