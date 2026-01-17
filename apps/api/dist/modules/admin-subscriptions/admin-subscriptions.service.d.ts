import { PrismaService } from '../../common/prisma.service';
import { SetSubscriptionStatusDto } from './dto/set-subscription-status.dto';
import { SetSubscriptionStatusResponseDto } from './dto/set-subscription-status.response.dto';
export declare class AdminSubscriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    setSubscriptionStatus(expertAccountId: string, dto: SetSubscriptionStatusDto, changedByUserId: string): Promise<SetSubscriptionStatusResponseDto>;
}
//# sourceMappingURL=admin-subscriptions.service.d.ts.map