// 语音识别（讯飞大模型多语种）
import { getToken, customFetch } from "./client";

export interface SpeechRecognizeResult {
    success: boolean;
    text: string;
    sid?: string;
    segments?: Array<{ word: string; language?: string }>;
    encoding?: string;
    sampleRate?: number;
}

export interface SpeechStatus {
    configured: boolean;
    provider: string;
    host: string;
    supportedFormats: string[];
    maxDurationSec: number;
    sampleRates: number[];
}

/** 查询语音识别服务状态 */
export const getSpeechStatus = async (): Promise<SpeechStatus> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/speech/status", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "获取语音识别状态失败");
    }
    return response.json();
};

/**
 * 上传音频进行语音识别
 * @param audio Blob 或 File（建议 16k/16bit/mono WAV 或 MP3，≤60s）
 * @param options.language 可选语种，如 zh / en / zh|en
 */
export const recognizeSpeech = async (
    audio: Blob | File,
    options?: {
        language?: string;
        sampleRate?: 8000 | 16000;
        encoding?: "raw" | "lame";
        filename?: string;
    },
): Promise<SpeechRecognizeResult> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const form = new FormData();
    const filename =
        options?.filename ||
        (audio instanceof File ? audio.name : "recording.wav");
    form.append("file", audio, filename);
    if (options?.language) form.append("language", options.language);
    if (options?.sampleRate)
        form.append("sampleRate", String(options.sampleRate));
    if (options?.encoding) form.append("encoding", options.encoding);

    const response = await customFetch("/api/speech/recognize", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "语音识别失败");
    }
    return response.json();
};
