# Дерево компонентів (ПР 7)

Застосунок: `client/src/`. Стрілка `→` означає «рендерить усередині себе».

```
main.jsx                      — точка входу: підключає CSS, <StrictMode>, <BrowserRouter>
└─ App                        — таблиця маршрутів (<Routes>)
   └─ Layout                  — спільна рамка + прокрутка (<Outlet/> = поточна сторінка)
      ├─ Header
      │   └─ ThemeToggle      — перемикач теми (хук useTheme)
      │
      ├─ [/]            HomePage
      │   ├─ Button, Picture (hero)
      │   └─ CardList ─ Card ─ Picture, Button          (дані: useFetch)
      │       └─ StateMessage (loading / error / empty)
      │
      ├─ [/catalog]     CatalogPage
      │   ├─ FilterForm ─ Button                         (контрольована форма, useDebounce)
      │   └─ CardList ─ Card ─ Picture, Button
      │       └─ StateMessage, Button
      │
      ├─ [/items/:id]   WorkspacePage                    (useParams + useFetch)
      │   ├─ StateMessage, Button                        (loading / error / «не знайдено»)
      │   ├─ Picture ×2
      │   ├─ BookingForm                                 (useFormValidation + useFetch зайнятих годин)
      │   │   ├─ FormField ×7
      │   │   └─ Button ×2
      │   └─ Modal ─ Button                              (<dialog>: підтвердження бронювання)
      │
      ├─ [/contacts]    ContactsPage
      │   └─ ContactForm ─ FormField ×6, Button, StateMessage
      │
      ├─ [/manage]      ManagePage                       (ПР 8: CRUD через API)
      │   ├─ WorkspaceForm ─ FormField ×12, Button       (POST /api/items)
      │   ├─ StateMessage, Button
      │   └─ Modal ─ Button ×2                           (підтвердження видалення)
      │
      ├─ [*]            NotFoundPage ─ Button
      │
      └─ Footer
```

## Компоненти (15) і що вони роблять

| Компонент | Призначення | Основні props | Власний стан (`useState`) |
|---|---|---|---|
| `Layout` | Шапка + `<Outlet/>` + футер, прокрутка до якоря | — | — |
| `Header` | Логотип, навігація, бургер-меню | — | `menuOpen` |
| `Footer` | Нижня навігація й контакти | — | — |
| `ThemeToggle` | Перемикач теми | — | у хуку `useTheme` |
| `Button` | Кнопка або посилання-кнопка | `to`, `variant`, `type`, `onClick` | — |
| `Picture` | Адаптивне зображення (`srcset`, WebP + JPG) | `name`, `widths`, `alt`, `sizes`, `priority` | — |
| `Card` | Картка робочого місця | `workspace` | — |
| `CardList` | Сітка карток + стани loading/error/empty | `items`, `loading`, `error`, `onRetry` | — |
| `StateMessage` | Блок стану (завантаження, помилка, успіх) | `variant`, `title`, `children` | — |
| `Modal` | Модальне вікно на `<dialog>` | `open`, `onClose`, `title` | — |
| `FormField` | Поле форми: label + input + помилка | `label`, `name`, `value`, `error`, `onChange` | — |
| `FilterForm` | Пошук і фільтри каталогу | `filters`, `onChange`, `onReset` | — |
| `BookingForm` | Бронювання на дату й час | `workspace`, `onBooked` | `submitting` + форма |
| `ContactForm` | Контактна форма | — | `result`, `submitting` + форма |
| `WorkspaceForm` | Додавання робочого місця (ПР 8) | `onCreated` | `submitting`, `failure` + форма |

## Власні хуки (`src/hooks/`)

| Хук | Що робить |
|---|---|
| `useFetch(fetcher)` | Завантаження даних: `{ data, loading, error, refetch }` |
| `useFormValidation(initial)` | Значення полів, «торкнуті» поля, обчислення помилок |
| `useDebounce(value, ms)` | Відкладене значення (пошук із затримкою 300 мс) |
| `useTheme()` | Тема + `localStorage` + стеження за системною темою |
| `useDocumentTitle(title)` | `document.title` для кожної сторінки |

## Потік даних

```
api.js (fetch → REST API, ПР 8)
   ↑ викликає
useFetch(getWorkspaces) ──► CatalogPage ──props──► CardList ──props──► Card
                                 ▲
        useState(filters) ◄── FilterForm (onChange)           ← стан піднято у батька
```

Дані ідуть **вниз** через props, події — **вгору** через функції зворотного виклику
(`onChange`, `onReset`, `onBooked`). Це «односпрямований потік даних» React.

## Що перенесено з ПР 6

| Було (чистий JS) | Стало (React) |
|---|---|
| `ui.js`: бургер, тема, модалка | `Header`, `ThemeToggle` + `useTheme`, `Modal` |
| `form.js`: `initFormValidation` | `useFormValidation` + `FormField` + `utils/validators.js` |
| `api.js`: `fetch`, демо-режими, бронювання | `api/api.js` (з ПР 8 — запити до Express API) + `useFetch` |
| `booking.js` | `utils/booking.js` (без змін) |
| `catalog.js`: `render()` вручну | `CatalogPage` (стан → розмітка автоматично) |
| `workspace.js`, `contacts.js` | `WorkspacePage` + `BookingForm`, `ContactsPage` + `ContactForm` |

## Зміни ПР 9
- `App` підключає `CatalogPage`, `WorkspacePage`, `ContactsPage`, `ManagePage`, `NotFoundPage` через `React.lazy` (code splitting); `HomePage` — звичайним імпортом.
- `Layout` отримав skip-link, «якір фокуса», `aria-live`-оголошення назви сторінки й `Suspense` із запасним вмістом.
- `Picture` віддає AVIF → WebP → JPG.
- Сторінки викликають `useSeo` (title/description/canonical/Open Graph/robots); `WorkspacePage` додатково `useJsonLd`.
