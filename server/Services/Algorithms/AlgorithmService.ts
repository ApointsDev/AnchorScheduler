import { TopologicalSortAlgorithm } from './TopologicalSort';
import { GraphColoringAlgorithm } from './GraphColoring';
import { HungarianAlgorithm } from './HungarianAlgorithm';
import { MaxFlowMinCutAlgorithm } from './MaxFlowMinCut';
import { CommunityDetectionAlgorithm } from './CommunityDetection';
import { CriticalPathAnalysis } from './CriticalPathAnalysis';
import { LinearProgramming } from './LinearProgramming';
import { v4 as uuidv4 } from 'uuid';
import { 
  DDLTask, 
  FixedEvent, 
  TimeSlot, 
  TeamMember, 
  MeetingRequirement, 
  LinearProgrammingResult,
  TopologicalSortInput,
  ColoringInput,
  BipartiteMatchingInput,
  FlowNetworkInput,
  CommunityDetectionInput,
  CriticalPathInput,
  CriticalPathResult,
  TaskNode,
  Graph,
  PerformanceMetrics
} from './types';
import { TimeUtils } from './utils/TimeUtils';
import { GraphUtils } from './utils/GraphUtils';

import { performance } from 'perf_hooks';

import { FragmentationUtils } from './utils/FragmentationUtils';

export class AlgorithmService {
  private topologicalSort: TopologicalSortAlgorithm;
  private graphColoring: GraphColoringAlgorithm;
  private hungarianAlgorithm: HungarianAlgorithm;
  private maxFlowMinCut: MaxFlowMinCutAlgorithm;
  private communityDetection: CommunityDetectionAlgorithm;
  private criticalPathAnalysis: CriticalPathAnalysis;
  private linearProgramming: LinearProgramming;

  constructor() {
    this.topologicalSort = new TopologicalSortAlgorithm();
    this.graphColoring = new GraphColoringAlgorithm();
    this.hungarianAlgorithm = new HungarianAlgorithm();
    this.maxFlowMinCut = new MaxFlowMinCutAlgorithm();
    this.communityDetection = new CommunityDetectionAlgorithm();
    this.criticalPathAnalysis = new CriticalPathAnalysis();
    this.linearProgramming = new LinearProgramming();
  }

