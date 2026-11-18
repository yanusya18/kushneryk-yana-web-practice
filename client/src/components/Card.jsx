import Button from './Button.jsx'
import Picture from './Picture.jsx'
import { formatCapacity, TYPE_LABELS } from '../utils/format.js'

/** Картка робочого місця (props → розмітка). data-href потрібен для делегування кліку в CardList. */
export default function Card({ workspace }) {
  const { id, name, type, description, pricePerHour, capacity, image, imageAlt } = workspace
  const href = `/items/${id}`

  return (
    <article className="card" data-href={href}>
      <figure>
        <Picture
          name={image}
          widths={[400, 800]}
          fallbackWidth={800}
          width={800}
          height={600}
          alt={imageAlt}
          sizes="(min-width: 1280px) 384px, (min-width: 768px) 33vw, 100vw"
        />
        <figcaption>{TYPE_LABELS[type] ?? type}</figcaption>
      </figure>
      <h3>{name}</h3>
      <p>{description}</p>
      <p>
        <data value={pricePerHour}>{pricePerHour} грн</data> / година · {formatCapacity(capacity)}
      </p>
      <p>
        <Button to={href} variant="secondary">
          Детальніше та бронювання
        </Button>
      </p>
    </article>
  )
}
