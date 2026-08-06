function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * 用户状态统计纯函数：周界、完成时长平均、完成时刻小时众数
 * 时区固定 Asia/Shanghai (+08:00)，与 toShanghaiISO 一致。
 */

var SH_OFFSET_MS = 8 * 60 * 60 * 1000;
var DAY_MS = 24 * 60 * 60 * 1000;
var WEEK_MS = 7 * DAY_MS;

/** 将任意时间转为上海时区墙钟的 UTC 毫秒（用于取年月日时） */
function toShanghaiWallMs(input) {
  var d = typeof input === "string" ? new Date(input) : input;
  return d.getTime() + SH_OFFSET_MS;
}
function pad2(n) {
  return n.toString().padStart(2, "0");
}

/** 上海墙钟 → ISO 字符串（带 +08:00） */
export function shanghaiWallToISO(y, m, d) {
  var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var min = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  return "".concat(y, "-").concat(pad2(m), "-").concat(pad2(d), "T").concat(pad2(h), ":").concat(pad2(min), ":").concat(pad2(s), "+08:00");
}

/**
 * 本周范围：上海时区周一 00:00:00 起，到下周一 00:00:00（左闭右开）
 */
export function getShanghaiWeekRange() {
  var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var wall = new Date(toShanghaiWallMs(now));
  var y = wall.getUTCFullYear();
  var m = wall.getUTCMonth();
  var day = wall.getUTCDate();
  // getUTCDay: 0=Sun ... 6=Sat；周一为一周起点
  var dow = wall.getUTCDay();
  var daysFromMonday = dow === 0 ? 6 : dow - 1;

  // 周一 00:00 的墙钟对应的 UTC 时刻
  var mondayWallUtc = Date.UTC(y, m, day - daysFromMonday, 0, 0, 0);
  // 墙钟毫秒 = 真实 UTC + 8h，所以真实 UTC = 墙钟 UTC 表示 - 8h
  // 但我们直接构造 ISO 字符串更稳
  var mon = new Date(mondayWallUtc);
  var monY = mon.getUTCFullYear();
  var monM = mon.getUTCMonth() + 1;
  var monD = mon.getUTCDate();
  var next = new Date(mondayWallUtc + WEEK_MS);
  var endY = next.getUTCFullYear();
  var endM = next.getUTCMonth() + 1;
  var endD = next.getUTCDate();
  return {
    weekStart: shanghaiWallToISO(monY, monM, monD),
    weekEnd: shanghaiWallToISO(endY, endM, endD)
  };
}

/** 解析时间戳；非法返回 null */
export function parseTimeMs(value) {
  if (!value) return null;
  var t = new Date(value).getTime();
  return Number.isFinite(t) ? t : null;
}

/** 上海时区小时 0..23 */
export function getShanghaiHour(iso) {
  var ms = parseTimeMs(iso);
  if (ms === null) return null;
  var wall = new Date(ms + SH_OFFSET_MS);
  return wall.getUTCHours();
}
export function averageCompleteDurationMs(rows) {
  var sum = 0;
  var n = 0;
  var _iterator = _createForOfIteratorHelper(rows),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var r = _step.value;
      var c = parseTimeMs(r.createdAt);
      var d = parseTimeMs(r.completedAt);
      if (c === null || d === null) continue;
      var dur = d - c;
      if (dur < 0) continue;
      sum += dur;
      n += 1;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (n === 0) return null;
  return Math.round(sum / n);
}

/**
 * 完成时刻小时众数：取最高频小时；多峰时返回算术平均（1 位小数）
 */
export function completionHourMode(completedAts) {
  var counts = new Array(24).fill(0);
  var total = 0;
  var _iterator2 = _createForOfIteratorHelper(completedAts),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var iso = _step2.value;
      var _h = getShanghaiHour(iso);
      if (_h === null) continue;
      counts[_h] += 1;
      total += 1;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  if (total === 0) return {
    mode: null,
    modalHours: []
  };
  var max = 0;
  var _iterator3 = _createForOfIteratorHelper(counts),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var c = _step3.value;
      if (c > max) max = c;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var modalHours = [];
  for (var h = 0; h < 24; h++) {
    if (counts[h] === max) modalHours.push(h);
  }
  var avg = modalHours.reduce(function (a, b) {
    return a + b;
  }, 0) / modalHours.length;
  var mode = Math.round(avg * 10) / 10;
  return {
    mode: mode,
    modalHours: modalHours
  };
}
export function formatDurationHuman(ms) {
  if (ms === null || !Number.isFinite(ms) || ms < 0) return null;
  if (ms < 60000) return "".concat(Math.max(1, Math.round(ms / 1000)), "s");
  if (ms < 3600000) return "".concat(Math.round(ms / 60000), "m");
  if (ms < DAY_MS) return "".concat(Math.round(ms / 3600000), "h");
  var days = ms / DAY_MS;
  if (days < 10) return "".concat(Math.round(days * 10) / 10, "d");
  return "".concat(Math.round(days), "d");
}
export var USER_STATUS_CACHE_TTL_MS = 60000;