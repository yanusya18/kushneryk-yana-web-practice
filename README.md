# Простір — сайт коворкінгу

Вебсайт коворкінгу, де користувач переглядає робочі місця, дивиться ціни й **бронює місце на конкретну дату й час**.
Навчальний проєкт повного циклу (практика «WEB-технології та WEB-дизайн», варіант №1) — від технічного завдання
й макетів у Figma до опублікованого сайту з React-фронтендом і Node.js API.

**Автор:** Кушнерик Яна · **Версія:** 1.0.0

## Посилання

| | |
|---|---|
| 🌐 Сайт | _вставте URL з Vercel_ |
| ⚙️ API | _вставте URL з Render_ (перевірка: `/api/health`) |
| 🎨 Figma | _вставте посилання (доступ «can view»)_ |

## Можливості

- Каталог місць із пошуком, фільтром за типом і ціною, сортуванням
- Сторінка місця: фото, обладнання, зайняті години на обрану дату
- **Бронювання на дату й час** з перевіркою доступності, підрахунком вартості й підтвердженням; на сервері — заборона подвійного бронювання
- Контактна форма з валідацією на клієнті та сервері
- Сторінка керування місцями (додавання/видалення через API, захищена токеном)
- Адаптивна верстка (360 / 768 / 1280 px), світла й темна теми
- Доступність (skip-link, клавіатура, ARIA), SEO (title/description по маршрутах, JSON-LD, sitemap)
- PWA: встановлюється як застосунок, офлайн-сторінка

## Скриншоти

| Головна | Каталог |
|---|---|
| ![Головна](docs/screenshots/home-desktop.png) | ![Каталог](docs/screenshots/catalog-desktop.png) |

| Бронювання | Мобільна версія |
|---|---|
| ![Бронювання](docs/screenshots/booking-desktop.png) | ![Mobile](docs/screenshots/home-mobile.png) |

## Технології

| Шар | Стек |
|---|---|
| Дизайн | Figma / FigJam, дизайн-токени, світла й темна теми |
| Верстка | HTML5, CSS3 (Flexbox, Grid, mobile-first), Tailwind CSS (одна сторінка для порівняння) |
| Клієнт | React 19, Vite, React Router, власні хуки, JavaScript ES6+ |
| Сервер | Node.js 20.11+, Express 5, REST API, JSON-сховище |
| Якість | Vitest, React Testing Library, Lighthouse, axe DevTools, GitHub Actions |
| Публікація | Vercel (клієнт), Render (API), PWA (service worker) |

## Структура

```
kushneryk-yana-web-practice/
├── client/
│   ├── src/        # React-застосунок: components, pages, hooks, utils, api
│   ├── public/     # manifest, іконки, sw.js, offline.html, robots.txt, sitemap.xml
│   ├── assets/     # зображення (AVIF/WebP/JPG), CSS-токени й стилі, дані
│   ├── static/     # статичні HTML-сторінки (ПР 4–6)
│   ├── scripts/    # генерація robots.txt і sitemap.xml
│   └── vercel.json · netlify.toml
├── server/         # Express API: src/ (routes, validation, middleware), data/, scripts/
├── docs/           # документація (див. нижче)
├── .github/workflows/ci.yml
├── render.yaml     # опис сервісу API для Render
├── LICENSE
└── README.md
```

## Запуск локально

Потрібен [Node.js](https://nodejs.org) 20.11 або новіший. Потрібні **два термінали**.

**1. API** — `http://localhost:3001`
```bash
cd server
npm install
cp .env.example .env      # Windows (cmd): copy .env.example .env
npm run dev               # npm start — звичайний запуск; npm run reset-db — скинути дані
```
Перевірка: `http://localhost:3001/api/health` → `{"status":"ok"}`

**2. Клієнт** — `http://localhost:5173`
```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:3001
npm run dev
```

Інші команди клієнта:

| Команда | Що робить |
|---|---|
| `npm run build` | production-збірка (перед нею створює `robots.txt` і `sitemap.xml`) |
| `npm run preview` | перегляд збірки на `http://localhost:4173` (тут працює PWA) |
| `npm run lint` | перевірка коду |
| `npm test` | автотести (перед першим запуском встановіть dev-залежності — `docs/AUDIT.md`, розділ 7) |

Маршрути: `/` · `/catalog` · `/items/:id` · `/contacts` · `/manage` · інші адреси → 404.
Демо-режими станів: `?demo=loading`, `?demo=error`, `?demo=empty`.

### Змінні середовища

| Файл | Змінна | Призначення |
|---|---|---|
| `server/.env` | `PORT`, `CORS_ORIGIN`, `DATA_FILE`, `TIMEZONE`, `NODE_ENV` | налаштування API |
| `server/.env` | `ADMIN_TOKEN` | токен для додавання/видалення місць (локально можна порожнім) |
| `client/.env` | `VITE_API_URL` | адреса API |
| хостинг | `SITE_URL`, `VITE_SITE_URL` | адреса сайту для sitemap і canonical |

Файли `.env` не потрапляють у репозиторій; шаблони — `.env.example`.

## Публікація

Клієнт — Vercel, API — Render, обидва з автодеплоєм із `main`. Покрокова інструкція, таблиці змінних, перевірка PWA й безпека секретів — у [docs/DEPLOY.md](docs/DEPLOY.md).

## Документація

- [Технічне завдання](docs/TZ.md)
- [Публікація та PWA](docs/DEPLOY.md)
- [REST API](docs/API.md) · [Тестування в Postman](docs/POSTMAN.md)
- [Аудит: Lighthouse, SEO, a11y](docs/AUDIT.md) · [Чек-лист ручного тестування](docs/TEST-CHECKLIST.md)
- [Дерево компонентів](docs/COMPONENT-TREE.md) · [AI-асистент](docs/AI.md)
- [Дизайн-токени](docs/DESIGN-TOKENS.md) · [CSS vs Tailwind](docs/CSS-VS-TAILWIND.md)
- [Структура HTML](docs/HTML-OUTLINE.md) · [Перевірка HTML](docs/VALIDATION.md) · [JavaScript-модулі статичної версії](docs/JS-GUIDE.md)
- [Презентація й сценарій демонстрації](docs/PRESENTATION.md) · [Опис релізу v1.0.0](docs/RELEASE-v1.0.0.md)

## Контакти

yana.kushneryk.volod@fclnup.if.ua · +380951786891

## Ліцензія

[MIT](LICENSE)
