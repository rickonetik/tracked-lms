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
exports.MyCoursesResponseDto = exports.CourseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CourseDto {
    id;
    title;
    description;
    totalLessons;
    completedLessons;
    progressPercent;
}
exports.CourseDto = CourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID курса',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], CourseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название курса',
        example: 'Введение в программирование',
    }),
    __metadata("design:type", String)
], CourseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Описание курса',
        example: 'Базовые концепции программирования',
        required: false,
        nullable: true,
        type: String,
    }),
    __metadata("design:type", Object)
], CourseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Общее количество уроков в курсе',
        type: Number,
        example: 12,
    }),
    __metadata("design:type", Number)
], CourseDto.prototype, "totalLessons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Количество пройденных уроков',
        type: Number,
        example: 3,
    }),
    __metadata("design:type", Number)
], CourseDto.prototype, "completedLessons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Процент прогресса (0-100)',
        type: Number,
        example: 25,
    }),
    __metadata("design:type", Number)
], CourseDto.prototype, "progressPercent", void 0);
class MyCoursesResponseDto {
    courses;
}
exports.MyCoursesResponseDto = MyCoursesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Список курсов студента',
        type: [CourseDto],
    }),
    __metadata("design:type", Array)
], MyCoursesResponseDto.prototype, "courses", void 0);
//# sourceMappingURL=course.dto.js.map