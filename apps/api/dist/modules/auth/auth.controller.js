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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const telegram_auth_dto_1 = require("./dto/telegram-auth.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const me_response_dto_1 = require("./dto/me-response.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    // TODO: Формат ошибок 401 — стандартный NestJS {message, error, statusCode}.
    // Если нужен единый формат ошибок по платформе — лучше ввести глобальный exception filter
    // на следующем "foundation hardening" этапе.
    async authenticateWithTelegram(dto) {
        try {
            return await this.authService.authenticateWithTelegram(dto.initData);
        }
        catch (error) {
            // Логируем ошибку для отладки
            console.error('[AuthController] Error in authenticateWithTelegram:', error);
            if (error instanceof Error) {
                console.error('[AuthController] Error message:', error.message);
                console.error('[AuthController] Error stack:', error.stack);
            }
            // Перебрасываем ошибку - NestJS обработает её через глобальный exception filter
            throw error;
        }
    }
    async getMe(req) {
        // user добавляется в request через JwtStrategy.validate()
        const user = req.user;
        // userType - derived поле (пока по умолчанию "STUDENT")
        // Позже будет вычисляться: isExpert если есть membership и активная подписка
        const userType = 'STUDENT';
        return {
            id: user.id,
            telegramId: user.telegramId,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            status: user.status,
            userType,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('telegram'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Авторизация через Telegram WebApp initData' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешная авторизация',
        type: telegram_auth_dto_1.TelegramAuthResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        status: 401,
        description: 'Невалидный initData или отсутствует BOT_TOKEN',
    })
    // TODO: Формат ошибок 401 — стандартный NestJS {message, error, statusCode}.
    // Если нужен единый формат ошибок по платформе — лучше ввести глобальный exception filter
    // на следующем "foundation hardening" этапе.
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegram_auth_dto_1.TelegramAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateWithTelegram", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получить данные текущего пользователя' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Данные пользователя',
        type: me_response_dto_1.MeResponseDto,
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        status: 401,
        description: 'Токен отсутствует или невалиден',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Пользователь забанен',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User is banned' },
                error: { type: 'string', example: 'USER_BANNED' },
                statusCode: { type: 'number', example: 403 },
            },
        },
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map