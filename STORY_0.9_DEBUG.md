# Story 0.9 — CI pipeline — Отладка

## Текущая ситуация

Все 3 CI jobs всё ещё проваливаются:
- ❌ CI / Build (pull_request): Failed after 12 seconds
- ❌ CI / Lint (pull_request): Failed after 16 seconds
- ❌ CI / TypeCheck (pull_request): Failed after 11 seconds

## Что нужно проверить

### 1. Проверить логи каждого job

Откройте PR и нажмите на каждый провалившийся job, чтобы увидеть логи:
- https://github.com/rickonetik/tracked-lms/pull/1

### 2. Возможные причины

1. **Файлы проекта не закоммичены** - но это маловероятно, так как Lint и TypeCheck раньше проходили
2. **Проблема с npm install** - возможно нет package.json или он повреждён
3. **Проблема с командами** - возможно npm run lint/typecheck/build не работают
4. **Проблема с turbo** - возможно turbo не установлен или не работает

### 3. Что проверить в логах

Откройте логи каждого job и найдите строки с "Error" или "Failed". Обычно ошибки находятся в:
- Шаге "Install dependencies"
- Шаге "Run lint/typecheck/build"

## Следующие шаги

1. **Откройте логи CI** в PR
2. **Скопируйте ошибки** из логов
3. **Пришлите мне** - я помогу исправить

**Важно:** Без логов ошибок сложно понять точную причину. Нужны логи из GitHub Actions.
