// 会员 / 兑换码业务错误（MENU-001）
// 供路由层做状态码与错误码映射，参考 archiveErrors.ts 模式。
// 本模块不依赖任何其它业务模块，避免循环依赖。

/** 会员业务错误基类 */
export class MembershipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MembershipError";
  }
}

/** 未知/无效的会员等级 */
export class TierNotFoundError extends MembershipError {
  constructor(tierId: string) {
    super(`Unknown membership tier: ${tierId}`);
    this.name = "TierNotFoundError";
  }
}

/** 兑换码不存在 */
export class RedeemCodeNotFoundError extends MembershipError {
  constructor(code: string) {
    super(`Redeem code not found: ${code}`);
    this.name = "RedeemCodeNotFoundError";
  }
}

/** 兑换码已过期 */
export class RedeemCodeExpiredError extends MembershipError {
  constructor(code: string) {
    super(`Redeem code expired: ${code}`);
    this.name = "RedeemCodeExpiredError";
  }
}

/** 兑换码已停用 */
export class RedeemCodeInactiveError extends MembershipError {
  constructor(code: string) {
    super(`Redeem code inactive: ${code}`);
    this.name = "RedeemCodeInactiveError";
  }
}

/** 兑换码使用次数已达上限 */
export class RedeemCodeExhaustedError extends MembershipError {
  constructor(code: string) {
    super(`Redeem code usage limit reached: ${code}`);
    this.name = "RedeemCodeExhaustedError";
  }
}

/** 当前用户已兑换过该兑换码（防重复使用） */
export class RedeemCodeAlreadyUsedError extends MembershipError {
  constructor(code: string) {
    super(`Redeem code already used by this user: ${code}`);
    this.name = "RedeemCodeAlreadyUsedError";
  }
}

/** 参数不合法（如天数为非正数） */
export class MembershipInvalidArgumentError extends MembershipError {
  constructor(message: string) {
    super(message);
    this.name = "MembershipInvalidArgumentError";
  }
}

/** 内测阶段：购买入口关闭，仅支持兑换码 */
export class PurchaseDisabledError extends MembershipError {
  constructor() {
    super("Purchase is disabled during the beta phase");
    this.name = "PurchaseDisabledError";
  }
}
