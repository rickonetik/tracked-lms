# Story 0.9 — CI pipeline — Диагностика

## Проверено

✅ **Файлы в git:**
- `package.json` - есть в test/ci-pipeline
- `turbo.json` - есть в test/ci-pipeline
- `apps/api/package.json` - есть
- `apps/webapp/package.json` - есть
- `apps/bot/package.json` - есть
- Все исходные файлы - добавлены

✅ **Последние коммиты:**
- `5b11f091` - chore: add eslint and prettier config
- `d4021c02` - chore: add complete apps and packages source code
- `0afb3c51` - chore: add all apps and packages source files
- `ef1fe67f` - chore: add apps and packages package.json files
- `eaa7b568` - chore: add core project files
- `0e66f0ed` - chore: add package.json

## Возможные причины

1. **CI не перезапустился** - нужно обновить страницу PR
2. **В main нет файлов** - CI может чекаутить main + изменения, а не всю ветку
3. **Кэш CI** - возможно используется старый кэш

## Что нужно сделать

1. **Обновить страницу PR** в браузере (Ctrl+F5 или Cmd+Shift+R)
2. **Проверить что CI перезапустился** (должна быть новая дата/время)
3. **Открыть логи нового CI run** и посмотреть ошибки
4. **Прислать новые логи** если ошибки изменились

## Альтернативное решение

Если проблема в том, что в main нет файлов, можно:
1. Добавить файлы в main
2. Или изменить CI чтобы он чекаутил всю ветку test/ci-pipeline

**Проверьте логи нового CI run после обновления страницы!**
