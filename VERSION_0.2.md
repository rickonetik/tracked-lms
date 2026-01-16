# Version 0.2 — EPIC 2: Authentication & Authorization

**Дата релиза:** 2026-01-15  
**Тег:** `v0.2`  
**Коммит:** `636bbe12`

## Обзор

Version 0.2 реализует полную систему аутентификации и авторизации для Tracked LMS, включая интеграцию с Telegram WebApp, JWT токены, и управление статусом пользователей.

## Выполненные Stories

### Story 2.1: Prisma init + users table
- ✅ Настроен Prisma ORM (Prisma 7)
- ✅ Создана таблица `users` с полями:
  - `id` (UUID)
  - `telegramId` (BigInt, unique)
  - `firstName`, `lastName`, `username`, `email`
  - `status` (active/banned)
  - `createdAt`, `updatedAt`
- ✅ Миграции применены

### Story 2.2: Telegram initData verify util
- ✅ Реализована проверка подписи Telegram initData (HMAC-SHA256)
- ✅ Утилита `verifyTelegramInitData()` с юнит-тестами
- ✅ Проверка валидности подписи и времени жизни

### Story 2.3: POST /auth/telegram (upsert user + JWT)
- ✅ Эндпоинт `POST /auth/telegram` для авторизации
- ✅ Проверка initData и upsert пользователя в БД
- ✅ Генерация JWT токенов
- ✅ Обработка ошибок (401 для невалидного initData)
- ✅ Swagger документация

### Story 2.4: JWT guard + GET /me
- ✅ Реализован JWT guard на основе Passport.js
- ✅ Эндпоинт `GET /auth/me` для получения данных пользователя
- ✅ Проверка статуса пользователя (banned → 403)
- ✅ Минимальный JWT payload (только sub и telegramId)

### Story 2.5: WebApp: auth bootstrap
- ✅ Создан API client для работы с бэкендом
- ✅ Реализован auth service для управления токенами
- ✅ Добавлен useAuth hook с автоматическим bootstrap
- ✅ Настроено проксирование API через Vite (`/api` → `localhost:3001`)
- ✅ Обновлен AccountPage для отображения данных с сервера
- ✅ Токены сохраняются в localStorage

### Story 2.6: API: user status banned (enforcement)
- ✅ Проверка статуса пользователя в JwtStrategy
- ✅ Забаненные пользователи получают `403 USER_BANNED`
- ✅ Разбан работает без перевыпуска токена

## Основные изменения

### API

**Новые модули:**
- `modules/auth` — модуль аутентификации
  - `auth.controller.ts` — контроллер с эндпоинтами `/auth/telegram` и `/auth/me`
  - `auth.service.ts` — сервис для работы с авторизацией
  - `strategies/jwt.strategy.ts` — JWT стратегия для Passport
  - `guards/jwt-auth.guard.ts` — guard для защиты эндпоинтов
  - `dto/telegram-auth.dto.ts` — DTO для авторизации через Telegram
  - `dto/me-response.dto.ts` — DTO для ответа `/me`
- `modules/users` — модуль пользователей
  - `users.service.ts` — сервис для работы с пользователями в БД
- `common/telegram-verify.util.ts` — утилита проверки Telegram initData
- `common/prisma.service.ts` — сервис для работы с Prisma

**Обновления:**
- Настроен Prisma ORM с PostgreSQL
- Добавлена поддержка JWT токенов (`@nestjs/jwt`, `passport-jwt`)
- Обновлена модель пользователя: убран `role`, добавлен `status`
- Добавлен derived `userType` (STUDENT по умолчанию)
- Настроен Swagger/OpenAPI документация

### WebApp

**Новые файлы:**
- `lib/api-client.ts` — HTTP client для работы с API
- `services/auth.service.ts` — сервис для управления авторизацией
- `hooks/useAuth.ts` — React hook для работы с авторизацией

**Обновления:**
- `pages/AccountPage.tsx` — использует данные с сервера вместо initDataUnsafe
- `vite.config.ts` — добавлено проксирование `/api` → `localhost:3001`

### Infrastructure

- Настроен Vite proxy для dev-режима
- Поддержка ngrok для публичного доступа к WebApp
- Обновлен `.env` с новыми переменными

## Безопасность

- ✅ `initData` не логируется целиком (только безопасные поля)
- ✅ JWT payload минимальный (только `sub` и `telegramId`)
- ✅ Проверка статуса пользователя на уровне guard
- ✅ Валидация подписи Telegram initData (HMAC-SHA256)

## Тестирование

### Ручные тесты
- ✅ Happy path: создание пользователя → авторизация → получение данных
- ✅ Негативные сценарии: невалидный initData, отсутствие токена, мусорный токен
- ✅ Бан/разбан: проверка блокировки и восстановления доступа
- ✅ Повторная авторизация: обновление данных без дублей

### Regression Checklist
- ✅ Контракты (Swagger): все эндпоинты документированы
- ✅ Auth flow "с нуля": полный цикл авторизации
- ✅ Негативные сценарии: все ошибки обрабатываются корректно
- ✅ Бан: забаненные пользователи блокируются
- ✅ Dev-цепочка: Vite proxy работает корректно
- ✅ Логи и безопасность: PII данные не логируются

## API Endpoints

### POST /auth/telegram
Авторизация через Telegram WebApp initData.

**Request:**
```json
{
  "initData": "query_id=...&user=...&auth_date=...&hash=..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "telegramId": "123456789",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "status": "active",
    "userType": "STUDENT"
  }
}
```

**Errors:**
- `401` — невалидный initData

### GET /auth/me
Получение данных текущего пользователя.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "telegramId": "123456789",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "status": "active",
  "userType": "STUDENT"
}
```

**Errors:**
- `401` — токен отсутствует или невалиден
- `403` — пользователь забанен (`USER_BANNED`)

## Миграции

### Prisma Migrations
- `*_init_users_table` — создание таблицы users
- `*_remove_role_add_status` — удаление поля role, добавление status

## Переменные окружения

**Новые переменные:**
- `DATABASE_URL` — URL подключения к PostgreSQL
- `JWT_SECRET` — секретный ключ для JWT токенов
- `JWT_EXPIRES_IN` — время жизни токена (по умолчанию: 7d)
- `TELEGRAM_WEBAPP_URL` — публичный URL для WebApp (ngrok)

## Известные ограничения

- `userType` пока всегда "STUDENT" (будет вычисляться из membership/subscription в будущих эпиках)
- Формат ошибок стандартный NestJS (единый формат будет введен в следующем этапе)

## Следующие шаги

- EPIC 3: Course Management
- EPIC 4: Assignments
- EPIC 5: Administrative Features

## Ссылки

- Swagger UI: http://localhost:3001/docs
- OpenAPI JSON: http://localhost:3001/docs-json
- GitHub Release: https://github.com/rickonetik/tracked-lms/releases/tag/v0.2
