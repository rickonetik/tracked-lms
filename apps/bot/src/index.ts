import { Bot, InlineKeyboard } from 'grammy';
import { config } from './config';

const bot = new Bot(config.BOT_TOKEN);

bot.command('start', async (ctx) => {
  console.log(`[START] User ${ctx.from?.id} (${ctx.from?.username || 'no username'}) started bot`);
  try {
    const message =
      `👋 Добро пожаловать в Tracked LMS!\n\n` +
      `Здесь вы можете:\n` +
      `📚 Проходить курсы\n` +
      `🎓 Стать экспертом\n` +
      `📝 Сдавать домашние задания\n\n` +
      `Используйте команды бота для навигации.`;

    // Создаем inline keyboard с кнопкой web_app
    const keyboard = new InlineKeyboard();

    if (config.TELEGRAM_WEBAPP_URL) {
      keyboard.webApp('Открыть кабинет', config.TELEGRAM_WEBAPP_URL);
      console.log(`[START] WebApp URL: ${config.TELEGRAM_WEBAPP_URL}`);
    } else {
      console.log('[START] Warning: TELEGRAM_WEBAPP_URL not set, button will not be shown');
    }

    await ctx.reply(message, {
      reply_markup: keyboard,
    });
    console.log('[START] Reply sent successfully');
  } catch (error) {
    console.error('[START] Error sending reply:', error);
    if (error instanceof Error) {
      console.error('[START] Error details:', error.message);
      console.error('[START] Stack:', error.stack);
    }
  }
});

bot.catch((err) => {
  console.error('[BOT ERROR]', err);
  if (err.ctx) {
    console.error('[BOT ERROR] Update:', JSON.stringify(err.ctx.update, null, 2));
  }
});

async function startBot() {
  try {
    const me = await bot.api.getMe();
    console.log(`🤖 Bot is running as @${me.username}`);
    console.log(`📱 Bot name: ${me.first_name}`);

    await bot.start({
      onStart: (botInfo) => {
        console.log(`✅ Bot @${botInfo.username} started successfully!`);
      },
    });
  } catch (error) {
    console.error('Failed to start bot:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

startBot();
