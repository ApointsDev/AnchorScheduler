// 待办（Todo）与标签（Tag）API 类型
// 注意：这些类型仅用于编译期约束，不参与运行时校验
import type { Todo, Tag } from "../index";

export interface TodoCreateRequest {
    name: string;
    description?: string;
    completed?: boolean;
    dueDate?: string;
    importance?: "high" | "normal" | "low";
    /** 四象限重要程度轴 [-1, 1] */
    importanceScore?: number;
    /** 四象限紧急程度轴 [-1, 1] */
    urgencyScore?: number;
    tagIds?: string[];
    tagNames?: string[];
}

export interface TodoUpdateRequest {
    name?: string;
    description?: string | null;
    completed?: boolean;
    dueDate?: string | null;
    importance?: "high" | "normal" | "low";
    importanceScore?: number | null;
    urgencyScore?: number | null;
    tagIds?: string[];
    tagNames?: string[];
}

/** 单独调整四象限双轴 */
export interface PriorityAxesUpdateRequest {
    importanceScore?: number | null;
    urgencyScore?: number | null;
}

export interface TodoResponse {
    todo: Todo;
}

export interface TodoListResponse {
    todos: Todo[];
    total: number;
    limit: number;
    offset: number;
}

export interface TagCreateRequest {
    name: string;
    color?: string;
}

export interface TagUpdateRequest {
    name?: string;
    color?: string | null;
}

export interface TagResponse {
    tag: Tag;
}

export interface TagListResponse {
    tags: Tag[];
}
