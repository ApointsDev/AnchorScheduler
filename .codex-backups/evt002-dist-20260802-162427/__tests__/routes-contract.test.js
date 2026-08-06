function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * 全接口注册合约测试（快照驱动）
 *
 * 目的：捕获任何路由被意外删除或重命名的情况。
 *
 * 策略：解析路由源文件中的 router.get/post/put/patch/delete/all 调用，
 * 生成稳定快照，与实时解析结果比对。
 *
 * 无需导入任何服务模块 — 纯文件解析，零依赖问题。
 */

import * as fs from "fs";
import * as path from "path";

// 测试在 server/__tests__/ 下运行，cwd 为项目根
var ROUTES_DIR = path.join(process.cwd(), "server", "routes");

// ── 从 .ts 源文件提取路由注册 ──
function extractRoutesFromSource(filePath) {
  var content = fs.readFileSync(filePath, "utf-8");
  // Match router.method('path' or router.method("path" across lines
  var regex = /router\.(get|post|put|patch|delete|all)\s*\(\s*(["'`])([^"'`]+)\2/g;
  var routes = [];
  var match;
  while ((match = regex.exec(content)) !== null) {
    var method = match[1].toUpperCase();
    var routePath = match[3];
    routes.push("".concat(method, " ").concat(routePath));
  }
  return _toConsumableArray(new Set(routes)).sort();
}

// ── 已知被注释掉的路由（不应被检测到）──
var COMMENTED_OUT_ROUTES = new Set(["POST /register",
// authRoutes.ts — 本地注册已禁用
"POST /login" // authRoutes.ts — 本地登录已禁用
]);
describe("Route registration contract (snapshot-based)", function () {
  // ── apiRoutes ──────────────────────────────────────────────
  describe("apiRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "apiRoutes.ts")).filter(function (r) {
        return !COMMENTED_OUT_ROUTES.has(r);
      });
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
    test("should have at least 50 routes", function () {
      expect(routes.length).toBeGreaterThanOrEqual(50);
    });
  });

  // ── todoRoutes ─────────────────────────────────────────────
  describe("todoRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "todoRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
    test("should have at least 15 routes", function () {
      expect(routes.length).toBeGreaterThanOrEqual(15);
    });
  });

  // ── authRoutes ─────────────────────────────────────────────
  describe("authRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "authRoutes.ts")).filter(function (r) {
        return !COMMENTED_OUT_ROUTES.has(r);
      });
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
    test("should have at least 5 routes", function () {
      expect(routes.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ── adminRoutes ────────────────────────────────────────────
  describe("adminRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "adminRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── communityRoutes ────────────────────────────────────────
  describe("communityRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "communityRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── rejectionBufferRoutes ──────────────────────────────────
  describe("rejectionBufferRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "rejectionBufferRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── followRoutes ───────────────────────────────────────────
  describe("followRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "followRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── userProfileRoutes ──────────────────────────────────────
  describe("userProfileRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "userProfileRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── userStatusRoutes ───────────────────────────────────────
  describe("userStatusRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "userStatusRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── chaoxingRoutes ─────────────────────────────────────────
  describe("chaoxingRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "chaoxingRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── algorithmRoutes ────────────────────────────────────────
  describe("algorithmRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "algorithmRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── doubaoRoutes ───────────────────────────────────────────
  describe("doubaoRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "doubaoRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── speechRoutes ───────────────────────────────────────────
  describe("speechRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "speechRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── ebridgeRoutes ──────────────────────────────────────────
  describe("ebridgeRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "ebridgeRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── caldavServerRoutes ─────────────────────────────────────
  describe("caldavServerRoutes.ts", function () {
    var routes;
    beforeAll(function () {
      routes = extractRoutesFromSource(path.join(ROUTES_DIR, "caldavServerRoutes.ts"));
    });
    test("should have all expected routes registered", function () {
      expect(routes).toMatchSnapshot();
    });
  });
});