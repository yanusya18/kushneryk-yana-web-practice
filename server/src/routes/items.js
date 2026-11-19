/**
 * /api/items — CRUD робочих місць + перегляд зайнятих годин.
 *
 *   GET    /api/items                    список (фільтри: q, type, maxPrice, includeInactive)
 *   GET    /api/items/:id                одне місце
 *   GET    /api/items/:id/availability   зайняті години на дату (?date=РРРР-ММ-ДД), без персональних даних
 *   POST   /api/items                    створити
 *   PUT    /api/items/:id                повністю замінити
 *   DELETE /api/items/:id                видалити
 *
 * POST, PUT і DELETE захищені токеном адміністратора, якщо в середовищі задано ADMIN_TOKEN (ПР 10).
 */
import { Router } from 'express'
import { HttpError, validationError } from '../errors.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { nowInTimezone } from '../utils/time.js'
import { parseId } from '../validation/common.js'
import { validateAvailabilityDate } from '../validation/booking.js'
import { TYPES, validateItem } from '../validation/item.js'

function requireId(raw) {
  const id = parseId(raw)
  if (id === null) throw new HttpError(400, 'Некоректний id: очікується додатне ціле число.')
  return id
}

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

export function itemsRouter({ store, clock, config }) {
  const router = Router()
  const adminOnly = requireAdmin(config) // без ADMIN_TOKEN у .env перевірка вимкнена

  // ---------- GET /api/items ----------
  router.get('/', async (req, res) => {
    const { q = '', type = '', maxPrice = '', includeInactive = '' } = req.query
    const errors = []
    if (type && !TYPES.includes(type)) errors.push({ field: 'type', message: `Тип має бути одним із: ${TYPES.join(', ')}.` })
    if (maxPrice !== '' && !(Number(maxPrice) >= 0)) errors.push({ field: 'maxPrice', message: 'maxPrice має бути числом.' })
    if (errors.length > 0) throw validationError('Некоректні параметри запиту.', errors)

    const { workspaces } = await store.read()
    const query = String(q).trim().toLowerCase()
    const items = workspaces.filter(
      (item) =>
        (includeInactive === 'true' || item.isActive) &&
        (!type || item.type === type) &&
        (maxPrice === '' || item.pricePerHour <= Number(maxPrice)) &&
        (!query || `${item.name} ${item.description}`.toLowerCase().includes(query)),
    )
    res.json(items)
  })

  // ---------- GET /api/items/:id ----------
  router.get('/:id', async (req, res) => {
    const id = requireId(req.params.id)
    const { workspaces } = await store.read()
    const item = workspaces.find((w) => w.id === id && w.isActive)
    if (!item) throw new HttpError(404, 'Робоче місце не знайдено.')
    res.json(item)
  })

  // ---------- GET /api/items/:id/availability?date= ----------
  router.get('/:id/availability', async (req, res) => {
    const id = requireId(req.params.id)
    const date = String(req.query.date ?? '')
    const errors = validateAvailabilityDate(date)
    if (errors.length > 0) throw validationError('Некоректні параметри запиту.', errors)

    const { workspaces, bookings } = await store.read()
    if (!workspaces.some((w) => w.id === id && w.isActive)) throw new HttpError(404, 'Робоче місце не знайдено.')

    // Віддаємо лише проміжки часу — без імен і контактів інших клієнтів
    const busy = bookings
      .filter((b) => b.workspaceId === id && b.date === date && b.status === 'confirmed')
      .map(({ id: bookingId, workspaceId, date: day, startTime, endTime, status }) => ({
        id: bookingId, workspaceId, date: day, startTime, endTime, status,
      }))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
    res.json(busy)
  })

  // ---------- POST /api/items ----------
  router.post('/', adminOnly, async (req, res) => {
    const { value, errors } = validateItem(req.body)
    if (errors.length > 0) throw validationError('Некоректні дані робочого місця.', errors)

    const created = await store.update((db) => {
      if (db.workspaces.some((w) => sameName(w.name, value.name))) {
        throw new HttpError(409, 'Робоче місце з такою назвою вже існує.')
      }
      const item = { id: db.counters.nextWorkspaceId++, ...value }
      db.workspaces.push(item)
      return item
    })
    res.status(201).location(`/api/items/${created.id}`).json(created)
  })

  // ---------- PUT /api/items/:id (повна заміна; ідемпотентний) ----------
  router.put('/:id', adminOnly, async (req, res) => {
    const id = requireId(req.params.id)
    const { value, errors } = validateItem(req.body)
    if (errors.length > 0) throw validationError('Некоректні дані робочого місця.', errors)

    const updated = await store.update((db) => {
      const index = db.workspaces.findIndex((w) => w.id === id)
      if (index === -1) throw new HttpError(404, 'Робоче місце не знайдено.')
      if (db.workspaces.some((w) => w.id !== id && sameName(w.name, value.name))) {
        throw new HttpError(409, 'Робоче місце з такою назвою вже існує.')
      }
      db.workspaces[index] = { id, ...value }
      return db.workspaces[index]
    })
    res.json(updated)
  })

  // ---------- DELETE /api/items/:id ----------
  router.delete('/:id', adminOnly, async (req, res) => {
    const id = requireId(req.params.id)
    const today = nowInTimezone(config.timezone, clock()).date

    await store.update((db) => {
      const index = db.workspaces.findIndex((w) => w.id === id)
      if (index === -1) throw new HttpError(404, 'Робоче місце не знайдено.')

      const hasUpcoming = db.bookings.some((b) => b.workspaceId === id && b.status === 'confirmed' && b.date >= today)
      if (hasUpcoming) {
        throw new HttpError(409, 'Не можна видалити місце, на яке є майбутні бронювання.')
      }
      db.workspaces.splice(index, 1)
    })
    res.status(204).end()
  })

  return router
}
