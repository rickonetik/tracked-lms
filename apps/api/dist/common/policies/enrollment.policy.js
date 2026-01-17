"use strict";
/**
 * Enrollment Policy - проверка доступа к курсу/уроку
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasActiveEnrollment = hasActiveEnrollment;
exports.hasActiveEnrollmentForLesson = hasActiveEnrollmentForLesson;
const common_1 = require("@nestjs/common");
/**
 * Проверяет, имеет ли студент активный доступ к курсу
 * @param prisma - экземпляр PrismaService
 * @param studentId - ID студента
 * @param courseId - ID курса
 * @param throwOnFail - если true, бросает ForbiddenException при отсутствии доступа
 * @returns true если доступ есть, false если нет (только если throwOnFail = false)
 * @throws ForbiddenException если доступ отсутствует и throwOnFail = true
 */
async function hasActiveEnrollment(prisma, studentId, courseId, throwOnFail = true) {
    const now = new Date();
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            studentId,
            courseId,
            status: 'active',
            OR: [
                { accessEnd: null },
                { accessEnd: { gt: now } },
            ],
        },
    });
    const hasAccess = enrollment !== null;
    if (!hasAccess && throwOnFail) {
        throw new common_1.ForbiddenException({
            message: 'Access denied: no active enrollment for this course',
            error: 'ENROLLMENT_REQUIRED',
            statusCode: 403,
        });
    }
    return hasAccess;
}
/**
 * Проверяет, имеет ли студент активный доступ к уроку через курс
 * @param prisma - экземпляр PrismaService
 * @param studentId - ID студента
 * @param lessonId - ID урока
 * @param throwOnFail - если true, бросает ForbiddenException при отсутствии доступа
 * @returns true если доступ есть, false если нет (только если throwOnFail = false)
 * @throws ForbiddenException если доступ отсутствует и throwOnFail = true
 */
async function hasActiveEnrollmentForLesson(prisma, studentId, lessonId, throwOnFail = true) {
    // Получаем только courseId через урок -> модуль -> курс
    // Оптимизация: выбираем только необходимые поля
    const lesson = await prisma.lesson.findUnique({
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
    if (!lesson) {
        if (throwOnFail) {
            throw new common_1.NotFoundException({
                message: 'Lesson not found',
                error: 'LESSON_NOT_FOUND',
                statusCode: 404,
            });
        }
        return false;
    }
    const courseId = lesson.module.course.id;
    return hasActiveEnrollment(prisma, studentId, courseId, throwOnFail);
}
//# sourceMappingURL=enrollment.policy.js.map