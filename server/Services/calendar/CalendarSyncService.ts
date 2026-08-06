import { v4 as uuidv4 } from 'uuid';
import type { Task, User } from '../../index.js';
import { dbService } from '../dbService.js';
import { findConflictingTasks } from '../scheduleConflict.js';
import { logUserEvent } from '../userLog.js';
import { parseRecurrenceRuleInput, resolveScheduleType } from '../types.js';
import { toShanghaiISO } from '../../Utils/time.js';
import type { CalendarEvent, CalendarEventRef, CalendarProvider, CalendarSyncResult, CalendarSyncSummary } from './types.js';

interface SyncOptions {
  direction?: 'pull' | 'push' | 'both';
  calendarUrl?: string;
  rangeStart?: string;
  rangeEnd?: string;
  allowConflict?: boolean;
}

interface CalDavMetaPayload {
  source?: string;
  uid?: string;
  categories?: string[];
  attachments?: string[];
  organizer?: string;
}

const buildSummary = (): CalendarSyncSummary => ({
  created: 0,
  updated: 0,
  skippedConflicts: 0,
  errors: 0,
});

const priorityToImportance = (priority?: number): 'high' | 'normal' | 'low' => {
  if (!priority) return 'normal';
  if (priority <= 3) return 'high';
  if (priority >= 7) return 'low';
  return 'normal';
};

const importanceToPriority = (importance?: string) => {
  if (importance === 'high') return 1;
  if (importance === 'low') return 9;
  return 5;
};

