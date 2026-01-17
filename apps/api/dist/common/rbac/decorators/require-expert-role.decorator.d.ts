import { ExpertRole } from '../expert-role.enum';
export declare const REQUIRE_EXPERT_ROLES_KEY = "require_expert_roles";
/**
 * Декоратор для требования expert role
 * Использование: @RequireExpertRole(ExpertRole.OWNER, ExpertRole.MANAGER)
 */
export declare const RequireExpertRole: (...roles: ExpertRole[]) => import("@nestjs/common").CustomDecorator<string>;
//# sourceMappingURL=require-expert-role.decorator.d.ts.map