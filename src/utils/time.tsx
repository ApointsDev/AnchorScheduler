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

export default toShanghaiISO;
