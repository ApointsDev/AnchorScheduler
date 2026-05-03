# 📦 智能时间管理系统 - 算法模块完整提示词

## 🎯 总体需求概述

你需要为大学生创业团队开发一个**智能时间管理系统的算法核心**。系统分为两大引擎：
1. **个人时间规划引擎**：基于图论算法，处理个人日程优化
2. **团队协作引擎**：基于线性规划，处理团队会议安排

### 关键特性要求：
- 所有算法模块独立且可组合
- 提供TypeScript类型定义和完整的测试用例
- 每个模块有独立的文档说明
- 算法效率要求：能在毫秒级处理典型校园场景数据
- 内存效率：避免不必要的内存分配

---

## 📁 项目结构要求

```
src/Services
├── Algorithms/
│   ├── types.ts                    # 基础类型定义
│   ├── GraphColoring.ts            # 图着色算法 (DSatur)
│   ├── TopologicalSort.ts          # 拓扑排序 (Kahn)
│   ├── HungarianAlgorithm.ts       # 二分图匹配 (匈牙利算法)
│   ├── MaxFlowMinCut.ts            # 最大流最小割 (Ford-Fulkerson)
│   ├── CommunityDetection.ts       # 社区发现 (Louvain)
│   ├── CriticalPathAnalysis.ts     # 关键路径分析 (CPM/PERT)
│   └── LinearProgramming.ts        # 线性规划 (团队协作)
├── utils/
│   ├── TimeUtils.ts                # 时间处理工具
│   └── GraphUtils.ts               # 图算法工具
└── tests/
    └── 每个算法对应的测试文件
```

项目已有的日程类型和其它类型定义位于server\Services\types.ts

每个算法模块必须包含：
1. 完整的TypeScript类型定义
2. 核心算法实现
3. 使用示例
4. 性能分析注释
5. 可配置参数说明

---

## 🎨 算法模块详细需求

### 1. **图着色算法** (`GraphColoring.ts`)

#### 功能描述：
解决任务时间冲突问题，将任务分配到时间槽，避免重叠。使用**DSatur算法**（饱和度优先）。

#### 输入输出：
```typescript
// 输入
interface ColoringInput {
  tasks: DDLTask[];
  fixedEvents: FixedEvent[];
  timeSlots: TimeSlot[]; // 可用时间槽
  constraints?: {
    maxTasksPerSlot?: number;
    bufferTime?: number; // 任务间缓冲时间
  };
}

// 输出
interface ColoringResult {
  assignments: Map<string, string>; // 任务ID -> 时间槽ID
  conflicts: Array<{
    taskId1: string;
    taskId2: string;
    reason: string;
  }>;
  utilization: number; // 时间利用率 0-1
}
```

#### 算法要求：
- 实现DSatur算法：优先给饱和度高的节点着色
- 支持时间槽容量约束
- 支持任务持续时间考虑
- 时间复杂度：O(V²) 但优化为 O(V log V) 对于稀疏图
- 提供回溯机制：当无法着色时，可调整任务拆分

#### 示例场景：
```typescript
// 学生有3个任务和2门课程，需要安排到一天的时间槽中
const input: ColoringInput = {
  tasks: [task1, task2, task3],
  fixedEvents: [course1, course2],
  timeSlots: generateTimeSlots('08:00', '22:00', 30), // 30分钟间隔
  constraints: {
    maxTasksPerSlot: 1,
    bufferTime: 10 // 任务间10分钟缓冲
  }
};
```

---

### 2. **拓扑排序** (`TopologicalSort.ts`)

#### 功能描述：
处理任务间的依赖关系，确定任务执行顺序。使用**Kahn算法**。

#### 输入输出：
```typescript
// 输入
interface TopologicalSortInput {
  tasks: DDLTask[];
  dependencies: Array<[string, string]>; // [前置任务ID, 后置任务ID]
}

// 输出
interface TopologicalSortResult {
  order: string[]; // 任务ID的顺序
  hasCycle: boolean;
  levels: Map<string, number>; // 任务ID -> 层级（并行度）
}
```

#### 算法要求：
- 检测循环依赖并报告
- 支持多层级拓扑排序（识别可并行任务）
- 时间复杂度：O(V + E)
- 提供多种排序策略：按优先级、按截止时间等

