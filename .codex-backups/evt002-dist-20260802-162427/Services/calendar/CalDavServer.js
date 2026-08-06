function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * CalDAV Server Core
 * Implements CalDAV (RFC 4791) and WebDAV (RFC 4918) protocol handling.
 * Translates CalDAV operations to the local task storage via dbService.
 *
 * URL structure:
 *   /caldav/                              - Server root (redirects to principal)
 *   /caldav/principals/{userId}/          - Principal resource
 *   /caldav/calendars/{userId}/           - Calendar home set
 *   /caldav/calendars/{userId}/default/   - Default calendar collection
 *   /caldav/calendars/{userId}/default/{uid}.ics - Individual event resources
 */

import { v4 as uuidv4 } from "uuid";
import { dbService } from "../dbService.js";
import { buildIcs, parseIcsEvent } from "./icsUtils.js";
import { parseRecurrenceRuleInput, resolveScheduleType } from "../types.js";
// ── XML namespaces ─────────────────────────────────────────────────

var NS = {
  DAV: "DAV:",
  CALDAV: "urn:ietf:params:xml:ns:caldav",
  CS: "http://calendarserver.org/ns/",
  ICAL: "http://apple.com/ns/ical/"
};

// ── Types ──────────────────────────────────────────────────────────

// ── Path helpers ───────────────────────────────────────────────────

function pathSegments(path) {
  return path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
}

/**
 * Parse CalDAV path to determine resource type and extract IDs.
 * Paths under /caldav/...
 */
export function parseCalDavPath(path) {
  var segs = pathSegments(path);
  // Remove the leading "caldav" prefix if present
  var idx = 0;

  // Path may start with "caldav" or not (depending on mount prefix)
  if (segs[0] === "caldav") idx++;
  if (idx >= segs.length) return {
    type: "root"
  };
  var first = segs[idx];
  if (first === "principals" && segs[idx + 1]) {
    return {
      type: "principal",
      userId: segs[idx + 1]
    };
  }
  if (first === "calendars" && segs[idx + 1]) {
    var userId = segs[idx + 1];
    var calendarId = segs[idx + 2];
    var eventUid = segs[idx + 3];
    if (!calendarId) {
      return {
        type: "calendar-home",
        userId: userId
      };
    }
    if (!eventUid) {
      return {
        type: "calendar",
        userId: userId,
        calendarId: calendarId
      };
    }
    // Strip .ics extension if present
    var uid = eventUid.replace(/\.ics$/i, "");
    return {
      type: "event",
      userId: userId,
      calendarId: calendarId,
      eventUid: uid
    };
  }

  // Fallback: treat first segment after caldav as userId
  if (first) {
    return {
      type: "principal",
      userId: first
    };
  }
  return {
    type: "root"
  };
}
function buildResourceUrl(config, parts) {
  var base = config.baseUrl.replace(/\/+$/, "");
  return [base].concat(_toConsumableArray(parts)).join("/");
}

// ── XML builders ───────────────────────────────────────────────────

function xmlHeader() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n';
}
function xmlTag(name, content, attrs) {
  var attrStr = attrs ? " " + Object.entries(attrs).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      v = _ref2[1];
    return "".concat(k, "=\"").concat(xmlEscape(v), "\"");
  }).join(" ") : "";
  if (content === undefined) return "<".concat(name).concat(attrStr, "/>");
  return "<".concat(name).concat(attrStr, ">").concat(content, "</").concat(name, ">");
}
function xmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function buildPropstat(props, status) {
  return xmlTag("D:propstat", xmlTag("D:prop", props) + xmlTag("D:status", status));
}
function buildResponse(href, propstats, statusOverride) {
  if (statusOverride) {
    return xmlTag("D:response", xmlTag("D:href", xmlEscape(href)) + xmlTag("D:status", statusOverride));
  }
  return xmlTag("D:response", xmlTag("D:href", xmlEscape(href)) + propstats);
}

// ── PROPFIND response builders ─────────────────────────────────────

