import Button from '../components/Button.jsx'
import { useSeo } from '../hooks/useSeo.js'

export default function NotFoundPage() {
  // noindex: сторінка помилки не повинна потрапляти в пошукову видачу
  useSeo({ title: 'Сторінку не знайдено', description: 'Такої сторінки не існує або її було переміщено.', noindex: true })

  return (
    <main id="main-content" tabIndex={-1} className="container">
      <h1>Сторінку не знайдено</h1>
      <p>Схоже, такої сторінки не існує або її було переміщено.</p>
      <p>
        <Button to="/">Повернутися на головну</Button>
      </p>
    </main>
  )
}
