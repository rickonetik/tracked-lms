"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const enrollment_policy_1 = require("../../common/policies/enrollment.policy");
let CoursesService = class CoursesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Получить курс для студента с полной структурой (modules + lessons)
     * Проверяет наличие курса и активный enrollment
     */
    async getCourseForStudent(courseId, studentId) {
        // Проверяем существование курса
        const courseExists = await this.prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true },
        });
        if (!courseExists) {
            throw new common_1.NotFoundException({
                message: 'Course not found',
                error: 'COURSE_NOT_FOUND',
                statusCode: 404,
            });
        }
        // Проверяем доступ через policy
        await (0, enrollment_policy_1.hasActiveEnrollment)(this.prisma, studentId, courseId, true);
        // Получаем структуру курса с модулями и уроками
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            select: {
                id: true,
                title: true,
                description: true,
                topicId: true,
                status: true,
                modules: {
                    orderBy: { position: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        position: true,
                        lessons: {
                            orderBy: { position: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                position: true,
                            },
                        },
                    },
                },
            },
        });
        // TypeScript гарантирует, что course не null после findUnique
        // но для безопасности добавим проверку
        if (!course) {
            throw new common_1.NotFoundException({
                message: 'Course not found',
                error: 'COURSE_NOT_FOUND',
                statusCode: 404,
            });
        }
        return course;
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map