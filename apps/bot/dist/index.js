import { Bot } from 'grammy';
import { config } from './config';
// Создаем бота с токеном из конфигурации
const bot = new Bot(config.BOT_TOKEN);
// Обработка команды /start
bot.command('start', async (ctx) => {
    const startParam = ctx.match; // Параметр после /start <param>
    // Логирование для отладки
    console.log(`User ${ctx.from?.id} started bot${startParam ? ` with param: ${startParam}` : ''}`);
    await ctx.reply(`👋 Добро пожаловать в Tracked LMS!\n\n` +
        `Здесь вы можете:\n` +
        `📚 Проходить курсы\n` +
        `🎓 Стать экспертом\n` +
        `📝 Сдавать домашние задания\n\n` +
        `Используйте команды бота для навигации.`);
});
// Обработка ошибок
bot.catch((err) => {
    console.error('Bot error:', err);
});
// Запуск бота
async function startBot() {
    try {
        // Проверяем подключение к Telegram API
        const me = await bot.api.getMe();
        console.log(`🤖 Bot is running as @${me.username}`);
        console.log(`📱 Bot name: ${me.first_name}`);
        // Запускаем polling
        await bot.start({
            onStart: (botInfo) => {
                console.log(`✅ Bot @${botInfo.username} started successfully!`);
            },
        });
    }
    catch (error) {
        console.error('Failed to start bot:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
        }
        process.exit(1);
    }
}
startBot();
//# sourceMappingURL=index.js.map