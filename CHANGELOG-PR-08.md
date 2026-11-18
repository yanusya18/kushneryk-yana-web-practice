# CHANGELOG — ПР 8

## Додано
- **Сервер (`server/`)**: Express 5, cors, dotenv; ES-модулі.
  - `GET /api/items`, `GET /api/items/:id`, `POST`, `PUT`, `DELETE /api/items/:id` — CRUD робочих місць (JSON-файл через `fs/promises`).
  - `GET /api/items/:id/availability?date=` — зайняті години без персональних даних.
  - `POST /api/bookings` — бронювання: серверна валідація, перевірка перетину, вартість рахує сервер, 409 при конфлікті, захист від одночасних запитів (черга запису).
  - `POST /api/contact` — серверна валідація, 400 з переліком помилок або 201.
  - `GET /api/health`.
  - Middleware: логування запитів, 404 для невідомих маршрутів, централізований обробник помилок (400 JSON, 413, 500).
  - `.env.example`, `npm run dev | start | reset-db`, початкові дані `data/workspaces.seed.json` + демо-бронювання.
- **Клієнт**: підключення до API через `VITE_API_URL` (`client/.env.example`, `src/config.js`, переписаний `src/api/api.js`, клас `ApiError`);
  сторінка `/manage` (додавання й видалення місць, підтвердження в модальному вікні), `WorkspaceForm`, утиліти `serverErrors.js`, `workspaceRules.js`.
- **Документація**: `docs/API.md`, `docs/POSTMAN.md`, `docs/postman/coworking-api.postman_collection.json` (18 запитів, 34 перевірки), `docs/GIT-PR8.md`, `docs/DEFENSE-PR8.md`.

## Змінено
- Форми бронювання й контактів: помилки сервера показуються біля полів (`useFormValidation.setServerErrors`), недоступний сервер — зрозуміле повідомлення.
- Модальне вікно: необов'язковий prop `actions`; кнопка: варіанти `danger`, розмір `small`.
- Бронювання й повідомлення більше не зберігаються в `localStorage` — тільки на сервері.
- Підвал сайту: посилання «Керування місцями». `.gitignore`: `server/data/db.json`, `server/data/*.local.json`.
- `README.md`, `docs/COMPONENT-TREE.md` — оновлено.

## Прибрано
- Кнопка «Очистити мої бронювання» (без авторизації сервер не знає, які бронювання «мої»). Скидання демо-даних — `npm run reset-db` у `server/`.
- Невикористана `dateFromToday` у `client/src/utils/format.js`.

## Не змінювалось
Дизайн, токени, CSS ПР 5, статичні сторінки `client/static/` (ПР 4–6; вони й далі читають `client/assets/data/*.json`).

## Свідомо не реалізовано (майбутні ПР)
Авторизація й розмежування прав, обмеження частоти запитів, автоматичні тести (ПР 9), деплой і змінні середовища на хостингу (ПР 10).
