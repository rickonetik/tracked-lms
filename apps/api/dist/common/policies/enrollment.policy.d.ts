/**
 * Enrollment Policy - проверка доступа к курсу/уроку
 */
import { PrismaService } from '../prisma.service';
/**
 * Проверяет, имеет ли студент активный доступ к курсу
 * @param prisma - экземпляр PrismaService
 * @param studentId - ID студента
 * @param courseId - ID курса
 * @param throwOnFail - если true, бросает ForbiddenException при отсутствии доступа
 * @returns true если доступ есть, false если нет (только если throwOnFail = false)
 * @throws ForbiddenException если доступ отсутствует и throwOnFail = true
 */
export declare function hasActiveEnrollment(prisma: PrismaService, studentId: string, courseId: string, throwOnFail?: boolean): Promise<boolean>;
/**
 * Проверяет, имеет ли студент активный доступ к уроку через курс
 * @param prisma - экземпляр PrismaService
 * @param studentId - ID студента
 * @param lessonId - ID урока
 * @param throwOnFail - если true, бросает ForbiddenException при отсутствии доступа
 * @returns true если доступ есть, false если нет (только если throwOnFail = false)
 * @throws ForbiddenException если доступ отсутствует и throwOnFail = true
 */
export declare function hasActiveEnrollmentForLesson(prisma: PrismaService, studentId: string, lessonId: string, throwOnFail?: boolean): Promise<boolean>;
//# sourceMappingURL=enrollment.policy.d.ts.map