
import { AlgorithmService } from '../Services/Algorithms/AlgorithmService';
import { Task } from '../index';

describe('AlgorithmService - Flexible DDL Tasks', () => {
  let service: AlgorithmService;

  beforeEach(() => {
    service = new AlgorithmService();
  });

  it('should schedule flexible task within start and end interval', async () => {
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(baseDate);
    nextDay.setDate(baseDate.getDate() + 1);

    // 1. Fixed Task: 10:00 - 11:00
    const fixedTask = {
      id: 'fixed1',
      name: 'Fixed Meeting',
      startTime: new Date(nextDay.setHours(10, 0, 0, 0)).toISOString(),
      endTime: new Date(nextDay.setHours(11, 0, 0, 0)).toISOString(),
      dueDate: new Date(nextDay.setHours(11, 0, 0, 0)).toISOString(),
      isFixed: true,
      scheduleType: 'single',
      importance: 'high',
      description: '',
      completed: false,
      pushedToMSTodo: false
    } as Task;

    // 2. Flexible Task: Window 09:00 - 12:00, Duration 60m
    // Should fit in 09:00-10:00 or 11:00-12:00
    const flexibleTask = {
      id: 'flex1',
      name: 'Flexible Work',
      startTime: new Date(nextDay.setHours(9, 0, 0, 0)).toISOString(),
      endTime: new Date(nextDay.setHours(12, 0, 0, 0)).toISOString(), // Window End
      dueDate: new Date(nextDay.setHours(12, 0, 0, 0)).toISOString(),
      estimatedDuration: 60,
      isFixed: false,
      scheduleType: 'single',
      importance: 'normal',
      description: '',
      completed: false,
      pushedToMSTodo: false
    } as Task;

    const tasks = [fixedTask, flexibleTask];

    const result = await service.scheduleTasks(tasks, {
      startHour: 8,
      endHour: 18,
      slotDuration: 60
    });

    // Check Flexible Task Assignment
    const flexAssignment = result.scheduledTasks.find((t: any) => t.id === 'flex1');
    expect(flexAssignment).toBeDefined();
    
    const assignedStart = new Date(flexAssignment.startTime);
    const assignedEnd = new Date(flexAssignment.endTime);
    
    console.log('Assigned Flex Task:', assignedStart.toLocaleTimeString(), assignedEnd.toLocaleTimeString());

    // Must be within 09:00 - 12:00
    expect(assignedStart.getTime()).toBeGreaterThanOrEqual(new Date(nextDay.setHours(9, 0, 0, 0)).getTime());
    expect(assignedEnd.getTime()).toBeLessThanOrEqual(new Date(nextDay.setHours(12, 0, 0, 0)).getTime());

    // Must NOT overlap with 10:00 - 11:00
    const overlap = (assignedStart.getTime() < new Date(nextDay.setHours(11, 0, 0, 0)).getTime()) && 
                    (assignedEnd.getTime() > new Date(nextDay.setHours(10, 0, 0, 0)).getTime());
    expect(overlap).toBe(false);
  });

  it('should respect earliestStart constraint', async () => {
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(baseDate);
    nextDay.setDate(baseDate.getDate() + 1);

    // Flexible Task: Window 14:00 - 16:00, Duration 60m
    // Even if 09:00-10:00 is free, it should NOT schedule there.
    const flexibleTask = {
      id: 'flex2',
      name: 'Afternoon Work',
      startTime: new Date(nextDay.setHours(14, 0, 0, 0)).toISOString(), // Earliest Start
      endTime: new Date(nextDay.setHours(16, 0, 0, 0)).toISOString(),
      dueDate: new Date(nextDay.setHours(16, 0, 0, 0)).toISOString(),
      estimatedDuration: 60,
      isFixed: false,
      scheduleType: 'single',
      importance: 'normal',
      description: '',
      completed: false,
      pushedToMSTodo: false
    } as Task;

    const tasks = [flexibleTask];

    const result = await service.scheduleTasks(tasks, {
      startHour: 8,
      endHour: 18,
      slotDuration: 60
    });

    const flexAssignment = result.scheduledTasks.find((t: any) => t.id === 'flex2');
    expect(flexAssignment).toBeDefined();
    
    const assignedStart = new Date(flexAssignment.startTime);
    
    console.log('Assigned Afternoon Task:', assignedStart.toLocaleTimeString());

    // Must be >= 14:00
    expect(assignedStart.getTime()).toBeGreaterThanOrEqual(new Date(nextDay.setHours(14, 0, 0, 0)).getTime());
  });
});

