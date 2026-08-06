// 归档（ARC-001）领域错误 —— 供各 Store 与 archiveRoutes 共享
// 错误码与 HTTP 状态码约定见 docs/api/README.md（ARC-001）：
//   400 参数错误 / resource 不合法
//   403 无权限（归档官方组等）
//   404 数据不存在
//   409 数据未归档却调用永久删除 / 状态冲突

export class ArchiveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ArchiveError";
    }
}

/** 400：:resource 不合法 或 参数错误 */
export class ArchiveInvalidResourceError extends ArchiveError {
    constructor(message = "Invalid archive resource") {
        super(message);
        this.name = "ArchiveInvalidResourceError";
    }
}

/** 404：数据不存在或不属于当前用户 */
export class ArchiveNotFoundError extends ArchiveError {
    constructor(message = "Archived item not found") {
        super(message);
        this.name = "ArchiveNotFoundError";
    }
}

/** 403：无权限（如归档官方组） */
export class ArchiveForbiddenError extends ArchiveError {
    constructor(message = "Operation not allowed") {
        super(message);
        this.name = "ArchiveForbiddenError";
    }
}

/** 409：数据未归档却调用永久删除 / 状态冲突 */
export class ArchiveNotArchivedError extends ArchiveError {
    constructor(message = "Item is not archived") {
        super(message);
        this.name = "ArchiveNotArchivedError";
    }
}

/** 校验归档资源名（tasks / todos / tags），不合法时抛 ArchiveInvalidResourceError */
export function assertArchiveResource(
    resource: string,
): "tasks" | "todos" | "tags" {
    if (resource === "tasks" || resource === "todos" || resource === "tags") {
        return resource;
    }
    throw new ArchiveInvalidResourceError(
        `Invalid archive resource: ${resource}`,
    );
}
