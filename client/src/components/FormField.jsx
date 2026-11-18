import { useId } from 'react'

/**
 * FormField — одне поле форми: label + елемент керування + місце під текст помилки.
 *
 * Доступність:
 *  • label зв'язано з полем через htmlFor/id (id генерує useId — унікальний на сторінці);
 *  • текст помилки зв'язано з полем через aria-describedby;
 *  • aria-invalid="true" з'являється лише коли є помилка.
 *
 * @param as      'input' (за замовчуванням) | 'select' | 'textarea'
 * @param counter необов'язковий лічильник символів під полем
 */
export default function FormField({ label, name, type = 'text', as = 'input', value, onChange, onBlur, error, counter, children, ...rest }) {
  const id = useId()
  const errorId = `${id}-error`
  const isCheckbox = type === 'checkbox'
  const Control = as

  const common = {
    id,
    name,
    onChange,
    onBlur,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': errorId,
    ...rest,
  }

  const control = isCheckbox ? (
    <input type="checkbox" checked={value === 'on'} {...common} />
  ) : (
    <Control type={as === 'input' ? type : undefined} value={value} {...common}>
      {children}
    </Control>
  )

  return (
    <p>
      {isCheckbox ? (
        <>
          {control}
          <label htmlFor={id}>{label}</label>
        </>
      ) : (
        <>
          <label htmlFor={id}>{label}</label>
          {control}
        </>
      )}
      {counter && (
        <span className="field-counter" aria-hidden="true">
          {counter}
        </span>
      )}
      <span className="field-error" id={errorId}>
        {error}
      </span>
    </p>
  )
}
