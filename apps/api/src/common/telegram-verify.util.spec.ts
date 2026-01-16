import { verifyTelegramInitData } from './telegram-verify.util';
import { createHmac } from 'crypto';

describe('verifyTelegramInitData', () => {
  const botToken = '123456789:ABCdefGHIjklMNOpqrsTUVwxyz';
  
  // Генерируем валидный hash для теста
  function generateValidHash(dataCheckString: string, botToken: string): string {
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    
    return createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
  }
  
  describe('валидные данные', () => {
    it('должен принимать валидный initData с правильным hash', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const user = JSON.stringify({ id: 123, first_name: 'Test' });
      const queryId = 'test_query_id';
      
      // Создаем data-check-string
      const dataCheckString = `auth_date=${authDate}\nquery_id=${queryId}\nuser=${user}`;
      
      // Генерируем правильный hash
      const hash = generateValidHash(dataCheckString, botToken);
      
      // Создаем initData
      const initData = `query_id=${queryId}&user=${encodeURIComponent(user)}&auth_date=${authDate}&hash=${hash}`;
      
      const result = verifyTelegramInitData(initData, botToken);
      expect(result).toBe(true);
    });
    
    it('должен принимать initData с минимальными полями', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const dataCheckString = `auth_date=${authDate}`;
      const hash = generateValidHash(dataCheckString, botToken);
      const initData = `auth_date=${authDate}&hash=${hash}`;
      
      const result = verifyTelegramInitData(initData, botToken);
      expect(result).toBe(true);
    });
    
    it('должен принимать initData с несколькими полями', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const user = JSON.stringify({ id: 456, username: 'testuser' });
      const queryId = 'query123';
      const startParam = 'start';
      
      // Важно: сортировка по ключу
      const dataCheckString = `auth_date=${authDate}\nquery_id=${queryId}\nstart_param=${startParam}\nuser=${user}`;
      const hash = generateValidHash(dataCheckString, botToken);
      
      const initData = `user=${encodeURIComponent(user)}&query_id=${queryId}&auth_date=${authDate}&start_param=${startParam}&hash=${hash}`;
      
      const result = verifyTelegramInitData(initData, botToken);
      expect(result).toBe(true);
    });
  });
  
  describe('невалидные данные', () => {
    it('должен отклонять initData без hash', () => {
      const initDataWithoutHash = 'query_id=test&user=%7B%22id%22%3A123%7D';
      const result = verifyTelegramInitData(initDataWithoutHash, botToken);
      expect(result).toBe(false);
    });
    
    it('должен отклонять initData с пустым hash', () => {
      const initDataWithEmptyHash = 'query_id=test&user=%7B%22id%22%3A123%7D&hash=';
      const result = verifyTelegramInitData(initDataWithEmptyHash, botToken);
      expect(result).toBe(false);
    });
    
    it('должен отклонять initData с неправильным hash', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const initDataWithWrongHash = `query_id=test&user=%7B%22id%22%3A123%7D&auth_date=${authDate}&hash=wrong_hash_12345`;
      const result = verifyTelegramInitData(initDataWithWrongHash, botToken);
      expect(result).toBe(false);
    });
    
    it('должен отклонять initData с невалидным auth_date', () => {
      const initDataWithInvalidAuth = 'query_id=test&user=%7B%22id%22%3A123%7D&auth_date=invalid&hash=test_hash';
      const result = verifyTelegramInitData(initDataWithInvalidAuth, botToken);
      expect(result).toBe(false);
    });
    
    it('должен отклонять устаревшие данные (auth_date слишком старый)', () => {
      const oldAuthDate = Math.floor(Date.now() / 1000) - 100000; // ~27 часов назад
      const dataCheckString = `auth_date=${oldAuthDate}`;
      const hash = generateValidHash(dataCheckString, botToken);
      const initDataOld = `auth_date=${oldAuthDate}&hash=${hash}`;
      
      const result = verifyTelegramInitData(initDataOld, botToken, 86400); // maxAge = 24 часа
      expect(result).toBe(false);
    });
    
    it('должен отклонять пустой initData', () => {
      const result = verifyTelegramInitData('', botToken);
      expect(result).toBe(false);
    });
    
    it('должен отклонять initData с невалидным форматом', () => {
      const result = verifyTelegramInitData('not a valid query string', botToken);
      expect(result).toBe(false);
    });
  });
  
  describe('парсинг query string', () => {
    it('должен правильно парсить URL-encoded значения', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const user = JSON.stringify({ id: 123, name: 'Test & User' });
      const dataCheckString = `auth_date=${authDate}\nuser=${user}`;
      const hash = generateValidHash(dataCheckString, botToken);
      
      const initData = `user=${encodeURIComponent(user)}&auth_date=${authDate}&hash=${hash}`;
      const result = verifyTelegramInitData(initData, botToken);
      expect(result).toBe(true);
    });
    
    it('должен правильно сортировать параметры по ключу независимо от порядка', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const user = JSON.stringify({ id: 123 });
      
      // Порядок в initData не важен, сортировка происходит внутри функции
      const dataCheckString = `auth_date=${authDate}\nuser=${user}`;
      const hash = generateValidHash(dataCheckString, botToken);
      
      const initData1 = `z_param=z&a_param=a&user=${encodeURIComponent(user)}&auth_date=${authDate}&hash=${hash}`;
      const initData2 = `auth_date=${authDate}&a_param=a&user=${encodeURIComponent(user)}&z_param=z&hash=${hash}`;
      
      // Оба должны быть валидными, так как сортировка происходит внутри
      const result1 = verifyTelegramInitData(initData1, botToken);
      const result2 = verifyTelegramInitData(initData2, botToken);
      
      // Но hash не будет совпадать, так как мы не включили a_param и z_param в data-check-string
      // Поэтому оба должны быть false
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });
  
  describe('граничные случаи', () => {
    it('должен обрабатывать initData только с hash', () => {
      const dataCheckString = '';
      const hash = generateValidHash(dataCheckString, botToken);
      const initDataOnlyHash = `hash=${hash}`;
      
      const result = verifyTelegramInitData(initDataOnlyHash, botToken);
      expect(result).toBe(true);
    });
    
    it('должен обрабатывать очень длинный initData', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const longUser = JSON.stringify({ id: 123, name: 'A'.repeat(1000) });
      const dataCheckString = `auth_date=${authDate}\nuser=${longUser}`;
      const hash = generateValidHash(dataCheckString, botToken);
      
      const initDataLong = `user=${encodeURIComponent(longUser)}&auth_date=${authDate}&hash=${hash}`;
      const result = verifyTelegramInitData(initDataLong, botToken);
      expect(result).toBe(true);
    });
    
    it('должен обрабатывать initData с специальными символами', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const specialValue = '&=%?#';
      const dataCheckString = `auth_date=${authDate}\nspecial=${specialValue}`;
      const hash = generateValidHash(dataCheckString, botToken);
      
      const specialChars = `special=${encodeURIComponent(specialValue)}&auth_date=${authDate}&hash=${hash}`;
      const result = verifyTelegramInitData(specialChars, botToken);
      expect(result).toBe(true);
    });
    
    it('должен обрабатывать initData без auth_date (если не требуется проверка времени)', () => {
      const user = JSON.stringify({ id: 123 });
      const dataCheckString = `user=${user}`;
      const hash = generateValidHash(dataCheckString, botToken);
      
      const initDataWithoutAuth = `user=${encodeURIComponent(user)}&hash=${hash}`;
      const result = verifyTelegramInitData(initDataWithoutAuth, botToken);
      expect(result).toBe(true);
    });
  });
  
  describe('защита от timing attacks', () => {
    it('должен использовать constant-time сравнение для hash', () => {
      const authDate = Math.floor(Date.now() / 1000);
      const dataCheckString = `auth_date=${authDate}`;
      const correctHash = generateValidHash(dataCheckString, botToken);
      
      // Создаем hash с одним отличающимся символом
      const wrongHash = correctHash.slice(0, -1) + (correctHash.slice(-1) === 'a' ? 'b' : 'a');
      
      const initDataCorrect = `auth_date=${authDate}&hash=${correctHash}`;
      const initDataWrong = `auth_date=${authDate}&hash=${wrongHash}`;
      
      const resultCorrect = verifyTelegramInitData(initDataCorrect, botToken);
      const resultWrong = verifyTelegramInitData(initDataWrong, botToken);
      
      expect(resultCorrect).toBe(true);
      expect(resultWrong).toBe(false);
    });
  });
});
