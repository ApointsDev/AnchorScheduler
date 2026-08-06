function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* eslint-disable @typescript-eslint/no-explicit-any */
import ICAL from "ical.js";
import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";
import { resolveScheduleType } from "../types.js";
// ── ICS text helpers ──────────────────────────────────────────────

export var escapeIcsText = function escapeIcsText(value) {
  if (!value) return '';
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
};
export var foldLine = function foldLine(line) {
  var maxLen = 75;
  if (line.length <= maxLen) return line;
  var parts = [];
  var current = line;
  while (current.length > maxLen) {
    parts.push(current.slice(0, maxLen));
    current = " ".concat(current.slice(maxLen));
  }
  parts.push(current);
  return parts.join('\r\n');
};
export var formatCalTimeUtc = function formatCalTimeUtc(iso) {
  var date = new Date(iso);
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
};

// ── RRULE helpers ──────────────────────────────────────────────────

export var buildRruleString = function buildRruleString(rule) {
  var _rule$weeks, _rule$byDay, _rule$days;
  if (!rule) return undefined;
  var parts = [];
  var freqMap = {
    daily: 'DAILY',
    weekly: 'WEEKLY',
    weeklyByWeekNumber: 'WEEKLY',
    dailyOnDays: 'WEEKLY'
  };
  parts.push("FREQ=".concat(freqMap[rule.freq]));
  if (rule.interval) parts.push("INTERVAL=".concat(rule.interval));
  if (rule.count) parts.push("COUNT=".concat(rule.count));
  if (rule.until) parts.push("UNTIL=".concat(formatCalTimeUtc(rule.until)));
  if (rule.freq === 'weeklyByWeekNumber' && (_rule$weeks = rule.weeks) !== null && _rule$weeks !== void 0 && _rule$weeks.length) {
    parts.push("BYWEEKNO=".concat(rule.weeks.join(',')));
  }
  if (rule.freq === 'weekly' && (_rule$byDay = rule.byDay) !== null && _rule$byDay !== void 0 && _rule$byDay.length) {
    parts.push("BYDAY=".concat(rule.byDay.join(',')));
  }
  if (rule.freq === 'dailyOnDays' && (_rule$days = rule.days) !== null && _rule$days !== void 0 && _rule$days.length) {
    var dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    var byDay = rule.days.map(function (d) {
      return dayMap[d];
    }).filter(Boolean);
    if (byDay.length) parts.push("BYDAY=".concat(byDay.join(',')));
  }
  return parts.join(';');
};

// ── Parsing helpers ────────────────────────────────────────────────

