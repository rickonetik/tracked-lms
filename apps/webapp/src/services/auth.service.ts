/**
 * Auth Service для работы с аутентификацией
 */

import { apiClient } from '../lib/api-client';

export interface TelegramAuthRequest {
  initData: string;
}

export interface TelegramAuthResponse {
  accessToken: string;
  user: {
    id: string;
    telegramId: string | null;
    firstName: string;
    lastName: string | null;
    username: string | null;
    status: string;
    userType: string;
  };
}

export interface MeResponse {
  id: string;
  telegramId: string | null;
  firstName: string;
  lastName: string | null;
  username: string | null;
  status: string;
  userType: string;
}

class AuthService {
  /**
   * Аутентификация через Telegram initData
   */
  async authenticateWithTelegram(initData: string): Promise<TelegramAuthResponse> {
    const response = await apiClient.post<TelegramAuthResponse>('/auth/telegram', {
      initData,
    });

    // Сохраняем токен
    apiClient.setToken(response.accessToken);

    return response;
  }

  /**
   * Получение данных текущего пользователя
   */
  async getMe(): Promise<MeResponse> {
    return apiClient.get<MeResponse>('/auth/me');
  }

  /**
   * Выход (очистка токена)
   */
  logout(): void {
    apiClient.setToken(null);
  }

  /**
   * Проверка, авторизован ли пользователь
   */
  isAuthenticated(): boolean {
    return apiClient.getToken() !== null;
  }

  /**
   * Получение токена
   */
  getToken(): string | null {
    return apiClient.getToken();
  }
}

export const authService = new AuthService();
