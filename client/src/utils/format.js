/** Допоміжні функції для дат і підписів (дані в JSON зберігають лише коди). */

/** Локальна дата у форматі YYYY-MM-DD (не UTC, щоб «сьогодні» було правильним уночі). */
export function toDateString(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** «2026-11-20» → «20.11.2026» для показу користувачу. */
export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-')
  return `${d}.${m}.${y}`
}

export const TYPE_LABELS = {
  'open-space': 'Open space',
  'fixed-desk': 'Фіксоване місце',
  'private-office': 'Приватний кабінет',
  'meeting-room': 'Переговорна',
}

export const AMENITY_LABELS = {
  wifi: 'Швидкий Wi-Fi',
  socket: 'Розетки біля столу',
  chair: 'Ергономічне крісло',
  lamp: 'Настільна лампа',
  monitor: 'Зовнішній монітор',
  screen: 'Екран для презентацій',
  whiteboard: 'Маркерна дошка',
}

/** «1 особа» / «до 4 осіб». */
export function formatCapacity(capacity) {
  return capacity === 1 ? '1 особа' : `до ${capacity} осіб`
}
