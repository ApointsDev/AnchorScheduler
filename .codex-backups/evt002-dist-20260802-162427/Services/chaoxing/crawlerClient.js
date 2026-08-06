function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../Utils/logger.js";
export var CrawlerClient = /*#__PURE__*/function () {
  function CrawlerClient(opts) {
    var _opts$pollIntervalMs, _opts$timeoutMs;
    _classCallCheck(this, CrawlerClient);
    var baseURL = (opts === null || opts === void 0 ? void 0 : opts.baseUrl) || process.env.CRAWLER_BASE_URL || "http://127.0.0.1:8070";
    this.pollIntervalMs = (_opts$pollIntervalMs = opts === null || opts === void 0 ? void 0 : opts.pollIntervalMs) !== null && _opts$pollIntervalMs !== void 0 ? _opts$pollIntervalMs : Number(process.env.CHAOXING_POLL_INTERVAL_MS || 2000);
    this.timeoutMs = (_opts$timeoutMs = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null && _opts$timeoutMs !== void 0 ? _opts$timeoutMs : Number(process.env.CHAOXING_SYNC_TIMEOUT_MS || 180000);
    this.http = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      validateStatus: function validateStatus() {
        return true;
      }
    });
  }
  return _createClass(CrawlerClient, [{
    key: "createJob",
    value: function () {
      var _createJob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(accountId, options) {
        var _options$max_workers, _options$notice_max_p, _options$skip_ended, _res$data, _res$data2, _res$data3, _res$data4, _res$data5;
        var key, res, code, msg;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              key = (options === null || options === void 0 ? void 0 : options.idempotencyKey) || uuidv4();
              _context.n = 1;
              return this.http.post("/v1/crawl-jobs", {
                account_id: accountId,
                mode: (options === null || options === void 0 ? void 0 : options.mode) || "full",
                max_workers: (_options$max_workers = options === null || options === void 0 ? void 0 : options.max_workers) !== null && _options$max_workers !== void 0 ? _options$max_workers : 4,
                notice_max_pages: (_options$notice_max_p = options === null || options === void 0 ? void 0 : options.notice_max_pages) !== null && _options$notice_max_p !== void 0 ? _options$notice_max_p : 10,
                skip_ended: (_options$skip_ended = options === null || options === void 0 ? void 0 : options.skip_ended) !== null && _options$skip_ended !== void 0 ? _options$skip_ended : false
              }, {
                headers: {
                  "Content-Type": "application/json",
                  "Idempotency-Key": key
                }
              });
            case 1:
              res = _context.v;
              if (!(res.status === 202 && (_res$data = res.data) !== null && _res$data !== void 0 && _res$data.job_id)) {
                _context.n = 2;
                break;
              }
              return _context.a(2, res.data);
            case 2:
              if (!(res.status === 409 && (_res$data2 = res.data) !== null && _res$data2 !== void 0 && (_res$data2 = _res$data2.detail) !== null && _res$data2 !== void 0 && _res$data2.active_job_id)) {
                _context.n = 3;
                break;
              }
              return _context.a(2, {
                job_id: res.data.detail.active_job_id,
                status: "running"
              });
            case 3:
              code = ((_res$data3 = res.data) === null || _res$data3 === void 0 || (_res$data3 = _res$data3.detail) === null || _res$data3 === void 0 ? void 0 : _res$data3.code) || res.status;
              msg = _typeof((_res$data4 = res.data) === null || _res$data4 === void 0 ? void 0 : _res$data4.detail) === "object" ? JSON.stringify(res.data.detail) : ((_res$data5 = res.data) === null || _res$data5 === void 0 ? void 0 : _res$data5.detail) || res.statusText;
              throw new Error("createJob failed: ".concat(code, " ").concat(msg));
            case 4:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function createJob(_x, _x2) {
        return _createJob.apply(this, arguments);
      }
      return createJob;
    }()
  }, {
    key: "getJob",
    value: function () {
      var _getJob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(jobId) {
        var res;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return this.http.get("/v1/crawl-jobs/".concat(jobId));
            case 1:
              res = _context2.v;
              if (!(res.status !== 200)) {
                _context2.n = 2;
                break;
              }
              throw new Error("getJob failed: ".concat(res.status, " ").concat(JSON.stringify(res.data)));
            case 2:
              return _context2.a(2, res.data);
          }
        }, _callee2, this);
      }));
      function getJob(_x3) {
        return _getJob.apply(this, arguments);
      }
      return getJob;
    }()
  }, {
    key: "getResult",
    value: function () {
      var _getResult = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(jobId) {
        var _res$data6;
        var res, detail, err;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return this.http.get("/v1/crawl-jobs/".concat(jobId, "/result"));
            case 1:
              res = _context3.v;
              if (!(res.status === 200)) {
                _context3.n = 2;
                break;
              }
              return _context3.a(2, res.data);
            case 2:
              if (!(res.status === 202)) {
                _context3.n = 3;
                break;
              }
              throw new Error("result_not_ready");
            case 3:
              detail = (_res$data6 = res.data) === null || _res$data6 === void 0 ? void 0 : _res$data6.detail;
              err = new Error((detail === null || detail === void 0 ? void 0 : detail.message) || (detail === null || detail === void 0 ? void 0 : detail.code) || "result failed ".concat(res.status));
              err.code = detail === null || detail === void 0 ? void 0 : detail.code;
              err.status = res.status;
              throw err;
            case 4:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function getResult(_x4) {
        return _getResult.apply(this, arguments);
      }
      return getResult;
    }()
  }, {
    key: "waitForJob",
    value: function () {
      var _waitForJob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(jobId) {
        var _this = this;
        var deadline, st, result;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              deadline = Date.now() + this.timeoutMs;
            case 1:
              if (!(Date.now() < deadline)) {
                _context4.n = 7;
                break;
              }
              _context4.n = 2;
              return this.getJob(jobId);
            case 2:
              st = _context4.v;
              if (!(st.status === "succeeded")) {
                _context4.n = 4;
                break;
              }
              _context4.n = 3;
              return this.getResult(jobId);
            case 3:
              result = _context4.v;
              return _context4.a(2, {
                status: st,
                result: result
              });
            case 4:
              if (!(st.status === "failed")) {
                _context4.n = 5;
                break;
              }
              return _context4.a(2, {
                status: st
              });
            case 5:
              _context4.n = 6;
              return new Promise(function (r) {
                return setTimeout(r, _this.pollIntervalMs);
              });
            case 6:
              _context4.n = 1;
              break;
            case 7:
              logger.warn("Chaoxing job ".concat(jobId, " timed out after ").concat(this.timeoutMs, "ms"));
              throw new Error("crawl_timeout");
            case 8:
              return _context4.a(2);
          }
        }, _callee4, this);
      }));
      function waitForJob(_x5) {
        return _waitForJob.apply(this, arguments);
      }
      return waitForJob;
    }()
  }, {
    key: "healthReady",
    value: function () {
      var _healthReady = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var res, _t;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return this.http.get("/health/ready");
            case 1:
              res = _context5.v;
              return _context5.a(2, res.status === 200);
            case 2:
              _context5.p = 2;
              _t = _context5.v;
              return _context5.a(2, false);
          }
        }, _callee5, this, [[0, 2]]);
      }));
      function healthReady() {
        return _healthReady.apply(this, arguments);
      }
      return healthReady;
    }()
  }]);
}();