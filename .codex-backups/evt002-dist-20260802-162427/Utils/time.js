export function toShanghaiISO(input) {
  var date = input ? new Date(input) : new Date();
  var utc = date.getTime();
  var shMillis = utc + 8 * 60 * 60 * 1000;
  var d = new Date(shMillis);
  var pad = function pad(n) {
    return n.toString().padStart(2, '0');
  };
  var yyyy = d.getUTCFullYear();
  var MM = pad(d.getUTCMonth() + 1);
  var dd = pad(d.getUTCDate());
  var HH = pad(d.getUTCHours());
  var mm = pad(d.getUTCMinutes());
  var ss = pad(d.getUTCSeconds());
  return "".concat(yyyy, "-").concat(MM, "-").concat(dd, "T").concat(HH, ":").concat(mm, ":").concat(ss, "+08:00");
}
export function ensureTimezone(timeStr) {
  if (!timeStr) return timeStr;
  if (/Z|[+-]\d{2}:?\d{2}$/.test(timeStr)) return timeStr;
  return "".concat(timeStr, "+08:00");
}
export function getAcademicYearConfig() {
  return {
    weekOffset: parseInt(process.env.ACADEMIC_WEEK_OFFSET || '0'),
    academicYearStartMonth: parseInt(process.env.ACADEMIC_YEAR_START_MONTH || '9'),
    academicYearStartDay: parseInt(process.env.ACADEMIC_YEAR_START_DAY || '1')
  };
}
export function getAcademicYearStart() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var _getAcademicYearConfi = getAcademicYearConfig(),
    academicYearStartMonth = _getAcademicYearConfi.academicYearStartMonth,
    academicYearStartDay = _getAcademicYearConfi.academicYearStartDay;
  var year = date.getFullYear();
  if (date.getMonth() >= academicYearStartMonth - 1) {
    return new Date(year, academicYearStartMonth - 1, academicYearStartDay);
  } else {
    return new Date(year - 1, academicYearStartMonth - 1, academicYearStartDay);
  }
}
export function getCurrentWeekNumber() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var _getAcademicYearConfi2 = getAcademicYearConfig(),
    weekOffset = _getAcademicYearConfi2.weekOffset;
  var rawWeekNumber = getRawWeekNumber(date);
  var adjustedWeekNumber = rawWeekNumber + weekOffset;
  return Math.max(1, adjustedWeekNumber);
}
export function getRawWeekNumber() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var academicYearStart = getAcademicYearStart(date);

  // 计算当前日期与学年开始日期的天数差
  var timeDiff = date.getTime() - academicYearStart.getTime();
  var dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  // 计算周次（向上取整）
  return Math.ceil((dayDiff + 1) / 7);
}
export default toShanghaiISO;