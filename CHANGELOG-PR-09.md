# CHANGELOG — ПР 9

Основа: `coworking-pr-08.zip` (ПР 1–8). ПР 9 накладено поверх ПР 8; папка `server/` не змінювалась.

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

## Злиття з ПР 8
Конфліктні файли об'єднано вручну: `App.jsx` (додано lazy-маршрут `/manage`), `app.css` і `COMPONENT-TREE.md` (блоки обох ПР), `client/package.json` (скрипти ПР 9, версія 0.9.0), `README.md`.
`ManagePage.jsx` переведено на `useSeo` (`noindex`) і `id="main-content"`; `/manage` виключено з `sitemap.xml` та закрито в `robots.txt` (`Disallow: /manage`).
`scripts/generate-seo.mjs` бере перелік місць із `server/data/workspaces.seed.json` (запасне джерело — `client/assets/data/workspaces.json`).

## Свідомо не виконано мною
Запуск Lighthouse/axe, `npm install`, `npm test`, `npm run build` і запуск Express-сервера (у середовищі немає мережі й залежностей) — див. звіт у чаті.
