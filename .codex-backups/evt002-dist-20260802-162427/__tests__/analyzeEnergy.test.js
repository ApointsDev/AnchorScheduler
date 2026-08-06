import { AlgorithmService } from "../Services/Algorithms/AlgorithmService.js";
describe('AlgorithmService - Energy Pattern Analysis', function () {
  var service;
  beforeEach(function () {
    service = new AlgorithmService();
  });
  it('should detect high energy periods from historical tasks per day of week', function () {
    // Simulate tasks: 
    // Mondays (Day 1): 9-11am
    // Tuesdays (Day 2): 14-16pm
    var tasks = [];
    var weeks = 4;
    var baseDate = new Date();
    // Adjust baseDate to be a Sunday to make math easier
    baseDate.setDate(baseDate.getDate() - baseDate.getDay());
    for (var w = 0; w < weeks; w++) {
      // Monday
      var monday = new Date(baseDate);
      monday.setDate(baseDate.getDate() + w * 7 + 1);
      tasks.push({
        startTime: new Date(monday.setHours(9, 0, 0, 0)).toISOString()
      });
      tasks.push({
        startTime: new Date(monday.setHours(10, 0, 0, 0)).toISOString()
      });

      // Tuesday
      var tuesday = new Date(baseDate);
      tuesday.setDate(baseDate.getDate() + w * 7 + 2);
      tasks.push({
        startTime: new Date(tuesday.setHours(14, 0, 0, 0)).toISOString()
      });
      tasks.push({
        startTime: new Date(tuesday.setHours(15, 0, 0, 0)).toISOString()
      });
    }
    var periodsMap = service.analyzeEnergyPatterns(tasks);
    console.log('Detected Periods Map:', JSON.stringify(periodsMap, null, 2));

    // Check Monday (1)
    var mondayPeriods = periodsMap[1];
    expect(mondayPeriods).toBeDefined();
    var morning = mondayPeriods.find(function (p) {
      return p.startHour <= 9 && p.endHour >= 11;
    });
    expect(morning).toBeDefined();

    // Check Tuesday (2)
    var tuesdayPeriods = periodsMap[2];
    expect(tuesdayPeriods).toBeDefined();
    var afternoon = tuesdayPeriods.find(function (p) {
      return p.startHour <= 14 && p.endHour >= 16;
    });
    expect(afternoon).toBeDefined();

    // Check Sunday (0) - Should be empty
    var sundayPeriods = periodsMap[0];
    expect(sundayPeriods).toBeDefined();
    expect(sundayPeriods.length).toBe(0);
  });
});