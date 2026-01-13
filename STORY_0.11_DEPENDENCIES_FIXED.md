# Story 0.11 — Локализация зависимостей для pnpm

## Выполнено

### 1. Убраны зависимости из root package.json
- ✅ Удалён `@nestjs/core` из root `package.json`
- ✅ `@nestjs/swagger` не был в root (уже правильно)

### 2. Обновлены зависимости в apps/api/package.json
- ✅ `@nestjs/core`: обновлён с `^10.3.0` на `^10.4.22` (совместимо с `@nestjs/common@^10.4.22`)
- ✅ `@nestjs/swagger@^7.4.2`: уже в dependencies
- ✅ Все Nest peer deps присутствуют:
  - `@nestjs/common@^10.4.22`
  - `@nestjs/core@^10.4.22`
  - `@nestjs/platform-fastify@^10.3.0`
  - `reflect-metadata@^0.1.14`
  - `rxjs@^7.8.2`

### 3. Проверка зависимостей
```bash
npm list @nestjs/core @nestjs/swagger
```
Результат:
- ✅ `@nestjs/core@10.4.22` доступен из `apps/api`
- ✅ `@nestjs/swagger@7.4.2` доступен из `apps/api`
- ✅ Все зависимости правильно разрешены

## Структура для pnpm

Теперь структура зависимостей правильная для pnpm:
- Все зависимости NestJS локализованы в `apps/api/package.json`
- Root `package.json` содержит только общие devDependencies
- pnpm сможет правильно разрешить зависимости

## Следующие шаги

После установки pnpm можно выполнить:
```bash
pnpm -w install
pnpm --filter api install
pnpm --filter api why @nestjs/core
pnpm --filter api why @nestjs/swagger
```

**Зависимости локализованы!** ✅
