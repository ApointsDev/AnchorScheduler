// API 路由聚合器
// 按 scope 拆分后的各子路由模块在此注册，保持对 /api 挂载点的统一出口。
// 子模块：chat / status / integration / caldav / settings / task / scheduleQueue / email / user / share
import express from "express";
import { LLMApi } from "../Services/LLMApi.js";
import { registerChatRoutes } from "./chatRoutes.js";
import { registerStatusRoutes } from "./statusRoutes.js";
import { registerIntegrationRoutes } from "./integrationRoutes.js";
import { registerCalDavRoutes } from "./caldavRoutes.js";
import { registerSettingsRoutes } from "./settingsRoutes.js";
import { registerTaskRoutes } from "./taskRoutes.js";
import { registerScheduleQueueRoutes } from "./scheduleQueueRoutes.js";
import { registerEmailRoutes } from "./emailRoutes.js";
import { registerUserRoutes } from "./userRoutes.js";
import { registerShareRoutes } from "./shareRoutes.js";
import { registerUploadRoutes } from "./uploadRoutes.js";
import type { AuthMiddleware } from "./apiTypes.js";

// 向后兼容：其他路由文件（如 todoRoutes.ts）从 ./apiRoutes 导入 AuthMiddleware
export type { AuthMiddleware } from "./apiTypes.js";

export function initializeApiRoutes(
    authenticateToken: AuthMiddleware,
    frontendUrl: string,
) {
    // 创建路由器 - 每次调用都创建新的实例
    const router = express.Router();

    // 初始化 LLM API（供聊天与四象限分类路由使用）
    const llmApi = new LLMApi(
        process.env.OPENAI_API_KEY || "",
        process.env.OPENAI_MODEL || "deepseek-chat",
    );

    // 按 scope 注册各子路由模块（注册顺序保持与原实现一致）
    registerChatRoutes(router, authenticateToken, llmApi);
    registerStatusRoutes(router, authenticateToken);
    registerIntegrationRoutes(router, authenticateToken);
    registerCalDavRoutes(router, authenticateToken);
    registerSettingsRoutes(router, authenticateToken);
    registerTaskRoutes(router, authenticateToken);
    registerScheduleQueueRoutes(router, authenticateToken);
    registerEmailRoutes(router, authenticateToken);
    registerUserRoutes(router, authenticateToken);
    registerShareRoutes(router, authenticateToken, frontendUrl);
    registerUploadRoutes(router, authenticateToken);

    return router;
}
