// 日程任务（Tasks）：增删改查、冲突检测、批量创建、四象限、日程队列审批
import { getToken, customFetch } from "./client";

// 获取任务列表
export type ScheduleType =
    | "single"
    | "recurring_daily"
    | "recurring_weekly"
    | "recurring_weekly_by_week_number"
    | "recurring_daily_on_days";

export interface Task {
    id: string;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    dueDate: string;
    location?: string;
    completed: boolean;
    pushedToMSTodo: boolean;
    recurrenceRule?: string;
    parentTaskId?: string;
    importance?: "high" | "normal" | "low";
    scheduleType?: ScheduleType;
    quadrant?: "q1" | "q2" | "q3" | "q4";
    /** 四象限 · 重要程度轴 [-1, 1] */
    importanceScore?: number | null;
    /** 四象限 · 紧急程度轴 [-1, 1] */
    urgencyScore?: number | null;
}

export interface TasksResponse {
    tasks: Task[];
    total: number;
    limit: number;
    offset: number;
    sortBy: string;
    order: "asc" | "desc";
}

export class ScheduleConflictError extends Error {
    conflicts: Task[];
    constructor(message: string, conflicts: Task[]) {
        super(message);
        this.name = "ScheduleConflictError";
        this.conflicts = conflicts;
    }
}

export interface ConflictWarning {
    message: string;
    conflicts: Task[];
    instanceConflicts?: any[];
}

export interface CreateTaskResponse {
    task: Task;
    recurrenceSummary?: any;
    conflictWarning?: ConflictWarning;
}

export const createTask = async (
    taskData: Omit<Task, "id" | "completed">,
): Promise<CreateTaskResponse> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 && errorData.conflicts) {
            throw new ScheduleConflictError(
                errorData.error || "日程冲突",
                errorData.conflicts,
            );
        }
        throw new Error(errorData.error || "创建任务失败");
    }

    return await response.json();
};

export const updateTask = async (
    taskId: string,
    taskData: Partial<Omit<Task, "id">>,
): Promise<{ task: Task; axes: { importanceScore: number | null; urgencyScore: number | null; quadrant: string }; conflictWarning?: ConflictWarning }> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/tasks/${encodeURIComponent(taskId)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskData),
        },
    );

    if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 && errorData.conflicts) {
            throw new ScheduleConflictError(
                errorData.error || "日程冲突",
                errorData.conflicts,
            );
        }
        throw new Error(errorData.error || "更新任务失败");
    }

    return await response.json();
};

export interface BatchTaskResult {
    input: any;
    status: "created" | "conflict" | "error";
    task?: Task;
    conflictList?: Task[];
    errorMessage?: string;
}

export interface BatchTasksResponse {
    results: BatchTaskResult[];
    summary: {
        total: number;
        created: number;
        conflicts: number;
        errors: number;
    };
}

export const createTasksBatch = async (
    tasks: Omit<Task, "id" | "completed">[],
    boundaryConflict: boolean = false,
): Promise<BatchTasksResponse> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch("/api/tasks/batch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tasks, boundaryConflict }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "批量创建任务失败");
    }

    return await response.json();
};

export const getTasks = async (params: {
    start?: string;
    end?: string;
    limit?: number;
    q?: string;
    completed?: boolean;
    offset?: number;
    sortBy?: string;
    order?: "asc" | "desc";
}): Promise<TasksResponse> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const queryParams = new URLSearchParams();
    if (params.start) queryParams.append("start", params.start);
    if (params.end) queryParams.append("end", params.end);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.q) queryParams.append("q", params.q);
    if (params.completed !== undefined)
        queryParams.append("completed", params.completed.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);

    const response = await customFetch(`/api/tasks?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取任务失败");
    }

    return await response.json();
};

export const deleteTask = async (
    taskId: string,
    cascade: boolean = false,
): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const url = `/api/tasks/${encodeURIComponent(taskId)}${cascade ? "?cascade=true" : ""}`;

    const response = await customFetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "删除任务失败");
    }
};

// ── 日程队列审批 ──────────────────────────────────────────────

export interface ScheduleQueueItem {
    id: string;
    userId: string;
    rawRequest: string;
    status: string;
    createdAt: string;
}

export const approveQueueItem = async (
    queueId: string,
    options?: { allowConflict?: boolean },
): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/schedule-queue/${encodeURIComponent(queueId)}/approve`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: options ? JSON.stringify(options) : undefined,
        },
    );

    if (!response.ok) {
        const error = await response.json();
        if (response.status === 409 && error.conflicts) {
            throw new ScheduleConflictError(
                error.error || "日程冲突",
                error.conflicts,
            );
        }
        throw new Error(error.error || "批准请求失败");
    }

    return response.json();
};

export const rejectQueueItem = async (queueId: string): Promise<any> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(
        `/api/schedule-queue/${encodeURIComponent(queueId)}/reject`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "拒绝请求失败");
    }

    return response.json();
};

export const getScheduleQueue = async (): Promise<{
    queue: ScheduleQueueItem[];
}> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const response = await customFetch(`/api/schedule-queue`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "获取队列失败");
    }

    return response.json();
};
