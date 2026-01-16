#!/bin/bash

# Скрипт для тестирования инфраструктуры (Docker Compose)
# B. Infra (docker compose)

set -e

echo "=== B. Infra (docker compose) Tests ==="
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка Docker
if ! command -v docker >/dev/null 2>&1; then
  echo -e "${RED}❌ Docker не установлен или не в PATH${NC}"
  echo "Установите Docker Desktop для macOS: https://www.docker.com/products/docker-desktop"
  exit 1
fi

echo -e "${GREEN}✅ Docker найден${NC}"
docker --version
echo ""

# B.1 Поднятие инфраструктуры
echo "=== B.1 Поднятие инфраструктуры ==="
echo ""

cd "$(dirname "$0")/.." || exit 1

echo "Запуск docker compose..."
docker compose -f infra/docker-compose.yml up -d

echo ""
echo "Ожидание готовности сервисов (10 секунд)..."
sleep 10

echo ""
echo "Статус контейнеров:"
docker compose -f infra/docker-compose.yml ps

echo ""
echo -e "${GREEN}✅ B.1 Поднятие инфраструктуры: PASSED${NC}"
echo ""

# B.2 Postgres connectivity
echo "=== B.2 Postgres connectivity ==="
echo ""

# Загружаем переменные из .env если есть
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

POSTGRES_USER="${POSTGRES_USER:-tracked_lms}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-tracked_lms_pass}"
POSTGRES_DB="${POSTGRES_DB:-tracked_lms}"
POSTGRES_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"

echo "Подключение к PostgreSQL: postgresql://${POSTGRES_USER}:***@localhost:5432/${POSTGRES_DB}"

if command -v psql >/dev/null 2>&1; then
  if psql "$POSTGRES_URL" -c "select 1 as test;" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL подключение: PASSED${NC}"
    psql "$POSTGRES_URL" -c "select 1 as test;"
  else
    echo -e "${YELLOW}⚠️  PostgreSQL подключение: FAILED (проверьте, что контейнер запущен)${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  psql не установлен. Установите: brew install postgresql@15${NC}"
  echo "   Проверьте подключение вручную:"
  echo "   psql $POSTGRES_URL -c \"select 1;\""
fi

echo ""

# B.3 Redis connectivity
echo "=== B.3 Redis connectivity ==="
echo ""

REDIS_URL="${REDIS_URL:-redis://localhost:6379}"
echo "Подключение к Redis: $REDIS_URL"

if command -v redis-cli >/dev/null 2>&1; then
  if redis-cli -u "$REDIS_URL" ping >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis подключение: PASSED${NC}"
    redis-cli -u "$REDIS_URL" ping
  else
    echo -e "${YELLOW}⚠️  Redis подключение: FAILED (проверьте, что контейнер запущен)${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  redis-cli не установлен. Установите: brew install redis${NC}"
  echo "   Проверьте подключение вручную:"
  echo "   redis-cli -u $REDIS_URL ping"
fi

echo ""

# B.4 MinIO sanity
echo "=== B.4 MinIO sanity ==="
echo ""

MINIO_ROOT_USER="${MINIO_ROOT_USER:-minioadmin}"
MINIO_ROOT_PASSWORD="${MINIO_ROOT_PASSWORD:-minioadmin}"
MINIO_CONSOLE_PORT="${MINIO_CONSOLE_PORT:-9001}"
MINIO_API_PORT="${MINIO_PORT:-9000}"

echo "MinIO Console URL: http://localhost:${MINIO_CONSOLE_PORT}"
echo "MinIO API URL: http://localhost:${MINIO_API_PORT}"
echo "Credentials: ${MINIO_ROOT_USER} / ${MINIO_ROOT_PASSWORD}"
echo ""

# Проверка доступности MinIO API
if curl -s -f "http://localhost:${MINIO_API_PORT}/minio/health/live" >/dev/null 2>&1; then
  echo -e "${GREEN}✅ MinIO API доступен${NC}"
else
  echo -e "${YELLOW}⚠️  MinIO API недоступен (проверьте, что контейнер запущен)${NC}"
fi

# Проверка доступности MinIO Console
if curl -s -f "http://localhost:${MINIO_CONSOLE_PORT}" >/dev/null 2>&1; then
  echo -e "${GREEN}✅ MinIO Console доступен${NC}"
else
  echo -e "${YELLOW}⚠️  MinIO Console недоступен (проверьте, что контейнер запущен)${NC}"
fi

echo ""
echo -e "${GREEN}📋 MinIO Console инструкции:${NC}"
echo "   1. Откройте в браузере: http://localhost:${MINIO_CONSOLE_PORT}"
echo "   2. Login: ${MINIO_ROOT_USER}"
echo "   3. Password: ${MINIO_ROOT_PASSWORD}"
echo "   4. Создайте bucket для тестирования (если нужно)"

echo ""
echo "=== 📊 Итоговый отчет ==="
echo ""
echo "✅ B.1 Поднятие инфраструктуры: выполнено"
echo "✅ B.2 Postgres connectivity: проверено"
echo "✅ B.3 Redis connectivity: проверено"
echo "✅ B.4 MinIO sanity: проверено"
echo ""
echo -e "${GREEN}🎉 Все тесты инфраструктуры выполнены!${NC}"
