import { useNavigate } from 'react-router-dom'
import Button from './Button.jsx'
import Card from './Card.jsx'
import StateMessage from './StateMessage.jsx'

/**
 * CardList — сітка карток із трьома станами: завантаження, помилка, порожньо.
 *
 * Делегування подій: один обробник кліку на контейнері замість обробника на кожній картці.
 * Клік «спливає» від внутрішнього елемента до контейнера, а closest('.card') знаходить картку.
 *
 * @param emptyContent  що показати, коли даних немає (children для StateMessage)
 */
export default function CardList({ items, loading, error, onRetry, emptyTitle, emptyContent }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <StateMessage variant="loading">
        <p>Завантажуємо робочі місця…</p>
      </StateMessage>
    )
  }

  if (error) {
    return (
      <StateMessage variant="error" title="Не вдалося завантажити каталог.">
        <p>{error.message}</p>
        <p>
          <Button onClick={onRetry}>Спробувати ще раз</Button>
        </p>
      </StateMessage>
    )
  }

  if (items.length === 0) {
    return (
      <StateMessage title={emptyTitle}>
        {emptyContent}
      </StateMessage>
    )
  }

  function handleClick(event) {
    const card = event.target.closest('.card')
    if (!card || event.target.closest('a, button')) return // власні посилання працюють як зазвичай
    navigate(card.dataset.href)
  }

  return (
    // Клавіатурі доступне посилання всередині картки, тому onClick на контейнері — лише зручність для миші
    <div className="card-grid card-grid--clickable" onClick={handleClick}>
      {items.map((workspace) => (
        <Card key={workspace.id} workspace={workspace} />
      ))}
    </div>
  )
}
