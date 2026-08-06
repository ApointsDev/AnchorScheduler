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
const ROUTES_DIR = path.join(process.cwd(), "server", "routes");

// ── 从 .ts 源文件提取路由注册 ──
function extractRoutesFromSource(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  // Match router.method('path' or router.method("path" across lines
  const regex =
    /router\.(get|post|put|patch|delete|all)\s*\(\s*(["'`])([^"'`]+)\2/g;
  const routes: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const routePath = match[3];
    routes.push(`${method} ${routePath}`);
  }
  return [...new Set(routes)].sort();
}

// ── 已知被注释掉的路由（不应被检测到）──
const COMMENTED_OUT_ROUTES = new Set([
  "POST /register", // authRoutes.ts — 本地注册已禁用
  "POST /login",    // authRoutes.ts — 本地登录已禁用
]);

describe("Route registration contract (snapshot-based)", () => {
  // ── apiRoutes ──────────────────────────────────────────────
  describe("apiRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "apiRoutes.ts"),
      ).filter((r) => !COMMENTED_OUT_ROUTES.has(r));
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });

    test("should have at least 50 routes", () => {
      expect(routes.length).toBeGreaterThanOrEqual(50);
    });
  });

  // ── todoRoutes ─────────────────────────────────────────────
  describe("todoRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "todoRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });

    test("should have at least 15 routes", () => {
      expect(routes.length).toBeGreaterThanOrEqual(15);
    });
  });

  // ── authRoutes ─────────────────────────────────────────────
  describe("authRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "authRoutes.ts"),
      ).filter((r) => !COMMENTED_OUT_ROUTES.has(r));
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });

    test("should have at least 5 routes", () => {
      expect(routes.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ── adminRoutes ────────────────────────────────────────────
  describe("adminRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "adminRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── communityRoutes ────────────────────────────────────────
  describe("communityRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "communityRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── rejectionBufferRoutes ──────────────────────────────────
  describe("rejectionBufferRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "rejectionBufferRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── followRoutes ───────────────────────────────────────────
  describe("followRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "followRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── userProfileRoutes ──────────────────────────────────────
  describe("userProfileRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "userProfileRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── userStatusRoutes ───────────────────────────────────────
  describe("userStatusRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "userStatusRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── chaoxingRoutes ─────────────────────────────────────────
  describe("chaoxingRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "chaoxingRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── algorithmRoutes ────────────────────────────────────────
  describe("algorithmRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "algorithmRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── doubaoRoutes ───────────────────────────────────────────
  describe("doubaoRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "doubaoRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── speechRoutes ───────────────────────────────────────────
  describe("speechRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "speechRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── ebridgeRoutes ──────────────────────────────────────────
  describe("ebridgeRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "ebridgeRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });

  // ── caldavServerRoutes ─────────────────────────────────────
  describe("caldavServerRoutes.ts", () => {
    let routes: string[];

    beforeAll(() => {
      routes = extractRoutesFromSource(
        path.join(ROUTES_DIR, "caldavServerRoutes.ts"),
      );
    });

    test("should have all expected routes registered", () => {
      expect(routes).toMatchSnapshot();
    });
  });
});
