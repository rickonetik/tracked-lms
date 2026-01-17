/**
 * Progress Service для работы с прогрессом обучения
 */

import { apiClient } from '../lib/api-client';

export interface CourseProgressDto {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

class ProgressService {
  /**
   * Отметить урок как пройденный
   */
  async completeLesson(lessonId: string): Promise<CourseProgressDto> {
    const response = await apiClient.post<CourseProgressDto>(
      `/progress/lessons/${lessonId}/complete`,
      undefined, // POST без тела
    );
    return response;
  }
}

export const progressService = new ProgressService();
