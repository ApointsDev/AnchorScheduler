# 最大流最小割 (Max Flow Min Cut)

## 算法简介
最大流最小割算法用于在流网络中找到从源点到汇点的最大流量。根据最大流最小割定理，网络的最大流量等于网络的最小割容量。在时间管理系统中，可用于资源分配平衡，例如将时间资源（源点）分配给任务（汇点），确保资源利用最大化且不过载。

## 算法原理
本实现使用 **Edmonds-Karp 算法**，它是 Ford-Fulkerson 方法的一种实现，使用 BFS 寻找增广路径。

1.  **初始化**：所有边的流量设为 0。
2.  **寻找增广路**：
    *   在残余网络中，使用 BFS 从源点寻找一条到汇点的路径（增广路）。
    *   路径上的每条边必须有剩余容量（Capacity - Flow > 0）。
3.  **更新流量**：
    *   计算路径上的瓶颈容量（最小剩余容量）。
    *   增加路径上正向边的流量。
    *   减少路径上反向边的流量（增加反向边的剩余容量）。
4.  **重复**：重复步骤 2-3，直到找不到增广路。
5.  **计算最小割**：
    *   在最终的残余网络中，从源点出发进行 BFS/DFS，所有可达的节点构成集合 S。
    *   其余节点构成集合 T。
    *   跨越 S 到 T 的边的容量之和即为最小割容量。

## 时间复杂度
-   **时间复杂度**：O(V E²)，其中 V 是节点数，E 是边数。
-   **空间复杂度**：O(V + E)。

## 使用示例

```typescript
import { MaxFlowMinCutAlgorithm } from './MaxFlowMinCut';

const algorithm = new MaxFlowMinCutAlgorithm();

// 1. 准备数据
const input = {
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

// 2. 执行算法
const result = algorithm.execute(input);

// 3. 处理结果
console.log(result.maxFlow); // 12
console.log(result.minCut.capacity); // 12
console.log(result.minCut.S); // Set { 'S', 'A', 'B' } (example)
```

## 参数说明
-   `source`: 源点 ID。
-   `sink`: 汇点 ID。
-   `nodes`: 所有节点 ID 列表。
-   `edges`: 边列表，包含 `from`, `to`, `capacity`。

## 适用场景
-   资源分配：将有限的资源（如时间、预算）分配给多个需求。
-   瓶颈分析：识别系统中的瓶颈（最小割）。
-   二分图匹配：可以转换为最大流问题求解。

## 限制与注意事项
-   **容量限制**：容量必须为非负数。
-   **性能**：对于非常稠密的图，Dinic 算法可能比 Edmonds-Karp 更快，但 Edmonds-Karp 实现简单且对于一般规模（V < 1000）足够快。
