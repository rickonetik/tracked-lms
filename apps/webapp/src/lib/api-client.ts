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
      ...(options.headers as Record<string, string>),
    };

    // Добавляем Content-Type только когда body !== undefined
    // Это исключает случаи, когда body = null или body = ''
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

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
      // Сначала читаем текст ответа
      const text = await response.text();
      
      // Если ответ пустой
      if (!text) {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Empty response`);
        }
        throw new Error('Empty response from server');
      }
      
      // Пытаемся распарсить как JSON
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // Если не JSON, это может быть HTML ошибка
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
        }
        throw new Error(`Failed to parse JSON: ${parseError}`);
      }
    } catch (e) {
      // Если это уже наша ошибка с statusCode, пробрасываем дальше
      if (e instanceof Error && (e as any).statusCode) {
        throw e;
      }
      // Иначе создаем новую ошибку
      if (!response.ok) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        const enhancedError = new Error(errorMessage);
        (enhancedError as any).statusCode = response.status;
        throw enhancedError;
      }
      throw e;
    }

    // Обрабатываем ошибки
    if (!response.ok) {
      const error = data as ApiError;
      const errorMessage = error.message || `HTTP ${response.status}`;
      // Добавляем статус код и error code для обработки разных типов ошибок
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).statusCode = response.status;
      (enhancedError as any).error = error.error; // Сохраняем error code (ENROLLMENT_REQUIRED, COURSE_NOT_FOUND и т.д.)
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
      // Явно передаем undefined для POST без тела (не null, не {})
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
