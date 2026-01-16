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
exports.TelegramAuthResponseDto = exports.TelegramAuthDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TelegramAuthDto {
    initData;
}
exports.TelegramAuthDto = TelegramAuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raw initData query string от Telegram WebApp',
        example: 'query_id=...&user=...&auth_date=...&hash=...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TelegramAuthDto.prototype, "initData", void 0);
class TelegramAuthResponseDto {
    accessToken;
    user;
}
exports.TelegramAuthResponseDto = TelegramAuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT токен для авторизации',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], TelegramAuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Данные пользователя',
        type: 'object',
        properties: {
            id: { type: 'string' },
            telegramId: { type: 'string', nullable: true, description: 'bigint сериализуется как string в JSON' },
            firstName: { type: 'string' },
            lastName: { type: 'string', nullable: true },
            username: { type: 'string', nullable: true },
            status: { type: 'string', description: 'active, banned' },
            userType: { type: 'string', description: 'Derived поле: "STUDENT" по умолчанию, позже вычисляется из membership/subscription' },
        },
    }),
    __metadata("design:type", Object)
], TelegramAuthResponseDto.prototype, "user", void 0);
//# sourceMappingURL=telegram-auth.dto.js.map