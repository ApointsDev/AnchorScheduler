# 拓扑排序 (Topological Sort)

## 算法简介
拓扑排序是将有向无环图（DAG）的所有顶点排成一个线性序列，使得对于图中的每一条有向边 (u, v)，顶点 u 在序列中都出现在顶点 v 之前。在时间管理系统中，用于处理任务间的依赖关系，确定任务的执行顺序。

## 算法原理
本实现使用 **Kahn 算法** 的变体，支持层级（并行度）识别。

1.  **计算入度**：统计每个节点的入度（指向该节点的边的数量）。
2.  **初始化队列**：将所有入度为 0 的节点加入队列（这些任务没有前置依赖，可以立即开始）。
3.  **层级处理**：
    *   当前队列中的所有节点属于同一“层级”（Level），意味着它们可以并行执行。
    *   根据指定的策略（如优先级、截止时间）对队列中的节点进行排序。
    *   将队列中的节点加入结果序列。
    *   遍历这些节点的邻居，将其入度减 1。
    *   如果邻居的入度变为 0，则加入下一层级的队列。
4.  **循环检测**：如果处理完所有节点后，结果序列的长度小于节点总数，说明图中存在环（循环依赖）。

## 时间复杂度
-   **时间复杂度**：O(V + E)，其中 V 是任务数量，E 是依赖关系数量。
-   **空间复杂度**：O(V + E)，用于存储图结构和入度表。

## 使用示例

```typescript
import { TopologicalSortAlgorithm } from './TopologicalSort';

const algorithm = new TopologicalSortAlgorithm();

// 1. 准备数据
const tasks = [
  { id: 'research', name: 'Research', ... },
  { id: 'write', name: 'Write', ... },
  { id: 'review', name: 'Review', ... }
];
const dependencies = [
  ['research', 'write'], // Research -> Write
  ['write', 'review']    // Write -> Review
];

// 2. 执行算法
const result = algorithm.execute({
  tasks,
  dependencies,
  strategy: 'priority' // 可选：'default' | 'priority' | 'deadline'
});

// 3. 处理结果
if (result.hasCycle) {
  console.error('Detected cycle:', result.cycles);
} else {
  console.log('Execution Order:', result.order); // ['research', 'write', 'review']
  console.log('Parallel Levels:', result.levels);
}
```

## 参数说明
-   `tasks`: 任务列表 (`DDLTask[]`)。
-   `dependencies`: 依赖关系数组 (`[predecessorId, successorId][]`)。
-   `strategy`: 排序策略。
    -   `default`: 默认顺序。
    -   `priority`: 高优先级任务优先（在同一层级内）。
    -   `deadline`: 早截止时间任务优先（在同一层级内）。

## 适用场景
-   项目管理：确定任务执行路径。
-   构建系统：确定编译顺序。
-   课程学习路径规划。

## 限制与注意事项
1.  **循环依赖**：如果存在循环依赖（A->B->A），算法将报告 `hasCycle: true` 并返回空序列或部分序列。
2.  **并行度**：`levels` 属性指示了任务的并行层级。同一层级的任务理论上可以并行执行，但受限于资源（如人员、时间槽）。
