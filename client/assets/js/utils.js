/**
 * utils.js — невеликі допоміжні функції, спільні для всіх модулів.
 */

/** Екранує спецсимволи, щоб текст з даних не став HTML-розміткою (захист від XSS). */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * debounce: повертає обгортку, яка викликає fn лише через `delay` мс після
 * ОСТАННЬОГО виклику. Так пошук не спрацьовує на кожну натиснуту літеру.
 */
export function debounce(fn, delay = 300) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

/** Локальна дата у форматі YYYY-MM-DD (не UTC, щоб «сьогодні» було правильним уночі). */
export function toDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Додає дні до сьогодні й повертає YYYY-MM-DD. */
export function dateFromToday(dayOffset) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return toDateString(date);
}

/** «2026-11-20» → «20.11.2026» для показу користувачу. */
export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}

/** Підписи типів місць і обладнання (дані в JSON зберігають лише коди). */
export const TYPE_LABELS = {
  'open-space': 'Open space',
  'fixed-desk': 'Фіксоване місце',
  'private-office': 'Приватний кабінет',
  'meeting-room': 'Переговорна'
};

export const AMENITY_LABELS = {
  wifi: 'Швидкий Wi-Fi',
  socket: 'Розетки біля столу',
  chair: 'Ергономічне крісло',
  lamp: 'Настільна лампа',
  monitor: 'Зовнішній монітор',
  screen: 'Екран для презентацій',
  whiteboard: 'Маркерна дошка'
};

/** «1 особа» / «до 4 осіб». */
export function formatCapacity(capacity) {
  return capacity === 1 ? '1 особа' : `до ${capacity} осіб`;
}
