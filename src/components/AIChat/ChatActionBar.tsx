import React, { useRef, useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Image, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { recognizeSpeech } from "../../services/api";
import "../../styles/ChatActionBar.css";

interface ChatActionBarProps {
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    /** 是否嵌入卡片内（PC 端），false 则透明背景适配浮动栏 */
    embedded?: boolean;
}

const TARGET_SAMPLE_RATE = 16000;

/**
 * 将 Float32 PCM 重采样为 16kHz Int16
 */
function resampleToInt16(
    input: Float32Array,
    inputSampleRate: number,
    targetSampleRate: number,
): Int16Array {
    if (inputSampleRate === targetSampleRate) {
        const out = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        return out;
    }

    const ratio = inputSampleRate / targetSampleRate;
    const newLength = Math.max(1, Math.round(input.length / ratio));
    const out = new Int16Array(newLength);
    for (let i = 0; i < newLength; i++) {
        const idx = i * ratio;
        const i0 = Math.floor(idx);
        const i1 = Math.min(i0 + 1, input.length - 1);
        const frac = idx - i0;
        const sample = input[i0] * (1 - frac) + input[i1] * frac;
        const s = Math.max(-1, Math.min(1, sample));
        out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
}

/** 打包标准 WAV */
function encodeWav(samples: Int16Array, sampleRate: number): Blob {
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;
    const dataSize = samples.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeStr(36, "data");
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        view.setInt16(offset, samples[i], true);
    }

    return new Blob([buffer], { type: "audio/wav" });
}

const ChatActionBar: React.FC<ChatActionBarProps> = ({
    input,
    onInputChange,
    onSend,
    onFileUpload,
    loading,
    embedded = false,
}) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isRecognizing, setIsRecognizing] = useState(false);

    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const chunksRef = useRef<Float32Array[]>([]);
    const inputSampleRateRef = useRef(44100);
    // 用 ref 保存最新 input，避免闭包拿到旧值
    const inputRef = useRef(input);
    useEffect(() => {
        inputRef.current = input;
    }, [input]);

    const cleanupAudio = useCallback(() => {
        try {
            processorRef.current?.disconnect();
            sourceRef.current?.disconnect();
            processorRef.current = null;
            sourceRef.current = null;
        } catch {
            /* ignore */
        }
        if (audioContextRef.current) {
            void audioContextRef.current.close().catch(() => undefined);
            audioContextRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((tr) => tr.stop());
            mediaStreamRef.current = null;
        }
    }, []);

    const stopAndRecognize = useCallback(async () => {
        setIsRecording(false);

        // 先断开采集，再合并缓冲
        const chunks = chunksRef.current;
        chunksRef.current = [];
        const sampleRate = inputSampleRateRef.current;
        cleanupAudio();

        if (chunks.length === 0) {
            return;
        }

        const totalLength = chunks.reduce((n, c) => n + c.length, 0);
        const merged = new Float32Array(totalLength);
        let offset = 0;
        for (const c of chunks) {
            merged.set(c, offset);
            offset += c.length;
        }

        // 过短（不足约 0.2s）忽略
        if (merged.length / sampleRate < 0.2) {
            return;
        }

        const pcm16 = resampleToInt16(merged, sampleRate, TARGET_SAMPLE_RATE);
        const wavBlob = encodeWav(pcm16, TARGET_SAMPLE_RATE);

        setIsRecognizing(true);
        try {
            const result = await recognizeSpeech(wavBlob, {
                language: "zh|en",
                sampleRate: TARGET_SAMPLE_RATE,
                filename: "recording.wav",
            });
            const text = (result.text || "").trim();
            if (text) {
                const prev = inputRef.current;
                const next = prev ? `${prev}${text}` : text;
                onInputChange(next);
            }
        } catch (err: any) {
            console.error("[Speech]", err);
            alert(err?.message || "语音识别失败，请重试");
        } finally {
            setIsRecognizing(false);
        }
    }, [cleanupAudio, onInputChange]);

    const startRecording = useCallback(async () => {
        if (
            !navigator.mediaDevices?.getUserMedia ||
            typeof AudioContext === "undefined"
        ) {
            alert("当前浏览器不支持麦克风录音，请使用 Chrome / Edge / Safari。");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });
            mediaStreamRef.current = stream;

            const AudioCtx =
                window.AudioContext ||
                (window as any).webkitAudioContext;
            const ctx: AudioContext = new AudioCtx();
            audioContextRef.current = ctx;
            inputSampleRateRef.current = ctx.sampleRate;

            const source = ctx.createMediaStreamSource(stream);
            sourceRef.current = source;

            // ScriptProcessor 兼容性最好；bufferSize 4096
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            chunksRef.current = [];

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                chunksRef.current.push(new Float32Array(inputData));
            };

            source.connect(processor);
            // 接到静音 gain，避免回放麦克风声，同时保证 onaudioprocess 被触发
            const mute = ctx.createGain();
            mute.gain.value = 0;
            processor.connect(mute);
            mute.connect(ctx.destination);

            setIsRecording(true);
        } catch (err: any) {
            cleanupAudio();
            console.error("[Speech] mic error", err);
            alert(
                err?.name === "NotAllowedError"
                    ? "麦克风权限被拒绝，请在浏览器设置中允许后重试。"
                    : "无法启动录音，请检查麦克风权限。",
            );
        }
    }, [cleanupAudio]);

    const toggleVoice = useCallback(() => {
        if (isRecognizing || loading) return;
        if (isRecording) {
            void stopAndRecognize();
        } else {
            void startRecording();
        }
    }, [
        isRecognizing,
        loading,
        isRecording,
        stopAndRecognize,
        startRecording,
    ]);

    useEffect(() => {
        return () => {
            cleanupAudio();
        };
    }, [cleanupAudio]);

    const micTitle = isRecognizing
        ? "识别中…"
        : isRecording
          ? "停止录音并识别"
          : "语音输入（讯飞识别）";

    return (
        <div
            className={`chat-action-bar ${embedded ? "chat-action-bar-embedded" : ""}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,audio/*"
                onChange={onFileUpload}
                style={{ display: "none" }}
            />
            <Button
                variant="ghost"
                size="sm"
                className="action-bar-icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || isRecording || isRecognizing}
                title="上传图片"
            >
                <Image size={20} />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className={`action-bar-icon ${isRecording ? "recording" : ""} ${isRecognizing ? "recognizing" : ""}`}
                onClick={toggleVoice}
                disabled={loading || isRecognizing}
                title={micTitle}
            >
                {isRecognizing ? (
                    <Loader2 size={20} className="spin" />
                ) : isRecording ? (
                    <MicOff size={20} />
                ) : (
                    <Mic size={20} />
                )}
            </Button>
            <Textarea
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={t("ai.chatPlaceholder")}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                disabled={loading}
                rows={1}
                className="action-bar-input"
            />
            <Button
                onClick={onSend}
                disabled={loading || !input.trim()}
                className="action-bar-send"
                title={t("ai.send")}
            >
                <Send size={18} />
            </Button>
        </div>
    );
};

export default ChatActionBar;
