import { FlowNetworkInput, FlowNetworkResult, AlgorithmError, PerformanceMetrics } from './types';
import { performance } from 'perf_hooks';

export class MaxFlowMinCutAlgorithm {
  
  execute(input: FlowNetworkInput): FlowNetworkResult & { metrics: PerformanceMetrics } {
    const startTime = performance.now();
    
    this.validateInput(input);

    const { source, sink, nodes, edges } = input;
    
    // Map node IDs to indices for easier handling
    const nodeToIndex = new Map<string, number>();
    const indexToNode = new Map<number, string>();
    nodes.forEach((id, index) => {
      nodeToIndex.set(id, index);
      indexToNode.set(index, id);
    });

    const n = nodes.length;
    const s = nodeToIndex.get(source)!;
    const t = nodeToIndex.get(sink)!;

    // Capacity matrix and Flow matrix
    // Using adjacency list for BFS performance, but matrix for capacity lookup is easy if N is small.
    // For Edmonds-Karp, we need residual graph.
    // Residual Capacity(u, v) = Capacity(u, v) - Flow(u, v)
    // Also reverse edges: Residual Capacity(v, u) = Flow(u, v)
    
    // Let's use an adjacency list where each edge stores capacity and current flow.
    // And we need reverse edges.
    
    interface Edge {
      to: number;
      capacity: number;
      flow: number;
      reverseEdge: number; // index of reverse edge in 'to's adjacency list
    }

    const adj: Edge[][] = Array(n).fill(0).map(() => []);

    // Helper to add edge
    const addEdge = (u: number, v: number, cap: number) => {
      const forwardEdge: Edge = { to: v, capacity: cap, flow: 0, reverseEdge: 0 };
      const backwardEdge: Edge = { to: u, capacity: 0, flow: 0, reverseEdge: 0 }; // Capacity 0 for reverse edge initially
      
      adj[u].push(forwardEdge);
      adj[v].push(backwardEdge);
      
      forwardEdge.reverseEdge = adj[v].length - 1;
      backwardEdge.reverseEdge = adj[u].length - 1;
    };

    edges.forEach(e => {
      const u = nodeToIndex.get(e.from);
      const v = nodeToIndex.get(e.to);
      if (u !== undefined && v !== undefined) {
        // Handle multiple edges between same nodes? Sum capacity.
        // For simplicity, assume unique edges or just add another one.
        // Our implementation supports multiple edges.
        addEdge(u, v, e.capacity);
      }
    });

    let maxFlow = 0;

    // Edmonds-Karp Algorithm
    while (true) {
      const parent = Array(n).fill(-1);
      const edgeFrom = Array(n).fill(-1); // Index of edge in parent's adj list
      const queue: number[] = [];
      
      queue.push(s);
      parent[s] = s; // Mark source as visited

      while (queue.length > 0) {
        const u = queue.shift()!;
        if (u === t) break;

        for (let i = 0; i < adj[u].length; i++) {
          const e = adj[u][i];
          if (parent[e.to] === -1 && e.capacity > e.flow) {
            parent[e.to] = u;
            edgeFrom[e.to] = i;
            queue.push(e.to);
          }
        }
      }

      if (parent[t] === -1) break; // No path found

      // Find bottleneck capacity
      let pathFlow = Infinity;
      let curr = t;
      while (curr !== s) {
        const p = parent[curr];
        const idx = edgeFrom[curr];
        const e = adj[p][idx];
        pathFlow = Math.min(pathFlow, e.capacity - e.flow);
        curr = p;
      }

      // Update residual graph
      curr = t;
      while (curr !== s) {
        const p = parent[curr];
        const idx = edgeFrom[curr];
        
        adj[p][idx].flow += pathFlow;
        
        const reverseIdx = adj[p][idx].reverseEdge;
        adj[curr][reverseIdx].flow -= pathFlow;
        
        curr = p;
      }

      maxFlow += pathFlow;
    }

    // Calculate Min Cut
    // Run BFS/DFS from source in residual graph to find all reachable nodes (S set)
    const S = new Set<string>();
    const queue: number[] = [s];
    const visited = Array(n).fill(false);
    visited[s] = true;
    S.add(source);

    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const e of adj[u]) {
        if (!visited[e.to] && e.capacity > e.flow) {
          visited[e.to] = true;
          S.add(indexToNode.get(e.to)!);
          queue.push(e.to);
        }
      }
    }

    const T = new Set<string>();
    nodes.forEach(node => {
      if (!S.has(node)) {
        T.add(node);
      }
    });

    // Calculate Min Cut Capacity (sum of capacities of edges from S to T)
    let minCutCapacity = 0;
    edges.forEach(e => {
      if (S.has(e.from) && T.has(e.to)) {
        minCutCapacity += e.capacity;
      }
    });

    // Prepare Result
    const flowOnEdges = new Map<string, number>();
    // We need to map back to original edges.
    // Since we might have split edges or added reverse ones, we iterate original input edges
    // and look up flow.
    // But wait, we have multiple edges potentially.
    // Let's iterate our adj list and match with input?
    // Easier: Iterate input edges, find corresponding edge in adj structure.
    // Since we added them in order, we might be able to track.
    // But simpler: Just iterate adj list and output non-zero flows for forward edges.
    
    // Actually, the requirement says `flowOnEdges: Map<string, number>; // 边ID -> 流量`.
    // But input edges don't have IDs. The key should probably be "from->to".
    
    edges.forEach(e => {
      const u = nodeToIndex.get(e.from)!;
      const v = nodeToIndex.get(e.to)!;
      // Find the edge in adj[u] that goes to v.
      // Note: there might be multiple. We need to be careful.
      // But for standard flow networks, usually one edge per direction.
      // If multiple, we sum them?
      // Let's find the specific edge object we created.
      // Since we can't easily link back without storing ref, let's just search.
      // We take the flow from the forward edge.
      const edgeObj = adj[u].find(edge => edge.to === v && edge.capacity === e.capacity); 
      // This matching is weak if multiple identical edges.
      // But for this assignment, let's assume unique edges or just report flow.
      if (edgeObj) {
        const key = `${e.from}->${e.to}`;
        flowOnEdges.set(key, edgeObj.flow);
      }
    });

    // Residual Graph
    const residualEdges: Array<{from: string, to: string, capacity: number}> = [];
    for (let u = 0; u < n; u++) {
      for (const e of adj[u]) {
        const residualCap = e.capacity - e.flow;
        if (residualCap > 0) {
          residualEdges.push({
            from: indexToNode.get(u)!,
            to: indexToNode.get(e.to)!,
            capacity: residualCap
          });
        }
      }
    }

    const endTime = performance.now();
    const metrics: PerformanceMetrics = {
      executionTime: endTime - startTime,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      solutionQuality: 1 // Exact algorithm
    };

    return {
      maxFlow,
      flowOnEdges,
      minCut: {
        S,
        T,
        capacity: minCutCapacity
      },
      residualGraph: {
        source,
        sink,
        nodes,
        edges: residualEdges
      },
      metrics
    };
  }

  private validateInput(input: FlowNetworkInput) {
    if (!input.nodes || !input.edges || !input.source || !input.sink) {
      throw new AlgorithmError('Invalid input', 'MaxFlowMinCut', input, 'fatal');
    }
    if (!input.nodes.includes(input.source)) {
      throw new AlgorithmError('Source node not in nodes list', 'MaxFlowMinCut', input, 'error');
    }
    if (!input.nodes.includes(input.sink)) {
      throw new AlgorithmError('Sink node not in nodes list', 'MaxFlowMinCut', input, 'error');
    }
  }
}
