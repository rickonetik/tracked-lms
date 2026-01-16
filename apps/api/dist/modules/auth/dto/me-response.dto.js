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
exports.MeResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MeResponseDto {
    id;
    telegramId;
    firstName;
    lastName;
    username;
    status;
    userType;
}
exports.MeResponseDto = MeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID пользователя',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Telegram ID пользователя',
        example: '123456789',
        nullable: true,
    }),
    __metadata("design:type", Object)
], MeResponseDto.prototype, "telegramId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Имя пользователя',
        example: 'John',
    }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Фамилия пользователя',
        example: 'Doe',
        nullable: true,
    }),
    __metadata("design:type", Object)
], MeResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Username пользователя',
        example: 'johndoe',
        nullable: true,
    }),
    __metadata("design:type", Object)
], MeResponseDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Статус пользователя',
        example: 'active',
        enum: ['active', 'banned'],
    }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Тип пользователя (derived поле): "STUDENT" по умолчанию, позже вычисляется из membership/subscription',
        example: 'STUDENT',
    }),
    __metadata("design:type", String)
], MeResponseDto.prototype, "userType", void 0);
//# sourceMappingURL=me-response.dto.js.map