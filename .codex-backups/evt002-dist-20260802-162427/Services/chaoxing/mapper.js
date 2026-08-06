function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * 爬虫结果 → 统一条目；有 start_at → 日程，无 → 待办
 */
import { createHash } from "crypto";
function normTitle(s) {
  return String(s || "").trim().replace(/\s+/g, " ");
}
function hasStart(startAt) {
  if (startAt == null || startAt === "") return false;
  var t = Date.parse(String(startAt));
  return !Number.isNaN(t);
}
var COMPLETED_RE = /已完成|已交|已提交|已互评|已批阅|待批阅|已过期|已结束|完成/;
export function isCompletedStatus(statusText) {
  if (!statusText) return false;
  // 未交 / 未完成 优先
  if (/未交|未完成|待互评|进行中/.test(statusText)) return false;
  return COMPLETED_RE.test(statusText);
}
export function remoteKeyForWork(courseId, classId, taskId, title) {
  var id = taskId || normTitle(title);
  return "work:".concat(courseId || "", ":").concat(classId || "", ":").concat(id);
}
export function remoteKeyForExam(courseId, classId, taskId, title) {
  var id = taskId || normTitle(title);
  return "exam:".concat(courseId || "", ":").concat(classId || "", ":").concat(id);
}
export function remoteKeyForNotice(noticeId) {
  return "notice:".concat(noticeId);
}
function fingerprint(parts) {
  return createHash("sha1").update(JSON.stringify(parts)).digest("hex").slice(0, 16);
}
function buildName(prefix, courseName, title) {
  var t = normTitle(title) || "未命名";
  var c = courseName ? normTitle(courseName) : "";
  if (c) return "[".concat(prefix, "][").concat(c, "] ").concat(t);
  return "[".concat(prefix, "] ").concat(t);
}
function buildDesc(opts) {
  var lines = ["来源：学习通"];
  if (opts.courseName) lines.push("\u8BFE\u7A0B\uFF1A".concat(opts.courseName));
  if (opts.statusText) lines.push("\u72B6\u6001\uFF1A".concat(opts.statusText));
  if (opts.url) lines.push("\u94FE\u63A5\uFF1A".concat(opts.url));
  if (opts.extra) lines.push(opts.extra);
  return lines.join("\n");
}
function toItem(opts) {
  var target = hasStart(opts.startAt) ? "task" : "todo";
  return {
    remoteKey: opts.remoteKey,
    kind: opts.kind,
    target: target,
    name: opts.name,
    description: opts.description,
    startAt: opts.startAt,
    endAt: opts.endAt,
    completed: isCompletedStatus(opts.statusText),
    fingerprint: fingerprint({
      name: opts.name,
      start: opts.startAt,
      end: opts.endAt,
      status: opts.statusText,
      target: target
    }),
    courseName: opts.courseName,
    statusText: opts.statusText,
    url: opts.url
  };
}

/** 从爬虫 result JSON 抽出全部可同步条目 */
export function mapCrawlResultToItems(result) {
  var items = [];
  var courses = Array.isArray(result === null || result === void 0 ? void 0 : result.courses) ? result.courses : [];
  var _iterator = _createForOfIteratorHelper(courses),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var block = _step.value;
      var course = (block === null || block === void 0 ? void 0 : block.course) || {};
      var courseId = String(course.course_id || "");
      var classId = String(course.class_id || "");
      var courseName = course.name ? String(course.name) : undefined;
      var _iterator3 = _createForOfIteratorHelper((block === null || block === void 0 ? void 0 : block.works) || []),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var w = _step3.value;
          var title = String(w.title || "作业");
          var startAt = w.start_at ? String(w.start_at) : null;
          var endAt = w.end_at ? String(w.end_at) : null;
          items.push(toItem({
            kind: "work",
            remoteKey: remoteKeyForWork(courseId, classId, w.task_id, title),
            name: buildName("作业", courseName, title),
            description: buildDesc({
              courseName: courseName,
              statusText: w.status_text,
              url: w.url
            }),
            startAt: startAt,
            endAt: endAt,
            statusText: w.status_text,
            courseName: courseName,
            url: w.url
          }));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var _iterator4 = _createForOfIteratorHelper((block === null || block === void 0 ? void 0 : block.exams) || []),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var e = _step4.value;
          var _title = String(e.title || "考试");
          var _startAt = e.start_at ? String(e.start_at) : null;
          var _endAt = e.end_at ? String(e.end_at) : null;
          items.push(toItem({
            kind: "exam",
            remoteKey: remoteKeyForExam(courseId, classId, e.task_id, _title),
            name: buildName("考试", courseName, _title),
            description: buildDesc({
              courseName: courseName,
              statusText: e.status_text,
              url: e.url
            }),
            startAt: _startAt,
            endAt: _endAt,
            statusText: e.status_text,
            courseName: courseName,
            url: e.url
          }));
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var _iterator2 = _createForOfIteratorHelper((result === null || result === void 0 ? void 0 : result.notices) || []),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var n = _step2.value;
      var noticeId = String(n.notice_id || normTitle(n.title || "") || "unknown");
      var _title2 = String(n.title || "通知");
      var task = n.task;
      var _startAt2 = null;
      var _endAt2 = null;
      var url = n.url || null;
      var statusText = null;
      if (task) {
        _startAt2 = task.start_at ? String(task.start_at) : null;
        _endAt2 = task.end_at ? String(task.end_at) : null;
        url = task.url || url;
        statusText = task.status_text || null;
      }
      // notice 本身无 start；仅当内嵌 task 有 start 才进日程
      if (!_startAt2 && n.sent_at && !_endAt2) {
        // 无截止时不把 sent_at 当 start
        _endAt2 = null;
      }
      var _courseName = n.course_name ? String(n.course_name) : undefined;
      items.push(toItem({
        kind: "notice",
        remoteKey: remoteKeyForNotice(noticeId),
        name: buildName("通知", _courseName, _title2),
        description: buildDesc({
          courseName: _courseName,
          statusText: statusText,
          url: url,
          extra: n.content ? String(n.content).slice(0, 500) : null
        }),
        startAt: _startAt2,
        endAt: _endAt2 || (n.sent_at ? String(n.sent_at) : null),
        statusText: statusText,
        courseName: _courseName,
        url: url
      }));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return items;
}
export function stableTaskId(userId, remoteKey) {
  var h = createHash("sha1").update("".concat(userId, ":").concat(remoteKey)).digest("hex").slice(0, 24);
  return "chaoxing_".concat(h);
}
export function defaultEndFromStart(startIso) {
  var t = Date.parse(startIso);
  if (Number.isNaN(t)) return startIso;
  return new Date(t + 60 * 60 * 1000).toISOString();
}