import { BipartiteMatchingInput, BipartiteMatchingResult, AlgorithmError, PerformanceMetrics } from './types';
import { performance } from 'perf_hooks';

export class HungarianAlgorithm {
  
  execute(input: BipartiteMatchingInput): BipartiteMatchingResult & { metrics: PerformanceMetrics } {
    const startTime = performance.now();
    
    this.validateInput(input);

    const { leftNodes, rightNodes, costMatrix } = input;
    const n = leftNodes.length;
    const m = rightNodes.length;
    
    // Handle required matches by forcing cost to -Infinity (or very low) and others in same row/col to Infinity?
    // Or just pre-assign and remove from matrix.
    // For simplicity, let's modify cost matrix for required matches to be very low (M), 
    // but we must ensure they are picked.
    // A better way is to treat them as "already matched" but Hungarian is global.
    // Let's use a large negative number for required matches to ensure they are picked if possible.
    // However, if we want to strictly enforce, we should verify after.
    
    // We need a square matrix for the standard algorithm.
    // Size = max(n, m).
    const size = Math.max(n, m);
    const bigM = 1e15; // Infinity representation for internal logic
    
    // Build square weight matrix (Max Weight matching).
    // Since input is Cost (Min Cost), we convert: Weight = MaxVal - Cost.
    // But we also have "Infinity" costs in input which mean "Forbidden".
    // If Cost = Infinity, Weight = -Infinity.
    
    // Find max finite cost to determine inversion base
    let maxFiniteCost = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (costMatrix[i][j] !== Infinity && costMatrix[i][j] > maxFiniteCost) {
          maxFiniteCost = costMatrix[i][j];
        }
      }
    }
    
    // Weight matrix
    const weights = Array(size).fill(0).map(() => Array(size).fill(0));
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i < n && j < m) {
          const c = costMatrix[i][j];
          if (c === Infinity) {
            weights[i][j] = -bigM; // Forbidden
          } else {
            // Invert cost to weight. 
            // We want Min Cost. 
            // Max(Weight) <=> Min(Cost).
            // Weight = (maxFiniteCost + 1) - Cost.
            // So smaller cost => larger weight.
            weights[i][j] = (maxFiniteCost + 1) - c;
          }
          
          // Handle required matches
          if (input.constraints?.requiredMatches) {
             const isRequired = input.constraints.requiredMatches.some(
               ([l, r]) => l === leftNodes[i] && r === rightNodes[j]
             );
             if (isRequired) {
               weights[i][j] += bigM * 10; // Super high weight
             }
          }
        } else {
          // Dummy nodes (padding)
          // Edges to/from dummy nodes have 0 weight (cost = maxFiniteCost + 1 effectively if we consider them valid options to "drop" tasks)
          // Actually, 0 weight in Max Weight matching means "neutral".
          // If we want to allow tasks to be unmatched (if cost is too high), we need to be careful.
          // But Hungarian always finds a perfect matching in the square matrix.
          // If we match a real task to a dummy slot, it means the task is unassigned.
          // The weight of 0 is fine.
          weights[i][j] = 0;
        }
      }
    }

    // --- KM Algorithm Implementation (O(N^3)) ---
    const lx = Array(size).fill(0); // Label X
    const ly = Array(size).fill(0); // Label Y
    const matchY = Array(size).fill(-1); // matchY[y] = x (y matched to x)
    const way = Array(size).fill(0);
    const slack = Array(size).fill(0);
    
    // Initialize lx with max weights in each row
    for (let i = 0; i < size; i++) {
      let maxW = -Infinity;
      for (let j = 0; j < size; j++) {
        if (weights[i][j] > maxW) maxW = weights[i][j];
      }
      lx[i] = maxW;
    }

    // For each row i
    for (let i = 0; i < size; i++) {
      const minV = Array(size).fill(Infinity);
      const usedY = Array(size).fill(false);
      
      // matchY[0] is dummy? No, let's use 0-based indexing carefully.
      // Standard implementation often uses 1-based indexing or a '0' dummy column.
      // Let's use a slightly different approach:
      // We try to find an augmenting path for row i.
      
      // Using the array-based implementation which is O(N^3)
      // Based on a common competitive programming template
      
      let p = 0;
      matchY[0] = i; 
      // We need matchY to be size+1 and way to be size+1 if we use the 1-based trick with matchY[0] as current row
      // Let's adjust arrays to size+1
      const match = Array(size + 1).fill(0); // match[j] = i (column j matched to row i). j=0 is dummy.
      const u = Array(size + 1).fill(0); // potentials for rows
      const v = Array(size + 1).fill(0); // potentials for cols
      const pArr = Array(size + 1).fill(0); // pArr[j] points to predecessor column in path
      const wayArr = Array(size + 1).fill(0); // wayArr[j] stores the row that selected column j
      
      // Re-initialize weights for 1-based indexing
      const w = Array(size + 1).fill(0).map(() => Array(size + 1).fill(0));
      for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
          w[r+1][c+1] = weights[r][c];
        }
      }

      // Reset match
      match.fill(0);
      u.fill(0);
      v.fill(0);
      
      // The loop over rows
      for (let i = 1; i <= size; i++) {
        match[0] = i;
        let j0 = 0;
        const minv = Array(size + 1).fill(Infinity);
        const used = Array(size + 1).fill(false);
        
        do {
          used[j0] = true;
          const i0 = match[j0];
          let delta = Infinity;
          let j1 = 0;
          
          for (let j = 1; j <= size; j++) {
            if (!used[j]) {
              const cur = u[i0] + v[j] - w[i0][j];
              if (cur < minv[j]) {
                minv[j] = cur;
                wayArr[j] = j0;
              }
              if (minv[j] < delta) {
                delta = minv[j];
                j1 = j;
              }
            }
          }
          
          for (let j = 0; j <= size; j++) {
            if (used[j]) {
              u[match[j]] -= delta;
              v[j] += delta;
            } else {
              minv[j] -= delta;
            }
          }
          j0 = j1;
        } while (match[j0] !== 0);
        
        do {
          const j1 = wayArr[j0];
          match[j0] = match[j1];
          j0 = j1;
        } while (j0 !== 0);
      }
      
      // Extract result
      // match[j] = i means Column j is matched with Row i
      // We need Row -> Column
      const rowToCol = new Map<number, number>();
      for (let j = 1; j <= size; j++) {
        if (match[j] !== 0) {
          rowToCol.set(match[j] - 1, j - 1);
        }
      }
      
      // Construct result
      const matches = new Map<string, string>();
      const assignmentMatrix = Array(n).fill(0).map(() => Array(m).fill(0));
      let totalCost = 0;
      
      for (let i = 0; i < n; i++) {
        if (rowToCol.has(i)) {
          const j = rowToCol.get(i)!;
          if (j < m) {
            // Real match
            const cost = costMatrix[i][j];
            if (cost !== Infinity) {
              matches.set(leftNodes[i], rightNodes[j]);
              assignmentMatrix[i][j] = 1;
              totalCost += cost;
            }
          }
        }
      }

      const endTime = performance.now();
      const metrics: PerformanceMetrics = {
        executionTime: endTime - startTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        solutionQuality: 1 // Optimal
      };

      return {
        matches,
        totalCost,
        assignmentMatrix,
        metrics
      };
    }
    
    // Fallback return (should be unreachable inside loop logic but TS needs it)
    return {
        matches: new Map(),
        totalCost: 0,
        assignmentMatrix: [],
        metrics: { executionTime: 0, memoryUsage: 0, solutionQuality: 0 }
    };
  }

  private validateInput(input: BipartiteMatchingInput) {
    if (!input.leftNodes || !input.rightNodes || !input.costMatrix) {
      throw new AlgorithmError('Invalid input', 'HungarianAlgorithm', input, 'fatal');
    }
    if (input.costMatrix.length !== input.leftNodes.length) {
      throw new AlgorithmError('Cost matrix rows must match left nodes', 'HungarianAlgorithm', input, 'error');
    }
    if (input.costMatrix.length > 0 && input.costMatrix[0].length !== input.rightNodes.length) {
      throw new AlgorithmError('Cost matrix columns must match right nodes', 'HungarianAlgorithm', input, 'error');
    }
  }
}
