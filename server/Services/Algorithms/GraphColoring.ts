import { ColoringInput, ColoringResult, DDLTask, FixedEvent, TimeSlot, AlgorithmError, PerformanceMetrics } from './types';
import { TimeUtils } from './utils/TimeUtils';
import { GraphUtils } from './utils/GraphUtils';
import { performance } from 'perf_hooks';

export class GraphColoringAlgorithm {
  
  async execute(input: ColoringInput): Promise<ColoringResult & { metrics: PerformanceMetrics }> {
    const startTime = performance.now();
    
    // 1. Validate Input
    this.validateInput(input);

    // 2. Pre-process: Identify available slots and occupied slots
    const occupiedSlots = new Set<string>();
    input.fixedEvents.forEach(event => {
      // Find slots that overlap with fixed event
      input.timeSlots.forEach(slot => {
        if (TimeUtils.hasTimeOverlap(slot, { id: 'temp', start: event.startTime, end: event.endTime })) {
          occupiedSlots.add(slot.id);
        }
      });
    });

    // 3. Task Splitting (Simple version: 1 task = 1 node, assuming duration matches slot or we just assign start time)
    // Ideally we split tasks into units. For this implementation, let's assume tasks are atomic units 
    // that fit into one slot, OR we are assigning the *start* slot and checking duration.
    // But DSatur assigns ONE color. If task needs multiple slots, it's complex.
    // Let's assume we split tasks into chunks of slot-duration.
    
    const slotDuration = TimeUtils.timeDifference(input.timeSlots[0].start, input.timeSlots[0].end);
    const taskNodes: { id: string, task: DDLTask, originalId: string }[] = [];
    
    input.tasks.forEach(task => {
      const chunks = Math.ceil(task.estimatedDuration / slotDuration);
      for (let i = 0; i < chunks; i++) {
        taskNodes.push({
          id: `${task.id}_${i}`,
          task: task,
          originalId: task.id
        });
      }
    });

    // 4. Build Graph (Clique for personal schedule)
    // All task nodes conflict with each other
    const adj = new Map<string, Set<string>>();
    taskNodes.forEach(n => adj.set(n.id, new Set()));
    
    for (let i = 0; i < taskNodes.length; i++) {
      for (let j = i + 1; j < taskNodes.length; j++) {
        adj.get(taskNodes[i].id)!.add(taskNodes[j].id);
        adj.get(taskNodes[j].id)!.add(taskNodes[i].id);
      }
    }

    // 5. DSatur Initialization
    const colors = new Map<string, string>(); // NodeID -> SlotID
    const saturation = new Map<string, Set<string>>(); // NodeID -> Set of neighbor colors
    const degrees = new Map<string, number>(); // NodeID -> Uncolored degree
    
    taskNodes.forEach(n => {
      saturation.set(n.id, new Set());
      degrees.set(n.id, adj.get(n.id)!.size);
    });

    const uncolored = new Set(taskNodes.map(n => n.id));
    const conflicts: Array<{ taskId1: string; taskId2: string; reason: string }> = [];

    // 6. Main Loop
    while (uncolored.size > 0) {
      // Pick node with max saturation, then max degree
      let maxSat = -1;
      let maxDeg = -1;
      let selectedNode: string | null = null;

      for (const nodeId of uncolored) {
        const sat = saturation.get(nodeId)!.size;
        const deg = degrees.get(nodeId)!;
        
        if (sat > maxSat || (sat === maxSat && deg > maxDeg)) {
          maxSat = sat;
          maxDeg = deg;
          selectedNode = nodeId;
        }
      }

      if (!selectedNode) break; // Should not happen

      uncolored.delete(selectedNode);
      const nodeObj = taskNodes.find(n => n.id === selectedNode)!;

      // Find first valid color (slot)
      // Valid means:
      // 1. Not in occupiedSlots (fixed events)
      // 2. Not used by neighbors (already colored)
      // 3. Before deadline
      // 4. (Optional) Sequential constraint for split tasks? 
      //    - This is hard in pure DSatur. We might get random slots.
      //    - For now, we ignore sequential constraint and just find ANY slot.
      //    - A better approach for sequential is to treat the task as a block and assign start slot.
      
      let assignedSlot: string | null = null;
      
      // Sort slots by time
      const sortedSlots = [...input.timeSlots].sort((a, b) => a.start.getTime() - b.start.getTime());

      for (const slot of sortedSlots) {
        // Check 1: Fixed events
        if (occupiedSlots.has(slot.id)) continue;

        // Check 2: Neighbors
        let neighborConflict = false;
        const neighbors = adj.get(selectedNode)!;
        for (const neighbor of neighbors) {
          if (colors.get(neighbor) === slot.id) {
            neighborConflict = true;
            break;
          }
        }
        if (neighborConflict) continue;

        // Check 3: Deadline
        if (slot.end > nodeObj.task.deadline) continue;

        // Check 4: Earliest Start
        if (nodeObj.task.earliestStart && slot.start < nodeObj.task.earliestStart) continue;

        // Found valid slot
        assignedSlot = slot.id;
        break;
      }

      if (assignedSlot) {
        colors.set(selectedNode, assignedSlot);
        
        // Update neighbors
        const neighbors = adj.get(selectedNode)!;
        for (const neighbor of neighbors) {
          saturation.get(neighbor)!.add(assignedSlot);
          degrees.set(neighbor, degrees.get(neighbor)! - 1);
        }
      } else {
        // Cannot assign
        conflicts.push({
          taskId1: nodeObj.originalId,
          taskId2: 'RESOURCE_CONSTRAINT',
          reason: 'No available time slot before deadline or due to conflicts'
        });
      }
    }

    // 7. Aggregate results
    // Map chunk assignments back to tasks?
    // The result interface expects TaskID -> SlotID.
    // If we split tasks, we have multiple slots per task.
    // The interface `assignments: Map<string, string>` implies 1 slot per task?
    // Or maybe the value is a string representing the range?
    // Or maybe we should just return the first slot?
    // Let's return the first slot for the task, or change the interface to support multiple slots.
    // But `goal.md` says `assignments: Map<string, string>; // 任务ID -> 时间槽ID`.
    // This implies the task fits in one slot OR the ID represents the start slot.
    // I will assume it maps to the Start Slot ID.
    
    const finalAssignments = new Map<string, string>();
    const taskStartSlots = new Map<string, TimeSlot>();

    taskNodes.forEach(node => {
      const slotId = colors.get(node.id);
      if (slotId) {
        const slot = input.timeSlots.find(s => s.id === slotId)!;
        const currentStart = taskStartSlots.get(node.originalId);
        
        if (!currentStart || slot.start < currentStart.start) {
          taskStartSlots.set(node.originalId, slot);
          finalAssignments.set(node.originalId, slotId);
        }
      }
    });

    const endTime = performance.now();
    const metrics: PerformanceMetrics = {
      executionTime: endTime - startTime,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      solutionQuality: conflicts.length === 0 ? 1 : 1 - (conflicts.length / input.tasks.length)
    };

    return {
      assignments: finalAssignments,
      conflicts,
      utilization: colors.size / input.timeSlots.length,
      metrics
    };
  }

  private validateInput(input: ColoringInput) {
    if (!input.tasks || !input.timeSlots) {
      throw new AlgorithmError('Invalid input: tasks and timeSlots are required', 'GraphColoring', input, 'fatal');
    }
    input.timeSlots.forEach(slot => {
      if (slot.start >= slot.end) {
        throw new AlgorithmError(`Invalid time slot ${slot.id}`, 'GraphColoring', slot, 'error');
      }
    });
  }
}
