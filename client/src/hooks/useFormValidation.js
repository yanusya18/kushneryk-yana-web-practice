import { useState } from 'react'

/**
 * useFormValidation — стан контрольованої форми + правила валідації.
 *
 * Що робить:
 *  • зберігає значення полів (values) і які поля користувач уже «торкався» (touched);
 *  • validate(rules) обчислює помилки: показуються лише для «торкнутих» полів,
 *    але isValid враховує ВСІ поля (за ним блокується кнопка відправки);
 *  • setError(name, text) — помилка, що прийшла не з правил (напр., від сервера).
 *
 * Правила (rules) передаються у validate, а не в сам хук, бо вони можуть залежати
 * від даних, які залежать від значень форми (зайняті години залежать від обраної дати).
 *
 * Значення чекбокса зберігається як 'on' або '' (як у ПР 6).
 */
export function useFormValidation(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState(null) // { name, message } | null

  function handleChange(event) {
    const { name, type, checked, value } = event.target
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? (checked ? 'on' : '') : value }))
    setServerError(null) // користувач змінив дані — стара помилка від сервера неактуальна
  }

  function handleBlur(event) {
    const { name } = event.target
    setTouched((previous) => ({ ...previous, [name]: true }))
  }

  /** Обчислює помилки для переданих правил (чиста функція від поточного стану). */
  function validate(rules) {
    const names = Object.keys(rules)
    const all = {}
    for (const name of names) {
      all[name] = rules[name](values[name], values)
    }
    const isValid = names.every((name) => all[name] === '')

    const visible = {}
    for (const name of names) {
      visible[name] = touched[name] ? all[name] : ''
    }
    if (serverError) visible[serverError.name] = serverError.message

    return { errors: visible, isValid }
  }

  function touchAll(names) {
    setTouched(Object.fromEntries(names.map((name) => [name, true])))
  }

  function reset(nextValues = initialValues) {
    setValues(nextValues)
    setTouched({})
    setServerError(null)
  }

  function setError(name, message) {
    setServerError({ name, message })
  }

  return { values, handleChange, handleBlur, validate, touchAll, reset, setError }
}
