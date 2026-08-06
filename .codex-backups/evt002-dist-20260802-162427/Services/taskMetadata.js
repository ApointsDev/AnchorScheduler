var MAX_REMINDER_MINUTES = 366 * 24 * 60;
var ANCHOR_SUFFIX = /(?:\r?\n)?\[Anchor[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+((?:[\0-\\\^-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)\][\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/;
var EMPTY_REMINDERS = new Set(["", "无", "none", "不提醒", "无提醒"]);
function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}
function optionalText(value) {
  if (value === null || value === undefined) return undefined;
  var normalized = String(value).trim();
  return normalized || undefined;
}
export function normalizeReminderMinutes(value) {
  if (value === null || value === undefined || value === "") return null;
  var minutes = Number(value);
  if (!Number.isFinite(minutes) || !Number.isInteger(minutes) || minutes < 0 || minutes > MAX_REMINDER_MINUTES) {
    throw new TypeError("reminderMinutesBefore must be an integer between 0 and ".concat(MAX_REMINDER_MINUTES));
  }
  return minutes;
}
export function normalizeAttachments(value) {
  if (value === null || value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new TypeError("attachments must be an array of strings");
  }
  var attachments = value.map(optionalText).filter(function (item) {
    return !!item;
  });
  if (attachments.length > 50) {
    throw new TypeError("attachments cannot contain more than 50 items");
  }
  return Array.from(new Set(attachments));
}

/**
 * Normalizes the structured schedule fields at the API/store boundary.
 * The reminder lead is canonical; reminderAt is derived when data is read.
 */
export function resolveTaskMetadata(input, fallback) {
  var _fallback$reminderMin, _fallback$isReminderO, _fallback$allDay, _fallback$attachments;
  var eventTypeValue = hasOwn(input, "eventType") ? input.eventType : fallback === null || fallback === void 0 ? void 0 : fallback.eventType;
  if (eventTypeValue !== undefined && eventTypeValue !== "schedule" && eventTypeValue !== "todo") {
    throw new TypeError("eventType must be schedule or todo");
  }
  var minutesProvided = hasOwn(input, "reminderMinutesBefore");
  var reminderEnabledProvided = hasOwn(input, "isReminderOn");
  var reminderMinutesBefore = minutesProvided ? normalizeReminderMinutes(input.reminderMinutesBefore) : (_fallback$reminderMin = fallback === null || fallback === void 0 ? void 0 : fallback.reminderMinutesBefore) !== null && _fallback$reminderMin !== void 0 ? _fallback$reminderMin : null;
  var isReminderOn = reminderEnabledProvided ? input.isReminderOn === true : (_fallback$isReminderO = fallback === null || fallback === void 0 ? void 0 : fallback.isReminderOn) !== null && _fallback$isReminderO !== void 0 ? _fallback$isReminderO : false;
  if (reminderEnabledProvided && typeof input.isReminderOn !== "boolean") {
    throw new TypeError("isReminderOn must be a boolean");
  }
  if (minutesProvided && reminderMinutesBefore !== null) isReminderOn = true;
  if (!isReminderOn) reminderMinutesBefore = null;
  if (isReminderOn && reminderMinutesBefore === null) {
    reminderMinutesBefore = 0;
  }
  return {
    eventType: eventTypeValue || "schedule",
    category: hasOwn(input, "category") ? optionalText(input.category) : fallback === null || fallback === void 0 ? void 0 : fallback.category,
    allDay: hasOwn(input, "allDay") ? input.allDay === true : (_fallback$allDay = fallback === null || fallback === void 0 ? void 0 : fallback.allDay) !== null && _fallback$allDay !== void 0 ? _fallback$allDay : false,
    isReminderOn: isReminderOn,
    reminderMinutesBefore: reminderMinutesBefore,
    attachments: hasOwn(input, "attachments") ? normalizeAttachments(input.attachments) : (_fallback$attachments = fallback === null || fallback === void 0 ? void 0 : fallback.attachments) !== null && _fallback$attachments !== void 0 ? _fallback$attachments : []
  };
}
export function calculateReminderAt(startTime, isReminderOn, reminderMinutesBefore) {
  if (!isReminderOn || reminderMinutesBefore === null || reminderMinutesBefore === undefined) {
    return null;
  }
  var start = Date.parse(startTime || "");
  if (!Number.isFinite(start)) return null;
  return new Date(start - reminderMinutesBefore * 60000).toISOString();
}
function reminderMinutesFromLegacy(reminder, startTime) {
  var normalized = (reminder === null || reminder === void 0 ? void 0 : reminder.trim().toLocaleLowerCase()) || "";
  if (EMPTY_REMINDERS.has(normalized)) return null;
  if (["开始时", "准时", "at start"].includes(normalized)) return 0;
  var minuteMatch = normalized.match(/^(?:\u63D0\u524D)?([0-9]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:\u5206\u949F|min(?:ute)?s?)?(?:\u524D)?$/);
  if (minuteMatch) return Number(minuteMatch[1]);
  var hourMatch = normalized.match(/^(?:\u63D0\u524D)?([0-9]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:\u5C0F\u65F6|hours?)(?:\u524D)?$/);
  if (hourMatch) return Number(hourMatch[1]) * 60;
  var reminderAt = Date.parse(reminder || "");
  var start = Date.parse(startTime || "");
  if (Number.isFinite(reminderAt) && Number.isFinite(start) && reminderAt <= start) {
    return Math.round((start - reminderAt) / 60000);
  }
  return null;
}

/** Converts the old description suffix once during migration. */
export function parseLegacyTaskMetadata(description, startTime) {
  var source = description || "";
  var match = source.match(ANCHOR_SUFFIX);
  if (!match) return null;
  var segments = match[1].split("|").map(function (segment) {
    return segment.trim();
  }).filter(Boolean);
  var value = function value(prefix) {
    var _segments$find;
    return (_segments$find = segments.find(function (segment) {
      return segment.startsWith(prefix);
    })) === null || _segments$find === void 0 ? void 0 : _segments$find.slice(prefix.length).trim();
  };
  var reminder = value("提醒:");
  var reminderMinutesBefore = reminderMinutesFromLegacy(reminder, startTime);
  var eventType = value("类型:") === "todo" ? "todo" : "schedule";
  var categoryValue = value("分类:");
  var attachmentValue = value("附件:");
  return {
    description: source.slice(0, match.index).trim(),
    metadata: {
      eventType: eventType,
      category: categoryValue && !["默认", "default"].includes(categoryValue.toLocaleLowerCase()) ? categoryValue : undefined,
      allDay: segments.includes("全天事件"),
      isReminderOn: reminderMinutesBefore !== null,
      reminderMinutesBefore: reminderMinutesBefore,
      attachments: attachmentValue ? attachmentValue.split("、").map(function (item) {
        return item.trim();
      }).filter(Boolean) : []
    }
  };
}