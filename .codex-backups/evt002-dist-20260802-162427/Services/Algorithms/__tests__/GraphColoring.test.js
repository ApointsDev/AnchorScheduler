function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { GraphColoringAlgorithm } from "../GraphColoring.js";
import { TimeUtils } from "../utils/TimeUtils.js";
describe('GraphColoring Algorithm', function () {
  var algorithm;
  var timeSlots;
  beforeEach(function () {
    algorithm = new GraphColoringAlgorithm();
    timeSlots = TimeUtils.generateTimeSlots('09:00', '12:00', 60); // 3 slots: 9-10, 10-11, 11-12
  });
  test('should assign colors without conflicts for simple case', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var tasks, fixedEvents, input, result;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          tasks = [{
            id: 't1',
            name: 'Task 1',
            estimatedDuration: 60,
            deadline: new Date('2025-12-14T12:00:00')
          }, {
            id: 't2',
            name: 'Task 2',
            estimatedDuration: 60,
            deadline: new Date('2025-12-14T12:00:00')
          }];
          fixedEvents = [];
          input = {
            tasks: tasks,
            fixedEvents: fixedEvents,
            timeSlots: timeSlots
          };
          _context.n = 1;
          return algorithm.execute(input);
        case 1:
          result = _context.v;
          expect(result.conflicts).toHaveLength(0);
          expect(result.assignments.size).toBe(2);
          expect(result.assignments.get('t1')).not.toBe(result.assignments.get('t2'));
        case 2:
          return _context.a(2);
      }
    }, _callee);
  })));
  test('should handle fixed events', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var fixedEvents, tasks, input, result, assignedSlotId;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          // Slot 1 (9-10) is occupied by fixed event
          fixedEvents = [{
            id: 'f1',
            name: 'Class',
            startTime: timeSlots[0].start,
            endTime: timeSlots[0].end
          }];
          tasks = [{
            id: 't1',
            name: 'Task 1',
            estimatedDuration: 60,
            deadline: new Date('2025-12-14T12:00:00')
          }];
          input = {
            tasks: tasks,
            fixedEvents: fixedEvents,
            timeSlots: timeSlots
          };
          _context2.n = 1;
          return algorithm.execute(input);
        case 1:
          result = _context2.v;
          expect(result.conflicts).toHaveLength(0);
          // Should be assigned to slot 2 or 3, not slot 1
          assignedSlotId = result.assignments.get('t1');
          expect(assignedSlotId).not.toBe(timeSlots[0].id);
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  })));
  test('should report conflict if no slots available', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var tasks, input, result;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          tasks = [{
            id: 't1',
            name: 'Task 1',
            estimatedDuration: 60,
            deadline: new Date('2025-12-14T12:00:00')
          }, {
            id: 't2',
            name: 'Task 2',
            estimatedDuration: 60,
            deadline: new Date('2025-12-14T12:00:00')
          }, {
            id: 't3',
            name: 'Task 3',
            estimatedDuration: 60,
            deadline: new Date('2025-12-14T12:00:00')
          }, {
            id: 't4',
            name: 'Task 4',
            estimatedDuration: 60,
            deadline: new Date('2025-12-14T12:00:00')
          }]; // Only 3 slots available
          input = {
            tasks: tasks,
            fixedEvents: [],
            timeSlots: timeSlots
          };
          _context3.n = 1;
          return algorithm.execute(input);
        case 1:
          result = _context3.v;
          expect(result.conflicts.length).toBeGreaterThan(0);
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  })));
  test('should respect deadlines', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var tasks, input, result;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          tasks = [{
            id: 't1',
            name: 'Task 1',
            estimatedDuration: 60,
            deadline: timeSlots[0].end
          } // Must be done by 10:00
          ];
          input = {
            tasks: tasks,
            fixedEvents: [],
            timeSlots: timeSlots
          };
          _context4.n = 1;
          return algorithm.execute(input);
        case 1:
          result = _context4.v;
          expect(result.assignments.get('t1')).toBe(timeSlots[0].id);
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  })));
});