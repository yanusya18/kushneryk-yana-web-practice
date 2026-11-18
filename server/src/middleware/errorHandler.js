import { HttpError } from '../errors.js'

/**
 * Централізований обробник помилок. Розпізнається Express за ЧОТИРЬМА аргументами (err, req, res, next).
 * Потрапляє сюди все, що кинули через throw (в Express 5 — і з async-обробників) або передали в next(err).
 *
 *   HttpError            → статус і повідомлення, які задав код (400, 404, 409 …)
 *   некоректний JSON     → 400
 *   завеликий запит      → 413
 *   усе інше (баг, збій) → 500 із загальним текстом; подробиці лише в лозі сервера
 */
export function createErrorHandler({ isProduction }) {
  // eslint-disable-next-line no-unused-vars
  return function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err)

    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message, ...err.extra })
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ message: 'Некоректний JSON у тілі запиту.' })
    }
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ message: 'Тіло запиту завелике.' })
    }

    console.error(`[ПОМИЛКА] ${req.method} ${req.originalUrl}`, err)
    const body = { message: 'Внутрішня помилка сервера. Спробуйте пізніше.' }
    if (!isProduction) body.detail = err.message // у розробці показуємо причину, у production — ні
    return res.status(500).json(body)
  }
}
