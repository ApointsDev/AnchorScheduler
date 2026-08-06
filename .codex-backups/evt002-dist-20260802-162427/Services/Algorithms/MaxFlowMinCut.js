function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { AlgorithmError } from "./types.js";
import { performance } from "perf_hooks";
export var MaxFlowMinCutAlgorithm = /*#__PURE__*/function () {
  function MaxFlowMinCutAlgorithm() {
    _classCallCheck(this, MaxFlowMinCutAlgorithm);
  }
  return _createClass(MaxFlowMinCutAlgorithm, [{
    key: "execute",
    value: function execute(input) {
      var startTime = performance.now();
      this.validateInput(input);
      var source = input.source,
        sink = input.sink,
        nodes = input.nodes,
        edges = input.edges;

      // Map node IDs to indices for easier handling
      var nodeToIndex = new Map();
      var indexToNode = new Map();
      nodes.forEach(function (id, index) {
        nodeToIndex.set(id, index);
        indexToNode.set(index, id);
      });
      var n = nodes.length;
      var s = nodeToIndex.get(source);
      var t = nodeToIndex.get(sink);

      // Capacity matrix and Flow matrix
      // Using adjacency list for BFS performance, but matrix for capacity lookup is easy if N is small.
      // For Edmonds-Karp, we need residual graph.
      // Residual Capacity(u, v) = Capacity(u, v) - Flow(u, v)
      // Also reverse edges: Residual Capacity(v, u) = Flow(u, v)

      // Let's use an adjacency list where each edge stores capacity and current flow.
      // And we need reverse edges.

      var adj = Array(n).fill(0).map(function () {
        return [];
      });

      // Helper to add edge
      var addEdge = function addEdge(u, v, cap) {
        var forwardEdge = {
          to: v,
          capacity: cap,
          flow: 0,
          reverseEdge: 0
        };
        var backwardEdge = {
          to: u,
          capacity: 0,
          flow: 0,
          reverseEdge: 0
        }; // Capacity 0 for reverse edge initially

        adj[u].push(forwardEdge);
        adj[v].push(backwardEdge);
        forwardEdge.reverseEdge = adj[v].length - 1;
        backwardEdge.reverseEdge = adj[u].length - 1;
      };
      edges.forEach(function (e) {
        var u = nodeToIndex.get(e.from);
        var v = nodeToIndex.get(e.to);
        if (u !== undefined && v !== undefined) {
          // Handle multiple edges between same nodes? Sum capacity.
          // For simplicity, assume unique edges or just add another one.
          // Our implementation supports multiple edges.
          addEdge(u, v, e.capacity);
        }
      });
      var maxFlow = 0;

      // Edmonds-Karp Algorithm
      while (true) {
        var parent = Array(n).fill(-1);
        var edgeFrom = Array(n).fill(-1); // Index of edge in parent's adj list
        var _queue = [];
        _queue.push(s);
        parent[s] = s; // Mark source as visited

        while (_queue.length > 0) {
          var u = _queue.shift();
          if (u === t) break;
          for (var i = 0; i < adj[u].length; i++) {
            var e = adj[u][i];
            if (parent[e.to] === -1 && e.capacity > e.flow) {
              parent[e.to] = u;
              edgeFrom[e.to] = i;
              _queue.push(e.to);
            }
          }
        }
        if (parent[t] === -1) break; // No path found

        // Find bottleneck capacity
        var pathFlow = Infinity;
        var curr = t;
        while (curr !== s) {
          var p = parent[curr];
          var idx = edgeFrom[curr];
          var _e = adj[p][idx];
          pathFlow = Math.min(pathFlow, _e.capacity - _e.flow);
          curr = p;
        }

        // Update residual graph
        curr = t;
        while (curr !== s) {
          var _p = parent[curr];
          var _idx = edgeFrom[curr];
          adj[_p][_idx].flow += pathFlow;
          var reverseIdx = adj[_p][_idx].reverseEdge;
          adj[curr][reverseIdx].flow -= pathFlow;
          curr = _p;
        }
        maxFlow += pathFlow;
      }

      // Calculate Min Cut
      // Run BFS/DFS from source in residual graph to find all reachable nodes (S set)
      var S = new Set();
      var queue = [s];
      var visited = Array(n).fill(false);
      visited[s] = true;
      S.add(source);
      while (queue.length > 0) {
        var _u = queue.shift();
        var _iterator = _createForOfIteratorHelper(adj[_u]),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _e2 = _step.value;
            if (!visited[_e2.to] && _e2.capacity > _e2.flow) {
              visited[_e2.to] = true;
              S.add(indexToNode.get(_e2.to));
              queue.push(_e2.to);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      var T = new Set();
      nodes.forEach(function (node) {
        if (!S.has(node)) {
          T.add(node);
        }
      });

      // Calculate Min Cut Capacity (sum of capacities of edges from S to T)
      var minCutCapacity = 0;
      edges.forEach(function (e) {
        if (S.has(e.from) && T.has(e.to)) {
          minCutCapacity += e.capacity;
        }
      });

      // Prepare Result
      var flowOnEdges = new Map();
      // We need to map back to original edges.
      // Since we might have split edges or added reverse ones, we iterate original input edges
      // and look up flow.
      // But wait, we have multiple edges potentially.
      // Let's iterate our adj list and match with input?
      // Easier: Iterate input edges, find corresponding edge in adj structure.
      // Since we added them in order, we might be able to track.
      // But simpler: Just iterate adj list and output non-zero flows for forward edges.

      // Actually, the requirement says `flowOnEdges: Map<string, number>; // 边ID -> 流量`.
      // But input edges don't have IDs. The key should probably be "from->to".

      edges.forEach(function (e) {
        var u = nodeToIndex.get(e.from);
        var v = nodeToIndex.get(e.to);
        // Find the edge in adj[u] that goes to v.
        // Note: there might be multiple. We need to be careful.
        // But for standard flow networks, usually one edge per direction.
        // If multiple, we sum them?
        // Let's find the specific edge object we created.
        // Since we can't easily link back without storing ref, let's just search.
        // We take the flow from the forward edge.
        var edgeObj = adj[u].find(function (edge) {
          return edge.to === v && edge.capacity === e.capacity;
        });
        // This matching is weak if multiple identical edges.
        // But for this assignment, let's assume unique edges or just report flow.
        if (edgeObj) {
          var key = "".concat(e.from, "->").concat(e.to);
          flowOnEdges.set(key, edgeObj.flow);
        }
      });

      // Residual Graph
      var residualEdges = [];
      for (var _u2 = 0; _u2 < n; _u2++) {
        var _iterator2 = _createForOfIteratorHelper(adj[_u2]),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _e3 = _step2.value;
            var residualCap = _e3.capacity - _e3.flow;
            if (residualCap > 0) {
              residualEdges.push({
                from: indexToNode.get(_u2),
                to: indexToNode.get(_e3.to),
                capacity: residualCap
              });
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      var endTime = performance.now();
      var metrics = {
        executionTime: endTime - startTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        solutionQuality: 1 // Exact algorithm
      };
      return {
        maxFlow: maxFlow,
        flowOnEdges: flowOnEdges,
        minCut: {
          S: S,
          T: T,
          capacity: minCutCapacity
        },
        residualGraph: {
          source: source,
          sink: sink,
          nodes: nodes,
          edges: residualEdges
        },
        metrics: metrics
      };
    }
  }, {
    key: "validateInput",
    value: function validateInput(input) {
      if (!input.nodes || !input.edges || !input.source || !input.sink) {
        throw new AlgorithmError('Invalid input', 'MaxFlowMinCut', input, 'fatal');
      }
      if (!input.nodes.includes(input.source)) {
        throw new AlgorithmError('Source node not in nodes list', 'MaxFlowMinCut', input, 'error');
      }
      if (!input.nodes.includes(input.sink)) {
        throw new AlgorithmError('Sink node not in nodes list', 'MaxFlowMinCut', input, 'error');
      }
    }
  }]);
}();