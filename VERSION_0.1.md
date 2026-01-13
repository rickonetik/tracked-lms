# Version 0.1 — Epic 0 Foundation Complete

**Release Date:** 2026-01-13  
**Tag:** `v0.1`

## Overview

Version 0.1 завершает Epic 0 — Foundation (Репозиторий, окружение, скелет). Все 12 stories из Epic 0 успешно завершены.

## Completed Stories

### Infrastructure & Setup
- ✅ **Story 0.1** — Monorepo scaffold (npm workspaces + turbo)
- ✅ **Story 0.2** — Lint/format baseline (ESLint, Prettier, husky)
- ✅ **Story 0.3** — Docker Compose (PostgreSQL, Redis, MinIO)
- ✅ **Story 0.7** — Unified env & ports
- ✅ **Story 0.8** — Dev public ngrok helper

### Applications
- ✅ **Story 0.4** — API skeleton + /health (NestJS + Fastify)
- ✅ **Story 0.5** — WebApp skeleton + routing (React + Vite)
- ✅ **Story 0.6** — Bot skeleton + /start (grammY)

### Quality & Documentation
- ✅ **Story 0.9** — CI pipeline (GitHub Actions)
- ✅ **Story 0.10** — API error format (единый формат)
- ✅ **Story 0.11** — OpenAPI/Swagger (документация API)
- ✅ **Story 0.12** — Shared package contracts (общие типы)

## Key Features

### Monorepo Structure
- npm workspaces для управления зависимостями
- Turbo для параллельной сборки
- Единая конфигурация TypeScript, ESLint, Prettier

### API Server
- NestJS с Fastify adapter
- Health check endpoint (`/health`)
- Swagger UI документация (`/docs` в dev режиме)
- Единый формат ошибок API

### WebApp
- React + Vite
- React Router для клиентской маршрутизации
- 3 основные вкладки: Learning, Expert, Account

### Telegram Bot
- grammY framework
- Базовая команда `/start`
- Готов к расширению функционала

### Infrastructure
- Docker Compose для локальной разработки
- PostgreSQL, Redis, MinIO
- ngrok helper для публичного доступа

### Shared Package
- `UserRole` enum (ADMIN, TEACHER, STUDENT)
- `ErrorCode` enum (8 кодов ошибок)
- Общие типы для всех приложений

### CI/CD
- GitHub Actions pipeline
- Автоматические проверки: lint, typecheck, build
- Запуск на push и pull requests

## Project Structure

```
tracked-lms/
├── apps/
│   ├── api/          # NestJS API server
│   ├── webapp/       # React Mini App
│   └── bot/          # Telegram Bot
├── packages/
│   └── shared/       # Общие типы и константы
├── infra/            # Docker Compose
├── .github/          # GitHub Actions
└── scripts/          # Утилиты
```

## Getting Started

```bash
# Установка зависимостей
npm install

# Настройка окружения
cp .env.example .env

# Запуск инфраструктуры
cd infra && docker-compose up -d

# Запуск всех приложений
npm run dev

# Сборка
npm run build
```

## Documentation

- `README.md` — Основная документация проекта
- `STORIES.md` — Детальное описание всех завершенных stories
- `apps/api/README.md` — API документация
- `packages/shared/EXPORTS.md` — Список экспортов shared пакета

## Next Steps

Готово к Epic 1 — дальнейшая разработка функционала LMS.

---

**Git Tag:** `v0.1`  
**Commit:** `de3841ca`  
**Repository:** https://github.com/rickonetik/tracked-lms
