# Version 0.1 — Foundation (Итоговая версия)

**Release Date:** 2026-01-13  
**Tag:** `v0.1`

## Overview

Version 0.1 — Foundation. Итоговая версия с полным набором foundation компонентов, проведенными тестами и CI/CD pipeline. Проект готов к разработке функционала.

## Foundation Components

### Repository & Infrastructure
- ✅ Monorepo структура (pnpm workspaces + turbo)
- ✅ Docker Compose (PostgreSQL, Redis, MinIO)
- ✅ Единые переменные окружения
- ✅ CI/CD pipeline (GitHub Actions) с smoke тестами
- ✅ Package manager контроль (только pnpm)

### Development Experience
- ✅ Lint/format baseline (ESLint, Prettier, husky)
- ✅ TypeScript конфигурация
- ✅ Dev tools (ngrok helper для публичного доступа)
- ✅ Swagger документация API (dev-only)
- ✅ Unified error format для API

### Applications Skeleton
- ✅ API server (NestJS + Fastify)
  - Health check endpoint (`/health`)
  - Swagger UI (`/docs`) и OpenAPI JSON (`/docs-json`)
  - Global exception filter
  - Validation pipes
- ✅ WebApp (React + Vite)
  - Client-side routing (`/learning`, `/expert`, `/account`)
  - Навигация между вкладками
- ✅ Telegram Bot (grammY)
  - `/start` command handler
  - Базовая структура для расширения

### Shared Contracts
- ✅ Shared package (`packages/shared`)
  - `UserRole` enum (ADMIN, TEACHER, STUDENT)
  - `ErrorCode` enum (стандартизированные коды ошибок)

## Completed Stories (Epic 0)

Все 12 stories из Epic 0:

1. **0.1: Monorepo scaffold** ✅
   - Структура monorepo с pnpm workspaces
   - Turbo для build системы
   - Базовые конфигурации

2. **0.2: Lint/format baseline** ✅
   - ESLint + Prettier конфигурация
   - Husky pre-commit hooks
   - EditorConfig

3. **0.3: Docker Compose** ✅
   - PostgreSQL 15 (с volume persistence)
   - Redis 7 (с volume persistence)
   - MinIO (S3-compatible storage)

4. **0.4: API skeleton + /health** ✅
   - NestJS + Fastify adapter
   - Health check endpoint
   - Config validation

5. **0.5: WebApp skeleton + routing** ✅
   - React + Vite
   - React Router для клиентской маршрутизации
   - 3 основные вкладки

6. **0.6: Bot skeleton + /start** ✅
   - grammY framework
   - Базовая команда `/start`
   - Структура для расширения

7. **0.7: Unified env & ports** ✅
   - Централизованный `.env` файл
   - Единые порты для всех сервисов
   - Config validation

8. **0.8: Dev public ngrok helper** ✅
   - Скрипт `pnpm dev:public`
   - Автоматический запуск ngrok
   - Публичный URL для WebApp

9. **0.9: CI pipeline минимальный** ✅
   - GitHub Actions workflow
   - Lint, TypeCheck, Build jobs
   - Автоматические проверки при PR

10. **0.10: API error format** ✅
    - Unified `ErrorResponseDto`
    - Global exception filter
    - Стандартизированные ошибки

11. **0.11: OpenAPI/Swagger** ✅
    - Swagger UI (`/docs`)
    - OpenAPI JSON (`/docs-json`)
    - Dev-only режим

12. **0.12: Shared package contracts** ✅
    - `packages/shared` для общих типов
    - Enums для ролей и кодов ошибок
    - Экспорты для использования в других пакетах

## Testing & Validation

### A. Repository and Tooling ✅
- ✅ `pnpm -w install` — зависимости установлены
- ✅ `pnpm run build` — все приложения собираются
- ✅ `pnpm run typecheck` — проверка типов проходит
- ✅ `pnpm run lint` — линтинг проходит
- ✅ Dependency sanity — все зависимости корректны

### B. Infra (Docker Compose) ✅
- ✅ Поднятие инфраструктуры (`docker compose up -d`)
- ✅ PostgreSQL connectivity — подключение работает
- ✅ Redis connectivity — подключение работает
- ✅ MinIO sanity — консоль доступна, bucket создан
- ✅ Postgres volume persistence — данные сохраняются после перезапуска
- ✅ MinIO bucket smoke — bucket создан и доступен

### C. API Runtime ✅
- ✅ API стартует без ошибок
- ✅ `/health` endpoint возвращает корректный JSON
- ✅ Swagger UI (`/docs`) доступен (200)
- ✅ OpenAPI JSON (`/docs-json`) доступен (200)

### D. WebApp Runtime ✅
- ✅ WebApp стартует и открывается
- ✅ Роуты `/learning`, `/expert`, `/account` работают
- ✅ Навигация между вкладками без ошибок

### E. Bot Runtime ✅
- ✅ Bot подключается к Telegram без падений
- ✅ Команда `/start` отвечает корректно

### F. Dev Public (ngrok) ✅
- ✅ ngrok URL выдаётся корректно
- ✅ WebApp доступен по ngrok URL

### G. Перезапуск и идемпотентность ✅
- ✅ Restart test — все сервисы перезапускаются без "залипаний"
- ✅ Docker volume persistence — данные сохраняются после `docker compose down/up`

### H. Контроль Package Manager ✅
- ✅ Guard: запрет npm lock — `package-lock.json` отсутствует
- ✅ README: "use pnpm only" — явное указание в документации
- ✅ Dependency graph единообразный — используется только `pnpm-lock.yaml`

### I. Мини CI Smoke ✅
- ✅ CI повторяет базу (lint/typecheck/build)
- ✅ Smoke тесты:
  - Поднимает API в CI
  - Тестирует `/health` (200, содержит `"ok"`)
  - Тестирует `/docs` (200)
  - Тестирует `/docs-json` (200, содержит `"openapi"`)

## CI/CD Pipeline

### GitHub Actions Workflow
- **Lint job**: Проверка кода линтером (pnpm)
- **TypeCheck job**: Проверка типов TypeScript (pnpm)
- **Build job**: Сборка всех приложений (pnpm)
- **Smoke job**: Runtime тесты API endpoints

Все jobs используют `pnpm` для единообразия.

## Key Features

### API Server
- NestJS framework с Fastify adapter
- Health check endpoint
- Swagger/OpenAPI документация (dev-only)
- Unified error handling
- Config validation

### WebApp
- React 18 с Vite
- React Router для маршрутизации
- 3 основные вкладки (Learning, Expert, Account)
- Поддержка ngrok для публичного доступа

### Telegram Bot
- grammY framework
- Базовая команда `/start`
- Готова к расширению функционала

### Infrastructure
- Docker Compose для локальной разработки
- PostgreSQL с volume persistence
- Redis с volume persistence
- MinIO для S3-compatible storage

## Package Manager

**Важно:** Проект использует только `pnpm`. Использование `npm` или `yarn` запрещено.

- ✅ `pnpm-lock.yaml` — единственный lock файл
- ✅ `package-lock.json` — отсутствует (запрещен)
- ✅ README содержит явное указание "use pnpm only"

## Next Steps

Проект готов к разработке функционала:
- Epic 1: Авторизация и аутентификация
- Epic 2: Управление курсами
- Epic 3: Задания и проверка
- Epic 4: Административные функции

---

**Git Tag:** `v0.1`  
**Repository:** https://github.com/rickonetik/tracked-lms  
**CI Status:** ✅ All tests passing
