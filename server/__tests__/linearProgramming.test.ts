import { LinearProgramming } from '../Services/Algorithms/LinearProgramming';
import { LinearProgrammingInput, TeamMember } from '../Services/Algorithms/types';

describe('LinearProgramming (Team Meeting Scheduling)', () => {
  let scheduler: LinearProgramming;
  const baseDate = new Date('2023-01-01T09:00:00Z'); // 09:00
  const endDate = new Date('2023-01-01T17:00:00Z'); // 17:00

  // Helper to create time relative to base
  const time = (hours: number, minutes: number = 0) => {
    const t = new Date(baseDate);
    t.setUTCHours(hours, minutes, 0, 0);
    return t;
  };

  const slot = (startH: number, endH: number) => ({
    id: `test-${startH}-${endH}`,
    start: time(startH),
    end: time(endH)
  });

  beforeEach(() => {
    scheduler = new LinearProgramming();
  });

  test('should find the first available slot when everyone is free', () => {
    const members: TeamMember[] = [
      { id: '1', name: 'Alice', busySlots: [], preferences: [], maxAdjustmentCost: 100 },
      { id: '2', name: 'Bob', busySlots: [], preferences: [], maxAdjustmentCost: 100 }
    ];

    const input: LinearProgrammingInput = {
      teamMembers: members,
      meetingRequirements: {
        duration: 60,
        windowStart: time(9),
        windowEnd: time(12),
        requiredParticipants: ['1', '2']
      }
    };

    const result = scheduler.scheduleMeeting(input);

    expect(result.status).toBe('optimal');
    expect(result.optimalTime).toBeDefined();
    // Should pick 09:00 - 10:00 as it's the first valid one and no preferences differ
    expect(result.optimalTime!.start.toISOString()).toBe(time(9).toISOString());
    expect(result.totalCost).toBe(0);
  });

  test('should prioritize slots with preferences', () => {
    // Alice prefers 10:00-11:00. Bob is indifferent.
    const members: TeamMember[] = [
      { 
        id: '1', name: 'Alice', 
        busySlots: [], 
        preferences: [slot(10, 11)], 
        maxAdjustmentCost: 100 
      },
      { id: '2', name: 'Bob', busySlots: [], preferences: [], maxAdjustmentCost: 100 }
    ];

    const input: LinearProgrammingInput = {
      teamMembers: members,
      meetingRequirements: {
        duration: 60,
        windowStart: time(9),
        windowEnd: time(12),
        requiredParticipants: ['1', '2']
      }
    };

    const result = scheduler.scheduleMeeting(input);

    expect(result.status).toBe('optimal');
    // Should pick 10:00 because of Alice's preference
    expect(result.optimalTime!.start.toISOString()).toBe(time(10).toISOString());
  });

  test('should avoid conflicts if possible', () => {
    // Alice is busy 09:00-10:00. Free 10:00-11:00.
    const members: TeamMember[] = [
      { 
        id: '1', name: 'Alice', 
        busySlots: [slot(9, 10)], 
        preferences: [], 
        maxAdjustmentCost: 100 
      },
      { id: '2', name: 'Bob', busySlots: [], preferences: [], maxAdjustmentCost: 100 }
    ];

    const input: LinearProgrammingInput = {
      teamMembers: members,
      meetingRequirements: {
        duration: 60,
        windowStart: time(9),
        windowEnd: time(12),
        requiredParticipants: ['1', '2']
      }
    };

    const result = scheduler.scheduleMeeting(input);

    expect(result.status).toBe('optimal');
    // 09:00 has conflict (cost). 10:00 is free. Should pick 10:00.
    expect(result.optimalTime!.start.toISOString()).toBe(time(10).toISOString());
    expect(result.totalCost).toBe(0);
  });

  test('should accept conflict if necessary and within cost limits', () => {
    // Alice is busy 09:00-12:00 (all window). Max cost 100.
    // Conflict cost is 10. So she can attend but with cost.
    const members: TeamMember[] = [
      { 
        id: '1', name: 'Alice', 
        busySlots: [slot(9, 12)], 
        preferences: [], 
        maxAdjustmentCost: 100 
      }
    ];

    const input: LinearProgrammingInput = {
      teamMembers: members,
      meetingRequirements: {
        duration: 60,
        windowStart: time(9),
        windowEnd: time(11),
        requiredParticipants: ['1']
      }
    };

    const result = scheduler.scheduleMeeting(input);

    expect(result.status).toBe('optimal');
    expect(result.optimalTime).toBeDefined();
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.adjustments.has('1')).toBe(true);
  });

  test('should return infeasible if required member cannot adjust', () => {
    // Alice is busy and has 0 max cost.
    const members: TeamMember[] = [
      { 
        id: '1', name: 'Alice', 
        busySlots: [slot(9, 12)], 
        preferences: [], 
        maxAdjustmentCost: 0 // Cannot adjust
      }
    ];

    const input: LinearProgrammingInput = {
      teamMembers: members,
      meetingRequirements: {
        duration: 60,
        windowStart: time(9),
        windowEnd: time(11),
        requiredParticipants: ['1']
      }
    };

    const result = scheduler.scheduleMeeting(input);

    expect(result.status).toBe('infeasible');
    expect(result.optimalTime).toBeNull();
  });
});
