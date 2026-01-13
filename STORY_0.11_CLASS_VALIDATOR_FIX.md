# Story 0.11 — Локализация class-validator и class-transformer

## Проблема

ValidationPipe не мог найти `class-validator` и `class-transformer` в runtime, хотя они были в `package.json`.

## Решение

### Что сделано

1. **Проверено наличие зависимостей:**
   - `class-validator@^0.14.0` - уже был в `apps/api/package.json`
   - `class-transformer@^0.5.1` - уже был в `apps/api/package.json`

2. **Переустановлены зависимости:**
   - Выполнен `npm install` в корне проекта
   - Выполнен `npm install class-validator class-transformer` в `apps/api`

3. **Проверена доступность в runtime:**
   - `require('class-validator')` - OK
   - `require('class-transformer')` - OK

## Результаты

### До исправления

```
[BOOTSTRAP] Setting up global pipes...
[Nest] ERROR [PackageLoader] The "class-validator" package is missing.
```

### После исправления

```
[BOOTSTRAP] Setting up global pipes...
[BOOTSTRAP] Global pipes configured ✅
[BOOTSTRAP] Setting up global filters...
[BOOTSTRAP] Global filters configured ✅
[BOOTSTRAP] Global filters and pipes configured ✅
[BOOTSTRAP] Port and host configured: { port: 3001, host: '0.0.0.0' }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 Swagger Configuration Check: ✅
   NODE_ENV: development
   swaggerEnabled: true
   docsPath: docs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[DEBUG] Setting up Swagger... ✅
[DEBUG] Creating Swagger document... ✅
[DEBUG] Setting up Swagger at /docs... ✅
```

## DoD проверка

✅ **Сервер проходит строку app.useGlobalPipes(...)**
- Лог `[BOOTSTRAP] Global pipes configured` появляется

✅ **Выводятся логи после неё**
- Все логи после `app.useGlobalPipes()` выводятся

✅ **/health работает**
- `curl http://localhost:3001/health` возвращает `{"ok":true,"env":"development","version":"1.0.0"}`

✅ **Swagger setup доходит (хотя бы лог "Swagger Configuration Check")**
- Лог `🔍 Swagger Configuration Check:` появляется
- Лог `[DEBUG] Setting up Swagger...` появляется
- Лог `[DEBUG] Creating Swagger document...` появляется
- Лог `[DEBUG] Setting up Swagger at /docs...` появляется

## Следующие шаги

Swagger setup доходит до конца, но `/docs` всё ещё возвращает 404. Возможно, требуется установить `@fastify/static` для раздачи статических файлов Swagger UI.
