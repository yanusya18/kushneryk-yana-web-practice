/**
 * reset-db.js — повертає базу до початкового стану (6 місць + демо-бронювання).
 * Запуск: npm run reset-db
 */
import { config } from '../src/config.js'
import { createSeed } from '../src/seed.js'
import { createStore } from '../src/store.js'

const store = createStore(config.dataFile, createSeed)
await store.reset()
console.log(`База даних скинута: ${config.dataFile}`)
