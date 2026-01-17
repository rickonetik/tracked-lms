import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { hasActiveEnrollment } from '../../common/policies/enrollment.policy';
import { StudentCourseDto } from './dto/student-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить курс для студента с полной структурой (modules + lessons)
   * Проверяет наличие курса и активный enrollment
   */
  async getCourseForStudent(
    courseId: string,
    studentId: string,
  ): Promise<StudentCourseDto> {
    // Проверяем существование курса
    const courseExists = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });

    if (!courseExists) {
      throw new NotFoundException({
        message: 'Course not found',
        error: 'COURSE_NOT_FOUND',
        statusCode: 404,
      });
    }

    // Проверяем доступ через policy
    await hasActiveEnrollment(this.prisma, studentId, courseId, true);

    // Получаем структуру курса с модулями и уроками
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        topicId: true,
        status: true,
        modules: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            position: true,
            lessons: {
              orderBy: { position: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                position: true,
              },
            },
          },
        },
      },
    });

    // TypeScript гарантирует, что course не null после findUnique
    // но для безопасности добавим проверку
    if (!course) {
      throw new NotFoundException({
        message: 'Course not found',
        error: 'COURSE_NOT_FOUND',
        statusCode: 404,
      });
    }

    return course as StudentCourseDto;
  }
}
