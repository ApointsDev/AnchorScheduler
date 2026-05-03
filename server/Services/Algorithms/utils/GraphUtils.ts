import { DDLTask, Graph, GraphEdge } from '../types';

export class GraphUtils {
  static buildGraphFromTasks(tasks: DDLTask[]): Graph<DDLTask> {
    const nodes = new Map<string, DDLTask>();
    tasks.forEach(t => nodes.set(t.id, t));

    const edges: GraphEdge[] = [];
    const adjacencyList = new Map<string, string[]>();
    tasks.forEach(t => adjacencyList.set(t.id, []));

    // For personal schedule, assuming all tasks conflict with each other (clique)
    // unless we have specific logic. 
    // But usually we build conflict graph based on time overlap potential?
    // If we are just scheduling, we might not know overlaps yet.
    // But if this is for "Graph Coloring" to assign slots, the conflict is "Cannot be same slot".
    // If capacity=1, then ALL tasks conflict.
    
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const t1 = tasks[i];
        const t2 = tasks[j];
        
        // Add edge
        edges.push({ from: t1.id, to: t2.id });
        edges.push({ from: t2.id, to: t1.id }); // Undirected usually represented as double directed or handled in logic
        
        adjacencyList.get(t1.id)?.push(t2.id);
        adjacencyList.get(t2.id)?.push(t1.id);
      }
    }

    return { nodes, edges, adjacencyList };
  }

  static findConflicts(tasks: DDLTask[]): GraphEdge[] {
    // This might be used if tasks already have assigned times?
    // Or based on some other constraint.
    // For now, returning clique edges as above.
    const edges: GraphEdge[] = [];
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        edges.push({ from: tasks[i].id, to: tasks[j].id });
      }
    }
    return edges;
  }

  static graphToAdjacencyMatrix(graph: Graph<any>): number[][] {
    const nodeIds = Array.from(graph.nodes.keys());
    const size = nodeIds.length;
    const matrix = Array(size).fill(0).map(() => Array(size).fill(0));
    const idMap = new Map(nodeIds.map((id, index) => [id, index]));

    graph.edges.forEach(edge => {
      const i = idMap.get(edge.from);
      const j = idMap.get(edge.to);
      if (i !== undefined && j !== undefined) {
        matrix[i][j] = edge.weight || 1;
      }
    });

    return matrix;
  }

  static connectedComponents(graph: Graph<any>): string[][] {
    const visited = new Set<string>();
    const components: string[][] = [];

    for (const nodeId of graph.nodes.keys()) {
      if (!visited.has(nodeId)) {
        const component: string[] = [];
        const stack = [nodeId];
        visited.add(nodeId);

        while (stack.length > 0) {
          const current = stack.pop()!;
          component.push(current);

          const neighbors = graph.adjacencyList.get(current) || [];
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              stack.push(neighbor);
            }
          }
        }
        components.push(component);
      }
    }

    return components;
  }

  static findAllPaths(graph: Graph<any>, start: string, end: string): string[][] {
    const paths: string[][] = [];
    const visited = new Set<string>();

    function dfs(current: string, path: string[]) {
      visited.add(current);
      path.push(current);

      if (current === end) {
        paths.push([...path]);
      } else {
        const neighbors = graph.adjacencyList.get(current) || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            dfs(neighbor, path);
          }
        }
      }

      path.pop();
      visited.delete(current);
    }

    dfs(start, []);
    return paths;
  }
}
