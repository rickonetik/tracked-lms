import { Module } from '@nestjs/common';
import { CourseStructureService } from './course-structure.service';
import { CourseStructureController } from './course-structure.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [CourseStructureController],
  providers: [CourseStructureService, PrismaService],
  exports: [CourseStructureService],
})
export class CourseStructureModule {}
