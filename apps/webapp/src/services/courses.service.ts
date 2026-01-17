/**
 * Courses Service для работы с курсами
 */

import { apiClient } from '../lib/api-client';

export interface StudentLessonDto {
  id: string;
  title: string;
  description?: string | null;
  position: number;
}

export interface StudentModuleDto {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  lessons: StudentLessonDto[];
}

export interface StudentCourseDto {
  id: string;
  title: string;
  description?: string | null;
  topicId?: string | null;
  status: string;
  modules: StudentModuleDto[];
}

class CoursesService {
  /**
   * Получение курса по ID
   */
  async getCourse(courseId: string): Promise<StudentCourseDto> {
    return apiClient.get<StudentCourseDto>(`/courses/${courseId}`);
  }
}

export const coursesService = new CoursesService();
