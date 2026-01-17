import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PLATFORM_ROLES_KEY } from '../decorators/require-platform-role.decorator';
import { PlatformRole } from '../platform-role.enum';

@Injectable()
export class PlatformRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<PlatformRole[]>(
      REQUIRE_PLATFORM_ROLES_KEY,
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

    // Получение platform role пользователя
    // Вариант B (временно): PLATFORM_OWNER_IDS env allowlist
    // TODO: заменить на запрос к таблице platform_roles в БД (Story 4.X)
    const platformOwnerIds = process.env.PLATFORM_OWNER_IDS?.split(',').map((id) => id.trim()).filter(Boolean) || [];
    const userPlatformRole = platformOwnerIds.includes(user.id) ? PlatformRole.OWNER : null;

    // Если роль не найдена или не подходит
    if (!userPlatformRole || !requiredRoles.includes(userPlatformRole)) {
      throw new ForbiddenException({
        message: 'Forbidden',
        error: 'PLATFORM_ROLE_REQUIRED',
        statusCode: 403,
      });
    }

    return true;
  }
}
