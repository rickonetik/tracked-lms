import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourseStructureModule } from './modules/course-structure/course-structure.module';
import { StudentModule } from './modules/student/student.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ProgressModule } from './modules/progress/progress.module';
import { RbacTestModule } from './modules/rbac-test/rbac-test.module';
import { ExpertModule } from './modules/expert/expert.module';
import { AdminSubscriptionsModule } from './modules/admin-subscriptions/admin-subscriptions.module';
import { validateConfig } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
      envFilePath: ['.env.local', '.env', '../../.env.local', '../../.env'],
    }),
    HealthModule,
    AuthModule,
    CourseStructureModule,
    StudentModule,
    CoursesModule,
    LessonsModule,
    ProgressModule,
    RbacTestModule,
    ExpertModule,
    AdminSubscriptionsModule,
  ],
})
export class AppModule {}
