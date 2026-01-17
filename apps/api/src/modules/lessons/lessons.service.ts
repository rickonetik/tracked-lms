import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { hasActiveEnrollmentForLesson } from '../../common/policies/enrollment.policy';
import { StudentLessonDto } from './dto/student-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить урок для студента
   * Проверяет наличие урока и активный enrollment на курс
   */
  async getLessonForStudent(
    lessonId: string,
    studentId: string,
  ): Promise<StudentLessonDto> {
    // Шаг 1: Проверяем существование урока
    const lessonExists = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!lessonExists) {
      throw new NotFoundException({
        message: 'Lesson not found',
        error: 'LESSON_NOT_FOUND',
        statusCode: 404,
      });
    }

    // Шаг 2: Проверяем доступ через policy
    // policy сама бросит 403 ENROLLMENT_REQUIRED если доступа нет
    await hasActiveEnrollmentForLesson(this.prisma, studentId, lessonId, true);

    // Шаг 3: Загружаем данные урока
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        moduleId: true,
        title: true,
        description: true,
        position: true,
      },
    });

    // TypeScript гарантирует, что lesson не null после findUnique
    // но для безопасности добавим проверку
    if (!lesson) {
      throw new NotFoundException({
        message: 'Lesson not found',
        error: 'LESSON_NOT_FOUND',
        statusCode: 404,
      });
    }

    // Шаг 4: Проверяем, пройден ли урок текущим студентом
    const lessonProgress = await this.prisma.lessonProgress.findUnique({
      where: {
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
      select: {
        completedAt: true,
      },
    });

    // Возвращаем DTO с video = null (placeholder для EPIC 5) и completedAt
    return {
      id: lesson.id,
      moduleId: lesson.moduleId,
      title: lesson.title,
      description: lesson.description ?? null,
      position: lesson.position,
      video: null,
      completedAt: lessonProgress?.completedAt?.toISOString() ?? null,
    };
  }
}
