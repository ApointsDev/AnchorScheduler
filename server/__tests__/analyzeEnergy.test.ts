import { AlgorithmService } from '../Services/Algorithms/AlgorithmService';
import { Task } from '../index';

describe('AlgorithmService - Energy Pattern Analysis', () => {
  let service: AlgorithmService;

  beforeEach(() => {
    service = new AlgorithmService();
  });

  it('should detect high energy periods from historical tasks per day of week', () => {
    // Simulate tasks: 
    // Mondays (Day 1): 9-11am
    // Tuesdays (Day 2): 14-16pm
    const tasks: any[] = [];
    const weeks = 4; 
    
    const baseDate = new Date();
    // Adjust baseDate to be a Sunday to make math easier
    baseDate.setDate(baseDate.getDate() - baseDate.getDay()); 

    for (let w = 0; w < weeks; w++) {
        // Monday
        const monday = new Date(baseDate);
        monday.setDate(baseDate.getDate() + (w * 7) + 1);
        tasks.push({ startTime: new Date(monday.setHours(9, 0, 0, 0)).toISOString() });
        tasks.push({ startTime: new Date(monday.setHours(10, 0, 0, 0)).toISOString() });

        // Tuesday
        const tuesday = new Date(baseDate);
        tuesday.setDate(baseDate.getDate() + (w * 7) + 2);
        tasks.push({ startTime: new Date(tuesday.setHours(14, 0, 0, 0)).toISOString() });
        tasks.push({ startTime: new Date(tuesday.setHours(15, 0, 0, 0)).toISOString() });
    }

    const periodsMap = service.analyzeEnergyPatterns(tasks);
    
    console.log('Detected Periods Map:', JSON.stringify(periodsMap, null, 2));
    
    // Check Monday (1)
    const mondayPeriods = periodsMap[1];
    expect(mondayPeriods).toBeDefined();
    const morning = mondayPeriods.find((p: any) => p.startHour <= 9 && p.endHour >= 11);
    expect(morning).toBeDefined();

    // Check Tuesday (2)
    const tuesdayPeriods = periodsMap[2];
    expect(tuesdayPeriods).toBeDefined();
    const afternoon = tuesdayPeriods.find((p: any) => p.startHour <= 14 && p.endHour >= 16);
    expect(afternoon).toBeDefined();
    
    // Check Sunday (0) - Should be empty
    const sundayPeriods = periodsMap[0];
    expect(sundayPeriods).toBeDefined();
    expect(sundayPeriods.length).toBe(0);
  });
});
