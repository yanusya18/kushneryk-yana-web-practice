/**
 * POST /api/bookings — створення бронювання (обов'язкова функція варіанта).
 *
 * Що робить сервер:
 *  1. валідує дані (форма, дата не в минулому, повні години, робочий час, контакти);
 *  2. у межах однієї «транзакції» (черга store.update) перевіряє, що місце існує й вільне
 *     на цей проміжок: правило start1 < end2 && start2 < end1;
 *  3. сам рахує вартість (клієнту не довіряє) і зберігає бронювання;
 *  4. при конфлікті відповідає 409 — подвійне бронювання неможливе, навіть якщо два запити прийшли одночасно.
 */
import { Router } from 'express'
import { HttpError, validationError } from '../errors.js'
import { calcTotalPrice, findConflict } from '../utils/booking.js'
import { nowInTimezone } from '../utils/time.js'
import { validateBooking } from '../validation/booking.js'

export function bookingsRouter({ store, clock, config }) {
  const router = Router()

  router.post('/', async (req, res) => {
    const now = nowInTimezone(config.timezone, clock())
    const { value, errors } = validateBooking(req.body, now)
    if (errors.length > 0) throw validationError('Некоректні дані бронювання.', errors)

    const booking = await store.update((db) => {
      const workspace = db.workspaces.find((w) => w.id === value.workspaceId && w.isActive)
      if (!workspace) {
        throw validationError('Некоректні дані бронювання.', [{ field: 'workspaceId', message: 'Такого робочого місця не існує.' }])
      }

      const sameDay = db.bookings.filter(
        (b) => b.workspaceId === workspace.id && b.date === value.date && b.status === 'confirmed',
      )
      const conflict = findConflict(sameDay, value.startTime, value.endTime)
      if (conflict) {
        throw new HttpError(409, `Час уже заброньовано: ${conflict.startTime}–${conflict.endTime}.`, {
          conflict: { startTime: conflict.startTime, endTime: conflict.endTime },
        })
      }

      const created = {
        id: db.counters.nextBookingId++,
        ...value,
        totalPrice: calcTotalPrice(workspace.pricePerHour, value.startTime, value.endTime),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }
      db.bookings.push(created)
      return created
    })

    // У відповідь повертаємо лише потрібне для підтвердження (без email і телефону)
    const { id, workspaceId, date, startTime, endTime, customerName, totalPrice, status } = booking
    res.status(201).json({ id, workspaceId, date, startTime, endTime, customerName, totalPrice, status })
  })

  return router
}
