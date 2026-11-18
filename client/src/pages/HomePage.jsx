import { Link } from 'react-router-dom'
import { getWorkspaces } from '../api/api.js'
import Button from '../components/Button.jsx'
import CardList from '../components/CardList.jsx'
import Picture from '../components/Picture.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useFetch } from '../hooks/useFetch.js'

const BENEFITS = [
  { title: 'Природне світло', text: 'Великі вікна та продумане освітлення без втоми для очей.' },
  { title: 'Швидкий інтернет', text: 'Стабільне підключення для дзвінків, роботи з файлами та відеоконференцій.' },
  { title: 'Гнучкі умови', text: 'Бронюйте місце на годину, день або довше — без договорів і дзвінків.' },
]

const PRICES = [
  { format: 'Open space', audience: 'Фрилансери, студенти', price: '70 грн' },
  { format: 'Фіксоване місце', audience: 'Постійна робота', price: '90 грн' },
  { format: 'Приватний кабінет', audience: 'Команди до 4 осіб', price: '220 грн' },
  { format: 'Переговорна', audience: 'Зустрічі до 8 осіб', price: '300 грн' },
]

export default function HomePage() {
  useDocumentTitle('Коворкінг із бронюванням робочих місць')
  const { data, loading, error, refetch } = useFetch(getWorkspaces)
  const popular = (data ?? []).slice(0, 3)

  return (
    <main className="container">
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Коворкінг, де зручно працювати</h1>
        <p>
          Світлий простір, швидкий інтернет і тиша для роботи. Оберіть місце та забронюйте його на потрібні дату й час
          за кілька хвилин.
        </p>
        <p>
          <Button to="/catalog">Обрати робоче місце</Button>
        </p>
        <Picture
          name="hero"
          widths={[480, 960, 1440]}
          fallbackWidth={960}
          width={960}
          height={540}
          alt="Світлий open space коворкінгу з робочими столами та ноутбуками"
          sizes="100vw"
          priority
        />
      </section>

      <section aria-labelledby="benefits-title">
        <h2 id="benefits-title">Чому обирають наш коворкінг</h2>
        <div className="feature-grid">
          {BENEFITS.map(({ title, text }) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="popular-title">
        <h2 id="popular-title">Популярні місця</h2>
        <CardList
          items={popular}
          loading={loading}
          error={error}
          onRetry={refetch}
          emptyTitle="Поки що немає доступних робочих місць."
          emptyContent={<p>Зазирніть пізніше.</p>}
        />
        <p>
          <Link to="/catalog">Усі робочі місця</Link>
        </p>
      </section>

      <section aria-labelledby="steps-title">
        <h2 id="steps-title">Як забронювати місце</h2>
        <ol className="steps">
          <li>Оберіть робоче місце в каталозі.</li>
          <li>Вкажіть дату та час початку й завершення.</li>
          <li>Залиште контакти й отримайте підтвердження.</li>
        </ol>
      </section>

      <section id="pricing" aria-labelledby="pricing-title">
        <h2 id="pricing-title">Послуги та ціни</h2>
        <div className="table-wrap" role="region" aria-labelledby="pricing-title" tabIndex={0}>
          <table>
            <caption>Орієнтовні тарифи (приклад для навчального проєкту)</caption>
            <thead>
              <tr>
                <th scope="col">Формат</th>
                <th scope="col">Для кого</th>
                <th scope="col">Ціна за годину</th>
              </tr>
            </thead>
            <tbody>
              {PRICES.map(({ format, audience, price }) => (
                <tr key={format}>
                  <th scope="row">{format}</th>
                  <td>{audience}</td>
                  <td>{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="panel" aria-labelledby="hours-title">
        <h2 id="hours-title">Години роботи</h2>
        <p>
          Щодня з <time dateTime="08:00">08:00</time> до <time dateTime="22:00">22:00</time>
        </p>
      </aside>
    </main>
  )
}
