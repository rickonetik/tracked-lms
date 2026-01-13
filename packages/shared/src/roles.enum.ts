/**
 * Роли пользователей в системе
 */
export enum UserRole {
  /**
   * Администратор системы
   */
  ADMIN = 'admin',

  /**
   * Преподаватель/Эксперт
   */
  TEACHER = 'teacher',

  /**
   * Студент/Ученик
   */
  STUDENT = 'student',
}

/**
 * Тип роли пользователя
 */
export type UserRoleType = UserRole;
