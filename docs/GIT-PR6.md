# Git-інструкція для ПР 6

```bash
git checkout main && git pull
git checkout -b feature/js

git add client/assets/data
git commit -m "feat: add workspaces and demo bookings JSON data"
git add client/assets/js/utils.js client/assets/js/booking.js
git commit -m "feat: add booking logic (overlap check, price) and utils"
git add client/assets/js/api.js
git commit -m "feat: add api module with fetch, async/await and demo states"
git add client/assets/js/form.js
git commit -m "feat: add reusable form validation with aria-describedby"
git add client/assets/js/ui.js client/assets/js/main.js
git commit -m "feat: add burger menu, theme toggle, modal and event delegation"
git add client/assets/js/catalog.js client/static/catalog.html
git commit -m "feat: render catalog dynamically with search, filter, sort and debounce"
git add client/assets/js/workspace.js client/static/workspace.html
git commit -m "feat: add workspace page with date and time booking"
git add client/assets/js/contacts.js client/static/contacts.html client/static/index.html client/static/404.html
git commit -m "feat: add contacts validation and connect scripts to pages"
git add client/assets/css/components.css
git commit -m "feat: add styles for interactive elements, states and dialog"
git add docs CHANGELOG-PR-06.md README.md
git commit -m "docs: add JS guide, defense notes and screenshots guide for PR6"

git push -u origin feature/js
```
На GitHub: **Compare & pull request** → `feat: JavaScript interactivity, validation and booking` → Create → Merge.

```bash
git checkout main && git pull
git tag pr-06
git push origin pr-06
```
Скриншоти й GIF (`docs/screenshots/`) — окремим комітом `docs: add pr6 screenshots and demo gif`.
