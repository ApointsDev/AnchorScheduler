/**
 * 计算下次自动同步时间（上海时区语义，用 Date 本地/UTC 运算 + 固定 +8 偏移不够稳，
 * 这里用简单「冷却 + preferredHour」算法，输出 ISO 字符串供比较）。
 */
import moment from "moment-timezone";
var TZ = "Asia/Shanghai";
export function clampIntervalHours(h) {
  if (!Number.isFinite(h)) return 24;
  return Math.max(1, Math.min(168, Math.floor(h)));
}
export function clampPreferredHour(h) {
  if (!Number.isFinite(h)) return 8;
  return Math.max(0, Math.min(23, Math.floor(h)));
}

/**
 * @param from 参考时刻（通常为上次成功同步 now）
 * @param intervalHours 最小冷却间隔
 * @param preferredHour 上海时区偏好小时 0-23
 * @param jitterMinutes 错峰抖动 0-59
 */
export function computeNextSyncAt(from, intervalHours, preferredHour) {
  var jitterMinutes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var interval = clampIntervalHours(intervalHours);
  var hour = clampPreferredHour(preferredHour);
  var jitter = Math.max(0, Math.min(59, Math.floor(jitterMinutes)));
  var base = moment.tz(from, TZ).add(interval, "hours");
  // 冷却结束后，落到不早于 base 的 preferredHour:00 + jitter
  var candidate = base.clone().hour(hour).minute(jitter).second(0).millisecond(0);
  if (candidate.isBefore(base)) {
    candidate = candidate.add(1, "day");
  }
  return candidate.toISOString();
}

/** 用 userId 稳定哈希生成 0–59 分钟抖动 */
export function jitterMinutesForUser(userId) {
  var h = 0;
  for (var i = 0; i < userId.length; i++) {
    h = h * 31 + userId.charCodeAt(i) >>> 0;
  }
  return h % 60;
}
export function isDue(nextSyncAt) {
  var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  if (!nextSyncAt) return true;
  var t = Date.parse(nextSyncAt);
  if (Number.isNaN(t)) return true;
  return t <= now.getTime();
}