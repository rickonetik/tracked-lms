import { SetMetadata } from '@nestjs/common';
import { ExpertRole } from '../expert-role.enum';

export const REQUIRE_EXPERT_ROLES_KEY = 'require_expert_roles';

/**
 * Декоратор для требования expert role
 * Использование: @RequireExpertRole(ExpertRole.OWNER, ExpertRole.MANAGER)
 */
export const RequireExpertRole = (...roles: ExpertRole[]) =>
  SetMetadata(REQUIRE_EXPERT_ROLES_KEY, roles);
