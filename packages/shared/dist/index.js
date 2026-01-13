"use strict";
/**
 * Shared package для общих типов и констант
 * Используется в apps/api, apps/webapp, apps/bot
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.UserRole = void 0;
// Enums
var roles_enum_1 = require("./roles.enum");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return roles_enum_1.UserRole; } });
var error_codes_enum_1 = require("./error-codes.enum");
Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function () { return error_codes_enum_1.ErrorCode; } });
//# sourceMappingURL=index.js.map