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
exports.RbacTestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_roles_guard_1 = require("../../common/rbac/guards/platform-roles.guard");
const expert_roles_guard_1 = require("../../common/rbac/guards/expert-roles.guard");
const require_platform_role_decorator_1 = require("../../common/rbac/decorators/require-platform-role.decorator");
const require_expert_role_decorator_1 = require("../../common/rbac/decorators/require-expert-role.decorator");
const platform_role_enum_1 = require("../../common/rbac/platform-role.enum");
const expert_role_enum_1 = require("../../common/rbac/expert-role.enum");
// TODO: remove rbac-test module after RBAC verification
let RbacTestController = class RbacTestController {
    async platformOnly() {
        return { ok: true };
    }
    async expertOnly(expertAccountId) {
        return { ok: true };
    }
    async expertOnlyQuery() {
        // expertAccountId берется из query через guard
        return { ok: true };
    }
    async open() {
        return { ok: true };
    }
};
exports.RbacTestController = RbacTestController;
__decorate([
    (0, common_1.Get)('platform-only'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, platform_roles_guard_1.PlatformRolesGuard),
    (0, require_platform_role_decorator_1.RequirePlatformRole)(platform_role_enum_1.PlatformRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint for platform role guard' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RbacTestController.prototype, "platformOnly", null);
__decorate([
    (0, common_1.Get)('expert-only/:expertAccountId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, expert_roles_guard_1.ExpertRolesGuard),
    (0, require_expert_role_decorator_1.RequireExpertRole)(expert_role_enum_1.ExpertRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint for expert role guard (param)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } }),
    __param(0, (0, common_1.Param)('expertAccountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacTestController.prototype, "expertOnly", null);
__decorate([
    (0, common_1.Get)('expert-only-query'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, expert_roles_guard_1.ExpertRolesGuard),
    (0, require_expert_role_decorator_1.RequireExpertRole)(expert_role_enum_1.ExpertRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint for expert role guard (query)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RbacTestController.prototype, "expertOnlyQuery", null);
__decorate([
    (0, common_1.Get)('open'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, platform_roles_guard_1.PlatformRolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint without @RequirePlatformRole (should pass with token)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Access granted', schema: { type: 'object', properties: { ok: { type: 'boolean' } } } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RbacTestController.prototype, "open", null);
exports.RbacTestController = RbacTestController = __decorate([
    (0, swagger_1.ApiTags)('rbac-test'),
    (0, common_1.Controller)('rbac-test'),
    (0, swagger_1.ApiBearerAuth)()
], RbacTestController);
//# sourceMappingURL=rbac-test.controller.js.map