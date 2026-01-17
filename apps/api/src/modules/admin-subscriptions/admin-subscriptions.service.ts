import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { SetSubscriptionStatusDto } from './dto/set-subscription-status.dto';
import { SetSubscriptionStatusResponseDto, SubscriptionSnapshotDto } from './dto/set-subscription-status.response.dto';
import { SubscriptionStatus, SubscriptionPlan } from '@prisma/client';

@Injectable()
export class AdminSubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async setSubscriptionStatus(
    expertAccountId: string,
    dto: SetSubscriptionStatusDto,
    changedByUserId: string,
  ): Promise<SetSubscriptionStatusResponseDto> {
    // Шаг 1: Проверка существования expertAccount
    const expertAccount = await this.prisma.expertAccount.findUnique({
      where: { id: expertAccountId },
    });

    if (!expertAccount) {
      throw new NotFoundException({
        message: 'Expert account not found',
        error: 'EXPERT_ACCOUNT_NOT_FOUND',
        statusCode: 404,
      });
    }

    // Шаг 2: Валидация и вычисление currentPeriodEnd
    let currentPeriodEnd: Date | null = null;

    if (dto.currentPeriodEnd !== undefined && dto.currentPeriodEnd !== null) {
      // Парсим ISO строку
      const parsedDate = new Date(dto.currentPeriodEnd);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException({
          message: 'Invalid currentPeriodEnd format. Must be a valid ISO date string.',
          error: 'INVALID_CURRENT_PERIOD_END',
          statusCode: 400,
        });
      }
      currentPeriodEnd = parsedDate;
    } else if (
      (dto.status === 'expired' || dto.status === 'canceled') &&
      dto.currentPeriodEnd === undefined
    ) {
      // Автоматически ставим now() для expired/canceled, если не задан
      currentPeriodEnd = new Date();
    }
    // Если status='active' и currentPeriodEnd не задан — оставляем null (бессрочная)

    // Шаг 3: Создание новой записи subscription (история сохраняется)
    const now = new Date();
    const subscription = await this.prisma.subscription.create({
      data: {
        expertAccountId,
        plan: dto.plan,
        status: dto.status,
        currentPeriodStart: now,
        currentPeriodEnd,
        // TODO: интегрировать с AuditService в Story 8.2
        // reason сохраняется в лог/комментарий (пока не сохраняем, т.к. нет audit_logs)
      },
    });

    // Шаг 4: Найти активную подписку (тем же предикатом, что и gate из Story 4.3)
    // Предикат: status='active' AND (currentPeriodEnd IS NULL OR currentPeriodEnd > now())
    // Детерминированный выбор: ORDER BY currentPeriodEnd NULLS FIRST, createdAt DESC LIMIT 1
    let activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        expertAccountId,
        status: 'active',
        currentPeriodEnd: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!activeSubscription) {
      activeSubscription = await this.prisma.subscription.findFirst({
        where: {
          expertAccountId,
          status: 'active',
          currentPeriodEnd: { gt: now },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Шаг 5: Формирование ответа
    const subscriptionSnapshot: SubscriptionSnapshotDto = {
      id: subscription.id,
      status: subscription.status,
      plan: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || null,
      createdAt: subscription.createdAt.toISOString(),
    };

    const activeSubscriptionSnapshot: SubscriptionSnapshotDto | null =
      activeSubscription
        ? {
            id: activeSubscription.id,
            status: activeSubscription.status,
            plan: activeSubscription.plan,
            currentPeriodEnd:
              activeSubscription.currentPeriodEnd?.toISOString() || null,
            createdAt: activeSubscription.createdAt.toISOString(),
          }
        : null;

    return {
      expertAccountId,
      subscription: subscriptionSnapshot,
      activeSubscription: activeSubscriptionSnapshot,
      changedByUserId,
      requestedAt: now.toISOString(),
    };
  }
}
