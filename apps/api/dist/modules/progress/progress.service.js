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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const enrollment_policy_1 = require("../../common/policies/enrollment.policy");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async completeLesson(studentId, lessonId) {
        // Step A — Load lesson + courseId
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                module: {
                    select: {
                        course: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
        if (!lesson) {
            throw new common_1.NotFoundException({
                message: 'Lesson not found',
                error: 'LESSON_NOT_FOUND',
                statusCode: 404,
            });
        }
        const courseId = lesson.module.course.id;
        // Step B — Access check
        await (0, enrollment_policy_1.hasActiveEnrollmentForLesson)(this.prisma, studentId, lessonId, true);
        // Step C — Idempotent completion
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            // Проверяем существующий прогресс
            const existing = await tx.lessonProgress.findUnique({
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
            // Если уже завершен — ничего не меняем (идемпотентность)
            if (existing?.completedAt) {
                return;
            }
            // Иначе создаем или обновляем запись (completedAt будет null или запись не существует)
            await tx.lessonProgress.upsert({
                where: {
                    lessonId_studentId: {
                        lessonId,
                        studentId,
                    },
                },
                create: {
                    lessonId,
                    studentId,
                    completedAt: now,
                },
                update: {
                    completedAt: now,
                },
            });
        });
        // Step D — Return course progress snapshot
        // totalLessons: count всех lessons в курсе
        const totalLessons = await this.prisma.lesson.count({
            where: {
                module: {
                    courseId,
                },
            },
        });
        // completedLessons: count lesson_progress где completedAt != null
        const completedLessons = await this.prisma.lessonProgress.count({
            where: {
                studentId,
                completedAt: {
                    not: null,
                },
                lesson: {
                    module: {
                        courseId,
                    },
                },
            },
        });
        // progressPercent: floor((completedLessons / totalLessons) * 100)
        const progressPercent = totalLessons === 0 ? 0 : Math.floor((completedLessons / totalLessons) * 100);
        return {
            courseId,
            totalLessons,
            completedLessons,
            progressPercent,
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map