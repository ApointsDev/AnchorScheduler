/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * CalDAV Server Core
 * Implements CalDAV (RFC 4791) and WebDAV (RFC 4918) protocol handling.
 * Translates CalDAV operations to the local task storage via dbService.
 *
 * URL structure:
 *   /caldav/                              - Server root (redirects to principal)
 *   /caldav/principals/{userId}/          - Principal resource
 *   /caldav/calendars/{userId}/           - Calendar home set
 *   /caldav/calendars/{userId}/default/   - Default calendar collection
 *   /caldav/calendars/{userId}/default/{uid}.ics - Individual event resources
 */

import { v4 as uuidv4 } from "uuid";
import { dbService } from "../dbService.js";
import { buildIcs, parseIcsEvent } from "./icsUtils.js";
import { parseRecurrenceRuleInput, resolveScheduleType } from "../types.js";
import type { User, Task } from "../../index.js";
import type { CalendarEvent } from "./types.js";

// ── XML namespaces ─────────────────────────────────────────────────

const NS = {
    DAV: "DAV:",
    CALDAV: "urn:ietf:params:xml:ns:caldav",
    CS: "http://calendarserver.org/ns/",
    ICAL: "http://apple.com/ns/ical/",
} as const;

// ── Types ──────────────────────────────────────────────────────────

export interface CalDavServerConfig {
    /** External base URL for this CalDAV server (e.g. https://example.com/caldav) */
    baseUrl: string;
    /** Client compatibility profile */
    clientProfile?:
        | "auto"
        | "apple"
        | "thunderbird"
        | "davx5"
        | "outlook"
        | "generic";
}

export interface CalDavRequestContext {
    user: User;
    method: string;
    path: string;
    depth: string;
    /** Parsed XML body (for REPORT etc.) or raw body */
    body: string;
}

export interface CalDavResponse {
    status: number;
    headers: Record<string, string>;
    body?: string;
}

// ── Path helpers ───────────────────────────────────────────────────

function pathSegments(path: string): string[] {
    return path
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .filter(Boolean);
}

/**
 * Parse CalDAV path to determine resource type and extract IDs.
 * Paths under /caldav/...
 */
export function parseCalDavPath(path: string): {
    type: "root" | "principal" | "calendar-home" | "calendar" | "event";
    userId?: string;
    calendarId?: string;
    eventUid?: string;
} {
    const segs = pathSegments(path);
    // Remove the leading "caldav" prefix if present
    let idx = 0;

    // Path may start with "caldav" or not (depending on mount prefix)
    if (segs[0] === "caldav") idx++;

    if (idx >= segs.length) return { type: "root" };

    const first = segs[idx];

    if (first === "principals" && segs[idx + 1]) {
        return { type: "principal", userId: segs[idx + 1] };
    }

    if (first === "calendars" && segs[idx + 1]) {
        const userId = segs[idx + 1];
        const calendarId = segs[idx + 2];
        const eventUid = segs[idx + 3];

        if (!calendarId) {
            return { type: "calendar-home", userId };
        }
        if (!eventUid) {
            return { type: "calendar", userId, calendarId };
        }
        // Strip .ics extension if present
        const uid = eventUid.replace(/\.ics$/i, "");
        return { type: "event", userId, calendarId, eventUid: uid };
    }

    // Fallback: treat first segment after caldav as userId
    if (first) {
        return { type: "principal", userId: first };
    }

    return { type: "root" };
}

function buildResourceUrl(config: CalDavServerConfig, parts: string[]): string {
    const base = config.baseUrl.replace(/\/+$/, "");
    return [base, ...parts].join("/");
}

// ── XML builders ───────────────────────────────────────────────────

function xmlHeader(): string {
    return '<?xml version="1.0" encoding="UTF-8"?>\n';
}

function xmlTag(
    name: string,
    content?: string,
    attrs?: Record<string, string>,
): string {
    const attrStr = attrs
        ? " " +
          Object.entries(attrs)
              .map(([k, v]) => `${k}="${xmlEscape(v)}"`)
              .join(" ")
        : "";
    if (content === undefined) return `<${name}${attrStr}/>`;
    return `<${name}${attrStr}>${content}</${name}>`;
}

