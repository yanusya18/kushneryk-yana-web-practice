import { Link } from 'react-router-dom'

/**
 * Button — одна кнопка для всього сайту.
 *  • є prop `to`  → рендериться посилання React Router (<Link>), оформлене як кнопка;
 *  • немає `to`   → звичайна <button>.
 * variant: 'primary' (за замовчуванням) | 'secondary' | 'danger'; size: 'small' для компактних кнопок (напр., у таблиці).
 */
export default function Button({ to, variant = 'primary', size, type = 'button', children, ...props }) {
  const className = ['button', variant !== 'primary' && `button--${variant}`, size === 'small' && 'button--small']
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link className={className} to={to} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button className={className} type={type} {...props}>
      {children}
    </button>
  )
}
