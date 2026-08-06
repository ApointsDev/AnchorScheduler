import { HungarianAlgorithm } from "../HungarianAlgorithm.js";
describe('Hungarian Algorithm', function () {
  var algorithm;
  beforeEach(function () {
    algorithm = new HungarianAlgorithm();
  });
  test('should solve simple 2x2 assignment', function () {
    // Task 0 -> Slot 0 (Cost 1)
    // Task 0 -> Slot 1 (Cost 10)
    // Task 1 -> Slot 0 (Cost 10)
    // Task 1 -> Slot 1 (Cost 1)
    // Optimal: 0->0, 1->1 (Total 2)
    var input = {
      leftNodes: ['T1', 'T2'],
      rightNodes: ['S1', 'S2'],
      costMatrix: [[1, 10], [10, 1]]
    };
    var result = algorithm.execute(input);
    expect(result.totalCost).toBe(2);
    expect(result.matches.get('T1')).toBe('S1');
    expect(result.matches.get('T2')).toBe('S2');
  });
  test('should handle unbalanced input (Tasks < Slots)', function () {
    // T1 -> S1 (1), S2 (100)
    // S3 unused
    var input = {
      leftNodes: ['T1'],
      rightNodes: ['S1', 'S2', 'S3'],
      costMatrix: [[1, 100, 100]]
    };
    var result = algorithm.execute(input);
    expect(result.totalCost).toBe(1);
    expect(result.matches.get('T1')).toBe('S1');
    expect(result.matches.size).toBe(1);
  });
  test('should handle unbalanced input (Tasks > Slots)', function () {
    // T1 -> S1 (1)
    // T2 -> S1 (100)
    // Only S1 available. T1 should get it. T2 unmatched.
    var input = {
      leftNodes: ['T1', 'T2'],
      rightNodes: ['S1'],
      costMatrix: [[1], [100]]
    };
    var result = algorithm.execute(input);
    expect(result.totalCost).toBe(1);
    expect(result.matches.get('T1')).toBe('S1');
    expect(result.matches.has('T2')).toBe(false);
  });
  test('should handle Infinity costs (forbidden edges)', function () {
    // T1 -> S1 (Inf), S2 (1)
    // T2 -> S1 (1), S2 (Inf)
    var input = {
      leftNodes: ['T1', 'T2'],
      rightNodes: ['S1', 'S2'],
      costMatrix: [[Infinity, 1], [1, Infinity]]
    };
    var result = algorithm.execute(input);
    expect(result.totalCost).toBe(2);
    expect(result.matches.get('T1')).toBe('S2');
    expect(result.matches.get('T2')).toBe('S1');
  });
  test('should respect required matches', function () {
    // T1 -> S1 (10), S2 (1)
    // T2 -> S1 (1), S2 (10)
    // Normally T1->S2, T2->S1 (Cost 2)
    // Force T1->S1
    var input = {
      leftNodes: ['T1', 'T2'],
      rightNodes: ['S1', 'S2'],
      costMatrix: [[10, 1], [1, 10]],
      constraints: {
        requiredMatches: [['T1', 'S1']]
      }
    };
    var result = algorithm.execute(input);
    expect(result.matches.get('T1')).toBe('S1');
    // T2 will take S2 (Cost 10)
    expect(result.matches.get('T2')).toBe('S2');
    expect(result.totalCost).toBe(20);
  });
});