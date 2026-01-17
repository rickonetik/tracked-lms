import { Module } from '@nestjs/common';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [ExpertController],
  providers: [ExpertService, PrismaService],
})
export class ExpertModule {}
