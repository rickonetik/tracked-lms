# Release Notes - Version 0.3

## Progress Tracking & UI Improvements

This release introduces comprehensive progress tracking functionality for students, including API endpoints for lesson completion, progress calculation, and enhanced UI with real-time progress updates.

---

## 🎯 Key Features

### 1. Lesson Completion Tracking
- **Idempotent API endpoint** for marking lessons as complete
- **Course progress snapshot** returned after completion
- **Persistent status** - lesson completion status survives page reloads

### 2. Course Progress Display
- **Progress indicators** on course cards (percentage, completed/total, progress bar)
- **Real-time updates** - progress updates immediately after lesson completion
- **Optimistic UI updates** for better user experience

### 3. Enhanced Learning Experience
- **Visual progress tracking** - students can see their progress at a glance
- **Completion status** - clear indication of completed lessons
- **Seamless navigation** - progress persists across page reloads

---

## 📋 Stories Implemented

### Story 3.11 — API: POST `/progress/lessons/:id/complete` (idempotent)

**Goal:** Add an idempotent API endpoint to mark a lesson as complete for a student and return updated course progress.

**Changes:**
- Created `ProgressModule` with `ProgressService` and `ProgressController`
- Implemented `completeLesson()` method with:
  - Lesson existence check (404 if not found)
  - Access control via `hasActiveEnrollmentForLesson` (403 if no enrollment)
  - Idempotent completion using Prisma transaction
  - Course progress calculation (totalLessons, completedLessons, progressPercent)
- Returns `CourseProgressDto` with course progress snapshot

**API Contract:**
```
POST /progress/lessons/:id/complete
Authorization: Bearer <token>

Response 200:
{
  "courseId": "uuid",
  "totalLessons": 12,
  "completedLessons": 3,
  "progressPercent": 25
}

Errors:
- 401 Unauthorized
- 404 LESSON_NOT_FOUND
- 403 ENROLLMENT_REQUIRED
```

**Files Changed:**
- `apps/api/src/modules/progress/` (new module)
- `apps/api/src/app.module.ts` (import ProgressModule)

---

### Story 3.12 — API: GET `/me/courses` returns progress

**Goal:** Extend GET `/me/courses` response to include progress information (totalLessons, completedLessons, progressPercent) for each course.

**Changes:**
- Extended `CourseDto` with progress fields:
  - `totalLessons: number`
  - `completedLessons: number`
  - `progressPercent: number`
- Optimized `StudentService.getMyCourses()` to avoid N+1 queries:
  - Maximum 4 queries for all courses (regardless of course count)
  - Grouped queries for modules, lessons, and lessonProgress
- Progress calculation uses `Math.floor()` for percentage
- Backward compatible: existing fields (id, title, description) remain unchanged

**API Contract:**
```
GET /me/courses
Authorization: Bearer <token>

Response 200:
{
  "courses": [
    {
      "id": "uuid",
      "title": "Course Title",
      "description": "...",
      "totalLessons": 12,
      "completedLessons": 3,
      "progressPercent": 25
    }
  ]
}
```

**Files Changed:**
- `apps/api/src/modules/student/dto/course.dto.ts`
- `apps/api/src/modules/student/student.service.ts`

---

### Story 3.13 — WebApp: progress UI update

**Goal:** Add progress UI on course cards in Learning page and implement optimistic updates after lesson completion.

**Changes:**
- Created `LearningStore` (React Context) for centralized course state management:
  - `loadMyCourses()` - fetch courses from API
  - `applyProgressFromComplete()` - apply progress snapshot from API
  - `optimisticIncrement()` - optimistic progress update
- Updated `LearningPage`:
  - Uses `LearningStore` instead of local state
  - Displays progress on course cards (percent, completed/total, progress bar)
  - Handles empty state (0/0, 0%)
- Updated `CoursePage`:
  - Passes `courseId` via navigation state when navigating to lessons
- Updated `LessonPage`:
  - Added "Пройдено" (Complete) button
  - Implements optimistic updates after completion
  - Handles errors (401, 403, 404, generic)
  - Button disabled after completion
