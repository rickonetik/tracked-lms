-- SQL скрипт для создания тестового курса вручную
-- Использование: замените <STUDENT_ID> на ваш UUID и выполните в psql

-- 1) Создать topic
INSERT INTO topics (id, name, description, created_at, updated_at)
VALUES (gen_random_uuid(), 'Test Topic MiniApp', 'seed topic for manual testing', now(), now())
ON CONFLICT (name) DO UPDATE SET updated_at = EXCLUDED.updated_at
RETURNING id AS topic_id;

-- Скопируйте topic_id из вывода выше и используйте в следующей команде

-- 2) Создать course (замените <TOPIC_ID> на topic_id из шага 1)
-- INSERT INTO courses (id, title, description, topic_id, status, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'MiniApp Test Course', 'Course for Telegram Mini App manual testing', '<TOPIC_ID>'::UUID, 'published', now(), now())
-- RETURNING id AS course_id;

-- Скопируйте course_id из вывода выше и используйте в следующих командах

-- 3) Создать module (замените <COURSE_ID> на course_id из шага 2)
-- INSERT INTO modules (id, course_id, title, description, position, created_at, updated_at)
-- VALUES (gen_random_uuid(), '<COURSE_ID>'::UUID, 'Module 1', 'First module for testing', 10, now(), now())
-- RETURNING id AS module_id;

-- Скопируйте module_id из вывода выше и используйте в следующей команде

-- 4) Создать lessons (замените <MODULE_ID> на module_id из шага 3)
-- INSERT INTO lessons (id, module_id, title, description, position, created_at, updated_at)
-- VALUES
--   (gen_random_uuid(), '<MODULE_ID>'::UUID, 'Lesson 1', 'First lesson with description', 10, now(), now()),
--   (gen_random_uuid(), '<MODULE_ID>'::UUID, 'Lesson 2', null, 20, now(), now())
-- RETURNING id, title;

-- Скопируйте lesson_id из вывода выше (для проверки /lessons/:id)

-- 5) Создать enrollment (замените <COURSE_ID> и <STUDENT_ID>)
-- INSERT INTO enrollments (id, course_id, student_id, enrolled_at, access_start, access_end, status, source, created_at, updated_at)
-- VALUES (gen_random_uuid(), '<COURSE_ID>'::UUID, '<STUDENT_ID>'::UUID, now(), now(), NULL, 'active', 'manual', now(), now())
-- ON CONFLICT (course_id, student_id) DO UPDATE
-- SET status='active', access_end=NULL, updated_at=now()
-- RETURNING id AS enrollment_id;

-- Готово! Теперь проверьте API:
-- 1) GET /me/courses
-- 2) GET /courses/<COURSE_ID>
-- 3) GET /lessons/<LESSON_ID>