function xmlEscape(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function buildPropstat(props: string, status: string): string {
    return xmlTag(
        "D:propstat",
        xmlTag("D:prop", props) + xmlTag("D:status", status),
    );
}

function buildResponse(
    href: string,
    propstats: string,
    statusOverride?: string,
): string {
    if (statusOverride) {
        return xmlTag(
            "D:response",
            xmlTag("D:href", xmlEscape(href)) +
                xmlTag("D:status", statusOverride),
        );
    }
    return xmlTag("D:response", xmlTag("D:href", xmlEscape(href)) + propstats);
}

// ── PROPFIND response builders ─────────────────────────────────────

function buildPrincipalProps(user: User, config: CalDavServerConfig): string {
    const principalUrl = buildResourceUrl(config, ["principals", user.id]);
    const calendarHomeUrl = buildResourceUrl(config, ["calendars", user.id]);
    const displayName = user.name || user.email;

    return [
        xmlTag(
            "D:resourcetype",
            xmlTag("D:principal") + xmlTag("D:collection"),
        ),
        xmlTag("D:displayname", xmlEscape(displayName)),
        xmlTag(
            "C:calendar-home-set",
            xmlTag("D:href", xmlEscape(calendarHomeUrl + "/")),
        ),
        xmlTag(
            "C:calendar-user-address-set",
            xmlTag("D:href", xmlEscape("mailto:" + user.email)),
        ),
    ].join("");
}

function buildCalendarHomeProps(
    user: User,
    config: CalDavServerConfig,
): string {
    return [
        xmlTag("D:resourcetype", xmlTag("D:collection")),
        xmlTag(
            "D:displayname",
            xmlEscape(`Calendars of ${user.name || user.email}`),
        ),
    ].join("");
}

function buildCalendarProps(
    user: User,
    config: CalDavServerConfig,
    calendarId: string,
): string {
    const calendarUrl = buildResourceUrl(config, [
        "calendars",
        user.id,
        calendarId,
    ]);
    const displayName =
        calendarId === "default" ? "Default Calendar" : calendarId;

    return [
        xmlTag("D:resourcetype", xmlTag("D:collection") + xmlTag("C:calendar")),
        xmlTag("D:displayname", xmlEscape(displayName)),
        xmlTag(
            "C:supported-calendar-component-set",
            xmlTag("C:comp", "", { name: "VEVENT" }) +
                xmlTag("C:comp", "", { name: "VTODO" }),
        ),
        xmlTag("CS:getctag", `"${uuidv4()}"`),
    ].join("");
}

function buildEventProps(task: Task): string {
    const etag = `"${task.id}-${task.startTime}-${task.endTime}"`.replace(
        /[^ -~]/g,
        "",
    );
    const contentType = "text/calendar; charset=utf-8";
    const resourceType = xmlTag("D:resourcetype", "");

    return [
        resourceType,
        xmlTag("D:displayname", xmlEscape(task.name || "Untitled")),
        xmlTag("D:getcontenttype", contentType),
        xmlTag("D:getetag", etag),
    ].join("");
}

// ── XML parser (lightweight) ───────────────────────────────────────

function extractXmlTag(xml: string, tagName: string): string | null {
    // Match both prefixed and unprefixed tags
    const patterns = [
        new RegExp(
            `<[^>]*:${tagName}[^>]*>([\\s\\S]*?)</[^>]*:${tagName}>`,
            "i",
        ),
        new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i"),
    ];
    for (const re of patterns) {
        const m = re.exec(xml);
        if (m) return m[1].trim();
    }
    return null;
}

function extractAllXmlTags(xml: string, tagName: string): string[] {
    const results: string[] = [];
    const patterns = [
        new RegExp(
            `<[^>]*:${tagName}[^>]*>([\\s\\S]*?)</[^>]*:${tagName}>`,
            "gi",
        ),
        new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "gi"),
    ];
    for (const re of patterns) {
        let m;
        while ((m = re.exec(xml)) !== null) {
            results.push(m[1].trim());
        }
        if (results.length > 0) break;
    }
    return results;
}

function extractHref(xml: string): string | null {
    const href = extractXmlTag(xml, "href");
    return href
        ? href
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
        : null;
}

function extractPropNames(xml: string): string[] {
    const propSection = extractXmlTag(xml, "prop");
    if (!propSection) return [];
    // Extract XML tag names from the prop section
    const tagRe = /<([^/\s>]+)[^>]*\/?>/g;
    const names: string[] = [];
    let m;
    while ((m = tagRe.exec(propSection)) !== null) {
        const localName = m[1].replace(/^[^:]*:/, "");
        names.push(localName);
    }
    return [...new Set(names)];
}

