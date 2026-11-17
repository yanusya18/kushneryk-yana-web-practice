# Інструкція: Git і GitHub для ПР 1

Замініть `ВАШ-НІК` на ваш логін GitHub. Команди виконуються в терміналі
(Windows: Git Bash; macOS/Linux: Terminal).

## 0. Що встановити
1. Git: https://git-scm.com/downloads → перевірка: `git --version`
2. Акаунт на https://github.com
3. (необов'язково) GitHub CLI: https://cli.github.com → `gh auth login`

## 1. Створіть репозиторій на GitHub
1. github.com → **+** → **New repository**
2. Repository name: `kushneryk-yana-web-practice`
3. **Public**
4. **НЕ** ставте галочки README / .gitignore / license (вони вже є у ZIP)
5. **Create repository**

## 2. Розпакуйте ZIP і налаштуйте Git
```bash
cd шлях/до/kushneryk-yana-web-practice
git config --global user.name  "Yana Kushneryk"
git config --global user.email "ваш-email-з-GitHub@example.com"
git config --global init.defaultBranch main
```
Перевірка: `git config --list`

## 3. Перший коміт і push (кілька змістовних комітів)
Робіть окремі коміти — у практиці потрібно ≥ 30 комітів загалом.
```bash
git init
git add LICENSE .gitignore
git commit -m "chore: add MIT license and Node .gitignore"

git add client/.gitkeep server/.gitkeep
git commit -m "chore: add client and server folders"

git add README.md
git commit -m "docs: add project README"

git branch -M main
git remote add origin https://github.com/ВАШ-НІК/kushneryk-yana-web-practice.git
git push -u origin main
```
> Якщо GitHub просить пароль — потрібен Personal Access Token
> (Settings → Developer settings → Tokens) або вхід через `gh auth login`.

## 4. Гілка docs/tz, TZ.md і Pull Request
```bash
git checkout -b docs/tz
git add docs/TZ.md
git commit -m "docs: add technical specification (TZ.md)"
git add docs/ISSUES.md docs/GIT-GUIDE.md docs/create-issues.sh docs/DIARY.md
git commit -m "docs: add backlog, git guide and practice diary"
git push -u origin docs/tz
```
На GitHub: з'явиться жовта плашка **Compare & pull request** →
Title: `docs: add technical specification` → **Create pull request** →
**Merge pull request** → **Confirm merge**.

Повернення в main:
```bash
git checkout main
git pull
```

## 5. Дошка GitHub Projects
1. Репозиторій → вкладка **Projects** → **New project** → шаблон **Board**
2. Назва: `Coworking backlog`
3. Колонки (поле Status): **To do**, **In progress**, **Done**
   (за потреби перейменуйте стандартні: Todo → To do)
4. Додайте Issues на дошку (**Add item** або в Issue → Projects → ваш проєкт)

## 6. Issues (≥ 10)
**Спосіб А (скрипт):** `bash docs/create-issues.sh` (потрібен `gh`).
**Спосіб Б (вручну):** Issues → **New issue**, назви — з `docs/ISSUES.md`.

Після виконання закрийте виконані Issues (Close) — вони автоматично підуть у **Done**.
Можна закривати комітом: `git commit -m "docs: add TZ, closes #1"`.

## 7. Тег здачі ПР 1
```bash
git tag pr-01
git push origin pr-01
```

## 8. Що показати викладачу
- Посилання на репозиторій
- `docs/TZ.md`
- Злитий PR (вкладка Pull requests → Closed/Merged)
- Дошка з Issues
- Тег `pr-01` (вкладка Tags)

## Шпаргалка
| Команда | Що робить |
|---|---|
| `git status` | стан файлів |
| `git add <файл>` | додати до коміту |
| `git commit -m "..."` | зафіксувати зміни |
| `git push` | відправити на GitHub |
| `git checkout -b <гілка>` | нова гілка |
| `git log --oneline` | історія комітів |

Формат повідомлень: `feat: ...` (нова функція), `fix: ...` (виправлення),
`docs: ...` (документація), `chore: ...` (службові зміни).
