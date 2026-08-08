import { CommunityDetectionInput, CommunityDetectionResult, AlgorithmError, PerformanceMetrics, Graph } from './types';
import { performance } from 'perf_hooks';

export class CommunityDetectionAlgorithm {
  
  execute(input: CommunityDetectionInput): CommunityDetectionResult & { metrics: PerformanceMetrics } {
    const startTime = performance.now();
    
    this.validateInput(input);

    const { graph, resolution = 1.0, iterations = 10 } = input;
    
    // Louvain Algorithm Implementation
    // Phase 1: Modularity Optimization (Local moving of nodes)
    // Phase 2: Community Aggregation (Building a new graph where nodes are communities)
    // Repeat until no improvement.

    // Data structures
    // We need an efficient graph representation.
    // Node IDs are strings. Map to indices 0..N-1.
    const nodeIds = Array.from(graph.nodes.keys());
    const nodeToIndex = new Map<string, number>();
    nodeIds.forEach((id, idx) => nodeToIndex.set(id, idx));
    const n = nodeIds.length;

    // Adjacency list with weights
    // adj[i] = [{ neighbor: j, weight: w }, ...]
    const adj: { neighbor: number, weight: number }[][] = Array(n).fill(0).map(() => []);
    let totalWeight = 0; // m (or 2m if undirected)

    graph.edges.forEach(e => {
      const u = nodeToIndex.get(e.from);
      const v = nodeToIndex.get(e.to);
      if (u !== undefined && v !== undefined) {
        const w = e.weight || 1;
        adj[u].push({ neighbor: v, weight: w });
        // Assuming undirected graph for Louvain usually.
        // If input edges are directed, we might treat as undirected or use directed modularity.
        // Standard Louvain is for undirected.
        // Check if reverse edge exists in input?
        // The GraphUtils usually adds both directions for undirected.
        // Let's assume input edges cover connectivity.
        // If graph is directed, we treat it as undirected for community detection usually, or sum weights.
        // Let's assume the input `graph.edges` contains (u,v) and (v,u) if undirected, or we treat it as such.
        // To be safe, let's build a symmetric adjacency matrix/list.
        // But wait, if we duplicate, totalWeight doubles.
        // Let's just process edges as given.
        totalWeight += w;
      }
    });

    // If graph is undirected, totalWeight is sum of all edge weights (which is 2 * sum of unique edge weights).
    // Modularity formula uses m = sum of weights / 2.
    // Let's assume totalWeight here is sum of all entries in adjacency list.
    const m = totalWeight / 2;

    // Current state
    const currentCommunities = Array(n).fill(0).map((_, i) => i); // Each node in its own community initially
    const hierarchy: Array<{ level: number, communities: Map<string, number>, modularity: number }> = [];
    
    // Helper to calculate modularity Q
    // Q = (1/2m) * sum_ij [ (A_ij - k_i*k_j/(2m)) * delta(c_i, c_j) ]
    // Simplified: sum_c [ (Sigma_in / 2m) - (Sigma_tot / 2m)^2 ]
    // Sigma_in: sum of weights of edges inside community c
    // Sigma_tot: sum of weights of edges incident to nodes in community c
    
    // We need to track:
    // - nodeWeight[i] (k_i): sum of weights of edges incident to node i
    // - commWeightIn[c] (Sigma_in): sum of weights inside community c
    // - commWeightTot[c] (Sigma_tot): sum of weights incident to community c
    
    // Initial node weights (degrees)
    const nodeWeight = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (const edge of adj[i]) {
        nodeWeight[i] += edge.weight;
      }
    }

    // Initial community state (each node is a community)
    const commWeightIn = Array(n).fill(0); // Self-loops only initially
    const commWeightTot = [...nodeWeight]; // Total weight is just node weight
    
    // Handle self-loops for commWeightIn
    for (let i = 0; i < n; i++) {
      for (const edge of adj[i]) {
        if (edge.neighbor === i) {
          commWeightIn[i] += edge.weight;
        }
      }
    }

    let currentGraph = { adj, nodeWeight, n };
    let level = 0;
    let improvement = true;

    // Mapping from original nodes to current level nodes
    // At level 0: original -> 0..N-1
    // At level 1: community_id_level_0 -> 0..M-1
    // We need to track the mapping from Original Node -> Final Community
    let nodeToCommunity = Array(n).fill(0).map((_, i) => i);

