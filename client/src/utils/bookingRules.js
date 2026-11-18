/**
 * bookingRules.js — правила валідації форми бронювання.
 * Кожне правило: (значення поля, усі значення) => текст помилки або ''.
 * Функція чиста: «зайняті години» (busy), «сьогодні» й «зараз» передаються аргументами,
 * тому її легко тестувати.
 */
import { OPEN_HOUR, CLOSE_HOUR, findConflict, isWholeHour, timeToMinutes } from './booking.js'
import { validateConsent, validateEmail, validateName, validatePhone } from './validators.js'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function buildBookingRules({ busy, today, now = new Date() }) {
  return {
    date: (value) => {
      if (!value) return 'Оберіть дату бронювання.'
      if (!DATE_PATTERN.test(value)) return 'Вкажіть дату у форматі ДД.ММ.РРРР.'
      if (value < today) return 'Не можна бронювати місце на минулу дату.' // рядки YYYY-MM-DD порівнюються як дати
      return ''
    },

    start_time: (value, values) => {
      if (!value) return 'Вкажіть час початку.'
      if (!isWholeHour(value)) return 'Бронювання — на повні години (наприклад, 10:00).'
      const hour = timeToMinutes(value) / 60
      if (hour < OPEN_HOUR || hour > CLOSE_HOUR - 1) {
        return `Початок — з ${String(OPEN_HOUR).padStart(2, '0')}:00 до ${CLOSE_HOUR - 1}:00.`
      }
      if (values.date === today && timeToMinutes(value) <= now.getHours() * 60 + now.getMinutes()) {
        return 'Цей час сьогодні вже минув. Оберіть пізніший.'
      }
      return ''
    },

    end_time: (value, values) => {
      if (!value) return 'Вкажіть час завершення.'
      if (!isWholeHour(value)) return 'Бронювання — на повні години (наприклад, 13:00).'
      const hour = timeToMinutes(value) / 60
      if (hour < OPEN_HOUR + 1 || hour > CLOSE_HOUR) {
        return `Завершення — з ${OPEN_HOUR + 1}:00 до ${CLOSE_HOUR}:00.`
      }
      if (values.start_time && timeToMinutes(value) <= timeToMinutes(values.start_time)) {
        return 'Час завершення має бути пізніше за час початку.'
      }
      // Перевірка доступності: перетин із наявними бронюваннями на цю дату
      if (values.start_time) {
        const conflict = findConflict(busy, values.start_time, value)
        if (conflict) return `Місце зайняте з ${conflict.startTime} до ${conflict.endTime}. Оберіть інший час.`
      }
      return ''
    },

    name: validateName,
    email: validateEmail,
    phone: (value) => validatePhone(value, { required: true }),
    consent: validateConsent,
  }
}
