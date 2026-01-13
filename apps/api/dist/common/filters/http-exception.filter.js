"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode;
        let code;
        let message;
        let details;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
                code = this.getErrorCode(statusCode);
            }
            else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse;
                message = responseObj.message || exception.message;
                code = responseObj.code || this.getErrorCode(statusCode);
                // Извлекаем детали, исключая уже использованные поля
                const { message: _, code: __, error: ___, statusCode: ____, ...rest } = responseObj;
                details = responseObj.details || (Object.keys(rest).length > 0 ? rest : undefined);
            }
            else {
                message = exception.message;
                code = this.getErrorCode(statusCode);
            }
            // Для ValidationPipe ошибок извлекаем массив ошибок валидации
            if (statusCode === common_1.HttpStatus.BAD_REQUEST && Array.isArray(exceptionResponse)) {
                details = exceptionResponse;
            }
        }
        else {
            // Неизвестная ошибка
            statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            code = 'INTERNAL_SERVER_ERROR';
            message = 'Internal server error';
            details = exception instanceof Error ? exception.message : 'Unknown error';
            // Логируем неизвестные ошибки
            this.logger.error(`Unhandled exception: ${exception instanceof Error ? exception.stack : String(exception)}`, 'HttpExceptionFilter');
        }
        const errorResponse = {
            statusCode,
            code,
            message,
            details: details && Object.keys(details).length > 0 ? details : undefined,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        response.status(statusCode).send(errorResponse);
    }
    /**
     * Маппинг HTTP статус кодов в коды ошибок
     */
    getErrorCode(statusCode) {
        const codeMap = {
            [common_1.HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
            [common_1.HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
            [common_1.HttpStatus.FORBIDDEN]: 'FORBIDDEN',
            [common_1.HttpStatus.NOT_FOUND]: 'NOT_FOUND',
            [common_1.HttpStatus.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED',
            [common_1.HttpStatus.CONFLICT]: 'CONFLICT',
            [common_1.HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
            [common_1.HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
            [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
            [common_1.HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
            [common_1.HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
        };
        return codeMap[statusCode] || 'UNKNOWN_ERROR';
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map