- Created `ProgressService` for API calls
- Fixed `api-client.ts`:
  - Content-Type only added when body exists
  - Improved error handling and response parsing

**Files Changed:**
- `apps/webapp/src/features/learning/learning.store.tsx` (new)
- `apps/webapp/src/services/progress.service.ts` (new)
- `apps/webapp/src/services/student.service.ts` (updated)
- `apps/webapp/src/pages/LearningPage.tsx` (updated)
- `apps/webapp/src/pages/LearningPage.css` (updated)
- `apps/webapp/src/pages/CoursePage.tsx` (updated)
- `apps/webapp/src/pages/LessonPage.tsx` (updated)
- `apps/webapp/src/pages/LessonPage.css` (updated)
- `apps/webapp/src/App.tsx` (updated - wrapped in LearningProvider)
- `apps/webapp/src/lib/api-client.ts` (updated - Content-Type fix)

---

### Mini Story: GET `/lessons/:id` returns `completedAt`

**Goal:** Return `completedAt` field in GET `/lessons/:id` response so LessonPage can show "Урок пройден" status even after reload.

**Changes:**
- Added `completedAt` field to `StudentLessonDto` (API and WebApp)
- Updated `LessonsService.getLessonForStudent()`:
  - Queries `lessonProgress` after access check
  - Returns `completedAt` as ISO string or `null`
- Updated `LessonPage`:
  - Uses `lesson.completedAt` instead of local `isCompleted` state
  - Reloads lesson after completion to get updated `completedAt`
  - Status persists after page reload

**Security:**
- `completedAt` only queried after enrollment check (proper access control)
- Only returns `completedAt` for current student (`studentId` from `req.user.id`)

**API Contract:**
```
GET /lessons/:id
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "moduleId": "uuid",
  "title": "Lesson Title",
  "description": "...",
  "position": 10,
  "video": null,
  "completedAt": "2026-01-17T11:05:17.323Z" | null
}
```

**Files Changed:**
- `apps/api/src/modules/lessons/dto/student-lesson.dto.ts`
- `apps/api/src/modules/lessons/lessons.service.ts`
- `apps/webapp/src/services/lessons.service.ts`
- `apps/webapp/src/pages/LessonPage.tsx`

---

## 🔒 Security & Access Control

All endpoints properly implement:
- **JWT Authentication** - All endpoints require valid JWT token
- **Access Control** - Enrollment checks before returning progress data
- **Data Isolation** - Students can only see their own progress
- **Proper Error Handling** - Clear error messages (401, 403, 404)

---

## 🐛 Bug Fixes

1. **POST request Content-Type issue**
   - Fixed: Content-Type header only added when request body exists
   - Prevents "Body cannot be empty when content-type is set to 'application/json'" error

2. **StrictMode double-invoke protection**
   - Added `isFetchingRef` to `LearningPage` to prevent duplicate API calls

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

---

## 🧪 Testing

All stories include comprehensive manual testing:
- ✅ Idempotency tests (repeated complete calls)
- ✅ Progress calculation tests (total/completed/percent)
- ✅ Access control tests (401, 403, 404)
- ✅ UI state tests (loading, error, success)
- ✅ Optimistic update tests
- ✅ Reload persistence tests

---

## 📝 Migration Notes

**No database migrations required** - uses existing `lesson_progress` table.

**API Changes:**
- GET `/me/courses` - Response format extended (backward compatible)
- GET `/lessons/:id` - Response format extended (backward compatible)
- POST `/progress/lessons/:id/complete` - New endpoint

**WebApp Changes:**
- New `LearningStore` Context Provider (wraps App)
- Course cards now display progress information
- Lesson page includes "Complete" button

---

## 🚀 Next Steps

Potential improvements for future releases:
- Progress analytics and statistics
- Course completion certificates
- Progress notifications
- Batch lesson completion
- Progress export functionality

---

## 📦 Version Information

- **Version:** 0.3
- **Release Date:** 2026-01-17
- **Previous Version:** 0.2
- **Breaking Changes:** None (all changes backward compatible)

---

## 👥 Contributors

This release includes work from Epic 3 - Course Management, focusing on student progress tracking and UI improvements.
