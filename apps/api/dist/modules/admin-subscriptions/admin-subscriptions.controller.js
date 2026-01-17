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
exports.AdminSubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_roles_guard_1 = require("../../common/rbac/guards/platform-roles.guard");
const require_platform_role_decorator_1 = require("../../common/rbac/decorators/require-platform-role.decorator");
const platform_role_enum_1 = require("../../common/rbac/platform-role.enum");
const admin_subscriptions_service_1 = require("./admin-subscriptions.service");
const set_subscription_status_dto_1 = require("./dto/set-subscription-status.dto");
const set_subscription_status_response_dto_1 = require("./dto/set-subscription-status.response.dto");
let AdminSubscriptionsController = class AdminSubscriptionsController {
    adminSubscriptionsService;
    constructor(adminSubscriptionsService) {
        this.adminSubscriptionsService = adminSubscriptionsService;
    }
    async setSubscriptionStatus(expertAccountId, dto, req) {
        return this.adminSubscriptionsService.setSubscriptionStatus(expertAccountId, dto, req.user.id);
    }
};
exports.AdminSubscriptionsController = AdminSubscriptionsController;
__decorate([
    (0, common_1.Post)(':expertAccountId/status'),
    (0, require_platform_role_decorator_1.RequirePlatformRole)(platform_role_enum_1.PlatformRole.OWNER, platform_role_enum_1.PlatformRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Set subscription status for expert account',
        description: 'Creates a new subscription record (preserves history). Only accessible by Platform Owner/Admin.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'expertAccountId',
        description: 'Expert account ID',
        type: String,
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Subscription status set successfully',
        type: set_subscription_status_response_dto_1.SetSubscriptionStatusResponseDto,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Expert account not found',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Expert account not found' },
                error: { type: 'string', example: 'EXPERT_ACCOUNT_NOT_FOUND' },
                statusCode: { type: 'number', example: 404 },
            },
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Platform role required',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Forbidden' },
                error: { type: 'string', example: 'PLATFORM_ROLE_REQUIRED' },
                statusCode: { type: 'number', example: 403 },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request data',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                error: {
                    type: 'string',
                    enum: [
                        'INVALID_CURRENT_PERIOD_END',
                        'INVALID_STATUS',
                        'INVALID_PLAN',
                    ],
                },
                statusCode: { type: 'number', example: 400 },
            },
        },
    }),
    __param(0, (0, common_1.Param)('expertAccountId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, set_subscription_status_dto_1.SetSubscriptionStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AdminSubscriptionsController.prototype, "setSubscriptionStatus", null);
exports.AdminSubscriptionsController = AdminSubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin/subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, platform_roles_guard_1.PlatformRolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_subscriptions_service_1.AdminSubscriptionsService])
], AdminSubscriptionsController);
//# sourceMappingURL=admin-subscriptions.controller.js.map