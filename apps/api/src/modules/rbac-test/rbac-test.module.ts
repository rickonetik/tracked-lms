import { Module } from '@nestjs/common';
import { RbacTestController } from './rbac-test.controller';
import { PrismaService } from '../../common/prisma.service';
import { PlatformRolesGuard } from '../../common/rbac/guards/platform-roles.guard';
import { ExpertRolesGuard } from '../../common/rbac/guards/expert-roles.guard';

// TODO: remove rbac-test module after RBAC verification
@Module({
  controllers: [RbacTestController],
  providers: [PrismaService, PlatformRolesGuard, ExpertRolesGuard],
})
export class RbacTestModule {}
