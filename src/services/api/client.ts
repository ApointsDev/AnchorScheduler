// API 客户端基础：URL 解析、fetch 封装、JWT 令牌管理与认证事件

// 开发模式下指向后端服务器 (默认 3000 端口)
const isDev = import.meta.env.VITE_DEV_MODE === "true";
export const API_BASE_URL = isDev
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_BASE_URL || window.location.origin;

/** 认证失效事件源（收到 403 时触发 unauthorized 事件） */
export const authEvents = new EventTarget();

// ── 令牌刷新机制 ──────────────────────────────────────────
// access token 过期（1h）后，用 refresh token（30d）静默换发新令牌，
// 避免用户在活跃使用时被强制下线。仅当刷新失败或无刷新令牌时才触发下线。
const REFRESH_TOKEN_KEY = "auth_refresh_token";

/** 将相对的 /api 路径解析为完整的后端地址，避免在前端与后端不同域时发出错误的相对请求 */
export function resolveApiUrl(input: string): string {
    if (input.startsWith(`${API_BASE_URL}`)) {
        return input;
    }
    return `${API_BASE_URL}${input}`;
}

export const setRefreshToken = (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// 并发防护：多个请求同时收到 403 时只触发一次刷新
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });
            if (!res.ok) {
                // 刷新令牌无效/过期：清除本地会话，交由上层触发下线
                removeToken();
                removeRefreshToken();
                return false;
            }
            const data = await res.json();
            setToken(data.token);
            if (data.refreshToken) setRefreshToken(data.refreshToken);
            return true;
        } catch {
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

export const customFetch = async (
    input: string,
    init?: RequestInit,
): Promise<Response> => {
    const target = resolveApiUrl(input);
    let response = await fetch(target, init);
    // 403：可能是 access token 过期，先尝试静默刷新并重试一次
    if (response.status === 403 && !(init as any)?._isRetry) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            const headers = new Headers(init?.headers || {});
            headers.set("Authorization", `Bearer ${getToken()}`);
            response = await fetch(target, {
                ...init,
                headers,
                _isRetry: true,
            } as any);
        } else {
            // 刷新失败（或无刷新令牌）：会话失效，触发下线
            authEvents.dispatchEvent(new Event("unauthorized"));
        }
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
