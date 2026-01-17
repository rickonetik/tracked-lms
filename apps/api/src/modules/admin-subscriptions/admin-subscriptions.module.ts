import { Module } from '@nestjs/common';
import { AdminSubscriptionsController } from './admin-subscriptions.controller';
import { AdminSubscriptionsService } from './admin-subscriptions.service';
import { PrismaService } from '../../common/prisma.service';
import { PlatformRolesGuard } from '../../common/rbac/guards/platform-roles.guard';

@Module({
  controllers: [AdminSubscriptionsController],
  providers: [AdminSubscriptionsService, PrismaService, PlatformRolesGuard],
})
export class AdminSubscriptionsModule {}
