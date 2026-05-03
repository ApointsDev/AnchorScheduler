import { AlgorithmService } from '../Services/Algorithms/AlgorithmService';
import { DDLTask, FixedEvent, TimeSlot, TeamMember } from '../Services/Algorithms/types';

describe('AlgorithmService Integration', () => {
  let service: AlgorithmService;

  beforeEach(() => {
    service = new AlgorithmService();
  });

  test('optimizePersonalSchedule should run pipeline successfully', async () => {
    const tasks: DDLTask[] = [
      { id: '1', name: 'Task 1', deadline: new Date(Date.now() + 86400000), estimatedDuration: 60 },
      { id: '2', name: 'Task 2', deadline: new Date(Date.now() + 86400000), estimatedDuration: 60 }
    ];
    const fixedEvents: FixedEvent[] = [];
    const availableSlots: TimeSlot[] = [
      { id: 's1', start: new Date(), end: new Date(Date.now() + 3600000) },
      { id: 's2', start: new Date(Date.now() + 3600000), end: new Date(Date.now() + 7200000) }
    ];
    const dependencies: [string, string][] = [['1', '2']]; // 1 -> 2

    const assignments = await service.optimizePersonalSchedule(tasks, fixedEvents, availableSlots, dependencies);
    
    expect(assignments).toBeDefined();
    expect(assignments.has('1')).toBe(true);
    expect(assignments.has('2')).toBe(true);
    // Since 1 -> 2, and we use coloring which respects order if implemented correctly or just assigns valid slots.
    // The current coloring implementation might not strictly enforce dependency order in time, 
    // but the service sorts them before passing to coloring.
  });

  test('scheduleTeamMeeting should return result', async () => {
    const members: TeamMember[] = [
      { id: '1', name: 'Alice', busySlots: [], preferences: [], maxAdjustmentCost: 100 }
    ];
    const req = {
      duration: 60,
      windowStart: new Date('2023-01-01T09:00:00Z'),
      windowEnd: new Date('2023-01-01T12:00:00Z'),
      requiredParticipants: ['1']
    };

    const result = await service.scheduleTeamMeeting(members, req);
    
    expect(result.status).toBe('optimal');
    expect(result.optimalTime).toBeDefined();
  });

  test('analyzeProjectCriticalPath should return critical path', () => {
    const tasks = [
      { id: 'A', duration: 10, dependencies: [] },
      { id: 'B', duration: 20, dependencies: ['A'] }
    ];
    const result = service.analyzeProjectCriticalPath(tasks, new Date());
    
    expect(result.criticalPath).toEqual(['A', 'B']);
    expect(result.projectDuration).toBe(30);
  });
});
