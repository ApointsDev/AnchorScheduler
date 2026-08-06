function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 社区排名：指标定义、排序方向、展示文案
 * 四个指标与 UserStatus 一一对应。
 */

export var COMMUNITY_METRICS = [{
  metric: "completedThisWeek",
  path: "completed-this-week",
  metricLabel: "本周完成日程数",
  titleLabel: "时间利用率",
  higherIsBetter: true,
  column: "completedThisWeek",
  requireNonNull: false
}, {
  metric: "incompleteThisWeek",
  path: "incomplete-this-week",
  metricLabel: "本周未完成日程数",
  titleLabel: "日程清爽度",
  // 未完成越少越好
  higherIsBetter: false,
  column: "incompleteThisWeek",
  requireNonNull: false
}, {
  metric: "avgCompleteDurationMs",
  path: "avg-complete-duration",
  metricLabel: "平均完成时长",
  titleLabel: "执行效率",
  // 从创建到完成越快越好
  higherIsBetter: false,
  column: "avgCompleteDurationMs",
  requireNonNull: true
}, {
  metric: "completionHourMode",
  path: "completion-hour-mode",
  metricLabel: "习惯完成时段（小时）",
  titleLabel: "早鸟指数",
  // 更早完成 → 小时更小 → 更好
  higherIsBetter: false,
  column: "completionHourMode",
  requireNonNull: true
}];
export var METRIC_BY_PATH = new Map(COMMUNITY_METRICS.map(function (m) {
  return [m.path, m];
}));
export var METRIC_BY_KEY = new Map(COMMUNITY_METRICS.map(function (m) {
  return [m.metric, m];
}));

/** 排名缓存 TTL */
export var COMMUNITY_RANK_CACHE_TTL_MS = 5 * 60 * 1000;

/** 默认预置地区 */
export var DEFAULT_COMMUNITY_REGIONS = [{
  id: "region-xjtlu",
  name: "西交利物浦大学"
}];

/**
 * 生成称号文案：西交利物浦大学时间利用率第一
 */
export function buildRankTitle(regionName, titleLabel, rank) {
  if (rank === null || rank < 1) return null;
  if (rank === 1) return "".concat(regionName).concat(titleLabel, "\u7B2C\u4E00");
  return "".concat(regionName).concat(titleLabel, "\u7B2C").concat(rank);
}

/**
 * 对已按优劣排好序的列表赋密集名次（同分同名次，下一名不跳号：1,2,2,3）
 */
export function assignDenseRanks(sorted) {
  var out = [];
  for (var i = 0; i < sorted.length; i++) {
    var rank = void 0;
    if (i === 0) {
      rank = 1;
    } else if (sorted[i].value === sorted[i - 1].value) {
      rank = out[i - 1].rank;
    } else {
      rank = out[i - 1].rank + 1;
    }
    out.push(_objectSpread(_objectSpread({}, sorted[i]), {}, {
      rank: rank
    }));
  }
  return out;
}

/** 展示名：保留姓名，过长截断 */
export function toDisplayName(name, email) {
  var n = (name || "").trim();
  if (n) return n.length > 16 ? "".concat(n.slice(0, 16), "\u2026") : n;
  var e = (email || "").trim();
  if (e) {
    var local = e.split("@")[0] || e;
    return local.length > 12 ? "".concat(local.slice(0, 12), "\u2026") : local;
  }
  return "匿名用户";
}