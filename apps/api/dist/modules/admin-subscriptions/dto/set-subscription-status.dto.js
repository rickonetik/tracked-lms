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
exports.SetSubscriptionStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class SetSubscriptionStatusDto {
    status;
    plan;
    currentPeriodEnd;
    reason;
}
exports.SetSubscriptionStatusDto = SetSubscriptionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subscription status',
        enum: client_1.SubscriptionStatus,
        example: 'active',
    }),
    (0, class_validator_1.IsEnum)(client_1.SubscriptionStatus, {
        message: 'Status must be one of: active, expired, canceled',
    }),
    __metadata("design:type", String)
], SetSubscriptionStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subscription plan',
        enum: client_1.SubscriptionPlan,
        example: 'manual_mvp',
    }),
    (0, class_validator_1.IsEnum)(client_1.SubscriptionPlan, {
        message: 'Plan must be one of: manual_mvp',
    }),
    __metadata("design:type", String)
], SetSubscriptionStatusDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date of current period (ISO string or null for unlimited)',
        example: '2026-02-01T00:00:00.000Z',
        nullable: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.currentPeriodEnd !== null && o.currentPeriodEnd !== undefined),
    (0, class_validator_1.IsDateString)({}, { message: 'currentPeriodEnd must be a valid ISO date string' }),
    __metadata("design:type", Object)
], SetSubscriptionStatusDto.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for status change (optional, for audit)',
        example: 'Manual admin action',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetSubscriptionStatusDto.prototype, "reason", void 0);
//# sourceMappingURL=set-subscription-status.dto.js.map