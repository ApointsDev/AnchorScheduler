// 用户关注关系 — followerId 关注 followedId
import type { Database } from "sqlite";

export interface FollowEntry {
    followerId: string;
    followedId: string;
    createdAt: string;
}

/** 关注/粉丝列表中的用户公开信息 */
export interface FollowUserInfo {
    id: string;
    name: string;
    avatar: string | null;
    signature: string | null;
}

export interface FollowListResult {
    users: FollowUserInfo[];
    total: number;
}

export class FollowStore {
    constructor(private db: Database) {}

    /** 关注用户（幂等：已关注则返回 false） */
    async follow(followerId: string, followedId: string): Promise<boolean> {
        if (followerId === followedId) return false;
        try {
            await this.db.run(
                `INSERT INTO user_follows (followerId, followedId) VALUES (?, ?)`,
                [followerId, followedId],
            );
            return true;
        } catch (e: any) {
            // PRIMARY KEY 冲突 → 已关注
            if (e.message?.includes("UNIQUE constraint") || e.code === "SQLITE_CONSTRAINT") {
                return false;
            }
            throw e;
        }
    }

    /** 取消关注 */
    async unfollow(followerId: string, followedId: string): Promise<boolean> {
        const result: any = await this.db.run(
            `DELETE FROM user_follows WHERE followerId = ? AND followedId = ?`,
            [followerId, followedId],
        );
        return (result?.changes || 0) > 0;
    }

    /** 检查是否已关注 */
    async isFollowing(followerId: string, followedId: string): Promise<boolean> {
        const row = await this.db.get(
            `SELECT 1 FROM user_follows WHERE followerId = ? AND followedId = ?`,
            [followerId, followedId],
        );
        return !!row;
    }

    /** 获取关注数 */
    async getFollowingCount(userId: string): Promise<number> {
        const row: any = await this.db.get(
            `SELECT COUNT(*) as cnt FROM user_follows WHERE followerId = ?`,
            [userId],
        );
        return row ? row.cnt || 0 : 0;
    }

    /** 获取粉丝数 */
    async getFollowerCount(userId: string): Promise<number> {
        const row: any = await this.db.get(
            `SELECT COUNT(*) as cnt FROM user_follows WHERE followedId = ?`,
            [userId],
        );
        return row ? row.cnt || 0 : 0;
    }

    /** 获取关注的用户列表（分页），附带公开资料 */
    async getFollowing(
        userId: string,
        limit: number = 50,
        offset: number = 0,
    ): Promise<FollowListResult> {
        const countRow: any = await this.db.get(
            `SELECT COUNT(*) as cnt FROM user_follows WHERE followerId = ?`,
            [userId],
        );
        const total = countRow ? countRow.cnt || 0 : 0;
        const rows = await this.db.all(
            `SELECT u.id, u.name, u.avatar, u.signature
             FROM user_follows f
             JOIN users u ON u.id = f.followedId
             WHERE f.followerId = ?
             ORDER BY f.createdAt DESC
             LIMIT ? OFFSET ?`,
            [userId, limit, offset],
        );
        return {
            users: rows.map(mapFollowUserRow),
            total,
        };
    }

    /** 获取粉丝列表（分页），附带公开资料 */
    async getFollowers(
        userId: string,
        limit: number = 50,
        offset: number = 0,
    ): Promise<FollowListResult> {
        const countRow: any = await this.db.get(
            `SELECT COUNT(*) as cnt FROM user_follows WHERE followedId = ?`,
            [userId],
        );
        const total = countRow ? countRow.cnt || 0 : 0;
        const rows = await this.db.all(
            `SELECT u.id, u.name, u.avatar, u.signature
             FROM user_follows f
             JOIN users u ON u.id = f.followerId
             WHERE f.followedId = ?
             ORDER BY f.createdAt DESC
             LIMIT ? OFFSET ?`,
            [userId, limit, offset],
        );
        return {
            users: rows.map(mapFollowUserRow),
            total,
        };
    }
}

function mapFollowUserRow(row: any): FollowUserInfo {
    return {
        id: row.id,
        name: row.name || "",
        avatar: row.avatar || null,
        signature: row.signature ?? null,
    };
}
