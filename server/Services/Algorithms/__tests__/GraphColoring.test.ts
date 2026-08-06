import { GraphColoringAlgorithm } from '../GraphColoring';
import { ColoringInput, DDLTask, FixedEvent, TimeSlot } from '../types';
import { TimeUtils } from '../utils/TimeUtils';

describe('GraphColoring Algorithm', () => {
  let algorithm: GraphColoringAlgorithm;
  let timeSlots: TimeSlot[];

  beforeEach(() => {
    algorithm = new GraphColoringAlgorithm();
    timeSlots = TimeUtils.generateTimeSlots('09:00', '12:00', 60); // 3 slots: 9-10, 10-11, 11-12
  });

  test('should assign colors without conflicts for simple case', async () => {
    const deadline = timeSlots[timeSlots.length - 1].end;
    const tasks: DDLTask[] = [
      { id: 't1', name: 'Task 1', estimatedDuration: 60, deadline },
      { id: 't2', name: 'Task 2', estimatedDuration: 60, deadline }
    ];
    const fixedEvents: FixedEvent[] = [];

    const input: ColoringInput = {
      tasks,
      fixedEvents,
      timeSlots
    };

    const result = await algorithm.execute(input);

    expect(result.conflicts).toHaveLength(0);
    expect(result.assignments.size).toBe(2);
    expect(result.assignments.get('t1')).not.toBe(result.assignments.get('t2'));
  });

  test('should handle fixed events', async () => {
    // Slot 1 (9-10) is occupied by fixed event
    const fixedEvents: FixedEvent[] = [{
      id: 'f1',
      name: 'Class',
      startTime: timeSlots[0].start,
      endTime: timeSlots[0].end
    }];

    const tasks: DDLTask[] = [
      {
        id: 't1',
        name: 'Task 1',
        estimatedDuration: 60,
        deadline: timeSlots[timeSlots.length - 1].end,
      }
    ];

    const input: ColoringInput = {
      tasks,
      fixedEvents,
      timeSlots
    };

    const result = await algorithm.execute(input);

    expect(result.conflicts).toHaveLength(0);
    // Should be assigned to slot 2 or 3, not slot 1
    const assignedSlotId = result.assignments.get('t1');
    expect(assignedSlotId).not.toBe(timeSlots[0].id);
  });

  test('should report conflict if no slots available', async () => {
    const deadline = timeSlots[timeSlots.length - 1].end;
    const tasks: DDLTask[] = [
      { id: 't1', name: 'Task 1', estimatedDuration: 60, deadline },
      { id: 't2', name: 'Task 2', estimatedDuration: 60, deadline },
      { id: 't3', name: 'Task 3', estimatedDuration: 60, deadline },
      { id: 't4', name: 'Task 4', estimatedDuration: 60, deadline }
    ];
    // Only 3 slots available
    const input: ColoringInput = {
      tasks,
      fixedEvents: [],
      timeSlots
    };

    const result = await algorithm.execute(input);

    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  test('should respect deadlines', async () => {
    const tasks: DDLTask[] = [
      { id: 't1', name: 'Task 1', estimatedDuration: 60, deadline: timeSlots[0].end } // Must be done by 10:00
    ];

    const input: ColoringInput = {
      tasks,
      fixedEvents: [],
      timeSlots
    };

    const result = await algorithm.execute(input);

    expect(result.assignments.get('t1')).toBe(timeSlots[0].id);
  });
});
