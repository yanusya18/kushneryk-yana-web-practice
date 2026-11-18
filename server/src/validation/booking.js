/**
 * Валідація бронювання (POST /api/bookings). Перевіряє форму даних і правила часу;
 * наявність місця й перетин із іншими бронюваннями перевіряє сам маршрут (потрібен доступ до бази).
 */
import { CLOSE_HOUR, OPEN_HOUR, timeToMinutes } from '../utils/booking.js'
import { createErrorCollector, EMAIL_PATTERN, isPlainObject, isValidDate, PHONE_PATTERN } from './common.js'

/**
 * @param {object} body
 * @param {{ date: string, minutes: number }} now — «сьогодні» й «зараз» у часовому поясі коворкінгу
 */
export function validateBooking(body, now) {
  const { errors, add } = createErrorCollector()
  if (!isPlainObject(body)) {
    add('body', 'Тіло запиту має бути JSON-об’єктом.')
    return { value: null, errors }
  }

  const workspaceId = body.workspaceId
  if (!Number.isInteger(workspaceId) || workspaceId < 1) add('workspaceId', 'Вкажіть коректний workspaceId.')

  // --- дата ---
  const { date, startTime, endTime } = body
  if (!isValidDate(date)) add('date', 'Вкажіть дату у форматі РРРР-ММ-ДД.')
  else if (date < now.date) add('date', 'Не можна бронювати місце на минулу дату.')

  // --- час ---
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  if (Number.isNaN(start) || start % 60 !== 0) add('startTime', 'Час початку — на повну годину, формат ГГ:ХХ.')
  else if (start / 60 < OPEN_HOUR || start / 60 > CLOSE_HOUR - 1) add('startTime', `Початок — з ${OPEN_HOUR}:00 до ${CLOSE_HOUR - 1}:00.`)
  else if (date === now.date && start <= now.minutes) add('startTime', 'Цей час сьогодні вже минув.')

  if (Number.isNaN(end) || end % 60 !== 0) add('endTime', 'Час завершення — на повну годину, формат ГГ:ХХ.')
  else if (end / 60 < OPEN_HOUR + 1 || end / 60 > CLOSE_HOUR) add('endTime', `Завершення — з ${OPEN_HOUR + 1}:00 до ${CLOSE_HOUR}:00.`)
  else if (!Number.isNaN(start) && end <= start) add('endTime', 'Час завершення має бути пізніше за час початку.')

  // --- клієнт ---
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : ''
  if (customerName.length < 2 || customerName.length > 60) add('customerName', 'Ім’я має містити від 2 до 60 символів.')

  const customerEmail = typeof body.customerEmail === 'string' ? body.customerEmail.trim() : ''
  if (!EMAIL_PATTERN.test(customerEmail)) add('customerEmail', 'Вкажіть коректний email.')

  const customerPhone = typeof body.customerPhone === 'string' ? body.customerPhone.trim() : ''
  if (!PHONE_PATTERN.test(customerPhone)) add('customerPhone', 'Телефон має бути у форматі +380XXXXXXXXX.')

  if (body.consent !== true) add('consent', 'Потрібна згода на обробку персональних даних.')

  if (errors.length > 0) return { value: null, errors }
  return { errors, value: { workspaceId, date, startTime, endTime, customerName, customerEmail, customerPhone } }
}

/** Валідація параметра ?date= для перегляду зайнятих годин. */
export function validateAvailabilityDate(date) {
  return isValidDate(date) ? [] : [{ field: 'date', message: 'Вкажіть параметр date у форматі РРРР-ММ-ДД.' }]
}
