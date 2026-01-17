import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { SetSubscriptionStatusDto } from './dto/set-subscription-status.dto';
import { SetSubscriptionStatusResponseDto } from './dto/set-subscription-status.response.dto';
export declare class AdminSubscriptionsController {
    private readonly adminSubscriptionsService;
    constructor(adminSubscriptionsService: AdminSubscriptionsService);
    setSubscriptionStatus(expertAccountId: string, dto: SetSubscriptionStatusDto, req: any): Promise<SetSubscriptionStatusResponseDto>;
}
//# sourceMappingURL=admin-subscriptions.controller.d.ts.map