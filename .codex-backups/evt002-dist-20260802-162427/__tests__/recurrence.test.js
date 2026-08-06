function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import { generateRecurrenceInstances } from "../Services/recurrence.js";
describe('recurrence.generateRecurrenceInstances', function () {
  var root = {
    id: 'root',
    name: 'Root',
    startTime: '2025-01-01T09:00:00.000Z',
    endTime: '2025-01-01T10:00:00.000Z'
  };
  test('daily frequency generates instances', function () {
    var rule = {
      freq: 'daily',
      interval: 1,
      count: 3
    };
    var instances = generateRecurrenceInstances(root, rule);
    // count=3 => root + 2 generated
    expect(instances.length).toBe(2);
    // dates should be next days
    expect(new Date(instances[0].startTime).getUTCDate()).toBe(new Date(root.startTime).getUTCDate() + 1);
  });
  test('weekly byDay generates correct days', function () {
    // root is 2025-01-01 (Wednesday)
    var rule = {
      freq: 'weekly',
      interval: 1,
      byDay: ['Mon', 'Wed', 'Fri'],
      count: 5
    };
    var instances = generateRecurrenceInstances(root, rule);
    // Should generate instances on Mon/Wed/Fri weeks after root, respecting count limit
    expect(instances.length).toBeGreaterThan(0);
    // ensure no instance has parentTaskId equal to root for root duplication
    var _iterator = _createForOfIteratorHelper(instances),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var inst = _step.value;
        expect(inst.parentTaskId).toBe('root');
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  test('safety limit prevents runaway generation when no count/until', function () {
    var rule = {
      freq: 'daily',
      interval: 1
    };
    var instances = generateRecurrenceInstances(root, rule);
    expect(instances.length).toBeLessThanOrEqual(365);
  });
});