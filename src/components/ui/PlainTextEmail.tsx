import React, { useMemo } from "react";
import "../../styles/ui.css";

interface PlainTextEmailProps {
    /** 纯文本邮件正文 */
    text: string;
    /** 自定义根节点 class（默认 .mail-plain-text） */
    className?: string;
}

interface Block {
    type: "p" | "quote" | "rule";
    lines: string[];
}

// 匹配 URL（含 www. 开头）与邮箱地址
const URL_SOURCE = "https?://[^\\s<>\"'()\\[\\]]+|www\\.[^\\s<>\"'()\\[\\]]+";
const EMAIL_SOURCE = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
const LINK_RE = new RegExp(`(${URL_SOURCE})|(${EMAIL_SOURCE})`, "g");

/** 将一行纯文本中的 URL / 邮箱渲染为可点击链接（React 自动转义，XSS 安全） */
const linkifyLine = (text: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    LINK_RE.lastIndex = 0;
    let lastIndex = 0;
    let key = 0;
    let match: RegExpExecArray | null;
    while ((match = LINK_RE.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }
        const token = match[0];
        const isUrl = Boolean(match[1]);

        if (isUrl) {
            // 去除 URL 尾部的标点（如 "https://a.com." 的句点），避免混入链接
            const stripped = token.replace(/[.,;:!?'")]+$/, "");
            const clean = stripped || token;
            const href = /^https?:\/\//i.test(clean)
                ? clean
                : `https://${clean}`;
            nodes.push(
                <a
                    key={key++}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {clean}
                </a>,
            );
            if (stripped !== token) {
                // 被剥掉的尾部标点以普通文本补回
                nodes.push(token.slice(stripped.length));
            }
        } else {
            nodes.push(
                <a key={key++} href={`mailto:${token}`}>
                    {token}
                </a>,
            );
        }
        lastIndex = match.index + token.length;
    }
    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }
    return nodes.length ? nodes : [text];
};

/** 解析纯文本邮件正文 → 结构化块（段落 / 引用 / 分隔线） */
const parseBlocks = (text: string): Block[] => {
    const blocks: Block[] = [];
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

    let paraLines: string[] = [];
    let quoteLines: string[] = [];

    const flushPara = () => {
        if (paraLines.length) {
            blocks.push({ type: "p", lines: paraLines });
            paraLines = [];
        }
    };
    const flushQuote = () => {
        if (quoteLines.length) {
            blocks.push({ type: "quote", lines: quoteLines });
            quoteLines = [];
        }
    };

    for (const raw of lines) {
        // 引用行：以 ">" 开头（允许前置空格），常见于回复/转发邮件
        if (/^\s*>/.test(raw)) {
            flushPara();
            quoteLines.push(raw.replace(/^\s*>\s?/, ""));
            continue;
        }
        flushQuote();
        // 空行 → 段落结束
        if (raw.trim() === "") {
            flushPara();
            continue;
        }
        // 分隔线 / 签名分隔符
        if (/^\s*(?:-{3,}|\*{3,}|_{3,}|={3,}|\s*--\s*)\s*$/.test(raw)) {
            flushPara();
            blocks.push({ type: "rule", lines: [] });
            continue;
        }
        paraLines.push(raw);
    }
    flushPara();
    flushQuote();
    return blocks;
};

/**
 * 纯文本邮件正文排版组件：
 * - 空行分段、单行换行保留
 * - ">" 引用行渲染为引用块
 * - "---" / "-- " 渲染为分隔线
 * - URL / 邮箱自动转为可点击链接
 */
const PlainTextEmail: React.FC<PlainTextEmailProps> = ({ text, className }) => {
    const blocks = useMemo(() => parseBlocks(text || ""), [text]);

    if (!text || !text.trim()) return null;

    return (
        <div className={className || "mail-plain-text"}>
            {blocks.map((block, i) => {
                if (block.type === "rule") {
                    return <hr key={i} />;
                }
                const Tag = block.type === "quote" ? "blockquote" : "p";
                return (
                    <Tag key={i}>
                        {block.lines.map((line, j) => (
                            <React.Fragment key={j}>
                                {j > 0 && <br />}
                                {linkifyLine(line)}
                            </React.Fragment>
                        ))}
                    </Tag>
                );
            })}
        </div>
    );
};

export default PlainTextEmail;
