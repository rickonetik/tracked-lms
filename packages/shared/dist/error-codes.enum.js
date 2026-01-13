"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
/**
 * Коды ошибок API
 * Используются в ErrorResponseDto для единообразной обработки ошибок
 */
var ErrorCode;
(function (ErrorCode) {
    // 4xx Client Errors
    /**
     * Неверный запрос
     */
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
    /**
     * Не авторизован
     */
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    /**
     * Доступ запрещён
     */
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    /**
     * Ресурс не найден
     */
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    /**
     * Конфликт (например, дубликат)
     */
    ErrorCode["CONFLICT"] = "CONFLICT";
    /**
     * Ошибка валидации
     */
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    // 5xx Server Errors
    /**
     * Внутренняя ошибка сервера
     */
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    /**
     * Сервис недоступен
     */
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
//# sourceMappingURL=error-codes.enum.js.map