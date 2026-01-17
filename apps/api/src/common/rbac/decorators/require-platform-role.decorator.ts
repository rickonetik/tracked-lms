import { SetMetadata } from '@nestjs/common';
import { PlatformRole } from '../platform-role.enum';

export const REQUIRE_PLATFORM_ROLES_KEY = 'require_platform_roles';

/**
 * Декоратор для требования platform role
 * Использование: @RequirePlatformRole(PlatformRole.ADMIN, PlatformRole.OWNER)
 */
export const RequirePlatformRole = (...roles: PlatformRole[]) =>
  SetMetadata(REQUIRE_PLATFORM_ROLES_KEY, roles);
