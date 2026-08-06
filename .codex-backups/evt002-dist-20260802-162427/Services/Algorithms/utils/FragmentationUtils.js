function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var FragmentationUtils = /*#__PURE__*/function () {
  function FragmentationUtils() {
    _classCallCheck(this, FragmentationUtils);
  }
  return _createClass(FragmentationUtils, null, [{
    key: "isFragmented",
    value:
    /**
     * 检测时间槽是否为“碎片化”时段（即填补空隙的时段）。
     * 如果时间槽紧邻固定事件（前或后），则视为碎片化时段。
     * 这种时段适合安排短任务，以避免打断大块连续时间。
     * 
     * @param slotStart 时间槽开始时间
     * @param slotEnd 时间槽结束时间
     * @param fixedEvents 固定事件列表
     * @param thresholdMs 判定邻近的阈值（毫秒），默认 1分钟
     */
    function isFragmented(slotStart, slotEnd, fixedEvents) {
      var thresholdMs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 60000;
      // 检查前面是否有紧邻的事件
      var hasEventBefore = fixedEvents.some(function (e) {
        return Math.abs(e.endTime.getTime() - slotStart.getTime()) < thresholdMs;
      });

      // 检查后面是否有紧邻的事件
      var hasEventAfter = fixedEvents.some(function (e) {
        return Math.abs(e.startTime.getTime() - slotEnd.getTime()) < thresholdMs;
      });
      return hasEventBefore || hasEventAfter;
    }
  }]);
}();