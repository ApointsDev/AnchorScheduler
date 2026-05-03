import { MaxFlowMinCutAlgorithm } from '../MaxFlowMinCut';
import { FlowNetworkInput } from '../types';

describe('MaxFlowMinCut Algorithm', () => {
  let algorithm: MaxFlowMinCutAlgorithm;

  beforeEach(() => {
    algorithm = new MaxFlowMinCutAlgorithm();
  });

  test('should calculate max flow correctly for simple network', () => {
    // S -> A (10)
    // S -> B (10)
    // A -> B (2)
    // A -> T (4)
    // B -> T (8)
    // A -> T (4) + A->B->T (2) = 6 from A?
    // S->A (10), S->B (10).
    // Path S->A->T: flow 4. Residual: S->A(6), A->T(0).
    // Path S->B->T: flow 8. Residual: S->B(2), B->T(0).
    // Path S->A->B->T: flow min(6, 2, 0) = 0? No, B->T is full.
    // Wait, B->T capacity 8, used 8.
    // Let's trace manually or trust algorithm.
    // Max Flow should be:
    // S->A->T: 4
    // S->B->T: 8
    // S->A->B->T: min(10-4, 2, 8-8) = 0.
    // Total 12?
    // Actually:
    // S->A (10), A->T (4), A->B (2). A can send 4+2=6. S->A has 10. So A gets 6.
    // S->B (10), B->T (8). B receives 2 from A. Total in B = 10+2=12? No, B out is 8.
    // So B can only handle 8.
    // S->B sends 8? Or S->B sends 6 and A->B sends 2?
    // Max flow is limited by cut.
    // Cut {S, A} -> {B, T}: S->B(10) + A->B(2) + A->T(4) = 16.
    // Cut {S} -> {A, B, T}: S->A(10) + S->B(10) = 20.
    // Cut {S, A, B} -> {T}: A->T(4) + B->T(8) = 12.
    // Min cut is 12. Max flow should be 12.
    
    const input: FlowNetworkInput = {
      source: 'S',
      sink: 'T',
      nodes: ['S', 'A', 'B', 'T'],
      edges: [
        { from: 'S', to: 'A', capacity: 10 },
        { from: 'S', to: 'B', capacity: 10 },
        { from: 'A', to: 'B', capacity: 2 },
        { from: 'A', to: 'T', capacity: 4 },
        { from: 'B', to: 'T', capacity: 8 }
      ]
    };

    const result = algorithm.execute(input);

    expect(result.maxFlow).toBe(12);
    expect(result.minCut.capacity).toBe(12);
  });

  test('should handle disconnected graph', () => {
    const input: FlowNetworkInput = {
      source: 'S',
      sink: 'T',
      nodes: ['S', 'T'],
      edges: []
    };

    const result = algorithm.execute(input);

    expect(result.maxFlow).toBe(0);
    expect(result.minCut.capacity).toBe(0);
    expect(result.minCut.S.has('S')).toBe(true);
    expect(result.minCut.T.has('T')).toBe(true);
  });

  test('should handle complex network', () => {
    // Standard example
    // S -> 1 (16)
    // S -> 2 (13)
    // 1 -> 2 (10)
    // 1 -> 3 (12)
    // 2 -> 1 (4)
    // 2 -> 4 (14)
    // 3 -> 2 (9)
    // 3 -> T (20)
    // 4 -> 3 (7)
    // 4 -> T (4)
    // Max Flow should be 23.
    
    const input: FlowNetworkInput = {
      source: 'S',
      sink: 'T',
      nodes: ['S', '1', '2', '3', '4', 'T'],
      edges: [
        { from: 'S', to: '1', capacity: 16 },
        { from: 'S', to: '2', capacity: 13 },
        { from: '1', to: '2', capacity: 10 },
        { from: '1', to: '3', capacity: 12 },
        { from: '2', to: '1', capacity: 4 },
        { from: '2', to: '4', capacity: 14 },
        { from: '3', to: '2', capacity: 9 },
        { from: '3', to: 'T', capacity: 20 },
        { from: '4', to: '3', capacity: 7 },
        { from: '4', to: 'T', capacity: 4 }
      ]
    };

    const result = algorithm.execute(input);

    expect(result.maxFlow).toBe(23);
  });
});