#### 示例场景：
```typescript
// 项目任务依赖：研究 -> 数据收集 -> 分析 -> 报告
const input: TopologicalSortInput = {
  tasks: [research, collect, analyze, report],
  dependencies: [
    ['research', 'collect'],
    ['collect', 'analyze'],
    ['analyze', 'report']
  ]
};
```

---

### 3. **二分图匹配** (`HungarianAlgorithm.ts`)

#### 功能描述：
将任务最优匹配到时间段，考虑用户偏好和任务特性。使用**匈牙利算法**（Kuhn-Munkres）。

#### 输入输出：
```typescript
// 输入
interface BipartiteMatchingInput {
  leftNodes: string[]; // 任务ID
  rightNodes: string[]; // 时间槽ID
  costMatrix: number[][]; // [任务][时间槽] -> 代价（越低越好）
  constraints?: {
    maxAssignmentsPerRight?: number; // 每个时间槽最多任务数
    requiredMatches?: Array<[string, string]>; // 必须匹配的[任务, 时间槽]
  };
}

// 输出
interface BipartiteMatchingResult {
  matches: Map<string, string>; // 任务ID -> 时间槽ID
  totalCost: number;
  assignmentMatrix: number[][]; // 0/1 矩阵
}
```

#### 算法要求：
- 实现标准匈牙利算法 O(n³)
- 支持不平衡二分图（任务数≠时间槽数）
- 支持代价矩阵中的无穷大（表示不可匹配）
- 提供最小代价和最大权重两种模式

#### 代价计算示例：
```typescript
// 代价 = 基础时间偏好 + 任务类型匹配度 + 精力水平匹配度
function calculateCost(task: DDLTask, timeSlot: TimeSlot, userPref: UserPreference): number {
  const timePref = calculateTimePreference(task, timeSlot, userPref);
  const typeMatch = calculateTypeMatch(task, timeSlot);
  const energyMatch = calculateEnergyMatch(task, timeSlot, userPref);
  return 1 - (0.4*timePref + 0.3*typeMatch + 0.3*energyMatch);
}
```

---

### 4. **最大流最小割** (`MaxFlowMinCut.ts`)

#### 功能描述：
平衡时间资源分配，确保不过载。使用**Ford-Fulkerson算法**（Edmonds-Karp实现）。

#### 输入输出：
```typescript
// 输入
interface FlowNetworkInput {
  source: string; // 源点ID
  sink: string;   // 汇点ID
  nodes: string[]; // 所有节点
  edges: Array<{
    from: string;
    to: string;
    capacity: number;
    flow?: number; // 初始流量
  }>;
}

// 输出
interface FlowNetworkResult {
  maxFlow: number;
  flowOnEdges: Map<string, number>; // 边ID -> 流量
  minCut: {
    S: Set<string>; // 包含源点的集合
    T: Set<string>; // 包含汇点的集合
    capacity: number;
  };
  residualGraph: FlowNetworkInput; // 残余网络
}
```

#### 算法要求：
- 实现Edmonds-Karp版本 O(VE²)
- 支持多种容量类型（整数/浮点数）
- 提供残余网络用于后续调整
- 实现最小割查找

#### 时间流网络示例：
```
源点 (时间资源)
  ↓ (容量=24小时)
日期节点 (周一、周二...)
  ↓ (容量=该日可用时间)
时间槽节点 (9:00, 10:00...)
  ↓ (容量=1，每个槽只能一个主要任务)
任务节点
  ↓ (需求=任务所需时间)
汇点 (完成的任务)
```

---

### 5. **社区发现** (`CommunityDetection.ts`)

#### 功能描述：
识别用户的日程模式，发现任务的自然分组。使用**Louvain算法**。

#### 输入输出：
```typescript
// 输入
interface CommunityDetectionInput {
  graph: Graph<TaskNode>;
  resolution?: number; // 社区规模参数
  iterations?: number; // 最大迭代次数
}

interface TaskNode {
  taskId: string;
  type: string;
  duration: number;
  typicalTime?: Date; // 通常执行时间
}

// 输出
interface CommunityDetectionResult {
  communities: Map<string, number>; // 节点ID -> 社区ID
  modularity: number; // 模块度，衡量社区划分质量
  hierarchy: Array<{
    level: number;
    communities: Map<string, number>;
    modularity: number;
  }>; // 层次结构
}
```

