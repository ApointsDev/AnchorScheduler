function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { AlgorithmError } from "./types.js";
import { TimeUtils } from "./utils/TimeUtils.js";
import { performance } from "perf_hooks";
export var GraphColoringAlgorithm = /*#__PURE__*/function () {
  function GraphColoringAlgorithm() {
    _classCallCheck(this, GraphColoringAlgorithm);
  }
  return _createClass(GraphColoringAlgorithm, [{
    key: "execute",
    value: function () {
      var _execute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(input) {
        var startTime, occupiedSlots, slotDuration, taskNodes, adj, i, j, colors, saturation, degrees, uncolored, conflicts, _loop, finalAssignments, taskStartSlots, endTime, metrics;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              startTime = performance.now(); // 1. Validate Input
              this.validateInput(input);

              // 2. Pre-process: Identify available slots and occupied slots
              occupiedSlots = new Set();
              input.fixedEvents.forEach(function (event) {
                // Find slots that overlap with fixed event
                input.timeSlots.forEach(function (slot) {
                  if (TimeUtils.hasTimeOverlap(slot, {
                    id: 'temp',
                    start: event.startTime,
                    end: event.endTime
                  })) {
                    occupiedSlots.add(slot.id);
                  }
                });
              });

              // 3. Task Splitting (Simple version: 1 task = 1 node, assuming duration matches slot or we just assign start time)
              // Ideally we split tasks into units. For this implementation, let's assume tasks are atomic units 
              // that fit into one slot, OR we are assigning the *start* slot and checking duration.
              // But DSatur assigns ONE color. If task needs multiple slots, it's complex.
              // Let's assume we split tasks into chunks of slot-duration.
              slotDuration = TimeUtils.timeDifference(input.timeSlots[0].start, input.timeSlots[0].end);
              taskNodes = [];
              input.tasks.forEach(function (task) {
                var chunks = Math.ceil(task.estimatedDuration / slotDuration);
                for (var i = 0; i < chunks; i++) {
                  taskNodes.push({
                    id: "".concat(task.id, "_").concat(i),
                    task: task,
                    originalId: task.id
                  });
                }
              });

              // 4. Build Graph (Clique for personal schedule)
              // All task nodes conflict with each other
              adj = new Map();
              taskNodes.forEach(function (n) {
                return adj.set(n.id, new Set());
              });
              for (i = 0; i < taskNodes.length; i++) {
                for (j = i + 1; j < taskNodes.length; j++) {
                  adj.get(taskNodes[i].id).add(taskNodes[j].id);
                  adj.get(taskNodes[j].id).add(taskNodes[i].id);
                }
              }

              // 5. DSatur Initialization
              colors = new Map(); // NodeID -> SlotID
              saturation = new Map(); // NodeID -> Set of neighbor colors
              degrees = new Map(); // NodeID -> Uncolored degree
              taskNodes.forEach(function (n) {
                saturation.set(n.id, new Set());
                degrees.set(n.id, adj.get(n.id).size);
              });
              uncolored = new Set(taskNodes.map(function (n) {
                return n.id;
              }));
              conflicts = []; // 6. Main Loop
              _loop = /*#__PURE__*/_regenerator().m(function _loop() {
                var maxSat, maxDeg, selectedNode, _iterator, _step, nodeId, sat, deg, nodeObj, assignedSlot, sortedSlots, _iterator2, _step2, slot, neighborConflict, _neighbors, _iterator4, _step4, _neighbor, neighbors, _iterator3, _step3, neighbor, _t, _t2;
                return _regenerator().w(function (_context) {
                  while (1) switch (_context.p = _context.n) {
                    case 0:
                      // Pick node with max saturation, then max degree
                      maxSat = -1;
                      maxDeg = -1;
                      selectedNode = null;
                      _iterator = _createForOfIteratorHelper(uncolored);
                      try {
                        for (_iterator.s(); !(_step = _iterator.n()).done;) {
                          nodeId = _step.value;
                          sat = saturation.get(nodeId).size;
                          deg = degrees.get(nodeId);
                          if (sat > maxSat || sat === maxSat && deg > maxDeg) {
                            maxSat = sat;
                            maxDeg = deg;
                            selectedNode = nodeId;
                          }
                        }
                      } catch (err) {
                        _iterator.e(err);
                      } finally {
                        _iterator.f();
                      }
                      if (selectedNode) {
                        _context.n = 1;
                        break;
                      }
                      return _context.a(2, 1);
                    case 1:
                      // Should not happen

                      uncolored["delete"](selectedNode);
                      nodeObj = taskNodes.find(function (n) {
                        return n.id === selectedNode;
                      }); // Find first valid color (slot)
                      // Valid means:
                      // 1. Not in occupiedSlots (fixed events)
                      // 2. Not used by neighbors (already colored)
                      // 3. Before deadline
                      // 4. (Optional) Sequential constraint for split tasks? 
                      //    - This is hard in pure DSatur. We might get random slots.
                      //    - For now, we ignore sequential constraint and just find ANY slot.
                      //    - A better approach for sequential is to treat the task as a block and assign start slot.
                      assignedSlot = null; // Sort slots by time
                      sortedSlots = _toConsumableArray(input.timeSlots).sort(function (a, b) {
                        return a.start.getTime() - b.start.getTime();
                      });
                      _iterator2 = _createForOfIteratorHelper(sortedSlots);
                      _context.p = 2;
                      _iterator2.s();
                    case 3:
                      if ((_step2 = _iterator2.n()).done) {
                        _context.n = 16;
                        break;
                      }
                      slot = _step2.value;
                      if (!occupiedSlots.has(slot.id)) {
                        _context.n = 4;
                        break;
                      }
                      return _context.a(3, 15);
                    case 4:
                      // Check 2: Neighbors
                      neighborConflict = false;
                      _neighbors = adj.get(selectedNode);
                      _iterator4 = _createForOfIteratorHelper(_neighbors);
                      _context.p = 5;
                      _iterator4.s();
                    case 6:
                      if ((_step4 = _iterator4.n()).done) {
                        _context.n = 8;
                        break;
                      }
                      _neighbor = _step4.value;
                      if (!(colors.get(_neighbor) === slot.id)) {
                        _context.n = 7;
                        break;
                      }
                      neighborConflict = true;
                      return _context.a(3, 8);
                    case 7:
                      _context.n = 6;
                      break;
                    case 8:
                      _context.n = 10;
                      break;
                    case 9:
                      _context.p = 9;
                      _t = _context.v;
                      _iterator4.e(_t);
                    case 10:
                      _context.p = 10;
                      _iterator4.f();
                      return _context.f(10);
                    case 11:
                      if (!neighborConflict) {
                        _context.n = 12;
                        break;
                      }
                      return _context.a(3, 15);
                    case 12:
                      if (!(slot.end > nodeObj.task.deadline)) {
                        _context.n = 13;
                        break;
                      }
                      return _context.a(3, 15);
                    case 13:
                      if (!(nodeObj.task.earliestStart && slot.start < nodeObj.task.earliestStart)) {
                        _context.n = 14;
                        break;
                      }
                      return _context.a(3, 15);
                    case 14:
                      // Found valid slot
                      assignedSlot = slot.id;
                      return _context.a(3, 16);
                    case 15:
                      _context.n = 3;
                      break;
                    case 16:
                      _context.n = 18;
                      break;
                    case 17:
                      _context.p = 17;
                      _t2 = _context.v;
                      _iterator2.e(_t2);
                    case 18:
                      _context.p = 18;
                      _iterator2.f();
                      return _context.f(18);
                    case 19:
                      if (assignedSlot) {
                        colors.set(selectedNode, assignedSlot);

                        // Update neighbors
                        neighbors = adj.get(selectedNode);
                        _iterator3 = _createForOfIteratorHelper(neighbors);
                        try {
                          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                            neighbor = _step3.value;
                            saturation.get(neighbor).add(assignedSlot);
                            degrees.set(neighbor, degrees.get(neighbor) - 1);
                          }
                        } catch (err) {
                          _iterator3.e(err);
                        } finally {
                          _iterator3.f();
                        }
                      } else {
                        // Cannot assign
                        conflicts.push({
                          taskId1: nodeObj.originalId,
                          taskId2: 'RESOURCE_CONSTRAINT',
                          reason: 'No available time slot before deadline or due to conflicts'
                        });
                      }
                    case 20:
                      return _context.a(2);
                  }
                }, _loop, null, [[5, 9, 10, 11], [2, 17, 18, 19]]);
              });
            case 1:
              if (!(uncolored.size > 0)) {
                _context2.n = 4;
                break;
              }
              return _context2.d(_regeneratorValues(_loop()), 2);
            case 2:
              if (!_context2.v) {
                _context2.n = 3;
                break;
              }
              return _context2.a(3, 4);
            case 3:
              _context2.n = 1;
              break;
            case 4:
              // 7. Aggregate results
              // Map chunk assignments back to tasks?
              // The result interface expects TaskID -> SlotID.
              // If we split tasks, we have multiple slots per task.
              // The interface `assignments: Map<string, string>` implies 1 slot per task?
              // Or maybe the value is a string representing the range?
              // Or maybe we should just return the first slot?
              // Let's return the first slot for the task, or change the interface to support multiple slots.
              // But `goal.md` says `assignments: Map<string, string>; // 任务ID -> 时间槽ID`.
              // This implies the task fits in one slot OR the ID represents the start slot.
              // I will assume it maps to the Start Slot ID.
              finalAssignments = new Map();
              taskStartSlots = new Map();
              taskNodes.forEach(function (node) {
                var slotId = colors.get(node.id);
                if (slotId) {
                  var slot = input.timeSlots.find(function (s) {
                    return s.id === slotId;
                  });
                  var currentStart = taskStartSlots.get(node.originalId);
                  if (!currentStart || slot.start < currentStart.start) {
                    taskStartSlots.set(node.originalId, slot);
                    finalAssignments.set(node.originalId, slotId);
                  }
                }
              });
              endTime = performance.now();
              metrics = {
                executionTime: endTime - startTime,
                memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
                solutionQuality: conflicts.length === 0 ? 1 : 1 - conflicts.length / input.tasks.length
              };
              return _context2.a(2, {
                assignments: finalAssignments,
                conflicts: conflicts,
                utilization: colors.size / input.timeSlots.length,
                metrics: metrics
              });
          }
        }, _callee, this);
      }));
      function execute(_x) {
        return _execute.apply(this, arguments);
      }
      return execute;
    }()
  }, {
    key: "validateInput",
    value: function validateInput(input) {
      if (!input.tasks || !input.timeSlots) {
        throw new AlgorithmError('Invalid input: tasks and timeSlots are required', 'GraphColoring', input, 'fatal');
      }
      input.timeSlots.forEach(function (slot) {
        if (slot.start >= slot.end) {
          throw new AlgorithmError("Invalid time slot ".concat(slot.id), 'GraphColoring', slot, 'error');
        }
      });
    }
  }]);
}();