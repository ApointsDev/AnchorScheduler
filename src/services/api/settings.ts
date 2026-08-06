// 用户设置：引导页状态、推广邮件、回复前缀、周信息
import { customFetch, getToken, API_BASE_URL } from "./client";

// 引导页状态（持久化到数据库）
export const getOnboardingStatus = async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;
    const response = await customFetch(
        `${API_BASE_URL}/api/settings/onboarding`,
        { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.onboardingCompleted === true;
};

export const setOnboardingCompleted = async (
    completed: boolean,
): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    await customFetch(`${API_BASE_URL}/api/settings/onboarding`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
    });
};

// ── 推广邮件日程设置 ──────────────────────────────────────────────

export const setAutoSchedulePromotions = async (
    enabled: boolean,
): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    await customFetch("/api/settings/auto-schedule-promotions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
    });
};

export const setStripReplyPrefix = async (enabled: boolean): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    await customFetch("/api/settings/strip-reply-prefix", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
    });
};

export const getUserSettings = async (): Promise<{
    autoSchedulePromotions: boolean;
    stripReplyPrefix: boolean;
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("获取用户设置失败");
    return response.json();
};

// ── 周信息 ────────────────────────────────────────────────────────

// 获取当前周信息（含全局与用户偏移）
export interface WeekInfoResponse {
    rawWeekNumber: number;
    globalWeekOffset: number;
    userWeekOffset: number;
    effectiveWeek: number;
}

export const getWeekInfo = async (): Promise<WeekInfoResponse> => {
    const response = await customFetch(`/api/settings/week`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取周信息失败");
    }

    return response.json();
};

// 设置用户级周偏移或通过提供 currentWeek 来设置当前周
export const setUserWeek = async (data: {
    currentWeek?: number;
    userWeekOffset?: number;
}): Promise<WeekInfoResponse> => {
    const response = await customFetch(`/api/settings/week`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "设置周信息失败");
    }

    return response.json();
};
