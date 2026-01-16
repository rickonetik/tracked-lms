import { PrismaService } from '../../common/prisma.service';
export interface TelegramUserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /**
     * Создает или обновляет пользователя по telegramId
     */
    upsertByTelegramId(telegramId: bigint, userData: TelegramUserData): Promise<{
        id: string;
        telegramId: bigint | null;
        firstName: string;
        lastName: string | null;
        username: string | null;
        email: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Находит пользователя по telegramId
     */
    findByTelegramId(telegramId: bigint): Promise<{
        id: string;
        telegramId: bigint | null;
        username: string | null;
        email: string | null;
        firstName: string;
        lastName: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
//# sourceMappingURL=users.service.d.ts.map