# Git-інструкція для ПР 5

```bash
git checkout main && git pull
git checkout -b feature/css

git add client/assets/css/tokens.css
git commit -m "feat: add design tokens as CSS custom properties (light and dark)"
git add client/assets/css/reset.css client/assets/css/base.css
git commit -m "feat: add reset and base typography with clamp()"
git add client/assets/css/components.css
git commit -m "feat: add header, cards grid, forms and footer styles (mobile-first)"
git add client/static/index.html client/static/catalog.html client/static/workspace.html client/static/contacts.html client/static/404.html
git commit -m "feat: connect stylesheets and add class hooks to pages"
git add client/tailwind client/assets/css/tailwind.css client/static/contacts.tailwind.html
git commit -m "feat: add Tailwind version of contacts page"
git add docs CHANGELOG-PR-05.md README.md
git commit -m "docs: add tokens, CSS vs Tailwind comparison and screenshots guide"

git push -u origin feature/css
```
На GitHub: **Compare & pull request** → заголовок `feat: responsive CSS, dark theme, Tailwind page` → Create → Merge.

```bash
git checkout main && git pull
git tag pr-05
git push origin pr-05
```
Скриншоти (`docs/screenshots/*.png`) додайте окремим комітом `docs: add pr5 screenshots`, коли їх зробите.
Теги `pr-02`/`pr-03` не ставте, поки ці ПР не виконані.
