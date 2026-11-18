import { useState } from 'react'

/**
 * useFormValidation — стан контрольованої форми + правила валідації.
 *
 * Що робить:
 *  • зберігає значення полів (values) і які поля користувач уже «торкався» (touched);
 *  • validate(rules) обчислює помилки: показуються лише для «торкнутих» полів,
 *    але isValid враховує ВСІ поля (за ним блокується кнопка відправки);
 *  • setError(name, text) / setServerErrors({ поле: текст }) — помилки, що прийшли не з правил (від сервера).
 *
 * Правила (rules) передаються у validate, а не в сам хук, бо вони можуть залежати
 * від даних, які залежать від значень форми (зайняті години залежать від обраної дати).
 *
 * Значення чекбокса зберігається як 'on' або '' (як у ПР 6).
 */
export function useFormValidation(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [serverErrors, setServerErrors] = useState({}) // { поле: текст помилки від сервера }

  function handleChange(event) {
    const { name, type, checked, value } = event.target
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? (checked ? 'on' : '') : value }))
    // користувач змінив дані — старі помилки від сервера неактуальні
    setServerErrors((previous) => (Object.keys(previous).length > 0 ? {} : previous))
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
    Object.assign(visible, serverErrors)

    return { errors: visible, isValid }
  }

  function touchAll(names) {
    setTouched(Object.fromEntries(names.map((name) => [name, true])))
  }

  function reset(nextValues = initialValues) {
    setValues(nextValues)
    setTouched({})
    setServerErrors({})
  }

  function setError(name, message) {
    setServerErrors({ [name]: message })
  }

  return { values, handleChange, handleBlur, validate, touchAll, reset, setError, setServerErrors }
}