function buildPrincipalProps(user, config) {
  var principalUrl = buildResourceUrl(config, ["principals", user.id]);
  var calendarHomeUrl = buildResourceUrl(config, ["calendars", user.id]);
  var displayName = user.name || user.email;
  return [xmlTag("D:resourcetype", xmlTag("D:principal") + xmlTag("D:collection")), xmlTag("D:displayname", xmlEscape(displayName)), xmlTag("C:calendar-home-set", xmlTag("D:href", xmlEscape(calendarHomeUrl + "/"))), xmlTag("C:calendar-user-address-set", xmlTag("D:href", xmlEscape("mailto:" + user.email)))].join("");
}
function buildCalendarHomeProps(user, config) {
  return [xmlTag("D:resourcetype", xmlTag("D:collection")), xmlTag("D:displayname", xmlEscape("Calendars of ".concat(user.name || user.email)))].join("");
}
function buildCalendarProps(user, config, calendarId) {
  var calendarUrl = buildResourceUrl(config, ["calendars", user.id, calendarId]);
  var displayName = calendarId === "default" ? "Default Calendar" : calendarId;
  return [xmlTag("D:resourcetype", xmlTag("D:collection") + xmlTag("C:calendar")), xmlTag("D:displayname", xmlEscape(displayName)), xmlTag("C:supported-calendar-component-set", xmlTag("C:comp", "", {
    name: "VEVENT"
  }) + xmlTag("C:comp", "", {
    name: "VTODO"
  })), xmlTag("CS:getctag", "\"".concat(uuidv4(), "\""))].join("");
}
function buildEventProps(task) {
  var etag = "\"".concat(task.id, "-").concat(task.startTime, "-").concat(task.endTime, "\"").replace(/[^ -~]/g, "");
  var contentType = "text/calendar; charset=utf-8";
  var resourceType = xmlTag("D:resourcetype", "");
  return [resourceType, xmlTag("D:displayname", xmlEscape(task.name || "Untitled")), xmlTag("D:getcontenttype", contentType), xmlTag("D:getetag", etag)].join("");
}

// ── XML parser (lightweight) ───────────────────────────────────────

function extractXmlTag(xml, tagName) {
  // Match both prefixed and unprefixed tags
  var patterns = [new RegExp("<[^>]*:".concat(tagName, "[^>]*>([\\s\\S]*?)</[^>]*:").concat(tagName, ">"), "i"), new RegExp("<".concat(tagName, "[^>]*>([\\s\\S]*?)</").concat(tagName, ">"), "i")];
  for (var _i = 0, _patterns = patterns; _i < _patterns.length; _i++) {
    var re = _patterns[_i];
    var m = re.exec(xml);
    if (m) return m[1].trim();
  }
  return null;
}
function extractAllXmlTags(xml, tagName) {
  var results = [];
  var patterns = [new RegExp("<[^>]*:".concat(tagName, "[^>]*>([\\s\\S]*?)</[^>]*:").concat(tagName, ">"), "gi"), new RegExp("<".concat(tagName, "[^>]*>([\\s\\S]*?)</").concat(tagName, ">"), "gi")];
  for (var _i2 = 0, _patterns2 = patterns; _i2 < _patterns2.length; _i2++) {
    var re = _patterns2[_i2];
    var m = void 0;
    while ((m = re.exec(xml)) !== null) {
      results.push(m[1].trim());
    }
    if (results.length > 0) break;
  }
  return results;
}
function extractHref(xml) {
  var href = extractXmlTag(xml, "href");
  return href ? href.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'") : null;
}
function extractPropNames(xml) {
  var propSection = extractXmlTag(xml, "prop");
  if (!propSection) return [];
  // Extract XML tag names from the prop section
  var tagRe = /<([^/\s>]+)[^>]*\/?>/g;
  var names = [];
  var m;
  while ((m = tagRe.exec(propSection)) !== null) {
    var localName = m[1].replace(/^[^:]*:/, "");
    names.push(localName);
  }
  return _toConsumableArray(new Set(names));
}

