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
exports.StudentLessonDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class StudentLessonDto {
    id;
    moduleId;
    title;
    description;
    position;
    video;
    completedAt;
}
exports.StudentLessonDto = StudentLessonDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID урока' }),
    __metadata("design:type", String)
], StudentLessonDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID модуля' }),
    __metadata("design:type", String)
], StudentLessonDto.prototype, "moduleId", void 0);
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
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Видео урока (placeholder для EPIC 5)', required: true, nullable: true, default: null, type: 'null' }),
    __metadata("design:type", void 0)
], StudentLessonDto.prototype, "video", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата завершения урока текущим студентом', required: false, nullable: true, type: String }),
    __metadata("design:type", Object)
], StudentLessonDto.prototype, "completedAt", void 0);
//# sourceMappingURL=student-lesson.dto.js.map