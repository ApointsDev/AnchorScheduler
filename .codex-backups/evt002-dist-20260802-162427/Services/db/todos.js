function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
// 待办 CRUD + 标签关联 + 按标签反查

import { v4 as uuidv4 } from "uuid";
import { toShanghaiISO } from "../../Utils/time.js";
import { clampAxisScore, resolvePriorityAxes } from "../priorityAxes.js";
import { mapRowToTag, mapRowToTodo, normalizeImportance } from "./todoMapper.js";
import { TagNotFoundError } from "./tags.js";
export var TodoNotFoundError = /*#__PURE__*/function (_Error) {
  function TodoNotFoundError() {
    var _this;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Todo not found";
    _classCallCheck(this, TodoNotFoundError);
    _this = _callSuper(this, TodoNotFoundError, [message]);
    _this.name = "TodoNotFoundError";
    return _this;
  }
  _inherits(TodoNotFoundError, _Error);
  return _createClass(TodoNotFoundError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
export var TodoStore = /*#__PURE__*/function () {
  function TodoStore(db, tags, addUserLog) {
    _classCallCheck(this, TodoStore);
    this.db = db;
    this.tags = tags;
    this.addUserLog = addUserLog;
  }
  return _createClass(TodoStore, [{
    key: "getTagsForTodoIds",
    value: function () {
      var _getTagsForTodoIds = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(todoIds) {
        var map, placeholders, rows, _iterator, _step, row, todoId, list;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              map = new Map();
              if (!(todoIds.length === 0)) {
                _context.n = 1;
                break;
              }
              return _context.a(2, map);
            case 1:
              placeholders = todoIds.map(function () {
                return "?";
              }).join(",");
              _context.n = 2;
              return this.db.all("SELECT tt.todoId AS todoId, t.*\n             FROM todo_tags tt\n             INNER JOIN tags t ON t.id = tt.tagId\n             WHERE tt.todoId IN (".concat(placeholders, ")\n             ORDER BY t.name ASC"), todoIds);
            case 2:
              rows = _context.v;
              _iterator = _createForOfIteratorHelper(rows);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  row = _step.value;
                  todoId = row.todoId;
                  list = map.get(todoId) || [];
                  list.push(mapRowToTag(row));
                  map.set(todoId, list);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              return _context.a(2, map);
          }
        }, _callee, this);
      }));
      function getTagsForTodoIds(_x) {
        return _getTagsForTodoIds.apply(this, arguments);
      }
      return getTagsForTodoIds;
    }()
  }, {
    key: "attachTags",
    value: function () {
      var _attachTags = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(rows) {
        var ids, tagMap;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              ids = rows.map(function (r) {
                return r.id;
              });
              _context2.n = 1;
              return this.getTagsForTodoIds(ids);
            case 1:
              tagMap = _context2.v;
              return _context2.a(2, rows.map(function (r) {
                return mapRowToTodo(r, tagMap.get(r.id) || []);
              }));
          }
        }, _callee2, this);
      }));
      function attachTags(_x2) {
        return _attachTags.apply(this, arguments);
      }
      return attachTags;
    }()
  }, {
    key: "setTodoTags",
    value: function () {
      var _setTodoTags = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(todoId, tags) {
        var _iterator2, _step2, tag, _t;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.n = 1;
              return this.db.run("DELETE FROM todo_tags WHERE todoId = ?", [todoId]);
            case 1:
              _iterator2 = _createForOfIteratorHelper(tags);
              _context3.p = 2;
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context3.n = 5;
                break;
              }
              tag = _step2.value;
              _context3.n = 4;
              return this.db.run("INSERT INTO todo_tags (todoId, tagId) VALUES (?, ?)", [todoId, tag.id]);
            case 4:
              _context3.n = 3;
              break;
            case 5:
              _context3.n = 7;
              break;
            case 6:
              _context3.p = 6;
              _t = _context3.v;
              _iterator2.e(_t);
            case 7:
              _context3.p = 7;
              _iterator2.f();
              return _context3.f(7);
            case 8:
              return _context3.a(2);
          }
        }, _callee3, this, [[2, 6, 7, 8]]);
      }));
      function setTodoTags(_x3, _x4) {
        return _setTodoTags.apply(this, arguments);
      }
      return setTodoTags;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(userId, todoId) {
        var row, _yield$this$attachTag, _yield$this$attachTag2, todo;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return this.db.get("SELECT * FROM todos WHERE id = ? AND userId = ?", [todoId, userId]);
            case 1:
              row = _context4.v;
              if (row) {
                _context4.n = 2;
                break;
              }
              return _context4.a(2, null);
            case 2:
              _context4.n = 3;
              return this.attachTags([row]);
            case 3:
              _yield$this$attachTag = _context4.v;
              _yield$this$attachTag2 = _slicedToArray(_yield$this$attachTag, 1);
              todo = _yield$this$attachTag2[0];
              return _context4.a(2, todo);
          }
        }, _callee4, this);
      }));
      function getById(_x5, _x6) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId, input) {
        var name, id, importance, axes, dueDate, tags, _input$description, todo, _t2;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              name = (input.name || "").trim();
              if (name) {
                _context5.n = 1;
                break;
              }
              throw new Error("Todo name is required");
            case 1:
              id = input.id || uuidv4();
              importance = normalizeImportance(input.importance);
              axes = resolvePriorityAxes({
                importanceScore: input.importanceScore,
                urgencyScore: input.urgencyScore,
                importance: importance,
                fillDefaults: true
              });
              dueDate = null;
              if (input.dueDate) {
                try {
                  dueDate = toShanghaiISO(input.dueDate);
                } catch (_unused) {
                  dueDate = input.dueDate;
                }
              }
              _context5.n = 2;
              return this.tags.resolveTags(userId, {
                tagIds: input.tagIds,
                tagNames: input.tagNames
              });
            case 2:
              tags = _context5.v;
              _context5.n = 3;
              return this.db.run("BEGIN");
            case 3:
              _context5.p = 3;
              _context5.n = 4;
              return this.db.run("INSERT INTO todos (id, userId, name, description, completed, dueDate, importance, importanceScore, urgencyScore)\n                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, userId, name, (_input$description = input.description) !== null && _input$description !== void 0 ? _input$description : null, input.completed ? 1 : 0, dueDate, importance, axes.importanceScore, axes.urgencyScore]);
            case 4:
              _context5.n = 5;
              return this.setTodoTags(id, tags);
            case 5:
              _context5.n = 6;
              return this.db.run("COMMIT");
            case 6:
              _context5.n = 9;
              break;
            case 7:
              _context5.p = 7;
              _t2 = _context5.v;
              _context5.n = 8;
              return this.db.run("ROLLBACK");
            case 8:
              throw _t2;
            case 9:
              if (!this.addUserLog) {
                _context5.n = 10;
                break;
              }
              _context5.n = 10;
              return this.addUserLog(userId, "todo_created", "Created todo ".concat(name), {
                todoId: id,
                name: name
              });
            case 10:
              _context5.n = 11;
              return this.getById(userId, id);
            case 11:
              todo = _context5.v;
              if (todo) {
                _context5.n = 12;
                break;
              }
              throw new Error("Failed to create todo");
            case 12:
              return _context5.a(2, todo);
          }
        }, _callee5, this, [[3, 7]]);
      }));
      function create(_x7, _x8) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId, todoId, updates) {
        var _existing$description, _existing$importanceS, _existing$urgencyScor;
        var existing, name, description, completed, dueDate, importance, importanceScore, urgencyScore, shouldReplaceTags, tags, _updates$tagIds, _updates$tagNames, todo, _t3;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.n = 1;
              return this.getById(userId, todoId);
            case 1:
              existing = _context6.v;
              if (existing) {
                _context6.n = 2;
                break;
              }
              throw new TodoNotFoundError();
            case 2:
              name = updates.name !== undefined ? String(updates.name).trim() : existing.name;
              if (name) {
                _context6.n = 3;
                break;
              }
              throw new Error("Todo name is required");
            case 3:
              description = updates.description !== undefined ? updates.description : (_existing$description = existing.description) !== null && _existing$description !== void 0 ? _existing$description : null;
              completed = updates.completed !== undefined ? updates.completed : existing.completed;
              dueDate = existing.dueDate !== undefined && existing.dueDate !== null ? existing.dueDate : null;
              if (updates.dueDate !== undefined) {
                if (updates.dueDate === null || updates.dueDate === "") {
                  dueDate = null;
                } else {
                  try {
                    dueDate = toShanghaiISO(updates.dueDate);
                  } catch (_unused2) {
                    dueDate = updates.dueDate;
                  }
                }
              }
              importance = updates.importance !== undefined ? normalizeImportance(updates.importance) : normalizeImportance(existing.importance);
              importanceScore = updates.importanceScore !== undefined ? clampAxisScore(updates.importanceScore) : existing.importanceScore !== undefined ? (_existing$importanceS = existing.importanceScore) !== null && _existing$importanceS !== void 0 ? _existing$importanceS : null : null;
              urgencyScore = updates.urgencyScore !== undefined ? clampAxisScore(updates.urgencyScore) : existing.urgencyScore !== undefined ? (_existing$urgencyScor = existing.urgencyScore) !== null && _existing$urgencyScor !== void 0 ? _existing$urgencyScor : null : null;
              shouldReplaceTags = updates.replaceTags === true || updates.tagIds !== undefined || updates.tagNames !== undefined;
              tags = existing.tags;
              if (!shouldReplaceTags) {
                _context6.n = 5;
                break;
              }
              _context6.n = 4;
              return this.tags.resolveTags(userId, {
                tagIds: (_updates$tagIds = updates.tagIds) !== null && _updates$tagIds !== void 0 ? _updates$tagIds : [],
                tagNames: (_updates$tagNames = updates.tagNames) !== null && _updates$tagNames !== void 0 ? _updates$tagNames : []
              });
            case 4:
              tags = _context6.v;
            case 5:
              _context6.n = 6;
              return this.db.run("BEGIN");
            case 6:
              _context6.p = 6;
              _context6.n = 7;
              return this.db.run("UPDATE todos SET name = ?, description = ?, completed = ?, dueDate = ?, importance = ?, importanceScore = ?, urgencyScore = ?, updatedAt = CURRENT_TIMESTAMP\n                 WHERE id = ? AND userId = ?", [name, description, completed ? 1 : 0, dueDate, importance, importanceScore, urgencyScore, todoId, userId]);
            case 7:
              if (!shouldReplaceTags) {
                _context6.n = 8;
                break;
              }
              _context6.n = 8;
              return this.setTodoTags(todoId, tags);
            case 8:
              _context6.n = 9;
              return this.db.run("COMMIT");
            case 9:
              _context6.n = 12;
              break;
            case 10:
              _context6.p = 10;
              _t3 = _context6.v;
              _context6.n = 11;
              return this.db.run("ROLLBACK");
            case 11:
              throw _t3;
            case 12:
              if (!this.addUserLog) {
                _context6.n = 13;
                break;
              }
              _context6.n = 13;
              return this.addUserLog(userId, "todo_updated", "Updated todo ".concat(todoId), {
                todoId: todoId,
                updates: updates
              });
            case 13:
              _context6.n = 14;
              return this.getById(userId, todoId);
            case 14:
              todo = _context6.v;
              if (todo) {
                _context6.n = 15;
                break;
              }
              throw new TodoNotFoundError();
            case 15:
              return _context6.a(2, todo);
          }
        }, _callee6, this, [[6, 10]]);
      }));
      function update(_x9, _x0, _x1) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(userId, todoId) {
        var _result$changes;
        var result, ok;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return this.db.run("DELETE FROM todos WHERE id = ? AND userId = ?", [todoId, userId]);
            case 1:
              result = _context7.v;
              ok = ((_result$changes = result === null || result === void 0 ? void 0 : result.changes) !== null && _result$changes !== void 0 ? _result$changes : 0) > 0;
              if (!(ok && this.addUserLog)) {
                _context7.n = 2;
                break;
              }
              _context7.n = 2;
              return this.addUserLog(userId, "todo_deleted", "Deleted todo ".concat(todoId), {
                todoId: todoId
              });
            case 2:
              return _context7.a(2, ok);
          }
        }, _callee7, this);
      }));
      function _delete(_x10, _x11) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
    /**
     * 将 tagNames 解析为当前用户的 tagIds，再用于筛选。
     */
  }, {
    key: "resolveFilterTagIds",
    value: (function () {
      var _resolveFilterTagIds = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(userId, tagIds, tagNames) {
        var ids, _iterator3, _step3, raw, name, tag, _i, _Array$from, id, _tag, _t4;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              ids = new Set(tagIds || []);
              if (!(tagNames && tagNames.length > 0)) {
                _context8.n = 10;
                break;
              }
              _iterator3 = _createForOfIteratorHelper(tagNames);
              _context8.p = 1;
              _iterator3.s();
            case 2:
              if ((_step3 = _iterator3.n()).done) {
                _context8.n = 7;
                break;
              }
              raw = _step3.value;
              name = String(raw || "").trim();
              if (name) {
                _context8.n = 3;
                break;
              }
              return _context8.a(3, 6);
            case 3:
              _context8.n = 4;
              return this.tags.getByName(userId, name);
            case 4:
              tag = _context8.v;
              if (tag) {
                _context8.n = 5;
                break;
              }
              return _context8.a(2, ["__no_such_tag__"]);
            case 5:
              ids.add(tag.id);
            case 6:
              _context8.n = 2;
              break;
            case 7:
              _context8.n = 9;
              break;
            case 8:
              _context8.p = 8;
              _t4 = _context8.v;
              _iterator3.e(_t4);
            case 9:
              _context8.p = 9;
              _iterator3.f();
              return _context8.f(9);
            case 10:
              _i = 0, _Array$from = Array.from(ids);
            case 11:
              if (!(_i < _Array$from.length)) {
                _context8.n = 15;
                break;
              }
              id = _Array$from[_i];
              if (!(id === "__no_such_tag__")) {
                _context8.n = 12;
                break;
              }
              return _context8.a(3, 14);
            case 12:
              _context8.n = 13;
              return this.tags.getById(userId, id);
            case 13:
              _tag = _context8.v;
              if (_tag) {
                _context8.n = 14;
                break;
              }
              throw new TagNotFoundError("Tag not found or not owned: ".concat(id));
            case 14:
              _i++;
              _context8.n = 11;
              break;
            case 15:
              return _context8.a(2, Array.from(ids));
          }
        }, _callee8, this, [[1, 8, 9, 10]]);
      }));
      function resolveFilterTagIds(_x12, _x13, _x14) {
        return _resolveFilterTagIds.apply(this, arguments);
      }
      return resolveFilterTagIds;
    }())
  }, {
    key: "getPage",
    value: function () {
      var _getPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(userId, opts) {
        var where, params, like, filterTagIds, placeholders, whereSql, allowedSort, sortField, order, limit, offset, countRow, total, rows, todos;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              where = ["userId = ?"];
              params = [userId];
              if (typeof (opts === null || opts === void 0 ? void 0 : opts.completed) === "boolean") {
                where.push("completed = ?");
                params.push(opts.completed ? 1 : 0);
              }
              if (opts !== null && opts !== void 0 && opts.q) {
                like = "%".concat(opts.q.toLowerCase(), "%");
                where.push("(LOWER(name) LIKE ? OR LOWER(COALESCE(description, '')) LIKE ?)");
                params.push(like, like);
              }
              if (opts !== null && opts !== void 0 && opts.dueAfter) {
                where.push("dueDate >= ?");
                params.push(opts.dueAfter);
              }
              if (opts !== null && opts !== void 0 && opts.dueBefore) {
                where.push("dueDate <= ?");
                params.push(opts.dueBefore);
              }
              _context9.n = 1;
              return this.resolveFilterTagIds(userId, opts === null || opts === void 0 ? void 0 : opts.tagIds, opts === null || opts === void 0 ? void 0 : opts.tagNames);
            case 1:
              filterTagIds = _context9.v;
              if (filterTagIds.length > 0) {
                placeholders = filterTagIds.map(function () {
                  return "?";
                }).join(",");
                where.push("id IN (\n                SELECT todoId FROM todo_tags\n                WHERE tagId IN (".concat(placeholders, ")\n                GROUP BY todoId\n                HAVING COUNT(DISTINCT tagId) = ?\n            )"));
                params.push.apply(params, _toConsumableArray(filterTagIds).concat([filterTagIds.length]));
              }
              whereSql = "WHERE ".concat(where.join(" AND "));
              allowedSort = ["createdAt", "updatedAt", "dueDate", "name", "importance"];
              sortField = allowedSort.includes((opts === null || opts === void 0 ? void 0 : opts.sortBy) || "") ? opts.sortBy : "createdAt";
              order = (opts === null || opts === void 0 ? void 0 : opts.order) === "asc" ? "ASC" : "DESC";
              limit = Math.max(1, Math.min(500, (opts === null || opts === void 0 ? void 0 : opts.limit) || 50));
              offset = Math.max(0, (opts === null || opts === void 0 ? void 0 : opts.offset) || 0);
              _context9.n = 2;
              return this.db.get("SELECT COUNT(*) as cnt FROM todos ".concat(whereSql), params);
            case 2:
              countRow = _context9.v;
              total = countRow ? countRow.cnt || 0 : 0;
              _context9.n = 3;
              return this.db.all("SELECT * FROM todos ".concat(whereSql, " ORDER BY ").concat(sortField, " ").concat(order, " LIMIT ? OFFSET ?"), params.concat([limit, offset]));
            case 3:
              rows = _context9.v;
              _context9.n = 4;
              return this.attachTags(rows);
            case 4:
              todos = _context9.v;
              return _context9.a(2, {
                todos: todos,
                total: total
              });
          }
        }, _callee9, this);
      }));
      function getPage(_x15, _x16) {
        return _getPage.apply(this, arguments);
      }
      return getPage;
    }() /** 按单个标签反查待办 */
  }, {
    key: "getByTagId",
    value: (function () {
      var _getByTagId = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(userId, tagId, opts) {
        var tag;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              _context0.n = 1;
              return this.tags.getById(userId, tagId);
            case 1:
              tag = _context0.v;
              if (tag) {
                _context0.n = 2;
                break;
              }
              throw new TagNotFoundError();
            case 2:
              return _context0.a(2, this.getPage(userId, _objectSpread(_objectSpread({}, opts), {}, {
                tagIds: [tagId]
              })));
          }
        }, _callee0, this);
      }));
      function getByTagId(_x17, _x18, _x19) {
        return _getByTagId.apply(this, arguments);
      }
      return getByTagId;
    }())
  }]);
}();