#### 算法要求：
- 实现Louvain算法两阶段优化
- 支持层次社区发现
- 模块度计算和优化
- 时间复杂度：O(n log n) 对于稀疏图

#### 应用场景：
```typescript
// 发现用户的时间使用模式：
//例如，哪些时间段是高精力时间段？（根据用户过往的日程安排）
//用户习惯在哪些日程后进行哪些日程？哪些日程容易被放到一起完成？
```

---

### 6. **关键路径分析** (`CriticalPathAnalysis.ts`)

#### 功能描述：
识别项目中的关键任务，优化项目时间管理。使用**CPM/PERT**。

#### 输入输出：
```typescript
// 输入
interface CriticalPathInput {
  tasks: Array<{
    id: string;
    duration: number;
    dependencies: string[];
    optimistic?: number; // PERT乐观时间
    pessimistic?: number; // PERT悲观时间
    mostLikely?: number; // PERT最可能时间
  }>;
  startDate: Date;
}

// 输出
interface CriticalPathResult {
  criticalPath: string[]; // 关键路径上的任务ID
  slackTimes: Map<string, number>; // 任务ID -> 松弛时间
  earliestStart: Map<string, Date>;
  latestStart: Map<string, Date>;
  projectDuration: number;
  taskDetails: Map<string, {
    es: Date; // Earliest Start
    ef: Date; // Earliest Finish
    ls: Date; // Latest Start
    lf: Date; // Latest Finish
    slack: number;
    isCritical: boolean;
  }>;
}
```

#### 算法要求：
- 实现标准CPM算法（确定时间）
- 实现PERT算法（概率时间）
- 支持多种依赖类型（FS, SS, FF, SF）
- 可视化关键路径

#### 算法步骤：
1. 前向传播：计算最早开始时间
   ```
   ES_start = 0
   ES_j = max(ES_i + duration_i) 对所有前置任务i
   ```
2. 后向传播：计算最晚开始时间
   ```
   LF_end = ES_end
   LF_i = min(LS_j) 对所有后续任务j
   LS_i = LF_i - duration_i
   ```
3. 计算松弛时间：`Slack_i = LS_i - ES_i`
4. 关键路径：所有松弛时间为0的任务

---

### 7. **线性规划** (`LinearProgramming.ts`)

#### 功能描述：
团队会议时间安排，考虑多个成员的约束和偏好。使用**混合整数线性规划**。

#### 输入输出：
```typescript
// 输入
interface LinearProgrammingInput {
  teamMembers: TeamMember[];
  meetingRequirements: MeetingRequirement;
  timeSlots: TimeSlot[];
  weights?: {
    preference: number;    // 偏好权重
    adjustmentCost: number; // 调整代价权重
    fairness: number;      // 公平性权重
  };
}

// 输出
interface LinearProgrammingResult {
  optimalTime: TimeSlot;
  participants: string[]; // 参与成员ID
  adjustments: Map<string, Adjustment>; // 成员ID -> 需要做的调整
  totalCost: number;
  objectiveValue: number;
  status: 'optimal' | 'feasible' | 'infeasible' | 'unbounded';
}

interface Adjustment {
  tasksToReschedule: string[];
  cost: number;
  newTimes?: Map<string, TimeSlot>;
}
```

#### 算法要求：
- 使用glpk.js或类似线性规划库
- 构建MILP模型：
  - 决策变量：是否在某个时间开会（0/1）
  - 约束：成员可用性、会议持续时间、参与度要求
  - 目标函数：最小化总调整代价 + 最大化总偏好
- 支持多目标优化（加权求和）
- 提供冲突解决建议

#### 数学模型：
```
决策变量：
  x_t ∈ {0,1} : 是否在时间t开始会议
  y_i ≥ 0     : 成员i的调整代价

约束：
  ∑ x_t = 1                (唯一开始时间)
  y_i = ∑ c_{it} * x_t     (成员i的调整代价计算)
  y_i ≤ MaxAdjustment_i    (最大调整容忍)

目标函数：
  min ∑ w_i * y_i - ∑ p_{it} * x_t
```

---

## 🔧 工具函数要求

### 1. **时间处理工具** (`TimeUtils.ts`)

