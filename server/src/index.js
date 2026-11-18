/** Точка входу: готує «базу» і запускає HTTP-сервер. Запуск: npm start / npm run dev */
import { createApp } from './app.js'
import { config } from './config.js'
import { createSeed } from './seed.js'
import { createStore } from './store.js'

const store = createStore(config.dataFile, createSeed)
await store.init()

const app = createApp({ store, config })

app.listen(config.port, () => {
  console.log(`API запущено: http://localhost:${config.port}/api/health`)
  console.log(`Дозволені клієнти (CORS): ${config.corsOrigins.join(', ')}`)
  console.log(`Дані: ${config.dataFile}`)
})
