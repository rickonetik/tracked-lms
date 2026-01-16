import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    // Получаем DATABASE_URL из ConfigService или process.env
    const databaseUrl =
      configService.get<string>('DATABASE_URL') ||
      process.env.DATABASE_URL ||
      (() => {
        // Fallback: собираем из отдельных переменных
        const host = configService.get<string>('DB_HOST') || process.env.DB_HOST || 'localhost';
        const port = configService.get<string>('DB_PORT') || process.env.DB_PORT || '5432';
        const user = configService.get<string>('DB_USER') || process.env.DB_USER || 'tracked_lms';
        const password = configService.get<string>('DB_PASSWORD') || process.env.DB_PASSWORD || 'tracked_lms_pass';
        const database = configService.get<string>('DB_NAME') || process.env.DB_NAME || 'tracked_lms';
        return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
      })();

    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL is required but not found. Please set DATABASE_URL or DB_* variables in .env file.',
      );
    }

    // Prisma 7 с engine type "client" требует adapter
    // Используем PrismaPg adapter для PostgreSQL
    // Используем connectionString напрямую - это более надежно
    const pool = new Pool({
      connectionString: databaseUrl,
    });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
