function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// 数据库迁移 — 所有 CREATE TABLE 和 ALTER TABLE 操作

import { logger } from "../../Utils/logger.js";
import { parseLegacyTaskMetadata } from "../taskMetadata.js";
export function runMigrations(_x) {
  return _runMigrations.apply(this, arguments);
}
function _runMigrations() {
  _runMigrations = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(db) {
    var alterStatements, _i, _alterStatements, stmt, msg, legacyRows, _iterator, _step, _metadata$reminderMin, _metadata$attachments, row, migrated, metadata, _t, _t2, _t3, _t4, _t5, _t6, _t7;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.n = 1;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS users (\n            id TEXT PRIMARY KEY,\n            email TEXT UNIQUE NOT NULL,\n            name TEXT NOT NULL,\n            XJTLUaccount TEXT,\n            XJTLUPassword TEXT,\n            passwordHash TEXT,\n            JWTtoken TEXT,\n            MStoken TEXT,\n            MSbinded BOOLEAN DEFAULT 0,\n            ebridgeBinded BOOLEAN DEFAULT 0,\n            timetableUrl TEXT DEFAULT '',\n            timetableFetchLevel INTEGER DEFAULT 0,\n            mailReadingSpan INTEGER DEFAULT 30,\n            conflictBoundaryInclusive BOOLEAN DEFAULT 0,\n            MSRefreshToken TEXT,\n            CalDavBaseUrl TEXT,\n            CalDavUsername TEXT,\n            CalDavPassword TEXT,\n            CalDavPrincipalUrl TEXT,\n            CalDavCalendarHome TEXT,\n            CalDavCalendarUrl TEXT,\n            CalDavSyncToken TEXT,\n            CalDavEnabled BOOLEAN DEFAULT 0,\n            CalDavLastSyncAt DATETIME,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n    ");
        case 1:
          _context.n = 2;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS schedule_queue (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            rawRequest TEXT NOT NULL,\n            status TEXT DEFAULT 'pending',\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n    ");
        case 2:
          _context.n = 3;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS chat_history (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            messages TEXT NOT NULL,\n            title TEXT NOT NULL DEFAULT '\u65B0\u5BF9\u8BDD',\n            isActive INTEGER DEFAULT 1,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n    ");
        case 3:
          _context.n = 4;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS tasks (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            description TEXT,\n            dueDate TEXT,\n            startTime TEXT,\n            endTime TEXT,\n            location TEXT,\n            completed BOOLEAN DEFAULT 0,\n            pushedToMSTodo BOOLEAN DEFAULT 0,\n            body TEXT,\n            attendees TEXT,\n            recurrenceRule TEXT,\n            parentTaskId TEXT,\n            importance TEXT DEFAULT 'normal',\n            eventType TEXT DEFAULT 'schedule',\n            category TEXT,\n            allDay BOOLEAN DEFAULT 0,\n            isReminderOn BOOLEAN DEFAULT 0,\n            reminderMinutesBefore INTEGER,\n            attachments TEXT,\n            scheduleType TEXT DEFAULT 'single',\n            quadrant TEXT,\n            importanceScore REAL,\n            urgencyScore REAL,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 4:
          _context.n = 5;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS user_logs (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            time DATETIME DEFAULT CURRENT_TIMESTAMP,\n            type TEXT NOT NULL,\n            message TEXT NOT NULL,\n            payload TEXT,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 5:
          _context.n = 6;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS calendar_event_map (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            provider TEXT NOT NULL,\n            localTaskId TEXT NOT NULL,\n            remoteUid TEXT,\n            remoteHref TEXT,\n            remoteEtag TEXT,\n            calendarUrl TEXT,\n            rawData TEXT,\n            lastSyncAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 6:
          _context.n = 7;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_calendar_event_map_user ON calendar_event_map(userId);");
        case 7:
          _context.n = 8;
          return db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_event_map_provider_remote ON calendar_event_map(provider, remoteUid, userId);");
        case 8:
          _context.n = 9;
          return db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_event_map_provider_local ON calendar_event_map(provider, localTaskId);");
        case 9:
          _context.n = 10;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS shared_schedules (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            token TEXT UNIQUE NOT NULL,\n            name TEXT NOT NULL DEFAULT '',\n            dateStart TEXT,\n            dateEnd TEXT,\n            taskIds TEXT,\n            expiresAt TEXT,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 10:
          _context.n = 11;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_shared_schedules_token ON shared_schedules(token);");
        case 11:
          _context.n = 12;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_shared_schedules_user ON shared_schedules(userId);");
        case 12:
          _context.n = 13;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS ai_processed_emails (\n            userId TEXT NOT NULL,\n            emailId TEXT NOT NULL,\n            provider TEXT NOT NULL DEFAULT 'imap',\n            processedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (userId, emailId, provider),\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 13:
          _context.n = 14;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_ai_processed_user ON ai_processed_emails(userId);");
        case 14:
          _context.n = 15;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS todos (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            description TEXT,\n            completed BOOLEAN DEFAULT 0,\n            dueDate TEXT,\n            importance TEXT DEFAULT 'normal',\n            importanceScore REAL,\n            urgencyScore REAL,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 15:
          _context.n = 16;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_todos_user ON todos(userId);");
        case 16:
          _context.n = 17;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_todos_user_completed ON todos(userId, completed);");
        case 17:
          _context.n = 18;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_todos_user_due ON todos(userId, dueDate);");
        case 18:
          _context.n = 19;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS tags (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            name TEXT NOT NULL,\n            color TEXT,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,\n            UNIQUE(userId, name)\n        );\n    ");
        case 19:
          _context.n = 20;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_tags_user ON tags(userId);");
        case 20:
          _context.n = 21;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS todo_tags (\n            todoId TEXT NOT NULL,\n            tagId TEXT NOT NULL,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (todoId, tagId),\n            FOREIGN KEY (todoId) REFERENCES todos(id) ON DELETE CASCADE,\n            FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE\n        );\n    ");
        case 21:
          _context.n = 22;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_todo_tags_tag ON todo_tags(tagId);");
        case 22:
          _context.n = 23;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_todo_tags_todo ON todo_tags(todoId);");
        case 23:
          _context.n = 24;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS todo_queue (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            rawRequest TEXT NOT NULL,\n            status TEXT DEFAULT 'pending',\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n    ");
        case 24:
          _context.n = 25;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_todo_queue_user ON todo_queue(userId);");
        case 25:
          _context.n = 26;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS user_status (\n            userId TEXT PRIMARY KEY,\n            weekStart TEXT NOT NULL,\n            weekEnd TEXT NOT NULL,\n            completedThisWeek INTEGER NOT NULL DEFAULT 0,\n            incompleteThisWeek INTEGER NOT NULL DEFAULT 0,\n            avgCompleteDurationMs REAL,\n            completionHourMode REAL,\n            modalHours TEXT,\n            completedSampleSize INTEGER NOT NULL DEFAULT 0,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 26:
          _context.n = 27;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS community_regions (\n            id TEXT PRIMARY KEY,\n            name TEXT NOT NULL UNIQUE,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\n        );\n    ");
        case 27:
          _context.n = 28;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS community_rank_entries (\n            weekStart TEXT NOT NULL,\n            regionId TEXT NOT NULL,\n            metric TEXT NOT NULL,\n            userId TEXT NOT NULL,\n            value REAL NOT NULL,\n            rank INTEGER NOT NULL,\n            displayName TEXT,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (weekStart, regionId, metric, userId),\n            FOREIGN KEY (regionId) REFERENCES community_regions(id) ON DELETE CASCADE,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 28:
          _context.n = 29;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_community_rank_lookup\n         ON community_rank_entries(weekStart, regionId, metric, rank);");
        case 29:
          _context.n = 30;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS community_rank_meta (\n            weekStart TEXT NOT NULL,\n            regionId TEXT NOT NULL,\n            metric TEXT NOT NULL,\n            computedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            participantCount INTEGER NOT NULL DEFAULT 0,\n            PRIMARY KEY (weekStart, regionId, metric),\n            FOREIGN KEY (regionId) REFERENCES community_regions(id) ON DELETE CASCADE\n        );\n    ");
        case 30:
          _context.p = 30;
          _context.n = 31;
          return db.run("INSERT OR IGNORE INTO community_regions (id, name) VALUES (?, ?)", ["region-xjtlu", "西交利物浦大学"]);
        case 31:
          _context.n = 33;
          break;
        case 32:
          _context.p = 32;
          _t = _context.v;
          logger.info("default community region seed skipped:", _t.message);
        case 33:
          _context.n = 34;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS rejection_buffer (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            kind TEXT NOT NULL,\n            sourceQueueId TEXT,\n            rawRequest TEXT NOT NULL,\n            rejectedAt TEXT NOT NULL,\n            expiresAt TEXT NOT NULL,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 34:
          _context.n = 35;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_rejection_buffer_user_kind_rejected\n         ON rejection_buffer(userId, kind, rejectedAt);");
        case 35:
          _context.n = 36;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_rejection_buffer_expires\n         ON rejection_buffer(expiresAt);");
        case 36:
          _context.n = 37;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS reminder_sync_versions (\n            userId TEXT PRIMARY KEY,\n            version INTEGER NOT NULL DEFAULT 0,\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 37:
          _context.n = 38;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS reminder_states (\n            userId TEXT NOT NULL,\n            reminderId TEXT NOT NULL,\n            kind TEXT NOT NULL,\n            sourceId TEXT NOT NULL,\n            triggeredAt INTEGER NOT NULL,\n            status TEXT NOT NULL,\n            clientUpdatedAt INTEGER NOT NULL,\n            version INTEGER NOT NULL,\n            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (userId, reminderId),\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,\n            CHECK (kind IN ('schedule_start', 'todo_start', 'todo_deadline')),\n            CHECK (status IN ('unread', 'read', 'dismissed'))\n        );\n    ");
        case 38:
          _context.n = 39;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_reminder_states_user_version\n         ON reminder_states(userId, version);");
        case 39:
          // ── ALTER TABLE 增量迁移 ──
          alterStatements = ["ALTER TABLE chat_history ADD COLUMN title TEXT NOT NULL DEFAULT '\u5386\u53F2\u5BF9\u8BDD'", "ALTER TABLE chat_history ADD COLUMN isActive INTEGER DEFAULT 0", "ALTER TABLE chat_history ADD COLUMN createdAt DATETIME", "UPDATE chat_history SET createdAt = updatedAt WHERE createdAt IS NULL", "ALTER TABLE users ADD COLUMN ExchangeBinded BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN ExchangeAccessToken TEXT", "ALTER TABLE users ADD COLUMN ExchangeRefreshToken TEXT", "ALTER TABLE users ADD COLUMN ExchangeTokenExpiresAt INTEGER", "ALTER TABLE users ADD COLUMN CAFSub TEXT", "ALTER TABLE users ADD COLUMN CAFAccessToken TEXT", "ALTER TABLE users ADD COLUMN CAFTokenExpiresAt INTEGER", "ALTER TABLE users ADD COLUMN CAFRefreshToken TEXT", "ALTER TABLE users ADD COLUMN ImapHost TEXT", "ALTER TABLE users ADD COLUMN ImapPort INTEGER", "ALTER TABLE users ADD COLUMN ImapBinded BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN ImapEmail TEXT", "ALTER TABLE users ADD COLUMN ImapPassword TEXT", "ALTER TABLE users ADD COLUMN ImapTls BOOLEAN DEFAULT 1", "ALTER TABLE users ADD COLUMN XJTLUaccount TEXT", "ALTER TABLE users ADD COLUMN timetableUrl TEXT DEFAULT ''", "ALTER TABLE users ADD COLUMN timetableFetchLevel INTEGER DEFAULT 0", "ALTER TABLE users ADD COLUMN mailReadingSpan INTEGER DEFAULT 30", "ALTER TABLE users ADD COLUMN conflictBoundaryInclusive BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN highEnergyPeriods TEXT DEFAULT '[]'", "ALTER TABLE users ADD COLUMN weekOffset INTEGER DEFAULT 0", "ALTER TABLE users ADD COLUMN MSRefreshToken TEXT", "ALTER TABLE users ADD COLUMN CalDavBaseUrl TEXT", "ALTER TABLE users ADD COLUMN CalDavUsername TEXT", "ALTER TABLE users ADD COLUMN CalDavPassword TEXT", "ALTER TABLE users ADD COLUMN CalDavPrincipalUrl TEXT", "ALTER TABLE users ADD COLUMN CalDavCalendarHome TEXT", "ALTER TABLE users ADD COLUMN CalDavCalendarUrl TEXT", "ALTER TABLE users ADD COLUMN CalDavSyncToken TEXT", "ALTER TABLE users ADD COLUMN CalDavEnabled BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN CalDavLastSyncAt DATETIME", "ALTER TABLE users ADD COLUMN CalDavServerEnabled BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN CalDavClientProfile TEXT DEFAULT 'auto'", "ALTER TABLE users ADD COLUMN autoSchedulePromotions BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN stripReplyPrefix BOOLEAN DEFAULT 1", "ALTER TABLE users ADD COLUMN SmtpBinded BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN SmtpEmail TEXT", "ALTER TABLE users ADD COLUMN SmtpPassword TEXT", "ALTER TABLE users ADD COLUMN SmtpHost TEXT", "ALTER TABLE users ADD COLUMN SmtpPort INTEGER", "ALTER TABLE users ADD COLUMN SmtpTls BOOLEAN DEFAULT 1", "ALTER TABLE tasks ADD COLUMN recurrenceRule TEXT", "ALTER TABLE tasks ADD COLUMN parentTaskId TEXT", "ALTER TABLE tasks ADD COLUMN importance TEXT DEFAULT 'normal'", "ALTER TABLE tasks ADD COLUMN scheduleType TEXT DEFAULT 'single'", "ALTER TABLE tasks ADD COLUMN quadrant TEXT", "ALTER TABLE tasks ADD COLUMN completedAt TEXT", "ALTER TABLE tasks ADD COLUMN importanceScore REAL", "ALTER TABLE tasks ADD COLUMN urgencyScore REAL", "ALTER TABLE tasks ADD COLUMN eventType TEXT DEFAULT 'schedule'", "ALTER TABLE tasks ADD COLUMN category TEXT", "ALTER TABLE tasks ADD COLUMN allDay BOOLEAN DEFAULT 0", "ALTER TABLE tasks ADD COLUMN isReminderOn BOOLEAN DEFAULT 0", "ALTER TABLE tasks ADD COLUMN reminderMinutesBefore INTEGER", "ALTER TABLE tasks ADD COLUMN attachments TEXT", "ALTER TABLE todos ADD COLUMN importanceScore REAL", "ALTER TABLE todos ADD COLUMN urgencyScore REAL", "ALTER TABLE users ADD COLUMN onboardingCompleted BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN communityRegionId TEXT", "ALTER TABLE users ADD COLUMN avatar TEXT", "ALTER TABLE users ADD COLUMN signature TEXT", // Chaoxing / 学习通
          "ALTER TABLE users ADD COLUMN ChaoxingBinded BOOLEAN DEFAULT 0", "ALTER TABLE users ADD COLUMN ChaoxingUsername TEXT", "ALTER TABLE users ADD COLUMN ChaoxingPassword TEXT", "ALTER TABLE users ADD COLUMN ChaoxingAccountId TEXT", "ALTER TABLE users ADD COLUMN ChaoxingIntervalHours INTEGER DEFAULT 24", "ALTER TABLE users ADD COLUMN ChaoxingPreferredHour INTEGER DEFAULT 8", "ALTER TABLE users ADD COLUMN ChaoxingEnabled BOOLEAN DEFAULT 1", "ALTER TABLE users ADD COLUMN ChaoxingLastSyncAt TEXT", "ALTER TABLE users ADD COLUMN ChaoxingNextSyncAt TEXT", "ALTER TABLE users ADD COLUMN ChaoxingLastJobId TEXT", "ALTER TABLE users ADD COLUMN ChaoxingLastStatus TEXT", "ALTER TABLE users ADD COLUMN ChaoxingLastError TEXT", // 日程可见性
          "ALTER TABLE tasks ADD COLUMN visibility TEXT DEFAULT 'private'", "ALTER TABLE tasks ADD COLUMN authorizedUserIds TEXT", "ALTER TABLE tasks ADD COLUMN blockedUserIds TEXT"]; // ── 用户关注关系表 ──
          _context.n = 40;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS user_follows (\n            followerId TEXT NOT NULL,\n            followedId TEXT NOT NULL,\n            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\n            PRIMARY KEY (followerId, followedId),\n            FOREIGN KEY (followerId) REFERENCES users(id) ON DELETE CASCADE,\n            FOREIGN KEY (followedId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 40:
          _context.n = 41;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(followerId);");
        case 41:
          _context.n = 42;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_user_follows_followed ON user_follows(followedId);");
        case 42:
          _context.n = 43;
          return db.exec("\n        CREATE TABLE IF NOT EXISTS chaoxing_item_map (\n            id TEXT PRIMARY KEY,\n            userId TEXT NOT NULL,\n            remoteKey TEXT NOT NULL,\n            kind TEXT NOT NULL,\n            target TEXT NOT NULL,\n            localTodoId TEXT,\n            localTaskId TEXT,\n            fingerprint TEXT,\n            lastSeenAt TEXT NOT NULL,\n            createdAt TEXT NOT NULL,\n            updatedAt TEXT NOT NULL,\n            UNIQUE(userId, remoteKey),\n            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE\n        );\n    ");
        case 43:
          _context.p = 43;
          _context.n = 44;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_chaoxing_item_map_user\n             ON chaoxing_item_map(userId);");
        case 44:
          _context.n = 46;
          break;
        case 45:
          _context.p = 45;
          _t2 = _context.v;
        case 46:
          _context.p = 46;
          _context.n = 47;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_user_completed_at ON tasks(userId, completedAt);");
        case 47:
          _context.n = 48;
          return db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_user_week_range ON tasks(userId, startTime, endTime);");
        case 48:
          _context.n = 50;
          break;
        case 49:
          _context.p = 49;
          _t3 = _context.v;
          logger.info("user status indexes skipped or failed:", _t3.message);
        case 50:
          _i = 0, _alterStatements = alterStatements;
        case 51:
          if (!(_i < _alterStatements.length)) {
            _context.n = 56;
            break;
          }
          stmt = _alterStatements[_i];
          _context.p = 52;
          _context.n = 53;
          return db.exec(stmt);
        case 53:
          _context.n = 55;
          break;
        case 54:
          _context.p = 54;
          _t4 = _context.v;
          msg = _t4.message; // 只对 ALTER/DML 做日志忽略（列已存在等），CREATE INDEX 等已在上方处理
          if (!msg.includes("duplicate column name") && !msg.includes("already exists")) {
            logger.info("Migration note: ".concat(msg));
          }
        case 55:
          _i++;
          _context.n = 51;
          break;
        case 56:
          _context.p = 56;
          _context.n = 57;
          return db.all("SELECT id, description, startTime FROM tasks\n             WHERE description LIKE '%[Anchor %]%'");
        case 57:
          legacyRows = _context.v;
          _iterator = _createForOfIteratorHelper(legacyRows);
          _context.p = 58;
          _iterator.s();
        case 59:
          if ((_step = _iterator.n()).done) {
            _context.n = 62;
            break;
          }
          row = _step.value;
          migrated = parseLegacyTaskMetadata(row.description, row.startTime);
          if (migrated) {
            _context.n = 60;
            break;
          }
          return _context.a(3, 61);
        case 60:
          metadata = migrated.metadata;
          _context.n = 61;
          return db.run("UPDATE tasks\n                 SET description = ?, eventType = ?, category = ?, allDay = ?,\n                     isReminderOn = ?, reminderMinutesBefore = ?, attachments = ?\n                 WHERE id = ?", [migrated.description, metadata.eventType, metadata.category || null, metadata.allDay ? 1 : 0, metadata.isReminderOn ? 1 : 0, (_metadata$reminderMin = metadata.reminderMinutesBefore) !== null && _metadata$reminderMin !== void 0 ? _metadata$reminderMin : null, (_metadata$attachments = metadata.attachments) !== null && _metadata$attachments !== void 0 && _metadata$attachments.length ? JSON.stringify(metadata.attachments) : null, row.id]);
        case 61:
          _context.n = 59;
          break;
        case 62:
          _context.n = 64;
          break;
        case 63:
          _context.p = 63;
          _t5 = _context.v;
          _iterator.e(_t5);
        case 64:
          _context.p = 64;
          _iterator.f();
          return _context.f(64);
        case 65:
          if (legacyRows.length > 0) {
            logger.info("Migrated ".concat(legacyRows.length, " legacy task metadata descriptions"));
          }
          _context.n = 67;
          break;
        case 66:
          _context.p = 66;
          _t6 = _context.v;
          logger.info("legacy task metadata backfill skipped or failed:", _t6.message);
        case 67:
          _context.p = 67;
          _context.n = 68;
          return db.run("UPDATE tasks SET scheduleType = 'recurring_daily' WHERE recurrenceRule LIKE '%\"freq\":\"daily\"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')");
        case 68:
          _context.n = 69;
          return db.run("UPDATE tasks SET scheduleType = 'recurring_weekly' WHERE recurrenceRule LIKE '%\"freq\":\"weekly\"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')");
        case 69:
          _context.n = 70;
          return db.run("UPDATE tasks SET scheduleType = 'recurring_weekly_by_week_number' WHERE recurrenceRule LIKE '%\"freq\":\"weeklyByWeekNumber\"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')");
        case 70:
          _context.n = 71;
          return db.run("UPDATE tasks SET scheduleType = 'recurring_daily_on_days' WHERE recurrenceRule LIKE '%\"freq\":\"dailyOnDays\"%' AND (scheduleType IS NULL OR scheduleType = '' OR scheduleType = 'single')");
        case 71:
          _context.n = 73;
          break;
        case 72:
          _context.p = 72;
          _t7 = _context.v;
          logger.info("scheduleType backfill skipped or failed:", _t7.message);
        case 73:
          return _context.a(2);
      }
    }, _callee, null, [[67, 72], [58, 63, 64, 65], [56, 66], [52, 54], [46, 49], [43, 45], [30, 32]]);
  }));
  return _runMigrations.apply(this, arguments);
}
