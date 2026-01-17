import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma.service';
import { REQUIRE_EXPERT_ROLES_KEY } from '../decorators/require-expert-role.decorator';
import { ExpertRole } from '../expert-role.enum';

@Injectable()
export class ExpertRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ExpertRole[]>(
      REQUIRE_EXPERT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Если декоратор не применён, разрешаем доступ
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Проверка авторизации
    if (!user?.id) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    // Получение expertAccountId из params или query
    const expertAccountId = request.params?.expertAccountId || request.query?.expertAccountId;

    if (!expertAccountId) {
      throw new BadRequestException({
        message: 'expertAccountId is required',
        error: 'EXPERT_ACCOUNT_ID_REQUIRED',
        statusCode: 400,
      });
    }

    // Проверка membership в expert_members
    const membership = await this.prisma.expertMember.findFirst({
      where: {
        expertAccountId,
        userId: user.id,
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException({
        message: 'Forbidden',
        error: 'EXPERT_MEMBERSHIP_REQUIRED',
        statusCode: 403,
      });
    }

    // Проверка роли
    const userRole = membership.role as ExpertRole;
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException({
        message: 'Forbidden',
        error: 'EXPERT_ROLE_REQUIRED',
        statusCode: 403,
      });
    }

    return true;
  }
}
