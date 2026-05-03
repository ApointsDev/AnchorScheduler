# 图着色算法 (DSatur)

## 算法简介
DSatur（Degree of Saturation，饱和度优先）算法是图着色问题的启发式算法。在时间管理系统中，我们将任务视为图的节点，将时间槽视为颜色。如果两个任务不能同时进行（例如，同一个人的两个任务），它们之间就有一条边。算法的目标是为每个任务分配一个时间槽，使得相邻任务（冲突任务）具有不同的时间槽，从而避免时间冲突。

## 算法原理
1.  **构建图**：
    *   节点：任务（如果任务时长超过时间槽时长，会被拆分为多个节点）。
    *   边：冲突关系。对于个人日程，通常假设任意两个任务都不能同时进行，因此构成完全图（Clique）。
2.  **计算饱和度**：
    *   饱和度（Saturation Degree）：节点已着色邻居的颜色数量。
    *   度（Degree）：未着色邻居的数量。
3.  **选择节点**：
    *   优先选择饱和度最高的节点。
    *   如果饱和度相同，选择度最高的节点。
4.  **着色**：
    *   为选定节点分配最小的可用颜色（时间槽）。
    *   可用颜色需满足：
        *   不与已着色邻居冲突。
        *   不被固定事件（FixedEvent）占用。
        *   满足任务截止时间约束。
5.  **更新**：更新邻居的饱和度，重复步骤3-5，直到所有节点都被着色或无法着色。

## 时间复杂度
-   **最好情况**：O(V log V)（使用适当的数据结构）
-   **最坏情况**：O(V²)
-   **平均情况**：O(V²)
    其中 V 是任务（或任务分块）的数量。

## 使用示例

```typescript
import { GraphColoringAlgorithm } from './GraphColoring';
import { TimeUtils } from './utils/TimeUtils';

const algorithm = new GraphColoringAlgorithm();

// 1. 准备数据
const timeSlots = TimeUtils.generateTimeSlots('09:00', '12:00', 60);
const tasks = [
  { id: 't1', name: 'Task 1', estimatedDuration: 60, deadline: new Date('...') },
  { id: 't2', name: 'Task 2', estimatedDuration: 60, deadline: new Date('...') }
];
const fixedEvents = [];

// 2. 执行算法
const result = await algorithm.execute({
  tasks,
  fixedEvents,
  timeSlots
});

// 3. 处理结果
console.log(result.assignments); // Map { 't1' => 'slot_1', 't2' => 'slot_2' }
console.log(result.conflicts);   // []
```

## 参数说明
-   `tasks`: 待安排的任务列表 (`DDLTask[]`)。
-   `fixedEvents`: 已固定的日程 (`FixedEvent[]`)，这些时间段将被视为不可用。
-   `timeSlots`: 可用的时间槽列表 (`TimeSlot[]`)。
-   `constraints`: (可选) 额外约束，如 `maxTasksPerSlot`。

## 适用场景
-   个人日程自动安排：在有限的时间资源内安排多个任务。
-   解决时间冲突：当用户添加新任务导致冲突时，重新规划日程。

## 限制与注意事项
1.  **启发式算法**：DSatur 是启发式算法，不保证找到最优解（例如最少时间槽数量），但在实践中效果很好。
2.  **任务拆分**：当前实现将长任务拆分为多个时间槽单位的子任务，但未严格强制子任务连续（虽然在完全图中，DSatur 倾向于紧凑分配）。
3.  **完全图假设**：对于单人日程，假设所有任务互斥。如果是多人或多资源场景，图的构建方式需调整。
