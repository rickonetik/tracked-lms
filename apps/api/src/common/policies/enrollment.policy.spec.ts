/**
 * Unit tests for Enrollment Policy
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { hasActiveEnrollment, hasActiveEnrollmentForLesson } from './enrollment.policy';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('EnrollmentPolicy', () => {
  let prisma: PrismaService;
  let module: TestingModule;

  const mockPrismaService = {
    enrollment: {
      findFirst: jest.fn(),
    },
    lesson: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hasActiveEnrollment', () => {
    const studentId = 'student-123';
    const courseId = 'course-456';
    const now = new Date();

    it('should return true when active enrollment exists with null accessEnd', async () => {
      mockPrismaService.enrollment.findFirst.mockResolvedValue({
        id: 'enrollment-123',
        studentId,
        courseId,
        status: 'active',
        accessEnd: null,
      });

      const result = await hasActiveEnrollment(prisma, studentId, courseId, false);

      expect(result).toBe(true);
      expect(mockPrismaService.enrollment.findFirst).toHaveBeenCalledWith({
        where: {
          studentId,
          courseId,
          status: 'active',
          OR: [
            { accessEnd: null },
            { accessEnd: { gt: expect.any(Date) } },
          ],
        },
      });
    });

    it('should return true when active enrollment exists with future accessEnd', async () => {
      const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

      mockPrismaService.enrollment.findFirst.mockResolvedValue({
        id: 'enrollment-123',
        studentId,
        courseId,
        status: 'active',
        accessEnd: futureDate,
      });

      const result = await hasActiveEnrollment(prisma, studentId, courseId, false);

      expect(result).toBe(true);
    });

    it('should return false when no enrollment exists (throwOnFail = false)', async () => {
      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);

      const result = await hasActiveEnrollment(prisma, studentId, courseId, false);

      expect(result).toBe(false);
    });

    it('should throw ForbiddenException when no enrollment exists (throwOnFail = true)', async () => {
      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);

      await expect(
        hasActiveEnrollment(prisma, studentId, courseId, true),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        hasActiveEnrollment(prisma, studentId, courseId, true),
      ).rejects.toThrow('Access denied: no active enrollment for this course');
    });

    it('should return false when enrollment is revoked (throwOnFail = false)', async () => {
      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);

      const result = await hasActiveEnrollment(prisma, studentId, courseId, false);

      expect(result).toBe(false);
    });

    it('should return false when enrollment accessEnd is in the past (throwOnFail = false)', async () => {
      const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // -7 days

      // findFirst вернет null, так как accessEnd в прошлом не пройдет фильтр
      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);

      const result = await hasActiveEnrollment(prisma, studentId, courseId, false);

      expect(result).toBe(false);
    });

    it('should throw ForbiddenException when enrollment accessEnd is in the past (throwOnFail = true)', async () => {
      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);

      await expect(
        hasActiveEnrollment(prisma, studentId, courseId, true),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('hasActiveEnrollmentForLesson', () => {
    const studentId = 'student-123';
    const lessonId = 'lesson-789';
    const courseId = 'course-456';
    const moduleId = 'module-555';

    it('should return true when student has active enrollment for course containing lesson', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue({
        id: lessonId,
        module: {
          id: moduleId,
          course: {
            id: courseId,
          },
        },
      });

      mockPrismaService.enrollment.findFirst.mockResolvedValue({
        id: 'enrollment-123',
        studentId,
        courseId,
        status: 'active',
        accessEnd: null,
      });

      const result = await hasActiveEnrollmentForLesson(prisma, studentId, lessonId, false);

      expect(result).toBe(true);
      expect(mockPrismaService.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: lessonId },
        select: {
          id: true,
          module: {
            select: {
              id: true,
              course: {
                select: { id: true },
              },
            },
          },
        },
      });
    });

    it('should return false when lesson not found (throwOnFail = false)', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      const result = await hasActiveEnrollmentForLesson(prisma, studentId, lessonId, false);

      expect(result).toBe(false);
    });

    it('should throw NotFoundException when lesson not found (throwOnFail = true)', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(
        hasActiveEnrollmentForLesson(prisma, studentId, lessonId, true),
      ).rejects.toThrow(NotFoundException);

      await expect(
        hasActiveEnrollmentForLesson(prisma, studentId, lessonId, true),
      ).rejects.toThrow('Lesson not found');
    });

    it('should throw ForbiddenException when student has no active enrollment for course (throwOnFail = true)', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue({
        id: lessonId,
        module: {
          id: moduleId,
          course: {
            id: courseId,
          },
        },
      });

      mockPrismaService.enrollment.findFirst.mockResolvedValue(null);

      await expect(
        hasActiveEnrollmentForLesson(prisma, studentId, lessonId, true),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        hasActiveEnrollmentForLesson(prisma, studentId, lessonId, true),
      ).rejects.toThrow('Access denied: no active enrollment for this course');
    });
  });
});
