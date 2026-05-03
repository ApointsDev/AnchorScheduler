# 二分图匹配 (Hungarian Algorithm)

## 算法简介
匈牙利算法（Hungarian Algorithm），也称为 Kuhn-Munkres 算法，用于解决二分图的最大权匹配或最小权匹配问题。在时间管理系统中，用于将任务分配给时间槽，使得总代价最小（或总偏好最大）。

## 算法原理
本实现使用 O(n³) 的 KM 算法变体。

1.  **构建权重矩阵**：
    *   输入为代价矩阵（Cost Matrix），目标是最小化代价。
    *   算法内部将其转换为最大权匹配问题：`Weight = MaxFiniteCost + 1 - Cost`。
    *   对于 `Infinity` 代价（不可行），权重设为负无穷。
    *   对于不平衡矩阵（任务数 ≠ 时间槽数），通过填充 0 权重的虚拟节点将其补全为方阵。
2.  **初始化顶标**：为左侧节点（任务）和右侧节点（时间槽）分配顶标（Label/Potential），满足 `Lx[i] + Ly[j] >= Weight[i][j]`。
3.  **寻找增广路**：
    *   对于每个未匹配的左侧节点，尝试在相等子图（Equality Subgraph）中寻找增广路。
    *   相等子图包含满足 `Lx[i] + Ly[j] == Weight[i][j]` 的边。
4.  **更新顶标**：
    *   如果找不到增广路，计算松弛量（Slack），调整顶标以引入新的边进入相等子图。
    *   重复步骤 3-4 直到找到增广路。
5.  **输出结果**：将匹配结果转换回任务和时间槽的映射。

## 时间复杂度
-   **时间复杂度**：O(N³)，其中 N = max(任务数, 时间槽数)。
-   **空间复杂度**：O(N²)，用于存储矩阵和辅助数组。

## 使用示例

```typescript
import { HungarianAlgorithm } from './HungarianAlgorithm';

const algorithm = new HungarianAlgorithm();

// 1. 准备数据
const input = {
  leftNodes: ['Task1', 'Task2'],
  rightNodes: ['Slot1', 'Slot2'],
  costMatrix: [
    [1, 10], // Task1: Slot1代价1, Slot2代价10
    [10, 1]  // Task2: Slot1代价10, Slot2代价1
  ]
};

// 2. 执行算法
const result = algorithm.execute(input);

// 3. 处理结果
console.log(result.matches); // Map { 'Task1' => 'Slot1', 'Task2' => 'Slot2' }
console.log(result.totalCost); // 2
```

## 参数说明
-   `leftNodes`: 左侧节点ID列表（任务）。
-   `rightNodes`: 右侧节点ID列表（时间槽）。
-   `costMatrix`: 代价矩阵，`costMatrix[i][j]` 表示第 i 个任务分配给第 j 个时间槽的代价。
    -   值越小越好。
    -   `Infinity` 表示不可分配。
-   `constraints`: (可选)
    -   `requiredMatches`: 强制匹配对，算法会赋予极高权重以确保匹配。

## 适用场景
-   任务分配：将 N 个任务分配给 M 个时间段。
-   资源调度：将 N 个工人分配给 M 个机器。
-   偏好匹配：根据用户偏好分数进行最优匹配。

## 限制与注意事项
1.  **不平衡处理**：如果任务多于时间槽，部分任务将无法匹配（算法会优先匹配代价最小的）。如果时间槽多于任务，部分时间槽将空闲。
2.  **性能**：O(N³) 对于 N < 500 通常很快（毫秒级）。对于非常大的 N，可能需要更高效的实现或近似算法。
3.  **强制匹配**：通过修改权重实现，如果强制匹配本身不可行（如代价为 Infinity），算法可能无法满足。