const safeJsonParse = (value?: string) => {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

const extractCalDavMeta = (body?: string): CalDavMetaPayload | undefined => {
  const parsed = safeJsonParse(body);
  if (!parsed || typeof parsed !== 'object') return undefined;
  if (parsed.source === 'caldav') return parsed as CalDavMetaPayload;
  return undefined;
};

const mapCalDavEventToTask = (event: CalendarEvent): Task => {
  const recurrence = event.recurrenceRule ? JSON.stringify(event.recurrenceRule) : undefined;
  const scheduleType = event.scheduleType || resolveScheduleType({ explicit: undefined, recurrence: event.recurrenceRule, fallback: 'single' }).scheduleType;
  const meta: CalDavMetaPayload = {
    source: 'caldav',
    uid: event.uid,
    categories: event.categories,
    attachments: event.attachments,
    organizer: event.organizer,
  };

  return {
    id: uuidv4(),
    name: event.summary || '未命名日程',
    description: event.description || '',
    dueDate: event.end || event.start,
    startTime: event.start,
    endTime: event.end,
    location: event.location,
    completed: false,
    pushedToMSTodo: false,
    attendees: event.attendees,
    recurrenceRule: recurrence,
    scheduleType,
    importance: priorityToImportance(event.priority),
    body: JSON.stringify(meta),
  };
};

const mapTaskToCalDavEvent = (task: Task, uid?: string): CalendarEvent => {
  const recurrenceRule = parseRecurrenceRuleInput(task.recurrenceRule);
  const resolved = resolveScheduleType({ explicit: task.scheduleType, recurrence: recurrenceRule, fallback: 'single' });
  const meta = extractCalDavMeta(task.body);

  return {
    uid: uid || meta?.uid || task.id,
    summary: task.name,
    description: task.description,
    start: task.startTime,
    end: task.endTime,
    location: task.location,
    attendees: task.attendees,
    recurrenceRule: resolved.parsedRecurrence || recurrenceRule,
    scheduleType: resolved.scheduleType,
    priority: importanceToPriority(task.importance),
    categories: meta?.categories,
    attachments: meta?.attachments,
    organizer: meta?.organizer,
  };
};

const ensureCalendarUrl = async (provider: CalendarProvider, user: User, calendarUrl?: string) => {
  if (calendarUrl) return calendarUrl;
  if (user.CalDavCalendarUrl) return user.CalDavCalendarUrl;
  const discovery = await provider.discover();
  const selected = discovery.calendars[0]?.url;
  if (selected) {
    user.CalDavCalendarUrl = selected;
    user.CalDavCalendarHome = discovery.calendarHome || user.CalDavCalendarHome;
    user.CalDavPrincipalUrl = discovery.principalUrl || user.CalDavPrincipalUrl;
    await dbService.updateUser(user);
  }
  return selected;
};

export class CalendarSyncService {
  constructor(private provider: CalendarProvider) {}

  async sync(user: User, options?: SyncOptions): Promise<CalendarSyncResult> {
    const direction = options?.direction || 'both';
    const calendarUrl = await ensureCalendarUrl(this.provider, user, options?.calendarUrl);
    if (!calendarUrl) throw new Error('CalDAV calendarUrl not configured');

    const result: CalendarSyncResult = {
      pulled: buildSummary(),
      pushed: buildSummary(),
    };

    if (direction === 'pull' || direction === 'both') {
      result.pulled = await this.pullEvents(user, calendarUrl, options);
    }

    if (direction === 'push' || direction === 'both') {
      result.pushed = await this.pushEvents(user, calendarUrl);
    }

    user.CalDavLastSyncAt = toShanghaiISO();
    await dbService.updateUser(user);

    return result;
  }

  private async pullEvents(user: User, calendarUrl: string, options?: SyncOptions): Promise<CalendarSyncSummary> {
    const summary = buildSummary();
    const allowConflict = options?.allowConflict ?? true;
    const rangeStart = options?.rangeStart || toShanghaiISO(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30));
    const rangeEnd = options?.rangeEnd || toShanghaiISO(new Date(Date.now() + 1000 * 60 * 60 * 24 * 365));

    let events: CalendarEvent[] = [];
    try {
      events = await this.provider.listEvents(calendarUrl, { start: rangeStart, end: rangeEnd });
    } catch (e) {
      summary.errors++;
      throw e;
    }

    for (const event of events) {
      try {
        const mapping = await dbService.getCalendarEventMapByRemoteUid(user.id, 'caldav', event.uid);
        const candidate = { id: mapping?.localTaskId || 'new-task', startTime: event.start, endTime: event.end };

        if (!allowConflict) {
          const { tasks: existing } = await dbService.getTasksPage(user.id, {
            start: event.start,
            end: event.end,
            limit: 200
          });
          const conflicts = findConflictingTasks(existing, candidate, { boundaryConflict: !!user.conflictBoundaryInclusive });
          if (conflicts.length > 0) {
            summary.skippedConflicts++;
            await logUserEvent(user.id, 'caldavConflictSkip', `Skipped CalDAV event due to conflict`, { uid: event.uid, conflicts: conflicts.map(c => c.id) });
            continue;
          }
        }

        if (mapping?.localTaskId) {
          const updates: Partial<Task> = {
            name: event.summary || '未命名日程',
            description: event.description || '',
            startTime: event.start,
            endTime: event.end,
            dueDate: event.end,
            location: event.location,
            attendees: event.attendees,
            importance: priorityToImportance(event.priority),
            recurrenceRule: event.recurrenceRule ? JSON.stringify(event.recurrenceRule) : undefined,
            scheduleType: event.scheduleType || resolveScheduleType({ explicit: undefined, recurrence: event.recurrenceRule, fallback: 'single' }).scheduleType,
            body: JSON.stringify({
              source: 'caldav',
              uid: event.uid,
              categories: event.categories,
              attachments: event.attachments,
              organizer: event.organizer,
            })
          };

          await dbService.patchTask(user.id, mapping.localTaskId, updates, !!user.conflictBoundaryInclusive, true);
          await dbService.upsertCalendarEventMap({
            userId: user.id,
            provider: 'caldav',
            localTaskId: mapping.localTaskId,
            remoteUid: event.uid,
            remoteHref: event.href,
            remoteEtag: event.etag,
            calendarUrl,
            rawData: event.rawIcs,
          });
          summary.updated++;
        } else {
          const newTask = mapCalDavEventToTask(event);
          await dbService.addTask(user.id, newTask, !!user.conflictBoundaryInclusive, true);
          await dbService.upsertCalendarEventMap({
            userId: user.id,
            provider: 'caldav',
            localTaskId: newTask.id,
            remoteUid: event.uid,
            remoteHref: event.href,
            remoteEtag: event.etag,
            calendarUrl,
            rawData: event.rawIcs,
          });
          summary.created++;
        }
      } catch (e) {
        summary.errors++;
      }
    }

    await logUserEvent(user.id, 'caldavPullSummary', 'CalDAV pull completed', summary);
    return summary;
  }

  private async pushEvents(user: User, calendarUrl: string): Promise<CalendarSyncSummary> {
    const summary = buildSummary();
    const tasks = await dbService.getTasksByUserId(user.id);

    for (const task of tasks) {
      try {
        const mapping = await dbService.getCalendarEventMapByLocalId(user.id, 'caldav', task.id);
        const event = mapTaskToCalDavEvent(task, mapping?.remoteUid || task.id);

        let ref: CalendarEventRef | undefined;
        if (mapping?.remoteHref) {
          ref = await this.provider.updateEvent(calendarUrl, mapping.remoteHref, event, mapping.remoteEtag || undefined);
          summary.updated++;
        } else {
          ref = await this.provider.createEvent(calendarUrl, event);
          summary.created++;
        }

        await dbService.upsertCalendarEventMap({
          userId: user.id,
          provider: 'caldav',
          localTaskId: task.id,
          remoteUid: event.uid,
          remoteHref: ref?.href,
          remoteEtag: ref?.etag,
          calendarUrl,
          rawData: undefined,
        });
      } catch (e) {
        summary.errors++;
      }
    }

    await logUserEvent(user.id, 'caldavPushSummary', 'CalDAV push completed', summary);
    return summary;
  }
}
