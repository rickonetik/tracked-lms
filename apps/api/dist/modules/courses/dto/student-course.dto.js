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
exports.StudentCourseDto = exports.StudentModuleDto = exports.StudentLessonDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class StudentLessonDto {
    id;
    title;
    description;
    position;
}
exports.StudentLessonDto = StudentLessonDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID урока' }),
    __metadata("design:type", String)
], StudentLessonDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название урока' }),
    __metadata("design:type", String)
], StudentLessonDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание урока', required: false, nullable: true, type: String }),
    __metadata("design:type", Object)
], StudentLessonDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Позиция урока в модуле' }),
    __metadata("design:type", Number)
], StudentLessonDto.prototype, "position", void 0);
class StudentModuleDto {
    id;
    title;
    description;
    position;
    lessons;
}
exports.StudentModuleDto = StudentModuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID модуля' }),
    __metadata("design:type", String)
], StudentModuleDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название модуля' }),
    __metadata("design:type", String)
], StudentModuleDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание модуля', required: false, nullable: true, type: String }),
    __metadata("design:type", Object)
], StudentModuleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Позиция модуля в курсе' }),
    __metadata("design:type", Number)
], StudentModuleDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Уроки модуля', type: [StudentLessonDto] }),
    __metadata("design:type", Array)
], StudentModuleDto.prototype, "lessons", void 0);
class StudentCourseDto {
    id;
    title;
    description;
    topicId;
    status;
    modules;
}
exports.StudentCourseDto = StudentCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID курса' }),
    __metadata("design:type", String)
], StudentCourseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Название курса' }),
    __metadata("design:type", String)
], StudentCourseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Описание курса', required: false, nullable: true, type: String }),
    __metadata("design:type", Object)
], StudentCourseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID темы', required: false, nullable: true, type: String }),
    __metadata("design:type", Object)
], StudentCourseDto.prototype, "topicId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Статус курса', enum: client_1.CourseStatus }),
    __metadata("design:type", String)
], StudentCourseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Модули курса', type: [StudentModuleDto] }),
    __metadata("design:type", Array)
], StudentCourseDto.prototype, "modules", void 0);
//# sourceMappingURL=student-course.dto.js.map