必须包含：
```typescript
// 生成时间槽
function generateTimeSlots(
  startTime: string,  // '08:00'
  endTime: string,    // '22:00'
  interval: number    // 分钟
): TimeSlot[];

// 检查时间重叠
function hasTimeOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean;

// 计算时间差（分钟）
function timeDifference(start: Date, end: Date): number;

// 时间槽合并/分割
function mergeTimeSlots(slots: TimeSlot[]): TimeSlot[];
function splitTimeSlot(slot: TimeSlot, maxDuration: number): TimeSlot[];

// 工作日计算
function isWeekday(date: Date): boolean;
function addBusinessMinutes(date: Date, minutes: number): Date;
```

### 2. **图算法工具** (`GraphUtils.ts`)

必须包含：
```typescript
// 图构建
function buildGraphFromTasks(tasks: DDLTask[]): Graph<DDLTask>;

// 冲突检测
function findConflicts(tasks: DDLTask[]): GraphEdge[];

// 图转换
function graphToAdjacencyMatrix(graph: Graph<any>): number[][];

// 连通分量
function connectedComponents(graph: Graph<any>): string[][];

// 路径查找
function findAllPaths(graph: Graph<any>, start: string, end: string): string[][];
```

---

## 🧪 测试要求

每个算法模块必须有完整的测试套件：

```typescript
// 测试文件结构
describe('GraphColoring Algorithm', () => {
  test('should assign colors without conflicts', () => {
    // 基本功能测试
  });
  
  test('should handle task splitting', () => {
    // 边界条件测试
  });
  
  test('should be efficient for large inputs', () => {
    // 性能测试（100+任务）
  });
  
  test('should respect buffer time constraints', () => {
    // 约束测试
  });
});

// 集成测试
describe('Full Pipeline Integration', () => {
  test('should optimize personal schedule end-to-end', async () => {
    // 从原始数据到最终安排的完整流程
  });
  
  test('should schedule team meeting considering all constraints', async () => {
    // 团队调度完整流程
  });
});
```

测试数据要求：
1. 小规模测试数据（3-5个任务）
2. 中等规模测试数据（10-20个任务，模拟一天）
3. 大规模测试数据（50+任务，模拟一周）
4. 边缘案例：循环依赖、无解情况、极端时间约束

---

## 📊 性能指标要求

每个算法必须记录并报告：
```typescript
interface PerformanceMetrics {
  executionTime: number;      // 执行时间（ms）
  memoryUsage: number;        // 内存使用（MB）
  iterations?: number;        // 迭代次数
  solutionQuality: number;    // 解的质量（算法特定）
}

// 预期性能目标：
// - 个人日程优化（10个任务）：< 50ms
// - 团队会议安排（5人团队）：< 100ms
// - 社区发现（30天历史）：< 200ms
// - 关键路径分析（20个任务项目）：< 30ms
```

---

## 📖 文档要求

每个算法模块必须有对应的markdown文档，包含：

1. **算法原理**：简要说明算法数学原理
2. **时间复杂度**：最好/最坏/平均情况分析
3. **使用示例**：完整的TypeScript使用示例
4. **参数说明**：所有可配置参数详解
5. **适用场景**：何时使用该算法
6. **限制与注意事项**：算法局限性和边界情况
7. **参考文献**：相关论文或资料

示例文档结构：
```markdown
# 图着色算法 (DSatur)

## 算法简介
DSatur（饱和度优先）算法是图着色问题的启发式算法...

## 时间复杂度
- 最好情况：O(V log V)
- 最坏情况：O(V²)
- 平均情况：O(V log V) 对于稀疏图

## 使用示例
```typescript
// 代码示例
```

## 参数说明
- `maxTasksPerSlot`: 每个时间槽最多任务数...
- `bufferTime`: 任务间缓冲时间...

## 适用场景
- 个人日程冲突解决
- 考场座位安排
- 资源时间分配

## 注意事项
1. 算法是启发式的，不保证最优解
2. 对于完全图，退化为O(V²)
3. 需要预先生成时间槽
```

---

## 🚀 集成与扩展性要求

