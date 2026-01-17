# Enrollment Policy

Единая проверка доступа к курсу/уроку на основе enrollment.

## Использование

### Проверка доступа к курсу

```typescript
import { hasActiveEnrollment } from '../common/policies/enrollment.policy';
import { PrismaService } from '../common/prisma.service';

// В сервисе или контроллере
constructor(private readonly prisma: PrismaService) {}

// С бросанием исключения (по умолчанию)
async getCourseContent(courseId: string, userId: string) {
  await hasActiveEnrollment(this.prisma, userId, courseId);
  // Если доступа нет, будет выброшено ForbiddenException
  // Если доступ есть, продолжаем выполнение
}

// Без исключения (возвращает boolean)
async canAccessCourse(courseId: string, userId: string): Promise<boolean> {
  return hasActiveEnrollment(this.prisma, userId, courseId, false);
}
```

### Проверка доступа к уроку

```typescript
import { hasActiveEnrollmentForLesson } from '../common/policies/enrollment.policy';

// С бросанием исключения (по умолчанию)
async getLessonContent(lessonId: string, userId: string) {
  await hasActiveEnrollmentForLesson(this.prisma, userId, lessonId);
  // Если доступа нет, будет выброшено ForbiddenException
}

// Без исключения (возвращает boolean)
async canAccessLesson(lessonId: string, userId: string): Promise<boolean> {
  return hasActiveEnrollmentForLesson(this.prisma, userId, lessonId, false);
}
```

## Логика проверки

Policy проверяет:
1. **Status**: `enrollment.status === 'active'`
2. **Access End**: `enrollment.accessEnd IS NULL OR enrollment.accessEnd > now()`
3. **Student ID**: `enrollment.studentId === userId`
4. **Course ID**: `enrollment.courseId === courseId` (для урока - через lesson → module → course)

## Семантика HTTP кодов

**Правило для MVP:**
- **404 (Not Found)**: Ресурс не существует (курс, урок не найден)
- **403 (Forbidden)**: Ресурс существует, но нет доступа (нет активного enrollment)

**Важно:**
В текущей реализации мы сначала проверяем существование курса (404), затем доступ (403). Это означает, что мы "раскрываем" факт существования курса даже без доступа. Для MVP это приемлемо.

**Для приватных продуктов (будущее):**
Можно изменить логику, чтобы всегда возвращать 403, если нет доступа, независимо от существования ресурса. Это скрывает информацию о существовании курсов от неавторизованных пользователей.

## Исключения

- `ForbiddenException` с кодом `403` и ошибкой `ENROLLMENT_REQUIRED` - когда нет активного enrollment
  - WebApp может использовать этот код для различения "нет доступа к курсу" vs других 403 ошибок
- `NotFoundException` с кодом `404` и ошибкой `LESSON_NOT_FOUND` - когда урок не найден (для `hasActiveEnrollmentForLesson`)

## Примеры использования в endpoint'ах

### В контроллере

```typescript
@Get('/courses/:courseId/content')
@UseGuards(JwtAuthGuard)
async getCourseContent(
  @Param('courseId') courseId: string,
  @Req() req: any,
) {
  const userId = req.user.id;
  
  // Проверка доступа
  await hasActiveEnrollment(this.prisma, userId, courseId);
  
  // Если дошли сюда - доступ есть, возвращаем контент
  return this.courseService.getContent(courseId);
}
```

### В сервисе

```typescript
async getLessonProgress(lessonId: string, userId: string) {
  // Проверка доступа
  await hasActiveEnrollmentForLesson(this.prisma, userId, lessonId);
  
  // Получаем прогресс
  return this.prisma.lessonProgress.findUnique({
    where: {
      lessonId_studentId: {
        lessonId,
        studentId: userId,
      },
    },
  });
}
```
