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
exports.ExpertController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const expert_service_1 = require("./expert.service");
const expert_me_dto_1 = require("./dto/expert-me.dto");
let ExpertController = class ExpertController {
    expertService;
    constructor(expertService) {
        this.expertService = expertService;
    }
    async getMe(req) {
        const userId = req.user.id;
        return this.expertService.getExpertMe(userId);
    }
};
exports.ExpertController = ExpertController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current expert account information' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Expert account information', type: expert_me_dto_1.ExpertMeResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Expert account not found (no membership)', schema: { type: 'object', properties: { message: { type: 'string' }, error: { type: 'string', example: 'EXPERT_NOT_FOUND' }, statusCode: { type: 'number', example: 404 } } } }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Subscription is inactive', schema: { type: 'object', properties: { message: { type: 'string' }, error: { type: 'string', example: 'SUBSCRIPTION_INACTIVE' }, statusCode: { type: 'number', example: 403 } } } }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpertController.prototype, "getMe", null);
exports.ExpertController = ExpertController = __decorate([
    (0, swagger_1.ApiTags)('expert'),
    (0, common_1.Controller)('expert'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [expert_service_1.ExpertService])
], ExpertController);
//# sourceMappingURL=expert.controller.js.map