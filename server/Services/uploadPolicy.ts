// 文件上传（日程附件存档）策略层 —— 纯逻辑，便于单元测试
// 不含任何 Node 内置模块 / IO 依赖，路由层从此导入并执行实际读写。

/** 附件子目录（相对 process.cwd()，与头像的 avatars 平级） */
export const ATTACHMENT_SUBDIR = "private/uploads/schedule-attachments";

/** 文件名前缀，用于区分归属用户与校验删除权限 */
export const ATTACHMENT_PREFIX = "sched-";

/** 单文件大小上限：20MB */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

/**
 * MIME → 扩展名 白名单。
 * 只允许文档 / 图片 / 压缩包等“存档类”文件；
 * 拒绝 HTML/JS/SVG/XML/可执行文件等，避免经 /uploads 静态服务被当作脚本执行或注入。
 */
const MIME_EXT_MAP: Record<string, string> = {
    // 文档
    "application/pdf": ".pdf",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        ".docx",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        ".xlsx",
    "application/vnd.ms-powerpoint": ".ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        ".pptx",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "text/csv": ".csv",
    "application/json": ".json",
    // 图片
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/bmp": ".bmp",
    // 压缩包
    "application/zip": ".zip",
    "application/x-rar-compressed": ".rar",
    "application/x-7z-compressed": ".7z",
    "application/x-tar": ".tar",
    "application/gzip": ".gz",
};

/** 白名单只读导出（供路由与测试使用） */
export const ALLOWED_MIME_EXT_MAP: Readonly<Record<string, string>> =
    MIME_EXT_MAP;

/** 根据 MIME 返回安全扩展名；白名单外返回 null */
export function extForMime(mime: string): string | null {
    return MIME_EXT_MAP[mime] ?? null;
}

/**
 * 校验文件名是否为当前用户上传的附件（防路径穿越 / 越权删除）。
 * 不依赖 path 模块，纯字符串判断以保证可移植可测试。
 */
export function isOwnedAttachmentFilename(
    userId: string,
    filename: string,
): boolean {
    if (!filename) return false;
    if (filename.includes("/") || filename.includes("\\")) return false;
    if (filename.includes("..")) return false;
    return filename.startsWith(`${ATTACHMENT_PREFIX}${userId}-`);
}
