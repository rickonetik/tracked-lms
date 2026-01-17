import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CourseDto } from './dto/course.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить курсы студента
   * Фильтрует по активным enrollments с учетом срока доступа
   */
  async getMyCourses(userId: string): Promise<CourseDto[]> {
    const now = new Date();

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: userId,
        status: 'active',
        OR: [
          { accessEnd: null },
          { accessEnd: { gt: now } },
        ],
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    if (enrollments.length === 0) {
      return [];
    }

    // Собираем уникальные courseIds
    const courseIds = [...new Set(enrollments.map((e) => e.course.id))];

    // Step B — Get totalLessons by course (1-2 queries)
    // Получаем модули для всех курсов
    const modules = await this.prisma.module.findMany({
      where: {
        courseId: { in: courseIds },
      },
      select: {
        id: true,
        courseId: true,
      },
    });

    const moduleIds = modules.map((m) => m.id);
    const moduleIdToCourseId = new Map(modules.map((m) => [m.id, m.courseId]));

    // Подсчитываем уроки по модулям
    const lessonsByModule = await this.prisma.lesson.groupBy({
      by: ['moduleId'],
      where: {
        moduleId: { in: moduleIds },
      },
      _count: {
        _all: true,
      },
    });

    // Агрегируем по courseId
    const totalsMap = new Map<string, number>();
    for (const item of lessonsByModule) {
      const courseId = moduleIdToCourseId.get(item.moduleId);
      if (courseId) {
        totalsMap.set(courseId, (totalsMap.get(courseId) || 0) + item._count._all);
      }
    }

    // Step C — Get completedLessons by course (1-2 queries)
    // Получаем уроки для модулей
    const lessons = await this.prisma.lesson.findMany({
      where: {
        moduleId: { in: moduleIds },
      },
      select: {
        id: true,
        moduleId: true,
      },
    });

    const lessonIds = lessons.map((l) => l.id);
    const lessonIdToCourseId = new Map(
      lessons.map((l) => {
        const courseId = moduleIdToCourseId.get(l.moduleId);
        return [l.id, courseId!];
      }),
    );

    // Получаем завершенные уроки
    const completedProgress = await this.prisma.lessonProgress.findMany({
      where: {
        studentId: userId,
        completedAt: { not: null },
        lessonId: { in: lessonIds },
      },
      select: {
        lessonId: true,
      },
    });

    // Подсчитываем completed по courseId
    const completedMap = new Map<string, number>();
    for (const progress of completedProgress) {
      const courseId = lessonIdToCourseId.get(progress.lessonId);
      if (courseId) {
        completedMap.set(courseId, (completedMap.get(courseId) || 0) + 1);
      }
    }

    // Step D — Assemble response
    return enrollments.map((enrollment) => {
      const courseId = enrollment.course.id;
      const totalLessons = totalsMap.get(courseId) ?? 0;
      const completedLessons = completedMap.get(courseId) ?? 0;
      const progressPercent =
        totalLessons === 0 ? 0 : Math.floor((completedLessons / totalLessons) * 100);

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description ?? null,
        totalLessons,
        completedLessons,
        progressPercent,
      };
    });
  }
}
