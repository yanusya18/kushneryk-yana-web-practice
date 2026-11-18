/**
 * Валідація робочого місця (POST /api/items, PUT /api/items/:id).
 * Повертає { value, errors }: якщо errors порожній — value вже очищене й доповнене значеннями за замовчуванням.
 */
import { createErrorCollector, isPlainObject } from './common.js'

export const TYPES = ['open-space', 'fixed-desk', 'private-office', 'meeting-room']
export const AMENITIES = ['wifi', 'socket', 'chair', 'lamp', 'monitor', 'screen', 'whiteboard']

// Зображення, які є у проєкті (client/assets/images/). Власні фото клієнт не завантажує.
export const IMAGES = [
  'workspace-a1', 'workspace-a2', 'workspace-b1', 'workspace-b2', 'workspace-c1', 'workspace-m1', 'hero',
]
const DEFAULT_IMAGE_BY_TYPE = {
  'open-space': 'workspace-a1',
  'fixed-desk': 'workspace-b1',
  'private-office': 'workspace-c1',
  'meeting-room': 'workspace-m1',
}
const TYPE_LABELS = {
  'open-space': 'Open space',
  'fixed-desk': 'Фіксоване місце',
  'private-office': 'Приватний кабінет',
  'meeting-room': 'Переговорна',
}

export function validateItem(body) {
  const { errors, add } = createErrorCollector()
  if (!isPlainObject(body)) {
    add('body', 'Тіло запиту має бути JSON-об’єктом.')
    return { value: null, errors }
  }

  // --- name ---
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) add('name', 'Вкажіть назву місця.')
  else if (name.length < 2 || name.length > 80) add('name', 'Назва має містити від 2 до 80 символів.')

  // --- type ---
  if (!TYPES.includes(body.type)) add('type', `Тип має бути одним із: ${TYPES.join(', ')}.`)

  // --- description ---
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  if (!description) add('description', 'Вкажіть опис.')
  else if (description.length < 10 || description.length > 1000) add('description', 'Опис має містити від 10 до 1000 символів.')

  // --- pricePerHour, capacity ---
  if (!Number.isInteger(body.pricePerHour) || body.pricePerHour < 1 || body.pricePerHour > 10000) {
    add('pricePerHour', 'Ціна за годину — ціле число від 1 до 10000.')
  }
  if (!Number.isInteger(body.capacity) || body.capacity < 1 || body.capacity > 100) {
    add('capacity', 'Місткість — ціле число від 1 до 100.')
  }

  // --- amenities (необов'язкове) ---
  let amenities = []
  if (body.amenities !== undefined) {
    if (!Array.isArray(body.amenities) || body.amenities.some((code) => !AMENITIES.includes(code))) {
      add('amenities', `Обладнання — масив значень із: ${AMENITIES.join(', ')}.`)
    } else {
      amenities = [...new Set(body.amenities)]
    }
  }

  // --- image, imageAlt, isActive (необов'язкові) ---
  if (body.image !== undefined && !IMAGES.includes(body.image)) {
    add('image', `Зображення має бути одним із: ${IMAGES.join(', ')}.`)
  }
  let imageAlt = typeof body.imageAlt === 'string' ? body.imageAlt.trim() : ''
  if (imageAlt.length > 200) add('imageAlt', 'Опис зображення не може бути довшим за 200 символів.')
  if (body.isActive !== undefined && typeof body.isActive !== 'boolean') add('isActive', 'isActive має бути true або false.')

  if (errors.length > 0) return { value: null, errors }

  imageAlt = imageAlt || `${name} — ${TYPE_LABELS[body.type]}`
  return {
    errors,
    value: {
      name,
      type: body.type,
      description,
      pricePerHour: body.pricePerHour,
      capacity: body.capacity,
      amenities,
      image: body.image ?? DEFAULT_IMAGE_BY_TYPE[body.type],
      imageAlt,
      isActive: body.isActive ?? true,
    },
  }
}
