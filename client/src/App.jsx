import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ContactsPage from './pages/ContactsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import WorkspacePage from './pages/WorkspacePage.jsx'

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
