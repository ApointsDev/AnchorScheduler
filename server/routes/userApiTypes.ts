// 用户个人主页类型
// 注意：这些类型仅用于编译期约束，不参与运行时校验
import type { UserStatusResponse } from "./statusApiTypes";

export interface UserHomepageResponse {
    profile: {
        id: string;
        name: string;
        avatar: string | null;
        signature: string | null;
        isMe: boolean;
        region: { id: string; name: string; createdAt?: string } | null;
        status: UserStatusResponse["status"] | null;
        titles: Array<{
            metric: string;
            metricLabel: string;
            titleLabel: string;
            higherIsBetter: boolean;
            rank: number | null;
            value: number | null;
            title: string | null;
            eligible: boolean;
            totalParticipants: number;
        }>;
    };
}
