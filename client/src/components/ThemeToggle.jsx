import { useTheme } from '../hooks/useTheme.js'

/** Перемикач світлої/темної теми. aria-pressed повідомляє екранним читачам, чи ввімкнена темна. */
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button className="theme-toggle" type="button" aria-pressed={isDark} onClick={toggle}>
      <span className="theme-toggle__icon" aria-hidden="true" />
      <span className="theme-toggle__label">Темна тема</span>
    </button>
  )
}
