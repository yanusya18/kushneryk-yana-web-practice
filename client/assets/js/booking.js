/**
 * booking.js — чиста логіка бронювання (без DOM і без мережі).
 * Саме цей файл у ПР 9 зручно покривати автоматичними тестами.
 */

export const OPEN_HOUR = 8;   // коворкінг відкривається о 08:00
export const CLOSE_HOUR = 22; // і закривається о 22:00

/** «10:30» → 630 (хвилин від початку доби). Некоректний рядок → NaN. */
export function timeToMinutes(time) {
  const match = /^(\d{2}):(\d{2})$/.exec(time ?? '');
  if (!match) return NaN;
  const [hours, minutes] = [Number(match[1]), Number(match[2])];
  if (hours > 23 || minutes > 59) return NaN;
  return hours * 60 + minutes;
}

/**
 * Правило з ТЗ (п. 7.2): два проміжки конфліктують,
 * якщо start1 < end2 І start2 < end1.
 * Приклад: 10–13 і 13–15 НЕ конфліктують (13 < 13 — хибно).
 */
export function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

/** Повертає перше бронювання з `bookings`, що перетинається з [start, end), або null. */
export function findConflict(bookings, startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return (
    bookings.find(
      (b) =>
        b.status !== 'cancelled' &&
        overlaps(start, end, timeToMinutes(b.startTime), timeToMinutes(b.endTime))
    ) ?? null
  );
}

/** Тривалість у годинах (дробова, якщо раптом не повна година). */
export function durationHours(startTime, endTime) {
  return (timeToMinutes(endTime) - timeToMinutes(startTime)) / 60;
}

/** Вартість = ціна за годину × кількість годин. */
export function calcTotalPrice(pricePerHour, startTime, endTime) {
  return Math.round(pricePerHour * durationHours(startTime, endTime));
}

/** Чи вказано повну годину (хвилини = 00). */
export function isWholeHour(time) {
  return timeToMinutes(time) % 60 === 0;
}
