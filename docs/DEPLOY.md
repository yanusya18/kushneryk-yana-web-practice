# Публікація проєкту та PWA (ПР 10)

Схема: **клієнт (React, статика) → Vercel**, **API (Node.js + Express) → Render**. Обидві платформи підключаються до GitHub-репозиторію й самі публікують нову версію після кожного оновлення гілки `main` (це і є CI/CD-автодеплой). Для кожного Pull Request Vercel автоматично створює окрему *preview*-адресу.

```
Браузер ──► Vercel (client/dist: HTML, JS, CSS, PWA)
   │
   └──► Render (server: Express API, /api/...)   ◄── CORS_ORIGIN = адреса Vercel
```

У репозиторії вже є все потрібне: `client/vercel.json`, `client/netlify.toml`, `client/public/_redirects`, `render.yaml`, `.github/workflows/ci.yml`, PWA-файли в `client/public/`.

## Порядок дій

Спочатку API (щоб знати його адресу), потім клієнт, потім повернутися й дозволити адресу клієнта в API.

### 1. API на Render
1. Зареєструйтесь на [render.com](https://render.com) (можна через GitHub).
2. **New → Blueprint** → оберіть свій репозиторій → Render прочитає `render.yaml`. *(Або вручну: **New → Web Service**, Root Directory `server`, Build Command `npm ci`, Start Command `npm start`, Health Check Path `/api/health`.)*
3. Змінні середовища (Environment):

| Змінна | Значення | Примітка |
|---|---|---|
| `NODE_ENV` | `production` | задано в `render.yaml` |
| `TIMEZONE` | `Europe/Kyiv` | задано в `render.yaml` |
| `CORS_ORIGIN` | адреса сайту на Vercel, напр. `https://ваш-сайт.vercel.app` | **без слеша в кінці**; можна кілька через кому; для preview-деплоїв додайте `https://*.vercel.app` |
| `ADMIN_TOKEN` | довге випадкове значення | `render.yaml` просить Render згенерувати його; побачите в Environment |
| `PORT` | — | Render задає сам, нічого вводити не треба |

4. Після деплою відкрийте `https://ваш-api.onrender.com/api/health` → `{"status":"ok"}`. Це і є «URL API» для здачі.

> **Важливо про дані.** На безкоштовному тарифі файлова система сервера тимчасова (перевірте актуальні умови Render): після перезапуску чи нового деплою `db.json` створюється заново з `data/workspaces.seed.json`. Каталог завжди працюватиме, але бронювання та додані місця зникнуть. Для навчального проєкту це прийнятно; для постійних даних потрібен диск Render або зовнішня база. Також безкоштовний сервіс «засинає» — перший запит після паузи може тривати до хвилини.

### 2. Клієнт на Vercel
1. Зареєструйтесь на [vercel.com](https://vercel.com) → **Add New → Project** → імпортуйте репозиторій.
2. **Root Directory:** `client`. Framework Preset — **Vite** (Build Command `npm run build`, Output `dist` — це вже в `vercel.json`).
3. **Environment Variables:**

| Змінна | Значення | Навіщо |
|---|---|---|
| `VITE_API_URL` | `https://ваш-api.onrender.com` (без слеша) | куди React-застосунок надсилає запити |
| `SITE_URL` | `https://ваш-сайт.vercel.app` | адреса в `sitemap.xml` і `robots.txt` (генерується під час збірки) |
| `VITE_SITE_URL` | те саме | адреса в `canonical` та Open Graph |

4. **Deploy.** Скопіюйте адресу проєкту, поверніться на Render і впишіть її в `CORS_ORIGIN` (Render перезапустить сервіс).
5. Якщо адресу сайту змінюєте пізніше (власний домен) — оновіть `SITE_URL` / `VITE_SITE_URL` і перезберіть проєкт (**Redeploy**).

> Змінні `VITE_*` потрапляють у JavaScript-збірку й **видимі кожному відвідувачу**. Тому в них можна класти лише публічні значення (адреси). Секрети (`ADMIN_TOKEN`) живуть тільки на сервері.

### 3. Автодеплой і preview
- Оновлення гілки `main` → Vercel і Render самі збирають і публікують нову версію.
- Pull Request → Vercel створює preview-адресу й залишає її в коментарі до PR (для API окремі preview на безкоштовному Render недоступні — preview-клієнти використовують основний API; саме для цього в `CORS_ORIGIN` радимо `https://*.vercel.app`).
- GitHub Actions (`.github/workflows/ci.yml`) на кожен push і PR запускає: lint, автотести й збірку клієнта; запуск сервера й перевірку `/api/health`. Червоний ❌ біля коміту — сигнал, що щось зламано до публікації.
- Щоб `npm test` у CI працював, у `client/package-lock.json` мають бути dev-залежності для тестів (команда встановлення — у `docs/AUDIT.md`, розділ 7).

### Альтернатива: Netlify замість Vercel
**Add new site → Import an existing project** → Base directory `client` → Build command `npm run build` → Publish directory `dist` (`netlify.toml` це вже містить; перенаправлення для маршрутів — у `client/public/_redirects`). Змінні — ті самі.

## PWA: що додано і як перевірити

| Файл | Призначення |
|---|---|
| `client/public/manifest.webmanifest` | назва, іконки 192/512 px (+ maskable), `theme_color`, режим `standalone` |
| `client/public/icons/` | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` |
| `client/public/sw.js` | service worker: кешує оболонку й статику (`/assets/*`, іконки), без мережі показує офлайн-сторінку; **API не кешує** |
| `client/public/offline.html` | офлайн-сторінка (самодостатня, зі своїми стилями) |
| `client/src/registerServiceWorker.js` | реєструє `sw.js` лише в production-збірці |
| `client/index.html` | `<link rel="manifest">`, `theme-color`, `apple-touch-icon` |

**Три умови встановлюваного PWA:** (1) HTTPS (або localhost), (2) веб-маніфест з назвою, іконками 192 і 512 px, `start_url` і `display: standalone`, (3) зареєстрований service worker. Vercel дає HTTPS автоматично.

Перевірка на комп'ютері (Chrome):
1. Відкрийте **опублікований** сайт (не `npm run dev` — service worker вимкнений у розробці).
2. `F12` → **Application → Manifest**: без помилок, видно іконки. **Service Workers**: статус *activated and is running*.
3. **Network → Offline** → оновіть сторінку → має з'явитись офлайн-сторінка.
4. В адресному рядку з'явиться значок установки («Встановити Простір»).

Перевірка на телефоні: **Android Chrome** → ⋮ → *Встановити застосунок* / *Додати на головний екран*; **iPhone Safari** → «Поділитися» → *На початковий екран*. Знімок екрана з іконкою на робочому столі телефону — добрий матеріал для демонстрації.

Оновлення кешу: якщо змінили `sw.js`, збільште `VERSION` у файлі — старі кеші буде видалено автоматично.

## Безпечне зберігання секретів
- `.env` файли не потрапляють у репозиторій (`.gitignore`); у репозиторії лише `.env.example` без реальних значень.
- Секрети вводяться в панелі платформи (**Environment Variables** Render/Vercel), а не в код.
- Змінні `VITE_*` — публічні (вони вбудовуються в збірку), тому секретів там немає.
- `ADMIN_TOKEN` захищає зміну даних: без нього `/manage` на публічному сайті могли б користуватись усі.
- Якщо секрет випадково потрапив у репозиторій — його вважають скомпрометованим: згенеруйте новий і оновіть у панелі платформи.

## Часті проблеми
| Симптом | Причина й рішення |
|---|---|
| У консолі браузера CORS-помилка | адреса сайту не збігається з `CORS_ORIGIN` на Render (перевірте `https://`, відсутність слеша в кінці) |
| 404 при оновленні сторінки `/catalog` | немає перенаправлення на `index.html`: перевірте `vercel.json` (Root Directory має бути `client`) |
| «Не вдалося з'єднатися із сервером» | неправильний `VITE_API_URL` або API «спить» — зачекайте хвилину й повторіть; після зміни змінної потрібен **Redeploy** |
| У sitemap адреси `example.com` | не задано `SITE_URL` на Vercel |
| Після деплою зникли бронювання | тимчасова файлова система Render (див. примітку вище) |
| `/manage` каже «Потрібен токен» | введіть `ADMIN_TOKEN` з панелі Render у поле на сторінці |
