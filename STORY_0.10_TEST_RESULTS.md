# Story 0.10 — API error format — Результаты тестирования

## Тестовые запросы

Выполнены запросы к различным endpoints для проверки единого формата ошибок:

### 1. Несуществующий endpoint (404)
```bash
curl http://localhost:3000/nonexistent
```

### 2. Тестовые endpoints с различными статусами:
- `/test/400` - Bad Request
- `/test/401` - Unauthorized
- `/test/403` - Forbidden
- `/test/404` - Not Found
- `/test/409` - Conflict
- `/test/422` - Unprocessable Entity

## Ожидаемый формат ответа

Все ошибки должны возвращать единый JSON формат:

```json
{
  "statusCode": 400,
  "code": "BAD_REQUEST",
  "message": "Error message",
  "details": {},
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/test/400"
}
```

## Результаты

См. вывод curl команд выше.
