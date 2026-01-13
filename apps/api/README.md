# API

Backend API на NestJS с Fastify.

## Разработка

```bash
npm run dev
```

Сервер будет доступен на http://localhost:3000 (или порт из `API_PORT` в `.env`)

**Доступные endpoints в режиме development:**
- `GET /health` - Проверка здоровья сервера
- `GET /docs` - Swagger UI документация
- `GET /docs-json` - OpenAPI JSON спецификация

## Сборка

```bash
npm run build
npm start
```

## Endpoints

### GET /health

Проверка здоровья сервера.

**Ответ:**
```json
{
  "ok": true,
  "env": "development",
  "version": "1.0.0"
}
```

**Пример:**
```bash
curl http://localhost:3000/health
```

### GET /docs

Swagger UI документация (только в режиме development).

**Пример:**
```bash
# Откройте в браузере
http://localhost:3000/docs
```

### GET /docs-json

OpenAPI JSON спецификация (только в режиме development).

**Пример:**
```bash
curl http://localhost:3000/docs-json
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте:

- `NODE_ENV` - окружение (development/production/test)
- `PORT` - порт сервера (по умолчанию 3000)
- `HOST` - хост сервера (по умолчанию 0.0.0.0)
- `APP_VERSION` - версия приложения (по умолчанию 1.0.0)
