import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

// Расширяем Window для TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp?: unknown;
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  isReady: boolean;
  user: TelegramUser | null;
  isInTelegram: boolean;
  version: string;
  platform: string;
}

/**
 * Hook для работы с Telegram WebApp SDK
 * Предоставляет данные пользователя из initDataUnsafe
 * С fallback для браузера
 */
export function useTelegram(): TelegramWebApp {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    // Проверяем что мы в Telegram
    const inTelegram =
      typeof window !== 'undefined' &&
      window.Telegram?.WebApp !== undefined &&
      WebApp.initDataUnsafe !== undefined;

    setIsInTelegram(inTelegram);

    if (inTelegram) {
      // Инициализируем Telegram WebApp
      WebApp.ready();
      WebApp.expand();

      // Получаем данные пользователя из initDataUnsafe
      const initData = WebApp.initDataUnsafe;
      if (initData?.user) {
        setUser({
          id: initData.user.id,
          first_name: initData.user.first_name,
          last_name: initData.user.last_name,
          username: initData.user.username,
          language_code: initData.user.language_code,
          is_premium: initData.user.is_premium,
          photo_url: initData.user.photo_url,
        });
      }

      setIsReady(true);
    } else {
      // Fallback для браузера - используем mock данные
      setUser({
        id: 0,
        first_name: 'Guest',
        username: 'guest_user',
        language_code: 'en',
      });
      setIsReady(true);
    }
  }, []);

  return {
    isReady,
    user,
    isInTelegram,
    version: isInTelegram ? WebApp.version : 'browser',
    platform: isInTelegram ? WebApp.platform : 'web',
  };
}
