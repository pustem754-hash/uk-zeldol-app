# v13.2 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: РЕАЛЬНО ШИРОКИЙ ЭКРАН

## Проблема:
- Экран был узкий, контент зажат по центру
- Страница /bundle (Всё сразу) вообще не существовала
- Предыдущие исправления не помогли

## Решение:

### 1. Создана страница /bundle (Всё сразу)
- **src/app/bundle/page.tsx** — полностью новая страница
- Форма: Товар, Бренд, Материал — все поля на 100% ширины
- Кнопки маркетплейсов (Wildberries/Ozon) — grid layout, большие
- Карточка пакета справа (на xl экранах)
- Кнопка "Запустить пакет" на всю ширину

### 2. Обновлён Sidebar
- Добавлены ВСЕ навигационные пункты из дизайна
- "Всё сразу" подсвечивается фиолетовым
- Версия обновлена до v13.2

### 3. Удалены ВСЕ max-width ограничения
- **layout.tsx**: убран `max-w-none` (был лишним), оставлен чистый `flex-1 w-full`
- **globals.css**: добавлен `max-width: none !important` на `main` и дочерние элементы
- **page.tsx**: убран `max-w-none`
- **history/page.tsx**: убран `max-w-none`
- **VideoMaster.tsx**: убран `max-w-none`, кнопки маркетплейсов увеличены

### 4. CSS Force-Wide
```css
main { max-width: none !important; width: 100% !important; }
main > div, main > section { max-width: none !important; }
```

## Изменённые файлы:
- `src/app/globals.css` — force-wide CSS
- `src/app/layout.tsx` — чистый wide layout
- `src/app/bundle/page.tsx` — НОВЫЙ (Всё сразу)
- `src/app/page.tsx` — убран max-w
- `src/app/history/page.tsx` — убран max-w
- `src/components/Sidebar.tsx` — полное обновление навигации
- `src/components/VideoMaster.tsx` — большие кнопки маркетплейсов

## Результат:
- ✅ Build: SUCCESS
- ✅ Deploy: SUCCESS
- ✅ /bundle страница работает
- ✅ Контент на 100% ширины
- ✅ Кнопки маркетплейсов большие
- ✅ Поля ввода растянуты
- ✅ Sidebar с полной навигацией
