"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
/**
 * Роли пользователей в системе
 */
var UserRole;
(function (UserRole) {
    /**
     * Администратор системы
     */
    UserRole["ADMIN"] = "admin";
    /**
     * Преподаватель/Эксперт
     */
    UserRole["TEACHER"] = "teacher";
    /**
     * Студент/Ученик
     */
    UserRole["STUDENT"] = "student";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=roles.enum.js.map