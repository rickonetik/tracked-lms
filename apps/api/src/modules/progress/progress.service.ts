import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { hasActiveEnrollmentForLesson } from '../../common/policies/enrollment.policy';
import { CourseProgressDto } from './dto/course-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async completeLesson(studentId: string, lessonId: string): Promise<CourseProgressDto> {
    // Step A — Load lesson + courseId
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        module: {
          select: {
            course: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException({
        message: 'Lesson not found',
        error: 'LESSON_NOT_FOUND',
        statusCode: 404,
      });
    }

    const courseId = lesson.module.course.id;

    // Step B — Access check
    await hasActiveEnrollmentForLesson(this.prisma, studentId, lessonId, true);

    // Step C — Idempotent completion
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      // Проверяем существующий прогресс
      const existing = await tx.lessonProgress.findUnique({
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

      // Если уже завершен — ничего не меняем (идемпотентность)
      if (existing?.completedAt) {
        return;
      }

      // Иначе создаем или обновляем запись (completedAt будет null или запись не существует)
      await tx.lessonProgress.upsert({
        where: {
          lessonId_studentId: {
            lessonId,
            studentId,
          },
        },
        create: {
          lessonId,
          studentId,
          completedAt: now,
        },
        update: {
          completedAt: now,
        },
      });
    });

    // Step D — Return course progress snapshot
    // totalLessons: count всех lessons в курсе
    const totalLessons = await this.prisma.lesson.count({
      where: {
        module: {
          courseId,
        },
      },
    });

    // completedLessons: count lesson_progress где completedAt != null
    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        studentId,
        completedAt: {
          not: null,
        },
        lesson: {
          module: {
            courseId,
          },
        },
      },
    });

    // progressPercent: floor((completedLessons / totalLessons) * 100)
    const progressPercent =
      totalLessons === 0 ? 0 : Math.floor((completedLessons / totalLessons) * 100);

    return {
      courseId,
      totalLessons,
      completedLessons,
      progressPercent,
    };
  }
}
