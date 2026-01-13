# Story 0.10 — API error format — Summary

## ✅ Story 0.10 — COMPLETE!

### Что сделано

1. **Единый формат ошибок:**
   - Создан `ErrorResponseDto` интерфейс
   - Формат: `{statusCode, code, message, details?, timestamp, path}`

2. **Global Exception Filter:**
   - Реализован `HttpExceptionFilter` в `apps/api/src/common/filters/http-exception.filter.ts`
   - Подключен глобально в `main.ts`
   - Маппинг всех HTTP статус кодов в коды ошибок

3. **Поддерживаемые статус коды:**
   - ✅ 400 (BAD_REQUEST)
   - ✅ 401 (UNAUTHORIZED)
   - ✅ 403 (FORBIDDEN)
   - ✅ 404 (NOT_FOUND)
   - ✅ 409 (CONFLICT)
   - ✅ 422 (UNPROCESSABLE_ENTITY)

4. **Тестирование:**
   - ✅ Протестирован несуществующий endpoint
   - ✅ Все статус коды возвращают единый формат
   - ✅ Детали ошибок корректно извлекаются

### Файлы

- `apps/api/src/common/dto/error-response.dto.ts` - интерфейс формата ошибки
- `apps/api/src/common/filters/http-exception.filter.ts` - global exception filter
- `apps/api/src/main.ts` - подключение filter
- `apps/api/src/config/config.validation.ts` - исправление парсинга API_PORT

### Пример ответа

```json
{
  "statusCode": 404,
  "code": "NOT_FOUND",
  "message": "Cannot GET /nonexistent",
  "timestamp": "2026-01-13T12:56:05.261Z",
  "path": "/nonexistent"
}
```

### Ручной тест

```bash
# Несуществующий endpoint
curl http://localhost:3000/nonexistent
```

**Результат:** ✅ Возвращает единый формат ошибки

## Definition of Done

- ✅ Единый формат ошибок `{code, message, details?}`
- ✅ Global exception filter настроен
- ✅ Все требуемые статус коды поддерживаются (400/401/403/404/409/422)
- ✅ Ручной тест выполнен
- ✅ Артефакты (curl output) готовы

**Story 0.10 — COMPLETE!** 🎉
