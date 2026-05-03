# 关键路径分析 (Critical Path Analysis)

## 算法简介
关键路径分析 (CPM) 和计划评审技术 (PERT) 是用于项目管理的算法，用于确定项目中最长的任务序列（关键路径），该路径决定了项目的最短完成时间。本实现结合了 CPM 和 PERT，支持三点估算（乐观、悲观、最可能时间）。

## 核心功能
- **DAG 验证**：检测依赖关系中的循环。
- **PERT 估算**：支持基于 Beta 分布的工期估算。
- **关键路径计算**：识别零松弛时间（Slack = 0）的任务。
- **时间参数计算**：计算每个任务的 ES (最早开始), EF (最早结束), LS (最晚开始), LF (最晚结束)。

## 时间复杂度
- **时间复杂度**: $O(V + E)$，其中 $V$ 是任务数，$E$ 是依赖关系数。算法基于拓扑排序和两次图遍历（前向和后向）。
- **空间复杂度**: $O(V + E)$，用于存储图结构和节点属性。

## 使用示例

```typescript
import { CriticalPathAnalysis } from './CriticalPathAnalysis';
import { CriticalPathInput } from './types';

const analyzer = new CriticalPathAnalysis();

const input: CriticalPathInput = {
  startDate: new Date(),
  tasks: [
    { id: 'A', duration: 5, dependencies: [] },
    { id: 'B', duration: 3, dependencies: ['A'] },
    { id: 'C', duration: 4, dependencies: ['A'] },
    { id: 'D', duration: 2, dependencies: ['B', 'C'] }
  ]
};

const result = analyzer.analyze(input);

console.log('Project Duration:', result.projectDuration);
console.log('Critical Path:', result.criticalPath); // ['A', 'C', 'D']
console.log('Slack for B:', result.slackTimes.get('B')); // 1
```

## 参数说明

### `CriticalPathInput`
| 字段 | 类型 | 说明 |
|------|------|------|
| `tasks` | `Array` | 任务列表 |
| `startDate` | `Date` | 项目开始时间 |

### `Task` 对象
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 任务唯一标识 |
| `duration` | `number` | 确定性工期（如果使用 PERT，此值可被覆盖或作为默认值） |
| `dependencies` | `string[]` | 前置任务 ID 列表 |
| `optimistic` | `number` | (可选) PERT 乐观时间 |
| `mostLikely` | `number` | (可选) PERT 最可能时间 |
| `pessimistic` | `number` | (可选) PERT 悲观时间 |

## 适用场景
- 项目进度规划
- 任务依赖分析
- 瓶颈识别

## 注意事项
1. 依赖图必须是有向无环图 (DAG)。如果存在循环，算法将抛出错误。
2. PERT 计算公式为 $Duration = \frac{O + 4M + P}{6}$。
