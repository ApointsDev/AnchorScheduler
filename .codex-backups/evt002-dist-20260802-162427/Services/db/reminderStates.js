function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var REMINDER_KINDS = ["schedule_start", "todo_start", "todo_deadline"];
export var REMINDER_STATUSES = ["unread", "read", "dismissed"];
function statusRank(status) {
  if (status === "read") return 2;
  if (status === "dismissed") return 1;
  return 0;
}
function shouldApply(existing, incoming) {
  if (!existing) return true;

  // Read/dismissed is monotonic across devices. A stale offline client must
  // never turn a reminder unread again after another device consumed it.
  if (existing.status !== "unread" && incoming.status === "unread") {
    return false;
  }
  if (existing.status === "unread" && incoming.status !== "unread") {
    return true;
  }
  if (incoming.updatedAt !== existing.clientUpdatedAt) {
    return incoming.updatedAt > existing.clientUpdatedAt;
  }
  return statusRank(incoming.status) > statusRank(existing.status);
}
function mapRow(row) {
  return {
    id: row.reminderId,
    kind: row.kind,
    sourceId: row.sourceId,
    triggeredAt: Number(row.triggeredAt),
    status: row.status,
    updatedAt: Number(row.clientUpdatedAt),
    version: Number(row.version)
  };
}
export var ReminderStateStore = /*#__PURE__*/function () {
  function ReminderStateStore(db) {
    _classCallCheck(this, ReminderStateStore);
    _defineProperty(this, "mutationQueue", Promise.resolve());
    this.db = db;
  }
  return _createClass(ReminderStateStore, [{
    key: "listSince",
    value: function () {
      var _listSince = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId) {
        var sinceVersion,
          versionRow,
          version,
          rows,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              sinceVersion = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
              _context.n = 1;
              return this.db.get("SELECT version FROM reminder_sync_versions WHERE userId = ?", [userId]);
            case 1:
              versionRow = _context.v;
              version = Number(versionRow === null || versionRow === void 0 ? void 0 : versionRow.version) || 0;
              _context.n = 2;
              return this.db.all("SELECT reminderId, kind, sourceId, triggeredAt, status,\n                    clientUpdatedAt, version\n             FROM reminder_states\n             WHERE userId = ? AND version > ?\n             ORDER BY version ASC, reminderId ASC", [userId, Math.max(0, Math.floor(sinceVersion))]);
            case 2:
              rows = _context.v;
              return _context.a(2, {
                states: rows.map(mapRow),
                version: version
              });
          }
        }, _callee, this);
      }));
      function listSince(_x) {
        return _listSince.apply(this, arguments);
      }
      return listSince;
    }()
  }, {
    key: "sync",
    value: function () {
      var _sync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(userId, sinceVersion, changes) {
        var _this = this;
        var operation;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              operation = this.mutationQueue.then(function () {
                return _this.performSync(userId, sinceVersion, changes);
              });
              this.mutationQueue = operation.then(function () {
                return undefined;
              }, function () {
                return undefined;
              });
              return _context2.a(2, operation);
          }
        }, _callee2, this);
      }));
      function sync(_x2, _x3, _x4) {
        return _sync.apply(this, arguments);
      }
      return sync;
    }()
  }, {
    key: "performSync",
    value: function () {
      var _performSync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userId, sinceVersion, changes) {
        var deduplicated, _iterator, _step, _change, incoming, versionRow, version, _i, _incoming, change, existing, ids, idClause, rows, _t;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              deduplicated = new Map();
              _iterator = _createForOfIteratorHelper(changes);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _change = _step.value;
                  deduplicated.set(_change.id, _change);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              incoming = Array.from(deduplicated.values());
              _context3.n = 1;
              return this.db.exec("BEGIN IMMEDIATE");
            case 1:
              _context3.p = 1;
              _context3.n = 2;
              return this.db.get("SELECT version FROM reminder_sync_versions WHERE userId = ?", [userId]);
            case 2:
              versionRow = _context3.v;
              version = Number(versionRow === null || versionRow === void 0 ? void 0 : versionRow.version) || 0;
              _i = 0, _incoming = incoming;
            case 3:
              if (!(_i < _incoming.length)) {
                _context3.n = 7;
                break;
              }
              change = _incoming[_i];
              _context3.n = 4;
              return this.db.get("SELECT reminderId, kind, sourceId, triggeredAt, status,\n                            clientUpdatedAt, version\n                     FROM reminder_states\n                     WHERE userId = ? AND reminderId = ?", [userId, change.id]);
            case 4:
              existing = _context3.v;
              if (shouldApply(existing, change)) {
                _context3.n = 5;
                break;
              }
              return _context3.a(3, 6);
            case 5:
              version += 1;
              _context3.n = 6;
              return this.db.run("INSERT INTO reminder_states (\n                        userId, reminderId, kind, sourceId, triggeredAt,\n                        status, clientUpdatedAt, version, updatedAt\n                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)\n                     ON CONFLICT(userId, reminderId) DO UPDATE SET\n                        kind = excluded.kind,\n                        sourceId = excluded.sourceId,\n                        triggeredAt = excluded.triggeredAt,\n                        status = excluded.status,\n                        clientUpdatedAt = excluded.clientUpdatedAt,\n                        version = excluded.version,\n                        updatedAt = CURRENT_TIMESTAMP", [userId, change.id, change.kind, change.sourceId, change.triggeredAt, change.status, change.updatedAt, version]);
            case 6:
              _i++;
              _context3.n = 3;
              break;
            case 7:
              _context3.n = 8;
              return this.db.run("INSERT INTO reminder_sync_versions (userId, version)\n                 VALUES (?, ?)\n                 ON CONFLICT(userId) DO UPDATE SET version = excluded.version", [userId, version]);
            case 8:
              ids = incoming.map(function (change) {
                return change.id;
              });
              idClause = ids.length ? " OR reminderId IN (".concat(ids.map(function () {
                return "?";
              }).join(","), ")") : "";
              _context3.n = 9;
              return this.db.all("SELECT reminderId, kind, sourceId, triggeredAt, status,\n                        clientUpdatedAt, version\n                 FROM reminder_states\n                 WHERE userId = ? AND (version > ?".concat(idClause, ")\n                 ORDER BY version ASC, reminderId ASC"), [userId, Math.max(0, Math.floor(sinceVersion))].concat(_toConsumableArray(ids)));
            case 9:
              rows = _context3.v;
              _context3.n = 10;
              return this.db.exec("COMMIT");
            case 10:
              return _context3.a(2, {
                states: rows.map(mapRow),
                version: version
              });
            case 11:
              _context3.p = 11;
              _t = _context3.v;
              _context3.n = 12;
              return this.db.exec("ROLLBACK");
            case 12:
              throw _t;
            case 13:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 11]]);
      }));
      function performSync(_x5, _x6, _x7) {
        return _performSync.apply(this, arguments);
      }
      return performSync;
    }()
  }]);
}();
