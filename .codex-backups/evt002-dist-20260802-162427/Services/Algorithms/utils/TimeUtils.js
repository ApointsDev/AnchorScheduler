function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var TimeUtils = /*#__PURE__*/function () {
  function TimeUtils() {
    _classCallCheck(this, TimeUtils);
  }
  return _createClass(TimeUtils, null, [{
    key: "generateTimeSlots",
    value: function generateTimeSlots(startTime, endTime, interval) {
      var slots = [];
      var _startTime$split$map = startTime.split(':').map(Number),
        _startTime$split$map2 = _slicedToArray(_startTime$split$map, 2),
        startHour = _startTime$split$map2[0],
        startMinute = _startTime$split$map2[1];
      var _endTime$split$map = endTime.split(':').map(Number),
        _endTime$split$map2 = _slicedToArray(_endTime$split$map, 2),
        endHour = _endTime$split$map2[0],
        endMinute = _endTime$split$map2[1];
      var current = new Date();
      current.setHours(startHour, startMinute, 0, 0);
      var end = new Date();
      end.setHours(endHour, endMinute, 0, 0);
      var idCounter = 1;
      while (current < end) {
        var slotEnd = new Date(current.getTime() + interval * 60000);
        if (slotEnd > end) break;
        slots.push({
          id: "slot_".concat(idCounter++),
          start: new Date(current),
          end: new Date(slotEnd)
        });
        current = slotEnd;
      }
      return slots;
    }
  }, {
    key: "hasTimeOverlap",
    value: function hasTimeOverlap(slot1, slot2) {
      return slot1.start < slot2.end && slot2.start < slot1.end;
    }
  }, {
    key: "timeDifference",
    value: function timeDifference(start, end) {
      return (end.getTime() - start.getTime()) / 60000;
    }
  }, {
    key: "mergeTimeSlots",
    value: function mergeTimeSlots(slots) {
      if (slots.length === 0) return [];
      var sorted = _toConsumableArray(slots).sort(function (a, b) {
        return a.start.getTime() - b.start.getTime();
      });
      var merged = [sorted[0]];
      for (var i = 1; i < sorted.length; i++) {
        var current = sorted[i];
        var last = merged[merged.length - 1];
        if (current.start <= last.end) {
          last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
        } else {
          merged.push(current);
        }
      }
      return merged;
    }
  }, {
    key: "splitTimeSlot",
    value: function splitTimeSlot(slot, maxDuration) {
      var result = [];
      var current = new Date(slot.start);
      var end = new Date(slot.end);
      var idCounter = 1;
      while (current < end) {
        var chunkEnd = new Date(Math.min(current.getTime() + maxDuration * 60000, end.getTime()));
        result.push({
          id: "".concat(slot.id, "_part_").concat(idCounter++),
          start: new Date(current),
          end: new Date(chunkEnd)
        });
        current = chunkEnd;
      }
      return result;
    }
  }, {
    key: "isWeekday",
    value: function isWeekday(date) {
      var day = date.getDay();
      return day !== 0 && day !== 6;
    }
  }, {
    key: "addBusinessMinutes",
    value: function addBusinessMinutes(date, minutes) {
      // Simplified implementation: just adds minutes, ignoring business hours logic for now
      // as full business logic requires configuration of business hours
      return new Date(date.getTime() + minutes * 60000);
    }
  }]);
}();