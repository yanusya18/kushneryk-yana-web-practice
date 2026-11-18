/**
 * StateMessage — блок стану: завантаження, помилка, порожній результат, успіх.
 * role="status" (або "alert" для помилки) повідомляє про зміну екранним читачам.
 */
export default function StateMessage({ variant = 'info', title, children }) {
  const className = ['state', variant === 'error' && 'state--error', variant === 'success' && 'state--success']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} role={variant === 'error' ? 'alert' : 'status'}>
      {variant === 'loading' && <span className="spinner" aria-hidden="true" />}
      {title && (
        <p>
          <strong>{title}</strong>
        </p>
      )}
      {children}
    </div>
  )
}
