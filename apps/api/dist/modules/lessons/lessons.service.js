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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const enrollment_policy_1 = require("../../common/policies/enrollment.policy");
let LessonsService = class LessonsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Получить урок для студента
     * Проверяет наличие урока и активный enrollment на курс
     */
    async getLessonForStudent(lessonId, studentId) {
        // Шаг 1: Проверяем существование урока
        const lessonExists = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { id: true },
        });
        if (!lessonExists) {
            throw new common_1.NotFoundException({
                message: 'Lesson not found',
                error: 'LESSON_NOT_FOUND',
                statusCode: 404,
            });
        }
        // Шаг 2: Проверяем доступ через policy
        // policy сама бросит 403 ENROLLMENT_REQUIRED если доступа нет
        await (0, enrollment_policy_1.hasActiveEnrollmentForLesson)(this.prisma, studentId, lessonId, true);
        // Шаг 3: Загружаем данные урока
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                moduleId: true,
                title: true,
                description: true,
                position: true,
            },
        });
        // TypeScript гарантирует, что lesson не null после findUnique
        // но для безопасности добавим проверку
        if (!lesson) {
            throw new common_1.NotFoundException({
                message: 'Lesson not found',
                error: 'LESSON_NOT_FOUND',
                statusCode: 404,
            });
        }
        // Шаг 4: Проверяем, пройден ли урок текущим студентом
        const lessonProgress = await this.prisma.lessonProgress.findUnique({
            where: {
                lessonId_studentId: {
                    lessonId,
                    studentId,
                },
            },
            select: {
                completedAt: true,
            },
        });
        // Возвращаем DTO с video = null (placeholder для EPIC 5) и completedAt
        return {
            id: lesson.id,
            moduleId: lesson.moduleId,
            title: lesson.title,
            description: lesson.description ?? null,
            position: lesson.position,
            video: null,
            completedAt: lessonProgress?.completedAt?.toISOString() ?? null,
        };
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map