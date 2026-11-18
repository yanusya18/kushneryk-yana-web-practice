import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applySeo, setJsonLd } from '../utils/seo.js'

/**
 * useSeo — оновлює title, description, canonical, robots та Open Graph при відкритті сторінки.
 * path береться з поточного маршруту, тож canonical завжди відповідає адресі сторінки.
 */
export function useSeo({ title, description, noindex = false }) {
  const { pathname } = useLocation()
  useEffect(() => {
    applySeo({ title, description, path: pathname, noindex })
  }, [title, description, noindex, pathname])
}

/** useJsonLd — додає JSON-LD на час життя сторінки й прибирає його при виході. */
export function useJsonLd(data) {
  // JSON.stringify як залежність: об'єкт створюється заново при кожному рендері
  const serialized = data ? JSON.stringify(data) : null
  useEffect(() => {
    setJsonLd(serialized ? JSON.parse(serialized) : null)
    return () => setJsonLd(null)
  }, [serialized])
}
