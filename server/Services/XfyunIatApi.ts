import crypto from "crypto";
import WebSocket from "ws";
import { logger } from "../Utils/logger.js";

/**
 * 讯飞语音识别
 *
 * 模式（环境变量 XFYUN_IAT_MODE）：
 * - classic（默认）：语音听写流式版 wss://iat-api.xfyun.cn/v2/iat
 *   文档：https://www.xfyun.cn/doc/asr/voicedictation/API.html
 * - spark：大模型多语种 wss://iat.cn-huabei-1.xf-yun.com/v1
 *   文档：https://www.xfyun.cn/doc/spark/spark_mul_cn_iat.html
 *
 * 注意：需在控制台为同一 APPID 开通对应产品；未开通会返回 11200/11201 licc failed。
 */

const FRAME_SIZE = 1280;
const FRAME_INTERVAL_MS = 40;

export type AudioEncoding = "raw" | "lame";
export type IatMode = "classic" | "spark";

export interface RecognizeOptions {
    audio: Buffer;
    encoding?: AudioEncoding;
    sampleRate?: 8000 | 16000;
    /**
     * 语种：
     * - classic: zh_cn / en_us（也接受 zh、en、zh|en，会映射）
     * - spark: zh / en / zh|en 等
     */
    language?: string;
    eos?: number;
    timeoutMs?: number;
    /** 覆盖实例默认模式 */
    mode?: IatMode;
}

export interface RecognizeResult {
    text: string;
    sid?: string;
    segments: Array<{ word: string; language?: string }>;
    mode: IatMode;
}

interface IatTextPayload {
    sn?: number;
    ls?: boolean;
    pgs?: string;
    rg?: number[];
    ws?: Array<{
        bg?: number;
        cw?: Array<{ w?: string; lg?: string }>;
    }>;
}

export class XfyunIatApi {
    private appId: string;
    private apiKey: string;
    private apiSecret: string;
    private mode: IatMode;
    private sparkHost: string;
    private sparkPath: string;
    private classicHost: string;
    private classicPath: string;

    constructor(options?: {
        appId?: string;
        apiKey?: string;
        apiSecret?: string;
        mode?: IatMode;
        sparkHost?: string;
        sparkPath?: string;
        classicHost?: string;
        classicPath?: string;
    }) {
        this.appId =
            options?.appId ||
            process.env.XFYUN_APP_ID ||
            process.env.XFYUN_APPID ||
            "";
        this.apiKey = options?.apiKey || process.env.XFYUN_API_KEY || "";
        this.apiSecret =
            options?.apiSecret || process.env.XFYUN_API_SECRET || "";

        const modeEnv = (
            options?.mode ||
            process.env.XFYUN_IAT_MODE ||
            "classic"
        ).toLowerCase();
        this.mode = modeEnv === "spark" ? "spark" : "classic";

        this.sparkHost =
            options?.sparkHost ||
            process.env.XFYUN_IAT_HOST ||
            "iat.cn-huabei-1.xf-yun.com";
        this.sparkPath =
            options?.sparkPath || process.env.XFYUN_IAT_PATH || "/v1";
        this.classicHost =
            options?.classicHost ||
            process.env.XFYUN_CLASSIC_IAT_HOST ||
            "iat-api.xfyun.cn";
        this.classicPath =
            options?.classicPath ||
            process.env.XFYUN_CLASSIC_IAT_PATH ||
            "/v2/iat";

        if (!this.appId || !this.apiKey || !this.apiSecret) {
            logger.warn(
                "[XfyunIat] 未配置完整凭证（XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET）",
            );
        } else {
            logger.success(
                `[XfyunIat] 语音识别已初始化 mode=${this.mode} (${this.mode === "spark" ? "大模型多语种" : "语音听写流式版"})`,
            );
        }
    }

    isConfigured(): boolean {
        return !!(this.appId && this.apiKey && this.apiSecret);
    }

    getMode(): IatMode {
        return this.mode;
    }

