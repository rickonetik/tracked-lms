/**
 * Hook для работы с аутентификацией
 */

import { useState, useEffect, useCallback } from 'react';
import { authService, MeResponse } from '../services/auth.service';
import WebApp from '@twa-dev/sdk';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: MeResponse | null;
  error: string | null;
}

/**
 * Hook для работы с аутентификацией
 * Автоматически выполняет bootstrap при монтировании
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  /**
   * Загрузка данных пользователя через /me
   */
  const loadUser = useCallback(async () => {
    try {
      const user = await authService.getMe();
      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        error: null,
      });
    } catch (error) {
      // Если ошибка 401, значит токен невалиден
      const statusCode = (error as any)?.statusCode;
      if (statusCode === 401 || (error instanceof Error && error.message.includes('401'))) {
        authService.logout();
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    }
  }, []);

  /**
   * Bootstrap: аутентификация через Telegram initData
   */
  const bootstrap = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Проверяем, есть ли уже токен
      if (authService.isAuthenticated()) {
        // Пытаемся загрузить данные пользователя
        await loadUser();
        return;
      }

      // Проверяем, что мы в Telegram
      const isInTelegram =
        typeof window !== 'undefined' &&
        window.Telegram?.WebApp !== undefined &&
        WebApp.initData !== undefined;

      if (!isInTelegram) {
        // В браузере - не можем авторизоваться
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
        return;
      }

      // Получаем initData из Telegram
      const initData = WebApp.initData;
      if (!initData) {
        // Если initData нет, значит мы не в Telegram или данные не готовы
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
        return;
      }

      // Аутентифицируемся
      const response = await authService.authenticateWithTelegram(initData);

      // Загружаем данные пользователя через /me для свежести
      await loadUser();
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  }, [loadUser]);

  /**
   * Выход
   */
  const logout = useCallback(() => {
    authService.logout();
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });
  }, []);

  // Автоматический bootstrap при монтировании
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return {
    ...state,
    bootstrap,
    logout,
    reload: loadUser,
  };
}
