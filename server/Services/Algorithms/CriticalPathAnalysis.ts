import { CriticalPathInput, CriticalPathResult, PerformanceMetrics } from './types';
import { performance } from 'perf_hooks';

export class CriticalPathAnalysis {
  public analyze(input: CriticalPathInput): CriticalPathResult & { metrics: PerformanceMetrics } {
    const startTime = performance.now();
    const { tasks, startDate } = input;
    const taskMap = new Map<string, typeof tasks[0]>();
    const adj = new Map<string, string[]>(); // Adjacency list (successors)
    const revAdj = new Map<string, string[]>(); // Reverse adjacency list (predecessors)
    const inDegree = new Map<string, number>();

    // 1. Initialize and Calculate Durations (PERT if applicable)
    const durations = new Map<string, number>();
    
    tasks.forEach(task => {
      taskMap.set(task.id, task);
      adj.set(task.id, []);
      revAdj.set(task.id, []);
      inDegree.set(task.id, 0);

      let duration = task.duration;
      if (task.optimistic !== undefined && task.pessimistic !== undefined && task.mostLikely !== undefined) {
        // PERT Formula: (O + 4M + P) / 6
        duration = (task.optimistic + 4 * task.mostLikely + task.pessimistic) / 6;
      }
      durations.set(task.id, duration);
    });

    // 2. Build Graph
    tasks.forEach(task => {
      task.dependencies.forEach(depId => {
        if (!taskMap.has(depId)) {
          throw new Error(`Dependency ${depId} not found for task ${task.id}`);
        }
        adj.get(depId)!.push(task.id);
        revAdj.get(task.id)!.push(depId);
        inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
      });
    });

    // 3. Topological Sort (Kahn's Algorithm) to ensure DAG and get processing order
    const sortedOrder: string[] = [];
    const queue: string[] = [];
    const tempInDegree = new Map(inDegree);

    tasks.forEach(task => {
      if (tempInDegree.get(task.id) === 0) {
        queue.push(task.id);
      }
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      sortedOrder.push(u);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        tempInDegree.set(v, tempInDegree.get(v)! - 1);
        if (tempInDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    if (sortedOrder.length !== tasks.length) {
      throw new Error("Cycle detected in task dependencies. Critical Path Analysis requires a DAG.");
    }

    // 4. Forward Pass (Calculate ES and EF)
    const es = new Map<string, number>();
    const ef = new Map<string, number>();

    // Initialize ES for start nodes (0 relative to start)
    tasks.forEach(task => {
      es.set(task.id, 0);
      ef.set(task.id, durations.get(task.id)!);
    });

    for (const u of sortedOrder) {
      const predecessors = revAdj.get(u) || [];
      let maxPrevEf = 0;
      for (const p of predecessors) {
        if (ef.get(p)! > maxPrevEf) {
          maxPrevEf = ef.get(p)!;
        }
      }
      es.set(u, maxPrevEf);
      ef.set(u, maxPrevEf + durations.get(u)!);
    }

    const projectDuration = Math.max(...Array.from(ef.values()));

    // 5. Backward Pass (Calculate LS and LF)
    const ls = new Map<string, number>();
    const lf = new Map<string, number>();

    // Initialize LF for end nodes (projectDuration)
    tasks.forEach(task => {
      lf.set(task.id, projectDuration);
      ls.set(task.id, projectDuration - durations.get(task.id)!);
    });

    // Process in reverse topological order
    for (let i = sortedOrder.length - 1; i >= 0; i--) {
      const u = sortedOrder[i];
      const successors = adj.get(u) || [];
      
      if (successors.length > 0) {
        let minNextLs = projectDuration;
        for (const v of successors) {
          if (ls.get(v)! < minNextLs) {
            minNextLs = ls.get(v)!;
          }
        }
        lf.set(u, minNextLs);
        ls.set(u, minNextLs - durations.get(u)!);
      } else {
        // If it's a sink node (no successors), its LF is the project duration
        lf.set(u, projectDuration);
        ls.set(u, projectDuration - durations.get(u)!);
      }
    }

    // 6. Calculate Slack and Identify Critical Path
    const slackTimes = new Map<string, number>();
    const criticalPath: string[] = [];
    const taskDetails = new Map<string, any>();
    const earliestStart = new Map<string, Date>();
    const latestStart = new Map<string, Date>();

    const startMs = startDate.getTime();

    // Helper to add minutes to date
    const addMinutes = (dateMs: number, minutes: number) => new Date(dateMs + minutes * 60000);

    tasks.forEach(task => {
      const id = task.id;
      const slack = ls.get(id)! - es.get(id)!;
      // Use a small epsilon for float comparison if needed, but here we use simple numbers
      const isCritical = Math.abs(slack) < 1e-6;

      slackTimes.set(id, slack);
      if (isCritical) {
        criticalPath.push(id);
      }

      const esDate = addMinutes(startMs, es.get(id)!);
      const efDate = addMinutes(startMs, ef.get(id)!);
      const lsDate = addMinutes(startMs, ls.get(id)!);
      const lfDate = addMinutes(startMs, lf.get(id)!);

      earliestStart.set(id, esDate);
      latestStart.set(id, lsDate);

      taskDetails.set(id, {
        es: esDate,
        ef: efDate,
        ls: lsDate,
        lf: lfDate,
        slack,
        isCritical
      });
    });

    // Sort critical path by topological order (or start time)
    criticalPath.sort((a, b) => es.get(a)! - es.get(b)!);

    const endTime = performance.now();

    return {
      criticalPath,
      slackTimes,
      earliestStart,
      latestStart,
      projectDuration,
      taskDetails,
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        solutionQuality: 1.0
      }
    };
  }
}
