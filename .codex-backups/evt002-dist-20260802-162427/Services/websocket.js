function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
import { WebSocketServer } from "ws";
import { logger } from "../Utils/logger.js";
import { toShanghaiISO } from "../Utils/time.js";
import jwt from "jsonwebtoken";
var wss = null;
var userProvider = null;
var occurrenceNotified = new Set();
var JWT_SECRET = process.env.JWT_SECRET || "";

// Map to keep track of the current active socket per userId
var userSockets = new Map();
var heartbeatInterval = null;
export function initWebSocket(httpServer, provider) {
  userProvider = provider;
  wss = new WebSocketServer({
    server: httpServer,
    path: "/ws"
  });
  wss.on("connection", function (socket, req) {
    // heartbeat init (use application-level ping/pong so browsers stay compatible)
    socket.isAlive = true;
    socket.on && socket.on("message", function (data) {
      try {
        var raw = typeof data === "string" ? data : data.toString();
        var msg = JSON.parse(raw);
        if (msg && msg.type === "pong") socket.isAlive = true;
      } catch (_) {}
    });

    // log close/error for easier debugging and remove mapping
    socket.on && socket.on("close", function (code, reason) {
      try {
        logger.info("WebSocket closed for user=".concat(socket.userId || "unknown", " code=").concat(code, " reason=").concat(reason ? reason.toString() : ""));
      } catch (_) {}
      try {
        if (socket.userId) {
          var cur = userSockets.get(socket.userId);
          if (cur === socket) userSockets["delete"](socket.userId);
        }
      } catch (_) {}
    });
    socket.on && socket.on("error", function (err) {
      try {
        logger.error("WebSocket error", err);
      } catch (_) {}
    });
    var url = new URL(req.url || "", "http://".concat(req.headers.host));
    var token = url.searchParams.get("token");
    if (!token) {
      try {
        socket.send(JSON.stringify({
          type: "error",
          error: "AUTH_REQUIRED"
        }));
      } catch (_) {}
      try {
        socket.close();
      } catch (_) {}
      return;
    }
    try {
      var decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.sub;
      try {
        // If there is already an active socket for this user, replace it
        var existing = socket.userId ? userSockets.get(socket.userId) : undefined;
        if (existing && existing !== socket) {
          try {
            existing.close(4000, "replaced");
          } catch (_) {}
          try {
            logger.info("Replaced existing socket for user=".concat(socket.userId));
          } catch (_) {}
        }
        if (socket.userId) userSockets.set(socket.userId, socket);
        var welcome = {
          type: "welcome",
          time: toShanghaiISO(),
          userId: socket.userId
        };
        socket.send(JSON.stringify(welcome));
        logger.info("Sent welcome to user=".concat(socket.userId, " at ").concat(welcome.time));
      } catch (_) {}
    } catch (e) {
      try {
        socket.send(JSON.stringify({
          type: "error",
          error: "INVALID_TOKEN"
        }));
      } catch (_) {}
      try {
        socket.close();
      } catch (_) {}
      return;
    }
  });

  // heartbeat interval - use application-level ping (JSON) for browser compatibility
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(function () {
    if (!wss) return;
    var _iterator = _createForOfIteratorHelper(wss.clients),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var client = _step.value;
        var s = client;
        if (s.isAlive === false) {
          try {
            client.terminate();
          } catch (_) {}
          continue;
        }
        s.isAlive = false;
        try {
          if (client.readyState === 1) {
            client.send(JSON.stringify({
              type: "ping"
            }));
          }
        } catch (_) {}
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }, 30000);
  wss.on("close", function () {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
  });
  startOccurrenceScan();
  logger.info("WebSocket server with JWT auth initialized at /ws");
}
export function broadcastTaskChange(action, task, userId) {
  if (!wss) return;
  var payload = JSON.stringify({
    type: "taskChange",
    action: action,
    task: {
      id: task.id,
      name: task.name,
      startTime: task.startTime,
      endTime: task.endTime,
      completed: task.completed,
      parentTaskId: task.parentTaskId,
      recurrenceRule: task.recurrenceRule
    }
  });
  var _iterator2 = _createForOfIteratorHelper(wss.clients),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var client = _step2.value;
      var c = client;
      if (c.userId !== userId) continue;
      if (client.readyState === 1) {
        try {
          client.send(payload);
        } catch (_) {}
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
export function broadcastUserLog(userId, log) {
  if (!wss) return;
  var payload = JSON.stringify({
    type: "userLog",
    log: log
  });
  var _iterator3 = _createForOfIteratorHelper(wss.clients),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var client = _step3.value;
      var c = client;
      if (c.userId !== userId) continue;
      if (client.readyState === 1) {
        try {
          client.send(payload);
        } catch (_) {}
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}

/** 广播 SMTP/IMAP 连接失败通知给指定用户 */
export function broadcastSmtpError(userId, message) {
  if (!wss) return;
  var payload = JSON.stringify({
    type: "smtpError",
    message: message,
    time: toShanghaiISO()
  });
  var _iterator4 = _createForOfIteratorHelper(wss.clients),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var client = _step4.value;
      var c = client;
      if (c.userId !== userId) continue;
      if (client.readyState === 1) {
        try {
          client.send(payload);
        } catch (_) {}
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
}
function broadcastTaskOccurrence(task, userId) {
  if (!wss) return;
  var payload = JSON.stringify({
    type: "taskOccurrence",
    taskId: task.id,
    name: task.name,
    startTime: task.startTime,
    endTime: task.endTime
  });
  var _iterator5 = _createForOfIteratorHelper(wss.clients),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var client = _step5.value;
      var c = client;
      if (c.userId !== userId) continue;
      if (client.readyState === 1) {
        try {
          client.send(payload);
        } catch (_) {}
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
}
function broadcastTaskOccurrenceCanceled(task, userId) {
  if (!wss) return;
  var payload = JSON.stringify({
    type: "taskOccurrenceCanceled",
    taskId: task.id,
    startTime: task.startTime
  });
  var _iterator6 = _createForOfIteratorHelper(wss.clients),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var client = _step6.value;
      var c = client;
      if (c.userId !== userId) continue;
      if (client.readyState === 1) {
        try {
          client.send(payload);
        } catch (_) {}
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
}
function startOccurrenceScan() {
  setInterval(function () {
    if (!userProvider) return;
    var now = Date.now();
    var _iterator7 = _createForOfIteratorHelper(userProvider()),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var user = _step7.value;
        var _iterator8 = _createForOfIteratorHelper(user.tasks || []),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var task = _step8.value;
            if (!task.startTime) continue;
            var startMillis = new Date(task.startTime).getTime();
            if (isNaN(startMillis)) continue;
            if (task.completed && !occurrenceNotified.has(task.id)) {
              // 已完成且未开始 -> 取消事件
              if (startMillis > now) {
                occurrenceNotified.add(task.id);
                broadcastTaskOccurrenceCanceled(task, user.id);
              }
              continue;
            }
            if (startMillis <= now && !task.completed && !occurrenceNotified.has(task.id)) {
              occurrenceNotified.add(task.id);
              broadcastTaskOccurrence(task, user.id);
              logger.info("Broadcast task occurrence ".concat(task.id));
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  }, 5000);
}