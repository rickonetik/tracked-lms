# Правила позиционирования модулей и уроков

## Общие принципы

### Шаг позиции
- **Шаг позиции = 10**
- Все позиции кратны 10: 10, 20, 30, 40, ...
- Это позволяет вставлять элементы между существующими без полной переиндексации

### Создание элементов
- При создании модуля или урока позиция автоматически устанавливается как `max(position) + 10`
- Если элементов нет, первая позиция = 10
- **Запрещено присваивать позиции вручную из UI**

### Переупорядочивание (Reorder)

#### Двухфазное обновление
Переупорядочивание выполняется в транзакции с двумя фазами для избежания unique constraint конфликтов:

1. **Фаза 1**: Все позиции устанавливаются в отрицательные значения
   - Первый элемент: `-10`
   - Второй элемент: `-20`
   - И т.д.

2. **Фаза 2**: Позиции устанавливаются в правильные положительные значения
   - Первый элемент: `10`
   - Второй элемент: `20`
   - И т.д.

#### Пример
Исходный порядок модулей: A (position=10), B (position=20), C (position=30)

Запрос на reorder: `["C", "A", "B"]`

**Фаза 1:**
- C: position = -10
- A: position = -20
- B: position = -30

**Фаза 2:**
- C: position = 10
- A: position = 20
- B: position = 30

**Результат:** C=10, A=20, B=30

#### Валидация
- **Дубликаты ID**: `orderedIds` не должен содержать повторяющиеся ID
  - Если есть дубликаты → `400 Bad Request` с ошибкой `DUPLICATE_IDS`
- **Все ID должны существовать**: Все ID из `orderedIds` должны существовать и принадлежать курсу/модулю
  - Если ID не найден или принадлежит другому курсу/модулю → `400 Bad Request` с ошибкой `FOREIGN_ID`
- **Полнота списка**: Все элементы курса/модуля должны быть включены в `orderedIds`
  - Если не все элементы включены → `400 Bad Request` с ошибкой `MISSING_IDS`

## API Endpoints

### Создание модуля
```
POST /expert/courses/:courseId/modules
Body: { title: string, description?: string }
```

### Создание урока
```
POST /expert/modules/:moduleId/lessons
Body: { title: string, description?: string }
```

### Переупорядочивание модулей
```
POST /expert/courses/:courseId/modules/reorder
Body: { orderedIds: string[] }
```

### Переупорядочивание уроков
```
POST /expert/modules/:moduleId/lessons/reorder
Body: { orderedIds: string[] }
```

## Ограничения

- ❌ Не используйте drag-and-drop UI (не входит в scope этого PR)
- ❌ Не добавляйте новые поля в БД
- ❌ Не меняйте уникальные индексы
- ❌ Не добавляйте RBAC роли (только `JwtAuthGuard`)
- ✅ Используйте только шаг 10 + двухфазное обновление

## Негативные тесты (обязательные для проверки)

### 1. Дубликаты ID (Duplicate IDs)
**Тест:**
```bash
POST /expert/courses/:courseId/modules/reorder
Body: { "orderedIds": ["id1", "id1", "id2"] }
```
**Ожидаемо:** `400 Bad Request` с ошибкой:
```json
{
  "message": "Duplicate IDs found in orderedIds",
  "error": "DUPLICATE_IDS",
  "statusCode": 400
}
```

### 2. Отсутствующие ID (Missing IDs)
**Тест:**
```bash
POST /expert/courses/:courseId/modules/reorder
Body: { "orderedIds": ["id1", "id2"] }  # если в курсе 3 модуля
```
**Ожидаемо:** `400 Bad Request` с ошибкой:
```json
{
  "message": "OrderedIds must contain all modules from course. Expected 3, got 2",
  "error": "MISSING_IDS",
  "statusCode": 400
}
```

### 3. Чужие ID (Foreign IDs)
**Тест:**
```bash
POST /expert/courses/:courseId/modules/reorder
Body: { "orderedIds": ["id1", "id-from-another-course", "id2"] }
```
**Ожидаемо:** `400 Bad Request` с ошибкой:
```json
{
  "message": "Module with id <id-from-another-course> not found in course <courseId>",
  "error": "FOREIGN_ID",
  "statusCode": 400
}
```

**Аналогичные тесты применяются к `reorderLessons`.**
