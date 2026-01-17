"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePlatformRole = exports.REQUIRE_PLATFORM_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_PLATFORM_ROLES_KEY = 'require_platform_roles';
/**
 * Декоратор для требования platform role
 * Использование: @RequirePlatformRole(PlatformRole.ADMIN, PlatformRole.OWNER)
 */
const RequirePlatformRole = (...roles) => (0, common_1.SetMetadata)(exports.REQUIRE_PLATFORM_ROLES_KEY, roles);
exports.RequirePlatformRole = RequirePlatformRole;
//# sourceMappingURL=require-platform-role.decorator.js.map