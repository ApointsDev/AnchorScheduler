export function toShanghaiISO(input?: string | Date): string {
  const date = input ? new Date(input) : new Date();
  const utc = date.getTime();
  const shMillis = utc + 8 * 60 * 60 * 1000;
  const d = new Date(shMillis);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  const MM = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const HH = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}+08:00`;
}

export function ensureTimezone(timeStr?: string) {
  if (!timeStr) return timeStr;
  if (/Z|[+-]\d{2}:?\d{2}$/.test(timeStr)) return timeStr;
  return `${timeStr}+08:00`;
}

export function getAcademicYearConfig() {
  return {
    weekOffset: parseInt(process.env.ACADEMIC_WEEK_OFFSET || '0'),
    academicYearStartMonth: parseInt(process.env.ACADEMIC_YEAR_START_MONTH || '9'),
    academicYearStartDay: parseInt(process.env.ACADEMIC_YEAR_START_DAY || '1')
  };
}

export function getAcademicYearStart(date: Date = new Date()): Date {
  const { academicYearStartMonth, academicYearStartDay } = getAcademicYearConfig();
  const year = date.getFullYear();
  
  if (date.getMonth() >= academicYearStartMonth - 1) {
    return new Date(year, academicYearStartMonth - 1, academicYearStartDay);
  } else {
    return new Date(year - 1, academicYearStartMonth - 1, academicYearStartDay);
  }
}

export function getCurrentWeekNumber(date: Date = new Date()): number {
  const { weekOffset } = getAcademicYearConfig();
  const rawWeekNumber = getRawWeekNumber(date);
  const adjustedWeekNumber = rawWeekNumber + weekOffset;

  return Math.max(1, adjustedWeekNumber);
}

export function getRawWeekNumber(date: Date = new Date()): number {
  const academicYearStart = getAcademicYearStart(date);

  // 计算当前日期与学年开始日期的天数差
  const timeDiff = date.getTime() - academicYearStart.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  // 计算周次（向上取整）
  return Math.ceil((dayDiff + 1) / 7);
}

export default toShanghaiISO;
