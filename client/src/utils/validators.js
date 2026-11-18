/**
 * validators.js — чисті функції перевірки полів: повертають текст помилки або ''.
 * Клієнтська валідація — це зручність, а не безпека: ті самі перевірки
 * потрібні на сервері (ПР 8).
 */

// email: щось@щось.домен (без пробілів, домен щонайменше з 2 літер)
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// український номер: +380 і рівно 9 цифр, напр. +380501234567
export const PHONE_PATTERN = /^\+380\d{9}$/

export function validateName(value) {
  const name = value.trim()
  if (!name) return 'Вкажіть ім’я.'
  if (name.length < 2) return 'Ім’я має містити щонайменше 2 символи.'
  if (name.length > 60) return 'Ім’я не може бути довшим за 60 символів.'
  return ''
}

export function validateEmail(value) {
  const email = value.trim()
  if (!email) return 'Вкажіть email.'
  if (!EMAIL_PATTERN.test(email)) return 'Введіть коректний email, наприклад name@example.com.'
  return ''
}

export function validatePhone(value, { required = true } = {}) {
  const phone = value.trim()
  if (!phone) return required ? 'Вкажіть телефон у форматі +380XXXXXXXXX.' : ''
  if (!PHONE_PATTERN.test(phone)) return 'Телефон має бути у форматі +380XXXXXXXXX (9 цифр після +380).'
  return ''
}

export function validateRequired(value, message) {
  return value.trim() ? '' : message
}

export function validateConsent(value) {
  return value ? '' : 'Потрібна згода на обробку персональних даних.'
}
