import type { RecurrenceRule, ScheduleType } from '../types';

export interface CalendarInfo {
  url: string;
  displayName?: string;
  description?: string;
  ctag?: string;
  syncToken?: string;
}

export interface CalendarDiscovery {
  principalUrl?: string;
  calendarHome?: string;
  calendars: CalendarInfo[];
}

export interface CalendarEvent {
  uid: string;
  href?: string;
  etag?: string;
  summary?: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  rrule?: string;
  recurrenceRule?: RecurrenceRule;
  scheduleType?: ScheduleType;
  attendees?: string[];
  organizer?: string;
  categories?: string[];
  attachments?: string[];
  priority?: number;
  rawIcs?: string;
}

export interface CalendarEventRef {
  href: string;
  etag?: string;
  uid?: string;
}

export interface CalendarListEventsOptions {
  start?: string;
  end?: string;
}

export interface CalendarProvider {
  discover(): Promise<CalendarDiscovery>;
  listCalendars(): Promise<CalendarInfo[]>;
  listEvents(calendarUrl: string, options?: CalendarListEventsOptions): Promise<CalendarEvent[]>;
  createEvent(calendarUrl: string, event: CalendarEvent): Promise<CalendarEventRef>;
  updateEvent(calendarUrl: string, href: string, event: CalendarEvent, etag?: string): Promise<CalendarEventRef>;
  deleteEvent(calendarUrl: string, href: string, etag?: string): Promise<void>;
}

export interface CalendarSyncSummary {
  created: number;
  updated: number;
  skippedConflicts: number;
  errors: number;
}

export interface CalendarSyncResult {
  pulled: CalendarSyncSummary;
  pushed: CalendarSyncSummary;
}
