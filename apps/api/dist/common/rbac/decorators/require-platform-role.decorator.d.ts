import { PlatformRole } from '../platform-role.enum';
export declare const REQUIRE_PLATFORM_ROLES_KEY = "require_platform_roles";
/**
 * Декоратор для требования platform role
 * Использование: @RequirePlatformRole(PlatformRole.ADMIN, PlatformRole.OWNER)
 */
export declare const RequirePlatformRole: (...roles: PlatformRole[]) => import("@nestjs/common").CustomDecorator<string>;
//# sourceMappingURL=require-platform-role.decorator.d.ts.map