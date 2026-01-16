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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const telegram_verify_util_1 = require("../../common/telegram-verify.util");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    /**
     * Парсит initData и извлекает данные пользователя
     */
    parseInitData(initData) {
        const params = new URLSearchParams(initData);
        const result = {
            hash: params.get('hash') || '',
        };
        const userStr = params.get('user');
        if (userStr) {
            try {
                result.user = JSON.parse(userStr);
            }
            catch (e) {
                // Игнорируем ошибки парсинга JSON
            }
        }
        result.auth_date = params.get('auth_date') || undefined;
        result.query_id = params.get('query_id') || undefined;
        return result;
    }
    /**
     * Авторизует пользователя через Telegram initData
     *
     * TODO: Формат ошибок 401 — стандартный NestJS {message, error, statusCode}.
     * Если нужен единый формат ошибок по платформе — лучше ввести глобальный exception filter
     * на следующем "foundation hardening" этапе.
     */
    async authenticateWithTelegram(initData) {
        // Получаем BOT_TOKEN из конфигурации
        const botToken = this.configService.get('BOT_TOKEN');
        if (!botToken) {
            throw new common_1.UnauthorizedException('BOT_TOKEN not configured');
        }
        // Проверяем подпись initData
        const isValid = (0, telegram_verify_util_1.verifyTelegramInitData)(initData, botToken);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid initData signature');
        }
        // Парсим initData
        const parsed = this.parseInitData(initData);
        if (!parsed.user || !parsed.user.id) {
            throw new common_1.UnauthorizedException('User data not found in initData');
        }
        // Upsert пользователя в БД
        const telegramId = BigInt(parsed.user.id);
        const user = await this.usersService.upsertByTelegramId(telegramId, parsed.user);
        // Генерируем JWT токен
        const payload = {
            sub: user.id,
            telegramId: user.telegramId?.toString() || null,
        };
        const accessToken = this.jwtService.sign(payload);
        // userType - derived поле (пока по умолчанию "STUDENT")
        // Позже будет вычисляться: isExpert если есть membership и активная подписка
        const userType = 'STUDENT';
        return {
            accessToken,
            user: {
                id: user.id,
                telegramId: user.telegramId?.toString() || null, // Преобразуем bigint в string для JSON
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                status: user.status,
                userType, // Derived поле: пока "STUDENT", позже вычисляется из membership/subscription
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map