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
exports.SetSubscriptionStatusResponseDto = exports.SubscriptionSnapshotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class SubscriptionSnapshotDto {
    id;
    status;
    plan;
    currentPeriodEnd;
    createdAt;
}
exports.SubscriptionSnapshotDto = SubscriptionSnapshotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], SubscriptionSnapshotDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SubscriptionStatus, example: 'active' }),
    __metadata("design:type", String)
], SubscriptionSnapshotDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SubscriptionPlan, example: 'manual_mvp' }),
    __metadata("design:type", String)
], SubscriptionSnapshotDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-01T00:00:00.000Z', nullable: true }),
    __metadata("design:type", Object)
], SubscriptionSnapshotDto.prototype, "currentPeriodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-01-17T12:00:00.000Z' }),
    __metadata("design:type", String)
], SubscriptionSnapshotDto.prototype, "createdAt", void 0);
class SetSubscriptionStatusResponseDto {
    expertAccountId;
    subscription;
    activeSubscription;
    changedByUserId;
    requestedAt;
}
exports.SetSubscriptionStatusResponseDto = SetSubscriptionStatusResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], SetSubscriptionStatusResponseDto.prototype, "expertAccountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubscriptionSnapshotDto }),
    __metadata("design:type", SubscriptionSnapshotDto)
], SetSubscriptionStatusResponseDto.prototype, "subscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SubscriptionSnapshotDto, nullable: true }),
    __metadata("design:type", Object)
], SetSubscriptionStatusResponseDto.prototype, "activeSubscription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid' }),
    __metadata("design:type", String)
], SetSubscriptionStatusResponseDto.prototype, "changedByUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-01-17T12:00:00.000Z' }),
    __metadata("design:type", String)
], SetSubscriptionStatusResponseDto.prototype, "requestedAt", void 0);
//# sourceMappingURL=set-subscription-status.response.dto.js.map