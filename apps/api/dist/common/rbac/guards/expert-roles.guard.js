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
exports.ExpertRolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma.service");
const require_expert_role_decorator_1 = require("../decorators/require-expert-role.decorator");
let ExpertRolesGuard = class ExpertRolesGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(require_expert_role_decorator_1.REQUIRE_EXPERT_ROLES_KEY, [context.getHandler(), context.getClass()]);
        // Если декоратор не применён, разрешаем доступ
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        // Проверка авторизации
        if (!user?.id) {
            throw new common_1.UnauthorizedException({
                message: 'Unauthorized',
                statusCode: 401,
            });
        }
        // Получение expertAccountId из params или query
        const expertAccountId = request.params?.expertAccountId || request.query?.expertAccountId;
        if (!expertAccountId) {
            throw new common_1.BadRequestException({
                message: 'expertAccountId is required',
                error: 'EXPERT_ACCOUNT_ID_REQUIRED',
                statusCode: 400,
            });
        }
        // Проверка membership в expert_members
        const membership = await this.prisma.expertMember.findFirst({
            where: {
                expertAccountId,
                userId: user.id,
            },
            select: {
                role: true,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException({
                message: 'Forbidden',
                error: 'EXPERT_MEMBERSHIP_REQUIRED',
                statusCode: 403,
            });
        }
        // Проверка роли
        const userRole = membership.role;
        if (!requiredRoles.includes(userRole)) {
            throw new common_1.ForbiddenException({
                message: 'Forbidden',
                error: 'EXPERT_ROLE_REQUIRED',
                statusCode: 403,
            });
        }
        return true;
    }
};
exports.ExpertRolesGuard = ExpertRolesGuard;
exports.ExpertRolesGuard = ExpertRolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], ExpertRolesGuard);
//# sourceMappingURL=expert-roles.guard.js.map