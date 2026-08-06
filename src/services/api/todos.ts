// 待办队列（Todo Queue）：获取与审批
import { getToken, customFetch } from "./client";

/** 待办审批队列项（与 ScheduleQueueItem 同形） */
export interface TodoQueueItem {
    id: string;
    userId: string;
    rawRequest: string;
    status: string;
    createdAt: string;
}

export const getTodoQueue = async (): Promise<{
    queue: TodoQueueItem[];
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(`/api/todo-queue`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取待办队列失败");
    }

    return response.json();
};

export const approveTodoQueueItem = async (queueId: string): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/todo-queue/${encodeURIComponent(queueId)}/approve`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "批准待办请求失败");
    }

    return response.json();
};

export const rejectTodoQueueItem = async (queueId: string): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/todo-queue/${encodeURIComponent(queueId)}/reject`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "拒绝待办请求失败");
    }

    return response.json();
};
