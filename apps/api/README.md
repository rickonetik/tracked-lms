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
- `npm run seed:dev` - Запустить seed скрипт для создания dev expert account

## Seed скрипт

Скрипт `seed:dev` создаёт (или находит существующий) expert account для разработки.

### Переменные окружения

- `SEED_OWNER_USER_ID` (приоритет 1) - UUID пользователя-владельца в БД (должен существовать, иначе ошибка)
- `SEED_TELEGRAM_ID` (приоритет 2) - Telegram ID пользователя (если нет в БД - создастся)
- `SEED_EXPERT_SLUG` (опционально, default: `dev-expert`) - slug для expert account
- `SEED_EXPERT_NAME` (опционально, default: `Dev Expert`) - название expert account
- `SEED_SUBSCRIPTION_END` (опционально) - ISO string для `currentPeriodEnd` подписки (если не задан - `null`, бессрочно)

### Использование

```bash
# Установить переменные окружения
export SEED_TELEGRAM_ID="123456789"
export SEED_EXPERT_SLUG="my-expert"
export SEED_EXPERT_NAME="My Expert Account"

# Запустить seed
pnpm --filter api seed:dev
```

### Что делает скрипт

1. **Находит или создаёт owner user:**
   - Если указан `SEED_OWNER_USER_ID` - ищет пользователя по ID
   - Если указан `SEED_TELEGRAM_ID` - ищет по telegramId, если нет - создаёт нового

2. **Создаёт или находит expert account:**
   - Upsert по `slug` (не создаёт дублей)

3. **Создаёт или находит expert member:**
   - Upsert по `(expertAccountId, userId)` с ролью `owner`

4. **Создаёт или находит subscription:**
   - Гарантирует ровно 1 активную подписку по предикату: `status='active' AND (currentPeriodEnd IS NULL OR currentPeriodEnd > now())`
   - Seed допускает несколько subscriptions исторически, но гарантирует ровно одну "активную по предикату"
   - Предикат не зависит от `plan` (для MVP все планы считаются равнозначными)
   - Если есть активная (по предикату) - переиспользует
   - Если нет - создаёт новую с `currentPeriodEnd=null` (бессрочно) или из `SEED_SUBSCRIPTION_END`
   - **Примечание:** При одновременном запуске seed может создать несколько активных подписок (race condition). Gate (Story 4.3) должен выбирать детерминированно: `ORDER BY currentPeriodEnd NULLS FIRST, createdAt DESC LIMIT 1`

### Идемпотентность

Скрипт полностью идемпотентен: повторный запуск не создаёт дублей, а переиспользует существующие записи.

### Вывод

Скрипт выводит:
- Логи создания/переиспользования каждой сущности
- JSON summary с идентификаторами всех созданных/найденных сущностей

## Admin: set subscription status

Endpoint для ручного управления статусом подписки эксперт-аккаунта. Доступен только для Platform Owner/Admin.

### Endpoint

```
POST /admin/subscriptions/:expertAccountId/status
```

### Авторизация

Требуется JWT токен с platform ролью `OWNER` или `ADMIN` (через `PLATFORM_OWNER_IDS` env переменную).

### Request Body

```json
{
  "status": "active" | "expired" | "canceled",
  "plan": "manual_mvp",
  "currentPeriodEnd": "2026-02-01T00:00:00.000Z" | null,
  "reason": "string (optional)"
}
```

**Правила:**
- `status` - обязателен
- `plan` - обязателен
- `currentPeriodEnd`:
  - Допускается `null` (для бессрочной `active`)
  - Либо ISO-строка, парсится в `Date`
  - Если статус `expired` или `canceled` и `currentPeriodEnd` не задан — автоматически ставится `now()` (чтобы gate однозначно закрывался)
- `reason` - опционален, сохраняется для будущего audit log

### Response

```json
{
  "expertAccountId": "uuid",
  "subscription": {
    "id": "uuid",
    "status": "active",
    "plan": "manual_mvp",
    "currentPeriodEnd": null,
    "createdAt": "2026-01-17T12:00:00.000Z"
  },
  "activeSubscription": {
    "id": "uuid",
    "status": "active",
    "plan": "manual_mvp",
    "currentPeriodEnd": null,
    "createdAt": "2026-01-17T12:00:00.000Z"
  } | null,
  "changedByUserId": "uuid",
  "requestedAt": "2026-01-17T12:00:00.000Z"
}
```

`activeSubscription` вычисляется тем же предикатом, что и gate из Story 4.3, чтобы видеть, что выберет gate.

### Ошибки

- `401 Unauthorized` - отсутствует или невалидный JWT токен
- `403 Forbidden` - `PLATFORM_ROLE_REQUIRED` (нет platform роли)
- `404 Not Found` - `EXPERT_ACCOUNT_NOT_FOUND` (expert account не существует)
- `400 Bad Request`:
  - `INVALID_CURRENT_PERIOD_END` - невалидный формат ISO даты
  - `INVALID_STATUS` - статус не из enum
  - `INVALID_PLAN` - план не из enum

### Примеры использования

#### 1. Установить expired статус (отключить доступ)

```bash
curl -X POST http://localhost:3001/admin/subscriptions/<expertAccountId>/status \
  -H "Authorization: Bearer <platform_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "expired",
    "plan": "manual_mvp"
  }'
```

После этого `GET /expert/me` начнёт возвращать `403 SUBSCRIPTION_INACTIVE`.

#### 2. Восстановить active статус (включить доступ)

```bash
curl -X POST http://localhost:3001/admin/subscriptions/<expertAccountId>/status \
  -H "Authorization: Bearer <platform_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "plan": "manual_mvp",
    "currentPeriodEnd": null
  }'
```

После этого `GET /expert/me` снова вернёт `200 OK`.

#### 3. Установить active с датой окончания

```bash
curl -X POST http://localhost:3001/admin/subscriptions/<expertAccountId>/status \
  -H "Authorization: Bearer <platform_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active",
    "plan": "manual_mvp",
    "currentPeriodEnd": "2026-12-31T23:59:59.000Z",
    "reason": "Extended subscription until end of year"
  }'
```

### Логика

1. **Проверка существования**: Если `expertAccountId` не существует → `404 EXPERT_ACCOUNT_NOT_FOUND`
2. **Создание записи**: Всегда создаётся новая запись `subscription` (история сохраняется, никогда не обновляется существующая)
3. **Детерминированный выбор**: Gate из Story 4.3 выбирает активную подписку по предикату:
   - `status='active' AND (currentPeriodEnd IS NULL OR currentPeriodEnd > now())`
   - `ORDER BY currentPeriodEnd NULLS FIRST, createdAt DESC LIMIT 1`
4. **Аудит**: В ответе возвращаются `changedByUserId` и `requestedAt`. Полноценный audit log будет добавлен в Story 8.2.
