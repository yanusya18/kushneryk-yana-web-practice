import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

/**
 * Layout — спільна «рамка» сторінок: шапка + <Outlet /> (тут React Router вставляє поточну сторінку) + футер.
 * Також керує прокруткою: на нову сторінку — вгору, на якір (#pricing) — до елемента.
 */
export default function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
