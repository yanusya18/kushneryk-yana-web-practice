/**
 * app.js — складання Express-застосунку. Порядок middleware ВАЖЛИВИЙ:
 *   1. логування → 2. CORS → 3. розбір JSON → 4. маршрути → 5. 404 → 6. обробник помилок
 * Функція createApp приймає залежності (store, config, clock), тому застосунок легко тестувати.
 */
import cors from 'cors'
import express from 'express'
import { createErrorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { requestLogger } from './middleware/requestLogger.js'
import { bookingsRouter } from './routes/bookings.js'
import { contactRouter } from './routes/contact.js'
import { itemsRouter } from './routes/items.js'

export function createApp({ store, config, clock = () => new Date() }) {
  const app = express()
  const deps = { store, config, clock }

  app.disable('x-powered-by') // не розкриваємо технології сервера

  app.use(requestLogger)

  // CORS: браузер дозволяє сторінці з одного походження (localhost:5173) читати відповіді
  // іншого (localhost:3001) лише якщо сервер надішле заголовок Access-Control-Allow-Origin.
  app.use(cors({ origin: config.corsOrigins }))

  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/api/items', itemsRouter(deps))
  app.use('/api/bookings', bookingsRouter(deps))
  app.use('/api/contact', contactRouter(deps))

  app.use(notFound)
  app.use(createErrorHandler(config))

  return app
}
