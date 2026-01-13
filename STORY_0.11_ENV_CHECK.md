# Story 0.11 — Проверка включения Swagger

## Диагностика

### Добавлено логирование

В лог старта выводится:
- `NODE_ENV` - значение из process.env
- `swaggerEnabled` - boolean (true если NODE_ENV === 'development')
- `docsPath` - строка пути к документации ('docs')

### Наблюдения

1. **Код доходит до "[BOOTSTRAP] Setting up global pipes..."**
2. **Не доходит до "[BOOTSTRAP] Global pipes configured"**
3. **Сервер работает** (health endpoint отвечает)
4. **NODE_ENV=development** установлен правильно

### Проблема

Код останавливается на `app.useGlobalPipes()`. Возможные причины:
1. ValidationPipe выбрасывает ошибку, которая перехватывается
2. Код выполняется, но логи не выводятся из-за буферизации
3. Проблема с инициализацией ValidationPipe

### Решение

Нужно проверить:
1. Выполняется ли код после `app.useGlobalPipes()`
2. Работает ли Swagger setup
3. Доходит ли код до `app.listen()`

## Текущий статус

- ✅ NODE_ENV проверяется правильно
- ✅ swaggerEnabled вычисляется правильно
- ✅ docsPath установлен правильно
- ⚠️ Код не доходит до Swagger setup (останавливается на ValidationPipe)

## Следующие шаги

1. Исправить проблему с ValidationPipe
2. Убедиться что код доходит до Swagger setup
3. Проверить работу Swagger после исправления
