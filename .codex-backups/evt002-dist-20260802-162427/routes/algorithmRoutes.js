function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import express from "express";
import { AlgorithmService } from "../Services/Algorithms/AlgorithmService.js";
import { logger } from "../Utils/logger.js";
import { dbService } from "../Services/dbService.js";
export function initializeAlgorithmRoutes(authenticateToken) {
  var router = express.Router();
  var algorithmService = new AlgorithmService();

  // 个人日程优化
  router.post('/optimize-schedule', authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var _req$body, tasks, fixedEvents, availableSlots, dependencies, result, assignmentsObj, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            _req$body = req.body, tasks = _req$body.tasks, fixedEvents = _req$body.fixedEvents, availableSlots = _req$body.availableSlots, dependencies = _req$body.dependencies; // Basic validation
            if (!(!tasks || !Array.isArray(tasks))) {
              _context.n = 1;
              break;
            }
            return _context.a(2, res.status(400).json({
              error: 'Invalid tasks input'
            }));
          case 1:
            _context.n = 2;
            return algorithmService.optimizePersonalSchedule(tasks, fixedEvents || [], availableSlots || [], dependencies || []);
          case 2:
            result = _context.v;
            // Convert Map to Object for JSON response
            assignmentsObj = Object.fromEntries(result);
            res.json({
              success: true,
              assignments: assignmentsObj
            });
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            logger.error('Optimize schedule failed:', _t);
            res.status(500).json({
              error: _t.message
            });
          case 4:
            return _context.a(2);
        }
      }, _callee, null, [[0, 3]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  // 团队会议安排
  router.post('/schedule-meeting', authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var _req$body2, teamMembers, requirements, weights, result, adjustmentsObj, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _req$body2 = req.body, teamMembers = _req$body2.teamMembers, requirements = _req$body2.requirements, weights = _req$body2.weights;
            if (!(!teamMembers || !requirements)) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: 'Missing required parameters'
            }));
          case 1:
            _context2.n = 2;
            return algorithmService.scheduleTeamMeeting(teamMembers, requirements, weights);
          case 2:
            result = _context2.v;
            // Convert Map to Object
            adjustmentsObj = Object.fromEntries(result.adjustments);
            res.json({
              success: true,
              result: _objectSpread(_objectSpread({}, result), {}, {
                adjustments: adjustmentsObj
              })
            });
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            logger.error('Schedule meeting failed:', _t2);
            res.status(500).json({
              error: _t2.message
            });
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 3]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());

  // 关键路径分析
  router.post('/critical-path', authenticateToken, /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var _req$body3, tasks, startDate, start, result, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            _req$body3 = req.body, tasks = _req$body3.tasks, startDate = _req$body3.startDate;
            if (tasks) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, res.status(400).json({
              error: 'Missing tasks'
            }));
          case 1:
            start = startDate ? new Date(startDate) : new Date();
            result = algorithmService.analyzeProjectCriticalPath(tasks, start); // Convert Maps to Objects
            res.json({
              success: true,
              result: {
                criticalPath: result.criticalPath,
                projectDuration: result.projectDuration,
                slackTimes: Object.fromEntries(result.slackTimes),
                earliestStart: Object.fromEntries(result.earliestStart),
                latestStart: Object.fromEntries(result.latestStart),
                taskDetails: Object.fromEntries(result.taskDetails)
              }
            });
            _context3.n = 3;
            break;
          case 2:
            _context3.p = 2;
            _t3 = _context3.v;
            logger.error('Critical path analysis failed:', _t3);
            res.status(500).json({
              error: _t3.message
            });
          case 3:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 2]]);
    }));
    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());

  // 社区发现
  router.post('/community-detection', authenticateToken, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var tasks, communities, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            tasks = req.body.tasks;
            if (tasks) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, res.status(400).json({
              error: 'Missing tasks'
            }));
          case 1:
            communities = algorithmService.detectTaskCommunities(tasks);
            res.json({
              success: true,
              communities: Object.fromEntries(communities)
            });
            _context4.n = 3;
            break;
          case 2:
            _context4.p = 2;
            _t4 = _context4.v;
            logger.error('Community detection failed:', _t4);
            res.status(500).json({
              error: _t4.message
            });
          case 3:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 2]]);
    }));
    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }());

  // 分析用户精力模式
  router.post('/analyze-energy', authenticateToken, /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
      var userId, tasks, periods, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            userId = req.user.id; // Fetch all tasks (history)
            _context5.n = 1;
            return dbService.getTasksByUserId(userId);
          case 1:
            tasks = _context5.v;
            if (!(!tasks || tasks.length === 0)) {
              _context5.n = 2;
              break;
            }
            return _context5.a(2, res.json({
              success: true,
              periods: []
            }));
          case 2:
            periods = algorithmService.analyzeEnergyPatterns(tasks); // Save to DB
            _context5.n = 3;
            return dbService.updateUserHighEnergyPeriods(userId, periods);
          case 3:
            res.json({
              success: true,
              periods: periods
            });
            _context5.n = 5;
            break;
          case 4:
            _context5.p = 4;
            _t5 = _context5.v;
            logger.error('Analyze energy failed:', _t5);
            res.status(500).json({
              error: _t5.message
            });
          case 5:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 4]]);
    }));
    return function (_x9, _x0) {
      return _ref5.apply(this, arguments);
    };
  }());

  // 完整个人日程安排
  router.post('/schedule-tasks', authenticateToken, /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
      var _req$body4, tasks, config, userId, user, highEnergyPeriods, finalConfig, result, _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            _context6.p = 0;
            _req$body4 = req.body, tasks = _req$body4.tasks, config = _req$body4.config;
            userId = req.user.id;
            if (!(!tasks || !Array.isArray(tasks))) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2, res.status(400).json({
              error: 'Invalid tasks input'
            }));
          case 1:
            _context6.n = 2;
            return dbService.getUserById(userId);
          case 2:
            user = _context6.v;
            highEnergyPeriods = (user === null || user === void 0 ? void 0 : user.highEnergyPeriods) || [];
            finalConfig = _objectSpread(_objectSpread({}, config), {}, {
              highEnergyPeriods: highEnergyPeriods
            });
            _context6.n = 3;
            return algorithmService.scheduleTasks(tasks, finalConfig);
          case 3:
            result = _context6.v;
            res.json({
              success: true,
              scheduledTasks: result.scheduledTasks,
              metrics: result.metrics
            });
            _context6.n = 5;
            break;
          case 4:
            _context6.p = 4;
            _t6 = _context6.v;
            logger.error('Schedule tasks failed:', _t6);
            res.status(500).json({
              error: _t6.message
            });
          case 5:
            return _context6.a(2);
        }
      }, _callee6, null, [[0, 4]]);
    }));
    return function (_x1, _x10) {
      return _ref6.apply(this, arguments);
    };
  }());

  // 完整团队任务安排
  router.post('/schedule-team-tasks', authenticateToken, /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
      var _req$body5, members, meetingDetails, config, result, adjustmentsObj, _t7;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            _req$body5 = req.body, members = _req$body5.members, meetingDetails = _req$body5.meetingDetails, config = _req$body5.config;
            if (!(!members || !Array.isArray(members) || !meetingDetails)) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2, res.status(400).json({
              error: 'Invalid input parameters'
            }));
          case 1:
            _context7.n = 2;
            return algorithmService.scheduleTeamTasks(members, meetingDetails, config);
          case 2:
            result = _context7.v;
            // Convert Map to Object
            adjustmentsObj = Object.fromEntries(result.adjustments);
            res.json({
              success: true,
              result: _objectSpread(_objectSpread({}, result), {}, {
                adjustments: adjustmentsObj
              })
            });
            _context7.n = 4;
            break;
          case 3:
            _context7.p = 3;
            _t7 = _context7.v;
            logger.error('Schedule team tasks failed:', _t7);
            res.status(500).json({
              error: _t7.message
            });
          case 4:
            return _context7.a(2);
        }
      }, _callee7, null, [[0, 3]]);
    }));
    return function (_x11, _x12) {
      return _ref7.apply(this, arguments);
    };
  }());
  return router;
}