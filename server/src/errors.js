/**
 * HttpError — помилка з HTTP-статусом. Її можна кинути (throw) з будь-якого місця
 * обробника: централізований errorHandler перетворить її на JSON-відповідь.
 */
export class HttpError extends Error {
  /**
   * @param {number} status  HTTP-статус (400, 404, 409 …)
   * @param {string} message повідомлення для користувача
   * @param {object} [extra] додаткові поля відповіді (errors, conflict)
   */
  constructor(status, message, extra = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.extra = extra
  }
}

/** 400 зі списком помилок полів: [{ field, message }] */
export function validationError(message, errors) {
  return new HttpError(400, message, { errors })
}
