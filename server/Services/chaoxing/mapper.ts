/**
 * 爬虫结果 → 统一条目；有 start_at → 日程，无 → 待办
 */
import { createHash } from "crypto";

export type ChaoxingKind = "work" | "exam" | "notice";
export type ChaoxingTarget = "task" | "todo";

export interface NormalizedChaoxingItem {
    remoteKey: string;
    kind: ChaoxingKind;
    target: ChaoxingTarget;
    name: string;
    description: string;
    startAt: string | null;
    endAt: string | null;
    completed: boolean;
    fingerprint: string;
    courseName?: string;
    statusText?: string | null;
    url?: string | null;
}

function normTitle(s: string): string {
    return String(s || "")
        .trim()
        .replace(/\s+/g, " ");
}

function hasStart(startAt: unknown): startAt is string {
    if (startAt == null || startAt === "") return false;
    const t = Date.parse(String(startAt));
    return !Number.isNaN(t);
}

const COMPLETED_RE =
    /已完成|已交|已提交|已互评|已批阅|待批阅|已过期|已结束|完成/;

export function isCompletedStatus(statusText?: string | null): boolean {
    if (!statusText) return false;
    // 未交 / 未完成 优先
    if (/未交|未完成|待互评|进行中/.test(statusText)) return false;
    return COMPLETED_RE.test(statusText);
}

export function remoteKeyForWork(
    courseId: string,
    classId: string,
    taskId: string | null | undefined,
    title: string,
): string {
    const id = taskId || normTitle(title);
    return `work:${courseId || ""}:${classId || ""}:${id}`;
}

export function remoteKeyForExam(
    courseId: string,
    classId: string,
    taskId: string | null | undefined,
    title: string,
): string {
    const id = taskId || normTitle(title);
    return `exam:${courseId || ""}:${classId || ""}:${id}`;
}

export function remoteKeyForNotice(noticeId: string): string {
    return `notice:${noticeId}`;
}

function fingerprint(parts: Record<string, unknown>): string {
    return createHash("sha1")
        .update(JSON.stringify(parts))
        .digest("hex")
        .slice(0, 16);
}

function buildName(prefix: string, courseName: string | undefined, title: string): string {
    const t = normTitle(title) || "未命名";
    const c = courseName ? normTitle(courseName) : "";
    if (c) return `[${prefix}][${c}] ${t}`;
    return `[${prefix}] ${t}`;
}

function buildDesc(opts: {
    courseName?: string;
    statusText?: string | null;
    url?: string | null;
    extra?: string | null;
}): string {
    const lines: string[] = ["来源：学习通"];
    if (opts.courseName) lines.push(`课程：${opts.courseName}`);
    if (opts.statusText) lines.push(`状态：${opts.statusText}`);
    if (opts.url) lines.push(`链接：${opts.url}`);
    if (opts.extra) lines.push(opts.extra);
    return lines.join("\n");
}

function toItem(opts: {
    kind: ChaoxingKind;
    remoteKey: string;
    name: string;
    description: string;
    startAt: string | null;
    endAt: string | null;
    statusText?: string | null;
    courseName?: string;
    url?: string | null;
}): NormalizedChaoxingItem {
    const target: ChaoxingTarget = hasStart(opts.startAt) ? "task" : "todo";
    return {
        remoteKey: opts.remoteKey,
        kind: opts.kind,
        target,
        name: opts.name,
        description: opts.description,
        startAt: opts.startAt,
        endAt: opts.endAt,
        completed: isCompletedStatus(opts.statusText),
        fingerprint: fingerprint({
            name: opts.name,
            start: opts.startAt,
            end: opts.endAt,
            status: opts.statusText,
            target,
        }),
        courseName: opts.courseName,
        statusText: opts.statusText,
        url: opts.url,
    };
}

/** 从爬虫 result JSON 抽出全部可同步条目 */
export function mapCrawlResultToItems(result: any): NormalizedChaoxingItem[] {
    const items: NormalizedChaoxingItem[] = [];
    const courses = Array.isArray(result?.courses) ? result.courses : [];

    for (const block of courses) {
        const course = block?.course || {};
        const courseId = String(course.course_id || "");
        const classId = String(course.class_id || "");
        const courseName = course.name ? String(course.name) : undefined;

        for (const w of block?.works || []) {
            const title = String(w.title || "作业");
            const startAt = w.start_at ? String(w.start_at) : null;
            const endAt = w.end_at ? String(w.end_at) : null;
            items.push(
                toItem({
                    kind: "work",
                    remoteKey: remoteKeyForWork(
                        courseId,
                        classId,
                        w.task_id,
                        title,
                    ),
                    name: buildName("作业", courseName, title),
                    description: buildDesc({
                        courseName,
                        statusText: w.status_text,
                        url: w.url,
                    }),
                    startAt,
                    endAt,
                    statusText: w.status_text,
                    courseName,
                    url: w.url,
                }),
            );
        }

        for (const e of block?.exams || []) {
            const title = String(e.title || "考试");
            const startAt = e.start_at ? String(e.start_at) : null;
            const endAt = e.end_at ? String(e.end_at) : null;
            items.push(
                toItem({
                    kind: "exam",
                    remoteKey: remoteKeyForExam(
                        courseId,
                        classId,
                        e.task_id,
                        title,
                    ),
                    name: buildName("考试", courseName, title),
                    description: buildDesc({
                        courseName,
                        statusText: e.status_text,
                        url: e.url,
                    }),
                    startAt,
                    endAt,
                    statusText: e.status_text,
                    courseName,
                    url: e.url,
                }),
            );
        }
    }

    for (const n of result?.notices || []) {
        const noticeId = String(n.notice_id || normTitle(n.title || "") || "unknown");
        const title = String(n.title || "通知");
        const task = n.task;
        let startAt: string | null = null;
        let endAt: string | null = null;
        let url: string | null = n.url || null;
        let statusText: string | null = null;
        if (task) {
            startAt = task.start_at ? String(task.start_at) : null;
            endAt = task.end_at ? String(task.end_at) : null;
            url = task.url || url;
            statusText = task.status_text || null;
        }
        // notice 本身无 start；仅当内嵌 task 有 start 才进日程
        if (!startAt && n.sent_at && !endAt) {
            // 无截止时不把 sent_at 当 start
            endAt = null;
        }
        const courseName = n.course_name ? String(n.course_name) : undefined;
        items.push(
            toItem({
                kind: "notice",
                remoteKey: remoteKeyForNotice(noticeId),
                name: buildName("通知", courseName, title),
                description: buildDesc({
                    courseName,
                    statusText,
                    url,
                    extra: n.content
                        ? String(n.content).slice(0, 500)
                        : null,
                }),
                startAt,
                endAt: endAt || (n.sent_at ? String(n.sent_at) : null),
                statusText,
                courseName,
                url,
            }),
        );
    }

    return items;
}

export function stableTaskId(userId: string, remoteKey: string): string {
    const h = createHash("sha1")
        .update(`${userId}:${remoteKey}`)
        .digest("hex")
        .slice(0, 24);
    return `chaoxing_${h}`;
}

export function defaultEndFromStart(startIso: string): string {
    const t = Date.parse(startIso);
    if (Number.isNaN(t)) return startIso;
    return new Date(t + 60 * 60 * 1000).toISOString();
}
