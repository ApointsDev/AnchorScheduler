function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { TopologicalSortAlgorithm } from "./TopologicalSort.js";
import { GraphColoringAlgorithm } from "./GraphColoring.js";
import { HungarianAlgorithm } from "./HungarianAlgorithm.js";
import { MaxFlowMinCutAlgorithm } from "./MaxFlowMinCut.js";
import { CommunityDetectionAlgorithm } from "./CommunityDetection.js";
import { CriticalPathAnalysis } from "./CriticalPathAnalysis.js";
import { LinearProgramming } from "./LinearProgramming.js";
import { v4 as uuidv4 } from "uuid";
import { TimeUtils } from "./utils/TimeUtils.js";
import { GraphUtils } from "./utils/GraphUtils.js";
import { performance } from "perf_hooks";
import { FragmentationUtils } from "./utils/FragmentationUtils.js";
export var AlgorithmService = /*#__PURE__*/function () {
  function AlgorithmService() {
    _classCallCheck(this, AlgorithmService);
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
  return _createClass(AlgorithmService, [{
    key: "optimizePersonalSchedule",
    value: (function () {
      var _optimizePersonalSchedule = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(tasks, fixedEvents, availableSlots) {
        var dependencies,
          sortInput,
          sortResult,
          sortedTaskIds,
          sortedTasks,
          coloringInput,
          coloringResult,
          communities,
          n,
          m,
          costMatrix,
          MAX_SCORE,
          i,
          task,
          communityId,
          j,
          slot,
          score,
          isHighEnergyTask,
          isHighEnergySlot,
          preferredPeriod,
          hour,
          period,
          matchingInput,
          matchingResult,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              dependencies = _args.length > 3 && _args[3] !== undefined ? _args[3] : [];
              // 1. 依赖分析
              sortInput = {
                tasks: tasks,
                dependencies: dependencies
              };
              sortResult = this.topologicalSort.execute(sortInput);
              if (!sortResult.hasCycle) {
                _context.n = 1;
                break;
              }
              throw new Error('Cyclic dependency detected in tasks');
            case 1:
              // Reorder tasks based on topological sort for processing priority
              sortedTaskIds = sortResult.order;
              sortedTasks = sortedTaskIds.map(function (id) {
                return tasks.find(function (t) {
                  return t.id === id;
                });
              }).filter(function (t) {
                return t !== undefined;
              }); // 2. 冲突消解 (Graph Coloring)
              // We treat available slots as "colors"
              // If we have more tasks than slots, we might need multiple tasks per slot (if allowed)
              // or we just assign time slots.
              // Here we assume Graph Coloring assigns "Time Slots" to "Tasks" to avoid conflicts.
              coloringInput = {
                tasks: sortedTasks,
                fixedEvents: fixedEvents,
                timeSlots: availableSlots,
                constraints: {
                  maxTasksPerSlot: 1
                }
              };
              _context.n = 2;
              return this.graphColoring.execute(coloringInput);
            case 2:
              coloringResult = _context.v;
              // 3. 偏好优化 (Hungarian Algorithm) - Max Weight Matching
              // 使用二分图最大权匹配来优化时间槽分配
              // 考虑因素：精力匹配、碎片化程度、任务关联性
              // 3.1 社区发现：识别任务关联性
              communities = this.detectTaskCommunities(tasks); // 3.2 构建权重矩阵
              // Rows: Tasks, Cols: Slots
              // Weight = Score (Higher is better)
              n = sortedTasks.length;
              m = availableSlots.length; // Cost Matrix for Hungarian (Min Cost). So Cost = MaxPossibleWeight - Weight.
              // Or we can use negative weights if the implementation supports it, but usually Hungarian takes positive costs.
              // Let's assume we want to MAXIMIZE Score.
              // Cost = 1000 - Score.
              costMatrix = Array(n).fill(0).map(function () {
                return Array(m).fill(0);
              });
              MAX_SCORE = 1000; // 预计算：每个社区的平均时间偏好（简化：假设社区ID影响时间偏好）
              // 实际应用中，可以分析社区中已固定任务的时间分布
              i = 0;
            case 3:
              if (!(i < n)) {
                _context.n = 8;
                break;
              }
              task = sortedTasks[i];
              communityId = communities.get(task.id);
              j = 0;
            case 4:
              if (!(j < m)) {
                _context.n = 7;
                break;
              }
              slot = availableSlots[j];
              score = 0; // 约束检查 (Hard Constraints)
              // 1. Fixed Events Conflict (Already handled by availableSlots generation usually, but double check)
              // Assuming availableSlots are free from fixed events.
              // 2. Deadline & Earliest Start
              if (!(slot.end > task.deadline || task.earliestStart && slot.start < task.earliestStart)) {
                _context.n = 5;
                break;
              }
              costMatrix[i][j] = Infinity; // Forbidden
              return _context.a(3, 6);
            case 5:
              // 评分逻辑 (Soft Constraints)
              // A. 精力匹配 (Energy Match)
              // 假设 slot.isHighEnergy 来自外部输入或分析
              isHighEnergyTask = task.energyRequirement === 'high';
              isHighEnergySlot = slot.isHighEnergy === true;
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
                preferredPeriod = communityId % 3; // 0: Morning, 1: Afternoon, 2: Evening
                hour = slot.start.getHours();
                period = 2;
                if (hour < 12) period = 0;else if (hour < 18) period = 1;
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
            case 6:
              j++;
              _context.n = 4;
              break;
            case 7:
              i++;
              _context.n = 3;
              break;
            case 8:
              matchingInput = {
                leftNodes: sortedTasks.map(function (t) {
                  return t.id;
                }),
                rightNodes: availableSlots.map(function (s) {
                  return s.id;
                }),
                costMatrix: costMatrix
              };
              matchingResult = this.hungarianAlgorithm.execute(matchingInput); // 如果匈牙利算法找到了更好的匹配，使用它。
              // 注意：匈牙利算法可能无法匹配所有任务（如果约束太紧）。
              // 我们需要合并结果：优先使用匈牙利结果，未匹配的保留原样或标记失败。
              // 目前策略：直接返回匈牙利算法的结果
              return _context.a(2, matchingResult.matches);
          }
        }, _callee, this);
      }));
      function optimizePersonalSchedule(_x, _x2, _x3) {
        return _optimizePersonalSchedule.apply(this, arguments);
      }
      return optimizePersonalSchedule;
    }()
    /**
     * 团队会议安排流程
     */
    )
  }, {
    key: "scheduleTeamMeeting",
    value: (function () {
      var _scheduleTeamMeeting = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(teamMembers, requirements, weights) {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              return _context2.a(2, this.linearProgramming.scheduleMeeting({
                teamMembers: teamMembers,
                meetingRequirements: requirements,
                weights: weights
              }));
          }
        }, _callee2, this);
      }));
      function scheduleTeamMeeting(_x4, _x5, _x6) {
        return _scheduleTeamMeeting.apply(this, arguments);
      }
      return scheduleTeamMeeting;
    }()
    /**
     * 关键路径分析
     */
    )
  }, {
    key: "analyzeProjectCriticalPath",
    value: function analyzeProjectCriticalPath(tasks, startDate) {
      var input = {
        tasks: tasks,
        startDate: startDate
      };
      return this.criticalPathAnalysis.analyze(input);
    }

    /**
     * 社区发现 (用于分析任务聚类)
     */
  }, {
    key: "detectTaskCommunities",
    value: function detectTaskCommunities(tasks) {
      var graph = GraphUtils.buildGraphFromTasks(tasks);
      // Convert DDLTask graph to TaskNode graph expected by CommunityDetection
      var taskNodeGraph = {
        nodes: new Map(),
        edges: graph.edges,
        adjacencyList: graph.adjacencyList
      };
      graph.nodes.forEach(function (task, id) {
        taskNodeGraph.nodes.set(id, {
          taskId: task.id,
          type: 'task',
          duration: task.estimatedDuration
        });
      });
      var input = {
        graph: taskNodeGraph
      };
      var result = this.communityDetection.execute(input);
      return result.communities;
    }

    /**
     * 分析用户精力模式
     * 使用社区发现算法识别高频/关联的时间段，按周几分类
     */
  }, {
    key: "analyzeEnergyPatterns",
    value: function analyzeEnergyPatterns(tasks) {
      var _this = this;
      var result = {};

      // 0 = Sunday, 1 = Monday, ... 6 = Saturday
      var _loop = function _loop(dayOfWeek) {
        // Filter tasks for this day of week
        var dayTasks = tasks.filter(function (t) {
          return new Date(t.startTime).getDay() === dayOfWeek;
        });
        if (dayTasks.length === 0) {
          result[dayOfWeek] = [];
          return 1; // continue
        }
        result[dayOfWeek] = _this.detectHighEnergyHoursForSubset(dayTasks);
      };
      for (var dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (_loop(dayOfWeek)) continue;
      }
      return result;
    }
  }, {
    key: "detectHighEnergyHoursForSubset",
    value: function detectHighEnergyHoursForSubset(tasks) {
      // 1. Build Graph of Hours (0-23)
      var hourNodes = new Map();
      for (var i = 0; i < 24; i++) {
        hourNodes.set(i.toString(), {
          taskId: i.toString(),
          type: 'hour',
          duration: 60
        });
      }
      var edges = [];
      var edgeWeights = new Map();

      // Group tasks by specific date (YYYY-MM-DD)
      var tasksByDate = new Map();
      tasks.forEach(function (t) {
        var d = new Date(t.startTime);
        var dateKey = d.toDateString();
        var hour = d.getHours();
        if (!tasksByDate.has(dateKey)) tasksByDate.set(dateKey, []);
        tasksByDate.get(dateKey).push(hour);
      });

      // Build edges: Connect hours that appear in the same day (within 4 hours)
      tasksByDate.forEach(function (hours, day) {
        var uniqueHours = Array.from(new Set(hours)).sort(function (a, b) {
          return a - b;
        });
        for (var _i = 0; _i < uniqueHours.length; _i++) {
          for (var j = _i + 1; j < uniqueHours.length; j++) {
            var h1 = uniqueHours[_i];
            var h2 = uniqueHours[j];
            if (Math.abs(h1 - h2) <= 4) {
              var key = "".concat(h1, "-").concat(h2);
              edgeWeights.set(key, (edgeWeights.get(key) || 0) + 1);
            }
          }
        }
      });
      edgeWeights.forEach(function (weight, key) {
        var _key$split = key.split('-'),
          _key$split2 = _slicedToArray(_key$split, 2),
          u = _key$split2[0],
          v = _key$split2[1];
        edges.push({
          from: u,
          to: v,
          weight: weight
        });
      });

      // Build Adjacency List
      var adjacencyList = new Map();
      hourNodes.forEach(function (_, id) {
        return adjacencyList.set(id, []);
      });
      edges.forEach(function (e) {
        var _adjacencyList$get, _adjacencyList$get2;
        (_adjacencyList$get = adjacencyList.get(e.from)) === null || _adjacencyList$get === void 0 || _adjacencyList$get.push(e);
        (_adjacencyList$get2 = adjacencyList.get(e.to)) === null || _adjacencyList$get2 === void 0 || _adjacencyList$get2.push({
          from: e.to,
          to: e.from,
          weight: e.weight
        });
      });
      var graph = {
        nodes: hourNodes,
        edges: edges,
        adjacencyList: adjacencyList
      };

      // 2. Run Community Detection
      var input = {
        graph: graph,
        resolution: 1.0
      };
      var result = this.communityDetection.execute(input);

      // 3. Analyze Communities
      var communities = new Map(); // CommunityID -> [Hours]
      result.communities.forEach(function (commId, hourStr) {
        if (!communities.has(commId)) communities.set(commId, []);
        communities.get(commId).push(parseInt(hourStr));
      });
      var highEnergyPeriods = [];
      communities.forEach(function (hours, commId) {
        // Calculate score based on total frequency of these hours in history
        var totalFreq = 0;
        hours.forEach(function (h) {
          tasksByDate.forEach(function (dayHours) {
            if (dayHours.includes(h)) totalFreq++;
          });
        });

        // Normalize score (e.g. avg freq per hour)
        var score = totalFreq / hours.length;

        // If score is significant (heuristic threshold, e.g. > 1 occurrence for subset)
        if (totalFreq > 1) {
          var minH = Math.min.apply(Math, _toConsumableArray(hours));
          var maxH = Math.max.apply(Math, _toConsumableArray(hours));
          highEnergyPeriods.push({
            startHour: minH,
            endHour: maxH + 1,
            // Exclusive end
            score: score
          });
        }
      });
      return highEnergyPeriods.sort(function (a, b) {
        return b.score - a.score;
      });
    }

    /**
     * 完整个人日程安排函数
     * 自动区分固定任务和DDL任务，生成可用时间槽并进行调度
     */
  }, {
    key: "scheduleTasks",
    value: (function () {
      var _scheduleTasks = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(inputTasks) {
        var config,
          startTime,
          _config$startHour,
          startHour,
          _config$endHour,
          endHour,
          _config$slotDuration,
          slotDuration,
          _config$highEnergyPer,
          highEnergyPeriods,
          fixedEvents,
          ddlTasks,
          taskMap,
          now,
          rangeStart,
          rangeEnd,
          maxDeadline,
          allSlots,
          expandedSlots,
          currentDay,
          endDay,
          assignments,
          scheduledTasks,
          endTime,
          _args3 = arguments;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              config = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              startTime = performance.now();
              _config$startHour = config.startHour, startHour = _config$startHour === void 0 ? 8 : _config$startHour, _config$endHour = config.endHour, endHour = _config$endHour === void 0 ? 22 : _config$endHour, _config$slotDuration = config.slotDuration, slotDuration = _config$slotDuration === void 0 ? 60 : _config$slotDuration, _config$highEnergyPer = config.highEnergyPeriods, highEnergyPeriods = _config$highEnergyPer === void 0 ? [] : _config$highEnergyPer;
              fixedEvents = [];
              ddlTasks = [];
              taskMap = new Map(); // 1. 解析任务
              inputTasks.forEach(function (task) {
                taskMap.set(task.id, task);
                var start = new Date(task.startTime);
                var end = new Date(task.endTime);
                var due = new Date(task.dueDate);

                // 判断逻辑：
                // 1. 如果明确标记为 isFixed，则是固定任务
                // 2. 如果没有标记 isFixed，但有 estimatedDuration，则是 DDL 任务 (Flexible)
                // 3. 如果没有标记 isFixed 且没有 estimatedDuration，但 start != end，则是固定任务 (Fixed)
                // 4. 否则 (start == end, no duration)，默认为 DDL 任务 (Flexible)

                var isFixed = true; // Default to true as per user request
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
                  var duration = task.estimatedDuration || 60;

                  // 确定 deadline 和 earliestStart
                  // 用户要求：ddl型任务不一定start = end，需要在start和end的区间内调度
                  var deadline = due;
                  // 如果 end > start，优先使用 end 作为 deadline (表示区间结束)
                  if (end.getTime() > start.getTime()) {
                    deadline = end;
                  }
                  ddlTasks.push({
                    id: task.id,
                    name: task.name,
                    deadline: deadline,
                    estimatedDuration: duration,
                    priority: task.importance === 'high' ? 1 : task.importance === 'low' ? 3 : 2,
                    originalTask: task,
                    earliestStart: start,
                    energyRequirement: task.energyRequirement || 'normal',
                    // 假设任务有此属性
                    tags: task.tags || []
                  });
                }
              });

              // 2. 生成可用时间槽
              // 范围：从现在（或最早任务开始时间）到最晚截止时间
              now = new Date();
              rangeStart = now;
              rangeEnd = now;
              if (ddlTasks.length > 0) {
                // 找到最晚的 deadline
                maxDeadline = new Date(Math.max.apply(Math, _toConsumableArray(ddlTasks.map(function (t) {
                  return t.deadline.getTime();
                }))));
                rangeEnd = maxDeadline;
              } else {
                // 如果没有 DDL 任务，只处理固定任务？或者默认安排未来一周
                rangeEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              }

              // 确保 rangeEnd 至少是今天结束
              if (rangeEnd < now) rangeEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              allSlots = TimeUtils.generateTimeSlots("".concat(startHour, ":00"), "".concat(endHour, ":00"), slotDuration); // generateTimeSlots 只生成一天的，我们需要扩展到 rangeEnd
              expandedSlots = [];
              currentDay = new Date(rangeStart);
              currentDay.setHours(0, 0, 0, 0);
              endDay = new Date(rangeEnd);
              endDay.setHours(0, 0, 0, 0);
              while (currentDay <= endDay) {
                allSlots.forEach(function (baseSlot) {
                  var slotStart = new Date(currentDay);
                  slotStart.setHours(baseSlot.start.getHours(), baseSlot.start.getMinutes());
                  var slotEnd = new Date(currentDay);
                  slotEnd.setHours(baseSlot.end.getHours(), baseSlot.end.getMinutes());

                  // 过滤掉已经过去的时间槽
                  if (slotStart < now) return;

                  // 检查是否被固定事件占用
                  var isOccupied = fixedEvents.some(function (event) {
                    return TimeUtils.hasTimeOverlap({
                      start: slotStart,
                      end: slotEnd,
                      id: 'temp'
                    }, {
                      start: event.startTime,
                      end: event.endTime,
                      id: event.id
                    });
                  });
                  if (!isOccupied) {
                    // 碎片化检测
                    var isFragmented = FragmentationUtils.isFragmented(slotStart, slotEnd, fixedEvents);

                    // 高精力时段检测
                    var hour = slotStart.getHours();
                    var dayOfWeek = slotStart.getDay(); // 0-6
                    var isHighEnergy = false;

                    // 获取当天的精力配置
                    // highEnergyPeriods is now Record<number, Period[]>
                    // Check if it's an array (old format) or object (new format)
                    var dailyPeriods = [];
                    if (Array.isArray(highEnergyPeriods)) {
                      // Backward compatibility or if user passed simple array
                      dailyPeriods = highEnergyPeriods;
                    } else if (highEnergyPeriods && _typeof(highEnergyPeriods) === 'object') {
                      dailyPeriods = highEnergyPeriods[dayOfWeek] || [];
                    }
                    if (dailyPeriods.length > 0) {
                      isHighEnergy = dailyPeriods.some(function (p) {
                        return hour >= p.startHour && hour < p.endHour;
                      });
                    } else {
                      // Fallback
                      isHighEnergy = hour >= 9 && hour <= 11;
                    }
                    expandedSlots.push({
                      id: "slot_".concat(slotStart.getTime()),
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
              _context3.n = 1;
              return this.optimizePersonalSchedule(ddlTasks, fixedEvents, expandedSlots);
            case 1:
              assignments = _context3.v;
              // 4. 更新任务结果
              scheduledTasks = _toConsumableArray(inputTasks);
              assignments.forEach(function (slotId, taskId) {
                var slot = expandedSlots.find(function (s) {
                  return s.id === slotId;
                });
                if (slot) {
                  var taskIndex = scheduledTasks.findIndex(function (t) {
                    return t.id === taskId;
                  });
                  if (taskIndex !== -1) {
                    var originalTask = scheduledTasks[taskIndex];
                    // 生成子任务作为建议安排，而不是直接修改原任务
                    scheduledTasks[taskIndex] = _objectSpread(_objectSpread({}, originalTask), {}, {
                      id: uuidv4(),
                      // 新 ID
                      parentTaskId: originalTask.id,
                      // 指向父任务
                      startTime: slot.start.toISOString(),
                      // 更新为安排的时间
                      endTime: slot.end.toISOString(),
                      scheduleType: 'single',
                      // 确保标记为已安排
                      isFixed: false // 安排后不再视为固定
                    });
                  }
                }
              });
              endTime = performance.now();
              return _context3.a(2, {
                scheduledTasks: scheduledTasks,
                metrics: {
                  executionTime: endTime - startTime,
                  memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
                  solutionQuality: 1.0 // Placeholder
                }
              });
          }
        }, _callee3, this);
      }));
      function scheduleTasks(_x7) {
        return _scheduleTasks.apply(this, arguments);
      }
      return scheduleTasks;
    }()
    /**
     * 完整团队任务/会议安排函数
     * 自动从成员的任务列表中提取忙碌时间段，并进行会议调度
     */
    )
  }, {
    key: "scheduleTeamTasks",
    value: (function () {
      var _scheduleTeamTasks = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(members, meetingDetails) {
        var config,
          teamMembers,
          requirements,
          _args4 = arguments;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              config = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
              teamMembers = members.map(function (m) {
                var _m$maxAdjustmentCost;
                var busySlots = [];
                if (m.tasks && Array.isArray(m.tasks)) {
                  m.tasks.forEach(function (task) {
                    var start = new Date(task.startTime);
                    var end = new Date(task.endTime);

                    // 判定忙碌逻辑：
                    // 1. 明确标记为固定任务
                    // 2. 或者有明确的时间段 (start < end) 且不是仅有截止时间的DDL任务(通常DDL任务初始start=end=due)
                    //    注意：如果任务已经被 scheduleTasks 调度过，它会有明确的时间段。
                    //    这里我们假设所有有时间跨度的任务都视为"忙碌"，除非特别标记。
                    var isOccupied = task.isFixed || start.getTime() < end.getTime();
                    if (isOccupied) {
                      busySlots.push({
                        id: task.id,
                        // TimeSlot needs id
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
                  maxAdjustmentCost: (_m$maxAdjustmentCost = m.maxAdjustmentCost) !== null && _m$maxAdjustmentCost !== void 0 ? _m$maxAdjustmentCost : 100 // Default cost
                };
              });
              requirements = {
                duration: meetingDetails.duration,
                windowStart: new Date(meetingDetails.windowStart),
                windowEnd: new Date(meetingDetails.windowEnd),
                requiredParticipants: meetingDetails.requiredParticipants || members.map(function (m) {
                  return m.id;
                }),
                optionalParticipants: meetingDetails.optionalParticipants || []
              };
              return _context4.a(2, this.scheduleTeamMeeting(teamMembers, requirements, config.weights));
          }
        }, _callee4, this);
      }));
      function scheduleTeamTasks(_x8, _x9) {
        return _scheduleTeamTasks.apply(this, arguments);
      }
      return scheduleTeamTasks;
    }())
  }]);
}();