#!/bin/bash
# E2E тест для Story 4.5 — Admin API: set subscription status
# Использование: ./scripts/test-admin-subscriptions.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$SCRIPT_DIR/.."
ROOT_DIR="$SCRIPT_DIR/../.."

cd "$ROOT_DIR"

echo "=== Story 4.5 E2E Test: Admin Subscriptions ==="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

test_pass() {
  echo -e "${GREEN}✅ PASS${NC}: $1"
  ((PASS_COUNT++))
}

test_fail() {
  echo -e "${RED}❌ FAIL${NC}: $1"
  ((FAIL_COUNT++))
}

# Проверка preconditions
echo "=== Preconditions ==="
if ! command -v jq &> /dev/null; then
  test_fail "jq не установлен"
  exit 1
fi
test_pass "jq установлен"

if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
  test_fail "API не запущен на localhost:3001"
  exit 1
fi
test_pass "API запущен"

# Запуск seed
echo ""
echo "=== 1. Seed expert account ==="
cd "$API_DIR"
SEED_OUTPUT=$(SEED_OWNER_USER_ID=$(docker exec tracked-lms-postgres psql -U tracked_lms -d tracked_lms -t -c "SELECT id FROM users LIMIT 1;" | xargs) \
  SEED_EXPERT_SLUG="expert-e2e-test" \
  SEED_EXPERT_NAME="Expert E2E Test" \
  pnpm seed:dev 2>&1)

OWNER_USER_ID=$(echo "$SEED_OUTPUT" | grep -oE '"ownerUserId":"[^"]+"' | cut -d'"' -f4 | head -1)
EXPERT_ACCOUNT_ID=$(echo "$SEED_OUTPUT" | grep -oE '"expertAccountId":"[^"]+"' | cut -d'"' -f4 | head -1)

if [ -z "$OWNER_USER_ID" ] || [ -z "$EXPERT_ACCOUNT_ID" ]; then
  test_fail "Не удалось извлечь OWNER_USER_ID или EXPERT_ACCOUNT_ID из seed"
  exit 1
fi

test_pass "Seed выполнен: OWNER_USER_ID=$OWNER_USER_ID, EXPERT_ACCOUNT_ID=$EXPERT_ACCOUNT_ID"

# Генерация токенов
echo ""
echo "=== 2. Генерация JWT токенов ==="
PLATFORM_ADMIN_TOKEN=$(node generate-test-token.js "$OWNER_USER_ID" 2>&1 | tail -1)
STUDENT_USER_ID=$(docker exec tracked-lms-postgres psql -U tracked_lms -d tracked_lms -t -c "SELECT id FROM users WHERE first_name = 'Student' ORDER BY created_at DESC LIMIT 1;" | xargs)
if [ -z "$STUDENT_USER_ID" ]; then
  STUDENT_USER_ID=$(docker exec tracked-lms-postgres psql -U tracked_lms -d tracked_lms -t -c "INSERT INTO users (id, first_name, status, created_at, updated_at) VALUES (gen_random_uuid()::text, 'Student', 'active', now(), now()) RETURNING id;" | xargs)
fi
STUDENT_TOKEN=$(node generate-test-token.js "$STUDENT_USER_ID" 2>&1 | tail -1)

test_pass "Токены сгенерированы"

API="http://localhost:3001"

# Тест A: 401 без токена
echo ""
echo "=== Тест A: 401 без токена ==="
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API/admin/subscriptions/$EXPERT_ACCOUNT_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","plan":"manual_mvp"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
  test_pass "Тест A: 401 без токена"
else
  test_fail "Тест A: ожидался 401, получен $HTTP_CODE"
fi

# Тест B: 403 без platform роли
echo ""
echo "=== Тест B: 403 без platform роли ==="
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API/admin/subscriptions/$EXPERT_ACCOUNT_ID/status" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","plan":"manual_mvp"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)
if [ "$HTTP_CODE" = "403" ] && echo "$BODY" | jq -e '.error == "PLATFORM_ROLE_REQUIRED"' > /dev/null 2>&1; then
  test_pass "Тест B: 403 без platform роли"
else
  test_fail "Тест B: ожидался 403 PLATFORM_ROLE_REQUIRED, получен $HTTP_CODE"
fi

