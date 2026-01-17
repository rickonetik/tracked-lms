"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDev = seedDev;
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
// Загрузка переменных окружения (как в main.ts)
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.local') });
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });
async function seedDev() {
    const databaseUrl = process.env.DATABASE_URL ||
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
    const pool = new pg_1.Pool({
        connectionString: databaseUrl,
    });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({
        adapter,
        log: ['error', 'warn'],
    });
    const logs = [];
    try {
        await prisma.$connect();
        // Шаг 1: Resolve owner user
        const seedOwnerUserId = process.env.SEED_OWNER_USER_ID;
        const seedTelegramId = process.env.SEED_TELEGRAM_ID;
        let ownerUser;
        let ownerUserId;
        let ownerTelegramId = null; // BigInt будет конвертирован в string
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
        }
        else if (seedTelegramId) {
            // Приоритет 2: SEED_TELEGRAM_ID
            ownerUser = await prisma.user.findUnique({
                where: { telegramId: BigInt(seedTelegramId) },
            });
            if (ownerUser) {
                ownerUserId = ownerUser.id;
                ownerTelegramId = ownerUser.telegramId ? String(ownerUser.telegramId) : null;
                logs.push({ entity: 'owner_user', action: 'REUSED', id: ownerUserId });
            }
            else {
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
        }
        else {
            throw new Error('Either SEED_OWNER_USER_ID or SEED_TELEGRAM_ID must be set in environment variables.');
        }
        // Шаг 2: Upsert expert_account by slug
        const expertSlug = process.env.SEED_EXPERT_SLUG || 'dev-expert';
        const expertName = process.env.SEED_EXPERT_NAME || 'Dev Expert';
        const existingExpertAccount = await prisma.expertAccount.findUnique({
            where: { slug: expertSlug },
        });
        let expertAccount;
        let expertAccountId;
        if (existingExpertAccount) {
            expertAccount = existingExpertAccount;
            expertAccountId = expertAccount.id;
            logs.push({ entity: 'expert_account', action: 'REUSED', id: expertAccountId });
        }
        else {
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
        let expertMemberId;
        if (existingMember) {
            expertMember = existingMember;
            expertMemberId = expertMember.id;
            logs.push({ entity: 'expert_member', action: 'REUSED', id: expertMemberId });
        }
        else {
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
        let subscriptionId;
        let subscriptionStatus;
        let subscriptionCurrentPeriodEnd;
        const plan = 'manual_mvp';
        if (activeSubscription) {
            subscription = activeSubscription;
            subscriptionId = subscription.id;
            subscriptionStatus = subscription.status;
            subscriptionCurrentPeriodEnd = subscription.currentPeriodEnd;
            logs.push({ entity: 'subscription', action: 'REUSED', id: subscriptionId });
        }
        else {
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
        const summary = {
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
    }
    catch (error) {
        console.error('Seed failed:', error);
        throw error;
    }
    finally {
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
//# sourceMappingURL=seed-dev.js.map