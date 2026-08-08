// DA 纯函数 / 常量 — 不依赖 dbService，便于单元测试直接导入
import type { EmailForProcessing } from "./emailProcessor";

/** DA 系统账号邮箱域 */
export const DA_ACCOUNT_DOMAIN =
    process.env.DA_ACCOUNT_DOMAIN || "apoints.cn";

/** 每校 da_settings 默认值（页面配置 + 邮箱配置 + 学生贡献） */
export const DEFAULT_SETTINGS: Record<string, string> = {
    pageTitle: "",
    pageIntro: "",
    pageContact: "",
    // 学生贡献
    studentContributionEnabled: "0",
    collegeDomains: "",
    eventKeywords:
        "讲座,宣讲,招聘,比赛,活动,论坛,研讨会,毕业,开学,考试,报名,workshop,lecture,seminar,event,career,campus,information session",
    // DA 团队邮箱（IMAP）
    mailEnabled: "0",
    mailHost: "",
    mailPort: "993",
    mailTls: "1",
    mailUsername: "",
    mailPassword: "",
};

/** 系统管理员：现有 ADMIN_EMAILS（每次调用读取 env，便于测试注入） */
export function isSystemAdmin(email: string): boolean {
    const list = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    if (list.length === 0) return false;
    return list.includes((email || "").toLowerCase());
}

/** 按 slug 构造 DA 系统账号邮箱（如 da-xjtlu@apoints.cn） */
export function daAccountEmailFor(slug: string): string {
    return `da-${slug}@${DA_ACCOUNT_DOMAIN}`;
}

/** 轻量启发式（独立导出便于测试）：发件域∈学院白名单 或 主题含事件关键词 */
export function isSchoolWideCandidate(
    email: EmailForProcessing,
    settings: Record<string, string>,
): boolean {
    const senderAddr = (email.from?.address || "").toLowerCase();
    const senderDomain = senderAddr.split("@")[1] || "";
    const colleges = (settings.collegeDomains || "")
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);
    if (colleges.length > 0 && colleges.includes(senderDomain)) return true;

    const subject = (email.subject || "").toLowerCase();
    const keywords = (
        settings.eventKeywords || DEFAULT_SETTINGS.eventKeywords
    )
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
    return keywords.some((k) => subject.includes(k));
}