    while (improvement && level < iterations) {
      improvement = false;
      
      // Phase 1: Modular Optimization
      let moved = true;
      let anyMove = false;
      let pass = 0;
      const maxPasses = 20; // Avoid infinite loops in phase 1

      // Working variables for this level
      const localComm = Array(currentGraph.n).fill(0).map((_, i) => i);
      const localCommIn = [...commWeightIn];
      const localCommTot = [...commWeightTot];
      
      // We need to re-calculate these for the current graph structure if level > 0
      // But we update them incrementally.
      
      while (moved && pass < maxPasses) {
        moved = false;
        pass++;

        for (let i = 0; i < currentGraph.n; i++) {
          const oldComm = localComm[i];
          const ki = currentGraph.nodeWeight[i];
          
          // Remove i from oldComm
          // Calculate modularity gain for removing i
          // We don't need exact Q, just delta Q.
          // Formula for gain of moving i to comm C:
          // Delta Q = [ (Sigma_in + 2*ki_in) / 2m - ((Sigma_tot + ki) / 2m)^2 ] - [ (Sigma_in / 2m) - (Sigma_tot / 2m)^2 - (ki / 2m)^2 ]
          // Simplified: Delta Q ~ ki_in - (Sigma_tot * ki) / m
          // ki_in: sum of weights from i to nodes in C
          
          // First, remove from old
          // We just calculate "best community" to move to.
          // If best is oldComm, do nothing.
          
          // Find neighbor communities and weights
          const neighborComms = new Map<number, number>(); // CommID -> Weight from i
          for (const edge of currentGraph.adj[i]) {
            if (edge.neighbor !== i) { // Ignore self-loops for neighbor calculation
              const neighborC = localComm[edge.neighbor];
              neighborComms.set(neighborC, (neighborComms.get(neighborC) || 0) + edge.weight);
            }
          }

          // Remove i from oldComm stats (temporarily for calculation)
          localCommTot[oldComm] -= ki;
          // localCommIn update is complex because it involves edges *within*.
          // But we only need Sigma_tot for the formula usually.
          // Let's use the standard formula:
          // Gain = (ki_in / 2m) - (Sigma_tot * ki / (2m^2)) * resolution
          // We want to maximize this.
          
          // Remove i from old community effectively
          // We compare placing i in oldComm vs neighbors.
          
          const bestComm = oldComm;
          const maxGain = 0; // Gain must be positive to move (or better than staying 0)
          
          // Calculate gain for staying (or rather, cost of removing? No, just compare gains)
          // Actually, standard way: Remove i, then insert into best neighbor.
          // If best neighbor is old one, no move.
          
          // Weight from i to oldComm
          const w_to_old = neighborComms.get(oldComm) || 0;
          const gainOld = w_to_old - (localCommTot[oldComm] * ki * resolution) / (2 * m); 
          // Note: 2*m is constant. We can optimize.
          // Gain ~ 2*m*w_to_c - Sigma_tot * ki * resolution
          
          const bestScore = gainOld; // Start with staying score (actually we compare diff, but absolute score works if consistent)
          // Wait, the formula is for *change*.
          // Let's calculate Delta Q for moving from Isolated to C.
          // But i is currently in oldComm.
          // Easier: Remove i from oldComm. Then find best C to insert.
          
          // Remove i
          // localCommTot[oldComm] -= ki; // Already done above? No, let's do it now.
          // We need to be careful with state.
          // Let's just iterate neighbors and check "What if I move to C?"
          // Delta = Q_new - Q_old.
          // Q_old is fixed. We just maximize Q_new.
          // Q_new(C) contribution = ...
          
          // Let's use the standard "Gain" formula which is change in modularity.
          // Delta Q (i -> C) = [ k_i,in / m ] - [ k_i * Sigma_tot / (2 * m^2) ]
          // We want to maximize this.
          
          // Current community contribution (before removal)
          // We can just find C that maximizes: k_i,in - (Sigma_tot * k_i / (2m))
          // Note: Sigma_tot includes k_i if i is in C.
          // So if we consider i *removed*, then for target C:
          // Score = k_i,in - (Sigma_tot_without_i * k_i / (2m))
          
          // 1. Remove i from oldComm
          // We don't actually update arrays until we decide.
          // But for calculation we need Sigma_tot excluding i.
          const sigma_tot_old_minus_i = localCommTot[oldComm]; // Already subtracted ki above? No.
          // Wait, I wrote `localCommTot[oldComm] -= ki;` above.
          // Let's stick to that.
          
          // Score for staying in oldComm
          const k_i_in_old = neighborComms.get(oldComm) || 0;
          const scoreOld = k_i_in_old - (sigma_tot_old_minus_i * ki * resolution) / (2 * m);
          
          let bestC = oldComm;
          let maxScore = scoreOld;
          
          for (const [commId, k_i_in] of neighborComms.entries()) {
            if (commId === oldComm) continue;
            
            const sigma_tot_c = localCommTot[commId]; // i is not in C
            const score = k_i_in - (sigma_tot_c * ki * resolution) / (2 * m);
            
            if (score > maxScore) {
              maxScore = score;
              bestC = commId;
            }
          }
          
          if (bestC !== oldComm) {
            // Move i to bestC
            localComm[i] = bestC;
            // localCommTot[oldComm] -= ki; // Already done
            localCommTot[bestC] += ki;
            
            moved = true;
            anyMove = true;
          } else {
             // Put back
             localCommTot[oldComm] += ki;
          }
        }
      }

      // If no nodes moved in this phase, we are done with optimization for this graph level.
      // If this is the first pass and no moves, we stop completely.
      if (!anyMove && level === 0) {
        improvement = false;
        break; // No need to aggregate
      }
      
      // If moved, we aggregate.
      // But even if not moved in *last* pass, we might have moved in previous passes of this level.
      // So we should aggregate if `pass > 1` or `moved` was true at some point?
      // Actually, `moved` tracks the whole while loop.
      // If we exit the while loop, we have a stable partition.
      // Now we check if this partition is better than previous level (it must be).
      // We aggregate to build next level.
      
      // Renumber communities to 0..k-1
      const newCommIds = new Map<number, number>();
      let nextCommCount = 0;
      const newLocalComm = Array(currentGraph.n).fill(0);
      
      for (let i = 0; i < currentGraph.n; i++) {
        const c = localComm[i];
        if (!newCommIds.has(c)) {
          newCommIds.set(c, nextCommCount++);
        }
        newLocalComm[i] = newCommIds.get(c)!;
      }
      
      // If number of communities equals number of nodes, no aggregation possible (no change).
      if (nextCommCount === currentGraph.n) {
        improvement = false;
        break;
      }

      // Update global node mapping
      // nodeToCommunity maps Original -> Current Level Node
      // We need to update it to Original -> Next Level Node
      const nextNodeToCommunity = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        const currentLevelNode = nodeToCommunity[i];
        nextNodeToCommunity[i] = newLocalComm[currentLevelNode];
      }
      nodeToCommunity = nextNodeToCommunity;