var parsePriority = function parsePriority(value) {
  if (!value) return undefined;
  var n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
};
var mapOrganizer = function mapOrganizer(value) {
  if (!value) return undefined;
  var raw = typeof value === 'string' ? value : String(value);
  return raw.replace(/^mailto:/i, '');
};
var mapAttendees = function mapAttendees(props) {
  return props.map(function (p) {
    return String(p.getFirstValue() || '');
  }).filter(Boolean).map(function (v) {
    return v.replace(/^mailto:/i, '');
  });
};
var mapCategories = function mapCategories(props) {
  var values = [];
  var _iterator = _createForOfIteratorHelper(props),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var prop = _step.value;
      var val = prop.getFirstValue();
      if (Array.isArray(val)) {
        values.push.apply(values, _toConsumableArray(val.map(String)));
      } else if (val) {
        values.push(String(val));
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return values;
};
var mapAttachments = function mapAttachments(props) {
  return props.map(function (p) {
    return String(p.getFirstValue() || '');
  }).filter(Boolean);
};
var mapRruleToRecurrence = function mapRruleToRecurrence(rrule) {
  if (!rrule) return undefined;
  var freq = (rrule.freq || '').toLowerCase();
  var interval = rrule.interval || undefined;
  var count = rrule.count || undefined;
  var until = rrule.until ? rrule.until.toJSDate().toISOString() : undefined;
  if (freq === 'weekly' && rrule.byweekno && rrule.byweekno.length > 0) {
    return {
      freq: 'weeklyByWeekNumber',
      weeks: rrule.byweekno,
      interval: interval,
      count: count,
      until: until
    };
  }
  if (freq === 'weekly' && rrule.byday && rrule.byday.length > 0) {
    var dayMap = {
      SU: 0,
      MO: 1,
      TU: 2,
      WE: 3,
      TH: 4,
      FR: 5,
      SA: 6
    };
    var days = rrule.byday.map(function (d) {
      return dayMap[String(d).toUpperCase()];
    }).filter(function (d) {
      return d !== undefined;
    });
    return {
      freq: 'dailyOnDays',
      days: days,
      interval: interval,
      count: count,
      until: until
    };
  }
  if (freq === 'weekly') {
    return {
      freq: 'weekly',
      interval: interval,
      count: count,
      until: until
    };
  }
  if (freq === 'daily') {
    return {
      freq: 'daily',
      interval: interval,
      count: count,
      until: until
    };
  }
  return undefined;
};

// ── Core ICS build / parse ─────────────────────────────────────────

export function parseIcsEvent(ics, response) {
  try {
    var jcal = ICAL.parse(ics);
    var comp = new ICAL.Component(jcal);
    var vevent = comp.getFirstSubcomponent('vevent');
    if (!vevent) return null;
    var event = new ICAL.Event(vevent);
    var rruleProp = vevent.getFirstProperty('rrule');
    var rrule = rruleProp ? rruleProp.getFirstValue() : undefined;
    var recurrenceRule = mapRruleToRecurrence(rrule);
    var resolved = resolveScheduleType({
      explicit: undefined,
      recurrence: recurrenceRule,
      fallback: 'single'
    });
    var attendees = mapAttendees(vevent.getAllProperties('attendee'));
    var categories = mapCategories(vevent.getAllProperties('categories'));
    var attachments = mapAttachments(vevent.getAllProperties('attach'));
    var organizerProp = vevent.getFirstProperty('organizer');
    var organizer = organizerProp ? mapOrganizer(organizerProp.getFirstValue()) : undefined;
    var priorityProp = vevent.getFirstProperty('priority');
    var priority = priorityProp ? parsePriority(priorityProp.getFirstValue()) : undefined;
    return {
      uid: event.uid || uuidv4(),
      summary: event.summary || undefined,
      description: event.description || undefined,
      start: toShanghaiISO(event.startDate.toJSDate()),
      end: toShanghaiISO(event.endDate.toJSDate()),
      location: event.location || undefined,
      rrule: rrule ? rrule.toString() : undefined,
      recurrenceRule: recurrenceRule,
      scheduleType: resolved.scheduleType,
      attendees: attendees,
      categories: categories,
      attachments: attachments,
      organizer: organizer,
      priority: priority,
      href: (response === null || response === void 0 ? void 0 : response.url) || (response === null || response === void 0 ? void 0 : response.href),
      etag: response === null || response === void 0 ? void 0 : response.etag,
      rawIcs: ics
    };
  } catch (e) {
    console.error('Error parsing ICS event:', e);
    return null;
  }
}
export function buildIcs(event, uidOverride) {
  var uid = uidOverride || event.uid || uuidv4();
  var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Apoints//CalDAV//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', "UID:".concat(uid), "DTSTAMP:".concat(formatCalTimeUtc(new Date().toISOString())), "DTSTART:".concat(formatCalTimeUtc(event.start)), "DTEND:".concat(formatCalTimeUtc(event.end)), "SUMMARY:".concat(escapeIcsText(event.summary || ''))];
  if (event.description) lines.push("DESCRIPTION:".concat(escapeIcsText(event.description)));
  if (event.location) lines.push("LOCATION:".concat(escapeIcsText(event.location)));
  var rruleString = event.rrule || buildRruleString(event.recurrenceRule) || undefined;
  if (rruleString) lines.push("RRULE:".concat(rruleString));
  if (event.priority !== undefined) lines.push("PRIORITY:".concat(event.priority));
  if (event.organizer) {
    lines.push("ORGANIZER:mailto:".concat(event.organizer));
  }
  if (event.attendees && event.attendees.length > 0) {
    var _iterator2 = _createForOfIteratorHelper(event.attendees),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var attendee = _step2.value;
        lines.push("ATTENDEE:mailto:".concat(attendee));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  if (event.categories && event.categories.length > 0) {
    lines.push("CATEGORIES:".concat(event.categories.map(escapeIcsText).join(',')));
  }
  if (event.attachments && event.attachments.length > 0) {
    var _iterator3 = _createForOfIteratorHelper(event.attachments),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var attachment = _step3.value;
        lines.push("ATTACH:".concat(attachment));
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(foldLine).join('\r\n');
}