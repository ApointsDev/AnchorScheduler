import { AlgorithmService } from '../Services/Algorithms/AlgorithmService';

describe('AlgorithmService - scheduleTeamTasks', () => {
  let service: AlgorithmService;

  beforeEach(() => {
    service = new AlgorithmService();
  });

  test('should schedule team meeting avoiding member busy slots', async () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Member 1: Busy 10:00 - 12:00
    const busyStart1 = new Date(tomorrow);
    busyStart1.setHours(10, 0, 0, 0);
    const busyEnd1 = new Date(tomorrow);
    busyEnd1.setHours(12, 0, 0, 0);

    // Member 2: Busy 14:00 - 16:00
    const busyStart2 = new Date(tomorrow);
    busyStart2.setHours(14, 0, 0, 0);
    const busyEnd2 = new Date(tomorrow);
    busyEnd2.setHours(16, 0, 0, 0);

    const members = [
      {
        id: 'user1',
        name: 'Alice',
        tasks: [
          {
            id: 'task1',
            name: 'Busy Task 1',
            startTime: busyStart1.toISOString(),
            endTime: busyEnd1.toISOString(),
            isFixed: true
          }
        ]
      },
      {
        id: 'user2',
        name: 'Bob',
        tasks: [
          {
            id: 'task2',
            name: 'Busy Task 2',
            startTime: busyStart2.toISOString(),
            endTime: busyEnd2.toISOString(),
            isFixed: true
          }
        ]
      }
    ];

    const meetingDetails = {
      name: 'Team Sync',
      duration: 60,
      windowStart: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(),
      windowEnd: new Date(tomorrow.setHours(18, 0, 0, 0)).toISOString(),
      requiredParticipants: ['user1', 'user2']
    };

    const result = await service.scheduleTeamTasks(members, meetingDetails);

    expect(result.status).toBe('optimal');
    expect(result.optimalTime).toBeDefined();
    
    const meetingStart = result.optimalTime!.start;
    const meetingEnd = result.optimalTime!.end;

    // Should not overlap with 10-12 (Alice)
    const overlapAlice = (meetingStart < busyEnd1 && meetingEnd > busyStart1);
    expect(overlapAlice).toBe(false);

    // Should not overlap with 14-16 (Bob)
    const overlapBob = (meetingStart < busyEnd2 && meetingEnd > busyStart2);
    expect(overlapBob).toBe(false);

    // Possible slots: 9-10, 12-14, 16-18
    // Algorithm usually picks first available if no preferences
    // 9-10 is valid.
  });
});
