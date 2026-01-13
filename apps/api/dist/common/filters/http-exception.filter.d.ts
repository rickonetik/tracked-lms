import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    /**
     * Маппинг HTTP статус кодов в коды ошибок
     */
    private getErrorCode;
}
//# sourceMappingURL=http-exception.filter.d.ts.map