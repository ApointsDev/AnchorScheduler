// 日程分享：创建、列表、删除与公开查看
import { getToken, customFetch } from "./client";
import type { Task } from "./tasks";

export interface ShareLink {
    id: string;
    token: string;
    name: string;
    dateStart: string | null;
    dateEnd: string | null;
    taskIds: string[] | null;
    expiresAt: string | null;
    createdAt: string;
    shareUrl: string;
}

export interface SharedScheduleView {
    share: { name: string; createdAt: string };
    tasks: Task[];
    user: { name: string };
}

export const createShare = async (data: {
    name?: string;
    dateStart?: string;
    dateEnd?: string;
    taskIds?: string[];
    expiresInDays?: number;
}): Promise<{ token: string; shareUrl: string; expiresAt: string | null }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/share/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "创建分享失败");
    }
    return response.json();
};

export const getShareList = async (): Promise<{ shares: ShareLink[] }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/share/list", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("获取分享列表失败");
    return response.json();
};

export const deleteShare = async (shareToken: string): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/share/${encodeURIComponent(shareToken)}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    if (!response.ok) throw new Error("删除分享失败");
};

export const getSharedView = async (
    shareToken: string,
): Promise<SharedScheduleView> => {
    const response = await customFetch(
        `/api/share/view/${encodeURIComponent(shareToken)}`,
    );
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "加载分享失败");
    }
    return response.json();
};
