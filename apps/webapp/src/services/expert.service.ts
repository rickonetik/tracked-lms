import { apiClient } from '../lib/api-client';

export interface ExpertMeResponse {
  expertAccount: {
    id: string;
    slug: string;
    title?: string | null;
    ownerUserId: string;
    createdAt: string;
    updatedAt: string;
  };
  membership: {
    id: string;
    userId: string;
    expertAccountId: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  subscription: {
    id: string;
    expertAccountId: string;
    status: string;
    plan: string;
    currentPeriodEnd: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  permissions: {
    platform: string[];
    expert: string[];
  };
}

export const expertService = {
  /**
   * Получить информацию о текущем эксперт-аккаунте
   */
  async getMe(): Promise<ExpertMeResponse> {
    return apiClient.get<ExpertMeResponse>('/expert/me');
  },
};
