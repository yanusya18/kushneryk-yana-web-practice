#!/usr/bin/env bash
# Створює Issues для ПР 1 через GitHub CLI (https://cli.github.com).
# Перед запуском: gh auth login; перебуваєте в папці репозиторію.
set -e

gh label create docs  --color 0075ca --force >/dev/null
gh label create setup --color 5319e7 --force >/dev/null
gh label create git   --color e99695 --force >/dev/null

issue() { gh issue create --title "$1" --body "$2" --label "$3"; }

issue "Аналіз 3 конкурентів" "3 сайти, по 2 сильні й 2 слабкі сторони — у docs/TZ.md" docs
issue "Мета, аудиторія, 3 сценарії використання" "Розділ 1 у docs/TZ.md" docs
issue "Карта сайту" "Схема сторінок у docs/TZ.md" docs
issue "Функціональні вимоги (≥ 8)" "Таблиця FR у docs/TZ.md" docs
issue "Нефункціональні вимоги" "Адаптивність, швидкодія, доступність" docs
issue "Стек технологій і структура даних" "Сутності та поля в docs/TZ.md" docs
issue "Створити репозиторій і структуру папок" "README, .gitignore (Node), MIT, docs/ client/ server/" setup
issue "Налаштувати git config, перший коміт і push" "user.name, user.email, push в main" setup
issue "Гілка docs/tz і Pull Request" "PR злито в main" git
issue "Створити дошку GitHub Projects" "Колонки To do / In progress / Done" setup
issue "Поставити тег pr-01" "git tag pr-01 і git push --tags" git
issue "Запис у щоденнику практики ПР 1" "Дата, що зроблено, коміти, години" docs
echo "Готово: Issues створено."
