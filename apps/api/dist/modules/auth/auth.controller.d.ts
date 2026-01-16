import { AuthService } from './auth.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { MeResponseDto } from './dto/me-response.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    authenticateWithTelegram(dto: TelegramAuthDto): Promise<{
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
    getMe(req: any): Promise<MeResponseDto>;
}
//# sourceMappingURL=auth.controller.d.ts.map