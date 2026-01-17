// Скрипт для генерации JWT токена для тестирования
const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const { resolve } = require('path');

// Загружаем .env из корня проекта
config({ path: resolve(__dirname, '../../.env') });

const userId = process.argv[2];
const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';

if (!userId) {
  console.error('Usage: node generate-test-token.js <userId>');
  process.exit(1);
}

const payload = {
  sub: userId,
  telegramId: null,
};

const token = jwt.sign(payload, jwtSecret, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
});

console.log(token);
