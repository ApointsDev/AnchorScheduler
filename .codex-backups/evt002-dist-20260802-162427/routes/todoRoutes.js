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
/**
 * 待办（Todo）与标签（Tag）API
 * 挂载于 /api → 路径为 /api/todos、/api/tags
 */

import express from "express";
import { dbService } from "../Services/dbService.js";
import { logger } from "../Utils/logger.js";
import { TagConflictError, TagNotFoundError } from "../Services/db/tags.js";
import { TodoNotFoundError } from "../Services/db/todos.js";
import { parsePriorityAxesBody } from "../Services/priorityAxes.js";
function parseCsv(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (Array.isArray(value)) {
    return value.map(String).map(function (s) {
      return s.trim();
    }).filter(Boolean);
  }
  return String(value).split(",").map(function (s) {
    return s.trim();
  }).filter(Boolean);
}
function parseBool(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  var s = String(value).toLowerCase();
  if (s === "true" || s === "1") return true;
  if (s === "false" || s === "0") return false;
  return undefined;
}
function parsePageOpts(query) {
  var limit = query.limit !== undefined ? Number(query.limit) : undefined;
  var offset = query.offset !== undefined ? Number(query.offset) : query.page !== undefined ? Math.max(0, (Number(query.page) - 1) * (limit || 50)) : undefined;
  return {
    q: query.q ? String(query.q) : undefined,
    completed: parseBool(query.completed),
    tagIds: parseCsv(query.tagIds),
    tagNames: parseCsv(query.tagNames || query.tag),
    dueBefore: query.dueBefore ? String(query.dueBefore) : undefined,
    dueAfter: query.dueAfter ? String(query.dueAfter) : undefined,
    limit: Number.isFinite(limit) ? limit : undefined,
    offset: Number.isFinite(offset) ? offset : undefined,
    sortBy: query.sortBy ? String(query.sortBy) : undefined,
    order: query.order === "asc" || query.order === "desc" ? query.order : undefined
  };
}
export function initializeTodoRoutes(authenticateToken) {
  var router = express.Router();

  // ── Tags ──────────────────────────────────────────────────

  router.get("/tags", authenticateToken, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var userId, tags, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            userId = req.user.id;
            _context.n = 1;
            return dbService.listTags(userId);
          case 1:
            tags = _context.v;
            res.json({
              tags: tags
            });
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            logger.error("GET /tags failed:", _t);
            res.status(500).json({
              error: _t.message || "Internal error"
            });
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  router.post("/tags", authenticateToken, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var userId, _ref3, name, color, tag, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            userId = req.user.id;
            _ref3 = req.body || {}, name = _ref3.name, color = _ref3.color;
            if (!(!name || typeof name !== "string" || !name.trim())) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2, res.status(400).json({
              error: "name is required"
            }));
          case 1:
            _context2.n = 2;
            return dbService.createTag(userId, {
              name: name.trim(),
              color: color !== undefined ? String(color) : undefined
            });
          case 2:
            tag = _context2.v;
            res.status(201).json({
              tag: tag
            });
            _context2.n = 5;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            if (!(_t2 instanceof TagConflictError)) {
              _context2.n = 4;
              break;
            }
            return _context2.a(2, res.status(409).json({
              error: "conflict",
              message: _t2.message
            }));
          case 4:
            logger.error("POST /tags failed:", _t2);
            res.status(500).json({
              error: _t2.message || "Internal error"
            });
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 3]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  router.get("/tags/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
      var userId, tag, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            userId = req.user.id;
            _context3.n = 1;
            return dbService.getTagById(userId, req.params.id);
          case 1:
            tag = _context3.v;
            if (tag) {
              _context3.n = 2;
              break;
            }
            return _context3.a(2, res.status(404).json({
              error: "Tag not found"
            }));
          case 2:
            res.json({
              tag: tag
            });
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            logger.error("GET /tags/:id failed:", _t3);
            res.status(500).json({
              error: _t3.message || "Internal error"
            });
          case 4:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 3]]);
    }));
    return function (_x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }());
  function handleTagUpdate(_x7, _x8) {
    return _handleTagUpdate.apply(this, arguments);
  }
  function _handleTagUpdate() {
    _handleTagUpdate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(req, res) {
      var userId, _ref14, name, color, updates, tag, _t16;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.p = _context13.n) {
          case 0:
            _context13.p = 0;
            userId = req.user.id;
            _ref14 = req.body || {}, name = _ref14.name, color = _ref14.color;
            updates = {};
            if (name !== undefined) updates.name = String(name);
            if (color !== undefined) {
              updates.color = color === null ? null : String(color);
            }
            if (!(Object.keys(updates).length === 0)) {
              _context13.n = 1;
              break;
            }
            return _context13.a(2, res.status(400).json({
              error: "No fields to update"
            }));
          case 1:
            _context13.n = 2;
            return dbService.updateTag(userId, req.params.id, updates);
          case 2:
            tag = _context13.v;
            res.json({
              tag: tag
            });
            _context13.n = 7;
            break;
          case 3:
            _context13.p = 3;
            _t16 = _context13.v;
            if (!(_t16 instanceof TagNotFoundError || (_t16 === null || _t16 === void 0 ? void 0 : _t16.name) === "TagNotFoundError")) {
              _context13.n = 4;
              break;
            }
            return _context13.a(2, res.status(404).json({
              error: "Tag not found"
            }));
          case 4:
            if (!(_t16 instanceof TagConflictError || (_t16 === null || _t16 === void 0 ? void 0 : _t16.name) === "TagConflictError")) {
              _context13.n = 5;
              break;
            }
            return _context13.a(2, res.status(409).json({
              error: "conflict",
              message: _t16.message
            }));
          case 5:
            if (!(_t16.message === "Tag name is required")) {
              _context13.n = 6;
              break;
            }
            return _context13.a(2, res.status(400).json({
              error: _t16.message
            }));
          case 6:
            logger.error("update tag failed:", _t16);
            res.status(500).json({
              error: _t16.message || "Internal error"
            });
          case 7:
            return _context13.a(2);
        }
      }, _callee13, null, [[0, 3]]);
    }));
    return _handleTagUpdate.apply(this, arguments);
  }
  router.put("/tags/:id", authenticateToken, handleTagUpdate);
  router.patch("/tags/:id", authenticateToken, handleTagUpdate);
  router["delete"]("/tags/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
      var userId, ok, _t4;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            userId = req.user.id;
            _context4.n = 1;
            return dbService.deleteTag(userId, req.params.id);
          case 1:
            ok = _context4.v;
            if (ok) {
              _context4.n = 2;
              break;
            }
            return _context4.a(2, res.status(404).json({
              error: "Tag not found"
            }));
          case 2:
            res.json({
              id: req.params.id,
              deleted: true
            });
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t4 = _context4.v;
            logger.error("DELETE /tags/:id failed:", _t4);
            res.status(500).json({
              error: _t4.message || "Internal error"
            });
          case 4:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 3]]);
    }));
    return function (_x9, _x0) {
      return _ref5.apply(this, arguments);
    };
  }());

  // 按标签反查待办
  router.get("/tags/:id/todos", authenticateToken, /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
      var _pageOpts$limit, _pageOpts$offset, userId, pageOpts, _yield$dbService$getT, todos, total, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            userId = req.user.id;
            pageOpts = parsePageOpts(req.query);
            _context5.n = 1;
            return dbService.getTodosByTagId(userId, req.params.id, pageOpts);
          case 1:
            _yield$dbService$getT = _context5.v;
            todos = _yield$dbService$getT.todos;
            total = _yield$dbService$getT.total;
            res.json({
              todos: todos,
              total: total,
              limit: (_pageOpts$limit = pageOpts.limit) !== null && _pageOpts$limit !== void 0 ? _pageOpts$limit : 50,
              offset: (_pageOpts$offset = pageOpts.offset) !== null && _pageOpts$offset !== void 0 ? _pageOpts$offset : 0
            });
            _context5.n = 4;
            break;
          case 2:
            _context5.p = 2;
            _t5 = _context5.v;
            if (!(_t5 instanceof TagNotFoundError)) {
              _context5.n = 3;
              break;
            }
            return _context5.a(2, res.status(404).json({
              error: "Tag not found"
            }));
          case 3:
            logger.error("GET /tags/:id/todos failed:", _t5);
            res.status(500).json({
              error: _t5.message || "Internal error"
            });
          case 4:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 2]]);
    }));
    return function (_x1, _x10) {
      return _ref6.apply(this, arguments);
    };
  }());

  // ── Todos ─────────────────────────────────────────────────

  router.get("/todos", authenticateToken, /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
      var _pageOpts$limit2, _pageOpts$offset2, userId, pageOpts, _yield$dbService$getT2, todos, total, _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            _context6.p = 0;
            userId = req.user.id;
            pageOpts = parsePageOpts(req.query);
            _context6.n = 1;
            return dbService.getTodosPage(userId, pageOpts);
          case 1:
            _yield$dbService$getT2 = _context6.v;
            todos = _yield$dbService$getT2.todos;
            total = _yield$dbService$getT2.total;
            res.json({
              todos: todos,
              total: total,
              limit: (_pageOpts$limit2 = pageOpts.limit) !== null && _pageOpts$limit2 !== void 0 ? _pageOpts$limit2 : 50,
              offset: (_pageOpts$offset2 = pageOpts.offset) !== null && _pageOpts$offset2 !== void 0 ? _pageOpts$offset2 : 0
            });
            _context6.n = 4;
            break;
          case 2:
            _context6.p = 2;
            _t6 = _context6.v;
            if (!(_t6 instanceof TagNotFoundError)) {
              _context6.n = 3;
              break;
            }
            return _context6.a(2, res.status(400).json({
              error: _t6.message
            }));
          case 3:
            logger.error("GET /todos failed:", _t6);
            res.status(500).json({
              error: _t6.message || "Internal error"
            });
          case 4:
            return _context6.a(2);
        }
      }, _callee6, null, [[0, 2]]);
    }));
    return function (_x11, _x12) {
      return _ref7.apply(this, arguments);
    };
  }());
  router.post("/todos", authenticateToken, /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
      var userId, body, tagIds, tagNames, todo, _t7;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            _context7.p = 0;
            userId = req.user.id;
            body = req.body || {};
            if (!(!body.name || typeof body.name !== "string" || !body.name.trim())) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2, res.status(400).json({
              error: "name is required"
            }));
          case 1:
            tagIds = parseCsv(body.tagIds) || (Array.isArray(body.tagIds) ? body.tagIds.map(String) : undefined);
            tagNames = parseCsv(body.tagNames) || (Array.isArray(body.tagNames) ? body.tagNames.map(String) : undefined);
            _context7.n = 2;
            return dbService.createTodo(userId, {
              name: body.name.trim(),
              description: body.description !== undefined ? String(body.description) : undefined,
              completed: Boolean(body.completed),
              dueDate: body.dueDate ? String(body.dueDate) : undefined,
              importance: body.importance ? String(body.importance) : undefined,
              importanceScore: body.importanceScore !== undefined ? Number(body.importanceScore) : undefined,
              urgencyScore: body.urgencyScore !== undefined ? Number(body.urgencyScore) : undefined,
              tagIds: tagIds,
              tagNames: tagNames
            });
          case 2:
            todo = _context7.v;
            res.status(201).json({
              todo: todo
            });
            _context7.n = 6;
            break;
          case 3:
            _context7.p = 3;
            _t7 = _context7.v;
            if (!(_t7 instanceof TagNotFoundError)) {
              _context7.n = 4;
              break;
            }
            return _context7.a(2, res.status(400).json({
              error: _t7.message
            }));
          case 4:
            if (!(_t7.message === "Todo name is required")) {
              _context7.n = 5;
              break;
            }
            return _context7.a(2, res.status(400).json({
              error: _t7.message
            }));
          case 5:
            logger.error("POST /todos failed:", _t7);
            res.status(500).json({
              error: _t7.message || "Internal error"
            });
          case 6:
            return _context7.a(2);
        }
      }, _callee7, null, [[0, 3]]);
    }));
    return function (_x13, _x14) {
      return _ref8.apply(this, arguments);
    };
  }());
  router.get("/todos/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
      var userId, todo, _t8;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.p = _context8.n) {
          case 0:
            _context8.p = 0;
            userId = req.user.id;
            _context8.n = 1;
            return dbService.getTodoById(userId, req.params.id);
          case 1:
            todo = _context8.v;
            if (todo) {
              _context8.n = 2;
              break;
            }
            return _context8.a(2, res.status(404).json({
              error: "Todo not found"
            }));
          case 2:
            res.json({
              todo: todo
            });
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t8 = _context8.v;
            logger.error("GET /todos/:id failed:", _t8);
            res.status(500).json({
              error: _t8.message || "Internal error"
            });
          case 4:
            return _context8.a(2);
        }
      }, _callee8, null, [[0, 3]]);
    }));
    return function (_x15, _x16) {
      return _ref9.apply(this, arguments);
    };
  }());
  function handleTodoUpdate(_x17, _x18) {
    return _handleTodoUpdate.apply(this, arguments);
  }
  function _handleTodoUpdate() {
    _handleTodoUpdate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(req, res) {
      var userId, body, updates, todo, _t17;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.p = _context14.n) {
          case 0:
            _context14.p = 0;
            userId = req.user.id;
            body = req.body || {};
            updates = {};
            if (body.name !== undefined) updates.name = String(body.name);
            if (body.description !== undefined) {
              updates.description = body.description === null ? null : String(body.description);
            }
            if (body.completed !== undefined) {
              updates.completed = Boolean(body.completed);
            }
            if (body.dueDate !== undefined) {
              updates.dueDate = body.dueDate === null || body.dueDate === "" ? null : String(body.dueDate);
            }
            if (body.importance !== undefined) {
              updates.importance = String(body.importance);
            }
            if (body.importanceScore !== undefined) {
              updates.importanceScore = body.importanceScore === null ? null : Number(body.importanceScore);
            }
            if (body.urgencyScore !== undefined) {
              updates.urgencyScore = body.urgencyScore === null ? null : Number(body.urgencyScore);
            }
            if (body.tagIds !== undefined || body.tagNames !== undefined) {
              updates.replaceTags = true;
              if (body.tagIds !== undefined) {
                updates.tagIds = Array.isArray(body.tagIds) ? body.tagIds.map(String) : parseCsv(body.tagIds) || [];
              } else {
                updates.tagIds = [];
              }
              if (body.tagNames !== undefined) {
                updates.tagNames = Array.isArray(body.tagNames) ? body.tagNames.map(String) : parseCsv(body.tagNames) || [];
              } else {
                updates.tagNames = [];
              }
            }
            if (!(Object.keys(updates).length === 0)) {
              _context14.n = 1;
              break;
            }
            return _context14.a(2, res.status(400).json({
              error: "No fields to update"
            }));
          case 1:
            _context14.n = 2;
            return dbService.updateTodo(userId, req.params.id, updates);
          case 2:
            todo = _context14.v;
            res.json({
              todo: todo
            });
            _context14.n = 7;
            break;
          case 3:
            _context14.p = 3;
            _t17 = _context14.v;
            if (!(_t17 instanceof TodoNotFoundError)) {
              _context14.n = 4;
              break;
            }
            return _context14.a(2, res.status(404).json({
              error: "Todo not found"
            }));
          case 4:
            if (!(_t17 instanceof TagNotFoundError)) {
              _context14.n = 5;
              break;
            }
            return _context14.a(2, res.status(400).json({
              error: _t17.message
            }));
          case 5:
            if (!(_t17.message === "Todo name is required")) {
              _context14.n = 6;
              break;
            }
            return _context14.a(2, res.status(400).json({
              error: _t17.message
            }));
          case 6:
            logger.error("update todo failed:", _t17);
            res.status(500).json({
              error: _t17.message || "Internal error"
            });
          case 7:
            return _context14.a(2);
        }
      }, _callee14, null, [[0, 3]]);
    }));
    return _handleTodoUpdate.apply(this, arguments);
  }
  router.put("/todos/:id", authenticateToken, handleTodoUpdate);
  router.patch("/todos/:id", authenticateToken, handleTodoUpdate);

  /**
   * 单独调整待办四象限双轴分数
   * PATCH /api/todos/:id/priority-axes
   * Body: { importanceScore?: number, urgencyScore?: number }  范围 -1..1
   */
  router.patch("/todos/:id/priority-axes", authenticateToken, /*#__PURE__*/function () {
    var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
      var _todo$importanceScore, _todo$urgencyScore, userId, parsed, todo, _t9;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.p = _context9.n) {
          case 0:
            _context9.p = 0;
            userId = req.user.id;
            parsed = parsePriorityAxesBody(req.body);
            if (parsed.ok) {
              _context9.n = 1;
              break;
            }
            return _context9.a(2, res.status(400).json({
              error: parsed.error
            }));
          case 1:
            _context9.n = 2;
            return dbService.updateTodo(userId, req.params.id, _objectSpread({}, parsed.axes));
          case 2:
            todo = _context9.v;
            return _context9.a(2, res.status(200).json({
              todo: todo,
              axes: {
                importanceScore: (_todo$importanceScore = todo.importanceScore) !== null && _todo$importanceScore !== void 0 ? _todo$importanceScore : null,
                urgencyScore: (_todo$urgencyScore = todo.urgencyScore) !== null && _todo$urgencyScore !== void 0 ? _todo$urgencyScore : null
              }
            }));
          case 3:
            _context9.p = 3;
            _t9 = _context9.v;
            if (!(_t9 instanceof TodoNotFoundError)) {
              _context9.n = 4;
              break;
            }
            return _context9.a(2, res.status(404).json({
              error: "Todo not found"
            }));
          case 4:
            logger.error("PATCH /todos/:id/priority-axes failed:", _t9);
            return _context9.a(2, res.status(500).json({
              error: _t9.message || "Failed to update priority axes"
            }));
        }
      }, _callee9, null, [[0, 3]]);
    }));
    return function (_x19, _x20) {
      return _ref0.apply(this, arguments);
    };
  }());
  router["delete"]("/todos/:id", authenticateToken, /*#__PURE__*/function () {
    var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
      var userId, ok, _t0;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.p = _context0.n) {
          case 0:
            _context0.p = 0;
            userId = req.user.id;
            _context0.n = 1;
            return dbService.deleteTodo(userId, req.params.id);
          case 1:
            ok = _context0.v;
            if (ok) {
              _context0.n = 2;
              break;
            }
            return _context0.a(2, res.status(404).json({
              error: "Todo not found"
            }));
          case 2:
            res.json({
              id: req.params.id,
              deleted: true
            });
            _context0.n = 4;
            break;
          case 3:
            _context0.p = 3;
            _t0 = _context0.v;
            logger.error("DELETE /todos/:id failed:", _t0);
            res.status(500).json({
              error: _t0.message || "Internal error"
            });
          case 4:
            return _context0.a(2);
        }
      }, _callee0, null, [[0, 3]]);
    }));
    return function (_x21, _x22) {
      return _ref1.apply(this, arguments);
    };
  }());

  // 替换待办标签
  router.put("/todos/:id/tags", authenticateToken, /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
      var userId, body, tagIds, tagNames, todo, _t1;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.p = _context1.n) {
          case 0:
            _context1.p = 0;
            userId = req.user.id;
            body = req.body || {};
            tagIds = Array.isArray(body.tagIds) ? body.tagIds.map(String) : parseCsv(body.tagIds) || [];
            tagNames = Array.isArray(body.tagNames) ? body.tagNames.map(String) : parseCsv(body.tagNames) || [];
            _context1.n = 1;
            return dbService.updateTodo(userId, req.params.id, {
              replaceTags: true,
              tagIds: tagIds,
              tagNames: tagNames
            });
          case 1:
            todo = _context1.v;
            res.json({
              todo: todo
            });
            _context1.n = 5;
            break;
          case 2:
            _context1.p = 2;
            _t1 = _context1.v;
            if (!(_t1 instanceof TodoNotFoundError)) {
              _context1.n = 3;
              break;
            }
            return _context1.a(2, res.status(404).json({
              error: "Todo not found"
            }));
          case 3:
            if (!(_t1 instanceof TagNotFoundError)) {
              _context1.n = 4;
              break;
            }
            return _context1.a(2, res.status(400).json({
              error: _t1.message
            }));
          case 4:
            logger.error("PUT /todos/:id/tags failed:", _t1);
            res.status(500).json({
              error: _t1.message || "Internal error"
            });
          case 5:
            return _context1.a(2);
        }
      }, _callee1, null, [[0, 2]]);
    }));
    return function (_x23, _x24) {
      return _ref10.apply(this, arguments);
    };
  }());

  // ── 待办审批队列（与 /schedule-queue 对齐）─────────────────

  router.get("/todo-queue", authenticateToken, /*#__PURE__*/function () {
    var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
      var userId, queue, _t10;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.p = _context10.n) {
          case 0:
            _context10.p = 0;
            userId = req.user.id;
            _context10.n = 1;
            return dbService.getTodoQueueByUser(userId);
          case 1:
            queue = _context10.v;
            res.json({
              queue: queue
            });
            _context10.n = 3;
            break;
          case 2:
            _context10.p = 2;
            _t10 = _context10.v;
            logger.error("GET /todo-queue failed:", _t10);
            res.status(500).json({
              error: "获取待办队列失败"
            });
          case 3:
            return _context10.a(2);
        }
      }, _callee10, null, [[0, 2]]);
    }));
    return function (_x25, _x26) {
      return _ref11.apply(this, arguments);
    };
  }());
  router.post("/todo-queue/:id/approve", authenticateToken, /*#__PURE__*/function () {
    var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
      var _parsed, user, userId, id, row, parsed, args, name, todo, queue, _t11, _t12;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.p = _context11.n) {
          case 0:
            _context11.p = 0;
            user = req.user;
            userId = user.id;
            id = req.params.id;
            _context11.n = 1;
            return dbService.getTodoQueueById(id);
          case 1:
            row = _context11.v;
            if (row) {
              _context11.n = 2;
              break;
            }
            return _context11.a(2, res.status(404).json({
              error: "Queue item not found"
            }));
          case 2:
            if (!(row.userId !== userId)) {
              _context11.n = 3;
              break;
            }
            return _context11.a(2, res.status(403).json({
              error: "Not your queue item"
            }));
          case 3:
            parsed = null;
            try {
              parsed = typeof row.rawRequest === "string" ? JSON.parse(row.rawRequest) : row.rawRequest;
            } catch (_unused) {
              parsed = null;
            }
            args = ((_parsed = parsed) === null || _parsed === void 0 ? void 0 : _parsed.args) || parsed || {};
            name = String(args.name || args.title || "").trim();
            if (name) {
              _context11.n = 5;
              break;
            }
            _context11.n = 4;
            return dbService.updateTodoQueueStatus(id, "failed");
          case 4:
            return _context11.a(2, res.status(422).json({
              error: "Todo name is required"
            }));
          case 5:
            _context11.n = 6;
            return dbService.createTodo(userId, {
              name: name,
              description: args.description !== undefined ? String(args.description) : undefined,
              dueDate: args.dueDate ? String(args.dueDate) : args.endTime ? String(args.endTime) : undefined,
              importance: args.importance ? String(args.importance) : undefined,
              importanceScore: args.importanceScore !== undefined ? Number(args.importanceScore) : undefined,
              urgencyScore: args.urgencyScore !== undefined ? Number(args.urgencyScore) : undefined,
              tagIds: Array.isArray(args.tagIds) ? args.tagIds.map(String) : undefined,
              tagNames: Array.isArray(args.tagNames) ? args.tagNames.map(String) : undefined
            });
          case 6:
            todo = _context11.v;
            _context11.p = 7;
            _context11.n = 8;
            return dbService.deleteTodoQueueItem(id);
          case 8:
            _context11.n = 10;
            break;
          case 9:
            _context11.p = 9;
            _t11 = _context11.v;
            logger.warn("Failed to delete todo queue item after approval, marking approved", _t11);
            _context11.n = 10;
            return dbService.updateTodoQueueStatus(id, "approved");
          case 10:
            _context11.n = 11;
            return dbService.getTodoQueueByUser(userId);
          case 11:
            queue = _context11.v;
            res.json({
              todo: todo,
              queue: queue
            });
            _context11.n = 13;
            break;
          case 12:
            _context11.p = 12;
            _t12 = _context11.v;
            logger.error("Approving todo queue item failed:", _t12);
            res.status(500).json({
              error: "Approve failed"
            });
          case 13:
            return _context11.a(2);
        }
      }, _callee11, null, [[7, 9], [0, 12]]);
    }));
    return function (_x27, _x28) {
      return _ref12.apply(this, arguments);
    };
  }());
  router.post("/todo-queue/:id/reject", authenticateToken, /*#__PURE__*/function () {
    var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
      var userId, id, row, _yield$import, logUserEvent, queue, _t13, _t14, _t15;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.p = _context12.n) {
          case 0:
            _context12.p = 0;
            userId = req.user.id;
            id = req.params.id;
            _context12.n = 1;
            return dbService.getTodoQueueById(id);
          case 1:
            row = _context12.v;
            if (row) {
              _context12.n = 2;
              break;
            }
            return _context12.a(2, res.status(404).json({
              error: "Queue item not found"
            }));
          case 2:
            if (!(row.userId !== userId)) {
              _context12.n = 3;
              break;
            }
            return _context12.a(2, res.status(403).json({
              error: "Not your queue item"
            }));
          case 3:
            _context12.p = 3;
            _context12.n = 4;
            return dbService.addRejectionBufferItem(userId, "todo", row.rawRequest, id);
          case 4:
            _context12.n = 6;
            break;
          case 5:
            _context12.p = 5;
            _t13 = _context12.v;
            logger.warn("Failed to add todo rejection to buffer pool", _t13);
          case 6:
            _context12.p = 6;
            _context12.n = 7;
            return dbService.deleteTodoQueueItem(id);
          case 7:
            _context12.n = 9;
            break;
          case 8:
            _context12.p = 8;
            _t14 = _context12.v;
            logger.warn("Failed to delete todo queue item after rejection, marking rejected", _t14);
            _context12.n = 9;
            return dbService.updateTodoQueueStatus(id, "rejected");
          case 9:
            _context12.n = 10;
            return import("../Services/userLog.js");
          case 10:
            _yield$import = _context12.v;
            logUserEvent = _yield$import.logUserEvent;
            _context12.n = 11;
            return logUserEvent(userId, "external_todo_rejected", "\u5DF2\u62D2\u7EDD\u5916\u90E8\u5F85\u529E\u8BF7\u6C42", {
              queueId: id
            });
          case 11:
            _context12.n = 12;
            return dbService.getTodoQueueByUser(userId);
          case 12:
            queue = _context12.v;
            res.json({
              ok: true,
              queue: queue
            });
            _context12.n = 14;
            break;
          case 13:
            _context12.p = 13;
            _t15 = _context12.v;
            logger.error("Rejecting todo queue item failed:", _t15);
            res.status(500).json({
              error: "Reject failed"
            });
          case 14:
            return _context12.a(2);
        }
      }, _callee12, null, [[6, 8], [3, 5], [0, 13]]);
    }));
    return function (_x29, _x30) {
      return _ref13.apply(this, arguments);
    };
  }());
  return router;
}