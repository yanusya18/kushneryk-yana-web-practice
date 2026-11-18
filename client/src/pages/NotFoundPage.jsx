import Button from '../components/Button.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function NotFoundPage() {
  useDocumentTitle('Сторінку не знайдено')

  return (
    <main className="container">
      <h1>Сторінку не знайдено</h1>
      <p>Схоже, такої сторінки не існує або її було переміщено.</p>
      <p>
        <Button to="/">Повернутися на головну</Button>
      </p>
    </main>
  )
}
