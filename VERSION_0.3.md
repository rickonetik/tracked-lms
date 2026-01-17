# Release Notes - Version 0.3

## Epic 3: Course Management & Progress Tracking

This release introduces comprehensive course management functionality for students, including database schema for courses, modules, lessons, enrollments, progress tracking, and a complete UI for learning experience.

---

## 🎯 Key Features

### 1. Course Management Infrastructure
- **Database schema** for topics, courses, modules, lessons
- **Enrollment system** with access control (active/expired/revoked)
- **Progress tracking** with lesson completion status
- **Positioning system** for modules and lessons ordering

### 2. Student Learning Experience
- **Course listing** - View enrolled courses with progress
- **Course details** - Browse modules and lessons
- **Lesson viewing** - Access lesson content
- **Progress tracking** - Visual progress indicators and completion status

### 3. Progress Tracking & UI
- **Lesson completion** - Mark lessons as complete
- **Real-time progress** - Progress updates immediately after completion
- **Visual indicators** - Progress bars and completion status on course cards
- **Persistent status** - Completion status survives page reloads

---

## 📋 Stories Implemented (3.1 - 3.13)

### Story 3.1 — DB: topics + courses (минимум)

**Goal:** Create database tables for topics and courses.

**Changes:**
- Created `topics` table with `id`, `name`, `slug`, `description`
- Created `courses` table with:
  - `id`, `title`, `description`, `topicId` (nullable)
  - `status` enum: `draft`, `published`, `archived`
  - `createdAt`, `updatedAt`
- Added indexes for performance
- Prisma migrations applied

**Files Changed:**
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260116054721_add_topics_and_courses/`

---

### Story 3.2 — DB: modules + lessons + positions

**Goal:** Create database schema for course structure (modules and lessons) with positioning.

**Changes:**
- Created `modules` table:
  - `id`, `courseId`, `title`, `description`, `position`
  - Foreign key to `courses`
- Created `lessons` table:
  - `id`, `moduleId`, `title`, `description`, `position`
  - Foreign key to `modules`
- Position system: integer with step 10 (10, 20, 30...)
- Unique constraints for ordering
- Prisma migrations applied

**Files Changed:**
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260116062020_add_modules_and_lessons/`

---

### Story 3.3 — DB: enrollments + lesson_progress

**Goal:** Create database schema for student enrollments and lesson progress tracking.

**Changes:**
- Created `enrollments` table:
  - `id`, `courseId`, `studentId` (unique constraint)
  - `enrolledAt`, `accessStart`, `accessEnd` (nullable)
  - `status` enum: `active`, `expired`, `revoked`
  - `source` enum: `invite`, `manual`, `public`
  - Indexes for performance
- Created `lesson_progress` table:
  - `id`, `lessonId`, `studentId` (unique constraint)
  - `completedAt` (nullable) - single source of truth for completion
- Prisma migrations applied

