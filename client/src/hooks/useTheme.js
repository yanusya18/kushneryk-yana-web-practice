import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

const THEME_KEY = 'coworking:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function readSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'dark' || saved === 'light' ? saved : null
  } catch {
    return null // localStorage недоступний (приватний режим)
  }
}

/** Підписка на зміну системної теми (useSyncExternalStore — «правильний» спосіб читати зовнішні дані). */
function subscribeToSystemTheme(callback) {
  const query = window.matchMedia(DARK_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const getSystemDark = () => window.matchMedia(DARK_QUERY).matches

/**
 * useTheme: тема зі збереженням у localStorage.
 *  • Якщо користувач ще не обирав — діє системна тема (prefers-color-scheme).
 *  • Після вибору атрибут data-theme на <html> перекриває системну (див. tokens.css).
 */
export function useTheme() {
  const [saved, setSaved] = useState(readSavedTheme)
  const systemDark = useSyncExternalStore(subscribeToSystemTheme, getSystemDark, () => false)
  const isDark = (saved ?? (systemDark ? 'dark' : 'light')) === 'dark'

  useEffect(() => {
    if (saved) document.documentElement.dataset.theme = saved
  }, [saved])

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark'
    setSaved(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* без збереження */
    }
  }, [isDark])

  return { isDark, toggle }
}
