/**
 * store.js — «база даних» у вигляді одного JSON-файлу (модуль fs/promises).
 *
 * Структура файлу:
 * {
 *   "counters":  { "nextWorkspaceId": 7, "nextBookingId": 1006, "nextMessageId": 1 },
 *   "workspaces": [...], "bookings": [...], "messages": [...]
 * }
 *
 * Два важливі моменти:
 *  1. Запис АТОМАРНИЙ: спочатку пишемо у тимчасовий файл, потім перейменовуємо.
 *     Якщо сервер впаде посеред запису, основний файл не буде пошкоджено.
 *  2. Зміни йдуть ЧЕРЕЗ ЧЕРГУ (update): одночасні запити виконуються по одному.
 *     Без цього два клієнти могли б одночасно забронювати одне місце
 *     (обидва прочитали б «вільно» і обидва записали б бронювання).
 */
import fs from 'node:fs/promises'
import path from 'node:path'

export function createStore(filePath, createSeed) {
  let queue = Promise.resolve()

  async function readFile() {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  }

  async function writeFile(db) {
    const tmpPath = `${filePath}.tmp`
    await fs.writeFile(tmpPath, JSON.stringify(db, null, 2), 'utf8')
    await fs.rename(tmpPath, filePath)
  }

  return {
    /** Створює файл із початковими даними, якщо його ще немає. */
    async init() {
      try {
        await fs.access(filePath)
      } catch {
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await writeFile(await createSeed())
      }
    },

    /** Читання (без змін). */
    read: readFile,

    /**
     * Зміна даних. mutator(db) отримує копію бази, змінює її і може повернути результат.
     * Якщо mutator кидає помилку — нічого не записується.
     */
    update(mutator) {
      const run = queue.then(async () => {
        const db = await readFile()
        const result = await mutator(db)
        await writeFile(db)
        return result
      })
      queue = run.catch(() => {}) // помилка однієї операції не зупиняє чергу
      return run
    },

    /** Перезаписує базу початковими даними (для npm run reset-db). */
    async reset() {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await writeFile(await createSeed())
    },
  }
}
