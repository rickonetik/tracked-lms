import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client';
export declare class SetSubscriptionStatusDto {
    status: SubscriptionStatus;
    plan: SubscriptionPlan;
    currentPeriodEnd?: string | null;
    reason?: string;
}
//# sourceMappingURL=set-subscription-status.dto.d.ts.map