function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
export var HungarianAlgorithm = /*#__PURE__*/function () {
  function HungarianAlgorithm() {
    _classCallCheck(this, HungarianAlgorithm);
  }
  return _createClass(HungarianAlgorithm, [{
    key: "execute",
    value: function execute(input) {
      var startTime = performance.now();
      this.validateInput(input);
      var leftNodes = input.leftNodes,
        rightNodes = input.rightNodes,
        costMatrix = input.costMatrix;
      var n = leftNodes.length;
      var m = rightNodes.length;

      // Handle required matches by forcing cost to -Infinity (or very low) and others in same row/col to Infinity?
      // Or just pre-assign and remove from matrix.
      // For simplicity, let's modify cost matrix for required matches to be very low (M), 
      // but we must ensure they are picked.
      // A better way is to treat them as "already matched" but Hungarian is global.
      // Let's use a large negative number for required matches to ensure they are picked if possible.
      // However, if we want to strictly enforce, we should verify after.

      // We need a square matrix for the standard algorithm.
      // Size = max(n, m).
      var size = Math.max(n, m);
      var bigM = 1e15; // Infinity representation for internal logic

      // Build square weight matrix (Max Weight matching).
      // Since input is Cost (Min Cost), we convert: Weight = MaxVal - Cost.
      // But we also have "Infinity" costs in input which mean "Forbidden".
      // If Cost = Infinity, Weight = -Infinity.

      // Find max finite cost to determine inversion base
      var maxFiniteCost = 0;
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
          if (costMatrix[i][j] !== Infinity && costMatrix[i][j] > maxFiniteCost) {
            maxFiniteCost = costMatrix[i][j];
          }
        }
      }

      // Weight matrix
      var weights = Array(size).fill(0).map(function () {
        return Array(size).fill(0);
      });
      var _loop = function _loop(_i) {
        var _loop2 = function _loop2(_j7) {
          if (_i < n && _j7 < m) {
            var _input$constraints;
            var _c = costMatrix[_i][_j7];
            if (_c === Infinity) {
              weights[_i][_j7] = -bigM; // Forbidden
            } else {
              // Invert cost to weight. 
              // We want Min Cost. 
              // Max(Weight) <=> Min(Cost).
              // Weight = (maxFiniteCost + 1) - Cost.
              // So smaller cost => larger weight.
              weights[_i][_j7] = maxFiniteCost + 1 - _c;
            }

            // Handle required matches
            if ((_input$constraints = input.constraints) !== null && _input$constraints !== void 0 && _input$constraints.requiredMatches) {
              var isRequired = input.constraints.requiredMatches.some(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                  l = _ref2[0],
                  r = _ref2[1];
                return l === leftNodes[_i] && r === rightNodes[_j7];
              });
              if (isRequired) {
                weights[_i][_j7] += bigM * 10; // Super high weight
              }
            }
          } else {
            // Dummy nodes (padding)
            // Edges to/from dummy nodes have 0 weight (cost = maxFiniteCost + 1 effectively if we consider them valid options to "drop" tasks)
            // Actually, 0 weight in Max Weight matching means "neutral".
            // If we want to allow tasks to be unmatched (if cost is too high), we need to be careful.
            // But Hungarian always finds a perfect matching in the square matrix.
            // If we match a real task to a dummy slot, it means the task is unassigned.
            // The weight of 0 is fine.
            weights[_i][_j7] = 0;
          }
        };
        for (var _j7 = 0; _j7 < size; _j7++) {
          _loop2(_j7);
        }
      };
      for (var _i = 0; _i < size; _i++) {
        _loop(_i);
      }

      // --- KM Algorithm Implementation (O(N^3)) ---
      var lx = Array(size).fill(0); // Label X
      var ly = Array(size).fill(0); // Label Y
      var matchY = Array(size).fill(-1); // matchY[y] = x (y matched to x)
      var way = Array(size).fill(0);
      var slack = Array(size).fill(0);

      // Initialize lx with max weights in each row
      for (var _i2 = 0; _i2 < size; _i2++) {
        var maxW = -Infinity;
        for (var _j = 0; _j < size; _j++) {
          if (weights[_i2][_j] > maxW) maxW = weights[_i2][_j];
        }
        lx[_i2] = maxW;
      }

      // For each row i
      for (var _i3 = 0; _i3 < size; _i3++) {
        var minV = Array(size).fill(Infinity);
        var usedY = Array(size).fill(false);

        // matchY[0] is dummy? No, let's use 0-based indexing carefully.
        // Standard implementation often uses 1-based indexing or a '0' dummy column.
        // Let's use a slightly different approach:
        // We try to find an augmenting path for row i.

        // Using the array-based implementation which is O(N^3)
        // Based on a common competitive programming template

        var p = 0;
        matchY[0] = _i3;
        // We need matchY to be size+1 and way to be size+1 if we use the 1-based trick with matchY[0] as current row
        // Let's adjust arrays to size+1
        var match = Array(size + 1).fill(0); // match[j] = i (column j matched to row i). j=0 is dummy.
        var u = Array(size + 1).fill(0); // potentials for rows
        var v = Array(size + 1).fill(0); // potentials for cols
        var pArr = Array(size + 1).fill(0); // pArr[j] points to predecessor column in path
        var wayArr = Array(size + 1).fill(0); // wayArr[j] stores the row that selected column j

        // Re-initialize weights for 1-based indexing
        var w = Array(size + 1).fill(0).map(function () {
          return Array(size + 1).fill(0);
        });
        for (var r = 0; r < size; r++) {
          for (var c = 0; c < size; c++) {
            w[r + 1][c + 1] = weights[r][c];
          }
        }

        // Reset match
        match.fill(0);
        u.fill(0);
        v.fill(0);

        // The loop over rows
        for (var _i4 = 1; _i4 <= size; _i4++) {
          match[0] = _i4;
          var j0 = 0;
          var minv = Array(size + 1).fill(Infinity);
          var used = Array(size + 1).fill(false);
          do {
            used[j0] = true;
            var i0 = match[j0];
            var delta = Infinity;
            var j1 = 0;
            for (var _j2 = 1; _j2 <= size; _j2++) {
              if (!used[_j2]) {
                var cur = u[i0] + v[_j2] - w[i0][_j2];
                if (cur < minv[_j2]) {
                  minv[_j2] = cur;
                  wayArr[_j2] = j0;
                }
                if (minv[_j2] < delta) {
                  delta = minv[_j2];
                  j1 = _j2;
                }
              }
            }
            for (var _j3 = 0; _j3 <= size; _j3++) {
              if (used[_j3]) {
                u[match[_j3]] -= delta;
                v[_j3] += delta;
              } else {
                minv[_j3] -= delta;
              }
            }
            j0 = j1;
          } while (match[j0] !== 0);
          do {
            var _j4 = wayArr[j0];
            match[j0] = match[_j4];
            j0 = _j4;
          } while (j0 !== 0);
        }

        // Extract result
        // match[j] = i means Column j is matched with Row i
        // We need Row -> Column
        var rowToCol = new Map();
        for (var _j5 = 1; _j5 <= size; _j5++) {
          if (match[_j5] !== 0) {
            rowToCol.set(match[_j5] - 1, _j5 - 1);
          }
        }

        // Construct result
        var matches = new Map();
        var assignmentMatrix = Array(n).fill(0).map(function () {
          return Array(m).fill(0);
        });
        var totalCost = 0;
        for (var _i5 = 0; _i5 < n; _i5++) {
          if (rowToCol.has(_i5)) {
            var _j6 = rowToCol.get(_i5);
            if (_j6 < m) {
              // Real match
              var cost = costMatrix[_i5][_j6];
              if (cost !== Infinity) {
                matches.set(leftNodes[_i5], rightNodes[_j6]);
                assignmentMatrix[_i5][_j6] = 1;
                totalCost += cost;
              }
            }
          }
        }
        var endTime = performance.now();
        var metrics = {
          executionTime: endTime - startTime,
          memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
          solutionQuality: 1 // Optimal
        };
        return {
          matches: matches,
          totalCost: totalCost,
          assignmentMatrix: assignmentMatrix,
          metrics: metrics
        };
      }

      // Fallback return (should be unreachable inside loop logic but TS needs it)
      return {
        matches: new Map(),
        totalCost: 0,
        assignmentMatrix: [],
        metrics: {
          executionTime: 0,
          memoryUsage: 0,
          solutionQuality: 0
        }
      };
    }
  }, {
    key: "validateInput",
    value: function validateInput(input) {
      if (!input.leftNodes || !input.rightNodes || !input.costMatrix) {
        throw new AlgorithmError('Invalid input', 'HungarianAlgorithm', input, 'fatal');
      }
      if (input.costMatrix.length !== input.leftNodes.length) {
        throw new AlgorithmError('Cost matrix rows must match left nodes', 'HungarianAlgorithm', input, 'error');
      }
      if (input.costMatrix.length > 0 && input.costMatrix[0].length !== input.rightNodes.length) {
        throw new AlgorithmError('Cost matrix columns must match right nodes', 'HungarianAlgorithm', input, 'error');
      }
    }
  }]);
}();