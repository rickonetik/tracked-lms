"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTelegramInitData = verifyTelegramInitData;
const crypto_1 = require("crypto");
/**
 * Проверяет подпись Telegram WebApp initData
 *
 * Алгоритм:
 * 1. Парсим query string и извлекаем hash
 * 2. Сортируем остальные пары по ключу
 * 3. Создаем data-check-string: key1=value1\nkey2=value2\n...
 * 4. Деривируем secret_key: HMAC-SHA256(key="WebAppData", message=bot_token)
 * 5. Вычисляем computed_hash: HMAC-SHA256(key=secret_key, message=data_check_string)
 * 6. Сравниваем computed_hash с полученным hash
 *
 * @param initData - Raw initData query string от Telegram (например: "query_id=...&user=...&auth_date=...&hash=...")
 * @param botToken - BOT_TOKEN от Telegram Bot API
 * @param maxAgeSeconds - Максимальный возраст данных в секундах (по умолчанию 86400 = 24 часа)
 * @returns true если подпись валидна и данные не устарели, false иначе
 */
function verifyTelegramInitData(initData, botToken, maxAgeSeconds = 86400) {
    try {
        // Парсим query string
        const params = new URLSearchParams(initData);
        // Извлекаем hash
        const telegramHash = params.get('hash');
        if (!telegramHash) {
            return false;
        }
        // Удаляем hash из параметров для создания data-check-string
        params.delete('hash');
        // Проверяем auth_date для защиты от replay атак
        const authDateStr = params.get('auth_date');
        if (authDateStr) {
            const authDate = parseInt(authDateStr, 10);
            if (isNaN(authDate)) {
                return false;
            }
            const now = Math.floor(Date.now() / 1000);
            if (now - authDate > maxAgeSeconds) {
                return false; // Данные устарели
            }
        }
        // Сортируем параметры по ключу и создаем data-check-string
        const sortedKeys = Array.from(params.keys()).sort();
        const dataCheckPairs = [];
        for (const key of sortedKeys) {
            const value = params.get(key);
            if (value !== null) {
                // Значения уже URL-decoded в URLSearchParams
                dataCheckPairs.push(`${key}=${value}`);
            }
        }
        const dataCheckString = dataCheckPairs.join('\n');
        // Деривируем secret_key: HMAC-SHA256(key="WebAppData", message=bot_token)
        const secretKey = (0, crypto_1.createHmac)('sha256', 'WebAppData')
            .update(botToken)
            .digest();
        // Вычисляем computed_hash: HMAC-SHA256(key=secret_key, message=data_check_string)
        const computedHash = (0, crypto_1.createHmac)('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');
        // Сравниваем хеши (constant-time comparison для защиты от timing attacks)
        return constantTimeEqual(computedHash, telegramHash);
    }
    catch (error) {
        // В случае любой ошибки возвращаем false
        return false;
    }
}
/**
 * Constant-time сравнение строк для защиты от timing attacks
 */
function constantTimeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
//# sourceMappingURL=telegram-verify.util.js.map