**Files Changed:**
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/20260116230857_add_enrollments_and_lesson_progress/`
- `apps/api/prisma/migrations/20260116231623_extend_enrollment_and_simplify_lesson_progress/`

---

### Story 3.4 — API: GET /me/courses (пустой список)

**Goal:** Create endpoint to return student's courses (initially empty list).

**Changes:**
- Created `StudentModule` with `StudentController` and `StudentService`
- Endpoint: `GET /me/courses`
- Returns: `{ courses: [] }` (empty initially)
- JWT authentication required
- Swagger documentation added

**Files Changed:**
- `apps/api/src/modules/student/` (new module)
- `apps/api/src/app.module.ts` (import StudentModule)

---

### Story 3.5 — WebApp: Learning -> My courses empty state

**Goal:** Create Learning page in WebApp with empty state when no courses.

**Changes:**
- Created `LearningPage` component
- Fetches courses from `GET /me/courses`
- Displays empty state: "У вас пока нет курсов"
- Handles loading, error (401), and empty states
- Uses `useAuth` hook for authentication
- Created `StudentService` for API calls

**Files Changed:**
- `apps/webapp/src/pages/LearningPage.tsx` (new)
- `apps/webapp/src/pages/LearningPage.css` (new)
- `apps/webapp/src/services/student.service.ts` (new)
- `apps/webapp/src/hooks/useAuth.ts` (updated)
- `apps/webapp/src/App.tsx` (routing)

---

### Story 3.6 — API: access policy "enrollment active" helper

**Goal:** Create reusable access policy functions for enrollment checks.

**Changes:**
- Created `enrollment.policy.ts` with:
  - `hasActiveEnrollment(prisma, studentId, courseId, throwOnFail)`
  - `hasActiveEnrollmentForLesson(prisma, studentId, lessonId, throwOnFail)`
- Policy checks:
  - Enrollment exists
  - Status is `active`
  - `accessEnd` is `null` OR `accessEnd > now()`
- Throws `ForbiddenException` with `ENROLLMENT_REQUIRED` error code
- Unit tests added

**Files Changed:**
- `apps/api/src/common/policies/enrollment.policy.ts` (new)
- `apps/api/src/common/policies/enrollment.policy.spec.ts` (new)
- `apps/api/src/common/policies/README.md` (new)

---

### Story 3.7 — API: GET /courses/:id (403 если нет enrollment)

**Goal:** Create endpoint for students to view course details with access control.

**Changes:**
- Created `CoursesModule` with `CoursesController` and `CoursesService`
- Endpoint: `GET /courses/:id`
- Returns course structure: modules and lessons (sorted by position)
- Access control via `hasActiveEnrollment` policy
- Errors: 404 `COURSE_NOT_FOUND`, 403 `ENROLLMENT_REQUIRED`
- DTOs: `StudentCourseDto`, `StudentModuleDto`, `StudentLessonDto`

**Files Changed:**
- `apps/api/src/modules/courses/` (new module)
- `apps/api/src/app.module.ts` (import CoursesModule)

---

### Story 3.8 — API: GET /lessons/:id (403 если нет enrollment)

**Goal:** Create endpoint for students to view lesson details with access control.

**Changes:**
- Created `LessonsModule` with `LessonsController` and `LessonsService`
- Endpoint: `GET /lessons/:id`
- Returns lesson: `id`, `moduleId`, `title`, `description`, `position`, `video` (null placeholder)
- Access control via `hasActiveEnrollmentForLesson` policy
- Errors: 404 `LESSON_NOT_FOUND`, 403 `ENROLLMENT_REQUIRED`
- DTO: `StudentLessonDto`

**Files Changed:**
- `apps/api/src/modules/lessons/` (new module)
- `apps/api/src/app.module.ts` (import LessonsModule)

---

### Story 3.9 — WebApp: Course view (modules/lessons list)

**Goal:** Create course detail page showing modules and lessons.

**Changes:**
- Created `CoursePage` component
- Fetches course from `GET /courses/:id`
- Displays course title, description
- Lists modules with their lessons
- Navigation to lesson pages
- Error handling: 401, 403, 404, generic
- Created `CoursesService` for API calls

**Files Changed:**
- `apps/webapp/src/pages/CoursePage.tsx` (new)
- `apps/webapp/src/pages/CoursePage.css` (new)
- `apps/webapp/src/services/courses.service.ts` (new)
- `apps/webapp/src/App.tsx` (routing)
- `apps/webapp/src/pages/LearningPage.tsx` (navigation)

---

### Story 3.10 — WebApp: Lesson view (content placeholder)

**Goal:** Create lesson detail page with content placeholder.

**Changes:**
- Created `LessonPage` component
- Fetches lesson from `GET /lessons/:id`
- Displays lesson title, description
- Video placeholder: "Видео будет добавлено позже" (EPIC 5)
- Error handling: 401, 403, 404, generic
- Navigation: "Back" button
- Created `LessonsService` for API calls

**Files Changed:**
- `apps/webapp/src/pages/LessonPage.tsx` (new)
- `apps/webapp/src/pages/LessonPage.css` (new)
- `apps/webapp/src/services/lessons.service.ts` (new)
- `apps/webapp/src/App.tsx` (routing)

---

### Story 3.11 — API: POST /progress/lessons/:id/complete (idempotent)

**Goal:** Add idempotent endpoint to mark lesson as complete and return course progress.

**Changes:**
- Created `ProgressModule` with `ProgressController` and `ProgressService`
- Endpoint: `POST /progress/lessons/:id/complete`
- Idempotent: repeated calls don't create duplicates or change `completedAt`
- Returns `CourseProgressDto`:
  - `courseId`, `totalLessons`, `completedLessons`, `progressPercent`
- Access control via `hasActiveEnrollmentForLesson` policy
- Progress calculation uses `Math.floor()` for percentage

**Files Changed:**
- `apps/api/src/modules/progress/` (new module)
- `apps/api/src/app.module.ts` (import ProgressModule)

---

### Story 3.12 — API: GET /me/courses returns progress

**Goal:** Extend GET /me/courses to include progress information for each course.

**Changes:**
- Extended `CourseDto` with progress fields:
  - `totalLessons: number`
  - `completedLessons: number`
  - `progressPercent: number`
- Optimized `StudentService.getMyCourses()`:
  - Maximum 4 queries for all courses (no N+1)
  - Grouped queries for modules, lessons, lessonProgress
- Backward compatible: existing fields remain unchanged

**Files Changed:**
- `apps/api/src/modules/student/dto/course.dto.ts`
- `apps/api/src/modules/student/student.service.ts`

---

### Story 3.13 — WebApp: progress UI update

**Goal:** Add progress UI on course cards and implement optimistic updates after lesson completion.

**Changes:**
- Created `LearningStore` (React Context) for centralized course state:
  - `loadMyCourses()` - fetch courses
  - `applyProgressFromComplete()` - apply progress snapshot
  - `optimisticIncrement()` - optimistic progress update
- Updated `LearningPage`:
  - Progress display on course cards (percent, completed/total, progress bar)
  - Uses `LearningStore` instead of local state
- Updated `CoursePage`:
  - Passes `courseId` via navigation state
- Updated `LessonPage`:
  - Added "Пройдено" (Complete) button
  - Optimistic updates after completion
  - Error handling for complete endpoint
- Created `ProgressService` for API calls
- Fixed `api-client.ts`: Content-Type only when body exists

**Files Changed:**
- `apps/webapp/src/features/learning/learning.store.tsx` (new)
- `apps/webapp/src/services/progress.service.ts` (new)
- `apps/webapp/src/pages/LearningPage.tsx` (updated)
- `apps/webapp/src/pages/LearningPage.css` (updated)
- `apps/webapp/src/pages/CoursePage.tsx` (updated)
- `apps/webapp/src/pages/LessonPage.tsx` (updated)
- `apps/webapp/src/pages/LessonPage.css` (updated)
- `apps/webapp/src/App.tsx` (wrapped in LearningProvider)
- `apps/webapp/src/lib/api-client.ts` (Content-Type fix)

---

### Mini Story: GET /lessons/:id returns completedAt

**Goal:** Return `completedAt` field in GET /lessons/:id so LessonPage shows completion status after reload.

**Changes:**
- Added `completedAt` field to `StudentLessonDto` (API and WebApp)
- Updated `LessonsService.getLessonForStudent()`:
  - Queries `lessonProgress` after access check
  - Returns `completedAt` as ISO string or `null`
- Updated `LessonPage`:
  - Uses `lesson.completedAt` instead of local state
  - Reloads lesson after completion
  - Status persists after page reload

**Security:**
- `completedAt` only queried after enrollment check
- Only returns `completedAt` for current student

**Files Changed:**
- `apps/api/src/modules/lessons/dto/student-lesson.dto.ts`
- `apps/api/src/modules/lessons/lessons.service.ts`
- `apps/webapp/src/services/lessons.service.ts`
- `apps/webapp/src/pages/LessonPage.tsx`

---

## 🔒 Security & Access Control

All endpoints properly implement:
- **JWT Authentication** - All endpoints require valid JWT token
- **Access Control** - Enrollment checks before returning data
- **Data Isolation** - Students can only see their own progress
- **Proper Error Handling** - Clear error messages (401, 403, 404)
- **Security Best Practices** - No data leakage (404 before 403)

---

## 🐛 Bug Fixes

1. **POST request Content-Type issue**
   - Fixed: Content-Type header only added when request body exists
   - Prevents "Body cannot be empty when content-type is set to 'application/json'" error

2. **StrictMode double-invoke protection**
   - Added `isFetchingRef` to prevent duplicate API calls in React StrictMode

3. **Error handling improvements**
   - Better error messages with status codes
   - Proper handling of empty and non-JSON responses

---

## 📊 Performance Optimizations

1. **N+1 Query Prevention**
   - Course progress calculation uses grouped queries
   - Maximum 4 queries for all courses (regardless of course count)

2. **Optimistic UI Updates**
   - Progress updates immediately after lesson completion
   - No need to reload entire course list

3. **Efficient Database Queries**
   - Proper use of Prisma `select` to fetch only needed fields
   - Indexes on frequently queried columns

---

## 🧪 Testing

All stories include comprehensive manual testing:
- ✅ Database migrations applied successfully
- ✅ Idempotency tests (repeated complete calls)
- ✅ Progress calculation tests (total/completed/percent)
- ✅ Access control tests (401, 403, 404)
- ✅ UI state tests (loading, error, success)
- ✅ Optimistic update tests
- ✅ Reload persistence tests
- ✅ Unit tests for policy functions

---

## 📝 Migration Notes

**Database Migrations:**
- 5 new migrations added for Epic 3
- All migrations backward compatible
- No data loss expected

**API Changes:**
- New endpoints: `GET /courses/:id`, `GET /lessons/:id`, `POST /progress/lessons/:id/complete`
- Extended endpoints: `GET /me/courses` (now includes progress)
- All changes backward compatible

**WebApp Changes:**
- New pages: `CoursePage`, `LessonPage`
- New features: Progress display, lesson completion
- New Context: `LearningStore` for state management

---

## 🚀 Next Steps

Potential improvements for future releases:
- Video content integration (EPIC 5)
- Progress analytics and statistics
- Course completion certificates
- Progress notifications
- Batch lesson completion
- Progress export functionality
- Course search and filtering

---

## 📦 Version Information

- **Version:** 0.3
- **Release Date:** 2026-01-17
- **Previous Version:** 0.2
- **Breaking Changes:** None (all changes backward compatible)
- **Epic:** Epic 3 - Course Management

---

## 👥 Contributors

This release includes work from Epic 3 - Course Management, focusing on student learning experience, course structure, and progress tracking.
