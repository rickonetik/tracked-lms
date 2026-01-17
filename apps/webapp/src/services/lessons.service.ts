/**
 * Lessons Service для работы с уроками
 */

import { apiClient } from '../lib/api-client';

export interface StudentLessonDto {
  id: string;
  moduleId: string;
  title: string;
  description?: string | null;
  position: number;
  video: null;
  completedAt?: string | null;
}

class LessonsService {
  /**
   * Получение урока по ID
   */
  async getLesson(lessonId: string): Promise<StudentLessonDto> {
    return apiClient.get<StudentLessonDto>(`/lessons/${lessonId}`);
  }
}

export const lessonsService = new LessonsService();
