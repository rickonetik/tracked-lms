import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verifyTelegramInitData } from '../../common/telegram-verify.util';
import { UsersService, TelegramUserData } from '../users/users.service';

interface ParsedInitData {
  user?: TelegramUserData;
  auth_date?: string;
  query_id?: string;
  hash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Парсит initData и извлекает данные пользователя
   */
  private parseInitData(initData: string): ParsedInitData {
    const params = new URLSearchParams(initData);
    const result: ParsedInitData = {
      hash: params.get('hash') || '',
    };

    const userStr = params.get('user');
    if (userStr) {
      try {
        result.user = JSON.parse(userStr);
      } catch (e) {
        // Игнорируем ошибки парсинга JSON
      }
    }

    result.auth_date = params.get('auth_date') || undefined;
    result.query_id = params.get('query_id') || undefined;

    return result;
  }

  /**
   * Авторизует пользователя через Telegram initData
   * 
   * TODO: Формат ошибок 401 — стандартный NestJS {message, error, statusCode}.
   * Если нужен единый формат ошибок по платформе — лучше ввести глобальный exception filter
   * на следующем "foundation hardening" этапе.
   */
  async authenticateWithTelegram(initData: string) {
    // Получаем BOT_TOKEN из конфигурации
    const botToken = this.configService.get<string>('BOT_TOKEN');
    if (!botToken) {
      throw new UnauthorizedException('BOT_TOKEN not configured');
    }

    // Проверяем подпись initData
    const isValid = verifyTelegramInitData(initData, botToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    // Парсим initData
    const parsed = this.parseInitData(initData);
    if (!parsed.user || !parsed.user.id) {
      throw new UnauthorizedException('User data not found in initData');
    }

    // Upsert пользователя в БД
    const telegramId = BigInt(parsed.user.id);
    const user = await this.usersService.upsertByTelegramId(telegramId, parsed.user);

    // Генерируем JWT токен
    const payload = {
      sub: user.id,
      telegramId: user.telegramId?.toString() || null,
    };

    const accessToken = this.jwtService.sign(payload);

    // userType - derived поле (пока по умолчанию "STUDENT")
    // Позже будет вычисляться: isExpert если есть membership и активная подписка
    const userType = 'STUDENT';

    return {
      accessToken,
      user: {
        id: user.id,
        telegramId: user.telegramId?.toString() || null, // Преобразуем bigint в string для JSON
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        status: user.status,
        userType, // Derived поле: пока "STUDENT", позже вычисляется из membership/subscription
      },
    };
  }
}
