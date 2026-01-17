import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ExpertMeResponseDto, ExpertAccountDto, MembershipDto, SubscriptionDto, PermissionsDto } from './dto/expert-me.dto';
import { ExpertRole } from '../../common/rbac/expert-role.enum';

@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) {}

  /**
   * Маппинг роли в permission string
   */
  private roleToPermission(role: string): string {
    const roleUpper = role.toUpperCase();
    return `EXPERT_${roleUpper}`;
  }

  /**
   * Приоритет ролей для детерминированного выбора
   * OWNER > manager > reviewer
   */
  private getRolePriority(role: string): number {
    switch (role) {
      case 'owner':
        return 3;
      case 'manager':
        return 2;
      case 'reviewer':
        return 1;
      default:
        return 0;
    }
  }

  /**
   * Детерминированный выбор membership при нескольких
   * Правило: OWNER first, затем по приоритету роли, затем по createdAt ASC
   */
  private selectMembership(
    memberships: Array<{
      id: string;
      role: string;
      userId: string;
      expertAccountId: string;
      expertAccount: { id: string; slug: string; title: string; ownerUserId: string; createdAt: Date };
    }>,
  ) {
    // Сначала ищем OWNER
    const ownerMemberships = memberships.filter((m) => m.role === 'owner');
    if (ownerMemberships.length > 0) {
      // Если несколько OWNER - выбираем самый ранний expertAccount по createdAt
      return ownerMemberships.sort(
        (a, b) => a.expertAccount.createdAt.getTime() - b.expertAccount.createdAt.getTime(),
      )[0];
    }

    // Иначе сортируем по приоритету роли (desc), затем по createdAt ASC
    return memberships.sort((a, b) => {
      const priorityDiff = this.getRolePriority(b.role) - this.getRolePriority(a.role);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.expertAccount.createdAt.getTime() - b.expertAccount.createdAt.getTime();
    })[0];
  }

  async getExpertMe(userId: string): Promise<ExpertMeResponseDto> {
    // Шаг 1: Получить все memberships пользователя
    const memberships = await this.prisma.expertMember.findMany({
      where: {
        userId,
      },
      include: {
        expertAccount: {
          select: {
            id: true,
            slug: true,
            title: true,
            ownerUserId: true,
            createdAt: true,
          },
        },
      },
    });

    // Шаг 2: Проверка membership (404 если нет)
    if (memberships.length === 0) {
      throw new NotFoundException({
        message: 'Expert account not found',
        error: 'EXPERT_NOT_FOUND',
        statusCode: 404,
      });
    }

    // Шаг 3: Детерминированный выбор membership
    const selectedMembership = this.selectMembership(memberships);
    const expertAccountId = selectedMembership.expertAccountId;

    // Шаг 4: Найти активную подписку по предикату
    const now = new Date();

    // Предикат: status='active' AND (currentPeriodEnd IS NULL OR currentPeriodEnd > now())
    // Детерминированный выбор: ORDER BY currentPeriodEnd NULLS FIRST, createdAt DESC LIMIT 1
    // Примечание: Prisma не поддерживает NULLS FIRST напрямую, используем два запроса или raw SQL
    // Для MVP: сначала ищем с NULL, если нет - ищем с future date
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

    // Шаг 5: Проверка активной подписки (403 если нет)
    if (!activeSubscription) {
      throw new ForbiddenException({
        message: 'Subscription is inactive',
        error: 'SUBSCRIPTION_INACTIVE',
        statusCode: 403,
      });
    }

    // Шаг 6: Собрать DTO
    const expertAccount: ExpertAccountDto = {
      id: selectedMembership.expertAccount.id,
      slug: selectedMembership.expertAccount.slug,
      title: selectedMembership.expertAccount.title,
      ownerUserId: selectedMembership.expertAccount.ownerUserId,
    };

    const membership: MembershipDto = {
      id: selectedMembership.id,
      role: selectedMembership.role,
      userId: selectedMembership.userId,
      expertAccountId: selectedMembership.expertAccountId,
    };

    const subscription: SubscriptionDto = {
      id: activeSubscription.id,
      status: activeSubscription.status,
      plan: activeSubscription.plan,
      currentPeriodStart: activeSubscription.currentPeriodStart?.toISOString() ?? null,
      currentPeriodEnd: activeSubscription.currentPeriodEnd?.toISOString() ?? null,
    };

    // Шаг 7: Сформировать permissions
    const platformPermissions: string[] = [];
    // TODO: в будущем можно добавить platform permissions из env allowlist или БД

    const expertPermissions: string[] = [this.roleToPermission(selectedMembership.role)];

    const permissions: PermissionsDto = {
      platform: platformPermissions,
      expert: expertPermissions,
    };

    return {
      expertAccount,
      membership,
      subscription,
      permissions,
    };
  }
}
