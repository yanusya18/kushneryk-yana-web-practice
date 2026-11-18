/** Валідація контактної форми (POST /api/contact). */
import { createErrorCollector, EMAIL_PATTERN, isPlainObject, PHONE_PATTERN } from './common.js'

export const TOPICS = ['tour', 'booking', 'team', 'other']
const MIN_MESSAGE = 10
const MAX_MESSAGE = 1000

export function validateContact(body) {
  const { errors, add } = createErrorCollector()
  if (!isPlainObject(body)) {
    add('body', 'Тіло запиту має бути JSON-об’єктом.')
    return { value: null, errors }
  }

  const str = (field) => (typeof body[field] === 'string' ? body[field].trim() : '')

  const name = str('name')
  if (name.length < 2 || name.length > 60) add('name', 'Ім’я має містити від 2 до 60 символів.')

  const email = str('email')
  if (!EMAIL_PATTERN.test(email)) add('email', 'Вкажіть коректний email.')

  const phone = str('phone') // необов'язковий
  if (phone && !PHONE_PATTERN.test(phone)) add('phone', 'Телефон має бути у форматі +380XXXXXXXXX.')

  if (!TOPICS.includes(body.topic)) add('topic', `Тема має бути однією з: ${TOPICS.join(', ')}.`)

  const message = str('message')
  if (message.length < MIN_MESSAGE || message.length > MAX_MESSAGE) {
    add('message', `Повідомлення має містити від ${MIN_MESSAGE} до ${MAX_MESSAGE} символів.`)
  }

  if (body.consent !== true) add('consent', 'Потрібна згода на обробку персональних даних.')

  if (errors.length > 0) return { value: null, errors }
  return { errors, value: { name, email, phone, topic: body.topic, message } }
}