  /**
   * 个人日程优化流程
   * 1. 依赖分析 (Topological Sort)
   * 2. 冲突消解 (Graph Coloring)
   * 3. 偏好优化 (Hungarian Algorithm)
   */
  public async optimizePersonalSchedule(
    tasks: DDLTask[],
    fixedEvents: FixedEvent[],
    availableSlots: TimeSlot[],
    dependencies: [string, string][] = []
  ): Promise<Map<string, string>> {
    // 1. 依赖分析
    const sortInput: TopologicalSortInput = {
      tasks,
      dependencies
    };
    const sortResult = this.topologicalSort.execute(sortInput);
    if (sortResult.hasCycle) {
      throw new Error('Cyclic dependency detected in tasks');
    }
    
    // Reorder tasks based on topological sort for processing priority
    const sortedTaskIds = sortResult.order;
    const sortedTasks = sortedTaskIds
      .map(id => tasks.find(t => t.id === id)!)
      .filter(t => t !== undefined);

    // 2. 冲突消解 (Graph Coloring)
    // We treat available slots as "colors"
    // If we have more tasks than slots, we might need multiple tasks per slot (if allowed)
    // or we just assign time slots.
    // Here we assume Graph Coloring assigns "Time Slots" to "Tasks" to avoid conflicts.
    const coloringInput: ColoringInput = {
      tasks: sortedTasks,
      fixedEvents,
      timeSlots: availableSlots,
      constraints: {
        maxTasksPerSlot: 1
      }
    };
    const coloringResult = await this.graphColoring.execute(coloringInput);

    // 3. 偏好优化 (Hungarian Algorithm) - Max Weight Matching
    // 使用二分图最大权匹配来优化时间槽分配
    // 考虑因素：精力匹配、碎片化程度、任务关联性
    
    // 3.1 社区发现：识别任务关联性
    const communities = this.detectTaskCommunities(tasks);
    
    // 3.2 构建权重矩阵
    // Rows: Tasks, Cols: Slots
    // Weight = Score (Higher is better)
    const n = sortedTasks.length;
    const m = availableSlots.length;
    
    // Cost Matrix for Hungarian (Min Cost). So Cost = MaxPossibleWeight - Weight.
    // Or we can use negative weights if the implementation supports it, but usually Hungarian takes positive costs.
    // Let's assume we want to MAXIMIZE Score.
    // Cost = 1000 - Score.
    
    const costMatrix: number[][] = Array(n).fill(0).map(() => Array(m).fill(0));
    const MAX_SCORE = 1000;

    // 预计算：每个社区的平均时间偏好（简化：假设社区ID影响时间偏好）
    // 实际应用中，可以分析社区中已固定任务的时间分布
    
    for (let i = 0; i < n; i++) {
      const task = sortedTasks[i];
      const communityId = communities.get(task.id);

      for (let j = 0; j < m; j++) {
        const slot = availableSlots[j];
        let score = 0;

        // 约束检查 (Hard Constraints)
        // 1. Fixed Events Conflict (Already handled by availableSlots generation usually, but double check)
        // Assuming availableSlots are free from fixed events.
        
        // 2. Deadline & Earliest Start
        if (slot.end > task.deadline || (task.earliestStart && slot.start < task.earliestStart)) {
          costMatrix[i][j] = Infinity; // Forbidden
          continue;
        }

        // 评分逻辑 (Soft Constraints)

        // A. 精力匹配 (Energy Match)
        // 假设 slot.isHighEnergy 来自外部输入或分析
        const isHighEnergyTask = task.energyRequirement === 'high';
        const isHighEnergySlot = slot.isHighEnergy === true;
        
        if (isHighEnergyTask && isHighEnergySlot) {
          score += 50; // 高精力任务匹配高精力时段：高分
        } else if (isHighEnergyTask && !isHighEnergySlot) {
          score -= 30; // 高精力任务匹配低精力时段：惩罚
        } else if (!isHighEnergyTask && isHighEnergySlot) {
          score -= 10; // 低精力任务占用高精力时段：轻微惩罚（浪费）
        } else {
          score += 10; // 普通匹配
        }

        // B. 碎片化 (Fragmentation)
        // 目标：留出大块时间。意味着任务应该尽量“靠拢”现有的忙碌块，或者填补小空隙。
        // 如果 slot 是“碎片化”的（例如两边都是忙碌，且正好能放下任务），加分。
        // 如果 slot 在大块空闲时间的中间，减分（因为它把大块时间切碎了）。
        if (slot.isFragmented) {
          score += 20; // 优先填补碎片
        } else {
          // 简单的启发式：越早越好（减少拖延），或者根据社区偏好
          // 这里我们假设“靠前”能减少碎片化（堆积效应）
          // score += (24 - slot.start.getHours()); 
        }

        // C. 任务关联性 (Community / Connections)
        // 如果任务属于某个社区，我们希望它和同社区的任务离得近。
        // 由于这是单次匹配，我们无法动态知道同社区其他任务的位置。
        // 替代方案：使用社区ID作为“时间分区”的哈希种子，或者根据社区ID给予特定的时间段偏好。
        // 例如：社区0偏好上午，社区1偏好下午。
        if (communityId !== undefined) {
           // 简单的聚类启发式：(CommunityID % 3) 映射到 (早/中/晚)
           const preferredPeriod = communityId % 3; // 0: Morning, 1: Afternoon, 2: Evening
           const hour = slot.start.getHours();
           let period = 2;
           if (hour < 12) period = 0;
           else if (hour < 18) period = 1;
           
           if (period === preferredPeriod) {
             score += 15;
           }
        }

        // D. 优先级
        if (task.priority) {
            score += (5 - task.priority) * 10; // Priority 1 (High) -> +40, Priority 5 -> +0
        }

        // Final Cost Calculation
        costMatrix[i][j] = MAX_SCORE - score;
      }
    }

    const matchingInput: BipartiteMatchingInput = {
      leftNodes: sortedTasks.map(t => t.id),
      rightNodes: availableSlots.map(s => s.id),
      costMatrix
    };

    const matchingResult = this.hungarianAlgorithm.execute(matchingInput);
    
    // 如果匈牙利算法找到了更好的匹配，使用它。
    // 注意：匈牙利算法可能无法匹配所有任务（如果约束太紧）。
    // 我们需要合并结果：优先使用匈牙利结果，未匹配的保留原样或标记失败。
    
    // 目前策略：直接返回匈牙利算法的结果
    return matchingResult.matches;
  }

