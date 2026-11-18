# CHANGELOG — ПР 9

Основа: `coworking-pr-07.zip`. **ПР 8 (Express-API) у цій версії відсутня** — її робить окремо; папка `server/` не змінювалась.

## Додано
- **AVIF-зображення** (`client/assets/images/*.avif`) і підтримка в `Picture.jsx` / `images.js`.
- **Code splitting**: `React.lazy` + `Suspense` для сторінок каталогу, деталей, контактів і 404.
- **SEO**: `utils/seo.js`, `hooks/useSeo.js` (title, description, canonical, Open Graph, robots/noindex), JSON-LD `Product` + `Offer` для сторінки місця, `scripts/generate-seo.mjs` → `public/robots.txt`, `public/sitemap.xml` (запускається в `prebuild`).
- **Доступність**: skip-link, керування фокусом і `aria-live`-оголошення при навігації, `id="main-content"` на `<main>`.
- **Тести (Vitest + React Testing Library)**: 6 файлів, понад 50 перевірок (`src/utils/*.test.js`, `src/components/*.test.jsx`), налаштування в `vite.config.js`, `src/test/setup.js`.
- **Документація**: `docs/AUDIT.md`, `docs/TEST-CHECKLIST.md` (22 тест-кейси), `docs/GIT-PR9.md`, `docs/DEFENSE-PR9.md`.

## Змінено
- `package.json`: версія 0.9.0, скрипти `prebuild`, `test`, `test:watch`.
- `index.html`: `robots` і базові Open Graph-теги.
- Сторінки: `useDocumentTitle` замінено на `useSeo` (файл `hooks/useDocumentTitle.js` видалено).
- `app.css`, `README.md`, `docs/COMPONENT-TREE.md`.

## Не змінювалось
Бізнес-логіка бронювання, дані, стилі ПР 5–6, `server/`.

## Для злиття з ПР 8
Ймовірні місця конфліктів: `client/package.json`, `README.md`, `client/src/api/api.js` (ПР 8 його перепише — ПР 9 його не чіпає), `WorkspacePage.jsx` / `ContactsPage.jsx` (ПР 9 змінив лише `<main>`, імпорти та виклики `useSeo`). `scripts/generate-seo.mjs` читає `client/assets/data/workspaces.json`; якщо ПР 8 перенесе дані на сервер, змініть там джерело (або залиште JSON як довідник адрес).

## Свідомо не виконано мною
Запуск Lighthouse/axe, `npm install`, `npm test`, `npm run build` (у середовищі немає мережі й залежностей) — див. звіт у чаті.
