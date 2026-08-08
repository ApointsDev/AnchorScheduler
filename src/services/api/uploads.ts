// 文件上传（日程附件存档）
import { getToken, customFetch } from "./client";

export interface UploadedFile {
    url: string;
    name: string;
    size: number;
    mimeType?: string;
    uploadedAt?: string;
}

export interface UploadListResponse {
    files: UploadedFile[];
}

/** 上传文件（日程附件），返回可写入 task.attachments 的 URL */
export const uploadAttachment = async (
    file: File,
): Promise<UploadedFile> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const form = new FormData();
    form.append("file", file);
    const response = await customFetch("/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "上传失败");
    }
    return response.json();
};

/** 列出当前用户上传的全部附件 */
export const listUploads = async (): Promise<UploadedFile[]> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch("/api/uploads", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "获取附件列表失败");
    }
    const data: UploadListResponse = await response.json();
    return data.files;
};

/** 删除指定附件（filename 为文件名，不含目录） */
export const deleteUpload = async (filename: string): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error("用户未登录");
    const response = await customFetch(
        `/api/uploads/${encodeURIComponent(filename)}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        },
    );
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "删除附件失败");
    }
};
