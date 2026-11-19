# AUDIT.md — тестування й оптимізація (ПР 9)

> Цей файл — **шаблон звіту**. Усі оптимізації нижче реалізовані в коді, але **числа Lighthouse й axe потрібно зняти вам**: аудити запускаються в браузері на вашому комп'ютері. Не вписуйте в таблиці числа, яких не отримали самі.

## 1. Як зняти звіти «до» і «після»

**Спершу запустіть API** (інакше каталог показуватиме помилку, а Lighthouse — неправдиві результати): `cd server && npm install && npm run dev` (порт 3001). Клієнт бере адресу з `client/.env` (`VITE_API_URL`, шаблон — `client/.env.example`).

Оптимізації вже є в цьому проєкті, тому «до» знімаємо зі стану ПР 7 (тег `pr-07`), а «після» — з поточного.

### Звіт «до» (без оптимізацій ПР 9)
Оптимізації вже є в проєкті, тому «до» знімайте зі збірки без них — розпакуйте окремо архів `coworking-pr-07.zip` (стан після ПР 7) в іншу папку:
```bash
cd client
npm install
npm run build
npm run preview      # відкриє http://localhost:4173
```
1. Відкрийте сторінку в **Chrome в режимі інкогніто** (розширення спотворюють результат).
2. `F12` → вкладка **Lighthouse** → режим **Navigation**, пристрій **Mobile**, позначте всі 4 категорії → **Analyze page load**.
3. Зробіть для `/` (головна) і `/catalog`. Збережіть: ⋮ → *Save as HTML* → `docs/lighthouse/before-home.html`, `before-catalog.html`.
4. У Performance запишіть **LCP, CLS, INP/TBT** (INP у Lighthouse навігації відсутній — використовуйте TBT як проксі, а INP виміряйте у DevTools → Performance → Interactions або розширенням *Web Vitals*).
5. Для «Slow 4G»: DevTools → Network → Throttling → **Slow 4G**, перезавантажте сторінку й запишіть час завантаження.

### Звіт «після» (поточний стан проєкту)
Зробіть ті самі кроки в папці поточного проєкту (`npm install`, `npm run build`, `npm run preview`); збережіть `docs/lighthouse/after-home.html`, `after-catalog.html`.

> Запускайте **production-збірку** (`build` + `preview`), а не `npm run dev`: dev-режим не мініфікований, і Performance буде занижений.

### axe DevTools
1. Встановіть розширення **axe DevTools** (Chrome Web Store).
2. На кожній сторінці (`/`, `/catalog`, `/items/1`, `/contacts`, `/manage`, 404) → **Scan all of my page**.
3. Запишіть кількість проблем за рівнями; вимога — **0 критичних (Critical)**. Виправлене/невиправлене опишіть у таблиці 3.

## 2. Таблиця Lighthouse (mobile) — заповніть

| Сторінка | Категорія | До | Після |
|---|---|---|---|
| Головна `/` | Performance | | |
| | Accessibility | | |
| | Best Practices | | |
| | SEO | | |
| Каталог `/catalog` | Performance | | |
| | Accessibility | | |
| | Best Practices | | |
| | SEO | | |

| Метрика (головна) | До | Після | «Добре» за Google |
|---|---|---|---|
| LCP | | | ≤ 2,5 с |
| CLS | | | ≤ 0,1 |
| INP | | | ≤ 200 мс |
| Slow 4G: повне завантаження | | | — |

Вимога: усі 4 категорії **≥ 90** (mobile). Якщо якась нижча — запишіть причину з розділу *Diagnostics* звіту й що ви зробили.

## 3. Результати axe (заповніть)

| Сторінка | Critical | Serious | Moderate | Minor | Що виправлено |
|---|---|---|---|---|---|
| `/` | | | | | |
| `/catalog` | | | | | |
| `/items/1` | | | | | |
| `/contacts` | | | | | |
| `/manage` | | | | | |
| 404 | | | | | |

## 4. Виконані оптимізації (є в коді)