### 算法组合模式：
```typescript
// 完整个人日程优化流程
async function optimizePersonalSchedule(
  tasks: DDLTask[],
  fixedEvents: FixedEvent[],
  preferences: UserPreference
): Promise<Schedule> {
  // 1. 依赖分析（拓扑排序）
  const order = topologicalSort(tasks);
  
  // 2. 冲突消解（图着色）
  const colored = graphColoring(order, fixedEvents);
  
  // 3. 偏好优化（二分图匹配）
  const matched = hungarianMatching(colored, preferences);
  
  // 4. 资源平衡（最大流）
  const balanced = maxFlowAllocation(matched);
  
  // 5. 模式优化（社区发现 - 可选）
  const optimized = communityDetection(balanced);
  
  return optimized;
}

// 团队会议安排流程
async function scheduleTeamMeeting(
  team: TeamMember[],
  requirements: MeetingRequirement
): Promise<MeetingSchedule> {
  // 1. 收集个人日程
  const memberSchedules = await Promise.all(
    team.map(m => optimizePersonalSchedule(m.tasks, m.fixedEvents, m.preferences))
  );
  
  // 2. 构建线性规划模型
  const model = buildLPModel(memberSchedules, requirements);
  
  // 3. 求解
  const solution = solveLinearProgramming(model);
  
  // 4. 生成调整建议
  const adjustments = generateAdjustments(solution, memberSchedules);
  
  return { time: solution.time, adjustments };
}
```

### 扩展接口：
```typescript
// 算法工厂模式
interface AlgorithmFactory {
  createGraphColoring(config: ColoringConfig): GraphColoringAlgorithm;
  createTopologicalSort(config: SortConfig): TopologicalSortAlgorithm;
  // ... 其他算法
}

// 插件系统支持
interface AlgorithmPlugin {
  name: string;
  version: string;
  initialize(config: any): void;
  execute(input: any): Promise<any>;
  metrics: PerformanceMetrics;
}

// 可替换算法实现
interface GraphColoringAlgorithm {
  color(graph: Graph<any>): Promise<ColoringResult>;
  setStrategy(strategy: 'DSatur' | 'RLF' | 'Backtracking'): void;
}
```

---

## 🔄 错误处理与日志

必须包含完整的错误处理：
```typescript
class AlgorithmError extends Error {
  constructor(
    message: string,
    public algorithm: string,
    public input: any,
    public severity: 'warning' | 'error' | 'fatal'
  ) {
    super(message);
  }
}

// 错误类型
const ErrorTypes = {
  INFEASIBLE: '算法无可行解',
  TIMEOUT: '算法超时',
  INVALID_INPUT: '输入数据无效',
  CYCLIC_DEPENDENCY: '循环依赖检测',
  MEMORY_EXCEEDED: '内存超出限制'
} as const;

// 日志系统
interface AlgorithmLogger {
  logExecution(algorithm: string, input: any, output: any, metrics: PerformanceMetrics): void;
  logError(error: AlgorithmError): void;
  getPerformanceReport(): PerformanceReport;
}
```

---

## 📈 数据验证与清洗

每个算法必须包含输入验证：
```typescript
function validateColoringInput(input: ColoringInput): ValidationResult {
  const errors: string[] = [];
  
  // 检查时间有效性
  input.timeSlots.forEach(slot => {
    if (slot.start >= slot.end) {
      errors.push(`时间槽 ${slot.id} 起始时间晚于结束时间`);
    }
  });
  
  // 检查任务持续时间
  input.tasks.forEach(task => {
    if (task.estimatedDuration <= 0) {
      errors.push(`任务 ${task.id} 持续时间必须为正数`);
    }
    if (task.deadline < new Date()) {
      errors.push(`任务 ${task.id} 截止时间已过`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## 🌐 API接口设计

每个算法暴露为RESTful API端点：
```typescript
// Express.js风格路由
app.post('/api/algorithms/graph-coloring', async (req, res) => {
  try {
    const input = validateInput(req.body);
    const result = await graphColoringAlgorithm.execute(input);
    const metrics = graphColoringAlgorithm.getMetrics();
    
    res.json({
      success: true,
      data: result,
      metrics,
      executionTime: metrics.executionTime
    });
  } catch (error) {
    handleAlgorithmError(error, res);
  }
});

