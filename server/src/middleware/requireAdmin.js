import { timingSafeEqual } from 'node:crypto'
import { HttpError } from '../errors.js'

/**
 * requireAdmin — захист запитів, що змінюють дані (POST/PUT/DELETE /api/items).
 * Якщо ADMIN_TOKEN у середовищі не задано (локальна розробка) — перевірка вимкнена.
 * Інакше клієнт мусить надіслати заголовок X-Admin-Token з тим самим значенням, інакше — 401.
 * Порівняння через timingSafeEqual не дає вгадувати токен за часом відповіді.
 */
export function requireAdmin({ adminToken }) {
  const expected = Buffer.from(adminToken)
  return (req, res, next) => {
    if (!adminToken) return next()
    const provided = Buffer.from(String(req.get('x-admin-token') ?? ''))
    const ok = provided.length === expected.length && timingSafeEqual(provided, expected)
    if (!ok) throw new HttpError(401, 'Потрібен токен адміністратора (заголовок X-Admin-Token).')
    return next()
  }
}
