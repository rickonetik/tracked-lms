# Tracked LMS

Learning Management System с интеграцией Telegram Bot и Mini App.

## Структура проекта

- `apps/api` - Backend API
- `apps/webapp` - Telegram Mini App (React)
- `apps/bot` - Telegram Bot
- `packages/shared` - Общие типы и утилиты
- `infra` - Docker Compose и инфраструктура

## Требования

- Node.js >= 18.0.0
- pnpm (используйте только pnpm, не npm/yarn)

## Установка

```bash
# Установить зависимости (используйте только pnpm)
pnpm install

# Настроить переменные окружения
cp .env.example .env
# Отредактируйте .env при необходимости
```

## Команды

**Важно:** Используйте только `pnpm`, не `npm` или `yarn`.

- `pnpm run build` - Собрать все приложения
- `pnpm run dev` - Запустить все приложения в режиме разработки
- `pnpm run lint` - Проверить код линтером
- `pnpm run typecheck` - Проверить типы TypeScript
- `pnpm run clean` - Очистить артефакты сборки

## Разработка

### Переменные окружения

Все переменные окружения настраиваются через `.env` файл в корне проекта:

```bash
# Скопировать пример
cp .env.example .env

# Отредактировать при необходимости
```

**Основные переменные:**
- `API_PORT` - Порт API сервера (по умолчанию: 3000)
- `WEBAPP_PORT` - Порт WebApp (по умолчанию: 5173)
- `BOT_TOKEN` - Токен Telegram бота (обязательный)
- `DB_*` - Настройки PostgreSQL
- `REDIS_*` - Настройки Redis
- `MINIO_*` - Настройки MinIO

См. `.env.example` для полного списка переменных.

### Команды

- `pnpm run build` - Собрать все приложения
- `pnpm run dev` - Запустить все приложения в режиме разработки
- `pnpm run dev:public` - Запустить ngrok для публичного доступа к WebApp
- `pnpm run lint` - Проверить код линтером
- `pnpm run typecheck` - Проверить типы TypeScript
- `pnpm run clean` - Очистить артефакты сборки

### Запуск отдельных сервисов

```bash
# API
cd apps/api && pnpm run dev

# WebApp
cd apps/webapp && pnpm run dev

# Bot
cd apps/bot && pnpm run dev
```

### Публичный доступ (ngrok)

Для тестирования Telegram Mini App нужен публичный HTTPS URL:

```bash
# 1. Убедитесь что WebApp запущен
cd apps/webapp && pnpm run dev

# 2. В другом терминале запустите ngrok
pnpm run dev:public
```

Скрипт автоматически:
- Проверит что WebApp запущен
- Запустит ngrok
- Выведет публичный URL
- Сохранит URL в `.env.local` как `WEBAPP_NGROK_URL`

**Требования:**
- Установленный ngrok: `brew install ngrok`
- Настроенный authtoken: `ngrok config add-authtoken <token>`

### CI/CD

Проект использует GitHub Actions для автоматической проверки кода:

- **Lint** - Проверка кода линтером
- **TypeCheck** - Проверка типов TypeScript
- **Build** - Сборка всех приложений

CI запускается автоматически при:
- Push в ветки `main` или `develop`
- Создании Pull Request

См. `.github/workflows/ci.yml` для деталей.

### Структура

- `apps/api` - Backend API (порт: API_PORT)
- `apps/webapp` - Telegram Mini App (порт: WEBAPP_PORT)
- `apps/bot` - Telegram Bot
- `packages/shared` - Общие типы и утилиты
- `infra` - Docker Compose и инфраструктура
- `.github/workflows` - GitHub Actions workflows

См. README.md в каждом приложении для деталей.