### Продуктивність
| Що зроблено | Де | Навіщо |
|---|---|---|
| Зображення AVIF + WebP + JPG через `<picture>` | `Picture.jsx`, `assets/images/*.avif` | AVIF найменший за вагою; браузер бере перший формат, який підтримує |
| Явні `width` і `height` на всіх `<img>` | `Picture.jsx` | браузер резервує місце → менший CLS |
| `loading="lazy"` для зображень нижче першого екрана; `fetchpriority="high"` для головного (LCP) | `Picture.jsx` (`priority`) | перший екран вантажиться першим |
| Code splitting: `React.lazy` + `Suspense` для 4 сторінок | `App.jsx`, `Layout.jsx` | початковий JS менший; сторінки завантажуються за потреби |
| Мініфікація й хешування файлів у production-збірці | `npm run build` (Vite) | менший розмір, довге кешування |
| `loading="lazy"` для iframe мапи | `ContactsPage.jsx` | мапа не гальмує перший показ |
| Шрифти | `tokens.css` | у проєкті **системний стек** (`Inter` указано першим, але не підвантажується з мережі) → блокуючих запитів на шрифти немає. Якщо підключите Google Fonts, додайте `&display=swap` в URL (аналог `font-display: swap`) |

### SEO
| Що зроблено | Де |
|---|---|
| Унікальні `title` і `description` для кожного маршруту (і для кожного місця) | `hooks/useSeo.js`, `utils/seo.js`, сторінки |
| `canonical`, Open Graph, `robots` (404 і неіснуюче місце — `noindex`) | `utils/seo.js` |
| `robots.txt` і `sitemap.xml` (генеруються з даних місць) | `scripts/generate-seo.mjs` → `public/` |
| Schema.org JSON-LD `Product` + `Offer` для сторінки робочого місця | `utils/seo.js`, `WorkspacePage.jsx` |

**Обмеження, яке варто знати для захисту:** це односторінковий застосунок — HTML з одним `<div id="root">`, а теги оновлює JS. Google виконує JS і бачить зміни, але соцмережі часто читають лише початковий `index.html`. Повне рішення — SSR/prerender (поза межами практики).

**Перед деплоєм (ПР 10):** задайте реальну адресу: `SITE_URL=https://ваш-сайт npm run build` (для sitemap/robots) і `VITE_SITE_URL=https://ваш-сайт` (для canonical). Інакше в sitemap буде заглушка `https://example.com`.

**Сторінка `/manage`** (ПР 8): `noindex`, закрита в `robots.txt` і відсутня в sitemap — службова сторінка без авторизації.

### Доступність (a11y)
| Що зроблено | Де |
|---|---|
| Skip-link «Перейти до основного вмісту» (перший Tab) | `Layout.jsx`, `app.css` |
| Керування фокусом при навігації SPA + оголошення назви сторінки екранним читачам (`aria-live`) | `Layout.jsx` |
| `<main id="main-content" tabIndex={-1}>` на кожній сторінці | сторінки |
| Видимий фокус `:focus-visible` | `base.css` (з ПР 5) |
| Меню: `aria-expanded`, `aria-controls`, закриття по Esc | `Header.jsx` |
| Модальне вікно на `<dialog>`: фокус-пастка й Esc від браузера, `aria-labelledby` | `Modal.jsx` |
| Поля форм: `label`, `aria-describedby`, `aria-invalid` | `FormField.jsx` |
| Статуси й помилки: `role="status"` / `role="alert"` | `StateMessage.jsx` |

## 5. Перевірка клавіатурою (виконайте й відмітьте)

Відкрийте сайт, не торкайтеся миші.

| Перевірка | Результат |
|---|---|
| Перший `Tab` показує skip-link, `Enter` переносить до вмісту | |
| Усі посилання, кнопки й поля досяжні по `Tab` у логічному порядку | |
| Фокус завжди видимий | |
| Меню (на 360 px): відкривається `Enter`, закривається `Esc` | |
| Модальне вікно після бронювання: фокус усередині, `Esc` закриває, фокус повертається | |
| Форма бронювання проходиться й відправляється без миші | |

## 6. Знайдені дефекти

Кожен баг із чек-листа (`docs/TEST-CHECKLIST.md`) опишіть: кроки відтворення, очікуваний і фактичний результат, скриншот, що виправлено. Занесіть їх сюди:

| № | Опис дефекту | Статус |
|---|---|---|
| | | |

## 7. Автоматичні тести

```bash
cd client
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm test
```
Файли тестів: `src/utils/*.test.js` (валідація, бронювання, каталог, SEO) і `src/components/*.test.jsx` (React Testing Library). Усього понад 50 перевірок.
