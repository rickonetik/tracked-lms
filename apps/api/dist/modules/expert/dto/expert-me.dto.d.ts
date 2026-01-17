export declare class ExpertAccountDto {
    id: string;
    slug: string;
    title: string;
    ownerUserId: string;
}
export declare class MembershipDto {
    id: string;
    role: string;
    userId: string;
    expertAccountId: string;
}
export declare class SubscriptionDto {
    id: string;
    status: string;
    plan: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
}
export declare class PermissionsDto {
    platform: string[];
    expert: string[];
}
export declare class ExpertMeResponseDto {
    expertAccount: ExpertAccountDto;
    membership: MembershipDto;
    subscription: SubscriptionDto;
    permissions: PermissionsDto;
}
//# sourceMappingURL=expert-me.dto.d.ts.map