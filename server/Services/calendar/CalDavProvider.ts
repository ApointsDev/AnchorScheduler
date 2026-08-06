/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDAVClient } from 'tsdav';
import { v4 as uuidv4 } from 'uuid';
import { toShanghaiISO } from '../../Utils/time.js';
import { parseIcsEvent, buildIcs, buildRruleString } from './icsUtils.js';
import type { CalendarDiscovery, CalendarEvent, CalendarEventRef, CalendarInfo, CalendarListEventsOptions, CalendarProvider } from './types.js';

interface CalDavConfig {
  baseUrl: string;
  username: string;
  password: string;
  calendarHome?: string;
}

export class CalDavProvider implements CalendarProvider {
  private client: any = null;
  private baseUrl: string;
  private username: string;
  private password: string;
  private calendarHome?: string;
  private _isLoggedIn: boolean = false;

  constructor(config: CalDavConfig) {
    this.baseUrl = config.baseUrl;
    this.username = config.username;
    this.password = config.password;
    this.calendarHome = config.calendarHome;
  }

  private async ensureClient(): Promise<any> {
    if (this.client && this._isLoggedIn) {
      return this.client;
    }

    this.client = createDAVClient({
      serverUrl: this.baseUrl,
      credentials: {
        username: this.username,
        password: this.password,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });

    await (this.client as any).login();
    this._isLoggedIn = true;

    return this.client;
  }

  async discover(): Promise<CalendarDiscovery> {
    const client = await this.ensureClient();
    const calendars = await client.fetchCalendars();

    const calendarInfos: CalendarInfo[] = calendars.map((cal: any) => ({
      url: cal.url,
      displayName: cal.displayName || cal.displayname,
      description: cal.description,
      ctag: cal.ctag,
      syncToken: cal.syncToken,
    }));

    let principalUrl: string | undefined;
    let calendarHome: string | undefined;

    if (calendars.length > 0) {
      const firstCal: any = calendars[0];
      if (firstCal.account) {
        principalUrl = firstCal.account.serverUrl || this.baseUrl;
        calendarHome = firstCal.account.calendarHome || this.calendarHome;
      }
    }

    return {
      principalUrl: principalUrl || this.baseUrl,
      calendarHome: calendarHome || this.calendarHome,
      calendars: calendarInfos,
    };
  }

  async listCalendars(): Promise<CalendarInfo[]> {
    const discovery = await this.discover();
    return discovery.calendars;
  }

  async listEvents(calendarUrl: string, options?: CalendarListEventsOptions): Promise<CalendarEvent[]> {
    const client = await this.ensureClient();

    const calendars = await client.fetchCalendars();
    const targetCalendar = calendars.find((cal: any) =>
      cal.url === calendarUrl ||
      cal.url.endsWith(calendarUrl) ||
      calendarUrl.endsWith(cal.url) ||
      cal.url.replace(/\/$/, '') === calendarUrl.replace(/\/$/, '')
    );

    if (!targetCalendar) {
      throw new Error(`Calendar not found: ${calendarUrl}`);
    }

    const fetchOptions: any = {
      calendar: targetCalendar,
      expand: true,
      skipRecurrence: false,
    };

    if (options?.start && options?.end) {
      fetchOptions.timeRange = {
        start: new Date(options.start),
        end: new Date(options.end),
      };
    }

    const calendarObjects = await client.fetchCalendarObjects(fetchOptions);

    const events: CalendarEvent[] = [];

    for (const obj of calendarObjects) {
      if (!obj.data) continue;

      try {
        const event = parseIcsEvent(obj.data, obj);
        if (event) {
          events.push(event);
        }
      } catch (e) {
        console.error('Failed to parse calendar object:', e);
      }
    }

    return events;
  }

  async createEvent(calendarUrl: string, event: CalendarEvent): Promise<CalendarEventRef> {
    const client = await this.ensureClient();

    const calendars = await client.fetchCalendars();
    const targetCalendar = calendars.find((cal: any) =>
      cal.url === calendarUrl ||
      cal.url.endsWith(calendarUrl) ||
      calendarUrl.endsWith(cal.url)
    );

    if (!targetCalendar) {
      throw new Error(`Calendar not found: ${calendarUrl}`);
    }

    const uid = event.uid || uuidv4();
    const filename = `${uid}.ics`;
    const iCalString = buildIcs({ ...event, uid });

    const result = await client.createCalendarObject({
      calendar: targetCalendar,
      iCalString,
      filename,
    });

    return {
      href: result.href || `${calendarUrl}${filename}`,
      etag: result.etag,
      uid,
    };
  }

  async updateEvent(calendarUrl: string, href: string, event: CalendarEvent, etag?: string): Promise<CalendarEventRef> {
    const client = await this.ensureClient();

    const calendars = await client.fetchCalendars();
    const targetCalendar = calendars.find((cal: any) =>
      cal.url === calendarUrl ||
      cal.url.endsWith(calendarUrl) ||
      calendarUrl.endsWith(cal.url)
    );

    if (!targetCalendar) {
      throw new Error(`Calendar not found: ${calendarUrl}`);
    }

    const iCalString = buildIcs(event);

    const calendarObjects = await client.fetchCalendarObjects({
      calendar: targetCalendar,
      objectUrls: [href],
    });

    if (calendarObjects.length === 0) {
      throw new Error(`Calendar object not found: ${href}`);
    }

    const result = await client.updateCalendarObject({
      calendarObject: calendarObjects[0],
      iCalString,
    });

    return {
      href: result.href || href,
      etag: result.etag,
      uid: event.uid,
    };
  }

  async deleteEvent(calendarUrl: string, href: string, etag?: string): Promise<void> {
    const client = await this.ensureClient();

    const calendars = await client.fetchCalendars();
    const targetCalendar = calendars.find((cal: any) =>
      cal.url === calendarUrl ||
      cal.url.endsWith(calendarUrl) ||
      calendarUrl.endsWith(cal.url)
    );

    if (!targetCalendar) {
      throw new Error(`Calendar not found: ${calendarUrl}`);
    }

    const calendarObjects = await client.fetchCalendarObjects({
      calendar: targetCalendar,
      objectUrls: [href],
    });

    if (calendarObjects.length === 0) {
      throw new Error(`Calendar object not found: ${href}`);
    }

    await client.deleteCalendarObject({
      calendarObject: calendarObjects[0],
    });
  }
}

export function createCalDavProvider(config: CalDavConfig): CalDavProvider {
  return new CalDavProvider(config);
}
