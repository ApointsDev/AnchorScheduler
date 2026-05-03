import { Task } from '../../index';

// 基础类型定义

export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  capacity?: number;
  isHighEnergy?: boolean; // 是否为高精力时段
  isFragmented?: boolean; // 是否为碎片化时段
}

export interface DDLTask {
  id: string;
  name: string;
  deadline: Date;
  estimatedDuration: number; // 分钟
  priority?: number;
  originalTask?: Task; // 关联原始任务
  earliestStart?: Date; // 最早开始时间
  energyRequirement?: 'high' | 'normal' | 'low'; // 精力需求
  tags?: string[]; // 任务标签，用于社区发现
}

export interface FixedEvent {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  originalEvent?: any; // 关联原始事件
}

export interface ColoringInput {
  tasks: DDLTask[];
  fixedEvents: FixedEvent[];
  timeSlots: TimeSlot[]; // 可用时间槽
  constraints?: {
    maxTasksPerSlot?: number;
    bufferTime?: number; // 任务间缓冲时间 (分钟)
  };
}

export interface ColoringResult {
  assignments: Map<string, string>; // 任务ID -> 时间槽ID
  conflicts: Array<{
    taskId1: string;
    taskId2: string;
    reason: string;
  }>;
  utilization: number; // 时间利用率 0-1
}

export interface PerformanceMetrics {
  executionTime: number;      // 执行时间（ms）
  memoryUsage: number;        // 内存使用（MB）
  iterations?: number;        // 迭代次数
  solutionQuality: number;    // 解的质量（算法特定）
}

export class AlgorithmError extends Error {
  constructor(
    message: string,
    public algorithm: string,
    public input: any,
    public severity: 'warning' | 'error' | 'fatal'
  ) {
    super(message);
    this.name = 'AlgorithmError';
  }
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface Graph<T> {
  nodes: Map<string, T>;
  edges: GraphEdge[];
  adjacencyList: Map<string, string[]>;
}

export interface TopologicalSortInput {
  tasks: DDLTask[];
  dependencies: Array<[string, string]>; // [predecessorId, successorId]
  strategy?: 'default' | 'priority' | 'deadline';
}

export interface TopologicalSortResult {
  order: string[]; // 任务ID的顺序
  hasCycle: boolean;
  levels: Map<string, number>; // 任务ID -> 层级（并行度）
  cycles?: string[][]; // 循环依赖详情
}

export interface BipartiteMatchingInput {
  leftNodes: string[]; // 任务ID
  rightNodes: string[]; // 时间槽ID
  costMatrix: number[][]; // [任务][时间槽] -> 代价（越低越好）
  constraints?: {
    maxAssignmentsPerRight?: number; // 每个时间槽最多任务数 (Default 1)
    requiredMatches?: Array<[string, string]>; // 必须匹配的[任务, 时间槽]
  };
}

export interface BipartiteMatchingResult {
  matches: Map<string, string>; // 任务ID -> 时间槽ID
  totalCost: number;
  assignmentMatrix: number[][]; // 0/1 矩阵
}

export interface FlowNetworkInput {
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

export interface FlowNetworkResult {
  maxFlow: number;
  flowOnEdges: Map<string, number>; // 边ID (from->to) -> 流量
  minCut: {
    S: Set<string>; // 包含源点的集合
    T: Set<string>; // 包含汇点的集合
    capacity: number;
  };
  residualGraph: FlowNetworkInput; // 残余网络
}

export interface TaskNode {
  taskId: string;
  type: string;
  duration: number;
  typicalTime?: Date; // 通常执行时间
}

export interface CommunityDetectionInput {
  graph: Graph<TaskNode>;
  resolution?: number; // 社区规模参数 (Default 1.0)
  iterations?: number; // 最大迭代次数
}

export interface CommunityDetectionResult {
  communities: Map<string, number>; // 节点ID -> 社区ID
  modularity: number; // 模块度，衡量社区划分质量
  hierarchy: Array<{
    level: number;
    communities: Map<string, number>;
    modularity: number;
  }>; // 层次结构
}

export interface CriticalPathInput {
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

export interface CriticalPathResult {
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

export interface TeamMember {
  id: string;
  name: string;
  busySlots: TimeSlot[]; // 忙碌时间段
  preferences: TimeSlot[]; // 偏好时间段 (High preference)
  maxAdjustmentCost: number; // 最大可接受调整成本
}

export interface MeetingRequirement {
  duration: number; // 分钟
  windowStart: Date;
  windowEnd: Date;
  requiredParticipants: string[]; // 必须参加的人
  optionalParticipants?: string[]; // 可选参加的人
}

export interface Adjustment {
  memberId: string;
  cost: number;
  reason: string; // e.g., "Conflict with existing task"
}

export interface LinearProgrammingInput {
  teamMembers: TeamMember[];
  meetingRequirements: MeetingRequirement;
  weights?: {
    preference: number;    // 偏好权重 (Default 1.0)
    adjustmentCost: number; // 调整代价权重 (Default 1.0)
    fairness: number;      // 公平性权重 (Default 0.5)
  };
  timeStep?: number; // 搜索步长(分钟), Default 30
}

export interface LinearProgrammingResult {
  optimalTime: TimeSlot | null;
  participants: string[]; // 实际参与成员ID
  adjustments: Map<string, Adjustment>; // 成员ID -> 需要做的调整
  totalCost: number;
  objectiveValue: number;
  status: 'optimal' | 'feasible' | 'infeasible';
}
