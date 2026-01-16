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
export declare function verifyTelegramInitData(initData: string, botToken: string, maxAgeSeconds?: number): boolean;
//# sourceMappingURL=telegram-verify.util.d.ts.map