import { 
  LinearProgrammingInput, 
  LinearProgrammingResult, 
  TimeSlot, 
  TeamMember, 
  Adjustment,
  PerformanceMetrics
} from './types';
import { performance } from 'perf_hooks';

export class LinearProgramming {
  private weights = {
    preference: 1.0,
    adjustmentCost: 1.0,
    fairness: 0.5
  };

  public scheduleMeeting(input: LinearProgrammingInput): LinearProgrammingResult & { metrics: PerformanceMetrics } {
    const startTime = performance.now();
    const { teamMembers, meetingRequirements, timeStep = 30 } = input;
    if (input.weights) {
      this.weights = { ...this.weights, ...input.weights };
    }

    const candidateSlots = this.generateCandidateSlots(
      meetingRequirements.windowStart,
      meetingRequirements.windowEnd,
      meetingRequirements.duration,
      timeStep
    );

    let bestResult: LinearProgrammingResult | null = null;
    let bestObjective = -Infinity; // We want to maximize (Preference - Cost)

    for (const slot of candidateSlots) {
      const evaluation = this.evaluateSlot(slot, teamMembers, meetingRequirements);
      
      if (evaluation.isValid) {
        // Objective: Maximize Preference - Minimize Cost
        // We can normalize this. Let's say Objective = (Preference * w_p) - (Cost * w_c)
        const objective = (evaluation.totalPreference * this.weights.preference) - 
                          (evaluation.totalCost * this.weights.adjustmentCost);

        if (objective > bestObjective) {
          bestObjective = objective;
          bestResult = {
            optimalTime: slot,
            participants: evaluation.participants,
            adjustments: evaluation.adjustments,
            totalCost: evaluation.totalCost,
            objectiveValue: objective,
            status: 'optimal' // We'll mark the best found as optimal at the end
          };
        }
      }
    }

    if (!bestResult) {
      const endTime = performance.now();
      return {
        optimalTime: null,
        participants: [],
        adjustments: new Map(),
        totalCost: 0,
        objectiveValue: 0,
        status: 'infeasible',
        metrics: {
          executionTime: endTime - startTime,
          memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
          solutionQuality: 0
        }
      };
    }

    const endTime = performance.now();
    return {
      ...bestResult,
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        solutionQuality: bestResult.objectiveValue
      }
    };
  }

  private generateCandidateSlots(start: Date, end: Date, durationMinutes: number, stepMinutes: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let current = new Date(start.getTime());
    const endMs = end.getTime();
    const durationMs = durationMinutes * 60000;

    while (current.getTime() + durationMs <= endMs) {
      slots.push({
        id: `slot-${current.getTime()}`,
        start: new Date(current),
        end: new Date(current.getTime() + durationMs)
      });
      current = new Date(current.getTime() + stepMinutes * 60000);
    }
    return slots;
  }

  private evaluateSlot(
    slot: TimeSlot, 
    members: TeamMember[], 
    requirements: { requiredParticipants: string[], optionalParticipants?: string[] }
  ): { 
    isValid: boolean; 
    totalCost: number; 
    totalPreference: number; 
    participants: string[]; 
    adjustments: Map<string, Adjustment>;
  } {
    let totalCost = 0;
    let totalPreference = 0;
    const participants: string[] = [];
    const adjustments = new Map<string, Adjustment>();
    let isValid = true;

    const requiredSet = new Set(requirements.requiredParticipants);
    const optionalSet = new Set(requirements.optionalParticipants || []);

    for (const member of members) {
      // 1. Check Conflicts (Cost)
      let conflictCost = 0;
      let hasConflict = false;
      
      for (const busy of member.busySlots) {
        const overlap = this.getOverlapDuration(slot, busy);
        if (overlap > 0) {
          hasConflict = true;
          // Cost proportional to overlap duration (e.g. 1 cost per minute)
          conflictCost += overlap; 
        }
      }

      // 2. Check Preference (Benefit)
      let preferenceScore = 0;
      for (const pref of member.preferences) {
        const overlap = this.getOverlapDuration(slot, pref);
        if (overlap > 0) {
          preferenceScore += overlap; // Score proportional to overlap
        }
      }

      // 3. Determine Participation
      if (requiredSet.has(member.id)) {
        if (hasConflict) {
          if (conflictCost > member.maxAdjustmentCost) {
            isValid = false; // Required member cannot adjust
            break; 
          } else {
            // Member adjusts
            adjustments.set(member.id, {
              memberId: member.id,
              cost: conflictCost,
              reason: "Conflict with existing task"
            });
            totalCost += conflictCost;
            participants.push(member.id);
          }
        } else {
          participants.push(member.id);
        }
        totalPreference += preferenceScore;
      } else if (optionalSet.has(member.id)) {
        if (hasConflict) {
           // Optional member only joins if cost is low enough (e.g. < maxAdjustmentCost)
           // Or maybe we assume optional members don't reschedule if there is a conflict?
           // Let's assume they join if cost <= maxAdjustmentCost
           if (conflictCost <= member.maxAdjustmentCost) {
             adjustments.set(member.id, {
               memberId: member.id,
               cost: conflictCost,
               reason: "Conflict (Optional)"
             });
             totalCost += conflictCost;
             participants.push(member.id);
             totalPreference += preferenceScore;
           }
        } else {
          participants.push(member.id);
          totalPreference += preferenceScore;
        }
      }
    }

    return { isValid, totalCost, totalPreference, participants, adjustments };
  }

  private hasOverlap(a: TimeSlot, b: TimeSlot): boolean {
    return a.start < b.end && a.end > b.start;
  }

  private getOverlapDuration(a: TimeSlot, b: TimeSlot): number {
    const start = a.start > b.start ? a.start : b.start;
    const end = a.end < b.end ? a.end : b.end;
    if (start >= end) return 0;
    return (end.getTime() - start.getTime()) / 60000; // Minutes
  }
}
