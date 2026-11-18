# Сайт коворкінгу — навчальна практика «WEB-технології та WEB-дизайн»

> Статус: **ПР 9 — тестування, Lighthouse, SEO, доступність** (поточний етап; ПР 1–8 виконано).

Навчальний веб-проєкт повного циклу: сайт коворкінгу, де користувач переглядає
робочі місця, обирає місце та **бронює його на конкретну дату й час**.

- Автор: Кушнерик Яна
- Варіант: №1 — «Сайт коворкінгу» (основна сутність — *робоче місце*)
- Обов'язкова функція: бронювання на дату та час

## Стек (за планом практики)

| Етап | Технології |
|---|---|
| ПР 2–3 | Figma / FigJam |
| ПР 4 | HTML5 |
| ПР 5 | CSS3, Flexbox, Grid, Tailwind CSS |
| ПР 6 | JavaScript ES6+ (без бібліотек) |
| ПР 7 | React + Vite, React Router |
| ПР 8 | Node.js, Express, REST API, JSON |
| ПР 9–10 | Vitest, Lighthouse, Vercel/Netlify, PWA |

## Структура репозиторію

```
kushneryk-yana-web-practice/
├── client/
│   ├── src/       # React-застосунок: components, pages, hooks, utils, api (ПР 7)
│   ├── static/    # статичні HTML-сторінки (ПР 4–6)
│   ├── assets/    # зображення, favicon, css/ (ПР 5), js/ і data/ (ПР 6)
│   └── tailwind/  # збірка Tailwind для однієї сторінки (ПР 5)
├── server/        # Node.js + Express REST API (src/, data/, scripts/) (ПР 8)
├── docs/          # документація: TZ.md, UX.md, API.md, AI.md, AUDIT.md ...
├── .gitignore
├── LICENSE
└── README.md
```

## Документація

- [Технічне завдання](docs/TZ.md)
- [Outline головної сторінки](docs/HTML-OUTLINE.md) · [Перевірка HTML](docs/VALIDATION.md)
- [JavaScript: архітектура, запуск, сценарії](docs/JS-GUIDE.md)
- [Дизайн-токени](docs/DESIGN-TOKENS.md) · [CSS vs Tailwind](docs/CSS-VS-TAILWIND.md) · [Скриншоти](docs/SCREENSHOTS-PR5.md)
- [Дерево компонентів](docs/COMPONENT-TREE.md) · [AI-асистент](docs/AI.md)
- [REST API](docs/API.md) · [Тестування в Postman](docs/POSTMAN.md)
- [Аудит: Lighthouse, SEO, a11y (ПР 9)](docs/AUDIT.md) · [Чек-лист ручного тестування](docs/TEST-CHECKLIST.md)
- Беклог задач: GitHub Projects + Issues (див. `docs/ISSUES.md`)

## Запуск

Потрібен [Node.js](https://nodejs.org) 20.11+. Потрібні **два термінали**: сервер і клієнт.

**1. Сервер (API)** — `http://localhost:3001`
```bash
cd server
npm install
cp .env.example .env      # Windows (cmd): copy .env.example .env
npm run dev               # розробка з автоперезапуском; npm start — звичайний запуск
```
Перевірка: відкрийте `http://localhost:3001/api/health` → `{"status":"ok"}`.
Скинути дані до початкових: `npm run reset-db`.

**2. Клієнт (React)** — `http://localhost:5173`
```bash
cd client
npm install
cp .env.example .env      # адреса API: VITE_API_URL=http://localhost:3001
npm run dev
```
Інші команди клієнта: `npm run build` (спершу генерує `robots.txt` і `sitemap.xml`) · `npm run preview` · `npm run lint` · `npm test` (автотести Vitest; перед першим запуском встановіть dev-залежності — див. `docs/AUDIT.md`).

Маршрути сайту: `/` · `/catalog` · `/items/:id` · `/contacts` · `/manage` (додавання й видалення місць) · інші адреси → 404.
Демо-режими станів: `?demo=loading`, `?demo=error`, `?demo=empty`.
Документація API: [docs/API.md](docs/API.md).

### Статична версія (ПР 4–6)
Лишилась у `client/static/`. Відкривайте **через сервер** (Live Server або `npm run dev` → `/static/index.html`):
з `file://` браузер блокує JavaScript-модулі.

### Tailwind (лише для перебудови `tailwind.css`)
```bash
cd client/tailwind
npm install
npm run build
```

## Посилання

- Деплой: _буде додано в ПР 10_
- Figma: _буде додано в ПР 2_

## Ліцензія

[MIT](LICENSE)
