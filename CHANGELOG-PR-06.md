# CHANGELOG — ПР 6

## Додано
- `client/assets/js/` — ES-модулі (`<script type="module">`), без бібліотек:
  - `ui.js` — бургер-меню, перемикач теми (localStorage), модальне вікно (`<dialog>`), делегування кліків по картках;
  - `form.js` — універсальна клієнтська валідація (input/blur/submit, regex для email і +380, `aria-describedby`, `aria-invalid`, блокування кнопки);
  - `api.js` — доступ до даних: `fetch` + `async/await`, перевірка `response.ok`, кеш, демо-режими станів, бронювання в localStorage;
  - `booking.js` — чиста логіка бронювання: перетин проміжків, вартість, повні години;
  - `utils.js` — `debounce`, `escapeHtml`, дати, підписи типів/обладнання;
  - `main.js` (спільний вхід), `catalog.js`, `workspace.js`, `contacts.js` — логіка сторінок.
- `client/assets/data/workspaces.json` — 6 робочих місць за структурою з ТЗ (п. 7.1); `bookings.json` — демо-бронювання (дати відносно сьогодні).
- `docs/JS-GUIDE.md`, `docs/GIT-PR6.md`, `docs/DEFENSE-PR6.md`, `docs/SCREENSHOTS-PR6.md`.

## Змінено
- `catalog.html` — картки тепер малюються з `workspaces.json`; форма фільтрів отримала сортування й кнопку «Скинути»; блоки станів.
- `workspace.html` — дані місця за `?id=`; повноцінне **бронювання на дату й час** з перевіркою доступності, підрахунком вартості та модальним вікном підтвердження.
- `contacts.html` — JS-валідація, лічильник символів, повідомлення про результат.
- `index.html` — картки ведуть на конкретні місця (`workspace.html?id=N`), клікабельні через делегування.
- Усі сторінки: кнопки меню й теми в шапці, inline-скрипт у `<head>` (тема без «мигання»), підключення модулів.
- `components.css` — стилі шапки (grid → flex), кнопок, станів, помилок полів, `<dialog>`; mobile-first збережено.
- `README.md` — статус, запуск через Live Server.

## Не змінювалось
Токени, reset, base.css, зображення, Tailwind-сторінка `contacts.tailwind.html`, документи ПР 1–5.

## Свідомо не реалізовано (майбутні ПР)
React (ПР 7), Express-API й серверна валідація (ПР 8), skip-link, аудит, Vitest (ПР 9), PWA (ПР 10).
