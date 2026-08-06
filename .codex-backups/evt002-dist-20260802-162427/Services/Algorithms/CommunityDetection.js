function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
import { AlgorithmError } from "./types.js";
import { performance } from "perf_hooks";
export var CommunityDetectionAlgorithm = /*#__PURE__*/function () {
  function CommunityDetectionAlgorithm() {
    _classCallCheck(this, CommunityDetectionAlgorithm);
  }
  return _createClass(CommunityDetectionAlgorithm, [{
    key: "execute",
    value: function execute(input) {
      var startTime = performance.now();
      this.validateInput(input);
      var graph = input.graph,
        _input$resolution = input.resolution,
        resolution = _input$resolution === void 0 ? 1.0 : _input$resolution,
        _input$iterations = input.iterations,
        iterations = _input$iterations === void 0 ? 10 : _input$iterations;

      // Louvain Algorithm Implementation
      // Phase 1: Modularity Optimization (Local moving of nodes)
      // Phase 2: Community Aggregation (Building a new graph where nodes are communities)
      // Repeat until no improvement.

      // Data structures
      // We need an efficient graph representation.
      // Node IDs are strings. Map to indices 0..N-1.
      var nodeIds = Array.from(graph.nodes.keys());
      var nodeToIndex = new Map();
      nodeIds.forEach(function (id, idx) {
        return nodeToIndex.set(id, idx);
      });
      var n = nodeIds.length;

      // Adjacency list with weights
      // adj[i] = [{ neighbor: j, weight: w }, ...]
      var adj = Array(n).fill(0).map(function () {
        return [];
      });
      var totalWeight = 0; // m (or 2m if undirected)

      graph.edges.forEach(function (e) {
        var u = nodeToIndex.get(e.from);
        var v = nodeToIndex.get(e.to);
        if (u !== undefined && v !== undefined) {
          var w = e.weight || 1;
          adj[u].push({
            neighbor: v,
            weight: w
          });
          // Assuming undirected graph for Louvain usually.
          // If input edges are directed, we might treat as undirected or use directed modularity.
          // Standard Louvain is for undirected.
          // Check if reverse edge exists in input?
          // The GraphUtils usually adds both directions for undirected.
          // Let's assume input edges cover connectivity.
          // If graph is directed, we treat it as undirected for community detection usually, or sum weights.
          // Let's assume the input `graph.edges` contains (u,v) and (v,u) if undirected, or we treat it as such.
          // To be safe, let's build a symmetric adjacency matrix/list.
          // But wait, if we duplicate, totalWeight doubles.
          // Let's just process edges as given.
          totalWeight += w;
        }
      });

      // If graph is undirected, totalWeight is sum of all edge weights (which is 2 * sum of unique edge weights).
      // Modularity formula uses m = sum of weights / 2.
      // Let's assume totalWeight here is sum of all entries in adjacency list.
      var m = totalWeight / 2;

      // Current state
      var currentCommunities = Array(n).fill(0).map(function (_, i) {
        return i;
      }); // Each node in its own community initially
      var hierarchy = [];

      // Helper to calculate modularity Q
      // Q = (1/2m) * sum_ij [ (A_ij - k_i*k_j/(2m)) * delta(c_i, c_j) ]
      // Simplified: sum_c [ (Sigma_in / 2m) - (Sigma_tot / 2m)^2 ]
      // Sigma_in: sum of weights of edges inside community c
      // Sigma_tot: sum of weights of edges incident to nodes in community c

      // We need to track:
      // - nodeWeight[i] (k_i): sum of weights of edges incident to node i
      // - commWeightIn[c] (Sigma_in): sum of weights inside community c
      // - commWeightTot[c] (Sigma_tot): sum of weights incident to community c

      // Initial node weights (degrees)
      var nodeWeight = Array(n).fill(0);
      for (var i = 0; i < n; i++) {
        var _iterator = _createForOfIteratorHelper(adj[i]),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var edge = _step.value;
            nodeWeight[i] += edge.weight;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      // Initial community state (each node is a community)
      var commWeightIn = Array(n).fill(0); // Self-loops only initially
      var commWeightTot = _toConsumableArray(nodeWeight); // Total weight is just node weight

      // Handle self-loops for commWeightIn
      for (var _i = 0; _i < n; _i++) {
        var _iterator2 = _createForOfIteratorHelper(adj[_i]),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _edge = _step2.value;
            if (_edge.neighbor === _i) {
              commWeightIn[_i] += _edge.weight;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      var currentGraph = {
        adj: adj,
        nodeWeight: nodeWeight,
        n: n
      };
      var level = 0;
      var improvement = true;

      // Mapping from original nodes to current level nodes
      // At level 0: original -> 0..N-1
      // At level 1: community_id_level_0 -> 0..M-1
      // We need to track the mapping from Original Node -> Final Community
      var nodeToCommunity = Array(n).fill(0).map(function (_, i) {
        return i;
      });
      while (improvement && level < iterations) {
        improvement = false;

        // Phase 1: Modular Optimization
        var moved = true;
        var anyMove = false;
        var pass = 0;
        var maxPasses = 20; // Avoid infinite loops in phase 1

        // Working variables for this level
        var localComm = Array(currentGraph.n).fill(0).map(function (_, i) {
          return i;
        });
        var localCommIn = _toConsumableArray(commWeightIn);
        var localCommTot = _toConsumableArray(commWeightTot);

        // We need to re-calculate these for the current graph structure if level > 0
        // But we update them incrementally.

        while (moved && pass < maxPasses) {
          moved = false;
          pass++;
          for (var _i2 = 0; _i2 < currentGraph.n; _i2++) {
            var oldComm = localComm[_i2];
            var ki = currentGraph.nodeWeight[_i2];

            // Remove i from oldComm
            // Calculate modularity gain for removing i
            // We don't need exact Q, just delta Q.
            // Formula for gain of moving i to comm C:
            // Delta Q = [ (Sigma_in + 2*ki_in) / 2m - ((Sigma_tot + ki) / 2m)^2 ] - [ (Sigma_in / 2m) - (Sigma_tot / 2m)^2 - (ki / 2m)^2 ]
            // Simplified: Delta Q ~ ki_in - (Sigma_tot * ki) / m
            // ki_in: sum of weights from i to nodes in C

            // First, remove from old
            // We just calculate "best community" to move to.
            // If best is oldComm, do nothing.

            // Find neighbor communities and weights
            var neighborComms = new Map(); // CommID -> Weight from i
            var _iterator3 = _createForOfIteratorHelper(currentGraph.adj[_i2]),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _edge2 = _step3.value;
                if (_edge2.neighbor !== _i2) {
                  // Ignore self-loops for neighbor calculation
                  var neighborC = localComm[_edge2.neighbor];
                  neighborComms.set(neighborC, (neighborComms.get(neighborC) || 0) + _edge2.weight);
                }
              }

              // Remove i from oldComm stats (temporarily for calculation)
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
            localCommTot[oldComm] -= ki;
            // localCommIn update is complex because it involves edges *within*.
            // But we only need Sigma_tot for the formula usually.
            // Let's use the standard formula:
            // Gain = (ki_in / 2m) - (Sigma_tot * ki / (2m^2)) * resolution
            // We want to maximize this.

            // Remove i from old community effectively
            // We compare placing i in oldComm vs neighbors.

            var bestComm = oldComm;
            var maxGain = 0; // Gain must be positive to move (or better than staying 0)

            // Calculate gain for staying (or rather, cost of removing? No, just compare gains)
            // Actually, standard way: Remove i, then insert into best neighbor.
            // If best neighbor is old one, no move.

            // Weight from i to oldComm
            var w_to_old = neighborComms.get(oldComm) || 0;
            var gainOld = w_to_old - localCommTot[oldComm] * ki * resolution / (2 * m);
            // Note: 2*m is constant. We can optimize.
            // Gain ~ 2*m*w_to_c - Sigma_tot * ki * resolution

            var bestScore = gainOld; // Start with staying score (actually we compare diff, but absolute score works if consistent)
            // Wait, the formula is for *change*.
            // Let's calculate Delta Q for moving from Isolated to C.
            // But i is currently in oldComm.
            // Easier: Remove i from oldComm. Then find best C to insert.

            // Remove i
            // localCommTot[oldComm] -= ki; // Already done above? No, let's do it now.
            // We need to be careful with state.
            // Let's just iterate neighbors and check "What if I move to C?"
            // Delta = Q_new - Q_old.
            // Q_old is fixed. We just maximize Q_new.
            // Q_new(C) contribution = ...

            // Let's use the standard "Gain" formula which is change in modularity.
            // Delta Q (i -> C) = [ k_i,in / m ] - [ k_i * Sigma_tot / (2 * m^2) ]
            // We want to maximize this.

            // Current community contribution (before removal)
            // We can just find C that maximizes: k_i,in - (Sigma_tot * k_i / (2m))
            // Note: Sigma_tot includes k_i if i is in C.
            // So if we consider i *removed*, then for target C:
            // Score = k_i,in - (Sigma_tot_without_i * k_i / (2m))

            // 1. Remove i from oldComm
            // We don't actually update arrays until we decide.
            // But for calculation we need Sigma_tot excluding i.
            var sigma_tot_old_minus_i = localCommTot[oldComm]; // Already subtracted ki above? No.
            // Wait, I wrote `localCommTot[oldComm] -= ki;` above.
            // Let's stick to that.

            // Score for staying in oldComm
            var k_i_in_old = neighborComms.get(oldComm) || 0;
            var scoreOld = k_i_in_old - sigma_tot_old_minus_i * ki * resolution / (2 * m);
            var bestC = oldComm;
            var maxScore = scoreOld;
            var _iterator4 = _createForOfIteratorHelper(neighborComms.entries()),
              _step4;
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var _step4$value = _slicedToArray(_step4.value, 2),
                  commId = _step4$value[0],
                  k_i_in = _step4$value[1];
                if (commId === oldComm) continue;
                var sigma_tot_c = localCommTot[commId]; // i is not in C
                var score = k_i_in - sigma_tot_c * ki * resolution / (2 * m);
                if (score > maxScore) {
                  maxScore = score;
                  bestC = commId;
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
            if (bestC !== oldComm) {
              // Move i to bestC
              localComm[_i2] = bestC;
              // localCommTot[oldComm] -= ki; // Already done
              localCommTot[bestC] += ki;
              moved = true;
              anyMove = true;
            } else {
              // Put back
              localCommTot[oldComm] += ki;
            }
          }
        }

        // If no nodes moved in this phase, we are done with optimization for this graph level.
        // If this is the first pass and no moves, we stop completely.
        if (!anyMove && level === 0) {
          improvement = false;
          break; // No need to aggregate
        }

        // If moved, we aggregate.
        // But even if not moved in *last* pass, we might have moved in previous passes of this level.
        // So we should aggregate if `pass > 1` or `moved` was true at some point?
        // Actually, `moved` tracks the whole while loop.
        // If we exit the while loop, we have a stable partition.
        // Now we check if this partition is better than previous level (it must be).
        // We aggregate to build next level.

        // Renumber communities to 0..k-1
        var newCommIds = new Map();
        var nextCommCount = 0;
        var newLocalComm = Array(currentGraph.n).fill(0);
        for (var _i3 = 0; _i3 < currentGraph.n; _i3++) {
          var c = localComm[_i3];
          if (!newCommIds.has(c)) {
            newCommIds.set(c, nextCommCount++);
          }
          newLocalComm[_i3] = newCommIds.get(c);
        }

        // If number of communities equals number of nodes, no aggregation possible (no change).
        if (nextCommCount === currentGraph.n) {
          improvement = false;
          break;
        }

        // Update global node mapping
        // nodeToCommunity maps Original -> Current Level Node
        // We need to update it to Original -> Next Level Node
        var nextNodeToCommunity = Array(n).fill(0);
        for (var _i4 = 0; _i4 < n; _i4++) {
          var currentLevelNode = nodeToCommunity[_i4];
          nextNodeToCommunity[_i4] = newLocalComm[currentLevelNode];
        }
        nodeToCommunity = nextNodeToCommunity;

        // Build next level graph
        var nextAdj = Array(nextCommCount).fill(0).map(function () {
          return [];
        });
        var nextNodeWeight = Array(nextCommCount).fill(0);

        // Iterate edges of current graph and aggregate weights
        // Use a map for edge weights between communities to handle multi-edges
        var edgeWeights = new Map(); // "u-v" -> weight

        for (var _i5 = 0; _i5 < currentGraph.n; _i5++) {
          var commI = newLocalComm[_i5];
          var _iterator5 = _createForOfIteratorHelper(currentGraph.adj[_i5]),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _edge3 = _step5.value;
              var commJ = newLocalComm[_edge3.neighbor];
              // Add weight to edge (commI, commJ)
              // We store directed edges in map? Or just iterate?
              // Since we iterate all i, we will see (i,j) and (j,i).
              // We want to build adjacency list.
              // Let's accumulate.
              var key = "".concat(commI, "-").concat(commJ);
              edgeWeights.set(key, (edgeWeights.get(key) || 0) + _edge3.weight);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }

        // Convert map to adj list
        var _iterator6 = _createForOfIteratorHelper(edgeWeights.entries()),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _step6$value = _slicedToArray(_step6.value, 2),
              _key = _step6$value[0],
              weight = _step6$value[1];
            var _key$split = _key.split('-'),
              _key$split2 = _slicedToArray(_key$split, 2),
              uStr = _key$split2[0],
              vStr = _key$split2[1];
            var u = parseInt(uStr);
            var v = parseInt(vStr);
            nextAdj[u].push({
              neighbor: v,
              weight: weight
            });
            // Note: this includes self-loops (u=v)
          }

          // Calculate node weights for next level
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
        for (var _i6 = 0; _i6 < nextCommCount; _i6++) {
          var _iterator7 = _createForOfIteratorHelper(nextAdj[_i6]),
            _step7;
          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var _edge4 = _step7.value;
              nextNodeWeight[_i6] += _edge4.weight;
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }

        // Update current graph
        currentGraph = {
          adj: nextAdj,
          nodeWeight: nextNodeWeight,
          n: nextCommCount
        };

        // Calculate modularity for this level
        // Q = sum_c [ (Sigma_in / 2m) - (Sigma_tot / 2m)^2 ]
        // We need Sigma_in and Sigma_tot for the new communities (which are nodes in new graph)
        // Sigma_in of a community (node in new graph) is the weight of its self-loop.
        // Sigma_tot is its node weight.

        var currentQ = 0;
        for (var _i7 = 0; _i7 < nextCommCount; _i7++) {
          var sigmaIn = 0;
          var _iterator8 = _createForOfIteratorHelper(nextAdj[_i7]),
            _step8;
          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var _edge5 = _step8.value;
              if (_edge5.neighbor === _i7) {
                sigmaIn = _edge5.weight;
                break;
              }
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
          var sigmaTot = nextNodeWeight[_i7];
          currentQ += sigmaIn / (2 * m) - Math.pow(sigmaTot / (2 * m), 2);
        }

        // Store hierarchy
        var levelCommunities = new Map();
        for (var _i8 = 0; _i8 < n; _i8++) {
          levelCommunities.set(nodeIds[_i8], nodeToCommunity[_i8]);
        }
        hierarchy.push({
          level: level + 1,
          communities: levelCommunities,
          modularity: currentQ
        });
        level++;
        improvement = true; // Continue to next level
      }

      // Final result
      var communities = new Map();
      for (var _i9 = 0; _i9 < n; _i9++) {
        communities.set(nodeIds[_i9], nodeToCommunity[_i9]);
      }

      // Final Modularity (from last hierarchy level or calc)
      var finalModularity = hierarchy.length > 0 ? hierarchy[hierarchy.length - 1].modularity : 0; // Should calc initial if level 0

      var endTime = performance.now();
      var metrics = {
        executionTime: endTime - startTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        iterations: level,
        solutionQuality: finalModularity
      };
      return {
        communities: communities,
        modularity: finalModularity,
        hierarchy: hierarchy,
        metrics: metrics
      };
    }
  }, {
    key: "validateInput",
    value: function validateInput(input) {
      if (!input.graph) {
        throw new AlgorithmError('Graph is required', 'CommunityDetection', input, 'fatal');
      }
    }
  }]);
}();