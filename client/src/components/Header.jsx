import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

// match — коли пункт вважається поточним (aria-current="page"). Каталог активний і на сторінці місця.
const NAV_ITEMS = [
  { to: '/', label: 'Головна', match: (path) => path === '/' },
  { to: '/catalog', label: 'Каталог', match: (path) => path.startsWith('/catalog') || path.startsWith('/items') },
  { to: '/#pricing', label: 'Послуги та ціни', match: () => false },
  { to: '/contacts', label: 'Контакти', match: (path) => path.startsWith('/contacts') },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  const { pathname } = useLocation()

  // Esc закриває меню й повертає фокус на кнопку; на широкому екрані меню завжди видиме — скидаємо стан
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    function handleDesktop(event) {
      if (event.matches) setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    desktop.addEventListener('change', handleDesktop)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      desktop.removeEventListener('change', handleDesktop)
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to="/">
          Простір
        </Link>

        <div className="site-header__controls">
          <ThemeToggle />
          <button
            ref={toggleRef}
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="nav-toggle__icon" aria-hidden="true" />
            <span className="nav-toggle__label">{menuOpen ? 'Закрити' : 'Меню'}</span>
          </button>
        </div>

        {/* Клік по будь-якому посиланню закриває меню (делегування на <nav>) */}
        <nav
          id="site-nav"
          className={menuOpen ? 'is-open' : undefined}
          aria-label="Основна навігація"
          onClick={(event) => event.target.closest('a') && setMenuOpen(false)}
        >
          <ul className="nav-list">
            {NAV_ITEMS.map(({ to, label, match }) => (
              <li key={to}>
                <Link to={to} aria-current={match(pathname) ? 'page' : undefined}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
