// CalDAV：客户端配置、同步与内置 CalDAV 服务器管理
import { getToken, customFetch } from "./client";

export interface CalDavStatus {
    enabled: boolean;
    baseUrl: string | null;
    username: string | null;
    principalUrl: string | null;
    calendarHome: string | null;
    calendarUrl: string | null;
    lastSyncAt: string | null;
}

export interface CalDavSyncResult {
    pulled: {
        created: number;
        updated: number;
        skippedConflicts: number;
        errors: number;
    };
    pushed: {
        created: number;
        updated: number;
        skippedConflicts: number;
        errors: number;
    };
}

export interface CalDavServerStatus {
    enabled: boolean;
    serverUrl: string;
    principalUrl: string | null;
    calendarHomeUrl: string | null;
    calendarUrl: string | null;
    username: string | null;
    password: string | null;
    connectionHint: string | null;
}

export interface CalDavServerEnableResult {
    message: string;
    enabled: boolean;
    serverUrl: string;
    principalUrl: string | null;
    calendarHomeUrl: string | null;
    calendarUrl: string | null;
    username: string | null;
    password: string | null;
}

export const configureCalDav = async (data: {
    baseUrl: string;
    username: string;
    password: string;
    calendarUrl?: string;
}): Promise<any> => {
    const response = await customFetch("/api/caldav/config", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "CalDAV 配置失败");
    }

    return response.json();
};

export const getCalDavStatus = async (): Promise<CalDavStatus> => {
    const response = await customFetch("/api/caldav/status", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取 CalDAV 状态失败");
    }

    return response.json();
};

export const syncCalDav = async (options?: {
    direction?: string;
    calendarUrl?: string;
    rangeStart?: string;
    rangeEnd?: string;
    allowConflict?: boolean;
}): Promise<{ message: string; result: CalDavSyncResult }> => {
    const response = await customFetch("/api/caldav/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(options || {}),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "CalDAV 同步失败");
    }

    return response.json();
};

export const unbindCalDav = async (): Promise<{ message: string }> => {
    const response = await customFetch("/api/caldav/config", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "CalDAV 解绑失败");
    }

    return response.json();
};

export const getCalDavServerStatus = async (): Promise<CalDavServerStatus> => {
    const response = await customFetch("/api/caldav-server/status", {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取 CalDAV 服务器状态失败");
    }

    return response.json();
};

export const enableCalDavServer =
    async (): Promise<CalDavServerEnableResult> => {
        const response = await customFetch("/api/caldav-server/enable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "启用 CalDAV 服务器失败");
        }

        return response.json();
    };

export const disableCalDavServer =
    async (): Promise<CalDavServerEnableResult> => {
        const response = await customFetch("/api/caldav-server/disable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "禁用 CalDAV 服务器失败");
        }

        return response.json();
    };