    buildAuthUrl(mode?: IatMode): string {
        const m = mode || this.mode;
        const host = m === "spark" ? this.sparkHost : this.classicHost;
        const path = m === "spark" ? this.sparkPath : this.classicPath;
        const date = new Date().toUTCString();
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
        const signature = crypto
            .createHmac("sha256", this.apiSecret)
            .update(signatureOrigin)
            .digest("base64");
        const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
        const authorization = Buffer.from(authorizationOrigin).toString(
            "base64",
        );
        const params = new URLSearchParams({
            authorization,
            date,
            host,
        });
        return `wss://${host}${path}?${params.toString()}`;
    }

    recognize(options: RecognizeOptions): Promise<RecognizeResult> {
        if (!this.isConfigured()) {
            return Promise.reject(
                new Error(
                    "讯飞语音识别未配置：请设置 XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET",
                ),
            );
        }

        const mode: IatMode = options.mode || this.mode;
        const encoding: AudioEncoding = options.encoding || "raw";
        const sampleRate = options.sampleRate || 16000;
        const timeoutMs = options.timeoutMs || 60000;
        const audio = options.audio;

        if (!audio || audio.length === 0) {
            return Promise.reject(new Error("音频数据为空"));
        }
        if (audio.length > 5 * 1024 * 1024) {
            return Promise.reject(new Error("音频过大，请控制在 60 秒以内"));
        }

        if (mode === "spark") {
            return this.recognizeSpark({
                audio,
                encoding,
                sampleRate,
                language: options.language,
                eos: options.eos,
                timeoutMs,
            });
        }
        return this.recognizeClassic({
            audio,
            encoding,
            sampleRate,
            language: options.language,
            eos: options.eos,
            timeoutMs,
        });
    }

    // ── classic: 语音听写流式版 ─────────────────────────────

