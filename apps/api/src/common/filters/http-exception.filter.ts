import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let statusCode: number;
    let code: string;
    let message: string;
    let details: unknown;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        code = this.getErrorCode(statusCode);
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        code = (responseObj.code as string) || this.getErrorCode(statusCode);
        
        // Извлекаем детали, исключая уже использованные поля
        const { message: _, code: __, error: ___, statusCode: ____, ...rest } = responseObj;
        details = responseObj.details || (Object.keys(rest).length > 0 ? rest : undefined);
      } else {
        message = exception.message;
        code = this.getErrorCode(statusCode);
      }

      // Для ValidationPipe ошибок извлекаем массив ошибок валидации
      if (statusCode === HttpStatus.BAD_REQUEST && Array.isArray(exceptionResponse)) {
        details = exceptionResponse;
      }
    } else {
      // Неизвестная ошибка
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'INTERNAL_SERVER_ERROR';
      message = 'Internal server error';
      details = exception instanceof Error ? exception.message : 'Unknown error';

      // Логируем неизвестные ошибки
      this.logger.error(
        `Unhandled exception: ${exception instanceof Error ? exception.stack : String(exception)}`,
        'HttpExceptionFilter',
      );
    }

    const errorResponse: ErrorResponseDto = {
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
  private getErrorCode(statusCode: number): string {
    const codeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.METHOD_NOT_ALLOWED]: 'METHOD_NOT_ALLOWED',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
      [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    return codeMap[statusCode] || 'UNKNOWN_ERROR';
  }
}
