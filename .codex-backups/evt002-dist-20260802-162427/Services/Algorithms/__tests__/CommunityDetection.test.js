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
import { CommunityDetectionAlgorithm } from "../CommunityDetection.js";
describe('CommunityDetection Algorithm', function () {
  var algorithm;
  beforeEach(function () {
    algorithm = new CommunityDetectionAlgorithm();
  });
  var createGraph = function createGraph(nodes, edges) {
    var nodeMap = new Map();
    nodes.forEach(function (id) {
      return nodeMap.set(id, {
        taskId: id,
        type: 'test',
        duration: 60
      });
    });
    var graphEdges = edges.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
        from = _ref2[0],
        to = _ref2[1],
        weight = _ref2[2];
      return {
        from: from,
        to: to,
        weight: weight || 1
      };
    });
    // Add reverse edges for undirected graph simulation if not provided?
    // The algorithm assumes input edges. Let's provide symmetric edges for tests.
    var symmetricEdges = _toConsumableArray(graphEdges);
    graphEdges.forEach(function (e) {
      symmetricEdges.push({
        from: e.to,
        to: e.from,
        weight: e.weight
      });
    });
    return {
      nodes: nodeMap,
      edges: symmetricEdges,
      adjacencyList: new Map() // Not used by algorithm directly, it builds its own
    };
  };
  test('should detect communities in two disconnected cliques', function () {
    // Clique 1: A-B, B-C, A-C
    // Clique 2: D-E, E-F, D-F
    // No connection between 1 and 2
    var nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    var edges = [['A', 'B'], ['B', 'C'], ['A', 'C'], ['D', 'E'], ['E', 'F'], ['D', 'F']];
    var input = {
      graph: createGraph(nodes, edges)
    };
    var result = algorithm.execute(input);
    expect(result.communities.get('A')).toBe(result.communities.get('B'));
    expect(result.communities.get('A')).toBe(result.communities.get('C'));
    expect(result.communities.get('D')).toBe(result.communities.get('E'));
    expect(result.communities.get('D')).toBe(result.communities.get('F'));
    expect(result.communities.get('A')).not.toBe(result.communities.get('D'));
  });
  test('should detect communities with weak connection', function () {
    // Clique 1: A-B-C
    // Clique 2: D-E-F
    // Weak link: C-D
    var nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    var edges = [['A', 'B'], ['B', 'C'], ['A', 'C'], ['D', 'E'], ['E', 'F'], ['D', 'F'], ['C', 'D'] // Weak link
    ];
    var input = {
      graph: createGraph(nodes, edges)
    };
    var result = algorithm.execute(input);

    // Should still separate into two communities
    expect(result.communities.get('A')).toBe(result.communities.get('B'));
    expect(result.communities.get('D')).toBe(result.communities.get('E'));
    expect(result.communities.get('A')).not.toBe(result.communities.get('D'));
  });
  test('should handle single node', function () {
    var nodes = ['A'];
    var edges = [];
    var input = {
      graph: createGraph(nodes, edges)
    };
    var result = algorithm.execute(input);
    expect(result.communities.size).toBe(1);
  });
});