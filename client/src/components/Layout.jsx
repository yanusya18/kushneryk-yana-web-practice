import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import StateMessage from './StateMessage.jsx'

/**
 * Layout — спільна «рамка» сторінок: skip-link + шапка + <Outlet /> + футер.
 *
 * Доступність односторінкового застосунку (SPA):
 *  • skip-link «Перейти до основного вмісту» — перший елемент, що отримує фокус по Tab;
 *  • при переході на нову сторінку браузер НЕ перезавантажується, тому фокус і оголошення
 *    потрібно керувати вручну: повертаємо фокус на початок вмісту й повідомляємо назву сторінки.
 */
export default function Layout() {
  const { pathname, hash } = useLocation()
  const focusAnchorRef = useRef(null)
  const isFirstRender = useRef(true)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }

    // На першому відображенні сторінки нічого не оголошуємо й не рухаємо фокус
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!hash) focusAnchorRef.current?.focus({ preventScroll: true })
    // Дочекаємось, поки useSeo оновить title нової сторінки, і оголосимо його екранним читачам
    const timer = setTimeout(() => setAnnouncement(document.title), 100)
    return () => clearTimeout(timer)
  }, [pathname, hash])

  function handleSkipClick(event) {
    event.preventDefault() // без #main-content в адресі
    const main = document.getElementById('main-content')
    main?.focus()
    main?.scrollIntoView()
  }

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={handleSkipClick}>
        Перейти до основного вмісту
      </a>
      <Header />
      {/* Порожній «якір фокуса»: після навігації наступний Tab починається з вмісту нової сторінки */}
      <div ref={focusAnchorRef} tabIndex={-1} aria-hidden="true" className="focus-anchor" />
      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>
      {/* Suspense показує запасний вміст, поки завантажується lazy-сторінка (code splitting) */}
      <Suspense
        fallback={
          <main id="main-content" tabIndex={-1} className="container">
            <StateMessage variant="loading">
              <p>Завантажуємо сторінку…</p>
            </StateMessage>
          </main>
        }
      >
        <Outlet />
      </Suspense>
      <Footer />
    </>
  )
}
