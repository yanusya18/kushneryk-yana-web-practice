import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getWorkspaceById } from '../api/api.js'
import BookingForm from '../components/BookingForm.jsx'
import Button from '../components/Button.jsx'
import Modal from '../components/Modal.jsx'
import Picture from '../components/Picture.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { useJsonLd, useSeo } from '../hooks/useSeo.js'
import { useFetch } from '../hooks/useFetch.js'
import { imageUrl } from '../utils/images.js'
import { AMENITY_LABELS, formatCapacity, formatDate, TYPE_LABELS } from '../utils/format.js'
import { buildWorkspaceDescription, buildWorkspaceJsonLd, getSiteUrl } from '../utils/seo.js'

export default function WorkspacePage() {
  const { id } = useParams() // значення з адреси /items/:id
  const [confirmation, setConfirmation] = useState(null) // дані бронювання для модального вікна

  // fetcher залежить від id: змінився id → useFetch автоматично завантажить інше місце
  const fetchWorkspace = useCallback(() => (/^\d+$/.test(id) ? getWorkspaceById(id) : Promise.resolve(null)), [id])
  const { data: workspace, loading, error, refetch } = useFetch(fetchWorkspace)

  // Унікальні title/description для кожного місця; для неіснуючого id — noindex
  const notFound = !loading && !error && workspace === null
  useSeo({
    title: workspace?.name ?? (notFound ? 'Місце не знайдено' : 'Робоче місце'),
    description: workspace ? buildWorkspaceDescription(workspace) : 'Сторінка робочого місця коворкінгу «Простір».',
    noindex: notFound,
  })
  // Структуровані дані Schema.org (Product + Offer) — лише для сторінки існуючого місця
  const siteUrl = getSiteUrl()
  useJsonLd(
    workspace
      ? buildWorkspaceJsonLd(workspace, {
          siteUrl,
          imageUrl: new URL(imageUrl(`${workspace.image}-800.jpg`), siteUrl).href,
        })
      : null,
  )

  return (
    <main id="main-content" tabIndex={-1} className="container page-with-aside">
      <nav className="breadcrumbs" aria-label="Хлібні крихти">
        <ol>
          <li><Link to="/">Головна</Link></li>
          <li><Link to="/catalog">Каталог</Link></li>
          <li aria-current="page">{workspace && !loading ? workspace.name : 'Робоче місце'}</li>
        </ol>
      </nav>

      {loading && (
        <StateMessage variant="loading">
          <p>Завантажуємо дані місця…</p>
        </StateMessage>
      )}

      {!loading && error && (
        <StateMessage variant="error" title="Не вдалося завантажити дані місця.">
          <p>{error.message}</p>
          <p>
            <Button onClick={refetch}>Спробувати ще раз</Button>
          </p>
        </StateMessage>
      )}

      {!loading && !error && workspace === null && (
        <StateMessage variant="error" title="Таке робоче місце не знайдено.">
          <p>Можливо, посилання застаріло. Перегляньте актуальні місця в каталозі.</p>
          <p>
            <Button to="/catalog">До каталогу</Button>
          </p>
        </StateMessage>
      )}

      {!loading && !error && workspace && (
        <>
          <article>
            <h1>{workspace.name}</h1>
            <p>
              {TYPE_LABELS[workspace.type] ?? workspace.type} · {formatCapacity(workspace.capacity)} ·{' '}
              <data value={workspace.pricePerHour}>{workspace.pricePerHour} грн</data> / година
            </p>

            <div className="gallery">
              <figure>
                <Picture
                  name={workspace.image}
                  widths={[400, 800]}
                  fallbackWidth={800}
                  width={800}
                  height={600}
                  alt={workspace.imageAlt}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
                <figcaption>{workspace.name}</figcaption>
              </figure>
              <figure>
                <Picture
                  name="hero"
                  widths={[480, 960, 1440]}
                  fallbackWidth={960}
                  width={960}
                  height={540}
                  alt="Загальний вигляд open space коворкінгу"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <figcaption>Загальний простір open space</figcaption>
              </figure>
            </div>

            <section aria-labelledby="about-title">
              <h2 id="about-title">Опис</h2>
              <p>{workspace.description}</p>
            </section>

            <section aria-labelledby="amenities-title">
              <h2 id="amenities-title">Обладнання</h2>
              <ul>
                {workspace.amenities.map((code) => (
                  <li key={code}>{AMENITY_LABELS[code] ?? code}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="booking-title">
              <h2 id="booking-title">Забронювати місце</h2>
              {/* key: при переході на інше місце форма створюється заново з порожніми полями */}
              <BookingForm key={workspace.id} workspace={workspace} onBooked={setConfirmation} />
            </section>
          </article>

          <aside className="panel" aria-labelledby="rules-title">
            <h2 id="rules-title">Умови бронювання</h2>
            <ul>
              <li>Бронювання на повні години, мінімум одна година.</li>
              <li>
                Безкоштовне скасування за <time dateTime="PT24H">24 години</time> до початку.
              </li>
              <li>
                Робочі години: <time dateTime="08:00">08:00</time>–<time dateTime="22:00">22:00</time>.
              </li>
            </ul>
          </aside>
        </>
      )}

      <Modal open={confirmation !== null} onClose={() => setConfirmation(null)} title="Бронювання підтверджено">
        {confirmation && workspace && (
          <dl className="summary">
            <div><dt>Номер бронювання</dt><dd>{confirmation.id}</dd></div>
            <div><dt>Місце</dt><dd>{workspace.name}</dd></div>
            <div><dt>Дата</dt><dd>{formatDate(confirmation.date)}</dd></div>
            <div><dt>Час</dt><dd>{confirmation.startTime}–{confirmation.endTime}</dd></div>
            <div><dt>Вартість</dt><dd>{confirmation.totalPrice} грн</dd></div>
            <div><dt>На ім’я</dt><dd>{confirmation.customerName}</dd></div>
          </dl>
        )}
      </Modal>
    </main>
  )
}