// WebSocket支持实时进度
app.ws('/api/algorithms/stream/:algorithm', (ws, req) => {
  const algorithm = req.params.algorithm;
  
  ws.on('message', async (message) => {
    const input = JSON.parse(message);
    const stream = algorithmStreams[algorithm].executeStreaming(input);
    
    for await (const update of stream) {
      ws.send(JSON.stringify({
        type: 'progress',
        data: update.progress,
        intermediateResult: update.result
      }));
    }
    
    ws.send(JSON.stringify({
      type: 'complete',
      data: stream.finalResult,
      metrics: stream.metrics
    }));
  });
});
```

---

## 🧩 配置管理

支持环境配置和算法参数配置：
```typescript
// 配置文件
interface AlgorithmConfig {
  graphColoring: {
    defaultStrategy: 'DSatur' | 'RLF' | 'Backtracking';
    timeout: number; // ms
    maxIterations: number;
    enableLogging: boolean;
  };
  linearProgramming: {
    solver: 'glpk' | 'ortools' | 'custom';
    precision: number;
    maxRuntime: number;
    weights: {
      preference: number;
      adjustmentCost: number;
      fairness: number;
    };
  };
  // ... 其他算法配置
}

// 环境特定配置
const config: Record<'development' | 'production', AlgorithmConfig> = {
  development: {
    graphColoring: {
      defaultStrategy: 'DSatur',
      timeout: 5000,
      maxIterations: 1000,
      enableLogging: true
    },
    // ...
  },
  production: {
    graphColoring: {
      defaultStrategy: 'RLF', // 生产环境使用更快的算法
      timeout: 1000,
      maxIterations: 100,
      enableLogging: false
    },
    // ...
  }
};
```

---

## 🎨 可视化支持

算法应提供可视化数据输出：
```typescript
interface VisualizationData {
  // 图着色结果
  coloring?: {
    timeSlots: Array<{
      id: string;
      time: string;
      tasks: string[];
      color: string; // 用于可视化
    }>;
    conflicts: Array<{
      task1: string;
      task2: string;
      timeSlot: string;
    }>;
  };
  
  // 关键路径
  criticalPath?: {
    path: string[];
    duration: number;
    slackTimes: Array<{ task: string; slack: number }>;
  };
  
  // 社区发现
  communities?: Array<{
    id: number;
    tasks: string[];
    color: string;
    centroid?: { x: number; y: number };
  }>;
}

// 可视化工具函数
function generateGanttChartData(schedule: Schedule): GanttChartData;
function generateNetworkGraphData(graph: Graph<any>): NetworkGraphData;
function generateTimelineData(assignments: Map<string, string>): TimelineData;
```

---

## 📋 总结：交付物清单

你需要为每个算法模块提供：

### 必需文件：
1. **算法实现** (`AlgorithmName.ts`) - 完整的TypeScript实现
2. **类型定义** (`types.ts`) - 所有接口和类型
3. **测试文件** (`AlgorithmName.test.ts`) - 完整的单元测试
4. **文档** (`AlgorithmName.md`) - 详细的使用文档
5. **示例** (`examples/`) - 使用示例代码

### 代码质量要求：
- ✅ 完整的TypeScript类型定义
- ✅ 详细的代码注释（算法步骤说明）
- ✅ 错误处理边界情况
- ✅ 性能优化考虑
- ✅ 可配置参数
- ✅ 可测试的纯函数设计
- ✅ 内存泄漏预防
- ✅ 并发安全（如适用）

### 算法正确性要求：
- ✅ 通过所有单元测试
- ✅ 处理边界条件（空输入、无效输入）
- ✅ 保持算法理论正确性
- ✅ 提供算法复杂度分析
- ✅ 与参考实现结果一致（如有可能）

---

## 🚀 开始实现提示

现在你已经获得了完整的需求说明。请按照以下步骤开始实现：

1. **首先实现`types.ts`** - 建立完整的基础类型系统
2. **按顺序实现每个算法模块** - 从GraphColoring开始，逐步推进
3. **为每个模块编写测试** - 边实现边测试
4. **编写文档** - 算法原理和使用方法
5. **集成测试** - 验证算法组合效果
6. **性能优化** - 确保达到性能指标

记住：这个系统将被用于真实的校园时间管理场景，**正确性**和**性能**同等重要。算法需要处理真实世界的时间约束和用户偏好。

开始编码吧！ 🎉