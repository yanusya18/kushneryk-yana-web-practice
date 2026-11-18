/**
 * api.js — єдине місце, де застосунок працює з даними.
 *
 * ПР 7: дані беремо з локальних JSON-файлів (client/assets/data/) через fetch,
 *       а бронювання користувача зберігаємо в localStorage.
 * ПР 8: тут з'явиться fetch до власного Express-API (VITE_API_URL).
 *       Компоненти й хуки не зміняться, бо вони викликають лише ці функції.
 *
 * Демо-режими станів (для захисту та скриншотів), параметр у адресі:
 *   ?demo=loading — довге завантаження (3 с)
 *   ?demo=error   — імітація помилки мережі
 *   ?demo=empty   — порожній список
 */
import { dateFromToday } from '../utils/format.js'
import { findConflict } from '../utils/booking.js'

// ?url: Vite повертає адресу файлу (в розробці та у збірці), а fetch завантажує його
import workspacesUrl from '../../assets/data/workspaces.json?url'
import bookingsUrl from '../../assets/data/bookings.json?url'

const STORAGE_KEY = 'coworking:bookings'
const MESSAGES_KEY = 'coworking:contact-messages'

const getDemoMode = () => new URLSearchParams(window.location.search).get('demo')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Універсальний запит: fetch + async/await.
 * fetch повертає Promise<Response> і НЕ кидає помилку на 404/500 —
 * тому вручну перевіряємо response.ok.
 */
async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Сервер відповів з помилкою ${response.status}`)
  }
  return response.json()
}

/** Кеш Promise: JSON завантажується один раз, а паралельні виклики чекають на один запит. */
const cache = new Map()
function loadCached(key, url) {
  if (!cache.has(key)) {
    cache.set(
      key,
      fetchJson(url).catch((error) => {
        cache.delete(key) // невдалий запит не кешуємо
        throw error
      }),
    )
  }
  return cache.get(key)
}

async function applyDemoMode() {
  const demo = getDemoMode()
  if (demo === 'loading') await sleep(3000)
  if (demo === 'error') {
    await sleep(600)
    throw new Error('Не вдалося з’єднатися із сервером (демо-режим).')
  }
}

// ---------------------------------------------------------------------------
// Робочі місця
// ---------------------------------------------------------------------------

/** Усі активні робочі місця. */
export async function getWorkspaces() {
  await applyDemoMode()
  if (getDemoMode() === 'empty') return []
  const list = await loadCached('workspaces', workspacesUrl)
  return list.filter((item) => item.isActive)
}

/** Одне місце за id або null, якщо такого немає. */
export async function getWorkspaceById(id) {
  await applyDemoMode()
  const list = await loadCached('workspaces', workspacesUrl)
  return list.find((item) => item.id === Number(id) && item.isActive) ?? null
}

// ---------------------------------------------------------------------------
// Бронювання
// ---------------------------------------------------------------------------

function readStoredBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return [] // localStorage недоступний або JSON пошкоджено
  }
}

/** Демо-бронювання: дати задані зміщенням від сьогодні (dayOffset), щоб не «застарівали». */
async function getSeedBookings() {
  const seeds = await loadCached('bookings', bookingsUrl)
  return seeds.map(({ dayOffset, ...rest }) => ({ ...rest, date: dateFromToday(dayOffset) }))
}

/** Підтверджені бронювання місця на дату (демо + збережені користувачем). */
export async function getBookingsFor(workspaceId, date) {
  const all = [...(await getSeedBookings()), ...readStoredBookings()]
  return all
    .filter((b) => b.workspaceId === Number(workspaceId) && b.date === date && b.status === 'confirmed')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

/**
 * Створює бронювання. Доступність перевіряється ще раз прямо перед записом.
 * Кидає Error з code === 'CONFLICT', якщо проміжок зайнятий.
 */
export async function createBooking(data) {
  const existing = await getBookingsFor(data.workspaceId, data.date)
  const conflict = findConflict(existing, data.startTime, data.endTime)
  if (conflict) {
    const error = new Error(`Час уже заброньовано: ${conflict.startTime}–${conflict.endTime}.`)
    error.code = 'CONFLICT'
    throw error
  }

  const stored = readStoredBookings()
  // Номер має бути унікальним серед УСІХ бронювань (демо + збережені), а не лише цього місця й дати
  const seeds = await getSeedBookings()
  const nextId = Math.max(1000, ...seeds.map((b) => b.id), ...stored.map((b) => b.id)) + 1
  const booking = { ...data, id: nextId, status: 'confirmed', createdAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, booking]))
  return booking
}

/** Видаляє лише бронювання, створені користувачем у цьому браузері. */
export function clearStoredBookings() {
  localStorage.removeItem(STORAGE_KEY)
}

// ---------------------------------------------------------------------------
// Контактна форма (до ПР 8 повідомлення зберігаються лише локально)
// ---------------------------------------------------------------------------

export async function sendContactMessage(data) {
  let messages = []
  try {
    messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) ?? '[]')
  } catch {
    messages = []
  }
  const message = { ...data, id: Date.now(), createdAt: new Date().toISOString() }
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([...messages, message]))
  return message
}
