/**
 * workspaceRules.js — правила форми додавання робочого місця (ті самі обмеження, що й на сервері).
 * Клієнтська валідація зручна для користувача, але остаточну перевірку робить сервер.
 */
import { AMENITY_LABELS } from './format.js'

export const AMENITY_CODES = Object.keys(AMENITY_LABELS)

export const WORKSPACE_RULES = {
  name: (value) => {
    const name = value.trim()
    if (!name) return 'Вкажіть назву місця.'
    if (name.length < 2 || name.length > 80) return 'Назва має містити від 2 до 80 символів.'
    return ''
  },
  type: (value) => (value ? '' : 'Оберіть тип місця.'),
  pricePerHour: (value) => {
    const price = Number(value)
    if (value.trim() === '' || !Number.isInteger(price) || price < 1 || price > 10000) {
      return 'Ціна за годину — ціле число від 1 до 10000.'
    }
    return ''
  },
  capacity: (value) => {
    const capacity = Number(value)
    if (value.trim() === '' || !Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
      return 'Місткість — ціле число від 1 до 100.'
    }
    return ''
  },
  description: (value) => {
    const text = value.trim()
    if (!text) return 'Вкажіть опис.'
    if (text.length < 10 || text.length > 1000) return 'Опис має містити від 10 до 1000 символів.'
    return ''
  },
}

/** Значення форми (рядки) → тіло запиту POST /api/items (числа, масив обладнання). */
export function buildWorkspacePayload(values) {
  return {
    name: values.name.trim(),
    type: values.type,
    description: values.description.trim(),
    pricePerHour: Number(values.pricePerHour),
    capacity: Number(values.capacity),
    amenities: AMENITY_CODES.filter((code) => values[`amenity_${code}`]),
  }
}
