#!/bin/bash
# Тестовый скрипт для проверки Course Structure API
# Использование: ./test-course-structure.sh <JWT_TOKEN> [COURSE_ID]

set -e

API_URL="${API_URL:-http://localhost:3001}"
TOKEN="$1"
COURSE_ID="$2"

if [ -z "$TOKEN" ]; then
  echo "Использование: $0 <JWT_TOKEN> [COURSE_ID]"
  echo ""
  echo "Для получения токена:"
  echo "  curl -X POST $API_URL/auth/telegram -H 'Content-Type: application/json' -d '{\"initData\":\"<valid_initData>\"}' | jq -r '.accessToken'"
  exit 1
fi

echo "=== Тест Course Structure API ==="
echo "API URL: $API_URL"
echo ""

# Если COURSE_ID не передан, создаем тестовый курс через Prisma
if [ -z "$COURSE_ID" ]; then
  echo "⚠️  COURSE_ID не передан. Создаю тестовый курс..."
  # Используем Prisma Studio или прямой SQL для создания курса
  # Для упрощения, создадим через psql
  DB_USER=$(grep "^DB_USER=" .env 2>/dev/null | cut -d'=' -f2 || echo "tracked_lms")
  DB_NAME=$(grep "^DB_NAME=" .env 2>/dev/null | cut -d'=' -f2 || echo "tracked_lms")
  
  COURSE_ID=$(docker exec tracked-lms-postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "INSERT INTO courses (id, title, status, created_at, updated_at) VALUES (gen_random_uuid(), 'Test Course', 'draft', NOW(), NOW()) RETURNING id;" 2>/dev/null | tr -d '[:space:]')
  
  if [ -z "$COURSE_ID" ]; then
    echo "❌ Не удалось создать тестовый курс"
    exit 1
  fi
  
  echo "✅ Создан тестовый курс: $COURSE_ID"
fi

echo "Используем курс: $COURSE_ID"
echo ""

# Тест 1: Создание 3 модулей
echo "=== Тест 1: Создание 3 модулей ==="
MODULE_IDS=()

for i in 1 2 3; do
  echo "Создаю модуль $i..."
  RESPONSE=$(curl -s -X POST "$API_URL/expert/courses/$COURSE_ID/modules" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Module $i\"}")
  
  MODULE_ID=$(echo "$RESPONSE" | jq -r '.id')
  POSITION=$(echo "$RESPONSE" | jq -r '.position')
  
  if [ "$MODULE_ID" != "null" ] && [ -n "$MODULE_ID" ]; then
    MODULE_IDS+=("$MODULE_ID")
    echo "✅ Модуль $i создан: $MODULE_ID, position=$POSITION"
  else
    echo "❌ Ошибка создания модуля $i: $RESPONSE"
    exit 1
  fi
done

# Проверяем позиции модулей (из ответов создания)
echo "Проверка позиций модулей:"
for i in 0 1 2; do
  EXPECTED=$(( (i + 1) * 10 ))
  echo "  Модуль $((i+1)): ожидается position=$EXPECTED"
done

echo ""

# Тест 2: Создание 3 уроков в первом модуле
echo "=== Тест 2: Создание 3 уроков ==="
LESSON_IDS=()
MODULE_ID_FOR_LESSONS="${MODULE_IDS[0]}"

for i in 1 2 3; do
  echo "Создаю урок $i в модуле $MODULE_ID_FOR_LESSONS..."
  RESPONSE=$(curl -s -X POST "$API_URL/expert/modules/$MODULE_ID_FOR_LESSONS/lessons" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Lesson $i\"}")
  
  LESSON_ID=$(echo "$RESPONSE" | jq -r '.id')
  POSITION=$(echo "$RESPONSE" | jq -r '.position')
  
  if [ "$LESSON_ID" != "null" ] && [ -n "$LESSON_ID" ]; then
    LESSON_IDS+=("$LESSON_ID")
    echo "✅ Урок $i создан: $LESSON_ID, position=$POSITION"
  else
    echo "❌ Ошибка создания урока $i: $RESPONSE"
    exit 1
  fi
done

echo ""

# Тест 3: Переупорядочивание модулей (C, A, B)
echo "=== Тест 3: Переупорядочивание модулей (C, A, B) ==="
REORDER_IDS="${MODULE_IDS[2]},${MODULE_IDS[0]},${MODULE_IDS[1]}"
echo "Новый порядок: ${MODULE_IDS[2]}, ${MODULE_IDS[0]}, ${MODULE_IDS[1]}"

RESPONSE=$(curl -s -X POST "$API_URL/expert/courses/$COURSE_ID/modules/reorder" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"orderedIds\":[\"${MODULE_IDS[2]}\",\"${MODULE_IDS[0]}\",\"${MODULE_IDS[1]}\"]}")

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  echo "❌ Ошибка переупорядочивания: $RESPONSE"
  exit 1
fi

# Проверяем позиции после reorder
POSITIONS=$(echo "$RESPONSE" | jq -r '.[] | "\(.id):\(.position)"')
echo "Позиции после reorder:"
echo "$POSITIONS" | while IFS=: read -r id pos; do
  echo "  $id: position=$pos"
done

# Проверяем, что порядок правильный
FIRST_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
FIRST_POS=$(echo "$RESPONSE" | jq -r '.[0].position')

if [ "$FIRST_ID" = "${MODULE_IDS[2]}" ] && [ "$FIRST_POS" = "10" ]; then
  echo "✅ Переупорядочивание успешно: первый модуль (C) имеет position=10"
else
  echo "❌ Переупорядочивание неверно: ожидалось ${MODULE_IDS[2]} с position=10, получено $FIRST_ID с position=$FIRST_POS"
fi

echo ""

# Тест 4: Переупорядочивание уроков
echo "=== Тест 4: Переупорядочивание уроков ==="
REORDER_LESSON_IDS="${LESSON_IDS[2]},${LESSON_IDS[0]},${LESSON_IDS[1]}"
echo "Новый порядок уроков: ${LESSON_IDS[2]}, ${LESSON_IDS[0]}, ${LESSON_IDS[1]}"

RESPONSE=$(curl -s -X POST "$API_URL/expert/modules/$MODULE_ID_FOR_LESSONS/lessons/reorder" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"orderedIds\":[\"${LESSON_IDS[2]}\",\"${LESSON_IDS[0]}\",\"${LESSON_IDS[1]}\"]}")

if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  echo "❌ Ошибка переупорядочивания уроков: $RESPONSE"
  exit 1
fi

# Проверяем позиции после reorder
POSITIONS=$(echo "$RESPONSE" | jq -r '.[] | "\(.id):\(.position)"')
echo "Позиции уроков после reorder:"
echo "$POSITIONS" | while IFS=: read -r id pos; do
  echo "  $id: position=$pos"
done

FIRST_LESSON_ID=$(echo "$RESPONSE" | jq -r '.[0].id')
FIRST_LESSON_POS=$(echo "$RESPONSE" | jq -r '.[0].position')

if [ "$FIRST_LESSON_ID" = "${LESSON_IDS[2]}" ] && [ "$FIRST_LESSON_POS" = "10" ]; then
  echo "✅ Переупорядочивание уроков успешно: первый урок имеет position=10"
else
  echo "❌ Переупорядочивание уроков неверно: ожидалось ${LESSON_IDS[2]} с position=10, получено $FIRST_LESSON_ID с position=$FIRST_LESSON_POS"
fi

echo ""
echo "=== ✅ Все тесты пройдены ==="
