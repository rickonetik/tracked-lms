# Database Schema Documentation

## Enrollment Access Model

Модель `Enrollment` расширена для управления доступом к курсам.

### Поля доступа

- **`accessStart`** (`DateTime`, NOT NULL, default `now()`) — начало доступа к курсу
- **`accessEnd`** (`DateTime?`, nullable) — конец доступа к курсу
  - `accessEnd = NULL` означает бессрочный доступ
- **`status`** (`EnrollmentStatus`, NOT NULL, default `active`) — статус записи на курс
- **`source`** (`EnrollmentSource`, NOT NULL, default `manual`) — источник записи

### Enum: EnrollmentStatus

- `active` — активная запись
- `expired` — доступ истек
- `revoked` — доступ отозван

### Enum: EnrollmentSource

- `invite` — запись по приглашению
- `manual` — ручная запись
- `public` — публичный доступ

### Индексы

- `@@index([studentId, status])` — быстрый поиск активных записей студента
- `@@index([courseId, status])` — быстрый поиск активных записей на курс
- `@@index([studentId, accessEnd])` — поиск записей с истекающим доступом

### Пример использования

```typescript
// Проверка активного доступа
const hasAccess = enrollment.status === 'active' && 
  (!enrollment.accessEnd || enrollment.accessEnd > new Date());

// Урок считается пройденным если completedAt != null
const isCompleted = lessonProgress.completedAt !== null;
```

## LessonProgress Simplification

Модель `LessonProgress` упрощена: удален `Boolean completed`, остался только `completedAt`.

### Правило

**Урок считается пройденным, если `completedAt != null`**

- `completedAt = null` — урок не пройден
- `completedAt != null` — урок пройден

Это единственный источник истины для статуса прохождения урока.

### История изменений

- Удалено поле `completed Boolean @default(false)`
- Удален индекс `@@index([completed])`
- Оставлено только `completedAt DateTime?`
