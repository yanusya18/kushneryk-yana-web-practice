import ContactForm from '../components/ContactForm.jsx'
import { useSeo } from '../hooks/useSeo.js'

export default function ContactsPage() {
  useSeo({
    title: 'Контакти',
    description: 'Контакти коворкінгу «Простір»: адреса, телефон, email та форма зв’язку. Працюємо щодня з 08:00 до 22:00.',
  })

  return (
    <main id="main-content" tabIndex={-1} className="container">
      <h1>Контакти</h1>

      <section aria-labelledby="contact-form-title">
        <h2 id="contact-form-title">Напишіть нам</h2>
        <ContactForm />
      </section>

      <section aria-labelledby="find-title">
        <h2 id="find-title">Як нас знайти</h2>
        <address>
          <a href="https://maps.google.com/maps?udm&fvr=1&pvq=IgYKABACGAMyjAVDQkFRQVJnSUloTUl4ZW1LemNtU21BTVZxQ1FRQ0IwcjJBcl9LQUV5cmdNU3F3TXZZV05zYXo5ellUMU1KbUZwUFVSRGFITlRSWGRwTnpad1NFNTVXa3RaUVhoWVFrWnhTVVJJV0VoUVR6Uk5XVUZEU1VORFFVVlJSa0p2UTJKSFZTWmpiejB4Sm1GelpUMHlKbWRqYkdsa1BVTnFORXREVVdsQmRIWllXRUpvUXpKQlVrbDBRVXBqT0ZOVlVsRnhTSHBSYm14Nk1qWkxhMlV6TkdwQmNURkRXVFpDY1ZRME5tZEpYMUJKVGtocVRsYzBaVzFvV0haU2EyNHRTelpVTW1Kd1IyZEpYekJvUVVNNFVEaElRVkVtWldrOWRWTm1MV0Z2VjNCRlMycEtkMUJCVUhFM1EzSXRRVGdtYkdGaVpXdzlabkpsWlY5d2MxOTNaV0p6YVhSbEptTnBaRDFEUVVGVFYzVlNiM056UlU5dldERXlhMmMzUlZGd2VHbEZPR1J5WTFkT2JYTkhTV3RsYVdwS05qZENhazUwY21wUVgwNHdWelJPZUVoUFkyVmpSMDQzT0hGSk5EQmlaaTFpTUdkUGIxaFVSMHd3UldkYWFVbHVVQzFrTUc1b1RVVlFjWHBVVURBNVZtZDJRMnRwU3pKM1VXNHdSbkpUWVhSNlgxZzFTSGNtWTJObFBUSW1ZMkYwWldkdmNuazlZV055WTNCZmRqRmZNekltYzJsblBVRlBSRFkwWHpNNFpUQjZYM0pVVTNneWNrMXVRaTFRWlVKYVQySjVXRWhRZVZFbVlXUjFjbXc5T0FGYUZ3Z0JFaE1JeGVtS3pjbVNtQU1WcUNRUUNCMHIyQXJfOiUweDQwZDRjZmNhMjUwMDVjNTc6MHgxZGQ1MDRmMzgwZTZiMTIzSh3QutC-0LLQvtGA0LrRltC90LPQuCDQutC40ZfQsokBI7HmgPME1R0&vet=10CAAQoqAOahcKEwjgvNbOyZKYAxUAAAAAHQAAAAAQHg..i&cs=0&um=1&ie=UTF-8&fb=1&gl=ua&sa=X&ftid=0x40d4cfca25005c57:0x1dd504f380e6b123" target="_blank" rel="noopener noreferrer">
            вулиця Михайла Грушевського, 3, Київ, 01001
          </a>
          <br />
          <a href="tel:+380951786891">+380951786891</a>
          <br />
          <a href="mailto:yana.kushneryk.volod@fclnup.if.ua">yana.kushneryk.volod@fclnup.if.ua</a>
        </address>
        <p>
          Працюємо щодня з <time dateTime="08:00">08:00</time> до <time dateTime="22:00">22:00</time>.
        </p>
        <iframe
          title="Мапа розташування коворкінгу"
          src="https://maps.google.com/maps?q=%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F%20%D0%9C%D0%B8%D1%85%D0%B0%D0%B9%D0%BB%D0%B0%20%D0%93%D1%80%D1%83%D1%88%D0%B5%D0%B2%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE%2C%203%2C%20%D0%9A%D0%B8%D1%97%D0%B2%2C%2001001&output=embed"
          width="600"
          height="350"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  )
}
