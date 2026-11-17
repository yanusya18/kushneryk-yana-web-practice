# Сайт коворкінгу — навчальна практика «WEB-технології та WEB-дизайн»

> Статус: **ПР 5 — CSS3, адаптивна верстка, темна тема, Tailwind** (поточний етап).

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
│   ├── static/    # HTML-сторінки (ПР 4)
│   ├── assets/    # зображення, favicon, css/ (ПР 5)
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
- [Дизайн-токени](docs/DESIGN-TOKENS.md) · [CSS vs Tailwind](docs/CSS-VS-TAILWIND.md) · [Скриншоти](docs/SCREENSHOTS-PR5.md)
- Беклог задач: GitHub Projects + Issues (див. `docs/ISSUES.md`)

## Запуск (поточний етап)

Сторінки статичні. Відкрийте `client/static/index.html` у браузері
або запустіть Live Server у VS Code (правий клік по файлу → *Open with Live Server*).
Стилі підключені (`client/assets/css/`). JavaScript з'явиться в ПР 6.

### Tailwind (потрібен лише для перебудови `tailwind.css`)
```bash
cd client/tailwind
npm install
npm run build   # створить ../assets/css/tailwind.css
```
Зібраний `tailwind.css` уже є в репозиторії, тому для перегляду `contacts.tailwind.html` збірка не потрібна.

## Посилання

- Деплой: _буде додано в ПР 10_
- Figma: _буде додано в ПР 2_

## Ліцензія

[MIT](LICENSE)
