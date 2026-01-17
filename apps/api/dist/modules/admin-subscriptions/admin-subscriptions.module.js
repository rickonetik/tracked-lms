"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSubscriptionsModule = void 0;
const common_1 = require("@nestjs/common");
const admin_subscriptions_controller_1 = require("./admin-subscriptions.controller");
const admin_subscriptions_service_1 = require("./admin-subscriptions.service");
const prisma_service_1 = require("../../common/prisma.service");
const platform_roles_guard_1 = require("../../common/rbac/guards/platform-roles.guard");
let AdminSubscriptionsModule = class AdminSubscriptionsModule {
};
exports.AdminSubscriptionsModule = AdminSubscriptionsModule;
exports.AdminSubscriptionsModule = AdminSubscriptionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_subscriptions_controller_1.AdminSubscriptionsController],
        providers: [admin_subscriptions_service_1.AdminSubscriptionsService, prisma_service_1.PrismaService, platform_roles_guard_1.PlatformRolesGuard],
    })
], AdminSubscriptionsModule);
//# sourceMappingURL=admin-subscriptions.module.js.map