// ── REPORT parser ──────────────────────────────────────────────────

function parseCalendarQuery(xml) {
  var query = {};
  var timeRangeXml = extractXmlTag(xml, "time-range");
  if (timeRangeXml) {
    var _timeRangeXml$match, _timeRangeXml$match2;
    var start = (_timeRangeXml$match = timeRangeXml.match(/start="([^"]*)"/)) === null || _timeRangeXml$match === void 0 ? void 0 : _timeRangeXml$match[1];
    var end = (_timeRangeXml$match2 = timeRangeXml.match(/end="([^"]*)"/)) === null || _timeRangeXml$match2 === void 0 ? void 0 : _timeRangeXml$match2[1];
    if (start) query.timeRange = {
      start: start,
      end: end || "99991231T235959Z"
    };
  }
  var uidXml = extractXmlTag(xml, "text-match");
  // Actually for UID filter we look at comp-filter for VEVENT with prop-filter UID
  var propFilters = extractAllXmlTags(xml, "prop-filter");
  var _iterator = _createForOfIteratorHelper(propFilters),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _pf$match;
      var pf = _step.value;
      var nameAttr = (_pf$match = pf.match(/name="([^"]*)"/)) === null || _pf$match === void 0 ? void 0 : _pf$match[1];
      if ((nameAttr === null || nameAttr === void 0 ? void 0 : nameAttr.toUpperCase()) === "UID") {
        var textMatch = extractXmlTag(pf, "text-match");
        if (textMatch) {
          query.filterUid = textMatch;
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return query;
}

// ── Task → CalendarEvent mapping ───────────────────────────────────

function taskToCalendarEvent(task) {
  var recurrenceRule = parseRecurrenceRuleInput(task.recurrenceRule);
  var resolved = resolveScheduleType({
    explicit: task.scheduleType,
    recurrence: recurrenceRule,
    fallback: "single"
  });
  return {
    uid: task.id,
    summary: task.name,
    description: task.description,
    start: task.startTime,
    end: task.endTime,
    location: task.location,
    attendees: task.attendees,
    recurrenceRule: resolved.parsedRecurrence || recurrenceRule,
    scheduleType: resolved.scheduleType,
    priority: task.importance === "high" ? 1 : task.importance === "low" ? 9 : 5
  };
}
function calendarEventToTask(event, existingTask, userId) {
  var scheduleType = event.scheduleType || resolveScheduleType({
    explicit: undefined,
    recurrence: event.recurrenceRule,
    fallback: "single"
  }).scheduleType;
  return {
    id: event.uid || (existingTask === null || existingTask === void 0 ? void 0 : existingTask.id) || uuidv4(),
    name: event.summary || "Untitled",
    description: event.description || "",
    dueDate: event.end || event.start,
    startTime: event.start,
    endTime: event.end,
    location: event.location,
    completed: false,
    pushedToMSTodo: (existingTask === null || existingTask === void 0 ? void 0 : existingTask.pushedToMSTodo) || false,
    attendees: event.attendees,
    recurrenceRule: event.recurrenceRule ? JSON.stringify(event.recurrenceRule) : undefined,
    scheduleType: scheduleType,
    importance: event.priority && event.priority <= 3 ? "high" : event.priority && event.priority >= 7 ? "low" : "normal"
  };
}

// ── Core handlers ──────────────────────────────────────────────────
function handleOptions(_x, _x2) {
  return _handleOptions.apply(this, arguments);
}
function _handleOptions() {
  _handleOptions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(ctx, config) {
    var headers;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          headers = {
            DAV: "1, 2, 3, calendar-access, addressbook",
            Allow: "OPTIONS, GET, HEAD, PROPFIND, REPORT, PUT, DELETE, MKCALENDAR, MKCOL",
            "Content-Type": "text/xml; charset=utf-8"
          };
          return _context.a(2, {
            status: 200,
            headers: headers
          });
      }
    }, _callee);
  }));
  return _handleOptions.apply(this, arguments);
}
function handlePropfind(_x3, _x4) {
  return _handlePropfind.apply(this, arguments);
}
function _handlePropfind() {
  _handlePropfind = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(ctx, config) {
    var parsed, depth, requestedProps, wantAllProps, href, principalUrl, props, resp, _href, _props, _resp, body, chHref, chProps, chResp, _href2, _props2, _resp2, _body, calHref, calProps, calResp, _href3, _props3, _resp3, _body2, tasks, eventResponses, _iterator2, _step2, task, eventHref, eventProps, _task, _eventHref, _eventProps, _resp4, _t, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          parsed = parseCalDavPath(ctx.path);
          depth = ctx.depth || "0";
          requestedProps = ctx.body ? extractPropNames(ctx.body) : []; // If no prop requested, return allprops
          wantAllProps = requestedProps.length === 0 || requestedProps.includes("allprop");
          _t = parsed.type;
          _context2.n = _t === "root" ? 1 : _t === "principal" ? 2 : _t === "calendar-home" ? 4 : _t === "calendar" ? 6 : _t === "event" ? 10 : 15;
          break;
        case 1:
          // Return root with current-user-principal for CalDAV client discovery (Thunderbird, etc.)
          href = buildResourceUrl(config, []);
          principalUrl = buildResourceUrl(config, ["principals", ctx.user.id]);
          props = xmlTag("D:resourcetype", xmlTag("D:collection")) + xmlTag("D:displayname", "Apoints CalDAV Server") + xmlTag("D:current-user-principal", xmlTag("D:href", xmlEscape(principalUrl + "/")));
          resp = buildResponse(href + "/", buildPropstat(props, "HTTP/1.1 200 OK"));
          return _context2.a(2, {
            status: 207,
            headers: {
              "Content-Type": "text/xml; charset=utf-8"
            },
            body: xmlHeader() + xmlTag("D:multistatus", resp, {
              "xmlns:D": NS.DAV
            })
          });
        case 2:
          if (parsed.userId) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, {
            status: 404,
            headers: {}
          });
        case 3:
          _href = buildResourceUrl(config, ["principals", parsed.userId]);
          _props = buildPrincipalProps(ctx.user, config);
          _resp = buildResponse(_href + "/", buildPropstat(_props, "HTTP/1.1 200 OK"));
          body = xmlHeader() + xmlTag("D:multistatus", _resp, {
            "xmlns:D": NS.DAV,
            "xmlns:C": NS.CALDAV,
            "xmlns:CS": NS.CS
          }); // Depth 1: include calendar-home member
          if (depth === "1") {
            chHref = buildResourceUrl(config, ["calendars", parsed.userId]);
            chProps = buildCalendarHomeProps(ctx.user, config);
            chResp = buildResponse(chHref + "/", buildPropstat(chProps, "HTTP/1.1 200 OK"));
            body = xmlHeader() + xmlTag("D:multistatus", _resp + chResp, {
              "xmlns:D": NS.DAV,
              "xmlns:C": NS.CALDAV,
              "xmlns:CS": NS.CS
            });
          }
          return _context2.a(2, {
            status: 207,
            headers: {
              "Content-Type": "text/xml; charset=utf-8"
            },
            body: body
          });
        case 4:
          if (parsed.userId) {
            _context2.n = 5;
            break;
          }
          return _context2.a(2, {
            status: 404,
            headers: {}
          });
        case 5:
          _href2 = buildResourceUrl(config, ["calendars", parsed.userId]);
          _props2 = buildCalendarHomeProps(ctx.user, config);
          _resp2 = buildResponse(_href2 + "/", buildPropstat(_props2, "HTTP/1.1 200 OK"));
          _body = xmlHeader() + xmlTag("D:multistatus", _resp2, {
            "xmlns:D": NS.DAV,
            "xmlns:C": NS.CALDAV,
            "xmlns:CS": NS.CS
          }); // Depth 1: include calendar members
          if (depth === "1") {
            calHref = buildResourceUrl(config, ["calendars", parsed.userId, "default"]);
            calProps = buildCalendarProps(ctx.user, config, "default");
            calResp = buildResponse(calHref + "/", buildPropstat(calProps, "HTTP/1.1 200 OK"));
            _body = xmlHeader() + xmlTag("D:multistatus", _resp2 + calResp, {
              "xmlns:D": NS.DAV,
              "xmlns:C": NS.CALDAV,
              "xmlns:CS": NS.CS
            });
          }
          return _context2.a(2, {
            status: 207,
            headers: {
              "Content-Type": "text/xml; charset=utf-8"
            },
            body: _body
          });
        case 6:
          if (!(!parsed.userId || !parsed.calendarId)) {
            _context2.n = 7;
            break;
          }
          return _context2.a(2, {
            status: 404,
            headers: {}
          });
        case 7:
          _href3 = buildResourceUrl(config, ["calendars", parsed.userId, parsed.calendarId]);
          _props3 = buildCalendarProps(ctx.user, config, parsed.calendarId);
          _resp3 = buildResponse(_href3 + "/", buildPropstat(_props3, "HTTP/1.1 200 OK"));
          _body2 = xmlHeader() + xmlTag("D:multistatus", _resp3, {
            "xmlns:D": NS.DAV,
            "xmlns:C": NS.CALDAV,
            "xmlns:CS": NS.CS
          }); // Depth 1: include event resources
          if (!(depth === "1")) {
            _context2.n = 9;
            break;
          }
          _context2.n = 8;
          return dbService.getTasksByUserId(ctx.user.id);
        case 8:
          tasks = _context2.v;
          eventResponses = [];
          _iterator2 = _createForOfIteratorHelper(tasks);
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              task = _step2.value;
              eventHref = buildResourceUrl(config, ["calendars", parsed.userId, parsed.calendarId, "".concat(task.id, ".ics")]);
              eventProps = buildEventProps(task);
              eventResponses.push(buildResponse(eventHref, buildPropstat(eventProps, "HTTP/1.1 200 OK")));
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          _body2 = xmlHeader() + xmlTag("D:multistatus", _resp3 + eventResponses.join(""), {
            "xmlns:D": NS.DAV,
            "xmlns:C": NS.CALDAV,
            "xmlns:CS": NS.CS
          });
        case 9:
          return _context2.a(2, {
            status: 207,
            headers: {
              "Content-Type": "text/xml; charset=utf-8"
            },
            body: _body2
          });
        case 10:
          if (!(!parsed.userId || !parsed.calendarId || !parsed.eventUid)) {
            _context2.n = 11;
            break;
          }
          return _context2.a(2, {
            status: 404,
            headers: {}
          });
        case 11:
          _context2.p = 11;
          _context2.n = 12;
          return dbService.getTaskById(parsed.eventUid);
        case 12:
          _task = _context2.v;
          if (_task) {
            _context2.n = 13;
            break;
          }
          return _context2.a(2, {
            status: 404,
            headers: {}
          });
        case 13:
          _eventHref = buildResourceUrl(config, ["calendars", parsed.userId, parsed.calendarId, "".concat(parsed.eventUid, ".ics")]);
          _eventProps = buildEventProps(_task);
          _resp4 = buildResponse(_eventHref, buildPropstat(_eventProps, "HTTP/1.1 200 OK"));
          return _context2.a(2, {
            status: 207,
            headers: {
              "Content-Type": "text/xml; charset=utf-8"
            },
            body: xmlHeader() + xmlTag("D:multistatus", _resp4, {
              "xmlns:D": NS.DAV
            })
          });
        case 14:
          _context2.p = 14;
          _t2 = _context2.v;
          return _context2.a(2, {
            status: 404,
            headers: {}
          });
        case 15:
          return _context2.a(2, {
            status: 404,
            headers: {}
          });
        case 16:
          return _context2.a(2);
      }
    }, _callee2, null, [[11, 14]]);
  }));
  return _handlePropfind.apply(this, arguments);
}
function handleReport(_x5, _x6) {
  return _handleReport.apply(this, arguments);
}
function _handleReport() {
  _handleReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(ctx, config) {
    var parsed, isCalendarQuery, isCalendarMultiget, tasks, hrefs, uids, allTasks, query, task, _allTasks, rangeStart, rangeEnd, responses, _iterator3, _step3, _task2, eventHref, calEvent, icsData, etag, props, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          parsed = parseCalDavPath(ctx.path);
          if (!(parsed.type !== "calendar" || !parsed.userId || !parsed.calendarId)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, {
            status: 404,
            headers: {}
          });
        case 1:
          // Determine report type
          isCalendarQuery = ctx.body.includes("calendar-query") || ctx.body.includes(":calendar-query");
          isCalendarMultiget = ctx.body.includes("calendar-multiget") || ctx.body.includes(":calendar-multiget");
          if (!isCalendarMultiget) {
            _context3.n = 3;
            break;
          }
          // Extract all hrefs from multiget request
          hrefs = extractAllXmlTags(ctx.body, "href");
          uids = hrefs.map(function (h) {
            var parts = h.split("/");
            var last = parts[parts.length - 1];
            return last.replace(/\.ics$/i, "");
          }).filter(Boolean);
          _context3.n = 2;
          return dbService.getTasksByUserId(ctx.user.id);
        case 2:
          allTasks = _context3.v;
          tasks = allTasks.filter(function (t) {
            return uids.includes(t.id);
          });
          _context3.n = 12;
          break;
        case 3:
          if (!isCalendarQuery) {
            _context3.n = 11;
            break;
          }
          query = parseCalendarQuery(ctx.body);
          if (!query.filterUid) {
            _context3.n = 8;
            break;
          }
          _context3.p = 4;
          _context3.n = 5;
          return dbService.getTaskById(query.filterUid);
        case 5:
          task = _context3.v;
          tasks = task ? [task] : [];
          _context3.n = 7;
          break;
        case 6:
          _context3.p = 6;
          _t3 = _context3.v;
          tasks = [];
        case 7:
          _context3.n = 10;
          break;
        case 8:
          _context3.n = 9;
          return dbService.getTasksByUserId(ctx.user.id);
        case 9:
          _allTasks = _context3.v;
          if (query.timeRange) {
            rangeStart = parseCalDavDate(query.timeRange.start);
            rangeEnd = parseCalDavDate(query.timeRange.end);
            tasks = _allTasks.filter(function (t) {
              return t.startTime < rangeEnd && t.endTime > rangeStart;
            });
          } else {
            tasks = _allTasks;
          }
        case 10:
          _context3.n = 12;
          break;
        case 11:
          return _context3.a(2, {
            status: 403,
            headers: {}
          });
        case 12:
          // Build multistatus response with event data
          responses = [];
          _iterator3 = _createForOfIteratorHelper(tasks);
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              _task2 = _step3.value;
              eventHref = buildResourceUrl(config, ["calendars", parsed.userId, parsed.calendarId, "".concat(_task2.id, ".ics")]);
              calEvent = taskToCalendarEvent(_task2);
              icsData = buildIcs(calEvent, _task2.id);
              etag = "\"".concat(_task2.id, "-").concat(_task2.startTime, "-").concat(_task2.endTime, "\"").replace(/[^ -~]/g, "");
              props = [xmlTag("D:getetag", etag), xmlTag("C:calendar-data", xmlEscape(icsData))].join("");
              responses.push(buildResponse(eventHref, buildPropstat(props, "HTTP/1.1 200 OK")));
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          return _context3.a(2, {
            status: 207,
            headers: {
              "Content-Type": "text/xml; charset=utf-8"
            },
            body: xmlHeader() + xmlTag("D:multistatus", responses.join(""), {
              "xmlns:D": NS.DAV,
              "xmlns:C": NS.CALDAV,
              "xmlns:CS": NS.CS
            })
          });
      }
    }, _callee3, null, [[4, 6]]);
  }));
  return _handleReport.apply(this, arguments);
}
function handleGet(_x7, _x8) {
  return _handleGet.apply(this, arguments);
}
function _handleGet() {
  _handleGet = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(ctx, config) {
    var parsed, task, calEvent, icsData, etag, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          parsed = parseCalDavPath(ctx.path);
          if (!(parsed.type === "calendar" && parsed.userId && parsed.calendarId)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8"
            },
            body: "<html><body><h1>Calendar: ".concat(parsed.calendarId, "</h1><p>Use a CalDAV client to access this resource.</p></body></html>")
          });
        case 1:
          if (!(parsed.type === "event" && parsed.userId && parsed.eventUid)) {
            _context4.n = 6;
            break;
          }
          _context4.p = 2;
          _context4.n = 3;
          return dbService.getTaskById(parsed.eventUid);
        case 3:
          task = _context4.v;
          if (task) {
            _context4.n = 4;
            break;
          }
          return _context4.a(2, {
            status: 404,
            headers: {}
          });
        case 4:
          calEvent = taskToCalendarEvent(task);
          icsData = buildIcs(calEvent, task.id);
          etag = "\"".concat(task.id, "-").concat(task.startTime, "-").concat(task.endTime, "\"").replace(/[^ -~]/g, "");
          return _context4.a(2, {
            status: 200,
            headers: {
              "Content-Type": "text/calendar; charset=utf-8",
              ETag: etag
            },
            body: icsData
          });
        case 5:
          _context4.p = 5;
          _t4 = _context4.v;
          return _context4.a(2, {
            status: 404,
            headers: {}
          });
        case 6:
          return _context4.a(2, {
            status: 404,
            headers: {}
          });
      }
    }, _callee4, null, [[2, 5]]);
  }));
  return _handleGet.apply(this, arguments);
}
function handlePut(_x9, _x0) {
  return _handlePut.apply(this, arguments);
}
function _handlePut() {
  _handlePut = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(ctx, config) {
    var parsed, calEvent, effectiveUid, existingTask, updatedTask, newTask, etag, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          parsed = parseCalDavPath(ctx.path);
          if (!(parsed.type !== "event" || !parsed.userId || !parsed.calendarId || !parsed.eventUid)) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, {
            status: 404,
            headers: {}
          });
        case 1:
          if (ctx.body) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, {
            status: 400,
            headers: {}
          });
        case 2:
          calEvent = parseIcsEvent(ctx.body);
          if (calEvent) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, {
            status: 400,
            headers: {
              "Content-Type": "text/plain"
            },
            body: "Invalid iCalendar data"
          });
        case 3:
          // Use the UID from the path or from the ICS (path takes precedence)
          effectiveUid = parsed.eventUid;
          calEvent.uid = effectiveUid;
          _context5.p = 4;
          _context5.n = 5;
          return dbService.getTaskById(effectiveUid);
        case 5:
          existingTask = _context5.v;
          if (!existingTask) {
            _context5.n = 7;
            break;
          }
          // Update existing task
          updatedTask = calendarEventToTask(calEvent, existingTask);
          updatedTask.id = effectiveUid;
          _context5.n = 6;
          return dbService.patchTask(ctx.user.id, effectiveUid, updatedTask, !!ctx.user.conflictBoundaryInclusive, true);
        case 6:
          _context5.n = 8;
          break;
        case 7:
          // Create new task
          newTask = calendarEventToTask(calEvent, undefined, ctx.user.id);
          newTask.id = effectiveUid;
          _context5.n = 8;
          return dbService.addTask(ctx.user.id, newTask, !!ctx.user.conflictBoundaryInclusive, true);
        case 8:
          etag = "\"".concat(effectiveUid, "-").concat(calEvent.start, "-").concat(calEvent.end, "\"").replace(/[^ -~]/g, "");
          return _context5.a(2, {
            status: existingTask ? 204 : 201,
            headers: {
              ETag: etag
            }
          });
        case 9:
          _context5.p = 9;
          _t5 = _context5.v;
          console.error("CalDAV PUT error:", _t5);
          return _context5.a(2, {
            status: 500,
            headers: {}
          });
      }
    }, _callee5, null, [[4, 9]]);
  }));
  return _handlePut.apply(this, arguments);
}
function handleDelete(_x1, _x10) {
  return _handleDelete.apply(this, arguments);
}
function _handleDelete() {
  _handleDelete = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(ctx, config) {
    var parsed, deleted, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          parsed = parseCalDavPath(ctx.path);
          if (!(parsed.type !== "event" || !parsed.userId || !parsed.eventUid)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, {
            status: 404,
            headers: {}
          });
        case 1:
          _context6.p = 1;
          _context6.n = 2;
          return dbService.deleteTask(parsed.eventUid);
        case 2:
          deleted = _context6.v;
          if (deleted) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, {
            status: 404,
            headers: {}
          });
        case 3:
          return _context6.a(2, {
            status: 204,
            headers: {}
          });
        case 4:
          _context6.p = 4;
          _t6 = _context6.v;
          return _context6.a(2, {
            status: 500,
            headers: {}
          });
      }
    }, _callee6, null, [[1, 4]]);
  }));
  return _handleDelete.apply(this, arguments);
}
function handleMkcalendar(_x11, _x12) {
  return _handleMkcalendar.apply(this, arguments);
} // ── Date parsing helper ────────────────────────────────────────────
function _handleMkcalendar() {
  _handleMkcalendar = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(ctx, config) {
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          return _context7.a(2, {
            status: 201,
            headers: {}
          });
      }
    }, _callee7);
  }));
  return _handleMkcalendar.apply(this, arguments);
}
function parseCalDavDate(dateStr) {
  // CalDAV dates look like: 20260501T000000Z
  var match = dateStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (match) {
    return "".concat(match[1], "-").concat(match[2], "-").concat(match[3], "T").concat(match[4], ":").concat(match[5], ":").concat(match[6], "Z");
  }
  return dateStr;
}

