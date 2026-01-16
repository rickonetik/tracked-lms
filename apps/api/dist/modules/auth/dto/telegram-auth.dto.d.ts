export declare class TelegramAuthDto {
    initData: string;
}
export declare class TelegramAuthResponseDto {
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
}
//# sourceMappingURL=telegram-auth.dto.d.ts.map