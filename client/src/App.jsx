import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'

/**
 * Code splitting: React.lazy + динамічний import() — кожна сторінка збирається в окремий JS-файл
 * і завантажується лише коли користувач на неї переходить. Менший початковий бандл → швидший LCP.
 * Головна сторінка підключена звичайним import: це точка входу, її потрібно показати одразу.
 */
const CatalogPage = lazy(() => import('./pages/CatalogPage.jsx'))
const WorkspacePage = lazy(() => import('./pages/WorkspacePage.jsx'))
const ContactsPage = lazy(() => import('./pages/ContactsPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

/**
 * Маршрути сайту. Усі сторінки вкладені в Layout (шапка + <Outlet/> + футер).
 *   /            головна
 *   /catalog     каталог
 *   /items/:id   деталі місця (:id — параметр адреси)
 *   /contacts    контакти
 *   *            будь-яка інша адреса → 404
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="items/:id" element={<WorkspacePage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