// ── REPORT parser ──────────────────────────────────────────────────

interface CalendarQuery {
    timeRange?: { start: string; end: string };
    filterUid?: string;
}

function parseCalendarQuery(xml: string): CalendarQuery {
    const query: CalendarQuery = {};

    const timeRangeXml = extractXmlTag(xml, "time-range");
    if (timeRangeXml) {
        const start = timeRangeXml.match(/start="([^"]*)"/)?.[1];
        const end = timeRangeXml.match(/end="([^"]*)"/)?.[1];
        if (start) query.timeRange = { start, end: end || "99991231T235959Z" };
    }

    const uidXml = extractXmlTag(xml, "text-match");
    // Actually for UID filter we look at comp-filter for VEVENT with prop-filter UID
    const propFilters = extractAllXmlTags(xml, "prop-filter");
    for (const pf of propFilters) {
        const nameAttr = pf.match(/name="([^"]*)"/)?.[1];
        if (nameAttr?.toUpperCase() === "UID") {
            const textMatch = extractXmlTag(pf, "text-match");
            if (textMatch) {
                query.filterUid = textMatch;
            }
        }
    }

    return query;
}

// ── Task → CalendarEvent mapping ───────────────────────────────────

function taskToCalendarEvent(task: Task): CalendarEvent {
    const recurrenceRule = parseRecurrenceRuleInput(task.recurrenceRule);
    const resolved = resolveScheduleType({
        explicit: task.scheduleType,
        recurrence: recurrenceRule,
        fallback: "single",
    });

    return {
        uid: task.id,
        summary: task.name,
        description: task.description,
        start: task.startTime,
        end: task.endTime,
        location: task.location,
        attendees: task.attendees,
        recurrenceRule: resolved.parsedRecurrence || recurrenceRule,
        scheduleType: resolved.scheduleType,
        priority:
            task.importance === "high" ? 1 : task.importance === "low" ? 9 : 5,
    };
}

function calendarEventToTask(
    event: CalendarEvent,
    existingTask?: Task,
    userId?: string,
): Task {
    const scheduleType =
        event.scheduleType ||
        resolveScheduleType({
            explicit: undefined,
            recurrence: event.recurrenceRule,
            fallback: "single",
        }).scheduleType;

    return {
        id: event.uid || existingTask?.id || uuidv4(),
        name: event.summary || "Untitled",
        description: event.description || "",
        dueDate: event.end || event.start,
        startTime: event.start,
        endTime: event.end,
        location: event.location,
        completed: false,
        pushedToMSTodo: existingTask?.pushedToMSTodo || false,
        attendees: event.attendees,
        recurrenceRule: event.recurrenceRule
            ? JSON.stringify(event.recurrenceRule)
            : undefined,
        scheduleType,
        importance:
            event.priority && event.priority <= 3
                ? "high"
                : event.priority && event.priority >= 7
                  ? "low"
                  : "normal",
    };
}

// ── Core handlers ──────────────────────────────────────────────────

async function handleOptions(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    const headers: Record<string, string> = {
        DAV: "1, 2, 3, calendar-access, addressbook",
        Allow: "OPTIONS, GET, HEAD, PROPFIND, REPORT, PUT, DELETE, MKCALENDAR, MKCOL",
        "Content-Type": "text/xml; charset=utf-8",
    };
    return { status: 200, headers };
}

