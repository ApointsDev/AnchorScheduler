import { AlgorithmService } from '../Services/Algorithms/AlgorithmService';
import { Task } from '../index';

describe('AlgorithmService - scheduleTasks', () => {
  let service: AlgorithmService;

  beforeEach(() => {
    service = new AlgorithmService();
  });

  test('should schedule flexible tasks around fixed events', async () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Fixed Event: Tomorrow 10:00 - 12:00
    const fixedStart = new Date(tomorrow);
    fixedStart.setHours(10, 0, 0, 0);
    const fixedEnd = new Date(tomorrow);
    fixedEnd.setHours(12, 0, 0, 0);

    // DDL Task: Due Tomorrow 18:00, Duration 60 mins
    const ddlDue = new Date(tomorrow);
    ddlDue.setHours(18, 0, 0, 0);

    const inputTasks: any[] = [
      {
        id: 'fixed-1',
        name: 'Fixed Meeting',
        startTime: fixedStart.toISOString(),
        endTime: fixedEnd.toISOString(),
        dueDate: fixedEnd.toISOString(),
        isFixed: true
      },
      {
        id: 'flexible-1',
        name: 'Flexible Assignment',
        startTime: now.toISOString(), // Allow it to be scheduled from now
        endTime: ddlDue.toISOString(),
        dueDate: ddlDue.toISOString(),
        estimatedDuration: 60,
        isFixed: false
      }
    ];

    const result = await service.scheduleTasks(inputTasks, {
      startHour: 9,
      endHour: 18,
      slotDuration: 60
    });

    const scheduledFlexible = result.scheduledTasks.find(t => t.id === 'flexible-1');
    const scheduledFixed = result.scheduledTasks.find(t => t.id === 'fixed-1');

    // Fixed task should remain unchanged
    expect(scheduledFixed.startTime).toBe(fixedStart.toISOString());
    expect(scheduledFixed.endTime).toBe(fixedEnd.toISOString());

    // Flexible task should be scheduled
    expect(scheduledFlexible.startTime).not.toBe(ddlDue.toISOString()); // Should be moved
    const flexStart = new Date(scheduledFlexible.startTime);
    const flexEnd = new Date(scheduledFlexible.endTime);
    
    // Should be 60 mins duration
    expect((flexEnd.getTime() - flexStart.getTime()) / 60000).toBe(60);
    
    // Should not overlap with fixed event (10-12)
    // Possible slots: 9-10, 12-13, 13-14 ... 17-18
    const overlap = (flexStart < fixedEnd && flexEnd > fixedStart);
    expect(overlap).toBe(false);
  });
});
