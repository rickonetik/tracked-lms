/**
 * Expert Role Enum
 * Роли в рамках expert account (локальные)
 * Значения должны соответствовать enum ExpertMemberRole в Prisma
 */
export enum ExpertRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  REVIEWER = 'reviewer',
}
