// 用户日志查询
import { customFetch, getToken, API_BASE_URL } from "./client";

// 获取用户日志
export interface LogEntry {
    id: string;
    time: string;
    type: string;
    message: string;
    payload?: any;
}

export interface LogsResponse {
    logs: LogEntry[];
    total: number;
    limit: number;
    offset: number;
}

export const getLogs = async (params?: {
    limit?: number;
    offset?: number;
    type?: string;
    since?: string;
    until?: string;
}): Promise<LogsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.limit !== undefined)
        queryParams.append("limit", params.limit.toString());
    if (params?.offset !== undefined)
        queryParams.append("offset", params.offset.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.since) queryParams.append("since", params.since);
    if (params?.until) queryParams.append("until", params.until);

    const response = await customFetch(
        `${API_BASE_URL}/api/logs?${queryParams.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取日志失败");
    }

    return response.json();
};
