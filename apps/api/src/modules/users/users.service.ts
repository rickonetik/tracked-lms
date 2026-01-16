import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { Prisma } from '@prisma/client';

export interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создает или обновляет пользователя по telegramId
   */
  async upsertByTelegramId(telegramId: bigint, userData: TelegramUserData): Promise<{
    id: string;
    telegramId: bigint | null;
    firstName: string;
    lastName: string | null;
    username: string | null;
    email: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    // Используем findUnique + create/update вместо upsert
    // из-за проблем с partial unique indexes в Prisma 7 + adapter-pg
    const existing = await this.prisma.user.findUnique({
      where: {
        telegramId: telegramId,
      },
    });

    if (existing) {
      // Обновляем существующего пользователя
      return this.prisma.user.update({
        where: {
          telegramId: telegramId,
        },
        data: {
          firstName: userData.first_name,
          lastName: userData.last_name || null,
          username: userData.username || null,
          // Не обновляем email и status при обновлении через Telegram
        },
      });
    } else {
      // Создаем нового пользователя
      return this.prisma.user.create({
        data: {
          telegramId: telegramId,
          firstName: userData.first_name,
          lastName: userData.last_name || null,
          username: userData.username || null,
          email: null, // Email не приходит из Telegram initData
          status: 'active', // По умолчанию active
        },
      });
    }
  }

  /**
   * Находит пользователя по telegramId
   */
  async findByTelegramId(telegramId: bigint) {
    return this.prisma.user.findUnique({
      where: {
        telegramId: telegramId,
      },
    });
  }
}
