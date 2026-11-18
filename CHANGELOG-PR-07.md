# CHANGELOG — ПР 7

## Додано
- **React-застосунок у `client/`** (Vite 8, React 19, React Router 7): `package.json`, `vite.config.js`, `index.html`, `.oxlintrc.json`, `src/`.
- **14 компонентів:** `Layout`, `Header`, `Footer`, `ThemeToggle`, `Button`, `Picture`, `Card`, `CardList`, `StateMessage`, `Modal`, `FormField`, `FilterForm`, `BookingForm`, `ContactForm`; **5 сторінок:** `HomePage`, `CatalogPage`, `WorkspacePage`, `ContactsPage`, `NotFoundPage`.
- **5 власних хуків:** `useFetch` (loading/error), `useFormValidation`, `useDebounce`, `useTheme`, `useDocumentTitle`.
- **Маршрути:** `/`, `/catalog`, `/items/:id`, `/contacts`, `*` (404).
- Документація: `docs/COMPONENT-TREE.md`, `docs/AI.md` (шаблон), `docs/GIT-PR7.md`, `docs/DEFENSE-PR7.md`.

## Перенесено з ПР 6 (поведінка збережена)
Бронювання на дату й час із перевіркою перетину, підрахунок вартості, підтвердження в `<dialog>`; валідація форм
(email, +380, `aria-describedby`, блокування кнопки); каталог із пошуком (debounce 300 мс), фільтрами, сортуванням,
станами loading/error/empty та демо-режимами `?demo=loading|error|empty`; бургер-меню; перемикач теми; делегування кліку по картках.
Чиста логіка (`booking.js`) і правила валідації винесені в `src/utils/` без змін алгоритмів.

## Виправлено (знайдено під час перевірки)
- **Шапка виходила за екран на 360 px** (+20 px горизонтального скролу) — дефект успадковано з ПР 6, коли JS увімкнено.
  Виправлення в `assets/css/components.css`: на екранах < 480 px підпис «Темна тема» лишається для екранних читачів, видима іконка. Діє й для статичних сторінок.
- **Номер бронювання** міг збігтися з номером демо-бронювання іншого місця (рахувався лише в межах одного місця й дати).
  Тепер унікальний серед усіх бронювань.

## Змінено
- Форма фільтрів каталогу: фільтрація миттєва (з debounce), окремої кнопки «Показати» немає; «Скинути» залишилась.
- Адреси місць: замість `workspace.html?id=N` — `/items/N` (вимога ПР 7).
- `README.md` — статус і запуск.

## Не змінювалось
Токени, reset, base, зображення, дані (`assets/data/*.json`), статичні сторінки `client/static/` (ПР 4–6), Tailwind-версія контактів.

## Свідомо не реалізовано (майбутні ПР)
Express-API і серверна валідація (ПР 8), code splitting, SEO по маршрутах, skip-link, Vitest (ПР 9), деплой і PWA (ПР 10).
