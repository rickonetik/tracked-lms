# Release v0.4 — Expert Management (Epic 4)

## Обзор

Реализована система управления экспертами с подписками, RBAC и UI для экспертского кабинета. Добавлены админ-эндпоинты для управления подписками и seed-скрипт для быстрого создания тестовых данных.

## Stories

### Story 4.1 — DB: expert_accounts + expert_members + subscriptions
**PR:** `feat/api-db-expert-subscription`

**Цель:** Экспертские сущности + подписка.

**Scope:** только db.

**Сделано:**
- Созданы 3 таблицы: `expert_accounts`, `expert_members`, `subscriptions`
- Добавлены enum типы: `ExpertMemberRole` (owner, manager, reviewer), `SubscriptionStatus` (active, expired, canceled), `SubscriptionPlan` (manual_mvp)
- Настроены индексы для оптимизации запросов
- Добавлены foreign key constraints и unique constraints

**DoD:** ✅ Миграция применима, все таблицы созданы корректно.

**Артефакты:**
- Миграция: `20260117051837_add_expert_accounts_members_subscriptions/migration.sql`
- Schema: `apps/api/prisma/schema.prisma` (модели ExpertAccount, ExpertMember, Subscription)

---

### Story 4.2 — API: RBAC roles base (platform + expert)
**PR:** `feat/api-rbac-base`

**Цель:** Единый RBAC слой.

**Scope:** common/rbac, guards.

**Сделано:**
- Созданы enum типы: `PlatformRole` (OWNER, ADMIN, MODERATOR), `ExpertRole` (OWNER, MANAGER, REVIEWER)
- Реализованы декораторы: `@RequirePlatformRole`, `@RequireExpertRole`
- Реализованы guards: `PlatformRolesGuard`, `ExpertRolesGuard`
- Добавлен временный тестовый модуль `rbac-test` для проверки работы guards

**DoD:** ✅ Можно защищать endpoints через декораторы и guards.

**Артефакты:**
- Файлы: `apps/api/src/common/rbac/**/*`
- Тестовые endpoints: `/rbac-test/platform-only`, `/rbac-test/expert-only/:expertAccountId`
- Curl примеры: 401, 403 с error codes (PLATFORM_ROLE_REQUIRED, EXPERT_MEMBERSHIP_REQUIRED, EXPERT_ROLE_REQUIRED)

**Примечание:** `PlatformRolesGuard` временно использует `PLATFORM_OWNER_IDS` env переменную (TODO: заменить на запрос к БД в Story 4.X).

---

### Story 4.3 — API: GET /expert/me (gate membership + subscription active)
**PR:** `feat/api-expert-me`

**Цель:** Экспертский кабинет доступен только при active subscription.

**Scope:** expert module.

**Сделано:**
- Реализован endpoint `GET /expert/me`
- Добавлен gate: проверка membership (404 `EXPERT_NOT_FOUND`) и активной подписки (403 `SUBSCRIPTION_INACTIVE`)
- Реализован детерминированный выбор expert account при нескольких memberships (OWNER first, затем по приоритету роли, затем по createdAt)
- Реализован детерминированный выбор активной подписки (NULLS FIRST, затем createdAt DESC)
- Добавлены DTO с полной типизацией и Swagger документацией

**DoD:** ✅ Gate работает корректно, все состояния обрабатываются.

**Артефакты:**
- Endpoint: `GET /expert/me`
- Curl примеры: 401, 404, 403, 200 с полными данными
- Файлы: `apps/api/src/modules/expert/**/*`

**Проверено:**
- ✅ 404 vs 403 порядок (сначала membership, потом subscription)
- ✅ Predicate "active subscription" совпадает с seed и gate
- ✅ Детерминированность выбора при нескольких активных подписках
- ✅ Permissions поле стабильное и корректное

---

### Story 4.4 — Admin seed script: create expert_account manually
**PR:** `chore/api-seed-expert-account`

**Цель:** Быстро создавать тестового эксперта.

**Scope:** только seed/cli.

**Сделано:**
- Создан CLI скрипт `apps/api/src/cli/seed-dev.ts`
- Реализована идемпотентная логика для всех сущностей (user, expert_account, expert_member, subscription)
- Добавлена команда `pnpm --filter api seed:dev`
- Обновлена документация в `apps/api/README.md`

**DoD:** ✅ Seed идемпотентен, можно запускать многократно без дублей.

**Артефакты:**
- Скрипт: `apps/api/src/cli/seed-dev.ts`
- Команда: `pnpm --filter api seed:dev`
- Вывод: JSON summary с созданными/переиспользованными ID
- README: полная документация с примерами

**Переменные окружения:**
- `SEED_OWNER_USER_ID` (приоритет 1) или `SEED_TELEGRAM_ID` (приоритет 2)
- `SEED_EXPERT_SLUG` (default: `dev-expert`)
- `SEED_EXPERT_NAME` (default: `Dev Expert`)
- `SEED_SUBSCRIPTION_END` (optional, ISO string)

---

### Story 4.5 — Admin API: set subscription status
**PR:** `feat/api-admin-subscription-status`

**Цель:** Ручное управление подпиской.

**Scope:** admin module.

