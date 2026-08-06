// API 客户端基础：URL 解析、fetch 封装、JWT 令牌管理与认证事件

// 开发模式下指向后端服务器 (默认 3000 端口)
const isDev = import.meta.env.VITE_DEV_MODE === "true";
export const API_BASE_URL = isDev
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_BASE_URL || window.location.origin;

/** 认证失效事件源（收到 403 时触发 unauthorized 事件） */
export const authEvents = new EventTarget();

/** 将相对的 /api 路径解析为完整的后端地址，避免在前端与后端不同域时发出错误的相对请求 */
export function resolveApiUrl(input: string): string {
    if (input.startsWith(`${API_BASE_URL}`)) {
        return input;
    }
    return `${API_BASE_URL}${input}`;
}

export const customFetch = async (
    input: string,
    init?: RequestInit,
): Promise<Response> => {
    const target = resolveApiUrl(input);
    const response = await fetch(target, init);
    if (response.status === 403) {
        authEvents.dispatchEvent(new Event("unauthorized"));
    }
    return response;
};

// 存储JWT令牌
export const setToken = (token: string): void => {
    localStorage.setItem("auth_token", token);
};

export const getToken = (): string | null => {
    return localStorage.getItem("auth_token");
};

export const removeToken = (): void => {
    localStorage.removeItem("auth_token");
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
