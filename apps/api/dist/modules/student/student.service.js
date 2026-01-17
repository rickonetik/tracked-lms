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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let StudentService = class StudentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Получить курсы студента
     * Фильтрует по активным enrollments с учетом срока доступа
     */
    async getMyCourses(userId) {
        const now = new Date();
        const enrollments = await this.prisma.enrollment.findMany({
            where: {
                studentId: userId,
                status: 'active',
                OR: [
                    { accessEnd: null },
                    { accessEnd: { gt: now } },
                ],
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                enrolledAt: 'desc',
            },
        });
        if (enrollments.length === 0) {
            return [];
        }
        // Собираем уникальные courseIds
        const courseIds = [...new Set(enrollments.map((e) => e.course.id))];
        // Step B — Get totalLessons by course (1-2 queries)
        // Получаем модули для всех курсов
        const modules = await this.prisma.module.findMany({
            where: {
                courseId: { in: courseIds },
            },
            select: {
                id: true,
                courseId: true,
            },
        });
        const moduleIds = modules.map((m) => m.id);
        const moduleIdToCourseId = new Map(modules.map((m) => [m.id, m.courseId]));
        // Подсчитываем уроки по модулям
        const lessonsByModule = await this.prisma.lesson.groupBy({
            by: ['moduleId'],
            where: {
                moduleId: { in: moduleIds },
            },
            _count: {
                _all: true,
            },
        });
        // Агрегируем по courseId
        const totalsMap = new Map();
        for (const item of lessonsByModule) {
            const courseId = moduleIdToCourseId.get(item.moduleId);
            if (courseId) {
                totalsMap.set(courseId, (totalsMap.get(courseId) || 0) + item._count._all);
            }
        }
        // Step C — Get completedLessons by course (1-2 queries)
        // Получаем уроки для модулей
        const lessons = await this.prisma.lesson.findMany({
            where: {
                moduleId: { in: moduleIds },
            },
            select: {
                id: true,
                moduleId: true,
            },
        });
        const lessonIds = lessons.map((l) => l.id);
        const lessonIdToCourseId = new Map(lessons.map((l) => {
            const courseId = moduleIdToCourseId.get(l.moduleId);
            return [l.id, courseId];
        }));
        // Получаем завершенные уроки
        const completedProgress = await this.prisma.lessonProgress.findMany({
            where: {
                studentId: userId,
                completedAt: { not: null },
                lessonId: { in: lessonIds },
            },
            select: {
                lessonId: true,
            },
        });
        // Подсчитываем completed по courseId
        const completedMap = new Map();
        for (const progress of completedProgress) {
            const courseId = lessonIdToCourseId.get(progress.lessonId);
            if (courseId) {
                completedMap.set(courseId, (completedMap.get(courseId) || 0) + 1);
            }
        }
        // Step D — Assemble response
        return enrollments.map((enrollment) => {
            const courseId = enrollment.course.id;
            const totalLessons = totalsMap.get(courseId) ?? 0;
            const completedLessons = completedMap.get(courseId) ?? 0;
            const progressPercent = totalLessons === 0 ? 0 : Math.floor((completedLessons / totalLessons) * 100);
            return {
                id: enrollment.course.id,
                title: enrollment.course.title,
                description: enrollment.course.description ?? null,
                totalLessons,
                completedLessons,
                progressPercent,
            };
        });
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentService);
//# sourceMappingURL=student.service.js.map