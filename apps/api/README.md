# Tracked LMS API

Backend API для Learning Management System с интеграцией Telegram Bot и Mini App.

## Технологии

- **NestJS** - Backend framework
- **Fastify** - HTTP adapter
- **TypeScript** - Язык программирования
- **PostgreSQL** - База данных
- **Redis** - Кэш и очереди
- **MinIO** - S3-совместимое хранилище

## Установка

```bash
# Установить зависимости
npm install

# Или через pnpm (из корня монорепы)
pnpm --filter api install
```

## Запуск

### Development

```bash
# С переменными окружения из .env
NODE_ENV=development pnpm --filter api dev

# Или через npm
cd apps/api
NODE_ENV=development npm run dev
```

### Production

```bash
# Сборка
pnpm --filter api build

# Запуск
NODE_ENV=production pnpm --filter api start
```

## Переменные окружения

Основные переменные (см. `.env.example` в корне проекта):

- `API_PORT` - Порт API сервера (по умолчанию: 3000)
- `API_HOST` - Хост API сервера (по умолчанию: 0.0.0.0)
- `NODE_ENV` - Окружение (development, production, test)
- `APP_VERSION` - Версия приложения

## Dev endpoints

### GET /health

Health check endpoint. Возвращает статус API.

**Response:**
```json
{
  "ok": true,
  "env": "development",
  "version": "1.0.0"
}
```

### GET /docs

Swagger UI для интерактивной документации API. Доступен только в режиме `development`.

**URL:** http://localhost:3001/docs

### GET /docs-json

OpenAPI JSON спецификация. Доступна только в режиме `development`.

**URL:** http://localhost:3001/docs-json

## Структура

```
apps/api/
├── src/
│   ├── main.ts              # Точка входа приложения
│   ├── app.module.ts        # Корневой модуль
│   ├── config/              # Конфигурация
│   └── modules/             # Модули приложения
│       └── health/          # Health check модуль
├── dist/                    # Скомпилированные файлы
└── package.json
```

## Команды

- `npm run build` - Собрать приложение
- `npm run dev` - Запустить в режиме разработки (watch mode)
- `npm run start` - Запустить production версию
- `npm run lint` - Проверить код линтером
- `npm run typecheck` - Проверить типы TypeScript
- `npm run clean` - Очистить артефакты сборки
