// 应用版本更新配置存储服务（UPD-001）
//
// 模型：
// - app_releases：管理员配置的各平台版本发布信息。
//   客户端通过 GET /api/app/update?platform=xxx 获取 enabled 的最新一条；
//   管理员在 /admin 中增删改这些配置（版本号 + 外部下载源）。
//   platform: android / ios / web / all（all 表示全平台通用）

import type { Database } from "sqlite";
import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";

export const APP_PLATFORMS = ["android", "ios", "web", "all"] as const;

export type AppPlatform = (typeof APP_PLATFORMS)[number];

export interface AppRelease {
    id: string;
    platform: AppPlatform;
    version: string;
    versionCode: number;
    downloadUrl: string;
    releaseNotes: string | null;
    forceUpdate: boolean;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AppReleaseInput {
    platform: AppPlatform;
    version: string;
    versionCode?: number;
    downloadUrl: string;
    releaseNotes?: string | null;
    forceUpdate?: boolean;
    enabled?: boolean;
}

interface AppReleaseRow {
    id: string;
    platform: AppPlatform;
    version: string;
    versionCode: number;
    downloadUrl: string;
    releaseNotes: string | null;
    forceUpdate: number;
    enabled: number;
    createdAt: string;
    updatedAt: string;
}

function mapRow(row: AppReleaseRow): AppRelease {
    return {
        id: row.id,
        platform: row.platform,
        version: row.version,
        versionCode: row.versionCode,
        downloadUrl: row.downloadUrl,
        releaseNotes: row.releaseNotes,
        forceUpdate: !!row.forceUpdate,
        enabled: !!row.enabled,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

function parsePlatform(p: string): AppPlatform {
    return (APP_PLATFORMS as readonly string[]).includes(p)
        ? (p as AppPlatform)
        : "all";
}

export class AppUpdateStore {
    constructor(private db: Database) {}

    /** 获取最新启用的发布版本（优先精确平台，其次 all） */
    async getLatest(platform: string = "all"): Promise<AppRelease | null> {
        const rows = await this.db.all<AppReleaseRow[]>(
            `SELECT * FROM app_releases
             WHERE enabled = 1 AND (platform = ? OR platform = 'all')
             ORDER BY (platform = ?) DESC, versionCode DESC, createdAt DESC
             LIMIT 1`,
            [parsePlatform(platform), parsePlatform(platform)],
        );
        return rows.length ? mapRow(rows[0]) : null;
    }

    /** 管理员：全部发布配置列表 */
    async list(): Promise<AppRelease[]> {
        const rows = await this.db.all<AppReleaseRow[]>(
            `SELECT * FROM app_releases ORDER BY platform, versionCode DESC`,
        );
        return rows.map(mapRow);
    }

    async getById(id: string): Promise<AppRelease | null> {
        const row = await this.db.get<AppReleaseRow>(
            "SELECT * FROM app_releases WHERE id = ?",
            [id],
        );
        return row ? mapRow(row) : null;
    }

    /** 管理员：新增发布配置（id 存在则更新） */
    async upsert(input: AppReleaseInput & { id?: string }): Promise<AppRelease> {
        const id = input.id || uuidv4();
        const now = toShanghaiISO();
        const platform = parsePlatform(input.platform);
        const existing = await this.getById(id);

        if (existing) {
            await this.db.run(
                `UPDATE app_releases SET
                    platform = ?, version = ?, versionCode = ?, downloadUrl = ?,
                    releaseNotes = ?, forceUpdate = ?, enabled = ?, updatedAt = ?
                 WHERE id = ?`,
                [
                    platform,
                    input.version,
                    input.versionCode ?? existing.versionCode,
                    input.downloadUrl,
                    input.releaseNotes ?? existing.releaseNotes,
                    input.forceUpdate ? 1 : 0,
                    input.enabled === false ? 0 : 1,
                    now,
                    id,
                ],
            );
        } else {
            await this.db.run(
                `INSERT INTO app_releases
                    (id, platform, version, versionCode, downloadUrl, releaseNotes,
                     forceUpdate, enabled, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    platform,
                    input.version,
                    input.versionCode ?? 0,
                    input.downloadUrl,
                    input.releaseNotes || null,
                    input.forceUpdate ? 1 : 0,
                    input.enabled === false ? 0 : 1,
                    now,
                    now,
                ],
            );
        }
        return (await this.getById(id))!;
    }

    async setEnabled(id: string, enabled: boolean): Promise<AppRelease | null> {
        await this.db.run(
            `UPDATE app_releases SET enabled = ?, updatedAt = ? WHERE id = ?`,
            [enabled ? 1 : 0, toShanghaiISO(), id],
        );
        return this.getById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db.run(
            "DELETE FROM app_releases WHERE id = ?",
            [id],
        );
        return (result?.changes ?? 0) > 0;
    }
}
