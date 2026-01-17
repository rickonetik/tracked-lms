/**
 * Learning Store - Context для управления состоянием курсов студента
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { studentService, CourseDto } from '../../services/student.service';

type ErrorKind = 'UNAUTHORIZED' | 'GENERIC' | null;

interface ErrorState {
  kind: ErrorKind;
  message?: string;
}

interface LearningContextValue {
  courses: CourseDto[];
  isLoading: boolean;
  error: ErrorState | null;
  loadMyCourses: () => Promise<void>;
  applyProgressFromComplete: (courseId: string, snapshot: {
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
  }) => void;
  optimisticIncrement: (courseId: string) => void;
}

const LearningContext = createContext<LearningContextValue | undefined>(undefined);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const updateCourseProgress = useCallback((courseId: string, updater: (course: CourseDto) => CourseDto) => {
    setCourses((prev) =>
      prev.map((course) => (course.id === courseId ? updater(course) : course)),
    );
  }, []);

  const loadMyCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await studentService.getMyCourses();
      setCourses(data);
    } catch (err: any) {
      const statusCode = err?.statusCode;
      if (statusCode === 401) {
        setError({ kind: 'UNAUTHORIZED' });
        setCourses([]);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить курсы';
        setError({ kind: 'GENERIC', message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyProgressFromComplete = useCallback(
    (courseId: string, snapshot: { totalLessons: number; completedLessons: number; progressPercent: number }) => {
      updateCourseProgress(courseId, (course) => ({
        ...course,
        totalLessons: snapshot.totalLessons,
        completedLessons: snapshot.completedLessons,
        progressPercent: snapshot.progressPercent,
      }));
    },
    [updateCourseProgress],
  );

  const optimisticIncrement = useCallback(
    (courseId: string) => {
      updateCourseProgress(courseId, (course) => {
        const newCompleted = Math.min(course.completedLessons + 1, course.totalLessons);
        const newPercent =
          course.totalLessons === 0 ? 0 : Math.floor((newCompleted / course.totalLessons) * 100);
        return {
          ...course,
          completedLessons: newCompleted,
          progressPercent: newPercent,
        };
      });
    },
    [updateCourseProgress],
  );

  return (
    <LearningContext.Provider
      value={{
        courses,
        isLoading,
        error,
        loadMyCourses,
        applyProgressFromComplete,
        optimisticIncrement,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearningStore() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearningStore must be used within LearningProvider');
  }
  return context;
}
