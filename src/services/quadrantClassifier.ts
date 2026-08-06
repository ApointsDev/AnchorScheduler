/**
 * 四象限分类服务 —— 封装 LLM 调用，低耦合、可复用
 *
 * 职责：
 * - 接收未分类的日程列表
 * - 通过服务端 LLM 进行艾森豪威尔矩阵分类
 * - 返回分类结果，由调用方决定如何持久化
 */

import { getToken, customFetch } from "./api";
import type { Task } from "./api";

export interface QuadrantResult {
    taskId: string;
    quadrant: "q1" | "q2" | "q3" | "q4";
}

/**
 * 对一批日程进行四象限分类
 * @param tasks 待分类任务（id 和基本字段必须存在）
 * @returns 分类结果列表
 */
export async function classifyQuadrants(
    tasks: Pick<
        Task,
        | "id"
        | "name"
        | "description"
        | "startTime"
        | "dueDate"
        | "importance"
        | "completed"
    >[],
): Promise<QuadrantResult[]> {
    if (!tasks || tasks.length === 0) return [];

    const token = getToken();
    if (!token) throw new Error("用户未登录");

    const taskIds = tasks.map((t) => t.id);

    console.log(
        `[QuadrantClassifier] 开始分类 ${tasks.length} 个日程:`,
        tasks.map((t) => ({ id: t.id, name: t.name })),
    );
    const startTime = Date.now();

    const response = await customFetch("/api/tasks/classify-quadrants", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskIds }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(
            `[QuadrantClassifier] 分类失败 (${Date.now() - startTime}ms):`,
            error,
        );
        throw new Error(error.error || "四象限分类失败");
    }

    const data = await response.json();
    const results: QuadrantResult[] = data.classifications || [];

    console.log(
        `[QuadrantClassifier] 分类完成 (${Date.now() - startTime}ms):`,
        results,
    );

    return results;
}

/**
 * 将分类结果合并到任务列表中
 * 纯函数，不产生副作用
 */
export function applyQuadrants(
    tasks: Task[],
    results: QuadrantResult[],
): Task[] {
    const map = new Map(results.map((r) => [r.taskId, r.quadrant]));
    return tasks.map((task) => ({
        ...task,
        quadrant: map.get(task.id) ?? task.quadrant,
    }));
}
