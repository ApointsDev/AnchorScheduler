/* eslint-disable @typescript-eslint/no-explicit-any */
import ICAL from 'ical.js';
import { v4 as uuidv4 } from 'uuid';
import { toShanghaiISO } from '../../Utils/time.js';
import { resolveScheduleType, type RecurrenceRule } from '../types.js';
import type { CalendarEvent } from './types.js';

// ── ICS text helpers ──────────────────────────────────────────────

export const escapeIcsText = (value?: string) => {
  if (!value) return '';
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
};

export const foldLine = (line: string) => {
  const maxLen = 75;
  if (line.length <= maxLen) return line;
  const parts: string[] = [];
  let current = line;
  while (current.length > maxLen) {
    parts.push(current.slice(0, maxLen));
    current = ` ${current.slice(maxLen)}`;
  }
  parts.push(current);
  return parts.join('\r\n');
};

export const formatCalTimeUtc = (iso: string) => {
  const date = new Date(iso);
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

// ── RRULE helpers ──────────────────────────────────────────────────

export const buildRruleString = (rule?: RecurrenceRule): string | undefined => {
  if (!rule) return undefined;
  const parts: string[] = [];
  const freqMap: Record<RecurrenceRule['freq'], string> = {
    daily: 'DAILY',
    weekly: 'WEEKLY',
    weeklyByWeekNumber: 'WEEKLY',
    dailyOnDays: 'WEEKLY',
  };
  parts.push(`FREQ=${freqMap[rule.freq]}`);
  if (rule.interval) parts.push(`INTERVAL=${rule.interval}`);
  if (rule.count) parts.push(`COUNT=${rule.count}`);
  if (rule.until) parts.push(`UNTIL=${formatCalTimeUtc(rule.until)}`);

  if (rule.freq === 'weeklyByWeekNumber' && rule.weeks?.length) {
    parts.push(`BYWEEKNO=${rule.weeks.join(',')}`);
  }
  if (rule.freq === 'weekly' && rule.byDay?.length) {
    parts.push(`BYDAY=${rule.byDay.join(',')}`);
  }
  if (rule.freq === 'dailyOnDays' && rule.days?.length) {
    const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const byDay = rule.days.map((d: number) => dayMap[d]).filter(Boolean);
    if (byDay.length) parts.push(`BYDAY=${byDay.join(',')}`);
  }

  return parts.join(';');
};

// ── Parsing helpers ────────────────────────────────────────────────

const parsePriority = (value?: string) => {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
};

const mapOrganizer = (value?: any) => {
  if (!value) return undefined;
  const raw = typeof value === 'string' ? value : String(value);
  return raw.replace(/^mailto:/i, '');
};

const mapAttendees = (props: ICAL.Property[]) => {
  return props
    .map((p: ICAL.Property) => String(p.getFirstValue() || ''))
    .filter(Boolean)
    .map((v: string) => v.replace(/^mailto:/i, ''));
};

const mapCategories = (props: ICAL.Property[]) => {
  const values: string[] = [];
  for (const prop of props) {
    const val = prop.getFirstValue();
    if (Array.isArray(val)) {
      values.push(...val.map(String));
    } else if (val) {
      values.push(String(val));
    }
  }
  return values;
};

const mapAttachments = (props: ICAL.Property[]) => {
  return props
    .map((p: ICAL.Property) => String(p.getFirstValue() || ''))
    .filter(Boolean);
};

const mapRruleToRecurrence = (rrule?: ICAL.Recur): RecurrenceRule | undefined => {
  if (!rrule) return undefined;
  const freq = (rrule.freq || '').toLowerCase();
  const interval = rrule.interval || undefined;
  const count = rrule.count || undefined;
  const until = rrule.until ? rrule.until.toJSDate().toISOString() : undefined;

  if (freq === 'weekly' && rrule.byweekno && rrule.byweekno.length > 0) {
    return { freq: 'weeklyByWeekNumber', weeks: rrule.byweekno as number[], interval, count, until };
  }

  if (freq === 'weekly' && rrule.byday && rrule.byday.length > 0) {
    const dayMap: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
    const days = rrule.byday.map((d: any) => dayMap[String(d).toUpperCase()]).filter((d: number) => d !== undefined);
    return { freq: 'dailyOnDays', days: days as number[], interval, count, until };
  }

  if (freq === 'weekly') {
    return { freq: 'weekly', interval, count, until };
  }

  if (freq === 'daily') {
    return { freq: 'daily', interval, count, until };
  }

  return undefined;
};

// ── Core ICS build / parse ─────────────────────────────────────────

export function parseIcsEvent(ics: string, response?: any): CalendarEvent | null {
  try {
    const jcal = ICAL.parse(ics);
    const comp = new ICAL.Component(jcal);
    const vevent = comp.getFirstSubcomponent('vevent');
    if (!vevent) return null;
    const event = new ICAL.Event(vevent);

    const rruleProp = vevent.getFirstProperty('rrule');
    const rrule = rruleProp ? rruleProp.getFirstValue() as ICAL.Recur : undefined;
    const recurrenceRule = mapRruleToRecurrence(rrule);
    const resolved = resolveScheduleType({ explicit: undefined, recurrence: recurrenceRule, fallback: 'single' });

    const attendees = mapAttendees(vevent.getAllProperties('attendee'));
    const categories = mapCategories(vevent.getAllProperties('categories'));
    const attachments = mapAttachments(vevent.getAllProperties('attach'));

    const organizerProp = vevent.getFirstProperty('organizer');
    const organizer = organizerProp ? mapOrganizer(organizerProp.getFirstValue()) : undefined;

    const priorityProp = vevent.getFirstProperty('priority');
    const priority = priorityProp ? parsePriority(priorityProp.getFirstValue()) : undefined;

    return {
      uid: event.uid || uuidv4(),
      summary: event.summary || undefined,
      description: event.description || undefined,
      start: toShanghaiISO(event.startDate.toJSDate()),
      end: toShanghaiISO(event.endDate.toJSDate()),
      location: event.location || undefined,
      rrule: rrule ? rrule.toString() : undefined,
      recurrenceRule,
      scheduleType: resolved.scheduleType,
      attendees,
      categories,
      attachments,
      organizer,
      priority,
      href: response?.url || response?.href,
      etag: response?.etag,
      rawIcs: ics,
    };
  } catch (e) {
    console.error('Error parsing ICS event:', e);
    return null;
  }
}

export function buildIcs(event: CalendarEvent, uidOverride?: string): string {
  const uid = uidOverride || event.uid || uuidv4();
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Apoints//CalDAV//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatCalTimeUtc(new Date().toISOString())}`,
    `DTSTART:${formatCalTimeUtc(event.start)}`,
    `DTEND:${formatCalTimeUtc(event.end)}`,
    `SUMMARY:${escapeIcsText(event.summary || '')}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);

  const rruleString = event.rrule || buildRruleString(event.recurrenceRule) || undefined;
  if (rruleString) lines.push(`RRULE:${rruleString}`);

  if (event.priority !== undefined) lines.push(`PRIORITY:${event.priority}`);

  if (event.organizer) {
    lines.push(`ORGANIZER:mailto:${event.organizer}`);
  }

  if (event.attendees && event.attendees.length > 0) {
    for (const attendee of event.attendees) {
      lines.push(`ATTENDEE:mailto:${attendee}`);
    }
  }

  if (event.categories && event.categories.length > 0) {
    lines.push(`CATEGORIES:${event.categories.map(escapeIcsText).join(',')}`);
  }

  if (event.attachments && event.attachments.length > 0) {
    for (const attachment of event.attachments) {
      lines.push(`ATTACH:${attachment}`);
    }
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.map(foldLine).join('\r\n');
}
