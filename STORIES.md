# Tracked LMS — Завершенные Stories

## Epic 0 — Foundation (Репозиторий, окружение, скелет)

### Story 0.1 — Monorepo scaffold ✅
**PR:** `chore/monorepo-scaffold`

Создана структура monorepo:
- Workspaces: `apps/*`, `packages/*`
- Структура: `apps/api`, `apps/webapp`, `apps/bot`, `packages/shared`
- Базовые `tsconfig.json` файлы
- Минимальные README

**DoD:** ✅ `npm run build|lint|typecheck` зелёные

---

### Story 0.2 — Lint/format baseline ✅
**PR:** `chore/lint-format-baseline`

Единые ESLint/Prettier правила:
- ESLint конфигурация
- Prettier конфигурация
- `.editorconfig`
- `lint-staged` и `husky` для pre-commit хуков

**DoD:** ✅ pre-commit работает, форматируется

---

### Story 0.3 — Docker Compose (pg/redis/minio) ✅
**PR:** `chore/infra-compose`

Локальная инфраструктура:
- `infra/docker-compose.yml` с PostgreSQL, Redis, MinIO
- Инструкции в `infra/README.md`
- `.env.example` с настройками

**DoD:** ✅ 3 сервиса Up, доступ к pg/redis/minio

---

### Story 0.4 — API skeleton + /health ✅
**PR:** `feat/api-health`

NestJS+Fastify сервер:
- `GET /health` endpoint
- Config validation
- Базовая структура API

**DoD:** ✅ endpoint работает

---

### Story 0.5 — WebApp skeleton + routing 3 tabs ✅
**PR:** `feat/webapp-skeleton`

React+Vite+Router:
- 3 вкладки: `/learning`, `/expert`, `/account`
- Layout с header
- Клиентская маршрутизация

**DoD:** ✅ навигация работает

---

### Story 0.6 — Bot skeleton (grammY) + /start ✅
**PR:** `feat/bot-skeleton`

Telegram Bot на grammY:
- Базовая структура бота
- Команда `/start`
- Env validation для `BOT_TOKEN`

**DoD:** ✅ бот отвечает на `/start`

---

### Story 0.7 — Unified env & ports ✅
**PR:** `chore/dev-env-unify`

Единые переменные окружения:
- `.env.example` с всеми переменными
- Использование в коде через `process.env`
- Централизованная конфигурация

**DoD:** ✅ сервисы берут порты из env

---

### Story 0.8 — Dev public: ngrok helper ✅
**PR:** `feat/dev-public-ngrok`

Скрипт для публичного доступа:
- `npm run dev:public` запускает ngrok
- Автоматический вывод публичного URL
- Инструкции для Telegram Mini App

**DoD:** ✅ URL открывается

---

### Story 0.9 — CI pipeline минимальный ✅
**PR:** `chore/ci-basic`

GitHub Actions CI pipeline:
- 3 jobs: `lint`, `typecheck`, `build`
- Автоматический запуск на push/PR
- Использует npm workspaces

**DoD:** ✅ PR зелёный, все jobs проходят

**Особенности:**
- Переход с pnpm на npm workspaces
- Настроено кэширование
- Параллельное выполнение jobs

---

### Story 0.10 — API error format (единый) ✅
**PR:** `chore/api-error-format`

Единый формат ошибок API:
- `ErrorResponseDto` интерфейс
- Global exception filter (`HttpExceptionFilter`)
- Маппинг HTTP статус кодов в коды ошибок

**DoD:** ✅ 400/401/403/404/409/422 возвращают единый JSON

**Формат ошибки:**
```typescript
{
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  path: string;
}
```

---

### Story 0.11 — OpenAPI/Swagger включить ✅
**PR:** `chore/api-swagger`

Swagger документация для API:
- `/docs` - Swagger UI (только в dev режиме)
- `/docs-json` - OpenAPI JSON спецификация
- Настроен для Fastify adapter
- Требует `@fastify/static` для статических файлов

**DoD:** ✅ swagger доступен в dev режиме

**Особенности:**
- Локализованы зависимости: `class-validator`, `class-transformer`, `@nestjs/swagger`
- Swagger setup происходит ДО `app.listen()` (требование Fastify)
- `useGlobalPrefix: false` для стабильного пути `/docs`

---

### Story 0.12 — Shared package contracts placeholder ✅
**PR:** `chore/shared-contracts-base`

Базовые контракты в `packages/shared`:
- `UserRole` enum (ADMIN, TEACHER, STUDENT)
- `ErrorCode` enum (8 кодов ошибок)
- Экспорты типов
- Документация в `EXPORTS.md`

**DoD:** ✅ импортируется в api/webapp, сборка монорепы работает

**Экспорты:**
```typescript
export { UserRole, type UserRoleType } from './roles.enum';
export { ErrorCode, type ErrorCodeType } from './error-codes.enum';
```

---

## Версия 0.1.1

Все Stories из Epic 0 завершены. Проект готов к дальнейшей разработке.

**Основные компоненты:**
- ✅ Monorepo структура (npm workspaces + turbo)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ API сервер (NestJS + Fastify)
- ✅ WebApp (React + Vite)
- ✅ Telegram Bot (grammY)
- ✅ Shared package для общих типов
- ✅ Локальная инфраструктура (Docker Compose)
- ✅ Единый формат ошибок API
