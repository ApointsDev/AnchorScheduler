// 第三方集成：SMTP、Exchange/Ebridge、Microsoft Todo、课表同步与状态查询
import { getToken, customFetch, API_BASE_URL } from "./client";

export interface SmtpConfig {
    smtpEmail: string;
    smtpPassword: string;
    smtpHost: string;
    smtpPort: number;
    smtpTls: boolean;
}

export const bindSmtp = async (
    data: SmtpConfig,
): Promise<{ message: string }> => {
    const response = await customFetch("/api/bind/smtp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "SMTP 绑定失败");
    }

    return response.json();
};

export const unbindSmtp = async (): Promise<{ message: string }> => {
    const response = await customFetch("/api/unbind/smtp", {
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

export const saveEbridgeTimetableUrl = async (
    timetableUrl: string,
): Promise<void> => {
    const response = await customFetch(`${API_BASE_URL}/api/ebridge/save-url`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ timetableUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "保存课表 URL 失败");
    }
};

// 直接导入 eBridge 课程表哈希（无需账号密码）
export const importEbridgeTimetableHash = async (
    timetableHash: string,
): Promise<void> => {
    const response = await customFetch(`${API_BASE_URL}/api/ebridge/save-url`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ timetableHash }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "导入课程表哈希失败");
    }
};

// ── Exchange 邮箱转发绑定（引导式）──────────────────────────
// 学校更改权限后原 OAuth 绑定已废弃；改为引导用户配置
// XJTLU 邮箱 → @apoints.email 的转发，系统发送测试邮件确认绑定。

export interface ExchangeForwardStartResult {
    sent: boolean;
    code: string;
    forwardTarget: string;
}

// 发送测试邮件并开启待验证状态
export const startExchangeForward = async (
    xjtluEmail: string,
): Promise<ExchangeForwardStartResult> => {
    const response = await customFetch(
        `${API_BASE_URL}/api/exchange-forward/start`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ xjtluEmail }),
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "发送测试邮件失败");
    }

    return response.json();
};

// 检查绑定状态（检索被转发的测试邮件）
export const checkExchangeForward = async (): Promise<{
    confirmed: boolean;
    email?: string;
}> => {
    const response = await customFetch(
        `${API_BASE_URL}/api/exchange-forward/check`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({}),
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "检查绑定状态失败");
    }

    return response.json();
};

// 取消待验证状态
export const cancelExchangeForward = async (): Promise<void> => {
    await customFetch(`${API_BASE_URL}/api/exchange-forward/cancel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({}),
    });
};

// 查询Microsoft Todo状态接口
export interface MicrosoftTodoStatus {
    connected: boolean;
    binded: boolean;
    tokenAvailable: boolean;
    lastChecked: string;
}

export const getMicrosoftTodoStatus =
    async (): Promise<MicrosoftTodoStatus> => {
        const response = await customFetch(
            `${API_BASE_URL}/api/status/microsoft-todo`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({}),
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "获取Microsoft Todo状态失败");
        }

        return response.json();
    };

// 查询Ebridge状态接口
export interface EbridgeStatus {
    connected: boolean;
    binded: boolean;
    passwordAvailable: boolean;
    emsClientAvailable: boolean;
    lastChecked: string;
    // Exchange specific status
    exchangeBinded?: boolean;
    exchangeTokenAvailable?: boolean;
    // SMTP specific status
    smtpBinded?: boolean;
    smtpEmail?: string | null;
    imapClientAvailable?: boolean;
}

export const getEbridgeStatus = async (): Promise<EbridgeStatus> => {
    const response = await customFetch(`${API_BASE_URL}/api/status/ebridge`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取Ebridge状态失败");
    }

    return response.json();
};

// ── 课表同步 ──────────────────────────────────────────────────────

export interface SyncTimetableResponse {
    message: string;
    added: number;
    errors: number;
}

export const syncTimetable = async (): Promise<SyncTimetableResponse> => {
    const response = await customFetch(`${API_BASE_URL}/api/sync/timetable`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "同步课表失败");
    }

    return response.json();
};

export interface DeleteTimetableResponse {
    message: string;
    count: number;
}

export const deleteTimetableTasks =
    async (): Promise<DeleteTimetableResponse> => {
        const response = await customFetch(
            `${API_BASE_URL}/api/sync/timetable`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "删除课表日程失败");
        }

        return response.json();
    };
