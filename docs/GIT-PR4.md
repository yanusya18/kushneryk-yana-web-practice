# Git-інструкція для ПР 4

```bash
git checkout main && git pull
git checkout -b feature/html

git add client/assets/favicon.svg
git commit -m "feat: add favicon"
git add client/assets/images
git commit -m "feat: add responsive placeholder images (webp/jpg)"
git add client/static/index.html
git commit -m "feat: add semantic home page markup"
git add client/static/catalog.html
git commit -m "feat: add catalog page with search and filter form"
git add client/static/workspace.html
git commit -m "feat: add workspace details page with booking form"
git add client/static/contacts.html client/static/404.html
git commit -m "feat: add contacts page with form and map, add 404 page"
git add docs/HTML-OUTLINE.md docs/VALIDATION.md docs/GIT-PR4.md docs/DEFENSE-PR4.md CHANGELOG-PR-04.md README.md docs/screenshots
git commit -m "docs: add outline, validation notes and PR4 changelog"

git push -u origin feature/html
```
На GitHub: **Compare & pull request** → заголовок `feat: semantic HTML5 pages` → Create → Merge → Confirm.

```bash
git checkout main && git pull
git tag pr-04
git push origin pr-04
```

## Якщо ви ще не робили ПР 2 і ПР 3
Теги `pr-02` і `pr-03` не ставте «заднім числом» як виконані. Виконайте ці ПР
пізніше (Figma-файли, `docs/UX.md`) і поставте теги тоді. Тег `pr-04` ставте після
реального злиття PR.
