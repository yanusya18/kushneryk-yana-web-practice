# Git-інструкція для ПР 9

```bash
git checkout main && git pull
git checkout -b feature/audit

git add client/assets/images client/src/utils/images.js client/src/components/Picture.jsx
git commit -m "perf: add AVIF images with WebP and JPG fallbacks"
git add client/src/App.jsx client/src/components/Layout.jsx
git commit -m "perf: split routes with React.lazy and Suspense"
git add client/src/utils/seo.js client/src/hooks/useSeo.js client/src/pages client/index.html
git commit -m "feat: add per-route SEO meta, canonical, Open Graph and JSON-LD"
git add client/scripts client/public client/package.json
git commit -m "feat: generate robots.txt and sitemap.xml before build"
git add client/src/app.css
git commit -m "feat: add skip link, focus management and visually-hidden helper"
git add client/vite.config.js client/src/test client/src/utils/*.test.js client/src/components/*.test.jsx
git commit -m "test: add Vitest and React Testing Library tests"
git add docs CHANGELOG-PR-09.md README.md
git commit -m "docs: add audit report template, test checklist and defense notes"

git push -u origin feature/audit
```
Після встановлення залежностей для тестів і прогону Lighthouse/axe:
```bash
git add client/package.json client/package-lock.json
git commit -m "chore: add Vitest and Testing Library dev dependencies"
git add docs/lighthouse docs/AUDIT.md docs/TEST-CHECKLIST.md
git commit -m "docs: add Lighthouse reports before and after, fill audit tables"
git push
```
На GitHub: Pull Request `feature/audit` → `main` → Merge. Потім:
```bash
git checkout main && git pull
git tag pr-09
git push origin pr-09
```
Знайдені під час тестування баги — окремі Issues (мітка `bug`), у комітах-виправленнях пишіть `fix: ... (closes #N)`.