async function handlePropfind(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    const parsed = parseCalDavPath(ctx.path);
    const depth = ctx.depth || "0";
    const requestedProps = ctx.body ? extractPropNames(ctx.body) : [];

    // If no prop requested, return allprops
    const wantAllProps =
        requestedProps.length === 0 || requestedProps.includes("allprop");

    switch (parsed.type) {
        case "root": {
            // Return root with current-user-principal for CalDAV client discovery (Thunderbird, etc.)
            const href = buildResourceUrl(config, []);
            const principalUrl = buildResourceUrl(config, [
                "principals",
                ctx.user.id,
            ]);
            const props =
                xmlTag("D:resourcetype", xmlTag("D:collection")) +
                xmlTag("D:displayname", "Apoints CalDAV Server") +
                xmlTag(
                    "D:current-user-principal",
                    xmlTag("D:href", xmlEscape(principalUrl + "/")),
                );
            const resp = buildResponse(
                href + "/",
                buildPropstat(props, "HTTP/1.1 200 OK"),
            );
            return {
                status: 207,
                headers: { "Content-Type": "text/xml; charset=utf-8" },
                body:
                    xmlHeader() +
                    xmlTag("D:multistatus", resp, { "xmlns:D": NS.DAV }),
            };
        }

        case "principal": {
            if (!parsed.userId) return { status: 404, headers: {} };
            const href = buildResourceUrl(config, [
                "principals",
                parsed.userId,
            ]);
            const props = buildPrincipalProps(ctx.user, config);
            const resp = buildResponse(
                href + "/",
                buildPropstat(props, "HTTP/1.1 200 OK"),
            );

            let body =
                xmlHeader() +
                xmlTag("D:multistatus", resp, {
                    "xmlns:D": NS.DAV,
                    "xmlns:C": NS.CALDAV,
                    "xmlns:CS": NS.CS,
                });

            // Depth 1: include calendar-home member
            if (depth === "1") {
                const chHref = buildResourceUrl(config, [
                    "calendars",
                    parsed.userId,
                ]);
                const chProps = buildCalendarHomeProps(ctx.user, config);
                const chResp = buildResponse(
                    chHref + "/",
                    buildPropstat(chProps, "HTTP/1.1 200 OK"),
                );
                body =
                    xmlHeader() +
                    xmlTag("D:multistatus", resp + chResp, {
                        "xmlns:D": NS.DAV,
                        "xmlns:C": NS.CALDAV,
                        "xmlns:CS": NS.CS,
                    });
            }

            return {
                status: 207,
                headers: { "Content-Type": "text/xml; charset=utf-8" },
                body,
            };
        }

        case "calendar-home": {
            if (!parsed.userId) return { status: 404, headers: {} };
            const href = buildResourceUrl(config, ["calendars", parsed.userId]);
            const props = buildCalendarHomeProps(ctx.user, config);
            const resp = buildResponse(
                href + "/",
                buildPropstat(props, "HTTP/1.1 200 OK"),
            );

            let body =
                xmlHeader() +
                xmlTag("D:multistatus", resp, {
                    "xmlns:D": NS.DAV,
                    "xmlns:C": NS.CALDAV,
                    "xmlns:CS": NS.CS,
                });

            // Depth 1: include calendar members
            if (depth === "1") {
                const calHref = buildResourceUrl(config, [
                    "calendars",
                    parsed.userId,
                    "default",
                ]);
                const calProps = buildCalendarProps(
                    ctx.user,
                    config,
                    "default",
                );
                const calResp = buildResponse(
                    calHref + "/",
                    buildPropstat(calProps, "HTTP/1.1 200 OK"),
                );
                body =
                    xmlHeader() +
                    xmlTag("D:multistatus", resp + calResp, {
                        "xmlns:D": NS.DAV,
                        "xmlns:C": NS.CALDAV,
                        "xmlns:CS": NS.CS,
                    });
            }

            return {
                status: 207,
                headers: { "Content-Type": "text/xml; charset=utf-8" },
                body,
            };
        }

        case "calendar": {
            if (!parsed.userId || !parsed.calendarId)
                return { status: 404, headers: {} };
            const href = buildResourceUrl(config, [
                "calendars",
                parsed.userId,
                parsed.calendarId,
            ]);
            const props = buildCalendarProps(
                ctx.user,
                config,
                parsed.calendarId,
            );
            const resp = buildResponse(
                href + "/",
                buildPropstat(props, "HTTP/1.1 200 OK"),
            );

            let body =
                xmlHeader() +
                xmlTag("D:multistatus", resp, {
                    "xmlns:D": NS.DAV,
                    "xmlns:C": NS.CALDAV,
                    "xmlns:CS": NS.CS,
                });

            // Depth 1: include event resources
            if (depth === "1") {
                const tasks = await dbService.getTasksByUserId(ctx.user.id);
                const eventResponses: string[] = [];
                for (const task of tasks) {
                    const eventHref = buildResourceUrl(config, [
                        "calendars",
                        parsed.userId,
                        parsed.calendarId,
                        `${task.id}.ics`,
                    ]);
                    const eventProps = buildEventProps(task);
                    eventResponses.push(
                        buildResponse(
                            eventHref,
                            buildPropstat(eventProps, "HTTP/1.1 200 OK"),
                        ),
                    );
                }
                body =
                    xmlHeader() +
                    xmlTag("D:multistatus", resp + eventResponses.join(""), {
                        "xmlns:D": NS.DAV,
                        "xmlns:C": NS.CALDAV,
                        "xmlns:CS": NS.CS,
                    });
            }

            return {
                status: 207,
                headers: { "Content-Type": "text/xml; charset=utf-8" },
                body,
            };
        }

        case "event": {
            if (!parsed.userId || !parsed.calendarId || !parsed.eventUid)
                return { status: 404, headers: {} };

            try {
                const task = await dbService.getTaskById(parsed.eventUid);
                if (!task) return { status: 404, headers: {} };

                const eventHref = buildResourceUrl(config, [
                    "calendars",
                    parsed.userId,
                    parsed.calendarId,
                    `${parsed.eventUid}.ics`,
                ]);
                const eventProps = buildEventProps(task);
                const resp = buildResponse(
                    eventHref,
                    buildPropstat(eventProps, "HTTP/1.1 200 OK"),
                );
                return {
                    status: 207,
                    headers: { "Content-Type": "text/xml; charset=utf-8" },
                    body:
                        xmlHeader() +
                        xmlTag("D:multistatus", resp, { "xmlns:D": NS.DAV }),
                };
            } catch {
                return { status: 404, headers: {} };
            }
        }

        default:
            return { status: 404, headers: {} };
    }
}

