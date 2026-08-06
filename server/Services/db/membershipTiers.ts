// 会员等级与权益定义（MENU-001）
// 等级按 priority 排序：越高 = 越贵、权益越多、消耗时越优先（更贵订阅优先消耗）。
// free 为默认等级，不可购买；其余等级可购买/兑换/赠送。
import { TierNotFoundError } from "./membershipErrors.js";

export type MembershipTierId = "free" | "silver" | "gold" | "platinum";

/** 权益（feature）标记：true = 该等级拥有此权益 */
export interface MembershipTier {
  id: MembershipTierId;
  /** 中文名称 */
  name: string;
  /** 英文名称 */
  nameEn: string;
  /** 等级优先级：越高越贵，多等级并存时更高者优先消耗 */
  priority: number;
  /** 单月价格（CNY）；free 为 0 */
  pricePerMonth: number;
  currency: string;
  /** 单次购买/兑换赠送的天数 */
  durationDays: number;
  tagline: string;
  taglineEn: string;
  /** 权益文案（用于套餐展示） */
  benefits: string[];
  /** 功能访问标记（前端可据此做功能开关） */
  features: Record<string, boolean>;
  /** 是否可购买（free 不可购买） */
  purchasable: boolean;
}

export const MEMBERSHIP_TIERS: Record<MembershipTierId, MembershipTier> = {
  free: {
    id: "free",
    name: "免费版",
    nameEn: "Free",
    priority: 0,
    pricePerMonth: 0,
    currency: "CNY",
    durationDays: 0,
    tagline: "基础时间管理，永远免费",
    taglineEn: "Core scheduling, free forever",
    benefits: [
      "基础日程与待办管理",
      "基础 AI 助手（标准模型）",
      "日历视图与冲突检测",
      "邮件日程智能识别（限量）",
    ],
    features: {
      aiAssistant: true,
      aiAssistantEnhance: false,
      attachments: false,
      priorityQueue: false,
      advancedStats: false,
      teamSchedule: false,
      unlimitedMail: false,
      prioritySupport: false,
    },
    purchasable: false,
  },
  silver: {
    id: "silver",
    name: "银锚会员",
    nameEn: "Silver Anchor",
    priority: 1,
    pricePerMonth: 19,
    currency: "CNY",
    durationDays: 30,
    tagline: "告别时间焦虑的入门之选",
    taglineEn: "Kick the time anxiety away",
    benefits: [
      "包含全部免费版权益",
      "增强 AI 助手（更强模型）",
      "附件上传与日程附件",
      "优先日程处理队列",
      "无限邮件日程智能识别",
    ],
    features: {
      aiAssistant: true,
      aiAssistantEnhance: true,
      attachments: true,
      priorityQueue: true,
      advancedStats: false,
      teamSchedule: false,
      unlimitedMail: true,
      prioritySupport: false,
    },
    purchasable: true,
  },
  gold: {
    id: "gold",
    name: "金锚会员",
    nameEn: "Gold Anchor",
    priority: 2,
    pricePerMonth: 39,
    currency: "CNY",
    durationDays: 30,
    tagline: "高效时间管理者的进阶选择",
    taglineEn: "For the efficiency-minded",
    benefits: [
      "包含全部银锚会员权益",
      "高级统计分析（精力/四象限）",
      "团队日程与共享日历",
      "多设备优先同步",
    ],
    features: {
      aiAssistant: true,
      aiAssistantEnhance: true,
      attachments: true,
      priorityQueue: true,
      advancedStats: true,
      teamSchedule: true,
      unlimitedMail: true,
      prioritySupport: false,
    },
    purchasable: true,
  },
  platinum: {
    id: "platinum",
    name: "铂金锚会员",
    nameEn: "Platinum Anchor",
    priority: 3,
    pricePerMonth: 69,
    currency: "CNY",
    durationDays: 30,
    tagline: "尽享全部权益与专属支持",
    taglineEn: "All access, concierge support",
    benefits: [
      "包含全部金锚会员权益",
      "专属客服优先支持",
      "新功能抢先体验",
      "所有 AI 模型不限量",
    ],
    features: {
      aiAssistant: true,
      aiAssistantEnhance: true,
      attachments: true,
      priorityQueue: true,
      advancedStats: true,
      teamSchedule: true,
      unlimitedMail: true,
      prioritySupport: true,
    },
    purchasable: true,
  },
};

/** 按 priority 升序排列的等级列表（free → platinum） */
export const MEMBERSHIP_TIER_LIST: MembershipTier[] = (
  Object.values(MEMBERSHIP_TIERS) as MembershipTier[]
).sort((a, b) => a.priority - b.priority);

/** 未知等级返回 null（不抛错） */
export function getTierOrNull(id: string): MembershipTier | null {
  return (MEMBERSHIP_TIERS as Record<string, MembershipTier>)[id] || null;
}

/** 未知等级抛出 TierNotFoundError */
export function getTier(id: string): MembershipTier {
  const tier = getTierOrNull(id);
  if (!tier) throw new TierNotFoundError(id);
  return tier;
}

/** 两个等级取较高者（同等级返回该等级） */
export function maxTier(
  a: string,
  b: string,
): MembershipTierId {
  const ta = getTier(a);
  const tb = getTier(b);
  return ta.priority >= tb.priority ? ta.id : tb.id;
}
