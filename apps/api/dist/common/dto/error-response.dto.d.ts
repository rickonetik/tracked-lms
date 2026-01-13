/**
 * Единый формат ответа об ошибке API
 */
export interface ErrorResponseDto {
    /**
     * HTTP статус код
     */
    statusCode: number;
    /**
     * Код ошибки (для клиентской обработки)
     */
    code: string;
    /**
     * Сообщение об ошибке
     */
    message: string;
    /**
     * Дополнительные детали ошибки (опционально)
     */
    details?: unknown;
    /**
     * Временная метка ошибки
     */
    timestamp: string;
    /**
     * Путь запроса, который вызвал ошибку
     */
    path: string;
}
//# sourceMappingURL=error-response.dto.d.ts.map