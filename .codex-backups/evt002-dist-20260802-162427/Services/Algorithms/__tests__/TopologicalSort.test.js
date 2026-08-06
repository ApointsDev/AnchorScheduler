import { TopologicalSortAlgorithm } from "../TopologicalSort.js";
describe('TopologicalSort Algorithm', function () {
  var algorithm;
  beforeEach(function () {
    algorithm = new TopologicalSortAlgorithm();
  });
  var createTasks = function createTasks(ids) {
    return ids.map(function (id) {
      return {
        id: id,
        name: "Task ".concat(id),
        deadline: new Date(),
        estimatedDuration: 60
      };
    });
  };
  test('should sort linear dependencies correctly', function () {
    // A -> B -> C
    var tasks = createTasks(['A', 'B', 'C']);
    var dependencies = [['A', 'B'], ['B', 'C']];
    var result = algorithm.execute({
      tasks: tasks,
      dependencies: dependencies
    });
    expect(result.hasCycle).toBe(false);
    expect(result.order).toEqual(['A', 'B', 'C']);
    expect(result.levels.get('A')).toBe(0);
    expect(result.levels.get('B')).toBe(1);
    expect(result.levels.get('C')).toBe(2);
  });
  test('should handle parallel tasks (levels)', function () {
    // A -> B
    // A -> C
    // B -> D
    // C -> D
    // Levels: 0:[A], 1:[B, C], 2:[D]
    var tasks = createTasks(['A', 'B', 'C', 'D']);
    var dependencies = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']];
    var result = algorithm.execute({
      tasks: tasks,
      dependencies: dependencies
    });
    expect(result.hasCycle).toBe(false);
    expect(result.order[0]).toBe('A');
    expect(result.order[3]).toBe('D');
    // B and C can be in any order, but must be after A and before D
    var bIndex = result.order.indexOf('B');
    var cIndex = result.order.indexOf('C');
    expect(bIndex).toBeGreaterThan(0);
    expect(cIndex).toBeGreaterThan(0);
    expect(bIndex).toBeLessThan(3);
    expect(cIndex).toBeLessThan(3);
    expect(result.levels.get('A')).toBe(0);
    expect(result.levels.get('B')).toBe(1);
    expect(result.levels.get('C')).toBe(1);
    expect(result.levels.get('D')).toBe(2);
  });
  test('should detect cycles', function () {
    // A -> B -> A
    var tasks = createTasks(['A', 'B']);
    var dependencies = [['A', 'B'], ['B', 'A']];
    var result = algorithm.execute({
      tasks: tasks,
      dependencies: dependencies
    });
    expect(result.hasCycle).toBe(true);
    expect(result.order).toEqual([]);
    expect(result.cycles).toBeDefined();
    expect(result.cycles[0]).toContain('A');
    expect(result.cycles[0]).toContain('B');
  });
  test('should respect priority strategy', function () {
    // A and B are independent. A has priority 1, B has priority 10.
    // Should process B first.
    var tasks = createTasks(['A', 'B']);
    tasks[0].priority = 1;
    tasks[1].priority = 10;
    var result = algorithm.execute({
      tasks: tasks,
      dependencies: [],
      strategy: 'priority'
    });
    expect(result.order).toEqual(['B', 'A']);
  });
  test('should respect deadline strategy', function () {
    // A and B are independent. A due tomorrow, B due today.
    // Should process B first.
    var tasks = createTasks(['A', 'B']);
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tasks[0].deadline = tomorrow; // A
    tasks[1].deadline = today; // B

    var result = algorithm.execute({
      tasks: tasks,
      dependencies: [],
      strategy: 'deadline'
    });
    expect(result.order).toEqual(['B', 'A']);
  });
});