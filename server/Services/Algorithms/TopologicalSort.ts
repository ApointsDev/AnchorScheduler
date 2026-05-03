import { TopologicalSortInput, TopologicalSortResult, AlgorithmError, PerformanceMetrics, DDLTask } from './types';
import { performance } from 'perf_hooks';

export class TopologicalSortAlgorithm {
  
  execute(input: TopologicalSortInput): TopologicalSortResult & { metrics: PerformanceMetrics } {
    const startTime = performance.now();
    
    this.validateInput(input);

    const { tasks, dependencies, strategy = 'default' } = input;
    const taskMap = new Map<string, DDLTask>();
    tasks.forEach(t => taskMap.set(t.id, t));

    // 1. Build Graph and Calculate In-Degrees
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    tasks.forEach(t => {
      adj.set(t.id, []);
      inDegree.set(t.id, 0);
    });

    dependencies.forEach(([from, to]) => {
      if (!taskMap.has(from) || !taskMap.has(to)) {
        // Ignore dependencies for tasks not in the list, or throw?
        // Let's ignore or warn. For strictness, we might want to throw.
        // Assuming valid input for now.
        return;
      }
      adj.get(from)!.push(to);
      inDegree.set(to, (inDegree.get(to) || 0) + 1);
    });

    // 2. Initialize Queue with In-Degree 0
    let queue: string[] = [];
    tasks.forEach(t => {
      if (inDegree.get(t.id) === 0) {
        queue.push(t.id);
      }
    });

    const order: string[] = [];
    const levels = new Map<string, number>();
    let currentLevel = 0;
    let processedCount = 0;

    // 3. Process Queue (Level by Level)
    while (queue.length > 0) {
      // Sort queue based on strategy
      this.sortQueue(queue, strategy, taskMap);

      const nextQueue: string[] = [];
      
      for (const taskId of queue) {
        order.push(taskId);
        levels.set(taskId, currentLevel);
        processedCount++;

        const neighbors = adj.get(taskId) || [];
        for (const neighbor of neighbors) {
          inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
          if (inDegree.get(neighbor) === 0) {
            nextQueue.push(neighbor);
          }
        }
      }

      queue = nextQueue;
      currentLevel++;
    }

    // 4. Check for Cycles
    const hasCycle = processedCount < tasks.length;
    let cycles: string[][] | undefined = undefined;

    if (hasCycle) {
      // Identify nodes involved in cycle (those with inDegree > 0)
      const cycleNodes = tasks.filter(t => (inDegree.get(t.id) || 0) > 0).map(t => t.id);
      // Simple reporting: just return the nodes. 
      // Finding exact simple cycles is complex (Johnson's algorithm), 
      // but we can return the subgraph of remaining nodes.
      cycles = [cycleNodes]; 
    }

    const endTime = performance.now();
    const metrics: PerformanceMetrics = {
      executionTime: endTime - startTime,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      solutionQuality: hasCycle ? 0 : 1
    };

    return {
      order: hasCycle ? [] : order, // If cycle, order is partial/invalid for full execution
      hasCycle,
      levels,
      cycles,
      metrics
    };
  }

  private sortQueue(queue: string[], strategy: string, taskMap: Map<string, DDLTask>) {
    if (strategy === 'default') return;

    queue.sort((a, b) => {
      const taskA = taskMap.get(a)!;
      const taskB = taskMap.get(b)!;

      if (strategy === 'priority') {
        // Higher priority first (assuming higher number = higher priority? Or lower? 
        // Usually priority 1 is high. Let's assume higher number is higher priority for now, 
        // or check DDLTask definition. It says `priority?: number`. 
        // Let's assume standard: higher value = higher priority.
        const pA = taskA.priority || 0;
        const pB = taskB.priority || 0;
        return pB - pA;
      } else if (strategy === 'deadline') {
        // Earlier deadline first
        return taskA.deadline.getTime() - taskB.deadline.getTime();
      }
      return 0;
    });
  }

  private validateInput(input: TopologicalSortInput) {
    if (!input.tasks) {
      throw new AlgorithmError('Tasks are required', 'TopologicalSort', input, 'fatal');
    }
    // Check for self-loops in dependencies
    input.dependencies.forEach(([from, to]) => {
      if (from === to) {
        throw new AlgorithmError(`Self-dependency detected for task ${from}`, 'TopologicalSort', input, 'error');
      }
    });
  }
}
