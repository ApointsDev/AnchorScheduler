// 用户 CRUD 操作
import type { Database } from "sqlite";
import type { User } from "../../index";
import { mapRowToTask } from "./taskMapper";

export class UserStore {
    constructor(private db: Database) {}

    async addUser(user: User): Promise<void> {
        await this.db.run(
            `INSERT INTO users
           (id, email, name, XJTLUaccount, XJTLUPassword, passwordHash, JWTtoken, MStoken, MSRefreshToken, MSbinded,
            CalDavBaseUrl, CalDavUsername, CalDavPassword, CalDavPrincipalUrl, CalDavCalendarHome, CalDavCalendarUrl, CalDavSyncToken, CalDavEnabled, CalDavLastSyncAt,
            ExchangeAccessToken, ExchangeRefreshToken, ExchangeTokenExpiresAt, ExchangeBinded,
            ImapBinded, ImapEmail, ImapPassword, ImapHost, ImapPort, ImapTls, CAFSub, CAFAccessToken, CAFRefreshToken, CAFTokenExpiresAt, ebridgeBinded, timetableUrl, timetableFetchLevel, mailReadingSpan, conflictBoundaryInclusive, weekOffset, autoSchedulePromotions, stripReplyPrefix, onboardingCompleted)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user.id,
                user.email,
                user.name,
                user.XJTLUaccount,
                user.XJTLUPassword,
                user.passwordHash,
                user.JWTtoken,
                user.MStoken,
                user.MSRefreshToken,
                user.MSbinded ? 1 : 0,
                user.CalDavBaseUrl,
                user.CalDavUsername,
                user.CalDavPassword,
                user.CalDavPrincipalUrl,
                user.CalDavCalendarHome,
                user.CalDavCalendarUrl,
                user.CalDavSyncToken,
                user.CalDavEnabled ? 1 : 0,
                user.CalDavLastSyncAt,
                user.ExchangeAccessToken,
                user.ExchangeRefreshToken,
                user.ExchangeTokenExpiresAt,
                user.ExchangeBinded ? 1 : 0,
                user.ImapBinded ? 1 : 0,
                user.ImapEmail,
                user.ImapPassword,
                user.ImapHost,
                user.ImapPort,
                user.ImapTls ? 1 : 0,
                user.CAFSub,
                user.CAFAccessToken,
                user.CAFRefreshToken,
                user.CAFTokenExpiresAt,
                user.ebridgeBinded ? 1 : 0,
                user.timetableUrl,
                user.timetableFetchLevel || 0,
                user.mailReadingSpan ?? 30,
                user.conflictBoundaryInclusive ? 1 : 0,
                user.weekOffset || 0,
                user.autoSchedulePromotions ? 1 : 0,
                user.stripReplyPrefix !== false ? 1 : 0,
                user.onboardingCompleted ? 1 : 0,
            ],
        );
    }

    async updateUser(user: User): Promise<void> {
        await this.db.run(
            `UPDATE users
             SET email = ?, name = ?, XJTLUaccount = ?, XJTLUPassword = ?, passwordHash = ?,
                 JWTtoken = ?, MStoken = ?, MSRefreshToken = ?, MSbinded = ?,
                 ExchangeAccessToken = ?, ExchangeRefreshToken = ?, ExchangeTokenExpiresAt = ?, ExchangeBinded = ?,
                 ImapBinded = ?, ImapEmail = ?, ImapPassword = ?, ImapHost = ?, ImapPort = ?, ImapTls = ?,
                 CAFSub = ?, CAFAccessToken = ?, CAFRefreshToken = ?, CAFTokenExpiresAt = ?,
                 CalDavBaseUrl = ?, CalDavUsername = ?, CalDavPassword = ?, CalDavPrincipalUrl = ?,
                 CalDavCalendarHome = ?, CalDavCalendarUrl = ?, CalDavSyncToken = ?, CalDavEnabled = ?, CalDavServerEnabled = ?, CalDavLastSyncAt = ?,
                 ebridgeBinded = ?, timetableUrl = ?, timetableFetchLevel = ?, mailReadingSpan = ?, conflictBoundaryInclusive = ?, weekOffset = ?, autoSchedulePromotions = ?, stripReplyPrefix = ?, onboardingCompleted = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                user.email,
                user.name,
                user.XJTLUaccount,
                user.XJTLUPassword,
                user.passwordHash,
                user.JWTtoken,
                user.MStoken,
                user.MSRefreshToken,
                user.MSbinded ? 1 : 0,
                user.ExchangeAccessToken,
                user.ExchangeRefreshToken,
                user.ExchangeTokenExpiresAt,
                user.ExchangeBinded ? 1 : 0,
                user.ImapBinded ? 1 : 0,
                user.ImapEmail,
                user.ImapPassword,
                user.ImapHost,
                user.ImapPort,
                user.ImapTls ? 1 : 0,
                user.CAFSub,
                user.CAFAccessToken,
                user.CAFRefreshToken,
                user.CAFTokenExpiresAt,
                user.CalDavBaseUrl,
                user.CalDavUsername,
                user.CalDavPassword,
                user.CalDavPrincipalUrl,
                user.CalDavCalendarHome,
                user.CalDavCalendarUrl,
                user.CalDavSyncToken,
                user.CalDavEnabled ? 1 : 0,
                user.CalDavServerEnabled ? 1 : 0,
                user.CalDavLastSyncAt,
                user.ebridgeBinded ? 1 : 0,
                user.timetableUrl,
                user.timetableFetchLevel || 0,
                user.mailReadingSpan ?? 30,
                user.conflictBoundaryInclusive ? 1 : 0,
                user.weekOffset || 0,
                user.autoSchedulePromotions ? 1 : 0,
                user.stripReplyPrefix !== false ? 1 : 0,
                user.onboardingCompleted ? 1 : 0,
                user.id,
            ],
        );
    }

    async getUserById(id: string, getTasksByUserId: (uid: string) => Promise<any[]>): Promise<User | null> {
        const row: any = await this.db.get("SELECT * FROM users WHERE id = ?", [id]);
        if (!row) return null;
        const tasks = await getTasksByUserId(id);
        return this.mapRowToUser(row, tasks);
    }

    async getUserByEmail(email: string, getTasksByUserId: (uid: string) => Promise<any[]>): Promise<User | null> {
        const row: any = await this.db.get("SELECT * FROM users WHERE email = ?", [email]);
        if (!row) return null;
        const tasks = await getTasksByUserId(row.id);
        return this.mapRowToUser(row, tasks);
    }

    async getUserByCafSub(cafSub: string, getTasksByUserId: (uid: string) => Promise<any[]>): Promise<User | null> {
        const row: any = await this.db.get("SELECT * FROM users WHERE CAFSub = ?", [cafSub]);
        if (!row) return null;
        const tasks = await getTasksByUserId(row.id);
        return this.mapRowToUser(row, tasks);
    }

    async getAllUsers(getTasksByUserId: (uid: string) => Promise<any[]>): Promise<User[]> {
        const rows: any[] = await this.db.all("SELECT * FROM users");
        const users: User[] = [];
        for (const row of rows) {
            const tasks = await getTasksByUserId(row.id);
            users.push(this.mapRowToUser(row, tasks));
        }
        return users;
    }

    /**
     * SQL 层分页查询用户（用于管理后台列表）。
     * 不再一次性加载全部用户及其所有日程（原 N+1 方式在用户量大时极慢，
     * 导致翻页卡死）；taskCount 通过子查询统计。
     * 返回的用户对象不含 tasks（以 taskCount 字段代替，可由调用方使用）。
     */
    async getUsersPage(opts: {
        search?: string;
        limit: number;
        offset: number;
    }): Promise<{ users: User[]; total: number }> {
        const { search, limit, offset } = opts;
        const where: string[] = [];
        const params: unknown[] = [];
        if (search && search.trim()) {
            const q = `%${search.trim().toLowerCase()}%`;
            where.push(
                "(LOWER(email) LIKE ? OR LOWER(name) LIKE ? OR LOWER(id) LIKE ?)",
            );
            params.push(q, q, q);
        }
        const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";

        const countRow: any = await this.db.get(
            `SELECT COUNT(*) AS c FROM users${whereSql}`,
            params,
        );
        const total = Number(countRow?.c) || 0;

        const rows: any[] = await this.db.all(
            `SELECT u.*,
                (SELECT COUNT(*) FROM tasks t WHERE t.userId = u.id) AS taskCount
             FROM users u${whereSql}
             ORDER BY u.createdAt DESC, u.id
             LIMIT ? OFFSET ?`,
            [...params, limit, offset],
        );

        const users = rows.map((row: any) => {
            const user = this.mapRowToUser(row, []);
            (user as User & { taskCount?: number }).taskCount =
                Number(row.taskCount) || 0;
            return user;
        });
        return { users, total };
    }

    async updateUserHighEnergyPeriods(userId: string, periods: Record<number, any[]>): Promise<void> {
        await this.db.run("UPDATE users SET highEnergyPeriods = ? WHERE id = ?", [JSON.stringify(periods), userId]);
    }

    private mapRowToUser(row: any, tasks: any[]): User {
        return {
            id: row.id,
            email: row.email,
            name: row.name,
            XJTLUaccount: row.XJTLUaccount,
            XJTLUPassword: row.XJTLUPassword,
            passwordHash: row.passwordHash,
            JWTtoken: row.JWTtoken,
            MStoken: row.MStoken,
            MSRefreshToken: row.MSRefreshToken,
            MSbinded: row.MSbinded === 1,
            ExchangeAccessToken: row.ExchangeAccessToken,
            ExchangeRefreshToken: row.ExchangeRefreshToken,
            ExchangeTokenExpiresAt: row.ExchangeTokenExpiresAt,
            ExchangeBinded: row.ExchangeBinded === 1,
            ImapBinded: row.ImapBinded === 1,
            ImapEmail: row.ImapEmail,
            ImapPassword: row.ImapPassword,
            ImapHost: row.ImapHost,
            ImapPort: row.ImapPort,
            ImapTls: row.ImapTls === 1,
            CAFSub: row.CAFSub,
            CAFAccessToken: row.CAFAccessToken,
            CAFRefreshToken: row.CAFRefreshToken,
            CAFTokenExpiresAt: row.CAFTokenExpiresAt,
            CalDavBaseUrl: row.CalDavBaseUrl,
            CalDavUsername: row.CalDavUsername,
            CalDavPassword: row.CalDavPassword,
            CalDavPrincipalUrl: row.CalDavPrincipalUrl,
            CalDavCalendarHome: row.CalDavCalendarHome,
            CalDavCalendarUrl: row.CalDavCalendarUrl,
            CalDavSyncToken: row.CalDavSyncToken,
            CalDavEnabled: row.CalDavEnabled === 1,
            CalDavServerEnabled: row.CalDavServerEnabled === 1,
            CalDavLastSyncAt: row.CalDavLastSyncAt,
            ebridgeBinded: row.ebridgeBinded === 1,
            timetableUrl: row.timetableUrl || "",
            timetableFetchLevel: row.timetableFetchLevel || 0,
            mailReadingSpan: row.mailReadingSpan ?? 30,
            conflictBoundaryInclusive: row.conflictBoundaryInclusive === 1,
            weekOffset: row.weekOffset || 0,
            autoSchedulePromotions: row.autoSchedulePromotions === 1,
            stripReplyPrefix: row.stripReplyPrefix !== 0,
            onboardingCompleted: row.onboardingCompleted === 1,
            communityRegionId: row.communityRegionId || undefined,
            avatar: row.avatar || null,
            signature: row.signature ?? null,
            highEnergyPeriods: row.highEnergyPeriods ? JSON.parse(row.highEnergyPeriods) : {},
            ChaoxingBinded: row.ChaoxingBinded === 1,
            ChaoxingUsername: row.ChaoxingUsername || undefined,
            ChaoxingPassword: row.ChaoxingPassword || undefined,
            ChaoxingAccountId: row.ChaoxingAccountId || undefined,
            ChaoxingIntervalHours:
                row.ChaoxingIntervalHours != null
                    ? Number(row.ChaoxingIntervalHours)
                    : 24,
            ChaoxingPreferredHour:
                row.ChaoxingPreferredHour != null
                    ? Number(row.ChaoxingPreferredHour)
                    : 8,
            ChaoxingEnabled:
                row.ChaoxingEnabled === undefined || row.ChaoxingEnabled === null
                    ? true
                    : row.ChaoxingEnabled === 1,
            ChaoxingLastSyncAt: row.ChaoxingLastSyncAt || undefined,
            ChaoxingNextSyncAt: row.ChaoxingNextSyncAt || undefined,
            ChaoxingLastJobId: row.ChaoxingLastJobId || undefined,
            ChaoxingLastStatus: row.ChaoxingLastStatus || undefined,
            ChaoxingLastError: row.ChaoxingLastError || undefined,
            tasks: tasks.map(mapRowToTask),
            emsClient: undefined,
        };
    }

    /** 仅更新学习通相关字段，避免改动整行 UPDATE 的列清单 */
    async updateChaoxingFields(
        userId: string,
        fields: {
            ChaoxingBinded?: boolean;
            ChaoxingUsername?: string | null;
            ChaoxingPassword?: string | null;
            ChaoxingAccountId?: string | null;
            ChaoxingIntervalHours?: number;
            ChaoxingPreferredHour?: number;
            ChaoxingEnabled?: boolean;
            ChaoxingLastSyncAt?: string | null;
            ChaoxingNextSyncAt?: string | null;
            ChaoxingLastJobId?: string | null;
            ChaoxingLastStatus?: string | null;
            ChaoxingLastError?: string | null;
        },
    ): Promise<void> {
        const sets: string[] = [];
        const vals: any[] = [];
        const map: Array<[string, unknown]> = [
            ["ChaoxingBinded", fields.ChaoxingBinded === undefined ? undefined : fields.ChaoxingBinded ? 1 : 0],
            ["ChaoxingUsername", fields.ChaoxingUsername],
            ["ChaoxingPassword", fields.ChaoxingPassword],
            ["ChaoxingAccountId", fields.ChaoxingAccountId],
            ["ChaoxingIntervalHours", fields.ChaoxingIntervalHours],
            ["ChaoxingPreferredHour", fields.ChaoxingPreferredHour],
            ["ChaoxingEnabled", fields.ChaoxingEnabled === undefined ? undefined : fields.ChaoxingEnabled ? 1 : 0],
            ["ChaoxingLastSyncAt", fields.ChaoxingLastSyncAt],
            ["ChaoxingNextSyncAt", fields.ChaoxingNextSyncAt],
            ["ChaoxingLastJobId", fields.ChaoxingLastJobId],
            ["ChaoxingLastStatus", fields.ChaoxingLastStatus],
            ["ChaoxingLastError", fields.ChaoxingLastError],
        ];
        for (const [col, val] of map) {
            if (val !== undefined) {
                sets.push(`${col} = ?`);
                vals.push(val);
            }
        }
        if (sets.length === 0) return;
        sets.push("updatedAt = CURRENT_TIMESTAMP");
        vals.push(userId);
        await this.db.run(
            `UPDATE users SET ${sets.join(", ")} WHERE id = ?`,
            vals,
        );
    }

    /** 更新头像 URL/路径；传 null 清空 */
    async updateAvatar(userId: string, avatar: string | null): Promise<void> {
        await this.db.run(
            `UPDATE users SET avatar = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            [avatar, userId],
        );
    }

    /** 更新个人签名；传 null 或空串可清空（调用方决定） */
    async updateSignature(
        userId: string,
        signature: string | null,
    ): Promise<void> {
        await this.db.run(
            `UPDATE users SET signature = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
            [signature, userId],
        );
    }

    /**
     * 个人主页公开字段（不加载 tasks / 凭证 / 邮箱）
     */
    async getPublicProfile(userId: string): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        signature: string | null;
        communityRegionId: string | null;
    } | null> {
        const row: any = await this.db.get(
            `SELECT id, name, avatar, signature, communityRegionId
             FROM users WHERE id = ?`,
            [userId],
        );
        if (!row) return null;
        return {
            id: row.id,
            name: row.name || "",
            avatar: row.avatar || null,
            signature: row.signature ?? null,
            communityRegionId: row.communityRegionId || null,
        };
    }
}
