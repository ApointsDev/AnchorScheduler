import { CommunityDetectionAlgorithm } from '../CommunityDetection';
import { CommunityDetectionInput, Graph, TaskNode } from '../types';

describe('CommunityDetection Algorithm', () => {
  let algorithm: CommunityDetectionAlgorithm;

  beforeEach(() => {
    algorithm = new CommunityDetectionAlgorithm();
  });

  const createGraph = (nodes: string[], edges: [string, string, number?][]): Graph<TaskNode> => {
    const nodeMap = new Map<string, TaskNode>();
    nodes.forEach(id => nodeMap.set(id, { taskId: id, type: 'test', duration: 60 }));
    
    const graphEdges = edges.map(([from, to, weight]) => ({ from, to, weight: weight || 1 }));
    // Add reverse edges for undirected graph simulation if not provided?
    // The algorithm assumes input edges. Let's provide symmetric edges for tests.
    const symmetricEdges = [...graphEdges];
    graphEdges.forEach(e => {
      symmetricEdges.push({ from: e.to, to: e.from, weight: e.weight });
    });

    return {
      nodes: nodeMap,
      edges: symmetricEdges,
      adjacencyList: new Map() // Not used by algorithm directly, it builds its own
    };
  };

  test('should detect communities in two disconnected cliques', () => {
    // Clique 1: A-B, B-C, A-C
    // Clique 2: D-E, E-F, D-F
    // No connection between 1 and 2
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const edges: [string, string][] = [
      ['A', 'B'], ['B', 'C'], ['A', 'C'],
      ['D', 'E'], ['E', 'F'], ['D', 'F']
    ];
    
    const input: CommunityDetectionInput = {
      graph: createGraph(nodes, edges)
    };

    const result = algorithm.execute(input);

    expect(result.communities.get('A')).toBe(result.communities.get('B'));
    expect(result.communities.get('A')).toBe(result.communities.get('C'));
    
    expect(result.communities.get('D')).toBe(result.communities.get('E'));
    expect(result.communities.get('D')).toBe(result.communities.get('F'));
    
    expect(result.communities.get('A')).not.toBe(result.communities.get('D'));
  });

  test('should detect communities with weak connection', () => {
    // Clique 1: A-B-C
    // Clique 2: D-E-F
    // Weak link: C-D
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const edges: [string, string][] = [
      ['A', 'B'], ['B', 'C'], ['A', 'C'],
      ['D', 'E'], ['E', 'F'], ['D', 'F'],
      ['C', 'D'] // Weak link
    ];
    
    const input: CommunityDetectionInput = {
      graph: createGraph(nodes, edges)
    };

    const result = algorithm.execute(input);

    // Should still separate into two communities
    expect(result.communities.get('A')).toBe(result.communities.get('B'));
    expect(result.communities.get('D')).toBe(result.communities.get('E'));
    expect(result.communities.get('A')).not.toBe(result.communities.get('D'));
  });

  test('should handle single node', () => {
    const nodes = ['A'];
    const edges: [string, string][] = [];
    
    const input: CommunityDetectionInput = {
      graph: createGraph(nodes, edges)
    };

    const result = algorithm.execute(input);

    expect(result.communities.size).toBe(1);
  });
});
