# Сайт коворкінгу — навчальна практика «WEB-технології та WEB-дизайн»

> Статус: **ПР 7 — клієнтська частина на React** (поточний етап).

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
├── server/        # Node.js + Express API (ПР 8)
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
- Беклог задач: GitHub Projects + Issues (див. `docs/ISSUES.md`)

## Запуск

Потрібен [Node.js](https://nodejs.org) 20+.

```bash
cd client
npm install        # один раз
npm run dev        # розробка: http://localhost:5173
npm run build      # production-збірка в client/dist
npm run preview    # перегляд збірки
npm run lint       # перевірка коду (oxlint)
```

Маршрути: `/` · `/catalog` · `/items/:id` · `/contacts` · будь-яка інша адреса → 404.
Демо-режими станів: додайте до адреси `?demo=loading`, `?demo=error` або `?demo=empty`.

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
