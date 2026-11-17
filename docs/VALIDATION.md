# Перевірка HTML (ПР 4)

## Результат локальної перевірки (під час підготовки архіву)
Усі 5 сторінок перевірені Nu Html Checker (`vnu.jar` — той самий рушій, що й на validator.w3.org):

| Сторінка | Помилки | Попередження |
|---|---|---|
| index.html | 0 | 0 |
| catalog.html | 0 | 0 |
| workspace.html | 0 | 0 |
| contacts.html | 0 | 0 |
| 404.html | 0 | 0 |

> Це **не заміняє** вашу перевірку: методичка вимагає скриншоти з validator.w3.org.

## Як перевірити самій на validator.w3.org
1. Відкрийте https://validator.w3.org/#validate_by_upload
2. **Choose File** → оберіть `client/static/index.html` → **Check**.
3. Очікуваний результат: зелений напис **"Document checking completed. No errors or warnings to show."**
4. Зробіть скриншот → збережіть у `docs/screenshots/validator-index.png`.
5. Повторіть для `catalog.html`, `workspace.html`, `contacts.html`, `404.html`.
6. Для outline: на вкладці **Check by file upload** натисніть **More Options** → увімкніть **Show outline**.

## Локальний запуск (за бажанням)
Потрібна Java. Команда з папки `client/static/`:
```bash
npx vnu-jar-check || java -jar node_modules/vnu-jar/build/dist/vnu.jar *.html
```
Простіше — через пакет:
```bash
npm i -D vnu-jar
java -jar node_modules/vnu-jar/build/dist/vnu.jar client/static/*.html
```
Порожній вивід = помилок немає.

## Скриншоти, які потрібно здати
- [ ] `docs/screenshots/validator-index.png`
- [ ] `docs/screenshots/validator-catalog.png`
- [ ] `docs/screenshots/validator-workspace.png`
- [ ] `docs/screenshots/validator-contacts.png`
- [ ] `docs/screenshots/outline-index.png`
