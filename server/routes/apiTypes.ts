// 路由模块共享类型
// 供 apiRoutes.ts 拆分后的各子路由模块复用

import type { User } from "../index";
import type { School } from "../Services/db/schools.js";

// 身份验证中间件引用
export interface AuthMiddleware {
    (req: any, res: any, next: any): Promise<void>;
}

// 全局扩展 Express.Request，使路由 handler 可用 Request 类型直接访问
// req.user / req.school（由 authenticateToken / DA 守卫中间件写入）
declare global {
    namespace Express {
        interface Request {
            user?: User;
            school?: School;
        }
    }
}