  /**
   * 团队会议安排流程
   */
  public async scheduleTeamMeeting(
    teamMembers: TeamMember[],
    requirements: MeetingRequirement,
    weights?: { preference: number; adjustmentCost: number; fairness: number }
  ): Promise<LinearProgrammingResult & { metrics: PerformanceMetrics }> {
    return this.linearProgramming.scheduleMeeting({
      teamMembers,
      meetingRequirements: requirements,
      weights
    });
  }

  /**
   * 关键路径分析
   */
  public analyzeProjectCriticalPath(
    tasks: { id: string; duration: number; dependencies: string[] }[],
    startDate: Date
  ): CriticalPathResult & { metrics: PerformanceMetrics } {
    const input: CriticalPathInput = {
      tasks,
      startDate
    };
    return this.criticalPathAnalysis.analyze(input);
  }

  /**
   * 社区发现 (用于分析任务聚类)
   */
  public detectTaskCommunities(tasks: DDLTask[]): Map<string, number> {
    const graph = GraphUtils.buildGraphFromTasks(tasks);
    // Convert DDLTask graph to TaskNode graph expected by CommunityDetection
    const taskNodeGraph: Graph<TaskNode> = {
      nodes: new Map(),
      edges: graph.edges,
      adjacencyList: graph.adjacencyList
    };
    
    graph.nodes.forEach((task, id) => {
      taskNodeGraph.nodes.set(id, {
        taskId: task.id,
        type: 'task',
        duration: task.estimatedDuration
      });
    });

    const input: CommunityDetectionInput = {
      graph: taskNodeGraph
    };
    
    const result = this.communityDetection.execute(input);
    return result.communities;
  }

