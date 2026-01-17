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
exports.AdminSubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let AdminSubscriptionsService = class AdminSubscriptionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async setSubscriptionStatus(expertAccountId, dto, changedByUserId) {
        // Шаг 1: Проверка существования expertAccount
        const expertAccount = await this.prisma.expertAccount.findUnique({
            where: { id: expertAccountId },
        });
        if (!expertAccount) {
            throw new common_1.NotFoundException({
                message: 'Expert account not found',
                error: 'EXPERT_ACCOUNT_NOT_FOUND',
                statusCode: 404,
            });
        }
        // Шаг 2: Валидация и вычисление currentPeriodEnd
        let currentPeriodEnd = null;
        if (dto.currentPeriodEnd !== undefined && dto.currentPeriodEnd !== null) {
            // Парсим ISO строку
            const parsedDate = new Date(dto.currentPeriodEnd);
            if (isNaN(parsedDate.getTime())) {
                throw new common_1.BadRequestException({
                    message: 'Invalid currentPeriodEnd format. Must be a valid ISO date string.',
                    error: 'INVALID_CURRENT_PERIOD_END',
                    statusCode: 400,
                });
            }
            currentPeriodEnd = parsedDate;
        }
        else if ((dto.status === 'expired' || dto.status === 'canceled') &&
            dto.currentPeriodEnd === undefined) {
            // Автоматически ставим now() для expired/canceled, если не задан
            currentPeriodEnd = new Date();
        }
        // Если status='active' и currentPeriodEnd не задан — оставляем null (бессрочная)
        // Шаг 3: Создание новой записи subscription (история сохраняется)
        const now = new Date();
        const subscription = await this.prisma.subscription.create({
            data: {
                expertAccountId,
                plan: dto.plan,
                status: dto.status,
                currentPeriodStart: now,
                currentPeriodEnd,
                // TODO: интегрировать с AuditService в Story 8.2
                // reason сохраняется в лог/комментарий (пока не сохраняем, т.к. нет audit_logs)
            },
        });
        // Шаг 4: Найти активную подписку (тем же предикатом, что и gate из Story 4.3)
        // Предикат: status='active' AND (currentPeriodEnd IS NULL OR currentPeriodEnd > now())
        // Детерминированный выбор: ORDER BY currentPeriodEnd NULLS FIRST, createdAt DESC LIMIT 1
        let activeSubscription = await this.prisma.subscription.findFirst({
            where: {
                expertAccountId,
                status: 'active',
                currentPeriodEnd: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (!activeSubscription) {
            activeSubscription = await this.prisma.subscription.findFirst({
                where: {
                    expertAccountId,
                    status: 'active',
                    currentPeriodEnd: { gt: now },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        // Шаг 5: Формирование ответа
        const subscriptionSnapshot = {
            id: subscription.id,
            status: subscription.status,
            plan: subscription.plan,
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
            createdAt: subscription.createdAt.toISOString(),
        };
        const activeSubscriptionSnapshot = activeSubscription
            ? {
                id: activeSubscription.id,
                status: activeSubscription.status,
                plan: activeSubscription.plan,
                currentPeriodEnd: activeSubscription.currentPeriodEnd?.toISOString() || null,
                createdAt: activeSubscription.createdAt.toISOString(),
            }
            : null;
        return {
            expertAccountId,
            subscription: subscriptionSnapshot,
            activeSubscription: activeSubscriptionSnapshot,
            changedByUserId,
            requestedAt: now.toISOString(),
        };
    }
};
exports.AdminSubscriptionsService = AdminSubscriptionsService;
exports.AdminSubscriptionsService = AdminSubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminSubscriptionsService);
//# sourceMappingURL=admin-subscriptions.service.js.map