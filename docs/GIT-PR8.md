# Git-інструкція для ПР 8

```bash
git checkout main && git pull
git checkout -b feature/api

# 1. Каркас сервера
git add server/package.json server/package-lock.json server/.env.example server/src/config.js server/src/errors.js
git commit -m "feat: init Express server with dotenv config"

# 2. Дані
git add server/data/workspaces.seed.json server/src/store.js server/src/seed.js server/scripts
git commit -m "feat: add JSON file store with atomic writes and seed data"

# 3. Валідація й логіка бронювання
git add server/src/validation server/src/utils
git commit -m "feat: add server-side validation and booking overlap logic"

# 4. Middleware і маршрути
git add server/src/middleware server/src/routes server/src/app.js server/src/index.js
git commit -m "feat: add CRUD /api/items, /api/bookings, /api/contact and error middleware"

# 5. Підключення React
git add client/.env.example client/src
git commit -m "feat: connect React client to API via VITE_API_URL, add manage page"

# 6. Документація й колекція
git add docs README.md CHANGELOG-PR-08.md .gitignore
git commit -m "docs: add API reference, Postman collection and PR8 notes"

git push -u origin feature/api
```
На GitHub: **Compare & pull request** → `feat: REST API and React integration` → Create → Merge.
```bash
git checkout main && git pull
git tag pr-08
git push origin pr-08
```

## Важливо
- **`server/.env` НЕ комітьте** (він у `.gitignore`), комітьте лише `.env.example`. Так само `server/data/db.json` і `client/.env`.
- `package-lock.json` — комітьте (і в `server/`, і в `client/`).
- Перевірте перед комітом: `git status` не повинен показувати `.env`, `node_modules`, `db.json`.
- Скриншоти Postman (`docs/screenshots/postman-run.png`) і колекцію додайте окремим комітом після власного тестування.
