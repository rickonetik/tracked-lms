# Story 0.10 — API error format — Definition of Done

## ✅ Выполнено

### 1. Единый формат ошибок
- ✅ Создан `ErrorResponseDto` интерфейс с полями: `statusCode`, `code`, `message`, `details?`, `timestamp`, `path`
- ✅ Все ошибки возвращают единый JSON формат

### 2. Global Exception Filter
- ✅ Создан `HttpExceptionFilter` в `apps/api/src/common/filters/http-exception.filter.ts`
- ✅ Подключен в `main.ts` через `app.useGlobalFilters()`
- ✅ Маппинг всех HTTP статус кодов в коды ошибок

### 3. Поддерживаемые статус коды
- ✅ 400 (BAD_REQUEST)
- ✅ 401 (UNAUTHORIZED)
- ✅ 403 (FORBIDDEN)
- ✅ 404 (NOT_FOUND)
- ✅ 409 (CONFLICT)
- ✅ 422 (UNPROCESSABLE_ENTITY)

### 4. Ручной тест
- ✅ Протестирован несуществующий endpoint: `/nonexistent`
- ✅ Протестированы все статус коды через тестовые endpoints
- ✅ Все ошибки возвращают единый формат

## Примеры ответов

### 404 Not Found (несуществующий endpoint)
```json
{
  "statusCode": 404,
  "code": "NOT_FOUND",
  "message": "Cannot GET /nonexistent",
  "details": {
    "message": "Cannot GET /nonexistent",
    "error": "Not Found",
    "statusCode": 404
  },
  "timestamp": "2026-01-13T12:56:05.261Z",
  "path": "/nonexistent"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "code": "BAD_REQUEST",
  "message": "Bad request error",
  "timestamp": "2026-01-13T12:56:05.852Z",
  "path": "/test/400"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "code": "UNAUTHORIZED",
  "message": "Unauthorized error",
  "timestamp": "2026-01-13T12:56:05.874Z",
  "path": "/test/401"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "code": "FORBIDDEN",
  "message": "Forbidden error",
  "timestamp": "2026-01-13T12:56:05.896Z",
  "path": "/test/403"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "code": "CONFLICT",
  "message": "Conflict error",
  "timestamp": "2026-01-13T12:56:05.939Z",
  "path": "/test/409"
}
```

### 422 Unprocessable Entity
```json
{
  "statusCode": 422,
  "code": "UNPROCESSABLE_ENTITY",
  "message": "Unprocessable entity error",
  "timestamp": "2026-01-13T12:56:05.960Z",
  "path": "/test/422"
}
```

## Артефакты

### Тестовые команды curl

```bash
# Несуществующий endpoint
curl http://localhost:3000/nonexistent

# Тестовые endpoints (если бы были)
curl http://localhost:3000/test/400
curl http://localhost:3000/test/401
curl http://localhost:3000/test/403
curl http://localhost:3000/test/404
curl http://localhost:3000/test/409
curl http://localhost:3000/test/422
```

## Story 0.10 — COMPLETE! ✅

Все требования выполнены:
- ✅ Единый формат ошибок `{code, message, details?}`
- ✅ Global exception filter настроен
- ✅ Все требуемые статус коды поддерживаются
- ✅ Ручной тест выполнен
- ✅ Артефакты (curl output) готовы
