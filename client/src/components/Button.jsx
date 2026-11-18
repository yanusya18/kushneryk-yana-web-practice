import { Link } from 'react-router-dom'

/**
 * Button — одна кнопка для всього сайту.
 *  • є prop `to`  → рендериться посилання React Router (<Link>), оформлене як кнопка;
 *  • немає `to`   → звичайна <button>.
 * variant: 'primary' (за замовчуванням) | 'secondary'.
 */
export default function Button({ to, variant = 'primary', type = 'button', children, ...props }) {
  const className = variant === 'secondary' ? 'button button--secondary' : 'button'

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
