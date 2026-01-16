# Tracked LMS Bot

Telegram Bot для Learning Management System с интеграцией Mini App.

## Технологии

- **grammY** - Telegram Bot framework
- **TypeScript** - Язык программирования

## Установка

```bash
# Установить зависимости
npm install

# Или через pnpm (из корня монорепы)
pnpm --filter bot install
```

## Запуск

### Development

```bash
# С переменными окружения из .env
pnpm --filter bot dev

# Или через npm
cd apps/bot
npm run dev
```

### Production

```bash
# Сборка
pnpm --filter bot build

# Запуск
pnpm --filter bot start
```

## Переменные окружения

Основные переменные (см. `.env` в корне проекта):

- `BOT_TOKEN` - Токен Telegram бота (обязательный)
- `TELEGRAM_WEBAPP_URL` - URL для Mini App (HTTPS, обязательный для работы кнопки)
- `WEBAPP_NGROK_URL` - Fallback URL для dev (из ngrok, опциональный)

## Команды бота

### /start

Приветственное сообщение с кнопкой "Открыть кабинет" для открытия Mini App.

**Требования:**
- `TELEGRAM_WEBAPP_URL` или `WEBAPP_NGROK_URL` должны быть установлены
- URL должен быть HTTPS (обязательно для Telegram Mini Apps)

## Настройка Mini App

1. Запустите WebApp:
   ```bash
   pnpm --filter webapp dev
   ```

2. Запустите ngrok для публичного доступа:
   ```bash
   pnpm dev:public
   ```

3. Скопируйте ngrok URL и добавьте в `.env`:
   ```bash
   TELEGRAM_WEBAPP_URL=https://your-ngrok-url.ngrok-free.app
   ```

4. Перезапустите бота:
   ```bash
   pnpm --filter bot dev
   ```

5. Отправьте команду `/start` боту и нажмите кнопку "Открыть кабинет"

## Структура

```
apps/bot/
├── src/
│   ├── index.ts              # Точка входа, обработчики команд
│   └── config/               # Конфигурация
│       └── index.ts          # Загрузка переменных окружения
├── dist/                     # Скомпилированные файлы
└── package.json
```

## Команды

- `npm run build` - Собрать приложение
- `npm run dev` - Запустить в режиме разработки (watch mode)
- `npm run start` - Запустить production версию
- `npm run lint` - Проверить код линтером
- `npm run typecheck` - Проверить типы TypeScript
- `npm run clean` - Очистить артефакты сборки
