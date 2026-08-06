function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { AlgorithmService } from "../Services/Algorithms/AlgorithmService.js";
describe('AlgorithmService - scheduleTasks', function () {
  var service;
  beforeEach(function () {
    service = new AlgorithmService();
  });
  test('should schedule flexible tasks around fixed events', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var now, tomorrow, fixedStart, fixedEnd, ddlDue, inputTasks, result, scheduledFlexible, scheduledFixed, flexStart, flexEnd, overlap;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          now = new Date();
          tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Fixed Event: Tomorrow 10:00 - 12:00
          fixedStart = new Date(tomorrow);
          fixedStart.setHours(10, 0, 0, 0);
          fixedEnd = new Date(tomorrow);
          fixedEnd.setHours(12, 0, 0, 0);

          // DDL Task: Due Tomorrow 18:00, Duration 60 mins
          ddlDue = new Date(tomorrow);
          ddlDue.setHours(18, 0, 0, 0);
          inputTasks = [{
            id: 'fixed-1',
            name: 'Fixed Meeting',
            startTime: fixedStart.toISOString(),
            endTime: fixedEnd.toISOString(),
            dueDate: fixedEnd.toISOString(),
            isFixed: true
          }, {
            id: 'flexible-1',
            name: 'Flexible Assignment',
            startTime: now.toISOString(),
            // Allow it to be scheduled from now
            endTime: ddlDue.toISOString(),
            dueDate: ddlDue.toISOString(),
            estimatedDuration: 60,
            isFixed: false
          }];
          _context.n = 1;
          return service.scheduleTasks(inputTasks, {
            startHour: 9,
            endHour: 18,
            slotDuration: 60
          });
        case 1:
          result = _context.v;
          scheduledFlexible = result.scheduledTasks.find(function (t) {
            return t.id === 'flexible-1';
          });
          scheduledFixed = result.scheduledTasks.find(function (t) {
            return t.id === 'fixed-1';
          }); // Fixed task should remain unchanged
          expect(scheduledFixed.startTime).toBe(fixedStart.toISOString());
          expect(scheduledFixed.endTime).toBe(fixedEnd.toISOString());

          // Flexible task should be scheduled
          expect(scheduledFlexible.startTime).not.toBe(ddlDue.toISOString()); // Should be moved
          flexStart = new Date(scheduledFlexible.startTime);
          flexEnd = new Date(scheduledFlexible.endTime); // Should be 60 mins duration
          expect((flexEnd.getTime() - flexStart.getTime()) / 60000).toBe(60);

          // Should not overlap with fixed event (10-12)
          // Possible slots: 9-10, 12-13, 13-14 ... 17-18
          overlap = flexStart < fixedEnd && flexEnd > fixedStart;
          expect(overlap).toBe(false);
        case 2:
          return _context.a(2);
      }
    }, _callee);
  })));
});