async function handleReport(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    const parsed = parseCalDavPath(ctx.path);

    if (parsed.type !== "calendar" || !parsed.userId || !parsed.calendarId) {
        return { status: 404, headers: {} };
    }

    // Determine report type
    const isCalendarQuery =
        ctx.body.includes("calendar-query") ||
        ctx.body.includes(":calendar-query");
    const isCalendarMultiget =
        ctx.body.includes("calendar-multiget") ||
        ctx.body.includes(":calendar-multiget");

    let tasks: Task[];

    if (isCalendarMultiget) {
        // Extract all hrefs from multiget request
        const hrefs = extractAllXmlTags(ctx.body, "href");
        const uids = hrefs
            .map((h) => {
                const parts = h.split("/");
                const last = parts[parts.length - 1];
                return last.replace(/\.ics$/i, "");
            })
            .filter(Boolean);

        const allTasks = await dbService.getTasksByUserId(ctx.user.id);
        tasks = allTasks.filter((t) => uids.includes(t.id));
    } else if (isCalendarQuery) {
        const query = parseCalendarQuery(ctx.body);

        if (query.filterUid) {
            try {
                const task = await dbService.getTaskById(query.filterUid);
                tasks = task ? [task] : [];
            } catch {
                tasks = [];
            }
        } else {
            const allTasks = await dbService.getTasksByUserId(ctx.user.id);

            if (query.timeRange) {
                const rangeStart = parseCalDavDate(query.timeRange.start);
                const rangeEnd = parseCalDavDate(query.timeRange.end);
                tasks = allTasks.filter((t) => {
                    return t.startTime < rangeEnd && t.endTime > rangeStart;
                });
            } else {
                tasks = allTasks;
            }
        }
    } else {
        // Unsupported report
        return { status: 403, headers: {} };
    }

    // Build multistatus response with event data
    const responses: string[] = [];
    for (const task of tasks) {
        const eventHref = buildResourceUrl(config, [
            "calendars",
            parsed.userId,
            parsed.calendarId,
            `${task.id}.ics`,
        ]);
        const calEvent = taskToCalendarEvent(task);
        const icsData = buildIcs(calEvent, task.id);
        const etag = `"${task.id}-${task.startTime}-${task.endTime}"`.replace(
            /[^ -~]/g,
            "",
        );

        const props = [
            xmlTag("D:getetag", etag),
            xmlTag("C:calendar-data", xmlEscape(icsData)),
        ].join("");

        responses.push(
            buildResponse(eventHref, buildPropstat(props, "HTTP/1.1 200 OK")),
        );
    }

    return {
        status: 207,
        headers: { "Content-Type": "text/xml; charset=utf-8" },
        body:
            xmlHeader() +
            xmlTag("D:multistatus", responses.join(""), {
                "xmlns:D": NS.DAV,
                "xmlns:C": NS.CALDAV,
                "xmlns:CS": NS.CS,
            }),
    };
}