    private recognizeClassic(opts: {
        audio: Buffer;
        encoding: AudioEncoding;
        sampleRate: number;
        language?: string;
        eos?: number;
        timeoutMs: number;
    }): Promise<RecognizeResult> {
        return new Promise((resolve, reject) => {
            let settled = false;
            let sid: string | undefined;
            const resultMap = new Map<number, string>();
            const segments: Array<{ word: string; language?: string }> = [];
            let snCounter = 0;

            const finish = (err?: Error) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                try {
                    if (
                        ws.readyState === WebSocket.OPEN ||
                        ws.readyState === WebSocket.CONNECTING
                    ) {
                        ws.close();
                    }
                } catch {
                    /* ignore */
                }
                if (err) {
                    reject(err);
                    return;
                }
                const text = Array.from(resultMap.entries())
                    .sort((a, b) => a[0] - b[0])
                    .map(([, t]) => t)
                    .join("");
                resolve({ text, sid, segments, mode: "classic" });
            };

            const timer = setTimeout(
                () => finish(new Error("语音识别超时")),
                opts.timeoutMs,
            );

            const url = this.buildAuthUrl("classic");
            logger.data(
                `[XfyunIat/classic] 连接 ${this.classicHost}${this.classicPath}, audio=${opts.audio.length}B`,
            );

            const ws = new WebSocket(url);

            ws.on("open", () => {
                void this.sendClassicFrames(ws, opts).catch((e) =>
                    finish(e instanceof Error ? e : new Error(String(e))),
                );
            });

            ws.on("message", (data: WebSocket.RawData) => {
                try {
                    const msg = JSON.parse(data.toString());
                    if (msg.code !== 0 && msg.code !== undefined) {
                        finish(this.mapLicenseError(msg.code, msg.message));
                        return;
                    }
                    if (msg.sid) sid = msg.sid;

                    const result = msg?.data?.result;
                    if (result) {
                        this.applyTextPayload(
                            result as IatTextPayload,
                            resultMap,
                            segments,
                            () => snCounter++,
                        );
                    }

                    if (msg?.data?.status === 2) {
                        finish();
                    }
                } catch (e: any) {
                    logger.error(
                        `[XfyunIat/classic] 解析消息失败: ${e?.message || e}`,
                    );
                }
            });

            ws.on("error", (err) => {
                finish(new Error(`WebSocket 错误: ${err.message}`));
            });

            ws.on("close", (code, reason) => {
                if (!settled) {
                    if (resultMap.size > 0 || sid) {
                        finish();
                    } else {
                        finish(
                            new Error(
                                `连接关闭且未获得识别结果 (code=${code}, reason=${reason?.toString() || ""})`,
                            ),
                        );
                    }
                }
            });
        });
    }

    private async sendClassicFrames(
        ws: WebSocket,
        opts: {
            audio: Buffer;
            encoding: AudioEncoding;
            sampleRate: number;
            language?: string;
            eos?: number;
        },
    ): Promise<void> {
        const total = opts.audio.length;
        let offset = 0;
        let isFirst = true;
        const format =
            opts.sampleRate === 8000
                ? "audio/L16;rate=8000"
                : "audio/L16;rate=16000";
        const language = mapClassicLanguage(opts.language);

        while (offset < total) {
            if (ws.readyState !== WebSocket.OPEN) {
                throw new Error("WebSocket 已断开，无法继续发送音频");
            }
            const end = Math.min(offset + FRAME_SIZE, total);
            const chunk = opts.audio.subarray(offset, end);
            offset = end;
            const isLast = offset >= total;

            let status: 0 | 1 | 2;
            if (isFirst && isLast) status = 2;
            else if (isFirst) status = 0;
            else if (isLast) status = 2;
            else status = 1;

            const frame: any = {
                data: {
                    status,
                    format,
                    encoding: opts.encoding,
                    audio: chunk.toString("base64"),
                },
            };

            if (isFirst) {
                frame.common = { app_id: this.appId };
                frame.business = {
                    language,
                    domain: "iat",
                    accent: "mandarin",
                    vad_eos: opts.eos ?? 3000,
                    dwa: "wpgs",
                };
            }

            ws.send(JSON.stringify(frame));
            isFirst = false;
            if (!isLast) await sleep(FRAME_INTERVAL_MS);
        }

        // 若最后一帧已是 status=2 且含音频，不必再发空结束帧
        logger.data(`[XfyunIat/classic] 音频发送完成`);
    }

    // ── spark: 大模型多语种 ────────────────────────────────

    private recognizeSpark(opts: {
        audio: Buffer;
        encoding: AudioEncoding;
        sampleRate: number;
        language?: string;
        eos?: number;
        timeoutMs: number;
    }): Promise<RecognizeResult> {
        return new Promise((resolve, reject) => {
            let settled = false;
            let sid: string | undefined;
            const resultMap = new Map<number, string>();
            const segments: Array<{ word: string; language?: string }> = [];
            let snCounter = 0;

            const finish = (err?: Error) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                try {
                    if (
                        ws.readyState === WebSocket.OPEN ||
                        ws.readyState === WebSocket.CONNECTING
                    ) {
                        ws.close();
                    }
                } catch {
                    /* ignore */
                }
                if (err) {
                    reject(err);
                    return;
                }
                const text = Array.from(resultMap.entries())
                    .sort((a, b) => a[0] - b[0])
                    .map(([, t]) => t)
                    .join("");
                resolve({ text, sid, segments, mode: "spark" });
            };

            const timer = setTimeout(
                () => finish(new Error("语音识别超时")),
                opts.timeoutMs,
            );

            const url = this.buildAuthUrl("spark");
            logger.data(
                `[XfyunIat/spark] 连接 ${this.sparkHost}${this.sparkPath}, audio=${opts.audio.length}B`,
            );

            const ws = new WebSocket(url);

            ws.on("open", () => {
                void this.sendSparkFrames(ws, opts).catch((e) =>
                    finish(e instanceof Error ? e : new Error(String(e))),
                );
            });

            ws.on("message", (data: WebSocket.RawData) => {
                try {
                    const msg = JSON.parse(data.toString());
                    const code = msg?.header?.code;
                    if (code !== 0 && code !== undefined) {
                        finish(
                            this.mapLicenseError(
                                code,
                                msg?.header?.message,
                                "spark",
                            ),
                        );
                        return;
                    }
                    if (msg?.header?.sid) sid = msg.header.sid;

                    const textB64 = msg?.payload?.result?.text;
                    if (textB64) {
                        const decoded = Buffer.from(textB64, "base64").toString(
                            "utf8",
                        );
                        try {
                            const payload = JSON.parse(
                                decoded,
                            ) as IatTextPayload;
                            this.applyTextPayload(
                                payload,
                                resultMap,
                                segments,
                                () => snCounter++,
                            );
                        } catch {
                            logger.warn(
                                `[XfyunIat/spark] 无法解析 text: ${decoded.slice(0, 80)}`,
                            );
                        }
                    }

                    if (
                        msg?.header?.status === 2 ||
                        msg?.payload?.result?.status === 2
                    ) {
                        finish();
                    }
                } catch (e: any) {
                    logger.error(
                        `[XfyunIat/spark] 解析消息失败: ${e?.message || e}`,
                    );
                }
            });

            ws.on("error", (err) => {
                finish(new Error(`WebSocket 错误: ${err.message}`));
            });

            ws.on("close", (code, reason) => {
                if (!settled) {
                    if (resultMap.size > 0) finish();
                    else
                        finish(
                            new Error(
                                `连接关闭且未获得识别结果 (code=${code}, reason=${reason?.toString() || ""})`,
                            ),
                        );
                }
            });
        });
    }

    private async sendSparkFrames(
        ws: WebSocket,
        opts: {
            audio: Buffer;
            encoding: AudioEncoding;
            sampleRate: number;
            language?: string;
            eos?: number;
        },
    ): Promise<void> {
        const total = opts.audio.length;
        let offset = 0;
        let seq = 1;
        let isFirst = true;

        while (offset < total) {
            if (ws.readyState !== WebSocket.OPEN) {
                throw new Error("WebSocket 已断开，无法继续发送音频");
            }
            const end = Math.min(offset + FRAME_SIZE, total);
            const chunk = opts.audio.subarray(offset, end);
            offset = end;
            const isLast = offset >= total;

            let status: 0 | 1 | 2;
            if (isFirst && isLast) status = 2;
            else if (isFirst) status = 0;
            else if (isLast) status = 2;
            else status = 1;

            const frame: any = {
                header: { app_id: this.appId, status },
                payload: {
                    audio: {
                        encoding: opts.encoding,
                        sample_rate: opts.sampleRate,
                        channels: 1,
                        bit_depth: 16,
                        seq,
                        status,
                        audio: chunk.toString("base64"),
                    },
                },
            };

            if (isFirst) {
                frame.parameter = {
                    iat: {
                        domain: "slm",
                        language: "mul_cn",
                        accent: "mandarin",
                        eos: opts.eos ?? 6000,
                        result: {
                            encoding: "utf8",
                            compress: "raw",
                            format: "json",
                        },
                    },
                };
                const ln = mapSparkLanguage(opts.language);
                if (ln) frame.parameter.iat.ln = ln;
            }

            ws.send(JSON.stringify(frame));
            isFirst = false;
            seq += 1;
            if (!isLast) await sleep(FRAME_INTERVAL_MS);
        }
        logger.data(`[XfyunIat/spark] 音频发送完成，共 ${seq - 1} 帧`);
    }

    // ── helpers ────────────────────────────────────────────

    private applyTextPayload(
        payload: IatTextPayload,
        resultMap: Map<number, string>,
        segments: Array<{ word: string; language?: string }>,
        nextSn: () => number,
    ) {
        let piece = "";
        for (const w of payload.ws || []) {
            for (const cw of w.cw || []) {
                const word = cw.w || "";
                if (!word) continue;
                piece += word;
                segments.push({ word, language: cw.lg });
            }
        }

        const sn = typeof payload.sn === "number" ? payload.sn : nextSn();

        if (
            payload.pgs === "rpl" &&
            Array.isArray(payload.rg) &&
            payload.rg.length >= 2
        ) {
            const [from, to] = payload.rg;
            for (let i = from; i <= to; i++) resultMap.delete(i);
        }

        if (piece) resultMap.set(sn, piece);
    }

    private mapLicenseError(
        code: number,
        message?: string,
        mode: IatMode = "classic",
    ): Error {
        const msg = message || `识别失败 code=${code}`;
        if (code === 11200 || code === 11201 || /licc/i.test(String(msg))) {
            const product =
                mode === "spark"
                    ? "大模型多语种语音识别 https://console.xfyun.cn/services/bmm"
                    : "语音听写（流式版） https://console.xfyun.cn/services/iat";
            return new Error(
                `讯飞授权失败 (code=${code}): 请确认 APPID 已开通并绑定「${product}」；原始信息: ${msg}`,
            );
        }
        return new Error(`讯飞识别错误 (code=${code}): ${msg}`);
    }
}

