function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { performance } from "perf_hooks";
export var CriticalPathAnalysis = /*#__PURE__*/function () {
  function CriticalPathAnalysis() {
    _classCallCheck(this, CriticalPathAnalysis);
  }
  return _createClass(CriticalPathAnalysis, [{
    key: "analyze",
    value: function analyze(input) {
      var startTime = performance.now();
      var tasks = input.tasks,
        startDate = input.startDate;
      var taskMap = new Map();
      var adj = new Map(); // Adjacency list (successors)
      var revAdj = new Map(); // Reverse adjacency list (predecessors)
      var inDegree = new Map();

      // 1. Initialize and Calculate Durations (PERT if applicable)
      var durations = new Map();
      tasks.forEach(function (task) {
        taskMap.set(task.id, task);
        adj.set(task.id, []);
        revAdj.set(task.id, []);
        inDegree.set(task.id, 0);
        var duration = task.duration;
        if (task.optimistic !== undefined && task.pessimistic !== undefined && task.mostLikely !== undefined) {
          // PERT Formula: (O + 4M + P) / 6
          duration = (task.optimistic + 4 * task.mostLikely + task.pessimistic) / 6;
        }
        durations.set(task.id, duration);
      });

      // 2. Build Graph
      tasks.forEach(function (task) {
        task.dependencies.forEach(function (depId) {
          if (!taskMap.has(depId)) {
            throw new Error("Dependency ".concat(depId, " not found for task ").concat(task.id));
          }
          adj.get(depId).push(task.id);
          revAdj.get(task.id).push(depId);
          inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
        });
      });

      // 3. Topological Sort (Kahn's Algorithm) to ensure DAG and get processing order
      var sortedOrder = [];
      var queue = [];
      var tempInDegree = new Map(inDegree);
      tasks.forEach(function (task) {
        if (tempInDegree.get(task.id) === 0) {
          queue.push(task.id);
        }
      });
      while (queue.length > 0) {
        var u = queue.shift();
        sortedOrder.push(u);
        var neighbors = adj.get(u) || [];
        var _iterator = _createForOfIteratorHelper(neighbors),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var v = _step.value;
            tempInDegree.set(v, tempInDegree.get(v) - 1);
            if (tempInDegree.get(v) === 0) {
              queue.push(v);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      if (sortedOrder.length !== tasks.length) {
        throw new Error("Cycle detected in task dependencies. Critical Path Analysis requires a DAG.");
      }

      // 4. Forward Pass (Calculate ES and EF)
      var es = new Map();
      var ef = new Map();

      // Initialize ES for start nodes (0 relative to start)
      tasks.forEach(function (task) {
        es.set(task.id, 0);
        ef.set(task.id, durations.get(task.id));
      });
      for (var _i = 0, _sortedOrder = sortedOrder; _i < _sortedOrder.length; _i++) {
        var _u = _sortedOrder[_i];
        var predecessors = revAdj.get(_u) || [];
        var maxPrevEf = 0;
        var _iterator2 = _createForOfIteratorHelper(predecessors),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var p = _step2.value;
            if (ef.get(p) > maxPrevEf) {
              maxPrevEf = ef.get(p);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        es.set(_u, maxPrevEf);
        ef.set(_u, maxPrevEf + durations.get(_u));
      }
      var projectDuration = Math.max.apply(Math, _toConsumableArray(Array.from(ef.values())));

      // 5. Backward Pass (Calculate LS and LF)
      var ls = new Map();
      var lf = new Map();

      // Initialize LF for end nodes (projectDuration)
      tasks.forEach(function (task) {
        lf.set(task.id, projectDuration);
        ls.set(task.id, projectDuration - durations.get(task.id));
      });

      // Process in reverse topological order
      for (var i = sortedOrder.length - 1; i >= 0; i--) {
        var _u2 = sortedOrder[i];
        var successors = adj.get(_u2) || [];
        if (successors.length > 0) {
          var minNextLs = projectDuration;
          var _iterator3 = _createForOfIteratorHelper(successors),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var _v = _step3.value;
              if (ls.get(_v) < minNextLs) {
                minNextLs = ls.get(_v);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          lf.set(_u2, minNextLs);
          ls.set(_u2, minNextLs - durations.get(_u2));
        } else {
          // If it's a sink node (no successors), its LF is the project duration
          lf.set(_u2, projectDuration);
          ls.set(_u2, projectDuration - durations.get(_u2));
        }
      }

      // 6. Calculate Slack and Identify Critical Path
      var slackTimes = new Map();
      var criticalPath = [];
      var taskDetails = new Map();
      var earliestStart = new Map();
      var latestStart = new Map();
      var startMs = startDate.getTime();

      // Helper to add minutes to date
      var addMinutes = function addMinutes(dateMs, minutes) {
        return new Date(dateMs + minutes * 60000);
      };
      tasks.forEach(function (task) {
        var id = task.id;
        var slack = ls.get(id) - es.get(id);
        // Use a small epsilon for float comparison if needed, but here we use simple numbers
        var isCritical = Math.abs(slack) < 1e-6;
        slackTimes.set(id, slack);
        if (isCritical) {
          criticalPath.push(id);
        }
        var esDate = addMinutes(startMs, es.get(id));
        var efDate = addMinutes(startMs, ef.get(id));
        var lsDate = addMinutes(startMs, ls.get(id));
        var lfDate = addMinutes(startMs, lf.get(id));
        earliestStart.set(id, esDate);
        latestStart.set(id, lsDate);
        taskDetails.set(id, {
          es: esDate,
          ef: efDate,
          ls: lsDate,
          lf: lfDate,
          slack: slack,
          isCritical: isCritical
        });
      });

      // Sort critical path by topological order (or start time)
      criticalPath.sort(function (a, b) {
        return es.get(a) - es.get(b);
      });
      var endTime = performance.now();
      return {
        criticalPath: criticalPath,
        slackTimes: slackTimes,
        earliestStart: earliestStart,
        latestStart: latestStart,
        projectDuration: projectDuration,
        taskDetails: taskDetails,
        metrics: {
          executionTime: endTime - startTime,
          memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
          solutionQuality: 1.0
        }
      };
    }
  }]);
}();