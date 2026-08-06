function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { AlgorithmError } from "./types.js";
import { performance } from "perf_hooks";
export var TopologicalSortAlgorithm = /*#__PURE__*/function () {
  function TopologicalSortAlgorithm() {
    _classCallCheck(this, TopologicalSortAlgorithm);
  }
  return _createClass(TopologicalSortAlgorithm, [{
    key: "execute",
    value: function execute(input) {
      var startTime = performance.now();
      this.validateInput(input);
      var tasks = input.tasks,
        dependencies = input.dependencies,
        _input$strategy = input.strategy,
        strategy = _input$strategy === void 0 ? 'default' : _input$strategy;
      var taskMap = new Map();
      tasks.forEach(function (t) {
        return taskMap.set(t.id, t);
      });

      // 1. Build Graph and Calculate In-Degrees
      var adj = new Map();
      var inDegree = new Map();
      tasks.forEach(function (t) {
        adj.set(t.id, []);
        inDegree.set(t.id, 0);
      });
      dependencies.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          from = _ref2[0],
          to = _ref2[1];
        if (!taskMap.has(from) || !taskMap.has(to)) {
          // Ignore dependencies for tasks not in the list, or throw?
          // Let's ignore or warn. For strictness, we might want to throw.
          // Assuming valid input for now.
          return;
        }
        adj.get(from).push(to);
        inDegree.set(to, (inDegree.get(to) || 0) + 1);
      });

      // 2. Initialize Queue with In-Degree 0
      var queue = [];
      tasks.forEach(function (t) {
        if (inDegree.get(t.id) === 0) {
          queue.push(t.id);
        }
      });
      var order = [];
      var levels = new Map();
      var currentLevel = 0;
      var processedCount = 0;

      // 3. Process Queue (Level by Level)
      while (queue.length > 0) {
        // Sort queue based on strategy
        this.sortQueue(queue, strategy, taskMap);
        var nextQueue = [];
        var _iterator = _createForOfIteratorHelper(queue),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var taskId = _step.value;
            order.push(taskId);
            levels.set(taskId, currentLevel);
            processedCount++;
            var neighbors = adj.get(taskId) || [];
            var _iterator2 = _createForOfIteratorHelper(neighbors),
              _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var neighbor = _step2.value;
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) {
                  nextQueue.push(neighbor);
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        queue = nextQueue;
        currentLevel++;
      }

      // 4. Check for Cycles
      var hasCycle = processedCount < tasks.length;
      var cycles = undefined;
      if (hasCycle) {
        // Identify nodes involved in cycle (those with inDegree > 0)
        var cycleNodes = tasks.filter(function (t) {
          return (inDegree.get(t.id) || 0) > 0;
        }).map(function (t) {
          return t.id;
        });
        // Simple reporting: just return the nodes. 
        // Finding exact simple cycles is complex (Johnson's algorithm), 
        // but we can return the subgraph of remaining nodes.
        cycles = [cycleNodes];
      }
      var endTime = performance.now();
      var metrics = {
        executionTime: endTime - startTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        solutionQuality: hasCycle ? 0 : 1
      };
      return {
        order: hasCycle ? [] : order,
        // If cycle, order is partial/invalid for full execution
        hasCycle: hasCycle,
        levels: levels,
        cycles: cycles,
        metrics: metrics
      };
    }
  }, {
    key: "sortQueue",
    value: function sortQueue(queue, strategy, taskMap) {
      if (strategy === 'default') return;
      queue.sort(function (a, b) {
        var taskA = taskMap.get(a);
        var taskB = taskMap.get(b);
        if (strategy === 'priority') {
          // Higher priority first (assuming higher number = higher priority? Or lower? 
          // Usually priority 1 is high. Let's assume higher number is higher priority for now, 
          // or check DDLTask definition. It says `priority?: number`. 
          // Let's assume standard: higher value = higher priority.
          var pA = taskA.priority || 0;
          var pB = taskB.priority || 0;
          return pB - pA;
        } else if (strategy === 'deadline') {
          // Earlier deadline first
          return taskA.deadline.getTime() - taskB.deadline.getTime();
        }
        return 0;
      });
    }
  }, {
    key: "validateInput",
    value: function validateInput(input) {
      if (!input.tasks) {
        throw new AlgorithmError('Tasks are required', 'TopologicalSort', input, 'fatal');
      }
      // Check for self-loops in dependencies
      input.dependencies.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          from = _ref4[0],
          to = _ref4[1];
        if (from === to) {
          throw new AlgorithmError("Self-dependency detected for task ".concat(from), 'TopologicalSort', input, 'error');
        }
      });
    }
  }]);
}();