async function handleGet(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    const parsed = parseCalDavPath(ctx.path);

    if (parsed.type === "calendar" && parsed.userId && parsed.calendarId) {
        // Request to get calendar collection - return HTML listing or redirect
        return {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" },
            body: `<html><body><h1>Calendar: ${parsed.calendarId}</h1><p>Use a CalDAV client to access this resource.</p></body></html>`,
        };
    }

    if (parsed.type === "event" && parsed.userId && parsed.eventUid) {
        try {
            const task = await dbService.getTaskById(parsed.eventUid);
            if (!task) return { status: 404, headers: {} };

            const calEvent = taskToCalendarEvent(task);
            const icsData = buildIcs(calEvent, task.id);
            const etag =
                `"${task.id}-${task.startTime}-${task.endTime}"`.replace(
                    /[^ -~]/g,
                    "",
                );

            return {
                status: 200,
                headers: {
                    "Content-Type": "text/calendar; charset=utf-8",
                    ETag: etag,
                },
                body: icsData,
            };
        } catch {
            return { status: 404, headers: {} };
        }
    }

    return { status: 404, headers: {} };
}

async function handlePut(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    const parsed = parseCalDavPath(ctx.path);

    if (
        parsed.type !== "event" ||
        !parsed.userId ||
        !parsed.calendarId ||
        !parsed.eventUid
    ) {
        return { status: 404, headers: {} };
    }

    if (!ctx.body) {
        return { status: 400, headers: {} };
    }

    const calEvent = parseIcsEvent(ctx.body);
    if (!calEvent) {
        return {
            status: 400,
            headers: { "Content-Type": "text/plain" },
            body: "Invalid iCalendar data",
        };
    }

    // Use the UID from the path or from the ICS (path takes precedence)
    const effectiveUid = parsed.eventUid;
    calEvent.uid = effectiveUid;

    try {
        // Check if task exists (update) or is new (create)
        const existingTask = await dbService.getTaskById(effectiveUid);

        if (existingTask) {
            // Update existing task
            const updatedTask = calendarEventToTask(calEvent, existingTask);
            updatedTask.id = effectiveUid;
            await dbService.patchTask(
                ctx.user.id,
                effectiveUid,
                updatedTask,
                !!ctx.user.conflictBoundaryInclusive,
                true,
            );
        } else {
            // Create new task
            const newTask = calendarEventToTask(
                calEvent,
                undefined,
                ctx.user.id,
            );
            newTask.id = effectiveUid;
            await dbService.addTask(
                ctx.user.id,
                newTask,
                !!ctx.user.conflictBoundaryInclusive,
                true,
            );
        }

        const etag =
            `"${effectiveUid}-${calEvent.start}-${calEvent.end}"`.replace(
                /[^ -~]/g,
                "",
            );
        return {
            status: existingTask ? 204 : 201,
            headers: {
                ETag: etag,
            },
        };
    } catch (e: any) {
        console.error("CalDAV PUT error:", e);
        return { status: 500, headers: {} };
    }
}

async function handleDelete(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    const parsed = parseCalDavPath(ctx.path);

    if (parsed.type !== "event" || !parsed.userId || !parsed.eventUid) {
        return { status: 404, headers: {} };
    }

    try {
        const deleted = await dbService.deleteTask(parsed.eventUid);
        if (!deleted) return { status: 404, headers: {} };
        return { status: 204, headers: {} };
    } catch {
        return { status: 500, headers: {} };
    }
}

async function handleMkcalendar(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    // We auto-create calendars, so just return success
    return { status: 201, headers: {} };
}

// ── Date parsing helper ────────────────────────────────────────────

function parseCalDavDate(dateStr: string): string {
    // CalDAV dates look like: 20260501T000000Z
    const match = dateStr.match(
        /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/,
    );
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`;
    }
    return dateStr;
}

// ── Main dispatcher ────────────────────────────────────────────────

export async function handleCalDavRequest(
    ctx: CalDavRequestContext,
    config: CalDavServerConfig,
): Promise<CalDavResponse> {
    const method = ctx.method.toUpperCase();

    switch (method) {
        case "OPTIONS":
            return handleOptions(ctx, config);
        case "PROPFIND":
            return handlePropfind(ctx, config);
        case "REPORT":
            return handleReport(ctx, config);
        case "GET":
        case "HEAD":
            return handleGet(ctx, config);
        case "PUT":
            return handlePut(ctx, config);
        case "DELETE":
            return handleDelete(ctx, config);
        case "MKCALENDAR":
        case "MKCOL":
            return handleMkcalendar(ctx, config);
        default:
            return {
                status: 405,
                headers: {
                    Allow: "OPTIONS, GET, HEAD, PROPFIND, REPORT, PUT, DELETE, MKCALENDAR",
                },
            };
    }
}
