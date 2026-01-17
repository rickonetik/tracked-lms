/**
 * Student Service для работы с курсами студента
 */

import { apiClient } from '../lib/api-client';

export interface CourseDto {
  id: string;
  title: string;
  description?: string | null;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

export interface MyCoursesResponseDto {
  courses: CourseDto[];
}

class StudentService {
  /**
   * Получение списка курсов текущего студента
   */
  async getMyCourses(): Promise<CourseDto[]> {
    const response = await apiClient.get<MyCoursesResponseDto>('/me/courses');
    return response.courses;
  }
}

export const studentService = new StudentService();