function mapClassicLanguage(lang?: string): string {
    if (!lang) return "zh_cn";
    const l = lang.toLowerCase().trim();
    if (l === "zh" || l === "zh_cn" || l === "zh-cn" || l.startsWith("zh|"))
        return "zh_cn";
    if (l === "en" || l === "en_us" || l === "en-us") return "en_us";
    // 其它直接透传（小语种等需控制台授权）
    return lang;
}

function mapSparkLanguage(lang?: string): string | undefined {
    if (!lang) return undefined;
    const l = lang.toLowerCase().trim();
    if (l === "zh_cn" || l === "zh-cn") return "zh";
    if (l === "en_us" || l === "en-us") return "en";
    return lang;
}

function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

/** 从 WAV/MP3/PCM 准备识别缓冲 */
export function prepareAudioBuffer(
    buffer: Buffer,
    mimeType?: string,
    filename?: string,
): { audio: Buffer; encoding: AudioEncoding } {
    const name = (filename || "").toLowerCase();
    const mime = (mimeType || "").toLowerCase();

    const isMp3 =
        mime.includes("mpeg") ||
        mime.includes("mp3") ||
        name.endsWith(".mp3");
    if (isMp3) {
        return { audio: stripMp3Id3(buffer), encoding: "lame" };
    }

    const isWav =
        mime.includes("wav") ||
        mime.includes("wave") ||
        name.endsWith(".wav") ||
        (buffer.length >= 12 &&
            buffer.toString("ascii", 0, 4) === "RIFF" &&
            buffer.toString("ascii", 8, 12) === "WAVE");

    if (isWav) {
        return { audio: extractPcmFromWav(buffer), encoding: "raw" };
    }

    return { audio: buffer, encoding: "raw" };
}

