function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { performance } from "perf_hooks";
export var LinearProgramming = /*#__PURE__*/function () {
  function LinearProgramming() {
    _classCallCheck(this, LinearProgramming);
    _defineProperty(this, "weights", {
      preference: 1.0,
      adjustmentCost: 1.0,
      fairness: 0.5
    });
  }
  return _createClass(LinearProgramming, [{
    key: "scheduleMeeting",
    value: function scheduleMeeting(input) {
      var startTime = performance.now();
      var teamMembers = input.teamMembers,
        meetingRequirements = input.meetingRequirements,
        _input$timeStep = input.timeStep,
        timeStep = _input$timeStep === void 0 ? 30 : _input$timeStep;
      if (input.weights) {
        this.weights = _objectSpread(_objectSpread({}, this.weights), input.weights);
      }
      var candidateSlots = this.generateCandidateSlots(meetingRequirements.windowStart, meetingRequirements.windowEnd, meetingRequirements.duration, timeStep);
      var bestResult = null;
      var bestObjective = -Infinity; // We want to maximize (Preference - Cost)
      var _iterator = _createForOfIteratorHelper(candidateSlots),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var slot = _step.value;
          var evaluation = this.evaluateSlot(slot, teamMembers, meetingRequirements);
          if (evaluation.isValid) {
            // Objective: Maximize Preference - Minimize Cost
            // We can normalize this. Let's say Objective = (Preference * w_p) - (Cost * w_c)
            var objective = evaluation.totalPreference * this.weights.preference - evaluation.totalCost * this.weights.adjustmentCost;
            if (objective > bestObjective) {
              bestObjective = objective;
              bestResult = {
                optimalTime: slot,
                participants: evaluation.participants,
                adjustments: evaluation.adjustments,
                totalCost: evaluation.totalCost,
                objectiveValue: objective,
                status: 'optimal' // We'll mark the best found as optimal at the end
              };
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (!bestResult) {
        var _endTime = performance.now();
        return {
          optimalTime: null,
          participants: [],
          adjustments: new Map(),
          totalCost: 0,
          objectiveValue: 0,
          status: 'infeasible',
          metrics: {
            executionTime: _endTime - startTime,
            memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
            solutionQuality: 0
          }
        };
      }
      var endTime = performance.now();
      return _objectSpread(_objectSpread({}, bestResult), {}, {
        metrics: {
          executionTime: endTime - startTime,
          memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
          solutionQuality: bestResult.objectiveValue
        }
      });
    }
  }, {
    key: "generateCandidateSlots",
    value: function generateCandidateSlots(start, end, durationMinutes, stepMinutes) {
      var slots = [];
      var current = new Date(start.getTime());
      var endMs = end.getTime();
      var durationMs = durationMinutes * 60000;
      while (current.getTime() + durationMs <= endMs) {
        slots.push({
          id: "slot-".concat(current.getTime()),
          start: new Date(current),
          end: new Date(current.getTime() + durationMs)
        });
        current = new Date(current.getTime() + stepMinutes * 60000);
      }
      return slots;
    }
  }, {
    key: "evaluateSlot",
    value: function evaluateSlot(slot, members, requirements) {
      var totalCost = 0;
      var totalPreference = 0;
      var participants = [];
      var adjustments = new Map();
      var isValid = true;
      var requiredSet = new Set(requirements.requiredParticipants);
      var optionalSet = new Set(requirements.optionalParticipants || []);
      var _iterator2 = _createForOfIteratorHelper(members),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var member = _step2.value;
          // 1. Check Conflicts (Cost)
          var conflictCost = 0;
          var hasConflict = false;
          var _iterator3 = _createForOfIteratorHelper(member.busySlots),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var busy = _step3.value;
              var overlap = this.getOverlapDuration(slot, busy);
              if (overlap > 0) {
                hasConflict = true;
                // Cost proportional to overlap duration (e.g. 1 cost per minute)
                conflictCost += overlap;
              }
            }

            // 2. Check Preference (Benefit)
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          var preferenceScore = 0;
          var _iterator4 = _createForOfIteratorHelper(member.preferences),
            _step4;
          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var pref = _step4.value;
              var _overlap = this.getOverlapDuration(slot, pref);
              if (_overlap > 0) {
                preferenceScore += _overlap; // Score proportional to overlap
              }
            }

            // 3. Determine Participation
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          if (requiredSet.has(member.id)) {
            if (hasConflict) {
              if (conflictCost > member.maxAdjustmentCost) {
                isValid = false; // Required member cannot adjust
                break;
              } else {
                // Member adjusts
                adjustments.set(member.id, {
                  memberId: member.id,
                  cost: conflictCost,
                  reason: "Conflict with existing task"
                });
                totalCost += conflictCost;
                participants.push(member.id);
              }
            } else {
              participants.push(member.id);
            }
            totalPreference += preferenceScore;
          } else if (optionalSet.has(member.id)) {
            if (hasConflict) {
              // Optional member only joins if cost is low enough (e.g. < maxAdjustmentCost)
              // Or maybe we assume optional members don't reschedule if there is a conflict?
              // Let's assume they join if cost <= maxAdjustmentCost
              if (conflictCost <= member.maxAdjustmentCost) {
                adjustments.set(member.id, {
                  memberId: member.id,
                  cost: conflictCost,
                  reason: "Conflict (Optional)"
                });
                totalCost += conflictCost;
                participants.push(member.id);
                totalPreference += preferenceScore;
              }
            } else {
              participants.push(member.id);
              totalPreference += preferenceScore;
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return {
        isValid: isValid,
        totalCost: totalCost,
        totalPreference: totalPreference,
        participants: participants,
        adjustments: adjustments
      };
    }
  }, {
    key: "hasOverlap",
    value: function hasOverlap(a, b) {
      return a.start < b.end && a.end > b.start;
    }
  }, {
    key: "getOverlapDuration",
    value: function getOverlapDuration(a, b) {
      var start = a.start > b.start ? a.start : b.start;
      var end = a.end < b.end ? a.end : b.end;
      if (start >= end) return 0;
      return (end.getTime() - start.getTime()) / 60000; // Minutes
    }
  }]);
}();