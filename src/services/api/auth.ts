// 认证：注册、登录与第三方 OAuth（CAF / Microsoft / Exchange）
import { customFetch, getToken, API_BASE_URL } from "./client";

// 注册用户
export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export const register = async (
    data: RegisterData,
): Promise<{ token: string }> => {
    const response = await customFetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "注册失败");
    }

    const result = await response.json();
    // 保存用户邮箱
    localStorage.setItem("user_email", data.email);
    return result;
};

// 登录用户
export interface LoginData {
    email: string;
    password: string;
}

export const login = async (data: LoginData): Promise<{ token: string }> => {
    const response = await customFetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "登录失败");
    }

    const result = await response.json();
    // 保存用户邮箱
    localStorage.setItem("user_email", data.email);
    return result;
};

// 启动 CAF OAuth 流程
export const startCafAuth = (): void => {
    window.location.href = `${API_BASE_URL}/auth/caf`;
};

// 启动Microsoft OAuth流程
export const startMicrosoftAuth = (): void => {
    const token = getToken();
    if (token) {
        window.location.href = `${API_BASE_URL}/auth?jwt=${encodeURIComponent(token)}`;
    } else {
        window.location.href = `${API_BASE_URL}/auth`;
    }
};

// 启动 Exchange OAuth 流程 (XJTLU UIM)
export const startExchangeAuth = (loginHint?: string): Promise<void> => {
    const token = getToken();
    const width = 500;
    const height = 600;
    // 计算居中位置
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    let url = `${API_BASE_URL}/auth/exchange?jwt=${token}`;
    if (loginHint) {
        url += `&login_hint=${encodeURIComponent(loginHint)}`;
    }

    const authWindow = window.open(
        url,
        "ExchangeAuth",
        `width=${width},height=${height},left=${left},top=${top}`,
    );

    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (authWindow?.closed) {
                clearInterval(timer);
                resolve();
            }
        }, 1000);

        const handler = (event: MessageEvent) => {
            if (event.data?.type === "EXCHANGE_BOUND") {
                clearInterval(timer);
                authWindow?.close();
                window.removeEventListener("message", handler);
                resolve();
            }
        };
        window.addEventListener("message", handler);
    });
};

// 解绑 Exchange
export interface UnbindExchangeResponse {
    message: string;
}

export const unbindExchange = async (): Promise<UnbindExchangeResponse> => {
    const response = await customFetch("/api/unbind/exchange", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "解绑失败");
    }

    return response.json();
};
