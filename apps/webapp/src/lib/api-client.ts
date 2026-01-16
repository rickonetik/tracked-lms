/**
 * API Client для работы с бэкендом
 */

// Используем проксирование через Vite в dev режиме
// В production можно использовать VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:3001');

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Загружаем токен из localStorage при инициализации
    this.loadToken();
  }

  /**
   * Загружает токен из localStorage
   */
  loadToken(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  /**
   * Устанавливает токен и сохраняет в localStorage
   */
  setToken(token: string | null): void {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  /**
   * Получает текущий токен
   */
  getToken(): string | null {
    return this.accessToken;
  }

  /**
   * Базовый метод для выполнения HTTP запросов
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Добавляем токен в заголовки, если он есть
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Парсим ответ
    let data: T | ApiError;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error(`Failed to parse response: ${e}`);
    }

    // Обрабатываем ошибки
    if (!response.ok) {
      const error = data as ApiError;
      const errorMessage = error.message || `HTTP ${response.status}`;
      // Добавляем статус код в сообщение для обработки 401
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).statusCode = response.status;
      throw enhancedError;
    }

    return data as T;
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Экспортируем singleton instance
export const apiClient = new ApiClient();
