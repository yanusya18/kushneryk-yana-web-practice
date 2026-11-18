/** POST /api/contact — контактна форма: 201 при успіху, 400 з переліком помилок полів. */
import { Router } from 'express'
import { validationError } from '../errors.js'
import { validateContact } from '../validation/contact.js'

export function contactRouter({ store }) {
  const router = Router()

  router.post('/', async (req, res) => {
    const { value, errors } = validateContact(req.body)
    if (errors.length > 0) throw validationError('Некоректні дані форми.', errors)

    const saved = await store.update((db) => {
      const message = { id: db.counters.nextMessageId++, ...value, createdAt: new Date().toISOString() }
      db.messages.push(message)
      return message
    })
    res.status(201).json({ id: saved.id, message: 'Повідомлення отримано. Дякуємо!' })
  })

  return router
}
