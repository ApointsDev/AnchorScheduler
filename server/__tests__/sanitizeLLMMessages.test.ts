/**
 * sanitizeLLMMessages 净化函数单元测试
 * 覆盖：完整 tool 对话正常通过、悬空 tool_calls 被剥离、孤儿 tool 消息被丢弃、
 * 空 tool_call_id 被丢弃、混合场景。
 *
 * 说明：LLMApi.ts 会级联导入 logger/mcp 等较重模块（logger 使用 import.meta，
 * 在 ts-jest 环境下无法编译），因此测试中对这两个模块打桩，只加载纯函数。
 */
jest.mock("../Utils/logger.js", () => ({
    logger: {
        success: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        data: jest.fn(),
        exchange: jest.fn(),
    },
}));

jest.mock("../Services/mcp.js", () => ({
    getOpenAITools: jest.fn(() => []),
}));

import { sanitizeLLMMessages } from "../Services/LLMApi";

function toolCall(id: string, name = "f") {
    return {
        id,
        type: "function",
        function: { name, arguments: "{}" },
    };
}

describe("sanitizeLLMMessages", () => {
    it("保留完整 tool 对话（assistant tool_calls + 完整 tool 回应）原样通过", () => {
        const messages = [
            { role: "system", content: "sys" },
            { role: "user", content: "hi" },
            {
                role: "assistant",
                content: null,
                tool_calls: [toolCall("call_a"), toolCall("call_b", "g")],
            },
            { role: "tool", tool_call_id: "call_a", content: "ok" },
            { role: "tool", tool_call_id: "call_b", content: "ok" },
            { role: "assistant", content: "done" },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual(messages);
    });

    it("剥离悬空的 tool_calls（部分 tool 回应缺失）并丢弃孤儿 tool 消息", () => {
        const messages = [
            {
                role: "assistant",
                content: "let me call",
                tool_calls: [toolCall("call_a"), toolCall("call_b", "g")],
            },
            { role: "tool", tool_call_id: "call_a", content: "ok" },
            { role: "user", content: "next" },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual([
            { role: "assistant", content: "let me call" },
            { role: "user", content: "next" },
        ]);
    });

    it("剥离完全无 tool 回应（会话截断）的悬空 tool_calls", () => {
        const messages = [
            { role: "user", content: "hi" },
            {
                role: "assistant",
                content: "",
                tool_calls: [toolCall("call_a")],
            },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual([
            { role: "user", content: "hi" },
            { role: "assistant", content: "" },
        ]);
    });

    it("丢弃没有前置 tool_calls 的孤儿 tool 消息", () => {
        const messages = [
            { role: "user", content: "hi" },
            { role: "tool", tool_call_id: "call_x", content: "orphan" },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual([
            { role: "user", content: "hi" },
        ]);
    });

    it("丢弃空 tool_call_id 与不匹配 tool_call_id 的 tool 消息", () => {
        const messages = [
            {
                role: "assistant",
                content: null,
                tool_calls: [toolCall("call_a")],
            },
            { role: "tool", tool_call_id: "call_a", content: "ok" },
            { role: "tool", tool_call_id: "", content: "empty id" },
            { role: "tool", tool_call_id: "call_unknown", content: "no match" },
            { role: "user", content: "hi" },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual([
            {
                role: "assistant",
                content: null,
                tool_calls: [toolCall("call_a")],
            },
            { role: "tool", tool_call_id: "call_a", content: "ok" },
            { role: "user", content: "hi" },
        ]);
    });

    it("tool_calls 中 id 为空的 assistant 按悬空处理（剥离 tool_calls）", () => {
        const messages = [
            {
                role: "assistant",
                content: "x",
                tool_calls: [toolCall("")],
            },
            { role: "tool", tool_call_id: "", content: "orphan" },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual([
            { role: "assistant", content: "x" },
        ]);
    });

    it("空 tool_calls 数组的 assistant 剥离空字段", () => {
        const messages = [
            { role: "assistant", content: "plain", tool_calls: [] },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual([
            { role: "assistant", content: "plain" },
        ]);
    });

    it("混合场景：合法 tool 对话保留 + 悬空 tool_calls 剥离 + 孤儿 tool 丢弃", () => {
        const messages = [
            { role: "system", content: "sys" },
            { role: "user", content: "q1" },
            { role: "tool", tool_call_id: "call_orphan", content: "orphan" },
            {
                role: "assistant",
                content: null,
                tool_calls: [toolCall("call_1")],
            },
            { role: "tool", tool_call_id: "call_1", content: "ok" },
            { role: "assistant", content: "answer 1" },
            { role: "user", content: "q2" },
            {
                role: "assistant",
                content: "partial",
                tool_calls: [toolCall("call_2")],
            },
            { role: "tool", tool_call_id: "call_2", content: "ok" },
            // 会话在此截断：call_3 的 tool_calls 没有对应 tool 回应
            {
                role: "assistant",
                content: "",
                tool_calls: [toolCall("call_3")],
            },
        ];

        expect(sanitizeLLMMessages(messages)).toEqual([
            { role: "system", content: "sys" },
            { role: "user", content: "q1" },
            {
                role: "assistant",
                content: null,
                tool_calls: [toolCall("call_1")],
            },
            { role: "tool", tool_call_id: "call_1", content: "ok" },
            { role: "assistant", content: "answer 1" },
            { role: "user", content: "q2" },
            {
                role: "assistant",
                content: "partial",
                tool_calls: [toolCall("call_2")],
            },
            { role: "tool", tool_call_id: "call_2", content: "ok" },
            { role: "assistant", content: "" },
        ]);
    });
});
