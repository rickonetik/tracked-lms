# @tracked-lms/shared — Список экспортов

## Enums

### UserRole

Роли пользователей в системе.

**Значения:**
- `UserRole.ADMIN` - Администратор системы
- `UserRole.TEACHER` - Преподаватель/Эксперт
- `UserRole.STUDENT` - Студент/Ученик

**Тип:** `UserRoleType`

**Пример использования:**
```typescript
import { UserRole } from '@tracked-lms/shared';

const userRole = UserRole.STUDENT;
```

### ErrorCode

Коды ошибок API для единообразной обработки ошибок.

**Значения:**
- `ErrorCode.BAD_REQUEST` - Неверный запрос (400)
- `ErrorCode.UNAUTHORIZED` - Не авторизован (401)
- `ErrorCode.FORBIDDEN` - Доступ запрещён (403)
- `ErrorCode.NOT_FOUND` - Ресурс не найден (404)
- `ErrorCode.CONFLICT` - Конфликт (409)
- `ErrorCode.VALIDATION_ERROR` - Ошибка валидации (422)
- `ErrorCode.INTERNAL_SERVER_ERROR` - Внутренняя ошибка сервера (500)
- `ErrorCode.SERVICE_UNAVAILABLE` - Сервис недоступен (503)

**Тип:** `ErrorCodeType`

**Пример использования:**
```typescript
import { ErrorCode } from '@tracked-lms/shared';

const errorCode = ErrorCode.NOT_FOUND;
```

## Типы

- `UserRoleType` - Тип роли пользователя
- `ErrorCodeType` - Тип кода ошибки

## Импорт

```typescript
// Импорт всех экспортов
import { UserRole, ErrorCode, UserRoleType, ErrorCodeType } from '@tracked-lms/shared';

// Импорт отдельных экспортов
import { UserRole } from '@tracked-lms/shared';
import { ErrorCode } from '@tracked-lms/shared';
```

## Использование в проекте

- **apps/api** - Используется для типизации ошибок и ролей
- **apps/webapp** - Используется для типизации UI компонентов
- **apps/bot** - Может использоваться для типизации бота
