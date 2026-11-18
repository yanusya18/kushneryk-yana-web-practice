/** Спільні шаблони й допоміжні функції валідації. */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const PHONE_PATTERN = /^\+380\d{9}$/
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Чи є значення «простим об'єктом» (тіло запиту має бути саме таким). */
export function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Перевіряє, що рядок — реальна календарна дата (а не 2026-02-31). */
export function isValidDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
}

/** Збирає помилки в масив [{ field, message }]. */
export function createErrorCollector() {
  const errors = []
  return { errors, add: (field, message) => errors.push({ field, message }) }
}

/** Додатне ціле число (для id в адресі). Повертає число або null. */
export function parseId(raw) {
  return /^\d+$/.test(raw ?? '') && Number(raw) > 0 ? Number(raw) : null
}
