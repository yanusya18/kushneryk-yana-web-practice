/**
 * booking.js — чиста логіка бронювання (той самий алгоритм, що й на клієнті).
 * Сервер не довіряє клієнту: усі перевірки й підрахунок вартості виконуються тут.
 */

export const OPEN_HOUR = 8 // коворкінг відкривається о 08:00
export const CLOSE_HOUR = 22 // і закривається о 22:00

/** «10:30» → 630 (хвилин від початку доби). Некоректний рядок → NaN. */
export function timeToMinutes(time) {
  const match = /^(\d{2}):(\d{2})$/.exec(time ?? '')
  if (!match) return NaN
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return NaN
  return hours * 60 + minutes
}

/**
 * Правило з ТЗ (п. 7.2): два проміжки конфліктують, якщо start1 < end2 І start2 < end1.
 * 10–13 і 13–15 НЕ конфліктують (13 < 13 — хибно).
 */
export function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

/** Перше бронювання з `bookings`, що перетинається з [startTime, endTime), або null. */
export function findConflict(bookings, startTime, endTime) {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)
  return (
    bookings.find(
      (b) =>
        b.status !== 'cancelled' &&
        overlaps(start, end, timeToMinutes(b.startTime), timeToMinutes(b.endTime)),
    ) ?? null
  )
}

/** Вартість = ціна за годину × кількість годин. */
export function calcTotalPrice(pricePerHour, startTime, endTime) {
  const hours = (timeToMinutes(endTime) - timeToMinutes(startTime)) / 60
  return Math.round(pricePerHour * hours)
}
