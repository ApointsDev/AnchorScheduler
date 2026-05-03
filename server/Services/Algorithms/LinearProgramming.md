# 线性规划/团队会议调度 (Linear Programming / Team Scheduling)

## 算法简介
本模块实现了基于多目标优化的团队会议调度算法。虽然名为“线性规划”，但在本特定场景（从有限的时间槽中选择一个最优解）下，我们采用了**精确搜索 (Exact Search)** 策略，该策略在数学上等价于求解该特定形式的整数线性规划 (ILP) 问题，但效率更高且无需外部求解器依赖。

## 核心功能
- **多目标优化**：同时最大化成员偏好满足度并最小化调整成本。
- **约束处理**：处理必须参加者和可选参加者的约束。
- **冲突检测与成本计算**：基于时间重叠时长计算冲突成本和偏好得分。
- **自动调整建议**：生成参与者的日程调整建议。

## 时间复杂度
- **时间复杂度**: $O(T \times M \times S)$
  - $T$: 候选时间槽数量 (通常较小，例如一周内的可用时段)
  - $M$: 团队成员数量
  - $S$: 成员平均日程条目数
- 由于 $T$ 和 $M$ 在典型场景下（如 5-10 人，一周范围）较小，算法能在毫秒级完成。

## 使用示例

```typescript
import { LinearProgramming } from './LinearProgramming';
import { LinearProgrammingInput } from './types';

const scheduler = new LinearProgramming();

const input: LinearProgrammingInput = {
  teamMembers: [
    { 
      id: '1', name: 'Alice', 
      busySlots: [...], 
      preferences: [...], 
      maxAdjustmentCost: 100 
    },
    // ...
  ],
  meetingRequirements: {
    duration: 60, // 60分钟
    windowStart: new Date('2023-01-01T09:00:00'),
    windowEnd: new Date('2023-01-01T17:00:00'),
    requiredParticipants: ['1']
  },
  weights: {
    preference: 1.0,
    adjustmentCost: 1.0,
    fairness: 0.5
  }
};

const result = scheduler.scheduleMeeting(input);

if (result.status === 'optimal') {
  console.log('Optimal Time:', result.optimalTime);
  console.log('Total Cost:', result.totalCost);
} else {
  console.log('No feasible time found.');
}
```

## 参数说明

### `LinearProgrammingInput`
| 字段 | 类型 | 说明 |
|------|------|------|
| `teamMembers` | `TeamMember[]` | 团队成员及其日程信息 |
| `meetingRequirements` | `MeetingRequirement` | 会议时长、窗口、参与人要求 |
| `weights` | `Object` | 优化目标的权重配置 |
| `timeStep` | `number` | 搜索步长（分钟），默认 30 |

### 评分逻辑
- **冲突成本 (Cost)**: 忙碌时间段与会议时间段的重叠分钟数 $\times$ 权重。
- **偏好得分 (Preference)**: 偏好时间段与会议时间段的重叠分钟数 $\times$ 权重。
- **目标函数**: Maximize $(Preference \times w_p) - (Cost \times w_c)$。

## 适用场景
- 团队周会安排
- 临时会议协调
- 资源预约（需考虑偏好和冲突）

## 注意事项
1. 算法假设所有时间均为 UTC 或统一时区。
2. 必须参加者 (Required) 如果冲突成本超过其 `maxAdjustmentCost`，则该时间槽被视为不可行。
3. 可选参加者 (Optional) 仅在冲突成本可接受时才被计入参与者。
