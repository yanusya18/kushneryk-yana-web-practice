# Git-інструкція для ПР 7

```bash
git checkout main && git pull
git checkout -b feature/react

# 1. Каркас Vite + React
git add client/package.json client/package-lock.json client/vite.config.js client/index.html client/.oxlintrc.json
git commit -m "feat: scaffold React app with Vite in client/"

# 2. Дані, утиліти, API
git add client/src/utils client/src/api
git commit -m "feat: port booking logic, validators and api layer to src/"

# 3. Хуки
git add client/src/hooks
git commit -m "feat: add useFetch, useFormValidation, useDebounce, useTheme hooks"

# 4. Компоненти
git add client/src/components client/src/app.css
git commit -m "feat: add reusable components (Header, Card, Modal, forms, ...)"

# 5. Сторінки й маршрути
git add client/src/pages client/src/App.jsx client/src/main.jsx
git commit -m "feat: add pages and React Router routes (404 included)"

# 6. Виправлення CSS (шапка на 360 px)
git add client/assets/css/components.css
git commit -m "fix: header no longer overflows on 360px (icon-only theme toggle)"

# 7. Документація
git add docs CHANGELOG-PR-07.md README.md
git commit -m "docs: add component tree, AI usage template, PR7 defense notes"

git push -u origin feature/react
```
На GitHub: **Compare & pull request** → `feat: React client with routing and booking` → Create → Merge.

```bash
git checkout main && git pull
git tag pr-07
git push origin pr-07
```

## Важливо
- **`node_modules/` і `dist/` не комітьте** — вони вже в `.gitignore`. `package-lock.json` комітьте.
- Після клонування репозиторію: `cd client && npm install`.
- Результат AI-завдань (`docs/AI.md`) додайте окремим комітом, коли заповните таблицю.
- Теги попередніх ПР не ставте «заднім числом», якщо вони не були реально здані.
