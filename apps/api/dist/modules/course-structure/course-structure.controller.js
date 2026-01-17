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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseStructureController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const course_structure_service_1 = require("./course-structure.service");
const create_module_dto_1 = require("./dto/create-module.dto");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const reorder_dto_1 = require("./dto/reorder.dto");
let CourseStructureController = class CourseStructureController {
    courseStructureService;
    constructor(courseStructureService) {
        this.courseStructureService = courseStructureService;
    }
    async createModule(courseId, dto) {
        return await this.courseStructureService.createModule(courseId, dto);
    }
    async createLesson(moduleId, dto) {
        return await this.courseStructureService.createLesson(moduleId, dto);
    }
    async reorderModules(courseId, dto) {
        return await this.courseStructureService.reorderModules(courseId, dto);
    }
    async reorderLessons(moduleId, dto) {
        return await this.courseStructureService.reorderLessons(moduleId, dto);
    }
};
exports.CourseStructureController = CourseStructureController;
__decorate([
    (0, common_1.Post)('courses/:courseId/modules'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Создать модуль в курсе' }),
    (0, swagger_1.ApiParam)({
        name: 'courseId',
        description: 'ID курса',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Модуль успешно создан',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                courseId: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string', nullable: true },
                position: { type: 'number' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Курс не найден',
    }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_module_dto_1.CreateModuleDto]),
    __metadata("design:returntype", Promise)
], CourseStructureController.prototype, "createModule", null);
__decorate([
    (0, common_1.Post)('modules/:moduleId/lessons'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Создать урок в модуле' }),
    (0, swagger_1.ApiParam)({
        name: 'moduleId',
        description: 'ID модуля',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Урок успешно создан',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                moduleId: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string', nullable: true },
                position: { type: 'number' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Модуль не найден',
    }),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", Promise)
], CourseStructureController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/modules/reorder'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Переупорядочить модули в курсе' }),
    (0, swagger_1.ApiParam)({
        name: 'courseId',
        description: 'ID курса',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Модули успешно переупорядочены',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    courseId: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    position: { type: 'number' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Невалидный запрос (не все модули включены или неверные ID)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Курс не найден',
    }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_dto_1.ReorderDto]),
    __metadata("design:returntype", Promise)
], CourseStructureController.prototype, "reorderModules", null);
__decorate([
    (0, common_1.Post)('modules/:moduleId/lessons/reorder'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Переупорядочить уроки в модуле' }),
    (0, swagger_1.ApiParam)({
        name: 'moduleId',
        description: 'ID модуля',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Уроки успешно переупорядочены',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    moduleId: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    position: { type: 'number' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Невалидный запрос (не все уроки включены или неверные ID)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Модуль не найден',
    }),
    __param(0, (0, common_1.Param)('moduleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_dto_1.ReorderDto]),
    __metadata("design:returntype", Promise)
], CourseStructureController.prototype, "reorderLessons", null);
exports.CourseStructureController = CourseStructureController = __decorate([
    (0, swagger_1.ApiTags)('expert-structure'),
    (0, common_1.Controller)('expert'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [course_structure_service_1.CourseStructureService])
], CourseStructureController);
//# sourceMappingURL=course-structure.controller.js.map