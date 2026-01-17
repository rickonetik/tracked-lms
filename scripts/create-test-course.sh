#!/bin/bash
# Скрипт для создания тестового курса в БД для ручного тестирования Mini App
# Использование: ./scripts/create-test-course.sh <STUDENT_ID> [TOKEN]

set -e

STUDENT_ID="$1"
TOKEN="$2"

if [ -z "$STUDENT_ID" ]; then
  echo "❌ Ошибка: требуется STUDENT_ID"
  echo ""
  echo "Использование:"
  echo "  ./scripts/create-test-course.sh <STUDENT_ID> [TOKEN]"
  echo ""
  echo "Чтобы получить STUDENT_ID:"
  echo "  1. Открой Mini App в Telegram"
  echo "  2. Выполни: curl -s http://localhost:3001/auth/me -H \"Authorization: Bearer <TOKEN>\" | jq -r '.id'"
  echo "  3. Или вручную скопируй id из ответа"
  exit 1
fi

echo "🔍 Проверка инфраструктуры..."
if ! docker ps | grep -q "tracked-lms-postgres"; then
  echo "❌ PostgreSQL контейнер не запущен. Запусти: docker-compose up -d"
  exit 1
fi

echo "✅ PostgreSQL контейнер запущен"
echo ""

# Если передан токен, попробуем получить userId автоматически
if [ -n "$TOKEN" ]; then
  echo "🔍 Получение userId из /auth/me..."
  USER_ID=$(curl -s http://localhost:3001/auth/me \
    -H "Authorization: Bearer $TOKEN" | jq -r '.id // empty')
  
  if [ -n "$USER_ID" ] && [ "$USER_ID" != "null" ]; then
    echo "✅ Получен userId: $USER_ID"
    if [ "$USER_ID" != "$STUDENT_ID" ]; then
      echo "⚠️  Внимание: переданный STUDENT_ID ($STUDENT_ID) не совпадает с userId из API ($USER_ID)"
      read -p "Использовать userId из API? (y/n) " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        STUDENT_ID="$USER_ID"
      fi
    fi
  else
    echo "⚠️  Не удалось получить userId из API, используем переданный STUDENT_ID: $STUDENT_ID"
  fi
fi

echo ""
echo "📝 Создание тестовых данных для student_id: $STUDENT_ID"
echo ""

# SQL скрипт
SQL_SCRIPT=$(cat <<EOF
-- 1) Создать topic
DO \$\$
DECLARE
  v_topic_id UUID;
  v_course_id UUID;
  v_module_id UUID;
  v_lesson1_id UUID;
  v_lesson2_id UUID;
  v_enrollment_id UUID;
BEGIN
  -- Topic
  INSERT INTO topics (id, name, description, created_at, updated_at)
  VALUES (gen_random_uuid(), 'Test Topic MiniApp', 'seed topic for manual testing', now(), now())
  ON CONFLICT (name) DO UPDATE SET updated_at = EXCLUDED.updated_at
  RETURNING id INTO v_topic_id;
  
  RAISE NOTICE '✅ Topic создан: %', v_topic_id;
  
  -- Course
  INSERT INTO courses (id, title, description, topic_id, status, created_at, updated_at)
  VALUES (gen_random_uuid(), 'MiniApp Test Course', 'Course for Telegram Mini App manual testing', v_topic_id, 'published', now(), now())
  RETURNING id INTO v_course_id;
  
  RAISE NOTICE '✅ Course создан: %', v_course_id;
  
  -- Module
  INSERT INTO modules (id, course_id, title, description, position, created_at, updated_at)
  VALUES (gen_random_uuid(), v_course_id, 'Module 1', 'First module for testing', 10, now(), now())
  RETURNING id INTO v_module_id;
  
  RAISE NOTICE '✅ Module создан: %', v_module_id;
  
  -- Lessons
  INSERT INTO lessons (id, module_id, title, description, position, created_at, updated_at)
  VALUES
    (gen_random_uuid(), v_module_id, 'Lesson 1', 'First lesson with description', 10, now(), now()),
    (gen_random_uuid(), v_module_id, 'Lesson 2', null, 20, now(), now())
  RETURNING id INTO v_lesson1_id, v_lesson2_id;
  
  RAISE NOTICE '✅ Lessons созданы: % (с описанием), % (без описания)', v_lesson1_id, v_lesson2_id;
  
  -- Enrollment
  INSERT INTO enrollments (id, course_id, student_id, enrolled_at, access_start, access_end, status, source, created_at, updated_at)
  VALUES (gen_random_uuid(), v_course_id, '$STUDENT_ID'::UUID, now(), now(), NULL, 'active', 'manual', now(), now())
  ON CONFLICT (course_id, student_id) DO UPDATE
  SET status='active', access_end=NULL, updated_at=now()
  RETURNING id INTO v_enrollment_id;
  
  RAISE NOTICE '✅ Enrollment создан: %', v_enrollment_id;
  
  -- Выводим итоговую информацию
  RAISE NOTICE '';
  RAISE NOTICE '📋 Итоговые ID для проверки:';
  RAISE NOTICE '  Course ID: %', v_course_id;
  RAISE NOTICE '  Module ID: %', v_module_id;
  RAISE NOTICE '  Lesson 1 ID: %', v_lesson1_id;
  RAISE NOTICE '  Lesson 2 ID: %', v_lesson2_id;
  RAISE NOTICE '  Enrollment ID: %', v_enrollment_id;
END \$\$;
EOF
)

echo "Выполнение SQL..."
OUTPUT=$(docker exec tracked-lms-postgres psql -U tracked_lms -d tracked_lms <<< "$SQL_SCRIPT" 2>&1)
echo "$OUTPUT" | grep -E "(NOTICE|ERROR)" || echo "$OUTPUT"

echo ""
echo "✅ Тестовые данные созданы!"
echo ""
echo "📋 Для проверки API выполни:"
echo ""
echo "1) Проверка /me/courses:"
echo "   curl -s http://localhost:3001/me/courses \\"
echo "     -H \"Authorization: Bearer <TOKEN>\" | jq"
echo ""
echo "2) Проверка /courses/:id (замени <COURSE_ID> из вывода выше):"
echo "   curl -s http://localhost:3001/courses/<COURSE_ID> \\"
echo "     -H \"Authorization: Bearer <TOKEN>\" | jq"
echo ""
echo "3) Проверка /lessons/:id (замени <LESSON_ID> из вывода выше):"
echo "   curl -s http://localhost:3001/lessons/<LESSON_ID> \\"
echo "     -H \"Authorization: Bearer <TOKEN>\" | jq"
echo ""
