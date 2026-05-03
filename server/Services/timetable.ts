import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from './dbService';
import type { TimetableActivity, ScheduleType } from './types';
import { ScheduleConflictError, findConflictingTasks } from './scheduleConflict';
import { broadcastTaskChange } from './websocket';
import { logUserEvent } from './userLog';
import { logger } from '../Utils/logger.js';
import { ExchangeClient } from './exchangeClient';
import { toShanghaiISO, getAcademicYearStart, getCurrentWeekNumber } from '../Utils/time.js';
import { getISOWeek, addDays } from 'date-fns';

// Local definitions to avoid circular dependency with index.ts
import { Task, User } from '../index.js';


function parseWeekPattern(pattern: string): number[] {
    const weeks: number[] = [];
    if (!pattern) return weeks;
    const ranges = pattern.split(',');
    for (const range of ranges) {
        const trimmedRange = range.trim();
        if (trimmedRange.includes('-')) {
            const [start, end] = trimmedRange.split('-').map(Number);
            for (let i = start; i <= end; i++) weeks.push(i);
        } else {
            weeks.push(Number(trimmedRange));
        }
    }
    return weeks;
}

function getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] || 'Unknown';
}

export async function syncUserTimetable(user: User, force: boolean = false): Promise<{ added: number, errors: number }> {
    let addedCount = 0;
    let errorCount = 0;

    if (!user.ebridgeBinded || !user.timetableUrl) {
        throw new Error('User not bound to Ebridge or missing timetable URL');
    }

    const envFetchLevel = parseInt(process.env.timetableFetchLevel || '0');
    const userFetchLevel = user.timetableFetchLevel || 0;

    if (!force && envFetchLevel <= userFetchLevel) {
        logger.debug(`Skipping timetable fetch for user ${user.id}: env level (${envFetchLevel}) <= user level (${userFetchLevel})`);
        return { added: 0, errors: 0 };
    }

    try {
        let hashMatch = user.timetableUrl.split('/');
        hashMatch = (hashMatch[5] || '').split('?');
        if (hashMatch && hashMatch[0]) {
            const hash = hashMatch[0];
            logger.info(`Extracted hash: ${JSON.stringify(hashMatch)}`);
            const apiUrl = `https://timetableplus.xjtlu.edu.cn/ptapi/api/enrollment/hash/${hash}/activity?start=1&end=13`;
            logger.info(`Requesting URL: ${apiUrl}`);
            const response = await axios.get<TimetableActivity[]>(apiUrl);

            if (response.status === 200 && Array.isArray(response.data)) {
                logger.success(`Successfully fetched timetable data for user ${user.id}, found ${response.data.length} activities`);
                await logUserEvent(user.id, 'timetableFetched', `Fetched timetable activities: ${response.data.length}`, { count: response.data.length });

                // Update fetch level only if successful
                const envLvl = parseInt(process.env.timetableFetchLevel || '0');
                user.timetableFetchLevel = envLvl;
                await dbService.updateUser(user);
                logger.info(`Updated timetableFetchLevel for user ${user.id} to ${envLvl}`);

                // Clean up old tasks (both individual and previous root tasks for this timetable)
                await dbService.deleteTasksByPattern(user.id, `timetable_${hash}_%`);
                // Refresh user tasks in memory to reflect deletion
                await dbService.refreshUserTasks(user);

                const academicYearStart = getAcademicYearStart();
                const currentWeekNumber = getCurrentWeekNumber();

                for (const activity of response.data) {
                    try {
                        const weeks = parseWeekPattern(activity.weekPattern || '');
                        if (weeks.length === 0) continue;

                        const apiDay = activity.scheduledDay ? parseInt(activity.scheduledDay) : 0;
                        const scheduledDay = apiDay === 6 ? 0 : apiDay + 1; // 0=Sun, 1=Mon...
                        
                        const isoWeeks: number[] = [];
                        let firstInstanceDate: Date | null = null;

                        for (const weekNum of weeks) {
                            // Calculate start of Academic Week
                            const weekStart = addDays(academicYearStart, (weekNum - 1) * 7);
                            
                            // Find the specific day in this week
                            for (let i = 0; i < 7; i++) {
                                const d = addDays(weekStart, i);
                                if (d.getDay() === scheduledDay) {
                                    isoWeeks.push(getISOWeek(d));
                                    if (!firstInstanceDate) {
                                        firstInstanceDate = d;
                                    }
                                    break;
                                }
                            }
                        }

                        if (!firstInstanceDate || isoWeeks.length === 0) continue;

                        const startTimeObj = activity.startTime ? new Date(activity.startTime) : new Date();
                        const endTimeObj = activity.endTime ? new Date(activity.endTime) : new Date(Date.now() + 3600000);

                        // Set time for first instance
                        const rootStartTime = new Date(firstInstanceDate);
                        rootStartTime.setHours(startTimeObj.getHours(), startTimeObj.getMinutes(), startTimeObj.getSeconds());
                        
                        const rootEndTime = new Date(firstInstanceDate);
                        rootEndTime.setHours(endTimeObj.getHours(), endTimeObj.getMinutes(), endTimeObj.getSeconds());

                        const taskId = `timetable_${hash}_${activity.identity || uuidv4()}`;
                        
                        const recurrenceRule = JSON.stringify({
                            freq: 'weeklyByWeekNumber',
                            weeks: isoWeeks,
                            interval: 1
                        });

                        const newTask: Task = {
                            id: taskId,
                            name: activity.name || `${activity.moduleId || 'Unknown'} - ${activity.activityType || 'Activity'}`,
                            description: `Staff: ${activity.staff || 'Unknown'}\nLocation: ${activity.location || 'Online'}\nWeek Pattern: ${activity.weekPattern || 'N/A'}\nDay: ${getDayName(scheduledDay)}`,
                            dueDate: toShanghaiISO(rootEndTime),
                            startTime: toShanghaiISO(rootStartTime),
                            endTime: toShanghaiISO(rootEndTime),
                            location: activity.location || undefined,
                            completed: false,
                            pushedToMSTodo: false,
                            scheduleType: 'recurring_weekly_by_week_number',
                            recurrenceRule: recurrenceRule,
                            body: JSON.stringify(activity),
                            importance: 'normal'
                        };

                        await dbService.addTask(user.id, newTask, !!user.conflictBoundaryInclusive, true);
                        broadcastTaskChange('created', newTask, user.id);
                        
                        logger.info(`Added timetable root task: ${newTask.name} for user ${user.id}`);
                        await logUserEvent(user.id, 'taskCreated', `Created timetable root task ${newTask.name}`, { id: newTask.id });
                        
                        addedCount++;
                    } catch (parseError) {
                        logger.error(`Error processing activity ${activity.identity || 'unknown'}:`, parseError);
                        await logUserEvent(user.id, 'timetableParseError', `Failed to process timetable activity`, { activityId: activity.identity || 'unknown', error: (parseError as any)?.message });
                        errorCount++;
                    }
                }
                // Refresh user tasks after adding all
                await dbService.refreshUserTasks(user);
            } else {
                logger.warn(`Failed to fetch timetable for user ${user.id}`);
                await logUserEvent(user.id, 'timetableError', `Failed to fetch timetable`, {});
                throw new Error('Failed to fetch timetable data');
            }
        } else {
            logger.warn(`Failed to extract hash from timetableUrl for user ${user.id} `);
            await logUserEvent(user.id, 'timetableError', `Failed to extract timetable hash`, {});
            throw new Error('Invalid timetable URL format');
        }
    } catch (error) {
        logger.error(`Failed to process timetable for user ${user.id}:`, error);
        await logUserEvent(user.id, 'timetableError', `Failed to process timetable`, { error: (error as any)?.message });
        throw error;
    }

    return { added: addedCount, errors: errorCount };
}
