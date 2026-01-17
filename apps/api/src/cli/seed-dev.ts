import * as dotenv from 'dotenv';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Загрузка переменных окружения (как в main.ts)
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

interface SeedResult {
  ownerUserId: string;
  ownerTelegramId: string | null; // BigInt конвертируется в string
  expertAccountId: string;
  slug: string;
  expertMemberId: string;
  subscriptionId: string;
  subscriptionStatus: string;
  plan: string;
  currentPeriodEnd: string | null; // ISO string или null
}

interface SeedLog {
  entity: string;
  action: 'CREATED' | 'REUSED';
  id: string;
}

async function seedDev(): Promise<void> {
  const databaseUrl =
    process.env.DATABASE_URL ||
    (() => {
      const host = process.env.DB_HOST || 'localhost';
      const port = process.env.DB_PORT || '5432';
      const user = process.env.DB_USER || 'tracked_lms';
      const password = process.env.DB_PASSWORD || 'tracked_lms_pass';
      const database = process.env.DB_NAME || 'tracked_lms';
      return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
    })();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required but not found. Please set DATABASE_URL or DB_* variables in .env file.');
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });
  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });

  const logs: SeedLog[] = [];

  try {
    await prisma.$connect();

    // Шаг 1: Resolve owner user
    const seedOwnerUserId = process.env.SEED_OWNER_USER_ID;
    const seedTelegramId = process.env.SEED_TELEGRAM_ID;

    let ownerUser;
    let ownerUserId: string;
    let ownerTelegramId: string | null = null; // BigInt будет конвертирован в string

    if (seedOwnerUserId) {
      // Приоритет 1: SEED_OWNER_USER_ID
      ownerUser = await prisma.user.findUnique({
        where: { id: seedOwnerUserId },
      });

      if (!ownerUser) {
        throw new Error(`User with SEED_OWNER_USER_ID=${seedOwnerUserId} not found in database.`);
      }

      ownerUserId = ownerUser.id;
      ownerTelegramId = ownerUser.telegramId ? String(ownerUser.telegramId) : null;
      logs.push({ entity: 'owner_user', action: 'REUSED', id: ownerUserId });
    } else if (seedTelegramId) {
      // Приоритет 2: SEED_TELEGRAM_ID
      ownerUser = await prisma.user.findUnique({
        where: { telegramId: BigInt(seedTelegramId) },
      });

      if (ownerUser) {
        ownerUserId = ownerUser.id;
        ownerTelegramId = ownerUser.telegramId ? String(ownerUser.telegramId) : null;
        logs.push({ entity: 'owner_user', action: 'REUSED', id: ownerUserId });
      } else {
        // Создаём нового пользователя
        ownerUser = await prisma.user.create({
          data: {
            telegramId: BigInt(seedTelegramId),
            firstName: 'Seed',
            status: 'active',
          },
        });
        ownerUserId = ownerUser.id;
        ownerTelegramId = ownerUser.telegramId ? String(ownerUser.telegramId) : null;
        logs.push({ entity: 'owner_user', action: 'CREATED', id: ownerUserId });
      }
    } else {
      throw new Error(
        'Either SEED_OWNER_USER_ID or SEED_TELEGRAM_ID must be set in environment variables.',
      );
    }

    // Шаг 2: Upsert expert_account by slug
    const expertSlug = process.env.SEED_EXPERT_SLUG || 'dev-expert';
    const expertName = process.env.SEED_EXPERT_NAME || 'Dev Expert';

    const existingExpertAccount = await prisma.expertAccount.findUnique({
      where: { slug: expertSlug },
    });

    let expertAccount;
    let expertAccountId: string;

    if (existingExpertAccount) {
      expertAccount = existingExpertAccount;
      expertAccountId = expertAccount.id;
      logs.push({ entity: 'expert_account', action: 'REUSED', id: expertAccountId });
    } else {
      expertAccount = await prisma.expertAccount.create({
        data: {
          slug: expertSlug,
          title: expertName,
          ownerUserId,
        },
      });
      expertAccountId = expertAccount.id;
      logs.push({ entity: 'expert_account', action: 'CREATED', id: expertAccountId });
    }

    // Шаг 3: Upsert expert_member by (expertAccountId, userId) with role=owner
    const existingMember = await prisma.expertMember.findUnique({
      where: {
        expertAccountId_userId: {
          expertAccountId,
          userId: ownerUserId,
        },
      },
    });

    let expertMember;
    let expertMemberId: string;

    if (existingMember) {
      expertMember = existingMember;
      expertMemberId = expertMember.id;
      logs.push({ entity: 'expert_member', action: 'REUSED', id: expertMemberId });
    } else {
      expertMember = await prisma.expertMember.create({
        data: {
          expertAccountId,
          userId: ownerUserId,
          role: 'owner',
        },
      });
      expertMemberId = expertMember.id;
      logs.push({ entity: 'expert_member', action: 'CREATED', id: expertMemberId });
    }

    // Шаг 4: Ensure subscription (ровно 1 активная)
    const now = new Date();
    const seedSubscriptionEnd = process.env.SEED_SUBSCRIPTION_END;
    const currentPeriodEnd = seedSubscriptionEnd ? new Date(seedSubscriptionEnd) : null;

    // Ищем активную подписку (status=active и currentPeriodEnd null/в будущем)
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        expertAccountId,
        status: 'active',
        OR: [
          { currentPeriodEnd: null },
          { currentPeriodEnd: { gt: now } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let subscription;
    let subscriptionId: string;
    let subscriptionStatus: string;
    let subscriptionCurrentPeriodEnd: Date | null;
    const plan = 'manual_mvp';

    if (activeSubscription) {
      subscription = activeSubscription;
      subscriptionId = subscription.id;
      subscriptionStatus = subscription.status;
      subscriptionCurrentPeriodEnd = subscription.currentPeriodEnd;
      logs.push({ entity: 'subscription', action: 'REUSED', id: subscriptionId });
    } else {
      // Создаём новую активную подписку
      subscription = await prisma.subscription.create({
        data: {
          expertAccountId,
          plan: 'manual_mvp',
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: currentPeriodEnd, // null (бессрочно) или из ENV
        },
      });
      subscriptionId = subscription.id;
      subscriptionStatus = subscription.status;
      subscriptionCurrentPeriodEnd = subscription.currentPeriodEnd;
      logs.push({ entity: 'subscription', action: 'CREATED', id: subscriptionId });
    }

    // Вывод логов
    console.log('\n=== Seed Logs ===');
    logs.forEach((log) => {
      console.log(`${log.action}: ${log.entity} (id: ${log.id})`);
    });

    // Вывод summary JSON
    const summary: SeedResult = {
      ownerUserId,
      ownerTelegramId: ownerTelegramId ? String(ownerTelegramId) : null,
      expertAccountId,
      slug: expertSlug,
      expertMemberId,
      subscriptionId,
      subscriptionStatus,
      plan,
      currentPeriodEnd: subscriptionCurrentPeriodEnd ? subscriptionCurrentPeriodEnd.toISOString() : null,
    };

    console.log('\n=== Summary ===');
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// Запуск скрипта
if (require.main === module) {
  seedDev()
    .then(() => {
      console.log('\n✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seed failed:', error);
      process.exit(1);
    });
}

export { seedDev };
