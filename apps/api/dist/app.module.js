"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const course_structure_module_1 = require("./modules/course-structure/course-structure.module");
const student_module_1 = require("./modules/student/student.module");
const courses_module_1 = require("./modules/courses/courses.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const progress_module_1 = require("./modules/progress/progress.module");
const rbac_test_module_1 = require("./modules/rbac-test/rbac-test.module");
const expert_module_1 = require("./modules/expert/expert.module");
const admin_subscriptions_module_1 = require("./modules/admin-subscriptions/admin-subscriptions.module");
const config_validation_1 = require("./config/config.validation");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: config_validation_1.validateConfig,
                envFilePath: ['.env.local', '.env', '../../.env.local', '../../.env'],
            }),
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            course_structure_module_1.CourseStructureModule,
            student_module_1.StudentModule,
            courses_module_1.CoursesModule,
            lessons_module_1.LessonsModule,
            progress_module_1.ProgressModule,
            rbac_test_module_1.RbacTestModule,
            expert_module_1.ExpertModule,
            admin_subscriptions_module_1.AdminSubscriptionsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map