// ── Main dispatcher ────────────────────────────────────────────────

export function handleCalDavRequest(_x13, _x14) {
  return _handleCalDavRequest.apply(this, arguments);
}
function _handleCalDavRequest() {
  _handleCalDavRequest = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(ctx, config) {
    var method, _t7;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          method = ctx.method.toUpperCase();
          _t7 = method;
          _context8.n = _t7 === "OPTIONS" ? 1 : _t7 === "PROPFIND" ? 2 : _t7 === "REPORT" ? 3 : _t7 === "GET" ? 4 : _t7 === "HEAD" ? 4 : _t7 === "PUT" ? 5 : _t7 === "DELETE" ? 6 : _t7 === "MKCALENDAR" ? 7 : _t7 === "MKCOL" ? 7 : 8;
          break;
        case 1:
          return _context8.a(2, handleOptions(ctx, config));
        case 2:
          return _context8.a(2, handlePropfind(ctx, config));
        case 3:
          return _context8.a(2, handleReport(ctx, config));
        case 4:
          return _context8.a(2, handleGet(ctx, config));
        case 5:
          return _context8.a(2, handlePut(ctx, config));
        case 6:
          return _context8.a(2, handleDelete(ctx, config));
        case 7:
          return _context8.a(2, handleMkcalendar(ctx, config));
        case 8:
          return _context8.a(2, {
            status: 405,
            headers: {
              Allow: "OPTIONS, GET, HEAD, PROPFIND, REPORT, PUT, DELETE, MKCALENDAR"
            }
          });
        case 9:
          return _context8.a(2);
      }
    }, _callee8);
  }));
  return _handleCalDavRequest.apply(this, arguments);
}