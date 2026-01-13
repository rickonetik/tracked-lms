# Story 0.12 — Shared package contracts placeholder ✅ ЗАВЕРШЕНО

## Цель

packages/shared для общих типов/констант. Scope: только packages/shared. Сделать: базовые exports: enums ролей, error codes.

## Выполнено

### 1. Создана структура packages/shared

✅ **Файлы:**
- `packages/shared/src/roles.enum.ts` - Enum ролей пользователей
- `packages/shared/src/error-codes.enum.ts` - Enum кодов ошибок
- `packages/shared/src/index.ts` - Главный файл экспортов
- `packages/shared/EXPORTS.md` - Документация экспортов

### 2. Enum ролей (UserRole)

✅ **Создан enum с тремя ролями:**
- `UserRole.ADMIN` - Администратор системы
- `UserRole.TEACHER` - Преподаватель/Эксперт
- `UserRole.STUDENT` - Студент/Ученик

✅ **Экспортируется тип:** `UserRoleType`

### 3. Enum кодов ошибок (ErrorCode)

✅ **Создан enum с кодами ошибок:**
- `ErrorCode.BAD_REQUEST` - Неверный запрос (400)
- `ErrorCode.UNAUTHORIZED` - Не авторизован (401)
- `ErrorCode.FORBIDDEN` - Доступ запрещён (403)
- `ErrorCode.NOT_FOUND` - Ресурс не найден (404)
- `ErrorCode.CONFLICT` - Конфликт (409)
- `ErrorCode.VALIDATION_ERROR` - Ошибка валидации (422)
- `ErrorCode.INTERNAL_SERVER_ERROR` - Внутренняя ошибка сервера (500)
- `ErrorCode.SERVICE_UNAVAILABLE` - Сервис недоступен (503)

✅ **Экспортируется тип:** `ErrorCodeType`

### 4. Настроен package.json

✅ **packages/shared/package.json:**
- `main: "dist/index.js"` - Точка входа для сборки
- `types: "dist/index.d.ts"` - Типы TypeScript
- Скрипты: build, lint, typecheck, clean

### 5. Импорты в apps/api и apps/webapp

✅ **apps/api/package.json:**
- Добавлена зависимость `"@tracked-lms/shared": "*"`

✅ **apps/webapp/package.json:**
- Добавлена зависимость `"@tracked-lms/shared": "*"`

## DoD проверка

✅ **Импортируется в api/webapp**
- Зависимости добавлены в `package.json` обоих приложений
- TypeScript проверка проходит без ошибок

✅ **Сборка монорепы**
- `npm run build` успешно собирает все пакеты
- `packages/shared` собирается в `dist/`
- `apps/api` и `apps/webapp` успешно собираются

✅ **Артефакты: список экспортов**
- Создан файл `packages/shared/EXPORTS.md` с полным списком экспортов
- Документация включает примеры использования

## Ручной тест

```bash
# 1. Сборка shared пакета
cd packages/shared && npm run build
# ✅ Успешно собирается в dist/

# 2. Сборка монорепы
cd ../.. && npm run build
# ✅ Все пакеты собираются успешно

# 3. TypeScript проверка
cd apps/api && npm run typecheck
# ✅ Нет ошибок типов

cd ../webapp && npm run typecheck
# ✅ Нет ошибок типов
```

## Артефакты

✅ **Список экспортов:**
- `packages/shared/EXPORTS.md` - Полная документация всех экспортов
- Включает примеры использования для каждого экспорта

## Структура экспортов

```typescript
// Enums
export { UserRole, type UserRoleType } from './roles.enum';
export { ErrorCode, type ErrorCodeType } from './error-codes.enum';
```

## Использование

```typescript
// В apps/api или apps/webapp
import { UserRole, ErrorCode } from '@tracked-lms/shared';

const role = UserRole.STUDENT;
const errorCode = ErrorCode.NOT_FOUND;
```

## Story 0.12 — ЗАВЕРШЕНА ✅

Все требования выполнены, все DoD проверки пройдены.
