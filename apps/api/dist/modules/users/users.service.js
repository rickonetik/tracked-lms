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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Создает или обновляет пользователя по telegramId
     */
    async upsertByTelegramId(telegramId, userData) {
        // Используем findUnique + create/update вместо upsert
        // из-за проблем с partial unique indexes в Prisma 7 + adapter-pg
        const existing = await this.prisma.user.findUnique({
            where: {
                telegramId: telegramId,
            },
        });
        if (existing) {
            // Обновляем существующего пользователя
            return this.prisma.user.update({
                where: {
                    telegramId: telegramId,
                },
                data: {
                    firstName: userData.first_name,
                    lastName: userData.last_name || null,
                    username: userData.username || null,
                    // Не обновляем email и status при обновлении через Telegram
                },
            });
        }
        else {
            // Создаем нового пользователя
            return this.prisma.user.create({
                data: {
                    telegramId: telegramId,
                    firstName: userData.first_name,
                    lastName: userData.last_name || null,
                    username: userData.username || null,
                    email: null, // Email не приходит из Telegram initData
                    status: 'active', // По умолчанию active
                },
            });
        }
    }
    /**
     * Находит пользователя по telegramId
     */
    async findByTelegramId(telegramId) {
        return this.prisma.user.findUnique({
            where: {
                telegramId: telegramId,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map