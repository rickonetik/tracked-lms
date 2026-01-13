import { Bot } from 'grammy';
import { config } from './config';

const bot = new Bot(config.BOT_TOKEN);

bot.command('start', async (ctx) => {
  console.log(`User ${ctx.from?.id} started bot`);
  try {
    await ctx.reply(
      `👋 Добро пожаловать в Tracked LMS!\n\n` +
      `Здесь вы можете:\n` +
      `📚 Проходить курсы\n` +
      `🎓 Стать экспертом\n` +
      `📝 Сдавать домашние задания\n\n` +
      `Используйте команды бота для навигации.`
    );
    console.log('Reply sent successfully');
  } catch (error) {
    console.error('Error sending reply:', error);
  }
});

bot.catch((err) => {
  console.error('Bot error:', err);
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
