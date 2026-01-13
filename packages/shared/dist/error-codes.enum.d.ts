/**
 * Коды ошибок API
 * Используются в ErrorResponseDto для единообразной обработки ошибок
 */
export declare enum ErrorCode {
    /**
     * Неверный запрос
     */
    BAD_REQUEST = "BAD_REQUEST",
    /**
     * Не авторизован
     */
    UNAUTHORIZED = "UNAUTHORIZED",
    /**
     * Доступ запрещён
     */
    FORBIDDEN = "FORBIDDEN",
    /**
     * Ресурс не найден
     */
    NOT_FOUND = "NOT_FOUND",
    /**
     * Конфликт (например, дубликат)
     */
    CONFLICT = "CONFLICT",
    /**
     * Ошибка валидации
     */
    VALIDATION_ERROR = "VALIDATION_ERROR",
    /**
     * Внутренняя ошибка сервера
     */
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    /**
     * Сервис недоступен
     */
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}
/**
 * Тип кода ошибки
 */
export type ErrorCodeType = ErrorCode;
//# sourceMappingURL=error-codes.enum.d.ts.map