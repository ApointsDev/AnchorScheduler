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
export var GraphUtils = /*#__PURE__*/function () {
  function GraphUtils() {
    _classCallCheck(this, GraphUtils);
  }
  return _createClass(GraphUtils, null, [{
    key: "buildGraphFromTasks",
    value: function buildGraphFromTasks(tasks) {
      var nodes = new Map();
      tasks.forEach(function (t) {
        return nodes.set(t.id, t);
      });
      var edges = [];
      var adjacencyList = new Map();
      tasks.forEach(function (t) {
        return adjacencyList.set(t.id, []);
      });

      // For personal schedule, assuming all tasks conflict with each other (clique)
      // unless we have specific logic. 
      // But usually we build conflict graph based on time overlap potential?
      // If we are just scheduling, we might not know overlaps yet.
      // But if this is for "Graph Coloring" to assign slots, the conflict is "Cannot be same slot".
      // If capacity=1, then ALL tasks conflict.

      for (var i = 0; i < tasks.length; i++) {
        for (var j = i + 1; j < tasks.length; j++) {
          var _adjacencyList$get, _adjacencyList$get2;
          var t1 = tasks[i];
          var t2 = tasks[j];

          // Add edge
          edges.push({
            from: t1.id,
            to: t2.id
          });
          edges.push({
            from: t2.id,
            to: t1.id
          }); // Undirected usually represented as double directed or handled in logic

          (_adjacencyList$get = adjacencyList.get(t1.id)) === null || _adjacencyList$get === void 0 || _adjacencyList$get.push(t2.id);
          (_adjacencyList$get2 = adjacencyList.get(t2.id)) === null || _adjacencyList$get2 === void 0 || _adjacencyList$get2.push(t1.id);
        }
      }
      return {
        nodes: nodes,
        edges: edges,
        adjacencyList: adjacencyList
      };
    }
  }, {
    key: "findConflicts",
    value: function findConflicts(tasks) {
      // This might be used if tasks already have assigned times?
      // Or based on some other constraint.
      // For now, returning clique edges as above.
      var edges = [];
      for (var i = 0; i < tasks.length; i++) {
        for (var j = i + 1; j < tasks.length; j++) {
          edges.push({
            from: tasks[i].id,
            to: tasks[j].id
          });
        }
      }
      return edges;
    }
  }, {
    key: "graphToAdjacencyMatrix",
    value: function graphToAdjacencyMatrix(graph) {
      var nodeIds = Array.from(graph.nodes.keys());
      var size = nodeIds.length;
      var matrix = Array(size).fill(0).map(function () {
        return Array(size).fill(0);
      });
      var idMap = new Map(nodeIds.map(function (id, index) {
        return [id, index];
      }));
      graph.edges.forEach(function (edge) {
        var i = idMap.get(edge.from);
        var j = idMap.get(edge.to);
        if (i !== undefined && j !== undefined) {
          matrix[i][j] = edge.weight || 1;
        }
      });
      return matrix;
    }
  }, {
    key: "connectedComponents",
    value: function connectedComponents(graph) {
      var visited = new Set();
      var components = [];
      var _iterator = _createForOfIteratorHelper(graph.nodes.keys()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var nodeId = _step.value;
          if (!visited.has(nodeId)) {
            var component = [];
            var stack = [nodeId];
            visited.add(nodeId);
            while (stack.length > 0) {
              var current = stack.pop();
              component.push(current);
              var neighbors = graph.adjacencyList.get(current) || [];
              var _iterator2 = _createForOfIteratorHelper(neighbors),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var neighbor = _step2.value;
                  if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    stack.push(neighbor);
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
            components.push(component);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return components;
    }
  }, {
    key: "findAllPaths",
    value: function findAllPaths(graph, start, end) {
      var paths = [];
      var visited = new Set();
      function dfs(current, path) {
        visited.add(current);
        path.push(current);
        if (current === end) {
          paths.push(_toConsumableArray(path));
        } else {
          var neighbors = graph.adjacencyList.get(current) || [];
          var _iterator3 = _createForOfIteratorHelper(neighbors),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var neighbor = _step3.value;
              if (!visited.has(neighbor)) {
                dfs(neighbor, path);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
        path.pop();
        visited["delete"](current);
      }
      dfs(start, []);
      return paths;
    }
  }]);
}();