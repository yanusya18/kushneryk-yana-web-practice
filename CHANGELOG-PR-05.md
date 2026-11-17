# CHANGELOG — ПР 5

## Додано
- `client/assets/css/tokens.css` — токени (примітиви + семантичні), світла/темна теми (prefers-color-scheme і data-theme)
- `client/assets/css/reset.css`, `base.css`, `components.css` — reset, типографіка (rem, clamp), контейнер, компоненти
- `client/tailwind/` (package.json, tailwind.config.js, input.css) та зібраний `client/assets/css/tailwind.css`
- `client/static/contacts.tailwind.html` — сторінка контактів на Tailwind (noindex, для порівняння)
- `docs/DESIGN-TOKENS.md`, `docs/CSS-VS-TAILWIND.md`, `docs/SCREENSHOTS-PR5.md`, `docs/GIT-PR5.md`, `docs/DEFENSE-PR5.md`

## Змінено
- Усі HTML-сторінки в `client/static/`: підключено стилі, `meta color-scheme`, додано класи-«гачки»
  (`container`, `card`, `card-grid`, `button`, `form` …) та обгортки (`div.card-grid`, `div.feature-grid`,
  `div.table-wrap`, `div.gallery`); атрибути `role="region"` і `tabindex="0"` на прокручуваній таблиці.
  Зміст, заголовки й семантика не змінювались; HTML далі проходить валідатор без помилок.
- `README.md` — статус і запуск.

## Не змінювалось
Тексти, зображення, структура форм, файли ПР 1 (`docs/TZ.md` та ін.).

## Свідомо не реалізовано (майбутні ПР)
Бургер-меню та кнопка перемикання теми (ПР 6, JavaScript), React (ПР 7), skip-link та аудит (ПР 9).