      // Build next level graph
      const nextAdj: { neighbor: number, weight: number }[][] = Array(nextCommCount).fill(0).map(() => []);
      const nextNodeWeight = Array(nextCommCount).fill(0);
      
      // Iterate edges of current graph and aggregate weights
      // Use a map for edge weights between communities to handle multi-edges
      const edgeWeights = new Map<string, number>(); // "u-v" -> weight
      
      for (let i = 0; i < currentGraph.n; i++) {
        const commI = newLocalComm[i];
        for (const edge of currentGraph.adj[i]) {
          const commJ = newLocalComm[edge.neighbor];
          // Add weight to edge (commI, commJ)
          // We store directed edges in map? Or just iterate?
          // Since we iterate all i, we will see (i,j) and (j,i).
          // We want to build adjacency list.
          // Let's accumulate.
          const key = `${commI}-${commJ}`;
          edgeWeights.set(key, (edgeWeights.get(key) || 0) + edge.weight);
        }
      }
      
      // Convert map to adj list
      for (const [key, weight] of edgeWeights.entries()) {
        const [uStr, vStr] = key.split('-');
        const u = parseInt(uStr);
        const v = parseInt(vStr);
        nextAdj[u].push({ neighbor: v, weight });
        // Note: this includes self-loops (u=v)
      }
      
      // Calculate node weights for next level
      for (let i = 0; i < nextCommCount; i++) {
        for (const edge of nextAdj[i]) {
          nextNodeWeight[i] += edge.weight;
        }
      }
      
      // Update current graph
      currentGraph = {
        adj: nextAdj,
        nodeWeight: nextNodeWeight,
        n: nextCommCount
      };
      
      // Calculate modularity for this level
      // Q = sum_c [ (Sigma_in / 2m) - (Sigma_tot / 2m)^2 ]
      // We need Sigma_in and Sigma_tot for the new communities (which are nodes in new graph)
      // Sigma_in of a community (node in new graph) is the weight of its self-loop.
      // Sigma_tot is its node weight.
      
      let currentQ = 0;
      for (let i = 0; i < nextCommCount; i++) {
        let sigmaIn = 0;
        for (const edge of nextAdj[i]) {
          if (edge.neighbor === i) {
            sigmaIn = edge.weight;
            break;
          }
        }
        const sigmaTot = nextNodeWeight[i];
        currentQ += (sigmaIn / (2 * m)) - Math.pow((sigmaTot / (2 * m)), 2);
      }
      
      // Store hierarchy
      const levelCommunities = new Map<string, number>();
      for (let i = 0; i < n; i++) {
        levelCommunities.set(nodeIds[i], nodeToCommunity[i]);
      }
      
      hierarchy.push({
        level: level + 1,
        communities: levelCommunities,
        modularity: currentQ
      });

      level++;
      improvement = true; // Continue to next level
    }

    // Final result
    const communities = new Map<string, number>();
    for (let i = 0; i < n; i++) {
      communities.set(nodeIds[i], nodeToCommunity[i]);
    }
    
    // Final Modularity (from last hierarchy level or calc)
    const finalModularity = hierarchy.length > 0 ? hierarchy[hierarchy.length - 1].modularity : 0; // Should calc initial if level 0

    const endTime = performance.now();
    const metrics: PerformanceMetrics = {
      executionTime: endTime - startTime,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      iterations: level,
      solutionQuality: finalModularity
    };

    return {
      communities,
      modularity: finalModularity,
      hierarchy,
      metrics
    };
  }

  private validateInput(input: CommunityDetectionInput) {
    if (!input.graph) {
      throw new AlgorithmError('Graph is required', 'CommunityDetection', input, 'fatal');
    }
  }
}
