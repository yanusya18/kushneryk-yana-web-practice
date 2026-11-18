/**
 * time.js — «зараз» у часовому поясі коворкінгу.
 * Сервер може стояти в іншому поясі (наприклад, UTC на хостингу), тому «сьогодні»
 * і «поточний час» рахуємо за TIMEZONE із налаштувань, а не за часом сервера.
 */

/** @returns {{ date: string, minutes: number }}  date = YYYY-MM-DD, minutes = хвилин від початку доби */
export function nowInTimezone(timeZone, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const get = (type) => parts.find((part) => part.type === type).value
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/** Додає дні до дати YYYY-MM-DD (використовується лише для початкових демо-даних). */
export function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d + days))
  return date.toISOString().slice(0, 10)
}