function stripMp3Id3(buf: Buffer): Buffer {
    if (buf.length >= 10 && buf.toString("ascii", 0, 3) === "ID3") {
        const size =
            ((buf[6] & 0x7f) << 21) |
            ((buf[7] & 0x7f) << 14) |
            ((buf[8] & 0x7f) << 7) |
            (buf[9] & 0x7f);
        const headerLen = 10 + size;
        if (headerLen < buf.length) return buf.subarray(headerLen);
    }
    return buf;
}

function extractPcmFromWav(buf: Buffer): Buffer {
    if (
        buf.length < 44 ||
        buf.toString("ascii", 0, 4) !== "RIFF" ||
        buf.toString("ascii", 8, 12) !== "WAVE"
    ) {
        return buf.length > 44 ? buf.subarray(44) : buf;
    }

    let offset = 12;
    while (offset + 8 <= buf.length) {
        const chunkId = buf.toString("ascii", offset, offset + 4);
        const chunkSize = buf.readUInt32LE(offset + 4);
        const dataStart = offset + 8;
        if (chunkId === "data") {
            const end = Math.min(dataStart + chunkSize, buf.length);
            return buf.subarray(dataStart, end);
        }
        offset = dataStart + chunkSize + (chunkSize % 2);
    }
    return buf.subarray(44);
}

export function pcmToWav(
    pcm: Buffer,
    sampleRate: number = 16000,
    channels: number = 1,
    bitDepth: number = 16,
): Buffer {
    const byteRate = (sampleRate * channels * bitDepth) / 8;
    const blockAlign = (channels * bitDepth) / 8;
    const header = Buffer.alloc(44);
    header.write("RIFF", 0);
    header.writeUInt32LE(36 + pcm.length, 4);
    header.write("WAVE", 8);
    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitDepth, 34);
    header.write("data", 36);
    header.writeUInt32LE(pcm.length, 40);
    return Buffer.concat([header, pcm]);
}

export const xfyunIatApi = new XfyunIatApi();
