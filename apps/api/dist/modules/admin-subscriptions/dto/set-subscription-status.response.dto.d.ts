import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client';
export declare class SubscriptionSnapshotDto {
    id: string;
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    currentPeriodEnd: string | null;
    createdAt: string;
}
export declare class SetSubscriptionStatusResponseDto {
    expertAccountId: string;
    subscription: SubscriptionSnapshotDto;
    activeSubscription: SubscriptionSnapshotDto | null;
    changedByUserId: string;
    requestedAt: string;
}
//# sourceMappingURL=set-subscription-status.response.dto.d.ts.map