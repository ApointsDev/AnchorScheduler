import { CriticalPathAnalysis } from "../Services/Algorithms/CriticalPathAnalysis.js";
describe('CriticalPathAnalysis', function () {
  var analyzer;
  var startDate = new Date('2023-01-01T09:00:00Z');
  beforeEach(function () {
    analyzer = new CriticalPathAnalysis();
  });
  test('should identify critical path in a simple linear sequence', function () {
    var input = {
      startDate: startDate,
      tasks: [{
        id: 'A',
        duration: 60,
        dependencies: []
      }, {
        id: 'B',
        duration: 30,
        dependencies: ['A']
      }, {
        id: 'C',
        duration: 45,
        dependencies: ['B']
      }]
    };
    var result = analyzer.analyze(input);
    expect(result.projectDuration).toBe(135); // 60 + 30 + 45
    expect(result.criticalPath).toEqual(['A', 'B', 'C']);
    expect(result.slackTimes.get('A')).toBe(0);
    expect(result.slackTimes.get('B')).toBe(0);
    expect(result.slackTimes.get('C')).toBe(0);
  });
  test('should identify critical path in a branching graph', function () {
    // A(10) -> B(20) -> D(10) = 40
    // A(10) -> C(50) -> D(10) = 70 (Critical)
    var input = {
      startDate: startDate,
      tasks: [{
        id: 'A',
        duration: 10,
        dependencies: []
      }, {
        id: 'B',
        duration: 20,
        dependencies: ['A']
      }, {
        id: 'C',
        duration: 50,
        dependencies: ['A']
      }, {
        id: 'D',
        duration: 10,
        dependencies: ['B', 'C']
      }]
    };
    var result = analyzer.analyze(input);
    expect(result.projectDuration).toBe(70);
    expect(result.criticalPath).toEqual(['A', 'C', 'D']);

    // Check slack for non-critical task B
    // Path via B is 40, Critical is 70. Difference is 30.
    expect(result.slackTimes.get('B')).toBe(30);
    expect(result.taskDetails.get('B').isCritical).toBe(false);
    expect(result.taskDetails.get('C').isCritical).toBe(true);
  });
  test('should correctly calculate PERT expected duration', function () {
    var input = {
      startDate: startDate,
      tasks: [{
        id: 'A',
        duration: 0,
        // Should be ignored
        dependencies: [],
        optimistic: 10,
        mostLikely: 20,
        pessimistic: 60
      }]
    };
    // Expected = (10 + 4*20 + 60) / 6 = (10 + 80 + 60) / 6 = 150 / 6 = 25

    var result = analyzer.analyze(input);
    expect(result.projectDuration).toBe(25);
    expect(result.taskDetails.get('A').ef.getTime() - result.taskDetails.get('A').es.getTime()).toBe(25 * 60000);
  });
  test('should throw error for cyclic dependencies', function () {
    var input = {
      startDate: startDate,
      tasks: [{
        id: 'A',
        duration: 10,
        dependencies: ['B']
      }, {
        id: 'B',
        duration: 10,
        dependencies: ['A']
      }]
    };
    expect(function () {
      return analyzer.analyze(input);
    }).toThrow("Cycle detected");
  });
  test('should handle complex dependencies correctly', function () {
    //      /-> B(10) -\
    // A(10)            -> D(20) -> F(10)
    //      \-> C(20) -/
    //           \-> E(5) -> G(10)
    //
    // Paths:
    // A-B-D-F: 10+10+20+10 = 50
    // A-C-D-F: 10+20+20+10 = 60 (Critical Path Candidate 1)
    // A-C-E-G: 10+20+5+10 = 45

    var input = {
      startDate: startDate,
      tasks: [{
        id: 'A',
        duration: 10,
        dependencies: []
      }, {
        id: 'B',
        duration: 10,
        dependencies: ['A']
      }, {
        id: 'C',
        duration: 20,
        dependencies: ['A']
      }, {
        id: 'D',
        duration: 20,
        dependencies: ['B', 'C']
      }, {
        id: 'E',
        duration: 5,
        dependencies: ['C']
      }, {
        id: 'F',
        duration: 10,
        dependencies: ['D']
      }, {
        id: 'G',
        duration: 10,
        dependencies: ['E']
      }]
    };
    var result = analyzer.analyze(input);
    expect(result.projectDuration).toBe(60);
    expect(result.criticalPath).toEqual(['A', 'C', 'D', 'F']);

    // Check slack
    // B is on path of length 50, total is 60. Slack = 10?
    // LS(B) = LS(D) - Dur(B). 
    // LF(D) = LS(F) = 60-10 = 50. LS(D) = 50-20 = 30.
    // LS(B) = 30 - 10 = 20.
    // ES(B) = EF(A) = 10.
    // Slack(B) = 20 - 10 = 10. Correct.
    expect(result.slackTimes.get('B')).toBe(10);

    // E is on path A-C-E-G = 45.
    // LF(G) = 60. LS(G) = 50.
    // LF(E) = LS(G) = 50. LS(E) = 50-5 = 45.
    // ES(E) = EF(C) = 10+20 = 30.
    // Slack(E) = 45 - 30 = 15.
    expect(result.slackTimes.get('E')).toBe(15);
  });
});