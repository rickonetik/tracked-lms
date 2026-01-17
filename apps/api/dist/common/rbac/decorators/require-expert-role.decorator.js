"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireExpertRole = exports.REQUIRE_EXPERT_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_EXPERT_ROLES_KEY = 'require_expert_roles';
/**
 * Декоратор для требования expert role
 * Использование: @RequireExpertRole(ExpertRole.OWNER, ExpertRole.MANAGER)
 */
const RequireExpertRole = (...roles) => (0, common_1.SetMetadata)(exports.REQUIRE_EXPERT_ROLES_KEY, roles);
exports.RequireExpertRole = RequireExpertRole;
//# sourceMappingURL=require-expert-role.decorator.js.map