# Тест C: 404 EXPERT_ACCOUNT_NOT_FOUND
echo ""
echo "=== Тест C: 404 EXPERT_ACCOUNT_NOT_FOUND ==="
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API/admin/subscriptions/00000000-0000-0000-0000-000000000000/status" \
  -H "Authorization: Bearer $PLATFORM_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","plan":"manual_mvp"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)
if [ "$HTTP_CODE" = "404" ] && echo "$BODY" | jq -e '.error == "EXPERT_ACCOUNT_NOT_FOUND"' > /dev/null 2>&1; then
  test_pass "Тест C: 404 EXPERT_ACCOUNT_NOT_FOUND"
else
  test_fail "Тест C: ожидался 404 EXPERT_ACCOUNT_NOT_FOUND, получен $HTTP_CODE"
fi

# Тест D: set expired → /expert/me == 403
echo ""
echo "=== Тест D: set expired → /expert/me == 403 ==="
curl -s -X POST "$API/admin/subscriptions/$EXPERT_ACCOUNT_ID/status" \
  -H "Authorization: Bearer $PLATFORM_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"expired","plan":"manual_mvp"}' > /dev/null

sleep 1

RESPONSE=$(curl -s -w "\n%{http_code}" "$API/expert/me" -H "Authorization: Bearer $PLATFORM_ADMIN_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)
if [ "$HTTP_CODE" = "403" ] && echo "$BODY" | jq -e '.error == "SUBSCRIPTION_INACTIVE"' > /dev/null 2>&1; then
  test_pass "Тест D: set expired → /expert/me == 403"
else
  test_fail "Тест D: ожидался 403 SUBSCRIPTION_INACTIVE, получен $HTTP_CODE"
fi

# Тест E: restore active → /expert/me == 200
echo ""
echo "=== Тест E: restore active → /expert/me == 200 ==="
curl -s -X POST "$API/admin/subscriptions/$EXPERT_ACCOUNT_ID/status" \
  -H "Authorization: Bearer $PLATFORM_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","plan":"manual_mvp","currentPeriodEnd":null}' > /dev/null

sleep 1

RESPONSE=$(curl -s -w "\n%{http_code}" "$API/expert/me" -H "Authorization: Bearer $PLATFORM_ADMIN_TOKEN")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -1)
if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | jq -e '.expertAccount.id' > /dev/null 2>&1; then
  test_pass "Тест E: restore active → /expert/me == 200"
else
  test_fail "Тест E: ожидался 200, получен $HTTP_CODE"
fi

# Тест F: INVALID_CURRENT_PERIOD_END
echo ""
echo "=== Тест F: INVALID_CURRENT_PERIOD_END ==="
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API/admin/subscriptions/$EXPERT_ACCOUNT_ID/status" \
  -H "Authorization: Bearer $PLATFORM_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"active","plan":"manual_mvp","currentPeriodEnd":"not-a-date"}')
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "400" ]; then
  test_pass "Тест F: INVALID_CURRENT_PERIOD_END (400)"
else
  test_fail "Тест F: ожидался 400, получен $HTTP_CODE"
fi

# Тест G: Авто-currentPeriodEnd для canceled
echo ""
echo "=== Тест G: Авто-currentPeriodEnd для canceled ==="
RESPONSE=$(curl -s -X POST "$API/admin/subscriptions/$EXPERT_ACCOUNT_ID/status" \
  -H "Authorization: Bearer $PLATFORM_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"canceled","plan":"manual_mvp"}')
CURRENT_PERIOD_END=$(echo "$RESPONSE" | jq -r '.subscription.currentPeriodEnd')
if [ "$CURRENT_PERIOD_END" != "null" ] && [ -n "$CURRENT_PERIOD_END" ]; then
  test_pass "Тест G: Авто-currentPeriodEnd для canceled"
else
  test_fail "Тест G: currentPeriodEnd должен быть установлен автоматически"
fi

# Итоговый отчет
echo ""
echo "=== Итоговый отчет ==="
echo -e "${GREEN}Пройдено: $PASS_COUNT${NC}"
echo -e "${RED}Провалено: $FAIL_COUNT${NC}"

if [ $FAIL_COUNT -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ Story 4.5 acceptance: OK${NC}"
  exit 0
else
  echo ""
  echo -e "${RED}❌ Story 4.5 acceptance: FAIL${NC}"
  exit 1
fi
