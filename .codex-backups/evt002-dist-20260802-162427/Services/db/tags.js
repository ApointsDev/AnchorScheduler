function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
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
// 标签 CRUD — 用户级标签，(userId, name) 唯一

import { v4 as uuidv4 } from "uuid";
import { mapRowToTag } from "./todoMapper.js";
export var TagConflictError = /*#__PURE__*/function (_Error) {
  function TagConflictError() {
    var _this;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Tag name already exists";
    _classCallCheck(this, TagConflictError);
    _this = _callSuper(this, TagConflictError, [message]);
    _this.name = "TagConflictError";
    return _this;
  }
  _inherits(TagConflictError, _Error);
  return _createClass(TagConflictError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
export var TagNotFoundError = /*#__PURE__*/function (_Error2) {
  function TagNotFoundError() {
    var _this2;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Tag not found";
    _classCallCheck(this, TagNotFoundError);
    _this2 = _callSuper(this, TagNotFoundError, [message]);
    _this2.name = "TagNotFoundError";
    return _this2;
  }
  _inherits(TagNotFoundError, _Error2);
  return _createClass(TagNotFoundError);
}(/*#__PURE__*/_wrapNativeSuper(Error));
export var TagStore = /*#__PURE__*/function () {
  function TagStore(db) {
    _classCallCheck(this, TagStore);
    this.db = db;
  }
  return _createClass(TagStore, [{
    key: "listByUser",
    value: function () {
      var _listByUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId) {
        var rows;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.db.all("SELECT * FROM tags WHERE userId = ? ORDER BY name ASC", [userId]);
            case 1:
              rows = _context.v;
              return _context.a(2, rows.map(mapRowToTag));
          }
        }, _callee, this);
      }));
      function listByUser(_x) {
        return _listByUser.apply(this, arguments);
      }
      return listByUser;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId, tagId) {
        var row;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.db.get("SELECT * FROM tags WHERE id = ? AND userId = ?", [tagId, userId]);
            case 1:
              row = _context2.v;
              if (row) {
                _context2.n = 2;
                break;
              }
              return _context2.a(2, null);
            case 2:
              return _context2.a(2, mapRowToTag(row));
          }
        }, _callee2, this);
      }));
      function getById(_x2, _x3) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "getByName",
    value: function () {
      var _getByName = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userId, name) {
        var row;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.db.get("SELECT * FROM tags WHERE userId = ? AND name = ?", [userId, name]);
            case 1:
              row = _context3.v;
              if (row) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2, null);
            case 2:
              return _context3.a(2, mapRowToTag(row));
          }
        }, _callee3, this);
      }));
      function getByName(_x4, _x5) {
        return _getByName.apply(this, arguments);
      }
      return getByName;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(userId, input) {
        var name, id, msg, tag, _t;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              name = (input.name || "").trim();
              if (name) {
                _context4.n = 1;
                break;
              }
              throw new Error("Tag name is required");
            case 1:
              id = input.id || uuidv4();
              _context4.p = 2;
              _context4.n = 3;
              return this.db.run("INSERT INTO tags (id, userId, name, color) VALUES (?, ?, ?, ?)", [id, userId, name, input.color || null]);
            case 3:
              _context4.n = 6;
              break;
            case 4:
              _context4.p = 4;
              _t = _context4.v;
              msg = String((_t === null || _t === void 0 ? void 0 : _t.message) || _t);
              if (!(msg.includes("UNIQUE") || msg.includes("unique"))) {
                _context4.n = 5;
                break;
              }
              throw new TagConflictError("Tag name already exists: ".concat(name));
            case 5:
              throw _t;
            case 6:
              _context4.n = 7;
              return this.getById(userId, id);
            case 7:
              tag = _context4.v;
              if (tag) {
                _context4.n = 8;
                break;
              }
              throw new Error("Failed to create tag");
            case 8:
              return _context4.a(2, tag);
          }
        }, _callee4, this, [[2, 4]]);
      }));
      function create(_x6, _x7) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId, tagId, updates) {
        var existing, name, color, msg, tag, _t2;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.n = 1;
              return this.getById(userId, tagId);
            case 1:
              existing = _context5.v;
              if (existing) {
                _context5.n = 2;
                break;
              }
              throw new TagNotFoundError();
            case 2:
              name = updates.name !== undefined ? String(updates.name).trim() : existing.name;
              if (name) {
                _context5.n = 3;
                break;
              }
              throw new Error("Tag name is required");
            case 3:
              color = updates.color !== undefined ? updates.color || null : existing.color || null;
              _context5.p = 4;
              _context5.n = 5;
              return this.db.run("UPDATE tags SET name = ?, color = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?", [name, color, tagId, userId]);
            case 5:
              _context5.n = 8;
              break;
            case 6:
              _context5.p = 6;
              _t2 = _context5.v;
              msg = String((_t2 === null || _t2 === void 0 ? void 0 : _t2.message) || _t2);
              if (!(msg.includes("UNIQUE") || msg.includes("unique"))) {
                _context5.n = 7;
                break;
              }
              throw new TagConflictError("Tag name already exists: ".concat(name));
            case 7:
              throw _t2;
            case 8:
              _context5.n = 9;
              return this.getById(userId, tagId);
            case 9:
              tag = _context5.v;
              if (tag) {
                _context5.n = 10;
                break;
              }
              throw new TagNotFoundError();
            case 10:
              return _context5.a(2, tag);
          }
        }, _callee5, this, [[4, 6]]);
      }));
      function update(_x8, _x9, _x0) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(userId, tagId) {
        var _result$changes;
        var result;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return this.db.run("DELETE FROM tags WHERE id = ? AND userId = ?", [tagId, userId]);
            case 1:
              result = _context6.v;
              return _context6.a(2, ((_result$changes = result === null || result === void 0 ? void 0 : result.changes) !== null && _result$changes !== void 0 ? _result$changes : 0) > 0);
          }
        }, _callee6, this);
      }));
      function _delete(_x1, _x10) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
    /**
     * 校验 tagIds 归属当前用户，并按 name 查找或创建。
     * 返回去重后的 Tag 列表。
     */
  }, {
    key: "resolveTags",
    value: (function () {
      var _resolveTags = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(userId, opts) {
        var byId, tagIds, placeholders, rows, found, _iterator, _step, id, _iterator2, _step2, row, tag, names, _iterator3, _step3, name, _tag, _t3, _t4;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              byId = new Map();
              tagIds = ((opts === null || opts === void 0 ? void 0 : opts.tagIds) || []).filter(Boolean);
              if (!(tagIds.length > 0)) {
                _context7.n = 9;
                break;
              }
              placeholders = tagIds.map(function () {
                return "?";
              }).join(",");
              _context7.n = 1;
              return this.db.all("SELECT * FROM tags WHERE userId = ? AND id IN (".concat(placeholders, ")"), [userId].concat(_toConsumableArray(tagIds)));
            case 1:
              rows = _context7.v;
              found = new Set(rows.map(function (r) {
                return r.id;
              }));
              _iterator = _createForOfIteratorHelper(tagIds);
              _context7.p = 2;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context7.n = 5;
                break;
              }
              id = _step.value;
              if (found.has(id)) {
                _context7.n = 4;
                break;
              }
              throw new TagNotFoundError("Tag not found or not owned: ".concat(id));
            case 4:
              _context7.n = 3;
              break;
            case 5:
              _context7.n = 7;
              break;
            case 6:
              _context7.p = 6;
              _t3 = _context7.v;
              _iterator.e(_t3);
            case 7:
              _context7.p = 7;
              _iterator.f();
              return _context7.f(7);
            case 8:
              _iterator2 = _createForOfIteratorHelper(rows);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  row = _step2.value;
                  tag = mapRowToTag(row);
                  byId.set(tag.id, tag);
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            case 9:
              names = ((opts === null || opts === void 0 ? void 0 : opts.tagNames) || []).map(function (n) {
                return String(n || "").trim();
              }).filter(Boolean);
              _iterator3 = _createForOfIteratorHelper(names);
              _context7.p = 10;
              _iterator3.s();
            case 11:
              if ((_step3 = _iterator3.n()).done) {
                _context7.n = 16;
                break;
              }
              name = _step3.value;
              _context7.n = 12;
              return this.getByName(userId, name);
            case 12:
              _tag = _context7.v;
              if (_tag) {
                _context7.n = 14;
                break;
              }
              _context7.n = 13;
              return this.create(userId, {
                name: name
              });
            case 13:
              _tag = _context7.v;
            case 14:
              byId.set(_tag.id, _tag);
            case 15:
              _context7.n = 11;
              break;
            case 16:
              _context7.n = 18;
              break;
            case 17:
              _context7.p = 17;
              _t4 = _context7.v;
              _iterator3.e(_t4);
            case 18:
              _context7.p = 18;
              _iterator3.f();
              return _context7.f(18);
            case 19:
              return _context7.a(2, Array.from(byId.values()));
          }
        }, _callee7, this, [[10, 17, 18, 19], [2, 6, 7, 8]]);
      }));
      function resolveTags(_x11, _x12) {
        return _resolveTags.apply(this, arguments);
      }
      return resolveTags;
    }())
  }]);
}();