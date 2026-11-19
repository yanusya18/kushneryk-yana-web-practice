/**
 * cors.js — перевірка дозволених походжень (origins) для CORS.
 * У списку CORS_ORIGIN можна вказувати точні адреси або шаблони із зірочкою:
 *   https://coworking.vercel.app          — лише ця адреса
 *   https://*.vercel.app                  — будь-який піддомен (корисно для preview-деплоїв Pull Request)
 */
function toMatcher(pattern) {
  if (!pattern.includes('*')) return (origin) => origin === pattern
  // Екрануємо спецсимволи регулярного виразу, а «*» замінюємо на допустимі символи піддомену
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[a-z0-9-]+')
  const regex = new RegExp(`^${escaped}$`, 'i')
  return (origin) => regex.test(origin)
}

export function createOriginChecker(patterns) {
  const matchers = patterns.map(toMatcher)
  // cors викликає callback(помилка, чи_дозволено). Запити без Origin (Postman, curl, health-check) пропускаємо.
  return (origin, callback) => {
    if (!origin) return callback(null, true)
    return callback(null, matchers.some((matches) => matches(origin)))
  }
}
