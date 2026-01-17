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
exports.CourseStructureService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
const POSITION_STEP = 10;
let CourseStructureService = class CourseStructureService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Создает модуль в курсе
     * Позиция автоматически устанавливается как max(position) + POSITION_STEP
     */
    async createModule(courseId, dto) {
        // Проверяем существование курса
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with id ${courseId} not found`);
        }
        // Получаем максимальную позицию
        const maxPositionResult = await this.prisma.module.aggregate({
            where: { courseId },
            _max: { position: true },
        });
        const nextPosition = (maxPositionResult._max.position ?? 0) + POSITION_STEP;
        // Создаем модуль
        return await this.prisma.module.create({
            data: {
                courseId,
                title: dto.title,
                description: dto.description,
                position: nextPosition,
            },
        });
    }
    /**
     * Создает урок в модуле
     * Позиция автоматически устанавливается как max(position) + POSITION_STEP
     */
    async createLesson(moduleId, dto) {
        // Проверяем существование модуля
        const module = await this.prisma.module.findUnique({
            where: { id: moduleId },
        });
        if (!module) {
            throw new common_1.NotFoundException(`Module with id ${moduleId} not found`);
        }
        // Получаем максимальную позицию
        const maxPositionResult = await this.prisma.lesson.aggregate({
            where: { moduleId },
            _max: { position: true },
        });
        const nextPosition = (maxPositionResult._max.position ?? 0) + POSITION_STEP;
        // Создаем урок
        return await this.prisma.lesson.create({
            data: {
                moduleId,
                title: dto.title,
                description: dto.description,
                position: nextPosition,
            },
        });
    }
    /**
     * Переупорядочивает модули в курсе
     * Использует двухфазное обновление для избежания unique конфликтов
     */
    async reorderModules(courseId, dto) {
        // Проверяем существование курса
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with id ${courseId} not found`);
        }
        // Проверяем на дубликаты в orderedIds
        const uniqueIds = new Set(dto.orderedIds);
        if (uniqueIds.size !== dto.orderedIds.length) {
            throw new common_1.BadRequestException({
                message: 'Duplicate IDs found in orderedIds',
                error: 'DUPLICATE_IDS',
                statusCode: 400,
            });
        }
        // Получаем все модули курса
        const modules = await this.prisma.module.findMany({
            where: { courseId },
        });
        // Проверяем принадлежность и полноту
        const moduleIds = new Set(modules.map((m) => m.id));
        const requestedIds = new Set(dto.orderedIds);
        // Проверяем, что все запрошенные ID существуют и принадлежат курсу
        for (const id of dto.orderedIds) {
            if (!moduleIds.has(id)) {
                throw new common_1.BadRequestException({
                    message: `Module with id ${id} not found in course ${courseId}`,
                    error: 'FOREIGN_ID',
                    statusCode: 400,
                });
            }
        }
        // Проверяем, что все модули курса включены в новый порядок
        if (moduleIds.size !== requestedIds.size) {
            throw new common_1.BadRequestException({
                message: `OrderedIds must contain all modules from course. Expected ${moduleIds.size}, got ${requestedIds.size}`,
                error: 'MISSING_IDS',
                statusCode: 400,
            });
        }
        // Двухфазное обновление в транзакции
        return await this.prisma.$transaction(async (tx) => {
            // Фаза 1: Устанавливаем все позиции в отрицательные значения
            for (let i = 0; i < dto.orderedIds.length; i++) {
                await tx.module.update({
                    where: { id: dto.orderedIds[i] },
                    data: { position: -(i + 1) * POSITION_STEP },
                });
            }
            // Фаза 2: Устанавливаем правильные позиции
            for (let i = 0; i < dto.orderedIds.length; i++) {
                await tx.module.update({
                    where: { id: dto.orderedIds[i] },
                    data: { position: (i + 1) * POSITION_STEP },
                });
            }
            // Возвращаем обновленные модули
            return await tx.module.findMany({
                where: { courseId },
                orderBy: { position: 'asc' },
            });
        });
    }
    /**
     * Переупорядочивает уроки в модуле
     * Использует двухфазное обновление для избежания unique конфликтов
     */
    async reorderLessons(moduleId, dto) {
        // Проверяем существование модуля
        const module = await this.prisma.module.findUnique({
            where: { id: moduleId },
        });
        if (!module) {
            throw new common_1.NotFoundException(`Module with id ${moduleId} not found`);
        }
        // Проверяем на дубликаты в orderedIds
        const uniqueIds = new Set(dto.orderedIds);
        if (uniqueIds.size !== dto.orderedIds.length) {
            throw new common_1.BadRequestException({
                message: 'Duplicate IDs found in orderedIds',
                error: 'DUPLICATE_IDS',
                statusCode: 400,
            });
        }
        // Получаем все уроки модуля
        const lessons = await this.prisma.lesson.findMany({
            where: { moduleId },
        });
        // Проверяем принадлежность и полноту
        const lessonIds = new Set(lessons.map((l) => l.id));
        const requestedIds = new Set(dto.orderedIds);
        // Проверяем, что все запрошенные ID существуют и принадлежат модулю
        for (const id of dto.orderedIds) {
            if (!lessonIds.has(id)) {
                throw new common_1.BadRequestException({
                    message: `Lesson with id ${id} not found in module ${moduleId}`,
                    error: 'FOREIGN_ID',
                    statusCode: 400,
                });
            }
        }
        // Проверяем, что все уроки модуля включены в новый порядок
        if (lessonIds.size !== requestedIds.size) {
            throw new common_1.BadRequestException({
                message: `OrderedIds must contain all lessons from module. Expected ${lessonIds.size}, got ${requestedIds.size}`,
                error: 'MISSING_IDS',
                statusCode: 400,
            });
        }
        // Двухфазное обновление в транзакции
        return await this.prisma.$transaction(async (tx) => {
            // Фаза 1: Устанавливаем все позиции в отрицательные значения
            for (let i = 0; i < dto.orderedIds.length; i++) {
                await tx.lesson.update({
                    where: { id: dto.orderedIds[i] },
                    data: { position: -(i + 1) * POSITION_STEP },
                });
            }
            // Фаза 2: Устанавливаем правильные позиции
            for (let i = 0; i < dto.orderedIds.length; i++) {
                await tx.lesson.update({
                    where: { id: dto.orderedIds[i] },
                    data: { position: (i + 1) * POSITION_STEP },
                });
            }
            // Возвращаем обновленные уроки
            return await tx.lesson.findMany({
                where: { moduleId },
                orderBy: { position: 'asc' },
            });
        });
    }
};
exports.CourseStructureService = CourseStructureService;
exports.CourseStructureService = CourseStructureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CourseStructureService);
//# sourceMappingURL=course-structure.service.js.map