import { TopologicalSortAlgorithm } from '../TopologicalSort';
import { DDLTask, TopologicalSortInput } from '../types';

describe('TopologicalSort Algorithm', () => {
  let algorithm: TopologicalSortAlgorithm;

  beforeEach(() => {
    algorithm = new TopologicalSortAlgorithm();
  });

  const createTasks = (ids: string[]): DDLTask[] => {
    return ids.map(id => ({
      id,
      name: `Task ${id}`,
      deadline: new Date(),
      estimatedDuration: 60
    }));
  };

  test('should sort linear dependencies correctly', () => {
    // A -> B -> C
    const tasks = createTasks(['A', 'B', 'C']);
    const dependencies: [string, string][] = [['A', 'B'], ['B', 'C']];
    
    const result = algorithm.execute({ tasks, dependencies });
    
    expect(result.hasCycle).toBe(false);
    expect(result.order).toEqual(['A', 'B', 'C']);
    expect(result.levels.get('A')).toBe(0);
    expect(result.levels.get('B')).toBe(1);
    expect(result.levels.get('C')).toBe(2);
  });

  test('should handle parallel tasks (levels)', () => {
    // A -> B
    // A -> C
    // B -> D
    // C -> D
    // Levels: 0:[A], 1:[B, C], 2:[D]
    const tasks = createTasks(['A', 'B', 'C', 'D']);
    const dependencies: [string, string][] = [
      ['A', 'B'],
      ['A', 'C'],
      ['B', 'D'],
      ['C', 'D']
    ];

    const result = algorithm.execute({ tasks, dependencies });

    expect(result.hasCycle).toBe(false);
    expect(result.order[0]).toBe('A');
    expect(result.order[3]).toBe('D');
    // B and C can be in any order, but must be after A and before D
    const bIndex = result.order.indexOf('B');
    const cIndex = result.order.indexOf('C');
    expect(bIndex).toBeGreaterThan(0);
    expect(cIndex).toBeGreaterThan(0);
    expect(bIndex).toBeLessThan(3);
    expect(cIndex).toBeLessThan(3);
    
    expect(result.levels.get('A')).toBe(0);
    expect(result.levels.get('B')).toBe(1);
    expect(result.levels.get('C')).toBe(1);
    expect(result.levels.get('D')).toBe(2);
  });

  test('should detect cycles', () => {
    // A -> B -> A
    const tasks = createTasks(['A', 'B']);
    const dependencies: [string, string][] = [['A', 'B'], ['B', 'A']];

    const result = algorithm.execute({ tasks, dependencies });

    expect(result.hasCycle).toBe(true);
    expect(result.order).toEqual([]);
    expect(result.cycles).toBeDefined();
    expect(result.cycles![0]).toContain('A');
    expect(result.cycles![0]).toContain('B');
  });

  test('should respect priority strategy', () => {
    // A and B are independent. A has priority 1, B has priority 10.
    // Should process B first.
    const tasks = createTasks(['A', 'B']);
    tasks[0].priority = 1;
    tasks[1].priority = 10;
    
    const result = algorithm.execute({ tasks, dependencies: [], strategy: 'priority' });
    
    expect(result.order).toEqual(['B', 'A']);
  });

  test('should respect deadline strategy', () => {
    // A and B are independent. A due tomorrow, B due today.
    // Should process B first.
    const tasks = createTasks(['A', 'B']);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    tasks[0].deadline = tomorrow; // A
    tasks[1].deadline = today;    // B
    
    const result = algorithm.execute({ tasks, dependencies: [], strategy: 'deadline' });
    
    expect(result.order).toEqual(['B', 'A']);
  });
});
