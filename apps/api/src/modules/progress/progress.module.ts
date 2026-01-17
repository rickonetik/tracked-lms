import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService, PrismaService],
})
export class ProgressModule {}
