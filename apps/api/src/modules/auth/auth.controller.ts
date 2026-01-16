import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TelegramAuthDto, TelegramAuthResponseDto } from './dto/telegram-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MeResponseDto } from './dto/me-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация через Telegram WebApp initData' })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: TelegramAuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Невалидный initData или отсутствует BOT_TOKEN',
  })
  // TODO: Формат ошибок 401 — стандартный NestJS {message, error, statusCode}.
  // Если нужен единый формат ошибок по платформе — лучше ввести глобальный exception filter
  // на следующем "foundation hardening" этапе.
  async authenticateWithTelegram(@Body() dto: TelegramAuthDto) {
    try {
      return await this.authService.authenticateWithTelegram(dto.initData);
    } catch (error) {
      // Логируем ошибку для отладки
      console.error('[AuthController] Error in authenticateWithTelegram:', error);
      if (error instanceof Error) {
        console.error('[AuthController] Error message:', error.message);
        console.error('[AuthController] Error stack:', error.stack);
      }
      // Перебрасываем ошибку - NestJS обработает её через глобальный exception filter
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить данные текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя',
    type: MeResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Токен отсутствует или невалиден',
  })
  @ApiResponse({
    status: 403,
    description: 'Пользователь забанен',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User is banned' },
        error: { type: 'string', example: 'USER_BANNED' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  async getMe(@Request() req: any): Promise<MeResponseDto> {
    // user добавляется в request через JwtStrategy.validate()
    const user = req.user;

    // userType - derived поле (пока по умолчанию "STUDENT")
    // Позже будет вычисляться: isExpert если есть membership и активная подписка
    const userType = 'STUDENT';

    return {
      id: user.id,
      telegramId: user.telegramId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      status: user.status,
      userType,
    };
  }
}