**Сделано:**
- Реализован endpoint `POST /admin/subscriptions/:expertAccountId/status`
- Добавлена защита через `@RequirePlatformRole(OWNER, ADMIN)`
- Реализована логика создания новой subscription (history append-only, никогда не обновляет существующую)
- Добавлена валидация DTO с правильными error codes
- Реализован автоматический `currentPeriodEnd` для expired/canceled
- Добавлен E2E тест-скрипт `apps/api/scripts/test-admin-subscriptions.sh`

**DoD:** ✅ Только PlatformOwner/Admin, создание новой записи (не update), audit поля в ответе.

**Артефакты:**
- Endpoint: `POST /admin/subscriptions/:expertAccountId/status`
- Curl примеры: все сценарии (401, 403, 404, 400, 200)
- E2E скрипт: `apps/api/scripts/test-admin-subscriptions.sh`
- Файлы: `apps/api/src/modules/admin-subscriptions/**/*`

**Проверено:**
- ✅ Детерминированный выбор активной подписки при нескольких "active"
- ✅ Контракт ошибок ValidationPipe (стандартный Nest формат)
- ✅ Нормализация reason (TODO для Story 8.2)
- ✅ Обновление plan работает корректно
- ✅ Edge-case: currentPeriodEnd в прошлом при status=active
- ✅ Нагрузочный sanity (15 запросов, history append-only)

---

### Story 4.6 — WebApp: ExpertPage (GET /expert/me gate UI)
**PR:** `feat/webapp-expert-page-gate`

**Цель:** UI для экспертского кабинета с обработкой всех состояний.

**Scope:** webapp expert feature.

**Сделано:**
- Создан service `expertService.getMe()` с типизацией
- Реализована страница `ExpertPage` с 6 состояниями (loading, unauthorized, not_found, subscription_inactive, error, ready)
- Добавлена обработка всех ошибок по паттерну из CoursePage/LessonPage
- Реализована защита от StrictMode double-invoke через `isFetchingRef`
- Реализована защита от unmount через `isMountedRef`
- Добавлены стили и навигация

**DoD:** ✅ Все состояния отображаются корректно, кнопки работают.

**Артефакты:**
- Страница: `apps/webapp/src/pages/ExpertPage.tsx`
- Service: `apps/webapp/src/services/expert.service.ts`
- Стили: `apps/webapp/src/pages/ExpertPage.css`
- Роут: `/expert` (уже был подключен)

**UI состояния:**
- 401 → "Требуется авторизация" + кнопка "Обновить"
- 404 `EXPERT_NOT_FOUND` → "Станьте экспертом" + кнопки "В обучение" и "Обновить"
- 403 `SUBSCRIPTION_INACTIVE` → "Подписка неактивна" + кнопки "Назад" и "Обновить"
- 200 → "Экспертский кабинет" с данными (slug, role, subscription, permissions)

**Проверено:**
- ✅ Контракт ответа 200: nullable/undefined поля обрабатываются безопасно
- ✅ Точное различение 403: только `SUBSCRIPTION_INACTIVE`, другие 403 → generic error
- ✅ 404 только по errorCode: только `EXPERT_NOT_FOUND`, другие 404 → generic error
- ✅ StrictMode: двойной вызов отрезан
- ✅ Нет "setState on unmounted component"
- ✅ Навигация работает с fallback на `/learning`

---

## Технические детали

### База данных
- PostgreSQL с Prisma ORM
- 3 новые таблицы с полной схемой отношений
- Индексы для оптимизации запросов

### API
- NestJS с Fastify
- JWT авторизация
- RBAC guards и декораторы
- Swagger документация

### WebApp
- React с TypeScript
- React Router для навигации
- Единый API client с обработкой ошибок

### Тестирование
- E2E скрипт для admin subscriptions
- Acceptance тесты для всех stories
- Ручное тестирование всех сценариев

---

## Миграция

Для применения изменений:

```bash
# Применить миграции
pnpm --filter api prisma migrate deploy

# Сгенерировать Prisma Client
pnpm --filter api prisma generate
```

---

## Переменные окружения

Добавлены новые переменные:
- `PLATFORM_OWNER_IDS` - список user ID для platform owners (временно, до Story 4.X)
- `SEED_OWNER_USER_ID` / `SEED_TELEGRAM_ID` - для seed скрипта
- `SEED_EXPERT_SLUG` / `SEED_EXPERT_NAME` - для seed скрипта
- `SEED_SUBSCRIPTION_END` - для seed скрипта (optional)

---

## Известные ограничения

1. **Platform roles** - временно через env переменную `PLATFORM_OWNER_IDS` (TODO: Story 4.X)
2. **Validation errors** - стандартный Nest формат (TODO: единый контракт в Story 8.2 или mini-story)
3. **Reason field** - не валидируется (TODO: Story 8.2 с audit)
4. **Onboarding** - нет формы заявки на эксперта (TODO: Story 4.X)

---

## Следующие шаги

- Story 4.7+ (если планируются): дополнительные функции для экспертов
- Story 8.2: полноценный audit log с reason
- Улучшение UX: изменение текста 404 на более понятный

---

## Команды для тестирования

```bash
# Seed эксперта
pnpm --filter api seed:dev

# E2E тест admin subscriptions
./apps/api/scripts/test-admin-subscriptions.sh

# Проверка ExpertPage
# Открыть http://localhost:5173/expert в браузере
```
