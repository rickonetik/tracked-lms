# Version 0.1.1 — Foundation (repo/infra/dev-опыт)

**Release Date:** 2026-01-13  
**Tag:** `v0.1.1`

## Overview

Version 0.1.1 — Foundation (repo/infra/dev-опыт). Завершены все stories из Epic 0, проект готов к разработке функционала.

## Foundation Components

### Repository & Infrastructure
- ✅ Monorepo структура (npm workspaces + turbo)
- ✅ Docker Compose (PostgreSQL, Redis, MinIO)
- ✅ Единые переменные окружения
- ✅ CI/CD pipeline (GitHub Actions)

### Development Experience
- ✅ Lint/format baseline (ESLint, Prettier, husky)
- ✅ TypeScript конфигурация
- ✅ Dev tools (ngrok helper для публичного доступа)
- ✅ Swagger документация API

### Applications Skeleton
- ✅ API server (NestJS + Fastify)
- ✅ WebApp (React + Vite)
- ✅ Telegram Bot (grammY)

### Shared Contracts
- ✅ Shared package (общие типы и константы)
- ✅ UserRole enum
- ✅ ErrorCode enum

## Completed Stories

Все 12 stories из Epic 0:
- 0.1: Monorepo scaffold
- 0.2: Lint/format baseline
- 0.3: Docker Compose
- 0.4: API skeleton + /health
- 0.5: WebApp skeleton + routing
- 0.6: Bot skeleton + /start
- 0.7: Unified env & ports
- 0.8: Dev public ngrok helper
- 0.9: CI pipeline
- 0.10: API error format
- 0.11: OpenAPI/Swagger
- 0.12: Shared package contracts

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
```

## Documentation

- `README.md` — Основная документация проекта
- `STORIES.md` — Детальное описание всех завершенных stories
- `apps/api/README.md` — API документация
- `packages/shared/EXPORTS.md` — Список экспортов shared пакета

---

**Git Tag:** `v0.1.1`  
**Repository:** https://github.com/rickonetik/tracked-lms
