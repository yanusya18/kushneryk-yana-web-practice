import ContactForm from '../components/ContactForm.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function ContactsPage() {
  useDocumentTitle('Контакти')

  return (
    <main className="container">
      <h1>Контакти</h1>

      <section aria-labelledby="contact-form-title">
        <h2 id="contact-form-title">Напишіть нам</h2>
        <ContactForm />
      </section>

      <section aria-labelledby="find-title">
        <h2 id="find-title">Як нас знайти</h2>
        <address>
          вул. Прикладна, 1, м. Київ
          <br />
          <a href="tel:+380000000000">+380 00 000 00 00</a>
          <br />
          <a href="mailto:hello@example.com">hello@example.com</a>
        </address>
        <p>
          Працюємо щодня з <time dateTime="08:00">08:00</time> до <time dateTime="22:00">22:00</time>.
        </p>
        <iframe
          title="Мапа розташування коворкінгу"
          src="https://www.openstreetmap.org/export/embed.html?bbox=30.5100%2C50.4400%2C30.5400%2C50.4600&layer=mapnik&marker=50.4501%2C30.5234"
          width="600"
          height="350"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  )
}