  /**
   * 分析用户精力模式
   * 使用社区发现算法识别高频/关联的时间段，按周几分类
   */
  public analyzeEnergyPatterns(tasks: any[]): Record<number, { startHour: number; endHour: number; score: number }[]> {
    const result: Record<number, { startHour: number; endHour: number; score: number }[]> = {};

    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        // Filter tasks for this day of week
        const dayTasks = tasks.filter(t => new Date(t.startTime).getDay() === dayOfWeek);
        
        if (dayTasks.length === 0) {
            result[dayOfWeek] = [];
            continue;
        }
        
        result[dayOfWeek] = this.detectHighEnergyHoursForSubset(dayTasks);
    }
    return result;
  }

  private detectHighEnergyHoursForSubset(tasks: any[]): { startHour: number; endHour: number; score: number }[] {
    // 1. Build Graph of Hours (0-23)
    const hourNodes = new Map<string, TaskNode>();
    for(let i=0; i<24; i++) {
        hourNodes.set(i.toString(), { taskId: i.toString(), type: 'hour', duration: 60 });
    }
    
    const edges: any[] = [];
    const edgeWeights = new Map<string, number>();
    
    // Group tasks by specific date (YYYY-MM-DD)
    const tasksByDate = new Map<string, number[]>();
    tasks.forEach(t => {
        const d = new Date(t.startTime);
        const dateKey = d.toDateString();
        const hour = d.getHours();
        if (!tasksByDate.has(dateKey)) tasksByDate.set(dateKey, []);
        tasksByDate.get(dateKey)!.push(hour);
    });
    
    // Build edges: Connect hours that appear in the same day (within 4 hours)
    tasksByDate.forEach((hours, day) => {
        const uniqueHours = Array.from(new Set(hours)).sort((a,b)=>a-b);
        for(let i=0; i<uniqueHours.length; i++) {
            for(let j=i+1; j<uniqueHours.length; j++) {
                const h1 = uniqueHours[i];
                const h2 = uniqueHours[j];
                if (Math.abs(h1 - h2) <= 4) {
                    const key = `${h1}-${h2}`;
                    edgeWeights.set(key, (edgeWeights.get(key) || 0) + 1);
                }
            }
        }
    });
    
    edgeWeights.forEach((weight, key) => {
        const [u, v] = key.split('-');
        edges.push({ from: u, to: v, weight });
    });
    
    // Build Adjacency List
    const adjacencyList = new Map<string, any[]>();
    hourNodes.forEach((_, id) => adjacencyList.set(id, []));
    edges.forEach(e => {
        adjacencyList.get(e.from)?.push(e);
        adjacencyList.get(e.to)?.push({ from: e.to, to: e.from, weight: e.weight });
    });

    const graph: Graph<TaskNode> = {
        nodes: hourNodes,
        edges: edges,
        adjacencyList: adjacencyList
    };
    
    // 2. Run Community Detection
    const input: CommunityDetectionInput = { graph, resolution: 1.0 };
    const result = this.communityDetection.execute(input);
    
    // 3. Analyze Communities
    const communities = new Map<number, number[]>(); // CommunityID -> [Hours]
    result.communities.forEach((commId, hourStr) => {
        if (!communities.has(commId)) communities.set(commId, []);
        communities.get(commId)!.push(parseInt(hourStr));
    });
    
    const highEnergyPeriods: { startHour: number; endHour: number; score: number }[] = [];
    
    communities.forEach((hours, commId) => {
        // Calculate score based on total frequency of these hours in history
        let totalFreq = 0;
        hours.forEach(h => {
            tasksByDate.forEach(dayHours => {
                if (dayHours.includes(h)) totalFreq++;
            });
        });
        
        // Normalize score (e.g. avg freq per hour)
        const score = totalFreq / hours.length;
        
        // If score is significant (heuristic threshold, e.g. > 1 occurrence for subset)
        if (totalFreq > 1) {
            const minH = Math.min(...hours);
            const maxH = Math.max(...hours);
            highEnergyPeriods.push({
                startHour: minH,
                endHour: maxH + 1, // Exclusive end
                score: score
            });
        }
    });
    
    return highEnergyPeriods.sort((a,b) => b.score - a.score);
  }

  /**
   * 完整个人日程安排函数
   * 自动区分固定任务和DDL任务，生成可用时间槽并进行调度
   */
  public async scheduleTasks(
    inputTasks: any[], // 接收原始 Task 数组
    config: {
      startHour?: number; // 每日开始时间 (e.g. 8)
      endHour?: number;   // 每日结束时间 (e.g. 22)
      slotDuration?: number; // 时间槽长度 (分钟)
      highEnergyPeriods?: Record<number, { startHour: number; endHour: number; score: number }[]> | any[]; // 高精力时段
    } = {}
  ): Promise<{
    scheduledTasks: any[]; // 更新后的任务列表
    metrics: PerformanceMetrics;
  }> {
    const startTime = performance.now();
    const { startHour = 8, endHour = 22, slotDuration = 60, highEnergyPeriods = [] } = config;

    const fixedEvents: FixedEvent[] = [];
    const ddlTasks: DDLTask[] = [];
    const taskMap = new Map<string, any>();

    // 1. 解析任务
    inputTasks.forEach(task => {
      taskMap.set(task.id, task);
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const due = new Date(task.dueDate);

      // 判断逻辑：
      // 1. 如果明确标记为 isFixed，则是固定任务
      // 2. 如果没有标记 isFixed，但有 estimatedDuration，则是 DDL 任务 (Flexible)
      // 3. 如果没有标记 isFixed 且没有 estimatedDuration，但 start != end，则是固定任务 (Fixed)
      // 4. 否则 (start == end, no duration)，默认为 DDL 任务 (Flexible)
      
      let isFixed = true; // Default to true as per user request
      if (task.isFixed !== undefined) {
          isFixed = task.isFixed;
      }

      if (isFixed) {
        fixedEvents.push({
          id: task.id,
          name: task.name,
          startTime: start,
          endTime: end,
          originalEvent: task
        });
      } else {
        // DDL Task
        // 如果没有 estimatedDuration，默认 60 分钟
        const duration = task.estimatedDuration || 60;
        
        // 确定 deadline 和 earliestStart
        // 用户要求：ddl型任务不一定start = end，需要在start和end的区间内调度
        let deadline = due;
        // 如果 end > start，优先使用 end 作为 deadline (表示区间结束)
        if (end.getTime() > start.getTime()) {
            deadline = end;
        }

        ddlTasks.push({
          id: task.id,
          name: task.name,
          deadline: deadline,
          estimatedDuration: duration,
          priority: task.importance === 'high' ? 1 : (task.importance === 'low' ? 3 : 2),
          originalTask: task,
          earliestStart: start,
          energyRequirement: task.energyRequirement || 'normal', // 假设任务有此属性
          tags: task.tags || []
        });
      }
    });

    // 2. 生成可用时间槽
    // 范围：从现在（或最早任务开始时间）到最晚截止时间
    const now = new Date();
    let rangeStart = now;
    let rangeEnd = now;

    if (ddlTasks.length > 0) {
      // 找到最晚的 deadline
      const maxDeadline = new Date(Math.max(...ddlTasks.map(t => t.deadline.getTime())));
      rangeEnd = maxDeadline;
    } else {
      // 如果没有 DDL 任务，只处理固定任务？或者默认安排未来一周
      rangeEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
    
    // 确保 rangeEnd 至少是今天结束
    if (rangeEnd < now) rangeEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const allSlots = TimeUtils.generateTimeSlots(
      `${startHour}:00`, 
      `${endHour}:00`, 
      slotDuration
    ); 
    // generateTimeSlots 只生成一天的，我们需要扩展到 rangeEnd
    
    const expandedSlots: TimeSlot[] = [];
    let currentDay = new Date(rangeStart);
    currentDay.setHours(0, 0, 0, 0);
    const endDay = new Date(rangeEnd);
    endDay.setHours(0, 0, 0, 0);

    while (currentDay <= endDay) {
      allSlots.forEach(baseSlot => {
        const slotStart = new Date(currentDay);
        slotStart.setHours(baseSlot.start.getHours(), baseSlot.start.getMinutes());
        
        const slotEnd = new Date(currentDay);
        slotEnd.setHours(baseSlot.end.getHours(), baseSlot.end.getMinutes());

        // 过滤掉已经过去的时间槽
        if (slotStart < now) return;

        // 检查是否被固定事件占用
        const isOccupied = fixedEvents.some(event => 
          TimeUtils.hasTimeOverlap(
              { start: slotStart, end: slotEnd, id: 'temp' }, 
              { start: event.startTime, end: event.endTime, id: event.id }
          )
        );
        
        if (!isOccupied) {
            // 碎片化检测
            const isFragmented = FragmentationUtils.isFragmented(slotStart, slotEnd, fixedEvents);
            
            // 高精力时段检测
            const hour = slotStart.getHours();
            const dayOfWeek = slotStart.getDay(); // 0-6
            let isHighEnergy = false;
            
            // 获取当天的精力配置
            // highEnergyPeriods is now Record<number, Period[]>
            // Check if it's an array (old format) or object (new format)
            let dailyPeriods: { startHour: number; endHour: number; score: number }[] = [];
            
            if (Array.isArray(highEnergyPeriods)) {
                // Backward compatibility or if user passed simple array
                dailyPeriods = highEnergyPeriods;
            } else if (highEnergyPeriods && typeof highEnergyPeriods === 'object') {
                dailyPeriods = highEnergyPeriods[dayOfWeek] || [];
            }

            if (dailyPeriods.length > 0) {
                isHighEnergy = dailyPeriods.some(p => hour >= p.startHour && hour < p.endHour);
            } else {
                // Fallback
                isHighEnergy = (hour >= 9 && hour <= 11);
            }

            expandedSlots.push({
              id: `slot_${slotStart.getTime()}`,
              start: slotStart,
              end: slotEnd,
              isHighEnergy: isHighEnergy,
              isFragmented: isFragmented
            });
        }
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // 3. 调用优化算法
    const assignments = await this.optimizePersonalSchedule(
      ddlTasks,
      fixedEvents,
      expandedSlots
    );

    // 4. 更新任务结果
    const scheduledTasks = [...inputTasks];
    assignments.forEach((slotId, taskId) => {
      const slot = expandedSlots.find(s => s.id === slotId);
      if (slot) {
        const taskIndex = scheduledTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          const originalTask = scheduledTasks[taskIndex];
          // 生成子任务作为建议安排，而不是直接修改原任务
          scheduledTasks[taskIndex] = {
            ...originalTask,
            id: uuidv4(), // 新 ID
            parentTaskId: originalTask.id, // 指向父任务
            startTime: slot.start.toISOString(), // 更新为安排的时间
            endTime: slot.end.toISOString(),
            scheduleType: 'single', // 确保标记为已安排
            isFixed: false // 安排后不再视为固定
          };
        }
      }
    });

    const endTime = performance.now();

    return {
      scheduledTasks,
      metrics: {
        executionTime: endTime - startTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        solutionQuality: 1.0 // Placeholder
      }
    };
  }

  /**
   * 完整团队任务/会议安排函数
   * 自动从成员的任务列表中提取忙碌时间段，并进行会议调度
   */
  public async scheduleTeamTasks(
    members: Array<{
      id: string;
      name: string;
      tasks: any[]; // 原始任务列表
      preferences?: TimeSlot[]; // 偏好时间
      maxAdjustmentCost?: number;
    }>,
    meetingDetails: {
      name: string;
      duration: number;
      windowStart: string | Date;
      windowEnd: string | Date;
      requiredParticipants?: string[];
      optionalParticipants?: string[];
    },
    config: {
      weights?: { preference: number; adjustmentCost: number; fairness: number };
    } = {}
  ): Promise<LinearProgrammingResult & { metrics: PerformanceMetrics }> {
    const teamMembers: TeamMember[] = members.map(m => {
      const busySlots: TimeSlot[] = [];
      
      if (m.tasks && Array.isArray(m.tasks)) {
        m.tasks.forEach(task => {
          const start = new Date(task.startTime);
          const end = new Date(task.endTime);
          
          // 判定忙碌逻辑：
          // 1. 明确标记为固定任务
          // 2. 或者有明确的时间段 (start < end) 且不是仅有截止时间的DDL任务(通常DDL任务初始start=end=due)
          //    注意：如果任务已经被 scheduleTasks 调度过，它会有明确的时间段。
          //    这里我们假设所有有时间跨度的任务都视为"忙碌"，除非特别标记。
          const isOccupied = task.isFixed || (start.getTime() < end.getTime());
          
          if (isOccupied) {
            busySlots.push({
              id: task.id, // TimeSlot needs id
              start: start,
              end: end
            });
          }
        });
      }

      return {
        id: m.id,
        name: m.name,
        busySlots: busySlots,
        preferences: m.preferences || [],
        maxAdjustmentCost: m.maxAdjustmentCost ?? 100 // Default cost
      };
    });

    const requirements: MeetingRequirement = {
      duration: meetingDetails.duration,
      windowStart: new Date(meetingDetails.windowStart),
      windowEnd: new Date(meetingDetails.windowEnd),
      requiredParticipants: meetingDetails.requiredParticipants || members.map(m => m.id),
      optionalParticipants: meetingDetails.optionalParticipants || []
    };

    return this.scheduleTeamMeeting(teamMembers, requirements, config.weights);
  }
}
