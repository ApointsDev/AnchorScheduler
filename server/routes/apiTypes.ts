// 路由模块共享类型
// 供 apiRoutes.ts 拆分后的各子路由模块复用

// 身份验证中间件引用
export interface AuthMiddleware {
    (req: any, res: any, next: any): Promise<void>;
}
