// 应用版本更新检查 API（UPD-001）
import { customFetch, getToken } from "./client";

// ── 类型 ──────────────────────────────────────────────────

export type AppPlatform = "android" | "ios" | "web" | "all";

export interface AppReleaseInfo {
    id: string;
    platform: AppPlatform;
    version: string;
    versionCode: number;
    downloadUrl: string;
    releaseNotes: string | null;
    forceUpdate: boolean;
    publishedAt: string;
}

export interface AppUpdateCheckResult {
    updateAvailable: boolean;
    latest: AppReleaseInfo | null;
}

// ── 方法 ──────────────────────────────────────────────────

/** 检查最新版本（登录后调用） */
export const checkAppUpdate = async (opts?: {
    platform?: AppPlatform;
    version?: string;
    versionCode?: number;
}): Promise<AppUpdateCheckResult> => {
    const params = new URLSearchParams();
    if (opts?.platform) params.set("platform", opts.platform);
    if (opts?.version) params.set("version", opts.version);
    if (opts?.versionCode != null)
        params.set("versionCode", String(opts.versionCode));

    const response = await customFetch(
        "/api/app/update?" + params.toString(),
        {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken()}` },
        },
    );
    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ error: "检查更新失败" }));
        throw new Error(error.error || "检查更新失败");
    }
    return response.json();
};
