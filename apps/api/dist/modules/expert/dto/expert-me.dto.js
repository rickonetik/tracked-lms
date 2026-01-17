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
exports.ExpertMeResponseDto = exports.PermissionsDto = exports.SubscriptionDto = exports.MembershipDto = exports.ExpertAccountDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ExpertAccountDto {
    id;
    slug;
    title;
    ownerUserId;
}
exports.ExpertAccountDto = ExpertAccountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID expert account' }),
    __metadata("design:type", String)
], ExpertAccountDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Slug expert account' }),
    __metadata("design:type", String)
], ExpertAccountDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title expert account' }),
    __metadata("design:type", String)
], ExpertAccountDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner user ID' }),
    __metadata("design:type", String)
], ExpertAccountDto.prototype, "ownerUserId", void 0);
class MembershipDto {
    id;
    role;
    userId;
    expertAccountId;
}
exports.MembershipDto = MembershipDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID membership' }),
    __metadata("design:type", String)
], MembershipDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Role in expert account', enum: ['owner', 'manager', 'reviewer'] }),
    __metadata("design:type", String)
], MembershipDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], MembershipDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expert account ID' }),
    __metadata("design:type", String)
], MembershipDto.prototype, "expertAccountId", void 0);
class SubscriptionDto {
    id;
    status;
    plan;
    currentPeriodStart;
    currentPeriodEnd;
}
exports.SubscriptionDto = SubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID subscription' }),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subscription status', enum: ['active', 'expired', 'canceled'] }),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subscription plan', enum: ['manual_mvp'] }),
    __metadata("design:type", String)
], SubscriptionDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current period start', nullable: true, type: String }),
    __metadata("design:type", Object)
], SubscriptionDto.prototype, "currentPeriodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current period end', nullable: true, type: String }),
    __metadata("design:type", Object)
], SubscriptionDto.prototype, "currentPeriodEnd", void 0);
class PermissionsDto {
    platform;
    expert;
}
exports.PermissionsDto = PermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Platform permissions', type: [String] }),
    __metadata("design:type", Array)
], PermissionsDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expert permissions', type: [String] }),
    __metadata("design:type", Array)
], PermissionsDto.prototype, "expert", void 0);
class ExpertMeResponseDto {
    expertAccount;
    membership;
    subscription;
    permissions;
}
exports.ExpertMeResponseDto = ExpertMeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expert account', type: ExpertAccountDto }),
    __metadata("design:type", ExpertAccountDto)
], ExpertMeResponseDto.prototype, "expertAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Membership', type: MembershipDto }),
    __metadata("design:type", MembershipDto)
], ExpertMeResponseDto.prototype, "membership", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subscription', type: SubscriptionDto }),
    __metadata("design:type", SubscriptionDto)
], ExpertMeResponseDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Permissions', type: PermissionsDto }),
    __metadata("design:type", PermissionsDto)
], ExpertMeResponseDto.prototype, "permissions", void 0);
//# sourceMappingURL=expert-me.dto.js.map