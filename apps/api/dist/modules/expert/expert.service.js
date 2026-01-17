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
exports.ExpertService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let ExpertService = class ExpertService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Маппинг роли в permission string
     */
    roleToPermission(role) {
        const roleUpper = role.toUpperCase();
        return `EXPERT_${roleUpper}`;
    }
    /**
     * Приоритет ролей для детерминированного выбора
     * OWNER > manager > reviewer
     */
    getRolePriority(role) {
        switch (role) {
            case 'owner':
                return 3;
            case 'manager':
                return 2;
            case 'reviewer':
                return 1;
            default:
                return 0;
        }
    }
    /**
     * Детерминированный выбор membership при нескольких
     * Правило: OWNER first, затем по приоритету роли, затем по createdAt ASC
     */
    selectMembership(memberships) {
        // Сначала ищем OWNER
        const ownerMemberships = memberships.filter((m) => m.role === 'owner');
        if (ownerMemberships.length > 0) {
            // Если несколько OWNER - выбираем самый ранний expertAccount по createdAt
            return ownerMemberships.sort((a, b) => a.expertAccount.createdAt.getTime() - b.expertAccount.createdAt.getTime())[0];
        }
        // Иначе сортируем по приоритету роли (desc), затем по createdAt ASC
        return memberships.sort((a, b) => {
            const priorityDiff = this.getRolePriority(b.role) - this.getRolePriority(a.role);
            if (priorityDiff !== 0) {
                return priorityDiff;
            }
            return a.expertAccount.createdAt.getTime() - b.expertAccount.createdAt.getTime();
        })[0];
    }
    async getExpertMe(userId) {
        // Шаг 1: Получить все memberships пользователя
        const memberships = await this.prisma.expertMember.findMany({
            where: {
                userId,
            },
            include: {
                expertAccount: {
                    select: {
                        id: true,
                        slug: true,
                        title: true,
                        ownerUserId: true,
                        createdAt: true,
                    },
                },
            },
        });
        // Шаг 2: Проверка membership (404 если нет)
        if (memberships.length === 0) {
            throw new common_1.NotFoundException({
                message: 'Expert account not found',
                error: 'EXPERT_NOT_FOUND',
                statusCode: 404,
            });
        }
        // Шаг 3: Детерминированный выбор membership
        const selectedMembership = this.selectMembership(memberships);
        const expertAccountId = selectedMembership.expertAccountId;
        // Шаг 4: Найти активную подписку по предикату
        const now = new Date();
        // Предикат: status='active' AND (currentPeriodEnd IS NULL OR currentPeriodEnd > now())
        // Детерминированный выбор: ORDER BY currentPeriodEnd NULLS FIRST, createdAt DESC LIMIT 1
        // Примечание: Prisma не поддерживает NULLS FIRST напрямую, используем два запроса или raw SQL
        // Для MVP: сначала ищем с NULL, если нет - ищем с future date
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
        // Шаг 5: Проверка активной подписки (403 если нет)
        if (!activeSubscription) {
            throw new common_1.ForbiddenException({
                message: 'Subscription is inactive',
                error: 'SUBSCRIPTION_INACTIVE',
                statusCode: 403,
            });
        }
        // Шаг 6: Собрать DTO
        const expertAccount = {
            id: selectedMembership.expertAccount.id,
            slug: selectedMembership.expertAccount.slug,
            title: selectedMembership.expertAccount.title,
            ownerUserId: selectedMembership.expertAccount.ownerUserId,
        };
        const membership = {
            id: selectedMembership.id,
            role: selectedMembership.role,
            userId: selectedMembership.userId,
            expertAccountId: selectedMembership.expertAccountId,
        };
        const subscription = {
            id: activeSubscription.id,
            status: activeSubscription.status,
            plan: activeSubscription.plan,
            currentPeriodStart: activeSubscription.currentPeriodStart?.toISOString() ?? null,
            currentPeriodEnd: activeSubscription.currentPeriodEnd?.toISOString() ?? null,
        };
        // Шаг 7: Сформировать permissions
        const platformPermissions = [];
        // TODO: в будущем можно добавить platform permissions из env allowlist или БД
        const expertPermissions = [this.roleToPermission(selectedMembership.role)];
        const permissions = {
            platform: platformPermissions,
            expert: expertPermissions,
        };
        return {
            expertAccount,
            membership,
            subscription,
            permissions,
        };
    }
};
exports.ExpertService = ExpertService;
exports.ExpertService = ExpertService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpertService);
//# sourceMappingURL=expert.service.js.map