import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    /**
     * Парсит initData и извлекает данные пользователя
     */
    private parseInitData;
    /**
     * Авторизует пользователя через Telegram initData
     *
     * TODO: Формат ошибок 401 — стандартный NestJS {message, error, statusCode}.
     * Если нужен единый формат ошибок по платформе — лучше ввести глобальный exception filter
     * на следующем "foundation hardening" этапе.
     */
    authenticateWithTelegram(initData: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            telegramId: string | null;
            firstName: string;
            lastName: string | null;
            username: string | null;
            status: string;
            userType: string;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map